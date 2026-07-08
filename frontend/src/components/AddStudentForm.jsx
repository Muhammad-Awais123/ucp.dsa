import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { addStudent } from '../api';

const AddStudentForm = ({ onStudentAdded, defaultSlot }) => {
    const [name, setName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const newStudent = await addStudent({ name, rollNumber, slot: defaultSlot });
            onStudentAdded(newStudent);
            setName('');
            setRollNumber('');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ marginBottom: '32px' }}>
            <h2 style={{ marginBottom: '20px' }}>Add New Student</h2>
            {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} className="responsive-grid-form">
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        required 
                        placeholder="John Doe"
                    />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Roll Number</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={rollNumber} 
                        onChange={e => setRollNumber(e.target.value)} 
                        required 
                        placeholder="CS-101"
                    />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: '42px' }}>
                        <UserPlus size={18} /> {loading ? 'Adding...' : 'Add Student'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStudentForm;
