(function(){
  var tCoreMan=this;

  var names={};
  var newName=function(p){
    if(names.hasOwnProperty(p)){
      names[p]++;
    }else{
      names[p]=0;
    }
    return p+names[p];
  }
  //for awareness of a "next" databutton
  var dataButtons=[];
  this.dataButton=function(props){
    var myId=dataButtons.length;
    dataButtons[myId]=this;
    var name=newName("databutton");
    var charScript="";
    var hColor=props.hColor||"white";
    var nColor=props.nColor||"grey";
    var aColor=props.aColor||"red";
    var cColor=nColor;
    var tSq=this;
    props.fill=cColor;
    var active=false;
    var rect=new Konva.Rect(props.rect);
    var group=new Konva.Group(props.group);
    var text=new Konva.Text(props.text);
    group.add(rect);
    group.add(text);
    mouse.Clickable.call(this);
    group.on('mouseover', function(e) {
      rect.setFill(hColor);
      tSq.handle('mouseenter');
    });
    group.on('mouseout', function(e) {
      rect.setFill(cColor);
      tSq.handle('mouseout');
    });

    group.on('click',function(){
      tSq.enableTextEdit();
    });
    this.enableTextEdit=function(){
      console.log(name,charScript);
      active=!active;
      cColor=(active ? aColor : nColor);
      rect.setFill(cColor);
      if(active){
        keyboard.on('keydown.'+name,function(e){
          console.log(e);
          if (e.keyCode==8){
            charScript="";
          }else if (e.keyCode==13){
            //enter
            charScript=charScript.substring(0,4);
            keyboard.off('keydown.'+name);
            tSq.setActive(false);
          }else if (e.keyCode==9){
            //tab
            e.preventDefault();
            charScript=charScript.substring(0,4);
            keyboard.off('keydown.'+name);
            tSq.setActive(false);
            dataButtons[(myId+1)%(dataButtons.length-1)].enableTextEdit();
          }else  if (e.keyCode==16){
            //SHIFT
          }else if(e.keyCode>0){
            charScript+=e.key.toUpperCase ( );
          }else {}
          console.log(charScript);
          text.setText(charScript);
        });
      }else{
        keyboard.off('keydown.'+name);
      }
    }

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
    this.sprite=group;
  }


  this.dataMatrix=function(owner){
    var tCore=this;

    tCoreMan.Blank.call(this,owner);
    var gridButtons=[];
    this.gridButtons=gridButtons;
    var textGraph=new Konva.Text();
    this.sprite.add(textGraph);
    var pitch=18;
    var displace={x:-15,y:-14};
    for(var a =0; a <16; a++){
      var props={
        group:{x:(a%4)*pitch+displace.x,y:Math.floor(a/4)*pitch+displace.y},
        text:{text:"-",wrap:"char",y:-2,width:pitch,height:pitch,lineHeight:0.65,fontSize:13,fontFamily:"Lucida Console"},
        rect:{width:pitch,height:pitch}
      };
      props.width=pitch;
      props.height=pitch;
      props.fill="red";
      // props.stroke="black";
      var rect=new tCoreMan.dataButton(props);
      owner.spriteStealsMouse(rect.sprite);
      gridButtons.push(rect);
      tCore.sprite.add(rect.sprite);
    }

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
}).call(ModeCores);