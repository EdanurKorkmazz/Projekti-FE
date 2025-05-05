import { fetchData } from './fetch';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const formatter = new Intl.DateTimeFormat('fi-FI', { day: '2-digit', month: '2-digit' });

// Function to get data from the Kubios API
const getKubiosData = async () => {
    const kubiosApiUrl = 'http://localhost:3000/api/kubios-data/user-data';
    console.log('Käyttäjän DATA Kubioksesta');
    const url = kubiosApiUrl;
    const token = sessionStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const options = {
        headers: headers,
    };
    const userData = await fetchData(url, options);
    console.log('User data:', userData);

    if (userData.error) {
        console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
        return;
    }

    return userData;
};

// Function to get entry data from the database
const getEntryData = async () => {
    const entriesApiUrl = 'http://localhost:3000/api/entries';
    console.log('Käyttäjän DATA Entries-tietokannasta');
    const url = entriesApiUrl;
    const token = sessionStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const options = {
        headers: headers,
    };
    const entryData = await fetchData(url, options);
    console.log('Entry data:', entryData);

    if (entryData.error) {
        console.log('Käyttäjän tietojen haku omauniDB-tietokannasta epäonnistui');
        return;
    }

    return entryData;
};

// Function to add a dataset to the chart
const addDatasetWithLabel = (data, label, dataArray, color) => {
    const labelsToDescriptions = {
        'HRV': 'HRV (ms)',
        'sleep_quality': 'Unen laatu (1-10)',
        'total_sleep': 'Nukuttu aika (h)',
        'daytime_alertness': 'Päivänaikainen vireys (1-10)',
    }
        
    const dataset = {
        label: labelsToDescriptions[label],
        data: dataForXDays(dayCount, dataArray, label),
        borderWidth: 3, // Thicker lines
        borderColor: color.replace('rgb', 'rgba').replace(')', ', 0.7)'), // Add transparency
        spanGaps: true, // Connect the dots across null values
        yAxisID: label == 'HRV' ? 'y' : 'y1',
    };
    data.datasets.push(dataset);
    return data;
}

const testi = 107; // For testing purposes, rolls back the dates by x days

// Generate an array of dates for the given number of days
const emptyDates = (days) => {
    const dates = []
    const today = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - testi - i);
        dates.push(formatter.format(date));
    }

    return dates.reverse();
}

// Generate data for the given number of days
const dataForXDays = (days, data, label) => {
    const dates = emptyDates(days);
    console.log('Dates:', dates);
    console.log('Data:', data);
    console.log('Label:', label);

    // Map dates to objects with x and y values
    const dataForXDays = dates.map((date) => {
        // Find all entries for the current date
        const entriesForDate = (label == 'HRV' ? data.results : data).filter((row) => formatter.format(new Date(label == 'HRV' ? row.daily_result : row.date)) === date);
        // Calculate the average value for the date
        let averageValue =
            entriesForDate.length > 0
                ? entriesForDate.reduce((sum, entry) => sum + (label == 'HRV' ? entry.result.rmssd_ms : entry[label]), 0) / entriesForDate.length
                : null;
        
        if (label == 'total_sleep' && averageValue) {
            averageValue = averageValue / 60;
        }

        return {
            x: date,
            y: averageValue,
        };
    });
    return dataForXDays;
}

// Fetch data from sources
const kubiosData = await getKubiosData();
const entryData = await getEntryData();
let dayCount = 7; // Default number of days
let chart = null; // Chart instance
let dataToDraw = []; // Array to store datasets to be drawn

// Initialize datasets based on checked checkboxes
const initializeInfoFromCheckedCheckboxes = () => {
    document.querySelectorAll('.data-checkbox input[type="checkbox"]').forEach((checkbox) => {
        if (checkbox.checked) {
            // Get the label and color for the dataset
            const dataLabel = checkbox.getAttribute('data-id');
            const label = checkbox.nextElementSibling.textContent.trim();
            const color = window.getComputedStyle(checkbox.nextElementSibling).color;
            const yAxisID = dataLabel === 'HRV' ? 'y' : 'y1'; // Determine the Y-axis ID

            dataToDraw.push(
                {
                    label: dataLabel,
                    color: color,
                    yAxisID: yAxisID,
                }
            );
        }
    });
};

// Update chart data based on current datasets
const updateChartData = (data) => {
    dataToDraw.map((dataset) => {
        addDatasetWithLabel(data, dataset.label, dataset.label === 'HRV' ? kubiosData : entryData, dataset.color, dataset.yAxisID);
    });
};

// Draw or update the chart
const drawChart = async () => {
    // Chart data object
    const labels = emptyDates(dayCount);
    const data = {
        labels: labels,
        datasets: [],
    };

    if (chart) {
        // Update existing chart
        updateChartData(data);
        chart.data = data;
        changeYAxis();
        chart.update();
    } else {
        // Initialize and draw a new chart
        initializeInfoFromCheckedCheckboxes();
        updateChartData(data);

        const ctx = document.getElementById('seuranta-chart');

        chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                locale: 'fi-FI',
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Päivämäärä',
                        },
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'HRV',
                        },
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Arvo (1-10)',
                        },
                        grid: {
                            drawOnChartArea: false, // Prevent grid lines from overlapping
                        },
                        min: 1,
                        max: 10,
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                },
            },
            spanGaps: true, // Connect the dots across null values
        });
    }
};

// Update Y-axis visibility and labels
const changeYAxis = () => {
    const yAxis = chart.options.scales.y1;

    if (chart.data.datasets.some((dataset) => dataset.yAxisID === 'y1')) {
        yAxis.display = true;

        const sleepTimeDataset = chart.data.datasets.find((dataset) => dataset.label === 'Nukuttu aika (h)');
        if (sleepTimeDataset) {
            yAxis.title.text = 'Arvo';
            yAxis.max = undefined;
        } else {
            yAxis.title.text = 'Arvo (1-10)';
            yAxis.max = 10;
        }
    } else {
        yAxis.display = false;
    }

    const yAxisHRV = chart.options.scales.y;
    if (chart.data.datasets.some((dataset) => dataset.yAxisID === 'y')) {
        yAxisHRV.display = true;
    } else {
        yAxisHRV.display = false;
    }
};

// Draw the chart on page load
drawChart().then(() => {
    document.getElementById('seuranta-chart').classList.add('loaded');
    console.log('Käyttäjän tiedot Kubioksesta ladattu ja kaavio piirretty');
}).catch((error) => {
    console.error('Virhe käyttäjätietojen lataamisessa:', error);
});

// Handle time range button clicks
document.querySelectorAll('.time-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
        // Get the number of days from the data-id attribute
        const days = parseInt(event.target.getAttribute('data-id'), 10);

        // Log or use the number of days
        console.log(`Selected time range: ${days} days`);

        // Update the active button
        document.querySelectorAll('.time-btn').forEach((btn) => btn.classList.remove('active'));
        event.target.classList.add('active');

        // Update the chart with the selected number of days
        dayCount = days;
        drawChart();
    });
});

// Handle checkbox changes
const handleCheckboxChange = (event) => {
    const checkbox = event.target;
    const dataLabel = checkbox.getAttribute('data-id'); // Get the label from the checkbox
    const label = event.target.nextElementSibling;
    const color = window.getComputedStyle(label).color;
    const yAxisID = dataLabel === 'HRV' ? 'y' : 'y1'; // Determine the Y-axis ID

    if (checkbox.checked) {
        // Add the dataset if the checkbox is checked
        dataToDraw.push(
            {
                label: dataLabel,
                color: color,
                yAxisID: yAxisID,
            }
        );
    } else {
        // Remove the dataset if the checkbox is unchecked
        dataToDraw = dataToDraw.filter((dataset) => dataset.label !== dataLabel);
    }

    drawChart(); // Redraw the chart with the updated datasets
};

// Attach event listeners to all checkboxes
document.querySelectorAll('.data-checkbox input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
});