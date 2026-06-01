import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ExperienceForm({ expToEdit, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    duration: '',
    description: '',
    projectsCompleted: 0,
    logoUrl: '',
    certificateUrl: '',
    githubLink: ''
  });
  const [certificateFile, setCertificateFile] = useState(null);

  useEffect(() => {
    if (expToEdit) {
      setFormData({
        company: expToEdit.company || '',
        role: expToEdit.role || '',
        duration: expToEdit.duration || '',
        description: expToEdit.description || '',
        projectsCompleted: expToEdit.projectsCompleted || 0,
        logoUrl: expToEdit.logoUrl || '',
        certificateUrl: expToEdit.certificateUrl || '',
        githubLink: expToEdit.githubLink || ''
      });
    }
  }, [expToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCertificateFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const data = new FormData();
    data.append('company', formData.company);
    data.append('role', formData.role);
    data.append('duration', formData.duration);
    data.append('description', formData.description);
    data.append('projectsCompleted', formData.projectsCompleted);
    data.append('logoUrl', formData.logoUrl);
    data.append('githubLink', formData.githubLink);
    
    if (certificateFile) {
      data.append('certificate', certificateFile);
    }

    try {
      if (expToEdit) {
        await axios.put(`${import.meta.env.DEV ? 'http://localhost:5000' : 'https://manav-s-portfolio.onrender.com'}/api/admin/experience/${expToEdit._id}`, data, config);
      } else {
        await axios.post(`${import.meta.env.DEV ? 'http://localhost:5000' : 'https://manav-s-portfolio.onrender.com'}/api/admin/experience`, data, config);
      }
      onSuccess();
    } catch (err) {
      alert('Error saving experience');
      console.error(err);
    }
  };

  return (
    <div className="form-card">
      <h3>{expToEdit ? 'Edit Experience' : 'Add New Experience'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Role</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Duration</label>
          <input type="text" name="duration" value={formData.duration} onChange={handleChange} required placeholder="e.g. Jan 2023 - Present" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" />
        </div>
        <div className="form-group">
          <label>Projects Completed</label>
          <input type="number" name="projectsCompleted" value={formData.projectsCompleted} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Logo URL (optional)</label>
          <input type="text" name="logoUrl" value={formData.logoUrl} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>GitHub Link (optional)</label>
          <input type="text" name="githubLink" value={formData.githubLink} onChange={handleChange} placeholder="https://github.com/..." />
        </div>
        <div className="form-group">
          <label>Upload Certificate (optional)</label>
          {expToEdit && formData.certificateUrl && (
            <div style={{ marginBottom: '10px' }}>
              <img src={formData.certificateUrl} alt="Current Certificate" style={{ maxWidth: '150px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
          )}
          <input type="file" name="certificate" accept="image/*" onChange={handleFileChange} />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save Experience</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
