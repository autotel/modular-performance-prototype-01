'use strict';
var ModeCores=new (function(){
  var tCoreMan=this;
  this.Blank=function(owner){
    var tCore=this;
//    this.sprite=new Konva.Group();
    this.update=function(){};
    this.draw=function(){};
    this.onClock=function(){};
    this.onAfterClock=function(){};
    this.onSignal=function(e){};
    this.send=function(a){};
    metronome.on('beat',function(){tCore.onClock()});
    metronome.on('afterbeat',function(){tCore.onAfterClock()});
    master.on('update',function(){tCore.draw();tCore.update();});
  }



  this.squareButton=function(props){
    var hColor=props.hColor||"#ffffff";
    var nColor=props.nColor||"#cccccc";
    var aColor=props.aColor||"#00cc00";
    var cColor=nColor;
    var tSq=this;

    var rect=drawer.create('dynamicRect',props);

    // var rect=this.rect;
    var active=false;
//    var rect=new Konva.Rect(props);
    mouse.Clickable.call(this);
    rect.on('mouseover', function(e) {
      rect.change({fill:hColor});;
      tSq.handle('mouseenter');
    });
    rect.on('mouseout', function(e) {
      rect.change({fill:cColor});;
      tSq.handle('mouseout');
    });
    rect.on('click',function(){
      active=!active;
      cColor=(active ? aColor : nColor);
      rect.change({fill:cColor});;
    });
    this.highlight=function(){
      cColor=(active ? aColor : hColor);
      rect.change({fill:cColor});;
    };
    this.unHighlight=function(){
      cColor=(active ? aColor : (tSq.hover ? hColor : nColor));
      rect.change({fill:cColor});;
    };
    this.getActive=function(){
      return active;
    }
    this.setActive=function(a){
      active=a;
    }
    this.sprite=rect;

  }
  this.BlankGrid=function(owner,button){
    var tCore=this;
    tCoreMan.Blank.call(this,owner);
    var gridButtons=[];
    this.gridButtons=gridButtons;
//    var textGraph=new Konva.Text();
    this.sprite.add(textGraph);
    var pitch=10;
    var displace={x:-15,y:-14};
    for(var a =0;a <16; a++){
      var props={x:(a%4)*pitch+displace.x,y:Math.floor(a/4)*pitch+displace.y};
      props.width=pitch;
      props.height=pitch;
      props.fill="red";
      // props.stroke="black";
      var rect=new tCoreMan[button](props);
      owner.//^001 spriteStealsMouse(rect.sprite);
      gridButtons.push(rect);
      tCore.sprite.add(rect.sprite);
    }
  }

  this.notePlayer=function(owner){
    tCoreMan.Blank.call(this,owner);
    var tCore=this;
    var stateSet={};
    var propNames=['drum'];

    var pitch=10;
    var displace={x:-15,y:-25};
    for(var a =0;a <propNames.length; a++){
      var props={x:(a%4)*pitch+displace.x,y:Math.floor(a/4)*pitch+displace.y};
      props.width=pitch;
      props.height=pitch;
      props.sColor="#ff0000";
      props.nColor="#333333";
      var rect=new tCoreMan.squareButton(props);
      owner.//^001 spriteStealsMouse(rect.sprite);
      stateSet[propNames[a]]=rect;
      tCore.sprite.add(rect.sprite);
    }

    this.onSignal=function(e){
      var val=e.message;
      if(stateSet.drum.getActive()){
        synth.synth1.play(val);
      }else{
        synth.drumkit1.play(val);
      }
    };
  }

  this.SequencerGrid=function(owner){
    var tCore=this;
    tCoreMan.BlankGrid.call(this,owner,"squareButton");
    var currentStep=0;
    var patLen=4;
    var lastMessage=false;
    var stateSet={};
    var pitch=10;
    var displace={x:-15,y:-25};
    //globalClock: wether to waiy for clock or step upon reception of signal
    //jump: wether to jump to the step designated by the signal or advance incrementally
    //bifurcate: wether to send the result of each row to a different output pin
    var propNames=['--','globalClock','jump','bifurcate'];
    for(var a =0;a <propNames.length; a++){
      var props={x:(a%4)*pitch+displace.x,y:Math.floor(a/4)*pitch+displace.y};
      props.width=pitch;
      props.height=pitch;
      props.sColor="red";
      props.nColor="#333333";
      var rect=new tCoreMan.squareButton(props);
      owner.//^001 spriteStealsMouse(rect.sprite);
      stateSet[propNames[a]]=rect;
      tCore.sprite.add(rect.sprite);
    }

    this.update=function(){};
    this.draw=function(){
      console.log("dr");
      for(var a in tCore.gridButtons){
        if(a%4==currentStep){
          tCore.gridButtons[a].highlight();
        }else{
          tCore.gridButtons[a].unHighlight();
        }
      }
    };

    var incomingQueue=[];
    var outgoingQueue=[];

    function inCom(){

      if/* we are responding to signals erratically*/(stateSet.jump.getActive()){
        for(var message of incomingQueue){
          currentStep=message;
          currentStep%=patLen;
          for (var a = currentStep; a < tCore.gridButtons.length; a+=4) {
            if(tCore.gridButtons[a].getActive()){
              outgoingQueue.push(Math.floor(a/4));
              // tCore.send(Math.floor(a/4));
            };
          }
        }
      }else/* we are responding to signals linearly*/{
        for(var message of incomingQueue){
          currentStep++;
          currentStep%=patLen;
          for (var a = currentStep; a < tCore.gridButtons.length; a+=4) {
            if(tCore.gridButtons[a].getActive()){
              outgoingQueue.push(Math.floor(a/4));
            };
          }
        }
      }
      incomingQueue=[];
    }

    function outGo(){
      for(var a of outgoingQueue)
        tCore.send(a);
      outgoingQueue=[];
    }

    this.onClock=function(){
      // evaluatePosMem();
      if(stateSet.globalClock.getActive()){
        incomingQueue.push(0);
        inCom();
        outGo();
      }
    };
    //
    // this.onClock=function(){
    //   if(stateSet.globalClock.getActive()){
    //     sendQueue();
    //   }
    // };
    // this.onAfterClock=function(){
    //   if(stateSet.selfTrigger.getActive()){
    //     incomingQueue.push(0);
    //   }
    //   if(!stateSet.globalClock.getActive()){
    //     outGo();
    //   }
    //   // if(!stateSet.globalClock.getActive()){
    //     inCom();
    //   // }
    //   // sendQueue();
    // };
    this.onSignal=function(e){
      // lastMessage=e.message;
      incomingQueue.push(e.message);
      if(!stateSet.globalClock.getActive()){
        inCom();
        outGo();
      }
    };
    this.send=function(what){
      if(stateSet.bifurcate.getActive()){
        owner.sendToCh(what,what);
      }else{
        owner.sendToAllCh(what);
      }
    }
  }
  return this;
})();








