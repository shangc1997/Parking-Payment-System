const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); //forms

// Used to read data from a .env file.
dotenv.config();

// required code to make express sessions work
const session = require("express-session");
app.use(
  session({
    // random string, used to generate and encrypt a unique session id
    secret: "the quick brown fox jumped over the lazy dog 1234567890",
    resave: false,
    saveUninitialized: true,
  }),
);

// database models
const { Parking, User } = require("./db/models");

// http://localhost:3000/
app.get("/", async function (req, res) {
  return res.render("index.ejs", { session: req.session });
});

// Access this endpoint by submitting form data here: http://localhost:3000/
app.post("/parking/purchase", async function (req, res) {
  const { licensePlate, duration } = req.body;
  const durationNumber = Number(duration);

  const licensePlateFromDB = await Parking.findOne({
    licensePlate: licensePlate,
  });

  if (licensePlateFromDB != null) {
    return res.send(
      `<p>ERROR: You already purchased ticket for this license plate</p>
      <a href="/"> Go Back To Home </a>`,
    );
  } else if (durationNumber < 1) {
    return res.send(
      `<p>ERROR: Minimum duration purchase must be 1</p>
      <a href="/"> Go Back To Home </a>`,
    );
  }

  let totalFee = 0;
  if (durationNumber > 4) {
    totalFee = 25;
  } else {
    totalFee = 5.5 * durationNumber;
  }

  await Parking.create({
    duration: durationNumber,
    licensePlate,
    total: totalFee,
  });

  return res.send(
    `You purchased parking!! Total cost of parking is ${totalFee}`,
  );
});

// ----------------------- Endpoints for user accounts

// http://localhost:3000/users/login-form
app.get("/users/login-form", function (req, res) {
  return res.render("login.ejs", { msg: "" });
});

// This endpoint checks if valid username/password entered
// Access this by submitting the form here: http://localhost:3000/users/login-form
app.post("/users/login", async function (req, res) {
  const { email, password } = req.body;

  const userFromDB = await User.findOne({ email, password });

  if (userFromDB === null) {
    return res.render("login.ejs", { msg: "Invalid username/password" });
  } else {
    req.session.currUser = userFromDB;

    return res.redirect("/admin/dashboard");
  }
});

// http://localhost:3000/users/logout
app.get("/users/logout", function (req, res) {
  req.session.destroy();
  return res.redirect("/");
});

// ------------------------ Endpoints for admin functionality

//http://localhost:3000/admin/dashboard
app.get("/admin/dashboard", async function (req, res) {
  const results = await Parking.find();

  if (req.session.currUser === undefined) {
    return res.send(`
        You must be logged in to view this page! 
        <a href="/users/login-form">Go Login</a>
        `);
  } else {
    return res.render("admin-dashboard.ejs", {
      parkingItems: results,
      session: req.session,
    });
  }
});

// Endpoint to look up a parking ticket via POST
// http://localhost:3000/admin/lookup/ABC123
// http://localhost:3000/admin/lookup/YYY000
app.get("/admin/lookup/:licensePlate", async function (req, res) {
  if (req.session.currUser === undefined) {
    return res.send(`
        You must be logged in to view this page! 
        <a href="/users/login-form">Go Login</a>
        `);
  } else {
    const licensePlate = req.params.licensePlate;
    const resultFromDB = await Parking.findOne({
      licensePlate,
    });

    if (resultFromDB === null) {
      return res.send(
        `ERROR: License plate ${licensePlate} did not pay for parking!`,
      );
    } else {
      return res.send(
        `License plate ${resultFromDB.licensePlate} 
      is parked for ${resultFromDB.duration} hour. 
      Paid: $${resultFromDB.total}`,
        {
          session: req.session,
        },
      );
    }
  }
});

// helper function to populate your database the first time
const populateDatabase = async () => {
  // add users
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log("NOTE:  User collection is empty or does not exist");
    await User.insertMany([
      { email: "peter@gmail.com", password: "1111" },
      { email: "jane@gmail.com", password: "1111" },
    ]);
    console.log("NOTE: User Collection created");
  } else {
    console.log("NOTE: User Collection already has data, so skipping");
  }

  // add media items
  const parkingsCount = await Parking.countDocuments();
  if (parkingsCount === 0) {
    console.log("NOTE: Parking collection is empty or does not exist");

    const initialParkings = [
      {
        duration: 1,
        licensePlate: "ABC123",
        total: 5.5,
      },
      {
        duration: 6,
        licensePlate: "DEF999",
        total: 25,
      },
    ];

    await Parking.insertMany(initialParkings);
    console.log("NOTE: Parking collection created");
  } else {
    console.log("NOTE: Parking collection already has data, so skipping");
  }
};

// +++  5. Create a function that connects to the database BEFORE starting the Express web server.
const PORT = 3000;
async function startServer() {
  try {
    // +++ 5a. Attempt to connect to the database using the database connection information you defined in step #2
    await mongoose.connect(process.env.MONGODB_URI);

    // +++ 5b. If tables do not exist in the db, then Mongo will automatically create them

    // +++ 5c. Prepopulate your collections with some data
    await populateDatabase();

    // +++ 5c.  If db connection successful, output success messages. If fail, go to 5d.
    console.log("SUCCESS connecting to MONGO database");
    console.log("STARTING Express web server");

    // +++ 5d.  At this point, db connection should be successful, so start the web server!
    app.listen(PORT, () => {
      console.log(`server listening on: http://localhost:${PORT}`);
    });
  } catch (err) {
    // +++ 5d. The catch block executes if the app fails to connect to the database
    console.log("ERROR: connecting to MONGO database");
    // +++ 5e. Output the specific error message
    console.log(err);
    console.log("Please resolve these errors and try again.");
  }
}
// +++ 6. Execute the function
startServer();
