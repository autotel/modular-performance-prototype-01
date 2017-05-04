'use strict';
var utils=new (function(){
  var names={};
  this.newName=function(p){
    if(names.hasOwnProperty(p)){
      names[p]++;
    }else{
      names[p]=0;
    }
    return p+names[p];
  }
  
  this.average=function(list){
    var factor=1/list.length;
    var ret=0;
    for(var a of list){
      ret+=a*factor;
    }
    return ret;
  }
  this.average=function(a,b){
    return (a+b)*0.5;
  }
  this.lerp=function(a,b,f){
    return a + f * (b - a);
  }
  this.HSVtoRGB= function (h, s, v) {
    //from http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
      var r, g, b, i, f, p, q, t;
      if (arguments.length === 1) {
          s = h.s, v = h.v, h = h.h;
      }
      i = Math.floor(h * 6);
      f = h * 6 - i;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);
      switch (i % 6) {
          case 0: r = v, g = t, b = p; break;
          case 1: r = q, g = v, b = p; break;
          case 2: r = p, g = v, b = t; break;
          case 3: r = p, g = q, b = v; break;
          case 4: r = t, g = p, b = v; break;
          case 5: r = v, g = p, b = q; break;
      }
      return {
          r: Math.round(r * 255),
          g: Math.round(g * 255),
          b: Math.round(b * 255)
      };
  }
  return this;
})();