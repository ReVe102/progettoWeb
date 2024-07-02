const mongoose = require('mongoose');

const PostPrivatiSchema = new mongoose.Schema(
    {
        privatoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PrivatoModel', 
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

module.exports = mongoose.model('PostPrivati', PostPrivatiSchema);
