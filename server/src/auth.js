const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
const log = require('../src/utils/log.js')
const Router = require('koa-router')

// koa passport
passport.serializeUser(function (user, done) {
  log.info('serialize user:', user)
  done(null, user.id)
})

passport.deserializeUser(async function (id, done) {
  log.info('deserialize userId:', id)
  var user = users[id]
  if (user) {
    done(null, user)
  } else {
    done(null, false)
  }
})

passport.use(new LocalStrategy(function(username, password, done) {
  for (let u of users) {
    if (u.username === username && u.password === password) {
      log.info('matched:', u)
      done(null, u)
    }
    log.info('not matched:', username, password)
    done(null, false)
  }
}))

// auth router

// TODO user storage and encrypt
let users = [{id: 0, username: 'admin', password: 'admin'}]

const pub = new Router()
pub.post('/s/logout', function (ctx) {
  ctx.logout()
  ctx.redirect('s/status')
}).post('/s/login',
  passport.authenticate('local', {
    successRedirect: '/s/status',
    failureRedirect: '/s/status'
  })
).post('/s/register', async (ctx) => {
  log.info('register:', JSON.stringify(ctx.request.body))
  let u = ctx.request.body
  u.id = users.length
  users.push(u)
  ctx.login(u)
  ctx.redirect('/s/status')
}).get('/s/status', async (ctx) => {
  if (ctx.isAuthenticated()) {
    let user = ctx.state.user
    ctx.body = {username: user.username, uid: user.id}
  } else {
    ctx.throw(401)
  }
})

async function guard (ctx, next) {
  if (ctx.isAuthenticated()) {
    await next()
  } else {
    ctx.body = {success: false}
    ctx.throw(401)
  }
}

module.exports = {
  pub: pub,
  guard: guard,
  pass: passport
}
