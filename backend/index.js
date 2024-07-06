// server.js
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const Notification = require('./models/Notification');

app.use(cors());
dotenv.config();
app.use(express.json());
app.use('/', authRoutes);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

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
        console.log("Errore nella connessione al DB");
    }
};

server.listen(3000, () => {
    console.log("Server in esecuzione");
    connessioneDb();
});
