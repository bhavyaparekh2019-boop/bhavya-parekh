import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import Dock from './Dock';

export default function NavigationDock() {
  const navigate = useNavigate();

  const items = [
    { 
      icon: <VscHome size={18} />, 
      label: 'Home', 
      onClick: () => navigate('/') 
    },
    { 
      icon: <VscArchive size={18} />, 
      label: 'Insights', 
      onClick: () => navigate('/insights') 
    },
    { 
      icon: <VscAccount size={18} />, 
      label: 'Portfolio', 
      onClick: () => navigate('/portfolio') 
    },
    { 
      icon: <VscSettingsGear size={18} />, 
      label: 'Admin', 
      onClick: () => navigate('/admin') 
    },
  ];

  return (
    <Dock 
      items={items}
      panelHeight={68}
      baseItemSize={50}
      magnification={70}
    />
  );
}
