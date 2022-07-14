// const { nikParser } = require("../Function/NikParser");

// let ktp = "3515116603640001";

// let nik = nikParser(ktp);

// console.log(nik.isValid());
// console.log(nik.province());
// console.log(nik.kabupatenKota());
// console.log(nik.kecamatan());
// console.log(nik.kodepos());
// console.log(nik.kelamin());
// console.log(nik.lahir());
const { buktiPendaftaran } = require("../Function/Drawing");

// buktiPendaftaran("0001", "poli", "dokter", "26-01-2112");

// const { getPxFromHMS } = require("../Data/Pasien");

// async function test() {
//   let data = await getPxFromHMS("110064");
//   console.log(data);
// }

// test();

const fs = require("fs");

buktiPendaftaran(
  "REG0001",
  "OBGYN",
  "HENDRA BRAHMANTYO RATSMA NANDA, SP. OG, DR.",
  "26-01-2112",
  "BPJS",
  (p) => {
    fs.writeFile("../Report/BuktiPendaftaran/0001.png", p, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  }
);
