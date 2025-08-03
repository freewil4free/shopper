// Function to load CSV data and populate the table
async function loadCSVData() {
    const loadingDiv = document.getElementById("loadingMessage");
    loadingDiv.style.display = 'block';

    const response = await fetch("refined_data.csv");
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
        const worker = new Worker("csvworker.js");

        worker.postMessage(csvText);

        worker.onmessage = function(e) {
            const rows = e.data;
            const tableBody = document.getElementById("tableBody");
            tableBody.innerHTML = '';

            rows.forEach(cols => {
                const tr = document.createElement("tr");
                const skipindex = [5,6,7]; // define the columns to skip appending (index starts at 0)

                cols.forEach((col, index) => {
                    const td = document.createElement("td");
                    
                    if (index === 2) {
                        const a = document.createElement("a");
                        a.href = cols[7]; // append the value in the URL column to the value in the product title column
                        a.textContent = cols[2]+" ($"+cols[5]+"/"+cols[6]+")";
                        a.target = "_blank";
                        td.appendChild(a);
                    } 
                    else if (skipindex.includes(index)) { // skip the columns specified in skipindex
                        return;
                    } 
                    else {
                        td.textContent = col.trim();
                    }
                    tr.appendChild(td);
                });

                tableBody.appendChild(tr);
            });

            loadingDiv.style.display = 'none';
            resolve();
        };

        worker.onerror = function(err) {
            console.error("Worker error:", err);
            loadingDiv.style.display = 'none';
            reject(err);
        };
    });
}
const skipIndexes = [1, 3]; // Skip 2nd and 4th columns