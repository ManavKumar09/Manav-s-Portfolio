import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProfileForm() {
  const [aboutText, setAboutText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('https://manav-s-portfolio.onrender.com/api/public/profile');
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
      await axios.put('https://manav-s-portfolio.onrender.com/api/admin/profile', { aboutText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile saved successfully!');
      setTimeout(() => setMessage(''), 3000);
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
        <button type="submit" disabled={isSaving} className="btn-primary">
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
        {message && <p style={{ marginTop: '15px', color: message.includes('success') ? '#10b981' : '#ef4444' }}>{message}</p>}
      </form>
    </div>
  );
}
