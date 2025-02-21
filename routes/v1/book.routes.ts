import express from 'express';
import { validateRequestBody } from '../../schemas';
import { checkBookPresentSchema, 
        CreateBookSchema, 
        DeleteBookSchema, 
        UpdateBookSchema} 
from '../../schemas/bookSchema';

const router = express.Router();

/**
 * @route GET /books/all
 * @group books - Operations related to book management
 * @description Fetch all books
 */
router.get(
    '/all',

);

/**
 * @route GET /books/id/:id
 * @group books - Operations related to book management
 * @param {string} id - Book's unique identifier
 * @description Fetch a book by its ID
 */
router.get(
    'id/:id',
 
);

/**
 * @route POST /books/checkBookPresent
 * @group books - Operations related to book management
 * @param {string} title - Book title to check if it exists
 * @description Check if a book is present in the system
 */
router.post(
    '/checkBookPresent',
    validateRequestBody(checkBookPresentSchema),

);

/**
 * @route POST /books/create
 * @group books - Operations related to book management
 * @param {string} title - Book title (required)
 * @param {string} author - Author ID (optional)
 * @param {string} description.short - Short description (optional)
 * @param {string} description.long - Long description (optional)
 * @param {number} price - Price of the book (required)
 * @param {string} edition - Edition ID (optional)
 * @param {array} images - Array of images with {name, imageURL} (optional)
 * @param {string} category - Category ID (optional)
 * @param {number} pages - Number of pages (optional)
 * @description Create a new book entry
 */
router.post(
    '/create',
      validateRequestBody(CreateBookSchema),

);

/**
 * @route PUT /books/update
 * @group books - Operations related to book management
 * @param {string} title - Book title (min: 3, max: 100 characters)
 * @param {string} author - Author's ObjectId reference
 * @param {object} description - Description object containing short and long descriptions
 * @param {string} description.short - Short description (min: 10, max: 200 characters)
 * @param {string} description.long - Long description (min: 50, max: 500 characters)
 * @param {number} price - Price of the book (must be greater than 0)
 * @param {string} edition - Edition's ObjectId reference
 * @param {array} images - Array of image objects
 * @param {string} images.name - Name of the image
 * @param {string} images.imageURL - URL of the image (must be a valid URI)
 * @param {string} category - Category's ObjectId reference
 * @param {number} pages - Number of pages (must be an integer and at least 1)
 * @description Update an existing book entry
 */
router.put(
    '/update',
    validateRequestBody(UpdateBookSchema),

);

/**
 * @route DELETE /books/delete
 * @group books - Operations related to book management
 * @param {string} bookId - Book ID to delete
 * @description Delete a book from the system
 */
router.delete(
   '/delete',
    validateRequestBody(DeleteBookSchema),

);
