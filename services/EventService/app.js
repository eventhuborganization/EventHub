const express = require('express')
const session = require('express-session')

const app = express()
app.use(session(
  secret: '343ji43j4n3jn4jk3n'
))