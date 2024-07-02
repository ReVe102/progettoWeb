const mongoose = require('mongoose');

const PostAziendeSchema = new mongoose.Schema(
    {
        aziendaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AziendaModel', 
        },
        desc: {
            type: String,
            max: 500,
        },
        img: {
            type: String,
        },
        likes: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('PostAziende', PostAziendeSchema);
