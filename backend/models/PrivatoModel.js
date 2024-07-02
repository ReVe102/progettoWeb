const mongoose = require('mongoose');

const PrivatoModelSchema = new mongoose.Schema({
    
    name : String,
    email: String,
    password: String,
    biografia:String,
    datanascita: Date,

    impiego:String,
    ultimolavoro:String,
    lavoriprecedenti:String,

    indirizzosuperiore:String,
    linguamadre: String,
    altrelingue: String, 
    corsodilaurea:String,
    posizionelavorativaricercata:String,
    luogonascita:String,
    luogoresidenza:String,

    cellulare:String,

    image:String,

    status:String,


})


module.exports = mongoose.model('collezionePrivati', PrivatoModelSchema);
