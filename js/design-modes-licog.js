(function(){
  var tCoreMan=this;
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
    var types=[
      "♪",
      "&",
      "M",
      "◌"
    ];
    this.sprite=drawer.create('group',{});
    this.text=drawer.create('dynamicText',{appendTo:this.sprite,text:types[myType],fill:"red"});
    var text=this.text;
    tCoreMan.Blank.call(this,owner);
    var incomingQueue=[];
    var outgoingQueue=[];
    var nextClockQueue=[];
    var currentStep=0;

    function changeType(newType){
      myType=Math.abs(newType);
      myType%=types.length;
      console.log(myType);
      text.change({text:types[myType]});
    }
    this.play=function(a){
      console.log(a,"=",pMap[a]);
      synth.play(pMap[a][0],pMap[a][1]);
    }
    this.onClock=function(){
      for(var a in nextClockQueue){
        console.log(nextClockQueue[a]);
        if(typeof tCore[nextClockQueue[a][0]] === 'function'){
          tCore[nextClockQueue[a][0]](nextClockQueue[a][1]);
        }else{
          console.log("couldnt run "+a[0]);
        }
      }
      nextClockQueue=[];
    };
    this.onSignal=function(e){
      if(myType==0){
        tCore.play(1);
        nextClockQueue.push(["send","A10"]);
      }else if(myType==1){
        console.log("send message to all children");
      }else if(myType==2){
        console.log("send message to children number",e.message);
      }else if(myType==3){
        console.log("send message to incremental children; there should be a reset action somehow");
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
  }
  return this;
}).call(ModeCores);