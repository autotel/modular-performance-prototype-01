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
    "#FF0000",
    "#FF9900",
    "#FFD500",
    "#BBFF00",
    "#44FF00",
    "#00FFA2",
    "#00FFE1",
    "#00D0FF",
    "#0048FF",
    "#8000FF",
    "#BB00FF",
    "#FF00B7",
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
  }
  this.flower=function(owner){
    var tCore=this;
    var incomingQueue=[];
    var outgoingQueue=[];
    var nextClockQueue=[];
    var nextAfterClockQueue=[];
    var currentStep=0;
    var myType=0;
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
    text=gui.text;
    var postConnector=owner.addConnectorModule();
    postConnector.group.move({x:10,y:10});
    postConnector.circle.setRadius(10);



    function changeType(newType){
      myType=Math.abs(newType);
      myType%=types.length;
      console.log(myType);
      text.change({text:types[myType]});
    }
    this.play=function(a){
      // console.log(a,"=",pMap[a]);
      synth.play(1,sequencerButtons[currentStep].getEvent());
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

    this.onSignal=function(e){
      var msg=e.message;
      console.log(msg);
      if(myType==0){
        tCore.play(1);
        nextClockQueue.push(["send","A10"]);
      }else if(myType==1){
        tCore.send("A"+msg);
      }else if(myType==2){
        currentStep=msg;
        currentStep%=owner.children().length;
        console.log("currentChildren: "+currentStep);
        tCore.send(msg+"");
      }else if(myType==3){
        currentStep++;
        currentStep%=owner.children().length;
        console.log("currentChildren: "+currentStep);
        tCore.send(currentStep+""+msg);
      }
    };

    this.send=function(what){
      var whom=what[0];
      what=""+what[1]+what[2];
      if(whom==="A"){
        console.log("send to ",whom);
        owner.sendToAllCh(what);
      }else{
        console.log("send to ",whom);
        owner.sendToCh(parseInt(whom),what);
      }
    }
    keyboard.on('keydown',function(e){

    });
  }


  return this;
}).call(ModeCores);