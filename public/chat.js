function scrollToBottom()
{
	var d=$('.chat__area');
	var clientHeight= d.prop('clientHeight');
	var scrollHeight=d.prop('scrollHeight');
	var scrollTop=d.prop('scrollTop');
	var newMessage=$('#message-list').children('li:last-child');
	var messageHeight=newMessage.innerHeight();
	var prevHeight=newMessage.prev().innerHeight();
	var totalHeight=scrollTop+clientHeight+messageHeight+prevHeight;
	if(totalHeight>=scrollHeight){
		d.scrollTop(scrollHeight);
	}
}
var socket=io();
socket.on('connect',function(){
	var params=$.deparam(window.location.search)
	socket.emit('join',params,function(err){
      if(err){
      		alert(err);
      	return window.location.href='/';
      }
      else{
      	console.log('No errors!')
      }
	})
})
socket.on('newMessage',function(message){
	  var formattedTime=moment(message.createdAt).format('h:mm a');
	  var template=$("#newMessage-template").html();
	  var html=Mustache.render(template,{
           from:message.from,
           createdAt:formattedTime,
           text:message.text
	  })
	  $('#message-list').append(html);
	   scrollToBottom();
})
socket.on('newLocationMessage',function(message){
	  var formattedTime=moment(message.createdAt).format('h:mm a');
	  var template=$("#locationMessage-template").html();
	  var html=Mustache.render(template,{
           from:message.from,
           createdAt:formattedTime,
           url:message.url
	  })
	  $('#message-list').append(html);
	   scrollToBottom();
})
socket.on('disconnect',function(){
	console.log('disconnected from server!')
})
$('#message-form').on('submit',function(e){
	e.preventDefault();//to prevent page from getting refreshed
	var text=$('#message-text').val();
	$('#message-text').val('');
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
