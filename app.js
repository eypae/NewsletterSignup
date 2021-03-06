const express = require("express"); //makes node easier to use
const https = require("https"); //fetch external API
const app = express();
const mailchimp = require("@mailchimp/mailchimp_marketing");
require('dotenv').config();
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public")); //to use static folders and files on the computer

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: "us14"
});

app.post("/", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  const listId = "da615e2acb";

  const subscriber = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  //Uploading data to server
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscriber.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscriber.firstName,
        LNAME: subscriber.lastName
      }
    });

    //If all goes well logging contact
    res.sendFile(__dirname + "/success.html")
    console.log(`Successfully added contact as an audience member. The contact id is ${response.id}.`);
  }

  //Running the function and catching the errors if anonymous
  run().catch(e =>  res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
})
