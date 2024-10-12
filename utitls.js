function defineHeading(doc, content, currentY) {
   // Now define the rectangle and "Employee Information" text
   const text = content;
   const textSize = 16;
   const pageWidth = doc.page.width - 50; // Get the page width
   // Measure the text height
   const textHeight = doc.fontSize(textSize).currentLineHeight();
   // Draw the background rectangle behind the text with full width
   doc.rect(25, currentY - 5, pageWidth, textHeight + 10)
      .fill('#eeeeee');
   // Draw the text on top of the background, aligned to center
   doc.fontSize(textSize)
      .font('Helvetica-Bold')
      .fill('#000000') // Text color
      .text(text, 25, currentY, { align: 'center', width: pageWidth });
}
function drawVerticalTable(doc, headers, rows, startX, startY, columnWidths, rowHeight) {
   let currentY = startY;
   // Draw table headers
   doc.fontSize(12).font('Helvetica-Bold');
   let currentX = startX;
   headers.forEach((header, i) => {
      doc.rect(currentX, currentY, columnWidths[i], rowHeight).fill("#eeeeee").stroke();
      doc.fill('#000000');
      doc.text(header, currentX + 5, currentY + 10, { width: columnWidths[i], align: 'left' });
      currentX += columnWidths[i];
   });

   currentY += rowHeight;

   // Draw table rows
   doc.fontSize(12).font('Helvetica');
   rows.forEach((row, rowIndex) => {
      currentX = startX;
      Object.values(row).forEach((value, colIndex) => {
         doc.rect(currentX, currentY, columnWidths[colIndex], rowHeight).fill("#dde4ff").stroke();
         doc.fill('#000000');
         doc.text(value, currentX + 5, currentY + 10, { width: columnWidths[colIndex], align: 'left' });
         currentX += columnWidths[colIndex];
      });
      currentY += rowHeight;
   });
};
function drawRectangle(doc, currentY, colWidth, rowHeight, text1, text2) {
   doc.rect(25, currentY - 5, colWidth, rowHeight + 10).fill("#eeeeee");
   doc.rect(75 + colWidth, currentY - 5, colWidth, rowHeight + 10).fill("#eeeeee");
   doc.fill('#000000');
   doc.fontSize(16).font('Helvetica-Bold')
      .text(text1, 25, currentY + 5, { width: colWidth, align: 'left', indent: 5 });
   // Draw second column text
   doc.fontSize(16).font('Helvetica-Bold')
      .text(text2, 75 + colWidth, currentY + 5, { width: colWidth, align: 'left', indent: 5 })
   currentY = doc.y + 10;
}
function drawRectangleForSignature(doc, currentY, colWidth, text1, text2) {
   const textHeight = doc.heightOfString(text1, { width: colWidth });
   const padding = 10;
   // Set rectangle height based on content
   const rectHeight = textHeight + 10; // Add padding if needed
   currentY = doc.y + 20;
   // First rectangle with border
   doc.lineWidth(1)  // Set the thickness of the border
      .strokeColor('#000')  // Set the border color
      .rect(25, currentY - 5, colWidth, rectHeight + (2 * padding))  // Define the rectangle
      .stroke();  // Draw the border

   // Second rectangle with border
   doc.lineWidth(1)
      .strokeColor('#000')
      .rect(75 + colWidth, currentY - 5, colWidth, rectHeight + (2 * padding))
      .stroke();
   doc.fill('#000000');

   doc.fontSize(14).font('Helvetica')
      .text(text1, 25 + padding, currentY + 5, { width: colWidth - (2 * padding), align: 'justify', });
   doc.fontSize(14).font('Helvetica')
      .text("Signature/Stamp:", 25 + padding, currentY + 85, { width: colWidth, align: 'justify', });
   // Draw second column text
   doc.fontSize(14).font('Helvetica')
      .text(text2, 75 + colWidth + padding, currentY + 5, { width: colWidth - (2 * padding), align: 'justify', })
   doc.fontSize(14).font('Helvetica')
      .text("Signature/Stamp:", 75 + colWidth + padding, currentY + 85, { width: colWidth, align: 'justify', })

}
module.exports = { defineHeading, drawVerticalTable, drawRectangle, drawRectangleForSignature }