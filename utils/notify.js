const SlackWebhook = require('slack-webhook')
const slackWebhookURL = 'https://hooks.slack.com/services/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'
const slack = new SlackWebhook(slackWebhookURL, {
  defaults: {
    username: 'Bot',
    channel: '#cryptosignals',
    icon_emoji: ':robot_face:'
  }
})

function sendSlackMessageMain (exchange, signal, ticker, lastPrice, PL, profit) {
  slack.send({
    'attachments': [{
      'color': '#ffff00',
      'author_name': 'CryptoSignals',
      'title': ticker,
      'title_link': 'http://www.' + exchange + '.com',
      'fields': [{
        'title': 'Exchange',
        'value': exchange,
        'short': true
      },
      {
        'title': 'Signal',
        'value': signal,
        'short': true
      },
      {
        'title': 'Current Price',
        'value': lastPrice,
        'short': true
      }
      ],
      'thumb_url': 'https://raw.githubusercontent.com/cjdowner/cryptocurrency-icons/master/128/color/' + ticker.substring(0, ticker.length - 4).toLowerCase() + '.png',
      'footer': 'Slack API'
    }]
  })
}

module.exports = {
  sendSlackMessageMain: sendSlackMessageMain
}
