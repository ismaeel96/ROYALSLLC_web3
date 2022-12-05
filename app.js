var express = require("express");
var path = require("path");
var routes = require("./routes");
var app = express();
var alchemyAPI = require("./alchemyAPI");
//var database = require("./DB");
var etherscanAPI = require("./etherscanAPI");
var openseaAPI = require("./openseaAPI");
const fs = require('fs');

global.coingecko_token_list = {};
global.coingecko_token_list_id_Metadata={};

global.coingecko_token_list_polygon_contracts=[];
global.coingecko_token_list_polygon_contracts_map="";

global.coingecko_token_list_ethereum_contracts=[];
global.coingecko_token_list_ethereum_contracts_map="";

global.coingecko_token_list_binance_contracts=[];
global.coingecko_token_list_binance_contracts_map="";




global.metadata_MainnetContract_list=[];
global.metadata_MainnetContract_map="";

global.metadata_polygonContract_list=[];
global.metadata_polygonContract_map="";

global.metadata_BinanceContract_list=[];
global.metadata_BinanceContract_map="";

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const throttle = require('fetch-throttle');
const coingecko_fetchThrottle = throttle(fetch, 4, 1100);
const { Sema } = require('async-sema');
const s = new Sema(
	4, // Allow 4 concurrent async calls
	{
		capacity: 100 // Prealloc space for 100 tokens
	}
);


app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json({limit: '1mb'}));
app.use(routes);

app.use(express.static('public'));
app.use('/stylesheet', express.static(__dirname + '/stylesheet'));
app.use('/icons', express.static(__dirname + '/icons'));



let fetch_CG_tokenList_rawdata = fs.readFileSync('CG_tokenList.json');
coingecko_token_list = JSON.parse(fetch_CG_tokenList_rawdata);

/*let metadata_polygonContract_rawdata = fs.readFileSync('metadata_polygonContract.json');
metadata_polygonContract_list = JSON.parse(metadata_polygonContract_rawdata);

let metadata_MainnetContract_rawdata = fs.readFileSync('metadata_MainnetContract.json');
metadata_MainnetContract_list = JSON.parse(metadata_MainnetContract_rawdata);

let metadata_BinanceContract = fs.readFileSync('metadata_BinanceContract.json');
metadata_BinanceContract = JSON.parse(metadata_BinanceContract);*/

app.listen(app.get("port"), function(){
	console.log("Server started on port ");

	//coinggecko api call to get supported token list
	fetch_CG_tokenList()
	.then(function(serverPromise){
		serverPromise.json()
		.then(function(j)
		{
			coingecko_token_list=j;

			//const foo = coingecko_token_list.filter(d => d.id == "gala");
			coingecko_token_list.forEach((element,i)=>
			{
				if(String(element.platforms.ethereum).startsWith("0x"))
				{
					coingecko_token_list_ethereum_contracts.push(element.platforms.ethereum);
				}
				if(String(element.platforms['polygon-pos']).length>15  )
				{
					coingecko_token_list_polygon_contracts.push(element.platforms['polygon-pos']);
				}
				if(String(element.platforms['binance-smart-chain']).length>15  )
				{
					coingecko_token_list_binance_contracts.push(element.platforms['binance-smart-chain']);
				}
			});

			fs.writeFileSync('CG_tokenList.json', JSON.stringify(j));
			//get_token_balances();

		})
		.catch(function(e){
			console.log(e);
		});
	})
	.catch(function(e){
		console.log(e);
	});
	etherscanAPI.get_eth_mainnet_gas();


});

async function fetch_CG_tokenList() {
	await s.acquire()
	try {
		//console.log(s.nrWaiting() + ' calls to fetch are waiting')
		//console.log(x);
		let ux = "--";
		//let recobj=fetch(x);

		const response = await coingecko_fetchThrottle("https://api.coingecko.com/api/v3/coins/list?include_platform=true");
		return response;

	} finally {
		s.release();
	}
}

//get_token_balances()
