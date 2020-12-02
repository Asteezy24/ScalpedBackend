const technicalindicators = require('technicalindicators')
const indicatorAnalysis = require('./indicatorAnalysis.js')

function simpleMovingAverage (period, values, lastPrice) {
  const SMA = technicalindicators.SMA
  var sma = SMA.calculate({
    period: period,
    values: values
  })

  var analysis = indicatorAnalysis.movingAverageAnalysis(lastPrice, sma[sma.length - 1])
  return analysis
}

function exponentialMovingAverage (period, values, lastPrice) {
  const EMA = technicalindicators.EMA
  var ema = EMA.calculate({
    period: period,
    values: values
  })

  var analysis = indicatorAnalysis.movingAverageAnalysis(lastPrice, ema[ema.length - 1])
  return analysis
}

function emaForGuppy (period, values) {
  const EMA = technicalindicators.EMA
  const ema = EMA.calculate({
    period: period,
    values: values
  })

  return ema[ema.length - 1]
}

function GMMA (arrayOfClosePrices) {
  const traderEMA3 = emaForGuppy(3, arrayOfClosePrices.slice(3))
  const traderEMA12 = emaForGuppy(12, arrayOfClosePrices.slice(12))
  const investorEMA30 = emaForGuppy(30, arrayOfClosePrices.slice(30))
  const investorEMA50 = emaForGuppy(50, arrayOfClosePrices.slice(50))

  return indicatorAnalysis.guppyAnalysis(traderEMA3, traderEMA12, investorEMA30, investorEMA50)
}

function isBuyEntrySignal (lastPrice, arrayOfHighPrices) {
  const max_of_array = Math.max(...arrayOfHighPrices) // high from the last 20 periods

  if (lastPrice > max_of_array) {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!')
    return true
  } else {
    return false
  }
}

function isBuyExitSignal (lastPrice, arrayOfLowPrices) {
  var min_of_array = Math.min.apply(Math, arrayOfLowPrices)

  if (lastPrice < min_of_array) {
    return true
  } else {
    return false
  }
}

function isSellEntrySignal (lastPrice, arrayOfLowPrices) {
  var min_of_array = Math.min.apply(Math, arrayOfLowPrices)

  if (lastPrice < min_of_array) {
    return true
  } else {
    return false
  }
}

function isSellExitSignal (lastPrice, arrayOfHighPrices) {
  var max_of_array = Math.max.apply(Math, arrayOfHighPrices)
  if (lastPrice > max_of_array) {
    return true
  } else {
    return false
  }
}

module.exports = {
  simpleMovingAverage: simpleMovingAverage,
  exponentialMovingAverage: exponentialMovingAverage,
  GMMA: GMMA,
  isBuyEntrySignal: isBuyEntrySignal,
  isSellEntrySignal: isSellEntrySignal,
  isBuyExitSignal: isBuyExitSignal,
  isSellExitSignal: isSellExitSignal
}
