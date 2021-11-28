"use strict"

const input = document.querySelector('#excel');

input.addEventListener('change', handleImport);

async function exportToFirestore() {
	// read from a file
	const workbook = new ExcelJS.Workbook();
	// await workbook.xlsx.readFile("test.xlsx");
	let x = readFile("test.xlsx").then(() => {

	});
	console.log(x);
}

function readFile(fileName) {
	let file = new File(fileName);
	return new Promise((resolve, reject) => {
		var fr = new FileReader()
		fr.onload = () => {
			resolve(fr.result)
		}
		fr.onerror = reject
		fr.readAsArrayBuffer(file)
	});
}

function handleImport(e) {
	this.file = e.target.files[0]
	const wb = new ExcelJS.Workbook();
	const reader = new FileReader()
	reader.readAsArrayBuffer(this.file)
	reader.onload = () => {
	  const buffer = reader.result;
	  wb.xlsx.load(buffer).then(workbook => {
		workbook.eachSheet((sheet, id) => {
		  sheet.eachRow((row, rowIndex) => {
			console.log(row.values, rowIndex)
		  })
		})
	  })
	}
  }

  function start(){

  }

document.addEventListener("DOMContentLoaded", start());