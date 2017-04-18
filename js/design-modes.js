ModeCores=(function(){
  var tCoreMan=this;
  this.Blank=function(owner){
    var tCore=this;
    this.sprite=new Konva.Group();
    this.update=function(){};
    this.draw=function(){};
    this.onClock=function(){};
    this.onAfterClock=function(){};
    this.onSignal=function(e){};
    this.send=function(a){
      // console.log("would send ",a);

    };
    metronome.on('beat',function(){tCore.onClock()});
    metronome.on('afterbeat',function(){tCore.onAfterClock()});
    master.on('frame',function(){tCore.draw();tCore.update();});
  }
  this.squareButton=function(props){
    var hColor=props.hColor||"white";
    var nColor=props.nColor||"grey";
    var aColor=props.aColor||"blue";
    var haColor=props.haColor||"8888ff";
    var cColor=nColor;
    var tSq=this;
    props.fill=cColor;
    var active=false;
    var rect=new Konva.Rect(props);
    mouse.Clickable.call(this);
    rect.on('mouseover', function(e) {
      rect.setFill(hColor);
      tSq.handle('mouseenter');
    });
    rect.on('mouseout', function(e) {
      rect.setFill(cColor);
      tSq.handle('mouseout');
    });
    rect.on('click',function(){
      active=!active;
      cColor=(active ? aColor : nColor);
      rect.setFill(cColor);
    });
    this.highlight=function(){
      cColor=haColor;
      // cColor=(active ? aColor : hColor);
      rect.setFill(cColor);
    };
    this.unHighlight=function(){
      cColor=(active ? aColor : (tSq.hover ? hColor : nColor));
      rect.setFill(cColor);
    };
    this.getActive=function(){
      return active;
    }
    this.setActive=function(a){
      active=a;
    }
    this.sprite=rect;

  }
  this.BlankGrid=function(owner){
    var tCore=this;
    tCoreMan.Blank.call(this,owner);
    var gridButtons=[];
    this.gridButtons=gridButtons;
    var textGraph=new Konva.Text();
    this.sprite.add(textGraph);
    var pitch=10;
    var displace={x:-15,y:-14};
    for(var a =0;a <16; a++){
      var props={x:(a%4)*pitch+displace.x,y:Math.floor(a/4)*pitch+displace.y};
      props.width=pitch;
      props.height=pitch;
      props.fill="red";
      // props.stroke="black";
      var rect=new tCoreMan.squareButton(props);
      owner.spriteStealsMouse(rect.sprite);
      gridButtons.push(rect);
      tCore.sprite.add(rect.sprite);
    }
  }
  this.SequencerGrid=function(owner){
    var tCore=this;
    tCoreMan.BlankGrid.call(this,owner);
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
      owner.spriteStealsMouse(rect.sprite);
      stateSet[propNames[a]]=rect;
      tCore.sprite.add(rect.sprite);
    }

    this.update=function(){};
    this.draw=function(){
      var hs=[];//buttons to hichlight in this frame
      // for(var a in tCore.gridButtons){
        // tCore.gridButtons[a].unHighlight();
        // for(var b of outgoingQueue){
          // if(a%4==b){
          //   console.log(a,b);
          //   hs.push(a);
          // }
        // }
      // }
      // for (var a of hs){
      // }
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
              tCore.gridButtons[a].highlight();
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
              tCore.gridButtons[a].highlight();
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
      for(var a of tCore.gridButtons){
        a.unHighlight();
      }
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








