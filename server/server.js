//Server logic.
const path = require('path');
const express = require('express');

const app = express();
const port = 3000;

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));
// console.log('====================================');
// console.log(__dirname + '../public');
// console.log('====================================');
// console.log(publicPath);

//Routes...


app.listen(port, () => {
    console.log('====================================');
    console.log(`Application running on port: ${port}`);
    console.log('====================================');
});