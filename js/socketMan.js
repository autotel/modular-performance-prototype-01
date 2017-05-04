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
  socket.on(messageIndexes.CREATE,function(e){
    console.log("socket created a module",e);
    var modl;
    var c=e.id;
    var mode=e.mode;
    modl=new CodeModule(layer,c);
    modl.mode(ModeCores[mode]);
    modl.move({x:e.x,y:e.y});
    modules[c]=modl;
  });
	$(window).on('beforeunload', function(){
	  socket.close();
	});

  this.moduleCreated=function(e){
    console.log("socket",e,messageIndexes.CREATE);
    socket.emit(messageIndexes.CREATE,{id:e.id});
  }
  this.moduleChanged=function(e){
    socket.emit(messageIndexes.CHANGE,{id:e.id,changes:e.changes});
  }
  this.connectionCreated=function(e){
    socket.emit(messageIndexes.CONNECT,{fromid:e.from.id,toid:e.to.id});
  }


  return this;
});