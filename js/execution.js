//execution



var modules=[];
var modl={};
window.onload=function(){
  var layer = new Konva.Layer();
  var width = window.innerWidth;
  var height = window.innerHeight;
  var stage = new Konva.Stage({
    container: 'stage',
    width: width,
    height: height
  });

  for(var a=0; a<10; a++){
    modl=new CodeModule(layer,a);
    modules[a]=modl;
  }

  mouse.on('click',function(e){
    // console.log(e);
    for(var modl of modules){
      modl.onClick(e);
    }
  });

  function frame(vars) {
    for(var modl of modules)
      modl.draw(vars);
    layer.draw();
    requestAnimationFrame(frame);
  }

  function start(){


    // add the layer to the stage
    stage.add(layer);
    requestAnimationFrame(frame);

  }
  start();
};