import React, { useState } from 'react';
import { markAttendance } from '../api';

const StudentList = ({ students, onAttendanceUpdate }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loadingId, setLoadingId] = useState(null);

    const handleMark = async (studentId, status) => {
        setLoadingId(studentId);
        try {
            const updatedStudent = await markAttendance(studentId, selectedDate, status);
            onAttendanceUpdate(updatedStudent);
        } catch (error) {
            console.error('Error marking attendance:', error);
            alert('Failed to mark attendance.');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="card" style={{ marginBottom: '32px' }}>
            <div className="responsive-flex" style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Student Roster</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Date:</label>
                    <input 
                        type="date" 
                        className="form-control" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ width: 'auto' }}
                    />
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sr. No</th>
                            <th>Name</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Attendance %</th>
                            <th>Quick Mark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>No students found. Add one above.</td>
                            </tr>
                        ) : (
                            students.map((student, index) => {
                                const todayRecord = student.attendanceHistory.find(a => a.date === selectedDate);
                                const isPresent = todayRecord?.status === 'Present';
                                const isAbsent = todayRecord?.status === 'Absent';
                                
                                return (
                                    <tr key={student._id}>
                                        <td style={{ fontWeight: 600 }}>{index + 1}</td>
                                        <td>{student.name}</td>
                                        <td>{student.stats.presentClasses}</td>
                                        <td>{student.stats.absentClasses}</td>
                                        <td>
                                            <span className={`badge ${parseFloat(student.stats.percentage) >= 75 ? 'badge-present' : 'badge-absent'}`}>
                                                {student.stats.percentage}%
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button 
                                                    className={`btn ${isPresent ? 'btn-success' : 'btn-outline'}`}
                                                    style={{ padding: '6px 12px', opacity: loadingId === student._id ? 0.5 : 1 }}
                                                    onClick={() => handleMark(student._id, 'Present')}
                                                    disabled={loadingId === student._id}
                                                >
                                                    P
                                                </button>
                                                <button 
                                                    className={`btn ${isAbsent ? 'btn-danger' : 'btn-outline'}`}
                                                    style={{ padding: '6px 12px', opacity: loadingId === student._id ? 0.5 : 1 }}
                                                    onClick={() => handleMark(student._id, 'Absent')}
                                                    disabled={loadingId === student._id}
                                                >
                                                    A
                                                </button>
                                                {(isPresent || isAbsent) && (
                                                    <button 
                                                        className="btn btn-outline"
                                                        style={{ padding: '6px 12px', opacity: loadingId === student._id ? 0.5 : 1, color: 'var(--text-secondary)' }}
                                                        onClick={() => handleMark(student._id, 'Clear')}
                                                        disabled={loadingId === student._id}
                                                        title="Clear attendance record"
                                                    >
                                                        Clear
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentList;
