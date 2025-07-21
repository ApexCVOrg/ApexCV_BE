const fs = require('fs');
const path = require('path');

try {
  const dataPath = path.resolve(__dirname, 'src/data/document.json');
  console.log('Reading file:', dataPath);

  const rawData = fs.readFileSync(dataPath, 'utf8');
  console.log('File length:', rawData.length);
  console.log('First 20 chars:', JSON.stringify(rawData.substring(0, 20)));

  const docs = JSON.parse(rawData);
      // JSON parsed
  console.log('Number of documents:', docs.length);

  // Test first document
  if (docs.length > 0) {
    console.log('First document:', docs[0]);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
}
