import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'leaves', 'profile', or 'aichat'

  // Doctor Info State
  const [doctorInfo, setDoctorInfo] = useState({
    name: 'Dr. Priya Nair',
    role: 'General Physician',
    department: 'General Consultation',
    email: 'priya@gmail.com',
    phone: '+91 9876543210',
    hospitalId: 'DOC-884921',
    bio: 'Focuses on primary care, viral infections, lifestyle disorders, and routine checkups.',
    status: 'Available',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Patient Appointment Queue
  const [patientQueue, setPatientQueue] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Leave Management State
  const [leaves, setLeaves] = useState([
    { id: 1, startDate: '2026-11-01', endDate: '2026-11-03', reason: 'Medical Conference', status: 'Approved' },
  ]);
  const [newLeave, setNewLeave] = useState({ startDate: '', endDate: '', reason: '' });
  const [leaveMessage, setLeaveMessage] = useState('');

  // Digital Prescription Form State
  const [prescription, setPrescription] = useState({
    medicine: '',
    dosage: '1 Tablet Daily (After Meals)',
    duration: '5 Days',
    notes: '',
  });
  const [prescriptionSuccess, setPrescriptionSuccess] = useState('');

  // AI Schedule & Time-Management Chatbot State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello Doctor! I am your AI Schedule & Time-Management Assistant. Ask me anything like: "Am I on time today?", "How many patients are pending?", or "Summarize my queue".',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    let currentDocName = 'Dr. Priya Nair';

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        currentDocName = parsed.name || currentDocName;
        setDoctorInfo((prev) => ({
          ...prev,
          name: currentDocName,
          email: parsed.email || prev.email,
          department: parsed.department || prev.department,
        }));
      } catch (e) {}
    }

    // Load appointments from localStorage and flexibly filter for the logged-in doctor
    const allAppointments = JSON.parse(localStorage.getItem('hospital_appointments') || '[]');
    const docIdentifier = currentDocName.replace('Dr. ', '').toLowerCase(); // e.g., "priya nair" or "ananya verma"
    
    const doctorAppointments = allAppointments.filter(
      (appt) => appt.doctor && appt.doctor.toLowerCase().includes(docIdentifier)
    );

    // Default demo queue if no appointments are booked yet for this doctor
    const defaultQueue = [
      {
        id: 102,
        name: 'Priya Patel',
        age: 34,
        gender: 'Female',
        bloodGroup: 'O+',
        time: '11:30 AM',
        date: '2026-10-11',
        type: 'Online',
        doctor: 'Dr. Priya Nair (General Physician)',
        symptom: 'Routine checkup & nerve pain',
        reportFile: 'Clinical_Summary_Patient.pdf',
        reportData: 'Clinical Summary: Patient reports mild fatigue and seasonal allergies.',
        status: 'Pending',
      },
    ];

    const combinedQueue = doctorAppointments.length > 0 ? doctorAppointments : defaultQueue.filter(d => d.doctor.toLowerCase().includes(docIdentifier));
    setPatientQueue(combinedQueue);
    if (combinedQueue.length > 0) setSelectedPatient(combinedQueue[0]);
  }, []);

  // Live Analytics Calculations
  const totalAppointments = patientQueue.length;
  const inPersonCount = patientQueue.filter((p) => p.type === 'In-Person').length;
  const onlineCount = patientQueue.filter((p) => p.type === 'Online').length;
  const completedCount = patientQueue.filter((p) => p.status === 'Completed').length;
  const pendingCount = patientQueue.filter((p) => p.status === 'Pending').length;

  const handleStatusChange = (newStatus) => {
    setDoctorInfo({ ...doctorInfo, status: newStatus });
  };

  const handleUpdatePatientStatus = (id, newStatus) => {
    const updated = patientQueue.map((p) => (p.id === id ? { ...p, status: newStatus } : p));
    setPatientQueue(updated);
    localStorage.setItem('hospital_appointments', JSON.stringify(updated));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    setProfileSuccess('Professional profile updated successfully!');
    localStorage.setItem('user', JSON.stringify({ ...doctorInfo, name: doctorInfo.name, email: doctorInfo.email }));
    setTimeout(() => setProfileSuccess(''), 4000);
  };

  const handleAddLeave = (e) => {
    e.preventDefault();
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason.trim()) {
      return alert('Please complete all leave details.');
    }

    const leaveItem = {
      id: Date.now(),
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      reason: newLeave.reason,
      status: 'Scheduled',
    };

    setLeaves([leaveItem, ...leaves]);
    setLeaveMessage('Leave dates registered successfully! Your availability is updated.');
    setNewLeave({ startDate: '', endDate: '', reason: '' });

    setTimeout(() => setLeaveMessage(''), 4000);
  };

  const handleCancelLeave = (id) => {
    setLeaves((prev) => prev.filter((l) => l.id !== id));
  };

  const handleIssuePrescription = (e) => {
    e.preventDefault();
    if (!selectedPatient) return alert('No patient selected.');
    if (!prescription.medicine.trim()) return alert('Please enter medicine name.');

    const newEntry = {
      id: Date.now(),
      patientName: selectedPatient.name,
      patientId: selectedPatient.id,
      doctorName: doctorInfo.name,
      medicine: prescription.medicine,
      dosage: prescription.dosage,
      duration: prescription.duration,
      notes: prescription.notes,
      date: new Date().toLocaleDateString(),
    };

    const existingPrescriptions = JSON.parse(localStorage.getItem('patient_prescriptions') || '[]');
    localStorage.setItem('patient_prescriptions', JSON.stringify([newEntry, ...existingPrescriptions]));

    setPrescriptionSuccess(`Prescription successfully issued for ${selectedPatient.name}!`);
    setPrescription({ medicine: '', dosage: '1 Tablet Daily (After Meals)', duration: '5 Days', notes: '' });

    setTimeout(() => setPrescriptionSuccess(''), 4000);
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput.trim().toLowerCase();
    setChatMessages((prev) => [...prev, { sender: 'user', text: chatInput.trim() }]);
    setChatInput('');

    setTimeout(() => {
      let reply = '';
      if (query.includes('time') || query.includes('schedule') || query.includes('pace') || query.includes('running')) {
        if (completedCount >= 1) {
          reply = `🟢 Great pacing, Doctor! You have completed ${completedCount} out of ${totalAppointments} appointments. You are currently on track with your schedule.`;
        } else {
          reply = `🟡 You have ${pendingCount} pending appointments and 0 completed so far today. Consider beginning your first consultation to stay on time!`;
        }
      } else if (query.includes('pending') || query.includes('left') || query.includes('remaining')) {
        reply = `📋 You have ${pendingCount} patient(s) waiting in your queue and ${completedCount} completed session(s).`;
      } else if (query.includes('summary') || query.includes('overview')) {
        reply = `📊 Daily Summary: Assigned Appointments: ${totalAppointments} (${inPersonCount} In-Person, ${onlineCount} Online). Completed: ${completedCount}. Pending: ${pendingCount}.`;
      } else {
        reply = `🤖 Based on your assigned queue, you have ${pendingCount} pending patient visits. All systems are running smoothly!`;
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 700);
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/signup');
  };

  return (
    <div style={docStyles.layout}>
      {/* Navbar */}
      <header style={docStyles.navbar}>
        <div style={docStyles.brand}>
          <div style={docStyles.icon}>+</div>
          <span style={docStyles.title}>
            MediLink <span style={{ color: '#0D9488' }}>AI Doctor Portal ({doctorInfo.name})</span>
          </span>
        </div>

        <div style={docStyles.rightNav}>
          <div style={docStyles.doctorBadge}>
            <span style={docStyles.statusDot}></span>
            <div>
              <div style={docStyles.doctorName}>{doctorInfo.name}</div>
              <div style={docStyles.doctorRole}>{doctorInfo.email}</div>
            </div>
          </div>

          <div style={docStyles.statusToggle}>
            <button
              type="button"
              onClick={() => handleStatusChange('Available')}
              style={{
                ...docStyles.statusBtn,
                backgroundColor: doctorInfo.status === 'Available' ? '#10B981' : '#334155',
              }}
            >
              🟢 Available
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange('In Consultation')}
              style={{
                ...docStyles.statusBtn,
                backgroundColor: doctorInfo.status === 'In Consultation' ? '#F59E0B' : '#334155',
              }}
            >
              🟡 Busy
            </button>
          </div>

          <button type="button" onClick={handleSignOut} style={docStyles.logoutBtn}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main style={docStyles.container}>
        {/* Analytics Stats Overview Card */}
        <div style={docStyles.statsRow}>
          <div style={docStyles.statCard}>
            <span style={docStyles.statLabel}>Assigned Appointments</span>
            <span style={docStyles.statValue}>{totalAppointments}</span>
            <span style={docStyles.statSub}>Booked for You</span>
          </div>
          <div style={docStyles.statCard}>
            <span style={docStyles.statLabel}>In-Person Visits</span>
            <span style={{ ...docStyles.statValue, color: '#2563EB' }}>{inPersonCount}</span>
            <span style={docStyles.statSub}>Clinic Consultations</span>
          </div>
          <div style={docStyles.statCard}>
            <span style={docStyles.statLabel}>Online Consultations</span>
            <span style={{ ...docStyles.statValue, color: '#7C3AED' }}>{onlineCount}</span>
            <span style={docStyles.statSub}>Video Telehealth</span>
          </div>
          <div style={docStyles.statCard}>
            <span style={docStyles.statLabel}>Completed Today</span>
            <span style={{ ...docStyles.statValue, color: '#059669' }}>{completedCount}</span>
            <span style={docStyles.statSub}>Prescriptions Issued</span>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div style={docStyles.tabRow}>
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            style={activeTab === 'queue' ? docStyles.activeTabBtn : docStyles.inactiveTabBtn}
          >
            🩺 Patient Queue & Prescriptions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('leaves')}
            style={activeTab === 'leaves' ? docStyles.activeTabBtn : docStyles.inactiveTabBtn}
          >
            📅 Leave & Availability Schedule
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            style={activeTab === 'profile' ? docStyles.activeTabBtn : docStyles.inactiveTabBtn}
          >
            👨‍⚕️ Doctor Profile Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('aichat')}
            style={activeTab === 'aichat' ? docStyles.activeTabBtn : docStyles.inactiveTabBtn}
          >
            🤖 AI Schedule Assistant Bot
          </button>
        </div>

        {/* TAB 1: PATIENT QUEUE & ACTIVE CONSULTATION */}
        {activeTab === 'queue' && (
          <div style={docStyles.grid}>
            {/* Left Panel: Patient Queue */}
            <div style={docStyles.card}>
              <h3 style={docStyles.heading}>📋 Assigned Patient Queue</h3>
              {patientQueue.length === 0 ? (
                <p style={{ color: '#64748B', fontSize: '13px' }}>No patients have booked an appointment with you yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {patientQueue.map((patient) => (
                    <div
                      key={patient.id || patient.date + patient.time}
                      onClick={() => setSelectedPatient(patient)}
                      style={{
                        ...docStyles.queueItem,
                        borderColor: selectedPatient?.id === patient.id ? '#0D9488' : '#E2E8F0',
                        backgroundColor: selectedPatient?.id === patient.id ? '#F0FDF4' : '#F8FAFC',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '15px', color: '#0F172A' }}>{patient.name}</strong>
                        <span style={docStyles.timeBadge}>⏰ {patient.time}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                          {patient.date} • <span style={{ color: '#1E40AF', fontWeight: 'bold' }}>{patient.type}</span>
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 'bold',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: patient.status === 'Completed' ? '#DCFCE7' : '#FEF3C7',
                            color: patient.status === 'Completed' ? '#15803D' : '#B45309',
                          }}
                        >
                          {patient.status}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdatePatientStatus(
                              patient.id,
                              patient.status === 'Completed' ? 'Pending' : 'Completed'
                            );
                          }}
                          style={docStyles.actionBtn}
                        >
                          {patient.status === 'Completed' ? 'Reopen' : 'Mark Completed'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Panel: Active Consultation Workspace & Prescription Builder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedPatient && (
                <div style={docStyles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, color: '#0F172A' }}>🩺 Active Consultation: {selectedPatient.name}</h3>
                  </div>

                  <div style={docStyles.infoGrid}>
                    <div>
                      <span style={docStyles.label}>Consultation Type</span>
                      <strong style={{ fontSize: '13px', color: '#1E40AF' }}>{selectedPatient.type} Visit</strong>
                    </div>
                    <div>
                      <span style={docStyles.label}>Patient Uploaded Report</span>
                      {selectedPatient.reportFile ? (
                        <button
                          type="button"
                          onClick={() => setShowReportModal(true)}
                          style={{
                            backgroundColor: '#CCFBF1',
                            color: '#0F766E',
                            border: '1px solid #99F6E4',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '2px',
                          }}
                        >
                          📄 View {selectedPatient.reportFile}
                        </button>
                      ) : (
                        <strong style={{ fontSize: '13px', color: '#94A3B8' }}>None uploaded</strong>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Digital Prescription Builder Integrated in Active Appointment */}
              <div style={docStyles.card}>
                <h3 style={docStyles.heading}>💊 Digital Prescription Builder ({selectedPatient?.name || 'Select Patient'})</h3>
                {prescriptionSuccess && <div style={docStyles.successAlert}>{prescriptionSuccess}</div>}

                <form onSubmit={handleIssuePrescription} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={docStyles.label}>Medication Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Paracetamol 500mg or Migraine Relief"
                      value={prescription.medicine}
                      onChange={(e) => setPrescription({ ...prescription, medicine: e.target.value })}
                      style={docStyles.input}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={docStyles.label}>Dosage Frequency</label>
                      <select
                        value={prescription.dosage}
                        onChange={(e) => setPrescription({ ...prescription, dosage: e.target.value })}
                        style={docStyles.select}
                      >
                        <option>1 Tablet Daily (After Meals)</option>
                        <option>2 Tablets Daily (Morning & Night)</option>
                        <option>1 Tablet as needed for pain</option>
                      </select>
                    </div>
                    <div>
                      <label style={docStyles.label}>Treatment Duration</label>
                      <select
                        value={prescription.duration}
                        onChange={(e) => setPrescription({ ...prescription, duration: e.target.value })}
                        style={docStyles.select}
                      >
                        <option>3 Days</option>
                        <option>5 Days</option>
                        <option>7 Days</option>
                        <option>14 Days</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={docStyles.label}>Doctor Notes & Instructions</label>
                    <textarea
                      rows={2}
                      placeholder="Additional advice (e.g. Adequate rest, drink 3L water daily)..."
                      value={prescription.notes}
                      onChange={(e) => setPrescription({ ...prescription, notes: e.target.value })}
                      style={docStyles.textarea}
                    />
                  </div>

                  <button type="submit" style={docStyles.submitBtn}>
                    ✍️ Issue Digital Prescription
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEAVE & AVAILABILITY SCHEDULE */}
        {activeTab === 'leaves' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
            <div style={docStyles.card}>
              <h3 style={docStyles.heading}>📅 Schedule Doctor Leave</h3>
              {leaveMessage && <div style={docStyles.successAlert}>{leaveMessage}</div>}

              <form onSubmit={handleAddLeave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={docStyles.label}>Leave Start Date</label>
                  <input
                    type="date"
                    value={newLeave.startDate}
                    onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                    style={docStyles.input}
                    required
                  />
                </div>

                <div>
                  <label style={docStyles.label}>Leave End Date</label>
                  <input
                    type="date"
                    value={newLeave.endDate}
                    onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                    style={docStyles.input}
                    required
                  />
                </div>

                <div>
                  <label style={docStyles.label}>Reason for Unavailability</label>
                  <input
                    type="text"
                    placeholder="e.g. Annual Leave, Medical Conference, Personal"
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    style={docStyles.input}
                    required
                  />
                </div>

                <button type="submit" style={docStyles.submitBtn}>
                  🌴 Register Leave Dates
                </button>
              </form>
            </div>

            <div style={docStyles.card}>
              <h3 style={docStyles.heading}>📋 Registered Leave Schedule</h3>
              {leaves.length === 0 ? (
                <p style={{ color: '#64748B', fontStyle: 'italic', fontSize: '14px' }}>
                  No leave dates scheduled. You are currently marked available for all upcoming slots.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {leaves.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '14px 18px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block' }}>
                          📅 {item.startDate} to {item.endDate}
                        </strong>
                        <span style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', display: 'block' }}>
                          Reason: {item.reason}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#FEF3C7',
                            color: '#B45309',
                          }}
                        >
                          {item.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCancelLeave(item.id)}
                          style={docStyles.cancelLeaveBtn}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DOCTOR PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div style={docStyles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', color: '#0F172A', fontSize: '18px' }}>👨‍⚕️ Professional Doctor Profile</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                  Manage your verified clinical credentials, department, and contact information.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                style={docStyles.actionBtn}
              >
                {isEditingProfile ? 'Cancel' : '✏️ Edit Profile'}
              </button>
            </div>

            {profileSuccess && <div style={docStyles.successAlert}>{profileSuccess}</div>}

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={docStyles.label}>Full Name</label>
                    <input
                      type="text"
                      value={doctorInfo.name}
                      onChange={(e) => setDoctorInfo({ ...doctorInfo, name: e.target.value })}
                      style={docStyles.input}
                      required
                    />
                  </div>
                  <div>
                    <label style={docStyles.label}>Specialization Role</label>
                    <input
                      type="text"
                      value={doctorInfo.role}
                      onChange={(e) => setDoctorInfo({ ...doctorInfo, role: e.target.value })}
                      style={docStyles.input}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={docStyles.label}>Department</label>
                    <input
                      type="text"
                      value={doctorInfo.department}
                      onChange={(e) => setDoctorInfo({ ...doctorInfo, department: e.target.value })}
                      style={docStyles.input}
                      required
                    />
                  </div>
                  <div>
                    <label style={docStyles.label}>Phone Number</label>
                    <input
                      type="text"
                      value={doctorInfo.phone}
                      onChange={(e) => setDoctorInfo({ ...doctorInfo, phone: e.target.value })}
                      style={docStyles.input}
                    />
                  </div>
                  <div>
                    <label style={docStyles.label}>Hospital ID</label>
                    <input
                      type="text"
                      value={doctorInfo.hospitalId}
                      disabled
                      style={{ ...docStyles.input, backgroundColor: '#F1F5F9', color: '#64748B' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={docStyles.label}>Professional Bio / Expertise</label>
                  <textarea
                    rows={3}
                    value={doctorInfo.bio}
                    onChange={(e) => setDoctorInfo({ ...doctorInfo, bio: e.target.value })}
                    style={docStyles.textarea}
                  />
                </div>

                <button type="submit" style={docStyles.submitBtn}>
                  💾 Save Profile Changes
                </button>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={docStyles.profileItem}>
                  <span style={docStyles.label}>Full Name</span>
                  <strong style={{ fontSize: '15px', color: '#0F172A' }}>{doctorInfo.name}</strong>
                </div>
                <div style={docStyles.profileItem}>
                  <span style={docStyles.label}>Email Address</span>
                  <strong style={{ fontSize: '15px', color: '#0F172A' }}>{doctorInfo.email}</strong>
                </div>
                <div style={docStyles.profileItem}>
                  <span style={docStyles.label}>Specialization</span>
                  <strong style={{ fontSize: '15px', color: '#0D9488' }}>{doctorInfo.role}</strong>
                </div>
                <div style={docStyles.profileItem}>
                  <span style={docStyles.label}>Department</span>
                  <strong style={{ fontSize: '15px', color: '#0F172A' }}>{doctorInfo.department}</strong>
                </div>
                <div style={docStyles.profileItem}>
                  <span style={docStyles.label}>Phone Number</span>
                  <strong style={{ fontSize: '15px', color: '#0F172A' }}>{doctorInfo.phone}</strong>
                </div>
                <div style={docStyles.profileItem}>
                  <span style={docStyles.label}>Hospital ID</span>
                  <strong style={{ fontSize: '15px', color: '#0F172A' }}>{doctorInfo.hospitalId}</strong>
                </div>
                <div style={{ ...docStyles.profileItem, gridColumn: 'span 2' }}>
                  <span style={docStyles.label}>Professional Bio</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>
                    {doctorInfo.bio}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AI SCHEDULE ASSISTANT BOT */}
        {activeTab === 'aichat' && (
          <div style={docStyles.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '22px' }}>🤖</span>
              <h3 style={{ margin: 0, color: '#0F172A' }}>AI Schedule & Time-Management Assistant</h3>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>
              Chat with your assistant to check if you are on time, review pending queues, or summarize your day.
            </p>

            <div style={docStyles.chatBox}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={msg.sender === 'user' ? docStyles.userBubble : docStyles.botBubble}
                >
                  <strong>{msg.sender === 'user' ? 'You' : 'AI Schedule Assistant'}:</strong>
                  <p style={{ margin: '4px 0 0 0', whiteSpace: 'pre-line' }}>{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask e.g., 'Am I doing my appointments on time today?'..."
                style={{ ...docStyles.input, flex: 1 }}
              />
              <button type="submit" style={docStyles.submitBtn}>
                Send
              </button>
            </form>
          </div>
        )}
      </main>

      {/* REPORT VIEWER MODAL */}
      {showReportModal && selectedPatient && (
        <div style={docStyles.modalOverlay}>
          <div style={docStyles.modalCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#0F172A' }}>📄 Report Viewer: {selectedPatient.reportFile}</h3>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 12px 0' }}>
              Patient: <strong>{selectedPatient.name}</strong> ({selectedPatient.age || 'N/A'}Y • {selectedPatient.gender || 'N/A'})
            </p>
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', padding: '16px', borderRadius: '8px', fontSize: '14px', color: '#0F172A', whiteSpace: 'pre-line', marginBottom: '20px' }}>
              {selectedPatient.reportData || 'Clinical report uploaded successfully.'}
            </div>
            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              style={docStyles.submitBtn}
            >
              Close Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const docStyles = {
  layout: { minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: '-apple-system, sans-serif' },
  navbar: { height: '64px', backgroundColor: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' },
  brand: { display: 'flex', alignItems: 'center', gap: '12px' },
  icon: { width: '32px', height: '32px', backgroundColor: '#0D9488', color: '#FFF', borderRadius: '8px', fontWeight: 'bold', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: '20px', fontWeight: '700', color: '#FFF' },
  rightNav: { display: 'flex', alignItems: 'center', gap: '20px' },
  doctorBadge: { display: 'flex', alignItems: 'center', gap: '10px' },
  statusDot: { width: '10px', height: '10px', backgroundColor: '#10B981', borderRadius: '50%' },
  doctorName: { color: '#FFF', fontSize: '14px', fontWeight: '600' },
  doctorRole: { color: '#94A3B8', fontSize: '12px' },
  statusToggle: { display: 'flex', alignItems: 'center', gap: '8px' },
  statusBtn: { border: 'none', color: '#FFF', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  logoutBtn: { backgroundColor: '#DC2626', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  statLabel: { fontSize: '12px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', display: 'block' },
  statValue: { fontSize: '24px', fontWeight: 'bold', color: '#0F172A', marginTop: '4px', display: 'block' },
  statSub: { fontSize: '11px', color: '#94A3B8', marginTop: '2px', display: 'block' },
  tabRow: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  activeTabBtn: { padding: '10px 18px', backgroundColor: '#0D9488', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' },
  inactiveTabBtn: { padding: '10px 18px', backgroundColor: '#FFF', color: '#64748B', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '24px' },
  card: { backgroundColor: '#FFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  heading: { margin: '0 0 16px 0', fontSize: '16px', color: '#0F172A' },
  queueItem: { padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.2s' },
  timeBadge: { fontSize: '12px', fontWeight: 'bold', color: '#0D9488' },
  actionBtn: { backgroundColor: '#FFF', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  cancelLeaveBtn: { backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  idBadge: { backgroundColor: '#CCFBF1', color: '#0D9488', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '12px 0' },
  profileItem: { backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px 16px' },
  label: { fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '2px' },
  aiBriefBox: { backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px', marginTop: '12px' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit' },
  submitBtn: { backgroundColor: '#0D9488', color: '#FFF', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', width: '100%' },
  successAlert: { backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' },
  chatBox: { minHeight: '260px', maxHeight: '320px', overflowY: 'auto', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: '12px', maxWidth: '80%', fontSize: '13px', color: '#0F172A' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#CCFBF1', border: '1px solid #99F6E4', padding: '10px 14px', borderRadius: '12px', maxWidth: '80%', fontSize: '13px', color: '#115E59' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalCard: { backgroundColor: '#FFF', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
};