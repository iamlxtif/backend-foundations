import http from 'http';

let books = [
  { id: 1, title: "1984", author: "George Orwell", year: 1949 },
  { id: 2, title: "Brave New World", author: "Aldous Huxley", year: 1932 }
];

const server = http.createServer((req,res) => {
    console.log(`${req.method} ${req.url}`);

    if(req.url === '/books' && req.method === 'GET'){
        res.statusCode = 200;
        res.end(JSON.stringify({books}));
    } else if (req.url.startsWith('/books/') && req.method === 'GET'){
        const id = parseInt(req.url.split('/')[2]);
        const book = books.find(b => b.id === id);
        if(!book){
            res.statusCode = 404;
            res.end(JSON.stringify({error: 'book not found'}));
        } else {
            res.statusCode = 200;
            res.end(JSON.stringify({book}));
        }
    } else if (req.url === '/books' && req.method === 'POST'){
    console.log('POST /books triggered!'); // Add this
    let body = '';
    req.on('data', chunk => {
        console.log('Receiving data:', chunk.toString()); // Add this
        body += chunk.toString();
    });
    req.on('end', () => {
        console.log('Data received complete:', body); // Add this
        try {
            const newBook = JSON.parse(body);
            newBook.id = books.length + 1;
            books.push(newBook);

            res.statusCode = 201;
            res.end(JSON.stringify({
                message: 'Book created',
                book: newBook
            }));
        } catch (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({error: 'Invalid JSON'}));
        }
    });
    return;
    } else if (req.url.startsWith('/books/') && req.method === 'PUT'){
        const id = parseInt(req.url.split('/')[2]);
        const index = books.findIndex(i => i.id === id);
        if (index === -1){
            res.statusCode = 404;
            res.end(JSON.stringify({error: 'Book not found'}));
            return;
        }
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const updatedBook = JSON.parse(body);
                
                updatedBook.id = id;
                books[index] = updatedBook;
                res.statusCode = 200;
                res.end(JSON.stringify({
                    message: 'book updated',
                    book: updatedBook
                }));
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({error: 'Invalid JSON'}));
            }
        })
        return;
    } else if (req.url.startsWith('/books/') && req.method === 'DELETE'){
        const id = parseInt(req.url.split('/')[2]);
        const index = books.findIndex(b => b.id === id);
        if (index === -1){
            res.statusCode = 404;
            res.end(JSON.stringify({error: 'Book not found'}));
        } else {
            const deletedBook = books.splice(index,1)[0];
            res.statusCode = 200;
            res.end(JSON.stringify({
                message: 'Book is deleted',
                book: deletedBook
            }));
        }
        return;
    } else if (req.url.startsWith('/books/') && req.method === 'PATCH'){
        const id = parseInt(req.url.split('/')[2]);
        const book = books.find(b => b.id === id);
        if (!book){
            res.statusCode = 404;
            res.end(JSON.stringify({error: 'Book not found'}));
            return;
        }
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const updates = JSON.parse(body);
                
                if(updates.title) book.title = updates.title;
                if(updates.author) book.author = updates.author;
                if(updates.year) book.year = updates.year;
                res.statusCode = 200;
                res.end(JSON.stringify({
                    message: 'book partially updated',
                    book: book
                }));
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({error: 'Invalid JSON'}));
            }
        })
        return;
    }
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({error: 'Not found'}));
    }
})

server.listen(3000, () => {
    console.log('Server is running at port 3000');
})