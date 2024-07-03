const time = 1 * 60 * 1000;

// Array of CSV URLs with corresponding storage keys
const csvLinks = [
    { url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRBaSONOR96SzuOx5gzkBSQbl4jcFVcr7QCJa7mz7BTvMe90Rkr78eAU4eE5-NibBftx5iVdBU-Dr8H/pub?output=csv', key: 'MainData' },
    { url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRBaSONOR96SzuOx5gzkBSQbl4jcFVcr7QCJa7mz7BTvMe90Rkr78eAU4eE5-NibBftx5iVdBU-Dr8H/pub?output=csv&gid=2029186070', key: 'Bazar' },

];

// Function to fetch CSV data
function fetchCSVData(csvUrl) {
    return new Promise(function(resolve, reject) {
        Papa.parse(csvUrl, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                resolve(results.data);
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

// Function to convert JSON data to CSV format
function convertJSONToCSV(data) {
    const csv = Papa.unparse(data);
    return csv;
}

// Function to update local storage with fetched data in CSV format
async function updateLocalStorage(csvUrl, storageKey) {
    try {
        var newData = await fetchCSVData(csvUrl);
        var storedData = localStorage.getItem(storageKey);

        // Convert new data to CSV format
        const newCSVData = convertJSONToCSV(newData);

        // Check if fetched data differs from local storage data
        if (newCSVData !== storedData) {
            localStorage.setItem(storageKey, newCSVData);
            console.log('Local storage data updated successfully for', storageKey);
        } else {
            console.log('Local storage data is up to date for', storageKey);
        }
    } catch (error) {
        console.error('Error fetching or updating data for', storageKey, ':', error);
    }
}

// Function to update local storage and set interval for each CSV link
function updateAndSetInterval() {
    csvLinks.forEach(({ url, key }) => {
        updateLocalStorage(url, key);
        setInterval(() => updateLocalStorage(url, key), time); // 1 minute in milliseconds
    });
}

// Fetch data and update local storage initially
updateAndSetInterval();
