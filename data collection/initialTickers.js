const log = require('ololog').configure({ locate: false })
const ccxt = require('ccxt')
const analyzeController = require('./analyzeData')

// User Preferences
let exchanges = ['bittrex']
var finalMarketTickersAndSymbols = []
// var exchangePairs = ['BTC']
var APIendpoints = []

let loadExchange = async function (exchange) {
  try {
    await exchange.loadMarkets()
    finalMarketTickersAndSymbols.push({
      key: exchange.id,
      value: exchange.symbols
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

async function getAllTickers () {
  // instantiate all exchanges
  await Promise.all(ccxt.exchanges.map(async id => {
    let exchange = new (ccxt)[id]()
    if (exchanges.includes(id)) {
      await loadExchange(exchange)
    }
  }))

  log.bright.red('\nGathering all trading pairs to be used.')

  for (var i = 0; i < finalMarketTickersAndSymbols.length; i++) { // exchanges
    for (var j = 0; j < 1; j++) { // ticker symbols finalMarketTickersAndSymbols[i].value.length
      // for (pair in exchangePairs) {
      // if (finalMarketTickersAndSymbols[i].value[j].slice(-3) == exchangePairs[pair]) { // check if ticker contains the specified trading pairs
      var item = {
        exchange: finalMarketTickersAndSymbols[i].key,
        ticker: finalMarketTickersAndSymbols[i].value[j]
      } // for later reference
      APIendpoints.push(item)
      // }
      // }
    }
  }
  analyzeController.analyzeDataFromCCXT(APIendpoints)
}

module.exports = {
  getAllTickers: getAllTickers
}
