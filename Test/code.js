//save and send buffer image
const fs = require("fs");
const { buktiPendaftaran } = require("./Function/Drawing");

bot.hears("test", async (ctx) => {
  let noreg = "0001";
  let poli = "poli";
  let dokter = "dokter";
  let tgl = "tgl";

  buktiPendaftaran(noreg, poli, dokter, tgl, (photo) => {
    ctx.replyWithPhoto({ source: Buffer.from(photo, "base64") });
    fs.writeFileSync("./Report/" + noreg + ".png", photo);
  });
});
//save and send buffer image

//import nga kepake di wizard baru.js
const fs = require("fs");
const Composer = require("telegraf/composer");
const Markup = require("telegraf/markup");
//import nga kepake di wizard baru.js

//simpan bukti pendaftaran
let noreg = "0001"; //parameter
let photo; // buffer dari gambar bukti pendafataran
fs.writeFile(
  "./Report/BuktiPendaftaran/" + noreg + ".png",
  photo,
  function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  }
);
//simpan bukti pendaftaran

//step handler di wizard baru.js
const stepHandler = new Composer();
stepHandler.action("next", (ctx) => {
  ctx.reply("Step 2. Via inline button");
  return ctx.wizard.next();
});
stepHandler.command("next", (ctx) => {
  ctx.reply("Step 2. Via command");
  return ctx.wizard.next();
});
stepHandler.use((ctx) =>
  ctx.replyWithMarkdown("Press `Next` button or type /next")
);
//step handler di wizard baru.js
