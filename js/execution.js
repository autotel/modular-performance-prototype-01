//execution



var modules=[];
var modl={};
var connectorsLayer=new Konva.Layer();
var interactiveLayer=new Konva.Layer();

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
    modl.move({x:100,y:0})
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

    master.handle('frame',vars);
    connectorsLayer.draw();
    layer.draw();
    interactiveLayer.draw();
    requestAnimationFrame(frame);
  }

  function start(){
    // add the layer to the stage
    stage.add(connectorsLayer);
    stage.add(layer);
    stage.add(interactiveLayer);
    requestAnimationFrame(frame);

  }
  start();
};