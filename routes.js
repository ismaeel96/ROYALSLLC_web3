const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const throttle = require('fetch-throttle');

const OS_fetchThrottle = throttle(fetch, 4, 1100);
const coingecko_fetchThrottle = throttle(fetch, 4, 1100);

var express = require("express");
var router = express.Router();

//import fetch from "node-fetch";
//import {RateLimit} from "async-sema";
const { Sema } = require('async-sema');
const s = new Sema(
  4, // Allow 4 concurrent async calls
  {
    capacity: 100 // Prealloc space for 100 tokens
  }
);


router.get("/web3/", function(req, res) {
res.render("index");
});

router.get('/web3/api/', function (req, res) {
  console.log(req.query.apiCall);
  //console.log("Age:", req.query.age);


  fetch_OS_Data(req.query.apiCall)
      .then(function(serverPromise){
        serverPromise.json()
          .then(function(j) {
            console.log(j);
            res.send(j);
          })
          .catch(function(e){
            console.log(e);
          });
      })
      .catch(function(e){
          console.log(e);
        });
});


async function fetch_OS_Data(x) {
  //console.log(x);
  await s.acquire()

  try {
    console.log(s.nrWaiting() + ' calls to fetch are waiting')
    //console.log(x);
    let ux = "--";
    //let recobj=fetch(x);

    const response = await OS_fetchThrottle(x);
    //console.log(response);
    //const body = await response.text();

    //const body = await response.json();

    //console.log("");
    //console.log(x);
    //console.log(body);
    return response;

  } finally {
    s.release();
  }
}


module.exports = router;
