ModeCores=(function(){
  var t_coreMan=this;
  this.Blank=function(){
    var t_core=this;
    this.sprite=new Konva.Group();


    this.update=function(){};
    this.draw=function(){};
    this.onClock=function(){};
    this.onSignal=function(e){};
  }
  this.squareButton=function(props){
    var t_sq=this;
    var hColor="white";
    var nColor="grey";
    var aColor="blue";
    var cColor=nColor;
    props.fill=cColor;
    var active=false;
    var rect=new Konva.Rect(props);
    rect.on('mouseover', function(e) {
      // console.log("aa");
      rect.setFill(hColor);
    });
    rect.on('mouseout', function(e) {
      // console.log("aa");
      rect.setFill(cColor);
    });
    rect.on('click',function(){
      active=active==false;
      cColor=(active ? aColor : nColor);
      rect.setFill(cColor);
    });
    mouse.Clickable.call(rect);
    this.sprite=rect;
  }
  this.BlankGrid=function(){
    var t_core=this;
    t_coreMan.Blank.call(this);
    var buttonGraphs=[];
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
      var rect=new t_coreMan.squareButton(props);
      buttonGraphs.push(rect);
      t_core.sprite.add(rect.sprite);
    }
  }
  return this;
})();