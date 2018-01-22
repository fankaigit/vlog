const log = require('../../src/utils/log.js')
const store = require('./store')
const db = store.db
const dbget = store.dbget
const dbrun = store.dbrun
const dball = store.dball

const createTemplateTableSql = 'CREATE TABLE IF NOT EXISTS template (' +
  'id INTEGER PRIMARY KEY,' +
  'uid INTEGER NOT NULL, ' +
  'content TEXT NOT NULL' +
  ')'

async function initTemplateTable() {
  db.run(createTemplateTableSql)
  let row = await dbget('SELECT COUNT(*) AS cnt FROM template')
  log.info('current template count:', row.cnt)
}
db.serialize(initTemplateTable)

// interface
async function getTemplates () {
  try {
    let rows = await dball('SELECT * FROM template')
    let res = {}
    for (let row of rows) {
      row.content = JSON.parse(row.content)
      res[row.id] = row
    }
    return res
  } catch (err) {
    log.error(err)
  }
}

async function addTemplate (uid, content) {
  try {
    await dbrun('INSERT INTO template (id, uid, content) VALUES (?, ?, ?)', [Date.now(), uid, content])
    return true
  } catch (err) {
    log.error(err)
    return false
  }
}

async function updateTemplate (id, uid, content) {
  try {
    await dbrun('UPDATE template SET content = ? WHERE id = ? AND uid = ?', [content, id, uid])
    return true
  } catch (err) {
    log.error(err)
    return false
  }
}

async function deleteTemplate (id, uid) {
  try {
    await dbrun('DELETE FROM template WHERE id = ? AND uid = ?', [id, uid])
    return true
  } catch (err) {
    log.error(err)
    return false
  }
}

module.exports = {
  getTemplates,
  addTemplate,
  updateTemplate,
  deleteTemplate
}
