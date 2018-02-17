'use strict';

const sACNPacket = require('./packet.js').sACNPacket;
const dgram = require('dgram');
const os = require('os');

let udp = dgram.createSocket('udp4');

class sACNSocket{
  //Arguments
  //IP: The address to bind to
  //Universes: An array with the universe numbers to bind to, 0 indexed
  //Priorities: An array with the universe priorities
  constructor(ip, universe){
    this.universe = universe;

    this.mcadr = '239.255.0.' + universe;

    console.log("Starting on " + ip);
    console.log("Broadcasting to " + this.mcadr);

    this.packet = new sACNPacket(universe, 100);

    this.socket = 5568;

    this.data = new Uint8ClampedArray(512);

    process.on('exit', function(){
      udp.close();
    });
  }


  send(){
    this.packet.output.set(this.data, 126);
    this.packet.tick();
    let msg = new Buffer(this.packet.output);
    udp.send(msg, 5568, this.mcadr, function(err){
      if(err){
        console.log(err);
      }
    });
  }

  static ifacesGood(){
    let ifaces = os.networkInterfaces();
    let addresses = [];
    for (let key in ifaces) {
      for (let k2 in ifaces[key]) {
        let address = ifaces[key][k2];
        if (address.family === 'IPv4' && !address.internal) {
          let octetA = address.address.split('.')[0];
          if(octetA == 192 || octetA == 10 || octetA == 172){
            addresses.push(address.address);
          }
        }
      }
    }
    return addresses;
  }

  static bestIface(){
    let addresses = sACNSocket.ifacesGood();
    return addresses[0];
  }
}

module.exports = sACNSocket;
