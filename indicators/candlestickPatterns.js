const technicalindicators = require('technicalindicators')

/// /////////////////////////////////////////////////////////
// 3 Candle Patterns
/// /////////////////////////////////////////////////////////
function abandonedBaby (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const AbandonedBaby = technicalindicators.abandonedbaby
  const threeDayInput = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = AbandonedBaby(threeDayInput)
  return result === true
}

function downsideTasukiGap (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const downsidetasukigap = technicalindicators.downsidetasukigap
  const threeDayInput = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = downsidetasukigap(threeDayInput)

  return result === true
}

function eveningDojiStar (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const eveningdojistar = technicalindicators.eveningdojistar
  const Input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = eveningdojistar(Input)

  return result === true
}

function eveningStar (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const eveningstar = technicalindicators.eveningstar
  const input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = eveningstar(input)
  return result === true
}

function morningDojiStar (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const morningdojistar = technicalindicators.morningdojistar
  const input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = morningdojistar(input)
  return result === true
}

function morningStar (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const morningstar = technicalindicators.morningstar
  const input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = morningstar(input)
  return result === true
}

function threeBlackCrows (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const threeblackcrows = technicalindicators.threeblackcrows
  const input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = threeblackcrows(input)

  return result === true
}

function threeWhiteSoldiers (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const threewhitesoldiers = technicalindicators.threewhitesoldiers
  const input = {
    open: arrayOfOpenPrices,
    close: arrayOfClosePrices,
    high: arrayOfHighPrices,
    low: arrayOfLowPrices
  }
  const result = threewhitesoldiers(input)

  return result === true
}

/// /////////////////////////////////////////////////////////
// 2 Candle Patterns
/// /////////////////////////////////////////////////////////

function bearishEngulfingPattern (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const bearishengulfingpattern = technicalindicators.bearishengulfingpattern
  const twoDayBearishInput = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = bearishengulfingpattern(twoDayBearishInput)

  return result === true
}

function bullishEngulfingPattern (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const bullishengulfingpattern = technicalindicators.bullishengulfingpattern
  const twoDayBullishInput = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = bullishengulfingpattern(twoDayBullishInput)
  return result === true
}

function darkCloudCover (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const darkcloudcover = technicalindicators.darkcloudcover
  const twoDayInput = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = darkcloudcover(twoDayInput)
  return result === true
}

function bullishHarami (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const bullishharami = technicalindicators.bullishharami
  const input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = bullishharami(input)
  return result === true
}

function bearishHarami (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const bearishharami = technicalindicators.bearishharami
  const input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = bearishharami(input)
  return result === true
}

function bearishHaramiCross (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const bearishharamicross = technicalindicators.bearishharamicross
  const input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = bearishharamicross(input)
  return result === true
}

function bullishHaramiCross (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const bullishharamicross = technicalindicators.bullishharamicross
  const input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = bullishharamicross(input)
  return result === true
}

function piercingLine (arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices) {
  const piercingline = technicalindicators.piercingline
  const input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }
  const result = piercingline(input)
  return result === true
}

/// /////////////////////////////////////////////////////////
// 1 Candle Patterns
/// /////////////////////////////////////////////////////////
//
// function doji(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
// const  doji = technicalindicators.doji;
//
// const  singleInput = {
//     open: arrayOfOpenPrices,
//     high: arrayOfHighPrices,
//     close: arrayOfClosePrices,
//     low: arrayOfLowPrices,
//   }
//
//
// const  result = doji(singleInput);
//   if(result==true){
//     return true;
//   } else {
//     return false;
//   }
// }
//
// function dragonflyDoji(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
// const  dragonflydoji = technicalindicators.dragonflydoji;
//
// const  singleInput = {
//     open: arrayOfOpenPrices,
//     high: arrayOfHighPrices,
//     close: arrayOfClosePrices,
//     low: arrayOfLowPrices
//   }
//
// const  result = dragonflydoji(singleInput);
//   if(result==true){
//     return true;
//   } else {
//     return false;
//   }
// }
//
// function gravestoneDoji(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
// const  gravestonedoji = technicalindicators.gravestonedoji;
//
// const  singleInput = {
//     open: arrayOfOpenPrices,
//     high: arrayOfHighPrices,
//     close: arrayOfClosePrices,
//     low: arrayOfLowPrices,
//
//   }
//
// const  result  = gravestonedoji(singleInput);
//   if(result==true){
//     return true;
//   } else {
//     return false;
//   }
// }
//
// function bullishMarubozu(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
// const  bullishmarubozu = technicalindicators.bullishmarubozu;
//
// const  input = {
//     close: arrayOfClosePrices,
//     open: arrayOfOpenPrices,
//     high: arrayOfHighPrices,
//     low: arrayOfLowPrices,
//   }
//
// const  result = bullishmarubozu(input);
//   if(result==true){
//     return true;
//   } else {
//     return false;
//   }
// }
//
// function bearishMarubozu(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
// const  bearishmarubozu = technicalindicators.bearishmarubozu;
//
// const  input = {
//     close: arrayOfClosePrices,
//     open: arrayOfOpenPrices,
//     high: arrayOfHighPrices,
//     low: arrayOfLowPrices,
//   }
//
// const  result = bearishmarubozu(input);
//
//   if(result==true){
//     return true;
//   } else {
//     return false;
//   }
// }
//
// function bullishSpinningTop(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
// const  bullishspinningtop = technicalindicators.bullishspinningtop;
//
// const  input = {
//     open: arrayOfOpenPrices,
//     high: arrayOfHighPrices,
//     close: arrayOfClosePrices,
//     low: arrayOfLowPrices,
//   }
//
// const  result = bullishspinningtop(input);
//   if(result==true){
//     return true;
//   } else {
//     return false;
//   }
// }
//
// function bearishSpinningTop(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
// const  bearishspinningtop = technicalindicators.bearishspinningtop;
//
// const  input = {
//     open: arrayOfOpenPrices,
//     high: arrayOfHighPrices,
//     close: arrayOfClosePrices,
//     low: arrayOfLowPrices,
//   }
//
// const  result = bearishspinningtop(input);
//
//   if(result==true){
//     return true;
//   } else {
//     return false;
//   }
// }

module.exports = {
  abandonedBaby: abandonedBaby,
  bearishEngulfingPattern: bearishEngulfingPattern,
  bullishEngulfingPattern: bullishEngulfingPattern,
  darkCloudCover: darkCloudCover,
  downsideTasukiGap: downsideTasukiGap,
  // doji:doji,
  // dragonflyDoji:dragonflyDoji,
  // gravestoneDoji:gravestoneDoji,
  bullishHarami: bullishHarami,
  bearishHaramiCross: bearishHaramiCross,
  bullishHaramiCross: bullishHaramiCross,
  // bullishMarubozu:bullishMarubozu,
  // bearishMarubozu:bearishMarubozu,
  eveningDojiStar: eveningDojiStar,
  eveningStar: eveningStar,
  bearishHarami: bearishHarami,
  piercingLine: piercingLine,
  // bullishSpinningTop:bullishSpinningTop,
  // bearishSpinningTop:bearishSpinningTop,
  morningDojiStar: morningDojiStar,
  morningStar: morningStar,
  threeBlackCrows: threeBlackCrows,
  threeWhiteSoldiers: threeWhiteSoldiers
}
