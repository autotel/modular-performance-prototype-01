(function(){
  var nColor="#777777";
  var sColor="#FFFFFF";
  var hColor="#AAAAAA";
  var hoverColor="#ddddFF";
  var tCoreMan=this;

  var types=[
    "♪",
    "&",
    "M",
    "◌"
  ];



  var noteColors=[
    "#FF0000",//0 c
    "#00FFA2",//5 f
    "#BB00FF",//A a#
    "#BBFF00",//3 d#
    "#0048FF",//8 g#
    "#FF9900",//1 c#
    "#00FFE1",//6 f#
    "#FF00B7",//B b
    "#44FF00",//4 e
    "#8000FF",//9 a
    "#FFD500",//2 d
    "#00D0FF",//7 g
  ];
  var RadialButton=function(owner,props){
    var cColor=nColor;
    var sprite=drawer.create('dynamicCircle',{x:Math.cos(Math.PI*2*props.num/props.over)*40,y:Math.sin(Math.PI*2*props.num/props.over)*40,fill:cColor,radius:7});
    var playsNote=false;
    var note=36;
    var noteColor="#000000";
    var tButton=this;
    var updateNoteColor=function(){
      noteColor=noteColors[note%12];
    }
    this.note=0;
    owner.sprite.add(sprite);
    mouse.Clickable.call(this,sprite);
    this.on('mouseenter',function(){
      cColor=hoverColor;
      sprite.change({fill:cColor});
    });this.on('mouseout',function(){
      cColor=this.selected?sColor:(playsNote?noteColor:nColor);
      sprite.change({fill:cColor});
    });this.on('select',function(){
      cColor=sColor;
      sprite.change({fill:cColor});
    });this.on('deselect',function(){
      cColor=playsNote?noteColor:nColor;
      sprite.change({fill:cColor});
    });keyboard.on('keydown',function(e){
      if(tButton.selected) if(e.keyCode===46){
        playsNote=false;
        cColor=sColor;
        sprite.change({fill:cColor});
      }
    });
    mouse.on('wheel',function(e){
      if(tButton.selected){
        playsNote=true;
        note-=e.delta;
        console.log(note);
        updateNoteColor();
        sprite.change({fill:noteColor});
      }
    });
    this.getEvent=function(){
      return playsNote?note:false;
    }
    var tHighlight=function(){
      sprite.change({fill:hColor});
      setTimeout(function(){sprite.change({fill:cColor});},100);
    }
    this.playHighlight=function(){
      tHighlight();
    }
  }
  this.flower=function(owner){
    var tCore=this;
    var incomingQueue=[];
    var outgoingQueue=[];
    var nextClockQueue=[];
    var nextAfterClockQueue=[];
    var currentStep=0;
    var myType=1;
    this.sprite=drawer.create('group',{});
    var sprite=this.sprite;
    tCoreMan.Blank.call(this,owner);
    var gui={
      sequencerButtons:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      inputTypeSelector:{x:0,y:0},
      scaleMomentarySelector:{x:0,y:10},
      noteMomentarySelector:{x:0,y:-10}
    }
    var len=gui.sequencerButtons.length;
    for(var a in gui.sequencerButtons){
      gui.sequencerButtons[a]=new RadialButton(tCore,{num:a,over:len});
    }
    var sequencerButtons=gui.sequencerButtons;
    gui.text=drawer.create('dynamicText',{appendTo:this.sprite,text:types[myType],fill:"red"});
    var text=gui.text;
    var postConnector=owner.addConnectorModule();
    postConnector.group.move({x:10,y:10});
    postConnector.circle.setRadius(10);


    keyboard.on('keydown',function(e){
      // console.log(e);
      if(owner.selected)
      if(e.keyCode===32){
        tCore.onSignal({message:0});
      }else if(e.keyCode===38){
        changeType(myType+1);
      }else if(e.keyCode===40){
        changeType(myType-1);
      }
    });

    function changeType(newType){
      myType=Math.abs(newType);
      myType%=types.length;
      console.log(myType);
      text.change({text:types[myType]});
    }
    var play=function(a){
      // console.log(a,"=",pMap[a]);
      var num=a%sequencerButtons.length;
      // console.log(sequencerButtons[num],a,num);
      synth.play(1,sequencerButtons[num].getEvent());
      sequencerButtons[num].playHighlight();
    }
    this.onClock=function(){
      nextAfterClockQueue=nextClockQueue;
      nextClockQueue=[];
    };
    this.onAfterClock=function(){
      for(var a in nextAfterClockQueue){
        if(typeof tCore[nextAfterClockQueue[a][0]] === 'function'){
          tCore[nextAfterClockQueue[a][0]](nextAfterClockQueue[a][1]);
        }else{
          console.log("couldnt run "+a[0]);
        }
      }
      nextAfterClockQueue=[];
    };

    var triggerSubLicog=function(number,message){
      if(number=="A"){
        play(0);
      }else{
        play(number);
      }
      console.log("should play all licogs");
      nextClockQueue.push(["subSend","A10"]);
    }

    this.onSignal=function(e){
      var msg=e.message;
      // console.log(msg);
      if(myType==0){
        play(1);
        nextClockQueue.push(["send","A10"]);
        nextClockQueue.push(["send","S"+msg]);
      }else if(myType==1){
        tCore.send("A"+msg);
        triggerSubLicog("A",msg);
      }else if(myType==2){
        currentStep=msg;
        // currentStep%=owner.children().length;
        console.log("currentChildren: "+currentStep);
        tCore.send(msg+"");
        triggerSubLicog(currentStep,msg);
      }else if(myType==3){
        currentStep++;
        // currentStep%=owner.children().length;
        console.log("currentChildren: "+currentStep);
        tCore.send(currentStep+""+msg);
        triggerSubLicog(currentStep,msg);
      }
    };

    this.send=function(what){
      var whom=what[0];
      what=""+what[1]+what[2];
      console.log("send to ",whom);
      if(whom==="A"){
        owner.sendToAllCh(what);
      }else if(whom==="S"){
        owner.sendToSelf(what);
      }else{
        owner.sendToCh(parseInt(whom),what);
      }
    }
    this.subSend=function(what){
      var whom=what[0];
      what=""+what[1]+what[2];
      console.log("subsend to ",whom);
      if(whom==="A"){
        postConnector.sendToAllCh(what);
      }else if(whom==="S"){
        owner.sendToSelf(what);
      }else{
        postConnector.sendToCh(parseInt(whom),what);
      }
    }
  }


  return this;
}).call(ModeCores);