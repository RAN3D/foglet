function FRegister(options){
  this.name = options.name;
  this.spray = options.spray;
  this.vector = options.vector;
  this.broadcast = options.broadcast;
  this.value = {};
  this.broadcast.on("receive",function(data){
    console.log("[FOGLET:"+this.name+"] Receive a new value");    
    this.value=data;
    console.log(this.value);
  });
}

FRegister.prototype.getValue=function(){return this.value};

FRegister.prototype.setValue = function(data){
  this.value=data;
  console.log("New value : ");
  console.log(this.value);
  this.send();
};

FRegister.prototype.send = function(){
  this.broadcast.send(this.getValue(),this.vector.increment());
};

module.exports.FRegister = FRegister;
