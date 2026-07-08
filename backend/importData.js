const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const Student = require('./models/Student');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

const importCSV = (filePath, slotName) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                // The keys might have spaces, let's normalize them
                const keys = Object.keys(data);
                const nameKey = keys.find(k => k.trim().toLowerCase() === 'full name');
                const mobileKey = keys.find(k => k.trim().toLowerCase().includes('mobile number'));

                if (nameKey && mobileKey) {
                    const name = data[nameKey]?.trim();
                    const mobile = data[mobileKey]?.trim();
                    if (name && mobile) {
                        results.push({
                            name: name,
                            rollNumber: mobile, // Using mobile as unique identifier
                            slot: slotName,
                            attendanceHistory: []
                        });
                    }
                }
            })
            .on('end', async () => {
                let count = 0;
                for (const student of results) {
                    try {
                        const newStudent = new Student(student);
                        await newStudent.save();
                        count++;
                    } catch (err) {
                        if (err.code !== 11000) {
                            console.error(`Error saving ${student.name}:`, err.message);
                        }
                    }
                }
                console.log(`Successfully imported ${count} students for ${slotName}`);
                resolve();
            })
            .on('error', reject);
    });
};

const runImport = async () => {
    try {
        console.log('Clearing existing data...');
        // Drop the collection to remove the old unique index and existing data
        await Student.collection.drop().catch(err => {
            if (err.code !== 26) { // 26 is namespace not found (collection doesn't exist yet)
                console.error('Error dropping collection:', err);
            }
        });
        
        console.log('Importing SLOT 1...');
        await importCSV('./SLOT 1.csv', 'Slot 1');
        
        console.log('Importing SLOT 2...');
        await importCSV('./SLOT 2.csv', 'Slot 2');
        
        console.log('Import complete.');
    } catch (err) {
        console.error('Import failed:', err);
    } finally {
        mongoose.disconnect();
    }
};

runImport();
