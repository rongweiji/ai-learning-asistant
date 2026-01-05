/**
 * Split text into chunks for better AI processing.
 * @param {string} text - The input text to be chunked.
 * @param {number} chunkSize - The maximum size of each chunk.
 * @param {number} overlap - The number of overlapping characters between chunks.
 * @returns {Array<{content:string,chunkIndex:number,pageNumber:number}>} - An array of text chunks.
*/

export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text || text.trim().length === 0) {
        return [];
    }

    // Clean the text: remove extra spaces, normalize new lines
    const cleanedText = text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').replace(/\n+/g, '\n').replace(/ \n/g, '\n').trim();

    // try to split by paragraphs (single or double newlines)
    const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);

    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;


    for (const paragrah of paragraphs) {
        const paragrahWords = paragrah.trim().split(/\s+/);
        const paragrahWordCount = paragrahWords.length;

        // if single paragraph is larger than chunk size, split it further
        if (paragrahWordCount > chunkSize) {
            if (currentChunk.length > 0) {
                chunks.push({
                    content: currentChunk.join('\n'),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
                currentChunk = [];
                currentWordCount = 0;
            }

            //splite large paragraph into word-based chunks
            for (let i = 0; i < paragrahWordCount; i += (chunkSize - overlap)) {
                const chunkWords = paragrahWords.slice(i, i + chunkSize);
                chunks.push({
                    content: chunkWords.join(' '),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });

                if (i + chunkSize >= paragrahWords.length) break;
            }
            continue;
        }

        // if adding this paragraph exceeds chunk size, finalize current chunk
        if (currentWordCount + paragrahWordCount > chunkSize && currentChunk.length > 0) {
            chunks.push
                ({
                    content: currentChunk.join('\n\n'),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });

            // create overlap from previous chunk
            const preChunkText = currentChunk.join(' ');
            const preChunkWords = preChunkText.split(/\s+/);
            const overlapWords = preChunkWords.slice(-Math.min(overlap, preChunkWords.length)).join(' ');

            currentChunk = [overlapWords, paragrah.trim()];
            currentWordCount = overlapWords.split(/\s+/).length + paragrahWordCount;
        } else {
            //add paragraph to current chunk
            currentChunk.push(paragrah.trim());
            currentWordCount += paragrahWordCount;
        }
    }

    // add last chunk
    if (currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkIndex: chunkIndex++,
            pageNumber: 0
        });
    }


    // fallback, if no chunk created, split by words 
    if (chunks.length === 0 && cleanedText.length > 0) {
        const words = cleanedText.split(/\s+/);
        for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
            const chunkWords = words.slice(i, i + chunkSize);
            chunks.push({
                content: chunkWords.join(' '),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });
            if (i + chunkSize >= words.length) break;
        }
    }

    return chunks;
};


/**
 * find relevant chunks from text chunks based on keyword matching
 * @param {Array<Object>} chunks - array of text chunks
 * @param {string} query - the search query
 * @param {number} maxChunks - maxchunks to return
 * @returns {Array<Object>} - relevant text chunks
 */
export const findRelevantChunks = (chunks, query, maxChunks = 5) => {
    if (!query || query.trim().length === 0) {
        return [];
    }

    // common stop words
    const stopWords = new Set([
        'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'it', 'of', 'for', 'with', 'as', 'by', 'that', 'this', 'these', 'those', 'be', 'are', 'was', 'were', 'from', 'or', 'but'
    ]);


    // extract and clean query keywords
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2 && !stopWords.has(word));

    if (queryWords.length === 0) {
        // return clean chunk objects without Mongoose metadata
        return chunks.slice(0, maxChunks).map(chunk => ({
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id
        }));
    }


    const scoredChunks = chunks.map((chunk, index) => {
        const content = chunk.content.toLowerCase();
        const contentWordsLength = content.split(/\s+/).length;
        let score = 0;

        // score each query word 
        for (const qword of queryWords) {
            //exact word match(higher score)
            const exactMatchesLength = (content.match(new RegExp(`\\b${qword}\\b`, 'g')) || []).length;
            score += exactMatchesLength * 3;

            //partial word match(lower score)
            const partialMatchesLength = (content.match(new RegExp(qword, 'g')) || []).length;
            score += Math.max(0, partialMatchesLength - exactMatchesLength) * 1.5;
        }

        // Bonus: Multiply query word found 
        const uniqueWordsFound = queryWords.filter(qword => content.includes(qword)).length;
        if (uniqueWordsFound > 1) {
            score += uniqueWordsFound * 2;
        }

        // Normalize score by content length
        const normalizedScore = score / Math.sqrt(contentWordsLength);

        // small bounus for earlier chunks 
        const positionBonus = 1 - (index / chunks.length) * 0.1;

        return {
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
            score: normalizedScore * positionBonus,
            rawScore: score,
            matchedWords: uniqueWordsFound
        };
    });


    return scoredChunks
        .filter(chunk => chunk.score > 0)
        .sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            if (b.matchedWords !== a.matchedWords) {
                return b.matchedWords - a.matchedWords;
            }
            return a.chunkIndex - b.chunkIndex;
        }).slice(0, maxChunks);
};

    