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

    const allMatched = searchWords.every(word => {
        // For each search word, find at least one token that:
        // 1. Starts with the same first letter as the search word
        // 2. Has a good fuzzy match for the rest of the word
        return tokens.some(token => {
            // Check if the first character matches exactly
            if (!token || !word || token[0] !== word[0]) {
                return false;
            }
            
            // For the rest of the characters, use fuzzy matching
            // We'll use a modified approach that's stricter than the original
            const isMatch = levenshtein(token.substring(1), word.substring(1)) <= 1;
            
            if (isMatch) {
                matched.push(token);
            }
            return isMatch;
        });
    });

    return allMatched ? matched : null;
}

self.onmessage = (e) => {
    const { csvText, filter } = e.data;

    // Match quoted phrases OR single words
    const regex = /"([^"]+)"|(\S+)/g;
    const searchWords = [];
    const exactPhrases = [];

    let match;
    while ((match = regex.exec(filter)) !== null) {
        if (match[1]) {
            // Quoted phrase (exact match mode)
            exactPhrases.push(match[1].toLowerCase());
        } else if (match[2]) {
            // Normal search term (fuzzy match mode)
            searchWords.push(match[2].toLowerCase());
        }
    }

    const rows = csvText.trim().split('\n');
    const filtered = [];

    for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(',');
        const searchable = [cols[0], cols[1], cols[2]].join(' ').toLowerCase();

        // Check quoted phrases (exact match, whole word)
        const exactMatchOK = exactPhrases.every(phrase =>
            new RegExp(`\\b${phrase}\\b`).test(searchable)
        );

        // Check fuzzy terms
        const matchedTokens = fuzzyMatchTokens(searchable, searchWords);

        if (exactMatchOK && (searchWords.length === 0 || matchedTokens)) {
            filtered.push({ row: cols, highlights: [...new Set(matchedTokens)] });
        }
    }

    console.log(filtered.length, 'rendered rows');
    postMessage(filtered);
};
