function trimData(obj) {
  for (var prop in obj) {
    var value = obj[prop],
      type = typeof value;
    if (
      value != null &&
      (type == "string" || type == "object") &&
      obj.hasOwnProperty(prop)
    ) {
      if (type == "object") {
        trimData(obj[prop]);
      } else {
        obj[prop] = obj[prop].trim();
      }
    }
  }
}

function replaceProperty(obj, prop, value) {
  Object.keys(obj).map(function (key, index) {
    if (key == prop) {
      obj[key] = value;
    }
  });
}

module.exports = {
  trimData: trimData,
  replaceProperty: replaceProperty,
};
