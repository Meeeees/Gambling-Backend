const auth = require('./authentication')
const db = require('./database')

const diceRoll = async (body) => {
    body.guesses = body.guesses.map(x => parseInt(x))
    body.bet = parseInt(body.bet)
    let data = await auth.ValidateToken(body.token)
    if (!data.success) {
        res.status(data.status).send(data.message)
        return
    }
    data = data.load.user
    let balance = parseInt(data.balance)
    if (data.balance < parseInt(body.bet)) {
        console.log(data.balance, body.bet)
        res.status(400).send({ 'error': 'Insufficient funds' })
        return
    }
    for (const guess of body.guesses) {
        if (body.guesses.filter(x => x == guess).length > 1) {
            return { 'status': 400, 'load': { 'error': 'duplicate guess' } }
            return
        }
        if (guess < 1 || guess > 6) {
            console.log(guess)
            return { 'status': 400, 'load': { 'error': 'Invalid guess' } }
            return
        }
    }
    let roll = Math.floor(Math.random() * 6) + 1
    let win = body.guesses.includes(roll)
    let outcome = 0;
    if (win) {
        if (body.guesses.length == 1) {
            outcome = body.bet * 5
        } else if (body.guesses.length == 2) {
            outcome += body.bet * 3
        } else if (body.guesses.length == 3) {
            outcome = body.bet * 2
        }
    } else {
        outcome -= body.bet
    }
    await auth.updateBalance(data.user_id, balance + outcome)
    await LogBet(data.user_id, 'dice', balance, balance + outcome, roll, body.guesses)
    return {
        'status': 200,
        'load': {
            'roll': roll, 'win': win, 'outcome': outcome, 'newBalance': balance + outcome, 'amount of guesses': body.guesses.length
        }
    }
}

const LogBet = async (user_id, game, balance, newBalance, roll, guesses) => {
    let connection = await db.getConnection()
    try {
        let [rows, fields] = await connection.query('INSERT INTO Bet (user_id, game, balance, newBalance, roll) VALUES (?, ?, ?, ?, ?)', [user_id, game, balance, newBalance, roll])
        console.log(guesses)
        guesses.forEach(async guess => {
            await connection.query('INSERT INTO guess (bet_id, guess) VALUES (?, ?)', [rows.insertId, guess])
        });
        return true
    } catch (error) {
        console.error(error);
        return false
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = { diceRoll }