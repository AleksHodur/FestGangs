const groupDAO = require('../dao/groupDAO');
const eventDAO =require('../dao/eventDAO');
const userDAO = require('../dao/userDAO');

const group_new = async (request, response) => {

    const {event_id, leader, max_users} = request.body;

    try{
        let group = await groupDAO.getByEventAndLeader(event_id, leader);

        if(group == null){

            try{
                group = await groupDAO.newGroup(event_id, leader, max_users);

                if(group){
                    response.status(201).json({message: 'Grupo creado con éxito', success: true, group});
                }else{
                    response.status(200).json({message: 'No se ha podido crear el grupo :(', success: false});
                }

            }catch(error){
                console.error(error);
                response.status(200).json({message: 'No se ha podido crear el grupo :(', success: false});
            }

        }else{
            response.status(200).json({message: 'Ya existe un grupo con este lead para este evento', success: false});
        }
    }catch(error){
        console.error(error);
        response.status(200).json({message: 'No se ha podido crear el grupo :(', success: false});

    }
}

const groups_by_event = async (request, response) => {

    let groups = await groupDAO.getByEvent(request.params.id);

    if(groups != null){
        response.status(200).json(groups);
    }else{
        response.status(500).json({message: 'No hay grupos'});
    }
}

const group_show_my = (request, response) => {

    if(request.session.user){
        response.status(200).render('group/myGroups', {title: 'Mis grupos'});
    }else{
        response.redirect('/');
    }
}

const group_json_my = async (request, response) => {

    const user = request.session.user;
    const leadGroups = await groupDAO.getByLeader(user.id);
    const participantGroups = await groupDAO.getByParticipant(user.id);

    console.log('this is participantGroups in the back CONTROLLER');
    console.log(participantGroups);

    if(user && leadGroups && participantGroups){
        response.status(200).json({leadGroups, participantGroups});
    }else{
        response.status(500).render('error/500', {title: 'Error 500'});
    }
    
}

const group_by_id = async (request, response) => {

    if(request.session.user){
        const group_id = request.params.id;

        const group = await groupDAO.getById(group_id);
        const leader = await userDAO.getById(group.leader);

        response.status(200).render('group/groupPage', {title: 'Grupo de ' + leader.name, group_id, leader});
        
    }else{
        response.redirect('/');
    }
}

const group_add_user = async (request, response) => {

    const {user_id, group_id} = request.body;
    const userGroup = await groupDAO.addUser(user_id, group_id);

    if(userGroup){
        response.status(200).json({message: 'Añadido al grupo'});
    }else{
        response.status(400).json({message: 'Fallo en el controlador al añadir usuario al grupo'});
    }
}

module.exports = {
    group_new,
    groups_by_event,
    group_show_my,
    group_json_my,
    group_by_id,
    group_add_user
};