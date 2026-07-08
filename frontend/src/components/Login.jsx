import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'UCP@DSA' && password === 'DSA2026') {
            onLogin();
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: 'var(--bg-color)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px 30px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ 
                        display: 'inline-flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        backgroundColor: 'rgba(10, 25, 47, 0.1)', 
                        padding: '16px', 
                        borderRadius: '50%',
                        marginBottom: '16px'
                    }}>
                        <Lock size={32} color="var(--primary-blue)" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Admin Login</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Please enter your credentials to continue</p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'var(--danger)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: 'var(--border-radius)',
                        marginBottom: '20px',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="form-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                <User size={18} />
                            </div>
                            <input 
                                type="text" 
                                className="form-control" 
                                style={{ paddingLeft: '40px' }}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                <Lock size={18} />
                            </div>
                            <input 
                                type="password" 
                                className="form-control" 
                                style={{ paddingLeft: '40px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
