var sqlite3 = require('sqlite3');


const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const SQLite3 = sqlite3.verbose();
const db = new SQLite3.Database('db_files/contracts.db');

const query = (command, method = 'all') => {
  return new Promise((resolve, reject) => {
    db[method](command, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};



function init_db()
{
	db.serialize(async () => {
  		await query("CREATE TABLE IF NOT EXISTS contracts (address text UNIQUE, os_slug text, metadata text, last_updated text)", 'run');
		const lorem = new LoremIpsum();
 		await add_contract_to_db("sunt", lorem.generateWords(1), lorem.generateWords(10));

	 	const existingcontracts = await query('SELECT rowid as id, address, os_slug, metadata, last_updated FROM contracts');
  		console.log(existingcontracts);
	});
}

async function add_contract_to_db(address, os_slug, metadata)
{
	let qry=`
	INSERT INTO contracts (address, os_slug, metadata, last_updated)
	VALUES ("${address}", "${os_slug}", "${metadata}", "${new Date().toISOString()}")
	ON CONFLICT(address) DO UPDATE SET
		os_slug = "${os_slug}",
		metadata = "${metadata}",
		last_updated = "${new Date().toISOString()}";
	`;
	await query(qry,'run');

	/*const createcontractsIfEmpty = async () => {
	  const existingcontracts = await query(
		  	`SELECT address)
			FROM contracts
			WHERE EXISTS
			(SELECT column_name FROM table_name WHERE condition);`
		);

	  if (existingcontracts?.length === 0) {
	    const lorem = new LoremIpsum();

	    for (let i = 0; i < 1000; i += 1) {
	      const tags = [...Array(3)].map(() => lorem.generateWords(1));
	      await query(`INSERT INTO contracts VALUES ("${lorem.generateWords(1)}", "${lorem.generateWords(1)}", "${lorem.generateParagraphs(1)}", "${new Date().toISOString()}")`, 'run');
	    }
	  }
  };*/
}


module.exports = {
	init_db,
	add_contract_to_db
};
