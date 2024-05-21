const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));


// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Define a simple route to check everything is working
app.get('/', (req, res) => {
    res.render('pages/index');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
