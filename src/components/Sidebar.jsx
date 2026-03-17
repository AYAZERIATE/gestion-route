import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NavLink , useNavigate  } from 'react-router-dom';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           
    navigate('/login'); 
  };
  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#1e3a8a',
      borderRight: '1px solid rgba(255,255,255,0.14)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.14)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>CNER Dashboard</h2>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.78)' }}>Financial Management</p>
      </div>
      
      <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink to="/dashboard" style={({isActive}) => ({
          padding: '0.8rem 1rem', borderRadius: '8px', textDecoration: 'none',
          color: isActive ? '#fff' : 'rgba(255,255,255,0.9)',
          backgroundColor: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
          fontWeight: isActive ? 600 : 500,
          transition: 'all 0.2s'
        })}>Tableau de bord</NavLink>
        
        <NavLink to="/gestion-marche" style={({isActive}) => ({
          padding: '0.8rem 1rem', borderRadius: '8px', textDecoration: 'none',
          color: isActive ? '#fff' : 'rgba(255,255,255,0.9)',
          backgroundColor: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
          fontWeight: isActive ? 600 : 500,
          transition: 'all 0.2s'
        })}>Gestion Marché</NavLink>
        
        <NavLink to="/gestion-loi-finance" style={({isActive}) => ({
          padding: '0.8rem 1rem', borderRadius: '8px', textDecoration: 'none',
          color: isActive ? '#fff' : 'rgba(255,255,255,0.9)',
          backgroundColor: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
          fontWeight: isActive ? 600 : 500,
          transition: 'all 0.2s'
        })}>Gestion Loi de Finance</NavLink>

        <NavLink to="/schedule" style={({isActive}) => ({
          padding: '0.8rem 1rem', borderRadius: '8px', textDecoration: 'none',
          color: isActive ? '#fff' : 'rgba(255,255,255,0.9)',
          backgroundColor: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
          fontWeight: isActive ? 600 : 500,
          transition: 'all 0.2s'
        })}>Agenda / Planning</NavLink>
      </nav>
      
      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.14)' }}>
        <button  onClick={handleLogout} 
         style={{
          width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--danger-color, #ef4444)',
          backgroundColor: 'transparent', color: 'var(--danger-color, #ef4444)', fontWeight: 600, cursor: 'pointer'
        }}>Déconnexion</button>
      </div>
    </aside>
  );
};

export default Sidebar;
