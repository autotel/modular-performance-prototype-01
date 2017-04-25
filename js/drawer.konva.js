//pixi js
var drawer=(function(){
  var tDrawer=this;
  var renderer;
  var layers=[];
  var stage;
  this.stage=stage;
  this.start=function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    tDrawer.stage=stage = new Konva.Stage({
      container: 'stage',
      width: width,
      height: height
    });

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = width;

    window.onresize = function(event) {
      width = window.innerWidth;
      height = window.innerHeight;
      stage.setWidth(width);
      stage.setHeight(height);
    };
  }
  this.update=function(){
    // renderer.render(stage);
    for(var a of layers){
      a.draw();
    }
  }
  var extendedfn=function(){
    this.move=function(x,y){
      this.attr.x=x;
      this.attr.y=y;
    }
  }
  var create={
    text:function(props){
      // console.log("dr text",props);
      var ret = new Konva.Text(props);
      if(props.appendTo) props.appendTo.add(ret);
      return ret;
    },
    rect:function(props){
      var ret = new Konva.Rect(props);
      if(props.appendTo) props.appendTo.add(ret);
      return ret;
    },
    circle:function(props){
      var ret = new Konva.Circle(props);
      if(props.appendTo) props.appendTo.add(ret);
      return ret;
    },
    group:function(props){
      if(!props) props={};
      if(props.x!==undefined) if(isNaN(props.x)) console.error("x isNAN");
      var ret= new Konva.Group(props);
      // extendedfn.call(ret);
      if(props.appendTo) props.appendTo.add(ret);
      return ret;
    },
    layer:function(props){
      var ret=new Konva.Layer();
      layers.push(ret);
      return ret;
    },
    line:function(props){
      var serializedPoints=[];
      for(var a in props.points){
        serializedPoints.push(props.points[a].x);
        serializedPoints.push(props.points[a].y);
      }
      props.points=serializedPoints;
      // console.log("draw line", props);
      var ret = new Konva.Line(props);
      if(props.appendTo) props.appendTo.add(ret);
      return ret;
    },
    dynamicLine:function(props){
      return create.dynamic('line',props);
    },
    dynamicRect:function(props){
      return create.dynamic('rect',props);
    },
    dynamicGroup:function(props){
      return create.dynamic('group',props);
    },
    dynamicText:function(props){
      return create.dynamic('text',props);
    },
    dynamicCircle:function(props){
      return create.dynamic('circle',props);
    },
    dynamic:function(what,props){
      var ret= create[what](props);
      ret.change=function(newProps){
        for(var a in newProps){
          if(a=='x'){
            ret.attrs.x=newProps.x;
          }else if(a=='y'){
            ret.attrs.y=newProps.y;
          }else if(a=='width'){
            ret.setWidth(newProps.width);
          }else if(a=='height'){
            ret.setHeight(newProps.height);
          }else if(a=='points'){
            var serializedPoints=[];
            for(var a in newProps.points){
              serializedPoints.push(newProps.points[a].x);
              serializedPoints.push(newProps.points[a].y);
            }
            newProps.points=serializedPoints;

            ret.setPoints(newProps.points);
          }else if(a=='fill'){
            // console.log(newProps.fill);
            ret.setFill(newProps.fill);
          }else if(a=='stroke'){
            ret.setStroke(newProps.color);
          }else if(a=='text'){
            ret.setText(newProps.text);
          }else{
            ret[a]=newProps[a];
          }
        }
      }
      return ret;
    }
  };
  this.create=function(what,props){
    if(create.hasOwnProperty(what)){
      // console.log("drawing a "+what,props);
      return create[what](props);
    }else{
      console.error( "drawer error: I don't have a routine to create a "+what);
    }
  }
  // this.createStruct=function(scheme){
  //   var ret=create.group();
  //   this.group=ret;
  //   this.sprite=ret;
  //   for(var a in props){
  //     var spropa=a.split(".");
  //     var elementType=spropa[0];
  //     var elementName=spropa[spropa.length-1];
  //     props[a].appendTo=ret;
  //     this[elementName]=drawer.create(elementType,props[a]);
  //   }
  //   return ret;
  // }
  return this;
})();
