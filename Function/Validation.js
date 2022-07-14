const moment = require("moment");
const { getDateNow, yyyyMMDD } = require("./date");

function isAlphabetOnly(ctx) {
  const regex = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
  if (ctx.message.text.match(regex)) {
    return true;
  } else {
    return false;
  }
}

function isNumberOnly(ctx) {
  const regex = /^\d+$/;
  if (ctx.message.text.match(regex)) {
    return true;
  } else {
    return false;
  }
}

function isDateFormat(ctx) {
  const regex = /^\s*(3[01]|[12][0-9]|0?[1-9])\-(1[012]|0?[1-9])\-((?:19|20)\d{2})\s*$/g;
  if (ctx.message.text.match(regex)) {
    return true;
  } else {
    return false;
  }
}

function dateIsValid(ctx) {
  let date = yyyyMMDD(ctx.message.text);
  if (moment(date, "YYYY-MM-DD").isValid()) {
    return true;
  } else {
    return false;
  }
}

function dateIsLess(ctx) {
  let date = yyyyMMDD(ctx.message.text);
  if (moment(date).isBefore(getDateNow(false, "-"))) {
    return true;
  } else {
    return false;
  }
}

function dateIsToday(ctx) {
  let date = yyyyMMDD(ctx.message.text);
  if (moment(date).isSame(getDateNow(false, "-"))) {
    return true;
  } else {
    return false;
  }
}

function dateIsOver(ctx) {
  let date = yyyyMMDD(ctx.message.text);
  let maxDateReservation = moment().add(7, "d").format("YYYY-MM-DD");
  if (moment(date).isAfter(maxDateReservation)) {
    return true;
  } else {
    return false;
  }
}

function dateIsNext(ctx) {
  let date = yyyyMMDD(ctx.message.text);
  if (moment(date).isAfter(getDateNow(false, "-"))) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  isAlphabetOnly: isAlphabetOnly,
  isNumberOnly: isNumberOnly,
  isDateFormat: isDateFormat,
  dateIsValid: dateIsValid,
  dateIsLess: dateIsLess,
  dateIsToday: dateIsToday,
  dateIsOver: dateIsOver,
  dateIsNext: dateIsNext,
};
