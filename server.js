const express = require('express');
const productsRoute = require('./API/productApi');
const usersRoute = require('./API/userApi');
const bodyParser = require('body-parser');
const cors = require('cors')

require("dotenv").config()

const app = express();
app.use(express.json());
app.use(cors())
app.use(bodyParser.json());
app.use('/products', productsRoute);
app.use('/user', usersRoute);

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Server is running on port ${port}...`));
