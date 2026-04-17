import {Router} from 'express'
import { createBook, deleteBook, getbook, getbooks, updateBook } from '../controllers/books.controller'

const router = Router()

router.get('/', getbooks)
router.get('/:id', getbook)
router.post('/', createBook)
router.put('/:id', updateBook)
router.delete('/:id', deleteBook)

export default router