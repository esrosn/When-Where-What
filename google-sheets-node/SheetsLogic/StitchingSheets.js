/*
 * Integrating Google Sheets with MongoDB using MongoDB Stitch
 */

// this object contains keys for each column in the spreadsheet
var columns = {
  start_time: 0,
  end_time: 1,
  network: 2,
  stream: 3,
  notes: 4,
  stream_id: 5,
};

function time(date, time) {
  var formattedDate = Utilities.formatDate(
    new Date(date + 'T' + time),
    'CST',
    "yyyy-MM-dd'T'HH:mm:ssZ"
  );
  return formattedDate;
}

function exportStreamsToMongoDB() {
  var spreadsheet = SpreadsheetApp.getActive();
  var allSheets = spreadsheet.getSheets();

  allSheets.forEach(function (sheet) {
    var date = sheet.getSheetName();
    var currentSheet = spreadsheet.getSheetByName(date);
    var headerRows = 1; // Number of rows of header info (to skip)
    var range = currentSheet.getDataRange(); // determine the rang of populated data
    var numRows = range.getNumRows(); // get the number of rows in the range
    var data = range.getValues(); // get the actual data in an array data[row][column]

    for (var i = headerRows; i < numRows; i++) {
      // set values for each key of the data object we're sending to MongoDB
      var streamIdCell = range.getCell(i + 1, columns.stream_id + 1);
      var stream = data[i][columns.stream];
      var network = console.log(network);
      var link = range
        .getCell(i + 1, columns.network + 1)
        .getFormula()
        .match(/=\w+\((.*)\)/i)[1]
        .split(',')[0];
      var start_time =
        data[i][columns.start_time] === 'TBA'
          ? 'TBA'
          : time(date, data[i][columns.start_time]);
      var end_time =
        data[i][columns.end_time] === 'TBA'
          ? 'TBA'
          : data[i][columns.end_time] === ''
          ? ''
          : time(date, data[i][columns.end_time]);
      var formData = {
        stream_name: stream,
        network: data[i][columns.network],
        notes: data[i][columns.notes],
        link: link,
        start_time: start_time,
        end_time: end_time,
        stream_id: data[i][columns.stream_id],
      };
      var options = {
        method: 'post',
        payload: formData,
      };

      if (link) {
        var insertID = UrlFetchApp.fetch('', options);
        streamIdCell.setValue(insertID);
      }
    }
  });
}
