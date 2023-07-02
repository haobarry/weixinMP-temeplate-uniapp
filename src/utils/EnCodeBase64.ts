// function base64Encode(str) {
//   let base64 = new Base64();
//   return base64.encode(str);
// }
//
// function base64Decode(str) {
//   let base64 = new Base64();
//   return base64.decode(str);
// }

const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";


// // 实现Base64加密
const base64Encode = (base64Str: string) => {
  let result = '';
  for (let i = 0; i < base64Str.length; i += 3) {
    let a = base64Str.charCodeAt(i);
    let b = i + 1 < base64Str.length ? base64Str.charCodeAt(i + 1) : 0;
    let c = i + 2 < base64Str.length ? base64Str.charCodeAt(i + 2) : 0;

    let a1 = a >> 2, a2 = ((a & 3) << 4) | (b >> 4), a3 = ((b & 15) << 2) | (c >> 6), a4 = c & 63;

    result += base64Chars[a1] + base64Chars[a2] + (i + 1 < base64Str.length ? base64Chars[a3] : '=') + (i + 2 < base64Str.length ? base64Chars[a4] : '=');
  }
  return result;
}

// // 实现Base64解密
const base64Decode = (base64Str: string) => {
  let result = '';
  let i = 0;
  while (i < base64Str.length) {
    let a = base64Chars.indexOf(base64Str.charAt(i++));
    let b = base64Chars.indexOf(base64Str.charAt(i++));
    let c = base64Chars.indexOf(base64Str.charAt(i++));
    let d = base64Chars.indexOf(base64Str.charAt(i++));

    let a1 = (a << 2) | (b >> 4);
    let a2 = ((b & 15) << 4) | (c >> 2);
    let a3 = ((c & 3) << 6) | d;

    result += String.fromCharCode(a1);
    if (c != 64){
      result += String.fromCharCode(a2);
    }
    if (d != 64){
      result += String.fromCharCode(a3);
    }
  }
  return result;
}



export { base64Encode, base64Decode }