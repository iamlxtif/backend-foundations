import {body} from 'express-validator'

export const createBookValidator = [
    body('title').notEmpty().withMessage('title is required').trim(),
    body('author').notEmpty().withMessage('author is required').trim(),
    body('year').optional().isInt({min: 1000, max: 2100}).withMessage('year must be a valid integer')
]