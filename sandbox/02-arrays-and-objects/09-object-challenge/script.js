// Step 1
const library = [
  {
    title: "Deep Work",
    author: "Cal Newport",
    status: {
      own: true,
      reading: false,
      read: false,
    },
  },
  {
    title: "Building A Second Brain",
    author: "Tiago Forte",
    status: {
      own: true,
      reading: false,
      read: false,
    },
  },
  {
    title: "Feel Good Productivity",
    author: "Ali Abdaal",
    status: {
      own: true,
      reading: false,
      read: false,
    },
  },
];

// Step 2
// library[0].status.read = true;
// library[1].status.read = true;
// library[2].status.read = true;
library.forEach((book) => (book.status.read = true));
console.log(library);

// Step 3
const { title: firstBook } = library[0];
console.log(firstBook);

// Step 4
const json = JSON.stringify(library);
console.log(json);
