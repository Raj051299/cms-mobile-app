// src/utils/useUser.js
//saparate component to check user is admin or not

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await AsyncStorage.getItem('user');
      if (data) {
        const parsed = JSON.parse(data);
        setUser(parsed);
        setIsAdmin(parsed?.isAdmin || false);
      }
    };
    fetchUser();
  }, []);

  return { user, isAdmin };
};
