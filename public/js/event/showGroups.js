$(document).ready( function(){

    let eventId = $('#eventId').text();

    $.get('/group/byEvent/' + eventId, function(data, status){
        let divGroups = $('#groups');
        let groups = data;

        groups.forEach( grupo => {
            let newGroup = $('<div></div>');
            $(newGroup).attr('class', 'row');

            let col = $('<div></div>');
            $(col).attr('class', 'col');
            $(newGroup).append(col);

            let title = $('<h1></h1>');
            //let titleText = getTitle(grupo.leader);
            //$(title).text(titleText);
            $(col).append(title);

            $.get('/user/' + grupo.leader, function(data, status){
                console.log('en title get');
                console.log(data);

                let user = data.user;

                let titleText = 'Grupo de ' + user.name;
                $(title).text(titleText);

                $.get('/user/inGroup/' + grupo.id, function(data, status){
                    console.log('en users get');
                    console.log(data);

                    let users = data.users;
            
                    let numActualUsers = users.length;
                    let numMaxUsers = grupo.max_users;
        
                    let maxUsers =$('<p><b>Límite de usuarios: </b>' +
                        numMaxUsers + '</p>');
                    $(col).append(maxUsers);
        
                    let actualUsers = $('<p><b>Usuarios actuales: </b>' + 
                        numActualUsers + '</p>');
                    $(col).append(actualUsers);
        
                    let joinButton = $('<button></button>');
                    $(joinButton).text('Unirse al grupo');
                    $(col).append(joinButton);
                    
                    if(numActualUsers < numMaxUsers){
                        $(joinButton).attr('class', 'btn btn-success');
                    }else{
                        $(joinButton).attr('class', 'btn btn-success disabled');
                    }
        
                    $(divGroups).append(newGroup);
                    $(divGroups).append('<hr>');
                })
                .fail(function(error){
                    console.log(error);
                });
            })
            .fail(function(error){
                console.log(error);
            });

/*             let numMaxUsers = grupo.max_users;
            let numActualUsers = getActualUsers(grupo.id);

            let maxUsers =$('<p><b>Límite de usuarios: </b>' +
                numMaxUsers + '</p>');
            $(newGroup).append(maxUsers);

            let actualUsers = $('<p><b>Usuarios actuales: </b>' + 
                numActualUsers + '</p>');
            $(newGroup).append(actualUsers);

            let joinButton = $('<button></button>');
            $(joinButton).text('Unirse al grupo');
            $(newGroup).append(joinButton);
            
            if(numActualUsers < numMaxUsers){
                $(joinButton).attr('class', 'btn btn-success');
            }else{
                $(joinButton).attr('class', 'btn btn-success disabled');
            }

            $(divGroups).append(newGroup); */

        });
    });
});

async function getTitle(userId){

    console.log('en title');

    $.get('/user/' + userId, function(data, status){
        console.log('en title get');
        let text = 'Grupo de ' + data.name;
        return text;
    })
    .fail(function(error){
        console.log(error);
        return 'Algo ha salido mal :(';
    });

}

async function getActualUsers(groupId){

    console.log('en users');

    $.get('/inGroup/' + groupId, function(data, status){
        console.log('en users get');

        let numUsers = data.length;
        return numUsers;
    })
    .fail(function(error){
        console.log(error);
        return 0;
    });
}