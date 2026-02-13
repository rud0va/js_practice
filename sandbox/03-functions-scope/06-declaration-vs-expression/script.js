// Function Declaration
console.log(addDollarSign(100));
function addDollarSign(value) {
  return "$" + value;
}

// Function Expression
console.log(addPlusSign(200));
const addPlusSign = function (value) {
  return "+" + value;
};
