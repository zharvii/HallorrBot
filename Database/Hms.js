const { HMS } = require("../config");
const odbc = require("odbc");

const { trimData } = require("../function/data");

async function query(text, param) {
  try {
    const pool = await odbc.pool(HMS.ConnectionString);
    const result = await pool.query(text, param);
    let data = [];
    await result.map((obj) => {
      trimData(obj);
      data.push(obj);
    });
    return { data: data, size: result.length };
  } catch (err) {
    console.log(err);
  }
}

async function execute(text, param, callback) {
  const pool = await odbc.pool(HMS.ConnectionString);
  pool.query(text, param, async (err, res) => {
    callback(err, res);
  });
}

module.exports = {
  query: query,
  execute: execute,
};
