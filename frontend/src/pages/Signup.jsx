import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient'); // 'patient' or 'doctor'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    department: 'General Consultation',
  });

  const doctorsList = [
    { name: 'Dr. Ananya Verma', dept: 'Neurology' },
    { name: 'Dr. Rajesh Kumar', dept: 'Cardiology' },
    { name: 'Dr. Priya Nair', dept: 'General Consultation' },
    { name: 'Dr. Vikramaditya Seth', dept: 'Orthopedics' },
    { name: 'Dr. Meera Iyer', dept: 'Pediatrics' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name' && role === 'doctor') {
      const found = doctorsList.find((d) => d.name === value);
      if (found) {
        setFormData({ ...formData, name: value, department: found.dept });
        return;
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginOrSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      try {
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user_role', role);

        const userData = {
          name: formData.name || (role === 'doctor' ? 'Dr. Ananya Verma' : 'Patient'),
          email: formData.email || (role === 'doctor' ? 'doctor@medilink.com' : 'patient@gmail.com'),
          role: role,
          department: formData.department,
        };

        localStorage.setItem('user', JSON.stringify(userData));

        if (role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/patient-portal');
        }
      } catch (err) {
        setError('Unable to reach server');
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.brandContainer}>
          <div style={styles.brandIcon}>+</div>
          <h2 style={styles.brandTitle}>MediLink <span style={{ color: '#0D9488' }}>AI</span></h2>
        </div>
        <p style={styles.subtitle}>Clinical Portal Registration</p>

        {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

        <div style={styles.roleToggle}>
          <button
            type="button"
            onClick={() => setRole('patient')}
            style={role === 'patient' ? styles.activeRoleBtn : styles.inactiveRoleBtn}
          >
            👤 Patient
          </button>
          <button
            type="button"
            onClick={() => setRole('doctor')}
            style={role === 'doctor' ? styles.activeRoleBtn : styles.inactiveRoleBtn}
          >
            🩺 Medical Professional
          </button>
        </div>

        <form onSubmit={handleLoginOrSignup} style={styles.form}>
          {role === 'doctor' ? (
            <div>
              <label style={styles.label}>SELECT DOCTOR NAME</label>
              <select
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">-- Select Your Name --</option>
                {doctorsList.map((doc, idx) => (
                  <option key={idx} value={doc.name}>
                    {doc.name} ({doc.dept})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label style={styles.label}>FULL NAME</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          )}

          <div>
            <label style={styles.label}>EMAIL ADDRESS</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={styles.label}>PASSWORD</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.passwordInput}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label style={styles.label}>PHONE NUMBER</label>
              <input
                type="text"
                name="phone"
                placeholder="10-digit number"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          {role === 'patient' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={styles.label}>AGE</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>GENDER</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>BLOOD GROUP</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    style={styles.select}
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
                <label style={styles.label}>DEPARTMENT</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option>General Consultation</option>
                  <option>Neurology</option>
                  <option>Cardiology</option>
                  <option>Orthopedics</option>
                  <option>Pediatrics</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Processing...' : role === 'doctor' ? 'Access Doctor Dashboard' : 'Register as Patient'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, sans-serif' },
  card: { backgroundColor: '#FFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '36px', width: '100%', maxWidth: '460px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' },
  brandContainer: { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '2px' },
  brandIcon: { width: '30px', height: '30px', backgroundColor: '#0F172A', color: '#FFF', borderRadius: '6px', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandTitle: { fontSize: '22px', fontWeight: '700', color: '#0F172A', margin: 0 },
  subtitle: { textAlign: 'center', color: '#64748B', fontSize: '12px', marginBottom: '20px' },
  roleToggle: { display: 'flex', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '10px', marginBottom: '20px' },
  activeRoleBtn: { flex: 1, padding: '10px', backgroundColor: '#0F172A', color: '#FFF', fontWeight: 'bold', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  inactiveRoleBtn: { flex: 1, padding: '10px', backgroundColor: 'transparent', color: '#64748B', fontWeight: '600', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  label: { fontSize: '10px', color: '#64748B', fontWeight: 'bold', display: 'block', marginBottom: '4px', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' },
  passwordWrapper: { position: 'relative', display: 'flex', alignItems: 'center', width: '100%' },
  passwordInput: { width: '100%', padding: '10px 36px 10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' },
  eyeBtn: { position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' },
  select: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#FFF' },
  submitBtn: { backgroundColor: '#0D9488', color: '#FFF', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginTop: '6px' },
  errorAlert: { backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' },
};