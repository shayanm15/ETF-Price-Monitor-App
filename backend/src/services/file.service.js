const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

function loadPrices() {
    const pricesCSVPath = path.join(__dirname, "../../data/prices.csv");
    const pricesCSVString = fs.readFileSync(pricesCSVPath, "utf-8");

    const csvRows = parse(pricesCSVString, { columns: true });

    let prices = [];

    prices = csvRows.map((row, i) => {
        const pricesObj = { DATE: row.DATE };
        for (const [key, value] of Object.entries(row)) {
            if (key !== "DATE") {
                pricesObj[key] = parseFloat(value);
            }
        }
        return pricesObj;
    });

    return prices;
}

const prices = loadPrices();

class FileService {

    constructor() {
        this.prices = prices;
    }

    async uploadFile(fileString) {
        console.log("in file service");
        const fileRows = parse(fileString, { columns: true });
        let data = [];

        // Retrieve a unique set of the file's columns for error handling
        const allColumns = fileRows.flatMap(row => Object.keys(row));
        const uniqueColumns = [...new Set(allColumns)];

        if (fileRows.length === 0) {
            return { error: 'File is empty' };
        }

        if (!uniqueColumns.includes('name') || !uniqueColumns.includes('weight')) {
            return { error: 'Missing required columns: name, weight' };
        }

        data = fileRows.map((row, i) => {
            const weight = parseFloat(row.weight);

            // Throw error is weight is not a number or invalid numeric value
            if (isNaN(weight) || weight < 0) {
                throw new Error(`Invalid weight value at row ${i + 1}: "${row.weight}"`);
            }

            return { name: row.name, weight };
        });

        return data;
    }
}

module.exports = { FileService, loadPrices };