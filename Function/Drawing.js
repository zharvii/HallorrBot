const { createCanvas, Image } = require("canvas");

function buktiPendaftaran(noreg, poli, dokter, tgl, kat, callback) {
  const width = 300;
  const height = 450;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffff";
  context.fillRect(0, 0, width, height);

  context.font = "bold 14pt Menlo";
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = "#3574d4";
  context.fillStyle = "#000000";
  context.fillText("Bukti Registrasi Online", 150, 14);
  context.font = "bold 9pt Menlo";
  context.fillText("No. Reg : " + noreg, 150, 45);

  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(20, 70);
  context.lineTo(278, 70);
  context.stroke();

  var url =
    "https://api.qrserver.com/v1/create-qr-code/?data=" +
    noreg +
    "&amp;size=200x200";
  var img = new Image();
  img.src = url;

  img.onload = async function () {
    await context.drawImage(img, 50, 85, 200, 200);

    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(20, 305);
    context.lineTo(278, 305);
    context.stroke();

    context.font = "bold 13pt Menlo";
    await context.fillText(kat, 150, 313);

    context.font = "bold 11pt Menlo";
    await context.fillText("Poli " + poli.toUpperCase(), 150, 340);

    context.font = "bold 8pt Menlo";
    await context.fillText(dokter, 150, 363);

    context.font = "bold 9pt Menlo";
    await context.fillText(tgl, 150, 385);

    context.font = "bold 14pt Menlo";
    context.fillText("RS. Rahman Rahim", 150, 407);

    const buffer = canvas.toBuffer("image/png");

    callback(buffer);
  };
}

module.exports = {
  buktiPendaftaran: buktiPendaftaran,
};
