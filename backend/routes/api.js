const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const exceljs = require('exceljs');

// Helper to calculate stats
const calculateStats = (student) => {
    const totalClasses = student.attendanceHistory.length;
    const presentClasses = student.attendanceHistory.filter(a => a.status === 'Present').length;
    const absentClasses = student.attendanceHistory.filter(a => a.status === 'Absent').length;
    const percentage = totalClasses === 0 ? 0 : ((presentClasses / totalClasses) * 100).toFixed(2);
    
    return {
        ...student.toObject(),
        stats: {
            totalClasses,
            presentClasses,
            absentClasses,
            percentage
        }
    };
};

// Get all students with stats, optionally filtered by slot
router.get('/students', async (req, res) => {
    try {
        const { slot } = req.query;
        const query = slot ? { slot } : {};
        const students = await Student.find(query).sort({ name: 1 });
        const studentsWithStats = students.map(calculateStats);
        res.json(studentsWithStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new student
router.post('/students', async (req, res) => {
    try {
        const { name, rollNumber, slot } = req.body;
        if (!slot) return res.status(400).json({ error: 'Slot is required' });
        
        const newStudent = new Student({ name, rollNumber, slot, attendanceHistory: [] });
        await newStudent.save();
        res.status(201).json(calculateStats(newStudent));
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Roll number / Contact already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Mark attendance
router.post('/attendance', async (req, res) => {
    try {
        const { studentId, date, status } = req.body; // status: 'Present' or 'Absent'

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: 'Student not found' });

        // Check if attendance for this date already exists
        const existingRecordIndex = student.attendanceHistory.findIndex(a => a.date === date);
        
        if (status === 'Clear') {
            if (existingRecordIndex >= 0) {
                student.attendanceHistory.splice(existingRecordIndex, 1);
            }
        } else if (existingRecordIndex >= 0) {
            // Update existing
            student.attendanceHistory[existingRecordIndex].status = status;
        } else {
            // Add new
            student.attendanceHistory.push({ date, status });
        }

        await student.save();
        res.json(calculateStats(student));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update student name
router.put('/students/:id', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Name cannot be empty' });
        }
        
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found' });

        student.name = name.trim();
        await student.save();
        
        res.json(calculateStats(student));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete student
router.delete('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export to Excel
router.get('/export', async (req, res) => {
    try {
        const { slot } = req.query;
        const query = slot ? { slot } : {};
        const students = await Student.find(query).sort({ name: 1 });
        const studentsWithStats = students.map(calculateStats);

        const workbook = new exceljs.Workbook();
        const worksheetName = slot ? `${slot} Attendance` : 'Attendance Data';
        const worksheet = workbook.addWorksheet(worksheetName);

        worksheet.columns = [
            { header: 'Slot', key: 'slot', width: 10 },
            { header: 'Contact / Roll Number', key: 'rollNumber', width: 25 },
            { header: 'Name', key: 'name', width: 25 },
            { header: 'Total Classes', key: 'totalClasses', width: 15 },
            { header: 'Classes Attended', key: 'presentClasses', width: 18 },
            { header: 'Classes Absent', key: 'absentClasses', width: 18 },
            { header: 'Attendance %', key: 'percentage', width: 15 },
        ];

        studentsWithStats.forEach(student => {
            worksheet.addRow({
                slot: student.slot,
                rollNumber: student.rollNumber,
                name: student.name,
                totalClasses: student.stats.totalClasses,
                presentClasses: student.stats.presentClasses,
                absentClasses: student.stats.absentClasses,
                percentage: `${student.stats.percentage}%`
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=attendance_report_${slot ? slot.replace(' ', '_') : 'all'}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
