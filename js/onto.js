'use strict';
var master=new (function(){
  onHandlers.call(this);
  this.on('createModule',function(e){
    socketMan.moduleCreated(e);
  });
  this.on('change',function(e){
    socketMan.moduleChanged(e);
  });
  this.on('connection',function(e){
    socketMan.connectionCreated(e);
  });
  return this;
})();
var metronome=new (function(){
  onHandlers.call(this);
  var tMetro=this;
  this.verbose=false;
  Tone.Transport.scheduleRepeat(function(time){
    if(tMetro.verbose)
    console.log("ck");
    tMetro.handle('beat',time);
    tMetro.handle('afterbeat',time);
  }, "8n");
  Tone.Transport.start();
  return this;
})();
var mouse=new (function(){
  onHandlers.call(this);
  this.pos={x:0,y:0};
  var t_M=this;
  var lastClickpos={x:0,y:0}
  this.dragging=false;
  var buttonsDown={};
  var buttonsDragging={};
  var onMouseWheel=function(e){
    e.delta=Math.sign(e.wheelDelta);
    t_M.handle('wheel',e);
  }
  document.addEventListener("DOMMouseScroll",function(e){e.wheelDelta=e.detail; onMouseWheel(e)});
  document.addEventListener("mousewheel",onMouseWheel);
  document.addEventListener("mousedown", function(e){
    // console.log(e);
    lastClickpos={x:e.offsetX,y:e.offsetY};
    buttonsDown[e.buttons]=true;
    t_M.handle('mousedown',e);
    t_M.handle('click',e);
    var chainReturn=false;
    eachClickable(function(){
      if(!chainReturn)
        chainReturn= this.onClick(e);
    });
  });
  document.addEventListener("mouseup", function(e){
    buttonsDown[e.buttons]=false;
    e.underMouse=[];
    var chainReturn=false;
    //pendant cheinreturn shoudl exit the loop
    eachClickable(function(){
      var thisUnder=this.onRelease(e);
      if(thisUnder)
        e.underMouse.push(this);
      if(!chainReturn){
        chainReturn= thisUnder;
      }
    });
    t_M.handle('mouseup',e);
  });
  document.addEventListener("mousemove",function(e){
    var p=[];
    for (var a in e){
      p[a]=e[a];
    }
    t_M.pos={x:e.offsetX,y:e.offsetY};
    t_M.handle('mousemove',e);
    for(var a in buttonsDown){
      if(a){
        buttonsDragging[a]=true;
        p.button=a;
        p.buttons=buttonsDragging;
        p.delta={x:p.offsetX-lastClickpos.x,y:p.offsetY-lastClickpos.y}
        p.offset={x:p.offsetX,y:p.offsetY}
        t_M.handle('drag',p);
        var chainReturn=false;
        eachClickable(function(){
          if(!chainReturn)
          chainReturn=this.onDrag(p);
        });
      }else{
        buttonsDragging[a]=false;
      }
    }
  });

  var dlist=[];
  var cklist=[];
  var eachDraggable=function(cb){
    for(var a in dlist){
      cb.call(dlist[a]);
    }
  }
  var eachClickable=function(cb){
    for(var a in cklist){
      cb.call(cklist[a]);
    }
  }

  this.getHoveredClickable=function(){
    for(var a in dlist){
      if(dlist[a].hover)
        return dlist[a]
    }
    return false;
  }
  this.Clickable=function(detectorSprite){
    var t_ck=this;
    cklist.push(this);
    var pRem=this.remove;
    this.remove=function(){
      if(typeof pRem === "function") pRem();
      cklist.splice(cklist.indexOf(this),1);
      if(dlist.indexOf(this))
        dlist.splice(cklist.indexOf(this),1);
    }
    if(!this.handle)
    onHandlers.call(this);
    this.hover=false;
    this.clicked=false;
    this.selected=false;
    this.overrideHover=function(){
      return false;
    }

    //this part is tailored for Konva, we use the detector sprites konva callbacks
    //to call the clickable callbacks. concentrating this operation here makes
    //more easy to change renderer, and also easier to make objects clickable
    detectorSprite.on('mouseover', function(e) {
      t_ck.handle('mouseenter',e);
    });
    detectorSprite.on('mouseout', function(e) {
      t_ck.handle('mouseout',e);
    });

    //obviously can be overriden. also konva specific
    this.position=function(v){detectorSprite.position(v)};

    this.on('mouseenter',function(){
      // console.log("mouseenter",this);
      if(!t_ck.overrideHover())
      t_ck.hover=true;
    });
    this.on('mouseout',function(){
      // console.log("mosueout",this);
      if(!t_ck.overrideHover())
      t_ck.hover=false;
    });
    this.onClick=function(e){
      this.clickedPosition=e.pos;
      var taken=false;
      if(t_ck.hover){
        t_ck.handle("mousedown",e);
        t_ck.clicked=true;
        if(!t_ck.selected){
          t_ck.selected=true;
          t_ck.handle('select',e);
        }
        taken=true;
        // console.log("meClicked");
      }else{
        if(t_ck.selected){
          t_ck.selected=false;
          t_ck.handle('deselect',e);
        }
      }
      return taken;
    }
    this.onRelease=function(e){
      var taken=false;
      if(t_ck.clicked){
        t_ck.handle("release",e);
        t_ck.clicked=false;
        taken=true;
      }else if(t_ck.hover){
        taken="onlyRelease";
      }
      return taken;
    }
    this.onDrag=function(e){
      if(t_ck.clicked){
        t_ck.handle('dragging',e);
        return true;
      }else{
        return false;
      }
    }
  }
  this.Draggable =function(detectorSprite){
    dlist.push(this);
    t_M.Clickable.call(this,detectorSprite);
    var t_ck=this;

    this.onDrag=function(e){
      if(t_ck.clicked){
        t_ck.position(e.offset);
        t_ck.handle('dragging',e);
        return true;
      }else{
        return false;
      }
    }
  }
  return this;
})();
var keyboard=new(function(){
  onHandlers.call(this);
  var thk=this;
  window.addEventListener("keydown", function(event){
    // console.log(event);
    thk.handle("keydown",event);
  });
  return this;
})();

var ModuleBase=function(){
  if(!this.handle)
  onHandlers.call(this);
  // console.log("new module");
  var t_M=this;
  this.update=function(vars){
    this.handle('update',vars);
  }
  this.codeString="";
  this.codeActive={};
  // this.runCode=function(){
  //   var testStatic="mm";
  //   try {
  //     eval(t_M.codeString);
  //   } catch (e) {
  //     throw e;
  //   } finally {
  //
  //   }
  // }
}