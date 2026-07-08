const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const extractNames = () => {
    const files = ['SLOT-1.xlsx', 'SLOT-2.xlsx'];
    const allNames = [];
    const duplicates = [];
    const nameSet = new Set();
    const errors = [];

    files.forEach(filename => {
        const filePath = path.join(__dirname, filename);
        try {
            if (!fs.existsSync(filePath)) {
                errors.push(`${filename}: File not found.`);
                return;
            }

            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0]; // Automatically detect first sheet
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);

            data.forEach(row => {
                // Find column containing name
                const keys = Object.keys(row);
                const nameKey = keys.find(k => k.trim().toLowerCase().includes('name') || k.trim().toLowerCase().includes('student'));

                if (nameKey && row[nameKey]) {
                    const name = row[nameKey].toString().trim();
                    if (name) {
                        const nameLower = name.toLowerCase();
                        // Check for duplicates
                        if (nameSet.has(nameLower)) {
                            duplicates.push(name);
                        } else {
                            nameSet.add(nameLower);
                            allNames.push(name);
                        }
                    }
                }
            });
        } catch (err) {
            errors.push(`${filename}: Could not be read. Error: ${err.message}`);
        }
    });

    // Keep sorted
    allNames.sort();

    console.log(JSON.stringify({
        totalFound: allNames.length,
        students: allNames,
        duplicates: duplicates,
        errors: errors
    }));
};

extractNames();
