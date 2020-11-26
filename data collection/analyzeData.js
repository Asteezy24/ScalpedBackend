const log = require('ololog').configure({ locate: false })
const ccxt = require('ccxt')
const Candlesticks = require('../indicators/candlestickPatterns')
const Indicators = require('../indicators/indicators')
const notify = require('../utils/notify')

function analyzeDataFromCCXT (APIendpoints) {
  console.log('Setting up Database.\n')
  notify.sendSlackMessageMain('foo', 'Bugha', 'three', 'four')

  for (let i = 0; i < APIendpoints.length; i++) {
    setTimeout(function (exchangeData, tickerData) {
      collectData(exchangeData, tickerData)
    }, i * 2000, APIendpoints[i].exchange, APIendpoints[i].ticker)
  }
  // establishEndpointsFromDatabase(APIendpoints)
}

function collectData (exchange, ticker) {
  async function olhcvCollection (symbol) {
    let arrayOfClosePrices = []
    let arrayOfOpenPrices = []
    let arrayOfHighPrices = []
    let arrayOfLowPrices = []
    let arrayOfVolume = []

    let instanceOfExchange = new ccxt[exchange]({
      enableRateLimit: true
    })

    const ohlcv = await instanceOfExchange.fetchOHLCV(ticker, '1h')

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

    const twentySma = Indicators.simpleMovingAverage(20, arrayOfClosePrices)
    const fiftySma = Indicators.simpleMovingAverage(50, arrayOfClosePrices)
    const hundredSma = Indicators.simpleMovingAverage(100, arrayOfClosePrices)
    const hundredFiftySma = Indicators.simpleMovingAverage(150, arrayOfClosePrices)

    const cryptoModel = {
      exchange: exchange,
      ticker: ticker,
      twentySma: twentySma[twentySma.length - 1],
      fiftySma: fiftySma[fiftySma.length - 1],
      hundredSma: hundredSma[hundredSma.length - 1],
      hundredFiftySma: hundredFiftySma[hundredFiftySma.length - 1]
    }
    console.log(cryptoModel)
  }
  const concurrent = [olhcvCollection(ticker)]

  Promise.all(concurrent)
    .then(function () {
      log.bright.green('Finished Analysis of ' + ticker)
    })
    .catch((error) => {
      console.log('Error on ticker: ' + ticker + '. Retrying...')
      setTimeout(function (tickerPromise) {
        olhcvCollection(tickerPromise)
      }, 11200, ticker)
    })
}

/*
20 < 50
20 < 100
20 < 150

50 < 100
50 < 150

100 < 150
 */

function checkForChange (oldVariable, newVariable) {
  if (oldVariable == newVariable) {
    return oldVariable
  } else {
    return newVariable
  }
}

module.exports = {
  analyzeDataFromCCXT: analyzeDataFromCCXT
}
