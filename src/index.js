const express = require('express')
const port = require('./config/port')

const userRouter = require('./router/userRouter')
const taskRouter = require('./router/taskRouter')

const app = express()
// const port = process.env.port || 2019

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Berhasil Running di_ ' + port);
})