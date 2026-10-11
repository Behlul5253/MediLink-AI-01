import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_users: 0, total_appointments: 0, total_profiles: 0, system_status: 'Loading...' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Hospital Record States for system-wide examination
  const [appointments, setAppointments] = useState([]);
  const [staffList] = useState([
    { id: 'STF-101', name: 'Dr. Ananya Verma', role: 'Neurology Specialist', dept: 'Neurology', status: 'On Duty' },
    { id: 'STF-102', name: 'Dr. Rajesh Kumar', role: 'Cardiologist', dept: 'Cardiology', status: 'On Duty' },
    { id: 'STF-103', name: 'Dr. Priya Nair', role: 'General Physician', dept: 'General Consultation', status: 'In Consultation' },
    { id: 'STF-104', name: 'Anil Kapoor', role: 'Head Nurse', dept: 'ICU', status: 'On Duty' },
  ]);
  const [maintenanceLogs] = useState([
    { id: 'MNT-301', asset: 'MRI Scanner Unit B', issue: 'Calibration & Helium Pressure Low', priority: 'High', status: 'In Progress' },
    { id: 'MNT-302', asset: 'ICU Ventilator #4', issue: 'Battery Backup Replacement Required', priority: 'Critical', status: 'Pending' },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    // Load local hospital appointments for examination
    const loadedAppts = JSON.parse(localStorage.getItem('hospital_appointments') || '[]');
    setAppointments(loadedAppts);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/admin/stats');
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      } else {
        setError('Failed to load system statistics.');
      }
    } catch (err) {
      setError('Cannot connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-blue-400">MediLink AI Admin Command Center</h1>
          <p className="text-xs text-slate-400">System-wide monitoring and hospital operations</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded transition cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-950/50 border border-red-500/50 text-red-200 text-xs p-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-xs text-slate-400 text-center py-6">Loading system statistics...</p>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
                <p className="text-xs text-slate-400 uppercase font-medium">Total Users</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">{stats.total_users}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
                <p className="text-xs text-slate-400 uppercase font-medium">Appointments Booked</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">{appointments.length || stats.total_appointments}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
                <p className="text-xs text-slate-400 uppercase font-medium">Patient Profiles</p>
                <p className="text-3xl font-bold text-indigo-400 mt-2">{stats.total_profiles}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
                <p className="text-xs text-slate-400 uppercase font-medium">System Status</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <p className="text-lg font-semibold text-emerald-400">{stats.system_status}</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
              >
                📊 Patient Appointments Queue
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'staff' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
              >
                👥 Staff & Doctors Directory
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'maintenance' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
              >
                🛠️ Facility Maintenance
              </button>
            </div>

            {/* Tab 1: Appointments / Patient Records */}
            {activeTab === 'overview' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-sm font-bold text-slate-200 mb-4">Patient Appointments & Reports Master Queue</h2>
                {appointments.length === 0 ? (
                  <p className="text-xs text-slate-400">No active patient appointments recorded yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="pb-3">Patient Name</th>
                          <th className="pb-3">Assigned Doctor</th>
                          <th className="pb-3">Department</th>
                          <th className="pb-3">Date & Time</th>
                          <th className="pb-3">Attached Report</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {appointments.map((appt) => (
                          <tr key={appt.id} className="hover:bg-slate-800/50">
                            <td className="py-3 font-medium text-slate-200">{appt.name} ({appt.age || '25'}Y)</td>
                            <td className="py-3 text-slate-300">{appt.doctor}</td>
                            <td className="py-3 text-slate-300">{appt.dept}</td>
                            <td className="py-3 text-slate-300">{appt.date} at {appt.time}</td>
                            <td className="py-3 text-emerald-400 font-medium">
                              {appt.reportFile ? `📄 ${typeof appt.reportFile === 'string' ? appt.reportFile : appt.reportFile.name}` : 'None'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Staff & Doctors Directory */}
            {activeTab === 'staff' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-sm font-bold text-slate-200 mb-4">Hospital Staff & Specialists Directory</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3">ID</th>
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Role / Specialty</th>
                        <th className="pb-3">Department</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {staffList.map((stf) => (
                        <tr key={stf.id} className="hover:bg-slate-800/50">
                          <td className="py-3 font-mono text-slate-400">{stf.id}</td>
                          <td className="py-3 font-medium text-slate-200">{stf.name}</td>
                          <td className="py-3 text-slate-300">{stf.role}</td>
                          <td className="py-3 text-slate-300">{stf.dept}</td>
                          <td className="py-3 text-emerald-400 font-medium">{stf.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Maintenance */}
            {activeTab === 'maintenance' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-sm font-bold text-slate-200 mb-4">Facility & Equipment Maintenance Logs</h2>
                <div className="space-y-3">
                  {maintenanceLogs.map((log) => (
                    <div key={log.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-200 text-xs">{log.asset}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-950 text-red-400 border border-red-800">{log.priority}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{log.issue}</p>
                      </div>
                      <span className="text-xs font-semibold text-amber-400 bg-amber-950/40 px-3 py-1 rounded border border-amber-800/50">
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}