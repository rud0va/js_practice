// Aufgabe 1
const arr = ["a", "b", "c"];
arr.push("d");
arr.shift();

console.log(arr); // b, c, d

// Aufgabe 2
const fruits = ["apple", "banana", "cherry"];
console.log(fruits[0]);
console.log(fruits[fruits.length - 1]);
fruits[1] = "mango";
console.log(fruits);

// Aufgabe 3
const numbers = [1, 2, 3, 4];
const doubledNumbers = [];
numbers.forEach((number) => doubledNumbers.push(number * 2));
console.log(doubledNumbers);

// Aufgabe 4
const ages = [12, 18, 21, 16, 30];
const adults = ages.filter((age) => age > 17);
console.log(adults);

// Aufgabe 5
const prices = [10, 20, 30];
const sum = prices.reduce((acc, cur) => acc + cur);
console.log(sum);

// Aufgabe 6
const a = [1, 2];
const b = [3, 4];

// const c = a.concat(b);
const c = [...a, ...b];
console.log(c);

// Aufgabe 7
const matrix = [
  [1, 2],
  [3, 4],
  [5, 6],
];

console.log(matrix[1][1]);
console.log(matrix[2][0]);

// Aufgabe 8
const items = ["code", "coffee", "sleep", "code"];
// Funktionen kommen erst im dritten Abschnitt dran. Ja, ich hatte das alles schon einmal gemacht aber ich steige ja wieder neu ein. Du beziehst dich auf Fragen oder Wissen, was ich vor meinem Wiedereinstieg mit dir besprochen hatte

// Aufgabe 9
// Bei einer Mutation wird das Array selbst verändert. Bei einem Reassignment weist man die Werte des ursprünglichen Arras einem neuen Array zu.
