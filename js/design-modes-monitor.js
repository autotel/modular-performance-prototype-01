(function(){
  var tCoreMan=this;

  this.monitor=function(owner){
    var tCore=this;
    this.sprite=drawer.create('group',{});
    this.text=drawer.create('dynamicText',{appendTo:this.sprite,text:"start",fill:"red",x:-15,y:-15});
    var text=this.text;
    var sprite=this.sprite;
    tCoreMan.Blank.call(this,owner);
    var incomingQueue=[];
    this.onSignal=function(e){
      var inString="";
      var outString="";
      for(var a of e.message){
        inString+=a;
      }
      incomingQueue.push(inString);
      if(incomingQueue.length>10){
        incomingQueue.splice(0,1);
      }
      for(var a of incomingQueue){
        outString+=a+"\n";
      }
      text.change({text:outString});
    };
  }
  return this;
}).call(ModeCores);