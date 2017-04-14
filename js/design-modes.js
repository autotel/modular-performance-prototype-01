ModeCores=(function(){
  var tCoreMan=this;
  this.Blank=function(owner){
    var tCore=this;
    this.sprite=new Konva.Group();
    this.update=function(){};
    this.draw=function(){};
    this.onClock=function(){};
    this.onSignal=function(e){};
    this.send=function(a){
      // console.log("would send ",a);

    };
    metronome.on('beat',function(){tCore.onClock()});
    master.on('frame',function(){tCore.draw();tCore.update();});
  }
  this.squareButton=function(props){
    var hColor=props.hColor||"white";
    var nColor=props.nColor||"grey";
    var aColor=props.aColor||"blue";
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
      cColor=(active ? aColor : hColor);
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
    var propNames=['deactivate','globalClock','jump','bifurcate'];
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
      for(var a in tCore.gridButtons){
        if(a%4==currentStep){
          tCore.gridButtons[a].highlight();
        }else{
          tCore.gridButtons[a].unHighlight();
        }
      }
    };
    var queuedMessages=[];
    function evaluatePosMem(){
      if(stateSet.jump.getActive()){
        for(var message of queuedMessages){
          currentStep=message;
          currentStep%=patLen;
          for (var a = currentStep; a < tCore.gridButtons.length; a+=4) {
            if(tCore.gridButtons[a].getActive()){
              // queuedMessages.push(Math.floor(a/4));
              tCore.send(Math.floor(a/4));
            };
          }
        }
        queuedMessages=[];
      }else{
        currentStep++;
        currentStep%=patLen;
        for (var a = currentStep; a < tCore.gridButtons.length; a+=4) {
          if(tCore.gridButtons[a].getActive()){
            tCore.send(Math.floor(a/4));
          };
        }
      }
    }
    //
    // function sendQueue(){
    //   for(var a of queuedMessages)
    //     tCore.send(a);
    //   queuedMessages=[];
    // }
    function processQueue(){
      evaluatePosMem();
    }
    this.onClock=function(){
      if(stateSet.globalClock.getActive()){
        processQueue();
      }
      // sendQueue();
    };
    this.onSignal=function(e){
      // lastMessage=e.message;
      queuedMessages.push(e.message);
      if(!stateSet.globalClock.getActive()){
        processQueue();
        // sendQueue();
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








