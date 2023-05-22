const groupDAO = require('../dao/groupDAO');

const group_new = async (request, response) => {

    const {event_id, leader} = request.body;

    try{
        const group = await groupDAO.getByEventAndLeader(event_id, leader);

        if(!group){

            try{
                group = await groupDAO.newGroup(event_id, leader);

                if(group){
                    response.status(201).json({message: 'Grupo creado con éxito', success: true});
                }else{
                    response.status(500).json({message: 'No se ha podido crear el grupo', success: false});
                }

            }catch(error){
                console.error(error);
                response.status(500).json({message: 'No se ha podido crear el grupo', success: false});
            }

        }else{
            response.status(500).json({message: 'Ya existe un grupo con este lead para este evento', success: false});
        }
    }catch(error){
        console.error(error);
        response.status(500).json({message: 'No se ha podido crear el grupo', success: false});

    }
}

const group_new_form = (request, response) => {
    response.render('groupForm', {title: 'Crear grupo'});
}

module.exports = {
    group_new,
    group_new_form
};