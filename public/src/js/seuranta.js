import { fetchData } from './fetch';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

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
}

const addDatasetWithLabel = (data, label, dataArray, color) => {
	const dataset = {
		label: label,
		data: dataArray,
		borderWidth: 1,
		borderColor: color,
	};
	data.datasets.push(dataset);
	return data;
}

const drawChart = async () => {

	// TODO: filter data for last x days
	// TODO: add datasets according to checkboxes.
	// TODO: check that data syncs with dates in x axis
	// TODO: match colors with checkbox text color
	// TODO: y axis min and max for each dataset, line type, etc.

	const formatter = new Intl.DateTimeFormat('fi-FI', { day: '2-digit', month: '2-digit' });

	const response = await getKubiosData();
	// const response = await getMockData();
	const entryData = await getEntryData();
	const formattedEntryDates = entryData.map((rivi) => formatter.format(new Date(rivi.date)));
    console.log('Formatted Entry Dates:', formattedEntryDates);
	// You need to formulate data into correct structure in the BE
	// OR you can extract the data here in FE from one or multiple sources
	// Extract data: https://www.w3schools.com/jsref/jsref_map.asp

	const labels = response.results.map((rivi) => formatter.format(new Date(rivi.daily_result)));

	// chart datasets
	const data = {
		labels: labels,
		datasets: [
		],
	  };

	// HRV
	const hrv = response.results.map((rivi) => rivi.result.rmssd_ms);
	addDatasetWithLabel(data, 'HRV', hrv, 'red');
	console.log('HRV:', data);

	// Sleep quality
	const sleepQuality = entryData.map((rivi) => rivi.sleep_quality);
	addDatasetWithLabel(data, 'Unen laatu', sleepQuality, 'blue');
	console.log('Unen laatu:', data);

	const ctx = document.getElementById('seuranta-chart');

	new Chart(ctx, {
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
					beginAtZero: true,
					title: {
						display: true,
						text: 'Arvo',
					},
				},
			},
		},
	});
};

/* getUserData().then(() => {
    console.log('Käyttäjän tiedot Kubioksesta ladattu ja kaavio piirretty');
}).catch((error) => {
    console.error('Virhe käyttäjätietojen lataamisessa:', error);
} ); */

drawChart().then(() => {
    document.getElementById('seuranta-chart').classList.add('loaded');
    console.log('Käyttäjän tiedot Kubioksesta ladattu ja kaavio piirretty');
}
).catch((error) => {
    console.error('Virhe käyttäjätietojen lataamisessa:', error);
} );
