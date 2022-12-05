// Import the AlchemyWeb3 library. Filepath to functions:
// /@alch/alchemy-web3/dist/alchemyWeb3.j

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { Network, Alchemy }  = require("alchemy-sdk");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const axios = require('axios').default;

// Replace with your Alchemy API key:
const apiKey = "_fQ_Rk92RmQeahUmiLplhr3tDPcI9c4V";

const web3 = createAlchemyWeb3(`https://eth-mainnet.g.alchemy.com/v2/${apiKey}`);

let dec = parseInt("hex string response", 16)

const { ethers } = require("ethers");


const main_net_settings = {
  apiKey: "_fQ_Rk92RmQeahUmiLplhr3tDPcI9c4V", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy_main_net = new Alchemy(main_net_settings);

const polygon_settings = {
  apiKey: "7qi0_FvsaxK-C6S1FitX8nYp2GQK01S6", // Replace with your Alchemy API Key.
  network: Network.MATIC_MAINNET, // Replace with your network.
};
const alchemy_polygon = new Alchemy(polygon_settings);

const binance_settings = {
  apiKey: "_fQ_Rk92RmQeahUmiLplhr3tDPcI9c4V", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy_binance = new Alchemy(binance_settings);

/*const usdcContract = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
alchemy.core.getTokenMetadata(usdcContract).then(console.log);*/


async function get_all_balances(ethereum_address)
{
	let json_ethereum_string_builder = await getMainNetBalances(ethereum_address);
	let json_polygon_string_builder = await get_polygon_balances(ethereum_address);

	json_string_builder= await JSON.parse(`[${json_ethereum_string_builder}${json_polygon_string_builder}]`);


	return json_string_builder;
}
async function getMainNetBalances(ethereum_address)
{
	// Initialize an alchemy-web3 instance:
	const web3 = createAlchemyWeb3(`https://eth-mainnet.g.alchemy.com/v2/${apiKey}`);

	// Query the blockchain (replace example parameters)
	const eth_balance = await web3.eth.getBalance(ethereum_address, 'latest');

	token_balances = await axios(
		{
		method: 'post',
		url: 'https://eth-mainnet.g.alchemy.com/v2/_fQ_Rk92RmQeahUmiLplhr3tDPcI9c4V',
		id:0,
		headers:
		{
		  	"Content-Type": "application/json"
		},
		data:
		{
			jsonrpc:"2.0",
			id: 0,
			method:"alchemy_getTokenBalances",
			params:[
				ethereum_address,
					coingecko_token_list_ethereum_contracts
			]
		}
	});
	jsonObj ={};

	ethereum_main_balances=`
	{"token":
	{
		"id":	"ethereum",
		"symbol": "ETH",
		"name": "Ethereum",
		"balance":"${(eth_balance/ Math.pow(10, 18)).toFixed(8)}",
		"contract":"",
		"platform":"ethereum"
	}}`;

	const nonZeroBalances =	token_balances.data.result['tokenBalances'].filter(token => {return token['tokenBalance'] !== '0x0000000000000000000000000000000000000000000000000000000000000000'});


	//console.log(nonZeroBalances);

	//let ethereum_main_balances = ``;
	for (let i = 0; i < nonZeroBalances.length; i++)
	{
		if(nonZeroBalances[i].tokenBalance!='0x')
		{
			const foo = coingecko_token_list.filter(d => d.platforms['ethereum'] == nonZeroBalances[i].contractAddress);

			let metadata = await alchemy_main_net.core.getTokenMetadata(nonZeroBalances[i].contractAddress);

		   	// Compute token balance in human-readable format
		   	bal = (nonZeroBalances[i].tokenBalance) / Math.pow(10, metadata.decimals);
		   	bal = bal.toFixed(5);

		  	ethereum_main_balances += `,
			{"token":
			{
				"id":	"${foo[0].id}",
				"symbol": "${foo[0].symbol}",
				"name": "${foo[0].name}",
				"balance":"${(nonZeroBalances[i].tokenBalance / Math.pow(10, metadata.decimals)).toFixed(8)}",
				"contract":"${nonZeroBalances[i].contractAddress}",
				"platform":"polygon"
			}}`;

			console.log(`${foo[0].symbol}: `, nonZeroBalances[i].tokenBalance);
			console.log(`${foo[0].symbol} Balance from BN: `, bal);
			//console.log(`${foo[0].symbol} Balance from BN: `, (nonZeroBalances[i].tokenBalance));
			console.log();
		}
	}
	return ethereum_main_balances;
}


async function get_polygon_balances(ethereum_address)
{
	//let params='['+ethereum_address+'['+coingecko_token_list_polygon_contracts_map+']]';

	//console.log(JSON.stringify(params));
	alchemy_getTokenBalances = await axios(
		{
		method: 'post',
		url: 'https://polygon-mainnet.g.alchemy.com/v2/7qi0_FvsaxK-C6S1FitX8nYp2GQK01S6',
		id:0,
		headers:
		{
		  	"Content-Type": "application/json"
		},
		data:
		{
			jsonrpc:"2.0",
			id: 0,
			method:"alchemy_getTokenBalances",
			params:[
				ethereum_address,
					coingecko_token_list_polygon_contracts
			]
		}
	});

	const nonZeroBalances =	alchemy_getTokenBalances.data.result['tokenBalances'].filter(token => {return token['tokenBalance'] !== '0x0000000000000000000000000000000000000000000000000000000000000000'});

	let polygon_balances = ``;

	for (let i = 0; i < nonZeroBalances.length; i++)
	{
		const foo = coingecko_token_list.filter(d => d.platforms['polygon-pos'] == nonZeroBalances[i].contractAddress);

		let decimals = 18;

		try {
			let metadata = await alchemy_polygon.core.getTokenMetadata(nonZeroBalances[i].contractAddress);
			decimals=metadata.decimals;
		} catch (e) {
		console.log("alchemy metadata error, setting decimals to 1");
		}


	  	polygon_balances += `,
		{"token":
		{
			"id":	"${foo[0].id}",
			"symbol": "${foo[0].symbol}",
			"name": "${foo[0].name}",
			"balance":"${(nonZeroBalances[i].tokenBalance/ Math.pow(10, decimals)).toFixed(8)}",
			"contract":"${nonZeroBalances[i].contractAddress}",
			"platform":"polygon"
		}}`;
	}

	//console.log(polygon_balances);
	return polygon_balances;
}

async function get_polygon_NFTs(ethereum_address)
{
	let address = "0xb1675086bd4a199e28b87E2bBDa9C825116da78F";//ethereum_address;

	const baseURL = `https://polygon-mainnet.g.alchemy.com/v2/7qi0_FvsaxK-C6S1FitX8nYp2GQK01S6`;
	const url = `${baseURL}/getNFTs/?owner=${address}&withMetadata=true&filters[]=SPAM`;

	const config = {
	    method: 'get',
	    url: url,
	};

	try {
		//alchemy_get_polygon_NFTs = await fetch(`https://polygon-mainnet.g.alchemy.com/v2/7qi0_FvsaxK-C6S1FitX8nYp2GQK01S6/getNFTs/?owner=${address}`);
		alchemy_get_polygon_NFTs = await axios(config);
		console.log(alchemy_get_polygon_NFTs.data.ownedNfts[0]);
	} catch (e) {
		console.log(e);
	} finally {

	}
}


module.exports = {
	get_all_balances,
	get_polygon_balances,
	getMainNetBalances,
	get_polygon_NFTs
};
