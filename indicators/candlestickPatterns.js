const technicalindicators = require('technicalindicators');

////////////////////////////////////////////////////////////
//3 Candle Patterns
////////////////////////////////////////////////////////////
function abandonedBaby(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var AbandonedBaby = technicalindicators.abandonedbaby;
  var threeDayInput = {
  	open: arrayOfOpenPrices,
  	high: arrayOfHighPrices,
  	close: arrayOfClosePrices,
  	low: arrayOfLowPrices
  }
  var result = AbandonedBaby(threeDayInput);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function downsideTasukiGap(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var downsidetasukigap = technicalindicators.downsidetasukigap;

  var threeDayInput = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices,
    }

  var result = downsidetasukigap(threeDayInput);

  if(result==true){
    return true;
  } else {
    return false;
  }
}

function eveningDojiStar(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var eveningdojistar = technicalindicators.eveningdojistar;

  var Input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }


  var result = eveningdojistar(Input);

  if(result==true){
    return true;
  } else {
    return false;
  }
}

function eveningStar(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){

  var eveningstar = technicalindicators.eveningstar;

  var input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }

  var result = eveningstar(input);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function morningDojiStar(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var morningdojistar = technicalindicators.morningdojistar;

  var input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }

  var result = morningdojistar(input);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function morningStar(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var morningstar = technicalindicators.morningstar;


  var input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }

  var result = morningstar(input);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function threeBlackCrows(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var threeblackcrows = technicalindicators.threeblackcrows;

  var input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }

  var result = threeblackcrows(input);

  if(result==true){
    return true;
  } else {
    return false;
  }
}

function threeWhiteSoldiers(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var threewhitesoldiers = technicalindicators.threewhitesoldiers;

  var input = {
    open: arrayOfOpenPrices,
    close: arrayOfClosePrices,
    high: arrayOfHighPrices,
    low: arrayOfLowPrices
  }

  var result = threewhitesoldiers(input);

  if(result==true){
    return true;
  } else {
    return false;
  }
}

////////////////////////////////////////////////////////////
//2 Candle Patterns
////////////////////////////////////////////////////////////

function bearishEngulfingPattern(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var bearishengulfingpattern = technicalindicators.bearishengulfingpattern;

  var twoDayBearishInput = {
    open: arrayOfOpenPrices,
  	high: arrayOfHighPrices,
  	close: arrayOfClosePrices,
  	low: arrayOfLowPrices
  }
  var result = bearishengulfingpattern(twoDayBearishInput);

  if(result==true){
    return true;
  } else {
    return false;
  }
}

function bullishEngulfingPattern(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var bullishengulfingpattern = technicalindicators.bullishengulfingpattern;

  var twoDayBullishInput = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices,
  }

  var result  = bullishengulfingpattern(twoDayBullishInput);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function darkCloudCover(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var darkcloudcover = technicalindicators.darkcloudcover;

  var twoDayInput = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices,
  }

  var result  = darkcloudcover(twoDayInput);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function bullishHarami(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var bullishharami = technicalindicators.bullishharami;

  var input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices,
  }

  var result = bullishharami(input);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function bearishHarami(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var bearishharami = technicalindicators.bearishharami;

  var input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices,
  }

  var result = bearishharami(input);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function bearishHaramiCross(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var bearishharamicross = technicalindicators.bearishharamicross;

  var input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices,

  }

  var result = bearishharamicross(input);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function bullishHaramiCross(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var bullishharamicross = technicalindicators.bullishharamicross;

  var input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices,
  }

  var result = bullishharamicross(input);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function piercingLine(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var piercingline = technicalindicators.piercingline;

  var input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices,
  }

  var result = piercingline(input);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

////////////////////////////////////////////////////////////
//1 Candle Patterns
////////////////////////////////////////////////////////////

function doji(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var doji = technicalindicators.doji;

  var singleInput = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices,
  }


  var result = doji(singleInput);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function dragonflyDoji(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var dragonflydoji = technicalindicators.dragonflydoji;

  var singleInput = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices
  }

  var result = dragonflydoji(singleInput);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function gravestoneDoji(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var gravestonedoji = technicalindicators.gravestonedoji;

  var singleInput = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices,

  }

  var result  = gravestonedoji(singleInput);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function bullishMarubozu(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var bullishmarubozu = technicalindicators.bullishmarubozu;

  var input = {
    close: arrayOfClosePrices,
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    low: arrayOfLowPrices,
  }

  var result = bullishmarubozu(input);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function bearishMarubozu(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var bearishmarubozu = technicalindicators.bearishmarubozu;

  var input = {
    close: arrayOfClosePrices,
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    low: arrayOfLowPrices,
  }

  var result = bearishmarubozu(input);

  if(result==true){
    return true;
  } else {
    return false;
  }
}

function bullishSpinningTop(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var bullishspinningtop = technicalindicators.bullishspinningtop;

  var input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices,
  }

  var result = bullishspinningtop(input);
  if(result==true){
    return true;
  } else {
    return false;
  }
}

function bearishSpinningTop(arrayOfOpenPrices, arrayOfHighPrices, arrayOfClosePrices, arrayOfLowPrices){
  var bearishspinningtop = technicalindicators.bearishspinningtop;

  var input = {
    open: arrayOfOpenPrices,
    high: arrayOfHighPrices,
    close: arrayOfClosePrices,
    low: arrayOfLowPrices,
  }

  var result = bearishspinningtop(input);

  if(result==true){
    return true;
  } else {
    return false;
  }
}

module.exports = {
  abandonedBaby:abandonedBaby,
  bearishEngulfingPattern:bearishEngulfingPattern,
  bullishEngulfingPattern:bullishEngulfingPattern,
  darkCloudCover:darkCloudCover,
  downsideTasukiGap:downsideTasukiGap,
  doji:doji,
  dragonflyDoji:dragonflyDoji,
  gravestoneDoji:gravestoneDoji,
  bullishHarami:bullishHarami,
  bearishHaramiCross:bearishHaramiCross,
  bullishHaramiCross:bullishHaramiCross,
  bullishMarubozu:bullishMarubozu,
  bearishMarubozu:bearishMarubozu,
  eveningDojiStar:eveningDojiStar,
  eveningStar:eveningStar,
  bearishHarami:bearishHarami,
  piercingLine:piercingLine,
  bullishSpinningTop:bullishSpinningTop,
  bearishSpinningTop:bearishSpinningTop,
  morningDojiStar:morningDojiStar,
  morningStar:morningStar,
  threeBlackCrows:threeBlackCrows,
  threeWhiteSoldiers:threeWhiteSoldiers

}
