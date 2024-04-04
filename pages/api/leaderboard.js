const os = require('os');

const ROOT_PATH = os.environ['GITHUB_WORKSPACE'];

// Import data files using the root path obtained from the environment variable
const weekData = require(`${ROOT_PATH}/public/data/week_seller_totals.json`);
const monthData = require(`${ROOT_PATH}/public/data/month_seller_totals.json`);
const days90Data = require(`${ROOT_PATH}/public/data/90days_seller_totals.json`);
const lifetimeData = require(`${ROOT_PATH}/public/data/lifetime_seller_totals.json`);

export default function handler(req, res) {
    const { timeRange } = req.query;

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

    res.status(200).json(data);
}
