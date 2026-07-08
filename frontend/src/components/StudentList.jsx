import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { markAttendance, updateStudent, deleteStudent } from '../api';

const StudentList = ({ students, onAttendanceUpdate, onStudentDeleted }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loadingId, setLoadingId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

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

    const handleEdit = (student) => {
        setEditingId(student._id);
        setEditName(student.name);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditName('');
    };

    const handleSave = async (studentId) => {
        if (!editName.trim()) {
            alert('Name cannot be empty');
            return;
        }
        setLoadingId(studentId);
        try {
            const updatedStudent = await updateStudent(studentId, editName);
            onAttendanceUpdate(updatedStudent); // Reusing this prop to update the student in the list
            setEditingId(null);
            setEditName('');
        } catch (error) {
            console.error('Error updating name:', error);
            alert('Failed to update student name.');
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (studentId) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        
        setLoadingId(studentId);
        try {
            await deleteStudent(studentId);
            onStudentDeleted(studentId);
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Failed to delete student.');
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
                            <th>Actions</th>
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
                                        <td>
                                            {editingId === student._id ? (
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    autoFocus
                                                    style={{ padding: '6px', fontSize: '0.9rem', minWidth: '150px' }}
                                                />
                                            ) : (
                                                student.name
                                            )}
                                        </td>
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
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {editingId === student._id ? (
                                                    <>
                                                        <button 
                                                            className="btn btn-outline"
                                                            style={{ padding: '6px', color: 'var(--success)', opacity: loadingId === student._id ? 0.5 : 1 }}
                                                            onClick={() => handleSave(student._id)}
                                                            disabled={loadingId === student._id}
                                                            title="Save"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button 
                                                            className="btn btn-outline"
                                                            style={{ padding: '6px', color: 'var(--danger)' }}
                                                            onClick={handleCancel}
                                                            disabled={loadingId === student._id}
                                                            title="Cancel"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button 
                                                            className="btn btn-outline"
                                                            style={{ padding: '6px', color: 'var(--secondary-accent)', opacity: loadingId === student._id ? 0.5 : 1 }}
                                                            onClick={() => handleEdit(student)}
                                                            disabled={loadingId === student._id}
                                                            title="Edit Name"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button 
                                                            className="btn btn-outline"
                                                            style={{ padding: '6px', color: 'var(--danger)', opacity: loadingId === student._id ? 0.5 : 1 }}
                                                            onClick={() => handleDelete(student._id)}
                                                            disabled={loadingId === student._id}
                                                            title="Delete Student"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
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
