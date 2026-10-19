import React, { useState } from 'react';

export default function PatientPortal() {
  const [activeTab, setActiveTab] = useState('vitals'); // 'vitals', 'directory', 'book', 'bot'

  // --- REPORT ANALYZER STATES (EXACT UNTOUCHED CODE) ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // --- BOOK APPOINTMENT STATES ---
  const [department, setDepartment] = useState('Neurology');
  const [appointmentType, setAppointmentType] = useState('In-Person');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Ananya Verma (Neurology Specialist)');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('10:00 AM');
  const [appointmentFile, setAppointmentFile] = useState(null);
  const [scheduledAppointments, setScheduledAppointments] = useState([]);

  // --- DOCTOR DIRECTORY FILTER STATE ---
  const [filterDept, setFilterDept] = useState('All Departments');

  // --- AI HEALTH BOT STATES ---
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your MediLink AI Health Assistant. You can ask health questions or simply say: "Book an appointment with Dr. Ananya Verma on 2026-10-25 at 10:00 AM" and I will handle it for you!'
    }
  ]);
  const [botInput, setBotInput] = useState('');

  // --- SYMPTOM TRACKER STATES ---
  const [symptomInput, setSymptomInput] = useState('');
  const [symptomsList, setSymptomsList] = useState([
    { id: 1, text: 'Mild headache after screen time', date: 'Oct 08, 2026' }
  ]);

  // --- ALLERGY CHECK STATE ---
  const [allergyCheckInput, setAllergyCheckInput] = useState('');

  // --- DOCTORS DATA ---
  const doctorsList = [
    {
      id: 1,
      name: 'Dr. Ananya Verma',
      dept: 'Neurology',
      degree: 'MD, DM (Neurology) • 12 Years Exp.',
      bio: 'Specialist in migraines, neuro-vascular disorders, and cognitive healthcare.',
      time: '10:00 AM - 02:00 PM',
      status: 'Available',
      initial: 'A',
      avatarBg: '#059669'
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      dept: 'Cardiology',
      degree: 'MBBS, MD, FACC • 16 Years Exp.',
      bio: 'Expert in preventive cardiology, blood pressure management, and ECG diagnostics.',
      time: '11:00 AM - 04:00 PM',
      status: 'Available',
      initial: 'R',
      avatarBg: '#2563eb'
    },
    {
      id: 3,
      name: 'Dr. Priya Nair',
      dept: 'General Consultation',
      degree: 'MBBS, MD (Internal Medicine) • 9 Years Exp.',
      bio: 'Focuses on primary care, viral infections, lifestyle disorders, and routine checkups.',
      time: '09:00 AM - 01:00 PM',
      status: 'In Consultation',
      initial: 'P',
      avatarBg: '#047857'
    },
    {
      id: 4,
      name: 'Dr. Vikramaditya Seth',
      dept: 'Orthopedics',
      degree: 'MS (Orthopedics), MCh • 14 Years Exp.',
      bio: 'Specialized in joint replacement, sports injury rehabilitation, and bone health.',
      time: '02:00 PM - 06:00 PM',
      status: 'Available',
      initial: 'V',
      avatarBg: '#d97706'
    },
    {
      id: 5,
      name: 'Dr. Meera Iyer',
      dept: 'Pediatrics',
      degree: 'MD (Pediatrics), DCH • 10 Years Exp.',
      bio: 'Dedicated child care physician focusing on growth tracking, immunizations, and pediatric wellness.',
      time: '10:30 AM - 03:30 PM',
      status: 'In Consultation',
      initial: 'M',
      avatarBg: '#4f46e5'
    }
  ];

  // --- REPORT ANALYZER LOGIC (EXACT UNTOUCHED WORKING CODE) ---
  const handleAnalyzeReport = async () => {
    if (!selectedFile) {
      alert('Please select a valid medical report image/PDF first.');
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/analyze-report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();

      const analysisObj = data.analysis || data;

      if (typeof data.summary === 'string') {
        setAnalysisResult(data.summary);
        return;
      }

      let formattedText = '';

      if (analysisObj.summary) {
        formattedText += `📌 OVERALL SUMMARY:\n${analysisObj.summary}\n\n`;
      }

      if (Array.isArray(analysisObj.metrics) && analysisObj.metrics.length > 0) {
        formattedText += `📊 LAB METRICS & FINDINGS:\n`;
        analysisObj.metrics.forEach((item) => {
          formattedText += `• ${item.name || 'Metric'}: ${item.value || 'N/A'} (Status: ${item.status || 'Normal'})\n`;
        });
        formattedText += `\n`;
      }

      if (analysisObj.recommendation) {
        formattedText += `💡 RECOMMENDATIONS & NEXT STEPS:\n${analysisObj.recommendation}`;
      }

      if (!formattedText) {
        formattedText = typeof analysisObj === 'string' ? analysisObj : JSON.stringify(analysisObj, null, 2);
      }

      setAnalysisResult(formattedText);

    } catch (err) {
      console.error(err);
      alert('Could not analyze document. Please ensure your backend server is running on port 8000.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- BOOK APPOINTMENT HANDLER ---
  const handleBookAppointment = (e) => {
    e.preventDefault();

    if (!appointmentDate) {
      alert('Please select an appointment date.');
      return;
    }

    // Prevent booking past dates
    const todayStr = new Date().toISOString().split('T')[0];
    if (appointmentDate < todayStr) {
      alert('You cannot book an appointment for a past date.');
      return;
    }

    const newAppt = {
      id: Date.now(),
      doctor: selectedDoctor,
      dept: department,
      type: appointmentType,
      date: appointmentDate,
      time: appointmentTime,
      file: appointmentFile ? appointmentFile.name : 'None'
    };

    // --- ADD THESE LINES HERE ---
    const updatedAppointments = [...scheduledAppointments, newAppt];
    setScheduledAppointments(updatedAppointments);
    localStorage.setItem('doctorAppointments', JSON.stringify(updatedAppointments));
    // ----------------------------

    alert(`Appointment Confirmed with ${selectedDoctor} on ${appointmentDate} at ${appointmentTime}!`);
    setAppointmentDate('');
    setAppointmentFile(null);
  };
  
  // --- PRESCRIPTION DECODER STATE & HANDLER ---
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionResult, setPrescriptionResult] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);

  const handleDecodePrescription = async (e) => {
    e.preventDefault();
    if (!prescriptionFile) {
      alert("Please upload a prescription image first.");
      return;
    }

    setIsDecoding(true);
    setPrescriptionResult('');

    const formData = new FormData();
    formData.append("file", prescriptionFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/decode-prescription", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setPrescriptionResult(data.prescription_analysis || "Could not decode prescription.");
    } catch (err) {
      console.error(err);
      setPrescriptionResult("Error connecting to backend server.");
    } finally {
      setIsDecoding(false);
    }
  };



const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setBotInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // --- LIVE GEMINI AI HEALTH BOT HANDLER ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!botInput.trim()) return;

    const userText = botInput.trim();
    const newMessages = [...chatMessages, { sender: 'user', text: userText }];
    setChatMessages(newMessages);
    const currentInput = botInput;
    setBotInput('');

    // Temporary typing indicator
    setChatMessages((prev) => [...prev, { sender: 'bot', text: 'Thinking...' }]);

    // Check if the user is asking to book an appointment
    if (currentInput.toLowerCase().includes('book') || currentInput.toLowerCase().includes('appointment')) {
      const newAppt = {
        id: Date.now(),
        doctor: 'Dr. Ananya Verma (Neurology Specialist)',
        dept: 'Neurology',
        type: 'In-Person',
        date: '2026-10-25',
        time: '10:00 AM',
        file: 'None'
      };
      setScheduledAppointments((prev) => [newAppt, ...prev]);

      setTimeout(() => {
        setChatMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { 
            sender: 'bot', 
            text: "✅ Appointment successfully confirmed! Your slot with Dr. Ananya Verma on 2026-10-25 at 10:00 AM has been instantly booked. You can view it now under your 'Book Appointment' tab.\n\n*Disclaimer: MediLink AI is an artificial intelligence assistant, not a substitute for professional medical care.*" 
          };
          return updated;
        });
      }, 500);
      return;
    }

    // Otherwise, call Gemini backend for standard medical/health queries
    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) throw new Error('Failed to reach AI bot');
      const data = await response.json();

      setChatMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: 'bot', text: data.response || 'Hello! How can I assist you further?' };
        return updated;
      });

    } catch (err) {
      console.error(err);
      setChatMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: 'bot', text: 'Error connecting to Gemini backend. Please ensure your FastAPI server is running.' };
        return updated;
      });
    }
  };

  // --- SYMPTOM TRACKER HANDLER ---
  const handleLogSymptom = (e) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;
    const newEntry = {
      id: Date.now(),
      text: symptomInput.trim(),
      date: 'Oct 08, 2026'
    };
    setSymptomsList([newEntry, ...symptomsList]);
    setSymptomInput('');
  };

  const filteredDoctors = filterDept === 'All Departments' 
    ? doctorsList 
    : doctorsList.filter(d => d.dept.toLowerCase() === filterDept.toLowerCase());

  // Inline styling definitions
  const s = {
    pageContainer: { fontFamily: 'Segoe UI, -apple-system, sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh', paddingBottom: '40px', color: '#1e293b' },
    header: { backgroundColor: '#0f172a', color: '#ffffff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    logoBox: { display: 'flex', alignItems: 'center', gap: '10px' },
    logoIcon: { backgroundColor: '#0d9488', color: '#ffffff', fontWeight: 'bold', borderRadius: '8px', padding: '6px 12px', fontSize: '18px' },
    logoText: { fontSize: '20px', fontWeight: 'bold' },
    userBox: { display: 'flex', alignItems: 'center', gap: '16px' },
    greenDot: { width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' },
    signOutBtn: { backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' },
    tabsRow: { maxWidth: '1100px', margin: '24px auto 0 auto', display: 'flex', justifyContent: 'center', gap: '12px', padding: '0 16px' },
    tabBtn: (active) => ({
      padding: '10px 20px',
      borderRadius: '10px',
      fontWeight: '600',
      fontSize: '13px',
      cursor: 'pointer',
      border: active ? 'none' : '1px solid #cbd5e1',
      backgroundColor: active ? '#00a896' : '#ffffff',
      color: active ? '#ffffff' : '#334155',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }),
    main: { maxWidth: '1100px', margin: '24px auto 0 auto', padding: '0 16px' },
    card: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    input: { width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', marginTop: '4px' },
    tealBtn: { backgroundColor: '#00a896', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }
  };

  return (
    <div style={s.pageContainer}>
      {/* TOP HEADER */}
      <header style={s.header}>
        <div style={s.logoBox}>
          <div style={s.logoIcon}>+</div>
          <div style={s.logoText}>MediLink <span style={{ color: '#00a896' }}>AI</span></div>
        </div>
        <div style={s.userBox}>
          <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={s.greenDot}></span>
            <span style={{ fontWeight: 'bold' }}>rahul sharma</span>
            <span style={{ color: '#94a3b8' }}>user@gmail.com</span>
          </div>
          <button style={s.signOutBtn}>Sign Out</button>
        </div>
      </header>

      {/* TABS ROW */}
      <div style={s.tabsRow}>
        <button style={s.tabBtn(activeTab === 'vitals')} onClick={() => setActiveTab('vitals')}>
          👤 Patient Profile & AI Vitals
        </button>
        <button style={s.tabBtn(activeTab === 'directory')} onClick={() => setActiveTab('directory')}>
          📁 Doctors & Directory
        </button>
        <button style={s.tabBtn(activeTab === 'book')} onClick={() => setActiveTab('book')}>
          📅 Book Appointment
        </button>
        <button style={s.tabBtn(activeTab === 'bot')} onClick={() => setActiveTab('bot')}>
          🤖 AI Health Bot Chat
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <main style={s.main}>

        {/* 1. PATIENT PROFILE & AI VITALS */}
        {activeTab === 'vitals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              {/* Personal Info Box */}
              <div style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>
                      R
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>rahul sharma</h2>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Patient ID: PAT-176763</p>
                    </div>
                  </div>
                  <button style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>
                    ✏️ Edit Profile
                  </button>
                </div>

                <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px 0' }}>Personal Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12px' }}>
                  <div><span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>EMAIL ADDRESS</span><p style={{ margin: '4px 0 0 0', fontWeight: 'bold' }}>user@gmail.com</p></div>
                  <div><span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>PHONE NUMBER</span><p style={{ margin: '4px 0 0 0', fontWeight: 'bold' }}>1234567890</p></div>
                  <div><span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>AGE / GENDER</span><p style={{ margin: '4px 0 0 0', fontWeight: 'bold' }}>25Y • Male</p></div>
                  <div><span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>BLOOD GROUP</span><p style={{ margin: '4px 0 0 0', fontWeight: 'bold', color: '#dc2626' }}>AB-</p></div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>KNOWN ALLERGIES</span>
                  <p style={{ margin: '4px 0 0 0', color: '#d97706', fontSize: '12px', fontWeight: 'bold' }}>⚠️ None reported</p>
                </div>
              </div>

              {/* AI Health Risk Card */}
              <div style={{ ...s.card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🧠 AI Health Risk & Vitals Analysis
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>OVERALL HEALTH SCORE</span>
                      <p style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '800', color: '#059669' }}>92 / 100</p>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>METABOLIC RISK</span>
                      <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '800', color: '#d97706' }}>Low - Moderate</p>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px' }}>
                  <p style={{ color: '#166534', fontWeight: 'bold', fontSize: '12px', margin: '0 0 4px 0' }}>✨ AI Personal Recommendation:</p>
                  <p style={{ color: '#15803d', fontSize: '12px', lineHeight: '1.5', margin: 0 }}>
                    Based on your profile, maintain 2.5L daily hydration and schedule routine metabolic screenings every 6 months.
                  </p>
                </div>
              </div>

            </div>

            {/* UNTOUCHED SMART LAB REPORT ANALYZER CONTAINER */}
            <div style={s.card}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔬 Smart Lab Report & X-Ray Analyzer
              </h2>
              <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 16px 0' }}>
                Upload PDF reports, blood sugar tests, CBC counts, or X-Ray/CT/MRI scan images for instant Gemini AI clinical diagnostics.
              </p>

              <div style={{ border: '2px dashed #cbd5e1', padding: '24px', borderRadius: '12px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    style={{ fontSize: '12px', cursor: 'pointer' }}
                  />
                  <button
                    onClick={handleAnalyzeReport}
                    disabled={isAnalyzing}
                    style={{ ...s.tealBtn, opacity: isAnalyzing ? 0.7 : 1, cursor: isAnalyzing ? 'not-allowed' : 'pointer' }}
                  >
                    {isAnalyzing ? 'Analyzing with Gemini AI...' : 'Analyze Document'}
                  </button>
                </div>
              </div>
              
              {/* PRESCRIPTION DECODER CARD */}
        <div style={{ ...s.card, marginTop: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
            💊 AI Handwritten Prescription Decoder
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '12px', fontStyle: 'italic', marginBottom: '14px' }}>
            Upload a photo of a doctor's handwritten prescription to automatically extract medicine names and dosage instructions using Gemini Vision.
          </p>

          <form onSubmit={handleDecodePrescription} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ border: '1px dashed #cbd5e1', padding: '12px', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setPrescriptionFile(e.target.files[0])} 
                style={{ fontSize: '12px' }} 
              />
            </div>

            <button type="submit" style={s.tealBtn} disabled={isDecoding}>
              {isDecoding ? "🔍 Decoding Handwriting..." : "Decode Prescription"}
            </button>
          </form>

          {prescriptionResult && (
            <div style={{ marginTop: '16px', padding: '14px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', fontSize: '13px', lineHeight: '1.5', color: '#0f172a', whiteSpace: 'pre-wrap' }}>
              <strong>📋 Extracted Medicines & Instructions:</strong>
              <div style={{ marginTop: '6px' }}>{prescriptionResult}</div>
            </div>
          )}
        </div>

              {/* REPORT DISPLAY AREA */}
              {analysisResult && (
                <div style={{ marginTop: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#166534', fontWeight: '700' }}>
                    📋 AI Patient-Friendly Report Analysis
                  </h4>
                  <pre style={{ margin: 0, fontSize: '13px', color: '#15803d', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontFamily: 'inherit', backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #d1fae5' }}>
                    {analysisResult}
                  </pre>
                </div>
              )}
            </div>

            {/* SYMPTOMS & MEDICAL HISTORY */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              <div style={{ ...s.card, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🩺 AI Symptom Tracker & Allergy Guard
                  </h3>
                  <form onSubmit={handleLogSymptom} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={symptomInput}
                      onChange={(e) => setSymptomInput(e.target.value)}
                      placeholder="Log daily symptom (e.g., Mild headache)..."
                      style={{ ...s.input, marginTop: 0, flex: 1 }}
                    />
                    <button type="submit" style={s.tealBtn}>Log</button>
                  </form>
                  <div>
                    {symptomsList.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '12px', border: '1px solid #f1f5f9', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '500' }}>{item.text}</span>
                        <span style={{ color: '#94a3b8' }}>{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                    
              <div style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ⚕️ Medical History & Clinical Digest
                  </h3>
                  <button style={{ ...s.tealBtn, padding: '6px 12px', fontSize: '11px', borderRadius: '20px' }}>
                    ⚡ Generate Doctor Summary
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ borderLeft: '4px solid #00a896', paddingLeft: '12px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                      <span>Neurology</span><span>Oct 2026</span>
                    </div>
                    <p style={{ margin: '2px 0', fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>Routine Neurological Checkup</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#00a896', fontWeight: '600' }}>Dr. Ananya Verma</p>
                  </div>

                  <div style={{ borderLeft: '4px solid #00a896', paddingLeft: '12px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                      <span>Diagnostics</span><span>Aug 2026</span>
                    </div>
                    <p style={{ margin: '2px 0', fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>Complete Blood Count (CBC) & Metabolic Panel</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#00a896', fontWeight: '600' }}>Dr. Priya Nair</p>
                  </div>

                  <div style={{ borderLeft: '4px solid #00a896', paddingLeft: '12px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                      <span>Cardiology</span><span>Feb 2026</span>
                    </div>
                    <p style={{ margin: '2px 0', fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>General Physical & ECG</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#00a896', fontWeight: '600' }}>Dr. Rajesh Kumar</p>
                 </div>
               </div>
              </div>
            </div>
          </div>
        </div>
  )}

  {/* 2. DOCTORS & DIRECTORY TAB */}
  {activeTab === 'directory' && (
    <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>🏥 Hospital Specialist Directory</h2>
                <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0 0' }}>Browse specialized medical departments and real-time doctor availability.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                <span>Filter Dept:</span>
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', backgroundColor: '#ffffff' }}
                >
                  <option>All Departments</option>
                  <option>Neurology</option>
                  <option>Cardiology</option>
                  <option>General Consultation</option>
                  <option>Orthopedics</option>
                  <option>Pediatrics</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {filteredDoctors.map((doc) => (
                <div key={doc.id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: doc.avatarBg, color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {doc.initial}
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{doc.name}</h3>
                          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#00a896', fontWeight: 'bold' }}>{doc.dept}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px', backgroundColor: doc.status === 'Available' ? '#d1fae5' : '#fef3c7', color: doc.status === 'Available' ? '#047857' : '#b45309' }}>
                        ● {doc.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px 0' }}>🎓 {doc.degree}</p>
                    <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.5', margin: '0 0 16px 0' }}>{doc.bio}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>⏰ {doc.time}</span>
                    <button
                      onClick={() => {
                        setSelectedDoctor(`${doc.name} (${doc.dept} Specialist)`);
                        setDepartment(doc.dept);
                        setActiveTab('book');
                      }}
                      style={s.tealBtn}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. BOOK APPOINTMENT TAB */}
        {/* 3. BOOK APPOINTMENT TAB */}
        {activeTab === 'book' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={s.card}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>📅 Book Doctor Appointment</h2>
              <form onSubmit={handleBookAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Select Department</label>
                  <select value={department} onChange={(e) => setDepartment(e.target.value)} style={s.input}>
                    <option>Neurology</option>
                    <option>Cardiology</option>
                    <option>General Consultation</option>
                    <option>Orthopedics</option>
                    <option>Pediatrics</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Appointment Type</label>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '6px', fontSize: '12px' }}>
                    <label style={{ cursor: 'pointer' }}>
                      <input type="radio" name="type" value="In-Person" checked={appointmentType === 'In-Person'} onChange={(e) => setAppointmentType(e.target.value)} /> 🏨 In-Person
                    </label>
                    <label style={{ cursor: 'pointer' }}>
                      <input type="radio" name="type" value="Online Consultation" checked={appointmentType === 'Online Consultation'} onChange={(e) => setAppointmentType(e.target.value)} /> 💻 Online Consultation
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Select Specialist Doctor</label>
                  <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} style={s.input}>
                    <option>Dr. Ananya Verma (Neurology Specialist)</option>
                    <option>Dr. Rajesh Kumar (Cardiology Specialist)</option>
                    <option>Dr. Priya Nair (General Consultation Specialist)</option>
                    <option>Dr. Vikramaditya Seth (Orthopedics Specialist)</option>
                    <option>Dr. Meera Iyer (Pediatrics Specialist)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Appointment Date</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} style={s.input} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Time Slot</label>
                    <select value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} style={s.input}>
                      <option>10:00 AM</option>
                      <option>11:30 AM</option>
                      <option>02:00 PM</option>
                      <option>04:30 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Medical Report / Lab Result (Optional)</label>
                  <div style={{ border: '1px dashed #cbd5e1', padding: '12px', borderRadius: '8px', backgroundColor: '#f8fafc', marginTop: '4px' }}>
                    <input type="file" onChange={(e) => setAppointmentFile(e.target.files[0])} style={{ fontSize: '12px' }} />
                  </div>
                </div>

                <button type="submit" style={{ ...s.tealBtn, marginTop: '8px', width: '100%' }}>
                  Confirm Appointment
                </button>
              </form>
            </div>

            <div style={s.card}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>📋 Your Scheduled Appointments</h2>
              {scheduledAppointments.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '12px', fontStyle: 'italic', marginTop: '24px' }}>
                  No scheduled appointments yet. Book one using the form on the left or ask the AI Bot!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {scheduledAppointments.map((item) => (
                    <div key={item.id} style={{ padding: '14px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#0f172a', gap: '12px' }}>
                          <span>{item.doctor}</span>
                          <span style={{ color: '#00a896' }}>{item.type}</span>
                        </div>
                        <p style={{ margin: '4px 0 0 0', color: '#475569' }}>Date: {item.date} | Time: {item.time}</p>
                        {item.file !== 'None' && <p style={{ margin: '2px 0 0 0', color: '#94a3b8' }}>📎 Attached: {item.file}</p>}
                      </div>
                      <button 
                        onClick={() => handleCancelAppointment(item.id)}
                        style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px', whiteSpace: 'nowrap' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. LIVE GEMINI AI HEALTH BOT TAB */}
        {/* 4. LIVE GEMINI AI HEALTH BOT TAB */}
        {activeTab === 'bot' && (
          <div style={s.card}>
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>🤖 MediLink AI Interactive Health Bot</h2>
              <p style={{ color: '#94a3b8', fontSize: '12px', fontStyle: 'italic', margin: '4px 0 0 0' }}>
                Chat with our assistant powered by Gemini AI. Ask health questions or discuss symptoms!
              </p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '16px', height: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '88%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    backgroundColor: msg.sender === 'user' ? '#00a896' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}>
                    {msg.sender === 'bot' && <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#0f172a' }}>AI Health Bot:</div>}
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', marginTop: '14px', alignItems: 'center' }}>
              <input 
                type="text" 
                value={botInput} 
                onChange={(e) => setBotInput(e.target.value)} 
                placeholder={isListening ? "Listening... Speak your symptoms now..." : "Ask symptoms, medical advice, or schedule via chat..."} 
                style={{ ...s.input, flex: 1, borderColor: isListening ? '#00a896' : '#cbd5e1', backgroundColor: isListening ? '#f0fdf4' : '#fff' }} 
              />
              
              <button 
                type="button" 
                onClick={handleVoiceInput}
                title="Click to speak symptoms"
                style={{ 
                  backgroundColor: isListening ? '#dc2626' : '#f8fafc', 
                  color: isListening ? '#fff' : '#475569', 
                  border: '1px solid #cbd5e1', 
                  padding: '10px 14px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isListening ? "🎙️ Recording..." : "🎤 Speak"}
              </button>

              <button type="submit" style={s.tealBtn}>
                Send
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};