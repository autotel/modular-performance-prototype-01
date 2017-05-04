'use strict';
//client side!
var socketMan=new (function(){

  var messages={
    HELLO:0,
    CHANGE:0,
    CREATE:0,
    DELETE:0,
    EVENT:0,
    CONSOLE:0
  }
  var b=0;
  for(var a in messages){
    messages[a]=b;
    b++;
  }

  var socket = io();



  socket.on(messages.CHANGE, function(e){
    console.log("socket change:",e);
  });
  socket.on(messages.HELLO, function(e){
    console.log("socket hello:",e);
  });
  socket.on(messages.CONSOLE, function(e){
    console.log("socket console:",e);
  });
	$(window).on('beforeunload', function(){
	  socket.close();
	});

  this.moduleCreated=function(e){
    console.log("socket",e,messages.CREATE);
    socket.emit(messages.CREATE,{id:e.id});
  }


  return this;
});