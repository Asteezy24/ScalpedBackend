let moment = require('moment-timezone')
const logger = require('ololog').configure({ locate: false })
// eslint-disable-next-line no-unused-expressions
require('ansicolor').nice

const formatDate = (epoch) => {
  let dateObj = new Date(Number(epoch))
  return (dateObj.getMonth() + 1) + '/' + dateObj.getDate() + '/' + dateObj.getFullYear()
}

function dateTimeString () {
  let d = new Date()
  let myTimezone = 'America/Toronto'
  let myDatetimeFormat = 'YYYY-MM-DD hh:mm:ss a z'
  return '[' + moment(d).tz(myTimezone).format(myDatetimeFormat) + ']'
}

function log (message) {
  const dt = dateTimeString()
  logger(dt.blue, message.green)
}

const bittrexPairs = [
  'XRP/BTC',
  'ETH/BTC',
  'ADA/BTC',
  'XLM/BTC',
  'BSV/BTC',
  'TUSD/BTC',
  'LTC/BTC',
  'LBC/BTC',
  'XEM/BTC',
  'DGB/BTC',
  'TRX/BTC',
  'NEO/BTC',
  'BCH/BTC',
  'LINK/BTC',
  'XVG/BTC',
  'WAVES/BTC',
  'XMR/BTC',
  'VTC/BTC',
  'XHV/BTC',
  'GNT/BTC',
  'NMR/BTC',
  'DASH/BTC',
  'HBAR/BTC',
  'RDD/BTC'
]

module.exports = {
  dateTimeString: dateTimeString,
  formatDate: formatDate,
  bittrexPairs: bittrexPairs,
  log: log
}
