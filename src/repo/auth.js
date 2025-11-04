const db = require('./connector')

exports.create = async (usernsme, password, role) => {
    const result = await db.execute('INSERT INTO auth (username,password,role) VALUES (?,?,?) ;',[usernsme, password, role])
    return result[0].insertId;
}

exports.remove_by_id = async (auth_id) => {
    const result = await db.execute('UPDATE auth SET isRemove = true WHERE id = ? ;',[auth_id])
}

exports.get_by_id = async (auth_id) => {
    const [row] = await db.execute('SELECT * FROM auth WHERE id = ? ;',[auth_id])
    return row
}

exports.get_by_username = async (usernsme) => {
    const [row] = await db.execute('SELECT * FROM auth WHERE username = ? ;',[usernsme])
    return row
}

exports.listing = async() => {
    const [row] = await db.execute('SELECT * FROM auth WHERE isRemove = false;')
    return row
    
}