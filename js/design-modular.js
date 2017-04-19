
ConnectorGraph=function(layer,from,to){
  console.log("nlin3");
  console.log([from.sprite.attrs.x, from.sprite.attrs.y, to.sprite.attrs.x, to.sprite.attrs.y]);
  var sprite= new Konva.Line({
    points: [from.sprite.attrs.x, from.sprite.attrs.y, to.sprite.attrs.x, to.sprite.attrs.y],
    stroke: 'black',
    strokeWidth: 2,
    // lineCap: 'round',
    // lineJoin: 'round'
  });
  layer.add(sprite);
  this.update=function(e){
    sprite.setPoints([from.sprite.absolute.x, from.sprite.absolute.y, to.sprite.attrs.x, to.sprite.attrs.y]);
  }
  this.highlight=function(){
    this.setStroke('red');
    setTimeout(function(){
      this.setStroke('black');
    },200);
  }
  master.on('frame',this.update);

}
createConnection=function(parent,n,a,b){
  if(parent.patchTo(b,n)){
    // new ConnectorGraph(connectorsLayer,a,b);
    console.log("connected");
  }else{
    console.log("no copnnection made");
  }
}
removeConnection=function(connector){

}
ConnectorModule=function(parent,parentIndex,x,y){
  this.child=false;
  this.hover=false;
  this.dragging=false;
  var color="#ffffff";
  var cColor=color;
  var hColor="#000000";
  var sColor="#ffcccc";
  var t_Cnm=this;
  var sprite=new Konva.Group({x:x,y:y});
  var line = new Konva.Line({
    points: [0, 0, -10, 0],
    stroke: 'black',
    strokeWidth: 2,
    lineCap: 'round',
    lineJoin: 'round'
  });
  var circle = new Konva.Circle({
    x: 0,
    y: 0,
    radius: 4,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 3
  });
  circle.on('mouseover', function(e) {
    // console.log("a");
    t_Cnm.hover=true;
    circle.setFill(hColor);
  });
  circle.on('mouseout', function(e) {
    // console.log("a");
    t_Cnm.hover=false;
    circle.setFill(cColor);
  });
  mouse.on('mousedown',function(e){
    if(t_Cnm.hover)
      t_Cnm.isClicked=true;
  });
  mouse.on('mouseup',function(e){
    if(t_Cnm.isDragging){
      // circle.position({x:0,y:0});
      line.setPoints([0,0,-10,0]);
      t_Cnm.isDragging=false;
      t_Cnm.isClicked=false;
      var umo=mouse.getHoveredClickable();
      if(umo.type=="cModule"){
        createConnection(parent,parentIndex,t_Cnm,umo);
      }
    }
  });
  mouse.on('drag',function(e){
    if(t_Cnm.isClicked){
      t_Cnm.isDragging=true;
      // console.log("r");
      // console.log(e.offset);
      // circle.position(e.delta);
      line.setPoints([0,0,e.delta.x,e.delta.y]);
    }
  });

  this.onClick=function(e){
    //click is prioritized. Connectors override rectangle clickss
    var clickTaken=t_Cnm.hover;
    if(t_Cnm.hover){
      // e.preventDefault();
      t_Cnm.dragging=true;
      console.log("start a patch connection procedure");
    }
    return clickTaken;
  }
  sprite.add(line);
  sprite.add(circle);
  this.sprite=sprite;
  this.plug=function(who){
    if(who){
      t_Cnm.child=who;
      t_Cnm.connectorGraph=new ConnectorGraph(connectorsLayer,t_Cnm,who);
    }
  }
  this.unPlug=function(){
    if(t_Cnm.child){
      t_Cnm.child=false;
      t_Cnm.connectorGraph.remove();
    }
  }
  this.highlight=function(){
    circle.setStroke('red');
    setTimeout(function(){
      circle.setStroke('black');
    },200);
  }
}
CodeModule=function(layer,id){
  this.type="cModule";
  ModuleBase.call(this);
  mouse.Draggable.call(this);
  var t_Cm=this;
  var color="#cccccc";
  var cColor=color;
  var hColor="#000000";
  var sColor="#555555";
  var connectorGraphs=[];
  this.id=id;
  this.selected=false;
  this.hover=false;
  var group = new Konva.Group({
    // draggable: true
  });
  this.sprite=group;
  var rect = new Konva.Rect({
    x: -25,
    y: -25,
    width: 85,
    height: 85,
    fill: cColor,
    stroke: 'black',
    strokeWidth: 4,
    // draggable: true
  });
  var connectors=[];
  var tooltip = new Konva.Label({
    opacity: 0.75
  });
  tooltip.add(new Konva.Text({
    x:-25,
    y:-50,
    text: 'id: '+id,
    fontFamily: 'Roboto',
    fontSize: 18,
    padding: 5,
    fill: 'white'
  }));
  group.add(rect);


  var HOR=false;
  this.overrideHover=function(){
    return HOR;
  }
  this.spriteStealsMouse=function(sprite){
    sprite.on('mouseover',function(){HOR=true});
    sprite.on('mouseout',function(){HOR=false});
  }
  this.mode=function(modeProto){
    t_Cm.modeCore=new modeProto(t_Cm);
    group.add(t_Cm.modeCore.sprite);
  }

  var t_Sz=[rect.getWidth(),rect.getHeight()];
  var t_q=4;
  for(var a=0; a<t_q; a++){
    var circle=new ConnectorModule(t_Cm,a,t_Sz[0]-15,10*a-10);
    group.add(circle.sprite);
    t_Cm.spriteStealsMouse(circle.sprite);
    connectors[a]=circle;
  }
  group.add(tooltip);
  layer.add(group);
  this.position=function(v){
    group.position(v);
  }
  this.move=function(v){
    group.move(v);
  }
  group.on('mouseover', function(e) {
    rect.setFill(hColor);
    t_Cm.handle('mouseenter',e);
  });
  group.on('mouseout', function(e) {
    rect.setFill(cColor);
    t_Cm.handle('mouseout',e);
  });
  this.on('dragging',function(e){
    for(var conn of connectors){
      conn.sprite.absolute={};
      conn.sprite.absolute.x=t_Cm.sprite.attrs.x+conn.sprite.attrs.x;
      conn.sprite.absolute.y=t_Cm.sprite.attrs.y+conn.sprite.attrs.y;
    }
  });
  this.select=function(e){
    this.selected=true;
    this.handle('onselect',e);
    cColor=sColor;
    rect.setFill(cColor);
  }

  this.deselect=function(e){
    this.selected=false;
    this.handle('ondeselect',e);
    cColor=color;
    rect.setFill(cColor);
  }

  this.patchTo=function(who,n){
    if(who===t_Cm){
      return false;
    }else{
      console.log(n);
      connectors[n].plug(who);
      return true;
    }
  }
  this.unpatch=function(who){
    for(var a in connectors){
      if(connectors[a].child===who){
        connectors[a].unplug();
        return true;
      }
    }
    return false;
    // t_Cm.children.splice(t_Cm.children.indexOf(who),1);
  }
  this.sendToCh=function(which,what){
    if(t_Cm.hover){
      console.log("["+t_Cm.id+"]>>"+what);
    }
    var who=connectors[which].child;
    connectors[which].highlight();
    if(who)
    who.receive(what,t_Cm);
  }
  this.sendToAllCh=function(what){
    if(t_Cm.hover){
      console.log("["+t_Cm.id+"]>>"+what);
    }
    for(var who of connectors){
      who.highlight();
      if(who.child)
      who.child.receive(what,t_Cm);
    }
  }
  // this.sendTo=function(who,what){
  //   if(t_Cm.hover){
  //     console.log("["+t_Cm.id+"]>>"+what);
  //   }
  //   who.receive(what,t_Cm);
  // }
  this.receive=function(what,whom){
    if(t_Cm.hover){
      console.log("["+t_Cm.id+"]<<"+what);
    }
    t_Cm.modeCore.onSignal({message:what,from:this});
  }
  // this.position=function(a,b){
  //   t_Cm.sprite.position({x:a,y:b});
  // }
}



