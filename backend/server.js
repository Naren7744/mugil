const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require("dns");

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const memberRoutes = require("./routes/memberRoutes");
const contactRoutes = require("./routes/contactRoutes");
const planRoutes =require("./routes/planRoutes");
const branchRoutes =require("./routes/branchRoutes");
const reportRoutes =
require("./routes/reportRoutes");

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use('/api/v1/auth', authRoutes);

app.use("/api/v1/members", memberRoutes);
app.use("/api/v1/contact", contactRoutes);

app.use("/api/v1/plans",planRoutes);
app.use( "/api/v1/branches",branchRoutes);
app.use("/api/v1/reports",reportRoutes
);

app.use("/api/v1/settings", require("./routes/settingsRoutes"));

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

mongoose.connect(process.env.MONGO_URI)
  .then(() =>
    console.log(
      "MUGIL X SP DATABASE MATRIX CONNECTED LIVE"
    )
  )
  .catch((err) =>
    console.log(
      " DATABASE CONNECTION BREACHED:",
      err
    )
  );

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    ` NODE PROTOCOL INSTANTIATED ON PORT ${PORT}`
  )
);




mongoose.connection.once("open", () => {
  console.log(
    "Database Name:",
    mongoose.connection.name
  );
});

