const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const parts = input.split('\n\n')
.map(player => player.split('\n').slice(1).map(Number))

const p1Deck = parts[0]
const p2Deck = parts[1];

const playRecursiveCombat = (p1Deck, p2Deck) => {

    const p1ComboMap = new Map();
    const p2ComboMap = new Map();
    let winner;

    while(p1Deck.length > 0 && p2Deck.length > 0) {

        if (p1ComboMap.has(p1Deck.join()) && p2ComboMap.has(p2Deck.join())) {
            return 1;
        }

        p1ComboMap.set(p1Deck.join(), true);
        p2ComboMap.set(p2Deck.join(), true);

        const c1 = p1Deck.shift();
        const c2 = p2Deck.shift();

        if (c1 <= p1Deck.length && c2 <= p2Deck.length) {

            winner = playRecursiveCombat(p1Deck.slice(0,c1), p2Deck.slice(0,c2));

        }
        else {

            winner = c1 > c2 ? 1 : 2;

        }

        winner == 1 ? p1Deck.push(c1, c2) : p2Deck.push(c2, c1);

    }

    return winner;

}

playRecursiveCombat(p1Deck, p2Deck);

const winningDeck = (p1Deck.length != 0) ? p1Deck : p2Deck;
const result = winningDeck.reduce(
    (res, val, ind) => res + (val * (winningDeck.length - ind))
, 0);

console.log(result);
