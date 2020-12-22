const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const parts = input.split('\n\n')
.map(player => player.split('\n').slice(1).map(Number))

const p1Deck = parts[0];
const p2Deck = parts[1];

while(p1Deck.length > 0 && p2Deck.length > 0) {

    const c1 = p1Deck.shift();
    const c2 = p2Deck.shift();

    c1 > c2 ? p1Deck.push(c1, c2) : p2Deck.push(c2, c1);

}

const winningDeck = (p1Deck.length != 0) ? p1Deck : p2Deck;
const result = winningDeck.reduce(
    (res, val, ind) => res + (val * (winningDeck.length - ind))
, 0);

console.log(result);
