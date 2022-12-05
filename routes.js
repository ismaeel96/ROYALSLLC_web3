const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const throttle = require('fetch-throttle');

const OS_fetchThrottle = throttle(fetch, 4, 1100);
const coingecko_fetchThrottle = throttle(fetch, 4, 1100);

var express = require("express");
var router = express.Router();


var alchemyAPI = require("./alchemyAPI");

var openseaAPI = require("./openseaAPI");

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
  //console.log(req.query.apiCall);
  //console.log("Age:", req.query.age);


  openseaAPI.get_OS_stats(req.query.apiCall)
      .then(function(serverPromise){
        serverPromise.json()
          .then(function(j) {
            //console.log(j);
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

router.get('/web3/api/wallet_tokens', function (req, res) {
  console.log(req.query.address);
  //console.log("Age:", req.query.age);

	alchemyAPI.get_all_balances(req.query.address)
	.then(function(wallet_tokens_json){
		//console.log(wallet_tokens_json);
		res.send(wallet_tokens_json);
	})
	.catch(function(e)
	{
          console.log(e);
  	});
});

router.get('/web3/api/mainnet_gas', function (req, res) {
  //console.log(req.query.address);
	res.send(eth_mainnet_gas_object);
});



module.exports = router;
