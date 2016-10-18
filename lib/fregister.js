var EventEmitter = require('events').EventEmitter;
var util = require('util');

util.inherits(FRegister, EventEmitter);

/**
 * Create a register
 * @param {[type]} options [description]
 */
function FRegister(options){
  EventEmitter.call(this);
  this.name = options.name;
  this.spray = options.spray;
  this.vector = options.vector;
  this.broadcast = options.broadcast;
  this.value = {};
  var self = this;
  this.broadcast.on("receive",function(data){
    console.log("[FOGLET:"+self.name+"] Receive a new value");
    self.value=data;
    console.log(self.value);
    /**
     * Emit a message on the signal this.name+"-receive" with the data associated
     * @param  {[type]} self.name+"-receive" [description]
     * @param  {[type]} self.value           [description]
     * @return {[type]}                      [description]
     */
    self.emit(self.name+"-receive",self.value);
  });
}

/**
 * [function description]
 * @return {[type]} [description]
 */
FRegister.prototype.getValue=function(){return this.value};

/**
 * [function description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
FRegister.prototype.setValue = function(data){
  this.value=data;
  this.send();
};

/**
 * [function description]
 * @return {[type]} [description]
 */
FRegister.prototype.send = function(){
  this.broadcast.send(this.getValue(),this.vector.increment());
};

module.exports.FRegister = FRegister;
