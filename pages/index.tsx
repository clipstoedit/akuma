import React, { useState, useEffect } from 'react';
import weekData from '../public/data/week_seller_totals.json'; // Adjust the path accordingly
import Link from 'next/link'; // Import Link from Next.js
import styles from '../styles/styles.module.css'; // Import CSS styles

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [selectedSellerData, setSelectedSellerData] = useState(null);
    const [timeRangeOptions, setTimeRangeOptions] = useState([]); // Array to store time range options
    const [timeRange, setTimeRange] = useState('week'); // Default to week

    useEffect(() => {
        // Fetch available time range options from the imported JSON data
        setTimeRangeOptions(weekData);
    }, []);

    useEffect(() => {
        // Fetch leaderboard data from the imported JSON data based on the selected time range
        setLeaderboardData(weekData); // Assuming weekData contains the leaderboard data
    }, [timeRange]);

     const handleClick = async (sellerName) => {
        // Handle click to get seller data from the imported JSON data
        const selectedSeller = sellerData.filter((seller) => seller.name === sellerName);
        setSelectedSellerData(selectedSeller);
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
        </div>
    );
};

export default Leaderboard;
