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
    var hColor=props.hColor||"#ffffff";
    var nColor=props.nColor||"#cccccc";
    var aColor=props.aColor||"#cc0000";
    var cColor=nColor;
    var tSq=this;
    props.rect.fill=cColor;
    var active=false;
    props.rect.what='dynamicRect';
    props.group.interactive=true;
    props.rect.interactive=true;
    for(var a in props){
      if(a!="group") props[a].appendTo=this.group;
      var what=a;
      if(props[a].hasOwnProperty("what")) what=props[a].what;
      this[a]=drawer.create(what,props[a]);
    }
    var group=this.group;
    var rect=this.rect;
    var text=this.text;
    this.sprite=group;

    mouse.Clickable.call(this);
    group.on('mouseover', function(e) {
      rect.change({fill:hColor});;
      tSq.handle('mouseenter');
    });
    group.on('mouseout', function(e) {
      rect.change({fill:cColor});;
      tSq.handle('mouseout');
    });

    group.on('click',function(){
      tSq.enableTextEdit();
    });

    this.enableTextEdit=function(){
      console.log(name,charScript);
      active=!active;
      cColor=(active ? aColor : nColor);
      rect.change({fill:cColor});;
      if(active){
        charScript="";
        text.setText(charScript);
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
      // console.log("hight");
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
    this.sprite=group;
    this.getData=function(){
      if(charScript.length>=2){
        return charScript[0]+""+(charScript[1]|" ");
      }else{
        return false;
      }
    };
    this.evt=function(){
      if(charScript.length<1) return false;
      if(charScript[0]=="-"||charScript[0]==" ") return false;
      return parseInt(charScript[0]/*+charScript[1]*/, 16);
    }
  }


  this.dataMatrix=function(owner){
    var tCore=this;

    var interfaceModes={
      editSequence:{},//normal step sequencing
      editEvents:{},//select what the sequencer events 0-16 make
      livePerform:{},//press one button to trigger an event
      editScale:{},//edit the scale map
    }

    var pMap=[
      [0,0],
      [1,32],
      [1,33],
      [1,34],
      [1,35],
      [1,36],
      [1,37],
      [1,38],
      [1,39],
      [1,40],
      [1,41],
      [1,42],
      [1,43],
      [1,44],
      [1,45],
    ];
    this.sprite=drawer.create('group',{});
    tCoreMan.Blank.call(this,owner);
    var gridButtons=[];
    this.gridButtons=gridButtons;
    var textGraph=new drawer.create('text',{});
    this.sprite.add(textGraph);
    var pitch=18;
    var displace={x:-15,y:-14};
    for(var a =0; a <16; a++){
      var props={
        group:{x:(a%4)*pitch+displace.x,y:Math.floor(a/4)*pitch+displace.y},
        rect:{width:pitch,height:pitch,stroke:'black'},
        text:{wrap:"char",y:-2,width:pitch,height:pitch,lineHeight:0.65,fontSize:13,fontFamily:"Lucida Console",fill:"black"},
      };
      // props.width=pitch;
      // props.height=pitch;
      // props.fill="red";
      // props.stroke="black";
      var rect=new tCoreMan.dataButton(props);
      owner.spriteStealsMouse(rect.sprite);
      gridButtons.push(rect);
      tCore.sprite.add(rect.sprite);
    }

    var currentStep=0;
    var patLen=16;
    var lastMessage=false;
    var stateSet={};
    var pitch=10;
    var displace={x:-15,y:-25};
    //globalClock: wether to waiy for clock or step upon reception of signal
    //jump: wether to jump to the step designated by the signal or advance incrementally
    //bifurcate: wether to send the result of each row to a different output pin
    var propNames=['touch','globalClock','jump','bifurcate'];
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

    stateSet.touch.sprite.on('click',function(){
      var st=gridButtons[0].getData();
      if(st!==false) outgoingQueue.push(st);
      outGo();
    });

    this.update=function(){};
    this.draw=function(){
      for(var a in gridButtons){
        if(a%patLen==currentStep){
          // console.log("hi");
          gridButtons[a].highlight();
        }else{
          gridButtons[a].unHighlight();
        }
      }
    };

    var incomingQueue=[];
    var outgoingQueue=[];

    function inCom(){
      var headerReactionMap={
        '+':function(message){
          currentStep+=parseInt(message[1],16);
        },'-':function(message){
          currentStep-=parseInt(message[1],16);
        },'*':function(message){
          currentStep*=parseInt(message[1],16);
        },'/':function(message){
          currentStep/=parseInt(message[1],16);
        },'%':function(message){
          currentStep%=parseInt(message[1],16);
        },'=':function(message){
          currentStep=parseInt(message[1],16);
        },'P':function(message){
          synth.play(pMap[message[1]][0],pMap[message[1]][1]);
        }
      };
      function pStep(){
        currentStep%=patLen;
        var st=gridButtons[currentStep].getData();
        // console.log(">>"+st);
        if(st!==false) outgoingQueue.push(st);
        var ev=gridButtons[currentStep].evt();
      }
      if/* we are responding to signals erratically*/(stateSet.jump.getActive()){
        for(var message of incomingQueue){
          if(message.length>0)
            headerReactionMap[message[0]](message);
          if(isNaN(currentStep)) currentStep=0;
          // currentStep=message;
          pStep();
        }
      }else/* we are responding to signals linearly*/{
        for(var message of incomingQueue){
          currentStep++;
          pStep();
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
      // incomingQueue.push(0);
      if(stateSet.globalClock.getActive()){
        outGo();
        inCom();
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