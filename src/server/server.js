const Koa = require('koa')
const log = require('../utils/log.js')
const http = require('http')
const Router = require('koa-router')
const fs = require('fs')
const koaBody = require('koa-body')
var cors = require('koa2-cors');

const app = new Koa()
const router = new Router()

// logger
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  log.info(`${ctx.method} ${ctx.url} - cost ${ms} ms`)
})

app.use(cors({
  origin: function(ctx) {
    return '*'
  }
}))

app.use(koaBody({
  jsonLimit: '1mb'
}))

// response
router.get('/vlog/data/:id', async (ctx) => {
  try {
    ctx.body = fs.readFileSync(`data/${ctx.params.id}`)
  } catch (err) {
    log.error(err)
  }
}).post('/vlog/data/:id', async (ctx) => {
  try {
    let content = JSON.stringify(ctx.request.body)
    log.info(`${ctx.params.id} => ${content}`)
    fs.writeFileSync(`data/${ctx.params.id}`, content)
    ctx.body = 'saved'
  } catch (err) {
    log.error(err)
  }
})

app.use(router.routes())

http.createServer(app.callback()).listen(3000)
log.info('vlog server started')
