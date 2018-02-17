class RGBW {
  constructor(opts) {
    if(typeof(opts) == 'undefined'){
      this.applyFunction(function(){
        return 0;
      });
    } else {
      this.r = (opts.r);
      this.g = (opts.g);
      this.b = (opts.b);
      this.w = (opts.w);
    }
  }

  applyFunction(func){
    this.r = func();
    this.g = func();
    this.b = func();
    this.w = func();
  }

  applyFunctionIndex(func){
    this.r = func(0);
    this.g = func(1);
    this.b = func(2);
    this.w = func(3);
  }

  applyFunctionOpts(opts, func){
    this.r = func(opts);
    this.g = func(opts);
    this.b = func(opts);
    this.w = func(opts);
  }

  applyFunctionKey(func, opts){
    this.r = func('r', opts);
    this.g = func('g', opts);
    this.b = func('b', opts);
    this.w = func('w', opts);
  }

  lerpColor(pos, color){
    return new RGBW({
      r: Num.lerp(this.r, color.r, pos),
      g: Num.lerp(this.g, color.g, pos),
      b: Num.lerp(this.b, color.b, pos),
      w: Num.lerp(this.w, color.w, pos)
    });
  }

  setColorHTP(color){
    let r = Math.max(this.r, color.r);
    let g = Math.max(this.g, color.g);
    let b = Math.max(this.b, color.b);
    let w = Math.max(this.w, color.w);
    this.setColor(r, g, b, w);
  }

  setColor(r, g, b, w){
    if(typeof(g) == 'undefined' && typeof(b) == 'undefined'){
      this.r = r.r;
      this.g = r.g;
      this.b = r.b;
      this.w = r.w;
    } else {
      this.r = r;
      this.b = b;
      this.g = g;
      this.w = w;
    }
  }

  static random(){
    let rand = new RGBW();
    rand.applyFunction(function(){
      return Math.round(Math.random() * 100);
    });
    return rand;
  }

  static wiggle(config){
    let color =  new RGBW()
    color.applyFunctionKey(function(key, opts){
      let val = opts[key] + (Math.random() - 0.5) * opts[key + 'v'];
      if (val < 0) { val = 0}
      if (val > 100) { val = 100}
      return Math.round(val);
    }, config);
    return color;
  }
}

module.exports.RGBW = RGBW;

class Color {
  constructor(hexColor){
    this._hex = typeof hexColor !== 'undefined' ? hexColor : '#000000';
    this._color = new Uint8Array(3);
    this.updateFromHex();
  }

  updateFromHex(){
    this._color = Color.hexToRgb(this._hex);
  }

  updateFromColor(){
    this._hex = Color.rgbToHexFast(this._color[0], this._color[2], this._color[2]);
  }

  hex(color){
    if(color){
      this._hex = color;
      this.updateFromHex();
    }
    return this._hex;
  }

  color(color){
    if(color){
      if(color.length){
        if (color.length === 3){
          this._color = color;
          this.updateFromColor();
        }
      }
    }
    return this._color;
  }

  shadeColor(shade){
    shade = Math.round(shade);
    this._color[0] += Math.min(255, Math.max(shade, -255));
    this._color[1] += Math.min(255, Math.max(shade, -255));
    this._color[2] += Math.min(255, Math.max(shade, -255));
    this.updateFromRGB();
    return this._color;
  }

  adjustColor(r, g, b){
    this._color[0] += Math.round(r);
    this._color[1] += Math.round(g);
    this._color[2] += Math.round(b);
    this.updateFromRGB();
    return this._color;
  }

  static rgbToHexFast(r, g, b){
    return "#" + Color.componentToHex(r) + Color.componentToHex(g) + Color.componentToHex(b);
  }

  static random(){
    return Color.rgbToHex(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255));
  }

  static randomWithLimits(rBase, rMult, gBase, gMult, bBase, bMult){
    return Color.rgbToHex(Math.round(Math.random() * rMult + rBase), Math.round(Math.random() * gMult + gBase), Math.round(Math.random() * bMult + bBase));
  }

  static rgbToHex(r, g, b) {
    return "#" + Color.componentToHex(Math.round(r)) + Color.componentToHex(Math.round(g)) + Color.componentToHex(Math.round(b));
  }

  static hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
  }

  static componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  static toRGBW(hex){
    let newColor = Color.hexToRgb(hex);
    return {
      r: Math.round(newColor[0] / 255 * 100),
      g: Math.round(newColor[1] / 255 * 100),
      b: Math.round(newColor[2] / 255 * 100),
      w: 0
    }
  }
}

class Num {
  static lerp(a, b, pos){
    return a + (pos) * (b - a);
  }

  static lerp2(a, b, pos, scale){
    return a + (pos / scale) * (b - a);
  }

  static round(number, precision) {
    let factor = Math.pow(10, precision);
    let tempNumber = number * factor;
    let roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  static uint8(number){
    number = Math.round(number);
    if (number > 255){
      number = 255;
    } else if (number < 0){
      number = 0;
    }
    return number;
  }
}

class ArrayUtil {
  static string(array){
    let output = '';
    if (array){
      for (let i = 0; i < array.length; i++){
        output += array[i];
        if(i < (array.length - 1)){
          output += ',';
        }
      }
    }
    return output;
  }
}

class Uint8ArrayUtil extends ArrayUtil {
  //Expands arrays, defaults to trple length array
  static expand(array, factor){
    if (array){
      factor = typeof factor !== 'undefined' ? factor : 3;
      let output = new Uint8Array(Math.floor(array.length * factor));
      for(let i = 0; i < output.length; i++){
        output[i] = array[Math.floor(i / factor)];
      }
    } else {
      return (new Uint8Array());
    }
  }

  static lerpArray(source, destination, progress){
    if(source.length == destination.length){
      let output = new Uint8Array(source.length);
      for(let i = 0; i < source.length; i++){
        output[i] = lerp(source[i], destination[i], progress, 1);
      }
      return output;
    } else {
      let fallbackLength = typeof source.length !== 'undefined' ? source.length : 30;
      return (new Uint8Array(fallbackLength));
    }
  }

  static merge(arrays){
    let out = new Uint8Array(arrays[0].length)
    for (let i = 0; i < arrays[0].length; i++){
      for(let j = 0; j < arrays.length; j++){
        out[i] = Math.max(out[i], arrays[j][i]);
      }
    }
    return out;
  }

  static fromText(s) {
      let ua = new Uint8Array(s.length);
      for (let i = 0; i < s.length; i++) {
          ua[i] = s.charCodeAt(i);
      }
      return ua;
  }

  static toText(ua) {
      let s = '';
      for (let i = 0; i < ua.length; i++) {
          s += String.fromCharCode(ua[i]);
      }
      return s;
  }
}

const os = require('os');

function getNetwork(config){
  if(typeof(config.ipStatic) != 'undefined'){
    //A static IP, return it
    return config.ipStatic;

  } else if (typeof(config.ipFilter) != 'undefined'){
    //Filter available ifaces using filter
    //Get addresses, make return array
    let ifaces = os.networkInterfaces();
    let addresses = [];

    //Iterate
    for (let key in ifaces) {
      for (let k2 in ifaces[key]) {
        let address = ifaces[key][k2];
        if (address.family === 'IPv4' && !address.internal) {
          if(address.address.includes(config.ipFilter)){
            addresses.push(address);
          }
        }
      }
    }

    //Do we want all or one?
    if(addresses.length > 0){
      if(config.getAllIPs){
        return addresses;
      } else {
        return addresses[0];
      }
    } else {
      return '192.168.1.1';
    }

  //Punt
  } else {
    return '192.168.1.1';
  }
}

module.exports.getNetwork = getNetwork;
module.exports.Color = Color;
module.exports.Num = Num;
module.exports.ArrayUtil = ArrayUtil;
module.exports.Uint8ArrayUtil = Uint8ArrayUtil;
