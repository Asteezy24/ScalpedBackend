const log = require('ololog').configure({ locate: false })
const ccxt = require('ccxt')
const Candlesticks = require('../indicators/candlestickPatterns')
const Indicators = require('../indicators/indicators')

function analyzeDataFromCCXT (APIendpoints) {
  console.log('Setting up Database.\n')

  for (let i = 0; i < APIendpoints.length; i++) {
    setTimeout(function (exchangeData, tickerData) {
      collectData(exchangeData, tickerData)
    }, i * 2500, APIendpoints[i].exchange, APIendpoints[i].ticker)
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

    const cryptoModel = {
      exchange: exchange,
      ticker: ticker,
      isAbandonedBaby: Candlesticks.abandonedBaby(arrayOfOpenPrices.slice(-3), arrayOfHighPrices.slice(-3), arrayOfClosePrices.slice(-3), arrayOfLowPrices.slice(-3)),
      isDownsideTasukiGap: Candlesticks.downsideTasukiGap(arrayOfOpenPrices.slice(-3), arrayOfHighPrices.slice(-3), arrayOfClosePrices.slice(-3), arrayOfLowPrices.slice(-3)),
      isEveningDojiStar: Candlesticks.eveningDojiStar(arrayOfOpenPrices.slice(-3), arrayOfHighPrices.slice(-3), arrayOfClosePrices.slice(-3), arrayOfLowPrices.slice(-3)),
      isEveningStar: Candlesticks.eveningStar(arrayOfOpenPrices.slice(-3), arrayOfHighPrices.slice(-3), arrayOfClosePrices.slice(-3), arrayOfLowPrices.slice(-3)),
      isMorningDojiStar: Candlesticks.morningDojiStar(arrayOfOpenPrices.slice(-3), arrayOfHighPrices.slice(-3), arrayOfClosePrices.slice(-3), arrayOfLowPrices.slice(-3)),
      isMorningStar: Candlesticks.morningStar(arrayOfOpenPrices.slice(-3), arrayOfHighPrices.slice(-3), arrayOfClosePrices.slice(-3), arrayOfLowPrices.slice(-3)),
      isThreeBlackCrows: Candlesticks.threeBlackCrows(arrayOfOpenPrices.slice(-3), arrayOfHighPrices.slice(-3), arrayOfClosePrices.slice(-3), arrayOfLowPrices.slice(-3)),
      isThreeWhiteSoldiers: Candlesticks.threeWhiteSoldiers(arrayOfOpenPrices.slice(-3), arrayOfHighPrices.slice(-3), arrayOfClosePrices.slice(-3), arrayOfLowPrices.slice(-3)),
      isBullishEngulfingPattern: Candlesticks.bullishEngulfingPattern(arrayOfOpenPrices.slice(-2), arrayOfHighPrices.slice(-2), arrayOfClosePrices.slice(-2), arrayOfLowPrices.slice(-2)),
      isBearishEngulfingPattern: Candlesticks.bearishEngulfingPattern(arrayOfOpenPrices.slice(-2), arrayOfHighPrices.slice(-2), arrayOfClosePrices.slice(-2), arrayOfLowPrices.slice(-2)),
      isDarkCloudCover: Candlesticks.darkCloudCover(arrayOfOpenPrices.slice(-2), arrayOfHighPrices.slice(-2), arrayOfClosePrices.slice(-2), arrayOfLowPrices.slice(-2)),
      isBullishHarami: Candlesticks.bullishHarami(arrayOfOpenPrices.slice(-2), arrayOfHighPrices.slice(-2), arrayOfClosePrices.slice(-2), arrayOfLowPrices.slice(-2)),
      isBearishHarami: Candlesticks.bearishHarami(arrayOfOpenPrices.slice(-2), arrayOfHighPrices.slice(-2), arrayOfClosePrices.slice(-2), arrayOfLowPrices.slice(-2)),
      isBullishHaramiCross: Candlesticks.bullishHaramiCross(arrayOfOpenPrices.slice(-2), arrayOfHighPrices.slice(-2), arrayOfClosePrices.slice(-2), arrayOfLowPrices.slice(-2)),
      isBearishHaramiCross: Candlesticks.bearishHaramiCross(arrayOfOpenPrices.slice(-2), arrayOfHighPrices.slice(-2), arrayOfClosePrices.slice(-2), arrayOfLowPrices.slice(-2)),
      isPiercingLine: Candlesticks.piercingLine(arrayOfOpenPrices.slice(-2), arrayOfHighPrices.slice(-2), arrayOfClosePrices.slice(-2), arrayOfLowPrices.slice(-2)),
      isDoji: Candlesticks.doji(arrayOfOpenPrices.slice(-1), arrayOfHighPrices.slice(-1), arrayOfClosePrices.slice(-1), arrayOfLowPrices.slice(-1)),
      isDragonflyDoji: Candlesticks.dragonflyDoji(arrayOfOpenPrices.slice(-1), arrayOfHighPrices.slice(-1), arrayOfClosePrices.slice(-1), arrayOfLowPrices.slice(-1)),
      isGravestoneDoji: Candlesticks.gravestoneDoji(arrayOfOpenPrices.slice(-1), arrayOfHighPrices.slice(-1), arrayOfClosePrices.slice(-1), arrayOfLowPrices.slice(-1)),
      isBullishMarubozu: Candlesticks.bullishMarubozu(arrayOfOpenPrices.slice(-1), arrayOfHighPrices.slice(-1), arrayOfClosePrices.slice(-1), arrayOfLowPrices.slice(-1)),
      isBearishMarubozu: Candlesticks.bearishMarubozu(arrayOfOpenPrices.slice(-1), arrayOfHighPrices.slice(-1), arrayOfClosePrices.slice(-1), arrayOfLowPrices.slice(-1)),
      twentySma: Indicators.simpleMovingAverage(20, arrayOfClosePrices).slice(-1)[0]
    }
    console.log(cryptoModel)
  }
  const concurrent = [olhcvCollection(ticker)]

  Promise.all(concurrent)
    .then(function () {
      console.log('Finished Analysis of ' + ticker);
    })
    .catch((error) => {
      console.log('Error on ticker: ' + ticker + '. Retrying...')
      setTimeout(function (tickerPromise) {
        olhcvCollection(tickerPromise)
      }, 11200, ticker)
    })
}

module.exports = {
  analyzeDataFromCCXT: analyzeDataFromCCXT
}
