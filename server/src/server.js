const log = require('../../src/utils/log.js')
const Koa = require('koa')
const app = new Koa()

// logger
app.use(async (ctx, next) => {
  const start = Date.now()
  try {
    await next()
  } finally {
    const ms = Date.now() - start
    log.info(`${ctx.method} ${ctx.url} - cost ${ms} ms`)
  }
})

// cors
const cors = require('koa2-cors')
app.use(cors({
  origin: () => '*'
}))

// body parser
const koaBody = require('koa-body')
app.use(koaBody({
  jsonLimit: '1mb'
}))

// public zone
const Router = require('koa-router')
const nonSecured = new Router()
nonSecured.get('/s/vlog/templates', async (ctx) => {
  try {
    let res = await templateStore.getTemplates()
    ctx.body = res
  } catch (err) {
    log.error(err)
  }
})
app.use(nonSecured.routes())

// auth
const session = require('koa-session')
app.keys = ['yet-to-set-a-better-secret']
app.use(session({renew: true, maxAge: 8640000000}, app))

const auth = require('./auth')
app.use(auth.passport.initialize())
app.use(auth.passport.session())
app.use(auth.pub.routes())
app.use(auth.guard)

// response
const fs = require('fs')
const templateStore = require('./templateStore')
const secured = new Router()
secured.get('/s/vlog/data/:id', async (ctx) => {
  try {
    let uid = ctx.state.user.id
    ctx.body = fs.readFileSync(`data/${uid}`)
  } catch (err) {
    log.error(err)
  }
}).post('/s/vlog/data/:id', async (ctx) => {
  try {
    let uid = ctx.state.user.id
    let content = JSON.stringify(ctx.request.body)
    // log.info(`${ctx.params.id} => ${content}`)
    fs.writeFileSync(`data/${uid}`, content)
    ctx.body = 'saved'
  } catch (err) {
    log.error(err)
  }
}).post('/s/vlog/templates', async (ctx) => {
  try {
    let uid = ctx.state.user.id
    let content = JSON.stringify(ctx.request.body)
    templateStore.addTemplate(uid, content)
    ctx.body = 'saved'
  } catch (err) {
    log.error(err)
  }
}).put('/s/vlog/templates/:id', async (ctx) => {
  try {
    let id = ctx.params.id
    let uid = ctx.state.user.id
    let content = JSON.stringify(ctx.request.body)
    templateStore.updateTemplate(id, uid, content)
    ctx.body = 'saved'
  } catch (err) {
    log.error(err)
  }
}).delete('/s/vlog/templates/:id', async (ctx) => {
  try {
    let id = ctx.params.id
    let uid = ctx.state.user.id
    templateStore.deleteTemplate(id, uid)
    ctx.body = 'saved'
  } catch (err) {
    log.error(err)
  }
})
app.use(secured.routes())

// server
const http = require('http')
http.createServer(app.callback()).listen(3000)
log.info('vlog server started')
