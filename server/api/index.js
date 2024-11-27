// server.js
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('../lib/dbConn');
const http = require("http");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

// Importing Router
const authRoute = require("../router/auth-router");
const userRoute = require("../router/user-router");
const adminRoute = require("../router/admin-router");
const devloperRoute = require('../router/developer-router');

// Importing Middlewares
const errorMiddleware = require("../middlewares/error-middleware");

// Server
const app = express();
const server = http.createServer(app);
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://169.254.193.95:5173',
        'http://169.254.204.232:5173',
        'http://192.168.169.112:5173',
        'https://152.56.4.81',
      ],
    methods: "GET,POST,DELETE,PATCH,HEAD,PUT",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true,parameterLimit:1000000,limit:"500mb"}));
app.use(bodyParser.json());
// Error Catch
app.use(errorMiddleware);

// Defining Routes & API
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/dev", devloperRoute);


app.get('/', (req, res) => {
    res.send('Welcome to the API');
});


connectToDatabase()
    .then(() => {
        console.log("Connected to MongoDB successfully");
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    });

// For Vercel
// Connect to database
// connectToDatabase()
//   .then(() => {
//     console.log("Connected to MongoDB successfully");
//   })
//   .catch((error) => {
//     console.error("Error connecting to MongoDB:", error);
//   });

// module.exports = app;