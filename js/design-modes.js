ModeCores=(function(){
  var tCoreMan=this;
  this.Blank=function(){
    var tCore=this;
    this.sprite=new Konva.Group();
    this.update=function(){};
    this.draw=function(){};
    this.onClock=function(){};
    this.onSignal=function(e){};
    this.send=function(a){
      console.log("would send ",a);
    };
    metronome.on('beat',function(){tCore.onClock()});
    master.on('frame',function(){tCore.draw();tCore.update();});
  }
  this.squareButton=function(props){
    var hColor="white";
    var nColor="grey";
    var aColor="blue";
    var cColor=nColor;
    props.fill=cColor;
    var hovered=false;
    var active=false;
    var rect=new Konva.Rect(props);
    rect.on('mouseover', function(e) {
      // console.log("aa");
      rect.setFill(hColor);
      hovered=true;
    });
    rect.on('mouseout', function(e) {
      // console.log("aa");
      rect.setFill(cColor);
      hovered=false;
    });
    rect.on('click',function(){
      active=!active;
      cColor=(active ? aColor : nColor);
      rect.setFill(cColor);
    });
    this.highlight=function(){
      cColor=(active ? aColor : hColor);
      rect.setFill(cColor);
    };
    this.unHighlight=function(){
      cColor=(active ? aColor : (hovered ? hColor : nColor));
      rect.setFill(cColor);
    };
    this.getActive=function(){
      return active;
    }
    this.setActive=function(a){
      active=a;
    }
    mouse.Clickable.call(rect);
    this.sprite=rect;
  }
  this.BlankGrid=function(){
    var tCore=this;
    tCoreMan.Blank.call(this);
    var gridButtons=[];
    this.gridButtons=gridButtons;
    var textGraph=new Konva.Text();
    this.sprite.add(textGraph);
    var pitch=10;
    var displace={x:-20,y:-14};
    for(var a =0;a <16; a++){
      var props={x:(a%4)*pitch+displace.x,y:Math.floor(a/4)*pitch+displace.y};
      props.width=pitch-1;
      props.height=pitch-1;
      props.fill="red";
      props.stroke="black";
      var rect=new tCoreMan.squareButton(props);
      gridButtons.push(rect);
      tCore.sprite.add(rect.sprite);
    }
  }
  this.SequencerGrid=function(){
    var tCore=this;
    tCoreMan.BlankGrid.call(this);
    var currentStep=0;
    var patLen=4;
    this.update=function(){};
    this.draw=function(){
      for(var a in tCore.gridButtons){
        if(a%4==currentStep){
          tCore.gridButtons[a].highlight();
        }else{
          tCore.gridButtons[a].unHighlight();
        }
      }
    };
    this.onClock=function(){
      currentStep++;
      currentStep%=patLen;
      for (var a = currentStep; a < tCore.gridButtons.length; a+=4) {
        if(tCore.gridButtons[a].getActive()){
          tCore.send(Math.floor(a/4));
        };
      }
    };
    this.onSignal=function(e){};
  }
  return this;
})();








