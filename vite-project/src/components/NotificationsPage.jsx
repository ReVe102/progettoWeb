import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './NotificationsPage.css';
import axios from 'axios';

const socket = io('http://localhost:3000');

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const loggedUser = JSON.parse(localStorage.getItem('userData'));
        const response = await axios.get(`http://localhost:3000/notifications/${loggedUser._id}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Errore nel recuperare le notifiche', error);
      }
    };

    fetchNotifications();

    socket.on('notification', (data) => {
      const loggedUser = JSON.parse(localStorage.getItem('userData'));
      if (data.receiverId === loggedUser._id) {
        setNotifications((prevNotifications) => [...prevNotifications, data]);
        alert(`Nuova notifica: ${data.message}`);
      }
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('userData'));
    if (loggedUser) {
      socket.emit('join', loggedUser._id);
    }
  }, []);

  return (
    <div className="notifications-page">
      <h2>Centro Notifiche</h2>
      <div className="notifications-container">
        {notifications.length === 0 ? (
          <p>Nessuna notifica.</p>
        ) : (
          <ul className="notifications-list">
            {notifications.map((notification, index) => (
              <li key={index} className="notification-item">
                {notification.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
