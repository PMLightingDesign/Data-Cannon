const cluster = require('cluster');
const sACNSocket = require('./sacnSocket.js');

let Iface = sACNSocket.bestIface();

if(typeof(process.argv[2]) != 'undefined'){
  Iface = process.argv[2];
}

if (cluster.isMaster) {
  console.log("Starting Cannon on: " + Iface);
  for (let i = 0; i < 50; i++) {
    cluster.fork();
  }
} else {
  let socket = new sACNSocket(Iface, cluster.worker.id);
  console.log("Universe " + cluster.worker.id + " online...");

  let level = 0;
  let fadeUp = true;

  setInterval(function(){
    if(fadeUp){
      level += 5;
    } else {
      level -= 5;
    }

    if(level > 255){
      level = 255;
      fadeUp = false;
    } else if(level < 0) {
      level = 0;
      fadeUp = true;
    }

    let data = new Uint8ClampedArray(512).fill(level);

    socket.data = data;
    socket.send();
  }, 50)
}
