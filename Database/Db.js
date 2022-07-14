const { DB } = require("../config");
const Pool = require("pg").Pool;

const client = new Pool(DB);

async function query(sql, param = []) {
  try {
    let result = await client.query(sql, param);
    return { data: result.rows, size: result.rows.length };
  } catch (err) {
    console.log(err);
  }
}

function execute(sql, param, callback) {
  client.query(sql, param, (err, res) => {
    callback(err, res);
  });
}

module.exports = {
  query: query,
  execute: execute,
};
