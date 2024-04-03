import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const timeRanges = [
        'week_seller_totals.json',
        'month_seller_totals.json',
        '90days_seller_totals.json',
        'lifetime_seller_totals.json'
    ];

    const timeRangeOptions = timeRanges.map((fileName) => {
        const value = fileName.replace('_seller_totals.json', ''); // Extract value from filename
        return { value, label: value.charAt(0).toUpperCase() + value.slice(1) }; // Capitalize first letter for label
    });

    res.status(200).json(timeRangeOptions);
}
