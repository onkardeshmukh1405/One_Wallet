const express = require("express");
const app = express();
const path = require("path");

require("dotenv").config();

app.use(express.json());

const PORT = process.env.PORT || 5400;

const dbConfig = require("./config/dbConfig");
const usersRoute = require("./routes/usersRoute");
const transactionsRoute = require("./routes/transactionsRoute");
const requestsRoute = require("./routes/requestsRoute");

app.use("/api/users", usersRoute);
app.use("/api/transactions", transactionsRoute);
app.use("/api/requests", requestsRoute);

// -----------------Deployment--------------

const _dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname1, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname1, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running Successfully");
  });
}

// -----------------Deployment--------------//

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
