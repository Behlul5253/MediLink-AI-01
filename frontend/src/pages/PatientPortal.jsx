import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PatientPortal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Today's Date String for Date Input Validation (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  // Editable Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [patientProfile, setPatientProfile] = useState({
    id: 'PAT-176763',
    name: 'Rahul Sharma',
    email: 'rahul@gmail.com',
    phone: '1234567890',
    age: '25',
    gender: 'Male',
    bloodGroup: 'AB-',
    department: 'Neurology',
    allergies: 'Penicillin, Dust',
  });

  // Doctor Directory State & Filter
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [doctorsList] = useState([
    {
      id: 1,
      name: 'Dr. Ananya Verma',
      dept: 'Neurology',
      degree: 'MD, DM (Neurology)',
      experience: '12 Years Exp.',
      bio: 'Specialist in migraines, neuro-vascular disorders, and cognitive healthcare.',
      hours: '10:00 AM - 02:00 PM',
      status: 'Available Today',
      avatarColor: '#0D9488',
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      dept: 'Cardiology',
      degree: 'MBBS, MD, FACC',
      experience: '16 Years Exp.',
      bio: 'Expert in preventive cardiology, blood pressure management, and ECG diagnostics.',
      hours: '11:00 AM - 04:00 PM',
      status: 'Available Today',
      avatarColor: '#2563EB',
    },
    {
      id: 3,
      name: 'Dr. Priya Nair',
      dept: 'General Consultation',
      degree: 'MBBS, MD (Internal Medicine)',
      experience: '9 Years Exp.',
      bio: 'Focuses on primary care, viral infections, lifestyle disorders, and routine checkups.',
      hours: '09:00 AM - 01:00 PM',
      status: 'In Consultation',
      avatarColor: '#059669',
    },
    {
      id: 4,
      name: 'Dr. Vikramaditya Seth',
      dept: 'Orthopedics',
      degree: 'MS (Orthopedics), MCh',
      experience: '14 Years Exp.',
      bio: 'Specialized in joint replacement, sports injury rehabilitation, and bone health.',
      hours: '02:00 PM - 06:00 PM',
      status: 'Available Today',
      avatarColor: '#D97706',
    },
    {
      id: 5,
      name: 'Dr. Meera Iyer',
      dept: 'Pediatrics',
      degree: 'MD (Pediatrics), DCH',
      experience: '10 Years Exp.',
      bio: 'Dedicated child care physician focusing on growth tracking, immunizations, and pediatric wellness.',
      hours: '10:30 AM - 03:30 PM',
      status: 'In Consultation',
      avatarColor: '#7C3AED',
    },
  ]);

  // AI Feature State inside Patient Profile
  const [labReportFile, setLabReportFile] = useState(null);
  const [labAnalysis, setLabAnalysis] = useState(null);
  const [isAnalyzingReport, setIsAnalyzingReport] = useState(false);

  const [symptomLog, setSymptomLog] = useState('');
  const [loggedSymptoms, setLoggedSymptoms] = useState([
    { date: 'Oct 08, 2026', text: 'Mild headache after screen time', severity: 'Low' },
  ]);

  const [allergyCheckInput, setAllergyCheckInput] = useState('');
  const [allergyWarning, setAllergyWarning] = useState('');

  const [clinicalDigest, setClinicalDigest] = useState('');
  const [isGeneratingDigest, setIsGeneratingDigest] = useState(false);

  // Medical History Timeline State
  const [medicalTimeline] = useState([
    { date: 'Oct 2026', title: 'Routine Neurological Checkup', dept: 'Neurology', doctor: 'Dr. Ananya Verma' },
    { date: 'Aug 2026', title: 'Complete Blood Count (CBC) & Metabolic Panel', dept: 'Diagnostics', doctor: 'Dr. Priya Nair' },
    { date: 'Feb 2026', title: 'General Physical & ECG', dept: 'Cardiology', doctor: 'Dr. Rajesh Kumar' },
  ]);

  // Appointment State
  const [appointments, setAppointments] = useState([]);
  const [bookingData, setBookingData] = useState({
    dept: 'Neurology',
    doctor: 'Dr. Ananya Verma (Neurology Specialist)',
    date: '',
    time: '10:00 AM',
    type: 'In-Person',
    reportFile: null,
  });
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  // Conversational AI Health Chatbot State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your MediLink AI Health Assistant. You can ask health questions or simply say: "Book an appointment with Dr. Ananya Verma on 2026-10-25 at 10:00 AM" and I will handle it for you!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // REDIRECT DOCTORS TO DOCTOR DASHBOARD AUTOMATICALLY
  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    if (userRole === 'doctor') {
      navigate('/doctor-dashboard');
      return;
    }

    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPatientProfile((prev) => ({ ...prev, ...parsed }));
      } catch (e) {}
    }
  }, [navigate]);

  const handleProfileChange = (e) => {
    setPatientProfile({ ...patientProfile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    localStorage.setItem('user', JSON.stringify(patientProfile));
  };

  const handleQuickBookDoctor = (doc) => {
    setBookingData({
      ...bookingData,
      dept: doc.dept,
      doctor: `${doc.name} (${doc.dept} Specialist)`,
    });
    setActiveTab('appointments');
  };

  const handleAnalyzeLabReport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLabReportFile(file.name);
    setIsAnalyzingReport(true);
    setLabAnalysis(null);

    setTimeout(() => {
      setLabAnalysis({
        summary: 'Blood parameters are generally stable. Slight elevation noted in fasting glucose levels.',
        metrics: [
          { name: 'Hemoglobin', value: '14.2 g/dL', status: 'Normal' },
          { name: 'Fasting Glucose', value: '112 mg/dL', status: 'Slightly High' },
          { name: 'Total Cholesterol', value: '185 mg/dL', status: 'Normal' },
        ],
        recommendation: 'Maintain hydration and reduce refined sugar intake. Consider consulting General Medicine if glucose remains elevated.',
      });
      setIsAnalyzingReport(false);
    }, 1200);
  };

  const handleAddSymptomLog = (e) => {
    e.preventDefault();
    if (!symptomLog.trim()) return;

    const newEntry = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      text: symptomLog,
      severity: symptomLog.toLowerCase().includes('severe') || symptomLog.toLowerCase().includes('pain') ? 'Moderate' : 'Low',
    };

    setLoggedSymptoms([newEntry, ...loggedSymptoms]);
    setSymptomLog('');
  };

  const handleCheckAllergySafety = (e) => {
    e.preventDefault();
    if (!allergyCheckInput.trim()) return;

    const inputLower = allergyCheckInput.toLowerCase();
    const knownAllergies = patientProfile.allergies.toLowerCase();

    if (knownAllergies.includes('penicillin') && (inputLower.includes('penicillin') || inputLower.includes('amoxicillin'))) {
      setAllergyWarning('🚨 CONTRAINDICATION DETECTED: You have a recorded Penicillin allergy! Avoid this medication.');
    } else if (knownAllergies.includes('dust') && inputLower.includes('dust')) {
      setAllergyWarning('⚠️ ALLERGY RISK: Recorded sensitivity to dust particles. Use protective mask.');
    } else {
      setAllergyWarning('✅ No direct adverse allergy triggers found for your recorded profile.');
    }
  };

  const handleGenerateClinicalDigest = () => {
    setIsGeneratingDigest(true);
    setTimeout(() => {
      setClinicalDigest(
        `PATIENT BRIEF (${patientProfile.name}, ${patientProfile.age}Y, ${patientProfile.gender})\n` +
          `• Primary Dept: ${patientProfile.department}\n` +
          `• Blood Group: ${patientProfile.bloodGroup} | Allergies: ${patientProfile.allergies}\n` +
          `• Recent Logs: ${loggedSymptoms[0]?.text || 'No recent symptoms logged.'}\n` +
          `• Recommendation: Ready for physician review.`
      );
      setIsGeneratingDigest(false);
    }, 1000);
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    setBookingSuccess('');
    setBookingError('');

    if (!bookingData.date) {
      setBookingError('Please select an appointment date.');
      return;
    }

    if (bookingData.date < todayStr) {
      setBookingError('Cannot book an appointment for a past date. Please select today or a future date.');
      return;
    }

    const newAppt = {
      id: Date.now(),
      name: patientProfile.name,
      age: patientProfile.age,
      gender: patientProfile.gender,
      bloodGroup: patientProfile.bloodGroup,
      doctor: bookingData.doctor,
      dept: bookingData.dept,
      date: bookingData.date,
      time: bookingData.time,
      appointment_type: bookingData.type,
      reportFile: bookingData.reportFile || null,
      status: 'Confirmed',
    };

    const updatedAppts = [newAppt, ...appointments];
    setAppointments(updatedAppts);

    // Sync automatically with doctor dashboard queue via localStorage
    localStorage.setItem('hospital_appointments', JSON.stringify(updatedAppts));

    setBookingSuccess(`Appointment booked with ${bookingData.doctor} on ${bookingData.date} at ${bookingData.time}!`);
    setBookingData({
      dept: 'Neurology',
      doctor: 'Dr. Ananya Verma (Neurology Specialist)',
      date: '',
      time: '10:00 AM',
      reportFile: null,
    });

    setTimeout(() => setBookingSuccess(''), 4000);
  };

  const handleCancelAppointment = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userQuery = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setChatInput('');

    setTimeout(() => {
      const q = userQuery.toLowerCase();
      let botReply = '';

      if (q.includes('book') || q.includes('appointment') || q.includes('schedule')) {
        const dateMatch = userQuery.match(/\d{4}-\d{2}-\d{2}/);
        const matchedDoc = doctorsList.find((doc) => q.includes(doc.name.toLowerCase()) || q.includes(doc.dept.toLowerCase()));

        if (dateMatch) {
          const targetDate = dateMatch[0];

          if (targetDate < todayStr) {
            botReply = `I noticed you requested ${targetDate}, which is in the past! Please provide a current or future date.`;
          } else {
            const chosenDoc = matchedDoc ? matchedDoc : doctorsList[0];
            const newAutoAppt = {
              id: Date.now(),
              doctor: `${chosenDoc.name} (${chosenDoc.dept} Specialist)`,
              dept: chosenDoc.dept,
              date: targetDate,
              time: '10:00 AM',
              reportFile: null,
              status: 'Confirmed',
            };

            setAppointments((prev) => [...prev, newAutoAppt]);
            botReply = `✅ Success! I have automatically booked your appointment with ${chosenDoc.name} (${chosenDoc.dept}) for ${targetDate} at 10:00 AM. You can view it under the '📅 Book Appointment' tab!`;
          }
        } else {
          botReply = "I can book that for you! Please specify a date in **YYYY-MM-DD** format (e.g., *'Book with Dr. Rajesh Kumar on 2026-11-01'*).";
        }
      } else if (q.includes('today') || q.includes('date')) {
        const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        botReply = `Today is ${currentDate}.`;
      } else if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
        botReply = `Hello ${patientProfile.name}! I am your AI Health Assistant. Tell me if you'd like me to book a doctor appointment for you.`;
      } else if (q.includes('headache') || q.includes('migraine')) {
        botReply = 'Headaches can be caused by dehydration or stress. Drink water and rest. Would you like me to book an appointment with Dr. Ananya Verma (Neurology)?';
      } else {
        botReply = `Regarding "${userQuery}": Stay hydrated and ensure proper rest. You can also ask me to book an appointment directly!`;
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 700);
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/signup');
  };

  const filteredDoctors =
    selectedDeptFilter === 'All'
      ? doctorsList
      : doctorsList.filter((doc) => doc.dept === selectedDeptFilter);

  return (
    <div style={dashStyles.appLayout}>
      <header style={dashStyles.navbar}>
        <div style={dashStyles.navBrand}>
          <div style={dashStyles.navIcon}>+</div>
          <span style={dashStyles.navTitle}>
            MediLink <span style={{ color: '#0D9488' }}>AI</span>
          </span>
        </div>

        <div style={dashStyles.navRight}>
          <div style={dashStyles.userBadge}>
            <span style={dashStyles.userDot}></span>
            <div>
              <div style={dashStyles.userName}>{patientProfile?.name}</div>
              <div style={dashStyles.userRole}>{patientProfile?.email}</div>
            </div>
          </div>
          <button type="button" onClick={handleSignOut} style={dashStyles.logoutBtn}>
            Sign Out
          </button>
        </div>
      </header>

      <main style={dashStyles.mainContainer}>
        <div style={dashStyles.tabRow}>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            style={activeTab === 'profile' ? dashStyles.activeTabBtn : dashStyles.inactiveTabBtn}
          >
            👤 Patient Profile & AI Vitals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            style={activeTab === 'directory' ? dashStyles.activeTabBtn : dashStyles.inactiveTabBtn}
          >
            🏥 Doctors & Directory
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            style={activeTab === 'appointments' ? dashStyles.activeTabBtn : dashStyles.inactiveTabBtn}
          >
            📅 Book Appointment
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('aichat')}
            style={activeTab === 'aichat' ? dashStyles.activeTabBtn : dashStyles.inactiveTabBtn}
          >
            🤖 AI Health Bot Chat
          </button>
        </div>

        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={dashStyles.profileGrid}>
              <div style={dashStyles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={dashStyles.profileHeader}>
                    <div style={dashStyles.avatarCircle}>
                      {patientProfile?.name?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div>
                      <h2 style={dashStyles.patientName}>{patientProfile?.name}</h2>
                      <span style={dashStyles.patientIdBadge}>ID: {patientProfile?.id}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    style={dashStyles.editBtn}
                  >
                    {isEditing ? 'Cancel' : '✏️ Edit Profile'}
                  </button>
                </div>

                <div style={dashStyles.divider} />

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h3 style={dashStyles.sectionHeading}>Edit Personal Details</h3>
                    <div>
                      <label style={dashStyles.inputLabel}>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={patientProfile.name}
                        onChange={handleProfileChange}
                        style={dashStyles.editInput}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={dashStyles.inputLabel}>Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          value={patientProfile.phone}
                          onChange={handleProfileChange}
                          style={dashStyles.editInput}
                        />
                      </div>
                      <div>
                        <label style={dashStyles.inputLabel}>Age</label>
                        <input
                          type="number"
                          name="age"
                          value={patientProfile.age}
                          onChange={handleProfileChange}
                          style={dashStyles.editInput}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={dashStyles.inputLabel}>Gender</label>
                        <select
                          name="gender"
                          value={patientProfile.gender}
                          onChange={handleProfileChange}
                          style={dashStyles.editSelect}
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label style={dashStyles.inputLabel}>Blood Group</label>
                        <select
                          name="bloodGroup"
                          value={patientProfile.bloodGroup}
                          onChange={handleProfileChange}
                          style={dashStyles.editSelect}
                        >
                          <option>O+</option>
                          <option>O-</option>
                          <option>A+</option>
                          <option>A-</option>
                          <option>B+</option>
                          <option>B-</option>
                          <option>AB+</option>
                          <option>AB-</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={dashStyles.inputLabel}>Known Allergies</label>
                      <input
                        type="text"
                        name="allergies"
                        value={patientProfile.allergies}
                        onChange={handleProfileChange}
                        style={dashStyles.editInput}
                      />
                    </div>

                    <button type="submit" style={dashStyles.saveBtn}>
                      💾 Save Profile Changes
                    </button>
                  </form>
                ) : (
                  <>
                    <h3 style={dashStyles.sectionHeading}>Personal Information</h3>
                    <div style={dashStyles.infoGrid}>
                      <div style={dashStyles.infoItem}>
                        <span style={dashStyles.infoLabel}>Email Address</span>
                        <span style={dashStyles.infoValue}>{patientProfile?.email}</span>
                      </div>
                      <div style={dashStyles.infoItem}>
                        <span style={dashStyles.infoLabel}>Phone Number</span>
                        <span style={dashStyles.infoValue}>{patientProfile?.phone}</span>
                      </div>
                      <div style={dashStyles.infoItem}>
                        <span style={dashStyles.infoLabel}>Age / Gender</span>
                        <span style={dashStyles.infoValue}>{patientProfile?.age}Y • {patientProfile?.gender}</span>
                      </div>
                      <div style={dashStyles.infoItem}>
                        <span style={dashStyles.infoLabel}>Blood Group</span>
                        <span style={{ ...dashStyles.infoValue, color: '#DC2626' }}>{patientProfile?.bloodGroup}</span>
                      </div>
                      <div style={{ ...dashStyles.infoItem, gridColumn: 'span 2' }}>
                        <span style={dashStyles.infoLabel}>Known Allergies</span>
                        <span style={{ ...dashStyles.infoValue, color: '#B45309' }}>⚠️ {patientProfile?.allergies || 'None recorded'}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div style={dashStyles.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🧠</span>
                  <h3 style={{ margin: 0, color: '#0F172A', fontSize: '16px' }}>AI Health Risk & Vitals Analysis</h3>
                </div>

                <div style={dashStyles.vitalsGrid}>
                  <div style={dashStyles.vitalCard}>
                    <span style={dashStyles.vitalCardLabel}>Overall Health Score</span>
                    <span style={{ ...dashStyles.vitalCardValue, color: '#059669' }}>92 / 100</span>
                  </div>
                  <div style={dashStyles.vitalCard}>
                    <span style={dashStyles.vitalCardLabel}>Metabolic Risk</span>
                    <span style={{ ...dashStyles.vitalCardValue, color: '#D97706' }}>Low - Moderate</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '14px', marginTop: '12px' }}>
                  <strong style={{ color: '#166534', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                    ✨ AI Personal Recommendation ({patientProfile.age}Y Male):
                  </strong>
                  <p style={{ margin: 0, fontSize: '13px', color: '#14532D', lineHeight: '1.5' }}>
                    Based on your profile, maintain 2.5L daily hydration and schedule routine metabolic screenings every 6 months.
                  </p>
                </div>
              </div>
            </div>

            <div style={dashStyles.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '22px' }}>📄</span>
                <h3 style={{ margin: 0, color: '#0F172A' }}>Smart Lab Report Summarizer</h3>
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>
                Upload any PDF or image lab result to get instant plain-English summaries and flagged abnormal metrics.
              </p>

              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleAnalyzeLabReport}
                style={dashStyles.fileInput}
              />

              {isAnalyzingReport && (
                <div style={{ marginTop: '14px', fontSize: '13px', color: '#0D9488', fontWeight: '600' }}>
                  ⏳ Reading and extracting metrics from report...
                </div>
              )}

              {labAnalysis && (
                <div style={{ marginTop: '16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                  <strong style={{ color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    Summary for {labReportFile}:
                  </strong>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#334155' }}>{labAnalysis.summary}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    {labAnalysis.metrics.map((m, idx) => (
                      <div key={idx} style={{ backgroundColor: '#FFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '10px' }}>
                        <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>{m.name}</span>
                        <strong style={{ fontSize: '14px', color: '#0F172A' }}>{m.value}</strong>
                        <span style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginTop: '2px', color: m.status === 'Normal' ? '#059669' : '#DC2626' }}>
                          {m.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '12px', color: '#0F766E', backgroundColor: '#CCFBF1', padding: '10px', borderRadius: '8px' }}>
                    💡 <strong>Guidance:</strong> {labAnalysis.recommendation}
                  </div>
                </div>
              )}
            </div>

            <div style={dashStyles.profileGrid}>
              <div style={dashStyles.card}>
                <h3 style={dashStyles.sectionHeading}>📝 AI Symptom Tracker & Allergy Guard</h3>

                <form onSubmit={handleAddSymptomLog} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    value={symptomLog}
                    onChange={(e) => setSymptomLog(e.target.value)}
                    placeholder="Log daily symptom (e.g., Mild headache)..."
                    style={{ ...dashStyles.editInput, flex: 1 }}
                  />
                  <button type="submit" style={dashStyles.saveBtn}>Log</button>
                </form>

                <div style={{ maxHeight: '140px', overflowY: 'auto', marginBottom: '16px' }}>
                  {loggedSymptoms.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#F8FAFC', borderRadius: '6px', marginBottom: '6px', border: '1px solid #E2E8F0', fontSize: '13px' }}>
                      <span>{s.text}</span>
                      <span style={{ color: '#64748B', fontSize: '11px' }}>{s.date}</span>
                    </div>
                  ))}
                </div>

                <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '16px 0' }} />

                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#0F172A' }}>🛡️ Medicine / Food Allergy Safety Check</h4>
                <form onSubmit={handleCheckAllergySafety} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={allergyCheckInput}
                    onChange={(e) => setAllergyCheckInput(e.target.value)}
                    placeholder="Check medicine (e.g. Amoxicillin)..."
                    style={{ ...dashStyles.editInput, flex: 1 }}
                  />
                  <button type="submit" style={{ ...dashStyles.saveBtn, backgroundColor: '#0F172A' }}>Check</button>
                </form>

                {allergyWarning && (
                  <div style={{ marginTop: '10px', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', backgroundColor: allergyWarning.includes('🚨') ? '#FEF2F2' : '#F0FDF4', color: allergyWarning.includes('🚨') ? '#991B1B' : '#166534', border: '1px solid #CBD5E1' }}>
                    {allergyWarning}
                  </div>
                )}
              </div>

              <div style={dashStyles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>⏱️ Medical History & Clinical Digest</h3>
                  <button
                    type="button"
                    onClick={handleGenerateClinicalDigest}
                    disabled={isGeneratingDigest}
                    style={{ backgroundColor: '#0D9488', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {isGeneratingDigest ? 'Generating...' : '⚡ Generate Doctor Summary'}
                  </button>
                </div>

                {clinicalDigest && (
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #0D9488', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#0F172A', whiteSpace: 'pre-line', marginBottom: '16px' }}>
                    <strong style={{ color: '#0D9488' }}>📋 Pre-Consultation Brief:</strong>
                    {'\n' + clinicalDigest}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {medicalTimeline.map((item, idx) => (
                    <div key={idx} style={{ padding: '10px 12px', backgroundColor: '#F8FAFC', borderLeft: '3px solid #0D9488', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B' }}>
                        <span>{item.dept}</span>
                        <span>{item.date}</span>
                      </div>
                      <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block', marginTop: '2px' }}>{item.title}</strong>
                      <span style={{ fontSize: '12px', color: '#0D9488' }}>{item.doctor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIRECTORY */}
        {activeTab === 'directory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={dashStyles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', color: '#0F172A' }}>🏥 Hospital Specialist Directory</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                    Browse specialized medical departments and real-time doctor availability.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748B' }}>Filter Dept:</span>
                  <select
                    value={selectedDeptFilter}
                    onChange={(e) => setSelectedDeptFilter(e.target.value)}
                    style={dashStyles.editSelect}
                  >
                    <option value="All">All Departments</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Consultation">General Consultation</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredDoctors.map((doc) => (
                <div key={doc.id} style={{ ...dashStyles.card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: doc.avatarColor,
                            color: '#FFF',
                            fontWeight: 'bold',
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {doc.name.replace('Dr. ', '').charAt(0)}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>{doc.name}</h4>
                          <span style={{ fontSize: '12px', color: '#0D9488', fontWeight: 'bold' }}>{doc.dept}</span>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          backgroundColor: doc.status === 'Available Today' ? '#DCFCE7' : '#FEF3C7',
                          color: doc.status === 'Available Today' ? '#15803D' : '#B45309',
                        }}
                      >
                        {doc.status === 'Available Today' ? '🟢 Available' : '🟡 In Consultation'}
                      </span>
                    </div>

                    <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 8px 0', fontWeight: '600' }}>
                      🎓 {doc.degree} • {doc.experience}
                    </p>
                    <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                      {doc.bio}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>⏰ {doc.hours}</span>
                    <button
                      type="button"
                      onClick={() => handleQuickBookDoctor(doc)}
                      style={{ ...dashStyles.saveBtn, padding: '6px 12px', fontSize: '12px' }}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

       {/* TAB 3: APPOINTMENT BOOKING WITH CANCEL OPTION */}
{activeTab === 'appointments' && (
  <div style={dashStyles.profileGrid}>
    <div style={dashStyles.card}>
      <h3 style={dashStyles.sectionHeading}>📅 Book Doctor Appointment</h3>
      {bookingSuccess && <div style={dashStyles.successAlert}>{bookingSuccess}</div>}
      {bookingError && <div style={dashStyles.errorAlert}>⚠️ {bookingError}</div>}

      <form onSubmit={handleBookAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={dashStyles.inputLabel}>Select Department</label>
          <select
            value={bookingData.dept}
            onChange={(e) => setBookingData({ ...bookingData, dept: e.target.value })}
            style={dashStyles.editSelect}
          >
            <option>Neurology</option>
            <option>Cardiology</option>
            <option>General Consultation</option>
            <option>Pediatrics</option>
            <option>Orthopedics</option>
          </select>
        </div>



        {/* --- APPOINTMENT TYPE SELECTOR --- */}
        <div>
          <label style={dashStyles.inputLabel}>Appointment Type</label>
          <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="radio"
                name="appointmentType"
                value="In-Person"
                checked={bookingData.type === 'In-Person'}
                onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
              />
              🏥 In-Person
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="radio"
                name="appointmentType"
                value="Online"
                checked={bookingData.type === 'Online'}
                onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
              />
              💻 Online Consultation
            </label>
          </div>
        </div>

                <div>
                  <label style={dashStyles.inputLabel}>Select Specialist Doctor</label>
                  <select
                    value={bookingData.doctor}
                    onChange={(e) => setBookingData({ ...bookingData, doctor: e.target.value })}
                    style={dashStyles.editSelect}
                  >
                    <option>Dr. Ananya Verma (Neurology Specialist)</option>
                    <option>Dr. Rajesh Kumar (Cardiologist)</option>
                    <option>Dr. Priya Nair (General Physician)</option>
                    <option>Dr. Vikramaditya Seth (Orthopedics Specialist)</option>
                    <option>Dr. Meera Iyer (Pediatrician)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={dashStyles.inputLabel}>Appointment Date</label>
                    <input
                      type="date"
                      min={todayStr}
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      style={dashStyles.editInput}
                      required
                    />
                  </div>
                  <div>
                    <label style={dashStyles.inputLabel}>Time Slot</label>
                    <select
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      style={dashStyles.editSelect}
                    >
                      <option>10:00 AM</option>
                      <option>11:30 AM</option>
                      <option>02:00 PM</option>
                      <option>04:30 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={dashStyles.inputLabel}>
                    Medical Report / Lab Result <span style={{ color: '#64748B', fontWeight: 'normal' }}>(Optional)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files[0] && setBookingData({ ...bookingData, reportFile: e.target.files[0].name })}
                    style={dashStyles.fileInput}
                  />
                </div>

                <button type="submit" style={dashStyles.saveBtn}>
                  Confirm Appointment
                </button>
              </form>
            </div>

            <div style={dashStyles.card}>
              <h3 style={dashStyles.sectionHeading}>📋 Your Scheduled Appointments</h3>
              {appointments.length === 0 ? (
                <p style={{ color: '#64748B', fontStyle: 'italic', fontSize: '14px' }}>
                  No scheduled appointments yet. Book one using the form on the left or ask the AI Bot!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {appointments.map((appt) => (
                    <div key={appt.id} style={dashStyles.apptCard}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: '#0F172A' }}>{appt.doctor}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                          {appt.dept} • {appt.date} at {appt.time}
                        </p>
                        {appt.reportFile && (
                          <div style={{ fontSize: '12px', color: '#0D9488', marginTop: '6px', fontWeight: '600' }}>
                            📄 Attached Report: {appt.reportFile}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={dashStyles.confirmedBadge}>{appt.status}</span>
                        <button
                          type="button"
                          onClick={() => handleCancelAppointment(appt.id)}
                          style={dashStyles.cancelBtn}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AI CHAT BOT */}
        {activeTab === 'aichat' && (
          <div style={dashStyles.card}>
            <div style={dashStyles.cardHeader}>
              <span style={dashStyles.cardIcon}>🤖</span>
              <h3>MediLink AI Interactive Health Bot</h3>
            </div>
            <p style={dashStyles.cardDesc}>
              Chat with our assistant or type a request like: <em>"Book an appointment with Dr. Rajesh Kumar on 2026-10-30 at 10:00 AM"</em>.
            </p>

            <div style={dashStyles.chatBox}>
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  style={msg.sender === 'user' ? dashStyles.userBubble : dashStyles.botBubble}
                >
                  <strong>{msg.sender === 'user' ? 'You' : 'AI Health Bot'}:</strong>
                  <p style={{ margin: '4px 0 0 0', whiteSpace: 'pre-line' }}>{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask health questions or say 'Book appointment on 2026-10-25'..."
                style={dashStyles.editInput}
              />
              <button type="submit" style={dashStyles.saveBtn}>
                Send
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

const dashStyles = {
  appLayout: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#F8FAFC',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    boxSizing: 'border-box',
  },
  navbar: {
    height: '64px',
    backgroundColor: '#0F172A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  navIcon: {
    width: '32px',
    height: '32px',
    backgroundColor: '#0D9488',
    color: '#FFFFFF',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userDot: {
    width: '10px',
    height: '10px',
    backgroundColor: '#10B981',
    borderRadius: '50%',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
  },
  userRole: {
    color: '#94A3B8',
    fontSize: '12px',
  },
  logoutBtn: {
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  mainContainer: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  tabRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  activeTabBtn: {
    padding: '12px 20px',
    backgroundColor: '#0D9488',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  inactiveTabBtn: {
    padding: '12px 20px',
    backgroundColor: '#FFFFFF',
    color: '#64748B',
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatarCircle: {
    width: '56px',
    height: '56px',
    backgroundColor: '#0F172A',
    color: '#0D9488',
    borderRadius: '50%',
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientName: {
    margin: 0,
    fontSize: '20px',
    color: '#0F172A',
  },
  patientIdBadge: {
    fontSize: '12px',
    color: '#0D9488',
    fontWeight: '600',
    backgroundColor: '#CCFBF1',
    padding: '2px 8px',
    borderRadius: '4px',
    display: 'inline-block',
    marginTop: '4px',
  },
  editBtn: {
    backgroundColor: '#F1F5F9',
    color: '#0F172A',
    border: '1px solid #CBD5E1',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  divider: {
    height: '1px',
    backgroundColor: '#E2E8F0',
    margin: '20px 0',
  },
  sectionHeading: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    color: '#0F172A',
  },
  inputLabel: {
    fontSize: '12px',
    color: '#64748B',
    fontWeight: '600',
    display: 'block',
    marginBottom: '4px',
  },
  editInput: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  editSelect: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  fileInput: {
    width: '100%',
    padding: '8px',
    borderRadius: '8px',
    border: '1px dashed #CBD5E1',
    backgroundColor: '#F8FAFC',
    fontSize: '13px',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  saveBtn: {
    backgroundColor: '#0D9488',
    color: '#FFFFFF',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
    border: '1px solid #FECACA',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  infoLabel: {
    fontSize: '11px',
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: '14px',
    color: '#0F172A',
    fontWeight: '600',
  },
  vitalsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  vitalCard: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '12px 16px',
  },
  vitalCardLabel: {
    fontSize: '11px',
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '600',
    display: 'block',
  },
  vitalCardValue: {
    fontSize: '16px',
    color: '#0F172A',
    fontWeight: '700',
    marginTop: '4px',
    display: 'block',
  },
  successAlert: {
    backgroundColor: '#F0FDF4',
    border: '1px solid #BBF7D0',
    color: '#166534',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '14px',
  },
  errorAlert: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#991B1B',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '14px',
  },
  apptCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#F8FAFC',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
  },
  confirmedBadge: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  cardIcon: {
    fontSize: '22px',
  },
  cardDesc: {
    margin: '0 0 16px 0',
    fontSize: '13px',
    color: '#64748B',
  },
  chatBox: {
    minHeight: '260px',
    maxHeight: '320px',
    overflowY: 'auto',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    padding: '12px 16px',
    borderRadius: '12px',
    maxWidth: '80%',
    fontSize: '13px',
    color: '#0F172A',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#CCFBF1',
    border: '1px solid #99F6E4',
    padding: '10px 14px',
    borderRadius: '12px',
    maxWidth: '80%',
    fontSize: '13px',
    color: '#115E59',
  },
};