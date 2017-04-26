//execution



var modules=[];
var connectorsLayer=drawer.create('layer');
var interactiveLayer=drawer.create('layer');
var layer = drawer.create('layer');
var stage;
window.onload=function(){
  drawer.start();
// don't know the listener, without internet right now


  drawer.stage.add(connectorsLayer);
  drawer.stage.add(interactiveLayer);
  drawer.stage.add(layer);

  // layer.add(new Konva.Circle({
  //     x: stage.getWidth() / 2,
  //     y: stage.getHeight() / 2,
  //     radius: 70,
  //     fill: 'red',
  //     stroke: 'black',
  //     strokeWidth: 4
  //   }));
  //   layer.draw();

  var b=drawer.create("group",{appendTo:layer});
  var a=drawer.create("group",{appendTo:b});
  drawer.create('circle',{fill:"#ff0000",x:20,y:20,radius:10,appendTo:a});
  // var rectangle = new PIXI.Graphics();
  // rectangle.lineStyle(4, "#FF3300", 1);
  // rectangle.beginFill("#66CCFF");
  // rectangle.drawRect(0, 0, 64, 64);
  // rectangle.endFill();
  // rectangle.x = 170;
  // rectangle.y = 170;
  // stage.add(rectangle);
  var shoplist=[
    'licog',
    'monitor',
    'flower',
    'licog',
    'monitor',
    'flower',
    'licog',
    'monitor',
    'flower',
    'licog',
    'monitor',
    'flower',
    'licog',
    'flower',
    'licog',
    'flower',
    'licog',
    'flower',
    'licog',
    'flower',
  ];
  var c=0;
  for(var element of shoplist){
    var modl;
    modl=new CodeModule(layer,c);
    modl.mode(ModeCores[element]);
    modl.move({x:100,y:30*(10-c)});
    modules[a]=modl;
    c++;
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
    drawer.update();
    master.handle('update',vars);
    requestAnimationFrame(update);
  }

  function start(){
    // add the layer to the stage

    requestAnimationFrame(update);

  }
  start();
};