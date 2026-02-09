const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

// Time Complexity: O(n)
// Space Complexity: O(n)
// loadPrices: Returns an object containing the parsed prices with their dates from reading the prices.csv file

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

            // If the key is not DATE, then it's a constituent and we convert its associated price value to a floating-point number
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
// getMostRecentConstituentData: Returns an array of objects, where each object stores the most recent close price and holding size of the constituents
function getMostRecentConstituentData(etfData, prices) {

    // Assuming the prices in prices.csv are sorted chronologically, the latest price is the last row
    const latestPrice = prices[prices.length - 1];

    let data = etfData.map((data) => {
        return {
            ...data,
            recentClosePrice: latestPrice[data.name],
            holdingSize: data.weight * latestPrice[data.name]
        }
    })
    return data;
}

// Time Complexity: O(n * m) where n = number of dates, m = number of constituents
// Space Complexity: O(n)
// getETFPriceTimeSeries: Returns an array of objects, where each object stores date and the price of the ETF for the date by calculating the weighted sums for each individual price
function getETFPriceTimeSeries(etfData, prices) {
    let data = prices.map((price) => {
        let sum = 0;
        for (const { name, weight } of etfData) {
            sum += weight * price[name];
        }

        return {
            date: price.DATE,
            price: sum
        }
    })

    return data;
}

// Time Complexity: O(n log n)
// Space Complexity: O(n)
// getTopHoldings: Returns an array of objects for the top 5 biggest holdings in the ETF as of the latest market close

// Future Improvement: Use a min-heap for O(n log k) time complexity where k = 5
// Maintain only a heap of size k instead of sorting the entire array
// Would need to build a min-heap first as it is not provided natively in JavaScript

function getTopHoldings(mostRecentConstituentData) {
    return [...mostRecentConstituentData]
        .sort((a, b) => b.holdingSize - a.holdingSize)
        .slice(0, 5);
}

// Time Complexity: O(n)
// Space Complexity: O(n)
// findDuplicateConstituents: Returns an array of duplicate constituent names found in the uploaded ETF CSV
function findDuplicateConstituents(constituents) {
    const seenConstituents = new Set();
    const duplicateConstituents = new Set();

    for (const name of constituents) {

        // If name is already in the seen constituents set, it means we have found a duplicate constituent name
        if (seenConstituents.has(name)) {
            duplicateConstituents.add(name);
        } else {
            seenConstituents.add(name);
        }
    }

    return [...duplicateConstituents];
}

const prices = loadPrices();

class FileService {

    constructor() {
        this.prices = prices;
    }

    async uploadFile(fileString) {
        const fileRows = parse(fileString, { columns: true });
        let data = [];
        const errors = [];

        // Extract unique column names from the CSV for validation
        const allColumns = fileRows.flatMap(row => Object.keys(row));
        const uniqueColumns = [...new Set(allColumns)];

        // Throw error if file has no content
        if (fileRows.length === 0) {
            throw new Error('File is empty');
        }

        // Throw error if required columns 'name' and 'weight' are missing (case-sensitive)
        if (!uniqueColumns.includes('name') || !uniqueColumns.includes('weight')) {
            throw new Error('Missing required columns: name, weight');
        }

        data = fileRows.map((row, i) => {
            const weight = parseFloat(row.weight);

            // Collect error if weight is not a valid non-negative number
            if (isNaN(weight) || weight < 0) {
                errors.push(`Invalid weight value at row ${i + 1}: "${row.weight}"`);
            }

            return { name: row.name, weight };
        });

        const constituentNames = data.map((row) => row.name);
        const duplicateConstituents = findDuplicateConstituents(constituentNames);

        if (duplicateConstituents.length > 0) {
            errors.push(`Duplicate constituents found: ${duplicateConstituents.join(', ')}`);
        }

        // Collect error for any constituent not found in prices.csv
        const priceConstituents = Object.keys(this.prices[0]).filter((k) => k !== 'DATE');
        for (const row of data) {
            if (!(priceConstituents.includes(row.name))) {
                errors.push(`Unknown constituent "${row.name}", no associated price found`);
            }
        }

        // If any data errors were collected, throw error with them all as a single joined message
        if (errors.length > 0) {
            throw new Error(errors.join('; '));
        }

        const mostRecentConstituentData = getMostRecentConstituentData(data, this.prices);
        const etfPriceTimeData = getETFPriceTimeSeries(data, this.prices);
        const topHoldings = getTopHoldings(mostRecentConstituentData);

        const constituentData = mostRecentConstituentData.map(({ holdingSize, ...data }) => data);

        return {
            constituentData,
            etfPriceTimeData,
            topHoldings
        };
    }
}

module.exports = { FileService, loadPrices };