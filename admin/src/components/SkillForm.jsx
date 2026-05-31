import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SkillForm({ skillToEdit, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    techStack: '',
    description: '',
    icon: ''
  });

  useEffect(() => {
    if (skillToEdit) {
      setFormData({
        title: skillToEdit.title || '',
        techStack: skillToEdit.techStack || '',
        description: skillToEdit.description || '',
        icon: skillToEdit.icon || ''
      });
    }
  }, [skillToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      if (skillToEdit) {
        await axios.put(`http://localhost:5000/api/admin/skills/${skillToEdit._id}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/admin/skills', formData, config);
      }
      onSuccess();
    } catch (err) {
      alert('Error saving skill');
      console.error(err);
    }
  };

  return (
    <div className="form-card">
      <h3>{skillToEdit ? 'Edit Skill Card' : 'Add New Skill Card'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Card Title (e.g. Real-time & DevOps)</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Tech Stack / Subtitle (e.g. WEBSOCKETS / GIT / DOCKER)</label>
          <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" />
        </div>
        <div className="form-group">
          <label>Icon Name (lucide-react icon name e.g. Activity, Database, Server)</label>
          <input type="text" name="icon" value={formData.icon} onChange={handleChange} required />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save Skill Card</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
