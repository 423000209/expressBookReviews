const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Task 10: Get all books – Using async callback function – 2 Points
function getAllBooks(callback) {
  axios.get(`${BASE_URL}/books`)
    .then(response => callback(null, response.data))
    .catch(error => callback(error, null));
}

// Example usage with callback
getAllBooks((err, books) => {
  if (err) console.error('Error:', err.message);
  else console.log('All Books:', books);
});

// Task 11: Search by ISBN – Using Promises – 2 Points
function searchByISBN(isbn) {
  return axios.get(`${BASE_URL}/books/isbn/${isbn}`)
    .then(response => response.data)
    .catch(error => { throw new Error(error.response?.data?.message || 'Book not found'); });
}

// Example usage with promises
searchByISBN('1111111111')
  .then(book => console.log('Book by ISBN:', book))
  .catch(err => console.error('Error:', err.message));

// Task 12: Search by Author – Using async/await – 2 Points
async function searchByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/books/author/${author}`);
    console.log('Books by Author:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data?.message || 'Author not found');
  }
}

// Example usage
searchByAuthor('First Author');

// Task 13: Search by Title – Using Promises – 2 Points
function searchByTitle(title) {
  return axios.get(`${BASE_URL}/books/title/${title}`)
    .then(response => response.data)
    .catch(error => { throw new Error(error.response?.data?.message || 'Title not found'); });
}

// Example usage with promises
searchByTitle('First Book')
  .then(books => console.log('Books by Title:', books))
  .catch(err => console.error('Error:', err.message));