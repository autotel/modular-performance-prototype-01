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
    var c=e.unique;
    var mode=e.mode;
    //pendant: remove this local id nonesense
    var localId=modules.length;
    modl=new CodeModule(layer,localId);
    modules.push(modl);
    modl.setMode(mode);
    modl.move({x:e.x,y:e.y});
  });
	$(window).on('beforeunload', function(){
	  socket.close();
	});

  this.requestCreation=function(prototype){
    // console.log("socket",e,messageIndexes.CREATE);
    socket.emit(messageIndexes.CREATE,{x:prototype.x,y:prototype.y,mode:prototype.modeName});
  }

  this.moduleChanged=function(e){
    socket.emit(messageIndexes.CHANGE,{unique:e.unique,changes:e.changes});
  }
  this.connectionCreated=function(e){
    socket.emit(messageIndexes.CONNECT,{fromid:e.from.unique,toid:e.to.unique});
  }


  return this;
});