# Books API

REST API for managing a book collection built with Express.js.

## Features

- Full CRUD operations
- Search and filtering
- Input validation
- Duplicate detection
- Proper error handling

## Installation
```bash
npm install
npm start
```

## API Endpoints

### Get All Books
```
GET /books
```

### Search Books
```
GET /books/search?q=gatsby&genre=fiction&minYear=1900
```

### Get Single Book
```
GET /books/:id
```

### Create Book
```
POST /books
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name",
  "year": 2024,
  "genre": "fiction",
  "isbn": "978-1234567890"
}
```

### Update Book
```
PUT /books/:id
Content-Type: application/json

{
  "title": "Updated Title"
}
```

### Delete Book
```
DELETE /books/:id
```

## Valid Genres

fiction, non-fiction, dystopian, romance, mystery, programming, science, history, biography, uncategorized

## Technologies

- Node.js
- Express.js
- ES6 Modules

## Author

Abdelatif Guendouz - [GitHub](https://github.com/iamlxtif)