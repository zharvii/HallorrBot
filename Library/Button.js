function mainMenuButton() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Pendaftaran Online", callback_data: "m1" }],
        [{ text: "Riwayat Priksa", callback_data: "m2" }],
      ],
    },
  };
}

function pendaftaranButton() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Sudah", callback_data: "old" }],
        [{ text: "Belum", callback_data: "new" }],
        [{ text: "Kembali", callback_data: "back" }],
      ],
    },
  };
}

function batalDaftarButton() {
  return {
    reply_markup: {
      keyboard: [[{ text: "Batal Daftar" }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}

function konfirmasiButton() {
  return {
    reply_markup: {
      keyboard: [
        [{ text: "Benar" }],
        [{ text: "Ubah" }],
        [{ text: "Batal Daftar" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}

function agamaButton() {
  return {
    reply_markup: {
      keyboard: [
        [{ text: "Islam" }, { text: "Katolik" }],
        [{ text: "Hindu" }, { text: "Buddha" }],
        [{ text: "Protestan" }, { text: "Khonghucu" }],
        [{ text: "Batal Daftar" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}

function kategoriButton() {
  return {
    reply_markup: {
      keyboard: [
        [{ text: "BPJS" }, { text: "UMUM" }],
        [{ text: "Batal Daftar" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}

function fieldButton() {
  return {
    reply_markup: {
      keyboard: [
        [{ text: "PROVINSI" }],
        [{ text: "KABUPATEN/KOTA" }, { text: "KECAMATAN" }],
        [{ text: "JENIS KELAMIN" }, { text: "TANGGAL LAHIR" }],
        [{ text: "Batal Daftar" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}

function jkButton() {
  return {
    reply_markup: {
      keyboard: [
        [{ text: "PRIA" }, { text: "WANITA" }],
        [{ text: "Batal Daftar" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}

function finishButton() {
  return {
    reply_markup: {
      keyboard: [[{ text: "Iya" }], [{ text: "Batal Daftar" }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
}

function removeKeyboardButton() {
  return {
    reply_markup: {
      remove_keyboard: true,
    },
  };
}

module.exports = {
  mainMenuButton: mainMenuButton,
  pendaftaranButton: pendaftaranButton,
  batalDaftarButton: batalDaftarButton,
  konfirmasiButton: konfirmasiButton,
  agamaButton: agamaButton,
  kategoriButton: kategoriButton,
  fieldButton: fieldButton,
  jkButton: jkButton,
  finishButton: finishButton,
  removeKeyboardButton: removeKeyboardButton,
};
