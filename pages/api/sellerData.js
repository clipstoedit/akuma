// pages/api/sellerData.js

// Import data files
import weekData from '../../public/data/week.json';
import monthData from '../../public/data/month.json';
import days90Data from '../../public/data/90days.json';
import lifetimeData from '../../public/data/lifetime.json';

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
