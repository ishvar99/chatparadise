var socket=io();
socket.on('connect',function(){
	console.log('connected to server!');
})
socket.on('newMessage',function(message){
   console.log(message);
   var li=$('<li></li>');
   li.text(`${message.from}:${message.text}`);
   $('#message-list').append(li);
})
socket.on('newLocationMessage',function(message){
	var li=$('<li></li>'),
	    a=$('<a target="_blank">My current Location</a>')
   li.text(`${message.from}:`);
   a.attr('href',message.url);
   li.append(a);
  $('#message-list').append(li); 
})
socket.on('disconnect',function(){
	console.log('disconnected from server!')
})
$('#message-form').on('submit',function(e){
	e.preventDefault();//to prevent page from getting refreshed
	var text=$('#message-text').val();
  socket.emit('createMessage',{
	from:'James',
	text
},function(data){
    console.log(`got it ${data}`)
})
});
var locationButton=$('#send-location');
console.log(locationButton)
locationButton.on('click',function(){
	if(!navigator.geolocation)
		return alert('Geolocation not supported by your browser!');
	navigator.geolocation.getCurrentPosition(function(position){
		var pos={
          	lat:position.coords.latitude,
          	lon:position.coords.longitude
          }
          socket.emit('createLocationMessage',pos)
	},function(){
		alert('user denied permission!')
	});
	});