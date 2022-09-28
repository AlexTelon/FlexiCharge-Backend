const PDFDocument = require('pdfkit-table');

exports.generateMonthlyInvoicePDF = () => {
    const doc = new PDFDocument({
        margin: 30, size: 'A4'
    })
    .font('Helvetica');

    doc
    .fontSize(12)
    .text('FlexiCharge Invoice', {align: 'left', continued: true})
    .text('2022-09-01 To 2022-09-30', {align: 'right'})
    .text(' ')

    doc
    .fontSize(14)
    .text('Name: Nisse Hult')
    .text("Email: nisse.hult@riksdagen.se")
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
            "Price (SEK)"
        ],
        rows: [
            ["2022-07-02 23:31", "2022-07-03 07:25", "12:31"],
            ["2022-07-04 23:31", "2022-07-05 07:25", "12:00"],
            ["2022-07-08 23:31", "2022-07-09 07:25", "25:01"],
            ["2022-07-15 23:31", "2022-07-17 07:25", "69:69"],
            ["2022-07-21 23:31", "2022-07-22 07:25", "14:88"],
        ],
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
    .text('Total Price (SEK): 133:89')
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
