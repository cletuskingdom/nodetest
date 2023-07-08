const express = require("express");
const router = express.Router();
const User = require("./../models/users");
const multer = require("multer");
const fs = require("fs");

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

// View edit users page
router.get("/edit/:id", async (req, res) => {
	let id = req.params.id;
	User.findById(id);

	var user = await User.findById(id);

	if (!user) {
		res.redirect("/");
	} else {
		res.render("edit", {
			title: "Edit user page",
			user: user,
		});
	}
});

// update a user
router.post("/update/:id", upload, async (req, res) => {
	let id = req.params.id;
	let new_image = "";

	if (req.file) {
		new_image = req.file.filename;

		try {
			fs.unlinkSync("./uploads/" + req.body.old_iage);
		} catch (err) {
			console.log(err);
		}
	} else {
		new_image = req.body.old_iage;
	}

	// Update the user by ID
	const update_user = await User.findByIdAndUpdate(id, {
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		image: new_image,
	});

	if (!update_user) {
		res.json({
			type: "danger",
			message: err.message,
		});
	} else {
		req.session.message = {
			type: "success",
			message: "User udpated successfully",
		};
		res.redirect("/");
	}
});

// delete a user
router.get("/delete/:id", async (req, res) => {
	let id = req.params.id;

	// Update the user by ID
	const delete_user = await User.findByIdAndDelete(id);

	if (delete_user.image != "") {
		try {
			fs.unlinkSync("./uploads/" + delete_user.image);
		} catch (err) {
			console.log(err);
		}
	}

	if (!delete_user) {
		res.json({
			type: "danger",
			message: err.message,
		});
	} else {
		req.session.message = {
			type: "info",
			message: "User deleted successfully",
		};
		res.redirect("/");
	}
});

module.exports = router;
