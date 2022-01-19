/*
    Rutas de usuario / Auth 
    host + api/auth
 */
const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { createUser,login,renew  } = require('../controllers/auth');
const { valirdarCampos } = require('../middlewares/validar-campos');
const { validarJWT }  = require('../middlewares/validar-jwt');

router.post(
    '/new', 
    [ check('name','El nombre es obligatorio').not().isEmpty() ],
    [ check('email','El email es obligatorio').isEmail() ],
    [ check('password','El password debe tener 4 caracteres').isLength({min:4}) ],
    valirdarCampos,
    createUser
);

router.post(
    '/login',
    [ check('email','El nombre es obligatorio').not().isEmpty() ],
    [ check('password','La contraseña es obligatoria').not().isEmpty() ],
    [ valirdarCampos ],
    login);

router.get('/renew', validarJWT ,renew);


module.exports = router;