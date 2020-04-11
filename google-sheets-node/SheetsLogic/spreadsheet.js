const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require('util');

function getSheets(numOfSheets, doc) {
  let sheet,
    sheets = [];

  for (let i = 0; i <= numOfSheets - 1; i++) {
    sheet = doc.sheetsByIndex[i];
    sheets.push(sheet);
  }

  return sheets;
}

function printStream(date, stream) {
  console.log(date);
  console.log('**********************');
  Object.keys(stream)
    .slice(3)
    .map((key) => console.log(`${key}: ${stream[key]}`));
  console.log(`Full Stream Object: ${stream}`);
  console.log(`----------------------`);
  console.log('                    ');
}

async function accessSpreadSheet(query) {
  const doc = new GoogleSpreadsheet(
    '1CAUMXBBEtkhWThhm5T6Qh2TdWBgCsHpV1DqKy7Sn1LY'
  );
  await doc.useServiceAccountAuth(require('./client_secret.json'));

  await doc.loadInfo();

  const numOfSheets = doc.sheetCount;
  const sheet = doc.sheetsByIndex[0];

  let sheets = await getSheets(numOfSheets, doc);

  sheets.forEach(async (sheet, idx) => {
    let rows = await sheet.getRows({
      offset: 1,
    });

    rows = rows.sort();
    rows.forEach((row) => printStream(sheet.title, row));
  });
}

accessSpreadSheet('Network = Twitch');
