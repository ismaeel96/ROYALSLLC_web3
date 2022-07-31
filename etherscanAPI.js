const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

global.eth_mainnet_gas_object = {};

async function get_eth_mainnet_gas()
{
	while(true)
	{
		try {
			let myObject = await fetch("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=WIXBRRT4DHHS6UM2CSJ4SB9GEU5SM5JBB5");
			let myText = await myObject.text();
			eth_mainnet_gas_object = JSON.parse(myText);

			//console.log(eth_mainnet_gas_object);

			await new Promise(resolve => setTimeout(resolve, 2000));
		} catch (e) {
			console.log(e);
		} finally {

		}
	}
}

module.exports = {
	get_eth_mainnet_gas
};
