function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate()
  .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

function getData(){
  let jsData = MyIMCLibrary.createMyJSONdata('data','A2:I2','A5:I')
  // jsData = jsData.map(row =>{
  //   let dateValue = row['วันที่'].split('-')
  //   row['วันที่'] = new Date(parseInt(dateValue[0]),parseInt(dateValue[1])-1,parseInt(dateValue[2]))
  //   return row
  // })
  console.log(jsData)
  return jsData
}

function editCustomerById(id, obj) {
  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const custIds = ws.getRange(5, 1, ws.getLastRow() - 4, 1).getDisplayValues().map(r => r[0].toString().toLowerCase());
  const posIndex = custIds.indexOf(id.toString().toLowerCase());
  const rowNumber = posIndex === -1 ? 0 : posIndex + 5;
  
  let colI = replaceFile(obj.colI, ws.getRange(rowNumber, 9).getValue());
  
  ws.getRange(rowNumber, 2, 1, 8).setValues([[
    obj.colB,
    obj.colC,
    obj.colD,
    obj.colE,
    obj.colF,
    obj.colG,
    obj.colH,
    colI
  ]]);
  
  return { fileUrl: colI };
}

function deleteRecord(props){
  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
  const idCellMatched = ws.getRange("A5:A").createTextFinder(props.id).matchEntireCell(true).matchCase(true).findNext()
  
  if(idCellMatched === null) throw new Error("No matching record")
   const recordRowNumber = idCellMatched.getRow()
   ws.deleteRow(recordRowNumber)
    return true
}

function addRecord(colB, colC, colD, colE, colF, colG, colH, colI) {
  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const newId = MyIMCLibrary.createNewId();
  colI = upLoadFile(colI);
  ws.appendRow([
    newId,
    colB,
    colC,
    colD,
    colE,
    colF,
    colG,
    colH,
    colI
  ]);
  return { newId: newId, fileUrl: colI };
}


function upLoadFile(filedata){
  if(!filedata.data) return ''
  let file = SuperScript.uploadFile('1ALcIl3jkx2PnqxCiQ7j8oVtVXsC5Bfp-',filedata.data, filedata.name)
  return 'https://drive.google.com/uc?id=' + file.getId()
}

function replaceFile(filedata, oldUrl){
  if(oldUrl == '') return ''
  let oldFileid = oldUrl.split('id=')[1]
  DriveApp.getFileById(oldFileid).setTrashed(true)
  return upLoadFile(filedata)
}




