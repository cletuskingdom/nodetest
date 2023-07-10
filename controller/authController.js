const express = require("express");
const session = require("express-session");
const User = require("./../models/users");
const router = express.Router();
const bcrypt = require("bcrypt");

// Apply session middleware as global middleware
router.use(
	session({
		secret: "your-secret-key",
		resave: false,
		saveUninitialized: false,
	})
);

const viewLogin = (req, res) => {
	if (req.session.userId) {
		return res.redirect("/dashboard");
	}

	res.render("auth/login", {
		title: "Login",
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;

	// Find the user in the database
	const user = await User.findOne({ email: email });
	if (!user) {
		req.session.message = {
			type: "danger",
			message: "Invalid crendentials",
		};
		res.redirect("/login");
	} else {
		// Compare the entered password with the stored hashed password
		const passwordMatch = bcrypt.compareSync(password, user.password);
		if (!passwordMatch) {
			req.session.message = {
				type: "danger",
				message: "Invalid crendentials",
			};
			res.redirect("/login");
		} else {
			// Create a session and store the user ID
			req.session.loggedIn = true;
			req.session.userId = user._id;
			req.session.email = email;
			res.redirect("/dashboard");
		}
	}
};

const viewRegister = (req, res) => {
	if (req.session.userId) {
		return res.redirect("/dashboard");
	}

	res.render("auth/register", {
		title: "Register",
	});
};

const register = async (req, res) => {
	const { name, email, phone, password } = req.body;

	// Check if the username already exists in the database
	// const existingUser = User.find((user) => user.email === email);
	// if (existingUser) {
	// 	return res.status(409).send("Username already exists");
	// }

	const saltRounds = 10;

	// Function to hash a password
	function hashPassword(password) {
		return bcrypt.hashSync(password, saltRounds);
	}

	// //============ Function to compare a password with a hashed password
	// function comparePassword(password, hashedPassword) {
	// 	return bcrypt.compareSync(password, hashedPassword);
	// }

	// //============ Compare the password
	// const isPasswordMatch = comparePassword(plainPassword, hashedPassword);
	// console.log('Password match:', isPasswordMatch);

	// Hash the password
	const hashedPassword = hashPassword(password);

	try {
		// Save the users in the database
		const users = new User({
			name: name,
			email: email,
			image: req.file.filename,
			phone: phone,
			password: hashedPassword,
		});

		var save_user = users.save();
		if (save_user) {
			req.session.message = {
				type: "success",
				message: "Registered successfully",
			};

			// Create a session and store the user ID
			req.session.loggedIn = true;
			req.session.userId = users._id;
			req.session.email = email;
			res.redirect("/dashboard");
		} else {
			res.json({
				type: "danger",
				message: err.message,
			});
		}
	} catch (err) {
		console.log(err);
	}
};

const logout = (req, res) => {
	req.session.destroy();
	res.redirect("/dashboard");
};

// Export the controller functions
module.exports = {
	viewLogin,
	login,
	viewRegister,
	register,
	logout,
};
