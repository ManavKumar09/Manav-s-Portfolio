import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProjectForm({ projectToEdit, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubLink: '',
    liveLink: '',
    techStack: '',
    images: ''
  });
  const [newImages, setNewImages] = useState([null, null, null]);

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title || '',
        description: projectToEdit.description || '',
        githubLink: projectToEdit.githubLink || '',
        liveLink: projectToEdit.liveLink || '',
        techStack: projectToEdit.techStack ? projectToEdit.techStack.join(', ') : '',
        images: projectToEdit.images ? projectToEdit.images.join(', ') : ''
      });
    }
  }, [projectToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, index) => {
    const updated = [...newImages];
    updated[index] = e.target.files[0];
    setNewImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    // Create FormData for multipart submission
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('githubLink', formData.githubLink);
    data.append('liveLink', formData.liveLink);
    
    // TechStack to JSON
    const techStackArray = formData.techStack.split(',').map(item => item.trim()).filter(i => i);
    data.append('techStack', JSON.stringify(techStackArray));
    
    // Handle images (URLs vs Files)
    if (projectToEdit) {
      const existingImages = formData.images.split(',').map(item => item.trim()).filter(i => i);
      data.append('images', JSON.stringify(existingImages));
      for (let i = 0; i < 3; i++) {
        if (newImages[i]) {
          data.append('newImages', newImages[i]);
        }
      }
    } else {
      // New project, send files directly as 'images' array
      for (let i = 0; i < 3; i++) {
        if (newImages[i]) {
          data.append('images', newImages[i]);
        }
      }
    }

    try {
      if (projectToEdit) {
        await axios.put(`http://localhost:5000/api/admin/projects/${projectToEdit._id}`, data, config);
      } else {
        await axios.post('http://localhost:5000/api/admin/projects', data, config);
      }
      onSuccess();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      alert(`Error saving project: ${errorMessage}`);
      console.error(err);
    }
  };

  return (
    <div className="form-card">
      <h3>{projectToEdit ? 'Edit Project' : 'Add New Project'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" />
        </div>
        <div className="form-group">
          <label>GitHub Link</label>
          <input type="text" name="githubLink" value={formData.githubLink} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Live Link</label>
          <input type="text" name="liveLink" value={formData.liveLink} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Tech Stack (comma separated)</label>
          <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
        </div>
        {projectToEdit && (
          <div className="form-group">
            <label>Existing Image URLs (comma separated)</label>
            <input type="text" name="images" value={formData.images} onChange={handleChange} placeholder="https://link.to/image1.jpg" />
            <small style={{display: 'block', marginTop: '4px', color: '#888'}}>Delete URLs to remove existing images. To add more, use the upload fields below.</small>
          </div>
        )}
        <div className="form-group">
          <label>Image 1 (Main Left)</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 0)} />
        </div>
        <div className="form-group">
          <label>Image 2 (Top Right)</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 1)} />
        </div>
        <div className="form-group">
          <label>Image 3 (Bottom Right)</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 2)} />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save Project</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
