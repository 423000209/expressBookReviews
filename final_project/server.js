

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());


const PORT = 5000;
const JWT_SECRET = 'your-secret-key'; 

app.use(bodyParser.json());
app.use(session({
  secret: 'session-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));



let books = [
  { isbn: '1111111111', title: 'First Book', author: 'First Author', reviews: ["Great"] },
  { isbn: '2222222222', title: 'Second Book', author: 'Second Author', reviews: ["Good"] },
  // Add more books as needed
];

// In-memory user storage (simulate DB)
let users = [];
let reviewIdCounter = 1;

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};


// Task 1: Get the book list available in the shop - 2 Points
app.get('/books', (req, res) => {
  res.json(books);
});

// Task 2: Get the books based on ISBN - 2 Points
app.get('/books/isbn/:isbn', (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// Task 3: Get all books by Author - 2 Points
app.get('/books/author/:author', (req, res) => {
  const filteredBooks = books.filter(b => b.author.toLowerCase().includes(req.params.author.toLowerCase()));
  res.json(filteredBooks);
});

// Task 4: Get all books based on Title - 2 Points
app.get('/books/title/:title', (req, res) => {
  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(req.params.title.toLowerCase()));
  res.json(filteredBooks);
});

// Task 5: Get book Review - 2 Points
app.get('/books/:isbn/reviews', (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book.reviews);
});



// Task 6: Register New user – 3 Points
app.post('/users/register', async (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) return res.status(400).json({ message: 'User already exists' });
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ id: users.length + 1, username, password: hashedPassword });
  res.status(201).json({ message: 'User registered' });
});

// Task 7: Login as a Registered user - 3 Points
app.post('/users/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  req.session.user = user;
  res.json({ token });
});


// Task 8: Add/Modify a book review - 2 Points
app.post('/books/:isbn/reviews', authenticateToken, (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  const newReview = { id: reviewIdCounter++, userId: req.user.id, review: req.body.review };
  book.reviews.push(newReview);
  res.status(201).json(newReview);
});

app.put('/books/:isbn/reviews/:reviewId', authenticateToken, (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  const review = book.reviews.find(r => r.id == req.params.reviewId && r.userId === req.user.id);
  if (!review) return res.status(404).json({ message: 'Review not found or not owned by user' });
  review.review = req.body.review;
  res.json(review);
});

// Task 9: Delete book review added by that particular user - 2 Points
app.delete('/books/:isbn/reviews/:reviewId', authenticateToken, (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  const reviewIndex = book.reviews.findIndex(r => r.id == req.params.reviewId && r.userId === req.user.id);
  if (reviewIndex === -1) return res.status(404).json({ message: 'Review not found or not owned by user' });
  book.reviews.splice(reviewIndex, 1);
  res.json({ message: 'Review deleted' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

  const axios = require('axios');

  const BASE_URL = 'http://localhost:5000';

  // Task 10: Get all books – Using async callback function – 2 Points
  function getAllBooks(callback) {
    axios.get(`${BASE_URL}/books`)
      .then(response => callback(null, response.data))
      .catch(error => callback(error, null));
  }

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

  searchByAuthor('First Author');

  // Task 13: Search by Title – Using Promises – 2 Points
  function searchByTitle(title) {
    return axios.get(`${BASE_URL}/books/title/${title}`)
      .then(response => response.data)
      .catch(error => { throw new Error(error.response?.data?.message || 'Title not found'); });
  }

  searchByTitle('First Book')
    .then(books => console.log('Books by Title:', books))
    .catch(err => console.error('Error:', err.message));
  