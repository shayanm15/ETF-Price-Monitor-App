const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

// Time Complexity: O(n)
// Space Complexity: O(n)
// loadPrices: Returns the parsed prices from reading the prices.csv

// Future Improvement: Use async fs.promises.readFile for non-blocking I/O
// Current sync approach is acceptable since we execute loadPrices() once at module load
// If prices were loaded per request with readFileSync, it would block the single-threaded
// event loop during disk I/O, preventing the server from handling other incoming requests
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

// Time Complexity: O(n)
// Space Complexity: O(n)
// getMostRecentConstituentData: Returns the most recent close price of the constituents
function getMostRecentConstituentData(etfData, prices) {
    const latestPrice = prices[prices.length - 1];
    let data = etfData.map((data) => {
        return { ...data, recentClosePrice: latestPrice[data.name], holdingSize: data.weight * latestPrice[data.name] }
    })
    return data;
}

// Time Complexity: O(n * m) where n = number of dates, m = number of constituents
// Space Complexity: O(n)
// getETFPriceTimeSeries: Returns the price of the ETF for each date by calculating the weighted sums for each individual price
function getETFPriceTimeSeries(etfData, prices) {
    let data = prices.map((price) => {
        let sum = 0;
        for (const { name, weight } of etfData) {
            sum += weight * price[name];
        }

        return { date: price.DATE, price: sum }
    })

    return data;
}

// Time Complexity: O(n log n)
// Space Complexity: O(n)
// getTopHoldings: Returns the top 5 biggest holdings in the ETF as of the latest market close

// Future Improvements: 
// For handling larger datasets, sorting with a min-heap would have a time complexity of O(n log k) where k = 5
// Maintain only a heap of size k instead of sorting the entire array
// Would need to build a min-heap first as not provided in JavaScript

function getTopHoldings(mostRecentConstituentData) {
    return [...mostRecentConstituentData]
        .sort((a, b) => b.holdingSize - a.holdingSize)
        .slice(0, 5);
}

const prices = loadPrices();

class FileService {

    constructor() {
        this.prices = prices;
    }

    async uploadFile(fileString) {
        const fileRows = parse(fileString, { columns: true });
        let data = [];

        // Retrieve a unique set of the file's columns for error handling
        const allColumns = fileRows.flatMap(row => Object.keys(row));
        const uniqueColumns = [...new Set(allColumns)];

        if (fileRows.length === 0) {
            throw new Error('File is empty');
        }

        if (!uniqueColumns.includes('name') || !uniqueColumns.includes('weight')) {
            throw new Error('Missing required columns: name, weight');
        }

        data = fileRows.map((row, i) => {
            const weight = parseFloat(row.weight);

            // Throw error if weight is not a number or invalid numeric value
            if (isNaN(weight) || weight < 0) {
                throw new Error(`Invalid weight value at row ${i + 1}: "${row.weight}"`);
            }

            return { name: row.name, weight };
        });


        // Throw error if not all the constituents from uploaded ETF csv are in prices csv
        const priceConstituents = Object.keys(this.prices[0]).filter((k) => k !== 'DATE');
        for (const row of data) {
            if (!(priceConstituents.includes(row.name))) {
                throw new Error(`Unknown constituent "${row.name}", no associated price found`)
            }
        }

        const mostRecentConstituentData = getMostRecentConstituentData(data, this.prices);
        const etfPriceTimeData = getETFPriceTimeSeries(data, this.prices);
        const topHoldings = getTopHoldings(mostRecentConstituentData);

        return {
            mostRecentConstituentData,
            etfPriceTimeData,
            topHoldings
        };
    }
}

module.exports = { FileService, loadPrices };