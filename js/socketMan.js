'use strict';
var socketMan=new (function(){

  var HELLO=0X01;
  var CHANGE=0X02;
  var EVENT=0X03;

  var socket = io();
  socket.on(CHANGE, function(e){
    console.log("change:",e);
  });
  socket.on(HELLO, function(e){
    console.log("hello:",e);
  });
	$(window).on('beforeunload', function(){
	  socket.close();
	});
  return this;
});