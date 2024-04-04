import os,

const ROOT_PATH = os.environ['GITHUB_WORKSPACE'];

// Import data files using the root path obtained from the environment variable
const weekData = require(`${ROOT_PATH}/public/data/week.json`);
const monthData = require(`${ROOT_PATH}/public/data/month.json`);
const days90Data = require(`${ROOT_PATH}/public/data/90days.json`);
const lifetimeData = require(`${ROOT_PATH}/public/data/lifetime.json`);

export default function handler(req, res) {
    const { seller, timeRange } = req.query;

    // Determine which JSON file to respond with based on the timeRange parameter
    let data;
    switch (timeRange) {
        case 'week':
            data = weekData;
            break;
        case 'month':
            data = monthData;
            break;
        case '90days':
            data = days90Data;
            break;
        case 'lifetime':
            data = lifetimeData;
            break;
        default:
            data = weekData; // Default to week data
            break;
    }

    // Filter the data based on the seller's name
    const sellerSales = data.filter(item => item.Seller === seller);

    // Return the filtered data as JSON response
    res.status(200).json(sellerSales);
}
