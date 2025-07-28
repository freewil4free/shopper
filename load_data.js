// Function to load CSV data and populate the table
function loadCSVData() {
    fetch('combined_data.csv')
        .then(response => response.text())
        .then(data => {
            const tableBody = document.querySelector('#productTable tbody');
            tableBody.innerHTML = ''; // Clear existing rows
            
            const rows = data.split('\n').slice(1); // Skip header row
            rows.forEach(row => {
                if (row.trim() === '') return;
                
                // Improved CSV parsing that handles quoted fields with commas
                const columns = [];
                let current = '';
                let inQuotes = false;
                
                for (let i = 0; i < row.length; i++) {
                    const char = row[i];
                    if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === ',' && !inQuotes) {
                        columns.push(current);
                        current = '';
                    } else {
                        current += char;
                    }
                }
                columns.push(current); // Add last column
                const tr = document.createElement('tr');
                
                // Create table cells for each column
                columns.forEach((col, index) => {
                    const td = document.createElement('td');
                    if (index === 6) { // URL column
                        const a = document.createElement('a');
                        a.href = col.trim();
                        a.textContent = 'View';
                        a.target = '_blank';
                        td.appendChild(a);
                    } else {
                        td.textContent = col;
                    }
                    tr.appendChild(td);
                });
                
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error loading CSV:', error));
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', loadCSVData);
