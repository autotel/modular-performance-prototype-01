
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
  master.on('frame',this.update);

}
createConnection=function(parent,a,b){
  if(parent.patchTo(b)){
    new ConnectorGraph(connectorsLayer,a,b);
  }
}
removeConnection=function(connector){

}
ConnectorModule=function(parent,x,y){
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
        createConnection(parent,t_Cnm,umo);
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
  var children=[];
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
    width: 50,
    height: 50,
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
  this.modeCore=new ModeCores.BlankGrid();
  group.add(this.modeCore.sprite);
  var t_Sz=[rect.getWidth(),rect.getHeight()];
  var t_q=5;
  for(var a=0; a<t_q; a++){
    var circle=new ConnectorModule(t_Cm,t_Sz[0]-15,(t_Sz[1]/t_q)*a+(t_Sz[1]/(t_q*2))-25);
    group.add(circle.sprite);
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
  this.overrideHover=function(){
    for(var t of connectors){
      if(t.hover)
      return true;
    }
    return false;
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

  this.patchTo=function(who){
    if(who===t_Cm){
      return false;
    }else if(children.indexOf(who)!=-1){
      return false;
    }else{
      children.push(who);
      return true;
    }
  }
  this.unpatch=function(who){
    children.splice(children.indexOf(who),1);
    return true;
  }
}



