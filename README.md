# Facebook Messenger Bot (Lottery Bot)

A simple facebook messenger bot that checks the ticket number for Lotto (Washington, USA) and Powerball.
I wrote the webhook for the bot using Node.js to interact with the user (get ticket numbers and post the result).
I also used axios, which is a Promise-based HTTP client and cheerios, a fast, flexible and reliable implementation of core jQuery to scrape the web for winning numbers (Lotto winning numbers for Washington were not available in json nor API).

## Usage Example:

For Powerball: power 10, 25, 31, 45, 22, 26

For Lotto: lotto 1, 30, 5, 2, 10, 49
