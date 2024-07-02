import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        image: "",
        biografia: "",
        datanascita: "",
        impiego: "",
        ultimolavoro: "",
        lavoriprecedenti: "",
        indirizzosuperiore: "",
        corsodilaurea: "",
        posizionelavorativaricercata: "",
        luogonascita: "",
        luogoresidenza: "",
        cellulare: "",
        descrizione: "",
        cienteladiriferimento: "",
        numerodipendenti: "",
        fatturatoannuale: "",
        mercati: "",
        settore: "",
        fondatori: "",
        ceo: "",
        strutturasocietaria: "",
        certificazioni: "",
        premi: "",
        sedelegale: "",
        linguamadre:"",
        altrelingue:"",
        sedioperative: "",
        telefono: "",
        sitoweb: "",
        status:"",
    });

    const [userType, setUserType] = useState("privato"); // Stato per gestire la selezione tra Azienda e Privato
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setFormData(prevState => ({
                    ...prevState,
                    image: reader.result
                }));
            };
            reader.onerror = error => {
                console.error("Error: ", error);
            };
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(userType=="privato"){
            fetch("http://localhost:3000/register", {
                method: "POST",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    ...formData,
                    userType // Aggiungi il tipo di utente nel payload della richiesta
                }),
            }).then((res) => res.json())
                .then((data) => {
                    console.log(data, "userRegister");
                    navigate("/login");
                });
        }else{
            fetch("http://localhost:3000/registerAzienda", {
                method: "POST",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    ...formData,
                    userType 
                }),
            }).then((res) => res.json())
                .then((data) => {
                    console.log(data, "aziendaRegister");
                    navigate("/login");
                });
        }
        
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUserTypeChange = (type) => {
        setUserType(type);
    };

    return (
        <div className="register">
            <div className="register-container">
                <h2>Registrati </h2>
                <div className="form-group">
                    
                    <div className="status-container">
                        <button id={userType === "azienda"?"status-no":"status-si"} type="button" onClick={() => handleUserTypeChange("privato")}>
                            Dipendente
                        </button>
                        <button id={userType === "azienda"?"status-si":"status-no"} type="button" onClick={() => handleUserTypeChange("azienda")}>
                            Azienda
                        </button>
                    </div>


                    <form onSubmit={handleSubmit} method="post">
                        <div className='inputs'>
                        <input 
                            type="text"
                            id="nome"
                            name="name"
                            className='input'
                            required
                            onChange={handleChange}
                            placeholder="Nome" 
                        />

                        <input
                            type="text"
                            id="email" 
                            name="email"
                            className='input'

                            onChange={handleChange}
                            required
                            placeholder="E-mail"
                        />

                        <input 
                            type="password"
                            id="password"
                            className='input'

                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />

                        {userType === "privato" && (
                            <>
                                <input
                                    type="text"
                                    id="biografia"
                                    className='input'

                                    name="biografia"
                                    onChange={handleChange}
                                    required
                                    placeholder="Breve biografia..."
                                />
                                <div class="input-container">
                                <input
                                    type="date"
                                    id="datanascita"
                                    className='input'

                                    name="datanascita"
                                    onChange={handleChange}
                                    required
                                    placeholder="Data di nascita"
                                />
                                <label for="datanascita" class="input-label">Data di nascita</label>
                                </div>
                                <input
                                    type="text"
                                    className='input'

                                    id="impiego"
                                    name="impiego"
                                    onChange={handleChange}
                                    required
                                    placeholder="Impiego..."
                                />

                                <input
                                    type="text"
                                    id="ultimolavoro"
                                    name="ultimolavoro"
                                    className='input'

                                    onChange={handleChange}
                                    required
                                    placeholder="Ultimo lavoro..."
                                />

                                <input
                                    type="text"
                                    id="lavoriprecedenti"
                                    name="lavoriprecedenti"
                                    onChange={handleChange}
                                    className='input'

                                    required
                                    placeholder="Lavori precedenti..."
                                />

                                <input
                                    type="text"
                                    id="indirizzosuperiore"
                                    name="indirizzosuperiore"
                                    className='input'

                                    onChange={handleChange}
                                    required
                                    placeholder="Indirizzo superiore..."
                                />
                                <input
                                    type="text"
                                    id="linguamadre"
                                    name="linguamadre"
                                    className='input'

                                    onChange={handleChange}
                                    required
                                    placeholder="Lingua madre..."
                                />
                                <input
                                    type="text"
                                    id="altrelingue"
                                    name="altrelingue"
                                    className='input'

                                    onChange={handleChange}
                                    required
                                    placeholder="Altre lingue..."
                                />

                                <input
                                    type="text"
                                    id="corsodilaurea"
                                    className='input'

                                    name="corsodilaurea"
                                    onChange={handleChange}
                                    required
                                    placeholder="Corso di laurea..."
                                />

                                <input
                                    type="text"
                                    id="posizionelavorativaricercata"
                                    className='input'

                                    name="posizionelavorativaricercata"
                                    onChange={handleChange}
                                    required
                                    placeholder="Posizione lavorativa ricercata..."
                                />

                                <input
                                    type="text"
                                    id="luogonascita"
                                    className='input'

                                    name="luogonascita"
                                    onChange={handleChange}
                                    required
                                    placeholder="Luogo di nascita..."
                                />

                                <input
                                    type="text"
                                    id="luogoresidenza"
                                    className='input'

                                    name="luogoresidenza"
                                    onChange={handleChange}
                                    required
                                    placeholder="Luogo di residenza..."
                                />

                                <input
                                    type="text"
                                    id="cellulare"
                                    className='input'

                                    name="cellulare"
                                    onChange={handleChange}
                                    required
                                    placeholder="Cellulare..."
                                />
                            </>
                        )}

                        {userType === "azienda" && (
                            <>
                                <input
                                    type="text"
                                    id="descrizione"
                                    className='input'

                                    name="descrizione"
                                    onChange={handleChange}
                                    required
                                    placeholder="Breve descrizione..."
                                />

                                <div class="input-container">
                                <input
                                    type="date"
                                    id="datanascita"
                                    className='input'

                                    name="datanascita"
                                    onChange={handleChange}
                                    required
                                    placeholder="Data di nascita"
                                />
                                <label for="datanascita" class="input-label">Data di nascita</label>
                                </div>

                                <input
                                    type="text"
                                    id="cienteladiriferimento"
                                    className='input'

                                    name="cienteladiriferimento"
                                    onChange={handleChange}
                                    required
                                    placeholder="Clientela di riferimento..."
                                />

                                <input
                                    type="text"
                                    id="numerodipendenti"
                                    name="numerodipendenti"
                                    onChange={handleChange}
                                    className='input'

                                    required
                                    placeholder="Numero di dipendenti..."
                                />

                                <input
                                    type="text"
                                    id="fatturatoannuale"
                                    className='input'

                                    name="fatturatoannuale"
                                    onChange={handleChange}
                                    required
                                    placeholder="Fatturato annuale..."
                                />

                                <input
                                    type="text"
                                    id="mercati"
                                    name="mercati"
                                    className='input'

                                    onChange={handleChange}
                                    required
                                    placeholder="Mercati..."
                                />

                                <input
                                    type="text"
                                    id="settore"
                                    name="settore"
                                    className='input'

                                    onChange={handleChange}
                                    required
                                    placeholder="Settore..."
                                />

                                <input
                                    type="text"
                                    id="fondatori"
                                    className='input'

                                    name="fondatori"
                                    onChange={handleChange}
                                    required
                                    placeholder="Fondatori..."
                                />

                                <input
                                    type="text"
                                    id="ceo"
                                    name="ceo"
                                    className='input'

                                    onChange={handleChange}
                                    required
                                    placeholder="CEO..."
                                />

                                <input
                                    type="text"
                                    id="strutturasocietaria"
                                    className='input'

                                    name="strutturasocietaria"
                                    onChange={handleChange}
                                    required
                                    placeholder="Struttura societaria..."
                                />

                                <input
                                    type="text"
                                    id="certificazioni"
                                    className='input'

                                    name="certificazioni"
                                    onChange={handleChange}
                                    required
                                    placeholder="Certificazioni..."
                                />

                                <input
                                    type="text"
                                    id="premi"
                                    name="premi"
                                    className='input'

                                    onChange={handleChange}
                                    required
                                    placeholder="Premi..."
                                />

                                <input
                                    type="text"
                                    id="luogonascita"
                                    name="luogonascita"
                                    className='input'

                                    onChange={handleChange}
                                    required
                                    placeholder="Luogo di nascita..."
                                />

                                <input
                                    type="text"
                                    className='input'

                                    id="sedelegale"
                                    name="sedelegale"
                                    onChange={handleChange}
                                    required
                                    placeholder="Sede legale..."
                                />

                                <input
                                    type="text"
                                    id="sedioperative"
                                    className='input'

                                    name="sedioperative"
                                    onChange={handleChange}
                                    required
                                    placeholder="Sedi operative..."
                                />

                                <input
                                    type="text"
                                    id="telefono"
                                    className='input'

                                    name="telefono"
                                    onChange={handleChange}
                                    required
                                    placeholder="Telefono..."
                                />

                                <input
                                    type="text"
                                    id="sitoweb"
                                    name="sitoweb"
                                    className='input'

                                    onChange={handleChange}
                                    required
                                    placeholder="Sito web..."
                                />
                            </>
                        )}

                        <input
                            className='input'

                            accept="image/*"
                            type="file"
                            onChange={handleFileChange}
                        />
                        </div>

                        <button className="pulsanteRegistrati" type="submit">Registrati</button>
                    </form>
                    <div className="domanda">Hai già un account?<a href="/login"> Accedi</a></div>
                </div>
            </div>
        </div>
    );
};

export default Register;
