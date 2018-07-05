
var socket = io();
const scrollToBottom = () =>{
    //Selectors
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');
    //Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        //Should scroll to bottom.
        messages.scrollTop(scrollHeight);
    }

}

socket.on('connect', () => {
    console.log('Connected.');
    var params = $.deparam(window.location.search);

    socket.emit('join', params, (err) => {
        if (err){
            //Shit broke.
            alert(err);
            window.location.href = '/';
        }else{
            console.log('No error.');
        }
    })

    socket.on('newMessage', (message) => {
        var template = $('#message-template').html();
        let formattedTime = moment(message.createdAt).format('h:mm a');
        var html = Mustache.render(template,{
            text: message.text,
            from: message.from,
            createdAt: formattedTime
        });

        $('#messages').append(html);
        scrollToBottom();
    });

    socket.on('newLocationMessage', (message) =>{
        let formattedTime = moment(message.createdAt).format('h:mm a');
        let template = $('#location-message-template').html();
        let html = Mustache.render(template, {
            from: message.from,
            url: message.url,
            createdAt: formattedTime
        });

        $('#messages').append(html);
        scrollToBottom();
    });
});
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
socket.emit('createMessage', {}, (data) => {
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