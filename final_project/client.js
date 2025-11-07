const axios = require('axios');

const BASE_URL = 'http://localhost:5000';


function getAllBooks(callback) {
  axios.get(`${BASE_URL}/books`)
    .then(response => callback(null, response.data))
    .catch(error => callback(error, null));
}


getAllBooks((err, books) => {
  if (err) console.error('Error:', err.message);
  else console.log('All Books:', books);
});


function searchByISBN(isbn) {
  return axios.get(`${BASE_URL}/books/isbn/${isbn}`)
    .then(response => response.data)
    .catch(error => { throw new Error(error.response?.data?.message || 'Book not found'); });
}


searchByISBN('1111111111')
  .then(book => console.log('Book by ISBN:', book))
  .catch(err => console.error('Error:', err.message));


async function searchByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/books/author/${author}`);
    console.log('Books by Author:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data?.message || 'Author not found');
  }
}


searchByAuthor('First Author');


function searchByTitle(title) {
  return axios.get(`${BASE_URL}/books/title/${title}`)
    .then(response => response.data)
    .catch(error => { throw new Error(error.response?.data?.message || 'Title not found'); });
}

// Example usage with promises
searchByTitle('First Book')
  .then(books => console.log('Books by Title:', books))
  .catch(err => console.error('Error:', err.message));
