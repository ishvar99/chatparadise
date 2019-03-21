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
var count=0,avatar;
var avatarObj={
	Admin:'./admin.png',
	a1:'./boy.png',
	a2:'./girl.png',
	a3:'./man.png',
    a4: './girl1.png',
    a5: './girl2.png',
    a6: './girl3.png'
}
var params;
socket.on('connect',function(){
	params=$.deparam(window.location.search);
	avatar=params.avatar;
	socket.emit('join',params,function(err){
      if(err){
      		alert(err);
      	return window.location.href='/';
      }
	});
	socket.on('updatedUserList',function(users)
	{
		 count=users.length;
		$(".room").text(`${params.room}`);
		$(".online").text(`${count} member(s)`)
           var ol=$('<ol></ol>');
           users.forEach(function(user){
           ol.append($('<li></li>').text(user))
           })
           $('#users').html(ol);
	})
})							
socket.on('loadMessages',function(users)
{
	var template,html;
	users.forEach((user)=>{
		if(user.message){
			if(user.isLink){
              template=$("#linkMessage-template").html();
	   html=Mustache.render(template,{
           from:user.name,
           gender:user.gender,
           createdAt:moment(user.createdAt).format('h:mm a'),
           avatar:avatarObj[user.avatar],
           url:user.message,
           display:user.message
	  });  
			}
			else{
				if(user.name==='Admin'){
					template=$("#newAdminMessage-template").html();
					 html=Mustache.render(template,{
           from:user.name,
           avatar:avatarObj[user.avatar],
           createdAt:moment(user.createdAt).format('h:mm a'),
           text:user.message
	  });
					 $('#message-list').append(html);
           scrollToBottom();
					return;
				}
				template=$("#newMessage-template").html();
	   html=Mustache.render(template,{
           from:user.name,
           avatar:avatarObj[user.avatar],
           gender:user.gender,
           createdAt:moment(user.createdAt).format('h:mm a'),
           text:user.message
	  });
			}
	    $('#message-list').append(html);
           scrollToBottom();
       }
       else { 
	   template=$("#locationMessage-template").html();
	   html=Mustache.render(template,{
           from:user.name,
           gender:user.gender,
           avatar:avatarObj[user.avatar],
           createdAt:moment(user.createdAt).format('h:mm a'),
           url:user.url
	  });
           $('#message-list').append(html);
           scrollToBottom();    
       }
	})
});
socket.on('newMessage',function(message){
	  var regex=/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
	   var formattedTime=moment(message.createdAt).format('h:mm a');
	   if(regex.test(message.text)){
	   	var template=$("#linkMessage-template").html();
	  var html=Mustache.render(template,{
           from:message.from,
           createdAt:formattedTime,
           avatar:avatarObj[message.avatar],
           display:message.text,
           url:message.text
	  })
	  $('#message-list').append(html);
	   scrollToBottom();
	   	return;
	   }
	  var template=$("#newMessage-template").html();
	  var html=Mustache.render(template,{
           from:message.from,
           gender:message.gender,
           avatar:avatarObj[message.avatar],
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
           avatar:avatarObj[message.avatar],
           gender:message.gender,
           url:message.url
	  })
	  $('#message-list').append(html);
	   scrollToBottom();
})
socket.on('newLinkMessage',function(message){
	  var formattedTime=moment(message.createdAt).format('h:mm a');
	  var template=$("#linkMessage-template").html();
	  var html=Mustache.render(template,{
           from:message.from,
           createdAt:formattedTime,
           gender:message.gender,
           avatar:avatarObj[message.avatar],
           display:message.text,
           url:message.text
	  })
	  $('#message-list').append(html);
	   scrollToBottom();
})
socket.on('newAdminMessage',function(message){
	  var formattedTime=moment(message.createdAt).format('h:mm a');
	  var template=$("#newAdminMessage-template").html();
	  var html=Mustache.render(template,{
           from:message.from,
           createdAt:formattedTime,
           avatar:avatarObj[message.avatar],
           text:message.text
	  })
	  $('#message-list').append(html);
	   scrollToBottom();
})
socket.on('disconnect',function(){
	console.log('disconnected from server!');
})
$('#message-form').on('submit',function(e){

	e.preventDefault();//to prevent page from getting refreshed
	var regex=/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
	var text=$('#message-text').val();
	$('#message-text').val('');
	if(regex.test(text)){
     socket.emit('createLinkMessage',{
     	text
     })   
     return;
	}
	if(params.name==='Admin'){
		socket.emit('createAdminMessage',{
			text
		})
		return;
	}
  socket.emit('createMessage',{
	text
},function(data){
    console.log(`got it ${data}`)
})
});
var locationButton=$('#send-location');
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
