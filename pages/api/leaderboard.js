import weekData from '../../public/data/akuma/week_seller_totals.json';
import monthData from '../../public/data/akuma/month_seller_totals.json';
import days90Data from '../../public/data/akuma/90days_seller_totals.json';
import lifetimeData from '../../public/data/akuma/lifetime_seller_totals.json';

import weekData2 from '../../public/data/akuma2/week_seller_totals.json';
import monthData2 from '../../public/data/akuma2/month_seller_totals.json';
import days90Data2 from '../../public/data/akuma2/90days_seller_totals.json';
import lifetimeData2 from '../../public/data/akuma2/lifetime_seller_totals.json';

export default function handler(req, res) {
    const { timeRange } = req.query;
    const { useApi } = req.query; // Add query parameter to determine which API to use

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

    res.status(200).json(data);
}
