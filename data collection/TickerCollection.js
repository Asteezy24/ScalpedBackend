const ccxt = require('ccxt')
const utils = require('../utils/utils')
const Indicators = require('../indicators/indicators')
const schedule = require('node-schedule')
const notify = require('../utils/notify')
const remoteNotifications = require('../utils/remoteNotifications')
const app = require('../start')

const log = require('ololog').configure({
  locate: false
})
const bittrexInstance = new (ccxt)['bittrex']({
  enableRateLimit: true
})

// User Preferences
let finalMarketTickersAndSymbols = []
let tickerEndpoints = []
const technicalModels = []

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
      log.bright.yellow(exchange.id, '[DDoS Protection] ' + e.message)
    } else if (e instanceof ccxt.RequestTimeout) {
      log.bright.yellow(exchange.id, '[Request Timeout] ' + e.message)
    } else if (e instanceof ccxt.AuthenticationError) {
      log.bright.yellow(exchange.id, '[Authentication Error] ' + e.message)
    } else if (e instanceof ccxt.ExchangeNotAvailable) {
      log.bright.yellow(exchange.id, '[Exchange Not Available] ' + e.message)
    } else if (e instanceof ccxt.ExchangeError) {
      log.bright.yellow(exchange.id, '[Exchange Error] ' + e.message)
    } else if (e instanceof ccxt.NetworkError) {
      log.bright.yellow(exchange.id, '[Network Error] ' + e.message)
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
    console.log('We got an empty ccxt response')
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
  const dt = utils.dateTimeString()
  log.bright.red(dt, 'Gathering all trading pairs to be used.')
  for (const exchangeIndex in finalMarketTickersAndSymbols) {
    for (let i = 0; i < finalMarketTickersAndSymbols[exchangeIndex].symbolsArray.length; i++) {
      const symbolForExchange = finalMarketTickersAndSymbols[exchangeIndex].symbolsArray[i]
      if (symbolForExchange.includes('BTC')) {
        let item = {
          exchange: finalMarketTickersAndSymbols[exchangeIndex].exchange,
          ticker: symbolForExchange
        }
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
            console.log('error updating the models')
          }
        }
      }
    }

    const signal = newDataJson['guppy']

    // if we have a new guppy signal
    if (oldDataJson['guppy'] !== newDataJson['guppy']) {
      if (signal !== 'neutral') {
        console.log('blasting message for ' + symbol)
        // socket
        app.sendSocketMessage('', '')
        // push notification
        const note = remoteNotifications.createNote()
        remoteNotifications.send(note)
        // slack
        notify.sendSlackMessageMain(instance.id, signal, symbol, lastPrice, timeframe)
      }
    }
  } catch (e) {
    const dt = utils.dateTimeString()

    if (e instanceof ccxt.DDoSProtection) {
      log.bright.yellow(instance.id, '[DDoS Protection] ' + e.message)
    } else if (e instanceof ccxt.RequestTimeout) { // this happens a lot
      log.bright.yellow(dt, instance.id, symbol, '[Request Timeout] ')
      try {
        await fetchCandles(instance, symbol, timeframe)
        log(dt.blue, instance.id.green, symbol.green, 'success')
      } catch (e) {
        log.bright.yellow(dt, instance.id, symbol, '[Request Timeout] ')
        await fetchCandles(instance, symbol, timeframe)
        log(dt.blue, instance.id.green, symbol.green, 'success')
      }
    } else if (e instanceof ccxt.AuthenticationError) {
      log.bright.yellow(instance.id, '[Authentication Error] ' + e.message)
    } else if (e instanceof ccxt.ExchangeNotAvailable) {
      log.bright.yellow(instance.id, '[Exchange Not Available] ' + e.message)
    } else if (e instanceof ccxt.ExchangeError) {
      log.bright.yellow(instance.id, '[Exchange Error] ' + e.message)
    } else if (e instanceof ccxt.NetworkError) {
      log.bright.yellow(instance.id, '[Network Error] ' + e.message)
    } else {
      console.log(e)
    }
  }
}

// -----------------------------------------------------------------------------

async function collectData () {
  // await getAllTickers()
  //   .then(async () => {
  //     for (const index in tickerEndpoints) {
  //       let symbol = tickerEndpoints[index].ticker
  //       await getInitialCandlesAndIndicators(symbol, bittrexInstance)
  //     }
  //   })
  const dt = utils.dateTimeString()
  const collectedString = 'Initial Ticker Data Collected'
  log(dt.blue, collectedString.green)
}

// -----------------------------------------------------------------------------
// hourly job
schedule.scheduleJob('*/30 * * * *', async function () {
  for (const index in tickerEndpoints) {
    let symbol = tickerEndpoints[index].ticker
    await scheduledCollection(symbol, bittrexInstance, '1h')
  }
  const dt = utils.dateTimeString()
  const collectedString = 'Hourly Ticker Data Collected'
  log(dt.blue, collectedString.green)
})
// daily job
schedule.scheduleJob('0 18 * * *', async function () {
  for (const index in tickerEndpoints) {
    let symbol = tickerEndpoints[index].ticker
    await scheduledCollection(symbol, bittrexInstance, '1d')
  }
  const dt = utils.dateTimeString()
  const collectedString = 'Daily Ticker Data Collected'
  log(dt.blue, collectedString.green)
})

module.exports = {
  collectData: collectData
}
