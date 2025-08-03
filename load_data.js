// Function to load CSV data and populate the table
async function loadCSVData(searchvalue = "") {
    const loadingDiv = document.getElementById("loadingMessage");
    loadingDiv.style.display = 'block';

    const response = await fetch("refined_data.csv");
    const csvText = await response.text();
    const filter = searchvalue.trim();

    return new Promise((resolve, reject) => {
        const worker = new Worker("csvworker.js");

        worker.postMessage({ csvText, filter });

        worker.onmessage = function (e) {
            const rows = e.data;
            const tableBody = document.getElementById("tableBody");
            tableBody.innerHTML = '';

        rows.forEach(({ row: cols, highlights }) => {
            const tr = document.createElement("tr");
            const skipindex = [5, 6, 7];

            cols.forEach((col, index) => {
                if (skipindex.includes(index)) return;

                const td = document.createElement("td");
                let content = col.trim();

                if (index === 2) {
                    const a = document.createElement("a");
                    a.href = cols[7];
                    a.target = "_blank";
                    content = `${cols[2]} ($${cols[5]}/${cols[6]})`;
                    a.innerHTML = highlightTerms(content, highlights);
                    td.appendChild(a);
                } else {
                    td.innerHTML = highlightTerms(content, highlights);
                }

                tr.appendChild(td);
            });

            tableBody.appendChild(tr);
        });

            loadingDiv.style.display = 'none';
            resolve();
        };

        worker.onerror = function (err) {
            console.error("Worker error:", err);
            loadingDiv.style.display = 'none';
            reject(err);
        };
    });
}

function highlightTerms(text, tokens) {
    let escaped = text;
    tokens.forEach(token => {
        const pattern = new RegExp(`(${escapeRegExp(token)})`, 'gi');
        escaped = escaped.replace(pattern, '<b>$1</b>');
    });
    return escaped;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}