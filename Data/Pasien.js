const db = require("../Database/Db");
const hms = require("../Database/Hms");
const { trimData } = require("../Function/Data");

function insertPx() {}

function getPxFromHMS(rm) {
  let data = hms.query(
    "select rekmed,namapas,jkel,alamat1,nocard from tbl_pasien where rekmed=? ;",
    [rm]
  );
  return data;
}

module.exports = {
  getPxFromHMS: getPxFromHMS,
};
