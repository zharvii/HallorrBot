function welcomeMessage(ctx) {
  return `Hallo ${ctx.from.first_name}, Selamat Datang Di Layanan Bot RS.Rahman Rahim.`;
}

function pendaftaranMessage() {
  return `Sudah Pernah Melakukan Pemeriksaan Atau Perawatan Sebelumnya?`;
}

module.exports = {
  welcomeMessage: welcomeMessage,
  pendaftaranMessage: pendaftaranMessage,
};
