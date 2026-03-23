import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const PreviewContext = createContext(null);

export const PreviewProvider = ({ children }) => {
  const { user } = useAuth();
  const [profilePreview, setProfilePreview] = useState({});
  const [linksPreview, setLinksPreview] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (user) {
      setProfilePreview(user);
      setIsSyncing(true);
      api.get('/links')
        .then(res => setLinksPreview(res.data))
        .catch(console.error)
        .finally(() => setIsSyncing(false));
    }
  }, [user]);

  return (
    <PreviewContext.Provider value={{ 
      profilePreview, 
      setProfilePreview, 
      linksPreview, 
      setLinksPreview,
      isSyncing 
    }}>
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => useContext(PreviewContext);
