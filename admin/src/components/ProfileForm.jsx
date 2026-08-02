import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProfileForm() {
  const [aboutText, setAboutText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.DEV ? 'http://localhost:5000' : 'https://manav-s-portfolio-63db.vercel.app'}/api/public/profile`);
      if (res.data && res.data.aboutText) {
        setAboutText(res.data.aboutText);
      }
    } catch (err) {
      console.error('Error fetching profile', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('adminToken');
      
      const formData = new FormData();
      formData.append('aboutText', aboutText);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      await axios.put(`${import.meta.env.DEV ? 'http://localhost:5000' : 'https://manav-s-portfolio-63db.vercel.app'}/api/admin/profile`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Profile saved successfully!');
      setTimeout(() => setMessage(''), 3000);
      setResumeFile(null); // Clear file after successful upload
    } catch (err) {
      console.error('Error saving profile', err);
      setMessage('Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="form-container">
      <h3>Edit About Me</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>About Me / Intro Text</label>
          <textarea 
            value={aboutText} 
            onChange={(e) => setAboutText(e.target.value)} 
            rows="5"
            placeholder="A passionate MERN stack developer crafting bold and memorable projects."
            required 
          />
        </div>
        <div className="form-group">
          <label>Upload Resume (PDF)</label>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={(e) => setResumeFile(e.target.files[0])} 
          />
        </div>
        <button type="submit" disabled={isSaving} className="btn-primary">
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
        {message && <p style={{ marginTop: '15px', color: message.includes('success') ? '#10b981' : '#ef4444' }}>{message}</p>}
      </form>
    </div>
  );
}
