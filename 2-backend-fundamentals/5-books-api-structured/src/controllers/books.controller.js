let books = [
  { id: 1, title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', year: 1999 },
  { id: 2, title: 'Clean Code', author: 'Robert Martin', year: 2008 },
]

export const getbooks = (req, res) => {
    const {title, author, page = 1, limit = 5} = req.query
    let results = books

    if (title) results = results.filter(b => b.title.toLowerCase().includes(title.toLowerCase()))
    if (author) results = results.filter(b => b.author.toLowerCase().includes(author.toLowerCase()))

    const total = results.length
    const start = (parseInt(page) - 1) * parseInt(limit)
    const paginated = results.slice(start, start + parseInt(limit))
    
    res.json({
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
        data: paginated
    })
}

export const getbook = (req, res) => {
    const bookId = parseInt(req.params.id)
    const book = books.filter(b => b.id === bookId)
    if(!book) res.status(404).json({error: 'Book not found'})
    res.json(book)
}

export const createBook = (req, res) => {
    const {title, author, year} = req.body
    if(!title || !author) res.status(400).json({error: 'Title and author are required'})
    const book = {
        id: books.length > 0 ? Math.max(...books.map( b=>b.id )) + 1 : 1,
        title: title,
        author: author,
        year: year || null
    }
    books.push(book)
    res.status(201).json(book)
}

export const updateBook = (req, res) => {
    const index = books.findIndex(b => b.id === parseInt(req.params.id))
    if(-index) res.status(404).json({error: 'Book not found'})
    books[index] = {...books[index], ...req.body, id: books[index].id}
    res.json(books[index])
}

export const deleteBook = (req,res) => {
    const index = books.findIndex(b => b.id === parseInt(req.params.id))
    if(-index) res.status(404).json({error: 'Book not found'})
    books.splice(index,1)
    res.json(books)
}