/*
    Rutas de usuario Events 
    host + api/events
 */
const { Router } = require('express');
const router = Router();
const { validarJWT }  = require('../middlewares/validar-jwt');
const { getEvents,createNewEvent,updateEvent,deleteEvent } = require('../controllers/events');
const { check } = require('express-validator');
const { valirdarCampos } = require('../middlewares/validar-campos');
const isDate = require('../helpers/isDate');

//Todas tienen que pasar por la validacion del JWT
router.use( validarJWT );

//Obtener todos los eventos
router.get('/', getEvents);

//Crear un nuevo evento
router.post(
            '/', 
            [  
                check('title','El titulo es obligatorio').not().isEmpty(),
                check('start','La fecha inicio es obligatoria').custom( isDate ),
                check('end','La fecha fin es obligatoria').custom( isDate ),
            ], 
            valirdarCampos,
            createNewEvent
        );


//Actualizar un nuevo evento
router.put(
            '/:id', 
            [  
                check('title','El titulo es obligatorio').not().isEmpty(),
                check('start','La fecha inicio es obligatoria').custom( isDate ),
                check('end','La fecha fin es obligatoria').custom( isDate ),
            ], 
            valirdarCampos,
            updateEvent);

//Eliminar evento
router.delete('/:id', deleteEvent)



module.exports = router;