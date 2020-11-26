function ichimokuAnalysis (ichimokuData, lastClosePrice) {
  var ichimokuAnalysis = []

  // tk line analysis
  // future cloud color
  // current cloud color
  // price relation to cloud
  // relation to chikou

  /// /////////////////////////////////////////////////////
  // TK Lines
  /// /////////////////////////////////////////////////////
  var tenkanSen = ichimokuData[0]['TenkanSen']
  var kijunSen = ichimokuData[1]['KijunSen']

  if (tenkanSen > kijunSen) {
    var tkTrend = 'Bullish'
  } else {
    var tkTrend = 'Bearish'
  }
  ichimokuAnalysis.push({ 'TkLines': tkTrend })

  /// /////////////////////////////////////////////////////
  // future cloud color
  /// /////////////////////////////////////////////////////

  var futureSenkouA = ichimokuData[4]['FutureSenkouA']
  var futureSenkouB = ichimokuData[5]['FutureSenkouB']

  if (futureSenkouA > futureSenkouB) {
    var futureCloudColor = 'Bullish'
  } else {
    var futureCloudColor = 'Bearish'
  }

  ichimokuAnalysis.push({ 'FutureCloudColor': futureCloudColor })

  /// /////////////////////////////////////////////////////
  // current cloud color
  /// /////////////////////////////////////////////////////

  var currentSenkouA = ichimokuData[2]['CurrentSenkouA']
  var currentSenkouB = ichimokuData[3]['CurrentSenkouB']

  if (currentSenkouA > currentSenkouB) {
    var currentCloudColor = 'Bullish'
  } else {
    var currentCloudColor = 'Bearish'
  }

  ichimokuAnalysis.push({ 'currentCloudColor': currentCloudColor })

  /// /////////////////////////////////////////////////////
  // price relation to cloud
  /// /////////////////////////////////////////////////////
  if (currentCloudColor == 'Bullish') {
    if (currentSenkouA > lastClosePrice && currentSenkouB < lastClosePrice) { // we are in the cloud
      var priceRelationToKumo = 'PriceInKumo'
    }
    if (lastClosePrice < currentSenkouB && lastClosePrice < currentSenkouA) { // we are above the cloud
      var priceRelationToKumo = 'PriceBelowKumo'
    } else {
      var priceRelationToKumo = 'PriceAboveKumo'
    }
  } else { // current cloud bearish
    if (currentSenkouB > lastClosePrice && currentSenkouA < lastClosePrice) { // we are in the cloud
      var priceRelationToKumo = 'PriceInKumo'
    }
    if (lastClosePrice < currentSenkouB && lastClosePrice < currentSenkouA) { // we are above the cloud
      var priceRelationToKumo = 'PriceBelowKumo'
    } else {
      var priceRelationToKumo = 'PriceAboveKumo'
    }
  }

  ichimokuAnalysis.push({ 'priceRelationToKumo': priceRelationToKumo })

  return ichimokuAnalysis
}

module.exports = {
  ichimokuAnalysis: ichimokuAnalysis
}
