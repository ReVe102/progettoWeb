const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const Notification = require('./models/Notification');

dotenv.config(); // Carica le variabili d'ambiente dal file .env

app.use(cors());
app.use(express.json());
app.use('/', authRoutes);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Utilizza la variabile di ambiente PORT o default a 3000
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    console.log('Un utente si è connesso:', socket.id);

    socket.on('disconnect', () => {
        console.log('Un utente si è disconnesso:', socket.id);
    });

    socket.on('interested', async (data) => {
        const { senderName, senderId, receiverId } = data;
        const notification = new Notification({
            message: `L'utente ${senderName} è interessato/a alla vostra azienda`,
            receiverId,
            senderName,
            senderId
        });
        await notification.save();

        io.to(receiverId).emit('notification', notification); // Invia la notifica al destinatario specifico
    });

    socket.on('join', (userId) => {
        socket.join(userId); // Unisciti alla stanza corrispondente all'ID utente
    });
});

// Rotta di prova per la root
app.get('/', (req, res) => {
    res.send('Server in esecuzione');
});

app.get('/notifications/:userId', async (req, res) => {
    const { userId } = req.params;
    const notifications = await Notification.find({ receiverId: userId });
    res.json(notifications);
});

const connessioneDb = async () => {
    try {
        await mongoose.connect(process.env.DBURI);
        console.log("Connessione al DB riuscita");
    } catch (err) {
        console.error("Errore nella connessione al DB", err);
    }
};

server.listen(port, () => {
    console.log(`Server in esecuzione sulla porta ${port}`);
    connessioneDb();
});
