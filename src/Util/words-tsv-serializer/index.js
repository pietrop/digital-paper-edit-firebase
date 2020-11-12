/**
 * Helper functions to serialize and de-serialize array of words into a tsv string
  example words list
  ```
  [
    {
      "id": 0,
      "start": 1.4,
      "end": 3.9,
      "text": "Can"
    },
    {
      "id": 1,
      "start": 3.9,
      "end": 4,
      "text": "you"
    },
    {
      "id": 2,
      "start": 4,
      "end": 4.1,
      "text": "hear"
    },
    {
      "id": 3,
      "start": 4.1,
      "end": 4.2,
      "text": "it?"
    },
    ..
]
```
example converted tsv string
```
1.4\t	3.9\t	Can\n
3.9\t	4\t	you\n
4\t	4.1\t	hear\n
4.1\t	4.2\t	it?\n
```
 */
function serializeWordsToTsv(words) {
  return words
    .map(word => {
      return `${word.start}\t${word.end}\t${word.text}`;
    })
    .join('\n');
}

function deserializeTsvToWords(data) {
  return data.split('\n').map(w => {
    const warray = w.split('\t');
    return {
      start: warray[0],
      end: warray[1],
      text: warray[2],
    };
  });
}

export { serializeWordsToTsv, deserializeTsvToWords };
