const db = require('./database')
const bcrypt = require('bcryptjs')
const saltrounds = 10;
const CreateUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, saltrounds)
    console.log(hashedPassword)
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password])
}