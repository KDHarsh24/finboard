import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { apiCache } from '@/lib/apiCache';

export const useDataFetcher = (config) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!config || !config.url) return;

    const fetchData = async () => {
      // Check cache first for REST
      if (config.type === 'rest') {
        const cached = apiCache.get(config.url);
        if (cached) {
          setData(cached);
          return;
        }
      }

      setLoading(true);
      try {
        // Use proxy for external URLs to bypass CORS
        const isExternal = config.url.startsWith('http');
        const response = await axios({
          method: isExternal ? 'POST' : (config.method || 'GET'),
          url: isExternal ? '/api/proxy' : config.url,
          data: isExternal ? {
            url: config.url,
            method: config.method || 'GET',
            body: config.body
          } : config.body,
        });
        
        setData(response.data);
        if (config.type === 'rest') {
          apiCache.set(config.url, response.data, config.cacheTTL);
        }
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (config.type === 'rest') {
      fetchData();
      if (config.interval > 0) {
        const intervalId = setInterval(fetchData, config.interval);
        return () => clearInterval(intervalId);
      }
    } else if (config.type === 'socket') {
      // Socket implementation
      socketRef.current = io(config.url);
      
      socketRef.current.on('connect', () => {
        console.log('Connected to socket');
      });

      socketRef.current.on('message', (newData) => { // Default event 'message', can be configurable
        setData(newData);
      });
      
      socketRef.current.on('error', (err) => {
        setError(err.message);
      });

      return () => {
        if (socketRef.current) socketRef.current.disconnect();
      };
    }
  }, [config.url, config.type, config.interval, config.method, JSON.stringify(config.body)]);

  return { data, loading, error };
};
