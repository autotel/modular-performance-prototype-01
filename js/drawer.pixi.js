//pixi js
var drawer=(function(){
  var renderer;
  this.start=function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
  //  // var stage = new Konva.Stage({
    //   container: 'stage',
    //   width: width,
    //   height: height
    // });
      //Create the renderer
    renderer = PIXI.autoDetectRenderer(window.innerWidth,window.innerHeight, {backgroundColor : 0x1099bb});
    //Add the canvas to the HTML document
    document.body.appendChild(renderer.view);
    //Create a container object called the `stage`
    stage = new PIXI.Container();
    //Tell the `renderer` to `render` the `stage`
    renderer.view.style.position = "absolute";
    renderer.view.style.display = "block";
    renderer.autoResize = true;
    window.onresize = function(event) {
      renderer.resize(window.innerWidth, window.innerHeight);
    //   var width = window.innerWidth;
    //   var height = window.innerHeight;
    //   stage.setWidth(width);
    //   stage.setHeight(height);
    };
  }
  this.update=function(){
    renderer.render(stage);
  }
  var expand=function(){
    this.move=function(x,y){
      this.x=x;
      this.y=y;
    }
  }
  var create={
    text:function(props){
      var ret = new PIXI.Text('',props.text);
      ret._AETNAME="text";
      if(props.appendTo) props.appendTo.addChild(ret);
      return ret;
    },
    rect:function(props){
      var ret = new PIXI.Graphics();
      ret._AETNAME="rect";
      if((props.color|props.fill)!==undefined) ret.beginFill(props.color|props.fill);
      if((props.stroke|props.strokeWidth)!==undefined) ret.lineStyle(props.strokeWidth|1, props.stroke|0x00, props.strokeAlpha|1);
      ret.drawRect(props.x, props.y, props.width, props.height);
      ret.endFill();
      if(props.appendTo) props.appendTo.addChild(ret);
      return ret;
    },
    circle:function(props){
      var ret = new PIXI.Graphics();
      ret._AETNAME="circle";
      if((props.color|props.fill)!==undefined) ret.beginFill(props.color|props.fill);
      if((props.stroke|props.strokeWidth)!==undefined) ret.lineStyle(props.strokeWidth|1, props.stroke|0x00, props.strokeAlpha|1);
      ret.drawCircle(props.x|0, props.y|0, props.radius|0);
      if(props.appendTo) props.appendTo.addChild(ret);
      return ret;
    },
    group:function(props){
      if(!props) props={};
      var ret= new PIXI.Container();
      ret._AETNAME="group";
      expand.call(ret);
      for(var a in props){
        ret[a]=props[a];
      }

      if(props.appendTo) props.appendTo.addChild(ret);
      return ret;
    },
    layer:function(props){
      return create.group(props);
    },
    line:function(props){
      // console.log("draw line", props);
      var ret = new PIXI.Graphics();
      ret._AETNAME="line";
      ret.lineStyle(props.strokeWidth, props.stroke, props.alpha);
      for(var a in props.points){
        if(a==0){
          ret.moveTo(props.points[0].x, props.points[0].y);
        }else{
          ret.lineTo(props.points[a].x,props.points[a].y);
        }
      }
      if(props.appendTo) props.appendTo.addChild(ret);
      return ret;
    },
    dynamicLine:function(props){
      return create.dynamic('line',props);
    },
    dynamicRect:function(props){
      return create.dynamic('rect',props);
    },
    dynamicText:function(props){
      return create.dynamic('text',props);
    },
    dynamicCircle:function(props){
      return create.dynamic('circle',props);
    },
    dynamic:function(what,props){
      var ret= new PIXI.Container();
      var appendTo=props.appendTo;
      props.appendTo=ret;
      var myElem=create[what](props);
      ret.addChild(myElem);
      ret.change=function(newProps){
        ret.removeChildren();
        myElem.destroy();
        for(var a in newProps){
          props[a]=newProps[a];
        }
        myElem=create[what](props);
        ret.addChild(myElem);
      }
      if(appendTo) appendTo.addChild(ret);
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
