import React from 'react';
import { CalendarCheck, Download, LogOut } from 'lucide-react';
import { exportToExcel } from '../api';

const Navbar = ({ onLogout, selectedSlot }) => {
    return (
        <nav style={{
            backgroundColor: 'var(--primary-blue)',
            color: 'var(--white)',
            padding: '16px 0',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '32px'
        }}>
            <div className="container responsive-flex">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CalendarCheck size={28} color="var(--secondary-accent)" />
                    <h1 style={{ color: 'var(--white)', margin: 0, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
                        Attendance Manager
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => exportToExcel(selectedSlot)}>
                        <Download size={18} /> Export {selectedSlot}
                    </button>
                    {onLogout && (
                        <button className="btn" style={{ backgroundColor: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }} onClick={onLogout}>
                            <LogOut size={18} /> Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
