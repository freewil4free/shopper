// Function to load CSV data and populate the table
async function loadCSVData() {
    return new Promise((resolve, reject) => {
        fetch('combined_data.csv') // replace with your actual CSV file path
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(csvText => {
                const rows = csvText.trim().split('\n');
                const tableBody = document.getElementById('tableBody');
                tableBody.innerHTML = ''; // Clear old data

                for (let i = 1; i < rows.length; i++) { // Assuming row 0 is header
                    const cols = rows[i].split(',');
                    const tr = document.createElement('tr');

                    cols.forEach(col => {
                        const td = document.createElement('td');
                        td.textContent = col.trim();
                        tr.appendChild(td);
                    });

                    tableBody.appendChild(tr);
                }
                console.log('CSV data loaded into table');
                resolve();
            })
            .catch(err => {
                console.error('Error loading CSV data:', err);
                reject(err);
            });
    });
}
