import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Dashboard() {
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    blood_group: '',
    emergency_contact: '',
    medical_history: '',
  });
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  
  // Smart Appointment State
  const [apptText, setApptText] = useState('');
  const [apptLoading, setApptLoading] = useState(false);
  const [appointmentResult, setAppointmentResult] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://127.0.0.1:8000/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeHistory = async () => {
    if (!profile.medical_history || aiLoading) return;
    
    setAiLoading(true);
    setAiSummary('');
    try {
      const res = await fetch('http://127.0.0.1:8000/analyze-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medical_history: profile.medical_history }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiSummary(data.summary);
      } else {
        alert(data.detail || 'Error generating AI summary');
      }
    } catch (err) {
      alert(`Unable to reach AI service: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleScheduleAppointment = async (e) => {
    e.preventDefault();
    if (!apptText || apptLoading) return;

    setApptLoading(true);
    setAppointmentResult(null);

    try {
      const res = await fetch('http://127.0.0.1:8000/schedule-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_text: apptText }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppointmentResult(data.appointment);
        setApptText('');
      } else {
        alert(data.detail || 'Failed to schedule appointment');
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    } finally {
      setApptLoading(false);
    }
  };

  const formatMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/\\n/g, '\n')
      .replace(/(##\s+[^\n]+)/g, '\n\n$1\n\n')
      .replace(/\n{3,}/g, '\n\n');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 font-medium">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          Loading clinical record...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Bar */}
        <header className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-teal-400 font-bold flex items-center justify-center text-xl">
              +
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                MediLink <span className="text-teal-600">AI</span>
              </h1>
              <p className="text-xs text-slate-500">Patient EHR & Clinical Portal</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg text-sm font-semibold transition border border-slate-200 cursor-pointer"
          >
            Sign Out
          </button>
        </header>

        {/* Patient Profile & AI Analysis Section */}
        <main className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Electronic Health Record (EHR)</h2>
              <p className="text-xs text-slate-500">Summary of verified medical background</p>
            </div>
            <button
              onClick={handleAnalyzeHistory}
              disabled={aiLoading}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg font-semibold text-sm transition flex items-center gap-2 shadow-sm cursor-pointer"
            >
              {aiLoading ? 'Analyzing Record...' : '✨ Generate Clinical Summary'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">Age</span>
              <span className="text-lg font-bold text-slate-800">{profile.age || 'N/A'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">Gender</span>
              <span className="text-lg font-bold text-slate-800">{profile.gender || 'N/A'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">Blood Group</span>
              <span className="text-lg font-bold text-teal-600">{profile.blood_group || 'N/A'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">Emergency Contact</span>
              <span className="text-lg font-bold text-slate-800">{profile.emergency_contact || 'N/A'}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block mb-1">Medical History Notes</span>
            <p className="text-sm text-slate-700 leading-relaxed">{profile.medical_history || 'No medical history recorded.'}</p>
          </div>

          {/* AI Clinical Summary Output */}
          {aiSummary && (
            <div className="p-6 rounded-xl bg-teal-50/60 border border-teal-200 text-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-teal-800 font-semibold border-b border-teal-200/80 pb-3">
                <span>🩺 AI Diagnostic Assessment</span>
              </div>
              <div className="text-sm leading-relaxed space-y-3">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-slate-900 mt-4 mb-2 border-b border-teal-200 pb-1" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-md font-bold text-slate-900 mt-4 mb-2 border-b border-teal-200 pb-1" {...props} />,
                    p: ({ node, ...props }) => <p className="text-slate-700 my-2 leading-relaxed" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc space-y-1 my-3 text-slate-700 pl-5" {...props} />,
                    li: ({ node, ...props }) => <li className="text-slate-700 pl-1" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                  }}
                >
                  {formatMarkdown(aiSummary)}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </main>

        {/* AI Smart Appointment Scheduler Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">📅 Smart Triage & Appointment Scheduling</h2>
            <p className="text-xs text-slate-500 mt-1">
              Describe your symptoms or preferred time. The system will triage your urgency and assign the appropriate specialist.
            </p>
          </div>

          <form onSubmit={handleScheduleAppointment} className="space-y-4">
            <div>
              <textarea
                rows="3"
                value={apptText}
                onChange={(e) => setApptText(e.target.value)}
                placeholder="e.g., I have been experiencing mild chest discomfort since yesterday and would like to see a cardiologist..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={apptLoading}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-lg transition text-sm cursor-pointer flex items-center gap-2 shadow-sm"
            >
              {apptLoading ? 'Triage in Progress...' : 'Submit Triage Request'}
            </button>
          </form>

          {/* Appointment Result Confirmation Box */}
          {appointmentResult && (
            <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-teal-400 font-semibold text-sm">✅ Appointment Scheduled</span>
                <span className="text-xs bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-full font-medium border border-teal-500/30">
                  {appointmentResult.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block mb-0.5">Assigned Specialist</span>
                  <span className="font-bold text-white text-sm">{appointmentResult.doctor_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Department</span>
                  <span className="font-bold text-teal-300 text-sm">{appointmentResult.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Scheduled Date & Time</span>
                  <span className="font-bold text-white text-sm">{appointmentResult.appointment_date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Urgency Level</span>
                  <span className="font-bold text-amber-400 text-sm">{appointmentResult.urgency}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}