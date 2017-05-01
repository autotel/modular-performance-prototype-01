'use strict';
var synth=new (function(){
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
  this.play=function(chan,note){
    // console.log(chan,note);
    if(chan==0){
      drumkit1.play(0);
    }else if(chan==1){
      synth1.play(note);
    }
  }
  return this;
})();
