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

                    // Create table cells for each column
                    cols.forEach((col, index) => {
                        const td = document.createElement('td');
                        if (index === 2) { // URL column
                            const a = document.createElement('a');
                            a.href = cols[6];
                            a.textContent = cols[2];
                            a.target = '_blank';
                            td.appendChild(a);
                        
                        } else {                       
                            td.textContent = col.trim();
                        }
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