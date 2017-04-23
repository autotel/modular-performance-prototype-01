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
    this.sprite=drawer.create('group',{});
    tCoreMan.Blank.call(this,owner);
    var incomingQueue=[];
    var outgoingQueue=[];
    var stateSet={
      globalClock:true,
      roundRobin:false,
      jump:false
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
        currentStep%=patLen;
        var st=gridButtons[currentStep].getData();
        // console.log(">>"+st);
        if(st!==false) outgoingQueue.push(st);
        var ev=gridButtons[currentStep].evt();
      }
      if/* we are responding to signals erratically*/(stateSet.jump){
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
      /*if(stateSet.bifurcate){
        owner.sendToCh(what,what);
      }else*/{
        owner.sendToAllCh(what);
      }
    }
  }
  return this;
}).call(ModeCores);