const express = require("express");
const { google } = require("googleapis");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", async (req, res) => {
  const { name, age } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // create client instance for auth
  const client = await auth.getClient();

  // create instance for google sheet api

  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = "116BVeYfW2nOcgY9Ro2aT1-qA9hUSpI6YMC-KOm-TJJ8";

  // get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1",
  });

  // Write rows to spreadsheet

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[name, age]],
    },
  });

  res.send("Successfully Submitted");
});

app.listen(1337, (req, res) => console.log("running on 1337"));
