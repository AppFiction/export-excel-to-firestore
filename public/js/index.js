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
				sheet.eachRow((row, rowIndex) => {
					//Skip header
					if (rowIndex > 1) {
						let p = db.collection("places2").doc(row.values[1]).set({
							[row.values[2]]: firebase.firestore.FieldValue.arrayUnion(row.values[3])
						}).then((docRef) => {
							console.log("Success");
						}).catch((error) => {
							console.error("Error adding document: ", error);
						});
						promises.push(p);
					}
				});
				console.log("Starting upload")
				Promise.all(promises).then((docRef) => {
					console.log("Upload completed");
				}).catch((error) => {
					console.error("Error adding document: ", error);
				});
			})
		})
	}
}

function start() {

}

document.addEventListener("DOMContentLoaded", start());