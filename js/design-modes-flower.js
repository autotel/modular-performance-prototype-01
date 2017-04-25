(function(){
  var nColor="#777777";
  var sColor="#FFFFFF";
  var hColor="#AAAAAA";
  var hoverColor="#ddddFF";
  var tCoreMan=this;

  var noteColors=[
    "#FF0000",
    "#FF9900",
    "#FFD500",
    "#BBFF00",
    "#44FF00",
    "#00FFA2",
    "#00FFE1",
    "#00D0FF",
    "#0048FF",
    "#8000FF",
    "#BB00FF",
    "#FF00B7",
  ];
  var RadialButton=function(owner,props){
    var cColor=nColor;
    var sprite=drawer.create('dynamicCircle',{x:Math.cos(Math.PI*2*props.num/props.over)*40,y:Math.sin(Math.PI*2*props.num/props.over)*40,fill:cColor,radius:7});
    var playsNote=false;
    var note=36;
    var noteColor="#000000";
    var tButton=this;
    var updateNoteColor=function(){
      noteColor=noteColors[note%12];
    }
    this.note=0;
    owner.sprite.add(sprite);
    mouse.Clickable.call(this,sprite);
    this.on('mouseenter',function(){
      cColor=hoverColor;
      sprite.change({fill:cColor});
    });this.on('mouseout',function(){
      cColor=this.selected?sColor:(playsNote?noteColor:nColor);
      sprite.change({fill:cColor});
    });this.on('select',function(){
      cColor=sColor;
      sprite.change({fill:cColor});
    });this.on('deselect',function(){
      cColor=playsNote?noteColor:nColor;
      sprite.change({fill:cColor});
    });keyboard.on('keydown',function(e){
      if(tButton.selected) if(e.keyCode===46){
        playsNote=false;
        cColor=sColor;
        sprite.change({fill:cColor});
      }
    });
    mouse.on('wheel',function(e){
      if(tButton.selected){
        playsNote=true;
        note-=e.delta;
        console.log(note);
        updateNoteColor();
        sprite.change({fill:noteColor});
      }
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