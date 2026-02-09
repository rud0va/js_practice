// Aufgabe 1
const words = ["hi", "there", "js"];
const result = words.map((w) => w.toUpperCase()).filter((w) => w.length > 2);

console.log(result); // THERE

// Aufgabe 2
const user = {
  name: "Mila",
  age: 19,
  city: "Berlin",
};

console.log(Object.keys(user).length); // 3
console.log(Object.keys(user));

// Aufgabe 3
const sentence = "javascript is fun";
const upperCase = sentence.toUpperCase().split(" ");
console.log(upperCase);

// Aufgabe 4
const words2 = ["code", "coffee", "focus", "sleep"];
const longWords = words2.filter((w) => w.length > 4);
console.log(longWords);

// Aufgabe 5
const product = {
  name: "Laptop",
  price: 1200,
  tags: ["tech", "office", "work"],
};

console.log(Object.keys(product).length); // 3
console.log(product.tags.length); // 3
const tagsUpperCase = product.tags.map((t) => t.toUpperCase());
console.log(tagsUpperCase);

// Aufgabe 6
const users = [
  { name: "Anna", age: 17 },
  { name: "Tom", age: 22 },
  { name: "Lisa", age: 19 },
];

const legalAge = users.filter((u) => u.age >= 18);
const names = legalAge.map((u) => u.name);
console.log(names);

// Aufgabe 7
const text = "Learn JavaScript Learn Arrays";

function analyzeText(text) {
  const words = text.toLowerCase().split(" ");
  const uniquewords = words.filter((w, i, arr) => i === arr.indexOf(w));
  return { uniquewords: uniquewords, count: uniquewords.length };
}

console.log(analyzeText(text));

// Aufgabe 8
// 1. Bei einer Mutation wird ein und dasselbe Array verändert, bei einem Reassignment wird dem Array eine neue Referenz auf ein Array übergeben.
// 2. Weil man zunächst eine Array Methode anwendet, die ein Array zurückgibt und man dann die Eigenschaft des Array mit length abfragen kann. Man chained also Objekte und Arrays aneinander, um die jeweiligen Methoden des jeweiligen objects verwenden zu können.
// 3. Da ein length einfach eine Eigenschaft eines Arrays ist und keine Methode. Und String Objekte sind faktisch Arrays.

// Aufgabe 9
// users übergibt einfach das komplette Array oder Objekt, während der spread operator ...users nur die Werte des Objekts oder Arrays in der Variablen b speichert.
