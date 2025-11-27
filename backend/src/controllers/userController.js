import pool from '../config/database.js';

//Get user profile
const getUserProfile = async (req, res) => {
    try {

        const result = await pool.query('SELECT id, username, email, role FROM users;');

        const users = result.rows.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }));

        res.status(200).json({ users });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

//update user profile
const updateUserProfile = async (req, res) => {

    try {

        const userId = req.params.id;
        const { role } = req.body;

        //validate role
        const validRoles = ['user', 'admin', 'read-only'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }
        
        //check if user exists
        const userCheck = await pool.query('SELECT id FROM users WHERE id = $1;', [userId]);
        if(userCheck.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        //update user role
        const result = await pool.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role;', [role, userId]);

        const user = result.rows[0];

        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }

}

export { getUserProfile, updateUserProfile };