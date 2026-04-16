import express from 'express';
import { books } from './data.js';
import { validateBook, checkDuplicate } from './validation.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/',(req,res) => {
    res.json({
        message: 'Books API',
        endpoints: {
        'GET /books': 'Get all books',
        'GET /books/:id': 'Get single book',
        'POST /books': 'Create book',
        'PUT /books/:id': 'Update book',
        'DELETE /books/:id': 'Delete book'
        }
    });
});

app.get('/books', (req, res) => {
    res.json({
        success: true,
        count: books.length,
        data: books
    });
});

app.get('/books/search', (req, res) => {
    const {q, genre, minYear, maxYear} = req.query;
    let results = [...books];

    if(q){
        const search = q.toLowerCase();
        results = results.filter(b =>
            b.title.toLowerCase().includes(search) ||
            b.author.toLowerCase().includes(search)
        );
    }

    if(genre){
        results = results.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
    }

    if(minYear){
        results = results.filter(b => b.year >= parseInt(minYear));
    }

    if(maxYear){
        results = results.filter(b => b.year <= parseInt(maxYear));
    }

    res.json({
        success: true,
        count: results.length,
        filters: {q, genre, minYear, maxYear},
        data: results
    });
});

app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);

    if(!book){
        res.status(404).json({
            success: false,
            error: `Book with id ${id} is not found`
        });
    }

    res.json({
        success: true,
        data: book
    });
});

app.post('/books', (req, res) => {
    const bookData = req.body;
    const validation = validateBook(bookData);

    if(!validation.isValid){
        res.status(422).json({
            success: false,
            error: 'Validation failed',
            details: validation.errors
        });
    }

    if(checkDuplicate(books, bookData.title, bookData.author)){
        res.status(409).json({
            success: false,
            error: 'Book with this title and author already exists'
        })
    }

    const {title, author, year, genre, isbn} = req.body;

    if(!title || !author){
        res.status(400).json({
            success: false,
            error: `Title and author are required`
        });
    }

    const newBook = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        title,
        author,
        year: year || new Date.getFullYear(),
        genre: genre || 'uncategorized',
        isbn: isbn || ''
    };

    books.push(newBook);

    res.status(201).json({
        success: true,
        message: 'Book created',
        data: newBook
    });
});

app.put('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = books.findIndex(b => b.id === id);

    if(index === -1){
        return res.status(404).json({
            success: false,
            error: `Book with ID ${id} not found`
        });
    }

    const {title, author, year, genre, isbn} = req.body;

    books[index] = {
        id,
        title: title || books[index].title,
        author: author || books[index].author,
        year: year || books[index].year,
        genre: genre || books[index].genre,
        isbn: isbn || books[index].isbn
    };


    res.status(201).json({
        success: true,
        message: 'Book updated',
        data: books[index]
    });
});

app.delete('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = books.findIndex(b => b.id === id);

    if(index === -1){
        return res.status(404).json({
            success: false,
            error: `Book with ID ${id} not found`
        });
    }

    const deletedBook = books.splice(index, 1)[0];

    res.json({
        success: true,
        message: 'Book deleted',
        data: deletedBook
    });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});