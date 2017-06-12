const express = require('express');
const { convertPoll, getPoll } = require('./convert-poll');
const PORT = 5000;

const app = express();

app.get('/json', (req, res) => {
  getPoll()
    .then(poll => {
      if (!poll) {
        return res.sendStatus(500);
      }
      const output = poll.options
        .filter(option => option && option.participants && option.text)
        .map(option => ({
        dateTime: option.text,
        person: option.participants.length > 0 ? option.participants[0].name : null
      }));
      res.json(output);
    });
});

app.get('/text', (req, res) => {
  convertPoll()
    .then(output =>{
      if (!output) {
        return res.sendStatus(500);
      }
      res.send('<pre>' + output + '</pre>')
    });
});

app.get('/', (req, res) => {
  res.redirect('/text');
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
