const WizardScene = require("telegraf/scenes/wizard");

const {
  isNumberOnly,
  isDateFormat,
  dateIsValid,
  dateIsLess,
  dateIsOver,
  dateIsToday,
} = require("../../Function/Validation");

const {
  mainMenuButton,
  batalDaftarButton,
  konfirmasiButton,
  kategoriButton,
  finishButton,
  removeKeyboardButton,
} = require("../../Library/Button");

const { welcomeMessage } = require("../../Library/Message");

const { trimData } = require("../../Function/Data");

const { buktiPendaftaran } = require("../../Function/Drawing");

const { getPoliData } = require("../../Data/Poli");

const { getDokterData } = require("../../Data/Dokter");

const { getPxFromHMS } = require("../../Data/Pasien");

let dataPx = {};

function home(ctx) {
  let msg = welcomeMessage(ctx);
  let btn = mainMenuButton();
  ctx.reply(msg, btn);
}

const pasienLamaWizard = new WizardScene(
  "pasien-lama",
  (ctx) => {
    ctx.reply("No Rekam Medis : ", batalDaftarButton());
    return ctx.wizard.next();
  },
  async (ctx) => {
    //Jika Batal Daftar
    if (ctx.message.text == "batal daftar") {
      await ctx.reply("Pendaftaran Dibatalkan", removeKeyboardButton());
      home(ctx);
      return ctx.scene.leave();
    }

    //validasi no identitas
    if (!isNumberOnly(ctx)) {
      await ctx.reply(
        "Input No Rekam Medis Hanya Diperbolehkan Menggunakan Angka"
      );
      ctx.reply("No Rekam Medis : ", batalDaftarButton());
    } else {
      let px = await getPxFromHMS(ctx.message.text);

      if (px.size == 0) {
        await ctx.reply("No Rekam Medis Tidak Ditemukan");
        ctx.reply("No Rekam Medis : ", batalDaftarButton());
      } else {
        ctx.wizard.state.rm = ctx.message.text;
        dataPx = {
          rm: px.data[0].rekmed,
          nama: px.data[0].namapas,
          jkel: px.data[0].jkel,
          alamat: px.data[0].alamat1,
          nojkn: px.data[0].nocard,
        };

        await ctx.reply("No Rekam Medis : " + ctx.wizard.state.rm);

        await ctx.reply("Data :");
        if (dataPx.nojkn == "") {
          await ctx.replyWithHTML(
            "<b>No Rekam Medis :</b> " +
              dataPx.rm +
              "\n<b>Nama :</b> " +
              dataPx.nama +
              "\n<b>Jenis Kelamin : </b>" +
              dataPx.jkel +
              "\n<b>Alamat : </b>" +
              dataPx.alamat +
              "\n<b>No JKN : - </b>"
          );
        } else {
          await ctx.replyWithHTML(
            "<b>No Rekam Medis :</b> " +
              dataPx.rm +
              "\n<b>Nama :</b> " +
              dataPx.nama +
              "\n<b>Jenis Kelamin : </b>" +
              dataPx.jkel +
              "\n<b>Alamat : </b>" +
              dataPx.alamat +
              "\n<b>No JKN : </b>" +
              dataPx.nojkn
          );
        }

        await ctx.reply("Apakah Data Sudah Benar?", konfirmasiButton());
        return ctx.wizard.next();
      }
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
      ctx.reply("No Rekam Medis : ", batalDaftarButton());
      return ctx.wizard.back();
    } else if (ctx.message.text == "benar") {
      ctx.reply("Kategori  : ", kategoriButton());
      return ctx.wizard.next();
    } else {
      await ctx.reply("Data :");
      if (dataPx.nojkn == "") {
        await ctx.replyWithHTML(
          "<b>No Rekam Medis :</b> " +
            dataPx.rm +
            "\n<b>Nama :</b> " +
            dataPx.nama +
            "\n<b>Jenis Kelamin : </b>" +
            dataPx.jkel +
            "\n<b>Alamat : </b>" +
            dataPx.alamat +
            "\n<b>No JKN : - </b>"
        );
      } else {
        await ctx.replyWithHTML(
          "<b>No Rekam Medis :</b> " +
            dataPx.rm +
            "\n<b>Nama :</b> " +
            dataPx.nama +
            "\n<b>Jenis Kelamin : </b>" +
            dataPx.jkel +
            "\n<b>Alamat : </b>" +
            dataPx.alamat +
            "\n<b>No JKN : </b>" +
            dataPx.nojkn
        );
      }

      ctx.reply("Apakah Data Sudah Benar?", konfirmasiButton());
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
        if (dataPx.nojkn != "") {
          ctx.wizard.state.nojkn = dataPx.nojkn;
          ctx.wizard.selectStep(6);
          return ctx.wizard.steps[6](ctx);
        } else {
          ctx.reply("No JKN  : ", batalDaftarButton());
          return ctx.wizard.next();
        }
      } else {
        ctx.wizard.selectStep(6);
        return ctx.wizard.steps[6](ctx);
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

module.exports = pasienLamaWizard;
