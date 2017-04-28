var Message=function(data){
  var tMessage=this;
  if(data.length==0){
    console.log("data is invalid");
    return false;
  }
  this.data=data;
  this.header=function(){
    return data[0];
  }
  this.payload=function(){
    return data.slice(1,data.length);
  }
  this.headerFunction={
    set:function(to){
      //mask data removing current headerAddress
      data[0]&=0x0F;
      //add new headerFunction
      data[0]|=(to<<4)&0xF0;
      if(to>15)
      console.warn("function header overflow! "+to+" became "+data[0]);
    },
    get:function(to){
      return (data[0]&0xF0)>>4;
    },
  }
  this.headerAddress={
    set:function(to){
      //mask data removing current headerFunction
      data[0]&=0xF0;
      //add new headerAddress
      data[0]|=to&0x0F;
      if(to>15)
      console.warn("function header overflow! "+to+" became "+data[0]);
    },
    get:function(to){
      return data[0]&0xf;
    },
  }
  this.log=function(){
    var hexString="[";
    for(var a of data){
      hexString+="0x"+a.toString(16)+",";
    }
    hexString+="]";
    console.log(hexString,data);
  }
  return this;
}
