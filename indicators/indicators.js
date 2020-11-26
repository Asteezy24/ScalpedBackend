const technicalindicators = require('technicalindicators')
const indicatorAnalysis = require('./indicatorAnalysis.js')

function simpleMovingAverage (period, values) {
  const SMA = technicalindicators.SMA
  return SMA.calculate({ period: period, values: values })
}

function bollingerBands (period, stdDev, values) {
  var BB = technicalindicators.BollingerBands
  var input = {
    period: period,
    values: values,
    stdDev: stdDev
  }

  return BB.calculate(input)
}

function exponentialMovingAverage (period, values) {
  const EMA = technicalindicators.EMA
  var ema = EMA.calculate({ period: period, values: values })
  return ema
}

function relativeStrengthIndex (period, values) {
  const RSI = technicalindicators.RSI
  var inputRSI = {
    values: values,
    period: period
  }
  var rsi = RSI.calculate(inputRSI)
  return rsi
}

function makingNewLow () {

}

function makingNewHigh () {

}

function ichimokuCloud (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  /// /////////////////////////////////////////////////////
  // Handle price relation to chikou
  /// /////////////////////////////////////////////////////

  // get the close price from 30 periods ago
  const chikouSpan = arrayOfClosePrices[arrayOfClosePrices.length - 30]

  /// /////////////////////////////////////////////////////
  // calculate the tenkan and kijun.
  /// /////////////////////////////////////////////////////
  var twentyPeriodHigh = Math.max(...arrayOfHighPrices.slice(-20))
  var twentyPeriodLow = Math.min(...arrayOfLowPrices.slice(-20))

  var sixtyPeriodHigh = Math.max(...arrayOfHighPrices.slice(-60))
  var sixtyPeriodLow = Math.min(...arrayOfLowPrices.slice(-60))

  const tenkanSen = ((twentyPeriodHigh + twentyPeriodLow) / 2)
  const kijunSen = ((sixtyPeriodHigh + sixtyPeriodLow) / 2)

  /// /////////////////////////////////////////////////////
  // calculate the future kumo cloud
  /// /////////////////////////////////////////////////////

  var oneTwentyPeriodHigh = Math.max(...arrayOfHighPrices.slice(-120))
  var oneTwentyPeriodLow = Math.min(...arrayOfLowPrices.slice(-120))

  const futureSenkouA = ((tenkanSen + kijunSen) / 2)
  const futureSenkouB = ((oneTwentyPeriodHigh + oneTwentyPeriodLow) / 2)

  /// /////////////////////////////////////////////////////
  // Calculate the current kumo cloud
  /// /////////////////////////////////////////////////////

  for (i = 0; i < 30; i++) {
    arrayOfHighPrices.pop()
    arrayOfLowPrices.pop()
  }// we are removing the 30 period look ahead to get the current kumo

  var currentSenkouBHigh = Math.max(...arrayOfHighPrices.slice(-120))
  var currentSenkouBLow = Math.min(...arrayOfLowPrices.slice(-120))

  var recalculatedTwentyPeriodHigh = Math.max(...arrayOfHighPrices.slice(-20))
  var recalculatedTwentyPeriodLow = Math.min(...arrayOfLowPrices.slice(-20))

  var recalculatedTenkanSen = ((recalculatedTwentyPeriodHigh + recalculatedTwentyPeriodLow) / 2)

  var recalculatedSixtyPeriodHigh = Math.max(...arrayOfHighPrices.slice(-60))
  var recalculatedSixtyPeriodLow = Math.min(...arrayOfLowPrices.slice(-60))

  var recalculatedKijunSen = ((recalculatedSixtyPeriodHigh + recalculatedSixtyPeriodLow) / 2)

  const currentSenkouA = (recalculatedTenkanSen + recalculatedKijunSen) / 2
  const currentSenkouB = (currentSenkouBHigh + currentSenkouBLow) / 2

  // console.log('Tenkan ' + tenkanSen)
  // console.log('Kijun ' + kijunSen)
  // console.log('Current Senkou A '+currentSenkouA)
  // console.log('Current Senkou B '+currentSenkouB)
  // console.log('Future Senkou A '+futureSenkouA)
  // console.log('Future Senkou B '+futureSenkouB)
  // console.log('Chikou '+chikouSpan)

  var ichimokuData = []
  ichimokuData.push({ 'TenkanSen': tenkanSen })
  ichimokuData.push({ 'KijunSen': kijunSen })
  ichimokuData.push({ 'CurrentSenkouA': currentSenkouA })
  ichimokuData.push({ 'CurrentSenkouB': currentSenkouB })
  ichimokuData.push({ 'FutureSenkouA': futureSenkouA })
  ichimokuData.push({ 'FutureSenkouB': futureSenkouB })
  ichimokuData.push({ 'Chikou': chikouSpan })

  var analysis = indicatorAnalysis.ichimokuAnalysis(ichimokuData, arrayOfClosePrices[arrayOfClosePrices.length - 1])

  return analysis
}

function GMMA (arrayOfClosePrices) {
  var traderEMAs = []
  var investorEMAs = []

  traderEMAs.push(exponentialMovingAverage(3, arrayOfClosePrices.slice(-3))[0])
  traderEMAs.push(exponentialMovingAverage(5, arrayOfClosePrices.slice(-5))[0])
  traderEMAs.push(exponentialMovingAverage(8, arrayOfClosePrices.slice(-8))[0])
  traderEMAs.push(exponentialMovingAverage(10, arrayOfClosePrices.slice(-10))[0])
  traderEMAs.push(exponentialMovingAverage(12, arrayOfClosePrices.slice(-12))[0])

  investorEMAs.push(exponentialMovingAverage(30, arrayOfClosePrices.slice(-30))[0])
  investorEMAs.push(exponentialMovingAverage(35, arrayOfClosePrices.slice(-35))[0])
  investorEMAs.push(exponentialMovingAverage(40, arrayOfClosePrices.slice(-40))[0])
  investorEMAs.push(exponentialMovingAverage(45, arrayOfClosePrices.slice(-45))[0])
  investorEMAs.push(exponentialMovingAverage(50, arrayOfClosePrices.slice(-50))[0])

  console.log(traderEMAs)

  // construct a variable, set variable to current trend
  // every time function is called, see if variable has changed
  // if it has changed then notify the guppy cross and change variable
  // repeat
}

module.exports = {
  simpleMovingAverage: simpleMovingAverage,
  bollingerBands: bollingerBands,
  relativeStrengthIndex: relativeStrengthIndex,
  exponentialMovingAverage: exponentialMovingAverage,
  GMMA: GMMA,
  ichimokuCloud: ichimokuCloud,
  makingNewLow: makingNewLow,
  makingNewHigh: makingNewHigh
}
