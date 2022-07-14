const WizardScene = require("telegraf/scenes/wizard");

const {
  isAlphabetOnly,
  isNumberOnly,
  isDateFormat,
  dateIsValid,
  dateIsNext,
  dateIsLess,
  dateIsOver,
  dateIsToday,
} = require("../../Function/Validation");

const {
  mainMenuButton,
  batalDaftarButton,
  konfirmasiButton,
  agamaButton,
  kategoriButton,
  fieldButton,
  jkButton,
  finishButton,
  removeKeyboardButton,
} = require("../../Library/Button");

const { welcomeMessage } = require("../../Library/Message");

const { yyyyMMDD, getAge } = require("../../Function/Date");

const { replaceProperty } = require("../../Function/Data");

const { buktiPendaftaran } = require("../../Function/Drawing");

const { nikParser } = require("../../Function/NikParser");

const { getPoliData } = require("../../Data/Poli");

const { getDokterData } = require("../../Data/Dokter");

let dataKtp = {};
let editField = "";

function home(ctx) {
  let msg = welcomeMessage(ctx);
  let btn = mainMenuButton();
  ctx.reply(msg, btn);
}

const pasienBaruWizard = new WizardScene(
  "pasien-baru",
  (ctx) => {
    ctx.reply("Nama : ", batalDaftarButton());
    return ctx.wizard.next();
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    //Validasi nama
    if (!isAlphabetOnly(ctx)) {
      ctx.reply(
        "Input Nama Hanya Diperbolehkan Menggunakan Huruf\nNama :",
        batalDaftarButton()
      );
    } else {
      ctx.wizard.state.nama = ctx.message.text;
      ctx.reply(
        "Nama : " +
          ctx.wizard.state.nama.toUpperCase() +
          "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }
    //konfirmasi nama
    if (ctx.message.text == "ubah") {
      ctx.reply("Nama : ", batalDaftarButton());
      return ctx.wizard.back();
    } else if (ctx.message.text == "benar") {
      ctx.reply("Nik : ", batalDaftarButton());
      return ctx.wizard.next();
    } else {
      ctx.reply(
        "Nama : " +
          ctx.wizard.state.nama.toUpperCase() +
          "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    let nik = nikParser(ctx.message.text);

    //validasi no identitas
    if (!isNumberOnly(ctx)) {
      await ctx.reply("Input Nik Hanya Diperbolehkan Menggunakan Angka");
      ctx.reply("Nik : ", batalDaftarButton());
    } else if (!nik.isValid()) {
      await ctx.reply("Nik Tidak Valid");
      ctx.reply("Nik : ", batalDaftarButton());
    } else {
      ctx.wizard.state.noiden = ctx.message.text;

      ctx.reply(
        "Nik : " + ctx.wizard.state.noiden + "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    //konfirmasi no identitas
    if (ctx.message.text == "ubah") {
      ctx.reply("Nik : ", batalDaftarButton());
      return ctx.wizard.back();
    } else if (ctx.message.text == "benar") {
      let nik = nikParser(ctx.wizard.state.noiden);
      dataKtp = {
        jk: nik.kelamin(),
        provinsi: nik.province(),
        kabkot: nik.kabupatenKota(),
        kecamatan: nik.kecamatan(),
        tglLhr: nik.lahir(),
      };
      let age = getAge(yyyyMMDD(dataKtp.tglLhr).split("-").join(""), 1);
      await ctx.reply("Konfirmasi");
      await ctx.reply("Apakah Data Anda Dibawah Ini Sudah Benar?");
      await ctx.replyWithHTML(
        "<b>Jenis Kelamin :</b> " +
          dataKtp.jk +
          "\n<b>Provinsi :</b> " +
          dataKtp.provinsi +
          "\n<b>Kabupaten/Kota : </b>" +
          dataKtp.kabkot +
          "\n<b>Kecamatan : </b>" +
          dataKtp.kecamatan +
          "\n<b>Tanggal Lahir : </b>" +
          dataKtp.tglLhr +
          "\n<b>Umur : </b>" +
          age,
        konfirmasiButton()
      );
      return ctx.wizard.next();
    } else {
      ctx.reply(
        "Nik : " + ctx.wizard.state.noiden + "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }
    //konfirmasi Tempat Lahir
    if (ctx.message.text == "ubah") {
      await ctx.reply("Pilih Data Yang Akan Di Ubah : ", fieldButton());
      return ctx.wizard.next();
    } else if (ctx.message.text == "benar") {
      editField = "empty";
      ctx.wizard.selectStep(7);
      return ctx.wizard.steps[7](ctx);
    } else {
      let age = getAge(yyyyMMDD(dataKtp.tglLhr).split("-").join(""), 1);
      await ctx.reply("Konfirmasi");
      await ctx.reply("Apakah Data Anda Dibawah Ini Sudah Benar?");
      await ctx.replyWithHTML(
        "<b>Jenis Kelamin :</b> " +
          dataKtp.jk +
          "\n<b>Provinsi :</b> " +
          dataKtp.provinsi +
          "\n<b>Kabupaten/Kota : </b>" +
          dataKtp.kabkot +
          "\n<b>Kecamatan : </b>" +
          dataKtp.kecamatan +
          "\n<b>Tanggal Lahir : </b>" +
          dataKtp.tglLhr +
          "\n<b>Umur : </b>" +
          age,
        konfirmasiButton()
      );
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    editField = ctx.message.text.toUpperCase();
    if (ctx.message.text.toUpperCase() == "PROVINSI") {
      ctx.reply("Provinsi : ", batalDaftarButton());
      return ctx.wizard.next();
    } else if (ctx.message.text.toUpperCase() == "KABUPATEN/KOTA") {
      ctx.reply("Kabupaten/Kota : ", batalDaftarButton());
      return ctx.wizard.next();
    } else if (ctx.message.text.toUpperCase() == "KECAMATAN") {
      ctx.reply("Kecamatan : ", batalDaftarButton());
      return ctx.wizard.next();
    } else if (ctx.message.text.toUpperCase() == "JENIS KELAMIN") {
      ctx.reply("Jenis Kelamin : ", jkButton());
      return ctx.wizard.next();
    } else if (ctx.message.text.toUpperCase() == "TANGGAL LAHIR") {
      ctx.reply(
        "Tanggal Lahir Format\nContoh 01 Februari 2002 :\n 01-02-2002 :  ",
        batalDaftarButton()
      );
      return ctx.wizard.next();
    } else {
      ctx.reply("Pilih Data Yang Akan Di Ubah : ", fieldButton());
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    if (editField.toUpperCase() == "PROVINSI") {
      if (!isAlphabetOnly(ctx)) {
        ctx.reply(
          "Input Domisili Provinsi Hanya Diperbolehkan Menggunakan Huruf, Silahkan Masukan Domisili Provinsi :",
          batalDaftarButton()
        );
      } else {
        await replaceProperty(dataKtp, "provinsi", ctx.message.text);

        ctx.wizard.selectStep(5);
        return ctx.wizard.steps[5](ctx);
      }
    } else if (editField.toUpperCase() == "KABUPATEN/KOTA") {
      if (!isAlphabetOnly(ctx)) {
        ctx.reply(
          "Input Domisili Kabupaten/Kota Hanya Diperbolehkan Menggunakan Huruf, Silahkan Masukan Domisili Provinsi :",
          batalDaftarButton()
        );
      } else {
        await replaceProperty(dataKtp, "kabkot", ctx.message.text);

        ctx.wizard.selectStep(5);
        return ctx.wizard.steps[5](ctx);
      }
    } else if (editField.toUpperCase() == "KECAMATAN") {
      if (!isAlphabetOnly(ctx)) {
        ctx.reply(
          "Input Domisili Kecamatan Hanya Diperbolehkan Menggunakan Huruf, Silahkan Masukan Domisili Provinsi :",
          batalDaftarButton()
        );
      } else {
        await replaceProperty(dataKtp, "kecamatan", ctx.message.text);

        ctx.wizard.selectStep(5);
        return ctx.wizard.steps[5](ctx);
      }
    } else if (editField.toUpperCase() == "JENIS KELAMIN") {
      if (
        ctx.message.text.toUpperCase() != "W" &&
        ctx.message.text.toUpperCase() != "P"
      ) {
        ctx.reply(
          "Input yang anda masukan salah, Silahkan pilih Jenis Kelamin : \nP = Pria \nW = Wanita",
          jkButton()
        );
      } else {
        await replaceProperty(dataKtp, "jk", ctx.message.text);

        ctx.wizard.selectStep(5);
        return ctx.wizard.steps[5](ctx);
      }
    } else if (editField.toUpperCase() == "TANGGAL LAHIR") {
      if (!isDateFormat(ctx)) {
        ctx.reply(
          "Input Tanggal Tidak Sesuai Format, Silahkan Masukan Tanggal Lahir :",
          batalDaftarButton()
        );
      } else if (!dateIsValid(ctx)) {
        ctx.reply(
          "Tanggal Yang Anda Masukan Tidak valid, Silahkan Masukan Tanggal Lahir :",
          batalDaftarButton()
        );
      } else if (dateIsNext(ctx)) {
        ctx.reply(
          "Tanggal Yang Ada Masukan Adalah Tanggal Di Hari Esok, Silahkan Masukan Tanggal Lahir :",
          batalDaftarButton()
        );
      } else {
        await replaceProperty(dataKtp, "tglLhr", ctx.message.text);

        ctx.wizard.selectStep(5);
        return ctx.wizard.steps[5](ctx);
      }
    } else {
      await ctx.reply("Tempat Lahir : ", batalDaftarButton());
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    //validasi Tempat Lahir
    if (!isAlphabetOnly(ctx)) {
      ctx.reply(
        "Input Tempat Lahir Hanya Diperbolehkan Menggunakan Huruf, Silahkan Masukan Tempat Lahir :",
        batalDaftarButton()
      );
    } else {
      ctx.wizard.state.tmplhr = ctx.message.text;
      ctx.reply(
        "Cek Tempat Lahir : " +
          ctx.wizard.state.tmplhr.toUpperCase() +
          "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    // konfirmasi Tempat Lahir
    if (ctx.message.text == "ubah") {
      ctx.reply("Tempat Lahir: ", batalDaftarButton());
      return ctx.wizard.back();
    } else if (ctx.message.text == "benar") {
      ctx.reply(
        "Pilih Agama Dengan Menekan Salah Satu Tombol Dibawah : ",
        agamaButton()
      );
      return ctx.wizard.next();
    } else {
      ctx.reply(
        "Cek Tempat Lahir : " +
          ctx.wizard.state.tmplhr.toUpperCase() +
          "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    //validasi agama
    if (
      ctx.message.text.toUpperCase() != "ISLAM" &&
      ctx.message.text.toUpperCase() != "KATOLIK" &&
      ctx.message.text.toUpperCase() != "HINDU" &&
      ctx.message.text.toUpperCase() != "BUDHA" &&
      ctx.message.text.toUpperCase() != "PROTESTAN" &&
      ctx.message.text.toUpperCase() != "KHONGHUCU"
    ) {
      ctx.reply(
        "Mohon Maaf Pilihan Anda Tidak Tersedia, Silahkan Pilih Agama Dengan Menekan Salah Satu Tombol Dibawah : ",
        agamaButton()
      );
    } else {
      ctx.wizard.state.agama = ctx.message.text;
      ctx.reply(
        "Cek Agama : " +
          ctx.wizard.state.agama.toUpperCase() +
          "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    //konfirmasi Agama
    if (ctx.message.text == "ubah") {
      ctx.reply(
        "Pilih Agama Dengan Menekan Salah Satu Tombol Dibawah : ",
        agamaButton()
      );
      return ctx.wizard.back();
    } else if (ctx.message.text == "benar") {
      ctx.reply("Domisili Alamat : ", batalDaftarButton());
      return ctx.wizard.next();
    } else {
      ctx.reply(
        "Cek Agama : " +
          ctx.wizard.state.agama.toUpperCase() +
          "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    //konfirmasi Domisili Alamat
    ctx.wizard.state.domalamat = ctx.message.text;
    ctx.reply(
      "Cek Domisili Alamat : " +
        ctx.wizard.state.domalamat.toUpperCase() +
        "\nApakah Sudah Benar?",
      konfirmasiButton()
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    //konfirmasi Domisili Alamat
    if (ctx.message.text == "ubah") {
      ctx.reply("Domisili Alamat : ", batalDaftarButton());
      return ctx.wizard.back();
    } else if (ctx.message.text == "benar") {
      ctx.reply("Kategori  : ", kategoriButton());
      return ctx.wizard.next();
    } else {
      ctx.reply(
        "Cek Domisili Alamat : " +
          ctx.wizard.state.domalamat.toUpperCase() +
          "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    //validasi kategori
    if (
      ctx.message.text.toUpperCase() != "BPJS" &&
      ctx.message.text.toUpperCase() != "UMUM"
    ) {
      await ctx.reply(
        "Input yang anda masukan salah, Silahkan pilih kategori : \n-BPJS \n-UMUM",
        kategoriButton()
      );
    } else {
      ctx.wizard.state.kat = ctx.message.text;
      ctx.reply(
        "Cek Kategori : " +
          ctx.message.text.toUpperCase() +
          "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    //konfirmasi Kategori
    if (ctx.message.text == "ubah") {
      ctx.reply("Kategori  : ", kategoriButton());
      return ctx.wizard.back();
    } else if (ctx.message.text == "benar") {
      if (ctx.wizard.state.kat.toUpperCase() == "BPJS") {
        ctx.reply("No JKN  : ", batalDaftarButton());
        return ctx.wizard.next();
      } else {
        ctx.wizard.selectStep(17);
        return ctx.wizard.steps[17](ctx);
      }
    } else {
      ctx.reply(
        "Cek Kategori : " +
          ctx.wizard.state.kat.toUpperCase() +
          "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    if (ctx.wizard.state.kat.toUpperCase() == "BPJS") {
      if (!isNumberOnly(ctx)) {
        ctx.reply(
          "Input No JKN hanya boleh menggunakan angka, Silahkan Masukan No JKN :",
          batalDaftarButton()
        );
      } else if (ctx.message.text.length != 13) {
        ctx.reply(
          "Input No JKN harus 13 digit, Silahkan Masukan No JKN :",
          batalDaftarButton()
        );
      } else {
        ctx.wizard.state.nojkn = ctx.message.text;
        ctx.reply(
          "Cek No JKN : " +
            ctx.message.text.toUpperCase() +
            "\nApakah Sudah Benar?",
          konfirmasiButton()
        );
        return ctx.wizard.next();
      }
    } else {
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    const poli = await getPoliData();
    let text = "Silahkan Pilih Poli Sesuai Nomor Poli Dibawah Ini :  ";
    let i = 0;
    await poli.data.map((obj) => {
      i++;
      text += "\n" + i + "." + obj.nama_poli;
    });
    //konfirmasi Kategori
    if (ctx.wizard.state.kat.toUpperCase() == "BPJS") {
      if (ctx.message.text == "ubah") {
        ctx.reply("No Jkn  : ", batalDaftarButton());
        return ctx.wizard.back();
      } else if (ctx.message.text == "benar") {
        await ctx.reply(text, batalDaftarButton());
        return ctx.wizard.next();
      } else {
        ctx.reply(
          "Cek No JKN : " +
            ctx.wizard.state.nojkn.toUpperCase() +
            "\nApakah Sudah Benar?",
          konfirmasiButton()
        );
      }
    } else {
      await ctx.reply(text, batalDaftarButton());
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    const poli = await getPoliData();
    let text = "Silahkan Pilih Poli Sesuai Nomor Poli Dibawah Ini :  ";
    let i = 0;
    await poli.data.map((obj) => {
      i++;
      text += "\n" + i + "." + obj.nama_poli;
    });
    //validasi Dimisisli Provinsi
    if (!isNumberOnly(ctx)) {
      await ctx.reply(
        "Input Hanya Diperbolehkan Menggunakan angka, Silahkan Pilih Poli Sesuai Nomor Poli Diatas : ",
        batalDaftarButton()
      );
    } else if (
      parseInt(ctx.message.text) < 1 ||
      parseInt(ctx.message.text) > poli.size
    ) {
      await ctx.reply(text, batalDaftarButton());
    } else {
      ctx.wizard.state.poli = ctx.message.text;
      ctx.reply(
        "Cek Poli : " +
          poli.data[
            parseInt(ctx.wizard.state.poli) - 1
          ].nama_poli.toUpperCase() +
          "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }
    const poli = await getPoliData();
    let text = "Silahkan Pilih Poli Sesuai Nomor Poli Dibawah Ini :  ";
    let i = 0;
    await poli.data.map((obj) => {
      i++;
      text += "\n" + i + "." + obj.nama_poli;
    });

    //konfirmasi Domisili provinsi
    if (ctx.message.text == "ubah") {
      await ctx.reply(text, batalDaftarButton());
      return ctx.wizard.back();
    } else if (ctx.message.text == "benar") {
      const dokter = await getDokterData(
        poli.data[parseInt(ctx.wizard.state.poli) - 1].id_poli
      );
      let text = "Silahkan Pilih Dokter Sesuai Nomor Dokter Dibawah Ini :  ";
      let i = 0;
      await dokter.data.map((obj) => {
        i++;
        text += "\n" + i + "." + obj.namadok;
      });

      await ctx.reply(text, batalDaftarButton());
      return ctx.wizard.next();
    } else {
      ctx.reply(
        "Cek Poli : " +
          poli.data[
            parseInt(ctx.wizard.state.poli) - 1
          ].nama_poli.toUpperCase() +
          "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    const poli = await getPoliData();
    const dokter = await getDokterData(
      poli.data[parseInt(ctx.wizard.state.poli) - 1].id_poli
    );
    //validasi Dimisisli Provinsi
    if (!isNumberOnly(ctx)) {
      await ctx.reply(
        "Input Hanya Diperbolehkan Menggunakan angka, Silahkan Pilih Dokter Sesuai Nomor Dokter Diatas : ",
        batalDaftarButton()
      );
    } else if (
      parseInt(ctx.message.text) < 1 ||
      parseInt(ctx.message.text) > dokter.size
    ) {
      let text =
        "Nomor Dokter Tidak Ditemukan, Silahkan Pilih Dokter Sesuai Nomor Dokter Dibawah Ini :  ";
      let i = 0;
      await dokter.data.map((obj) => {
        i++;
        text += "\n" + i + "." + obj.namadok;
      });

      await ctx.reply(text, batalDaftarButton());
    } else {
      ctx.wizard.state.dokter = ctx.message.text;
      ctx.reply(
        "Cek Dokter : " +
          dokter.data[
            parseInt(ctx.wizard.state.dokter) - 1
          ].namadok.toUpperCase() +
          "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }
    const poli = await getPoliData();
    const dokter = await getDokterData(
      poli.data[parseInt(ctx.wizard.state.poli) - 1].id_poli
    );
    //konfirmasi Domisili provinsi
    if (ctx.message.text == "ubah") {
      let text = "Silahkan Pilih Dokter Sesuai Nomor Dokter Dibawah Ini :  ";
      let i = 0;
      await dokter.data.map((obj) => {
        i++;
        text += "\n" + i + "." + obj.namadok;
      });

      await ctx.reply(text, batalDaftarButton());
      return ctx.wizard.back();
    } else if (ctx.message.text == "benar") {
      ctx.reply(
        "Tanggal Reservasi Format\nContoh 01 Februari 2021 :\n 01-02-2021",
        batalDaftarButton()
      );
      return ctx.wizard.next();
    } else {
      ctx.reply(
        "Cek Dokter : " +
          dokter.data[
            parseInt(ctx.wizard.state.dokter) - 1
          ].namadok.toUpperCase() +
          "\nApakah Sudah Benar?",
        konfirmasiButton()
      );
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    //validasi Tnggal Lahir
    if (!isDateFormat(ctx)) {
      ctx.reply(
        "Input Tanggal Tidak Sesuai Format, Silahkan Masukan Tanggal Reservasi :",
        batalDaftarButton()
      );
    } else if (!dateIsValid(ctx)) {
      ctx.reply(
        "Tanggal Yang Anda Masukan Tidak valid, Silahkan Masukan Tanggal Reservasi :",
        batalDaftarButton()
      );
    } else if (dateIsLess(ctx)) {
      ctx.reply(
        "Tanggal Yang Anda Masukan Sudah Terlewat, Silahkan Masukan Tanggal Reservasi :",
        batalDaftarButton()
      );
    } else if (dateIsToday(ctx)) {
      ctx.reply(
        "Tanggal Reservasi Minimal H-1 Kedatangan, Silahkan Masukan Tanggal Reservasi :",
        batalDaftarButton()
      );
    } else if (dateIsOver(ctx)) {
      ctx.reply(
        "Tanggal Reservasi Maximal H-7 Kedatangan, Silahkan Masukan Tanggal Reservasi :",
        batalDaftarButton
      );
    } else {
      ctx.wizard.state.tglreserv = ctx.message.text;
      ctx.reply(
        "Cek Tanggal Reservasi : " +
          ctx.message.text +
          "\nApakah Sudah Benar?\n",
        konfirmasiButton()
      );
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }
    const poli = await getPoliData();
    const dokter = await getDokterData(
      poli.data[parseInt(ctx.wizard.state.poli) - 1].id_poli
    );
    //konfirmasi Tanggal Lahir
    if (ctx.message.text == "ubah") {
      ctx.reply(
        "Tanggal Reservasi Format\nContoh 01 Februari 2021 :\n 01-02-2021",
        batalDaftarButton()
      );
      return ctx.wizard.back();
    } else if (ctx.message.text == "benar") {
      ctx.reply("Selesaikan Pendaftaran?", finishButton());
      ctx.wizard.state.namaDokter =
        dokter.data[parseInt(ctx.wizard.state.dokter) - 1].namadok;
      ctx.wizard.state.namaPoli =
        poli.data[parseInt(ctx.wizard.state.poli) - 1].nama_poli;
      return ctx.wizard.next();
    } else {
      ctx.reply(
        "Cek Tanggal Reservasi : " +
          ctx.wizard.state.tglreserv +
          "\nApakah Sudah Benar?\n",
        konfirmasiButton()
      );
    }
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    let noreg = "REG00001";
    let tgl = ctx.wizard.state.tglreserv;
    await ctx.reply("Pendaftaran Sukses", removeKeyboardButton());
    await ctx.reply("Mohon Tunggu Bukti Pendaftaran Sedang Dikirim");

    await buktiPendaftaran(
      noreg,
      ctx.wizard.state.namaPoli.trim(),
      ctx.wizard.state.namaDokter.trim(),
      tgl,
      ctx.wizard.state.kat,
      async (photo) => {
        ctx.replyWithChatAction("upload_photo");
        ctx.replyWithPhoto({ source: Buffer.from(photo, "base64") });
      }
    );

    return ctx.scene.leave();
  }
);

module.exports = pasienBaruWizard;
