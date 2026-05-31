import { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectForm from '../components/ProjectForm';
import ExperienceForm from '../components/ExperienceForm';
import SkillForm from '../components/SkillForm';
import ProfileForm from '../components/ProfileForm';
import './AdminStyles.css';

export default function Dashboard({ setAuth }) {
  const [activeTab, setActiveTab] = useState('projects');
  
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  
  const [showExpForm, setShowExpForm] = useState(false);
  const [expToEdit, setExpToEdit] = useState(null);

  const [showSkillForm, setShowSkillForm] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState(null);

  const fetchData = async () => {
    try {
      const [projRes, expRes, skillRes] = await Promise.all([
        axios.get('http://localhost:5000/api/public/projects'),
        axios.get('http://localhost:5000/api/public/experience'),
        axios.get('http://localhost:5000/api/public/skills')
      ]);
      setProjects(projRes.data);
      setExperience(expRes.data);
      setSkills(skillRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAuth(false);
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Error deleting project');
    }
  };

  const deleteExperience = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/admin/experience/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Error deleting experience');
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill card?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/admin/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Error deleting skill');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Portfolio Admin Dashboard</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Manage Projects
        </button>
        <button 
          className={`tab ${activeTab === 'experience' ? 'active' : ''}`}
          onClick={() => setActiveTab('experience')}
        >
          Manage Experience
        </button>
        <button 
          className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          Manage Skills
        </button>
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          About Me & Profile
        </button>
      </div>

      <div className="dashboard-content">
        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div>
            <div className="content-header">
              <h2>Projects</h2>
              {!showProjectForm && (
                <button className="btn btn-primary" onClick={() => { setProjectToEdit(null); setShowProjectForm(true); }}>
                  + Add Project
                </button>
              )}
            </div>
            
            {showProjectForm ? (
              <ProjectForm 
                projectToEdit={projectToEdit} 
                onSuccess={() => { setShowProjectForm(false); fetchData(); }} 
                onCancel={() => setShowProjectForm(false)} 
              />
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Tech Stack</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(p => (
                      <tr key={p._id}>
                        <td>{p.title}</td>
                        <td>{p.techStack?.join(', ')}</td>
                        <td className="actions-cell">
                          <button className="btn-sm edit" onClick={() => { setProjectToEdit(p); setShowProjectForm(true); }}>Edit</button>
                          <button className="btn-sm delete" onClick={() => deleteProject(p._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && <tr><td colSpan="3" style={{textAlign: 'center'}}>No projects found. Add one!</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === 'experience' && (
          <div>
            <div className="content-header">
              <h2>Work Experience</h2>
              {!showExpForm && (
                <button className="btn btn-primary" onClick={() => { setExpToEdit(null); setShowExpForm(true); }}>
                  + Add Experience
                </button>
              )}
            </div>
            
            {showExpForm ? (
              <ExperienceForm 
                expToEdit={expToEdit} 
                onSuccess={() => { setShowExpForm(false); fetchData(); }} 
                onCancel={() => setShowExpForm(false)} 
              />
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experience.map(e => (
                      <tr key={e._id}>
                        <td>{e.company}</td>
                        <td>{e.role}</td>
                        <td>{e.duration}</td>
                        <td className="actions-cell">
                          <button className="btn-sm edit" onClick={() => { setExpToEdit(e); setShowExpForm(true); }}>Edit</button>
                          <button className="btn-sm delete" onClick={() => deleteExperience(e._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {experience.length === 0 && <tr><td colSpan="4" style={{textAlign: 'center'}}>No experience found. Add one!</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div>
            <div className="content-header">
              <h2>Skills & Expertise (About Section)</h2>
              {!showSkillForm && (
                <button className="btn btn-primary" onClick={() => { setSkillToEdit(null); setShowSkillForm(true); }}>
                  + Add Skill Card
                </button>
              )}
            </div>
            
            {showSkillForm ? (
              <SkillForm 
                skillToEdit={skillToEdit} 
                onSuccess={() => { setShowSkillForm(false); fetchData(); }} 
                onCancel={() => setShowSkillForm(false)} 
              />
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Card Title</th>
                      <th>Tech Stack</th>
                      <th>Icon</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map(s => (
                      <tr key={s._id}>
                        <td>{s.title}</td>
                        <td>{s.techStack}</td>
                        <td>{s.icon}</td>
                        <td className="actions-cell">
                          <button className="btn-sm edit" onClick={() => { setSkillToEdit(s); setShowSkillForm(true); }}>Edit</button>
                          <button className="btn-sm delete" onClick={() => deleteSkill(s._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {skills.length === 0 && <tr><td colSpan="4" style={{textAlign: 'center'}}>No skills found. Add one!</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div>
            <div className="content-header">
              <h2>Profile Settings</h2>
            </div>
            <ProfileForm />
          </div>
        )}

      </div>
    </div>
  );
}
