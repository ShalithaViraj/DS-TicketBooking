// Import Packages
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fileUpload = require('express-fileupload');
const cors = require("cors");
const morgan = require('morgan');

// Init express app
const app = express();

// Env file config
dotenv.config();

// Config PORT
const PORT = process.env.PORT;

// Connect DB
mongoose.connect(
    process.env.MONGODB_URI,
    {  },
    (err) => {
        if (err) throw err;
        console.log("Connected to the mongodb");
    }
);

// Middlewares
app.use(express.json());
app.use(
    cors({
        exposedHeaders: "auth-token",
    })
);
app.use(morgan('common'));
app.use(fileUpload());
app.use(express.static(__dirname + '/public'));

// Import routes
const UserRoutes = require("./routes/UserRoute");
const MovieRoute = require("./routes/MovieRoute");
const TheaterRouter = require('./routes/TheaterRouter');
const CartRoute = require('./routes/CartRoute');
const ReservationRoute = require('./routes/ReservationRoute');

// Config routes
app.use("/api/user", UserRoutes);
app.use("/api/movie", MovieRoute);
app.use("/api/theater", TheaterRouter);
app.use("/api/cart", CartRoute);
app.use("/api/reservation", ReservationRoute);

// Start server
app.listen(PORT, () => {
    console.log("Server is up and running on server on " + PORT);
});