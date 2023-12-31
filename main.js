// Imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 2000;

const DB_URL =
	process.env.NODE_ENV === "production"
		? process.env.PRODUCTION_DB_URL
		: process.env.LOCAL_DB_URL;

// database connection
mongoose.connect(DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to the database!"));

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
	session({
		secret: "my secret key",
		saveUninitialized: true,
		resave: false,
	})
);
app.use((req, res, next) => {
	res.locals.message = req.session.message;
	delete req.session.message;
	next();
});
app.use(express.static("uploads"));

// Set template engine
app.set("view engine", "ejs");

// Route prefix - this points to all my routes
app.use("", require("./routes/routes"));

// Start the server
app.listen(port, () => {
	console.log(`Server listening on port http://localhost:${port}`);
});
