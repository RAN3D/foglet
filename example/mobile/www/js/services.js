var Foglet = require("foglet");


angular.module('starter.services', [])

  .factory('Fog', function () {
    /**
     * Create the foglet protocol.
     * @param {[type]} {protocol:"chat"} [description]
     */
    var foglet = new Foglet({
      protocol: "chat",
      room: "sondage"
    });

    /**
     * Init the foglet
     * @return {[type]} [description]
     */
    foglet.init();

    /**
     * Not usefull, it's just in case of a received message from Foglet
     * @param  {[type]} "receive"        [description]
     * @param  {[type]} function(message [description]
     * @return {[type]}                  [description]
     */
    foglet.on("receive", function (message) {
      console.log(message);
    });


    /**
     * Connect the client to another peer of the network.
     * @return {[type]} [description]
     */
//function connect(){
    foglet.connection();

    /**
     * Not usefull, Send a message over Foglet
     * @param  {[type]} msg [description]
     * @return {[type]}     [description]
     */
    function sendMessage(msg) {
      foglet.sendMessage(msg);
    }

    /**
     * Create a register named toto
     * @param {[type]} "toto" [description]
     */
    foglet.addRegister("toto");

    /**
     * Get the register
     * @param  {[type]} "toto" [description]
     * @return {[type]}        [description]
     */
    var toto = foglet.getRegister("toto");

    /**
     * Listening on the signal toto-receive where every data are sent when the register is updated.
     * @param  {[type]} "toto-receive" [description]
     * @param  {[type]} function(data  [description]
     * @return {[type]}                [description]
     */
    toto.on("toto-receive", function (data) {
      changeData(toto.getValue());
    });

    function changeData(value) {
      console.log("data changed: ", value)
    }

    function setVotes(value){
      toto.setValue(value);
      changeData(toto.getValue());
    }



    return {
      addYes: function () {
        value = toto.getValue();
        setVotes([++value[0], value[1]]);
      },
      addNo: function () {
        value = toto.getValue();
        setVotes([value[0], ++value[1]]);
      },
      get: function (chatId) {
        return null;
      }
    };
  });
