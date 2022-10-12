exports.convertUnixToIso8601 = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).substr(-2);
  const day = ("0" + date.getDate()).substr(-2);
  const hour = ("0" + date.getHours()).substr(-2);
  const minutes = ("0" + date.getMinutes()).substr(-2);
  const seconds = ("0" + date.getSeconds()).substr(-2);

  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds
  );
};

exports.getYearAndMonthFromUnix = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return {
    year: date.getFullYear(),
    month: ("0" + (date.getMonth() + 1)).substr(-2),
  };
};

exports.isValidDate = (date) => {
  return new Date(date).toString() !== "Invalid Date";
};

exports.convertToTimestamp = (date) => {
  return Math.floor(new Date(date).getTime() / 1000);
};

exports.isValidDateFormatYearAndMonth = (date) => {
  // Date Fromat: YYYY-MM
  const invoiceDate = date.split("-");
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  return (
    invoiceDate.length === 2 &&
    invoiceDate.at(0).length === 4 &&
    invoiceDate.at(0).match(/^[0-9]+$/) != null &&
    months.includes(invoiceDate.at(1))
  );
};
