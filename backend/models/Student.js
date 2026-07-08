const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: {
        type: String, // Storing as 'YYYY-MM-DD'
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true
    }
}, { _id: false });

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    slot: {
        type: String,
        required: true,
        enum: ['Slot 1', 'Slot 2']
    },
    attendanceHistory: [attendanceSchema]
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
