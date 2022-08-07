const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const throttle = require('fetch-throttle');

const OS_fetchThrottle = throttle(fetch, 4, 1100);

const { Sema } = require('async-sema');

const s = new Sema(
  4, // Allow 4 concurrent async calls
  {
    capacity: 100 // Prealloc space for 100 tokens
  }
);

const axios = require('axios').default;

async function get_OS_stats(x) {

  await s.acquire();

  try {
    const response = await OS_fetchThrottle(x);
    return response;
  } finally {
    s.release();
  }
}

async function get_OS_Contract(){

  	await s.acquire();
	let fetch_url=`https://api.opensea.io/api/v1/asset_contract/0x06012c8cf97bead5deae237070f9587f8e7a266d`;//${address}`;

  	try {
	    	const response = await OS_fetchThrottle("https://api.opensea.io/api/v1/asset_contract/0x06012c8cf97bead5deae237070f9587f8e7a266d", {
		  "headers": {
		    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
		  },
		  "method": "GET"
		});

		console.log(response);
	    	return eth_mainnet_gas_object;
	  } finally {
	    	s.release();
	  }
}

module.exports = {
	get_OS_stats,
	get_OS_Contract,
};
