(function(){
  var tCoreMan=this;

  this.monitor=function(owner){
    var tCore=this;
    this.sprite=drawer.create('group',{});
    this.mode="monitor";
    this.text=new drawer.create('dynamicText',{x:-30,y:-30,text:this.mode,fill:"red"});
    var text=this.text;
    var sprite=this.sprite;
    sprite.add(text);
    tCoreMan.Blank.call(this,owner);
    var incomingQueue=[];
    console.log("monitor");
    this.onSignal=function(e){
      console.log("sec22");
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