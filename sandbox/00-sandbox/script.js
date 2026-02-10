// Aufgabe 1
let value = "global";

function test() {
  console.log(value);
  let value = "local";
  console.log(value);
}

test();
// error, weil trotz der globalen Variable value, will er in der Funktion im lexical Kontext auf die Variable value zugreifen, die aber erst nach dem ersten Aufruf deklariert wird und deshalb einen Fehler wirft.

// Aufgabe 2
function run() {
  if (true) {
    var a = 1;
    let b = 2;
  }

  console.log(a);
  console.log(b);
}

run();
// 1 wird ausgegeben aber b nicht, da die Variable nur im if block verfügbar ist

// Aufgabe 3
function makeCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counterA = makeCounter();
const counterB = makeCounter();

console.log(counterA()); //1
console.log(counterA()); //2
console.log(counterB()); //1
console.log(counterA()); //3

// Sie beeinflussen sicht nicht, weil zwei verschiedene Referenzen auf den counter bzw die nakeCounter Funktion zeigen

// Aufgabe 4
function greetLater(name) {
  setTimeout(function () {
    console.log("Hello " + name);
  }, 1000);
}

greetLater("Mila");
// Boah weiß nicht, was du meinst. Wegen dem Timer 1000ms?

// Aufgabe 5
const words = ["Learn", "JS", "Fast"];

const result = words
  .map((w) => w.toLowerCase())
  .filter((w) => w.length > 2)
  .join("-");

console.log(result);
// learn-fast
// Die jeweiligen Strings im Array werden mit der map Methode durchlaufen und mit toLowerCase vin klein geschriebene Worte geändert. Das dort zurückgegebene Array wird gefiltert. Sodass nur noch Einträge im Array behalten werden, die länger als 2 Buchstaben sind. Diese beiden werden dann letztendlich mit join mit einem Bindestrich zu einem String verbunden.

// Aufgabe 6
const items = ["pen", "book", "pen", "lamp", "book"];
// haha ich wusste das diese Aufgabe dran kommen wird :P
const unique = items.filter(
  (item, index, arr) => index === arr.indexOf(arr[index]),
);
console.log(unique);

// Aufgabe 7
// 1. Wenn in der weiteren Umgebung definierte Variablen, trotzdem in einem anderen Block genutzt werden können. beispielsweise könnte eine Funktion in der ein if block verschachtelt ist, trotzdem auf Variablen aus dem if Block zugreifen. Ah ehrlich gesagtbin ich noch etwas unsicher bei Closure...
// 2. Shadowing bedeutet das eine Variable eine andere verdeckt. So kann eine local Variable mit dem gleichen Namen, wie eine globale Variable, diese verdecken
// 3. Weil alle drei ebenfalls über ein Array iterieren.
