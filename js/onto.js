//onto
var master=(function(){
  onHandlers.call(this);
  return this;
})();
mouse=(function(){
  onHandlers.call(this);
  this.pos={x:0,y:0};
  t_M=this;
  var lastClickpos={x:0,y:0}
  this.dragging=false;
  this.buttonsDown={};
  this.buttonsDragging={};

  document.addEventListener("mousedown", function(e){
    // console.log(e);
    lastClickpos={x:e.offsetX,y:e.offsetY};
    buttonsDown[e.buttons]=true;
    t_M.handle('mousedown',e);
    t_M.handle('click',e);
    var chainReturn=false;
    eachClickable(function(){
      // console.log("mousedown",this);
      // console.log(chainReturn);
      if(!chainReturn)
        chainReturn= this.onClick(e);
    });
  });
  document.addEventListener("mouseup", function(e){
    buttonsDown[e.buttons]=false;
    t_M.handle('mouseup',e);
    var chainReturn=false;
    eachClickable(function(){
      // console.log("mousedown",this);
      // console.log(chainReturn);
      if(!chainReturn)
        chainReturn= this.onRelease(e);
        // console.log(chainReturn);
    });
  });
  document.addEventListener("mousemove",function(e){
    t_M.handle('mousemove',e);
    for(var a in buttonsDown){
      if(a){
        buttonsDragging[a]=true;
        e.button=a;
        e.buttons=buttonsDragging;
        e.delta={x:e.offsetX-lastClickpos.x,y:e.offsetY-lastClickpos.y}
        e.offset={x:e.offsetX,y:e.offsetY}
        t_M.handle('drag',e);
        var chainReturn=false;
        eachDraggable(function(){
          if(!chainReturn)
          chainReturn=this.onDrag(e);
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
  this.Clickable=function(){
    var t_ck=this;
    cklist.push(this);
    this.remove=function(){
      list.splice(list.indexOf(this),1);
    }
    if(!this.handle)
    onHandlers.call(this);
    this.hover=false;
    this.clicked=false;
    this.overrideHover=function(){
      return false;
    }
    this.on('mouseenter',function(){
      // console.log("mouseenter");
      if(!t_ck.overrideHover())
      t_ck.hover=true;
    });
    this.on('mouseout',function(){
      // console.log("mosueout");
      if(!t_ck.overrideHover())
      t_ck.hover=false;
    });
    this.onClick=function(e){
      this.clickedPosition=e.pos;
      // console.log("click");
      var taken=false;
      if(t_ck.hover){
        // console.log("hoverclick");
        t_ck.handle("mousedown",e);
        t_ck.clicked=true;
        taken=true;
        // console.log("meClicked");
      }
      return taken;
    }
    this.onRelease=function(e){
      var taken=false;
      if(t_ck.clicked){
        t_ck.handle("release",e);
        t_ck.clicked=false;
        taken=true;
      }else{

      }
      return taken;
    }
  }
  this.Draggable =function(){
    dlist.push(this);
    t_M.Clickable.call(this);
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
ModuleBase=function(){
  if(!this.handle)
  onHandlers.call(this);
  // console.log("new module");
  var t_M=this;
  this.draw=function(vars){
    this.handle('draw',vars);
  }
  this.codeString="";
  this.codeActive={};
  this.runCode=function(){
    var testStatic="mm";
    try {
      eval(t_M.codeString);
    } catch (e) {
      throw e;
    } finally {

    }
  }
}