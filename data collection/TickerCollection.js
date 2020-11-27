const ccxt = require('ccxt')
const utils = require('../utils/utils')
const Indicators = require('../indicators/indicators')
const schedule = require('node-schedule')
const notify = require('../utils/notify')

const log = require('ololog').configure({
  locate: false
})

let bittrexInstance = new (ccxt)['bittrex']({
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
    finalMarketTickersAndSymbols.push({
      exchange: exchange.id,
      symbolsArray: exchange.symbols
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

async function getCandlesAndIndicators (symbol, instance) {
  let arrayOfClosePricesHourly = []
  let arrayOfOpenPricesHourly = []
  let arrayOfHighPricesHourly = []
  let arrayOfLowPricesHourly = []
  let arrayOfVolumeHourly = []

  let ohlcvHourly = await instance.fetchOHLCV(symbol, '1h')

  if (ohlcvHourly === undefined) {
    console.log('We got an empty ccxt response')
    return
  }

  for (let i = 0; i < ohlcvHourly.length; i++) {
    arrayOfOpenPricesHourly.push(ohlcvHourly[i][1])
    arrayOfHighPricesHourly.push(ohlcvHourly[i][2])
    arrayOfLowPricesHourly.push(ohlcvHourly[i][3])
    arrayOfClosePricesHourly.push(ohlcvHourly[i][4])
    arrayOfVolumeHourly.push(ohlcvHourly[i][5])
  }
  // we want to remove the last item, it is the current forming candle
  arrayOfHighPricesHourly.splice(-1, 1)
  arrayOfLowPricesHourly.splice(-1, 1)
  arrayOfClosePricesHourly.splice(-1, 1)
  arrayOfOpenPricesHourly.splice(-1, 1)
  const cryptoModel = {
    exchange: instance.id,
    ticker: symbol,
    hourly: {
      guppy: Indicators.GMMA(arrayOfClosePricesHourly)
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
  for (const exchange in finalMarketTickersAndSymbols) {
    for (let i = 0; i < 4; i++) {
      const symbolForExchange = finalMarketTickersAndSymbols[exchange].symbolsArray[i]
      if (symbolForExchange.includes('BTC')) {
        let item = {
          exchange: finalMarketTickersAndSymbols[exchange].exchange,
          ticker: symbolForExchange
        }
        tickerEndpoints.push(item)
      }
    }
  }
}

async function hourlyOlhcvCollection (symbol, instance) {
  try {
    let arrayOfClosePricesHourly = []
    let arrayOfOpenPricesHourly = []
    let arrayOfHighPricesHourly = []
    let arrayOfLowPricesHourly = []
    let arrayOfVolumeHourly = []

    let ohlcvHourly = await instance.fetchOHLCV(symbol, '1h')

    // we want to remove the last item, it is the current forming candle
    arrayOfHighPricesHourly.splice(-1, 1)
    arrayOfLowPricesHourly.splice(-1, 1)
    arrayOfClosePricesHourly.splice(-1, 1)
    arrayOfOpenPricesHourly.splice(-1, 1)

    for (let i = 0; i < ohlcvHourly.length; i++) {
      arrayOfOpenPricesHourly.push(ohlcvHourly[i][1])
      arrayOfHighPricesHourly.push(ohlcvHourly[i][2])
      arrayOfLowPricesHourly.push(ohlcvHourly[i][3])
      arrayOfClosePricesHourly.push(ohlcvHourly[i][4])
      arrayOfVolumeHourly.push(ohlcvHourly[i][5])
    }

    const analysisOfData = {
      exchange: instance,
      ticker: symbol,
      hourly: {
        guppy: Indicators.GMMA(arrayOfClosePricesHourly)
      }
    }

    // const old
    const oldData = technicalModels.find(element => element.ticker === symbol)
    const oldDataJsonHourly = oldData['hourly']
    const newDataJsonHourly = analysisOfData['hourly']
    const lastPrice = arrayOfClosePricesHourly[arrayOfClosePricesHourly.length - 1]


    for (const key in newDataJsonHourly) {
      if (key === 'guppy') {
        // if (newDataJsonHourly[key] !== oldDataJsonHourly[key]) {
        try {
          const update = {}
          update[key] = newDataJsonHourly[key]
          oldData['hourly'] = update
        } catch (e) {
          console.log('error updating the models')
        }
        // }
      }
    }

    const signal = newDataJsonHourly['guppy']

    // if we have a new guppy signal
    if (oldDataJsonHourly['guppy'] !== newDataJsonHourly['guppy']) {
      if (signal !== 'neutral') {
        notify.sendSlackMessageMain(instance.id, signal, symbol, lastPrice)
      }
    }

    // }
  } catch (e) {
    const dt = utils.dateTimeString()

    if (e instanceof ccxt.DDoSProtection) {
      log.bright.yellow(instance.id, '[DDoS Protection] ' + e.message)
    } else if (e instanceof ccxt.RequestTimeout) { // this happens a lot
      log.bright.yellow(dt, instance.id, symbol, '[Request Timeout] ')
      try {
        await hourlyOlhcvCollection(symbol, instance)
        log(dt.blue, instance.id.green, symbol.green, 'success')
      } catch (e) {
        log.bright.yellow(dt, instance.id, symbol, '[Request Timeout] ')
        await hourlyOlhcvCollection(symbol, instance)
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
  await getAllTickers()
    .then(async () => {
      for (const index in tickerEndpoints) {
        let symbol = tickerEndpoints[index].ticker
        await getCandlesAndIndicators(symbol, bittrexInstance)
      }
    })
  const dt = utils.dateTimeString()
  const collectedString = 'Initial Ticker Data Collected'
  log(dt.blue, collectedString.green)
}

// -----------------------------------------------------------------------------

schedule.scheduleJob('*/44 * * * *', async function () {
  for (const index in tickerEndpoints) {
    let symbol = tickerEndpoints[index].ticker
    await hourlyOlhcvCollection(symbol, bittrexInstance)
  }
  const dt = utils.dateTimeString()
  const collectedString = 'Hourly Ticker Data Collected'
  log(dt.blue, collectedString.green)
})

module.exports = {
  collectData: collectData
}
