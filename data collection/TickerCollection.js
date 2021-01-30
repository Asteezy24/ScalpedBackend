const ccxt = require('ccxt')
const utils = require('../helpers/utils')
const Indicators = require('../indicators/indicators')
const schedule = require('node-schedule')
const log = require('../helpers/utils').log
const bittrexInstance = new (ccxt)['bittrex']({
  enableRateLimit: true
})
const notify = require('../helpers/notify')
const AlertController = require('../controllers/AlertController')
const Stock = require('../mongoose/Stock')
const Strategy = require('../mongoose/Strategy')
const User = require('../mongoose/User')

// Local Data Storage
// keeping track of old guppy values, etc.
const technicalModels = []

// -----------------------------------------------------------------------------
// hourly job
schedule.scheduleJob('37 * * * *', async function () {
  Stock.find({}).then(async (stocks) => {
    for (const index in stocks) {
      let symbol = stocks[index].name
      await scheduledCollection(symbol, bittrexInstance, '1h').then(() => {
        log('Finished analysis of ' + symbol)
      })
    }
  })
  // see if we have yield alerts
  await seeIfYieldTriggered()
  // update current stock prices
  await Stock.find({}, async (err, stocks) => {
    if (err) { return }
    for (let i = 0; i < stocks.length; i++) {
      let ticker = await bittrexInstance.fetchTicker(stocks[i].name)
      stocks[i].price = ticker.last
      stocks[i].save((err) => {
        if (err) {
          log('error saving stock ' + err)
        }
      })
    }
  }).then(() => {
    log('Stock Prices updated')
  })
})
// daily job
schedule.scheduleJob('0 45 * * *', async function () {
  Stock.find({}).then(async (stocks) => {
    for (const index in stocks) {
      let symbol = stocks[index].name
      await scheduledCollection(symbol, bittrexInstance, '1d')
    }
  })
  log('Daily Ticker Data Collected')
})

// -----------------------------------------------------------------------------
// On server startup

let loadExchange = async function (exchange) {
  await exchange.loadMarkets()
  let symbolArray = exchange.symbols.filter(symbol => (utils.bittrexPairs.includes(symbol)) && symbol.includes('BTC'))
  return symbolArray
}

let getAllTickers = new Promise((resolve, reject) => {
  // instantiate all exchanges
  loadExchange(bittrexInstance).then(async (symbolsArr) => {
    log('Gathering all trading pairs to be used.')
    let stockNames = []
    for (let i = 0; i < symbolsArr.length; i++) {
      const symbolForExchange = symbolsArr[i]
      if (symbolForExchange.includes('BTC')) {
        let ticker = await bittrexInstance.fetchTicker(symbolForExchange)
        await Stock.findOne({ name: symbolForExchange }).then((stockFound) => {
          if (stockFound === null) {
            const stock = new Stock({
              name: symbolForExchange,
              price: ticker.last
            })
            stock.save((err) => {
              if (err) {
                log('error saving new stock ' + err)
              }
            })
          }
          stockNames.push(symbolForExchange)
        })
      }
    }
    resolve(stockNames)
  })
})

async function collectData () {
  await getAllTickers.then(async (stockNames) => {
    for (const index in stockNames) {
      await getInitialCandlesAndIndicators(stockNames[index], bittrexInstance)
    }
  }).then(() => {
    log('Initial Ticker Data Collected')
  })
}

// -----------------------------------------------------------------------------
// Scheduled Collection
async function scheduledCollection (symbol, instance, timeframe) {
  await seeIfGuppyTriggered(symbol, instance, timeframe)
}

async function seeIfGuppyTriggered (symbol, instance, timeframe) {
  let timeframeIndex = ''
  if (timeframe === '1h') {
    timeframeIndex = 'hourly'
  } else if (timeframe === '1d') {
    timeframeIndex = 'daily'
  }
  let candles = await fetchCandles(instance, symbol, timeframe)
  let guppyUpdate = { guppy: Indicators.GMMA(candles.arrayOfClosePrices) }
  const analysisOfData = {
    exchange: instance,
    ticker: symbol
  }

  analysisOfData[timeframeIndex] = guppyUpdate

  // const old
  const oldData = technicalModels.find(element => element.ticker === symbol)
  const oldDataJson = oldData[timeframeIndex]
  const newDataJson = analysisOfData[timeframeIndex]
  const lastPrice = candles.arrayOfClosePrices[candles.arrayOfClosePrices.length - 1]

  for (const key in newDataJson) {
    if (key === 'guppy') {
      if (newDataJson[key] !== oldDataJson[key]) {
        try {
          const update = {}
          update[key] = newDataJson[key]
          oldData[timeframeIndex] = update
        } catch (e) {
          log('error updating the models')
        }
      }
    }
  }

  const signal = newDataJson['guppy']

  // if we have a new guppy signal
  if (oldDataJson['guppy'] !== newDataJson['guppy'] && signal !== 'neutral') {
    // alert saving to DB
    AlertController.saveMovingAverageAlert('Moving Average', signal, symbol, timeframe)

    // notifications
    notify.blastToAllChannels('alex', instance.id, signal, symbol, lastPrice, timeframe)
  }
}

async function seeIfYieldTriggered () {
  await Strategy.find({ identifier: 'Yield' }).then((strategies) => {
    for (let i = 0; i < strategies.length; i++) {
      let listOfUnderlyings = strategies[i].underlyings

      // determine if using watchlist, or specific underlying
      if (strategies[i].isFullWatchlist) {
        User.findOne({ username: 'Alex' }).then((user) => {
          return user.watchlist
        }).then((watchlist) => {
          // for each stock in underlying
          for (let j = 0; j < listOfUnderlyings.length; j++) {
            Stock.findOne({ name: listOfUnderlyings[j] }).then((stock) => {
              let watchlistItemMatch = watchlist.filter(item => { return item['name'] === listOfUnderlyings[j] })
              let priceWhenAdded = watchlistItemMatch[0].priceWhenAdded
              let yieldBuyPrice = stock.price - (priceWhenAdded * (strategies[i].yieldBuyPercent / 100))

              if (stock.price < yieldBuyPrice) {
                // alert saving to DB
                AlertController.saveYieldAlert('Yield', 'Buy', stock.name)
                // notifications
                // notify.blastToAllChannels('alex', instance.id, signal, symbol, '', timeframe)
              }
            })
          }
        })
      } else {
        Stock.findOne({ name: strategies[i].underlyings[0] }).then((stock) => {
          let priceWhenAdded = strategies[i].priceWhenAdded
          let yieldBuyPrice = stock.price - (priceWhenAdded * (strategies[i].yieldBuyPercent / 100))

          if (stock.price < yieldBuyPrice) {
            // alert saving to DB
            AlertController.saveYieldAlert('Yield', 'Buy', stock.name)
            // notifications
            // notify.blastToAllChannels('alex', instance.id, signal, symbol, '', timeframe)
          }
        })
      }
    }
  })
}

// -----------------------------------------------------------------------------
// Data Fetching utilities
async function fetchCandles (exchangeInstance, symbol, timeframe) {
  let arrayOfClosePrices = []
  let arrayOfOpenPrices = []
  let arrayOfHighPrices = []
  let arrayOfLowPrices = []
  let arrayOfVolume = []

  let ohlcv = await exchangeInstance.fetchOHLCV(symbol, timeframe)

  if (ohlcv === undefined) {
    log('We got an empty ccxt response')
    return
  }

  for (let i = 0; i < ohlcv.length; i++) {
    arrayOfOpenPrices.push(ohlcv[i][1])
    arrayOfHighPrices.push(ohlcv[i][2])
    arrayOfLowPrices.push(ohlcv[i][3])
    arrayOfClosePrices.push(ohlcv[i][4])
    arrayOfVolume.push(ohlcv[i][5])
  }
  // we want to remove the last item, it is the current forming candle
  arrayOfHighPrices.splice(-1, 1)
  arrayOfLowPrices.splice(-1, 1)
  arrayOfClosePrices.splice(-1, 1)
  arrayOfOpenPrices.splice(-1, 1)

  return {
    arrayOfHighPrices: arrayOfHighPrices,
    arrayOfLowPrices: arrayOfLowPrices,
    arrayOfClosePrices: arrayOfClosePrices,
    arrayOfOpenPrices: arrayOfOpenPrices
  }
}

async function getInitialCandlesAndIndicators (symbol, instance) {
  let hourlyCandles = await fetchCandles(instance, symbol, '1h')
  let dailyCandles = await fetchCandles(instance, symbol, '1d')
  const indicatorDataModel = {
    exchange: instance.id,
    ticker: symbol,
    hourly: {
      guppy: Indicators.GMMA(hourlyCandles.arrayOfClosePrices)
    },
    daily: {
      guppy: Indicators.GMMA(dailyCandles.arrayOfClosePrices)
    }
  }
  technicalModels.push(indicatorDataModel)
}

module.exports = {
  collectData: collectData,
  bittrexInstance: bittrexInstance
}
