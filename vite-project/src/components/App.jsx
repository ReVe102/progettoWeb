import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import ProfiloUtente from './ProfiloUtente';
import Profilo from './Profilo';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import UpdateUser from './updateUser';
import HomeComp from './homeComp/HomeComp';
import HomeEmp from './homeEmp/HomeEmp';
import NotificationsPage from './NotificationsPage';


const socket = io('http://localhost:3000');

const App = () => {
  useEffect(() => {
    socket.on('notification', (data) => {
      console.log(data.message);
      // Gestisci la visualizzazione delle notifiche
    });
  }, []);

  const isLoggedIn = window.localStorage.getItem("loggedIn");

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:name" element={<Profilo />} />
          <Route path="/privato/:privatoId" element={<ProfiloUtente />} />
          <Route path="/azienda/:aziendaId" element={<ProfiloUtente />} />
          <Route path="/profilo" element={<Profilo />} />
          <Route path="/updateUser" element={<UpdateUser />} />
          <Route path="/feedAziende" element={<HomeComp />} />
          <Route path="/feedPrivati" element={<HomeEmp />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
