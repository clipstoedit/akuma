// Import data files
import weekData from '../../public/data/akuma/week.json';
import monthData from '../../public/data/akuma/month.json';
import days90Data from '../../public/data/akuma/90days.json';
import lifetimeData from '../../public/data/akuma/lifetime.json';

import weekData2 from '../../public/data/akuma2/week.json';
import monthData2 from '../../public/data/akuma2/month.json';
import days90Data2 from '../../public/data/akuma2/90days.json';
import lifetimeData2 from '../../public/data/akuma2/lifetime.json';

export default function handler(req, res) {
    const { seller, timeRange, useApi } = req.query; // Add useApi query parameter

    let data;

    if (useApi === '2') {
        // Use akuma2 data directory
        switch (timeRange) {
            case 'week':
                data = weekData2;
                break;
            case 'month':
                data = monthData2;
                break;
            case '90days':
                data = days90Data2;
                break;
            case 'lifetime':
                data = lifetimeData2;
                break;
            default:
                data = weekData2; // Default to week data
                break;
        }
    } else {
        // Use akuma data directory
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
    }

    // Filter the data based on the seller's name
    const sellerSales = data.filter(item => item.Seller === seller);

    // Return the filtered data as JSON response
    res.status(200).json(sellerSales);
}
