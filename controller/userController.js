const User = require("./../models/users");
const fs = require("fs");

const homePage = async (req, res) => {
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
};

const viewAddUsersPage = (req, res) => {
	res.render("add", {
		title: "Add users",
	});
};

const addUsers = (req, res) => {
	const users = new User({
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		image: req.file.filename,
		password: req.body.password,
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
};

const viewEditUserPage = async (req, res) => {
	let id = req.params.id;
	var user = await User.findById(id);

	if (!user) {
		res.redirect("/");
	} else {
		res.render("edit", {
			title: "Edit user page",
			user,
		});
	}
};

const updateAUser = async (req, res) => {
	let id = req.params.id;
	let new_image = "";

	if (req.file) {
		new_image = req.file.filename;
		try {
			fs.unlinkSync("./uploads/" + req.body.old_image);
		} catch (err) {
			console.log(err);
		}
	} else {
		new_image = req.body.old_image;
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
};

const deleteAUser = async (req, res) => {
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
};

const dashboard = (req, res) => {
	const usersEmail = req.session.email;
	res.render("user/dashboard", {
		title: "Dashboard",
		usersEmail,
	});
};

// Export the controller functions
module.exports = {
	viewAddUsersPage,
	addUsers,
	viewEditUserPage,
	updateAUser,
	homePage,
	deleteAUser,
	dashboard,
};
