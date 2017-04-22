
ConnectorGraph=function(layer,from,to){
  console.log("nlin3");
  // console.log({x:from.sprite.x,y:from.sprite.y},{x:to.sprite.x,y:to.sprite.y});
  var sprite=drawer.create('dynamicLine',{
    points: [{x:from.sprite.attrs.x,y:from.sprite.attrs.y},{x:to.sprite.attrs.x,y:to.sprite.attrs.y}],
    strokeWidth: 2,
    stroke:"black"
  });
  layer.add(sprite);
  this.update=function(e){
    // sprite.setPoints({x:from.sprite.x,y:from.sprite.y},{x:to.sprite.x,y:to.sprite.y});
    sprite.change({
      points: [{x:from.sprite.absolute.x,y:from.sprite.absolute.y},{x:to.sprite.attrs.x,y:to.sprite.attrs.y}]
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
//pendant:connector module should be part of the mode... maybe
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
      what:"dynamicLine",
      points: [{x:0, y:0},{ x:-10,y: 0}],
      strokeWidth: 2,
      alpha:1,
      stroke:"black"
    },
    circle:{
      what:'dynamicCircle',
      x: 0,
      y: 0,
      radius: 25,
      fill: "#ffffff",
      strokeWidth: 1,
      interactive:true,
      stroke:"black"
    }
  }
  for(var a in props){
    if(a!="group") props[a].appendTo=this.group;
    var what=a;
    if(props[a].hasOwnProperty("what")) what=props[a].what;
    this[a]=drawer.create(what,props[a]);
  }
  this.sprite=this.group;
  var group=this.group;
  var line=this.line;
  var circle=this.circle;

  group.on('mouseover', function(e) {
    console.log("a");
    t_Cnm.hover=true;
    circle.change({fill:hColor});;
  });
  group.on('mouseout', function(e) {
    // console.log("a");
    t_Cnm.hover=false;
    circle.change({fill:cColor});;
  });
  mouse.on('mousedown',function(e){
    if(t_Cnm.hover)
      t_Cnm.isClicked=true;
  });
  mouse.on('mouseup',function(e){
    if(t_Cnm.isDragging){
      line.change({points: props.line.points});

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
      line.change({points: [{x:0, y:0},e.delta]});

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
  var color="#cccccc";
  var cColor=color;
  var hColor="#000000";
  var sColor="#555555";
  var connectors=[];
  this.id=id;
  this.selected=false;
  this.hover=false;

  this.group=drawer.create("group",{appendTo:layer,interactive:true});
  var group=this.group;
  this.sprite=group;

  //pendant: we are creating only one connector surface, thus should not be array anymore
  var circle=new ConnectorModule(t_Cm,a,0,0);
  group.add(circle.sprite);

  connectors[0]=circle;

  var props={
    dragBody:{
      what:'dynamicCircle',
      x: 0,
      y: 0,
      width: 30,
      height: 30,
      fill: cColor,
      stroke: "#FFFFFF",
      strokeWidth: 2,
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
  }

  for(var a in props){
    if(a!="group") props[a].appendTo=this.group;
    var what=a;
    if(props[a].hasOwnProperty("what")) what=props[a].what;
    this[a]=drawer.create(what,props[a]);
  }
  // drawer.create("circle",{x:0,y:0,fill:"#0000ff",appendTo:tA});
  var tooltip=this.text;
  var dragBody=this.dragBody;
  var sprite=this.group;
  var connectors=[];

  var HOR=false;
  this.overrideHover=function(){
    return HOR;
  }
  this.spriteStealsMouse=function(sprite){
    sprite.on('mouseover',function(){HOR=true});
    sprite.on('mouseout',function(){HOR=false});
  }
  t_Cm.spriteStealsMouse(circle.sprite);

  this.mode=function(modeProto){

    t_Cm.modeCore=new modeProto(t_Cm);
    group.add(t_Cm.modeCore.sprite);
  }


  this.position=function(v){
    group.position(v);
  }
  this.move=function(v){
    group.move({x:v.x,y:v.y});
  }
  dragBody.on('mouseover', function(e) {
    console.log("enmt");
    // dragBody.change({fill:hColor});;
    dragBody.change({fill:hColor});
    // dragBody.fillAlpha=0.3;
    // dragBody.x++;
    t_Cm.handle('mouseenter',e);
  });
  dragBody.on('mouseout', function(e) {
    // dragBody.change({fill:cColor});;
    t_Cm.handle('mouseout',e);
    dragBody.change({fill:cColor});
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
    // dragBody.change({fill:cColor});;
    dragBody.change({fill:cColor});
  }

  this.deselect=function(e){
    this.selected=false;
    this.handle('ondeselect',e);
    cColor=color;
    // dragBody.change({fill:cColor});;
    dragBody.change({fill:cColor});
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



