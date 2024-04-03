import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../../../styles/styles.module.css'; // Import CSS styles
import '@fortawesome/fontawesome-free/css/all.css'; // Import FontAwesome CSS

const SellerPage = () => {
    const router = useRouter();
    const { sellerName } = router.query;
    const [sellerData, setSellerData] = useState([]);
    const [sortBy, setSortBy] = useState('Transaction Time');
    const [sortOrder, setSortOrder] = useState('desc');
    const [timeRangeOptions, setTimeRangeOptions] = useState([]); // Array to store time range options
    const [timeRange, setTimeRange] = useState('week'); // Default to week

    const handleGoBack = () => {
        router.back(); // This will navigate back to the previous page
    };

    const getColorForQuality = (quality) => {
        switch (quality) {
            case 'Normal':
                return styles.normalQuality; // Define CSS class for Normal quality
            case 'Fine':
                return styles.fineQuality; // Define CSS class for Fine quality
            case 'Superior':
                return styles.superiorQuality; // Define CSS class for Superior quality
            case 'Epic':
                return styles.epicQuality; // Define CSS class for Epic quality
            case 'Legendary':
                return styles.legendaryQuality; // Define CSS class for Legendary quality
            default:
                return ''; // Default class
        }
    };

    const handleTimeRangeChange = (newTimeRange) => {
        setTimeRange(newTimeRange);
    };

    useEffect(() => {
        // Fetch available time range options from server
        const fetchTimeRangeOptions = async () => {
            try {
                const response = await axios.get('/api/timeRangeOptions');
                setTimeRangeOptions(response.data); // Set time range options state
            } catch (error) {
                console.error('Error fetching time range options:', error);
            }
        };
        fetchTimeRangeOptions(); // Fetch time range options when component mounts
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/sellerData?seller=${sellerName}&timeRange=${timeRange}`);
                setSellerData(response.data);
            } catch (error) {
                console.error(`Error fetching data for ${sellerName}:`, error);
            }
        };
        if (sellerName) {
            fetchData();
        }
    }, [sellerName, timeRange]);

    const handleSort = (column) => {
        // Toggle sorting order if sorting the same column
        const newSortOrder = sortBy === column ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
        setSortBy(column);
        setSortOrder(newSortOrder);
    };

    // Sort the data based on the selected column and sorting order
    const sortedData = sellerData.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (sortBy === 'Item Price' || sortBy === 'Total Price') {
            // Remove 'g' and commas, then parse as float for price sorting
            const parsedValA = parseFloat(valA.replace(/[^\d.]/g, ''));
            const parsedValB = parseFloat(valB.replace(/[^\d.]/g, ''));
            return sortOrder === 'asc' ? parsedValA - parsedValB : parsedValB - parsedValA;
        } else {
            return sortOrder === 'asc' ? (valA < valB ? -1 : valA > valB ? 1 : 0) : valA > valB ? -1 : valA < valB ? 1 : 0;
        }
    });

    return (
        <div className={styles.Container}>
            <div className={styles.leaderboardContainer}>
                <div className={styles.sellerHeader}>
                    <div className={styles.leftSection}>
                        <a className={styles.goBackButton} onClick={handleGoBack}>
                            <i className="fas fa-arrow-left"></i>
                        </a>
                        <h1 className={styles.sellerTitle}>{sellerName}'s Sales</h1>
                    </div>
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
                            <th onClick={() => handleSort('Buyer')}>
                                Buyer
                                {sortBy === 'Buyer' && (
                                    <span className={styles.sortTriangle}>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th>Item</th>
                            <th onClick={() => handleSort('Item Name')}>
                                Item Name
                                {sortBy === 'Item Name' && (
                                    <span className={styles.sortTriangle}>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Transaction Time')}>
                                Transaction Time
                                {sortBy === 'Transaction Time' && (
                                    <span className={styles.sortTriangle}>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th>Type</th>
                            <th onClick={() => handleSort('Item Price')}>
                                Item Price
                                {sortBy === 'Item Price' && (
                                    <span className={styles.sortTriangle}>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Item Quantity')}>
                                Quantity
                                {sortBy === 'Item Quantity' && (
                                    <span className={styles.sortTriangle}>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Total Price')}>
                                Total Price
                                {sortBy === 'Total Price' && (
                                    <span className={styles.sortTriangle}>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Sales Tax')}>
                                Tax Collected
                                {sortBy === 'Sales Tax' && (
                                    <span className={styles.sortTriangle}>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((sale, index) => (
                            <tr key={index}>
                                <td>{sale["Seller"]}</td>
                                <td>{sale["Buyer"]}</td>
                                <td>
                                    <img
                                        src={`/items/${sale["Item Number"]}.png`}
                                        alt={sale["Item Number"]}
                                        className={styles.itemImage}
                                    />
                                </td>
                                <td className={getColorForQuality(sale["Quality"])}>{sale["Item Name"]}</td>
                                <td>{sale["Transaction Time"]}</td>
                                <td>{sale["Type"]}</td>
                                <td>{sale["Item Price"]}</td>
                                <td>{sale["Item Quantity"]}</td>
                                <td>{sale["Total Price"]}</td>
                                <td>{sale["Sales Tax"]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerPage;
