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
    this.sprite=drawer.create('group',{});
    tCoreMan.Blank.call(this,owner);
    var incomingQueue=[];
    var outgoingQueue=[];
    var currentStep=0;
    var stateSet={
      globalClock:true,
      roundRobin:false,
      jump:true
    }
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
        //preset[presetnumber][stepnumber][self or send]

        var send=presets[0][currentStep][1];
        if(send!==false) outgoingQueue.push(send);
      }
      if/* we are responding to signals erratically*/(stateSet.jump){
        for(var message of incomingQueue){
          if(message.length>0)
            headerReactionMap[message[0]](message);
          if(isNaN(currentStep)) currentStep=0;
          //
          //pendant: what shoudl happen here?
          //the following thwo actions could be in or out of the messages iterator,
          pStep();
          //each step serves as a sort of user programmable interface
          var stepAction=presets[0][currentStep][0];
          headerReactionMap[stepAction[0]](stepAction);
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
      if(stateSet.globalClock){
        outGo();
        inCom();
      }
    };
    this.onSignal=function(e){
      incomingQueue.push(e.message);
      if(!stateSet.globalClock){
        inCom();
        outGo();
      }
    };
    this.send=function(what){
      var whom=what[0];
      what=""+what[1]+what[2];
      if(whom==="A"){
        owner.sendToAllCh(what);
      }else{
        owner.sendToCh(parseInt(whom),what);
      }
    }
    keyboard.on('keydown',function(e){
      // console.log(e);
      if(owner.selected)
      if(e.keyCode===32){
        incomingQueue.push(0);
        console.log(":)");
      }
    });
  }
  return this;
}).call(ModeCores);