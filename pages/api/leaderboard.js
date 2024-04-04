import weekData from '../../public/data/week_seller_totals.json';
import monthData from '../../public/data/month_seller_totals.json';
import days90Data from '../../public/data/90days_seller_totals.json';
import lifetimeData from '../../public/data/lifetime_seller_totals.json';

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
