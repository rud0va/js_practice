// Aufgabe 1
let x = 10;

function test() {
  let x = 20;
  console.log(x); // 20
}

test();
console.log(x); // 10

// Aufgabe 2
if (true) {
  let y = 5;
}

// console.log(y);

// Es wird ein Fehler geworfen, da die Variable nur im Block scope verfügbar ist

// Aufgabe 3
if (true) {
  var a = 1;
  let b = 2;
}

console.log(a); // 1, da var global scope besitzt
//console.log(b); // Reference error wegen block scope

// Aufgabe 4
function counter() {
  let count = 0;
  console.log(++count);
}

counter();
counter();

// Aufgabe 5
const message = "global scope";
console.log(message);

if (true) {
  const message = "block scope";
  console.log(message);
}

// Aufgabe 6
let level = "global";

function outer() {
  let level = "outer";

  function inner() {
    let level = "inner";
    console.log(level);
  }

  inner();
  console.log(level);
}

outer();
console.log(level); // inner -> outer -> global

// Aufgabe 7
function greet() {
  let name = "Mila";

  function sayHello() {
    console.log("Hello " + name);
  }

  sayHello();
}

greet();
// Durch closure kann auch die nested function sayHello auf diese Variable zugreifen.

// Aufgabe 8
{
  let x = 1;
}

{
  let x = 2;
}

console.log(x);
// Hier wird ein Fehler ausgegeben, da die beiden Variablen x nur in ihrem jeweiligen block scope existieren.
