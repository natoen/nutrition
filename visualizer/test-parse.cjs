const fs = require('fs');
const Papa = require('papaparse');

const csvText = fs.readFileSync('public/nutrition.csv', 'utf8');
Papa.parse(csvText, {
  header: true,
  skipEmptyLines: true,
  complete: (results) => {
    const validData = results.data.filter(row => {
      const name = row['Food Item'];
      return name && name.trim() !== '' && name !== 'Food Item';
    });
    
    const idx = validData.findIndex(r => r['Food Item'].includes('Ikura'));
    for (let i = idx; i < idx + 6; i++) {
        console.log("Index", i, ":", validData[i]['Food Item']);
    }
  }
});
