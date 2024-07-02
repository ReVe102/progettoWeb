const mongoose = require('mongoose');

const AziendaModelSchema = new mongoose.Schema({
    name : String,
    email: String,
    password: String,

    descrizione:String, //breve descr di storia, missione, visione, valori aziendali
    datanascita: Date,
    cienteladiriferimento:String,
    numerodipendenti:String,
    fatturatoannuale:String,
    mercati:String, //mercati geografici in cui lazienda opera

    settore:String,
    fondatori:String,
    ceo:String,
    strutturasocietaria:String,
    certificazioni:String,  //certif qualita
    premi:String,

    luogonascita:String,
    sedelegale:String,
    sedioperative:String,

    telefono:String,
    sitoweb:String,

    image:String,
    
    status:String,

})


module.exports = mongoose.model('collezioneAziende', AziendaModelSchema);
