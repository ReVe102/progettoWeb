import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Share from './share/Share';
import PostLogin from './PostLogin';
import Notifications from './Notifications';
import './Profilo.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit} from '@fortawesome/free-solid-svg-icons';
import QRCode from 'qrcode.react';

import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');


const Profilo = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paragrafo, setParagrafo] = useState('panoramica');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = window.localStorage.getItem('token');
        if (!token) {
          throw new Error('Token non trovato');
        }

        const userDataResponse = await axios.post('http://localhost:3000/userData', { token });
        if (userDataResponse.data.status === 'error' && userDataResponse.data.data === 'token expired') {
          alert('Token scaduto. Effettua il login.');
          window.localStorage.clear();
          navigate('/Login');
        } else {
          setUserData(userDataResponse.data.data);
          window.localStorage.setItem('userData', JSON.stringify(userDataResponse.data.data));

          const postsResponse = await axios.get('http://localhost:3000/posts/profilo', {
            headers: {
              Authorization: token
            }
          });

          const sortedPosts = postsResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setUserPosts(sortedPosts);
        }
        setLoading(false);
      } catch (error) {
        console.error('Errore nel recuperare i dati dell\'utente', error);
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:3000/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Errore nel recuperare le notifiche', error);
      }
    };

    fetchUserData();
    fetchNotifications();

    socket.on('notification', (data) => {
      setNotifications((prevNotifications) => [...prevNotifications, data]);
      alert(`Nuova notifica: ${data.message}`);
    });

    return () => {
      socket.off('notification');
    };
  }, [navigate]);

  useEffect(() => {
    if (userData) {
      socket.emit('join', userData._id);
    }
  }, [userData]);

  const logout = () => {
    window.localStorage.clear();
    navigate('/Login');
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Dati utente non disponibili.</div>;
  }
  const whatsappLink = `https://wa.me/${userData.cellulare||userData.telefono}`;


  return (
    <div className="container">
      <div className="buttons">
        <div className="left-buttons">
          <Link to="/feedAziende" className="navbarButton">Business Area</Link>
          <Link to="/feedPrivati" className="navbarButton">Employee Area</Link>
          {userData.status === "azienda" && (
          <button className="navbarButton" type="submit" onClick={handleNotificationsClick}>
            Notifiche 
          </button>
        )}
        </div>
        <div className="right-button">
          <button className="navbarButton" onClick={logout}>Logout</button>
        </div>
      </div>
      <div className="header">
        <img src={userData.image || "/default-pfp-1.jpg"} alt="Profile" />
        <div className="nomeutente">
          <h1>{userData.name}</h1>
          <br />
        </div>
        
        <br />
      </div>

      <div className='info-notifiche'>
        {userData.status === "privato" && (
          <div className="footer">
            <div className="leftbar">
              <div className="titoloLeftbar">
                <h2>Informazioni <FontAwesomeIcon id="iconamodifica" icon={faEdit} onClick={() => navigate("/updateUser", { state: userData })} /></h2>
              </div>
              <div className="formsx">
                <button onClick={() => setParagrafo("panoramica")}>Panoramica</button>
                <button onClick={() => setParagrafo("lavoro")}>Lavoro</button>
                <button onClick={() => setParagrafo("istruzione")}>Istruzione</button>
                <button onClick={() => setParagrafo("certificazioni")}>Certificazioni</button>
                <button onClick={() => setParagrafo("informazioni di contatto")}>Informazioni di contatto</button>
              </div>
            </div>
            <div className="vertical-line"></div>
            <div className="paragrafo">
              <h2>{paragrafo}</h2>
              <div className="testo">
                {paragrafo === "panoramica" && (
                  <ul>
                    <li><b>{userData.impiego}</b></li>
                    <li>Vive a: {userData.luogoresidenza}</li>
                    <li>Nato a: {userData.luogonascita}</li>
                    <li>Posizione lavorativa ricercata: {userData.posizionelavorativaricercata}</li>
                  </ul>
                )}
                {paragrafo === "lavoro" && (
                  <ul>
                    <li>Esperienza lavorativa più recente: {userData.ultimolavoro}</li>
                    <li>Esperienze lavorative precedenti: {userData.lavoriprecedenti}</li>
                  </ul>
                )}
                {paragrafo === "istruzione" && (
                  <ul>
                    <li>Scuola secondaria: {userData.indirizzosuperiore}</li>
                    {userData.corsodilaurea && <li>Università: {userData.corsodilaurea}</li>}
                  </ul>
                )}
                {paragrafo === "certificazioni" && (
                  <ul>
                    <li>Lingua madre: {userData.linguamadre}</li>
                    <li>Altre lingue: {userData.altrelingue}</li>
                    {userData.certificazionilinguistiche && <li>Certificazioni linguistiche: {userData.certificazionilinguistiche}</li>}
                    {userData.certificazioniinformatiche && <li>Certificazioni informatiche: {userData.certificazioniinformatiche}</li>}
                  </ul>
                )}
                {paragrafo === "informazioni di contatto" && (
                  <ul>
                    <li>Email: {userData.email}</li>
                    <li>Cellulare: {userData.cellulare}</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
        {userData.status === "azienda" && (
          <div className="footer">
            <div className="leftbar">
              <div className="titoloLeftbar">
                <h2>Informazioni</h2>
                <FontAwesomeIcon icon={faEdit} onClick={() => navigate("/updateUser", { state: userData })} />
              </div>
              <div className="formsx">
                <button onClick={() => setParagrafo("panoramica")}>Panoramica</button>
                <button onClick={() => setParagrafo("profilo aziendale")}>Profilo Aziendale</button>
                <button onClick={() => setParagrafo("dettagli organizzativi")}>Dettagli organizzativi</button>
                <button onClick={() => setParagrafo("contatti e sedi")}>Contatti e sedi</button>
              </div>
            </div>
            <div className="vertical-line"></div>
            <div className="paragrafo">
              <h2>{paragrafo}</h2>
              <div className="testo">
                {paragrafo === "panoramica" && (
                  <ul>
                    <li>Nome azienda: {userData.name}</li>
                    <li>Sede legale: {userData.sedelegale}</li>
                    <li>Fondata da: {userData.fondatori}</li>
                    <li>Premi: {userData.premi}</li>
                    <li>Sito web: {userData.sitoweb}</li>
                  </ul>
                )}
                {paragrafo === "profilo aziendale" && (
                  <ul>
                    <li>Descrizione: {userData.descrizione}</li>
                    <li>Target: {userData.clienteladiriferimento}</li>
                    <li>Numero dipendenti: {userData.numerodipendenti}</li>
                    <li>Fatturato annuale: {userData.fatturatoannuale}</li>
                    <li>Mercati: {userData.mercati}</li>
                  </ul>
                )}
                {paragrafo === "dettagli organizzativi" && (
                  <ul>
                    <li>Settore: {userData.settore}</li>
                    <li>Fondatori: {userData.fondatori}</li>
                    <li>CEO: {userData.ceo}</li>
                    <li>Struttura societaria: {userData.strutturasocietaria}</li>
                    <li>Certificazioni: {userData.certificazioni}</li>
                    <li>Premi: {userData.premi}</li>
                  </ul>
                )}
                {paragrafo === "contatti e sedi" && (
                  <ul>
                    <li>Sede legale: {userData.sedelegale}</li>
                    <li>Sedi operative: {userData.sedioperative}</li>
                    <li>Telefono: {userData.telefono}</li>
                    <li>Email: {userData.email}</li>
                    <li>Sito web: {userData.sitoweb}</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="notifications">
          <div className='notifichefissato'>
            <h2>Contattami su Whatsapp </h2>
            <hr/>
          </div>
          <div className='notifichescorrere'>
            <QRCode value={whatsappLink} size={200} />
          </div>
        </div>
      </div>
      <div className="mainbar">
        <Share />
      </div>
      <div>
        {userPosts.map((post) => (
          <PostLogin key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Profilo;
