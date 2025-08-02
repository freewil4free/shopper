// csvworker.js
self.onmessage = (e) => {
  const csvText = e.data;
  const rows = csvText.trim().split('\n');
  const parsed = rows.slice(1).map(row => row.split(','));
  postMessage(parsed);
};