var express = require("express");
var path = require("path");
var routes = require("./routes");
var app = express();
var alchemyAPI = require("./alchemyAPI");

global.coingecko_token_list = {};
global.coingecko_token_list_id_Metadata={};
global.coingecko_token_list_polygon_contracts=[];
global.coingecko_token_list_ethereum_contracts=[];
global.coingecko_token_list_binance_contracts=[];
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
//app.use(express.static(path.join(__dirname, '/public')));
//app.use('/public', express.static('public'))
//app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, '../public')));

app.use(express.static('public'));
//app.use(express.static('stylesheet'));
//app.use(express.static('icons'));
app.use('/stylesheet', express.static(__dirname + '/stylesheet'));
app.use('/icons', express.static(__dirname + '/icons'));

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
			j.forEach((element,i)=>
			{
				if(String(element.platforms.ethereum).startsWith("0x"))
				{
					coingecko_token_list_ethereum_contracts.push(element.platforms.ethereum);
				}
				if(String(element.platforms['polygon-pos']).length>15  )
				{
					coingecko_token_list_polygon_contracts.push("\""+element.platforms['polygon-pos']+"\"");
				}
				if(String(element.platforms['binance-smart-chain']).length>15  )
				{
					coingecko_token_list_binance_contracts.push("\""+element.platforms['binance-smart-chain']+"\"");
				}
			});
			console.log(coingecko_token_list_ethereum_contracts);


		})
		.catch(function(e){
			console.log(e);
		});
		alchemyAPI.getMainNetBalances("0xb1675086bd4a199e28b87E2bBDa9C825116da78F");
	})
	.catch(function(e){
		console.log(e);
	});
});

async function fetch_CG_tokenList() {
	await s.acquire()
	try {
		console.log(s.nrWaiting() + ' calls to fetch are waiting')
		//console.log(x);
		let ux = "--";
		//let recobj=fetch(x);

		const response = await coingecko_fetchThrottle("https://api.coingecko.com/api/v3/coins/list?include_platform=true");
		return response;

	} finally {
		s.release();
	}
}
/*
"params":[
	"0xb1675086bd4a199e28b87E2bBDa9C825116da78F"
		["0xef938b6da8576a896f6E0321ef80996F4890f9c4"]
	]
*/
