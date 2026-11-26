"use strict";(()=>{var Ii={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Li={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Tu=0,h1=1,wu=2;var lo=1,il=2,Ys=3,Di=0,Qt=1,Ht=2,ui=0,qs=1,nt=2,u1=3,d1=4,Ru=5;var ts=100,Au=101,Cu=102,Pu=103,Iu=104,Lu=200,Du=201,Nu=202,Uu=203,f1=204,p1=205,Ou=206,Fu=207,Bu=208,Hu=209,zu=210,Gu=211,ku=212,Vu=213,Wu=214,Ma=0,va=1,Ea=2,Ps=3,ba=4,Sa=5,Ta=6,wa=7,sl=0,Xu=1,Yu=2,qn=0,co=1,ho=2,uo=3,ns=4,fo=5,po=6,mo=7;var m1=300,is=301,Zs=302,rl=303,ol=304,Ra=1e3,kn=1001,Aa=1002,Jt=1003,qu=1004;var go=1005;var un=1006,al=1007;var di=1008;var fn=1009,g1=1010,_1=1011,Ks=1012,ll=1013,Bn=1014,Cn=1015,en=1016,cl=1017,hl=1018,ss=1020,x1=35902,y1=35899,M1=1021,v1=1022,Hn=1023,ri=1026,fi=1027,ul=1028,dl=1029,Ni=1030,fl=1031;var pl=1033,_o=33776,xo=33777,yo=33778,Mo=33779,ml=35840,gl=35841,_l=35842,xl=35843,yl=36196,Ml=37492,vl=37496,El=37488,bl=37489,vo=37490,Sl=37491,Tl=37808,wl=37809,Rl=37810,Al=37811,Cl=37812,Pl=37813,Il=37814,Ll=37815,Dl=37816,Nl=37817,Ul=37818,Ol=37819,Fl=37820,Bl=37821,Hl=36492,zl=36494,Gl=36495,kl=36283,Vl=36284,Eo=36285,Wl=36286;var Tr=2300,Ca=2301,xa=2302,jc=2303,Qc=2400,e1=2401,t1=2402;var Zu=3200;var bo=0,Ku=1,pi="",xn="srgb",wr="srgb-linear",Rr="linear",xt="srgb";var ya=7680;var Ju=519,$u=512,ju=513,Qu=514,E1=515,ed=516,td=517,b1=518,S1=519,T1=35044,mi=35048;var w1="300 es",wn=2e3,Is=2001;function Tp(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function wp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Ar(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function nd(){let i=Ar("canvas");return i.style.display="block",i}var Bh={},Ls=null;function Cr(...i){let e="THREE."+i.shift();Ls?Ls("log",e,...i):console.log(e,...i)}function id(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ye(...i){i=id(i);let e="THREE."+i.shift();if(Ls)Ls("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function qe(...i){i=id(i);let e="THREE."+i.shift();if(Ls)Ls("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Mr(...i){let e=i.join(" ");e in Bh||(Bh[e]=!0,Ye(...i))}function sd(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var rd={[Ma]:Ma,[Ea]:Ta,[ba]:ba,[Ps]:Sa,[va]:va,[Ta]:Ea,[wa]:wa,[Sa]:Ps},On=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},rn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Hh=1234567,vr=Math.PI/180,Ds=180/Math.PI;function gi(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(rn[i&255]+rn[i>>8&255]+rn[i>>16&255]+rn[i>>24&255]+"-"+rn[e&255]+rn[e>>8&255]+"-"+rn[e>>16&15|64]+rn[e>>24&255]+"-"+rn[t&63|128]+rn[t>>8&255]+"-"+rn[t>>16&255]+rn[t>>24&255]+rn[n&255]+rn[n>>8&255]+rn[n>>16&255]+rn[n>>24&255]).toLowerCase()}function st(i,e,t){return Math.max(e,Math.min(t,i))}function R1(i,e){return(i%e+e)%e}function Rp(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Ap(i,e,t){return i!==e?(t-i)/(e-i):0}function Er(i,e,t){return(1-t)*i+t*e}function Cp(i,e,t,n){return Er(i,e,1-Math.exp(-t*n))}function Pp(i,e=1){return e-Math.abs(R1(i,e*2)-e)}function Ip(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Lp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Dp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Np(i,e){return i+Math.random()*(e-i)}function Up(i){return i*(.5-Math.random())}function Op(i){i!==void 0&&(Hh=i);let e=Hh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Fp(i){return i*vr}function Bp(i){return i*Ds}function Hp(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function zp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function A1(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Gp(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),m=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*m,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*m,a*c);break;case"ZYZ":i.set(l*m,l*f,a*h,a*c);break;default:Ye("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Xl(i){switch(i.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function C1(i,e){if(e.constructor===Float32Array)return i;let t=Xl(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(i/t,-1)}function P1(i,e){if(e.constructor===Float32Array)return i;let t=Xl(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(i*t)}var Yl={DEG2RAD:vr,RAD2DEG:Ds,generateUUID:gi,clamp:st,euclideanModulo:R1,mapLinear:Rp,inverseLerp:Ap,lerp:Er,damp:Cp,pingpong:Pp,smoothstep:Ip,smootherstep:Lp,randInt:Dp,randFloat:Np,randFloatSpread:Up,seededRandom:Op,degToRad:Fp,radToDeg:Bp,isPowerOfTwo:Hp,ceilPowerOfTwo:zp,floorPowerOfTwo:A1,setQuaternionFromProperEuler:Gp,normalize:P1,denormalize:C1},O1=class O1{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};O1.prototype.isVector2=!0;var te=O1,kt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],f=r[o+1],m=r[o+2],y=r[o+3];if(u!==y||l!==d||c!==f||h!==m){let g=l*d+c*f+h*m+u*y;g<0&&(d=-d,f=-f,m=-m,y=-y,g=-g);let p=1-a;if(g<.9995){let M=Math.acos(g),E=Math.sin(M);p=Math.sin(p*M)/E,a=Math.sin(a*M)/E,l=l*p+d*a,c=c*p+f*a,h=h*p+m*a,u=u*p+y*a}else{l=l*p+d*a,c=c*p+f*a,h=h*p+m*a,u=u*p+y*a;let M=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=M,c*=M,h*=M,u*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],m=r[o+3];return e[t]=a*m+h*u+l*f-c*d,e[t+1]=l*m+h*d+c*u-a*f,e[t+2]=c*m+h*f+a*d-l*u,e[t+3]=h*m-a*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),f=l(s/2),m=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:Ye("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(st(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-t;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},F1=class F1{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(zh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(zh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Rc.copy(this).projectOnVector(e),this.sub(Rc)}reflect(e){return this.sub(Rc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};F1.prototype.isVector3=!0;var I=F1,Rc=new I,zh=new kt,B1=class B1{constructor(e,t,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],y=s[0],g=s[3],p=s[6],M=s[1],E=s[4],x=s[7],b=s[2],S=s[5],_=s[8];return r[0]=o*y+a*M+l*b,r[3]=o*g+a*E+l*S,r[6]=o*p+a*x+l*_,r[1]=c*y+h*M+u*b,r[4]=c*g+h*E+u*S,r[7]=c*p+h*x+u*_,r[2]=d*y+f*M+m*b,r[5]=d*g+f*E+m*S,r[8]=d*p+f*x+m*_,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,m=t*u+n*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/m;return e[0]=u*y,e[1]=(s*c-h*n)*y,e[2]=(a*n-s*o)*y,e[3]=d*y,e[4]=(h*t-s*l)*y,e[5]=(s*r-a*t)*y,e[6]=f*y,e[7]=(n*l-c*t)*y,e[8]=(o*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return Mr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ac.makeScale(e,t)),this}rotate(e){return Mr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ac.makeRotation(-e)),this}translate(e,t){return Mr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ac.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};B1.prototype.isMatrix3=!0;var $e=B1,Ac=new $e,Gh=new $e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),kh=new $e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function kp(){let i={enabled:!0,workingColorSpace:wr,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===xt&&(s.r=si(s.r),s.g=si(s.g),s.b=si(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===xt&&(s.r=Cs(s.r),s.g=Cs(s.g),s.b=Cs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===pi?Rr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[o].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[wr]:{primaries:e,whitePoint:n,transfer:Rr,toXYZ:Gh,fromXYZ:kh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:xn},outputColorSpaceConfig:{drawingBufferColorSpace:xn}},[xn]:{primaries:e,whitePoint:n,transfer:xt,toXYZ:Gh,fromXYZ:kh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:xn}}}),i}var lt=kp();function si(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Cs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var us,Pa=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{us===void 0&&(us=Ar("canvas")),us.width=e.width,us.height=e.height;let s=us.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=us}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=Ar("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=si(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(si(t[n]/255)*255):t[n]=si(t[n]);return{data:t,width:e.width,height:e.height}}else return Ye("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Vp=0,Ns=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Vp++}),this.uuid=gi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement!="undefined"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame!="undefined"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Cc(s[o].image)):r.push(Cc(s[o]))}else r=Cc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Cc(i){return typeof HTMLImageElement!="undefined"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&i instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&i instanceof ImageBitmap?Pa.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ye("Texture: Unable to serialize Texture."),{})}var Wp=0,Pc=new I,dn=class i extends On{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=kn,s=kn,r=un,o=di,a=Hn,l=fn,c=i.DEFAULT_ANISOTROPY,h=pi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wp++}),this.uuid=gi(),this.name="",this.source=new Ns(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new te(0,0),this.repeat=new te(1,1),this.center=new te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Pc).x}get height(){return this.source.getSize(Pc).y}get depth(){return this.source.getSize(Pc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ye(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ye(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==m1)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ra:e.x=e.x-Math.floor(e.x);break;case kn:e.x=e.x<0?0:1;break;case Aa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ra:e.y=e.y-Math.floor(e.y);break;case kn:e.y=e.y<0?0:1;break;case Aa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};dn.DEFAULT_IMAGE=null;dn.DEFAULT_MAPPING=m1;dn.DEFAULT_ANISOTROPY=1;var H1=class H1{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],y=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-y)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+y)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let E=(c+1)/2,x=(f+1)/2,b=(p+1)/2,S=(h+d)/4,_=(u+y)/4,v=(m+g)/4;return E>x&&E>b?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=S/n,r=_/n):x>b?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=S/s,r=v/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=_/r,s=v/r),this.set(n,s,r,t),this}let M=Math.sqrt((g-m)*(g-m)+(u-y)*(u-y)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(g-m)/M,this.y=(u-y)/M,this.z=(d-h)/M,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this.w=st(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this.w=st(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};H1.prototype.isVector4=!0;var It=H1,Ia=class extends On{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:un,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new It(0,0,e,t),this.scissorTest=!1,this.viewport=new It(0,0,e,t),this.textures=[];let s=n.count;for(let r=0;r<s;r++)this.textures[r]=new dn({width:e,height:t,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:un,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ns(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Vt=class extends Ia{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Pr=class extends dn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Jt,this.minFilter=Jt,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var La=class extends dn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Jt,this.minFilter=Jt,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var nl=class nl{constructor(e,t,n,s,r,o,a,l,c,h,u,d,f,m,y,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,u,d,f,m,y,g)}set(e,t,n,s,r,o,a,l,c,h,u,d,f,m,y,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=y,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new nl().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/ds.setFromMatrixColumn(e,0).length(),r=1/ds.setFromMatrixColumn(e,1).length(),o=1/ds.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=o*h,f=o*u,m=a*h,y=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+m*c,t[5]=d-y*c,t[9]=-a*l,t[2]=y-d*c,t[6]=m+f*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,m=c*h,y=c*u;t[0]=d+y*a,t[4]=m*a-f,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-m,t[6]=y+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,m=c*h,y=c*u;t[0]=d-y*a,t[4]=-o*u,t[8]=m+f*a,t[1]=f+m*a,t[5]=o*h,t[9]=y-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*h,f=o*u,m=a*h,y=a*u;t[0]=l*h,t[4]=m*c-f,t[8]=d*c+y,t[1]=l*u,t[5]=y*c+d,t[9]=f*c-m,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,f=o*c,m=a*l,y=a*c;t[0]=l*h,t[4]=y-d*u,t[8]=m*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*u+m,t[10]=d-y*u}else if(e.order==="XZY"){let d=o*l,f=o*c,m=a*l,y=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+y,t[5]=o*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=a*h,t[10]=y*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Xp,e,Yp)}lookAt(e,t,n){let s=this.elements;return gn.subVectors(e,t),gn.lengthSq()===0&&(gn.z=1),gn.normalize(),vi.crossVectors(n,gn),vi.lengthSq()===0&&(Math.abs(n.z)===1?gn.x+=1e-4:gn.z+=1e-4,gn.normalize(),vi.crossVectors(n,gn)),vi.normalize(),ko.crossVectors(gn,vi),s[0]=vi.x,s[4]=ko.x,s[8]=gn.x,s[1]=vi.y,s[5]=ko.y,s[9]=gn.y,s[2]=vi.z,s[6]=ko.z,s[10]=gn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],y=n[6],g=n[10],p=n[14],M=n[3],E=n[7],x=n[11],b=n[15],S=s[0],_=s[4],v=s[8],P=s[12],T=s[1],C=s[5],D=s[9],N=s[13],A=s[2],U=s[6],F=s[10],B=s[14],V=s[3],z=s[7],W=s[11],K=s[15];return r[0]=o*S+a*T+l*A+c*V,r[4]=o*_+a*C+l*U+c*z,r[8]=o*v+a*D+l*F+c*W,r[12]=o*P+a*N+l*B+c*K,r[1]=h*S+u*T+d*A+f*V,r[5]=h*_+u*C+d*U+f*z,r[9]=h*v+u*D+d*F+f*W,r[13]=h*P+u*N+d*B+f*K,r[2]=m*S+y*T+g*A+p*V,r[6]=m*_+y*C+g*U+p*z,r[10]=m*v+y*D+g*F+p*W,r[14]=m*P+y*N+g*B+p*K,r[3]=M*S+E*T+x*A+b*V,r[7]=M*_+E*C+x*U+b*z,r[11]=M*v+E*D+x*F+b*W,r[15]=M*P+E*N+x*B+b*K,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],y=e[7],g=e[11],p=e[15],M=l*f-c*d,E=a*f-c*u,x=a*d-l*u,b=o*f-c*h,S=o*d-l*h,_=o*u-a*h;return t*(y*M-g*E+p*x)-n*(m*M-g*b+p*S)+s*(m*E-y*b+p*_)-r*(m*x-y*S+g*_)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],o=e[5],a=e[9],l=e[2],c=e[6],h=e[10];return t*(o*h-a*c)-n*(r*h-a*l)+s*(r*c-o*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],y=e[13],g=e[14],p=e[15],M=t*a-n*o,E=t*l-s*o,x=t*c-r*o,b=n*l-s*a,S=n*c-r*a,_=s*c-r*l,v=h*y-u*m,P=h*g-d*m,T=h*p-f*m,C=u*g-d*y,D=u*p-f*y,N=d*p-f*g,A=M*N-E*D+x*C+b*T-S*P+_*v;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let U=1/A;return e[0]=(a*N-l*D+c*C)*U,e[1]=(s*D-n*N-r*C)*U,e[2]=(y*_-g*S+p*b)*U,e[3]=(d*S-u*_-f*b)*U,e[4]=(l*T-o*N-c*P)*U,e[5]=(t*N-s*T+r*P)*U,e[6]=(g*x-m*_-p*E)*U,e[7]=(h*_-d*x+f*E)*U,e[8]=(o*D-a*T+c*v)*U,e[9]=(n*T-t*D-r*v)*U,e[10]=(m*S-y*x+p*M)*U,e[11]=(u*x-h*S-f*M)*U,e[12]=(a*P-o*C-l*v)*U,e[13]=(t*C-n*P+s*v)*U,e[14]=(y*E-m*b-g*M)*U,e[15]=(h*b-u*E+d*M)*U,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,m=r*u,y=o*h,g=o*u,p=a*u,M=l*c,E=l*h,x=l*u,b=n.x,S=n.y,_=n.z;return s[0]=(1-(y+p))*b,s[1]=(f+x)*b,s[2]=(m-E)*b,s[3]=0,s[4]=(f-x)*S,s[5]=(1-(d+p))*S,s[6]=(g+M)*S,s[7]=0,s[8]=(m+E)*_,s[9]=(g-M)*_,s[10]=(1-(d+y))*_,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let o=ds.set(s[0],s[1],s[2]).length(),a=ds.set(s[4],s[5],s[6]).length(),l=ds.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Dn.copy(this);let c=1/o,h=1/a,u=1/l;return Dn.elements[0]*=c,Dn.elements[1]*=c,Dn.elements[2]*=c,Dn.elements[4]*=h,Dn.elements[5]*=h,Dn.elements[6]*=h,Dn.elements[8]*=u,Dn.elements[9]*=u,Dn.elements[10]*=u,t.setFromRotationMatrix(Dn),n.x=o,n.y=a,n.z=l,this}makePerspective(e,t,n,s,r,o,a=wn,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),m,y;if(l)m=r/(o-r),y=o*r/(o-r);else if(a===wn)m=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===Is)m=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=wn,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s),m,y;if(l)m=1/(o-r),y=o/(o-r);else if(a===wn)m=-2/(o-r),y=-(o+r)/(o-r);else if(a===Is)m=-1/(o-r),y=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};nl.prototype.isMatrix4=!0;var Ze=nl,ds=new I,Dn=new Ze,Xp=new I(0,0,0),Yp=new I(1,1,1),vi=new I,ko=new I,gn=new I,Vh=new Ze,Wh=new kt,Rn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(st(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-st(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(st(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-st(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(st(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-st(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ye("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Vh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Vh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Wh.setFromEuler(this),this.setFromQuaternion(Wh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Rn.DEFAULT_ORDER="XYZ";var Us=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},qp=0,Xh=new I,fs=new kt,jn=new Ze,Vo=new I,cr=new I,Zp=new I,Kp=new kt,Yh=new I(1,0,0),qh=new I(0,1,0),Zh=new I(0,0,1),Kh={type:"added"},Jp={type:"removed"},ps={type:"childadded",child:null},Ic={type:"childremoved",child:null},Tt=class i extends On{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qp++}),this.uuid=gi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new I,t=new Rn,n=new kt,s=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ze},normalMatrix:{value:new $e}}),this.matrix=new Ze,this.matrixWorld=new Ze,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Us,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return fs.setFromAxisAngle(e,t),this.quaternion.multiply(fs),this}rotateOnWorldAxis(e,t){return fs.setFromAxisAngle(e,t),this.quaternion.premultiply(fs),this}rotateX(e){return this.rotateOnAxis(Yh,e)}rotateY(e){return this.rotateOnAxis(qh,e)}rotateZ(e){return this.rotateOnAxis(Zh,e)}translateOnAxis(e,t){return Xh.copy(e).applyQuaternion(this.quaternion),this.position.add(Xh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Yh,e)}translateY(e){return this.translateOnAxis(qh,e)}translateZ(e){return this.translateOnAxis(Zh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(jn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Vo.copy(e):Vo.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),cr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?jn.lookAt(cr,Vo,this.up):jn.lookAt(Vo,cr,this.up),this.quaternion.setFromRotationMatrix(jn),s&&(jn.extractRotation(s.matrixWorld),fs.setFromRotationMatrix(jn),this.quaternion.premultiply(fs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(qe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Kh),ps.child=e,this.dispatchEvent(ps),ps.child=null):qe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Jp),Ic.child=e,this.dispatchEvent(Ic),Ic.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),jn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),jn.multiply(e.parent.matrixWorld)),e.applyMatrix4(jn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Kh),ps.child=e,this.dispatchEvent(ps),ps.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cr,e,Zp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cr,Kp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),m=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Tt.DEFAULT_UP=new I(0,1,0);Tt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Oe=class extends Tt{constructor(){super(),this.isGroup=!0,this.type="Group"}},$p={type:"move"},Os=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Oe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Oe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Oe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let y of e.hand.values()){let g=t.getJointPose(y,n),p=this._getHandJoint(c,y);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent($p)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Oe;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},od={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ei={h:0,s:0,l:0},Wo={h:0,s:0,l:0};function Lc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var ue=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=xn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,lt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=lt.workingColorSpace){return this.r=e,this.g=t,this.b=n,lt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=lt.workingColorSpace){if(e=R1(e,1),t=st(t,0,1),n=st(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Lc(o,r,e+1/3),this.g=Lc(o,r,e),this.b=Lc(o,r,e-1/3)}return lt.colorSpaceToWorking(this,s),this}setStyle(e,t=xn){function n(r){r!==void 0&&parseFloat(r)<1&&Ye("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ye("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Ye("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=xn){let n=od[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ye("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=si(e.r),this.g=si(e.g),this.b=si(e.b),this}copyLinearToSRGB(e){return this.r=Cs(e.r),this.g=Cs(e.g),this.b=Cs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=xn){return lt.workingToColorSpace(on.copy(this),e),Math.round(st(on.r*255,0,255))*65536+Math.round(st(on.g*255,0,255))*256+Math.round(st(on.b*255,0,255))}getHexString(e=xn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=lt.workingColorSpace){lt.workingToColorSpace(on.copy(this),t);let n=on.r,s=on.g,r=on.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=lt.workingColorSpace){return lt.workingToColorSpace(on.copy(this),t),e.r=on.r,e.g=on.g,e.b=on.b,e}getStyle(e=xn){lt.workingToColorSpace(on.copy(this),e);let t=on.r,n=on.g,s=on.b;return e!==xn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Ei),this.setHSL(Ei.h+e,Ei.s+t,Ei.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ei),e.getHSL(Wo);let n=Er(Ei.h,Wo.h,t),s=Er(Ei.s,Wo.s,t),r=Er(Ei.l,Wo.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},on=new ue;ue.NAMES=od;var Ir=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ue(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Lr=class extends Tt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Rn,this.environmentIntensity=1,this.environmentRotation=new Rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Nn=new I,Qn=new I,Dc=new I,ei=new I,ms=new I,gs=new I,Jh=new I,Nc=new I,Uc=new I,Oc=new I,Fc=new It,Bc=new It,Hc=new It,ii=class i{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Nn.subVectors(e,t),s.cross(Nn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Nn.subVectors(s,t),Qn.subVectors(n,t),Dc.subVectors(e,t);let o=Nn.dot(Nn),a=Nn.dot(Qn),l=Nn.dot(Dc),c=Qn.dot(Qn),h=Qn.dot(Dc),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,m=(o*h-a*l)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ei)===null?!1:ei.x>=0&&ei.y>=0&&ei.x+ei.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,ei)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ei.x),l.addScaledVector(o,ei.y),l.addScaledVector(a,ei.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return Fc.setScalar(0),Bc.setScalar(0),Hc.setScalar(0),Fc.fromBufferAttribute(e,t),Bc.fromBufferAttribute(e,n),Hc.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Fc,r.x),o.addScaledVector(Bc,r.y),o.addScaledVector(Hc,r.z),o}static isFrontFacing(e,t,n,s){return Nn.subVectors(n,t),Qn.subVectors(e,t),Nn.cross(Qn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Nn.subVectors(this.c,this.b),Qn.subVectors(this.a,this.b),Nn.cross(Qn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;ms.subVectors(s,n),gs.subVectors(r,n),Nc.subVectors(e,n);let l=ms.dot(Nc),c=gs.dot(Nc);if(l<=0&&c<=0)return t.copy(n);Uc.subVectors(e,s);let h=ms.dot(Uc),u=gs.dot(Uc);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0&&l-h>0)return o=l/(l-h),t.copy(n).addScaledVector(ms,o);Oc.subVectors(e,r);let f=ms.dot(Oc),m=gs.dot(Oc);if(m>=0&&f<=m)return t.copy(r);let y=f*c-l*m;if(y<=0&&c>=0&&m<=0)return a=c/(c-m),t.copy(n).addScaledVector(gs,a);let g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return Jh.subVectors(r,s),a=(u-h)/(u-h+(f-m)),t.copy(s).addScaledVector(Jh,a);let p=1/(g+y+d);return o=y*p,a=d*p,t.copy(n).addScaledVector(ms,o).addScaledVector(gs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Vn=class{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Un):Un.fromBufferAttribute(r,o),Un.applyMatrix4(e.matrixWorld),this.expandByPoint(Un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Xo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Xo.copy(n.boundingBox)),Xo.applyMatrix4(e.matrixWorld),this.union(Xo)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Un),Un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(hr),Yo.subVectors(this.max,hr),_s.subVectors(e.a,hr),xs.subVectors(e.b,hr),ys.subVectors(e.c,hr),bi.subVectors(xs,_s),Si.subVectors(ys,xs),Wi.subVectors(_s,ys);let t=[0,-bi.z,bi.y,0,-Si.z,Si.y,0,-Wi.z,Wi.y,bi.z,0,-bi.x,Si.z,0,-Si.x,Wi.z,0,-Wi.x,-bi.y,bi.x,0,-Si.y,Si.x,0,-Wi.y,Wi.x,0];return!zc(t,_s,xs,ys,Yo)||(t=[1,0,0,0,1,0,0,0,1],!zc(t,_s,xs,ys,Yo))?!1:(qo.crossVectors(bi,Si),t=[qo.x,qo.y,qo.z],zc(t,_s,xs,ys,Yo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ti[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ti[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ti[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ti[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ti[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ti[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ti[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ti[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ti),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ti=[new I,new I,new I,new I,new I,new I,new I,new I],Un=new I,Xo=new Vn,_s=new I,xs=new I,ys=new I,bi=new I,Si=new I,Wi=new I,hr=new I,Yo=new I,qo=new I,Xi=new I;function zc(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Xi.fromArray(i,r);let a=s.x*Math.abs(Xi.x)+s.y*Math.abs(Xi.y)+s.z*Math.abs(Xi.z),l=e.dot(Xi),c=t.dot(Xi),h=n.dot(Xi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Bt=new I,Zo=new te,jp=0,Ut=class extends On{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:jp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=T1,this.updateRanges=[],this.gpuType=Cn,this.version=0,this._normalizationScale=e!==void 0?Xl(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Zo.fromBufferAttribute(this,t),Zo.applyMatrix3(e),this.setXY(t,Zo.x,Zo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyMatrix3(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyMatrix4(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.applyNormalMatrix(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Bt.fromBufferAttribute(this,t),Bt.transformDirection(e),this.setXYZ(t,Bt.x,Bt.y,Bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):C1(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):P1(e,this.array)}};var Dr=class extends Ut{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Nr=class extends Ut{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Qe=class extends Ut{constructor(e,t,n){super(new Float32Array(e),t,n)}},Qp=new Vn,ur=new I,Gc=new I,Wn=class{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Qp.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ur.subVectors(e,this.center);let t=ur.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ur,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Gc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ur.copy(e.center).add(Gc)),this.expandByPoint(ur.copy(e.center).sub(Gc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},e3=0,Tn=new Ze,kc=new Tt,Ms=new I,_n=new Vn,dr=new Vn,Kt=new I,mt=class i extends On{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:e3++}),this.uuid=gi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Tp(e)?Nr:Dr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new $e().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Tn.makeRotationFromQuaternion(e),this.applyMatrix4(Tn),this}rotateX(e){return Tn.makeRotationX(e),this.applyMatrix4(Tn),this}rotateY(e){return Tn.makeRotationY(e),this.applyMatrix4(Tn),this}rotateZ(e){return Tn.makeRotationZ(e),this.applyMatrix4(Tn),this}translate(e,t,n){return Tn.makeTranslation(e,t,n),this.applyMatrix4(Tn),this}scale(e,t,n){return Tn.makeScale(e,t,n),this.applyMatrix4(Tn),this}lookAt(e){return kc.lookAt(e),kc.updateMatrix(),this.applyMatrix4(kc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ms).negate(),this.translate(Ms.x,Ms.y,Ms.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Qe(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ye("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];_n.setFromBufferAttribute(r),this.morphTargetsRelative?(Kt.addVectors(this.boundingBox.min,_n.min),this.boundingBox.expandByPoint(Kt),Kt.addVectors(this.boundingBox.max,_n.max),this.boundingBox.expandByPoint(Kt)):(this.boundingBox.expandByPoint(_n.min),this.boundingBox.expandByPoint(_n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&qe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Wn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){let n=this.boundingSphere.center;if(_n.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];dr.setFromBufferAttribute(a),this.morphTargetsRelative?(Kt.addVectors(_n.min,dr.min),_n.expandByPoint(Kt),Kt.addVectors(_n.max,dr.max),_n.expandByPoint(Kt)):(_n.expandByPoint(dr.min),_n.expandByPoint(dr.max))}_n.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Kt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Kt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Kt.fromBufferAttribute(a,c),l&&(Ms.fromBufferAttribute(e,c),Kt.add(Ms)),s=Math.max(s,n.distanceToSquared(Kt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&qe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){qe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Ut(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[],c=new Uint8Array(n.count);for(let P=0;P<n.count;P++)a[P]=new I,l[P]=new I;let h=new I,u=new I,d=new I,f=new te,m=new te,y=new te,g=new I,p=new I;function M(P,T,C){c[P]=c[T]=c[C]=1,h.fromBufferAttribute(n,P),u.fromBufferAttribute(n,T),d.fromBufferAttribute(n,C),f.fromBufferAttribute(r,P),m.fromBufferAttribute(r,T),y.fromBufferAttribute(r,C),u.sub(h),d.sub(h),m.sub(f),y.sub(f);let D=1/(m.x*y.y-y.x*m.y);isFinite(D)&&(g.copy(u).multiplyScalar(y.y).addScaledVector(d,-m.y).multiplyScalar(D),p.copy(d).multiplyScalar(m.x).addScaledVector(u,-y.x).multiplyScalar(D),a[P].add(g),a[T].add(g),a[C].add(g),l[P].add(p),l[T].add(p),l[C].add(p))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let P=0,T=E.length;P<T;++P){let C=E[P],D=C.start,N=C.count;for(let A=D,U=D+N;A<U;A+=3)M(e.getX(A+0),e.getX(A+1),e.getX(A+2))}let x=new I,b=new I,S=new I,_=new I;function v(P){S.fromBufferAttribute(s,P),_.copy(S);let T=a[P];x.copy(T),x.sub(S.multiplyScalar(S.dot(T))).normalize(),b.crossVectors(_,T);let D=b.dot(l[P])<0?-1:1;o.setXYZW(P,x.x,x.y,x.z,D)}for(let P=0,T=n.count;P<T;++P)c[P]&&v(P);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Ut(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new I,r=new I,o=new I,a=new I,l=new I,c=new I,h=new I,u=new I;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),y=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,y),o.fromBufferAttribute(t,g),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Kt.fromBufferAttribute(e,t),Kt.normalize(),e.setXYZ(t,Kt.x,Kt.y,Kt.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,m=0;for(let y=0,g=l.length;y<g;y++){a.isInterleavedBufferAttribute?f=l[y]*a.data.stride+a.offset:f=l[y]*h;for(let p=0;p<h;p++)d[m++]=c[f++]}return new Ut(d,h,u)}if(this.index===null)return Ye("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ur=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=T1,this.updateRanges=[],this.version=0,this.uuid=gi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=$h(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[t]),s=new this.constructor(n,this.stride);return s.setUsage(this.usage),s}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=$h(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let n={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}};function $h(i){return i.buffer._uuid===void 0&&(i.buffer._uuid=gi()),i.byteOffset===0&&i.byteLength===i.buffer.byteLength?i.buffer._uuid:i.buffer._uuid+":"+i.byteOffset+":"+i.byteLength}var cn=new I,Fs=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s,this._normalizationScale=e!==void 0?Xl(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)cn.fromBufferAttribute(this,t),cn.applyMatrix4(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)cn.fromBufferAttribute(this,t),cn.applyNormalMatrix(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)cn.fromBufferAttribute(this,t),cn.transformDirection(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Cr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Ut(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Cr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):C1(e,this.data.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):P1(e,this.data.array)}},Vc=new I,t3=new I,n3=new $e,yn=class{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Vc.subVectors(n,t).cross(t3.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Vc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||n3.getNormalMatrix(e),s=this.coplanarPoint(Vc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},i3=0,An=class extends On{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:i3++}),this.uuid=gi(),this.name="",this.type="Material",this.blending=qs,this.side=Di,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=f1,this.blendDst=p1,this.blendEquation=ts,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ue(0,0,0),this.blendAlpha=0,this.depthFunc=Ps,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ju,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ya,this.stencilZFail=ya,this.stencilZPass=ya,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ye(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ye(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ue().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new yn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new te().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new te().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Bs=class extends An{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ue(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},vs,fr=new I,Es=new I,bs=new I,Ss=new te,pr=new te,ad=new Ze,Ko=new I,mr=new I,Jo=new I,jh=new te,Wc=new te,Qh=new te,Or=class extends Tt{constructor(e=new Bs){if(super(),this.isSprite=!0,this.type="Sprite",vs===void 0){vs=new mt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Ur(t,5);vs.setIndex([0,1,2,0,2,3]),vs.setAttribute("position",new Fs(n,3,0,!1)),vs.setAttribute("uv",new Fs(n,2,3,!1))}this.geometry=vs,this.material=e,this.center=new te(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&qe('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Es.setFromMatrixScale(this.matrixWorld),ad.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),bs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Es.multiplyScalar(-bs.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;$o(Ko.set(-.5,-.5,0),bs,o,Es,s,r),$o(mr.set(.5,-.5,0),bs,o,Es,s,r),$o(Jo.set(.5,.5,0),bs,o,Es,s,r),jh.set(0,0),Wc.set(1,0),Qh.set(1,1);let a=e.ray.intersectTriangle(Ko,mr,Jo,!1,fr);if(a===null&&($o(mr.set(-.5,.5,0),bs,o,Es,s,r),Wc.set(0,1),a=e.ray.intersectTriangle(Ko,Jo,mr,!1,fr),a===null))return;let l=e.ray.origin.distanceTo(fr);l<e.near||l>e.far||t.push({distance:l,point:fr.clone(),uv:ii.getInterpolation(fr,Ko,mr,Jo,jh,Wc,Qh,new te),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}toJSON(e){let t=super.toJSON(e);return t.object.center=this.center.toArray(),t}};function $o(i,e,t,n,s,r){Ss.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(pr.x=r*Ss.x-s*Ss.y,pr.y=s*Ss.x+r*Ss.y):pr.copy(Ss),i.copy(e),i.x+=pr.x,i.y+=pr.y,i.applyMatrix4(ad)}var ni=new I,Xc=new I,jo=new I,Qo=new I,oi=class{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ni)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ni.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ni.copy(this.origin).addScaledVector(this.direction,t),ni.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Xc.copy(e).add(t).multiplyScalar(.5),jo.copy(t).sub(e).normalize(),Qo.copy(this.origin).sub(Xc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(jo),a=Qo.dot(this.direction),l=-Qo.dot(jo),c=Qo.lengthSq(),h=Math.abs(1-o*o),u,d,f,m;if(h>0)if(u=o*l-a,d=o*a-l,m=r*h,u>=0)if(d>=-m)if(d<=m){let y=1/h;u*=y,d*=y,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Xc).addScaledVector(jo,d),f}intersectSphere(e,t){if(e.radius<0)return null;ni.subVectors(e.center,this.origin);let n=ni.dot(this.direction),s=ni.dot(ni)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ni)!==null}intersectTriangle(e,t,n,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,u=e.x-o.x,d=e.y-o.y,f=e.z-o.z,m=t.x-o.x,y=t.y-o.y,g=t.z-o.z,p=n.x-o.x,M=n.y-o.y,E=n.z-o.z,x=Math.abs(l),b=Math.abs(c),S=Math.abs(h),_,v,P,T,C,D,N,A,U,F,B,V;if(x>=b&&x>=S?(P=l,D=u,U=m,V=p,l>=0?(_=c,v=h,T=d,C=f,N=y,A=g,F=M,B=E):(_=h,v=c,T=f,C=d,N=g,A=y,F=E,B=M)):b>=S?(P=c,D=d,U=y,V=M,c>=0?(_=h,v=l,T=f,C=u,N=g,A=m,F=E,B=p):(_=l,v=h,T=u,C=f,N=m,A=g,F=p,B=E)):(P=h,D=f,U=g,V=E,h>=0?(_=l,v=c,T=u,C=d,N=m,A=y,F=p,B=M):(_=c,v=l,T=d,C=u,N=y,A=m,F=M,B=p)),P===0)return null;let z=_/P,W=v/P,K=1/P,Q=T-z*D,ae=C-W*D,k=N-z*U,re=A-W*U,ce=F-z*V,Ce=B-W*V,he=ce*re-Ce*k,Ne=Q*Ce-ae*ce,et=k*ae-re*Q;if(s){if(he<0||Ne<0||et<0)return null}else if((he<0||Ne<0||et<0)&&(he>0||Ne>0||et>0))return null;let Le=he+Ne+et;if(Le===0)return null;let oe=K*(he*D+Ne*U+et*V);return(Le>0?oe<0:oe>0)?null:this.at(oe/Le,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},xe=class extends An{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=sl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},eu=new Ze,Yi=new oi,ea=new Wn,tu=new I,ta=new I,na=new I,ia=new I,Yc=new I,sa=new I,nu=new I,ra=new I,Z=class extends Tt{constructor(e=new mt,t=new xe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){sa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Yc.fromBufferAttribute(u,e),o?sa.addScaledVector(Yc,h):sa.addScaledVector(Yc.sub(t),h))}t.add(sa)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ea.copy(n.boundingSphere),ea.applyMatrix4(r),Yi.copy(e.ray).recast(e.near),!(ea.containsPoint(Yi.origin)===!1&&(Yi.intersectSphere(ea,tu)===null||Yi.origin.distanceToSquared(tu)>(e.far-e.near)**2))&&(eu.copy(r).invert(),Yi.copy(e.ray).applyMatrix4(eu),!(n.boundingBox!==null&&Yi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Yi)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,y=d.length;m<y;m++){let g=d[m],p=o[g.materialIndex],M=Math.max(g.start,f.start),E=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let x=M,b=E;x<b;x+=3){let S=a.getX(x),_=a.getX(x+1),v=a.getX(x+2);s=oa(this,p,e,n,c,h,u,S,_,v),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),y=Math.min(a.count,f.start+f.count);for(let g=m,p=y;g<p;g+=3){let M=a.getX(g),E=a.getX(g+1),x=a.getX(g+2);s=oa(this,o,e,n,c,h,u,M,E,x),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,y=d.length;m<y;m++){let g=d[m],p=o[g.materialIndex],M=Math.max(g.start,f.start),E=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let x=M,b=E;x<b;x+=3){let S=x,_=x+1,v=x+2;s=oa(this,p,e,n,c,h,u,S,_,v),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),y=Math.min(l.count,f.start+f.count);for(let g=m,p=y;g<p;g+=3){let M=g,E=g+1,x=g+2;s=oa(this,o,e,n,c,h,u,M,E,x),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function s3(i,e,t,n,s,r,o,a){let l;if(e.side===Qt?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Di,a),l===null)return null;ra.copy(a),ra.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(ra);return c<t.near||c>t.far?null:{distance:c,point:ra.clone(),object:i}}function oa(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,ta),i.getVertexPosition(l,na),i.getVertexPosition(c,ia);let h=s3(i,e,t,n,ta,na,ia,nu);if(h){let u=new I;ii.getBarycoord(nu,ta,na,ia,u),s&&(h.uv=ii.getInterpolatedAttribute(s,a,l,c,u,new te)),r&&(h.uv1=ii.getInterpolatedAttribute(r,a,l,c,u,new te)),o&&(h.normal=ii.getInterpolatedAttribute(o,a,l,c,u,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new I,materialIndex:0};ii.getNormal(ta,na,ia,d.normal),h.face=d,h.barycoord=u}return h}var Fr=class extends dn{constructor(e=null,t=1,n=1,s,r,o,a,l,c=Jt,h=Jt,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Hs=class extends Ut{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ts=new Ze,iu=new Ze,aa=[],su=new Vn,r3=new Ze,gr=new Z,_r=new Wn,yt=class extends Z{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Hs(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,r3)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Vn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ts),su.copy(e.boundingBox).applyMatrix4(Ts),this.boundingBox.union(su)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Wn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ts),_r.copy(e.boundingSphere).applyMatrix4(Ts),this.boundingSphere.union(_r)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(gr.geometry=this.geometry,gr.material=this.material,gr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),_r.copy(this.boundingSphere),_r.applyMatrix4(n),e.ray.intersectsSphere(_r)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ts),iu.multiplyMatrices(n,Ts),gr.matrixWorld=iu,gr.raycast(e,aa);for(let o=0,a=aa.length;o<a;o++){let l=aa[o];l.instanceId=r,l.object=this,t.push(l)}aa.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Hs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Fr(new Float32Array(s*this.count),s,this.count,ul,Cn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},qi=new Wn,o3=new te(.5,.5),la=new I,wi=class{constructor(e=new yn,t=new yn,n=new yn,s=new yn,r=new yn,o=new yn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=wn,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],m=r[8],y=r[9],g=r[10],p=r[11],M=r[12],E=r[13],x=r[14],b=r[15];if(s[0].setComponents(c-o,f-h,p-m,b-M).normalize(),s[1].setComponents(c+o,f+h,p+m,b+M).normalize(),s[2].setComponents(c+a,f+u,p+y,b+E).normalize(),s[3].setComponents(c-a,f-u,p-y,b-E).normalize(),n)s[4].setComponents(l,d,g,x).normalize(),s[5].setComponents(c-l,f-d,p-g,b-x).normalize();else if(s[4].setComponents(c-l,f-d,p-g,b-x).normalize(),t===wn)s[5].setComponents(c+l,f+d,p+g,b+x).normalize();else if(t===Is)s[5].setComponents(l,d,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),qi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),qi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(qi)}intersectsSprite(e){qi.center.set(0,0,0);let t=o3.distanceTo(e.center);return qi.radius=.7071067811865476+t,qi.applyMatrix4(e.matrixWorld),this.intersectsSphere(qi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(la.x=s.normal.x>0?e.max.x:e.min.x,la.y=s.normal.y>0?e.max.y:e.min.y,la.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(la)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},ru=new Ze,Da=class i{constructor(){this.coordinateSystem=wn,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let s=0;s<t.length;s++){let r=t[s];ru.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[s]===void 0&&(n[s]=new wi),n[s].setFromProjectionMatrix(ru,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new wi),t[s].copy(n[s]);return this._count=e._count,this}clone(){return new i().copy(this)}};var zs=class extends An{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ue(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Na=new I,Ua=new I,ou=new Ze,xr=new oi,ca=new Wn,qc=new I,au=new I,Ki=class extends Tt{constructor(e=new mt,t=new zs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Na.fromBufferAttribute(t,s-1),Ua.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Na.distanceTo(Ua);e.setAttribute("lineDistance",new Qe(n,1))}else Ye("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ca.copy(n.boundingSphere),ca.applyMatrix4(s),ca.radius+=r,e.ray.intersectsSphere(ca)===!1)return;ou.copy(s).invert(),xr.copy(e.ray).applyMatrix4(ou);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let y=f,g=m-1;y<g;y+=c){let p=h.getX(y),M=h.getX(y+1),E=ha(this,e,xr,l,p,M,y);E&&t.push(E)}if(this.isLineLoop){let y=h.getX(m-1),g=h.getX(f),p=ha(this,e,xr,l,y,g,m-1);p&&t.push(p)}}else{let f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let y=f,g=m-1;y<g;y+=c){let p=ha(this,e,xr,l,y,y+1,y);p&&t.push(p)}if(this.isLineLoop){let y=ha(this,e,xr,l,m-1,f,m-1);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function ha(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(Na.fromBufferAttribute(a,s),Ua.fromBufferAttribute(a,r),t.distanceSqToSegment(Na,Ua,qc,au)>n)return;qc.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(qc);if(!(c<e.near||c>e.far))return{distance:c,point:au.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var Xn=class extends An{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ue(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},lu=new Ze,n1=new oi,ua=new Wn,da=new I,ai=class extends Tt{constructor(e=new mt,t=new Xn){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ua.copy(n.boundingSphere),ua.applyMatrix4(s),ua.radius+=r,e.ray.intersectsSphere(ua)===!1)return;lu.copy(s).invert(),n1.copy(e.ray).applyMatrix4(lu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let m=d,y=f;m<y;m++){let g=c.getX(m);da.fromBufferAttribute(u,g),cu(da,g,l,s,e,t,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let m=d,y=f;m<y;m++)da.fromBufferAttribute(u,m),cu(da,m,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function cu(i,e,t,n,s,r,o){let a=n1.distanceSqToPoint(i);if(a<t){let l=new I;n1.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Br=class extends dn{constructor(e=[],t=is,n,s,r,o,a,l,c,h){super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Hr=class extends dn{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var li=class extends dn{constructor(e,t,n=Bn,s,r,o,a=Jt,l=Jt,c,h=ri,u=1){if(h!==ri&&h!==fi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ns(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},zr=class extends li{constructor(e,t=Bn,n=is,s,r,o=Jt,a=Jt,l,c=ri){let h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,s,r,o,a,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Gr=class extends dn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},_e=class i extends mt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,n,t,e,o,r,0),m("z","y","x",1,-1,n,t,-e,o,r,1),m("x","z","y",1,1,e,n,t,s,o,2),m("x","z","y",1,-1,e,n,-t,s,o,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Qe(c,3)),this.setAttribute("normal",new Qe(h,3)),this.setAttribute("uv",new Qe(u,2));function m(y,g,p,M,E,x,b,S,_,v,P){let T=x/_,C=b/v,D=x/2,N=b/2,A=S/2,U=_+1,F=v+1,B=0,V=0,z=new I;for(let W=0;W<F;W++){let K=W*C-N;for(let Q=0;Q<U;Q++){let ae=Q*T-D;z[y]=ae*M,z[g]=K*E,z[p]=A,c.push(z.x,z.y,z.z),z[y]=0,z[g]=0,z[p]=S>0?1:-1,h.push(z.x,z.y,z.z),u.push(Q/_),u.push(1-W/v),B+=1}}for(let W=0;W<v;W++)for(let K=0;K<_;K++){let Q=d+K+U*W,ae=d+K+U*(W+1),k=d+(K+1)+U*(W+1),re=d+(K+1)+U*W;l.push(Q,ae,re),l.push(ae,k,re),V+=6}a.addGroup(f,V,P),f+=V,d+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},Ji=class i extends mt{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=t/2,u=Math.PI/2*e,d=t,f=2*u+d,m=n*2+r,y=s+1,g=new I,p=new I;for(let M=0;M<=m;M++){let E=0,x=0,b=0,S=0;if(M<=n){let P=M/n,T=P*Math.PI/2;x=-h-e*Math.cos(T),b=e*Math.sin(T),S=-e*Math.cos(T),E=P*u}else if(M<=n+r){let P=(M-n)/r;x=-h+P*t,b=e,S=0,E=u+P*d}else{let P=(M-n-r)/n,T=P*Math.PI/2;x=h+e*Math.sin(T),b=e*Math.cos(T),S=e*Math.sin(T),E=u+d+P*u}let _=Math.max(0,Math.min(1,E/f)),v=0;M===0?v=.5/s:M===m&&(v=-.5/s);for(let P=0;P<=s;P++){let T=P/s,C=T*Math.PI*2,D=Math.sin(C),N=Math.cos(C);p.x=-b*N,p.y=x,p.z=b*D,a.push(p.x,p.y,p.z),g.set(-b*N,S,b*D),g.normalize(),l.push(g.x,g.y,g.z),c.push(T+v,_)}if(M>0){let P=(M-1)*y;for(let T=0;T<s;T++){let C=P+T,D=P+T+1,N=M*y+T,A=M*y+T+1;o.push(C,D,N),o.push(D,A,N)}}}this.setIndex(o),this.setAttribute("position",new Qe(a,3)),this.setAttribute("normal",new Qe(l,3)),this.setAttribute("uv",new Qe(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},kr=class i extends mt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],l=[],c=new I,h=new te;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Qe(o,3)),this.setAttribute("normal",new Qe(a,3)),this.setAttribute("uv",new Qe(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},ot=class i extends mt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,y=[],g=n/2,p=0;M(),o===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new Qe(u,3)),this.setAttribute("normal",new Qe(d,3)),this.setAttribute("uv",new Qe(f,2));function M(){let x=new I,b=new I,S=0,_=(t-e)/n;for(let v=0;v<=r;v++){let P=[],T=v/r,C=T*(t-e)+e;for(let D=0;D<=s;D++){let N=D/s,A=N*l+a,U=Math.sin(A),F=Math.cos(A);b.x=C*U,b.y=-T*n+g,b.z=C*F,u.push(b.x,b.y,b.z),x.set(U,_,F).normalize(),d.push(x.x,x.y,x.z),f.push(N,1-T),P.push(m++)}y.push(P)}for(let v=0;v<s;v++)for(let P=0;P<r;P++){let T=y[P][v],C=y[P+1][v],D=y[P+1][v+1],N=y[P][v+1];(e>0||P!==0)&&(h.push(T,C,N),S+=3),(t>0||P!==r-1)&&(h.push(C,D,N),S+=3)}c.addGroup(p,S,0),p+=S}function E(x){let b=m,S=new te,_=new I,v=0,P=x===!0?e:t,T=x===!0?1:-1;for(let D=1;D<=s;D++)u.push(0,g*T,0),d.push(0,T,0),f.push(.5,.5),m++;let C=m;for(let D=0;D<=s;D++){let A=D/s*l+a,U=Math.cos(A),F=Math.sin(A);_.x=P*F,_.y=g*T,_.z=P*U,u.push(_.x,_.y,_.z),d.push(0,T,0),S.x=U*.5+.5,S.y=F*.5*T+.5,f.push(S.x,S.y),m++}for(let D=0;D<s;D++){let N=b+D,A=C+D;x===!0?h.push(A,A+1,N):h.push(A+1,A,N),v+=3}c.addGroup(p,v,x===!0?1:2),p+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Vr=class i extends ot{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Oa=class i extends mt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new Qe(r,3)),this.setAttribute("normal",new Qe(r.slice(),3)),this.setAttribute("uv",new Qe(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(M){let E=new I,x=new I,b=new I;for(let S=0;S<t.length;S+=3)f(t[S+0],E),f(t[S+1],x),f(t[S+2],b),l(E,x,b,M)}function l(M,E,x,b){let S=b+1,_=[];for(let v=0;v<=S;v++){_[v]=[];let P=M.clone().lerp(x,v/S),T=E.clone().lerp(x,v/S),C=S-v;for(let D=0;D<=C;D++)D===0&&v===S?_[v][D]=P:_[v][D]=P.clone().lerp(T,D/C)}for(let v=0;v<S;v++)for(let P=0;P<2*(S-v)-1;P++){let T=Math.floor(P/2);P%2===0?(d(_[v][T+1]),d(_[v+1][T]),d(_[v][T])):(d(_[v][T+1]),d(_[v+1][T+1]),d(_[v+1][T]))}}function c(M){let E=new I;for(let x=0;x<r.length;x+=3)E.x=r[x+0],E.y=r[x+1],E.z=r[x+2],E.normalize().multiplyScalar(M),r[x+0]=E.x,r[x+1]=E.y,r[x+2]=E.z}function h(){let M=new I;for(let E=0;E<r.length;E+=3){M.x=r[E+0],M.y=r[E+1],M.z=r[E+2];let x=g(M)/2/Math.PI+.5,b=p(M)/Math.PI+.5;o.push(x,1-b)}m(),u()}function u(){for(let M=0;M<o.length;M+=6){let E=o[M+0],x=o[M+2],b=o[M+4],S=Math.max(E,x,b),_=Math.min(E,x,b);S>.9&&_<.1&&(E<.2&&(o[M+0]+=1),x<.2&&(o[M+2]+=1),b<.2&&(o[M+4]+=1))}}function d(M){r.push(M.x,M.y,M.z)}function f(M,E){let x=M*3;E.x=e[x+0],E.y=e[x+1],E.z=e[x+2]}function m(){let M=new I,E=new I,x=new I,b=new I,S=new te,_=new te,v=new te;for(let P=0,T=0;P<r.length;P+=9,T+=6){M.set(r[P+0],r[P+1],r[P+2]),E.set(r[P+3],r[P+4],r[P+5]),x.set(r[P+6],r[P+7],r[P+8]),S.set(o[T+0],o[T+1]),_.set(o[T+2],o[T+3]),v.set(o[T+4],o[T+5]),b.copy(M).add(E).add(x).divideScalar(3);let C=g(b);y(S,T+0,M,C),y(_,T+2,E,C),y(v,T+4,x,C)}}function y(M,E,x,b){b<0&&M.x===1&&(o[E]=M.x-1),x.x===0&&x.z===0&&(o[E]=b/2/Math.PI+.5)}function g(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var Mn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ye("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new te:new I);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new I,s=[],r=[],o=[],a=new I,l=new Ze;for(let f=0;f<=e;f++){let m=f/e;s[f]=this.getTangentAt(m,new I)}r[0]=new I,o[0]=new I;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let m=Math.acos(st(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,m))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(st(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],f*m)),o[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}},Gs=class extends Mn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new te){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Fa=class extends Gs{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function I1(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var hu=new I,uu=new I,Zc=new I1,Kc=new I1,Jc=new I1,Ri=class extends Mn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new I){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(uu.subVectors(s[0],s[1]).add(s[0]),c=uu);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(hu.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=hu),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(u),f),y=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);y<1e-4&&(y=1),m<1e-4&&(m=y),g<1e-4&&(g=y),Zc.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,m,y,g),Kc.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,m,y,g),Jc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,m,y,g)}else this.curveType==="catmullrom"&&(Zc.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Kc.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Jc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Zc.calc(l),Kc.calc(l),Jc.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new I().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function du(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function a3(i,e){let t=1-i;return t*t*e}function l3(i,e){return 2*(1-i)*i*e}function c3(i,e){return i*i*e}function br(i,e,t,n){return a3(i,e)+l3(i,t)+c3(i,n)}function h3(i,e){let t=1-i;return t*t*t*e}function u3(i,e){let t=1-i;return 3*t*t*i*e}function d3(i,e){return 3*(1-i)*i*i*e}function f3(i,e){return i*i*i*e}function Sr(i,e,t,n,s){return h3(i,e)+u3(i,t)+d3(i,n)+f3(i,s)}var Wr=class extends Mn{constructor(e=new te,t=new te,n=new te,s=new te){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new te){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Sr(e,s.x,r.x,o.x,a.x),Sr(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ba=class extends Mn{constructor(e=new I,t=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new I){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Sr(e,s.x,r.x,o.x,a.x),Sr(e,s.y,r.y,o.y,a.y),Sr(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Xr=class extends Mn{constructor(e=new te,t=new te){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new te){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new te){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ha=class extends Mn{constructor(e=new I,t=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new I){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new I){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Yr=class extends Mn{constructor(e=new te,t=new te,n=new te){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new te){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(br(e,s.x,r.x,o.x),br(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},$i=class extends Mn{constructor(e=new I,t=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new I){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(br(e,s.x,r.x,o.x),br(e,s.y,r.y,o.y),br(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},qr=class extends Mn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new te){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(du(a,l.x,c.x,h.x,u.x),du(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new te().fromArray(s))}return this}},za=Object.freeze({__proto__:null,ArcCurve:Fa,CatmullRomCurve3:Ri,CubicBezierCurve:Wr,CubicBezierCurve3:Ba,EllipseCurve:Gs,LineCurve:Xr,LineCurve3:Ha,QuadraticBezierCurve:Yr,QuadraticBezierCurve3:$i,SplineCurve:qr}),Ga=class extends Mn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new za[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new za[s.type]().fromJSON(s))}return this.cacheLengths=null,this}},Zr=class extends Ga{constructor(e){super(),this.type="Path",this.currentPoint=new te,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Xr(this.currentPoint.clone(),new te(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Yr(this.currentPoint.clone(),new te(e,t),new te(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new Wr(this.currentPoint.clone(),new te(e,t),new te(n,s),new te(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new qr(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new Gs(e,t,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Yn=class extends Zr{constructor(e){super(e),this.uuid=gi(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new Zr().fromJSON(s))}return this}};function p3(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=ld(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=y3(i,e,r,t)),i.length>80*t){a=i[0],l=i[1];let h=a,u=l;for(let d=t;d<s;d+=t){let f=i[d],m=i[d+1];f<a&&(a=f),m<l&&(l=m),f>h&&(h=f),m>u&&(u=m)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return Kr(r,o,t,a,l,c,0),o}function ld(i,e,t,n,s){let r;if(s===P3(i,e,t,n)>0)for(let o=e;o<t;o+=n)r=fu(o/n|0,i[o],i[o+1],r);else for(let o=t-n;o>=e;o-=n)r=fu(o/n|0,i[o],i[o+1],r);return r&&ks(r,r.next)&&($r(r),r=r.next),r}function ji(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(ks(t,t.next)||Dt(t.prev,t,t.next)===0)){if($r(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Kr(i,e,t,n,s,r,o){if(!i)return;!o&&r&&S3(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?g3(i,n,s,r):m3(i)){e.push(l.i,i.i,c.i),$r(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=_3(ji(i),e),Kr(i,e,t,n,s,r,2)):o===2&&x3(i,e,t,n,s,r):Kr(ji(i),e,t,n,s,r,1);break}}}function m3(i){let e=i.prev,t=i,n=i.next;if(Dt(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=Math.min(s,r,o),u=Math.min(a,l,c),d=Math.max(s,r,o),f=Math.max(a,l,c),m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&yr(s,a,r,l,o,c,m.x,m.y)&&Dt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function g3(i,e,t,n){let s=i.prev,r=i,o=i.next;if(Dt(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,f=Math.min(a,l,c),m=Math.min(h,u,d),y=Math.max(a,l,c),g=Math.max(h,u,d),p=i1(f,m,e,t,n),M=i1(y,g,e,t,n),E=i.prevZ,x=i.nextZ;for(;E&&E.z>=p&&x&&x.z<=M;){if(E.x>=f&&E.x<=y&&E.y>=m&&E.y<=g&&E!==s&&E!==o&&yr(a,h,l,u,c,d,E.x,E.y)&&Dt(E.prev,E,E.next)>=0||(E=E.prevZ,x.x>=f&&x.x<=y&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&yr(a,h,l,u,c,d,x.x,x.y)&&Dt(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;E&&E.z>=p;){if(E.x>=f&&E.x<=y&&E.y>=m&&E.y<=g&&E!==s&&E!==o&&yr(a,h,l,u,c,d,E.x,E.y)&&Dt(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;x&&x.z<=M;){if(x.x>=f&&x.x<=y&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&yr(a,h,l,u,c,d,x.x,x.y)&&Dt(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function _3(i,e){let t=i;do{let n=t.prev,s=t.next.next;!ks(n,s)&&hd(n,t,t.next,s)&&Jr(n,s)&&Jr(s,n)&&(e.push(n.i,t.i,s.i),$r(t),$r(t.next),t=i=s),t=t.next}while(t!==i);return ji(t)}function x3(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&R3(o,a)){let l=ud(o,a);o=ji(o,o.next),l=ji(l,l.next),Kr(o,e,t,n,s,r,0),Kr(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function y3(i,e,t,n){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=ld(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(w3(c))}s.sort(M3);for(let r=0;r<s.length;r++)t=v3(s[r],t);return t}function M3(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function v3(i,e){let t=E3(i,e);if(!t)return e;let n=ud(t,i);return ji(n,n.next),ji(t,t.next)}function E3(i,e){let t=e,n=i.x,s=i.y,r=-1/0,o;if(ks(i,t))return t;do{if(ks(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,o=t.x<t.next.x?t:t.next,u===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;t=o;do{if(n>=t.x&&t.x>=l&&n!==t.x&&cd(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);Jr(t,i)&&(u<h||u===h&&(t.x>o.x||t.x===o.x&&b3(o,t)))&&(o=t,h=u)}t=t.next}while(t!==a);return o}function b3(i,e){return Dt(i.prev,i,e.prev)<0&&Dt(e.next,i,i.next)<0}function S3(i,e,t,n){let s=i;do s.z===0&&(s.z=i1(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,T3(s)}function T3(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,t*=2}while(e>1);return i}function i1(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function w3(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function cd(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function yr(i,e,t,n,s,r,o,a){return!(i===o&&e===a)&&cd(i,e,t,n,s,r,o,a)}function R3(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!A3(i,e)&&(Jr(i,e)&&Jr(e,i)&&C3(i,e)&&(Dt(i.prev,i,e.prev)||Dt(i,e.prev,e))||ks(i,e)&&Dt(i.prev,i,i.next)>0&&Dt(e.prev,e,e.next)>0)}function Dt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function ks(i,e){return i.x===e.x&&i.y===e.y}function hd(i,e,t,n){let s=pa(Dt(i,e,t)),r=pa(Dt(i,e,n)),o=pa(Dt(t,n,i)),a=pa(Dt(t,n,e));return!!(s!==r&&o!==a||s===0&&fa(i,t,e)||r===0&&fa(i,n,e)||o===0&&fa(t,i,n)||a===0&&fa(t,e,n))}function fa(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function pa(i){return i>0?1:i<0?-1:0}function A3(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&hd(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Jr(i,e){return Dt(i.prev,i,i.next)<0?Dt(i,e,i.next)>=0&&Dt(i,i.prev,e)>=0:Dt(i,e,i.prev)<0||Dt(i,i.next,e)<0}function C3(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function ud(i,e){let t=s1(i.i,i.x,i.y),n=s1(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function fu(i,e,t,n){let s=s1(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function $r(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function s1(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function P3(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var r1=class{static triangulate(e,t,n=2){return p3(e,t,n)}},Zi=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];pu(e),mu(n,e);let o=e.length;t.forEach(pu);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,mu(n,t[l]);let a=r1.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function pu(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function mu(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var ci=class i extends mt{constructor(e=new Yn([new te(.5,.5),new te(-.5,.5),new te(-.5,-.5),new te(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new Qe(s,3)),this.setAttribute("uv",new Qe(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,y=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:I3,E,x=!1,b,S,_,v;if(p){E=p.getSpacedPoints(h),x=!0,d=!1;let $=p.isCatmullRomCurve3?p.closed:!1;b=p.computeFrenetFrames(h,$),S=new I,_=new I,v=new I}d||(g=0,f=0,m=0,y=0);let P=a.extractPoints(c),T=P.shape,C=P.holes;if(!Zi.isClockWise(T)){T=T.reverse();for(let $=0,le=C.length;$<le;$++){let de=C[$];Zi.isClockWise(de)&&(C[$]=de.reverse())}}function N($){let de=10000000000000001e-36,Ie=$[0];for(let Me=1;Me<=$.length;Me++){let Ke=Me%$.length,ze=$[Ke],ht=ze.x-Ie.x,ut=ze.y-Ie.y,_t=ht*ht+ut*ut,G=Math.max(Math.abs(ze.x),Math.abs(ze.y),Math.abs(Ie.x),Math.abs(Ie.y)),Ot=de*G*G;if(_t<=Ot){$.splice(Ke,1),Me--;continue}Ie=ze}}N(T),C.forEach(N);let A=C.length,U=T;for(let $=0;$<A;$++){let le=C[$];T=T.concat(le)}function F($,le,de){return le||qe("ExtrudeGeometry: vec does not exist"),$.clone().addScaledVector(le,de)}let B=T.length;function V($,le,de){let Ie,Me,Ke,ze=$.x-le.x,ht=$.y-le.y,ut=de.x-$.x,_t=de.y-$.y,G=ze*ze+ht*ht,Ot=ze*_t-ht*ut;if(Math.abs(Ot)>Number.EPSILON){let at=Math.sqrt(G),wt=Math.sqrt(ut*ut+_t*_t),we=le.x-ht/at,Nt=le.y+ze/at,Xe=de.x-_t/wt,Je=de.y+ut/wt,L=((Xe-we)*_t-(Je-Nt)*ut)/(ze*_t-ht*ut);Ie=we+ze*L-$.x,Me=Nt+ht*L-$.y;let w=Ie*Ie+Me*Me;if(w<=2)return new te(Ie,Me);Ke=Math.sqrt(w/2)}else{let at=!1;ze>Number.EPSILON?ut>Number.EPSILON&&(at=!0):ze<-Number.EPSILON?ut<-Number.EPSILON&&(at=!0):Math.sign(ht)===Math.sign(_t)&&(at=!0),at?(Ie=-ht,Me=ze,Ke=Math.sqrt(G)):(Ie=ze,Me=ht,Ke=Math.sqrt(G/2))}return new te(Ie/Ke,Me/Ke)}let z=[];for(let $=0,le=U.length,de=le-1,Ie=$+1;$<le;$++,de++,Ie++)de===le&&(de=0),Ie===le&&(Ie=0),z[$]=V(U[$],U[de],U[Ie]);let W=[],K,Q=z.concat();for(let $=0,le=A;$<le;$++){let de=C[$];K=[];for(let Ie=0,Me=de.length,Ke=Me-1,ze=Ie+1;Ie<Me;Ie++,Ke++,ze++)Ke===Me&&(Ke=0),ze===Me&&(ze=0),K[Ie]=V(de[Ie],de[Ke],de[ze]);W.push(K),Q=Q.concat(K)}let ae;if(g===0)ae=Zi.triangulateShape(U,C);else{let $=[],le=[];for(let de=0;de<g;de++){let Ie=de/g,Me=f*Math.cos(Ie*Math.PI/2),Ke=m*Math.sin(Ie*Math.PI/2)+y;for(let ze=0,ht=U.length;ze<ht;ze++){let ut=F(U[ze],z[ze],Ke);Ne(ut.x,ut.y,-Me),Ie===0&&$.push(ut)}for(let ze=0,ht=A;ze<ht;ze++){let ut=C[ze];K=W[ze];let _t=[];for(let G=0,Ot=ut.length;G<Ot;G++){let at=F(ut[G],K[G],Ke);Ne(at.x,at.y,-Me),Ie===0&&_t.push(at)}Ie===0&&le.push(_t)}}ae=Zi.triangulateShape($,le)}let k=ae.length,re=m+y;for(let $=0;$<B;$++){let le=d?F(T[$],Q[$],re):T[$];x?(_.copy(b.normals[0]).multiplyScalar(le.x),S.copy(b.binormals[0]).multiplyScalar(le.y),v.copy(E[0]).add(_).add(S),Ne(v.x,v.y,v.z)):Ne(le.x,le.y,0)}for(let $=1;$<=h;$++)for(let le=0;le<B;le++){let de=d?F(T[le],Q[le],re):T[le];x?(_.copy(b.normals[$]).multiplyScalar(de.x),S.copy(b.binormals[$]).multiplyScalar(de.y),v.copy(E[$]).add(_).add(S),Ne(v.x,v.y,v.z)):Ne(de.x,de.y,u/h*$)}for(let $=g-1;$>=0;$--){let le=$/g,de=f*Math.cos(le*Math.PI/2),Ie=m*Math.sin(le*Math.PI/2)+y;for(let Me=0,Ke=U.length;Me<Ke;Me++){let ze=F(U[Me],z[Me],Ie);Ne(ze.x,ze.y,u+de)}for(let Me=0,Ke=C.length;Me<Ke;Me++){let ze=C[Me];K=W[Me];for(let ht=0,ut=ze.length;ht<ut;ht++){let _t=F(ze[ht],K[ht],Ie);x?Ne(_t.x,_t.y+E[h-1].y,E[h-1].x+de):Ne(_t.x,_t.y,u+de)}}}ce(),Ce();function ce(){let $=s.length/3;if(d){let le=0,de=B*le;for(let Ie=0;Ie<k;Ie++){let Me=ae[Ie];et(Me[2]+de,Me[1]+de,Me[0]+de)}le=h+g*2,de=B*le;for(let Ie=0;Ie<k;Ie++){let Me=ae[Ie];et(Me[0]+de,Me[1]+de,Me[2]+de)}}else{for(let le=0;le<k;le++){let de=ae[le];et(de[2],de[1],de[0])}for(let le=0;le<k;le++){let de=ae[le];et(de[0]+B*h,de[1]+B*h,de[2]+B*h)}}n.addGroup($,s.length/3-$,0)}function Ce(){let $=s.length/3,le=0;he(U,le),le+=U.length;for(let de=0,Ie=C.length;de<Ie;de++){let Me=C[de];he(Me,le),le+=Me.length}n.addGroup($,s.length/3-$,1)}function he($,le){let de=$.length;for(;--de>=0;){let Ie=de,Me=de-1;Me<0&&(Me=$.length-1);for(let Ke=0,ze=h+g*2;Ke<ze;Ke++){let ht=B*Ke,ut=B*(Ke+1),_t=le+Ie+ht,G=le+Me+ht,Ot=le+Me+ut,at=le+Ie+ut;Le(_t,G,Ot,at)}}}function Ne($,le,de){l.push($),l.push(le),l.push(de)}function et($,le,de){oe($),oe(le),oe(de);let Ie=s.length/3,Me=M.generateTopUV(n,s,Ie-3,Ie-2,Ie-1);ye(Me[0]),ye(Me[1]),ye(Me[2])}function Le($,le,de,Ie){oe($),oe(le),oe(Ie),oe(le),oe(de),oe(Ie);let Me=s.length/3,Ke=M.generateSideWallUV(n,s,Me-6,Me-3,Me-2,Me-1);ye(Ke[0]),ye(Ke[1]),ye(Ke[3]),ye(Ke[1]),ye(Ke[2]),ye(Ke[3])}function oe($){s.push(l[$*3+0]),s.push(l[$*3+1]),s.push(l[$*3+2])}function ye($){r.push($.x),r.push($.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return L3(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new za[s.type]().fromJSON(s)),new i(n,e.options)}},I3={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new te(r,o),new te(a,l),new te(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],m=e[s*3+2],y=e[r*3],g=e[r*3+1],p=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new te(o,1-l),new te(c,1-u),new te(d,1-m),new te(y,1-p)]:[new te(a,1-l),new te(h,1-u),new te(f,1-m),new te(g,1-p)]}};function L3(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var hi=class i extends Oa{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Fn=class i extends mt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=e/a,d=t/l,f=[],m=[],y=[],g=[];for(let p=0;p<h;p++){let M=p*d-o;for(let E=0;E<c;E++){let x=E*u-r;m.push(x,-M,0),y.push(0,0,1),g.push(E/a),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<a;M++){let E=M+c*p,x=M+c*(p+1),b=M+1+c*(p+1),S=M+1+c*p;f.push(E,x,S),f.push(x,b,S)}this.setIndex(f),this.setAttribute("position",new Qe(m,3)),this.setAttribute("normal",new Qe(y,3)),this.setAttribute("uv",new Qe(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var pt=class i extends mt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new I,d=new I,f=[],m=[],y=[],g=[];for(let p=0;p<=n;p++){let M=[],E=p/n,x=o+E*a,b=e*Math.cos(x),S=Math.sqrt(e*e-b*b),_=0;p===0&&o===0?_=.5/t:p===n&&l===Math.PI&&(_=-.5/t);for(let v=0;v<=t;v++){let P=v/t,T=s+P*r;u.x=-S*Math.cos(T),u.y=b,u.z=S*Math.sin(T),m.push(u.x,u.y,u.z),d.copy(u).normalize(),y.push(d.x,d.y,d.z),g.push(P+_,1-E),M.push(c++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<t;M++){let E=h[p][M+1],x=h[p][M],b=h[p+1][M],S=h[p+1][M+1];(p!==0||o>0)&&f.push(E,x,S),(p!==n-1||l<Math.PI)&&f.push(x,b,S)}this.setIndex(f),this.setAttribute("position",new Qe(m,3)),this.setAttribute("normal",new Qe(y,3)),this.setAttribute("uv",new Qe(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Et=class i extends mt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],h=[],u=[],d=new I,f=new I,m=new I;for(let y=0;y<=n;y++){let g=o+y/n*a;for(let p=0;p<=s;p++){let M=p/s*r;f.x=(e+t*Math.cos(g))*Math.cos(M),f.y=(e+t*Math.cos(g))*Math.sin(M),f.z=t*Math.sin(g),c.push(f.x,f.y,f.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),m.subVectors(f,d).normalize(),h.push(m.x,m.y,m.z),u.push(p/s),u.push(y/n)}}for(let y=1;y<=n;y++)for(let g=1;g<=s;g++){let p=(s+1)*y+g-1,M=(s+1)*(y-1)+g-1,E=(s+1)*(y-1)+g,x=(s+1)*y+g;l.push(p,M,x),l.push(M,E,x)}this.setIndex(l),this.setAttribute("position",new Qe(c,3)),this.setAttribute("normal",new Qe(h,3)),this.setAttribute("uv",new Qe(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};var Qi=class i extends mt{constructor(e=new $i(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new I,l=new I,c=new te,h=new I,u=[],d=[],f=[],m=[];y(),this.setIndex(m),this.setAttribute("position",new Qe(u,3)),this.setAttribute("normal",new Qe(d,3)),this.setAttribute("uv",new Qe(f,2));function y(){for(let E=0;E<t;E++)g(E);g(r===!1?t:0),M(),p()}function g(E){h=e.getPointAt(E/t,h);let x=o.normals[E],b=o.binormals[E];for(let S=0;S<=s;S++){let _=S/s*Math.PI*2,v=Math.sin(_),P=-Math.cos(_);l.x=P*x.x+v*b.x,l.y=P*x.y+v*b.y,l.z=P*x.z+v*b.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function p(){for(let E=1;E<=t;E++)for(let x=1;x<=s;x++){let b=(s+1)*(E-1)+(x-1),S=(s+1)*E+(x-1),_=(s+1)*E+x,v=(s+1)*(E-1)+x;m.push(b,S,v),m.push(S,_,v)}}function M(){for(let E=0;E<=t;E++)for(let x=0;x<=s;x++)c.x=E/t,c.y=x/s,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new za[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};function rs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(gu(s))s.isRenderTargetTexture?(Ye("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(gu(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function an(i){let e={};for(let t=0;t<i.length;t++){let n=rs(i[t]);for(let s in n)e[s]=n[s]}return e}function gu(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function D3(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function L1(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:lt.workingColorSpace}var Pn={clone:rs,merge:an},N3=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,U3=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Pt=class extends An{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=N3,this.fragmentShader=U3,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=rs(e.uniforms),this.uniformsGroups=D3(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new ue().setHex(s.value);break;case"v2":this.uniforms[n].value=new te().fromArray(s.value);break;case"v3":this.uniforms[n].value=new I().fromArray(s.value);break;case"v4":this.uniforms[n].value=new It().fromArray(s.value);break;case"m3":this.uniforms[n].value=new $e().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Ze().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Vs=class extends Pt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ke=class extends An{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bo,this.normalScale=new te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var jr=class extends An{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bo,this.normalScale=new te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=sl,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ka=class extends An{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Zu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Va=class extends An{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ws(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function ma(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Ai=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Wa=class extends Ai{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Qc,endingEnd:Qc}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case e1:r=e,a=2*t-n;break;case t1:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case e1:o=e,l=2*n-t;break;case t1:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),y=m*m,g=y*m,p=-d*g+2*d*y-d*m,M=(1+d)*g+(-1.5-2*d)*y+(-.5+d)*m+1,E=(-1-f)*g+(1.5+f)*y+.5*m,x=f*g-f*y;for(let b=0;b!==a;++b)r[b]=p*o[h+b]+M*o[c+b]+E*o[l+b]+x*o[u+b];return r}},Xa=class extends Ai{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},Ya=class extends Ai{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},qa=class extends Ai{interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this.inTangents,u=this.outTangents;if(!h||!u){let m=(n-t)/(s-t),y=1-m;for(let g=0;g!==a;++g)r[g]=o[c+g]*y+o[l+g]*m;return r}let d=a*2,f=e-1;for(let m=0;m!==a;++m){let y=o[c+m],g=o[l+m],p=f*d+m*2,M=u[p],E=u[p+1],x=e*d+m*2,b=h[x],S=h[x+1],_=F3(n,t,M,b,s);r[m]=dd(_,y,E,S,g)}return r}};function dd(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function O3(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function F3(i,e,t,n,s){let r=(i-e)/(s-e);for(let o=0;o<8;o++){let a=dd(r,e,t,n,s)-i;if(Math.abs(a)<1e-10)break;let l=O3(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var vn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ws(t,this.TimeBufferType),this.values=ws(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ws(e.times,Array),values:ws(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),ma(e.settings)&&(n.settings={inTangents:ws(e.settings.inTangents,Array),outTangents:ws(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ya(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Xa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Wa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new qa(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Tr:t=this.InterpolantFactoryMethodDiscrete;break;case Ca:t=this.InterpolantFactoryMethodLinear;break;case xa:t=this.InterpolantFactoryMethodSmooth;break;case jc:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ye("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Tr;case this.InterpolantFactoryMethodLinear:return Ca;case this.InterpolantFactoryMethodSmooth:return xa;case this.InterpolantFactoryMethodBezier:return jc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e;ma(this.settings)&&(_u(this.settings.inTangents,e),_u(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;ma(this.settings)&&(xu(this.settings.inTangents,e),xu(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(qe("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(qe("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){qe("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){qe("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&wp(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){qe("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===xa,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){let y=t[u+m];if(y!==t[d+m]||y!==t[f+m]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,ma(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function _u(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]+=e}function xu(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}vn.prototype.ValueTypeName="";vn.prototype.TimeBufferType=Float32Array;vn.prototype.ValueBufferType=Float32Array;vn.prototype.DefaultInterpolation=Ca;var Ci=class extends vn{constructor(e,t,n){super(e,t,n)}};Ci.prototype.ValueTypeName="bool";Ci.prototype.ValueBufferType=Array;Ci.prototype.DefaultInterpolation=Tr;Ci.prototype.InterpolantFactoryMethodLinear=void 0;Ci.prototype.InterpolantFactoryMethodSmooth=void 0;var Za=class extends vn{constructor(e,t,n,s){super(e,t,n,s)}};Za.prototype.ValueTypeName="color";var Ka=class extends vn{constructor(e,t,n,s){super(e,t,n,s)}};Ka.prototype.ValueTypeName="number";var Ja=class extends Ai{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)kt.slerpFlat(r,0,o,c-a,o,c,l);return r}},Qr=class extends vn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Ja(this.times,this.values,this.getValueSize(),e)}};Qr.prototype.ValueTypeName="quaternion";Qr.prototype.InterpolantFactoryMethodSmooth=void 0;var Pi=class extends vn{constructor(e,t,n){super(e,t,n)}};Pi.prototype.ValueTypeName="string";Pi.prototype.ValueBufferType=Array;Pi.prototype.DefaultInterpolation=Tr;Pi.prototype.InterpolantFactoryMethodLinear=void 0;Pi.prototype.InterpolantFactoryMethodSmooth=void 0;var $a=class extends vn{constructor(e,t,n,s){super(e,t,n,s)}};$a.prototype.ValueTypeName="vector";var ja=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},fd=new ja,Qa=class{constructor(e){this.manager=e!==void 0?e:fd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};Qa.DEFAULT_MATERIAL_NAME="__DEFAULT";var eo=class extends Tt{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ue(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},to=class extends eo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ue(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},$c=new Ze,yu=new I,Mu=new I,el=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new te(512,512),this.mapType=fn,this.map=null,this.mapPass=null,this.matrix=new Ze,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new wi,this._frameExtents=new te(1,1),this._viewportCount=1,this._viewports=[new It(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;yu.setFromMatrixPosition(e.matrixWorld),t.position.copy(yu),Mu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Mu),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){$c.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix($c,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===Is||e.reversedDepth?t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),t.multiply($c)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ga=new I,_a=new kt,Gn=new I,no=class extends Tt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ze,this.projectionMatrix=new Ze,this.projectionMatrixInverse=new Ze,this.coordinateSystem=wn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ga,_a,Gn),Gn.x===1&&Gn.y===1&&Gn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ga,_a,Gn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ga,_a,Gn),Gn.x===1&&Gn.y===1&&Gn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ga,_a,Gn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ti=new I,vu=new te,Eu=new te,hn=class extends no{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ds*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(vr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ds*2*Math.atan(Math.tan(vr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ti.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ti.x,Ti.y).multiplyScalar(-e/Ti.z),Ti.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ti.x,Ti.y).multiplyScalar(-e/Ti.z)}getViewSize(e,t){return this.getViewBounds(e,vu,Eu),t.subVectors(Eu,vu)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(vr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var es=class extends no{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},o1=class extends el{constructor(){super(new es(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},io=class extends eo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.target=new Tt,this.shadow=new o1}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Rs=-90,As=1,Ws=class extends Tt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new hn(Rs,As,e,t);s.layers=this.layers,this.add(s);let r=new hn(Rs,As,e,t);r.layers=this.layers,this.add(r);let o=new hn(Rs,As,e,t);o.layers=this.layers,this.add(o);let a=new hn(Rs,As,e,t);a.layers=this.layers,this.add(a);let l=new hn(Rs,As,e,t);l.layers=this.layers,this.add(l);let c=new hn(Rs,As,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===wn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Is)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=y,e.setRenderTarget(n,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},tl=class extends hn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},so=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=B3.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function B3(){this._document.hidden===!1&&this.reset()}var D1="\\[\\]\\.:\\/",H3=new RegExp("["+D1+"]","g"),N1="[^"+D1+"]",z3="[^"+D1.replace("\\.","")+"]",G3=/((?:WC+[\/:])*)/.source.replace("WC",N1),k3=/(WCOD+)?/.source.replace("WCOD",z3),V3=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",N1),W3=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",N1),X3=new RegExp("^"+G3+k3+V3+W3+"$"),Y3=["material","materials","bones","map"],a1=class{constructor(e,t,n){let s=n||Ct.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ct=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(H3,"")}static parseTrackName(e){let t=X3.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Y3.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ye("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){qe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){qe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){qe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){qe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){qe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){qe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){qe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;qe("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){qe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){qe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ct.Composite=a1;Ct.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ct.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ct.prototype.GetterByBindingType=[Ct.prototype._getValue_direct,Ct.prototype._getValue_array,Ct.prototype._getValue_arrayElement,Ct.prototype._getValue_toArray];Ct.prototype.SetterByBindingTypeAndVersioning=[[Ct.prototype._setValue_direct,Ct.prototype._setValue_direct_setNeedsUpdate,Ct.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_array,Ct.prototype._setValue_array_setNeedsUpdate,Ct.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_arrayElement,Ct.prototype._setValue_arrayElement_setNeedsUpdate,Ct.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_fromArray,Ct.prototype._setValue_fromArray_setNeedsUpdate,Ct.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Hy=new Float32Array(1);var bu=new Ze,ro=class{constructor(e,t,n=0,s=1/0){this.ray=new oi(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Us,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):qe("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return bu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(bu),this}intersectObject(e,t=!0,n=[]){return l1(e,this,n,t),n.sort(Su),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)l1(e[s],this,n,t);return n.sort(Su),n}};function Su(i,e){return i.distance-e.distance}function l1(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)l1(r[o],e,t,!0)}}var oo=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Ye("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}},Xs=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=st(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(st(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var z1=class z1{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};z1.prototype.isMatrix2=!0;var c1=z1;var ao=class extends On{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function U1(i,e,t,n){let s=q3(n);switch(t){case M1:return i*e;case ul:return i*e/s.components*s.byteLength;case dl:return i*e/s.components*s.byteLength;case Ni:return i*e*2/s.components*s.byteLength;case fl:return i*e*2/s.components*s.byteLength;case v1:return i*e*3/s.components*s.byteLength;case Hn:return i*e*4/s.components*s.byteLength;case pl:return i*e*4/s.components*s.byteLength;case _o:case xo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case yo:case Mo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case gl:case xl:return Math.max(i,16)*Math.max(e,8)/4;case ml:case _l:return Math.max(i,8)*Math.max(e,8)/2;case yl:case Ml:case El:case bl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case vl:case vo:case Sl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Tl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case wl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Rl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Al:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Cl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Pl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Il:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ll:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Dl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Nl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ul:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Ol:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Fl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Bl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Hl:case zl:case Gl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case kl:case Vl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Eo:case Wl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function q3(i){switch(i){case fn:case g1:return{byteLength:1,components:1};case Ks:case _1:case en:return{byteLength:2,components:1};case cl:case hl:return{byteLength:2,components:4};case Bn:case ll:case Cn:return{byteLength:4,components:1};case x1:case y1:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window!="undefined"&&(window.__THREE__?Ye("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function Ud(){let i=null,e=!1,t=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),t(r,o)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function j3(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array!="undefined"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],y=u[f];y.start<=m.start+m.count+1?m.count=Math.max(m.count,y.start+y.count-m.start):(++d,u[d]=y)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let y=u[f];i.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Q3=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,em=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,tm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,nm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,im=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,sm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,rm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,om=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,am=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,lm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,cm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,hm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,um=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,dm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,fm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,pm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,mm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,gm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,_m=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,xm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,ym=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Mm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,vm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Em=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,bm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Sm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Tm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,wm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Rm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Am="gl_FragColor = linearToOutputTexel( gl_FragColor );",Cm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Pm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Im=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Lm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Dm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Nm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Um=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Om=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Bm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Hm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,zm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Gm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,km=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Vm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Wm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Xm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ym=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Km=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Jm=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,$m=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,jm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Qm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,e0=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,t0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,n0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,i0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,s0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,r0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,o0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,a0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,l0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,c0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,h0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,u0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,d0=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,f0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,p0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,m0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,g0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,_0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,x0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,y0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,M0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,v0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,E0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,b0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,S0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,T0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,w0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,R0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,A0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,C0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,P0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,I0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,L0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,D0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,N0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,U0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,O0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,F0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,B0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,H0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,z0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,G0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,k0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,V0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,W0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,X0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Y0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,q0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Z0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,K0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,J0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,$0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,j0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Q0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,e4=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,t4=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n4=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,i4=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s4=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,r4=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,o4=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,a4=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,l4=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,c4=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,h4=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,u4=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,d4=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,f4=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,p4=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,m4=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,g4=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,_4=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x4=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,y4=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,M4=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,v4=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,E4=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,b4=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S4=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,T4=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,w4=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,R4=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,A4=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,C4=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,P4=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,I4=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,rt={alphahash_fragment:Q3,alphahash_pars_fragment:em,alphamap_fragment:tm,alphamap_pars_fragment:nm,alphatest_fragment:im,alphatest_pars_fragment:sm,aomap_fragment:rm,aomap_pars_fragment:om,batching_pars_vertex:am,batching_vertex:lm,begin_vertex:cm,beginnormal_vertex:hm,bsdfs:um,iridescence_fragment:dm,bumpmap_pars_fragment:fm,clipping_planes_fragment:pm,clipping_planes_pars_fragment:mm,clipping_planes_pars_vertex:gm,clipping_planes_vertex:_m,color_fragment:xm,color_pars_fragment:ym,color_pars_vertex:Mm,color_vertex:vm,common:Em,defaultnormal_vertex:bm,displacementmap_pars_vertex:Sm,displacementmap_vertex:Tm,emissivemap_fragment:wm,emissivemap_pars_fragment:Rm,colorspace_fragment:Am,colorspace_pars_fragment:Cm,envmap_fragment:Pm,envmap_common_pars_fragment:Im,envmap_pars_fragment:Lm,envmap_pars_vertex:Dm,envmap_physical_pars_fragment:Wm,envmap_vertex:Nm,fog_vertex:Um,fog_pars_vertex:Om,fog_fragment:Fm,fog_pars_fragment:Bm,gradientmap_pars_fragment:Hm,lightmap_pars_fragment:zm,lights_lambert_fragment:Gm,lights_lambert_pars_fragment:km,lights_pars_begin:Vm,lights_toon_fragment:Xm,lights_toon_pars_fragment:Ym,lights_phong_fragment:qm,lights_phong_pars_fragment:Zm,lights_physical_fragment:Km,lights_physical_pars_fragment:Jm,lights_fragment_begin:$m,lights_fragment_maps:jm,lights_fragment_end:Qm,lightprobes_pars_fragment:e0,logdepthbuf_fragment:t0,logdepthbuf_pars_fragment:n0,logdepthbuf_pars_vertex:i0,logdepthbuf_vertex:s0,map_fragment:r0,map_pars_fragment:o0,map_particle_fragment:a0,map_particle_pars_fragment:l0,metalnessmap_fragment:c0,metalnessmap_pars_fragment:h0,morphinstance_vertex:u0,morphcolor_vertex:d0,morphnormal_vertex:f0,morphtarget_pars_vertex:p0,morphtarget_vertex:m0,normal_fragment_begin:g0,normal_fragment_maps:_0,normal_pars_fragment:x0,normal_pars_vertex:y0,normal_vertex:M0,normalmap_pars_fragment:v0,clearcoat_normal_fragment_begin:E0,clearcoat_normal_fragment_maps:b0,clearcoat_pars_fragment:S0,iridescence_pars_fragment:T0,opaque_fragment:w0,packing:R0,premultiplied_alpha_fragment:A0,project_vertex:C0,dithering_fragment:P0,dithering_pars_fragment:I0,roughnessmap_fragment:L0,roughnessmap_pars_fragment:D0,shadowmap_pars_fragment:N0,shadowmap_pars_vertex:U0,shadowmap_vertex:O0,shadowmask_pars_fragment:F0,skinbase_vertex:B0,skinning_pars_vertex:H0,skinning_vertex:z0,skinnormal_vertex:G0,specularmap_fragment:k0,specularmap_pars_fragment:V0,tonemapping_fragment:W0,tonemapping_pars_fragment:X0,transmission_fragment:Y0,transmission_pars_fragment:q0,uv_pars_fragment:Z0,uv_pars_vertex:K0,uv_vertex:J0,worldpos_vertex:$0,background_vert:j0,background_frag:Q0,backgroundCube_vert:e4,backgroundCube_frag:t4,cube_vert:n4,cube_frag:i4,depth_vert:s4,depth_frag:r4,distance_vert:o4,distance_frag:a4,equirect_vert:l4,equirect_frag:c4,linedashed_vert:h4,linedashed_frag:u4,meshbasic_vert:d4,meshbasic_frag:f4,meshlambert_vert:p4,meshlambert_frag:m4,meshmatcap_vert:g4,meshmatcap_frag:_4,meshnormal_vert:x4,meshnormal_frag:y4,meshphong_vert:M4,meshphong_frag:v4,meshphysical_vert:E4,meshphysical_frag:b4,meshtoon_vert:S4,meshtoon_frag:T4,points_vert:w4,points_frag:R4,shadow_vert:A4,shadow_frag:C4,sprite_vert:P4,sprite_frag:I4},Pe={common:{diffuse:{value:new ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new ue(16777215)},opacity:{value:1},center:{value:new te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},Kn={basic:{uniforms:an([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.fog]),vertexShader:rt.meshbasic_vert,fragmentShader:rt.meshbasic_frag},lambert:{uniforms:an([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new ue(0)},envMapIntensity:{value:1}}]),vertexShader:rt.meshlambert_vert,fragmentShader:rt.meshlambert_frag},phong:{uniforms:an([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new ue(0)},specular:{value:new ue(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:rt.meshphong_vert,fragmentShader:rt.meshphong_frag},standard:{uniforms:an([Pe.common,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.roughnessmap,Pe.metalnessmap,Pe.fog,Pe.lights,{emissive:{value:new ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag},toon:{uniforms:an([Pe.common,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.gradientmap,Pe.fog,Pe.lights,{emissive:{value:new ue(0)}}]),vertexShader:rt.meshtoon_vert,fragmentShader:rt.meshtoon_frag},matcap:{uniforms:an([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,{matcap:{value:null}}]),vertexShader:rt.meshmatcap_vert,fragmentShader:rt.meshmatcap_frag},points:{uniforms:an([Pe.points,Pe.fog]),vertexShader:rt.points_vert,fragmentShader:rt.points_frag},dashed:{uniforms:an([Pe.common,Pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:rt.linedashed_vert,fragmentShader:rt.linedashed_frag},depth:{uniforms:an([Pe.common,Pe.displacementmap]),vertexShader:rt.depth_vert,fragmentShader:rt.depth_frag},normal:{uniforms:an([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,{opacity:{value:1}}]),vertexShader:rt.meshnormal_vert,fragmentShader:rt.meshnormal_frag},sprite:{uniforms:an([Pe.sprite,Pe.fog]),vertexShader:rt.sprite_vert,fragmentShader:rt.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:rt.background_vert,fragmentShader:rt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:rt.backgroundCube_vert,fragmentShader:rt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:rt.cube_vert,fragmentShader:rt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:rt.equirect_vert,fragmentShader:rt.equirect_frag},distance:{uniforms:an([Pe.common,Pe.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:rt.distance_vert,fragmentShader:rt.distance_frag},shadow:{uniforms:an([Pe.lights,Pe.fog,{color:{value:new ue(0)},opacity:{value:1}}]),vertexShader:rt.shadow_vert,fragmentShader:rt.shadow_frag}};Kn.physical={uniforms:an([Kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new $e},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new ue(0)},specularColor:{value:new ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag};var ql={r:0,b:0,g:0},L4=new Ze,Od=new $e;Od.set(-1,0,0,0,1,0,0,0,1);function D4(i,e,t,n,s,r){let o=new ue(0),a=s===!0?0:1,l,c,h=null,u=0,d=null;function f(M){let E=M.isScene===!0?M.background:null;if(E&&E.isTexture){let x=M.backgroundBlurriness>0;E=e.get(E,x)}return E}function m(M){let E=!1,x=f(M);x===null?g(o,a):x&&x.isColor&&(g(x,1),E=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function y(M,E){let x=f(E);x&&x.isCubeTexture?(c===void 0&&(c=new Z(new _e(1,1,1),new Pt({name:"BackgroundCubeMaterial",uniforms:rs(Kn.backgroundCube.uniforms),vertexShader:Kn.backgroundCube.vertexShader,fragmentShader:Kn.backgroundCube.fragmentShader,side:Qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,S,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(L4.makeRotationFromEuler(E.backgroundRotation)).transpose(),x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Od),c.material.toneMapped=lt.getTransfer(x.colorSpace)!==xt,(h!==x||u!==x.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=x,u=x.version,d=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new Z(new Fn(2,2),new Pt({name:"BackgroundMaterial",uniforms:rs(Kn.background.uniforms),vertexShader:Kn.background.vertexShader,fragmentShader:Kn.background.fragmentShader,side:Di,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=lt.getTransfer(x.colorSpace)!==xt,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||u!==x.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=x,u=x.version,d=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function g(M,E){M.getRGB(ql,L1(i)),t.buffers.color.setClear(ql.r,ql.g,ql.b,E,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,E=1){o.set(M),a=E,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(M){a=M,g(o,a)},render:m,addToRenderList:y,dispose:p}}function N4(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(C,D,N,A,U){let F=!1,B=u(C,A,N,D);r!==B&&(r=B,c(r.object)),F=f(C,A,N,U),F&&m(C,A,N,U),U!==null&&e.update(U,i.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,x(C,D,N,A),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(U).buffer))}function l(){return i.createVertexArray()}function c(C){return i.bindVertexArray(C)}function h(C){return i.deleteVertexArray(C)}function u(C,D,N,A){let U=A.wireframe===!0,F=n[D.id];F===void 0&&(F={},n[D.id]=F);let B=C.isInstancedMesh===!0?C.id:0,V=F[B];V===void 0&&(V={},F[B]=V);let z=V[N.id];z===void 0&&(z={},V[N.id]=z);let W=z[U];return W===void 0&&(W=d(l()),z[U]=W),W}function d(C){let D=[],N=[],A=[];for(let U=0;U<t;U++)D[U]=0,N[U]=0,A[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:N,attributeDivisors:A,object:C,attributes:{},index:null}}function f(C,D,N,A){let U=r.attributes,F=D.attributes,B=0,V=N.getAttributes();for(let z in V)if(V[z].location>=0){let K=U[z],Q=F[z];if(Q===void 0&&(z==="instanceMatrix"&&C.instanceMatrix&&(Q=C.instanceMatrix),z==="instanceColor"&&C.instanceColor&&(Q=C.instanceColor)),K===void 0||K.attribute!==Q||Q&&K.data!==Q.data)return!0;B++}return r.attributesNum!==B||r.index!==A}function m(C,D,N,A){let U={},F=D.attributes,B=0,V=N.getAttributes();for(let z in V)if(V[z].location>=0){let K=F[z];K===void 0&&(z==="instanceMatrix"&&C.instanceMatrix&&(K=C.instanceMatrix),z==="instanceColor"&&C.instanceColor&&(K=C.instanceColor));let Q={};Q.attribute=K,K&&K.data&&(Q.data=K.data),U[z]=Q,B++}r.attributes=U,r.attributesNum=B,r.index=A}function y(){let C=r.newAttributes;for(let D=0,N=C.length;D<N;D++)C[D]=0}function g(C){p(C,0)}function p(C,D){let N=r.newAttributes,A=r.enabledAttributes,U=r.attributeDivisors;N[C]=1,A[C]===0&&(i.enableVertexAttribArray(C),A[C]=1),U[C]!==D&&(i.vertexAttribDivisor(C,D),U[C]=D)}function M(){let C=r.newAttributes,D=r.enabledAttributes;for(let N=0,A=D.length;N<A;N++)D[N]!==C[N]&&(i.disableVertexAttribArray(N),D[N]=0)}function E(C,D,N,A,U,F,B){B===!0?i.vertexAttribIPointer(C,D,N,U,F):i.vertexAttribPointer(C,D,N,A,U,F)}function x(C,D,N,A){y();let U=A.attributes,F=N.getAttributes(),B=D.defaultAttributeValues;for(let V in F){let z=F[V];if(z.location>=0){let W=U[V];if(W===void 0&&(V==="instanceMatrix"&&C.instanceMatrix&&(W=C.instanceMatrix),V==="instanceColor"&&C.instanceColor&&(W=C.instanceColor)),W!==void 0){let K=W.normalized,Q=W.itemSize,ae=e.get(W);if(ae===void 0)continue;let k=ae.buffer,re=ae.type,ce=ae.bytesPerElement,Ce=re===i.INT||re===i.UNSIGNED_INT||W.gpuType===ll;if(W.isInterleavedBufferAttribute){let he=W.data,Ne=he.isInterleavedBuffer===!0?he.stride:he.itemSize,et=W.offset;if(he.isInstancedInterleavedBuffer||he.isInstancedBufferAttribute){for(let Le=0;Le<z.locationSize;Le++)p(z.location+Le,he.meshPerAttribute);C.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let Le=0;Le<z.locationSize;Le++)g(z.location+Le);i.bindBuffer(i.ARRAY_BUFFER,k);for(let Le=0;Le<z.locationSize;Le++)E(z.location+Le,Q/z.locationSize,re,K,Ne*ce,(et+Q/z.locationSize*Le)*ce,Ce)}else{if(W.isInstancedBufferAttribute){for(let he=0;he<z.locationSize;he++)p(z.location+he,W.meshPerAttribute);C.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let he=0;he<z.locationSize;he++)g(z.location+he);i.bindBuffer(i.ARRAY_BUFFER,k);for(let he=0;he<z.locationSize;he++)E(z.location+he,Q/z.locationSize,re,K,Q*ce,Q/z.locationSize*he*ce,Ce)}}else if(B!==void 0){let K=B[V];if(K!==void 0)switch(K.length){case 2:i.vertexAttrib2fv(z.location,K);break;case 3:i.vertexAttrib3fv(z.location,K);break;case 4:i.vertexAttrib4fv(z.location,K);break;default:i.vertexAttrib1fv(z.location,K)}}}}M()}function b(){P();for(let C in n){let D=n[C];for(let N in D){let A=D[N];for(let U in A){let F=A[U];for(let B in F)h(F[B].object),delete F[B];delete A[U]}}delete n[C]}}function S(C){if(n[C.id]===void 0)return;let D=n[C.id];for(let N in D){let A=D[N];for(let U in A){let F=A[U];for(let B in F)h(F[B].object),delete F[B];delete A[U]}}delete n[C.id]}function _(C){for(let D in n){let N=n[D];for(let A in N){let U=N[A];if(U[C.id]===void 0)continue;let F=U[C.id];for(let B in F)h(F[B].object),delete F[B];delete U[C.id]}}}function v(C){for(let D in n){let N=n[D],A=C.isInstancedMesh===!0?C.id:0,U=N[A];if(U!==void 0){for(let F in U){let B=U[F];for(let V in B)h(B[V].object),delete B[V];delete U[F]}delete N[A],Object.keys(N).length===0&&delete n[D]}}}function P(){T(),o=!0,r!==s&&(r=s,c(r.object))}function T(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:T,dispose:b,releaseStatesOfGeometry:S,releaseStatesOfObject:v,releaseStatesOfProgram:_,initAttributes:y,enableAttribute:g,disableUnusedAttributes:M}}function U4(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function o(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function a(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function O4(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let _=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(_){return!(_!==Hn&&n.convert(_)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(_){let v=_===en&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(_!==fn&&_!==Cn&&!v&&n.convert(_)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(_){if(_==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(Ye("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=t.logarithmicDepthBuffer===!0&&u===!1;t.reversedDepthBuffer===!0&&u===!1&&Ye("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&u===!0&&Ye("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),S=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:m,maxTextureSize:y,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:M,maxVaryings:E,maxFragmentUniforms:x,maxSamples:b,samples:S}}function F4(i){let e=this,t=null,n=0,s=!1,r=!1,o=new yn,a=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,y=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{let M=r?0:n,E=M*4,x=p.clippingState||null;l.value=x,x=h(m,d,E,f);for(let b=0;b!==E;++b)x[b]=t[b];p.clippingState=x,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,m){let y=u!==null?u.length:0,g=null;if(y!==0){if(g=l.value,m!==!0||g===null){let p=f+y*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(g===null||g.length<p)&&(g=new Float32Array(p));for(let E=0,x=f;E!==y;++E,x+=4)o.copy(u[E]).applyMatrix4(M,a),o.normal.toArray(g,x),g[x+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,g}}var wo=class extends Vt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Br(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new _e(5,5,5),r=new Pt({name:"CubemapFromEquirect",uniforms:rs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Qt,blending:ui});r.uniforms.tEquirect.value=t;let o=new Z(s,r),a=t.minFilter;return t.minFilter===di&&(t.minFilter=un),new Ws(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},pd=256,B4=3,H4=20,Fd=256,Bd=16,z4=3,G4=new I,k4=new ue,Kl=class i{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Ws(1,10,null),this._boxMesh=new Z(new _e(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=G4}=r,l=this._renderer;this._setSize(o);let c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);let u=l.autoClear,d=l.autoClearColor,f=l.autoClearDepth,m=l.autoClearStencil,y=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,y===null&&(e.background=l.getClearColor(k4));let g=new Ws(n,s,h);return g.position.copy(a),g.update(l,e),l.autoClear=u,l.autoClearColor=d,l.autoClearDepth=f,l.autoClearStencil=m,e.background=y,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_d(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=gd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(pd,A1(e))}_fromTexture(e,t){e.mapping===is||e.mapping===Zs?this._setSize(e.image.length===0?pd:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=md(e,!1,!1),n=Math.log2(e)-B4;for(let s=0;s<=n;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=md(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let s=this._boxMesh,r=this._cubeCamera;s.material=n,r.renderTarget=e,r.activeMipmapLevel=t;let o=e.width>>t;e.viewport.set(0,0,o,o),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===is||e.mapping===Zs?(this._cubemapMaterial===null&&(this._cubemapMaterial=_d()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=gd()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=V4(),this._integrationMaterial=W4());let t=this._cubeSize,n=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Bd);for(let o=0;o<=n;o++){let a=i.lodToRoughness(o,n);if(o>n-z4)r.roughness.value=a,this._renderCube(e,o,this._integrationMaterial);else{let l=a>0?Math.log2(t)+.5*Math.log2(6/(Fd*Math.pow(a,4)))+.5:0;s.roughness.value=a,s.lodBias.value=l,this._renderCube(e,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=X4());let n=this._blurMaterial,s=n.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,n),s.envMap.value=e.texture,this._renderCube(r,0,n)}};function md(i,e,t){return new wo(i,{minFilter:di,generateMipmaps:e,type:en,colorSpace:wr,depthBuffer:t})}function Ro(i,e,t){return new Pt({name:i,uniforms:e,vertexShader:rt.cube_vert,fragmentShader:t,side:Qt,blending:ui,depthTest:!1,depthWrite:!1})}function V4(){return Ro("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Fd}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function W4(){return Ro("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Bd}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function X4(){return Ro("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${H4}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function gd(){return Ro("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function _d(){return Ro("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Y4(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,f=!1){return d==null?null:f?o(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===rl||f===ol)if(e.has(d)){let m=e.get(d).texture;return a(m,d.mapping)}else{let m=d.image;if(m&&m.height>0){let y=new wo(m.height);return y.fromEquirectangularTexture(i,d),e.set(d,y),d.addEventListener("dispose",c),a(y.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){let f=d.mapping,m=f===rl||f===ol,y=f===is||f===Zs;if(m||y){let g=t.get(d),p=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new Kl(i)),g=m?n.fromEquirectangular(d,g):n.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{let M=d.image;return m&&M&&M.height>0||y&&M&&l(M)?(n===null&&(n=new Kl(i)),g=m?n.fromEquirectangular(d):n.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function a(d,f){return f===rl?d.mapping=is:f===ol&&(d.mapping=Zs),d}function l(d){let f=0,m=6;for(let y=0;y<m;y++)d[y]!==void 0&&f++;return f===m}function c(d){let f=d.target;f.removeEventListener("dispose",c);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function q4(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Mr("WebGLRenderer: "+n+" extension not supported."),s}}}function Z4(i,e,t,n){let s={},r=new WeakMap,o=new FinalizationRegistry(m=>delete s[m]);function a(m){l(m.target)}function l(m){m.index!==null&&e.remove(m.index);for(let g in m.attributes)e.remove(m.attributes[g]);m.removeEventListener("dispose",a),delete s[m.id],o.unregister(m);let y=r.get(m);y&&(e.remove(y),r.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function c(m,y){return s[y.id]!==void 0||(y.addEventListener("dispose",a),s[y.id]=new WeakRef(y),o.register(y,y.id,y),t.memory.geometries++),y}function h(m){let y=m.attributes;for(let g in y)e.update(y[g],i.ARRAY_BUFFER)}function u(m){let y=m.index,g=m.attributes.position,p=0;if(g===void 0)return;let M=y!==null?y.array.length:g.array.length/3-1,E=g.count>=65535?Nr:Dr,x=new E(Math.ceil(M/3)*6,1),b=x.array;if(y!==null){let _=y.array;p=y.version;for(let v=0,P=0;v<M;v+=3){let T=_[v+0],C=_[v+1],D=_[v+2];b[P++]=T,b[P++]=C,b[P++]=C,b[P++]=D,b[P++]=D,b[P++]=T}}else{p=g.version;for(let _=0,v=0;_<M;_+=3){let P=_+0,T=_+1,C=_+2;b[v++]=P,b[v++]=T,b[v++]=T,b[v++]=C,b[v++]=C,b[v++]=P}}x.version=p;let S=r.get(m);S&&e.remove(S),r.set(m,x)}function d(m){let y=r.get(m);if(y){let g=m.index;g!==null&&y.version<g.version&&u(m)}else u(m);return r.get(m)}function f(){for(let m in s){let y=s[m].deref();y!==void 0&&l(y)}}return{get:c,update:h,getWireframeAttribute:d,dispose:f}}function K4(i,e,t){let n;function s(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,d){i.drawElements(n,d,r,u*o),t.update(d,n,1)}function c(u,d,f){f!==0&&(i.drawElementsInstanced(n,d,r,u*o,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let y=0;for(let g=0;g<f;g++)y+=d[g];t.update(y,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function J4(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:qe("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function $4(i,e,t){let n=new WeakMap,s=new It;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let P=function(){_.dispose(),n.delete(a),a.removeEventListener("dispose",P)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],E=0;f===!0&&(E=1),m===!0&&(E=2),y===!0&&(E=3);let x=a.attributes.position.count*E,b=1;x>e.maxTextureSize&&(b=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let S=new Float32Array(x*b*4*u),_=new Pr(S,x,b,u);_.type=Cn,_.needsUpdate=!0;let v=E*4;for(let T=0;T<u;T++){let C=g[T],D=p[T],N=M[T],A=x*b*4*T;for(let U=0;U<C.count;U++){let F=U*v;f===!0&&(s.fromBufferAttribute(C,U),S[A+F+0]=s.x,S[A+F+1]=s.y,S[A+F+2]=s.z,S[A+F+3]=0),m===!0&&(s.fromBufferAttribute(D,U),S[A+F+4]=s.x,S[A+F+5]=s.y,S[A+F+6]=s.z,S[A+F+7]=0),y===!0&&(s.fromBufferAttribute(N,U),S[A+F+8]=s.x,S[A+F+9]=s.y,S[A+F+10]=s.z,S[A+F+11]=N.itemSize===4?s.w:1)}}d={count:u,texture:_,size:new te(x,b)},n.set(a,d),a.addEventListener("dispose",P)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let y=0;y<c.length;y++)f+=c[y];let m=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function j4(i,e,t,n,s){let r=new WeakMap;function o(c){let h=s.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:o,dispose:a}}var Q4={[co]:"LINEAR_TONE_MAPPING",[ho]:"REINHARD_TONE_MAPPING",[uo]:"CINEON_TONE_MAPPING",[ns]:"ACES_FILMIC_TONE_MAPPING",[po]:"AGX_TONE_MAPPING",[mo]:"NEUTRAL_TONE_MAPPING",[fo]:"CUSTOM_TONE_MAPPING"};function eg(i,e,t,n,s,r){let o=new Vt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=null,h=new mt;h.setAttribute("position",new Qe([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new Qe([0,2,0,0,2,0],2));let u=new Vs({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Z(h,u),f=new es(-1,1,1,-1,0,1),m=null,y=null,g=!1,p,M=null,E=[],x=!1;this.setSize=function(b,S){o.setSize(b,S),a!==null&&a.setSize(b,S),l!==null&&l.setSize(b,S);for(let _=0;_<E.length;_++){let v=E[_];v.setSize&&v.setSize(b,S)}},this.setEffects=function(b){E=b,x=E.length>0&&E[0].isRenderPass===!0;let S=o.width,_=o.height;E.length>0&&a===null&&(a=new Vt(S,_,{type:en,depthBuffer:!1,stencilBuffer:!1}),l=new Vt(S,_,{type:en,depthBuffer:!1,stencilBuffer:!1}));let v=s===!0&&E.some(P=>P.needsDepthTexture===!0);v!==(o.depthTexture!==null)&&(v===!0&&c===null&&(c=new li(S,_),r===!0&&(c.format=fi,c.type=ss)),o.dispose(),o.depthTexture=v?c:null,o.resolveDepthBuffer=v,o.storeMultisampledDepthBuffer=v);for(let P=0;P<E.length;P++){let T=E[P];T.setSize&&T.setSize(S,_),v&&T.needsDepthTexture===!0&&T.setDepthTexture&&T.setDepthTexture(c)}},this.begin=function(b,S){if(g||b.toneMapping===qn&&E.length===0)return!1;if(M=S,S!==null){let _=S.width,v=S.height;(o.width!==_||o.height!==v)&&this.setSize(_,v)}return x===!1&&b.setRenderTarget(o),p=b.toneMapping,b.toneMapping=qn,!0},this.hasRenderPass=function(){return x},this.end=function(b,S){b.toneMapping=p,g=!0;let _=o,v=a;for(let P=0;P<E.length;P++){let T=E[P];T.enabled!==!1&&(T.render(b,v,_,S),T.needsSwap!==!1&&(_=v,v=v===a?l:a))}if(m!==b.outputColorSpace||y!==b.toneMapping){m=b.outputColorSpace,y=b.toneMapping,u.defines={},lt.getTransfer(m)===xt&&(u.defines.SRGB_TRANSFER="");let P=Q4[y];P&&(u.defines[P]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=_.texture,b.setRenderTarget(M),b.render(d,f),M=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),h.dispose(),u.dispose()}}var Hd=new dn,zd=new li(1,1),Gd=new zr(1),kd=new Pr,Vd=new La,Wd=new Br,xd=[],yd=[],Md=new Float32Array(16),vd=new Float32Array(9),Ed=new Float32Array(4);function $s(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=xd[s];if(r===void 0&&(r=new Float32Array(s),xd[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Wt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Xt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function $l(i,e){let t=yd[e];t===void 0&&(t=new Int32Array(e),yd[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function tg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function ng(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2fv(this.addr,e),Xt(t,e)}}function ig(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Wt(t,e))return;i.uniform3fv(this.addr,e),Xt(t,e)}}function sg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4fv(this.addr,e),Xt(t,e)}}function rg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;Ed.set(n),i.uniformMatrix2fv(this.addr,!1,Ed),Xt(t,n)}}function og(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;vd.set(n),i.uniformMatrix3fv(this.addr,!1,vd),Xt(t,n)}}function ag(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;Md.set(n),i.uniformMatrix4fv(this.addr,!1,Md),Xt(t,n)}}function lg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function cg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2iv(this.addr,e),Xt(t,e)}}function hg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Wt(t,e))return;i.uniform3iv(this.addr,e),Xt(t,e)}}function ug(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4iv(this.addr,e),Xt(t,e)}}function dg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function fg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2uiv(this.addr,e),Xt(t,e)}}function pg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Wt(t,e))return;i.uniform3uiv(this.addr,e),Xt(t,e)}}function mg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4uiv(this.addr,e),Xt(t,e)}}function jl(i){return i.version===0&&(i.compareFunction=S1,i.needsUpdate=!0),i}function gg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?r=jl(zd):r=Hd,t.setTexture2D(e||r,s)}function _g(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Vd,s)}function xg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_CUBE_SHADOW?r=jl(Gd):r=Wd,t.setTextureCube(e||r,s)}function yg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||kd,s)}function Mg(i){switch(i){case 5126:return tg;case 35664:return ng;case 35665:return ig;case 35666:return sg;case 35674:return rg;case 35675:return og;case 35676:return ag;case 5124:case 35670:return lg;case 35667:case 35671:return cg;case 35668:case 35672:return hg;case 35669:case 35673:return ug;case 5125:return dg;case 36294:return fg;case 36295:return pg;case 36296:return mg;case 35678:case 36198:case 36298:case 36306:case 35682:return gg;case 35679:case 36299:case 36307:return _g;case 35680:case 36300:case 36308:case 36293:return xg;case 36289:case 36303:case 36311:case 36292:return yg}}function vg(i,e){i.uniform1fv(this.addr,e)}function Eg(i,e){let t=$s(e,this.size,2);i.uniform2fv(this.addr,t)}function bg(i,e){let t=$s(e,this.size,3);i.uniform3fv(this.addr,t)}function Sg(i,e){let t=$s(e,this.size,4);i.uniform4fv(this.addr,t)}function Tg(i,e){let t=$s(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function wg(i,e){let t=$s(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Rg(i,e){let t=$s(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Ag(i,e){i.uniform1iv(this.addr,e)}function Cg(i,e){i.uniform2iv(this.addr,e)}function Pg(i,e){i.uniform3iv(this.addr,e)}function Ig(i,e){i.uniform4iv(this.addr,e)}function Lg(i,e){i.uniform1uiv(this.addr,e)}function Dg(i,e){i.uniform2uiv(this.addr,e)}function Ng(i,e){i.uniform3uiv(this.addr,e)}function Ug(i,e){i.uniform4uiv(this.addr,e)}function Og(i,e,t){let n=this.cache,s=e.length,r=$l(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=jl(zd):o=Hd;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function Fg(i,e,t){let n=this.cache,s=e.length,r=$l(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Vd,r[o])}function Bg(i,e,t){let n=this.cache,s=e.length,r=$l(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));let o;this.type===i.SAMPLER_CUBE_SHADOW?o=jl(Gd):o=Wd;for(let a=0;a!==s;++a)t.setTextureCube(e[a]||o,r[a])}function Hg(i,e,t){let n=this.cache,s=e.length,r=$l(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||kd,r[o])}function zg(i){switch(i){case 5126:return vg;case 35664:return Eg;case 35665:return bg;case 35666:return Sg;case 35674:return Tg;case 35675:return wg;case 35676:return Rg;case 5124:case 35670:return Ag;case 35667:case 35671:return Cg;case 35668:case 35672:return Pg;case 35669:case 35673:return Ig;case 5125:return Lg;case 36294:return Dg;case 36295:return Ng;case 36296:return Ug;case 35678:case 36198:case 36298:case 36306:case 35682:return Og;case 35679:case 36299:case 36307:return Fg;case 35680:case 36300:case 36308:case 36293:return Bg;case 36289:case 36303:case 36311:case 36292:return Hg}}var V1=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Mg(t.type)}},W1=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=zg(t.type)}},X1=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},G1=/(\w+)(\])?(\[|\.)?/g;function bd(i,e){i.seq.push(e),i.map[e.id]=e}function Gg(i,e,t){let n=i.name,s=n.length;for(G1.lastIndex=0;;){let r=G1.exec(n),o=G1.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){bd(t,c===void 0?new V1(a,i,e):new W1(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new X1(a),bd(t,u)),t=u}}}var Js=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);Gg(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function Sd(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var kg=37297,Vg=0;function Wg(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Td=new $e;function Xg(i){lt._getMatrix(Td,lt.workingColorSpace,i);let e=`mat3( ${Td.elements.map(t=>t.toFixed(4))} )`;switch(lt.getTransfer(i)){case Rr:return[e,"LinearTransferOETF"];case xt:return[e,"sRGBTransferOETF"];default:return Ye("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function wd(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Wg(i.getShaderSource(e),a)}else return r}function Yg(i,e){let t=Xg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var qg={[co]:"Linear",[ho]:"Reinhard",[uo]:"Cineon",[ns]:"ACESFilmic",[po]:"AgX",[mo]:"Neutral",[fo]:"Custom"};function Zg(i,e){let t=qg[e];return t===void 0?(Ye("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Zl=new I;function Kg(){lt.getLuminanceCoefficients(Zl);let i=Zl.x.toFixed(4),e=Zl.y.toFixed(4),t=Zl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Jg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(To).join(`
`)}function $g(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function jg(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function To(i){return i!==""}function Rd(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function Ad(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Qg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Y1(i){return i.replace(Qg,e8)}function e8(i,e){let t=rt[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Y1(t)}var t8=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Cd(i){return i.replace(t8,n8)}function n8(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Pd(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var i8={[lo]:"SHADOWMAP_TYPE_PCF",[Ys]:"SHADOWMAP_TYPE_VSM"};function s8(i){return i8[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var r8={[Zs]:"ENVMAP_MODE_REFRACTION"};function o8(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":r8[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var a8={[sl]:"ENVMAP_BLENDING_MULTIPLY",[Xu]:"ENVMAP_BLENDING_MIX",[Yu]:"ENVMAP_BLENDING_ADD"};function l8(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":a8[i.combine]||"ENVMAP_BLENDING_NONE"}function c8(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=s8(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=o8(t),u=l8(t),d=Jg(t),f=$g(r),m=s.createProgram(),y,g,p=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(To).join(`
`),y.length>0&&(y+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(To).join(`
`),g.length>0&&(g+=`
`)):(y=[Pd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(To).join(`
`),g=[Pd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==qn?"#define TONE_MAPPING":"",t.toneMapping!==qn?rt.tonemapping_pars_fragment:"",t.toneMapping!==qn?Zg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",rt.colorspace_pars_fragment,Yg("linearToOutputTexel",t.outputColorSpace),Kg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(To).join(`
`)),o=Y1(o),o=Rd(o,t),o=Ad(o,t),a=Y1(a),a=Rd(a,t),a=Ad(a,t),o=Cd(o),a=Cd(a),t.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,y=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,g=["#define varying in",t.glslVersion===w1?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===w1?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let M=p+y+o,E=p+g+a,x=Sd(s,s.VERTEX_SHADER,M),b=Sd(s,s.FRAGMENT_SHADER,E);s.attachShader(m,x),s.attachShader(m,b),t.index0AttributeName!==void 0?s.bindAttribLocation(m,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function S(T){if(i.debug.checkShaderErrors){let C=s.getProgramInfoLog(m)||"",D=s.getShaderInfoLog(x)||"",N=s.getShaderInfoLog(b)||"",A=C.trim(),U=D.trim(),F=N.trim(),B=!0,V=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(B=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,x,b);else{let z=wd(s,x,"vertex"),W=wd(s,b,"fragment");qe("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+A+`
`+z+`
`+W)}else A!==""?Ye("WebGLProgram: Program Info Log:",A):(U===""||F==="")&&(V=!1);V&&(T.diagnostics={runnable:B,programLog:A,vertexShader:{log:U,prefix:y},fragmentShader:{log:F,prefix:g}})}s.deleteShader(x),s.deleteShader(b),_=new Js(s,m),v=jg(s,m)}let _;this.getUniforms=function(){return _===void 0&&S(this),_};let v;this.getAttributes=function(){return v===void 0&&S(this),v};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(m,kg)),P},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Vg++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=x,this.fragmentShader=b,this}var h8=0,q1=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Z1(e),t.set(e,n)),n}},Z1=class{constructor(e){this.id=h8++,this.code=e,this.usedTimes=0}};function u8(i){return i===Ni||i===vo||i===Eo}function d8(i,e,t,n,s,r){let o=new Us,a=new q1,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(_){return l.add(_),_===0?"uv":`uv${_}`}function m(_,v,P,T,C,D){let N=T.fog,A=C.geometry,U=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?T.environment:null,F=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,B=e.get(_.envMap||U,F),V=d[_.type],z=n.precision;_.precision!==null&&(z=n.getMaxPrecision(_.precision),z!==_.precision&&Ye("WebGLProgram.getParameters:",_.precision,"not supported, using",z,"instead."));let W=A.morphAttributes.position||A.morphAttributes.normal||A.morphAttributes.color,K=W!==void 0?W.length:0,Q=0;A.morphAttributes.position!==void 0&&(Q=1),A.morphAttributes.normal!==void 0&&(Q=2),A.morphAttributes.color!==void 0&&(Q=3);let ae,k,re,ce;if(V){let De=Kn[V];ae=De.vertexShader,k=De.fragmentShader}else{ae=_.vertexShader,k=_.fragmentShader;let De=a.getVertexShaderStage(_),St=a.getFragmentShaderStage(_);a.update(_,De,St),re=De.id,ce=St.id}let Ce=i.getRenderTarget(),he=i.state.buffers.depth.getReversed(),Ne=C.isInstancedMesh===!0,et=C.isBatchedMesh===!0,Le=!!_.map,oe=!!_.matcap,ye=!!B,$=ye&&B.isPMREMTexture===!0,le=!!_.aoMap,de=!!_.lightMap,Ie=!!_.bumpMap&&_.wireframe===!1,Me=!!_.normalMap,Ke=!!_.displacementMap,ze=!!_.emissiveMap,ht=!!_.metalnessMap,ut=!!_.roughnessMap,_t=_.anisotropy>0,G=_.clearcoat>0,Ot=_.diffuseRoughness>0,at=_.dispersion>0,wt=_.retroreflectivity>0,we=_.iridescence>0,Nt=_.sheen>0,Xe=_.transmission>0,Je=_t&&!!_.anisotropyMap,L=G&&!!_.clearcoatMap,w=G&&!!_.clearcoatNormalMap,Y=G&&!!_.clearcoatRoughnessMap,fe=Ot&&!!_.diffuseRoughnessMap,se=we&&!!_.iridescenceMap,ve=we&&!!_.iridescenceThicknessMap,Re=Nt&&!!_.sheenColorMap,ee=Nt&&!!_.sheenRoughnessMap,ne=!!_.specularMap,be=!!_.specularColorMap,O=!!_.specularIntensityMap,ie=Xe&&!!_.transmissionMap,j=Xe&&!!_.thicknessMap,Se=!!_.gradientMap,ge=!!_.alphaMap,Ee=_.alphaTest>0,Ve=!!_.alphaHash,it=!!_.extensions,pe=qn;_.toneMapped&&(Ce===null||Ce.isXRRenderTarget===!0)&&(pe=i.toneMapping);let We=$?B.isCompressedCubeTexture?B.image[0].mipmaps:B.mipmaps:null,tt={shaderID:V,shaderType:_.type,shaderName:_.name,vertexShader:ae,fragmentShader:k,defines:_.defines,customVertexShaderID:re,customFragmentShaderID:ce,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:z,batching:et,batchingColor:et&&C._colorsTexture!==null,instancing:Ne,instancingColor:Ne&&C.instanceColor!==null,instancingMorph:Ne&&C.morphTexture!==null,outputColorSpace:Ce===null?i.outputColorSpace:Ce.isXRRenderTarget===!0?Ce.texture.colorSpace:lt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Le,matcap:oe,envMap:ye,envMapMode:ye&&B.mapping,envMapPMREM:$,envMapMaxLod:$?We.length-1:null,envMapSize:$?We[0].width:null,aoMap:le,lightMap:de,bumpMap:Ie,normalMap:Me,displacementMap:Ke,emissiveMap:ze,normalMapObjectSpace:Me&&_.normalMapType===Ku,normalMapTangentSpace:Me&&_.normalMapType===bo,packedNormalMap:Me&&_.normalMapType===bo&&u8(_.normalMap.format),metalnessMap:ht,roughnessMap:ut,anisotropy:_t,anisotropyMap:Je,clearcoat:G,clearcoatMap:L,clearcoatNormalMap:w,clearcoatRoughnessMap:Y,diffuseRoughness:Ot,diffuseRoughnessMap:fe,dispersion:at,retroreflection:wt,iridescence:we,iridescenceMap:se,iridescenceThicknessMap:ve,sheen:Nt,sheenColorMap:Re,sheenRoughnessMap:ee,specularMap:ne,specularColorMap:be,specularIntensityMap:O,transmission:Xe,transmissionMap:ie,thicknessMap:j,gradientMap:Se,opaque:_.transparent===!1&&_.blending===qs&&_.alphaToCoverage===!1,alphaMap:ge,alphaTest:Ee,alphaHash:Ve,combine:_.combine,mapUv:Le&&f(_.map.channel),aoMapUv:le&&f(_.aoMap.channel),lightMapUv:de&&f(_.lightMap.channel),bumpMapUv:Ie&&f(_.bumpMap.channel),normalMapUv:Me&&f(_.normalMap.channel),displacementMapUv:Ke&&f(_.displacementMap.channel),emissiveMapUv:ze&&f(_.emissiveMap.channel),metalnessMapUv:ht&&f(_.metalnessMap.channel),roughnessMapUv:ut&&f(_.roughnessMap.channel),anisotropyMapUv:Je&&f(_.anisotropyMap.channel),clearcoatMapUv:L&&f(_.clearcoatMap.channel),clearcoatNormalMapUv:w&&f(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Y&&f(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:fe&&f(_.diffuseRoughnessMap.channel),iridescenceMapUv:se&&f(_.iridescenceMap.channel),iridescenceThicknessMapUv:ve&&f(_.iridescenceThicknessMap.channel),sheenColorMapUv:Re&&f(_.sheenColorMap.channel),sheenRoughnessMapUv:ee&&f(_.sheenRoughnessMap.channel),specularMapUv:ne&&f(_.specularMap.channel),specularColorMapUv:be&&f(_.specularColorMap.channel),specularIntensityMapUv:O&&f(_.specularIntensityMap.channel),transmissionMapUv:ie&&f(_.transmissionMap.channel),thicknessMapUv:j&&f(_.thicknessMap.channel),alphaMapUv:ge&&f(_.alphaMap.channel),vertexTangents:!!A.attributes.tangent&&(Me||_t),vertexNormals:!!A.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!A.attributes.color&&A.attributes.color.itemSize===4,pointsUvs:C.isPoints===!0&&!!A.attributes.uv&&(Le||ge),fog:!!N,useFog:_.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||A.attributes.normal===void 0&&Me===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:he,skinning:C.isSkinnedMesh===!0,hasPositionAttribute:A.attributes.position!==void 0,morphTargets:A.morphAttributes.position!==void 0,morphNormals:A.morphAttributes.normal!==void 0,morphColors:A.morphAttributes.color!==void 0,morphTargetsCount:K,morphTextureStride:Q,numSunLights:v.sun.length,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numSunLightShadows:v.sunShadowMap.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numLightProbeGrids:D.filter(De=>De.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:pe,decodeVideoTexture:Le&&_.map.isVideoTexture===!0&&lt.getTransfer(_.map.colorSpace)===xt,decodeVideoTextureEmissive:ze&&_.emissiveMap.isVideoTexture===!0&&lt.getTransfer(_.emissiveMap.colorSpace)===xt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ht,flipSided:_.side===Qt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:it&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(it&&_.extensions.multiDraw===!0||et)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return tt.vertexUv1s=l.has(1),tt.vertexUv2s=l.has(2),tt.vertexUv3s=l.has(3),l.clear(),tt}function y(_){let v=[];if(_.shaderID?v.push(_.shaderID):(v.push(_.customVertexShaderID),v.push(_.customFragmentShaderID)),_.defines!==void 0)for(let P in _.defines)v.push(P),v.push(_.defines[P]);return _.isRawShaderMaterial===!1&&(g(v,_),p(v,_),v.push(i.outputColorSpace)),v.push(_.customProgramCacheKey),v.join()}function g(_,v){_.push(v.precision),_.push(v.outputColorSpace),_.push(v.envMapMode),_.push(v.envMapPMREM),_.push(v.envMapMaxLod),_.push(v.envMapSize),_.push(v.mapUv),_.push(v.alphaMapUv),_.push(v.lightMapUv),_.push(v.aoMapUv),_.push(v.bumpMapUv),_.push(v.normalMapUv),_.push(v.displacementMapUv),_.push(v.emissiveMapUv),_.push(v.metalnessMapUv),_.push(v.roughnessMapUv),_.push(v.anisotropyMapUv),_.push(v.clearcoatMapUv),_.push(v.clearcoatNormalMapUv),_.push(v.clearcoatRoughnessMapUv),_.push(v.diffuseRoughnessMapUv),_.push(v.iridescenceMapUv),_.push(v.iridescenceThicknessMapUv),_.push(v.sheenColorMapUv),_.push(v.sheenRoughnessMapUv),_.push(v.specularMapUv),_.push(v.specularColorMapUv),_.push(v.specularIntensityMapUv),_.push(v.transmissionMapUv),_.push(v.thicknessMapUv),_.push(v.combine),_.push(v.fogExp2),_.push(v.sizeAttenuation),_.push(v.morphTargetsCount),_.push(v.numSunLights),_.push(v.numDirLights),_.push(v.numPointLights),_.push(v.numSpotLights),_.push(v.numSpotLightMaps),_.push(v.numHemiLights),_.push(v.numRectAreaLights),_.push(v.numSunLightShadows),_.push(v.numDirLightShadows),_.push(v.numPointLightShadows),_.push(v.numSpotLightShadows),_.push(v.numSpotLightShadowsWithMaps),_.push(v.numLightProbes),_.push(v.numLightProbeGrids),_.push(v.shadowMapType),_.push(v.toneMapping),_.push(v.numClippingPlanes),_.push(v.numClipIntersection),_.push(v.depthPacking)}function p(_,v){o.disableAll(),v.instancing&&o.enable(0),v.instancingColor&&o.enable(1),v.instancingMorph&&o.enable(2),v.matcap&&o.enable(3),v.envMap&&o.enable(4),v.normalMapObjectSpace&&o.enable(5),v.normalMapTangentSpace&&o.enable(6),v.clearcoat&&o.enable(7),v.iridescence&&o.enable(8),v.alphaTest&&o.enable(9),v.vertexColors&&o.enable(10),v.vertexAlphas&&o.enable(11),v.vertexUv1s&&o.enable(12),v.vertexUv2s&&o.enable(13),v.vertexUv3s&&o.enable(14),v.vertexTangents&&o.enable(15),v.anisotropy&&o.enable(16),v.alphaHash&&o.enable(17),v.batching&&o.enable(18),v.dispersion&&o.enable(19),v.retroreflection&&o.enable(24),v.diffuseRoughness&&o.enable(25),v.batchingColor&&o.enable(20),v.gradientMap&&o.enable(21),v.packedNormalMap&&o.enable(22),v.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reversedDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),v.numLightProbeGrids>0&&o.enable(22),v.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function M(_){let v=d[_.type],P;if(v){let T=Kn[v];P=Pn.clone(T.uniforms)}else P=_.uniforms;return P}function E(_,v){let P=h.get(v);return P!==void 0?++P.usedTimes:(P=new c8(i,v,_,s),c.push(P),h.set(v,P)),P}function x(_){if(--_.usedTimes===0){let v=c.indexOf(_);c[v]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function b(_){a.remove(_)}function S(){a.dispose()}return{getParameters:m,getProgramCacheKey:y,getUniforms:M,acquireProgram:E,releaseProgram:x,releaseShaderCache:b,programs:c,dispose:S}}function f8(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function p8(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Id(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Ld(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function a(d,f,m,y,g,p){let M=i[e];return M===void 0?(M={id:d.id,object:d,geometry:f,material:m,materialVariant:o(d),groupOrder:y,renderOrder:d.renderOrder,z:g,group:p},i[e]=M):(M.id=d.id,M.object=d,M.geometry=f,M.material=m,M.materialVariant=o(d),M.groupOrder=y,M.renderOrder=d.renderOrder,M.z=g,M.group=p),e++,M}function l(d,f,m,y,g,p,M){M.reversedDepth===!0&&(g=-g);let E=a(d,f,m,y,g,p);m.transmission>0?n.push(E):m.transparent===!0?s.push(E):t.push(E)}function c(d,f,m,y,g,p){let M=a(d,f,m,y,g,p);m.transmission>0?n.unshift(M):m.transparent===!0?s.unshift(M):t.unshift(M)}function h(d,f){t.length>1&&t.sort(d||p8),n.length>1&&n.sort(f||Id),s.length>1&&s.sort(f||Id)}function u(){for(let d=e,f=i.length;d<f;d++){let m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function m8(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Ld,i.set(n,[o])):s>=r.length?(o=new Ld,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function g8(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new I,color:new ue};break;case"SpotLight":t={position:new I,direction:new I,color:new ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new ue,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new ue,groundColor:new ue};break;case"RectAreaLight":t={color:new ue,position:new I,halfWidth:new I,halfHeight:new I};break}return i[e.id]=t,t}}}function _8(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var x8=0;function y8(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function M8(i){let e=new g8,t=_8(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);let s=new I,r=new Ze,o=new Ze;function a(c){let h=0,u=0,d=0;for(let D=0;D<9;D++)n.probe[D].set(0,0,0);let f=0,m=0,y=0,g=0,p=0,M=0,E=0,x=0,b=0,S=0,_=0,v=0,P=0,T=0;c.sort(y8);for(let D=0,N=c.length;D<N;D++){let A=c[D],U=A.color,F=A.intensity,B=A.distance,V=null;if(A.shadow&&A.shadow.map&&(A.shadow.map.texture.format===Ni?V=A.shadow.map.texture:V=A.shadow.map.depthTexture||A.shadow.map.texture),A.isAmbientLight)h+=U.r*F,u+=U.g*F,d+=U.b*F;else if(A.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(A.sh.coefficients[z],F);T++}else if(A.isSunLight){let z=e.get(A);if(z.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){let W=A.shadow,K=t.get(A);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize.copy(W.mapSize).multiply(W.getFrameExtents()),n.sunShadow[m]=K,n.sunShadowMap[m]=V;let Q=W.getViewportCount();for(let ae=0;ae<Q;ae++)n.sunShadowMatrix[y+ae]=W.getMatrix(ae),n.sunShadowCascade[y+ae]=W._cascadeData[ae];y+=Q,m++}n.sun[f]=z,f++}else if(A.isDirectionalLight){let z=e.get(A);if(z.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){let W=A.shadow,K=t.get(A);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,n.directionalShadow[g]=K,n.directionalShadowMap[g]=V,n.directionalShadowMatrix[g]=A.shadow.matrix,b++}n.directional[g]=z,g++}else if(A.isSpotLight){let z=e.get(A);z.position.setFromMatrixPosition(A.matrixWorld),z.color.copy(U).multiplyScalar(F),z.distance=B,z.coneCos=Math.cos(A.angle),z.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),z.decay=A.decay,n.spot[M]=z;let W=A.shadow;if(A.map&&(n.spotLightMap[v]=A.map,v++,W.updateMatrices(A),A.castShadow&&P++),n.spotLightMatrix[M]=W.matrix,A.castShadow){let K=t.get(A);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,n.spotShadow[M]=K,n.spotShadowMap[M]=V,_++}M++}else if(A.isRectAreaLight){let z=e.get(A);z.color.copy(U).multiplyScalar(F),z.halfWidth.set(A.width*.5,0,0),z.halfHeight.set(0,A.height*.5,0),n.rectArea[E]=z,E++}else if(A.isPointLight){let z=e.get(A);if(z.color.copy(A.color).multiplyScalar(A.intensity),z.distance=A.distance,z.decay=A.decay,A.castShadow){let W=A.shadow,K=t.get(A);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,K.shadowCameraNear=W.camera.near,K.shadowCameraFar=W.camera.far,n.pointShadow[p]=K,n.pointShadowMap[p]=V,n.pointShadowMatrix[p]=A.shadow.matrix,S++}n.point[p]=z,p++}else if(A.isHemisphereLight){let z=e.get(A);z.skyColor.copy(A.color).multiplyScalar(F),z.groundColor.copy(A.groundColor).multiplyScalar(F),n.hemi[x]=z,x++}}E>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Pe.LTC_FLOAT_1,n.rectAreaLTC2=Pe.LTC_FLOAT_2):(n.rectAreaLTC1=Pe.LTC_HALF_1,n.rectAreaLTC2=Pe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let C=n.hash;(C.sunLength!==f||C.directionalLength!==g||C.pointLength!==p||C.spotLength!==M||C.rectAreaLength!==E||C.hemiLength!==x||C.numSunShadows!==m||C.numDirectionalShadows!==b||C.numPointShadows!==S||C.numSpotShadows!==_||C.numSpotMaps!==v||C.numLightProbes!==T)&&(n.sun.length=f,n.directional.length=g,n.spot.length=M,n.rectArea.length=E,n.point.length=p,n.hemi.length=x,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=y,n.sunShadowCascade.length=y,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=S,n.pointShadowMap.length=S,n.pointShadowMatrix.length=S,n.spotShadow.length=_,n.spotShadowMap.length=_,n.spotLightMatrix.length=_+v-P,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=P,n.numLightProbes=T,C.sunLength=f,C.directionalLength=g,C.pointLength=p,C.spotLength=M,C.rectAreaLength=E,C.hemiLength=x,C.numSunShadows=m,C.numDirectionalShadows=b,C.numPointShadows=S,C.numSpotShadows=_,C.numSpotMaps=v,C.numLightProbes=T,n.version=x8++)}function l(c,h){let u=0,d=0,f=0,m=0,y=0,g=0,p=h.matrixWorldInverse;for(let M=0,E=c.length;M<E;M++){let x=c[M];if(x.isSunLight){let b=n.sun[u];b.direction.setFromMatrixPosition(x.matrixWorld),b.direction.transformDirection(p),u++}else if(x.isDirectionalLight){let b=n.directional[d];b.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(p),d++}else if(x.isSpotLight){let b=n.spot[m];b.position.setFromMatrixPosition(x.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(p),m++}else if(x.isRectAreaLight){let b=n.rectArea[y];b.position.setFromMatrixPosition(x.matrixWorld),b.position.applyMatrix4(p),o.identity(),r.copy(x.matrixWorld),r.premultiply(p),o.extractRotation(r),b.halfWidth.set(x.width*.5,0,0),b.halfHeight.set(0,x.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),y++}else if(x.isPointLight){let b=n.point[f];b.position.setFromMatrixPosition(x.matrixWorld),b.position.applyMatrix4(p),f++}else if(x.isHemisphereLight){let b=n.hemi[g];b.direction.setFromMatrixPosition(x.matrixWorld),b.direction.transformDirection(p),g++}}}return{setup:a,setupView:l,state:n}}function Dd(i){let e=new M8(i),t=[],n=[],s=[];function r(u){h.camera=u,t.length=0,n.length=0,s.length=0}function o(u){u.isLightProbeGrid?s.push(u):t.push(u)}function a(u){n.push(u)}function l(){e.setup(t),s.sort((u,d)=>u.priority-d.priority||u.id-d.id)}function c(u){e.setupView(t,u)}let h={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function v8(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Dd(i),e.set(s,[a])):r>=o.length?(a=new Dd(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var E8=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,b8=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,S8=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],T8=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],Nd=new Ze,So=new I,k1=new I;function w8(i,e,t){let n=new wi,s=new te,r=new te,o=new It,a=new ka,l=new Va,c={},h=t.maxTextureSize,u={[Di]:Qt,[Qt]:Di,[Ht]:Ht},d=new Pt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new te},radius:{value:4}},vertexShader:E8,fragmentShader:b8}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new mt;m.setAttribute("position",new Ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new Z(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=lo;let p=this.type;this.render=function(S,_,v){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;this.type===il&&(Ye("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=lo);let P=i.getRenderTarget(),T=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),D=i.state;D.setBlending(ui),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let N=p!==this.type;N&&_.traverse(function(A){A.material&&(Array.isArray(A.material)?A.material.forEach(U=>U.needsUpdate=!0):A.material.needsUpdate=!0)});for(let A=0,U=S.length;A<U;A++){let F=S[A],B=F.shadow;if(B===void 0){Ye("WebGLShadowMap:",F,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);let V=B.getFrameExtents();s.multiply(V),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/V.x),s.x=r.x*V.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/V.y),s.y=r.y*V.y,B.mapSize.y=r.y));let z=i.state.buffers.depth.getReversed();if(B.camera._reversedDepth=z,B.map===null||N===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Ys){if(F.isPointLight){Ye("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new Vt(s.x,s.y,{format:Ni,type:en,minFilter:un,magFilter:un,generateMipmaps:!1}),B.map.texture.name=F.name+".shadowMap",B.map.depthTexture=new li(s.x,s.y,Cn),B.map.depthTexture.name=F.name+".shadowMapDepth",B.map.depthTexture.format=ri,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Jt,B.map.depthTexture.magFilter=Jt}else F.isPointLight?(B.map=new wo(s.x),B.map.depthTexture=new zr(s.x,Bn)):(B.map=new Vt(s.x,s.y),B.map.depthTexture=new li(s.x,s.y,Bn)),B.map.depthTexture.name=F.name+".shadowMap",B.map.depthTexture.format=ri,this.type===lo?(B.map.depthTexture.compareFunction=z?b1:E1,B.map.depthTexture.minFilter=un,B.map.depthTexture.magFilter=un):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Jt,B.map.depthTexture.magFilter=Jt);B.camera.updateProjectionMatrix()}B.map.isWebGLCubeRenderTarget!==!0&&(B.map.width!==s.x||B.map.height!==s.y)&&B.map.setSize(s.x,s.y);let W=B.map.isWebGLCubeRenderTarget?6:B.getViewportCount();F.isPointLight!==!0&&B.updateMatrices(F,v);let K=(B.camera.layers.mask&4294967294)!==0?B.camera.layers:v.layers;for(let Q=0;Q<W;Q++){let ae=B.getCamera(Q);if(F.isPointLight){let k=B.camera,re=B.matrix,ce=F.distance||k.far;ce!==k.far&&(k.far=ce,k.updateProjectionMatrix()),So.setFromMatrixPosition(F.matrixWorld),k.position.copy(So),k1.copy(k.position),k1.add(S8[Q]),k.up.copy(T8[Q]),k.lookAt(k1),k.updateMatrixWorld(),re.makeTranslation(-So.x,-So.y,-So.z),Nd.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),B._frustum.setFromProjectionMatrix(Nd,k.coordinateSystem,k.reversedDepth)}if(B.map.isWebGLCubeRenderTarget)i.setRenderTarget(B.map,Q),i.clear();else{Q===0&&(i.setRenderTarget(B.map),i.clear());let k=B.getViewport(Q);o.set(r.x*k.x,r.y*k.y,r.x*k.z,r.y*k.w),D.viewport(o)}n=B.getFrustum(Q),x(_,v,ae,F,K,this.type)}B.isPointLightShadow!==!0&&this.type===Ys&&M(B,v),B.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(P,T,C)};function M(S,_){let v=e.update(y);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null?S.mapPass=new Vt(s.x,s.y,{format:Ni,type:en}):(S.mapPass.width!==S.map.width||S.mapPass.height!==S.map.height)&&S.mapPass.setSize(S.map.width,S.map.height),d.uniforms.shadow_pass.value=S.map.depthTexture,d.uniforms.resolution.value.set(S.map.width,S.map.height),d.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(_,null,v,d,y,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value.set(S.map.width,S.map.height),f.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(_,null,v,f,y,null)}function E(S,_,v,P){let T=null,C=v.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(C!==void 0)T=C;else if(T=v.isPointLight===!0?l:a,i.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){let D=T.uuid,N=_.uuid,A=c[D];A===void 0&&(A={},c[D]=A);let U=A[N];U===void 0&&(U=T.clone(),A[N]=U,_.addEventListener("dispose",b)),T=U}if(T.visible=_.visible,T.wireframe=_.wireframe,P===Ys?T.side=_.shadowSide!==null?_.shadowSide:_.side:T.side=_.shadowSide!==null?_.shadowSide:u[_.side],T.alphaMap=_.alphaMap,T.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,T.map=_.map,T.clipShadows=_.clipShadows,T.clippingPlanes=_.clippingPlanes,T.clipIntersection=_.clipIntersection,T.displacementMap=_.displacementMap,T.displacementScale=_.displacementScale,T.displacementBias=_.displacementBias,T.wireframeLinewidth=_.wireframeLinewidth,T.linewidth=_.linewidth,v.isPointLight===!0&&T.isMeshDistanceMaterial===!0){let D=i.properties.get(T);D.light=v}return T}function x(S,_,v,P,T,C){if(S.visible===!1)return;if(S.layers.test(T)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&C===Ys)&&(!S.frustumCulled||S.intersectsFrustum(n))){S.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,S.matrixWorld);let A=e.update(S),U=S.material;if(Array.isArray(U)){let F=A.groups;for(let B=0,V=F.length;B<V;B++){let z=F[B],W=U[z.materialIndex];if(W&&W.visible){let K=E(S,W,P,C);S.onBeforeShadow(i,S,_,v,A,K,z),i.renderBufferDirect(v,null,A,K,S,z),S.onAfterShadow(i,S,_,v,A,K,z)}}}else if(U.visible){let F=E(S,U,P,C);S.onBeforeShadow(i,S,_,v,A,F,null),i.renderBufferDirect(v,null,A,F,S,null),S.onAfterShadow(i,S,_,v,A,F,null)}}let N=S.children;for(let A=0,U=N.length;A<U;A++)x(N[A],_,v,P,T,C)}function b(S){S.target.removeEventListener("dispose",b);for(let v in c){let P=c[v],T=S.target.uuid;T in P&&(P[T].dispose(),delete P[T])}}}function R8(i,e){function t(){let O=!1,ie=new It,j=null,Se=new It(0,0,0,0);return{setMask:function(ge){j!==ge&&!O&&(i.colorMask(ge,ge,ge,ge),j=ge)},setLocked:function(ge){O=ge},setClear:function(ge,Ee,Ve,it,pe){pe===!0&&(ge*=it,Ee*=it,Ve*=it),ie.set(ge,Ee,Ve,it),Se.equals(ie)===!1&&(i.clearColor(ge,Ee,Ve,it),Se.copy(ie))},reset:function(){O=!1,j=null,Se.set(-1,0,0,0)}}}function n(){let O=!1,ie=!1,j=null,Se=null,ge=null;return{setReversed:function(Ee){if(ie!==Ee){let Ve=e.get("EXT_clip_control");Ee?Ve.clipControlEXT(Ve.LOWER_LEFT_EXT,Ve.ZERO_TO_ONE_EXT):Ve.clipControlEXT(Ve.LOWER_LEFT_EXT,Ve.NEGATIVE_ONE_TO_ONE_EXT),ie=Ee;let it=ge;ge=null,this.setClear(it)}},getReversed:function(){return ie},setTest:function(Ee){Ee?he(i.DEPTH_TEST):Ne(i.DEPTH_TEST)},setMask:function(Ee){j!==Ee&&!O&&(i.depthMask(Ee),j=Ee)},setFunc:function(Ee){if(ie&&(Ee=rd[Ee]),Se!==Ee){switch(Ee){case Ma:i.depthFunc(i.NEVER);break;case va:i.depthFunc(i.ALWAYS);break;case Ea:i.depthFunc(i.LESS);break;case Ps:i.depthFunc(i.LEQUAL);break;case ba:i.depthFunc(i.EQUAL);break;case Sa:i.depthFunc(i.GEQUAL);break;case Ta:i.depthFunc(i.GREATER);break;case wa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Se=Ee}},setLocked:function(Ee){O=Ee},setClear:function(Ee){ge!==Ee&&(ge=Ee,ie&&(Ee=1-Ee),i.clearDepth(Ee))},reset:function(){O=!1,j=null,Se=null,ge=null,ie=!1}}}function s(){let O=!1,ie=null,j=null,Se=null,ge=null,Ee=null,Ve=null,it=null,pe=null;return{setTest:function(We){O||(We?he(i.STENCIL_TEST):Ne(i.STENCIL_TEST))},setMask:function(We){ie!==We&&!O&&(i.stencilMask(We),ie=We)},setFunc:function(We,tt,De){(j!==We||Se!==tt||ge!==De)&&(i.stencilFunc(We,tt,De),j=We,Se=tt,ge=De)},setOp:function(We,tt,De){(Ee!==We||Ve!==tt||it!==De)&&(i.stencilOp(We,tt,De),Ee=We,Ve=tt,it=De)},setLocked:function(We){O=We},setClear:function(We){pe!==We&&(i.clearStencil(We),pe=We)},reset:function(){O=!1,ie=null,j=null,Se=null,ge=null,Ee=null,Ve=null,it=null,pe=null}}}let r=new t,o=new n,a=new s,l={},c=new WeakMap,h={},u={},d={},f=new WeakMap,m=[],y=null,g=!1,p=null,M=null,E=null,x=null,b=null,S=null,_=null,v=new ue(0,0,0),P=0,T=!1,C=null,D=null,N=null,A=null,U=null,F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),B=!1,V=0,z=i.getParameter(i.VERSION);z.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(z)[1]),B=V>=1):z.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),B=V>=2);let W=null,K={},Q=i.getParameter(i.SCISSOR_BOX),ae=i.getParameter(i.VIEWPORT),k=new It().fromArray(Q),re=new It().fromArray(ae);function ce(O,ie,j,Se){let ge=new Uint8Array(4),Ee=i.createTexture();i.bindTexture(O,Ee),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ve=0;Ve<j;Ve++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(ie,0,i.RGBA,1,1,Se,0,i.RGBA,i.UNSIGNED_BYTE,ge):i.texImage2D(ie+Ve,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ge);return Ee}let Ce={};Ce[i.TEXTURE_2D]=ce(i.TEXTURE_2D,i.TEXTURE_2D,1),Ce[i.TEXTURE_CUBE_MAP]=ce(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ce[i.TEXTURE_2D_ARRAY]=ce(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ce[i.TEXTURE_3D]=ce(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),he(i.DEPTH_TEST),o.setFunc(Ps),Ie(!1),Me(h1),he(i.CULL_FACE),le(ui);function he(O){h[O]!==!0&&(i.enable(O),h[O]=!0)}function Ne(O){h[O]!==!1&&(i.disable(O),h[O]=!1)}function et(O,ie){return d[O]!==ie?(i.bindFramebuffer(O,ie),d[O]=ie,O===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=ie),O===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=ie),!0):!1}function Le(O,ie){let j=m,Se=!1;if(O){j=f.get(ie),j===void 0&&(j=[],f.set(ie,j));let ge=O.textures;if(j.length!==ge.length||j[0]!==i.COLOR_ATTACHMENT0){for(let Ee=0,Ve=ge.length;Ee<Ve;Ee++)j[Ee]=i.COLOR_ATTACHMENT0+Ee;j.length=ge.length,Se=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,Se=!0);Se&&i.drawBuffers(j)}function oe(O){return y!==O?(i.useProgram(O),y=O,!0):!1}let ye={[ts]:i.FUNC_ADD,[Au]:i.FUNC_SUBTRACT,[Cu]:i.FUNC_REVERSE_SUBTRACT};ye[Pu]=i.MIN,ye[Iu]=i.MAX;let $={[Lu]:i.ZERO,[Du]:i.ONE,[Nu]:i.SRC_COLOR,[f1]:i.SRC_ALPHA,[zu]:i.SRC_ALPHA_SATURATE,[Bu]:i.DST_COLOR,[Ou]:i.DST_ALPHA,[Uu]:i.ONE_MINUS_SRC_COLOR,[p1]:i.ONE_MINUS_SRC_ALPHA,[Hu]:i.ONE_MINUS_DST_COLOR,[Fu]:i.ONE_MINUS_DST_ALPHA,[Gu]:i.CONSTANT_COLOR,[ku]:i.ONE_MINUS_CONSTANT_COLOR,[Vu]:i.CONSTANT_ALPHA,[Wu]:i.ONE_MINUS_CONSTANT_ALPHA};function le(O,ie,j,Se,ge,Ee,Ve,it,pe,We){if(O===ui){g===!0&&(Ne(i.BLEND),g=!1);return}if(g===!1&&(he(i.BLEND),g=!0),O!==Ru){if(O!==p||We!==T){if((M!==ts||b!==ts)&&(i.blendEquation(i.FUNC_ADD),M=ts,b=ts),We)switch(O){case qs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case nt:i.blendFunc(i.ONE,i.ONE);break;case u1:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case d1:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:qe("WebGLState: Invalid blending: ",O);break}else switch(O){case qs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case nt:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case u1:qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case d1:qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:qe("WebGLState: Invalid blending: ",O);break}E=null,x=null,S=null,_=null,v.set(0,0,0),P=0,p=O,T=We}return}ge=ge||ie,Ee=Ee||j,Ve=Ve||Se,(ie!==M||ge!==b)&&(i.blendEquationSeparate(ye[ie],ye[ge]),M=ie,b=ge),(j!==E||Se!==x||Ee!==S||Ve!==_)&&(i.blendFuncSeparate($[j],$[Se],$[Ee],$[Ve]),E=j,x=Se,S=Ee,_=Ve),(it.equals(v)===!1||pe!==P)&&(i.blendColor(it.r,it.g,it.b,pe),v.copy(it),P=pe),p=O,T=!1}function de(O,ie){O.side===Ht?Ne(i.CULL_FACE):he(i.CULL_FACE);let j=O.side===Qt;ie&&(j=!j),Ie(j),O.blending===qs&&O.transparent===!1?le(ui):le(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),o.setFunc(O.depthFunc),o.setTest(O.depthTest),o.setMask(O.depthWrite),r.setMask(O.colorWrite);let Se=O.stencilWrite;a.setTest(Se),Se&&(a.setMask(O.stencilWriteMask),a.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),a.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),ze(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?he(i.SAMPLE_ALPHA_TO_COVERAGE):Ne(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ie(O){C!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),C=O)}function Me(O){O!==Tu?(he(i.CULL_FACE),O!==D&&(O===h1?i.cullFace(i.BACK):O===wu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ne(i.CULL_FACE),D=O}function Ke(O){O!==N&&(B&&i.lineWidth(O),N=O)}function ze(O,ie,j){O?(he(i.POLYGON_OFFSET_FILL),(A!==ie||U!==j)&&(A=ie,U=j,o.getReversed()&&(ie=-ie,j=-j),i.polygonOffset(ie,j))):Ne(i.POLYGON_OFFSET_FILL)}function ht(O){O?he(i.SCISSOR_TEST):Ne(i.SCISSOR_TEST)}function ut(O){O===void 0&&(O=i.TEXTURE0+F-1),W!==O&&(i.activeTexture(O),W=O)}function _t(O,ie,j){j===void 0&&(W===null?j=i.TEXTURE0+F-1:j=W);let Se=K[j];Se===void 0&&(Se={type:void 0,texture:void 0},K[j]=Se),(Se.type!==O||Se.texture!==ie)&&(W!==j&&(i.activeTexture(j),W=j),i.bindTexture(O,ie||Ce[O]),Se.type=O,Se.texture=ie)}function G(){let O=K[W];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function Ot(){try{i.compressedTexImage2D(...arguments)}catch(O){qe("WebGLState:",O)}}function at(){try{i.compressedTexImage3D(...arguments)}catch(O){qe("WebGLState:",O)}}function wt(){try{i.texSubImage2D(...arguments)}catch(O){qe("WebGLState:",O)}}function we(){try{i.texSubImage3D(...arguments)}catch(O){qe("WebGLState:",O)}}function Nt(){try{i.compressedTexSubImage2D(...arguments)}catch(O){qe("WebGLState:",O)}}function Xe(){try{i.compressedTexSubImage3D(...arguments)}catch(O){qe("WebGLState:",O)}}function Je(){try{i.texStorage2D(...arguments)}catch(O){qe("WebGLState:",O)}}function L(){try{i.texStorage3D(...arguments)}catch(O){qe("WebGLState:",O)}}function w(){try{i.texImage2D(...arguments)}catch(O){qe("WebGLState:",O)}}function Y(){try{i.texImage3D(...arguments)}catch(O){qe("WebGLState:",O)}}function fe(O){return u[O]!==void 0?u[O]:i.getParameter(O)}function se(O,ie){u[O]!==ie&&(i.pixelStorei(O,ie),u[O]=ie)}function ve(O){k.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),k.copy(O))}function Re(O){re.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),re.copy(O))}function ee(O,ie){let j=c.get(ie);j===void 0&&(j=new WeakMap,c.set(ie,j));let Se=j.get(O);Se===void 0&&(Se=i.getUniformBlockIndex(ie,O.name),i.uniformBlockBinding(ie,Se,Se),j.set(O,Se))}function ne(O,ie,j){let ge=c.get(ie).get(O);l[ge]!==j&&(i.bindBufferBase(i.UNIFORM_BUFFER,ge,j),l[ge]=j)}function be(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},u={},W=null,K={},d={},l={},f=new WeakMap,m=[],y=null,g=!1,p=null,M=null,E=null,x=null,b=null,S=null,_=null,v=new ue(0,0,0),P=0,T=!1,C=null,D=null,N=null,A=null,U=null,k.set(0,0,i.canvas.width,i.canvas.height),re.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:he,disable:Ne,bindFramebuffer:et,drawBuffers:Le,useProgram:oe,setBlending:le,setMaterial:de,setFlipSided:Ie,setCullFace:Me,setLineWidth:Ke,setPolygonOffset:ze,setScissorTest:ht,activeTexture:ut,bindTexture:_t,unbindTexture:G,compressedTexImage2D:Ot,compressedTexImage3D:at,texImage2D:w,texImage3D:Y,pixelStorei:se,getParameter:fe,updateUBOMapping:ee,uniformBlockBinding:ne,texStorage2D:Je,texStorage3D:L,texSubImage2D:wt,texSubImage3D:we,compressedTexSubImage2D:Nt,compressedTexSubImage3D:Xe,scissor:ve,viewport:Re,reset:be}}function A8(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new te,h=new WeakMap,u=new Set,d,f=new WeakMap,m=new Set,y=new FinalizationRegistry(L=>m.delete(L)),g=!1;try{g=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(L,w){return g?new OffscreenCanvas(L,w):Ar("canvas")}function M(L,w,Y){let fe=1,se=Je(L);if((se.width>Y||se.height>Y)&&(fe=Y/Math.max(se.width,se.height)),fe<1)if(typeof HTMLImageElement!="undefined"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&L instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&L instanceof ImageBitmap||typeof VideoFrame!="undefined"&&L instanceof VideoFrame){let ve=Math.floor(fe*se.width),Re=Math.floor(fe*se.height);d===void 0&&(d=p(ve,Re));let ee=w?p(ve,Re):d;return ee.width=ve,ee.height=Re,ee.getContext("2d").drawImage(L,0,0,ve,Re),Ye("WebGLRenderer: Texture has been resized from ("+se.width+"x"+se.height+") to ("+ve+"x"+Re+")."),ee}else return"data"in L&&Ye("WebGLRenderer: Image in DataTexture is too big ("+se.width+"x"+se.height+")."),L;return L}function E(L){return L.generateMipmaps}function x(L){i.generateMipmap(L)}function b(L){return L.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?i.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(L,w,Y,fe,se,ve=!1){if(L!==null){if(i[L]!==void 0)return i[L];Ye("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let Re;fe&&(Re=e.get("EXT_texture_norm16"),Re||Ye("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ee=w;if(w===i.RED&&(Y===i.FLOAT&&(ee=i.R32F),Y===i.HALF_FLOAT&&(ee=i.R16F),Y===i.UNSIGNED_BYTE&&(ee=i.R8),Y===i.UNSIGNED_SHORT&&Re&&(ee=Re.R16_EXT),Y===i.SHORT&&Re&&(ee=Re.R16_SNORM_EXT)),w===i.RED_INTEGER&&(Y===i.UNSIGNED_BYTE&&(ee=i.R8UI),Y===i.UNSIGNED_SHORT&&(ee=i.R16UI),Y===i.UNSIGNED_INT&&(ee=i.R32UI),Y===i.BYTE&&(ee=i.R8I),Y===i.SHORT&&(ee=i.R16I),Y===i.INT&&(ee=i.R32I)),w===i.RG&&(Y===i.FLOAT&&(ee=i.RG32F),Y===i.HALF_FLOAT&&(ee=i.RG16F),Y===i.UNSIGNED_BYTE&&(ee=i.RG8),Y===i.UNSIGNED_SHORT&&Re&&(ee=Re.RG16_EXT),Y===i.SHORT&&Re&&(ee=Re.RG16_SNORM_EXT)),w===i.RG_INTEGER&&(Y===i.UNSIGNED_BYTE&&(ee=i.RG8UI),Y===i.UNSIGNED_SHORT&&(ee=i.RG16UI),Y===i.UNSIGNED_INT&&(ee=i.RG32UI),Y===i.BYTE&&(ee=i.RG8I),Y===i.SHORT&&(ee=i.RG16I),Y===i.INT&&(ee=i.RG32I)),w===i.RGB_INTEGER&&(Y===i.UNSIGNED_BYTE&&(ee=i.RGB8UI),Y===i.UNSIGNED_SHORT&&(ee=i.RGB16UI),Y===i.UNSIGNED_INT&&(ee=i.RGB32UI),Y===i.BYTE&&(ee=i.RGB8I),Y===i.SHORT&&(ee=i.RGB16I),Y===i.INT&&(ee=i.RGB32I)),w===i.RGBA_INTEGER&&(Y===i.UNSIGNED_BYTE&&(ee=i.RGBA8UI),Y===i.UNSIGNED_SHORT&&(ee=i.RGBA16UI),Y===i.UNSIGNED_INT&&(ee=i.RGBA32UI),Y===i.BYTE&&(ee=i.RGBA8I),Y===i.SHORT&&(ee=i.RGBA16I),Y===i.INT&&(ee=i.RGBA32I)),w===i.RGB&&(Y===i.UNSIGNED_SHORT&&Re&&(ee=Re.RGB16_EXT),Y===i.SHORT&&Re&&(ee=Re.RGB16_SNORM_EXT),Y===i.UNSIGNED_INT_5_9_9_9_REV&&(ee=i.RGB9_E5),Y===i.UNSIGNED_INT_10F_11F_11F_REV&&(ee=i.R11F_G11F_B10F)),w===i.RGBA){let ne=ve?Rr:lt.getTransfer(se);Y===i.FLOAT&&(ee=i.RGBA32F),Y===i.HALF_FLOAT&&(ee=i.RGBA16F),Y===i.UNSIGNED_BYTE&&(ee=ne===xt?i.SRGB8_ALPHA8:i.RGBA8),Y===i.UNSIGNED_SHORT&&Re&&(ee=Re.RGBA16_EXT),Y===i.SHORT&&Re&&(ee=Re.RGBA16_SNORM_EXT),Y===i.UNSIGNED_SHORT_4_4_4_4&&(ee=i.RGBA4),Y===i.UNSIGNED_SHORT_5_5_5_1&&(ee=i.RGB5_A1)}return(ee===i.R16F||ee===i.R32F||ee===i.RG16F||ee===i.RG32F||ee===i.RGBA16F||ee===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function _(L,w){let Y;return L?w===null||w===Bn||w===ss?Y=i.DEPTH24_STENCIL8:w===Cn?Y=i.DEPTH32F_STENCIL8:w===Ks&&(Y=i.DEPTH24_STENCIL8,Ye("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Bn||w===ss?Y=i.DEPTH_COMPONENT24:w===Cn?Y=i.DEPTH_COMPONENT32F:w===Ks&&(Y=i.DEPTH_COMPONENT16),Y}function v(L,w){return E(L)===!0||L.isFramebufferTexture&&L.minFilter!==Jt&&L.minFilter!==un?Math.log2(Math.max(w.width,w.height))+1:L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?w.mipmaps.length:1}function P(L){let w=new WeakRef(L);n.get(L).__ref=w,m.add(w),y.register(L,w,w)}function T(L){let w=n.get(L).__ref;w!==void 0&&(m.delete(w),y.unregister(w))}function C(L){N(L.target)}function D(L){A(L.target)}function N(L){L.removeEventListener("dispose",C),T(L),F(L),L.isVideoTexture&&h.delete(L),L.isHTMLTexture&&u.delete(L)}function A(L){L.removeEventListener("dispose",D),T(L),V(L)}function U(){for(let L of m){let w=L.deref();w!==void 0&&(w.isRenderTarget===!0?A(w):N(w))}m.clear(),u.clear()}function F(L){let w=n.get(L);if(w.__webglInit===void 0)return;let Y=L.source,fe=f.get(Y);if(fe){let se=fe[w.__cacheKey];se.usedTimes--,se.usedTimes===0&&B(L),Object.keys(fe).length===0&&f.delete(Y)}n.remove(L)}function B(L){let w=n.get(L);i.deleteTexture(w.__webglTexture);let Y=L.source,fe=f.get(Y);delete fe[w.__cacheKey],o.memory.textures--}function V(L){let w=n.get(L);w.__depthDisposeCallback&&w.__depthDisposeCallback();let Y=L.depthTexture;if(Y&&Y.renderTarget===L&&N(Y),L.isWebGLCubeRenderTarget)for(let se=0;se<6;se++){if(Array.isArray(w.__webglFramebuffer[se]))for(let ve=0;ve<w.__webglFramebuffer[se].length;ve++)i.deleteFramebuffer(w.__webglFramebuffer[se][ve]);else i.deleteFramebuffer(w.__webglFramebuffer[se]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[se])}else{if(Array.isArray(w.__webglFramebuffer))for(let se=0;se<w.__webglFramebuffer.length;se++)i.deleteFramebuffer(w.__webglFramebuffer[se]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let se=0;se<w.__webglColorRenderbuffer.length;se++)w.__webglColorRenderbuffer[se]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[se]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let fe=L.textures;for(let se=0,ve=fe.length;se<ve;se++){let Re=n.get(fe[se]);Re.__webglTexture&&(i.deleteTexture(Re.__webglTexture),o.memory.textures--),n.remove(fe[se])}n.remove(L)}let z=0;function W(){z=0}function K(){return z}function Q(L){z=L}function ae(){let L=z;return L>=s.maxTextures&&Ye("WebGLTextures: Trying to use "+(L+1)+" texture units while this GPU supports only "+s.maxTextures),z+=1,L}function k(L){let w=[];return w.push(L.wrapS),w.push(L.wrapT),w.push(L.wrapR||0),w.push(L.magFilter),w.push(L.minFilter),w.push(L.anisotropy),w.push(L.internalFormat),w.push(L.format),w.push(L.type),w.push(L.generateMipmaps),w.push(L.mipmapsAutoUpdate),w.push(L.premultiplyAlpha),w.push(L.flipY),w.push(L.unpackAlignment),w.push(L.colorSpace),w.join()}function re(L,w){let Y=n.get(L);if(L.isVideoTexture&&Nt(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&Y.__version!==L.version){let fe=L.image;if(fe===null)Ye("WebGLRenderer: Texture marked for update but no image data found.");else if(fe.complete===!1)Ye("WebGLRenderer: Texture marked for update but image is incomplete");else{de(Y,L,w);return}}else L.isExternalTexture&&(Y.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,Y.__webglTexture,i.TEXTURE0+w)}function ce(L,w){let Y=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&Y.__version!==L.version){de(Y,L,w);return}else L.isExternalTexture&&(Y.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,Y.__webglTexture,i.TEXTURE0+w)}function Ce(L,w){let Y=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&Y.__version!==L.version){de(Y,L,w);return}t.bindTexture(i.TEXTURE_3D,Y.__webglTexture,i.TEXTURE0+w)}function he(L,w){let Y=n.get(L);if(L.version>0&&Y.__version!==L.version){Ie(Y,L,w);return}t.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture,i.TEXTURE0+w)}let Ne={[Ra]:i.REPEAT,[kn]:i.CLAMP_TO_EDGE,[Aa]:i.MIRRORED_REPEAT},et={[Jt]:i.NEAREST,[qu]:i.NEAREST_MIPMAP_NEAREST,[go]:i.NEAREST_MIPMAP_LINEAR,[un]:i.LINEAR,[al]:i.LINEAR_MIPMAP_NEAREST,[di]:i.LINEAR_MIPMAP_LINEAR},Le={[$u]:i.NEVER,[S1]:i.ALWAYS,[ju]:i.LESS,[E1]:i.LEQUAL,[Qu]:i.EQUAL,[b1]:i.GEQUAL,[ed]:i.GREATER,[td]:i.NOTEQUAL};function oe(L,w){if(w.type===Cn&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===un||w.magFilter===al||w.magFilter===go||w.magFilter===di||w.minFilter===un||w.minFilter===al||w.minFilter===go||w.minFilter===di)&&Ye("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(L,i.TEXTURE_WRAP_S,Ne[w.wrapS]),i.texParameteri(L,i.TEXTURE_WRAP_T,Ne[w.wrapT]),(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)&&i.texParameteri(L,i.TEXTURE_WRAP_R,Ne[w.wrapR]),i.texParameteri(L,i.TEXTURE_MAG_FILTER,et[w.magFilter]),i.texParameteri(L,i.TEXTURE_MIN_FILTER,et[w.minFilter]),w.compareFunction&&(i.texParameteri(L,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(L,i.TEXTURE_COMPARE_FUNC,Le[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Jt||w.minFilter!==go&&w.minFilter!==di||w.type===Cn&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){let Y=e.get("EXT_texture_filter_anisotropic");i.texParameterf(L,Y.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function ye(L,w){let Y=!1;L.__webglInit===void 0&&(L.__webglInit=!0,w.addEventListener("dispose",C),P(w));let fe=w.source,se=f.get(fe);se===void 0&&(se={},f.set(fe,se));let ve=k(w);if(ve!==L.__cacheKey){se[ve]===void 0&&(se[ve]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,Y=!0),se[ve].usedTimes++;let Re=se[L.__cacheKey];Re!==void 0&&(se[L.__cacheKey].usedTimes--,Re.usedTimes===0&&B(w)),L.__cacheKey=ve,L.__webglTexture=se[ve].texture}return Y}function $(L,w,Y){return Math.floor(Math.floor(L/Y)/w)}function le(L,w,Y,fe){let ve=L.updateRanges;if(ve.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,w.width,w.height,Y,fe,w.data);else{ve.sort((O,ie)=>O.start-ie.start);let Re=0;for(let O=1;O<ve.length;O++){let ie=ve[Re],j=ve[O],Se=ie.start+ie.count,ge=$(j.start,w.width,4),Ee=$(ie.start,w.width,4);j.start<=Se+1&&ge===Ee&&$(j.start+j.count-1,w.width,4)===ge?ie.count=Math.max(ie.count,j.start+j.count-ie.start):(++Re,ve[Re]=j)}ve.length=Re+1;let ee=t.getParameter(i.UNPACK_ROW_LENGTH),ne=t.getParameter(i.UNPACK_SKIP_PIXELS),be=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,w.width);for(let O=0,ie=ve.length;O<ie;O++){let j=ve[O],Se=Math.floor(j.start/4),ge=Math.ceil(j.count/4),Ee=Se%w.width,Ve=Math.floor(Se/w.width),it=ge,pe=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ee),t.pixelStorei(i.UNPACK_SKIP_ROWS,Ve),t.texSubImage2D(i.TEXTURE_2D,0,Ee,Ve,it,pe,Y,fe,w.data)}L.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,ee),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ne),t.pixelStorei(i.UNPACK_SKIP_ROWS,be)}}function de(L,w,Y){let fe=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(fe=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(fe=i.TEXTURE_3D);let se=ye(L,w),ve=w.source;t.bindTexture(fe,L.__webglTexture,i.TEXTURE0+Y);let Re=n.get(ve);if(ve.version!==Re.__version||se===!0){if(t.activeTexture(i.TEXTURE0+Y),(typeof ImageBitmap!="undefined"&&w.image instanceof ImageBitmap)===!1){let pe=lt.getPrimaries(lt.workingColorSpace),We=w.colorSpace===pi?null:lt.getPrimaries(w.colorSpace),tt=w.colorSpace===pi||pe===We?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,tt)}t.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment);let ne=M(w.image,!1,s.maxTextureSize);ne=Xe(w,ne);let be=r.convert(w.format,w.colorSpace),O=r.convert(w.type),ie=S(w.internalFormat,be,O,w.normalized,w.colorSpace,w.isVideoTexture);oe(fe,w);let j,Se=w.mipmaps,ge=w.isVideoTexture!==!0,Ee=Re.__version===void 0||se===!0,Ve=ve.dataReady,it=v(w,ne);if(w.isDepthTexture)ie=_(w.format===fi,w.type),Ee&&(ge?t.texStorage2D(i.TEXTURE_2D,1,ie,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,ie,ne.width,ne.height,0,be,O,null));else if(w.isDataTexture)if(Se.length>0){ge&&Ee&&t.texStorage2D(i.TEXTURE_2D,it,ie,Se[0].width,Se[0].height);for(let pe=0,We=Se.length;pe<We;pe++)j=Se[pe],ge?Ve&&t.texSubImage2D(i.TEXTURE_2D,pe,0,0,j.width,j.height,be,O,j.data):t.texImage2D(i.TEXTURE_2D,pe,ie,j.width,j.height,0,be,O,j.data);w.generateMipmaps=!1}else ge?(Ee&&t.texStorage2D(i.TEXTURE_2D,it,ie,ne.width,ne.height),Ve&&le(w,ne,be,O)):t.texImage2D(i.TEXTURE_2D,0,ie,ne.width,ne.height,0,be,O,ne.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){ge&&Ee&&t.texStorage3D(i.TEXTURE_2D_ARRAY,it,ie,Se[0].width,Se[0].height,ne.depth);for(let pe=0,We=Se.length;pe<We;pe++)if(j=Se[pe],w.format!==Hn)if(be!==null)if(ge){if(Ve)if(w.layerUpdates.size>0){let tt=U1(j.width,j.height,w.format,w.type);for(let De of w.layerUpdates){let St=j.data.subarray(De*tt/j.data.BYTES_PER_ELEMENT,(De+1)*tt/j.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,pe,0,0,De,j.width,j.height,1,be,St)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,pe,0,0,0,j.width,j.height,ne.depth,be,j.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,pe,ie,j.width,j.height,ne.depth,0,j.data,0,0);else Ye("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ge?Ve&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,pe,0,0,0,j.width,j.height,ne.depth,be,O,j.data):t.texImage3D(i.TEXTURE_2D_ARRAY,pe,ie,j.width,j.height,ne.depth,0,be,O,j.data);w.layerUpdates.size>0&&w.clearLayerUpdates()}else{ge&&Ee&&t.texStorage2D(i.TEXTURE_2D,it,ie,Se[0].width,Se[0].height);for(let pe=0,We=Se.length;pe<We;pe++)j=Se[pe],w.format!==Hn?be!==null?ge?Ve&&t.compressedTexSubImage2D(i.TEXTURE_2D,pe,0,0,j.width,j.height,be,j.data):t.compressedTexImage2D(i.TEXTURE_2D,pe,ie,j.width,j.height,0,j.data):Ye("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ge?Ve&&t.texSubImage2D(i.TEXTURE_2D,pe,0,0,j.width,j.height,be,O,j.data):t.texImage2D(i.TEXTURE_2D,pe,ie,j.width,j.height,0,be,O,j.data)}else if(w.isDataArrayTexture)if(ge){if(Ee&&t.texStorage3D(i.TEXTURE_2D_ARRAY,it,ie,ne.width,ne.height,ne.depth),Ve)if(w.layerUpdates.size>0){let pe=U1(ne.width,ne.height,w.format,w.type);for(let We of w.layerUpdates){let tt=ne.data.subarray(We*pe/ne.data.BYTES_PER_ELEMENT,(We+1)*pe/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,We,ne.width,ne.height,1,be,O,tt)}w.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,be,O,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ie,ne.width,ne.height,ne.depth,0,be,O,ne.data);else if(w.isData3DTexture)ge?(Ee&&t.texStorage3D(i.TEXTURE_3D,it,ie,ne.width,ne.height,ne.depth),Ve&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,be,O,ne.data)):t.texImage3D(i.TEXTURE_3D,0,ie,ne.width,ne.height,ne.depth,0,be,O,ne.data);else if(w.isFramebufferTexture){if(Ee)if(ge)t.texStorage2D(i.TEXTURE_2D,it,ie,ne.width,ne.height);else{let pe=ne.width,We=ne.height;for(let tt=0;tt<it;tt++)t.texImage2D(i.TEXTURE_2D,tt,ie,pe,We,0,be,O,null),pe>>=1,We>>=1}}else if(w.isHTMLTexture){if("texElementImage2D"in i){let pe=i.canvas;if(pe.hasAttribute("layoutsubtree")||pe.setAttribute("layoutsubtree","true"),ne.parentNode!==pe){pe.appendChild(ne),u.add(w),pe.onpaint=We=>{let tt=We.changedElements;for(let De of u)tt.includes(De.image)&&(De.needsUpdate=!0)},pe.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ne);else{let tt=i.RGBA,De=i.RGBA,St=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,tt,De,St,ne)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Se.length>0){if(ge&&Ee){let pe=Je(Se[0]);t.texStorage2D(i.TEXTURE_2D,it,ie,pe.width,pe.height)}for(let pe=0,We=Se.length;pe<We;pe++)j=Se[pe],ge?Ve&&t.texSubImage2D(i.TEXTURE_2D,pe,0,0,be,O,j):t.texImage2D(i.TEXTURE_2D,pe,ie,be,O,j);w.generateMipmaps=!1}else if(ge){if(Ee){let pe=Je(ne);t.texStorage2D(i.TEXTURE_2D,it,ie,pe.width,pe.height)}Ve&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,be,O,ne)}else t.texImage2D(i.TEXTURE_2D,0,ie,be,O,ne);E(w)&&w.mipmapsAutoUpdate===!0&&x(fe),Re.__version=ve.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function Ie(L,w,Y){if(w.image.length!==6)return;let fe=ye(L,w),se=w.source;t.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+Y);let ve=n.get(se);if(se.version!==ve.__version||fe===!0){t.activeTexture(i.TEXTURE0+Y);let Re=lt.getPrimaries(lt.workingColorSpace),ee=w.colorSpace===pi?null:lt.getPrimaries(w.colorSpace),ne=w.colorSpace===pi||Re===ee?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);let be=w.isCompressedTexture||w.image[0].isCompressedTexture,O=w.image[0]&&w.image[0].isDataTexture,ie=[];for(let De=0;De<6;De++)!be&&!O?ie[De]=M(w.image[De],!0,s.maxCubemapSize):ie[De]=O?w.image[De].image:w.image[De],ie[De]=Xe(w,ie[De]);let j=ie[0],Se=r.convert(w.format,w.colorSpace),ge=r.convert(w.type),Ee=S(w.internalFormat,Se,ge,w.normalized,w.colorSpace),Ve=w.isVideoTexture!==!0,it=ve.__version===void 0||fe===!0,pe=se.dataReady,We=v(w,j);oe(i.TEXTURE_CUBE_MAP,w);let tt;if(w.isDepthTexture){if(Ee=_(w.format===fi,w.type),it)if(Ve)t.texStorage2D(i.TEXTURE_CUBE_MAP,1,Ee,j.width,j.height);else for(let De=0;De<6;De++)t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+De,0,Ee,j.width,j.height,0,Se,ge,null)}else if(be){Ve&&it&&t.texStorage2D(i.TEXTURE_CUBE_MAP,We,Ee,j.width,j.height);for(let De=0;De<6;De++){tt=ie[De].mipmaps;for(let St=0;St<tt.length;St++){let qt=tt[St];w.format!==Hn?Se!==null?Ve?pe&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+De,St,0,0,qt.width,qt.height,Se,qt.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+De,St,Ee,qt.width,qt.height,0,qt.data):Ye("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ve?pe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+De,St,0,0,qt.width,qt.height,Se,ge,qt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+De,St,Ee,qt.width,qt.height,0,Se,ge,qt.data)}}}else{if(tt=w.mipmaps,Ve&&it){tt.length>0&&We++;let De=Je(ie[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,We,Ee,De.width,De.height)}for(let De=0;De<6;De++)if(O){Ve?pe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+De,0,0,0,ie[De].width,ie[De].height,Se,ge,ie[De].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+De,0,Ee,ie[De].width,ie[De].height,0,Se,ge,ie[De].data);for(let St=0;St<tt.length;St++){let yi=tt[St].image[De].image;Ve?pe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+De,St+1,0,0,yi.width,yi.height,Se,ge,yi.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+De,St+1,Ee,yi.width,yi.height,0,Se,ge,yi.data)}}else{Ve?pe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+De,0,0,0,Se,ge,ie[De]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+De,0,Ee,Se,ge,ie[De]);for(let St=0;St<tt.length;St++){let qt=tt[St];Ve?pe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+De,St+1,0,0,Se,ge,qt.image[De]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+De,St+1,Ee,Se,ge,qt.image[De])}}}E(w)&&w.mipmapsAutoUpdate===!0&&x(i.TEXTURE_CUBE_MAP),ve.__version=se.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function Me(L,w,Y,fe,se,ve){let Re=r.convert(Y.format,Y.colorSpace),ee=r.convert(Y.type),ne=S(Y.internalFormat,Re,ee,Y.normalized,Y.colorSpace),be=n.get(w),O=n.get(Y);if(O.__renderTarget=w,!be.__hasExternalTextures){let ie=Math.max(1,w.width>>ve),j=Math.max(1,w.height>>ve);se===i.TEXTURE_3D||se===i.TEXTURE_2D_ARRAY?t.texImage3D(se,ve,ne,ie,j,w.depth,0,Re,ee,null):t.texImage2D(se,ve,ne,ie,j,0,Re,ee,null)}t.bindFramebuffer(i.FRAMEBUFFER,L),we(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,fe,se,O.__webglTexture,0,wt(w)):(se===i.TEXTURE_2D||se>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&se<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,fe,se,O.__webglTexture,ve),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ke(L,w,Y){if(i.bindRenderbuffer(i.RENDERBUFFER,L),w.depthBuffer){let fe=w.depthTexture,se=fe&&fe.isDepthTexture?fe.type:null,ve=_(w.stencilBuffer,se),Re=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;we(w)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,wt(w),ve,w.width,w.height):Y?i.renderbufferStorageMultisample(i.RENDERBUFFER,wt(w),ve,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,ve,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Re,i.RENDERBUFFER,L)}else{let fe=w.textures;for(let se=0;se<fe.length;se++){let ve=fe[se],Re=r.convert(ve.format,ve.colorSpace),ee=r.convert(ve.type),ne=S(ve.internalFormat,Re,ee,ve.normalized,ve.colorSpace);we(w)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,wt(w),ne,w.width,w.height):Y?i.renderbufferStorageMultisample(i.RENDERBUFFER,wt(w),ne,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,ne,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ze(L,w,Y){let fe=w.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,L),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let se=n.get(w.depthTexture);se.__renderTarget=w;let ve=fe?w.depthTexture.image[0]:w.depthTexture.image;(!se.__webglTexture||ve.width!==w.width||ve.height!==w.height)&&(ve.width=w.width,ve.height=w.height,w.depthTexture.needsUpdate=!0),fe?he(w.depthTexture,0):re(w.depthTexture,0);let Re=se.__webglTexture,ee=wt(w),ne=fe?i.TEXTURE_CUBE_MAP_POSITIVE_X+Y:i.TEXTURE_2D,be=w.depthTexture.format===fi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(w.depthTexture.format===ri)we(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,be,ne,Re,0,ee):i.framebufferTexture2D(i.FRAMEBUFFER,be,ne,Re,0);else if(w.depthTexture.format===fi)we(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,be,ne,Re,0,ee):i.framebufferTexture2D(i.FRAMEBUFFER,be,ne,Re,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ht(L){let w=n.get(L),Y=L.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==L.depthTexture){let fe=L.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),fe){let se=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,fe.removeEventListener("dispose",se)};fe.addEventListener("dispose",se),w.__depthDisposeCallback=se}w.__boundDepthTexture=fe}if(L.depthTexture&&!w.__autoAllocateDepthBuffer)if(Y)for(let fe=0;fe<6;fe++)ze(w.__webglFramebuffer[fe],L,fe);else L.texture.mipmaps.length>0?ze(w.__webglFramebuffer[0],L,0):ze(w.__webglFramebuffer,L,0);else if(Y){w.__webglDepthbuffer=[];for(let fe=0;fe<6;fe++)if(t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[fe]),w.__webglDepthbuffer[fe]===void 0)w.__webglDepthbuffer[fe]=i.createRenderbuffer(),Ke(w.__webglDepthbuffer[fe],L,!1);else{let se=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ve=w.__webglDepthbuffer[fe];i.bindRenderbuffer(i.RENDERBUFFER,ve),i.framebufferRenderbuffer(i.FRAMEBUFFER,se,i.RENDERBUFFER,ve)}}else if(L.texture.mipmaps.length>0?t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),Ke(w.__webglDepthbuffer,L,!1);else{let se=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ve=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ve),i.framebufferRenderbuffer(i.FRAMEBUFFER,se,i.RENDERBUFFER,ve)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ut(L,w,Y){let fe=n.get(L);w!==void 0&&Me(fe.__webglFramebuffer,L,L.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),Y!==void 0&&ht(L)}function _t(L){let w=L.texture,Y=n.get(L),fe=n.get(w);L.addEventListener("dispose",D),P(L);let se=L.textures,ve=L.isWebGLCubeRenderTarget===!0,Re=se.length>1;if(Re||(fe.__webglTexture===void 0&&(fe.__webglTexture=i.createTexture()),fe.__version=w.version,o.memory.textures++),ve){Y.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(w.mipmaps.length>0){Y.__webglFramebuffer[ee]=[];for(let ne=0;ne<w.mipmaps.length;ne++)Y.__webglFramebuffer[ee][ne]=i.createFramebuffer()}else Y.__webglFramebuffer[ee]=i.createFramebuffer()}else{if(w.mipmaps.length>0){Y.__webglFramebuffer=[];for(let ee=0;ee<w.mipmaps.length;ee++)Y.__webglFramebuffer[ee]=i.createFramebuffer()}else Y.__webglFramebuffer=i.createFramebuffer();if(Re)for(let ee=0,ne=se.length;ee<ne;ee++){let be=n.get(se[ee]);be.__webglTexture===void 0&&(be.__webglTexture=i.createTexture(),o.memory.textures++)}if(L.samples>0&&we(L)===!1){Y.__webglMultisampledFramebuffer=i.createFramebuffer(),Y.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let ee=0;ee<se.length;ee++){let ne=se[ee];Y.__webglColorRenderbuffer[ee]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,Y.__webglColorRenderbuffer[ee]);let be=r.convert(ne.format,ne.colorSpace),O=r.convert(ne.type),ie=S(ne.internalFormat,be,O,ne.normalized,ne.colorSpace,L.isXRRenderTarget===!0),j=wt(L);i.renderbufferStorageMultisample(i.RENDERBUFFER,j,ie,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ee,i.RENDERBUFFER,Y.__webglColorRenderbuffer[ee])}i.bindRenderbuffer(i.RENDERBUFFER,null),L.depthBuffer&&(Y.__webglDepthRenderbuffer=i.createRenderbuffer(),Ke(Y.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ve){t.bindTexture(i.TEXTURE_CUBE_MAP,fe.__webglTexture),oe(i.TEXTURE_CUBE_MAP,w);for(let ee=0;ee<6;ee++)if(w.mipmaps.length>0)for(let ne=0;ne<w.mipmaps.length;ne++)Me(Y.__webglFramebuffer[ee][ne],L,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ne);else Me(Y.__webglFramebuffer[ee],L,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);E(w)?x(i.TEXTURE_CUBE_MAP):w.mipmaps.length>0&&i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),t.unbindTexture()}else if(Re){for(let ee=0,ne=se.length;ee<ne;ee++){let be=se[ee],O=n.get(be),ie=i.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ie=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ie,O.__webglTexture),oe(ie,be),Me(Y.__webglFramebuffer,L,be,i.COLOR_ATTACHMENT0+ee,ie,0),E(be)&&x(ie)}t.unbindTexture()}else{let ee=i.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ee=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ee,fe.__webglTexture),oe(ee,w),w.mipmaps.length>0)for(let ne=0;ne<w.mipmaps.length;ne++)Me(Y.__webglFramebuffer[ne],L,w,i.COLOR_ATTACHMENT0,ee,ne);else Me(Y.__webglFramebuffer,L,w,i.COLOR_ATTACHMENT0,ee,0);E(w)?x(ee):w.mipmaps.length>0&&i.texParameteri(ee,i.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),t.unbindTexture()}L.depthBuffer&&ht(L)}function G(L){let w=L.textures;for(let Y=0,fe=w.length;Y<fe;Y++){let se=w[Y];if(E(se)&&se.mipmapsAutoUpdate===!0){let ve=b(L),Re=n.get(se).__webglTexture;t.bindTexture(ve,Re),x(ve),t.unbindTexture()}}}let Ot=[];function at(L){if(L.samples>0){if(we(L)===!1){let w=L.textures,Y=L.width,fe=L.height,se=i.COLOR_BUFFER_BIT,ve=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Re=n.get(L),ee=w.length>1;if(ee)for(let be=0;be<w.length;be++)t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Re.__webglMultisampledFramebuffer),L.texture.mipmaps.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer);for(let be=0;be<w.length;be++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(se|=i.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(se|=i.STENCIL_BUFFER_BIT)),ee){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Re.__webglColorRenderbuffer[be]);let O=n.get(w[be]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,O,0)}i.blitFramebuffer(0,0,Y,fe,0,0,Y,fe,se,i.NEAREST),l===!0&&(Ot.length=0,Ot.push(i.COLOR_ATTACHMENT0+be),L.depthBuffer&&L.storeMultisampledDepthBuffer===!1&&Ot.push(ve),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ot))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ee)for(let be=0;be<w.length;be++){t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,Re.__webglColorRenderbuffer[be]);let O=n.get(w[be]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,O,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.storeMultisampledDepthBuffer===!1&&l){let w=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function wt(L){return Math.min(s.maxSamples,L.samples)}function we(L){let w=n.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Nt(L){let w=o.render.frame;h.get(L)!==w&&(h.set(L,w),L.update())}function Xe(L,w){let Y=L.colorSpace,fe=L.format,se=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||Y!==wr&&Y!==pi&&(lt.getTransfer(Y)===xt?(fe!==Hn||se!==fn)&&Ye("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):qe("WebGLTextures: Unsupported texture color space:",Y)),w}function Je(L){return typeof HTMLImageElement!="undefined"&&L instanceof HTMLImageElement?(c.width=L.naturalWidth||L.width,c.height=L.naturalHeight||L.height):typeof VideoFrame!="undefined"&&L instanceof VideoFrame?(c.width=L.displayWidth,c.height=L.displayHeight):(c.width=L.width,c.height=L.height),c}this.allocateTextureUnit=ae,this.resetTextureUnits=W,this.getTextureUnits=K,this.setTextureUnits=Q,this.setTexture2D=re,this.setTexture2DArray=ce,this.setTexture3D=Ce,this.setTextureCube=he,this.rebindTextures=ut,this.setupRenderTarget=_t,this.updateRenderTargetMipmap=G,this.updateMultisampleRenderTarget=at,this.setupDepthRenderbuffer=ht,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=we,this.dispose=U}function C8(i,e){function t(n,s=pi){let r,o=lt.getTransfer(s);if(n===fn)return i.UNSIGNED_BYTE;if(n===cl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===hl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===x1)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===y1)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===g1)return i.BYTE;if(n===_1)return i.SHORT;if(n===Ks)return i.UNSIGNED_SHORT;if(n===ll)return i.INT;if(n===Bn)return i.UNSIGNED_INT;if(n===Cn)return i.FLOAT;if(n===en)return i.HALF_FLOAT;if(n===M1)return i.ALPHA;if(n===v1)return i.RGB;if(n===Hn)return i.RGBA;if(n===ri)return i.DEPTH_COMPONENT;if(n===fi)return i.DEPTH_STENCIL;if(n===ul)return i.RED;if(n===dl)return i.RED_INTEGER;if(n===Ni)return i.RG;if(n===fl)return i.RG_INTEGER;if(n===pl)return i.RGBA_INTEGER;if(n===_o||n===xo||n===yo||n===Mo)if(o===xt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===_o)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===xo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===yo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Mo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===_o)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===xo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===yo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Mo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ml||n===gl||n===_l||n===xl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ml)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===gl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===_l)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===xl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===yl||n===Ml||n===vl||n===El||n===bl||n===vo||n===Sl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===yl||n===Ml)return o===xt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===vl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===El)return r.COMPRESSED_R11_EAC;if(n===bl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===vo)return r.COMPRESSED_RG11_EAC;if(n===Sl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Tl||n===wl||n===Rl||n===Al||n===Cl||n===Pl||n===Il||n===Ll||n===Dl||n===Nl||n===Ul||n===Ol||n===Fl||n===Bl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Tl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===wl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Rl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Al)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Cl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Pl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Il)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ll)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Dl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Nl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ul)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ol)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Fl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Bl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Hl||n===zl||n===Gl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Hl)return o===xt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===zl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Gl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===kl||n===Vl||n===Eo||n===Wl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===kl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Vl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Eo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Wl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ss?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var P8=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,I8=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,K1=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Gr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Pt({vertexShader:P8,fragmentShader:I8,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Z(new Fn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},J1=class extends On{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null,y=typeof XRWebGLBinding!="undefined",g=new K1,p={},M=t.getContextAttributes(),E=null,x=null,b=[],S=[],_=new te,v=null,P=null,T=new hn;T.viewport=new It;let C=new hn;C.viewport=new It;let D=[T,C],N=new tl,A=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let re=b[k];return re===void 0&&(re=new Os,b[k]=re),re.getTargetRaySpace()},this.getControllerGrip=function(k){let re=b[k];return re===void 0&&(re=new Os,b[k]=re),re.getGripSpace()},this.getHand=function(k){let re=b[k];return re===void 0&&(re=new Os,b[k]=re),re.getHandSpace()};function F(k){let re=S.indexOf(k.inputSource);if(re===-1)return;let ce=b[re];ce!==void 0&&(ce.update(k.inputSource,k.frame,c||o),ce.dispatchEvent({type:k.type,data:k.inputSource}))}function B(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",V);for(let k=0;k<b.length;k++){let re=S[k];re!==null&&(S[k]=null,b[k].disconnect(re))}A=null,U=null,g.reset();for(let k in p)delete p[k];if(e.setRenderTarget(E),f=null,d=null,u=null,s=null,x=null,ae.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(_.width,_.height,!1),P!==null){let k=P.camera;k.fov=P.fov,k.zoom=P.zoom,k.updateProjectionMatrix(),P=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){r=k,n.isPresenting===!0&&Ye("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){a=k,n.isPresenting===!0&&Ye("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(k){c=k},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&y&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(k){if(s=k,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",B),s.addEventListener("inputsourceschange",V),M.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(_),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let ce=null,Ce=null,he=null;M.depth&&(he=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ce=M.stencil?fi:ri,Ce=M.stencil?ss:Bn);let Ne={colorFormat:t.RGBA8,depthFormat:he,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Ne),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new Vt(d.textureWidth,d.textureHeight,{format:Hn,type:fn,depthTexture:new li(d.textureWidth,d.textureHeight,Ce,void 0,void 0,void 0,void 0,void 0,void 0,ce),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let ce={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,ce),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new Vt(f.framebufferWidth,f.framebufferHeight,{format:Hn,type:fn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),ae.setContext(s),ae.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function V(k){for(let re=0;re<k.removed.length;re++){let ce=k.removed[re],Ce=S.indexOf(ce);Ce>=0&&(S[Ce]=null,b[Ce].disconnect(ce))}for(let re=0;re<k.added.length;re++){let ce=k.added[re],Ce=S.indexOf(ce);if(Ce===-1){for(let Ne=0;Ne<b.length;Ne++)if(Ne>=S.length){S.push(ce),Ce=Ne;break}else if(S[Ne]===null){S[Ne]=ce,Ce=Ne;break}if(Ce===-1)break}let he=b[Ce];he&&he.connect(ce)}}function z(k,re){re===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices(re.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(s===null)return;let re=k.near,ce=k.far;g.texture!==null&&(g.depthNear>0&&(re=g.depthNear),g.depthFar>0&&(ce=g.depthFar)),N.near=C.near=T.near=re,N.far=C.far=T.far=ce,(A!==N.near||U!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),A=N.near,U=N.far),N.layers.mask=k.layers.mask|6,T.layers.mask=N.layers.mask&-5,C.layers.mask=N.layers.mask&-3;let Ce=k.parent,he=N.cameras;z(N,Ce);for(let Ne=0;Ne<he.length;Ne++)z(he[Ne],Ce);N.projectionMatrix.copy(T.projectionMatrix),N.projectionMatrixInverse.copy(T.projectionMatrixInverse),P===null&&k.isPerspectiveCamera&&(P={camera:k,fov:k.fov,zoom:k.zoom}),W(k,N,Ce)};function W(k,re,ce){ce===null?k.matrix.copy(re.matrixWorld):(k.matrix.copy(ce.matrixWorld),k.matrix.invert(),k.matrix.multiply(re.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy(re.projectionMatrix),k.projectionMatrixInverse.copy(re.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=Ds*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(k){l=k,d!==null&&(d.fixedFoveation=k),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=k)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(N)},this.getCameraTexture=function(k){return p[k]};let K=null;function Q(k,re){if(h=re.getViewerPose(c||o),m=re,h!==null){let ce=h.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let Ce=!1;ce.length!==N.cameras.length&&(N.cameras.length=0,Ce=!0);for(let Le=0;Le<ce.length;Le++){let oe=ce[Le],ye=null;if(f!==null)ye=f.getViewport(oe);else{let le=u.getViewSubImage(d,oe);ye=le.viewport,Le===0&&(e.setRenderTargetTextures(x,le.colorTexture,le.depthStencilTexture),e.setRenderTarget(x))}let $=D[Le];$===void 0&&($=new hn,$.layers.enable(Le),$.viewport=new It,D[Le]=$),$.matrix.fromArray(oe.transform.matrix),$.matrix.decompose($.position,$.quaternion,$.scale),$.projectionMatrix.fromArray(oe.projectionMatrix),$.projectionMatrixInverse.copy($.projectionMatrix).invert(),$.viewport.set(ye.x,ye.y,ye.width,ye.height),Le===0&&(N.matrix.copy($.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Ce===!0&&N.cameras.push($)}let he=s.enabledFeatures;if(he&&he.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){u=n.getBinding();let Le=u.getDepthInformation(ce[0]);Le&&Le.isValid&&Le.texture&&g.init(Le,s.renderState)}if(he&&he.includes("camera-access")&&y){e.state.unbindTexture(),u=n.getBinding();for(let Le=0;Le<ce.length;Le++){let oe=ce[Le].camera;if(oe){let ye=p[oe];ye||(ye=new Gr,p[oe]=ye);let $=u.getCameraImage(oe);ye.sourceTexture=$}}}}for(let ce=0;ce<b.length;ce++){let Ce=S[ce],he=b[ce];Ce!==null&&he!==void 0&&he.update(Ce,re,c||o)}K&&K(k,re),re.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:re}),m=null}let ae=new Ud;ae.setAnimationLoop(Q),this.setAnimationLoop=function(k){K=k},this.dispose=function(){}}},L8=new Ze,Xd=new $e;Xd.set(-1,0,0,0,1,0,0,0,1);function D8(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,L1(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,M,E,x){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,x)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),y(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?l(g,p,M,E):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Qt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Qt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let M=e.get(p),E=M.envMap,x=M.envMapRotation;E&&(g.envMap.value=E,g.envMapRotation.value.setFromMatrix4(L8.makeRotationFromEuler(x)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Xd),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,M,E){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*M,g.scale.value=E*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,M){g.ior.value=p.ior,p.diffuseRoughness>0&&(g.diffuseRoughness.value=p.diffuseRoughness,p.diffuseRoughnessMap&&(g.diffuseRoughnessMap.value=p.diffuseRoughnessMap,t(p.diffuseRoughnessMap,g.diffuseRoughnessMapTransform))),p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Qt&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessMinimum,g.iridescenceThicknessMaximum.value=p.iridescenceThicknessMaximum,p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function y(g,p){let M=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function N8(i,e,t,n){let s={},r={};function o(M,E){let x=E.program;n.uniformBlockBinding(M,x,s[M.id])}function a(M,E){let x=s[M.id];x===void 0&&(m(M),x=l(M),s[M.id]=x,M.addEventListener("dispose",g));let b=E.program;n.updateUBOMapping(M,b);let S=e.render.frame;r[M.id]!==S&&(c(M),r[M.id]=S)}function l(M){let E=i.createBuffer(),x=M.__size,b=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,x,b),i.bindBuffer(i.UNIFORM_BUFFER,null),E}function c(M){let E=s[M.id],x=M.uniforms,b=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let S=0,_=x.length;S<_;S++){let v=x[S];if(Array.isArray(v))for(let P=0,T=v.length;P<T;P++)h(v[P],S,P,b);else h(v,S,0,b)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(M,E,x,b){if(d(M,E,x,b)===!0){let S=M.__offset,_=M.value;if(Array.isArray(_)){let v=0;for(let P=0;P<_.length;P++){let T=_[P],C=y(T,!0);u(T,M.__data,v),v+=C.storage/Float32Array.BYTES_PER_ELEMENT}}else u(_,M.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,S,M.__data)}}function u(M,E,x){typeof M=="number"||typeof M=="boolean"?E[x]=M:M.isMatrix3?(E[x]=M.elements[0],E[x+1]=M.elements[1],E[x+2]=M.elements[2],E[x+3]=0,E[x+4]=M.elements[3],E[x+5]=M.elements[4],E[x+6]=M.elements[5],E[x+7]=0,E[x+8]=M.elements[6],E[x+9]=M.elements[7],E[x+10]=M.elements[8],E[x+11]=0):ArrayBuffer.isView(M)?E.set(M.subarray(0,E.length-x),x):M.toArray(E,x)}function d(M,E,x,b){let S=M.value,_=E+"_"+x;if(Array.isArray(S)){b[_]===void 0&&(b[_]=[]);let v=b[_],P=!1;for(let T=0;T<S.length;T++)f(S[T],v,T)===!0&&(P=!0);return P}return f(S,b,_)}function f(M,E,x){if(E[x]===void 0)return typeof M=="number"||typeof M=="boolean"?E[x]=M:ArrayBuffer.isView(M)?E[x]=M.slice():E[x]=M.clone(),!0;{let b=E[x];if(typeof M=="number"||typeof M=="boolean"){if(b!==M)return E[x]=M,!0}else{if(ArrayBuffer.isView(M))return!0;if(b.equals(M)===!1)return b.copy(M),!0}}return!1}function m(M){let E=M.uniforms,x=0,b=16;for(let _=0,v=E.length;_<v;_++){let P=Array.isArray(E[_])?E[_]:[E[_]];for(let T=0,C=P.length;T<C;T++){let D=P[T],N=Array.isArray(D.value)?D.value:[D.value],A=Array.isArray(E[_])||Array.isArray(D.value),U=x;for(let B=0,V=N.length;B<V;B++){let z=N[B],W=y(z,A),K=x%b,Q=K%W.boundary,ae=K+Q;x+=Q,ae!==0&&b-ae<W.storage&&(x+=b-ae),B===0&&(U=x),x+=W.storage}let F=D.type==="int"?Int32Array:D.type==="uint"?Uint32Array:Float32Array;D.__data=new F((x-U)/Float32Array.BYTES_PER_ELEMENT),D.__offset=U}}let S=x%b;return S>0&&(x+=b-S),M.__size=x,M.__cache={},this}function y(M,E){let x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=16,x.storage=48):M.isMatrix4?(x.boundary=16,x.storage=64):M.isTexture?Ye("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(x.boundary=16,x.storage=M.byteLength):Ye("WebGLRenderer: Unsupported uniform value type.",M),E===!0&&(x.boundary=16,x.storage=Math.ceil(x.storage/16)*16),x}function g(M){let E=M.target;E.removeEventListener("dispose",g),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function p(){for(let M in s)i.deleteBuffer(s[M]);s={},r={}}return{bind:o,update:a,dispose:p}}var U8=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Zn=null;function O8(){return Zn===null&&(Zn=new Fr(U8,16,16,Ni,en),Zn.name="DFG_LUT",Zn.minFilter=un,Zn.magFilter=un,Zn.wrapS=kn,Zn.wrapT=kn,Zn.generateMipmaps=!1,Zn.needsUpdate=!0),Zn}var Jl=class{constructor(e={}){let{canvas:t=nd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=fn}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;let y=f,g=new Set([pl,fl,dl]),p=new Set([fn,Bn,Ks,ss,cl,hl]),M=new Uint32Array(4),E=new Int32Array(4),x={textures:[],min:[],max:[],resolution:[]},b=null,S=null,_=[],v=[],P=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=qn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,C=!1,D=null,N=null,A=null,U=null;this._outputColorSpace=xn;let F=0,B=0,V=null,z=-1,W=null,K=new It,Q=new It,ae=null,k=new ue(0),re=0,ce=t.width,Ce=t.height,he=1,Ne=null,et=null,Le=new It(0,0,ce,Ce),oe=new It(0,0,ce,Ce),ye=!1,$=new wi,le=new Da,de=!1,Ie=!1,Me=new Ze,Ke=new I,ze=new It,ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ut=!1;function _t(){return V===null?he:1}let G=n;function Ot(R,H){return t.getContext(R,H)}let at,wt,we,Nt,Xe,Je,L,w,Y,fe,se,ve,Re,ee,ne,be,O,ie,j,Se,ge,Ee,Ve;try{let R={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"187"}`),t.addEventListener("webglcontextlost",We,!1),t.addEventListener("webglcontextrestored",tt,!1),t.addEventListener("webglcontextcreationerror",De,!1),G===null){let H="webgl2";if(G=Ot(H,R),G===null)throw Ot(H)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}it()}catch(R){throw t.removeEventListener("webglcontextlost",We,!1),t.removeEventListener("webglcontextrestored",tt,!1),t.removeEventListener("webglcontextcreationerror",De,!1),qe("WebGLRenderer: "+R.message),R}function it(){at=new q4(G),at.init(),ge=new C8(G,at),wt=new O4(G,at,e,ge),we=new R8(G,at),wt.reversedDepthBuffer&&d&&we.buffers.depth.setReversed(!0),N=G.createFramebuffer(),A=G.createFramebuffer(),U=G.createFramebuffer(),Nt=new J4(G),Xe=new f8,Je=new A8(G,at,we,Xe,wt,ge,Nt),L=new Y4(T),w=new j3(G),Ee=new N4(G,w),Y=new Z4(G,w,Nt,Ee),fe=new j4(G,Y,w,Ee,Nt),ie=new $4(G,wt,Je),ne=new F4(Xe),se=new d8(T,L,at,wt,Ee,ne),ve=new D8(T,Xe),Re=new m8,ee=new v8(at),O=new D4(T,L,we,fe,m,l),be=new w8(T,fe,wt),Ve=new N8(G,Nt,wt,we),j=new U4(G,at,Nt),Se=new K4(G,at,Nt),Nt.programs=se.programs,T.capabilities=wt,T.extensions=at,T.properties=Xe,T.renderLists=Re,T.shadowMap=be,T.state=we,T.info=Nt}y!==fn&&(P=new eg(y,t.width,t.height,a,s,r));let pe=new J1(T,G);this.xr=pe,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){let R=at.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){let R=at.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return he},this.setPixelRatio=function(R){R!==void 0&&(he=R,this.setSize(ce,Ce,!1))},this.getSize=function(R){return R.set(ce,Ce)},this.setSize=function(R,H,J=!0){if(pe.isPresenting){Ye("WebGLRenderer: Can't change size while VR device is presenting.");return}ce=R,Ce=H,t.width=Math.floor(R*he),t.height=Math.floor(H*he),J===!0&&(t.style.width=R+"px",t.style.height=H+"px"),P!==null&&P.setSize(t.width,t.height),this.setViewport(0,0,R,H)},this.getDrawingBufferSize=function(R){return R.set(ce*he,Ce*he).floor()},this.setDrawingBufferSize=function(R,H,J){ce=R,Ce=H,he=J,t.width=Math.floor(R*J),t.height=Math.floor(H*J),this.setViewport(0,0,R,H)},this.setEffects=function(R){if(y===fn){qe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(R){for(let H=0;H<R.length;H++)if(R[H].isOutputPass===!0){Ye("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}P.setEffects(R||[])},this.getCurrentViewport=function(R){return R.copy(K)},this.getViewport=function(R){return R.copy(Le)},this.setViewport=function(R,H,J,X){R.isVector4?Le.set(R.x,R.y,R.z,R.w):Le.set(R,H,J,X),we.viewport(K.copy(Le).multiplyScalar(_t()).round())},this.getScissor=function(R){return R.copy(oe)},this.setScissor=function(R,H,J,X){R.isVector4?oe.set(R.x,R.y,R.z,R.w):oe.set(R,H,J,X),we.scissor(Q.copy(oe).multiplyScalar(_t()).round())},this.getScissorTest=function(){return ye},this.setScissorTest=function(R){we.setScissorTest(ye=R)},this.setOpaqueSort=function(R){Ne=R},this.setTransparentSort=function(R){et=R},this.getClearColor=function(R){return R.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor(...arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha(...arguments)},this.clear=function(R=!0,H=!0,J=!0){let X=0;if(R){let q=!1;if(V!==null){let Ae=V.texture.format;q=g.has(Ae)}if(q){let Ae=V.texture.type,Fe=p.has(Ae),Te=O.getClearColor(),Ue=O.getClearAlpha(),Ge=Te.r,je=Te.g,dt=Te.b;Fe?(M[0]=Ge,M[1]=je,M[2]=dt,M[3]=Ue,G.clearBufferuiv(G.COLOR,0,M)):(E[0]=Ge,E[1]=je,E[2]=dt,E[3]=Ue,G.clearBufferiv(G.COLOR,0,E))}else X|=G.COLOR_BUFFER_BIT}H&&(X|=G.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),J&&(X|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&G.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(R){R.setRenderer(this),D=R},this.dispose=function(){t.removeEventListener("webglcontextlost",We,!1),t.removeEventListener("webglcontextrestored",tt,!1),t.removeEventListener("webglcontextcreationerror",De,!1),O.dispose(),Re.dispose(),ee.dispose(),Je.dispose(),Xe.dispose(),L.dispose(),fe.dispose(),Y.dispose(),Ee.dispose(),Ve.dispose(),se.dispose(),pe.dispose(),pe.removeEventListener("sessionstart",Ah),pe.removeEventListener("sessionend",Ch),Gi.stop()};function We(R){R.preventDefault(),Cr("WebGLRenderer: Context Lost."),C=!0}function tt(){Cr("WebGLRenderer: Context Restored."),C=!1;let R=Nt.autoReset,H=be.enabled,J=be.autoUpdate,X=be.needsUpdate,q=be.type;it(),Nt.autoReset=R,be.enabled=H,be.autoUpdate=J,be.needsUpdate=X,be.type=q}function De(R){qe("WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function St(R){let H=R.target;H.removeEventListener("dispose",St),qt(H)}function qt(R){yi(R),Xe.remove(R)}function yi(R){let H=Xe.get(R).programs;H!==void 0&&(H.forEach(function(J){se.releaseProgram(J)}),R.isShaderMaterial&&se.releaseShaderCache(R))}this.renderBufferDirect=function(R,H,J,X,q,Ae){H===null&&(H=ht);let Fe=q.isMesh&&q.matrixWorld.determinantAffine()<0,Te=Ep(R,H,J,X,q);we.setMaterial(X,Fe);let Ue=J.index,Ge=1;if(X.wireframe===!0){if(Ue=Y.getWireframeAttribute(J),Ue===void 0)return;Ge=2}let je=J.drawRange,dt=J.attributes.position,Be=je.start*Ge,ft=(je.start+je.count)*Ge;Ae!==null&&(Be=Math.max(Be,Ae.start*Ge),ft=Math.min(ft,(Ae.start+Ae.count)*Ge)),Ue!==null?(Be=Math.max(Be,0),ft=Math.min(ft,Ue.count)):dt!=null&&(Be=Math.max(Be,0),ft=Math.min(ft,dt.count));let Ft=ft-Be;if(Ft<0||Ft===1/0)return;Ee.setup(q,X,Te,J,Ue);let At,Rt=j;if(Ue!==null&&(At=w.get(Ue),Rt=Se,Rt.setIndex(At)),q.isMesh)X.wireframe===!0?(we.setLineWidth(X.wireframeLinewidth*_t()),Rt.setMode(G.LINES)):Rt.setMode(G.TRIANGLES);else if(q.isLine){let nn=X.linewidth;nn===void 0&&(nn=1),we.setLineWidth(nn*_t()),q.isLineSegments?Rt.setMode(G.LINES):q.isLineLoop?Rt.setMode(G.LINE_LOOP):Rt.setMode(G.LINE_STRIP)}else q.isPoints?Rt.setMode(G.POINTS):q.isSprite&&Rt.setMode(G.TRIANGLES);if(q.isBatchedMesh)if(at.get("WEBGL_multi_draw"))Rt.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{let nn=q._multiDrawStarts,He=q._multiDrawCounts,ln=q._multiDrawCount,Mt=Ue?w.get(Ue).bytesPerElement:1,ki=Xe.get(X).currentProgram.getUniforms();for(let sn=0;sn<ln;sn++)ki.setValue(G,"_gl_DrawID",sn),Rt.render(nn[sn]/Mt,He[sn])}else if(q.isInstancedMesh)Rt.renderInstances(Be,Ft,q.count);else if(J.isInstancedBufferGeometry){let nn=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,He=Math.min(J.instanceCount,nn);Rt.renderInstances(Be,Ft,He)}else Rt.render(Be,Ft)};function Rh(R,H,J,X){D!==null&&R.isNodeMaterial&&D.setObject(X,R),de===!0&&ne.setState(R,J,!1),R.transparent===!0&&R.side===Ht&&R.forceSinglePass===!1?(R.side=Qt,R.needsUpdate=!0,lr(R,H,X),R.side=Di,R.needsUpdate=!0,lr(R,H,X),R.side=Ht):lr(R,H,X)}this.compile=function(R,H,J=null){J===null&&(J=R),D!==null&&D.renderStart(R,H,J),S=ee.get(J),S.init(H),v.push(S),J.traverseVisible(function(q){q.isLight&&q.layers.test(H.layers)&&(S.pushLight(q),q.castShadow&&S.pushShadow(q))}),R!==J&&R.traverseVisible(function(q){q.isLight&&q.layers.test(H.layers)&&(S.pushLight(q),q.castShadow&&S.pushShadow(q))}),S.setupLights(),D!==null&&D.updateLights(S.state.lightsArray),Ie=this.localClippingEnabled,de=ne.init(this.clippingPlanes,Ie),de===!0&&ne.setGlobalState(this.clippingPlanes,H),D!==null&&be.render(S.state.shadowsArray,J,H);let X=new Set;return R.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;let Ae=q.material;if(Ae)if(Array.isArray(Ae))for(let Fe=0;Fe<Ae.length;Fe++){let Te=Ae[Fe];Rh(Te,J,H,q),X.add(Te)}else Rh(Ae,J,H,q),X.add(Ae)}),S=v.pop(),D!==null&&D.renderEnd(),X},this.compileAsync=function(R,H,J=null){let X=this.compile(R,H,J);return new Promise(q=>{function Ae(){if(X.forEach(function(Fe){let Ue=Xe.get(Fe).currentProgram;(Ue===void 0||Ue.isReady())&&X.delete(Fe)}),X.size===0){q(R);return}setTimeout(Ae,10)}at.get("KHR_parallel_shader_compile")!==null?Ae():setTimeout(Ae,10)})};let Tc=null;function Mp(R){Tc&&Tc(R)}function Ah(){Gi.stop()}function Ch(){Gi.start()}let Gi=new Ud;Gi.setAnimationLoop(Mp),typeof self!="undefined"&&Gi.setContext(self),this.setAnimationLoop=function(R){Tc=R,pe.setAnimationLoop(R),R===null?Gi.stop():Gi.start()},pe.addEventListener("sessionstart",Ah),pe.addEventListener("sessionend",Ch),this.render=function(R,H){if(H!==void 0&&H.isCamera!==!0){qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;D!==null&&D.renderStart(R,H);let J=pe.enabled===!0&&pe.isPresenting===!0,X=P!==null&&(V===null||J)&&P.begin(T,V);if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),pe.enabled===!0&&pe.isPresenting===!0&&(P===null||P.isCompositing()===!1)&&(pe.cameraAutoUpdate===!0&&pe.updateCamera(H),H=pe.getCamera()),R.isScene===!0&&R.onBeforeRender(T,R,H,V),S=ee.get(R,v.length),S.init(H),S.state.textureUnits=Je.getTextureUnits(),v.push(S),Me.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),H.isArrayCamera?le.setFromArrayCamera(H):$.setFromProjectionMatrix(Me,wn,H.reversedDepth),Ie=this.localClippingEnabled,de=ne.init(this.clippingPlanes,Ie),b=Re.get(R,_.length),b.init(),_.push(b),this.info.render.frame++,pe.enabled===!0&&pe.isPresenting===!0){let Fe=T.xr.getDepthSensingMesh();Fe!==null&&wc(Fe,H,-1/0,T.sortObjects)}wc(R,H,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(S.state.lightsArray),T.sortObjects===!0&&b.sort(Ne,et),ut=pe.enabled===!1||pe.isPresenting===!1||pe.hasDepthSensing()===!1,ut&&O.addToRenderList(b,R),this.info.autoReset===!0&&this.info.reset(),de===!0&&ne.beginShadows();let q=S.state.shadowsArray;if(be.render(q,R,H),de===!0&&ne.endShadows(),(X&&P.hasRenderPass())===!1){let Fe=b.opaque,Te=b.transmissive;if(S.setupLights(),H.isArrayCamera){let Ue=H.cameras;if(Te.length>0)for(let Ge=0,je=Ue.length;Ge<je;Ge++){let dt=Ue[Ge];Ih(Fe,Te,R,dt)}ut&&O.render(R);for(let Ge=0,je=Ue.length;Ge<je;Ge++){let dt=Ue[Ge];Ph(b,R,dt,dt.viewport)}}else Te.length>0&&Ih(Fe,Te,R,H),ut&&O.render(R),Ph(b,R,H)}V!==null&&B===0&&(Je.updateMultisampleRenderTarget(V),Je.updateRenderTargetMipmap(V)),X&&P.end(T),R.isScene===!0&&R.onAfterRender(T,R,H),Ee.resetDefaultState(),z=-1,W=null,v.pop(),v.length>0?(S=v[v.length-1],Je.setTextureUnits(S.state.textureUnits),de===!0&&ne.setGlobalState(T.clippingPlanes,S.state.camera)):S=null,_.pop(),_.length>0?b=_[_.length-1]:b=null,D!==null&&D.renderEnd()};function wc(R,H,J,X){if(R.visible===!1)return;if(R.layers.test(H.layers)){if(R.isGroup)J=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(H);else if(R.isLight)S.pushLight(R),R.castShadow&&S.pushShadow(R);else if(R.isSprite){let Fe=H.isArrayCamera?le:$;if(!R.frustumCulled||R.intersectsFrustum(Fe)){X&&ze.setFromMatrixPosition(R.matrixWorld).applyMatrix4(Me);let Te=fe.update(R),Ue=R.material;Ue.visible&&b.push(R,Te,Ue,J,ze.z,null,H)}}else if(R.isMesh||R.isLine||R.isPoints){let Fe=H.isArrayCamera?le:$;if(!R.frustumCulled||R.intersectsFrustum(Fe)){let Te=fe.update(R),Ue=R.material;if(X&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),ze.copy(R.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),ze.copy(Te.boundingSphere.center)),ze.applyMatrix4(R.matrixWorld).applyMatrix4(Me)),Array.isArray(Ue)){let Ge=Te.groups;for(let je=0,dt=Ge.length;je<dt;je++){let Be=Ge[je],ft=Ue[Be.materialIndex];ft&&ft.visible&&b.push(R,Te,ft,J,ze.z,Be,H)}}else Ue.visible&&b.push(R,Te,Ue,J,ze.z,null,H)}}}let Ae=R.children;for(let Fe=0,Te=Ae.length;Fe<Te;Fe++)wc(Ae[Fe],H,J,X)}function Ph(R,H,J,X){let{opaque:q,transmissive:Ae,transparent:Fe}=R;S.setupLightsView(J),de===!0&&ne.setGlobalState(T.clippingPlanes,J),X&&we.viewport(K.copy(X)),q.length>0&&zo(q,H,J),Ae.length>0&&zo(Ae,H,J),Fe.length>0&&zo(Fe,H,J),we.buffers.depth.setTest(!0),we.buffers.depth.setMask(!0),we.buffers.color.setMask(!0),we.setPolygonOffset(!1)}function Ih(R,H,J,X){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[X.id]===void 0){let Be=at.has("EXT_color_buffer_half_float")||at.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[X.id]=new Vt(1,1,{generateMipmaps:!0,type:Be?en:fn,minFilter:di,samples:Math.max(4,wt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:lt.workingColorSpace})}let Ae=S.state.transmissionRenderTarget[X.id],Fe=X.viewport||K;Ae.setSize(Fe.z*T.transmissionResolutionScale,Fe.w*T.transmissionResolutionScale);let Te=T.getRenderTarget(),Ue=T.getActiveCubeFace(),Ge=T.getActiveMipmapLevel();T.setRenderTarget(Ae),T.getClearColor(k),re=T.getClearAlpha(),re<1&&T.setClearColor(16777215,.5),T.clear(),ut&&O.render(J);let je=T.toneMapping;T.toneMapping=qn;let dt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),S.setupLightsView(X),de===!0&&ne.setGlobalState(T.clippingPlanes,X),zo(R,J,X),Je.updateMultisampleRenderTarget(Ae),Je.updateRenderTargetMipmap(Ae),at.has("WEBGL_multisampled_render_to_texture")===!1){let Be=!1;for(let ft=0,Ft=H.length;ft<Ft;ft++){let At=H[ft],{object:Rt,geometry:nn,material:He,group:ln}=At;if(He.side===Ht&&Rt.layers.test(X.layers)){let Mt=He.side;He.side=Qt,He.needsUpdate=!0,Lh(Rt,J,X,nn,He,ln),He.side=Mt,He.needsUpdate=!0,Be=!0}}Be===!0&&(Je.updateMultisampleRenderTarget(Ae),Je.updateRenderTargetMipmap(Ae))}T.setRenderTarget(Te,Ue,Ge),T.setClearColor(k,re),dt!==void 0&&(X.viewport=dt),T.toneMapping=je}function zo(R,H,J){let X=H.isScene===!0?H.overrideMaterial:null;for(let q=0,Ae=R.length;q<Ae;q++){let Fe=R[q],{object:Te,geometry:Ue,group:Ge}=Fe,je=Fe.material;je.allowOverride===!0&&X!==null&&(je=X),Te.layers.test(J.layers)&&Lh(Te,H,J,Ue,je,Ge)}}function Lh(R,H,J,X,q,Ae){D!==null&&q.isNodeMaterial&&D.setObject(R,q),R.onBeforeRender(T,H,J,X,q,Ae),R.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),q.onBeforeRender(T,H,J,X,R,Ae),q.transparent===!0&&q.side===Ht&&q.forceSinglePass===!1?(q.side=Qt,q.needsUpdate=!0,T.renderBufferDirect(J,H,X,q,R,Ae),q.side=Di,q.needsUpdate=!0,T.renderBufferDirect(J,H,X,q,R,Ae),q.side=Ht):T.renderBufferDirect(J,H,X,q,R,Ae),R.onAfterRender(T,H,J,X,q,Ae)}function Dh(R){let H=0;for(let J of R)J.texture!==null&&H++;return H}function lr(R,H,J){H.isScene!==!0&&(H=ht);let X=Xe.get(R),q=S.state.lights,Ae=S.state.shadowsArray,Fe=q.state.version,Te=se.getParameters(R,q.state,Ae,H,J,S.state.lightProbeGridArray),Ue=se.getProgramCacheKey(Te),Ge=X.programs;X.environment=R.isMeshStandardMaterial||R.isMeshLambertMaterial||R.isMeshPhongMaterial?H.environment:null,X.fog=H.fog;let je=R.isMeshStandardMaterial||R.isMeshLambertMaterial&&!R.envMap||R.isMeshPhongMaterial&&!R.envMap;X.envMap=L.get(R.envMap||X.environment,je),X.envMapRotation=X.environment!==null&&R.envMap===null?H.environmentRotation:R.envMapRotation,Ge===void 0&&(R.addEventListener("dispose",St),Ge=new Map,X.programs=Ge,X.programVariants=new Map);let dt=Ge.get(Ue);if(dt!==void 0){if(X.currentProgram===dt&&X.lightsStateVersion===Fe)return Uh(R,Te),dt}else Te.uniforms=se.getUniforms(R),D!==null&&R.isNodeMaterial&&D.build(R,J,Te),R.onBeforeCompile(Te,T),dt=se.acquireProgram(Te,Ue),Ge.set(Ue,dt),X.uniforms=Te.uniforms;let Be=X.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Be.clippingPlanes=ne.uniform),Uh(R,Te),X.needsLights=Sp(R),X.lightsStateVersion=Fe,X.needsLights&&(Be.ambientLightColor.value=q.state.ambient,Be.lightProbe.value=q.state.probe,Be.sunLights.value=q.state.sun,Be.sunLightShadows.value=q.state.sunShadow,Be.directionalLights.value=q.state.directional,Be.directionalLightShadows.value=q.state.directionalShadow,Be.spotLights.value=q.state.spot,Be.spotLightShadows.value=q.state.spotShadow,Be.rectAreaLights.value=q.state.rectArea,Be.ltc_1.value=q.state.rectAreaLTC1,Be.ltc_2.value=q.state.rectAreaLTC2,Be.pointLights.value=q.state.point,Be.pointLightShadows.value=q.state.pointShadow,Be.hemisphereLights.value=q.state.hemi,Be.sunShadowMatrix.value=q.state.sunShadowMatrix,Be.sunShadowCascade.value=q.state.sunShadowCascade,Be.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Be.spotLightMatrix.value=q.state.spotLightMatrix,Be.spotLightMap.value=q.state.spotLightMap,Be.pointShadowMatrix.value=q.state.pointShadowMatrix),X.numLightProbeGrids=Dh(S.state.lightProbeGridArray),X.currentProgram=dt,X.uniformsList=null,dt}function vp(R,H,J,X,q){let Ae=Xe.get(R),Fe=Ae.currentProgram.id+","+X+","+q,Te=Ae.programVariants.get(Fe);return Te===void 0?(Te=lr(R,H,J),Ae.programVariants.set(Fe,Te)):(Ae.currentProgram=Te,Ae.uniformsList=null,Ae.outputColorSpace=X,Ae.toneMapping=q),Te}function Nh(R){if(R.uniformsList===null){let H=R.currentProgram.getUniforms();R.uniformsList=Js.seqWithValue(H.seq,R.uniforms)}return R.uniformsList}function Uh(R,H){let J=Xe.get(R);J.outputColorSpace=H.outputColorSpace,J.batching=H.batching,J.batchingColor=H.batchingColor,J.instancing=H.instancing,J.instancingColor=H.instancingColor,J.instancingMorph=H.instancingMorph,J.skinning=H.skinning,J.morphTargets=H.morphTargets,J.morphNormals=H.morphNormals,J.morphColors=H.morphColors,J.morphTargetsCount=H.morphTargetsCount,J.numClippingPlanes=H.numClippingPlanes,J.numIntersection=H.numClipIntersection,J.vertexAlphas=H.vertexAlphas,J.vertexTangents=H.vertexTangents,J.toneMapping=H.toneMapping}function Ep(R,H,J,X,q){H.isScene!==!0&&(H=ht),Je.resetTextureUnits();let Ae=H.fog,Fe=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?H.environment:null,Te=V===null?T.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:lt.workingColorSpace,Ue=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,Ge=L.get(X.envMap||Fe,Ue),je=X.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,dt=!!J.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Be=!!J.morphAttributes.position,ft=!!J.morphAttributes.normal,Ft=!!J.morphAttributes.color,At=qn;X.toneMapped&&(V===null||V.isXRRenderTarget===!0)&&(At=T.toneMapping);let Rt=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,nn=Rt!==void 0?Rt.length:0,He=Xe.get(X),ln=S.state.lights;if(de===!0&&(Ie===!0||R!==W)){let Lt=R===W&&X.id===z;ne.setState(X,R,Lt)}let Mt=!1,ki=!1;X.version===He.__version?He.needsLights&&He.lightsStateVersion!==ln.state.version||q.isBatchedMesh&&He.batching===!1||!q.isBatchedMesh&&He.batching===!0||q.isBatchedMesh&&He.batchingColor===!0&&q._colorsTexture===null||q.isBatchedMesh&&He.batchingColor===!1&&q._colorsTexture!==null||q.isInstancedMesh&&He.instancing===!1||!q.isInstancedMesh&&He.instancing===!0||q.isSkinnedMesh&&He.skinning===!1||!q.isSkinnedMesh&&He.skinning===!0||q.isInstancedMesh&&He.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&He.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&He.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&He.instancingMorph===!1&&q.morphTexture!==null||He.envMap!==Ge||X.fog===!0&&He.fog!==Ae||He.numClippingPlanes!==void 0&&(He.numClippingPlanes!==ne.numPlanes||He.numIntersection!==ne.numIntersection)||He.vertexAlphas!==je||He.vertexTangents!==dt||He.morphTargets!==Be||He.morphNormals!==ft||He.morphColors!==Ft||He.morphTargetsCount!==nn||He.numLightProbeGrids!==Dh(S.state.lightProbeGridArray)?Mt=!0:(He.outputColorSpace!==Te||He.toneMapping!==At)&&(ki=!0):(Mt=!0,He.__version=X.version);let sn=He.currentProgram;(Mt===!0||ki===!0)&&(sn=ki===!0?vp(X,H,q,Te,At):lr(X,H,q),D&&X.isNodeMaterial&&D.onUpdateProgram(X,sn,He));let Go=!1,Mi=!1,Vi=!1,gt=sn.getUniforms(),jt=He.uniforms;if(we.useProgram(sn.program)&&(Go=!0,Mi=!0,Vi=!0),X.id!==z&&(z=X.id,Mi=!0),Go||W!==R){we.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),gt.setValue(G,"projectionMatrix",R.projectionMatrix),gt.setValue(G,"viewMatrix",R.matrixWorldInverse);let Zt=gt.map.cameraPosition;Zt!==void 0&&Zt.setValue(G,Ke.setFromMatrixPosition(R.matrixWorld)),wt.logarithmicDepthBuffer&&gt.setValue(G,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&gt.setValue(G,"isOrthographic",R.isOrthographicCamera===!0),W!==R&&(W=R,Mi=!0,Vi=!0)}if(He.needsLights&&(ln.state.sunShadowMap.length>0&&gt.setValue(G,"sunShadowMap",ln.state.sunShadowMap,Je),ln.state.directionalShadowMap.length>0&&gt.setValue(G,"directionalShadowMap",ln.state.directionalShadowMap,Je),ln.state.spotShadowMap.length>0&&gt.setValue(G,"spotShadowMap",ln.state.spotShadowMap,Je),ln.state.pointShadowMap.length>0&&gt.setValue(G,"pointShadowMap",ln.state.pointShadowMap,Je)),q.isSkinnedMesh){gt.setOptional(G,q,"bindMatrix"),gt.setOptional(G,q,"bindMatrixInverse");let Lt=q.skeleton;Lt&&(Lt.boneTexture===null&&Lt.computeBoneTexture(),gt.setValue(G,"boneTexture",Lt.boneTexture,Je))}q.isBatchedMesh&&(gt.setOptional(G,q,"batchingTexture"),gt.setValue(G,"batchingTexture",q._matricesTexture,Je),gt.setOptional(G,q,"batchingIdTexture"),gt.setValue(G,"batchingIdTexture",q._indirectTexture,Je),gt.setOptional(G,q,"batchingColorTexture"),q._colorsTexture!==null&&gt.setValue(G,"batchingColorTexture",q._colorsTexture,Je));let Ln=J.morphAttributes;if((Ln.position!==void 0||Ln.normal!==void 0||Ln.color!==void 0)&&ie.update(q,J,sn),(Mi||He.receiveShadow!==q.receiveShadow)&&(He.receiveShadow=q.receiveShadow,gt.setValue(G,"receiveShadow",q.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&H.environment!==null&&(jt.envMapIntensity.value=H.environmentIntensity),jt.dfgLUT!==void 0&&(jt.dfgLUT.value=O8()),Mi){if(gt.setValue(G,"toneMappingExposure",T.toneMappingExposure),He.needsLights&&bp(jt,Vi),Ae&&X.fog===!0&&ve.refreshFogUniforms(jt,Ae),ve.refreshMaterialUniforms(jt,X,he,Ce,S.state.transmissionRenderTarget[R.id]),He.needsLights&&He.numLightProbeGrids>0){let Lt=x,Zt=0;for(let $n of S.state.lightProbeGridArray)$n.texture!==null&&(Lt.textures[Zt]=$n.texture,Lt.min[Zt]=$n.boundingBox.min,Lt.max[Zt]=$n.boundingBox.max,Lt.resolution[Zt]=$n.resolution,Zt++);for(let $n in Lt)Lt[$n].length=Zt;jt.probesSH.value=Lt.textures,jt.probesMin.value=Lt.min,jt.probesMax.value=Lt.max,jt.probesResolution.value=Lt.resolution}Js.upload(G,Nh(He),jt,Je)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Js.upload(G,Nh(He),jt,Je),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&gt.setValue(G,"center",q.center),gt.setValue(G,"modelViewMatrix",q.modelViewMatrix),gt.setValue(G,"normalMatrix",q.normalMatrix),gt.setValue(G,"modelMatrix",q.matrixWorld),X.uniformsGroups!==void 0){let Lt=X.uniformsGroups;for(let Zt=0,$n=Lt.length;Zt<$n;Zt++){let Fh=Lt[Zt];Ve.update(Fh,sn),Ve.bind(Fh,sn)}}return sn}function bp(R,H){R.ambientLightColor.needsUpdate=H,R.lightProbe.needsUpdate=H,R.sunLights.needsUpdate=H,R.sunLightShadows.needsUpdate=H,R.directionalLights.needsUpdate=H,R.directionalLightShadows.needsUpdate=H,R.pointLights.needsUpdate=H,R.pointLightShadows.needsUpdate=H,R.spotLights.needsUpdate=H,R.spotLightShadows.needsUpdate=H,R.rectAreaLights.needsUpdate=H,R.hemisphereLights.needsUpdate=H}function Sp(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return V},this.setRenderTargetTextures=function(R,H,J){let X=Xe.get(R);X.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),Xe.get(R.texture).__webglTexture=H,Xe.get(R.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:J,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,H){let J=Xe.get(R);J.__webglFramebuffer=H,J.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(R,H=0,J=0){V=R,F=H,B=J;let X=null,q=!1,Ae=!1;if(R){let Te=Xe.get(R);if(Te.__useDefaultFramebuffer!==void 0){we.bindFramebuffer(G.FRAMEBUFFER,Te.__webglFramebuffer),K.copy(R.viewport),Q.copy(R.scissor),ae=R.scissorTest,we.viewport(K),we.scissor(Q),we.setScissorTest(ae),z=-1;return}else if(Te.__webglFramebuffer===void 0)Je.setupRenderTarget(R);else if(Te.__hasExternalTextures)Je.rebindTextures(R,Xe.get(R.texture).__webglTexture,Xe.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){let je=R.depthTexture;if(Te.__boundDepthTexture!==je){if(je!==null&&Xe.has(je)&&(R.width!==je.image.width||R.height!==je.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Je.setupDepthRenderbuffer(R)}}let Ue=R.texture;(Ue.isData3DTexture||Ue.isDataArrayTexture||Ue.isCompressedArrayTexture)&&(Ae=!0);let Ge=Xe.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Ge[H])?X=Ge[H][J]:X=Ge[H],q=!0):R.samples>0&&Je.useMultisampledRTT(R)===!1?X=Xe.get(R).__webglMultisampledFramebuffer:Array.isArray(Ge)?X=Ge[J]:X=Ge,K.copy(R.viewport),Q.copy(R.scissor),ae=R.scissorTest}else K.copy(Le).multiplyScalar(he).floor(),Q.copy(oe).multiplyScalar(he).floor(),ae=ye;if(J!==0&&(X=N),we.bindFramebuffer(G.FRAMEBUFFER,X)&&we.drawBuffers(R,X),we.viewport(K),we.scissor(Q),we.setScissorTest(ae),q){let Te=Xe.get(R.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+H,Te.__webglTexture,J)}else if(Ae){let Te=H;for(let Ue=0;Ue<R.textures.length;Ue++){let Ge=Xe.get(R.textures[Ue]);G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0+Ue,Ge.__webglTexture,J,Te)}}else if(R!==null&&J!==0){let Te=Xe.get(R.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,Te.__webglTexture,J)}z=-1};function Oh(R){let H=Xe.get(R);return(H.__readFormat!==R.format||H.__readType!==R.type)&&(H.__readFormat=R.format,H.__readType=R.type,H.__formatReadable=wt.textureFormatReadable(R.format),H.__typeReadable=wt.textureTypeReadable(R.type)),H}this.readRenderTargetPixels=function(R,H,J,X,q,Ae,Fe,Te=0){if(!(R&&R.isWebGLRenderTarget)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ue=Xe.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Fe!==void 0&&(Ue=Ue[Fe],Array.isArray(Ue)&&(Ue=Ue[0])),Ue){we.bindFramebuffer(G.FRAMEBUFFER,Ue);try{let Ge=R.textures[Te],je=Ge.format,dt=Ge.type;R.textures.length>1&&G.readBuffer(G.COLOR_ATTACHMENT0+Te);let Be=Oh(Ge);if(Be.__formatReadable===!1){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Be.__typeReadable===!1){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=R.width-X&&J>=0&&J<=R.height-q&&G.readPixels(H,J,X,q,ge.convert(je),ge.convert(dt),Ae)}finally{let Ge=V!==null?Xe.get(V).__webglFramebuffer:null;we.bindFramebuffer(G.FRAMEBUFFER,Ge)}}},this.readRenderTargetPixelsAsync=async function(R,H,J,X,q,Ae,Fe,Te=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ue=Xe.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Fe!==void 0&&(Ue=Ue[Fe],Array.isArray(Ue)&&(Ue=Ue[0])),Ue)if(H>=0&&H<=R.width-X&&J>=0&&J<=R.height-q){we.bindFramebuffer(G.FRAMEBUFFER,Ue);let Ge=R.textures[Te],je=Ge.format,dt=Ge.type;R.textures.length>1&&G.readBuffer(G.COLOR_ATTACHMENT0+Te);let Be=Oh(Ge);if(Be.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Be.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ft=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,ft),G.bufferData(G.PIXEL_PACK_BUFFER,Ae.byteLength,G.STREAM_READ),G.readPixels(H,J,X,q,ge.convert(je),ge.convert(dt),0),G.bindBuffer(G.PIXEL_PACK_BUFFER,null);let Ft=V!==null?Xe.get(V).__webglFramebuffer:null;we.bindFramebuffer(G.FRAMEBUFFER,Ft);let At=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await sd(G,At,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,ft),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,Ae),G.bindBuffer(G.PIXEL_PACK_BUFFER,null),G.deleteBuffer(ft),G.deleteSync(At),Ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,H=null,J=0){let X=Math.pow(2,-J),q=Math.floor(R.image.width*X),Ae=Math.floor(R.image.height*X),Fe=H!==null?H.x:0,Te=H!==null?H.y:0;Je.setTexture2D(R,0),G.copyTexSubImage2D(G.TEXTURE_2D,J,0,0,Fe,Te,q,Ae),we.unbindTexture()},this.copyTextureToTexture=function(R,H,J=null,X=null,q=0,Ae=0){let Fe,Te,Ue,Ge,je,dt,Be,ft,Ft,At=R.isCompressedTexture?R.mipmaps[Ae]:R.image;if(J!==null)Fe=J.max.x-J.min.x,Te=J.max.y-J.min.y,Ue=J.isBox3?J.max.z-J.min.z:1,Ge=J.min.x,je=J.min.y,dt=J.isBox3?J.min.z:0;else{let gt=Math.pow(2,-q);Fe=Math.floor(At.width*gt),Te=Math.floor(At.height*gt),R.isDataArrayTexture?Ue=At.depth:R.isData3DTexture?Ue=Math.floor(At.depth*gt):Ue=1,Ge=0,je=0,dt=0}X!==null?(Be=X.x,ft=X.y,Ft=X.z):(Be=0,ft=0,Ft=0);let Rt=ge.convert(H.format),nn=ge.convert(H.type),He;H.isData3DTexture?(Je.setTexture3D(H,0),He=G.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(Je.setTexture2DArray(H,0),He=G.TEXTURE_2D_ARRAY):(Je.setTexture2D(H,0),He=G.TEXTURE_2D),we.activeTexture(G.TEXTURE0),we.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,H.flipY),we.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),we.pixelStorei(G.UNPACK_ALIGNMENT,H.unpackAlignment);let ln=we.getParameter(G.UNPACK_ROW_LENGTH),Mt=we.getParameter(G.UNPACK_IMAGE_HEIGHT),ki=we.getParameter(G.UNPACK_SKIP_PIXELS),sn=we.getParameter(G.UNPACK_SKIP_ROWS),Go=we.getParameter(G.UNPACK_SKIP_IMAGES);we.pixelStorei(G.UNPACK_ROW_LENGTH,At.width),we.pixelStorei(G.UNPACK_IMAGE_HEIGHT,At.height),we.pixelStorei(G.UNPACK_SKIP_PIXELS,Ge),we.pixelStorei(G.UNPACK_SKIP_ROWS,je),we.pixelStorei(G.UNPACK_SKIP_IMAGES,dt);let Mi=R.isDataArrayTexture||R.isData3DTexture,Vi=H.isDataArrayTexture||H.isData3DTexture;if(R.isDepthTexture){let gt=Xe.get(R),jt=Xe.get(H),Ln=Xe.get(gt.__renderTarget),Lt=Xe.get(jt.__renderTarget);we.bindFramebuffer(G.READ_FRAMEBUFFER,Ln.__webglFramebuffer),we.bindFramebuffer(G.DRAW_FRAMEBUFFER,Lt.__webglFramebuffer);for(let Zt=0;Zt<Ue;Zt++)Mi&&(G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Xe.get(R).__webglTexture,q,dt+Zt),G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Xe.get(H).__webglTexture,Ae,Ft+Zt)),G.blitFramebuffer(Ge,je,Ge+Fe,je+Te,Be,ft,Be+Fe,ft+Te,G.DEPTH_BUFFER_BIT,G.NEAREST);we.bindFramebuffer(G.READ_FRAMEBUFFER,null),we.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else if(q!==0||R.isRenderTargetTexture||Xe.has(R)){let gt=Xe.get(R),jt=Xe.get(H);we.bindFramebuffer(G.READ_FRAMEBUFFER,A),we.bindFramebuffer(G.DRAW_FRAMEBUFFER,U);for(let Ln=0;Ln<Ue;Ln++)Mi?G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,gt.__webglTexture,q,dt+Ln):G.framebufferTexture2D(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,gt.__webglTexture,q),Vi?G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,jt.__webglTexture,Ae,Ft+Ln):G.framebufferTexture2D(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,jt.__webglTexture,Ae),q!==0?G.blitFramebuffer(Ge,je,Ge+Fe,je+Te,Be,ft,Be+Fe,ft+Te,G.COLOR_BUFFER_BIT,G.NEAREST):Vi?G.copyTexSubImage3D(He,Ae,Be,ft,Ft+Ln,Ge,je,Fe,Te):G.copyTexSubImage2D(He,Ae,Be,ft,Ge,je,Fe,Te);we.bindFramebuffer(G.READ_FRAMEBUFFER,null),we.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else Vi?R.isDataTexture||R.isData3DTexture?G.texSubImage3D(He,Ae,Be,ft,Ft,Fe,Te,Ue,Rt,nn,At.data):H.isCompressedArrayTexture?G.compressedTexSubImage3D(He,Ae,Be,ft,Ft,Fe,Te,Ue,Rt,At.data):G.texSubImage3D(He,Ae,Be,ft,Ft,Fe,Te,Ue,Rt,nn,At):R.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,Ae,Be,ft,Fe,Te,Rt,nn,At.data):R.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,Ae,Be,ft,At.width,At.height,Rt,At.data):G.texSubImage2D(G.TEXTURE_2D,Ae,Be,ft,Fe,Te,Rt,nn,At);we.pixelStorei(G.UNPACK_ROW_LENGTH,ln),we.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Mt),we.pixelStorei(G.UNPACK_SKIP_PIXELS,ki),we.pixelStorei(G.UNPACK_SKIP_ROWS,sn),we.pixelStorei(G.UNPACK_SKIP_IMAGES,Go),Ae===0&&H.generateMipmaps===!0&&H.mipmapsAutoUpdate===!0&&G.generateMipmap(He),we.unbindTexture()},this.initRenderTarget=function(R){Xe.get(R).__webglFramebuffer===void 0&&Je.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?Je.setTextureCube(R,0):R.isData3DTexture?Je.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?Je.setTexture2DArray(R,0):Je.setTexture2D(R,0),we.unbindTexture()},this.resetState=function(){F=0,B=0,V=null,we.reset(),Ee.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=lt._getDrawingBufferColorSpace(e),t.unpackColorSpace=lt._getUnpackColorSpace()}};function F8(){return{gen_utc:new Date().toISOString(),zones:[{id:"gaming",name:"FLUX Gaming",status:"active",activity:.9},{id:"quant",name:"FLUX Quant",status:"dormant",activity:.15},{id:"media",name:"FLUX Media",status:"dormant",activity:.4}],fleet:[{id:"bm-a",cores:32,online:!0,current_task:"cityweb dev"},{id:"bm-b",cores:16,online:!1,current_task:"idle"},{id:"bm-c",cores:32,online:!1,current_task:"idle"},{id:"BG-A",cores:16,online:!1,current_task:"idle"},{id:"BG-B",cores:8,online:!1,current_task:"idle"},{id:"BG-C",cores:16,online:!1,current_task:"idle"}],census_total:10114,reality:{city_day_phase:"night",beijing_hhmm:new Date().toTimeString().substring(0,5),weather_kind:"clear",weather_temp_c:"16",season:"autumn"},city:{games_total:34,games_active:9,commits_total:47093,renders_total:105,fleet_online:1},events_tail:[{ts_utc:"",type:"COMMIT",zone:"gaming",summary:"demo data"},{ts_utc:"",type:"CEO_ORDER",zone:"governance",summary:"demo data"},{ts_utc:"",type:"GAME_STAGE",zone:"gaming",summary:"demo data"}]}}function Yd(){var i;return(i=window.CITY_DATA)!=null?i:F8()}function Ao(){return!!window.CITY_DATA}function Zd(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new mt;l.morphTargetsRelative=a;let c=0;for(let h=0;h<i.length;++h){let u=i[h],d=0,f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let m in u.attributes){if(!n.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;r[m]===void 0&&(r[m]=[]),r[m].push(u.attributes[m]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let m in u.morphAttributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;if(u.morphAttributes[m].length!==i[0].morphAttributes[m].length)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have the same number of morph targets for the "'+m+'" morph attribute.'),null;o[m]===void 0&&(o[m]=[]),o[m].push(u.morphAttributes[m]),f++}if(f!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of morph attributes."),null;if(e){let m;if(t)m=u.index.count;else if(u.attributes.position!==void 0)m=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,m,h),c+=m}}if(t){let h=0,u=[];for(let d=0;d<i.length;++d){let f=i[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=qd(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let y=0;y<o[h].length;++y)f.push(o[h][y][d]);let m=qd(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}}return l}function qd(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new Ut(o,t,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<t;m++){let y=h.getComponent(d,m);a.setComponent(d+u,m,y)}}else o.set(h.array,l);l+=h.count*t}return s!==void 0&&(a.gpuType=s),a}var B8=111320*Math.cos(31.243*(Math.PI/180));function zt(i){return(i-121.495)*B8}function Gt(i){return-(i-31.243)*110540}function $1(i){return{x:zt(i.lon),z:Gt(i.lat)}}var me={data:new ue(6220500),capital:new ue(16498468),traffic:new ue(16020150),warn:new ue(16281969),ceo:new ue(16777215),brain:new ue(6333946)},En={gaming:me.data,quant:me.capital,media:me.traffic,governance:me.brain};var Ql=(i,e,t,n,s,r,o,a,l,c,h,u,d)=>({skyTop:new ue(i),skyBottom:new ue(e),fog:new ue(t),sunColor:new ue(n),sunIntensity:s,hemiSky:new ue(r),hemiGround:new ue(o),hemiIntensity:a,windowGain:l,starOpacity:c,streetGain:h,bodyGain:u,groundColor:new ue(d)}),Co=Ql(263694,66e4,329743,9348808,.32,1713206,329484,.5,1,.9,.12,.6,395794),H8=Ql(1845836,13208178,6969970,16763296,1.4,3820140,1316896,.7,.6,.35,.7,.9,2896454),Kd=Ql(7314644,13229038,11058386,16773852,2.2,8691908,3752532,.78,.45,0,1,1.45,4016737),z8=Ql(3024720,12743743,8014408,16757611,1.5,3945560,1578016,.75,.85,.4,.45,1,2367274),j1=[{h:0,p:Co},{h:4.5,p:Co},{h:6.5,p:H8},{h:8.5,p:Kd},{h:16,p:Kd},{h:18,p:z8},{h:20,p:Co},{h:24,p:Co}],os=new ue;function G8(i,e,t){return{skyTop:os.copy(i.skyTop).lerp(e.skyTop,t).clone(),skyBottom:os.copy(i.skyBottom).lerp(e.skyBottom,t).clone(),fog:os.copy(i.fog).lerp(e.fog,t).clone(),sunColor:os.copy(i.sunColor).lerp(e.sunColor,t).clone(),sunIntensity:i.sunIntensity+(e.sunIntensity-i.sunIntensity)*t,hemiSky:os.copy(i.hemiSky).lerp(e.hemiSky,t).clone(),hemiGround:os.copy(i.hemiGround).lerp(e.hemiGround,t).clone(),hemiIntensity:i.hemiIntensity+(e.hemiIntensity-i.hemiIntensity)*t,windowGain:i.windowGain+(e.windowGain-i.windowGain)*t,starOpacity:i.starOpacity+(e.starOpacity-i.starOpacity)*t,streetGain:i.streetGain+(e.streetGain-i.streetGain)*t,bodyGain:i.bodyGain+(e.bodyGain-i.bodyGain)*t,groundColor:os.copy(i.groundColor).lerp(e.groundColor,t).clone()}}function Jd(i){for(let e=0;e<j1.length-1;e++){let t=j1[e],n=j1[e+1];if(i>=t.h&&i<=n.h){let s=(i-t.h)/(n.h-t.h);return G8(t.p,n.p,s)}}return Co}function $d(i){return i>=5&&i<7?"\u6668":i>=7&&i<17?"\u663C":i>=17&&i<19.5?"\u9EC4\u660F":"\u591C"}var jd=[{name:"\u4E0A\u6D77\u73AF\u7403\u91D1\u878D\u4E2D\u5FC3",h:492,ring:[[31.2368214,121.502698],[31.2368319,121.5028363],[31.2368477,121.5030457],[31.2368601,121.5032097],[31.236869,121.5033275],[31.2367679,121.503338],[31.2366289,121.5033524],[31.2363323,121.5033831],[31.2363059,121.503035],[31.2362942,121.5028799],[31.2362936,121.5028721],[31.2362846,121.5027536],[31.236385,121.5027432],[31.2365247,121.5027287],[31.2368214,121.502698]],region:"lujiazui"},{name:"\u6E2F\u52A1\u5927\u53A6",h:19.2,ring:[[31.2423995,121.493158],[31.2421684,121.4934802],[31.2422058,121.4935169],[31.2421738,121.4935616],[31.2422094,121.4935965],[31.2422133,121.4936469],[31.2422461,121.494085],[31.242216,121.4941255],[31.2422555,121.4941655],[31.2422177,121.4942164],[31.2424979,121.4945005],[31.2425218,121.4944682],[31.2425325,121.494479],[31.2426697,121.4942939],[31.242409,121.4940295],[31.2423812,121.4936303],[31.2425967,121.4933299],[31.242463,121.4931986],[31.2424539,121.4932114],[31.2423995,121.493158]],region:"lujiazui"},{name:"21\u4E16\u7EAA\u5927\u53A6",h:210,ring:[[31.2364771,121.5056988],[31.2366032,121.5052721],[31.2362373,121.5051307],[31.236116,121.5055602],[31.2364771,121.5056988]],region:"lujiazui"},{name:"\u592A\u5E73\u91D1\u878D\u5927\u53A6",h:238,ring:[[31.2363421,121.4991479],[31.2359154,121.4992162],[31.2358538,121.4986888],[31.2362805,121.4986206],[31.2363421,121.4991479]],region:"lujiazui"},{name:"",h:16,ring:[[31.2407782,121.49744],[31.2406821,121.4973702],[31.2406709,121.4973626],[31.2405921,121.4973091],[31.2404998,121.4975911],[31.240306,121.498183],[31.2402382,121.4983824],[31.2402058,121.4984778],[31.2402555,121.4985111],[31.2400893,121.4989353],[31.2401452,121.4989675],[31.2403135,121.4985502],[31.2404367,121.4982661],[31.2407263,121.4975655],[31.2407782,121.49744]],region:"lujiazui"},{name:"\u9EC4\u91D1\u7F6E\u5730\u5927\u53A6",h:144,ring:[[31.2424833,121.5007512],[31.2427307,121.5011159],[31.2424141,121.5014098],[31.2421667,121.501045],[31.2424833,121.5007512]],region:"lujiazui"},{name:"\u661F\u5C55\u94F6\u884C\u5927\u53A6",h:90,ring:[[31.2442305,121.4985639],[31.2438704,121.4988993],[31.2439493,121.4990152],[31.2441451,121.4993027],[31.2445051,121.4989673],[31.2442305,121.4985639]],region:"lujiazui"},{name:"\u4E2D\u94F6\u5927\u53A6",h:19.2,ring:[[31.2406569,121.4994175],[31.2409495,121.4987024],[31.2404319,121.4984127],[31.2401393,121.4991278],[31.2406569,121.4994175]],region:"lujiazui"},{name:"\u6C47\u4E30\u94F6\u884C\u5927\u697C",h:249.9,ring:[[31.2383687,121.4969947],[31.2385174,121.4970617],[31.2386851,121.4970556],[31.2388111,121.4968659],[31.2388064,121.4966621],[31.2387192,121.4965816],[31.238421,121.496595],[31.2383598,121.496822],[31.2383687,121.4969947]],region:"lujiazui"},{name:"\u9707\u65E6\u56FD\u9645\u5927\u697C",h:185,ring:[[31.2363137,121.4950827],[31.2363596,121.4950532],[31.2364146,121.4950264],[31.2364903,121.4950103],[31.2365637,121.4950156],[31.2366371,121.4950371],[31.2367057,121.4950728],[31.2367859,121.4951532],[31.2367293,121.4952255],[31.2367269,121.4953291],[31.2367855,121.4953357],[31.2367781,121.4954259],[31.2367168,121.495419],[31.2367121,121.4954765],[31.2366559,121.4954702],[31.236651,121.4955296],[31.2365044,121.4955132],[31.2363924,121.4955006],[31.2363969,121.4954458],[31.2363396,121.4954394],[31.2363444,121.4953804],[31.2362771,121.4953728],[31.2362863,121.4952609],[31.2363538,121.4952684],[31.2363603,121.4951894],[31.2363137,121.4950827]],region:"lujiazui"},{name:"\u62DB\u5546\u94F6\u884C\u4E0A\u6D77\u5927\u53A6",h:230,ring:[[31.2444528,121.5017133],[31.2443956,121.5016906],[31.2441423,121.5018547],[31.2440482,121.5019157],[31.2440216,121.5019677],[31.2441578,121.5022341],[31.2442096,121.5022524],[31.2445502,121.5020219],[31.2445743,121.5019547],[31.2444528,121.5017133]],region:"lujiazui"},{name:"\u4E0A\u6D77\u4FE1\u606F\u5927\u697C",h:131.2,ring:[[31.237305,121.5064875],[31.2375258,121.5058148],[31.2375968,121.5058467],[31.2377792,121.5059286],[31.2375584,121.5066013],[31.2375454,121.5066352],[31.2375225,121.5066487],[31.2374858,121.506654],[31.2372817,121.5065521],[31.237305,121.5064875]],region:"lujiazui"},{name:"\u62DB\u5546\u5C40\u5927\u53A6",h:168,ring:[[31.2398128,121.5047062],[31.2395074,121.5048983],[31.2393122,121.5044737],[31.2396177,121.5042817],[31.2398128,121.5047062]],region:"lujiazui"},{name:"\u4E2D\u56FD\u8239\u8236\u5927\u53A6",h:96,ring:[[31.2405585,121.5067488],[31.2407292,121.5063861],[31.2408989,121.5063231],[31.2409492,121.5065084],[31.2407865,121.506903],[31.2406176,121.506966],[31.2405585,121.5067488]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2375406,121.4971564],[31.2374455,121.4971277],[31.2374288,121.4972033],[31.2372713,121.4971557],[31.237205,121.4974557],[31.2373638,121.4975036],[31.2373418,121.4976033],[31.2374357,121.4976317],[31.2375406,121.4971564]],region:"lujiazui"},{name:"\u4E0A\u6D77\u56FD\u91D1\u6C47",h:69,ring:[[31.2377114,121.4980986],[31.2374581,121.4985748],[31.2371462,121.498834],[31.2370693,121.4988979],[31.2369775,121.498737],[31.237317,121.4984822],[31.2373835,121.498399],[31.2375876,121.4980155],[31.2377114,121.4980986]],region:"lujiazui"},{name:"",h:9.6,ring:[[31.2420732,121.4970271],[31.2420125,121.496954],[31.2418393,121.4967455],[31.241704,121.496732],[31.2416375,121.4967589],[31.2415618,121.4966999],[31.241571,121.496606],[31.2416444,121.496555],[31.2417099,121.4966167],[31.2418921,121.4966221],[31.2421397,121.4969359],[31.2421685,121.4969359],[31.2422213,121.4970003],[31.2421994,121.4971022],[31.2421214,121.4970968],[31.2420732,121.4970271]],region:"lujiazui"},{name:"",h:16,ring:[[31.237245,121.5029527],[31.2372181,121.5030491],[31.2371539,121.5032711],[31.2371308,121.5033511],[31.2371237,121.5033755],[31.2371173,121.5033977],[31.2370882,121.5034991],[31.2370723,121.5035547],[31.2370284,121.5037075],[31.2369955,121.5038222],[31.2368762,121.5038276],[31.2368781,121.5038727],[31.2368276,121.5038727],[31.236823,121.5037654],[31.2358763,121.5038115],[31.235764,121.5039054],[31.2357612,121.503929],[31.2356653,121.5039295],[31.2356626,121.5038888],[31.2356282,121.5037681],[31.235697,121.5037439],[31.2356649,121.5035481],[31.235514,121.50298],[31.2354608,121.5029607],[31.2354176,121.50298],[31.2353644,121.5027783],[31.2353832,121.502752],[31.2354149,121.5028642],[31.2356396,121.5029232],[31.2356241,121.5028486],[31.2358919,121.5029098],[31.2360502,121.5029017],[31.2362942,121.5028799],[31.2363323,121.5033831],[31.236869,121.5033275],[31.2368319,121.5028363],[31.2369492,121.5028266],[31.2372501,121.5025911],[31.2372822,121.5026179],[31.2369836,121.5028829],[31.2370157,121.502958],[31.2371077,121.5029296],[31.237179,121.5029076],[31.237245,121.5029527]],region:"lujiazui"},{name:"\u4E0A\u6D77\u4E2D\u5FC3\u5927\u53A6",h:632,ring:[[31.2354993,121.5007275],[31.2354319,121.5007601],[31.2353455,121.500802],[31.2353243,121.5008716],[31.2352592,121.500846],[31.2352198,121.5009721],[31.235189,121.5011559],[31.2351902,121.5013239],[31.2351991,121.501398],[31.2352127,121.5014697],[31.2352433,121.5016027],[31.2352732,121.501674],[31.2353027,121.5017446],[31.2353453,121.5017848],[31.2353988,121.501806],[31.2354427,121.5017965],[31.235488,121.5017866],[31.2355247,121.5017632],[31.2355784,121.5017289],[31.2356876,121.5016592],[31.2358244,121.5015721],[31.2359357,121.5014693],[31.2360115,121.5013968],[31.2360492,121.5013308],[31.2360316,121.5012621],[31.2360155,121.5012357],[31.2359839,121.5011838],[31.2358859,121.5010465],[31.235698,121.5008579],[31.2356117,121.5007998],[31.2354993,121.5007275]],region:"lujiazui"},{name:"\u5BCC\u58EB\u5EB7\u5927\u53A6",h:67.2,ring:[[31.2438192,121.4979239],[31.2433524,121.4983626],[31.2436019,121.4987258],[31.2440687,121.4982873],[31.2438192,121.4979239]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2448528,121.5014048],[31.2443956,121.5016906],[31.2441423,121.5018547],[31.2440624,121.5016901],[31.2447405,121.5012078],[31.2451228,121.5009581],[31.2451624,121.5010588],[31.2451487,121.5011097],[31.2451058,121.5011913],[31.2449767,121.5013055],[31.2448528,121.5014048]],region:"lujiazui"},{name:"\u62DB\u5546\u94F6\u884C\u4E0A\u6D77\u5927\u53A6\u5317\u5854",h:19.2,ring:[[31.2451228,121.5009581],[31.2447405,121.5012078],[31.2445889,121.500938],[31.2448541,121.5007531],[31.2449262,121.5007369],[31.2449917,121.5007531],[31.2450399,121.5008095],[31.2451228,121.5009581]],region:"lujiazui"},{name:"\u519C\u94F6\u5927\u53A6",h:216,ring:[[31.2444381,121.503965],[31.2445091,121.504422],[31.2445139,121.5044526],[31.2440445,121.5045524],[31.244021,121.5044012],[31.2439916,121.5042124],[31.2439687,121.5040648],[31.2444381,121.503965]],region:"lujiazui"},{name:"\u4E2D\u56FD\u4EBA\u6C11\u94F6\u884C\u5927\u53A6",h:64,ring:[[31.2400935,121.505473],[31.2402242,121.5053987],[31.2402793,121.5054148],[31.2403283,121.5055194],[31.2404919,121.5055894],[31.2406464,121.5054929],[31.2404214,121.504975],[31.2403114,121.5049374],[31.2398821,121.505186],[31.2399949,121.5054363],[31.2400935,121.505473]],region:"lujiazui"},{name:"\u5EFA\u884C\u5927\u53A6",h:216,ring:[[31.2445895,121.5049461],[31.244129,121.505064],[31.2441951,121.5054174],[31.2442218,121.5055601],[31.2446823,121.5054423],[31.2445895,121.5049461]],region:"lujiazui"},{name:"",h:16,ring:[[31.236729,121.5005013],[31.2378938,121.5004637],[31.237981,121.5004959],[31.2379867,121.5006282],[31.2379259,121.5007802],[31.2378479,121.5009251],[31.2373312,121.5009521],[31.237167,121.5009526],[31.2366786,121.5009787],[31.236729,121.5005013]],region:"lujiazui"},{name:"\u9999\u683C\u91CC\u62C9\u9152\u5E97",h:144,ring:[[31.2378929,121.4944554],[31.237686,121.4939719],[31.2373893,121.4941457],[31.2374569,121.4943035],[31.2375963,121.4946291],[31.2378704,121.4944687],[31.2378929,121.4944554]],region:"lujiazui"},{name:"\u9999\u683C\u91CC\u62C9\u9152\u5E97",h:137.6,ring:[[31.2382869,121.4956961],[31.2382674,121.4955039],[31.2380335,121.4956912],[31.2380404,121.4957731],[31.2379921,121.4957719],[31.2377905,121.4957673],[31.2378677,121.4959385],[31.238213,121.4959212],[31.2382053,121.4957647],[31.2382869,121.4956961]],region:"lujiazui"},{name:"\u745E\u82D1\u516C\u5BD3",h:112,ring:[[31.2419336,121.5069575],[31.2420696,121.5069057],[31.242037,121.5067884],[31.242084,121.5067705],[31.2420638,121.5066981],[31.2420189,121.5067152],[31.2419728,121.50655],[31.2420188,121.5065325],[31.2419974,121.5064557],[31.2419487,121.5064743],[31.2419209,121.5063743],[31.2417855,121.5064259],[31.2419336,121.5069575]],region:"lujiazui"},{name:"\u91D1\u7816\u5927\u53A6",h:200,ring:[[31.2354241,121.4993402],[31.2353608,121.4987131],[31.2348684,121.4987811],[31.2349316,121.4994081],[31.2354241,121.4993402]],region:"lujiazui"},{name:"\u91D1\u8302\u5927\u53A6",h:420.5,ring:[[31.2373315,121.5010725],[31.2373316,121.5011126],[31.2374952,121.5011121],[31.2374957,121.5013071],[31.2375309,121.501307],[31.2376763,121.5013064],[31.2376767,121.5014957],[31.2375313,121.5014963],[31.2374957,121.5014964],[31.2374962,121.5016802],[31.2373325,121.5016807],[31.2373326,121.5017119],[31.2373331,121.5018868],[31.2371696,121.5018873],[31.2371691,121.5017124],[31.237169,121.5016808],[31.2370089,121.5016813],[31.2370084,121.5014971],[31.2369732,121.5014972],[31.2368243,121.5014978],[31.2368238,121.5013064],[31.2370084,121.5013058],[31.2370079,121.5011131],[31.2371674,121.5011126],[31.2371673,121.501073],[31.237167,121.5009526],[31.2373312,121.5009521],[31.2373315,121.5010725]],region:"lujiazui"},{name:"\u4E0A\u6D77\u6D77\u6D0B\u6C34\u65CF\u9986",h:10,ring:[[31.2426086,121.4977593],[31.243054,121.4973315],[31.2426841,121.4968045],[31.2422386,121.4972324],[31.2424413,121.497521],[31.2426086,121.4977593]],region:"lujiazui"},{name:"\u56FD\u91D1\u4E2D\u5FC3\u4E8C\u671F",h:259.9,ring:[[31.2389307,121.4976093],[31.2388329,121.4978362],[31.2388808,121.4979923],[31.2391414,121.4981185],[31.2393018,121.4979161],[31.2393649,121.4977432],[31.2393058,121.4976277],[31.2391444,121.4975282],[31.2390198,121.4974878],[31.2389307,121.4976093]],region:"lujiazui"},{name:"\u8FEA\u58EB\u5C3C\u65D7\u8230\u5E97",h:6.4,ring:[[31.2400412,121.4948451],[31.2405397,121.494523],[31.2406607,121.494751],[31.2404058,121.4950137],[31.24042,121.4950318],[31.2404339,121.4950524],[31.2404443,121.4950751],[31.2404515,121.4950993],[31.2404546,121.4951196],[31.240456,121.4951435],[31.2404021,121.4951429],[31.240391,121.4951069],[31.2403736,121.4950726],[31.2403588,121.4950498],[31.2403347,121.4950241],[31.2403035,121.4950041],[31.2402761,121.4949925],[31.2402424,121.4949849],[31.2402125,121.4949852],[31.2401817,121.4949914],[31.2401541,121.4950035],[31.2401306,121.4950181],[31.2400995,121.495047],[31.2400774,121.4950745],[31.2400585,121.4951093],[31.2400438,121.4951461],[31.2400353,121.4951904],[31.2399886,121.4951892],[31.2399935,121.4951465],[31.2400069,121.4951014],[31.2400329,121.4950503],[31.2400561,121.4950186],[31.2400799,121.4949929],[31.2401058,121.4949696],[31.2400412,121.4948451]],region:"lujiazui"},{name:"\u4E1C\u4E9A\u94F6\u884C\u91D1\u878D\u5927\u53A6",h:197.7,ring:[[31.2363792,121.4978458],[31.2362655,121.4979148],[31.2360145,121.4980673],[31.2359888,121.4980829],[31.2359149,121.4979694],[31.2359353,121.4979556],[31.2358777,121.4978574],[31.235854,121.4978774],[31.2357754,121.4977518],[31.2361251,121.497464],[31.2361935,121.4975614],[31.2361086,121.4976351],[31.2361946,121.4977827],[31.2363139,121.4977196],[31.2363792,121.4978458]],region:"lujiazui"},{name:"\u56FD\u5BFF\u4E2D\u5FC3\u5927\u53A6",h:238,ring:[[31.242635,121.5068169],[31.2425347,121.5062971],[31.2428998,121.5062006],[31.2430003,121.5067204],[31.242635,121.5068169]],region:"lujiazui"},{name:"\u5DE5\u94F6\u5927\u53A6",h:256,ring:[[31.2429606,121.5051862],[31.2425171,121.5053072],[31.2426272,121.5058596],[31.2428206,121.5058069],[31.2430707,121.5057387],[31.2429606,121.5051862]],region:"lujiazui"},{name:"\u82B1\u65D7\u96C6\u56E2\u5927\u53A6",h:134.4,ring:[[31.2359498,121.4953934],[31.236624,121.4962974],[31.2362088,121.4967571],[31.2357866,121.4962124],[31.2355121,121.495856],[31.2358355,121.4955153],[31.2359498,121.4953934]],region:"lujiazui"},{name:"\u4E0A\u6D77\u56FD\u91D1\u4E2D\u5FC3\u5546\u573A",h:22.4,ring:[[31.2388111,121.4968659],[31.2388275,121.4971242],[31.2388473,121.4972226],[31.2388811,121.4973071],[31.2389303,121.4973931],[31.238971,121.4974498],[31.2390198,121.4974878],[31.2389307,121.4976093],[31.2388329,121.4978362],[31.2388808,121.4979923],[31.2387817,121.4982595],[31.2389686,121.4983517],[31.2388705,121.498592],[31.2388304,121.4985694],[31.2388035,121.4986495],[31.2387899,121.4986977],[31.2387744,121.4987454],[31.2387197,121.4989292],[31.2386601,121.4989748],[31.2385175,121.4989171],[31.238466,121.4988963],[31.2384236,121.49888],[31.2380342,121.4987301],[31.2378735,121.498866],[31.2378039,121.4988285],[31.2377426,121.4989066],[31.2374581,121.4985748],[31.2377114,121.4980986],[31.2378182,121.4978777],[31.2378047,121.4972386],[31.2378693,121.4971266],[31.2383741,121.497098],[31.2383687,121.4969947],[31.2385174,121.4970617],[31.2386851,121.4970556],[31.2388111,121.4968659]],region:"lujiazui"},{name:"29 - 30 phase \u2161",h:70,ring:[[31.2325021,121.5018695],[31.2324577,121.5019023],[31.2324764,121.5019351],[31.2324075,121.5019802],[31.2324192,121.5019938],[31.2323724,121.5020403],[31.2324028,121.502084],[31.2324308,121.502058],[31.232446,121.5020731],[31.232446,121.5021031],[31.2324554,121.5021209],[31.2324857,121.5021277],[31.2325245,121.5022005],[31.232557,121.5022616],[31.2325512,121.5022821],[31.2325582,121.5023189],[31.232592,121.502323],[31.232592,121.502364],[31.232564,121.5023695],[31.2325722,121.502431],[31.2326236,121.5024118],[31.2326282,121.5024228],[31.2326645,121.5024118],[31.2326504,121.5023435],[31.2326868,121.5023309],[31.2327115,121.502404],[31.2327572,121.5023857],[31.2327456,121.5023432],[31.2327656,121.5023339],[31.2327673,121.5022706],[31.2327517,121.5022581],[31.2327189,121.5021162],[31.2326914,121.5021303],[31.2326216,121.5020049],[31.2326377,121.501986],[31.2325673,121.5018888],[31.2325579,121.5018966],[31.2325378,121.5018763],[31.2325211,121.5018904],[31.2325021,121.5018695]],region:"lujiazui"},{name:"28 - 27 phase \u2161",h:70,ring:[[31.2327844,121.50257],[31.2327342,121.5025523],[31.2327252,121.5025903],[31.232651,121.5025589],[31.2326498,121.5025781],[31.2325892,121.5025673],[31.2325808,121.5026227],[31.2326159,121.5026305],[31.2326162,121.5026538],[31.2325968,121.5026734],[31.2325914,121.5026933],[31.2326069,121.5027246],[31.232567,121.5028753],[31.23255,121.5028835],[31.2325307,121.5029139],[31.2325502,121.5029465],[31.2325238,121.5029733],[31.2325019,121.5029521],[31.2324675,121.5029996],[31.2325135,121.5030325],[31.2325095,121.5030438],[31.2325403,121.5030686],[31.2325752,121.5030115],[31.2326072,121.5030354],[31.2325762,121.5031051],[31.2326179,121.5031335],[31.2326378,121.5030955],[31.2326569,121.503107],[31.2326989,121.503067],[31.2326967,121.5030451],[31.232767,121.5029232],[31.2327398,121.5029081],[31.2327753,121.5027643],[31.232798,121.5027662],[31.2328147,121.5026403],[31.2328035,121.5026371],[31.2328035,121.502606],[31.2327834,121.5026004],[31.2327844,121.50257]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2387963,121.5073161],[31.2387102,121.5073723],[31.2389282,121.5078293],[31.2390143,121.5077731],[31.2387963,121.5073161]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2390482,121.5078546],[31.2389622,121.5079107],[31.2391802,121.5083677],[31.2392663,121.5083115],[31.2390482,121.5078546]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.238574,121.5074571],[31.238488,121.5075132],[31.238706,121.5079703],[31.2387921,121.5079141],[31.238574,121.5074571]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2388348,121.5079963],[31.2387488,121.5080524],[31.2389668,121.5085095],[31.2390529,121.5084533],[31.2388348,121.5079963]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2373056,121.5086791],[31.2373917,121.5086231],[31.2372271,121.5082776],[31.237141,121.5083337],[31.2373056,121.5086791]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2375005,121.5085451],[31.2375866,121.508489],[31.2374221,121.5081436],[31.237336,121.5081997],[31.2375005,121.5085451]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2370938,121.5087765],[31.2371846,121.5087318],[31.2370751,121.5084277],[31.2369843,121.5084724],[31.2370938,121.5087765]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2378027,121.5079088],[31.2377167,121.5079651],[31.2378136,121.5081723],[31.2378996,121.508116],[31.2378027,121.5079088]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2392641,121.5096617],[31.2391778,121.509693],[31.239316,121.510213],[31.2394039,121.510181],[31.2393869,121.510117],[31.2394168,121.5101062],[31.2394004,121.5100445],[31.2393705,121.5100553],[31.2393427,121.5099505],[31.2393716,121.50994],[31.2393562,121.5098821],[31.2393263,121.509893],[31.2392957,121.5097778],[31.2393208,121.5097686],[31.2393078,121.5097197],[31.239282,121.5097291],[31.2392641,121.5096617]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2394365,121.5102993],[31.2393523,121.5103305],[31.2394466,121.5106796],[31.239533,121.5106477],[31.2395168,121.5105877],[31.2395455,121.5105771],[31.2395295,121.5105179],[31.2394995,121.510529],[31.2394685,121.5104142],[31.2394935,121.510405],[31.2394805,121.5103568],[31.2394547,121.5103664],[31.2394365,121.5102993]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2392043,121.5094224],[31.2391146,121.5094563],[31.2391612,121.5096248],[31.2392509,121.5095909],[31.2392043,121.5094224]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2396692,121.5102085],[31.2395849,121.5102397],[31.2396793,121.5105889],[31.2397657,121.5105569],[31.2397495,121.5104969],[31.2397782,121.5104863],[31.2397622,121.5104271],[31.2397321,121.5104382],[31.2397012,121.5103235],[31.2397262,121.5103142],[31.2397132,121.510266],[31.2396873,121.5102756],[31.2396692,121.5102085]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2395786,121.5098439],[31.2394843,121.5098796],[31.239343,121.50937],[31.2394374,121.5093342],[31.2395786,121.5098439]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2395993,121.5099143],[31.2394992,121.5099516],[31.2395438,121.5101152],[31.2396439,121.5100778],[31.2395993,121.5099143]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2397783,121.5096542],[31.2396784,121.5096918],[31.2397731,121.5100363],[31.2398731,121.5099987],[31.2397783,121.5096542]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2399043,121.5101166],[31.2398044,121.5101542],[31.2398991,121.5104987],[31.2399991,121.5104612],[31.2399043,121.5101166]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2396559,121.5092241],[31.239556,121.5092619],[31.239647,121.5095903],[31.2397469,121.5095524],[31.2396559,121.5092241]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2400017,121.5095818],[31.2399019,121.5096197],[31.2399929,121.5099481],[31.2400928,121.5099102],[31.2400017,121.5095818]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2398714,121.5091163],[31.2397715,121.5091542],[31.2398625,121.5094826],[31.2399624,121.5094447],[31.2398714,121.5091163]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2400524,121.5100487],[31.2399528,121.5100876],[31.2400308,121.5103613],[31.2401304,121.5103225],[31.2400524,121.5100487]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.240277,121.5100873],[31.240177,121.5101246],[31.2402216,121.5102882],[31.2403216,121.5102509],[31.240277,121.5100873]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2402364,121.5096571],[31.2401365,121.5096949],[31.2402275,121.5100233],[31.2403274,121.5099854],[31.2402364,121.5096571]],region:"lujiazui"},{name:"\u56FD\u91D1\u4E2D\u5FC32\u671F",h:115.2,ring:[[31.2402802,121.5095059],[31.2401859,121.5095417],[31.2400446,121.5090321],[31.240139,121.5089962],[31.2402802,121.5095059]],region:"lujiazui"},{name:"\u5916\u6EE9\u4E2D\u5FC3",h:198.9,ring:[[31.2347138,121.4827882],[31.2348155,121.4832519],[31.2343787,121.4833829],[31.234277,121.4829191],[31.2347138,121.4827882]],region:"bund_edge"},{name:"\u5973\u9752\u5E74\u4F1A\u5927\u697C",h:25.6,ring:[[31.2438506,121.4836037],[31.2435849,121.4836459],[31.2435713,121.4835062],[31.2437166,121.4834836],[31.2437085,121.4834007],[31.2435623,121.4834158],[31.2435511,121.4832911],[31.2436436,121.4832771],[31.2438148,121.4832512],[31.2438348,121.483444],[31.2438506,121.4836037]],region:"bund_edge"},{name:"\u54C8\u5BC6\u5927\u697C",h:22.4,ring:[[31.2440599,121.4835669],[31.2438506,121.4836037],[31.2438348,121.483444],[31.2440442,121.4834174],[31.2440599,121.4835669]],region:"bund_edge"},{name:"\u4E0A\u6D77\u56FD\u9645\u4F1A\u8BAE\u4E2D\u5FC3",h:19.2,ring:[[31.2418856,121.4930859],[31.241866,121.4930444],[31.2420128,121.4929532],[31.2419053,121.4928455],[31.2419456,121.4928458],[31.2419853,121.4928378],[31.2420249,121.492821],[31.2420612,121.492796],[31.2421172,121.4927291],[31.2421419,121.4926743],[31.2421553,121.4926144],[31.2421526,121.4925209],[31.2421328,121.4924548],[31.2420992,121.4923969],[31.2420678,121.4923627],[31.2419969,121.4923192],[31.2419175,121.4923065],[31.2418724,121.4923139],[31.2418293,121.4923314],[31.2417944,121.4923549],[31.2417651,121.4922907],[31.2418754,121.4922145],[31.24171,121.4919956],[31.2415381,121.4918454],[31.2413661,121.4917489],[31.241196,121.4917047],[31.2411503,121.4916355],[31.2410936,121.4915956],[31.2410069,121.4915818],[31.2409431,121.4916025],[31.2408892,121.4916475],[31.2408518,121.4917111],[31.2408351,121.4917861],[31.2408414,121.4918632],[31.240864,121.4919228],[31.2409212,121.4920493],[31.2415507,121.493306],[31.2418856,121.4930859]],region:"bund_edge"},{name:"\u6E2F\u52A1\u5927\u53A6",h:19.2,ring:[[31.2423995,121.493158],[31.2421684,121.4934802],[31.2422058,121.4935169],[31.2421738,121.4935616],[31.2422094,121.4935965],[31.2422133,121.4936469],[31.2422461,121.494085],[31.242216,121.4941255],[31.2422555,121.4941655],[31.2422177,121.4942164],[31.2424979,121.4945005],[31.2425218,121.4944682],[31.2425325,121.494479],[31.2426697,121.4942939],[31.242409,121.4940295],[31.2423812,121.4936303],[31.2425967,121.4933299],[31.242463,121.4931986],[31.2424539,121.4932114],[31.2423995,121.493158]],region:"bund_edge"},{name:"\u60A6\u56ED\u5546\u53A6",h:28.8,ring:[[31.2307883,121.4862999],[31.2311461,121.4863213],[31.231247,121.4864608],[31.231247,121.4867612],[31.2307792,121.4867398],[31.2307883,121.4862999]],region:"bund_edge"},{name:"",h:64,ring:[[31.2390705,121.4918927],[31.239223,121.4920849],[31.2392335,121.4920735],[31.239263,121.4921106],[31.2394336,121.4919256],[31.2394038,121.4918881],[31.2394905,121.4917941],[31.239351,121.4916182],[31.2392846,121.4916903],[31.2392479,121.491644],[31.2390752,121.4918314],[31.2390991,121.4918616],[31.2390705,121.4918927]],region:"bund_edge"},{name:"\u6D66\u6C5F\u6865\u96A7\u8FD0\u8425\u7BA1\u7406\u6709\u9650\u516C\u53F8\u5EF6\u4E1C\u5206\u516C\u53F8",h:38.4,ring:[[31.239107,121.4923597],[31.2389653,121.4924457],[31.2391023,121.4927543],[31.2391928,121.4926994],[31.2390862,121.4924592],[31.2391373,121.4924282],[31.239107,121.4923597]],region:"bund_edge"},{name:"",h:38.4,ring:[[31.2389474,121.4918973],[31.2387755,121.4920013],[31.2389358,121.4923635],[31.2390841,121.4922737],[31.2390566,121.4922116],[31.2390801,121.4921973],[31.2389474,121.4918973]],region:"bund_edge"},{name:"",h:9.6,ring:[[31.2421181,121.4916488],[31.2421883,121.4916639],[31.2422586,121.4916993],[31.2423026,121.4917374],[31.2426279,121.4921364],[31.2426509,121.4921898],[31.2426551,121.4922438],[31.2426408,121.4922961],[31.242484,121.4924697],[31.2419801,121.4918055],[31.2421181,121.4916488]],region:"bund_edge"},{name:"",h:32,ring:[[31.2428519,121.4843432],[31.2428512,121.4843927],[31.2430617,121.4843969],[31.2430625,121.4843447],[31.2430942,121.4843454],[31.2430954,121.4842646],[31.2430978,121.4841064],[31.2430983,121.4840698],[31.2430989,121.4840295],[31.2430672,121.4840288],[31.2430678,121.4839862],[31.2428573,121.4839819],[31.2428566,121.4840274],[31.2428329,121.4840269],[31.2428319,121.4840953],[31.2428294,121.4842616],[31.2428282,121.4843427],[31.2428519,121.4843432]],region:"bund_edge"},{name:"",h:41.6,ring:[[31.2436646,121.4847848],[31.2434161,121.4847893],[31.2434152,121.4850713],[31.2434323,121.4850691],[31.2434314,121.4852154],[31.2436515,121.4852177],[31.2436524,121.4850649],[31.2436665,121.4850653],[31.2436646,121.4847848]],region:"bund_edge"},{name:"",h:32,ring:[[31.2437207,121.4852184],[31.2436515,121.4852177],[31.2434314,121.4852154],[31.2432047,121.485213],[31.2432024,121.485256],[31.2431898,121.485256],[31.2431824,121.4855143],[31.243199,121.4855135],[31.2431982,121.4855517],[31.2433699,121.4855538],[31.2433701,121.4855137],[31.2433828,121.4855133],[31.2433859,121.4854303],[31.2435349,121.4854303],[31.2435349,121.4854974],[31.2437185,121.4854933],[31.2437188,121.4854491],[31.2437323,121.4854488],[31.2437331,121.4852626],[31.2437203,121.4852627],[31.2437207,121.4852184]],region:"bund_edge"},{name:"\u6021\u548C\u6D0B\u884C\u5927\u697C",h:22.4,ring:[[31.2426072,121.4850847],[31.2424869,121.4850939],[31.2424617,121.4850966],[31.2424415,121.485121],[31.2424365,121.4853434],[31.2422993,121.4853302],[31.2423307,121.4850534],[31.242202,121.4850376],[31.2421995,121.485073],[31.2421756,121.4850708],[31.2421139,121.4855395],[31.2425353,121.4855985],[31.2425993,121.4855204],[31.2426112,121.4851344],[31.2426072,121.4850847]],region:"bund_edge"},{name:"\u683C\u6797\u90AE\u8239\u5927\u697C",h:28.8,ring:[[31.2430054,121.4849163],[31.2427419,121.4849198],[31.2427415,121.4852843],[31.2427163,121.4852839],[31.2427162,121.4855821],[31.2427415,121.4855848],[31.2427419,121.4856306],[31.2429043,121.4856304],[31.2429089,121.4851985],[31.2429433,121.4851985],[31.2429437,121.4852337],[31.2430029,121.4852334],[31.2430054,121.4849163]],region:"bund_edge"},{name:"\u4E1C\u65B9\u6C47\u7406\u94F6\u884C\u5927\u697C",h:19.2,ring:[[31.2431434,121.4849297],[31.243042,121.4849278],[31.2430384,121.4851982],[31.2430625,121.4851986],[31.2430614,121.4852826],[31.2429396,121.4852804],[31.2429349,121.4856298],[31.2431339,121.4856334],[31.2431434,121.4849297]],region:"bund_edge"},{name:"\u76CA\u4E30\xB7\u5916\u6EE9\u6E90",h:16,ring:[[31.2424859,121.483801],[31.2424833,121.484593],[31.242531,121.4845901],[31.2425333,121.4846947],[31.2424788,121.4847003],[31.2424869,121.4850939],[31.2426072,121.4850847],[31.2426136,121.4843513],[31.2426251,121.4838685],[31.2426311,121.4838564],[31.2426309,121.4838364],[31.2426249,121.4838225],[31.2426125,121.483813],[31.2425967,121.4838124],[31.2425852,121.4838144],[31.2425484,121.4838133],[31.2425297,121.4837948],[31.2424859,121.483801]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2424279,121.483949],[31.2423728,121.483949],[31.2423705,121.4838337],[31.2422811,121.4838364],[31.2422467,121.484067],[31.2422334,121.4841746],[31.2422242,121.4842631],[31.2422238,121.4843487],[31.2422288,121.4845796],[31.2422352,121.4847081],[31.2422517,121.4848398],[31.2422724,121.4849605],[31.2423659,121.4849736],[31.2423659,121.4849441],[31.2424164,121.4849441],[31.2424279,121.483949]],region:"bund_edge"},{name:"\u4E2D\u56FD\u519C\u4E1A\u94F6\u884C",h:22.4,ring:[[31.2421114,121.4851635],[31.2419617,121.4851476],[31.2419072,121.4854858],[31.2419548,121.485495],[31.2420718,121.4855177],[31.2421114,121.4851635]],region:"bund_edge"},{name:"\u4E2D\u56FD\u5DE5\u5546\u94F6\u884C",h:22.4,ring:[[31.2421388,121.4847292],[31.2417438,121.4846604],[31.2416486,121.4854086],[31.2417716,121.48543],[31.2418945,121.4854514],[31.241937,121.4851174],[31.2420861,121.4851433],[31.2421388,121.4847292]],region:"bund_edge"},{name:"\u4E2D\u56FD\u94F6\u884C\u5927\u697C",h:51.2,ring:[[31.2416336,121.4851795],[31.241383,121.4851439],[31.2413612,121.4853537],[31.2416118,121.4853893],[31.2416336,121.4851795]],region:"bund_edge"},{name:"\u548C\u5E73\u996D\u5E97\u5357\u697C",h:25.6,ring:[[31.2406245,121.484437],[31.2406106,121.4843649],[31.2405934,121.4843692],[31.2404861,121.4843972],[31.2404991,121.484466],[31.2404739,121.4844738],[31.2404858,121.4845355],[31.2404569,121.4845465],[31.2404373,121.4845697],[31.2404284,121.4846041],[31.2404306,121.4846404],[31.2404414,121.4846688],[31.2404638,121.4846968],[31.2404914,121.4847082],[31.240516,121.4847032],[31.2405569,121.4849137],[31.2406294,121.485296],[31.2407377,121.4852929],[31.2407477,121.4853007],[31.2407583,121.4853025],[31.2407735,121.4852974],[31.2407849,121.4852893],[31.2407946,121.4852758],[31.2407977,121.4852609],[31.240796,121.4852435],[31.240791,121.4852337],[31.240783,121.4852271],[31.240775,121.4852272],[31.2406371,121.4845099],[31.2406456,121.4844999],[31.2406512,121.4844879],[31.2406538,121.4844733],[31.2406495,121.4844572],[31.2406421,121.484445],[31.2406329,121.4844379],[31.2406245,121.484437]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2417904,121.4836836],[31.2417287,121.483673],[31.2417324,121.483655],[31.2415902,121.4836297],[31.2415873,121.4836494],[31.2415542,121.4836433],[31.2413868,121.4851078],[31.2416322,121.4851454],[31.2417423,121.4841771],[31.2416974,121.4841672],[31.2417147,121.4839974],[31.2417513,121.4840019],[31.2417904,121.4836836]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2420896,121.4841541],[31.2418784,121.4841252],[31.2418694,121.4842092],[31.2418873,121.4842122],[31.2418798,121.4842824],[31.2418617,121.4842781],[31.2418347,121.4845271],[31.2420485,121.4845569],[31.2420748,121.4842985],[31.2420552,121.4842971],[31.2420612,121.4842386],[31.2420806,121.484242],[31.2420896,121.4841541]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u603B\u5DE5\u4F1A",h:22.4,ring:[[31.2389772,121.4849364],[31.2388431,121.4849767],[31.2389113,121.4852961],[31.2389256,121.4853851],[31.238963,121.4853794],[31.2389817,121.4855667],[31.2391879,121.4855332],[31.2391649,121.4852754],[31.239125,121.485279],[31.2391109,121.4852811],[31.2391219,121.4853155],[31.2391203,121.485346],[31.2390671,121.4853575],[31.2390578,121.4852798],[31.2389772,121.4849364]],region:"bund_edge"},{name:"\u5916\u6EE9\u516C\u5171\u670D\u52A1\u4E2D\u5FC3",h:16,ring:[[31.2393209,121.485048],[31.2396518,121.4849452],[31.239618,121.4848059],[31.2391312,121.4849834],[31.239197,121.4853011],[31.2391803,121.4853056],[31.2392094,121.4855186],[31.2394151,121.4854835],[31.2393209,121.485048]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5916\u6C47\u4EA4\u6613\u4E2D\u5FC3",h:16,ring:[[31.2396787,121.4849792],[31.2393769,121.4850765],[31.2394628,121.4854743],[31.23977,121.4854132],[31.2396787,121.4849792]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2389981,121.4848902],[31.2388316,121.4849416],[31.2388096,121.4848441],[31.2390538,121.4847698],[31.2391649,121.4852754],[31.239125,121.485279],[31.2391164,121.4852412],[31.2390802,121.4852372],[31.2389981,121.4848902]],region:"bund_edge"},{name:"\u4E0A\u6D77\u6D77\u5173",h:22.4,ring:[[31.2387658,121.4852915],[31.2387146,121.4852984],[31.2385075,121.4853261],[31.2384403,121.4853351],[31.2384467,121.4853999],[31.2384583,121.4855179],[31.2384643,121.4855794],[31.2385319,121.4855703],[31.2387449,121.4855417],[31.2387898,121.4855357],[31.2387825,121.4854616],[31.2387715,121.48535],[31.2387658,121.4852915]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.238507,121.4853153],[31.2384318,121.4853218],[31.2384367,121.4854008],[31.2384467,121.4853999],[31.238512,121.4853944],[31.2385075,121.4853261],[31.238507,121.4853153]],region:"bund_edge"},{name:"",h:32,ring:[[31.2386698,121.4854572],[31.2386012,121.4854669],[31.2386091,121.4855445],[31.2386778,121.4855348],[31.2386698,121.4854572]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2387906,121.4852636],[31.2387119,121.4852765],[31.2387146,121.4852984],[31.2387217,121.4853583],[31.2387715,121.48535],[31.2388004,121.4853454],[31.2387906,121.4852636]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2385265,121.4855098],[31.2384583,121.4855179],[31.2384505,121.4855186],[31.2384569,121.4855936],[31.2385329,121.4855848],[31.2385319,121.4855703],[31.2385265,121.4855098]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2388083,121.4854586],[31.2387825,121.4854616],[31.2387385,121.4854665],[31.2387449,121.4855417],[31.2387455,121.4855511],[31.2388153,121.4855432],[31.2388083,121.4854586]],region:"bund_edge"},{name:"\u76D8\u8C37\u94F6\u884C",h:22.4,ring:[[31.2371366,121.4857722],[31.2369971,121.4858463],[31.2368967,121.4858996],[31.2369861,121.4861297],[31.237226,121.4860023],[31.2371366,121.4857722]],region:"bund_edge"},{name:"\u6709\u5229\u5927\u697C",h:22.4,ring:[[31.2360894,121.4858971],[31.2358738,121.4859856],[31.2360439,121.4867231],[31.2362636,121.4865945],[31.2362774,121.4865194],[31.2360894,121.4858971]],region:"bund_edge"},{name:"\u8F6E\u8239\u62DB\u5546\u5C40\u5927\u697C",h:16,ring:[[31.2374725,121.4856948],[31.2374487,121.4857027],[31.2374419,121.4856681],[31.2374094,121.4856775],[31.2374161,121.485713],[31.2373791,121.4857251],[31.2373694,121.4856754],[31.2373155,121.4856942],[31.2373246,121.4857407],[31.2372171,121.4857709],[31.2372281,121.48583],[31.2372464,121.48583],[31.2372606,121.4858836],[31.2372642,121.4858876],[31.2372697,121.4858922],[31.2372762,121.4858971],[31.2373015,121.4858864],[31.2373152,121.4858998],[31.2374994,121.48583],[31.2374725,121.4856948]],region:"bund_edge"},{name:"\u5916\u6EE9\u4E94\u53F7",h:22.4,ring:[[31.2363943,121.4857759],[31.2361908,121.4858613],[31.2363379,121.4863442],[31.2363382,121.4863616],[31.2363674,121.4864411],[31.2363823,121.4864367],[31.2364118,121.486452],[31.2365616,121.4863333],[31.236539,121.4862374],[31.2365057,121.4862524],[31.2364652,121.4861242],[31.2365008,121.4861063],[31.2364725,121.4860191],[31.2364417,121.4860345],[31.2363841,121.4858559],[31.2364148,121.4858421],[31.2363943,121.4857759]],region:"bund_edge"},{name:"\u5916\u6EE9\u516D\u53F7",h:19.2,ring:[[31.2367628,121.4858116],[31.2366647,121.4858705],[31.2366532,121.485849],[31.2365385,121.4858892],[31.2364674,121.4859241],[31.2365473,121.4861388],[31.236522,121.4861496],[31.2365821,121.486313],[31.2366321,121.4862863],[31.2366211,121.4862621],[31.2368848,121.4861226],[31.2367628,121.4858116]],region:"bund_edge"},{name:"\u4E0A\u6D77\u4E9A\u7EC6\u4E9A\u5927\u697C",h:22.4,ring:[[31.2355771,121.4864946],[31.2352297,121.4866169],[31.2353326,121.4870162],[31.2356799,121.4868938],[31.2355771,121.4864946]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2358119,121.4861204],[31.2356134,121.4861909],[31.2356309,121.4862584],[31.2358295,121.4861879],[31.2358119,121.4861204]],region:"bund_edge"},{name:"\u4E0A\u6D77\u603B\u4F1A\u5927\u697C",h:22.4,ring:[[31.2358692,121.486209],[31.2355774,121.4863102],[31.2356775,121.4867049],[31.2356519,121.4867138],[31.2356937,121.486879],[31.2360111,121.4867689],[31.2358692,121.486209]],region:"bund_edge"},{name:"\u90FD\u57CE\u996D\u5E97",h:44.8,ring:[[31.2371317,121.4831614],[31.2372708,121.4831208],[31.2373907,121.4830858],[31.2373433,121.4828271],[31.237219,121.4828612],[31.2372251,121.4828977],[31.2372264,121.48293],[31.2372235,121.4829581],[31.237216,121.4829835],[31.2372012,121.4830082],[31.2371824,121.4830283],[31.237162,121.4830437],[31.2371406,121.4830544],[31.2371152,121.4830629],[31.2371317,121.4831614]],region:"bund_edge"},{name:"\u9999\u683C\u91CC\u62C9\u9152\u5E97",h:144,ring:[[31.2378929,121.4944554],[31.237686,121.4939719],[31.2373893,121.4941457],[31.2374569,121.4943035],[31.2375963,121.4946291],[31.2378704,121.4944687],[31.2378929,121.4944554]],region:"bund_edge"},{name:"\u5723\u4E09\u4E00\u5802",h:22.4,ring:[[31.2384677,121.4815268],[31.2384273,121.4815404],[31.2384225,121.4815209],[31.2383183,121.4815558],[31.2383215,121.4815685],[31.2382753,121.4815838],[31.238287,121.4816319],[31.2382652,121.4816391],[31.2382948,121.4817615],[31.2383124,121.4817497],[31.2383845,121.4820397],[31.2386023,121.4819657],[31.2385019,121.4815615],[31.2384783,121.4815695],[31.2384677,121.4815268]],region:"bund_edge"},{name:"",h:32,ring:[[31.2317636,121.4865072],[31.2318324,121.4865327],[31.231884,121.486589],[31.2319104,121.4866601],[31.2321202,121.4873146],[31.2321168,121.4873723],[31.2320893,121.4874152],[31.2316558,121.4876244],[31.2316122,121.4876163],[31.2315859,121.4875748],[31.2316111,121.4867406],[31.2316168,121.4866548],[31.2316409,121.486581],[31.2316982,121.4865247],[31.2317636,121.4865072]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2329304,121.4863405],[31.2330534,121.4868331],[31.2329104,121.4868818],[31.2328132,121.486492],[31.2327939,121.4864145],[31.2327876,121.4863893],[31.2329304,121.4863405]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2327482,121.4864048],[31.2327537,121.4864276],[31.2327939,121.4864145],[31.2328132,121.486492],[31.2325222,121.4865871],[31.2325184,121.4865712],[31.2324982,121.4864865],[31.2327482,121.4864048]],region:"bund_edge"},{name:"\u798F\u4F51\u95E8\u5C0F\u5546\u54C1\u5E02\u573A",h:25.6,ring:[[31.2302111,121.4830613],[31.2298136,121.4831248],[31.2299434,121.484236],[31.230341,121.4841725],[31.2302111,121.4830613]],region:"bund_edge"},{name:"\u4E2D\u6C47\u5927\u697C",h:35.2,ring:[[31.2321145,121.4822837],[31.2320452,121.4820234],[31.2320274,121.4819565],[31.2325687,121.4817932],[31.2326566,121.4818553],[31.2327007,121.4819532],[31.2327061,121.4820563],[31.2326622,121.4821524],[31.2321145,121.4822837]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2362381,121.4818837],[31.2359354,121.4819615],[31.2359949,121.4822975],[31.2362911,121.4822223],[31.2362381,121.4818837]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2356226,121.4822408],[31.2356419,121.4823453],[31.2355638,121.4823726],[31.2355717,121.4824105],[31.2356473,121.4823889],[31.2356733,121.4825136],[31.2355969,121.4825354],[31.2356037,121.4825678],[31.2356832,121.482545],[31.2357097,121.482663],[31.2356313,121.4826895],[31.2356435,121.4827522],[31.2357265,121.4827217],[31.2357572,121.4828273],[31.2355829,121.4828777],[31.2354587,121.482303],[31.2356226,121.4822408]],region:"bund_edge"},{name:"",h:96,ring:[[31.2362371,121.4838707],[31.2363812,121.4845252],[31.236216,121.4845749],[31.2360719,121.4839205],[31.2362371,121.4838707]],region:"bund_edge"},{name:"\u61FF\u5FB7\u5927\u697C",h:12.8,ring:[[31.2360854,121.4845646],[31.2361232,121.4847258],[31.2359145,121.4848026],[31.2358742,121.4847779],[31.2358427,121.4847346],[31.2357773,121.4844618],[31.2359111,121.4844109],[31.2359482,121.484571],[31.2359883,121.4845985],[31.2360854,121.4845646]],region:"bund_edge"},{name:"\u65B0\u5EB7\u5927\u697C",h:38.4,ring:[[31.2391583,121.4824582],[31.2391436,121.4824745],[31.2391358,121.4824966],[31.2391898,121.4827041],[31.2392202,121.4826957],[31.2392853,121.4829534],[31.2395973,121.4828375],[31.2395602,121.4827013],[31.239666,121.4826537],[31.2395772,121.4823508],[31.2396103,121.4823342],[31.2396017,121.4823044],[31.2395752,121.4822902],[31.2391583,121.4824582]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5A01\u65AF\u6C40\u5927\u996D\u5E97",h:112,ring:[[31.2346726,121.4820858],[31.2344474,121.4821575],[31.2344686,121.4822487],[31.234134,121.4823553],[31.2341106,121.4822549],[31.2339033,121.4823209],[31.2340211,121.4828269],[31.2342304,121.4827602],[31.2341855,121.4825672],[31.2345163,121.4824619],[31.2345649,121.4826707],[31.2347919,121.4825984],[31.2346726,121.4820858]],region:"bund_edge"},{name:"\u4E0A\u6D77\u81EA\u7136\u535A\u7269\u9986\u65E7\u9986",h:19.2,ring:[[31.2338351,121.4824833],[31.2338971,121.482814],[31.2333762,121.4830052],[31.2331255,121.4827009],[31.2331156,121.4826872],[31.2331087,121.4826688],[31.2331108,121.4826518],[31.2331193,121.4826394],[31.2331305,121.4826322],[31.2338351,121.4824833]],region:"bund_edge"},{name:"\u5EF6\u6CB3\u5927\u697C",h:22.4,ring:[[31.2337731,121.4821166],[31.2331784,121.4822579],[31.2331575,121.4822669],[31.2331347,121.4822829],[31.2331189,121.4822988],[31.2331035,121.4823198],[31.2330872,121.482343],[31.2330711,121.4823707],[31.2330595,121.482405],[31.233061,121.4824408],[31.233084,121.4825655],[31.2331537,121.482548],[31.2331405,121.4824538],[31.2331439,121.4824186],[31.2331647,121.4823816],[31.233188,121.4823592],[31.2332161,121.4823498],[31.2337856,121.4822037],[31.2337731,121.4821166]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2338045,121.4823084],[31.2338225,121.4824157],[31.2332203,121.4825597],[31.2332023,121.4824577],[31.2338045,121.4823084]],region:"bund_edge"},{name:"",h:16,ring:[[31.2321041,121.482959],[31.23134,121.4831604],[31.231315,121.483153],[31.2312875,121.4831028],[31.2312369,121.4829244],[31.2312379,121.4828786],[31.2312494,121.4828522],[31.231271,121.4828273],[31.2313086,121.4827986],[31.2319636,121.4826404],[31.2319958,121.4826525],[31.2320182,121.4826664],[31.2320382,121.4826837],[31.232054,121.4827027],[31.2320656,121.4827252],[31.2321355,121.4829038],[31.2321328,121.4829215],[31.232125,121.4829383],[31.232115,121.4829502],[31.2321041,121.482959]],region:"bund_edge"},{name:"",h:57.6,ring:[[31.2332603,121.4838951],[31.232984,121.4840392],[31.2329326,121.4839483],[31.2329099,121.483842],[31.2329075,121.4837483],[31.232923,121.4836713],[31.2329577,121.4835902],[31.2329816,121.4835483],[31.2330115,121.4835077],[31.2330594,121.483463],[31.2332603,121.4838951]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5DE5\u5546\u8054\u5927\u53A6",h:28.8,ring:[[31.2331442,121.4847645],[31.2330399,121.484744],[31.2329306,121.4843687],[31.2332875,121.4842265],[31.2333772,121.4842797],[31.2334224,121.4844233],[31.2334848,121.4846203],[31.2333823,121.4846642],[31.2334597,121.4849086],[31.2334341,121.4849196],[31.2334604,121.4850026],[31.2332815,121.4850801],[31.2332543,121.4849944],[31.2332215,121.4850086],[31.2331442,121.4847645]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2353045,121.4826797],[31.2353954,121.4830601],[31.2352951,121.4830929],[31.2351635,121.4827265],[31.2353045,121.4826797]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2342883,121.4844944],[31.2343822,121.4848608],[31.2342325,121.4849169],[31.2341321,121.4845464],[31.2342883,121.4844944]],region:"bund_edge"},{name:"",h:16,ring:[[31.2363088,121.4826745],[31.2363704,121.4829107],[31.2361409,121.4829869],[31.2360975,121.4827473],[31.2361745,121.4827234],[31.2361973,121.48286],[31.236271,121.4828404],[31.2362506,121.4827045],[31.2363088,121.4826745]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2354289,121.4825552],[31.235521,121.483007],[31.2354237,121.4830341],[31.2353316,121.4825824],[31.2354289,121.4825552]],region:"bund_edge"},{name:"\u9526\u6C5F\u96C6\u56E2\u8D22\u52A1\u516C\u53F8\u8BC1\u5238\u7ECF\u8425\u90E8",h:25.6,ring:[[31.2358826,121.4853657],[31.2360135,121.485833],[31.2358174,121.4859064],[31.2357064,121.4855117],[31.2357308,121.4855023],[31.2357127,121.4854354],[31.2357272,121.4854294],[31.2358826,121.4853657]],region:"bund_edge"},{name:"\u4E2D\u56FD\u4EBA\u6C11\u89E3\u653E\u519B\u6D77\u519B\u540E\u52E4\u90E8\u4E0A\u6D77\u7269\u8D44\u7AD9",h:16,ring:[[31.2363653,121.4832781],[31.2361008,121.4833526],[31.2360642,121.4831749],[31.2363287,121.4831003],[31.2363653,121.4832781]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2330824,121.4856901],[31.2331408,121.4858887],[31.2330298,121.4859363],[31.2330009,121.4858343],[31.2329716,121.485733],[31.2330824,121.4856901]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2360519,121.4833758],[31.2356459,121.4835021],[31.2355457,121.4833288],[31.236008,121.4831865],[31.2360519,121.4833758]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2351218,121.4818211],[31.23516,121.4820105],[31.2349753,121.4820615],[31.234937,121.4818722],[31.2351218,121.4818211]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2322349,121.4867917],[31.2323273,121.4870789],[31.2322803,121.4870996],[31.232188,121.4868123],[31.2322349,121.4867917]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2331574,121.4859504],[31.233203,121.4861071],[31.2330909,121.4861517],[31.2330469,121.4859964],[31.2331574,121.4859504]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.236092,121.4848447],[31.2361836,121.4851645],[31.2361684,121.4851911],[31.2360075,121.4852542],[31.2359105,121.4849159],[31.236092,121.4848447]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2352848,121.4826223],[31.2351326,121.4826666],[31.2350213,121.4821435],[31.2351736,121.4820992],[31.2352848,121.4826223]],region:"bund_edge"},{name:"\u4E0A\u6D77\u957F\u9014\u7535\u4FE1\u79D1\u6280\u53D1\u5C55\u516C\u53F8",h:25.6,ring:[[31.2354239,121.4860867],[31.235505,121.4863877],[31.235178,121.4865083],[31.2350969,121.4862072],[31.2354239,121.4860867]],region:"bund_edge"},{name:"\u4E0A\u6D77\u7535\u6C14\u96C6\u56E2\u603B\u516C\u53F8",h:25.6,ring:[[31.2365297,121.4849451],[31.2361751,121.485054],[31.2361281,121.4848703],[31.2364873,121.4847615],[31.2365297,121.4849451]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2355292,121.4830623],[31.2355635,121.4832047],[31.235347,121.4832759],[31.2353128,121.4831335],[31.2355292,121.4830623]],region:"bund_edge"},{name:"\u793C\u548C\u5927\u697C",h:16,ring:[[31.2392046,121.4817855],[31.2392429,121.481942],[31.2391675,121.4819745],[31.2392004,121.482111],[31.2392983,121.4820773],[31.2393394,121.4822479],[31.2391168,121.4823388],[31.2390828,121.4823203],[31.2389717,121.4818714],[31.2392046,121.4817855]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.235346,121.4821681],[31.2354219,121.4825276],[31.2353393,121.4825514],[31.2352634,121.482192],[31.235346,121.4821681]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2353185,121.4820257],[31.2353431,121.4821565],[31.2352473,121.4821811],[31.2352228,121.4820503],[31.2353185,121.4820257]],region:"bund_edge"},{name:"Waldorf Astoria",h:80,ring:[[31.2356923,121.4854295],[31.2356242,121.4854532],[31.2356426,121.4855256],[31.235395,121.4856119],[31.235377,121.4855411],[31.2353126,121.4852879],[31.2356282,121.485178],[31.2356923,121.4854295]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2324577,121.4842331],[31.2322588,121.4843133],[31.2322515,121.4842885],[31.2322251,121.4842992],[31.2322045,121.4842293],[31.2324298,121.4841385],[31.2324577,121.4842331]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.23964,121.4819295],[31.2396869,121.4821099],[31.2394071,121.4822052],[31.2393638,121.4820238],[31.23964,121.4819295]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2359138,121.4824592],[31.235978,121.4827497],[31.2357851,121.482808],[31.2357202,121.4825186],[31.2359138,121.4824592]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2360056,121.4827686],[31.2360559,121.4830252],[31.2356477,121.483145],[31.2355879,121.482896],[31.2356598,121.4828741],[31.2356861,121.4830203],[31.2357588,121.4829952],[31.235735,121.4828512],[31.2358442,121.482818],[31.2358714,121.4829661],[31.2359342,121.4829448],[31.235906,121.482799],[31.2360056,121.4827686]],region:"bund_edge"},{name:"",h:16,ring:[[31.2352578,121.4817735],[31.2353005,121.4819894],[31.2351781,121.4820225],[31.2351354,121.4818065],[31.2352578,121.4817735]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2355167,121.483334],[31.2357513,121.4838844],[31.2356179,121.4839589],[31.2353733,121.4834036],[31.2353771,121.4833793],[31.2353931,121.4833622],[31.2355167,121.483334]],region:"bund_edge"},{name:"\u661F\u817E\u5927\u53A6",h:96,ring:[[31.2326986,121.4828008],[31.2323272,121.4828881],[31.2322785,121.4826053],[31.2326499,121.4825179],[31.2326986,121.4828008]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2323863,121.483561],[31.2325924,121.4841529],[31.232574,121.4841886],[31.2324659,121.4842352],[31.232427,121.4841118],[31.2324602,121.4840975],[31.2324406,121.4840355],[31.2323991,121.4840143],[31.2322649,121.4836215],[31.2323863,121.483561]],region:"bund_edge"},{name:"\u521B\u4E1A\u5927\u697C",h:28.8,ring:[[31.2352008,121.4849928],[31.2348805,121.4851255],[31.2348544,121.4850296],[31.2348119,121.4850475],[31.2347693,121.4848847],[31.2351235,121.4847273],[31.2352008,121.4849928]],region:"bund_edge"},{name:"\u9AD8\u767B\u91D1\u878D\u5927\u53A6",h:51.2,ring:[[31.2353828,121.4857891],[31.2354417,121.486013],[31.2351531,121.4861168],[31.2351173,121.4860875],[31.2350814,121.4859533],[31.2350986,121.4858914],[31.2353828,121.4857891]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2361986,121.4835931],[31.2362335,121.4837384],[31.2357993,121.4838702],[31.2356534,121.4835339],[31.2360394,121.4834326],[31.2360834,121.4836187],[31.2361986,121.4835931]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2318974,121.4821518],[31.2310555,121.4824077],[31.2310459,121.4824539],[31.2310889,121.4824874],[31.2319249,121.4823378],[31.2319476,121.4823014],[31.2318974,121.4821518]],region:"bund_edge"},{name:"",h:16,ring:[[31.2346929,121.484524],[31.2347492,121.484734],[31.2344752,121.4848345],[31.234382,121.4844874],[31.234553,121.4844247],[31.2345723,121.4844966],[31.2346086,121.4844832],[31.2346262,121.4845485],[31.2346929,121.484524]],region:"bund_edge"},{name:"\u56DB\u5DDD\u5927\u697C",h:25.6,ring:[[31.2343713,121.4849019],[31.2344471,121.4850018],[31.2345234,121.4850601],[31.2345919,121.4850889],[31.2346495,121.4850935],[31.2347563,121.4850447],[31.2347888,121.4851579],[31.2346192,121.4852375],[31.2345415,121.4852326],[31.2344766,121.4851936],[31.234425,121.4851626],[31.2343609,121.4851112],[31.2343034,121.4850479],[31.2342466,121.4849555],[31.2343713,121.4849019]],region:"bund_edge"},{name:"\u4E0A\u6D77\u533B\u836F\u5DE5\u4E1A\u6709\u9650\u516C\u53F8",h:19.2,ring:[[31.2399151,121.4840905],[31.2399478,121.4841161],[31.240031,121.4844329],[31.2397181,121.4845428],[31.2396225,121.4841952],[31.2399151,121.4840905]],region:"bund_edge"},{name:"\u4E45\u4E8B\u5546\u52A1\u5927\u53A6",h:16,ring:[[31.2382583,121.4831013],[31.2383962,121.4837302],[31.2383297,121.4837502],[31.2383401,121.4837995],[31.2383757,121.4838221],[31.2383866,121.483874],[31.2383633,121.4839139],[31.238324,121.4839321],[31.2382811,121.4839006],[31.2382539,121.4839102],[31.23826,121.4839453],[31.2379099,121.4840518],[31.2379021,121.484016],[31.2378772,121.4840235],[31.2378572,121.4840675],[31.2378155,121.484083],[31.2377702,121.4840563],[31.2377587,121.4839965],[31.2377953,121.4839395],[31.2376701,121.4833682],[31.2380255,121.4832617],[31.2380069,121.4831767],[31.2382583,121.4831013]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2363875,121.4835108],[31.2361078,121.4835922],[31.2360734,121.4834308],[31.2363532,121.4833494],[31.2363875,121.4835108]],region:"bund_edge"},{name:"\u5143\u82B3\u5F04",h:9.6,ring:[[31.2368551,121.4850546],[31.2369014,121.4852361],[31.236704,121.4853051],[31.2366577,121.4851236],[31.2368551,121.4850546]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u9AD8\u7EA7\u4EBA\u6C11\u6CD5\u9662",h:25.6,ring:[[31.2366919,121.4817934],[31.2367437,121.4820298],[31.23641,121.4821339],[31.2363561,121.4818976],[31.2366919,121.4817934]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2395389,121.4845779],[31.239594,121.484803],[31.239394,121.48487],[31.2393647,121.4847505],[31.2393176,121.4847663],[31.2393456,121.4848804],[31.2391405,121.4849492],[31.2390867,121.4847294],[31.2395389,121.4845779]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2387017,121.4827616],[31.238745,121.4829736],[31.2384088,121.4830675],[31.2383655,121.4828556],[31.2387017,121.4827616]],region:"bund_edge"},{name:"",h:16,ring:[[31.2365527,121.4855957],[31.2363899,121.485651],[31.2363721,121.4855795],[31.2365349,121.4855242],[31.2365527,121.4855957]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5916\u6EE9\u5357\u4EAC\u4E1C\u8DEF\u4E9A\u6735\u9152\u5E97",h:25.6,ring:[[31.2365147,121.4835171],[31.236655,121.4841771],[31.2364474,121.4842438],[31.2363128,121.483572],[31.2365147,121.4835171]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2381129,121.4849423],[31.2378154,121.4849859],[31.2378083,121.4849196],[31.2378317,121.4849161],[31.2378191,121.4847986],[31.2377966,121.4848016],[31.2377889,121.4847335],[31.2380858,121.4846894],[31.2381129,121.4849423]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u4ED3\u50A8\u884C\u4E1A\u534F\u4F1A",h:28.8,ring:[[31.2366733,121.484263],[31.2367146,121.4844744],[31.2364978,121.4845323],[31.2364565,121.4843209],[31.2366733,121.484263]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2364896,121.4830565],[31.2365175,121.4832188],[31.2365559,121.4834498],[31.2364513,121.4834733],[31.2363809,121.4830837],[31.2364896,121.4830565]],region:"bund_edge"},{name:"\u4E2D\u56FD\u7535\u4FE1",h:25.6,ring:[[31.2386927,121.4827363],[31.2383605,121.4827968],[31.2383338,121.4826394],[31.2383449,121.4826115],[31.238671,121.4825529],[31.2386927,121.4827363]],region:"bund_edge"},{name:"\u534E\u4E1C\u7535\u529B\u7BA1\u7406\u5C40",h:22.4,ring:[[31.2398327,121.4815905],[31.2399419,121.4819504],[31.239904,121.4820168],[31.2397255,121.4820941],[31.2396545,121.4818604],[31.2396758,121.4818504],[31.2396281,121.4816782],[31.2397949,121.4816062],[31.2398327,121.4815905]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2370604,121.4854373],[31.2371409,121.4857018],[31.2370622,121.4857345],[31.2369818,121.48547],[31.2370604,121.4854373]],region:"bund_edge"},{name:"",h:51.2,ring:[[31.2390729,121.4840262],[31.2391517,121.4843856],[31.2390168,121.4844261],[31.2389379,121.4840667],[31.2390729,121.4840262]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2367403,121.483163],[31.2367802,121.4833722],[31.2366664,121.4834018],[31.2366263,121.4831905],[31.2367403,121.483163]],region:"bund_edge"},{name:"",h:16,ring:[[31.2372194,121.4850196],[31.2372258,121.4850468],[31.2372439,121.4851283],[31.2371941,121.4851435],[31.2372171,121.4852437],[31.2371196,121.4852822],[31.2370684,121.4850629],[31.2372194,121.4850196]],region:"bund_edge"},{name:"\u5143\u82B3\u5F04",h:9.6,ring:[[31.2370228,121.4851939],[31.2369189,121.4852309],[31.2368754,121.485064],[31.2369793,121.4850271],[31.2370228,121.4851939]],region:"bund_edge"},{name:"",h:38.4,ring:[[31.2392236,121.4843943],[31.2392784,121.484617],[31.2391487,121.4846606],[31.2390939,121.4844379],[31.2392236,121.4843943]],region:"bund_edge"},{name:"",h:32,ring:[[31.2381796,121.482983],[31.2381956,121.4830519],[31.2380354,121.4831025],[31.2380195,121.4830336],[31.2381295,121.4829988],[31.2381796,121.482983]],region:"bund_edge"},{name:"\u8054\u5408\u5927\u697C",h:28.8,ring:[[31.2388925,121.4836458],[31.2389009,121.4836849],[31.2389274,121.4838088],[31.2386468,121.4838899],[31.2385899,121.4838263],[31.2385714,121.4837332],[31.2388925,121.4836458]],region:"bund_edge"},{name:"",h:32,ring:[[31.237723,121.4829509],[31.2374105,121.4830297],[31.2373714,121.4828178],[31.2376839,121.482739],[31.237723,121.4829509]],region:"bund_edge"},{name:"\u6C49\u53E3\u8DEF50\u53F7\u5927\u697C",h:12.8,ring:[[31.2388235,121.4840042],[31.2389977,121.4847278],[31.2388052,121.4847912],[31.2386424,121.4841144],[31.2386557,121.4840594],[31.2388235,121.4840042]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u653F\u5E9C\u53C2\u4E8B\u5BA4",h:32,ring:[[31.2380678,121.4842968],[31.2381318,121.4845994],[31.2377719,121.4847035],[31.2377648,121.4846702],[31.237708,121.4844009],[31.2380678,121.4842968]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2384922,121.4850236],[31.2385491,121.4852829],[31.2384462,121.4853138],[31.2383895,121.485054],[31.2384922,121.4850236]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2408864,121.4829017],[31.2406994,121.4829884],[31.2406645,121.4828799],[31.2408539,121.4827917],[31.2408864,121.4829017]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2426227,121.4834437],[31.2426218,121.4836404],[31.242605,121.4836623],[31.242364,121.4836084],[31.2423681,121.4833838],[31.2424495,121.4833853],[31.2424488,121.4834438],[31.2426227,121.4834437]],region:"bund_edge"},{name:"",h:32,ring:[[31.2376683,121.4829921],[31.2377097,121.4832053],[31.2374987,121.4832612],[31.2374574,121.483048],[31.2376683,121.4829921]],region:"bund_edge"},{name:"\u624B\u8868\u4E03\u5382\u529E\u516C\u697C",h:12.8,ring:[[31.2373097,121.4840984],[31.2374403,121.4840623],[31.2374502,121.4841127],[31.2375806,121.4840766],[31.2375924,121.4841355],[31.237674,121.4841086],[31.237699,121.4842169],[31.2373705,121.4843217],[31.2373446,121.4843055],[31.2373097,121.4840984]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2375571,121.4835315],[31.2372423,121.4836214],[31.2372094,121.4834243],[31.2375256,121.483345],[31.2375571,121.4835315]],region:"bund_edge"},{name:"\u5143\u82B3\u5927\u697C",h:19.2,ring:[[31.2365403,121.4849925],[31.2366414,121.4854338],[31.2363517,121.4855296],[31.236204,121.4851082],[31.2365403,121.4849925]],region:"bund_edge"},{name:"\u534E\u4E1C\u5EFA\u7B51\u8BBE\u8BA1\u7814\u7A76\u9662",h:32,ring:[[31.2381094,121.4826451],[31.2382265,121.4827386],[31.2382457,121.4828176],[31.2382762,121.4829523],[31.2381796,121.482983],[31.2381295,121.4829988],[31.2380986,121.4828631],[31.238062,121.4828712],[31.2378177,121.4829249],[31.2378009,121.4829286],[31.2377582,121.482932],[31.2377203,121.4827316],[31.2381094,121.4826451]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.237272,121.4846837],[31.2373357,121.4849826],[31.2372194,121.4850196],[31.2371048,121.4850498],[31.2370418,121.4847536],[31.237181,121.48471],[31.237272,121.4846837]],region:"bund_edge"},{name:"\u5B89\u5229\u5927\u697C",h:22.4,ring:[[31.2396877,121.4837394],[31.2397718,121.4840764],[31.2395692,121.4841544],[31.2394945,121.4838534],[31.2395048,121.4838118],[31.2396877,121.4837394]],region:"bund_edge"},{name:"\u4E0A\u6D77\u533B\u836F\u5DE5\u4E1A\u6709\u9650\u516C\u53F8",h:19.2,ring:[[31.2394337,121.4840621],[31.2394129,121.4840713],[31.2392096,121.4841452],[31.2391698,121.483995],[31.2391671,121.4839137],[31.2393558,121.4838488],[31.2393848,121.4838775],[31.2394337,121.4840621]],region:"bund_edge"},{name:"",h:32,ring:[[31.2394791,121.4843201],[31.2392641,121.4843983],[31.2391979,121.4841495],[31.2392096,121.4841452],[31.2394129,121.4840713],[31.2394791,121.4843201]],region:"bund_edge"},{name:"",h:16,ring:[[31.2373407,121.4850072],[31.2373877,121.4852197],[31.2373698,121.4852251],[31.2372719,121.4852571],[31.2372439,121.4851283],[31.2372258,121.4850468],[31.2373407,121.4850072]],region:"bund_edge"},{name:"",h:32,ring:[[31.2390421,121.4827984],[31.2391235,121.4831219],[31.2390883,121.4831338],[31.2391005,121.4831863],[31.2388568,121.483243],[31.2387713,121.482894],[31.2388049,121.4828816],[31.2387967,121.4828545],[31.2390421,121.4827984]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2376198,121.4835706],[31.2376736,121.4838116],[31.2376117,121.4838316],[31.2372815,121.4839373],[31.2372366,121.4836891],[31.2376198,121.4835706]],region:"bund_edge"},{name:"\u4E2D\u56FD\u5EFA\u8BBE\u94F6\u884C",h:25.6,ring:[[31.2414599,121.4831796],[31.2414317,121.4834717],[31.2411502,121.4835885],[31.2410665,121.4833471],[31.2414599,121.4831796]],region:"bund_edge"},{name:"\u5143\u82B3\u5F04",h:9.6,ring:[[31.2369353,121.4848295],[31.2365917,121.4849402],[31.236626,121.4850856],[31.2369696,121.4849749],[31.2369353,121.4848295]],region:"bund_edge"},{name:"",h:32,ring:[[31.2395213,121.4845364],[31.239325,121.4846029],[31.2392847,121.48444],[31.239481,121.4843736],[31.2395213,121.4845364]],region:"bund_edge"},{name:"\u5B89\u57F9\u6D0B\u884C\u5927\u697C",h:9.6,ring:[[31.2432188,121.4835176],[31.2432411,121.4837319],[31.2430065,121.483769],[31.2429741,121.4837652],[31.2429549,121.4837461],[31.2429359,121.4835673],[31.2432188,121.4835176]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2423021,121.4830773],[31.2423377,121.4830749],[31.2423376,121.4835888],[31.2421582,121.4835821],[31.2421601,121.483477],[31.2421952,121.4834889],[31.2421968,121.4833426],[31.242175,121.4833427],[31.2421775,121.4832166],[31.2423021,121.4830773]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2376117,121.4838316],[31.2376514,121.4840049],[31.2374403,121.4840623],[31.2373097,121.4840984],[31.2372815,121.4839373],[31.2376117,121.4838316]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u673A\u8981\u901A\u4FE1\u5C40",h:6.4,ring:[[31.2377169,121.4846863],[31.2377795,121.4850025],[31.2374916,121.4850941],[31.2374277,121.4847683],[31.2377169,121.4846863]],region:"bund_edge"},{name:"",h:16,ring:[[31.2362786,121.4822564],[31.2362605,121.4823525],[31.2362704,121.4824089],[31.2360339,121.4824836],[31.2360058,121.482333],[31.2362786,121.4822564]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2369988,121.4847671],[31.2367804,121.4848383],[31.2367482,121.4847051],[31.2369681,121.4846335],[31.2369988,121.4847671]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2369677,121.4854915],[31.2370406,121.4857262],[31.2368352,121.4858134],[31.2367623,121.4855788],[31.2369677,121.4854915]],region:"bund_edge"},{name:"\u60E0\u7F57\u516C\u53F8",h:25.6,ring:[[31.2408741,121.4830616],[31.2409398,121.4832585],[31.2409764,121.483371],[31.2408694,121.4834218],[31.2406859,121.4834985],[31.2406325,121.4835188],[31.2405548,121.4832775],[31.2405723,121.4832076],[31.2408741,121.4830616]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2362369,121.4824729],[31.2362735,121.4826433],[31.2360826,121.4827162],[31.2360505,121.4825387],[31.2362369,121.4824729]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2414475,121.4834802],[31.2414216,121.4837279],[31.2411056,121.483884],[31.2410351,121.4836751],[31.2414475,121.4834802]],region:"bund_edge"},{name:"\u6148\u5B89\u91CC\u5927\u697C",h:12.8,ring:[[31.2404227,121.4825384],[31.2405446,121.4829372],[31.2406645,121.4828799],[31.2406994,121.4829884],[31.2407141,121.4830341],[31.2405838,121.4830998],[31.2405186,121.483132],[31.2404759,121.4831096],[31.240319,121.4826024],[31.2404227,121.4825384]],region:"bund_edge"},{name:"\u6148\u660C\u91CC\u5927\u697C",h:12.8,ring:[[31.240626,121.4819913],[31.2403428,121.482114],[31.2404282,121.4823563],[31.2403751,121.4823873],[31.2404159,121.4824978],[31.2403045,121.4825588],[31.2401517,121.4820858],[31.2401733,121.4820295],[31.2405895,121.4818676],[31.240626,121.4819913]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2414974,121.4818953],[31.2415699,121.4821228],[31.2414167,121.4821917],[31.2413436,121.4819624],[31.2414974,121.4818953]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2370362,121.4854114],[31.2367977,121.4854922],[31.2367639,121.4853556],[31.2370024,121.4852748],[31.2370362,121.4854114]],region:"bund_edge"},{name:"\u798F\u5DDE\u5927\u697C",h:44.8,ring:[[31.2370107,121.4832227],[31.2368858,121.4832593],[31.236837,121.483271],[31.2368319,121.4832276],[31.2367831,121.4831886],[31.2367969,121.483157],[31.2367324,121.4831178],[31.2367125,121.4830051],[31.2368156,121.4829691],[31.2368228,121.4830004],[31.2368311,121.483033],[31.2368487,121.4830627],[31.2368684,121.4830867],[31.236891,121.483103],[31.2369112,121.4831101],[31.236943,121.4831144],[31.2369646,121.4831108],[31.2369893,121.4831048],[31.2370107,121.4832227]],region:"bund_edge"},{name:"\u7533\u8FBE\u5927\u697C",h:19.2,ring:[[31.237109,121.4838207],[31.2371866,121.4842417],[31.2371828,121.4842759],[31.2371707,121.484307],[31.2371518,121.4843277],[31.2371234,121.4843454],[31.2368009,121.4844469],[31.2367739,121.484306],[31.2367867,121.4842409],[31.2368145,121.4842332],[31.2368086,121.4842012],[31.23686,121.4841863],[31.2369861,121.48415],[31.2370055,121.4842467],[31.2370652,121.4842262],[31.2369918,121.4838522],[31.237109,121.4838207]],region:"bund_edge"},{name:"\u7533\u534E\u91D1\u878D\u5927\u53A6",h:102.4,ring:[[31.2417018,121.4823821],[31.2414673,121.4824876],[31.241376,121.48221],[31.2414167,121.4821917],[31.2415699,121.4821228],[31.2416105,121.4821046],[31.2417018,121.4823821]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2370107,121.4832227],[31.2371025,121.4837028],[31.2369743,121.4837376],[31.2369499,121.4836124],[31.2368302,121.4836559],[31.2368457,121.483753],[31.2367381,121.483788],[31.2366755,121.4834371],[31.2367895,121.4834024],[31.236807,121.4835104],[31.2369263,121.4834808],[31.2368858,121.4832593],[31.2370107,121.4832227]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2380939,121.4842885],[31.2381167,121.4843942],[31.2384519,121.4842953],[31.2386631,121.4852746],[31.2387674,121.4852438],[31.2385523,121.4842471],[31.2385189,121.4841939],[31.2384787,121.4841751],[31.2380939,121.4842885]],region:"bund_edge"},{name:"",h:57.6,ring:[[31.2390009,121.482596],[31.2390441,121.4827829],[31.2389057,121.4828145],[31.2388882,121.4827352],[31.2388395,121.4827016],[31.2387147,121.482737],[31.2386794,121.4825674],[31.2389118,121.4825129],[31.2390009,121.482596]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2423038,121.4830544],[31.2423417,121.4830536],[31.2423424,121.4830098],[31.2422316,121.4827522],[31.2421502,121.4827926],[31.2421252,121.4827129],[31.2420825,121.4827315],[31.2421075,121.4828144],[31.2420859,121.4828221],[31.2421306,121.4829523],[31.2421804,121.4830853],[31.2422065,121.4831272],[31.2423038,121.4830544]],region:"bund_edge"},{name:"",h:6.4,ring:[[31.2373698,121.4852251],[31.2374445,121.4855525],[31.2374214,121.4855594],[31.2374412,121.4856497],[31.2373694,121.4856754],[31.2373155,121.4856942],[31.2372524,121.4857172],[31.2372136,121.4857002],[31.2371783,121.4857122],[31.2370939,121.4853525],[31.2371156,121.4853455],[31.2371083,121.4853093],[31.2372719,121.4852571],[31.2373698,121.4852251]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2371659,121.4833625],[31.2371317,121.4831614],[31.2372708,121.4831208],[31.2372856,121.4832074],[31.2374153,121.4831782],[31.2374344,121.4832907],[31.2371659,121.4833625]],region:"bund_edge"},{name:"\u798F\u6C11\u5546\u53A6",h:28.8,ring:[[31.2306459,121.4875776],[31.2306485,121.487909],[31.2304944,121.4879106],[31.2304948,121.4879589],[31.2301416,121.4879627],[31.2301419,121.4880094],[31.2300486,121.4880104],[31.2300483,121.4879681],[31.2299683,121.4879689],[31.2299675,121.4878722],[31.2299118,121.4878728],[31.2299096,121.4875854],[31.2306459,121.4875776]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2332727,121.4863783],[31.2334375,121.4869927],[31.2332819,121.4870555],[31.2332142,121.4868043],[31.2332409,121.4867925],[31.2331392,121.4864304],[31.2331791,121.4864132],[31.2332727,121.4863783]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2332364,121.4869422],[31.2332698,121.4870633],[31.2330632,121.4871412],[31.2330298,121.4870201],[31.2332364,121.4869422]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2326304,121.4843313],[31.2326995,121.4845632],[31.2326184,121.4845981],[31.2326022,121.4846044],[31.2325327,121.4843712],[31.2326304,121.4843313]],region:"bund_edge"},{name:"\u7D2B\u9526\u57CE\u767E\u8D27",h:28.8,ring:[[31.2306877,121.4863944],[31.2306817,121.4868482],[31.230272,121.4868407],[31.230278,121.4863869],[31.2306877,121.4863944]],region:"bund_edge"},{name:"\u5916\u6EE9NEO",h:28.8,ring:[[31.2312559,121.486913],[31.2312432,121.4874492],[31.230786,121.4874344],[31.2307987,121.4868982],[31.2312559,121.486913]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2325947,121.4861543],[31.2326206,121.4862771],[31.2321713,121.4864069],[31.2321453,121.486284],[31.2325947,121.4861543]],region:"bund_edge"},{name:"",h:38.4,ring:[[31.2327585,121.4885218],[31.2329123,121.489],[31.2327774,121.4890643],[31.232623,121.488582],[31.2327585,121.4885218]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2330606,121.4864956],[31.2331411,121.4864642],[31.2331666,121.4865536],[31.2331341,121.4865662],[31.2331938,121.4867758],[31.2331458,121.4867945],[31.2330606,121.4864956]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2327309,121.4845498],[31.2328088,121.4847979],[31.2327965,121.4848032],[31.2327012,121.4848441],[31.2326963,121.4848462],[31.2326184,121.4845981],[31.2326995,121.4845632],[31.2327309,121.4845498]],region:"bund_edge"},{name:"\u798F\u4F51\u5546\u53A6",h:28.8,ring:[[31.2306603,121.4870455],[31.2306595,121.4874437],[31.2299133,121.4874417],[31.2299141,121.4870435],[31.2306603,121.4870455]],region:"bund_edge"},{name:"\u6CAA\u5357\u94B1\u4E1A\u516C\u6240",h:3.2,ring:[[31.2306535,121.4882651],[31.2306627,121.4884657],[31.2305,121.4884759],[31.2303827,121.4884833],[31.2303776,121.4883724],[31.2303735,121.4882827],[31.2306535,121.4882651]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2330009,121.4858343],[31.2330298,121.4859363],[31.2330469,121.4859964],[31.2330909,121.4861517],[31.2329454,121.4861866],[31.232864,121.4858964],[31.2329515,121.4858604],[31.2330009,121.4858343]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2327309,121.4871899],[31.232749,121.4872534],[31.232627,121.4873011],[31.2326089,121.4872376],[31.2327309,121.4871899]],region:"bund_edge"},{name:"\u57CE\u968D\u5E99\u7B2C\u4E00\u8D2D\u7269\u4E2D\u5FC3",h:19.2,ring:[[31.2305589,121.4854244],[31.230564,121.4858965],[31.2300577,121.485904],[31.2300012,121.4858472],[31.2299712,121.4857747],[31.2299674,121.4854332],[31.2305589,121.4854244]],region:"bund_edge"},{name:"\u8C6B\u56ED\u9102\u5C14\u591A\u65AF\u5E7F\u573A",h:19.2,ring:[[31.230558,121.4844651],[31.2305522,121.4850455],[31.2300035,121.485038],[31.2300068,121.4847017],[31.2304078,121.4847071],[31.2304104,121.4844512],[31.230558,121.4844651]],region:"bund_edge"},{name:"\u51EF\u77F3\u5927\u53A6",h:32,ring:[[31.2348197,121.4871195],[31.2348918,121.4873494],[31.2347661,121.4875091],[31.2346537,121.4873654],[31.2346362,121.4871919],[31.2348197,121.4871195]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2347463,121.4868191],[31.2348197,121.4871195],[31.2346362,121.4871919],[31.2345583,121.48687],[31.2347463,121.4868191]],region:"bund_edge"},{name:"",h:32,ring:[[31.2341903,121.4858521],[31.2342681,121.4860558],[31.2341728,121.4861056],[31.234095,121.485902],[31.2341903,121.4858521]],region:"bund_edge"},{name:"",h:32,ring:[[31.2345881,121.4864623],[31.234478,121.4864865],[31.2345583,121.48687],[31.2347463,121.4868191],[31.2345881,121.4864623]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2344013,121.4866338],[31.2344438,121.4868988],[31.2343967,121.4869092],[31.2344081,121.4869801],[31.2343251,121.4869983],[31.2342712,121.4866623],[31.2344013,121.4866338]],region:"bund_edge"},{name:"",h:32,ring:[[31.2342464,121.4863098],[31.2343068,121.4866112],[31.2342171,121.4866358],[31.2341567,121.4863344],[31.2342464,121.4863098]],region:"bund_edge"},{name:"",h:32,ring:[[31.2343128,121.4860654],[31.2343508,121.4861565],[31.2343726,121.4861699],[31.2343977,121.4862398],[31.2341455,121.4862733],[31.2341167,121.4861459],[31.2343128,121.4860654]],region:"bund_edge"},{name:"\u5916\u6EE9\u53F2\u9648\u5217\u5BA4",h:6.4,ring:[[31.235213,121.4876897],[31.2352521,121.4877521],[31.2351063,121.487877],[31.2350672,121.4878146],[31.235213,121.4876897]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2340248,121.4862664],[31.2337765,121.4863636],[31.2337294,121.486199],[31.2339776,121.4861017],[31.2340248,121.4862664]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2339463,121.4861007],[31.2338131,121.4861467],[31.233783,121.4860274],[31.2339162,121.4859814],[31.2339463,121.4861007]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2334511,121.4878921],[31.2333411,121.4879339],[31.233139,121.487205],[31.233249,121.4871633],[31.2334511,121.4878921]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2341249,121.4866327],[31.2338916,121.4867147],[31.2338745,121.4866484],[31.2338948,121.4866413],[31.2338709,121.4865482],[31.2340839,121.4864733],[31.2341249,121.4866327]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2338404,121.4869171],[31.2337513,121.4869478],[31.2337187,121.4868185],[31.233741,121.4868108],[31.2337095,121.4866853],[31.2337764,121.4866623],[31.2338404,121.4869171]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.233557,121.4880162],[31.233585,121.4881263],[31.233482,121.4881621],[31.233454,121.4880519],[31.233557,121.4880162]],region:"bund_edge"},{name:"\u8054\u8C0A\u5927\u53A6",h:9.6,ring:[[31.2352955,121.4852224],[31.235377,121.4855411],[31.2352469,121.485593],[31.23496,121.4857077],[31.2349246,121.4857218],[31.2348951,121.4856826],[31.2348657,121.4856434],[31.2348199,121.4854931],[31.234864,121.4853868],[31.2351602,121.4852739],[31.2352955,121.4852224]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2334474,121.4870984],[31.2334818,121.4871459],[31.233665,121.4878161],[31.2335902,121.4878433],[31.233549,121.4878584],[31.2333496,121.4871344],[31.2334474,121.4870984]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2335767,121.4878701],[31.2336105,121.4879942],[31.2335854,121.4880034],[31.233557,121.4880162],[31.233454,121.4880519],[31.2334459,121.4880563],[31.2334119,121.4879316],[31.2335767,121.4878701]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2358319,121.4851878],[31.2358826,121.4853657],[31.2357272,121.4854294],[31.2356432,121.4851095],[31.2357162,121.4850805],[31.2357585,121.485095],[31.2357936,121.4851209],[31.235814,121.4851501],[31.2358319,121.4851878]],region:"bund_edge"},{name:"Bund 15",h:35.2,ring:[[31.2329195,121.4888958],[31.2331973,121.4887553],[31.2331787,121.4886894],[31.2335286,121.4883567],[31.2336331,121.488708],[31.2330421,121.4893038],[31.2330198,121.4892263],[31.2329713,121.4890683],[31.2329195,121.4888958]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2340365,121.4864605],[31.2338053,121.4865403],[31.2337693,121.4863975],[31.2340004,121.4863177],[31.2340365,121.4864605]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.233783,121.4861507],[31.2336951,121.4861811],[31.2336661,121.4860663],[31.2337541,121.4860359],[31.233783,121.4861507]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.233665,121.4878161],[31.2337035,121.4879608],[31.2336288,121.487988],[31.2335902,121.4878433],[31.233665,121.4878161]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2341385,121.4868495],[31.2339045,121.4869302],[31.2338622,121.4867623],[31.2340961,121.4866815],[31.2341385,121.4868495]],region:"bund_edge"},{name:"",h:48,ring:[[31.2338829,121.4869877],[31.2339053,121.4870709],[31.2338271,121.4870998],[31.2338941,121.4873482],[31.2339515,121.4873271],[31.2339687,121.4873907],[31.2338186,121.487446],[31.2337974,121.4874198],[31.233786,121.4873777],[31.2337639,121.4873859],[31.2336769,121.4870638],[31.2338829,121.4869877]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2341309,121.4869281],[31.2342284,121.4873043],[31.2340209,121.4873779],[31.2339233,121.4870017],[31.2341309,121.4869281]],region:"bund_edge"},{name:"\u4E1C\u65B9\u996D\u5E97",h:89.6,ring:[[31.2337354,121.4881188],[31.2334593,121.4882328],[31.2334877,121.4883373],[31.2335676,121.4883075],[31.233583,121.4883666],[31.2336376,121.4883718],[31.2336549,121.4884416],[31.2336268,121.4884736],[31.2336472,121.4885498],[31.2337173,121.4886465],[31.2338117,121.4885535],[31.2338245,121.4884707],[31.2337354,121.4881188]],region:"bund_edge"},{name:"\u82E5\u745F\u5802",h:6.4,ring:[[31.2326974,121.4856928],[31.2327416,121.4856746],[31.2327661,121.485756],[31.2325769,121.4858339],[31.2325524,121.4857525],[31.2326094,121.485729],[31.2325566,121.4855511],[31.2324715,121.4855856],[31.2324449,121.4854958],[31.2325299,121.4854613],[31.2325052,121.485378],[31.2325937,121.4853421],[31.2326185,121.4854255],[31.2326973,121.4853936],[31.2327237,121.4854829],[31.2326447,121.4855149],[31.2326974,121.4856928]],region:"bund_edge"},{name:"",h:16,ring:[[31.2343853,121.4838182],[31.2344421,121.484087],[31.2343214,121.4841234],[31.2342631,121.483853],[31.2343853,121.4838182]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2344501,121.4843924],[31.2341093,121.4845063],[31.2340381,121.4842331],[31.2341643,121.484192],[31.2344332,121.4841133],[31.234447,121.4841752],[31.2344059,121.4841896],[31.2344501,121.4843924]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2346914,121.4837105],[31.2347512,121.4840041],[31.2346309,121.4840425],[31.2345711,121.4837497],[31.2346914,121.4837105]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2354694,121.4839095],[31.2355491,121.4841486],[31.2354613,121.4841823],[31.2354092,121.484203],[31.2353296,121.4839601],[31.2353985,121.4839342],[31.2354694,121.4839095]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2335204,121.4854639],[31.2338014,121.4853245],[31.2338738,121.4855239],[31.2335929,121.4856634],[31.2335204,121.4854639]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2354161,121.4847234],[31.2354692,121.4848944],[31.235228,121.484997],[31.2351748,121.484826],[31.2354161,121.4847234]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2345385,121.4837604],[31.2345939,121.4840413],[31.2344771,121.4840802],[31.2344218,121.4837981],[31.2345385,121.4837604]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2348391,121.4836693],[31.2348986,121.483955],[31.2347813,121.4839932],[31.2347232,121.4837097],[31.2348391,121.4836693]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2334184,121.4852426],[31.2337349,121.4850924],[31.2337961,121.4852689],[31.2334796,121.4854191],[31.2334184,121.4852426]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2428992,121.4823078],[31.2427776,121.482348],[31.2427444,121.4824164],[31.2427432,121.4827396],[31.2427719,121.4827866],[31.2427983,121.4828107],[31.2429129,121.482808],[31.2429136,121.4826801],[31.2428552,121.4826817],[31.2428567,121.4824513],[31.2429302,121.4824226],[31.2428992,121.4823078]],region:"bund_edge"},{name:"",h:16,ring:[[31.2431485,121.4823123],[31.2433211,121.4823132],[31.2433194,121.4827959],[31.2431468,121.4827951],[31.2431485,121.4823123]],region:"bund_edge"},{name:"\u4E9A\u6D32\u6587\u4F1A\u5927\u697C",h:19.2,ring:[[31.2432308,121.4829615],[31.2432614,121.4833064],[31.2431489,121.4833201],[31.2431182,121.4829752],[31.2432308,121.4829615]],region:"bund_edge"},{name:"\u5706\u660E\u56ED\u516C\u5BD3",h:19.2,ring:[[31.2435419,121.4836351],[31.243501,121.4836929],[31.2432411,121.4837319],[31.2432188,121.4835176],[31.2432162,121.4834923],[31.2435198,121.4834471],[31.2435419,121.4836351]],region:"bund_edge"},{name:"",h:16,ring:[[31.2427291,121.4833359],[31.2428949,121.4833356],[31.2428942,121.4837374],[31.2427238,121.4837256],[31.2427291,121.4833359]],region:"bund_edge"},{name:"\u4E2D\u5B9E\u5927\u697C",h:22.4,ring:[[31.2427308,121.4830428],[31.2427291,121.4833359],[31.2428949,121.4833356],[31.2430681,121.4833326],[31.2430264,121.4829712],[31.2427765,121.482991],[31.2427544,121.4830024],[31.2427409,121.4830203],[31.2427308,121.4830428]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2426198,121.4823521],[31.2421776,121.4825069],[31.2422343,121.4826255],[31.2423395,121.482583],[31.2424662,121.4825345],[31.2424627,121.4829462],[31.2426233,121.4829489],[31.2426347,121.4823736],[31.2426198,121.4823521]],region:"bund_edge"},{name:"\u6C99\u7F8E\u5927\u697C",h:16,ring:[[31.2428323,121.4816975],[31.2426931,121.4817469],[31.2427199,121.4821146],[31.2427328,121.482131],[31.2427502,121.4821404],[31.2429248,121.4820809],[31.2428323,121.4816975]],region:"bund_edge"},{name:"",h:38.4,ring:[[31.2439556,121.4833603],[31.2438355,121.4833748],[31.2438224,121.4832515],[31.2437976,121.4830185],[31.2439171,121.4830203],[31.2439556,121.4833603]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2386772,121.4830422],[31.238707,121.4830639],[31.2387286,121.4831058],[31.2387587,121.4832443],[31.2384608,121.483333],[31.2384145,121.4831206],[31.2386772,121.4830422]],region:"bund_edge"},{name:"\u7231\u5EFA\u91D1\u878D\u5927\u697C",h:25.6,ring:[[31.2387749,121.4832958],[31.2388496,121.4836161],[31.2386085,121.483693],[31.2385895,121.4836121],[31.2386033,121.4835947],[31.2385727,121.4834591],[31.2385523,121.4834528],[31.2385336,121.4833727],[31.2387749,121.4832958]],region:"bund_edge"},{name:"\u4E0A\u6295\u5927\u53A6",h:41.6,ring:[[31.2391574,121.483189],[31.2392411,121.4834941],[31.2389343,121.4835819],[31.2388639,121.4833115],[31.2389718,121.4832743],[31.2389647,121.4832359],[31.2391574,121.483189]],region:"bund_edge"},{name:"\u5EFA\u8BBE\u5927\u53A6",h:57.6,ring:[[31.2367788,121.4827058],[31.2367737,121.4827259],[31.2367726,121.4827541],[31.2367738,121.4827836],[31.2367796,121.4828155],[31.2367106,121.4828375],[31.2366747,121.4826771],[31.2367173,121.4825685],[31.236852,121.482527],[31.2368623,121.4825238],[31.2368831,121.4826197],[31.2368598,121.4826272],[31.2368392,121.4826346],[31.2368199,121.4826477],[31.2368028,121.4826606],[31.236793,121.4826761],[31.2367873,121.4826891],[31.2367788,121.4827058]],region:"bund_edge"},{name:"",h:112,ring:[[31.2318197,121.4829887],[31.2314623,121.4830882],[31.2314303,121.4830563],[31.2314024,121.4830202],[31.2313845,121.4829656],[31.2313803,121.4829094],[31.2313938,121.4828553],[31.2314259,121.4828177],[31.2314633,121.4828029],[31.2316942,121.4827266],[31.2317419,121.4827216],[31.2317798,121.4827309],[31.2318089,121.4827517],[31.23183,121.4827825],[31.2318468,121.4828133],[31.231855,121.4828527],[31.2318556,121.4828896],[31.2318502,121.4829264],[31.2318386,121.4829597],[31.2318197,121.4829887]],region:"bund_edge"},{name:"\u4E2D\u56FD\u90AE\u653F\u50A8\u84C4\u94F6\u884C\u4E0A\u6D77\u5206\u884C",h:19.2,ring:[[31.2399919,121.4845019],[31.2400704,121.4847939],[31.2397892,121.484896],[31.2397106,121.484609],[31.2399919,121.4845019]],region:"bund_edge"},{name:"\u4E1C\u4E9A\u5927\u697C",h:22.4,ring:[[31.2392411,121.4834941],[31.2392749,121.483617],[31.2392695,121.483653],[31.2392469,121.4836991],[31.2389274,121.4838088],[31.2389009,121.4836849],[31.2390141,121.4836531],[31.2390028,121.4835962],[31.2391119,121.483567],[31.2391216,121.4836115],[31.2391714,121.4835929],[31.2391568,121.4835201],[31.2392411,121.4834941]],region:"bund_edge"},{name:"\u7535\u89C6\u793E\u6742\u5FD7\u793E",h:16,ring:[[31.2414956,121.482797],[31.2415105,121.4827576],[31.2418119,121.4826328],[31.2418399,121.4827255],[31.2417576,121.4828124],[31.2417055,121.4827703],[31.2415533,121.4828333],[31.2415857,121.4829405],[31.2416488,121.4829144],[31.2416874,121.4830418],[31.2415828,121.4830851],[31.2414956,121.482797]],region:"bund_edge"},{name:"\u4EC1\u8BB0\u6D0B\u884C\u5927\u697C",h:12.8,ring:[[31.241594,121.4831134],[31.2415568,121.4834446],[31.2415461,121.4834545],[31.2415432,121.4834743],[31.2415505,121.4834874],[31.2415635,121.4834903],[31.2415749,121.4834796],[31.2417613,121.4835095],[31.2417887,121.4832731],[31.2417244,121.4832604],[31.2417397,121.4831364],[31.241594,121.4831134]],region:"bund_edge"},{name:"\u4E2D\u56FD\u6C11\u751F\u94F6\u884C\u5916\u6EE9\u652F\u884C",h:9.6,ring:[[31.2356384,121.4844642],[31.2357376,121.4848289],[31.2357085,121.484897],[31.2355241,121.4849613],[31.2354036,121.4844869],[31.2354653,121.484467],[31.2354809,121.4845237],[31.2354924,121.4845206],[31.2356384,121.4844642]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2334994,121.4867604],[31.2335714,121.48704],[31.2337061,121.4869926],[31.2336341,121.4867129],[31.2334994,121.4867604]],region:"bund_edge"},{name:"\u91D1\u9675\u5927\u697C",h:19.2,ring:[[31.2333969,121.4861723],[31.2335594,121.4861091],[31.2335985,121.4862466],[31.2335445,121.4862706],[31.2335797,121.4863936],[31.2336341,121.4863718],[31.233654,121.4864419],[31.2334894,121.4864998],[31.2335026,121.486555],[31.233451,121.4865687],[31.233368,121.4862481],[31.2333969,121.4861723]],region:"bund_edge"},{name:"\u4E30\u534E\u5927\u697C",h:16,ring:[[31.2326215,121.4897238],[31.2328325,121.4895125],[31.2327575,121.4892832],[31.2324988,121.4894341],[31.2326215,121.4897238]],region:"bund_edge"},{name:"\u8336\u5BA4",h:3,ring:[[31.2300446,121.4889711],[31.2300712,121.4890627],[31.2301213,121.4890428],[31.2300947,121.4889512],[31.2300446,121.4889711]],region:"bund_edge"},{name:"",h:3,ring:[[31.2308996,121.4882014],[31.2308182,121.4882057],[31.230822,121.4883033],[31.2309619,121.4882958],[31.231035,121.4882919],[31.2310312,121.4881944],[31.2308996,121.4882014]],region:"bund_edge"},{name:"",h:3,ring:[[31.2310072,121.4901297],[31.2309578,121.4900804],[31.2308498,121.4902191],[31.2308696,121.4902468],[31.2308518,121.4902745],[31.2308801,121.4903038],[31.2309097,121.4902614],[31.2310072,121.4901297]],region:"bund_edge"},{name:"\u6D66\u4E1C\u7F8E\u672F\u9986",h:30,ring:[[31.24049,121.491529],[31.2399993,121.4915317],[31.2400004,121.4916162],[31.2399763,121.4916149],[31.2399752,121.4916967],[31.2399396,121.4917074],[31.2398869,121.49158],[31.2397688,121.4916511],[31.2398422,121.4918134],[31.2398078,121.4918388],[31.2399488,121.4921258],[31.239927,121.4921406],[31.2401288,121.4925389],[31.2406483,121.4921822],[31.2406035,121.4920816],[31.2407102,121.4920092],[31.24049,121.491529]],region:"bund_edge"},{name:"\u534E\u4FA8\u5927\u697C",h:25.6,ring:[[31.2397162,121.4831665],[31.2393811,121.483297],[31.2393262,121.4830771],[31.2396643,121.482959],[31.2397162,121.4831665]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2410084,121.4830009],[31.2411011,121.4832748],[31.2410243,121.4833239],[31.2409924,121.4832313],[31.2409398,121.4832585],[31.2408741,121.4830616],[31.2410084,121.4830009]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2414755,121.483111],[31.241105,121.4832864],[31.2411011,121.4832748],[31.2410084,121.4830009],[31.2413548,121.4828435],[31.24139,121.4828579],[31.2414755,121.483111]],region:"bund_edge"},{name:"\u5609\u9675\u5927\u697C",h:51.2,ring:[[31.240274,121.4836659],[31.2400493,121.4837474],[31.2400057,121.4835761],[31.2400432,121.4835592],[31.2403941,121.4833932],[31.2404333,121.4835727],[31.2402664,121.4836351],[31.240274,121.4836659]],region:"bund_edge"},{name:"\u65B0\u9EC4\u6D66\u91D1\u878D\u5927\u53A6",h:51.2,ring:[[31.2404647,121.483701],[31.2405884,121.4843419],[31.2403637,121.484405],[31.2403817,121.4844887],[31.2402409,121.4845302],[31.2400796,121.4838305],[31.2404647,121.483701]],region:"bund_edge"},{name:"\u62DB\u5546\u94F6\u884C",h:19.2,ring:[[31.239912,121.4848802],[31.2397547,121.4849411],[31.2398775,121.485424],[31.2400365,121.4853901],[31.239912,121.4848802]],region:"bund_edge"},{name:"\u53CB\u90A6\u5927\u53A6",h:32,ring:[[31.2400915,121.484817],[31.2399512,121.4848763],[31.2400789,121.4853869],[31.2402324,121.4853516],[31.2400915,121.484817]],region:"bund_edge"},{name:"\u5916\u6EE918\u53F7",h:22.4,ring:[[31.2403917,121.4846985],[31.2401448,121.4847948],[31.2402783,121.485328],[31.2405467,121.485303],[31.2405353,121.4851957],[31.2405146,121.4851984],[31.2403917,121.4846985]],region:"bund_edge"},{name:"",h:32,ring:[[31.2399401,121.4836034],[31.2400278,121.4839665],[31.239826,121.484043],[31.2397456,121.4837237],[31.2397947,121.4836752],[31.2398542,121.4836343],[31.2399401,121.4836034]],region:"bund_edge"},{name:"\u4E2D\u592E\u5927\u53A6",h:57.6,ring:[[31.2398243,121.4831874],[31.2398653,121.4833412],[31.2395357,121.4835229],[31.2394499,121.4834704],[31.2394167,121.4833367],[31.2398243,121.4831874]],region:"bund_edge"},{name:"\u4E2D\u592E\u5546\u573A",h:25.6,ring:[[31.2399078,121.4828971],[31.2402131,121.482775],[31.2402867,121.4830423],[31.2402987,121.483098],[31.2402879,121.4831518],[31.2402637,121.4832008],[31.2400187,121.4832998],[31.2399078,121.4828971]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2412271,121.4824257],[31.2412973,121.4826557],[31.2413014,121.4826818],[31.2412991,121.482703],[31.2412872,121.4827241],[31.2412674,121.4827359],[31.2411114,121.4828006],[31.2410767,121.4826972],[31.2410719,121.48268],[31.2411192,121.4826567],[31.2410934,121.4825762],[31.2411176,121.4825634],[31.2410946,121.4824821],[31.2411176,121.4824723],[31.2412271,121.4824257]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u9AD8\u6280\u80FD\u4EBA\u624D\u57F9\u517B\u57FA\u5730",h:19.2,ring:[[31.2411442,121.4821541],[31.2412271,121.4824257],[31.2411176,121.4824723],[31.2410345,121.4822045],[31.2410638,121.48219],[31.2411442,121.4821541]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2408408,121.4823056],[31.2409664,121.4826819],[31.2408773,121.4827296],[31.2407477,121.482349],[31.2408408,121.4823056]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2406575,121.4824117],[31.240776,121.4827765],[31.2406769,121.4828285],[31.2406261,121.4828296],[31.2405941,121.4827902],[31.2405074,121.4825162],[31.2405215,121.4824791],[31.2405618,121.482455],[31.2406575,121.4824117]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2406398,121.4820191],[31.2407289,121.4823197],[31.2406216,121.4823661],[31.2405194,121.4820905],[31.2406398,121.4820191]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2407156,121.4819706],[31.2406811,121.4818474],[31.2409291,121.4817441],[31.2409442,121.4817919],[31.2410554,121.4821628],[31.2407471,121.4822918],[31.240692,121.4821148],[31.2406884,121.4819967],[31.2407156,121.4819706]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2404642,121.4820977],[31.2405711,121.4824037],[31.2404964,121.4824469],[31.2403871,121.4821338],[31.2404642,121.4820977]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.238397,121.4845737],[31.2384618,121.4848774],[31.2384604,121.4848769],[31.2383577,121.4849073],[31.238293,121.484604],[31.238397,121.4845737]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2374902,121.4819284],[31.2375608,121.4822609],[31.2372742,121.4823442],[31.2372035,121.4820117],[31.2374902,121.4819284]],region:"bund_edge"}];var Qd={buildings:[{name:"\u4E0A\u6D77\u90AE\u653F\u603B\u5C40\u5927\u697C",h:16,ring:[[31.2464453,121.4810923],[31.246883,121.481042],[31.2469346,121.4809268],[31.2465875,121.4801521],[31.2464322,121.4799147],[31.2460146,121.4802831],[31.2463532,121.4810352],[31.2464453,121.4810923]],region:"northbund"},{name:"\u5973\u9752\u5E74\u4F1A\u5927\u697C",h:25.6,ring:[[31.2438506,121.4836037],[31.2435849,121.4836459],[31.2435713,121.4835062],[31.2437166,121.4834836],[31.2437085,121.4834007],[31.2435623,121.4834158],[31.2435511,121.4832911],[31.2436436,121.4832771],[31.2438148,121.4832512],[31.2438348,121.483444],[31.2438506,121.4836037]],region:"northbund"},{name:"\u54C8\u5BC6\u5927\u697C",h:22.4,ring:[[31.2440599,121.4835669],[31.2438506,121.4836037],[31.2438348,121.483444],[31.2440442,121.4834174],[31.2440599,121.4835669]],region:"northbund"},{name:"\u534F\u8FDB\u5927\u697C",h:19.2,ring:[[31.244533,121.4835023],[31.2440864,121.483564],[31.2440696,121.4833975],[31.2445152,121.4833188],[31.24452,121.4833684],[31.244533,121.4835023]],region:"northbund"},{name:"\u539F\u65B0\u5929\u5B89\u5802",h:19.2,ring:[[31.2452547,121.4838286],[31.2452176,121.4839327],[31.2451391,121.4839],[31.2451244,121.4839442],[31.2450462,121.4839127],[31.2450593,121.4838677],[31.2450154,121.4838497],[31.2450498,121.4837408],[31.2450884,121.4837573],[31.2451022,121.4837132],[31.2451839,121.4837491],[31.2451703,121.4837924],[31.2452547,121.4838286]],region:"northbund"},{name:"\u4FC4\u7F57\u65AF\u9886\u4E8B\u9986",h:16,ring:[[31.2458781,121.4862094],[31.2457169,121.4861875],[31.2456921,121.48624],[31.2456944,121.486326],[31.245668,121.4864859],[31.245645,121.4864859],[31.2456314,121.4866266],[31.2458455,121.4866433],[31.2458781,121.4862094]],region:"northbund"},{name:"\u65B0\u4E9A\u5927\u9152\u5E97",h:25.6,ring:[[31.2473652,121.480706],[31.2474502,121.4808948],[31.2474502,121.4809677],[31.2474218,121.4810041],[31.2471726,121.4810373],[31.2471358,121.4810174],[31.2471018,121.4809644],[31.2467362,121.4800914],[31.2466877,121.4800141],[31.2466735,121.4799638],[31.2466793,121.479906],[31.2467022,121.4798759],[31.2467366,121.4798562],[31.2467869,121.4798341],[31.2471978,121.4808213],[31.2473652,121.480706]],region:"northbund"},{name:"\u745E\u5EB7\u516C\u5BD3",h:16,ring:[[31.2471126,121.4814714],[31.2470056,121.4815127],[31.2469781,121.4814081],[31.2469666,121.4813759],[31.246952,121.4813614],[31.2469245,121.481356],[31.2466356,121.481399],[31.2466104,121.4814097],[31.2465928,121.4814242],[31.246576,121.4814472],[31.2465714,121.4814741],[31.2466066,121.4816468],[31.246524,121.4816763],[31.2464751,121.4814714],[31.2464782,121.4814242],[31.2464888,121.4813695],[31.2465057,121.4813303],[31.2465278,121.4813024],[31.2465668,121.4812809],[31.246602,121.4812659],[31.2469529,121.4812257],[31.2469887,121.481238],[31.2470377,121.4812766],[31.2470621,121.4813078],[31.2470805,121.4813373],[31.2471126,121.4814714]],region:"northbund"},{name:"\u56FD\u9645\u6E2F\u52A1\u5927\u53A6",h:70.4,ring:[[31.2484608,121.4911041],[31.2485109,121.4911072],[31.2485384,121.4911179],[31.248559,121.4911367],[31.248569,121.4911588],[31.2485685,121.491178],[31.2485682,121.4911876],[31.2485636,121.4912601],[31.2485499,121.4913405],[31.2485109,121.491472],[31.2484621,121.4915542],[31.2484536,121.4915685],[31.2484306,121.4915819],[31.2484131,121.491588],[31.2483925,121.4915772],[31.2483649,121.4915585],[31.2483076,121.4915048],[31.2482296,121.4914136],[31.248154,121.4912849],[31.2481402,121.4912527],[31.2481394,121.4912225],[31.2481494,121.491199],[31.2481692,121.4911769],[31.2482059,121.4911528],[31.2483229,121.4911206],[31.2484608,121.4911041]],region:"northbund"},{name:"",h:32,ring:[[31.2428519,121.4843432],[31.2428512,121.4843927],[31.2430617,121.4843969],[31.2430625,121.4843447],[31.2430942,121.4843454],[31.2430954,121.4842646],[31.2430978,121.4841064],[31.2430983,121.4840698],[31.2430989,121.4840295],[31.2430672,121.4840288],[31.2430678,121.4839862],[31.2428573,121.4839819],[31.2428566,121.4840274],[31.2428329,121.4840269],[31.2428319,121.4840953],[31.2428294,121.4842616],[31.2428282,121.4843427],[31.2428519,121.4843432]],region:"northbund"},{name:"",h:41.6,ring:[[31.2436646,121.4847848],[31.2434161,121.4847893],[31.2434152,121.4850713],[31.2434323,121.4850691],[31.2434314,121.4852154],[31.2436515,121.4852177],[31.2436524,121.4850649],[31.2436665,121.4850653],[31.2436646,121.4847848]],region:"northbund"},{name:"",h:32,ring:[[31.2437207,121.4852184],[31.2436515,121.4852177],[31.2434314,121.4852154],[31.2432047,121.485213],[31.2432024,121.485256],[31.2431898,121.485256],[31.2431824,121.4855143],[31.243199,121.4855135],[31.2431982,121.4855517],[31.2433699,121.4855538],[31.2433701,121.4855137],[31.2433828,121.4855133],[31.2433859,121.4854303],[31.2435349,121.4854303],[31.2435349,121.4854974],[31.2437185,121.4854933],[31.2437188,121.4854491],[31.2437323,121.4854488],[31.2437331,121.4852626],[31.2437203,121.4852627],[31.2437207,121.4852184]],region:"northbund"},{name:"\u683C\u6797\u90AE\u8239\u5927\u697C",h:28.8,ring:[[31.2430054,121.4849163],[31.2427419,121.4849198],[31.2427415,121.4852843],[31.2427163,121.4852839],[31.2427162,121.4855821],[31.2427415,121.4855848],[31.2427419,121.4856306],[31.2429043,121.4856304],[31.2429089,121.4851985],[31.2429433,121.4851985],[31.2429437,121.4852337],[31.2430029,121.4852334],[31.2430054,121.4849163]],region:"northbund"},{name:"\u4E1C\u65B9\u6C47\u7406\u94F6\u884C\u5927\u697C",h:19.2,ring:[[31.2431434,121.4849297],[31.243042,121.4849278],[31.2430384,121.4851982],[31.2430625,121.4851986],[31.2430614,121.4852826],[31.2429396,121.4852804],[31.2429349,121.4856298],[31.2431339,121.4856334],[31.2431434,121.4849297]],region:"northbund"},{name:"\u4E0A\u6D77\u5916\u6EE9\u8302\u60A6\u5927\u9152\u5E97",h:12.8,ring:[[31.247799,121.4887708],[31.2476066,121.4890909],[31.2472603,121.4892684],[31.247209,121.4891834],[31.2472218,121.4890459],[31.2473458,121.4888608],[31.2471577,121.4885333],[31.2468691,121.4885433],[31.2467644,121.4884183],[31.2467729,121.4883083],[31.2472817,121.4879508],[31.2475125,121.4880683],[31.247799,121.4887708]],region:"northbund"},{name:"\u5149\u9646\u5927\u697C",h:16,ring:[[31.2454744,121.4832127],[31.2450626,121.4832741],[31.2450431,121.4832768],[31.2450329,121.4831152],[31.2450685,121.4831077],[31.2450585,121.4829929],[31.2451392,121.4829899],[31.2452272,121.4829971],[31.2452955,121.4830184],[31.2453636,121.4830505],[31.2454096,121.483081],[31.2454398,121.4831142],[31.2454653,121.4831596],[31.2454744,121.4832127]],region:"northbund"},{name:"",h:25.6,ring:[[31.2466916,121.4870691],[31.246741,121.4870812],[31.2467766,121.4871148],[31.2467697,121.4871739],[31.2467307,121.4872142],[31.2464182,121.4875099],[31.2463757,121.4875206],[31.2463159,121.4875045],[31.246255,121.4874467],[31.2462022,121.4873459],[31.2461769,121.4872237],[31.2461884,121.4871121],[31.2462114,121.4870503],[31.2462367,121.4870248],[31.2462527,121.4870181],[31.2466916,121.4870691]],region:"northbund"},{name:"",h:32,ring:[[31.2450352,121.4821201],[31.2450539,121.4822753],[31.2447659,121.4823229],[31.2447472,121.4821676],[31.2450352,121.4821201]],region:"northbund"},{name:"",h:22.4,ring:[[31.2453704,121.4820593],[31.2453967,121.4822531],[31.2451322,121.4823021],[31.2451059,121.4821083],[31.2453704,121.4820593]],region:"northbund"},{name:"\u4F73\u5229\u5546\u52A1\u697C",h:32,ring:[[31.2449772,121.4815786],[31.2450327,121.4820797],[31.2449042,121.4820974],[31.2448736,121.481852],[31.2449396,121.4818367],[31.2449325,121.4817761],[31.2448537,121.481788],[31.244833,121.4816309],[31.2449772,121.4815786]],region:"northbund"},{name:"\u534E\u5FB7\u5927\u697C",h:22.4,ring:[[31.2446847,121.4816927],[31.2447305,121.482076],[31.2447517,121.4820929],[31.2448529,121.4820763],[31.2448024,121.4816528],[31.2447357,121.4816637],[31.2447382,121.4816839],[31.2446847,121.4816927]],region:"northbund"},{name:"\u6D66\u6C5F\u996D\u5E97",h:22.4,ring:[[31.2465589,121.486555],[31.2465254,121.4867732],[31.2460141,121.4866658],[31.2461056,121.4860697],[31.24626,121.4861022],[31.246202,121.48648],[31.2465589,121.486555]],region:"northbund"},{name:"",h:38.4,ring:[[31.2442705,121.4796821],[31.2442437,121.4797187],[31.244207,121.4796819],[31.2441623,121.4797427],[31.2442109,121.4797914],[31.2441991,121.4798074],[31.244455,121.4800645],[31.2445375,121.4799494],[31.2442705,121.4796821]],region:"northbund"},{name:"",h:25.6,ring:[[31.2453575,121.4820193],[31.2453024,121.4816169],[31.2452855,121.4815568],[31.2452696,121.4815272],[31.2452453,121.4815065],[31.2452154,121.4814944],[31.2451864,121.4814999],[31.2449945,121.4815718],[31.2450527,121.4820798],[31.2453575,121.4820193]],region:"northbund"},{name:"",h:19.2,ring:[[31.2446911,121.4824344],[31.244523,121.482464],[31.2445669,121.4828487],[31.2447418,121.4828536],[31.2446911,121.4824344]],region:"northbund"},{name:"\u6C38\u5174\u5927\u697C",h:19.2,ring:[[31.2444833,121.4824835],[31.2443217,121.4825116],[31.2443297,121.4825877],[31.244353,121.4828074],[31.2443573,121.4828483],[31.2445253,121.4828526],[31.2444833,121.4824835]],region:"northbund"},{name:"\u76DB\u90A6\u56FD\u9645\u5927\u53A6",h:80,ring:[[31.2536822,121.4800083],[31.2537288,121.4804464],[31.2530697,121.4805586],[31.253023,121.4801312],[31.2536822,121.4800083]],region:"northbund"},{name:"\u5B89\u57F9\u6D0B\u884C\u5927\u697C",h:9.6,ring:[[31.2432188,121.4835176],[31.2432411,121.4837319],[31.2430065,121.483769],[31.2429741,121.4837652],[31.2429549,121.4837461],[31.2429359,121.4835673],[31.2432188,121.4835176]],region:"northbund"},{name:"\u4E2D\u4E00\u5927\u697C",h:16,ring:[[31.2429752,121.4802068],[31.2430024,121.4803853],[31.2425867,121.4804911],[31.2425763,121.480268],[31.2429752,121.4802068]],region:"northbund"},{name:"\u4E0A\u6D77\u5916\u6EE9 W \u9152\u5E97",h:172,ring:[[31.2511448,121.4921154],[31.251121,121.4921643],[31.2510926,121.4921889],[31.2510856,121.492195],[31.2510033,121.4922213],[31.2509698,121.492219],[31.2509209,121.4922157],[31.2508502,121.4921708],[31.2507797,121.4920877],[31.2507401,121.4920096],[31.2507319,121.4919287],[31.2507365,121.4918595],[31.2507595,121.4917946],[31.2507964,121.4917599],[31.250837,121.4917466],[31.2508987,121.4918676],[31.250975,121.4919716],[31.2510521,121.4920299],[31.2511486,121.4920598],[31.2511448,121.4921154]],region:"northbund"},{name:"\u91D1\u5149\u4E2D\u5FC3 (\u5199\u5B57\u697C)",h:320,ring:[[31.2509055,121.4937595],[31.2510548,121.4937964],[31.2512048,121.4938335],[31.2515118,121.4939617],[31.2515644,121.4937244],[31.2516131,121.4936017],[31.2516483,121.4935128],[31.2515839,121.4934915],[31.2513109,121.4934012],[31.2512161,121.493357],[31.2510288,121.4932697],[31.2509845,121.4935336],[31.2509055,121.4937595]],region:"northbund"},{name:"",h:32,ring:[[31.2458438,121.4871373],[31.2458375,121.4875366],[31.2456853,121.4875333],[31.2456916,121.487134],[31.2458438,121.4871373]],region:"northbund"},{name:"\u5170\u5FC3\u5927\u697C",h:22.4,ring:[[31.2448049,121.483468],[31.244533,121.4835023],[31.24452,121.4833684],[31.2447932,121.4833317],[31.2448049,121.483468]],region:"northbund"},{name:"\u771F\u5149\u5927\u697C",h:28.8,ring:[[31.2448567,121.4832337],[31.2449693,121.483216],[31.2449762,121.483317],[31.2450673,121.4833197],[31.2450761,121.4834046],[31.2450787,121.483442],[31.2448698,121.4834633],[31.2448567,121.4832337]],region:"northbund"},{name:"",h:16,ring:[[31.2431485,121.4823123],[31.2433211,121.4823132],[31.2433194,121.4827959],[31.2431468,121.4827951],[31.2431485,121.4823123]],region:"northbund"},{name:"\u7231\u5EFA\u516C\u53F8",h:25.6,ring:[[31.2446786,121.4824302],[31.244368,121.4824835],[31.2443395,121.4822561],[31.2446501,121.4822028],[31.2446786,121.4824302]],region:"northbund"},{name:"",h:16,ring:[[31.2447723,121.4823475],[31.2450623,121.482304],[31.2450847,121.4824834],[31.2449996,121.4824958],[31.2449957,121.482469],[31.2447893,121.4824975],[31.2447723,121.4823475]],region:"northbund"},{name:"\u4E9A\u6D32\u6587\u4F1A\u5927\u697C",h:19.2,ring:[[31.2432308,121.4829615],[31.2432614,121.4833064],[31.2431489,121.4833201],[31.2431182,121.4829752],[31.2432308,121.4829615]],region:"northbund"},{name:"\u5706\u660E\u56ED\u516C\u5BD3",h:19.2,ring:[[31.2435419,121.4836351],[31.243501,121.4836929],[31.2432411,121.4837319],[31.2432188,121.4835176],[31.2432162,121.4834923],[31.2435198,121.4834471],[31.2435419,121.4836351]],region:"northbund"},{name:"",h:25.6,ring:[[31.2443915,121.481764],[31.2444045,121.481861],[31.2444125,121.4819194],[31.2441482,121.4820233],[31.2441401,121.4819908],[31.2441053,121.4818667],[31.2443915,121.481764]],region:"northbund"},{name:"\u4E2D\u5B9E\u5927\u697C",h:22.4,ring:[[31.2427308,121.4830428],[31.2427291,121.4833359],[31.2428949,121.4833356],[31.2430681,121.4833326],[31.2430264,121.4829712],[31.2427765,121.482991],[31.2427544,121.4830024],[31.2427409,121.4830203],[31.2427308,121.4830428]],region:"northbund"},{name:"\u864E\u4E18\u516C\u5BD3",h:19.2,ring:[[31.2447913,121.4825182],[31.2449009,121.4825021],[31.2449203,121.4826828],[31.244996,121.4826717],[31.2449799,121.4825222],[31.2450202,121.4825163],[31.2450227,121.4825398],[31.2450915,121.4825297],[31.2451209,121.4828044],[31.2451016,121.4828322],[31.2450375,121.4828398],[31.2450148,121.4828189],[31.2450126,121.4827988],[31.244937,121.4828101],[31.2449217,121.482847],[31.2448479,121.4828568],[31.2448244,121.482826],[31.2447913,121.4825182]],region:"northbund"},{name:"",h:32,ring:[[31.2454744,121.4832127],[31.2453914,121.4834631],[31.2453587,121.4835156],[31.2453204,121.4835397],[31.2452904,121.4835353],[31.2451476,121.4834852],[31.2451264,121.4834584],[31.2451207,121.4834282],[31.2451237,121.4834029],[31.2450761,121.4834046],[31.2450673,121.4833197],[31.2450626,121.4832741],[31.2454744,121.4832127]],region:"northbund"},{name:"\u4F4F\u5B85",h:6.4,ring:[[31.2442143,121.4803718],[31.2440493,121.4804272],[31.2439727,121.4801149],[31.2441376,121.4800596],[31.2442143,121.4803718]],region:"northbund"},{name:"",h:19.2,ring:[[31.2437999,121.48047],[31.2437289,121.4801824],[31.2439055,121.4801227],[31.2439766,121.4804103],[31.2437999,121.48047]],region:"northbund"},{name:"",h:25.6,ring:[[31.2430451,121.4804266],[31.2433209,121.4803408],[31.2433671,121.4805442],[31.2433293,121.4805981],[31.2433515,121.4806956],[31.2431225,121.4807669],[31.2430451,121.4804266]],region:"northbund"},{name:"",h:22.4,ring:[[31.2436821,121.4802148],[31.2436163,121.4802345],[31.2436663,121.4804644],[31.2435697,121.4804932],[31.2435201,121.4802651],[31.2433803,121.4803068],[31.2434431,121.4805949],[31.2437453,121.4805048],[31.2436821,121.4802148]],region:"northbund"},{name:"",h:19.2,ring:[[31.2447325,121.4805305],[31.2448193,121.4807548],[31.2447812,121.4807759],[31.2447914,121.4808066],[31.2446581,121.4808575],[31.2445622,121.4806389],[31.2447325,121.4805305]],region:"northbund"},{name:"",h:57.6,ring:[[31.2450945,121.480946],[31.2451563,121.481238],[31.2449373,121.4813113],[31.2448689,121.4810415],[31.2450945,121.480946]],region:"northbund"},{name:"",h:19.2,ring:[[31.2448707,121.4807739],[31.244851,121.4807373],[31.2448193,121.4807548],[31.2447812,121.4807759],[31.2447914,121.4808066],[31.2447988,121.4808292],[31.2446566,121.480897],[31.2447473,121.4810863],[31.2448433,121.4810533],[31.2448689,121.4810415],[31.2450945,121.480946],[31.2451181,121.4809361],[31.2450192,121.4806996],[31.2448707,121.4807739]],region:"northbund"},{name:"\u81EA\u6765\u5927\u697C",h:16,ring:[[31.2443109,121.4805605],[31.2442888,121.4804734],[31.2443064,121.4804185],[31.2446331,121.4803051],[31.2446407,121.4803354],[31.2446735,121.4804643],[31.2446904,121.4805312],[31.2445419,121.4805827],[31.244518,121.4804885],[31.2443109,121.4805605]],region:"northbund"},{name:"",h:25.6,ring:[[31.2447549,121.4803269],[31.2447032,121.4803123],[31.2446407,121.4803354],[31.2446735,121.4804643],[31.244713,121.4804499],[31.2447504,121.4804672],[31.2448553,121.4807061],[31.2449377,121.4806551],[31.2449427,121.4806497],[31.2449457,121.4806426],[31.2449457,121.4806357],[31.2449432,121.4806276],[31.2448374,121.480404],[31.2448034,121.480361],[31.2447549,121.4803269]],region:"northbund"},{name:"",h:25.6,ring:[[31.2445744,121.4815151],[31.2445598,121.4815495],[31.2441472,121.4816918],[31.2440995,121.4815022],[31.2445335,121.4813526],[31.2445744,121.4815151]],region:"northbund"},{name:"",h:38.4,ring:[[31.243905,121.4811122],[31.2439859,121.4814499],[31.2437176,121.4815075],[31.2437105,121.4814335],[31.2436963,121.4814098],[31.243657,121.4811651],[31.243905,121.4811122]],region:"northbund"},{name:"",h:38.4,ring:[[31.2445313,121.4813069],[31.244142,121.4814696],[31.244053,121.4810599],[31.2442061,121.4810045],[31.2442174,121.481045],[31.2444076,121.480967],[31.2445024,121.4812128],[31.2445313,121.4813069]],region:"northbund"},{name:"",h:25.6,ring:[[31.2505951,121.4877539],[31.2507648,121.4877486],[31.2507764,121.4882647],[31.2506068,121.48827],[31.2505951,121.4877539]],region:"northbund"},{name:"\u626C\u5B50\u6C5F\u5927\u53A6",h:64,ring:[[31.2505942,121.4893417],[31.2507342,121.4892675],[31.2508787,121.4896404],[31.2507387,121.4897146],[31.2505942,121.4893417]],region:"northbund"},{name:"\u626C\u5B50\u6C5F\u5927\u53A6",h:48,ring:[[31.2507524,121.4897333],[31.250856,121.489678],[31.2509294,121.4898657],[31.2508258,121.4899211],[31.2507524,121.4897333]],region:"northbund"},{name:"\u4E2D\u56FD\u8054\u901A(\u4E0A\u6D77\u5206\u516C\u53F8\u5317\u5916\u6EE9\u5C40)",h:60,ring:[[31.2510849,121.4888522],[31.2512814,121.488774],[31.2514267,121.4892675],[31.2512294,121.4893484],[31.2510849,121.4888522]],region:"northbund"},{name:"COSCO SHIPPING Lines Headquarters",h:96,ring:[[31.2490969,121.4919173],[31.2488091,121.4920729],[31.2486914,121.4917751],[31.2489792,121.4916196],[31.2490969,121.4919173]],region:"northbund"},{name:"\u94F6\u6CE2\u5927\u53A6",h:32,ring:[[31.247283,121.4855446],[31.2473014,121.485256],[31.2474895,121.4852767],[31.2475262,121.4852836],[31.2475628,121.4853028],[31.2475838,121.4853412],[31.2475909,121.4853837],[31.2475818,121.4855666],[31.247283,121.4855446]],region:"northbund"},{name:"",h:48,ring:[[31.2495406,121.4912729],[31.2494534,121.4913105],[31.2493858,121.4915572],[31.2495234,121.4916176],[31.2495933,121.4915975],[31.2496403,121.4915398],[31.2496988,121.491352],[31.2495406,121.4912729]],region:"northbund"},{name:"",h:76.8,ring:[[31.2490973,121.4840534],[31.2491997,121.4839747],[31.2492649,121.4840908],[31.2493465,121.484028],[31.2494459,121.484205],[31.2493598,121.4842713],[31.2493051,121.4841741],[31.2492073,121.4842492],[31.2490973,121.4840534]],region:"northbund"},{name:"",h:76.8,ring:[[31.2492868,121.4832083],[31.2493301,121.4835793],[31.2492294,121.4835954],[31.2492174,121.483492],[31.2491804,121.4834979],[31.2491603,121.4833261],[31.2491975,121.4833202],[31.2491863,121.4832243],[31.2492868,121.4832083]],region:"northbund"},{name:"",h:19.2,ring:[[31.2487939,121.4845714],[31.2489006,121.4845922],[31.2488467,121.4849704],[31.24874,121.4849496],[31.2487939,121.4845714]],region:"northbund"},{name:"\u8036\u677E\u8239\u5382\u65E7\u5740",h:16,ring:[[31.2494775,121.4926603],[31.2491749,121.49285],[31.2490556,121.4925898],[31.2493582,121.4924001],[31.2494775,121.4926603]],region:"northbund"},{name:"",h:32,ring:[[31.2489604,121.492026],[31.2490862,121.4919464],[31.249194,121.4921798],[31.2490682,121.4922593],[31.2489604,121.492026]],region:"northbund"},{name:"",h:25.6,ring:[[31.2471742,121.4852654],[31.2471229,121.4858754],[31.2470181,121.4858642],[31.2470648,121.4852541],[31.2470923,121.4852576],[31.2471077,121.4852385],[31.2471369,121.4852429],[31.2471499,121.4852635],[31.2471742,121.4852654]],region:"northbund"},{name:"\u5927\u6865\u5927\u697C",h:22.4,ring:[[31.2480108,121.4803397],[31.2480887,121.4807769],[31.2481013,121.4808151],[31.2481277,121.4808426],[31.2481563,121.4808553],[31.2481827,121.4808574],[31.2485061,121.4808037],[31.2484866,121.4806549],[31.2482034,121.4807031],[31.2481449,121.4803142],[31.2480108,121.4803397]],region:"northbund"},{name:"",h:38.4,ring:[[31.2439556,121.4833603],[31.2438355,121.4833748],[31.2438224,121.4832515],[31.2437976,121.4830185],[31.2439171,121.4830203],[31.2439556,121.4833603]],region:"northbund"},{name:"",h:38.4,ring:[[31.2447138,121.4832996],[31.2445807,121.4833175],[31.2445759,121.4832689],[31.2445539,121.4830449],[31.244687,121.483027],[31.2447138,121.4832996]],region:"northbund"},{name:"",h:38.4,ring:[[31.2443403,121.4833048],[31.2442089,121.4833239],[31.2441968,121.4832],[31.2441814,121.4830269],[31.2442723,121.4830291],[31.2443166,121.4830302],[31.2443403,121.4833048]],region:"northbund"},{name:"\u4E0A\u6D77\u5927\u53A6",h:60.8,ring:[[31.2462235,121.4851898],[31.2461402,121.4857462],[31.2461956,121.4858476],[31.2463271,121.4858731],[31.2464131,121.4858088],[31.2464716,121.4854451],[31.2465042,121.4852421],[31.2464395,121.4851377],[31.2463193,121.4851087],[31.2462235,121.4851898]],region:"northbund"},{name:"\u5E7F\u5B66\u5927\u697C",h:25.6,ring:[[31.2449638,121.4831306],[31.2450219,121.4831211],[31.2450198,121.4830841],[31.2450431,121.4830811],[31.2450396,121.4830318],[31.2450169,121.483034],[31.2450141,121.4829839],[31.2448372,121.4829894],[31.2448567,121.4832337],[31.2449693,121.483216],[31.2449638,121.4831306]],region:"northbund"},{name:"\u6D66\u897F\u516C\u5BD3",h:28.8,ring:[[31.2497137,121.4824457],[31.2497747,121.4828447],[31.2501488,121.4827701],[31.250197,121.4827138],[31.2502251,121.482663],[31.2502016,121.4823624],[31.2497137,121.4824457]],region:"northbund"},{name:"\u5C0F\u6D66\u897F\u516C\u5BD3",h:28.8,ring:[[31.2501489,121.4832286],[31.2500569,121.4832196],[31.2500735,121.4830124],[31.2500512,121.4830091],[31.2500569,121.4829111],[31.250089,121.4829057],[31.250134,121.4829115],[31.2501632,121.4829413],[31.2501715,121.4829935],[31.2501489,121.4832286]],region:"northbund"},{name:"\u666F\u6797\u5E90",h:19.2,ring:[[31.2513774,121.4830511],[31.2512239,121.4830763],[31.2511768,121.4826837],[31.2513304,121.4826585],[31.2513774,121.4830511]],region:"northbund"},{name:"\u4E0A\u6D77\u5E02\u5B89\u88C5\u5DE5\u7A0B\u6709\u9650\u516C\u53F8",h:3.2,ring:[[31.2505896,121.4829489],[31.2504506,121.4833599],[31.2506402,121.4834477],[31.2507967,121.4829849],[31.2506696,121.4829261],[31.2506521,121.4829779],[31.2505896,121.4829489]],region:"northbund"},{name:"\u95F5\u884C\u5927\u697C",h:16,ring:[[31.2489084,121.486884],[31.2487111,121.4871442],[31.2486171,121.4872482],[31.2485457,121.4872439],[31.2485897,121.4871819],[31.2486035,121.4871918],[31.2486318,121.4871452],[31.2486473,121.4871275],[31.2485506,121.4870551],[31.2487111,121.486744],[31.2489084,121.486884]],region:"northbund"},{name:"\u95F5\u884C\u5927\u697C",h:22.4,ring:[[31.2488103,121.4865802],[31.2489089,121.4866324],[31.2488694,121.4867304],[31.2487689,121.4866587],[31.2487111,121.486744],[31.2489084,121.486884],[31.2490555,121.4866292],[31.2490579,121.4865534],[31.2490138,121.4865059],[31.2488628,121.4864382],[31.2488103,121.4865802]],region:"northbund"},{name:"\u6D66\u5149\u5927\u697C",h:22.4,ring:[[31.2437073,121.4815112],[31.2437176,121.4815075],[31.2439859,121.4814499],[31.2440447,121.4816931],[31.2437245,121.4818105],[31.243716,121.4816598],[31.2437359,121.4816452],[31.2437073,121.4815112]],region:"northbund"},{name:"\u81EA\u529B\u5927\u697C",h:16,ring:[[31.2440508,121.4805194],[31.2438098,121.4806081],[31.2438471,121.4807651],[31.2440685,121.4806897],[31.2440911,121.4806797],[31.2440508,121.4805194]],region:"northbund"},{name:"\u6052\u4E30\u5927\u697C",h:19.2,ring:[[31.2438098,121.4806081],[31.243507,121.4807191],[31.2435587,121.4811203],[31.2439036,121.4810132],[31.2438471,121.4807651],[31.2438098,121.4806081]],region:"northbund"},{name:"\u6D59\u5174\u5927\u697C",h:19.2,ring:[[31.2429427,121.4809819],[31.2426615,121.4810887],[31.2426431,121.4811406],[31.2426914,121.4817205],[31.2429454,121.4816282],[31.2428936,121.4814512],[31.2430505,121.4813871],[31.2429427,121.4809819]],region:"northbund"},{name:"\u5229\u901A\u5E7F\u573A",h:9.6,ring:[[31.2550741,121.4798416],[31.2548923,121.4797153],[31.2545499,121.4798231],[31.2543498,121.4799987],[31.2543682,121.4801805],[31.2549569,121.4809157],[31.2554586,121.480504],[31.2555008,121.480427],[31.2550741,121.4798416]],region:"northbund"},{name:"",h:12.8,ring:[[31.2507401,121.4920096],[31.2507222,121.4920866],[31.2506849,121.4921344],[31.2507666,121.4921627],[31.2508331,121.4922087],[31.2508696,121.4922511],[31.2508937,121.4922972],[31.2509213,121.4922594],[31.2509698,121.492219],[31.2509209,121.4922157],[31.2508502,121.4921708],[31.2507797,121.4920877],[31.2507401,121.4920096]],region:"northbund"},{name:"",h:24,ring:[[31.2442908,121.4869603],[31.2442788,121.4869499],[31.2442892,121.4869293],[31.2443177,121.4868729],[31.2443436,121.4868949],[31.244305,121.4869428],[31.2442908,121.4869603]],region:"northbund"},{name:"",h:24,ring:[[31.2442777,121.4869704],[31.2442912,121.4869627],[31.2443021,121.486983],[31.2443319,121.4870383],[31.2443033,121.4870552],[31.2442846,121.4869932],[31.2442777,121.4869704]],region:"northbund"},{name:"",h:24,ring:[[31.2442766,121.4869517],[31.2442761,121.4869692],[31.2442557,121.4869709],[31.2441999,121.4869757],[31.2442006,121.4869383],[31.2442562,121.4869481],[31.2442766,121.4869517]],region:"northbund"},{name:"",h:57.6,ring:[[31.250275,121.4947732],[31.2502646,121.4948241],[31.2502796,121.4949153],[31.2503564,121.495197],[31.2503919,121.4952734],[31.2504206,121.4953163],[31.2504561,121.4953418],[31.2505008,121.4953485],[31.250541,121.4953351],[31.250565,121.4953002],[31.2505788,121.4952573],[31.2505754,121.4951862],[31.2504756,121.4948255],[31.2504481,121.4947692],[31.2504183,121.4947329],[31.2503862,121.4947169],[31.2503529,121.4947155],[31.2503266,121.4947209],[31.2502933,121.494745],[31.250275,121.4947732]],region:"northbund"},{name:"",h:25.6,ring:[[31.250275,121.4958836],[31.2504905,121.495948],[31.2505364,121.4960177],[31.2505891,121.4961331],[31.2505799,121.4961733],[31.2502681,121.4963691],[31.250236,121.4963718],[31.2502016,121.4963476],[31.2500617,121.4960848],[31.250064,121.4960499],[31.2500846,121.4960258],[31.250275,121.4958836]],region:"northbund"},{name:"",h:56,ring:[[31.2554764,121.4925064],[31.2554557,121.4928497],[31.2553801,121.4928417],[31.2553824,121.4928175],[31.2552895,121.4928081],[31.2552895,121.4927572],[31.2552173,121.4927531],[31.2552287,121.4925533],[31.2552884,121.4925573],[31.2552918,121.4925198],[31.2553915,121.4925278],[31.2553915,121.4924983],[31.2554764,121.4925064]],region:"northbund"},{name:"",h:80,ring:[[31.2561188,121.4873972],[31.2561073,121.4878049],[31.2560867,121.487829],[31.2557519,121.4878156],[31.2557359,121.4877539],[31.2560248,121.4873891],[31.2561188,121.4873972]],region:"northbund"},{name:"",h:9.6,ring:[[31.2561233,121.4878772],[31.2559745,121.4878726],[31.2559679,121.4881746],[31.2561246,121.4881884],[31.2561233,121.4878772]],region:"northbund"},{name:"Shanghai Consruction Engineering",h:20,ring:[[31.251431,121.4896012],[31.2513315,121.4896462],[31.2512783,121.4895126],[31.2513002,121.4895007],[31.2512704,121.4894244],[31.2515185,121.4893013],[31.2515645,121.4894261],[31.2513994,121.4895113],[31.251431,121.4896012]],region:"northbund"},{name:"",h:20,ring:[[31.2511762,121.4897189],[31.2510527,121.4897733],[31.2509487,121.4894255],[31.251069,121.4893774],[31.2511762,121.4897189]],region:"northbund"},{name:"",h:10,ring:[[31.251066,121.4893734],[31.2509457,121.4894194],[31.250804,121.488938],[31.2509243,121.4888912],[31.251066,121.4893734]],region:"northbund"},{name:"",h:35,ring:[[31.2525703,121.4915889],[31.2526917,121.491529],[31.252643,121.4913954],[31.2525223,121.4914608],[31.2525703,121.4915889]],region:"northbund"},{name:"\u5B87\u6CF0\u516C\u5BD3",h:50,ring:[[31.2525175,121.4914491],[31.252639,121.4913893],[31.2525128,121.4910248],[31.2523889,121.4910855],[31.2525175,121.4914491]],region:"northbund"},{name:"\u5B87\u6CF0\u516C\u5BD3",h:50,ring:[[31.2523206,121.4911187],[31.252442,121.4910589],[31.2523158,121.4906943],[31.2521919,121.4907551],[31.2523017,121.4910652],[31.2523206,121.4911187]],region:"northbund"},{name:"\u4E0A\u6D77\u5B87\u6CF0\u623F\u5730\u4EA7\u6709\u9650\u516C\u53F8",h:16,ring:[[31.252027,121.4909555],[31.2521485,121.4908957],[31.2520997,121.490762],[31.2519791,121.4908275],[31.252027,121.4909555]],region:"northbund"},{name:"\u5B87\u6CF0\u516C\u5BD3",h:56,ring:[[31.2528996,121.4913023],[31.253021,121.4912376],[31.252811,121.4907173],[31.2526885,121.4907861],[31.2528996,121.4913023]],region:"northbund"},{name:"",h:124,ring:[[31.2520257,121.4895762],[31.2520431,121.4896117],[31.2520495,121.4896519],[31.2520444,121.4896923],[31.2520282,121.4897285],[31.2520034,121.4897561],[31.2519722,121.4897728],[31.2519382,121.489777],[31.2519048,121.4897682],[31.2518756,121.4897472],[31.2518537,121.4897164],[31.2518414,121.489679],[31.2518401,121.489639],[31.2518498,121.4896006],[31.25187,121.4895673],[31.2518985,121.4895436],[31.251932,121.4895321],[31.2519669,121.4895341],[31.2519994,121.4895493],[31.2520257,121.4895762]],region:"northbund"},{name:"",h:124,ring:[[31.2525863,121.4895692],[31.2525375,121.4896241],[31.2524786,121.4896193],[31.2524571,121.4896099],[31.2524322,121.4895793],[31.2524131,121.4895177],[31.2524083,121.4894416],[31.2524217,121.4893946],[31.2524782,121.4893755],[31.2525423,121.4893744],[31.2525873,121.4894192],[31.2525978,121.4895021],[31.2525863,121.4895692]],region:"northbund"},{name:"\u5EFA\u5510\u5927\u697C",h:6.4,ring:[[31.254078,121.4931688],[31.2542123,121.4935671],[31.2542691,121.4935412],[31.2542974,121.493606],[31.254519,121.4934846],[31.2544754,121.4933688],[31.2543033,121.4934515],[31.2541819,121.4931206],[31.254078,121.4931688]],region:"northbund"},{name:"",h:56,ring:[[31.2558308,121.4921407],[31.2557953,121.4925146],[31.2557318,121.4925087],[31.2557344,121.492479],[31.2556431,121.4924642],[31.2556507,121.4924256],[31.2555923,121.4924197],[31.2555974,121.4923692],[31.2555771,121.4923633],[31.2555847,121.4922476],[31.2556126,121.4922505],[31.2556152,121.4921912],[31.255671,121.4922001],[31.255676,121.4921496],[31.2557521,121.4921674],[31.2557572,121.4921289],[31.2558308,121.4921407]],region:"northbund"},{name:"",h:18,ring:[[31.2555618,121.49156],[31.2557347,121.4917778],[31.2556083,121.4919127],[31.2554487,121.4916845],[31.2555618,121.49156]],region:"northbund"},{name:"",h:18,ring:[[31.2557908,121.491758],[31.2555981,121.4919429],[31.2556574,121.4920258],[31.2558468,121.4918331],[31.2557908,121.491758]],region:"northbund"},{name:"",h:6,ring:[[31.2547063,121.4914279],[31.254755,121.4915172],[31.2546852,121.4915703],[31.2546381,121.4914849],[31.2547063,121.4914279]],region:"northbund"},{name:"",h:6,ring:[[31.2545823,121.4915403],[31.2546593,121.4916811],[31.2545903,121.4917337],[31.2545149,121.4915929],[31.2545823,121.4915403]],region:"northbund"},{name:"",h:3,ring:[[31.2547611,121.4915363],[31.2548009,121.4916214],[31.2547259,121.491672],[31.2546895,121.4915922],[31.2547611,121.4915363]],region:"northbund"},{name:"",h:3,ring:[[31.2552143,121.4918305],[31.2551362,121.4919114],[31.2551092,121.4918657],[31.2551888,121.4917901],[31.2552143,121.4918305]],region:"northbund"},{name:"Longmen Building",h:16,ring:[[31.2559643,121.4918028],[31.256042,121.4919152],[31.255841,121.4921052],[31.2557633,121.4919928],[31.2559643,121.4918028]],region:"northbund"},{name:"",h:21,ring:[[31.2541557,121.4922506],[31.2542978,121.4925292],[31.2543189,121.4925145],[31.2543469,121.4925695],[31.254395,121.4925359],[31.2545261,121.4927928],[31.2544141,121.492871],[31.2543169,121.4926805],[31.2542766,121.4927086],[31.2542485,121.4926537],[31.2542271,121.4926687],[31.2541846,121.4925853],[31.254173,121.4925934],[31.2540395,121.4923318],[31.2541557,121.4922506]],region:"northbund"},{name:"",h:48,ring:[[31.253233,121.4892206],[31.2530453,121.4892673],[31.2531132,121.4897157],[31.2533048,121.4896596],[31.253233,121.4892206]],region:"northbund"},{name:"",h:48,ring:[[31.2532968,121.4898086],[31.2531211,121.4898553],[31.253197,121.490341],[31.2533727,121.4902802],[31.2532968,121.4898086]],region:"northbund"},{name:"",h:48,ring:[[31.2534034,121.4905269],[31.2532317,121.4905783],[31.2533521,121.4910492],[31.2535192,121.4909799],[31.2534034,121.4905269]],region:"northbund"},{name:"",h:48,ring:[[31.2535962,121.4911269],[31.2534206,121.4912203],[31.2535803,121.4916359],[31.2537399,121.4915332],[31.2535962,121.4911269]],region:"northbund"},{name:"",h:93,ring:[[31.2536076,121.4891771],[31.2534926,121.4892302],[31.2536833,121.4898673],[31.2538527,121.4897575],[31.2538315,121.4896938],[31.2538739,121.4896691],[31.2538527,121.4896231],[31.2538164,121.4896443],[31.2537649,121.4895381],[31.2537982,121.4895204],[31.2537589,121.4894142],[31.2537196,121.489439],[31.2536863,121.4893435],[31.2537105,121.4893364],[31.2536802,121.4892337],[31.2536469,121.4892621],[31.2536076,121.4891771]],region:"northbund"},{name:"",h:93,ring:[[31.2539157,121.4900205],[31.2537498,121.490076],[31.2538894,121.4905412],[31.2540079,121.4904827],[31.2539974,121.4904334],[31.2540421,121.4904088],[31.2540132,121.4903132],[31.2539816,121.4903163],[31.2539473,121.4901808],[31.2539895,121.4901684],[31.2539769,121.4900968],[31.253971,121.4900637],[31.2539289,121.490076],[31.2539157,121.4900205]],region:"northbund"},{name:"",h:93,ring:[[31.2540546,121.4906159],[31.2539068,121.4906369],[31.2539767,121.4912813],[31.2541204,121.4912556],[31.2541005,121.4911412],[31.2541384,121.4911412],[31.2541244,121.4910805],[31.2540945,121.4910805],[31.2540845,121.4909404],[31.2541244,121.4909428],[31.2541104,121.4908377],[31.2540845,121.49084],[31.2540725,121.4907419],[31.2541085,121.4907373],[31.2541065,121.4906556],[31.2540685,121.4906649],[31.2540546,121.4906159]],region:"northbund"},{name:"",h:18,ring:[[31.2536257,121.4885193],[31.2534881,121.48853],[31.253534,121.4889699],[31.2536853,121.4889485],[31.2536257,121.4885193]],region:"northbund"},{name:"",h:21,ring:[[31.2536076,121.4881913],[31.253404,121.4882146],[31.253432,121.4884855],[31.2536316,121.4884621],[31.2536076,121.4881913]],region:"northbund"},{name:"",h:6,ring:[[31.2535981,121.4881355],[31.2535586,121.4878089],[31.2532609,121.487926],[31.2533215,121.4882279],[31.2535981,121.4881355]],region:"northbund"},{name:"",h:6,ring:[[31.2535322,121.4877688],[31.2534005,121.48747],[31.2531108,121.4874576],[31.2532425,121.4878951],[31.2535322,121.4877688]],region:"northbund"},{name:"",h:6,ring:[[31.2530239,121.487473],[31.2528974,121.4874915],[31.2528,121.4875994],[31.2528474,121.4876548],[31.253037,121.4875562],[31.2530239,121.487473]],region:"northbund"},{name:"",h:6,ring:[[31.2530528,121.487587],[31.2528711,121.4876826],[31.2529106,121.4878058],[31.2530028,121.4877719],[31.2530765,121.4880215],[31.2531793,121.4879691],[31.2530528,121.487587]],region:"northbund"},{name:"",h:6,ring:[[31.2527837,121.4876094],[31.2526704,121.4877572],[31.2527337,121.4878158],[31.2528522,121.4877172],[31.2527837,121.4876094]],region:"northbund"},{name:"",h:6,ring:[[31.2529812,121.4878065],[31.2527969,121.4878928],[31.2529654,121.4881793],[31.2530155,121.4881485],[31.2530023,121.4880746],[31.2530765,121.4880215],[31.2529812,121.4878065]],region:"northbund"},{name:"",h:6,ring:[[31.252868,121.4877449],[31.2527416,121.4878343],[31.2527854,121.4878794],[31.2528907,121.4878117],[31.252868,121.4877449]],region:"northbund"},{name:"",h:6,ring:[[31.2526563,121.4877947],[31.2524166,121.488166],[31.2525984,121.4884787],[31.2529592,121.48828],[31.2528789,121.488072],[31.2527419,121.4878825],[31.2526563,121.4877947]],region:"northbund"},{name:"",h:9,ring:[[31.2531949,121.4881521],[31.253033,121.4882045],[31.2530725,121.4883924],[31.2532226,121.4883447],[31.2531949,121.4881521]],region:"northbund"},{name:"",h:6,ring:[[31.2531808,121.4879943],[31.2530279,121.4880776],[31.253047,121.4881833],[31.2532051,121.4881345],[31.2531808,121.4879943]],region:"northbund"},{name:"",h:6,ring:[[31.2534293,121.4885533],[31.2529914,121.4886509],[31.2530053,121.4887667],[31.253438,121.4886814],[31.2534293,121.4885533]],region:"northbund"},{name:"",h:6,ring:[[31.2534606,121.4887281],[31.2532937,121.4887525],[31.2533094,121.4888684],[31.253478,121.4888379],[31.2534606,121.4887281]],region:"northbund"},{name:"",h:6,ring:[[31.2533389,121.4888968],[31.2534797,121.4888806],[31.2534797,121.4889964],[31.2533441,121.4889964],[31.2533389,121.4888968]],region:"northbund"},{name:"",h:6,ring:[[31.2532555,121.4887464],[31.2530192,121.4887932],[31.2530261,121.4888806],[31.2532694,121.4888419],[31.2532555,121.4887464]],region:"northbund"},{name:"",h:9,ring:[[31.2533163,121.4888887],[31.2530348,121.488905],[31.2530418,121.4890025],[31.2533198,121.4890046],[31.2533163,121.4888887]],region:"northbund"},{name:"",h:6,ring:[[31.2533389,121.4882565],[31.2532364,121.4883114],[31.2532677,121.4885614],[31.2533685,121.488533],[31.2533389,121.4882565]],region:"northbund"},{name:"",h:6,ring:[[31.2532156,121.4883724],[31.253014,121.4884334],[31.2530487,121.4886183],[31.253252,121.4885756],[31.2532156,121.4883724]],region:"northbund"},{name:"",h:9,ring:[[31.253014,121.4885248],[31.2527846,121.4885635],[31.2528037,121.4886651],[31.2530244,121.4886285],[31.253014,121.4885248]],region:"northbund"},{name:"",h:6,ring:[[31.2527255,121.4884476],[31.2525952,121.4885391],[31.2526699,121.4887281],[31.2527811,121.4886468],[31.2527255,121.4884476]],region:"northbund"},{name:"",h:9,ring:[[31.2529705,121.4886671],[31.2527846,121.4886915],[31.2526977,121.4887525],[31.2528593,121.4890229],[31.2530157,121.4890046],[31.2529705,121.4886671]],region:"northbund"},{name:"",h:8,ring:[[31.25375,121.4884254],[31.253887,121.4884193],[31.2539253,121.4888632],[31.2538212,121.4888781],[31.25375,121.4884254]],region:"northbund"},{name:"",h:8,ring:[[31.2536789,121.4877076],[31.2538156,121.4877335],[31.2538158,121.4878616],[31.2538659,121.4883423],[31.2537263,121.4883484],[31.2536789,121.4877076]],region:"northbund"},{name:"",h:8,ring:[[31.2538576,121.4877619],[31.25397,121.4877875],[31.2539936,121.4883318],[31.2539012,121.4883362],[31.2538576,121.4877619]],region:"northbund"},{name:"",h:8,ring:[[31.2539126,121.4884086],[31.2540204,121.4884032],[31.2540388,121.4888592],[31.2539585,121.4888619],[31.2539126,121.4884086]],region:"northbund"},{name:"",h:8,ring:[[31.253996,121.4877914],[31.2541236,121.4878078],[31.2541544,121.4883452],[31.2540346,121.4883488],[31.253996,121.4877914]],region:"northbund"},{name:"",h:8,ring:[[31.2540617,121.4884139],[31.2541695,121.4884032],[31.2541855,121.4888538],[31.2540754,121.4888565],[31.2540617,121.4884139]],region:"northbund"},{name:"",h:8,ring:[[31.2541511,121.4878239],[31.2542956,121.4878641],[31.2543208,121.4883374],[31.2541978,121.4883453],[31.2541511,121.4878239]],region:"northbund"},{name:"",h:8,ring:[[31.2542153,121.4883952],[31.25433,121.4883952],[31.2543437,121.4888458],[31.2542268,121.4888485],[31.2542153,121.4883952]],region:"northbund"},{name:"",h:8,ring:[[31.2543139,121.4878721],[31.254448,121.4879155],[31.254463,121.4883254],[31.2543483,121.4883335],[31.2543139,121.4878721]],region:"northbund"},{name:"",h:8,ring:[[31.2543506,121.4884005],[31.2544698,121.4884005],[31.2544905,121.4888324],[31.2543712,121.4888377],[31.2543506,121.4884005]],region:"northbund"},{name:"",h:8,ring:[[31.2544845,121.4879232],[31.2546051,121.4879527],[31.2546143,121.4883335],[31.2544951,121.4883308],[31.2544845,121.4879232]],region:"northbund"},{name:"",h:8,ring:[[31.2545019,121.4883978],[31.2546074,121.4883952],[31.2546272,121.4888261],[31.2545157,121.4888297],[31.2545019,121.4883978]],region:"northbund"},{name:"",h:8,ring:[[31.2546294,121.4879584],[31.2547512,121.4879889],[31.2547693,121.4883326],[31.2546441,121.4883346],[31.2546294,121.4879584]],region:"northbund"},{name:"",h:8,ring:[[31.2546539,121.4883932],[31.2547697,121.4883956],[31.2547842,121.4888126],[31.2546699,121.4888218],[31.2546539,121.4883932]],region:"northbund"},{name:"",h:18,ring:[[31.2548048,121.4878864],[31.2548188,121.4883137],[31.2549266,121.4882997],[31.2549066,121.4878864],[31.2548048,121.4878864]],region:"northbund"},{name:"",h:16,ring:[[31.2549652,121.4878989],[31.2551128,121.4878879],[31.255136,121.4883134],[31.2549885,121.4883244],[31.2549652,121.4878989]],region:"northbund"},{name:"",h:6,ring:[[31.2536857,121.4876748],[31.2538178,121.4877154],[31.2538456,121.4875874],[31.2538004,121.4875833],[31.2537483,121.4875914],[31.2537153,121.4876077],[31.2536857,121.4876748]],region:"northbund"},{name:"",h:6,ring:[[31.2538664,121.4876016],[31.2538456,121.4877195],[31.2541271,121.4877784],[31.2541514,121.4876809],[31.2538664,121.4876016]],region:"northbund"},{name:"",h:6,ring:[[31.254181,121.4876992],[31.2544582,121.4877876],[31.25444,121.487871],[31.2541566,121.4877988],[31.254181,121.4876992]],region:"northbund"},{name:"",h:6,ring:[[31.2544972,121.4877927],[31.2547492,121.4878536],[31.2547631,121.487937],[31.2544842,121.4878741],[31.2544972,121.4877927]],region:"northbund"},{name:"",h:8,ring:[[31.2538414,121.4889045],[31.2540413,121.4888862],[31.2540465,121.4890081],[31.2538571,121.4890102],[31.2538414,121.4889045]],region:"northbund"},{name:"",h:8,ring:[[31.2540741,121.4888822],[31.2543434,121.4888741],[31.2543417,121.4889818],[31.2540793,121.488992],[31.2540741,121.4888822]],region:"northbund"},{name:"",h:8,ring:[[31.2543678,121.488872],[31.254769,121.4888637],[31.2547735,121.4889511],[31.2543695,121.4889696],[31.2543678,121.488872]],region:"northbund"},{name:"",h:8,ring:[[31.2548178,121.4883801],[31.2549273,121.4883842],[31.254943,121.4888172],[31.2548317,121.4888233],[31.2548178,121.4883801]],region:"northbund"},{name:"",h:8,ring:[[31.2549638,121.4883903],[31.2550768,121.4883842],[31.2551028,121.4887928],[31.2549742,121.4888029],[31.2549638,121.4883903]],region:"northbund"},{name:"",h:8,ring:[[31.2548244,121.4888492],[31.255149,121.4888322],[31.2551525,121.4889526],[31.2548314,121.4889686],[31.2548244,121.4888492]],region:"northbund"},{name:"",h:18,ring:[[31.2549382,121.4891484],[31.2548042,121.4891564],[31.2548108,121.4893083],[31.2548486,121.489306],[31.2548642,121.4896646],[31.2550011,121.4896565],[31.2549853,121.4892918],[31.2549445,121.4892942],[31.2549382,121.4891484]],region:"northbund"},{name:"",h:18,ring:[[31.2547465,121.489118],[31.2546043,121.489118],[31.2546089,121.4892897],[31.2546479,121.4892897],[31.2546525,121.4896625],[31.2548061,121.489633],[31.25479,121.4892736],[31.2547465,121.4892655],[31.2547465,121.489118]],region:"northbund"},{name:"",h:18,ring:[[31.2550154,121.4897181],[31.2548868,121.4897149],[31.2548786,121.4901677],[31.2550073,121.4901709],[31.2550154,121.4897181]],region:"northbund"},{name:"",h:18,ring:[[31.2548061,121.4896813],[31.2546616,121.4896893],[31.2546525,121.4900219],[31.2547969,121.4900246],[31.2548061,121.4896813]],region:"northbund"},{name:"",h:9,ring:[[31.2544682,121.4895368],[31.2543602,121.4895492],[31.2543418,121.4896909],[31.2543866,121.4897001],[31.2544524,121.4897001],[31.2544814,121.489657],[31.2544761,121.4896139],[31.2544682,121.4895368]],region:"northbund"},{name:"",h:9,ring:[[31.2542836,121.4894983],[31.2541637,121.4895023],[31.2540976,121.4895166],[31.2540612,121.489604],[31.2540733,121.4896853],[31.2541011,121.48973],[31.2541533,121.4897198],[31.2541967,121.4896792],[31.2541793,121.4896121],[31.2542123,121.4896121],[31.2542193,121.4896649],[31.2542853,121.4896832],[31.2543114,121.4896263],[31.2543062,121.4895613],[31.2542836,121.4894983]],region:"northbund"},{name:"",h:9,ring:[[31.2544869,121.4897402],[31.2544278,121.4898093],[31.2544295,121.490043],[31.254466,121.4900979],[31.2545234,121.4900999],[31.2545651,121.4900552],[31.2545686,121.4899577],[31.254546,121.4899394],[31.2545529,121.4898682],[31.2545738,121.4898642],[31.2545703,121.4897828],[31.2545303,121.4897463],[31.2544869,121.4897402]],region:"northbund"},{name:"",h:9,ring:[[31.2542454,121.4897788],[31.2542089,121.4897625],[31.254111,121.4898188],[31.2541284,121.4899149],[31.2541585,121.489978],[31.2542158,121.4900247],[31.2543183,121.4900634],[31.2543792,121.4899861],[31.2543687,121.489856],[31.2543114,121.4898459],[31.2542836,121.4898682],[31.2542548,121.489874],[31.2542454,121.4897788]],region:"northbund"},{name:"",h:64,ring:[[31.2543723,121.4950472],[31.2542333,121.4951163],[31.2545635,121.4959294],[31.2546956,121.4958603],[31.2543723,121.4950472]],region:"northbund"},{name:"",h:64,ring:[[31.2538186,121.4954674],[31.253672,121.4955508],[31.253896,121.4960899],[31.2540425,121.4960067],[31.2538186,121.4954674]],region:"northbund"},{name:"",h:64,ring:[[31.2533634,121.4957006],[31.2532152,121.4957696],[31.2534204,121.4963725],[31.2535685,121.4963036],[31.2533634,121.4957006]],region:"northbund"}],named:[]};var W8={pearl:{lat:31.23967,lon:121.49978,rotY:0},jinmao:{lat:31.23745,lon:121.50585,rotY:0},shanghaiTower:{lat:31.23365,lon:121.50777,rotY:0},swfc:{lat:31.23533,lon:121.50655,rotY:0},whiteMagnolia:{lat:31.24865,lon:121.49005,rotY:0},waibaidu:{lat:31.2443,lon:121.486,rotY:Math.PI/2}},X8=/东方明珠|金茂|上海中心|环球金融|白玉兰/,e2={lujiazui:"quant",northbund:"gaming",bund_edge:"media"},Y8={quant:"\u9646\u5BB6\u5634 \xB7 QUANT \u57CE",gaming:"\u5317\u5916\u6EE9 \xB7 GAME \u57CE",media:"\u5916\u6EE9 \xB7 MEDIA \u57CE"},q8=[[31.218,121.489],[31.226,121.4908],[31.231,121.493],[31.234,121.4965],[31.236,121.5],[31.239,121.503],[31.243,121.5018],[31.248,121.502],[31.254,121.5035],[31.26,121.5065],[31.266,121.51],[31.272,121.5145]],js=230,ec=118,Z8=`
varying vec3 vWPos;
varying vec3 vWNormal;
#include <common>
#include <fog_pars_vertex>
void main() {
  #include <begin_vertex>
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
  vWNormal = normalize(mat3(modelMatrix) * objectNormal);
  vec4 mvPosition = vec4(transformed, 1.0);
  #ifdef USE_INSTANCING
    mvPosition = instanceMatrix * mvPosition;
  #endif
  mvPosition = modelViewMatrix * mvPosition;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,K8=`
uniform vec3 uTint;
uniform float uWinGain;
uniform float uBreath;
uniform float uBodyGain;
uniform float uFloorH;   // district signature: floor spacing (m)
uniform float uWinW;     // district signature: window column spacing (m)
uniform float uWinRate;  // district signature: lit-window probability
varying vec3 vWPos;
varying vec3 vWNormal;
#include <common>
#include <fog_pars_fragment>
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
void main() {
  vec3 col = uTint;
  float side = 1.0 - step(0.5, abs(vWNormal.y)); // side faces only
  // World-space facade grid driven by the district signature (GTA6 rule A1:
  // zones must differ in >=3 readable channels - tint/floor/window rates).
  float h = mix(vWPos.x, vWPos.z, step(abs(vWNormal.x), abs(vWNormal.z)));
  float fy = fract(vWPos.y / uFloorH);
  float fh = fract(h / uWinW);
  float cellOn = step(1.0 - uWinRate, hash12(vec2(floor(h / uWinW) * 0.37 + floor(vWPos.y / uFloorH) * 7.1, floor(h / uWinW) * 3.1)));
  float win = side * step(fy, 0.62) * step(fh, 0.55) * cellOn;
  vec3 emissive = uTint * (uWinGain + uBreath) * (1.35 + 0.65 * hash12(vec2(h, vWPos.y)));
  vec4 diffuseColor = vec4(col * uBodyGain * (0.55 + 0.45 * (1.0 - side)), 1.0);
  diffuseColor.rgb += emissive * win;
  gl_FragColor = diffuseColor;
  #include <fog_fragment>
}`,Q1={quant:{floorH:4,winW:2.4,winRate:.5},gaming:{floorH:3.4,winW:3,winRate:.42},media:{floorH:4.4,winW:3.6,winRate:.62}};function t2(i){var C,D,N,A,U,F,B,V,z,W,K;let e=new Oe,t=[...jd,...Qd.buildings],n=new Map;for(let Q of t){let ae=(C=e2[Q.region])!=null?C:"quant",k=n.get(ae);k||(k={x:0,z:0,n:0,ptSum:0,hmax:0},n.set(ae,k)),k.n++,k.hmax=Math.max(k.hmax,Q.h);for(let[re,ce]of Q.ring)k.x+=zt(ce),k.z+=Gt(re),k.ptSum++}let s=[];for(let[Q,ae]of n)s.push({id:Q,name:(D=Y8[Q])!=null?D:Q,angleDeg:0,cx:ae.x/ae.ptSum,cz:ae.z/ae.ptSum});let r=new Map,o=new Map,a=[],l=0;for(let Q of t){if(X8.test(Q.name))continue;let ae=(N=e2[Q.region])!=null?N:"quant",k=Q.ring.map(([oe,ye])=>new te(zt(ye),-Gt(oe)));if(k.length<3)continue;let re=1/0,ce=-1/0,Ce=1/0,he=-1/0;for(let oe of k)oe.x<re&&(re=oe.x),oe.x>ce&&(ce=oe.x),oe.y<Ce&&(Ce=oe.y),oe.y>he&&(he=oe.y);a.push({cx:(re+ce)/2,cz:(Ce+he)/2,hw:(ce-re)/2,hd:(he-Ce)/2});let Ne=new Yn(k),et;try{et=new ci(Ne,{depth:Q.h,bevelEnabled:!1})}catch{continue}et.rotateX(-Math.PI/2),et.translate(0,0,0);let Le=o.get(ae);Le||(Le=[],o.set(ae,Le)),Le.push(et),l++}for(let[Q,ae]of o){let k=Zd(ae,!1);if(!k)continue;for(let Ce of ae)Ce.dispose();let re=new Pt({vertexShader:Z8,fragmentShader:K8,uniforms:Pn.merge([Pe.fog,{uTint:{value:((A=En[Q])!=null?A:me.data).clone().multiplyScalar(.55)},uWinGain:{value:1},uBreath:{value:0},uBodyGain:{value:1},uFloorH:{value:(F=(U=Q1[Q])==null?void 0:U.floorH)!=null?F:3.6},uWinW:{value:(V=(B=Q1[Q])==null?void 0:B.winW)!=null?V:2.9},uWinRate:{value:(W=(z=Q1[Q])==null?void 0:z.winRate)!=null?W:.45}}]),fog:!0}),ce=new Z(k,re);ce.castShadow=!0,ce.receiveShadow=!0,ce.frustumCulled=!1,e.add(ce),r.set(Q,re)}let c=[],h=new Pt({uniforms:Pn.merge([Pe.fog,{uTime:{value:0},uDeep:{value:new ue(1923710).multiplyScalar(3.4)},uGlow:{value:new ue(2078878).multiplyScalar(2.1)}}]),vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,fragmentShader:`
      uniform float uTime;
      uniform vec3 uDeep;
      uniform vec3 uGlow;
      varying vec2 vUv;
      void main() {
        // River = "lit water band between two bright banks". Body carries a
        // readable teal-blue (not black), sparse flow stripes along the
        // channel, brightest at shorelines. Reflections stay future work.
        float flow = 0.5 + 0.5 * sin((vUv.x * 60.0) - uTime * 0.9 + sin(vUv.y * 5.0) * 0.6);
        float flow2 = 0.5 + 0.5 * sin((vUv.x * 23.0) - uTime * 0.35);
        float bank = smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.94, vUv.y);
        float band = smoothstep(0.55, 0.98, flow) * (0.3 + 0.4 * bank);
        vec3 col = uDeep * (0.9 + 0.35 * band + 0.12 * flow2);
        col += uGlow * band * 0.5;
        col += uGlow * (1.0 - bank) * 1.25; // two bright shoreline ribbons
        gl_FragColor = vec4(col, 0.96);
      }`,transparent:!0,fog:!1}),u=[],d=[],f=[],m=q8.map(([Q,ae])=>({x:zt(ae),z:Gt(Q)}));for(let Q=0;Q<m.length;Q++){let ae=m[Q],k=m[Math.min(Q+1,m.length-1)],re=m[Math.max(Q-1,0)],ce=k.x-re.x,Ce=k.z-re.z,he=Math.hypot(ce,Ce)||1,Ne=-Ce/he,et=ce/he;if(u.push(ae.x+Ne*js,.4,ae.z+et*js),u.push(ae.x-Ne*js,.4,ae.z-et*js),d.push(Q/(m.length-1),0,Q/(m.length-1),1),Q<m.length-1){let Le=Q*2;f.push(Le,Le+1,Le+2,Le+1,Le+3,Le+2)}}let y=new mt;y.setAttribute("position",new Qe(u,3)),y.setAttribute("uv",new Qe(d,2)),y.setIndex(f);let g=new Z(y,h);g.renderOrder=1,e.add(g);let p=new xe({color:me.data.clone().multiplyScalar(1.25),blending:nt,transparent:!0,opacity:.75,depthWrite:!1,fog:!0});p.userData.flowColor=me.data.clone();for(let Q of[1,-1]){let ae=[];for(let re=0;re<m.length;re++){let ce=m[re],Ce=m[Math.min(re+1,m.length-1)],he=m[Math.max(re-1,0)],Ne=Ce.x-he.x,et=Ce.z-he.z,Le=Math.hypot(Ne,et)||1,oe=-et/Le,ye=Ne/Le;ae.push(ce.x+oe*(js-3)*Q,1.2,ce.z+ye*(js-3)*Q)}let k=new mt;k.setAttribute("position",new Qe(ae,3)),e.add(new Ki(k,p))}c.push(p);let M=31.2398,E=121.5028,x=new I(zt(E),0,Gt(M)),b=new Z(new ot(ec,ec+14,9,6),new ke({color:726048,roughness:.85,metalness:.25}));b.position.set(x.x,4.5,x.z),b.receiveShadow=!0,e.add(b);let S=new Z(new Et(ec-3,1.1,8,96),new xe({color:me.brain.clone().multiplyScalar(1.5)}));S.rotation.x=Math.PI/2,S.position.set(x.x,9.4,x.z),e.add(S);let _=[];for(let Q of s){let ae=new te(Q.cx,Q.cz),k=new te(x.x,x.z),re=k.clone().sub(ae).normalize(),ce=ae.clone().add(re.clone().multiplyScalar(150)),Ce=k.clone().sub(re.clone().multiplyScalar(ec+8)),he=ce.distanceTo(Ce),Ne=ce.clone().add(Ce).multiplyScalar(.5),et=Math.atan2(Ce.y-ce.y,Ce.x-ce.x),Le=new Z(new _e(he,1.8,26),new ke({color:791588,roughness:.9}));Le.position.set(Ne.x,7,Ne.y),Le.rotation.y=-et,e.add(Le);let oe=(K=En[Q.id])!=null?K:me.data,ye=new xe({color:oe.clone()});ye.userData.flowColor=oe.clone();for(let $ of[-14.5,14.5]){let le=new Z(new _e(he,.6,1.4),ye);le.position.set(Ne.x,8.6,Ne.y+Math.cos(et)*$*-1),le.rotation.y=-et,le.position.set(Ne.x,8.6,Ne.y),e.remove(le),Le.add(le),le.position.set(0,.9,$)}e.add(Le),c.push(ye),_.push({district:Q.id,angleDeg:0,x0:Ce.x,z0:Ce.y,x1:ce.x,z1:ce.y})}let v=[{x:zt(121.4873),z:Gt(31.2335),h:150},{x:zt(121.486),z:Gt(31.238),h:130},{x:zt(121.485),z:Gt(31.242),h:118}],P=[];for(let Q=0;Q<16;Q++){let ae=Q/16*Math.PI*2+.2;P.push({x:Math.cos(ae)*1900,z:Math.sin(ae)*1900})}return{root:e,plan:{districts:s,buildings:[],arteries:_,masts:v,ringNodes:P},bodyMats:r,waterMat:h,flowMats:c,colliders:a,buildingCount:l,landmarkSlots:W8,islandPos:x}}function n2(){let i=new Oe,e=new Z(new ot(13,15,7,8),new ke({color:1187379,roughness:.85,metalness:.15}));e.position.y=3.5,e.castShadow=!0,i.add(e);let t=new Z(new ot(9,11,13,8),new ke({color:1451583,roughness:.8,metalness:.2}));t.position.y=13.5,t.castShadow=!0,i.add(t);let n=new xe({color:me.brain.clone().multiplyScalar(1.6)}),s=new Z(new hi(5.2,1),n);s.position.y=26.5,i.add(s);let r=new ke({color:1715274,roughness:.7,metalness:.3}),o=[[5.6,4.8,10,32.5],[4.8,4,10,42.5],[4,3.1,10,52.5]];for(let[m,y,g,p]of o){let M=new Z(new ot(y,m,g,8),r);M.position.y=p,M.castShadow=!0,i.add(M)}let a=new xe({color:me.brain.clone().multiplyScalar(1.3)});for(let m of[32.5,42.5,52.5]){let y=new Z(new Et(4.9,.34,8,32),a);y.rotation.x=Math.PI/2,y.position.y=m,i.add(y)}let l=new Oe;l.position.y=46;let c=new ke({color:2771570,roughness:.35,metalness:.5,emissive:me.data,emissiveIntensity:.55});for(let m=0;m<3;m++){let y=new Z(new _e(10.5,14,1.2),c);y.position.set(Math.cos(m/3*Math.PI*2)*6.6,0,Math.sin(m/3*Math.PI*2)*6.6),y.rotation.y=m/3*Math.PI*2,l.add(y)}i.add(l);let h=new xe({color:new ue(1.15,1.15,1.25)}),u=new Z(new pt(2,18,14),h);u.position.y=61.5,i.add(u);let d=new xe({color:me.ceo,transparent:!0,opacity:0,blending:nt,depthWrite:!1}),f=new Z(new ot(.6,2.4,300,12,1,!0),d);return f.position.y=160,i.add(f),{root:i,coreMat:n,crownMat:h,cortexGroup:l,beamMat:d,beam:f,crown:u}}function i2(i){let e=new Oe,t=[],n=new ke({color:1318707,roughness:.75,metalness:.3});for(let s of i.masts){let r=new Z(new ot(.55,.9,s.h,8),n);r.position.set(s.x,s.h/2,s.z),r.castShadow=!0,e.add(r);let o=new xe({color:me.traffic.clone().multiplyScalar(1.4)}),a=new Z(new Et(1.5,.28,8,24),o);a.rotation.x=Math.PI/2,a.position.set(s.x,s.h*.82,s.z),e.add(a),t.push(o);let l=new Z(new pt(.7,12,10),o);l.position.set(s.x,s.h,s.z),e.add(l)}return{root:e,beaconMats:t}}function ct(i){let e=i>>>0;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var Po=(i,e,t)=>i+(e-i)*t,pn=(i,e,t)=>i<e?e:i>t?t:i,s2=i=>{let e=pn(i,0,1);return e*e*(3-2*e)},Qs=Math.PI/180;function r2(i){let e=t=>t.toString().padStart(2,"0");return`${e(i.getHours())}:${e(i.getMinutes())}:${e(i.getSeconds())}`}function o2(i){return i&&i.length>=5?i.substring(0,5):"--:--"}var eh=130;function a2(i){let e=new Oe,t=ct(90210),n=[],s=i.fleet.filter(l=>l.cores>0),r=new _e(3.4,1.3,1.9),o=new _e(1.6,1,1.5);s.forEach((l,c)=>{let h=c/Math.max(1,s.length)*Math.PI*2+.4,u=new Oe,d=new ue().setHSL(.6+t()*.08,.25,.32),f=new Z(r,new ke({color:d,roughness:.55,metalness:.35}));f.position.y=.85,f.castShadow=!0,u.add(f);let m=new xe({color:2241348}),y=new Z(o,m);y.position.set(-.6,1.95,0),u.add(y);let g=new xe({color:1582127}),p=new Z(new _e(.5,.22,.5),g);p.position.set(.4,1.62,0),u.add(p);let M=eh+6;u.position.set(Math.cos(h)*M,0,Math.sin(h)*M),u.rotation.y=-h+Math.PI/2,e.add(u),n.push({group:u,machine:l,slotAngle:h,headMat:m})});function a(l,c){for(let h of n)if(h.machine.online){let u=h.slotAngle+c*.05,d=eh+6;h.group.position.set(Math.cos(u)*d,0,Math.sin(u)*d),h.group.rotation.y=-u+Math.PI/2,h.headMat.color.setRGB(.4,.95,.85)}else{let u=.1+.05*(.5+.5*Math.sin(c*.8+h.slotAngle*3));h.headMat.color.setRGB(u,u*1.4,u*1.6)}}return{root:e,update:a}}var l2={GM:"gaming",MD:"gaming",QT:"quant",OR:"quant",NS:"media",RV:"media",anchors:"media"},J8={gaming:16747612,quant:5020415,media:10320895,meta:16765286};function h2(i){let e=2166136261;for(let t=0;t<i.length;t++)e^=i.charCodeAt(t),e=Math.imul(e,16777619);return e>>>0}var tc=(i,e)=>i%e,c2=new Map;function tn(i,e=0){let t=i*1e3+e,n=c2.get(t);if(!n){n=new jr({color:i});let s=e||new ue(i).multiplyScalar(.32).getHex();n.emissive=new ue(s),c2.set(t,n)}return n}function er(i,e){if(!i)return e;let t=parseInt(i.replace("#",""),16);return Number.isFinite(t)?t:e}function $8(i,e){let t=document.createElement("canvas"),n=8,s=26,r=t.getContext("2d");r.font=`${s}px "Microsoft YaHei", sans-serif`;let o=Math.min(460,r.measureText(i).width+n*2);t.width=Math.ceil(o),t.height=s+n*2;let a=t.getContext("2d");a.font=`${s}px "Microsoft YaHei", sans-serif`,a.fillStyle="rgba(6,10,18,0.70)",a.fillRect(0,0,t.width,t.height),a.strokeStyle=e,a.lineWidth=2,a.strokeRect(1,1,t.width-2,t.height-2),a.fillStyle=e,a.textBaseline="middle",a.fillText(i,n,t.height/2);let l=new Hr(t),c=new Or(new Bs({map:l,transparent:!0,depthWrite:!1})),h=.013;return c.scale.set(t.width*h,t.height*h,1),c}function j8(i,e){let n;return i<12?n=3.6:i<18?n=4.4:i<41?n=5.2:i<56?n=5:i<70?n=4.8:n=4.6,.26*n*(e?.97:1)}function Q8(i){var U,F,B;let e=new Oe,t=h2(i.id),n=Number((U=i.age)!=null?U:30),s=i.gender==="\u5973",r=n<12,o=j8(n,s)*(.96+tc(t,9)/100),a=tc(t>>10,3),l=a===0?.9:a===2?1.12:1,c=(s?.86:1)*(.92+tc(t>>3,17)/100)*l,h=er(i.skin_c,14266762),u=er(i.hair_c,2829104),d=er(i.cloth_c,4877194),f=er(i.pant_c,3814464),m=er(i.badge_c,4906624),y=er(i.eye_c,16765562),g=.26,p=.24*(r?1.12:1),M=o*(r?.3:.28),E=o*(r?.3:.42),x=M*.86,b=.12*(s?.92:1);for(let V of[-1,1]){let z=new Z(new _e(b,E,.14),tn(f));z.position.set(V*(b*.62),E/2,0),e.add(z);let W=new Z(new _e(b*1.08,.07,.19),tn(2434862));W.position.set(V*(b*.62),.035,.02),e.add(W)}let S=new Z(new _e(.34*c,M,.2*l),tn(d));S.position.set(0,E+M/2,0),e.add(S);for(let V of[-1,1]){let z=new Z(new _e(.085,x,.1),tn(d));z.position.set(V*(.17*c+.045),E+M-x/2+.02,0),e.add(z)}let _=.04,v=E+M+_+g/2,P=new Z(new _e(p,g,.22),tn(h));P.position.set(0,v,0),e.add(P);let C=((((F=i.hair_part)!=null?F:"hair-short").includes("long")?3:0)+tc(t>>5,3))%6,D=new Z(new _e(p*1.06,.07,.23),tn(u));if(D.position.set(0,v+g/2-.02,0),e.add(D),C===1){let V=new Z(new _e(p*1.02,g*.95,.075),tn(u));V.position.set(0,v-.06,-.115),e.add(V)}else if(C===2)for(let V of[-1,1]){let z=new Z(new _e(.055,g*1.25,.055),tn(u));z.position.set(V*(p*.52),v-.1,-.02),e.add(z)}else if(C===3){let V=new Z(new pt(.075,8,6),tn(u));V.position.set(0,v+g/2+.05,-.06),e.add(V)}else if(C===4){let V=new Z(new _e(p*1.18,.035,.13),tn(u));V.position.set(0,v+g/2+.01,.1),e.add(V)}else if(C===5){let V=new Z(new _e(p*1.16,.1,.225),tn(u));V.position.set(0,v+g/2-.03,-.01),e.add(V)}for(let V of[-1,1]){let z=new Z(new _e(.035,.035,.02),tn(y,y));z.position.set(V*.05,v+.01,.112),e.add(z)}let N=new Z(new _e(.06,.06,.02),tn(m,m));N.position.set(-.09*c,E+M-.1,.105),e.add(N);let A=((B=i.faction)!=null?B:"").toLowerCase();if(A.includes("commuter")){let V=new Z(new _e(.1,.14,.06),tn(3882826));V.position.set(.2*c,E+.16,.02),e.add(V)}else if(A.includes("lilong")||A.includes("\u5F04\u5802")){let V=new Z(new _e(.26*c,.3,.02),tn(15262422));V.position.set(0,E+.22,.106),e.add(V)}else if(A.includes("compiled")){let V=new Z(new _e(.19,.05,.02),tn(10135480));V.position.set(0,v+.01,.118),e.add(V)}else if(A.includes("newcomer")){let V=new Z(new _e(.2,.22,.09),tn(3108698));V.position.set(0,E+M-.12,-.145),e.add(V)}return{g:e,h:E+M+_+g}}function u2(i,e){var f,m;let t=new Oe,n=(f=e.residents)!=null?f:[];if(!n.length)return{root:t,update:()=>{},anchors:[],setLabels:()=>{}};let s=ct(20261126),r=new Map,o=[],a=[],l=[],c=0;n.forEach(y=>{var D,N,A,U,F,B,V;let g=(N=l2[(D=y.district)!=null?D:""])!=null?N:"media",p=i.districts.find(z=>z.id===g),M=p?p.cx:0,E=p?p.cz:0,x=s()*Math.PI*2,b=76+s()*28,S=M+Math.cos(x)*b,_=E+Math.sin(x)*b,{g:v,h:P}=Q8(y);v.position.set(S,0,_),v.rotation.y=Math.atan2(S-M,_-E)+h2(y.id)%60/100-.3,t.add(v),o.push(v),c+=v.children.length;let T=(A=J8[g])!=null?A:16777215,C=$8(`${(U=y.name)!=null?U:y.id}`,`#${T.toString(16).padStart(6,"0")}`);C.position.set(S,P+.72,_),t.add(C),l.push(C),r.set(y.id,new I(S,P*.75,_)),a.push({id:y.id,name:(F=y.name)!=null?F:y.id,profession:(B=y.profession)!=null?B:"",ring:(V=y.ring)!=null?V:"",pos:new I(S,P*.5,_)})});let h=(m=e.echoes)!=null?m:[],u=[],d=y=>{var M;let g=(M=l2[y!=null?y:""])!=null?M:"media",p=i.districts.find(E=>E.id===g);return p?new I(p.cx,24,p.cz):null};return h.slice(0,24).forEach((y,g)=>{var _,v,P,T;let p=r.get((_=y.owner)!=null?_:""),M=r.get((v=y.by)!=null?v:"");if(p||(p=(P=d(y.owner_d))!=null?P:void 0),M||(M=(T=d(y.by_d))!=null?T:void 0),!p||!M)return;let E=new I().addVectors(p,M).multiplyScalar(.5);E.y+=14+g%5*4;let x=new $i(p.clone(),E,M.clone()),b=new mt().setFromPoints(x.getPoints(24)),S=new Ki(b,new zs({color:6160304,transparent:!0,opacity:.45}));t.add(S),u.push(S)}),window.__CITY_RESIDENTS__={figures:o.length,meshes:c,arcs:u.length,slots:n.length},{root:t,anchors:a,setLabels:y=>{l.forEach(g=>{g.visible=y})},update:(y,g)=>{o.forEach((p,M)=>{p.position.y=Math.sin(g*1.1+M)*.012}),u.forEach((p,M)=>{let E=p.material;E.opacity=.18+.26*(.5+.5*Math.sin(g*.9+M))})}}}var d2=me.data.clone().multiplyScalar(1.4),f2=me.data.clone().multiplyScalar(1.15),p2=me.brain.clone().multiplyScalar(1.4),m2=me.brain.clone().multiplyScalar(1.9),g2=me.capital.clone().multiplyScalar(1.35),_2=me.capital.clone().multiplyScalar(1.5),x2=me.capital.clone().multiplyScalar(2),as=new _e(1,1,1),e_=new ot(3.6,4.6,1,12),t_=new ot(5.6,6.6,2,12),n_=new ot(1.5,1.5,1,10),i_=new ot(3,3,1,16),s_=new pt(25,32,20),r_=new pt(22.5,28,18),o_=new pt(8,20,14),a_=new ot(.14,.9,116,8),l_=new pt(1.5,12,10),c_=new Et(25,.7,8,48),h_=new Et(22.5,.6,8,44),u_=new Et(8,.4,8,32),d_=new Et(17,.5,8,40),f_=new ot(.22,1.5,22.5,8),p_=new pt(1.5,12,10);function y2(){let i=ct(59922),e=new Oe,t=new I(0,1,0),n=new ke({color:2899804,roughness:.9,metalness:.1}),s=new ke({color:2241359,roughness:.55,metalness:.35}),r=new ke({color:4743818,roughness:.3,metalness:.85}),o=new xe({color:d2.clone(),blending:nt,transparent:!0,depthWrite:!1}),a=new xe({color:f2.clone(),blending:nt,transparent:!0,depthWrite:!1}),l=new xe({color:p2.clone()}),c=new xe({color:m2.clone()}),h=66,u=2.5,d=110,f=[];for(let N=0;N<3;N++){let A=N/3*Math.PI*2+Math.PI/6,U=new I(Math.cos(A)*h,0,Math.sin(A)*h),F=new I(Math.cos(A)*u,d,Math.sin(A)*u);f.push(U);let B=F.clone().sub(U),V=new Z(e_,n);V.scale.y=B.length(),V.quaternion.setFromUnitVectors(t,B.normalize()),V.position.copy(U).add(F).multiplyScalar(.5),V.castShadow=!0,e.add(V);let z=new Z(t_,n);z.position.set(U.x,1,U.z),e.add(z)}let m=72,y=h-(h-u)*(m/d);for(let N=0;N<3;N++){let A=Math.atan2(f[N].z,f[N].x),U=Math.atan2(f[(N+1)%3].z,f[(N+1)%3].x),F=new I(Math.cos(A)*y,m,Math.sin(A)*y),B=new I(Math.cos(U)*y,m,Math.sin(U)*y),V=B.clone().sub(F),z=new Z(n_,n);z.scale.y=V.length(),z.quaternion.setFromUnitVectors(t,V.normalize()),z.position.copy(F).add(B).multiplyScalar(.5),e.add(z)}let g=new Z(s_,s);g.position.y=98,g.castShadow=!0,e.add(g);let p=new Z(r_,s);p.position.y=267,p.castShadow=!0,e.add(p);let M=new Z(o_,s);M.position.y=344,M.castShadow=!0,e.add(M);let E=[],x=(N,A)=>{let U=new Z(N,o);U.rotation.x=Math.PI/2,U.position.y=A,e.add(U),E.push({mesh:U,phase:i()*Math.PI*2})};x(c_,98),x(h_,267),x(u_,344);let b=95,S=352,_=S-b,v=(b+S)/2,P=new Z(i_,s);P.scale.y=_,P.position.y=v,P.castShadow=!0,e.add(P);for(let N=0;N<8;N++){let A=N/8*Math.PI*2+Math.PI/8,U=new Z(as,r);U.scale.set(.65,_,1.2),U.position.set(Math.cos(A)*3.55,v,Math.sin(A)*3.55),U.rotation.y=Math.PI/2-A,e.add(U);let F=A+Math.PI/8,B=new Z(as,a);B.scale.set(.22,_,.34),B.position.set(Math.cos(F)*3.95,v,Math.sin(F)*3.95),B.rotation.y=Math.PI/2-F,e.add(B)}let T=new Z(a_,l);T.position.y=410,e.add(T);let C=new Z(l_,c);return C.position.y=468,e.add(C),{root:e,update:(N,A)=>{let U=.72+.28*Math.sin(A*1.4);o.color.copy(d2).multiplyScalar(U);for(let V of E)V.mesh.scale.setScalar(1+.02*Math.sin(A*1.4+V.phase));a.color.copy(f2).multiplyScalar(.55+.45*Math.sin(A*2.1));let F=A%2.4,B=F<.12||F>.26&&F<.38;c.color.copy(m2).multiplyScalar(B?1:.08),C.scale.setScalar(B?1.25:.85),l.color.copy(p2).multiplyScalar(.85+.15*Math.sin(A*.9))}}}function M2(){let i=ct(315405),e=new Oe,t=new I(0,1,0),n=new ke({color:2767966,roughness:.72,metalness:.28}),s=new ke({color:3821688,roughness:.3,metalness:.85}),r=new xe({color:g2.clone(),blending:nt,transparent:!0,depthWrite:!1}),o=new xe({color:_2.clone(),blending:nt,transparent:!0,depthWrite:!1}),a=new xe({color:x2.clone()}),l=68,c=26,h=new Z(as,n);h.scale.set(l,c,l),h.position.y=c/2,h.castShadow=!0,e.add(h);let u=(x,b,S,_,v)=>{let P=new Z(as,r);P.scale.set(v,_,v),P.position.set(x,S,b),e.add(P)};for(let x=-1;x<=1;x+=2)for(let b=-1;b<=1;b+=2)u(x*(l/2-.1),b*(l/2-.1),c/2,c+1.5,1.4);let d=8,f=42.5,m=58,y=340;for(let x=0;x<d;x++){let b=m*Math.pow(.94,x),S=b/2,_=f/2+x*f,v=new Z(as,n);v.scale.set(b,f,b),v.position.y=_,v.castShadow=!0,e.add(v);for(let P=-1;P<=1;P+=2)for(let T=-1;T<=1;T+=2)u(P*(S-.1),T*(S-.1),_,f+2.2,1.1)}let g=m*Math.pow(.94,d-1)/2;for(let x=0;x<5;x++){let b=y+x*11.5,S=17*(1-.16*x),_=.4-.06*x+(i()-.5)*.05,v=12.5+(i()-.5)*.8,P=2*S*Math.sin(Math.PI/8)*1.28;for(let C=0;C<8;C++){let D=C/8*Math.PI*2+Math.PI/8+(i()-.5)*.04,N=new Oe;N.position.y=b,N.rotation.y=D;let A=new Z(as,s);A.scale.set(P,v,.8),A.position.set(S+v/2*Math.sin(_),v/2*Math.cos(_),0),A.rotation.z=-_,N.add(A),e.add(N)}let T=new Z(d_,r);T.rotation.x=Math.PI/2,T.scale.setScalar(S/17),T.position.y=b+1,e.add(T)}for(let x=-1;x<=1;x+=2)for(let b=-1;b<=1;b+=2){let S=new I(x*g,y,b*g),_=new I(x*3.2,397.5,b*3.2),v=_.clone().sub(S),P=new Z(as,r);P.scale.set(.7,v.length(),.7),P.quaternion.setFromUnitVectors(t,v.normalize()),P.position.copy(S).add(_).multiplyScalar(.5),e.add(P)}let p=new Z(f_,o);p.position.y=397+22.5/2,e.add(p);let M=new Z(p_,a);return M.position.y=419.2,e.add(M),{root:e,update:(x,b)=>{let S=.5+.5*Math.sin(b*1.1);a.color.copy(x2).multiplyScalar(1+.9*S),M.scale.setScalar(.9+.3*S),o.color.copy(_2).multiplyScalar(.8+.35*Math.sin(b*1.1+.7)),r.color.copy(g2).multiplyScalar(.88+.16*Math.sin(b*.8+2.1))}}}var b2=new _e(1,1,1),Ui=18,ls=35,Io=.14,nh=42/(1+Io),ih=22.5/(1+Io),v2=Math.PI*2/3,sh=Ui*ls,E2=i=>Po(nh,ih,i/sh);function m_(i,e){let t=new ot(i,e,ls,72,1,!0),n=t.attributes.position;for(let s=0;s<n.count;s++){let r=n.getX(s),o=n.getZ(s),a=1+Io*Math.cos(3*Math.atan2(r,o));n.setX(s,r*a),n.setZ(s,o*a)}return t.computeVertexNormals(),t}var S2=[];for(let i=0;i<Ui;i++)S2.push(m_(Po(nh,ih,(i+1)/Ui),Po(nh,ih,i/Ui)));var g_=new ot(14,26,630,20),__=new Et(23.5,1.5,10,48);function T2(){let i=new Oe;i.name="landmark-shanghai-tower";let e=ct(6233633),t=new ke({color:1320511,transparent:!0,opacity:.55,metalness:.6,roughness:.22,side:Ht,depthWrite:!1}),n=new ke({color:1847376,roughness:.85,metalness:.15}),s=new xe({color:me.brain.clone().multiplyScalar(1.35)}),r=new xe({color:me.data.clone().multiplyScalar(1.5)});for(let u=0;u<Ui;u++){let d=new Z(S2[u],t);d.position.y=u*ls+ls/2,d.rotation.y=u/Ui*v2,d.castShadow=!0,i.add(d)}let o=new Z(g_,n);o.position.y=sh/2,o.castShadow=!0,i.add(o);for(let u=0;u<Ui;u++){let d=u/Ui*v2,f=u*ls;for(let m=0;m<3;m++){let y=d+m*Math.PI*2/3,g=Math.sin(y),p=Math.cos(y),M=E2(f)*(1+Io)+.25,E=E2(f+ls)*(1+Io)+.25,x=new I(g*M,f,p*M),b=new I(g*E,f+ls,p*E),S=new I().subVectors(b,x),_=new Z(b2,s);_.scale.set(.85+.3*e(),S.length()+.8,.55),_.position.copy(x).add(b).multiplyScalar(.5);let v=S.clone().normalize(),P=new I(p,0,-g),T=new I().crossVectors(P,v).normalize(),C=new I().crossVectors(v,T);_.quaternion.setFromRotationMatrix(new Ze().makeBasis(C,v,T)),i.add(_)}}let a=new Z(__,r);a.rotation.x=Math.PI/2,a.position.y=sh+.5,i.add(a);let l=s.color.clone(),c=r.color.clone();return{root:i,update:(u,d)=>{s.color.copy(l).multiplyScalar(.8+.26*Math.sin(d*.9));let f=.62+.5*Math.sin(d*1.7);r.color.copy(c).multiplyScalar(f),a.scale.setScalar(1+.03*Math.sin(d*1.7))}}}var Oi=486,Lo=436,th=58,x_=24;var y_=[[.15,0],[29,0],[20,Oi],[11,Oi],[15,Lo],[.15,Lo]],M_=[[-.15,0],[-.15,Lo],[-15,Lo],[-11,Oi],[-20,Oi],[-29,0]];function w2(i){let e=new Yn;e.moveTo(i[0][0],i[0][1]);for(let r=1;r<i.length;r++)e.lineTo(i[r][0],i[r][1]);e.closePath();let t=new ci(e,{depth:th,bevelEnabled:!1}),n=t.attributes.position,s=x_/th;for(let r=0;r<n.count;r++){let o=Po(1,s,n.getY(r)/Oi);n.setZ(r,(n.getZ(r)-th/2)*o)}return t.computeVertexNormals(),t}var v_=w2(y_),E_=w2(M_),b_=new _e(30,6,25),S_=new _e(2.4,56,7.5),T_=new pt(1.5,14,10);function R2(){let i=new Oe;i.name="landmark-swfc";let e=ct(3943834),t=new ke({color:2900070,roughness:.3,metalness:.55}),n=new xe({color:me.capital.clone().multiplyScalar(1.3)}),s=new xe({color:new ue(1.1,1.1,1.25)});for(let u of[v_,E_]){let d=new Z(u,t);d.castShadow=!0,i.add(d)}let r=new Z(b_,t);r.position.y=Oi+3,r.castShadow=!0,i.add(r);let o=new Z(S_,t);o.position.set(2,461,0),o.rotation.z=Math.atan2(26,48),o.castShadow=!0,i.add(o);let a=(u,d,f,m,y,g)=>{let p=new Z(b2,n);p.scale.set(u*(.95+.1*e()),d,f),p.position.set(m,y,0),p.rotation.z=g,i.add(p)};a(31.2,1,28.3,0,Lo+.3,0),a(23.2,1,24.8,0,Oi+.3,0),a(1,51.4,26.3,13,461,.08),a(1,51.4,26.3,-13,461,-.08);let l=new Z(T_,s);l.position.y=Oi+7.2,i.add(l);let c=n.color.clone();return{root:i,update:(u,d)=>{n.color.copy(c).multiplyScalar(.84+.16*Math.sin(d*.55))}}}var ic=new ke({color:2241614,roughness:.85,metalness:.15}),A2=new ke({color:2900584,roughness:.4,metalness:.45,emissive:me.traffic,emissiveIntensity:.22}),tr=new ke({color:2766928,roughness:.6,metalness:.45}),rh=new xe({color:me.traffic.clone().multiplyScalar(1.25)}),nc=new xe({color:me.traffic.clone().multiplyScalar(1.35)}),C2=new xe({color:me.data.clone().multiplyScalar(1.3)}),P2=new xe({color:me.capital.clone().multiplyScalar(1.2)});function I2(){let i=new Oe;i.name="whiteMagnolia";let e=ct(11326),t=12,n=270,s=55,r=32,o=new Z(new _e(64,t,64),ic);o.position.y=t/2,o.castShadow=!0,i.add(o);let a=new Z(new ot(r/Math.SQRT2,s/Math.SQRT2,n-t,4,1),ic);a.rotation.y=Math.PI/4,a.position.y=(t+n)/2,a.castShadow=!0,i.add(a);let l=s/2,c=r/2,h=new I(0,1,0),u=Math.hypot(n-t,(l-c)*Math.SQRT2),d=new _e(1.2,u,1.2);for(let S of[-1,1])for(let _ of[-1,1]){let v=new Z(d,rh),P=new I(S*(c-l),n-t,_*(c-l));v.quaternion.setFromUnitVectors(h,P.normalize()),v.position.set(S*(l+c)/2,(t+n)/2,_*(l+c)/2),i.add(v)}let f=140,m=(f-t)/(n-t),y=new Z(new Et((s+(r-s)*m)/Math.SQRT2+.4,.9,8,48),rh);y.rotation.x=Math.PI/2,y.position.y=f,i.add(y);let g=new Z(new _e(30,7,30),ic);g.position.y=273.5,i.add(g);let p=5;for(let S=0;S<p;S++){let _=52+e()*4,v=12+e()*2.5,P=(29+e()*5)*Qs,T=new Oe;T.rotation.y=S/p*Math.PI*2+.35,T.position.y=271,i.add(T);let C=new Yn;C.moveTo(0,0),C.quadraticCurveTo(v,_*.22,v*.55,_*.6),C.quadraticCurveTo(v*.28,_*.88,0,_),C.quadraticCurveTo(-v*.28,_*.88,-v*.55,_*.6),C.quadraticCurveTo(-v,_*.22,0,0);let D=new Z(new ci(C,{depth:2.4,bevelEnabled:!1,curveSegments:12}),A2);D.rotation.x=P,D.position.z=6,T.add(D);let N=new Z(new _e(.9,_*.78,.5),nc);N.position.set(0,_*.58,3),D.add(N)}let M=new Z(new hi(4.2,1),nc);M.position.y=291,i.add(M);let E=new Z(new Et(7.5,.55,8,40),nc);E.rotation.x=Math.PI/2,E.position.y=287,i.add(E);let x=0;return{root:i,update:(S,_)=>{let v=.5+.5*Math.sin(_*1.6);nc.color.copy(me.traffic).multiplyScalar(1.1+v*.55),A2.emissiveIntensity=.18+v*.3;let P=Math.pow(Math.max(0,Math.sin(_*2.3+.8)),3);x+=(P-x)*Math.min(1,S*9),M.scale.setScalar(.85+x*.45),E.scale.setScalar(.9+x*.28);let T=.5+.5*Math.sin(_*.7+2.1);rh.color.copy(me.traffic).multiplyScalar(1+T*.4)}}}function L2(){let i=new Oe;i.name="waibaiduBridge";let e=ct(21204),t=52,n=2,s=t*n,r=10,o=1.5,a=14,l=11,c=6.5,h=6.6,u=r+.4,d=u+l,f=new Z(new _e(s,o,a),tr);f.position.y=r-o/2,f.castShadow=!0,i.add(f);let m=new _e(t,1,1),y=new _e(.7,l,.7),g=Math.hypot(c,l),p=new _e(g,.55,.55),M=Math.atan2(l,c);for(let _=0;_<n;_++){let v=-s/2+_*t,P=v+t/2;for(let T of[-h,h]){for(let C of[u,d]){let D=new Z(m,tr);D.position.set(P,C,T),i.add(D)}for(let C=0;C<=t/c;C++){if(_===1&&C===0)continue;let D=new Z(y,tr);D.position.set(v+C*c,(u+d)/2,T),i.add(D)}for(let C=0;C<t/c;C++){let D=v+(C+.5)*c;for(let N of[1,-1]){let A=new Z(p,tr);A.position.set(D,(u+d)/2,T),A.rotation.z=N*M,i.add(A)}}}}for(let _ of[-1,1]){let v=17.5+e()*1.5,P=_*(s/2-.5);for(let C of[-h,h]){let D=new Z(new _e(1.8,v,1.8),tr);D.position.set(P,r-1+v/2,C),D.castShadow=!0,i.add(D)}let T=new Z(new _e(2.4,2.4,h*2+2.2),tr);T.position.set(P,r-1+v-1.2,0),T.castShadow=!0,i.add(T)}let E=new _e(5.5,r-o,12);for(let _ of[0,-(s/2)+3,s/2-3]){let v=new Z(E,ic);v.position.set(_,(r-o)/2,0),v.castShadow=!0,i.add(v)}let x=new _e(s,.4,.4);for(let _ of[-h-.75,h+.75])for(let v of[u,d]){let P=new Z(x,C2);P.position.set(0,v,_),i.add(P)}let b=new _e(s,.5,.5);for(let _ of[-(a/2+.25),a/2+.25]){let v=new Z(b,P2);v.position.set(0,r+.3,_),i.add(v)}return{root:i,update:(_,v)=>{let P=.5+.5*Math.sin(v*1.1);P2.color.copy(me.capital).multiplyScalar(.95+P*.3);let T=.5+.5*Math.sin(v*.5+2.6);C2.color.copy(me.data).multiplyScalar(1.05+T*.3)}}}var w_=`
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,R_=`
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;
varying vec3 vPos;
void main() {
  float h = normalize(vPos + vec3(0.0, offset, 0.0)).y;
  float t = pow(max(h, 0.0), exponent);
  gl_FragColor = vec4(mix(bottomColor, topColor, t), 1.0);
}`;function D2(){let i={topColor:{value:new ue(263694)},bottomColor:{value:new ue(66e4)},offset:{value:120},exponent:{value:.7}},e=new Pt({uniforms:i,vertexShader:w_,fragmentShader:R_,side:Qt,depthWrite:!1,fog:!1}),t=new Z(new pt(880,24,16),e);t.frustumCulled=!1;let n=900,s=new Float32Array(n*3),o=1234567,a=()=>(o=o*1103515245+12345&2147483647,o/2147483647);for(let u=0;u<n;u++){let d=a()*Math.PI*2,f=Math.acos(a()*.85+.1),m=820;s[u*3]=m*Math.sin(f)*Math.cos(d),s[u*3+1]=Math.abs(m*Math.cos(f)),s[u*3+2]=m*Math.sin(f)*Math.sin(d)}let l=new mt;l.setAttribute("position",new Ut(s,3));let c=new Xn({color:13623551,size:1.6,sizeAttenuation:!1,transparent:!0,opacity:.9,depthWrite:!1,fog:!1}),h=new ai(l,c);return h.frustumCulled=!1,{mesh:t,uniforms:i,stars:h,starMat:c}}var sc=class{constructor(e,t,n,s,r){this.bodyMat=null;this.groundMat=null;this.breathBoost=0;this.zoneGain=new Map;this.realMats=new Map;this.waterMat=null;this.flowMats=[];this.dustMat=null;this.scene=e,this.sun=t,this.hemi=n,this.sky=s,this.data=r;let o=r.reality.beijing_hhmm||"12:00",[a,l]=o.split(":").map(c=>parseInt(c,10)||0);this.baseHour=a+l/60,this.basePerf=performance.now(),this.fog=new Ir(329743,16e-5),e.fog=this.fog;for(let c of r.zones)this.zoneGain.set(c.id,.45+.55*Math.min(1,Math.max(0,c.activity)))}attachMaterials(e,t){this.bodyMat=e,this.groundMat=t}hour(){let e=(performance.now()-this.basePerf)/36e5;return(this.baseHour+e)%24}label(){return $d(this.hour())}update(){var l,c,h;let e=this.hour(),t=Jd(e);this.sky.uniforms.topColor.value.copy(t.skyTop),this.sky.uniforms.bottomColor.value.copy(t.skyBottom),this.fog.color.copy(t.fog),this.sky.starMat.opacity=t.starOpacity;let n=(e-6)/12,s,r,o;n>=0&&n<=1?(s=Math.cos(Math.PI*(1-n))*500,r=Math.max(40,Math.sin(Math.PI*n)*500),o=220):(s=-300,r=420,o=-260),this.sun.position.set(s,r,o),this.sun.color.copy(t.sunColor),this.sun.intensity=t.sunIntensity,this.hemi.color.copy(t.hemiSky),this.hemi.groundColor.copy(t.hemiGround),this.hemi.intensity=t.hemiIntensity;let a=this.breathBoost;for(let[u,d]of this.realMats){let f=(l=this.zoneGain.get(u))!=null?l:.5;d.uniforms.uWinGain.value=Math.max(.3,t.windowGain*f*1.8),d.uniforms.uBreath.value=a,d.uniforms.uBodyGain.value=t.bodyGain*.9+.55}this.waterMat&&(this.waterMat.uniforms.uTime.value=performance.now()/1e3);for(let u of this.flowMats){let d=u.userData.flowColor;u.color.copy(d).multiplyScalar(.55+.85*t.windowGain+a*.5)}(c=this.bodyMat)==null||c.color.setScalar(t.bodyGain),(h=this.groundMat)==null||h.color.copy(t.groundColor),this.dustMat&&(this.dustMat.opacity=.5*t.streetGain),this.breathBoost=Math.max(0,this.breathBoost-.0035)}};function N2(i,e){let t=ct(4242),n=e.census_total||1e4,s=620,r=new Float32Array(s*3);for(let c=0;c<s;c++){let h=i.districts[Math.floor(t()*i.districts.length)],u=t()*Math.PI*2,d=80+t()*330;r[c*3]=h.cx+Math.cos(u)*d,r[c*3+1]=3+t()*45,r[c*3+2]=h.cz+Math.sin(u)*d}let o=new mt;o.setAttribute("position",new Ut(r,3));let a=new Xn({color:8251608,size:3.4,sizeAttenuation:!0,transparent:!0,opacity:.4,depthWrite:!1,blending:nt,fog:!0}),l=new ai(o,a);return l.frustumCulled=!1,{points:l,mat:a}}var rc=class{constructor(e,t,n,s,r){this.dots=[];this.queue=[];this.crownPulse=0;this.beamT0=-999;this.hooks={};this.plan=t,this.tower=n,this.daynight=s,this.tower.beamMat.userData.t0=-999;let o=new pt(4.2,10,8);for(let l=0;l<18;l++){let c=new xe({color:16777215}),h=new Z(o,c);h.visible=!1,e.add(h),this.dots.push({mesh:h,active:!1,t0:0,dur:8,from:new I,ctrl:new I,to:new I})}r.slice(-42).forEach((l,c)=>{this.queue.push({e:l,at:2+c*1.85})})}spawn(e,t){var h;let n=this.dots.find(u=>!u.active);if(!n)return;let s=e!=null?e:"governance",r=this.tower.root.position.clone(),o=this.plan.districts.find(u=>u.id===s);o&&(r=new I(o.cx,30,o.cz));let a=this.tower.root.position.clone();a.y+=150;let l=r.clone().lerp(a,.5);l.y=Math.max(r.y,a.y)+160,n.active=!0,n.t0=t,n.dur=8.5,n.from.copy(r),n.ctrl.copy(l),n.to.copy(a);let c=(h=En[s])!=null?h:En.governance;n.mesh.material.color.copy(c).multiplyScalar(1.7),n.mesh.visible=!0}ceoPulse(e){this.crownPulse=Math.min(1.4,this.crownPulse+1),this.beamT0=e}update(e){var o,a;for(;this.queue.length>0&&this.queue[0].at<=e;){let c=this.queue.shift().e;(a=(o=this.hooks).onEvent)==null||a.call(o,c,e),c.type==="CEO_ORDER"||c.type==="DECISION_MADE"||c.type==="DECISION_OVERRULED"?this.ceoPulse(e):c.type==="OS_TICK_START"||c.type==="OS_TICK_DONE"?this.daynight.breathBoost=Math.min(.35,this.daynight.breathBoost+.22):c.type==="TRANSFER"||this.spawn(c.zone,e)}let t=new I;for(let l of this.dots){if(!l.active)continue;let c=(e-l.t0)/l.dur;if(c>=1){l.active=!1,l.mesh.visible=!1,this.crownPulse=Math.min(.9,this.crownPulse+.25);continue}let h=c*c*(3-2*c),u=l.from,d=l.ctrl,f=l.to;t.set((1-h)*(1-h)*u.x+2*(1-h)*h*d.x+h*h*f.x,(1-h)*(1-h)*u.y+2*(1-h)*h*d.y+h*h*f.y,(1-h)*(1-h)*u.z+2*(1-h)*h*d.z+h*h*f.z),l.mesh.position.copy(t)}let n=e-this.beamT0;this.tower.beamMat.opacity=n<2.4?Math.max(0,1-n/2.4)*.55:0;let s=this.crownPulse;this.tower.crownMat.color.setRGB(1.15+s*1.1,1.15+s*1.1,1.25+s*1.1),this.crownPulse=Math.max(0,this.crownPulse-.02);let r=.5+.5*Math.sin(e*1.4);this.tower.coreMat.color.setRGB(.38+.1*r,.65+.14*r,1+.22*r),this.tower.cortexGroup.rotation.y=e*.12}};var A_=12,C_=150,U2=9.4,P_=.85,O2={gaming:me.data,quant:me.capital,media:me.traffic};function F2(i){let e=new Oe,t=new _e(20,1.1,1.1),n=[];for(let a=0;a<A_;a++){let l=new xe({color:16777215,transparent:!0,opacity:0,depthWrite:!1,blending:nt}),c=new Z(t,l);c.visible=!1,e.add(c),n.push({mesh:c,mat:l,active:!1,progress:0,len:1,from:new I,to:new I})}let s=a=>{a.active=!1,a.mat.opacity=0,a.mesh.visible=!1};return{root:e,pushEvent:a=>{var u;if(a.type!=="TRANSFER")return;let l=n.find(d=>!d.active);if(!l)return;let c=(u=a.zone)!=null?u:"gaming";O2[c]||(c="gaming");let h=i.arteries.find(d=>d.district===c);h&&(l.from.set(h.x1,U2,h.z1),l.to.set(h.x0,U2,h.z0),l.len=l.from.distanceTo(l.to),!(l.len<1e-4)&&(l.progress=0,l.active=!0,l.mesh.rotation.y=Math.atan2(-(h.z0-h.z1),h.x0-h.x1),l.mat.color.copy(O2[c]),l.mat.opacity=P_,l.mesh.visible=!0,l.mesh.position.copy(l.from)))},update:(a,l)=>{for(let c of n)if(c.active){if(c.progress+=a*C_/c.len,c.progress>=1){s(c);continue}c.mesh.position.copy(c.from).lerp(c.to,c.progress)}}}}var cs=300,I_=new _e(8,2.2,4),B2=new _e(2.5,.5,3.5),L_=new ke({color:16777215,roughness:.55,metalness:.35}),D_=new xe({color:16773824}),N_=9.05,U_=new Ze().makeTranslation(2.8,.35,0),O_=new Ze().makeTranslation(-2.8,.35,0),F_=new xe({color:16726832}),H2=5,nr=new Ze().makeScale(0,0,0),B_={gaming:1718837,quant:3813914,media:3807790},H_=1843755;function z_(i){return i>=7&&i<9||i>=17&&i<19?{speed:60,density:1}:i>=9&&i<17?{speed:45,density:.6}:{speed:30,density:.08}}function z2(i){var f;let e=new Oe,t=[];for(let m of i.arteries){let y=m.x0-m.x1,g=m.z0-m.z1,p=Math.hypot(y,g);if(p<1)continue;let M=y/p,E=g/p;t.push({district:m.district,fx:m.x1,fz:m.z1,dx:M,dz:E,len:p,ox:-E*H2,oz:M*H2,heading:Math.atan2(-E,M),start:0,count:0,target:0})}if(t.length===0)return{root:e,update:()=>{}};let n=ct(774411),s=new yt(I_,L_,cs);s.instanceMatrix.setUsage(mi),s.frustumCulled=!1,s.castShadow=!1,e.add(s);let r=new yt(B2,D_,cs);r.instanceMatrix.setUsage(mi),r.frustumCulled=!1,e.add(r);let o=new yt(B2,F_,cs);o.instanceMatrix.setUsage(mi),o.frustumCulled=!1,e.add(o);let a=[],l=new ue,c=-1;for(let m=0;m<cs;m++){let y=Math.min(t.length-1,Math.floor(m/cs*t.length)),g=t[y];y!==c&&(g.start=m,c=y),g.count++;let p=g.count%2===1;a.push({lane:y,forward:p,progress:n(),heading:g.heading+(p?0:Math.PI)}),l.setHex((f=B_[g.district])!=null?f:H_),s.setColorAt(m,l)}s.instanceColor&&(s.instanceColor.needsUpdate=!0);for(let m=0;m<cs;m++)s.setMatrixAt(m,nr),r.setMatrixAt(m,nr),o.setMatrixAt(m,nr);let h=new Tt,u=new Ze;function d(m,y,g){let{speed:p,density:M}=z_(g);for(let E of t)E.target=pn(Math.round(E.count*M),0,E.count);for(let E=0;E<cs;E++){let x=a[E],b=t[x.lane];if(x.progress=(x.progress+m*p/b.len)%1,E-b.start>=b.target){s.setMatrixAt(E,nr),r.setMatrixAt(E,nr),o.setMatrixAt(E,nr);continue}let S=x.forward?x.progress:1-x.progress,_=x.forward?0:b.ox,v=x.forward?0:b.oz;h.position.set(b.fx+b.dx*S*b.len+_,N_,b.fz+b.dz*S*b.len+v),h.rotation.set(0,x.heading,0),h.scale.setScalar(1),h.updateMatrix(),s.setMatrixAt(E,h.matrix),u.multiplyMatrices(h.matrix,U_),r.setMatrixAt(E,u),u.multiplyMatrices(h.matrix,O_),o.setMatrixAt(E,u)}s.instanceMatrix.needsUpdate=!0,r.instanceMatrix.needsUpdate=!0,o.instanceMatrix.needsUpdate=!0}return{root:e,update:d}}var G2=new ot(.4,.9,26,6);G2.translate(0,13,0);var G_=26,k_=new pt(1.1,8,6),V_=.6,oc=[{x:1215.4,z:1033.5,roofY:632},{x:1110.3,z:847.8,roofY:492},{x:454.9,z:368.1,roofY:468},{x:1032.7,z:613.5,roofY:420.5},{x:-471.1,z:-624.6,roofY:295},{x:-856.6,z:-195.2,roofY:27.7},{x:261.4,z:432.7,roofY:259.9},{x:1000.7,z:19.2,roofY:256},{x:175.9,z:490.6,roofY:249.9},{x:377.3,z:757.6,roofY:238},{x:1101.2,z:28.6,roofY:238},{x:659.7,z:-143.8,roofY:230},{x:880.8,z:-137.1,roofY:216},{x:973.6,z:-154.9,roofY:216},{x:996.7,z:731.5,roofY:210},{x:391.8,z:862,roofY:200}];function k2(){let i=new Oe;i.name="rooftops";let e=new ke({color:1845302,roughness:.8,metalness:.3}),t=new xe({color:16729156}),n=new yt(G2,e,oc.length),s=new yt(k_,t,oc.length),r=new Ze;for(let a=0;a<oc.length;a++){let l=oc[a];r.makeTranslation(l.x,l.roofY,l.z),n.setMatrixAt(a,r),r.makeTranslation(l.x,l.roofY+G_,l.z),s.setMatrixAt(a,r)}return n.instanceMatrix.needsUpdate=!0,s.instanceMatrix.needsUpdate=!0,n.frustumCulled=!1,s.frustumCulled=!1,i.add(n,s),{root:i,update:(a,l)=>{Math.sin(l/V_*Math.PI*4)>0?t.color.setRGB(3.2,.5,.5):t.color.setRGB(.35,.06,.06)}}}var W_=[[31.218,121.489],[31.226,121.4908],[31.231,121.493],[31.234,121.4965],[31.236,121.5],[31.239,121.503],[31.243,121.5018],[31.248,121.502],[31.254,121.5035],[31.26,121.5065],[31.266,121.51],[31.272,121.5145]],V2=230,W2=60,X2=30,Y2=80,q2=.1,X_=.22,Y_=.06,q_=.6,Z_=.15,K_=.9,Z2=new Fn(3.2,14);Z2.translate(0,7,0);var J_=me.capital.clone(),$_=me.data.clone(),j_=me.traffic.clone(),Q_=[{id:"gold",color:J_},{id:"cyan",color:$_},{id:"magenta",color:j_}];function K2(){let i=ct(31415),e=new Oe,t=W_.map(([d,f])=>({lat:d,x:zt(f),z:Gt(d)})),n=[0];for(let d=0;d<t.length-1;d++)n.push(n[d]+Math.hypot(t[d+1].x-t[d].x,t[d+1].z-t[d].z));let s=n[n.length-1],r=d=>{let f=0;for(;f<t.length-2&&d>n[f+1];)f++;let m=n[f+1]-n[f],y=m>0?(d-n[f])/m:0,g=t[f+1].x-t[f].x,p=t[f+1].z-t[f].z,M=Math.hypot(g,p)||1;return{x:t[f].x+g*y,z:t[f].z+p*y,lat:t[f].lat+(t[f+1].lat-t[f].lat)*y,tx:g/M,tz:p/M}},o=(d,f)=>{let m=1/0,y=0,g=0;for(let p=0;p<t.length-1;p++){let M=t[p].x,E=t[p].z,x=t[p+1].x-M,b=t[p+1].z-E,S=x*x+b*b||1,_=Math.min(1,Math.max(0,((d-M)*x+(f-E)*b)/S)),v=M+x*_,P=E+b*_,T=(d-v)*(d-v)+(f-P)*(f-P);T<m&&(m=T,y=v,g=P)}return{px:y,pz:g}},a={gold:[],cyan:[],magenta:[]};for(let d of[1,-1])for(let f=0;f<W2;f++){let m=(f+i())/W2*s,y=r(m),g=-y.tz,p=y.tx,M=X2+i()*(Y2-X2),E=(V2-M)*d,x=y.x+g*E,b=y.z+p*E,S=o(x,b),_=x-S.px,v=b-S.pz,P=Math.hypot(_,v),T=V2-Y2;P<T&&P>1e-6&&(x=S.px+_/P*T,b=S.pz+v/P*T);let C=d>0?"gold":"magenta";a[C].push({x,z:b,heading:Math.atan2(-y.tz,y.tx),tilt:(i()*2-1)*Y_,base:q2+i()*(X_-q2),phase:i()*Math.PI*2})}let l=new Tt;l.rotation.order="YXZ";let c=new ue,h=[];for(let d of Q_){let f=a[d.id],m=new xe({color:d.color,blending:nt,transparent:!0,depthWrite:!1,side:Ht,fog:!0}),y=new yt(Z2,m,f.length),g=new Float32Array(f.length),p=new Float32Array(f.length);for(let M=0;M<f.length;M++){let E=f[M];l.position.set(E.x,q_,E.z),l.rotation.set(E.tilt,E.heading,0),l.updateMatrix(),y.setMatrixAt(M,l.matrix),g[M]=E.base,p[M]=E.phase,c.setScalar(E.base),y.setColorAt(M,c)}y.instanceMatrix.needsUpdate=!0,y.frustumCulled=!1,y.renderOrder=2,e.add(y),h.push({mesh:y,bases:g,phases:p})}return{root:e,update:(d,f)=>{for(let m of h){for(let y=0;y<m.bases.length;y++){let g=m.bases[y]*(1+Z_*Math.sin(f*K_+m.phases[y]));c.setScalar(g),m.mesh.setColorAt(y,c)}m.mesh.instanceColor&&(m.mesh.instanceColor.needsUpdate=!0)}}}}var e5=new Et(7,.9),t5=new Et(70,2.2,8,64),n5=new Ji(2.6,6),i5=new pt(.5,8,6),s5=new _e(1.2,60,1.2),r5=new Fn(300,110),o5=new I(0,1,0),a5=new I(0,0,1),oh=new I,l5=90,c5=60,h5=.1,u5=280;function J2(i,e){let t=i.attributes.position.count,n=new Float32Array(t*3);for(let s=0;s<t;s++)n[s*3+0]=e.r,n[s*3+1]=e.g,n[s*3+2]=e.b;return i.setAttribute("color",new Ut(n,3)),i}var d5=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,f5=`
uniform float uTime;
uniform vec3 uGold;
uniform vec3 uRed;
varying vec2 vUv;

// Sin-chain pseudo market index. Deterministic in x, so advancing uTime pans
// the whole chart sideways like a live feed (silicon fiction, not realism).
float quote(float x) {
  return 0.5
    + 0.20 * sin(x * 0.9 + sin(x * 0.31) * 2.0)  // macro trend
    + 0.10 * sin(x * 2.7 + 1.3)
    + 0.05 * sin(x * 7.1 + 4.0)
    + 0.03 * sin(x * 15.7 + 2.6);                // micro ticks
}

void main() {
  // fine grid floor: thin lines on the fract cell edges
  vec2 cell = fract(vUv * vec2(24.0, 9.0));
  vec2 edge = min(cell, 1.0 - cell);
  float grid = 1.0 - smoothstep(0.0, 0.045, min(edge.x, edge.y));

  // the scrolling polyline: gold main line, red on falling segments
  float x = (vUv.x + uTime * 0.07) * 16.0;
  float y = quote(x);
  float dy = quote(x + 0.35) - quote(x);
  vec3 lineCol = mix(uRed, uGold, step(0.0, dy));

  float d = abs(vUv.y - y);
  float line = 1.0 - smoothstep(0.006, 0.018, d); // crisp stroke
  float halo = 1.0 - smoothstep(0.0, 0.11, d);    // holo bleed under it

  // soft edges: a 300x110m board reads as a projection, not a hard slab
  float fade = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x)
             * smoothstep(0.0, 0.07, vUv.y) * smoothstep(1.0, 0.93, vUv.y);

  vec3 col = uGold * 0.20 * grid + lineCol * (line * 1.9 + halo * 0.30);
  float alpha = clamp(grid * 0.45 + line + halo * 0.28, 0.0, 1.0);
  gl_FragColor = vec4(col, alpha * fade);
}
`;function $2(i){var h;let e=ct(5150),t=new Oe;t.name="sky-transit";let n=new xe({vertexColors:!0,blending:nt,transparent:!0,opacity:.22,depthWrite:!1}),s=new xe({color:1713203}),r=new xe({color:new ue(16773836).multiplyScalar(2.2)}),o=[],a=[],l=null;for(let u of i.districts){let d=(h=En[u.id])!=null?h:me.data,f=new xe({color:d.clone().multiplyScalar(1.3)}),m=i.arteries.find(b=>b.district===u.id),y=m?m.x0:0,g=m?m.z0:0;if(Math.hypot(y-u.cx,g-u.cz)>200){let b=140+e()*30,S=104+e()*16,_=76+e()*12,v=U=>u.cx+(y-u.cx)*U,P=U=>u.cz+(g-u.cz)*U,T=new Ri([new I(v(0),S,P(0)),new I(v(.28),b-18,P(.28)),new I(v(.5),b,P(.5)),new I(v(.72),b-18,P(.72)),new I(v(1),_,P(1))]),C=T.getLength(),D=new Qi(T,48,6,8,!1);J2(D,d),t.add(new Z(D,n));let N=Math.max(2,Math.round(C/c5));for(let U=0;U<N;U++){let F=U/N,B=new Z(e5,f);B.position.copy(T.getPointAt(F)),B.quaternion.setFromUnitVectors(a5,T.getTangentAt(F,oh)),t.add(B)}let A=[];for(let U=0;U<3;U++){let F=new Z(n5,s),B=new Z(i5,r);B.position.set(0,5.9,0),F.add(B),t.add(F),A.push({mesh:F,progress:U/3+e()*.05})}o.push({curve:T,len:C,pods:A})}if(u.id==="quant"){l=new Pt({uniforms:{uTime:{value:0},uGold:{value:me.capital.clone()},uRed:{value:me.warn.clone()}},vertexShader:d5,fragmentShader:f5,transparent:!0,blending:nt,depthWrite:!1,side:Ht});let b=new Z(r5,l);b.position.set(u.cx,u5,u.cz),b.rotation.y=Math.atan2(y-u.cx,g-u.cz),t.add(b)}let M=new Oe;M.position.set(u.cx,380+e()*50,u.cz);let E=new Z(t5,f);E.rotation.x=Math.PI/2,M.add(E);let x=J2(s5.clone(),d);for(let b=0;b<4;b++){let S=b/4*Math.PI*2+Math.PI/4,_=new Z(x,n);_.position.set(Math.cos(S)*70,-30,Math.sin(S)*70),M.add(_)}t.add(M),a.push(M)}return{root:t,update:(u,d)=>{for(let f of o)for(let m of f.pods)m.progress=(m.progress+u*l5/f.len)%1,f.curve.getPointAt(m.progress,m.mesh.position),f.curve.getTangentAt(m.progress,oh),m.mesh.quaternion.setFromUnitVectors(o5,oh);for(let f of a)f.rotation.y+=u*h5;l&&(l.uniforms.uTime.value=d)}}}var of=4.2,af=new ot(.35,.5,of,6);af.translate(0,2.1,0);var p5=new hi(2.2,0),lf=9,cf=new ot(.18,.26,lf,6);cf.translate(0,4.5,0);var m5=new pt(.55,8,6),hf=new _e(6,3,14);hf.translate(0,1.5,0);var uf=new _e(6.5,.4,15);uf.translate(0,3.2,0);var df=new _e(.7,5,.7);df.translate(0,2.5,0);var ff=new _e(4,.9,1.4);ff.translate(0,.45,0);var g5=6161,j2=90,Q2=60,ah=8,ef=24,tf=95,_5=310,nf=.8,x5=1.3,sf=98,y5=305,M5=132,ac=[112,178,244],rf=new ue(16767392).multiplyScalar(1.3),v5=9,E5=.1,b5=new I(0,1,0);function pf(i){let e=new Oe;e.name="blockDetails";let t=ct(g5),n=i.districts,s=n.length*j2,r=n.length*Q2,o=n.length*ah,a=n.length*ef,l=new ke({color:2760728,roughness:.95,metalness:0}),c=new ke({color:1854004,roughness:.9,metalness:0,flatShading:!0}),h=new ke({color:2237998,roughness:.7,metalness:.35}),u=new xe({color:rf}),d=new xe({color:me.data,transparent:!0,opacity:.3,side:Ht,depthWrite:!1}),f=new xe({color:me.traffic,transparent:!0,opacity:.5,blending:nt,depthWrite:!1}),m=new ke({color:2306120,roughness:.85,metalness:.05}),y=new yt(af,l,s),g=new yt(p5,c,s),p=new yt(cf,h,r),M=new yt(m5,u,r),E=new yt(hf,d,o),x=new yt(uf,h,o),b=new yt(df,f,o),S=new yt(ff,m,a);y.name="blockTreesTrunks",g.name="blockTreesCrowns",p.name="blockLampPoles",M.name="blockLampBulbs",E.name="blockStopGlass",x.name="blockStopRoofs",b.name="blockStopSigns",S.name="blockBenches";let _=new Ze,v=new I,P=new kt,T=new I,C=(z,W,K,Q,ae,k,re)=>{v.set(K,Q,ae),P.setFromAxisAngle(b5,k),T.setScalar(re),_.compose(v,P,T),z.setMatrixAt(W,_)},D=0,N=0,A=0,U=0,F=Q2/ac.length;for(let z of n){for(let W=0;W<j2;W++,D++){let K=t()*Math.PI*2,Q=tf+t()*(_5-tf),ae=z.cx+Math.cos(K)*Q,k=z.cz+Math.sin(K)*Q,re=nf+t()*(x5-nf),ce=t()*Math.PI*2;C(y,D,ae,0,k,ce,re),C(g,D,ae,of*re,k,ce,re)}for(let W=0;W<ac.length;W++){let K=ac[W];for(let Q=0;Q<F;Q++,N++){let ae=(Q+W/ac.length)/F*Math.PI*2+(t()-.5)*.08,k=K+(t()-.5)*12,re=z.cx+Math.cos(ae)*k,ce=z.cz+Math.sin(ae)*k;C(p,N,re,0,ce,0,1),C(M,N,re,lf,ce,0,1)}}for(let W=0;W<ah;W++,A++){let K=W/ah*Math.PI*2+(t()-.5)*.2,Q=M5+(t()-.5)*16,ae=z.cx+Math.cos(K)*Q,k=z.cz+Math.sin(K)*Q,re=-K;C(E,A,ae,0,k,re,1),C(x,A,ae,0,k,re,1);let ce=3.6,Ce=5.9,he=ae+ce*Math.cos(K)-Ce*Math.sin(K),Ne=k+ce*Math.sin(K)+Ce*Math.cos(K);C(b,A,he,0,Ne,0,1)}for(let W=0;W<ef;W++,U++){let K=t()*Math.PI*2,Q=sf+t()*(y5-sf),ae=z.cx+Math.cos(K)*Q,k=z.cz+Math.sin(K)*Q,re=-K-Math.PI/2+(t()-.5)*.6;C(S,U,ae,0,k,re,1)}}let B=[y,g,p,M,E,x,b,S];for(let z of B)z.instanceMatrix.needsUpdate=!0,z.frustumCulled=!1;return g.castShadow=!0,x.castShadow=!0,e.add(y,g,p,M,E,x,b,S),{root:e,update:(z,W)=>{let K=1+E5*Math.sin(W/v5*Math.PI*2);u.color.copy(rf).multiplyScalar(K)}}}var _f=23,mf=12,S5=[2,6,9,15,19],xf=-380,T5=380,w5=(T5-xf)/(_f-1),R5=60,Do=new _e(1,1,1),A5=new Et(4,.4,8,16,Math.PI),yf=new ot(6,6,3,4);yf.rotateY(Math.PI/4);var C5=new Vr(1,18,4),lh=new ke({color:3813440,roughness:.88,metalness:.08}),ch=new xe({color:me.traffic,transparent:!0,opacity:.35}),P5=new xe({color:me.traffic.clone().multiplyScalar(1.25),transparent:!0,opacity:.45,blending:nt,depthWrite:!1}),I5=new xe({color:16249832}),L5=new xe({color:2366763});function gf(i,e,t){let n=new Oe;n.position.z=2.7;let s=new Z(Do,L5);return s.scale.set(t,e,.35),s.position.y=e/2,n.add(s),i.add(n),n}function Mf(){let i=new Oe;i.name="bundRow";let e=ct(5321),t=[],n=[];for(let r=0;r<_f;r++){let o=xf+r*w5,a=20+e()*8,l=r===mf?68:30+e()*30,c=new Z(Do,lh);c.scale.set(a,l,22),c.position.set(o,l/2,0),c.castShadow=!0,i.add(c);for(let h of[-1,1]){let u=new Z(Do,ch);u.scale.set(a+.5,.55,.5),u.position.set(o,l+.25,h*11),i.add(u)}for(let h of[-1,1]){let u=new Z(Do,ch);u.scale.set(.5,.55,21.5),u.position.set(o+h*a/2,l+.25,0),i.add(u)}for(let h of[-(a*.25),a*.25]){let u=new Z(A5,P5);u.position.set(o+h,6,11.3),i.add(u)}if(S5.includes(r)){let h=new Z(Do,lh);h.scale.set(a*.4,25,16),h.position.set(o,l+12.5,0),h.castShadow=!0,i.add(h);let u=new Z(C5,lh);u.scale.set(a*.3,1,a*.3),u.rotation.y=Math.PI/4,u.position.set(o,l+25+9,0),i.add(u)}if(r===mf){let h=[{yaw:0,wx:0,wz:11},{yaw:Math.PI/2,wx:a/2,wz:0},{yaw:Math.PI,wx:0,wz:-11},{yaw:-Math.PI/2,wx:-(a/2),wz:0}];for(let u of h){let d=new Oe;d.position.set(o+u.wx,R5,u.wz),d.rotation.y=u.yaw,i.add(d);let f=new Z(yf,I5);f.rotation.x=Math.PI/2,f.position.z=1,d.add(f),t.push(gf(d,4.8,.45)),n.push(gf(d,3.2,.6))}}}return{root:i,update:(r,o)=>{let a=.5+.5*Math.sin(o*1.3);ch.opacity=.26+a*.18;let l=-o*.1*Qs,c=-o*.0083*Qs;for(let h of t)h.rotation.z=l;for(let h of n)h.rotation.z=c}}}var _i=60,Fi=40,zn=28,bn=.7,hh=20,D5=[6,14,22],vf=340,N5=[340,352,326,364,312,376,300,388],Ef=_i/2-bn,bf=Fi/2-bn,U5=new _e(56,.8,36),O5=new _e(50,.3,1.2),F5=new ot(3,3,26),B5=new _e(_i,zn,bn),Sf=new _e(bn,zn,Fi),Tf=new _e((_i-hh)/2,zn,bn),wf=new _e(_i,bn,Fi),H5=new ot(.32,.5,4),z5=new pt(1.5,16,12);function G5(i,e,t,n){let s=i.arteries.find(l=>l.district===e),r=s?s.x0-t:-t,o=s?s.z0-n:-n,a=Math.hypot(r,o);return a<1e-6?{x:1,z:0}:{x:r/a,z:o/a}}function k5(i,e,t){for(let n of i.buildings)if(Math.abs(e-n.x)<_i/2+8+n.w/2&&Math.abs(t-n.z)<Fi/2+8+n.d/2)return!0;return!1}function Rf(i){let e=new Oe,t=[],n=[],s=new ke({color:1715270,opacity:.35,transparent:!0,metalness:.4,roughness:.35,depthWrite:!1}),r=new ke({color:1055275,roughness:.85,metalness:.25});return i.districts.forEach((a,l)=>{var P;let c=G5(i,a.id,a.cx,a.cz),h=a.cx+c.x*vf,u=a.cz+c.z*vf;for(let T of N5){let C=a.cx+c.x*T,D=a.cz+c.z*T;if(!k5(i,C,D)){h=C,u=D;break}}let d=Math.atan2(c.x,c.z),f=Math.round(d/(Math.PI/2))*(Math.PI/2),m=Math.abs(Math.sin(f))>.5,y=new Oe;y.position.set(h,0,u),y.rotation.y=f,e.add(y);let g=(T,C,D,N)=>{let A=new Z(T,s);A.position.set(C,D,N),A.renderOrder=1,y.add(A)};g(B5,0,zn/2,-(Fi/2-bn/2)),g(Sf,-(_i/2-bn/2),zn/2,0),g(Sf,_i/2-bn/2,zn/2,0),g(Tf,-((_i-hh)/2),zn/2,Fi/2-bn/2),g(Tf,(_i-hh)/2,zn/2,Fi/2-bn/2),g(wf,0,zn-bn/2,0);let p=new Z(wf,r);p.position.set(0,.06-bn/2,0),p.receiveShadow=!0,y.add(p);let M=new ue(16767392).multiplyScalar(1.2),E=new xe({color:M.clone()});for(let T of D5){let C=new Z(U5,r);C.position.set(0,T,0),C.castShadow=!0,C.receiveShadow=!0,y.add(C);for(let D of[-1,1]){let N=new Z(O5,E);N.position.set(0,T-.75,D*(Fi/2-3)),y.add(N)}}let x=new xe({color:me.data.clone().multiplyScalar(1.6),transparent:!0,opacity:.55,blending:nt,depthWrite:!1}),b=new Z(F5,x);b.position.set(0,13,0),b.renderOrder=2,y.add(b);let S=new Z(H5,r);S.position.set(0,zn+2,0),S.castShadow=!0,y.add(S);let _=new xe({color:((P=En[a.id])!=null?P:me.data).clone().multiplyScalar(1.5)}),v=new Z(z5,_);v.position.set(0,zn+3.5,0),y.add(v),t.push({cx:h,cz:u,hw:m?bf:Ef,hd:m?Ef:bf}),n.push({stripBase:M,stripMat:E,columnMat:x,columnMesh:b,beaconMesh:v,phase:l*2.1})}),{root:e,specs:t,update:(a,l)=>{for(let c of n){c.stripMat.color.copy(c.stripBase).multiplyScalar(1.15+.25*Math.sin(l*1.6+c.phase)),c.columnMat.opacity=.55+.1*Math.sin(l*1.1+c.phase*.7);let h=1+.05*Math.sin(l*1.3+c.phase);c.columnMesh.scale.set(h,1,h),c.beaconMesh.scale.setScalar(1+.3*(.5+.5*Math.sin(l*1.7+c.phase*1.3)))}}}}var Af=1.8,In=1.4,V5=22,W5=55,uh=2400,lc=1.35,Cf=.0022,X5=1,Pf="KeyW",If="KeyS",Lf="KeyD",Df="KeyA",Nf=["ShiftLeft","ShiftRight"],cc=class{constructor(e,t){this.colliders=[];this.enterables=[];this.on=!1;this.yaw=0;this.pitch=0;this.px=0;this.pz=0;this.keys=new Set;this.dragging=!1;this.lastX=0;this.lastY=0;this.savedPos=new I;this.savedQuat=new kt;this.camera=e,this.dom=t,this.dom.addEventListener("mousedown",n=>this.onMouseDown(n)),window.addEventListener("mousemove",n=>this.onMouseMove(n)),window.addEventListener("mouseup",()=>{this.dragging=!1}),window.addEventListener("keydown",n=>this.onKeyDown(n)),window.addEventListener("keyup",n=>this.keys.delete(n.code)),window.addEventListener("blur",()=>{this.keys.clear(),this.dragging=!1})}setColliders(e){this.colliders=e.slice()}setEnterable(e){this.enterables=e.slice()}toggle(){if(this.on=!this.on,this.keys.clear(),this.dragging=!1,this.on){this.savedPos.copy(this.camera.position),this.savedQuat.copy(this.camera.quaternion),this.px=this.camera.position.x,this.pz=this.camera.position.z;let e=new I;this.camera.getWorldDirection(e),this.yaw=Math.atan2(-e.x,-e.z),this.pitch=pn(Math.asin(pn(e.y,-1,1)),-lc,lc),this.camera.rotation.order="YXZ",this.camera.position.set(this.px,Af,this.pz),this.applyLook()}else this.camera.position.copy(this.savedPos),this.camera.quaternion.copy(this.savedQuat);return this.on}enabled(){return this.on}update(e){if(!this.on)return!1;let t=-Math.sin(this.yaw),n=-Math.cos(this.yaw),s=Math.cos(this.yaw),r=-Math.sin(this.yaw),o=0,a=0;this.keys.has(Pf)&&(o+=t,a+=n),this.keys.has(If)&&(o-=t,a-=n),this.keys.has(Lf)&&(o+=s,a+=r),this.keys.has(Df)&&(o-=s,a-=r);let l=Math.hypot(o,a);if(l>1e-6){let u=Nf.some(y=>this.keys.has(y))?W5:V5,d=o/l*u*e,f=a/l*u*e,m=Math.max(1,Math.ceil(Math.hypot(d,f)/X5));for(let y=0;y<m;y++)this.px+=d/m,this.pz+=f/m,this.resolveCollisions()}else this.resolveCollisions();let c=Math.hypot(this.px,this.pz);return c>uh&&(this.px=this.px/c*uh,this.pz=this.pz/c*uh),this.camera.position.set(this.px,Af,this.pz),this.applyLook(),!0}applyLook(){this.camera.rotation.set(this.pitch,this.yaw,0)}onMouseDown(e){this.on&&(this.dragging=!0,this.lastX=e.clientX,this.lastY=e.clientY,e.preventDefault())}onMouseMove(e){if(!this.on||!this.dragging)return;let t=e.clientX-this.lastX,n=e.clientY-this.lastY;this.lastX=e.clientX,this.lastY=e.clientY,this.yaw-=t*Cf,this.pitch=pn(this.pitch-n*Cf,-lc,lc)}onKeyDown(e){this.on&&(e.code===Pf||e.code===If||e.code===Df||e.code===Lf||Nf.includes(e.code))&&this.keys.add(e.code)}resolveCollisions(){let e=null;for(let t of this.enterables)if(Math.abs(this.px-t.cx)<=t.hw&&Math.abs(this.pz-t.cz)<=t.hd){e=t;break}for(let t=0;t<2;t++)for(let n of this.colliders)e&&this.overlapsHub(n,e)||(this.pz+In>n.cz-n.hd&&this.pz-In<n.cz+n.hd&&(this.px<n.cx&&this.px+In>n.cx-n.hw?this.px=n.cx-n.hw-In:this.px>=n.cx&&this.px-In<n.cx+n.hw&&(this.px=n.cx+n.hw+In)),this.px+In>n.cx-n.hw&&this.px-In<n.cx+n.hw&&(this.pz<n.cz&&this.pz+In>n.cz-n.hd?this.pz=n.cz-n.hd-In:this.pz>=n.cz&&this.pz-In<n.cz+n.hd&&(this.pz=n.cz+n.hd+In)))}overlapsHub(e,t){return Math.abs(e.cx-t.cx)<=e.hw+t.hw&&Math.abs(e.cz-t.cz)<=e.hd+t.hd}};var Uf={lat:31.2397,lon:121.4998},Of={lat:31.2418,lon:121.4975},Ff={lat:31.2432,lon:121.4952},Bf={lat:31.2405,lon:121.4878},No=-14,Y5=8,q5=64,Z5=12,dh=6,Hf=20,K5=22,fh=4,ir=new Ri([new I(zt(Uf.lon),No,Gt(Uf.lat)),new I(zt(Of.lon),No,Gt(Of.lat)),new I(zt(Ff.lon),No,Gt(Ff.lat)),new I(zt(Bf.lon),No,Gt(Bf.lat))]),Uo=ir.getLength(),zf=14,J5=[{s:30,side:1},{s:62,side:-1},{s:Uo-30,side:-1},{s:Uo-62,side:1}],$5=new Qi(ir,q5,Y5,Z5,!1),j5=new _e(18,3.4,3),Q5=new _e(16,1.2,.1),ex=new _e(10,5,10),tx=new _e(1.4,26,1.4),nx=new Et(4,.5,10,48),ix=new xe({color:me.data.clone(),transparent:!0,opacity:.28,blending:nt,depthWrite:!1,depthTest:!1,fog:!1}),sx=new ke({color:1976894,roughness:.55,metalness:.3,transparent:!0,opacity:.92,depthWrite:!1,depthTest:!1,fog:!1}),rx=new xe({color:me.data.clone().multiplyScalar(1.5),blending:nt,transparent:!0,depthWrite:!1,depthTest:!1,fog:!1}),ox=new ke({color:6220500,transparent:!0,opacity:.35,roughness:.2,metalness:.05,depthWrite:!1}),ax=new xe({color:me.data.clone().multiplyScalar(1.4),blending:nt,transparent:!0,opacity:.9,depthWrite:!1,fog:!1}),lx=new xe({color:me.data.clone().lerp(me.ceo,.5),blending:nt,transparent:!0,opacity:.4,depthWrite:!1,fog:!1});function Gf(){let i=new Oe;i.name="metroLine2";let e=ct(202),t=new Z($5,ix);t.renderOrder=5,i.add(t);let n=[];for(let f=0;f<dh;f++){let m=new Z(j5,sx);m.renderOrder=6;for(let y of[-1,1]){let g=new Z(Q5,rx);g.position.set(0,.5,y*1.55),g.renderOrder=7,m.add(g)}i.add(m),n.push(m)}let s=[],r=new I,o=new I;for(let f of J5){let m=pn(f.s/Uo,0,1);ir.getPointAt(m,r),ir.getTangentAt(m,o);let y=-o.z,g=o.x,p=new Oe;p.position.set(r.x+y*zf*f.side,0,r.z+g*zf*f.side),p.rotation.y=Math.atan2(-o.z,o.x);let M=new Z(ex,ox);M.position.y=2.5,p.add(M);let E=new Z(nx,ax);E.rotation.x=Math.PI/2,E.position.y=.55,p.add(E);let x=lx.clone(),b=new Z(tx,x);b.position.y=13,p.add(b),i.add(p),s.push({pillarMat:x,phase:e()*Math.PI*2})}let a=(dh-1)*Hf,l=Uo,c=a,h=1,u=fh;function d(f,m){u>0?u-=f:(c+=h*K5*f,h>0&&c>=l?(c=l,u=fh,h=-1):h<0&&c<=a&&(c=a,u=fh,h=1));for(let y=0;y<dh;y++){let g=pn((c-y*Hf)/Uo,0,1);ir.getPointAt(g,r),ir.getTangentAt(g,o),n[y].position.set(r.x,No,r.z),n[y].rotation.y=Math.atan2(-o.z,o.x)}for(let y of s)y.pillarMat.opacity=.4+.14*(.5+.5*Math.sin(m*1.3+y.phase))}return{root:i,update:d}}var cx=new Fn(10,5),kf=new ot(.5,.8,14,6);kf.translate(0,7,0);var hx=new pt(.9),ux=new Et(24,1.6,8,40,Math.PI),dx=new _e(.8,12,.8),fx=8118,px=90,ph=4,Oo=16,mx=2,xi=Math.PI*2,gx=Math.PI/2;function _x(i){var n;if(i==="gaming")return[me.data.clone(),me.brain.clone(),me.data.clone().multiplyScalar(1.4),me.brain.clone().multiplyScalar(1.4)];if(i==="quant")return[me.capital.clone(),me.ceo.clone(),me.capital.clone().multiplyScalar(1.4),me.ceo.clone().multiplyScalar(1.3)];if(i==="media"){let s=me.traffic.clone(),r=me.traffic.clone().lerp(me.ceo,.45);return[s,r,s.clone().multiplyScalar(1.4),r.clone().multiplyScalar(1.4)]}let e=(n=En[i])!=null?n:me.data,t=e.clone().lerp(me.ceo,.45);return[e.clone(),t,e.clone().multiplyScalar(1.4),t.clone().multiplyScalar(1.4)]}function xx(i,e){let t=i.zones.find(s=>s.id===e);return .5+.7*(t?Math.min(1,Math.max(0,t.activity)):.5)}function Vf(i,e){var p;let t=new Oe;t.name="streetSilicon";let n=ct(fx),s=[],r=[],o=[],a=Oo*i.districts.length,l=a>0?new yt(kf,new ke({color:1712943,roughness:.85,metalness:.35}),a):null;l&&(l.frustumCulled=!1,l.castShadow=!1,t.add(l));let c=new Ze,h=new I,u=new kt,d=new Rn,f=new I(1,1,1),m=new ue(1,1,1),y=0;for(let M of i.districts){let E=(p=En[M.id])!=null?p:me.data,x=xx(e,M.id),b=_x(M.id),S=Array.from({length:ph},()=>[]);for(let N=0;N<px;N++){let A=n()*xi,U=90+n()*210,F=6+n()*20,B=M.cx+Math.cos(A)*U,V=M.cz+Math.sin(A)*U,z=(n()-.5)*.24,W=n()*xi;S[N%ph].push({x:B,y:F,z:V,yaw:Math.atan2(M.cx-B,M.cz-V),tiltX:z*Math.cos(W),tiltZ:z*Math.sin(W),flickT:.8+n()*1.2,flickPhase:n()*xi})}for(let N=0;N<ph;N++){let A=S[N];if(A.length===0)continue;let U=new xe({color:b[N].clone(),side:Ht,fog:!0}),F=new yt(cx,U,A.length),B=new Float32Array(A.length),V=new Float32Array(A.length);for(let z=0;z<A.length;z++){let W=A[z];d.set(W.tiltX,W.yaw,gx+W.tiltZ,"YXZ"),u.setFromEuler(d),h.set(W.x,W.y,W.z),c.compose(h,u,f),F.setMatrixAt(z,c),F.setColorAt(z,m),B[z]=W.flickT,V[z]=W.flickPhase}F.instanceMatrix.needsUpdate=!0,F.instanceColor&&(F.instanceColor.needsUpdate=!0),F.frustumCulled=!1,F.castShadow=!1,t.add(F),s.push({mesh:F,mat:U,base:b[N],gain:x,flickT:B,flickPhase:V,count:A.length})}let _=new xe({color:E.clone().multiplyScalar(1.5),fog:!0}),v=new yt(hx,_,Oo),P=new Float32Array(Math.ceil(Oo/3));for(let N=0;N<P.length;N++)P[N]=n()*xi;for(let N=0;N<Oo;N++){let A=n()*xi,U=95+n()*195,F=M.cx+Math.cos(A)*U,B=M.cz+Math.sin(A)*U;d.set(0,n()*xi,0),u.setFromEuler(d),h.set(F,0,B),c.compose(h,u,f),l&&l.setMatrixAt(y++,c),h.set(F,14.6,B),c.compose(h,u,f),v.setMatrixAt(N,c),v.setColorAt(N,m)}v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),v.frustumCulled=!1,v.castShadow=!1,t.add(v),r.push({mesh:v,groupPhase:P,count:Oo});let T=new xe({color:E.clone(),blending:nt,transparent:!0,opacity:.5,depthWrite:!1,fog:!0}),C=new xe({color:E.clone().multiplyScalar(1.6),transparent:!0,opacity:.55,depthWrite:!1,fog:!0}),D=n()*xi;for(let N=0;N<mx;N++){let A=D+N*Math.PI+(n()-.5)*.6,U=150+n()*90,F=new Oe;F.position.set(M.cx+Math.cos(A)*U,1.6,M.cz+Math.sin(A)*U),F.rotation.y=-A;let B=new Z(ux,T),V=new Z(dx,C);V.position.set(0,30,0),B.castShadow=!1,V.castShadow=!1,B.frustumCulled=!1,V.frustumCulled=!1,F.add(B,V),t.add(F)}o.push({archMat:T,colMat:C,phase:n()*xi})}return l&&(l.instanceMatrix.needsUpdate=!0),{root:t,update:(M,E)=>{for(let x of s){x.mat.color.copy(x.base).multiplyScalar(x.gain);let b=x.mesh.instanceColor;if(b){for(let S=0;S<x.count;S++){let _=xi/x.flickT[S],v=.72+.28*(.5+.5*Math.sin(E*_+x.flickPhase[S]));b.setXYZ(S,v,v,v)}b.needsUpdate=!0}}for(let x of r){let b=x.mesh.instanceColor;if(b){for(let S=0;S<x.count;S++){let _=x.groupPhase[Math.floor(S/3)],v=.55+.45*(.5+.5*Math.sin(E*1.3+_));b.setXYZ(S,v,v,v)}b.needsUpdate=!0}}for(let x of o){let b=.5+.5*Math.sin(E*.7+x.phase);x.archMat.opacity=.46+.08*b;let S=.5+.5*Math.sin(E*.9+x.phase+.6);x.colMat.opacity=.5+.1*S}}}}var yx=[[31.218,121.489],[31.226,121.4908],[31.231,121.493],[31.234,121.4965],[31.236,121.5],[31.239,121.503],[31.243,121.5018],[31.248,121.502],[31.254,121.5035],[31.26,121.5065],[31.266,121.51],[31.272,121.5145]],Mx=230,hs=10,hc=3,Wf=new _e(58,6,14),vx=new _e(12,8,8),Xf=new pt(1.1,10,8),Ex=new _e(18,.3,1.2),bx=new ke({color:1844788,roughness:.6,metalness:.55}),Sx=new ke({color:2898e3,roughness:.7,metalness:.3}),Tx=new xe({color:me.ceo.clone().multiplyScalar(1.5)}),wx=new xe({color:me.warn}),Rx=new xe({color:me.data}),Ax=new xe({color:me.data.clone().lerp(me.ceo,.45),blending:nt,transparent:!0,opacity:.35,depthWrite:!1}),Cx=me.data.clone().multiplyScalar(.85),sr=new Ze().makeScale(0,0,0),uc=.2,Px=29,Ix=-20,Lx=7,Dx=-20,Nx=12.4,Ux=-29.5,Ox=3.6,mh=.5,Fx=15,Bx=30/58,Hx=5/6,zx=9/14,Gx=1,kx=3.5,Vx=16/12,Wx=2/8,Xx=7/8,Yx=1.3,qx=30.8/58,Zx=.7/6,Kx=9.6/14,Jx=5,Yf=6,gh=2300,qf=3700,$x=[-168,-176,-184],dc=.8,Zf=9,fc=1.5,jx=Mx*.75,Qx=14,Jn=yx.map(([i,e])=>new te(zt(e),Gt(i))),_h=[],rr=[];for(let i=0;i<Jn.length-1;i++){let e=Jn[i+1].clone().sub(Jn[i]).normalize();_h.push(e),rr.push(new te(-e.y,e.x))}var Bi=[0];for(let i=0;i<Jn.length-1;i++)Bi.push(Bi[i]+Jn[i].distanceTo(Jn[i+1]));var pc=Bi[Bi.length-1],mc=[rr[0]];for(let i=1;i<Jn.length-1;i++)mc.push(rr[i-1].clone().add(rr[i]).normalize());mc.push(rr[rr.length-1]);var $t={px:0,pz:0,ux:0,uz:0,nx:0,nz:0};function Kf(i){let e=0;for(;e<Jn.length-2&&i>Bi[e+1];)e++;let t=Bi[e+1]-Bi[e],n=t>1e-6?(i-Bi[e])/t:1,s=Jn[e],r=Jn[e+1];$t.px=s.x+(r.x-s.x)*n,$t.pz=s.y+(r.y-s.y)*n,$t.ux=_h[e].x,$t.uz=_h[e].y;let o=mc[e],a=mc[e+1],l=o.x+(a.x-o.x)*n,c=o.y+(a.y-o.y)*n,h=Math.hypot(l,c)||1;$t.nx=l/h,$t.nz=c/h}function Jf(){let i=new Oe,e=ct(2244),t=hs+hc,n=(p,M,E)=>{let x=new yt(p,M,E);return x.instanceMatrix.setUsage(mi),x.frustumCulled=!1,x.castShadow=!1,x},s=n(Wf,bx,t),r=n(vx,Sx,t),o=n(Wf,Rx,hc),a=n(Xf,Tx,hs),l=n(Xf,wx,hs),c=n(Ex,Ax,t*2);i.add(s,r,o,a,l,c);let h=new ue(1,1,1);for(let p=0;p<t;p++)s.setColorAt(p,h);for(let p=0;p<hc;p++)s.setColorAt(hs+p,Cx);s.instanceColor&&(s.instanceColor.needsUpdate=!0);let u=[];for(let p=0;p<hs;p++){let M=p<5?1:-1,E=jx+e()*Qx;u.push({s:e()*pc,dir:M,speed:5+e()*4,lateral:M===1?E:-E,docked:!1,dockTimer:0})}let f=[{s:2600,dir:1,docked:!1,timer:0},{s:3450,dir:-1,docked:!1,timer:0},{s:gh,dir:1,docked:!0,timer:3}].map((p,M)=>({s:p.s,dir:p.dir,speed:Jx,lateral:$x[M],docked:p.docked,dockTimer:p.timer}));for(let p=0;p<t;p++)s.setMatrixAt(p,sr),r.setMatrixAt(p,sr);for(let p=0;p<hc;p++)o.setMatrixAt(p,sr);for(let p=0;p<hs;p++)a.setMatrixAt(p,sr),l.setMatrixAt(p,sr);for(let p=0;p<t*2;p++)c.setMatrixAt(p,sr);let m=new Tt;function y(p,M,E,x,b,S,_,v,P,T,C){let D=Math.cos(S),N=Math.sin(S);m.position.set(E+_*D+v*N,b,x-_*N+v*D),m.rotation.set(0,S,0),m.scale.set(P,T,C),m.updateMatrix(),p.setMatrixAt(M,m.matrix)}function g(p,M){for(let E=0;E<u.length;E++){let x=u[E];x.s+=x.dir*x.speed*p,x.s>=pc?x.s-=pc:x.s<0&&(x.s+=pc),Kf(x.s);let b=$t.px+x.lateral*$t.nx,S=$t.pz+x.lateral*$t.nz,_=Math.atan2(-$t.uz,$t.ux),v=x.dir===1?_:_+Math.PI;y(s,E,b,S,uc,v,0,0,1,1,1),y(r,E,b,S,uc+Lx,v,Ix,0,1,1,1),y(a,E,b,S,uc+Nx,v,Dx,0,1,1,1),y(l,E,b,S,uc+Ox,v,Ux,0,1,1,1);let P=-(Px+Zf);y(c,2*E,b,S,dc,v,P,-fc,1,1,1),y(c,2*E+1,b,S,dc,v,P,fc,1,1,1)}for(let E=0;E<f.length;E++){let x=f[E];x.docked?(x.dockTimer-=p,x.dockTimer<=0&&(x.docked=!1,x.dir=x.dir===1?-1:1)):(x.s+=x.dir*x.speed*p,x.dir===1&&x.s>=qf?(x.s=qf,x.docked=!0,x.dockTimer=Yf):x.dir===-1&&x.s<=gh&&(x.s=gh,x.docked=!0,x.dockTimer=Yf)),Kf(x.s);let b=$t.px+x.lateral*$t.nx,S=$t.pz+x.lateral*$t.nz,_=Math.atan2(-$t.uz,$t.ux),v=hs+E;y(s,v,b,S,mh,_,0,0,Bx,Hx,zx),y(r,v,b,S,mh+kx,_,Gx,0,Vx,Wx,Xx),y(o,E,b,S,mh+Yx,_,0,0,qx,Zx,Kx);let P=-x.dir*(Fx+Zf),T=x.docked?0:1;y(c,2*v,b,S,dc,_,P,-fc,T,1,1),y(c,2*v+1,b,S,dc,_,P,fc,T,1,1)}s.instanceMatrix.needsUpdate=!0,r.instanceMatrix.needsUpdate=!0,o.instanceMatrix.needsUpdate=!0,a.instanceMatrix.needsUpdate=!0,l.instanceMatrix.needsUpdate=!0,c.instanceMatrix.needsUpdate=!0}return{root:i,update:g}}var ey=[[31.218,121.489],[31.226,121.4908],[31.231,121.493],[31.234,121.4965],[31.236,121.5],[31.239,121.503],[31.243,121.5018],[31.248,121.502],[31.254,121.5035],[31.26,121.5065],[31.266,121.51],[31.272,121.5145]],ty=230,ny=2,iy=10,$f=ty+14,xh=12,jf=.5,gc=.75,sy=8,Qf=.6,ry=.5,ep=.6,tp=55,np=4,yh=7,ip=40,sp=30,rp=14,Mh=24,oy=.45,ay=.08,ly=1.5;function op(){let i=new Oe,e=ct(7788),t=ey.map(([T,C])=>({x:zt(C),z:Gt(T)})),n=[];for(let T=ny;T<=iy;T++){let C=t[Math.min(T+1,t.length-1)],D=t[Math.max(T-1,0)],N=C.x-D.x,A=C.z-D.z,U=Math.hypot(N,A)||1,F=A/U,B=-N/U;n.push({x:t[T].x+F*$f,z:t[T].z+B*$f})}let s=[],r=[0];for(let T=0;T<n.length-1;T++){let C=Math.hypot(n[T+1].x-n[T].x,n[T+1].z-n[T].z);s.push(C),r.push(r[T]+C)}let o=r[r.length-1],a=new _e(1,jf,xh),l=new ke({color:2896964,roughness:.9});for(let T=0;T<n.length-1;T++){let C=n[T+1].x-n[T].x,D=n[T+1].z-n[T].z,N=new Z(a,l);N.scale.set(s[T]+sy,1,1),N.position.set((n[T].x+n[T+1].x)/2,gc-jf/2,(n[T].z+n[T+1].z)/2),N.rotation.y=Math.atan2(-D,C),N.castShadow=!0,N.receiveShadow=!0,i.add(N)}let c=new _e(1,Qf,ry),h=new xe({color:me.data.clone(),transparent:!0,opacity:ep,blending:nt,depthWrite:!1,fog:!0});for(let T=0;T<n.length-1;T++){let C=n[T+1].x-n[T].x,D=n[T+1].z-n[T].z,N=s[T]||1,A=-D/N,U=C/N,F=new Z(c,h);F.scale.set(N,1,1),F.position.set((n[T].x+n[T+1].x)/2+A*(xh/2),gc+Qf/2,(n[T].z+n[T+1].z)/2+U*(xh/2)),F.rotation.y=Math.atan2(-D,C),i.add(F)}let u=Math.floor(o/tp)+1,d=new ot(.2,.3,yh,6),f=new pt(.6,12,8),m=new ke({color:1317414,roughness:.6,metalness:.3}),y=new xe({color:new ue(16770756).multiplyScalar(1.4)}),g=new yt(d,m,u),p=new yt(f,y,u);g.frustumCulled=!1,p.frustumCulled=!1,i.add(g,p);let M=new Tt;for(let T=0;T<u;T++){let C=T*tp,D=0;for(;D<s.length-1&&C>r[D+1];)D++;let N=s[D]||1,A=(C-r[D])/N,U=n[D+1].x-n[D].x,F=n[D+1].z-n[D].z,B=n[D].x+U*A-F/N*np,V=n[D].z+F*A+U/N*np,z=.96+e()*.08;M.position.set(B,gc+yh/2*z,V),M.scale.setScalar(z),M.updateMatrix(),g.setMatrixAt(T,M.matrix),M.position.y=gc+yh*z+.5,M.updateMatrix(),p.setMatrixAt(T,M.matrix)}function E(T){let C=Math.max(0,Math.min(n.length-2,Math.floor(T))),D=T-C,N=n[C],A=n[C+1],U=s[C]||1,F=N.x+(A.x-N.x)*D,B=N.z+(A.z-N.z)*D,V=(A.x-N.x)/U,z=(A.z-N.z)/U;if(D<.1&&C>0){let W=n[C-1],K=s[C-1]||1,Q=(N.x-W.x)/K+V,ae=(N.z-W.z)/K+z,k=Math.hypot(Q,ae)||1;return{x:F,z:B,tx:Q/k,tz:ae/k}}return{x:F,z:B,tx:V,tz:z}}let x=new _e(ip,1,sp),b=new ke({color:2569030,roughness:.9}),S=new Et(Mh,oy,8,72),_=[{mat:h,base:ep,phase:0}],v=[1.7,4.25,6];for(let T of v){let C=E(T),D=Math.atan2(-C.tz,C.tx),N=new Z(x,b);N.position.set(C.x+Math.sin(D)*rp,.55,C.z+Math.cos(D)*rp),N.rotation.y=D,N.castShadow=!0,N.receiveShadow=!0,i.add(N);let A=new xe({color:me.data.clone(),transparent:!0,opacity:.45,blending:nt,depthWrite:!1,fog:!0});_.push({mat:A,base:.45,phase:e()*Math.PI*2});let U=new Z(S,A);U.rotation.x=Math.PI/2,U.scale.set((ip+2)/(2*Mh),(sp+2)/(2*Mh),1),U.position.set(0,1.1,0),N.add(U)}function P(T,C){for(let D of _)D.mat.opacity=D.base*(1+ay*Math.sin(C*ly+D.phase))}return{root:i,update:P}}var cy=6606,Hi=410,Eh=-115,bh=230,ap=2400,lp=900,cp=500,hy=55,uy=7,dy=2,fy=.8,py=30,my=4,gy=2.3;function vh(i,e,t,n,s){let r=new Float32Array(i*3),o=new Float32Array(i);for(let u=0;u<i;u++){let d=u*3;r[d]=(s()*2-1)*Hi,r[d+1]=Eh+s()*bh,r[d+2]=(s()*2-1)*Hi,o[u]=s()*Math.PI*2}let a=new Ut(r,3),l=new mt;l.setAttribute("position",a);let c=new Xn({color:t,size:e,sizeAttenuation:!0,transparent:!0,opacity:n,depthWrite:!1,fog:!0}),h=new ai(l,c);return h.frustumCulled=!1,{points:h,pos:r,attr:a,phases:o}}function hp(i){let e=ct(cy),t=vh(ap,.35,7309224,.45,e),n=vh(lp,.9,14674164,.75,e),s=vh(cp,.3,10466508,.3,e),r=new Oe;r.add(t.points,n.points,s.points);let o=(i.reality.weather_kind||"").toLowerCase();return t.points.visible=o==="rain",n.points.visible=o==="snow",s.points.visible=o==="wind",{root:r,update:(l,c)=>{if(o==="rain"){let h=t.pos;for(let u=0;u<ap;u++){let d=u*3+1,f=h[d]-hy*l;f<Eh&&(f+=bh),h[d]=f}t.attr.needsUpdate=!0}else if(o==="snow"){let h=n.pos;for(let u=0;u<lp;u++){let d=u*3,f=h[d+1]-uy*l;f<Eh&&(f+=bh),h[d+1]=f;let m=h[d]+Math.sin(c*fy+n.phases[u])*dy*l;m>Hi?m-=Hi*2:m<-Hi&&(m+=Hi*2),h[d]=m}n.attr.needsUpdate=!0}else if(o==="wind"){let h=s.pos;for(let u=0;u<cp;u++){let d=u*3,f=h[d]+py*l;f>Hi&&(f-=Hi*2),h[d]=f,h[d+1]+=Math.sin(c*gy+s.phases[u])*my*l}s.attr.needsUpdate=!0}}}}var Fo=360,up=90,_y=300,dp=.08,xy=.2,yy=.08;function My(i){return i>=7&&i<9?1:i>=9&&i<17?.55:i>=17&&i<19?1:i>=19&&i<21?.35:.04}function fp(i,e){let t=new Oe;if(i.districts.length===0)return{root:t,update:()=>{}};let n=ct(20261126),s=i.districts.map(f=>{let m=e.zones.find(y=>y.id===f.id);return{cx:f.cx,cz:f.cz,activity:m?m.activity:.5,start:0,count:0,target:0}}),r=[],o=-1;for(let f=0;f<Fo;f++){let m=Math.min(s.length-1,Math.floor(f/Fo*s.length));m!==o&&(s[m].start=f,o=m),s[m].count++,r.push({district:m,radius:up+n()*(_y-up),phase:n()*Math.PI*2,omega:dp+n()*(xy-dp),bobPhase:n()*Math.PI*2,bobHz:5.5+n()*3})}let a=new Ji(.32,1.1,3,6);a.translate(0,.9,0);let l=new ke({color:2504527,roughness:.8}),c=new yt(a,l,Fo);c.instanceMatrix.setUsage(mi),c.frustumCulled=!1,c.castShadow=!1,t.add(c);let h=new Tt,u=new Ze().makeScale(0,0,0);for(let f=0;f<Fo;f++)c.setMatrixAt(f,u);function d(f,m,y){let g=My(y);for(let p of s)p.target=pn(Math.round(p.count*g*p.activity),0,p.count);for(let p=0;p<Fo;p++){let M=r[p],E=s[M.district];if(p-E.start>=E.target){c.setMatrixAt(p,u);continue}let x=M.phase+M.omega*m;h.position.set(E.cx+Math.cos(x)*M.radius,Math.sin(m*M.bobHz+M.bobPhase)*yy,E.cz+Math.sin(x)*M.radius),h.rotation.set(0,Math.atan2(-Math.sin(x),Math.cos(x)),0),h.scale.setScalar(1),h.updateMatrix(),c.setMatrixAt(p,h.matrix)}c.instanceMatrix.needsUpdate=!0}return{root:t,update:d}}var or={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var Sn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},vy=new es(-1,1,1,-1,0,1),Sh=class extends mt{constructor(){super(),this.setAttribute("position",new Qe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Qe([0,2,0,0,2,0],2))}},Ey=new Sh,zi=class{constructor(e){this._mesh=new Z(Ey,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,vy)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var _c=class extends Sn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Pt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Pn.clone(e.uniforms),this.material=new Pt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new zi(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Bo=class extends Sn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},xc=class extends Sn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var yc=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new te);this._width=n.width,this._height=n.height,t=new Vt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:en}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new _c(or),this.copyPass.material.blending=ui,this.timer=new so}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Bo!==void 0&&(o instanceof Bo?n=!0:o instanceof xc&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new te);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Mc=class extends Sn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new ue}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}};var pp={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ue(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var ar=class i extends Sn{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new te(e.x,e.y):new te(256,256),this.clearColor=new ue(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Vt(r,o,{type:en,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let u=new Vt(r,o,{type:en,depthBuffer:!1});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);let d=new Vt(r,o,{type:en,depthBuffer:!1});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}let a=pp;this.highPassUniforms=Pn.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Pt({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new te(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Pn.clone(or.uniforms),this.blendMaterial=new Pt({uniforms:this.copyUniforms,vertexShader:or.vertexShader,fragmentShader:or.fragmentShader,premultipliedAlpha:!0,blending:nt,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new ue,this._oldClearAlpha=1,this._basic=new xe,this._fsQuad=new zi(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new te(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let o=0;o<e;o++)t.push(.39894*Math.exp(-.5*o*o/(n*n))/n);let s=[],r=[];for(let o=1;o<e;o+=2){let a=t[o],l=o+1<e?t[o+1]:0,c=a+l;s.push((o*a+(o+1)*l)/c),r.push(c)}return new Pt({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new te(.5,.5)},direction:{value:new te(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new Pt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};ar.BlurDirectionX=new te(1,0);ar.BlurDirectionY=new te(0,1);var Ho={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var vc=class extends Sn{constructor(){super(),this.isOutputPass=!0,this.uniforms=Pn.clone(Ho.uniforms),this.material=new Vs({name:Ho.name,uniforms:this.uniforms,vertexShader:Ho.vertexShader,fragmentShader:Ho.fragmentShader}),this._fsQuad=new zi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},lt.getTransfer(this._outputColorSpace)===xt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===co?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===ho?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===uo?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ns?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===po?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===mo?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===fo&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};function mp(i,e,t){let n=new yc(i);n.addPass(new Mc(e,t));let s=new ar(new te(window.innerWidth,window.innerHeight),.9,.5,.55);return n.addPass(s),n.addPass(new vc),n}var gp={type:"change"},wh={type:"start"},xp={type:"end"},Ec=new oi,_p=new yn,by=Math.cos(70*Yl.DEG2RAD),Yt=new I,mn=2*Math.PI,vt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Th=1e-6,bc=class extends ao{constructor(e,t=null){super(e,t),this.state=vt.NONE,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ii.ROTATE,MIDDLE:Ii.DOLLY,RIGHT:Ii.PAN},this.touches={ONE:Li.ROTATE,TWO:Li.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new kt,this._lastTargetPosition=new I,this._quat=new kt().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Xs,this._sphericalDelta=new Xs,this._scale=1,this._panOffset=new I,this._rotateStart=new te,this._rotateEnd=new te,this._rotateDelta=new te,this._panStart=new te,this._panEnd=new te,this._panDelta=new te,this._dollyStart=new te,this._dollyEnd=new te,this._dollyDelta=new te,this._dollyDirection=new I,this._mouse=new te,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Ty.bind(this),this._onPointerDown=Sy.bind(this),this._onPointerUp=wy.bind(this),this._onContextMenu=Dy.bind(this),this._onMouseWheel=Cy.bind(this),this._onKeyDown=Py.bind(this),this._onTouchStart=Iy.bind(this),this._onTouchMove=Ly.bind(this),this._onMouseDown=Ry.bind(this),this._onMouseMove=Ay.bind(this),this._interceptControlDown=Ny.bind(this),this._interceptControlUp=Uy.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=vt.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(gp),this.update(),this.state=vt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;Yt.copy(t).sub(this.target),Yt.applyQuaternion(this._quat),this._spherical.setFromVector3(Yt),this.autoRotate&&this.state===vt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=mn:n>Math.PI&&(n-=mn),s<-Math.PI?s+=mn:s>Math.PI&&(s-=mn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Yt.setFromSpherical(this._spherical),Yt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Yt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Yt.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new I(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new I(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Yt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Ec.origin.copy(this.object.position),Ec.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ec.direction))<by?this.object.lookAt(this.target):(_p.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ec.intersectPlane(_p,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Th||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Th||this._lastTargetPosition.distanceToSquared(this.target)>Th?(this.dispatchEvent(gp),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?mn/60*this.autoRotateSpeed*e:mn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Yt.setFromMatrixColumn(t,0),Yt.multiplyScalar(-e),this._panOffset.add(Yt)}_panUp(e,t){this.screenSpacePanning===!0?Yt.setFromMatrixColumn(t,1):(Yt.setFromMatrixColumn(t,0),Yt.crossVectors(this.object.up,Yt)),Yt.multiplyScalar(e),this._panOffset.add(Yt)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Yt.copy(s).sub(this.target);let r=Yt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientY),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(mn*this._rotateDelta.x/t.clientHeight),this._rotateUp(mn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(mn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-mn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(mn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-mn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(mn*this._rotateDelta.x/t.clientHeight),this._rotateUp(mn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new te,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Sy(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function Ty(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function wy(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(xp),this.state=vt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Ry(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ii.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=vt.DOLLY;break;case Ii.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=vt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=vt.ROTATE}break;case Ii.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=vt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=vt.PAN}break;default:this.state=vt.NONE}this.state!==vt.NONE&&this.dispatchEvent(wh)}function Ay(i){switch(this.state){case vt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case vt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case vt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Cy(i){this.enabled===!1||this.enableZoom===!1||this.state!==vt.NONE||(i.preventDefault(),this.dispatchEvent(wh),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(xp))}function Py(i){this.enabled!==!1&&this._handleKeyDown(i)}function Iy(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Li.ROTATE:if(this.enableRotate===!1){this.state=vt.NONE;break}this._handleTouchStartRotate(i),this.state=vt.TOUCH_ROTATE;break;case Li.PAN:if(this.enablePan===!1){this.state=vt.NONE;break}this._handleTouchStartPan(i),this.state=vt.TOUCH_PAN;break;default:this.state=vt.NONE}break;case 2:switch(this.touches.TWO){case Li.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=vt.TOUCH_DOLLY_PAN;break;case Li.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=vt.TOUCH_DOLLY_ROTATE;break;default:this.state=vt.NONE}break;default:this.state=vt.NONE}this.state!==vt.NONE&&this.dispatchEvent(wh)}function Ly(i){switch(this._trackPointer(i),this.state){case vt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case vt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case vt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case vt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=vt.NONE}}function Dy(i){this.enabled!==!1&&i.preventDefault()}function Ny(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Uy(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Sc=class{constructor(e,t,n){this.tween=0;this.fromPos=new I;this.fromTarget=new I;this.toPos=new I;this.toTarget=new I;this.currentLevel="L0";this.onLevelChange=null;this.camera=e,this.plan=n,this.controls=new bc(e,t),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.minDistance=4,this.controls.maxDistance=3600,this.controls.maxPolarAngle=Math.PI*.485,this.controls.target.set(0,12,0);try{let s=localStorage.getItem("cityweb.cam");if(s){let r=JSON.parse(s);r.p&&r.t&&(e.position.fromArray(r.p),this.controls.target.fromArray(r.t))}else this.applyLevel(0,!1)}catch{this.applyLevel(0,!1)}}levels(){let e=[{name:"L0 \u603B\u89C8",pos:new I(240,1750,2150),target:new I(180,90,0)}];for(let t of this.plan.districts){let n=new I(t.cx,0,t.cz).normalize();e.push({name:`L1 ${t.name}`,pos:new I(t.cx-n.x*640,700,t.cz-n.z*640),target:new I(t.cx,90,t.cz)})}return e}applyLevel(e,t){var o;let n=this.levels(),s=pn(e,0,n.length-1),r=n[s];if(this.currentLevel=s===0?"L0":`L1\xB7${this.plan.districts[s-1].name}`,(o=this.onLevelChange)==null||o.call(this,this.currentLevel),!t){this.camera.position.copy(r.pos),this.controls.target.copy(r.target),this.controls.update();return}this.fromPos.copy(this.camera.position),this.fromTarget.copy(this.controls.target),this.toPos.copy(r.pos),this.toTarget.copy(r.target),this.tween=1e-4}update(e){if(this.tween>0){this.tween=Math.min(1,this.tween+e/1.4);let t=s2(this.tween);this.camera.position.lerpVectors(this.fromPos,this.toPos,t),this.controls.target.lerpVectors(this.fromTarget,this.toTarget,t),this.tween>=1&&(this.tween=0)}this.controls.update()}persist(){try{localStorage.setItem("cityweb.cam",JSON.stringify({p:this.camera.position.toArray(),t:this.controls.target.toArray()}))}catch{}}focusDistrictAt(e){let t=-1,n=1/0;this.plan.districts.forEach((s,r)=>{let o=Math.hypot(e.x-s.cx,e.z-s.cz);o<n&&(n=o,t=r)}),t>=0&&n<900&&this.applyLevel(t+1,!0)}applyStreet(e,t=6.5,n=1.95){var h;this.fromPos.copy(this.camera.position),this.fromTarget.copy(this.controls.target);let s=0,r=0,o=1/0;for(let u of this.plan.districts){let d=Math.hypot(e.x-u.cx,e.z-u.cz);d<o&&(o=d,s=u.cx,r=u.cz)}let a=e.x-s,l=e.z-r,c=Math.hypot(a,l)||1;a/=c,l/=c,this.toPos.set(e.x+a*t,n,e.z+l*t),this.toTarget.set(e.x,1.8,e.z),this.tween=1e-4,(h=this.onLevelChange)==null||h.call(this,"L2 \u8857\u666F")}};var Oy=`
#cw-hud{position:fixed;inset:0;z-index:10;pointer-events:none;font-family:'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;color:#c3cfe2;font-variant-numeric:tabular-nums}
#cw-hud .panel{position:absolute;background:linear-gradient(135deg,rgba(11,17,32,.88),rgba(9,14,26,.82));border:1px solid #22304a;border-radius:12px;padding:12px 14px;backdrop-filter:blur(4px)}
#cw-tl{top:14px;left:14px;width:284px}
#cw-h1{font-size:17px;color:#fff;letter-spacing:1px;font-weight:700}
#cw-h1 b{color:#5eead4}
#cw-sub{font-size:10.5px;color:#93a4ba;margin-top:2px}
#cw-clock{font-size:21px;color:#5eead4;font-weight:700;margin-top:8px;letter-spacing:2px}
#cw-phase{font-size:11px;color:#93a4ba;margin-left:8px}
#cw-weather{font-size:11.5px;color:#93a4ba;margin-top:3px}
#cw-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;margin-top:10px}
#cw-stats .st .n{font-size:15px;color:#e8f4ff;font-weight:700}
#cw-stats .st .l{font-size:9.5px;color:#71829b;margin-top:1px}
#cw-zones{margin-top:10px}
#cw-zones .z{margin-top:6px}
#cw-zones .zl{display:flex;justify-content:space-between;font-size:10.5px;color:#9fb8d0}
#cw-zones .zb{height:4px;background:#0a1120;border:1px solid #1a2538;border-radius:3px;margin-top:2px;overflow:hidden}
#cw-zones .zf{height:100%;border-radius:2px;transition:width .8s}
#cw-fleet{margin-top:10px;font-size:10px;color:#71829b;line-height:1.7}
#cw-fleet .m{display:flex;gap:6px;align-items:baseline}
#cw-fleet .dot{width:7px;height:7px;border-radius:50%;flex:none;align-self:center}
#cw-tr{top:14px;right:14px;width:300px}
#cw-tr h3{font-size:11px;color:#5eead4;margin:0 0 6px;letter-spacing:1px}
#cw-events{font-size:10.5px;line-height:1.8;color:#9fb8d0}
#cw-events .ev{display:flex;gap:7px}
#cw-events .ts{color:#5a6c84;flex:none}
#cw-events .ty{color:#dbe6f5;flex:none;font-weight:600}
#cw-bb{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);background:rgba(9,14,26,.85);border:1px solid #1a2538;border-radius:20px;padding:5px 16px;font-size:10.5px;color:#93a4ba;white-space:nowrap}
#cw-bb b{color:#93a4ba}
#cw-cam{position:absolute;bottom:12px;left:14px;font-size:10.5px;color:#5eead4;background:rgba(9,14,26,.8);border:1px solid #1a2538;border-radius:8px;padding:4px 10px}
#cw-demo{position:absolute;top:14px;left:50%;transform:translateX(-50%);background:#4a1d1d;border:1px solid #f87171;color:#fecaca;font-size:10.5px;border-radius:8px;padding:4px 12px}
.cwf-data{color:#fbbf24}.cwf-quant{color:#fbbf24}.cwf-gaming{color:#5eead4}.cwf-media{color:#f472b6}.cwf-governance{color:#60a5fa}
`;function yp(i){var x,b,S,_,v,P,T,C,D,N;let e=document.createElement("style");e.textContent=Oy,document.head.appendChild(e);let t=document.createElement("div");t.id="cw-hud";let n=A=>A==="gaming"?"#5eead4":A==="quant"?"#fbbf24":A==="media"?"#f472b6":"#60a5fa",s=document.createElement("div");s.className="panel",s.id="cw-tl";let r=(x=i.city)!=null?x:{};s.innerHTML=`
<div id="cw-h1">\u7845\u57FA\u57CE\u5E02 <b>FLUX VERSE</b></div>
<div id="cw-sub">\u57CE\u5373\u8D85\u4F53 \xB7 \u96C6\u56E2\u5B9E\u65F6\u955C\u50CF \xB7 three.js</div>
<div><span id="cw-clock">--:--:--</span><span id="cw-phase"></span></div>
<div id="cw-weather"></div>
<div id="cw-stats">
  <div class="st"><div class="n" id="cw-res">${((b=i.census_total)!=null?b:0).toLocaleString()}</div><div class="l">\u7845\u57FA\u5C45\u6C11</div></div>
  <div class="st"><div class="n" id="cw-games">${(S=r.games_total)!=null?S:"-"}<span style="font-size:10px;color:#5eead4"> \xB7 ${(_=r.games_active)!=null?_:"-"} \u6D3B</span></div><div class="l">\u6E38\u620F / \u5728\u4EA7</div></div>
  <div class="st"><div class="n" id="cw-commits">${((v=r.commits_total)!=null?v:0).toLocaleString()}</div><div class="l">\u7D2F\u8BA1\u63D0\u4EA4</div></div>
  <div class="st"><div class="n" id="cw-fleetn">${(P=r.fleet_online)!=null?P:0}/${i.fleet.length}</div><div class="l">\u673A\u961F\u5728\u7EBF</div></div>
</div>
<div id="cw-zones"></div>
<div id="cw-fleet"></div>`,t.appendChild(s);let o=i.reality,a=s.querySelector("#cw-weather"),l={clear:"\u6674",cloud:"\u591A\u4E91",rain:"\u96E8",snow:"\u96EA",wind:"\u98CE"};a.textContent=`\u4E0A\u6D77 ${(T=l[o.weather_kind])!=null?T:o.weather_kind} ${o.weather_temp_c}\xB0C \xB7 ${o.season==="autumn"?"\u79CB":o.season==="winter"?"\u51AC":o.season==="spring"?"\u6625":"\u590F"}`;let c=s.querySelector("#cw-zones"),h={active:"\u6D3B\u8DC3",dormant:"\u4F11\u7720"};for(let A of i.zones){let U=document.createElement("div");U.className="z";let F=Math.max(0,Math.min(1,A.activity));U.innerHTML=`<div class="zl"><span>${A.name} \xB7 ${(C=h[A.status])!=null?C:A.status}</span><span>${(F*100).toFixed(0)}%</span></div>
<div class="zb"><div class="zf" style="width:${(F*100).toFixed(0)}%;background:${n(A.id)}"></div></div>`,c.appendChild(U)}let u=s.querySelector("#cw-fleet");for(let A of i.fleet){if(A.cores<=0)continue;let U=document.createElement("div");U.className="m";let F=((D=A.current_task)!=null?D:"").substring(0,26);U.innerHTML=`<span class="dot" style="background:${A.online?"#4ade80":"#39485e"}"></span>
<span style="color:#93a4ba">${A.id}</span><span style="color:#5a6c84;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${F}</span>`,u.appendChild(U)}let d=document.createElement("div");d.className="panel",d.id="cw-tr",d.innerHTML='<h3>\u4E8B\u4EF6\u6D41 \xB7 \u771F\u5B9E\u4E8B\u4EF6\u56DE\u653E</h3><div id="cw-events"></div>',t.appendChild(d);let f=d.querySelector("#cw-events"),m=[],y=document.createElement("div");y.id="cw-bb",y.innerHTML=`\u62D6\u62FD\u65CB\u8F6C \xB7 \u6EDA\u8F6E\u7F29\u653E \xB7 <b>0</b> \u603B\u89C8 \xB7 <b>1/2/3</b> \u4E09\u57CE \xB7 \u70B9\u51FB\u57CE\u533A\u805A\u7126 \xB7 \u6570\u636E\u65F6\u70B9 <b>${o2((N=i.reality.beijing_hhmm)!=null?N:"")}</b>${Ao()?"":" \xB7 <span style='color:#f87171'>\u6F14\u793A\u6570\u636E</span>"}`,t.appendChild(y);let g=document.createElement("div");g.id="cw-cam",g.textContent="L0 \u603B\u89C8",t.appendChild(g);let p=document.createElement("div");if(p.id="cw-resident",p.style.cssText="position:absolute;left:14px;bottom:46px;max-width:420px;display:none;background:rgba(9,14,26,.9);border:1px solid #2a3f63;border-radius:10px;padding:10px 13px;font-size:12.5px;line-height:1.6;color:#dbe7f7",t.appendChild(p),y.innerHTML+=" \xB7 <b>R</b> \u5C45\u6C11\u8857\u666F",!Ao()){let A=document.createElement("div");A.id="cw-demo",A.textContent="DEMO DATA \xB7 \u672A\u7ECF\u6570\u636E\u5BFC\u51FA",t.appendChild(A)}document.body.appendChild(t);let M=s.querySelector("#cw-clock"),E=s.querySelector("#cw-phase");return{root:t,setClock(A,U){M.textContent=r2(A),E.textContent=`${U} \xB7 \u5317\u4EAC\u65F6\u95F4`},ticker(A){var B,V;let U=document.createElement("div");U.className="ev";let F=A.ts_utc?A.ts_utc.substring(11,16):"--:--";for(U.innerHTML=`<span class="ts">${F}</span><span class="ty cwf-${(B=A.zone)!=null?B:"governance"}">${A.type}</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#71829b">${((V=A.summary)!=null?V:"").substring(0,40)}</span>`,f.insertBefore(U,f.firstChild),m.push(U);m.length>7;){let z=m.shift();z==null||z.remove()}},setCam(A){g.textContent=A}}}function Fy(i,e,t,n,s=1){let{x:r,z:o}=$1({lat:e,lon:t});i.root.position.set(r,0,o),i.root.rotation.y=n,i.root.scale.setScalar(s)}function By(){var Le;let i=Yd(),e=document.getElementById("app"),t=new Jl({antialias:!0,powerPreference:"high-performance"});t.setPixelRatio(Math.min(window.devicePixelRatio,2)),t.setSize(window.innerWidth,window.innerHeight),t.shadowMap.enabled=!0,t.shadowMap.type=il,t.toneMapping=ns,t.toneMappingExposure=1.05,e.appendChild(t.domElement);let n=new Lr,s=new hn(48,window.innerWidth/window.innerHeight,.3,9e3);s.position.set(0,1600,1900);let r=new io(16773852,2.2);r.castShadow=!0,r.shadow.mapSize.set(2048,2048),r.shadow.camera.left=-1500,r.shadow.camera.right=1500,r.shadow.camera.top=1500,r.shadow.camera.bottom=-1500,r.shadow.camera.far=4200,r.shadow.bias=-6e-4,n.add(r);let o=new to(9085120,2765378,.8);n.add(o);let a=D2();n.add(a.mesh),n.add(a.stars);let l=new Z(new kr(3600,64),new ke({color:395794,roughness:.96,metalness:0}));l.rotation.x=-Math.PI/2,l.receiveShadow=!0,n.add(l);let c=t2(i);n.add(c.root);let h=c.plan,u=n2();u.root.position.set(c.islandPos.x,9,c.islandPos.z),u.root.scale.setScalar(2.6),n.add(u.root);let d=c.landmarkSlots,f=[],m=(oe,ye)=>{Fy(oe,ye.lat,ye.lon,ye.rotY),n.add(oe.root),f.push(oe)};m(y2(),d.pearl),m(M2(),d.jinmao),m(T2(),d.shanghaiTower),m(R2(),d.swfc),m(I2(),d.whiteMagnolia),m(L2(),d.waibaidu);let y=i2(h);n.add(y.root);let g=a2(i);g.root.position.set(c.islandPos.x,0,c.islandPos.z),n.add(g.root);let p=u2(h,i);n.add(p.root);let M=F2(h);n.add(M.root);let E=z2(h);n.add(E.root);let x=k2();n.add(x.root);let b=K2();n.add(b.root);let S=$2(h);n.add(S.root);let _=pf(h);n.add(_.root);let v=Mf(),P=$1({lat:31.239,lon:121.4868});v.root.position.set(P.x,0,P.z),v.root.rotation.y=Math.PI,n.add(v.root);let T=Gf();n.add(T.root);let C=Rf(h);n.add(C.root);let D=Vf(h,i);n.add(D.root);let N=Jf();n.add(N.root);let A=op();n.add(A.root);let U=hp(i);n.add(U.root);let F=fp(h,i);n.add(F.root);let B=N2(h,i);n.add(B.points);let V=mp(t,n,s),z=yp(i),W=new Sc(s,t.domElement,h);W.onLevelChange=oe=>z.setCam(oe);let K=new sc(n,r,o,a,i);K.attachMaterials(null,l.material),K.realMats=c.bodyMats,K.waterMat=c.waterMat;for(let oe of c.flowMats)K.flowMats.push(oe);K.dustMat=B.mat;let Q=new rc(n,h,u,K,(Le=i.events_tail)!=null?Le:[]);Q.hooks.onEvent=oe=>{z.ticker(oe),oe.type==="TRANSFER"&&M.pushEvent(oe)};let ae=new cc(s,t.domElement);ae.setColliders(c.colliders),ae.setEnterable(C.specs),window.addEventListener("keydown",oe=>{if(oe.key==="0"&&W.applyLevel(0,!0),oe.key==="1"&&W.applyLevel(1,!0),oe.key==="2"&&W.applyLevel(2,!0),oe.key==="3"&&W.applyLevel(3,!0),oe.key==="f"||oe.key==="F"){if(!ae.enabled()&&C.specs.length>0){let $=s.position,le=0,de=1/0;C.specs.forEach((Me,Ke)=>{let ze=Math.hypot($.x-Me.cx,$.z-Me.cz);ze<de&&(de=ze,le=Ke)});let Ie=C.specs[le];$.set(Ie.cx,1.8,Ie.cz+Ie.hd+6),s.lookAt(Ie.cx,12,Ie.cz)}let ye=ae.toggle();z.setCam(ye?"L2 \u6B65\u884C":W.currentLevel),W.controls.enabled=!ye}if((oe.key==="t"||oe.key==="T")&&ae.enabled()&&C.specs.length>0){let ye=s.position,$=0,le=1/0;C.specs.forEach((Ie,Me)=>{let Ke=Math.hypot(ye.x-Ie.cx,ye.z-Ie.cz);Ke<le&&(le=Ke,$=Me)});let de=C.specs[($+1)%C.specs.length];ye.set(de.cx,1.8,de.cz+de.hd+6),s.lookAt(de.cx,12,de.cz),z.setCam("L2 \u4F20\u9001 \u2192 \u9986")}});let k=0,re=0;t.domElement.addEventListener("pointerdown",oe=>{k=oe.clientX,re=oe.clientY}),t.domElement.addEventListener("pointerup",oe=>{if(Math.hypot(oe.clientX-k,oe.clientY-re)>6)return;let ye=new te(oe.clientX/window.innerWidth*2-1,-(oe.clientY/window.innerHeight)*2+1),$=new ro;$.setFromCamera(ye,s);let le=-$.ray.origin.y/$.ray.direction.y;if(le>0){let de=$.ray.origin.clone().add($.ray.direction.clone().multiplyScalar(le));W.focusDistrictAt(de)}}),window.addEventListener("resize",()=>{s.aspect=window.innerWidth/window.innerHeight,s.updateProjectionMatrix(),t.setSize(window.innerWidth,window.innerHeight),V.setSize(window.innerWidth,window.innerHeight)});let ce=()=>z.setClock(new Date,K.label());ce(),window.setInterval(ce,1e3),window.setInterval(()=>{W.persist(),location.reload()},600*1e3),window.setInterval(()=>W.persist(),3e4),window.addEventListener("beforeunload",()=>W.persist());let Ce=new oo;window.__cwCamera=s;let he=-1,Ne=oe=>{let ye=p.anchors;if(!ye.length)return;he=typeof oe=="number"?(oe%ye.length+ye.length)%ye.length:(he+1)%ye.length;let $=ye[he];p.setLabels(!1),W.applyStreet($.pos),z.setCam(`\u5C45\u6C11 ${he+1}/${ye.length} \xB7 ${$.name}`);let le=document.getElementById("cw-resident");le&&(le.innerHTML=`<b>${$.name}</b>\u3000<span style="color:#8aa0c4">${$.profession}</span><br><span style="color:#dbe7f7">${($.ring||"\uFF08\u4ECA\u65E5\u6682\u65E0\u5E74\u8F6E\uFF09").slice(0,90)}</span>`,le.style.display="block")};window.__CITY_STREET__=Ne,window.addEventListener("keydown",oe=>{(oe.key==="r"||oe.key==="R")&&Ne()});function et(){requestAnimationFrame(et);let oe=Math.min(.1,Ce.getDelta()),ye=Ce.elapsedTime;K.update(),Q.update(ye),g.update(oe,ye),p.update(oe,ye),M.update(oe,ye),U.update(oe,ye),F.update(oe,ye,K.hour()),E.update(oe,ye,K.hour()),x.update(oe,ye),b.update(oe,ye),S.update(oe,ye),_.update(oe,ye),v.update(oe,ye),T.update(oe,ye),C.update(oe,ye),D.update(oe,ye),N.update(oe,ye),A.update(oe,ye),ae.update(oe);for(let $ of f)$.update(oe,ye);ae.enabled()||W.update(oe),V.render()}et(),console.log(`[CityWeb] real-geography city: footprints=${c.buildingCount} live=${Ao()}`)}By();})();
