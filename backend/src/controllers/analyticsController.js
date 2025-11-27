import pool from '../config/database.js';

//get monthly analytics
const getMonthlyAnalytics = async (req, res) => {
    try {

        const userId = req.user.userId;
        const userRole = req.user.role;

        const year = req.query.year || new Date().getFullYear();

        //fetch from database
        const query = userRole === 'admin'
            ? `SELECT 
           TO_CHAR(date, 'YYYY-MM') as month,
           SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
           SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
         FROM transactions
         WHERE EXTRACT(YEAR FROM date) = $1
         GROUP BY TO_CHAR(date, 'YYYY-MM')
         ORDER BY month`
            : `SELECT 
           TO_CHAR(date, 'YYYY-MM') as month,
           SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
           SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
         FROM transactions
         WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2
         GROUP BY TO_CHAR(date, 'YYYY-MM')
         ORDER BY month`;

        const values = userRole === 'admin' ? [year] : [userId, year];
        const result = await pool.query(query, values);

        //calculate net for each month
        const months = result.rows.map(row => ({
            month: row.month,
            income: parseFloat(row.income),
            expense: parseFloat(row.expense),
            net: parseFloat(row.income) - parseFloat(row.expense)
        }));

        const response = { months };

        res.json(response);

    } catch (error) {
        console.error('Error fetching monthly analytics:', error);
        res.status(500).json({ message: 'Server error fetching monthly analytics' });
    }
}


//get category breakdown for specified period of time

const getCategoryBreakdown = async (req, res) => {

    try {

        const userId = req.user.userId;
        const userRole = req.user.role;
        const { startDate, endDate } = req.query;

        let query, values;

        if (userRole === 'admin') {
            if (startDate && endDate) {
                query = `SELECT 
                   category,
                   SUM(amount) as amount,
                   COUNT(*) as count
                 FROM transactions
                 WHERE type = 'expense' AND date >= $1 AND date <= $2
                 GROUP BY category
                 ORDER BY amount DESC`;
                values = [startDate, endDate];
            } else if (startDate) {
                query = `SELECT 
                   category,
                   SUM(amount) as amount,
                   COUNT(*) as count
                 FROM transactions
                 WHERE type = 'expense' AND date >= $1
                 GROUP BY category
                 ORDER BY amount DESC`;
                values = [startDate];
            } else if (endDate) {
                query = `SELECT 
                   category,
                   SUM(amount) as amount,
                   COUNT(*) as count
                 FROM transactions
                 WHERE type = 'expense' AND date <= $1
                 GROUP BY category
                 ORDER BY amount DESC`;
                values = [endDate];
            } else {
                query = `SELECT 
                   category,
                   SUM(amount) as amount,
                   COUNT(*) as count
                 FROM transactions
                 WHERE type = 'expense'
                 GROUP BY category
                 ORDER BY amount DESC`;
                values = [];
            }
        } else {
            if (startDate && endDate) {
                query = `SELECT 
                   category,
                   SUM(amount) as amount,
                   COUNT(*) as count
                 FROM transactions
                 WHERE user_id = $1 AND type = 'expense' AND date >= $2 AND date <= $3
                 GROUP BY category
                 ORDER BY amount DESC`;
                values = [userId, startDate, endDate];
            } else if (startDate) {
                query = `SELECT 
                   category,
                   SUM(amount) as amount,
                   COUNT(*) as count
                 FROM transactions
                 WHERE user_id = $1 AND type = 'expense' AND date >= $2
                 GROUP BY category
                 ORDER BY amount DESC`;
                values = [userId, startDate];
            } else if (endDate) {
                query = `SELECT 
                   category,
                   SUM(amount) as amount,
                   COUNT(*) as count
                 FROM transactions
                 WHERE user_id = $1 AND type = 'expense' AND date <= $2
                 GROUP BY category
                 ORDER BY amount DESC`;
                values = [userId, endDate];
            } else {
                query = `SELECT 
                   category,
                   SUM(amount) as amount,
                   COUNT(*) as count
                 FROM transactions
                 WHERE user_id = $1 AND type = 'expense'
                 GROUP BY category
                 ORDER BY amount DESC`;
                values = [userId];
            }
        }

        const result = await pool.query(query, values);

        //calculate total for percentages
        const total = result.rows.reduce((sum, row) => sum + parseFloat(row.amount), 0);

        // Calculate percentages and format data
        const categories = result.rows.map(row => ({
            category: row.category,
            amount: parseFloat(row.amount),
            percentage: total > 0 ? (parseFloat(row.amount) / total) * 100 : 0,
            count: parseInt(row.count),
        }));

        const response = { categories };

        res.json(response);

    } catch (error) {
        console.error('Error fetching category breakdown:', error);
        res.status(500).json({ message: 'Server error fetching category breakdown' });
    }
}

//Get income vs expense trends for past 12 months
const getIncomeExpenseTrends = async (req, res) => {

    try {

        const userId = req.user.userId;
        const userRole = req.user.role;

        //get data for past 12 months
        const query = userRole === 'admin'
            ? `SELECT 
           TO_CHAR(date, 'YYYY-MM') as period,
           type,
           SUM(amount) as value
         FROM transactions
         WHERE date >= CURRENT_DATE - INTERVAL '12 months'
         GROUP BY TO_CHAR(date, 'YYYY-MM'), type
         ORDER BY period, type`
            : `SELECT 
           TO_CHAR(date, 'YYYY-MM') as period,
           type,
           SUM(amount) as value
         FROM transactions
         WHERE user_id = $1 AND date >= CURRENT_DATE - INTERVAL '12 months'
         GROUP BY TO_CHAR(date, 'YYYY-MM'), type
         ORDER BY period, type`;

        const values = userRole === 'admin' ? [] : [userId];
        const result = await pool.query(query, values);

        // Format trend data
        const trends = result.rows.map(row => ({
            period: row.period,
            type: row.type,
            value: parseFloat(row.value),
        }));

        const response = { trends };

        res.json(response);

    } catch (error) {
        console.error('Error fetching income vs expense trends:', error);
        res.status(500).json({ message: 'Server error fetching income vs expense trends' });
    }
}

export {
    getMonthlyAnalytics,
    getCategoryBreakdown,
    getIncomeExpenseTrends,
};