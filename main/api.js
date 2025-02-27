const express = require("express");
const { connectToServer } = require("./telnet-client"); // Import the function
const app = express();
const PORT = 3000;
const path = require("path");
const fs = require("fs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/add", async (req, res) => {
  const apiKey = req.body.api_key;
  if (apiKey) {
    try {
      await connectToServer(apiKey);
      res.redirect("/vlan-base");
    } catch (error) {
      res.status(500).send("Error connecting to server");
    }
  } else {
    res.status(400).send("API key is required");
  }
});

app.get("/vlan-base", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/base.html"));
});

app.get("/delete/:id", (req, res) => {
  let arr = [];
  fs.readFile("telnet.json", (err, data) => {
    arr = JSON.parse(data.toString());
    if (req.params.id < arr.length) {
      arr.splice(req.params.id, 1);
      console.log(arr);
      fs.writeFile("telnet.json", JSON.stringify(arr, null, 2), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          res.redirect("/vlan-base");
        }
      });
    } else {
      res.send("NOT FOUND");
    }
  });
});

app.get("/api/vlans", (req, res) => {
  fs.readFile("telnet.json", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.listen(PORT, () => {
  console.log("Server is connected");
});
