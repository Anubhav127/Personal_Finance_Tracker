import { validationResult } from "express-validator";
import pool from "../config/database.js";

//create a new transaction
const createTransaction = async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { amount, type, category, date, description } = req.body;
        const userId = req.user.userId;

        const result = await pool.query(`INSERT INTO transactions (user_id, amount, type, category, date, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
            [userId, amount, type, category, date, description || null]);

        const transaction = result.rows[0];

        res.status(201).json({
            transaction: {
                id: transaction.id,
                userId: transaction.user_id,
                amount: parseFloat(transaction.amount),
                type: transaction.type,
                category: transaction.category,
                date: transaction.date,
                description: transaction.description,
            }
        });

    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Server error creating transaction' });
    }
}

//update an existing transaction
const updateTransaction = async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        const { amount, type, category, date, description } = req.body;
        const userId = req.user.userId;
        const userRole = req.user.role;

        //check if the transaction exists
        const existingTransaction = await pool.query(`SELECT * FROM transactions WHERE id = $1`, [id]);
        if (existingTransaction.rows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const transactionOwnerId = existingTransaction.rows[0].user_id;

        //check if the user is authorized to update the transaction or not
        if (userRole !== 'admin' && transactionOwnerId !== userId) {
            return res.status(403).json({ message: 'Forbidden: You are not allowed to update this transaction' });
        }

        const result = await pool.query(`UPDATE transactions SET
            amount = $1,
            type = $2,
            category = $3,
            date = $4,
            description = $5
            WHERE id = $6
            RETURNING *`,
            [amount, type, category, date, description || null, id]);

        const transaction = result.rows[0];

        res.status(200).json({
            transaction: {
                id: transaction.id,
                userId: transaction.user_id,
                amount: parseFloat(transaction.amount),
                type: transaction.type,
                category: transaction.category,
                date: transaction.date,
                description: transaction.description,
            }
        });

    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Server error updating transaction' });
    }
}

//delete a transaction
const deleteTransaction = async (req, res) => {

    try {

        const id = req.params.id;
        const userId = req.user.userId;
        const userRole = req.user.role;

        //check if the transaction exists
        const existingTransaction = await pool.query(`SELECT * FROM transactions WHERE id = $1`, [id]);
        if (existingTransaction.rows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        //check if the user is authorized to delete the transaction or not
        const transactionOwnerId = existingTransaction.rows[0].user_id;
        if (userRole !== 'admin' && transactionOwnerId !== userId) {
            return res.status(403).json({ message: 'Forbidden: You are not allowed to delete this transaction' });
        }

        const result = await pool.query(`DELETE FROM transactions WHERE id = $1 RETURNING *`, [id]);

        const transaction = result.rows[0];

        res.status(200).json({
            message: 'Transaction deleted successfully',
        });

    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Server error deleting transaction' });
    }
}

const getTransactions = async (req, res) => {

    try {

        const userId = req.user.userId;
        const userRole = req.user.role;

        const { category, description, startDate, endDate, page = 1, limit = 20 } = req.query;

        //build the query dynamically based on filters
        const conditions = [];
        const values = [];
        let paramCount = 1;

        //only fetch tansactions of the logged in user unless admin
        if (userRole !== 'admin') {
            conditions.push(`user_id = $${paramCount}`);
            values.push(userId);
            paramCount++;
        }

        if (category) {
            conditions.push(`category = $${paramCount}`);
            values.push(category);
            paramCount++;
        }

        if (description) {
            conditions.push(`description ILIKE $${paramCount}`);
            values.push(`%${description}%`);
            paramCount++;
        }

        if (startDate) {
            conditions.push(`date >= $${paramCount}`);
            values.push(startDate);
            paramCount++;
        }
        if (endDate) {
            conditions.push(`date <= $${paramCount}`);
            values.push(endDate);
            paramCount++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ` + conditions.join(' AND ') : '';

        const countResult = await pool.query(`SELECT COUNT(*) FROM transactions ${whereClause}`, values);
        const total = parseInt(countResult.rows[0].count);

        //calculate pagination values
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        const pages = Math.ceil(total / limitNum);

        //fetch transactions with pagination
        const result = await pool.query(`SELECT * FROM transactions ${whereClause}
            ORDER BY date DESC
            LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
            [...values, limitNum, offset]
        );

        const transactions = result.rows.map(transaction => ({
            id: transaction.id,
            userId: transaction.user_id,
            amount: parseFloat(transaction.amount),
            type: transaction.type,
            category: transaction.category,
            date: transaction.date,
            description: transaction.description,
        }));

        res.json({
            transactions,
            total,
            page: pageNum,
            pages,
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Server error fetching transactions' });
    }

}

export { createTransaction, updateTransaction, deleteTransaction, getTransactions };