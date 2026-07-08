import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AddStudentForm from './components/AddStudentForm';
import StudentList from './components/StudentList';
import Login from './components/Login';
import Footer from './components/Footer';
import { getStudents } from './api';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState('Slot 1');

    useEffect(() => {
        if (localStorage.getItem('auth') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchStudents(selectedSlot);
        }
    }, [isAuthenticated, selectedSlot]);

    const fetchStudents = async (slot) => {
        setLoading(true);
        try {
            const data = await getStudents(slot);
            setStudents(data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStudentAdded = (newStudent) => {
        // Only add to state if it matches current slot
        if (newStudent.slot === selectedSlot) {
            setStudents(prev => [...prev, newStudent]);
        }
    };

    const handleAttendanceUpdate = (updatedStudent) => {
        setStudents(prev => prev.map(s => s._id === updatedStudent._id ? updatedStudent : s));
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('auth', 'true');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('auth');
    };

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: 'var(--bg-color)', 
            display: 'flex', 
            flexDirection: 'column' 
        }}>
            <Navbar onLogout={handleLogout} selectedSlot={selectedSlot} />

            <main className="container" style={{ flexGrow: 1, paddingBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <button
                        className={`btn ${selectedSlot === 'Slot 1' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setSelectedSlot('Slot 1')}
                    >
                        Slot 1
                    </button>
                    <button
                        className={`btn ${selectedSlot === 'Slot 2' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setSelectedSlot('Slot 2')}
                    >
                        Slot 2
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        Loading...
                    </div>
                ) : (
                    <>
                        <Dashboard students={students} selectedSlot={selectedSlot} />
                        <AddStudentForm onStudentAdded={handleStudentAdded} defaultSlot={selectedSlot} />
                        <StudentList students={students} onAttendanceUpdate={handleAttendanceUpdate} selectedSlot={selectedSlot} />
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default App;
