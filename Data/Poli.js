const { query } = require("../Database/Db");

async function getPoliData() {
  let sql = "SELECT * FROM tbl_poli where state=$1";
  let params = ["t"];
  let data = await query(sql, params);
  return data;
}

module.exports = {
  getPoliData: getPoliData,
};
