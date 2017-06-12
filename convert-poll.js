const polishWeekdays = {
  'Mon': 'poniedziałek',
  'Tue': 'wtorek',
  'Wed': 'środa',
  'Thu': 'czwartek',
  'Fri': 'piątek',
  'Sat': 'sobota',
  'Sun': 'niedziela'
};

const DoodleParser = require('doodle-parser');

module.exports = {
  getPoll: getPoll,
  convertPoll: convertPoll
};

function getPoll() {
  return DoodleParser.getPoll('icf2esnqkzfhkfud');
}

function convertPoll() {
  return getPoll()
    .then(poll => {
      if (!poll) {
        return null;
      }

      let lastDay = null;
      let lastHour = null;
      let counter = 0;

      let output = '';

      poll.options.forEach(option => {
        if (option.participants.length === 0) {
          return;
        }

        const time = option.text;
        let [day, date, hourMinutes, amPm] = time.split(' ');
        if (hourMinutes[0] == ':') {
          hourMinutes = hourMinutes.substring(1);
          amPm = 'AM';
        }
        const dayDate = day + ' ' + date;

        if (lastDay !== dayDate) {
          // Day changed
          if (lastDay) {
            output += '\n\n\n\n';
          }
          const dateParts = date.split('/');
          output += 'Algorytmy i Struktury Danych 2\n';
          output += 'Egzamin dnia:\t\t' + dateParts[1] + '.0' + dateParts[0] + '.20' + dateParts[2] + ' (' + polishWeekdays[day] + '), sala 211\n\n';
          lastDay = dayDate;
          lastHour = null;
        }

        let [hour, minutes] = hourMinutes.split(':');
        let hourNumber = parseInt(hour, 10);
        if (amPm == 'PM' && hourNumber !== 12) {
          // Adjust PM hours
          hourNumber += 12;
        }

        if (hourNumber !== lastHour && minutes != '05') {
          // Hour changed
          // 05 should still belong to the previous hour group
          if (lastHour) {
            output += '\n';
          }
          counter = 0;
          lastHour = hourNumber;
          output += 'godz. ' + hourNumber + '.' + minutes + '\n';
        }
        output += ++counter + ') ' + option.participants[0].name + '\n';
      });

      return output;
    });
}
