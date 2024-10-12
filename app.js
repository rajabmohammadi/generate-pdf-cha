const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { defineHeading, drawVerticalTable, drawRectangle, drawRectangleForSignature } = require("./utitls")
const app = express();

app.use(express.json());

const doc = new PDFDocument({ size: 'A4' });
app.post('/generate-pdf', (req, res) => {
   const data = req.body;
   const filename = 'payslip.pdf';
   // Set headers to prompt download
   res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
   res.setHeader('Content-Type', 'application/pdf');

   doc.pipe(res); // Send the PDF stream to the response

   // Add content to the PDF
   generatePDF(data);

   doc.end(); // Finalize the PDF file
});

// Function to create PDF content
function generatePDF(data) {
   const { employeeInfo, analyticalInfo, salaryInfo } = data;
   // Logo and header
   // Load the image
   const imagePath = path.join(__dirname, 'public', 'logo.png');
   const imageWidth = 150; // Image width
   const pageWidth = doc.page.width; // Page width

   // Calculate x position to center the image
   const x = (pageWidth - imageWidth) / 2;

   // Add the image to the document
   doc.image(imagePath, x, 0, { width: imageWidth });
   let currentY = doc.y + 15;
   doc.rect(25, currentY - 5, doc.page.width - 50, 5).fill("#eeeeee");
   currentY = doc.y + 20;
   doc.fontSize(20)
      .font('Helvetica-Bold')
      .fillColor('#000000')  // Set the text color to black
      .text("MONTHLY PAYSLIP", 25, currentY + 5, {
         width: doc.page.width - 50,
         align: 'center'
      });

   function horizontalTable(col1, col2, col3, col4, thBgColor, tdBgColor) {
      const pageWidth = doc.page.width;
      // Divide page width by 4, with some margin (100 units total)
      const columnWidth = (pageWidth - 50) / 4;
      // Height of each row
      const rowHeight = 15;
      // Draw column
      doc.rect(25, currentY - 5, columnWidth, rowHeight + 10).fillColor(thBgColor).fill();
      doc.rect(25 + columnWidth, currentY - 5, columnWidth, rowHeight + 10).fillColor(tdBgColor).fill();
      doc.rect(25 + 2 * columnWidth, currentY - 5, columnWidth, rowHeight + 10).fillColor(thBgColor).fill();
      doc.rect(25 + 3 * columnWidth, currentY - 5, columnWidth, rowHeight + 10).fillColor(tdBgColor).fill();

      doc.fill('#000000');

      // Draw first column text
      doc.fontSize(12).font('Helvetica-Bold')
         .text(col1, 25, currentY + 5, { width: columnWidth, align: 'left', indent: 5 });

      // Draw second column text
      doc.fontSize(12).font('Helvetica')
         .text(col2, 25 + columnWidth, currentY + 5, { width: columnWidth, align: 'left', indent: 5 })

      // Draw third column text
      doc.fontSize(12).font('Helvetica-Bold')
         .text(col3, 25 + 2 * columnWidth, currentY + 5, { width: columnWidth, align: 'left', indent: 5 });

      // Draw fourth column text
      doc.fontSize(12).font('Helvetica')
         .text(col4, 25 + 3 * columnWidth, currentY + 5, { width: columnWidth, align: 'left', indent: 5 });
      // Move down for the next row
      currentY += rowHeight + 12; // Adjust for row height and spacing

   }
   currentY = doc.y + 10;

   // define heading
   defineHeading(doc, "Employee Information", currentY)
   currentY = doc.y + 10;
   // Function to draw a row with four columns and background colors

   // Convert the object to an array of entries (key-value pairs)
   const employeeEntries = Object.entries(employeeInfo);

   // Loop through the entries array in steps of 2 to get two keys and values at a time
   for (let i = 0; i < employeeEntries.length; i += 2) {
      const [key1, value1] = employeeEntries[i];
      const [key2, value2] = employeeEntries[i + 1] || ['', ''];
      if (key2 == "" || value2 == "") {
         horizontalTable(key1 + ':', value1, key2 + '', value2, '#eeeeee', '#dde4ff');
      } else {
         horizontalTable(key1 + ':', value1, key2 + ':', value2, '#eeeeee', '#dde4ff');
      }
   }
   currentY = doc.y + 25;
   defineHeading(doc, 'Analytical Information', currentY);

   // Table headers and column widths
   const headers = ['Project', 'Job', 'Budget line', 'Account', 'Salary', 'Gross Salary', 'Net Salary'];
   const columnWidths = [70, 80, 80, 80, 70, 85, 80]; // Width for each column
   const rowHeight = 25; // Height for each row
   // Draw the table
   drawVerticalTable(doc, headers, analyticalInfo, 25, doc.y + 5, columnWidths, rowHeight);

   currentY = doc.y + 10;

   // Salary Information
   defineHeading(doc, 'Salary Information', currentY);
   currentY = doc.y + 10;
   // Convert the object to an array of entries (key-value pairs)
   const salaryInfoEntries = Object.entries(salaryInfo);

   // Loop through the entries array in steps of 2 to get two keys and values at a time
   for (let i = 0; i < salaryInfoEntries.length; i += 2) {
      const [key1, value1] = salaryInfoEntries[i];
      const [key2, value2] = salaryInfoEntries[i + 1] || ['', ''];

      if (key2 == "" || value2 == "") {
         horizontalTable(key1 + ':', value1, key2 + '', value2, '#eeeeee', '#dde4ff');
      } else {
         horizontalTable(key1 + ':', value1, key2 + ':', value2, '#eeeeee', '#dde4ff');
      }
   }

   let colWidth = (doc.page.width - 100) / 2
   drawRectangle(doc, currentY, colWidth, rowHeight, "HR Department Confirmation", "Employee Acknowledgment")
   // Measure the height of the text
   let text1 = "We hereby confirm the accuracy of theemployee salary calculation outlined above,in accordance with the organization'spolicies and procedures.";
   let text2 = "I hereby acknowledge the receipt of the netsalary as stated. and I affirm my fullunderstanding and agreement with all theaforementioned printed details."
   drawRectangleForSignature(doc, currentY, colWidth, text1, text2)

}




// Start server
app.listen(3000, () => {
   console.log('Server started on http://localhost:3000');
});
