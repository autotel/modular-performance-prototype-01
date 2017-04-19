// var synthBase=function(){
//   this.play=function(a){};
// }
var synth=(function(){
  var Drumkit=function(){
    var options={};
    this.name="drumkit1";
    // synthBase.call(this);
    var engine;
    engine=new Tone.MetalSynth (options);
    engine.toMaster();
    this.play=function(note){
      console.log("play dr");
      engine.triggerAttackRelease (1);
    }
    return this;
  };
  var Synth1=function(){
    var options={};
    this.name="synth1";
    // synthBase.call(this);
    var engine;
    engine=new Tone.AMSynth (options);
    engine.toMaster();
    this.play=function(note){
      console.log("play sn");
      engine.triggerAttackRelease (parseInt( 32+note), "4n");
    }
    return this;
  };
  var drumkit1=new Drumkit();
  var synth1=new Synth1();
  this.synth1=synth1;
  this.drumkit1=drumkit1;
  return this;
})();
