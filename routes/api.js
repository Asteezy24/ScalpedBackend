const express = require("express")
const notificationRouter = require("./notifications")
const app = express()

app.use("/notification/", notificationRouter)

module.exports = app