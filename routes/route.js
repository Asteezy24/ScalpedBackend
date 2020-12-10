const router = require("express").Router()
const User = require("../mongoose/User")
const Strategy = require("../mongoose/Strategy")

// router.post("/strategy/", (req, res) => {
// 	let strategy = new Strategy({
// 		identifier: req.body.identifier,
// 		action: req.body.action,
// 		alerts: []
// 	})
//
// 	// save strategy as a whole
// 	Strategy.findOne(strategy, (err, strat) => {
// 		if (err) return
// 		if (strat === null) {
// 			strategy.save((err) => {
// 				if (err) {
// 					if (err.name === "MongoError" && err.code === 11000) {
// 						console.log("strat already registered")
// 					}
// 					console.log(err.message)
// 				} else {
// 					console.log("New strat saved!")
// 				}
// 			})
// 		} else {
// 			console.log("strat exists already")
// 		}
// 	})
//
// 	// save strategy to user
// 	let username = req.body.username
// 	User.findOne({ username: username }, (err, user) => {
// 		if (err) return
// 		if (user !== null) {
// 			user.strategies.push(strategy)
// 			user.save((err) => {
// 				if (!err) {
// 					console.log({ error: false, message: "New Strategy Created!" })
// 				}
// 			})
// 			return res.status(200).send({ error: false, message: "New Strategy Created!" })
// 		}
// 		return res.status(400).send({ error: true, message: "Error Creating Strategy" })
// 	})
// })

// router.post("/notification/provider", (req, res) => {
// 	let deviceId = req.body.id
// 	let username = req.body.username
// 	// find username, and update device token
// 	let newData = {
// 		username: username,
// 		deviceToken: deviceId
// 	}
//
// 	User.findOneAndUpdate({ username: username }, newData, (err, user) => {
// 		if (err) return
// 		if (user !== null) {
// 			console.log({ error: false, message: "New Device Token Received!" })
// 		}
// 	})
// 	return res.status(200).send({ error: false, message: "Device Token Sent!" })
// })

module.exports = {
	router: router
}
