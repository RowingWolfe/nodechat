var socket = io();
socket.on('connect', () => {
    console.log('Connected.');

    socket.on('newMessage', (message) => {
        let formattedTime = moment(message.createdAt).format('h:mm a');
        console.log('newMessage: ', message);
        var li = $('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);
    $('#messages').append(li);
    });

    socket.on('newLocationMessage', (message) =>{
        let formattedTime = moment(message.createdAt).format('h:mm a');
        let li = $('<li></li>');
        let a = $('<a target="_blank">Current Location</a>');

        li.text(`${message.from} ${formattedTime}: `);
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

    var messageTextbox = $('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: $(messageTextbox).val()
    }, function(){
        $(messageTextbox).val('');
    });
});

const locationButton = $('#sendGeo');
locationButton.on('click', () =>{
    if (!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending...');

    navigator.geolocation.getCurrentPosition( (position) => {
        locationButton.removeAttr('disabled').text('Send Location');
        console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, () => {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Can not find location...');
    })
});