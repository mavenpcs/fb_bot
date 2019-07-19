const PAGE_ACCESS_TOKEN = 'EAAhHxGldgxIBACMg6T8NHFoFEFc1hA0vzVFNbbx1Bi5oopQfWS1qT4uHhTu1KwZBpHRTnPTVluSuv9A8sMOIJRekiZAbmxI9cJSQyZCmt03iWyfqcWMjnQ9fbvVss4gXNuFqHDm8vb3ZBxj0IIR7vVgPebf6ef2ZCsigMBNfVIAZDZD'
const CLIENT_ACCESS_TOKEN = '781b12f3c852404db0159bb7175e691f'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const apiaiApp = require('apiai')(CLIENT_ACCESS_TOKEN);

const scraper = require('./scraper');
const helper = require('./helper');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Express server listening on port ${server.address().port} in ${app.settings.env} mode`)
});

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'yakima_lotto') {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.status(403).end();
    }
  });
  /* Handling all messenges */
  app.post('/webhook', (req, res) => {
    if (req.body.object === 'page') {
      req.body.entry.forEach((entry) => {
        entry.messaging.forEach((event) => {
          if (event.message && event.message.text) {
            sendMessage(event);
          }
        });
      });
      res.status(200).end();
    }
  });

  app.post('/ai', (req, res) => {
    console.log('*** Webhook for api.ai query ***');
    
    if (req.body.queryResult.action === 'powerball') {
      let url = 'http://data.ny.gov/resource/d6yy-54nr.json';
      let numbers = req.body.queryResult.queryText;
      request.get(url, (err, response, body) => {
        if (!err && response.statusCode == 200) {
          let json = JSON.parse(body);
          let powerMeta = helper.getPowerMeta(numbers, json);
          let msg = helper.getMessage(powerMeta);
          return res.json({
            speech: msg,
            fulfillmentText: msg,
            source: 'Powerball'});
        } else {
          return res.status(400).json({
            status: {
              code: 400,
              errorType: 'Failed to look up powerball results.'
            }});
        }
      })
    } else if (req.body.queryResult.action === 'lotto') {
      let numbers = req.body.queryResult.queryText;
      // Here, I'm using axios callbacks to scrape necessary data from the web
      scraper.getResults().then(value => {
        scraper.getDate().then(date => {
          let lottoMeta = helper.getLottoMeta(numbers, value, date);
          let msg = helper.getMessage(lottoMeta);
          return res.json({
          speech: msg,
          fulfillmentText: msg,
          source: 'Washington Lottery'});
        });
      });
    }
});

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;
  let apiai = apiaiApp.textRequest(text, {
      sessionId: 'tester'
  });
  apiai.on('response', (response) => {
      // Got a response from api.ai. Let's POST to Facebook Messenger
      let tempText = response.result.fulfillment.messages[0];
      let aiText = tempText['speech'];
      
        request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: {text: aiText}
        }
        }, (error, response) => {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
  });
  apiai.on('error', error => {
      console.log(error);
  });
  apiai.end();
}