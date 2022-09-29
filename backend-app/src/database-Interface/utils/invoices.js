const PDFDocument = require('pdfkit-table')
const { 
    convertUnixToIso8601, 
    getYearAndMonthFromUnix 
} = require('../helpers/date')

const calculateChargeSessions = (chargeSessions) => {
    const tableRows = []
    let totalSum = 0
    
    for (const chargeSession of chargeSessions) {
        const chargeSessionRow = []
        const sessionPrice = 10 // kwh price * duration
        
        chargeSessionRow.push(convertUnixToIso8601(chargeSession.startTime))
        chargeSessionRow.push(convertUnixToIso8601(chargeSession.endTime))
        chargeSessionRow.push(chargeSession.kwhTransfered)
        
        tableRows.push(chargeSessionRow)
        totalSum += sessionPrice
    }
    console.log(tableRows)
    return {
        tableRows,
        totalSum
    }
}



exports.generateMonthlyInvoicePDF = (user, chargeSessions) => {
    const calculatedChargeSessions = calculateChargeSessions(chargeSessions)
    const { year, month } = getYearAndMonthFromUnix(chargeSessions[0].startTime)
    const doc = new PDFDocument({
        margin: 30, size: 'A4'
    })
    .font('Helvetica');

    doc
    .fontSize(12)
    .text('FlexiCharge Invoice', {align: 'left', continued: true})
    .text(`${year} - ${month}`, {align: 'right'})
    .text(' ')

    doc
    .fontSize(14)
    .text(`Name: ${user.name} ${user.familyName}`)
    .text(`Email: ${user.email}`)
    .text(' ')

    doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Charge sessions:')
    .text(' ')

    const tableArrayColor = {
        headers: [
            "Charge session start", 
            "Charge session end", 
            "KWH transfered"
        ],
        rows: calculatedChargeSessions.tableRows,
    };
        doc.table( tableArrayColor, { 
            columnsSize: [150,150,100],
            prepareRow: (row, indexColumn, indexRow, rectRow) => {
                doc.font("Helvetica").fontSize(12);
                indexColumn === 0 && doc.addBackground(rectRow, (indexRow % 2 ? 'white' : 'grey'), 0.5);
            }
    });

    doc
    .fontSize(15)
    .font('Helvetica-Bold')
    .text(`Total Price (SEK): ${calculatedChargeSessions.totalSum}`)
    .text(' ')
    
    doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Payment Details:')

    doc
    .fontSize(12)
    .font('Helvetica')
    .text('    OCR: <OCR number here>')
    
    doc
    .fontSize(12)
    .font('Helvetica')
    .text('    Bankgiro: <Insert Bankgiro here>')
  
    doc.end();
    return doc
}
