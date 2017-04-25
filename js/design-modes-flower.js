(function(){
  var nColor="#777777";
  var sColor="#FFFFFF";
  var hColor="#AAAAAA";
  var hoverColor="#ddddFF";
  var tCoreMan=this;

  var RadialButton=function(owner,props){
    var cColor=nColor;
    var sprite=drawer.create('dynamicCircle',{x:Math.cos(Math.PI*2*props.num/props.over)*40,y:Math.sin(Math.PI*2*props.num/props.over)*40,fill:cColor,radius:7});
    owner.sprite.add(sprite);
    mouse.Clickable.call(this,sprite);
    this.on('mouseenter',function(){
      cColor=hoverColor;
      sprite.change({fill:cColor});
    });this.on('mouseout',function(){
      cColor=nColor;
      sprite.change({fill:cColor});
    });
  }
  this.flower=function(owner){
    var tFlower=this;
    this.sprite=drawer.create('group',{});
    var sprite=this.sprite;
    tCoreMan.Blank.call(this,owner);
    var gui={
      sequencerButtons:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      inputTypeSelector:{x:0,y:0},
      scaleMomentarySelector:{x:0,y:10},
      noteMomentarySelector:{x:0,y:-10}
    }
    var len=gui.sequencerButtons.length;
    for(var a in gui.sequencerButtons){
      gui.sequencerButtons[a]=new RadialButton(tFlower,{num:a,over:len});
    }
  }

  return this;
}).call(ModeCores);