"use strict";
exports.__esModule = true;
exports.nikParser = void 0;
var wilayah_json_1 = require("../Data/wilayah.json");
exports.nikParser = function (nik) {
  return {
    isValid: function () {
      var _this = this;
      var isValidLength = function () {
        return nik.length === 16;
      };
      var isValidProvinsi = function () {
        return !!_this.province();
      };
      var isValidKabupatenKota = function () {
        return !!_this.kabupatenKota();
      };
      var isValidKecamatan = function () {
        return !!_this.kecamatan();
      };
      return (
        isValidLength() &&
        isValidProvinsi() &&
        isValidKabupatenKota() &&
        isValidKecamatan()
      );
    },
    provinceId: function () {
      return nik.substring(0, 2);
    },
    province: function () {
      return wilayah_json_1.provinsi[this.provinceId()];
    },
    kabupatenKotaId: function () {
      return nik.substring(0, 4);
    },
    kabupatenKota: function () {
      return wilayah_json_1.kabkot[this.kabupatenKotaId()];
    },
    kecamatanId: function () {
      return nik.substring(0, 6);
    },
    kecamatan: function () {
      return wilayah_json_1.kecamatan[this.kecamatanId()].split(" -- ")[0];
    },
    kodepos: function () {
      return wilayah_json_1.kecamatan[this.kecamatanId()].slice(-5);
    },
    kelamin: function () {
      return parseInt(nik.substring(6, 8)) < 40 ? "pria" : "wanita";
    },
    lahir: function () {
      var year = nik.substring(10, 12);
      var month = nik.substring(8, 10);
      var date = Number(nik.substring(6, 8));
      var now = new Date();
      if (date > 40) {
        date = date - 40;
      }

      let startYear = "";
      let yearBrith = Number(year) + 2000;
      let yearNow = Number(now.getFullYear());

      if (yearBrith > yearNow) {
        startYear = "19";
      } else {
        startYear = "20";
      }

      return date.toString() + "-" + month + "-" + startYear + year;
    },
    uniqcode: function () {
      return nik.substring(12, 16);
    },
  };
};
