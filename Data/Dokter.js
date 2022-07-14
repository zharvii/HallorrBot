const { query } = require("../Database/Db");

async function getDokterData(poli) {
  let sql = "SELECT * FROM tbl_dokter where id_poli=$1 and state=$2";
  let params = [poli, "t"];
  let data = await query(sql, params);
  return data;
}

module.exports = {
  getDokterData: getDokterData,
};
