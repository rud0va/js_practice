let x;

// Array Literal
const numbers = [12, 45, 33, 29, 39, 102];
const mixed = [1, "Hello", true, null];

// Array Constructor

const fruits = new Array("apple", "grape", "orange");

x = numbers[0];
x = numbers[0] + numbers[3];
x = `My favorite fruit is an ${fruits[2]}`;

x = numbers.length;

fruits[2] = "pear";

// fruits.length = 2;

fruits[3] = "strawberry";
fruits[fruits.length] = "blueberry";
fruits[fruits.length] = "peach";

x = fruits;

console.log(x);

const arr = [1, 2, 3, 4];
arr.length = 2;
arr.length = 4;

console.log(arr[3]); // [1, 2]
