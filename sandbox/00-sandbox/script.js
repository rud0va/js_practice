// Aufgabe 1
const nums = [1, 2, 3];
nums.push(4);
nums.unshift(0);
nums.pop();

console.log(nums); // 0, 1, 2, 3

// Aufgabe 2
const user = {
  name: "Mila",
  age: 19,
  skills: ["JS", "HTML", "CSS"],
};

const x = Object.keys(user).length; // x = 3, die Objekt-Methode keys(user) gibt ein Array mit allen object keys zurück und die Eigenschaft length gibt dann die Länge des Arrays zurück. Also 3.

// Aufgabe 3
const colors = ["red", "green", "blue"];
console.log(colors[1]);
colors[2] = "purple";
console.log(colors[colors.length - 1]);

// Aufgbe 4
const prices = [10, 20, 30];
const usury = prices.map((price) => price * 1.2);

// Aufgabe 5
const scores = [45, 82, 90, 67, 50];
const big = scores.filter((score) => score >= 60);

// Aufgabe 6
const points = [5, 10, 15];
const total = points.reduce((acc, cur) => acc + cur, 0);

// Aufgabe 7
const a = ["x", "y"];
const b = ["z"];

const concatMyBoy = a.concat(b);
const betterSpreadIt = [...a, ...b];

// Aufgabe 8
const data = [
  ["apple", "banana"],
  ["carrot", "tomato"],
];

console.log(data[0][1]);
console.log(data[1][0]);

// Aufgabe 9
const items = ["pen", "book", "pen", "lamp"];

function analyzeItems(arr) {
  const unique = arr.filter((word, index) => arr.indexOf(word) === index);
  const uniqueItems = unique.map((word) => word.toUpperCase());
  const count = uniqueItems.length;
  return {
    uniqueItems,
    count,
  };
}

console.log(analyzeItems(items));

// Aufgabe 10
// Mutation verändert den Inhalt des Arrays selbst, während Reassignment die Referenz der Variable einfach auf ein neues Array zeigt.
// Da length eine Eigenschaft des Arrays selbst ist. Ein Array besitzt immer eine Länge und somit diese Eigeschaft.
