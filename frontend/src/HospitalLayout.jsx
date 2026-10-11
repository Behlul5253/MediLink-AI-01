import React from 'react';

export default function HospitalLayout({ children, activeTab, userRole = "Doctor" }) {
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v20M2 12h20" strokeLinecap="round"/>
          </svg>
          MediLink <span>AI</span>
        </div>
        
        <nav style={{ flex: 1 }}>
          <a href="/dashboard" className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            Dashboard
          </a>
          <a href="/appointments" className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}>
            Appointments
          </a>
          <a href="/patients" className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`}>
            Patient Records
          </a>
          <a href="/ai-consultant" className={`nav-item ${activeTab === 'ai' ? 'active' : ''}`}>
            AI Assistant
          </a>
        </nav>

        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', color: '#94A3B8' }}>
          Logged in as: <br />
          <strong style={{ color: '#FFF' }}>Dr. Smith ({userRole})</strong>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}