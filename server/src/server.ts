import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

// initialize express app
const app = express();

// declare our port
const PORT = process.env.PORT || 3001;


// send JSON from front end to backend
app.use(express.json());
// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({extended: true}));
// Serve static files of entire client dist folder
app.use(express.static('../client/dist'));

// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
