// csvworker.js
function levenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => []);
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            matrix[i][j] = a[i - 1] === b[j - 1]
                ? matrix[i - 1][j - 1]
                : Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + 1);
        }
    }
    return matrix[a.length][b.length];
}

function fuzzyMatchTokens(str, searchWords) {
    const text = str.toLowerCase();
    const tokens = text.split(/\s+/);
    const matched = [];

    const allMatched = searchWords.every(word =>
        tokens.some(token => {
            const isMatch = token.includes(word) || levenshtein(token, word) <= 1;
            if (isMatch) matched.push(token);
            return isMatch;
        })
    );

    return allMatched ? matched : null;
}

self.onmessage = (e) => {
    const { csvText, filter } = e.data;
    const searchWords = filter.trim().toLowerCase().split(/\s+/).filter(Boolean);

    const rows = csvText.trim().split('\n');
    const filtered = [];

    for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(',');
        const searchable = [cols[0], cols[1], cols[2]].join(' ').toLowerCase();
        const matchedTokens = fuzzyMatchTokens(searchable, searchWords);
        if (matchedTokens) {
            filtered.push({ row: cols, highlights: [...new Set(matchedTokens)] });
        }
    }
    console.log(filtered.length, 'rendered rows');
    postMessage(filtered);
};