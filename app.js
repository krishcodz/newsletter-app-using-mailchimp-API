const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { log } = require("console");
const app = express();
app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function() {
    console.log("App is now running");
})

app.get("/", function (req,res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req,res){
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var mailid = req.body.email;
    
    var data = {
        members: [
            {
                email_address: mailid,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    const jsondata = JSON.stringify(data);
    const url = "https://us8.api.mailchimp.com/3.0/lists/5b9ec84ce7";
    const option = {
        method: "POST",
        auth: "krishcodz:b032e3c76823451391a8ccc44fc16aba-us8"
    }
    
    const request = https.request(url, option, function(response) {
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsondata);
    request.end();
})