const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const Student = require('./models/Student');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
        await Student.deleteMany({});
        console.log("Cleared existing data");

        const files = [
            { filename: 'SLOT-1.xlsx', slot: 'Slot 1' },
            { filename: 'SLOT-2.xlsx', slot: 'Slot 2' }
        ];

        const allStudents = [];
        const rollSet = new Set();
        const nameSet = new Set();

        files.forEach(({ filename, slot }) => {
            const filePath = path.join(__dirname, filename);
            if (!fs.existsSync(filePath)) {
                console.error(`${filename}: File not found.`);
                return;
            }

            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
            
            let headerFound = false;

            data.forEach(row => {
                if (!row || row.length < 2) return;

                const col0 = String(row[0] || '').toLowerCase();
                const col1 = String(row[1] || '').toLowerCase();
                
                if (col0.includes('roll number') || col1.includes('full name') || col1.includes('name')) {
                    headerFound = true;
                    return; 
                }

                if (headerFound) {
                    const rollNumberRaw = row[0] ? String(row[0]).trim() : '';
                    const contactRaw = row[2] ? String(row[2]).trim() : '';
                    const name = row[1] ? String(row[1]).trim() : '';
                    
                    // Prioritize contact as roll number if roll number is just a serial
                    let rollNumber = rollNumberRaw;
                    if (!rollNumber || rollNumberRaw.length < 3) {
                        rollNumber = contactRaw || `Unknown-${allStudents.length}`;
                    }

                    if (name) {
                        const nameLower = name.toLowerCase();
                        
                        // Avoid complete duplicates (same name and slot)
                        if (!nameSet.has(nameLower + '-' + slot)) {
                            nameSet.add(nameLower + '-' + slot);
                            allStudents.push({
                                name,
                                rollNumber,
                                slot
                            });
                        }
                    }
                }
            });
        });

        await Student.insertMany(allStudents);
        console.log(`Successfully inserted ${allStudents.length} students into the DB with real roll numbers!`);
        process.exit(0);

    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

seedDatabase();
