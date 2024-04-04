import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link from Next.js
import styles from '../styles/styles.module.css'; // Import CSS styles

// Import JSON data directly
import weekData from '../public/data/week.json';
import monthData from '../public/data/month.json';
import days90Data from '../public/data/90days.json';
import lifetimeData from '../public/data/lifetime.json';

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [selectedSellerData, setSelectedSellerData] = useState(null);
    const [timeRangeOptions, setTimeRangeOptions] = useState([]); // Array to store time range options
    const [timeRange, setTimeRange] = useState('week'); // Default to week

    useEffect(() => {
        // Set time range options directly from imported JSON data
        setTimeRangeOptions([
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: '90days', label: '90 Days' },
            { value: 'lifetime', label: 'Lifetime' }
        ]);
    }, []);

    useEffect(() => {
        // Set leaderboard data based on selected time range
        switch (timeRange) {
            case 'week':
                setLeaderboardData(weekData);
                break;
            case 'month':
                setLeaderboardData(monthData);
                break;
            case '90days':
                setLeaderboardData(days90Data);
                break;
            case 'lifetime':
                setLeaderboardData(lifetimeData);
                break;
            default:
                setLeaderboardData(weekData); // Default to week data
                break;
        }
    }, [timeRange]);

    const handleClick = async (sellerName) => {
        // Logic to handle seller click
        // You can filter the data based on the selected seller from leaderboardData
        // Example:
        const sellerSales = leaderboardData.filter(seller => seller.name === sellerName);
        setSelectedSellerData(sellerSales);
    };

    const handleTimeRangeChange = (newTimeRange) => {
        setTimeRange(newTimeRange);
    };

    return (
        <div className={styles.Container}>
            <div className={styles.leaderboardContainer}>
                <div className={styles.leaderboardHeader}>
                    <h1 className={styles.leaderboardTitle}> Leaderboard </h1>
                    <div className={styles.timeRangeDropdown}>
                        <select value={timeRange} onChange={(e) => handleTimeRangeChange(e.target.value)}>
                            {timeRangeOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <table className={styles.leaderboardTable}>
                    <thead>
                        <tr>
                            <th>Seller</th>
                            <th>Total Price</th>
                            <th>Tax Collected</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((seller, index) => (
                            <Link key={index} href={`/seller/${seller.name}`}>
                                <tr className={styles.row} onClick={() => handleClick(seller.name)}>
                                    <td>{seller.name}</td>
                                    <td>{seller.totalPrice}g</td>
                                    <td>{seller.salesTax}g</td>
                                </tr>
                            </Link>
                        ))}
                    </tbody>
                </table>

                {selectedSellerData && (
                    <div>
                        <h2>{selectedSellerData[0].Seller}'s Sales</h2>
                        <ul>
                            {selectedSellerData.map((sale, index) => (
                                <li key={index}>
                                    {sale["Item Name"]} - {sale["Total Price"]}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
