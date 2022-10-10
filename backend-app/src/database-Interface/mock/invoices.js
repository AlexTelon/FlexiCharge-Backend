
/**
 * Response format strcuture:
 * 
 * userID: uuid / sub from AWS Cognito
 * 
 * invoiceID: base64url strinig, encoded in format	userID:YYYY:MM OR uuid string
 * base64url example: 
 * 	Plain Text: 796b41e6-a8df-48bb-8d38-f5274b9c3cc5:2022:04
 * 	base64url: Nzk2YjQxZTYtYThkZi00OGJiLThkMzgtZjUyNzRiOWMzY2M1OjIwMjI6MDQ
 */
 
const allInvoices = [
  {
    type: ["Users", "Admins"],
    userID: "1bef37f8-982a-43e9-8d6c-49e22e767a24",
    email: "spma20pm@student.ju.se",
    invoices: [
      {
        invoiceID:
          "NDc5ZmM1NDItNDVmOC00MGEyLTk5ZTUtZjEwNGM0MjE2OTRkOjIwMjI6MDE",
        date: "2022-01",
        status: "Paid",
        invoiceURL:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        totalSum: 100,
      },
      {
        invoiceID:
          "NDc5ZmM1NDItNDVmOC00MGEyLTk5ZTUtZjEwNGM0MjE2OTRkOjIwMjI6MDI",
        date: "2022-02",
        status: "Unpaid",
        invoiceURL:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        totalSum: 200,
      },
      {
        invoiceID:
          "NDc5ZmM1NDItNDVmOC00MGEyLTk5ZTUtZjEwNGM0MjE2OTRkOjIwMjI6MDM",
        date: "2022-03",
        status: "Paid",
        invoiceURL:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        totalSum: 300,
      },
    ],
  },
  {
    type: ["Users", "Admins"],
    userID: "479fc542-45f8-40a2-99e5-f104c421694d",
    email: "phille923@gmail.com",
    invoices: [
      {
        invoiceID:
          "NDc5ZmM1NDItNDVmOC00MGEyLTk5ZTUtZjEwNGM0MjE2OTRkOjIwMjI6MDE",
        date: "2022-01",
        status: "Paid",
        invoiceURL:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        totalSum: 100,
      },
      {
        invoiceID:
          "NDc5ZmM1NDItNDVmOC00MGEyLTk5ZTUtZjEwNGM0MjE2OTRkOjIwMjI6MDI",
        date: "2022-02",
        status: "Unpaid",
        invoiceURL:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        totalSum: 200,
      },
      {
        invoiceID:
          "NDc5ZmM1NDItNDVmOC00MGEyLTk5ZTUtZjEwNGM0MjE2OTRkOjIwMjI6MDM",
        date: "2022-03",
        status: "Paid",
        invoiceURL:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        totalSum: 300,
      },
    ],
  },
  {
    type: ["Users"],
    userID: "796b41e6-a8df-48bb-8d38-f5274b9c3cc5",
    email: "khha20qz@student.ju.se",
    invoices: [
      {
        invoiceID:
          "Nzk2YjQxZTYtYThkZi00OGJiLThkMzgtZjUyNzRiOWMzY2M1OjIwMjI6MDE",
        date: "2022-01",
        status: "Paid",
        invoiceURL:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        totalSum: 100,
      },
      {
        invoiceID:
          "Nzk2YjQxZTYtYThkZi00OGJiLThkMzgtZjUyNzRiOWMzY2M1OjIwMjI6MDI",
        date: "2022-02",
        status: "Paid",
        invoiceURL:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        totalSum: 200,
      },
      {
        invoiceID:
          "Nzk2YjQxZTYtYThkZi00OGJiLThkMzgtZjUyNzRiOWMzY2M1OjIwMjI6MDM",
        date: "2022-03",
        status: "Paid",
        invoiceURL:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        totalSum: 300,
      },
			{
        invoiceID:
          "Nzk2YjQxZTYtYThkZi00OGJiLThkMzgtZjUyNzRiOWMzY2M1OjIwMjI6MDQ",
        date: "2022-04",
        status: "Paid",
        invoiceURL:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        totalSum: 400,
      },
    ],
  },
];

// ----- Invoice Functions -----

exports.getAllInvoices = () => {
	return allInvoices
} 

exports.getAllInvoicesByUserID = (userID) => {
	const invoices = allInvoices
	
	return invoices.filter((invoiceRow) => invoiceRow.userID == userID)
}

// ----- Invoice generation -----

exports.user = {
  userName: "nisse.hult",
  email: "nisse.hult@riksdagen.se",
  name: "Nisse",
  familyName: "Hult",
  phoneNumber: "+4679131313",
  address: "Pillegatan 13\n420 69 Pilleby\nSWEDEN",
};

exports.chargeSessions = [
  {
    chargeSessionID: 1,
    userID: "nisse.hult@riksdagen.se",
    kwhTransfered: 12.5,
    currentChargePercentage: 50.0,
    meterStart: 1,
    startTime: 1656797460,
    endTime: 1656825900,
    chargerID: 12,
  },
  {
    chargeSessionID: 2,
    userID: "nisse.hult@riksdagen.se",
    kwhTransfered: 33.3,
    currentChargePercentage: 11.0,
    meterStart: 9,
    startTime: 1656970260,
    endTime: 1656998700,
    chargerID: 12,
  },
  {
    chargeSessionID: 3,
    userID: "nisse.hult@riksdagen.se",
    kwhTransfered: 0.9,
    currentChargePercentage: 70.0,
    meterStart: 9,
    startTime: 1657315860,
    endTime: 1657344300,
    chargerID: 12,
  },
  {
    chargeSessionID: 4,
    userID: "nisse.hult@riksdagen.se",
    kwhTransfered: 14.0,
    currentChargePercentage: 88.0,
    meterStart: 9,
    startTime: 1657920660,
    endTime: 1658035500,
    chargerID: 12,
  },
  {
    chargeSessionID: 5,
    userID: "nisse.hult@riksdagen.se",
    kwhTransfered: 69.69,
    currentChargePercentage: 69.0,
    meterStart: 9,
    startTime: 1658439060,
    endTime: 1658467500,
    chargerID: 12,
  },
];
