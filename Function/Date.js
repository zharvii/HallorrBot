function getDateNow(time, dateSeparator) {
  if (time) {
    let currentdate = new Date();
    return (
      currentdate.getDate() +
      dateSeparator +
      (currentdate.getMonth() + 1) +
      dateSeparator +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds()
    );
  } else {
    var now = new Date();
    let years = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    if (month.toString().length == 1) {
      month = "0" + month;
    }

    if (day.toString().length == 1) {
      day = "0" + day;
    }
    return years + dateSeparator + month + dateSeparator + day;
  }
}

function getAge(dateString, dateType) {
  var now = new Date();
  //   var today = new Date(now.getYear(), now.getMonth(), now.getDate());

  var yearNow = now.getYear();
  var monthNow = now.getMonth();
  var dateNow = now.getDate();

  var dob = new Date(
    dateString.substring(0, 4),
    dateString.substring(4, 6) - 1,
    dateString.substring(6, 8)
  );

  var yearDob = dob.getYear();
  var monthDob = dob.getMonth();
  var dateDob = dob.getDate();

  yearAge = yearNow - yearDob;

  if (monthNow >= monthDob) var monthAge = monthNow - monthDob;
  else {
    yearAge--;
    var monthAge = 12 + monthNow - monthDob;
  }

  if (dateNow >= dateDob) var dateAge = dateNow - dateDob;
  else {
    monthAge--;
    var dateAge = 31 + dateNow - dateDob;

    if (monthAge < 0) {
      monthAge = 11;
      yearAge--;
    }
  }

  return yearAge + " tahun " + monthAge + " bulan " + dateAge + " hari";
}

function yyyyMMDD(date) {
  return (formated = date.split("-").reverse().join("-"));
}

module.exports = {
  getDateNow: getDateNow,
  getAge: getAge,
  yyyyMMDD: yyyyMMDD,
};
