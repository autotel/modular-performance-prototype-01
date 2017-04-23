
ConnectorGraph=function(layer,from,to){
  t_Cg=this;
  console.log("line");
  this.hover=false;
  this.dragging=false;
  var color="#ffffff";
  var cColor=color;
  var hColor="#000000";
  var sColor="#ffcccc";

  function getPoints(){
    return [{x:from.sprite.absolute.x,y:from.sprite.absolute.y},{x:to.sprite.attrs.x,y:to.sprite.attrs.y}];
  }
  var tPoints=getPoints();
  var graphs={
    sprite:{what:"group"},
    line:{
      what:"dynamicLine",
      points: tPoints,
      strokeWidth: 2,
      stroke:"black"
    },
    indicator:{
      what:'dynamicCircle',
      x: utils.lerp(tPoints[0].x,tPoints[1].x,0.6),
      y: utils.lerp(tPoints[0].y,tPoints[1].y,0.6),
      radius: 7,
      fill: "#ffffff",
      strokeWidth: 1,
      interactive:true,
      stroke:"black"
    }
  }
  for(var a in graphs){
    if(a!="sprite") graphs[a].appendTo=this.sprite;
    var what=a;
    if(graphs[a].hasOwnProperty("what")) what=graphs[a].what;
    this[a]=drawer.create(what,graphs[a]);
  }
  this.remove=function(){
    sprite.destroyChildren();
    sprite.destroy();
  }

  var sprite=this.sprite;
  var line=this.line;
  var indicator=this.indicator;
  var mouseBending=false;
  mouse.Draggable.call(this,indicator);

  layer.add(sprite);

  this.update=function(e){
    tPoints=getPoints();
    if(mouseBending){
      tPoints=[tPoints[0],mouse.pos,tPoints[1]];
      // console.log(tPoints);/
    }else{
      indicator.position({
        x: utils.lerp(tPoints[0].x,tPoints[1].x,0.6),
        y: utils.lerp(tPoints[0].y,tPoints[1].y,0.6),
      });
    }
    line.change({
      points: tPoints
    });
  }

  this.highlight=function(){
    this.setStroke('red');
    setTimeout(function(){
      this.setStroke('black');
    },200);
  }



  this.on('mouseenter', function(e) {
    indicator.change({fill:hColor});
  });
  this.on('mouseout', function(e) {
    indicator.change({fill:cColor});
  });
  this.on('mousedown',function(e){
    mouseBending=true;
  });
  mouse.on('mouseup',function(e){
    if(mouseBending){
      var underMouse=e.underMouse[0];
      // console.log("up",e);
      if(e.underMouse.length>0){
        if(underMouse.type=="cModule"){
          createConnection(from.parent,null,null,underMouse);
          createConnection(underMouse,null,null,to);
          from.parent.unpatch(to);
        }else{
          console.log(e.underMouse);
        }
      }
    }
    mouseBending=false;
  });
  this.on('select',function(){
    console.log("select");
    cColor=hColor;
    indicator.change({fill:cColor});
  });
  this.on('deselect',function(){
    cColor=color;
    indicator.change({fill:cColor});
  });

  master.on('update',this.update);

}
//pendant: n nor a are needed here. Connecting model needs to be detangled and simplified a lot
createConnection=function(parent,n,a,b){
  if(parent.patchTo(b,n)){
    console.log("connected");
  }else{
    console.log("no copnnection made");
  }
}
removeConnection=function(connector){

}
//pendant:connector module should be part of the mode... maybe
ConnectorModule=function(parent,parentIndex,x,y){
  this.children=false;
  this.hover=false;
  this.parent=parent;
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
  mouse.Draggable.call(this,group);

  this.on('mouseenter', function(e) {
    circle.change({fill:hColor});;
  });
  this.on('mouseout', function(e) {
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
      if(!this.children) this.children=[];
      t_Cnm.children.push({child:who,connectorGraph:new ConnectorGraph(connectorsLayer,t_Cnm,who)});
    }
  }
  this.unplug=function(who){
    for(var a in t_Cnm.children){
      if(t_Cnm.children[a].child===who){
        t_Cnm.children[a].connectorGraph.remove();
        t_Cnm.children.splice(a,1);
        if(t_Cnm.children.length==0){
          t_Cnm.children=false;
        }
      }
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

  var connector=circle;

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

  mouse.Draggable.call(this,dragBody);

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
  //pendant: I am not being consisten in how an object that extends a clockable,
  //implements the click detection. some are calling the clickable handle when
  //the sprite handles the over and out events, and extending clickable itself
  //some others are extending clickable on the sprite
  //perhaps this one is the best method... but anyways I think that a object to
  //become clickable should only call one function, passing to thtat function
  //the sprite that detects the mouse

  this.on('dragging',function(e){
    connector.sprite.absolute={};
    connector.sprite.absolute.x=t_Cm.sprite.attrs.x+connector.sprite.attrs.x;
    connector.sprite.absolute.y=t_Cm.sprite.attrs.y+connector.sprite.attrs.y;
  });
  this.on('select',function(){
    console.log("select");
    cColor=hColor;
    dragBody.change({fill:cColor});
  });
  this.on('mouseenter',function(){
    dragBody.change({fill:hColor});
  });
  this.on('mouseout',function(){
    dragBody.change({fill:cColor});
  });

  this.on('deselect',function(){
    cColor=color;
    dragBody.change({fill:cColor});
  });
  //pendant: n not necessary here anymore
  this.patchTo=function(who,n){
    console.log(t_Cm.id+"plug to ",who);
    if(who===t_Cm){
      return false;
    }else{
      connector.plug(who);
      return true;
    }
  }
  this.unpatch=function(who){
    return connector.unplug(who);
  }
  this.sendToCh=function(which,what){
    if(t_Cm.hover){
      console.log("["+t_Cm.id+"]>>"+what);
    }
    var who=connector.children[which].child;
    connector.highlight();
    if(who)
    who.receive(what,t_Cm);
  }
  this.sendToAllCh=function(what){
    if(t_Cm.hover){
      console.log("["+t_Cm.id+"]>>"+what);
    }
    connector.highlight();
    for(var who of connector.children){
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



