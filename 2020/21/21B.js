const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const allergentMap = new Map();
const addAllergent = (allergent, newIngredients) => {

    var currentIngredients = allergentMap.get(allergent) || newIngredients;
    currentIngredients = currentIngredients.filter(
        ingredient => newIngredients.includes(ingredient)
    );
    allergentMap.set(allergent, currentIngredients);

}

const rows = input.split('\n')
.map(row => row.slice(0, -1).split(' (contains '))
.map(row => [row[0].split(' '), row[1].split(', ')])

rows.forEach(
    row => row[1].forEach(
        allergent => addAllergent(allergent, row[0])
    )
);

let listUpdated = true;
const confirmedIngredientMap = new Map();

while (listUpdated) {

    listUpdated = false;

    allergentMap.forEach((ingredients, allergent) => {

        if (ingredients.length > 1 || confirmedIngredientMap.has(ingredients[0])) {
            return true;
        }

        listUpdated = true;
        confirmedIngredientMap.set(ingredients[0], true);

    });

    allergentMap.forEach((ingredients, allergent) => {

        if (ingredients.length == 1) {
            return true;
        }

        ingredients = ingredients.filter(ingredient => !confirmedIngredientMap.has(ingredient));
        allergentMap.set(allergent, ingredients);

    });

}

const result = [...allergentMap.keys()]
.sort()
.map(key => allergentMap.get(key)[0])
.join();

console.log(result);
