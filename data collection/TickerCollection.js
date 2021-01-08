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

// User Preferences
let finalMarketTickersAndSymbols = []
let tickerEndpoints = []
const technicalModels = []
const fullListOfSymbols = []

// -----------------------------------------------------------------------------

let loadExchange = async function (exchange) {
  try {
    await exchange.loadMarkets()
    let symbolArray = exchange.symbols.filter(symbol => (utils.bittrexPairs.includes(symbol)) && symbol.includes('BTC'))
    finalMarketTickersAndSymbols.push({
      exchange: exchange.id,
      symbolsArray: symbolArray
    })
  } catch (e) {
    if (e instanceof ccxt.DDoSProtection) {
      log(exchange.id + ' [DDoS Protection] ' + e.message)
    } else if (e instanceof ccxt.RequestTimeout) {
      log(exchange.id + ' [Request Timeout] ' + e.message)
    } else if (e instanceof ccxt.AuthenticationError) {
      log(exchange.id + ' [Authentication Error] ' + e.message)
    } else if (e instanceof ccxt.ExchangeNotAvailable) {
      log(exchange.id + ' [Exchange Not Available] ' + e.message)
    } else if (e instanceof ccxt.ExchangeError) {
      log(exchange.id + ' [Exchange Error] ' + e.message)
    } else if (e instanceof ccxt.NetworkError) {
      log(exchange.id + ' [Network Error] ' + e.message)
    } else {
      throw e
    }
  }
}

// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------

async function getInitialCandlesAndIndicators (symbol, instance) {
  let hourlyCandles = await fetchCandles(instance, symbol, '1h')
  let dailyCandles = await fetchCandles(instance, symbol, '1d')
  const cryptoModel = {
    exchange: instance.id,
    ticker: symbol,
    hourly: {
      guppy: Indicators.GMMA(hourlyCandles.arrayOfClosePrices)
    },
    daily: {
      guppy: Indicators.GMMA(dailyCandles.arrayOfClosePrices)
    }
  }
  technicalModels.push(cryptoModel)
}

// -----------------------------------------------------------------------------

async function getAllTickers () {
  // instantiate all exchanges
  await loadExchange(bittrexInstance)
  log('Gathering all trading pairs to be used.')
  for (const exchangeIndex in finalMarketTickersAndSymbols) {
    for (let i = 0; i < finalMarketTickersAndSymbols[exchangeIndex].symbolsArray.length; i++) {
      const symbolForExchange = finalMarketTickersAndSymbols[exchangeIndex].symbolsArray[i]
      if (symbolForExchange.includes('BTC')) {
        let item = {
          exchange: finalMarketTickersAndSymbols[exchangeIndex].exchange,
          ticker: symbolForExchange
        }

        let ticker = await bittrexInstance.fetchTicker(symbolForExchange)

        Stock.findOne({ name: symbolForExchange }, (err, stock) => {
          if (err) return
          if (stock === null) {
            const stock = new Stock({
              name: symbolForExchange,
              price: ticker.last
            })
            stock.save((err) => {
              if (err) {
                log('error saving alert ' + err)
              }
            })
          } else {
            stock.price = ticker.last
            stock.save((err) => {
              if (err) {
                log('error saving stock ' + err)
              }
            })
          }
        })
        tickerEndpoints.push(item)
      }
    }
  }
}

// -----------------------------------------------------------------------------

async function scheduledCollection (symbol, instance, timeframe) {
  try {
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
    if (oldDataJson['guppy'] !== newDataJson['guppy']) {
      if (signal !== 'neutral') {
        // app.sendSocketMessage('', '')
        // alert saving to DB
        AlertController.saveAlerts('Multiple Moving Average', signal, symbol, timeframe)
        // notifications
        notify.blastToAllChannels('alex', instance.id, signal, symbol, lastPrice, timeframe)
      }
    }
  } catch (e) {
    if (e instanceof ccxt.DDoSProtection) {
      log(instance.id + ' [DDoS Protection] ' + e.message)
    } else if (e instanceof ccxt.RequestTimeout) { // this happens a lot
      log(instance.id + symbol + ' [Request Timeout] ')
      try {
        await fetchCandles(instance, symbol, timeframe)
        log(instance.id + symbol, 'success')
      } catch (e) {
        log(instance.id + symbol + ' [Request Timeout] ')
        await fetchCandles(instance, symbol, timeframe)
        log(instance.id + symbol + 'success')
      }
    } else if (e instanceof ccxt.AuthenticationError) {
      log(instance.id + ' [Authentication Error] ' + e.message)
    } else if (e instanceof ccxt.ExchangeNotAvailable) {
      log(instance.id + ' [Exchange Not Available] ' + e.message)
    } else if (e instanceof ccxt.ExchangeError) {
      log(instance.id + ' [Exchange Error] ' + e.message)
    } else if (e instanceof ccxt.NetworkError) {
      log(instance.id + ' [Network Error] ' + e.message)
    } else {
      log(e)
    }
  }
}

// -----------------------------------------------------------------------------

async function collectData () {
  await getAllTickers()
    .then(async () => {
      for (const index in tickerEndpoints) {
        let symbol = tickerEndpoints[index].ticker
        fullListOfSymbols.push(symbol)
        await getInitialCandlesAndIndicators(symbol, bittrexInstance)
      }
    })
  log('Initial Ticker Data Collected')
}

// -----------------------------------------------------------------------------
// hourly job
schedule.scheduleJob('*/21 * * * *', async function () {
  for (const index in tickerEndpoints) {
    let symbol = tickerEndpoints[index].ticker
    await scheduledCollection(symbol, bittrexInstance, '1h')
  }
  log('Hourly Ticker Data Collected')
})
// daily job
schedule.scheduleJob('0 18 * * *', async function () {
  for (const index in tickerEndpoints) {
    let symbol = tickerEndpoints[index].ticker
    await scheduledCollection(symbol, bittrexInstance, '1d')
  }
  log('Daily Ticker Data Collected')
})

module.exports = {
  collectData: collectData,
  bittrexInstance: bittrexInstance,
  fullListOfSymbols: fullListOfSymbols
}
