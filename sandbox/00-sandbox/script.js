// Teil 1
// Frage 1: Literals sind die "wörtiche" also direktere Schreibweise. Beides macht im Prinzip das gleiche, aber das Array Literal ist einfach kürzer und deshalb best practice.

// Frage 2: Die length counter wird auf zwei gesetzt. Somit wird das Array acuh faktisch auf die Länge gesetzt und alle Werte >= Index 2 werden unwiederruflich gelöscht

// Frage 3: Länge ist eine EIgenschaft des Arrays, während push etwas mit dem Array macht/es verändert

//Teil 2
// Aufgabe 4
let items = ["apple", "banana"];

items.push("cherry");
items.shift();
items.unshift("kiwi");

console.log(items);

// Aufgabe 5: Meiner Meinung nach geht diese Aufgabe nicht mit den bisherigen Methoden die ich gelernt habe.
const nums = [1, 2, 3, 4];
const newArr = [];
arr.slice();

console.log(nums);
console.log(newArr);

// Aufgabe 6
function isEmpty(arr) {
  return arr.length < 1;
}

// Aufgabe 7: new Array(3) erstellt ein Array der Länge drei. Array.of(3) erstellt ein Array mit dem Wert 3. Extra dafür wurde Array.of damals konzipiert, um das new Array() Problem zu lösen, wenn man nur einen Wert anlegen will.

// Teil 3
// Konzepte bitte erkläre mir nochmal Mutation vs. Reassignment und Expression vs. Literal

// Aufgabe 8:

const arr = [1, 2, 3];
const copy = arr;

copy.push(4);

console.log(arr); //1, 2, 3, 4
