import {Router} from 'express'
import { createBook, deleteBook, getbook, getbooks, updateBook } from '../controllers/books.controller.js'
import { validate } from '../middleware/validate.js'
import { createBookValidator } from '../validators/book.validators.js'

const router = Router()

router.get('/', getbooks)
router.get('/:id', getbook)
router.post('/', createBookValidator, validate, createBook)
router.put('/:id', updateBook)
router.delete('/:id', deleteBook)

export default router