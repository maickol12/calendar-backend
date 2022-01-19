// {
//     ok: true,
//     msg: ''
// }

const express = require('express');
const Event = require('../models/Evento');


const getEvents = async(req,res = express.response) => {
    const events = await Event.find()
                         .populate('user','name');

    return res.json({
        ok:true,
        events
    });
}


const createNewEvent = async(req,res = express.response) => {
    // Verificar que tenga evento
    const event = new Event( req.body );
    try{
        event.user = req.uid;

        const eventSaved = await event.save();
        return res.json({
            ok: true,
            event: eventSaved
        });
    }catch( error ){
        return res.status(500).json({
            ok: false,
            msg:"Hable con el admin"
        })
    }
}

const updateEvent = async(req,res = express.response) => {
    const eventId = req.params.id;
    const uid     = req.uid;
    try {
        const event = await Event.findById( eventId );
        if( !event ){
            res.status(404).json({
                ok:false,
                msg:'Evento no existe por id'
            });
        }

        if( event.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }
        const newEvent = 
        {
            ...req.body,
            user: uid,
        }

        const updatedEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new: true });

        res.json({
            ok: true,
            evento: updatedEvent
        })
    } catch (error) {
        return res.json({
            ok:false,
            msg:'Ocurrio un error, habla con el administrador'
        });
    }
}

const deleteEvent = async(req,res = express.response) => {
    const eventId   = req.params.id;
    const event     = await Event.findById( eventId );
    const uid       = req.uid;
    
    if( !event ){
        res.status(404).json({
            ok:false,
            msg:'Evento no existe por id'
        });
    }

    if( event.user.toString() !== uid){
        return res.status(401).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
    await Event.findByIdAndDelete( eventId );

    return res.json({
        ok:true
    });
}

module.exports = {
    getEvents,
    createNewEvent,
    updateEvent,
    deleteEvent
}