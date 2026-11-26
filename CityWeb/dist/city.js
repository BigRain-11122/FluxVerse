"use strict";(()=>{var xi={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},yi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Bh=0,O1=1,zh=2;var Xr=1,Fa=2,Ls=3,vi=0,qt=1,ln=2,ni=0,Ds=1,Ot=2,F1=3,B1=4,Hh=5;var zi=100,Gh=101,kh=102,Vh=103,Wh=104,Xh=200,Yh=201,qh=202,Zh=203,z1=204,H1=205,Jh=206,$h=207,Kh=208,jh=209,Qh=210,eu=211,tu=212,nu=213,iu=214,ea=0,ta=1,na=2,ms=3,ia=4,sa=5,ra=6,oa=7,Ba=0,su=1,ru=2,Hn=0,Yr=1,qr=2,Zr=3,Hi=4,Jr=5,$r=6,Kr=7;var G1=300,Gi=301,Ns=302,za=303,Ha=304,aa=1e3,Nn=1001,la=1002,Xt=1003,ou=1004;var jr=1005;var rn=1006,Ga=1007;var ii=1008;var cn=1009,k1=1010,V1=1011,Us=1012,ka=1013,Cn=1014,bn=1015,Zt=1016,Va=1017,Wa=1018,ki=1020,W1=35902,X1=35899,Y1=1021,q1=1022,Pn=1023,Kn=1026,si=1027,Xa=1028,Ya=1029,Mi=1030,qa=1031;var Za=1033,Qr=33776,eo=33777,to=33778,no=33779,Ja=35840,$a=35841,Ka=35842,ja=35843,Qa=36196,el=37492,tl=37496,nl=37488,il=37489,io=37490,sl=37491,rl=37808,ol=37809,al=37810,ll=37811,cl=37812,hl=37813,ul=37814,dl=37815,fl=37816,pl=37817,ml=37818,gl=37819,_l=37820,xl=37821,yl=36492,vl=36494,Ml=36495,bl=36283,Sl=36284,so=36285,El=36286;var lr=2300,ca=2301,jo=2302,S1=2303,E1=2400,T1=2401,w1=2402;var au=3200;var ro=0,lu=1,ri="",fn="srgb",cr="srgb-linear",hr="linear",pt="srgb";var Qo=7680;var cu=519,hu=512,uu=513,du=514,Z1=515,fu=516,pu=517,J1=518,$1=519,K1=35044,Vi=35048;var j1="300 es",vn=2e3,gs=2001;function I2(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function L2(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function ur(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function mu(){let i=ur("canvas");return i.style.display="block",i}var Kc={},_s=null;function dr(...i){let e="THREE."+i.shift();_s?_s("log",e,...i):console.log(e,...i)}function gu(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function He(...i){i=gu(i);let e="THREE."+i.shift();if(_s)_s("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function ke(...i){i=gu(i);let e="THREE."+i.shift();if(_s)_s("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function ir(...i){let e=i.join(" ");e in Kc||(Kc[e]=!0,He(...i))}function _u(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var xu={[ea]:ea,[na]:ra,[ia]:ia,[ms]:sa,[ta]:ta,[ra]:na,[oa]:oa,[sa]:ms},Rn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],jc=1234567,sr=Math.PI/180,xs=180/Math.PI;function oi(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(jt[i&255]+jt[i>>8&255]+jt[i>>16&255]+jt[i>>24&255]+"-"+jt[e&255]+jt[e>>8&255]+"-"+jt[e>>16&15|64]+jt[e>>24&255]+"-"+jt[t&63|128]+jt[t>>8&255]+"-"+jt[t>>16&255]+jt[t>>24&255]+jt[n&255]+jt[n>>8&255]+jt[n>>16&255]+jt[n>>24&255]).toLowerCase()}function nt(i,e,t){return Math.max(e,Math.min(t,i))}function Q1(i,e){return(i%e+e)%e}function D2(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function N2(i,e,t){return i!==e?(t-i)/(e-i):0}function rr(i,e,t){return(1-t)*i+t*e}function U2(i,e,t,n){return rr(i,e,1-Math.exp(-t*n))}function O2(i,e=1){return e-Math.abs(Q1(i,e*2)-e)}function F2(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function B2(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function z2(i,e){return i+Math.floor(Math.random()*(e-i+1))}function H2(i,e){return i+Math.random()*(e-i)}function G2(i){return i*(.5-Math.random())}function k2(i){i!==void 0&&(jc=i);let e=jc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function V2(i){return i*sr}function W2(i){return i*xs}function X2(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function Y2(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function ec(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function q2(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),d=r((e-n)/2),u=o((e-n)/2),f=r((n-e)/2),p=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*d,l*u,a*c);break;case"YZY":i.set(l*u,a*h,l*d,a*c);break;case"ZXZ":i.set(l*d,l*u,a*h,a*c);break;case"XZX":i.set(a*h,l*p,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*p,a*c);break;case"ZYZ":i.set(l*p,l*f,a*h,a*c);break;default:He("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Tl(i){switch(i.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function tc(i,e){if(e.constructor===Float32Array)return i;let t=Tl(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(i/t,-1)}function nc(i,e){if(e.constructor===Float32Array)return i;let t=Tl(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(i*t)}var wl={DEG2RAD:sr,RAD2DEG:xs,generateUUID:oi,clamp:nt,euclideanModulo:Q1,mapLinear:D2,inverseLerp:N2,lerp:rr,damp:U2,pingpong:O2,smoothstep:F2,smootherstep:B2,randInt:z2,randFloat:H2,randFloatSpread:G2,seededRandom:k2,degToRad:V2,radToDeg:W2,isPowerOfTwo:X2,ceilPowerOfTwo:Y2,floorPowerOfTwo:ec,setQuaternionFromProperEuler:q2,normalize:nc,denormalize:tc},lc=class lc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};lc.prototype.isVector2=!0;var ne=lc,mn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[o+0],f=r[o+1],p=r[o+2],y=r[o+3];if(d!==y||l!==u||c!==f||h!==p){let _=l*u+c*f+h*p+d*y;_<0&&(u=-u,f=-f,p=-p,y=-y,_=-_);let m=1-a;if(_<.9995){let v=Math.acos(_),b=Math.sin(v);m=Math.sin(m*v)/b,a=Math.sin(a*v)/b,l=l*m+u*a,c=c*m+f*a,h=h*m+p*a,d=d*m+y*a}else{l=l*m+u*a,c=c*m+f*a,h=h*m+p*a,d=d*m+y*a;let v=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=v,c*=v,h*=v,d*=v}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],u=r[o+1],f=r[o+2],p=r[o+3];return e[t]=a*p+h*d+l*f-c*u,e[t+1]=l*p+h*u+c*d-a*f,e[t+2]=c*p+h*f+a*u-l*d,e[t+3]=h*p-a*d-l*u-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),u=l(n/2),f=l(s/2),p=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"YZX":this._x=u*h*d+c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d-u*f*p;break;case"XZY":this._x=u*h*d-c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d+u*f*p;break;default:He("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+a+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>d){let f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(nt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-t;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},cc=class cc{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Qc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Qc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),d=2*(r*n-o*t);return this.x=t+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=s+l*d+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return jl.copy(this).projectOnVector(e),this.sub(jl)}reflect(e){return this.sub(jl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};cc.prototype.isVector3=!0;var L=cc,jl=new L,Qc=new mn,hc=class hc{constructor(e,t,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],p=n[8],y=s[0],_=s[3],m=s[6],v=s[1],b=s[4],x=s[7],T=s[2],w=s[5],g=s[8];return r[0]=o*y+a*v+l*T,r[3]=o*_+a*b+l*w,r[6]=o*m+a*x+l*g,r[1]=c*y+h*v+d*T,r[4]=c*_+h*b+d*w,r[7]=c*m+h*x+d*g,r[2]=u*y+f*v+p*T,r[5]=u*_+f*b+p*w,r[8]=u*m+f*x+p*g,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,p=t*d+n*u+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/p;return e[0]=d*y,e[1]=(s*c-h*n)*y,e[2]=(a*n-s*o)*y,e[3]=u*y,e[4]=(h*t-s*l)*y,e[5]=(s*r-a*t)*y,e[6]=f*y,e[7]=(n*l-c*t)*y,e[8]=(o*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return ir("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ql.makeScale(e,t)),this}rotate(e){return ir("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ql.makeRotation(-e)),this}translate(e,t){return ir("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ql.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};hc.prototype.isMatrix3=!0;var Ye=hc,Ql=new Ye,eh=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),th=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Z2(){let i={enabled:!0,workingColorSpace:cr,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===pt&&(s.r=$n(s.r),s.g=$n(s.g),s.b=$n(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===pt&&(s.r=ps(s.r),s.g=ps(s.g),s.b=ps(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ri?hr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[o].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[cr]:{primaries:e,whitePoint:n,transfer:hr,toXYZ:eh,fromXYZ:th,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:fn},outputColorSpaceConfig:{drawingBufferColorSpace:fn}},[fn]:{primaries:e,whitePoint:n,transfer:pt,toXYZ:eh,fromXYZ:th,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:fn}}}),i}var rt=Z2();function $n(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ps(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var $i,ha=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{$i===void 0&&($i=ur("canvas")),$i.width=e.width,$i.height=e.height;let s=$i.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=$i}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=ur("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=$n(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor($n(t[n]/255)*255):t[n]=$n(t[n]);return{data:t,width:e.width,height:e.height}}else return He("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},J2=0,ys=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:J2++}),this.uuid=oi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement!="undefined"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame!="undefined"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(e1(s[o].image)):r.push(e1(s[o]))}else r=e1(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function e1(i){return typeof HTMLImageElement!="undefined"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&i instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&i instanceof ImageBitmap?ha.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(He("Texture: Unable to serialize Texture."),{})}var $2=0,t1=new L,on=class i extends Rn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Nn,s=Nn,r=rn,o=ii,a=Pn,l=cn,c=i.DEFAULT_ANISOTROPY,h=ri){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$2++}),this.uuid=oi(),this.name="",this.source=new ys(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ne(0,0),this.repeat=new ne(1,1),this.center=new ne(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(t1).x}get height(){return this.source.getSize(t1).y}get depth(){return this.source.getSize(t1).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){He(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){He(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==G1)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case aa:e.x=e.x-Math.floor(e.x);break;case Nn:e.x=e.x<0?0:1;break;case la:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case aa:e.y=e.y-Math.floor(e.y);break;case Nn:e.y=e.y<0?0:1;break;case la:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};on.DEFAULT_IMAGE=null;on.DEFAULT_MAPPING=G1;on.DEFAULT_ANISOTROPY=1;var uc=class uc{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],p=l[9],y=l[2],_=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-y)<.01&&Math.abs(p-_)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+y)<.1&&Math.abs(p+_)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let b=(c+1)/2,x=(f+1)/2,T=(m+1)/2,w=(h+u)/4,g=(d+y)/4,M=(p+_)/4;return b>x&&b>T?b<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(b),s=w/n,r=g/n):x>T?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=w/s,r=M/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=g/r,s=M/r),this.set(n,s,r,t),this}let v=Math.sqrt((_-p)*(_-p)+(d-y)*(d-y)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(_-p)/v,this.y=(d-y)/v,this.z=(u-h)/v,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this.w=nt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this.w=nt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};uc.prototype.isVector4=!0;var Et=uc,ua=class extends Rn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:rn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Et(0,0,e,t),this.scissorTest=!1,this.viewport=new Et(0,0,e,t),this.textures=[];let s=n.count;for(let r=0;r<s;r++)this.textures[r]=new on({width:e,height:t,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:rn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new ys(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ft=class extends ua{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},fr=class extends on{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=Nn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var da=class extends on{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=Nn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Oa=class Oa{constructor(e,t,n,s,r,o,a,l,c,h,d,u,f,p,y,_){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,d,u,f,p,y,_)}set(e,t,n,s,r,o,a,l,c,h,d,u,f,p,y,_){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=d,m[14]=u,m[3]=f,m[7]=p,m[11]=y,m[15]=_,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Oa().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/Ki.setFromMatrixColumn(e,0).length(),r=1/Ki.setFromMatrixColumn(e,1).length(),o=1/Ki.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let u=o*h,f=o*d,p=a*h,y=a*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=f+p*c,t[5]=u-y*c,t[9]=-a*l,t[2]=y-u*c,t[6]=p+f*c,t[10]=o*l}else if(e.order==="YXZ"){let u=l*h,f=l*d,p=c*h,y=c*d;t[0]=u+y*a,t[4]=p*a-f,t[8]=o*c,t[1]=o*d,t[5]=o*h,t[9]=-a,t[2]=f*a-p,t[6]=y+u*a,t[10]=o*l}else if(e.order==="ZXY"){let u=l*h,f=l*d,p=c*h,y=c*d;t[0]=u-y*a,t[4]=-o*d,t[8]=p+f*a,t[1]=f+p*a,t[5]=o*h,t[9]=y-u*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let u=o*h,f=o*d,p=a*h,y=a*d;t[0]=l*h,t[4]=p*c-f,t[8]=u*c+y,t[1]=l*d,t[5]=y*c+u,t[9]=f*c-p,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let u=o*l,f=o*c,p=a*l,y=a*c;t[0]=l*h,t[4]=y-u*d,t[8]=p*d+f,t[1]=d,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*d+p,t[10]=u-y*d}else if(e.order==="XZY"){let u=o*l,f=o*c,p=a*l,y=a*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+y,t[5]=o*h,t[9]=f*d-p,t[2]=p*d-f,t[6]=a*h,t[10]=y*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(K2,e,j2)}lookAt(e,t,n){let s=this.elements;return un.subVectors(e,t),un.lengthSq()===0&&(un.z=1),un.normalize(),ci.crossVectors(n,un),ci.lengthSq()===0&&(Math.abs(n.z)===1?un.x+=1e-4:un.z+=1e-4,un.normalize(),ci.crossVectors(n,un)),ci.normalize(),bo.crossVectors(un,ci),s[0]=ci.x,s[4]=bo.x,s[8]=un.x,s[1]=ci.y,s[5]=bo.y,s[9]=un.y,s[2]=ci.z,s[6]=bo.z,s[10]=un.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],p=n[2],y=n[6],_=n[10],m=n[14],v=n[3],b=n[7],x=n[11],T=n[15],w=s[0],g=s[4],M=s[8],C=s[12],A=s[1],I=s[5],N=s[9],O=s[13],R=s[2],U=s[6],H=s[10],z=s[14],V=s[3],G=s[7],K=s[11],W=s[15];return r[0]=o*w+a*A+l*R+c*V,r[4]=o*g+a*I+l*U+c*G,r[8]=o*M+a*N+l*H+c*K,r[12]=o*C+a*O+l*z+c*W,r[1]=h*w+d*A+u*R+f*V,r[5]=h*g+d*I+u*U+f*G,r[9]=h*M+d*N+u*H+f*K,r[13]=h*C+d*O+u*z+f*W,r[2]=p*w+y*A+_*R+m*V,r[6]=p*g+y*I+_*U+m*G,r[10]=p*M+y*N+_*H+m*K,r[14]=p*C+y*O+_*z+m*W,r[3]=v*w+b*A+x*R+T*V,r[7]=v*g+b*I+x*U+T*G,r[11]=v*M+b*N+x*H+T*K,r[15]=v*C+b*O+x*z+T*W,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],f=e[14],p=e[3],y=e[7],_=e[11],m=e[15],v=l*f-c*u,b=a*f-c*d,x=a*u-l*d,T=o*f-c*h,w=o*u-l*h,g=o*d-a*h;return t*(y*v-_*b+m*x)-n*(p*v-_*T+m*w)+s*(p*b-y*T+m*g)-r*(p*x-y*w+_*g)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],o=e[5],a=e[9],l=e[2],c=e[6],h=e[10];return t*(o*h-a*c)-n*(r*h-a*l)+s*(r*c-o*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],f=e[11],p=e[12],y=e[13],_=e[14],m=e[15],v=t*a-n*o,b=t*l-s*o,x=t*c-r*o,T=n*l-s*a,w=n*c-r*a,g=s*c-r*l,M=h*y-d*p,C=h*_-u*p,A=h*m-f*p,I=d*_-u*y,N=d*m-f*y,O=u*m-f*_,R=v*O-b*N+x*I+T*A-w*C+g*M;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let U=1/R;return e[0]=(a*O-l*N+c*I)*U,e[1]=(s*N-n*O-r*I)*U,e[2]=(y*g-_*w+m*T)*U,e[3]=(u*w-d*g-f*T)*U,e[4]=(l*A-o*O-c*C)*U,e[5]=(t*O-s*A+r*C)*U,e[6]=(_*x-p*g-m*b)*U,e[7]=(h*g-u*x+f*b)*U,e[8]=(o*N-a*A+c*M)*U,e[9]=(n*A-t*N-r*M)*U,e[10]=(p*w-y*x+m*v)*U,e[11]=(d*x-h*w-f*v)*U,e[12]=(a*C-o*I-l*M)*U,e[13]=(t*I-n*C+s*M)*U,e[14]=(y*b-p*T-_*v)*U,e[15]=(h*T-d*b+u*v)*U,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,p=r*d,y=o*h,_=o*d,m=a*d,v=l*c,b=l*h,x=l*d,T=n.x,w=n.y,g=n.z;return s[0]=(1-(y+m))*T,s[1]=(f+x)*T,s[2]=(p-b)*T,s[3]=0,s[4]=(f-x)*w,s[5]=(1-(u+m))*w,s[6]=(_+v)*w,s[7]=0,s[8]=(p+b)*g,s[9]=(_-v)*g,s[10]=(1-(u+y))*g,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let o=Ki.set(s[0],s[1],s[2]).length(),a=Ki.set(s[4],s[5],s[6]).length(),l=Ki.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Tn.copy(this);let c=1/o,h=1/a,d=1/l;return Tn.elements[0]*=c,Tn.elements[1]*=c,Tn.elements[2]*=c,Tn.elements[4]*=h,Tn.elements[5]*=h,Tn.elements[6]*=h,Tn.elements[8]*=d,Tn.elements[9]*=d,Tn.elements[10]*=d,t.setFromRotationMatrix(Tn),n.x=o,n.y=a,n.z=l,this}makePerspective(e,t,n,s,r,o,a=vn,l=!1){let c=this.elements,h=2*r/(t-e),d=2*r/(n-s),u=(t+e)/(t-e),f=(n+s)/(n-s),p,y;if(l)p=r/(o-r),y=o*r/(o-r);else if(a===vn)p=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===gs)p=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=vn,l=!1){let c=this.elements,h=2/(t-e),d=2/(n-s),u=-(t+e)/(t-e),f=-(n+s)/(n-s),p,y;if(l)p=1/(o-r),y=o/(o-r);else if(a===vn)p=-2/(o-r),y=-(o+r)/(o-r);else if(a===gs)p=-1/(o-r),y=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Oa.prototype.isMatrix4=!0;var Ke=Oa,Ki=new L,Tn=new Ke,K2=new L(0,0,0),j2=new L(1,1,1),ci=new L,bo=new L,un=new L,nh=new Ke,ih=new mn,Un=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-nt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(nt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-nt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(nt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:He("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return nh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(nh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ih.setFromEuler(this),this.setFromQuaternion(ih,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Un.DEFAULT_ORDER="XYZ";var vs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Q2=0,sh=new L,ji=new mn,Wn=new Ke,So=new L,Ys=new L,ef=new L,tf=new mn,rh=new L(1,0,0),oh=new L(0,1,0),ah=new L(0,0,1),lh={type:"added"},nf={type:"removed"},Qi={type:"childadded",child:null},n1={type:"childremoved",child:null},St=class i extends Rn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Q2++}),this.uuid=oi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new L,t=new Un,n=new mn,s=new L(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ke},normalMatrix:{value:new Ye}}),this.matrix=new Ke,this.matrixWorld=new Ke,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ji.setFromAxisAngle(e,t),this.quaternion.multiply(ji),this}rotateOnWorldAxis(e,t){return ji.setFromAxisAngle(e,t),this.quaternion.premultiply(ji),this}rotateX(e){return this.rotateOnAxis(rh,e)}rotateY(e){return this.rotateOnAxis(oh,e)}rotateZ(e){return this.rotateOnAxis(ah,e)}translateOnAxis(e,t){return sh.copy(e).applyQuaternion(this.quaternion),this.position.add(sh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(rh,e)}translateY(e){return this.translateOnAxis(oh,e)}translateZ(e){return this.translateOnAxis(ah,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Wn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?So.copy(e):So.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Ys.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wn.lookAt(Ys,So,this.up):Wn.lookAt(So,Ys,this.up),this.quaternion.setFromRotationMatrix(Wn),s&&(Wn.extractRotation(s.matrixWorld),ji.setFromRotationMatrix(Wn),this.quaternion.premultiply(ji.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ke("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(lh),Qi.child=e,this.dispatchEvent(Qi),Qi.child=null):ke("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(nf),n1.child=e,this.dispatchEvent(n1),n1.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Wn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Wn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Wn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(lh),Qi.child=e,this.dispatchEvent(Qi),Qi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ys,e,ef),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ys,tf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),d=o(e.shapes),u=o(e.skeletons),f=o(e.animations),p=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};St.DEFAULT_UP=new L(0,1,0);St.DEFAULT_MATRIX_AUTO_UPDATE=!0;St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var $e=class extends St{constructor(){super(),this.isGroup=!0,this.type="Group"}},sf={type:"move"},Ms=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $e,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $e,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $e,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let y of e.hand.values()){let _=t.getJointPose(y,n),m=this._getHandJoint(c,y);_!==null&&(m.matrix.fromArray(_.transform.matrix),m.matrix.decompose(m.position,m.quaternion,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=_.radius),m.visible=_!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,p=.005;c.inputState.pinching&&u>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(sf)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new $e;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},yu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hi={h:0,s:0,l:0},Eo={h:0,s:0,l:0};function i1(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var me=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=fn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,rt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=rt.workingColorSpace){return this.r=e,this.g=t,this.b=n,rt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=rt.workingColorSpace){if(e=Q1(e,1),t=nt(t,0,1),n=nt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=i1(o,r,e+1/3),this.g=i1(o,r,e),this.b=i1(o,r,e-1/3)}return rt.colorSpaceToWorking(this,s),this}setStyle(e,t=fn){function n(r){r!==void 0&&parseFloat(r)<1&&He("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:He("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);He("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=fn){let n=yu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):He("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=$n(e.r),this.g=$n(e.g),this.b=$n(e.b),this}copyLinearToSRGB(e){return this.r=ps(e.r),this.g=ps(e.g),this.b=ps(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=fn){return rt.workingToColorSpace(Qt.copy(this),e),Math.round(nt(Qt.r*255,0,255))*65536+Math.round(nt(Qt.g*255,0,255))*256+Math.round(nt(Qt.b*255,0,255))}getHexString(e=fn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=rt.workingColorSpace){rt.workingToColorSpace(Qt.copy(this),t);let n=Qt.r,s=Qt.g,r=Qt.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=rt.workingColorSpace){return rt.workingToColorSpace(Qt.copy(this),t),e.r=Qt.r,e.g=Qt.g,e.b=Qt.b,e}getStyle(e=fn){rt.workingToColorSpace(Qt.copy(this),e);let t=Qt.r,n=Qt.g,s=Qt.b;return e!==fn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(hi),this.setHSL(hi.h+e,hi.s+t,hi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(hi),e.getHSL(Eo);let n=rr(hi.h,Eo.h,t),s=rr(hi.s,Eo.s,t),r=rr(hi.l,Eo.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Qt=new me;me.NAMES=yu;var pr=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new me(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var mr=class extends St{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Un,this.environmentIntensity=1,this.environmentRotation=new Un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},wn=new L,Xn=new L,s1=new L,Yn=new L,es=new L,ts=new L,ch=new L,r1=new L,o1=new L,a1=new L,l1=new Et,c1=new Et,h1=new Et,Jn=class i{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),wn.subVectors(e,t),s.cross(wn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){wn.subVectors(s,t),Xn.subVectors(n,t),s1.subVectors(e,t);let o=wn.dot(wn),a=wn.dot(Xn),l=wn.dot(s1),c=Xn.dot(Xn),h=Xn.dot(s1),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(c*l-a*h)*u,p=(o*h-a*l)*u;return r.set(1-f-p,p,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Yn)===null?!1:Yn.x>=0&&Yn.y>=0&&Yn.x+Yn.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Yn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Yn.x),l.addScaledVector(o,Yn.y),l.addScaledVector(a,Yn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return l1.setScalar(0),c1.setScalar(0),h1.setScalar(0),l1.fromBufferAttribute(e,t),c1.fromBufferAttribute(e,n),h1.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(l1,r.x),o.addScaledVector(c1,r.y),o.addScaledVector(h1,r.z),o}static isFrontFacing(e,t,n,s){return wn.subVectors(n,t),Xn.subVectors(e,t),wn.cross(Xn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return wn.subVectors(this.c,this.b),Xn.subVectors(this.a,this.b),wn.cross(Xn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;es.subVectors(s,n),ts.subVectors(r,n),r1.subVectors(e,n);let l=es.dot(r1),c=ts.dot(r1);if(l<=0&&c<=0)return t.copy(n);o1.subVectors(e,s);let h=es.dot(o1),d=ts.dot(o1);if(h>=0&&d<=h)return t.copy(s);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0&&l-h>0)return o=l/(l-h),t.copy(n).addScaledVector(es,o);a1.subVectors(e,r);let f=es.dot(a1),p=ts.dot(a1);if(p>=0&&f<=p)return t.copy(r);let y=f*c-l*p;if(y<=0&&c>=0&&p<=0)return a=c/(c-p),t.copy(n).addScaledVector(ts,a);let _=h*p-f*d;if(_<=0&&d-h>=0&&f-p>=0)return ch.subVectors(r,s),a=(d-h)/(d-h+(f-p)),t.copy(s).addScaledVector(ch,a);let m=1/(_+y+u);return o=y*m,a=u*m,t.copy(n).addScaledVector(es,o).addScaledVector(ts,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},On=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(An.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(An.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=An.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,An):An.fromBufferAttribute(r,o),An.applyMatrix4(e.matrixWorld),this.expandByPoint(An);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),To.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),To.copy(n.boundingBox)),To.applyMatrix4(e.matrixWorld),this.union(To)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,An),An.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(qs),wo.subVectors(this.max,qs),ns.subVectors(e.a,qs),is.subVectors(e.b,qs),ss.subVectors(e.c,qs),ui.subVectors(is,ns),di.subVectors(ss,is),Ci.subVectors(ns,ss);let t=[0,-ui.z,ui.y,0,-di.z,di.y,0,-Ci.z,Ci.y,ui.z,0,-ui.x,di.z,0,-di.x,Ci.z,0,-Ci.x,-ui.y,ui.x,0,-di.y,di.x,0,-Ci.y,Ci.x,0];return!u1(t,ns,is,ss,wo)||(t=[1,0,0,0,1,0,0,0,1],!u1(t,ns,is,ss,wo))?!1:(Ao.crossVectors(ui,di),t=[Ao.x,Ao.y,Ao.z],u1(t,ns,is,ss,wo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,An).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(An).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(qn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},qn=[new L,new L,new L,new L,new L,new L,new L,new L],An=new L,To=new On,ns=new L,is=new L,ss=new L,ui=new L,di=new L,Ci=new L,qs=new L,wo=new L,Ao=new L,Pi=new L;function u1(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Pi.fromArray(i,r);let a=s.x*Math.abs(Pi.x)+s.y*Math.abs(Pi.y)+s.z*Math.abs(Pi.z),l=e.dot(Pi),c=t.dot(Pi),h=n.dot(Pi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Nt=new L,Ro=new ne,rf=0,Ut=class extends Rn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:rf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=K1,this.updateRanges=[],this.gpuType=bn,this.version=0,this._normalizationScale=e!==void 0?Tl(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ro.fromBufferAttribute(this,t),Ro.applyMatrix3(e),this.setXY(t,Ro.x,Ro.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyMatrix3(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyMatrix4(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyNormalMatrix(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.transformDirection(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):tc(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):nc(e,this.array)}};var gr=class extends Ut{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var _r=class extends Ut{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Qe=class extends Ut{constructor(e,t,n){super(new Float32Array(e),t,n)}},of=new On,Zs=new L,d1=new L,Fn=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):of.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Zs.subVectors(e,this.center);let t=Zs.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Zs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(d1.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Zs.copy(e.center).add(d1)),this.expandByPoint(Zs.copy(e.center).sub(d1))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},af=0,yn=new Ke,f1=new St,rs=new L,dn=new On,Js=new On,Wt=new L,dt=class i extends Rn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:af++}),this.uuid=oi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(I2(e)?_r:gr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ye().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return yn.makeRotationFromQuaternion(e),this.applyMatrix4(yn),this}rotateX(e){return yn.makeRotationX(e),this.applyMatrix4(yn),this}rotateY(e){return yn.makeRotationY(e),this.applyMatrix4(yn),this}rotateZ(e){return yn.makeRotationZ(e),this.applyMatrix4(yn),this}translate(e,t,n){return yn.makeTranslation(e,t,n),this.applyMatrix4(yn),this}scale(e,t,n){return yn.makeScale(e,t,n),this.applyMatrix4(yn),this}lookAt(e){return f1.lookAt(e),f1.updateMatrix(),this.applyMatrix4(f1.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rs).negate(),this.translate(rs.x,rs.y,rs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Qe(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&He("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new On);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ke("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];dn.setFromBufferAttribute(r),this.morphTargetsRelative?(Wt.addVectors(this.boundingBox.min,dn.min),this.boundingBox.expandByPoint(Wt),Wt.addVectors(this.boundingBox.max,dn.max),this.boundingBox.expandByPoint(Wt)):(this.boundingBox.expandByPoint(dn.min),this.boundingBox.expandByPoint(dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ke('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ke("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let n=this.boundingSphere.center;if(dn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Js.setFromBufferAttribute(a),this.morphTargetsRelative?(Wt.addVectors(dn.min,Js.min),dn.expandByPoint(Wt),Wt.addVectors(dn.max,Js.max),dn.expandByPoint(Wt)):(dn.expandByPoint(Js.min),dn.expandByPoint(Js.max))}dn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Wt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Wt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Wt.fromBufferAttribute(a,c),l&&(rs.fromBufferAttribute(e,c),Wt.add(rs)),s=Math.max(s,n.distanceToSquared(Wt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ke('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ke("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Ut(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[],c=new Uint8Array(n.count);for(let C=0;C<n.count;C++)a[C]=new L,l[C]=new L;let h=new L,d=new L,u=new L,f=new ne,p=new ne,y=new ne,_=new L,m=new L;function v(C,A,I){c[C]=c[A]=c[I]=1,h.fromBufferAttribute(n,C),d.fromBufferAttribute(n,A),u.fromBufferAttribute(n,I),f.fromBufferAttribute(r,C),p.fromBufferAttribute(r,A),y.fromBufferAttribute(r,I),d.sub(h),u.sub(h),p.sub(f),y.sub(f);let N=1/(p.x*y.y-y.x*p.y);isFinite(N)&&(_.copy(d).multiplyScalar(y.y).addScaledVector(u,-p.y).multiplyScalar(N),m.copy(u).multiplyScalar(p.x).addScaledVector(d,-y.x).multiplyScalar(N),a[C].add(_),a[A].add(_),a[I].add(_),l[C].add(m),l[A].add(m),l[I].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let C=0,A=b.length;C<A;++C){let I=b[C],N=I.start,O=I.count;for(let R=N,U=N+O;R<U;R+=3)v(e.getX(R+0),e.getX(R+1),e.getX(R+2))}let x=new L,T=new L,w=new L,g=new L;function M(C){w.fromBufferAttribute(s,C),g.copy(w);let A=a[C];x.copy(A),x.sub(w.multiplyScalar(w.dot(A))).normalize(),T.crossVectors(g,A);let N=T.dot(l[C])<0?-1:1;o.setXYZW(C,x.x,x.y,x.z,N)}for(let C=0,A=n.count;C<A;++C)c[C]&&M(C);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Ut(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let s=new L,r=new L,o=new L,a=new L,l=new L,c=new L,h=new L,d=new L;if(e)for(let u=0,f=e.count;u<f;u+=3){let p=e.getX(u+0),y=e.getX(u+1),_=e.getX(u+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,y),o.fromBufferAttribute(t,_),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,_),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(_,c.x,c.y,c.z)}else for(let u=0,f=t.count;u<f;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Wt.fromBufferAttribute(e,t),Wt.normalize(),e.setXYZ(t,Wt.x,Wt.y,Wt.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h),f=0,p=0;for(let y=0,_=l.length;y<_;y++){a.isInterleavedBufferAttribute?f=l[y]*a.data.stride+a.offset:f=l[y]*h;for(let m=0;m<h;m++)u[p++]=c[f++]}return new Ut(u,h,d)}if(this.index===null)return He("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let u=c[h],f=e(u,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let f=c[d];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},xr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=K1,this.updateRanges=[],this.version=0,this.uuid=oi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=hh(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[t]),s=new this.constructor(n,this.stride);return s.setUsage(this.usage),s}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=hh(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let n={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}};function hh(i){return i.buffer._uuid===void 0&&(i.buffer._uuid=oi()),i.byteOffset===0&&i.byteLength===i.buffer.byteLength?i.buffer._uuid:i.buffer._uuid+":"+i.byteOffset+":"+i.byteLength}var nn=new L,bs=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s,this._normalizationScale=e!==void 0?Tl(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix4(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.applyNormalMatrix(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.transformDirection(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){dr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Ut(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){dr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):tc(e,this.data.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):nc(e,this.data.array)}},p1=new L,lf=new L,cf=new Ye,pn=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=p1.subVectors(n,t).cross(lf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(p1),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||cf.getNormalMatrix(e),s=this.coplanarPoint(p1).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},hf=0,Mn=class extends Rn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:hf++}),this.uuid=oi(),this.name="",this.type="Material",this.blending=Ds,this.side=vi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=z1,this.blendDst=H1,this.blendEquation=zi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new me(0,0,0),this.blendAlpha=0,this.depthFunc=ms,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Qo,this.stencilZFail=Qo,this.stencilZPass=Qo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){He(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){He(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new me().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new pn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ne().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ne().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ss=class extends Mn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new me(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},os,$s=new L,as=new L,ls=new L,cs=new ne,Ks=new ne,vu=new Ke,Co=new L,js=new L,Po=new L,uh=new ne,m1=new ne,dh=new ne,yr=class extends St{constructor(e=new Ss){if(super(),this.isSprite=!0,this.type="Sprite",os===void 0){os=new dt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new xr(t,5);os.setIndex([0,1,2,0,2,3]),os.setAttribute("position",new bs(n,3,0,!1)),os.setAttribute("uv",new bs(n,2,3,!1))}this.geometry=os,this.material=e,this.center=new ne(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&ke('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),as.setFromMatrixScale(this.matrixWorld),vu.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ls.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&as.multiplyScalar(-ls.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;Io(Co.set(-.5,-.5,0),ls,o,as,s,r),Io(js.set(.5,-.5,0),ls,o,as,s,r),Io(Po.set(.5,.5,0),ls,o,as,s,r),uh.set(0,0),m1.set(1,0),dh.set(1,1);let a=e.ray.intersectTriangle(Co,js,Po,!1,$s);if(a===null&&(Io(js.set(-.5,.5,0),ls,o,as,s,r),m1.set(0,1),a=e.ray.intersectTriangle(Co,Po,js,!1,$s),a===null))return;let l=e.ray.origin.distanceTo($s);l<e.near||l>e.far||t.push({distance:l,point:$s.clone(),uv:Jn.getInterpolation($s,Co,js,Po,uh,m1,dh,new ne),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}toJSON(e){let t=super.toJSON(e);return t.object.center=this.center.toArray(),t}};function Io(i,e,t,n,s,r){cs.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Ks.x=r*cs.x-s*cs.y,Ks.y=s*cs.x+r*cs.y):Ks.copy(cs),i.copy(e),i.x+=Ks.x,i.y+=Ks.y,i.applyMatrix4(vu)}var Zn=new L,g1=new L,Lo=new L,Do=new L,jn=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Zn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Zn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Zn.copy(this.origin).addScaledVector(this.direction,t),Zn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){g1.copy(e).add(t).multiplyScalar(.5),Lo.copy(t).sub(e).normalize(),Do.copy(this.origin).sub(g1);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Lo),a=Do.dot(this.direction),l=-Do.dot(Lo),c=Do.lengthSq(),h=Math.abs(1-o*o),d,u,f,p;if(h>0)if(d=o*l-a,u=o*a-l,p=r*h,d>=0)if(u>=-p)if(u<=p){let y=1/h;d*=y,u*=y,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-p?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=p?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(g1).addScaledVector(Lo,u),f}intersectSphere(e,t){if(e.radius<0)return null;Zn.subVectors(e.center,this.origin);let n=Zn.dot(this.direction),s=Zn.dot(Zn)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,o=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,o=(e.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(a=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Zn)!==null}intersectTriangle(e,t,n,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,d=e.x-o.x,u=e.y-o.y,f=e.z-o.z,p=t.x-o.x,y=t.y-o.y,_=t.z-o.z,m=n.x-o.x,v=n.y-o.y,b=n.z-o.z,x=Math.abs(l),T=Math.abs(c),w=Math.abs(h),g,M,C,A,I,N,O,R,U,H,z,V;if(x>=T&&x>=w?(C=l,N=d,U=p,V=m,l>=0?(g=c,M=h,A=u,I=f,O=y,R=_,H=v,z=b):(g=h,M=c,A=f,I=u,O=_,R=y,H=b,z=v)):T>=w?(C=c,N=u,U=y,V=v,c>=0?(g=h,M=l,A=f,I=d,O=_,R=p,H=b,z=m):(g=l,M=h,A=d,I=f,O=p,R=_,H=m,z=b)):(C=h,N=f,U=_,V=b,h>=0?(g=l,M=c,A=d,I=u,O=p,R=y,H=m,z=v):(g=c,M=l,A=u,I=d,O=y,R=p,H=v,z=m)),C===0)return null;let G=g/C,K=M/C,W=1/C,oe=A-G*N,ue=I-K*N,Z=O-G*U,k=R-K*U,re=H-G*V,Se=z-K*V,ae=re*k-Se*Z,Re=oe*Se-ue*re,qe=Z*ue-k*oe;if(s){if(ae<0||Re<0||qe<0)return null}else if((ae<0||Re<0||qe<0)&&(ae>0||Re>0||qe>0))return null;let Ne=ae+Re+qe;if(Ne===0)return null;let Ge=W*(ae*N+Re*U+qe*V);return(Ne>0?Ge<0:Ge>0)?null:this.at(Ge/Ne,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ve=class extends Mn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.combine=Ba,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},fh=new Ke,Ii=new jn,No=new Fn,ph=new L,Uo=new L,Oo=new L,Fo=new L,_1=new L,Bo=new L,mh=new L,zo=new L,se=class extends St{constructor(e=new dt,t=new Ve){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Bo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(_1.fromBufferAttribute(d,e),o?Bo.addScaledVector(_1,h):Bo.addScaledVector(_1.sub(t),h))}t.add(Bo)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),No.copy(n.boundingSphere),No.applyMatrix4(r),Ii.copy(e.ray).recast(e.near),!(No.containsPoint(Ii.origin)===!1&&(Ii.intersectSphere(No,ph)===null||Ii.origin.distanceToSquared(ph)>(e.far-e.near)**2))&&(fh.copy(r).invert(),Ii.copy(e.ray).applyMatrix4(fh),!(n.boundingBox!==null&&Ii.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ii)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,y=u.length;p<y;p++){let _=u[p],m=o[_.materialIndex],v=Math.max(_.start,f.start),b=Math.min(a.count,Math.min(_.start+_.count,f.start+f.count));for(let x=v,T=b;x<T;x+=3){let w=a.getX(x),g=a.getX(x+1),M=a.getX(x+2);s=Ho(this,m,e,n,c,h,d,w,g,M),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=_.materialIndex,t.push(s))}}else{let p=Math.max(0,f.start),y=Math.min(a.count,f.start+f.count);for(let _=p,m=y;_<m;_+=3){let v=a.getX(_),b=a.getX(_+1),x=a.getX(_+2);s=Ho(this,o,e,n,c,h,d,v,b,x),s&&(s.faceIndex=Math.floor(_/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,y=u.length;p<y;p++){let _=u[p],m=o[_.materialIndex],v=Math.max(_.start,f.start),b=Math.min(l.count,Math.min(_.start+_.count,f.start+f.count));for(let x=v,T=b;x<T;x+=3){let w=x,g=x+1,M=x+2;s=Ho(this,m,e,n,c,h,d,w,g,M),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=_.materialIndex,t.push(s))}}else{let p=Math.max(0,f.start),y=Math.min(l.count,f.start+f.count);for(let _=p,m=y;_<m;_+=3){let v=_,b=_+1,x=_+2;s=Ho(this,o,e,n,c,h,d,v,b,x),s&&(s.faceIndex=Math.floor(_/3),t.push(s))}}}};function uf(i,e,t,n,s,r,o,a){let l;if(e.side===qt?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===vi,a),l===null)return null;zo.copy(a),zo.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(zo);return c<t.near||c>t.far?null:{distance:c,point:zo.clone(),object:i}}function Ho(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,Uo),i.getVertexPosition(l,Oo),i.getVertexPosition(c,Fo);let h=uf(i,e,t,n,Uo,Oo,Fo,mh);if(h){let d=new L;Jn.getBarycoord(mh,Uo,Oo,Fo,d),s&&(h.uv=Jn.getInterpolatedAttribute(s,a,l,c,d,new ne)),r&&(h.uv1=Jn.getInterpolatedAttribute(r,a,l,c,d,new ne)),o&&(h.normal=Jn.getInterpolatedAttribute(o,a,l,c,d,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new L,materialIndex:0};Jn.getNormal(Uo,Oo,Fo,u.normal),h.face=u,h.barycoord=d}return h}var vr=class extends on{constructor(e=null,t=1,n=1,s,r,o,a,l,c=Xt,h=Xt,d,u){super(null,o,a,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Es=class extends Ut{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},hs=new Ke,gh=new Ke,Go=[],_h=new On,df=new Ke,Qs=new se,er=new Fn,an=class extends se{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Es(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,df)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new On),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,hs),_h.copy(e.boundingBox).applyMatrix4(hs),this.boundingBox.union(_h)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Fn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,hs),er.copy(e.boundingSphere).applyMatrix4(hs),this.boundingSphere.union(er)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Qs.geometry=this.geometry,Qs.material=this.material,Qs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),er.copy(this.boundingSphere),er.applyMatrix4(n),e.ray.intersectsSphere(er)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,hs),gh.multiplyMatrices(n,hs),Qs.matrixWorld=gh,Qs.raycast(e,Go);for(let o=0,a=Go.length;o<a;o++){let l=Go[o];l.instanceId=r,l.object=this,t.push(l)}Go.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Es(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new vr(new Float32Array(s*this.count),s,this.count,Xa,bn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Li=new Fn,ff=new ne(.5,.5),ko=new L,pi=class{constructor(e=new pn,t=new pn,n=new pn,s=new pn,r=new pn,o=new pn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=vn,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],p=r[8],y=r[9],_=r[10],m=r[11],v=r[12],b=r[13],x=r[14],T=r[15];if(s[0].setComponents(c-o,f-h,m-p,T-v).normalize(),s[1].setComponents(c+o,f+h,m+p,T+v).normalize(),s[2].setComponents(c+a,f+d,m+y,T+b).normalize(),s[3].setComponents(c-a,f-d,m-y,T-b).normalize(),n)s[4].setComponents(l,u,_,x).normalize(),s[5].setComponents(c-l,f-u,m-_,T-x).normalize();else if(s[4].setComponents(c-l,f-u,m-_,T-x).normalize(),t===vn)s[5].setComponents(c+l,f+u,m+_,T+x).normalize();else if(t===gs)s[5].setComponents(l,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Li)}intersectsSprite(e){Li.center.set(0,0,0);let t=ff.distanceTo(e.center);return Li.radius=.7071067811865476+t,Li.applyMatrix4(e.matrixWorld),this.intersectsSphere(Li)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(ko.x=s.normal.x>0?e.max.x:e.min.x,ko.y=s.normal.y>0?e.max.y:e.min.y,ko.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ko)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},xh=new Ke,fa=class i{constructor(){this.coordinateSystem=vn,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let s=0;s<t.length;s++){let r=t[s];xh.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[s]===void 0&&(n[s]=new pi),n[s].setFromProjectionMatrix(xh,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new pi),t[s].copy(n[s]);return this._count=e._count,this}clone(){return new i().copy(this)}};var Ts=class extends Mn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new me(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},pa=new L,ma=new L,yh=new Ke,tr=new jn,Vo=new Fn,x1=new L,vh=new L,Ni=class extends St{constructor(e=new dt,t=new Ts){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)pa.fromBufferAttribute(t,s-1),ma.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=pa.distanceTo(ma);e.setAttribute("lineDistance",new Qe(n,1))}else He("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Vo.copy(n.boundingSphere),Vo.applyMatrix4(s),Vo.radius+=r,e.ray.intersectsSphere(Vo)===!1)return;yh.copy(s).invert(),tr.copy(e.ray).applyMatrix4(yh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let y=f,_=p-1;y<_;y+=c){let m=h.getX(y),v=h.getX(y+1),b=Wo(this,e,tr,l,m,v,y);b&&t.push(b)}if(this.isLineLoop){let y=h.getX(p-1),_=h.getX(f),m=Wo(this,e,tr,l,y,_,p-1);m&&t.push(m)}}else{let f=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let y=f,_=p-1;y<_;y+=c){let m=Wo(this,e,tr,l,y,y+1,y);m&&t.push(m)}if(this.isLineLoop){let y=Wo(this,e,tr,l,p-1,f,p-1);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Wo(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(pa.fromBufferAttribute(a,s),ma.fromBufferAttribute(a,r),t.distanceSqToSegment(pa,ma,x1,vh)>n)return;x1.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(x1);if(!(c<e.near||c>e.far))return{distance:c,point:vh.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var Bn=class extends Mn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new me(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Mh=new Ke,A1=new jn,Xo=new Fn,Yo=new L,Qn=class extends St{constructor(e=new dt,t=new Bn){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Xo.copy(n.boundingSphere),Xo.applyMatrix4(s),Xo.radius+=r,e.ray.intersectsSphere(Xo)===!1)return;Mh.copy(s).invert(),A1.copy(e.ray).applyMatrix4(Mh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){let u=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let p=u,y=f;p<y;p++){let _=c.getX(p);Yo.fromBufferAttribute(d,_),bh(Yo,_,l,s,e,t,this)}}else{let u=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let p=u,y=f;p<y;p++)Yo.fromBufferAttribute(d,p),bh(Yo,p,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function bh(i,e,t,n,s,r,o){let a=A1.distanceSqToPoint(i);if(a<t){let l=new L;A1.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Mr=class extends on{constructor(e=[],t=Gi,n,s,r,o,a,l,c,h){super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},br=class extends on{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var ei=class extends on{constructor(e,t,n=Cn,s,r,o,a=Xt,l=Xt,c,h=Kn,d=1){if(h!==Kn&&h!==si)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:e,height:t,depth:d};super(u,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ys(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Sr=class extends ei{constructor(e,t=Cn,n=Gi,s,r,o=Xt,a=Xt,l,c=Kn){let h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,s,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Er=class extends on{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Fe=class i extends dt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],u=0,f=0;p("z","y","x",-1,-1,n,t,e,o,r,0),p("z","y","x",1,-1,n,t,-e,o,r,1),p("x","z","y",1,1,e,n,t,s,o,2),p("x","z","y",1,-1,e,n,-t,s,o,3),p("x","y","z",1,-1,e,t,n,s,r,4),p("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Qe(c,3)),this.setAttribute("normal",new Qe(h,3)),this.setAttribute("uv",new Qe(d,2));function p(y,_,m,v,b,x,T,w,g,M,C){let A=x/g,I=T/M,N=x/2,O=T/2,R=w/2,U=g+1,H=M+1,z=0,V=0,G=new L;for(let K=0;K<H;K++){let W=K*I-O;for(let oe=0;oe<U;oe++){let ue=oe*A-N;G[y]=ue*v,G[_]=W*b,G[m]=R,c.push(G.x,G.y,G.z),G[y]=0,G[_]=0,G[m]=w>0?1:-1,h.push(G.x,G.y,G.z),d.push(oe/g),d.push(1-K/M),z+=1}}for(let K=0;K<M;K++)for(let W=0;W<g;W++){let oe=u+W+U*K,ue=u+W+U*(K+1),Z=u+(W+1)+U*(K+1),k=u+(W+1)+U*K;l.push(oe,ue,k),l.push(ue,Z,k),V+=6}a.addGroup(f,V,C),f+=V,u+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},Tr=class i extends dt{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=t/2,d=Math.PI/2*e,u=t,f=2*d+u,p=n*2+r,y=s+1,_=new L,m=new L;for(let v=0;v<=p;v++){let b=0,x=0,T=0,w=0;if(v<=n){let C=v/n,A=C*Math.PI/2;x=-h-e*Math.cos(A),T=e*Math.sin(A),w=-e*Math.cos(A),b=C*d}else if(v<=n+r){let C=(v-n)/r;x=-h+C*t,T=e,w=0,b=d+C*u}else{let C=(v-n-r)/n,A=C*Math.PI/2;x=h+e*Math.sin(A),T=e*Math.cos(A),w=e*Math.sin(A),b=d+u+C*d}let g=Math.max(0,Math.min(1,b/f)),M=0;v===0?M=.5/s:v===p&&(M=-.5/s);for(let C=0;C<=s;C++){let A=C/s,I=A*Math.PI*2,N=Math.sin(I),O=Math.cos(I);m.x=-T*O,m.y=x,m.z=T*N,a.push(m.x,m.y,m.z),_.set(-T*O,w,T*N),_.normalize(),l.push(_.x,_.y,_.z),c.push(A+M,g)}if(v>0){let C=(v-1)*y;for(let A=0;A<s;A++){let I=C+A,N=C+A+1,O=v*y+A,R=v*y+A+1;o.push(I,N,O),o.push(N,R,O)}}}this.setIndex(o),this.setAttribute("position",new Qe(a,3)),this.setAttribute("normal",new Qe(l,3)),this.setAttribute("uv",new Qe(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},wr=class i extends dt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],l=[],c=new L,h=new ne;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){let f=n+d/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[u]/e+1)/2,h.y=(o[u+1]/e+1)/2,l.push(h.x,h.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new Qe(o,3)),this.setAttribute("normal",new Qe(a,3)),this.setAttribute("uv",new Qe(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Mt=class i extends dt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],u=[],f=[],p=0,y=[],_=n/2,m=0;v(),o===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new Qe(d,3)),this.setAttribute("normal",new Qe(u,3)),this.setAttribute("uv",new Qe(f,2));function v(){let x=new L,T=new L,w=0,g=(t-e)/n;for(let M=0;M<=r;M++){let C=[],A=M/r,I=A*(t-e)+e;for(let N=0;N<=s;N++){let O=N/s,R=O*l+a,U=Math.sin(R),H=Math.cos(R);T.x=I*U,T.y=-A*n+_,T.z=I*H,d.push(T.x,T.y,T.z),x.set(U,g,H).normalize(),u.push(x.x,x.y,x.z),f.push(O,1-A),C.push(p++)}y.push(C)}for(let M=0;M<s;M++)for(let C=0;C<r;C++){let A=y[C][M],I=y[C+1][M],N=y[C+1][M+1],O=y[C][M+1];(e>0||C!==0)&&(h.push(A,I,O),w+=3),(t>0||C!==r-1)&&(h.push(I,N,O),w+=3)}c.addGroup(m,w,0),m+=w}function b(x){let T=p,w=new ne,g=new L,M=0,C=x===!0?e:t,A=x===!0?1:-1;for(let N=1;N<=s;N++)d.push(0,_*A,0),u.push(0,A,0),f.push(.5,.5),p++;let I=p;for(let N=0;N<=s;N++){let R=N/s*l+a,U=Math.cos(R),H=Math.sin(R);g.x=C*H,g.y=_*A,g.z=C*U,d.push(g.x,g.y,g.z),u.push(0,A,0),w.x=U*.5+.5,w.y=H*.5*A+.5,f.push(w.x,w.y),p++}for(let N=0;N<s;N++){let O=T+N,R=I+N;x===!0?h.push(R,R+1,O):h.push(R+1,R,O),M+=3}c.addGroup(m,M,x===!0?1:2),m+=M}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var ga=class i extends dt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new Qe(r,3)),this.setAttribute("normal",new Qe(r.slice(),3)),this.setAttribute("uv",new Qe(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(v){let b=new L,x=new L,T=new L;for(let w=0;w<t.length;w+=3)f(t[w+0],b),f(t[w+1],x),f(t[w+2],T),l(b,x,T,v)}function l(v,b,x,T){let w=T+1,g=[];for(let M=0;M<=w;M++){g[M]=[];let C=v.clone().lerp(x,M/w),A=b.clone().lerp(x,M/w),I=w-M;for(let N=0;N<=I;N++)N===0&&M===w?g[M][N]=C:g[M][N]=C.clone().lerp(A,N/I)}for(let M=0;M<w;M++)for(let C=0;C<2*(w-M)-1;C++){let A=Math.floor(C/2);C%2===0?(u(g[M][A+1]),u(g[M+1][A]),u(g[M][A])):(u(g[M][A+1]),u(g[M+1][A+1]),u(g[M+1][A]))}}function c(v){let b=new L;for(let x=0;x<r.length;x+=3)b.x=r[x+0],b.y=r[x+1],b.z=r[x+2],b.normalize().multiplyScalar(v),r[x+0]=b.x,r[x+1]=b.y,r[x+2]=b.z}function h(){let v=new L;for(let b=0;b<r.length;b+=3){v.x=r[b+0],v.y=r[b+1],v.z=r[b+2];let x=_(v)/2/Math.PI+.5,T=m(v)/Math.PI+.5;o.push(x,1-T)}p(),d()}function d(){for(let v=0;v<o.length;v+=6){let b=o[v+0],x=o[v+2],T=o[v+4],w=Math.max(b,x,T),g=Math.min(b,x,T);w>.9&&g<.1&&(b<.2&&(o[v+0]+=1),x<.2&&(o[v+2]+=1),T<.2&&(o[v+4]+=1))}}function u(v){r.push(v.x,v.y,v.z)}function f(v,b){let x=v*3;b.x=e[x+0],b.y=e[x+1],b.z=e[x+2]}function p(){let v=new L,b=new L,x=new L,T=new L,w=new ne,g=new ne,M=new ne;for(let C=0,A=0;C<r.length;C+=9,A+=6){v.set(r[C+0],r[C+1],r[C+2]),b.set(r[C+3],r[C+4],r[C+5]),x.set(r[C+6],r[C+7],r[C+8]),w.set(o[A+0],o[A+1]),g.set(o[A+2],o[A+3]),M.set(o[A+4],o[A+5]),T.copy(v).add(b).add(x).divideScalar(3);let I=_(T);y(w,A+0,v,I),y(g,A+2,b,I),y(M,A+4,x,I)}}function y(v,b,x,T){T<0&&v.x===1&&(o[b]=v.x-1),x.x===0&&x.z===0&&(o[b]=T/2/Math.PI+.5)}function _(v){return Math.atan2(v.z,-v.x)}function m(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var gn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){He("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],u=n[s+1]-h,f=(o-h)/u;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new ne:new L);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new L,s=[],r=[],o=[],a=new L,l=new Ke;for(let f=0;f<=e;f++){let p=f/e;s[f]=this.getTangentAt(p,new L)}r[0]=new L,o[0]=new L;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let p=Math.acos(nt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(nt(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let p=1;p<=e;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],f*p)),o[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}},ws=class extends gn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new ne){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},_a=class extends ws{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function ic(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,d){let u=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+d)+(l-a)/d;u*=h,f*=h,s(o,a,u,f)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var Sh=new L,Eh=new L,y1=new ic,v1=new ic,M1=new ic,xa=class extends gn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new L){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Eh.subVectors(s[0],s[1]).add(s[0]),c=Eh);let d=s[a%r],u=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Sh.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Sh),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,p=Math.pow(c.distanceToSquared(d),f),y=Math.pow(d.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(h),f);y<1e-4&&(y=1),p<1e-4&&(p=y),_<1e-4&&(_=y),y1.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,p,y,_),v1.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,p,y,_),M1.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,p,y,_)}else this.curveType==="catmullrom"&&(y1.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),v1.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),M1.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(y1.calc(l),v1.calc(l),M1.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Th(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function pf(i,e){let t=1-i;return t*t*e}function mf(i,e){return 2*(1-i)*i*e}function gf(i,e){return i*i*e}function or(i,e,t,n){return pf(i,e)+mf(i,t)+gf(i,n)}function _f(i,e){let t=1-i;return t*t*t*e}function xf(i,e){let t=1-i;return 3*t*t*i*e}function yf(i,e){return 3*(1-i)*i*i*e}function vf(i,e){return i*i*i*e}function ar(i,e,t,n,s){return _f(i,e)+xf(i,t)+yf(i,n)+vf(i,s)}var Ar=class extends gn{constructor(e=new ne,t=new ne,n=new ne,s=new ne){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ne){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ar(e,s.x,r.x,o.x,a.x),ar(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ya=class extends gn{constructor(e=new L,t=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new L){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ar(e,s.x,r.x,o.x,a.x),ar(e,s.y,r.y,o.y,a.y),ar(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Rr=class extends gn{constructor(e=new ne,t=new ne){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ne){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ne){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},va=class extends gn{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Cr=class extends gn{constructor(e=new ne,t=new ne,n=new ne){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ne){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(or(e,s.x,r.x,o.x),or(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},As=class extends gn{constructor(e=new L,t=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new L){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(or(e,s.x,r.x,o.x),or(e,s.y,r.y,o.y),or(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Pr=class extends gn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ne){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return n.set(Th(a,l.x,c.x,h.x,d.x),Th(a,l.y,c.y,h.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new ne().fromArray(s))}return this}},R1=Object.freeze({__proto__:null,ArcCurve:_a,CatmullRomCurve3:xa,CubicBezierCurve:Ar,CubicBezierCurve3:ya,EllipseCurve:ws,LineCurve:Rr,LineCurve3:va,QuadraticBezierCurve:Cr,QuadraticBezierCurve3:As,SplineCurve:Pr}),Ma=class extends gn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new R1[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new R1[s.type]().fromJSON(s))}return this.cacheLengths=null,this}},Ir=class extends Ma{constructor(e){super(),this.type="Path",this.currentPoint=new ne,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Rr(this.currentPoint.clone(),new ne(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Cr(this.currentPoint.clone(),new ne(e,t),new ne(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new Ar(this.currentPoint.clone(),new ne(e,t),new ne(n,s),new ne(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Pr(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new ws(e,t,n,s,r,o,a,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},zn=class extends Ir{constructor(e){super(e),this.uuid=oi(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new Ir().fromJSON(s))}return this}};function Mf(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Mu(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=wf(i,e,r,t)),i.length>80*t){a=i[0],l=i[1];let h=a,d=l;for(let u=t;u<s;u+=t){let f=i[u],p=i[u+1];f<a&&(a=f),p<l&&(l=p),f>h&&(h=f),p>d&&(d=p)}c=Math.max(h-a,d-l),c=c!==0?32767/c:0}return Lr(r,o,t,a,l,c,0),o}function Mu(i,e,t,n,s){let r;if(s===Ff(i,e,t,n)>0)for(let o=e;o<t;o+=n)r=wh(o/n|0,i[o],i[o+1],r);else for(let o=t-n;o>=e;o-=n)r=wh(o/n|0,i[o],i[o+1],r);return r&&Rs(r,r.next)&&(Nr(r),r=r.next),r}function Ui(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Rs(t,t.next)||At(t.prev,t,t.next)===0)){if(Nr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Lr(i,e,t,n,s,r,o){if(!i)return;!o&&r&&If(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?Sf(i,n,s,r):bf(i)){e.push(l.i,i.i,c.i),Nr(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=Ef(Ui(i),e),Lr(i,e,t,n,s,r,2)):o===2&&Tf(i,e,t,n,s,r):Lr(Ui(i),e,t,n,s,r,1);break}}}function bf(i){let e=i.prev,t=i,n=i.next;if(At(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=Math.min(s,r,o),d=Math.min(a,l,c),u=Math.max(s,r,o),f=Math.max(a,l,c),p=n.next;for(;p!==e;){if(p.x>=h&&p.x<=u&&p.y>=d&&p.y<=f&&nr(s,a,r,l,o,c,p.x,p.y)&&At(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function Sf(i,e,t,n){let s=i.prev,r=i,o=i.next;if(At(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,d=r.y,u=o.y,f=Math.min(a,l,c),p=Math.min(h,d,u),y=Math.max(a,l,c),_=Math.max(h,d,u),m=C1(f,p,e,t,n),v=C1(y,_,e,t,n),b=i.prevZ,x=i.nextZ;for(;b&&b.z>=m&&x&&x.z<=v;){if(b.x>=f&&b.x<=y&&b.y>=p&&b.y<=_&&b!==s&&b!==o&&nr(a,h,l,d,c,u,b.x,b.y)&&At(b.prev,b,b.next)>=0||(b=b.prevZ,x.x>=f&&x.x<=y&&x.y>=p&&x.y<=_&&x!==s&&x!==o&&nr(a,h,l,d,c,u,x.x,x.y)&&At(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;b&&b.z>=m;){if(b.x>=f&&b.x<=y&&b.y>=p&&b.y<=_&&b!==s&&b!==o&&nr(a,h,l,d,c,u,b.x,b.y)&&At(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;x&&x.z<=v;){if(x.x>=f&&x.x<=y&&x.y>=p&&x.y<=_&&x!==s&&x!==o&&nr(a,h,l,d,c,u,x.x,x.y)&&At(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Ef(i,e){let t=i;do{let n=t.prev,s=t.next.next;!Rs(n,s)&&Su(n,t,t.next,s)&&Dr(n,s)&&Dr(s,n)&&(e.push(n.i,t.i,s.i),Nr(t),Nr(t.next),t=i=s),t=t.next}while(t!==i);return Ui(t)}function Tf(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Nf(o,a)){let l=Eu(o,a);o=Ui(o,o.next),l=Ui(l,l.next),Lr(o,e,t,n,s,r,0),Lr(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function wf(i,e,t,n){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=Mu(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Df(c))}s.sort(Af);for(let r=0;r<s.length;r++)t=Rf(s[r],t);return t}function Af(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Rf(i,e){let t=Cf(i,e);if(!t)return e;let n=Eu(t,i);return Ui(n,n.next),Ui(t,t.next)}function Cf(i,e){let t=e,n=i.x,s=i.y,r=-1/0,o;if(Rs(i,t))return t;do{if(Rs(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let d=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>r&&(r=d,o=t.x<t.next.x?t:t.next,d===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;t=o;do{if(n>=t.x&&t.x>=l&&n!==t.x&&bu(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let d=Math.abs(s-t.y)/(n-t.x);Dr(t,i)&&(d<h||d===h&&(t.x>o.x||t.x===o.x&&Pf(o,t)))&&(o=t,h=d)}t=t.next}while(t!==a);return o}function Pf(i,e){return At(i.prev,i,e.prev)<0&&At(e.next,i,i.next)<0}function If(i,e,t,n){let s=i;do s.z===0&&(s.z=C1(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Lf(s)}function Lf(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,t*=2}while(e>1);return i}function C1(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Df(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function bu(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function nr(i,e,t,n,s,r,o,a){return!(i===o&&e===a)&&bu(i,e,t,n,s,r,o,a)}function Nf(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Uf(i,e)&&(Dr(i,e)&&Dr(e,i)&&Of(i,e)&&(At(i.prev,i,e.prev)||At(i,e.prev,e))||Rs(i,e)&&At(i.prev,i,i.next)>0&&At(e.prev,e,e.next)>0)}function At(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Rs(i,e){return i.x===e.x&&i.y===e.y}function Su(i,e,t,n){let s=Zo(At(i,e,t)),r=Zo(At(i,e,n)),o=Zo(At(t,n,i)),a=Zo(At(t,n,e));return!!(s!==r&&o!==a||s===0&&qo(i,t,e)||r===0&&qo(i,n,e)||o===0&&qo(t,i,n)||a===0&&qo(t,e,n))}function qo(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Zo(i){return i>0?1:i<0?-1:0}function Uf(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Su(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Dr(i,e){return At(i.prev,i,i.next)<0?At(i,e,i.next)>=0&&At(i,i.prev,e)>=0:At(i,e,i.prev)<0||At(i,i.next,e)<0}function Of(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Eu(i,e){let t=P1(i.i,i.x,i.y),n=P1(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function wh(i,e,t,n){let s=P1(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Nr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function P1(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Ff(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var I1=class{static triangulate(e,t,n=2){return Mf(e,t,n)}},Di=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Ah(e),Rh(n,e);let o=e.length;t.forEach(Ah);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,Rh(n,t[l]);let a=I1.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Ah(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Rh(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var ti=class i extends dt{constructor(e=new zn([new ne(.5,.5),new ne(-.5,.5),new ne(-.5,-.5),new ne(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new Qe(s,3)),this.setAttribute("uv",new Qe(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1,u=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,p=t.bevelSize!==void 0?t.bevelSize:f-.1,y=t.bevelOffset!==void 0?t.bevelOffset:0,_=t.bevelSegments!==void 0?t.bevelSegments:3,m=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:Bf,b,x=!1,T,w,g,M;if(m){b=m.getSpacedPoints(h),x=!0,u=!1;let te=m.isCatmullRomCurve3?m.closed:!1;T=m.computeFrenetFrames(h,te),w=new L,g=new L,M=new L}u||(_=0,f=0,p=0,y=0);let C=a.extractPoints(c),A=C.shape,I=C.holes;if(!Di.isClockWise(A)){A=A.reverse();for(let te=0,ge=I.length;te<ge;te++){let de=I[te];Di.isClockWise(de)&&(I[te]=de.reverse())}}function O(te){let de=10000000000000001e-36,Ce=te[0];for(let Ee=1;Ee<=te.length;Ee++){let Je=Ee%te.length,Ue=te[Je],ot=Ue.x-Ce.x,lt=Ue.y-Ce.y,ft=ot*ot+lt*lt,B=Math.max(Math.abs(Ue.x),Math.abs(Ue.y),Math.abs(Ce.x),Math.abs(Ce.y)),Lt=de*B*B;if(ft<=Lt){te.splice(Je,1),Ee--;continue}Ce=Ue}}O(A),I.forEach(O);let R=I.length,U=A;for(let te=0;te<R;te++){let ge=I[te];A=A.concat(ge)}function H(te,ge,de){return ge||ke("ExtrudeGeometry: vec does not exist"),te.clone().addScaledVector(ge,de)}let z=A.length;function V(te,ge,de){let Ce,Ee,Je,Ue=te.x-ge.x,ot=te.y-ge.y,lt=de.x-te.x,ft=de.y-te.y,B=Ue*Ue+ot*ot,Lt=Ue*ft-ot*lt;if(Math.abs(Lt)>Number.EPSILON){let st=Math.sqrt(B),xt=Math.sqrt(lt*lt+ft*ft),ve=ge.x-ot/st,Pt=ge.y+Ue/st,ze=de.x-ft/xt,We=de.y+lt/xt,P=((ze-ve)*ft-(We-Pt)*lt)/(Ue*ft-ot*lt);Ce=ve+Ue*P-te.x,Ee=Pt+ot*P-te.y;let S=Ce*Ce+Ee*Ee;if(S<=2)return new ne(Ce,Ee);Je=Math.sqrt(S/2)}else{let st=!1;Ue>Number.EPSILON?lt>Number.EPSILON&&(st=!0):Ue<-Number.EPSILON?lt<-Number.EPSILON&&(st=!0):Math.sign(ot)===Math.sign(ft)&&(st=!0),st?(Ce=-ot,Ee=Ue,Je=Math.sqrt(B)):(Ce=Ue,Ee=ot,Je=Math.sqrt(B/2))}return new ne(Ce/Je,Ee/Je)}let G=[];for(let te=0,ge=U.length,de=ge-1,Ce=te+1;te<ge;te++,de++,Ce++)de===ge&&(de=0),Ce===ge&&(Ce=0),G[te]=V(U[te],U[de],U[Ce]);let K=[],W,oe=G.concat();for(let te=0,ge=R;te<ge;te++){let de=I[te];W=[];for(let Ce=0,Ee=de.length,Je=Ee-1,Ue=Ce+1;Ce<Ee;Ce++,Je++,Ue++)Je===Ee&&(Je=0),Ue===Ee&&(Ue=0),W[Ce]=V(de[Ce],de[Je],de[Ue]);K.push(W),oe=oe.concat(W)}let ue;if(_===0)ue=Di.triangulateShape(U,I);else{let te=[],ge=[];for(let de=0;de<_;de++){let Ce=de/_,Ee=f*Math.cos(Ce*Math.PI/2),Je=p*Math.sin(Ce*Math.PI/2)+y;for(let Ue=0,ot=U.length;Ue<ot;Ue++){let lt=H(U[Ue],G[Ue],Je);Re(lt.x,lt.y,-Ee),Ce===0&&te.push(lt)}for(let Ue=0,ot=R;Ue<ot;Ue++){let lt=I[Ue];W=K[Ue];let ft=[];for(let B=0,Lt=lt.length;B<Lt;B++){let st=H(lt[B],W[B],Je);Re(st.x,st.y,-Ee),Ce===0&&ft.push(st)}Ce===0&&ge.push(ft)}}ue=Di.triangulateShape(te,ge)}let Z=ue.length,k=p+y;for(let te=0;te<z;te++){let ge=u?H(A[te],oe[te],k):A[te];x?(g.copy(T.normals[0]).multiplyScalar(ge.x),w.copy(T.binormals[0]).multiplyScalar(ge.y),M.copy(b[0]).add(g).add(w),Re(M.x,M.y,M.z)):Re(ge.x,ge.y,0)}for(let te=1;te<=h;te++)for(let ge=0;ge<z;ge++){let de=u?H(A[ge],oe[ge],k):A[ge];x?(g.copy(T.normals[te]).multiplyScalar(de.x),w.copy(T.binormals[te]).multiplyScalar(de.y),M.copy(b[te]).add(g).add(w),Re(M.x,M.y,M.z)):Re(de.x,de.y,d/h*te)}for(let te=_-1;te>=0;te--){let ge=te/_,de=f*Math.cos(ge*Math.PI/2),Ce=p*Math.sin(ge*Math.PI/2)+y;for(let Ee=0,Je=U.length;Ee<Je;Ee++){let Ue=H(U[Ee],G[Ee],Ce);Re(Ue.x,Ue.y,d+de)}for(let Ee=0,Je=I.length;Ee<Je;Ee++){let Ue=I[Ee];W=K[Ee];for(let ot=0,lt=Ue.length;ot<lt;ot++){let ft=H(Ue[ot],W[ot],Ce);x?Re(ft.x,ft.y+b[h-1].y,b[h-1].x+de):Re(ft.x,ft.y,d+de)}}}re(),Se();function re(){let te=s.length/3;if(u){let ge=0,de=z*ge;for(let Ce=0;Ce<Z;Ce++){let Ee=ue[Ce];qe(Ee[2]+de,Ee[1]+de,Ee[0]+de)}ge=h+_*2,de=z*ge;for(let Ce=0;Ce<Z;Ce++){let Ee=ue[Ce];qe(Ee[0]+de,Ee[1]+de,Ee[2]+de)}}else{for(let ge=0;ge<Z;ge++){let de=ue[ge];qe(de[2],de[1],de[0])}for(let ge=0;ge<Z;ge++){let de=ue[ge];qe(de[0]+z*h,de[1]+z*h,de[2]+z*h)}}n.addGroup(te,s.length/3-te,0)}function Se(){let te=s.length/3,ge=0;ae(U,ge),ge+=U.length;for(let de=0,Ce=I.length;de<Ce;de++){let Ee=I[de];ae(Ee,ge),ge+=Ee.length}n.addGroup(te,s.length/3-te,1)}function ae(te,ge){let de=te.length;for(;--de>=0;){let Ce=de,Ee=de-1;Ee<0&&(Ee=te.length-1);for(let Je=0,Ue=h+_*2;Je<Ue;Je++){let ot=z*Je,lt=z*(Je+1),ft=ge+Ce+ot,B=ge+Ee+ot,Lt=ge+Ee+lt,st=ge+Ce+lt;Ne(ft,B,Lt,st)}}}function Re(te,ge,de){l.push(te),l.push(ge),l.push(de)}function qe(te,ge,de){Ge(te),Ge(ge),Ge(de);let Ce=s.length/3,Ee=v.generateTopUV(n,s,Ce-3,Ce-2,Ce-1);et(Ee[0]),et(Ee[1]),et(Ee[2])}function Ne(te,ge,de,Ce){Ge(te),Ge(ge),Ge(Ce),Ge(ge),Ge(de),Ge(Ce);let Ee=s.length/3,Je=v.generateSideWallUV(n,s,Ee-6,Ee-3,Ee-2,Ee-1);et(Je[0]),et(Je[1]),et(Je[3]),et(Je[1]),et(Je[2]),et(Je[3])}function Ge(te){s.push(l[te*3+0]),s.push(l[te*3+1]),s.push(l[te*3+2])}function et(te){r.push(te.x),r.push(te.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return zf(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new R1[s.type]().fromJSON(s)),new i(n,e.options)}},Bf={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new ne(r,o),new ne(a,l),new ne(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],d=e[n*3+2],u=e[s*3],f=e[s*3+1],p=e[s*3+2],y=e[r*3],_=e[r*3+1],m=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ne(o,1-l),new ne(c,1-d),new ne(u,1-p),new ne(y,1-m)]:[new ne(a,1-l),new ne(h,1-d),new ne(f,1-p),new ne(_,1-m)]}};function zf(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Oi=class i extends ga{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Fi=class i extends dt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=e/a,u=t/l,f=[],p=[],y=[],_=[];for(let m=0;m<h;m++){let v=m*u-o;for(let b=0;b<c;b++){let x=b*d-r;p.push(x,-v,0),y.push(0,0,1),_.push(b/a),_.push(1-m/l)}}for(let m=0;m<l;m++)for(let v=0;v<a;v++){let b=v+c*m,x=v+c*(m+1),T=v+1+c*(m+1),w=v+1+c*m;f.push(b,x,w),f.push(x,T,w)}this.setIndex(f),this.setAttribute("position",new Qe(p,3)),this.setAttribute("normal",new Qe(y,3)),this.setAttribute("uv",new Qe(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Rt=class i extends dt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],d=new L,u=new L,f=[],p=[],y=[],_=[];for(let m=0;m<=n;m++){let v=[],b=m/n,x=o+b*a,T=e*Math.cos(x),w=Math.sqrt(e*e-T*T),g=0;m===0&&o===0?g=.5/t:m===n&&l===Math.PI&&(g=-.5/t);for(let M=0;M<=t;M++){let C=M/t,A=s+C*r;d.x=-w*Math.cos(A),d.y=T,d.z=w*Math.sin(A),p.push(d.x,d.y,d.z),u.copy(d).normalize(),y.push(u.x,u.y,u.z),_.push(C+g,1-b),v.push(c++)}h.push(v)}for(let m=0;m<n;m++)for(let v=0;v<t;v++){let b=h[m][v+1],x=h[m][v],T=h[m+1][v],w=h[m+1][v+1];(m!==0||o>0)&&f.push(b,x,w),(m!==n-1||l<Math.PI)&&f.push(x,T,w)}this.setIndex(f),this.setAttribute("position",new Qe(p,3)),this.setAttribute("normal",new Qe(y,3)),this.setAttribute("uv",new Qe(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Bt=class i extends dt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],h=[],d=[],u=new L,f=new L,p=new L;for(let y=0;y<=n;y++){let _=o+y/n*a;for(let m=0;m<=s;m++){let v=m/s*r;f.x=(e+t*Math.cos(_))*Math.cos(v),f.y=(e+t*Math.cos(_))*Math.sin(v),f.z=t*Math.sin(_),c.push(f.x,f.y,f.z),u.x=e*Math.cos(v),u.y=e*Math.sin(v),p.subVectors(f,u).normalize(),h.push(p.x,p.y,p.z),d.push(m/s),d.push(y/n)}}for(let y=1;y<=n;y++)for(let _=1;_<=s;_++){let m=(s+1)*y+_-1,v=(s+1)*(y-1)+_-1,b=(s+1)*(y-1)+_,x=(s+1)*y+_;l.push(m,v,x),l.push(v,b,x)}this.setIndex(l),this.setAttribute("position",new Qe(c,3)),this.setAttribute("normal",new Qe(h,3)),this.setAttribute("uv",new Qe(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function Wi(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Ch(s))s.isRenderTargetTexture?(He("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Ch(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function en(i){let e={};for(let t=0;t<i.length;t++){let n=Wi(i[t]);for(let s in n)e[s]=n[s]}return e}function Ch(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Hf(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function sc(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:rt.workingColorSpace}var Sn={clone:Wi,merge:en},Gf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,kf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ct=class extends Mn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gf,this.fragmentShader=kf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Wi(e.uniforms),this.uniformsGroups=Hf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new me().setHex(s.value);break;case"v2":this.uniforms[n].value=new ne().fromArray(s.value);break;case"v3":this.uniforms[n].value=new L().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Et().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ye().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Ke().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Cs=class extends Ct{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},at=class extends Mn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ro,this.normalScale=new ne(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var Ur=class extends Mn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ro,this.normalScale=new ne(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.combine=Ba,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ba=class extends Mn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=au,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Sa=class extends Mn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function us(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Jo(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var mi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ea=class extends mi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:E1,endingEnd:E1}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case T1:r=e,a=2*t-n;break;case w1:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case T1:o=e,l=2*n-t;break;case w1:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,p=(n-t)/(s-t),y=p*p,_=y*p,m=-u*_+2*u*y-u*p,v=(1+u)*_+(-1.5-2*u)*y+(-.5+u)*p+1,b=(-1-f)*_+(1.5+f)*y+.5*p,x=f*_-f*y;for(let T=0;T!==a;++T)r[T]=m*o[h+T]+v*o[c+T]+b*o[l+T]+x*o[d+T];return r}},Ta=class extends mi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),d=1-h;for(let u=0;u!==a;++u)r[u]=o[c+u]*d+o[l+u]*h;return r}},wa=class extends mi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Aa=class extends mi{interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this.inTangents,d=this.outTangents;if(!h||!d){let p=(n-t)/(s-t),y=1-p;for(let _=0;_!==a;++_)r[_]=o[c+_]*y+o[l+_]*p;return r}let u=a*2,f=e-1;for(let p=0;p!==a;++p){let y=o[c+p],_=o[l+p],m=f*u+p*2,v=d[m],b=d[m+1],x=e*u+p*2,T=h[x],w=h[x+1],g=Wf(n,t,v,T,s);r[p]=Tu(g,y,b,w,_)}return r}};function Tu(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function Vf(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function Wf(i,e,t,n,s){let r=(i-e)/(s-e);for(let o=0;o<8;o++){let a=Tu(r,e,t,n,s)-i;if(Math.abs(a)<1e-10)break;let l=Vf(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var _n=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=us(t,this.TimeBufferType),this.values=us(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:us(e.times,Array),values:us(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),Jo(e.settings)&&(n.settings={inTangents:us(e.settings.inTangents,Array),outTangents:us(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new wa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ta(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ea(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Aa(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case lr:t=this.InterpolantFactoryMethodDiscrete;break;case ca:t=this.InterpolantFactoryMethodLinear;break;case jo:t=this.InterpolantFactoryMethodSmooth;break;case S1:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return He("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return lr;case this.InterpolantFactoryMethodLinear:return ca;case this.InterpolantFactoryMethodSmooth:return jo;case this.InterpolantFactoryMethodBezier:return S1}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e;Jo(this.settings)&&(Ph(this.settings.inTangents,e),Ph(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;Jo(this.settings)&&(Ih(this.settings.inTangents,e),Ih(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(ke("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(ke("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){ke("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){ke("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&L2(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){ke("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===jo,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let d=a*n,u=d-n,f=d+n;for(let p=0;p!==n;++p){let y=t[d+p];if(y!==t[u+p]||y!==t[f+p]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let d=a*n,u=o*n;for(let f=0;f!==n;++f)t[u+f]=t[d+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,Jo(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Ph(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]+=e}function Ih(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}_n.prototype.ValueTypeName="";_n.prototype.TimeBufferType=Float32Array;_n.prototype.ValueBufferType=Float32Array;_n.prototype.DefaultInterpolation=ca;var gi=class extends _n{constructor(e,t,n){super(e,t,n)}};gi.prototype.ValueTypeName="bool";gi.prototype.ValueBufferType=Array;gi.prototype.DefaultInterpolation=lr;gi.prototype.InterpolantFactoryMethodLinear=void 0;gi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ra=class extends _n{constructor(e,t,n,s){super(e,t,n,s)}};Ra.prototype.ValueTypeName="color";var Ca=class extends _n{constructor(e,t,n,s){super(e,t,n,s)}};Ca.prototype.ValueTypeName="number";var Pa=class extends mi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)mn.slerpFlat(r,0,o,c-a,o,c,l);return r}},Or=class extends _n{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Pa(this.times,this.values,this.getValueSize(),e)}};Or.prototype.ValueTypeName="quaternion";Or.prototype.InterpolantFactoryMethodSmooth=void 0;var _i=class extends _n{constructor(e,t,n){super(e,t,n)}};_i.prototype.ValueTypeName="string";_i.prototype.ValueBufferType=Array;_i.prototype.DefaultInterpolation=lr;_i.prototype.InterpolantFactoryMethodLinear=void 0;_i.prototype.InterpolantFactoryMethodSmooth=void 0;var Ia=class extends _n{constructor(e,t,n,s){super(e,t,n,s)}};Ia.prototype.ValueTypeName="vector";var La=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let f=c[d],p=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},wu=new La,Da=class{constructor(e){this.manager=e!==void 0?e:wu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};Da.DEFAULT_MATERIAL_NAME="__DEFAULT";var Fr=class extends St{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new me(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Br=class extends Fr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(St.DEFAULT_UP),this.updateMatrix(),this.groundColor=new me(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},b1=new Ke,Lh=new L,Dh=new L,Na=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ne(512,512),this.mapType=cn,this.map=null,this.mapPass=null,this.matrix=new Ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new pi,this._frameExtents=new ne(1,1),this._viewportCount=1,this._viewports=[new Et(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Lh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Lh),Dh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Dh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){b1.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(b1,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===gs||e.reversedDepth?t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),t.multiply(b1)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},$o=new L,Ko=new mn,Dn=new L,zr=class extends St{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ke,this.projectionMatrix=new Ke,this.projectionMatrixInverse=new Ke,this.coordinateSystem=vn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose($o,Ko,Dn),Dn.x===1&&Dn.y===1&&Dn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose($o,Ko,Dn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose($o,Ko,Dn),Dn.x===1&&Dn.y===1&&Dn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose($o,Ko,Dn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},fi=new L,Nh=new ne,Uh=new ne,sn=class extends zr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=xs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(sr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return xs*2*Math.atan(Math.tan(sr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(fi.x,fi.y).multiplyScalar(-e/fi.z),fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(fi.x,fi.y).multiplyScalar(-e/fi.z)}getViewSize(e,t){return this.getViewBounds(e,Nh,Uh),t.subVectors(Uh,Nh)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(sr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var Bi=class extends zr{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},L1=class extends Na{constructor(){super(new Bi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Hr=class extends Fr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(St.DEFAULT_UP),this.updateMatrix(),this.target=new St,this.shadow=new L1}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var ds=-90,fs=1,Ps=class extends St{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new sn(ds,fs,e,t);s.layers=this.layers,this.add(s);let r=new sn(ds,fs,e,t);r.layers=this.layers,this.add(r);let o=new sn(ds,fs,e,t);o.layers=this.layers,this.add(o);let a=new sn(ds,fs,e,t);a.layers=this.layers,this.add(a);let l=new sn(ds,fs,e,t);l.layers=this.layers,this.add(l);let c=new sn(ds,fs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===vn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===gs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let _=!1;e.isWebGLRenderer===!0?_=e.state.buffers.depth.getReversed():_=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,s),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,3,s),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=y,e.setRenderTarget(n,5,s),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Ua=class extends sn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},Gr=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Xf.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Xf(){this._document.hidden===!1&&this.reset()}var rc="\\[\\]\\.:\\/",Yf=new RegExp("["+rc+"]","g"),oc="[^"+rc+"]",qf="[^"+rc.replace("\\.","")+"]",Zf=/((?:WC+[\/:])*)/.source.replace("WC",oc),Jf=/(WCOD+)?/.source.replace("WCOD",qf),$f=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",oc),Kf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",oc),jf=new RegExp("^"+Zf+Jf+$f+Kf+"$"),Qf=["material","materials","bones","map"],D1=class{constructor(e,t,n){let s=n||bt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},bt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Yf,"")}static parseTrackName(e){let t=jf.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Qf.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){He("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){ke("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){ke("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){ke("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){ke("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){ke("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;ke("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};bt.Composite=D1;bt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};bt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};bt.prototype.GetterByBindingType=[bt.prototype._getValue_direct,bt.prototype._getValue_array,bt.prototype._getValue_arrayElement,bt.prototype._getValue_toArray];bt.prototype.SetterByBindingTypeAndVersioning=[[bt.prototype._setValue_direct,bt.prototype._setValue_direct_setNeedsUpdate,bt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_array,bt.prototype._setValue_array_setNeedsUpdate,bt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_arrayElement,bt.prototype._setValue_arrayElement_setNeedsUpdate,bt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_fromArray,bt.prototype._setValue_fromArray_setNeedsUpdate,bt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var B8=new Float32Array(1);var Oh=new Ke,kr=class{constructor(e,t,n=0,s=1/0){this.ray=new jn(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new vs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):ke("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Oh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Oh),this}intersectObject(e,t=!0,n=[]){return N1(e,this,n,t),n.sort(Fh),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)N1(e[s],this,n,t);return n.sort(Fh),n}};function Fh(i,e){return i.distance-e.distance}function N1(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)N1(r[o],e,t,!0)}}var Vr=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,He("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}},Is=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=nt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(nt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var dc=class dc{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};dc.prototype.isMatrix2=!0;var U1=dc;var Wr=class extends Rn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function ac(i,e,t,n){let s=ep(n);switch(t){case Y1:return i*e;case Xa:return i*e/s.components*s.byteLength;case Ya:return i*e/s.components*s.byteLength;case Mi:return i*e*2/s.components*s.byteLength;case qa:return i*e*2/s.components*s.byteLength;case q1:return i*e*3/s.components*s.byteLength;case Pn:return i*e*4/s.components*s.byteLength;case Za:return i*e*4/s.components*s.byteLength;case Qr:case eo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case to:case no:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case $a:case ja:return Math.max(i,16)*Math.max(e,8)/4;case Ja:case Ka:return Math.max(i,8)*Math.max(e,8)/2;case Qa:case el:case nl:case il:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case tl:case io:case sl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case rl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ol:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case al:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ll:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case cl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case hl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ul:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case dl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case fl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case pl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case ml:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case gl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case _l:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case xl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case yl:case vl:case Ml:return Math.ceil(i/4)*Math.ceil(e/4)*16;case bl:case Sl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case so:case El:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function ep(i){switch(i){case cn:case k1:return{byteLength:1,components:1};case Us:case V1:case Zt:return{byteLength:2,components:1};case Va:case Wa:return{byteLength:2,components:4};case Cn:case ka:case bn:return{byteLength:4,components:1};case W1:case X1:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window!="undefined"&&(window.__THREE__?He("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function Zu(){let i=null,e=!1,t=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),t(r,o)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function rp(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array!="undefined"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){let h=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,p)=>f.start-p.start);let u=0;for(let f=1;f<d.length;f++){let p=d[u],y=d[f];y.start<=p.start+p.count+1?p.count=Math.max(p.count,y.start+y.count-p.start):(++u,d[u]=y)}d.length=u+1;for(let f=0,p=d.length;f<p;f++){let y=d[f];i.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var op=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ap=`#ifdef USE_ALPHAHASH
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
#endif`,lp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,up=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,dp=`#ifdef USE_AOMAP
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
#endif`,fp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,pp=`#ifdef USE_BATCHING
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
#endif`,mp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,gp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_p=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,xp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,yp=`#ifdef USE_IRIDESCENCE
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
#endif`,vp=`#ifdef USE_BUMPMAP
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
#endif`,Mp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,bp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Sp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ep=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Tp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,wp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Ap=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Rp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Cp=`#define PI 3.141592653589793
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
} // validated`,Pp=`vec3 transformedNormal = objectNormal;
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
#endif`,Ip=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Lp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Dp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Np=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Up="gl_FragColor = linearToOutputTexel( gl_FragColor );",Op=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Fp=`#ifdef USE_ENVMAP
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
#endif`,Bp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,zp=`#ifdef USE_ENVMAP
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
#endif`,Hp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gp=`#ifdef USE_ENVMAP
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
#endif`,kp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Vp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Wp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Xp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Yp=`#ifdef USE_GRADIENTMAP
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
}`,qp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Zp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Jp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$p=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Kp=`#ifdef USE_ENVMAP
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
#endif`,jp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Qp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,e3=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,t3=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,n3=`PhysicalMaterial material;
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
#endif`,i3=`uniform sampler2D dfgLUT;
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
}`,s3=`
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
#endif`,r3=`#if defined( RE_IndirectDiffuse )
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
#endif`,o3=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,a3=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,l3=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,c3=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,h3=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,u3=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,d3=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,f3=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,p3=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,m3=`#if defined( USE_POINTS_UV )
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
#endif`,g3=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_3=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,x3=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,y3=`#if defined( USE_MORPHCOLORS )
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
#endif`,v3=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,M3=`#ifdef USE_MORPHTARGETS
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
#endif`,b3=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,S3=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,E3=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,T3=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,w3=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,A3=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,R3=`#ifdef USE_NORMALMAP
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
#endif`,C3=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,P3=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,I3=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,L3=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,D3=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,N3=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,U3=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,O3=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,F3=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,B3=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,z3=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,H3=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,G3=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,k3=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,V3=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,W3=`float getShadowMask() {
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
}`,X3=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Y3=`#ifdef USE_SKINNING
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
#endif`,q3=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Z3=`#ifdef USE_SKINNING
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
#endif`,J3=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$3=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,K3=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,j3=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Q3=`#ifdef USE_TRANSMISSION
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
#endif`,em=`#ifdef USE_TRANSMISSION
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
#endif`,tm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,nm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,im=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,rm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,om=`uniform sampler2D t2D;
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
}`,am=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lm=`uniform float backgroundBlurriness;
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
}`,cm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,um=`#include <common>
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
}`,dm=`#if DEPTH_PACKING == 3200
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
}`,fm=`#define DISTANCE
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
}`,pm=`#define DISTANCE
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
}`,mm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,gm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_m=`uniform float scale;
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
}`,xm=`uniform vec3 diffuse;
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
}`,ym=`#include <common>
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
}`,vm=`uniform vec3 diffuse;
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
}`,Mm=`#define LAMBERT
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
}`,bm=`#define LAMBERT
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
}`,Sm=`#define MATCAP
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
}`,Em=`#define MATCAP
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
}`,Tm=`#define NORMAL
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
}`,wm=`#define NORMAL
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
}`,Am=`#define PHONG
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
}`,Rm=`#define PHONG
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
}`,Cm=`#define STANDARD
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
}`,Pm=`#define STANDARD
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
}`,Im=`#define TOON
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
}`,Lm=`#define TOON
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
}`,Dm=`uniform float size;
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
}`,Nm=`uniform vec3 diffuse;
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
}`,Um=`#include <common>
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
}`,Om=`uniform vec3 color;
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
}`,Fm=`uniform float rotation;
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
}`,Bm=`uniform vec3 diffuse;
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
}`,it={alphahash_fragment:op,alphahash_pars_fragment:ap,alphamap_fragment:lp,alphamap_pars_fragment:cp,alphatest_fragment:hp,alphatest_pars_fragment:up,aomap_fragment:dp,aomap_pars_fragment:fp,batching_pars_vertex:pp,batching_vertex:mp,begin_vertex:gp,beginnormal_vertex:_p,bsdfs:xp,iridescence_fragment:yp,bumpmap_pars_fragment:vp,clipping_planes_fragment:Mp,clipping_planes_pars_fragment:bp,clipping_planes_pars_vertex:Sp,clipping_planes_vertex:Ep,color_fragment:Tp,color_pars_fragment:wp,color_pars_vertex:Ap,color_vertex:Rp,common:Cp,defaultnormal_vertex:Pp,displacementmap_pars_vertex:Ip,displacementmap_vertex:Lp,emissivemap_fragment:Dp,emissivemap_pars_fragment:Np,colorspace_fragment:Up,colorspace_pars_fragment:Op,envmap_fragment:Fp,envmap_common_pars_fragment:Bp,envmap_pars_fragment:zp,envmap_pars_vertex:Hp,envmap_physical_pars_fragment:Kp,envmap_vertex:Gp,fog_vertex:kp,fog_pars_vertex:Vp,fog_fragment:Wp,fog_pars_fragment:Xp,gradientmap_pars_fragment:Yp,lightmap_pars_fragment:qp,lights_lambert_fragment:Zp,lights_lambert_pars_fragment:Jp,lights_pars_begin:$p,lights_toon_fragment:jp,lights_toon_pars_fragment:Qp,lights_phong_fragment:e3,lights_phong_pars_fragment:t3,lights_physical_fragment:n3,lights_physical_pars_fragment:i3,lights_fragment_begin:s3,lights_fragment_maps:r3,lights_fragment_end:o3,lightprobes_pars_fragment:a3,logdepthbuf_fragment:l3,logdepthbuf_pars_fragment:c3,logdepthbuf_pars_vertex:h3,logdepthbuf_vertex:u3,map_fragment:d3,map_pars_fragment:f3,map_particle_fragment:p3,map_particle_pars_fragment:m3,metalnessmap_fragment:g3,metalnessmap_pars_fragment:_3,morphinstance_vertex:x3,morphcolor_vertex:y3,morphnormal_vertex:v3,morphtarget_pars_vertex:M3,morphtarget_vertex:b3,normal_fragment_begin:S3,normal_fragment_maps:E3,normal_pars_fragment:T3,normal_pars_vertex:w3,normal_vertex:A3,normalmap_pars_fragment:R3,clearcoat_normal_fragment_begin:C3,clearcoat_normal_fragment_maps:P3,clearcoat_pars_fragment:I3,iridescence_pars_fragment:L3,opaque_fragment:D3,packing:N3,premultiplied_alpha_fragment:U3,project_vertex:O3,dithering_fragment:F3,dithering_pars_fragment:B3,roughnessmap_fragment:z3,roughnessmap_pars_fragment:H3,shadowmap_pars_fragment:G3,shadowmap_pars_vertex:k3,shadowmap_vertex:V3,shadowmask_pars_fragment:W3,skinbase_vertex:X3,skinning_pars_vertex:Y3,skinning_vertex:q3,skinnormal_vertex:Z3,specularmap_fragment:J3,specularmap_pars_fragment:$3,tonemapping_fragment:K3,tonemapping_pars_fragment:j3,transmission_fragment:Q3,transmission_pars_fragment:em,uv_pars_fragment:tm,uv_pars_vertex:nm,uv_vertex:im,worldpos_vertex:sm,background_vert:rm,background_frag:om,backgroundCube_vert:am,backgroundCube_frag:lm,cube_vert:cm,cube_frag:hm,depth_vert:um,depth_frag:dm,distance_vert:fm,distance_frag:pm,equirect_vert:mm,equirect_frag:gm,linedashed_vert:_m,linedashed_frag:xm,meshbasic_vert:ym,meshbasic_frag:vm,meshlambert_vert:Mm,meshlambert_frag:bm,meshmatcap_vert:Sm,meshmatcap_frag:Em,meshnormal_vert:Tm,meshnormal_frag:wm,meshphong_vert:Am,meshphong_frag:Rm,meshphysical_vert:Cm,meshphysical_frag:Pm,meshtoon_vert:Im,meshtoon_frag:Lm,points_vert:Dm,points_frag:Nm,shadow_vert:Um,shadow_frag:Om,sprite_vert:Fm,sprite_frag:Bm},Te={common:{diffuse:{value:new me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new ne(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new me(16777215)},opacity:{value:1},center:{value:new ne(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},kn={basic:{uniforms:en([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.fog]),vertexShader:it.meshbasic_vert,fragmentShader:it.meshbasic_frag},lambert:{uniforms:en([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new me(0)},envMapIntensity:{value:1}}]),vertexShader:it.meshlambert_vert,fragmentShader:it.meshlambert_frag},phong:{uniforms:en([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new me(0)},specular:{value:new me(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:it.meshphong_vert,fragmentShader:it.meshphong_frag},standard:{uniforms:en([Te.common,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.roughnessmap,Te.metalnessmap,Te.fog,Te.lights,{emissive:{value:new me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag},toon:{uniforms:en([Te.common,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.gradientmap,Te.fog,Te.lights,{emissive:{value:new me(0)}}]),vertexShader:it.meshtoon_vert,fragmentShader:it.meshtoon_frag},matcap:{uniforms:en([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,{matcap:{value:null}}]),vertexShader:it.meshmatcap_vert,fragmentShader:it.meshmatcap_frag},points:{uniforms:en([Te.points,Te.fog]),vertexShader:it.points_vert,fragmentShader:it.points_frag},dashed:{uniforms:en([Te.common,Te.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:it.linedashed_vert,fragmentShader:it.linedashed_frag},depth:{uniforms:en([Te.common,Te.displacementmap]),vertexShader:it.depth_vert,fragmentShader:it.depth_frag},normal:{uniforms:en([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,{opacity:{value:1}}]),vertexShader:it.meshnormal_vert,fragmentShader:it.meshnormal_frag},sprite:{uniforms:en([Te.sprite,Te.fog]),vertexShader:it.sprite_vert,fragmentShader:it.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:it.background_vert,fragmentShader:it.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:it.backgroundCube_vert,fragmentShader:it.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:it.cube_vert,fragmentShader:it.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:it.equirect_vert,fragmentShader:it.equirect_frag},distance:{uniforms:en([Te.common,Te.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:it.distance_vert,fragmentShader:it.distance_frag},shadow:{uniforms:en([Te.lights,Te.fog,{color:{value:new me(0)},opacity:{value:1}}]),vertexShader:it.shadow_vert,fragmentShader:it.shadow_frag}};kn.physical={uniforms:en([kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new ne(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Ye},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new ne},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new me(0)},specularColor:{value:new me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new ne},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag};var Al={r:0,b:0,g:0},zm=new Ke,Ju=new Ye;Ju.set(-1,0,0,0,1,0,0,0,1);function Hm(i,e,t,n,s,r){let o=new me(0),a=s===!0?0:1,l,c,h=null,d=0,u=null;function f(v){let b=v.isScene===!0?v.background:null;if(b&&b.isTexture){let x=v.backgroundBlurriness>0;b=e.get(b,x)}return b}function p(v){let b=!1,x=f(v);x===null?_(o,a):x&&x.isColor&&(_(x,1),b=!0);let T=i.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||b)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function y(v,b){let x=f(b);x&&x.isCubeTexture?(c===void 0&&(c=new se(new Fe(1,1,1),new Ct({name:"BackgroundCubeMaterial",uniforms:Wi(kn.backgroundCube.uniforms),vertexShader:kn.backgroundCube.vertexShader,fragmentShader:kn.backgroundCube.fragmentShader,side:qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,w,g){this.matrixWorld.copyPosition(g.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(zm.makeRotationFromEuler(b.backgroundRotation)).transpose(),x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Ju),c.material.toneMapped=rt.getTransfer(x.colorSpace)!==pt,(h!==x||d!==x.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=x,d=x.version,u=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new se(new Fi(2,2),new Ct({name:"BackgroundMaterial",uniforms:Wi(kn.background.uniforms),vertexShader:kn.background.vertexShader,fragmentShader:kn.background.fragmentShader,side:vi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=rt.getTransfer(x.colorSpace)!==pt,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||d!==x.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=x,d=x.version,u=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function _(v,b){v.getRGB(Al,sc(i)),t.buffers.color.setClear(Al.r,Al.g,Al.b,b,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,b=1){o.set(v),a=b,_(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(v){a=v,_(o,a)},render:p,addToRenderList:y,dispose:m}}function Gm(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,o=!1;function a(I,N,O,R,U){let H=!1,z=d(I,R,O,N);r!==z&&(r=z,c(r.object)),H=f(I,R,O,U),H&&p(I,R,O,U),U!==null&&e.update(U,i.ELEMENT_ARRAY_BUFFER),(H||o)&&(o=!1,x(I,N,O,R),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(U).buffer))}function l(){return i.createVertexArray()}function c(I){return i.bindVertexArray(I)}function h(I){return i.deleteVertexArray(I)}function d(I,N,O,R){let U=R.wireframe===!0,H=n[N.id];H===void 0&&(H={},n[N.id]=H);let z=I.isInstancedMesh===!0?I.id:0,V=H[z];V===void 0&&(V={},H[z]=V);let G=V[O.id];G===void 0&&(G={},V[O.id]=G);let K=G[U];return K===void 0&&(K=u(l()),G[U]=K),K}function u(I){let N=[],O=[],R=[];for(let U=0;U<t;U++)N[U]=0,O[U]=0,R[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:O,attributeDivisors:R,object:I,attributes:{},index:null}}function f(I,N,O,R){let U=r.attributes,H=N.attributes,z=0,V=O.getAttributes();for(let G in V)if(V[G].location>=0){let W=U[G],oe=H[G];if(oe===void 0&&(G==="instanceMatrix"&&I.instanceMatrix&&(oe=I.instanceMatrix),G==="instanceColor"&&I.instanceColor&&(oe=I.instanceColor)),W===void 0||W.attribute!==oe||oe&&W.data!==oe.data)return!0;z++}return r.attributesNum!==z||r.index!==R}function p(I,N,O,R){let U={},H=N.attributes,z=0,V=O.getAttributes();for(let G in V)if(V[G].location>=0){let W=H[G];W===void 0&&(G==="instanceMatrix"&&I.instanceMatrix&&(W=I.instanceMatrix),G==="instanceColor"&&I.instanceColor&&(W=I.instanceColor));let oe={};oe.attribute=W,W&&W.data&&(oe.data=W.data),U[G]=oe,z++}r.attributes=U,r.attributesNum=z,r.index=R}function y(){let I=r.newAttributes;for(let N=0,O=I.length;N<O;N++)I[N]=0}function _(I){m(I,0)}function m(I,N){let O=r.newAttributes,R=r.enabledAttributes,U=r.attributeDivisors;O[I]=1,R[I]===0&&(i.enableVertexAttribArray(I),R[I]=1),U[I]!==N&&(i.vertexAttribDivisor(I,N),U[I]=N)}function v(){let I=r.newAttributes,N=r.enabledAttributes;for(let O=0,R=N.length;O<R;O++)N[O]!==I[O]&&(i.disableVertexAttribArray(O),N[O]=0)}function b(I,N,O,R,U,H,z){z===!0?i.vertexAttribIPointer(I,N,O,U,H):i.vertexAttribPointer(I,N,O,R,U,H)}function x(I,N,O,R){y();let U=R.attributes,H=O.getAttributes(),z=N.defaultAttributeValues;for(let V in H){let G=H[V];if(G.location>=0){let K=U[V];if(K===void 0&&(V==="instanceMatrix"&&I.instanceMatrix&&(K=I.instanceMatrix),V==="instanceColor"&&I.instanceColor&&(K=I.instanceColor)),K!==void 0){let W=K.normalized,oe=K.itemSize,ue=e.get(K);if(ue===void 0)continue;let Z=ue.buffer,k=ue.type,re=ue.bytesPerElement,Se=k===i.INT||k===i.UNSIGNED_INT||K.gpuType===ka;if(K.isInterleavedBufferAttribute){let ae=K.data,Re=ae.isInterleavedBuffer===!0?ae.stride:ae.itemSize,qe=K.offset;if(ae.isInstancedInterleavedBuffer||ae.isInstancedBufferAttribute){for(let Ne=0;Ne<G.locationSize;Ne++)m(G.location+Ne,ae.meshPerAttribute);I.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Ne=0;Ne<G.locationSize;Ne++)_(G.location+Ne);i.bindBuffer(i.ARRAY_BUFFER,Z);for(let Ne=0;Ne<G.locationSize;Ne++)b(G.location+Ne,oe/G.locationSize,k,W,Re*re,(qe+oe/G.locationSize*Ne)*re,Se)}else{if(K.isInstancedBufferAttribute){for(let ae=0;ae<G.locationSize;ae++)m(G.location+ae,K.meshPerAttribute);I.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let ae=0;ae<G.locationSize;ae++)_(G.location+ae);i.bindBuffer(i.ARRAY_BUFFER,Z);for(let ae=0;ae<G.locationSize;ae++)b(G.location+ae,oe/G.locationSize,k,W,oe*re,oe/G.locationSize*ae*re,Se)}}else if(z!==void 0){let W=z[V];if(W!==void 0)switch(W.length){case 2:i.vertexAttrib2fv(G.location,W);break;case 3:i.vertexAttrib3fv(G.location,W);break;case 4:i.vertexAttrib4fv(G.location,W);break;default:i.vertexAttrib1fv(G.location,W)}}}}v()}function T(){C();for(let I in n){let N=n[I];for(let O in N){let R=N[O];for(let U in R){let H=R[U];for(let z in H)h(H[z].object),delete H[z];delete R[U]}}delete n[I]}}function w(I){if(n[I.id]===void 0)return;let N=n[I.id];for(let O in N){let R=N[O];for(let U in R){let H=R[U];for(let z in H)h(H[z].object),delete H[z];delete R[U]}}delete n[I.id]}function g(I){for(let N in n){let O=n[N];for(let R in O){let U=O[R];if(U[I.id]===void 0)continue;let H=U[I.id];for(let z in H)h(H[z].object),delete H[z];delete U[I.id]}}}function M(I){for(let N in n){let O=n[N],R=I.isInstancedMesh===!0?I.id:0,U=O[R];if(U!==void 0){for(let H in U){let z=U[H];for(let V in z)h(z[V].object),delete z[V];delete U[H]}delete O[R],Object.keys(O).length===0&&delete n[N]}}}function C(){A(),o=!0,r!==s&&(r=s,c(r.object))}function A(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:A,dispose:T,releaseStatesOfGeometry:w,releaseStatesOfObject:M,releaseStatesOfProgram:g,initAttributes:y,enableAttribute:_,disableUnusedAttributes:v}}function km(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function o(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function a(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];t.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Vm(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let g=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(g.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(g){return!(g!==Pn&&n.convert(g)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(g){let M=g===Zt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(g!==cn&&g!==bn&&!M&&n.convert(g)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(g){if(g==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";g="mediump"}return g==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(He("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),u=t.logarithmicDepthBuffer===!0&&d===!1;t.reversedDepthBuffer===!0&&d===!1&&He("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&d===!0&&He("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=i.getParameter(i.MAX_SAMPLES),w=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:y,maxCubemapSize:_,maxAttributes:m,maxVertexUniforms:v,maxVaryings:b,maxFragmentUniforms:x,maxSamples:T,samples:w}}function Wm(i){let e=this,t=null,n=0,s=!1,r=!1,o=new pn,a=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){let p=d.clippingPlanes,y=d.clipIntersection,_=d.clipShadows,m=i.get(d);if(!s||p===null||p.length===0||r&&!_)r?h(null):c();else{let v=r?0:n,b=v*4,x=m.clippingState||null;l.value=x,x=h(p,u,b,f);for(let T=0;T!==b;++T)x[T]=t[T];m.clippingState=x,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,p){let y=d!==null?d.length:0,_=null;if(y!==0){if(_=l.value,p!==!0||_===null){let m=f+y*4,v=u.matrixWorldInverse;a.getNormalMatrix(v),(_===null||_.length<m)&&(_=new Float32Array(m));for(let b=0,x=f;b!==y;++b,x+=4)o.copy(d[b]).applyMatrix4(v,a),o.normal.toArray(_,x),_[x+3]=o.constant}l.value=_,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,_}}var lo=class extends Ft{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Mr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Fe(5,5,5),r=new Ct({name:"CubemapFromEquirect",uniforms:Wi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qt,blending:ni});r.uniforms.tEquirect.value=t;let o=new se(s,r),a=t.minFilter;return t.minFilter===ii&&(t.minFilter=rn),new Ps(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},Au=256,Xm=3,Ym=20,$u=256,Ku=16,qm=3,Zm=new L,Jm=new me,Cl=class i{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Ps(1,10,null),this._boxMesh=new se(new Fe(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=Zm}=r,l=this._renderer;this._setSize(o);let c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);let d=l.autoClear,u=l.autoClearColor,f=l.autoClearDepth,p=l.autoClearStencil,y=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,y===null&&(e.background=l.getClearColor(Jm));let _=new Ps(n,s,h);return _.position.copy(a),_.update(l,e),l.autoClear=d,l.autoClearColor=u,l.autoClearDepth=f,l.autoClearStencil=p,e.background=y,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Au,ec(e))}_fromTexture(e,t){e.mapping===Gi||e.mapping===Ns?this._setSize(e.image.length===0?Au:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=Ru(e,!1,!1),n=Math.log2(e)-Xm;for(let s=0;s<=n;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=Ru(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let s=this._boxMesh,r=this._cubeCamera;s.material=n,r.renderTarget=e,r.activeMipmapLevel=t;let o=e.width>>t;e.viewport.set(0,0,o,o),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===Gi||e.mapping===Ns?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pu()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Cu()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=$m(),this._integrationMaterial=Km());let t=this._cubeSize,n=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Ku);for(let o=0;o<=n;o++){let a=i.lodToRoughness(o,n);if(o>n-qm)r.roughness.value=a,this._renderCube(e,o,this._integrationMaterial);else{let l=a>0?Math.log2(t)+.5*Math.log2(6/($u*Math.pow(a,4)))+.5:0;s.roughness.value=a,s.lodBias.value=l,this._renderCube(e,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=jm());let n=this._blurMaterial,s=n.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,n),s.envMap.value=e.texture,this._renderCube(r,0,n)}};function Ru(i,e,t){return new lo(i,{minFilter:ii,generateMipmaps:e,type:Zt,colorSpace:cr,depthBuffer:t})}function co(i,e,t){return new Ct({name:i,uniforms:e,vertexShader:it.cube_vert,fragmentShader:t,side:qt,blending:ni,depthTest:!1,depthWrite:!1})}function $m(){return co("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${$u}u

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
	`)}function Km(){return co("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Ku}},`

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
	`)}function jm(){return co("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Ym}
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
	`)}function Cu(){return co("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function Pu(){return co("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Qm(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,f=!1){return u==null?null:f?o(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===za||f===Ha)if(e.has(u)){let p=e.get(u).texture;return a(p,u.mapping)}else{let p=u.image;if(p&&p.height>0){let y=new lo(p.height);return y.fromEquirectangularTexture(i,u),e.set(u,y),u.addEventListener("dispose",c),a(y.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture&&u.isPMREMTexture!==!0){let f=u.mapping,p=f===za||f===Ha,y=f===Gi||f===Ns;if(p||y){let _=t.get(u),m=_!==void 0?_.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return n===null&&(n=new Cl(i)),_=p?n.fromEquirectangular(u,_):n.fromCubemap(u,_),_.texture.pmremVersion=u.pmremVersion,t.set(u,_),_.texture;if(_!==void 0)return _.texture;{let v=u.image;return p&&v&&v.height>0||y&&v&&l(v)?(n===null&&(n=new Cl(i)),_=p?n.fromEquirectangular(u):n.fromCubemap(u),_.texture.pmremVersion=u.pmremVersion,t.set(u,_),u.addEventListener("dispose",h),_.texture):null}}}return u}function a(u,f){return f===za?u.mapping=Gi:f===Ha&&(u.mapping=Ns),u}function l(u){let f=0,p=6;for(let y=0;y<p;y++)u[y]!==void 0&&f++;return f===p}function c(u){let f=u.target;f.removeEventListener("dispose",c);let p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function e0(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&ir("WebGLRenderer: "+n+" extension not supported."),s}}}function t0(i,e,t,n){let s={},r=new WeakMap,o=new FinalizationRegistry(p=>delete s[p]);function a(p){l(p.target)}function l(p){p.index!==null&&e.remove(p.index);for(let _ in p.attributes)e.remove(p.attributes[_]);p.removeEventListener("dispose",a),delete s[p.id],o.unregister(p);let y=r.get(p);y&&(e.remove(y),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function c(p,y){return s[y.id]!==void 0||(y.addEventListener("dispose",a),s[y.id]=new WeakRef(y),o.register(y,y.id,y),t.memory.geometries++),y}function h(p){let y=p.attributes;for(let _ in y)e.update(y[_],i.ARRAY_BUFFER)}function d(p){let y=p.index,_=p.attributes.position,m=0;if(_===void 0)return;let v=y!==null?y.array.length:_.array.length/3-1,b=_.count>=65535?_r:gr,x=new b(Math.ceil(v/3)*6,1),T=x.array;if(y!==null){let g=y.array;m=y.version;for(let M=0,C=0;M<v;M+=3){let A=g[M+0],I=g[M+1],N=g[M+2];T[C++]=A,T[C++]=I,T[C++]=I,T[C++]=N,T[C++]=N,T[C++]=A}}else{m=_.version;for(let g=0,M=0;g<v;g+=3){let C=g+0,A=g+1,I=g+2;T[M++]=C,T[M++]=A,T[M++]=A,T[M++]=I,T[M++]=I,T[M++]=C}}x.version=m;let w=r.get(p);w&&e.remove(w),r.set(p,x)}function u(p){let y=r.get(p);if(y){let _=p.index;_!==null&&y.version<_.version&&d(p)}else d(p);return r.get(p)}function f(){for(let p in s){let y=s[p].deref();y!==void 0&&l(y)}}return{get:c,update:h,getWireframeAttribute:u,dispose:f}}function n0(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*o),t.update(u,n,1)}function c(d,u,f){f!==0&&(i.drawElementsInstanced(n,u,r,d*o,f),t.update(u,n,f))}function h(d,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let y=0;for(let _=0;_<f;_++)y+=u[_];t.update(y,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function i0(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:ke("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function s0(i,e,t){let n=new WeakMap,s=new Et;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(a);if(u===void 0||u.count!==d){let C=function(){g.dispose(),n.delete(a),a.removeEventListener("dispose",C)};u!==void 0&&u.texture.dispose();let f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,_=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],v=a.morphAttributes.color||[],b=0;f===!0&&(b=1),p===!0&&(b=2),y===!0&&(b=3);let x=a.attributes.position.count*b,T=1;x>e.maxTextureSize&&(T=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let w=new Float32Array(x*T*4*d),g=new fr(w,x,T,d);g.type=bn,g.needsUpdate=!0;let M=b*4;for(let A=0;A<d;A++){let I=_[A],N=m[A],O=v[A],R=x*T*4*A;for(let U=0;U<I.count;U++){let H=U*M;f===!0&&(s.fromBufferAttribute(I,U),w[R+H+0]=s.x,w[R+H+1]=s.y,w[R+H+2]=s.z,w[R+H+3]=0),p===!0&&(s.fromBufferAttribute(N,U),w[R+H+4]=s.x,w[R+H+5]=s.y,w[R+H+6]=s.z,w[R+H+7]=0),y===!0&&(s.fromBufferAttribute(O,U),w[R+H+8]=s.x,w[R+H+9]=s.y,w[R+H+10]=s.z,w[R+H+11]=O.itemSize===4?s.w:1)}}u={count:d,texture:g,size:new ne(x,T)},n.set(a,u),a.addEventListener("dispose",C)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let y=0;y<c.length;y++)f+=c[y];let p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function r0(i,e,t,n,s){let r=new WeakMap;function o(c){let h=s.render.frame,d=c.geometry,u=e.get(c,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:o,dispose:a}}var o0={[Yr]:"LINEAR_TONE_MAPPING",[qr]:"REINHARD_TONE_MAPPING",[Zr]:"CINEON_TONE_MAPPING",[Hi]:"ACES_FILMIC_TONE_MAPPING",[$r]:"AGX_TONE_MAPPING",[Kr]:"NEUTRAL_TONE_MAPPING",[Jr]:"CUSTOM_TONE_MAPPING"};function a0(i,e,t,n,s,r){let o=new Ft(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=null,h=new dt;h.setAttribute("position",new Qe([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new Qe([0,2,0,0,2,0],2));let d=new Cs({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new se(h,d),f=new Bi(-1,1,1,-1,0,1),p=null,y=null,_=!1,m,v=null,b=[],x=!1;this.setSize=function(T,w){o.setSize(T,w),a!==null&&a.setSize(T,w),l!==null&&l.setSize(T,w);for(let g=0;g<b.length;g++){let M=b[g];M.setSize&&M.setSize(T,w)}},this.setEffects=function(T){b=T,x=b.length>0&&b[0].isRenderPass===!0;let w=o.width,g=o.height;b.length>0&&a===null&&(a=new Ft(w,g,{type:Zt,depthBuffer:!1,stencilBuffer:!1}),l=new Ft(w,g,{type:Zt,depthBuffer:!1,stencilBuffer:!1}));let M=s===!0&&b.some(C=>C.needsDepthTexture===!0);M!==(o.depthTexture!==null)&&(M===!0&&c===null&&(c=new ei(w,g),r===!0&&(c.format=si,c.type=ki)),o.dispose(),o.depthTexture=M?c:null,o.resolveDepthBuffer=M,o.storeMultisampledDepthBuffer=M);for(let C=0;C<b.length;C++){let A=b[C];A.setSize&&A.setSize(w,g),M&&A.needsDepthTexture===!0&&A.setDepthTexture&&A.setDepthTexture(c)}},this.begin=function(T,w){if(_||T.toneMapping===Hn&&b.length===0)return!1;if(v=w,w!==null){let g=w.width,M=w.height;(o.width!==g||o.height!==M)&&this.setSize(g,M)}return x===!1&&T.setRenderTarget(o),m=T.toneMapping,T.toneMapping=Hn,!0},this.hasRenderPass=function(){return x},this.end=function(T,w){T.toneMapping=m,_=!0;let g=o,M=a;for(let C=0;C<b.length;C++){let A=b[C];A.enabled!==!1&&(A.render(T,M,g,w),A.needsSwap!==!1&&(g=M,M=M===a?l:a))}if(p!==T.outputColorSpace||y!==T.toneMapping){p=T.outputColorSpace,y=T.toneMapping,d.defines={},rt.getTransfer(p)===pt&&(d.defines.SRGB_TRANSFER="");let C=o0[y];C&&(d.defines[C]=""),d.needsUpdate=!0}d.uniforms.tDiffuse.value=g.texture,T.setRenderTarget(v),T.render(u,f),v=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),h.dispose(),d.dispose()}}var ju=new on,Qu=new ei(1,1),ed=new Sr(1),td=new fr,nd=new da,id=new Mr,Iu=[],Lu=[],Du=new Float32Array(16),Nu=new Float32Array(9),Uu=new Float32Array(4);function Fs(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Iu[s];if(r===void 0&&(r=new Float32Array(s),Iu[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function zt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ht(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Il(i,e){let t=Lu[e];t===void 0&&(t=new Int32Array(e),Lu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function l0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function c0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2fv(this.addr,e),Ht(t,e)}}function h0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(zt(t,e))return;i.uniform3fv(this.addr,e),Ht(t,e)}}function u0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4fv(this.addr,e),Ht(t,e)}}function d0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ht(t,e)}else{if(zt(t,n))return;Uu.set(n),i.uniformMatrix2fv(this.addr,!1,Uu),Ht(t,n)}}function f0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ht(t,e)}else{if(zt(t,n))return;Nu.set(n),i.uniformMatrix3fv(this.addr,!1,Nu),Ht(t,n)}}function p0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ht(t,e)}else{if(zt(t,n))return;Du.set(n),i.uniformMatrix4fv(this.addr,!1,Du),Ht(t,n)}}function m0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function g0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2iv(this.addr,e),Ht(t,e)}}function _0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(zt(t,e))return;i.uniform3iv(this.addr,e),Ht(t,e)}}function x0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4iv(this.addr,e),Ht(t,e)}}function y0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function v0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2uiv(this.addr,e),Ht(t,e)}}function M0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(zt(t,e))return;i.uniform3uiv(this.addr,e),Ht(t,e)}}function b0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4uiv(this.addr,e),Ht(t,e)}}function Ll(i){return i.version===0&&(i.compareFunction=$1,i.needsUpdate=!0),i}function S0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?r=Ll(Qu):r=ju,t.setTexture2D(e||r,s)}function E0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||nd,s)}function T0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_CUBE_SHADOW?r=Ll(ed):r=id,t.setTextureCube(e||r,s)}function w0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||td,s)}function A0(i){switch(i){case 5126:return l0;case 35664:return c0;case 35665:return h0;case 35666:return u0;case 35674:return d0;case 35675:return f0;case 35676:return p0;case 5124:case 35670:return m0;case 35667:case 35671:return g0;case 35668:case 35672:return _0;case 35669:case 35673:return x0;case 5125:return y0;case 36294:return v0;case 36295:return M0;case 36296:return b0;case 35678:case 36198:case 36298:case 36306:case 35682:return S0;case 35679:case 36299:case 36307:return E0;case 35680:case 36300:case 36308:case 36293:return T0;case 36289:case 36303:case 36311:case 36292:return w0}}function R0(i,e){i.uniform1fv(this.addr,e)}function C0(i,e){let t=Fs(e,this.size,2);i.uniform2fv(this.addr,t)}function P0(i,e){let t=Fs(e,this.size,3);i.uniform3fv(this.addr,t)}function I0(i,e){let t=Fs(e,this.size,4);i.uniform4fv(this.addr,t)}function L0(i,e){let t=Fs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function D0(i,e){let t=Fs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function N0(i,e){let t=Fs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function U0(i,e){i.uniform1iv(this.addr,e)}function O0(i,e){i.uniform2iv(this.addr,e)}function F0(i,e){i.uniform3iv(this.addr,e)}function B0(i,e){i.uniform4iv(this.addr,e)}function z0(i,e){i.uniform1uiv(this.addr,e)}function H0(i,e){i.uniform2uiv(this.addr,e)}function G0(i,e){i.uniform3uiv(this.addr,e)}function k0(i,e){i.uniform4uiv(this.addr,e)}function V0(i,e,t){let n=this.cache,s=e.length,r=Il(t,s);zt(n,r)||(i.uniform1iv(this.addr,r),Ht(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Ll(Qu):o=ju;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function W0(i,e,t){let n=this.cache,s=e.length,r=Il(t,s);zt(n,r)||(i.uniform1iv(this.addr,r),Ht(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||nd,r[o])}function X0(i,e,t){let n=this.cache,s=e.length,r=Il(t,s);zt(n,r)||(i.uniform1iv(this.addr,r),Ht(n,r));let o;this.type===i.SAMPLER_CUBE_SHADOW?o=Ll(ed):o=id;for(let a=0;a!==s;++a)t.setTextureCube(e[a]||o,r[a])}function Y0(i,e,t){let n=this.cache,s=e.length,r=Il(t,s);zt(n,r)||(i.uniform1iv(this.addr,r),Ht(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||td,r[o])}function q0(i){switch(i){case 5126:return R0;case 35664:return C0;case 35665:return P0;case 35666:return I0;case 35674:return L0;case 35675:return D0;case 35676:return N0;case 5124:case 35670:return U0;case 35667:case 35671:return O0;case 35668:case 35672:return F0;case 35669:case 35673:return B0;case 5125:return z0;case 36294:return H0;case 36295:return G0;case 36296:return k0;case 35678:case 36198:case 36298:case 36306:case 35682:return V0;case 35679:case 36299:case 36307:return W0;case 35680:case 36300:case 36308:case 36293:return X0;case 36289:case 36303:case 36311:case 36292:return Y0}}var mc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=A0(t.type)}},gc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=q0(t.type)}},_c=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},fc=/(\w+)(\])?(\[|\.)?/g;function Ou(i,e){i.seq.push(e),i.map[e.id]=e}function Z0(i,e,t){let n=i.name,s=n.length;for(fc.lastIndex=0;;){let r=fc.exec(n),o=fc.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Ou(t,c===void 0?new mc(a,i,e):new gc(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new _c(a),Ou(t,d)),t=d}}}var Os=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);Z0(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function Fu(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var J0=37297,$0=0;function K0(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Bu=new Ye;function j0(i){rt._getMatrix(Bu,rt.workingColorSpace,i);let e=`mat3( ${Bu.elements.map(t=>t.toFixed(4))} )`;switch(rt.getTransfer(i)){case hr:return[e,"LinearTransferOETF"];case pt:return[e,"sRGBTransferOETF"];default:return He("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function zu(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+K0(i.getShaderSource(e),a)}else return r}function Q0(i,e){let t=j0(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var e4={[Yr]:"Linear",[qr]:"Reinhard",[Zr]:"Cineon",[Hi]:"ACESFilmic",[$r]:"AgX",[Kr]:"Neutral",[Jr]:"Custom"};function t4(i,e){let t=e4[e];return t===void 0?(He("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Rl=new L;function n4(){rt.getLuminanceCoefficients(Rl);let i=Rl.x.toFixed(4),e=Rl.y.toFixed(4),t=Rl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function i4(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ao).join(`
`)}function s4(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function r4(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function ao(i){return i!==""}function Hu(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function Gu(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var o4=/^[ \t]*#include +<([\w\d./]+)>/gm;function xc(i){return i.replace(o4,a4)}function a4(i,e){let t=it[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return xc(t)}var l4=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ku(i){return i.replace(l4,c4)}function c4(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Vu(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}var h4={[Xr]:"SHADOWMAP_TYPE_PCF",[Ls]:"SHADOWMAP_TYPE_VSM"};function u4(i){return h4[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var d4={[Ns]:"ENVMAP_MODE_REFRACTION"};function f4(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":d4[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var p4={[Ba]:"ENVMAP_BLENDING_MULTIPLY",[su]:"ENVMAP_BLENDING_MIX",[ru]:"ENVMAP_BLENDING_ADD"};function m4(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":p4[i.combine]||"ENVMAP_BLENDING_NONE"}function g4(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=u4(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=f4(t),d=m4(t),u=i4(t),f=s4(r),p=s.createProgram(),y,_,m=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(ao).join(`
`),y.length>0&&(y+=`
`),_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(ao).join(`
`),_.length>0&&(_+=`
`)):(y=[Vu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ao).join(`
`),_=[Vu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Hn?"#define TONE_MAPPING":"",t.toneMapping!==Hn?it.tonemapping_pars_fragment:"",t.toneMapping!==Hn?t4("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",it.colorspace_pars_fragment,Q0("linearToOutputTexel",t.outputColorSpace),n4(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ao).join(`
`)),o=xc(o),o=Hu(o,t),o=Gu(o,t),a=xc(a),a=Hu(a,t),a=Gu(a,t),o=ku(o),a=ku(a),t.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,y=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,_=["#define varying in",t.glslVersion===j1?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===j1?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);let v=m+y+o,b=m+_+a,x=Fu(s,s.VERTEX_SHADER,v),T=Fu(s,s.FRAGMENT_SHADER,b);s.attachShader(p,x),s.attachShader(p,T),t.index0AttributeName!==void 0?s.bindAttribLocation(p,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function w(A){if(i.debug.checkShaderErrors){let I=s.getProgramInfoLog(p)||"",N=s.getShaderInfoLog(x)||"",O=s.getShaderInfoLog(T)||"",R=I.trim(),U=N.trim(),H=O.trim(),z=!0,V=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,x,T);else{let G=zu(s,x,"vertex"),K=zu(s,T,"fragment");ke("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+R+`
`+G+`
`+K)}else R!==""?He("WebGLProgram: Program Info Log:",R):(U===""||H==="")&&(V=!1);V&&(A.diagnostics={runnable:z,programLog:R,vertexShader:{log:U,prefix:y},fragmentShader:{log:H,prefix:_}})}s.deleteShader(x),s.deleteShader(T),g=new Os(s,p),M=r4(s,p)}let g;this.getUniforms=function(){return g===void 0&&w(this),g};let M;this.getAttributes=function(){return M===void 0&&w(this),M};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(p,J0)),C},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=$0++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=x,this.fragmentShader=T,this}var _4=0,yc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new vc(e),t.set(e,n)),n}},vc=class{constructor(e){this.id=_4++,this.code=e,this.usedTimes=0}};function x4(i){return i===Mi||i===io||i===so}function y4(i,e,t,n,s,r){let o=new vs,a=new yc,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(g){return l.add(g),g===0?"uv":`uv${g}`}function p(g,M,C,A,I,N){let O=A.fog,R=I.geometry,U=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?A.environment:null,H=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap,z=e.get(g.envMap||U,H),V=u[g.type],G=n.precision;g.precision!==null&&(G=n.getMaxPrecision(g.precision),G!==g.precision&&He("WebGLProgram.getParameters:",g.precision,"not supported, using",G,"instead."));let K=R.morphAttributes.position||R.morphAttributes.normal||R.morphAttributes.color,W=K!==void 0?K.length:0,oe=0;R.morphAttributes.position!==void 0&&(oe=1),R.morphAttributes.normal!==void 0&&(oe=2),R.morphAttributes.color!==void 0&&(oe=3);let ue,Z,k,re;if(V){let we=kn[V];ue=we.vertexShader,Z=we.fragmentShader}else{ue=g.vertexShader,Z=g.fragmentShader;let we=a.getVertexShaderStage(g),_t=a.getFragmentShaderStage(g);a.update(g,we,_t),k=we.id,re=_t.id}let Se=i.getRenderTarget(),ae=i.state.buffers.depth.getReversed(),Re=I.isInstancedMesh===!0,qe=I.isBatchedMesh===!0,Ne=!!g.map,Ge=!!g.matcap,et=!!z,te=et&&z.isPMREMTexture===!0,ge=!!g.aoMap,de=!!g.lightMap,Ce=!!g.bumpMap&&g.wireframe===!1,Ee=!!g.normalMap,Je=!!g.displacementMap,Ue=!!g.emissiveMap,ot=!!g.metalnessMap,lt=!!g.roughnessMap,ft=g.anisotropy>0,B=g.clearcoat>0,Lt=g.diffuseRoughness>0,st=g.dispersion>0,xt=g.retroreflectivity>0,ve=g.iridescence>0,Pt=g.sheen>0,ze=g.transmission>0,We=ft&&!!g.anisotropyMap,P=B&&!!g.clearcoatMap,S=B&&!!g.clearcoatNormalMap,Y=B&&!!g.clearcoatRoughnessMap,le=Lt&&!!g.diffuseRoughnessMap,ie=ve&&!!g.iridescenceMap,fe=ve&&!!g.iridescenceThicknessMap,Me=Pt&&!!g.sheenColorMap,j=Pt&&!!g.sheenRoughnessMap,Q=!!g.specularMap,_e=!!g.specularColorMap,D=!!g.specularIntensityMap,ee=ze&&!!g.transmissionMap,$=ze&&!!g.thicknessMap,xe=!!g.gradientMap,he=!!g.alphaMap,pe=g.alphaTest>0,Oe=!!g.alphaHash,tt=!!g.extensions,ce=Hn;g.toneMapped&&(Se===null||Se.isXRRenderTarget===!0)&&(ce=i.toneMapping);let Be=te?z.isCompressedCubeTexture?z.image[0].mipmaps:z.mipmaps:null,je={shaderID:V,shaderType:g.type,shaderName:g.name,vertexShader:ue,fragmentShader:Z,defines:g.defines,customVertexShaderID:k,customFragmentShaderID:re,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:G,batching:qe,batchingColor:qe&&I._colorsTexture!==null,instancing:Re,instancingColor:Re&&I.instanceColor!==null,instancingMorph:Re&&I.morphTexture!==null,outputColorSpace:Se===null?i.outputColorSpace:Se.isXRRenderTarget===!0?Se.texture.colorSpace:rt.workingColorSpace,alphaToCoverage:!!g.alphaToCoverage,map:Ne,matcap:Ge,envMap:et,envMapMode:et&&z.mapping,envMapPMREM:te,envMapMaxLod:te?Be.length-1:null,envMapSize:te?Be[0].width:null,aoMap:ge,lightMap:de,bumpMap:Ce,normalMap:Ee,displacementMap:Je,emissiveMap:Ue,normalMapObjectSpace:Ee&&g.normalMapType===lu,normalMapTangentSpace:Ee&&g.normalMapType===ro,packedNormalMap:Ee&&g.normalMapType===ro&&x4(g.normalMap.format),metalnessMap:ot,roughnessMap:lt,anisotropy:ft,anisotropyMap:We,clearcoat:B,clearcoatMap:P,clearcoatNormalMap:S,clearcoatRoughnessMap:Y,diffuseRoughness:Lt,diffuseRoughnessMap:le,dispersion:st,retroreflection:xt,iridescence:ve,iridescenceMap:ie,iridescenceThicknessMap:fe,sheen:Pt,sheenColorMap:Me,sheenRoughnessMap:j,specularMap:Q,specularColorMap:_e,specularIntensityMap:D,transmission:ze,transmissionMap:ee,thicknessMap:$,gradientMap:xe,opaque:g.transparent===!1&&g.blending===Ds&&g.alphaToCoverage===!1,alphaMap:he,alphaTest:pe,alphaHash:Oe,combine:g.combine,mapUv:Ne&&f(g.map.channel),aoMapUv:ge&&f(g.aoMap.channel),lightMapUv:de&&f(g.lightMap.channel),bumpMapUv:Ce&&f(g.bumpMap.channel),normalMapUv:Ee&&f(g.normalMap.channel),displacementMapUv:Je&&f(g.displacementMap.channel),emissiveMapUv:Ue&&f(g.emissiveMap.channel),metalnessMapUv:ot&&f(g.metalnessMap.channel),roughnessMapUv:lt&&f(g.roughnessMap.channel),anisotropyMapUv:We&&f(g.anisotropyMap.channel),clearcoatMapUv:P&&f(g.clearcoatMap.channel),clearcoatNormalMapUv:S&&f(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Y&&f(g.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:le&&f(g.diffuseRoughnessMap.channel),iridescenceMapUv:ie&&f(g.iridescenceMap.channel),iridescenceThicknessMapUv:fe&&f(g.iridescenceThicknessMap.channel),sheenColorMapUv:Me&&f(g.sheenColorMap.channel),sheenRoughnessMapUv:j&&f(g.sheenRoughnessMap.channel),specularMapUv:Q&&f(g.specularMap.channel),specularColorMapUv:_e&&f(g.specularColorMap.channel),specularIntensityMapUv:D&&f(g.specularIntensityMap.channel),transmissionMapUv:ee&&f(g.transmissionMap.channel),thicknessMapUv:$&&f(g.thicknessMap.channel),alphaMapUv:he&&f(g.alphaMap.channel),vertexTangents:!!R.attributes.tangent&&(Ee||ft),vertexNormals:!!R.attributes.normal,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!R.attributes.color&&R.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!R.attributes.uv&&(Ne||he),fog:!!O,useFog:g.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:g.wireframe===!1&&(g.flatShading===!0||R.attributes.normal===void 0&&Ee===!1&&(g.isMeshLambertMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isMeshPhysicalMaterial)),sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ae,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:R.attributes.position!==void 0,morphTargets:R.morphAttributes.position!==void 0,morphNormals:R.morphAttributes.normal!==void 0,morphColors:R.morphAttributes.color!==void 0,morphTargetsCount:W,morphTextureStride:oe,numSunLights:M.sun.length,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numSunLightShadows:M.sunShadowMap.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:N.filter(we=>we.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:g.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:ce,decodeVideoTexture:Ne&&g.map.isVideoTexture===!0&&rt.getTransfer(g.map.colorSpace)===pt,decodeVideoTextureEmissive:Ue&&g.emissiveMap.isVideoTexture===!0&&rt.getTransfer(g.emissiveMap.colorSpace)===pt,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===ln,flipSided:g.side===qt,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:tt&&g.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(tt&&g.extensions.multiDraw===!0||qe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return je.vertexUv1s=l.has(1),je.vertexUv2s=l.has(2),je.vertexUv3s=l.has(3),l.clear(),je}function y(g){let M=[];if(g.shaderID?M.push(g.shaderID):(M.push(g.customVertexShaderID),M.push(g.customFragmentShaderID)),g.defines!==void 0)for(let C in g.defines)M.push(C),M.push(g.defines[C]);return g.isRawShaderMaterial===!1&&(_(M,g),m(M,g),M.push(i.outputColorSpace)),M.push(g.customProgramCacheKey),M.join()}function _(g,M){g.push(M.precision),g.push(M.outputColorSpace),g.push(M.envMapMode),g.push(M.envMapPMREM),g.push(M.envMapMaxLod),g.push(M.envMapSize),g.push(M.mapUv),g.push(M.alphaMapUv),g.push(M.lightMapUv),g.push(M.aoMapUv),g.push(M.bumpMapUv),g.push(M.normalMapUv),g.push(M.displacementMapUv),g.push(M.emissiveMapUv),g.push(M.metalnessMapUv),g.push(M.roughnessMapUv),g.push(M.anisotropyMapUv),g.push(M.clearcoatMapUv),g.push(M.clearcoatNormalMapUv),g.push(M.clearcoatRoughnessMapUv),g.push(M.diffuseRoughnessMapUv),g.push(M.iridescenceMapUv),g.push(M.iridescenceThicknessMapUv),g.push(M.sheenColorMapUv),g.push(M.sheenRoughnessMapUv),g.push(M.specularMapUv),g.push(M.specularColorMapUv),g.push(M.specularIntensityMapUv),g.push(M.transmissionMapUv),g.push(M.thicknessMapUv),g.push(M.combine),g.push(M.fogExp2),g.push(M.sizeAttenuation),g.push(M.morphTargetsCount),g.push(M.numSunLights),g.push(M.numDirLights),g.push(M.numPointLights),g.push(M.numSpotLights),g.push(M.numSpotLightMaps),g.push(M.numHemiLights),g.push(M.numRectAreaLights),g.push(M.numSunLightShadows),g.push(M.numDirLightShadows),g.push(M.numPointLightShadows),g.push(M.numSpotLightShadows),g.push(M.numSpotLightShadowsWithMaps),g.push(M.numLightProbes),g.push(M.numLightProbeGrids),g.push(M.shadowMapType),g.push(M.toneMapping),g.push(M.numClippingPlanes),g.push(M.numClipIntersection),g.push(M.depthPacking)}function m(g,M){o.disableAll(),M.instancing&&o.enable(0),M.instancingColor&&o.enable(1),M.instancingMorph&&o.enable(2),M.matcap&&o.enable(3),M.envMap&&o.enable(4),M.normalMapObjectSpace&&o.enable(5),M.normalMapTangentSpace&&o.enable(6),M.clearcoat&&o.enable(7),M.iridescence&&o.enable(8),M.alphaTest&&o.enable(9),M.vertexColors&&o.enable(10),M.vertexAlphas&&o.enable(11),M.vertexUv1s&&o.enable(12),M.vertexUv2s&&o.enable(13),M.vertexUv3s&&o.enable(14),M.vertexTangents&&o.enable(15),M.anisotropy&&o.enable(16),M.alphaHash&&o.enable(17),M.batching&&o.enable(18),M.dispersion&&o.enable(19),M.retroreflection&&o.enable(24),M.diffuseRoughness&&o.enable(25),M.batchingColor&&o.enable(20),M.gradientMap&&o.enable(21),M.packedNormalMap&&o.enable(22),M.vertexNormals&&o.enable(23),g.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),M.numLightProbeGrids>0&&o.enable(22),M.hasPositionAttribute&&o.enable(23),g.push(o.mask)}function v(g){let M=u[g.type],C;if(M){let A=kn[M];C=Sn.clone(A.uniforms)}else C=g.uniforms;return C}function b(g,M){let C=h.get(M);return C!==void 0?++C.usedTimes:(C=new g4(i,M,g,s),c.push(C),h.set(M,C)),C}function x(g){if(--g.usedTimes===0){let M=c.indexOf(g);c[M]=c[c.length-1],c.pop(),h.delete(g.cacheKey),g.destroy()}}function T(g){a.remove(g)}function w(){a.dispose()}return{getParameters:p,getProgramCacheKey:y,getUniforms:v,acquireProgram:b,releaseProgram:x,releaseShaderCache:T,programs:c,dispose:w}}function v4(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function M4(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Wu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Xu(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function a(u,f,p,y,_,m){let v=i[e];return v===void 0?(v={id:u.id,object:u,geometry:f,material:p,materialVariant:o(u),groupOrder:y,renderOrder:u.renderOrder,z:_,group:m},i[e]=v):(v.id=u.id,v.object=u,v.geometry=f,v.material=p,v.materialVariant=o(u),v.groupOrder=y,v.renderOrder=u.renderOrder,v.z=_,v.group=m),e++,v}function l(u,f,p,y,_,m,v){v.reversedDepth===!0&&(_=-_);let b=a(u,f,p,y,_,m);p.transmission>0?n.push(b):p.transparent===!0?s.push(b):t.push(b)}function c(u,f,p,y,_,m){let v=a(u,f,p,y,_,m);p.transmission>0?n.unshift(v):p.transparent===!0?s.unshift(v):t.unshift(v)}function h(u,f){t.length>1&&t.sort(u||M4),n.length>1&&n.sort(f||Wu),s.length>1&&s.sort(f||Wu)}function d(){for(let u=e,f=i.length;u<f;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function b4(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Xu,i.set(n,[o])):s>=r.length?(o=new Xu,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function S4(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new L,color:new me};break;case"SpotLight":t={position:new L,direction:new L,color:new me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new me,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new me,groundColor:new me};break;case"RectAreaLight":t={color:new me,position:new L,halfWidth:new L,halfHeight:new L};break}return i[e.id]=t,t}}}function E4(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ne};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ne};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ne,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var T4=0;function w4(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function A4(i){let e=new S4,t=E4(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);let s=new L,r=new Ke,o=new Ke;function a(c){let h=0,d=0,u=0;for(let N=0;N<9;N++)n.probe[N].set(0,0,0);let f=0,p=0,y=0,_=0,m=0,v=0,b=0,x=0,T=0,w=0,g=0,M=0,C=0,A=0;c.sort(w4);for(let N=0,O=c.length;N<O;N++){let R=c[N],U=R.color,H=R.intensity,z=R.distance,V=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===Mi?V=R.shadow.map.texture:V=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)h+=U.r*H,d+=U.g*H,u+=U.b*H;else if(R.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(R.sh.coefficients[G],H);A++}else if(R.isSunLight){let G=e.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let K=R.shadow,W=t.get(R);W.shadowIntensity=K.intensity,W.shadowBias=K.bias,W.shadowNormalBias=K.normalBias,W.shadowRadius=K.radius,W.shadowMapSize.copy(K.mapSize).multiply(K.getFrameExtents()),n.sunShadow[p]=W,n.sunShadowMap[p]=V;let oe=K.getViewportCount();for(let ue=0;ue<oe;ue++)n.sunShadowMatrix[y+ue]=K.getMatrix(ue),n.sunShadowCascade[y+ue]=K._cascadeData[ue];y+=oe,p++}n.sun[f]=G,f++}else if(R.isDirectionalLight){let G=e.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let K=R.shadow,W=t.get(R);W.shadowIntensity=K.intensity,W.shadowBias=K.bias,W.shadowNormalBias=K.normalBias,W.shadowRadius=K.radius,W.shadowMapSize=K.mapSize,n.directionalShadow[_]=W,n.directionalShadowMap[_]=V,n.directionalShadowMatrix[_]=R.shadow.matrix,T++}n.directional[_]=G,_++}else if(R.isSpotLight){let G=e.get(R);G.position.setFromMatrixPosition(R.matrixWorld),G.color.copy(U).multiplyScalar(H),G.distance=z,G.coneCos=Math.cos(R.angle),G.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),G.decay=R.decay,n.spot[v]=G;let K=R.shadow;if(R.map&&(n.spotLightMap[M]=R.map,M++,K.updateMatrices(R),R.castShadow&&C++),n.spotLightMatrix[v]=K.matrix,R.castShadow){let W=t.get(R);W.shadowIntensity=K.intensity,W.shadowBias=K.bias,W.shadowNormalBias=K.normalBias,W.shadowRadius=K.radius,W.shadowMapSize=K.mapSize,n.spotShadow[v]=W,n.spotShadowMap[v]=V,g++}v++}else if(R.isRectAreaLight){let G=e.get(R);G.color.copy(U).multiplyScalar(H),G.halfWidth.set(R.width*.5,0,0),G.halfHeight.set(0,R.height*.5,0),n.rectArea[b]=G,b++}else if(R.isPointLight){let G=e.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),G.distance=R.distance,G.decay=R.decay,R.castShadow){let K=R.shadow,W=t.get(R);W.shadowIntensity=K.intensity,W.shadowBias=K.bias,W.shadowNormalBias=K.normalBias,W.shadowRadius=K.radius,W.shadowMapSize=K.mapSize,W.shadowCameraNear=K.camera.near,W.shadowCameraFar=K.camera.far,n.pointShadow[m]=W,n.pointShadowMap[m]=V,n.pointShadowMatrix[m]=R.shadow.matrix,w++}n.point[m]=G,m++}else if(R.isHemisphereLight){let G=e.get(R);G.skyColor.copy(R.color).multiplyScalar(H),G.groundColor.copy(R.groundColor).multiplyScalar(H),n.hemi[x]=G,x++}}b>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Te.LTC_FLOAT_1,n.rectAreaLTC2=Te.LTC_FLOAT_2):(n.rectAreaLTC1=Te.LTC_HALF_1,n.rectAreaLTC2=Te.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let I=n.hash;(I.sunLength!==f||I.directionalLength!==_||I.pointLength!==m||I.spotLength!==v||I.rectAreaLength!==b||I.hemiLength!==x||I.numSunShadows!==p||I.numDirectionalShadows!==T||I.numPointShadows!==w||I.numSpotShadows!==g||I.numSpotMaps!==M||I.numLightProbes!==A)&&(n.sun.length=f,n.directional.length=_,n.spot.length=v,n.rectArea.length=b,n.point.length=m,n.hemi.length=x,n.sunShadow.length=p,n.sunShadowMap.length=p,n.sunShadowMatrix.length=y,n.sunShadowCascade.length=y,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.directionalShadowMatrix.length=T,n.pointShadow.length=w,n.pointShadowMap.length=w,n.pointShadowMatrix.length=w,n.spotShadow.length=g,n.spotShadowMap.length=g,n.spotLightMatrix.length=g+M-C,n.spotLightMap.length=M,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=A,I.sunLength=f,I.directionalLength=_,I.pointLength=m,I.spotLength=v,I.rectAreaLength=b,I.hemiLength=x,I.numSunShadows=p,I.numDirectionalShadows=T,I.numPointShadows=w,I.numSpotShadows=g,I.numSpotMaps=M,I.numLightProbes=A,n.version=T4++)}function l(c,h){let d=0,u=0,f=0,p=0,y=0,_=0,m=h.matrixWorldInverse;for(let v=0,b=c.length;v<b;v++){let x=c[v];if(x.isSunLight){let T=n.sun[d];T.direction.setFromMatrixPosition(x.matrixWorld),T.direction.transformDirection(m),d++}else if(x.isDirectionalLight){let T=n.directional[u];T.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(m),u++}else if(x.isSpotLight){let T=n.spot[p];T.position.setFromMatrixPosition(x.matrixWorld),T.position.applyMatrix4(m),T.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(m),p++}else if(x.isRectAreaLight){let T=n.rectArea[y];T.position.setFromMatrixPosition(x.matrixWorld),T.position.applyMatrix4(m),o.identity(),r.copy(x.matrixWorld),r.premultiply(m),o.extractRotation(r),T.halfWidth.set(x.width*.5,0,0),T.halfHeight.set(0,x.height*.5,0),T.halfWidth.applyMatrix4(o),T.halfHeight.applyMatrix4(o),y++}else if(x.isPointLight){let T=n.point[f];T.position.setFromMatrixPosition(x.matrixWorld),T.position.applyMatrix4(m),f++}else if(x.isHemisphereLight){let T=n.hemi[_];T.direction.setFromMatrixPosition(x.matrixWorld),T.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function Yu(i){let e=new A4(i),t=[],n=[],s=[];function r(d){h.camera=d,t.length=0,n.length=0,s.length=0}function o(d){d.isLightProbeGrid?s.push(d):t.push(d)}function a(d){n.push(d)}function l(){e.setup(t),s.sort((d,u)=>d.priority-u.priority||d.id-u.id)}function c(d){e.setupView(t,d)}let h={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function R4(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Yu(i),e.set(s,[a])):r>=o.length?(a=new Yu(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var C4=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,P4=`uniform sampler2D shadow_pass;
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
}`,I4=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],L4=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],qu=new Ke,oo=new L,pc=new L;function D4(i,e,t){let n=new pi,s=new ne,r=new ne,o=new Et,a=new ba,l=new Sa,c={},h=t.maxTextureSize,d={[vi]:qt,[qt]:vi,[ln]:ln},u=new Ct({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ne},radius:{value:4}},vertexShader:C4,fragmentShader:P4}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let p=new dt;p.setAttribute("position",new Ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new se(p,u),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xr;let m=this.type;this.render=function(w,g,M){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||w.length===0)return;this.type===Fa&&(He("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Xr);let C=i.getRenderTarget(),A=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),N=i.state;N.setBlending(ni),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let O=m!==this.type;O&&g.traverse(function(R){R.material&&(Array.isArray(R.material)?R.material.forEach(U=>U.needsUpdate=!0):R.material.needsUpdate=!0)});for(let R=0,U=w.length;R<U;R++){let H=w[R],z=H.shadow;if(z===void 0){He("WebGLShadowMap:",H,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);let V=z.getFrameExtents();s.multiply(V),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/V.x),s.x=r.x*V.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/V.y),s.y=r.y*V.y,z.mapSize.y=r.y));let G=i.state.buffers.depth.getReversed();if(z.camera._reversedDepth=G,z.map===null||O===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===Ls){if(H.isPointLight){He("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new Ft(s.x,s.y,{format:Mi,type:Zt,minFilter:rn,magFilter:rn,generateMipmaps:!1}),z.map.texture.name=H.name+".shadowMap",z.map.depthTexture=new ei(s.x,s.y,bn),z.map.depthTexture.name=H.name+".shadowMapDepth",z.map.depthTexture.format=Kn,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Xt,z.map.depthTexture.magFilter=Xt}else H.isPointLight?(z.map=new lo(s.x),z.map.depthTexture=new Sr(s.x,Cn)):(z.map=new Ft(s.x,s.y),z.map.depthTexture=new ei(s.x,s.y,Cn)),z.map.depthTexture.name=H.name+".shadowMap",z.map.depthTexture.format=Kn,this.type===Xr?(z.map.depthTexture.compareFunction=G?J1:Z1,z.map.depthTexture.minFilter=rn,z.map.depthTexture.magFilter=rn):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Xt,z.map.depthTexture.magFilter=Xt);z.camera.updateProjectionMatrix()}z.map.isWebGLCubeRenderTarget!==!0&&(z.map.width!==s.x||z.map.height!==s.y)&&z.map.setSize(s.x,s.y);let K=z.map.isWebGLCubeRenderTarget?6:z.getViewportCount();H.isPointLight!==!0&&z.updateMatrices(H,M);let W=(z.camera.layers.mask&4294967294)!==0?z.camera.layers:M.layers;for(let oe=0;oe<K;oe++){let ue=z.getCamera(oe);if(H.isPointLight){let Z=z.camera,k=z.matrix,re=H.distance||Z.far;re!==Z.far&&(Z.far=re,Z.updateProjectionMatrix()),oo.setFromMatrixPosition(H.matrixWorld),Z.position.copy(oo),pc.copy(Z.position),pc.add(I4[oe]),Z.up.copy(L4[oe]),Z.lookAt(pc),Z.updateMatrixWorld(),k.makeTranslation(-oo.x,-oo.y,-oo.z),qu.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),z._frustum.setFromProjectionMatrix(qu,Z.coordinateSystem,Z.reversedDepth)}if(z.map.isWebGLCubeRenderTarget)i.setRenderTarget(z.map,oe),i.clear();else{oe===0&&(i.setRenderTarget(z.map),i.clear());let Z=z.getViewport(oe);o.set(r.x*Z.x,r.y*Z.y,r.x*Z.z,r.y*Z.w),N.viewport(o)}n=z.getFrustum(oe),x(g,M,ue,H,W,this.type)}z.isPointLightShadow!==!0&&this.type===Ls&&v(z,M),z.needsUpdate=!1}m=this.type,_.needsUpdate=!1,i.setRenderTarget(C,A,I)};function v(w,g){let M=e.update(y);u.defines.VSM_SAMPLES!==w.blurSamples&&(u.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null?w.mapPass=new Ft(s.x,s.y,{format:Mi,type:Zt}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),u.uniforms.shadow_pass.value=w.map.depthTexture,u.uniforms.resolution.value.set(w.map.width,w.map.height),u.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(g,null,M,u,y,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value.set(w.map.width,w.map.height),f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(g,null,M,f,y,null)}function b(w,g,M,C){let A=null,I=M.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(I!==void 0)A=I;else if(A=M.isPointLight===!0?l:a,i.localClippingEnabled&&g.clipShadows===!0&&Array.isArray(g.clippingPlanes)&&g.clippingPlanes.length!==0||g.displacementMap&&g.displacementScale!==0||g.alphaMap&&g.alphaTest>0||g.map&&g.alphaTest>0||g.alphaToCoverage===!0){let N=A.uuid,O=g.uuid,R=c[N];R===void 0&&(R={},c[N]=R);let U=R[O];U===void 0&&(U=A.clone(),R[O]=U,g.addEventListener("dispose",T)),A=U}if(A.visible=g.visible,A.wireframe=g.wireframe,C===Ls?A.side=g.shadowSide!==null?g.shadowSide:g.side:A.side=g.shadowSide!==null?g.shadowSide:d[g.side],A.alphaMap=g.alphaMap,A.alphaTest=g.alphaToCoverage===!0?.5:g.alphaTest,A.map=g.map,A.clipShadows=g.clipShadows,A.clippingPlanes=g.clippingPlanes,A.clipIntersection=g.clipIntersection,A.displacementMap=g.displacementMap,A.displacementScale=g.displacementScale,A.displacementBias=g.displacementBias,A.wireframeLinewidth=g.wireframeLinewidth,A.linewidth=g.linewidth,M.isPointLight===!0&&A.isMeshDistanceMaterial===!0){let N=i.properties.get(A);N.light=M}return A}function x(w,g,M,C,A,I){if(w.visible===!1)return;if(w.layers.test(A)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&I===Ls)&&(!w.frustumCulled||w.intersectsFrustum(n))){w.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,w.matrixWorld);let R=e.update(w),U=w.material;if(Array.isArray(U)){let H=R.groups;for(let z=0,V=H.length;z<V;z++){let G=H[z],K=U[G.materialIndex];if(K&&K.visible){let W=b(w,K,C,I);w.onBeforeShadow(i,w,g,M,R,W,G),i.renderBufferDirect(M,null,R,W,w,G),w.onAfterShadow(i,w,g,M,R,W,G)}}}else if(U.visible){let H=b(w,U,C,I);w.onBeforeShadow(i,w,g,M,R,H,null),i.renderBufferDirect(M,null,R,H,w,null),w.onAfterShadow(i,w,g,M,R,H,null)}}let O=w.children;for(let R=0,U=O.length;R<U;R++)x(O[R],g,M,C,A,I)}function T(w){w.target.removeEventListener("dispose",T);for(let M in c){let C=c[M],A=w.target.uuid;A in C&&(C[A].dispose(),delete C[A])}}}function N4(i,e){function t(){let D=!1,ee=new Et,$=null,xe=new Et(0,0,0,0);return{setMask:function(he){$!==he&&!D&&(i.colorMask(he,he,he,he),$=he)},setLocked:function(he){D=he},setClear:function(he,pe,Oe,tt,ce){ce===!0&&(he*=tt,pe*=tt,Oe*=tt),ee.set(he,pe,Oe,tt),xe.equals(ee)===!1&&(i.clearColor(he,pe,Oe,tt),xe.copy(ee))},reset:function(){D=!1,$=null,xe.set(-1,0,0,0)}}}function n(){let D=!1,ee=!1,$=null,xe=null,he=null;return{setReversed:function(pe){if(ee!==pe){let Oe=e.get("EXT_clip_control");pe?Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.ZERO_TO_ONE_EXT):Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.NEGATIVE_ONE_TO_ONE_EXT),ee=pe;let tt=he;he=null,this.setClear(tt)}},getReversed:function(){return ee},setTest:function(pe){pe?ae(i.DEPTH_TEST):Re(i.DEPTH_TEST)},setMask:function(pe){$!==pe&&!D&&(i.depthMask(pe),$=pe)},setFunc:function(pe){if(ee&&(pe=xu[pe]),xe!==pe){switch(pe){case ea:i.depthFunc(i.NEVER);break;case ta:i.depthFunc(i.ALWAYS);break;case na:i.depthFunc(i.LESS);break;case ms:i.depthFunc(i.LEQUAL);break;case ia:i.depthFunc(i.EQUAL);break;case sa:i.depthFunc(i.GEQUAL);break;case ra:i.depthFunc(i.GREATER);break;case oa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}xe=pe}},setLocked:function(pe){D=pe},setClear:function(pe){he!==pe&&(he=pe,ee&&(pe=1-pe),i.clearDepth(pe))},reset:function(){D=!1,$=null,xe=null,he=null,ee=!1}}}function s(){let D=!1,ee=null,$=null,xe=null,he=null,pe=null,Oe=null,tt=null,ce=null;return{setTest:function(Be){D||(Be?ae(i.STENCIL_TEST):Re(i.STENCIL_TEST))},setMask:function(Be){ee!==Be&&!D&&(i.stencilMask(Be),ee=Be)},setFunc:function(Be,je,we){($!==Be||xe!==je||he!==we)&&(i.stencilFunc(Be,je,we),$=Be,xe=je,he=we)},setOp:function(Be,je,we){(pe!==Be||Oe!==je||tt!==we)&&(i.stencilOp(Be,je,we),pe=Be,Oe=je,tt=we)},setLocked:function(Be){D=Be},setClear:function(Be){ce!==Be&&(i.clearStencil(Be),ce=Be)},reset:function(){D=!1,ee=null,$=null,xe=null,he=null,pe=null,Oe=null,tt=null,ce=null}}}let r=new t,o=new n,a=new s,l={},c=new WeakMap,h={},d={},u={},f=new WeakMap,p=[],y=null,_=!1,m=null,v=null,b=null,x=null,T=null,w=null,g=null,M=new me(0,0,0),C=0,A=!1,I=null,N=null,O=null,R=null,U=null,H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,V=0,G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(G)[1]),z=V>=1):G.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),z=V>=2);let K=null,W={},oe=i.getParameter(i.SCISSOR_BOX),ue=i.getParameter(i.VIEWPORT),Z=new Et().fromArray(oe),k=new Et().fromArray(ue);function re(D,ee,$,xe){let he=new Uint8Array(4),pe=i.createTexture();i.bindTexture(D,pe),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Oe=0;Oe<$;Oe++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(ee,0,i.RGBA,1,1,xe,0,i.RGBA,i.UNSIGNED_BYTE,he):i.texImage2D(ee+Oe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,he);return pe}let Se={};Se[i.TEXTURE_2D]=re(i.TEXTURE_2D,i.TEXTURE_2D,1),Se[i.TEXTURE_CUBE_MAP]=re(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Se[i.TEXTURE_2D_ARRAY]=re(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Se[i.TEXTURE_3D]=re(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ae(i.DEPTH_TEST),o.setFunc(ms),Ce(!1),Ee(O1),ae(i.CULL_FACE),ge(ni);function ae(D){h[D]!==!0&&(i.enable(D),h[D]=!0)}function Re(D){h[D]!==!1&&(i.disable(D),h[D]=!1)}function qe(D,ee){return u[D]!==ee?(i.bindFramebuffer(D,ee),u[D]=ee,D===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ee),D===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ee),!0):!1}function Ne(D,ee){let $=p,xe=!1;if(D){$=f.get(ee),$===void 0&&($=[],f.set(ee,$));let he=D.textures;if($.length!==he.length||$[0]!==i.COLOR_ATTACHMENT0){for(let pe=0,Oe=he.length;pe<Oe;pe++)$[pe]=i.COLOR_ATTACHMENT0+pe;$.length=he.length,xe=!0}}else $[0]!==i.BACK&&($[0]=i.BACK,xe=!0);xe&&i.drawBuffers($)}function Ge(D){return y!==D?(i.useProgram(D),y=D,!0):!1}let et={[zi]:i.FUNC_ADD,[Gh]:i.FUNC_SUBTRACT,[kh]:i.FUNC_REVERSE_SUBTRACT};et[Vh]=i.MIN,et[Wh]=i.MAX;let te={[Xh]:i.ZERO,[Yh]:i.ONE,[qh]:i.SRC_COLOR,[z1]:i.SRC_ALPHA,[Qh]:i.SRC_ALPHA_SATURATE,[Kh]:i.DST_COLOR,[Jh]:i.DST_ALPHA,[Zh]:i.ONE_MINUS_SRC_COLOR,[H1]:i.ONE_MINUS_SRC_ALPHA,[jh]:i.ONE_MINUS_DST_COLOR,[$h]:i.ONE_MINUS_DST_ALPHA,[eu]:i.CONSTANT_COLOR,[tu]:i.ONE_MINUS_CONSTANT_COLOR,[nu]:i.CONSTANT_ALPHA,[iu]:i.ONE_MINUS_CONSTANT_ALPHA};function ge(D,ee,$,xe,he,pe,Oe,tt,ce,Be){if(D===ni){_===!0&&(Re(i.BLEND),_=!1);return}if(_===!1&&(ae(i.BLEND),_=!0),D!==Hh){if(D!==m||Be!==A){if((v!==zi||T!==zi)&&(i.blendEquation(i.FUNC_ADD),v=zi,T=zi),Be)switch(D){case Ds:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ot:i.blendFunc(i.ONE,i.ONE);break;case F1:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case B1:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:ke("WebGLState: Invalid blending: ",D);break}else switch(D){case Ds:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ot:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case F1:ke("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case B1:ke("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ke("WebGLState: Invalid blending: ",D);break}b=null,x=null,w=null,g=null,M.set(0,0,0),C=0,m=D,A=Be}return}he=he||ee,pe=pe||$,Oe=Oe||xe,(ee!==v||he!==T)&&(i.blendEquationSeparate(et[ee],et[he]),v=ee,T=he),($!==b||xe!==x||pe!==w||Oe!==g)&&(i.blendFuncSeparate(te[$],te[xe],te[pe],te[Oe]),b=$,x=xe,w=pe,g=Oe),(tt.equals(M)===!1||ce!==C)&&(i.blendColor(tt.r,tt.g,tt.b,ce),M.copy(tt),C=ce),m=D,A=!1}function de(D,ee){D.side===ln?Re(i.CULL_FACE):ae(i.CULL_FACE);let $=D.side===qt;ee&&($=!$),Ce($),D.blending===Ds&&D.transparent===!1?ge(ni):ge(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),o.setFunc(D.depthFunc),o.setTest(D.depthTest),o.setMask(D.depthWrite),r.setMask(D.colorWrite);let xe=D.stencilWrite;a.setTest(xe),xe&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Ue(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ae(i.SAMPLE_ALPHA_TO_COVERAGE):Re(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ce(D){I!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),I=D)}function Ee(D){D!==Bh?(ae(i.CULL_FACE),D!==N&&(D===O1?i.cullFace(i.BACK):D===zh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Re(i.CULL_FACE),N=D}function Je(D){D!==O&&(z&&i.lineWidth(D),O=D)}function Ue(D,ee,$){D?(ae(i.POLYGON_OFFSET_FILL),(R!==ee||U!==$)&&(R=ee,U=$,o.getReversed()&&(ee=-ee,$=-$),i.polygonOffset(ee,$))):Re(i.POLYGON_OFFSET_FILL)}function ot(D){D?ae(i.SCISSOR_TEST):Re(i.SCISSOR_TEST)}function lt(D){D===void 0&&(D=i.TEXTURE0+H-1),K!==D&&(i.activeTexture(D),K=D)}function ft(D,ee,$){$===void 0&&(K===null?$=i.TEXTURE0+H-1:$=K);let xe=W[$];xe===void 0&&(xe={type:void 0,texture:void 0},W[$]=xe),(xe.type!==D||xe.texture!==ee)&&(K!==$&&(i.activeTexture($),K=$),i.bindTexture(D,ee||Se[D]),xe.type=D,xe.texture=ee)}function B(){let D=W[K];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Lt(){try{i.compressedTexImage2D(...arguments)}catch(D){ke("WebGLState:",D)}}function st(){try{i.compressedTexImage3D(...arguments)}catch(D){ke("WebGLState:",D)}}function xt(){try{i.texSubImage2D(...arguments)}catch(D){ke("WebGLState:",D)}}function ve(){try{i.texSubImage3D(...arguments)}catch(D){ke("WebGLState:",D)}}function Pt(){try{i.compressedTexSubImage2D(...arguments)}catch(D){ke("WebGLState:",D)}}function ze(){try{i.compressedTexSubImage3D(...arguments)}catch(D){ke("WebGLState:",D)}}function We(){try{i.texStorage2D(...arguments)}catch(D){ke("WebGLState:",D)}}function P(){try{i.texStorage3D(...arguments)}catch(D){ke("WebGLState:",D)}}function S(){try{i.texImage2D(...arguments)}catch(D){ke("WebGLState:",D)}}function Y(){try{i.texImage3D(...arguments)}catch(D){ke("WebGLState:",D)}}function le(D){return d[D]!==void 0?d[D]:i.getParameter(D)}function ie(D,ee){d[D]!==ee&&(i.pixelStorei(D,ee),d[D]=ee)}function fe(D){Z.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),Z.copy(D))}function Me(D){k.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),k.copy(D))}function j(D,ee){let $=c.get(ee);$===void 0&&($=new WeakMap,c.set(ee,$));let xe=$.get(D);xe===void 0&&(xe=i.getUniformBlockIndex(ee,D.name),i.uniformBlockBinding(ee,xe,xe),$.set(D,xe))}function Q(D,ee,$){let he=c.get(ee).get(D);l[he]!==$&&(i.bindBufferBase(i.UNIFORM_BUFFER,he,$),l[he]=$)}function _e(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},K=null,W={},u={},l={},f=new WeakMap,p=[],y=null,_=!1,m=null,v=null,b=null,x=null,T=null,w=null,g=null,M=new me(0,0,0),C=0,A=!1,I=null,N=null,O=null,R=null,U=null,Z.set(0,0,i.canvas.width,i.canvas.height),k.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ae,disable:Re,bindFramebuffer:qe,drawBuffers:Ne,useProgram:Ge,setBlending:ge,setMaterial:de,setFlipSided:Ce,setCullFace:Ee,setLineWidth:Je,setPolygonOffset:Ue,setScissorTest:ot,activeTexture:lt,bindTexture:ft,unbindTexture:B,compressedTexImage2D:Lt,compressedTexImage3D:st,texImage2D:S,texImage3D:Y,pixelStorei:ie,getParameter:le,updateUBOMapping:j,uniformBlockBinding:Q,texStorage2D:We,texStorage3D:P,texSubImage2D:xt,texSubImage3D:ve,compressedTexSubImage2D:Pt,compressedTexSubImage3D:ze,scissor:fe,viewport:Me,reset:_e}}function U4(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ne,h=new WeakMap,d=new Set,u,f=new WeakMap,p=new Set,y=new FinalizationRegistry(P=>p.delete(P)),_=!1;try{_=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(P,S){return _?new OffscreenCanvas(P,S):ur("canvas")}function v(P,S,Y){let le=1,ie=We(P);if((ie.width>Y||ie.height>Y)&&(le=Y/Math.max(ie.width,ie.height)),le<1)if(typeof HTMLImageElement!="undefined"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&P instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&P instanceof ImageBitmap||typeof VideoFrame!="undefined"&&P instanceof VideoFrame){let fe=Math.floor(le*ie.width),Me=Math.floor(le*ie.height);u===void 0&&(u=m(fe,Me));let j=S?m(fe,Me):u;return j.width=fe,j.height=Me,j.getContext("2d").drawImage(P,0,0,fe,Me),He("WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+fe+"x"+Me+")."),j}else return"data"in P&&He("WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),P;return P}function b(P){return P.generateMipmaps}function x(P){i.generateMipmap(P)}function T(P){return P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?i.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function w(P,S,Y,le,ie,fe=!1){if(P!==null){if(i[P]!==void 0)return i[P];He("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let Me;le&&(Me=e.get("EXT_texture_norm16"),Me||He("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=S;if(S===i.RED&&(Y===i.FLOAT&&(j=i.R32F),Y===i.HALF_FLOAT&&(j=i.R16F),Y===i.UNSIGNED_BYTE&&(j=i.R8),Y===i.UNSIGNED_SHORT&&Me&&(j=Me.R16_EXT),Y===i.SHORT&&Me&&(j=Me.R16_SNORM_EXT)),S===i.RED_INTEGER&&(Y===i.UNSIGNED_BYTE&&(j=i.R8UI),Y===i.UNSIGNED_SHORT&&(j=i.R16UI),Y===i.UNSIGNED_INT&&(j=i.R32UI),Y===i.BYTE&&(j=i.R8I),Y===i.SHORT&&(j=i.R16I),Y===i.INT&&(j=i.R32I)),S===i.RG&&(Y===i.FLOAT&&(j=i.RG32F),Y===i.HALF_FLOAT&&(j=i.RG16F),Y===i.UNSIGNED_BYTE&&(j=i.RG8),Y===i.UNSIGNED_SHORT&&Me&&(j=Me.RG16_EXT),Y===i.SHORT&&Me&&(j=Me.RG16_SNORM_EXT)),S===i.RG_INTEGER&&(Y===i.UNSIGNED_BYTE&&(j=i.RG8UI),Y===i.UNSIGNED_SHORT&&(j=i.RG16UI),Y===i.UNSIGNED_INT&&(j=i.RG32UI),Y===i.BYTE&&(j=i.RG8I),Y===i.SHORT&&(j=i.RG16I),Y===i.INT&&(j=i.RG32I)),S===i.RGB_INTEGER&&(Y===i.UNSIGNED_BYTE&&(j=i.RGB8UI),Y===i.UNSIGNED_SHORT&&(j=i.RGB16UI),Y===i.UNSIGNED_INT&&(j=i.RGB32UI),Y===i.BYTE&&(j=i.RGB8I),Y===i.SHORT&&(j=i.RGB16I),Y===i.INT&&(j=i.RGB32I)),S===i.RGBA_INTEGER&&(Y===i.UNSIGNED_BYTE&&(j=i.RGBA8UI),Y===i.UNSIGNED_SHORT&&(j=i.RGBA16UI),Y===i.UNSIGNED_INT&&(j=i.RGBA32UI),Y===i.BYTE&&(j=i.RGBA8I),Y===i.SHORT&&(j=i.RGBA16I),Y===i.INT&&(j=i.RGBA32I)),S===i.RGB&&(Y===i.UNSIGNED_SHORT&&Me&&(j=Me.RGB16_EXT),Y===i.SHORT&&Me&&(j=Me.RGB16_SNORM_EXT),Y===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),Y===i.UNSIGNED_INT_10F_11F_11F_REV&&(j=i.R11F_G11F_B10F)),S===i.RGBA){let Q=fe?hr:rt.getTransfer(ie);Y===i.FLOAT&&(j=i.RGBA32F),Y===i.HALF_FLOAT&&(j=i.RGBA16F),Y===i.UNSIGNED_BYTE&&(j=Q===pt?i.SRGB8_ALPHA8:i.RGBA8),Y===i.UNSIGNED_SHORT&&Me&&(j=Me.RGBA16_EXT),Y===i.SHORT&&Me&&(j=Me.RGBA16_SNORM_EXT),Y===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),Y===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function g(P,S){let Y;return P?S===null||S===Cn||S===ki?Y=i.DEPTH24_STENCIL8:S===bn?Y=i.DEPTH32F_STENCIL8:S===Us&&(Y=i.DEPTH24_STENCIL8,He("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Cn||S===ki?Y=i.DEPTH_COMPONENT24:S===bn?Y=i.DEPTH_COMPONENT32F:S===Us&&(Y=i.DEPTH_COMPONENT16),Y}function M(P,S){return b(P)===!0||P.isFramebufferTexture&&P.minFilter!==Xt&&P.minFilter!==rn?Math.log2(Math.max(S.width,S.height))+1:P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?S.mipmaps.length:1}function C(P){let S=new WeakRef(P);n.get(P).__ref=S,p.add(S),y.register(P,S,S)}function A(P){let S=n.get(P).__ref;S!==void 0&&(p.delete(S),y.unregister(S))}function I(P){O(P.target)}function N(P){R(P.target)}function O(P){P.removeEventListener("dispose",I),A(P),H(P),P.isVideoTexture&&h.delete(P),P.isHTMLTexture&&d.delete(P)}function R(P){P.removeEventListener("dispose",N),A(P),V(P)}function U(){for(let P of p){let S=P.deref();S!==void 0&&(S.isRenderTarget===!0?R(S):O(S))}p.clear(),d.clear()}function H(P){let S=n.get(P);if(S.__webglInit===void 0)return;let Y=P.source,le=f.get(Y);if(le){let ie=le[S.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&z(P),Object.keys(le).length===0&&f.delete(Y)}n.remove(P)}function z(P){let S=n.get(P);i.deleteTexture(S.__webglTexture);let Y=P.source,le=f.get(Y);delete le[S.__cacheKey],o.memory.textures--}function V(P){let S=n.get(P);S.__depthDisposeCallback&&S.__depthDisposeCallback();let Y=P.depthTexture;if(Y&&Y.renderTarget===P&&O(Y),P.isWebGLCubeRenderTarget)for(let ie=0;ie<6;ie++){if(Array.isArray(S.__webglFramebuffer[ie]))for(let fe=0;fe<S.__webglFramebuffer[ie].length;fe++)i.deleteFramebuffer(S.__webglFramebuffer[ie][fe]);else i.deleteFramebuffer(S.__webglFramebuffer[ie]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[ie])}else{if(Array.isArray(S.__webglFramebuffer))for(let ie=0;ie<S.__webglFramebuffer.length;ie++)i.deleteFramebuffer(S.__webglFramebuffer[ie]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let ie=0;ie<S.__webglColorRenderbuffer.length;ie++)S.__webglColorRenderbuffer[ie]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[ie]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let le=P.textures;for(let ie=0,fe=le.length;ie<fe;ie++){let Me=n.get(le[ie]);Me.__webglTexture&&(i.deleteTexture(Me.__webglTexture),o.memory.textures--),n.remove(le[ie])}n.remove(P)}let G=0;function K(){G=0}function W(){return G}function oe(P){G=P}function ue(){let P=G;return P>=s.maxTextures&&He("WebGLTextures: Trying to use "+(P+1)+" texture units while this GPU supports only "+s.maxTextures),G+=1,P}function Z(P){let S=[];return S.push(P.wrapS),S.push(P.wrapT),S.push(P.wrapR||0),S.push(P.magFilter),S.push(P.minFilter),S.push(P.anisotropy),S.push(P.internalFormat),S.push(P.format),S.push(P.type),S.push(P.generateMipmaps),S.push(P.mipmapsAutoUpdate),S.push(P.premultiplyAlpha),S.push(P.flipY),S.push(P.unpackAlignment),S.push(P.colorSpace),S.join()}function k(P,S){let Y=n.get(P);if(P.isVideoTexture&&Pt(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&Y.__version!==P.version){let le=P.image;if(le===null)He("WebGLRenderer: Texture marked for update but no image data found.");else if(le.complete===!1)He("WebGLRenderer: Texture marked for update but image is incomplete");else{de(Y,P,S);return}}else P.isExternalTexture&&(Y.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,Y.__webglTexture,i.TEXTURE0+S)}function re(P,S){let Y=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&Y.__version!==P.version){de(Y,P,S);return}else P.isExternalTexture&&(Y.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,Y.__webglTexture,i.TEXTURE0+S)}function Se(P,S){let Y=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&Y.__version!==P.version){de(Y,P,S);return}t.bindTexture(i.TEXTURE_3D,Y.__webglTexture,i.TEXTURE0+S)}function ae(P,S){let Y=n.get(P);if(P.version>0&&Y.__version!==P.version){Ce(Y,P,S);return}t.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture,i.TEXTURE0+S)}let Re={[aa]:i.REPEAT,[Nn]:i.CLAMP_TO_EDGE,[la]:i.MIRRORED_REPEAT},qe={[Xt]:i.NEAREST,[ou]:i.NEAREST_MIPMAP_NEAREST,[jr]:i.NEAREST_MIPMAP_LINEAR,[rn]:i.LINEAR,[Ga]:i.LINEAR_MIPMAP_NEAREST,[ii]:i.LINEAR_MIPMAP_LINEAR},Ne={[hu]:i.NEVER,[$1]:i.ALWAYS,[uu]:i.LESS,[Z1]:i.LEQUAL,[du]:i.EQUAL,[J1]:i.GEQUAL,[fu]:i.GREATER,[pu]:i.NOTEQUAL};function Ge(P,S){if(S.type===bn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===rn||S.magFilter===Ga||S.magFilter===jr||S.magFilter===ii||S.minFilter===rn||S.minFilter===Ga||S.minFilter===jr||S.minFilter===ii)&&He("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(P,i.TEXTURE_WRAP_S,Re[S.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,Re[S.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,Re[S.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,qe[S.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,qe[S.minFilter]),S.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,Ne[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Xt||S.minFilter!==jr&&S.minFilter!==ii||S.type===bn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){let Y=e.get("EXT_texture_filter_anisotropic");i.texParameterf(P,Y.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function et(P,S){let Y=!1;P.__webglInit===void 0&&(P.__webglInit=!0,S.addEventListener("dispose",I),C(S));let le=S.source,ie=f.get(le);ie===void 0&&(ie={},f.set(le,ie));let fe=Z(S);if(fe!==P.__cacheKey){ie[fe]===void 0&&(ie[fe]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,Y=!0),ie[fe].usedTimes++;let Me=ie[P.__cacheKey];Me!==void 0&&(ie[P.__cacheKey].usedTimes--,Me.usedTimes===0&&z(S)),P.__cacheKey=fe,P.__webglTexture=ie[fe].texture}return Y}function te(P,S,Y){return Math.floor(Math.floor(P/Y)/S)}function ge(P,S,Y,le){let fe=P.updateRanges;if(fe.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,S.width,S.height,Y,le,S.data);else{fe.sort((D,ee)=>D.start-ee.start);let Me=0;for(let D=1;D<fe.length;D++){let ee=fe[Me],$=fe[D],xe=ee.start+ee.count,he=te($.start,S.width,4),pe=te(ee.start,S.width,4);$.start<=xe+1&&he===pe&&te($.start+$.count-1,S.width,4)===he?ee.count=Math.max(ee.count,$.start+$.count-ee.start):(++Me,fe[Me]=$)}fe.length=Me+1;let j=t.getParameter(i.UNPACK_ROW_LENGTH),Q=t.getParameter(i.UNPACK_SKIP_PIXELS),_e=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,S.width);for(let D=0,ee=fe.length;D<ee;D++){let $=fe[D],xe=Math.floor($.start/4),he=Math.ceil($.count/4),pe=xe%S.width,Oe=Math.floor(xe/S.width),tt=he,ce=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,pe),t.pixelStorei(i.UNPACK_SKIP_ROWS,Oe),t.texSubImage2D(i.TEXTURE_2D,0,pe,Oe,tt,ce,Y,le,S.data)}P.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,j),t.pixelStorei(i.UNPACK_SKIP_PIXELS,Q),t.pixelStorei(i.UNPACK_SKIP_ROWS,_e)}}function de(P,S,Y){let le=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(le=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(le=i.TEXTURE_3D);let ie=et(P,S),fe=S.source;t.bindTexture(le,P.__webglTexture,i.TEXTURE0+Y);let Me=n.get(fe);if(fe.version!==Me.__version||ie===!0){if(t.activeTexture(i.TEXTURE0+Y),(typeof ImageBitmap!="undefined"&&S.image instanceof ImageBitmap)===!1){let ce=rt.getPrimaries(rt.workingColorSpace),Be=S.colorSpace===ri?null:rt.getPrimaries(S.colorSpace),je=S.colorSpace===ri||ce===Be?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,je)}t.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment);let Q=v(S.image,!1,s.maxTextureSize);Q=ze(S,Q);let _e=r.convert(S.format,S.colorSpace),D=r.convert(S.type),ee=w(S.internalFormat,_e,D,S.normalized,S.colorSpace,S.isVideoTexture);Ge(le,S);let $,xe=S.mipmaps,he=S.isVideoTexture!==!0,pe=Me.__version===void 0||ie===!0,Oe=fe.dataReady,tt=M(S,Q);if(S.isDepthTexture)ee=g(S.format===si,S.type),pe&&(he?t.texStorage2D(i.TEXTURE_2D,1,ee,Q.width,Q.height):t.texImage2D(i.TEXTURE_2D,0,ee,Q.width,Q.height,0,_e,D,null));else if(S.isDataTexture)if(xe.length>0){he&&pe&&t.texStorage2D(i.TEXTURE_2D,tt,ee,xe[0].width,xe[0].height);for(let ce=0,Be=xe.length;ce<Be;ce++)$=xe[ce],he?Oe&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,$.width,$.height,_e,D,$.data):t.texImage2D(i.TEXTURE_2D,ce,ee,$.width,$.height,0,_e,D,$.data);S.generateMipmaps=!1}else he?(pe&&t.texStorage2D(i.TEXTURE_2D,tt,ee,Q.width,Q.height),Oe&&ge(S,Q,_e,D)):t.texImage2D(i.TEXTURE_2D,0,ee,Q.width,Q.height,0,_e,D,Q.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){he&&pe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,tt,ee,xe[0].width,xe[0].height,Q.depth);for(let ce=0,Be=xe.length;ce<Be;ce++)if($=xe[ce],S.format!==Pn)if(_e!==null)if(he){if(Oe)if(S.layerUpdates.size>0){let je=ac($.width,$.height,S.format,S.type);for(let we of S.layerUpdates){let _t=$.data.subarray(we*je/$.data.BYTES_PER_ELEMENT,(we+1)*je/$.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,we,$.width,$.height,1,_e,_t)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,0,$.width,$.height,Q.depth,_e,$.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ce,ee,$.width,$.height,Q.depth,0,$.data,0,0);else He("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else he?Oe&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,0,$.width,$.height,Q.depth,_e,D,$.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ce,ee,$.width,$.height,Q.depth,0,_e,D,$.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{he&&pe&&t.texStorage2D(i.TEXTURE_2D,tt,ee,xe[0].width,xe[0].height);for(let ce=0,Be=xe.length;ce<Be;ce++)$=xe[ce],S.format!==Pn?_e!==null?he?Oe&&t.compressedTexSubImage2D(i.TEXTURE_2D,ce,0,0,$.width,$.height,_e,$.data):t.compressedTexImage2D(i.TEXTURE_2D,ce,ee,$.width,$.height,0,$.data):He("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):he?Oe&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,$.width,$.height,_e,D,$.data):t.texImage2D(i.TEXTURE_2D,ce,ee,$.width,$.height,0,_e,D,$.data)}else if(S.isDataArrayTexture)if(he){if(pe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,tt,ee,Q.width,Q.height,Q.depth),Oe)if(S.layerUpdates.size>0){let ce=ac(Q.width,Q.height,S.format,S.type);for(let Be of S.layerUpdates){let je=Q.data.subarray(Be*ce/Q.data.BYTES_PER_ELEMENT,(Be+1)*ce/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Be,Q.width,Q.height,1,_e,D,je)}S.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,_e,D,Q.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ee,Q.width,Q.height,Q.depth,0,_e,D,Q.data);else if(S.isData3DTexture)he?(pe&&t.texStorage3D(i.TEXTURE_3D,tt,ee,Q.width,Q.height,Q.depth),Oe&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,_e,D,Q.data)):t.texImage3D(i.TEXTURE_3D,0,ee,Q.width,Q.height,Q.depth,0,_e,D,Q.data);else if(S.isFramebufferTexture){if(pe)if(he)t.texStorage2D(i.TEXTURE_2D,tt,ee,Q.width,Q.height);else{let ce=Q.width,Be=Q.height;for(let je=0;je<tt;je++)t.texImage2D(i.TEXTURE_2D,je,ee,ce,Be,0,_e,D,null),ce>>=1,Be>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in i){let ce=i.canvas;if(ce.hasAttribute("layoutsubtree")||ce.setAttribute("layoutsubtree","true"),Q.parentNode!==ce){ce.appendChild(Q),d.add(S),ce.onpaint=Be=>{let je=Be.changedElements;for(let we of d)je.includes(we.image)&&(we.needsUpdate=!0)},ce.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,Q);else{let je=i.RGBA,we=i.RGBA,_t=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,je,we,_t,Q)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(xe.length>0){if(he&&pe){let ce=We(xe[0]);t.texStorage2D(i.TEXTURE_2D,tt,ee,ce.width,ce.height)}for(let ce=0,Be=xe.length;ce<Be;ce++)$=xe[ce],he?Oe&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,_e,D,$):t.texImage2D(i.TEXTURE_2D,ce,ee,_e,D,$);S.generateMipmaps=!1}else if(he){if(pe){let ce=We(Q);t.texStorage2D(i.TEXTURE_2D,tt,ee,ce.width,ce.height)}Oe&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,_e,D,Q)}else t.texImage2D(i.TEXTURE_2D,0,ee,_e,D,Q);b(S)&&S.mipmapsAutoUpdate===!0&&x(le),Me.__version=fe.version,S.onUpdate&&S.onUpdate(S)}P.__version=S.version}function Ce(P,S,Y){if(S.image.length!==6)return;let le=et(P,S),ie=S.source;t.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+Y);let fe=n.get(ie);if(ie.version!==fe.__version||le===!0){t.activeTexture(i.TEXTURE0+Y);let Me=rt.getPrimaries(rt.workingColorSpace),j=S.colorSpace===ri?null:rt.getPrimaries(S.colorSpace),Q=S.colorSpace===ri||Me===j?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);let _e=S.isCompressedTexture||S.image[0].isCompressedTexture,D=S.image[0]&&S.image[0].isDataTexture,ee=[];for(let we=0;we<6;we++)!_e&&!D?ee[we]=v(S.image[we],!0,s.maxCubemapSize):ee[we]=D?S.image[we].image:S.image[we],ee[we]=ze(S,ee[we]);let $=ee[0],xe=r.convert(S.format,S.colorSpace),he=r.convert(S.type),pe=w(S.internalFormat,xe,he,S.normalized,S.colorSpace),Oe=S.isVideoTexture!==!0,tt=fe.__version===void 0||le===!0,ce=ie.dataReady,Be=M(S,$);Ge(i.TEXTURE_CUBE_MAP,S);let je;if(S.isDepthTexture){if(pe=g(S.format===si,S.type),tt)if(Oe)t.texStorage2D(i.TEXTURE_CUBE_MAP,1,pe,$.width,$.height);else for(let we=0;we<6;we++)t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+we,0,pe,$.width,$.height,0,xe,he,null)}else if(_e){Oe&&tt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Be,pe,$.width,$.height);for(let we=0;we<6;we++){je=ee[we].mipmaps;for(let _t=0;_t<je.length;_t++){let kt=je[_t];S.format!==Pn?xe!==null?Oe?ce&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+we,_t,0,0,kt.width,kt.height,xe,kt.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+we,_t,pe,kt.width,kt.height,0,kt.data):He("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Oe?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+we,_t,0,0,kt.width,kt.height,xe,he,kt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+we,_t,pe,kt.width,kt.height,0,xe,he,kt.data)}}}else{if(je=S.mipmaps,Oe&&tt){je.length>0&&Be++;let we=We(ee[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Be,pe,we.width,we.height)}for(let we=0;we<6;we++)if(D){Oe?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+we,0,0,0,ee[we].width,ee[we].height,xe,he,ee[we].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+we,0,pe,ee[we].width,ee[we].height,0,xe,he,ee[we].data);for(let _t=0;_t<je.length;_t++){let ai=je[_t].image[we].image;Oe?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+we,_t+1,0,0,ai.width,ai.height,xe,he,ai.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+we,_t+1,pe,ai.width,ai.height,0,xe,he,ai.data)}}else{Oe?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+we,0,0,0,xe,he,ee[we]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+we,0,pe,xe,he,ee[we]);for(let _t=0;_t<je.length;_t++){let kt=je[_t];Oe?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+we,_t+1,0,0,xe,he,kt.image[we]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+we,_t+1,pe,xe,he,kt.image[we])}}}b(S)&&S.mipmapsAutoUpdate===!0&&x(i.TEXTURE_CUBE_MAP),fe.__version=ie.version,S.onUpdate&&S.onUpdate(S)}P.__version=S.version}function Ee(P,S,Y,le,ie,fe){let Me=r.convert(Y.format,Y.colorSpace),j=r.convert(Y.type),Q=w(Y.internalFormat,Me,j,Y.normalized,Y.colorSpace),_e=n.get(S),D=n.get(Y);if(D.__renderTarget=S,!_e.__hasExternalTextures){let ee=Math.max(1,S.width>>fe),$=Math.max(1,S.height>>fe);ie===i.TEXTURE_3D||ie===i.TEXTURE_2D_ARRAY?t.texImage3D(ie,fe,Q,ee,$,S.depth,0,Me,j,null):t.texImage2D(ie,fe,Q,ee,$,0,Me,j,null)}t.bindFramebuffer(i.FRAMEBUFFER,P),ve(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,le,ie,D.__webglTexture,0,xt(S)):(ie===i.TEXTURE_2D||ie>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,le,ie,D.__webglTexture,fe),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Je(P,S,Y){if(i.bindRenderbuffer(i.RENDERBUFFER,P),S.depthBuffer){let le=S.depthTexture,ie=le&&le.isDepthTexture?le.type:null,fe=g(S.stencilBuffer,ie),Me=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ve(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,xt(S),fe,S.width,S.height):Y?i.renderbufferStorageMultisample(i.RENDERBUFFER,xt(S),fe,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,fe,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Me,i.RENDERBUFFER,P)}else{let le=S.textures;for(let ie=0;ie<le.length;ie++){let fe=le[ie],Me=r.convert(fe.format,fe.colorSpace),j=r.convert(fe.type),Q=w(fe.internalFormat,Me,j,fe.normalized,fe.colorSpace);ve(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,xt(S),Q,S.width,S.height):Y?i.renderbufferStorageMultisample(i.RENDERBUFFER,xt(S),Q,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,Q,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ue(P,S,Y){let le=S.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,P),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let ie=n.get(S.depthTexture);ie.__renderTarget=S;let fe=le?S.depthTexture.image[0]:S.depthTexture.image;(!ie.__webglTexture||fe.width!==S.width||fe.height!==S.height)&&(fe.width=S.width,fe.height=S.height,S.depthTexture.needsUpdate=!0),le?ae(S.depthTexture,0):k(S.depthTexture,0);let Me=ie.__webglTexture,j=xt(S),Q=le?i.TEXTURE_CUBE_MAP_POSITIVE_X+Y:i.TEXTURE_2D,_e=S.depthTexture.format===si?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(S.depthTexture.format===Kn)ve(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,_e,Q,Me,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,_e,Q,Me,0);else if(S.depthTexture.format===si)ve(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,_e,Q,Me,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,_e,Q,Me,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ot(P){let S=n.get(P),Y=P.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==P.depthTexture){let le=P.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),le){let ie=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,le.removeEventListener("dispose",ie)};le.addEventListener("dispose",ie),S.__depthDisposeCallback=ie}S.__boundDepthTexture=le}if(P.depthTexture&&!S.__autoAllocateDepthBuffer)if(Y)for(let le=0;le<6;le++)Ue(S.__webglFramebuffer[le],P,le);else P.texture.mipmaps.length>0?Ue(S.__webglFramebuffer[0],P,0):Ue(S.__webglFramebuffer,P,0);else if(Y){S.__webglDepthbuffer=[];for(let le=0;le<6;le++)if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[le]),S.__webglDepthbuffer[le]===void 0)S.__webglDepthbuffer[le]=i.createRenderbuffer(),Je(S.__webglDepthbuffer[le],P,!1);else{let ie=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=S.__webglDepthbuffer[le];i.bindRenderbuffer(i.RENDERBUFFER,fe),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,fe)}}else if(P.texture.mipmaps.length>0?t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),Je(S.__webglDepthbuffer,P,!1);else{let ie=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,fe),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,fe)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function lt(P,S,Y){let le=n.get(P);S!==void 0&&Ee(le.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),Y!==void 0&&ot(P)}function ft(P){let S=P.texture,Y=n.get(P),le=n.get(S);P.addEventListener("dispose",N),C(P);let ie=P.textures,fe=P.isWebGLCubeRenderTarget===!0,Me=ie.length>1;if(Me||(le.__webglTexture===void 0&&(le.__webglTexture=i.createTexture()),le.__version=S.version,o.memory.textures++),fe){Y.__webglFramebuffer=[];for(let j=0;j<6;j++)if(S.mipmaps.length>0){Y.__webglFramebuffer[j]=[];for(let Q=0;Q<S.mipmaps.length;Q++)Y.__webglFramebuffer[j][Q]=i.createFramebuffer()}else Y.__webglFramebuffer[j]=i.createFramebuffer()}else{if(S.mipmaps.length>0){Y.__webglFramebuffer=[];for(let j=0;j<S.mipmaps.length;j++)Y.__webglFramebuffer[j]=i.createFramebuffer()}else Y.__webglFramebuffer=i.createFramebuffer();if(Me)for(let j=0,Q=ie.length;j<Q;j++){let _e=n.get(ie[j]);_e.__webglTexture===void 0&&(_e.__webglTexture=i.createTexture(),o.memory.textures++)}if(P.samples>0&&ve(P)===!1){Y.__webglMultisampledFramebuffer=i.createFramebuffer(),Y.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let j=0;j<ie.length;j++){let Q=ie[j];Y.__webglColorRenderbuffer[j]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,Y.__webglColorRenderbuffer[j]);let _e=r.convert(Q.format,Q.colorSpace),D=r.convert(Q.type),ee=w(Q.internalFormat,_e,D,Q.normalized,Q.colorSpace,P.isXRRenderTarget===!0),$=xt(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,$,ee,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.RENDERBUFFER,Y.__webglColorRenderbuffer[j])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(Y.__webglDepthRenderbuffer=i.createRenderbuffer(),Je(Y.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(fe){t.bindTexture(i.TEXTURE_CUBE_MAP,le.__webglTexture),Ge(i.TEXTURE_CUBE_MAP,S);for(let j=0;j<6;j++)if(S.mipmaps.length>0)for(let Q=0;Q<S.mipmaps.length;Q++)Ee(Y.__webglFramebuffer[j][Q],P,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Q);else Ee(Y.__webglFramebuffer[j],P,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);b(S)?x(i.TEXTURE_CUBE_MAP):S.mipmaps.length>0&&i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}else if(Me){for(let j=0,Q=ie.length;j<Q;j++){let _e=ie[j],D=n.get(_e),ee=i.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ee=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ee,D.__webglTexture),Ge(ee,_e),Ee(Y.__webglFramebuffer,P,_e,i.COLOR_ATTACHMENT0+j,ee,0),b(_e)&&x(ee)}t.unbindTexture()}else{let j=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(j=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(j,le.__webglTexture),Ge(j,S),S.mipmaps.length>0)for(let Q=0;Q<S.mipmaps.length;Q++)Ee(Y.__webglFramebuffer[Q],P,S,i.COLOR_ATTACHMENT0,j,Q);else Ee(Y.__webglFramebuffer,P,S,i.COLOR_ATTACHMENT0,j,0);b(S)?x(j):S.mipmaps.length>0&&i.texParameteri(j,i.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}P.depthBuffer&&ot(P)}function B(P){let S=P.textures;for(let Y=0,le=S.length;Y<le;Y++){let ie=S[Y];if(b(ie)&&ie.mipmapsAutoUpdate===!0){let fe=T(P),Me=n.get(ie).__webglTexture;t.bindTexture(fe,Me),x(fe),t.unbindTexture()}}}let Lt=[];function st(P){if(P.samples>0){if(ve(P)===!1){let S=P.textures,Y=P.width,le=P.height,ie=i.COLOR_BUFFER_BIT,fe=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Me=n.get(P),j=S.length>1;if(j)for(let _e=0;_e<S.length;_e++)t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer),P.texture.mipmaps.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let _e=0;_e<S.length;_e++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(ie|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(ie|=i.STENCIL_BUFFER_BIT)),j){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Me.__webglColorRenderbuffer[_e]);let D=n.get(S[_e]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,D,0)}i.blitFramebuffer(0,0,Y,le,0,0,Y,le,ie,i.NEAREST),l===!0&&(Lt.length=0,Lt.push(i.COLOR_ATTACHMENT0+_e),P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&Lt.push(fe),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Lt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),j)for(let _e=0;_e<S.length;_e++){t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,Me.__webglColorRenderbuffer[_e]);let D=n.get(S[_e]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,D,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&l){let S=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function xt(P){return Math.min(s.maxSamples,P.samples)}function ve(P){let S=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Pt(P){let S=o.render.frame;h.get(P)!==S&&(h.set(P,S),P.update())}function ze(P,S){let Y=P.colorSpace,le=P.format,ie=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||Y!==cr&&Y!==ri&&(rt.getTransfer(Y)===pt?(le!==Pn||ie!==cn)&&He("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ke("WebGLTextures: Unsupported texture color space:",Y)),S}function We(P){return typeof HTMLImageElement!="undefined"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame!="undefined"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=ue,this.resetTextureUnits=K,this.getTextureUnits=W,this.setTextureUnits=oe,this.setTexture2D=k,this.setTexture2DArray=re,this.setTexture3D=Se,this.setTextureCube=ae,this.rebindTextures=lt,this.setupRenderTarget=ft,this.updateRenderTargetMipmap=B,this.updateMultisampleRenderTarget=st,this.setupDepthRenderbuffer=ot,this.setupFrameBufferTexture=Ee,this.useMultisampledRTT=ve,this.dispose=U}function O4(i,e){function t(n,s=ri){let r,o=rt.getTransfer(s);if(n===cn)return i.UNSIGNED_BYTE;if(n===Va)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Wa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===W1)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===X1)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===k1)return i.BYTE;if(n===V1)return i.SHORT;if(n===Us)return i.UNSIGNED_SHORT;if(n===ka)return i.INT;if(n===Cn)return i.UNSIGNED_INT;if(n===bn)return i.FLOAT;if(n===Zt)return i.HALF_FLOAT;if(n===Y1)return i.ALPHA;if(n===q1)return i.RGB;if(n===Pn)return i.RGBA;if(n===Kn)return i.DEPTH_COMPONENT;if(n===si)return i.DEPTH_STENCIL;if(n===Xa)return i.RED;if(n===Ya)return i.RED_INTEGER;if(n===Mi)return i.RG;if(n===qa)return i.RG_INTEGER;if(n===Za)return i.RGBA_INTEGER;if(n===Qr||n===eo||n===to||n===no)if(o===pt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Qr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===to)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===no)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Qr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===eo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===to)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===no)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ja||n===$a||n===Ka||n===ja)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ja)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===$a)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ka)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ja)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Qa||n===el||n===tl||n===nl||n===il||n===io||n===sl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Qa||n===el)return o===pt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===tl)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===nl)return r.COMPRESSED_R11_EAC;if(n===il)return r.COMPRESSED_SIGNED_R11_EAC;if(n===io)return r.COMPRESSED_RG11_EAC;if(n===sl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===rl||n===ol||n===al||n===ll||n===cl||n===hl||n===ul||n===dl||n===fl||n===pl||n===ml||n===gl||n===_l||n===xl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===rl)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ol)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===al)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ll)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===cl)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===hl)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ul)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===dl)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===fl)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===pl)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ml)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===gl)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===_l)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===xl)return o===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===yl||n===vl||n===Ml)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===yl)return o===pt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===vl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ml)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===bl||n===Sl||n===so||n===El)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===bl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Sl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===so)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===El)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ki?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var F4=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,B4=`
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

}`,Mc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Er(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ct({vertexShader:F4,fragmentShader:B4,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new se(new Fi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},bc=class extends Rn{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,p=null,y=typeof XRWebGLBinding!="undefined",_=new Mc,m={},v=t.getContextAttributes(),b=null,x=null,T=[],w=[],g=new ne,M=null,C=null,A=new sn;A.viewport=new Et;let I=new sn;I.viewport=new Et;let N=[A,I],O=new Ua,R=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let k=T[Z];return k===void 0&&(k=new Ms,T[Z]=k),k.getTargetRaySpace()},this.getControllerGrip=function(Z){let k=T[Z];return k===void 0&&(k=new Ms,T[Z]=k),k.getGripSpace()},this.getHand=function(Z){let k=T[Z];return k===void 0&&(k=new Ms,T[Z]=k),k.getHandSpace()};function H(Z){let k=w.indexOf(Z.inputSource);if(k===-1)return;let re=T[k];re!==void 0&&(re.update(Z.inputSource,Z.frame,c||o),re.dispatchEvent({type:Z.type,data:Z.inputSource}))}function z(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",V);for(let Z=0;Z<T.length;Z++){let k=w[Z];k!==null&&(w[Z]=null,T[Z].disconnect(k))}R=null,U=null,_.reset();for(let Z in m)delete m[Z];if(e.setRenderTarget(b),f=null,u=null,d=null,s=null,x=null,ue.stop(),n.isPresenting=!1,e.setPixelRatio(M),e.setSize(g.width,g.height,!1),C!==null){let Z=C.camera;Z.fov=C.fov,Z.zoom=C.zoom,Z.updateProjectionMatrix(),C=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&He("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&He("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&y&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(b=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",z),s.addEventListener("inputsourceschange",V),v.xrCompatible!==!0&&await t.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(g),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let re=null,Se=null,ae=null;v.depth&&(ae=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=v.stencil?si:Kn,Se=v.stencil?ki:Cn);let Re={colorFormat:t.RGBA8,depthFormat:ae,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Re),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),x=new Ft(u.textureWidth,u.textureHeight,{format:Pn,type:cn,depthTexture:new ei(u.textureWidth,u.textureHeight,Se,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let re={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,re),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new Ft(f.framebufferWidth,f.framebufferHeight,{format:Pn,type:cn,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),ue.setContext(s),ue.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function V(Z){for(let k=0;k<Z.removed.length;k++){let re=Z.removed[k],Se=w.indexOf(re);Se>=0&&(w[Se]=null,T[Se].disconnect(re))}for(let k=0;k<Z.added.length;k++){let re=Z.added[k],Se=w.indexOf(re);if(Se===-1){for(let Re=0;Re<T.length;Re++)if(Re>=w.length){w.push(re),Se=Re;break}else if(w[Re]===null){w[Re]=re,Se=Re;break}if(Se===-1)break}let ae=T[Se];ae&&ae.connect(re)}}function G(Z,k){k===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(k.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let k=Z.near,re=Z.far;_.texture!==null&&(_.depthNear>0&&(k=_.depthNear),_.depthFar>0&&(re=_.depthFar)),O.near=I.near=A.near=k,O.far=I.far=A.far=re,(R!==O.near||U!==O.far)&&(s.updateRenderState({depthNear:O.near,depthFar:O.far}),R=O.near,U=O.far),O.layers.mask=Z.layers.mask|6,A.layers.mask=O.layers.mask&-5,I.layers.mask=O.layers.mask&-3;let Se=Z.parent,ae=O.cameras;G(O,Se);for(let Re=0;Re<ae.length;Re++)G(ae[Re],Se);O.projectionMatrix.copy(A.projectionMatrix),O.projectionMatrixInverse.copy(A.projectionMatrixInverse),C===null&&Z.isPerspectiveCamera&&(C={camera:Z,fov:Z.fov,zoom:Z.zoom}),K(Z,O,Se)};function K(Z,k,re){re===null?Z.matrix.copy(k.matrixWorld):(Z.matrix.copy(re.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(k.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(k.projectionMatrix),Z.projectionMatrixInverse.copy(k.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=xs*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(Z){l=Z,u!==null&&(u.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(O)},this.getCameraTexture=function(Z){return m[Z]};let W=null;function oe(Z,k){if(h=k.getViewerPose(c||o),p=k,h!==null){let re=h.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let Se=!1;re.length!==O.cameras.length&&(O.cameras.length=0,Se=!0);for(let Ne=0;Ne<re.length;Ne++){let Ge=re[Ne],et=null;if(f!==null)et=f.getViewport(Ge);else{let ge=d.getViewSubImage(u,Ge);et=ge.viewport,Ne===0&&(e.setRenderTargetTextures(x,ge.colorTexture,ge.depthStencilTexture),e.setRenderTarget(x))}let te=N[Ne];te===void 0&&(te=new sn,te.layers.enable(Ne),te.viewport=new Et,N[Ne]=te),te.matrix.fromArray(Ge.transform.matrix),te.matrix.decompose(te.position,te.quaternion,te.scale),te.projectionMatrix.fromArray(Ge.projectionMatrix),te.projectionMatrixInverse.copy(te.projectionMatrix).invert(),te.viewport.set(et.x,et.y,et.width,et.height),Ne===0&&(O.matrix.copy(te.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Se===!0&&O.cameras.push(te)}let ae=s.enabledFeatures;if(ae&&ae.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){d=n.getBinding();let Ne=d.getDepthInformation(re[0]);Ne&&Ne.isValid&&Ne.texture&&_.init(Ne,s.renderState)}if(ae&&ae.includes("camera-access")&&y){e.state.unbindTexture(),d=n.getBinding();for(let Ne=0;Ne<re.length;Ne++){let Ge=re[Ne].camera;if(Ge){let et=m[Ge];et||(et=new Er,m[Ge]=et);let te=d.getCameraImage(Ge);et.sourceTexture=te}}}}for(let re=0;re<T.length;re++){let Se=w[re],ae=T[re];Se!==null&&ae!==void 0&&ae.update(Se,k,c||o)}W&&W(Z,k),k.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:k}),p=null}let ue=new Zu;ue.setAnimationLoop(oe),this.setAnimationLoop=function(Z){W=Z},this.dispose=function(){}}},z4=new Ke,sd=new Ye;sd.set(-1,0,0,0,1,0,0,0,1);function H4(i,e){function t(_,m){_.matrixAutoUpdate===!0&&_.updateMatrix(),m.value.copy(_.matrix)}function n(_,m){m.color.getRGB(_.fogColor.value,sc(i)),m.isFog?(_.fogNear.value=m.near,_.fogFar.value=m.far):m.isFogExp2&&(_.fogDensity.value=m.density)}function s(_,m,v,b,x){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(_,m):m.isMeshLambertMaterial?(r(_,m),m.envMap&&(_.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(_,m),d(_,m)):m.isMeshPhongMaterial?(r(_,m),h(_,m),m.envMap&&(_.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(_,m),u(_,m),m.isMeshPhysicalMaterial&&f(_,m,x)):m.isMeshMatcapMaterial?(r(_,m),p(_,m)):m.isMeshDepthMaterial?r(_,m):m.isMeshDistanceMaterial?(r(_,m),y(_,m)):m.isMeshNormalMaterial?r(_,m):m.isLineBasicMaterial?(o(_,m),m.isLineDashedMaterial&&a(_,m)):m.isPointsMaterial?l(_,m,v,b):m.isSpriteMaterial?c(_,m):m.isShadowMaterial?(_.color.value.copy(m.color),_.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(_,m){_.opacity.value=m.opacity,m.color&&_.diffuse.value.copy(m.color),m.emissive&&_.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(_.map.value=m.map,t(m.map,_.mapTransform)),m.alphaMap&&(_.alphaMap.value=m.alphaMap,t(m.alphaMap,_.alphaMapTransform)),m.bumpMap&&(_.bumpMap.value=m.bumpMap,t(m.bumpMap,_.bumpMapTransform),_.bumpScale.value=m.bumpScale,m.side===qt&&(_.bumpScale.value*=-1)),m.normalMap&&(_.normalMap.value=m.normalMap,t(m.normalMap,_.normalMapTransform),_.normalScale.value.copy(m.normalScale),m.side===qt&&_.normalScale.value.negate()),m.displacementMap&&(_.displacementMap.value=m.displacementMap,t(m.displacementMap,_.displacementMapTransform),_.displacementScale.value=m.displacementScale,_.displacementBias.value=m.displacementBias),m.emissiveMap&&(_.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,_.emissiveMapTransform)),m.specularMap&&(_.specularMap.value=m.specularMap,t(m.specularMap,_.specularMapTransform)),m.alphaTest>0&&(_.alphaTest.value=m.alphaTest);let v=e.get(m),b=v.envMap,x=v.envMapRotation;b&&(_.envMap.value=b,_.envMapRotation.value.setFromMatrix4(z4.makeRotationFromEuler(x)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&_.envMapRotation.value.premultiply(sd),_.reflectivity.value=m.reflectivity,_.ior.value=m.ior,_.refractionRatio.value=m.refractionRatio),m.lightMap&&(_.lightMap.value=m.lightMap,_.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,_.lightMapTransform)),m.aoMap&&(_.aoMap.value=m.aoMap,_.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,_.aoMapTransform))}function o(_,m){_.diffuse.value.copy(m.color),_.opacity.value=m.opacity,m.map&&(_.map.value=m.map,t(m.map,_.mapTransform))}function a(_,m){_.dashSize.value=m.dashSize,_.totalSize.value=m.dashSize+m.gapSize,_.scale.value=m.scale}function l(_,m,v,b){_.diffuse.value.copy(m.color),_.opacity.value=m.opacity,_.size.value=m.size*v,_.scale.value=b*.5,m.map&&(_.map.value=m.map,t(m.map,_.uvTransform)),m.alphaMap&&(_.alphaMap.value=m.alphaMap,t(m.alphaMap,_.alphaMapTransform)),m.alphaTest>0&&(_.alphaTest.value=m.alphaTest)}function c(_,m){_.diffuse.value.copy(m.color),_.opacity.value=m.opacity,_.rotation.value=m.rotation,m.map&&(_.map.value=m.map,t(m.map,_.mapTransform)),m.alphaMap&&(_.alphaMap.value=m.alphaMap,t(m.alphaMap,_.alphaMapTransform)),m.alphaTest>0&&(_.alphaTest.value=m.alphaTest)}function h(_,m){_.specular.value.copy(m.specular),_.shininess.value=Math.max(m.shininess,1e-4)}function d(_,m){m.gradientMap&&(_.gradientMap.value=m.gradientMap)}function u(_,m){_.metalness.value=m.metalness,m.metalnessMap&&(_.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,_.metalnessMapTransform)),_.roughness.value=m.roughness,m.roughnessMap&&(_.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,_.roughnessMapTransform)),m.envMap&&(_.envMapIntensity.value=m.envMapIntensity)}function f(_,m,v){_.ior.value=m.ior,m.diffuseRoughness>0&&(_.diffuseRoughness.value=m.diffuseRoughness,m.diffuseRoughnessMap&&(_.diffuseRoughnessMap.value=m.diffuseRoughnessMap,t(m.diffuseRoughnessMap,_.diffuseRoughnessMapTransform))),m.sheen>0&&(_.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),_.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(_.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,_.sheenColorMapTransform)),m.sheenRoughnessMap&&(_.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,_.sheenRoughnessMapTransform))),m.clearcoat>0&&(_.clearcoat.value=m.clearcoat,_.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(_.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,_.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(_.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,_.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(_.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,_.clearcoatNormalMapTransform),_.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===qt&&_.clearcoatNormalScale.value.negate())),m.dispersion>0&&(_.dispersion.value=m.dispersion),m.retroreflectivity>0&&(_.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(_.iridescence.value=m.iridescence,_.iridescenceIOR.value=m.iridescenceIOR,_.iridescenceThicknessMinimum.value=m.iridescenceThicknessMinimum,_.iridescenceThicknessMaximum.value=m.iridescenceThicknessMaximum,m.iridescenceMap&&(_.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,_.iridescenceMapTransform)),m.iridescenceThicknessMap&&(_.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,_.iridescenceThicknessMapTransform))),m.transmission>0&&(_.transmission.value=m.transmission,_.transmissionSamplerMap.value=v.texture,_.transmissionSamplerSize.value.set(v.width,v.height),m.transmissionMap&&(_.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,_.transmissionMapTransform)),_.thickness.value=m.thickness,m.thicknessMap&&(_.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,_.thicknessMapTransform)),_.attenuationDistance.value=m.attenuationDistance,_.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(_.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(_.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,_.anisotropyMapTransform))),_.specularIntensity.value=m.specularIntensity,_.specularColor.value.copy(m.specularColor),m.specularColorMap&&(_.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,_.specularColorMapTransform)),m.specularIntensityMap&&(_.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,_.specularIntensityMapTransform))}function p(_,m){m.matcap&&(_.matcap.value=m.matcap)}function y(_,m){let v=e.get(m).light;_.referencePosition.value.setFromMatrixPosition(v.matrixWorld),_.nearDistance.value=v.shadow.camera.near,_.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function G4(i,e,t,n){let s={},r={};function o(v,b){let x=b.program;n.uniformBlockBinding(v,x,s[v.id])}function a(v,b){let x=s[v.id];x===void 0&&(p(v),x=l(v),s[v.id]=x,v.addEventListener("dispose",_));let T=b.program;n.updateUBOMapping(v,T);let w=e.render.frame;r[v.id]!==w&&(c(v),r[v.id]=w)}function l(v){let b=i.createBuffer(),x=v.__size,T=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,x,T),i.bindBuffer(i.UNIFORM_BUFFER,null),b}function c(v){let b=s[v.id],x=v.uniforms,T=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let w=0,g=x.length;w<g;w++){let M=x[w];if(Array.isArray(M))for(let C=0,A=M.length;C<A;C++)h(M[C],w,C,T);else h(M,w,0,T)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(v,b,x,T){if(u(v,b,x,T)===!0){let w=v.__offset,g=v.value;if(Array.isArray(g)){let M=0;for(let C=0;C<g.length;C++){let A=g[C],I=y(A,!0);d(A,v.__data,M),M+=I.storage/Float32Array.BYTES_PER_ELEMENT}}else d(g,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,w,v.__data)}}function d(v,b,x){typeof v=="number"||typeof v=="boolean"?b[x]=v:v.isMatrix3?(b[x]=v.elements[0],b[x+1]=v.elements[1],b[x+2]=v.elements[2],b[x+3]=0,b[x+4]=v.elements[3],b[x+5]=v.elements[4],b[x+6]=v.elements[5],b[x+7]=0,b[x+8]=v.elements[6],b[x+9]=v.elements[7],b[x+10]=v.elements[8],b[x+11]=0):ArrayBuffer.isView(v)?b.set(v.subarray(0,b.length-x),x):v.toArray(b,x)}function u(v,b,x,T){let w=v.value,g=b+"_"+x;if(Array.isArray(w)){T[g]===void 0&&(T[g]=[]);let M=T[g],C=!1;for(let A=0;A<w.length;A++)f(w[A],M,A)===!0&&(C=!0);return C}return f(w,T,g)}function f(v,b,x){if(b[x]===void 0)return typeof v=="number"||typeof v=="boolean"?b[x]=v:ArrayBuffer.isView(v)?b[x]=v.slice():b[x]=v.clone(),!0;{let T=b[x];if(typeof v=="number"||typeof v=="boolean"){if(T!==v)return b[x]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(T.equals(v)===!1)return T.copy(v),!0}}return!1}function p(v){let b=v.uniforms,x=0,T=16;for(let g=0,M=b.length;g<M;g++){let C=Array.isArray(b[g])?b[g]:[b[g]];for(let A=0,I=C.length;A<I;A++){let N=C[A],O=Array.isArray(N.value)?N.value:[N.value],R=Array.isArray(b[g])||Array.isArray(N.value),U=x;for(let z=0,V=O.length;z<V;z++){let G=O[z],K=y(G,R),W=x%T,oe=W%K.boundary,ue=W+oe;x+=oe,ue!==0&&T-ue<K.storage&&(x+=T-ue),z===0&&(U=x),x+=K.storage}let H=N.type==="int"?Int32Array:N.type==="uint"?Uint32Array:Float32Array;N.__data=new H((x-U)/Float32Array.BYTES_PER_ELEMENT),N.__offset=U}}let w=x%T;return w>0&&(x+=T-w),v.__size=x,v.__cache={},this}function y(v,b){let x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=16,x.storage=48):v.isMatrix4?(x.boundary=16,x.storage=64):v.isTexture?He("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(x.boundary=16,x.storage=v.byteLength):He("WebGLRenderer: Unsupported uniform value type.",v),b===!0&&(x.boundary=16,x.storage=Math.ceil(x.storage/16)*16),x}function _(v){let b=v.target;b.removeEventListener("dispose",_),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function m(){for(let v in s)i.deleteBuffer(s[v]);s={},r={}}return{bind:o,update:a,dispose:m}}var k4=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Gn=null;function V4(){return Gn===null&&(Gn=new vr(k4,16,16,Mi,Zt),Gn.name="DFG_LUT",Gn.minFilter=rn,Gn.magFilter=rn,Gn.wrapS=Nn,Gn.wrapT=Nn,Gn.generateMipmaps=!1,Gn.needsUpdate=!0),Gn}var Pl=class{constructor(e={}){let{canvas:t=mu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=cn}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let y=f,_=new Set([Za,qa,Ya]),m=new Set([cn,Cn,Us,ki,Va,Wa]),v=new Uint32Array(4),b=new Int32Array(4),x={textures:[],min:[],max:[],resolution:[]},T=null,w=null,g=[],M=[],C=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Hn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let A=this,I=!1,N=null,O=null,R=null,U=null;this._outputColorSpace=fn;let H=0,z=0,V=null,G=-1,K=null,W=new Et,oe=new Et,ue=null,Z=new me(0),k=0,re=t.width,Se=t.height,ae=1,Re=null,qe=null,Ne=new Et(0,0,re,Se),Ge=new Et(0,0,re,Se),et=!1,te=new pi,ge=new fa,de=!1,Ce=!1,Ee=new Ke,Je=new L,Ue=new Et,ot={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},lt=!1;function ft(){return V===null?ae:1}let B=n;function Lt(E,F){return t.getContext(E,F)}let st,xt,ve,Pt,ze,We,P,S,Y,le,ie,fe,Me,j,Q,_e,D,ee,$,xe,he,pe,Oe;try{let E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"187"}`),t.addEventListener("webglcontextlost",Be,!1),t.addEventListener("webglcontextrestored",je,!1),t.addEventListener("webglcontextcreationerror",we,!1),B===null){let F="webgl2";if(B=Lt(F,E),B===null)throw Lt(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}tt()}catch(E){throw t.removeEventListener("webglcontextlost",Be,!1),t.removeEventListener("webglcontextrestored",je,!1),t.removeEventListener("webglcontextcreationerror",we,!1),ke("WebGLRenderer: "+E.message),E}function tt(){st=new e0(B),st.init(),he=new O4(B,st),xt=new Vm(B,st,e,he),ve=new N4(B,st),xt.reversedDepthBuffer&&u&&ve.buffers.depth.setReversed(!0),O=B.createFramebuffer(),R=B.createFramebuffer(),U=B.createFramebuffer(),Pt=new i0(B),ze=new v4,We=new U4(B,st,ve,ze,xt,he,Pt),P=new Qm(A),S=new rp(B),pe=new Gm(B,S),Y=new t0(B,S,Pt,pe),le=new r0(B,Y,S,pe,Pt),ee=new s0(B,xt,We),Q=new Wm(ze),ie=new y4(A,P,st,xt,pe,Q),fe=new H4(A,ze),Me=new b4,j=new R4(st),D=new Hm(A,P,ve,le,p,l),_e=new D4(A,le,xt),Oe=new G4(B,Pt,xt,ve),$=new km(B,st,Pt),xe=new n0(B,st,Pt),Pt.programs=ie.programs,A.capabilities=xt,A.extensions=st,A.properties=ze,A.renderLists=Me,A.shadowMap=_e,A.state=ve,A.info=Pt}y!==cn&&(C=new a0(y,t.width,t.height,a,s,r));let ce=new bc(A,B);this.xr=ce,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let E=st.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=st.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return ae},this.setPixelRatio=function(E){E!==void 0&&(ae=E,this.setSize(re,Se,!1))},this.getSize=function(E){return E.set(re,Se)},this.setSize=function(E,F,J=!0){if(ce.isPresenting){He("WebGLRenderer: Can't change size while VR device is presenting.");return}re=E,Se=F,t.width=Math.floor(E*ae),t.height=Math.floor(F*ae),J===!0&&(t.style.width=E+"px",t.style.height=F+"px"),C!==null&&C.setSize(t.width,t.height),this.setViewport(0,0,E,F)},this.getDrawingBufferSize=function(E){return E.set(re*ae,Se*ae).floor()},this.setDrawingBufferSize=function(E,F,J){re=E,Se=F,ae=J,t.width=Math.floor(E*J),t.height=Math.floor(F*J),this.setViewport(0,0,E,F)},this.setEffects=function(E){if(y===cn){ke("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let F=0;F<E.length;F++)if(E[F].isOutputPass===!0){He("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}C.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(W)},this.getViewport=function(E){return E.copy(Ne)},this.setViewport=function(E,F,J,X){E.isVector4?Ne.set(E.x,E.y,E.z,E.w):Ne.set(E,F,J,X),ve.viewport(W.copy(Ne).multiplyScalar(ft()).round())},this.getScissor=function(E){return E.copy(Ge)},this.setScissor=function(E,F,J,X){E.isVector4?Ge.set(E.x,E.y,E.z,E.w):Ge.set(E,F,J,X),ve.scissor(oe.copy(Ge).multiplyScalar(ft()).round())},this.getScissorTest=function(){return et},this.setScissorTest=function(E){ve.setScissorTest(et=E)},this.setOpaqueSort=function(E){Re=E},this.setTransparentSort=function(E){qe=E},this.getClearColor=function(E){return E.copy(D.getClearColor())},this.setClearColor=function(){D.setClearColor(...arguments)},this.getClearAlpha=function(){return D.getClearAlpha()},this.setClearAlpha=function(){D.setClearAlpha(...arguments)},this.clear=function(E=!0,F=!0,J=!0){let X=0;if(E){let q=!1;if(V!==null){let be=V.texture.format;q=_.has(be)}if(q){let be=V.texture.type,Pe=m.has(be),ye=D.getClearColor(),Ae=D.getClearAlpha(),De=ye.r,Ze=ye.g,ct=ye.b;Pe?(v[0]=De,v[1]=Ze,v[2]=ct,v[3]=Ae,B.clearBufferuiv(B.COLOR,0,v)):(b[0]=De,b[1]=Ze,b[2]=ct,b[3]=Ae,B.clearBufferiv(B.COLOR,0,b))}else X|=B.COLOR_BUFFER_BIT}F&&(X|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),J&&(X|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&B.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),N=E},this.dispose=function(){t.removeEventListener("webglcontextlost",Be,!1),t.removeEventListener("webglcontextrestored",je,!1),t.removeEventListener("webglcontextcreationerror",we,!1),D.dispose(),Me.dispose(),j.dispose(),We.dispose(),ze.dispose(),P.dispose(),le.dispose(),Y.dispose(),pe.dispose(),Oe.dispose(),ie.dispose(),ce.dispose(),ce.removeEventListener("sessionstart",Gc),ce.removeEventListener("sessionend",kc),wi.stop()};function Be(E){E.preventDefault(),dr("WebGLRenderer: Context Lost."),I=!0}function je(){dr("WebGLRenderer: Context Restored."),I=!1;let E=Pt.autoReset,F=_e.enabled,J=_e.autoUpdate,X=_e.needsUpdate,q=_e.type;tt(),Pt.autoReset=E,_e.enabled=F,_e.autoUpdate=J,_e.needsUpdate=X,_e.type=q}function we(E){ke("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function _t(E){let F=E.target;F.removeEventListener("dispose",_t),kt(F)}function kt(E){ai(E),ze.remove(E)}function ai(E){let F=ze.get(E).programs;F!==void 0&&(F.forEach(function(J){ie.releaseProgram(J)}),E.isShaderMaterial&&ie.releaseShaderCache(E))}this.renderBufferDirect=function(E,F,J,X,q,be){F===null&&(F=ot);let Pe=q.isMesh&&q.matrixWorld.determinantAffine()<0,ye=R2(E,F,J,X,q);ve.setMaterial(X,Pe);let Ae=J.index,De=1;if(X.wireframe===!0){if(Ae=Y.getWireframeAttribute(J),Ae===void 0)return;De=2}let Ze=J.drawRange,ct=J.attributes.position,Ie=Ze.start*De,ht=(Ze.start+Ze.count)*De;be!==null&&(Ie=Math.max(Ie,be.start*De),ht=Math.min(ht,(be.start+be.count)*De)),Ae!==null?(Ie=Math.max(Ie,0),ht=Math.min(ht,Ae.count)):ct!=null&&(Ie=Math.max(Ie,0),ht=Math.min(ht,ct.count));let Dt=ht-Ie;if(Dt<0||Dt===1/0)return;pe.setup(q,X,ye,J,Ae);let vt,yt=$;if(Ae!==null&&(vt=S.get(Ae),yt=xe,yt.setIndex(vt)),q.isMesh)X.wireframe===!0?(ve.setLineWidth(X.wireframeLinewidth*ft()),yt.setMode(B.LINES)):yt.setMode(B.TRIANGLES);else if(q.isLine){let $t=X.linewidth;$t===void 0&&($t=1),ve.setLineWidth($t*ft()),q.isLineSegments?yt.setMode(B.LINES):q.isLineLoop?yt.setMode(B.LINE_LOOP):yt.setMode(B.LINE_STRIP)}else q.isPoints?yt.setMode(B.POINTS):q.isSprite&&yt.setMode(B.TRIANGLES);if(q.isBatchedMesh)if(st.get("WEBGL_multi_draw"))yt.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{let $t=q._multiDrawStarts,Le=q._multiDrawCounts,tn=q._multiDrawCount,mt=Ae?S.get(Ae).bytesPerElement:1,Ai=ze.get(X).currentProgram.getUniforms();for(let Kt=0;Kt<tn;Kt++)Ai.setValue(B,"_gl_DrawID",Kt),yt.render($t[Kt]/mt,Le[Kt])}else if(q.isInstancedMesh)yt.renderInstances(Ie,Dt,q.count);else if(J.isInstancedBufferGeometry){let $t=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Le=Math.min(J.instanceCount,$t);yt.renderInstances(Ie,Dt,Le)}else yt.render(Ie,Dt)};function Hc(E,F,J,X){N!==null&&E.isNodeMaterial&&N.setObject(X,E),de===!0&&Q.setState(E,J,!1),E.transparent===!0&&E.side===ln&&E.forceSinglePass===!1?(E.side=qt,E.needsUpdate=!0,Xs(E,F,X),E.side=vi,E.needsUpdate=!0,Xs(E,F,X),E.side=ln):Xs(E,F,X)}this.compile=function(E,F,J=null){J===null&&(J=E),N!==null&&N.renderStart(E,F,J),w=j.get(J),w.init(F),M.push(w),J.traverseVisible(function(q){q.isLight&&q.layers.test(F.layers)&&(w.pushLight(q),q.castShadow&&w.pushShadow(q))}),E!==J&&E.traverseVisible(function(q){q.isLight&&q.layers.test(F.layers)&&(w.pushLight(q),q.castShadow&&w.pushShadow(q))}),w.setupLights(),N!==null&&N.updateLights(w.state.lightsArray),Ce=this.localClippingEnabled,de=Q.init(this.clippingPlanes,Ce),de===!0&&Q.setGlobalState(this.clippingPlanes,F),N!==null&&_e.render(w.state.shadowsArray,J,F);let X=new Set;return E.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;let be=q.material;if(be)if(Array.isArray(be))for(let Pe=0;Pe<be.length;Pe++){let ye=be[Pe];Hc(ye,J,F,q),X.add(ye)}else Hc(be,J,F,q),X.add(be)}),w=M.pop(),N!==null&&N.renderEnd(),X},this.compileAsync=function(E,F,J=null){let X=this.compile(E,F,J);return new Promise(q=>{function be(){if(X.forEach(function(Pe){let Ae=ze.get(Pe).currentProgram;(Ae===void 0||Ae.isReady())&&X.delete(Pe)}),X.size===0){q(E);return}setTimeout(be,10)}st.get("KHR_parallel_shader_compile")!==null?be():setTimeout(be,10)})};let $l=null;function w2(E){$l&&$l(E)}function Gc(){wi.stop()}function kc(){wi.start()}let wi=new Zu;wi.setAnimationLoop(w2),typeof self!="undefined"&&wi.setContext(self),this.setAnimationLoop=function(E){$l=E,ce.setAnimationLoop(E),E===null?wi.stop():wi.start()},ce.addEventListener("sessionstart",Gc),ce.addEventListener("sessionend",kc),this.render=function(E,F){if(F!==void 0&&F.isCamera!==!0){ke("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;N!==null&&N.renderStart(E,F);let J=ce.enabled===!0&&ce.isPresenting===!0,X=C!==null&&(V===null||J)&&C.begin(A,V);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ce.enabled===!0&&ce.isPresenting===!0&&(C===null||C.isCompositing()===!1)&&(ce.cameraAutoUpdate===!0&&ce.updateCamera(F),F=ce.getCamera()),E.isScene===!0&&E.onBeforeRender(A,E,F,V),w=j.get(E,M.length),w.init(F),w.state.textureUnits=We.getTextureUnits(),M.push(w),Ee.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),F.isArrayCamera?ge.setFromArrayCamera(F):te.setFromProjectionMatrix(Ee,vn,F.reversedDepth),Ce=this.localClippingEnabled,de=Q.init(this.clippingPlanes,Ce),T=Me.get(E,g.length),T.init(),g.push(T),this.info.render.frame++,ce.enabled===!0&&ce.isPresenting===!0){let Pe=A.xr.getDepthSensingMesh();Pe!==null&&Kl(Pe,F,-1/0,A.sortObjects)}Kl(E,F,0,A.sortObjects),T.finish(),N!==null&&N.updateLights(w.state.lightsArray),A.sortObjects===!0&&T.sort(Re,qe),lt=ce.enabled===!1||ce.isPresenting===!1||ce.hasDepthSensing()===!1,lt&&D.addToRenderList(T,E),this.info.autoReset===!0&&this.info.reset(),de===!0&&Q.beginShadows();let q=w.state.shadowsArray;if(_e.render(q,E,F),de===!0&&Q.endShadows(),(X&&C.hasRenderPass())===!1){let Pe=T.opaque,ye=T.transmissive;if(w.setupLights(),F.isArrayCamera){let Ae=F.cameras;if(ye.length>0)for(let De=0,Ze=Ae.length;De<Ze;De++){let ct=Ae[De];Wc(Pe,ye,E,ct)}lt&&D.render(E);for(let De=0,Ze=Ae.length;De<Ze;De++){let ct=Ae[De];Vc(T,E,ct,ct.viewport)}}else ye.length>0&&Wc(Pe,ye,E,F),lt&&D.render(E),Vc(T,E,F)}V!==null&&z===0&&(We.updateMultisampleRenderTarget(V),We.updateRenderTargetMipmap(V)),X&&C.end(A),E.isScene===!0&&E.onAfterRender(A,E,F),pe.resetDefaultState(),G=-1,K=null,M.pop(),M.length>0?(w=M[M.length-1],We.setTextureUnits(w.state.textureUnits),de===!0&&Q.setGlobalState(A.clippingPlanes,w.state.camera)):w=null,g.pop(),g.length>0?T=g[g.length-1]:T=null,N!==null&&N.renderEnd()};function Kl(E,F,J,X){if(E.visible===!1)return;if(E.layers.test(F.layers)){if(E.isGroup)J=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(F);else if(E.isLight)w.pushLight(E),E.castShadow&&w.pushShadow(E);else if(E.isSprite){let Pe=F.isArrayCamera?ge:te;if(!E.frustumCulled||E.intersectsFrustum(Pe)){X&&Ue.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Ee);let ye=le.update(E),Ae=E.material;Ae.visible&&T.push(E,ye,Ae,J,Ue.z,null,F)}}else if(E.isMesh||E.isLine||E.isPoints){let Pe=F.isArrayCamera?ge:te;if(!E.frustumCulled||E.intersectsFrustum(Pe)){let ye=le.update(E),Ae=E.material;if(X&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ue.copy(E.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),Ue.copy(ye.boundingSphere.center)),Ue.applyMatrix4(E.matrixWorld).applyMatrix4(Ee)),Array.isArray(Ae)){let De=ye.groups;for(let Ze=0,ct=De.length;Ze<ct;Ze++){let Ie=De[Ze],ht=Ae[Ie.materialIndex];ht&&ht.visible&&T.push(E,ye,ht,J,Ue.z,Ie,F)}}else Ae.visible&&T.push(E,ye,Ae,J,Ue.z,null,F)}}}let be=E.children;for(let Pe=0,ye=be.length;Pe<ye;Pe++)Kl(be[Pe],F,J,X)}function Vc(E,F,J,X){let{opaque:q,transmissive:be,transparent:Pe}=E;w.setupLightsView(J),de===!0&&Q.setGlobalState(A.clippingPlanes,J),X&&ve.viewport(W.copy(X)),q.length>0&&vo(q,F,J),be.length>0&&vo(be,F,J),Pe.length>0&&vo(Pe,F,J),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function Wc(E,F,J,X){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[X.id]===void 0){let Ie=st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[X.id]=new Ft(1,1,{generateMipmaps:!0,type:Ie?Zt:cn,minFilter:ii,samples:Math.max(4,xt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:rt.workingColorSpace})}let be=w.state.transmissionRenderTarget[X.id],Pe=X.viewport||W;be.setSize(Pe.z*A.transmissionResolutionScale,Pe.w*A.transmissionResolutionScale);let ye=A.getRenderTarget(),Ae=A.getActiveCubeFace(),De=A.getActiveMipmapLevel();A.setRenderTarget(be),A.getClearColor(Z),k=A.getClearAlpha(),k<1&&A.setClearColor(16777215,.5),A.clear(),lt&&D.render(J);let Ze=A.toneMapping;A.toneMapping=Hn;let ct=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),w.setupLightsView(X),de===!0&&Q.setGlobalState(A.clippingPlanes,X),vo(E,J,X),We.updateMultisampleRenderTarget(be),We.updateRenderTargetMipmap(be),st.has("WEBGL_multisampled_render_to_texture")===!1){let Ie=!1;for(let ht=0,Dt=F.length;ht<Dt;ht++){let vt=F[ht],{object:yt,geometry:$t,material:Le,group:tn}=vt;if(Le.side===ln&&yt.layers.test(X.layers)){let mt=Le.side;Le.side=qt,Le.needsUpdate=!0,Xc(yt,J,X,$t,Le,tn),Le.side=mt,Le.needsUpdate=!0,Ie=!0}}Ie===!0&&(We.updateMultisampleRenderTarget(be),We.updateRenderTargetMipmap(be))}A.setRenderTarget(ye,Ae,De),A.setClearColor(Z,k),ct!==void 0&&(X.viewport=ct),A.toneMapping=Ze}function vo(E,F,J){let X=F.isScene===!0?F.overrideMaterial:null;for(let q=0,be=E.length;q<be;q++){let Pe=E[q],{object:ye,geometry:Ae,group:De}=Pe,Ze=Pe.material;Ze.allowOverride===!0&&X!==null&&(Ze=X),ye.layers.test(J.layers)&&Xc(ye,F,J,Ae,Ze,De)}}function Xc(E,F,J,X,q,be){N!==null&&q.isNodeMaterial&&N.setObject(E,q),E.onBeforeRender(A,F,J,X,q,be),E.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),q.onBeforeRender(A,F,J,X,E,be),q.transparent===!0&&q.side===ln&&q.forceSinglePass===!1?(q.side=qt,q.needsUpdate=!0,A.renderBufferDirect(J,F,X,q,E,be),q.side=vi,q.needsUpdate=!0,A.renderBufferDirect(J,F,X,q,E,be),q.side=ln):A.renderBufferDirect(J,F,X,q,E,be),E.onAfterRender(A,F,J,X,q,be)}function Yc(E){let F=0;for(let J of E)J.texture!==null&&F++;return F}function Xs(E,F,J){F.isScene!==!0&&(F=ot);let X=ze.get(E),q=w.state.lights,be=w.state.shadowsArray,Pe=q.state.version,ye=ie.getParameters(E,q.state,be,F,J,w.state.lightProbeGridArray),Ae=ie.getProgramCacheKey(ye),De=X.programs;X.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?F.environment:null,X.fog=F.fog;let Ze=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;X.envMap=P.get(E.envMap||X.environment,Ze),X.envMapRotation=X.environment!==null&&E.envMap===null?F.environmentRotation:E.envMapRotation,De===void 0&&(E.addEventListener("dispose",_t),De=new Map,X.programs=De,X.programVariants=new Map);let ct=De.get(Ae);if(ct!==void 0){if(X.currentProgram===ct&&X.lightsStateVersion===Pe)return Zc(E,ye),ct}else ye.uniforms=ie.getUniforms(E),N!==null&&E.isNodeMaterial&&N.build(E,J,ye),E.onBeforeCompile(ye,A),ct=ie.acquireProgram(ye,Ae),De.set(Ae,ct),X.uniforms=ye.uniforms;let Ie=X.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ie.clippingPlanes=Q.uniform),Zc(E,ye),X.needsLights=P2(E),X.lightsStateVersion=Pe,X.needsLights&&(Ie.ambientLightColor.value=q.state.ambient,Ie.lightProbe.value=q.state.probe,Ie.sunLights.value=q.state.sun,Ie.sunLightShadows.value=q.state.sunShadow,Ie.directionalLights.value=q.state.directional,Ie.directionalLightShadows.value=q.state.directionalShadow,Ie.spotLights.value=q.state.spot,Ie.spotLightShadows.value=q.state.spotShadow,Ie.rectAreaLights.value=q.state.rectArea,Ie.ltc_1.value=q.state.rectAreaLTC1,Ie.ltc_2.value=q.state.rectAreaLTC2,Ie.pointLights.value=q.state.point,Ie.pointLightShadows.value=q.state.pointShadow,Ie.hemisphereLights.value=q.state.hemi,Ie.sunShadowMatrix.value=q.state.sunShadowMatrix,Ie.sunShadowCascade.value=q.state.sunShadowCascade,Ie.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Ie.spotLightMatrix.value=q.state.spotLightMatrix,Ie.spotLightMap.value=q.state.spotLightMap,Ie.pointShadowMatrix.value=q.state.pointShadowMatrix),X.numLightProbeGrids=Yc(w.state.lightProbeGridArray),X.currentProgram=ct,X.uniformsList=null,ct}function A2(E,F,J,X,q){let be=ze.get(E),Pe=be.currentProgram.id+","+X+","+q,ye=be.programVariants.get(Pe);return ye===void 0?(ye=Xs(E,F,J),be.programVariants.set(Pe,ye)):(be.currentProgram=ye,be.uniformsList=null,be.outputColorSpace=X,be.toneMapping=q),ye}function qc(E){if(E.uniformsList===null){let F=E.currentProgram.getUniforms();E.uniformsList=Os.seqWithValue(F.seq,E.uniforms)}return E.uniformsList}function Zc(E,F){let J=ze.get(E);J.outputColorSpace=F.outputColorSpace,J.batching=F.batching,J.batchingColor=F.batchingColor,J.instancing=F.instancing,J.instancingColor=F.instancingColor,J.instancingMorph=F.instancingMorph,J.skinning=F.skinning,J.morphTargets=F.morphTargets,J.morphNormals=F.morphNormals,J.morphColors=F.morphColors,J.morphTargetsCount=F.morphTargetsCount,J.numClippingPlanes=F.numClippingPlanes,J.numIntersection=F.numClipIntersection,J.vertexAlphas=F.vertexAlphas,J.vertexTangents=F.vertexTangents,J.toneMapping=F.toneMapping}function R2(E,F,J,X,q){F.isScene!==!0&&(F=ot),We.resetTextureUnits();let be=F.fog,Pe=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?F.environment:null,ye=V===null?A.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:rt.workingColorSpace,Ae=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,De=P.get(X.envMap||Pe,Ae),Ze=X.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,ct=!!J.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ie=!!J.morphAttributes.position,ht=!!J.morphAttributes.normal,Dt=!!J.morphAttributes.color,vt=Hn;X.toneMapped&&(V===null||V.isXRRenderTarget===!0)&&(vt=A.toneMapping);let yt=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,$t=yt!==void 0?yt.length:0,Le=ze.get(X),tn=w.state.lights;if(de===!0&&(Ce===!0||E!==K)){let wt=E===K&&X.id===G;Q.setState(X,E,wt)}let mt=!1,Ai=!1;X.version===Le.__version?Le.needsLights&&Le.lightsStateVersion!==tn.state.version||q.isBatchedMesh&&Le.batching===!1||!q.isBatchedMesh&&Le.batching===!0||q.isBatchedMesh&&Le.batchingColor===!0&&q._colorsTexture===null||q.isBatchedMesh&&Le.batchingColor===!1&&q._colorsTexture!==null||q.isInstancedMesh&&Le.instancing===!1||!q.isInstancedMesh&&Le.instancing===!0||q.isSkinnedMesh&&Le.skinning===!1||!q.isSkinnedMesh&&Le.skinning===!0||q.isInstancedMesh&&Le.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Le.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Le.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Le.instancingMorph===!1&&q.morphTexture!==null||Le.envMap!==De||X.fog===!0&&Le.fog!==be||Le.numClippingPlanes!==void 0&&(Le.numClippingPlanes!==Q.numPlanes||Le.numIntersection!==Q.numIntersection)||Le.vertexAlphas!==Ze||Le.vertexTangents!==ct||Le.morphTargets!==Ie||Le.morphNormals!==ht||Le.morphColors!==Dt||Le.morphTargetsCount!==$t||Le.numLightProbeGrids!==Yc(w.state.lightProbeGridArray)?mt=!0:(Le.outputColorSpace!==ye||Le.toneMapping!==vt)&&(Ai=!0):(mt=!0,Le.__version=X.version);let Kt=Le.currentProgram;(mt===!0||Ai===!0)&&(Kt=Ai===!0?A2(X,F,q,ye,vt):Xs(X,F,q),N&&X.isNodeMaterial&&N.onUpdateProgram(X,Kt,Le));let Mo=!1,li=!1,Ri=!1,ut=Kt.getUniforms(),Yt=Le.uniforms;if(ve.useProgram(Kt.program)&&(Mo=!0,li=!0,Ri=!0),X.id!==G&&(G=X.id,li=!0),Mo||K!==E){ve.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),ut.setValue(B,"projectionMatrix",E.projectionMatrix),ut.setValue(B,"viewMatrix",E.matrixWorldInverse);let Vt=ut.map.cameraPosition;Vt!==void 0&&Vt.setValue(B,Je.setFromMatrixPosition(E.matrixWorld)),xt.logarithmicDepthBuffer&&ut.setValue(B,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&ut.setValue(B,"isOrthographic",E.isOrthographicCamera===!0),K!==E&&(K=E,li=!0,Ri=!0)}if(Le.needsLights&&(tn.state.sunShadowMap.length>0&&ut.setValue(B,"sunShadowMap",tn.state.sunShadowMap,We),tn.state.directionalShadowMap.length>0&&ut.setValue(B,"directionalShadowMap",tn.state.directionalShadowMap,We),tn.state.spotShadowMap.length>0&&ut.setValue(B,"spotShadowMap",tn.state.spotShadowMap,We),tn.state.pointShadowMap.length>0&&ut.setValue(B,"pointShadowMap",tn.state.pointShadowMap,We)),q.isSkinnedMesh){ut.setOptional(B,q,"bindMatrix"),ut.setOptional(B,q,"bindMatrixInverse");let wt=q.skeleton;wt&&(wt.boneTexture===null&&wt.computeBoneTexture(),ut.setValue(B,"boneTexture",wt.boneTexture,We))}q.isBatchedMesh&&(ut.setOptional(B,q,"batchingTexture"),ut.setValue(B,"batchingTexture",q._matricesTexture,We),ut.setOptional(B,q,"batchingIdTexture"),ut.setValue(B,"batchingIdTexture",q._indirectTexture,We),ut.setOptional(B,q,"batchingColorTexture"),q._colorsTexture!==null&&ut.setValue(B,"batchingColorTexture",q._colorsTexture,We));let En=J.morphAttributes;if((En.position!==void 0||En.normal!==void 0||En.color!==void 0)&&ee.update(q,J,Kt),(li||Le.receiveShadow!==q.receiveShadow)&&(Le.receiveShadow=q.receiveShadow,ut.setValue(B,"receiveShadow",q.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&F.environment!==null&&(Yt.envMapIntensity.value=F.environmentIntensity),Yt.dfgLUT!==void 0&&(Yt.dfgLUT.value=V4()),li){if(ut.setValue(B,"toneMappingExposure",A.toneMappingExposure),Le.needsLights&&C2(Yt,Ri),be&&X.fog===!0&&fe.refreshFogUniforms(Yt,be),fe.refreshMaterialUniforms(Yt,X,ae,Se,w.state.transmissionRenderTarget[E.id]),Le.needsLights&&Le.numLightProbeGrids>0){let wt=x,Vt=0;for(let Vn of w.state.lightProbeGridArray)Vn.texture!==null&&(wt.textures[Vt]=Vn.texture,wt.min[Vt]=Vn.boundingBox.min,wt.max[Vt]=Vn.boundingBox.max,wt.resolution[Vt]=Vn.resolution,Vt++);for(let Vn in wt)wt[Vn].length=Vt;Yt.probesSH.value=wt.textures,Yt.probesMin.value=wt.min,Yt.probesMax.value=wt.max,Yt.probesResolution.value=wt.resolution}Os.upload(B,qc(Le),Yt,We)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Os.upload(B,qc(Le),Yt,We),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&ut.setValue(B,"center",q.center),ut.setValue(B,"modelViewMatrix",q.modelViewMatrix),ut.setValue(B,"normalMatrix",q.normalMatrix),ut.setValue(B,"modelMatrix",q.matrixWorld),X.uniformsGroups!==void 0){let wt=X.uniformsGroups;for(let Vt=0,Vn=wt.length;Vt<Vn;Vt++){let $c=wt[Vt];Oe.update($c,Kt),Oe.bind($c,Kt)}}return Kt}function C2(E,F){E.ambientLightColor.needsUpdate=F,E.lightProbe.needsUpdate=F,E.sunLights.needsUpdate=F,E.sunLightShadows.needsUpdate=F,E.directionalLights.needsUpdate=F,E.directionalLightShadows.needsUpdate=F,E.pointLights.needsUpdate=F,E.pointLightShadows.needsUpdate=F,E.spotLights.needsUpdate=F,E.spotLightShadows.needsUpdate=F,E.rectAreaLights.needsUpdate=F,E.hemisphereLights.needsUpdate=F}function P2(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return V},this.setRenderTargetTextures=function(E,F,J){let X=ze.get(E);X.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),ze.get(E.texture).__webglTexture=F,ze.get(E.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:J,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,F){let J=ze.get(E);J.__webglFramebuffer=F,J.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(E,F=0,J=0){V=E,H=F,z=J;let X=null,q=!1,be=!1;if(E){let ye=ze.get(E);if(ye.__useDefaultFramebuffer!==void 0){ve.bindFramebuffer(B.FRAMEBUFFER,ye.__webglFramebuffer),W.copy(E.viewport),oe.copy(E.scissor),ue=E.scissorTest,ve.viewport(W),ve.scissor(oe),ve.setScissorTest(ue),G=-1;return}else if(ye.__webglFramebuffer===void 0)We.setupRenderTarget(E);else if(ye.__hasExternalTextures)We.rebindTextures(E,ze.get(E.texture).__webglTexture,ze.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Ze=E.depthTexture;if(ye.__boundDepthTexture!==Ze){if(Ze!==null&&ze.has(Ze)&&(E.width!==Ze.image.width||E.height!==Ze.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");We.setupDepthRenderbuffer(E)}}let Ae=E.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(be=!0);let De=ze.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(De[F])?X=De[F][J]:X=De[F],q=!0):E.samples>0&&We.useMultisampledRTT(E)===!1?X=ze.get(E).__webglMultisampledFramebuffer:Array.isArray(De)?X=De[J]:X=De,W.copy(E.viewport),oe.copy(E.scissor),ue=E.scissorTest}else W.copy(Ne).multiplyScalar(ae).floor(),oe.copy(Ge).multiplyScalar(ae).floor(),ue=et;if(J!==0&&(X=O),ve.bindFramebuffer(B.FRAMEBUFFER,X)&&ve.drawBuffers(E,X),ve.viewport(W),ve.scissor(oe),ve.setScissorTest(ue),q){let ye=ze.get(E.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+F,ye.__webglTexture,J)}else if(be){let ye=F;for(let Ae=0;Ae<E.textures.length;Ae++){let De=ze.get(E.textures[Ae]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Ae,De.__webglTexture,J,ye)}}else if(E!==null&&J!==0){let ye=ze.get(E.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,ye.__webglTexture,J)}G=-1};function Jc(E){let F=ze.get(E);return(F.__readFormat!==E.format||F.__readType!==E.type)&&(F.__readFormat=E.format,F.__readType=E.type,F.__formatReadable=xt.textureFormatReadable(E.format),F.__typeReadable=xt.textureTypeReadable(E.type)),F}this.readRenderTargetPixels=function(E,F,J,X,q,be,Pe,ye=0){if(!(E&&E.isWebGLRenderTarget)){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ae=ze.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Pe!==void 0&&(Ae=Ae[Pe],Array.isArray(Ae)&&(Ae=Ae[0])),Ae){ve.bindFramebuffer(B.FRAMEBUFFER,Ae);try{let De=E.textures[ye],Ze=De.format,ct=De.type;E.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+ye);let Ie=Jc(De);if(Ie.__formatReadable===!1){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ie.__typeReadable===!1){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=E.width-X&&J>=0&&J<=E.height-q&&B.readPixels(F,J,X,q,he.convert(Ze),he.convert(ct),be)}finally{let De=V!==null?ze.get(V).__webglFramebuffer:null;ve.bindFramebuffer(B.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(E,F,J,X,q,be,Pe,ye=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ae=ze.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Pe!==void 0&&(Ae=Ae[Pe],Array.isArray(Ae)&&(Ae=Ae[0])),Ae)if(F>=0&&F<=E.width-X&&J>=0&&J<=E.height-q){ve.bindFramebuffer(B.FRAMEBUFFER,Ae);let De=E.textures[ye],Ze=De.format,ct=De.type;E.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+ye);let Ie=Jc(De);if(Ie.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ie.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ht=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,ht),B.bufferData(B.PIXEL_PACK_BUFFER,be.byteLength,B.STREAM_READ),B.readPixels(F,J,X,q,he.convert(Ze),he.convert(ct),0),B.bindBuffer(B.PIXEL_PACK_BUFFER,null);let Dt=V!==null?ze.get(V).__webglFramebuffer:null;ve.bindFramebuffer(B.FRAMEBUFFER,Dt);let vt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await _u(B,vt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,ht),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,be),B.bindBuffer(B.PIXEL_PACK_BUFFER,null),B.deleteBuffer(ht),B.deleteSync(vt),be}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,F=null,J=0){let X=Math.pow(2,-J),q=Math.floor(E.image.width*X),be=Math.floor(E.image.height*X),Pe=F!==null?F.x:0,ye=F!==null?F.y:0;We.setTexture2D(E,0),B.copyTexSubImage2D(B.TEXTURE_2D,J,0,0,Pe,ye,q,be),ve.unbindTexture()},this.copyTextureToTexture=function(E,F,J=null,X=null,q=0,be=0){let Pe,ye,Ae,De,Ze,ct,Ie,ht,Dt,vt=E.isCompressedTexture?E.mipmaps[be]:E.image;if(J!==null)Pe=J.max.x-J.min.x,ye=J.max.y-J.min.y,Ae=J.isBox3?J.max.z-J.min.z:1,De=J.min.x,Ze=J.min.y,ct=J.isBox3?J.min.z:0;else{let ut=Math.pow(2,-q);Pe=Math.floor(vt.width*ut),ye=Math.floor(vt.height*ut),E.isDataArrayTexture?Ae=vt.depth:E.isData3DTexture?Ae=Math.floor(vt.depth*ut):Ae=1,De=0,Ze=0,ct=0}X!==null?(Ie=X.x,ht=X.y,Dt=X.z):(Ie=0,ht=0,Dt=0);let yt=he.convert(F.format),$t=he.convert(F.type),Le;F.isData3DTexture?(We.setTexture3D(F,0),Le=B.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(We.setTexture2DArray(F,0),Le=B.TEXTURE_2D_ARRAY):(We.setTexture2D(F,0),Le=B.TEXTURE_2D),ve.activeTexture(B.TEXTURE0),ve.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,F.flipY),ve.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),ve.pixelStorei(B.UNPACK_ALIGNMENT,F.unpackAlignment);let tn=ve.getParameter(B.UNPACK_ROW_LENGTH),mt=ve.getParameter(B.UNPACK_IMAGE_HEIGHT),Ai=ve.getParameter(B.UNPACK_SKIP_PIXELS),Kt=ve.getParameter(B.UNPACK_SKIP_ROWS),Mo=ve.getParameter(B.UNPACK_SKIP_IMAGES);ve.pixelStorei(B.UNPACK_ROW_LENGTH,vt.width),ve.pixelStorei(B.UNPACK_IMAGE_HEIGHT,vt.height),ve.pixelStorei(B.UNPACK_SKIP_PIXELS,De),ve.pixelStorei(B.UNPACK_SKIP_ROWS,Ze),ve.pixelStorei(B.UNPACK_SKIP_IMAGES,ct);let li=E.isDataArrayTexture||E.isData3DTexture,Ri=F.isDataArrayTexture||F.isData3DTexture;if(E.isDepthTexture){let ut=ze.get(E),Yt=ze.get(F),En=ze.get(ut.__renderTarget),wt=ze.get(Yt.__renderTarget);ve.bindFramebuffer(B.READ_FRAMEBUFFER,En.__webglFramebuffer),ve.bindFramebuffer(B.DRAW_FRAMEBUFFER,wt.__webglFramebuffer);for(let Vt=0;Vt<Ae;Vt++)li&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ze.get(E).__webglTexture,q,ct+Vt),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ze.get(F).__webglTexture,be,Dt+Vt)),B.blitFramebuffer(De,Ze,De+Pe,Ze+ye,Ie,ht,Ie+Pe,ht+ye,B.DEPTH_BUFFER_BIT,B.NEAREST);ve.bindFramebuffer(B.READ_FRAMEBUFFER,null),ve.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(q!==0||E.isRenderTargetTexture||ze.has(E)){let ut=ze.get(E),Yt=ze.get(F);ve.bindFramebuffer(B.READ_FRAMEBUFFER,R),ve.bindFramebuffer(B.DRAW_FRAMEBUFFER,U);for(let En=0;En<Ae;En++)li?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ut.__webglTexture,q,ct+En):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,ut.__webglTexture,q),Ri?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Yt.__webglTexture,be,Dt+En):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Yt.__webglTexture,be),q!==0?B.blitFramebuffer(De,Ze,De+Pe,Ze+ye,Ie,ht,Ie+Pe,ht+ye,B.COLOR_BUFFER_BIT,B.NEAREST):Ri?B.copyTexSubImage3D(Le,be,Ie,ht,Dt+En,De,Ze,Pe,ye):B.copyTexSubImage2D(Le,be,Ie,ht,De,Ze,Pe,ye);ve.bindFramebuffer(B.READ_FRAMEBUFFER,null),ve.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else Ri?E.isDataTexture||E.isData3DTexture?B.texSubImage3D(Le,be,Ie,ht,Dt,Pe,ye,Ae,yt,$t,vt.data):F.isCompressedArrayTexture?B.compressedTexSubImage3D(Le,be,Ie,ht,Dt,Pe,ye,Ae,yt,vt.data):B.texSubImage3D(Le,be,Ie,ht,Dt,Pe,ye,Ae,yt,$t,vt):E.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,be,Ie,ht,Pe,ye,yt,$t,vt.data):E.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,be,Ie,ht,vt.width,vt.height,yt,vt.data):B.texSubImage2D(B.TEXTURE_2D,be,Ie,ht,Pe,ye,yt,$t,vt);ve.pixelStorei(B.UNPACK_ROW_LENGTH,tn),ve.pixelStorei(B.UNPACK_IMAGE_HEIGHT,mt),ve.pixelStorei(B.UNPACK_SKIP_PIXELS,Ai),ve.pixelStorei(B.UNPACK_SKIP_ROWS,Kt),ve.pixelStorei(B.UNPACK_SKIP_IMAGES,Mo),be===0&&F.generateMipmaps===!0&&F.mipmapsAutoUpdate===!0&&B.generateMipmap(Le),ve.unbindTexture()},this.initRenderTarget=function(E){ze.get(E).__webglFramebuffer===void 0&&We.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?We.setTextureCube(E,0):E.isData3DTexture?We.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?We.setTexture2DArray(E,0):We.setTexture2D(E,0),ve.unbindTexture()},this.resetState=function(){H=0,z=0,V=null,ve.reset(),pe.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=rt._getDrawingBufferColorSpace(e),t.unpackColorSpace=rt._getUnpackColorSpace()}};function W4(){return{gen_utc:new Date().toISOString(),zones:[{id:"gaming",name:"FLUX Gaming",status:"active",activity:.9},{id:"quant",name:"FLUX Quant",status:"dormant",activity:.15},{id:"media",name:"FLUX Media",status:"dormant",activity:.4}],fleet:[{id:"bm-a",cores:32,online:!0,current_task:"cityweb dev"},{id:"bm-b",cores:16,online:!1,current_task:"idle"},{id:"bm-c",cores:32,online:!1,current_task:"idle"},{id:"BG-A",cores:16,online:!1,current_task:"idle"},{id:"BG-B",cores:8,online:!1,current_task:"idle"},{id:"BG-C",cores:16,online:!1,current_task:"idle"}],census_total:10114,reality:{city_day_phase:"night",beijing_hhmm:new Date().toTimeString().substring(0,5),weather_kind:"clear",weather_temp_c:"16",season:"autumn"},city:{games_total:34,games_active:9,commits_total:47093,renders_total:105,fleet_online:1},events_tail:[{ts_utc:"",type:"COMMIT",zone:"gaming",summary:"demo data"},{ts_utc:"",type:"CEO_ORDER",zone:"governance",summary:"demo data"},{ts_utc:"",type:"GAME_STAGE",zone:"gaming",summary:"demo data"}]}}function rd(){var i;return(i=window.CITY_DATA)!=null?i:W4()}function ho(){return!!window.CITY_DATA}function ad(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new dt;l.morphTargetsRelative=a;let c=0;for(let h=0;h<i.length;++h){let d=i[h],u=0,f=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in d.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(d.attributes[p]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in d.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;if(d.morphAttributes[p].length!==i[0].morphAttributes[p].length)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have the same number of morph targets for the "'+p+'" morph attribute.'),null;o[p]===void 0&&(o[p]=[]),o[p].push(d.morphAttributes[p]),f++}if(f!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of morph attributes."),null;if(e){let p;if(t)p=d.index.count;else if(d.attributes.position!==void 0)p=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,h),c+=p}}if(t){let h=0,d=[];for(let u=0;u<i.length;++u){let f=i[u].index;for(let p=0;p<f.count;++p)d.push(f.getX(p)+h);h+=i[u].attributes.position.count}l.setIndex(d)}for(let h in r){let d=od(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(let h in o){let d=o[h][0].length;if(d!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<d;++u){let f=[];for(let y=0;y<o[h].length;++y)f.push(o[h][y][u]);let p=od(f);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(p)}}}return l}function od(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new Ut(o,t,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let d=l/t;for(let u=0,f=h.count;u<f;u++)for(let p=0;p<t;p++){let y=h.getComponent(u,p);a.setComponent(u+d,p,y)}}else o.set(h.array,l);l+=h.count*t}return s!==void 0&&(a.gpuType=s),a}var X4=111320*Math.cos(31.243*(Math.PI/180));function In(i){return(i-121.495)*X4}function Ln(i){return-(i-31.243)*110540}function ld(i){return{x:In(i.lon),z:Ln(i.lat)}}var Xe={data:new me(6220500),capital:new me(16498468),traffic:new me(16020150),warn:new me(16281969),ceo:new me(16777215),brain:new me(6333946)},Bs={gaming:Xe.data,quant:Xe.capital,media:Xe.traffic,governance:Xe.brain};var Dl=(i,e,t,n,s,r,o,a,l,c,h,d,u)=>({skyTop:new me(i),skyBottom:new me(e),fog:new me(t),sunColor:new me(n),sunIntensity:s,hemiSky:new me(r),hemiGround:new me(o),hemiIntensity:a,windowGain:l,starOpacity:c,streetGain:h,bodyGain:d,groundColor:new me(u)}),uo=Dl(263694,66e4,329743,9348808,.32,1713206,329484,.5,1,.9,.12,.6,395794),Y4=Dl(1845836,13208178,6969970,16763296,1.4,3820140,1316896,.7,.6,.35,.7,.9,2896454),cd=Dl(7314644,13229038,11058386,16773852,2.2,8691908,3752532,.78,.45,0,1,1.45,4016737),q4=Dl(3024720,12743743,8014408,16757611,1.5,3945560,1578016,.75,.85,.4,.45,1,2367274),Sc=[{h:0,p:uo},{h:4.5,p:uo},{h:6.5,p:Y4},{h:8.5,p:cd},{h:16,p:cd},{h:18,p:q4},{h:20,p:uo},{h:24,p:uo}],Xi=new me;function Z4(i,e,t){return{skyTop:Xi.copy(i.skyTop).lerp(e.skyTop,t).clone(),skyBottom:Xi.copy(i.skyBottom).lerp(e.skyBottom,t).clone(),fog:Xi.copy(i.fog).lerp(e.fog,t).clone(),sunColor:Xi.copy(i.sunColor).lerp(e.sunColor,t).clone(),sunIntensity:i.sunIntensity+(e.sunIntensity-i.sunIntensity)*t,hemiSky:Xi.copy(i.hemiSky).lerp(e.hemiSky,t).clone(),hemiGround:Xi.copy(i.hemiGround).lerp(e.hemiGround,t).clone(),hemiIntensity:i.hemiIntensity+(e.hemiIntensity-i.hemiIntensity)*t,windowGain:i.windowGain+(e.windowGain-i.windowGain)*t,starOpacity:i.starOpacity+(e.starOpacity-i.starOpacity)*t,streetGain:i.streetGain+(e.streetGain-i.streetGain)*t,bodyGain:i.bodyGain+(e.bodyGain-i.bodyGain)*t,groundColor:Xi.copy(i.groundColor).lerp(e.groundColor,t).clone()}}function hd(i){for(let e=0;e<Sc.length-1;e++){let t=Sc[e],n=Sc[e+1];if(i>=t.h&&i<=n.h){let s=(i-t.h)/(n.h-t.h);return Z4(t.p,n.p,s)}}return uo}function ud(i){return i>=5&&i<7?"\u6668":i>=7&&i<17?"\u663C":i>=17&&i<19.5?"\u9EC4\u660F":"\u591C"}var dd=[{name:"\u4E0A\u6D77\u73AF\u7403\u91D1\u878D\u4E2D\u5FC3",h:492,ring:[[31.2368214,121.502698],[31.2368319,121.5028363],[31.2368477,121.5030457],[31.2368601,121.5032097],[31.236869,121.5033275],[31.2367679,121.503338],[31.2366289,121.5033524],[31.2363323,121.5033831],[31.2363059,121.503035],[31.2362942,121.5028799],[31.2362936,121.5028721],[31.2362846,121.5027536],[31.236385,121.5027432],[31.2365247,121.5027287],[31.2368214,121.502698]],region:"lujiazui"},{name:"\u6E2F\u52A1\u5927\u53A6",h:19.2,ring:[[31.2423995,121.493158],[31.2421684,121.4934802],[31.2422058,121.4935169],[31.2421738,121.4935616],[31.2422094,121.4935965],[31.2422133,121.4936469],[31.2422461,121.494085],[31.242216,121.4941255],[31.2422555,121.4941655],[31.2422177,121.4942164],[31.2424979,121.4945005],[31.2425218,121.4944682],[31.2425325,121.494479],[31.2426697,121.4942939],[31.242409,121.4940295],[31.2423812,121.4936303],[31.2425967,121.4933299],[31.242463,121.4931986],[31.2424539,121.4932114],[31.2423995,121.493158]],region:"lujiazui"},{name:"21\u4E16\u7EAA\u5927\u53A6",h:210,ring:[[31.2364771,121.5056988],[31.2366032,121.5052721],[31.2362373,121.5051307],[31.236116,121.5055602],[31.2364771,121.5056988]],region:"lujiazui"},{name:"\u592A\u5E73\u91D1\u878D\u5927\u53A6",h:238,ring:[[31.2363421,121.4991479],[31.2359154,121.4992162],[31.2358538,121.4986888],[31.2362805,121.4986206],[31.2363421,121.4991479]],region:"lujiazui"},{name:"",h:16,ring:[[31.2407782,121.49744],[31.2406821,121.4973702],[31.2406709,121.4973626],[31.2405921,121.4973091],[31.2404998,121.4975911],[31.240306,121.498183],[31.2402382,121.4983824],[31.2402058,121.4984778],[31.2402555,121.4985111],[31.2400893,121.4989353],[31.2401452,121.4989675],[31.2403135,121.4985502],[31.2404367,121.4982661],[31.2407263,121.4975655],[31.2407782,121.49744]],region:"lujiazui"},{name:"\u9EC4\u91D1\u7F6E\u5730\u5927\u53A6",h:144,ring:[[31.2424833,121.5007512],[31.2427307,121.5011159],[31.2424141,121.5014098],[31.2421667,121.501045],[31.2424833,121.5007512]],region:"lujiazui"},{name:"\u661F\u5C55\u94F6\u884C\u5927\u53A6",h:90,ring:[[31.2442305,121.4985639],[31.2438704,121.4988993],[31.2439493,121.4990152],[31.2441451,121.4993027],[31.2445051,121.4989673],[31.2442305,121.4985639]],region:"lujiazui"},{name:"\u4E2D\u94F6\u5927\u53A6",h:19.2,ring:[[31.2406569,121.4994175],[31.2409495,121.4987024],[31.2404319,121.4984127],[31.2401393,121.4991278],[31.2406569,121.4994175]],region:"lujiazui"},{name:"\u6C47\u4E30\u94F6\u884C\u5927\u697C",h:249.9,ring:[[31.2383687,121.4969947],[31.2385174,121.4970617],[31.2386851,121.4970556],[31.2388111,121.4968659],[31.2388064,121.4966621],[31.2387192,121.4965816],[31.238421,121.496595],[31.2383598,121.496822],[31.2383687,121.4969947]],region:"lujiazui"},{name:"\u9707\u65E6\u56FD\u9645\u5927\u697C",h:185,ring:[[31.2363137,121.4950827],[31.2363596,121.4950532],[31.2364146,121.4950264],[31.2364903,121.4950103],[31.2365637,121.4950156],[31.2366371,121.4950371],[31.2367057,121.4950728],[31.2367859,121.4951532],[31.2367293,121.4952255],[31.2367269,121.4953291],[31.2367855,121.4953357],[31.2367781,121.4954259],[31.2367168,121.495419],[31.2367121,121.4954765],[31.2366559,121.4954702],[31.236651,121.4955296],[31.2365044,121.4955132],[31.2363924,121.4955006],[31.2363969,121.4954458],[31.2363396,121.4954394],[31.2363444,121.4953804],[31.2362771,121.4953728],[31.2362863,121.4952609],[31.2363538,121.4952684],[31.2363603,121.4951894],[31.2363137,121.4950827]],region:"lujiazui"},{name:"\u62DB\u5546\u94F6\u884C\u4E0A\u6D77\u5927\u53A6",h:230,ring:[[31.2444528,121.5017133],[31.2443956,121.5016906],[31.2441423,121.5018547],[31.2440482,121.5019157],[31.2440216,121.5019677],[31.2441578,121.5022341],[31.2442096,121.5022524],[31.2445502,121.5020219],[31.2445743,121.5019547],[31.2444528,121.5017133]],region:"lujiazui"},{name:"\u4E0A\u6D77\u4FE1\u606F\u5927\u697C",h:131.2,ring:[[31.237305,121.5064875],[31.2375258,121.5058148],[31.2375968,121.5058467],[31.2377792,121.5059286],[31.2375584,121.5066013],[31.2375454,121.5066352],[31.2375225,121.5066487],[31.2374858,121.506654],[31.2372817,121.5065521],[31.237305,121.5064875]],region:"lujiazui"},{name:"\u62DB\u5546\u5C40\u5927\u53A6",h:168,ring:[[31.2398128,121.5047062],[31.2395074,121.5048983],[31.2393122,121.5044737],[31.2396177,121.5042817],[31.2398128,121.5047062]],region:"lujiazui"},{name:"\u4E2D\u56FD\u8239\u8236\u5927\u53A6",h:96,ring:[[31.2405585,121.5067488],[31.2407292,121.5063861],[31.2408989,121.5063231],[31.2409492,121.5065084],[31.2407865,121.506903],[31.2406176,121.506966],[31.2405585,121.5067488]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2375406,121.4971564],[31.2374455,121.4971277],[31.2374288,121.4972033],[31.2372713,121.4971557],[31.237205,121.4974557],[31.2373638,121.4975036],[31.2373418,121.4976033],[31.2374357,121.4976317],[31.2375406,121.4971564]],region:"lujiazui"},{name:"\u4E0A\u6D77\u56FD\u91D1\u6C47",h:69,ring:[[31.2377114,121.4980986],[31.2374581,121.4985748],[31.2371462,121.498834],[31.2370693,121.4988979],[31.2369775,121.498737],[31.237317,121.4984822],[31.2373835,121.498399],[31.2375876,121.4980155],[31.2377114,121.4980986]],region:"lujiazui"},{name:"",h:9.6,ring:[[31.2420732,121.4970271],[31.2420125,121.496954],[31.2418393,121.4967455],[31.241704,121.496732],[31.2416375,121.4967589],[31.2415618,121.4966999],[31.241571,121.496606],[31.2416444,121.496555],[31.2417099,121.4966167],[31.2418921,121.4966221],[31.2421397,121.4969359],[31.2421685,121.4969359],[31.2422213,121.4970003],[31.2421994,121.4971022],[31.2421214,121.4970968],[31.2420732,121.4970271]],region:"lujiazui"},{name:"",h:16,ring:[[31.237245,121.5029527],[31.2372181,121.5030491],[31.2371539,121.5032711],[31.2371308,121.5033511],[31.2371237,121.5033755],[31.2371173,121.5033977],[31.2370882,121.5034991],[31.2370723,121.5035547],[31.2370284,121.5037075],[31.2369955,121.5038222],[31.2368762,121.5038276],[31.2368781,121.5038727],[31.2368276,121.5038727],[31.236823,121.5037654],[31.2358763,121.5038115],[31.235764,121.5039054],[31.2357612,121.503929],[31.2356653,121.5039295],[31.2356626,121.5038888],[31.2356282,121.5037681],[31.235697,121.5037439],[31.2356649,121.5035481],[31.235514,121.50298],[31.2354608,121.5029607],[31.2354176,121.50298],[31.2353644,121.5027783],[31.2353832,121.502752],[31.2354149,121.5028642],[31.2356396,121.5029232],[31.2356241,121.5028486],[31.2358919,121.5029098],[31.2360502,121.5029017],[31.2362942,121.5028799],[31.2363323,121.5033831],[31.236869,121.5033275],[31.2368319,121.5028363],[31.2369492,121.5028266],[31.2372501,121.5025911],[31.2372822,121.5026179],[31.2369836,121.5028829],[31.2370157,121.502958],[31.2371077,121.5029296],[31.237179,121.5029076],[31.237245,121.5029527]],region:"lujiazui"},{name:"\u4E0A\u6D77\u4E2D\u5FC3\u5927\u53A6",h:632,ring:[[31.2354993,121.5007275],[31.2354319,121.5007601],[31.2353455,121.500802],[31.2353243,121.5008716],[31.2352592,121.500846],[31.2352198,121.5009721],[31.235189,121.5011559],[31.2351902,121.5013239],[31.2351991,121.501398],[31.2352127,121.5014697],[31.2352433,121.5016027],[31.2352732,121.501674],[31.2353027,121.5017446],[31.2353453,121.5017848],[31.2353988,121.501806],[31.2354427,121.5017965],[31.235488,121.5017866],[31.2355247,121.5017632],[31.2355784,121.5017289],[31.2356876,121.5016592],[31.2358244,121.5015721],[31.2359357,121.5014693],[31.2360115,121.5013968],[31.2360492,121.5013308],[31.2360316,121.5012621],[31.2360155,121.5012357],[31.2359839,121.5011838],[31.2358859,121.5010465],[31.235698,121.5008579],[31.2356117,121.5007998],[31.2354993,121.5007275]],region:"lujiazui"},{name:"\u5BCC\u58EB\u5EB7\u5927\u53A6",h:67.2,ring:[[31.2438192,121.4979239],[31.2433524,121.4983626],[31.2436019,121.4987258],[31.2440687,121.4982873],[31.2438192,121.4979239]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2448528,121.5014048],[31.2443956,121.5016906],[31.2441423,121.5018547],[31.2440624,121.5016901],[31.2447405,121.5012078],[31.2451228,121.5009581],[31.2451624,121.5010588],[31.2451487,121.5011097],[31.2451058,121.5011913],[31.2449767,121.5013055],[31.2448528,121.5014048]],region:"lujiazui"},{name:"\u62DB\u5546\u94F6\u884C\u4E0A\u6D77\u5927\u53A6\u5317\u5854",h:19.2,ring:[[31.2451228,121.5009581],[31.2447405,121.5012078],[31.2445889,121.500938],[31.2448541,121.5007531],[31.2449262,121.5007369],[31.2449917,121.5007531],[31.2450399,121.5008095],[31.2451228,121.5009581]],region:"lujiazui"},{name:"\u519C\u94F6\u5927\u53A6",h:216,ring:[[31.2444381,121.503965],[31.2445091,121.504422],[31.2445139,121.5044526],[31.2440445,121.5045524],[31.244021,121.5044012],[31.2439916,121.5042124],[31.2439687,121.5040648],[31.2444381,121.503965]],region:"lujiazui"},{name:"\u4E2D\u56FD\u4EBA\u6C11\u94F6\u884C\u5927\u53A6",h:64,ring:[[31.2400935,121.505473],[31.2402242,121.5053987],[31.2402793,121.5054148],[31.2403283,121.5055194],[31.2404919,121.5055894],[31.2406464,121.5054929],[31.2404214,121.504975],[31.2403114,121.5049374],[31.2398821,121.505186],[31.2399949,121.5054363],[31.2400935,121.505473]],region:"lujiazui"},{name:"\u5EFA\u884C\u5927\u53A6",h:216,ring:[[31.2445895,121.5049461],[31.244129,121.505064],[31.2441951,121.5054174],[31.2442218,121.5055601],[31.2446823,121.5054423],[31.2445895,121.5049461]],region:"lujiazui"},{name:"",h:16,ring:[[31.236729,121.5005013],[31.2378938,121.5004637],[31.237981,121.5004959],[31.2379867,121.5006282],[31.2379259,121.5007802],[31.2378479,121.5009251],[31.2373312,121.5009521],[31.237167,121.5009526],[31.2366786,121.5009787],[31.236729,121.5005013]],region:"lujiazui"},{name:"\u9999\u683C\u91CC\u62C9\u9152\u5E97",h:144,ring:[[31.2378929,121.4944554],[31.237686,121.4939719],[31.2373893,121.4941457],[31.2374569,121.4943035],[31.2375963,121.4946291],[31.2378704,121.4944687],[31.2378929,121.4944554]],region:"lujiazui"},{name:"\u9999\u683C\u91CC\u62C9\u9152\u5E97",h:137.6,ring:[[31.2382869,121.4956961],[31.2382674,121.4955039],[31.2380335,121.4956912],[31.2380404,121.4957731],[31.2379921,121.4957719],[31.2377905,121.4957673],[31.2378677,121.4959385],[31.238213,121.4959212],[31.2382053,121.4957647],[31.2382869,121.4956961]],region:"lujiazui"},{name:"\u745E\u82D1\u516C\u5BD3",h:112,ring:[[31.2419336,121.5069575],[31.2420696,121.5069057],[31.242037,121.5067884],[31.242084,121.5067705],[31.2420638,121.5066981],[31.2420189,121.5067152],[31.2419728,121.50655],[31.2420188,121.5065325],[31.2419974,121.5064557],[31.2419487,121.5064743],[31.2419209,121.5063743],[31.2417855,121.5064259],[31.2419336,121.5069575]],region:"lujiazui"},{name:"\u91D1\u7816\u5927\u53A6",h:200,ring:[[31.2354241,121.4993402],[31.2353608,121.4987131],[31.2348684,121.4987811],[31.2349316,121.4994081],[31.2354241,121.4993402]],region:"lujiazui"},{name:"\u91D1\u8302\u5927\u53A6",h:420.5,ring:[[31.2373315,121.5010725],[31.2373316,121.5011126],[31.2374952,121.5011121],[31.2374957,121.5013071],[31.2375309,121.501307],[31.2376763,121.5013064],[31.2376767,121.5014957],[31.2375313,121.5014963],[31.2374957,121.5014964],[31.2374962,121.5016802],[31.2373325,121.5016807],[31.2373326,121.5017119],[31.2373331,121.5018868],[31.2371696,121.5018873],[31.2371691,121.5017124],[31.237169,121.5016808],[31.2370089,121.5016813],[31.2370084,121.5014971],[31.2369732,121.5014972],[31.2368243,121.5014978],[31.2368238,121.5013064],[31.2370084,121.5013058],[31.2370079,121.5011131],[31.2371674,121.5011126],[31.2371673,121.501073],[31.237167,121.5009526],[31.2373312,121.5009521],[31.2373315,121.5010725]],region:"lujiazui"},{name:"\u4E0A\u6D77\u6D77\u6D0B\u6C34\u65CF\u9986",h:10,ring:[[31.2426086,121.4977593],[31.243054,121.4973315],[31.2426841,121.4968045],[31.2422386,121.4972324],[31.2424413,121.497521],[31.2426086,121.4977593]],region:"lujiazui"},{name:"\u56FD\u91D1\u4E2D\u5FC3\u4E8C\u671F",h:259.9,ring:[[31.2389307,121.4976093],[31.2388329,121.4978362],[31.2388808,121.4979923],[31.2391414,121.4981185],[31.2393018,121.4979161],[31.2393649,121.4977432],[31.2393058,121.4976277],[31.2391444,121.4975282],[31.2390198,121.4974878],[31.2389307,121.4976093]],region:"lujiazui"},{name:"\u8FEA\u58EB\u5C3C\u65D7\u8230\u5E97",h:6.4,ring:[[31.2400412,121.4948451],[31.2405397,121.494523],[31.2406607,121.494751],[31.2404058,121.4950137],[31.24042,121.4950318],[31.2404339,121.4950524],[31.2404443,121.4950751],[31.2404515,121.4950993],[31.2404546,121.4951196],[31.240456,121.4951435],[31.2404021,121.4951429],[31.240391,121.4951069],[31.2403736,121.4950726],[31.2403588,121.4950498],[31.2403347,121.4950241],[31.2403035,121.4950041],[31.2402761,121.4949925],[31.2402424,121.4949849],[31.2402125,121.4949852],[31.2401817,121.4949914],[31.2401541,121.4950035],[31.2401306,121.4950181],[31.2400995,121.495047],[31.2400774,121.4950745],[31.2400585,121.4951093],[31.2400438,121.4951461],[31.2400353,121.4951904],[31.2399886,121.4951892],[31.2399935,121.4951465],[31.2400069,121.4951014],[31.2400329,121.4950503],[31.2400561,121.4950186],[31.2400799,121.4949929],[31.2401058,121.4949696],[31.2400412,121.4948451]],region:"lujiazui"},{name:"\u4E1C\u4E9A\u94F6\u884C\u91D1\u878D\u5927\u53A6",h:197.7,ring:[[31.2363792,121.4978458],[31.2362655,121.4979148],[31.2360145,121.4980673],[31.2359888,121.4980829],[31.2359149,121.4979694],[31.2359353,121.4979556],[31.2358777,121.4978574],[31.235854,121.4978774],[31.2357754,121.4977518],[31.2361251,121.497464],[31.2361935,121.4975614],[31.2361086,121.4976351],[31.2361946,121.4977827],[31.2363139,121.4977196],[31.2363792,121.4978458]],region:"lujiazui"},{name:"\u56FD\u5BFF\u4E2D\u5FC3\u5927\u53A6",h:238,ring:[[31.242635,121.5068169],[31.2425347,121.5062971],[31.2428998,121.5062006],[31.2430003,121.5067204],[31.242635,121.5068169]],region:"lujiazui"},{name:"\u5DE5\u94F6\u5927\u53A6",h:256,ring:[[31.2429606,121.5051862],[31.2425171,121.5053072],[31.2426272,121.5058596],[31.2428206,121.5058069],[31.2430707,121.5057387],[31.2429606,121.5051862]],region:"lujiazui"},{name:"\u82B1\u65D7\u96C6\u56E2\u5927\u53A6",h:134.4,ring:[[31.2359498,121.4953934],[31.236624,121.4962974],[31.2362088,121.4967571],[31.2357866,121.4962124],[31.2355121,121.495856],[31.2358355,121.4955153],[31.2359498,121.4953934]],region:"lujiazui"},{name:"\u4E0A\u6D77\u56FD\u91D1\u4E2D\u5FC3\u5546\u573A",h:22.4,ring:[[31.2388111,121.4968659],[31.2388275,121.4971242],[31.2388473,121.4972226],[31.2388811,121.4973071],[31.2389303,121.4973931],[31.238971,121.4974498],[31.2390198,121.4974878],[31.2389307,121.4976093],[31.2388329,121.4978362],[31.2388808,121.4979923],[31.2387817,121.4982595],[31.2389686,121.4983517],[31.2388705,121.498592],[31.2388304,121.4985694],[31.2388035,121.4986495],[31.2387899,121.4986977],[31.2387744,121.4987454],[31.2387197,121.4989292],[31.2386601,121.4989748],[31.2385175,121.4989171],[31.238466,121.4988963],[31.2384236,121.49888],[31.2380342,121.4987301],[31.2378735,121.498866],[31.2378039,121.4988285],[31.2377426,121.4989066],[31.2374581,121.4985748],[31.2377114,121.4980986],[31.2378182,121.4978777],[31.2378047,121.4972386],[31.2378693,121.4971266],[31.2383741,121.497098],[31.2383687,121.4969947],[31.2385174,121.4970617],[31.2386851,121.4970556],[31.2388111,121.4968659]],region:"lujiazui"},{name:"29 - 30 phase \u2161",h:70,ring:[[31.2325021,121.5018695],[31.2324577,121.5019023],[31.2324764,121.5019351],[31.2324075,121.5019802],[31.2324192,121.5019938],[31.2323724,121.5020403],[31.2324028,121.502084],[31.2324308,121.502058],[31.232446,121.5020731],[31.232446,121.5021031],[31.2324554,121.5021209],[31.2324857,121.5021277],[31.2325245,121.5022005],[31.232557,121.5022616],[31.2325512,121.5022821],[31.2325582,121.5023189],[31.232592,121.502323],[31.232592,121.502364],[31.232564,121.5023695],[31.2325722,121.502431],[31.2326236,121.5024118],[31.2326282,121.5024228],[31.2326645,121.5024118],[31.2326504,121.5023435],[31.2326868,121.5023309],[31.2327115,121.502404],[31.2327572,121.5023857],[31.2327456,121.5023432],[31.2327656,121.5023339],[31.2327673,121.5022706],[31.2327517,121.5022581],[31.2327189,121.5021162],[31.2326914,121.5021303],[31.2326216,121.5020049],[31.2326377,121.501986],[31.2325673,121.5018888],[31.2325579,121.5018966],[31.2325378,121.5018763],[31.2325211,121.5018904],[31.2325021,121.5018695]],region:"lujiazui"},{name:"28 - 27 phase \u2161",h:70,ring:[[31.2327844,121.50257],[31.2327342,121.5025523],[31.2327252,121.5025903],[31.232651,121.5025589],[31.2326498,121.5025781],[31.2325892,121.5025673],[31.2325808,121.5026227],[31.2326159,121.5026305],[31.2326162,121.5026538],[31.2325968,121.5026734],[31.2325914,121.5026933],[31.2326069,121.5027246],[31.232567,121.5028753],[31.23255,121.5028835],[31.2325307,121.5029139],[31.2325502,121.5029465],[31.2325238,121.5029733],[31.2325019,121.5029521],[31.2324675,121.5029996],[31.2325135,121.5030325],[31.2325095,121.5030438],[31.2325403,121.5030686],[31.2325752,121.5030115],[31.2326072,121.5030354],[31.2325762,121.5031051],[31.2326179,121.5031335],[31.2326378,121.5030955],[31.2326569,121.503107],[31.2326989,121.503067],[31.2326967,121.5030451],[31.232767,121.5029232],[31.2327398,121.5029081],[31.2327753,121.5027643],[31.232798,121.5027662],[31.2328147,121.5026403],[31.2328035,121.5026371],[31.2328035,121.502606],[31.2327834,121.5026004],[31.2327844,121.50257]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2387963,121.5073161],[31.2387102,121.5073723],[31.2389282,121.5078293],[31.2390143,121.5077731],[31.2387963,121.5073161]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2390482,121.5078546],[31.2389622,121.5079107],[31.2391802,121.5083677],[31.2392663,121.5083115],[31.2390482,121.5078546]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.238574,121.5074571],[31.238488,121.5075132],[31.238706,121.5079703],[31.2387921,121.5079141],[31.238574,121.5074571]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2388348,121.5079963],[31.2387488,121.5080524],[31.2389668,121.5085095],[31.2390529,121.5084533],[31.2388348,121.5079963]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2373056,121.5086791],[31.2373917,121.5086231],[31.2372271,121.5082776],[31.237141,121.5083337],[31.2373056,121.5086791]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2375005,121.5085451],[31.2375866,121.508489],[31.2374221,121.5081436],[31.237336,121.5081997],[31.2375005,121.5085451]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2370938,121.5087765],[31.2371846,121.5087318],[31.2370751,121.5084277],[31.2369843,121.5084724],[31.2370938,121.5087765]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2378027,121.5079088],[31.2377167,121.5079651],[31.2378136,121.5081723],[31.2378996,121.508116],[31.2378027,121.5079088]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2392641,121.5096617],[31.2391778,121.509693],[31.239316,121.510213],[31.2394039,121.510181],[31.2393869,121.510117],[31.2394168,121.5101062],[31.2394004,121.5100445],[31.2393705,121.5100553],[31.2393427,121.5099505],[31.2393716,121.50994],[31.2393562,121.5098821],[31.2393263,121.509893],[31.2392957,121.5097778],[31.2393208,121.5097686],[31.2393078,121.5097197],[31.239282,121.5097291],[31.2392641,121.5096617]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2394365,121.5102993],[31.2393523,121.5103305],[31.2394466,121.5106796],[31.239533,121.5106477],[31.2395168,121.5105877],[31.2395455,121.5105771],[31.2395295,121.5105179],[31.2394995,121.510529],[31.2394685,121.5104142],[31.2394935,121.510405],[31.2394805,121.5103568],[31.2394547,121.5103664],[31.2394365,121.5102993]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2392043,121.5094224],[31.2391146,121.5094563],[31.2391612,121.5096248],[31.2392509,121.5095909],[31.2392043,121.5094224]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2396692,121.5102085],[31.2395849,121.5102397],[31.2396793,121.5105889],[31.2397657,121.5105569],[31.2397495,121.5104969],[31.2397782,121.5104863],[31.2397622,121.5104271],[31.2397321,121.5104382],[31.2397012,121.5103235],[31.2397262,121.5103142],[31.2397132,121.510266],[31.2396873,121.5102756],[31.2396692,121.5102085]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2395786,121.5098439],[31.2394843,121.5098796],[31.239343,121.50937],[31.2394374,121.5093342],[31.2395786,121.5098439]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2395993,121.5099143],[31.2394992,121.5099516],[31.2395438,121.5101152],[31.2396439,121.5100778],[31.2395993,121.5099143]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2397783,121.5096542],[31.2396784,121.5096918],[31.2397731,121.5100363],[31.2398731,121.5099987],[31.2397783,121.5096542]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2399043,121.5101166],[31.2398044,121.5101542],[31.2398991,121.5104987],[31.2399991,121.5104612],[31.2399043,121.5101166]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2396559,121.5092241],[31.239556,121.5092619],[31.239647,121.5095903],[31.2397469,121.5095524],[31.2396559,121.5092241]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2400017,121.5095818],[31.2399019,121.5096197],[31.2399929,121.5099481],[31.2400928,121.5099102],[31.2400017,121.5095818]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2398714,121.5091163],[31.2397715,121.5091542],[31.2398625,121.5094826],[31.2399624,121.5094447],[31.2398714,121.5091163]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2400524,121.5100487],[31.2399528,121.5100876],[31.2400308,121.5103613],[31.2401304,121.5103225],[31.2400524,121.5100487]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.240277,121.5100873],[31.240177,121.5101246],[31.2402216,121.5102882],[31.2403216,121.5102509],[31.240277,121.5100873]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2402364,121.5096571],[31.2401365,121.5096949],[31.2402275,121.5100233],[31.2403274,121.5099854],[31.2402364,121.5096571]],region:"lujiazui"},{name:"\u56FD\u91D1\u4E2D\u5FC32\u671F",h:115.2,ring:[[31.2402802,121.5095059],[31.2401859,121.5095417],[31.2400446,121.5090321],[31.240139,121.5089962],[31.2402802,121.5095059]],region:"lujiazui"},{name:"\u5916\u6EE9\u4E2D\u5FC3",h:198.9,ring:[[31.2347138,121.4827882],[31.2348155,121.4832519],[31.2343787,121.4833829],[31.234277,121.4829191],[31.2347138,121.4827882]],region:"bund_edge"},{name:"\u5973\u9752\u5E74\u4F1A\u5927\u697C",h:25.6,ring:[[31.2438506,121.4836037],[31.2435849,121.4836459],[31.2435713,121.4835062],[31.2437166,121.4834836],[31.2437085,121.4834007],[31.2435623,121.4834158],[31.2435511,121.4832911],[31.2436436,121.4832771],[31.2438148,121.4832512],[31.2438348,121.483444],[31.2438506,121.4836037]],region:"bund_edge"},{name:"\u54C8\u5BC6\u5927\u697C",h:22.4,ring:[[31.2440599,121.4835669],[31.2438506,121.4836037],[31.2438348,121.483444],[31.2440442,121.4834174],[31.2440599,121.4835669]],region:"bund_edge"},{name:"\u4E0A\u6D77\u56FD\u9645\u4F1A\u8BAE\u4E2D\u5FC3",h:19.2,ring:[[31.2418856,121.4930859],[31.241866,121.4930444],[31.2420128,121.4929532],[31.2419053,121.4928455],[31.2419456,121.4928458],[31.2419853,121.4928378],[31.2420249,121.492821],[31.2420612,121.492796],[31.2421172,121.4927291],[31.2421419,121.4926743],[31.2421553,121.4926144],[31.2421526,121.4925209],[31.2421328,121.4924548],[31.2420992,121.4923969],[31.2420678,121.4923627],[31.2419969,121.4923192],[31.2419175,121.4923065],[31.2418724,121.4923139],[31.2418293,121.4923314],[31.2417944,121.4923549],[31.2417651,121.4922907],[31.2418754,121.4922145],[31.24171,121.4919956],[31.2415381,121.4918454],[31.2413661,121.4917489],[31.241196,121.4917047],[31.2411503,121.4916355],[31.2410936,121.4915956],[31.2410069,121.4915818],[31.2409431,121.4916025],[31.2408892,121.4916475],[31.2408518,121.4917111],[31.2408351,121.4917861],[31.2408414,121.4918632],[31.240864,121.4919228],[31.2409212,121.4920493],[31.2415507,121.493306],[31.2418856,121.4930859]],region:"bund_edge"},{name:"\u6E2F\u52A1\u5927\u53A6",h:19.2,ring:[[31.2423995,121.493158],[31.2421684,121.4934802],[31.2422058,121.4935169],[31.2421738,121.4935616],[31.2422094,121.4935965],[31.2422133,121.4936469],[31.2422461,121.494085],[31.242216,121.4941255],[31.2422555,121.4941655],[31.2422177,121.4942164],[31.2424979,121.4945005],[31.2425218,121.4944682],[31.2425325,121.494479],[31.2426697,121.4942939],[31.242409,121.4940295],[31.2423812,121.4936303],[31.2425967,121.4933299],[31.242463,121.4931986],[31.2424539,121.4932114],[31.2423995,121.493158]],region:"bund_edge"},{name:"\u60A6\u56ED\u5546\u53A6",h:28.8,ring:[[31.2307883,121.4862999],[31.2311461,121.4863213],[31.231247,121.4864608],[31.231247,121.4867612],[31.2307792,121.4867398],[31.2307883,121.4862999]],region:"bund_edge"},{name:"",h:64,ring:[[31.2390705,121.4918927],[31.239223,121.4920849],[31.2392335,121.4920735],[31.239263,121.4921106],[31.2394336,121.4919256],[31.2394038,121.4918881],[31.2394905,121.4917941],[31.239351,121.4916182],[31.2392846,121.4916903],[31.2392479,121.491644],[31.2390752,121.4918314],[31.2390991,121.4918616],[31.2390705,121.4918927]],region:"bund_edge"},{name:"\u6D66\u6C5F\u6865\u96A7\u8FD0\u8425\u7BA1\u7406\u6709\u9650\u516C\u53F8\u5EF6\u4E1C\u5206\u516C\u53F8",h:38.4,ring:[[31.239107,121.4923597],[31.2389653,121.4924457],[31.2391023,121.4927543],[31.2391928,121.4926994],[31.2390862,121.4924592],[31.2391373,121.4924282],[31.239107,121.4923597]],region:"bund_edge"},{name:"",h:38.4,ring:[[31.2389474,121.4918973],[31.2387755,121.4920013],[31.2389358,121.4923635],[31.2390841,121.4922737],[31.2390566,121.4922116],[31.2390801,121.4921973],[31.2389474,121.4918973]],region:"bund_edge"},{name:"",h:9.6,ring:[[31.2421181,121.4916488],[31.2421883,121.4916639],[31.2422586,121.4916993],[31.2423026,121.4917374],[31.2426279,121.4921364],[31.2426509,121.4921898],[31.2426551,121.4922438],[31.2426408,121.4922961],[31.242484,121.4924697],[31.2419801,121.4918055],[31.2421181,121.4916488]],region:"bund_edge"},{name:"",h:32,ring:[[31.2428519,121.4843432],[31.2428512,121.4843927],[31.2430617,121.4843969],[31.2430625,121.4843447],[31.2430942,121.4843454],[31.2430954,121.4842646],[31.2430978,121.4841064],[31.2430983,121.4840698],[31.2430989,121.4840295],[31.2430672,121.4840288],[31.2430678,121.4839862],[31.2428573,121.4839819],[31.2428566,121.4840274],[31.2428329,121.4840269],[31.2428319,121.4840953],[31.2428294,121.4842616],[31.2428282,121.4843427],[31.2428519,121.4843432]],region:"bund_edge"},{name:"",h:41.6,ring:[[31.2436646,121.4847848],[31.2434161,121.4847893],[31.2434152,121.4850713],[31.2434323,121.4850691],[31.2434314,121.4852154],[31.2436515,121.4852177],[31.2436524,121.4850649],[31.2436665,121.4850653],[31.2436646,121.4847848]],region:"bund_edge"},{name:"",h:32,ring:[[31.2437207,121.4852184],[31.2436515,121.4852177],[31.2434314,121.4852154],[31.2432047,121.485213],[31.2432024,121.485256],[31.2431898,121.485256],[31.2431824,121.4855143],[31.243199,121.4855135],[31.2431982,121.4855517],[31.2433699,121.4855538],[31.2433701,121.4855137],[31.2433828,121.4855133],[31.2433859,121.4854303],[31.2435349,121.4854303],[31.2435349,121.4854974],[31.2437185,121.4854933],[31.2437188,121.4854491],[31.2437323,121.4854488],[31.2437331,121.4852626],[31.2437203,121.4852627],[31.2437207,121.4852184]],region:"bund_edge"},{name:"\u6021\u548C\u6D0B\u884C\u5927\u697C",h:22.4,ring:[[31.2426072,121.4850847],[31.2424869,121.4850939],[31.2424617,121.4850966],[31.2424415,121.485121],[31.2424365,121.4853434],[31.2422993,121.4853302],[31.2423307,121.4850534],[31.242202,121.4850376],[31.2421995,121.485073],[31.2421756,121.4850708],[31.2421139,121.4855395],[31.2425353,121.4855985],[31.2425993,121.4855204],[31.2426112,121.4851344],[31.2426072,121.4850847]],region:"bund_edge"},{name:"\u683C\u6797\u90AE\u8239\u5927\u697C",h:28.8,ring:[[31.2430054,121.4849163],[31.2427419,121.4849198],[31.2427415,121.4852843],[31.2427163,121.4852839],[31.2427162,121.4855821],[31.2427415,121.4855848],[31.2427419,121.4856306],[31.2429043,121.4856304],[31.2429089,121.4851985],[31.2429433,121.4851985],[31.2429437,121.4852337],[31.2430029,121.4852334],[31.2430054,121.4849163]],region:"bund_edge"},{name:"\u4E1C\u65B9\u6C47\u7406\u94F6\u884C\u5927\u697C",h:19.2,ring:[[31.2431434,121.4849297],[31.243042,121.4849278],[31.2430384,121.4851982],[31.2430625,121.4851986],[31.2430614,121.4852826],[31.2429396,121.4852804],[31.2429349,121.4856298],[31.2431339,121.4856334],[31.2431434,121.4849297]],region:"bund_edge"},{name:"\u76CA\u4E30\xB7\u5916\u6EE9\u6E90",h:16,ring:[[31.2424859,121.483801],[31.2424833,121.484593],[31.242531,121.4845901],[31.2425333,121.4846947],[31.2424788,121.4847003],[31.2424869,121.4850939],[31.2426072,121.4850847],[31.2426136,121.4843513],[31.2426251,121.4838685],[31.2426311,121.4838564],[31.2426309,121.4838364],[31.2426249,121.4838225],[31.2426125,121.483813],[31.2425967,121.4838124],[31.2425852,121.4838144],[31.2425484,121.4838133],[31.2425297,121.4837948],[31.2424859,121.483801]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2424279,121.483949],[31.2423728,121.483949],[31.2423705,121.4838337],[31.2422811,121.4838364],[31.2422467,121.484067],[31.2422334,121.4841746],[31.2422242,121.4842631],[31.2422238,121.4843487],[31.2422288,121.4845796],[31.2422352,121.4847081],[31.2422517,121.4848398],[31.2422724,121.4849605],[31.2423659,121.4849736],[31.2423659,121.4849441],[31.2424164,121.4849441],[31.2424279,121.483949]],region:"bund_edge"},{name:"\u4E2D\u56FD\u519C\u4E1A\u94F6\u884C",h:22.4,ring:[[31.2421114,121.4851635],[31.2419617,121.4851476],[31.2419072,121.4854858],[31.2419548,121.485495],[31.2420718,121.4855177],[31.2421114,121.4851635]],region:"bund_edge"},{name:"\u4E2D\u56FD\u5DE5\u5546\u94F6\u884C",h:22.4,ring:[[31.2421388,121.4847292],[31.2417438,121.4846604],[31.2416486,121.4854086],[31.2417716,121.48543],[31.2418945,121.4854514],[31.241937,121.4851174],[31.2420861,121.4851433],[31.2421388,121.4847292]],region:"bund_edge"},{name:"\u4E2D\u56FD\u94F6\u884C\u5927\u697C",h:51.2,ring:[[31.2416336,121.4851795],[31.241383,121.4851439],[31.2413612,121.4853537],[31.2416118,121.4853893],[31.2416336,121.4851795]],region:"bund_edge"},{name:"\u548C\u5E73\u996D\u5E97\u5357\u697C",h:25.6,ring:[[31.2406245,121.484437],[31.2406106,121.4843649],[31.2405934,121.4843692],[31.2404861,121.4843972],[31.2404991,121.484466],[31.2404739,121.4844738],[31.2404858,121.4845355],[31.2404569,121.4845465],[31.2404373,121.4845697],[31.2404284,121.4846041],[31.2404306,121.4846404],[31.2404414,121.4846688],[31.2404638,121.4846968],[31.2404914,121.4847082],[31.240516,121.4847032],[31.2405569,121.4849137],[31.2406294,121.485296],[31.2407377,121.4852929],[31.2407477,121.4853007],[31.2407583,121.4853025],[31.2407735,121.4852974],[31.2407849,121.4852893],[31.2407946,121.4852758],[31.2407977,121.4852609],[31.240796,121.4852435],[31.240791,121.4852337],[31.240783,121.4852271],[31.240775,121.4852272],[31.2406371,121.4845099],[31.2406456,121.4844999],[31.2406512,121.4844879],[31.2406538,121.4844733],[31.2406495,121.4844572],[31.2406421,121.484445],[31.2406329,121.4844379],[31.2406245,121.484437]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2417904,121.4836836],[31.2417287,121.483673],[31.2417324,121.483655],[31.2415902,121.4836297],[31.2415873,121.4836494],[31.2415542,121.4836433],[31.2413868,121.4851078],[31.2416322,121.4851454],[31.2417423,121.4841771],[31.2416974,121.4841672],[31.2417147,121.4839974],[31.2417513,121.4840019],[31.2417904,121.4836836]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2420896,121.4841541],[31.2418784,121.4841252],[31.2418694,121.4842092],[31.2418873,121.4842122],[31.2418798,121.4842824],[31.2418617,121.4842781],[31.2418347,121.4845271],[31.2420485,121.4845569],[31.2420748,121.4842985],[31.2420552,121.4842971],[31.2420612,121.4842386],[31.2420806,121.484242],[31.2420896,121.4841541]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u603B\u5DE5\u4F1A",h:22.4,ring:[[31.2389772,121.4849364],[31.2388431,121.4849767],[31.2389113,121.4852961],[31.2389256,121.4853851],[31.238963,121.4853794],[31.2389817,121.4855667],[31.2391879,121.4855332],[31.2391649,121.4852754],[31.239125,121.485279],[31.2391109,121.4852811],[31.2391219,121.4853155],[31.2391203,121.485346],[31.2390671,121.4853575],[31.2390578,121.4852798],[31.2389772,121.4849364]],region:"bund_edge"},{name:"\u5916\u6EE9\u516C\u5171\u670D\u52A1\u4E2D\u5FC3",h:16,ring:[[31.2393209,121.485048],[31.2396518,121.4849452],[31.239618,121.4848059],[31.2391312,121.4849834],[31.239197,121.4853011],[31.2391803,121.4853056],[31.2392094,121.4855186],[31.2394151,121.4854835],[31.2393209,121.485048]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5916\u6C47\u4EA4\u6613\u4E2D\u5FC3",h:16,ring:[[31.2396787,121.4849792],[31.2393769,121.4850765],[31.2394628,121.4854743],[31.23977,121.4854132],[31.2396787,121.4849792]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2389981,121.4848902],[31.2388316,121.4849416],[31.2388096,121.4848441],[31.2390538,121.4847698],[31.2391649,121.4852754],[31.239125,121.485279],[31.2391164,121.4852412],[31.2390802,121.4852372],[31.2389981,121.4848902]],region:"bund_edge"},{name:"\u4E0A\u6D77\u6D77\u5173",h:22.4,ring:[[31.2387658,121.4852915],[31.2387146,121.4852984],[31.2385075,121.4853261],[31.2384403,121.4853351],[31.2384467,121.4853999],[31.2384583,121.4855179],[31.2384643,121.4855794],[31.2385319,121.4855703],[31.2387449,121.4855417],[31.2387898,121.4855357],[31.2387825,121.4854616],[31.2387715,121.48535],[31.2387658,121.4852915]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.238507,121.4853153],[31.2384318,121.4853218],[31.2384367,121.4854008],[31.2384467,121.4853999],[31.238512,121.4853944],[31.2385075,121.4853261],[31.238507,121.4853153]],region:"bund_edge"},{name:"",h:32,ring:[[31.2386698,121.4854572],[31.2386012,121.4854669],[31.2386091,121.4855445],[31.2386778,121.4855348],[31.2386698,121.4854572]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2387906,121.4852636],[31.2387119,121.4852765],[31.2387146,121.4852984],[31.2387217,121.4853583],[31.2387715,121.48535],[31.2388004,121.4853454],[31.2387906,121.4852636]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2385265,121.4855098],[31.2384583,121.4855179],[31.2384505,121.4855186],[31.2384569,121.4855936],[31.2385329,121.4855848],[31.2385319,121.4855703],[31.2385265,121.4855098]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2388083,121.4854586],[31.2387825,121.4854616],[31.2387385,121.4854665],[31.2387449,121.4855417],[31.2387455,121.4855511],[31.2388153,121.4855432],[31.2388083,121.4854586]],region:"bund_edge"},{name:"\u76D8\u8C37\u94F6\u884C",h:22.4,ring:[[31.2371366,121.4857722],[31.2369971,121.4858463],[31.2368967,121.4858996],[31.2369861,121.4861297],[31.237226,121.4860023],[31.2371366,121.4857722]],region:"bund_edge"},{name:"\u6709\u5229\u5927\u697C",h:22.4,ring:[[31.2360894,121.4858971],[31.2358738,121.4859856],[31.2360439,121.4867231],[31.2362636,121.4865945],[31.2362774,121.4865194],[31.2360894,121.4858971]],region:"bund_edge"},{name:"\u8F6E\u8239\u62DB\u5546\u5C40\u5927\u697C",h:16,ring:[[31.2374725,121.4856948],[31.2374487,121.4857027],[31.2374419,121.4856681],[31.2374094,121.4856775],[31.2374161,121.485713],[31.2373791,121.4857251],[31.2373694,121.4856754],[31.2373155,121.4856942],[31.2373246,121.4857407],[31.2372171,121.4857709],[31.2372281,121.48583],[31.2372464,121.48583],[31.2372606,121.4858836],[31.2372642,121.4858876],[31.2372697,121.4858922],[31.2372762,121.4858971],[31.2373015,121.4858864],[31.2373152,121.4858998],[31.2374994,121.48583],[31.2374725,121.4856948]],region:"bund_edge"},{name:"\u5916\u6EE9\u4E94\u53F7",h:22.4,ring:[[31.2363943,121.4857759],[31.2361908,121.4858613],[31.2363379,121.4863442],[31.2363382,121.4863616],[31.2363674,121.4864411],[31.2363823,121.4864367],[31.2364118,121.486452],[31.2365616,121.4863333],[31.236539,121.4862374],[31.2365057,121.4862524],[31.2364652,121.4861242],[31.2365008,121.4861063],[31.2364725,121.4860191],[31.2364417,121.4860345],[31.2363841,121.4858559],[31.2364148,121.4858421],[31.2363943,121.4857759]],region:"bund_edge"},{name:"\u5916\u6EE9\u516D\u53F7",h:19.2,ring:[[31.2367628,121.4858116],[31.2366647,121.4858705],[31.2366532,121.485849],[31.2365385,121.4858892],[31.2364674,121.4859241],[31.2365473,121.4861388],[31.236522,121.4861496],[31.2365821,121.486313],[31.2366321,121.4862863],[31.2366211,121.4862621],[31.2368848,121.4861226],[31.2367628,121.4858116]],region:"bund_edge"},{name:"\u4E0A\u6D77\u4E9A\u7EC6\u4E9A\u5927\u697C",h:22.4,ring:[[31.2355771,121.4864946],[31.2352297,121.4866169],[31.2353326,121.4870162],[31.2356799,121.4868938],[31.2355771,121.4864946]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2358119,121.4861204],[31.2356134,121.4861909],[31.2356309,121.4862584],[31.2358295,121.4861879],[31.2358119,121.4861204]],region:"bund_edge"},{name:"\u4E0A\u6D77\u603B\u4F1A\u5927\u697C",h:22.4,ring:[[31.2358692,121.486209],[31.2355774,121.4863102],[31.2356775,121.4867049],[31.2356519,121.4867138],[31.2356937,121.486879],[31.2360111,121.4867689],[31.2358692,121.486209]],region:"bund_edge"},{name:"\u90FD\u57CE\u996D\u5E97",h:44.8,ring:[[31.2371317,121.4831614],[31.2372708,121.4831208],[31.2373907,121.4830858],[31.2373433,121.4828271],[31.237219,121.4828612],[31.2372251,121.4828977],[31.2372264,121.48293],[31.2372235,121.4829581],[31.237216,121.4829835],[31.2372012,121.4830082],[31.2371824,121.4830283],[31.237162,121.4830437],[31.2371406,121.4830544],[31.2371152,121.4830629],[31.2371317,121.4831614]],region:"bund_edge"},{name:"\u9999\u683C\u91CC\u62C9\u9152\u5E97",h:144,ring:[[31.2378929,121.4944554],[31.237686,121.4939719],[31.2373893,121.4941457],[31.2374569,121.4943035],[31.2375963,121.4946291],[31.2378704,121.4944687],[31.2378929,121.4944554]],region:"bund_edge"},{name:"\u5723\u4E09\u4E00\u5802",h:22.4,ring:[[31.2384677,121.4815268],[31.2384273,121.4815404],[31.2384225,121.4815209],[31.2383183,121.4815558],[31.2383215,121.4815685],[31.2382753,121.4815838],[31.238287,121.4816319],[31.2382652,121.4816391],[31.2382948,121.4817615],[31.2383124,121.4817497],[31.2383845,121.4820397],[31.2386023,121.4819657],[31.2385019,121.4815615],[31.2384783,121.4815695],[31.2384677,121.4815268]],region:"bund_edge"},{name:"",h:32,ring:[[31.2317636,121.4865072],[31.2318324,121.4865327],[31.231884,121.486589],[31.2319104,121.4866601],[31.2321202,121.4873146],[31.2321168,121.4873723],[31.2320893,121.4874152],[31.2316558,121.4876244],[31.2316122,121.4876163],[31.2315859,121.4875748],[31.2316111,121.4867406],[31.2316168,121.4866548],[31.2316409,121.486581],[31.2316982,121.4865247],[31.2317636,121.4865072]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2329304,121.4863405],[31.2330534,121.4868331],[31.2329104,121.4868818],[31.2328132,121.486492],[31.2327939,121.4864145],[31.2327876,121.4863893],[31.2329304,121.4863405]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2327482,121.4864048],[31.2327537,121.4864276],[31.2327939,121.4864145],[31.2328132,121.486492],[31.2325222,121.4865871],[31.2325184,121.4865712],[31.2324982,121.4864865],[31.2327482,121.4864048]],region:"bund_edge"},{name:"\u798F\u4F51\u95E8\u5C0F\u5546\u54C1\u5E02\u573A",h:25.6,ring:[[31.2302111,121.4830613],[31.2298136,121.4831248],[31.2299434,121.484236],[31.230341,121.4841725],[31.2302111,121.4830613]],region:"bund_edge"},{name:"\u4E2D\u6C47\u5927\u697C",h:35.2,ring:[[31.2321145,121.4822837],[31.2320452,121.4820234],[31.2320274,121.4819565],[31.2325687,121.4817932],[31.2326566,121.4818553],[31.2327007,121.4819532],[31.2327061,121.4820563],[31.2326622,121.4821524],[31.2321145,121.4822837]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2362381,121.4818837],[31.2359354,121.4819615],[31.2359949,121.4822975],[31.2362911,121.4822223],[31.2362381,121.4818837]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2356226,121.4822408],[31.2356419,121.4823453],[31.2355638,121.4823726],[31.2355717,121.4824105],[31.2356473,121.4823889],[31.2356733,121.4825136],[31.2355969,121.4825354],[31.2356037,121.4825678],[31.2356832,121.482545],[31.2357097,121.482663],[31.2356313,121.4826895],[31.2356435,121.4827522],[31.2357265,121.4827217],[31.2357572,121.4828273],[31.2355829,121.4828777],[31.2354587,121.482303],[31.2356226,121.4822408]],region:"bund_edge"},{name:"",h:96,ring:[[31.2362371,121.4838707],[31.2363812,121.4845252],[31.236216,121.4845749],[31.2360719,121.4839205],[31.2362371,121.4838707]],region:"bund_edge"},{name:"\u61FF\u5FB7\u5927\u697C",h:12.8,ring:[[31.2360854,121.4845646],[31.2361232,121.4847258],[31.2359145,121.4848026],[31.2358742,121.4847779],[31.2358427,121.4847346],[31.2357773,121.4844618],[31.2359111,121.4844109],[31.2359482,121.484571],[31.2359883,121.4845985],[31.2360854,121.4845646]],region:"bund_edge"},{name:"\u65B0\u5EB7\u5927\u697C",h:38.4,ring:[[31.2391583,121.4824582],[31.2391436,121.4824745],[31.2391358,121.4824966],[31.2391898,121.4827041],[31.2392202,121.4826957],[31.2392853,121.4829534],[31.2395973,121.4828375],[31.2395602,121.4827013],[31.239666,121.4826537],[31.2395772,121.4823508],[31.2396103,121.4823342],[31.2396017,121.4823044],[31.2395752,121.4822902],[31.2391583,121.4824582]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5A01\u65AF\u6C40\u5927\u996D\u5E97",h:112,ring:[[31.2346726,121.4820858],[31.2344474,121.4821575],[31.2344686,121.4822487],[31.234134,121.4823553],[31.2341106,121.4822549],[31.2339033,121.4823209],[31.2340211,121.4828269],[31.2342304,121.4827602],[31.2341855,121.4825672],[31.2345163,121.4824619],[31.2345649,121.4826707],[31.2347919,121.4825984],[31.2346726,121.4820858]],region:"bund_edge"},{name:"\u4E0A\u6D77\u81EA\u7136\u535A\u7269\u9986\u65E7\u9986",h:19.2,ring:[[31.2338351,121.4824833],[31.2338971,121.482814],[31.2333762,121.4830052],[31.2331255,121.4827009],[31.2331156,121.4826872],[31.2331087,121.4826688],[31.2331108,121.4826518],[31.2331193,121.4826394],[31.2331305,121.4826322],[31.2338351,121.4824833]],region:"bund_edge"},{name:"\u5EF6\u6CB3\u5927\u697C",h:22.4,ring:[[31.2337731,121.4821166],[31.2331784,121.4822579],[31.2331575,121.4822669],[31.2331347,121.4822829],[31.2331189,121.4822988],[31.2331035,121.4823198],[31.2330872,121.482343],[31.2330711,121.4823707],[31.2330595,121.482405],[31.233061,121.4824408],[31.233084,121.4825655],[31.2331537,121.482548],[31.2331405,121.4824538],[31.2331439,121.4824186],[31.2331647,121.4823816],[31.233188,121.4823592],[31.2332161,121.4823498],[31.2337856,121.4822037],[31.2337731,121.4821166]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2338045,121.4823084],[31.2338225,121.4824157],[31.2332203,121.4825597],[31.2332023,121.4824577],[31.2338045,121.4823084]],region:"bund_edge"},{name:"",h:16,ring:[[31.2321041,121.482959],[31.23134,121.4831604],[31.231315,121.483153],[31.2312875,121.4831028],[31.2312369,121.4829244],[31.2312379,121.4828786],[31.2312494,121.4828522],[31.231271,121.4828273],[31.2313086,121.4827986],[31.2319636,121.4826404],[31.2319958,121.4826525],[31.2320182,121.4826664],[31.2320382,121.4826837],[31.232054,121.4827027],[31.2320656,121.4827252],[31.2321355,121.4829038],[31.2321328,121.4829215],[31.232125,121.4829383],[31.232115,121.4829502],[31.2321041,121.482959]],region:"bund_edge"},{name:"",h:57.6,ring:[[31.2332603,121.4838951],[31.232984,121.4840392],[31.2329326,121.4839483],[31.2329099,121.483842],[31.2329075,121.4837483],[31.232923,121.4836713],[31.2329577,121.4835902],[31.2329816,121.4835483],[31.2330115,121.4835077],[31.2330594,121.483463],[31.2332603,121.4838951]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5DE5\u5546\u8054\u5927\u53A6",h:28.8,ring:[[31.2331442,121.4847645],[31.2330399,121.484744],[31.2329306,121.4843687],[31.2332875,121.4842265],[31.2333772,121.4842797],[31.2334224,121.4844233],[31.2334848,121.4846203],[31.2333823,121.4846642],[31.2334597,121.4849086],[31.2334341,121.4849196],[31.2334604,121.4850026],[31.2332815,121.4850801],[31.2332543,121.4849944],[31.2332215,121.4850086],[31.2331442,121.4847645]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2353045,121.4826797],[31.2353954,121.4830601],[31.2352951,121.4830929],[31.2351635,121.4827265],[31.2353045,121.4826797]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2342883,121.4844944],[31.2343822,121.4848608],[31.2342325,121.4849169],[31.2341321,121.4845464],[31.2342883,121.4844944]],region:"bund_edge"},{name:"",h:16,ring:[[31.2363088,121.4826745],[31.2363704,121.4829107],[31.2361409,121.4829869],[31.2360975,121.4827473],[31.2361745,121.4827234],[31.2361973,121.48286],[31.236271,121.4828404],[31.2362506,121.4827045],[31.2363088,121.4826745]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2354289,121.4825552],[31.235521,121.483007],[31.2354237,121.4830341],[31.2353316,121.4825824],[31.2354289,121.4825552]],region:"bund_edge"},{name:"\u9526\u6C5F\u96C6\u56E2\u8D22\u52A1\u516C\u53F8\u8BC1\u5238\u7ECF\u8425\u90E8",h:25.6,ring:[[31.2358826,121.4853657],[31.2360135,121.485833],[31.2358174,121.4859064],[31.2357064,121.4855117],[31.2357308,121.4855023],[31.2357127,121.4854354],[31.2357272,121.4854294],[31.2358826,121.4853657]],region:"bund_edge"},{name:"\u4E2D\u56FD\u4EBA\u6C11\u89E3\u653E\u519B\u6D77\u519B\u540E\u52E4\u90E8\u4E0A\u6D77\u7269\u8D44\u7AD9",h:16,ring:[[31.2363653,121.4832781],[31.2361008,121.4833526],[31.2360642,121.4831749],[31.2363287,121.4831003],[31.2363653,121.4832781]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2330824,121.4856901],[31.2331408,121.4858887],[31.2330298,121.4859363],[31.2330009,121.4858343],[31.2329716,121.485733],[31.2330824,121.4856901]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2360519,121.4833758],[31.2356459,121.4835021],[31.2355457,121.4833288],[31.236008,121.4831865],[31.2360519,121.4833758]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2351218,121.4818211],[31.23516,121.4820105],[31.2349753,121.4820615],[31.234937,121.4818722],[31.2351218,121.4818211]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2322349,121.4867917],[31.2323273,121.4870789],[31.2322803,121.4870996],[31.232188,121.4868123],[31.2322349,121.4867917]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2331574,121.4859504],[31.233203,121.4861071],[31.2330909,121.4861517],[31.2330469,121.4859964],[31.2331574,121.4859504]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.236092,121.4848447],[31.2361836,121.4851645],[31.2361684,121.4851911],[31.2360075,121.4852542],[31.2359105,121.4849159],[31.236092,121.4848447]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2352848,121.4826223],[31.2351326,121.4826666],[31.2350213,121.4821435],[31.2351736,121.4820992],[31.2352848,121.4826223]],region:"bund_edge"},{name:"\u4E0A\u6D77\u957F\u9014\u7535\u4FE1\u79D1\u6280\u53D1\u5C55\u516C\u53F8",h:25.6,ring:[[31.2354239,121.4860867],[31.235505,121.4863877],[31.235178,121.4865083],[31.2350969,121.4862072],[31.2354239,121.4860867]],region:"bund_edge"},{name:"\u4E0A\u6D77\u7535\u6C14\u96C6\u56E2\u603B\u516C\u53F8",h:25.6,ring:[[31.2365297,121.4849451],[31.2361751,121.485054],[31.2361281,121.4848703],[31.2364873,121.4847615],[31.2365297,121.4849451]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2355292,121.4830623],[31.2355635,121.4832047],[31.235347,121.4832759],[31.2353128,121.4831335],[31.2355292,121.4830623]],region:"bund_edge"},{name:"\u793C\u548C\u5927\u697C",h:16,ring:[[31.2392046,121.4817855],[31.2392429,121.481942],[31.2391675,121.4819745],[31.2392004,121.482111],[31.2392983,121.4820773],[31.2393394,121.4822479],[31.2391168,121.4823388],[31.2390828,121.4823203],[31.2389717,121.4818714],[31.2392046,121.4817855]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.235346,121.4821681],[31.2354219,121.4825276],[31.2353393,121.4825514],[31.2352634,121.482192],[31.235346,121.4821681]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2353185,121.4820257],[31.2353431,121.4821565],[31.2352473,121.4821811],[31.2352228,121.4820503],[31.2353185,121.4820257]],region:"bund_edge"},{name:"Waldorf Astoria",h:80,ring:[[31.2356923,121.4854295],[31.2356242,121.4854532],[31.2356426,121.4855256],[31.235395,121.4856119],[31.235377,121.4855411],[31.2353126,121.4852879],[31.2356282,121.485178],[31.2356923,121.4854295]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2324577,121.4842331],[31.2322588,121.4843133],[31.2322515,121.4842885],[31.2322251,121.4842992],[31.2322045,121.4842293],[31.2324298,121.4841385],[31.2324577,121.4842331]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.23964,121.4819295],[31.2396869,121.4821099],[31.2394071,121.4822052],[31.2393638,121.4820238],[31.23964,121.4819295]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2359138,121.4824592],[31.235978,121.4827497],[31.2357851,121.482808],[31.2357202,121.4825186],[31.2359138,121.4824592]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2360056,121.4827686],[31.2360559,121.4830252],[31.2356477,121.483145],[31.2355879,121.482896],[31.2356598,121.4828741],[31.2356861,121.4830203],[31.2357588,121.4829952],[31.235735,121.4828512],[31.2358442,121.482818],[31.2358714,121.4829661],[31.2359342,121.4829448],[31.235906,121.482799],[31.2360056,121.4827686]],region:"bund_edge"},{name:"",h:16,ring:[[31.2352578,121.4817735],[31.2353005,121.4819894],[31.2351781,121.4820225],[31.2351354,121.4818065],[31.2352578,121.4817735]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2355167,121.483334],[31.2357513,121.4838844],[31.2356179,121.4839589],[31.2353733,121.4834036],[31.2353771,121.4833793],[31.2353931,121.4833622],[31.2355167,121.483334]],region:"bund_edge"},{name:"\u661F\u817E\u5927\u53A6",h:96,ring:[[31.2326986,121.4828008],[31.2323272,121.4828881],[31.2322785,121.4826053],[31.2326499,121.4825179],[31.2326986,121.4828008]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2323863,121.483561],[31.2325924,121.4841529],[31.232574,121.4841886],[31.2324659,121.4842352],[31.232427,121.4841118],[31.2324602,121.4840975],[31.2324406,121.4840355],[31.2323991,121.4840143],[31.2322649,121.4836215],[31.2323863,121.483561]],region:"bund_edge"},{name:"\u521B\u4E1A\u5927\u697C",h:28.8,ring:[[31.2352008,121.4849928],[31.2348805,121.4851255],[31.2348544,121.4850296],[31.2348119,121.4850475],[31.2347693,121.4848847],[31.2351235,121.4847273],[31.2352008,121.4849928]],region:"bund_edge"},{name:"\u9AD8\u767B\u91D1\u878D\u5927\u53A6",h:51.2,ring:[[31.2353828,121.4857891],[31.2354417,121.486013],[31.2351531,121.4861168],[31.2351173,121.4860875],[31.2350814,121.4859533],[31.2350986,121.4858914],[31.2353828,121.4857891]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2361986,121.4835931],[31.2362335,121.4837384],[31.2357993,121.4838702],[31.2356534,121.4835339],[31.2360394,121.4834326],[31.2360834,121.4836187],[31.2361986,121.4835931]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2318974,121.4821518],[31.2310555,121.4824077],[31.2310459,121.4824539],[31.2310889,121.4824874],[31.2319249,121.4823378],[31.2319476,121.4823014],[31.2318974,121.4821518]],region:"bund_edge"},{name:"",h:16,ring:[[31.2346929,121.484524],[31.2347492,121.484734],[31.2344752,121.4848345],[31.234382,121.4844874],[31.234553,121.4844247],[31.2345723,121.4844966],[31.2346086,121.4844832],[31.2346262,121.4845485],[31.2346929,121.484524]],region:"bund_edge"},{name:"\u56DB\u5DDD\u5927\u697C",h:25.6,ring:[[31.2343713,121.4849019],[31.2344471,121.4850018],[31.2345234,121.4850601],[31.2345919,121.4850889],[31.2346495,121.4850935],[31.2347563,121.4850447],[31.2347888,121.4851579],[31.2346192,121.4852375],[31.2345415,121.4852326],[31.2344766,121.4851936],[31.234425,121.4851626],[31.2343609,121.4851112],[31.2343034,121.4850479],[31.2342466,121.4849555],[31.2343713,121.4849019]],region:"bund_edge"},{name:"\u4E0A\u6D77\u533B\u836F\u5DE5\u4E1A\u6709\u9650\u516C\u53F8",h:19.2,ring:[[31.2399151,121.4840905],[31.2399478,121.4841161],[31.240031,121.4844329],[31.2397181,121.4845428],[31.2396225,121.4841952],[31.2399151,121.4840905]],region:"bund_edge"},{name:"\u4E45\u4E8B\u5546\u52A1\u5927\u53A6",h:16,ring:[[31.2382583,121.4831013],[31.2383962,121.4837302],[31.2383297,121.4837502],[31.2383401,121.4837995],[31.2383757,121.4838221],[31.2383866,121.483874],[31.2383633,121.4839139],[31.238324,121.4839321],[31.2382811,121.4839006],[31.2382539,121.4839102],[31.23826,121.4839453],[31.2379099,121.4840518],[31.2379021,121.484016],[31.2378772,121.4840235],[31.2378572,121.4840675],[31.2378155,121.484083],[31.2377702,121.4840563],[31.2377587,121.4839965],[31.2377953,121.4839395],[31.2376701,121.4833682],[31.2380255,121.4832617],[31.2380069,121.4831767],[31.2382583,121.4831013]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2363875,121.4835108],[31.2361078,121.4835922],[31.2360734,121.4834308],[31.2363532,121.4833494],[31.2363875,121.4835108]],region:"bund_edge"},{name:"\u5143\u82B3\u5F04",h:9.6,ring:[[31.2368551,121.4850546],[31.2369014,121.4852361],[31.236704,121.4853051],[31.2366577,121.4851236],[31.2368551,121.4850546]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u9AD8\u7EA7\u4EBA\u6C11\u6CD5\u9662",h:25.6,ring:[[31.2366919,121.4817934],[31.2367437,121.4820298],[31.23641,121.4821339],[31.2363561,121.4818976],[31.2366919,121.4817934]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2395389,121.4845779],[31.239594,121.484803],[31.239394,121.48487],[31.2393647,121.4847505],[31.2393176,121.4847663],[31.2393456,121.4848804],[31.2391405,121.4849492],[31.2390867,121.4847294],[31.2395389,121.4845779]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2387017,121.4827616],[31.238745,121.4829736],[31.2384088,121.4830675],[31.2383655,121.4828556],[31.2387017,121.4827616]],region:"bund_edge"},{name:"",h:16,ring:[[31.2365527,121.4855957],[31.2363899,121.485651],[31.2363721,121.4855795],[31.2365349,121.4855242],[31.2365527,121.4855957]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5916\u6EE9\u5357\u4EAC\u4E1C\u8DEF\u4E9A\u6735\u9152\u5E97",h:25.6,ring:[[31.2365147,121.4835171],[31.236655,121.4841771],[31.2364474,121.4842438],[31.2363128,121.483572],[31.2365147,121.4835171]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2381129,121.4849423],[31.2378154,121.4849859],[31.2378083,121.4849196],[31.2378317,121.4849161],[31.2378191,121.4847986],[31.2377966,121.4848016],[31.2377889,121.4847335],[31.2380858,121.4846894],[31.2381129,121.4849423]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u4ED3\u50A8\u884C\u4E1A\u534F\u4F1A",h:28.8,ring:[[31.2366733,121.484263],[31.2367146,121.4844744],[31.2364978,121.4845323],[31.2364565,121.4843209],[31.2366733,121.484263]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2364896,121.4830565],[31.2365175,121.4832188],[31.2365559,121.4834498],[31.2364513,121.4834733],[31.2363809,121.4830837],[31.2364896,121.4830565]],region:"bund_edge"},{name:"\u4E2D\u56FD\u7535\u4FE1",h:25.6,ring:[[31.2386927,121.4827363],[31.2383605,121.4827968],[31.2383338,121.4826394],[31.2383449,121.4826115],[31.238671,121.4825529],[31.2386927,121.4827363]],region:"bund_edge"},{name:"\u534E\u4E1C\u7535\u529B\u7BA1\u7406\u5C40",h:22.4,ring:[[31.2398327,121.4815905],[31.2399419,121.4819504],[31.239904,121.4820168],[31.2397255,121.4820941],[31.2396545,121.4818604],[31.2396758,121.4818504],[31.2396281,121.4816782],[31.2397949,121.4816062],[31.2398327,121.4815905]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2370604,121.4854373],[31.2371409,121.4857018],[31.2370622,121.4857345],[31.2369818,121.48547],[31.2370604,121.4854373]],region:"bund_edge"},{name:"",h:51.2,ring:[[31.2390729,121.4840262],[31.2391517,121.4843856],[31.2390168,121.4844261],[31.2389379,121.4840667],[31.2390729,121.4840262]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2367403,121.483163],[31.2367802,121.4833722],[31.2366664,121.4834018],[31.2366263,121.4831905],[31.2367403,121.483163]],region:"bund_edge"},{name:"",h:16,ring:[[31.2372194,121.4850196],[31.2372258,121.4850468],[31.2372439,121.4851283],[31.2371941,121.4851435],[31.2372171,121.4852437],[31.2371196,121.4852822],[31.2370684,121.4850629],[31.2372194,121.4850196]],region:"bund_edge"},{name:"\u5143\u82B3\u5F04",h:9.6,ring:[[31.2370228,121.4851939],[31.2369189,121.4852309],[31.2368754,121.485064],[31.2369793,121.4850271],[31.2370228,121.4851939]],region:"bund_edge"},{name:"",h:38.4,ring:[[31.2392236,121.4843943],[31.2392784,121.484617],[31.2391487,121.4846606],[31.2390939,121.4844379],[31.2392236,121.4843943]],region:"bund_edge"},{name:"",h:32,ring:[[31.2381796,121.482983],[31.2381956,121.4830519],[31.2380354,121.4831025],[31.2380195,121.4830336],[31.2381295,121.4829988],[31.2381796,121.482983]],region:"bund_edge"},{name:"\u8054\u5408\u5927\u697C",h:28.8,ring:[[31.2388925,121.4836458],[31.2389009,121.4836849],[31.2389274,121.4838088],[31.2386468,121.4838899],[31.2385899,121.4838263],[31.2385714,121.4837332],[31.2388925,121.4836458]],region:"bund_edge"},{name:"",h:32,ring:[[31.237723,121.4829509],[31.2374105,121.4830297],[31.2373714,121.4828178],[31.2376839,121.482739],[31.237723,121.4829509]],region:"bund_edge"},{name:"\u6C49\u53E3\u8DEF50\u53F7\u5927\u697C",h:12.8,ring:[[31.2388235,121.4840042],[31.2389977,121.4847278],[31.2388052,121.4847912],[31.2386424,121.4841144],[31.2386557,121.4840594],[31.2388235,121.4840042]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u653F\u5E9C\u53C2\u4E8B\u5BA4",h:32,ring:[[31.2380678,121.4842968],[31.2381318,121.4845994],[31.2377719,121.4847035],[31.2377648,121.4846702],[31.237708,121.4844009],[31.2380678,121.4842968]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2384922,121.4850236],[31.2385491,121.4852829],[31.2384462,121.4853138],[31.2383895,121.485054],[31.2384922,121.4850236]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2408864,121.4829017],[31.2406994,121.4829884],[31.2406645,121.4828799],[31.2408539,121.4827917],[31.2408864,121.4829017]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2426227,121.4834437],[31.2426218,121.4836404],[31.242605,121.4836623],[31.242364,121.4836084],[31.2423681,121.4833838],[31.2424495,121.4833853],[31.2424488,121.4834438],[31.2426227,121.4834437]],region:"bund_edge"},{name:"",h:32,ring:[[31.2376683,121.4829921],[31.2377097,121.4832053],[31.2374987,121.4832612],[31.2374574,121.483048],[31.2376683,121.4829921]],region:"bund_edge"},{name:"\u624B\u8868\u4E03\u5382\u529E\u516C\u697C",h:12.8,ring:[[31.2373097,121.4840984],[31.2374403,121.4840623],[31.2374502,121.4841127],[31.2375806,121.4840766],[31.2375924,121.4841355],[31.237674,121.4841086],[31.237699,121.4842169],[31.2373705,121.4843217],[31.2373446,121.4843055],[31.2373097,121.4840984]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2375571,121.4835315],[31.2372423,121.4836214],[31.2372094,121.4834243],[31.2375256,121.483345],[31.2375571,121.4835315]],region:"bund_edge"},{name:"\u5143\u82B3\u5927\u697C",h:19.2,ring:[[31.2365403,121.4849925],[31.2366414,121.4854338],[31.2363517,121.4855296],[31.236204,121.4851082],[31.2365403,121.4849925]],region:"bund_edge"},{name:"\u534E\u4E1C\u5EFA\u7B51\u8BBE\u8BA1\u7814\u7A76\u9662",h:32,ring:[[31.2381094,121.4826451],[31.2382265,121.4827386],[31.2382457,121.4828176],[31.2382762,121.4829523],[31.2381796,121.482983],[31.2381295,121.4829988],[31.2380986,121.4828631],[31.238062,121.4828712],[31.2378177,121.4829249],[31.2378009,121.4829286],[31.2377582,121.482932],[31.2377203,121.4827316],[31.2381094,121.4826451]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.237272,121.4846837],[31.2373357,121.4849826],[31.2372194,121.4850196],[31.2371048,121.4850498],[31.2370418,121.4847536],[31.237181,121.48471],[31.237272,121.4846837]],region:"bund_edge"},{name:"\u5B89\u5229\u5927\u697C",h:22.4,ring:[[31.2396877,121.4837394],[31.2397718,121.4840764],[31.2395692,121.4841544],[31.2394945,121.4838534],[31.2395048,121.4838118],[31.2396877,121.4837394]],region:"bund_edge"},{name:"\u4E0A\u6D77\u533B\u836F\u5DE5\u4E1A\u6709\u9650\u516C\u53F8",h:19.2,ring:[[31.2394337,121.4840621],[31.2394129,121.4840713],[31.2392096,121.4841452],[31.2391698,121.483995],[31.2391671,121.4839137],[31.2393558,121.4838488],[31.2393848,121.4838775],[31.2394337,121.4840621]],region:"bund_edge"},{name:"",h:32,ring:[[31.2394791,121.4843201],[31.2392641,121.4843983],[31.2391979,121.4841495],[31.2392096,121.4841452],[31.2394129,121.4840713],[31.2394791,121.4843201]],region:"bund_edge"},{name:"",h:16,ring:[[31.2373407,121.4850072],[31.2373877,121.4852197],[31.2373698,121.4852251],[31.2372719,121.4852571],[31.2372439,121.4851283],[31.2372258,121.4850468],[31.2373407,121.4850072]],region:"bund_edge"},{name:"",h:32,ring:[[31.2390421,121.4827984],[31.2391235,121.4831219],[31.2390883,121.4831338],[31.2391005,121.4831863],[31.2388568,121.483243],[31.2387713,121.482894],[31.2388049,121.4828816],[31.2387967,121.4828545],[31.2390421,121.4827984]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2376198,121.4835706],[31.2376736,121.4838116],[31.2376117,121.4838316],[31.2372815,121.4839373],[31.2372366,121.4836891],[31.2376198,121.4835706]],region:"bund_edge"},{name:"\u4E2D\u56FD\u5EFA\u8BBE\u94F6\u884C",h:25.6,ring:[[31.2414599,121.4831796],[31.2414317,121.4834717],[31.2411502,121.4835885],[31.2410665,121.4833471],[31.2414599,121.4831796]],region:"bund_edge"},{name:"\u5143\u82B3\u5F04",h:9.6,ring:[[31.2369353,121.4848295],[31.2365917,121.4849402],[31.236626,121.4850856],[31.2369696,121.4849749],[31.2369353,121.4848295]],region:"bund_edge"},{name:"",h:32,ring:[[31.2395213,121.4845364],[31.239325,121.4846029],[31.2392847,121.48444],[31.239481,121.4843736],[31.2395213,121.4845364]],region:"bund_edge"},{name:"\u5B89\u57F9\u6D0B\u884C\u5927\u697C",h:9.6,ring:[[31.2432188,121.4835176],[31.2432411,121.4837319],[31.2430065,121.483769],[31.2429741,121.4837652],[31.2429549,121.4837461],[31.2429359,121.4835673],[31.2432188,121.4835176]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2423021,121.4830773],[31.2423377,121.4830749],[31.2423376,121.4835888],[31.2421582,121.4835821],[31.2421601,121.483477],[31.2421952,121.4834889],[31.2421968,121.4833426],[31.242175,121.4833427],[31.2421775,121.4832166],[31.2423021,121.4830773]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2376117,121.4838316],[31.2376514,121.4840049],[31.2374403,121.4840623],[31.2373097,121.4840984],[31.2372815,121.4839373],[31.2376117,121.4838316]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u673A\u8981\u901A\u4FE1\u5C40",h:6.4,ring:[[31.2377169,121.4846863],[31.2377795,121.4850025],[31.2374916,121.4850941],[31.2374277,121.4847683],[31.2377169,121.4846863]],region:"bund_edge"},{name:"",h:16,ring:[[31.2362786,121.4822564],[31.2362605,121.4823525],[31.2362704,121.4824089],[31.2360339,121.4824836],[31.2360058,121.482333],[31.2362786,121.4822564]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2369988,121.4847671],[31.2367804,121.4848383],[31.2367482,121.4847051],[31.2369681,121.4846335],[31.2369988,121.4847671]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2369677,121.4854915],[31.2370406,121.4857262],[31.2368352,121.4858134],[31.2367623,121.4855788],[31.2369677,121.4854915]],region:"bund_edge"},{name:"\u60E0\u7F57\u516C\u53F8",h:25.6,ring:[[31.2408741,121.4830616],[31.2409398,121.4832585],[31.2409764,121.483371],[31.2408694,121.4834218],[31.2406859,121.4834985],[31.2406325,121.4835188],[31.2405548,121.4832775],[31.2405723,121.4832076],[31.2408741,121.4830616]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2362369,121.4824729],[31.2362735,121.4826433],[31.2360826,121.4827162],[31.2360505,121.4825387],[31.2362369,121.4824729]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2414475,121.4834802],[31.2414216,121.4837279],[31.2411056,121.483884],[31.2410351,121.4836751],[31.2414475,121.4834802]],region:"bund_edge"},{name:"\u6148\u5B89\u91CC\u5927\u697C",h:12.8,ring:[[31.2404227,121.4825384],[31.2405446,121.4829372],[31.2406645,121.4828799],[31.2406994,121.4829884],[31.2407141,121.4830341],[31.2405838,121.4830998],[31.2405186,121.483132],[31.2404759,121.4831096],[31.240319,121.4826024],[31.2404227,121.4825384]],region:"bund_edge"},{name:"\u6148\u660C\u91CC\u5927\u697C",h:12.8,ring:[[31.240626,121.4819913],[31.2403428,121.482114],[31.2404282,121.4823563],[31.2403751,121.4823873],[31.2404159,121.4824978],[31.2403045,121.4825588],[31.2401517,121.4820858],[31.2401733,121.4820295],[31.2405895,121.4818676],[31.240626,121.4819913]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2414974,121.4818953],[31.2415699,121.4821228],[31.2414167,121.4821917],[31.2413436,121.4819624],[31.2414974,121.4818953]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2370362,121.4854114],[31.2367977,121.4854922],[31.2367639,121.4853556],[31.2370024,121.4852748],[31.2370362,121.4854114]],region:"bund_edge"},{name:"\u798F\u5DDE\u5927\u697C",h:44.8,ring:[[31.2370107,121.4832227],[31.2368858,121.4832593],[31.236837,121.483271],[31.2368319,121.4832276],[31.2367831,121.4831886],[31.2367969,121.483157],[31.2367324,121.4831178],[31.2367125,121.4830051],[31.2368156,121.4829691],[31.2368228,121.4830004],[31.2368311,121.483033],[31.2368487,121.4830627],[31.2368684,121.4830867],[31.236891,121.483103],[31.2369112,121.4831101],[31.236943,121.4831144],[31.2369646,121.4831108],[31.2369893,121.4831048],[31.2370107,121.4832227]],region:"bund_edge"},{name:"\u7533\u8FBE\u5927\u697C",h:19.2,ring:[[31.237109,121.4838207],[31.2371866,121.4842417],[31.2371828,121.4842759],[31.2371707,121.484307],[31.2371518,121.4843277],[31.2371234,121.4843454],[31.2368009,121.4844469],[31.2367739,121.484306],[31.2367867,121.4842409],[31.2368145,121.4842332],[31.2368086,121.4842012],[31.23686,121.4841863],[31.2369861,121.48415],[31.2370055,121.4842467],[31.2370652,121.4842262],[31.2369918,121.4838522],[31.237109,121.4838207]],region:"bund_edge"},{name:"\u7533\u534E\u91D1\u878D\u5927\u53A6",h:102.4,ring:[[31.2417018,121.4823821],[31.2414673,121.4824876],[31.241376,121.48221],[31.2414167,121.4821917],[31.2415699,121.4821228],[31.2416105,121.4821046],[31.2417018,121.4823821]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2370107,121.4832227],[31.2371025,121.4837028],[31.2369743,121.4837376],[31.2369499,121.4836124],[31.2368302,121.4836559],[31.2368457,121.483753],[31.2367381,121.483788],[31.2366755,121.4834371],[31.2367895,121.4834024],[31.236807,121.4835104],[31.2369263,121.4834808],[31.2368858,121.4832593],[31.2370107,121.4832227]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2380939,121.4842885],[31.2381167,121.4843942],[31.2384519,121.4842953],[31.2386631,121.4852746],[31.2387674,121.4852438],[31.2385523,121.4842471],[31.2385189,121.4841939],[31.2384787,121.4841751],[31.2380939,121.4842885]],region:"bund_edge"},{name:"",h:57.6,ring:[[31.2390009,121.482596],[31.2390441,121.4827829],[31.2389057,121.4828145],[31.2388882,121.4827352],[31.2388395,121.4827016],[31.2387147,121.482737],[31.2386794,121.4825674],[31.2389118,121.4825129],[31.2390009,121.482596]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2423038,121.4830544],[31.2423417,121.4830536],[31.2423424,121.4830098],[31.2422316,121.4827522],[31.2421502,121.4827926],[31.2421252,121.4827129],[31.2420825,121.4827315],[31.2421075,121.4828144],[31.2420859,121.4828221],[31.2421306,121.4829523],[31.2421804,121.4830853],[31.2422065,121.4831272],[31.2423038,121.4830544]],region:"bund_edge"},{name:"",h:6.4,ring:[[31.2373698,121.4852251],[31.2374445,121.4855525],[31.2374214,121.4855594],[31.2374412,121.4856497],[31.2373694,121.4856754],[31.2373155,121.4856942],[31.2372524,121.4857172],[31.2372136,121.4857002],[31.2371783,121.4857122],[31.2370939,121.4853525],[31.2371156,121.4853455],[31.2371083,121.4853093],[31.2372719,121.4852571],[31.2373698,121.4852251]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2371659,121.4833625],[31.2371317,121.4831614],[31.2372708,121.4831208],[31.2372856,121.4832074],[31.2374153,121.4831782],[31.2374344,121.4832907],[31.2371659,121.4833625]],region:"bund_edge"},{name:"\u798F\u6C11\u5546\u53A6",h:28.8,ring:[[31.2306459,121.4875776],[31.2306485,121.487909],[31.2304944,121.4879106],[31.2304948,121.4879589],[31.2301416,121.4879627],[31.2301419,121.4880094],[31.2300486,121.4880104],[31.2300483,121.4879681],[31.2299683,121.4879689],[31.2299675,121.4878722],[31.2299118,121.4878728],[31.2299096,121.4875854],[31.2306459,121.4875776]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2332727,121.4863783],[31.2334375,121.4869927],[31.2332819,121.4870555],[31.2332142,121.4868043],[31.2332409,121.4867925],[31.2331392,121.4864304],[31.2331791,121.4864132],[31.2332727,121.4863783]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2332364,121.4869422],[31.2332698,121.4870633],[31.2330632,121.4871412],[31.2330298,121.4870201],[31.2332364,121.4869422]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2326304,121.4843313],[31.2326995,121.4845632],[31.2326184,121.4845981],[31.2326022,121.4846044],[31.2325327,121.4843712],[31.2326304,121.4843313]],region:"bund_edge"},{name:"\u7D2B\u9526\u57CE\u767E\u8D27",h:28.8,ring:[[31.2306877,121.4863944],[31.2306817,121.4868482],[31.230272,121.4868407],[31.230278,121.4863869],[31.2306877,121.4863944]],region:"bund_edge"},{name:"\u5916\u6EE9NEO",h:28.8,ring:[[31.2312559,121.486913],[31.2312432,121.4874492],[31.230786,121.4874344],[31.2307987,121.4868982],[31.2312559,121.486913]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2325947,121.4861543],[31.2326206,121.4862771],[31.2321713,121.4864069],[31.2321453,121.486284],[31.2325947,121.4861543]],region:"bund_edge"},{name:"",h:38.4,ring:[[31.2327585,121.4885218],[31.2329123,121.489],[31.2327774,121.4890643],[31.232623,121.488582],[31.2327585,121.4885218]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2330606,121.4864956],[31.2331411,121.4864642],[31.2331666,121.4865536],[31.2331341,121.4865662],[31.2331938,121.4867758],[31.2331458,121.4867945],[31.2330606,121.4864956]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2327309,121.4845498],[31.2328088,121.4847979],[31.2327965,121.4848032],[31.2327012,121.4848441],[31.2326963,121.4848462],[31.2326184,121.4845981],[31.2326995,121.4845632],[31.2327309,121.4845498]],region:"bund_edge"},{name:"\u798F\u4F51\u5546\u53A6",h:28.8,ring:[[31.2306603,121.4870455],[31.2306595,121.4874437],[31.2299133,121.4874417],[31.2299141,121.4870435],[31.2306603,121.4870455]],region:"bund_edge"},{name:"\u6CAA\u5357\u94B1\u4E1A\u516C\u6240",h:3.2,ring:[[31.2306535,121.4882651],[31.2306627,121.4884657],[31.2305,121.4884759],[31.2303827,121.4884833],[31.2303776,121.4883724],[31.2303735,121.4882827],[31.2306535,121.4882651]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2330009,121.4858343],[31.2330298,121.4859363],[31.2330469,121.4859964],[31.2330909,121.4861517],[31.2329454,121.4861866],[31.232864,121.4858964],[31.2329515,121.4858604],[31.2330009,121.4858343]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2327309,121.4871899],[31.232749,121.4872534],[31.232627,121.4873011],[31.2326089,121.4872376],[31.2327309,121.4871899]],region:"bund_edge"},{name:"\u57CE\u968D\u5E99\u7B2C\u4E00\u8D2D\u7269\u4E2D\u5FC3",h:19.2,ring:[[31.2305589,121.4854244],[31.230564,121.4858965],[31.2300577,121.485904],[31.2300012,121.4858472],[31.2299712,121.4857747],[31.2299674,121.4854332],[31.2305589,121.4854244]],region:"bund_edge"},{name:"\u8C6B\u56ED\u9102\u5C14\u591A\u65AF\u5E7F\u573A",h:19.2,ring:[[31.230558,121.4844651],[31.2305522,121.4850455],[31.2300035,121.485038],[31.2300068,121.4847017],[31.2304078,121.4847071],[31.2304104,121.4844512],[31.230558,121.4844651]],region:"bund_edge"},{name:"\u51EF\u77F3\u5927\u53A6",h:32,ring:[[31.2348197,121.4871195],[31.2348918,121.4873494],[31.2347661,121.4875091],[31.2346537,121.4873654],[31.2346362,121.4871919],[31.2348197,121.4871195]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2347463,121.4868191],[31.2348197,121.4871195],[31.2346362,121.4871919],[31.2345583,121.48687],[31.2347463,121.4868191]],region:"bund_edge"},{name:"",h:32,ring:[[31.2341903,121.4858521],[31.2342681,121.4860558],[31.2341728,121.4861056],[31.234095,121.485902],[31.2341903,121.4858521]],region:"bund_edge"},{name:"",h:32,ring:[[31.2345881,121.4864623],[31.234478,121.4864865],[31.2345583,121.48687],[31.2347463,121.4868191],[31.2345881,121.4864623]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2344013,121.4866338],[31.2344438,121.4868988],[31.2343967,121.4869092],[31.2344081,121.4869801],[31.2343251,121.4869983],[31.2342712,121.4866623],[31.2344013,121.4866338]],region:"bund_edge"},{name:"",h:32,ring:[[31.2342464,121.4863098],[31.2343068,121.4866112],[31.2342171,121.4866358],[31.2341567,121.4863344],[31.2342464,121.4863098]],region:"bund_edge"},{name:"",h:32,ring:[[31.2343128,121.4860654],[31.2343508,121.4861565],[31.2343726,121.4861699],[31.2343977,121.4862398],[31.2341455,121.4862733],[31.2341167,121.4861459],[31.2343128,121.4860654]],region:"bund_edge"},{name:"\u5916\u6EE9\u53F2\u9648\u5217\u5BA4",h:6.4,ring:[[31.235213,121.4876897],[31.2352521,121.4877521],[31.2351063,121.487877],[31.2350672,121.4878146],[31.235213,121.4876897]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2340248,121.4862664],[31.2337765,121.4863636],[31.2337294,121.486199],[31.2339776,121.4861017],[31.2340248,121.4862664]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2339463,121.4861007],[31.2338131,121.4861467],[31.233783,121.4860274],[31.2339162,121.4859814],[31.2339463,121.4861007]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2334511,121.4878921],[31.2333411,121.4879339],[31.233139,121.487205],[31.233249,121.4871633],[31.2334511,121.4878921]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2341249,121.4866327],[31.2338916,121.4867147],[31.2338745,121.4866484],[31.2338948,121.4866413],[31.2338709,121.4865482],[31.2340839,121.4864733],[31.2341249,121.4866327]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2338404,121.4869171],[31.2337513,121.4869478],[31.2337187,121.4868185],[31.233741,121.4868108],[31.2337095,121.4866853],[31.2337764,121.4866623],[31.2338404,121.4869171]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.233557,121.4880162],[31.233585,121.4881263],[31.233482,121.4881621],[31.233454,121.4880519],[31.233557,121.4880162]],region:"bund_edge"},{name:"\u8054\u8C0A\u5927\u53A6",h:9.6,ring:[[31.2352955,121.4852224],[31.235377,121.4855411],[31.2352469,121.485593],[31.23496,121.4857077],[31.2349246,121.4857218],[31.2348951,121.4856826],[31.2348657,121.4856434],[31.2348199,121.4854931],[31.234864,121.4853868],[31.2351602,121.4852739],[31.2352955,121.4852224]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2334474,121.4870984],[31.2334818,121.4871459],[31.233665,121.4878161],[31.2335902,121.4878433],[31.233549,121.4878584],[31.2333496,121.4871344],[31.2334474,121.4870984]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2335767,121.4878701],[31.2336105,121.4879942],[31.2335854,121.4880034],[31.233557,121.4880162],[31.233454,121.4880519],[31.2334459,121.4880563],[31.2334119,121.4879316],[31.2335767,121.4878701]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2358319,121.4851878],[31.2358826,121.4853657],[31.2357272,121.4854294],[31.2356432,121.4851095],[31.2357162,121.4850805],[31.2357585,121.485095],[31.2357936,121.4851209],[31.235814,121.4851501],[31.2358319,121.4851878]],region:"bund_edge"},{name:"Bund 15",h:35.2,ring:[[31.2329195,121.4888958],[31.2331973,121.4887553],[31.2331787,121.4886894],[31.2335286,121.4883567],[31.2336331,121.488708],[31.2330421,121.4893038],[31.2330198,121.4892263],[31.2329713,121.4890683],[31.2329195,121.4888958]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2340365,121.4864605],[31.2338053,121.4865403],[31.2337693,121.4863975],[31.2340004,121.4863177],[31.2340365,121.4864605]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.233783,121.4861507],[31.2336951,121.4861811],[31.2336661,121.4860663],[31.2337541,121.4860359],[31.233783,121.4861507]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.233665,121.4878161],[31.2337035,121.4879608],[31.2336288,121.487988],[31.2335902,121.4878433],[31.233665,121.4878161]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2341385,121.4868495],[31.2339045,121.4869302],[31.2338622,121.4867623],[31.2340961,121.4866815],[31.2341385,121.4868495]],region:"bund_edge"},{name:"",h:48,ring:[[31.2338829,121.4869877],[31.2339053,121.4870709],[31.2338271,121.4870998],[31.2338941,121.4873482],[31.2339515,121.4873271],[31.2339687,121.4873907],[31.2338186,121.487446],[31.2337974,121.4874198],[31.233786,121.4873777],[31.2337639,121.4873859],[31.2336769,121.4870638],[31.2338829,121.4869877]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2341309,121.4869281],[31.2342284,121.4873043],[31.2340209,121.4873779],[31.2339233,121.4870017],[31.2341309,121.4869281]],region:"bund_edge"},{name:"\u4E1C\u65B9\u996D\u5E97",h:89.6,ring:[[31.2337354,121.4881188],[31.2334593,121.4882328],[31.2334877,121.4883373],[31.2335676,121.4883075],[31.233583,121.4883666],[31.2336376,121.4883718],[31.2336549,121.4884416],[31.2336268,121.4884736],[31.2336472,121.4885498],[31.2337173,121.4886465],[31.2338117,121.4885535],[31.2338245,121.4884707],[31.2337354,121.4881188]],region:"bund_edge"},{name:"\u82E5\u745F\u5802",h:6.4,ring:[[31.2326974,121.4856928],[31.2327416,121.4856746],[31.2327661,121.485756],[31.2325769,121.4858339],[31.2325524,121.4857525],[31.2326094,121.485729],[31.2325566,121.4855511],[31.2324715,121.4855856],[31.2324449,121.4854958],[31.2325299,121.4854613],[31.2325052,121.485378],[31.2325937,121.4853421],[31.2326185,121.4854255],[31.2326973,121.4853936],[31.2327237,121.4854829],[31.2326447,121.4855149],[31.2326974,121.4856928]],region:"bund_edge"},{name:"",h:16,ring:[[31.2343853,121.4838182],[31.2344421,121.484087],[31.2343214,121.4841234],[31.2342631,121.483853],[31.2343853,121.4838182]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2344501,121.4843924],[31.2341093,121.4845063],[31.2340381,121.4842331],[31.2341643,121.484192],[31.2344332,121.4841133],[31.234447,121.4841752],[31.2344059,121.4841896],[31.2344501,121.4843924]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2346914,121.4837105],[31.2347512,121.4840041],[31.2346309,121.4840425],[31.2345711,121.4837497],[31.2346914,121.4837105]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2354694,121.4839095],[31.2355491,121.4841486],[31.2354613,121.4841823],[31.2354092,121.484203],[31.2353296,121.4839601],[31.2353985,121.4839342],[31.2354694,121.4839095]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2335204,121.4854639],[31.2338014,121.4853245],[31.2338738,121.4855239],[31.2335929,121.4856634],[31.2335204,121.4854639]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2354161,121.4847234],[31.2354692,121.4848944],[31.235228,121.484997],[31.2351748,121.484826],[31.2354161,121.4847234]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2345385,121.4837604],[31.2345939,121.4840413],[31.2344771,121.4840802],[31.2344218,121.4837981],[31.2345385,121.4837604]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2348391,121.4836693],[31.2348986,121.483955],[31.2347813,121.4839932],[31.2347232,121.4837097],[31.2348391,121.4836693]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2334184,121.4852426],[31.2337349,121.4850924],[31.2337961,121.4852689],[31.2334796,121.4854191],[31.2334184,121.4852426]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2428992,121.4823078],[31.2427776,121.482348],[31.2427444,121.4824164],[31.2427432,121.4827396],[31.2427719,121.4827866],[31.2427983,121.4828107],[31.2429129,121.482808],[31.2429136,121.4826801],[31.2428552,121.4826817],[31.2428567,121.4824513],[31.2429302,121.4824226],[31.2428992,121.4823078]],region:"bund_edge"},{name:"",h:16,ring:[[31.2431485,121.4823123],[31.2433211,121.4823132],[31.2433194,121.4827959],[31.2431468,121.4827951],[31.2431485,121.4823123]],region:"bund_edge"},{name:"\u4E9A\u6D32\u6587\u4F1A\u5927\u697C",h:19.2,ring:[[31.2432308,121.4829615],[31.2432614,121.4833064],[31.2431489,121.4833201],[31.2431182,121.4829752],[31.2432308,121.4829615]],region:"bund_edge"},{name:"\u5706\u660E\u56ED\u516C\u5BD3",h:19.2,ring:[[31.2435419,121.4836351],[31.243501,121.4836929],[31.2432411,121.4837319],[31.2432188,121.4835176],[31.2432162,121.4834923],[31.2435198,121.4834471],[31.2435419,121.4836351]],region:"bund_edge"},{name:"",h:16,ring:[[31.2427291,121.4833359],[31.2428949,121.4833356],[31.2428942,121.4837374],[31.2427238,121.4837256],[31.2427291,121.4833359]],region:"bund_edge"},{name:"\u4E2D\u5B9E\u5927\u697C",h:22.4,ring:[[31.2427308,121.4830428],[31.2427291,121.4833359],[31.2428949,121.4833356],[31.2430681,121.4833326],[31.2430264,121.4829712],[31.2427765,121.482991],[31.2427544,121.4830024],[31.2427409,121.4830203],[31.2427308,121.4830428]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2426198,121.4823521],[31.2421776,121.4825069],[31.2422343,121.4826255],[31.2423395,121.482583],[31.2424662,121.4825345],[31.2424627,121.4829462],[31.2426233,121.4829489],[31.2426347,121.4823736],[31.2426198,121.4823521]],region:"bund_edge"},{name:"\u6C99\u7F8E\u5927\u697C",h:16,ring:[[31.2428323,121.4816975],[31.2426931,121.4817469],[31.2427199,121.4821146],[31.2427328,121.482131],[31.2427502,121.4821404],[31.2429248,121.4820809],[31.2428323,121.4816975]],region:"bund_edge"},{name:"",h:38.4,ring:[[31.2439556,121.4833603],[31.2438355,121.4833748],[31.2438224,121.4832515],[31.2437976,121.4830185],[31.2439171,121.4830203],[31.2439556,121.4833603]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2386772,121.4830422],[31.238707,121.4830639],[31.2387286,121.4831058],[31.2387587,121.4832443],[31.2384608,121.483333],[31.2384145,121.4831206],[31.2386772,121.4830422]],region:"bund_edge"},{name:"\u7231\u5EFA\u91D1\u878D\u5927\u697C",h:25.6,ring:[[31.2387749,121.4832958],[31.2388496,121.4836161],[31.2386085,121.483693],[31.2385895,121.4836121],[31.2386033,121.4835947],[31.2385727,121.4834591],[31.2385523,121.4834528],[31.2385336,121.4833727],[31.2387749,121.4832958]],region:"bund_edge"},{name:"\u4E0A\u6295\u5927\u53A6",h:41.6,ring:[[31.2391574,121.483189],[31.2392411,121.4834941],[31.2389343,121.4835819],[31.2388639,121.4833115],[31.2389718,121.4832743],[31.2389647,121.4832359],[31.2391574,121.483189]],region:"bund_edge"},{name:"\u5EFA\u8BBE\u5927\u53A6",h:57.6,ring:[[31.2367788,121.4827058],[31.2367737,121.4827259],[31.2367726,121.4827541],[31.2367738,121.4827836],[31.2367796,121.4828155],[31.2367106,121.4828375],[31.2366747,121.4826771],[31.2367173,121.4825685],[31.236852,121.482527],[31.2368623,121.4825238],[31.2368831,121.4826197],[31.2368598,121.4826272],[31.2368392,121.4826346],[31.2368199,121.4826477],[31.2368028,121.4826606],[31.236793,121.4826761],[31.2367873,121.4826891],[31.2367788,121.4827058]],region:"bund_edge"},{name:"",h:112,ring:[[31.2318197,121.4829887],[31.2314623,121.4830882],[31.2314303,121.4830563],[31.2314024,121.4830202],[31.2313845,121.4829656],[31.2313803,121.4829094],[31.2313938,121.4828553],[31.2314259,121.4828177],[31.2314633,121.4828029],[31.2316942,121.4827266],[31.2317419,121.4827216],[31.2317798,121.4827309],[31.2318089,121.4827517],[31.23183,121.4827825],[31.2318468,121.4828133],[31.231855,121.4828527],[31.2318556,121.4828896],[31.2318502,121.4829264],[31.2318386,121.4829597],[31.2318197,121.4829887]],region:"bund_edge"},{name:"\u4E2D\u56FD\u90AE\u653F\u50A8\u84C4\u94F6\u884C\u4E0A\u6D77\u5206\u884C",h:19.2,ring:[[31.2399919,121.4845019],[31.2400704,121.4847939],[31.2397892,121.484896],[31.2397106,121.484609],[31.2399919,121.4845019]],region:"bund_edge"},{name:"\u4E1C\u4E9A\u5927\u697C",h:22.4,ring:[[31.2392411,121.4834941],[31.2392749,121.483617],[31.2392695,121.483653],[31.2392469,121.4836991],[31.2389274,121.4838088],[31.2389009,121.4836849],[31.2390141,121.4836531],[31.2390028,121.4835962],[31.2391119,121.483567],[31.2391216,121.4836115],[31.2391714,121.4835929],[31.2391568,121.4835201],[31.2392411,121.4834941]],region:"bund_edge"},{name:"\u7535\u89C6\u793E\u6742\u5FD7\u793E",h:16,ring:[[31.2414956,121.482797],[31.2415105,121.4827576],[31.2418119,121.4826328],[31.2418399,121.4827255],[31.2417576,121.4828124],[31.2417055,121.4827703],[31.2415533,121.4828333],[31.2415857,121.4829405],[31.2416488,121.4829144],[31.2416874,121.4830418],[31.2415828,121.4830851],[31.2414956,121.482797]],region:"bund_edge"},{name:"\u4EC1\u8BB0\u6D0B\u884C\u5927\u697C",h:12.8,ring:[[31.241594,121.4831134],[31.2415568,121.4834446],[31.2415461,121.4834545],[31.2415432,121.4834743],[31.2415505,121.4834874],[31.2415635,121.4834903],[31.2415749,121.4834796],[31.2417613,121.4835095],[31.2417887,121.4832731],[31.2417244,121.4832604],[31.2417397,121.4831364],[31.241594,121.4831134]],region:"bund_edge"},{name:"\u4E2D\u56FD\u6C11\u751F\u94F6\u884C\u5916\u6EE9\u652F\u884C",h:9.6,ring:[[31.2356384,121.4844642],[31.2357376,121.4848289],[31.2357085,121.484897],[31.2355241,121.4849613],[31.2354036,121.4844869],[31.2354653,121.484467],[31.2354809,121.4845237],[31.2354924,121.4845206],[31.2356384,121.4844642]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2334994,121.4867604],[31.2335714,121.48704],[31.2337061,121.4869926],[31.2336341,121.4867129],[31.2334994,121.4867604]],region:"bund_edge"},{name:"\u91D1\u9675\u5927\u697C",h:19.2,ring:[[31.2333969,121.4861723],[31.2335594,121.4861091],[31.2335985,121.4862466],[31.2335445,121.4862706],[31.2335797,121.4863936],[31.2336341,121.4863718],[31.233654,121.4864419],[31.2334894,121.4864998],[31.2335026,121.486555],[31.233451,121.4865687],[31.233368,121.4862481],[31.2333969,121.4861723]],region:"bund_edge"},{name:"\u4E30\u534E\u5927\u697C",h:16,ring:[[31.2326215,121.4897238],[31.2328325,121.4895125],[31.2327575,121.4892832],[31.2324988,121.4894341],[31.2326215,121.4897238]],region:"bund_edge"},{name:"\u8336\u5BA4",h:3,ring:[[31.2300446,121.4889711],[31.2300712,121.4890627],[31.2301213,121.4890428],[31.2300947,121.4889512],[31.2300446,121.4889711]],region:"bund_edge"},{name:"",h:3,ring:[[31.2308996,121.4882014],[31.2308182,121.4882057],[31.230822,121.4883033],[31.2309619,121.4882958],[31.231035,121.4882919],[31.2310312,121.4881944],[31.2308996,121.4882014]],region:"bund_edge"},{name:"",h:3,ring:[[31.2310072,121.4901297],[31.2309578,121.4900804],[31.2308498,121.4902191],[31.2308696,121.4902468],[31.2308518,121.4902745],[31.2308801,121.4903038],[31.2309097,121.4902614],[31.2310072,121.4901297]],region:"bund_edge"},{name:"\u6D66\u4E1C\u7F8E\u672F\u9986",h:30,ring:[[31.24049,121.491529],[31.2399993,121.4915317],[31.2400004,121.4916162],[31.2399763,121.4916149],[31.2399752,121.4916967],[31.2399396,121.4917074],[31.2398869,121.49158],[31.2397688,121.4916511],[31.2398422,121.4918134],[31.2398078,121.4918388],[31.2399488,121.4921258],[31.239927,121.4921406],[31.2401288,121.4925389],[31.2406483,121.4921822],[31.2406035,121.4920816],[31.2407102,121.4920092],[31.24049,121.491529]],region:"bund_edge"},{name:"\u534E\u4FA8\u5927\u697C",h:25.6,ring:[[31.2397162,121.4831665],[31.2393811,121.483297],[31.2393262,121.4830771],[31.2396643,121.482959],[31.2397162,121.4831665]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2410084,121.4830009],[31.2411011,121.4832748],[31.2410243,121.4833239],[31.2409924,121.4832313],[31.2409398,121.4832585],[31.2408741,121.4830616],[31.2410084,121.4830009]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2414755,121.483111],[31.241105,121.4832864],[31.2411011,121.4832748],[31.2410084,121.4830009],[31.2413548,121.4828435],[31.24139,121.4828579],[31.2414755,121.483111]],region:"bund_edge"},{name:"\u5609\u9675\u5927\u697C",h:51.2,ring:[[31.240274,121.4836659],[31.2400493,121.4837474],[31.2400057,121.4835761],[31.2400432,121.4835592],[31.2403941,121.4833932],[31.2404333,121.4835727],[31.2402664,121.4836351],[31.240274,121.4836659]],region:"bund_edge"},{name:"\u65B0\u9EC4\u6D66\u91D1\u878D\u5927\u53A6",h:51.2,ring:[[31.2404647,121.483701],[31.2405884,121.4843419],[31.2403637,121.484405],[31.2403817,121.4844887],[31.2402409,121.4845302],[31.2400796,121.4838305],[31.2404647,121.483701]],region:"bund_edge"},{name:"\u62DB\u5546\u94F6\u884C",h:19.2,ring:[[31.239912,121.4848802],[31.2397547,121.4849411],[31.2398775,121.485424],[31.2400365,121.4853901],[31.239912,121.4848802]],region:"bund_edge"},{name:"\u53CB\u90A6\u5927\u53A6",h:32,ring:[[31.2400915,121.484817],[31.2399512,121.4848763],[31.2400789,121.4853869],[31.2402324,121.4853516],[31.2400915,121.484817]],region:"bund_edge"},{name:"\u5916\u6EE918\u53F7",h:22.4,ring:[[31.2403917,121.4846985],[31.2401448,121.4847948],[31.2402783,121.485328],[31.2405467,121.485303],[31.2405353,121.4851957],[31.2405146,121.4851984],[31.2403917,121.4846985]],region:"bund_edge"},{name:"",h:32,ring:[[31.2399401,121.4836034],[31.2400278,121.4839665],[31.239826,121.484043],[31.2397456,121.4837237],[31.2397947,121.4836752],[31.2398542,121.4836343],[31.2399401,121.4836034]],region:"bund_edge"},{name:"\u4E2D\u592E\u5927\u53A6",h:57.6,ring:[[31.2398243,121.4831874],[31.2398653,121.4833412],[31.2395357,121.4835229],[31.2394499,121.4834704],[31.2394167,121.4833367],[31.2398243,121.4831874]],region:"bund_edge"},{name:"\u4E2D\u592E\u5546\u573A",h:25.6,ring:[[31.2399078,121.4828971],[31.2402131,121.482775],[31.2402867,121.4830423],[31.2402987,121.483098],[31.2402879,121.4831518],[31.2402637,121.4832008],[31.2400187,121.4832998],[31.2399078,121.4828971]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2412271,121.4824257],[31.2412973,121.4826557],[31.2413014,121.4826818],[31.2412991,121.482703],[31.2412872,121.4827241],[31.2412674,121.4827359],[31.2411114,121.4828006],[31.2410767,121.4826972],[31.2410719,121.48268],[31.2411192,121.4826567],[31.2410934,121.4825762],[31.2411176,121.4825634],[31.2410946,121.4824821],[31.2411176,121.4824723],[31.2412271,121.4824257]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u9AD8\u6280\u80FD\u4EBA\u624D\u57F9\u517B\u57FA\u5730",h:19.2,ring:[[31.2411442,121.4821541],[31.2412271,121.4824257],[31.2411176,121.4824723],[31.2410345,121.4822045],[31.2410638,121.48219],[31.2411442,121.4821541]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2408408,121.4823056],[31.2409664,121.4826819],[31.2408773,121.4827296],[31.2407477,121.482349],[31.2408408,121.4823056]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2406575,121.4824117],[31.240776,121.4827765],[31.2406769,121.4828285],[31.2406261,121.4828296],[31.2405941,121.4827902],[31.2405074,121.4825162],[31.2405215,121.4824791],[31.2405618,121.482455],[31.2406575,121.4824117]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2406398,121.4820191],[31.2407289,121.4823197],[31.2406216,121.4823661],[31.2405194,121.4820905],[31.2406398,121.4820191]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2407156,121.4819706],[31.2406811,121.4818474],[31.2409291,121.4817441],[31.2409442,121.4817919],[31.2410554,121.4821628],[31.2407471,121.4822918],[31.240692,121.4821148],[31.2406884,121.4819967],[31.2407156,121.4819706]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2404642,121.4820977],[31.2405711,121.4824037],[31.2404964,121.4824469],[31.2403871,121.4821338],[31.2404642,121.4820977]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.238397,121.4845737],[31.2384618,121.4848774],[31.2384604,121.4848769],[31.2383577,121.4849073],[31.238293,121.484604],[31.238397,121.4845737]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2374902,121.4819284],[31.2375608,121.4822609],[31.2372742,121.4823442],[31.2372035,121.4820117],[31.2374902,121.4819284]],region:"bund_edge"}];var fd={buildings:[{name:"\u4E0A\u6D77\u90AE\u653F\u603B\u5C40\u5927\u697C",h:16,ring:[[31.2464453,121.4810923],[31.246883,121.481042],[31.2469346,121.4809268],[31.2465875,121.4801521],[31.2464322,121.4799147],[31.2460146,121.4802831],[31.2463532,121.4810352],[31.2464453,121.4810923]],region:"northbund"},{name:"\u5973\u9752\u5E74\u4F1A\u5927\u697C",h:25.6,ring:[[31.2438506,121.4836037],[31.2435849,121.4836459],[31.2435713,121.4835062],[31.2437166,121.4834836],[31.2437085,121.4834007],[31.2435623,121.4834158],[31.2435511,121.4832911],[31.2436436,121.4832771],[31.2438148,121.4832512],[31.2438348,121.483444],[31.2438506,121.4836037]],region:"northbund"},{name:"\u54C8\u5BC6\u5927\u697C",h:22.4,ring:[[31.2440599,121.4835669],[31.2438506,121.4836037],[31.2438348,121.483444],[31.2440442,121.4834174],[31.2440599,121.4835669]],region:"northbund"},{name:"\u534F\u8FDB\u5927\u697C",h:19.2,ring:[[31.244533,121.4835023],[31.2440864,121.483564],[31.2440696,121.4833975],[31.2445152,121.4833188],[31.24452,121.4833684],[31.244533,121.4835023]],region:"northbund"},{name:"\u539F\u65B0\u5929\u5B89\u5802",h:19.2,ring:[[31.2452547,121.4838286],[31.2452176,121.4839327],[31.2451391,121.4839],[31.2451244,121.4839442],[31.2450462,121.4839127],[31.2450593,121.4838677],[31.2450154,121.4838497],[31.2450498,121.4837408],[31.2450884,121.4837573],[31.2451022,121.4837132],[31.2451839,121.4837491],[31.2451703,121.4837924],[31.2452547,121.4838286]],region:"northbund"},{name:"\u4FC4\u7F57\u65AF\u9886\u4E8B\u9986",h:16,ring:[[31.2458781,121.4862094],[31.2457169,121.4861875],[31.2456921,121.48624],[31.2456944,121.486326],[31.245668,121.4864859],[31.245645,121.4864859],[31.2456314,121.4866266],[31.2458455,121.4866433],[31.2458781,121.4862094]],region:"northbund"},{name:"\u65B0\u4E9A\u5927\u9152\u5E97",h:25.6,ring:[[31.2473652,121.480706],[31.2474502,121.4808948],[31.2474502,121.4809677],[31.2474218,121.4810041],[31.2471726,121.4810373],[31.2471358,121.4810174],[31.2471018,121.4809644],[31.2467362,121.4800914],[31.2466877,121.4800141],[31.2466735,121.4799638],[31.2466793,121.479906],[31.2467022,121.4798759],[31.2467366,121.4798562],[31.2467869,121.4798341],[31.2471978,121.4808213],[31.2473652,121.480706]],region:"northbund"},{name:"\u745E\u5EB7\u516C\u5BD3",h:16,ring:[[31.2471126,121.4814714],[31.2470056,121.4815127],[31.2469781,121.4814081],[31.2469666,121.4813759],[31.246952,121.4813614],[31.2469245,121.481356],[31.2466356,121.481399],[31.2466104,121.4814097],[31.2465928,121.4814242],[31.246576,121.4814472],[31.2465714,121.4814741],[31.2466066,121.4816468],[31.246524,121.4816763],[31.2464751,121.4814714],[31.2464782,121.4814242],[31.2464888,121.4813695],[31.2465057,121.4813303],[31.2465278,121.4813024],[31.2465668,121.4812809],[31.246602,121.4812659],[31.2469529,121.4812257],[31.2469887,121.481238],[31.2470377,121.4812766],[31.2470621,121.4813078],[31.2470805,121.4813373],[31.2471126,121.4814714]],region:"northbund"},{name:"\u56FD\u9645\u6E2F\u52A1\u5927\u53A6",h:70.4,ring:[[31.2484608,121.4911041],[31.2485109,121.4911072],[31.2485384,121.4911179],[31.248559,121.4911367],[31.248569,121.4911588],[31.2485685,121.491178],[31.2485682,121.4911876],[31.2485636,121.4912601],[31.2485499,121.4913405],[31.2485109,121.491472],[31.2484621,121.4915542],[31.2484536,121.4915685],[31.2484306,121.4915819],[31.2484131,121.491588],[31.2483925,121.4915772],[31.2483649,121.4915585],[31.2483076,121.4915048],[31.2482296,121.4914136],[31.248154,121.4912849],[31.2481402,121.4912527],[31.2481394,121.4912225],[31.2481494,121.491199],[31.2481692,121.4911769],[31.2482059,121.4911528],[31.2483229,121.4911206],[31.2484608,121.4911041]],region:"northbund"},{name:"",h:32,ring:[[31.2428519,121.4843432],[31.2428512,121.4843927],[31.2430617,121.4843969],[31.2430625,121.4843447],[31.2430942,121.4843454],[31.2430954,121.4842646],[31.2430978,121.4841064],[31.2430983,121.4840698],[31.2430989,121.4840295],[31.2430672,121.4840288],[31.2430678,121.4839862],[31.2428573,121.4839819],[31.2428566,121.4840274],[31.2428329,121.4840269],[31.2428319,121.4840953],[31.2428294,121.4842616],[31.2428282,121.4843427],[31.2428519,121.4843432]],region:"northbund"},{name:"",h:41.6,ring:[[31.2436646,121.4847848],[31.2434161,121.4847893],[31.2434152,121.4850713],[31.2434323,121.4850691],[31.2434314,121.4852154],[31.2436515,121.4852177],[31.2436524,121.4850649],[31.2436665,121.4850653],[31.2436646,121.4847848]],region:"northbund"},{name:"",h:32,ring:[[31.2437207,121.4852184],[31.2436515,121.4852177],[31.2434314,121.4852154],[31.2432047,121.485213],[31.2432024,121.485256],[31.2431898,121.485256],[31.2431824,121.4855143],[31.243199,121.4855135],[31.2431982,121.4855517],[31.2433699,121.4855538],[31.2433701,121.4855137],[31.2433828,121.4855133],[31.2433859,121.4854303],[31.2435349,121.4854303],[31.2435349,121.4854974],[31.2437185,121.4854933],[31.2437188,121.4854491],[31.2437323,121.4854488],[31.2437331,121.4852626],[31.2437203,121.4852627],[31.2437207,121.4852184]],region:"northbund"},{name:"\u683C\u6797\u90AE\u8239\u5927\u697C",h:28.8,ring:[[31.2430054,121.4849163],[31.2427419,121.4849198],[31.2427415,121.4852843],[31.2427163,121.4852839],[31.2427162,121.4855821],[31.2427415,121.4855848],[31.2427419,121.4856306],[31.2429043,121.4856304],[31.2429089,121.4851985],[31.2429433,121.4851985],[31.2429437,121.4852337],[31.2430029,121.4852334],[31.2430054,121.4849163]],region:"northbund"},{name:"\u4E1C\u65B9\u6C47\u7406\u94F6\u884C\u5927\u697C",h:19.2,ring:[[31.2431434,121.4849297],[31.243042,121.4849278],[31.2430384,121.4851982],[31.2430625,121.4851986],[31.2430614,121.4852826],[31.2429396,121.4852804],[31.2429349,121.4856298],[31.2431339,121.4856334],[31.2431434,121.4849297]],region:"northbund"},{name:"\u4E0A\u6D77\u5916\u6EE9\u8302\u60A6\u5927\u9152\u5E97",h:12.8,ring:[[31.247799,121.4887708],[31.2476066,121.4890909],[31.2472603,121.4892684],[31.247209,121.4891834],[31.2472218,121.4890459],[31.2473458,121.4888608],[31.2471577,121.4885333],[31.2468691,121.4885433],[31.2467644,121.4884183],[31.2467729,121.4883083],[31.2472817,121.4879508],[31.2475125,121.4880683],[31.247799,121.4887708]],region:"northbund"},{name:"\u5149\u9646\u5927\u697C",h:16,ring:[[31.2454744,121.4832127],[31.2450626,121.4832741],[31.2450431,121.4832768],[31.2450329,121.4831152],[31.2450685,121.4831077],[31.2450585,121.4829929],[31.2451392,121.4829899],[31.2452272,121.4829971],[31.2452955,121.4830184],[31.2453636,121.4830505],[31.2454096,121.483081],[31.2454398,121.4831142],[31.2454653,121.4831596],[31.2454744,121.4832127]],region:"northbund"},{name:"",h:25.6,ring:[[31.2466916,121.4870691],[31.246741,121.4870812],[31.2467766,121.4871148],[31.2467697,121.4871739],[31.2467307,121.4872142],[31.2464182,121.4875099],[31.2463757,121.4875206],[31.2463159,121.4875045],[31.246255,121.4874467],[31.2462022,121.4873459],[31.2461769,121.4872237],[31.2461884,121.4871121],[31.2462114,121.4870503],[31.2462367,121.4870248],[31.2462527,121.4870181],[31.2466916,121.4870691]],region:"northbund"},{name:"",h:32,ring:[[31.2450352,121.4821201],[31.2450539,121.4822753],[31.2447659,121.4823229],[31.2447472,121.4821676],[31.2450352,121.4821201]],region:"northbund"},{name:"",h:22.4,ring:[[31.2453704,121.4820593],[31.2453967,121.4822531],[31.2451322,121.4823021],[31.2451059,121.4821083],[31.2453704,121.4820593]],region:"northbund"},{name:"\u4F73\u5229\u5546\u52A1\u697C",h:32,ring:[[31.2449772,121.4815786],[31.2450327,121.4820797],[31.2449042,121.4820974],[31.2448736,121.481852],[31.2449396,121.4818367],[31.2449325,121.4817761],[31.2448537,121.481788],[31.244833,121.4816309],[31.2449772,121.4815786]],region:"northbund"},{name:"\u534E\u5FB7\u5927\u697C",h:22.4,ring:[[31.2446847,121.4816927],[31.2447305,121.482076],[31.2447517,121.4820929],[31.2448529,121.4820763],[31.2448024,121.4816528],[31.2447357,121.4816637],[31.2447382,121.4816839],[31.2446847,121.4816927]],region:"northbund"},{name:"\u6D66\u6C5F\u996D\u5E97",h:22.4,ring:[[31.2465589,121.486555],[31.2465254,121.4867732],[31.2460141,121.4866658],[31.2461056,121.4860697],[31.24626,121.4861022],[31.246202,121.48648],[31.2465589,121.486555]],region:"northbund"},{name:"",h:38.4,ring:[[31.2442705,121.4796821],[31.2442437,121.4797187],[31.244207,121.4796819],[31.2441623,121.4797427],[31.2442109,121.4797914],[31.2441991,121.4798074],[31.244455,121.4800645],[31.2445375,121.4799494],[31.2442705,121.4796821]],region:"northbund"},{name:"",h:25.6,ring:[[31.2453575,121.4820193],[31.2453024,121.4816169],[31.2452855,121.4815568],[31.2452696,121.4815272],[31.2452453,121.4815065],[31.2452154,121.4814944],[31.2451864,121.4814999],[31.2449945,121.4815718],[31.2450527,121.4820798],[31.2453575,121.4820193]],region:"northbund"},{name:"",h:19.2,ring:[[31.2446911,121.4824344],[31.244523,121.482464],[31.2445669,121.4828487],[31.2447418,121.4828536],[31.2446911,121.4824344]],region:"northbund"},{name:"\u6C38\u5174\u5927\u697C",h:19.2,ring:[[31.2444833,121.4824835],[31.2443217,121.4825116],[31.2443297,121.4825877],[31.244353,121.4828074],[31.2443573,121.4828483],[31.2445253,121.4828526],[31.2444833,121.4824835]],region:"northbund"},{name:"\u76DB\u90A6\u56FD\u9645\u5927\u53A6",h:80,ring:[[31.2536822,121.4800083],[31.2537288,121.4804464],[31.2530697,121.4805586],[31.253023,121.4801312],[31.2536822,121.4800083]],region:"northbund"},{name:"\u5B89\u57F9\u6D0B\u884C\u5927\u697C",h:9.6,ring:[[31.2432188,121.4835176],[31.2432411,121.4837319],[31.2430065,121.483769],[31.2429741,121.4837652],[31.2429549,121.4837461],[31.2429359,121.4835673],[31.2432188,121.4835176]],region:"northbund"},{name:"\u4E2D\u4E00\u5927\u697C",h:16,ring:[[31.2429752,121.4802068],[31.2430024,121.4803853],[31.2425867,121.4804911],[31.2425763,121.480268],[31.2429752,121.4802068]],region:"northbund"},{name:"\u4E0A\u6D77\u5916\u6EE9 W \u9152\u5E97",h:172,ring:[[31.2511448,121.4921154],[31.251121,121.4921643],[31.2510926,121.4921889],[31.2510856,121.492195],[31.2510033,121.4922213],[31.2509698,121.492219],[31.2509209,121.4922157],[31.2508502,121.4921708],[31.2507797,121.4920877],[31.2507401,121.4920096],[31.2507319,121.4919287],[31.2507365,121.4918595],[31.2507595,121.4917946],[31.2507964,121.4917599],[31.250837,121.4917466],[31.2508987,121.4918676],[31.250975,121.4919716],[31.2510521,121.4920299],[31.2511486,121.4920598],[31.2511448,121.4921154]],region:"northbund"},{name:"\u91D1\u5149\u4E2D\u5FC3 (\u5199\u5B57\u697C)",h:320,ring:[[31.2509055,121.4937595],[31.2510548,121.4937964],[31.2512048,121.4938335],[31.2515118,121.4939617],[31.2515644,121.4937244],[31.2516131,121.4936017],[31.2516483,121.4935128],[31.2515839,121.4934915],[31.2513109,121.4934012],[31.2512161,121.493357],[31.2510288,121.4932697],[31.2509845,121.4935336],[31.2509055,121.4937595]],region:"northbund"},{name:"",h:32,ring:[[31.2458438,121.4871373],[31.2458375,121.4875366],[31.2456853,121.4875333],[31.2456916,121.487134],[31.2458438,121.4871373]],region:"northbund"},{name:"\u5170\u5FC3\u5927\u697C",h:22.4,ring:[[31.2448049,121.483468],[31.244533,121.4835023],[31.24452,121.4833684],[31.2447932,121.4833317],[31.2448049,121.483468]],region:"northbund"},{name:"\u771F\u5149\u5927\u697C",h:28.8,ring:[[31.2448567,121.4832337],[31.2449693,121.483216],[31.2449762,121.483317],[31.2450673,121.4833197],[31.2450761,121.4834046],[31.2450787,121.483442],[31.2448698,121.4834633],[31.2448567,121.4832337]],region:"northbund"},{name:"",h:16,ring:[[31.2431485,121.4823123],[31.2433211,121.4823132],[31.2433194,121.4827959],[31.2431468,121.4827951],[31.2431485,121.4823123]],region:"northbund"},{name:"\u7231\u5EFA\u516C\u53F8",h:25.6,ring:[[31.2446786,121.4824302],[31.244368,121.4824835],[31.2443395,121.4822561],[31.2446501,121.4822028],[31.2446786,121.4824302]],region:"northbund"},{name:"",h:16,ring:[[31.2447723,121.4823475],[31.2450623,121.482304],[31.2450847,121.4824834],[31.2449996,121.4824958],[31.2449957,121.482469],[31.2447893,121.4824975],[31.2447723,121.4823475]],region:"northbund"},{name:"\u4E9A\u6D32\u6587\u4F1A\u5927\u697C",h:19.2,ring:[[31.2432308,121.4829615],[31.2432614,121.4833064],[31.2431489,121.4833201],[31.2431182,121.4829752],[31.2432308,121.4829615]],region:"northbund"},{name:"\u5706\u660E\u56ED\u516C\u5BD3",h:19.2,ring:[[31.2435419,121.4836351],[31.243501,121.4836929],[31.2432411,121.4837319],[31.2432188,121.4835176],[31.2432162,121.4834923],[31.2435198,121.4834471],[31.2435419,121.4836351]],region:"northbund"},{name:"",h:25.6,ring:[[31.2443915,121.481764],[31.2444045,121.481861],[31.2444125,121.4819194],[31.2441482,121.4820233],[31.2441401,121.4819908],[31.2441053,121.4818667],[31.2443915,121.481764]],region:"northbund"},{name:"\u4E2D\u5B9E\u5927\u697C",h:22.4,ring:[[31.2427308,121.4830428],[31.2427291,121.4833359],[31.2428949,121.4833356],[31.2430681,121.4833326],[31.2430264,121.4829712],[31.2427765,121.482991],[31.2427544,121.4830024],[31.2427409,121.4830203],[31.2427308,121.4830428]],region:"northbund"},{name:"\u864E\u4E18\u516C\u5BD3",h:19.2,ring:[[31.2447913,121.4825182],[31.2449009,121.4825021],[31.2449203,121.4826828],[31.244996,121.4826717],[31.2449799,121.4825222],[31.2450202,121.4825163],[31.2450227,121.4825398],[31.2450915,121.4825297],[31.2451209,121.4828044],[31.2451016,121.4828322],[31.2450375,121.4828398],[31.2450148,121.4828189],[31.2450126,121.4827988],[31.244937,121.4828101],[31.2449217,121.482847],[31.2448479,121.4828568],[31.2448244,121.482826],[31.2447913,121.4825182]],region:"northbund"},{name:"",h:32,ring:[[31.2454744,121.4832127],[31.2453914,121.4834631],[31.2453587,121.4835156],[31.2453204,121.4835397],[31.2452904,121.4835353],[31.2451476,121.4834852],[31.2451264,121.4834584],[31.2451207,121.4834282],[31.2451237,121.4834029],[31.2450761,121.4834046],[31.2450673,121.4833197],[31.2450626,121.4832741],[31.2454744,121.4832127]],region:"northbund"},{name:"\u4F4F\u5B85",h:6.4,ring:[[31.2442143,121.4803718],[31.2440493,121.4804272],[31.2439727,121.4801149],[31.2441376,121.4800596],[31.2442143,121.4803718]],region:"northbund"},{name:"",h:19.2,ring:[[31.2437999,121.48047],[31.2437289,121.4801824],[31.2439055,121.4801227],[31.2439766,121.4804103],[31.2437999,121.48047]],region:"northbund"},{name:"",h:25.6,ring:[[31.2430451,121.4804266],[31.2433209,121.4803408],[31.2433671,121.4805442],[31.2433293,121.4805981],[31.2433515,121.4806956],[31.2431225,121.4807669],[31.2430451,121.4804266]],region:"northbund"},{name:"",h:22.4,ring:[[31.2436821,121.4802148],[31.2436163,121.4802345],[31.2436663,121.4804644],[31.2435697,121.4804932],[31.2435201,121.4802651],[31.2433803,121.4803068],[31.2434431,121.4805949],[31.2437453,121.4805048],[31.2436821,121.4802148]],region:"northbund"},{name:"",h:19.2,ring:[[31.2447325,121.4805305],[31.2448193,121.4807548],[31.2447812,121.4807759],[31.2447914,121.4808066],[31.2446581,121.4808575],[31.2445622,121.4806389],[31.2447325,121.4805305]],region:"northbund"},{name:"",h:57.6,ring:[[31.2450945,121.480946],[31.2451563,121.481238],[31.2449373,121.4813113],[31.2448689,121.4810415],[31.2450945,121.480946]],region:"northbund"},{name:"",h:19.2,ring:[[31.2448707,121.4807739],[31.244851,121.4807373],[31.2448193,121.4807548],[31.2447812,121.4807759],[31.2447914,121.4808066],[31.2447988,121.4808292],[31.2446566,121.480897],[31.2447473,121.4810863],[31.2448433,121.4810533],[31.2448689,121.4810415],[31.2450945,121.480946],[31.2451181,121.4809361],[31.2450192,121.4806996],[31.2448707,121.4807739]],region:"northbund"},{name:"\u81EA\u6765\u5927\u697C",h:16,ring:[[31.2443109,121.4805605],[31.2442888,121.4804734],[31.2443064,121.4804185],[31.2446331,121.4803051],[31.2446407,121.4803354],[31.2446735,121.4804643],[31.2446904,121.4805312],[31.2445419,121.4805827],[31.244518,121.4804885],[31.2443109,121.4805605]],region:"northbund"},{name:"",h:25.6,ring:[[31.2447549,121.4803269],[31.2447032,121.4803123],[31.2446407,121.4803354],[31.2446735,121.4804643],[31.244713,121.4804499],[31.2447504,121.4804672],[31.2448553,121.4807061],[31.2449377,121.4806551],[31.2449427,121.4806497],[31.2449457,121.4806426],[31.2449457,121.4806357],[31.2449432,121.4806276],[31.2448374,121.480404],[31.2448034,121.480361],[31.2447549,121.4803269]],region:"northbund"},{name:"",h:25.6,ring:[[31.2445744,121.4815151],[31.2445598,121.4815495],[31.2441472,121.4816918],[31.2440995,121.4815022],[31.2445335,121.4813526],[31.2445744,121.4815151]],region:"northbund"},{name:"",h:38.4,ring:[[31.243905,121.4811122],[31.2439859,121.4814499],[31.2437176,121.4815075],[31.2437105,121.4814335],[31.2436963,121.4814098],[31.243657,121.4811651],[31.243905,121.4811122]],region:"northbund"},{name:"",h:38.4,ring:[[31.2445313,121.4813069],[31.244142,121.4814696],[31.244053,121.4810599],[31.2442061,121.4810045],[31.2442174,121.481045],[31.2444076,121.480967],[31.2445024,121.4812128],[31.2445313,121.4813069]],region:"northbund"},{name:"",h:25.6,ring:[[31.2505951,121.4877539],[31.2507648,121.4877486],[31.2507764,121.4882647],[31.2506068,121.48827],[31.2505951,121.4877539]],region:"northbund"},{name:"\u626C\u5B50\u6C5F\u5927\u53A6",h:64,ring:[[31.2505942,121.4893417],[31.2507342,121.4892675],[31.2508787,121.4896404],[31.2507387,121.4897146],[31.2505942,121.4893417]],region:"northbund"},{name:"\u626C\u5B50\u6C5F\u5927\u53A6",h:48,ring:[[31.2507524,121.4897333],[31.250856,121.489678],[31.2509294,121.4898657],[31.2508258,121.4899211],[31.2507524,121.4897333]],region:"northbund"},{name:"\u4E2D\u56FD\u8054\u901A(\u4E0A\u6D77\u5206\u516C\u53F8\u5317\u5916\u6EE9\u5C40)",h:60,ring:[[31.2510849,121.4888522],[31.2512814,121.488774],[31.2514267,121.4892675],[31.2512294,121.4893484],[31.2510849,121.4888522]],region:"northbund"},{name:"COSCO SHIPPING Lines Headquarters",h:96,ring:[[31.2490969,121.4919173],[31.2488091,121.4920729],[31.2486914,121.4917751],[31.2489792,121.4916196],[31.2490969,121.4919173]],region:"northbund"},{name:"\u94F6\u6CE2\u5927\u53A6",h:32,ring:[[31.247283,121.4855446],[31.2473014,121.485256],[31.2474895,121.4852767],[31.2475262,121.4852836],[31.2475628,121.4853028],[31.2475838,121.4853412],[31.2475909,121.4853837],[31.2475818,121.4855666],[31.247283,121.4855446]],region:"northbund"},{name:"",h:48,ring:[[31.2495406,121.4912729],[31.2494534,121.4913105],[31.2493858,121.4915572],[31.2495234,121.4916176],[31.2495933,121.4915975],[31.2496403,121.4915398],[31.2496988,121.491352],[31.2495406,121.4912729]],region:"northbund"},{name:"",h:76.8,ring:[[31.2490973,121.4840534],[31.2491997,121.4839747],[31.2492649,121.4840908],[31.2493465,121.484028],[31.2494459,121.484205],[31.2493598,121.4842713],[31.2493051,121.4841741],[31.2492073,121.4842492],[31.2490973,121.4840534]],region:"northbund"},{name:"",h:76.8,ring:[[31.2492868,121.4832083],[31.2493301,121.4835793],[31.2492294,121.4835954],[31.2492174,121.483492],[31.2491804,121.4834979],[31.2491603,121.4833261],[31.2491975,121.4833202],[31.2491863,121.4832243],[31.2492868,121.4832083]],region:"northbund"},{name:"",h:19.2,ring:[[31.2487939,121.4845714],[31.2489006,121.4845922],[31.2488467,121.4849704],[31.24874,121.4849496],[31.2487939,121.4845714]],region:"northbund"},{name:"\u8036\u677E\u8239\u5382\u65E7\u5740",h:16,ring:[[31.2494775,121.4926603],[31.2491749,121.49285],[31.2490556,121.4925898],[31.2493582,121.4924001],[31.2494775,121.4926603]],region:"northbund"},{name:"",h:32,ring:[[31.2489604,121.492026],[31.2490862,121.4919464],[31.249194,121.4921798],[31.2490682,121.4922593],[31.2489604,121.492026]],region:"northbund"},{name:"",h:25.6,ring:[[31.2471742,121.4852654],[31.2471229,121.4858754],[31.2470181,121.4858642],[31.2470648,121.4852541],[31.2470923,121.4852576],[31.2471077,121.4852385],[31.2471369,121.4852429],[31.2471499,121.4852635],[31.2471742,121.4852654]],region:"northbund"},{name:"\u5927\u6865\u5927\u697C",h:22.4,ring:[[31.2480108,121.4803397],[31.2480887,121.4807769],[31.2481013,121.4808151],[31.2481277,121.4808426],[31.2481563,121.4808553],[31.2481827,121.4808574],[31.2485061,121.4808037],[31.2484866,121.4806549],[31.2482034,121.4807031],[31.2481449,121.4803142],[31.2480108,121.4803397]],region:"northbund"},{name:"",h:38.4,ring:[[31.2439556,121.4833603],[31.2438355,121.4833748],[31.2438224,121.4832515],[31.2437976,121.4830185],[31.2439171,121.4830203],[31.2439556,121.4833603]],region:"northbund"},{name:"",h:38.4,ring:[[31.2447138,121.4832996],[31.2445807,121.4833175],[31.2445759,121.4832689],[31.2445539,121.4830449],[31.244687,121.483027],[31.2447138,121.4832996]],region:"northbund"},{name:"",h:38.4,ring:[[31.2443403,121.4833048],[31.2442089,121.4833239],[31.2441968,121.4832],[31.2441814,121.4830269],[31.2442723,121.4830291],[31.2443166,121.4830302],[31.2443403,121.4833048]],region:"northbund"},{name:"\u4E0A\u6D77\u5927\u53A6",h:60.8,ring:[[31.2462235,121.4851898],[31.2461402,121.4857462],[31.2461956,121.4858476],[31.2463271,121.4858731],[31.2464131,121.4858088],[31.2464716,121.4854451],[31.2465042,121.4852421],[31.2464395,121.4851377],[31.2463193,121.4851087],[31.2462235,121.4851898]],region:"northbund"},{name:"\u5E7F\u5B66\u5927\u697C",h:25.6,ring:[[31.2449638,121.4831306],[31.2450219,121.4831211],[31.2450198,121.4830841],[31.2450431,121.4830811],[31.2450396,121.4830318],[31.2450169,121.483034],[31.2450141,121.4829839],[31.2448372,121.4829894],[31.2448567,121.4832337],[31.2449693,121.483216],[31.2449638,121.4831306]],region:"northbund"},{name:"\u6D66\u897F\u516C\u5BD3",h:28.8,ring:[[31.2497137,121.4824457],[31.2497747,121.4828447],[31.2501488,121.4827701],[31.250197,121.4827138],[31.2502251,121.482663],[31.2502016,121.4823624],[31.2497137,121.4824457]],region:"northbund"},{name:"\u5C0F\u6D66\u897F\u516C\u5BD3",h:28.8,ring:[[31.2501489,121.4832286],[31.2500569,121.4832196],[31.2500735,121.4830124],[31.2500512,121.4830091],[31.2500569,121.4829111],[31.250089,121.4829057],[31.250134,121.4829115],[31.2501632,121.4829413],[31.2501715,121.4829935],[31.2501489,121.4832286]],region:"northbund"},{name:"\u666F\u6797\u5E90",h:19.2,ring:[[31.2513774,121.4830511],[31.2512239,121.4830763],[31.2511768,121.4826837],[31.2513304,121.4826585],[31.2513774,121.4830511]],region:"northbund"},{name:"\u4E0A\u6D77\u5E02\u5B89\u88C5\u5DE5\u7A0B\u6709\u9650\u516C\u53F8",h:3.2,ring:[[31.2505896,121.4829489],[31.2504506,121.4833599],[31.2506402,121.4834477],[31.2507967,121.4829849],[31.2506696,121.4829261],[31.2506521,121.4829779],[31.2505896,121.4829489]],region:"northbund"},{name:"\u95F5\u884C\u5927\u697C",h:16,ring:[[31.2489084,121.486884],[31.2487111,121.4871442],[31.2486171,121.4872482],[31.2485457,121.4872439],[31.2485897,121.4871819],[31.2486035,121.4871918],[31.2486318,121.4871452],[31.2486473,121.4871275],[31.2485506,121.4870551],[31.2487111,121.486744],[31.2489084,121.486884]],region:"northbund"},{name:"\u95F5\u884C\u5927\u697C",h:22.4,ring:[[31.2488103,121.4865802],[31.2489089,121.4866324],[31.2488694,121.4867304],[31.2487689,121.4866587],[31.2487111,121.486744],[31.2489084,121.486884],[31.2490555,121.4866292],[31.2490579,121.4865534],[31.2490138,121.4865059],[31.2488628,121.4864382],[31.2488103,121.4865802]],region:"northbund"},{name:"\u6D66\u5149\u5927\u697C",h:22.4,ring:[[31.2437073,121.4815112],[31.2437176,121.4815075],[31.2439859,121.4814499],[31.2440447,121.4816931],[31.2437245,121.4818105],[31.243716,121.4816598],[31.2437359,121.4816452],[31.2437073,121.4815112]],region:"northbund"},{name:"\u81EA\u529B\u5927\u697C",h:16,ring:[[31.2440508,121.4805194],[31.2438098,121.4806081],[31.2438471,121.4807651],[31.2440685,121.4806897],[31.2440911,121.4806797],[31.2440508,121.4805194]],region:"northbund"},{name:"\u6052\u4E30\u5927\u697C",h:19.2,ring:[[31.2438098,121.4806081],[31.243507,121.4807191],[31.2435587,121.4811203],[31.2439036,121.4810132],[31.2438471,121.4807651],[31.2438098,121.4806081]],region:"northbund"},{name:"\u6D59\u5174\u5927\u697C",h:19.2,ring:[[31.2429427,121.4809819],[31.2426615,121.4810887],[31.2426431,121.4811406],[31.2426914,121.4817205],[31.2429454,121.4816282],[31.2428936,121.4814512],[31.2430505,121.4813871],[31.2429427,121.4809819]],region:"northbund"},{name:"\u5229\u901A\u5E7F\u573A",h:9.6,ring:[[31.2550741,121.4798416],[31.2548923,121.4797153],[31.2545499,121.4798231],[31.2543498,121.4799987],[31.2543682,121.4801805],[31.2549569,121.4809157],[31.2554586,121.480504],[31.2555008,121.480427],[31.2550741,121.4798416]],region:"northbund"},{name:"",h:12.8,ring:[[31.2507401,121.4920096],[31.2507222,121.4920866],[31.2506849,121.4921344],[31.2507666,121.4921627],[31.2508331,121.4922087],[31.2508696,121.4922511],[31.2508937,121.4922972],[31.2509213,121.4922594],[31.2509698,121.492219],[31.2509209,121.4922157],[31.2508502,121.4921708],[31.2507797,121.4920877],[31.2507401,121.4920096]],region:"northbund"},{name:"",h:24,ring:[[31.2442908,121.4869603],[31.2442788,121.4869499],[31.2442892,121.4869293],[31.2443177,121.4868729],[31.2443436,121.4868949],[31.244305,121.4869428],[31.2442908,121.4869603]],region:"northbund"},{name:"",h:24,ring:[[31.2442777,121.4869704],[31.2442912,121.4869627],[31.2443021,121.486983],[31.2443319,121.4870383],[31.2443033,121.4870552],[31.2442846,121.4869932],[31.2442777,121.4869704]],region:"northbund"},{name:"",h:24,ring:[[31.2442766,121.4869517],[31.2442761,121.4869692],[31.2442557,121.4869709],[31.2441999,121.4869757],[31.2442006,121.4869383],[31.2442562,121.4869481],[31.2442766,121.4869517]],region:"northbund"},{name:"",h:57.6,ring:[[31.250275,121.4947732],[31.2502646,121.4948241],[31.2502796,121.4949153],[31.2503564,121.495197],[31.2503919,121.4952734],[31.2504206,121.4953163],[31.2504561,121.4953418],[31.2505008,121.4953485],[31.250541,121.4953351],[31.250565,121.4953002],[31.2505788,121.4952573],[31.2505754,121.4951862],[31.2504756,121.4948255],[31.2504481,121.4947692],[31.2504183,121.4947329],[31.2503862,121.4947169],[31.2503529,121.4947155],[31.2503266,121.4947209],[31.2502933,121.494745],[31.250275,121.4947732]],region:"northbund"},{name:"",h:25.6,ring:[[31.250275,121.4958836],[31.2504905,121.495948],[31.2505364,121.4960177],[31.2505891,121.4961331],[31.2505799,121.4961733],[31.2502681,121.4963691],[31.250236,121.4963718],[31.2502016,121.4963476],[31.2500617,121.4960848],[31.250064,121.4960499],[31.2500846,121.4960258],[31.250275,121.4958836]],region:"northbund"},{name:"",h:56,ring:[[31.2554764,121.4925064],[31.2554557,121.4928497],[31.2553801,121.4928417],[31.2553824,121.4928175],[31.2552895,121.4928081],[31.2552895,121.4927572],[31.2552173,121.4927531],[31.2552287,121.4925533],[31.2552884,121.4925573],[31.2552918,121.4925198],[31.2553915,121.4925278],[31.2553915,121.4924983],[31.2554764,121.4925064]],region:"northbund"},{name:"",h:80,ring:[[31.2561188,121.4873972],[31.2561073,121.4878049],[31.2560867,121.487829],[31.2557519,121.4878156],[31.2557359,121.4877539],[31.2560248,121.4873891],[31.2561188,121.4873972]],region:"northbund"},{name:"",h:9.6,ring:[[31.2561233,121.4878772],[31.2559745,121.4878726],[31.2559679,121.4881746],[31.2561246,121.4881884],[31.2561233,121.4878772]],region:"northbund"},{name:"Shanghai Consruction Engineering",h:20,ring:[[31.251431,121.4896012],[31.2513315,121.4896462],[31.2512783,121.4895126],[31.2513002,121.4895007],[31.2512704,121.4894244],[31.2515185,121.4893013],[31.2515645,121.4894261],[31.2513994,121.4895113],[31.251431,121.4896012]],region:"northbund"},{name:"",h:20,ring:[[31.2511762,121.4897189],[31.2510527,121.4897733],[31.2509487,121.4894255],[31.251069,121.4893774],[31.2511762,121.4897189]],region:"northbund"},{name:"",h:10,ring:[[31.251066,121.4893734],[31.2509457,121.4894194],[31.250804,121.488938],[31.2509243,121.4888912],[31.251066,121.4893734]],region:"northbund"},{name:"",h:35,ring:[[31.2525703,121.4915889],[31.2526917,121.491529],[31.252643,121.4913954],[31.2525223,121.4914608],[31.2525703,121.4915889]],region:"northbund"},{name:"\u5B87\u6CF0\u516C\u5BD3",h:50,ring:[[31.2525175,121.4914491],[31.252639,121.4913893],[31.2525128,121.4910248],[31.2523889,121.4910855],[31.2525175,121.4914491]],region:"northbund"},{name:"\u5B87\u6CF0\u516C\u5BD3",h:50,ring:[[31.2523206,121.4911187],[31.252442,121.4910589],[31.2523158,121.4906943],[31.2521919,121.4907551],[31.2523017,121.4910652],[31.2523206,121.4911187]],region:"northbund"},{name:"\u4E0A\u6D77\u5B87\u6CF0\u623F\u5730\u4EA7\u6709\u9650\u516C\u53F8",h:16,ring:[[31.252027,121.4909555],[31.2521485,121.4908957],[31.2520997,121.490762],[31.2519791,121.4908275],[31.252027,121.4909555]],region:"northbund"},{name:"\u5B87\u6CF0\u516C\u5BD3",h:56,ring:[[31.2528996,121.4913023],[31.253021,121.4912376],[31.252811,121.4907173],[31.2526885,121.4907861],[31.2528996,121.4913023]],region:"northbund"},{name:"",h:124,ring:[[31.2520257,121.4895762],[31.2520431,121.4896117],[31.2520495,121.4896519],[31.2520444,121.4896923],[31.2520282,121.4897285],[31.2520034,121.4897561],[31.2519722,121.4897728],[31.2519382,121.489777],[31.2519048,121.4897682],[31.2518756,121.4897472],[31.2518537,121.4897164],[31.2518414,121.489679],[31.2518401,121.489639],[31.2518498,121.4896006],[31.25187,121.4895673],[31.2518985,121.4895436],[31.251932,121.4895321],[31.2519669,121.4895341],[31.2519994,121.4895493],[31.2520257,121.4895762]],region:"northbund"},{name:"",h:124,ring:[[31.2525863,121.4895692],[31.2525375,121.4896241],[31.2524786,121.4896193],[31.2524571,121.4896099],[31.2524322,121.4895793],[31.2524131,121.4895177],[31.2524083,121.4894416],[31.2524217,121.4893946],[31.2524782,121.4893755],[31.2525423,121.4893744],[31.2525873,121.4894192],[31.2525978,121.4895021],[31.2525863,121.4895692]],region:"northbund"},{name:"\u5EFA\u5510\u5927\u697C",h:6.4,ring:[[31.254078,121.4931688],[31.2542123,121.4935671],[31.2542691,121.4935412],[31.2542974,121.493606],[31.254519,121.4934846],[31.2544754,121.4933688],[31.2543033,121.4934515],[31.2541819,121.4931206],[31.254078,121.4931688]],region:"northbund"},{name:"",h:56,ring:[[31.2558308,121.4921407],[31.2557953,121.4925146],[31.2557318,121.4925087],[31.2557344,121.492479],[31.2556431,121.4924642],[31.2556507,121.4924256],[31.2555923,121.4924197],[31.2555974,121.4923692],[31.2555771,121.4923633],[31.2555847,121.4922476],[31.2556126,121.4922505],[31.2556152,121.4921912],[31.255671,121.4922001],[31.255676,121.4921496],[31.2557521,121.4921674],[31.2557572,121.4921289],[31.2558308,121.4921407]],region:"northbund"},{name:"",h:18,ring:[[31.2555618,121.49156],[31.2557347,121.4917778],[31.2556083,121.4919127],[31.2554487,121.4916845],[31.2555618,121.49156]],region:"northbund"},{name:"",h:18,ring:[[31.2557908,121.491758],[31.2555981,121.4919429],[31.2556574,121.4920258],[31.2558468,121.4918331],[31.2557908,121.491758]],region:"northbund"},{name:"",h:6,ring:[[31.2547063,121.4914279],[31.254755,121.4915172],[31.2546852,121.4915703],[31.2546381,121.4914849],[31.2547063,121.4914279]],region:"northbund"},{name:"",h:6,ring:[[31.2545823,121.4915403],[31.2546593,121.4916811],[31.2545903,121.4917337],[31.2545149,121.4915929],[31.2545823,121.4915403]],region:"northbund"},{name:"",h:3,ring:[[31.2547611,121.4915363],[31.2548009,121.4916214],[31.2547259,121.491672],[31.2546895,121.4915922],[31.2547611,121.4915363]],region:"northbund"},{name:"",h:3,ring:[[31.2552143,121.4918305],[31.2551362,121.4919114],[31.2551092,121.4918657],[31.2551888,121.4917901],[31.2552143,121.4918305]],region:"northbund"},{name:"Longmen Building",h:16,ring:[[31.2559643,121.4918028],[31.256042,121.4919152],[31.255841,121.4921052],[31.2557633,121.4919928],[31.2559643,121.4918028]],region:"northbund"},{name:"",h:21,ring:[[31.2541557,121.4922506],[31.2542978,121.4925292],[31.2543189,121.4925145],[31.2543469,121.4925695],[31.254395,121.4925359],[31.2545261,121.4927928],[31.2544141,121.492871],[31.2543169,121.4926805],[31.2542766,121.4927086],[31.2542485,121.4926537],[31.2542271,121.4926687],[31.2541846,121.4925853],[31.254173,121.4925934],[31.2540395,121.4923318],[31.2541557,121.4922506]],region:"northbund"},{name:"",h:48,ring:[[31.253233,121.4892206],[31.2530453,121.4892673],[31.2531132,121.4897157],[31.2533048,121.4896596],[31.253233,121.4892206]],region:"northbund"},{name:"",h:48,ring:[[31.2532968,121.4898086],[31.2531211,121.4898553],[31.253197,121.490341],[31.2533727,121.4902802],[31.2532968,121.4898086]],region:"northbund"},{name:"",h:48,ring:[[31.2534034,121.4905269],[31.2532317,121.4905783],[31.2533521,121.4910492],[31.2535192,121.4909799],[31.2534034,121.4905269]],region:"northbund"},{name:"",h:48,ring:[[31.2535962,121.4911269],[31.2534206,121.4912203],[31.2535803,121.4916359],[31.2537399,121.4915332],[31.2535962,121.4911269]],region:"northbund"},{name:"",h:93,ring:[[31.2536076,121.4891771],[31.2534926,121.4892302],[31.2536833,121.4898673],[31.2538527,121.4897575],[31.2538315,121.4896938],[31.2538739,121.4896691],[31.2538527,121.4896231],[31.2538164,121.4896443],[31.2537649,121.4895381],[31.2537982,121.4895204],[31.2537589,121.4894142],[31.2537196,121.489439],[31.2536863,121.4893435],[31.2537105,121.4893364],[31.2536802,121.4892337],[31.2536469,121.4892621],[31.2536076,121.4891771]],region:"northbund"},{name:"",h:93,ring:[[31.2539157,121.4900205],[31.2537498,121.490076],[31.2538894,121.4905412],[31.2540079,121.4904827],[31.2539974,121.4904334],[31.2540421,121.4904088],[31.2540132,121.4903132],[31.2539816,121.4903163],[31.2539473,121.4901808],[31.2539895,121.4901684],[31.2539769,121.4900968],[31.253971,121.4900637],[31.2539289,121.490076],[31.2539157,121.4900205]],region:"northbund"},{name:"",h:93,ring:[[31.2540546,121.4906159],[31.2539068,121.4906369],[31.2539767,121.4912813],[31.2541204,121.4912556],[31.2541005,121.4911412],[31.2541384,121.4911412],[31.2541244,121.4910805],[31.2540945,121.4910805],[31.2540845,121.4909404],[31.2541244,121.4909428],[31.2541104,121.4908377],[31.2540845,121.49084],[31.2540725,121.4907419],[31.2541085,121.4907373],[31.2541065,121.4906556],[31.2540685,121.4906649],[31.2540546,121.4906159]],region:"northbund"},{name:"",h:18,ring:[[31.2536257,121.4885193],[31.2534881,121.48853],[31.253534,121.4889699],[31.2536853,121.4889485],[31.2536257,121.4885193]],region:"northbund"},{name:"",h:21,ring:[[31.2536076,121.4881913],[31.253404,121.4882146],[31.253432,121.4884855],[31.2536316,121.4884621],[31.2536076,121.4881913]],region:"northbund"},{name:"",h:6,ring:[[31.2535981,121.4881355],[31.2535586,121.4878089],[31.2532609,121.487926],[31.2533215,121.4882279],[31.2535981,121.4881355]],region:"northbund"},{name:"",h:6,ring:[[31.2535322,121.4877688],[31.2534005,121.48747],[31.2531108,121.4874576],[31.2532425,121.4878951],[31.2535322,121.4877688]],region:"northbund"},{name:"",h:6,ring:[[31.2530239,121.487473],[31.2528974,121.4874915],[31.2528,121.4875994],[31.2528474,121.4876548],[31.253037,121.4875562],[31.2530239,121.487473]],region:"northbund"},{name:"",h:6,ring:[[31.2530528,121.487587],[31.2528711,121.4876826],[31.2529106,121.4878058],[31.2530028,121.4877719],[31.2530765,121.4880215],[31.2531793,121.4879691],[31.2530528,121.487587]],region:"northbund"},{name:"",h:6,ring:[[31.2527837,121.4876094],[31.2526704,121.4877572],[31.2527337,121.4878158],[31.2528522,121.4877172],[31.2527837,121.4876094]],region:"northbund"},{name:"",h:6,ring:[[31.2529812,121.4878065],[31.2527969,121.4878928],[31.2529654,121.4881793],[31.2530155,121.4881485],[31.2530023,121.4880746],[31.2530765,121.4880215],[31.2529812,121.4878065]],region:"northbund"},{name:"",h:6,ring:[[31.252868,121.4877449],[31.2527416,121.4878343],[31.2527854,121.4878794],[31.2528907,121.4878117],[31.252868,121.4877449]],region:"northbund"},{name:"",h:6,ring:[[31.2526563,121.4877947],[31.2524166,121.488166],[31.2525984,121.4884787],[31.2529592,121.48828],[31.2528789,121.488072],[31.2527419,121.4878825],[31.2526563,121.4877947]],region:"northbund"},{name:"",h:9,ring:[[31.2531949,121.4881521],[31.253033,121.4882045],[31.2530725,121.4883924],[31.2532226,121.4883447],[31.2531949,121.4881521]],region:"northbund"},{name:"",h:6,ring:[[31.2531808,121.4879943],[31.2530279,121.4880776],[31.253047,121.4881833],[31.2532051,121.4881345],[31.2531808,121.4879943]],region:"northbund"},{name:"",h:6,ring:[[31.2534293,121.4885533],[31.2529914,121.4886509],[31.2530053,121.4887667],[31.253438,121.4886814],[31.2534293,121.4885533]],region:"northbund"},{name:"",h:6,ring:[[31.2534606,121.4887281],[31.2532937,121.4887525],[31.2533094,121.4888684],[31.253478,121.4888379],[31.2534606,121.4887281]],region:"northbund"},{name:"",h:6,ring:[[31.2533389,121.4888968],[31.2534797,121.4888806],[31.2534797,121.4889964],[31.2533441,121.4889964],[31.2533389,121.4888968]],region:"northbund"},{name:"",h:6,ring:[[31.2532555,121.4887464],[31.2530192,121.4887932],[31.2530261,121.4888806],[31.2532694,121.4888419],[31.2532555,121.4887464]],region:"northbund"},{name:"",h:9,ring:[[31.2533163,121.4888887],[31.2530348,121.488905],[31.2530418,121.4890025],[31.2533198,121.4890046],[31.2533163,121.4888887]],region:"northbund"},{name:"",h:6,ring:[[31.2533389,121.4882565],[31.2532364,121.4883114],[31.2532677,121.4885614],[31.2533685,121.488533],[31.2533389,121.4882565]],region:"northbund"},{name:"",h:6,ring:[[31.2532156,121.4883724],[31.253014,121.4884334],[31.2530487,121.4886183],[31.253252,121.4885756],[31.2532156,121.4883724]],region:"northbund"},{name:"",h:9,ring:[[31.253014,121.4885248],[31.2527846,121.4885635],[31.2528037,121.4886651],[31.2530244,121.4886285],[31.253014,121.4885248]],region:"northbund"},{name:"",h:6,ring:[[31.2527255,121.4884476],[31.2525952,121.4885391],[31.2526699,121.4887281],[31.2527811,121.4886468],[31.2527255,121.4884476]],region:"northbund"},{name:"",h:9,ring:[[31.2529705,121.4886671],[31.2527846,121.4886915],[31.2526977,121.4887525],[31.2528593,121.4890229],[31.2530157,121.4890046],[31.2529705,121.4886671]],region:"northbund"},{name:"",h:8,ring:[[31.25375,121.4884254],[31.253887,121.4884193],[31.2539253,121.4888632],[31.2538212,121.4888781],[31.25375,121.4884254]],region:"northbund"},{name:"",h:8,ring:[[31.2536789,121.4877076],[31.2538156,121.4877335],[31.2538158,121.4878616],[31.2538659,121.4883423],[31.2537263,121.4883484],[31.2536789,121.4877076]],region:"northbund"},{name:"",h:8,ring:[[31.2538576,121.4877619],[31.25397,121.4877875],[31.2539936,121.4883318],[31.2539012,121.4883362],[31.2538576,121.4877619]],region:"northbund"},{name:"",h:8,ring:[[31.2539126,121.4884086],[31.2540204,121.4884032],[31.2540388,121.4888592],[31.2539585,121.4888619],[31.2539126,121.4884086]],region:"northbund"},{name:"",h:8,ring:[[31.253996,121.4877914],[31.2541236,121.4878078],[31.2541544,121.4883452],[31.2540346,121.4883488],[31.253996,121.4877914]],region:"northbund"},{name:"",h:8,ring:[[31.2540617,121.4884139],[31.2541695,121.4884032],[31.2541855,121.4888538],[31.2540754,121.4888565],[31.2540617,121.4884139]],region:"northbund"},{name:"",h:8,ring:[[31.2541511,121.4878239],[31.2542956,121.4878641],[31.2543208,121.4883374],[31.2541978,121.4883453],[31.2541511,121.4878239]],region:"northbund"},{name:"",h:8,ring:[[31.2542153,121.4883952],[31.25433,121.4883952],[31.2543437,121.4888458],[31.2542268,121.4888485],[31.2542153,121.4883952]],region:"northbund"},{name:"",h:8,ring:[[31.2543139,121.4878721],[31.254448,121.4879155],[31.254463,121.4883254],[31.2543483,121.4883335],[31.2543139,121.4878721]],region:"northbund"},{name:"",h:8,ring:[[31.2543506,121.4884005],[31.2544698,121.4884005],[31.2544905,121.4888324],[31.2543712,121.4888377],[31.2543506,121.4884005]],region:"northbund"},{name:"",h:8,ring:[[31.2544845,121.4879232],[31.2546051,121.4879527],[31.2546143,121.4883335],[31.2544951,121.4883308],[31.2544845,121.4879232]],region:"northbund"},{name:"",h:8,ring:[[31.2545019,121.4883978],[31.2546074,121.4883952],[31.2546272,121.4888261],[31.2545157,121.4888297],[31.2545019,121.4883978]],region:"northbund"},{name:"",h:8,ring:[[31.2546294,121.4879584],[31.2547512,121.4879889],[31.2547693,121.4883326],[31.2546441,121.4883346],[31.2546294,121.4879584]],region:"northbund"},{name:"",h:8,ring:[[31.2546539,121.4883932],[31.2547697,121.4883956],[31.2547842,121.4888126],[31.2546699,121.4888218],[31.2546539,121.4883932]],region:"northbund"},{name:"",h:18,ring:[[31.2548048,121.4878864],[31.2548188,121.4883137],[31.2549266,121.4882997],[31.2549066,121.4878864],[31.2548048,121.4878864]],region:"northbund"},{name:"",h:16,ring:[[31.2549652,121.4878989],[31.2551128,121.4878879],[31.255136,121.4883134],[31.2549885,121.4883244],[31.2549652,121.4878989]],region:"northbund"},{name:"",h:6,ring:[[31.2536857,121.4876748],[31.2538178,121.4877154],[31.2538456,121.4875874],[31.2538004,121.4875833],[31.2537483,121.4875914],[31.2537153,121.4876077],[31.2536857,121.4876748]],region:"northbund"},{name:"",h:6,ring:[[31.2538664,121.4876016],[31.2538456,121.4877195],[31.2541271,121.4877784],[31.2541514,121.4876809],[31.2538664,121.4876016]],region:"northbund"},{name:"",h:6,ring:[[31.254181,121.4876992],[31.2544582,121.4877876],[31.25444,121.487871],[31.2541566,121.4877988],[31.254181,121.4876992]],region:"northbund"},{name:"",h:6,ring:[[31.2544972,121.4877927],[31.2547492,121.4878536],[31.2547631,121.487937],[31.2544842,121.4878741],[31.2544972,121.4877927]],region:"northbund"},{name:"",h:8,ring:[[31.2538414,121.4889045],[31.2540413,121.4888862],[31.2540465,121.4890081],[31.2538571,121.4890102],[31.2538414,121.4889045]],region:"northbund"},{name:"",h:8,ring:[[31.2540741,121.4888822],[31.2543434,121.4888741],[31.2543417,121.4889818],[31.2540793,121.488992],[31.2540741,121.4888822]],region:"northbund"},{name:"",h:8,ring:[[31.2543678,121.488872],[31.254769,121.4888637],[31.2547735,121.4889511],[31.2543695,121.4889696],[31.2543678,121.488872]],region:"northbund"},{name:"",h:8,ring:[[31.2548178,121.4883801],[31.2549273,121.4883842],[31.254943,121.4888172],[31.2548317,121.4888233],[31.2548178,121.4883801]],region:"northbund"},{name:"",h:8,ring:[[31.2549638,121.4883903],[31.2550768,121.4883842],[31.2551028,121.4887928],[31.2549742,121.4888029],[31.2549638,121.4883903]],region:"northbund"},{name:"",h:8,ring:[[31.2548244,121.4888492],[31.255149,121.4888322],[31.2551525,121.4889526],[31.2548314,121.4889686],[31.2548244,121.4888492]],region:"northbund"},{name:"",h:18,ring:[[31.2549382,121.4891484],[31.2548042,121.4891564],[31.2548108,121.4893083],[31.2548486,121.489306],[31.2548642,121.4896646],[31.2550011,121.4896565],[31.2549853,121.4892918],[31.2549445,121.4892942],[31.2549382,121.4891484]],region:"northbund"},{name:"",h:18,ring:[[31.2547465,121.489118],[31.2546043,121.489118],[31.2546089,121.4892897],[31.2546479,121.4892897],[31.2546525,121.4896625],[31.2548061,121.489633],[31.25479,121.4892736],[31.2547465,121.4892655],[31.2547465,121.489118]],region:"northbund"},{name:"",h:18,ring:[[31.2550154,121.4897181],[31.2548868,121.4897149],[31.2548786,121.4901677],[31.2550073,121.4901709],[31.2550154,121.4897181]],region:"northbund"},{name:"",h:18,ring:[[31.2548061,121.4896813],[31.2546616,121.4896893],[31.2546525,121.4900219],[31.2547969,121.4900246],[31.2548061,121.4896813]],region:"northbund"},{name:"",h:9,ring:[[31.2544682,121.4895368],[31.2543602,121.4895492],[31.2543418,121.4896909],[31.2543866,121.4897001],[31.2544524,121.4897001],[31.2544814,121.489657],[31.2544761,121.4896139],[31.2544682,121.4895368]],region:"northbund"},{name:"",h:9,ring:[[31.2542836,121.4894983],[31.2541637,121.4895023],[31.2540976,121.4895166],[31.2540612,121.489604],[31.2540733,121.4896853],[31.2541011,121.48973],[31.2541533,121.4897198],[31.2541967,121.4896792],[31.2541793,121.4896121],[31.2542123,121.4896121],[31.2542193,121.4896649],[31.2542853,121.4896832],[31.2543114,121.4896263],[31.2543062,121.4895613],[31.2542836,121.4894983]],region:"northbund"},{name:"",h:9,ring:[[31.2544869,121.4897402],[31.2544278,121.4898093],[31.2544295,121.490043],[31.254466,121.4900979],[31.2545234,121.4900999],[31.2545651,121.4900552],[31.2545686,121.4899577],[31.254546,121.4899394],[31.2545529,121.4898682],[31.2545738,121.4898642],[31.2545703,121.4897828],[31.2545303,121.4897463],[31.2544869,121.4897402]],region:"northbund"},{name:"",h:9,ring:[[31.2542454,121.4897788],[31.2542089,121.4897625],[31.254111,121.4898188],[31.2541284,121.4899149],[31.2541585,121.489978],[31.2542158,121.4900247],[31.2543183,121.4900634],[31.2543792,121.4899861],[31.2543687,121.489856],[31.2543114,121.4898459],[31.2542836,121.4898682],[31.2542548,121.489874],[31.2542454,121.4897788]],region:"northbund"},{name:"",h:64,ring:[[31.2543723,121.4950472],[31.2542333,121.4951163],[31.2545635,121.4959294],[31.2546956,121.4958603],[31.2543723,121.4950472]],region:"northbund"},{name:"",h:64,ring:[[31.2538186,121.4954674],[31.253672,121.4955508],[31.253896,121.4960899],[31.2540425,121.4960067],[31.2538186,121.4954674]],region:"northbund"},{name:"",h:64,ring:[[31.2533634,121.4957006],[31.2532152,121.4957696],[31.2534204,121.4963725],[31.2535685,121.4963036],[31.2533634,121.4957006]],region:"northbund"}],named:[]};var K4={pearl:{lat:31.23967,lon:121.49978,rotY:0},jinmao:{lat:31.23745,lon:121.50585,rotY:0},shanghaiTower:{lat:31.23365,lon:121.50777,rotY:0},swfc:{lat:31.23533,lon:121.50655,rotY:0},whiteMagnolia:{lat:31.24865,lon:121.49005,rotY:0},waibaidu:{lat:31.2443,lon:121.486,rotY:Math.PI/2}},j4=/东方明珠|金茂|上海中心|环球金融|白玉兰/,pd={lujiazui:"quant",northbund:"gaming",bund_edge:"media"},Q4={quant:"\u9646\u5BB6\u5634 \xB7 QUANT \u57CE",gaming:"\u5317\u5916\u6EE9 \xB7 GAME \u57CE",media:"\u5916\u6EE9 \xB7 MEDIA \u57CE"},eg=[[31.218,121.489],[31.226,121.4908],[31.231,121.493],[31.234,121.4965],[31.236,121.5],[31.239,121.503],[31.243,121.5018],[31.248,121.502],[31.254,121.5035],[31.26,121.5065],[31.266,121.51],[31.272,121.5145]],zs=230,Nl=118,tg=`
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
}`,ng=`
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
}`,Ec={quant:{floorH:4,winW:2.4,winRate:.5},gaming:{floorH:3.4,winW:3,winRate:.42},media:{floorH:4.4,winW:3.6,winRate:.62}};function md(i){var A,I,N,O,R,U,H,z,V,G,K;let e=new $e,t=[...dd,...fd.buildings],n=new Map;for(let W of t){let oe=(A=pd[W.region])!=null?A:"quant",ue=n.get(oe);ue||(ue={x:0,z:0,n:0,hmax:0},n.set(oe,ue)),ue.n++,ue.hmax=Math.max(ue.hmax,W.h);for(let[Z,k]of W.ring)ue.x+=In(k),ue.z+=Ln(Z)}let s=[];for(let[W,oe]of n)s.push({id:W,name:(I=Q4[W])!=null?I:W,angleDeg:0,cx:oe.x/(oe.n*4),cz:oe.z/(oe.n*4)});let r=new Map,o=new Map,a=0;for(let W of t){if(j4.test(W.name))continue;let oe=(N=pd[W.region])!=null?N:"quant",ue=W.ring.map(([Se,ae])=>new ne(In(ae),-Ln(Se)));if(ue.length<3)continue;let Z=new zn(ue),k;try{k=new ti(Z,{depth:W.h,bevelEnabled:!1})}catch{continue}k.rotateX(-Math.PI/2),k.translate(0,0,0);let re=o.get(oe);re||(re=[],o.set(oe,re)),re.push(k),a++}for(let[W,oe]of o){let ue=ad(oe,!1);if(!ue)continue;for(let re of oe)re.dispose();let Z=new Ct({vertexShader:tg,fragmentShader:ng,uniforms:Sn.merge([Te.fog,{uTint:{value:((O=Bs[W])!=null?O:Xe.data).clone().multiplyScalar(.55)},uWinGain:{value:1},uBreath:{value:0},uBodyGain:{value:1},uFloorH:{value:(U=(R=Ec[W])==null?void 0:R.floorH)!=null?U:3.6},uWinW:{value:(z=(H=Ec[W])==null?void 0:H.winW)!=null?z:2.9},uWinRate:{value:(G=(V=Ec[W])==null?void 0:V.winRate)!=null?G:.45}}]),fog:!0}),k=new se(ue,Z);k.castShadow=!0,k.receiveShadow=!0,k.frustumCulled=!1,e.add(k),r.set(W,Z)}let l=[],c=new Ct({uniforms:Sn.merge([Te.fog,{uTime:{value:0},uDeep:{value:new me(1923710).multiplyScalar(3.4)},uGlow:{value:new me(2078878).multiplyScalar(2.1)}}]),vertexShader:`
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
      }`,transparent:!0,fog:!1}),h=[],d=[],u=[],f=eg.map(([W,oe])=>({x:In(oe),z:Ln(W)}));for(let W=0;W<f.length;W++){let oe=f[W],ue=f[Math.min(W+1,f.length-1)],Z=f[Math.max(W-1,0)],k=ue.x-Z.x,re=ue.z-Z.z,Se=Math.hypot(k,re)||1,ae=-re/Se,Re=k/Se;if(h.push(oe.x+ae*zs,.4,oe.z+Re*zs),h.push(oe.x-ae*zs,.4,oe.z-Re*zs),d.push(W/(f.length-1),0,W/(f.length-1),1),W<f.length-1){let qe=W*2;u.push(qe,qe+1,qe+2,qe+1,qe+3,qe+2)}}let p=new dt;p.setAttribute("position",new Qe(h,3)),p.setAttribute("uv",new Qe(d,2)),p.setIndex(u);let y=new se(p,c);y.renderOrder=1,e.add(y);let _=new Ve({color:Xe.data.clone().multiplyScalar(1.25),blending:Ot,transparent:!0,opacity:.75,depthWrite:!1,fog:!0});_.userData.flowColor=Xe.data.clone();for(let W of[1,-1]){let oe=[];for(let Z=0;Z<f.length;Z++){let k=f[Z],re=f[Math.min(Z+1,f.length-1)],Se=f[Math.max(Z-1,0)],ae=re.x-Se.x,Re=re.z-Se.z,qe=Math.hypot(ae,Re)||1,Ne=-Re/qe,Ge=ae/qe;oe.push(k.x+Ne*(zs-3)*W,1.2,k.z+Ge*(zs-3)*W)}let ue=new dt;ue.setAttribute("position",new Qe(oe,3)),e.add(new Ni(ue,_))}l.push(_);let m=31.2398,v=121.5028,b=new L(In(v),0,Ln(m)),x=new se(new Mt(Nl,Nl+14,9,6),new at({color:726048,roughness:.85,metalness:.25}));x.position.set(b.x,4.5,b.z),x.receiveShadow=!0,e.add(x);let T=new se(new Bt(Nl-3,1.1,8,96),new Ve({color:Xe.brain.clone().multiplyScalar(1.5)}));T.rotation.x=Math.PI/2,T.position.set(b.x,9.4,b.z),e.add(T);let w=[];for(let W of s){let oe=new ne(W.cx,W.cz),ue=new ne(b.x,b.z),Z=ue.clone().sub(oe).normalize(),k=oe.clone().add(Z.clone().multiplyScalar(150)),re=ue.clone().sub(Z.clone().multiplyScalar(Nl+8)),Se=k.distanceTo(re),ae=k.clone().add(re).multiplyScalar(.5),Re=Math.atan2(re.y-k.y,re.x-k.x),qe=new se(new Fe(Se,1.8,26),new at({color:791588,roughness:.9}));qe.position.set(ae.x,7,ae.y),qe.rotation.y=-Re,e.add(qe);let Ne=(K=Bs[W.id])!=null?K:Xe.data,Ge=new Ve({color:Ne.clone()});Ge.userData.flowColor=Ne.clone();for(let et of[-14.5,14.5]){let te=new se(new Fe(Se,.6,1.4),Ge);te.position.set(ae.x,8.6,ae.y+Math.cos(Re)*et*-1),te.rotation.y=-Re,te.position.set(ae.x,8.6,ae.y),e.remove(te),qe.add(te),te.position.set(0,.9,et)}e.add(qe),l.push(Ge),w.push({district:W.id,angleDeg:0,x0:re.x,z0:re.y,x1:k.x,z1:k.y})}let g=[{x:In(121.4873),z:Ln(31.2335),h:150},{x:In(121.486),z:Ln(31.238),h:130},{x:In(121.485),z:Ln(31.242),h:118}],M=[];for(let W=0;W<16;W++){let oe=W/16*Math.PI*2+.2;M.push({x:Math.cos(oe)*1900,z:Math.sin(oe)*1900})}return{root:e,plan:{districts:s,buildings:[],arteries:w,masts:g,ringNodes:M},bodyMats:r,waterMat:c,flowMats:l,buildingCount:a,landmarkSlots:K4,islandPos:b}}function gd(){let i=new $e,e=new se(new Mt(13,15,7,8),new at({color:1187379,roughness:.85,metalness:.15}));e.position.y=3.5,e.castShadow=!0,i.add(e);let t=new se(new Mt(9,11,13,8),new at({color:1451583,roughness:.8,metalness:.2}));t.position.y=13.5,t.castShadow=!0,i.add(t);let n=new Ve({color:Xe.brain.clone().multiplyScalar(1.6)}),s=new se(new Oi(5.2,1),n);s.position.y=26.5,i.add(s);let r=new at({color:1715274,roughness:.7,metalness:.3}),o=[[5.6,4.8,10,32.5],[4.8,4,10,42.5],[4,3.1,10,52.5]];for(let[p,y,_,m]of o){let v=new se(new Mt(y,p,_,8),r);v.position.y=m,v.castShadow=!0,i.add(v)}let a=new Ve({color:Xe.brain.clone().multiplyScalar(1.3)});for(let p of[32.5,42.5,52.5]){let y=new se(new Bt(4.9,.34,8,32),a);y.rotation.x=Math.PI/2,y.position.y=p,i.add(y)}let l=new $e;l.position.y=46;let c=new at({color:2771570,roughness:.35,metalness:.5,emissive:Xe.data,emissiveIntensity:.55});for(let p=0;p<3;p++){let y=new se(new Fe(10.5,14,1.2),c);y.position.set(Math.cos(p/3*Math.PI*2)*6.6,0,Math.sin(p/3*Math.PI*2)*6.6),y.rotation.y=p/3*Math.PI*2,l.add(y)}i.add(l);let h=new Ve({color:new me(1.15,1.15,1.25)}),d=new se(new Rt(2,18,14),h);d.position.y=61.5,i.add(d);let u=new Ve({color:Xe.ceo,transparent:!0,opacity:0,blending:Ot,depthWrite:!1}),f=new se(new Mt(.6,2.4,300,12,1,!0),u);return f.position.y=160,i.add(f),{root:i,coreMat:n,crownMat:h,cortexGroup:l,beamMat:u,beam:f,crown:d}}function _d(i){let e=new $e,t=[],n=new at({color:1318707,roughness:.75,metalness:.3});for(let s of i.masts){let r=new se(new Mt(.55,.9,s.h,8),n);r.position.set(s.x,s.h/2,s.z),r.castShadow=!0,e.add(r);let o=new Ve({color:Xe.traffic.clone().multiplyScalar(1.4)}),a=new se(new Bt(1.5,.28,8,24),o);a.rotation.x=Math.PI/2,a.position.set(s.x,s.h*.82,s.z),e.add(a),t.push(o);let l=new se(new Rt(.7,12,10),o);l.position.set(s.x,s.h,s.z),e.add(l)}return{root:e,beaconMats:t}}function Tt(i){let e=i>>>0;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var fo=(i,e,t)=>i+(e-i)*t,Yi=(i,e,t)=>i<e?e:i>t?t:i,xd=i=>{let e=Yi(i,0,1);return e*e*(3-2*e)},Tc=Math.PI/180;function yd(i){let e=t=>t.toString().padStart(2,"0");return`${e(i.getHours())}:${e(i.getMinutes())}:${e(i.getSeconds())}`}function vd(i){return i&&i.length>=5?i.substring(0,5):"--:--"}var wc=130;function Md(i){let e=new $e,t=Tt(90210),n=[],s=i.fleet.filter(l=>l.cores>0),r=new Fe(3.4,1.3,1.9),o=new Fe(1.6,1,1.5);s.forEach((l,c)=>{let h=c/Math.max(1,s.length)*Math.PI*2+.4,d=new $e,u=new me().setHSL(.6+t()*.08,.25,.32),f=new se(r,new at({color:u,roughness:.55,metalness:.35}));f.position.y=.85,f.castShadow=!0,d.add(f);let p=new Ve({color:2241348}),y=new se(o,p);y.position.set(-.6,1.95,0),d.add(y);let _=new Ve({color:1582127}),m=new se(new Fe(.5,.22,.5),_);m.position.set(.4,1.62,0),d.add(m);let v=wc+6;d.position.set(Math.cos(h)*v,0,Math.sin(h)*v),d.rotation.y=-h+Math.PI/2,e.add(d),n.push({group:d,machine:l,slotAngle:h,headMat:p})});function a(l,c){for(let h of n)if(h.machine.online){let d=h.slotAngle+c*.05,u=wc+6;h.group.position.set(Math.cos(d)*u,0,Math.sin(d)*u),h.group.rotation.y=-d+Math.PI/2,h.headMat.color.setRGB(.4,.95,.85)}else{let d=.1+.05*(.5+.5*Math.sin(c*.8+h.slotAngle*3));h.headMat.color.setRGB(d,d*1.4,d*1.6)}}return{root:e,update:a}}var Ac={GM:"gaming",MD:"gaming",QT:"quant",OR:"quant",NS:"media",RV:"media",anchors:"media"},ig={gaming:16747612,quant:5020415,media:10320895,meta:16765286};function po(i){let e=2166136261;for(let t=0;t<i.length;t++)e^=i.charCodeAt(t),e=Math.imul(e,16777619);return e>>>0}var Ul=(i,e)=>i%e,bd=new Map;function Jt(i,e=0){let t=i*1e3+e,n=bd.get(t);if(!n){n=new Ur({color:i});let s=e||new me(i).multiplyScalar(.32).getHex();n.emissive=new me(s),bd.set(t,n)}return n}function Hs(i,e){if(!i)return e;let t=parseInt(i.replace("#",""),16);return Number.isFinite(t)?t:e}function sg(i,e){let t=document.createElement("canvas"),n=8,s=26,r=t.getContext("2d");r.font=`${s}px "Microsoft YaHei", sans-serif`;let o=Math.min(460,r.measureText(i).width+n*2);t.width=Math.ceil(o),t.height=s+n*2;let a=t.getContext("2d");a.font=`${s}px "Microsoft YaHei", sans-serif`,a.fillStyle="rgba(6,10,18,0.70)",a.fillRect(0,0,t.width,t.height),a.strokeStyle=e,a.lineWidth=2,a.strokeRect(1,1,t.width-2,t.height-2),a.fillStyle=e,a.textBaseline="middle",a.fillText(i,n,t.height/2);let l=new br(t),c=new yr(new Ss({map:l,transparent:!0,depthWrite:!1})),h=.013;return c.scale.set(t.width*h,t.height*h,1),c}function rg(i,e){let n;return i<12?n=3.6:i<18?n=4.4:i<41?n=5.2:i<56?n=5:i<70?n=4.8:n=4.6,.26*n*(e?.97:1)}function og(i){var U,H,z;let e=new $e,t=po(i.id),n=Number((U=i.age)!=null?U:30),s=i.gender==="\u5973",r=n<12,o=rg(n,s)*(.96+Ul(t,9)/100),a=Ul(t>>10,3),l=a===0?.9:a===2?1.12:1,c=(s?.86:1)*(.92+Ul(t>>3,17)/100)*l,h=Hs(i.skin_c,14266762),d=Hs(i.hair_c,2829104),u=Hs(i.cloth_c,4877194),f=Hs(i.pant_c,3814464),p=Hs(i.badge_c,4906624),y=Hs(i.eye_c,16765562),_=.26,m=.24*(r?1.12:1),v=o*(r?.3:.28),b=o*(r?.3:.42),x=v*.86,T=.12*(s?.92:1);for(let V of[-1,1]){let G=new se(new Fe(T,b,.14),Jt(f));G.position.set(V*(T*.62),b/2,0),e.add(G);let K=new se(new Fe(T*1.08,.07,.19),Jt(2434862));K.position.set(V*(T*.62),.035,.02),e.add(K)}let w=new se(new Fe(.34*c,v,.2*l),Jt(u));w.position.set(0,b+v/2,0),e.add(w);for(let V of[-1,1]){let G=new se(new Fe(.085,x,.1),Jt(u));G.position.set(V*(.17*c+.045),b+v-x/2+.02,0),e.add(G)}let g=.04,M=b+v+g+_/2,C=new se(new Fe(m,_,.22),Jt(h));C.position.set(0,M,0),e.add(C);let I=((((H=i.hair_part)!=null?H:"hair-short").includes("long")?3:0)+Ul(t>>5,3))%6,N=new se(new Fe(m*1.06,.07,.23),Jt(d));if(N.position.set(0,M+_/2-.02,0),e.add(N),I===1){let V=new se(new Fe(m*1.02,_*.95,.075),Jt(d));V.position.set(0,M-.06,-.115),e.add(V)}else if(I===2)for(let V of[-1,1]){let G=new se(new Fe(.055,_*1.25,.055),Jt(d));G.position.set(V*(m*.52),M-.1,-.02),e.add(G)}else if(I===3){let V=new se(new Rt(.075,8,6),Jt(d));V.position.set(0,M+_/2+.05,-.06),e.add(V)}else if(I===4){let V=new se(new Fe(m*1.18,.035,.13),Jt(d));V.position.set(0,M+_/2+.01,.1),e.add(V)}else if(I===5){let V=new se(new Fe(m*1.16,.1,.225),Jt(d));V.position.set(0,M+_/2-.03,-.01),e.add(V)}for(let V of[-1,1]){let G=new se(new Fe(.035,.035,.02),Jt(y,y));G.position.set(V*.05,M+.01,.112),e.add(G)}let O=new se(new Fe(.06,.06,.02),Jt(p,p));O.position.set(-.09*c,b+v-.1,.105),e.add(O);let R=((z=i.faction)!=null?z:"").toLowerCase();if(R.includes("commuter")){let V=new se(new Fe(.1,.14,.06),Jt(3882826));V.position.set(.2*c,b+.16,.02),e.add(V)}else if(R.includes("lilong")||R.includes("\u5F04\u5802")){let V=new se(new Fe(.26*c,.3,.02),Jt(15262422));V.position.set(0,b+.22,.106),e.add(V)}else if(R.includes("compiled")){let V=new se(new Fe(.19,.05,.02),Jt(10135480));V.position.set(0,M+.01,.118),e.add(V)}else if(R.includes("newcomer")){let V=new se(new Fe(.2,.22,.09),Jt(3108698));V.position.set(0,b+v-.12,-.145),e.add(V)}return{g:e,h:b+v+g+_}}function Sd(i,e){var x,T,w;let t=new $e,n=(x=e.residents)!=null?x:[];if(!n.length)return{root:t,update:()=>{},anchors:[],setLabels:()=>{}};let s=Tt(20261126),r=new Map,o=[],a=[],l=[],c=0,h=[],d=[];n.forEach(g=>{var M;h.push(g.id),d.push((M=g.district)!=null?M:"")});let u=(T=e.agentTurns)!=null?T:[],f=14,p=0,y=-1,_=(g,M,C)=>{var z;let A=(z=Ac[g])!=null?z:"media",I=i.districts.find(V=>V.id===A),N=I?I.cx:0,O=I?I.cz:0,R=po(`${g}|${M}`)%7200/7200*Math.PI*2,U=po(C+"|s")%360/360*Math.PI*2,H=2+po(C+"|r")%50/10;return new L(N+Math.cos(R)*86+Math.cos(U)*H,0,O+Math.sin(R)*86+Math.sin(U)*H)};n.forEach(g=>{var oe,ue,Z,k,re,Se,ae,Re,qe,Ne;let M=(ue=Ac[(oe=g.district)!=null?oe:""])!=null?ue:"media",C=i.districts.find(Ge=>Ge.id===M),A=C?C.cx:0,I=C?C.cz:0,N=s()*Math.PI*2,O=76+s()*28,R=A+Math.cos(N)*O,U=I+Math.sin(N)*O,{g:H,h:z}=og(g),V=R,G=U;if(g.place){let Ge=_((Z=g.district)!=null?Z:"",g.place,g.id);V=Ge.x,G=Ge.z}H.position.set(V,0,G),H.rotation.y=Math.atan2(V-A,G-I)+po(g.id)%60/100-.3,t.add(H),o.push(H),c+=H.children.length;let K=(k=ig[M])!=null?k:16777215,W=sg(`${(re=g.name)!=null?re:g.id}`,`#${K.toString(16).padStart(6,"0")}`);W.position.set(V,z+.72,G),t.add(W),l.push(W),r.set(g.id,new L(V,z*.75,G)),a.push({id:g.id,name:(Se=g.name)!=null?Se:g.id,profession:(ae=g.profession)!=null?ae:"",ring:(Re=g.ring)!=null?Re:"",place:(qe=g.place)!=null?qe:"",act:(Ne=g.act_label)!=null?Ne:"",pos:new L(V,z*.5,G)})});let m=(w=e.echoes)!=null?w:[],v=[],b=g=>{var A;let M=(A=Ac[g!=null?g:""])!=null?A:"media",C=i.districts.find(I=>I.id===M);return C?new L(C.cx,24,C.cz):null};return m.slice(0,24).forEach((g,M)=>{var U,H,z,V;let C=r.get((U=g.owner)!=null?U:""),A=r.get((H=g.by)!=null?H:"");if(C||(C=(z=b(g.owner_d))!=null?z:void 0),A||(A=(V=b(g.by_d))!=null?V:void 0),!C||!A)return;let I=new L().addVectors(C,A).multiplyScalar(.5);I.y+=14+M%5*4;let N=new As(C.clone(),I,A.clone()),O=new dt().setFromPoints(N.getPoints(24)),R=new Ni(O,new Ts({color:6160304,transparent:!0,opacity:.45}));t.add(R),v.push(R)}),window.__CITY_RESIDENTS__={figures:o.length,meshes:c,arcs:v.length,slots:n.length,positions:()=>o.map(g=>[Math.round(g.position.x*10)/10,Math.round(g.position.z*10)/10]),turn:()=>y},{root:t,anchors:a,setLabels:g=>{l.forEach(M=>{M.visible=g})},update:(g,M)=>{var N,O;if(o.forEach((R,U)=>{R.position.y=Math.sin(M*1.1+U)*.012}),v.forEach((R,U)=>{let H=R.material;H.opacity=.18+.26*(.5+.5*Math.sin(M*.9+U))}),!u.length)return;p+=g;let C=Math.floor(p/f)%u.length,A=(O=(N=u[C])==null?void 0:N.agents)!=null?O:{},I=Math.min(1,g*1.6);o.forEach((R,U)=>{var oe,ue;let H=A[h[U]];if(!H||!H.place)return;let z=_(d[U],H.place,h[U]),V=z.x-R.position.x,G=z.z-R.position.z;V*V+G*G>.04&&(R.position.x+=V*I,R.position.z+=G*I,R.rotation.y=Math.atan2(V,G));let K=l[U];K&&(K.position.x=R.position.x,K.position.z=R.position.z);let W=a[U];W&&(W.pos.x=R.position.x,W.pos.z=R.position.z,W.place=H.place,W.act=(ue=(oe=H.label)!=null?oe:H.act)!=null?ue:"")}),C!==y&&(y=C)}}}var Ed=Xe.data.clone().multiplyScalar(1.4),Td=Xe.data.clone().multiplyScalar(1.15),wd=Xe.brain.clone().multiplyScalar(1.4),Ad=Xe.brain.clone().multiplyScalar(1.9),Rd=Xe.capital.clone().multiplyScalar(1.35),Cd=Xe.capital.clone().multiplyScalar(1.5),Pd=Xe.capital.clone().multiplyScalar(2),qi=new Fe(1,1,1),ag=new Mt(3.6,4.6,1,12),lg=new Mt(5.6,6.6,2,12),cg=new Mt(1.5,1.5,1,10),hg=new Mt(3,3,1,16),ug=new Rt(25,32,20),dg=new Rt(22.5,28,18),fg=new Rt(8,20,14),pg=new Mt(.14,.9,116,8),mg=new Rt(1.5,12,10),gg=new Bt(25,.7,8,48),_g=new Bt(22.5,.6,8,44),xg=new Bt(8,.4,8,32),yg=new Bt(17,.5,8,40),vg=new Mt(.22,1.5,22.5,8),Mg=new Rt(1.5,12,10);function Id(){let i=Tt(59922),e=new $e,t=new L(0,1,0),n=new at({color:2899804,roughness:.9,metalness:.1}),s=new at({color:2241359,roughness:.55,metalness:.35}),r=new at({color:4743818,roughness:.3,metalness:.85}),o=new Ve({color:Ed.clone(),blending:Ot,transparent:!0,depthWrite:!1}),a=new Ve({color:Td.clone(),blending:Ot,transparent:!0,depthWrite:!1}),l=new Ve({color:wd.clone()}),c=new Ve({color:Ad.clone()}),h=66,d=2.5,u=110,f=[];for(let O=0;O<3;O++){let R=O/3*Math.PI*2+Math.PI/6,U=new L(Math.cos(R)*h,0,Math.sin(R)*h),H=new L(Math.cos(R)*d,u,Math.sin(R)*d);f.push(U);let z=H.clone().sub(U),V=new se(ag,n);V.scale.y=z.length(),V.quaternion.setFromUnitVectors(t,z.normalize()),V.position.copy(U).add(H).multiplyScalar(.5),V.castShadow=!0,e.add(V);let G=new se(lg,n);G.position.set(U.x,1,U.z),e.add(G)}let p=72,y=h-(h-d)*(p/u);for(let O=0;O<3;O++){let R=Math.atan2(f[O].z,f[O].x),U=Math.atan2(f[(O+1)%3].z,f[(O+1)%3].x),H=new L(Math.cos(R)*y,p,Math.sin(R)*y),z=new L(Math.cos(U)*y,p,Math.sin(U)*y),V=z.clone().sub(H),G=new se(cg,n);G.scale.y=V.length(),G.quaternion.setFromUnitVectors(t,V.normalize()),G.position.copy(H).add(z).multiplyScalar(.5),e.add(G)}let _=new se(ug,s);_.position.y=98,_.castShadow=!0,e.add(_);let m=new se(dg,s);m.position.y=267,m.castShadow=!0,e.add(m);let v=new se(fg,s);v.position.y=344,v.castShadow=!0,e.add(v);let b=[],x=(O,R)=>{let U=new se(O,o);U.rotation.x=Math.PI/2,U.position.y=R,e.add(U),b.push({mesh:U,phase:i()*Math.PI*2})};x(gg,98),x(_g,267),x(xg,344);let T=95,w=352,g=w-T,M=(T+w)/2,C=new se(hg,s);C.scale.y=g,C.position.y=M,C.castShadow=!0,e.add(C);for(let O=0;O<8;O++){let R=O/8*Math.PI*2+Math.PI/8,U=new se(qi,r);U.scale.set(.65,g,1.2),U.position.set(Math.cos(R)*3.55,M,Math.sin(R)*3.55),U.rotation.y=Math.PI/2-R,e.add(U);let H=R+Math.PI/8,z=new se(qi,a);z.scale.set(.22,g,.34),z.position.set(Math.cos(H)*3.95,M,Math.sin(H)*3.95),z.rotation.y=Math.PI/2-H,e.add(z)}let A=new se(pg,l);A.position.y=410,e.add(A);let I=new se(mg,c);return I.position.y=468,e.add(I),{root:e,update:(O,R)=>{let U=.72+.28*Math.sin(R*1.4);o.color.copy(Ed).multiplyScalar(U);for(let V of b)V.mesh.scale.setScalar(1+.02*Math.sin(R*1.4+V.phase));a.color.copy(Td).multiplyScalar(.55+.45*Math.sin(R*2.1));let H=R%2.4,z=H<.12||H>.26&&H<.38;c.color.copy(Ad).multiplyScalar(z?1:.08),I.scale.setScalar(z?1.25:.85),l.color.copy(wd).multiplyScalar(.85+.15*Math.sin(R*.9))}}}function Ld(){let i=Tt(315405),e=new $e,t=new L(0,1,0),n=new at({color:2767966,roughness:.72,metalness:.28}),s=new at({color:3821688,roughness:.3,metalness:.85}),r=new Ve({color:Rd.clone(),blending:Ot,transparent:!0,depthWrite:!1}),o=new Ve({color:Cd.clone(),blending:Ot,transparent:!0,depthWrite:!1}),a=new Ve({color:Pd.clone()}),l=68,c=26,h=new se(qi,n);h.scale.set(l,c,l),h.position.y=c/2,h.castShadow=!0,e.add(h);let d=(x,T,w,g,M)=>{let C=new se(qi,r);C.scale.set(M,g,M),C.position.set(x,w,T),e.add(C)};for(let x=-1;x<=1;x+=2)for(let T=-1;T<=1;T+=2)d(x*(l/2-.1),T*(l/2-.1),c/2,c+1.5,1.4);let u=8,f=42.5,p=58,y=340;for(let x=0;x<u;x++){let T=p*Math.pow(.94,x),w=T/2,g=f/2+x*f,M=new se(qi,n);M.scale.set(T,f,T),M.position.y=g,M.castShadow=!0,e.add(M);for(let C=-1;C<=1;C+=2)for(let A=-1;A<=1;A+=2)d(C*(w-.1),A*(w-.1),g,f+2.2,1.1)}let _=p*Math.pow(.94,u-1)/2;for(let x=0;x<5;x++){let T=y+x*11.5,w=17*(1-.16*x),g=.4-.06*x+(i()-.5)*.05,M=12.5+(i()-.5)*.8,C=2*w*Math.sin(Math.PI/8)*1.28;for(let I=0;I<8;I++){let N=I/8*Math.PI*2+Math.PI/8+(i()-.5)*.04,O=new $e;O.position.y=T,O.rotation.y=N;let R=new se(qi,s);R.scale.set(C,M,.8),R.position.set(w+M/2*Math.sin(g),M/2*Math.cos(g),0),R.rotation.z=-g,O.add(R),e.add(O)}let A=new se(yg,r);A.rotation.x=Math.PI/2,A.scale.setScalar(w/17),A.position.y=T+1,e.add(A)}for(let x=-1;x<=1;x+=2)for(let T=-1;T<=1;T+=2){let w=new L(x*_,y,T*_),g=new L(x*3.2,397.5,T*3.2),M=g.clone().sub(w),C=new se(qi,r);C.scale.set(.7,M.length(),.7),C.quaternion.setFromUnitVectors(t,M.normalize()),C.position.copy(w).add(g).multiplyScalar(.5),e.add(C)}let m=new se(vg,o);m.position.y=397+22.5/2,e.add(m);let v=new se(Mg,a);return v.position.y=419.2,e.add(v),{root:e,update:(x,T)=>{let w=.5+.5*Math.sin(T*1.1);a.color.copy(Pd).multiplyScalar(1+.9*w),v.scale.setScalar(.9+.3*w),o.color.copy(Cd).multiplyScalar(.8+.35*Math.sin(T*1.1+.7)),r.color.copy(Rd).multiplyScalar(.88+.16*Math.sin(T*.8+2.1))}}}var Ud=new Fe(1,1,1),bi=18,Zi=35,mo=.14,Cc=42/(1+mo),Pc=22.5/(1+mo),Dd=Math.PI*2/3,Ic=bi*Zi,Nd=i=>fo(Cc,Pc,i/Ic);function bg(i,e){let t=new Mt(i,e,Zi,72,1,!0),n=t.attributes.position;for(let s=0;s<n.count;s++){let r=n.getX(s),o=n.getZ(s),a=1+mo*Math.cos(3*Math.atan2(r,o));n.setX(s,r*a),n.setZ(s,o*a)}return t.computeVertexNormals(),t}var Od=[];for(let i=0;i<bi;i++)Od.push(bg(fo(Cc,Pc,(i+1)/bi),fo(Cc,Pc,i/bi)));var Sg=new Mt(14,26,630,20),Eg=new Bt(23.5,1.5,10,48);function Fd(){let i=new $e;i.name="landmark-shanghai-tower";let e=Tt(6233633),t=new at({color:1320511,transparent:!0,opacity:.55,metalness:.6,roughness:.22,side:ln,depthWrite:!1}),n=new at({color:1847376,roughness:.85,metalness:.15}),s=new Ve({color:Xe.brain.clone().multiplyScalar(1.35)}),r=new Ve({color:Xe.data.clone().multiplyScalar(1.5)});for(let d=0;d<bi;d++){let u=new se(Od[d],t);u.position.y=d*Zi+Zi/2,u.rotation.y=d/bi*Dd,u.castShadow=!0,i.add(u)}let o=new se(Sg,n);o.position.y=Ic/2,o.castShadow=!0,i.add(o);for(let d=0;d<bi;d++){let u=d/bi*Dd,f=d*Zi;for(let p=0;p<3;p++){let y=u+p*Math.PI*2/3,_=Math.sin(y),m=Math.cos(y),v=Nd(f)*(1+mo)+.25,b=Nd(f+Zi)*(1+mo)+.25,x=new L(_*v,f,m*v),T=new L(_*b,f+Zi,m*b),w=new L().subVectors(T,x),g=new se(Ud,s);g.scale.set(.85+.3*e(),w.length()+.8,.55),g.position.copy(x).add(T).multiplyScalar(.5);let M=w.clone().normalize(),C=new L(m,0,-_),A=new L().crossVectors(C,M).normalize(),I=new L().crossVectors(M,A);g.quaternion.setFromRotationMatrix(new Ke().makeBasis(I,M,A)),i.add(g)}}let a=new se(Eg,r);a.rotation.x=Math.PI/2,a.position.y=Ic+.5,i.add(a);let l=s.color.clone(),c=r.color.clone();return{root:i,update:(d,u)=>{s.color.copy(l).multiplyScalar(.8+.26*Math.sin(u*.9));let f=.62+.5*Math.sin(u*1.7);r.color.copy(c).multiplyScalar(f),a.scale.setScalar(1+.03*Math.sin(u*1.7))}}}var Si=486,go=436,Rc=58,Tg=24;var wg=[[.15,0],[29,0],[20,Si],[11,Si],[15,go],[.15,go]],Ag=[[-.15,0],[-.15,go],[-15,go],[-11,Si],[-20,Si],[-29,0]];function Bd(i){let e=new zn;e.moveTo(i[0][0],i[0][1]);for(let r=1;r<i.length;r++)e.lineTo(i[r][0],i[r][1]);e.closePath();let t=new ti(e,{depth:Rc,bevelEnabled:!1}),n=t.attributes.position,s=Tg/Rc;for(let r=0;r<n.count;r++){let o=fo(1,s,n.getY(r)/Si);n.setZ(r,(n.getZ(r)-Rc/2)*o)}return t.computeVertexNormals(),t}var Rg=Bd(wg),Cg=Bd(Ag),Pg=new Fe(30,6,25),Ig=new Fe(2.4,56,7.5),Lg=new Rt(1.5,14,10);function zd(){let i=new $e;i.name="landmark-swfc";let e=Tt(3943834),t=new at({color:2900070,roughness:.3,metalness:.55}),n=new Ve({color:Xe.capital.clone().multiplyScalar(1.3)}),s=new Ve({color:new me(1.1,1.1,1.25)});for(let d of[Rg,Cg]){let u=new se(d,t);u.castShadow=!0,i.add(u)}let r=new se(Pg,t);r.position.y=Si+3,r.castShadow=!0,i.add(r);let o=new se(Ig,t);o.position.set(2,461,0),o.rotation.z=Math.atan2(26,48),o.castShadow=!0,i.add(o);let a=(d,u,f,p,y,_)=>{let m=new se(Ud,n);m.scale.set(d*(.95+.1*e()),u,f),m.position.set(p,y,0),m.rotation.z=_,i.add(m)};a(31.2,1,28.3,0,go+.3,0),a(23.2,1,24.8,0,Si+.3,0),a(1,51.4,26.3,13,461,.08),a(1,51.4,26.3,-13,461,-.08);let l=new se(Lg,s);l.position.y=Si+7.2,i.add(l);let c=n.color.clone();return{root:i,update:(d,u)=>{n.color.copy(c).multiplyScalar(.84+.16*Math.sin(u*.55))}}}var Fl=new at({color:2241614,roughness:.85,metalness:.15}),Hd=new at({color:2900584,roughness:.4,metalness:.45,emissive:Xe.traffic,emissiveIntensity:.22}),Gs=new at({color:2766928,roughness:.6,metalness:.45}),Lc=new Ve({color:Xe.traffic.clone().multiplyScalar(1.25)}),Ol=new Ve({color:Xe.traffic.clone().multiplyScalar(1.35)}),Gd=new Ve({color:Xe.data.clone().multiplyScalar(1.3)}),kd=new Ve({color:Xe.capital.clone().multiplyScalar(1.2)});function Vd(){let i=new $e;i.name="whiteMagnolia";let e=Tt(11326),t=12,n=270,s=55,r=32,o=new se(new Fe(64,t,64),Fl);o.position.y=t/2,o.castShadow=!0,i.add(o);let a=new se(new Mt(r/Math.SQRT2,s/Math.SQRT2,n-t,4,1),Fl);a.rotation.y=Math.PI/4,a.position.y=(t+n)/2,a.castShadow=!0,i.add(a);let l=s/2,c=r/2,h=new L(0,1,0),d=Math.hypot(n-t,(l-c)*Math.SQRT2),u=new Fe(1.2,d,1.2);for(let w of[-1,1])for(let g of[-1,1]){let M=new se(u,Lc),C=new L(w*(c-l),n-t,g*(c-l));M.quaternion.setFromUnitVectors(h,C.normalize()),M.position.set(w*(l+c)/2,(t+n)/2,g*(l+c)/2),i.add(M)}let f=140,p=(f-t)/(n-t),y=new se(new Bt((s+(r-s)*p)/Math.SQRT2+.4,.9,8,48),Lc);y.rotation.x=Math.PI/2,y.position.y=f,i.add(y);let _=new se(new Fe(30,7,30),Fl);_.position.y=273.5,i.add(_);let m=5;for(let w=0;w<m;w++){let g=52+e()*4,M=12+e()*2.5,C=(29+e()*5)*Tc,A=new $e;A.rotation.y=w/m*Math.PI*2+.35,A.position.y=271,i.add(A);let I=new zn;I.moveTo(0,0),I.quadraticCurveTo(M,g*.22,M*.55,g*.6),I.quadraticCurveTo(M*.28,g*.88,0,g),I.quadraticCurveTo(-M*.28,g*.88,-M*.55,g*.6),I.quadraticCurveTo(-M,g*.22,0,0);let N=new se(new ti(I,{depth:2.4,bevelEnabled:!1,curveSegments:12}),Hd);N.rotation.x=C,N.position.z=6,A.add(N);let O=new se(new Fe(.9,g*.78,.5),Ol);O.position.set(0,g*.58,3),N.add(O)}let v=new se(new Oi(4.2,1),Ol);v.position.y=291,i.add(v);let b=new se(new Bt(7.5,.55,8,40),Ol);b.rotation.x=Math.PI/2,b.position.y=287,i.add(b);let x=0;return{root:i,update:(w,g)=>{let M=.5+.5*Math.sin(g*1.6);Ol.color.copy(Xe.traffic).multiplyScalar(1.1+M*.55),Hd.emissiveIntensity=.18+M*.3;let C=Math.pow(Math.max(0,Math.sin(g*2.3+.8)),3);x+=(C-x)*Math.min(1,w*9),v.scale.setScalar(.85+x*.45),b.scale.setScalar(.9+x*.28);let A=.5+.5*Math.sin(g*.7+2.1);Lc.color.copy(Xe.traffic).multiplyScalar(1+A*.4)}}}function Wd(){let i=new $e;i.name="waibaiduBridge";let e=Tt(21204),t=52,n=2,s=t*n,r=10,o=1.5,a=14,l=11,c=6.5,h=6.6,d=r+.4,u=d+l,f=new se(new Fe(s,o,a),Gs);f.position.y=r-o/2,f.castShadow=!0,i.add(f);let p=new Fe(t,1,1),y=new Fe(.7,l,.7),_=Math.hypot(c,l),m=new Fe(_,.55,.55),v=Math.atan2(l,c);for(let g=0;g<n;g++){let M=-s/2+g*t,C=M+t/2;for(let A of[-h,h]){for(let I of[d,u]){let N=new se(p,Gs);N.position.set(C,I,A),i.add(N)}for(let I=0;I<=t/c;I++){if(g===1&&I===0)continue;let N=new se(y,Gs);N.position.set(M+I*c,(d+u)/2,A),i.add(N)}for(let I=0;I<t/c;I++){let N=M+(I+.5)*c;for(let O of[1,-1]){let R=new se(m,Gs);R.position.set(N,(d+u)/2,A),R.rotation.z=O*v,i.add(R)}}}}for(let g of[-1,1]){let M=17.5+e()*1.5,C=g*(s/2-.5);for(let I of[-h,h]){let N=new se(new Fe(1.8,M,1.8),Gs);N.position.set(C,r-1+M/2,I),N.castShadow=!0,i.add(N)}let A=new se(new Fe(2.4,2.4,h*2+2.2),Gs);A.position.set(C,r-1+M-1.2,0),A.castShadow=!0,i.add(A)}let b=new Fe(5.5,r-o,12);for(let g of[0,-(s/2)+3,s/2-3]){let M=new se(b,Fl);M.position.set(g,(r-o)/2,0),M.castShadow=!0,i.add(M)}let x=new Fe(s,.4,.4);for(let g of[-h-.75,h+.75])for(let M of[d,u]){let C=new se(x,Gd);C.position.set(0,M,g),i.add(C)}let T=new Fe(s,.5,.5);for(let g of[-(a/2+.25),a/2+.25]){let M=new se(T,kd);M.position.set(0,r+.3,g),i.add(M)}return{root:i,update:(g,M)=>{let C=.5+.5*Math.sin(M*1.1);kd.color.copy(Xe.capital).multiplyScalar(.95+C*.3);let A=.5+.5*Math.sin(M*.5+2.6);Gd.color.copy(Xe.data).multiplyScalar(1.05+A*.3)}}}var Dg=`
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Ng=`
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;
varying vec3 vPos;
void main() {
  float h = normalize(vPos + vec3(0.0, offset, 0.0)).y;
  float t = pow(max(h, 0.0), exponent);
  gl_FragColor = vec4(mix(bottomColor, topColor, t), 1.0);
}`;function Xd(){let i={topColor:{value:new me(263694)},bottomColor:{value:new me(66e4)},offset:{value:120},exponent:{value:.7}},e=new Ct({uniforms:i,vertexShader:Dg,fragmentShader:Ng,side:qt,depthWrite:!1,fog:!1}),t=new se(new Rt(880,24,16),e);t.frustumCulled=!1;let n=900,s=new Float32Array(n*3),o=1234567,a=()=>(o=o*1103515245+12345&2147483647,o/2147483647);for(let d=0;d<n;d++){let u=a()*Math.PI*2,f=Math.acos(a()*.85+.1),p=820;s[d*3]=p*Math.sin(f)*Math.cos(u),s[d*3+1]=Math.abs(p*Math.cos(f)),s[d*3+2]=p*Math.sin(f)*Math.sin(u)}let l=new dt;l.setAttribute("position",new Ut(s,3));let c=new Bn({color:13623551,size:1.6,sizeAttenuation:!1,transparent:!0,opacity:.9,depthWrite:!1,fog:!1}),h=new Qn(l,c);return h.frustumCulled=!1,{mesh:t,uniforms:i,stars:h,starMat:c}}var Bl=class{constructor(e,t,n,s,r){this.bodyMat=null;this.groundMat=null;this.breathBoost=0;this.zoneGain=new Map;this.realMats=new Map;this.waterMat=null;this.flowMats=[];this.dustMat=null;this.scene=e,this.sun=t,this.hemi=n,this.sky=s,this.data=r;let o=r.reality.beijing_hhmm||"12:00",[a,l]=o.split(":").map(c=>parseInt(c,10)||0);this.baseHour=a+l/60,this.basePerf=performance.now(),this.fog=new pr(329743,16e-5),e.fog=this.fog;for(let c of r.zones)this.zoneGain.set(c.id,.45+.55*Math.min(1,Math.max(0,c.activity)))}attachMaterials(e,t){this.bodyMat=e,this.groundMat=t}hour(){let e=(performance.now()-this.basePerf)/36e5;return(this.baseHour+e)%24}label(){return ud(this.hour())}update(){var l,c,h;let e=this.hour(),t=hd(e);this.sky.uniforms.topColor.value.copy(t.skyTop),this.sky.uniforms.bottomColor.value.copy(t.skyBottom),this.fog.color.copy(t.fog),this.sky.starMat.opacity=t.starOpacity;let n=(e-6)/12,s,r,o;n>=0&&n<=1?(s=Math.cos(Math.PI*(1-n))*500,r=Math.max(40,Math.sin(Math.PI*n)*500),o=220):(s=-300,r=420,o=-260),this.sun.position.set(s,r,o),this.sun.color.copy(t.sunColor),this.sun.intensity=t.sunIntensity,this.hemi.color.copy(t.hemiSky),this.hemi.groundColor.copy(t.hemiGround),this.hemi.intensity=t.hemiIntensity;let a=this.breathBoost;for(let[d,u]of this.realMats){let f=(l=this.zoneGain.get(d))!=null?l:.5;u.uniforms.uWinGain.value=Math.max(.3,t.windowGain*f*1.8),u.uniforms.uBreath.value=a,u.uniforms.uBodyGain.value=t.bodyGain*.9+.55}this.waterMat&&(this.waterMat.uniforms.uTime.value=performance.now()/1e3);for(let d of this.flowMats){let u=d.userData.flowColor;d.color.copy(u).multiplyScalar(.55+.85*t.windowGain+a*.5)}(c=this.bodyMat)==null||c.color.setScalar(t.bodyGain),(h=this.groundMat)==null||h.color.copy(t.groundColor),this.dustMat&&(this.dustMat.opacity=.5*t.streetGain),this.breathBoost=Math.max(0,this.breathBoost-.0035)}};function Yd(i,e){let t=Tt(4242),n=e.census_total||1e4,s=620,r=new Float32Array(s*3);for(let c=0;c<s;c++){let h=i.districts[Math.floor(t()*i.districts.length)],d=t()*Math.PI*2,u=80+t()*330;r[c*3]=h.cx+Math.cos(d)*u,r[c*3+1]=3+t()*45,r[c*3+2]=h.cz+Math.sin(d)*u}let o=new dt;o.setAttribute("position",new Ut(r,3));let a=new Bn({color:8251608,size:3.4,sizeAttenuation:!0,transparent:!0,opacity:.4,depthWrite:!1,blending:Ot,fog:!0}),l=new Qn(o,a);return l.frustumCulled=!1,{points:l,mat:a}}var zl=class{constructor(e,t,n,s,r){this.dots=[];this.queue=[];this.crownPulse=0;this.beamT0=-999;this.hooks={};this.plan=t,this.tower=n,this.daynight=s,this.tower.beamMat.userData.t0=-999;let o=new Rt(4.2,10,8);for(let l=0;l<18;l++){let c=new Ve({color:16777215}),h=new se(o,c);h.visible=!1,e.add(h),this.dots.push({mesh:h,active:!1,t0:0,dur:8,from:new L,ctrl:new L,to:new L})}r.slice(-42).forEach((l,c)=>{this.queue.push({e:l,at:2+c*1.85})})}spawn(e,t){var h;let n=this.dots.find(d=>!d.active);if(!n)return;let s=e!=null?e:"governance",r=this.tower.root.position.clone(),o=this.plan.districts.find(d=>d.id===s);o&&(r=new L(o.cx,30,o.cz));let a=this.tower.root.position.clone();a.y+=150;let l=r.clone().lerp(a,.5);l.y=Math.max(r.y,a.y)+160,n.active=!0,n.t0=t,n.dur=8.5,n.from.copy(r),n.ctrl.copy(l),n.to.copy(a);let c=(h=Bs[s])!=null?h:Bs.governance;n.mesh.material.color.copy(c).multiplyScalar(1.7),n.mesh.visible=!0}ceoPulse(e){this.crownPulse=Math.min(1.4,this.crownPulse+1),this.beamT0=e}update(e){var o,a;for(;this.queue.length>0&&this.queue[0].at<=e;){let c=this.queue.shift().e;(a=(o=this.hooks).onEvent)==null||a.call(o,c,e),c.type==="CEO_ORDER"||c.type==="DECISION_MADE"||c.type==="DECISION_OVERRULED"?this.ceoPulse(e):c.type==="OS_TICK_START"||c.type==="OS_TICK_DONE"?this.daynight.breathBoost=Math.min(.35,this.daynight.breathBoost+.22):c.type==="TRANSFER"||this.spawn(c.zone,e)}let t=new L;for(let l of this.dots){if(!l.active)continue;let c=(e-l.t0)/l.dur;if(c>=1){l.active=!1,l.mesh.visible=!1,this.crownPulse=Math.min(.9,this.crownPulse+.25);continue}let h=c*c*(3-2*c),d=l.from,u=l.ctrl,f=l.to;t.set((1-h)*(1-h)*d.x+2*(1-h)*h*u.x+h*h*f.x,(1-h)*(1-h)*d.y+2*(1-h)*h*u.y+h*h*f.y,(1-h)*(1-h)*d.z+2*(1-h)*h*u.z+h*h*f.z),l.mesh.position.copy(t)}let n=e-this.beamT0;this.tower.beamMat.opacity=n<2.4?Math.max(0,1-n/2.4)*.55:0;let s=this.crownPulse;this.tower.crownMat.color.setRGB(1.15+s*1.1,1.15+s*1.1,1.25+s*1.1),this.crownPulse=Math.max(0,this.crownPulse-.02);let r=.5+.5*Math.sin(e*1.4);this.tower.coreMat.color.setRGB(.38+.1*r,.65+.14*r,1+.22*r),this.tower.cortexGroup.rotation.y=e*.12}};var Ug=12,Og=150,qd=9.4,Fg=.85,Zd={gaming:Xe.data,quant:Xe.capital,media:Xe.traffic};function Jd(i){let e=new $e,t=new Fe(20,1.1,1.1),n=[];for(let a=0;a<Ug;a++){let l=new Ve({color:16777215,transparent:!0,opacity:0,depthWrite:!1,blending:Ot}),c=new se(t,l);c.visible=!1,e.add(c),n.push({mesh:c,mat:l,active:!1,progress:0,len:1,from:new L,to:new L})}let s=a=>{a.active=!1,a.mat.opacity=0,a.mesh.visible=!1};return{root:e,pushEvent:a=>{var d;if(a.type!=="TRANSFER")return;let l=n.find(u=>!u.active);if(!l)return;let c=(d=a.zone)!=null?d:"gaming";Zd[c]||(c="gaming");let h=i.arteries.find(u=>u.district===c);h&&(l.from.set(h.x1,qd,h.z1),l.to.set(h.x0,qd,h.z0),l.len=l.from.distanceTo(l.to),!(l.len<1e-4)&&(l.progress=0,l.active=!0,l.mesh.rotation.y=Math.atan2(-(h.z0-h.z1),h.x0-h.x1),l.mat.color.copy(Zd[c]),l.mat.opacity=Fg,l.mesh.visible=!0,l.mesh.position.copy(l.from)))},update:(a,l)=>{for(let c of n)if(c.active){if(c.progress+=a*Og/c.len,c.progress>=1){s(c);continue}c.mesh.position.copy(c.from).lerp(c.to,c.progress)}}}}var Ji=300,Bg=new Fe(8,2.2,4),$d=new Fe(2.5,.5,3.5),zg=new at({color:16777215,roughness:.55,metalness:.35}),Hg=new Ve({color:16773824}),Gg=9.05,kg=new Ke().makeTranslation(2.8,.35,0),Vg=new Ke().makeTranslation(-2.8,.35,0),Wg=new Ve({color:16726832}),Kd=5,ks=new Ke().makeScale(0,0,0),Xg={gaming:1718837,quant:3813914,media:3807790},Yg=1843755;function qg(i){return i>=7&&i<9||i>=17&&i<19?{speed:60,density:1}:i>=9&&i<17?{speed:45,density:.6}:{speed:30,density:.08}}function jd(i){var f;let e=new $e,t=[];for(let p of i.arteries){let y=p.x0-p.x1,_=p.z0-p.z1,m=Math.hypot(y,_);if(m<1)continue;let v=y/m,b=_/m;t.push({district:p.district,fx:p.x1,fz:p.z1,dx:v,dz:b,len:m,ox:-b*Kd,oz:v*Kd,heading:Math.atan2(-b,v),start:0,count:0,target:0})}if(t.length===0)return{root:e,update:()=>{}};let n=Tt(774411),s=new an(Bg,zg,Ji);s.instanceMatrix.setUsage(Vi),s.frustumCulled=!1,s.castShadow=!1,e.add(s);let r=new an($d,Hg,Ji);r.instanceMatrix.setUsage(Vi),r.frustumCulled=!1,e.add(r);let o=new an($d,Wg,Ji);o.instanceMatrix.setUsage(Vi),o.frustumCulled=!1,e.add(o);let a=[],l=new me,c=-1;for(let p=0;p<Ji;p++){let y=Math.min(t.length-1,Math.floor(p/Ji*t.length)),_=t[y];y!==c&&(_.start=p,c=y),_.count++;let m=_.count%2===1;a.push({lane:y,forward:m,progress:n(),heading:_.heading+(m?0:Math.PI)}),l.setHex((f=Xg[_.district])!=null?f:Yg),s.setColorAt(p,l)}s.instanceColor&&(s.instanceColor.needsUpdate=!0);for(let p=0;p<Ji;p++)s.setMatrixAt(p,ks),r.setMatrixAt(p,ks),o.setMatrixAt(p,ks);let h=new St,d=new Ke;function u(p,y,_){let{speed:m,density:v}=qg(_);for(let b of t)b.target=Yi(Math.round(b.count*v),0,b.count);for(let b=0;b<Ji;b++){let x=a[b],T=t[x.lane];if(x.progress=(x.progress+p*m/T.len)%1,b-T.start>=T.target){s.setMatrixAt(b,ks),r.setMatrixAt(b,ks),o.setMatrixAt(b,ks);continue}let w=x.forward?x.progress:1-x.progress,g=x.forward?0:T.ox,M=x.forward?0:T.oz;h.position.set(T.fx+T.dx*w*T.len+g,Gg,T.fz+T.dz*w*T.len+M),h.rotation.set(0,x.heading,0),h.scale.setScalar(1),h.updateMatrix(),s.setMatrixAt(b,h.matrix),d.multiplyMatrices(h.matrix,kg),r.setMatrixAt(b,d),d.multiplyMatrices(h.matrix,Vg),o.setMatrixAt(b,d)}s.instanceMatrix.needsUpdate=!0,r.instanceMatrix.needsUpdate=!0,o.instanceMatrix.needsUpdate=!0}return{root:e,update:u}}var Qd=new Mt(.4,.9,26,6);Qd.translate(0,13,0);var Zg=26,Jg=new Rt(1.1,8,6),$g=.6,Hl=[{x:1215.4,z:1033.5,roofY:632},{x:1110.3,z:847.8,roofY:492},{x:454.9,z:368.1,roofY:468},{x:1032.7,z:613.5,roofY:420.5},{x:-471.1,z:-624.6,roofY:295},{x:-856.6,z:-195.2,roofY:27.7},{x:261.4,z:432.7,roofY:259.9},{x:1000.7,z:19.2,roofY:256},{x:175.9,z:490.6,roofY:249.9},{x:377.3,z:757.6,roofY:238},{x:1101.2,z:28.6,roofY:238},{x:659.7,z:-143.8,roofY:230},{x:880.8,z:-137.1,roofY:216},{x:973.6,z:-154.9,roofY:216},{x:996.7,z:731.5,roofY:210},{x:391.8,z:862,roofY:200}];function e2(){let i=new $e;i.name="rooftops";let e=new at({color:1845302,roughness:.8,metalness:.3}),t=new Ve({color:16729156}),n=new an(Qd,e,Hl.length),s=new an(Jg,t,Hl.length),r=new Ke;for(let a=0;a<Hl.length;a++){let l=Hl[a];r.makeTranslation(l.x,l.roofY,l.z),n.setMatrixAt(a,r),r.makeTranslation(l.x,l.roofY+Zg,l.z),s.setMatrixAt(a,r)}return n.instanceMatrix.needsUpdate=!0,s.instanceMatrix.needsUpdate=!0,n.frustumCulled=!1,s.frustumCulled=!1,i.add(n,s),{root:i,update:(a,l)=>{Math.sin(l/$g*Math.PI*4)>0?t.color.setRGB(3.2,.5,.5):t.color.setRGB(.35,.06,.06)}}}var Kg=[[31.218,121.489],[31.226,121.4908],[31.231,121.493],[31.234,121.4965],[31.236,121.5],[31.239,121.503],[31.243,121.5018],[31.248,121.502],[31.254,121.5035],[31.26,121.5065],[31.266,121.51],[31.272,121.5145]],t2=230,n2=60,i2=30,s2=80,r2=.1,jg=.22,Qg=.06,e8=.6,t8=.15,n8=.9,o2=new Fi(3.2,14);o2.translate(0,7,0);var i8=Xe.capital.clone(),s8=Xe.data.clone(),r8=Xe.traffic.clone(),o8=[{id:"gold",color:i8},{id:"cyan",color:s8},{id:"magenta",color:r8}];function a2(){let i=Tt(31415),e=new $e,t=Kg.map(([u,f])=>({lat:u,x:In(f),z:Ln(u)})),n=[0];for(let u=0;u<t.length-1;u++)n.push(n[u]+Math.hypot(t[u+1].x-t[u].x,t[u+1].z-t[u].z));let s=n[n.length-1],r=u=>{let f=0;for(;f<t.length-2&&u>n[f+1];)f++;let p=n[f+1]-n[f],y=p>0?(u-n[f])/p:0,_=t[f+1].x-t[f].x,m=t[f+1].z-t[f].z,v=Math.hypot(_,m)||1;return{x:t[f].x+_*y,z:t[f].z+m*y,lat:t[f].lat+(t[f+1].lat-t[f].lat)*y,tx:_/v,tz:m/v}},o=(u,f)=>{let p=1/0,y=0,_=0;for(let m=0;m<t.length-1;m++){let v=t[m].x,b=t[m].z,x=t[m+1].x-v,T=t[m+1].z-b,w=x*x+T*T||1,g=Math.min(1,Math.max(0,((u-v)*x+(f-b)*T)/w)),M=v+x*g,C=b+T*g,A=(u-M)*(u-M)+(f-C)*(f-C);A<p&&(p=A,y=M,_=C)}return{px:y,pz:_}},a={gold:[],cyan:[],magenta:[]};for(let u of[1,-1])for(let f=0;f<n2;f++){let p=(f+i())/n2*s,y=r(p),_=-y.tz,m=y.tx,v=i2+i()*(s2-i2),b=(t2-v)*u,x=y.x+_*b,T=y.z+m*b,w=o(x,T),g=x-w.px,M=T-w.pz,C=Math.hypot(g,M),A=t2-s2;C<A&&C>1e-6&&(x=w.px+g/C*A,T=w.pz+M/C*A);let I=u>0?"gold":"magenta";a[I].push({x,z:T,heading:Math.atan2(-y.tz,y.tx),tilt:(i()*2-1)*Qg,base:r2+i()*(jg-r2),phase:i()*Math.PI*2})}let l=new St;l.rotation.order="YXZ";let c=new me,h=[];for(let u of o8){let f=a[u.id],p=new Ve({color:u.color,blending:Ot,transparent:!0,depthWrite:!1,side:ln,fog:!0}),y=new an(o2,p,f.length),_=new Float32Array(f.length),m=new Float32Array(f.length);for(let v=0;v<f.length;v++){let b=f[v];l.position.set(b.x,e8,b.z),l.rotation.set(b.tilt,b.heading,0),l.updateMatrix(),y.setMatrixAt(v,l.matrix),_[v]=b.base,m[v]=b.phase,c.setScalar(b.base),y.setColorAt(v,c)}y.instanceMatrix.needsUpdate=!0,y.frustumCulled=!1,y.renderOrder=2,e.add(y),h.push({mesh:y,bases:_,phases:m})}return{root:e,update:(u,f)=>{for(let p of h){for(let y=0;y<p.bases.length;y++){let _=p.bases[y]*(1+t8*Math.sin(f*n8+p.phases[y]));c.setScalar(_),p.mesh.setColorAt(y,c)}p.mesh.instanceColor&&(p.mesh.instanceColor.needsUpdate=!0)}}}}var a8=6606,Ei=410,Nc=-115,Uc=230,l2=2400,c2=900,h2=500,l8=55,c8=7,h8=2,u8=.8,d8=30,f8=4,p8=2.3;function Dc(i,e,t,n,s){let r=new Float32Array(i*3),o=new Float32Array(i);for(let d=0;d<i;d++){let u=d*3;r[u]=(s()*2-1)*Ei,r[u+1]=Nc+s()*Uc,r[u+2]=(s()*2-1)*Ei,o[d]=s()*Math.PI*2}let a=new Ut(r,3),l=new dt;l.setAttribute("position",a);let c=new Bn({color:t,size:e,sizeAttenuation:!0,transparent:!0,opacity:n,depthWrite:!1,fog:!0}),h=new Qn(l,c);return h.frustumCulled=!1,{points:h,pos:r,attr:a,phases:o}}function u2(i){let e=Tt(a8),t=Dc(l2,.35,7309224,.45,e),n=Dc(c2,.9,14674164,.75,e),s=Dc(h2,.3,10466508,.3,e),r=new $e;r.add(t.points,n.points,s.points);let o=(i.reality.weather_kind||"").toLowerCase();return t.points.visible=o==="rain",n.points.visible=o==="snow",s.points.visible=o==="wind",{root:r,update:(l,c)=>{if(o==="rain"){let h=t.pos;for(let d=0;d<l2;d++){let u=d*3+1,f=h[u]-l8*l;f<Nc&&(f+=Uc),h[u]=f}t.attr.needsUpdate=!0}else if(o==="snow"){let h=n.pos;for(let d=0;d<c2;d++){let u=d*3,f=h[u+1]-c8*l;f<Nc&&(f+=Uc),h[u+1]=f;let p=h[u]+Math.sin(c*u8+n.phases[d])*h8*l;p>Ei?p-=Ei*2:p<-Ei&&(p+=Ei*2),h[u]=p}n.attr.needsUpdate=!0}else if(o==="wind"){let h=s.pos;for(let d=0;d<h2;d++){let u=d*3,f=h[u]+d8*l;f>Ei&&(f-=Ei*2),h[u]=f,h[u+1]+=Math.sin(c*p8+s.phases[d])*f8*l}s.attr.needsUpdate=!0}}}}var _o=360,d2=90,m8=300,f2=.08,g8=.2,_8=.08;function x8(i){return i>=7&&i<9?1:i>=9&&i<17?.55:i>=17&&i<19?1:i>=19&&i<21?.35:.04}function p2(i,e){let t=new $e;if(i.districts.length===0)return{root:t,update:()=>{}};let n=Tt(20261126),s=i.districts.map(f=>{let p=e.zones.find(y=>y.id===f.id);return{cx:f.cx,cz:f.cz,activity:p?p.activity:.5,start:0,count:0,target:0}}),r=[],o=-1;for(let f=0;f<_o;f++){let p=Math.min(s.length-1,Math.floor(f/_o*s.length));p!==o&&(s[p].start=f,o=p),s[p].count++,r.push({district:p,radius:d2+n()*(m8-d2),phase:n()*Math.PI*2,omega:f2+n()*(g8-f2),bobPhase:n()*Math.PI*2,bobHz:5.5+n()*3})}let a=new Tr(.32,1.1,3,6);a.translate(0,.9,0);let l=new at({color:2504527,roughness:.8}),c=new an(a,l,_o);c.instanceMatrix.setUsage(Vi),c.frustumCulled=!1,c.castShadow=!1,t.add(c);let h=new St,d=new Ke().makeScale(0,0,0);for(let f=0;f<_o;f++)c.setMatrixAt(f,d);function u(f,p,y){let _=x8(y);for(let m of s)m.target=Yi(Math.round(m.count*_*m.activity),0,m.count);for(let m=0;m<_o;m++){let v=r[m],b=s[v.district];if(m-b.start>=b.target){c.setMatrixAt(m,d);continue}let x=v.phase+v.omega*p;h.position.set(b.cx+Math.cos(x)*v.radius,Math.sin(p*v.bobHz+v.bobPhase)*_8,b.cz+Math.sin(x)*v.radius),h.rotation.set(0,Math.atan2(-Math.sin(x),Math.cos(x)),0),h.scale.setScalar(1),h.updateMatrix(),c.setMatrixAt(m,h.matrix)}c.instanceMatrix.needsUpdate=!0}return{root:t,update:u}}var Vs={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var xn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},y8=new Bi(-1,1,1,-1,0,1),Oc=class extends dt{constructor(){super(),this.setAttribute("position",new Qe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Qe([0,2,0,0,2,0],2))}},v8=new Oc,Ti=class{constructor(e){this._mesh=new se(v8,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,y8)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var Gl=class extends xn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Ct?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Sn.clone(e.uniforms),this.material=new Ct({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Ti(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var xo=class extends xn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},kl=class extends xn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var Vl=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new ne);this._width=n.width,this._height=n.height,t=new Ft(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Zt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Gl(Vs),this.copyPass.material.blending=ni,this.timer=new Gr}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}xo!==void 0&&(o instanceof xo?n=!0:o instanceof kl&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new ne);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Wl=class extends xn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new me}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}};var m2={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new me(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var Ws=class i extends xn{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new ne(e.x,e.y):new ne(256,256),this.clearColor=new me(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Ft(r,o,{type:Zt,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let d=new Ft(r,o,{type:Zt,depthBuffer:!1});d.texture.name="UnrealBloomPass.h"+h,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let u=new Ft(r,o,{type:Zt,depthBuffer:!1});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),o=Math.round(o/2)}let a=m2;this.highPassUniforms=Sn.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ct({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new ne(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Sn.clone(Vs.uniforms),this.blendMaterial=new Ct({uniforms:this.copyUniforms,vertexShader:Vs.vertexShader,fragmentShader:Vs.fragmentShader,premultipliedAlpha:!0,blending:Ot,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new me,this._oldClearAlpha=1,this._basic=new Ve,this._fsQuad=new Ti(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new ne(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let o=0;o<e;o++)t.push(.39894*Math.exp(-.5*o*o/(n*n))/n);let s=[],r=[];for(let o=1;o<e;o+=2){let a=t[o],l=o+1<e?t[o+1]:0,c=a+l;s.push((o*a+(o+1)*l)/c),r.push(c)}return new Ct({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new ne(.5,.5)},direction:{value:new ne(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new Ct({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}};Ws.BlurDirectionX=new ne(1,0);Ws.BlurDirectionY=new ne(0,1);var yo={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var Xl=class extends xn{constructor(){super(),this.isOutputPass=!0,this.uniforms=Sn.clone(yo.uniforms),this.material=new Cs({name:yo.name,uniforms:this.uniforms,vertexShader:yo.vertexShader,fragmentShader:yo.fragmentShader}),this._fsQuad=new Ti(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},rt.getTransfer(this._outputColorSpace)===pt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Yr?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===qr?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Zr?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Hi?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===$r?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Kr?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Jr&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};function g2(i,e,t){let n=new Vl(i);n.addPass(new Wl(e,t));let s=new Ws(new ne(window.innerWidth,window.innerHeight),.9,.5,.55);return n.addPass(s),n.addPass(new Xl),n}var _2={type:"change"},Bc={type:"start"},y2={type:"end"},Yl=new jn,x2=new pn,M8=Math.cos(70*wl.DEG2RAD),Gt=new L,hn=2*Math.PI,gt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Fc=1e-6,ql=class extends Wr{constructor(e,t=null){super(e,t),this.state=gt.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:xi.ROTATE,MIDDLE:xi.DOLLY,RIGHT:xi.PAN},this.touches={ONE:yi.ROTATE,TWO:yi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new mn,this._lastTargetPosition=new L,this._quat=new mn().setFromUnitVectors(e.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Is,this._sphericalDelta=new Is,this._scale=1,this._panOffset=new L,this._rotateStart=new ne,this._rotateEnd=new ne,this._rotateDelta=new ne,this._panStart=new ne,this._panEnd=new ne,this._panDelta=new ne,this._dollyStart=new ne,this._dollyEnd=new ne,this._dollyDelta=new ne,this._dollyDirection=new L,this._mouse=new ne,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=S8.bind(this),this._onPointerDown=b8.bind(this),this._onPointerUp=E8.bind(this),this._onContextMenu=I8.bind(this),this._onMouseWheel=A8.bind(this),this._onKeyDown=R8.bind(this),this._onTouchStart=C8.bind(this),this._onTouchMove=P8.bind(this),this._onMouseDown=T8.bind(this),this._onMouseMove=w8.bind(this),this._interceptControlDown=L8.bind(this),this._interceptControlUp=D8.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=gt.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(_2),this.update(),this.state=gt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;Gt.copy(t).sub(this.target),Gt.applyQuaternion(this._quat),this._spherical.setFromVector3(Gt),this.autoRotate&&this.state===gt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=hn:n>Math.PI&&(n-=hn),s<-Math.PI?s+=hn:s>Math.PI&&(s-=hn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Gt.setFromSpherical(this._spherical),Gt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Gt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Gt.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new L(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new L(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Gt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Yl.origin.copy(this.object.position),Yl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Yl.direction))<M8?this.object.lookAt(this.target):(x2.setFromNormalAndCoplanarPoint(this.object.up,this.target),Yl.intersectPlane(x2,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Fc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Fc||this._lastTargetPosition.distanceToSquared(this.target)>Fc?(this.dispatchEvent(_2),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?hn/60*this.autoRotateSpeed*e:hn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Gt.setFromMatrixColumn(t,0),Gt.multiplyScalar(-e),this._panOffset.add(Gt)}_panUp(e,t){this.screenSpacePanning===!0?Gt.setFromMatrixColumn(t,1):(Gt.setFromMatrixColumn(t,0),Gt.crossVectors(this.object.up,Gt)),Gt.multiplyScalar(e),this._panOffset.add(Gt)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Gt.copy(s).sub(this.target);let r=Gt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientY),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(hn*this._rotateDelta.x/t.clientHeight),this._rotateUp(hn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(hn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-hn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(hn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-hn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(hn*this._rotateDelta.x/t.clientHeight),this._rotateUp(hn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ne,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function b8(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function S8(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function E8(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(y2),this.state=gt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function T8(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case xi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=gt.DOLLY;break;case xi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=gt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=gt.ROTATE}break;case xi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=gt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=gt.PAN}break;default:this.state=gt.NONE}this.state!==gt.NONE&&this.dispatchEvent(Bc)}function w8(i){switch(this.state){case gt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case gt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case gt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function A8(i){this.enabled===!1||this.enableZoom===!1||this.state!==gt.NONE||(i.preventDefault(),this.dispatchEvent(Bc),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(y2))}function R8(i){this.enabled!==!1&&this._handleKeyDown(i)}function C8(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case yi.ROTATE:if(this.enableRotate===!1){this.state=gt.NONE;break}this._handleTouchStartRotate(i),this.state=gt.TOUCH_ROTATE;break;case yi.PAN:if(this.enablePan===!1){this.state=gt.NONE;break}this._handleTouchStartPan(i),this.state=gt.TOUCH_PAN;break;default:this.state=gt.NONE}break;case 2:switch(this.touches.TWO){case yi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=gt.TOUCH_DOLLY_PAN;break;case yi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=gt.TOUCH_DOLLY_ROTATE;break;default:this.state=gt.NONE}break;default:this.state=gt.NONE}this.state!==gt.NONE&&this.dispatchEvent(Bc)}function P8(i){switch(this._trackPointer(i),this.state){case gt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case gt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case gt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case gt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=gt.NONE}}function I8(i){this.enabled!==!1&&i.preventDefault()}function L8(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function D8(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Zl=class{constructor(e,t,n){this.tween=0;this.fromPos=new L;this.fromTarget=new L;this.toPos=new L;this.toTarget=new L;this.currentLevel="L0";this.onLevelChange=null;this.camera=e,this.plan=n,this.controls=new ql(e,t),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.minDistance=4,this.controls.maxDistance=3600,this.controls.maxPolarAngle=Math.PI*.485,this.controls.target.set(0,12,0);try{let s=localStorage.getItem("cityweb.cam");if(s){let r=JSON.parse(s);r.p&&r.t&&(e.position.fromArray(r.p),this.controls.target.fromArray(r.t))}else this.applyLevel(0,!1)}catch{this.applyLevel(0,!1)}}levels(){let e=[{name:"L0 \u603B\u89C8",pos:new L(240,1750,2150),target:new L(180,90,0)}];for(let t of this.plan.districts){let n=new L(t.cx,0,t.cz).normalize();e.push({name:`L1 ${t.name}`,pos:new L(t.cx-n.x*640,700,t.cz-n.z*640),target:new L(t.cx,90,t.cz)})}return e}applyLevel(e,t){var o;let n=this.levels(),s=Yi(e,0,n.length-1),r=n[s];if(this.currentLevel=s===0?"L0":`L1\xB7${this.plan.districts[s-1].name}`,(o=this.onLevelChange)==null||o.call(this,this.currentLevel),!t){this.camera.position.copy(r.pos),this.controls.target.copy(r.target),this.controls.update();return}this.fromPos.copy(this.camera.position),this.fromTarget.copy(this.controls.target),this.toPos.copy(r.pos),this.toTarget.copy(r.target),this.tween=1e-4}update(e){if(this.tween>0){this.tween=Math.min(1,this.tween+e/1.4);let t=xd(this.tween);this.camera.position.lerpVectors(this.fromPos,this.toPos,t),this.controls.target.lerpVectors(this.fromTarget,this.toTarget,t),this.tween>=1&&(this.tween=0)}this.controls.update()}persist(){try{localStorage.setItem("cityweb.cam",JSON.stringify({p:this.camera.position.toArray(),t:this.controls.target.toArray()}))}catch{}}focusDistrictAt(e){let t=-1,n=1/0;this.plan.districts.forEach((s,r)=>{let o=Math.hypot(e.x-s.cx,e.z-s.cz);o<n&&(n=o,t=r)}),t>=0&&n<900&&this.applyLevel(t+1,!0)}applyStreet(e,t=6.5,n=1.95){var h;this.fromPos.copy(this.camera.position),this.fromTarget.copy(this.controls.target);let s=0,r=0,o=1/0;for(let d of this.plan.districts){let u=Math.hypot(e.x-d.cx,e.z-d.cz);u<o&&(o=u,s=d.cx,r=d.cz)}let a=e.x-s,l=e.z-r,c=Math.hypot(a,l)||1;a/=c,l/=c,this.toPos.set(e.x+a*t,n,e.z+l*t),this.toTarget.set(e.x,1.8,e.z),this.tween=1e-4,(h=this.onLevelChange)==null||h.call(this,"L2 \u8857\u666F")}};var Jl=.38,v2=1.62,M2=3.1,b2=6.4,zc=4.4,N8=2.05;function S2(i,e,t){var b;let n=i.buildings.map(x=>({x0:x.x-x.w/2-Jl,x1:x.x+x.w/2+Jl,z0:x.z-x.d/2-Jl,z1:x.z+x.d/2+Jl})),s=(b=i.districts[0])!=null?b:{cx:0,cz:0},r=new L(s.cx+24,0,s.cz+24),o=Math.PI,a=-.06,l=!1,c=new Set,h=[],d=0,u=(x,T)=>{for(let w=0;w<n.length;w++){let g=n[w];if(x>g.x0&&x<g.x1&&T>g.z0&&T<g.z1)return!0}return!1},f=(x,T)=>{x!==0&&!u(r.x+x,r.z)&&(r.x+=x),T!==0&&!u(r.x,r.z+T)&&(r.z+=T)},p=(x,T)=>{if(!l)return;let w=x.key.toLowerCase();("wasd".includes(w)||w==="shift")&&(T?c.add(w):c.delete(w),x.preventDefault())};window.addEventListener("keydown",x=>{if(x.key.toLowerCase()==="p"&&!x.repeat){y();return}p(x,!0)}),window.addEventListener("keyup",x=>p(x,!1)),window.addEventListener("blur",()=>c.clear()),t.addEventListener("click",()=>{var x;l&&((x=t.requestPointerLock)==null||x.call(t))}),window.addEventListener("mousemove",x=>{!l||document.pointerLockElement!==t||(o-=x.movementX*.0026,a=Math.max(-.55,Math.min(.5,a-x.movementY*.0022)))});let y=x=>{var T;l=typeof x=="boolean"?x:!l,l||(c.clear(),document.pointerLockElement===t&&((T=document.exitPointerLock)==null||T.call(document))),window.__PLAYER__=v},v={update:x=>{if(!l)return;let T=(c.has("shift")?b2:M2)*x,w=0,g=0;if(c.has("w")&&(w+=1),c.has("s")&&(w-=1),c.has("a")&&(g-=1),c.has("d")&&(g+=1),w||g){let A=Math.hypot(w,g)||1,I=Math.sin(o),N=Math.cos(o),O=(-I*w+N*g)/A*T,R=(-N*w-I*g)/A*T;f(O,R)}d+=x,d>=.5&&(d=0,h.push([Math.round(r.x*10)/10,Math.round(r.z*10)/10,Date.now()]),h.length>2e3&&h.shift());let M=r.x+Math.sin(o)*zc,C=r.z+Math.cos(o)*zc;e.position.set(M,v2+N8+Math.sin(a)*zc*.6,C),e.lookAt(r.x,v2+.35,r.z)},toggle:y,isOn:()=>l,state:()=>({x:Math.round(r.x*100)/100,z:Math.round(r.z*100)/100,yaw:Math.round(o*1e3)/1e3,pitch:Math.round(a*1e3)/1e3,speed:c.has("shift")?b2:M2,on:l}),trace:()=>h.slice(),blockedAt:(x,T)=>u(x,T)};return v}function E2(i,e){let t=[],n={},s={world:0,sim:1,live:2,play:3,ui:4};return{plan:i,data:e,add(r){if(t.some(o=>o.sys.id===r.id))throw new Error("system id duplicated: "+r.id);t.push({sys:r,acc:0}),t.sort((o,a)=>{var h,d;let l=s[o.sys.layer],c=s[a.sys.layer];return l!==c?l-c:((h=o.sys.order)!=null?h:100)-((d=a.sys.order)!=null?d:100)})},tick({dt:r,elapsed:o,hour:a,fps:l}){var c,h,d;for(let u of Object.keys(n))n[u]=0;for(let u of t){let f=(c=u.sys.hz)!=null?c:0;if(f<=0){u.sys.update({dt:r,elapsed:o,hour:a,fps:l}),n[u.sys.layer]=((h=n[u.sys.layer])!=null?h:0)+1;continue}u.acc+=r;let p=1/f;if(u.acc>=p){let y=u.acc;u.acc=0,u.sys.update({dt:y,elapsed:o,hour:a,fps:l}),n[u.sys.layer]=((d=n[u.sys.layer])!=null?d:0)+1}}},stats:()=>({...n}),systems:()=>t.map(r=>r.sys)}}var U8=`
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
`;function T2(i){var x,T,w,g,M,C,A,I,N,O;let e=document.createElement("style");e.textContent=U8,document.head.appendChild(e);let t=document.createElement("div");t.id="cw-hud";let n=R=>R==="gaming"?"#5eead4":R==="quant"?"#fbbf24":R==="media"?"#f472b6":"#60a5fa",s=document.createElement("div");s.className="panel",s.id="cw-tl";let r=(x=i.city)!=null?x:{};s.innerHTML=`
<div id="cw-h1">\u7845\u57FA\u57CE\u5E02 <b>FLUX VERSE</b></div>
<div id="cw-sub">\u57CE\u5373\u8D85\u4F53 \xB7 \u96C6\u56E2\u5B9E\u65F6\u955C\u50CF \xB7 three.js</div>
<div><span id="cw-clock">--:--:--</span><span id="cw-phase"></span></div>
<div id="cw-weather"></div>
<div id="cw-stats">
  <div class="st"><div class="n" id="cw-res">${((T=i.census_total)!=null?T:0).toLocaleString()}</div><div class="l">\u7845\u57FA\u5C45\u6C11</div></div>
  <div class="st"><div class="n" id="cw-games">${(w=r.games_total)!=null?w:"-"}<span style="font-size:10px;color:#5eead4"> \xB7 ${(g=r.games_active)!=null?g:"-"} \u6D3B</span></div><div class="l">\u6E38\u620F / \u5728\u4EA7</div></div>
  <div class="st"><div class="n" id="cw-commits">${((M=r.commits_total)!=null?M:0).toLocaleString()}</div><div class="l">\u7D2F\u8BA1\u63D0\u4EA4</div></div>
  <div class="st"><div class="n" id="cw-fleetn">${(C=r.fleet_online)!=null?C:0}/${i.fleet.length}</div><div class="l">\u673A\u961F\u5728\u7EBF</div></div>
</div>
<div id="cw-zones"></div>
<div id="cw-fleet"></div>`,t.appendChild(s);let o=i.reality,a=s.querySelector("#cw-weather"),l={clear:"\u6674",cloud:"\u591A\u4E91",rain:"\u96E8",snow:"\u96EA",wind:"\u98CE"};a.textContent=`\u4E0A\u6D77 ${(A=l[o.weather_kind])!=null?A:o.weather_kind} ${o.weather_temp_c}\xB0C \xB7 ${o.season==="autumn"?"\u79CB":o.season==="winter"?"\u51AC":o.season==="spring"?"\u6625":"\u590F"}`;let c=s.querySelector("#cw-zones"),h={active:"\u6D3B\u8DC3",dormant:"\u4F11\u7720"};for(let R of i.zones){let U=document.createElement("div");U.className="z";let H=Math.max(0,Math.min(1,R.activity));U.innerHTML=`<div class="zl"><span>${R.name} \xB7 ${(I=h[R.status])!=null?I:R.status}</span><span>${(H*100).toFixed(0)}%</span></div>
<div class="zb"><div class="zf" style="width:${(H*100).toFixed(0)}%;background:${n(R.id)}"></div></div>`,c.appendChild(U)}let d=s.querySelector("#cw-fleet");for(let R of i.fleet){if(R.cores<=0)continue;let U=document.createElement("div");U.className="m";let H=((N=R.current_task)!=null?N:"").substring(0,26);U.innerHTML=`<span class="dot" style="background:${R.online?"#4ade80":"#39485e"}"></span>
<span style="color:#93a4ba">${R.id}</span><span style="color:#5a6c84;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${H}</span>`,d.appendChild(U)}let u=document.createElement("div");u.className="panel",u.id="cw-tr",u.innerHTML='<h3>\u4E8B\u4EF6\u6D41 \xB7 \u771F\u5B9E\u4E8B\u4EF6\u56DE\u653E</h3><div id="cw-events"></div>',t.appendChild(u);let f=u.querySelector("#cw-events"),p=[],y=document.createElement("div");y.id="cw-bb",y.innerHTML=`\u62D6\u62FD\u65CB\u8F6C \xB7 \u6EDA\u8F6E\u7F29\u653E \xB7 <b>0</b> \u603B\u89C8 \xB7 <b>1/2/3</b> \u4E09\u57CE \xB7 \u70B9\u51FB\u57CE\u533A\u805A\u7126 \xB7 \u6570\u636E\u65F6\u70B9 <b>${vd((O=i.reality.beijing_hhmm)!=null?O:"")}</b>${ho()?"":" \xB7 <span style='color:#f87171'>\u6F14\u793A\u6570\u636E</span>"}`,t.appendChild(y);let _=document.createElement("div");_.id="cw-cam",_.textContent="L0 \u603B\u89C8",t.appendChild(_);let m=document.createElement("div");if(m.id="cw-resident",m.style.cssText="position:absolute;left:14px;bottom:46px;max-width:420px;display:none;background:rgba(9,14,26,.9);border:1px solid #2a3f63;border-radius:10px;padding:10px 13px;font-size:12.5px;line-height:1.6;color:#dbe7f7",t.appendChild(m),y.innerHTML+=" \xB7 <b>R</b> \u5C45\u6C11\u8857\u666F",!ho()){let R=document.createElement("div");R.id="cw-demo",R.textContent="DEMO DATA \xB7 \u672A\u7ECF\u6570\u636E\u5BFC\u51FA",t.appendChild(R)}document.body.appendChild(t);let v=s.querySelector("#cw-clock"),b=s.querySelector("#cw-phase");return{root:t,setClock(R,U){v.textContent=yd(R),b.textContent=`${U} \xB7 \u5317\u4EAC\u65F6\u95F4`},ticker(R){var z,V;let U=document.createElement("div");U.className="ev";let H=R.ts_utc?R.ts_utc.substring(11,16):"--:--";for(U.innerHTML=`<span class="ts">${H}</span><span class="ty cwf-${(z=R.zone)!=null?z:"governance"}">${R.type}</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#71829b">${((V=R.summary)!=null?V:"").substring(0,40)}</span>`,f.insertBefore(U,f.firstChild),p.push(U);p.length>7;){let G=p.shift();G==null||G.remove()}},setCam(R){_.textContent=R}}}function O8(i,e,t,n,s=1){let{x:r,z:o}=ld({lat:e,lon:t});i.root.position.set(r,0,o),i.root.rotation.y=n,i.root.scale.setScalar(s)}function F8(){var Z;let i=rd(),e=document.getElementById("app"),t=new Pl({antialias:!0,powerPreference:"high-performance"});t.setPixelRatio(Math.min(window.devicePixelRatio,2)),t.setSize(window.innerWidth,window.innerHeight),t.shadowMap.enabled=!0,t.shadowMap.type=Fa,t.toneMapping=Hi,t.toneMappingExposure=1.05,e.appendChild(t.domElement);let n=new mr,s=new sn(48,window.innerWidth/window.innerHeight,2,9e3);s.position.set(0,1600,1900);let r=new Hr(16773852,2.2);r.castShadow=!0,r.shadow.mapSize.set(2048,2048),r.shadow.camera.left=-1500,r.shadow.camera.right=1500,r.shadow.camera.top=1500,r.shadow.camera.bottom=-1500,r.shadow.camera.far=4200,r.shadow.bias=-6e-4,n.add(r);let o=new Br(9085120,2765378,.8);n.add(o);let a=Xd();n.add(a.mesh),n.add(a.stars);let l=new se(new wr(3600,64),new at({color:395794,roughness:.96,metalness:0}));l.rotation.x=-Math.PI/2,l.receiveShadow=!0,n.add(l);let c=md(i);n.add(c.root);let h=c.plan,d=gd();d.root.position.set(c.islandPos.x,9,c.islandPos.z),d.root.scale.setScalar(2.6),n.add(d.root);let u=c.landmarkSlots,f=[],p=(k,re)=>{O8(k,re.lat,re.lon,re.rotY),n.add(k.root),f.push(k)};p(Id(),u.pearl),p(Ld(),u.jinmao),p(Fd(),u.shanghaiTower),p(zd(),u.swfc),p(Vd(),u.whiteMagnolia),p(Wd(),u.waibaidu);let y=_d(h);n.add(y.root);let _=Md(i);_.root.position.set(c.islandPos.x,0,c.islandPos.z),n.add(_.root);let m=Sd(h,i);n.add(m.root);let v=Jd(h);n.add(v.root);let b=jd(h);n.add(b.root);let x=e2();n.add(x.root);let T=a2();n.add(T.root);let w=u2(i);n.add(w.root);let g=p2(h,i);n.add(g.root);let M=Yd(h,i);n.add(M.points);let C=g2(t,n,s),A=T2(i),I=new Zl(s,t.domElement,h);I.onLevelChange=k=>A.setCam(k);let N=S2(h,s,t.domElement);new URLSearchParams(location.search).get("play")&&N.toggle(!0),window.__CITY_PLAYER__=N;let O=E2(h,i);O.add({id:"daynight",layer:"live",hz:2,order:10,update:()=>R.update()}),O.add({id:"weather",layer:"live",order:20,update:k=>w.update(k.dt,k.elapsed)}),O.add({id:"traffic",layer:"live",hz:30,order:30,update:k=>v.update(k.dt,k.elapsed)}),O.add({id:"pedestrians",layer:"live",hz:30,order:40,update:k=>g.update(k.dt,k.elapsed,k.hour)}),O.add({id:"vehicles",layer:"live",hz:30,order:50,update:k=>b.update(k.dt,k.elapsed,k.hour)}),O.add({id:"residents",layer:"sim",hz:30,order:10,update:k=>m.update(k.dt,k.elapsed)}),O.add({id:"robots",layer:"world",order:10,update:k=>_.update(k.dt,k.elapsed)}),O.add({id:"messengers",layer:"live",order:60,update:k=>U.update(k.elapsed)}),O.add({id:"rooftops",layer:"world",hz:2,order:20,update:k=>x.update(k.dt,k.elapsed)}),O.add({id:"river",layer:"live",order:70,update:k=>T.update(k.dt,k.elapsed)}),O.add({id:"landmarks",layer:"world",order:30,update:k=>{for(let re of f)re.update(k.dt,k.elapsed)}}),O.add({id:"player",layer:"play",order:10,update:k=>N.update(k.dt)}),window.__CITY_WORLD__=O;let R=new Bl(n,r,o,a,i);R.attachMaterials(null,l.material),R.realMats=c.bodyMats,R.waterMat=c.waterMat;for(let k of c.flowMats)R.flowMats.push(k);R.dustMat=M.mat;let U=new zl(n,h,d,R,(Z=i.events_tail)!=null?Z:[]);U.hooks.onEvent=k=>{A.ticker(k),k.type==="TRANSFER"&&v.pushEvent(k)},window.addEventListener("keydown",k=>{k.key==="0"&&I.applyLevel(0,!0),k.key==="1"&&I.applyLevel(1,!0),k.key==="2"&&I.applyLevel(2,!0),k.key==="3"&&I.applyLevel(3,!0)});let H=0,z=0;t.domElement.addEventListener("pointerdown",k=>{H=k.clientX,z=k.clientY}),t.domElement.addEventListener("pointerup",k=>{if(Math.hypot(k.clientX-H,k.clientY-z)>6)return;let re=new ne(k.clientX/window.innerWidth*2-1,-(k.clientY/window.innerHeight)*2+1),Se=new kr;Se.setFromCamera(re,s);let ae=-Se.ray.origin.y/Se.ray.direction.y;if(ae>0){let Re=Se.ray.origin.clone().add(Se.ray.direction.clone().multiplyScalar(ae));I.focusDistrictAt(Re)}}),window.addEventListener("resize",()=>{s.aspect=window.innerWidth/window.innerHeight,s.updateProjectionMatrix(),t.setSize(window.innerWidth,window.innerHeight),C.setSize(window.innerWidth,window.innerHeight)});let V=()=>A.setClock(new Date,R.label());V(),window.setInterval(V,1e3),window.setInterval(()=>{I.persist(),location.reload()},600*1e3),window.setInterval(()=>I.persist(),3e4),window.addEventListener("beforeunload",()=>I.persist());let G=new Vr;window.__cwCamera=s;let K=-1,W=k=>{let re=m.anchors;if(!re.length)return;K=typeof k=="number"?(k%re.length+re.length)%re.length:(K+1)%re.length;let Se=re[K];m.setLabels(!1),I.applyStreet(Se.pos),A.setCam(`\u5C45\u6C11 ${K+1}/${re.length} \xB7 ${Se.name}`);let ae=document.getElementById("cw-resident");ae&&(ae.innerHTML=`<b>${Se.name}</b>\u3000<span style="color:#8aa0c4">${Se.profession}</span><br><span style="color:#dbe7f7">${(Se.ring||"\uFF08\u4ECA\u65E5\u6682\u65E0\u5E74\u8F6E\uFF09").slice(0,90)}</span>`,ae.style.display="block")};window.__CITY_STREET__=W,window.addEventListener("keydown",k=>{(k.key==="r"||k.key==="R")&&W()});let oe=60;function ue(){requestAnimationFrame(ue);let k=Math.min(.1,G.getDelta()),re=G.elapsedTime;oe=oe*.9+1/Math.max(k,1e-4)*.1,O.tick({dt:k,elapsed:re,hour:R.hour(),fps:oe}),N.isOn()||I.update(k),C.render()}ue(),console.log(`[CityWeb] real-geography city: footprints=${c.buildingCount} live=${ho()}`)}F8();})();
