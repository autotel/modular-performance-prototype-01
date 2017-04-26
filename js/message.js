var message=function(data){
  if(data.length==0){
    console.log("data is invalid");
    return false;
  }
  this.data=data;
  this.header=function(){
    return data[0];
  }
  return this;
}