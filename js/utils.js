var utils=(function(){
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
  return this;
})();