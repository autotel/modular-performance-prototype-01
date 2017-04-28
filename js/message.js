var Message=function(data){
  //I made this class to simulate message communication in a hardware situation
  //it is utterly useless in the context of javascript
  var tMessage=this;
  var headerLocation=0;


  if(data.length==0){
    console.log("data is invalid");
    return false;
  }
  if(data.length>3){
    //if data longer than three, we use a long message configuration
    headerLocation=1;
    data.unshift(0xF0);
    data.push(0x0F);
  }
  this.data=data;
  this.header=function(){
    return data[headerLocation];
  }
  this.payload=function(){
    return data.slice(headerLocation+1,data.length);
  }
  this.headerFunction={
    set:function(to){
      //mask data removing current headerAddress
      data[headerLocation]&=0x0F;
      //add new headerFunction
      data[headerLocation]|=(to<<4)&0xF0;
      if(to>15)
      console.warn("function header overflow! "+to+" became "+data[headerLocation]);
    },
    get:function(to){
      return (data[headerLocation]&0xF0)>>4;
    },
  }
  this.headerAddress={
    set:function(to){
      //mask data removing current headerFunction
      data[headerLocation]&=0xF0;
      //add new headerAddress
      data[headerLocation]|=to&0x0F;
      if(to>15)
      console.warn("function header overflow! "+to+" became "+data[headerLocation]);
    },
    get:function(to){
      return data[headerLocation]&0xf;
    },
  }
  this.log=function(){
    var hexString="[";
    for(var a in data){
      hexString+="0x"+data[a].toString(16);
      if(headerLocation==a)
      hexString+="(h)"
      if(a!=data.length-1)
      hexString+=",";
    }
    hexString+="]";
    console.log(hexString,data);
  }
  return this;
}
