'use strict';
(function(){
  var tCoreMan=this;

  this.operator=function(owner){
    this.mode="operator";
    var tCore=this;
    var operations=[false,false,false];
    var operationMap={
      '+':function(input,value){
        return input+parseInt(value,16);
      },'-':function(input,value){
        return input-parseInt(value,16);
      },'*':function(input,value){
        return input*parseInt(value,16);
      },'/':function(input,value){
        return input/parseInt(value,16);
      },'%':function(input,value){
        return input%parseInt(value,16);
      },'=':function(input,value){
        return parseInt(value,16);
      },'&':function(input,value){
        return input&parseInt(value,16);
      },'|':function(input,value){
        return input|parseInt(value,16);
      },'?':function(input,value){
        return input==parseInt(value,16);
      },'!':function(input,value){
        return input!=parseInt(value,16);
      }
      //pendant: add one function that is for multiple functions in a chain
    };
    this.sprite=drawer.create('group',{});
    var textGraph=drawer.create('text',{x:-30,y:-30,text:this.mode,fill:"red"});
    this.sprite.add(textGraph);
    var gridButtons=[];
    var pitch=18;
    var displace={x:-15,y:-14};
    var newRect=function(a){
      var props={
        group:{x:(a%4)*pitch+displace.x,y:Math.floor(a/4)*pitch+displace.y},
        rect:{width:pitch,height:pitch,stroke:'black'},
        text:{wrap:"char",y:-2,width:pitch,height:pitch,lineHeight:0.65,fontSize:13,fontFamily:"Lucida Console",fill:"black"},
      };
      var rect=new tCoreMan.dataButton(props);

      // owner.//^001 spriteStealsMouse(rect.sprite);
      gridButtons.push(rect);
      tCore.sprite.add(rect.sprite);
      rect.on('valuechange',function(b){
        var send={unique:owner.unique}
        send["modeProperties.operations."+a]=b;
        globalBindFunction(send);
        console.log("op"+a+"change");
        operations[a]=b;
      });
    }
    for(var a in operations){
      newRect(a);
    }
    var text=this.text;
    var sprite=this.sprite;
    tCoreMan.Blank.call(this,owner);
    this.update=function(){};
    this.draw=function(){};
    this.onSignal=function(e){
      var cancelMessage=false;
      var outgoMessage=e.message.clone();
      for(var a in operations){
        if(operations[a]!==false&&operations[a].length>1){
          var operation=operations[a][0];
          var value=operations[a].slice(1,operations[a].length);
          outgoMessage.data[a]=operationMap[operation](outgoMessage.data[a],value);
          if(outgoMessage.data[a]===false){
            cancelMessage=true;
          }else if(outgoMessage.data[a]===true){
            outgoMessage.data[a]=e.message.data[a];
          }
        }
      }
      if(!cancelMessage) tCore.send(outgoMessage);
    };
    this.send=function(what){
      owner.sendToAllCh(what);
    };
    var updateOperation=function(num,to){
      gridButtons[num].updateValue(to);
      operations[num]=to;
    };
    this.applyModeProperty=function(splitIndex,value){
      console.log(splitIndex,value);
      if(splitIndex[1]=="operations"){
        updateOperation(splitIndex[2],value);
      }
    }
  }
  this.fifo=function(owner){
    var tCore=this;
    this.sprite=drawer.create('group',{});
    this.mode="fifo";
    var text=drawer.create('dynamicText',{x:-30,y:-30,text:this.mode,fill:"red",listening:false});
    this.sprite.add(text);
    var sprite=this.sprite;
    tCoreMan.Blank.call(this,owner);
    var queue=[];
    var textInput=new tCoreMan.dataButton({
      maxLen:16,
      clearOnClick:false,
      group:{},
      rect:{width:35,height:40,stroke:'black'},
      text:{wrap:"char",y:-2,width:40,height:40,fontFamily:"Lucida Console",fill:"black"},
    });
    tCore.sprite.add(textInput.sprite);
    textInput.on('valuechange',function(b){
      console.log(b);
      var nm=new Message(b);
      queue=[nm];
      // console.log("fifo change",queue);
      updateText();
      //data binding part
      var send={unique:owner.unique}
      send["modeProperties.userdata"]=b;
      globalBindFunction(send);
    });
    function updateOperation(stringValue){
      // console.log(b);
      console.log("updateOperation"+stringValue);
      var nm=new Message(stringValue);
      queue=[nm];
      console.log("fifo change",queue);
      updateText();
      textInput.updateValue(stringValue);
    }
    function updateText(){
      var newVal="";
      for(var a of queue){
        newVal+=a.stringify()+"\n";
      }
      text.change({text:"fifo\n"+newVal});
    }
    this.on('mousedown',function(){
      console.log("hi ther");
      tCore.editing=true;
    });
    this.onSignal=function(e){
      var message=e.message;
      var functionNumber=message.headerFunction.get();
      if(owner.hover) console.log("function no "+functionNumber);
      if(functionNumber==0x0){//get next & remove it
        if(queue.length>0){
          tCore.send(queue[0]);
          queue.shift();
        }
      }else if(functionNumber==0x1){//get all
        for (var a of queue){
          tCore.send(a);
        }
        queue=[];
      }else if(functionNumber==0x2){//store
        queue.push(message);
      }else if(functionNumber==0x2){//get length
        message.data[2]=queue.length;
        tCore.send(message);
      }
      updateText();
    };
    this.send=function(what){
      owner.sendToAllCh(what);
    };
    this.applyModeProperty=function(splitIndex,value){
      console.log(splitIndex,value);
      if(splitIndex[1]=="userdata"){
        updateOperation(value);
      }
    }

  }
  var inputs=["space","clock"];
  this.input=function(owner){
    var tCore=this;
    this.sprite=drawer.create('group',{});
    this.mode="input";
    var myType=0;
    var text=drawer.create('dynamicText',{x:-30,y:-30,text:inputs[myType]+" "+this.mode,fill:"red",listening:false});
    this.sprite.add(text);
    var sprite=this.sprite;
    tCoreMan.Blank.call(this,owner);
    function doBang(){
      tCore.send(new Message("emptyBang"));
    }
    this.onAfterClock=function(){
      if(myType==1)doBang();
    };
    this.send=function(what){
      owner.sendToAllCh(what);
    };
    function changeType(a){
      myType=Math.abs(a%inputs.length);
      text.change({text:inputs[myType]+" "+tCore.mode});
    }
    keyboard.on('keydown',function(e){
      // console.log(e);
      if(owner.selected)
      if(e.keyCode===32){
        if(myType==0)doBang();
      }else if(e.keyCode===38){
        changeType(myType+1);
      }else if(e.keyCode===40){
        changeType(myType-1);
      }
    });
  }
  this.muxer=function(owner){
    var tCore=this;
    var currentChild=0;
    this.sprite=drawer.create('group',{});
    this.text=drawer.create('dynamicText',{appendTo:this.sprite,text:"muxer",fill:"red",x:-15,y:-15});
    var text=this.text;
    var sprite=this.sprite;
    tCoreMan.Blank.call(this,owner);
    function updateText(){
      text.change({text:"muxer\n"+currentChild});
    }
    this.onSignal=function(e){
      var message=e.message;
      var currentChild=message.data[1]%owner.children().length;
      tCore.send(currentChild,message);
    };
    this.send=function(whom,what){
      if(whom==="A"){
        owner.sendToAllCh(what);
      }else{
        owner.sendToCh(whom,what);
      }
    }
  }
  var outputs=["synth play"]
  this.output=function(owner){
    var tCore=this;
    this.sprite=drawer.create('group',{});
    this.mode="output";
    var myType=0;
    var text=drawer.create('dynamicText',{x:-30,y:-30,text:outputs[myType]+" "+this.mode,fill:"red",listening:false});
    this.sprite.add(text);
    var sprite=this.sprite;
    tCoreMan.Blank.call(this,owner);
    function changeType(a){
      myType=Math.abs(a%outputs.length);
      text.change({text:outputs[myType]+" "+tCore.mode});
    }
    this.onSignal=function(e){
      var message=e.message;
      if(myType=0){
        synth.play(message.headerAddress.get(),message.data[1],message.data[2]);
      }else if(myType=1){
        synth.play(message.data[0],message.data[1],message.data[2]);
      }
    }
    keyboard.on('keydown',function(e){
      // console.log(e);
      if(owner.selected)
      if(e.keyCode===32){
      }else if(e.keyCode===38){
        changeType(myType+1);
      }else if(e.keyCode===40){
        changeType(myType-1);
      }
    });
  }
  return this;
}).call(ModeCores);