const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);

router.post('/registerAzienda', authController.registerAzienda);

router.post("/login", authController.login )

router.post("/userData", authController.profilo)

router.post("/uploadImage", authController.uploadImmage)

router.get("/getImage", authController.getImmage)

router.post("/updateUser", authController.updateUser)

router.post('/posts/like', authController.likePost);

router.get('/posts/aziende', authController.getAllAziendaPosts)

router.get('/posts/privati', authController.getAllPrivatiPosts)

router.get('/posts/profilo', authController.getPostsByProfile);

router.post('/posts/uploadImage', authController.uploadImage);

router.post('/posts/create', authController.createPost);

router.get('/privati/:privatoId', authController.getPrivatoById);

router.get('/aziende/:aziendaId', authController.getAziendaById);

router.get('/posts/images', authController.getImages);

router.get('/posts/privato/:privatoId', authController.getPostsByPrivatoId); 

router.get('/posts/azienda/:aziendaId', authController.getPostsByAziendaId);

router.delete('/posts/:postType/:postId', authController.deletePost);


module.exports = router;