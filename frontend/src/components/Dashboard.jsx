import React from 'react';
import { Users, UserCheck, UserX, BarChart2 } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
            backgroundColor: `${color}20`, // 20% opacity
            color: color,
            padding: '16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {icon}
        </div>
        <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 500 }}>{title}</p>
            <h3 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--text-primary)' }}>{value}</h3>
        </div>
    </div>
);

const Dashboard = ({ students, selectedSlot }) => {
    // Calculate aggregate stats
    const totalStudents = students.length;
    
    let totalClassesAttended = 0;
    let totalClassesExpected = 0;

    students.forEach(s => {
        totalClassesExpected += s.stats.totalClasses;
        totalClassesAttended += s.stats.presentClasses;
    });

    const overallAttendance = totalClassesExpected === 0 ? 0 : ((totalClassesAttended / totalClassesExpected) * 100).toFixed(1);
    
    // Finding students with low attendance (< 75%) who have had at least one class
    const lowAttendanceCount = students.filter(s => parseFloat(s.stats.percentage) < 75 && s.stats.totalClasses > 0).length;
    // Finding students with high attendance (>= 75%) who have had at least one class
    const highAttendanceCount = students.filter(s => parseFloat(s.stats.percentage) >= 75 && s.stats.totalClasses > 0).length;

    return (
        <div style={{ marginBottom: '32px' }}>
            <h2 style={{ marginBottom: '24px' }}>System Overview - {selectedSlot}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                <StatCard 
                    title="Total Students" 
                    value={totalStudents} 
                    icon={<Users size={28} />} 
                    color="var(--primary-blue)" 
                />
                <StatCard 
                    title="Avg. Attendance" 
                    value={`${overallAttendance}%`} 
                    icon={<BarChart2 size={28} />} 
                    color="var(--secondary-accent)" 
                />
                <StatCard 
                    title="High Attendance (≥75%)" 
                    value={highAttendanceCount} 
                    icon={<UserCheck size={28} />} 
                    color="var(--success)" 
                />
                <StatCard 
                    title="Needs Attention (<75%)" 
                    value={lowAttendanceCount} 
                    icon={<UserX size={28} />} 
                    color="var(--danger)" 
                />
            </div>
        </div>
    );
};

export default Dashboard;
