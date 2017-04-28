(function(){
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
  this.licog=function(owner){
    var tCore=this;
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
    var presets=[
        //[apply to myself, output]
      [["P0","A=0"]],
      [["P0","0=0"],["P0","1=0"]]
    ];
    var myType=0;
    this.sprite=drawer.create('group',{});
    this.text=drawer.create('dynamicText',{appendTo:this.sprite,text:types[myType],fill:"red",listening:false});
    var text=this.text;
    var sprite=this.sprite;
    tCoreMan.Blank.call(this,owner);
    var incomingQueue=[];
    var outgoingQueue=[];
    var nextClockQueue=[];
    var nextAfterClockQueue=[];
    var currentStep=0;

    var playsNote=false;
    var note=36;
    var noteColor="#000";

    var updateNoteColor=function(){
      noteColor=noteColors[note%12];
    }
    mouse.on('wheel',function(e){
      var sprite=owner.dragBody;
      if(owner.selected){
        playsNote=true;
        note-=e.delta;
        console.log(note);
        updateNoteColor();
        sprite.change({fill:noteColor});
      }
    });

    owner.on('mouseout',function(){
      if(!owner.selected)
        if(playsNote)
        owner.dragBody.change({fill:noteColor});
    });
    owner.on('deselect',function(){
      if(playsNote)
        owner.dragBody.change({fill:noteColor});
    });

    function changeType(newType){
      myType=Math.abs(newType);
      myType%=types.length;
      console.log(myType);
      text.change({text:types[myType]});
    }
    this.play=function(a){
      //pendant: should be according to PMAP so we can do scale modulation
      // console.log(a,"=",pMap[a]);
      // synth.play(pMap[a][0],pMap[a][1]);
      synth.play(1,note);
    }
    this.onClock=function(){
      nextAfterClockQueue=nextClockQueue;
      nextClockQueue=[];
    };
    this.onAfterClock=function(){
      for(var a in nextAfterClockQueue){
        if(typeof tCore[nextAfterClockQueue[a][0]] === 'function'){
          tCore[nextAfterClockQueue[a][0]](nextAfterClockQueue[a][1],nextAfterClockQueue[a][2]);
        }else{
          console.log("couldnt run "+a[0]);
        }
      }
      nextAfterClockQueue=[];
    };

    this.onSignal=function(e){
      var msg=e.message;
      if(msg.headerFunction.get()==0){
        if(myType==0){
          if(playsNote)
          tCore.play(note);
          nextClockQueue.push(["send","A",new Message([0x00,0x01,note])]);
        }else if(myType==1){
          tCore.send("A",msg);
        }else if(myType==2){
          currentStep=msg.headerAddress.get();
          currentStep%=owner.children().length;
          tCore.send(currentStep,new Message("emptyBang"));
        }else if(myType==3){
          currentStep++;
          currentStep%=owner.children().length;
          tCore.send(currentStep,new Message("emptyBang"));
        }
      }
    };

    this.send=function(whom,what){
      // console.log("send to ",whom);
      if(whom==="A"){
        owner.sendToAllCh(what);
      }else{
        owner.sendToCh(whom,what);
      }
    }
    keyboard.on('keydown',function(e){
      // console.log(e);
      if(owner.selected)
      if(e.keyCode===32){
        tCore.onSignal({message:new Message([0x00,0x01,note])});
      }else if(e.keyCode===38){
        changeType(myType+1);
      }else if(e.keyCode===40){
        changeType(myType-1);
      }
    });

  }
  return this;
}).call(ModeCores);