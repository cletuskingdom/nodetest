const express = require("express");
const router = express.Router();

// Home route
router.get("/", (req, res) => {
	res.render("welcome", {
		title: "Welcome Page",
	});
});

// Add users
router.get("/add", (req, res) => {
	res.render("add", {
		title: "Add users",
	});
});

module.exports = router;
