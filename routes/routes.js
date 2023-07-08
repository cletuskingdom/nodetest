const express = require("express");
const router = express.Router();
const User = require("./../models/users");
const multer = require("multer");

// Image upload
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads");
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	},
});

var upload = multer({
	storage: storage,
}).single("image");

// Home route
router.get("/", async (req, res) => {
	// Get all users
	var users = await User.find();

	if (!users) {
		res.json({
			message: err.message,
		});
	} else {
		res.render("welcome", {
			title: "Home Page",
			users: users,
		});
	}
});

// View add users page
router.get("/add", (req, res) => {
	res.render("add", {
		title: "Add users",
	});
});

// Add users now
router.post("/add", upload, (req, res) => {
	const users = new User({
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		image: req.file.filename,
	});
	var save_user = users.save();
	if (save_user) {
		req.session.message = {
			type: "success",
			message: "User added successfully",
		};
		res.redirect("/");
	} else {
		res.json({
			type: "danger",
			message: err.message,
		});
	}
});

module.exports = router;
