const db = require('./database')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const saltrounds = 10;

let activeTokens = [{
    token: 'admin',
    load: 1,
    time: new Date()
}]
const createUser = async (username, email, password) => {
    let connection = await db.getConnection()
    try {
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        const result = await connection.query('INSERT INTO User (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

        if (result) {
            return {
                success: true,
                status: 200,
                message: 'User created',
                token: GenerateToken(result[0].insertId)
            };
        }
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return {
                success: false,
                status: 409,
                message: 'User already exists'
            };
        } else {
            return {
                success: false,
                status: 500,
                message: 'Internal server error'
            };
        }
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
};

const AuthenticateUser = async (email, password) => {
    const connection = await db.getConnection();
    try {
        const [rows, fields] = await connection.query('SELECT * FROM User WHERE email = ?', [email]);

        if (rows.length === 0) {
            return {
                success: false,
                status: 404,
                message: 'User not found'
            };
        }

        const isMatch = await bcrypt.compare(password, rows[0].password);

        if (isMatch) {
            return {
                success: true,
                status: 200,
                message: 'User authenticated',
                token: GenerateToken(rows[0].user_id)
            };
        } else {
            return {
                success: false,
                status: 401,
                message: 'Incorrect password'
            };
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            status: 500,
            message: 'Internal server error'
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const GetUser = async (id) => {
    const connection = await db.getConnection();
    try {
        const [rows, fields] = await connection.query('SELECT * FROM User WHERE user_id = ?', [id]);
        return {
            user: rows[0]
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            status: 500,
            message: 'Internal server error'
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

const updateBalance = async (id, balance) => {
    const connection = await db.getConnection();
    try {
        const [rows, fields] = await connection.query('UPDATE User SET balance = ? WHERE user_id = ?', [balance, id]);
        return {
            success: true,
            status: 200,
            message: 'Balance updated'
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            status: 500,
            message: 'Internal server error'
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }
}


const GenerateToken = (id) => {
    const token = uuidv4()
    activeTokens.push({
        token: token,
        load: id,
        time: Date.now()
    })
    return token
}


const ValidateToken = async (token) => {
    for (let i = 0; i < activeTokens.length; i++) {
        if (activeTokens[i].token == token) {
            if (activeTokens[i].time + 3600000 < Date.now()) {
                activeTokens.splice(i, 1)
                return {
                    success: false,
                    status: 401,
                    message: 'Token expired'
                }
            }
            const load = await GetUser(activeTokens[i].load)
            return {
                success: true,
                status: 200,
                load: load
            }
        }
    }
    return {
        success: false,
        status: 404,
        message: 'Token not found'
    }
}


module.exports = {
    createUser,
    AuthenticateUser,
    GetUser,
    GenerateToken,
    ValidateToken,
    updateBalance
}