(function(){
  var tCoreMan=this;

  this.operator=function(owner){
    var tCore=this;
    var operations=[false,false,false];
    var operationMap={
      '+':function(input,value){
        return input+=parseInt(value[1],16);
      },'-':function(value){
        return input-=parseInt(value[1],16);
      },'*':function(value){
        return input*=parseInt(value[1],16);
      },'/':function(value){
        return input/=parseInt(value[1],16);
      },'%':function(value){
        return input%=parseInt(value[1],16);
      },'=':function(value){
        return input=parseInt(value[1],16);
      },'&':function(value){
        return input&=parseInt(value[1],16);
      },'|':function(value){
        return input|=parseInt(value[1],16);
      }
      //pendant: add one function that is for multiple functions in a chain
    };
    this.sprite=drawer.create('group',{});
    var gridButtons=[];
    var pitch=18;
    var displace={x:-15,y:-14};
    for(var a in operations){
      var props={
        group:{x:(a%4)*pitch+displace.x,y:Math.floor(a/4)*pitch+displace.y},
        rect:{width:pitch,height:pitch,stroke:'black'},
        text:{wrap:"char",y:-2,width:pitch,height:pitch,lineHeight:0.65,fontSize:13,fontFamily:"Lucida Console",fill:"black"},
      };
      var rect=new tCoreMan.dataButton(props);
      // owner.spriteStealsMouse(rect.sprite);
      gridButtons.push(rect);
      tCore.sprite.add(rect.sprite);
      rect.on('valuechange',function(b){
        operations[a]=b;
      });
    }
    var text=this.text;
    var sprite=this.sprite;
    tCoreMan.Blank.call(this,owner);
    this.update=function(){};
    this.draw=function(){};
    this.onSignal=function(e){
      var message=e.message;
      //if incoming message is not a Message, convert it to it.
      if(message.isMessage!==true){
        message=new Message(message);
      }
      for(var a in operations){
        if(operations[a]!==false&&operations[a].length>1){
          var operation=operations[a][0];
          var value=operations[a].slice(1,operations[a].length);
          message.data[a]=operationMap[operation](message.data[a],value);
        }
      }
      tCore.send(e.message);
    };
    this.send=function(a){
      owner.send(a);
    };
  }
  this.clockBanger=function(owner){
    var tCore=this;
    this.sprite=drawer.create('group',{});
    this.text=drawer.create('dynamicText',{appendTo:this.sprite,text:"start",fill:"red",x:-15,y:-15});
    var text=this.text;
    var sprite=this.sprite;
    tCoreMan.Blank.call(this,owner);
    var incomingQueue=[];
    this.update=function(){};
    this.draw=function(){};
    this.onClock=function(){};
    this.onAfterClock=function(){};
    this.onSignal=function(e){};
    this.send=function(a){};
  }
  this.muxer=function(owner){
    var tCore=this;
    this.sprite=drawer.create('group',{});
    this.text=drawer.create('dynamicText',{appendTo:this.sprite,text:"start",fill:"red",x:-15,y:-15});
    var text=this.text;
    var sprite=this.sprite;
    tCoreMan.Blank.call(this,owner);
    var incomingQueue=[];
    this.update=function(){};
    this.draw=function(){};
    this.onClock=function(){};
    this.onAfterClock=function(){};
    this.onSignal=function(e){};
    this.send=function(a){};
  }
  return this;
}).call(ModeCores);