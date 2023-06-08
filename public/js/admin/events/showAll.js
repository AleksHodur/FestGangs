$(document).ready(async function(){

    await showEvents();
});

async function showEvents(){
    $.get('/event', async function(data, status){
        let divEvents = $('#events');
        let events = data;

        events.forEach(evento => {
            /**
             * Creando el contenedor donde estará la información del evento
             */
            let newEvent = $('<div></div>');
            $(newEvent).attr('class', 'row');

            /**
             * Creando la columna donde se almacenará la imagen del evento
             * Se le añade un img cuyo origen se identifica por la el id del evento
             * Al img se le añaden las clases img-fluid, para que sea una imagen fluida,
             * y img-thumbnail para añadirle marco
             */
            let imageCol = $('<div></div>');
            $(imageCol).attr('class', 'col-2');
            $(newEvent).append(imageCol);
            let image = $('<img>');
            $(image).attr('src', '/eventFiles/' + evento.id + '/cover.jpg');
            $(image).attr('alt', evento.title);
            $(image).attr('class', 'img-fluid img-thumbnail');
            $(imageCol).append(image);


            /**
             * Creando la columna que almacenará el texto del evento
             */
            let textCol = $('<div></div>');
            $(textCol).attr('class', 'col-6');
            $(newEvent).append(textCol);

            /** Título del evento */
            let title = $('<h1></h1>');
            $(title).text(evento.title);
            $(textCol).append(title);

            /**
             * Ubicación del evento
             * Se le añaden las clases d-inline-block y text-truncate
             * más un ancho máximo para que se corte el texto si se supera el máximo
             */
            let location = $('<span></span>');
            $(location).text(evento.location + ', ' + evento.city + ', ' + evento.country);
            $(location).css('max-width', '40%');
            $(location).attr('class', 'text-secondary ml-3 location d-inline-block text-truncate');
            $(title).append(location);

            /**
             * Contenedor que contiene los datos del evento
             * Dentro de la columna del texto
             */
            let datosEvento = $('<div></div>');
            $(datosEvento).attr('class', 'd-flex mt-3');
            $(textCol).append(datosEvento);

            /** Artistas */
            let artist = $('<p><b>Artista(s)</b>: ' + evento.artist + '</p>');
            $(artist).css('max-width', '50%');
            $(datosEvento).append(artist);
            
            /**
             * Fecha del evento. Se le da formato con la función getZero()
             */
            let fechaFormato = new Date(evento.date);
            let textoFecha ='<b>Fecha</b>: ' + getZero(fechaFormato.getDate()) +
            '/' + getZero(fechaFormato.getMonth() + 1) + '/' + fechaFormato.getFullYear();
            let date = $('<p>' + textoFecha + '</p>');
            $(date).attr('class', 'ml-3')
            $(datosEvento).append(date);

            $(divEvents).append(newEvent);
            $(divEvents).append('<hr>');

            let crudCol = $('<div></div>');
            $(crudCol).attr('class', 'col mt-3');
            $(newEvent).append(crudCol);

            let updateButton = $('<button></button>');
            $(updateButton).attr('class', 'btn btn-success updateWindow');
            $(updateButton).val(evento.id);
            $(updateButton).text('Editar');
            $(crudCol).append(updateButton);

            let deleteButton = $('<button></button>');
            $(deleteButton).attr('class', 'btn btn-danger ml-3 deleteWindow');
            $(deleteButton).val(evento.id);
            $(deleteButton).text('Eliminar');
            $(crudCol).append(deleteButton);

            $('.updateWindow').click(async function(){

                let id = $(this).val();
        
                await showUpdateWindow(id);
            });

            $('.deleteWindow').click(async function(){

                let id = $(this).val();
        
                await showDeleteWindow(id);
            });

        });
    })
    .fail(function(){
        let error = $('<h1></h1>');
        $(error).text('No se han encontrado eventos :(');
        $(divEvents).append(error);
    });
}

function getZero(fecha){

    if(fecha < 10){
        return '0' + fecha;
    }else{
        return fecha;
    }
}

async function showUpdateWindow(id){
    let updateForm = new bootstrap.Modal(document.getElementById('updateModal'));
    updateForm.show();

    $.get('/event/json/' + id, async function(data, status){

        const evento = data.evento;

        $('#titleForm').val(evento.title);
        $('#artistForm').text(evento.artist);
        $('#cityForm').val(evento.city);
        $('#countryForm').val(evento.country);
        $('#locationForm').text(evento.location);
        $('#dateForm').val(evento.date);

    });

    $('#updateButton').click(async function(){

        const eventData = {
            id: id,
            title: $('#titleForm').val(),
            artist: $('#artistForm').val(),
            city: $('#cityForm').val(),
            country: $('#countryForm').val(),
            location: $('#locationForm').val(),
            date: $('#dateForm').val()
        }

        await updateEvent(eventData);
    });
}

async function showDeleteWindow(id){
    let deleteForm = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteForm.show();

    $.get('/event/json/' + id, async function(data, status){

        const evento = data.evento;
        $('#eventTitleDelete').text(evento.title);

    });

    $('#deleteButton').click(async function(){

        await deleteEvent(id);
    });
}

async function updateEvent(eventData){

    $.ajax({
        url: '/admin/event',
        type: 'PUT',
        data: eventData,
        
        success: async function(data, status){
            console.log('updated successfully');
            location.reload();
        },
        error: async function(error){
            console.error(error);

            $('#updateMessage').text(data.message);
            $('#updateMessage').attr('class', 'text-danger mt-2');
        }
    });
}

async function deleteEvent(id){

    $.ajax({
        url: '/admin/event/' + id,
        type: 'DELETE',
        
        success: async function(data, status){
            console.log('deleted successfully');
            location.reload();
        },
        error: async function(error){
            console.error(error);

            $('#deleteMessage').text('Ha ocurrido un error. Prueba otra vez más tarde');
            $('#deleteMessage').attr('class', 'text-danger mt-2');
        }
    });
}