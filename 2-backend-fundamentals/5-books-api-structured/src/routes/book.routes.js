import {Router} from 'express'
import { createBook, deleteBook, getbook, getbooks, updateBook } from '../controllers/books.controller.js'
import { validate } from '../middleware/validate.js'
import { createBookValidator } from '../validators/book.validators.js'
import { writeLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.get('/', getbooks)
router.get('/:id', getbook)
router.post('/', createBookValidator, writeLimiter, validate, createBook)
router.put('/:id', writeLimiter, updateBook)
router.delete('/:id', writeLimiter, deleteBook)

export default router