import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../styles/styles2.module.css'; // Import CSS styles
import weekData from '../../../public/data/akuma/week.json';
import monthData from '../../../public/data/akuma/month.json';
import days90Data from '../../../public/data/akuma/90days.json';
import lifetimeData from '../../../public/data/akuma/lifetime.json';
import weekData2 from '../../../public/data/akuma2/week.json';
import monthData2 from '../../../public/data/akuma2/month.json';
import days90Data2 from '../../../public/data/akuma2/90days.json';
import lifetimeData2 from '../../../public/data/akuma2/lifetime.json';

const SellerPage = () => {
    const router = useRouter();
    const { sellerName } = router.query;
    const [sellerData, setSellerData] = useState([]);
    const [sortBy, setSortBy] = useState('Transaction Time');
    const [sortOrder, setSortOrder] = useState('desc');
    const [timeRangeOptions, setTimeRangeOptions] = useState([]); // Array to store time range options
    const [timeRange, setTimeRange] = useState('week'); // Default to week

    // Extract the source query parameter from the URL
    const source = router.query.source || 'akuma';

    useEffect(() => {
        // Simulate fetching time range options
        setTimeRangeOptions([
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: '90days', label: '90 Days' },
            { value: 'lifetime', label: 'Lifetime' }
        ]);
    }, []);

    useEffect(() => {
        fetchData();
    }, [timeRange, source]);

    const fetchData = () => {
        let dataToDisplay;
        const selectedData = source === 'akuma2' ? [weekData2, monthData2, days90Data2, lifetimeData2] : [weekData, monthData, days90Data, lifetimeData];

        switch (timeRange) {
            case 'week':
                dataToDisplay = selectedData[0].filter(sale => sale.Seller === sellerName);
                break;
            case 'month':
                dataToDisplay = selectedData[1].filter(sale => sale.Seller === sellerName);
                break;
            case '90days':
                dataToDisplay = selectedData[2].filter(sale => sale.Seller === sellerName);
                break;
            case 'lifetime':
                dataToDisplay = selectedData[3].filter(sale => sale.Seller === sellerName);
                break;
            default:
                dataToDisplay = selectedData[0].filter(sale => sale.Seller === sellerName);
                break;
        }

        setSellerData(dataToDisplay);
    };


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
                            <th>Guild</th>
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
                                <td>{sale["Guild Name"]}</td>
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
