const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { use } = require('express/lib/application');
const User = require('../models/User'); 
const { generarJWT } = require('../helpers/jws');

const createUser = async(req,res = express.response) => {
    const { name, email, password } = req.body;


    try{
        let user = await User.findOne({ email });
        if( user ){
            return res.status(400).json({
                ok:false,
                message:'El correo éxiste con ese usuario'
            });
        }
        user = new User( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync(1);

        user.password = bcrypt.hashSync( user.password, salt );

        await user.save();

        const token = await generarJWT(user._id,user.name);
        
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    }catch( error ){
        return res.status(500).json({error})
    }

   
}

const login = async(req,res) => {
    const { email, password } = req.body;

    try{
        let user = await User.findOne({ email });
        if( !user ){
            return res.json({
                ok:false,
                msg:'El usuario no éxiste con ese email'
            });
        }

        //Confirmar los passwords 

        const validPassword = bcrypt.compareSync( password, user.password);

        if( !validPassword ){
            return res.status(400).json({
                ok:false,
                msg:'Password incorrecto'
            })
        }

        // Generar nuestro JWT
        const token = await generarJWT(user._id,user.name);
        return res.json({
            ok:true,
            uid:user._id,
            name:user.name,
            token
        });
    }catch( error ){
        return res.status(500).json({error})
    }
} 

const renew = async(req,res) => {

    const { uid,name } = req;
    // GENERAR UN NUEVO JWT Y RETORNARLO EN ESTA PETICION
    const token = await generarJWT(uid,name);

    res.json({
        ok:true,
        msg:'renew',
        token
    })
};

module.exports = { createUser,login,renew }