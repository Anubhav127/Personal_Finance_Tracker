import { body } from 'express-validator';


// Validation rules for user registration
const validateRegistration = [
    body('username')
        .notEmpty()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters long')
        .trim(),
    body('email')
        .notEmpty()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail()
        .trim(),
    body('password')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Invalid role specified'),
];


//validation rule for user login
const loginValidation = [
    body('email')
        .notEmpty()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail()
        .trim(),
    body('password')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
];


//validation rule for transaction creation
const transactionCreateValidation = [
    body('amount')
        .notEmpty()
        .withMessage('Amount is required')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be a positive number'),
    body('type')
        .notEmpty()
        .withMessage('Type is required')
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be between 1 and 50 characters'),
    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 date'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
];


//validation rule for transaction update
const transactionUpdateValidation = [
    body('amount')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be a positive number'),
    body('type')
        .optional()
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    body('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be between 1 and 50 characters'),
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 date'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
];

export { validateRegistration, loginValidation, transactionCreateValidation, transactionUpdateValidation };