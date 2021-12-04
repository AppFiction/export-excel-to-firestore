"use strict"

const input = document.querySelector('#excel');
var db = firebase.firestore();

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
				const promises = [];
				const objects = [];
				sheet.eachRow((row, rowIndex) => {
					if (!objects[row.values[1]]) {
						objects[row.values[1]] = {}
					}
					let obj = objects[row.values[1]]
					//Skip header
					if (rowIndex > 1) {
						if (!obj[row.values[2]]) {
							obj[row.values[2]] = [];
						}
						obj[row.values[2]].push(row.values[3]);
					}
				});
				var batch = db.batch();
				Object.keys(objects).forEach((key) => {
					let newDoc = objects[key];
					var refnce = db.collection("places").doc(key);
					batch.set(refnce, newDoc);
				});
				batch.commit().then(() => {
					console.error("Success");
				}).catch((error) => {
					console.error("Error adding document: ", error);
				});
			});
		})
	}
}

function start() {

}

document.addEventListener("DOMContentLoaded", start());