var socket = io();
socket.on('connect', () => {
    console.log('Connected.');

    socket.on('newMessage', (message) => {
        console.log('newMessage: ', message);
        var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    $('#messages').append(li);
    });

    socket.on('newLocationMessage', (message) =>{
        let li = $('<li></li>');
        let a = $('<a target="_blank">Current Location</a>');

        li.text(`${message.from}: `);
        a.attr('href', message.url);
        li.append(a);
        $('#messages').append(li);
    });
});
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
socket.emit('createMessage', {
    from: 'Doooood',
    text: 'Quack.'
}, (data) => {
    console.log('Got it...', data);
    
});

$('#message-form').on('submit', (e) => {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message]').val()
    });
});

const locationButton = $('#sendGeo');
locationButton.on('click', () =>{
    if (!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }
    navigator.geolocation.getCurrentPosition( (position) => {
        console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, () => {
        alert('Can not find location...')
    })
});