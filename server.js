var express = require("express");
var app = express();
var axios = require("axios");
var fs = require("fs");
var stringify = require("csv-stringify/sync").stringify;

const header = ["language", "region", "regularMarketPrice", "time"];
let array = [];
let j = 1;
array.push(header);

async function getData() {
  axios
    .get("https://query1.finance.yahoo.com/v7/finance/quote?&symbols=USD")
    .then((response) => {
      const data = response.data.quoteResponse.result[0];
      const time = new Date().toString();
      array.push([data.language, data.region, data.regularMarketPrice, time]);
      const str = stringify(array);

      if (array.length % 1000 == 0) {
        j++;
      }
      const path = "./files/" + "CrytoCoin" + j + ".csv";

      if (!fs.existsSync("./files")) {
        fs.mkdirSync("./files");
      }
      fs.writeFile(path, str, function (err) {
        if (err) {
          return res
            .status(400)
            .json({ success: false, message: "An error occurred" });
        }
      });
    })
    .catch((ex) => {
      console.log({ ex });
    });
}

app.get("/", function (req, res) {
  getData();
  res.send("Hello World");
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});

setInterval(getData, 10);
