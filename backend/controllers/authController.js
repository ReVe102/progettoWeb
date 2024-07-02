const PrivatoModel = require('../models/PrivatoModel');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const AziendaModel = require('../models/AziendaModel');
const PostAziende=require('../models/PostAziende')
const PostPrivati=require('../models/PostPrivati')
const mongoose=require('mongoose');

exports.register=async (req, res)=>{
    
    const{name,email,password,image, linguamadre, altrelingue, datanascita, luogo, biografia, impiego, ultimolavoro, lavoriprecedenti,indirizzosuperiore,corsodilaurea,posizionelavorativaricercata,luogonascita,luogoresidenza,cellulare }=req.body;
    const status="privato"

    const salt= await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try{
        const existingUser = await PrivatoModel.findOne({ email });

        if (!email || !password) { //verifica se l'email o la password sono mancanti.
        return res.json("mancaqualcosa");
        }else{
            if(existingUser) {  //se mail gia usata
            return res.json('esistegia');
            }else{
                // salva i dati in users
                const newuser = new PrivatoModel({ name:name, email:email, image:image, password:hashedPassword, luogo:luogo, status:status,
                                                datanascita:datanascita,biografia:biografia,impiego: impiego, ultimolavoro: ultimolavoro, 
                                                lavoriprecedenti: lavoriprecedenti, indirizzosuperiore: indirizzosuperiore, corsodilaurea: corsodilaurea, posizionelavorativaricercata: posizionelavorativaricercata, 
                                                luogonascita: luogonascita, linguamadre:linguamadre,altrelingue:altrelingue, luogoresidenza: luogoresidenza, cellulare: cellulare});

                await newuser.save()
                res.send({status:"ok"})

            }
    

        }
    }catch(error){
        res.send({status:"error"})
    }
    
    
}

exports.registerAzienda=async (req, res)=>{
    
    const{name, email, password, image, descrizione, datanascita, cienteladiriferimento, numerodipendenti, fatturatoannuale, mercati, settore, fondatori, ceo, strutturasocietaria, certificazioni, premi, luogonascita, sedelegale, sedioperative, telefono, sitoweb}=req.body;
    const status="azienda"
    const salt= await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try{
        const existingUser = await AziendaModel.findOne({ email });

        if (!email || !password) { //se manca uno dei 2 invia errore
        return res.json("mancaqualcosa");
        }else{
            if(existingUser) {  //se mail gia usata
            return res.json('esistegia');
            }else{
                // salva i dati 
                const newuser = new AziendaModel({ name:name, email:email, image:image, password:hashedPassword, descrizione:descrizione, status:status, datanascita:datanascita, cienteladiriferimento:cienteladiriferimento, numerodipendenti:numerodipendenti, fatturatoannuale:fatturatoannuale, mercati:mercati, settore:settore, fondatori:fondatori, ceo:ceo, strutturasocietaria:strutturasocietaria, certificazioni:certificazioni, premi:premi, luogonascita:luogonascita, sedelegale:sedelegale, sedioperative:sedioperative, telefono:telefono, sitoweb:sitoweb});

                await newuser.save()
                res.send({status:"ok"})

            }
    

        }
    }catch(error){
        res.send({status:"error"})
    }
    
    
}

exports.login = async (req, res) => {
    const { email, password, status } = req.body;

    try {
        let utentepresente;

        if (status === 'privato') {
            utentepresente = await PrivatoModel.findOne({ email });
        } else {
            utentepresente = await AziendaModel.findOne({ email });
        }

        if (!utentepresente) {
            return res.json({ status: 'Email non risulta registrata' });
        }

        const confronto = await bcrypt.compare(password, utentepresente.password);
        if (!confronto) {
            return res.json({ status: 'credenziali errate' });
        }

        const token = jwt.sign({
            _id: utentepresente._id.toString(),
            email: utentepresente.email,
            status: utentepresente.status
        }, process.env.JWT_SECRET, {
            expiresIn: 86400, // 24 ore
        });

        return res.status(201).json({ status: 'ok', data: token });
    } catch (error) {
        console.error('Errore nel login:', error);
        return res.status(500).json({ status: 'error', message: 'Errore interno del server' });
    }
};

exports.profilo = async (req, res) => {
    const { token } = req.body;

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return "token expired";
            }
            return decoded;
        });

        if (user === "token expired") {
            return res.status(401).send({ status: "error", data: "token expired" });
        }

        const useremail = user.email;
        const userstatus = user.status;

        if (userstatus === "privato") {
            PrivatoModel.findOne({ email: useremail })
                .then((data) => {
                    if (!data) {
                        return res.status(404).send({ status: "error", data: "User not found" });
                    }
                    res.send({ status: "ok", data: data });
                })
                .catch((error) => {
                    console.error('Error fetching private user:', error);
                    res.status(500).send({ status: "error", data: "Internal server error" });
                });
        } else {
            AziendaModel.findOne({ email: useremail }) //cerca un documento nel modello AziendaModel con l'email dell'utente.
                .then((data) => {
                    if (!data) {
                        return res.status(404).send({ status: "error", data: "User not found" });
                    }
                    res.send({ status: "ok", data: data });
                })
                .catch((error) => {
                    console.error('Error fetching company user:', error);
                    res.status(500).send({ status: "error", data: "Internal server error" });
                });
        }
    } catch (error) {
        console.error('Error in profilo function:', error);
        res.status(500).send({ status: "error", data: "Internal server error" });
    }
};

exports.updateUser=async (req, res)=>{
    const{name,email, luogo, profilo, linguamadre, altrelingue, biografia, image, impiego, ultimolavoro, lavoriprecedenti,indirizzosuperiore,corsodilaurea,posizionelavorativaricercata,luogonascita,luogoresidenza,cellulare}=req.body;
    const{ status,descrizione, datanascita, cienteladiriferimento, numerodipendenti, fatturatoannuale, mercati, settore, fondatori, ceo, strutturasocietaria, certificazioni, premi, sedelegale, sedioperative, telefono, sitoweb}=req.body;

    try{
        if(status==="azienda"){
            await AziendaModel.updateOne({email:email},{
                $set:{
                    name: name,
                    image: image,
                    descrizione: descrizione,
                    status: status,
                    datanascita: datanascita,
                    linguamadre:linguamadre,
                    altrelingue:altrelingue,
                    cienteladiriferimento: cienteladiriferimento,
                    numerodipendenti: numerodipendenti,
                    fatturatoannuale: fatturatoannuale,
                    mercati: mercati,
                    settore: settore,
                    fondatori: fondatori,
                    ceo: ceo,
                    strutturasocietaria: strutturasocietaria,
                    certificazioni: certificazioni,
                    premi: premi,
                    luogonascita: luogonascita,
                    sedelegale: sedelegale,
                    sedioperative: sedioperative,
                    telefono: telefono,
                    sitoweb: sitoweb
                }})
            }else{
                await PrivatoModel.updateOne({email:email},{
                    $set:{
                        name:name,
                        luogo: luogo,
                        profilo: profilo,
                        biografia: biografia,
                        impiego: impiego,
                        ultimolavoro: ultimolavoro,
                        lavoriprecedenti: lavoriprecedenti,
                        indirizzosuperiore: indirizzosuperiore,
                        corsodilaurea: corsodilaurea,
                        posizionelavorativaricercata: posizionelavorativaricercata,
                        luogonascita: luogonascita,
                        luogoresidenza: luogoresidenza,
                        cellulare: cellulare,
                        image:image,
                        status:status
                    }

            })
        }

        




    return res.json({status:"ok", data:"updated"})

    }catch(error){
        return res.json({status:"error", data:"error"})

    }
}


exports.uploadImmage=async(req,res)=>{  
    const {image}=req.body;
    try{
        Images.create({image:image});     //Tenta di creare un nuovo record nel database utilizzando il modello Images con l'immagine fornita

        res.send({Status:"ok"})

    }catch(error){
        res.send({Status:"error", data:error})

    }
}

exports.getImmage=async(req,res)=>{
    try{
        await Images.find({}).then(data=>{
            res.send({status:"ok", data:data})

        })
    }catch(error){
    }
}

// Like/Dislike con token
exports.likePost = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded._id;
        } catch (ex) {
            return res.status(400).json({ error: 'Invalid token.' });
        }
        const { postId, postType } = req.body;
        const PostModel = postType === 'user' ? PostPrivati : PostAziende;   
        const post = await PostModel.findById(postId);
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } }); //metto like
            res.sendStatus(200);
        } else {
            await post.updateOne({ $pull: { likes: userId } }); //tolgo like
            res.sendStatus(200);
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// Get All Posts di aziende
exports.getAllAziendaPosts = async (req, res) => {
    try {
        const aziendaPosts = await PostAziende.aggregate([
            {
                $sort: { createdAt: -1 }  //Ordino post per data di creazione
            },
            {
                $group: {
                    _id: "$aziendaId", 
                    latestPost: { $first: "$$ROOT" }  //Raggruppa i documenti per aziendaId.Per ogni gruppo, latestPost contiene il primo documento del gruppo(più recente grazie all'ordinamento)
                }
            },
            {
                $replaceRoot: { newRoot: "$latestPost" }  //Sostituisce il documento corrente con il contenuto di latestPost.
            },
            {
                $sort: { createdAt: -1 } //Dopo aver ottenuto i post più recenti per ogni azienda, li riordiniamo per data di creazione.
            }
        ]);
        res.status(200).json(aziendaPosts);
    } catch (err) {
        console.error("Errore nel recuperare i post delle aziende", err);
        res.status(500).json(err);
    }
}

// Get All Posts di privati
exports.getAllPrivatiPosts = async (req, res) => {
    try {
        const privatiPosts = await PostPrivati.aggregate([
            {
                $sort: { createdAt: -1 } 
            },
            {
                $group: {
                    _id: "$privatoId",
                    latestPost: { $first: "$$ROOT" } 
                }
            },
            {
                $replaceRoot: { newRoot: "$latestPost" } 
            },
            {
                $sort: { createdAt: -1 } 
            }
        ]);
        res.status(200).json(privatiPosts);
    } catch (err) {
        console.error("Errore nel recuperare i post dei privati", err);
        res.status(500).json(err);
    }
}

// Get Posts by User con token
exports.getPostsByProfile = async (req, res) => {
    const token = req.headers.authorization;
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) {
            return res.status(401).json({ status: "error", data: "Invalid token" });
        }
        const userId = user._id;
        console.log('id dell utente:', userId);
        let posts;
        if (user.status === 'privato') {
            posts = await PostPrivati.find({ privatoId: userId});
        } else if (user.status === 'azienda') {
            posts = await PostAziende.find({ aziendaId: userId});
        }
        console.log('Posts trovati:', posts);
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
};

//upload immagine per il post
exports.uploadImage = async (req, res) => {
    const { base64 } = req.body;
    try {
        const imageUrl = base64; 
        res.status(200).json({ Status: "ok", imageUrl });
    } catch (error) {
        res.status(500).json({ Status: "error", error: error.message });
    }
};

// Crea un post
exports.createPost = async (req, res) => {
    const { userId, aziendaId, desc, img, postType } = req.body;
    try {
        if (postType === 'privato') {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.sendStatus(400);
            }
            const user = await PrivatoModel.findById(userId);
            if (!user) {
                return res.sendStatus(404);
            }
            const newPost = new PostPrivati({
                privatoId: userId,
                desc,
                img: img || '',
            });
            const savedPost = await newPost.save();
            res.status(200).json(savedPost);
        } else if (postType === 'azienda') {
            if (!mongoose.Types.ObjectId.isValid(aziendaId)) {
                return res.sendStatus(400);
            }
            const azienda = await AziendaModel.findById(aziendaId);
            if (!azienda) {
                return res.sendStatus(404);
            }
            const newPost = new PostAziende({
                aziendaId,
                desc,
                img: img || '',
            });
            const savedPost = await newPost.save();
            res.status(200).json(savedPost);
        } else {
            res.sendStatus(400);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

//logica per recuperare i dati di un privato dato l'ID
exports.getPrivatoById = async (req, res) => {
    try {
        const privato = await PrivatoModel.findById(req.params.privatoId);  //Questa riga tenta di trovare un documento nel database utilizzando il modello PrivatoModel e il metodo findById, che cerca un documento per ID(L'ID viene preso dai parametri della richiesta (req.params.privatoId))
        if (!privato) {
            return res.sendStatus(404);
        }
        console.log('Privato trovato:', privato); 
        res.json(privato); //Questa riga invia una risposta JSON al client contenente i dati del documento privato trovato. Utilizzare res.json è un modo comune per inviare dati strutturati in formato JSON al client.
    } catch (err) {
        res.status(500).json(err);
    }
};

//logica per recuperare i dati di un'azienda dato l'ID
exports.getAziendaById = async (req, res) => {
    try {
        const azienda = await AziendaModel.findById(req.params.aziendaId);
        if (!azienda) {
            return res.sendStatus(404);
        }
        console.log('Azienda trovata:', azienda); 
        res.json(azienda);
    } catch (err) {
        res.status(500).json(err);
    }
};

//get images per postare 
exports.getImages = async (req, res) => {
    try {
        const userImages = await PostPrivati.find({ img: { $exists: true } });
        const aziendaImages = await PostAziende.find({ img: { $exists: true } });
        const allImages = userImages.concat(aziendaImages);
        res.status(200).json(allImages);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Funzione per ottenere i post di un privato dato il loro ID
exports.getPostsByPrivatoId = async (req, res) => {
    const privatoId = req.params.privatoId;
    if (!mongoose.Types.ObjectId.isValid(privatoId)) {
        return res.sendstatus(400);
    }
    try {
        const posts = await PostPrivati.find({ privatoId: privatoId }).sort({createdAt:-1});
        if (posts.length === 0) {
            return res.sendStatus(404);
        }
        res.status(200).json(posts); //I post trovati vengono inviati al client in formato JSON
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

// Funzione per ottenere i post di un'azienda dato il loro ID
exports.getPostsByAziendaId = async (req, res) => {
    const aziendaId = req.params.aziendaId;
    if (!mongoose.Types.ObjectId.isValid(aziendaId)) {
        return res.sendStatus(400);
    }
    try {
        const posts = await PostAziende.find({ aziendaId: aziendaId }).sort({createdAt:-1});
        if (posts.length === 0) {
            return res.sendStatus(404);
        }
        res.status(200).json(posts);
    } catch (err) {
        res.sendStatus(500).json(err);
    }
};

// Funzione per eliminare un post
exports.deletePost = async (req, res) => {
    const { postId, postType } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'ID non riconosciuto' });
    }
    const PostModel = postType === 'privato' ? PostPrivati : PostAziende;
    try {
        const post = await PostModel.findByIdAndDelete(postId);
        if (!post) {
            return res.sendStatus(404);
        }
        res.status(200).json({ message: 'Post eliminato con successo' });
    } catch (err) {
        res.sendStatus(500).json(err);
    }
};