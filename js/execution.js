//execution



var modules=[];
var connectorsLayer=drawer.create('group');
var interactiveLayer=drawer.create('group');
var layer = drawer.create('group');
var stage;
window.onload=function(){
  var width = window.innerWidth;
  var height = window.innerHeight;
//  // var stage = new Konva.Stage({
  //   container: 'stage',
  //   width: width,
  //   height: height
  // });

    //Create the renderer
  var renderer = PIXI.autoDetectRenderer(window.innerWidth,window.innerHeight, {backgroundColor : 0x1099bb});
  //Add the canvas to the HTML document
  document.body.appendChild(renderer.view);
  //Create a container object called the `stage`
  stage = new PIXI.Container();
  //Tell the `renderer` to `render` the `stage`

  renderer.view.style.position = "absolute";
  renderer.view.style.display = "block";
  renderer.autoResize = true;

// don't know the listener, without internet right now
  window.onresize = function(event) {
    renderer.resize(window.innerWidth, window.innerHeight);
  //   var width = window.innerWidth;
  //   var height = window.innerHeight;
  //   stage.setWidth(width);
  //   stage.setHeight(height);
  };

  stage.addChild(connectorsLayer);
  stage.addChild(interactiveLayer);
  stage.addChild(layer);
  var b=drawer.create("group",{appendTo:layer});
  var a=drawer.create("group",{appendTo:b});
  drawer.create('circle',{fill:0xff0000,x:20,y:20,radius:10,appendTo:a});
  // var rectangle = new PIXI.Graphics();
  // rectangle.lineStyle(4, 0xFF3300, 1);
  // rectangle.beginFill(0x66CCFF);
  // rectangle.drawRect(0, 0, 64, 64);
  // rectangle.endFill();
  // rectangle.x = 170;
  // rectangle.y = 170;
  // stage.addChild(rectangle);

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

  function update(vars) {
    for(var modl of modules)
      modl.update(vars);
    renderer.render(stage);
    master.handle('update',vars);
    // connectorsLayer.draw();
    // layer.draw();
    // interactiveLayer.draw();
    requestAnimationFrame(update);
  }

  function start(){
    // add the layer to the stage

    requestAnimationFrame(update);

  }
  start();
};