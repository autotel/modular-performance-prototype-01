'use strict';
//client side!
var socketMan=new (function(){

  var socket = io();

  getMessageNames(this);
  var messageIndexes=this.messageIndexes;
  var messageNames=this.messageNames;

  socket.on(messageIndexes.CHANGE, function(e){
    console.log("socket change:",e);
  });
  socket.on(messageIndexes.HELLO, function(e){
    console.log("socket hello:",e);
  });
  socket.on(messageIndexes.CONSOLE, function(e){
    console.log("socket console:",e);
  });
	$(window).on('beforeunload', function(){
	  socket.close();
	});

  this.moduleCreated=function(e){
    console.log("socket",e,messageIndexes.CREATE);
    socket.emit(messageIndexes.CREATE,{id:e.id});
  }


  return this;
});