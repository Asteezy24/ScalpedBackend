function guppyAnalysis (traderEMA3, traderEMA12, investorEMA30, investorEMA50) {
  if (traderEMA3 > investorEMA30 && traderEMA12 > investorEMA30) {
    return 'Buy'
  } else if (traderEMA3 < investorEMA30 && traderEMA12 < investorEMA30) {
    return 'Sell'
  } else {
    return 'neutral'
  }
}

function movingAverageAnalysis (lastPrice, maNum) {
  if (lastPrice > maNum) {
    return 'bullish'
  } else if (lastPrice < maNum) {
    return 'bearish'
  } else {
    return 'neutral'
  }
}

module.exports = {
  guppyAnalysis: guppyAnalysis,
  movingAverageAnalysis: movingAverageAnalysis
}
