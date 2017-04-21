
ConnectorGraph=function(layer,from,to){
  console.log("nlin3");
  // console.log({x:from.sprite.x,y:from.sprite.y},{x:to.sprite.x,y:to.sprite.y});
  var sprite=drawer.create('dynamicLine',{
    points: [{x:from.sprite.x,y:from.sprite.y},{x:to.sprite.x,y:to.sprite.y}],
    stroke: 'black',
    strokeWidth: 2
  });
  layer.addChild(sprite);
  this.update=function(e){
    // sprite.setPoints({x:from.sprite.x,y:from.sprite.y},{x:to.sprite.x,y:to.sprite.y});
    sprite.change({
      points: [{x:from.sprite.absolute.x,y:from.sprite.absolute.y},{x:to.sprite.x,y:to.sprite.y}]
    });
  }
  this.highlight=function(){
    this.setStroke('red');
    setTimeout(function(){
      this.setStroke('black');
    },200);
  }
  master.on('update',this.update);

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

  var props={
    group:{x:x,y:y,interactive:true},
    line:{
      points: [{x:0, y:0},{ x:-10,y: 0}],
      stroke: 0x0,
      strokeWidth: 2,
      alpha:1
    },
    circle:{
      x: 0,
      y: 0,
      radius: 4,
      fill: 0xffffff,
      strokeWidth: 1,
      interactive:true
    }
  }
  for(var a in props){
    if(a!="group") props[a].appendTo=this.group;
    this[a]=drawer.create(a,props[a]);
  }
  this.sprite=this.group;
  var group=this.group;
  var line=this.line;
  var circle=this.circle;

  group.on('mouseover', function(e) {
    console.log("a");
    t_Cnm.hover=true;
    circle.fill/*cad*/=(hColor);
  });
  group.on('mouseout', function(e) {
    // console.log("a");
    t_Cnm.hover=false;
    circle.fill/*cad*/=(cColor);
  });
  mouse.on('mousedown',function(e){
    if(t_Cnm.hover)
      t_Cnm.isClicked=true;
  });
  mouse.on('mouseup',function(e){
    if(t_Cnm.isDragging){
      // circle.position({x:0,y:0});
      // line.destroy();
      line=drawer.create("line",{
        points: [{x:0, y:0},{ x:-10,y: 0}],
        stroke: 0x0,
        strokeWidth: 2,
        alpha:1
      });
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
      // line.destroy();
      line=drawer.create("line",{
        points: [{x:0, y:0},e.delta],
        stroke: 0x0,
        strokeWidth: 2,
        alpha:1
      });
      // line.setPoints([0,0,e.delta.x,e.delta.y]);
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
  var color=0xcccccc;
  var cColor=color;
  var hColor=0x000000;
  var sColor=0x555555;
  var connectorGraphs=[];
  this.id=id;
  this.selected=false;
  this.hover=false;
  var props={
    group:{
      appendTo:layer,
      interactive:true,
    },
    rect:{
      x: -25,
      y: -25,
      width: 85,
      height: 85,
      fill: cColor,
      stroke: 0xFFFFFF,
      strokeWidth: 4,
      interactive:true,
    },
    text:{
      x:-25,
      y:-50,
      text: 'id: '+id,
      fontFamily: 'Roboto',
      fontSize: 18,
      padding: 5,
      fill: 'white'
    },
    circle:{
      x:10,
      y:10,
      radius:3,
      fill:0x00ff00,
    }
  }

  for(var a in props){
    if(a!="group") props[a].appendTo=this.group;
    this[a]=drawer.create(a,props[a]);
  }
  // drawer.create("circle",{x:0,y:0,fill:0x0000ff,appendTo:tA});
  var group=this.group;
  this.sprite=group;
  var tooltip=this.text;
  var rect=this.rect;
  var sprite=this.group;
  var connectors=[];
  // layer.addChild(group);
//  // var tooltip = new Konva.Label({
  //   opacity: 0.75
  // });
//  // tooltip.add(new Konva.Text({
  //   x:-25,
  //   y:-50,
  //   text: 'id: '+id,
  //   fontFamily: 'Roboto',
  //   fontSize: 18,
  //   padding: 5,
  //   fill: 'white'
  // }));


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
    group.addChild(t_Cm.modeCore.sprite);
  }

  var t_Sz=[rect.width,rect.height];
  var t_q=4;
  for(var a=0; a<t_q; a++){
    var circle=new ConnectorModule(t_Cm,a,t_Sz[0]-15,10*a-10);
    group.addChild(circle.sprite);
    t_Cm.spriteStealsMouse(circle.sprite);
    connectors[a]=circle;
  }
  this.position=function(v){
    group.x=v.x;
    group.y=v.y;
  }
  this.move=function(v){
    group.x+=v.x;
    group.y+=v.y;
  }
  group.on('mouseover', function(e) {
    rect.lineColor/*cad*/=(hColor);
    // rect.fillAlpha=0.3;
    // rect.x++;
    t_Cm.handle('mouseenter',e);
  });
  group.on('mouseout', function(e) {
    rect.fill/*cad*/=(cColor);
    t_Cm.handle('mouseout',e);
  });
  this.on('dragging',function(e){
    for(var conn of connectors){
      conn.sprite.absolute={};
      conn.sprite.absolute.x=t_Cm.sprite.x+conn.sprite.x;
      conn.sprite.absolute.y=t_Cm.sprite.y+conn.sprite.y;
    }
  });
  this.select=function(e){
    this.selected=true;
    this.handle('onselect',e);
    cColor=sColor;
    rect.fill/*cad*/=(cColor);
  }

  this.deselect=function(e){
    this.selected=false;
    this.handle('ondeselect',e);
    cColor=color;
    rect.fill/*cad*/=(cColor);
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



