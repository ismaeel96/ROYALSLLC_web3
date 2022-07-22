// Import the AlchemyWeb3 library. Filepath to functions:
// /@alch/alchemy-web3/dist/alchemyWeb3.j

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Replace with your Alchemy API key:
const apiKey = "_fQ_Rk92RmQeahUmiLplhr3tDPcI9c4V";

const web3 = createAlchemyWeb3(`https://eth-mainnet.g.alchemy.com/v2/${apiKey}`);

let dec = parseInt("hex string response", 16)

json_string_builder=`{`;

async function get_all_balances(ethereum_address)
{

}

async function get_polygon_balances(ethereum_address)
{
	json_string_builder+=`
	"ethereum":
	{
		"id":	"polygon",
		"symbol": "MATIC",
		"name": "Polygon",
		"balance":"null",
		"contract":"",
		"platform":"polygon"
	}`;

	getPolygonBalancesHelper(ethereum_address)
	    .then(function(serverPromise){
		serverPromise.json()
		  .then(function(j)
		  {
			const nonZeroBalances =	j.result['tokenBalances'].filter(token => {return token['tokenBalance'] !== '0x0000000000000000000000000000000000000000000000000000000000000000'});
			nonZeroBalances.forEach((element,i)=>
			{
				const foo = coingecko_token_list.filter(d => d.platforms['polygon-pos'] == element.contractAddress);

				json_string_builder+=`,
				"${foo[0].id}":
				{
					"id":	"${foo[0].id}",
					"symbol": "${foo[0].symbol}",
					"name": "${foo[0].name}",
					"balance":"${((element.tokenBalance)/(10**18))}",
					"contract":"${element.contractAddress}",
					"platform":"polygon"
				}`;
			});
			json_string_builder+=`}`;
			jsonObj=JSON.parse(json_string_builder);
			console.log(jsonObj);
		    //res.send(j);
		  })
		  .catch(function(e){
		    console.log(e);
		  });
	    })
	    .catch(function(e){
		  console.log(e);
	  });




}

async function getMainNetBalances(ethereum_address)
{
	// Initialize an alchemy-web3 instance:
	const web3 = createAlchemyWeb3(`https://eth-mainnet.g.alchemy.com/v2/${apiKey}`);

	// Query the blockchain (replace example parameters)
	const eth_balance = await web3.eth.getBalance(ethereum_address, 'latest');
	const token_balances = await web3.alchemy.getTokenBalances(ethereum_address, 'DEFAULT_TOKENS');
	jsonObj ={};
	//json_string_builder=`{`;
	const nonZeroBalances =	token_balances['tokenBalances'].filter(token => {return token['tokenBalance'] !== '0'});

	json_string_builder+=`
	"ethereum":
	{
		"id":	"ethereum",
		"symbol": "ETH",
		"name": "Ethereum",
		"balance":"${eth_balance/(10**18)}",
		"contract":"",
		"platform":"ethereum"
	}`;

	nonZeroBalances.forEach((element,i)=>
	{
		const foo = coingecko_token_list.filter(d => d.platforms.ethereum == element.contractAddress);

		json_string_builder+=`,
		"${foo[0].id}":
		{
			"id":	"${foo[0].id}",
			"symbol": "${foo[0].symbol}",
			"name": "${foo[0].name}",
			"balance":"${((element.tokenBalance)/(10**18))}",
			"contract":"${element.contractAddress}",
			"platform":"ethereum"
		}`;
	});
	json_string_builder+=`}`;

	jsonObj=JSON.parse(json_string_builder);
	console.log(jsonObj);
}

// Example POST method implementation:
async function getPolygonBalancesHelper(ethereum_address)
{
	let url= "https://polygon-mainnet.g.alchemyapi.io/v2/7qi0_FvsaxK-C6S1FitX8nYp2GQK01S6"

	const response = await fetch(url, {
	  "headers": {
	    "content-type": "application/json",
	  },
	  "body": `{"jsonrpc":"2.0","id":0,"method":"alchemy_getTokenBalances","params":["0xb1675086bd4a199e28b87E2bBDa9C825116da78F",[${coingecko_token_list_polygon_contracts}]]}`,
	  "method": "POST"
	});
	return response; // parses JSON response into native JavaScript objects
}


module.exports = {
	getMainNetBalances,
	getPolygonBalancesHelper,
	get_polygon_balances
};
