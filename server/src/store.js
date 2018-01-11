const log = require('../../src/utils/log.js')

const sqlite3 = require('sqlite3').verbose()
const dbFile = 'data/db'
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    log.error(`Error open ${dbFile}: `, err)
    process.exit()
  }
  log.info(`Connected to ${dbFile}`)
})

function handleError (err) {
  if (err) {
    log.error(err)
  }
}

const initSql = 'CREATE TABLE IF NOT EXISTS user (' +
  'id INTEGER PRIMARY KEY,' +
  'username TEXT NOT NULL, ' +
  'password TEXT NOT NULL)'

function initDb () {
  db.serialize(function () {
    db.run(initSql, handleError)
    db.get('SELECT COUNT(*) AS cnt FROM user', (err, row) => {
      handleError(err)
      log.info('user count:', row.cnt)
    })
  })
}
initDb()

process.on('SIGINT', function () {
  log.error('Caught interrupt signal, will save data and exit!')
  db.close((err) => {
    if (err) {
      log.error(`Error close ${dbFile}: `, err)
    }
    process.exit()
  })
})

// users
// FIXME
async function getUser (id) {
  db.get('SELECT * FROM user WHERE id=?', [id], (err, row) => {
    handleError(err)
    log.info(JSON.stringify(row))
    return row
  })
}

module.exports = {
  getUser: getUser
}
