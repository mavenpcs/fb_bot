const getPowerMeta = (queryText, json) => {
    // Only retrieve the digits from user input and convert into array
    let numbers = queryText.replace(/\D/g, ' ').trim().split('  ');
    let sixth = parseInt(numbers.pop(), 10);
    // Call parseInt on each number to remove leading zero (if any)
    let firstFive = numbers.map(number => parseInt(number, 10));
    let matchedNumbers = [];
    // Convert the winning numbers into an array
    let winning = json[0].winning_numbers.split(' ');
    let powerball = parseInt(winning.pop(), 10);
    // Also remove leading zero from each number, if any
    let winningFive = winning.map(number => parseInt(number, 10));
    let count = matchNumber(firstFive, winningFive, matchedNumbers);
    let powerMatch = matchPowerball(sixth, powerball);
    let jackpotMsg = '';
    if (powerMatch.powerball_match && count == 5) {
    jackpotMsg = "\nIT'S A JACKPOT!!!!!!";
    }
    return {
        type: 'powerball',
        date: json[0].draw_date,
        winning_numbers: json[0].winning_numbers,
        multiplier: json[0].multiplier,
        user_numbers: firstFive,
        user_powerball: sixth,
        match_count: count,
        matched_numbers: matchedNumbers,
        powerball_msg: powerMatch.powerball_msg,
        jackpot_msg: jackpotMsg
      };
};

const getLottoMeta = (queryText, scrapedNumbers, scrapedDate) => {
    let numbers = queryText.replace(/\D/g, ' ').trim().split('  ');
    numbers = numbers.map(number => parseInt(number, 10));
    scrapedNumbers = scrapedNumbers.map(number => parseInt(number, 10));
    let matchedNumbers = [];
    let count = matchNumber(numbers, scrapedNumbers, matchedNumbers);
    let jackpotMsg = '';
    if (count == 6) {
        jackpotMsg = "\nIT'S A JACKPOT!!!!!!";
    }
    return {
        type: 'lotto',
        date: scrapedDate,
        winning_numbers: scrapedNumbers,
        user_numbers: numbers,
        match_count: count,
        matched_numbers: matchedNumbers,
        jackpot_msg: jackpotMsg
      }
};

const matchNumber = (userNumbers, winningNumbers, matchedNumbers) => {
    let count = 0;
    userNumbers.forEach(number => {
        if (winningNumbers.includes(number)) {
          console.log(`We have a match: ${number}`);
          matchedNumbers.push(number);
          count++;
        }
      });
      return count;
};

const matchPowerball = (userPower, winningPower) => {
    let powerMatch = false;
    let powerMatchMsg = '';
    if (userPower === winningPower) {
        powerMatch = true;
        powerMatchMsg = `\nPowerball matches! -> ${winningPower}`;
      } else {
        powerMatchMsg = 'Powerball does not match. :(';
      }
    return {powerball_match: powerMatch, powerball_msg: powerMatchMsg};
};

const getMessage = (meta) => {
    let msg = '';
    if (meta.type == 'powerball') {
        if (meta.user_numbers.length != 5) {
            msg = 'Your input is invalid. Please check your numbers!';
        } else {
            msg = `Draw date: ${meta.date} \
            \nWinning numbers: ${meta.winning_numbers} \
            \nMultiplier: x${meta.multiplier} \
            \n\nYour numbers: ${meta.user_numbers},${meta.user_powerball} \
            \nYou have a total of ${meta.match_count} match(es)! -> ${meta.matched_numbers} \
            \n${meta.powerball_msg} \
            \n${meta.jackpot_msg}`;
        }
    } else if (meta.type == 'lotto') {
        if (meta.user_numbers.length != 6) {
            msg = 'Your input is invalid. Please check your numbers!';
        } else {
            msg = `Draw date: ${meta.date} \
            \nWinning numbers: ${meta.winning_numbers} \
            \n\nYour numbers: ${meta.user_numbers} \
            \nYou have a total of ${meta.match_count} match(es)! -> ${meta.matched_numbers} \
            \n${meta.jackpot_msg}`;
        }
    }
    return msg;
}

module.exports = {
    getPowerMeta,
    getLottoMeta,
    matchNumber,
    getMessage,
    matchPowerball
};