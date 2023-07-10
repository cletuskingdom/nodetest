const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const User = require("./../models/users");
const authController = require("./../controller/authController");
const bcrypt = require("bcrypt");
const userController = require("./../controller/userController");

// Implement a middleware function to restrict access to protected routes:
function requireLogin(req, res, next) {
	if (!req.session.userId) {
		return res.redirect("/login"); // Redirect unauthenticated users to the login page
	}
	next(); // If authenticated, proceed to the next middleware or route handler
}

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

// Welcome route
router.get("/", userController.homePage);

// View add users page
router.get("/add", userController.viewAddUsersPage);

// Add users now
router.post("/add", upload, userController.addUsers);

// View edit users page
router.get("/edit/:id", userController.viewEditUserPage);

// update a user
router.post("/update/:id", upload, userController.updateAUser);

// delete a user
router.get("/delete/:id", userController.deleteAUser);

// view the login page
router.get("/login", authController.viewLogin);

// login a user
router.post("/login", authController.login);

// view the register page
router.get("/register", authController.viewRegister);

// register a user
router.post("/register", upload, authController.register);

// Protected route - only accessible after successful login
router.get("/dashboard", requireLogin, userController.dashboard);

// Logout route
router.get("/logout", requireLogin, authController.logout);

module.exports = router;
