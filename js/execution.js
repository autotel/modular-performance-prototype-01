//execution



var modules=[];
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
// don't know the listener, without internet right now
  // window.on('resize',function(e){
  //   var width = window.innerWidth;
  //   var height = window.innerHeight;
  //   stage.setWidth(width);
  //   stage.setHeight(height);
  // });

  for(var a=0; a<10; a++){
    var modl;
    modl=new CodeModule(layer,a);
    /*if(a==9){
      modl.mode(ModeCores.notePlayer);
    }else if(a==8){
      modl.mode(ModeCores.notePlayer);
    }else*/{
      modl.mode(ModeCores.dataMatrix);
    }
    modl.move({x:100,y:0})
    modules[a]=modl;
  }

  // modules[0].modeCore=new ModeCores.notePlayer(modules[0]);
  // modules[0].type="pModule";

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