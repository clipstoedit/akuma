import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/styles.module.css';

import weekData from '../public/data/akuma/week_seller_totals.json';
import monthData from '../public/data/akuma/month_seller_totals.json';
import days90Data from '../public/data/akuma/90days_seller_totals.json';
import lifetimeData from '../public/data/akuma/lifetime_seller_totals.json';

import weekData2 from '../public/data/akuma2/week_seller_totals.json';
import monthData2 from '../public/data/akuma2/month_seller_totals.json';
import days90Data2 from '../public/data/akuma2/90days_seller_totals.json';
import lifetimeData2 from '../public/data/akuma2/lifetime_seller_totals.json';

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [selectedSellerData, setSelectedSellerData] = useState(null);
    const [timeRangeOptions, setTimeRangeOptions] = useState([]);
    const [timeRange, setTimeRange] = useState('week');
    const [useAkuma2, setUseAkuma2] = useState(false);

    useEffect(() => {
        const fetchTimeRangeOptions = async () => {
            try {
                // Simulate fetching time range options
                setTimeRangeOptions([
                    { value: 'week', label: 'Week' },
                    { value: 'month', label: 'Month' },
                    { value: '90days', label: '90 Days' },
                    { value: 'lifetime', label: 'Lifetime' }
                ]);
            } catch (error) {
                console.error('Error fetching time range options:', error);
            }
        };
        fetchTimeRangeOptions();
    }, []);

    useEffect(() => {
        fetchData();
    }, [timeRange, useAkuma2]);

    const fetchData = () => {
        let data;
        if (useAkuma2) {
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
                    data = weekData2;
                    break;
            }
        } else {
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
                    data = weekData;
                    break;
            }
        }
        setLeaderboardData(data);
    };

    const handleTimeRangeChange = (newTimeRange) => {
        setTimeRange(newTimeRange);
    };

    const handleToggleDataSource = () => {
        setUseAkuma2(!useAkuma2);
    };

    const handleClick = (sellerName) => {
        // Simulate fetching selected seller data
        const selectedData = leaderboardData.find(seller => seller.name === sellerName);
        setSelectedSellerData(selectedData ? selectedData.sales : null);
    };

    return (
        <div className={styles.Container}>
            <div className={styles.leaderboardContainer}>
                <div className={styles.leaderboardHeader}>
                    <div className={styles.buttonGroup}>
                        <div className={styles.buttonContainer} onClick={handleToggleDataSource}>
                            <span className={styles.clickableText}>
                                {useAkuma2 ? 'Akuma 2 Data' : 'Akuma 1 Data'}
                            </span>
                        </div>
                    </div>
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
                            <Link legacyBehavior key={index} href={`/seller/${seller.name}`}>
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
        </div >
    );
};

export default Leaderboard;
