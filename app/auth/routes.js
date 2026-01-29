const express = require('express')
const router = express.Router()
const controller = require('./controller');

router.post('/registerUser', controller.registerUser);
router.post('/login', controller.login);
router.get('/getAllUsers', controller.getAllUsers);
router.get('/getUserById/:userId', controller.getUserById);
router.put('/setUserActive/:userId', controller.setUserActive);
router.put('/changePassword/:userId', controller.changePassword);
router.delete('/deleteUser/:userId', controller.deleteUser);

module.exports = router;