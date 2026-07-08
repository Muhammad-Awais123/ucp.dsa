import React from 'react';
import { Code, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--primary-blue)',
            color: 'var(--white)',
            padding: '36px 0',
            marginTop: 'auto',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Subtle background glow effect */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '300px',
                height: '100%',
                background: 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.15), transparent 70%)',
                pointerEvents: 'none'
            }} />

            <div className="container" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.95)'
                }}>
                    <span>Designed & Developed with</span>
                    {/* <Heart size={18} color="#ef4444" style={{ fill: '#ef4444', filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))' }} /> */}
                    <span>by</span>
                    <a
                        href="https://awaisweb.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: 'var(--secondary-accent)',
                            textDecoration: 'none',
                            fontWeight: '700',
                            borderBottom: '2px solid transparent',
                            transition: 'all 0.3s ease',
                            padding: '2px 0'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.borderBottom = '2px solid var(--secondary-accent)';
                            e.target.style.filter = 'brightness(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.borderBottom = '2px solid transparent';
                            e.target.style.filter = 'brightness(1)';
                        }}
                    >
                        MUhammmad Awais
                    </a>
                </div>

                <div style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    letterSpacing: '0.5px'
                }}>
                    <Code size={14} />
                    <span>Attendance Management System © {new Date().getFullYear()}</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
