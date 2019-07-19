const siteUrl = "https://www.walottery.com/WinningNumbers/";
const axios = require("axios");
const cheerio = require("cheerio");

const fetchData = async () => {
    const result = await axios.get(siteUrl);
    return cheerio.load(result.data);
};

const getResults = async () => {
    const $ = await fetchData();
    let winningLotto = $(".game-bucket-lotto > .game-balls > ul li").text();
    // The scraped numbers are repeated once for some reason, so slice them in half
    winningLotto = winningLotto.slice('', winningLotto.length / 2);
    let i = 0;
    let winningLottoArr = [];
    // Convert the numbers string into an array holding each number
    for (i = 0; i < winningLotto.length; i = i + 2) {
        winningLottoArr.push(winningLotto.substring(i, i + 2));
    }
    return winningLottoArr;
}

const getDate = async () => {
    const $ = await fetchData();
    let drawDate = $(".game-bucket-lotto > p strong").text();
    // The scraped date is also repeated once, so slice it in half.
    drawDate = drawDate.slice('', drawDate.length / 2);
    return drawDate;
}

module.exports = {
    getResults,
    getDate
};