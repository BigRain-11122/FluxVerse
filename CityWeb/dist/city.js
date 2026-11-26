"use strict";(()=>{var Di={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Ni={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},ku=0,_1=1,Vu=2;var fo=1,ll=2,Js=3,Zn=0,Wt=1,Dt=2,pi=0,$s=1,$e=2,x1=3,y1=4,Wu=5;var is=100,Xu=101,Yu=102,qu=103,Zu=104,Ku=200,Ju=201,$u=202,ju=203,v1=204,M1=205,Qu=206,ed=207,td=208,nd=209,id=210,sd=211,rd=212,od=213,ad=214,wa=0,Ra=1,Aa=2,Ns=3,Ca=4,Pa=5,Ia=6,La=7,cl=0,ld=1,cd=2,Kn=0,po=1,mo=2,go=3,ss=4,_o=5,xo=6,yo=7;var E1=300,rs=301,js=302,hl=303,ul=304,Ji=1e3,Vn=1001,Da=1002,jt=1003,hd=1004;var vo=1005;var pn=1006,dl=1007;var mi=1008;var _n=1009,b1=1010,S1=1011,Qs=1012,fl=1013,Bn=1014,In=1015,Xt=1016,pl=1017,ml=1018,os=1020,T1=35902,w1=35899,R1=1021,A1=1022,Hn=1023,ai=1026,gi=1027,gl=1028,_l=1029,Ui=1030,xl=1031;var yl=1033,Mo=33776,Eo=33777,bo=33778,So=33779,vl=35840,Ml=35841,El=35842,bl=35843,Sl=36196,Tl=37492,wl=37496,Rl=37488,Al=37489,To=37490,Cl=37491,Pl=37808,Il=37809,Ll=37810,Dl=37811,Nl=37812,Ul=37813,Ol=37814,Fl=37815,Bl=37816,Hl=37817,zl=37818,Gl=37819,kl=37820,Vl=37821,Wl=36492,Xl=36494,Yl=36495,ql=36283,Zl=36284,wo=36285,Kl=36286;var Pr=2300,Na=2301,Sa=2302,r1=2303,o1=2400,a1=2401,l1=2402;var ud=3200;var Ro=0,dd=1,_i="",Mn="srgb",Ir="srgb-linear",Lr="linear",Et="srgb";var Ta=7680;var fd=519,pd=512,md=513,gd=514,C1=515,_d=516,xd=517,P1=518,I1=519,L1=35044,zn=35048;var D1="300 es",An=2e3,Us=2001;function x3(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function y3(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Dr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function yd(){let i=Dr("canvas");return i.style.display="block",i}var tu={},Os=null;function Nr(...i){let e="THREE."+i.shift();Os?Os("log",e,...i):console.log(e,...i)}function vd(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ze(...i){i=vd(i);let e="THREE."+i.shift();if(Os)Os("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ke(...i){i=vd(i);let e="THREE."+i.shift();if(Os)Os("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Tr(...i){let e=i.join(" ");e in tu||(tu[e]=!0,Ze(...i))}function Md(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Ed={[wa]:wa,[Aa]:Ia,[Ca]:Ca,[Ns]:Pa,[Ra]:Ra,[Ia]:Aa,[La]:La,[Pa]:Ns},Fn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},an=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],nu=1234567,wr=Math.PI/180,Fs=180/Math.PI;function xi(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(an[i&255]+an[i>>8&255]+an[i>>16&255]+an[i>>24&255]+"-"+an[e&255]+an[e>>8&255]+"-"+an[e>>16&15|64]+an[e>>24&255]+"-"+an[t&63|128]+an[t>>8&255]+"-"+an[t>>16&255]+an[t>>24&255]+an[n&255]+an[n>>8&255]+an[n>>16&255]+an[n>>24&255]).toLowerCase()}function ut(i,e,t){return Math.max(e,Math.min(t,i))}function N1(i,e){return(i%e+e)%e}function v3(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function M3(i,e,t){return i!==e?(t-i)/(e-i):0}function Rr(i,e,t){return(1-t)*i+t*e}function E3(i,e,t,n){return Rr(i,e,1-Math.exp(-t*n))}function b3(i,e=1){return e-Math.abs(N1(i,e*2)-e)}function S3(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function T3(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function w3(i,e){return i+Math.floor(Math.random()*(e-i+1))}function R3(i,e){return i+Math.random()*(e-i)}function A3(i){return i*(.5-Math.random())}function C3(i){i!==void 0&&(nu=i);let e=nu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function P3(i){return i*wr}function I3(i){return i*Fs}function L3(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function D3(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function U1(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function N3(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),p=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*p,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*p,a*c);break;case"ZYZ":i.set(l*p,l*f,a*h,a*c);break;default:Ze("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Jl(i){switch(i.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function O1(i,e){if(e.constructor===Float32Array)return i;let t=Jl(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(i/t,-1)}function F1(i,e){if(e.constructor===Float32Array)return i;let t=Jl(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(i*t)}var as={DEG2RAD:wr,RAD2DEG:Fs,generateUUID:xi,clamp:ut,euclideanModulo:N1,mapLinear:v3,inverseLerp:M3,lerp:Rr,damp:E3,pingpong:b3,smoothstep:S3,smootherstep:T3,randInt:w3,randFloat:R3,randFloatSpread:A3,seededRandom:C3,degToRad:P3,radToDeg:I3,isPowerOfTwo:L3,ceilPowerOfTwo:D3,floorPowerOfTwo:U1,setQuaternionFromProperEuler:N3,normalize:F1,denormalize:O1},V1=class V1{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ut(this.x,e.x,t.x),this.y=ut(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ut(this.x,e,t),this.y=ut(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ut(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ut(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};V1.prototype.isVector2=!0;var te=V1,Vt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],f=r[o+1],p=r[o+2],_=r[o+3];if(u!==_||l!==d||c!==f||h!==p){let g=l*d+c*f+h*p+u*_;g<0&&(d=-d,f=-f,p=-p,_=-_,g=-g);let m=1-a;if(g<.9995){let v=Math.acos(g),E=Math.sin(v);m=Math.sin(m*v)/E,a=Math.sin(a*v)/E,l=l*m+d*a,c=c*m+f*a,h=h*m+p*a,u=u*m+_*a}else{l=l*m+d*a,c=c*m+f*a,h=h*m+p*a,u=u*m+_*a;let v=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=v,c*=v,h*=v,u*=v}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],p=r[o+3];return e[t]=a*p+h*u+l*f-c*d,e[t+1]=l*p+h*d+c*u-a*f,e[t+2]=c*p+h*f+a*d-l*u,e[t+3]=h*p-a*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),f=l(s/2),p=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"YZX":this._x=d*h*u+c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u-d*f*p;break;case"XZY":this._x=d*h*u-c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u+d*f*p;break;default:Ze("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ut(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-t;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},W1=class W1{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(iu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(iu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ut(this.x,e.x,t.x),this.y=ut(this.y,e.y,t.y),this.z=ut(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ut(this.x,e,t),this.y=ut(this.y,e,t),this.z=ut(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ut(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Nc.copy(this).projectOnVector(e),this.sub(Nc)}reflect(e){return this.sub(Nc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ut(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};W1.prototype.isVector3=!0;var P=W1,Nc=new P,iu=new Vt,X1=class X1{constructor(e,t,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],_=s[0],g=s[3],m=s[6],v=s[1],E=s[4],y=s[7],S=s[2],b=s[5],x=s[8];return r[0]=o*_+a*v+l*S,r[3]=o*g+a*E+l*b,r[6]=o*m+a*y+l*x,r[1]=c*_+h*v+u*S,r[4]=c*g+h*E+u*b,r[7]=c*m+h*y+u*x,r[2]=d*_+f*v+p*S,r[5]=d*g+f*E+p*b,r[8]=d*m+f*y+p*x,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,p=t*u+n*d+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/p;return e[0]=u*_,e[1]=(s*c-h*n)*_,e[2]=(a*n-s*o)*_,e[3]=d*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-a*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return Tr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Uc.makeScale(e,t)),this}rotate(e){return Tr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Uc.makeRotation(-e)),this}translate(e,t){return Tr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Uc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};X1.prototype.isMatrix3=!0;var tt=X1,Uc=new tt,su=new tt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ru=new tt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function U3(){let i={enabled:!0,workingColorSpace:Ir,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Et&&(s.r=oi(s.r),s.g=oi(s.g),s.b=oi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Et&&(s.r=Ds(s.r),s.g=Ds(s.g),s.b=Ds(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===_i?Lr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[o].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ir]:{primaries:e,whitePoint:n,transfer:Lr,toXYZ:su,fromXYZ:ru,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Mn},outputColorSpaceConfig:{drawingBufferColorSpace:Mn}},[Mn]:{primaries:e,whitePoint:n,transfer:Et,toXYZ:su,fromXYZ:ru,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Mn}}}),i}var ft=U3();function oi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ds(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var ms,Ua=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ms===void 0&&(ms=Dr("canvas")),ms.width=e.width,ms.height=e.height;let s=ms.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=ms}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=Dr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=oi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(oi(t[n]/255)*255):t[n]=oi(t[n]);return{data:t,width:e.width,height:e.height}}else return Ze("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},O3=0,Bs=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:O3++}),this.uuid=xi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement!="undefined"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame!="undefined"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Oc(s[o].image)):r.push(Oc(s[o]))}else r=Oc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Oc(i){return typeof HTMLImageElement!="undefined"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&i instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&i instanceof ImageBitmap?Ua.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ze("Texture: Unable to serialize Texture."),{})}var F3=0,Fc=new P,mn=class i extends Fn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Vn,s=Vn,r=pn,o=mi,a=Hn,l=_n,c=i.DEFAULT_ANISOTROPY,h=_i){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:F3++}),this.uuid=xi(),this.name="",this.source=new Bs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new te(0,0),this.repeat=new te(1,1),this.center=new te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Fc).x}get height(){return this.source.getSize(Fc).y}get depth(){return this.source.getSize(Fc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ze(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ze(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==E1)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ji:e.x=e.x-Math.floor(e.x);break;case Vn:e.x=e.x<0?0:1;break;case Da:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ji:e.y=e.y-Math.floor(e.y);break;case Vn:e.y=e.y<0?0:1;break;case Da:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};mn.DEFAULT_IMAGE=null;mn.DEFAULT_MAPPING=E1;mn.DEFAULT_ANISOTROPY=1;var Y1=class Y1{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],p=l[9],_=l[2],g=l[6],m=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let E=(c+1)/2,y=(f+1)/2,S=(m+1)/2,b=(h+d)/4,x=(u+_)/4,M=(p+g)/4;return E>y&&E>S?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=b/n,r=x/n):y>S?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=b/s,r=M/s):S<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),n=x/r,s=M/r),this.set(n,s,r,t),this}let v=Math.sqrt((g-p)*(g-p)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(g-p)/v,this.y=(u-_)/v,this.z=(d-h)/v,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ut(this.x,e.x,t.x),this.y=ut(this.y,e.y,t.y),this.z=ut(this.z,e.z,t.z),this.w=ut(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ut(this.x,e,t),this.y=ut(this.y,e,t),this.z=ut(this.z,e,t),this.w=ut(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ut(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Y1.prototype.isVector4=!0;var Pt=Y1,Oa=class extends Fn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:pn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Pt(0,0,e,t),this.scissorTest=!1,this.viewport=new Pt(0,0,e,t),this.textures=[];let s=n.count;for(let r=0;r<s;r++)this.textures[r]=new mn({width:e,height:t,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:pn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Bs(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},zt=class extends Oa{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ur=class extends mn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=jt,this.minFilter=jt,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Fa=class extends mn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=jt,this.minFilter=jt,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var al=class al{constructor(e,t,n,s,r,o,a,l,c,h,u,d,f,p,_,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,u,d,f,p,_,g)}set(e,t,n,s,r,o,a,l,c,h,u,d,f,p,_,g){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=p,m[11]=_,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new al().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/gs.setFromMatrixColumn(e,0).length(),r=1/gs.setFromMatrixColumn(e,1).length(),o=1/gs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=o*h,f=o*u,p=a*h,_=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+p*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=p+f*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,p=c*h,_=c*u;t[0]=d+_*a,t[4]=p*a-f,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-p,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,p=c*h,_=c*u;t[0]=d-_*a,t[4]=-o*u,t[8]=p+f*a,t[1]=f+p*a,t[5]=o*h,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*h,f=o*u,p=a*h,_=a*u;t[0]=l*h,t[4]=p*c-f,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=f*c-p,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,f=o*c,p=a*l,_=a*c;t[0]=l*h,t[4]=_-d*u,t[8]=p*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*u+p,t[10]=d-_*u}else if(e.order==="XZY"){let d=o*l,f=o*c,p=a*l,_=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=o*h,t[9]=f*u-p,t[2]=p*u-f,t[6]=a*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(B3,e,H3)}lookAt(e,t,n){let s=this.elements;return yn.subVectors(e,t),yn.lengthSq()===0&&(yn.z=1),yn.normalize(),bi.crossVectors(n,yn),bi.lengthSq()===0&&(Math.abs(n.z)===1?yn.x+=1e-4:yn.z+=1e-4,yn.normalize(),bi.crossVectors(n,yn)),bi.normalize(),Zo.crossVectors(yn,bi),s[0]=bi.x,s[4]=Zo.x,s[8]=yn.x,s[1]=bi.y,s[5]=Zo.y,s[9]=yn.y,s[2]=bi.z,s[6]=Zo.z,s[10]=yn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],_=n[6],g=n[10],m=n[14],v=n[3],E=n[7],y=n[11],S=n[15],b=s[0],x=s[4],M=s[8],I=s[12],T=s[1],A=s[5],L=s[9],U=s[13],C=s[2],N=s[6],O=s[10],B=s[14],V=s[3],H=s[7],X=s[11],J=s[15];return r[0]=o*b+a*T+l*C+c*V,r[4]=o*x+a*A+l*N+c*H,r[8]=o*M+a*L+l*O+c*X,r[12]=o*I+a*U+l*B+c*J,r[1]=h*b+u*T+d*C+f*V,r[5]=h*x+u*A+d*N+f*H,r[9]=h*M+u*L+d*O+f*X,r[13]=h*I+u*U+d*B+f*J,r[2]=p*b+_*T+g*C+m*V,r[6]=p*x+_*A+g*N+m*H,r[10]=p*M+_*L+g*O+m*X,r[14]=p*I+_*U+g*B+m*J,r[3]=v*b+E*T+y*C+S*V,r[7]=v*x+E*A+y*N+S*H,r[11]=v*M+E*L+y*O+S*X,r[15]=v*I+E*U+y*B+S*J,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],p=e[3],_=e[7],g=e[11],m=e[15],v=l*f-c*d,E=a*f-c*u,y=a*d-l*u,S=o*f-c*h,b=o*d-l*h,x=o*u-a*h;return t*(_*v-g*E+m*y)-n*(p*v-g*S+m*b)+s*(p*E-_*S+m*x)-r*(p*y-_*b+g*x)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],o=e[5],a=e[9],l=e[2],c=e[6],h=e[10];return t*(o*h-a*c)-n*(r*h-a*l)+s*(r*c-o*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],p=e[12],_=e[13],g=e[14],m=e[15],v=t*a-n*o,E=t*l-s*o,y=t*c-r*o,S=n*l-s*a,b=n*c-r*a,x=s*c-r*l,M=h*_-u*p,I=h*g-d*p,T=h*m-f*p,A=u*g-d*_,L=u*m-f*_,U=d*m-f*g,C=v*U-E*L+y*A+S*T-b*I+x*M;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let N=1/C;return e[0]=(a*U-l*L+c*A)*N,e[1]=(s*L-n*U-r*A)*N,e[2]=(_*x-g*b+m*S)*N,e[3]=(d*b-u*x-f*S)*N,e[4]=(l*T-o*U-c*I)*N,e[5]=(t*U-s*T+r*I)*N,e[6]=(g*y-p*x-m*E)*N,e[7]=(h*x-d*y+f*E)*N,e[8]=(o*L-a*T+c*M)*N,e[9]=(n*T-t*L-r*M)*N,e[10]=(p*b-_*y+m*v)*N,e[11]=(u*y-h*b-f*v)*N,e[12]=(a*I-o*A-l*M)*N,e[13]=(t*A-n*I+s*M)*N,e[14]=(_*E-p*S-g*v)*N,e[15]=(h*S-u*E+d*v)*N,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,p=r*u,_=o*h,g=o*u,m=a*u,v=l*c,E=l*h,y=l*u,S=n.x,b=n.y,x=n.z;return s[0]=(1-(_+m))*S,s[1]=(f+y)*S,s[2]=(p-E)*S,s[3]=0,s[4]=(f-y)*b,s[5]=(1-(d+m))*b,s[6]=(g+v)*b,s[7]=0,s[8]=(p+E)*x,s[9]=(g-v)*x,s[10]=(1-(d+_))*x,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let o=gs.set(s[0],s[1],s[2]).length(),a=gs.set(s[4],s[5],s[6]).length(),l=gs.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Nn.copy(this);let c=1/o,h=1/a,u=1/l;return Nn.elements[0]*=c,Nn.elements[1]*=c,Nn.elements[2]*=c,Nn.elements[4]*=h,Nn.elements[5]*=h,Nn.elements[6]*=h,Nn.elements[8]*=u,Nn.elements[9]*=u,Nn.elements[10]*=u,t.setFromRotationMatrix(Nn),n.x=o,n.y=a,n.z=l,this}makePerspective(e,t,n,s,r,o,a=An,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),p,_;if(l)p=r/(o-r),_=o*r/(o-r);else if(a===An)p=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===Us)p=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=An,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s),p,_;if(l)p=1/(o-r),_=o/(o-r);else if(a===An)p=-2/(o-r),_=-(o+r)/(o-r);else if(a===Us)p=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};al.prototype.isMatrix4=!0;var Xe=al,gs=new P,Nn=new Xe,B3=new P(0,0,0),H3=new P(1,1,1),bi=new P,Zo=new P,yn=new P,ou=new Xe,au=new Vt,Cn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(ut(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ut(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ut(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ut(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ut(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ut(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ze("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ou.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ou,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return au.setFromEuler(this),this.setFromQuaternion(au,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Cn.DEFAULT_ORDER="XYZ";var Hs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},z3=0,lu=new P,_s=new Vt,ei=new Xe,Ko=new P,pr=new P,G3=new P,k3=new Vt,cu=new P(1,0,0),hu=new P(0,1,0),uu=new P(0,0,1),du={type:"added"},V3={type:"removed"},xs={type:"childadded",child:null},Bc={type:"childremoved",child:null},vt=class i extends Fn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:z3++}),this.uuid=xi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new P,t=new Cn,n=new Vt,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Xe},normalMatrix:{value:new tt}}),this.matrix=new Xe,this.matrixWorld=new Xe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Hs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return _s.setFromAxisAngle(e,t),this.quaternion.multiply(_s),this}rotateOnWorldAxis(e,t){return _s.setFromAxisAngle(e,t),this.quaternion.premultiply(_s),this}rotateX(e){return this.rotateOnAxis(cu,e)}rotateY(e){return this.rotateOnAxis(hu,e)}rotateZ(e){return this.rotateOnAxis(uu,e)}translateOnAxis(e,t){return lu.copy(e).applyQuaternion(this.quaternion),this.position.add(lu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(cu,e)}translateY(e){return this.translateOnAxis(hu,e)}translateZ(e){return this.translateOnAxis(uu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ei.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ko.copy(e):Ko.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),pr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ei.lookAt(pr,Ko,this.up):ei.lookAt(Ko,pr,this.up),this.quaternion.setFromRotationMatrix(ei),s&&(ei.extractRotation(s.matrixWorld),_s.setFromRotationMatrix(ei),this.quaternion.premultiply(_s.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ke("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(du),xs.child=e,this.dispatchEvent(xs),xs.child=null):Ke("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(V3),Bc.child=e,this.dispatchEvent(Bc),Bc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ei.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ei.multiply(e.parent.matrixWorld)),e.applyMatrix4(ei),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(du),xs.child=e,this.dispatchEvent(xs),xs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pr,e,G3),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pr,k3,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),p=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};vt.DEFAULT_UP=new P(0,1,0);vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Oe=class extends vt{constructor(){super(),this.isGroup=!0,this.type="Group"}},W3={type:"move"},zs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Oe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Oe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Oe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let g=t.getJointPose(_,n),m=this._getHandJoint(c,_);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.quaternion,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(W3)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Oe;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},bd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Si={h:0,s:0,l:0},Jo={h:0,s:0,l:0};function Hc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var le=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Mn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ft.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=ft.workingColorSpace){return this.r=e,this.g=t,this.b=n,ft.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=ft.workingColorSpace){if(e=N1(e,1),t=ut(t,0,1),n=ut(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Hc(o,r,e+1/3),this.g=Hc(o,r,e),this.b=Hc(o,r,e-1/3)}return ft.colorSpaceToWorking(this,s),this}setStyle(e,t=Mn){function n(r){r!==void 0&&parseFloat(r)<1&&Ze("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ze("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Ze("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Mn){let n=bd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ze("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=oi(e.r),this.g=oi(e.g),this.b=oi(e.b),this}copyLinearToSRGB(e){return this.r=Ds(e.r),this.g=Ds(e.g),this.b=Ds(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Mn){return ft.workingToColorSpace(ln.copy(this),e),Math.round(ut(ln.r*255,0,255))*65536+Math.round(ut(ln.g*255,0,255))*256+Math.round(ut(ln.b*255,0,255))}getHexString(e=Mn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ft.workingColorSpace){ft.workingToColorSpace(ln.copy(this),t);let n=ln.r,s=ln.g,r=ln.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=ft.workingColorSpace){return ft.workingToColorSpace(ln.copy(this),t),e.r=ln.r,e.g=ln.g,e.b=ln.b,e}getStyle(e=Mn){ft.workingToColorSpace(ln.copy(this),e);let t=ln.r,n=ln.g,s=ln.b;return e!==Mn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Si),this.setHSL(Si.h+e,Si.s+t,Si.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Si),e.getHSL(Jo);let n=Rr(Si.h,Jo.h,t),s=Rr(Si.s,Jo.s,t),r=Rr(Si.l,Jo.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},ln=new le;le.NAMES=bd;var Or=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new le(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Fr=class extends vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Cn,this.environmentIntensity=1,this.environmentRotation=new Cn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Un=new P,ti=new P,zc=new P,ni=new P,ys=new P,vs=new P,fu=new P,Gc=new P,kc=new P,Vc=new P,Wc=new Pt,Xc=new Pt,Yc=new Pt,ri=class i{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Un.subVectors(e,t),s.cross(Un);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Un.subVectors(s,t),ti.subVectors(n,t),zc.subVectors(e,t);let o=Un.dot(Un),a=Un.dot(ti),l=Un.dot(zc),c=ti.dot(ti),h=ti.dot(zc),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,p=(o*h-a*l)*d;return r.set(1-f-p,p,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ni)===null?!1:ni.x>=0&&ni.y>=0&&ni.x+ni.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,ni)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ni.x),l.addScaledVector(o,ni.y),l.addScaledVector(a,ni.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return Wc.setScalar(0),Xc.setScalar(0),Yc.setScalar(0),Wc.fromBufferAttribute(e,t),Xc.fromBufferAttribute(e,n),Yc.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Wc,r.x),o.addScaledVector(Xc,r.y),o.addScaledVector(Yc,r.z),o}static isFrontFacing(e,t,n,s){return Un.subVectors(n,t),ti.subVectors(e,t),Un.cross(ti).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Un.subVectors(this.c,this.b),ti.subVectors(this.a,this.b),Un.cross(ti).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;ys.subVectors(s,n),vs.subVectors(r,n),Gc.subVectors(e,n);let l=ys.dot(Gc),c=vs.dot(Gc);if(l<=0&&c<=0)return t.copy(n);kc.subVectors(e,s);let h=ys.dot(kc),u=vs.dot(kc);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0&&l-h>0)return o=l/(l-h),t.copy(n).addScaledVector(ys,o);Vc.subVectors(e,r);let f=ys.dot(Vc),p=vs.dot(Vc);if(p>=0&&f<=p)return t.copy(r);let _=f*c-l*p;if(_<=0&&c>=0&&p<=0)return a=c/(c-p),t.copy(n).addScaledVector(vs,a);let g=h*p-f*u;if(g<=0&&u-h>=0&&f-p>=0)return fu.subVectors(r,s),a=(u-h)/(u-h+(f-p)),t.copy(s).addScaledVector(fu,a);let m=1/(g+_+d);return o=_*m,a=d*m,t.copy(n).addScaledVector(ys,o).addScaledVector(vs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Wn=class{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(On.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(On.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=On.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,On):On.fromBufferAttribute(r,o),On.applyMatrix4(e.matrixWorld),this.expandByPoint(On);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),$o.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),$o.copy(n.boundingBox)),$o.applyMatrix4(e.matrixWorld),this.union($o)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,On),On.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(mr),jo.subVectors(this.max,mr),Ms.subVectors(e.a,mr),Es.subVectors(e.b,mr),bs.subVectors(e.c,mr),Ti.subVectors(Es,Ms),wi.subVectors(bs,Es),Xi.subVectors(Ms,bs);let t=[0,-Ti.z,Ti.y,0,-wi.z,wi.y,0,-Xi.z,Xi.y,Ti.z,0,-Ti.x,wi.z,0,-wi.x,Xi.z,0,-Xi.x,-Ti.y,Ti.x,0,-wi.y,wi.x,0,-Xi.y,Xi.x,0];return!qc(t,Ms,Es,bs,jo)||(t=[1,0,0,0,1,0,0,0,1],!qc(t,Ms,Es,bs,jo))?!1:(Qo.crossVectors(Ti,wi),t=[Qo.x,Qo.y,Qo.z],qc(t,Ms,Es,bs,jo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,On).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(On).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ii[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ii[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ii[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ii[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ii[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ii[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ii[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ii[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ii),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ii=[new P,new P,new P,new P,new P,new P,new P,new P],On=new P,$o=new Wn,Ms=new P,Es=new P,bs=new P,Ti=new P,wi=new P,Xi=new P,mr=new P,jo=new P,Qo=new P,Yi=new P;function qc(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Yi.fromArray(i,r);let a=s.x*Math.abs(Yi.x)+s.y*Math.abs(Yi.y)+s.z*Math.abs(Yi.z),l=e.dot(Yi),c=t.dot(Yi),h=n.dot(Yi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var kt=new P,ea=new te,X3=0,Ft=class extends Fn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:X3++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=L1,this.updateRanges=[],this.gpuType=In,this.version=0,this._normalizationScale=e!==void 0?Jl(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ea.fromBufferAttribute(this,t),ea.applyMatrix3(e),this.setXY(t,ea.x,ea.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix3(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix4(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyNormalMatrix(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.transformDirection(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):O1(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):F1(e,this.array)}};var Br=class extends Ft{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Hr=class extends Ft{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var je=class extends Ft{constructor(e,t,n){super(new Float32Array(e),t,n)}},Y3=new Wn,gr=new P,Zc=new P,Xn=class{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Y3.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;gr.subVectors(e,this.center);let t=gr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(gr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Zc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(gr.copy(e.center).add(Zc)),this.expandByPoint(gr.copy(e.center).sub(Zc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},q3=0,Rn=new Xe,Kc=new vt,Ss=new P,vn=new Wn,_r=new Wn,$t=new P,gt=class i extends Fn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:q3++}),this.uuid=xi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(x3(e)?Hr:Br)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new tt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Rn.makeRotationFromQuaternion(e),this.applyMatrix4(Rn),this}rotateX(e){return Rn.makeRotationX(e),this.applyMatrix4(Rn),this}rotateY(e){return Rn.makeRotationY(e),this.applyMatrix4(Rn),this}rotateZ(e){return Rn.makeRotationZ(e),this.applyMatrix4(Rn),this}translate(e,t,n){return Rn.makeTranslation(e,t,n),this.applyMatrix4(Rn),this}scale(e,t,n){return Rn.makeScale(e,t,n),this.applyMatrix4(Rn),this}lookAt(e){return Kc.lookAt(e),Kc.updateMatrix(),this.applyMatrix4(Kc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ss).negate(),this.translate(Ss.x,Ss.y,Ss.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new je(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ze("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ke("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];vn.setFromBufferAttribute(r),this.morphTargetsRelative?($t.addVectors(this.boundingBox.min,vn.min),this.boundingBox.expandByPoint($t),$t.addVectors(this.boundingBox.max,vn.max),this.boundingBox.expandByPoint($t)):(this.boundingBox.expandByPoint(vn.min),this.boundingBox.expandByPoint(vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ke('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ke("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let n=this.boundingSphere.center;if(vn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];_r.setFromBufferAttribute(a),this.morphTargetsRelative?($t.addVectors(vn.min,_r.min),vn.expandByPoint($t),$t.addVectors(vn.max,_r.max),vn.expandByPoint($t)):(vn.expandByPoint(_r.min),vn.expandByPoint(_r.max))}vn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)$t.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared($t));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)$t.fromBufferAttribute(a,c),l&&(Ss.fromBufferAttribute(e,c),$t.add(Ss)),s=Math.max(s,n.distanceToSquared($t))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ke('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ke("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Ft(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[],c=new Uint8Array(n.count);for(let I=0;I<n.count;I++)a[I]=new P,l[I]=new P;let h=new P,u=new P,d=new P,f=new te,p=new te,_=new te,g=new P,m=new P;function v(I,T,A){c[I]=c[T]=c[A]=1,h.fromBufferAttribute(n,I),u.fromBufferAttribute(n,T),d.fromBufferAttribute(n,A),f.fromBufferAttribute(r,I),p.fromBufferAttribute(r,T),_.fromBufferAttribute(r,A),u.sub(h),d.sub(h),p.sub(f),_.sub(f);let L=1/(p.x*_.y-_.x*p.y);isFinite(L)&&(g.copy(u).multiplyScalar(_.y).addScaledVector(d,-p.y).multiplyScalar(L),m.copy(d).multiplyScalar(p.x).addScaledVector(u,-_.x).multiplyScalar(L),a[I].add(g),a[T].add(g),a[A].add(g),l[I].add(m),l[T].add(m),l[A].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let I=0,T=E.length;I<T;++I){let A=E[I],L=A.start,U=A.count;for(let C=L,N=L+U;C<N;C+=3)v(e.getX(C+0),e.getX(C+1),e.getX(C+2))}let y=new P,S=new P,b=new P,x=new P;function M(I){b.fromBufferAttribute(s,I),x.copy(b);let T=a[I];y.copy(T),y.sub(b.multiplyScalar(b.dot(T))).normalize(),S.crossVectors(x,T);let L=S.dot(l[I])<0?-1:1;o.setXYZW(I,y.x,y.y,y.z,L)}for(let I=0,T=n.count;I<T;++I)c[I]&&M(I);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Ft(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new P,r=new P,o=new P,a=new P,l=new P,c=new P,h=new P,u=new P;if(e)for(let d=0,f=e.count;d<f;d+=3){let p=e.getX(d+0),_=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,g),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)$t.fromBufferAttribute(e,t),$t.normalize(),e.setXYZ(t,$t.x,$t.y,$t.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,p=0;for(let _=0,g=l.length;_<g;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let m=0;m<h;m++)d[p++]=c[f++]}return new Ft(d,h,u)}if(this.index===null)return Ze("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},zr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=L1,this.updateRanges=[],this.version=0,this.uuid=xi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=pu(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[t]),s=new this.constructor(n,this.stride);return s.setUsage(this.usage),s}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=pu(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let n={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}};function pu(i){return i.buffer._uuid===void 0&&(i.buffer._uuid=xi()),i.byteOffset===0&&i.byteLength===i.buffer.byteLength?i.buffer._uuid:i.buffer._uuid+":"+i.byteOffset+":"+i.byteLength}var dn=new P,Gs=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s,this._normalizationScale=e!==void 0?Jl(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)dn.fromBufferAttribute(this,t),dn.applyMatrix4(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)dn.fromBufferAttribute(this,t),dn.applyNormalMatrix(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)dn.fromBufferAttribute(this,t),dn.transformDirection(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Nr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Ft(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Nr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):O1(e,this.data.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):F1(e,this.data.array)}},Jc=new P,Z3=new P,K3=new tt,fn=class{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Jc.subVectors(n,t).cross(Z3.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Jc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||K3.getNormalMatrix(e),s=this.coplanarPoint(Jc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},J3=0,Pn=class extends Fn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:J3++}),this.uuid=xi(),this.name="",this.type="Material",this.blending=$s,this.side=Zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=v1,this.blendDst=M1,this.blendEquation=is,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new le(0,0,0),this.blendAlpha=0,this.depthFunc=Ns,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ta,this.stencilZFail=Ta,this.stencilZPass=Ta,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ze(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ze(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new le().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new fn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new te().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new te().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},ks=class extends Pn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new le(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ts,xr=new P,ws=new P,Rs=new P,As=new te,yr=new te,Sd=new Xe,ta=new P,vr=new P,na=new P,mu=new te,$c=new te,gu=new te,Gr=class extends vt{constructor(e=new ks){if(super(),this.isSprite=!0,this.type="Sprite",Ts===void 0){Ts=new gt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new zr(t,5);Ts.setIndex([0,1,2,0,2,3]),Ts.setAttribute("position",new Gs(n,3,0,!1)),Ts.setAttribute("uv",new Gs(n,2,3,!1))}this.geometry=Ts,this.material=e,this.center=new te(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&Ke('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ws.setFromMatrixScale(this.matrixWorld),Sd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Rs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ws.multiplyScalar(-Rs.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;ia(ta.set(-.5,-.5,0),Rs,o,ws,s,r),ia(vr.set(.5,-.5,0),Rs,o,ws,s,r),ia(na.set(.5,.5,0),Rs,o,ws,s,r),mu.set(0,0),$c.set(1,0),gu.set(1,1);let a=e.ray.intersectTriangle(ta,vr,na,!1,xr);if(a===null&&(ia(vr.set(-.5,.5,0),Rs,o,ws,s,r),$c.set(0,1),a=e.ray.intersectTriangle(ta,na,vr,!1,xr),a===null))return;let l=e.ray.origin.distanceTo(xr);l<e.near||l>e.far||t.push({distance:l,point:xr.clone(),uv:ri.getInterpolation(xr,ta,vr,na,mu,$c,gu,new te),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}toJSON(e){let t=super.toJSON(e);return t.object.center=this.center.toArray(),t}};function ia(i,e,t,n,s,r){As.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(yr.x=r*As.x-s*As.y,yr.y=s*As.x+r*As.y):yr.copy(As),i.copy(e),i.x+=yr.x,i.y+=yr.y,i.applyMatrix4(Sd)}var si=new P,jc=new P,sa=new P,ra=new P,li=class{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,si)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=si.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(si.copy(this.origin).addScaledVector(this.direction,t),si.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){jc.copy(e).add(t).multiplyScalar(.5),sa.copy(t).sub(e).normalize(),ra.copy(this.origin).sub(jc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(sa),a=ra.dot(this.direction),l=-ra.dot(sa),c=ra.lengthSq(),h=Math.abs(1-o*o),u,d,f,p;if(h>0)if(u=o*l-a,d=o*a-l,p=r*h,u>=0)if(d>=-p)if(d<=p){let _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-p?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=p?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(jc).addScaledVector(sa,d),f}intersectSphere(e,t){if(e.radius<0)return null;si.subVectors(e.center,this.origin);let n=si.dot(this.direction),s=si.dot(si)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,si)!==null}intersectTriangle(e,t,n,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,u=e.x-o.x,d=e.y-o.y,f=e.z-o.z,p=t.x-o.x,_=t.y-o.y,g=t.z-o.z,m=n.x-o.x,v=n.y-o.y,E=n.z-o.z,y=Math.abs(l),S=Math.abs(c),b=Math.abs(h),x,M,I,T,A,L,U,C,N,O,B,V;if(y>=S&&y>=b?(I=l,L=u,N=p,V=m,l>=0?(x=c,M=h,T=d,A=f,U=_,C=g,O=v,B=E):(x=h,M=c,T=f,A=d,U=g,C=_,O=E,B=v)):S>=b?(I=c,L=d,N=_,V=v,c>=0?(x=h,M=l,T=f,A=u,U=g,C=p,O=E,B=m):(x=l,M=h,T=u,A=f,U=p,C=g,O=m,B=E)):(I=h,L=f,N=g,V=E,h>=0?(x=l,M=c,T=u,A=d,U=p,C=_,O=m,B=v):(x=c,M=l,T=d,A=u,U=_,C=p,O=v,B=m)),I===0)return null;let H=x/I,X=M/I,J=1/I,j=T-H*L,ce=A-X*L,k=U-H*N,Q=C-X*N,ae=O-H*V,Pe=B-X*V,he=ae*Q-Pe*k,De=j*Pe-ce*ae,rt=k*ce-Q*j;if(s){if(he<0||De<0||rt<0)return null}else if((he<0||De<0||rt<0)&&(he>0||De>0||rt>0))return null;let Ie=he+De+rt;if(Ie===0)return null;let Ve=J*(he*L+De*N+rt*V);return(Ie>0?Ve<0:Ve>0)?null:this.at(Ve/Ie,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ue=class extends Pn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new le(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=cl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},_u=new Xe,qi=new li,oa=new Xn,xu=new P,aa=new P,la=new P,ca=new P,Qc=new P,ha=new P,yu=new P,ua=new P,W=class extends vt{constructor(e=new gt,t=new ue){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){ha.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Qc.fromBufferAttribute(u,e),o?ha.addScaledVector(Qc,h):ha.addScaledVector(Qc.sub(t),h))}t.add(ha)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),oa.copy(n.boundingSphere),oa.applyMatrix4(r),qi.copy(e.ray).recast(e.near),!(oa.containsPoint(qi.origin)===!1&&(qi.intersectSphere(oa,xu)===null||qi.origin.distanceToSquared(xu)>(e.far-e.near)**2))&&(_u.copy(r).invert(),qi.copy(e.ray).applyMatrix4(_u),!(n.boundingBox!==null&&qi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,qi)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,_=d.length;p<_;p++){let g=d[p],m=o[g.materialIndex],v=Math.max(g.start,f.start),E=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let y=v,S=E;y<S;y+=3){let b=a.getX(y),x=a.getX(y+1),M=a.getX(y+2);s=da(this,m,e,n,c,h,u,b,x,M),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let p=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let g=p,m=_;g<m;g+=3){let v=a.getX(g),E=a.getX(g+1),y=a.getX(g+2);s=da(this,o,e,n,c,h,u,v,E,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,_=d.length;p<_;p++){let g=d[p],m=o[g.materialIndex],v=Math.max(g.start,f.start),E=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let y=v,S=E;y<S;y+=3){let b=y,x=y+1,M=y+2;s=da(this,m,e,n,c,h,u,b,x,M),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let p=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let g=p,m=_;g<m;g+=3){let v=g,E=g+1,y=g+2;s=da(this,o,e,n,c,h,u,v,E,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function $3(i,e,t,n,s,r,o,a){let l;if(e.side===Wt?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Zn,a),l===null)return null;ua.copy(a),ua.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(ua);return c<t.near||c>t.far?null:{distance:c,point:ua.clone(),object:i}}function da(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,aa),i.getVertexPosition(l,la),i.getVertexPosition(c,ca);let h=$3(i,e,t,n,aa,la,ca,yu);if(h){let u=new P;ri.getBarycoord(yu,aa,la,ca,u),s&&(h.uv=ri.getInterpolatedAttribute(s,a,l,c,u,new te)),r&&(h.uv1=ri.getInterpolatedAttribute(r,a,l,c,u,new te)),o&&(h.normal=ri.getInterpolatedAttribute(o,a,l,c,u,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new P,materialIndex:0};ri.getNormal(aa,la,ca,d.normal),h.face=d,h.barycoord=u}return h}var kr=class extends mn{constructor(e=null,t=1,n=1,s,r,o,a,l,c=jt,h=jt,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Vs=class extends Ft{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Cs=new Xe,vu=new Xe,fa=[],Mu=new Wn,j3=new Xe,Mr=new W,Er=new Xn,_t=class extends W{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Vs(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,j3)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Wn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Cs),Mu.copy(e.boundingBox).applyMatrix4(Cs),this.boundingBox.union(Mu)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Xn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Cs),Er.copy(e.boundingSphere).applyMatrix4(Cs),this.boundingSphere.union(Er)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Mr.geometry=this.geometry,Mr.material=this.material,Mr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Er.copy(this.boundingSphere),Er.applyMatrix4(n),e.ray.intersectsSphere(Er)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Cs),vu.multiplyMatrices(n,Cs),Mr.matrixWorld=vu,Mr.raycast(e,fa);for(let o=0,a=fa.length;o<a;o++){let l=fa[o];l.instanceId=r,l.object=this,t.push(l)}fa.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Vs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new kr(new Float32Array(s*this.count),s,this.count,gl,In));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Zi=new Xn,Q3=new te(.5,.5),pa=new P,Ai=class{constructor(e=new fn,t=new fn,n=new fn,s=new fn,r=new fn,o=new fn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=An,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],p=r[8],_=r[9],g=r[10],m=r[11],v=r[12],E=r[13],y=r[14],S=r[15];if(s[0].setComponents(c-o,f-h,m-p,S-v).normalize(),s[1].setComponents(c+o,f+h,m+p,S+v).normalize(),s[2].setComponents(c+a,f+u,m+_,S+E).normalize(),s[3].setComponents(c-a,f-u,m-_,S-E).normalize(),n)s[4].setComponents(l,d,g,y).normalize(),s[5].setComponents(c-l,f-d,m-g,S-y).normalize();else if(s[4].setComponents(c-l,f-d,m-g,S-y).normalize(),t===An)s[5].setComponents(c+l,f+d,m+g,S+y).normalize();else if(t===Us)s[5].setComponents(l,d,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Zi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Zi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Zi)}intersectsSprite(e){Zi.center.set(0,0,0);let t=Q3.distanceTo(e.center);return Zi.radius=.7071067811865476+t,Zi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Zi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(pa.x=s.normal.x>0?e.max.x:e.min.x,pa.y=s.normal.y>0?e.max.y:e.min.y,pa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(pa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Eu=new Xe,Ba=class i{constructor(){this.coordinateSystem=An,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let s=0;s<t.length;s++){let r=t[s];Eu.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[s]===void 0&&(n[s]=new Ai),n[s].setFromProjectionMatrix(Eu,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new Ai),t[s].copy(n[s]);return this._count=e._count,this}clone(){return new i().copy(this)}};var Ws=class extends Pn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new le(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ha=new P,za=new P,bu=new Xe,br=new li,ma=new Xn,e1=new P,Su=new P,$i=class extends vt{constructor(e=new gt,t=new Ws){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ha.fromBufferAttribute(t,s-1),za.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ha.distanceTo(za);e.setAttribute("lineDistance",new je(n,1))}else Ze("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ma.copy(n.boundingSphere),ma.applyMatrix4(s),ma.radius+=r,e.ray.intersectsSphere(ma)===!1)return;bu.copy(s).invert(),br.copy(e.ray).applyMatrix4(bu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let _=f,g=p-1;_<g;_+=c){let m=h.getX(_),v=h.getX(_+1),E=ga(this,e,br,l,m,v,_);E&&t.push(E)}if(this.isLineLoop){let _=h.getX(p-1),g=h.getX(f),m=ga(this,e,br,l,_,g,p-1);m&&t.push(m)}}else{let f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let _=f,g=p-1;_<g;_+=c){let m=ga(this,e,br,l,_,_+1,_);m&&t.push(m)}if(this.isLineLoop){let _=ga(this,e,br,l,p-1,f,p-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function ga(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(Ha.fromBufferAttribute(a,s),za.fromBufferAttribute(a,r),t.distanceSqToSegment(Ha,za,e1,Su)>n)return;e1.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(e1);if(!(c<e.near||c>e.far))return{distance:c,point:Su.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var Yn=class extends Pn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new le(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Tu=new Xe,c1=new li,_a=new Xn,xa=new P,ci=class extends vt{constructor(e=new gt,t=new Yn){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),_a.copy(n.boundingSphere),_a.applyMatrix4(s),_a.radius+=r,e.ray.intersectsSphere(_a)===!1)return;Tu.copy(s).invert(),c1.copy(e.ray).applyMatrix4(Tu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let p=d,_=f;p<_;p++){let g=c.getX(p);xa.fromBufferAttribute(u,g),wu(xa,g,l,s,e,t,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let p=d,_=f;p<_;p++)xa.fromBufferAttribute(u,p),wu(xa,p,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function wu(i,e,t,n,s,r,o){let a=c1.distanceSqToPoint(i);if(a<t){let l=new P;c1.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Vr=class extends mn{constructor(e=[],t=rs,n,s,r,o,a,l,c,h){super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ji=class extends mn{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var hi=class extends mn{constructor(e,t,n=Bn,s,r,o,a=jt,l=jt,c,h=ai,u=1){if(h!==ai&&h!==gi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Bs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Wr=class extends hi{constructor(e,t=Bn,n=rs,s,r,o=jt,a=jt,l,c=ai){let h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,s,r,o,a,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Xr=class extends mn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ge=class i extends gt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;p("z","y","x",-1,-1,n,t,e,o,r,0),p("z","y","x",1,-1,n,t,-e,o,r,1),p("x","z","y",1,1,e,n,t,s,o,2),p("x","z","y",1,-1,e,n,-t,s,o,3),p("x","y","z",1,-1,e,t,n,s,r,4),p("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new je(c,3)),this.setAttribute("normal",new je(h,3)),this.setAttribute("uv",new je(u,2));function p(_,g,m,v,E,y,S,b,x,M,I){let T=y/x,A=S/M,L=y/2,U=S/2,C=b/2,N=x+1,O=M+1,B=0,V=0,H=new P;for(let X=0;X<O;X++){let J=X*A-U;for(let j=0;j<N;j++){let ce=j*T-L;H[_]=ce*v,H[g]=J*E,H[m]=C,c.push(H.x,H.y,H.z),H[_]=0,H[g]=0,H[m]=b>0?1:-1,h.push(H.x,H.y,H.z),u.push(j/x),u.push(1-X/M),B+=1}}for(let X=0;X<M;X++)for(let J=0;J<x;J++){let j=d+J+N*X,ce=d+J+N*(X+1),k=d+(J+1)+N*(X+1),Q=d+(J+1)+N*X;l.push(j,ce,Q),l.push(ce,k,Q),V+=6}a.addGroup(f,V,I),f+=V,d+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},ui=class i extends gt{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+r,_=s+1,g=new P,m=new P;for(let v=0;v<=p;v++){let E=0,y=0,S=0,b=0;if(v<=n){let I=v/n,T=I*Math.PI/2;y=-h-e*Math.cos(T),S=e*Math.sin(T),b=-e*Math.cos(T),E=I*u}else if(v<=n+r){let I=(v-n)/r;y=-h+I*t,S=e,b=0,E=u+I*d}else{let I=(v-n-r)/n,T=I*Math.PI/2;y=h+e*Math.sin(T),S=e*Math.cos(T),b=e*Math.sin(T),E=u+d+I*u}let x=Math.max(0,Math.min(1,E/f)),M=0;v===0?M=.5/s:v===p&&(M=-.5/s);for(let I=0;I<=s;I++){let T=I/s,A=T*Math.PI*2,L=Math.sin(A),U=Math.cos(A);m.x=-S*U,m.y=y,m.z=S*L,a.push(m.x,m.y,m.z),g.set(-S*U,b,S*L),g.normalize(),l.push(g.x,g.y,g.z),c.push(T+M,x)}if(v>0){let I=(v-1)*_;for(let T=0;T<s;T++){let A=I+T,L=I+T+1,U=v*_+T,C=v*_+T+1;o.push(A,L,U),o.push(L,C,U)}}}this.setIndex(o),this.setAttribute("position",new je(a,3)),this.setAttribute("normal",new je(l,3)),this.setAttribute("uv",new je(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},Yr=class i extends gt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],l=[],c=new P,h=new te;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new je(o,3)),this.setAttribute("normal",new je(a,3)),this.setAttribute("uv",new je(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},lt=class i extends gt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],p=0,_=[],g=n/2,m=0;v(),o===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new je(u,3)),this.setAttribute("normal",new je(d,3)),this.setAttribute("uv",new je(f,2));function v(){let y=new P,S=new P,b=0,x=(t-e)/n;for(let M=0;M<=r;M++){let I=[],T=M/r,A=T*(t-e)+e;for(let L=0;L<=s;L++){let U=L/s,C=U*l+a,N=Math.sin(C),O=Math.cos(C);S.x=A*N,S.y=-T*n+g,S.z=A*O,u.push(S.x,S.y,S.z),y.set(N,x,O).normalize(),d.push(y.x,y.y,y.z),f.push(U,1-T),I.push(p++)}_.push(I)}for(let M=0;M<s;M++)for(let I=0;I<r;I++){let T=_[I][M],A=_[I+1][M],L=_[I+1][M+1],U=_[I][M+1];(e>0||I!==0)&&(h.push(T,A,U),b+=3),(t>0||I!==r-1)&&(h.push(A,L,U),b+=3)}c.addGroup(m,b,0),m+=b}function E(y){let S=p,b=new te,x=new P,M=0,I=y===!0?e:t,T=y===!0?1:-1;for(let L=1;L<=s;L++)u.push(0,g*T,0),d.push(0,T,0),f.push(.5,.5),p++;let A=p;for(let L=0;L<=s;L++){let C=L/s*l+a,N=Math.cos(C),O=Math.sin(C);x.x=I*O,x.y=g*T,x.z=I*N,u.push(x.x,x.y,x.z),d.push(0,T,0),b.x=N*.5+.5,b.y=O*.5*T+.5,f.push(b.x,b.y),p++}for(let L=0;L<s;L++){let U=S+L,C=A+L;y===!0?h.push(C,C+1,U):h.push(C+1,C,U),M+=3}c.addGroup(m,M,y===!0?1:2),m+=M}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},qr=class i extends lt{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ga=class i extends gt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new je(r,3)),this.setAttribute("normal",new je(r.slice(),3)),this.setAttribute("uv",new je(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(v){let E=new P,y=new P,S=new P;for(let b=0;b<t.length;b+=3)f(t[b+0],E),f(t[b+1],y),f(t[b+2],S),l(E,y,S,v)}function l(v,E,y,S){let b=S+1,x=[];for(let M=0;M<=b;M++){x[M]=[];let I=v.clone().lerp(y,M/b),T=E.clone().lerp(y,M/b),A=b-M;for(let L=0;L<=A;L++)L===0&&M===b?x[M][L]=I:x[M][L]=I.clone().lerp(T,L/A)}for(let M=0;M<b;M++)for(let I=0;I<2*(b-M)-1;I++){let T=Math.floor(I/2);I%2===0?(d(x[M][T+1]),d(x[M+1][T]),d(x[M][T])):(d(x[M][T+1]),d(x[M+1][T+1]),d(x[M+1][T]))}}function c(v){let E=new P;for(let y=0;y<r.length;y+=3)E.x=r[y+0],E.y=r[y+1],E.z=r[y+2],E.normalize().multiplyScalar(v),r[y+0]=E.x,r[y+1]=E.y,r[y+2]=E.z}function h(){let v=new P;for(let E=0;E<r.length;E+=3){v.x=r[E+0],v.y=r[E+1],v.z=r[E+2];let y=g(v)/2/Math.PI+.5,S=m(v)/Math.PI+.5;o.push(y,1-S)}p(),u()}function u(){for(let v=0;v<o.length;v+=6){let E=o[v+0],y=o[v+2],S=o[v+4],b=Math.max(E,y,S),x=Math.min(E,y,S);b>.9&&x<.1&&(E<.2&&(o[v+0]+=1),y<.2&&(o[v+2]+=1),S<.2&&(o[v+4]+=1))}}function d(v){r.push(v.x,v.y,v.z)}function f(v,E){let y=v*3;E.x=e[y+0],E.y=e[y+1],E.z=e[y+2]}function p(){let v=new P,E=new P,y=new P,S=new P,b=new te,x=new te,M=new te;for(let I=0,T=0;I<r.length;I+=9,T+=6){v.set(r[I+0],r[I+1],r[I+2]),E.set(r[I+3],r[I+4],r[I+5]),y.set(r[I+6],r[I+7],r[I+8]),b.set(o[T+0],o[T+1]),x.set(o[T+2],o[T+3]),M.set(o[T+4],o[T+5]),S.copy(v).add(E).add(y).divideScalar(3);let A=g(S);_(b,T+0,v,A),_(x,T+2,E,A),_(M,T+4,y,A)}}function _(v,E,y,S){S<0&&v.x===1&&(o[E]=v.x-1),y.x===0&&y.z===0&&(o[E]=S/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function m(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var En=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ze("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new te:new P);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new P,s=[],r=[],o=[],a=new P,l=new Xe;for(let f=0;f<=e;f++){let p=f/e;s[f]=this.getTangentAt(p,new P)}r[0]=new P,o[0]=new P;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let p=Math.acos(ut(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(ut(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let p=1;p<=e;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],f*p)),o[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}},Xs=class extends En{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new te){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ka=class extends Xs{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function B1(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var Ru=new P,Au=new P,t1=new B1,n1=new B1,i1=new B1,Ci=class extends En{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Au.subVectors(s[0],s[1]).add(s[0]),c=Au);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Ru.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Ru),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,p=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),p<1e-4&&(p=_),g<1e-4&&(g=_),t1.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,p,_,g),n1.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,p,_,g),i1.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,p,_,g)}else this.curveType==="catmullrom"&&(t1.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),n1.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),i1.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(t1.calc(l),n1.calc(l),i1.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Cu(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function em(i,e){let t=1-i;return t*t*e}function tm(i,e){return 2*(1-i)*i*e}function nm(i,e){return i*i*e}function Ar(i,e,t,n){return em(i,e)+tm(i,t)+nm(i,n)}function im(i,e){let t=1-i;return t*t*t*e}function sm(i,e){let t=1-i;return 3*t*t*i*e}function rm(i,e){return 3*(1-i)*i*i*e}function om(i,e){return i*i*i*e}function Cr(i,e,t,n,s){return im(i,e)+sm(i,t)+rm(i,n)+om(i,s)}var Zr=class extends En{constructor(e=new te,t=new te,n=new te,s=new te){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new te){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Cr(e,s.x,r.x,o.x,a.x),Cr(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Va=class extends En{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Cr(e,s.x,r.x,o.x,a.x),Cr(e,s.y,r.y,o.y,a.y),Cr(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Kr=class extends En{constructor(e=new te,t=new te){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new te){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new te){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Wa=class extends En{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Jr=class extends En{constructor(e=new te,t=new te,n=new te){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new te){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Ar(e,s.x,r.x,o.x),Ar(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Qi=class extends En{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Ar(e,s.x,r.x,o.x),Ar(e,s.y,r.y,o.y),Ar(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},$r=class extends En{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new te){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Cu(a,l.x,c.x,h.x,u.x),Cu(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new te().fromArray(s))}return this}},Xa=Object.freeze({__proto__:null,ArcCurve:ka,CatmullRomCurve3:Ci,CubicBezierCurve:Zr,CubicBezierCurve3:Va,EllipseCurve:Xs,LineCurve:Kr,LineCurve3:Wa,QuadraticBezierCurve:Jr,QuadraticBezierCurve3:Qi,SplineCurve:$r}),Ya=class extends En{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Xa[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Xa[s.type]().fromJSON(s))}return this.cacheLengths=null,this}},jr=class extends Ya{constructor(e){super(),this.type="Path",this.currentPoint=new te,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Kr(this.currentPoint.clone(),new te(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Jr(this.currentPoint.clone(),new te(e,t),new te(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new Zr(this.currentPoint.clone(),new te(e,t),new te(n,s),new te(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new $r(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new Xs(e,t,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},qn=class extends jr{constructor(e){super(e),this.uuid=xi(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new jr().fromJSON(s))}return this}};function am(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Td(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=dm(i,e,r,t)),i.length>80*t){a=i[0],l=i[1];let h=a,u=l;for(let d=t;d<s;d+=t){let f=i[d],p=i[d+1];f<a&&(a=f),p<l&&(l=p),f>h&&(h=f),p>u&&(u=p)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return Qr(r,o,t,a,l,c,0),o}function Td(i,e,t,n,s){let r;if(s===bm(i,e,t,n)>0)for(let o=e;o<t;o+=n)r=Pu(o/n|0,i[o],i[o+1],r);else for(let o=t-n;o>=e;o-=n)r=Pu(o/n|0,i[o],i[o+1],r);return r&&Ys(r,r.next)&&(to(r),r=r.next),r}function es(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Ys(t,t.next)||Ut(t.prev,t,t.next)===0)){if(to(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Qr(i,e,t,n,s,r,o){if(!i)return;!o&&r&&_m(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?cm(i,n,s,r):lm(i)){e.push(l.i,i.i,c.i),to(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=hm(es(i),e),Qr(i,e,t,n,s,r,2)):o===2&&um(i,e,t,n,s,r):Qr(es(i),e,t,n,s,r,1);break}}}function lm(i){let e=i.prev,t=i,n=i.next;if(Ut(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=Math.min(s,r,o),u=Math.min(a,l,c),d=Math.max(s,r,o),f=Math.max(a,l,c),p=n.next;for(;p!==e;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=f&&Sr(s,a,r,l,o,c,p.x,p.y)&&Ut(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function cm(i,e,t,n){let s=i.prev,r=i,o=i.next;if(Ut(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,f=Math.min(a,l,c),p=Math.min(h,u,d),_=Math.max(a,l,c),g=Math.max(h,u,d),m=h1(f,p,e,t,n),v=h1(_,g,e,t,n),E=i.prevZ,y=i.nextZ;for(;E&&E.z>=m&&y&&y.z<=v;){if(E.x>=f&&E.x<=_&&E.y>=p&&E.y<=g&&E!==s&&E!==o&&Sr(a,h,l,u,c,d,E.x,E.y)&&Ut(E.prev,E,E.next)>=0||(E=E.prevZ,y.x>=f&&y.x<=_&&y.y>=p&&y.y<=g&&y!==s&&y!==o&&Sr(a,h,l,u,c,d,y.x,y.y)&&Ut(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;E&&E.z>=m;){if(E.x>=f&&E.x<=_&&E.y>=p&&E.y<=g&&E!==s&&E!==o&&Sr(a,h,l,u,c,d,E.x,E.y)&&Ut(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;y&&y.z<=v;){if(y.x>=f&&y.x<=_&&y.y>=p&&y.y<=g&&y!==s&&y!==o&&Sr(a,h,l,u,c,d,y.x,y.y)&&Ut(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function hm(i,e){let t=i;do{let n=t.prev,s=t.next.next;!Ys(n,s)&&Rd(n,t,t.next,s)&&eo(n,s)&&eo(s,n)&&(e.push(n.i,t.i,s.i),to(t),to(t.next),t=i=s),t=t.next}while(t!==i);return es(t)}function um(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&vm(o,a)){let l=Ad(o,a);o=es(o,o.next),l=es(l,l.next),Qr(o,e,t,n,s,r,0),Qr(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function dm(i,e,t,n){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=Td(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(ym(c))}s.sort(fm);for(let r=0;r<s.length;r++)t=pm(s[r],t);return t}function fm(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function pm(i,e){let t=mm(i,e);if(!t)return e;let n=Ad(t,i);return es(n,n.next),es(t,t.next)}function mm(i,e){let t=e,n=i.x,s=i.y,r=-1/0,o;if(Ys(i,t))return t;do{if(Ys(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,o=t.x<t.next.x?t:t.next,u===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;t=o;do{if(n>=t.x&&t.x>=l&&n!==t.x&&wd(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);eo(t,i)&&(u<h||u===h&&(t.x>o.x||t.x===o.x&&gm(o,t)))&&(o=t,h=u)}t=t.next}while(t!==a);return o}function gm(i,e){return Ut(i.prev,i,e.prev)<0&&Ut(e.next,i,i.next)<0}function _m(i,e,t,n){let s=i;do s.z===0&&(s.z=h1(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,xm(s)}function xm(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,t*=2}while(e>1);return i}function h1(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function ym(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function wd(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function Sr(i,e,t,n,s,r,o,a){return!(i===o&&e===a)&&wd(i,e,t,n,s,r,o,a)}function vm(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Mm(i,e)&&(eo(i,e)&&eo(e,i)&&Em(i,e)&&(Ut(i.prev,i,e.prev)||Ut(i,e.prev,e))||Ys(i,e)&&Ut(i.prev,i,i.next)>0&&Ut(e.prev,e,e.next)>0)}function Ut(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Ys(i,e){return i.x===e.x&&i.y===e.y}function Rd(i,e,t,n){let s=va(Ut(i,e,t)),r=va(Ut(i,e,n)),o=va(Ut(t,n,i)),a=va(Ut(t,n,e));return!!(s!==r&&o!==a||s===0&&ya(i,t,e)||r===0&&ya(i,n,e)||o===0&&ya(t,i,n)||a===0&&ya(t,e,n))}function ya(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function va(i){return i>0?1:i<0?-1:0}function Mm(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Rd(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function eo(i,e){return Ut(i.prev,i,i.next)<0?Ut(i,e,i.next)>=0&&Ut(i,i.prev,e)>=0:Ut(i,e,i.prev)<0||Ut(i,i.next,e)<0}function Em(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Ad(i,e){let t=u1(i.i,i.x,i.y),n=u1(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Pu(i,e,t,n){let s=u1(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function to(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function u1(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function bm(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var d1=class{static triangulate(e,t,n=2){return am(e,t,n)}},Ki=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Iu(e),Lu(n,e);let o=e.length;t.forEach(Iu);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,Lu(n,t[l]);let a=d1.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Iu(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Lu(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var di=class i extends gt{constructor(e=new qn([new te(.5,.5),new te(-.5,.5),new te(-.5,-.5),new te(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new je(s,3)),this.setAttribute("uv",new je(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,p=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,m=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:Sm,E,y=!1,S,b,x,M;if(m){E=m.getSpacedPoints(h),y=!0,d=!1;let re=m.isCatmullRomCurve3?m.closed:!1;S=m.computeFrenetFrames(h,re),b=new P,x=new P,M=new P}d||(g=0,f=0,p=0,_=0);let I=a.extractPoints(c),T=I.shape,A=I.holes;if(!Ki.isClockWise(T)){T=T.reverse();for(let re=0,pe=A.length;re<pe;re++){let _e=A[re];Ki.isClockWise(_e)&&(A[re]=_e.reverse())}}function U(re){let _e=10000000000000001e-36,Ue=re[0];for(let Te=1;Te<=re.length;Te++){let et=Te%re.length,ie=re[et],ye=ie.x-Ue.x,Ge=ie.y-Ue.y,nt=ye*ye+Ge*Ge,z=Math.max(Math.abs(ie.x),Math.abs(ie.y),Math.abs(Ue.x),Math.abs(Ue.y)),Rt=_e*z*z;if(nt<=Rt){re.splice(et,1),Te--;continue}Ue=ie}}U(T),A.forEach(U);let C=A.length,N=T;for(let re=0;re<C;re++){let pe=A[re];T=T.concat(pe)}function O(re,pe,_e){return pe||Ke("ExtrudeGeometry: vec does not exist"),re.clone().addScaledVector(pe,_e)}let B=T.length;function V(re,pe,_e){let Ue,Te,et,ie=re.x-pe.x,ye=re.y-pe.y,Ge=_e.x-re.x,nt=_e.y-re.y,z=ie*ie+ye*ye,Rt=ie*nt-ye*Ge;if(Math.abs(Rt)>Number.EPSILON){let ot=Math.sqrt(z),Mt=Math.sqrt(Ge*Ge+nt*nt),ve=pe.x-ye/ot,Ot=pe.y+ie/ot,qe=_e.x-nt/Mt,Qe=_e.y+Ge/Mt,D=((qe-ve)*nt-(Qe-Ot)*Ge)/(ie*nt-ye*Ge);Ue=ve+ie*D-re.x,Te=Ot+ye*D-re.y;let w=Ue*Ue+Te*Te;if(w<=2)return new te(Ue,Te);et=Math.sqrt(w/2)}else{let ot=!1;ie>Number.EPSILON?Ge>Number.EPSILON&&(ot=!0):ie<-Number.EPSILON?Ge<-Number.EPSILON&&(ot=!0):Math.sign(ye)===Math.sign(nt)&&(ot=!0),ot?(Ue=-ye,Te=ie,et=Math.sqrt(z)):(Ue=ie,Te=ye,et=Math.sqrt(z/2))}return new te(Ue/et,Te/et)}let H=[];for(let re=0,pe=N.length,_e=pe-1,Ue=re+1;re<pe;re++,_e++,Ue++)_e===pe&&(_e=0),Ue===pe&&(Ue=0),H[re]=V(N[re],N[_e],N[Ue]);let X=[],J,j=H.concat();for(let re=0,pe=C;re<pe;re++){let _e=A[re];J=[];for(let Ue=0,Te=_e.length,et=Te-1,ie=Ue+1;Ue<Te;Ue++,et++,ie++)et===Te&&(et=0),ie===Te&&(ie=0),J[Ue]=V(_e[Ue],_e[et],_e[ie]);X.push(J),j=j.concat(J)}let ce;if(g===0)ce=Ki.triangulateShape(N,A);else{let re=[],pe=[];for(let _e=0;_e<g;_e++){let Ue=_e/g,Te=f*Math.cos(Ue*Math.PI/2),et=p*Math.sin(Ue*Math.PI/2)+_;for(let ie=0,ye=N.length;ie<ye;ie++){let Ge=O(N[ie],H[ie],et);De(Ge.x,Ge.y,-Te),Ue===0&&re.push(Ge)}for(let ie=0,ye=C;ie<ye;ie++){let Ge=A[ie];J=X[ie];let nt=[];for(let z=0,Rt=Ge.length;z<Rt;z++){let ot=O(Ge[z],J[z],et);De(ot.x,ot.y,-Te),Ue===0&&nt.push(ot)}Ue===0&&pe.push(nt)}}ce=Ki.triangulateShape(re,pe)}let k=ce.length,Q=p+_;for(let re=0;re<B;re++){let pe=d?O(T[re],j[re],Q):T[re];y?(x.copy(S.normals[0]).multiplyScalar(pe.x),b.copy(S.binormals[0]).multiplyScalar(pe.y),M.copy(E[0]).add(x).add(b),De(M.x,M.y,M.z)):De(pe.x,pe.y,0)}for(let re=1;re<=h;re++)for(let pe=0;pe<B;pe++){let _e=d?O(T[pe],j[pe],Q):T[pe];y?(x.copy(S.normals[re]).multiplyScalar(_e.x),b.copy(S.binormals[re]).multiplyScalar(_e.y),M.copy(E[re]).add(x).add(b),De(M.x,M.y,M.z)):De(_e.x,_e.y,u/h*re)}for(let re=g-1;re>=0;re--){let pe=re/g,_e=f*Math.cos(pe*Math.PI/2),Ue=p*Math.sin(pe*Math.PI/2)+_;for(let Te=0,et=N.length;Te<et;Te++){let ie=O(N[Te],H[Te],Ue);De(ie.x,ie.y,u+_e)}for(let Te=0,et=A.length;Te<et;Te++){let ie=A[Te];J=X[Te];for(let ye=0,Ge=ie.length;ye<Ge;ye++){let nt=O(ie[ye],J[ye],Ue);y?De(nt.x,nt.y+E[h-1].y,E[h-1].x+_e):De(nt.x,nt.y,u+_e)}}}ae(),Pe();function ae(){let re=s.length/3;if(d){let pe=0,_e=B*pe;for(let Ue=0;Ue<k;Ue++){let Te=ce[Ue];rt(Te[2]+_e,Te[1]+_e,Te[0]+_e)}pe=h+g*2,_e=B*pe;for(let Ue=0;Ue<k;Ue++){let Te=ce[Ue];rt(Te[0]+_e,Te[1]+_e,Te[2]+_e)}}else{for(let pe=0;pe<k;pe++){let _e=ce[pe];rt(_e[2],_e[1],_e[0])}for(let pe=0;pe<k;pe++){let _e=ce[pe];rt(_e[0]+B*h,_e[1]+B*h,_e[2]+B*h)}}n.addGroup(re,s.length/3-re,0)}function Pe(){let re=s.length/3,pe=0;he(N,pe),pe+=N.length;for(let _e=0,Ue=A.length;_e<Ue;_e++){let Te=A[_e];he(Te,pe),pe+=Te.length}n.addGroup(re,s.length/3-re,1)}function he(re,pe){let _e=re.length;for(;--_e>=0;){let Ue=_e,Te=_e-1;Te<0&&(Te=re.length-1);for(let et=0,ie=h+g*2;et<ie;et++){let ye=B*et,Ge=B*(et+1),nt=pe+Ue+ye,z=pe+Te+ye,Rt=pe+Te+Ge,ot=pe+Ue+Ge;Ie(nt,z,Rt,ot)}}}function De(re,pe,_e){l.push(re),l.push(pe),l.push(_e)}function rt(re,pe,_e){Ve(re),Ve(pe),Ve(_e);let Ue=s.length/3,Te=v.generateTopUV(n,s,Ue-3,Ue-2,Ue-1);Je(Te[0]),Je(Te[1]),Je(Te[2])}function Ie(re,pe,_e,Ue){Ve(re),Ve(pe),Ve(Ue),Ve(pe),Ve(_e),Ve(Ue);let Te=s.length/3,et=v.generateSideWallUV(n,s,Te-6,Te-3,Te-2,Te-1);Je(et[0]),Je(et[1]),Je(et[3]),Je(et[1]),Je(et[2]),Je(et[3])}function Ve(re){s.push(l[re*3+0]),s.push(l[re*3+1]),s.push(l[re*3+2])}function Je(re){r.push(re.x),r.push(re.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Tm(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Xa[s.type]().fromJSON(s)),new i(n,e.options)}},Sm={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new te(r,o),new te(a,l),new te(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],p=e[s*3+2],_=e[r*3],g=e[r*3+1],m=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new te(o,1-l),new te(c,1-u),new te(d,1-p),new te(_,1-m)]:[new te(a,1-l),new te(h,1-u),new te(f,1-p),new te(g,1-m)]}};function Tm(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var fi=class i extends Ga{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var gn=class i extends gt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=e/a,d=t/l,f=[],p=[],_=[],g=[];for(let m=0;m<h;m++){let v=m*d-o;for(let E=0;E<c;E++){let y=E*u-r;p.push(y,-v,0),_.push(0,0,1),g.push(E/a),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let v=0;v<a;v++){let E=v+c*m,y=v+c*(m+1),S=v+1+c*(m+1),b=v+1+c*m;f.push(E,y,b),f.push(y,S,b)}this.setIndex(f),this.setAttribute("position",new je(p,3)),this.setAttribute("normal",new je(_,3)),this.setAttribute("uv",new je(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var ct=class i extends gt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new P,d=new P,f=[],p=[],_=[],g=[];for(let m=0;m<=n;m++){let v=[],E=m/n,y=o+E*a,S=e*Math.cos(y),b=Math.sqrt(e*e-S*S),x=0;m===0&&o===0?x=.5/t:m===n&&l===Math.PI&&(x=-.5/t);for(let M=0;M<=t;M++){let I=M/t,T=s+I*r;u.x=-b*Math.cos(T),u.y=S,u.z=b*Math.sin(T),p.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),g.push(I+x,1-E),v.push(c++)}h.push(v)}for(let m=0;m<n;m++)for(let v=0;v<t;v++){let E=h[m][v+1],y=h[m][v],S=h[m+1][v],b=h[m+1][v+1];(m!==0||o>0)&&f.push(E,y,b),(m!==n-1||l<Math.PI)&&f.push(y,S,b)}this.setIndex(f),this.setAttribute("position",new je(p,3)),this.setAttribute("normal",new je(_,3)),this.setAttribute("uv",new je(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var bt=class i extends gt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],h=[],u=[],d=new P,f=new P,p=new P;for(let _=0;_<=n;_++){let g=o+_/n*a;for(let m=0;m<=s;m++){let v=m/s*r;f.x=(e+t*Math.cos(g))*Math.cos(v),f.y=(e+t*Math.cos(g))*Math.sin(v),f.z=t*Math.sin(g),c.push(f.x,f.y,f.z),d.x=e*Math.cos(v),d.y=e*Math.sin(v),p.subVectors(f,d).normalize(),h.push(p.x,p.y,p.z),u.push(m/s),u.push(_/n)}}for(let _=1;_<=n;_++)for(let g=1;g<=s;g++){let m=(s+1)*_+g-1,v=(s+1)*(_-1)+g-1,E=(s+1)*(_-1)+g,y=(s+1)*_+g;l.push(m,v,y),l.push(v,E,y)}this.setIndex(l),this.setAttribute("position",new je(c,3)),this.setAttribute("normal",new je(h,3)),this.setAttribute("uv",new je(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};var ts=class i extends gt{constructor(e=new Qi(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new P,l=new P,c=new te,h=new P,u=[],d=[],f=[],p=[];_(),this.setIndex(p),this.setAttribute("position",new je(u,3)),this.setAttribute("normal",new je(d,3)),this.setAttribute("uv",new je(f,2));function _(){for(let E=0;E<t;E++)g(E);g(r===!1?t:0),v(),m()}function g(E){h=e.getPointAt(E/t,h);let y=o.normals[E],S=o.binormals[E];for(let b=0;b<=s;b++){let x=b/s*Math.PI*2,M=Math.sin(x),I=-Math.cos(x);l.x=I*y.x+M*S.x,l.y=I*y.y+M*S.y,l.z=I*y.z+M*S.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function m(){for(let E=1;E<=t;E++)for(let y=1;y<=s;y++){let S=(s+1)*(E-1)+(y-1),b=(s+1)*E+(y-1),x=(s+1)*E+y,M=(s+1)*(E-1)+y;p.push(S,b,M),p.push(b,x,M)}}function v(){for(let E=0;E<=t;E++)for(let y=0;y<=s;y++)c.x=E/t,c.y=y/s,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new Xa[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};function ls(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Du(s))s.isRenderTargetTexture?(Ze("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Du(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function cn(i){let e={};for(let t=0;t<i.length;t++){let n=ls(i[t]);for(let s in n)e[s]=n[s]}return e}function Du(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function wm(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function H1(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ft.workingColorSpace}var nn={clone:ls,merge:cn},Rm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Am=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Tt=class extends Pn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Rm,this.fragmentShader=Am,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ls(e.uniforms),this.uniformsGroups=wm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new le().setHex(s.value);break;case"v2":this.uniforms[n].value=new te().fromArray(s.value);break;case"v3":this.uniforms[n].value=new P().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Pt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new tt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Xe().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},qs=class extends Tt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ke=class extends Pn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new le(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new le(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ro,this.normalScale=new te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var no=class extends Pn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new le(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new le(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ro,this.normalScale=new te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=cl,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},qa=class extends Pn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ud,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Za=class extends Pn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ps(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Ma(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Pi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ka=class extends Pi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:o1,endingEnd:o1}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case a1:r=e,a=2*t-n;break;case l1:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case a1:o=e,l=2*n-t;break;case l1:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(s-t),_=p*p,g=_*p,m=-d*g+2*d*_-d*p,v=(1+d)*g+(-1.5-2*d)*_+(-.5+d)*p+1,E=(-1-f)*g+(1.5+f)*_+.5*p,y=f*g-f*_;for(let S=0;S!==a;++S)r[S]=m*o[h+S]+v*o[c+S]+E*o[l+S]+y*o[u+S];return r}},Ja=class extends Pi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},$a=class extends Pi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},ja=class extends Pi{interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this.inTangents,u=this.outTangents;if(!h||!u){let p=(n-t)/(s-t),_=1-p;for(let g=0;g!==a;++g)r[g]=o[c+g]*_+o[l+g]*p;return r}let d=a*2,f=e-1;for(let p=0;p!==a;++p){let _=o[c+p],g=o[l+p],m=f*d+p*2,v=u[m],E=u[m+1],y=e*d+p*2,S=h[y],b=h[y+1],x=Pm(n,t,v,S,s);r[p]=Cd(x,_,E,b,g)}return r}};function Cd(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function Cm(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function Pm(i,e,t,n,s){let r=(i-e)/(s-e);for(let o=0;o<8;o++){let a=Cd(r,e,t,n,s)-i;if(Math.abs(a)<1e-10)break;let l=Cm(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var bn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ps(t,this.TimeBufferType),this.values=Ps(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ps(e.times,Array),values:Ps(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),Ma(e.settings)&&(n.settings={inTangents:Ps(e.settings.inTangents,Array),outTangents:Ps(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new $a(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ja(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ka(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new ja(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Pr:t=this.InterpolantFactoryMethodDiscrete;break;case Na:t=this.InterpolantFactoryMethodLinear;break;case Sa:t=this.InterpolantFactoryMethodSmooth;break;case r1:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ze("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Pr;case this.InterpolantFactoryMethodLinear:return Na;case this.InterpolantFactoryMethodSmooth:return Sa;case this.InterpolantFactoryMethodBezier:return r1}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e;Ma(this.settings)&&(Nu(this.settings.inTangents,e),Nu(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;Ma(this.settings)&&(Uu(this.settings.inTangents,e),Uu(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ke("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Ke("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){Ke("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){Ke("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&y3(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){Ke("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Sa,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){let _=t[u+p];if(_!==t[d+p]||_!==t[f+p]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,Ma(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Nu(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]+=e}function Uu(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}bn.prototype.ValueTypeName="";bn.prototype.TimeBufferType=Float32Array;bn.prototype.ValueBufferType=Float32Array;bn.prototype.DefaultInterpolation=Na;var Ii=class extends bn{constructor(e,t,n){super(e,t,n)}};Ii.prototype.ValueTypeName="bool";Ii.prototype.ValueBufferType=Array;Ii.prototype.DefaultInterpolation=Pr;Ii.prototype.InterpolantFactoryMethodLinear=void 0;Ii.prototype.InterpolantFactoryMethodSmooth=void 0;var Qa=class extends bn{constructor(e,t,n,s){super(e,t,n,s)}};Qa.prototype.ValueTypeName="color";var el=class extends bn{constructor(e,t,n,s){super(e,t,n,s)}};el.prototype.ValueTypeName="number";var tl=class extends Pi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)Vt.slerpFlat(r,0,o,c-a,o,c,l);return r}},io=class extends bn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new tl(this.times,this.values,this.getValueSize(),e)}};io.prototype.ValueTypeName="quaternion";io.prototype.InterpolantFactoryMethodSmooth=void 0;var Li=class extends bn{constructor(e,t,n){super(e,t,n)}};Li.prototype.ValueTypeName="string";Li.prototype.ValueBufferType=Array;Li.prototype.DefaultInterpolation=Pr;Li.prototype.InterpolantFactoryMethodLinear=void 0;Li.prototype.InterpolantFactoryMethodSmooth=void 0;var nl=class extends bn{constructor(e,t,n,s){super(e,t,n,s)}};nl.prototype.ValueTypeName="vector";var il=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],p=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Pd=new il,sl=class{constructor(e){this.manager=e!==void 0?e:Pd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};sl.DEFAULT_MATERIAL_NAME="__DEFAULT";var so=class extends vt{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new le(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},ro=class extends so{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new le(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},s1=new Xe,Ou=new P,Fu=new P,rl=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new te(512,512),this.mapType=_n,this.map=null,this.mapPass=null,this.matrix=new Xe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ai,this._frameExtents=new te(1,1),this._viewportCount=1,this._viewports=[new Pt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Ou.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ou),Fu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Fu),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){s1.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(s1,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===Us||e.reversedDepth?t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),t.multiply(s1)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ea=new P,ba=new Vt,kn=new P,oo=class extends vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xe,this.projectionMatrix=new Xe,this.projectionMatrixInverse=new Xe,this.coordinateSystem=An,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ea,ba,kn),kn.x===1&&kn.y===1&&kn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ea,ba,kn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ea,ba,kn),kn.x===1&&kn.y===1&&kn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ea,ba,kn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ri=new P,Bu=new te,Hu=new te,tn=class extends oo{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Fs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(wr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fs*2*Math.atan(Math.tan(wr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ri.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ri.x,Ri.y).multiplyScalar(-e/Ri.z),Ri.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ri.x,Ri.y).multiplyScalar(-e/Ri.z)}getViewSize(e,t){return this.getViewBounds(e,Bu,Hu),t.subVectors(Hu,Bu)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(wr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var ns=class extends oo{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},f1=class extends rl{constructor(){super(new ns(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ao=class extends so{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.target=new vt,this.shadow=new f1}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Is=-90,Ls=1,Zs=class extends vt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new tn(Is,Ls,e,t);s.layers=this.layers,this.add(s);let r=new tn(Is,Ls,e,t);r.layers=this.layers,this.add(r);let o=new tn(Is,Ls,e,t);o.layers=this.layers,this.add(o);let a=new tn(Is,Ls,e,t);a.layers=this.layers,this.add(a);let l=new tn(Is,Ls,e,t);l.layers=this.layers,this.add(l);let c=new tn(Is,Ls,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===An)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Us)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=_,e.setRenderTarget(n,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},ol=class extends tn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},lo=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Im.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Im(){this._document.hidden===!1&&this.reset()}var z1="\\[\\]\\.:\\/",Lm=new RegExp("["+z1+"]","g"),G1="[^"+z1+"]",Dm="[^"+z1.replace("\\.","")+"]",Nm=/((?:WC+[\/:])*)/.source.replace("WC",G1),Um=/(WCOD+)?/.source.replace("WCOD",Dm),Om=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",G1),Fm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",G1),Bm=new RegExp("^"+Nm+Um+Om+Fm+"$"),Hm=["material","materials","bones","map"],p1=class{constructor(e,t,n){let s=n||Lt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Lt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Lm,"")}static parseTrackName(e){let t=Bm.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Hm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ze("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ke("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ke("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ke("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ke("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ke("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;Ke("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Lt.Composite=p1;Lt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Lt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Lt.prototype.GetterByBindingType=[Lt.prototype._getValue_direct,Lt.prototype._getValue_array,Lt.prototype._getValue_arrayElement,Lt.prototype._getValue_toArray];Lt.prototype.SetterByBindingTypeAndVersioning=[[Lt.prototype._setValue_direct,Lt.prototype._setValue_direct_setNeedsUpdate,Lt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_array,Lt.prototype._setValue_array_setNeedsUpdate,Lt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_arrayElement,Lt.prototype._setValue_arrayElement_setNeedsUpdate,Lt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_fromArray,Lt.prototype._setValue_fromArray_setNeedsUpdate,Lt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var bM=new Float32Array(1);var zu=new Xe,co=class{constructor(e,t,n=0,s=1/0){this.ray=new li(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Hs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ke("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return zu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(zu),this}intersectObject(e,t=!0,n=[]){return m1(e,this,n,t),n.sort(Gu),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)m1(e[s],this,n,t);return n.sort(Gu),n}};function Gu(i,e){return i.distance-e.distance}function m1(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)m1(r[o],e,t,!0)}}var ho=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Ze("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}},Ks=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ut(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(ut(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var q1=class q1{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};q1.prototype.isMatrix2=!0;var g1=q1;var uo=class extends Fn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function k1(i,e,t,n){let s=zm(n);switch(t){case R1:return i*e;case gl:return i*e/s.components*s.byteLength;case _l:return i*e/s.components*s.byteLength;case Ui:return i*e*2/s.components*s.byteLength;case xl:return i*e*2/s.components*s.byteLength;case A1:return i*e*3/s.components*s.byteLength;case Hn:return i*e*4/s.components*s.byteLength;case yl:return i*e*4/s.components*s.byteLength;case Mo:case Eo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case bo:case So:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ml:case bl:return Math.max(i,16)*Math.max(e,8)/4;case vl:case El:return Math.max(i,8)*Math.max(e,8)/2;case Sl:case Tl:case Rl:case Al:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case wl:case To:case Cl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Pl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Il:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ll:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Dl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Nl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ul:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Ol:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Fl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Bl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Hl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case zl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Gl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case kl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Vl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Wl:case Xl:case Yl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ql:case Zl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case wo:case Kl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function zm(i){switch(i){case _n:case b1:return{byteLength:1,components:1};case Qs:case S1:case Xt:return{byteLength:2,components:1};case pl:case ml:return{byteLength:2,components:4};case Bn:case fl:case In:return{byteLength:4,components:1};case T1:case w1:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window!="undefined"&&(window.__THREE__?Ze("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function jd(){let i=null,e=!1,t=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),t(r,o)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Xm(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array!="undefined"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){let p=u[d],_=u[f];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){let _=u[f];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Ym=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,qm=`#ifdef USE_ALPHAHASH
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
#endif`,Zm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Km=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,$m=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jm=`#ifdef USE_AOMAP
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
#endif`,Qm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,e0=`#ifdef USE_BATCHING
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
#endif`,t0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,n0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,i0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,s0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,r0=`#ifdef USE_IRIDESCENCE
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
#endif`,o0=`#ifdef USE_BUMPMAP
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
#endif`,a0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,l0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,c0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,h0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,u0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,d0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,f0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,p0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,m0=`#define PI 3.141592653589793
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
} // validated`,g0=`vec3 transformedNormal = objectNormal;
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
#endif`,_0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,x0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,y0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,v0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,M0="gl_FragColor = linearToOutputTexel( gl_FragColor );",E0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,b0=`#ifdef USE_ENVMAP
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
#endif`,S0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,T0=`#ifdef USE_ENVMAP
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
#endif`,w0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,R0=`#ifdef USE_ENVMAP
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
#endif`,A0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,C0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,P0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,I0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,L0=`#ifdef USE_GRADIENTMAP
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
}`,D0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,N0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,U0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,O0=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,F0=`#ifdef USE_ENVMAP
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
#endif`,B0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,H0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,z0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,G0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,k0=`PhysicalMaterial material;
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
#endif`,V0=`uniform sampler2D dfgLUT;
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
}`,W0=`
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
#endif`,X0=`#if defined( RE_IndirectDiffuse )
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
#endif`,Y0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,q0=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,Z0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,K0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,J0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,j0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Q0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,e4=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,t4=`#if defined( USE_POINTS_UV )
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
#endif`,n4=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,i4=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,s4=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,r4=`#if defined( USE_MORPHCOLORS )
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
#endif`,o4=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,a4=`#ifdef USE_MORPHTARGETS
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
#endif`,l4=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,c4=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,h4=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,u4=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,d4=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,f4=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,p4=`#ifdef USE_NORMALMAP
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
#endif`,m4=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,g4=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_4=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,x4=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,y4=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,v4=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,M4=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,E4=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,b4=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,S4=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,T4=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,w4=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,R4=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,A4=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,C4=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,P4=`float getShadowMask() {
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
}`,I4=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,L4=`#ifdef USE_SKINNING
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
#endif`,D4=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,N4=`#ifdef USE_SKINNING
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
#endif`,U4=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,O4=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,F4=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,B4=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,H4=`#ifdef USE_TRANSMISSION
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
#endif`,z4=`#ifdef USE_TRANSMISSION
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
#endif`,G4=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,k4=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,V4=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,W4=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,X4=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Y4=`uniform sampler2D t2D;
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
}`,q4=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Z4=`uniform float backgroundBlurriness;
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
}`,K4=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,J4=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$4=`#include <common>
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
}`,j4=`#if DEPTH_PACKING == 3200
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
}`,Q4=`#define DISTANCE
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
}`,eg=`#define DISTANCE
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
}`,tg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ng=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ig=`uniform float scale;
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
}`,sg=`uniform vec3 diffuse;
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
}`,rg=`#include <common>
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
}`,og=`uniform vec3 diffuse;
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
}`,ag=`#define LAMBERT
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
}`,lg=`#define LAMBERT
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
}`,cg=`#define MATCAP
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
}`,hg=`#define MATCAP
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
}`,ug=`#define NORMAL
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
}`,dg=`#define NORMAL
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
}`,fg=`#define PHONG
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
}`,pg=`#define PHONG
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
}`,mg=`#define STANDARD
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
}`,gg=`#define STANDARD
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
}`,_g=`#define TOON
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
}`,xg=`#define TOON
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
}`,yg=`uniform float size;
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
}`,vg=`uniform vec3 diffuse;
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
}`,Mg=`#include <common>
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
}`,Eg=`uniform vec3 color;
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
}`,bg=`uniform float rotation;
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
}`,Sg=`uniform vec3 diffuse;
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
}`,dt={alphahash_fragment:Ym,alphahash_pars_fragment:qm,alphamap_fragment:Zm,alphamap_pars_fragment:Km,alphatest_fragment:Jm,alphatest_pars_fragment:$m,aomap_fragment:jm,aomap_pars_fragment:Qm,batching_pars_vertex:e0,batching_vertex:t0,begin_vertex:n0,beginnormal_vertex:i0,bsdfs:s0,iridescence_fragment:r0,bumpmap_pars_fragment:o0,clipping_planes_fragment:a0,clipping_planes_pars_fragment:l0,clipping_planes_pars_vertex:c0,clipping_planes_vertex:h0,color_fragment:u0,color_pars_fragment:d0,color_pars_vertex:f0,color_vertex:p0,common:m0,defaultnormal_vertex:g0,displacementmap_pars_vertex:_0,displacementmap_vertex:x0,emissivemap_fragment:y0,emissivemap_pars_fragment:v0,colorspace_fragment:M0,colorspace_pars_fragment:E0,envmap_fragment:b0,envmap_common_pars_fragment:S0,envmap_pars_fragment:T0,envmap_pars_vertex:w0,envmap_physical_pars_fragment:F0,envmap_vertex:R0,fog_vertex:A0,fog_pars_vertex:C0,fog_fragment:P0,fog_pars_fragment:I0,gradientmap_pars_fragment:L0,lightmap_pars_fragment:D0,lights_lambert_fragment:N0,lights_lambert_pars_fragment:U0,lights_pars_begin:O0,lights_toon_fragment:B0,lights_toon_pars_fragment:H0,lights_phong_fragment:z0,lights_phong_pars_fragment:G0,lights_physical_fragment:k0,lights_physical_pars_fragment:V0,lights_fragment_begin:W0,lights_fragment_maps:X0,lights_fragment_end:Y0,lightprobes_pars_fragment:q0,logdepthbuf_fragment:Z0,logdepthbuf_pars_fragment:K0,logdepthbuf_pars_vertex:J0,logdepthbuf_vertex:$0,map_fragment:j0,map_pars_fragment:Q0,map_particle_fragment:e4,map_particle_pars_fragment:t4,metalnessmap_fragment:n4,metalnessmap_pars_fragment:i4,morphinstance_vertex:s4,morphcolor_vertex:r4,morphnormal_vertex:o4,morphtarget_pars_vertex:a4,morphtarget_vertex:l4,normal_fragment_begin:c4,normal_fragment_maps:h4,normal_pars_fragment:u4,normal_pars_vertex:d4,normal_vertex:f4,normalmap_pars_fragment:p4,clearcoat_normal_fragment_begin:m4,clearcoat_normal_fragment_maps:g4,clearcoat_pars_fragment:_4,iridescence_pars_fragment:x4,opaque_fragment:y4,packing:v4,premultiplied_alpha_fragment:M4,project_vertex:E4,dithering_fragment:b4,dithering_pars_fragment:S4,roughnessmap_fragment:T4,roughnessmap_pars_fragment:w4,shadowmap_pars_fragment:R4,shadowmap_pars_vertex:A4,shadowmap_vertex:C4,shadowmask_pars_fragment:P4,skinbase_vertex:I4,skinning_pars_vertex:L4,skinning_vertex:D4,skinnormal_vertex:N4,specularmap_fragment:U4,specularmap_pars_fragment:O4,tonemapping_fragment:F4,tonemapping_pars_fragment:B4,transmission_fragment:H4,transmission_pars_fragment:z4,uv_pars_fragment:G4,uv_pars_vertex:k4,uv_vertex:V4,worldpos_vertex:W4,background_vert:X4,background_frag:Y4,backgroundCube_vert:q4,backgroundCube_frag:Z4,cube_vert:K4,cube_frag:J4,depth_vert:$4,depth_frag:j4,distance_vert:Q4,distance_frag:eg,equirect_vert:tg,equirect_frag:ng,linedashed_vert:ig,linedashed_frag:sg,meshbasic_vert:rg,meshbasic_frag:og,meshlambert_vert:ag,meshlambert_frag:lg,meshmatcap_vert:cg,meshmatcap_frag:hg,meshnormal_vert:ug,meshnormal_frag:dg,meshphong_vert:fg,meshphong_frag:pg,meshphysical_vert:mg,meshphysical_frag:gg,meshtoon_vert:_g,meshtoon_frag:xg,points_vert:yg,points_frag:vg,shadow_vert:Mg,shadow_frag:Eg,sprite_vert:bg,sprite_frag:Sg},Ce={common:{diffuse:{value:new le(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new tt}},envmap:{envMap:{value:null},envMapRotation:{value:new tt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new tt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new tt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new tt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new tt},normalScale:{value:new te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new tt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new tt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new tt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new tt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new le(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new le(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new le(16777215)},opacity:{value:1},center:{value:new te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}}},$n={basic:{uniforms:cn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.fog]),vertexShader:dt.meshbasic_vert,fragmentShader:dt.meshbasic_frag},lambert:{uniforms:cn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new le(0)},envMapIntensity:{value:1}}]),vertexShader:dt.meshlambert_vert,fragmentShader:dt.meshlambert_frag},phong:{uniforms:cn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new le(0)},specular:{value:new le(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:dt.meshphong_vert,fragmentShader:dt.meshphong_frag},standard:{uniforms:cn([Ce.common,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.roughnessmap,Ce.metalnessmap,Ce.fog,Ce.lights,{emissive:{value:new le(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag},toon:{uniforms:cn([Ce.common,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.gradientmap,Ce.fog,Ce.lights,{emissive:{value:new le(0)}}]),vertexShader:dt.meshtoon_vert,fragmentShader:dt.meshtoon_frag},matcap:{uniforms:cn([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,{matcap:{value:null}}]),vertexShader:dt.meshmatcap_vert,fragmentShader:dt.meshmatcap_frag},points:{uniforms:cn([Ce.points,Ce.fog]),vertexShader:dt.points_vert,fragmentShader:dt.points_frag},dashed:{uniforms:cn([Ce.common,Ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:dt.linedashed_vert,fragmentShader:dt.linedashed_frag},depth:{uniforms:cn([Ce.common,Ce.displacementmap]),vertexShader:dt.depth_vert,fragmentShader:dt.depth_frag},normal:{uniforms:cn([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,{opacity:{value:1}}]),vertexShader:dt.meshnormal_vert,fragmentShader:dt.meshnormal_frag},sprite:{uniforms:cn([Ce.sprite,Ce.fog]),vertexShader:dt.sprite_vert,fragmentShader:dt.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:dt.background_vert,fragmentShader:dt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new tt}},vertexShader:dt.backgroundCube_vert,fragmentShader:dt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:dt.cube_vert,fragmentShader:dt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:dt.equirect_vert,fragmentShader:dt.equirect_frag},distance:{uniforms:cn([Ce.common,Ce.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:dt.distance_vert,fragmentShader:dt.distance_frag},shadow:{uniforms:cn([Ce.lights,Ce.fog,{color:{value:new le(0)},opacity:{value:1}}]),vertexShader:dt.shadow_vert,fragmentShader:dt.shadow_frag}};$n.physical={uniforms:cn([$n.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new tt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new tt},clearcoatNormalScale:{value:new te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new tt},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new tt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new tt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new tt},sheen:{value:0},sheenColor:{value:new le(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new tt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new tt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new tt},transmissionSamplerSize:{value:new te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new tt},attenuationDistance:{value:0},attenuationColor:{value:new le(0)},specularColor:{value:new le(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new tt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new tt},anisotropyVector:{value:new te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new tt}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag};var $l={r:0,b:0,g:0},Tg=new Xe,Qd=new tt;Qd.set(-1,0,0,0,1,0,0,0,1);function wg(i,e,t,n,s,r){let o=new le(0),a=s===!0?0:1,l,c,h=null,u=0,d=null;function f(v){let E=v.isScene===!0?v.background:null;if(E&&E.isTexture){let y=v.backgroundBlurriness>0;E=e.get(E,y)}return E}function p(v){let E=!1,y=f(v);y===null?g(o,a):y&&y.isColor&&(g(y,1),E=!0);let S=i.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(v,E){let y=f(E);y&&y.isCubeTexture?(c===void 0&&(c=new W(new ge(1,1,1),new Tt({name:"BackgroundCubeMaterial",uniforms:ls($n.backgroundCube.uniforms),vertexShader:$n.backgroundCube.vertexShader,fragmentShader:$n.backgroundCube.fragmentShader,side:Wt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,b,x){this.matrixWorld.copyPosition(x.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Tg.makeRotationFromEuler(E.backgroundRotation)).transpose(),y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Qd),c.material.toneMapped=ft.getTransfer(y.colorSpace)!==Et,(h!==y||u!==y.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,u=y.version,d=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new W(new gn(2,2),new Tt({name:"BackgroundMaterial",uniforms:ls($n.background.uniforms),vertexShader:$n.background.vertexShader,fragmentShader:$n.background.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=ft.getTransfer(y.colorSpace)!==Et,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||u!==y.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,u=y.version,d=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function g(v,E){v.getRGB($l,H1(i)),t.buffers.color.setClear($l.r,$l.g,$l.b,E,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,E=1){o.set(v),a=E,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(v){a=v,g(o,a)},render:p,addToRenderList:_,dispose:m}}function Rg(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(A,L,U,C,N){let O=!1,B=u(A,C,U,L);r!==B&&(r=B,c(r.object)),O=f(A,C,U,N),O&&p(A,C,U,N),N!==null&&e.update(N,i.ELEMENT_ARRAY_BUFFER),(O||o)&&(o=!1,y(A,L,U,C),N!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function l(){return i.createVertexArray()}function c(A){return i.bindVertexArray(A)}function h(A){return i.deleteVertexArray(A)}function u(A,L,U,C){let N=C.wireframe===!0,O=n[L.id];O===void 0&&(O={},n[L.id]=O);let B=A.isInstancedMesh===!0?A.id:0,V=O[B];V===void 0&&(V={},O[B]=V);let H=V[U.id];H===void 0&&(H={},V[U.id]=H);let X=H[N];return X===void 0&&(X=d(l()),H[N]=X),X}function d(A){let L=[],U=[],C=[];for(let N=0;N<t;N++)L[N]=0,U[N]=0,C[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:U,attributeDivisors:C,object:A,attributes:{},index:null}}function f(A,L,U,C){let N=r.attributes,O=L.attributes,B=0,V=U.getAttributes();for(let H in V)if(V[H].location>=0){let J=N[H],j=O[H];if(j===void 0&&(H==="instanceMatrix"&&A.instanceMatrix&&(j=A.instanceMatrix),H==="instanceColor"&&A.instanceColor&&(j=A.instanceColor)),J===void 0||J.attribute!==j||j&&J.data!==j.data)return!0;B++}return r.attributesNum!==B||r.index!==C}function p(A,L,U,C){let N={},O=L.attributes,B=0,V=U.getAttributes();for(let H in V)if(V[H].location>=0){let J=O[H];J===void 0&&(H==="instanceMatrix"&&A.instanceMatrix&&(J=A.instanceMatrix),H==="instanceColor"&&A.instanceColor&&(J=A.instanceColor));let j={};j.attribute=J,J&&J.data&&(j.data=J.data),N[H]=j,B++}r.attributes=N,r.attributesNum=B,r.index=C}function _(){let A=r.newAttributes;for(let L=0,U=A.length;L<U;L++)A[L]=0}function g(A){m(A,0)}function m(A,L){let U=r.newAttributes,C=r.enabledAttributes,N=r.attributeDivisors;U[A]=1,C[A]===0&&(i.enableVertexAttribArray(A),C[A]=1),N[A]!==L&&(i.vertexAttribDivisor(A,L),N[A]=L)}function v(){let A=r.newAttributes,L=r.enabledAttributes;for(let U=0,C=L.length;U<C;U++)L[U]!==A[U]&&(i.disableVertexAttribArray(U),L[U]=0)}function E(A,L,U,C,N,O,B){B===!0?i.vertexAttribIPointer(A,L,U,N,O):i.vertexAttribPointer(A,L,U,C,N,O)}function y(A,L,U,C){_();let N=C.attributes,O=U.getAttributes(),B=L.defaultAttributeValues;for(let V in O){let H=O[V];if(H.location>=0){let X=N[V];if(X===void 0&&(V==="instanceMatrix"&&A.instanceMatrix&&(X=A.instanceMatrix),V==="instanceColor"&&A.instanceColor&&(X=A.instanceColor)),X!==void 0){let J=X.normalized,j=X.itemSize,ce=e.get(X);if(ce===void 0)continue;let k=ce.buffer,Q=ce.type,ae=ce.bytesPerElement,Pe=Q===i.INT||Q===i.UNSIGNED_INT||X.gpuType===fl;if(X.isInterleavedBufferAttribute){let he=X.data,De=he.isInterleavedBuffer===!0?he.stride:he.itemSize,rt=X.offset;if(he.isInstancedInterleavedBuffer||he.isInstancedBufferAttribute){for(let Ie=0;Ie<H.locationSize;Ie++)m(H.location+Ie,he.meshPerAttribute);A.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let Ie=0;Ie<H.locationSize;Ie++)g(H.location+Ie);i.bindBuffer(i.ARRAY_BUFFER,k);for(let Ie=0;Ie<H.locationSize;Ie++)E(H.location+Ie,j/H.locationSize,Q,J,De*ae,(rt+j/H.locationSize*Ie)*ae,Pe)}else{if(X.isInstancedBufferAttribute){for(let he=0;he<H.locationSize;he++)m(H.location+he,X.meshPerAttribute);A.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let he=0;he<H.locationSize;he++)g(H.location+he);i.bindBuffer(i.ARRAY_BUFFER,k);for(let he=0;he<H.locationSize;he++)E(H.location+he,j/H.locationSize,Q,J,j*ae,j/H.locationSize*he*ae,Pe)}}else if(B!==void 0){let J=B[V];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(H.location,J);break;case 3:i.vertexAttrib3fv(H.location,J);break;case 4:i.vertexAttrib4fv(H.location,J);break;default:i.vertexAttrib1fv(H.location,J)}}}}v()}function S(){I();for(let A in n){let L=n[A];for(let U in L){let C=L[U];for(let N in C){let O=C[N];for(let B in O)h(O[B].object),delete O[B];delete C[N]}}delete n[A]}}function b(A){if(n[A.id]===void 0)return;let L=n[A.id];for(let U in L){let C=L[U];for(let N in C){let O=C[N];for(let B in O)h(O[B].object),delete O[B];delete C[N]}}delete n[A.id]}function x(A){for(let L in n){let U=n[L];for(let C in U){let N=U[C];if(N[A.id]===void 0)continue;let O=N[A.id];for(let B in O)h(O[B].object),delete O[B];delete N[A.id]}}}function M(A){for(let L in n){let U=n[L],C=A.isInstancedMesh===!0?A.id:0,N=U[C];if(N!==void 0){for(let O in N){let B=N[O];for(let V in B)h(B[V].object),delete B[V];delete N[O]}delete U[C],Object.keys(U).length===0&&delete n[L]}}}function I(){T(),o=!0,r!==s&&(r=s,c(r.object))}function T(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:I,resetDefaultState:T,dispose:S,releaseStatesOfGeometry:b,releaseStatesOfObject:M,releaseStatesOfProgram:x,initAttributes:_,enableAttribute:g,disableUnusedAttributes:v}}function Ag(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function o(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function a(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Cg(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let x=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(x.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(x){return!(x!==Hn&&n.convert(x)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(x){let M=x===Xt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(x!==_n&&x!==In&&!M&&n.convert(x)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(x){if(x==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";x="mediump"}return x==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(Ze("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=t.logarithmicDepthBuffer===!0&&u===!1;t.reversedDepthBuffer===!0&&u===!1&&Ze("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&u===!0&&Ze("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=i.getParameter(i.MAX_SAMPLES),b=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:v,maxVaryings:E,maxFragmentUniforms:y,maxSamples:S,samples:b}}function Pg(i){let e=this,t=null,n=0,s=!1,r=!1,o=new fn,a=new tt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let p=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,m=i.get(u);if(!s||p===null||p.length===0||r&&!g)r?h(null):c();else{let v=r?0:n,E=v*4,y=m.clippingState||null;l.value=y,y=h(p,d,E,f);for(let S=0;S!==E;++S)y[S]=t[S];m.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,p){let _=u!==null?u.length:0,g=null;if(_!==0){if(g=l.value,p!==!0||g===null){let m=f+_*4,v=d.matrixWorldInverse;a.getNormalMatrix(v),(g===null||g.length<m)&&(g=new Float32Array(m));for(let E=0,y=f;E!==_;++E,y+=4)o.copy(u[E]).applyMatrix4(v,a),o.normal.toArray(g,y),g[y+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}var Po=class extends zt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Vr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ge(5,5,5),r=new Tt({name:"CubemapFromEquirect",uniforms:ls(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Wt,blending:pi});r.uniforms.tEquirect.value=t;let o=new W(s,r),a=t.minFilter;return t.minFilter===mi&&(t.minFilter=pn),new Zs(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},Id=256,Ig=3,Lg=20,e2=256,t2=16,Dg=3,Ng=new P,Ug=new le,Ql=class i{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Zs(1,10,null),this._boxMesh=new W(new ge(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=Ng}=r,l=this._renderer;this._setSize(o);let c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);let u=l.autoClear,d=l.autoClearColor,f=l.autoClearDepth,p=l.autoClearStencil,_=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,_===null&&(e.background=l.getClearColor(Ug));let g=new Zs(n,s,h);return g.position.copy(a),g.update(l,e),l.autoClear=u,l.autoClearColor=d,l.autoClearDepth=f,l.autoClearStencil=p,e.background=_,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Nd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Dd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Id,U1(e))}_fromTexture(e,t){e.mapping===rs||e.mapping===js?this._setSize(e.image.length===0?Id:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=Ld(e,!1,!1),n=Math.log2(e)-Ig;for(let s=0;s<=n;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=Ld(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let s=this._boxMesh,r=this._cubeCamera;s.material=n,r.renderTarget=e,r.activeMipmapLevel=t;let o=e.width>>t;e.viewport.set(0,0,o,o),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===rs||e.mapping===js?(this._cubemapMaterial===null&&(this._cubemapMaterial=Nd()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Dd()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=Og(),this._integrationMaterial=Fg());let t=this._cubeSize,n=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/t2);for(let o=0;o<=n;o++){let a=i.lodToRoughness(o,n);if(o>n-Dg)r.roughness.value=a,this._renderCube(e,o,this._integrationMaterial);else{let l=a>0?Math.log2(t)+.5*Math.log2(6/(e2*Math.pow(a,4)))+.5:0;s.roughness.value=a,s.lodBias.value=l,this._renderCube(e,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=Bg());let n=this._blurMaterial,s=n.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,n),s.envMap.value=e.texture,this._renderCube(r,0,n)}};function Ld(i,e,t){return new Po(i,{minFilter:mi,generateMipmaps:e,type:Xt,colorSpace:Ir,depthBuffer:t})}function Io(i,e,t){return new Tt({name:i,uniforms:e,vertexShader:dt.cube_vert,fragmentShader:t,side:Wt,blending:pi,depthTest:!1,depthWrite:!1})}function Og(){return Io("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${e2}u

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
	`)}function Fg(){return Io("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:t2}},`

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
	`)}function Bg(){return Io("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Lg}
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
	`)}function Dd(){return Io("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function Nd(){return Io("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Hg(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,f=!1){return d==null?null:f?o(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===hl||f===ul)if(e.has(d)){let p=e.get(d).texture;return a(p,d.mapping)}else{let p=d.image;if(p&&p.height>0){let _=new Po(p.height);return _.fromEquirectangularTexture(i,d),e.set(d,_),d.addEventListener("dispose",c),a(_.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){let f=d.mapping,p=f===hl||f===ul,_=f===rs||f===js;if(p||_){let g=t.get(d),m=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return n===null&&(n=new Ql(i)),g=p?n.fromEquirectangular(d,g):n.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{let v=d.image;return p&&v&&v.height>0||_&&v&&l(v)?(n===null&&(n=new Ql(i)),g=p?n.fromEquirectangular(d):n.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function a(d,f){return f===hl?d.mapping=rs:f===ul&&(d.mapping=js),d}function l(d){let f=0,p=6;for(let _=0;_<p;_++)d[_]!==void 0&&f++;return f===p}function c(d){let f=d.target;f.removeEventListener("dispose",c);let p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function zg(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Tr("WebGLRenderer: "+n+" extension not supported."),s}}}function Gg(i,e,t,n){let s={},r=new WeakMap,o=new FinalizationRegistry(p=>delete s[p]);function a(p){l(p.target)}function l(p){p.index!==null&&e.remove(p.index);for(let g in p.attributes)e.remove(p.attributes[g]);p.removeEventListener("dispose",a),delete s[p.id],o.unregister(p);let _=r.get(p);_&&(e.remove(_),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function c(p,_){return s[_.id]!==void 0||(_.addEventListener("dispose",a),s[_.id]=new WeakRef(_),o.register(_,_.id,_),t.memory.geometries++),_}function h(p){let _=p.attributes;for(let g in _)e.update(_[g],i.ARRAY_BUFFER)}function u(p){let _=p.index,g=p.attributes.position,m=0;if(g===void 0)return;let v=_!==null?_.array.length:g.array.length/3-1,E=g.count>=65535?Hr:Br,y=new E(Math.ceil(v/3)*6,1),S=y.array;if(_!==null){let x=_.array;m=_.version;for(let M=0,I=0;M<v;M+=3){let T=x[M+0],A=x[M+1],L=x[M+2];S[I++]=T,S[I++]=A,S[I++]=A,S[I++]=L,S[I++]=L,S[I++]=T}}else{m=g.version;for(let x=0,M=0;x<v;x+=3){let I=x+0,T=x+1,A=x+2;S[M++]=I,S[M++]=T,S[M++]=T,S[M++]=A,S[M++]=A,S[M++]=I}}y.version=m;let b=r.get(p);b&&e.remove(b),r.set(p,y)}function d(p){let _=r.get(p);if(_){let g=p.index;g!==null&&_.version<g.version&&u(p)}else u(p);return r.get(p)}function f(){for(let p in s){let _=s[p].deref();_!==void 0&&l(_)}}return{get:c,update:h,getWireframeAttribute:d,dispose:f}}function kg(i,e,t){let n;function s(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,d){i.drawElements(n,d,r,u*o),t.update(d,n,1)}function c(u,d,f){f!==0&&(i.drawElementsInstanced(n,d,r,u*o,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let _=0;for(let g=0;g<f;g++)_+=d[g];t.update(_,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Vg(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:Ke("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Wg(i,e,t){let n=new WeakMap,s=new Pt;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let I=function(){x.dispose(),n.delete(a),a.removeEventListener("dispose",I)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],v=a.morphAttributes.color||[],E=0;f===!0&&(E=1),p===!0&&(E=2),_===!0&&(E=3);let y=a.attributes.position.count*E,S=1;y>e.maxTextureSize&&(S=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let b=new Float32Array(y*S*4*u),x=new Ur(b,y,S,u);x.type=In,x.needsUpdate=!0;let M=E*4;for(let T=0;T<u;T++){let A=g[T],L=m[T],U=v[T],C=y*S*4*T;for(let N=0;N<A.count;N++){let O=N*M;f===!0&&(s.fromBufferAttribute(A,N),b[C+O+0]=s.x,b[C+O+1]=s.y,b[C+O+2]=s.z,b[C+O+3]=0),p===!0&&(s.fromBufferAttribute(L,N),b[C+O+4]=s.x,b[C+O+5]=s.y,b[C+O+6]=s.z,b[C+O+7]=0),_===!0&&(s.fromBufferAttribute(U,N),b[C+O+8]=s.x,b[C+O+9]=s.y,b[C+O+10]=s.z,b[C+O+11]=U.itemSize===4?s.w:1)}}d={count:u,texture:x,size:new te(y,S)},n.set(a,d),a.addEventListener("dispose",I)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Xg(i,e,t,n,s){let r=new WeakMap;function o(c){let h=s.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:o,dispose:a}}var Yg={[po]:"LINEAR_TONE_MAPPING",[mo]:"REINHARD_TONE_MAPPING",[go]:"CINEON_TONE_MAPPING",[ss]:"ACES_FILMIC_TONE_MAPPING",[xo]:"AGX_TONE_MAPPING",[yo]:"NEUTRAL_TONE_MAPPING",[_o]:"CUSTOM_TONE_MAPPING"};function qg(i,e,t,n,s,r){let o=new zt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=null,h=new gt;h.setAttribute("position",new je([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new je([0,2,0,0,2,0],2));let u=new qs({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new W(h,u),f=new ns(-1,1,1,-1,0,1),p=null,_=null,g=!1,m,v=null,E=[],y=!1;this.setSize=function(S,b){o.setSize(S,b),a!==null&&a.setSize(S,b),l!==null&&l.setSize(S,b);for(let x=0;x<E.length;x++){let M=E[x];M.setSize&&M.setSize(S,b)}},this.setEffects=function(S){E=S,y=E.length>0&&E[0].isRenderPass===!0;let b=o.width,x=o.height;E.length>0&&a===null&&(a=new zt(b,x,{type:Xt,depthBuffer:!1,stencilBuffer:!1}),l=new zt(b,x,{type:Xt,depthBuffer:!1,stencilBuffer:!1}));let M=s===!0&&E.some(I=>I.needsDepthTexture===!0);M!==(o.depthTexture!==null)&&(M===!0&&c===null&&(c=new hi(b,x),r===!0&&(c.format=gi,c.type=os)),o.dispose(),o.depthTexture=M?c:null,o.resolveDepthBuffer=M,o.storeMultisampledDepthBuffer=M);for(let I=0;I<E.length;I++){let T=E[I];T.setSize&&T.setSize(b,x),M&&T.needsDepthTexture===!0&&T.setDepthTexture&&T.setDepthTexture(c)}},this.begin=function(S,b){if(g||S.toneMapping===Kn&&E.length===0)return!1;if(v=b,b!==null){let x=b.width,M=b.height;(o.width!==x||o.height!==M)&&this.setSize(x,M)}return y===!1&&S.setRenderTarget(o),m=S.toneMapping,S.toneMapping=Kn,!0},this.hasRenderPass=function(){return y},this.end=function(S,b){S.toneMapping=m,g=!0;let x=o,M=a;for(let I=0;I<E.length;I++){let T=E[I];T.enabled!==!1&&(T.render(S,M,x,b),T.needsSwap!==!1&&(x=M,M=M===a?l:a))}if(p!==S.outputColorSpace||_!==S.toneMapping){p=S.outputColorSpace,_=S.toneMapping,u.defines={},ft.getTransfer(p)===Et&&(u.defines.SRGB_TRANSFER="");let I=Yg[_];I&&(u.defines[I]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=x.texture,S.setRenderTarget(v),S.render(d,f),v=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),h.dispose(),u.dispose()}}var n2=new mn,i2=new hi(1,1),s2=new Wr(1),r2=new Ur,o2=new Fa,a2=new Vr,Ud=[],Od=[],Fd=new Float32Array(16),Bd=new Float32Array(9),Hd=new Float32Array(4);function tr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Ud[s];if(r===void 0&&(r=new Float32Array(s),Ud[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Yt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function qt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function tc(i,e){let t=Od[e];t===void 0&&(t=new Int32Array(e),Od[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Zg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Kg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;i.uniform2fv(this.addr,e),qt(t,e)}}function Jg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Yt(t,e))return;i.uniform3fv(this.addr,e),qt(t,e)}}function $g(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;i.uniform4fv(this.addr,e),qt(t,e)}}function jg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Yt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),qt(t,e)}else{if(Yt(t,n))return;Hd.set(n),i.uniformMatrix2fv(this.addr,!1,Hd),qt(t,n)}}function Qg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Yt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),qt(t,e)}else{if(Yt(t,n))return;Bd.set(n),i.uniformMatrix3fv(this.addr,!1,Bd),qt(t,n)}}function e8(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Yt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),qt(t,e)}else{if(Yt(t,n))return;Fd.set(n),i.uniformMatrix4fv(this.addr,!1,Fd),qt(t,n)}}function t8(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function n8(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;i.uniform2iv(this.addr,e),qt(t,e)}}function i8(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;i.uniform3iv(this.addr,e),qt(t,e)}}function s8(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;i.uniform4iv(this.addr,e),qt(t,e)}}function r8(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function o8(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;i.uniform2uiv(this.addr,e),qt(t,e)}}function a8(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;i.uniform3uiv(this.addr,e),qt(t,e)}}function l8(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;i.uniform4uiv(this.addr,e),qt(t,e)}}function nc(i){return i.version===0&&(i.compareFunction=I1,i.needsUpdate=!0),i}function c8(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?r=nc(i2):r=n2,t.setTexture2D(e||r,s)}function h8(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||o2,s)}function u8(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_CUBE_SHADOW?r=nc(s2):r=a2,t.setTextureCube(e||r,s)}function d8(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||r2,s)}function f8(i){switch(i){case 5126:return Zg;case 35664:return Kg;case 35665:return Jg;case 35666:return $g;case 35674:return jg;case 35675:return Qg;case 35676:return e8;case 5124:case 35670:return t8;case 35667:case 35671:return n8;case 35668:case 35672:return i8;case 35669:case 35673:return s8;case 5125:return r8;case 36294:return o8;case 36295:return a8;case 36296:return l8;case 35678:case 36198:case 36298:case 36306:case 35682:return c8;case 35679:case 36299:case 36307:return h8;case 35680:case 36300:case 36308:case 36293:return u8;case 36289:case 36303:case 36311:case 36292:return d8}}function p8(i,e){i.uniform1fv(this.addr,e)}function m8(i,e){let t=tr(e,this.size,2);i.uniform2fv(this.addr,t)}function g8(i,e){let t=tr(e,this.size,3);i.uniform3fv(this.addr,t)}function _8(i,e){let t=tr(e,this.size,4);i.uniform4fv(this.addr,t)}function x8(i,e){let t=tr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function y8(i,e){let t=tr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function v8(i,e){let t=tr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function M8(i,e){i.uniform1iv(this.addr,e)}function E8(i,e){i.uniform2iv(this.addr,e)}function b8(i,e){i.uniform3iv(this.addr,e)}function S8(i,e){i.uniform4iv(this.addr,e)}function T8(i,e){i.uniform1uiv(this.addr,e)}function w8(i,e){i.uniform2uiv(this.addr,e)}function R8(i,e){i.uniform3uiv(this.addr,e)}function A8(i,e){i.uniform4uiv(this.addr,e)}function C8(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);Yt(n,r)||(i.uniform1iv(this.addr,r),qt(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=nc(i2):o=n2;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function P8(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);Yt(n,r)||(i.uniform1iv(this.addr,r),qt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||o2,r[o])}function I8(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);Yt(n,r)||(i.uniform1iv(this.addr,r),qt(n,r));let o;this.type===i.SAMPLER_CUBE_SHADOW?o=nc(s2):o=a2;for(let a=0;a!==s;++a)t.setTextureCube(e[a]||o,r[a])}function L8(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);Yt(n,r)||(i.uniform1iv(this.addr,r),qt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||r2,r[o])}function D8(i){switch(i){case 5126:return p8;case 35664:return m8;case 35665:return g8;case 35666:return _8;case 35674:return x8;case 35675:return y8;case 35676:return v8;case 5124:case 35670:return M8;case 35667:case 35671:return E8;case 35668:case 35672:return b8;case 35669:case 35673:return S8;case 5125:return T8;case 36294:return w8;case 36295:return R8;case 36296:return A8;case 35678:case 36198:case 36298:case 36306:case 35682:return C8;case 35679:case 36299:case 36307:return P8;case 35680:case 36300:case 36308:case 36293:return I8;case 36289:case 36303:case 36311:case 36292:return L8}}var J1=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=f8(t.type)}},$1=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=D8(t.type)}},j1=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Z1=/(\w+)(\])?(\[|\.)?/g;function zd(i,e){i.seq.push(e),i.map[e.id]=e}function N8(i,e,t){let n=i.name,s=n.length;for(Z1.lastIndex=0;;){let r=Z1.exec(n),o=Z1.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){zd(t,c===void 0?new J1(a,i,e):new $1(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new j1(a),zd(t,u)),t=u}}}var er=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);N8(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function Gd(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var U8=37297,O8=0;function F8(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var kd=new tt;function B8(i){ft._getMatrix(kd,ft.workingColorSpace,i);let e=`mat3( ${kd.elements.map(t=>t.toFixed(4))} )`;switch(ft.getTransfer(i)){case Lr:return[e,"LinearTransferOETF"];case Et:return[e,"sRGBTransferOETF"];default:return Ze("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Vd(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+F8(i.getShaderSource(e),a)}else return r}function H8(i,e){let t=B8(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var z8={[po]:"Linear",[mo]:"Reinhard",[go]:"Cineon",[ss]:"ACESFilmic",[xo]:"AgX",[yo]:"Neutral",[_o]:"Custom"};function G8(i,e){let t=z8[e];return t===void 0?(Ze("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var jl=new P;function k8(){ft.getLuminanceCoefficients(jl);let i=jl.x.toFixed(4),e=jl.y.toFixed(4),t=jl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function V8(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Co).join(`
`)}function W8(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function X8(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Co(i){return i!==""}function Wd(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function Xd(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Y8=/^[ \t]*#include +<([\w\d./]+)>/gm;function Q1(i){return i.replace(Y8,q8)}function q8(i,e){let t=dt[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Q1(t)}var Z8=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yd(i){return i.replace(Z8,K8)}function K8(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function qd(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}var J8={[fo]:"SHADOWMAP_TYPE_PCF",[Js]:"SHADOWMAP_TYPE_VSM"};function $8(i){return J8[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var j8={[js]:"ENVMAP_MODE_REFRACTION"};function Q8(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":j8[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var e_={[cl]:"ENVMAP_BLENDING_MULTIPLY",[ld]:"ENVMAP_BLENDING_MIX",[cd]:"ENVMAP_BLENDING_ADD"};function t_(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":e_[i.combine]||"ENVMAP_BLENDING_NONE"}function n_(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=$8(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=Q8(t),u=t_(t),d=V8(t),f=W8(r),p=s.createProgram(),_,g,m=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(Co).join(`
`),_.length>0&&(_+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(Co).join(`
`),g.length>0&&(g+=`
`)):(_=[qd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Co).join(`
`),g=[qd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Kn?"#define TONE_MAPPING":"",t.toneMapping!==Kn?dt.tonemapping_pars_fragment:"",t.toneMapping!==Kn?G8("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",dt.colorspace_pars_fragment,H8("linearToOutputTexel",t.outputColorSpace),k8(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Co).join(`
`)),o=Q1(o),o=Wd(o,t),o=Xd(o,t),a=Q1(a),a=Wd(a,t),a=Xd(a,t),o=Yd(o),a=Yd(a),t.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,_=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,g=["#define varying in",t.glslVersion===D1?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===D1?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let v=m+_+o,E=m+g+a,y=Gd(s,s.VERTEX_SHADER,v),S=Gd(s,s.FRAGMENT_SHADER,E);s.attachShader(p,y),s.attachShader(p,S),t.index0AttributeName!==void 0?s.bindAttribLocation(p,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function b(T){if(i.debug.checkShaderErrors){let A=s.getProgramInfoLog(p)||"",L=s.getShaderInfoLog(y)||"",U=s.getShaderInfoLog(S)||"",C=A.trim(),N=L.trim(),O=U.trim(),B=!0,V=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(B=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,y,S);else{let H=Vd(s,y,"vertex"),X=Vd(s,S,"fragment");Ke("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+C+`
`+H+`
`+X)}else C!==""?Ze("WebGLProgram: Program Info Log:",C):(N===""||O==="")&&(V=!1);V&&(T.diagnostics={runnable:B,programLog:C,vertexShader:{log:N,prefix:_},fragmentShader:{log:O,prefix:g}})}s.deleteShader(y),s.deleteShader(S),x=new er(s,p),M=X8(s,p)}let x;this.getUniforms=function(){return x===void 0&&b(this),x};let M;this.getAttributes=function(){return M===void 0&&b(this),M};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(p,U8)),I},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=O8++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=y,this.fragmentShader=S,this}var i_=0,eh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new th(e),t.set(e,n)),n}},th=class{constructor(e){this.id=i_++,this.code=e,this.usedTimes=0}};function s_(i){return i===Ui||i===To||i===wo}function r_(i,e,t,n,s,r){let o=new Hs,a=new eh,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(x){return l.add(x),x===0?"uv":`uv${x}`}function p(x,M,I,T,A,L){let U=T.fog,C=A.geometry,N=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?T.environment:null,O=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,B=e.get(x.envMap||N,O),V=d[x.type],H=n.precision;x.precision!==null&&(H=n.getMaxPrecision(x.precision),H!==x.precision&&Ze("WebGLProgram.getParameters:",x.precision,"not supported, using",H,"instead."));let X=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,J=X!==void 0?X.length:0,j=0;C.morphAttributes.position!==void 0&&(j=1),C.morphAttributes.normal!==void 0&&(j=2),C.morphAttributes.color!==void 0&&(j=3);let ce,k,Q,ae;if(V){let Le=$n[V];ce=Le.vertexShader,k=Le.fragmentShader}else{ce=x.vertexShader,k=x.fragmentShader;let Le=a.getVertexShaderStage(x),At=a.getFragmentShaderStage(x);a.update(x,Le,At),Q=Le.id,ae=At.id}let Pe=i.getRenderTarget(),he=i.state.buffers.depth.getReversed(),De=A.isInstancedMesh===!0,rt=A.isBatchedMesh===!0,Ie=!!x.map,Ve=!!x.matcap,Je=!!B,re=Je&&B.isPMREMTexture===!0,pe=!!x.aoMap,_e=!!x.lightMap,Ue=!!x.bumpMap&&x.wireframe===!1,Te=!!x.normalMap,et=!!x.displacementMap,ie=!!x.emissiveMap,ye=!!x.metalnessMap,Ge=!!x.roughnessMap,nt=x.anisotropy>0,z=x.clearcoat>0,Rt=x.diffuseRoughness>0,ot=x.dispersion>0,Mt=x.retroreflectivity>0,ve=x.iridescence>0,Ot=x.sheen>0,qe=x.transmission>0,Qe=nt&&!!x.anisotropyMap,D=z&&!!x.clearcoatMap,w=z&&!!x.clearcoatNormalMap,q=z&&!!x.clearcoatRoughnessMap,fe=Rt&&!!x.diffuseRoughnessMap,oe=ve&&!!x.iridescenceMap,Me=ve&&!!x.iridescenceThicknessMap,Re=Ot&&!!x.sheenColorMap,ee=Ot&&!!x.sheenRoughnessMap,ne=!!x.specularMap,be=!!x.specularColorMap,F=!!x.specularIntensityMap,se=qe&&!!x.transmissionMap,$=qe&&!!x.thicknessMap,Se=!!x.gradientMap,xe=!!x.alphaMap,Ee=x.alphaTest>0,We=!!x.alphaHash,ht=!!x.extensions,me=Kn;x.toneMapped&&(Pe===null||Pe.isXRRenderTarget===!0)&&(me=i.toneMapping);let Ye=re?B.isCompressedCubeTexture?B.image[0].mipmaps:B.mipmaps:null,at={shaderID:V,shaderType:x.type,shaderName:x.name,vertexShader:ce,fragmentShader:k,defines:x.defines,customVertexShaderID:Q,customFragmentShaderID:ae,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:H,batching:rt,batchingColor:rt&&A._colorsTexture!==null,instancing:De,instancingColor:De&&A.instanceColor!==null,instancingMorph:De&&A.morphTexture!==null,outputColorSpace:Pe===null?i.outputColorSpace:Pe.isXRRenderTarget===!0?Pe.texture.colorSpace:ft.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Ie,matcap:Ve,envMap:Je,envMapMode:Je&&B.mapping,envMapPMREM:re,envMapMaxLod:re?Ye.length-1:null,envMapSize:re?Ye[0].width:null,aoMap:pe,lightMap:_e,bumpMap:Ue,normalMap:Te,displacementMap:et,emissiveMap:ie,normalMapObjectSpace:Te&&x.normalMapType===dd,normalMapTangentSpace:Te&&x.normalMapType===Ro,packedNormalMap:Te&&x.normalMapType===Ro&&s_(x.normalMap.format),metalnessMap:ye,roughnessMap:Ge,anisotropy:nt,anisotropyMap:Qe,clearcoat:z,clearcoatMap:D,clearcoatNormalMap:w,clearcoatRoughnessMap:q,diffuseRoughness:Rt,diffuseRoughnessMap:fe,dispersion:ot,retroreflection:Mt,iridescence:ve,iridescenceMap:oe,iridescenceThicknessMap:Me,sheen:Ot,sheenColorMap:Re,sheenRoughnessMap:ee,specularMap:ne,specularColorMap:be,specularIntensityMap:F,transmission:qe,transmissionMap:se,thicknessMap:$,gradientMap:Se,opaque:x.transparent===!1&&x.blending===$s&&x.alphaToCoverage===!1,alphaMap:xe,alphaTest:Ee,alphaHash:We,combine:x.combine,mapUv:Ie&&f(x.map.channel),aoMapUv:pe&&f(x.aoMap.channel),lightMapUv:_e&&f(x.lightMap.channel),bumpMapUv:Ue&&f(x.bumpMap.channel),normalMapUv:Te&&f(x.normalMap.channel),displacementMapUv:et&&f(x.displacementMap.channel),emissiveMapUv:ie&&f(x.emissiveMap.channel),metalnessMapUv:ye&&f(x.metalnessMap.channel),roughnessMapUv:Ge&&f(x.roughnessMap.channel),anisotropyMapUv:Qe&&f(x.anisotropyMap.channel),clearcoatMapUv:D&&f(x.clearcoatMap.channel),clearcoatNormalMapUv:w&&f(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:q&&f(x.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:fe&&f(x.diffuseRoughnessMap.channel),iridescenceMapUv:oe&&f(x.iridescenceMap.channel),iridescenceThicknessMapUv:Me&&f(x.iridescenceThicknessMap.channel),sheenColorMapUv:Re&&f(x.sheenColorMap.channel),sheenRoughnessMapUv:ee&&f(x.sheenRoughnessMap.channel),specularMapUv:ne&&f(x.specularMap.channel),specularColorMapUv:be&&f(x.specularColorMap.channel),specularIntensityMapUv:F&&f(x.specularIntensityMap.channel),transmissionMapUv:se&&f(x.transmissionMap.channel),thicknessMapUv:$&&f(x.thicknessMap.channel),alphaMapUv:xe&&f(x.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(Te||nt),vertexNormals:!!C.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,pointsUvs:A.isPoints===!0&&!!C.attributes.uv&&(Ie||xe),fog:!!U,useFog:x.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||C.attributes.normal===void 0&&Te===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:he,skinning:A.isSkinnedMesh===!0,hasPositionAttribute:C.attributes.position!==void 0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:J,morphTextureStride:j,numSunLights:M.sun.length,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numSunLightShadows:M.sunShadowMap.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:L.filter(Le=>Le.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:me,decodeVideoTexture:Ie&&x.map.isVideoTexture===!0&&ft.getTransfer(x.map.colorSpace)===Et,decodeVideoTextureEmissive:ie&&x.emissiveMap.isVideoTexture===!0&&ft.getTransfer(x.emissiveMap.colorSpace)===Et,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Dt,flipSided:x.side===Wt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:ht&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ht&&x.extensions.multiDraw===!0||rt)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return at.vertexUv1s=l.has(1),at.vertexUv2s=l.has(2),at.vertexUv3s=l.has(3),l.clear(),at}function _(x){let M=[];if(x.shaderID?M.push(x.shaderID):(M.push(x.customVertexShaderID),M.push(x.customFragmentShaderID)),x.defines!==void 0)for(let I in x.defines)M.push(I),M.push(x.defines[I]);return x.isRawShaderMaterial===!1&&(g(M,x),m(M,x),M.push(i.outputColorSpace)),M.push(x.customProgramCacheKey),M.join()}function g(x,M){x.push(M.precision),x.push(M.outputColorSpace),x.push(M.envMapMode),x.push(M.envMapPMREM),x.push(M.envMapMaxLod),x.push(M.envMapSize),x.push(M.mapUv),x.push(M.alphaMapUv),x.push(M.lightMapUv),x.push(M.aoMapUv),x.push(M.bumpMapUv),x.push(M.normalMapUv),x.push(M.displacementMapUv),x.push(M.emissiveMapUv),x.push(M.metalnessMapUv),x.push(M.roughnessMapUv),x.push(M.anisotropyMapUv),x.push(M.clearcoatMapUv),x.push(M.clearcoatNormalMapUv),x.push(M.clearcoatRoughnessMapUv),x.push(M.diffuseRoughnessMapUv),x.push(M.iridescenceMapUv),x.push(M.iridescenceThicknessMapUv),x.push(M.sheenColorMapUv),x.push(M.sheenRoughnessMapUv),x.push(M.specularMapUv),x.push(M.specularColorMapUv),x.push(M.specularIntensityMapUv),x.push(M.transmissionMapUv),x.push(M.thicknessMapUv),x.push(M.combine),x.push(M.fogExp2),x.push(M.sizeAttenuation),x.push(M.morphTargetsCount),x.push(M.numSunLights),x.push(M.numDirLights),x.push(M.numPointLights),x.push(M.numSpotLights),x.push(M.numSpotLightMaps),x.push(M.numHemiLights),x.push(M.numRectAreaLights),x.push(M.numSunLightShadows),x.push(M.numDirLightShadows),x.push(M.numPointLightShadows),x.push(M.numSpotLightShadows),x.push(M.numSpotLightShadowsWithMaps),x.push(M.numLightProbes),x.push(M.numLightProbeGrids),x.push(M.shadowMapType),x.push(M.toneMapping),x.push(M.numClippingPlanes),x.push(M.numClipIntersection),x.push(M.depthPacking)}function m(x,M){o.disableAll(),M.instancing&&o.enable(0),M.instancingColor&&o.enable(1),M.instancingMorph&&o.enable(2),M.matcap&&o.enable(3),M.envMap&&o.enable(4),M.normalMapObjectSpace&&o.enable(5),M.normalMapTangentSpace&&o.enable(6),M.clearcoat&&o.enable(7),M.iridescence&&o.enable(8),M.alphaTest&&o.enable(9),M.vertexColors&&o.enable(10),M.vertexAlphas&&o.enable(11),M.vertexUv1s&&o.enable(12),M.vertexUv2s&&o.enable(13),M.vertexUv3s&&o.enable(14),M.vertexTangents&&o.enable(15),M.anisotropy&&o.enable(16),M.alphaHash&&o.enable(17),M.batching&&o.enable(18),M.dispersion&&o.enable(19),M.retroreflection&&o.enable(24),M.diffuseRoughness&&o.enable(25),M.batchingColor&&o.enable(20),M.gradientMap&&o.enable(21),M.packedNormalMap&&o.enable(22),M.vertexNormals&&o.enable(23),x.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),M.numLightProbeGrids>0&&o.enable(22),M.hasPositionAttribute&&o.enable(23),x.push(o.mask)}function v(x){let M=d[x.type],I;if(M){let T=$n[M];I=nn.clone(T.uniforms)}else I=x.uniforms;return I}function E(x,M){let I=h.get(M);return I!==void 0?++I.usedTimes:(I=new n_(i,M,x,s),c.push(I),h.set(M,I)),I}function y(x){if(--x.usedTimes===0){let M=c.indexOf(x);c[M]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function S(x){a.remove(x)}function b(){a.dispose()}return{getParameters:p,getProgramCacheKey:_,getUniforms:v,acquireProgram:E,releaseProgram:y,releaseShaderCache:S,programs:c,dispose:b}}function o_(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function a_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Zd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Kd(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function a(d,f,p,_,g,m){let v=i[e];return v===void 0?(v={id:d.id,object:d,geometry:f,material:p,materialVariant:o(d),groupOrder:_,renderOrder:d.renderOrder,z:g,group:m},i[e]=v):(v.id=d.id,v.object=d,v.geometry=f,v.material=p,v.materialVariant=o(d),v.groupOrder=_,v.renderOrder=d.renderOrder,v.z=g,v.group=m),e++,v}function l(d,f,p,_,g,m,v){v.reversedDepth===!0&&(g=-g);let E=a(d,f,p,_,g,m);p.transmission>0?n.push(E):p.transparent===!0?s.push(E):t.push(E)}function c(d,f,p,_,g,m){let v=a(d,f,p,_,g,m);p.transmission>0?n.unshift(v):p.transparent===!0?s.unshift(v):t.unshift(v)}function h(d,f){t.length>1&&t.sort(d||a_),n.length>1&&n.sort(f||Zd),s.length>1&&s.sort(f||Zd)}function u(){for(let d=e,f=i.length;d<f;d++){let p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function l_(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Kd,i.set(n,[o])):s>=r.length?(o=new Kd,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function c_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new P,color:new le};break;case"SpotLight":t={position:new P,direction:new P,color:new le,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new le,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new le,groundColor:new le};break;case"RectAreaLight":t={color:new le,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function h_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var u_=0;function d_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function f_(i){let e=new c_,t=h_(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);let s=new P,r=new Xe,o=new Xe;function a(c){let h=0,u=0,d=0;for(let L=0;L<9;L++)n.probe[L].set(0,0,0);let f=0,p=0,_=0,g=0,m=0,v=0,E=0,y=0,S=0,b=0,x=0,M=0,I=0,T=0;c.sort(d_);for(let L=0,U=c.length;L<U;L++){let C=c[L],N=C.color,O=C.intensity,B=C.distance,V=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===Ui?V=C.shadow.map.texture:V=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)h+=N.r*O,u+=N.g*O,d+=N.b*O;else if(C.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(C.sh.coefficients[H],O);T++}else if(C.isSunLight){let H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let X=C.shadow,J=t.get(C);J.shadowIntensity=X.intensity,J.shadowBias=X.bias,J.shadowNormalBias=X.normalBias,J.shadowRadius=X.radius,J.shadowMapSize.copy(X.mapSize).multiply(X.getFrameExtents()),n.sunShadow[p]=J,n.sunShadowMap[p]=V;let j=X.getViewportCount();for(let ce=0;ce<j;ce++)n.sunShadowMatrix[_+ce]=X.getMatrix(ce),n.sunShadowCascade[_+ce]=X._cascadeData[ce];_+=j,p++}n.sun[f]=H,f++}else if(C.isDirectionalLight){let H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let X=C.shadow,J=t.get(C);J.shadowIntensity=X.intensity,J.shadowBias=X.bias,J.shadowNormalBias=X.normalBias,J.shadowRadius=X.radius,J.shadowMapSize=X.mapSize,n.directionalShadow[g]=J,n.directionalShadowMap[g]=V,n.directionalShadowMatrix[g]=C.shadow.matrix,S++}n.directional[g]=H,g++}else if(C.isSpotLight){let H=e.get(C);H.position.setFromMatrixPosition(C.matrixWorld),H.color.copy(N).multiplyScalar(O),H.distance=B,H.coneCos=Math.cos(C.angle),H.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),H.decay=C.decay,n.spot[v]=H;let X=C.shadow;if(C.map&&(n.spotLightMap[M]=C.map,M++,X.updateMatrices(C),C.castShadow&&I++),n.spotLightMatrix[v]=X.matrix,C.castShadow){let J=t.get(C);J.shadowIntensity=X.intensity,J.shadowBias=X.bias,J.shadowNormalBias=X.normalBias,J.shadowRadius=X.radius,J.shadowMapSize=X.mapSize,n.spotShadow[v]=J,n.spotShadowMap[v]=V,x++}v++}else if(C.isRectAreaLight){let H=e.get(C);H.color.copy(N).multiplyScalar(O),H.halfWidth.set(C.width*.5,0,0),H.halfHeight.set(0,C.height*.5,0),n.rectArea[E]=H,E++}else if(C.isPointLight){let H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),H.distance=C.distance,H.decay=C.decay,C.castShadow){let X=C.shadow,J=t.get(C);J.shadowIntensity=X.intensity,J.shadowBias=X.bias,J.shadowNormalBias=X.normalBias,J.shadowRadius=X.radius,J.shadowMapSize=X.mapSize,J.shadowCameraNear=X.camera.near,J.shadowCameraFar=X.camera.far,n.pointShadow[m]=J,n.pointShadowMap[m]=V,n.pointShadowMatrix[m]=C.shadow.matrix,b++}n.point[m]=H,m++}else if(C.isHemisphereLight){let H=e.get(C);H.skyColor.copy(C.color).multiplyScalar(O),H.groundColor.copy(C.groundColor).multiplyScalar(O),n.hemi[y]=H,y++}}E>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ce.LTC_FLOAT_1,n.rectAreaLTC2=Ce.LTC_FLOAT_2):(n.rectAreaLTC1=Ce.LTC_HALF_1,n.rectAreaLTC2=Ce.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let A=n.hash;(A.sunLength!==f||A.directionalLength!==g||A.pointLength!==m||A.spotLength!==v||A.rectAreaLength!==E||A.hemiLength!==y||A.numSunShadows!==p||A.numDirectionalShadows!==S||A.numPointShadows!==b||A.numSpotShadows!==x||A.numSpotMaps!==M||A.numLightProbes!==T)&&(n.sun.length=f,n.directional.length=g,n.spot.length=v,n.rectArea.length=E,n.point.length=m,n.hemi.length=y,n.sunShadow.length=p,n.sunShadowMap.length=p,n.sunShadowMatrix.length=_,n.sunShadowCascade.length=_,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.directionalShadowMatrix.length=S,n.pointShadow.length=b,n.pointShadowMap.length=b,n.pointShadowMatrix.length=b,n.spotShadow.length=x,n.spotShadowMap.length=x,n.spotLightMatrix.length=x+M-I,n.spotLightMap.length=M,n.numSpotLightShadowsWithMaps=I,n.numLightProbes=T,A.sunLength=f,A.directionalLength=g,A.pointLength=m,A.spotLength=v,A.rectAreaLength=E,A.hemiLength=y,A.numSunShadows=p,A.numDirectionalShadows=S,A.numPointShadows=b,A.numSpotShadows=x,A.numSpotMaps=M,A.numLightProbes=T,n.version=u_++)}function l(c,h){let u=0,d=0,f=0,p=0,_=0,g=0,m=h.matrixWorldInverse;for(let v=0,E=c.length;v<E;v++){let y=c[v];if(y.isSunLight){let S=n.sun[u];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(m),u++}else if(y.isDirectionalLight){let S=n.directional[d];S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),d++}else if(y.isSpotLight){let S=n.spot[p];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),p++}else if(y.isRectAreaLight){let S=n.rectArea[_];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),o.identity(),r.copy(y.matrixWorld),r.premultiply(m),o.extractRotation(r),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),_++}else if(y.isPointLight){let S=n.point[f];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),f++}else if(y.isHemisphereLight){let S=n.hemi[g];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(m),g++}}}return{setup:a,setupView:l,state:n}}function Jd(i){let e=new f_(i),t=[],n=[],s=[];function r(u){h.camera=u,t.length=0,n.length=0,s.length=0}function o(u){u.isLightProbeGrid?s.push(u):t.push(u)}function a(u){n.push(u)}function l(){e.setup(t),s.sort((u,d)=>u.priority-d.priority||u.id-d.id)}function c(u){e.setupView(t,u)}let h={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function p_(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Jd(i),e.set(s,[a])):r>=o.length?(a=new Jd(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var m_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,g_=`uniform sampler2D shadow_pass;
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
}`,__=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],x_=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],$d=new Xe,Ao=new P,K1=new P;function y_(i,e,t){let n=new Ai,s=new te,r=new te,o=new Pt,a=new qa,l=new Za,c={},h=t.maxTextureSize,u={[Zn]:Wt,[Wt]:Zn,[Dt]:Dt},d=new Tt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new te},radius:{value:4}},vertexShader:m_,fragmentShader:g_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let p=new gt;p.setAttribute("position",new Ft(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new W(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=fo;let m=this.type;this.render=function(b,x,M){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;this.type===ll&&(Ze("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=fo);let I=i.getRenderTarget(),T=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),L=i.state;L.setBlending(pi),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let U=m!==this.type;U&&x.traverse(function(C){C.material&&(Array.isArray(C.material)?C.material.forEach(N=>N.needsUpdate=!0):C.material.needsUpdate=!0)});for(let C=0,N=b.length;C<N;C++){let O=b[C],B=O.shadow;if(B===void 0){Ze("WebGLShadowMap:",O,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);let V=B.getFrameExtents();s.multiply(V),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/V.x),s.x=r.x*V.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/V.y),s.y=r.y*V.y,B.mapSize.y=r.y));let H=i.state.buffers.depth.getReversed();if(B.camera._reversedDepth=H,B.map===null||U===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Js){if(O.isPointLight){Ze("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new zt(s.x,s.y,{format:Ui,type:Xt,minFilter:pn,magFilter:pn,generateMipmaps:!1}),B.map.texture.name=O.name+".shadowMap",B.map.depthTexture=new hi(s.x,s.y,In),B.map.depthTexture.name=O.name+".shadowMapDepth",B.map.depthTexture.format=ai,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=jt,B.map.depthTexture.magFilter=jt}else O.isPointLight?(B.map=new Po(s.x),B.map.depthTexture=new Wr(s.x,Bn)):(B.map=new zt(s.x,s.y),B.map.depthTexture=new hi(s.x,s.y,Bn)),B.map.depthTexture.name=O.name+".shadowMap",B.map.depthTexture.format=ai,this.type===fo?(B.map.depthTexture.compareFunction=H?P1:C1,B.map.depthTexture.minFilter=pn,B.map.depthTexture.magFilter=pn):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=jt,B.map.depthTexture.magFilter=jt);B.camera.updateProjectionMatrix()}B.map.isWebGLCubeRenderTarget!==!0&&(B.map.width!==s.x||B.map.height!==s.y)&&B.map.setSize(s.x,s.y);let X=B.map.isWebGLCubeRenderTarget?6:B.getViewportCount();O.isPointLight!==!0&&B.updateMatrices(O,M);let J=(B.camera.layers.mask&4294967294)!==0?B.camera.layers:M.layers;for(let j=0;j<X;j++){let ce=B.getCamera(j);if(O.isPointLight){let k=B.camera,Q=B.matrix,ae=O.distance||k.far;ae!==k.far&&(k.far=ae,k.updateProjectionMatrix()),Ao.setFromMatrixPosition(O.matrixWorld),k.position.copy(Ao),K1.copy(k.position),K1.add(__[j]),k.up.copy(x_[j]),k.lookAt(K1),k.updateMatrixWorld(),Q.makeTranslation(-Ao.x,-Ao.y,-Ao.z),$d.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),B._frustum.setFromProjectionMatrix($d,k.coordinateSystem,k.reversedDepth)}if(B.map.isWebGLCubeRenderTarget)i.setRenderTarget(B.map,j),i.clear();else{j===0&&(i.setRenderTarget(B.map),i.clear());let k=B.getViewport(j);o.set(r.x*k.x,r.y*k.y,r.x*k.z,r.y*k.w),L.viewport(o)}n=B.getFrustum(j),y(x,M,ce,O,J,this.type)}B.isPointLightShadow!==!0&&this.type===Js&&v(B,M),B.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(I,T,A)};function v(b,x){let M=e.update(_);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null?b.mapPass=new zt(s.x,s.y,{format:Ui,type:Xt}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),d.uniforms.shadow_pass.value=b.map.depthTexture,d.uniforms.resolution.value.set(b.map.width,b.map.height),d.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(x,null,M,d,_,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value.set(b.map.width,b.map.height),f.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(x,null,M,f,_,null)}function E(b,x,M,I){let T=null,A=M.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(A!==void 0)T=A;else if(T=M.isPointLight===!0?l:a,i.localClippingEnabled&&x.clipShadows===!0&&Array.isArray(x.clippingPlanes)&&x.clippingPlanes.length!==0||x.displacementMap&&x.displacementScale!==0||x.alphaMap&&x.alphaTest>0||x.map&&x.alphaTest>0||x.alphaToCoverage===!0){let L=T.uuid,U=x.uuid,C=c[L];C===void 0&&(C={},c[L]=C);let N=C[U];N===void 0&&(N=T.clone(),C[U]=N,x.addEventListener("dispose",S)),T=N}if(T.visible=x.visible,T.wireframe=x.wireframe,I===Js?T.side=x.shadowSide!==null?x.shadowSide:x.side:T.side=x.shadowSide!==null?x.shadowSide:u[x.side],T.alphaMap=x.alphaMap,T.alphaTest=x.alphaToCoverage===!0?.5:x.alphaTest,T.map=x.map,T.clipShadows=x.clipShadows,T.clippingPlanes=x.clippingPlanes,T.clipIntersection=x.clipIntersection,T.displacementMap=x.displacementMap,T.displacementScale=x.displacementScale,T.displacementBias=x.displacementBias,T.wireframeLinewidth=x.wireframeLinewidth,T.linewidth=x.linewidth,M.isPointLight===!0&&T.isMeshDistanceMaterial===!0){let L=i.properties.get(T);L.light=M}return T}function y(b,x,M,I,T,A){if(b.visible===!1)return;if(b.layers.test(T)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&A===Js)&&(!b.frustumCulled||b.intersectsFrustum(n))){b.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,b.matrixWorld);let C=e.update(b),N=b.material;if(Array.isArray(N)){let O=C.groups;for(let B=0,V=O.length;B<V;B++){let H=O[B],X=N[H.materialIndex];if(X&&X.visible){let J=E(b,X,I,A);b.onBeforeShadow(i,b,x,M,C,J,H),i.renderBufferDirect(M,null,C,J,b,H),b.onAfterShadow(i,b,x,M,C,J,H)}}}else if(N.visible){let O=E(b,N,I,A);b.onBeforeShadow(i,b,x,M,C,O,null),i.renderBufferDirect(M,null,C,O,b,null),b.onAfterShadow(i,b,x,M,C,O,null)}}let U=b.children;for(let C=0,N=U.length;C<N;C++)y(U[C],x,M,I,T,A)}function S(b){b.target.removeEventListener("dispose",S);for(let M in c){let I=c[M],T=b.target.uuid;T in I&&(I[T].dispose(),delete I[T])}}}function v_(i,e){function t(){let F=!1,se=new Pt,$=null,Se=new Pt(0,0,0,0);return{setMask:function(xe){$!==xe&&!F&&(i.colorMask(xe,xe,xe,xe),$=xe)},setLocked:function(xe){F=xe},setClear:function(xe,Ee,We,ht,me){me===!0&&(xe*=ht,Ee*=ht,We*=ht),se.set(xe,Ee,We,ht),Se.equals(se)===!1&&(i.clearColor(xe,Ee,We,ht),Se.copy(se))},reset:function(){F=!1,$=null,Se.set(-1,0,0,0)}}}function n(){let F=!1,se=!1,$=null,Se=null,xe=null;return{setReversed:function(Ee){if(se!==Ee){let We=e.get("EXT_clip_control");Ee?We.clipControlEXT(We.LOWER_LEFT_EXT,We.ZERO_TO_ONE_EXT):We.clipControlEXT(We.LOWER_LEFT_EXT,We.NEGATIVE_ONE_TO_ONE_EXT),se=Ee;let ht=xe;xe=null,this.setClear(ht)}},getReversed:function(){return se},setTest:function(Ee){Ee?he(i.DEPTH_TEST):De(i.DEPTH_TEST)},setMask:function(Ee){$!==Ee&&!F&&(i.depthMask(Ee),$=Ee)},setFunc:function(Ee){if(se&&(Ee=Ed[Ee]),Se!==Ee){switch(Ee){case wa:i.depthFunc(i.NEVER);break;case Ra:i.depthFunc(i.ALWAYS);break;case Aa:i.depthFunc(i.LESS);break;case Ns:i.depthFunc(i.LEQUAL);break;case Ca:i.depthFunc(i.EQUAL);break;case Pa:i.depthFunc(i.GEQUAL);break;case Ia:i.depthFunc(i.GREATER);break;case La:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Se=Ee}},setLocked:function(Ee){F=Ee},setClear:function(Ee){xe!==Ee&&(xe=Ee,se&&(Ee=1-Ee),i.clearDepth(Ee))},reset:function(){F=!1,$=null,Se=null,xe=null,se=!1}}}function s(){let F=!1,se=null,$=null,Se=null,xe=null,Ee=null,We=null,ht=null,me=null;return{setTest:function(Ye){F||(Ye?he(i.STENCIL_TEST):De(i.STENCIL_TEST))},setMask:function(Ye){se!==Ye&&!F&&(i.stencilMask(Ye),se=Ye)},setFunc:function(Ye,at,Le){($!==Ye||Se!==at||xe!==Le)&&(i.stencilFunc(Ye,at,Le),$=Ye,Se=at,xe=Le)},setOp:function(Ye,at,Le){(Ee!==Ye||We!==at||ht!==Le)&&(i.stencilOp(Ye,at,Le),Ee=Ye,We=at,ht=Le)},setLocked:function(Ye){F=Ye},setClear:function(Ye){me!==Ye&&(i.clearStencil(Ye),me=Ye)},reset:function(){F=!1,se=null,$=null,Se=null,xe=null,Ee=null,We=null,ht=null,me=null}}}let r=new t,o=new n,a=new s,l={},c=new WeakMap,h={},u={},d={},f=new WeakMap,p=[],_=null,g=!1,m=null,v=null,E=null,y=null,S=null,b=null,x=null,M=new le(0,0,0),I=0,T=!1,A=null,L=null,U=null,C=null,N=null,O=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),B=!1,V=0,H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(H)[1]),B=V>=1):H.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),B=V>=2);let X=null,J={},j=i.getParameter(i.SCISSOR_BOX),ce=i.getParameter(i.VIEWPORT),k=new Pt().fromArray(j),Q=new Pt().fromArray(ce);function ae(F,se,$,Se){let xe=new Uint8Array(4),Ee=i.createTexture();i.bindTexture(F,Ee),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let We=0;We<$;We++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(se,0,i.RGBA,1,1,Se,0,i.RGBA,i.UNSIGNED_BYTE,xe):i.texImage2D(se+We,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,xe);return Ee}let Pe={};Pe[i.TEXTURE_2D]=ae(i.TEXTURE_2D,i.TEXTURE_2D,1),Pe[i.TEXTURE_CUBE_MAP]=ae(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Pe[i.TEXTURE_2D_ARRAY]=ae(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Pe[i.TEXTURE_3D]=ae(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),he(i.DEPTH_TEST),o.setFunc(Ns),Ue(!1),Te(_1),he(i.CULL_FACE),pe(pi);function he(F){h[F]!==!0&&(i.enable(F),h[F]=!0)}function De(F){h[F]!==!1&&(i.disable(F),h[F]=!1)}function rt(F,se){return d[F]!==se?(i.bindFramebuffer(F,se),d[F]=se,F===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=se),F===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=se),!0):!1}function Ie(F,se){let $=p,Se=!1;if(F){$=f.get(se),$===void 0&&($=[],f.set(se,$));let xe=F.textures;if($.length!==xe.length||$[0]!==i.COLOR_ATTACHMENT0){for(let Ee=0,We=xe.length;Ee<We;Ee++)$[Ee]=i.COLOR_ATTACHMENT0+Ee;$.length=xe.length,Se=!0}}else $[0]!==i.BACK&&($[0]=i.BACK,Se=!0);Se&&i.drawBuffers($)}function Ve(F){return _!==F?(i.useProgram(F),_=F,!0):!1}let Je={[is]:i.FUNC_ADD,[Xu]:i.FUNC_SUBTRACT,[Yu]:i.FUNC_REVERSE_SUBTRACT};Je[qu]=i.MIN,Je[Zu]=i.MAX;let re={[Ku]:i.ZERO,[Ju]:i.ONE,[$u]:i.SRC_COLOR,[v1]:i.SRC_ALPHA,[id]:i.SRC_ALPHA_SATURATE,[td]:i.DST_COLOR,[Qu]:i.DST_ALPHA,[ju]:i.ONE_MINUS_SRC_COLOR,[M1]:i.ONE_MINUS_SRC_ALPHA,[nd]:i.ONE_MINUS_DST_COLOR,[ed]:i.ONE_MINUS_DST_ALPHA,[sd]:i.CONSTANT_COLOR,[rd]:i.ONE_MINUS_CONSTANT_COLOR,[od]:i.CONSTANT_ALPHA,[ad]:i.ONE_MINUS_CONSTANT_ALPHA};function pe(F,se,$,Se,xe,Ee,We,ht,me,Ye){if(F===pi){g===!0&&(De(i.BLEND),g=!1);return}if(g===!1&&(he(i.BLEND),g=!0),F!==Wu){if(F!==m||Ye!==T){if((v!==is||S!==is)&&(i.blendEquation(i.FUNC_ADD),v=is,S=is),Ye)switch(F){case $s:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $e:i.blendFunc(i.ONE,i.ONE);break;case x1:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case y1:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ke("WebGLState: Invalid blending: ",F);break}else switch(F){case $s:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $e:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case x1:Ke("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case y1:Ke("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ke("WebGLState: Invalid blending: ",F);break}E=null,y=null,b=null,x=null,M.set(0,0,0),I=0,m=F,T=Ye}return}xe=xe||se,Ee=Ee||$,We=We||Se,(se!==v||xe!==S)&&(i.blendEquationSeparate(Je[se],Je[xe]),v=se,S=xe),($!==E||Se!==y||Ee!==b||We!==x)&&(i.blendFuncSeparate(re[$],re[Se],re[Ee],re[We]),E=$,y=Se,b=Ee,x=We),(ht.equals(M)===!1||me!==I)&&(i.blendColor(ht.r,ht.g,ht.b,me),M.copy(ht),I=me),m=F,T=!1}function _e(F,se){F.side===Dt?De(i.CULL_FACE):he(i.CULL_FACE);let $=F.side===Wt;se&&($=!$),Ue($),F.blending===$s&&F.transparent===!1?pe(pi):pe(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),r.setMask(F.colorWrite);let Se=F.stencilWrite;a.setTest(Se),Se&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),ie(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?he(i.SAMPLE_ALPHA_TO_COVERAGE):De(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ue(F){A!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),A=F)}function Te(F){F!==ku?(he(i.CULL_FACE),F!==L&&(F===_1?i.cullFace(i.BACK):F===Vu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):De(i.CULL_FACE),L=F}function et(F){F!==U&&(B&&i.lineWidth(F),U=F)}function ie(F,se,$){F?(he(i.POLYGON_OFFSET_FILL),(C!==se||N!==$)&&(C=se,N=$,o.getReversed()&&(se=-se,$=-$),i.polygonOffset(se,$))):De(i.POLYGON_OFFSET_FILL)}function ye(F){F?he(i.SCISSOR_TEST):De(i.SCISSOR_TEST)}function Ge(F){F===void 0&&(F=i.TEXTURE0+O-1),X!==F&&(i.activeTexture(F),X=F)}function nt(F,se,$){$===void 0&&(X===null?$=i.TEXTURE0+O-1:$=X);let Se=J[$];Se===void 0&&(Se={type:void 0,texture:void 0},J[$]=Se),(Se.type!==F||Se.texture!==se)&&(X!==$&&(i.activeTexture($),X=$),i.bindTexture(F,se||Pe[F]),Se.type=F,Se.texture=se)}function z(){let F=J[X];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function Rt(){try{i.compressedTexImage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function ot(){try{i.compressedTexImage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function Mt(){try{i.texSubImage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function ve(){try{i.texSubImage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function Ot(){try{i.compressedTexSubImage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function qe(){try{i.compressedTexSubImage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function Qe(){try{i.texStorage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function D(){try{i.texStorage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function w(){try{i.texImage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function q(){try{i.texImage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function fe(F){return u[F]!==void 0?u[F]:i.getParameter(F)}function oe(F,se){u[F]!==se&&(i.pixelStorei(F,se),u[F]=se)}function Me(F){k.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),k.copy(F))}function Re(F){Q.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),Q.copy(F))}function ee(F,se){let $=c.get(se);$===void 0&&($=new WeakMap,c.set(se,$));let Se=$.get(F);Se===void 0&&(Se=i.getUniformBlockIndex(se,F.name),i.uniformBlockBinding(se,Se,Se),$.set(F,Se))}function ne(F,se,$){let xe=c.get(se).get(F);l[xe]!==$&&(i.bindBufferBase(i.UNIFORM_BUFFER,xe,$),l[xe]=$)}function be(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},u={},X=null,J={},d={},l={},f=new WeakMap,p=[],_=null,g=!1,m=null,v=null,E=null,y=null,S=null,b=null,x=null,M=new le(0,0,0),I=0,T=!1,A=null,L=null,U=null,C=null,N=null,k.set(0,0,i.canvas.width,i.canvas.height),Q.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:he,disable:De,bindFramebuffer:rt,drawBuffers:Ie,useProgram:Ve,setBlending:pe,setMaterial:_e,setFlipSided:Ue,setCullFace:Te,setLineWidth:et,setPolygonOffset:ie,setScissorTest:ye,activeTexture:Ge,bindTexture:nt,unbindTexture:z,compressedTexImage2D:Rt,compressedTexImage3D:ot,texImage2D:w,texImage3D:q,pixelStorei:oe,getParameter:fe,updateUBOMapping:ee,uniformBlockBinding:ne,texStorage2D:Qe,texStorage3D:D,texSubImage2D:Mt,texSubImage3D:ve,compressedTexSubImage2D:Ot,compressedTexSubImage3D:qe,scissor:Me,viewport:Re,reset:be}}function M_(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new te,h=new WeakMap,u=new Set,d,f=new WeakMap,p=new Set,_=new FinalizationRegistry(D=>p.delete(D)),g=!1;try{g=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(D,w){return g?new OffscreenCanvas(D,w):Dr("canvas")}function v(D,w,q){let fe=1,oe=Qe(D);if((oe.width>q||oe.height>q)&&(fe=q/Math.max(oe.width,oe.height)),fe<1)if(typeof HTMLImageElement!="undefined"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&D instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&D instanceof ImageBitmap||typeof VideoFrame!="undefined"&&D instanceof VideoFrame){let Me=Math.floor(fe*oe.width),Re=Math.floor(fe*oe.height);d===void 0&&(d=m(Me,Re));let ee=w?m(Me,Re):d;return ee.width=Me,ee.height=Re,ee.getContext("2d").drawImage(D,0,0,Me,Re),Ze("WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+Me+"x"+Re+")."),ee}else return"data"in D&&Ze("WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),D;return D}function E(D){return D.generateMipmaps}function y(D){i.generateMipmap(D)}function S(D){return D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?i.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(D,w,q,fe,oe,Me=!1){if(D!==null){if(i[D]!==void 0)return i[D];Ze("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let Re;fe&&(Re=e.get("EXT_texture_norm16"),Re||Ze("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ee=w;if(w===i.RED&&(q===i.FLOAT&&(ee=i.R32F),q===i.HALF_FLOAT&&(ee=i.R16F),q===i.UNSIGNED_BYTE&&(ee=i.R8),q===i.UNSIGNED_SHORT&&Re&&(ee=Re.R16_EXT),q===i.SHORT&&Re&&(ee=Re.R16_SNORM_EXT)),w===i.RED_INTEGER&&(q===i.UNSIGNED_BYTE&&(ee=i.R8UI),q===i.UNSIGNED_SHORT&&(ee=i.R16UI),q===i.UNSIGNED_INT&&(ee=i.R32UI),q===i.BYTE&&(ee=i.R8I),q===i.SHORT&&(ee=i.R16I),q===i.INT&&(ee=i.R32I)),w===i.RG&&(q===i.FLOAT&&(ee=i.RG32F),q===i.HALF_FLOAT&&(ee=i.RG16F),q===i.UNSIGNED_BYTE&&(ee=i.RG8),q===i.UNSIGNED_SHORT&&Re&&(ee=Re.RG16_EXT),q===i.SHORT&&Re&&(ee=Re.RG16_SNORM_EXT)),w===i.RG_INTEGER&&(q===i.UNSIGNED_BYTE&&(ee=i.RG8UI),q===i.UNSIGNED_SHORT&&(ee=i.RG16UI),q===i.UNSIGNED_INT&&(ee=i.RG32UI),q===i.BYTE&&(ee=i.RG8I),q===i.SHORT&&(ee=i.RG16I),q===i.INT&&(ee=i.RG32I)),w===i.RGB_INTEGER&&(q===i.UNSIGNED_BYTE&&(ee=i.RGB8UI),q===i.UNSIGNED_SHORT&&(ee=i.RGB16UI),q===i.UNSIGNED_INT&&(ee=i.RGB32UI),q===i.BYTE&&(ee=i.RGB8I),q===i.SHORT&&(ee=i.RGB16I),q===i.INT&&(ee=i.RGB32I)),w===i.RGBA_INTEGER&&(q===i.UNSIGNED_BYTE&&(ee=i.RGBA8UI),q===i.UNSIGNED_SHORT&&(ee=i.RGBA16UI),q===i.UNSIGNED_INT&&(ee=i.RGBA32UI),q===i.BYTE&&(ee=i.RGBA8I),q===i.SHORT&&(ee=i.RGBA16I),q===i.INT&&(ee=i.RGBA32I)),w===i.RGB&&(q===i.UNSIGNED_SHORT&&Re&&(ee=Re.RGB16_EXT),q===i.SHORT&&Re&&(ee=Re.RGB16_SNORM_EXT),q===i.UNSIGNED_INT_5_9_9_9_REV&&(ee=i.RGB9_E5),q===i.UNSIGNED_INT_10F_11F_11F_REV&&(ee=i.R11F_G11F_B10F)),w===i.RGBA){let ne=Me?Lr:ft.getTransfer(oe);q===i.FLOAT&&(ee=i.RGBA32F),q===i.HALF_FLOAT&&(ee=i.RGBA16F),q===i.UNSIGNED_BYTE&&(ee=ne===Et?i.SRGB8_ALPHA8:i.RGBA8),q===i.UNSIGNED_SHORT&&Re&&(ee=Re.RGBA16_EXT),q===i.SHORT&&Re&&(ee=Re.RGBA16_SNORM_EXT),q===i.UNSIGNED_SHORT_4_4_4_4&&(ee=i.RGBA4),q===i.UNSIGNED_SHORT_5_5_5_1&&(ee=i.RGB5_A1)}return(ee===i.R16F||ee===i.R32F||ee===i.RG16F||ee===i.RG32F||ee===i.RGBA16F||ee===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function x(D,w){let q;return D?w===null||w===Bn||w===os?q=i.DEPTH24_STENCIL8:w===In?q=i.DEPTH32F_STENCIL8:w===Qs&&(q=i.DEPTH24_STENCIL8,Ze("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Bn||w===os?q=i.DEPTH_COMPONENT24:w===In?q=i.DEPTH_COMPONENT32F:w===Qs&&(q=i.DEPTH_COMPONENT16),q}function M(D,w){return E(D)===!0||D.isFramebufferTexture&&D.minFilter!==jt&&D.minFilter!==pn?Math.log2(Math.max(w.width,w.height))+1:D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?w.mipmaps.length:1}function I(D){let w=new WeakRef(D);n.get(D).__ref=w,p.add(w),_.register(D,w,w)}function T(D){let w=n.get(D).__ref;w!==void 0&&(p.delete(w),_.unregister(w))}function A(D){U(D.target)}function L(D){C(D.target)}function U(D){D.removeEventListener("dispose",A),T(D),O(D),D.isVideoTexture&&h.delete(D),D.isHTMLTexture&&u.delete(D)}function C(D){D.removeEventListener("dispose",L),T(D),V(D)}function N(){for(let D of p){let w=D.deref();w!==void 0&&(w.isRenderTarget===!0?C(w):U(w))}p.clear(),u.clear()}function O(D){let w=n.get(D);if(w.__webglInit===void 0)return;let q=D.source,fe=f.get(q);if(fe){let oe=fe[w.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&B(D),Object.keys(fe).length===0&&f.delete(q)}n.remove(D)}function B(D){let w=n.get(D);i.deleteTexture(w.__webglTexture);let q=D.source,fe=f.get(q);delete fe[w.__cacheKey],o.memory.textures--}function V(D){let w=n.get(D);w.__depthDisposeCallback&&w.__depthDisposeCallback();let q=D.depthTexture;if(q&&q.renderTarget===D&&U(q),D.isWebGLCubeRenderTarget)for(let oe=0;oe<6;oe++){if(Array.isArray(w.__webglFramebuffer[oe]))for(let Me=0;Me<w.__webglFramebuffer[oe].length;Me++)i.deleteFramebuffer(w.__webglFramebuffer[oe][Me]);else i.deleteFramebuffer(w.__webglFramebuffer[oe]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[oe])}else{if(Array.isArray(w.__webglFramebuffer))for(let oe=0;oe<w.__webglFramebuffer.length;oe++)i.deleteFramebuffer(w.__webglFramebuffer[oe]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let oe=0;oe<w.__webglColorRenderbuffer.length;oe++)w.__webglColorRenderbuffer[oe]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[oe]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let fe=D.textures;for(let oe=0,Me=fe.length;oe<Me;oe++){let Re=n.get(fe[oe]);Re.__webglTexture&&(i.deleteTexture(Re.__webglTexture),o.memory.textures--),n.remove(fe[oe])}n.remove(D)}let H=0;function X(){H=0}function J(){return H}function j(D){H=D}function ce(){let D=H;return D>=s.maxTextures&&Ze("WebGLTextures: Trying to use "+(D+1)+" texture units while this GPU supports only "+s.maxTextures),H+=1,D}function k(D){let w=[];return w.push(D.wrapS),w.push(D.wrapT),w.push(D.wrapR||0),w.push(D.magFilter),w.push(D.minFilter),w.push(D.anisotropy),w.push(D.internalFormat),w.push(D.format),w.push(D.type),w.push(D.generateMipmaps),w.push(D.mipmapsAutoUpdate),w.push(D.premultiplyAlpha),w.push(D.flipY),w.push(D.unpackAlignment),w.push(D.colorSpace),w.join()}function Q(D,w){let q=n.get(D);if(D.isVideoTexture&&Ot(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&q.__version!==D.version){let fe=D.image;if(fe===null)Ze("WebGLRenderer: Texture marked for update but no image data found.");else if(fe.complete===!1)Ze("WebGLRenderer: Texture marked for update but image is incomplete");else{_e(q,D,w);return}}else D.isExternalTexture&&(q.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,q.__webglTexture,i.TEXTURE0+w)}function ae(D,w){let q=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&q.__version!==D.version){_e(q,D,w);return}else D.isExternalTexture&&(q.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,q.__webglTexture,i.TEXTURE0+w)}function Pe(D,w){let q=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&q.__version!==D.version){_e(q,D,w);return}t.bindTexture(i.TEXTURE_3D,q.__webglTexture,i.TEXTURE0+w)}function he(D,w){let q=n.get(D);if(D.version>0&&q.__version!==D.version){Ue(q,D,w);return}t.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture,i.TEXTURE0+w)}let De={[Ji]:i.REPEAT,[Vn]:i.CLAMP_TO_EDGE,[Da]:i.MIRRORED_REPEAT},rt={[jt]:i.NEAREST,[hd]:i.NEAREST_MIPMAP_NEAREST,[vo]:i.NEAREST_MIPMAP_LINEAR,[pn]:i.LINEAR,[dl]:i.LINEAR_MIPMAP_NEAREST,[mi]:i.LINEAR_MIPMAP_LINEAR},Ie={[pd]:i.NEVER,[I1]:i.ALWAYS,[md]:i.LESS,[C1]:i.LEQUAL,[gd]:i.EQUAL,[P1]:i.GEQUAL,[_d]:i.GREATER,[xd]:i.NOTEQUAL};function Ve(D,w){if(w.type===In&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===pn||w.magFilter===dl||w.magFilter===vo||w.magFilter===mi||w.minFilter===pn||w.minFilter===dl||w.minFilter===vo||w.minFilter===mi)&&Ze("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,De[w.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,De[w.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,De[w.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,rt[w.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,rt[w.minFilter]),w.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,Ie[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===jt||w.minFilter!==vo&&w.minFilter!==mi||w.type===In&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){let q=e.get("EXT_texture_filter_anisotropic");i.texParameterf(D,q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function Je(D,w){let q=!1;D.__webglInit===void 0&&(D.__webglInit=!0,w.addEventListener("dispose",A),I(w));let fe=w.source,oe=f.get(fe);oe===void 0&&(oe={},f.set(fe,oe));let Me=k(w);if(Me!==D.__cacheKey){oe[Me]===void 0&&(oe[Me]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,q=!0),oe[Me].usedTimes++;let Re=oe[D.__cacheKey];Re!==void 0&&(oe[D.__cacheKey].usedTimes--,Re.usedTimes===0&&B(w)),D.__cacheKey=Me,D.__webglTexture=oe[Me].texture}return q}function re(D,w,q){return Math.floor(Math.floor(D/q)/w)}function pe(D,w,q,fe){let Me=D.updateRanges;if(Me.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,w.width,w.height,q,fe,w.data);else{Me.sort((F,se)=>F.start-se.start);let Re=0;for(let F=1;F<Me.length;F++){let se=Me[Re],$=Me[F],Se=se.start+se.count,xe=re($.start,w.width,4),Ee=re(se.start,w.width,4);$.start<=Se+1&&xe===Ee&&re($.start+$.count-1,w.width,4)===xe?se.count=Math.max(se.count,$.start+$.count-se.start):(++Re,Me[Re]=$)}Me.length=Re+1;let ee=t.getParameter(i.UNPACK_ROW_LENGTH),ne=t.getParameter(i.UNPACK_SKIP_PIXELS),be=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,w.width);for(let F=0,se=Me.length;F<se;F++){let $=Me[F],Se=Math.floor($.start/4),xe=Math.ceil($.count/4),Ee=Se%w.width,We=Math.floor(Se/w.width),ht=xe,me=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ee),t.pixelStorei(i.UNPACK_SKIP_ROWS,We),t.texSubImage2D(i.TEXTURE_2D,0,Ee,We,ht,me,q,fe,w.data)}D.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,ee),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ne),t.pixelStorei(i.UNPACK_SKIP_ROWS,be)}}function _e(D,w,q){let fe=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(fe=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(fe=i.TEXTURE_3D);let oe=Je(D,w),Me=w.source;t.bindTexture(fe,D.__webglTexture,i.TEXTURE0+q);let Re=n.get(Me);if(Me.version!==Re.__version||oe===!0){if(t.activeTexture(i.TEXTURE0+q),(typeof ImageBitmap!="undefined"&&w.image instanceof ImageBitmap)===!1){let me=ft.getPrimaries(ft.workingColorSpace),Ye=w.colorSpace===_i?null:ft.getPrimaries(w.colorSpace),at=w.colorSpace===_i||me===Ye?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,at)}t.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment);let ne=v(w.image,!1,s.maxTextureSize);ne=qe(w,ne);let be=r.convert(w.format,w.colorSpace),F=r.convert(w.type),se=b(w.internalFormat,be,F,w.normalized,w.colorSpace,w.isVideoTexture);Ve(fe,w);let $,Se=w.mipmaps,xe=w.isVideoTexture!==!0,Ee=Re.__version===void 0||oe===!0,We=Me.dataReady,ht=M(w,ne);if(w.isDepthTexture)se=x(w.format===gi,w.type),Ee&&(xe?t.texStorage2D(i.TEXTURE_2D,1,se,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,se,ne.width,ne.height,0,be,F,null));else if(w.isDataTexture)if(Se.length>0){xe&&Ee&&t.texStorage2D(i.TEXTURE_2D,ht,se,Se[0].width,Se[0].height);for(let me=0,Ye=Se.length;me<Ye;me++)$=Se[me],xe?We&&t.texSubImage2D(i.TEXTURE_2D,me,0,0,$.width,$.height,be,F,$.data):t.texImage2D(i.TEXTURE_2D,me,se,$.width,$.height,0,be,F,$.data);w.generateMipmaps=!1}else xe?(Ee&&t.texStorage2D(i.TEXTURE_2D,ht,se,ne.width,ne.height),We&&pe(w,ne,be,F)):t.texImage2D(i.TEXTURE_2D,0,se,ne.width,ne.height,0,be,F,ne.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){xe&&Ee&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ht,se,Se[0].width,Se[0].height,ne.depth);for(let me=0,Ye=Se.length;me<Ye;me++)if($=Se[me],w.format!==Hn)if(be!==null)if(xe){if(We)if(w.layerUpdates.size>0){let at=k1($.width,$.height,w.format,w.type);for(let Le of w.layerUpdates){let At=$.data.subarray(Le*at/$.data.BYTES_PER_ELEMENT,(Le+1)*at/$.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,me,0,0,Le,$.width,$.height,1,be,At)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,me,0,0,0,$.width,$.height,ne.depth,be,$.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,me,se,$.width,$.height,ne.depth,0,$.data,0,0);else Ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else xe?We&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,me,0,0,0,$.width,$.height,ne.depth,be,F,$.data):t.texImage3D(i.TEXTURE_2D_ARRAY,me,se,$.width,$.height,ne.depth,0,be,F,$.data);w.layerUpdates.size>0&&w.clearLayerUpdates()}else{xe&&Ee&&t.texStorage2D(i.TEXTURE_2D,ht,se,Se[0].width,Se[0].height);for(let me=0,Ye=Se.length;me<Ye;me++)$=Se[me],w.format!==Hn?be!==null?xe?We&&t.compressedTexSubImage2D(i.TEXTURE_2D,me,0,0,$.width,$.height,be,$.data):t.compressedTexImage2D(i.TEXTURE_2D,me,se,$.width,$.height,0,$.data):Ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):xe?We&&t.texSubImage2D(i.TEXTURE_2D,me,0,0,$.width,$.height,be,F,$.data):t.texImage2D(i.TEXTURE_2D,me,se,$.width,$.height,0,be,F,$.data)}else if(w.isDataArrayTexture)if(xe){if(Ee&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ht,se,ne.width,ne.height,ne.depth),We)if(w.layerUpdates.size>0){let me=k1(ne.width,ne.height,w.format,w.type);for(let Ye of w.layerUpdates){let at=ne.data.subarray(Ye*me/ne.data.BYTES_PER_ELEMENT,(Ye+1)*me/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Ye,ne.width,ne.height,1,be,F,at)}w.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,be,F,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,se,ne.width,ne.height,ne.depth,0,be,F,ne.data);else if(w.isData3DTexture)xe?(Ee&&t.texStorage3D(i.TEXTURE_3D,ht,se,ne.width,ne.height,ne.depth),We&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,be,F,ne.data)):t.texImage3D(i.TEXTURE_3D,0,se,ne.width,ne.height,ne.depth,0,be,F,ne.data);else if(w.isFramebufferTexture){if(Ee)if(xe)t.texStorage2D(i.TEXTURE_2D,ht,se,ne.width,ne.height);else{let me=ne.width,Ye=ne.height;for(let at=0;at<ht;at++)t.texImage2D(i.TEXTURE_2D,at,se,me,Ye,0,be,F,null),me>>=1,Ye>>=1}}else if(w.isHTMLTexture){if("texElementImage2D"in i){let me=i.canvas;if(me.hasAttribute("layoutsubtree")||me.setAttribute("layoutsubtree","true"),ne.parentNode!==me){me.appendChild(ne),u.add(w),me.onpaint=Ye=>{let at=Ye.changedElements;for(let Le of u)at.includes(Le.image)&&(Le.needsUpdate=!0)},me.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ne);else{let at=i.RGBA,Le=i.RGBA,At=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,at,Le,At,ne)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Se.length>0){if(xe&&Ee){let me=Qe(Se[0]);t.texStorage2D(i.TEXTURE_2D,ht,se,me.width,me.height)}for(let me=0,Ye=Se.length;me<Ye;me++)$=Se[me],xe?We&&t.texSubImage2D(i.TEXTURE_2D,me,0,0,be,F,$):t.texImage2D(i.TEXTURE_2D,me,se,be,F,$);w.generateMipmaps=!1}else if(xe){if(Ee){let me=Qe(ne);t.texStorage2D(i.TEXTURE_2D,ht,se,me.width,me.height)}We&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,be,F,ne)}else t.texImage2D(i.TEXTURE_2D,0,se,be,F,ne);E(w)&&w.mipmapsAutoUpdate===!0&&y(fe),Re.__version=Me.version,w.onUpdate&&w.onUpdate(w)}D.__version=w.version}function Ue(D,w,q){if(w.image.length!==6)return;let fe=Je(D,w),oe=w.source;t.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+q);let Me=n.get(oe);if(oe.version!==Me.__version||fe===!0){t.activeTexture(i.TEXTURE0+q);let Re=ft.getPrimaries(ft.workingColorSpace),ee=w.colorSpace===_i?null:ft.getPrimaries(w.colorSpace),ne=w.colorSpace===_i||Re===ee?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);let be=w.isCompressedTexture||w.image[0].isCompressedTexture,F=w.image[0]&&w.image[0].isDataTexture,se=[];for(let Le=0;Le<6;Le++)!be&&!F?se[Le]=v(w.image[Le],!0,s.maxCubemapSize):se[Le]=F?w.image[Le].image:w.image[Le],se[Le]=qe(w,se[Le]);let $=se[0],Se=r.convert(w.format,w.colorSpace),xe=r.convert(w.type),Ee=b(w.internalFormat,Se,xe,w.normalized,w.colorSpace),We=w.isVideoTexture!==!0,ht=Me.__version===void 0||fe===!0,me=oe.dataReady,Ye=M(w,$);Ve(i.TEXTURE_CUBE_MAP,w);let at;if(w.isDepthTexture){if(Ee=x(w.format===gi,w.type),ht)if(We)t.texStorage2D(i.TEXTURE_CUBE_MAP,1,Ee,$.width,$.height);else for(let Le=0;Le<6;Le++)t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0,Ee,$.width,$.height,0,Se,xe,null)}else if(be){We&&ht&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ye,Ee,$.width,$.height);for(let Le=0;Le<6;Le++){at=se[Le].mipmaps;for(let At=0;At<at.length;At++){let Kt=at[At];w.format!==Hn?Se!==null?We?me&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,At,0,0,Kt.width,Kt.height,Se,Kt.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,At,Ee,Kt.width,Kt.height,0,Kt.data):Ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):We?me&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,At,0,0,Kt.width,Kt.height,Se,xe,Kt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,At,Ee,Kt.width,Kt.height,0,Se,xe,Kt.data)}}}else{if(at=w.mipmaps,We&&ht){at.length>0&&Ye++;let Le=Qe(se[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ye,Ee,Le.width,Le.height)}for(let Le=0;Le<6;Le++)if(F){We?me&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0,0,0,se[Le].width,se[Le].height,Se,xe,se[Le].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0,Ee,se[Le].width,se[Le].height,0,Se,xe,se[Le].data);for(let At=0;At<at.length;At++){let Mi=at[At].image[Le].image;We?me&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,At+1,0,0,Mi.width,Mi.height,Se,xe,Mi.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,At+1,Ee,Mi.width,Mi.height,0,Se,xe,Mi.data)}}else{We?me&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0,0,0,Se,xe,se[Le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0,Ee,Se,xe,se[Le]);for(let At=0;At<at.length;At++){let Kt=at[At];We?me&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,At+1,0,0,Se,xe,Kt.image[Le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,At+1,Ee,Se,xe,Kt.image[Le])}}}E(w)&&w.mipmapsAutoUpdate===!0&&y(i.TEXTURE_CUBE_MAP),Me.__version=oe.version,w.onUpdate&&w.onUpdate(w)}D.__version=w.version}function Te(D,w,q,fe,oe,Me){let Re=r.convert(q.format,q.colorSpace),ee=r.convert(q.type),ne=b(q.internalFormat,Re,ee,q.normalized,q.colorSpace),be=n.get(w),F=n.get(q);if(F.__renderTarget=w,!be.__hasExternalTextures){let se=Math.max(1,w.width>>Me),$=Math.max(1,w.height>>Me);oe===i.TEXTURE_3D||oe===i.TEXTURE_2D_ARRAY?t.texImage3D(oe,Me,ne,se,$,w.depth,0,Re,ee,null):t.texImage2D(oe,Me,ne,se,$,0,Re,ee,null)}t.bindFramebuffer(i.FRAMEBUFFER,D),ve(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,fe,oe,F.__webglTexture,0,Mt(w)):(oe===i.TEXTURE_2D||oe>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,fe,oe,F.__webglTexture,Me),t.bindFramebuffer(i.FRAMEBUFFER,null)}function et(D,w,q){if(i.bindRenderbuffer(i.RENDERBUFFER,D),w.depthBuffer){let fe=w.depthTexture,oe=fe&&fe.isDepthTexture?fe.type:null,Me=x(w.stencilBuffer,oe),Re=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ve(w)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Mt(w),Me,w.width,w.height):q?i.renderbufferStorageMultisample(i.RENDERBUFFER,Mt(w),Me,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,Me,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Re,i.RENDERBUFFER,D)}else{let fe=w.textures;for(let oe=0;oe<fe.length;oe++){let Me=fe[oe],Re=r.convert(Me.format,Me.colorSpace),ee=r.convert(Me.type),ne=b(Me.internalFormat,Re,ee,Me.normalized,Me.colorSpace);ve(w)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Mt(w),ne,w.width,w.height):q?i.renderbufferStorageMultisample(i.RENDERBUFFER,Mt(w),ne,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,ne,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ie(D,w,q){let fe=w.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,D),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let oe=n.get(w.depthTexture);oe.__renderTarget=w;let Me=fe?w.depthTexture.image[0]:w.depthTexture.image;(!oe.__webglTexture||Me.width!==w.width||Me.height!==w.height)&&(Me.width=w.width,Me.height=w.height,w.depthTexture.needsUpdate=!0),fe?he(w.depthTexture,0):Q(w.depthTexture,0);let Re=oe.__webglTexture,ee=Mt(w),ne=fe?i.TEXTURE_CUBE_MAP_POSITIVE_X+q:i.TEXTURE_2D,be=w.depthTexture.format===gi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(w.depthTexture.format===ai)ve(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,be,ne,Re,0,ee):i.framebufferTexture2D(i.FRAMEBUFFER,be,ne,Re,0);else if(w.depthTexture.format===gi)ve(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,be,ne,Re,0,ee):i.framebufferTexture2D(i.FRAMEBUFFER,be,ne,Re,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ye(D){let w=n.get(D),q=D.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==D.depthTexture){let fe=D.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),fe){let oe=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,fe.removeEventListener("dispose",oe)};fe.addEventListener("dispose",oe),w.__depthDisposeCallback=oe}w.__boundDepthTexture=fe}if(D.depthTexture&&!w.__autoAllocateDepthBuffer)if(q)for(let fe=0;fe<6;fe++)ie(w.__webglFramebuffer[fe],D,fe);else D.texture.mipmaps.length>0?ie(w.__webglFramebuffer[0],D,0):ie(w.__webglFramebuffer,D,0);else if(q){w.__webglDepthbuffer=[];for(let fe=0;fe<6;fe++)if(t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[fe]),w.__webglDepthbuffer[fe]===void 0)w.__webglDepthbuffer[fe]=i.createRenderbuffer(),et(w.__webglDepthbuffer[fe],D,!1);else{let oe=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Me=w.__webglDepthbuffer[fe];i.bindRenderbuffer(i.RENDERBUFFER,Me),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,Me)}}else if(D.texture.mipmaps.length>0?t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),et(w.__webglDepthbuffer,D,!1);else{let oe=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Me=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Me),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,Me)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ge(D,w,q){let fe=n.get(D);w!==void 0&&Te(fe.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),q!==void 0&&ye(D)}function nt(D){let w=D.texture,q=n.get(D),fe=n.get(w);D.addEventListener("dispose",L),I(D);let oe=D.textures,Me=D.isWebGLCubeRenderTarget===!0,Re=oe.length>1;if(Re||(fe.__webglTexture===void 0&&(fe.__webglTexture=i.createTexture()),fe.__version=w.version,o.memory.textures++),Me){q.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(w.mipmaps.length>0){q.__webglFramebuffer[ee]=[];for(let ne=0;ne<w.mipmaps.length;ne++)q.__webglFramebuffer[ee][ne]=i.createFramebuffer()}else q.__webglFramebuffer[ee]=i.createFramebuffer()}else{if(w.mipmaps.length>0){q.__webglFramebuffer=[];for(let ee=0;ee<w.mipmaps.length;ee++)q.__webglFramebuffer[ee]=i.createFramebuffer()}else q.__webglFramebuffer=i.createFramebuffer();if(Re)for(let ee=0,ne=oe.length;ee<ne;ee++){let be=n.get(oe[ee]);be.__webglTexture===void 0&&(be.__webglTexture=i.createTexture(),o.memory.textures++)}if(D.samples>0&&ve(D)===!1){q.__webglMultisampledFramebuffer=i.createFramebuffer(),q.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let ee=0;ee<oe.length;ee++){let ne=oe[ee];q.__webglColorRenderbuffer[ee]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,q.__webglColorRenderbuffer[ee]);let be=r.convert(ne.format,ne.colorSpace),F=r.convert(ne.type),se=b(ne.internalFormat,be,F,ne.normalized,ne.colorSpace,D.isXRRenderTarget===!0),$=Mt(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,$,se,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ee,i.RENDERBUFFER,q.__webglColorRenderbuffer[ee])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(q.__webglDepthRenderbuffer=i.createRenderbuffer(),et(q.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Me){t.bindTexture(i.TEXTURE_CUBE_MAP,fe.__webglTexture),Ve(i.TEXTURE_CUBE_MAP,w);for(let ee=0;ee<6;ee++)if(w.mipmaps.length>0)for(let ne=0;ne<w.mipmaps.length;ne++)Te(q.__webglFramebuffer[ee][ne],D,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ne);else Te(q.__webglFramebuffer[ee],D,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);E(w)?y(i.TEXTURE_CUBE_MAP):w.mipmaps.length>0&&i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),t.unbindTexture()}else if(Re){for(let ee=0,ne=oe.length;ee<ne;ee++){let be=oe[ee],F=n.get(be),se=i.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(se=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(se,F.__webglTexture),Ve(se,be),Te(q.__webglFramebuffer,D,be,i.COLOR_ATTACHMENT0+ee,se,0),E(be)&&y(se)}t.unbindTexture()}else{let ee=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(ee=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ee,fe.__webglTexture),Ve(ee,w),w.mipmaps.length>0)for(let ne=0;ne<w.mipmaps.length;ne++)Te(q.__webglFramebuffer[ne],D,w,i.COLOR_ATTACHMENT0,ee,ne);else Te(q.__webglFramebuffer,D,w,i.COLOR_ATTACHMENT0,ee,0);E(w)?y(ee):w.mipmaps.length>0&&i.texParameteri(ee,i.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),t.unbindTexture()}D.depthBuffer&&ye(D)}function z(D){let w=D.textures;for(let q=0,fe=w.length;q<fe;q++){let oe=w[q];if(E(oe)&&oe.mipmapsAutoUpdate===!0){let Me=S(D),Re=n.get(oe).__webglTexture;t.bindTexture(Me,Re),y(Me),t.unbindTexture()}}}let Rt=[];function ot(D){if(D.samples>0){if(ve(D)===!1){let w=D.textures,q=D.width,fe=D.height,oe=i.COLOR_BUFFER_BIT,Me=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Re=n.get(D),ee=w.length>1;if(ee)for(let be=0;be<w.length;be++)t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Re.__webglMultisampledFramebuffer),D.texture.mipmaps.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer);for(let be=0;be<w.length;be++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(oe|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(oe|=i.STENCIL_BUFFER_BIT)),ee){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Re.__webglColorRenderbuffer[be]);let F=n.get(w[be]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,F,0)}i.blitFramebuffer(0,0,q,fe,0,0,q,fe,oe,i.NEAREST),l===!0&&(Rt.length=0,Rt.push(i.COLOR_ATTACHMENT0+be),D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&Rt.push(Me),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Rt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ee)for(let be=0;be<w.length;be++){t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,Re.__webglColorRenderbuffer[be]);let F=n.get(w[be]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,F,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&l){let w=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function Mt(D){return Math.min(s.maxSamples,D.samples)}function ve(D){let w=n.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Ot(D){let w=o.render.frame;h.get(D)!==w&&(h.set(D,w),D.update())}function qe(D,w){let q=D.colorSpace,fe=D.format,oe=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||q!==Ir&&q!==_i&&(ft.getTransfer(q)===Et?(fe!==Hn||oe!==_n)&&Ze("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ke("WebGLTextures: Unsupported texture color space:",q)),w}function Qe(D){return typeof HTMLImageElement!="undefined"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame!="undefined"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=ce,this.resetTextureUnits=X,this.getTextureUnits=J,this.setTextureUnits=j,this.setTexture2D=Q,this.setTexture2DArray=ae,this.setTexture3D=Pe,this.setTextureCube=he,this.rebindTextures=Ge,this.setupRenderTarget=nt,this.updateRenderTargetMipmap=z,this.updateMultisampleRenderTarget=ot,this.setupDepthRenderbuffer=ye,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=ve,this.dispose=N}function E_(i,e){function t(n,s=_i){let r,o=ft.getTransfer(s);if(n===_n)return i.UNSIGNED_BYTE;if(n===pl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ml)return i.UNSIGNED_SHORT_5_5_5_1;if(n===T1)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===w1)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===b1)return i.BYTE;if(n===S1)return i.SHORT;if(n===Qs)return i.UNSIGNED_SHORT;if(n===fl)return i.INT;if(n===Bn)return i.UNSIGNED_INT;if(n===In)return i.FLOAT;if(n===Xt)return i.HALF_FLOAT;if(n===R1)return i.ALPHA;if(n===A1)return i.RGB;if(n===Hn)return i.RGBA;if(n===ai)return i.DEPTH_COMPONENT;if(n===gi)return i.DEPTH_STENCIL;if(n===gl)return i.RED;if(n===_l)return i.RED_INTEGER;if(n===Ui)return i.RG;if(n===xl)return i.RG_INTEGER;if(n===yl)return i.RGBA_INTEGER;if(n===Mo||n===Eo||n===bo||n===So)if(o===Et)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Mo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===bo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===So)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Mo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Eo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===bo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===So)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===vl||n===Ml||n===El||n===bl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===vl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ml)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===El)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===bl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Sl||n===Tl||n===wl||n===Rl||n===Al||n===To||n===Cl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Sl||n===Tl)return o===Et?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===wl)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Rl)return r.COMPRESSED_R11_EAC;if(n===Al)return r.COMPRESSED_SIGNED_R11_EAC;if(n===To)return r.COMPRESSED_RG11_EAC;if(n===Cl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Pl||n===Il||n===Ll||n===Dl||n===Nl||n===Ul||n===Ol||n===Fl||n===Bl||n===Hl||n===zl||n===Gl||n===kl||n===Vl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Pl)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Il)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ll)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Dl)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Nl)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ul)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ol)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Fl)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Bl)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Hl)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===zl)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Gl)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===kl)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Vl)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Wl||n===Xl||n===Yl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Wl)return o===Et?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Xl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Yl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ql||n===Zl||n===wo||n===Kl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ql)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Zl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===wo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Kl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===os?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var b_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,S_=`
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

}`,nh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Xr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Tt({vertexShader:b_,fragmentShader:S_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new W(new gn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ih=class extends Fn{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,p=null,_=typeof XRWebGLBinding!="undefined",g=new nh,m={},v=t.getContextAttributes(),E=null,y=null,S=[],b=[],x=new te,M=null,I=null,T=new tn;T.viewport=new Pt;let A=new tn;A.viewport=new Pt;let L=[T,A],U=new ol,C=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let Q=S[k];return Q===void 0&&(Q=new zs,S[k]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(k){let Q=S[k];return Q===void 0&&(Q=new zs,S[k]=Q),Q.getGripSpace()},this.getHand=function(k){let Q=S[k];return Q===void 0&&(Q=new zs,S[k]=Q),Q.getHandSpace()};function O(k){let Q=b.indexOf(k.inputSource);if(Q===-1)return;let ae=S[Q];ae!==void 0&&(ae.update(k.inputSource,k.frame,c||o),ae.dispatchEvent({type:k.type,data:k.inputSource}))}function B(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",V);for(let k=0;k<S.length;k++){let Q=b[k];Q!==null&&(b[k]=null,S[k].disconnect(Q))}C=null,N=null,g.reset();for(let k in m)delete m[k];if(e.setRenderTarget(E),f=null,d=null,u=null,s=null,y=null,ce.stop(),n.isPresenting=!1,e.setPixelRatio(M),e.setSize(x.width,x.height,!1),I!==null){let k=I.camera;k.fov=I.fov,k.zoom=I.zoom,k.updateProjectionMatrix(),I=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){r=k,n.isPresenting===!0&&Ze("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){a=k,n.isPresenting===!0&&Ze("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(k){c=k},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(k){if(s=k,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",B),s.addEventListener("inputsourceschange",V),v.xrCompatible!==!0&&await t.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(x),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ae=null,Pe=null,he=null;v.depth&&(he=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ae=v.stencil?gi:ai,Pe=v.stencil?os:Bn);let De={colorFormat:t.RGBA8,depthFormat:he,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(De),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new zt(d.textureWidth,d.textureHeight,{format:Hn,type:_n,depthTexture:new hi(d.textureWidth,d.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,ae),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let ae={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,ae),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new zt(f.framebufferWidth,f.framebufferHeight,{format:Hn,type:_n,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),ce.setContext(s),ce.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function V(k){for(let Q=0;Q<k.removed.length;Q++){let ae=k.removed[Q],Pe=b.indexOf(ae);Pe>=0&&(b[Pe]=null,S[Pe].disconnect(ae))}for(let Q=0;Q<k.added.length;Q++){let ae=k.added[Q],Pe=b.indexOf(ae);if(Pe===-1){for(let De=0;De<S.length;De++)if(De>=b.length){b.push(ae),Pe=De;break}else if(b[De]===null){b[De]=ae,Pe=De;break}if(Pe===-1)break}let he=S[Pe];he&&he.connect(ae)}}function H(k,Q){Q===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices(Q.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(s===null)return;let Q=k.near,ae=k.far;g.texture!==null&&(g.depthNear>0&&(Q=g.depthNear),g.depthFar>0&&(ae=g.depthFar)),U.near=A.near=T.near=Q,U.far=A.far=T.far=ae,(C!==U.near||N!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),C=U.near,N=U.far),U.layers.mask=k.layers.mask|6,T.layers.mask=U.layers.mask&-5,A.layers.mask=U.layers.mask&-3;let Pe=k.parent,he=U.cameras;H(U,Pe);for(let De=0;De<he.length;De++)H(he[De],Pe);U.projectionMatrix.copy(T.projectionMatrix),U.projectionMatrixInverse.copy(T.projectionMatrixInverse),I===null&&k.isPerspectiveCamera&&(I={camera:k,fov:k.fov,zoom:k.zoom}),X(k,U,Pe)};function X(k,Q,ae){ae===null?k.matrix.copy(Q.matrixWorld):(k.matrix.copy(ae.matrixWorld),k.matrix.invert(),k.matrix.multiply(Q.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy(Q.projectionMatrix),k.projectionMatrixInverse.copy(Q.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=Fs*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(k){l=k,d!==null&&(d.fixedFoveation=k),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=k)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(U)},this.getCameraTexture=function(k){return m[k]};let J=null;function j(k,Q){if(h=Q.getViewerPose(c||o),p=Q,h!==null){let ae=h.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let Pe=!1;ae.length!==U.cameras.length&&(U.cameras.length=0,Pe=!0);for(let Ie=0;Ie<ae.length;Ie++){let Ve=ae[Ie],Je=null;if(f!==null)Je=f.getViewport(Ve);else{let pe=u.getViewSubImage(d,Ve);Je=pe.viewport,Ie===0&&(e.setRenderTargetTextures(y,pe.colorTexture,pe.depthStencilTexture),e.setRenderTarget(y))}let re=L[Ie];re===void 0&&(re=new tn,re.layers.enable(Ie),re.viewport=new Pt,L[Ie]=re),re.matrix.fromArray(Ve.transform.matrix),re.matrix.decompose(re.position,re.quaternion,re.scale),re.projectionMatrix.fromArray(Ve.projectionMatrix),re.projectionMatrixInverse.copy(re.projectionMatrix).invert(),re.viewport.set(Je.x,Je.y,Je.width,Je.height),Ie===0&&(U.matrix.copy(re.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Pe===!0&&U.cameras.push(re)}let he=s.enabledFeatures;if(he&&he.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();let Ie=u.getDepthInformation(ae[0]);Ie&&Ie.isValid&&Ie.texture&&g.init(Ie,s.renderState)}if(he&&he.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let Ie=0;Ie<ae.length;Ie++){let Ve=ae[Ie].camera;if(Ve){let Je=m[Ve];Je||(Je=new Xr,m[Ve]=Je);let re=u.getCameraImage(Ve);Je.sourceTexture=re}}}}for(let ae=0;ae<S.length;ae++){let Pe=b[ae],he=S[ae];Pe!==null&&he!==void 0&&he.update(Pe,Q,c||o)}J&&J(k,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),p=null}let ce=new jd;ce.setAnimationLoop(j),this.setAnimationLoop=function(k){J=k},this.dispose=function(){}}},T_=new Xe,l2=new tt;l2.set(-1,0,0,0,1,0,0,0,1);function w_(i,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,H1(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,v,E,y){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(g,m):m.isMeshLambertMaterial?(r(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(g,m),u(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(g,m),d(g,m),m.isMeshPhysicalMaterial&&f(g,m,y)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),_(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&a(g,m)):m.isPointsMaterial?l(g,m,v,E):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Wt&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Wt&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let v=e.get(m),E=v.envMap,y=v.envMapRotation;E&&(g.envMap.value=E,g.envMapRotation.value.setFromMatrix4(T_.makeRotationFromEuler(y)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(l2),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function a(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,v,E){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*v,g.scale.value=E*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,v){g.ior.value=m.ior,m.diffuseRoughness>0&&(g.diffuseRoughness.value=m.diffuseRoughness,m.diffuseRoughnessMap&&(g.diffuseRoughnessMap.value=m.diffuseRoughnessMap,t(m.diffuseRoughnessMap,g.diffuseRoughnessMapTransform))),m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Wt&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.retroreflectivity>0&&(g.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessMinimum,g.iridescenceThicknessMaximum.value=m.iridescenceThicknessMaximum,m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function _(g,m){let v=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function R_(i,e,t,n){let s={},r={};function o(v,E){let y=E.program;n.uniformBlockBinding(v,y,s[v.id])}function a(v,E){let y=s[v.id];y===void 0&&(p(v),y=l(v),s[v.id]=y,v.addEventListener("dispose",g));let S=E.program;n.updateUBOMapping(v,S);let b=e.render.frame;r[v.id]!==b&&(c(v),r[v.id]=b)}function l(v){let E=i.createBuffer(),y=v.__size,S=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,y,S),i.bindBuffer(i.UNIFORM_BUFFER,null),E}function c(v){let E=s[v.id],y=v.uniforms,S=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let b=0,x=y.length;b<x;b++){let M=y[b];if(Array.isArray(M))for(let I=0,T=M.length;I<T;I++)h(M[I],b,I,S);else h(M,b,0,S)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(v,E,y,S){if(d(v,E,y,S)===!0){let b=v.__offset,x=v.value;if(Array.isArray(x)){let M=0;for(let I=0;I<x.length;I++){let T=x[I],A=_(T,!0);u(T,v.__data,M),M+=A.storage/Float32Array.BYTES_PER_ELEMENT}}else u(x,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,b,v.__data)}}function u(v,E,y){typeof v=="number"||typeof v=="boolean"?E[y]=v:v.isMatrix3?(E[y]=v.elements[0],E[y+1]=v.elements[1],E[y+2]=v.elements[2],E[y+3]=0,E[y+4]=v.elements[3],E[y+5]=v.elements[4],E[y+6]=v.elements[5],E[y+7]=0,E[y+8]=v.elements[6],E[y+9]=v.elements[7],E[y+10]=v.elements[8],E[y+11]=0):ArrayBuffer.isView(v)?E.set(v.subarray(0,E.length-y),y):v.toArray(E,y)}function d(v,E,y,S){let b=v.value,x=E+"_"+y;if(Array.isArray(b)){S[x]===void 0&&(S[x]=[]);let M=S[x],I=!1;for(let T=0;T<b.length;T++)f(b[T],M,T)===!0&&(I=!0);return I}return f(b,S,x)}function f(v,E,y){if(E[y]===void 0)return typeof v=="number"||typeof v=="boolean"?E[y]=v:ArrayBuffer.isView(v)?E[y]=v.slice():E[y]=v.clone(),!0;{let S=E[y];if(typeof v=="number"||typeof v=="boolean"){if(S!==v)return E[y]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(S.equals(v)===!1)return S.copy(v),!0}}return!1}function p(v){let E=v.uniforms,y=0,S=16;for(let x=0,M=E.length;x<M;x++){let I=Array.isArray(E[x])?E[x]:[E[x]];for(let T=0,A=I.length;T<A;T++){let L=I[T],U=Array.isArray(L.value)?L.value:[L.value],C=Array.isArray(E[x])||Array.isArray(L.value),N=y;for(let B=0,V=U.length;B<V;B++){let H=U[B],X=_(H,C),J=y%S,j=J%X.boundary,ce=J+j;y+=j,ce!==0&&S-ce<X.storage&&(y+=S-ce),B===0&&(N=y),y+=X.storage}let O=L.type==="int"?Int32Array:L.type==="uint"?Uint32Array:Float32Array;L.__data=new O((y-N)/Float32Array.BYTES_PER_ELEMENT),L.__offset=N}}let b=y%S;return b>0&&(y+=S-b),v.__size=y,v.__cache={},this}function _(v,E){let y={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(y.boundary=4,y.storage=4):v.isVector2?(y.boundary=8,y.storage=8):v.isVector3||v.isColor?(y.boundary=16,y.storage=12):v.isVector4?(y.boundary=16,y.storage=16):v.isMatrix3?(y.boundary=16,y.storage=48):v.isMatrix4?(y.boundary=16,y.storage=64):v.isTexture?Ze("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(y.boundary=16,y.storage=v.byteLength):Ze("WebGLRenderer: Unsupported uniform value type.",v),E===!0&&(y.boundary=16,y.storage=Math.ceil(y.storage/16)*16),y}function g(v){let E=v.target;E.removeEventListener("dispose",g),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function m(){for(let v in s)i.deleteBuffer(s[v]);s={},r={}}return{bind:o,update:a,dispose:m}}var A_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Jn=null;function C_(){return Jn===null&&(Jn=new kr(A_,16,16,Ui,Xt),Jn.name="DFG_LUT",Jn.minFilter=pn,Jn.magFilter=pn,Jn.wrapS=Vn,Jn.wrapT=Vn,Jn.generateMipmaps=!1,Jn.needsUpdate=!0),Jn}var ec=class{constructor(e={}){let{canvas:t=yd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=_n}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let _=f,g=new Set([yl,xl,_l]),m=new Set([_n,Bn,Qs,os,pl,ml]),v=new Uint32Array(4),E=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},S=null,b=null,x=[],M=[],I=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Kn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,A=!1,L=null,U=null,C=null,N=null;this._outputColorSpace=Mn;let O=0,B=0,V=null,H=-1,X=null,J=new Pt,j=new Pt,ce=null,k=new le(0),Q=0,ae=t.width,Pe=t.height,he=1,De=null,rt=null,Ie=new Pt(0,0,ae,Pe),Ve=new Pt(0,0,ae,Pe),Je=!1,re=new Ai,pe=new Ba,_e=!1,Ue=!1,Te=new Xe,et=new P,ie=new Pt,ye={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ge=!1;function nt(){return V===null?he:1}let z=n;function Rt(R,G){return t.getContext(R,G)}let ot,Mt,ve,Ot,qe,Qe,D,w,q,fe,oe,Me,Re,ee,ne,be,F,se,$,Se,xe,Ee,We;try{let R={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"187"}`),t.addEventListener("webglcontextlost",Ye,!1),t.addEventListener("webglcontextrestored",at,!1),t.addEventListener("webglcontextcreationerror",Le,!1),z===null){let G="webgl2";if(z=Rt(G,R),z===null)throw Rt(G)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ht()}catch(R){throw t.removeEventListener("webglcontextlost",Ye,!1),t.removeEventListener("webglcontextrestored",at,!1),t.removeEventListener("webglcontextcreationerror",Le,!1),Ke("WebGLRenderer: "+R.message),R}function ht(){ot=new zg(z),ot.init(),xe=new E_(z,ot),Mt=new Cg(z,ot,e,xe),ve=new v_(z,ot),Mt.reversedDepthBuffer&&d&&ve.buffers.depth.setReversed(!0),U=z.createFramebuffer(),C=z.createFramebuffer(),N=z.createFramebuffer(),Ot=new Vg(z),qe=new o_,Qe=new M_(z,ot,ve,qe,Mt,xe,Ot),D=new Hg(T),w=new Xm(z),Ee=new Rg(z,w),q=new Gg(z,w,Ot,Ee),fe=new Xg(z,q,w,Ee,Ot),se=new Wg(z,Mt,Qe),ne=new Pg(qe),oe=new r_(T,D,ot,Mt,Ee,ne),Me=new w_(T,qe),Re=new l_,ee=new p_(ot),F=new wg(T,D,ve,fe,p,l),be=new y_(T,fe,Mt),We=new R_(z,Ot,Mt,ve),$=new Ag(z,ot,Ot),Se=new kg(z,ot,Ot),Ot.programs=oe.programs,T.capabilities=Mt,T.extensions=ot,T.properties=qe,T.renderLists=Re,T.shadowMap=be,T.state=ve,T.info=Ot}_!==_n&&(I=new qg(_,t.width,t.height,a,s,r));let me=new ih(T,z);this.xr=me,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let R=ot.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){let R=ot.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return he},this.setPixelRatio=function(R){R!==void 0&&(he=R,this.setSize(ae,Pe,!1))},this.getSize=function(R){return R.set(ae,Pe)},this.setSize=function(R,G,K=!0){if(me.isPresenting){Ze("WebGLRenderer: Can't change size while VR device is presenting.");return}ae=R,Pe=G,t.width=Math.floor(R*he),t.height=Math.floor(G*he),K===!0&&(t.style.width=R+"px",t.style.height=G+"px"),I!==null&&I.setSize(t.width,t.height),this.setViewport(0,0,R,G)},this.getDrawingBufferSize=function(R){return R.set(ae*he,Pe*he).floor()},this.setDrawingBufferSize=function(R,G,K){ae=R,Pe=G,he=K,t.width=Math.floor(R*K),t.height=Math.floor(G*K),this.setViewport(0,0,R,G)},this.setEffects=function(R){if(_===_n){Ke("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(R){for(let G=0;G<R.length;G++)if(R[G].isOutputPass===!0){Ze("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}I.setEffects(R||[])},this.getCurrentViewport=function(R){return R.copy(J)},this.getViewport=function(R){return R.copy(Ie)},this.setViewport=function(R,G,K,Y){R.isVector4?Ie.set(R.x,R.y,R.z,R.w):Ie.set(R,G,K,Y),ve.viewport(J.copy(Ie).multiplyScalar(nt()).round())},this.getScissor=function(R){return R.copy(Ve)},this.setScissor=function(R,G,K,Y){R.isVector4?Ve.set(R.x,R.y,R.z,R.w):Ve.set(R,G,K,Y),ve.scissor(j.copy(Ve).multiplyScalar(nt()).round())},this.getScissorTest=function(){return Je},this.setScissorTest=function(R){ve.setScissorTest(Je=R)},this.setOpaqueSort=function(R){De=R},this.setTransparentSort=function(R){rt=R},this.getClearColor=function(R){return R.copy(F.getClearColor())},this.setClearColor=function(){F.setClearColor(...arguments)},this.getClearAlpha=function(){return F.getClearAlpha()},this.setClearAlpha=function(){F.setClearAlpha(...arguments)},this.clear=function(R=!0,G=!0,K=!0){let Y=0;if(R){let Z=!1;if(V!==null){let Ae=V.texture.format;Z=g.has(Ae)}if(Z){let Ae=V.texture.type,Fe=m.has(Ae),we=F.getClearColor(),Ne=F.getClearAlpha(),ze=we.r,it=we.g,pt=we.b;Fe?(v[0]=ze,v[1]=it,v[2]=pt,v[3]=Ne,z.clearBufferuiv(z.COLOR,0,v)):(E[0]=ze,E[1]=it,E[2]=pt,E[3]=Ne,z.clearBufferiv(z.COLOR,0,E))}else Y|=z.COLOR_BUFFER_BIT}G&&(Y|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(Y|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Y!==0&&z.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(R){R.setRenderer(this),L=R},this.dispose=function(){t.removeEventListener("webglcontextlost",Ye,!1),t.removeEventListener("webglcontextrestored",at,!1),t.removeEventListener("webglcontextcreationerror",Le,!1),F.dispose(),Re.dispose(),ee.dispose(),Qe.dispose(),qe.dispose(),D.dispose(),fe.dispose(),q.dispose(),Ee.dispose(),We.dispose(),oe.dispose(),me.dispose(),me.removeEventListener("sessionstart",Xh),me.removeEventListener("sessionend",Yh),ki.stop()};function Ye(R){R.preventDefault(),Nr("WebGLRenderer: Context Lost."),A=!0}function at(){Nr("WebGLRenderer: Context Restored."),A=!1;let R=Ot.autoReset,G=be.enabled,K=be.autoUpdate,Y=be.needsUpdate,Z=be.type;ht(),Ot.autoReset=R,be.enabled=G,be.autoUpdate=K,be.needsUpdate=Y,be.type=Z}function Le(R){Ke("WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function At(R){let G=R.target;G.removeEventListener("dispose",At),Kt(G)}function Kt(R){Mi(R),qe.remove(R)}function Mi(R){let G=qe.get(R).programs;G!==void 0&&(G.forEach(function(K){oe.releaseProgram(K)}),R.isShaderMaterial&&oe.releaseShaderCache(R))}this.renderBufferDirect=function(R,G,K,Y,Z,Ae){G===null&&(G=ye);let Fe=Z.isMesh&&Z.matrixWorld.determinantAffine()<0,we=m3(R,G,K,Y,Z);ve.setMaterial(Y,Fe);let Ne=K.index,ze=1;if(Y.wireframe===!0){if(Ne=q.getWireframeAttribute(K),Ne===void 0)return;ze=2}let it=K.drawRange,pt=K.attributes.position,Be=it.start*ze,mt=(it.start+it.count)*ze;Ae!==null&&(Be=Math.max(Be,Ae.start*ze),mt=Math.min(mt,(Ae.start+Ae.count)*ze)),Ne!==null?(Be=Math.max(Be,0),mt=Math.min(mt,Ne.count)):pt!=null&&(Be=Math.max(Be,0),mt=Math.min(mt,pt.count));let Gt=mt-Be;if(Gt<0||Gt===1/0)return;Ee.setup(Z,Y,we,K,Ne);let It,Ct=$;if(Ne!==null&&(It=w.get(Ne),Ct=Se,Ct.setIndex(It)),Z.isMesh)Y.wireframe===!0?(ve.setLineWidth(Y.wireframeLinewidth*nt()),Ct.setMode(z.LINES)):Ct.setMode(z.TRIANGLES);else if(Z.isLine){let rn=Y.linewidth;rn===void 0&&(rn=1),ve.setLineWidth(rn*nt()),Z.isLineSegments?Ct.setMode(z.LINES):Z.isLineLoop?Ct.setMode(z.LINE_LOOP):Ct.setMode(z.LINE_STRIP)}else Z.isPoints?Ct.setMode(z.POINTS):Z.isSprite&&Ct.setMode(z.TRIANGLES);if(Z.isBatchedMesh)if(ot.get("WEBGL_multi_draw"))Ct.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else{let rn=Z._multiDrawStarts,He=Z._multiDrawCounts,un=Z._multiDrawCount,St=Ne?w.get(Ne).bytesPerElement:1,Vi=qe.get(Y).currentProgram.getUniforms();for(let on=0;on<un;on++)Vi.setValue(z,"_gl_DrawID",on),Ct.render(rn[on]/St,He[on])}else if(Z.isInstancedMesh)Ct.renderInstances(Be,Gt,Z.count);else if(K.isInstancedBufferGeometry){let rn=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,He=Math.min(K.instanceCount,rn);Ct.renderInstances(Be,Gt,He)}else Ct.render(Be,Gt)};function Wh(R,G,K,Y){L!==null&&R.isNodeMaterial&&L.setObject(Y,R),_e===!0&&ne.setState(R,K,!1),R.transparent===!0&&R.side===Dt&&R.forceSinglePass===!1?(R.side=Wt,R.needsUpdate=!0,fr(R,G,Y),R.side=Zn,R.needsUpdate=!0,fr(R,G,Y),R.side=Dt):fr(R,G,Y)}this.compile=function(R,G,K=null){K===null&&(K=R),L!==null&&L.renderStart(R,G,K),b=ee.get(K),b.init(G),M.push(b),K.traverseVisible(function(Z){Z.isLight&&Z.layers.test(G.layers)&&(b.pushLight(Z),Z.castShadow&&b.pushShadow(Z))}),R!==K&&R.traverseVisible(function(Z){Z.isLight&&Z.layers.test(G.layers)&&(b.pushLight(Z),Z.castShadow&&b.pushShadow(Z))}),b.setupLights(),L!==null&&L.updateLights(b.state.lightsArray),Ue=this.localClippingEnabled,_e=ne.init(this.clippingPlanes,Ue),_e===!0&&ne.setGlobalState(this.clippingPlanes,G),L!==null&&be.render(b.state.shadowsArray,K,G);let Y=new Set;return R.traverse(function(Z){if(!(Z.isMesh||Z.isPoints||Z.isLine||Z.isSprite))return;let Ae=Z.material;if(Ae)if(Array.isArray(Ae))for(let Fe=0;Fe<Ae.length;Fe++){let we=Ae[Fe];Wh(we,K,G,Z),Y.add(we)}else Wh(Ae,K,G,Z),Y.add(Ae)}),b=M.pop(),L!==null&&L.renderEnd(),Y},this.compileAsync=function(R,G,K=null){let Y=this.compile(R,G,K);return new Promise(Z=>{function Ae(){if(Y.forEach(function(Fe){let Ne=qe.get(Fe).currentProgram;(Ne===void 0||Ne.isReady())&&Y.delete(Fe)}),Y.size===0){Z(R);return}setTimeout(Ae,10)}ot.get("KHR_parallel_shader_compile")!==null?Ae():setTimeout(Ae,10)})};let Lc=null;function f3(R){Lc&&Lc(R)}function Xh(){ki.stop()}function Yh(){ki.start()}let ki=new jd;ki.setAnimationLoop(f3),typeof self!="undefined"&&ki.setContext(self),this.setAnimationLoop=function(R){Lc=R,me.setAnimationLoop(R),R===null?ki.stop():ki.start()},me.addEventListener("sessionstart",Xh),me.addEventListener("sessionend",Yh),this.render=function(R,G){if(G!==void 0&&G.isCamera!==!0){Ke("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;L!==null&&L.renderStart(R,G);let K=me.enabled===!0&&me.isPresenting===!0,Y=I!==null&&(V===null||K)&&I.begin(T,V);if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),me.enabled===!0&&me.isPresenting===!0&&(I===null||I.isCompositing()===!1)&&(me.cameraAutoUpdate===!0&&me.updateCamera(G),G=me.getCamera()),R.isScene===!0&&R.onBeforeRender(T,R,G,V),b=ee.get(R,M.length),b.init(G),b.state.textureUnits=Qe.getTextureUnits(),M.push(b),Te.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),G.isArrayCamera?pe.setFromArrayCamera(G):re.setFromProjectionMatrix(Te,An,G.reversedDepth),Ue=this.localClippingEnabled,_e=ne.init(this.clippingPlanes,Ue),S=Re.get(R,x.length),S.init(),x.push(S),this.info.render.frame++,me.enabled===!0&&me.isPresenting===!0){let Fe=T.xr.getDepthSensingMesh();Fe!==null&&Dc(Fe,G,-1/0,T.sortObjects)}Dc(R,G,0,T.sortObjects),S.finish(),L!==null&&L.updateLights(b.state.lightsArray),T.sortObjects===!0&&S.sort(De,rt),Ge=me.enabled===!1||me.isPresenting===!1||me.hasDepthSensing()===!1,Ge&&F.addToRenderList(S,R),this.info.autoReset===!0&&this.info.reset(),_e===!0&&ne.beginShadows();let Z=b.state.shadowsArray;if(be.render(Z,R,G),_e===!0&&ne.endShadows(),(Y&&I.hasRenderPass())===!1){let Fe=S.opaque,we=S.transmissive;if(b.setupLights(),G.isArrayCamera){let Ne=G.cameras;if(we.length>0)for(let ze=0,it=Ne.length;ze<it;ze++){let pt=Ne[ze];Zh(Fe,we,R,pt)}Ge&&F.render(R);for(let ze=0,it=Ne.length;ze<it;ze++){let pt=Ne[ze];qh(S,R,pt,pt.viewport)}}else we.length>0&&Zh(Fe,we,R,G),Ge&&F.render(R),qh(S,R,G)}V!==null&&B===0&&(Qe.updateMultisampleRenderTarget(V),Qe.updateRenderTargetMipmap(V)),Y&&I.end(T),R.isScene===!0&&R.onAfterRender(T,R,G),Ee.resetDefaultState(),H=-1,X=null,M.pop(),M.length>0?(b=M[M.length-1],Qe.setTextureUnits(b.state.textureUnits),_e===!0&&ne.setGlobalState(T.clippingPlanes,b.state.camera)):b=null,x.pop(),x.length>0?S=x[x.length-1]:S=null,L!==null&&L.renderEnd()};function Dc(R,G,K,Y){if(R.visible===!1)return;if(R.layers.test(G.layers)){if(R.isGroup)K=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(G);else if(R.isLight)b.pushLight(R),R.castShadow&&b.pushShadow(R);else if(R.isSprite){let Fe=G.isArrayCamera?pe:re;if(!R.frustumCulled||R.intersectsFrustum(Fe)){Y&&ie.setFromMatrixPosition(R.matrixWorld).applyMatrix4(Te);let we=fe.update(R),Ne=R.material;Ne.visible&&S.push(R,we,Ne,K,ie.z,null,G)}}else if(R.isMesh||R.isLine||R.isPoints){let Fe=G.isArrayCamera?pe:re;if(!R.frustumCulled||R.intersectsFrustum(Fe)){let we=fe.update(R),Ne=R.material;if(Y&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),ie.copy(R.boundingSphere.center)):(we.boundingSphere===null&&we.computeBoundingSphere(),ie.copy(we.boundingSphere.center)),ie.applyMatrix4(R.matrixWorld).applyMatrix4(Te)),Array.isArray(Ne)){let ze=we.groups;for(let it=0,pt=ze.length;it<pt;it++){let Be=ze[it],mt=Ne[Be.materialIndex];mt&&mt.visible&&S.push(R,we,mt,K,ie.z,Be,G)}}else Ne.visible&&S.push(R,we,Ne,K,ie.z,null,G)}}}let Ae=R.children;for(let Fe=0,we=Ae.length;Fe<we;Fe++)Dc(Ae[Fe],G,K,Y)}function qh(R,G,K,Y){let{opaque:Z,transmissive:Ae,transparent:Fe}=R;b.setupLightsView(K),_e===!0&&ne.setGlobalState(T.clippingPlanes,K),Y&&ve.viewport(J.copy(Y)),Z.length>0&&Yo(Z,G,K),Ae.length>0&&Yo(Ae,G,K),Fe.length>0&&Yo(Fe,G,K),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function Zh(R,G,K,Y){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[Y.id]===void 0){let Be=ot.has("EXT_color_buffer_half_float")||ot.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[Y.id]=new zt(1,1,{generateMipmaps:!0,type:Be?Xt:_n,minFilter:mi,samples:Math.max(4,Mt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ft.workingColorSpace})}let Ae=b.state.transmissionRenderTarget[Y.id],Fe=Y.viewport||J;Ae.setSize(Fe.z*T.transmissionResolutionScale,Fe.w*T.transmissionResolutionScale);let we=T.getRenderTarget(),Ne=T.getActiveCubeFace(),ze=T.getActiveMipmapLevel();T.setRenderTarget(Ae),T.getClearColor(k),Q=T.getClearAlpha(),Q<1&&T.setClearColor(16777215,.5),T.clear(),Ge&&F.render(K);let it=T.toneMapping;T.toneMapping=Kn;let pt=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),b.setupLightsView(Y),_e===!0&&ne.setGlobalState(T.clippingPlanes,Y),Yo(R,K,Y),Qe.updateMultisampleRenderTarget(Ae),Qe.updateRenderTargetMipmap(Ae),ot.has("WEBGL_multisampled_render_to_texture")===!1){let Be=!1;for(let mt=0,Gt=G.length;mt<Gt;mt++){let It=G[mt],{object:Ct,geometry:rn,material:He,group:un}=It;if(He.side===Dt&&Ct.layers.test(Y.layers)){let St=He.side;He.side=Wt,He.needsUpdate=!0,Kh(Ct,K,Y,rn,He,un),He.side=St,He.needsUpdate=!0,Be=!0}}Be===!0&&(Qe.updateMultisampleRenderTarget(Ae),Qe.updateRenderTargetMipmap(Ae))}T.setRenderTarget(we,Ne,ze),T.setClearColor(k,Q),pt!==void 0&&(Y.viewport=pt),T.toneMapping=it}function Yo(R,G,K){let Y=G.isScene===!0?G.overrideMaterial:null;for(let Z=0,Ae=R.length;Z<Ae;Z++){let Fe=R[Z],{object:we,geometry:Ne,group:ze}=Fe,it=Fe.material;it.allowOverride===!0&&Y!==null&&(it=Y),we.layers.test(K.layers)&&Kh(we,G,K,Ne,it,ze)}}function Kh(R,G,K,Y,Z,Ae){L!==null&&Z.isNodeMaterial&&L.setObject(R,Z),R.onBeforeRender(T,G,K,Y,Z,Ae),R.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),Z.onBeforeRender(T,G,K,Y,R,Ae),Z.transparent===!0&&Z.side===Dt&&Z.forceSinglePass===!1?(Z.side=Wt,Z.needsUpdate=!0,T.renderBufferDirect(K,G,Y,Z,R,Ae),Z.side=Zn,Z.needsUpdate=!0,T.renderBufferDirect(K,G,Y,Z,R,Ae),Z.side=Dt):T.renderBufferDirect(K,G,Y,Z,R,Ae),R.onAfterRender(T,G,K,Y,Z,Ae)}function Jh(R){let G=0;for(let K of R)K.texture!==null&&G++;return G}function fr(R,G,K){G.isScene!==!0&&(G=ye);let Y=qe.get(R),Z=b.state.lights,Ae=b.state.shadowsArray,Fe=Z.state.version,we=oe.getParameters(R,Z.state,Ae,G,K,b.state.lightProbeGridArray),Ne=oe.getProgramCacheKey(we),ze=Y.programs;Y.environment=R.isMeshStandardMaterial||R.isMeshLambertMaterial||R.isMeshPhongMaterial?G.environment:null,Y.fog=G.fog;let it=R.isMeshStandardMaterial||R.isMeshLambertMaterial&&!R.envMap||R.isMeshPhongMaterial&&!R.envMap;Y.envMap=D.get(R.envMap||Y.environment,it),Y.envMapRotation=Y.environment!==null&&R.envMap===null?G.environmentRotation:R.envMapRotation,ze===void 0&&(R.addEventListener("dispose",At),ze=new Map,Y.programs=ze,Y.programVariants=new Map);let pt=ze.get(Ne);if(pt!==void 0){if(Y.currentProgram===pt&&Y.lightsStateVersion===Fe)return jh(R,we),pt}else we.uniforms=oe.getUniforms(R),L!==null&&R.isNodeMaterial&&L.build(R,K,we),R.onBeforeCompile(we,T),pt=oe.acquireProgram(we,Ne),ze.set(Ne,pt),Y.uniforms=we.uniforms;let Be=Y.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Be.clippingPlanes=ne.uniform),jh(R,we),Y.needsLights=_3(R),Y.lightsStateVersion=Fe,Y.needsLights&&(Be.ambientLightColor.value=Z.state.ambient,Be.lightProbe.value=Z.state.probe,Be.sunLights.value=Z.state.sun,Be.sunLightShadows.value=Z.state.sunShadow,Be.directionalLights.value=Z.state.directional,Be.directionalLightShadows.value=Z.state.directionalShadow,Be.spotLights.value=Z.state.spot,Be.spotLightShadows.value=Z.state.spotShadow,Be.rectAreaLights.value=Z.state.rectArea,Be.ltc_1.value=Z.state.rectAreaLTC1,Be.ltc_2.value=Z.state.rectAreaLTC2,Be.pointLights.value=Z.state.point,Be.pointLightShadows.value=Z.state.pointShadow,Be.hemisphereLights.value=Z.state.hemi,Be.sunShadowMatrix.value=Z.state.sunShadowMatrix,Be.sunShadowCascade.value=Z.state.sunShadowCascade,Be.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,Be.spotLightMatrix.value=Z.state.spotLightMatrix,Be.spotLightMap.value=Z.state.spotLightMap,Be.pointShadowMatrix.value=Z.state.pointShadowMatrix),Y.numLightProbeGrids=Jh(b.state.lightProbeGridArray),Y.currentProgram=pt,Y.uniformsList=null,pt}function p3(R,G,K,Y,Z){let Ae=qe.get(R),Fe=Ae.currentProgram.id+","+Y+","+Z,we=Ae.programVariants.get(Fe);return we===void 0?(we=fr(R,G,K),Ae.programVariants.set(Fe,we)):(Ae.currentProgram=we,Ae.uniformsList=null,Ae.outputColorSpace=Y,Ae.toneMapping=Z),we}function $h(R){if(R.uniformsList===null){let G=R.currentProgram.getUniforms();R.uniformsList=er.seqWithValue(G.seq,R.uniforms)}return R.uniformsList}function jh(R,G){let K=qe.get(R);K.outputColorSpace=G.outputColorSpace,K.batching=G.batching,K.batchingColor=G.batchingColor,K.instancing=G.instancing,K.instancingColor=G.instancingColor,K.instancingMorph=G.instancingMorph,K.skinning=G.skinning,K.morphTargets=G.morphTargets,K.morphNormals=G.morphNormals,K.morphColors=G.morphColors,K.morphTargetsCount=G.morphTargetsCount,K.numClippingPlanes=G.numClippingPlanes,K.numIntersection=G.numClipIntersection,K.vertexAlphas=G.vertexAlphas,K.vertexTangents=G.vertexTangents,K.toneMapping=G.toneMapping}function m3(R,G,K,Y,Z){G.isScene!==!0&&(G=ye),Qe.resetTextureUnits();let Ae=G.fog,Fe=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial?G.environment:null,we=V===null?T.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:ft.workingColorSpace,Ne=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial&&!Y.envMap||Y.isMeshPhongMaterial&&!Y.envMap,ze=D.get(Y.envMap||Fe,Ne),it=Y.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pt=!!K.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Be=!!K.morphAttributes.position,mt=!!K.morphAttributes.normal,Gt=!!K.morphAttributes.color,It=Kn;Y.toneMapped&&(V===null||V.isXRRenderTarget===!0)&&(It=T.toneMapping);let Ct=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,rn=Ct!==void 0?Ct.length:0,He=qe.get(Y),un=b.state.lights;if(_e===!0&&(Ue===!0||R!==X)){let Nt=R===X&&Y.id===H;ne.setState(Y,R,Nt)}let St=!1,Vi=!1;Y.version===He.__version?He.needsLights&&He.lightsStateVersion!==un.state.version||Z.isBatchedMesh&&He.batching===!1||!Z.isBatchedMesh&&He.batching===!0||Z.isBatchedMesh&&He.batchingColor===!0&&Z._colorsTexture===null||Z.isBatchedMesh&&He.batchingColor===!1&&Z._colorsTexture!==null||Z.isInstancedMesh&&He.instancing===!1||!Z.isInstancedMesh&&He.instancing===!0||Z.isSkinnedMesh&&He.skinning===!1||!Z.isSkinnedMesh&&He.skinning===!0||Z.isInstancedMesh&&He.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&He.instancingColor===!1&&Z.instanceColor!==null||Z.isInstancedMesh&&He.instancingMorph===!0&&Z.morphTexture===null||Z.isInstancedMesh&&He.instancingMorph===!1&&Z.morphTexture!==null||He.envMap!==ze||Y.fog===!0&&He.fog!==Ae||He.numClippingPlanes!==void 0&&(He.numClippingPlanes!==ne.numPlanes||He.numIntersection!==ne.numIntersection)||He.vertexAlphas!==it||He.vertexTangents!==pt||He.morphTargets!==Be||He.morphNormals!==mt||He.morphColors!==Gt||He.morphTargetsCount!==rn||He.numLightProbeGrids!==Jh(b.state.lightProbeGridArray)?St=!0:(He.outputColorSpace!==we||He.toneMapping!==It)&&(Vi=!0):(St=!0,He.__version=Y.version);let on=He.currentProgram;(St===!0||Vi===!0)&&(on=Vi===!0?p3(Y,G,Z,we,It):fr(Y,G,Z),L&&Y.isNodeMaterial&&L.onUpdateProgram(Y,on,He));let qo=!1,Ei=!1,Wi=!1,yt=on.getUniforms(),en=He.uniforms;if(ve.useProgram(on.program)&&(qo=!0,Ei=!0,Wi=!0),Y.id!==H&&(H=Y.id,Ei=!0),qo||X!==R){ve.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),yt.setValue(z,"projectionMatrix",R.projectionMatrix),yt.setValue(z,"viewMatrix",R.matrixWorldInverse);let Jt=yt.map.cameraPosition;Jt!==void 0&&Jt.setValue(z,et.setFromMatrixPosition(R.matrixWorld)),Mt.logarithmicDepthBuffer&&yt.setValue(z,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&yt.setValue(z,"isOrthographic",R.isOrthographicCamera===!0),X!==R&&(X=R,Ei=!0,Wi=!0)}if(He.needsLights&&(un.state.sunShadowMap.length>0&&yt.setValue(z,"sunShadowMap",un.state.sunShadowMap,Qe),un.state.directionalShadowMap.length>0&&yt.setValue(z,"directionalShadowMap",un.state.directionalShadowMap,Qe),un.state.spotShadowMap.length>0&&yt.setValue(z,"spotShadowMap",un.state.spotShadowMap,Qe),un.state.pointShadowMap.length>0&&yt.setValue(z,"pointShadowMap",un.state.pointShadowMap,Qe)),Z.isSkinnedMesh){yt.setOptional(z,Z,"bindMatrix"),yt.setOptional(z,Z,"bindMatrixInverse");let Nt=Z.skeleton;Nt&&(Nt.boneTexture===null&&Nt.computeBoneTexture(),yt.setValue(z,"boneTexture",Nt.boneTexture,Qe))}Z.isBatchedMesh&&(yt.setOptional(z,Z,"batchingTexture"),yt.setValue(z,"batchingTexture",Z._matricesTexture,Qe),yt.setOptional(z,Z,"batchingIdTexture"),yt.setValue(z,"batchingIdTexture",Z._indirectTexture,Qe),yt.setOptional(z,Z,"batchingColorTexture"),Z._colorsTexture!==null&&yt.setValue(z,"batchingColorTexture",Z._colorsTexture,Qe));let Dn=K.morphAttributes;if((Dn.position!==void 0||Dn.normal!==void 0||Dn.color!==void 0)&&se.update(Z,K,on),(Ei||He.receiveShadow!==Z.receiveShadow)&&(He.receiveShadow=Z.receiveShadow,yt.setValue(z,"receiveShadow",Z.receiveShadow)),(Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial)&&Y.envMap===null&&G.environment!==null&&(en.envMapIntensity.value=G.environmentIntensity),en.dfgLUT!==void 0&&(en.dfgLUT.value=C_()),Ei){if(yt.setValue(z,"toneMappingExposure",T.toneMappingExposure),He.needsLights&&g3(en,Wi),Ae&&Y.fog===!0&&Me.refreshFogUniforms(en,Ae),Me.refreshMaterialUniforms(en,Y,he,Pe,b.state.transmissionRenderTarget[R.id]),He.needsLights&&He.numLightProbeGrids>0){let Nt=y,Jt=0;for(let Qn of b.state.lightProbeGridArray)Qn.texture!==null&&(Nt.textures[Jt]=Qn.texture,Nt.min[Jt]=Qn.boundingBox.min,Nt.max[Jt]=Qn.boundingBox.max,Nt.resolution[Jt]=Qn.resolution,Jt++);for(let Qn in Nt)Nt[Qn].length=Jt;en.probesSH.value=Nt.textures,en.probesMin.value=Nt.min,en.probesMax.value=Nt.max,en.probesResolution.value=Nt.resolution}er.upload(z,$h(He),en,Qe)}if(Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(er.upload(z,$h(He),en,Qe),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&yt.setValue(z,"center",Z.center),yt.setValue(z,"modelViewMatrix",Z.modelViewMatrix),yt.setValue(z,"normalMatrix",Z.normalMatrix),yt.setValue(z,"modelMatrix",Z.matrixWorld),Y.uniformsGroups!==void 0){let Nt=Y.uniformsGroups;for(let Jt=0,Qn=Nt.length;Jt<Qn;Jt++){let eu=Nt[Jt];We.update(eu,on),We.bind(eu,on)}}return on}function g3(R,G){R.ambientLightColor.needsUpdate=G,R.lightProbe.needsUpdate=G,R.sunLights.needsUpdate=G,R.sunLightShadows.needsUpdate=G,R.directionalLights.needsUpdate=G,R.directionalLightShadows.needsUpdate=G,R.pointLights.needsUpdate=G,R.pointLightShadows.needsUpdate=G,R.spotLights.needsUpdate=G,R.spotLightShadows.needsUpdate=G,R.rectAreaLights.needsUpdate=G,R.hemisphereLights.needsUpdate=G}function _3(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return O},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return V},this.setRenderTargetTextures=function(R,G,K){let Y=qe.get(R);Y.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),qe.get(R.texture).__webglTexture=G,qe.get(R.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:K,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,G){let K=qe.get(R);K.__webglFramebuffer=G,K.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(R,G=0,K=0){V=R,O=G,B=K;let Y=null,Z=!1,Ae=!1;if(R){let we=qe.get(R);if(we.__useDefaultFramebuffer!==void 0){ve.bindFramebuffer(z.FRAMEBUFFER,we.__webglFramebuffer),J.copy(R.viewport),j.copy(R.scissor),ce=R.scissorTest,ve.viewport(J),ve.scissor(j),ve.setScissorTest(ce),H=-1;return}else if(we.__webglFramebuffer===void 0)Qe.setupRenderTarget(R);else if(we.__hasExternalTextures)Qe.rebindTextures(R,qe.get(R.texture).__webglTexture,qe.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){let it=R.depthTexture;if(we.__boundDepthTexture!==it){if(it!==null&&qe.has(it)&&(R.width!==it.image.width||R.height!==it.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Qe.setupDepthRenderbuffer(R)}}let Ne=R.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(Ae=!0);let ze=qe.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(ze[G])?Y=ze[G][K]:Y=ze[G],Z=!0):R.samples>0&&Qe.useMultisampledRTT(R)===!1?Y=qe.get(R).__webglMultisampledFramebuffer:Array.isArray(ze)?Y=ze[K]:Y=ze,J.copy(R.viewport),j.copy(R.scissor),ce=R.scissorTest}else J.copy(Ie).multiplyScalar(he).floor(),j.copy(Ve).multiplyScalar(he).floor(),ce=Je;if(K!==0&&(Y=U),ve.bindFramebuffer(z.FRAMEBUFFER,Y)&&ve.drawBuffers(R,Y),ve.viewport(J),ve.scissor(j),ve.setScissorTest(ce),Z){let we=qe.get(R.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+G,we.__webglTexture,K)}else if(Ae){let we=G;for(let Ne=0;Ne<R.textures.length;Ne++){let ze=qe.get(R.textures[Ne]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+Ne,ze.__webglTexture,K,we)}}else if(R!==null&&K!==0){let we=qe.get(R.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,we.__webglTexture,K)}H=-1};function Qh(R){let G=qe.get(R);return(G.__readFormat!==R.format||G.__readType!==R.type)&&(G.__readFormat=R.format,G.__readType=R.type,G.__formatReadable=Mt.textureFormatReadable(R.format),G.__typeReadable=Mt.textureTypeReadable(R.type)),G}this.readRenderTargetPixels=function(R,G,K,Y,Z,Ae,Fe,we=0){if(!(R&&R.isWebGLRenderTarget)){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ne=qe.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Fe!==void 0&&(Ne=Ne[Fe],Array.isArray(Ne)&&(Ne=Ne[0])),Ne){ve.bindFramebuffer(z.FRAMEBUFFER,Ne);try{let ze=R.textures[we],it=ze.format,pt=ze.type;R.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+we);let Be=Qh(ze);if(Be.__formatReadable===!1){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Be.__typeReadable===!1){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=R.width-Y&&K>=0&&K<=R.height-Z&&z.readPixels(G,K,Y,Z,xe.convert(it),xe.convert(pt),Ae)}finally{let ze=V!==null?qe.get(V).__webglFramebuffer:null;ve.bindFramebuffer(z.FRAMEBUFFER,ze)}}},this.readRenderTargetPixelsAsync=async function(R,G,K,Y,Z,Ae,Fe,we=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ne=qe.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Fe!==void 0&&(Ne=Ne[Fe],Array.isArray(Ne)&&(Ne=Ne[0])),Ne)if(G>=0&&G<=R.width-Y&&K>=0&&K<=R.height-Z){ve.bindFramebuffer(z.FRAMEBUFFER,Ne);let ze=R.textures[we],it=ze.format,pt=ze.type;R.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+we);let Be=Qh(ze);if(Be.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Be.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let mt=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,mt),z.bufferData(z.PIXEL_PACK_BUFFER,Ae.byteLength,z.STREAM_READ),z.readPixels(G,K,Y,Z,xe.convert(it),xe.convert(pt),0),z.bindBuffer(z.PIXEL_PACK_BUFFER,null);let Gt=V!==null?qe.get(V).__webglFramebuffer:null;ve.bindFramebuffer(z.FRAMEBUFFER,Gt);let It=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await Md(z,It,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,mt),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,Ae),z.bindBuffer(z.PIXEL_PACK_BUFFER,null),z.deleteBuffer(mt),z.deleteSync(It),Ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,G=null,K=0){let Y=Math.pow(2,-K),Z=Math.floor(R.image.width*Y),Ae=Math.floor(R.image.height*Y),Fe=G!==null?G.x:0,we=G!==null?G.y:0;Qe.setTexture2D(R,0),z.copyTexSubImage2D(z.TEXTURE_2D,K,0,0,Fe,we,Z,Ae),ve.unbindTexture()},this.copyTextureToTexture=function(R,G,K=null,Y=null,Z=0,Ae=0){let Fe,we,Ne,ze,it,pt,Be,mt,Gt,It=R.isCompressedTexture?R.mipmaps[Ae]:R.image;if(K!==null)Fe=K.max.x-K.min.x,we=K.max.y-K.min.y,Ne=K.isBox3?K.max.z-K.min.z:1,ze=K.min.x,it=K.min.y,pt=K.isBox3?K.min.z:0;else{let yt=Math.pow(2,-Z);Fe=Math.floor(It.width*yt),we=Math.floor(It.height*yt),R.isDataArrayTexture?Ne=It.depth:R.isData3DTexture?Ne=Math.floor(It.depth*yt):Ne=1,ze=0,it=0,pt=0}Y!==null?(Be=Y.x,mt=Y.y,Gt=Y.z):(Be=0,mt=0,Gt=0);let Ct=xe.convert(G.format),rn=xe.convert(G.type),He;G.isData3DTexture?(Qe.setTexture3D(G,0),He=z.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(Qe.setTexture2DArray(G,0),He=z.TEXTURE_2D_ARRAY):(Qe.setTexture2D(G,0),He=z.TEXTURE_2D),ve.activeTexture(z.TEXTURE0),ve.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,G.flipY),ve.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),ve.pixelStorei(z.UNPACK_ALIGNMENT,G.unpackAlignment);let un=ve.getParameter(z.UNPACK_ROW_LENGTH),St=ve.getParameter(z.UNPACK_IMAGE_HEIGHT),Vi=ve.getParameter(z.UNPACK_SKIP_PIXELS),on=ve.getParameter(z.UNPACK_SKIP_ROWS),qo=ve.getParameter(z.UNPACK_SKIP_IMAGES);ve.pixelStorei(z.UNPACK_ROW_LENGTH,It.width),ve.pixelStorei(z.UNPACK_IMAGE_HEIGHT,It.height),ve.pixelStorei(z.UNPACK_SKIP_PIXELS,ze),ve.pixelStorei(z.UNPACK_SKIP_ROWS,it),ve.pixelStorei(z.UNPACK_SKIP_IMAGES,pt);let Ei=R.isDataArrayTexture||R.isData3DTexture,Wi=G.isDataArrayTexture||G.isData3DTexture;if(R.isDepthTexture){let yt=qe.get(R),en=qe.get(G),Dn=qe.get(yt.__renderTarget),Nt=qe.get(en.__renderTarget);ve.bindFramebuffer(z.READ_FRAMEBUFFER,Dn.__webglFramebuffer),ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer);for(let Jt=0;Jt<Ne;Jt++)Ei&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,qe.get(R).__webglTexture,Z,pt+Jt),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,qe.get(G).__webglTexture,Ae,Gt+Jt)),z.blitFramebuffer(ze,it,ze+Fe,it+we,Be,mt,Be+Fe,mt+we,z.DEPTH_BUFFER_BIT,z.NEAREST);ve.bindFramebuffer(z.READ_FRAMEBUFFER,null),ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(Z!==0||R.isRenderTargetTexture||qe.has(R)){let yt=qe.get(R),en=qe.get(G);ve.bindFramebuffer(z.READ_FRAMEBUFFER,C),ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,N);for(let Dn=0;Dn<Ne;Dn++)Ei?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,yt.__webglTexture,Z,pt+Dn):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,yt.__webglTexture,Z),Wi?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,en.__webglTexture,Ae,Gt+Dn):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,en.__webglTexture,Ae),Z!==0?z.blitFramebuffer(ze,it,ze+Fe,it+we,Be,mt,Be+Fe,mt+we,z.COLOR_BUFFER_BIT,z.NEAREST):Wi?z.copyTexSubImage3D(He,Ae,Be,mt,Gt+Dn,ze,it,Fe,we):z.copyTexSubImage2D(He,Ae,Be,mt,ze,it,Fe,we);ve.bindFramebuffer(z.READ_FRAMEBUFFER,null),ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else Wi?R.isDataTexture||R.isData3DTexture?z.texSubImage3D(He,Ae,Be,mt,Gt,Fe,we,Ne,Ct,rn,It.data):G.isCompressedArrayTexture?z.compressedTexSubImage3D(He,Ae,Be,mt,Gt,Fe,we,Ne,Ct,It.data):z.texSubImage3D(He,Ae,Be,mt,Gt,Fe,we,Ne,Ct,rn,It):R.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,Ae,Be,mt,Fe,we,Ct,rn,It.data):R.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,Ae,Be,mt,It.width,It.height,Ct,It.data):z.texSubImage2D(z.TEXTURE_2D,Ae,Be,mt,Fe,we,Ct,rn,It);ve.pixelStorei(z.UNPACK_ROW_LENGTH,un),ve.pixelStorei(z.UNPACK_IMAGE_HEIGHT,St),ve.pixelStorei(z.UNPACK_SKIP_PIXELS,Vi),ve.pixelStorei(z.UNPACK_SKIP_ROWS,on),ve.pixelStorei(z.UNPACK_SKIP_IMAGES,qo),Ae===0&&G.generateMipmaps===!0&&G.mipmapsAutoUpdate===!0&&z.generateMipmap(He),ve.unbindTexture()},this.initRenderTarget=function(R){qe.get(R).__webglFramebuffer===void 0&&Qe.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?Qe.setTextureCube(R,0):R.isData3DTexture?Qe.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?Qe.setTexture2DArray(R,0):Qe.setTexture2D(R,0),ve.unbindTexture()},this.resetState=function(){O=0,B=0,V=null,ve.reset(),Ee.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return An}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=ft._getDrawingBufferColorSpace(e),t.unpackColorSpace=ft._getUnpackColorSpace()}};function P_(){return{gen_utc:new Date().toISOString(),zones:[{id:"gaming",name:"FLUX Gaming",status:"active",activity:.9},{id:"quant",name:"FLUX Quant",status:"dormant",activity:.15},{id:"media",name:"FLUX Media",status:"dormant",activity:.4}],fleet:[{id:"bm-a",cores:32,online:!0,current_task:"cityweb dev"},{id:"bm-b",cores:16,online:!1,current_task:"idle"},{id:"bm-c",cores:32,online:!1,current_task:"idle"},{id:"BG-A",cores:16,online:!1,current_task:"idle"},{id:"BG-B",cores:8,online:!1,current_task:"idle"},{id:"BG-C",cores:16,online:!1,current_task:"idle"}],census_total:10114,reality:{city_day_phase:"night",beijing_hhmm:new Date().toTimeString().substring(0,5),weather_kind:"clear",weather_temp_c:"16",season:"autumn"},city:{games_total:34,games_active:9,commits_total:47093,renders_total:105,fleet_online:1},events_tail:[{ts_utc:"",type:"COMMIT",zone:"gaming",summary:"demo data"},{ts_utc:"",type:"CEO_ORDER",zone:"governance",summary:"demo data"},{ts_utc:"",type:"GAME_STAGE",zone:"gaming",summary:"demo data"}]}}function c2(){var i;return(i=window.CITY_DATA)!=null?i:P_()}function Lo(){return!!window.CITY_DATA}function u2(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new gt;l.morphTargetsRelative=a;let c=0;for(let h=0;h<i.length;++h){let u=i[h],d=0,f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in u.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;if(u.morphAttributes[p].length!==i[0].morphAttributes[p].length)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have the same number of morph targets for the "'+p+'" morph attribute.'),null;o[p]===void 0&&(o[p]=[]),o[p].push(u.morphAttributes[p]),f++}if(f!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of morph attributes."),null;if(e){let p;if(t)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,h),c+=p}}if(t){let h=0,u=[];for(let d=0;d<i.length;++d){let f=i[d].index;for(let p=0;p<f.count;++p)u.push(f.getX(p)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=h2(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let _=0;_<o[h].length;++_)f.push(o[h][_][d]);let p=h2(f);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(p)}}}return l}function h2(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new Ft(o,t,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let d=0,f=h.count;d<f;d++)for(let p=0;p<t;p++){let _=h.getComponent(d,p);a.setComponent(d+u,p,_)}}else o.set(h.array,l);l+=h.count*t}return s!==void 0&&(a.gpuType=s),a}var I_=111320*Math.cos(31.243*(Math.PI/180));function Bt(i){return(i-121.495)*I_}function Ht(i){return-(i-31.243)*110540}function sh(i){return{x:Bt(i.lon),z:Ht(i.lat)}}var de={data:new le(6220500),capital:new le(16498468),traffic:new le(16020150),warn:new le(16281969),ceo:new le(16777215),brain:new le(6333946)},Sn={gaming:de.data,quant:de.capital,media:de.traffic,governance:de.brain};var ic=(i,e,t,n,s,r,o,a,l,c,h,u,d)=>({skyTop:new le(i),skyBottom:new le(e),fog:new le(t),sunColor:new le(n),sunIntensity:s,hemiSky:new le(r),hemiGround:new le(o),hemiIntensity:a,windowGain:l,starOpacity:c,streetGain:h,bodyGain:u,groundColor:new le(d)}),Do=ic(263694,66e4,329743,9348808,.32,1713206,329484,.5,1,.9,.12,.6,395794),L_=ic(1845836,13208178,6969970,16763296,1.4,3820140,1316896,.7,.6,.35,.7,.9,2896454),d2=ic(7314644,13229038,11058386,16773852,2.2,8691908,3752532,.78,.45,0,1,1.45,4016737),D_=ic(3024720,12743743,8014408,16757611,1.5,3945560,1578016,.75,.85,.4,.45,1,2367274),rh=[{h:0,p:Do},{h:4.5,p:Do},{h:6.5,p:L_},{h:8.5,p:d2},{h:16,p:d2},{h:18,p:D_},{h:20,p:Do},{h:24,p:Do}],cs=new le;function N_(i,e,t){return{skyTop:cs.copy(i.skyTop).lerp(e.skyTop,t).clone(),skyBottom:cs.copy(i.skyBottom).lerp(e.skyBottom,t).clone(),fog:cs.copy(i.fog).lerp(e.fog,t).clone(),sunColor:cs.copy(i.sunColor).lerp(e.sunColor,t).clone(),sunIntensity:i.sunIntensity+(e.sunIntensity-i.sunIntensity)*t,hemiSky:cs.copy(i.hemiSky).lerp(e.hemiSky,t).clone(),hemiGround:cs.copy(i.hemiGround).lerp(e.hemiGround,t).clone(),hemiIntensity:i.hemiIntensity+(e.hemiIntensity-i.hemiIntensity)*t,windowGain:i.windowGain+(e.windowGain-i.windowGain)*t,starOpacity:i.starOpacity+(e.starOpacity-i.starOpacity)*t,streetGain:i.streetGain+(e.streetGain-i.streetGain)*t,bodyGain:i.bodyGain+(e.bodyGain-i.bodyGain)*t,groundColor:cs.copy(i.groundColor).lerp(e.groundColor,t).clone()}}function f2(i){for(let e=0;e<rh.length-1;e++){let t=rh[e],n=rh[e+1];if(i>=t.h&&i<=n.h){let s=(i-t.h)/(n.h-t.h);return N_(t.p,n.p,s)}}return Do}function p2(i){return i>=5&&i<7?"\u6668":i>=7&&i<17?"\u663C":i>=17&&i<19.5?"\u9EC4\u660F":"\u591C"}var m2=[{name:"\u4E0A\u6D77\u73AF\u7403\u91D1\u878D\u4E2D\u5FC3",h:492,ring:[[31.2368214,121.502698],[31.2368319,121.5028363],[31.2368477,121.5030457],[31.2368601,121.5032097],[31.236869,121.5033275],[31.2367679,121.503338],[31.2366289,121.5033524],[31.2363323,121.5033831],[31.2363059,121.503035],[31.2362942,121.5028799],[31.2362936,121.5028721],[31.2362846,121.5027536],[31.236385,121.5027432],[31.2365247,121.5027287],[31.2368214,121.502698]],region:"lujiazui"},{name:"\u6E2F\u52A1\u5927\u53A6",h:19.2,ring:[[31.2423995,121.493158],[31.2421684,121.4934802],[31.2422058,121.4935169],[31.2421738,121.4935616],[31.2422094,121.4935965],[31.2422133,121.4936469],[31.2422461,121.494085],[31.242216,121.4941255],[31.2422555,121.4941655],[31.2422177,121.4942164],[31.2424979,121.4945005],[31.2425218,121.4944682],[31.2425325,121.494479],[31.2426697,121.4942939],[31.242409,121.4940295],[31.2423812,121.4936303],[31.2425967,121.4933299],[31.242463,121.4931986],[31.2424539,121.4932114],[31.2423995,121.493158]],region:"lujiazui"},{name:"21\u4E16\u7EAA\u5927\u53A6",h:210,ring:[[31.2364771,121.5056988],[31.2366032,121.5052721],[31.2362373,121.5051307],[31.236116,121.5055602],[31.2364771,121.5056988]],region:"lujiazui"},{name:"\u592A\u5E73\u91D1\u878D\u5927\u53A6",h:238,ring:[[31.2363421,121.4991479],[31.2359154,121.4992162],[31.2358538,121.4986888],[31.2362805,121.4986206],[31.2363421,121.4991479]],region:"lujiazui"},{name:"",h:16,ring:[[31.2407782,121.49744],[31.2406821,121.4973702],[31.2406709,121.4973626],[31.2405921,121.4973091],[31.2404998,121.4975911],[31.240306,121.498183],[31.2402382,121.4983824],[31.2402058,121.4984778],[31.2402555,121.4985111],[31.2400893,121.4989353],[31.2401452,121.4989675],[31.2403135,121.4985502],[31.2404367,121.4982661],[31.2407263,121.4975655],[31.2407782,121.49744]],region:"lujiazui"},{name:"\u9EC4\u91D1\u7F6E\u5730\u5927\u53A6",h:144,ring:[[31.2424833,121.5007512],[31.2427307,121.5011159],[31.2424141,121.5014098],[31.2421667,121.501045],[31.2424833,121.5007512]],region:"lujiazui"},{name:"\u661F\u5C55\u94F6\u884C\u5927\u53A6",h:90,ring:[[31.2442305,121.4985639],[31.2438704,121.4988993],[31.2439493,121.4990152],[31.2441451,121.4993027],[31.2445051,121.4989673],[31.2442305,121.4985639]],region:"lujiazui"},{name:"\u4E2D\u94F6\u5927\u53A6",h:19.2,ring:[[31.2406569,121.4994175],[31.2409495,121.4987024],[31.2404319,121.4984127],[31.2401393,121.4991278],[31.2406569,121.4994175]],region:"lujiazui"},{name:"\u6C47\u4E30\u94F6\u884C\u5927\u697C",h:249.9,ring:[[31.2383687,121.4969947],[31.2385174,121.4970617],[31.2386851,121.4970556],[31.2388111,121.4968659],[31.2388064,121.4966621],[31.2387192,121.4965816],[31.238421,121.496595],[31.2383598,121.496822],[31.2383687,121.4969947]],region:"lujiazui"},{name:"\u9707\u65E6\u56FD\u9645\u5927\u697C",h:185,ring:[[31.2363137,121.4950827],[31.2363596,121.4950532],[31.2364146,121.4950264],[31.2364903,121.4950103],[31.2365637,121.4950156],[31.2366371,121.4950371],[31.2367057,121.4950728],[31.2367859,121.4951532],[31.2367293,121.4952255],[31.2367269,121.4953291],[31.2367855,121.4953357],[31.2367781,121.4954259],[31.2367168,121.495419],[31.2367121,121.4954765],[31.2366559,121.4954702],[31.236651,121.4955296],[31.2365044,121.4955132],[31.2363924,121.4955006],[31.2363969,121.4954458],[31.2363396,121.4954394],[31.2363444,121.4953804],[31.2362771,121.4953728],[31.2362863,121.4952609],[31.2363538,121.4952684],[31.2363603,121.4951894],[31.2363137,121.4950827]],region:"lujiazui"},{name:"\u62DB\u5546\u94F6\u884C\u4E0A\u6D77\u5927\u53A6",h:230,ring:[[31.2444528,121.5017133],[31.2443956,121.5016906],[31.2441423,121.5018547],[31.2440482,121.5019157],[31.2440216,121.5019677],[31.2441578,121.5022341],[31.2442096,121.5022524],[31.2445502,121.5020219],[31.2445743,121.5019547],[31.2444528,121.5017133]],region:"lujiazui"},{name:"\u4E0A\u6D77\u4FE1\u606F\u5927\u697C",h:131.2,ring:[[31.237305,121.5064875],[31.2375258,121.5058148],[31.2375968,121.5058467],[31.2377792,121.5059286],[31.2375584,121.5066013],[31.2375454,121.5066352],[31.2375225,121.5066487],[31.2374858,121.506654],[31.2372817,121.5065521],[31.237305,121.5064875]],region:"lujiazui"},{name:"\u62DB\u5546\u5C40\u5927\u53A6",h:168,ring:[[31.2398128,121.5047062],[31.2395074,121.5048983],[31.2393122,121.5044737],[31.2396177,121.5042817],[31.2398128,121.5047062]],region:"lujiazui"},{name:"\u4E2D\u56FD\u8239\u8236\u5927\u53A6",h:96,ring:[[31.2405585,121.5067488],[31.2407292,121.5063861],[31.2408989,121.5063231],[31.2409492,121.5065084],[31.2407865,121.506903],[31.2406176,121.506966],[31.2405585,121.5067488]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2375406,121.4971564],[31.2374455,121.4971277],[31.2374288,121.4972033],[31.2372713,121.4971557],[31.237205,121.4974557],[31.2373638,121.4975036],[31.2373418,121.4976033],[31.2374357,121.4976317],[31.2375406,121.4971564]],region:"lujiazui"},{name:"\u4E0A\u6D77\u56FD\u91D1\u6C47",h:69,ring:[[31.2377114,121.4980986],[31.2374581,121.4985748],[31.2371462,121.498834],[31.2370693,121.4988979],[31.2369775,121.498737],[31.237317,121.4984822],[31.2373835,121.498399],[31.2375876,121.4980155],[31.2377114,121.4980986]],region:"lujiazui"},{name:"",h:9.6,ring:[[31.2420732,121.4970271],[31.2420125,121.496954],[31.2418393,121.4967455],[31.241704,121.496732],[31.2416375,121.4967589],[31.2415618,121.4966999],[31.241571,121.496606],[31.2416444,121.496555],[31.2417099,121.4966167],[31.2418921,121.4966221],[31.2421397,121.4969359],[31.2421685,121.4969359],[31.2422213,121.4970003],[31.2421994,121.4971022],[31.2421214,121.4970968],[31.2420732,121.4970271]],region:"lujiazui"},{name:"",h:16,ring:[[31.237245,121.5029527],[31.2372181,121.5030491],[31.2371539,121.5032711],[31.2371308,121.5033511],[31.2371237,121.5033755],[31.2371173,121.5033977],[31.2370882,121.5034991],[31.2370723,121.5035547],[31.2370284,121.5037075],[31.2369955,121.5038222],[31.2368762,121.5038276],[31.2368781,121.5038727],[31.2368276,121.5038727],[31.236823,121.5037654],[31.2358763,121.5038115],[31.235764,121.5039054],[31.2357612,121.503929],[31.2356653,121.5039295],[31.2356626,121.5038888],[31.2356282,121.5037681],[31.235697,121.5037439],[31.2356649,121.5035481],[31.235514,121.50298],[31.2354608,121.5029607],[31.2354176,121.50298],[31.2353644,121.5027783],[31.2353832,121.502752],[31.2354149,121.5028642],[31.2356396,121.5029232],[31.2356241,121.5028486],[31.2358919,121.5029098],[31.2360502,121.5029017],[31.2362942,121.5028799],[31.2363323,121.5033831],[31.236869,121.5033275],[31.2368319,121.5028363],[31.2369492,121.5028266],[31.2372501,121.5025911],[31.2372822,121.5026179],[31.2369836,121.5028829],[31.2370157,121.502958],[31.2371077,121.5029296],[31.237179,121.5029076],[31.237245,121.5029527]],region:"lujiazui"},{name:"\u4E0A\u6D77\u4E2D\u5FC3\u5927\u53A6",h:632,ring:[[31.2354993,121.5007275],[31.2354319,121.5007601],[31.2353455,121.500802],[31.2353243,121.5008716],[31.2352592,121.500846],[31.2352198,121.5009721],[31.235189,121.5011559],[31.2351902,121.5013239],[31.2351991,121.501398],[31.2352127,121.5014697],[31.2352433,121.5016027],[31.2352732,121.501674],[31.2353027,121.5017446],[31.2353453,121.5017848],[31.2353988,121.501806],[31.2354427,121.5017965],[31.235488,121.5017866],[31.2355247,121.5017632],[31.2355784,121.5017289],[31.2356876,121.5016592],[31.2358244,121.5015721],[31.2359357,121.5014693],[31.2360115,121.5013968],[31.2360492,121.5013308],[31.2360316,121.5012621],[31.2360155,121.5012357],[31.2359839,121.5011838],[31.2358859,121.5010465],[31.235698,121.5008579],[31.2356117,121.5007998],[31.2354993,121.5007275]],region:"lujiazui"},{name:"\u5BCC\u58EB\u5EB7\u5927\u53A6",h:67.2,ring:[[31.2438192,121.4979239],[31.2433524,121.4983626],[31.2436019,121.4987258],[31.2440687,121.4982873],[31.2438192,121.4979239]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2448528,121.5014048],[31.2443956,121.5016906],[31.2441423,121.5018547],[31.2440624,121.5016901],[31.2447405,121.5012078],[31.2451228,121.5009581],[31.2451624,121.5010588],[31.2451487,121.5011097],[31.2451058,121.5011913],[31.2449767,121.5013055],[31.2448528,121.5014048]],region:"lujiazui"},{name:"\u62DB\u5546\u94F6\u884C\u4E0A\u6D77\u5927\u53A6\u5317\u5854",h:19.2,ring:[[31.2451228,121.5009581],[31.2447405,121.5012078],[31.2445889,121.500938],[31.2448541,121.5007531],[31.2449262,121.5007369],[31.2449917,121.5007531],[31.2450399,121.5008095],[31.2451228,121.5009581]],region:"lujiazui"},{name:"\u519C\u94F6\u5927\u53A6",h:216,ring:[[31.2444381,121.503965],[31.2445091,121.504422],[31.2445139,121.5044526],[31.2440445,121.5045524],[31.244021,121.5044012],[31.2439916,121.5042124],[31.2439687,121.5040648],[31.2444381,121.503965]],region:"lujiazui"},{name:"\u4E2D\u56FD\u4EBA\u6C11\u94F6\u884C\u5927\u53A6",h:64,ring:[[31.2400935,121.505473],[31.2402242,121.5053987],[31.2402793,121.5054148],[31.2403283,121.5055194],[31.2404919,121.5055894],[31.2406464,121.5054929],[31.2404214,121.504975],[31.2403114,121.5049374],[31.2398821,121.505186],[31.2399949,121.5054363],[31.2400935,121.505473]],region:"lujiazui"},{name:"\u5EFA\u884C\u5927\u53A6",h:216,ring:[[31.2445895,121.5049461],[31.244129,121.505064],[31.2441951,121.5054174],[31.2442218,121.5055601],[31.2446823,121.5054423],[31.2445895,121.5049461]],region:"lujiazui"},{name:"",h:16,ring:[[31.236729,121.5005013],[31.2378938,121.5004637],[31.237981,121.5004959],[31.2379867,121.5006282],[31.2379259,121.5007802],[31.2378479,121.5009251],[31.2373312,121.5009521],[31.237167,121.5009526],[31.2366786,121.5009787],[31.236729,121.5005013]],region:"lujiazui"},{name:"\u9999\u683C\u91CC\u62C9\u9152\u5E97",h:144,ring:[[31.2378929,121.4944554],[31.237686,121.4939719],[31.2373893,121.4941457],[31.2374569,121.4943035],[31.2375963,121.4946291],[31.2378704,121.4944687],[31.2378929,121.4944554]],region:"lujiazui"},{name:"\u9999\u683C\u91CC\u62C9\u9152\u5E97",h:137.6,ring:[[31.2382869,121.4956961],[31.2382674,121.4955039],[31.2380335,121.4956912],[31.2380404,121.4957731],[31.2379921,121.4957719],[31.2377905,121.4957673],[31.2378677,121.4959385],[31.238213,121.4959212],[31.2382053,121.4957647],[31.2382869,121.4956961]],region:"lujiazui"},{name:"\u745E\u82D1\u516C\u5BD3",h:112,ring:[[31.2419336,121.5069575],[31.2420696,121.5069057],[31.242037,121.5067884],[31.242084,121.5067705],[31.2420638,121.5066981],[31.2420189,121.5067152],[31.2419728,121.50655],[31.2420188,121.5065325],[31.2419974,121.5064557],[31.2419487,121.5064743],[31.2419209,121.5063743],[31.2417855,121.5064259],[31.2419336,121.5069575]],region:"lujiazui"},{name:"\u91D1\u7816\u5927\u53A6",h:200,ring:[[31.2354241,121.4993402],[31.2353608,121.4987131],[31.2348684,121.4987811],[31.2349316,121.4994081],[31.2354241,121.4993402]],region:"lujiazui"},{name:"\u91D1\u8302\u5927\u53A6",h:420.5,ring:[[31.2373315,121.5010725],[31.2373316,121.5011126],[31.2374952,121.5011121],[31.2374957,121.5013071],[31.2375309,121.501307],[31.2376763,121.5013064],[31.2376767,121.5014957],[31.2375313,121.5014963],[31.2374957,121.5014964],[31.2374962,121.5016802],[31.2373325,121.5016807],[31.2373326,121.5017119],[31.2373331,121.5018868],[31.2371696,121.5018873],[31.2371691,121.5017124],[31.237169,121.5016808],[31.2370089,121.5016813],[31.2370084,121.5014971],[31.2369732,121.5014972],[31.2368243,121.5014978],[31.2368238,121.5013064],[31.2370084,121.5013058],[31.2370079,121.5011131],[31.2371674,121.5011126],[31.2371673,121.501073],[31.237167,121.5009526],[31.2373312,121.5009521],[31.2373315,121.5010725]],region:"lujiazui"},{name:"\u4E0A\u6D77\u6D77\u6D0B\u6C34\u65CF\u9986",h:10,ring:[[31.2426086,121.4977593],[31.243054,121.4973315],[31.2426841,121.4968045],[31.2422386,121.4972324],[31.2424413,121.497521],[31.2426086,121.4977593]],region:"lujiazui"},{name:"\u56FD\u91D1\u4E2D\u5FC3\u4E8C\u671F",h:259.9,ring:[[31.2389307,121.4976093],[31.2388329,121.4978362],[31.2388808,121.4979923],[31.2391414,121.4981185],[31.2393018,121.4979161],[31.2393649,121.4977432],[31.2393058,121.4976277],[31.2391444,121.4975282],[31.2390198,121.4974878],[31.2389307,121.4976093]],region:"lujiazui"},{name:"\u8FEA\u58EB\u5C3C\u65D7\u8230\u5E97",h:6.4,ring:[[31.2400412,121.4948451],[31.2405397,121.494523],[31.2406607,121.494751],[31.2404058,121.4950137],[31.24042,121.4950318],[31.2404339,121.4950524],[31.2404443,121.4950751],[31.2404515,121.4950993],[31.2404546,121.4951196],[31.240456,121.4951435],[31.2404021,121.4951429],[31.240391,121.4951069],[31.2403736,121.4950726],[31.2403588,121.4950498],[31.2403347,121.4950241],[31.2403035,121.4950041],[31.2402761,121.4949925],[31.2402424,121.4949849],[31.2402125,121.4949852],[31.2401817,121.4949914],[31.2401541,121.4950035],[31.2401306,121.4950181],[31.2400995,121.495047],[31.2400774,121.4950745],[31.2400585,121.4951093],[31.2400438,121.4951461],[31.2400353,121.4951904],[31.2399886,121.4951892],[31.2399935,121.4951465],[31.2400069,121.4951014],[31.2400329,121.4950503],[31.2400561,121.4950186],[31.2400799,121.4949929],[31.2401058,121.4949696],[31.2400412,121.4948451]],region:"lujiazui"},{name:"\u4E1C\u4E9A\u94F6\u884C\u91D1\u878D\u5927\u53A6",h:197.7,ring:[[31.2363792,121.4978458],[31.2362655,121.4979148],[31.2360145,121.4980673],[31.2359888,121.4980829],[31.2359149,121.4979694],[31.2359353,121.4979556],[31.2358777,121.4978574],[31.235854,121.4978774],[31.2357754,121.4977518],[31.2361251,121.497464],[31.2361935,121.4975614],[31.2361086,121.4976351],[31.2361946,121.4977827],[31.2363139,121.4977196],[31.2363792,121.4978458]],region:"lujiazui"},{name:"\u56FD\u5BFF\u4E2D\u5FC3\u5927\u53A6",h:238,ring:[[31.242635,121.5068169],[31.2425347,121.5062971],[31.2428998,121.5062006],[31.2430003,121.5067204],[31.242635,121.5068169]],region:"lujiazui"},{name:"\u5DE5\u94F6\u5927\u53A6",h:256,ring:[[31.2429606,121.5051862],[31.2425171,121.5053072],[31.2426272,121.5058596],[31.2428206,121.5058069],[31.2430707,121.5057387],[31.2429606,121.5051862]],region:"lujiazui"},{name:"\u82B1\u65D7\u96C6\u56E2\u5927\u53A6",h:134.4,ring:[[31.2359498,121.4953934],[31.236624,121.4962974],[31.2362088,121.4967571],[31.2357866,121.4962124],[31.2355121,121.495856],[31.2358355,121.4955153],[31.2359498,121.4953934]],region:"lujiazui"},{name:"\u4E0A\u6D77\u56FD\u91D1\u4E2D\u5FC3\u5546\u573A",h:22.4,ring:[[31.2388111,121.4968659],[31.2388275,121.4971242],[31.2388473,121.4972226],[31.2388811,121.4973071],[31.2389303,121.4973931],[31.238971,121.4974498],[31.2390198,121.4974878],[31.2389307,121.4976093],[31.2388329,121.4978362],[31.2388808,121.4979923],[31.2387817,121.4982595],[31.2389686,121.4983517],[31.2388705,121.498592],[31.2388304,121.4985694],[31.2388035,121.4986495],[31.2387899,121.4986977],[31.2387744,121.4987454],[31.2387197,121.4989292],[31.2386601,121.4989748],[31.2385175,121.4989171],[31.238466,121.4988963],[31.2384236,121.49888],[31.2380342,121.4987301],[31.2378735,121.498866],[31.2378039,121.4988285],[31.2377426,121.4989066],[31.2374581,121.4985748],[31.2377114,121.4980986],[31.2378182,121.4978777],[31.2378047,121.4972386],[31.2378693,121.4971266],[31.2383741,121.497098],[31.2383687,121.4969947],[31.2385174,121.4970617],[31.2386851,121.4970556],[31.2388111,121.4968659]],region:"lujiazui"},{name:"29 - 30 phase \u2161",h:70,ring:[[31.2325021,121.5018695],[31.2324577,121.5019023],[31.2324764,121.5019351],[31.2324075,121.5019802],[31.2324192,121.5019938],[31.2323724,121.5020403],[31.2324028,121.502084],[31.2324308,121.502058],[31.232446,121.5020731],[31.232446,121.5021031],[31.2324554,121.5021209],[31.2324857,121.5021277],[31.2325245,121.5022005],[31.232557,121.5022616],[31.2325512,121.5022821],[31.2325582,121.5023189],[31.232592,121.502323],[31.232592,121.502364],[31.232564,121.5023695],[31.2325722,121.502431],[31.2326236,121.5024118],[31.2326282,121.5024228],[31.2326645,121.5024118],[31.2326504,121.5023435],[31.2326868,121.5023309],[31.2327115,121.502404],[31.2327572,121.5023857],[31.2327456,121.5023432],[31.2327656,121.5023339],[31.2327673,121.5022706],[31.2327517,121.5022581],[31.2327189,121.5021162],[31.2326914,121.5021303],[31.2326216,121.5020049],[31.2326377,121.501986],[31.2325673,121.5018888],[31.2325579,121.5018966],[31.2325378,121.5018763],[31.2325211,121.5018904],[31.2325021,121.5018695]],region:"lujiazui"},{name:"28 - 27 phase \u2161",h:70,ring:[[31.2327844,121.50257],[31.2327342,121.5025523],[31.2327252,121.5025903],[31.232651,121.5025589],[31.2326498,121.5025781],[31.2325892,121.5025673],[31.2325808,121.5026227],[31.2326159,121.5026305],[31.2326162,121.5026538],[31.2325968,121.5026734],[31.2325914,121.5026933],[31.2326069,121.5027246],[31.232567,121.5028753],[31.23255,121.5028835],[31.2325307,121.5029139],[31.2325502,121.5029465],[31.2325238,121.5029733],[31.2325019,121.5029521],[31.2324675,121.5029996],[31.2325135,121.5030325],[31.2325095,121.5030438],[31.2325403,121.5030686],[31.2325752,121.5030115],[31.2326072,121.5030354],[31.2325762,121.5031051],[31.2326179,121.5031335],[31.2326378,121.5030955],[31.2326569,121.503107],[31.2326989,121.503067],[31.2326967,121.5030451],[31.232767,121.5029232],[31.2327398,121.5029081],[31.2327753,121.5027643],[31.232798,121.5027662],[31.2328147,121.5026403],[31.2328035,121.5026371],[31.2328035,121.502606],[31.2327834,121.5026004],[31.2327844,121.50257]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2387963,121.5073161],[31.2387102,121.5073723],[31.2389282,121.5078293],[31.2390143,121.5077731],[31.2387963,121.5073161]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2390482,121.5078546],[31.2389622,121.5079107],[31.2391802,121.5083677],[31.2392663,121.5083115],[31.2390482,121.5078546]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.238574,121.5074571],[31.238488,121.5075132],[31.238706,121.5079703],[31.2387921,121.5079141],[31.238574,121.5074571]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2388348,121.5079963],[31.2387488,121.5080524],[31.2389668,121.5085095],[31.2390529,121.5084533],[31.2388348,121.5079963]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2373056,121.5086791],[31.2373917,121.5086231],[31.2372271,121.5082776],[31.237141,121.5083337],[31.2373056,121.5086791]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2375005,121.5085451],[31.2375866,121.508489],[31.2374221,121.5081436],[31.237336,121.5081997],[31.2375005,121.5085451]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2370938,121.5087765],[31.2371846,121.5087318],[31.2370751,121.5084277],[31.2369843,121.5084724],[31.2370938,121.5087765]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2378027,121.5079088],[31.2377167,121.5079651],[31.2378136,121.5081723],[31.2378996,121.508116],[31.2378027,121.5079088]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2392641,121.5096617],[31.2391778,121.509693],[31.239316,121.510213],[31.2394039,121.510181],[31.2393869,121.510117],[31.2394168,121.5101062],[31.2394004,121.5100445],[31.2393705,121.5100553],[31.2393427,121.5099505],[31.2393716,121.50994],[31.2393562,121.5098821],[31.2393263,121.509893],[31.2392957,121.5097778],[31.2393208,121.5097686],[31.2393078,121.5097197],[31.239282,121.5097291],[31.2392641,121.5096617]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2394365,121.5102993],[31.2393523,121.5103305],[31.2394466,121.5106796],[31.239533,121.5106477],[31.2395168,121.5105877],[31.2395455,121.5105771],[31.2395295,121.5105179],[31.2394995,121.510529],[31.2394685,121.5104142],[31.2394935,121.510405],[31.2394805,121.5103568],[31.2394547,121.5103664],[31.2394365,121.5102993]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2392043,121.5094224],[31.2391146,121.5094563],[31.2391612,121.5096248],[31.2392509,121.5095909],[31.2392043,121.5094224]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2396692,121.5102085],[31.2395849,121.5102397],[31.2396793,121.5105889],[31.2397657,121.5105569],[31.2397495,121.5104969],[31.2397782,121.5104863],[31.2397622,121.5104271],[31.2397321,121.5104382],[31.2397012,121.5103235],[31.2397262,121.5103142],[31.2397132,121.510266],[31.2396873,121.5102756],[31.2396692,121.5102085]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2395786,121.5098439],[31.2394843,121.5098796],[31.239343,121.50937],[31.2394374,121.5093342],[31.2395786,121.5098439]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2395993,121.5099143],[31.2394992,121.5099516],[31.2395438,121.5101152],[31.2396439,121.5100778],[31.2395993,121.5099143]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2397783,121.5096542],[31.2396784,121.5096918],[31.2397731,121.5100363],[31.2398731,121.5099987],[31.2397783,121.5096542]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2399043,121.5101166],[31.2398044,121.5101542],[31.2398991,121.5104987],[31.2399991,121.5104612],[31.2399043,121.5101166]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2396559,121.5092241],[31.239556,121.5092619],[31.239647,121.5095903],[31.2397469,121.5095524],[31.2396559,121.5092241]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2400017,121.5095818],[31.2399019,121.5096197],[31.2399929,121.5099481],[31.2400928,121.5099102],[31.2400017,121.5095818]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2398714,121.5091163],[31.2397715,121.5091542],[31.2398625,121.5094826],[31.2399624,121.5094447],[31.2398714,121.5091163]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2400524,121.5100487],[31.2399528,121.5100876],[31.2400308,121.5103613],[31.2401304,121.5103225],[31.2400524,121.5100487]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.240277,121.5100873],[31.240177,121.5101246],[31.2402216,121.5102882],[31.2403216,121.5102509],[31.240277,121.5100873]],region:"lujiazui"},{name:"",h:19.2,ring:[[31.2402364,121.5096571],[31.2401365,121.5096949],[31.2402275,121.5100233],[31.2403274,121.5099854],[31.2402364,121.5096571]],region:"lujiazui"},{name:"\u56FD\u91D1\u4E2D\u5FC32\u671F",h:115.2,ring:[[31.2402802,121.5095059],[31.2401859,121.5095417],[31.2400446,121.5090321],[31.240139,121.5089962],[31.2402802,121.5095059]],region:"lujiazui"},{name:"\u5916\u6EE9\u4E2D\u5FC3",h:198.9,ring:[[31.2347138,121.4827882],[31.2348155,121.4832519],[31.2343787,121.4833829],[31.234277,121.4829191],[31.2347138,121.4827882]],region:"bund_edge"},{name:"\u5973\u9752\u5E74\u4F1A\u5927\u697C",h:25.6,ring:[[31.2438506,121.4836037],[31.2435849,121.4836459],[31.2435713,121.4835062],[31.2437166,121.4834836],[31.2437085,121.4834007],[31.2435623,121.4834158],[31.2435511,121.4832911],[31.2436436,121.4832771],[31.2438148,121.4832512],[31.2438348,121.483444],[31.2438506,121.4836037]],region:"bund_edge"},{name:"\u54C8\u5BC6\u5927\u697C",h:22.4,ring:[[31.2440599,121.4835669],[31.2438506,121.4836037],[31.2438348,121.483444],[31.2440442,121.4834174],[31.2440599,121.4835669]],region:"bund_edge"},{name:"\u4E0A\u6D77\u56FD\u9645\u4F1A\u8BAE\u4E2D\u5FC3",h:19.2,ring:[[31.2418856,121.4930859],[31.241866,121.4930444],[31.2420128,121.4929532],[31.2419053,121.4928455],[31.2419456,121.4928458],[31.2419853,121.4928378],[31.2420249,121.492821],[31.2420612,121.492796],[31.2421172,121.4927291],[31.2421419,121.4926743],[31.2421553,121.4926144],[31.2421526,121.4925209],[31.2421328,121.4924548],[31.2420992,121.4923969],[31.2420678,121.4923627],[31.2419969,121.4923192],[31.2419175,121.4923065],[31.2418724,121.4923139],[31.2418293,121.4923314],[31.2417944,121.4923549],[31.2417651,121.4922907],[31.2418754,121.4922145],[31.24171,121.4919956],[31.2415381,121.4918454],[31.2413661,121.4917489],[31.241196,121.4917047],[31.2411503,121.4916355],[31.2410936,121.4915956],[31.2410069,121.4915818],[31.2409431,121.4916025],[31.2408892,121.4916475],[31.2408518,121.4917111],[31.2408351,121.4917861],[31.2408414,121.4918632],[31.240864,121.4919228],[31.2409212,121.4920493],[31.2415507,121.493306],[31.2418856,121.4930859]],region:"bund_edge"},{name:"\u6E2F\u52A1\u5927\u53A6",h:19.2,ring:[[31.2423995,121.493158],[31.2421684,121.4934802],[31.2422058,121.4935169],[31.2421738,121.4935616],[31.2422094,121.4935965],[31.2422133,121.4936469],[31.2422461,121.494085],[31.242216,121.4941255],[31.2422555,121.4941655],[31.2422177,121.4942164],[31.2424979,121.4945005],[31.2425218,121.4944682],[31.2425325,121.494479],[31.2426697,121.4942939],[31.242409,121.4940295],[31.2423812,121.4936303],[31.2425967,121.4933299],[31.242463,121.4931986],[31.2424539,121.4932114],[31.2423995,121.493158]],region:"bund_edge"},{name:"\u60A6\u56ED\u5546\u53A6",h:28.8,ring:[[31.2307883,121.4862999],[31.2311461,121.4863213],[31.231247,121.4864608],[31.231247,121.4867612],[31.2307792,121.4867398],[31.2307883,121.4862999]],region:"bund_edge"},{name:"",h:64,ring:[[31.2390705,121.4918927],[31.239223,121.4920849],[31.2392335,121.4920735],[31.239263,121.4921106],[31.2394336,121.4919256],[31.2394038,121.4918881],[31.2394905,121.4917941],[31.239351,121.4916182],[31.2392846,121.4916903],[31.2392479,121.491644],[31.2390752,121.4918314],[31.2390991,121.4918616],[31.2390705,121.4918927]],region:"bund_edge"},{name:"\u6D66\u6C5F\u6865\u96A7\u8FD0\u8425\u7BA1\u7406\u6709\u9650\u516C\u53F8\u5EF6\u4E1C\u5206\u516C\u53F8",h:38.4,ring:[[31.239107,121.4923597],[31.2389653,121.4924457],[31.2391023,121.4927543],[31.2391928,121.4926994],[31.2390862,121.4924592],[31.2391373,121.4924282],[31.239107,121.4923597]],region:"bund_edge"},{name:"",h:38.4,ring:[[31.2389474,121.4918973],[31.2387755,121.4920013],[31.2389358,121.4923635],[31.2390841,121.4922737],[31.2390566,121.4922116],[31.2390801,121.4921973],[31.2389474,121.4918973]],region:"bund_edge"},{name:"",h:9.6,ring:[[31.2421181,121.4916488],[31.2421883,121.4916639],[31.2422586,121.4916993],[31.2423026,121.4917374],[31.2426279,121.4921364],[31.2426509,121.4921898],[31.2426551,121.4922438],[31.2426408,121.4922961],[31.242484,121.4924697],[31.2419801,121.4918055],[31.2421181,121.4916488]],region:"bund_edge"},{name:"",h:32,ring:[[31.2428519,121.4843432],[31.2428512,121.4843927],[31.2430617,121.4843969],[31.2430625,121.4843447],[31.2430942,121.4843454],[31.2430954,121.4842646],[31.2430978,121.4841064],[31.2430983,121.4840698],[31.2430989,121.4840295],[31.2430672,121.4840288],[31.2430678,121.4839862],[31.2428573,121.4839819],[31.2428566,121.4840274],[31.2428329,121.4840269],[31.2428319,121.4840953],[31.2428294,121.4842616],[31.2428282,121.4843427],[31.2428519,121.4843432]],region:"bund_edge"},{name:"",h:41.6,ring:[[31.2436646,121.4847848],[31.2434161,121.4847893],[31.2434152,121.4850713],[31.2434323,121.4850691],[31.2434314,121.4852154],[31.2436515,121.4852177],[31.2436524,121.4850649],[31.2436665,121.4850653],[31.2436646,121.4847848]],region:"bund_edge"},{name:"",h:32,ring:[[31.2437207,121.4852184],[31.2436515,121.4852177],[31.2434314,121.4852154],[31.2432047,121.485213],[31.2432024,121.485256],[31.2431898,121.485256],[31.2431824,121.4855143],[31.243199,121.4855135],[31.2431982,121.4855517],[31.2433699,121.4855538],[31.2433701,121.4855137],[31.2433828,121.4855133],[31.2433859,121.4854303],[31.2435349,121.4854303],[31.2435349,121.4854974],[31.2437185,121.4854933],[31.2437188,121.4854491],[31.2437323,121.4854488],[31.2437331,121.4852626],[31.2437203,121.4852627],[31.2437207,121.4852184]],region:"bund_edge"},{name:"\u6021\u548C\u6D0B\u884C\u5927\u697C",h:22.4,ring:[[31.2426072,121.4850847],[31.2424869,121.4850939],[31.2424617,121.4850966],[31.2424415,121.485121],[31.2424365,121.4853434],[31.2422993,121.4853302],[31.2423307,121.4850534],[31.242202,121.4850376],[31.2421995,121.485073],[31.2421756,121.4850708],[31.2421139,121.4855395],[31.2425353,121.4855985],[31.2425993,121.4855204],[31.2426112,121.4851344],[31.2426072,121.4850847]],region:"bund_edge"},{name:"\u683C\u6797\u90AE\u8239\u5927\u697C",h:28.8,ring:[[31.2430054,121.4849163],[31.2427419,121.4849198],[31.2427415,121.4852843],[31.2427163,121.4852839],[31.2427162,121.4855821],[31.2427415,121.4855848],[31.2427419,121.4856306],[31.2429043,121.4856304],[31.2429089,121.4851985],[31.2429433,121.4851985],[31.2429437,121.4852337],[31.2430029,121.4852334],[31.2430054,121.4849163]],region:"bund_edge"},{name:"\u4E1C\u65B9\u6C47\u7406\u94F6\u884C\u5927\u697C",h:19.2,ring:[[31.2431434,121.4849297],[31.243042,121.4849278],[31.2430384,121.4851982],[31.2430625,121.4851986],[31.2430614,121.4852826],[31.2429396,121.4852804],[31.2429349,121.4856298],[31.2431339,121.4856334],[31.2431434,121.4849297]],region:"bund_edge"},{name:"\u76CA\u4E30\xB7\u5916\u6EE9\u6E90",h:16,ring:[[31.2424859,121.483801],[31.2424833,121.484593],[31.242531,121.4845901],[31.2425333,121.4846947],[31.2424788,121.4847003],[31.2424869,121.4850939],[31.2426072,121.4850847],[31.2426136,121.4843513],[31.2426251,121.4838685],[31.2426311,121.4838564],[31.2426309,121.4838364],[31.2426249,121.4838225],[31.2426125,121.483813],[31.2425967,121.4838124],[31.2425852,121.4838144],[31.2425484,121.4838133],[31.2425297,121.4837948],[31.2424859,121.483801]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2424279,121.483949],[31.2423728,121.483949],[31.2423705,121.4838337],[31.2422811,121.4838364],[31.2422467,121.484067],[31.2422334,121.4841746],[31.2422242,121.4842631],[31.2422238,121.4843487],[31.2422288,121.4845796],[31.2422352,121.4847081],[31.2422517,121.4848398],[31.2422724,121.4849605],[31.2423659,121.4849736],[31.2423659,121.4849441],[31.2424164,121.4849441],[31.2424279,121.483949]],region:"bund_edge"},{name:"\u4E2D\u56FD\u519C\u4E1A\u94F6\u884C",h:22.4,ring:[[31.2421114,121.4851635],[31.2419617,121.4851476],[31.2419072,121.4854858],[31.2419548,121.485495],[31.2420718,121.4855177],[31.2421114,121.4851635]],region:"bund_edge"},{name:"\u4E2D\u56FD\u5DE5\u5546\u94F6\u884C",h:22.4,ring:[[31.2421388,121.4847292],[31.2417438,121.4846604],[31.2416486,121.4854086],[31.2417716,121.48543],[31.2418945,121.4854514],[31.241937,121.4851174],[31.2420861,121.4851433],[31.2421388,121.4847292]],region:"bund_edge"},{name:"\u4E2D\u56FD\u94F6\u884C\u5927\u697C",h:51.2,ring:[[31.2416336,121.4851795],[31.241383,121.4851439],[31.2413612,121.4853537],[31.2416118,121.4853893],[31.2416336,121.4851795]],region:"bund_edge"},{name:"\u548C\u5E73\u996D\u5E97\u5357\u697C",h:25.6,ring:[[31.2406245,121.484437],[31.2406106,121.4843649],[31.2405934,121.4843692],[31.2404861,121.4843972],[31.2404991,121.484466],[31.2404739,121.4844738],[31.2404858,121.4845355],[31.2404569,121.4845465],[31.2404373,121.4845697],[31.2404284,121.4846041],[31.2404306,121.4846404],[31.2404414,121.4846688],[31.2404638,121.4846968],[31.2404914,121.4847082],[31.240516,121.4847032],[31.2405569,121.4849137],[31.2406294,121.485296],[31.2407377,121.4852929],[31.2407477,121.4853007],[31.2407583,121.4853025],[31.2407735,121.4852974],[31.2407849,121.4852893],[31.2407946,121.4852758],[31.2407977,121.4852609],[31.240796,121.4852435],[31.240791,121.4852337],[31.240783,121.4852271],[31.240775,121.4852272],[31.2406371,121.4845099],[31.2406456,121.4844999],[31.2406512,121.4844879],[31.2406538,121.4844733],[31.2406495,121.4844572],[31.2406421,121.484445],[31.2406329,121.4844379],[31.2406245,121.484437]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2417904,121.4836836],[31.2417287,121.483673],[31.2417324,121.483655],[31.2415902,121.4836297],[31.2415873,121.4836494],[31.2415542,121.4836433],[31.2413868,121.4851078],[31.2416322,121.4851454],[31.2417423,121.4841771],[31.2416974,121.4841672],[31.2417147,121.4839974],[31.2417513,121.4840019],[31.2417904,121.4836836]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2420896,121.4841541],[31.2418784,121.4841252],[31.2418694,121.4842092],[31.2418873,121.4842122],[31.2418798,121.4842824],[31.2418617,121.4842781],[31.2418347,121.4845271],[31.2420485,121.4845569],[31.2420748,121.4842985],[31.2420552,121.4842971],[31.2420612,121.4842386],[31.2420806,121.484242],[31.2420896,121.4841541]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u603B\u5DE5\u4F1A",h:22.4,ring:[[31.2389772,121.4849364],[31.2388431,121.4849767],[31.2389113,121.4852961],[31.2389256,121.4853851],[31.238963,121.4853794],[31.2389817,121.4855667],[31.2391879,121.4855332],[31.2391649,121.4852754],[31.239125,121.485279],[31.2391109,121.4852811],[31.2391219,121.4853155],[31.2391203,121.485346],[31.2390671,121.4853575],[31.2390578,121.4852798],[31.2389772,121.4849364]],region:"bund_edge"},{name:"\u5916\u6EE9\u516C\u5171\u670D\u52A1\u4E2D\u5FC3",h:16,ring:[[31.2393209,121.485048],[31.2396518,121.4849452],[31.239618,121.4848059],[31.2391312,121.4849834],[31.239197,121.4853011],[31.2391803,121.4853056],[31.2392094,121.4855186],[31.2394151,121.4854835],[31.2393209,121.485048]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5916\u6C47\u4EA4\u6613\u4E2D\u5FC3",h:16,ring:[[31.2396787,121.4849792],[31.2393769,121.4850765],[31.2394628,121.4854743],[31.23977,121.4854132],[31.2396787,121.4849792]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2389981,121.4848902],[31.2388316,121.4849416],[31.2388096,121.4848441],[31.2390538,121.4847698],[31.2391649,121.4852754],[31.239125,121.485279],[31.2391164,121.4852412],[31.2390802,121.4852372],[31.2389981,121.4848902]],region:"bund_edge"},{name:"\u4E0A\u6D77\u6D77\u5173",h:22.4,ring:[[31.2387658,121.4852915],[31.2387146,121.4852984],[31.2385075,121.4853261],[31.2384403,121.4853351],[31.2384467,121.4853999],[31.2384583,121.4855179],[31.2384643,121.4855794],[31.2385319,121.4855703],[31.2387449,121.4855417],[31.2387898,121.4855357],[31.2387825,121.4854616],[31.2387715,121.48535],[31.2387658,121.4852915]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.238507,121.4853153],[31.2384318,121.4853218],[31.2384367,121.4854008],[31.2384467,121.4853999],[31.238512,121.4853944],[31.2385075,121.4853261],[31.238507,121.4853153]],region:"bund_edge"},{name:"",h:32,ring:[[31.2386698,121.4854572],[31.2386012,121.4854669],[31.2386091,121.4855445],[31.2386778,121.4855348],[31.2386698,121.4854572]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2387906,121.4852636],[31.2387119,121.4852765],[31.2387146,121.4852984],[31.2387217,121.4853583],[31.2387715,121.48535],[31.2388004,121.4853454],[31.2387906,121.4852636]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2385265,121.4855098],[31.2384583,121.4855179],[31.2384505,121.4855186],[31.2384569,121.4855936],[31.2385329,121.4855848],[31.2385319,121.4855703],[31.2385265,121.4855098]],region:"bund_edge"},{name:"",h:28.8,ring:[[31.2388083,121.4854586],[31.2387825,121.4854616],[31.2387385,121.4854665],[31.2387449,121.4855417],[31.2387455,121.4855511],[31.2388153,121.4855432],[31.2388083,121.4854586]],region:"bund_edge"},{name:"\u76D8\u8C37\u94F6\u884C",h:22.4,ring:[[31.2371366,121.4857722],[31.2369971,121.4858463],[31.2368967,121.4858996],[31.2369861,121.4861297],[31.237226,121.4860023],[31.2371366,121.4857722]],region:"bund_edge"},{name:"\u6709\u5229\u5927\u697C",h:22.4,ring:[[31.2360894,121.4858971],[31.2358738,121.4859856],[31.2360439,121.4867231],[31.2362636,121.4865945],[31.2362774,121.4865194],[31.2360894,121.4858971]],region:"bund_edge"},{name:"\u8F6E\u8239\u62DB\u5546\u5C40\u5927\u697C",h:16,ring:[[31.2374725,121.4856948],[31.2374487,121.4857027],[31.2374419,121.4856681],[31.2374094,121.4856775],[31.2374161,121.485713],[31.2373791,121.4857251],[31.2373694,121.4856754],[31.2373155,121.4856942],[31.2373246,121.4857407],[31.2372171,121.4857709],[31.2372281,121.48583],[31.2372464,121.48583],[31.2372606,121.4858836],[31.2372642,121.4858876],[31.2372697,121.4858922],[31.2372762,121.4858971],[31.2373015,121.4858864],[31.2373152,121.4858998],[31.2374994,121.48583],[31.2374725,121.4856948]],region:"bund_edge"},{name:"\u5916\u6EE9\u4E94\u53F7",h:22.4,ring:[[31.2363943,121.4857759],[31.2361908,121.4858613],[31.2363379,121.4863442],[31.2363382,121.4863616],[31.2363674,121.4864411],[31.2363823,121.4864367],[31.2364118,121.486452],[31.2365616,121.4863333],[31.236539,121.4862374],[31.2365057,121.4862524],[31.2364652,121.4861242],[31.2365008,121.4861063],[31.2364725,121.4860191],[31.2364417,121.4860345],[31.2363841,121.4858559],[31.2364148,121.4858421],[31.2363943,121.4857759]],region:"bund_edge"},{name:"\u5916\u6EE9\u516D\u53F7",h:19.2,ring:[[31.2367628,121.4858116],[31.2366647,121.4858705],[31.2366532,121.485849],[31.2365385,121.4858892],[31.2364674,121.4859241],[31.2365473,121.4861388],[31.236522,121.4861496],[31.2365821,121.486313],[31.2366321,121.4862863],[31.2366211,121.4862621],[31.2368848,121.4861226],[31.2367628,121.4858116]],region:"bund_edge"},{name:"\u4E0A\u6D77\u4E9A\u7EC6\u4E9A\u5927\u697C",h:22.4,ring:[[31.2355771,121.4864946],[31.2352297,121.4866169],[31.2353326,121.4870162],[31.2356799,121.4868938],[31.2355771,121.4864946]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2358119,121.4861204],[31.2356134,121.4861909],[31.2356309,121.4862584],[31.2358295,121.4861879],[31.2358119,121.4861204]],region:"bund_edge"},{name:"\u4E0A\u6D77\u603B\u4F1A\u5927\u697C",h:22.4,ring:[[31.2358692,121.486209],[31.2355774,121.4863102],[31.2356775,121.4867049],[31.2356519,121.4867138],[31.2356937,121.486879],[31.2360111,121.4867689],[31.2358692,121.486209]],region:"bund_edge"},{name:"\u90FD\u57CE\u996D\u5E97",h:44.8,ring:[[31.2371317,121.4831614],[31.2372708,121.4831208],[31.2373907,121.4830858],[31.2373433,121.4828271],[31.237219,121.4828612],[31.2372251,121.4828977],[31.2372264,121.48293],[31.2372235,121.4829581],[31.237216,121.4829835],[31.2372012,121.4830082],[31.2371824,121.4830283],[31.237162,121.4830437],[31.2371406,121.4830544],[31.2371152,121.4830629],[31.2371317,121.4831614]],region:"bund_edge"},{name:"\u9999\u683C\u91CC\u62C9\u9152\u5E97",h:144,ring:[[31.2378929,121.4944554],[31.237686,121.4939719],[31.2373893,121.4941457],[31.2374569,121.4943035],[31.2375963,121.4946291],[31.2378704,121.4944687],[31.2378929,121.4944554]],region:"bund_edge"},{name:"\u5723\u4E09\u4E00\u5802",h:22.4,ring:[[31.2384677,121.4815268],[31.2384273,121.4815404],[31.2384225,121.4815209],[31.2383183,121.4815558],[31.2383215,121.4815685],[31.2382753,121.4815838],[31.238287,121.4816319],[31.2382652,121.4816391],[31.2382948,121.4817615],[31.2383124,121.4817497],[31.2383845,121.4820397],[31.2386023,121.4819657],[31.2385019,121.4815615],[31.2384783,121.4815695],[31.2384677,121.4815268]],region:"bund_edge"},{name:"",h:32,ring:[[31.2317636,121.4865072],[31.2318324,121.4865327],[31.231884,121.486589],[31.2319104,121.4866601],[31.2321202,121.4873146],[31.2321168,121.4873723],[31.2320893,121.4874152],[31.2316558,121.4876244],[31.2316122,121.4876163],[31.2315859,121.4875748],[31.2316111,121.4867406],[31.2316168,121.4866548],[31.2316409,121.486581],[31.2316982,121.4865247],[31.2317636,121.4865072]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2329304,121.4863405],[31.2330534,121.4868331],[31.2329104,121.4868818],[31.2328132,121.486492],[31.2327939,121.4864145],[31.2327876,121.4863893],[31.2329304,121.4863405]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2327482,121.4864048],[31.2327537,121.4864276],[31.2327939,121.4864145],[31.2328132,121.486492],[31.2325222,121.4865871],[31.2325184,121.4865712],[31.2324982,121.4864865],[31.2327482,121.4864048]],region:"bund_edge"},{name:"\u798F\u4F51\u95E8\u5C0F\u5546\u54C1\u5E02\u573A",h:25.6,ring:[[31.2302111,121.4830613],[31.2298136,121.4831248],[31.2299434,121.484236],[31.230341,121.4841725],[31.2302111,121.4830613]],region:"bund_edge"},{name:"\u4E2D\u6C47\u5927\u697C",h:35.2,ring:[[31.2321145,121.4822837],[31.2320452,121.4820234],[31.2320274,121.4819565],[31.2325687,121.4817932],[31.2326566,121.4818553],[31.2327007,121.4819532],[31.2327061,121.4820563],[31.2326622,121.4821524],[31.2321145,121.4822837]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2362381,121.4818837],[31.2359354,121.4819615],[31.2359949,121.4822975],[31.2362911,121.4822223],[31.2362381,121.4818837]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2356226,121.4822408],[31.2356419,121.4823453],[31.2355638,121.4823726],[31.2355717,121.4824105],[31.2356473,121.4823889],[31.2356733,121.4825136],[31.2355969,121.4825354],[31.2356037,121.4825678],[31.2356832,121.482545],[31.2357097,121.482663],[31.2356313,121.4826895],[31.2356435,121.4827522],[31.2357265,121.4827217],[31.2357572,121.4828273],[31.2355829,121.4828777],[31.2354587,121.482303],[31.2356226,121.4822408]],region:"bund_edge"},{name:"",h:96,ring:[[31.2362371,121.4838707],[31.2363812,121.4845252],[31.236216,121.4845749],[31.2360719,121.4839205],[31.2362371,121.4838707]],region:"bund_edge"},{name:"\u61FF\u5FB7\u5927\u697C",h:12.8,ring:[[31.2360854,121.4845646],[31.2361232,121.4847258],[31.2359145,121.4848026],[31.2358742,121.4847779],[31.2358427,121.4847346],[31.2357773,121.4844618],[31.2359111,121.4844109],[31.2359482,121.484571],[31.2359883,121.4845985],[31.2360854,121.4845646]],region:"bund_edge"},{name:"\u65B0\u5EB7\u5927\u697C",h:38.4,ring:[[31.2391583,121.4824582],[31.2391436,121.4824745],[31.2391358,121.4824966],[31.2391898,121.4827041],[31.2392202,121.4826957],[31.2392853,121.4829534],[31.2395973,121.4828375],[31.2395602,121.4827013],[31.239666,121.4826537],[31.2395772,121.4823508],[31.2396103,121.4823342],[31.2396017,121.4823044],[31.2395752,121.4822902],[31.2391583,121.4824582]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5A01\u65AF\u6C40\u5927\u996D\u5E97",h:112,ring:[[31.2346726,121.4820858],[31.2344474,121.4821575],[31.2344686,121.4822487],[31.234134,121.4823553],[31.2341106,121.4822549],[31.2339033,121.4823209],[31.2340211,121.4828269],[31.2342304,121.4827602],[31.2341855,121.4825672],[31.2345163,121.4824619],[31.2345649,121.4826707],[31.2347919,121.4825984],[31.2346726,121.4820858]],region:"bund_edge"},{name:"\u4E0A\u6D77\u81EA\u7136\u535A\u7269\u9986\u65E7\u9986",h:19.2,ring:[[31.2338351,121.4824833],[31.2338971,121.482814],[31.2333762,121.4830052],[31.2331255,121.4827009],[31.2331156,121.4826872],[31.2331087,121.4826688],[31.2331108,121.4826518],[31.2331193,121.4826394],[31.2331305,121.4826322],[31.2338351,121.4824833]],region:"bund_edge"},{name:"\u5EF6\u6CB3\u5927\u697C",h:22.4,ring:[[31.2337731,121.4821166],[31.2331784,121.4822579],[31.2331575,121.4822669],[31.2331347,121.4822829],[31.2331189,121.4822988],[31.2331035,121.4823198],[31.2330872,121.482343],[31.2330711,121.4823707],[31.2330595,121.482405],[31.233061,121.4824408],[31.233084,121.4825655],[31.2331537,121.482548],[31.2331405,121.4824538],[31.2331439,121.4824186],[31.2331647,121.4823816],[31.233188,121.4823592],[31.2332161,121.4823498],[31.2337856,121.4822037],[31.2337731,121.4821166]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2338045,121.4823084],[31.2338225,121.4824157],[31.2332203,121.4825597],[31.2332023,121.4824577],[31.2338045,121.4823084]],region:"bund_edge"},{name:"",h:16,ring:[[31.2321041,121.482959],[31.23134,121.4831604],[31.231315,121.483153],[31.2312875,121.4831028],[31.2312369,121.4829244],[31.2312379,121.4828786],[31.2312494,121.4828522],[31.231271,121.4828273],[31.2313086,121.4827986],[31.2319636,121.4826404],[31.2319958,121.4826525],[31.2320182,121.4826664],[31.2320382,121.4826837],[31.232054,121.4827027],[31.2320656,121.4827252],[31.2321355,121.4829038],[31.2321328,121.4829215],[31.232125,121.4829383],[31.232115,121.4829502],[31.2321041,121.482959]],region:"bund_edge"},{name:"",h:57.6,ring:[[31.2332603,121.4838951],[31.232984,121.4840392],[31.2329326,121.4839483],[31.2329099,121.483842],[31.2329075,121.4837483],[31.232923,121.4836713],[31.2329577,121.4835902],[31.2329816,121.4835483],[31.2330115,121.4835077],[31.2330594,121.483463],[31.2332603,121.4838951]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5DE5\u5546\u8054\u5927\u53A6",h:28.8,ring:[[31.2331442,121.4847645],[31.2330399,121.484744],[31.2329306,121.4843687],[31.2332875,121.4842265],[31.2333772,121.4842797],[31.2334224,121.4844233],[31.2334848,121.4846203],[31.2333823,121.4846642],[31.2334597,121.4849086],[31.2334341,121.4849196],[31.2334604,121.4850026],[31.2332815,121.4850801],[31.2332543,121.4849944],[31.2332215,121.4850086],[31.2331442,121.4847645]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2353045,121.4826797],[31.2353954,121.4830601],[31.2352951,121.4830929],[31.2351635,121.4827265],[31.2353045,121.4826797]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2342883,121.4844944],[31.2343822,121.4848608],[31.2342325,121.4849169],[31.2341321,121.4845464],[31.2342883,121.4844944]],region:"bund_edge"},{name:"",h:16,ring:[[31.2363088,121.4826745],[31.2363704,121.4829107],[31.2361409,121.4829869],[31.2360975,121.4827473],[31.2361745,121.4827234],[31.2361973,121.48286],[31.236271,121.4828404],[31.2362506,121.4827045],[31.2363088,121.4826745]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2354289,121.4825552],[31.235521,121.483007],[31.2354237,121.4830341],[31.2353316,121.4825824],[31.2354289,121.4825552]],region:"bund_edge"},{name:"\u9526\u6C5F\u96C6\u56E2\u8D22\u52A1\u516C\u53F8\u8BC1\u5238\u7ECF\u8425\u90E8",h:25.6,ring:[[31.2358826,121.4853657],[31.2360135,121.485833],[31.2358174,121.4859064],[31.2357064,121.4855117],[31.2357308,121.4855023],[31.2357127,121.4854354],[31.2357272,121.4854294],[31.2358826,121.4853657]],region:"bund_edge"},{name:"\u4E2D\u56FD\u4EBA\u6C11\u89E3\u653E\u519B\u6D77\u519B\u540E\u52E4\u90E8\u4E0A\u6D77\u7269\u8D44\u7AD9",h:16,ring:[[31.2363653,121.4832781],[31.2361008,121.4833526],[31.2360642,121.4831749],[31.2363287,121.4831003],[31.2363653,121.4832781]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2330824,121.4856901],[31.2331408,121.4858887],[31.2330298,121.4859363],[31.2330009,121.4858343],[31.2329716,121.485733],[31.2330824,121.4856901]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2360519,121.4833758],[31.2356459,121.4835021],[31.2355457,121.4833288],[31.236008,121.4831865],[31.2360519,121.4833758]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2351218,121.4818211],[31.23516,121.4820105],[31.2349753,121.4820615],[31.234937,121.4818722],[31.2351218,121.4818211]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2322349,121.4867917],[31.2323273,121.4870789],[31.2322803,121.4870996],[31.232188,121.4868123],[31.2322349,121.4867917]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2331574,121.4859504],[31.233203,121.4861071],[31.2330909,121.4861517],[31.2330469,121.4859964],[31.2331574,121.4859504]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.236092,121.4848447],[31.2361836,121.4851645],[31.2361684,121.4851911],[31.2360075,121.4852542],[31.2359105,121.4849159],[31.236092,121.4848447]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2352848,121.4826223],[31.2351326,121.4826666],[31.2350213,121.4821435],[31.2351736,121.4820992],[31.2352848,121.4826223]],region:"bund_edge"},{name:"\u4E0A\u6D77\u957F\u9014\u7535\u4FE1\u79D1\u6280\u53D1\u5C55\u516C\u53F8",h:25.6,ring:[[31.2354239,121.4860867],[31.235505,121.4863877],[31.235178,121.4865083],[31.2350969,121.4862072],[31.2354239,121.4860867]],region:"bund_edge"},{name:"\u4E0A\u6D77\u7535\u6C14\u96C6\u56E2\u603B\u516C\u53F8",h:25.6,ring:[[31.2365297,121.4849451],[31.2361751,121.485054],[31.2361281,121.4848703],[31.2364873,121.4847615],[31.2365297,121.4849451]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2355292,121.4830623],[31.2355635,121.4832047],[31.235347,121.4832759],[31.2353128,121.4831335],[31.2355292,121.4830623]],region:"bund_edge"},{name:"\u793C\u548C\u5927\u697C",h:16,ring:[[31.2392046,121.4817855],[31.2392429,121.481942],[31.2391675,121.4819745],[31.2392004,121.482111],[31.2392983,121.4820773],[31.2393394,121.4822479],[31.2391168,121.4823388],[31.2390828,121.4823203],[31.2389717,121.4818714],[31.2392046,121.4817855]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.235346,121.4821681],[31.2354219,121.4825276],[31.2353393,121.4825514],[31.2352634,121.482192],[31.235346,121.4821681]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2353185,121.4820257],[31.2353431,121.4821565],[31.2352473,121.4821811],[31.2352228,121.4820503],[31.2353185,121.4820257]],region:"bund_edge"},{name:"Waldorf Astoria",h:80,ring:[[31.2356923,121.4854295],[31.2356242,121.4854532],[31.2356426,121.4855256],[31.235395,121.4856119],[31.235377,121.4855411],[31.2353126,121.4852879],[31.2356282,121.485178],[31.2356923,121.4854295]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2324577,121.4842331],[31.2322588,121.4843133],[31.2322515,121.4842885],[31.2322251,121.4842992],[31.2322045,121.4842293],[31.2324298,121.4841385],[31.2324577,121.4842331]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.23964,121.4819295],[31.2396869,121.4821099],[31.2394071,121.4822052],[31.2393638,121.4820238],[31.23964,121.4819295]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2359138,121.4824592],[31.235978,121.4827497],[31.2357851,121.482808],[31.2357202,121.4825186],[31.2359138,121.4824592]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2360056,121.4827686],[31.2360559,121.4830252],[31.2356477,121.483145],[31.2355879,121.482896],[31.2356598,121.4828741],[31.2356861,121.4830203],[31.2357588,121.4829952],[31.235735,121.4828512],[31.2358442,121.482818],[31.2358714,121.4829661],[31.2359342,121.4829448],[31.235906,121.482799],[31.2360056,121.4827686]],region:"bund_edge"},{name:"",h:16,ring:[[31.2352578,121.4817735],[31.2353005,121.4819894],[31.2351781,121.4820225],[31.2351354,121.4818065],[31.2352578,121.4817735]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2355167,121.483334],[31.2357513,121.4838844],[31.2356179,121.4839589],[31.2353733,121.4834036],[31.2353771,121.4833793],[31.2353931,121.4833622],[31.2355167,121.483334]],region:"bund_edge"},{name:"\u661F\u817E\u5927\u53A6",h:96,ring:[[31.2326986,121.4828008],[31.2323272,121.4828881],[31.2322785,121.4826053],[31.2326499,121.4825179],[31.2326986,121.4828008]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2323863,121.483561],[31.2325924,121.4841529],[31.232574,121.4841886],[31.2324659,121.4842352],[31.232427,121.4841118],[31.2324602,121.4840975],[31.2324406,121.4840355],[31.2323991,121.4840143],[31.2322649,121.4836215],[31.2323863,121.483561]],region:"bund_edge"},{name:"\u521B\u4E1A\u5927\u697C",h:28.8,ring:[[31.2352008,121.4849928],[31.2348805,121.4851255],[31.2348544,121.4850296],[31.2348119,121.4850475],[31.2347693,121.4848847],[31.2351235,121.4847273],[31.2352008,121.4849928]],region:"bund_edge"},{name:"\u9AD8\u767B\u91D1\u878D\u5927\u53A6",h:51.2,ring:[[31.2353828,121.4857891],[31.2354417,121.486013],[31.2351531,121.4861168],[31.2351173,121.4860875],[31.2350814,121.4859533],[31.2350986,121.4858914],[31.2353828,121.4857891]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2361986,121.4835931],[31.2362335,121.4837384],[31.2357993,121.4838702],[31.2356534,121.4835339],[31.2360394,121.4834326],[31.2360834,121.4836187],[31.2361986,121.4835931]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2318974,121.4821518],[31.2310555,121.4824077],[31.2310459,121.4824539],[31.2310889,121.4824874],[31.2319249,121.4823378],[31.2319476,121.4823014],[31.2318974,121.4821518]],region:"bund_edge"},{name:"",h:16,ring:[[31.2346929,121.484524],[31.2347492,121.484734],[31.2344752,121.4848345],[31.234382,121.4844874],[31.234553,121.4844247],[31.2345723,121.4844966],[31.2346086,121.4844832],[31.2346262,121.4845485],[31.2346929,121.484524]],region:"bund_edge"},{name:"\u56DB\u5DDD\u5927\u697C",h:25.6,ring:[[31.2343713,121.4849019],[31.2344471,121.4850018],[31.2345234,121.4850601],[31.2345919,121.4850889],[31.2346495,121.4850935],[31.2347563,121.4850447],[31.2347888,121.4851579],[31.2346192,121.4852375],[31.2345415,121.4852326],[31.2344766,121.4851936],[31.234425,121.4851626],[31.2343609,121.4851112],[31.2343034,121.4850479],[31.2342466,121.4849555],[31.2343713,121.4849019]],region:"bund_edge"},{name:"\u4E0A\u6D77\u533B\u836F\u5DE5\u4E1A\u6709\u9650\u516C\u53F8",h:19.2,ring:[[31.2399151,121.4840905],[31.2399478,121.4841161],[31.240031,121.4844329],[31.2397181,121.4845428],[31.2396225,121.4841952],[31.2399151,121.4840905]],region:"bund_edge"},{name:"\u4E45\u4E8B\u5546\u52A1\u5927\u53A6",h:16,ring:[[31.2382583,121.4831013],[31.2383962,121.4837302],[31.2383297,121.4837502],[31.2383401,121.4837995],[31.2383757,121.4838221],[31.2383866,121.483874],[31.2383633,121.4839139],[31.238324,121.4839321],[31.2382811,121.4839006],[31.2382539,121.4839102],[31.23826,121.4839453],[31.2379099,121.4840518],[31.2379021,121.484016],[31.2378772,121.4840235],[31.2378572,121.4840675],[31.2378155,121.484083],[31.2377702,121.4840563],[31.2377587,121.4839965],[31.2377953,121.4839395],[31.2376701,121.4833682],[31.2380255,121.4832617],[31.2380069,121.4831767],[31.2382583,121.4831013]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2363875,121.4835108],[31.2361078,121.4835922],[31.2360734,121.4834308],[31.2363532,121.4833494],[31.2363875,121.4835108]],region:"bund_edge"},{name:"\u5143\u82B3\u5F04",h:9.6,ring:[[31.2368551,121.4850546],[31.2369014,121.4852361],[31.236704,121.4853051],[31.2366577,121.4851236],[31.2368551,121.4850546]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u9AD8\u7EA7\u4EBA\u6C11\u6CD5\u9662",h:25.6,ring:[[31.2366919,121.4817934],[31.2367437,121.4820298],[31.23641,121.4821339],[31.2363561,121.4818976],[31.2366919,121.4817934]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2395389,121.4845779],[31.239594,121.484803],[31.239394,121.48487],[31.2393647,121.4847505],[31.2393176,121.4847663],[31.2393456,121.4848804],[31.2391405,121.4849492],[31.2390867,121.4847294],[31.2395389,121.4845779]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2387017,121.4827616],[31.238745,121.4829736],[31.2384088,121.4830675],[31.2383655,121.4828556],[31.2387017,121.4827616]],region:"bund_edge"},{name:"",h:16,ring:[[31.2365527,121.4855957],[31.2363899,121.485651],[31.2363721,121.4855795],[31.2365349,121.4855242],[31.2365527,121.4855957]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5916\u6EE9\u5357\u4EAC\u4E1C\u8DEF\u4E9A\u6735\u9152\u5E97",h:25.6,ring:[[31.2365147,121.4835171],[31.236655,121.4841771],[31.2364474,121.4842438],[31.2363128,121.483572],[31.2365147,121.4835171]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2381129,121.4849423],[31.2378154,121.4849859],[31.2378083,121.4849196],[31.2378317,121.4849161],[31.2378191,121.4847986],[31.2377966,121.4848016],[31.2377889,121.4847335],[31.2380858,121.4846894],[31.2381129,121.4849423]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u4ED3\u50A8\u884C\u4E1A\u534F\u4F1A",h:28.8,ring:[[31.2366733,121.484263],[31.2367146,121.4844744],[31.2364978,121.4845323],[31.2364565,121.4843209],[31.2366733,121.484263]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2364896,121.4830565],[31.2365175,121.4832188],[31.2365559,121.4834498],[31.2364513,121.4834733],[31.2363809,121.4830837],[31.2364896,121.4830565]],region:"bund_edge"},{name:"\u4E2D\u56FD\u7535\u4FE1",h:25.6,ring:[[31.2386927,121.4827363],[31.2383605,121.4827968],[31.2383338,121.4826394],[31.2383449,121.4826115],[31.238671,121.4825529],[31.2386927,121.4827363]],region:"bund_edge"},{name:"\u534E\u4E1C\u7535\u529B\u7BA1\u7406\u5C40",h:22.4,ring:[[31.2398327,121.4815905],[31.2399419,121.4819504],[31.239904,121.4820168],[31.2397255,121.4820941],[31.2396545,121.4818604],[31.2396758,121.4818504],[31.2396281,121.4816782],[31.2397949,121.4816062],[31.2398327,121.4815905]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2370604,121.4854373],[31.2371409,121.4857018],[31.2370622,121.4857345],[31.2369818,121.48547],[31.2370604,121.4854373]],region:"bund_edge"},{name:"",h:51.2,ring:[[31.2390729,121.4840262],[31.2391517,121.4843856],[31.2390168,121.4844261],[31.2389379,121.4840667],[31.2390729,121.4840262]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2367403,121.483163],[31.2367802,121.4833722],[31.2366664,121.4834018],[31.2366263,121.4831905],[31.2367403,121.483163]],region:"bund_edge"},{name:"",h:16,ring:[[31.2372194,121.4850196],[31.2372258,121.4850468],[31.2372439,121.4851283],[31.2371941,121.4851435],[31.2372171,121.4852437],[31.2371196,121.4852822],[31.2370684,121.4850629],[31.2372194,121.4850196]],region:"bund_edge"},{name:"\u5143\u82B3\u5F04",h:9.6,ring:[[31.2370228,121.4851939],[31.2369189,121.4852309],[31.2368754,121.485064],[31.2369793,121.4850271],[31.2370228,121.4851939]],region:"bund_edge"},{name:"",h:38.4,ring:[[31.2392236,121.4843943],[31.2392784,121.484617],[31.2391487,121.4846606],[31.2390939,121.4844379],[31.2392236,121.4843943]],region:"bund_edge"},{name:"",h:32,ring:[[31.2381796,121.482983],[31.2381956,121.4830519],[31.2380354,121.4831025],[31.2380195,121.4830336],[31.2381295,121.4829988],[31.2381796,121.482983]],region:"bund_edge"},{name:"\u8054\u5408\u5927\u697C",h:28.8,ring:[[31.2388925,121.4836458],[31.2389009,121.4836849],[31.2389274,121.4838088],[31.2386468,121.4838899],[31.2385899,121.4838263],[31.2385714,121.4837332],[31.2388925,121.4836458]],region:"bund_edge"},{name:"",h:32,ring:[[31.237723,121.4829509],[31.2374105,121.4830297],[31.2373714,121.4828178],[31.2376839,121.482739],[31.237723,121.4829509]],region:"bund_edge"},{name:"\u6C49\u53E3\u8DEF50\u53F7\u5927\u697C",h:12.8,ring:[[31.2388235,121.4840042],[31.2389977,121.4847278],[31.2388052,121.4847912],[31.2386424,121.4841144],[31.2386557,121.4840594],[31.2388235,121.4840042]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u653F\u5E9C\u53C2\u4E8B\u5BA4",h:32,ring:[[31.2380678,121.4842968],[31.2381318,121.4845994],[31.2377719,121.4847035],[31.2377648,121.4846702],[31.237708,121.4844009],[31.2380678,121.4842968]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2384922,121.4850236],[31.2385491,121.4852829],[31.2384462,121.4853138],[31.2383895,121.485054],[31.2384922,121.4850236]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2408864,121.4829017],[31.2406994,121.4829884],[31.2406645,121.4828799],[31.2408539,121.4827917],[31.2408864,121.4829017]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2426227,121.4834437],[31.2426218,121.4836404],[31.242605,121.4836623],[31.242364,121.4836084],[31.2423681,121.4833838],[31.2424495,121.4833853],[31.2424488,121.4834438],[31.2426227,121.4834437]],region:"bund_edge"},{name:"",h:32,ring:[[31.2376683,121.4829921],[31.2377097,121.4832053],[31.2374987,121.4832612],[31.2374574,121.483048],[31.2376683,121.4829921]],region:"bund_edge"},{name:"\u624B\u8868\u4E03\u5382\u529E\u516C\u697C",h:12.8,ring:[[31.2373097,121.4840984],[31.2374403,121.4840623],[31.2374502,121.4841127],[31.2375806,121.4840766],[31.2375924,121.4841355],[31.237674,121.4841086],[31.237699,121.4842169],[31.2373705,121.4843217],[31.2373446,121.4843055],[31.2373097,121.4840984]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2375571,121.4835315],[31.2372423,121.4836214],[31.2372094,121.4834243],[31.2375256,121.483345],[31.2375571,121.4835315]],region:"bund_edge"},{name:"\u5143\u82B3\u5927\u697C",h:19.2,ring:[[31.2365403,121.4849925],[31.2366414,121.4854338],[31.2363517,121.4855296],[31.236204,121.4851082],[31.2365403,121.4849925]],region:"bund_edge"},{name:"\u534E\u4E1C\u5EFA\u7B51\u8BBE\u8BA1\u7814\u7A76\u9662",h:32,ring:[[31.2381094,121.4826451],[31.2382265,121.4827386],[31.2382457,121.4828176],[31.2382762,121.4829523],[31.2381796,121.482983],[31.2381295,121.4829988],[31.2380986,121.4828631],[31.238062,121.4828712],[31.2378177,121.4829249],[31.2378009,121.4829286],[31.2377582,121.482932],[31.2377203,121.4827316],[31.2381094,121.4826451]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.237272,121.4846837],[31.2373357,121.4849826],[31.2372194,121.4850196],[31.2371048,121.4850498],[31.2370418,121.4847536],[31.237181,121.48471],[31.237272,121.4846837]],region:"bund_edge"},{name:"\u5B89\u5229\u5927\u697C",h:22.4,ring:[[31.2396877,121.4837394],[31.2397718,121.4840764],[31.2395692,121.4841544],[31.2394945,121.4838534],[31.2395048,121.4838118],[31.2396877,121.4837394]],region:"bund_edge"},{name:"\u4E0A\u6D77\u533B\u836F\u5DE5\u4E1A\u6709\u9650\u516C\u53F8",h:19.2,ring:[[31.2394337,121.4840621],[31.2394129,121.4840713],[31.2392096,121.4841452],[31.2391698,121.483995],[31.2391671,121.4839137],[31.2393558,121.4838488],[31.2393848,121.4838775],[31.2394337,121.4840621]],region:"bund_edge"},{name:"",h:32,ring:[[31.2394791,121.4843201],[31.2392641,121.4843983],[31.2391979,121.4841495],[31.2392096,121.4841452],[31.2394129,121.4840713],[31.2394791,121.4843201]],region:"bund_edge"},{name:"",h:16,ring:[[31.2373407,121.4850072],[31.2373877,121.4852197],[31.2373698,121.4852251],[31.2372719,121.4852571],[31.2372439,121.4851283],[31.2372258,121.4850468],[31.2373407,121.4850072]],region:"bund_edge"},{name:"",h:32,ring:[[31.2390421,121.4827984],[31.2391235,121.4831219],[31.2390883,121.4831338],[31.2391005,121.4831863],[31.2388568,121.483243],[31.2387713,121.482894],[31.2388049,121.4828816],[31.2387967,121.4828545],[31.2390421,121.4827984]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2376198,121.4835706],[31.2376736,121.4838116],[31.2376117,121.4838316],[31.2372815,121.4839373],[31.2372366,121.4836891],[31.2376198,121.4835706]],region:"bund_edge"},{name:"\u4E2D\u56FD\u5EFA\u8BBE\u94F6\u884C",h:25.6,ring:[[31.2414599,121.4831796],[31.2414317,121.4834717],[31.2411502,121.4835885],[31.2410665,121.4833471],[31.2414599,121.4831796]],region:"bund_edge"},{name:"\u5143\u82B3\u5F04",h:9.6,ring:[[31.2369353,121.4848295],[31.2365917,121.4849402],[31.236626,121.4850856],[31.2369696,121.4849749],[31.2369353,121.4848295]],region:"bund_edge"},{name:"",h:32,ring:[[31.2395213,121.4845364],[31.239325,121.4846029],[31.2392847,121.48444],[31.239481,121.4843736],[31.2395213,121.4845364]],region:"bund_edge"},{name:"\u5B89\u57F9\u6D0B\u884C\u5927\u697C",h:9.6,ring:[[31.2432188,121.4835176],[31.2432411,121.4837319],[31.2430065,121.483769],[31.2429741,121.4837652],[31.2429549,121.4837461],[31.2429359,121.4835673],[31.2432188,121.4835176]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2423021,121.4830773],[31.2423377,121.4830749],[31.2423376,121.4835888],[31.2421582,121.4835821],[31.2421601,121.483477],[31.2421952,121.4834889],[31.2421968,121.4833426],[31.242175,121.4833427],[31.2421775,121.4832166],[31.2423021,121.4830773]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2376117,121.4838316],[31.2376514,121.4840049],[31.2374403,121.4840623],[31.2373097,121.4840984],[31.2372815,121.4839373],[31.2376117,121.4838316]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u673A\u8981\u901A\u4FE1\u5C40",h:6.4,ring:[[31.2377169,121.4846863],[31.2377795,121.4850025],[31.2374916,121.4850941],[31.2374277,121.4847683],[31.2377169,121.4846863]],region:"bund_edge"},{name:"",h:16,ring:[[31.2362786,121.4822564],[31.2362605,121.4823525],[31.2362704,121.4824089],[31.2360339,121.4824836],[31.2360058,121.482333],[31.2362786,121.4822564]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2369988,121.4847671],[31.2367804,121.4848383],[31.2367482,121.4847051],[31.2369681,121.4846335],[31.2369988,121.4847671]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2369677,121.4854915],[31.2370406,121.4857262],[31.2368352,121.4858134],[31.2367623,121.4855788],[31.2369677,121.4854915]],region:"bund_edge"},{name:"\u60E0\u7F57\u516C\u53F8",h:25.6,ring:[[31.2408741,121.4830616],[31.2409398,121.4832585],[31.2409764,121.483371],[31.2408694,121.4834218],[31.2406859,121.4834985],[31.2406325,121.4835188],[31.2405548,121.4832775],[31.2405723,121.4832076],[31.2408741,121.4830616]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2362369,121.4824729],[31.2362735,121.4826433],[31.2360826,121.4827162],[31.2360505,121.4825387],[31.2362369,121.4824729]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2414475,121.4834802],[31.2414216,121.4837279],[31.2411056,121.483884],[31.2410351,121.4836751],[31.2414475,121.4834802]],region:"bund_edge"},{name:"\u6148\u5B89\u91CC\u5927\u697C",h:12.8,ring:[[31.2404227,121.4825384],[31.2405446,121.4829372],[31.2406645,121.4828799],[31.2406994,121.4829884],[31.2407141,121.4830341],[31.2405838,121.4830998],[31.2405186,121.483132],[31.2404759,121.4831096],[31.240319,121.4826024],[31.2404227,121.4825384]],region:"bund_edge"},{name:"\u6148\u660C\u91CC\u5927\u697C",h:12.8,ring:[[31.240626,121.4819913],[31.2403428,121.482114],[31.2404282,121.4823563],[31.2403751,121.4823873],[31.2404159,121.4824978],[31.2403045,121.4825588],[31.2401517,121.4820858],[31.2401733,121.4820295],[31.2405895,121.4818676],[31.240626,121.4819913]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2414974,121.4818953],[31.2415699,121.4821228],[31.2414167,121.4821917],[31.2413436,121.4819624],[31.2414974,121.4818953]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2370362,121.4854114],[31.2367977,121.4854922],[31.2367639,121.4853556],[31.2370024,121.4852748],[31.2370362,121.4854114]],region:"bund_edge"},{name:"\u798F\u5DDE\u5927\u697C",h:44.8,ring:[[31.2370107,121.4832227],[31.2368858,121.4832593],[31.236837,121.483271],[31.2368319,121.4832276],[31.2367831,121.4831886],[31.2367969,121.483157],[31.2367324,121.4831178],[31.2367125,121.4830051],[31.2368156,121.4829691],[31.2368228,121.4830004],[31.2368311,121.483033],[31.2368487,121.4830627],[31.2368684,121.4830867],[31.236891,121.483103],[31.2369112,121.4831101],[31.236943,121.4831144],[31.2369646,121.4831108],[31.2369893,121.4831048],[31.2370107,121.4832227]],region:"bund_edge"},{name:"\u7533\u8FBE\u5927\u697C",h:19.2,ring:[[31.237109,121.4838207],[31.2371866,121.4842417],[31.2371828,121.4842759],[31.2371707,121.484307],[31.2371518,121.4843277],[31.2371234,121.4843454],[31.2368009,121.4844469],[31.2367739,121.484306],[31.2367867,121.4842409],[31.2368145,121.4842332],[31.2368086,121.4842012],[31.23686,121.4841863],[31.2369861,121.48415],[31.2370055,121.4842467],[31.2370652,121.4842262],[31.2369918,121.4838522],[31.237109,121.4838207]],region:"bund_edge"},{name:"\u7533\u534E\u91D1\u878D\u5927\u53A6",h:102.4,ring:[[31.2417018,121.4823821],[31.2414673,121.4824876],[31.241376,121.48221],[31.2414167,121.4821917],[31.2415699,121.4821228],[31.2416105,121.4821046],[31.2417018,121.4823821]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2370107,121.4832227],[31.2371025,121.4837028],[31.2369743,121.4837376],[31.2369499,121.4836124],[31.2368302,121.4836559],[31.2368457,121.483753],[31.2367381,121.483788],[31.2366755,121.4834371],[31.2367895,121.4834024],[31.236807,121.4835104],[31.2369263,121.4834808],[31.2368858,121.4832593],[31.2370107,121.4832227]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2380939,121.4842885],[31.2381167,121.4843942],[31.2384519,121.4842953],[31.2386631,121.4852746],[31.2387674,121.4852438],[31.2385523,121.4842471],[31.2385189,121.4841939],[31.2384787,121.4841751],[31.2380939,121.4842885]],region:"bund_edge"},{name:"",h:57.6,ring:[[31.2390009,121.482596],[31.2390441,121.4827829],[31.2389057,121.4828145],[31.2388882,121.4827352],[31.2388395,121.4827016],[31.2387147,121.482737],[31.2386794,121.4825674],[31.2389118,121.4825129],[31.2390009,121.482596]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2423038,121.4830544],[31.2423417,121.4830536],[31.2423424,121.4830098],[31.2422316,121.4827522],[31.2421502,121.4827926],[31.2421252,121.4827129],[31.2420825,121.4827315],[31.2421075,121.4828144],[31.2420859,121.4828221],[31.2421306,121.4829523],[31.2421804,121.4830853],[31.2422065,121.4831272],[31.2423038,121.4830544]],region:"bund_edge"},{name:"",h:6.4,ring:[[31.2373698,121.4852251],[31.2374445,121.4855525],[31.2374214,121.4855594],[31.2374412,121.4856497],[31.2373694,121.4856754],[31.2373155,121.4856942],[31.2372524,121.4857172],[31.2372136,121.4857002],[31.2371783,121.4857122],[31.2370939,121.4853525],[31.2371156,121.4853455],[31.2371083,121.4853093],[31.2372719,121.4852571],[31.2373698,121.4852251]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2371659,121.4833625],[31.2371317,121.4831614],[31.2372708,121.4831208],[31.2372856,121.4832074],[31.2374153,121.4831782],[31.2374344,121.4832907],[31.2371659,121.4833625]],region:"bund_edge"},{name:"\u798F\u6C11\u5546\u53A6",h:28.8,ring:[[31.2306459,121.4875776],[31.2306485,121.487909],[31.2304944,121.4879106],[31.2304948,121.4879589],[31.2301416,121.4879627],[31.2301419,121.4880094],[31.2300486,121.4880104],[31.2300483,121.4879681],[31.2299683,121.4879689],[31.2299675,121.4878722],[31.2299118,121.4878728],[31.2299096,121.4875854],[31.2306459,121.4875776]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2332727,121.4863783],[31.2334375,121.4869927],[31.2332819,121.4870555],[31.2332142,121.4868043],[31.2332409,121.4867925],[31.2331392,121.4864304],[31.2331791,121.4864132],[31.2332727,121.4863783]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2332364,121.4869422],[31.2332698,121.4870633],[31.2330632,121.4871412],[31.2330298,121.4870201],[31.2332364,121.4869422]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2326304,121.4843313],[31.2326995,121.4845632],[31.2326184,121.4845981],[31.2326022,121.4846044],[31.2325327,121.4843712],[31.2326304,121.4843313]],region:"bund_edge"},{name:"\u7D2B\u9526\u57CE\u767E\u8D27",h:28.8,ring:[[31.2306877,121.4863944],[31.2306817,121.4868482],[31.230272,121.4868407],[31.230278,121.4863869],[31.2306877,121.4863944]],region:"bund_edge"},{name:"\u5916\u6EE9NEO",h:28.8,ring:[[31.2312559,121.486913],[31.2312432,121.4874492],[31.230786,121.4874344],[31.2307987,121.4868982],[31.2312559,121.486913]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2325947,121.4861543],[31.2326206,121.4862771],[31.2321713,121.4864069],[31.2321453,121.486284],[31.2325947,121.4861543]],region:"bund_edge"},{name:"",h:38.4,ring:[[31.2327585,121.4885218],[31.2329123,121.489],[31.2327774,121.4890643],[31.232623,121.488582],[31.2327585,121.4885218]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2330606,121.4864956],[31.2331411,121.4864642],[31.2331666,121.4865536],[31.2331341,121.4865662],[31.2331938,121.4867758],[31.2331458,121.4867945],[31.2330606,121.4864956]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2327309,121.4845498],[31.2328088,121.4847979],[31.2327965,121.4848032],[31.2327012,121.4848441],[31.2326963,121.4848462],[31.2326184,121.4845981],[31.2326995,121.4845632],[31.2327309,121.4845498]],region:"bund_edge"},{name:"\u798F\u4F51\u5546\u53A6",h:28.8,ring:[[31.2306603,121.4870455],[31.2306595,121.4874437],[31.2299133,121.4874417],[31.2299141,121.4870435],[31.2306603,121.4870455]],region:"bund_edge"},{name:"\u6CAA\u5357\u94B1\u4E1A\u516C\u6240",h:3.2,ring:[[31.2306535,121.4882651],[31.2306627,121.4884657],[31.2305,121.4884759],[31.2303827,121.4884833],[31.2303776,121.4883724],[31.2303735,121.4882827],[31.2306535,121.4882651]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2330009,121.4858343],[31.2330298,121.4859363],[31.2330469,121.4859964],[31.2330909,121.4861517],[31.2329454,121.4861866],[31.232864,121.4858964],[31.2329515,121.4858604],[31.2330009,121.4858343]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2327309,121.4871899],[31.232749,121.4872534],[31.232627,121.4873011],[31.2326089,121.4872376],[31.2327309,121.4871899]],region:"bund_edge"},{name:"\u57CE\u968D\u5E99\u7B2C\u4E00\u8D2D\u7269\u4E2D\u5FC3",h:19.2,ring:[[31.2305589,121.4854244],[31.230564,121.4858965],[31.2300577,121.485904],[31.2300012,121.4858472],[31.2299712,121.4857747],[31.2299674,121.4854332],[31.2305589,121.4854244]],region:"bund_edge"},{name:"\u8C6B\u56ED\u9102\u5C14\u591A\u65AF\u5E7F\u573A",h:19.2,ring:[[31.230558,121.4844651],[31.2305522,121.4850455],[31.2300035,121.485038],[31.2300068,121.4847017],[31.2304078,121.4847071],[31.2304104,121.4844512],[31.230558,121.4844651]],region:"bund_edge"},{name:"\u51EF\u77F3\u5927\u53A6",h:32,ring:[[31.2348197,121.4871195],[31.2348918,121.4873494],[31.2347661,121.4875091],[31.2346537,121.4873654],[31.2346362,121.4871919],[31.2348197,121.4871195]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2347463,121.4868191],[31.2348197,121.4871195],[31.2346362,121.4871919],[31.2345583,121.48687],[31.2347463,121.4868191]],region:"bund_edge"},{name:"",h:32,ring:[[31.2341903,121.4858521],[31.2342681,121.4860558],[31.2341728,121.4861056],[31.234095,121.485902],[31.2341903,121.4858521]],region:"bund_edge"},{name:"",h:32,ring:[[31.2345881,121.4864623],[31.234478,121.4864865],[31.2345583,121.48687],[31.2347463,121.4868191],[31.2345881,121.4864623]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2344013,121.4866338],[31.2344438,121.4868988],[31.2343967,121.4869092],[31.2344081,121.4869801],[31.2343251,121.4869983],[31.2342712,121.4866623],[31.2344013,121.4866338]],region:"bund_edge"},{name:"",h:32,ring:[[31.2342464,121.4863098],[31.2343068,121.4866112],[31.2342171,121.4866358],[31.2341567,121.4863344],[31.2342464,121.4863098]],region:"bund_edge"},{name:"",h:32,ring:[[31.2343128,121.4860654],[31.2343508,121.4861565],[31.2343726,121.4861699],[31.2343977,121.4862398],[31.2341455,121.4862733],[31.2341167,121.4861459],[31.2343128,121.4860654]],region:"bund_edge"},{name:"\u5916\u6EE9\u53F2\u9648\u5217\u5BA4",h:6.4,ring:[[31.235213,121.4876897],[31.2352521,121.4877521],[31.2351063,121.487877],[31.2350672,121.4878146],[31.235213,121.4876897]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2340248,121.4862664],[31.2337765,121.4863636],[31.2337294,121.486199],[31.2339776,121.4861017],[31.2340248,121.4862664]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2339463,121.4861007],[31.2338131,121.4861467],[31.233783,121.4860274],[31.2339162,121.4859814],[31.2339463,121.4861007]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2334511,121.4878921],[31.2333411,121.4879339],[31.233139,121.487205],[31.233249,121.4871633],[31.2334511,121.4878921]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2341249,121.4866327],[31.2338916,121.4867147],[31.2338745,121.4866484],[31.2338948,121.4866413],[31.2338709,121.4865482],[31.2340839,121.4864733],[31.2341249,121.4866327]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2338404,121.4869171],[31.2337513,121.4869478],[31.2337187,121.4868185],[31.233741,121.4868108],[31.2337095,121.4866853],[31.2337764,121.4866623],[31.2338404,121.4869171]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.233557,121.4880162],[31.233585,121.4881263],[31.233482,121.4881621],[31.233454,121.4880519],[31.233557,121.4880162]],region:"bund_edge"},{name:"\u8054\u8C0A\u5927\u53A6",h:9.6,ring:[[31.2352955,121.4852224],[31.235377,121.4855411],[31.2352469,121.485593],[31.23496,121.4857077],[31.2349246,121.4857218],[31.2348951,121.4856826],[31.2348657,121.4856434],[31.2348199,121.4854931],[31.234864,121.4853868],[31.2351602,121.4852739],[31.2352955,121.4852224]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2334474,121.4870984],[31.2334818,121.4871459],[31.233665,121.4878161],[31.2335902,121.4878433],[31.233549,121.4878584],[31.2333496,121.4871344],[31.2334474,121.4870984]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2335767,121.4878701],[31.2336105,121.4879942],[31.2335854,121.4880034],[31.233557,121.4880162],[31.233454,121.4880519],[31.2334459,121.4880563],[31.2334119,121.4879316],[31.2335767,121.4878701]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2358319,121.4851878],[31.2358826,121.4853657],[31.2357272,121.4854294],[31.2356432,121.4851095],[31.2357162,121.4850805],[31.2357585,121.485095],[31.2357936,121.4851209],[31.235814,121.4851501],[31.2358319,121.4851878]],region:"bund_edge"},{name:"Bund 15",h:35.2,ring:[[31.2329195,121.4888958],[31.2331973,121.4887553],[31.2331787,121.4886894],[31.2335286,121.4883567],[31.2336331,121.488708],[31.2330421,121.4893038],[31.2330198,121.4892263],[31.2329713,121.4890683],[31.2329195,121.4888958]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2340365,121.4864605],[31.2338053,121.4865403],[31.2337693,121.4863975],[31.2340004,121.4863177],[31.2340365,121.4864605]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.233783,121.4861507],[31.2336951,121.4861811],[31.2336661,121.4860663],[31.2337541,121.4860359],[31.233783,121.4861507]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.233665,121.4878161],[31.2337035,121.4879608],[31.2336288,121.487988],[31.2335902,121.4878433],[31.233665,121.4878161]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2341385,121.4868495],[31.2339045,121.4869302],[31.2338622,121.4867623],[31.2340961,121.4866815],[31.2341385,121.4868495]],region:"bund_edge"},{name:"",h:48,ring:[[31.2338829,121.4869877],[31.2339053,121.4870709],[31.2338271,121.4870998],[31.2338941,121.4873482],[31.2339515,121.4873271],[31.2339687,121.4873907],[31.2338186,121.487446],[31.2337974,121.4874198],[31.233786,121.4873777],[31.2337639,121.4873859],[31.2336769,121.4870638],[31.2338829,121.4869877]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2341309,121.4869281],[31.2342284,121.4873043],[31.2340209,121.4873779],[31.2339233,121.4870017],[31.2341309,121.4869281]],region:"bund_edge"},{name:"\u4E1C\u65B9\u996D\u5E97",h:89.6,ring:[[31.2337354,121.4881188],[31.2334593,121.4882328],[31.2334877,121.4883373],[31.2335676,121.4883075],[31.233583,121.4883666],[31.2336376,121.4883718],[31.2336549,121.4884416],[31.2336268,121.4884736],[31.2336472,121.4885498],[31.2337173,121.4886465],[31.2338117,121.4885535],[31.2338245,121.4884707],[31.2337354,121.4881188]],region:"bund_edge"},{name:"\u82E5\u745F\u5802",h:6.4,ring:[[31.2326974,121.4856928],[31.2327416,121.4856746],[31.2327661,121.485756],[31.2325769,121.4858339],[31.2325524,121.4857525],[31.2326094,121.485729],[31.2325566,121.4855511],[31.2324715,121.4855856],[31.2324449,121.4854958],[31.2325299,121.4854613],[31.2325052,121.485378],[31.2325937,121.4853421],[31.2326185,121.4854255],[31.2326973,121.4853936],[31.2327237,121.4854829],[31.2326447,121.4855149],[31.2326974,121.4856928]],region:"bund_edge"},{name:"",h:16,ring:[[31.2343853,121.4838182],[31.2344421,121.484087],[31.2343214,121.4841234],[31.2342631,121.483853],[31.2343853,121.4838182]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2344501,121.4843924],[31.2341093,121.4845063],[31.2340381,121.4842331],[31.2341643,121.484192],[31.2344332,121.4841133],[31.234447,121.4841752],[31.2344059,121.4841896],[31.2344501,121.4843924]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2346914,121.4837105],[31.2347512,121.4840041],[31.2346309,121.4840425],[31.2345711,121.4837497],[31.2346914,121.4837105]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2354694,121.4839095],[31.2355491,121.4841486],[31.2354613,121.4841823],[31.2354092,121.484203],[31.2353296,121.4839601],[31.2353985,121.4839342],[31.2354694,121.4839095]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2335204,121.4854639],[31.2338014,121.4853245],[31.2338738,121.4855239],[31.2335929,121.4856634],[31.2335204,121.4854639]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2354161,121.4847234],[31.2354692,121.4848944],[31.235228,121.484997],[31.2351748,121.484826],[31.2354161,121.4847234]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2345385,121.4837604],[31.2345939,121.4840413],[31.2344771,121.4840802],[31.2344218,121.4837981],[31.2345385,121.4837604]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2348391,121.4836693],[31.2348986,121.483955],[31.2347813,121.4839932],[31.2347232,121.4837097],[31.2348391,121.4836693]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2334184,121.4852426],[31.2337349,121.4850924],[31.2337961,121.4852689],[31.2334796,121.4854191],[31.2334184,121.4852426]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2428992,121.4823078],[31.2427776,121.482348],[31.2427444,121.4824164],[31.2427432,121.4827396],[31.2427719,121.4827866],[31.2427983,121.4828107],[31.2429129,121.482808],[31.2429136,121.4826801],[31.2428552,121.4826817],[31.2428567,121.4824513],[31.2429302,121.4824226],[31.2428992,121.4823078]],region:"bund_edge"},{name:"",h:16,ring:[[31.2431485,121.4823123],[31.2433211,121.4823132],[31.2433194,121.4827959],[31.2431468,121.4827951],[31.2431485,121.4823123]],region:"bund_edge"},{name:"\u4E9A\u6D32\u6587\u4F1A\u5927\u697C",h:19.2,ring:[[31.2432308,121.4829615],[31.2432614,121.4833064],[31.2431489,121.4833201],[31.2431182,121.4829752],[31.2432308,121.4829615]],region:"bund_edge"},{name:"\u5706\u660E\u56ED\u516C\u5BD3",h:19.2,ring:[[31.2435419,121.4836351],[31.243501,121.4836929],[31.2432411,121.4837319],[31.2432188,121.4835176],[31.2432162,121.4834923],[31.2435198,121.4834471],[31.2435419,121.4836351]],region:"bund_edge"},{name:"",h:16,ring:[[31.2427291,121.4833359],[31.2428949,121.4833356],[31.2428942,121.4837374],[31.2427238,121.4837256],[31.2427291,121.4833359]],region:"bund_edge"},{name:"\u4E2D\u5B9E\u5927\u697C",h:22.4,ring:[[31.2427308,121.4830428],[31.2427291,121.4833359],[31.2428949,121.4833356],[31.2430681,121.4833326],[31.2430264,121.4829712],[31.2427765,121.482991],[31.2427544,121.4830024],[31.2427409,121.4830203],[31.2427308,121.4830428]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2426198,121.4823521],[31.2421776,121.4825069],[31.2422343,121.4826255],[31.2423395,121.482583],[31.2424662,121.4825345],[31.2424627,121.4829462],[31.2426233,121.4829489],[31.2426347,121.4823736],[31.2426198,121.4823521]],region:"bund_edge"},{name:"\u6C99\u7F8E\u5927\u697C",h:16,ring:[[31.2428323,121.4816975],[31.2426931,121.4817469],[31.2427199,121.4821146],[31.2427328,121.482131],[31.2427502,121.4821404],[31.2429248,121.4820809],[31.2428323,121.4816975]],region:"bund_edge"},{name:"",h:38.4,ring:[[31.2439556,121.4833603],[31.2438355,121.4833748],[31.2438224,121.4832515],[31.2437976,121.4830185],[31.2439171,121.4830203],[31.2439556,121.4833603]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2386772,121.4830422],[31.238707,121.4830639],[31.2387286,121.4831058],[31.2387587,121.4832443],[31.2384608,121.483333],[31.2384145,121.4831206],[31.2386772,121.4830422]],region:"bund_edge"},{name:"\u7231\u5EFA\u91D1\u878D\u5927\u697C",h:25.6,ring:[[31.2387749,121.4832958],[31.2388496,121.4836161],[31.2386085,121.483693],[31.2385895,121.4836121],[31.2386033,121.4835947],[31.2385727,121.4834591],[31.2385523,121.4834528],[31.2385336,121.4833727],[31.2387749,121.4832958]],region:"bund_edge"},{name:"\u4E0A\u6295\u5927\u53A6",h:41.6,ring:[[31.2391574,121.483189],[31.2392411,121.4834941],[31.2389343,121.4835819],[31.2388639,121.4833115],[31.2389718,121.4832743],[31.2389647,121.4832359],[31.2391574,121.483189]],region:"bund_edge"},{name:"\u5EFA\u8BBE\u5927\u53A6",h:57.6,ring:[[31.2367788,121.4827058],[31.2367737,121.4827259],[31.2367726,121.4827541],[31.2367738,121.4827836],[31.2367796,121.4828155],[31.2367106,121.4828375],[31.2366747,121.4826771],[31.2367173,121.4825685],[31.236852,121.482527],[31.2368623,121.4825238],[31.2368831,121.4826197],[31.2368598,121.4826272],[31.2368392,121.4826346],[31.2368199,121.4826477],[31.2368028,121.4826606],[31.236793,121.4826761],[31.2367873,121.4826891],[31.2367788,121.4827058]],region:"bund_edge"},{name:"",h:112,ring:[[31.2318197,121.4829887],[31.2314623,121.4830882],[31.2314303,121.4830563],[31.2314024,121.4830202],[31.2313845,121.4829656],[31.2313803,121.4829094],[31.2313938,121.4828553],[31.2314259,121.4828177],[31.2314633,121.4828029],[31.2316942,121.4827266],[31.2317419,121.4827216],[31.2317798,121.4827309],[31.2318089,121.4827517],[31.23183,121.4827825],[31.2318468,121.4828133],[31.231855,121.4828527],[31.2318556,121.4828896],[31.2318502,121.4829264],[31.2318386,121.4829597],[31.2318197,121.4829887]],region:"bund_edge"},{name:"\u4E2D\u56FD\u90AE\u653F\u50A8\u84C4\u94F6\u884C\u4E0A\u6D77\u5206\u884C",h:19.2,ring:[[31.2399919,121.4845019],[31.2400704,121.4847939],[31.2397892,121.484896],[31.2397106,121.484609],[31.2399919,121.4845019]],region:"bund_edge"},{name:"\u4E1C\u4E9A\u5927\u697C",h:22.4,ring:[[31.2392411,121.4834941],[31.2392749,121.483617],[31.2392695,121.483653],[31.2392469,121.4836991],[31.2389274,121.4838088],[31.2389009,121.4836849],[31.2390141,121.4836531],[31.2390028,121.4835962],[31.2391119,121.483567],[31.2391216,121.4836115],[31.2391714,121.4835929],[31.2391568,121.4835201],[31.2392411,121.4834941]],region:"bund_edge"},{name:"\u7535\u89C6\u793E\u6742\u5FD7\u793E",h:16,ring:[[31.2414956,121.482797],[31.2415105,121.4827576],[31.2418119,121.4826328],[31.2418399,121.4827255],[31.2417576,121.4828124],[31.2417055,121.4827703],[31.2415533,121.4828333],[31.2415857,121.4829405],[31.2416488,121.4829144],[31.2416874,121.4830418],[31.2415828,121.4830851],[31.2414956,121.482797]],region:"bund_edge"},{name:"\u4EC1\u8BB0\u6D0B\u884C\u5927\u697C",h:12.8,ring:[[31.241594,121.4831134],[31.2415568,121.4834446],[31.2415461,121.4834545],[31.2415432,121.4834743],[31.2415505,121.4834874],[31.2415635,121.4834903],[31.2415749,121.4834796],[31.2417613,121.4835095],[31.2417887,121.4832731],[31.2417244,121.4832604],[31.2417397,121.4831364],[31.241594,121.4831134]],region:"bund_edge"},{name:"\u4E2D\u56FD\u6C11\u751F\u94F6\u884C\u5916\u6EE9\u652F\u884C",h:9.6,ring:[[31.2356384,121.4844642],[31.2357376,121.4848289],[31.2357085,121.484897],[31.2355241,121.4849613],[31.2354036,121.4844869],[31.2354653,121.484467],[31.2354809,121.4845237],[31.2354924,121.4845206],[31.2356384,121.4844642]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2334994,121.4867604],[31.2335714,121.48704],[31.2337061,121.4869926],[31.2336341,121.4867129],[31.2334994,121.4867604]],region:"bund_edge"},{name:"\u91D1\u9675\u5927\u697C",h:19.2,ring:[[31.2333969,121.4861723],[31.2335594,121.4861091],[31.2335985,121.4862466],[31.2335445,121.4862706],[31.2335797,121.4863936],[31.2336341,121.4863718],[31.233654,121.4864419],[31.2334894,121.4864998],[31.2335026,121.486555],[31.233451,121.4865687],[31.233368,121.4862481],[31.2333969,121.4861723]],region:"bund_edge"},{name:"\u4E30\u534E\u5927\u697C",h:16,ring:[[31.2326215,121.4897238],[31.2328325,121.4895125],[31.2327575,121.4892832],[31.2324988,121.4894341],[31.2326215,121.4897238]],region:"bund_edge"},{name:"\u8336\u5BA4",h:3,ring:[[31.2300446,121.4889711],[31.2300712,121.4890627],[31.2301213,121.4890428],[31.2300947,121.4889512],[31.2300446,121.4889711]],region:"bund_edge"},{name:"",h:3,ring:[[31.2308996,121.4882014],[31.2308182,121.4882057],[31.230822,121.4883033],[31.2309619,121.4882958],[31.231035,121.4882919],[31.2310312,121.4881944],[31.2308996,121.4882014]],region:"bund_edge"},{name:"",h:3,ring:[[31.2310072,121.4901297],[31.2309578,121.4900804],[31.2308498,121.4902191],[31.2308696,121.4902468],[31.2308518,121.4902745],[31.2308801,121.4903038],[31.2309097,121.4902614],[31.2310072,121.4901297]],region:"bund_edge"},{name:"\u6D66\u4E1C\u7F8E\u672F\u9986",h:30,ring:[[31.24049,121.491529],[31.2399993,121.4915317],[31.2400004,121.4916162],[31.2399763,121.4916149],[31.2399752,121.4916967],[31.2399396,121.4917074],[31.2398869,121.49158],[31.2397688,121.4916511],[31.2398422,121.4918134],[31.2398078,121.4918388],[31.2399488,121.4921258],[31.239927,121.4921406],[31.2401288,121.4925389],[31.2406483,121.4921822],[31.2406035,121.4920816],[31.2407102,121.4920092],[31.24049,121.491529]],region:"bund_edge"},{name:"\u534E\u4FA8\u5927\u697C",h:25.6,ring:[[31.2397162,121.4831665],[31.2393811,121.483297],[31.2393262,121.4830771],[31.2396643,121.482959],[31.2397162,121.4831665]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2410084,121.4830009],[31.2411011,121.4832748],[31.2410243,121.4833239],[31.2409924,121.4832313],[31.2409398,121.4832585],[31.2408741,121.4830616],[31.2410084,121.4830009]],region:"bund_edge"},{name:"",h:25.6,ring:[[31.2414755,121.483111],[31.241105,121.4832864],[31.2411011,121.4832748],[31.2410084,121.4830009],[31.2413548,121.4828435],[31.24139,121.4828579],[31.2414755,121.483111]],region:"bund_edge"},{name:"\u5609\u9675\u5927\u697C",h:51.2,ring:[[31.240274,121.4836659],[31.2400493,121.4837474],[31.2400057,121.4835761],[31.2400432,121.4835592],[31.2403941,121.4833932],[31.2404333,121.4835727],[31.2402664,121.4836351],[31.240274,121.4836659]],region:"bund_edge"},{name:"\u65B0\u9EC4\u6D66\u91D1\u878D\u5927\u53A6",h:51.2,ring:[[31.2404647,121.483701],[31.2405884,121.4843419],[31.2403637,121.484405],[31.2403817,121.4844887],[31.2402409,121.4845302],[31.2400796,121.4838305],[31.2404647,121.483701]],region:"bund_edge"},{name:"\u62DB\u5546\u94F6\u884C",h:19.2,ring:[[31.239912,121.4848802],[31.2397547,121.4849411],[31.2398775,121.485424],[31.2400365,121.4853901],[31.239912,121.4848802]],region:"bund_edge"},{name:"\u53CB\u90A6\u5927\u53A6",h:32,ring:[[31.2400915,121.484817],[31.2399512,121.4848763],[31.2400789,121.4853869],[31.2402324,121.4853516],[31.2400915,121.484817]],region:"bund_edge"},{name:"\u5916\u6EE918\u53F7",h:22.4,ring:[[31.2403917,121.4846985],[31.2401448,121.4847948],[31.2402783,121.485328],[31.2405467,121.485303],[31.2405353,121.4851957],[31.2405146,121.4851984],[31.2403917,121.4846985]],region:"bund_edge"},{name:"",h:32,ring:[[31.2399401,121.4836034],[31.2400278,121.4839665],[31.239826,121.484043],[31.2397456,121.4837237],[31.2397947,121.4836752],[31.2398542,121.4836343],[31.2399401,121.4836034]],region:"bund_edge"},{name:"\u4E2D\u592E\u5927\u53A6",h:57.6,ring:[[31.2398243,121.4831874],[31.2398653,121.4833412],[31.2395357,121.4835229],[31.2394499,121.4834704],[31.2394167,121.4833367],[31.2398243,121.4831874]],region:"bund_edge"},{name:"\u4E2D\u592E\u5546\u573A",h:25.6,ring:[[31.2399078,121.4828971],[31.2402131,121.482775],[31.2402867,121.4830423],[31.2402987,121.483098],[31.2402879,121.4831518],[31.2402637,121.4832008],[31.2400187,121.4832998],[31.2399078,121.4828971]],region:"bund_edge"},{name:"",h:12.8,ring:[[31.2412271,121.4824257],[31.2412973,121.4826557],[31.2413014,121.4826818],[31.2412991,121.482703],[31.2412872,121.4827241],[31.2412674,121.4827359],[31.2411114,121.4828006],[31.2410767,121.4826972],[31.2410719,121.48268],[31.2411192,121.4826567],[31.2410934,121.4825762],[31.2411176,121.4825634],[31.2410946,121.4824821],[31.2411176,121.4824723],[31.2412271,121.4824257]],region:"bund_edge"},{name:"\u4E0A\u6D77\u5E02\u9AD8\u6280\u80FD\u4EBA\u624D\u57F9\u517B\u57FA\u5730",h:19.2,ring:[[31.2411442,121.4821541],[31.2412271,121.4824257],[31.2411176,121.4824723],[31.2410345,121.4822045],[31.2410638,121.48219],[31.2411442,121.4821541]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2408408,121.4823056],[31.2409664,121.4826819],[31.2408773,121.4827296],[31.2407477,121.482349],[31.2408408,121.4823056]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2406575,121.4824117],[31.240776,121.4827765],[31.2406769,121.4828285],[31.2406261,121.4828296],[31.2405941,121.4827902],[31.2405074,121.4825162],[31.2405215,121.4824791],[31.2405618,121.482455],[31.2406575,121.4824117]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2406398,121.4820191],[31.2407289,121.4823197],[31.2406216,121.4823661],[31.2405194,121.4820905],[31.2406398,121.4820191]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2407156,121.4819706],[31.2406811,121.4818474],[31.2409291,121.4817441],[31.2409442,121.4817919],[31.2410554,121.4821628],[31.2407471,121.4822918],[31.240692,121.4821148],[31.2406884,121.4819967],[31.2407156,121.4819706]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.2404642,121.4820977],[31.2405711,121.4824037],[31.2404964,121.4824469],[31.2403871,121.4821338],[31.2404642,121.4820977]],region:"bund_edge"},{name:"",h:22.4,ring:[[31.238397,121.4845737],[31.2384618,121.4848774],[31.2384604,121.4848769],[31.2383577,121.4849073],[31.238293,121.484604],[31.238397,121.4845737]],region:"bund_edge"},{name:"",h:19.2,ring:[[31.2374902,121.4819284],[31.2375608,121.4822609],[31.2372742,121.4823442],[31.2372035,121.4820117],[31.2374902,121.4819284]],region:"bund_edge"}];var g2={buildings:[{name:"\u4E0A\u6D77\u90AE\u653F\u603B\u5C40\u5927\u697C",h:16,ring:[[31.2464453,121.4810923],[31.246883,121.481042],[31.2469346,121.4809268],[31.2465875,121.4801521],[31.2464322,121.4799147],[31.2460146,121.4802831],[31.2463532,121.4810352],[31.2464453,121.4810923]],region:"northbund"},{name:"\u5973\u9752\u5E74\u4F1A\u5927\u697C",h:25.6,ring:[[31.2438506,121.4836037],[31.2435849,121.4836459],[31.2435713,121.4835062],[31.2437166,121.4834836],[31.2437085,121.4834007],[31.2435623,121.4834158],[31.2435511,121.4832911],[31.2436436,121.4832771],[31.2438148,121.4832512],[31.2438348,121.483444],[31.2438506,121.4836037]],region:"northbund"},{name:"\u54C8\u5BC6\u5927\u697C",h:22.4,ring:[[31.2440599,121.4835669],[31.2438506,121.4836037],[31.2438348,121.483444],[31.2440442,121.4834174],[31.2440599,121.4835669]],region:"northbund"},{name:"\u534F\u8FDB\u5927\u697C",h:19.2,ring:[[31.244533,121.4835023],[31.2440864,121.483564],[31.2440696,121.4833975],[31.2445152,121.4833188],[31.24452,121.4833684],[31.244533,121.4835023]],region:"northbund"},{name:"\u539F\u65B0\u5929\u5B89\u5802",h:19.2,ring:[[31.2452547,121.4838286],[31.2452176,121.4839327],[31.2451391,121.4839],[31.2451244,121.4839442],[31.2450462,121.4839127],[31.2450593,121.4838677],[31.2450154,121.4838497],[31.2450498,121.4837408],[31.2450884,121.4837573],[31.2451022,121.4837132],[31.2451839,121.4837491],[31.2451703,121.4837924],[31.2452547,121.4838286]],region:"northbund"},{name:"\u4FC4\u7F57\u65AF\u9886\u4E8B\u9986",h:16,ring:[[31.2458781,121.4862094],[31.2457169,121.4861875],[31.2456921,121.48624],[31.2456944,121.486326],[31.245668,121.4864859],[31.245645,121.4864859],[31.2456314,121.4866266],[31.2458455,121.4866433],[31.2458781,121.4862094]],region:"northbund"},{name:"\u65B0\u4E9A\u5927\u9152\u5E97",h:25.6,ring:[[31.2473652,121.480706],[31.2474502,121.4808948],[31.2474502,121.4809677],[31.2474218,121.4810041],[31.2471726,121.4810373],[31.2471358,121.4810174],[31.2471018,121.4809644],[31.2467362,121.4800914],[31.2466877,121.4800141],[31.2466735,121.4799638],[31.2466793,121.479906],[31.2467022,121.4798759],[31.2467366,121.4798562],[31.2467869,121.4798341],[31.2471978,121.4808213],[31.2473652,121.480706]],region:"northbund"},{name:"\u745E\u5EB7\u516C\u5BD3",h:16,ring:[[31.2471126,121.4814714],[31.2470056,121.4815127],[31.2469781,121.4814081],[31.2469666,121.4813759],[31.246952,121.4813614],[31.2469245,121.481356],[31.2466356,121.481399],[31.2466104,121.4814097],[31.2465928,121.4814242],[31.246576,121.4814472],[31.2465714,121.4814741],[31.2466066,121.4816468],[31.246524,121.4816763],[31.2464751,121.4814714],[31.2464782,121.4814242],[31.2464888,121.4813695],[31.2465057,121.4813303],[31.2465278,121.4813024],[31.2465668,121.4812809],[31.246602,121.4812659],[31.2469529,121.4812257],[31.2469887,121.481238],[31.2470377,121.4812766],[31.2470621,121.4813078],[31.2470805,121.4813373],[31.2471126,121.4814714]],region:"northbund"},{name:"\u56FD\u9645\u6E2F\u52A1\u5927\u53A6",h:70.4,ring:[[31.2484608,121.4911041],[31.2485109,121.4911072],[31.2485384,121.4911179],[31.248559,121.4911367],[31.248569,121.4911588],[31.2485685,121.491178],[31.2485682,121.4911876],[31.2485636,121.4912601],[31.2485499,121.4913405],[31.2485109,121.491472],[31.2484621,121.4915542],[31.2484536,121.4915685],[31.2484306,121.4915819],[31.2484131,121.491588],[31.2483925,121.4915772],[31.2483649,121.4915585],[31.2483076,121.4915048],[31.2482296,121.4914136],[31.248154,121.4912849],[31.2481402,121.4912527],[31.2481394,121.4912225],[31.2481494,121.491199],[31.2481692,121.4911769],[31.2482059,121.4911528],[31.2483229,121.4911206],[31.2484608,121.4911041]],region:"northbund"},{name:"",h:32,ring:[[31.2428519,121.4843432],[31.2428512,121.4843927],[31.2430617,121.4843969],[31.2430625,121.4843447],[31.2430942,121.4843454],[31.2430954,121.4842646],[31.2430978,121.4841064],[31.2430983,121.4840698],[31.2430989,121.4840295],[31.2430672,121.4840288],[31.2430678,121.4839862],[31.2428573,121.4839819],[31.2428566,121.4840274],[31.2428329,121.4840269],[31.2428319,121.4840953],[31.2428294,121.4842616],[31.2428282,121.4843427],[31.2428519,121.4843432]],region:"northbund"},{name:"",h:41.6,ring:[[31.2436646,121.4847848],[31.2434161,121.4847893],[31.2434152,121.4850713],[31.2434323,121.4850691],[31.2434314,121.4852154],[31.2436515,121.4852177],[31.2436524,121.4850649],[31.2436665,121.4850653],[31.2436646,121.4847848]],region:"northbund"},{name:"",h:32,ring:[[31.2437207,121.4852184],[31.2436515,121.4852177],[31.2434314,121.4852154],[31.2432047,121.485213],[31.2432024,121.485256],[31.2431898,121.485256],[31.2431824,121.4855143],[31.243199,121.4855135],[31.2431982,121.4855517],[31.2433699,121.4855538],[31.2433701,121.4855137],[31.2433828,121.4855133],[31.2433859,121.4854303],[31.2435349,121.4854303],[31.2435349,121.4854974],[31.2437185,121.4854933],[31.2437188,121.4854491],[31.2437323,121.4854488],[31.2437331,121.4852626],[31.2437203,121.4852627],[31.2437207,121.4852184]],region:"northbund"},{name:"\u683C\u6797\u90AE\u8239\u5927\u697C",h:28.8,ring:[[31.2430054,121.4849163],[31.2427419,121.4849198],[31.2427415,121.4852843],[31.2427163,121.4852839],[31.2427162,121.4855821],[31.2427415,121.4855848],[31.2427419,121.4856306],[31.2429043,121.4856304],[31.2429089,121.4851985],[31.2429433,121.4851985],[31.2429437,121.4852337],[31.2430029,121.4852334],[31.2430054,121.4849163]],region:"northbund"},{name:"\u4E1C\u65B9\u6C47\u7406\u94F6\u884C\u5927\u697C",h:19.2,ring:[[31.2431434,121.4849297],[31.243042,121.4849278],[31.2430384,121.4851982],[31.2430625,121.4851986],[31.2430614,121.4852826],[31.2429396,121.4852804],[31.2429349,121.4856298],[31.2431339,121.4856334],[31.2431434,121.4849297]],region:"northbund"},{name:"\u4E0A\u6D77\u5916\u6EE9\u8302\u60A6\u5927\u9152\u5E97",h:12.8,ring:[[31.247799,121.4887708],[31.2476066,121.4890909],[31.2472603,121.4892684],[31.247209,121.4891834],[31.2472218,121.4890459],[31.2473458,121.4888608],[31.2471577,121.4885333],[31.2468691,121.4885433],[31.2467644,121.4884183],[31.2467729,121.4883083],[31.2472817,121.4879508],[31.2475125,121.4880683],[31.247799,121.4887708]],region:"northbund"},{name:"\u5149\u9646\u5927\u697C",h:16,ring:[[31.2454744,121.4832127],[31.2450626,121.4832741],[31.2450431,121.4832768],[31.2450329,121.4831152],[31.2450685,121.4831077],[31.2450585,121.4829929],[31.2451392,121.4829899],[31.2452272,121.4829971],[31.2452955,121.4830184],[31.2453636,121.4830505],[31.2454096,121.483081],[31.2454398,121.4831142],[31.2454653,121.4831596],[31.2454744,121.4832127]],region:"northbund"},{name:"",h:25.6,ring:[[31.2466916,121.4870691],[31.246741,121.4870812],[31.2467766,121.4871148],[31.2467697,121.4871739],[31.2467307,121.4872142],[31.2464182,121.4875099],[31.2463757,121.4875206],[31.2463159,121.4875045],[31.246255,121.4874467],[31.2462022,121.4873459],[31.2461769,121.4872237],[31.2461884,121.4871121],[31.2462114,121.4870503],[31.2462367,121.4870248],[31.2462527,121.4870181],[31.2466916,121.4870691]],region:"northbund"},{name:"",h:32,ring:[[31.2450352,121.4821201],[31.2450539,121.4822753],[31.2447659,121.4823229],[31.2447472,121.4821676],[31.2450352,121.4821201]],region:"northbund"},{name:"",h:22.4,ring:[[31.2453704,121.4820593],[31.2453967,121.4822531],[31.2451322,121.4823021],[31.2451059,121.4821083],[31.2453704,121.4820593]],region:"northbund"},{name:"\u4F73\u5229\u5546\u52A1\u697C",h:32,ring:[[31.2449772,121.4815786],[31.2450327,121.4820797],[31.2449042,121.4820974],[31.2448736,121.481852],[31.2449396,121.4818367],[31.2449325,121.4817761],[31.2448537,121.481788],[31.244833,121.4816309],[31.2449772,121.4815786]],region:"northbund"},{name:"\u534E\u5FB7\u5927\u697C",h:22.4,ring:[[31.2446847,121.4816927],[31.2447305,121.482076],[31.2447517,121.4820929],[31.2448529,121.4820763],[31.2448024,121.4816528],[31.2447357,121.4816637],[31.2447382,121.4816839],[31.2446847,121.4816927]],region:"northbund"},{name:"\u6D66\u6C5F\u996D\u5E97",h:22.4,ring:[[31.2465589,121.486555],[31.2465254,121.4867732],[31.2460141,121.4866658],[31.2461056,121.4860697],[31.24626,121.4861022],[31.246202,121.48648],[31.2465589,121.486555]],region:"northbund"},{name:"",h:38.4,ring:[[31.2442705,121.4796821],[31.2442437,121.4797187],[31.244207,121.4796819],[31.2441623,121.4797427],[31.2442109,121.4797914],[31.2441991,121.4798074],[31.244455,121.4800645],[31.2445375,121.4799494],[31.2442705,121.4796821]],region:"northbund"},{name:"",h:25.6,ring:[[31.2453575,121.4820193],[31.2453024,121.4816169],[31.2452855,121.4815568],[31.2452696,121.4815272],[31.2452453,121.4815065],[31.2452154,121.4814944],[31.2451864,121.4814999],[31.2449945,121.4815718],[31.2450527,121.4820798],[31.2453575,121.4820193]],region:"northbund"},{name:"",h:19.2,ring:[[31.2446911,121.4824344],[31.244523,121.482464],[31.2445669,121.4828487],[31.2447418,121.4828536],[31.2446911,121.4824344]],region:"northbund"},{name:"\u6C38\u5174\u5927\u697C",h:19.2,ring:[[31.2444833,121.4824835],[31.2443217,121.4825116],[31.2443297,121.4825877],[31.244353,121.4828074],[31.2443573,121.4828483],[31.2445253,121.4828526],[31.2444833,121.4824835]],region:"northbund"},{name:"\u76DB\u90A6\u56FD\u9645\u5927\u53A6",h:80,ring:[[31.2536822,121.4800083],[31.2537288,121.4804464],[31.2530697,121.4805586],[31.253023,121.4801312],[31.2536822,121.4800083]],region:"northbund"},{name:"\u5B89\u57F9\u6D0B\u884C\u5927\u697C",h:9.6,ring:[[31.2432188,121.4835176],[31.2432411,121.4837319],[31.2430065,121.483769],[31.2429741,121.4837652],[31.2429549,121.4837461],[31.2429359,121.4835673],[31.2432188,121.4835176]],region:"northbund"},{name:"\u4E2D\u4E00\u5927\u697C",h:16,ring:[[31.2429752,121.4802068],[31.2430024,121.4803853],[31.2425867,121.4804911],[31.2425763,121.480268],[31.2429752,121.4802068]],region:"northbund"},{name:"\u4E0A\u6D77\u5916\u6EE9 W \u9152\u5E97",h:172,ring:[[31.2511448,121.4921154],[31.251121,121.4921643],[31.2510926,121.4921889],[31.2510856,121.492195],[31.2510033,121.4922213],[31.2509698,121.492219],[31.2509209,121.4922157],[31.2508502,121.4921708],[31.2507797,121.4920877],[31.2507401,121.4920096],[31.2507319,121.4919287],[31.2507365,121.4918595],[31.2507595,121.4917946],[31.2507964,121.4917599],[31.250837,121.4917466],[31.2508987,121.4918676],[31.250975,121.4919716],[31.2510521,121.4920299],[31.2511486,121.4920598],[31.2511448,121.4921154]],region:"northbund"},{name:"\u91D1\u5149\u4E2D\u5FC3 (\u5199\u5B57\u697C)",h:320,ring:[[31.2509055,121.4937595],[31.2510548,121.4937964],[31.2512048,121.4938335],[31.2515118,121.4939617],[31.2515644,121.4937244],[31.2516131,121.4936017],[31.2516483,121.4935128],[31.2515839,121.4934915],[31.2513109,121.4934012],[31.2512161,121.493357],[31.2510288,121.4932697],[31.2509845,121.4935336],[31.2509055,121.4937595]],region:"northbund"},{name:"",h:32,ring:[[31.2458438,121.4871373],[31.2458375,121.4875366],[31.2456853,121.4875333],[31.2456916,121.487134],[31.2458438,121.4871373]],region:"northbund"},{name:"\u5170\u5FC3\u5927\u697C",h:22.4,ring:[[31.2448049,121.483468],[31.244533,121.4835023],[31.24452,121.4833684],[31.2447932,121.4833317],[31.2448049,121.483468]],region:"northbund"},{name:"\u771F\u5149\u5927\u697C",h:28.8,ring:[[31.2448567,121.4832337],[31.2449693,121.483216],[31.2449762,121.483317],[31.2450673,121.4833197],[31.2450761,121.4834046],[31.2450787,121.483442],[31.2448698,121.4834633],[31.2448567,121.4832337]],region:"northbund"},{name:"",h:16,ring:[[31.2431485,121.4823123],[31.2433211,121.4823132],[31.2433194,121.4827959],[31.2431468,121.4827951],[31.2431485,121.4823123]],region:"northbund"},{name:"\u7231\u5EFA\u516C\u53F8",h:25.6,ring:[[31.2446786,121.4824302],[31.244368,121.4824835],[31.2443395,121.4822561],[31.2446501,121.4822028],[31.2446786,121.4824302]],region:"northbund"},{name:"",h:16,ring:[[31.2447723,121.4823475],[31.2450623,121.482304],[31.2450847,121.4824834],[31.2449996,121.4824958],[31.2449957,121.482469],[31.2447893,121.4824975],[31.2447723,121.4823475]],region:"northbund"},{name:"\u4E9A\u6D32\u6587\u4F1A\u5927\u697C",h:19.2,ring:[[31.2432308,121.4829615],[31.2432614,121.4833064],[31.2431489,121.4833201],[31.2431182,121.4829752],[31.2432308,121.4829615]],region:"northbund"},{name:"\u5706\u660E\u56ED\u516C\u5BD3",h:19.2,ring:[[31.2435419,121.4836351],[31.243501,121.4836929],[31.2432411,121.4837319],[31.2432188,121.4835176],[31.2432162,121.4834923],[31.2435198,121.4834471],[31.2435419,121.4836351]],region:"northbund"},{name:"",h:25.6,ring:[[31.2443915,121.481764],[31.2444045,121.481861],[31.2444125,121.4819194],[31.2441482,121.4820233],[31.2441401,121.4819908],[31.2441053,121.4818667],[31.2443915,121.481764]],region:"northbund"},{name:"\u4E2D\u5B9E\u5927\u697C",h:22.4,ring:[[31.2427308,121.4830428],[31.2427291,121.4833359],[31.2428949,121.4833356],[31.2430681,121.4833326],[31.2430264,121.4829712],[31.2427765,121.482991],[31.2427544,121.4830024],[31.2427409,121.4830203],[31.2427308,121.4830428]],region:"northbund"},{name:"\u864E\u4E18\u516C\u5BD3",h:19.2,ring:[[31.2447913,121.4825182],[31.2449009,121.4825021],[31.2449203,121.4826828],[31.244996,121.4826717],[31.2449799,121.4825222],[31.2450202,121.4825163],[31.2450227,121.4825398],[31.2450915,121.4825297],[31.2451209,121.4828044],[31.2451016,121.4828322],[31.2450375,121.4828398],[31.2450148,121.4828189],[31.2450126,121.4827988],[31.244937,121.4828101],[31.2449217,121.482847],[31.2448479,121.4828568],[31.2448244,121.482826],[31.2447913,121.4825182]],region:"northbund"},{name:"",h:32,ring:[[31.2454744,121.4832127],[31.2453914,121.4834631],[31.2453587,121.4835156],[31.2453204,121.4835397],[31.2452904,121.4835353],[31.2451476,121.4834852],[31.2451264,121.4834584],[31.2451207,121.4834282],[31.2451237,121.4834029],[31.2450761,121.4834046],[31.2450673,121.4833197],[31.2450626,121.4832741],[31.2454744,121.4832127]],region:"northbund"},{name:"\u4F4F\u5B85",h:6.4,ring:[[31.2442143,121.4803718],[31.2440493,121.4804272],[31.2439727,121.4801149],[31.2441376,121.4800596],[31.2442143,121.4803718]],region:"northbund"},{name:"",h:19.2,ring:[[31.2437999,121.48047],[31.2437289,121.4801824],[31.2439055,121.4801227],[31.2439766,121.4804103],[31.2437999,121.48047]],region:"northbund"},{name:"",h:25.6,ring:[[31.2430451,121.4804266],[31.2433209,121.4803408],[31.2433671,121.4805442],[31.2433293,121.4805981],[31.2433515,121.4806956],[31.2431225,121.4807669],[31.2430451,121.4804266]],region:"northbund"},{name:"",h:22.4,ring:[[31.2436821,121.4802148],[31.2436163,121.4802345],[31.2436663,121.4804644],[31.2435697,121.4804932],[31.2435201,121.4802651],[31.2433803,121.4803068],[31.2434431,121.4805949],[31.2437453,121.4805048],[31.2436821,121.4802148]],region:"northbund"},{name:"",h:19.2,ring:[[31.2447325,121.4805305],[31.2448193,121.4807548],[31.2447812,121.4807759],[31.2447914,121.4808066],[31.2446581,121.4808575],[31.2445622,121.4806389],[31.2447325,121.4805305]],region:"northbund"},{name:"",h:57.6,ring:[[31.2450945,121.480946],[31.2451563,121.481238],[31.2449373,121.4813113],[31.2448689,121.4810415],[31.2450945,121.480946]],region:"northbund"},{name:"",h:19.2,ring:[[31.2448707,121.4807739],[31.244851,121.4807373],[31.2448193,121.4807548],[31.2447812,121.4807759],[31.2447914,121.4808066],[31.2447988,121.4808292],[31.2446566,121.480897],[31.2447473,121.4810863],[31.2448433,121.4810533],[31.2448689,121.4810415],[31.2450945,121.480946],[31.2451181,121.4809361],[31.2450192,121.4806996],[31.2448707,121.4807739]],region:"northbund"},{name:"\u81EA\u6765\u5927\u697C",h:16,ring:[[31.2443109,121.4805605],[31.2442888,121.4804734],[31.2443064,121.4804185],[31.2446331,121.4803051],[31.2446407,121.4803354],[31.2446735,121.4804643],[31.2446904,121.4805312],[31.2445419,121.4805827],[31.244518,121.4804885],[31.2443109,121.4805605]],region:"northbund"},{name:"",h:25.6,ring:[[31.2447549,121.4803269],[31.2447032,121.4803123],[31.2446407,121.4803354],[31.2446735,121.4804643],[31.244713,121.4804499],[31.2447504,121.4804672],[31.2448553,121.4807061],[31.2449377,121.4806551],[31.2449427,121.4806497],[31.2449457,121.4806426],[31.2449457,121.4806357],[31.2449432,121.4806276],[31.2448374,121.480404],[31.2448034,121.480361],[31.2447549,121.4803269]],region:"northbund"},{name:"",h:25.6,ring:[[31.2445744,121.4815151],[31.2445598,121.4815495],[31.2441472,121.4816918],[31.2440995,121.4815022],[31.2445335,121.4813526],[31.2445744,121.4815151]],region:"northbund"},{name:"",h:38.4,ring:[[31.243905,121.4811122],[31.2439859,121.4814499],[31.2437176,121.4815075],[31.2437105,121.4814335],[31.2436963,121.4814098],[31.243657,121.4811651],[31.243905,121.4811122]],region:"northbund"},{name:"",h:38.4,ring:[[31.2445313,121.4813069],[31.244142,121.4814696],[31.244053,121.4810599],[31.2442061,121.4810045],[31.2442174,121.481045],[31.2444076,121.480967],[31.2445024,121.4812128],[31.2445313,121.4813069]],region:"northbund"},{name:"",h:25.6,ring:[[31.2505951,121.4877539],[31.2507648,121.4877486],[31.2507764,121.4882647],[31.2506068,121.48827],[31.2505951,121.4877539]],region:"northbund"},{name:"\u626C\u5B50\u6C5F\u5927\u53A6",h:64,ring:[[31.2505942,121.4893417],[31.2507342,121.4892675],[31.2508787,121.4896404],[31.2507387,121.4897146],[31.2505942,121.4893417]],region:"northbund"},{name:"\u626C\u5B50\u6C5F\u5927\u53A6",h:48,ring:[[31.2507524,121.4897333],[31.250856,121.489678],[31.2509294,121.4898657],[31.2508258,121.4899211],[31.2507524,121.4897333]],region:"northbund"},{name:"\u4E2D\u56FD\u8054\u901A(\u4E0A\u6D77\u5206\u516C\u53F8\u5317\u5916\u6EE9\u5C40)",h:60,ring:[[31.2510849,121.4888522],[31.2512814,121.488774],[31.2514267,121.4892675],[31.2512294,121.4893484],[31.2510849,121.4888522]],region:"northbund"},{name:"COSCO SHIPPING Lines Headquarters",h:96,ring:[[31.2490969,121.4919173],[31.2488091,121.4920729],[31.2486914,121.4917751],[31.2489792,121.4916196],[31.2490969,121.4919173]],region:"northbund"},{name:"\u94F6\u6CE2\u5927\u53A6",h:32,ring:[[31.247283,121.4855446],[31.2473014,121.485256],[31.2474895,121.4852767],[31.2475262,121.4852836],[31.2475628,121.4853028],[31.2475838,121.4853412],[31.2475909,121.4853837],[31.2475818,121.4855666],[31.247283,121.4855446]],region:"northbund"},{name:"",h:48,ring:[[31.2495406,121.4912729],[31.2494534,121.4913105],[31.2493858,121.4915572],[31.2495234,121.4916176],[31.2495933,121.4915975],[31.2496403,121.4915398],[31.2496988,121.491352],[31.2495406,121.4912729]],region:"northbund"},{name:"",h:76.8,ring:[[31.2490973,121.4840534],[31.2491997,121.4839747],[31.2492649,121.4840908],[31.2493465,121.484028],[31.2494459,121.484205],[31.2493598,121.4842713],[31.2493051,121.4841741],[31.2492073,121.4842492],[31.2490973,121.4840534]],region:"northbund"},{name:"",h:76.8,ring:[[31.2492868,121.4832083],[31.2493301,121.4835793],[31.2492294,121.4835954],[31.2492174,121.483492],[31.2491804,121.4834979],[31.2491603,121.4833261],[31.2491975,121.4833202],[31.2491863,121.4832243],[31.2492868,121.4832083]],region:"northbund"},{name:"",h:19.2,ring:[[31.2487939,121.4845714],[31.2489006,121.4845922],[31.2488467,121.4849704],[31.24874,121.4849496],[31.2487939,121.4845714]],region:"northbund"},{name:"\u8036\u677E\u8239\u5382\u65E7\u5740",h:16,ring:[[31.2494775,121.4926603],[31.2491749,121.49285],[31.2490556,121.4925898],[31.2493582,121.4924001],[31.2494775,121.4926603]],region:"northbund"},{name:"",h:32,ring:[[31.2489604,121.492026],[31.2490862,121.4919464],[31.249194,121.4921798],[31.2490682,121.4922593],[31.2489604,121.492026]],region:"northbund"},{name:"",h:25.6,ring:[[31.2471742,121.4852654],[31.2471229,121.4858754],[31.2470181,121.4858642],[31.2470648,121.4852541],[31.2470923,121.4852576],[31.2471077,121.4852385],[31.2471369,121.4852429],[31.2471499,121.4852635],[31.2471742,121.4852654]],region:"northbund"},{name:"\u5927\u6865\u5927\u697C",h:22.4,ring:[[31.2480108,121.4803397],[31.2480887,121.4807769],[31.2481013,121.4808151],[31.2481277,121.4808426],[31.2481563,121.4808553],[31.2481827,121.4808574],[31.2485061,121.4808037],[31.2484866,121.4806549],[31.2482034,121.4807031],[31.2481449,121.4803142],[31.2480108,121.4803397]],region:"northbund"},{name:"",h:38.4,ring:[[31.2439556,121.4833603],[31.2438355,121.4833748],[31.2438224,121.4832515],[31.2437976,121.4830185],[31.2439171,121.4830203],[31.2439556,121.4833603]],region:"northbund"},{name:"",h:38.4,ring:[[31.2447138,121.4832996],[31.2445807,121.4833175],[31.2445759,121.4832689],[31.2445539,121.4830449],[31.244687,121.483027],[31.2447138,121.4832996]],region:"northbund"},{name:"",h:38.4,ring:[[31.2443403,121.4833048],[31.2442089,121.4833239],[31.2441968,121.4832],[31.2441814,121.4830269],[31.2442723,121.4830291],[31.2443166,121.4830302],[31.2443403,121.4833048]],region:"northbund"},{name:"\u4E0A\u6D77\u5927\u53A6",h:60.8,ring:[[31.2462235,121.4851898],[31.2461402,121.4857462],[31.2461956,121.4858476],[31.2463271,121.4858731],[31.2464131,121.4858088],[31.2464716,121.4854451],[31.2465042,121.4852421],[31.2464395,121.4851377],[31.2463193,121.4851087],[31.2462235,121.4851898]],region:"northbund"},{name:"\u5E7F\u5B66\u5927\u697C",h:25.6,ring:[[31.2449638,121.4831306],[31.2450219,121.4831211],[31.2450198,121.4830841],[31.2450431,121.4830811],[31.2450396,121.4830318],[31.2450169,121.483034],[31.2450141,121.4829839],[31.2448372,121.4829894],[31.2448567,121.4832337],[31.2449693,121.483216],[31.2449638,121.4831306]],region:"northbund"},{name:"\u6D66\u897F\u516C\u5BD3",h:28.8,ring:[[31.2497137,121.4824457],[31.2497747,121.4828447],[31.2501488,121.4827701],[31.250197,121.4827138],[31.2502251,121.482663],[31.2502016,121.4823624],[31.2497137,121.4824457]],region:"northbund"},{name:"\u5C0F\u6D66\u897F\u516C\u5BD3",h:28.8,ring:[[31.2501489,121.4832286],[31.2500569,121.4832196],[31.2500735,121.4830124],[31.2500512,121.4830091],[31.2500569,121.4829111],[31.250089,121.4829057],[31.250134,121.4829115],[31.2501632,121.4829413],[31.2501715,121.4829935],[31.2501489,121.4832286]],region:"northbund"},{name:"\u666F\u6797\u5E90",h:19.2,ring:[[31.2513774,121.4830511],[31.2512239,121.4830763],[31.2511768,121.4826837],[31.2513304,121.4826585],[31.2513774,121.4830511]],region:"northbund"},{name:"\u4E0A\u6D77\u5E02\u5B89\u88C5\u5DE5\u7A0B\u6709\u9650\u516C\u53F8",h:3.2,ring:[[31.2505896,121.4829489],[31.2504506,121.4833599],[31.2506402,121.4834477],[31.2507967,121.4829849],[31.2506696,121.4829261],[31.2506521,121.4829779],[31.2505896,121.4829489]],region:"northbund"},{name:"\u95F5\u884C\u5927\u697C",h:16,ring:[[31.2489084,121.486884],[31.2487111,121.4871442],[31.2486171,121.4872482],[31.2485457,121.4872439],[31.2485897,121.4871819],[31.2486035,121.4871918],[31.2486318,121.4871452],[31.2486473,121.4871275],[31.2485506,121.4870551],[31.2487111,121.486744],[31.2489084,121.486884]],region:"northbund"},{name:"\u95F5\u884C\u5927\u697C",h:22.4,ring:[[31.2488103,121.4865802],[31.2489089,121.4866324],[31.2488694,121.4867304],[31.2487689,121.4866587],[31.2487111,121.486744],[31.2489084,121.486884],[31.2490555,121.4866292],[31.2490579,121.4865534],[31.2490138,121.4865059],[31.2488628,121.4864382],[31.2488103,121.4865802]],region:"northbund"},{name:"\u6D66\u5149\u5927\u697C",h:22.4,ring:[[31.2437073,121.4815112],[31.2437176,121.4815075],[31.2439859,121.4814499],[31.2440447,121.4816931],[31.2437245,121.4818105],[31.243716,121.4816598],[31.2437359,121.4816452],[31.2437073,121.4815112]],region:"northbund"},{name:"\u81EA\u529B\u5927\u697C",h:16,ring:[[31.2440508,121.4805194],[31.2438098,121.4806081],[31.2438471,121.4807651],[31.2440685,121.4806897],[31.2440911,121.4806797],[31.2440508,121.4805194]],region:"northbund"},{name:"\u6052\u4E30\u5927\u697C",h:19.2,ring:[[31.2438098,121.4806081],[31.243507,121.4807191],[31.2435587,121.4811203],[31.2439036,121.4810132],[31.2438471,121.4807651],[31.2438098,121.4806081]],region:"northbund"},{name:"\u6D59\u5174\u5927\u697C",h:19.2,ring:[[31.2429427,121.4809819],[31.2426615,121.4810887],[31.2426431,121.4811406],[31.2426914,121.4817205],[31.2429454,121.4816282],[31.2428936,121.4814512],[31.2430505,121.4813871],[31.2429427,121.4809819]],region:"northbund"},{name:"\u5229\u901A\u5E7F\u573A",h:9.6,ring:[[31.2550741,121.4798416],[31.2548923,121.4797153],[31.2545499,121.4798231],[31.2543498,121.4799987],[31.2543682,121.4801805],[31.2549569,121.4809157],[31.2554586,121.480504],[31.2555008,121.480427],[31.2550741,121.4798416]],region:"northbund"},{name:"",h:12.8,ring:[[31.2507401,121.4920096],[31.2507222,121.4920866],[31.2506849,121.4921344],[31.2507666,121.4921627],[31.2508331,121.4922087],[31.2508696,121.4922511],[31.2508937,121.4922972],[31.2509213,121.4922594],[31.2509698,121.492219],[31.2509209,121.4922157],[31.2508502,121.4921708],[31.2507797,121.4920877],[31.2507401,121.4920096]],region:"northbund"},{name:"",h:24,ring:[[31.2442908,121.4869603],[31.2442788,121.4869499],[31.2442892,121.4869293],[31.2443177,121.4868729],[31.2443436,121.4868949],[31.244305,121.4869428],[31.2442908,121.4869603]],region:"northbund"},{name:"",h:24,ring:[[31.2442777,121.4869704],[31.2442912,121.4869627],[31.2443021,121.486983],[31.2443319,121.4870383],[31.2443033,121.4870552],[31.2442846,121.4869932],[31.2442777,121.4869704]],region:"northbund"},{name:"",h:24,ring:[[31.2442766,121.4869517],[31.2442761,121.4869692],[31.2442557,121.4869709],[31.2441999,121.4869757],[31.2442006,121.4869383],[31.2442562,121.4869481],[31.2442766,121.4869517]],region:"northbund"},{name:"",h:57.6,ring:[[31.250275,121.4947732],[31.2502646,121.4948241],[31.2502796,121.4949153],[31.2503564,121.495197],[31.2503919,121.4952734],[31.2504206,121.4953163],[31.2504561,121.4953418],[31.2505008,121.4953485],[31.250541,121.4953351],[31.250565,121.4953002],[31.2505788,121.4952573],[31.2505754,121.4951862],[31.2504756,121.4948255],[31.2504481,121.4947692],[31.2504183,121.4947329],[31.2503862,121.4947169],[31.2503529,121.4947155],[31.2503266,121.4947209],[31.2502933,121.494745],[31.250275,121.4947732]],region:"northbund"},{name:"",h:25.6,ring:[[31.250275,121.4958836],[31.2504905,121.495948],[31.2505364,121.4960177],[31.2505891,121.4961331],[31.2505799,121.4961733],[31.2502681,121.4963691],[31.250236,121.4963718],[31.2502016,121.4963476],[31.2500617,121.4960848],[31.250064,121.4960499],[31.2500846,121.4960258],[31.250275,121.4958836]],region:"northbund"},{name:"",h:56,ring:[[31.2554764,121.4925064],[31.2554557,121.4928497],[31.2553801,121.4928417],[31.2553824,121.4928175],[31.2552895,121.4928081],[31.2552895,121.4927572],[31.2552173,121.4927531],[31.2552287,121.4925533],[31.2552884,121.4925573],[31.2552918,121.4925198],[31.2553915,121.4925278],[31.2553915,121.4924983],[31.2554764,121.4925064]],region:"northbund"},{name:"",h:80,ring:[[31.2561188,121.4873972],[31.2561073,121.4878049],[31.2560867,121.487829],[31.2557519,121.4878156],[31.2557359,121.4877539],[31.2560248,121.4873891],[31.2561188,121.4873972]],region:"northbund"},{name:"",h:9.6,ring:[[31.2561233,121.4878772],[31.2559745,121.4878726],[31.2559679,121.4881746],[31.2561246,121.4881884],[31.2561233,121.4878772]],region:"northbund"},{name:"Shanghai Consruction Engineering",h:20,ring:[[31.251431,121.4896012],[31.2513315,121.4896462],[31.2512783,121.4895126],[31.2513002,121.4895007],[31.2512704,121.4894244],[31.2515185,121.4893013],[31.2515645,121.4894261],[31.2513994,121.4895113],[31.251431,121.4896012]],region:"northbund"},{name:"",h:20,ring:[[31.2511762,121.4897189],[31.2510527,121.4897733],[31.2509487,121.4894255],[31.251069,121.4893774],[31.2511762,121.4897189]],region:"northbund"},{name:"",h:10,ring:[[31.251066,121.4893734],[31.2509457,121.4894194],[31.250804,121.488938],[31.2509243,121.4888912],[31.251066,121.4893734]],region:"northbund"},{name:"",h:35,ring:[[31.2525703,121.4915889],[31.2526917,121.491529],[31.252643,121.4913954],[31.2525223,121.4914608],[31.2525703,121.4915889]],region:"northbund"},{name:"\u5B87\u6CF0\u516C\u5BD3",h:50,ring:[[31.2525175,121.4914491],[31.252639,121.4913893],[31.2525128,121.4910248],[31.2523889,121.4910855],[31.2525175,121.4914491]],region:"northbund"},{name:"\u5B87\u6CF0\u516C\u5BD3",h:50,ring:[[31.2523206,121.4911187],[31.252442,121.4910589],[31.2523158,121.4906943],[31.2521919,121.4907551],[31.2523017,121.4910652],[31.2523206,121.4911187]],region:"northbund"},{name:"\u4E0A\u6D77\u5B87\u6CF0\u623F\u5730\u4EA7\u6709\u9650\u516C\u53F8",h:16,ring:[[31.252027,121.4909555],[31.2521485,121.4908957],[31.2520997,121.490762],[31.2519791,121.4908275],[31.252027,121.4909555]],region:"northbund"},{name:"\u5B87\u6CF0\u516C\u5BD3",h:56,ring:[[31.2528996,121.4913023],[31.253021,121.4912376],[31.252811,121.4907173],[31.2526885,121.4907861],[31.2528996,121.4913023]],region:"northbund"},{name:"",h:124,ring:[[31.2520257,121.4895762],[31.2520431,121.4896117],[31.2520495,121.4896519],[31.2520444,121.4896923],[31.2520282,121.4897285],[31.2520034,121.4897561],[31.2519722,121.4897728],[31.2519382,121.489777],[31.2519048,121.4897682],[31.2518756,121.4897472],[31.2518537,121.4897164],[31.2518414,121.489679],[31.2518401,121.489639],[31.2518498,121.4896006],[31.25187,121.4895673],[31.2518985,121.4895436],[31.251932,121.4895321],[31.2519669,121.4895341],[31.2519994,121.4895493],[31.2520257,121.4895762]],region:"northbund"},{name:"",h:124,ring:[[31.2525863,121.4895692],[31.2525375,121.4896241],[31.2524786,121.4896193],[31.2524571,121.4896099],[31.2524322,121.4895793],[31.2524131,121.4895177],[31.2524083,121.4894416],[31.2524217,121.4893946],[31.2524782,121.4893755],[31.2525423,121.4893744],[31.2525873,121.4894192],[31.2525978,121.4895021],[31.2525863,121.4895692]],region:"northbund"},{name:"\u5EFA\u5510\u5927\u697C",h:6.4,ring:[[31.254078,121.4931688],[31.2542123,121.4935671],[31.2542691,121.4935412],[31.2542974,121.493606],[31.254519,121.4934846],[31.2544754,121.4933688],[31.2543033,121.4934515],[31.2541819,121.4931206],[31.254078,121.4931688]],region:"northbund"},{name:"",h:56,ring:[[31.2558308,121.4921407],[31.2557953,121.4925146],[31.2557318,121.4925087],[31.2557344,121.492479],[31.2556431,121.4924642],[31.2556507,121.4924256],[31.2555923,121.4924197],[31.2555974,121.4923692],[31.2555771,121.4923633],[31.2555847,121.4922476],[31.2556126,121.4922505],[31.2556152,121.4921912],[31.255671,121.4922001],[31.255676,121.4921496],[31.2557521,121.4921674],[31.2557572,121.4921289],[31.2558308,121.4921407]],region:"northbund"},{name:"",h:18,ring:[[31.2555618,121.49156],[31.2557347,121.4917778],[31.2556083,121.4919127],[31.2554487,121.4916845],[31.2555618,121.49156]],region:"northbund"},{name:"",h:18,ring:[[31.2557908,121.491758],[31.2555981,121.4919429],[31.2556574,121.4920258],[31.2558468,121.4918331],[31.2557908,121.491758]],region:"northbund"},{name:"",h:6,ring:[[31.2547063,121.4914279],[31.254755,121.4915172],[31.2546852,121.4915703],[31.2546381,121.4914849],[31.2547063,121.4914279]],region:"northbund"},{name:"",h:6,ring:[[31.2545823,121.4915403],[31.2546593,121.4916811],[31.2545903,121.4917337],[31.2545149,121.4915929],[31.2545823,121.4915403]],region:"northbund"},{name:"",h:3,ring:[[31.2547611,121.4915363],[31.2548009,121.4916214],[31.2547259,121.491672],[31.2546895,121.4915922],[31.2547611,121.4915363]],region:"northbund"},{name:"",h:3,ring:[[31.2552143,121.4918305],[31.2551362,121.4919114],[31.2551092,121.4918657],[31.2551888,121.4917901],[31.2552143,121.4918305]],region:"northbund"},{name:"Longmen Building",h:16,ring:[[31.2559643,121.4918028],[31.256042,121.4919152],[31.255841,121.4921052],[31.2557633,121.4919928],[31.2559643,121.4918028]],region:"northbund"},{name:"",h:21,ring:[[31.2541557,121.4922506],[31.2542978,121.4925292],[31.2543189,121.4925145],[31.2543469,121.4925695],[31.254395,121.4925359],[31.2545261,121.4927928],[31.2544141,121.492871],[31.2543169,121.4926805],[31.2542766,121.4927086],[31.2542485,121.4926537],[31.2542271,121.4926687],[31.2541846,121.4925853],[31.254173,121.4925934],[31.2540395,121.4923318],[31.2541557,121.4922506]],region:"northbund"},{name:"",h:48,ring:[[31.253233,121.4892206],[31.2530453,121.4892673],[31.2531132,121.4897157],[31.2533048,121.4896596],[31.253233,121.4892206]],region:"northbund"},{name:"",h:48,ring:[[31.2532968,121.4898086],[31.2531211,121.4898553],[31.253197,121.490341],[31.2533727,121.4902802],[31.2532968,121.4898086]],region:"northbund"},{name:"",h:48,ring:[[31.2534034,121.4905269],[31.2532317,121.4905783],[31.2533521,121.4910492],[31.2535192,121.4909799],[31.2534034,121.4905269]],region:"northbund"},{name:"",h:48,ring:[[31.2535962,121.4911269],[31.2534206,121.4912203],[31.2535803,121.4916359],[31.2537399,121.4915332],[31.2535962,121.4911269]],region:"northbund"},{name:"",h:93,ring:[[31.2536076,121.4891771],[31.2534926,121.4892302],[31.2536833,121.4898673],[31.2538527,121.4897575],[31.2538315,121.4896938],[31.2538739,121.4896691],[31.2538527,121.4896231],[31.2538164,121.4896443],[31.2537649,121.4895381],[31.2537982,121.4895204],[31.2537589,121.4894142],[31.2537196,121.489439],[31.2536863,121.4893435],[31.2537105,121.4893364],[31.2536802,121.4892337],[31.2536469,121.4892621],[31.2536076,121.4891771]],region:"northbund"},{name:"",h:93,ring:[[31.2539157,121.4900205],[31.2537498,121.490076],[31.2538894,121.4905412],[31.2540079,121.4904827],[31.2539974,121.4904334],[31.2540421,121.4904088],[31.2540132,121.4903132],[31.2539816,121.4903163],[31.2539473,121.4901808],[31.2539895,121.4901684],[31.2539769,121.4900968],[31.253971,121.4900637],[31.2539289,121.490076],[31.2539157,121.4900205]],region:"northbund"},{name:"",h:93,ring:[[31.2540546,121.4906159],[31.2539068,121.4906369],[31.2539767,121.4912813],[31.2541204,121.4912556],[31.2541005,121.4911412],[31.2541384,121.4911412],[31.2541244,121.4910805],[31.2540945,121.4910805],[31.2540845,121.4909404],[31.2541244,121.4909428],[31.2541104,121.4908377],[31.2540845,121.49084],[31.2540725,121.4907419],[31.2541085,121.4907373],[31.2541065,121.4906556],[31.2540685,121.4906649],[31.2540546,121.4906159]],region:"northbund"},{name:"",h:18,ring:[[31.2536257,121.4885193],[31.2534881,121.48853],[31.253534,121.4889699],[31.2536853,121.4889485],[31.2536257,121.4885193]],region:"northbund"},{name:"",h:21,ring:[[31.2536076,121.4881913],[31.253404,121.4882146],[31.253432,121.4884855],[31.2536316,121.4884621],[31.2536076,121.4881913]],region:"northbund"},{name:"",h:6,ring:[[31.2535981,121.4881355],[31.2535586,121.4878089],[31.2532609,121.487926],[31.2533215,121.4882279],[31.2535981,121.4881355]],region:"northbund"},{name:"",h:6,ring:[[31.2535322,121.4877688],[31.2534005,121.48747],[31.2531108,121.4874576],[31.2532425,121.4878951],[31.2535322,121.4877688]],region:"northbund"},{name:"",h:6,ring:[[31.2530239,121.487473],[31.2528974,121.4874915],[31.2528,121.4875994],[31.2528474,121.4876548],[31.253037,121.4875562],[31.2530239,121.487473]],region:"northbund"},{name:"",h:6,ring:[[31.2530528,121.487587],[31.2528711,121.4876826],[31.2529106,121.4878058],[31.2530028,121.4877719],[31.2530765,121.4880215],[31.2531793,121.4879691],[31.2530528,121.487587]],region:"northbund"},{name:"",h:6,ring:[[31.2527837,121.4876094],[31.2526704,121.4877572],[31.2527337,121.4878158],[31.2528522,121.4877172],[31.2527837,121.4876094]],region:"northbund"},{name:"",h:6,ring:[[31.2529812,121.4878065],[31.2527969,121.4878928],[31.2529654,121.4881793],[31.2530155,121.4881485],[31.2530023,121.4880746],[31.2530765,121.4880215],[31.2529812,121.4878065]],region:"northbund"},{name:"",h:6,ring:[[31.252868,121.4877449],[31.2527416,121.4878343],[31.2527854,121.4878794],[31.2528907,121.4878117],[31.252868,121.4877449]],region:"northbund"},{name:"",h:6,ring:[[31.2526563,121.4877947],[31.2524166,121.488166],[31.2525984,121.4884787],[31.2529592,121.48828],[31.2528789,121.488072],[31.2527419,121.4878825],[31.2526563,121.4877947]],region:"northbund"},{name:"",h:9,ring:[[31.2531949,121.4881521],[31.253033,121.4882045],[31.2530725,121.4883924],[31.2532226,121.4883447],[31.2531949,121.4881521]],region:"northbund"},{name:"",h:6,ring:[[31.2531808,121.4879943],[31.2530279,121.4880776],[31.253047,121.4881833],[31.2532051,121.4881345],[31.2531808,121.4879943]],region:"northbund"},{name:"",h:6,ring:[[31.2534293,121.4885533],[31.2529914,121.4886509],[31.2530053,121.4887667],[31.253438,121.4886814],[31.2534293,121.4885533]],region:"northbund"},{name:"",h:6,ring:[[31.2534606,121.4887281],[31.2532937,121.4887525],[31.2533094,121.4888684],[31.253478,121.4888379],[31.2534606,121.4887281]],region:"northbund"},{name:"",h:6,ring:[[31.2533389,121.4888968],[31.2534797,121.4888806],[31.2534797,121.4889964],[31.2533441,121.4889964],[31.2533389,121.4888968]],region:"northbund"},{name:"",h:6,ring:[[31.2532555,121.4887464],[31.2530192,121.4887932],[31.2530261,121.4888806],[31.2532694,121.4888419],[31.2532555,121.4887464]],region:"northbund"},{name:"",h:9,ring:[[31.2533163,121.4888887],[31.2530348,121.488905],[31.2530418,121.4890025],[31.2533198,121.4890046],[31.2533163,121.4888887]],region:"northbund"},{name:"",h:6,ring:[[31.2533389,121.4882565],[31.2532364,121.4883114],[31.2532677,121.4885614],[31.2533685,121.488533],[31.2533389,121.4882565]],region:"northbund"},{name:"",h:6,ring:[[31.2532156,121.4883724],[31.253014,121.4884334],[31.2530487,121.4886183],[31.253252,121.4885756],[31.2532156,121.4883724]],region:"northbund"},{name:"",h:9,ring:[[31.253014,121.4885248],[31.2527846,121.4885635],[31.2528037,121.4886651],[31.2530244,121.4886285],[31.253014,121.4885248]],region:"northbund"},{name:"",h:6,ring:[[31.2527255,121.4884476],[31.2525952,121.4885391],[31.2526699,121.4887281],[31.2527811,121.4886468],[31.2527255,121.4884476]],region:"northbund"},{name:"",h:9,ring:[[31.2529705,121.4886671],[31.2527846,121.4886915],[31.2526977,121.4887525],[31.2528593,121.4890229],[31.2530157,121.4890046],[31.2529705,121.4886671]],region:"northbund"},{name:"",h:8,ring:[[31.25375,121.4884254],[31.253887,121.4884193],[31.2539253,121.4888632],[31.2538212,121.4888781],[31.25375,121.4884254]],region:"northbund"},{name:"",h:8,ring:[[31.2536789,121.4877076],[31.2538156,121.4877335],[31.2538158,121.4878616],[31.2538659,121.4883423],[31.2537263,121.4883484],[31.2536789,121.4877076]],region:"northbund"},{name:"",h:8,ring:[[31.2538576,121.4877619],[31.25397,121.4877875],[31.2539936,121.4883318],[31.2539012,121.4883362],[31.2538576,121.4877619]],region:"northbund"},{name:"",h:8,ring:[[31.2539126,121.4884086],[31.2540204,121.4884032],[31.2540388,121.4888592],[31.2539585,121.4888619],[31.2539126,121.4884086]],region:"northbund"},{name:"",h:8,ring:[[31.253996,121.4877914],[31.2541236,121.4878078],[31.2541544,121.4883452],[31.2540346,121.4883488],[31.253996,121.4877914]],region:"northbund"},{name:"",h:8,ring:[[31.2540617,121.4884139],[31.2541695,121.4884032],[31.2541855,121.4888538],[31.2540754,121.4888565],[31.2540617,121.4884139]],region:"northbund"},{name:"",h:8,ring:[[31.2541511,121.4878239],[31.2542956,121.4878641],[31.2543208,121.4883374],[31.2541978,121.4883453],[31.2541511,121.4878239]],region:"northbund"},{name:"",h:8,ring:[[31.2542153,121.4883952],[31.25433,121.4883952],[31.2543437,121.4888458],[31.2542268,121.4888485],[31.2542153,121.4883952]],region:"northbund"},{name:"",h:8,ring:[[31.2543139,121.4878721],[31.254448,121.4879155],[31.254463,121.4883254],[31.2543483,121.4883335],[31.2543139,121.4878721]],region:"northbund"},{name:"",h:8,ring:[[31.2543506,121.4884005],[31.2544698,121.4884005],[31.2544905,121.4888324],[31.2543712,121.4888377],[31.2543506,121.4884005]],region:"northbund"},{name:"",h:8,ring:[[31.2544845,121.4879232],[31.2546051,121.4879527],[31.2546143,121.4883335],[31.2544951,121.4883308],[31.2544845,121.4879232]],region:"northbund"},{name:"",h:8,ring:[[31.2545019,121.4883978],[31.2546074,121.4883952],[31.2546272,121.4888261],[31.2545157,121.4888297],[31.2545019,121.4883978]],region:"northbund"},{name:"",h:8,ring:[[31.2546294,121.4879584],[31.2547512,121.4879889],[31.2547693,121.4883326],[31.2546441,121.4883346],[31.2546294,121.4879584]],region:"northbund"},{name:"",h:8,ring:[[31.2546539,121.4883932],[31.2547697,121.4883956],[31.2547842,121.4888126],[31.2546699,121.4888218],[31.2546539,121.4883932]],region:"northbund"},{name:"",h:18,ring:[[31.2548048,121.4878864],[31.2548188,121.4883137],[31.2549266,121.4882997],[31.2549066,121.4878864],[31.2548048,121.4878864]],region:"northbund"},{name:"",h:16,ring:[[31.2549652,121.4878989],[31.2551128,121.4878879],[31.255136,121.4883134],[31.2549885,121.4883244],[31.2549652,121.4878989]],region:"northbund"},{name:"",h:6,ring:[[31.2536857,121.4876748],[31.2538178,121.4877154],[31.2538456,121.4875874],[31.2538004,121.4875833],[31.2537483,121.4875914],[31.2537153,121.4876077],[31.2536857,121.4876748]],region:"northbund"},{name:"",h:6,ring:[[31.2538664,121.4876016],[31.2538456,121.4877195],[31.2541271,121.4877784],[31.2541514,121.4876809],[31.2538664,121.4876016]],region:"northbund"},{name:"",h:6,ring:[[31.254181,121.4876992],[31.2544582,121.4877876],[31.25444,121.487871],[31.2541566,121.4877988],[31.254181,121.4876992]],region:"northbund"},{name:"",h:6,ring:[[31.2544972,121.4877927],[31.2547492,121.4878536],[31.2547631,121.487937],[31.2544842,121.4878741],[31.2544972,121.4877927]],region:"northbund"},{name:"",h:8,ring:[[31.2538414,121.4889045],[31.2540413,121.4888862],[31.2540465,121.4890081],[31.2538571,121.4890102],[31.2538414,121.4889045]],region:"northbund"},{name:"",h:8,ring:[[31.2540741,121.4888822],[31.2543434,121.4888741],[31.2543417,121.4889818],[31.2540793,121.488992],[31.2540741,121.4888822]],region:"northbund"},{name:"",h:8,ring:[[31.2543678,121.488872],[31.254769,121.4888637],[31.2547735,121.4889511],[31.2543695,121.4889696],[31.2543678,121.488872]],region:"northbund"},{name:"",h:8,ring:[[31.2548178,121.4883801],[31.2549273,121.4883842],[31.254943,121.4888172],[31.2548317,121.4888233],[31.2548178,121.4883801]],region:"northbund"},{name:"",h:8,ring:[[31.2549638,121.4883903],[31.2550768,121.4883842],[31.2551028,121.4887928],[31.2549742,121.4888029],[31.2549638,121.4883903]],region:"northbund"},{name:"",h:8,ring:[[31.2548244,121.4888492],[31.255149,121.4888322],[31.2551525,121.4889526],[31.2548314,121.4889686],[31.2548244,121.4888492]],region:"northbund"},{name:"",h:18,ring:[[31.2549382,121.4891484],[31.2548042,121.4891564],[31.2548108,121.4893083],[31.2548486,121.489306],[31.2548642,121.4896646],[31.2550011,121.4896565],[31.2549853,121.4892918],[31.2549445,121.4892942],[31.2549382,121.4891484]],region:"northbund"},{name:"",h:18,ring:[[31.2547465,121.489118],[31.2546043,121.489118],[31.2546089,121.4892897],[31.2546479,121.4892897],[31.2546525,121.4896625],[31.2548061,121.489633],[31.25479,121.4892736],[31.2547465,121.4892655],[31.2547465,121.489118]],region:"northbund"},{name:"",h:18,ring:[[31.2550154,121.4897181],[31.2548868,121.4897149],[31.2548786,121.4901677],[31.2550073,121.4901709],[31.2550154,121.4897181]],region:"northbund"},{name:"",h:18,ring:[[31.2548061,121.4896813],[31.2546616,121.4896893],[31.2546525,121.4900219],[31.2547969,121.4900246],[31.2548061,121.4896813]],region:"northbund"},{name:"",h:9,ring:[[31.2544682,121.4895368],[31.2543602,121.4895492],[31.2543418,121.4896909],[31.2543866,121.4897001],[31.2544524,121.4897001],[31.2544814,121.489657],[31.2544761,121.4896139],[31.2544682,121.4895368]],region:"northbund"},{name:"",h:9,ring:[[31.2542836,121.4894983],[31.2541637,121.4895023],[31.2540976,121.4895166],[31.2540612,121.489604],[31.2540733,121.4896853],[31.2541011,121.48973],[31.2541533,121.4897198],[31.2541967,121.4896792],[31.2541793,121.4896121],[31.2542123,121.4896121],[31.2542193,121.4896649],[31.2542853,121.4896832],[31.2543114,121.4896263],[31.2543062,121.4895613],[31.2542836,121.4894983]],region:"northbund"},{name:"",h:9,ring:[[31.2544869,121.4897402],[31.2544278,121.4898093],[31.2544295,121.490043],[31.254466,121.4900979],[31.2545234,121.4900999],[31.2545651,121.4900552],[31.2545686,121.4899577],[31.254546,121.4899394],[31.2545529,121.4898682],[31.2545738,121.4898642],[31.2545703,121.4897828],[31.2545303,121.4897463],[31.2544869,121.4897402]],region:"northbund"},{name:"",h:9,ring:[[31.2542454,121.4897788],[31.2542089,121.4897625],[31.254111,121.4898188],[31.2541284,121.4899149],[31.2541585,121.489978],[31.2542158,121.4900247],[31.2543183,121.4900634],[31.2543792,121.4899861],[31.2543687,121.489856],[31.2543114,121.4898459],[31.2542836,121.4898682],[31.2542548,121.489874],[31.2542454,121.4897788]],region:"northbund"},{name:"",h:64,ring:[[31.2543723,121.4950472],[31.2542333,121.4951163],[31.2545635,121.4959294],[31.2546956,121.4958603],[31.2543723,121.4950472]],region:"northbund"},{name:"",h:64,ring:[[31.2538186,121.4954674],[31.253672,121.4955508],[31.253896,121.4960899],[31.2540425,121.4960067],[31.2538186,121.4954674]],region:"northbund"},{name:"",h:64,ring:[[31.2533634,121.4957006],[31.2532152,121.4957696],[31.2534204,121.4963725],[31.2535685,121.4963036],[31.2533634,121.4957006]],region:"northbund"}],named:[]};var F_={pearl:{lat:31.23967,lon:121.49978,rotY:0},jinmao:{lat:31.23745,lon:121.50585,rotY:0},shanghaiTower:{lat:31.23365,lon:121.50777,rotY:0},swfc:{lat:31.23533,lon:121.50655,rotY:0},whiteMagnolia:{lat:31.24865,lon:121.49005,rotY:0},waibaidu:{lat:31.2443,lon:121.486,rotY:Math.PI/2}},B_=/东方明珠|金茂|上海中心|环球金融|白玉兰/,_2={lujiazui:"quant",northbund:"gaming",bund_edge:"media"},H_={quant:"\u9646\u5BB6\u5634 \xB7 QUANT \u57CE",gaming:"\u5317\u5916\u6EE9 \xB7 GAME \u57CE",media:"\u5916\u6EE9 \xB7 MEDIA \u57CE"},z_=[[31.218,121.489],[31.226,121.4908],[31.231,121.493],[31.234,121.4965],[31.236,121.5],[31.239,121.503],[31.243,121.5018],[31.248,121.502],[31.254,121.5035],[31.26,121.5065],[31.266,121.51],[31.272,121.5145]],nr=230,sc=118,G_=`
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
}`,k_=`
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
}`,oh={quant:{floorH:4,winW:2.4,winRate:.5},gaming:{floorH:3.4,winW:3,winRate:.42},media:{floorH:4.4,winW:3.6,winRate:.62}};function x2(i){var A,L,U,C,N,O,B,V,H,X,J;let e=new Oe,t=[...m2,...g2.buildings],n=new Map;for(let j of t){let ce=(A=_2[j.region])!=null?A:"quant",k=n.get(ce);k||(k={x:0,z:0,n:0,ptSum:0,hmax:0},n.set(ce,k)),k.n++,k.hmax=Math.max(k.hmax,j.h);for(let[Q,ae]of j.ring)k.x+=Bt(ae),k.z+=Ht(Q),k.ptSum++}let s=[];for(let[j,ce]of n)s.push({id:j,name:(L=H_[j])!=null?L:j,angleDeg:0,cx:ce.x/ce.ptSum,cz:ce.z/ce.ptSum});let r=new Map,o=new Map,a=[],l=0;for(let j of t){if(B_.test(j.name))continue;let ce=(U=_2[j.region])!=null?U:"quant",k=j.ring.map(([Ve,Je])=>new te(Bt(Je),-Ht(Ve)));if(k.length<3)continue;let Q=1/0,ae=-1/0,Pe=1/0,he=-1/0;for(let Ve of k)Ve.x<Q&&(Q=Ve.x),Ve.x>ae&&(ae=Ve.x),Ve.y<Pe&&(Pe=Ve.y),Ve.y>he&&(he=Ve.y);a.push({cx:(Q+ae)/2,cz:(Pe+he)/2,hw:(ae-Q)/2,hd:(he-Pe)/2});let De=new qn(k),rt;try{rt=new di(De,{depth:j.h,bevelEnabled:!1})}catch{continue}rt.rotateX(-Math.PI/2),rt.translate(0,0,0);let Ie=o.get(ce);Ie||(Ie=[],o.set(ce,Ie)),Ie.push(rt),l++}for(let[j,ce]of o){let k=u2(ce,!1);if(!k)continue;for(let Pe of ce)Pe.dispose();let Q=new Tt({vertexShader:G_,fragmentShader:k_,uniforms:nn.merge([Ce.fog,{uTint:{value:((C=Sn[j])!=null?C:de.data).clone().multiplyScalar(.55)},uWinGain:{value:1},uBreath:{value:0},uBodyGain:{value:1},uFloorH:{value:(O=(N=oh[j])==null?void 0:N.floorH)!=null?O:3.6},uWinW:{value:(V=(B=oh[j])==null?void 0:B.winW)!=null?V:2.9},uWinRate:{value:(X=(H=oh[j])==null?void 0:H.winRate)!=null?X:.45}}]),fog:!0}),ae=new W(k,Q);ae.castShadow=!0,ae.receiveShadow=!0,ae.frustumCulled=!1,e.add(ae),r.set(j,Q)}let c=[],h=new Tt({uniforms:nn.merge([Ce.fog,{uTime:{value:0},uDeep:{value:new le(1923710).multiplyScalar(3.4)},uGlow:{value:new le(2078878).multiplyScalar(2.1)}}]),vertexShader:`
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
      }`,transparent:!0,fog:!1}),u=[],d=[],f=[],p=z_.map(([j,ce])=>({x:Bt(ce),z:Ht(j)}));for(let j=0;j<p.length;j++){let ce=p[j],k=p[Math.min(j+1,p.length-1)],Q=p[Math.max(j-1,0)],ae=k.x-Q.x,Pe=k.z-Q.z,he=Math.hypot(ae,Pe)||1,De=-Pe/he,rt=ae/he;if(u.push(ce.x+De*nr,.4,ce.z+rt*nr),u.push(ce.x-De*nr,.4,ce.z-rt*nr),d.push(j/(p.length-1),0,j/(p.length-1),1),j<p.length-1){let Ie=j*2;f.push(Ie,Ie+1,Ie+2,Ie+1,Ie+3,Ie+2)}}let _=new gt;_.setAttribute("position",new je(u,3)),_.setAttribute("uv",new je(d,2)),_.setIndex(f);let g=new W(_,h);g.renderOrder=1,e.add(g);let m=new ue({color:de.data.clone().multiplyScalar(1.25),blending:$e,transparent:!0,opacity:.75,depthWrite:!1,fog:!0});m.userData.flowColor=de.data.clone();for(let j of[1,-1]){let ce=[];for(let Q=0;Q<p.length;Q++){let ae=p[Q],Pe=p[Math.min(Q+1,p.length-1)],he=p[Math.max(Q-1,0)],De=Pe.x-he.x,rt=Pe.z-he.z,Ie=Math.hypot(De,rt)||1,Ve=-rt/Ie,Je=De/Ie;ce.push(ae.x+Ve*(nr-3)*j,1.2,ae.z+Je*(nr-3)*j)}let k=new gt;k.setAttribute("position",new je(ce,3)),e.add(new $i(k,m))}c.push(m);let v=31.2398,E=121.5028,y=new P(Bt(E),0,Ht(v)),S=new W(new lt(sc,sc+14,9,6),new ke({color:726048,roughness:.85,metalness:.25}));S.position.set(y.x,4.5,y.z),S.receiveShadow=!0,e.add(S);let b=new W(new bt(sc-3,1.1,8,96),new ue({color:de.brain.clone().multiplyScalar(1.5)}));b.rotation.x=Math.PI/2,b.position.set(y.x,9.4,y.z),e.add(b);let x=[];for(let j of s){let ce=new te(j.cx,j.cz),k=new te(y.x,y.z),Q=k.clone().sub(ce).normalize(),ae=ce.clone().add(Q.clone().multiplyScalar(150)),Pe=k.clone().sub(Q.clone().multiplyScalar(sc+8)),he=ae.distanceTo(Pe),De=ae.clone().add(Pe).multiplyScalar(.5),rt=Math.atan2(Pe.y-ae.y,Pe.x-ae.x),Ie=new W(new ge(he,1.8,26),new ke({color:791588,roughness:.9}));Ie.position.set(De.x,7,De.y),Ie.rotation.y=-rt,e.add(Ie);let Ve=(J=Sn[j.id])!=null?J:de.data,Je=new ue({color:Ve.clone()});Je.userData.flowColor=Ve.clone();for(let re of[-14.5,14.5]){let pe=new W(new ge(he,.6,1.4),Je);pe.position.set(De.x,8.6,De.y+Math.cos(rt)*re*-1),pe.rotation.y=-rt,pe.position.set(De.x,8.6,De.y),e.remove(pe),Ie.add(pe),pe.position.set(0,.9,re)}e.add(Ie),c.push(Je),x.push({district:j.id,angleDeg:0,x0:Pe.x,z0:Pe.y,x1:ae.x,z1:ae.y})}let M=[{x:Bt(121.4873),z:Ht(31.2335),h:150},{x:Bt(121.486),z:Ht(31.238),h:130},{x:Bt(121.485),z:Ht(31.242),h:118}],I=[];for(let j=0;j<16;j++){let ce=j/16*Math.PI*2+.2;I.push({x:Math.cos(ce)*1900,z:Math.sin(ce)*1900})}return{root:e,plan:{districts:s,buildings:[],arteries:x,masts:M,ringNodes:I},bodyMats:r,waterMat:h,flowMats:c,colliders:a,buildingCount:l,landmarkSlots:F_,islandPos:y}}function y2(){let i=new Oe,e=new W(new lt(13,15,7,8),new ke({color:1187379,roughness:.85,metalness:.15}));e.position.y=3.5,e.castShadow=!0,i.add(e);let t=new W(new lt(9,11,13,8),new ke({color:1451583,roughness:.8,metalness:.2}));t.position.y=13.5,t.castShadow=!0,i.add(t);let n=new ue({color:de.brain.clone().multiplyScalar(1.6)}),s=new W(new fi(5.2,1),n);s.position.y=26.5,i.add(s);let r=new ke({color:1715274,roughness:.7,metalness:.3}),o=[[5.6,4.8,10,32.5],[4.8,4,10,42.5],[4,3.1,10,52.5]];for(let[p,_,g,m]of o){let v=new W(new lt(_,p,g,8),r);v.position.y=m,v.castShadow=!0,i.add(v)}let a=new ue({color:de.brain.clone().multiplyScalar(1.3)});for(let p of[32.5,42.5,52.5]){let _=new W(new bt(4.9,.34,8,32),a);_.rotation.x=Math.PI/2,_.position.y=p,i.add(_)}let l=new Oe;l.position.y=46;let c=new ke({color:2771570,roughness:.35,metalness:.5,emissive:de.data,emissiveIntensity:.55});for(let p=0;p<3;p++){let _=new W(new ge(10.5,14,1.2),c);_.position.set(Math.cos(p/3*Math.PI*2)*6.6,0,Math.sin(p/3*Math.PI*2)*6.6),_.rotation.y=p/3*Math.PI*2,l.add(_)}i.add(l);let h=new ue({color:new le(1.15,1.15,1.25)}),u=new W(new ct(2,18,14),h);u.position.y=61.5,i.add(u);let d=new ue({color:de.ceo,transparent:!0,opacity:0,blending:$e,depthWrite:!1}),f=new W(new lt(.6,2.4,300,12,1,!0),d);return f.position.y=160,i.add(f),{root:i,coreMat:n,crownMat:h,cortexGroup:l,beamMat:d,beam:f,crown:u}}function v2(i){let e=new Oe,t=[],n=new ke({color:1318707,roughness:.75,metalness:.3});for(let s of i.masts){let r=new W(new lt(.55,.9,s.h,8),n);r.position.set(s.x,s.h/2,s.z),r.castShadow=!0,e.add(r);let o=new ue({color:de.traffic.clone().multiplyScalar(1.4)}),a=new W(new bt(1.5,.28,8,24),o);a.rotation.x=Math.PI/2,a.position.set(s.x,s.h*.82,s.z),e.add(a),t.push(o);let l=new W(new ct(.7,12,10),o);l.position.set(s.x,s.h,s.z),e.add(l)}return{root:e,beaconMats:t}}function st(i){let e=i>>>0;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var No=(i,e,t)=>i+(e-i)*t,hn=(i,e,t)=>i<e?e:i>t?t:i,hs=i=>{let e=hn(i,0,1);return e*e*(3-2*e)},ir=Math.PI/180;function M2(i){let e=t=>t.toString().padStart(2,"0");return`${e(i.getHours())}:${e(i.getMinutes())}:${e(i.getSeconds())}`}function E2(i){return i&&i.length>=5?i.substring(0,5):"--:--"}var ah=130;function b2(i){let e=new Oe,t=st(90210),n=[],s=i.fleet.filter(l=>l.cores>0),r=new ge(3.4,1.3,1.9),o=new ge(1.6,1,1.5);s.forEach((l,c)=>{let h=c/Math.max(1,s.length)*Math.PI*2+.4,u=new Oe,d=new le().setHSL(.6+t()*.08,.25,.32),f=new W(r,new ke({color:d,roughness:.55,metalness:.35}));f.position.y=.85,f.castShadow=!0,u.add(f);let p=new ue({color:2241348}),_=new W(o,p);_.position.set(-.6,1.95,0),u.add(_);let g=new ue({color:1582127}),m=new W(new ge(.5,.22,.5),g);m.position.set(.4,1.62,0),u.add(m);let v=ah+6;u.position.set(Math.cos(h)*v,0,Math.sin(h)*v),u.rotation.y=-h+Math.PI/2,e.add(u),n.push({group:u,machine:l,slotAngle:h,headMat:p})});function a(l,c){for(let h of n)if(h.machine.online){let u=h.slotAngle+c*.05,d=ah+6;h.group.position.set(Math.cos(u)*d,0,Math.sin(u)*d),h.group.rotation.y=-u+Math.PI/2,h.headMat.color.setRGB(.4,.95,.85)}else{let u=.1+.05*(.5+.5*Math.sin(c*.8+h.slotAngle*3));h.headMat.color.setRGB(u,u*1.4,u*1.6)}}return{root:e,update:a}}var S2={GM:"gaming",MD:"gaming",QT:"quant",OR:"quant",NS:"media",RV:"media",anchors:"media"},V_={gaming:16747612,quant:5020415,media:10320895,meta:16765286};function w2(i){let e=2166136261;for(let t=0;t<i.length;t++)e^=i.charCodeAt(t),e=Math.imul(e,16777619);return e>>>0}var rc=(i,e)=>i%e,T2=new Map;function sn(i,e=0){let t=i*1e3+e,n=T2.get(t);if(!n){n=new no({color:i});let s=e||new le(i).multiplyScalar(.32).getHex();n.emissive=new le(s),T2.set(t,n)}return n}function sr(i,e){if(!i)return e;let t=parseInt(i.replace("#",""),16);return Number.isFinite(t)?t:e}function W_(i,e){let t=document.createElement("canvas"),n=8,s=26,r=t.getContext("2d");r.font=`${s}px "Microsoft YaHei", sans-serif`;let o=Math.min(460,r.measureText(i).width+n*2);t.width=Math.ceil(o),t.height=s+n*2;let a=t.getContext("2d");a.font=`${s}px "Microsoft YaHei", sans-serif`,a.fillStyle="rgba(6,10,18,0.70)",a.fillRect(0,0,t.width,t.height),a.strokeStyle=e,a.lineWidth=2,a.strokeRect(1,1,t.width-2,t.height-2),a.fillStyle=e,a.textBaseline="middle",a.fillText(i,n,t.height/2);let l=new ji(t),c=new Gr(new ks({map:l,transparent:!0,depthWrite:!1})),h=.013;return c.scale.set(t.width*h,t.height*h,1),c}function X_(i,e){let n;return i<12?n=3.6:i<18?n=4.4:i<41?n=5.2:i<56?n=5:i<70?n=4.8:n=4.6,.26*n*(e?.97:1)}function Y_(i){var N,O,B;let e=new Oe,t=w2(i.id),n=Number((N=i.age)!=null?N:30),s=i.gender==="\u5973",r=n<12,o=X_(n,s)*(.96+rc(t,9)/100),a=rc(t>>10,3),l=a===0?.9:a===2?1.12:1,c=(s?.86:1)*(.92+rc(t>>3,17)/100)*l,h=sr(i.skin_c,14266762),u=sr(i.hair_c,2829104),d=sr(i.cloth_c,4877194),f=sr(i.pant_c,3814464),p=sr(i.badge_c,4906624),_=sr(i.eye_c,16765562),g=.26,m=.24*(r?1.12:1),v=o*(r?.3:.28),E=o*(r?.3:.42),y=v*.86,S=.12*(s?.92:1);for(let V of[-1,1]){let H=new W(new ge(S,E,.14),sn(f));H.position.set(V*(S*.62),E/2,0),e.add(H);let X=new W(new ge(S*1.08,.07,.19),sn(2434862));X.position.set(V*(S*.62),.035,.02),e.add(X)}let b=new W(new ge(.34*c,v,.2*l),sn(d));b.position.set(0,E+v/2,0),e.add(b);for(let V of[-1,1]){let H=new W(new ge(.085,y,.1),sn(d));H.position.set(V*(.17*c+.045),E+v-y/2+.02,0),e.add(H)}let x=.04,M=E+v+x+g/2,I=new W(new ge(m,g,.22),sn(h));I.position.set(0,M,0),e.add(I);let A=((((O=i.hair_part)!=null?O:"hair-short").includes("long")?3:0)+rc(t>>5,3))%6,L=new W(new ge(m*1.06,.07,.23),sn(u));if(L.position.set(0,M+g/2-.02,0),e.add(L),A===1){let V=new W(new ge(m*1.02,g*.95,.075),sn(u));V.position.set(0,M-.06,-.115),e.add(V)}else if(A===2)for(let V of[-1,1]){let H=new W(new ge(.055,g*1.25,.055),sn(u));H.position.set(V*(m*.52),M-.1,-.02),e.add(H)}else if(A===3){let V=new W(new ct(.075,8,6),sn(u));V.position.set(0,M+g/2+.05,-.06),e.add(V)}else if(A===4){let V=new W(new ge(m*1.18,.035,.13),sn(u));V.position.set(0,M+g/2+.01,.1),e.add(V)}else if(A===5){let V=new W(new ge(m*1.16,.1,.225),sn(u));V.position.set(0,M+g/2-.03,-.01),e.add(V)}for(let V of[-1,1]){let H=new W(new ge(.035,.035,.02),sn(_,_));H.position.set(V*.05,M+.01,.112),e.add(H)}let U=new W(new ge(.06,.06,.02),sn(p,p));U.position.set(-.09*c,E+v-.1,.105),e.add(U);let C=((B=i.faction)!=null?B:"").toLowerCase();if(C.includes("commuter")){let V=new W(new ge(.1,.14,.06),sn(3882826));V.position.set(.2*c,E+.16,.02),e.add(V)}else if(C.includes("lilong")||C.includes("\u5F04\u5802")){let V=new W(new ge(.26*c,.3,.02),sn(15262422));V.position.set(0,E+.22,.106),e.add(V)}else if(C.includes("compiled")){let V=new W(new ge(.19,.05,.02),sn(10135480));V.position.set(0,M+.01,.118),e.add(V)}else if(C.includes("newcomer")){let V=new W(new ge(.2,.22,.09),sn(3108698));V.position.set(0,E+v-.12,-.145),e.add(V)}return{g:e,h:E+v+x+g}}function R2(i,e){var f,p;let t=new Oe,n=(f=e.residents)!=null?f:[];if(!n.length)return{root:t,update:()=>{},anchors:[],setLabels:()=>{}};let s=st(20261126),r=new Map,o=[],a=[],l=[],c=0;n.forEach(_=>{var L,U,C,N,O,B,V;let g=(U=S2[(L=_.district)!=null?L:""])!=null?U:"media",m=i.districts.find(H=>H.id===g),v=m?m.cx:0,E=m?m.cz:0,y=s()*Math.PI*2,S=76+s()*28,b=v+Math.cos(y)*S,x=E+Math.sin(y)*S,{g:M,h:I}=Y_(_);M.position.set(b,0,x),M.rotation.y=Math.atan2(b-v,x-E)+w2(_.id)%60/100-.3,t.add(M),o.push(M),c+=M.children.length;let T=(C=V_[g])!=null?C:16777215,A=W_(`${(N=_.name)!=null?N:_.id}`,`#${T.toString(16).padStart(6,"0")}`);A.position.set(b,I+.72,x),t.add(A),l.push(A),r.set(_.id,new P(b,I*.75,x)),a.push({id:_.id,name:(O=_.name)!=null?O:_.id,profession:(B=_.profession)!=null?B:"",ring:(V=_.ring)!=null?V:"",pos:new P(b,I*.5,x)})});let h=(p=e.echoes)!=null?p:[],u=[],d=_=>{var v;let g=(v=S2[_!=null?_:""])!=null?v:"media",m=i.districts.find(E=>E.id===g);return m?new P(m.cx,24,m.cz):null};return h.slice(0,24).forEach((_,g)=>{var x,M,I,T;let m=r.get((x=_.owner)!=null?x:""),v=r.get((M=_.by)!=null?M:"");if(m||(m=(I=d(_.owner_d))!=null?I:void 0),v||(v=(T=d(_.by_d))!=null?T:void 0),!m||!v)return;let E=new P().addVectors(m,v).multiplyScalar(.5);E.y+=14+g%5*4;let y=new Qi(m.clone(),E,v.clone()),S=new gt().setFromPoints(y.getPoints(24)),b=new $i(S,new Ws({color:6160304,transparent:!0,opacity:.45}));t.add(b),u.push(b)}),window.__CITY_RESIDENTS__={figures:o.length,meshes:c,arcs:u.length,slots:n.length},{root:t,anchors:a,setLabels:_=>{l.forEach(g=>{g.visible=_})},update:(_,g)=>{o.forEach((m,v)=>{m.position.y=Math.sin(g*1.1+v)*.012}),u.forEach((m,v)=>{let E=m.material;E.opacity=.18+.26*(.5+.5*Math.sin(g*.9+v))})}}}var A2=de.data.clone().multiplyScalar(1.4),C2=de.data.clone().multiplyScalar(1.15),P2=de.brain.clone().multiplyScalar(1.4),I2=de.brain.clone().multiplyScalar(1.9),L2=de.capital.clone().multiplyScalar(1.35),D2=de.capital.clone().multiplyScalar(1.5),N2=de.capital.clone().multiplyScalar(2),us=new ge(1,1,1),q_=new lt(3.6,4.6,1,12),Z_=new lt(5.6,6.6,2,12),K_=new lt(1.5,1.5,1,10),J_=new lt(3,3,1,16),$_=new ct(25,32,20),j_=new ct(22.5,28,18),Q_=new ct(8,20,14),ex=new lt(.14,.9,116,8),tx=new ct(1.5,12,10),nx=new bt(25,.7,8,48),ix=new bt(22.5,.6,8,44),sx=new bt(8,.4,8,32),rx=new bt(17,.5,8,40),ox=new lt(.22,1.5,22.5,8),ax=new ct(1.5,12,10);function U2(){let i=st(59922),e=new Oe,t=new P(0,1,0),n=new ke({color:2899804,roughness:.9,metalness:.1}),s=new ke({color:2241359,roughness:.55,metalness:.35}),r=new ke({color:4743818,roughness:.3,metalness:.85}),o=new ue({color:A2.clone(),blending:$e,transparent:!0,depthWrite:!1}),a=new ue({color:C2.clone(),blending:$e,transparent:!0,depthWrite:!1}),l=new ue({color:P2.clone()}),c=new ue({color:I2.clone()}),h=66,u=2.5,d=110,f=[];for(let U=0;U<3;U++){let C=U/3*Math.PI*2+Math.PI/6,N=new P(Math.cos(C)*h,0,Math.sin(C)*h),O=new P(Math.cos(C)*u,d,Math.sin(C)*u);f.push(N);let B=O.clone().sub(N),V=new W(q_,n);V.scale.y=B.length(),V.quaternion.setFromUnitVectors(t,B.normalize()),V.position.copy(N).add(O).multiplyScalar(.5),V.castShadow=!0,e.add(V);let H=new W(Z_,n);H.position.set(N.x,1,N.z),e.add(H)}let p=72,_=h-(h-u)*(p/d);for(let U=0;U<3;U++){let C=Math.atan2(f[U].z,f[U].x),N=Math.atan2(f[(U+1)%3].z,f[(U+1)%3].x),O=new P(Math.cos(C)*_,p,Math.sin(C)*_),B=new P(Math.cos(N)*_,p,Math.sin(N)*_),V=B.clone().sub(O),H=new W(K_,n);H.scale.y=V.length(),H.quaternion.setFromUnitVectors(t,V.normalize()),H.position.copy(O).add(B).multiplyScalar(.5),e.add(H)}let g=new W($_,s);g.position.y=98,g.castShadow=!0,e.add(g);let m=new W(j_,s);m.position.y=267,m.castShadow=!0,e.add(m);let v=new W(Q_,s);v.position.y=344,v.castShadow=!0,e.add(v);let E=[],y=(U,C)=>{let N=new W(U,o);N.rotation.x=Math.PI/2,N.position.y=C,e.add(N),E.push({mesh:N,phase:i()*Math.PI*2})};y(nx,98),y(ix,267),y(sx,344);let S=95,b=352,x=b-S,M=(S+b)/2,I=new W(J_,s);I.scale.y=x,I.position.y=M,I.castShadow=!0,e.add(I);for(let U=0;U<8;U++){let C=U/8*Math.PI*2+Math.PI/8,N=new W(us,r);N.scale.set(.65,x,1.2),N.position.set(Math.cos(C)*3.55,M,Math.sin(C)*3.55),N.rotation.y=Math.PI/2-C,e.add(N);let O=C+Math.PI/8,B=new W(us,a);B.scale.set(.22,x,.34),B.position.set(Math.cos(O)*3.95,M,Math.sin(O)*3.95),B.rotation.y=Math.PI/2-O,e.add(B)}let T=new W(ex,l);T.position.y=410,e.add(T);let A=new W(tx,c);return A.position.y=468,e.add(A),{root:e,update:(U,C)=>{let N=.72+.28*Math.sin(C*1.4);o.color.copy(A2).multiplyScalar(N);for(let V of E)V.mesh.scale.setScalar(1+.02*Math.sin(C*1.4+V.phase));a.color.copy(C2).multiplyScalar(.55+.45*Math.sin(C*2.1));let O=C%2.4,B=O<.12||O>.26&&O<.38;c.color.copy(I2).multiplyScalar(B?1:.08),A.scale.setScalar(B?1.25:.85),l.color.copy(P2).multiplyScalar(.85+.15*Math.sin(C*.9))}}}function O2(){let i=st(315405),e=new Oe,t=new P(0,1,0),n=new ke({color:2767966,roughness:.72,metalness:.28}),s=new ke({color:3821688,roughness:.3,metalness:.85}),r=new ue({color:L2.clone(),blending:$e,transparent:!0,depthWrite:!1}),o=new ue({color:D2.clone(),blending:$e,transparent:!0,depthWrite:!1}),a=new ue({color:N2.clone()}),l=68,c=26,h=new W(us,n);h.scale.set(l,c,l),h.position.y=c/2,h.castShadow=!0,e.add(h);let u=(y,S,b,x,M)=>{let I=new W(us,r);I.scale.set(M,x,M),I.position.set(y,b,S),e.add(I)};for(let y=-1;y<=1;y+=2)for(let S=-1;S<=1;S+=2)u(y*(l/2-.1),S*(l/2-.1),c/2,c+1.5,1.4);let d=8,f=42.5,p=58,_=340;for(let y=0;y<d;y++){let S=p*Math.pow(.94,y),b=S/2,x=f/2+y*f,M=new W(us,n);M.scale.set(S,f,S),M.position.y=x,M.castShadow=!0,e.add(M);for(let I=-1;I<=1;I+=2)for(let T=-1;T<=1;T+=2)u(I*(b-.1),T*(b-.1),x,f+2.2,1.1)}let g=p*Math.pow(.94,d-1)/2;for(let y=0;y<5;y++){let S=_+y*11.5,b=17*(1-.16*y),x=.4-.06*y+(i()-.5)*.05,M=12.5+(i()-.5)*.8,I=2*b*Math.sin(Math.PI/8)*1.28;for(let A=0;A<8;A++){let L=A/8*Math.PI*2+Math.PI/8+(i()-.5)*.04,U=new Oe;U.position.y=S,U.rotation.y=L;let C=new W(us,s);C.scale.set(I,M,.8),C.position.set(b+M/2*Math.sin(x),M/2*Math.cos(x),0),C.rotation.z=-x,U.add(C),e.add(U)}let T=new W(rx,r);T.rotation.x=Math.PI/2,T.scale.setScalar(b/17),T.position.y=S+1,e.add(T)}for(let y=-1;y<=1;y+=2)for(let S=-1;S<=1;S+=2){let b=new P(y*g,_,S*g),x=new P(y*3.2,397.5,S*3.2),M=x.clone().sub(b),I=new W(us,r);I.scale.set(.7,M.length(),.7),I.quaternion.setFromUnitVectors(t,M.normalize()),I.position.copy(b).add(x).multiplyScalar(.5),e.add(I)}let m=new W(ox,o);m.position.y=397+22.5/2,e.add(m);let v=new W(ax,a);return v.position.y=419.2,e.add(v),{root:e,update:(y,S)=>{let b=.5+.5*Math.sin(S*1.1);a.color.copy(N2).multiplyScalar(1+.9*b),v.scale.setScalar(.9+.3*b),o.color.copy(D2).multiplyScalar(.8+.35*Math.sin(S*1.1+.7)),r.color.copy(L2).multiplyScalar(.88+.16*Math.sin(S*.8+2.1))}}}var H2=new ge(1,1,1),Oi=18,ds=35,Uo=.14,ch=42/(1+Uo),hh=22.5/(1+Uo),F2=Math.PI*2/3,uh=Oi*ds,B2=i=>No(ch,hh,i/uh);function lx(i,e){let t=new lt(i,e,ds,72,1,!0),n=t.attributes.position;for(let s=0;s<n.count;s++){let r=n.getX(s),o=n.getZ(s),a=1+Uo*Math.cos(3*Math.atan2(r,o));n.setX(s,r*a),n.setZ(s,o*a)}return t.computeVertexNormals(),t}var z2=[];for(let i=0;i<Oi;i++)z2.push(lx(No(ch,hh,(i+1)/Oi),No(ch,hh,i/Oi)));var cx=new lt(14,26,630,20),hx=new bt(23.5,1.5,10,48);function G2(){let i=new Oe;i.name="landmark-shanghai-tower";let e=st(6233633),t=new ke({color:1320511,transparent:!0,opacity:.55,metalness:.6,roughness:.22,side:Dt,depthWrite:!1}),n=new ke({color:1847376,roughness:.85,metalness:.15}),s=new ue({color:de.brain.clone().multiplyScalar(1.35)}),r=new ue({color:de.data.clone().multiplyScalar(1.5)});for(let u=0;u<Oi;u++){let d=new W(z2[u],t);d.position.y=u*ds+ds/2,d.rotation.y=u/Oi*F2,d.castShadow=!0,i.add(d)}let o=new W(cx,n);o.position.y=uh/2,o.castShadow=!0,i.add(o);for(let u=0;u<Oi;u++){let d=u/Oi*F2,f=u*ds;for(let p=0;p<3;p++){let _=d+p*Math.PI*2/3,g=Math.sin(_),m=Math.cos(_),v=B2(f)*(1+Uo)+.25,E=B2(f+ds)*(1+Uo)+.25,y=new P(g*v,f,m*v),S=new P(g*E,f+ds,m*E),b=new P().subVectors(S,y),x=new W(H2,s);x.scale.set(.85+.3*e(),b.length()+.8,.55),x.position.copy(y).add(S).multiplyScalar(.5);let M=b.clone().normalize(),I=new P(m,0,-g),T=new P().crossVectors(I,M).normalize(),A=new P().crossVectors(M,T);x.quaternion.setFromRotationMatrix(new Xe().makeBasis(A,M,T)),i.add(x)}}let a=new W(hx,r);a.rotation.x=Math.PI/2,a.position.y=uh+.5,i.add(a);let l=s.color.clone(),c=r.color.clone();return{root:i,update:(u,d)=>{s.color.copy(l).multiplyScalar(.8+.26*Math.sin(d*.9));let f=.62+.5*Math.sin(d*1.7);r.color.copy(c).multiplyScalar(f),a.scale.setScalar(1+.03*Math.sin(d*1.7))}}}var Fi=486,Oo=436,lh=58,ux=24;var dx=[[.15,0],[29,0],[20,Fi],[11,Fi],[15,Oo],[.15,Oo]],fx=[[-.15,0],[-.15,Oo],[-15,Oo],[-11,Fi],[-20,Fi],[-29,0]];function k2(i){let e=new qn;e.moveTo(i[0][0],i[0][1]);for(let r=1;r<i.length;r++)e.lineTo(i[r][0],i[r][1]);e.closePath();let t=new di(e,{depth:lh,bevelEnabled:!1}),n=t.attributes.position,s=ux/lh;for(let r=0;r<n.count;r++){let o=No(1,s,n.getY(r)/Fi);n.setZ(r,(n.getZ(r)-lh/2)*o)}return t.computeVertexNormals(),t}var px=k2(dx),mx=k2(fx),gx=new ge(30,6,25),_x=new ge(2.4,56,7.5),xx=new ct(1.5,14,10);function V2(){let i=new Oe;i.name="landmark-swfc";let e=st(3943834),t=new ke({color:2900070,roughness:.3,metalness:.55}),n=new ue({color:de.capital.clone().multiplyScalar(1.3)}),s=new ue({color:new le(1.1,1.1,1.25)});for(let u of[px,mx]){let d=new W(u,t);d.castShadow=!0,i.add(d)}let r=new W(gx,t);r.position.y=Fi+3,r.castShadow=!0,i.add(r);let o=new W(_x,t);o.position.set(2,461,0),o.rotation.z=Math.atan2(26,48),o.castShadow=!0,i.add(o);let a=(u,d,f,p,_,g)=>{let m=new W(H2,n);m.scale.set(u*(.95+.1*e()),d,f),m.position.set(p,_,0),m.rotation.z=g,i.add(m)};a(31.2,1,28.3,0,Oo+.3,0),a(23.2,1,24.8,0,Fi+.3,0),a(1,51.4,26.3,13,461,.08),a(1,51.4,26.3,-13,461,-.08);let l=new W(xx,s);l.position.y=Fi+7.2,i.add(l);let c=n.color.clone();return{root:i,update:(u,d)=>{n.color.copy(c).multiplyScalar(.84+.16*Math.sin(d*.55))}}}var ac=new ke({color:2241614,roughness:.85,metalness:.15}),W2=new ke({color:2900584,roughness:.4,metalness:.45,emissive:de.traffic,emissiveIntensity:.22}),rr=new ke({color:2766928,roughness:.6,metalness:.45}),dh=new ue({color:de.traffic.clone().multiplyScalar(1.25)}),oc=new ue({color:de.traffic.clone().multiplyScalar(1.35)}),X2=new ue({color:de.data.clone().multiplyScalar(1.3)}),Y2=new ue({color:de.capital.clone().multiplyScalar(1.2)});function q2(){let i=new Oe;i.name="whiteMagnolia";let e=st(11326),t=12,n=270,s=55,r=32,o=new W(new ge(64,t,64),ac);o.position.y=t/2,o.castShadow=!0,i.add(o);let a=new W(new lt(r/Math.SQRT2,s/Math.SQRT2,n-t,4,1),ac);a.rotation.y=Math.PI/4,a.position.y=(t+n)/2,a.castShadow=!0,i.add(a);let l=s/2,c=r/2,h=new P(0,1,0),u=Math.hypot(n-t,(l-c)*Math.SQRT2),d=new ge(1.2,u,1.2);for(let b of[-1,1])for(let x of[-1,1]){let M=new W(d,dh),I=new P(b*(c-l),n-t,x*(c-l));M.quaternion.setFromUnitVectors(h,I.normalize()),M.position.set(b*(l+c)/2,(t+n)/2,x*(l+c)/2),i.add(M)}let f=140,p=(f-t)/(n-t),_=new W(new bt((s+(r-s)*p)/Math.SQRT2+.4,.9,8,48),dh);_.rotation.x=Math.PI/2,_.position.y=f,i.add(_);let g=new W(new ge(30,7,30),ac);g.position.y=273.5,i.add(g);let m=5;for(let b=0;b<m;b++){let x=52+e()*4,M=12+e()*2.5,I=(29+e()*5)*ir,T=new Oe;T.rotation.y=b/m*Math.PI*2+.35,T.position.y=271,i.add(T);let A=new qn;A.moveTo(0,0),A.quadraticCurveTo(M,x*.22,M*.55,x*.6),A.quadraticCurveTo(M*.28,x*.88,0,x),A.quadraticCurveTo(-M*.28,x*.88,-M*.55,x*.6),A.quadraticCurveTo(-M,x*.22,0,0);let L=new W(new di(A,{depth:2.4,bevelEnabled:!1,curveSegments:12}),W2);L.rotation.x=I,L.position.z=6,T.add(L);let U=new W(new ge(.9,x*.78,.5),oc);U.position.set(0,x*.58,3),L.add(U)}let v=new W(new fi(4.2,1),oc);v.position.y=291,i.add(v);let E=new W(new bt(7.5,.55,8,40),oc);E.rotation.x=Math.PI/2,E.position.y=287,i.add(E);let y=0;return{root:i,update:(b,x)=>{let M=.5+.5*Math.sin(x*1.6);oc.color.copy(de.traffic).multiplyScalar(1.1+M*.55),W2.emissiveIntensity=.18+M*.3;let I=Math.pow(Math.max(0,Math.sin(x*2.3+.8)),3);y+=(I-y)*Math.min(1,b*9),v.scale.setScalar(.85+y*.45),E.scale.setScalar(.9+y*.28);let T=.5+.5*Math.sin(x*.7+2.1);dh.color.copy(de.traffic).multiplyScalar(1+T*.4)}}}function Z2(){let i=new Oe;i.name="waibaiduBridge";let e=st(21204),t=52,n=2,s=t*n,r=10,o=1.5,a=14,l=11,c=6.5,h=6.6,u=r+.4,d=u+l,f=new W(new ge(s,o,a),rr);f.position.y=r-o/2,f.castShadow=!0,i.add(f);let p=new ge(t,1,1),_=new ge(.7,l,.7),g=Math.hypot(c,l),m=new ge(g,.55,.55),v=Math.atan2(l,c);for(let x=0;x<n;x++){let M=-s/2+x*t,I=M+t/2;for(let T of[-h,h]){for(let A of[u,d]){let L=new W(p,rr);L.position.set(I,A,T),i.add(L)}for(let A=0;A<=t/c;A++){if(x===1&&A===0)continue;let L=new W(_,rr);L.position.set(M+A*c,(u+d)/2,T),i.add(L)}for(let A=0;A<t/c;A++){let L=M+(A+.5)*c;for(let U of[1,-1]){let C=new W(m,rr);C.position.set(L,(u+d)/2,T),C.rotation.z=U*v,i.add(C)}}}}for(let x of[-1,1]){let M=17.5+e()*1.5,I=x*(s/2-.5);for(let A of[-h,h]){let L=new W(new ge(1.8,M,1.8),rr);L.position.set(I,r-1+M/2,A),L.castShadow=!0,i.add(L)}let T=new W(new ge(2.4,2.4,h*2+2.2),rr);T.position.set(I,r-1+M-1.2,0),T.castShadow=!0,i.add(T)}let E=new ge(5.5,r-o,12);for(let x of[0,-(s/2)+3,s/2-3]){let M=new W(E,ac);M.position.set(x,(r-o)/2,0),M.castShadow=!0,i.add(M)}let y=new ge(s,.4,.4);for(let x of[-h-.75,h+.75])for(let M of[u,d]){let I=new W(y,X2);I.position.set(0,M,x),i.add(I)}let S=new ge(s,.5,.5);for(let x of[-(a/2+.25),a/2+.25]){let M=new W(S,Y2);M.position.set(0,r+.3,x),i.add(M)}return{root:i,update:(x,M)=>{let I=.5+.5*Math.sin(M*1.1);Y2.color.copy(de.capital).multiplyScalar(.95+I*.3);let T=.5+.5*Math.sin(M*.5+2.6);X2.color.copy(de.data).multiplyScalar(1.05+T*.3)}}}var yx=`
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,vx=`
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;
varying vec3 vPos;
void main() {
  float h = normalize(vPos + vec3(0.0, offset, 0.0)).y;
  float t = pow(max(h, 0.0), exponent);
  gl_FragColor = vec4(mix(bottomColor, topColor, t), 1.0);
}`;function K2(){let i={topColor:{value:new le(263694)},bottomColor:{value:new le(66e4)},offset:{value:120},exponent:{value:.7}},e=new Tt({uniforms:i,vertexShader:yx,fragmentShader:vx,side:Wt,depthWrite:!1,fog:!1}),t=new W(new ct(880,24,16),e);t.frustumCulled=!1;let n=900,s=new Float32Array(n*3),o=1234567,a=()=>(o=o*1103515245+12345&2147483647,o/2147483647);for(let u=0;u<n;u++){let d=a()*Math.PI*2,f=Math.acos(a()*.85+.1),p=820;s[u*3]=p*Math.sin(f)*Math.cos(d),s[u*3+1]=Math.abs(p*Math.cos(f)),s[u*3+2]=p*Math.sin(f)*Math.sin(d)}let l=new gt;l.setAttribute("position",new Ft(s,3));let c=new Yn({color:13623551,size:1.6,sizeAttenuation:!1,transparent:!0,opacity:.9,depthWrite:!1,fog:!1}),h=new ci(l,c);return h.frustumCulled=!1,{mesh:t,uniforms:i,stars:h,starMat:c}}var lc=class{constructor(e,t,n,s,r){this.bodyMat=null;this.groundMat=null;this.breathBoost=0;this.zoneGain=new Map;this.realMats=new Map;this.waterMat=null;this.flowMats=[];this.dustMat=null;this.scene=e,this.sun=t,this.hemi=n,this.sky=s,this.data=r;let o=r.reality.beijing_hhmm||"12:00",[a,l]=o.split(":").map(c=>parseInt(c,10)||0);this.baseHour=a+l/60,this.basePerf=performance.now(),this.fog=new Or(329743,16e-5),e.fog=this.fog;for(let c of r.zones)this.zoneGain.set(c.id,.45+.55*Math.min(1,Math.max(0,c.activity)))}attachMaterials(e,t){this.bodyMat=e,this.groundMat=t}hour(){let e=(performance.now()-this.basePerf)/36e5;return(this.baseHour+e)%24}label(){return p2(this.hour())}update(){var l,c,h;let e=this.hour(),t=f2(e);this.sky.uniforms.topColor.value.copy(t.skyTop),this.sky.uniforms.bottomColor.value.copy(t.skyBottom),this.fog.color.copy(t.fog),this.sky.starMat.opacity=t.starOpacity;let n=(e-6)/12,s,r,o;n>=0&&n<=1?(s=Math.cos(Math.PI*(1-n))*500,r=Math.max(40,Math.sin(Math.PI*n)*500),o=220):(s=-300,r=420,o=-260),this.sun.position.set(s,r,o),this.sun.color.copy(t.sunColor),this.sun.intensity=t.sunIntensity,this.hemi.color.copy(t.hemiSky),this.hemi.groundColor.copy(t.hemiGround),this.hemi.intensity=t.hemiIntensity;let a=this.breathBoost;for(let[u,d]of this.realMats){let f=(l=this.zoneGain.get(u))!=null?l:.5;d.uniforms.uWinGain.value=Math.max(.3,t.windowGain*f*1.8),d.uniforms.uBreath.value=a,d.uniforms.uBodyGain.value=t.bodyGain*.9+.55}this.waterMat&&(this.waterMat.uniforms.uTime.value=performance.now()/1e3);for(let u of this.flowMats){let d=u.userData.flowColor;u.color.copy(d).multiplyScalar(.55+.85*t.windowGain+a*.5)}(c=this.bodyMat)==null||c.color.setScalar(t.bodyGain),(h=this.groundMat)==null||h.color.copy(t.groundColor),this.dustMat&&(this.dustMat.opacity=.5*t.streetGain),this.breathBoost=Math.max(0,this.breathBoost-.0035)}};function J2(i,e){let t=st(4242),n=e.census_total||1e4,s=620,r=new Float32Array(s*3);for(let c=0;c<s;c++){let h=i.districts[Math.floor(t()*i.districts.length)],u=t()*Math.PI*2,d=80+t()*330;r[c*3]=h.cx+Math.cos(u)*d,r[c*3+1]=3+t()*45,r[c*3+2]=h.cz+Math.sin(u)*d}let o=new gt;o.setAttribute("position",new Ft(r,3));let a=new Yn({color:8251608,size:3.4,sizeAttenuation:!0,transparent:!0,opacity:.4,depthWrite:!1,blending:$e,fog:!0}),l=new ci(o,a);return l.frustumCulled=!1,{points:l,mat:a}}var cc=class{constructor(e,t,n,s,r){this.dots=[];this.queue=[];this.crownPulse=0;this.beamT0=-999;this.hooks={};this.plan=t,this.tower=n,this.daynight=s,this.tower.beamMat.userData.t0=-999;let o=new ct(4.2,10,8);for(let l=0;l<18;l++){let c=new ue({color:16777215}),h=new W(o,c);h.visible=!1,e.add(h),this.dots.push({mesh:h,active:!1,t0:0,dur:8,from:new P,ctrl:new P,to:new P})}r.slice(-42).forEach((l,c)=>{this.queue.push({e:l,at:2+c*1.85})})}spawn(e,t){var h;let n=this.dots.find(u=>!u.active);if(!n)return;let s=e!=null?e:"governance",r=this.tower.root.position.clone(),o=this.plan.districts.find(u=>u.id===s);o&&(r=new P(o.cx,30,o.cz));let a=this.tower.root.position.clone();a.y+=150;let l=r.clone().lerp(a,.5);l.y=Math.max(r.y,a.y)+160,n.active=!0,n.t0=t,n.dur=8.5,n.from.copy(r),n.ctrl.copy(l),n.to.copy(a);let c=(h=Sn[s])!=null?h:Sn.governance;n.mesh.material.color.copy(c).multiplyScalar(1.7),n.mesh.visible=!0}ceoPulse(e){this.crownPulse=Math.min(1.4,this.crownPulse+1),this.beamT0=e}update(e){var o,a;for(;this.queue.length>0&&this.queue[0].at<=e;){let c=this.queue.shift().e;(a=(o=this.hooks).onEvent)==null||a.call(o,c,e),c.type==="CEO_ORDER"||c.type==="DECISION_MADE"||c.type==="DECISION_OVERRULED"?this.ceoPulse(e):c.type==="OS_TICK_START"||c.type==="OS_TICK_DONE"?this.daynight.breathBoost=Math.min(.35,this.daynight.breathBoost+.22):c.type==="TRANSFER"||this.spawn(c.zone,e)}let t=new P;for(let l of this.dots){if(!l.active)continue;let c=(e-l.t0)/l.dur;if(c>=1){l.active=!1,l.mesh.visible=!1,this.crownPulse=Math.min(.9,this.crownPulse+.25);continue}let h=c*c*(3-2*c),u=l.from,d=l.ctrl,f=l.to;t.set((1-h)*(1-h)*u.x+2*(1-h)*h*d.x+h*h*f.x,(1-h)*(1-h)*u.y+2*(1-h)*h*d.y+h*h*f.y,(1-h)*(1-h)*u.z+2*(1-h)*h*d.z+h*h*f.z),l.mesh.position.copy(t)}let n=e-this.beamT0;this.tower.beamMat.opacity=n<2.4?Math.max(0,1-n/2.4)*.55:0;let s=this.crownPulse;this.tower.crownMat.color.setRGB(1.15+s*1.1,1.15+s*1.1,1.25+s*1.1),this.crownPulse=Math.max(0,this.crownPulse-.02);let r=.5+.5*Math.sin(e*1.4);this.tower.coreMat.color.setRGB(.38+.1*r,.65+.14*r,1+.22*r),this.tower.cortexGroup.rotation.y=e*.12}};var Mx=12,Ex=150,$2=9.4,bx=.85,j2={gaming:de.data,quant:de.capital,media:de.traffic};function Q2(i){let e=new Oe,t=new ge(20,1.1,1.1),n=[];for(let a=0;a<Mx;a++){let l=new ue({color:16777215,transparent:!0,opacity:0,depthWrite:!1,blending:$e}),c=new W(t,l);c.visible=!1,e.add(c),n.push({mesh:c,mat:l,active:!1,progress:0,len:1,from:new P,to:new P})}let s=a=>{a.active=!1,a.mat.opacity=0,a.mesh.visible=!1};return{root:e,pushEvent:a=>{var u;if(a.type!=="TRANSFER")return;let l=n.find(d=>!d.active);if(!l)return;let c=(u=a.zone)!=null?u:"gaming";j2[c]||(c="gaming");let h=i.arteries.find(d=>d.district===c);h&&(l.from.set(h.x1,$2,h.z1),l.to.set(h.x0,$2,h.z0),l.len=l.from.distanceTo(l.to),!(l.len<1e-4)&&(l.progress=0,l.active=!0,l.mesh.rotation.y=Math.atan2(-(h.z0-h.z1),h.x0-h.x1),l.mat.color.copy(j2[c]),l.mat.opacity=bx,l.mesh.visible=!0,l.mesh.position.copy(l.from)))},update:(a,l)=>{for(let c of n)if(c.active){if(c.progress+=a*Ex/c.len,c.progress>=1){s(c);continue}c.mesh.position.copy(c.from).lerp(c.to,c.progress)}}}}var fs=300,Sx=new ge(8,2.2,4),ef=new ge(2.5,.5,3.5),Tx=new ke({color:16777215,roughness:.55,metalness:.35}),wx=new ue({color:16773824}),Rx=9.05,Ax=new Xe().makeTranslation(2.8,.35,0),Cx=new Xe().makeTranslation(-2.8,.35,0),Px=new ue({color:16726832}),tf=5,or=new Xe().makeScale(0,0,0),Ix={gaming:1718837,quant:3813914,media:3807790},Lx=1843755;function Dx(i){return i>=7&&i<9||i>=17&&i<19?{speed:60,density:1}:i>=9&&i<17?{speed:45,density:.6}:{speed:30,density:.08}}function nf(i){var f;let e=new Oe,t=[];for(let p of i.arteries){let _=p.x0-p.x1,g=p.z0-p.z1,m=Math.hypot(_,g);if(m<1)continue;let v=_/m,E=g/m;t.push({district:p.district,fx:p.x1,fz:p.z1,dx:v,dz:E,len:m,ox:-E*tf,oz:v*tf,heading:Math.atan2(-E,v),start:0,count:0,target:0})}if(t.length===0)return{root:e,update:()=>{}};let n=st(774411),s=new _t(Sx,Tx,fs);s.instanceMatrix.setUsage(zn),s.frustumCulled=!1,s.castShadow=!1,e.add(s);let r=new _t(ef,wx,fs);r.instanceMatrix.setUsage(zn),r.frustumCulled=!1,e.add(r);let o=new _t(ef,Px,fs);o.instanceMatrix.setUsage(zn),o.frustumCulled=!1,e.add(o);let a=[],l=new le,c=-1;for(let p=0;p<fs;p++){let _=Math.min(t.length-1,Math.floor(p/fs*t.length)),g=t[_];_!==c&&(g.start=p,c=_),g.count++;let m=g.count%2===1;a.push({lane:_,forward:m,progress:n(),heading:g.heading+(m?0:Math.PI)}),l.setHex((f=Ix[g.district])!=null?f:Lx),s.setColorAt(p,l)}s.instanceColor&&(s.instanceColor.needsUpdate=!0);for(let p=0;p<fs;p++)s.setMatrixAt(p,or),r.setMatrixAt(p,or),o.setMatrixAt(p,or);let h=new vt,u=new Xe;function d(p,_,g){let{speed:m,density:v}=Dx(g);for(let E of t)E.target=hn(Math.round(E.count*v),0,E.count);for(let E=0;E<fs;E++){let y=a[E],S=t[y.lane];if(y.progress=(y.progress+p*m/S.len)%1,E-S.start>=S.target){s.setMatrixAt(E,or),r.setMatrixAt(E,or),o.setMatrixAt(E,or);continue}let b=y.forward?y.progress:1-y.progress,x=y.forward?0:S.ox,M=y.forward?0:S.oz;h.position.set(S.fx+S.dx*b*S.len+x,Rx,S.fz+S.dz*b*S.len+M),h.rotation.set(0,y.heading,0),h.scale.setScalar(1),h.updateMatrix(),s.setMatrixAt(E,h.matrix),u.multiplyMatrices(h.matrix,Ax),r.setMatrixAt(E,u),u.multiplyMatrices(h.matrix,Cx),o.setMatrixAt(E,u)}s.instanceMatrix.needsUpdate=!0,r.instanceMatrix.needsUpdate=!0,o.instanceMatrix.needsUpdate=!0}return{root:e,update:d}}var sf=new lt(.4,.9,26,6);sf.translate(0,13,0);var Nx=26,Ux=new ct(1.1,8,6),Ox=.6,hc=[{x:1215.4,z:1033.5,roofY:632},{x:1110.3,z:847.8,roofY:492},{x:454.9,z:368.1,roofY:468},{x:1032.7,z:613.5,roofY:420.5},{x:-471.1,z:-624.6,roofY:295},{x:-856.6,z:-195.2,roofY:27.7},{x:261.4,z:432.7,roofY:259.9},{x:1000.7,z:19.2,roofY:256},{x:175.9,z:490.6,roofY:249.9},{x:377.3,z:757.6,roofY:238},{x:1101.2,z:28.6,roofY:238},{x:659.7,z:-143.8,roofY:230},{x:880.8,z:-137.1,roofY:216},{x:973.6,z:-154.9,roofY:216},{x:996.7,z:731.5,roofY:210},{x:391.8,z:862,roofY:200}];function rf(){let i=new Oe;i.name="rooftops";let e=new ke({color:1845302,roughness:.8,metalness:.3}),t=new ue({color:16729156}),n=new _t(sf,e,hc.length),s=new _t(Ux,t,hc.length),r=new Xe;for(let a=0;a<hc.length;a++){let l=hc[a];r.makeTranslation(l.x,l.roofY,l.z),n.setMatrixAt(a,r),r.makeTranslation(l.x,l.roofY+Nx,l.z),s.setMatrixAt(a,r)}return n.instanceMatrix.needsUpdate=!0,s.instanceMatrix.needsUpdate=!0,n.frustumCulled=!1,s.frustumCulled=!1,i.add(n,s),{root:i,update:(a,l)=>{Math.sin(l/Ox*Math.PI*4)>0?t.color.setRGB(3.2,.5,.5):t.color.setRGB(.35,.06,.06)}}}var Fx=[[31.218,121.489],[31.226,121.4908],[31.231,121.493],[31.234,121.4965],[31.236,121.5],[31.239,121.503],[31.243,121.5018],[31.248,121.502],[31.254,121.5035],[31.26,121.5065],[31.266,121.51],[31.272,121.5145]],of=230,af=60,lf=30,cf=80,hf=.1,Bx=.22,Hx=.06,zx=.6,Gx=.15,kx=.9,uf=new gn(3.2,14);uf.translate(0,7,0);var Vx=de.capital.clone(),Wx=de.data.clone(),Xx=de.traffic.clone(),Yx=[{id:"gold",color:Vx},{id:"cyan",color:Wx},{id:"magenta",color:Xx}];function df(){let i=st(31415),e=new Oe,t=Fx.map(([d,f])=>({lat:d,x:Bt(f),z:Ht(d)})),n=[0];for(let d=0;d<t.length-1;d++)n.push(n[d]+Math.hypot(t[d+1].x-t[d].x,t[d+1].z-t[d].z));let s=n[n.length-1],r=d=>{let f=0;for(;f<t.length-2&&d>n[f+1];)f++;let p=n[f+1]-n[f],_=p>0?(d-n[f])/p:0,g=t[f+1].x-t[f].x,m=t[f+1].z-t[f].z,v=Math.hypot(g,m)||1;return{x:t[f].x+g*_,z:t[f].z+m*_,lat:t[f].lat+(t[f+1].lat-t[f].lat)*_,tx:g/v,tz:m/v}},o=(d,f)=>{let p=1/0,_=0,g=0;for(let m=0;m<t.length-1;m++){let v=t[m].x,E=t[m].z,y=t[m+1].x-v,S=t[m+1].z-E,b=y*y+S*S||1,x=Math.min(1,Math.max(0,((d-v)*y+(f-E)*S)/b)),M=v+y*x,I=E+S*x,T=(d-M)*(d-M)+(f-I)*(f-I);T<p&&(p=T,_=M,g=I)}return{px:_,pz:g}},a={gold:[],cyan:[],magenta:[]};for(let d of[1,-1])for(let f=0;f<af;f++){let p=(f+i())/af*s,_=r(p),g=-_.tz,m=_.tx,v=lf+i()*(cf-lf),E=(of-v)*d,y=_.x+g*E,S=_.z+m*E,b=o(y,S),x=y-b.px,M=S-b.pz,I=Math.hypot(x,M),T=of-cf;I<T&&I>1e-6&&(y=b.px+x/I*T,S=b.pz+M/I*T);let A=d>0?"gold":"magenta";a[A].push({x:y,z:S,heading:Math.atan2(-_.tz,_.tx),tilt:(i()*2-1)*Hx,base:hf+i()*(Bx-hf),phase:i()*Math.PI*2})}let l=new vt;l.rotation.order="YXZ";let c=new le,h=[];for(let d of Yx){let f=a[d.id],p=new ue({color:d.color,blending:$e,transparent:!0,depthWrite:!1,side:Dt,fog:!0}),_=new _t(uf,p,f.length),g=new Float32Array(f.length),m=new Float32Array(f.length);for(let v=0;v<f.length;v++){let E=f[v];l.position.set(E.x,zx,E.z),l.rotation.set(E.tilt,E.heading,0),l.updateMatrix(),_.setMatrixAt(v,l.matrix),g[v]=E.base,m[v]=E.phase,c.setScalar(E.base),_.setColorAt(v,c)}_.instanceMatrix.needsUpdate=!0,_.frustumCulled=!1,_.renderOrder=2,e.add(_),h.push({mesh:_,bases:g,phases:m})}return{root:e,update:(d,f)=>{for(let p of h){for(let _=0;_<p.bases.length;_++){let g=p.bases[_]*(1+Gx*Math.sin(f*kx+p.phases[_]));c.setScalar(g),p.mesh.setColorAt(_,c)}p.mesh.instanceColor&&(p.mesh.instanceColor.needsUpdate=!0)}}}}var qx=new bt(7,.9),Zx=new bt(70,2.2,8,64),Kx=new ui(2.6,6),Jx=new ct(.5,8,6),$x=new ge(1.2,60,1.2),jx=new gn(300,110),Qx=new P(0,1,0),e5=new P(0,0,1),fh=new P,t5=90,n5=60,i5=.1,s5=280;function ff(i,e){let t=i.attributes.position.count,n=new Float32Array(t*3);for(let s=0;s<t;s++)n[s*3+0]=e.r,n[s*3+1]=e.g,n[s*3+2]=e.b;return i.setAttribute("color",new Ft(n,3)),i}var r5=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,o5=`
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
`;function pf(i){var h;let e=st(5150),t=new Oe;t.name="sky-transit";let n=new ue({vertexColors:!0,blending:$e,transparent:!0,opacity:.22,depthWrite:!1}),s=new ue({color:1713203}),r=new ue({color:new le(16773836).multiplyScalar(2.2)}),o=[],a=[],l=null;for(let u of i.districts){let d=(h=Sn[u.id])!=null?h:de.data,f=new ue({color:d.clone().multiplyScalar(1.3)}),p=i.arteries.find(S=>S.district===u.id),_=p?p.x0:0,g=p?p.z0:0;if(Math.hypot(_-u.cx,g-u.cz)>200){let S=140+e()*30,b=104+e()*16,x=76+e()*12,M=N=>u.cx+(_-u.cx)*N,I=N=>u.cz+(g-u.cz)*N,T=new Ci([new P(M(0),b,I(0)),new P(M(.28),S-18,I(.28)),new P(M(.5),S,I(.5)),new P(M(.72),S-18,I(.72)),new P(M(1),x,I(1))]),A=T.getLength(),L=new ts(T,48,6,8,!1);ff(L,d),t.add(new W(L,n));let U=Math.max(2,Math.round(A/n5));for(let N=0;N<U;N++){let O=N/U,B=new W(qx,f);B.position.copy(T.getPointAt(O)),B.quaternion.setFromUnitVectors(e5,T.getTangentAt(O,fh)),t.add(B)}let C=[];for(let N=0;N<3;N++){let O=new W(Kx,s),B=new W(Jx,r);B.position.set(0,5.9,0),O.add(B),t.add(O),C.push({mesh:O,progress:N/3+e()*.05})}o.push({curve:T,len:A,pods:C})}if(u.id==="quant"){l=new Tt({uniforms:{uTime:{value:0},uGold:{value:de.capital.clone()},uRed:{value:de.warn.clone()}},vertexShader:r5,fragmentShader:o5,transparent:!0,blending:$e,depthWrite:!1,side:Dt});let S=new W(jx,l);S.position.set(u.cx,s5,u.cz),S.rotation.y=Math.atan2(_-u.cx,g-u.cz),t.add(S)}let v=new Oe;v.position.set(u.cx,380+e()*50,u.cz);let E=new W(Zx,f);E.rotation.x=Math.PI/2,v.add(E);let y=ff($x.clone(),d);for(let S=0;S<4;S++){let b=S/4*Math.PI*2+Math.PI/4,x=new W(y,n);x.position.set(Math.cos(b)*70,-30,Math.sin(b)*70),v.add(x)}t.add(v),a.push(v)}return{root:t,update:(u,d)=>{for(let f of o)for(let p of f.pods)p.progress=(p.progress+u*t5/f.len)%1,f.curve.getPointAt(p.progress,p.mesh.position),f.curve.getTangentAt(p.progress,fh),p.mesh.quaternion.setFromUnitVectors(Qx,fh);for(let f of a)f.rotation.y+=u*i5;l&&(l.uniforms.uTime.value=d)}}}var Ef=4.2,bf=new lt(.35,.5,Ef,6);bf.translate(0,2.1,0);var a5=new fi(2.2,0),Sf=9,Tf=new lt(.18,.26,Sf,6);Tf.translate(0,4.5,0);var l5=new ct(.55,8,6),wf=new ge(6,3,14);wf.translate(0,1.5,0);var Rf=new ge(6.5,.4,15);Rf.translate(0,3.2,0);var Af=new ge(.7,5,.7);Af.translate(0,2.5,0);var Cf=new ge(4,.9,1.4);Cf.translate(0,.45,0);var c5=6161,mf=90,gf=60,ph=8,_f=24,xf=95,h5=310,yf=.8,u5=1.3,vf=98,d5=305,f5=132,uc=[112,178,244],Mf=new le(16767392).multiplyScalar(1.3),p5=9,m5=.1,g5=new P(0,1,0);function Pf(i){let e=new Oe;e.name="blockDetails";let t=st(c5),n=i.districts,s=n.length*mf,r=n.length*gf,o=n.length*ph,a=n.length*_f,l=new ke({color:2760728,roughness:.95,metalness:0}),c=new ke({color:1854004,roughness:.9,metalness:0,flatShading:!0}),h=new ke({color:2237998,roughness:.7,metalness:.35}),u=new ue({color:Mf}),d=new ue({color:de.data,transparent:!0,opacity:.3,side:Dt,depthWrite:!1}),f=new ue({color:de.traffic,transparent:!0,opacity:.5,blending:$e,depthWrite:!1}),p=new ke({color:2306120,roughness:.85,metalness:.05}),_=new _t(bf,l,s),g=new _t(a5,c,s),m=new _t(Tf,h,r),v=new _t(l5,u,r),E=new _t(wf,d,o),y=new _t(Rf,h,o),S=new _t(Af,f,o),b=new _t(Cf,p,a);_.name="blockTreesTrunks",g.name="blockTreesCrowns",m.name="blockLampPoles",v.name="blockLampBulbs",E.name="blockStopGlass",y.name="blockStopRoofs",S.name="blockStopSigns",b.name="blockBenches";let x=new Xe,M=new P,I=new Vt,T=new P,A=(H,X,J,j,ce,k,Q)=>{M.set(J,j,ce),I.setFromAxisAngle(g5,k),T.setScalar(Q),x.compose(M,I,T),H.setMatrixAt(X,x)},L=0,U=0,C=0,N=0,O=gf/uc.length;for(let H of n){for(let X=0;X<mf;X++,L++){let J=t()*Math.PI*2,j=xf+t()*(h5-xf),ce=H.cx+Math.cos(J)*j,k=H.cz+Math.sin(J)*j,Q=yf+t()*(u5-yf),ae=t()*Math.PI*2;A(_,L,ce,0,k,ae,Q),A(g,L,ce,Ef*Q,k,ae,Q)}for(let X=0;X<uc.length;X++){let J=uc[X];for(let j=0;j<O;j++,U++){let ce=(j+X/uc.length)/O*Math.PI*2+(t()-.5)*.08,k=J+(t()-.5)*12,Q=H.cx+Math.cos(ce)*k,ae=H.cz+Math.sin(ce)*k;A(m,U,Q,0,ae,0,1),A(v,U,Q,Sf,ae,0,1)}}for(let X=0;X<ph;X++,C++){let J=X/ph*Math.PI*2+(t()-.5)*.2,j=f5+(t()-.5)*16,ce=H.cx+Math.cos(J)*j,k=H.cz+Math.sin(J)*j,Q=-J;A(E,C,ce,0,k,Q,1),A(y,C,ce,0,k,Q,1);let ae=3.6,Pe=5.9,he=ce+ae*Math.cos(J)-Pe*Math.sin(J),De=k+ae*Math.sin(J)+Pe*Math.cos(J);A(S,C,he,0,De,0,1)}for(let X=0;X<_f;X++,N++){let J=t()*Math.PI*2,j=vf+t()*(d5-vf),ce=H.cx+Math.cos(J)*j,k=H.cz+Math.sin(J)*j,Q=-J-Math.PI/2+(t()-.5)*.6;A(b,N,ce,0,k,Q,1)}}let B=[_,g,m,v,E,y,S,b];for(let H of B)H.instanceMatrix.needsUpdate=!0,H.frustumCulled=!1;return g.castShadow=!0,y.castShadow=!0,e.add(_,g,m,v,E,y,S,b),{root:e,update:(H,X)=>{let J=1+m5*Math.sin(X/p5*Math.PI*2);u.color.copy(Mf).multiplyScalar(J)}}}var Df=23,If=12,_5=[2,6,9,15,19],Nf=-380,x5=380,y5=(x5-Nf)/(Df-1),v5=60,Fo=new ge(1,1,1),M5=new bt(4,.4,8,16,Math.PI),Uf=new lt(6,6,3,4);Uf.rotateY(Math.PI/4);var E5=new qr(1,18,4),mh=new ke({color:3813440,roughness:.88,metalness:.08}),gh=new ue({color:de.traffic,transparent:!0,opacity:.35}),b5=new ue({color:de.traffic.clone().multiplyScalar(1.25),transparent:!0,opacity:.45,blending:$e,depthWrite:!1}),S5=new ue({color:16249832}),T5=new ue({color:2366763});function Lf(i,e,t){let n=new Oe;n.position.z=2.7;let s=new W(Fo,T5);return s.scale.set(t,e,.35),s.position.y=e/2,n.add(s),i.add(n),n}function Of(){let i=new Oe;i.name="bundRow";let e=st(5321),t=[],n=[];for(let r=0;r<Df;r++){let o=Nf+r*y5,a=20+e()*8,l=r===If?68:30+e()*30,c=new W(Fo,mh);c.scale.set(a,l,22),c.position.set(o,l/2,0),c.castShadow=!0,i.add(c);for(let h of[-1,1]){let u=new W(Fo,gh);u.scale.set(a+.5,.55,.5),u.position.set(o,l+.25,h*11),i.add(u)}for(let h of[-1,1]){let u=new W(Fo,gh);u.scale.set(.5,.55,21.5),u.position.set(o+h*a/2,l+.25,0),i.add(u)}for(let h of[-(a*.25),a*.25]){let u=new W(M5,b5);u.position.set(o+h,6,11.3),i.add(u)}if(_5.includes(r)){let h=new W(Fo,mh);h.scale.set(a*.4,25,16),h.position.set(o,l+12.5,0),h.castShadow=!0,i.add(h);let u=new W(E5,mh);u.scale.set(a*.3,1,a*.3),u.rotation.y=Math.PI/4,u.position.set(o,l+25+9,0),i.add(u)}if(r===If){let h=[{yaw:0,wx:0,wz:11},{yaw:Math.PI/2,wx:a/2,wz:0},{yaw:Math.PI,wx:0,wz:-11},{yaw:-Math.PI/2,wx:-(a/2),wz:0}];for(let u of h){let d=new Oe;d.position.set(o+u.wx,v5,u.wz),d.rotation.y=u.yaw,i.add(d);let f=new W(Uf,S5);f.rotation.x=Math.PI/2,f.position.z=1,d.add(f),t.push(Lf(d,4.8,.45)),n.push(Lf(d,3.2,.6))}}}return{root:i,update:(r,o)=>{let a=.5+.5*Math.sin(o*1.3);gh.opacity=.26+a*.18;let l=-o*.1*ir,c=-o*.0083*ir;for(let h of t)h.rotation.z=l;for(let h of n)h.rotation.z=c}}}var yi=60,Bi=40,Gn=28,Tn=.7,_h=20,w5=[6,14,22],Ff=340,R5=[340,352,326,364,312,376,300,388],Bf=yi/2-Tn,Hf=Bi/2-Tn,A5=new ge(56,.8,36),C5=new ge(50,.3,1.2),P5=new lt(3,3,26),I5=new ge(yi,Gn,Tn),zf=new ge(Tn,Gn,Bi),Gf=new ge((yi-_h)/2,Gn,Tn),kf=new ge(yi,Tn,Bi),L5=new lt(.32,.5,4),D5=new ct(1.5,16,12);function N5(i,e,t,n){let s=i.arteries.find(l=>l.district===e),r=s?s.x0-t:-t,o=s?s.z0-n:-n,a=Math.hypot(r,o);return a<1e-6?{x:1,z:0}:{x:r/a,z:o/a}}function U5(i,e,t){for(let n of i.buildings)if(Math.abs(e-n.x)<yi/2+8+n.w/2&&Math.abs(t-n.z)<Bi/2+8+n.d/2)return!0;return!1}function Vf(i){let e=new Oe,t=[],n=[],s=new ke({color:1715270,opacity:.35,transparent:!0,metalness:.4,roughness:.35,depthWrite:!1}),r=new ke({color:1055275,roughness:.85,metalness:.25});return i.districts.forEach((a,l)=>{var I;let c=N5(i,a.id,a.cx,a.cz),h=a.cx+c.x*Ff,u=a.cz+c.z*Ff;for(let T of R5){let A=a.cx+c.x*T,L=a.cz+c.z*T;if(!U5(i,A,L)){h=A,u=L;break}}let d=Math.atan2(c.x,c.z),f=Math.round(d/(Math.PI/2))*(Math.PI/2),p=Math.abs(Math.sin(f))>.5,_=new Oe;_.position.set(h,0,u),_.rotation.y=f,e.add(_);let g=(T,A,L,U)=>{let C=new W(T,s);C.position.set(A,L,U),C.renderOrder=1,_.add(C)};g(I5,0,Gn/2,-(Bi/2-Tn/2)),g(zf,-(yi/2-Tn/2),Gn/2,0),g(zf,yi/2-Tn/2,Gn/2,0),g(Gf,-((yi-_h)/2),Gn/2,Bi/2-Tn/2),g(Gf,(yi-_h)/2,Gn/2,Bi/2-Tn/2),g(kf,0,Gn-Tn/2,0);let m=new W(kf,r);m.position.set(0,.06-Tn/2,0),m.receiveShadow=!0,_.add(m);let v=new le(16767392).multiplyScalar(1.2),E=new ue({color:v.clone()});for(let T of w5){let A=new W(A5,r);A.position.set(0,T,0),A.castShadow=!0,A.receiveShadow=!0,_.add(A);for(let L of[-1,1]){let U=new W(C5,E);U.position.set(0,T-.75,L*(Bi/2-3)),_.add(U)}}let y=new ue({color:de.data.clone().multiplyScalar(1.6),transparent:!0,opacity:.55,blending:$e,depthWrite:!1}),S=new W(P5,y);S.position.set(0,13,0),S.renderOrder=2,_.add(S);let b=new W(L5,r);b.position.set(0,Gn+2,0),b.castShadow=!0,_.add(b);let x=new ue({color:((I=Sn[a.id])!=null?I:de.data).clone().multiplyScalar(1.5)}),M=new W(D5,x);M.position.set(0,Gn+3.5,0),_.add(M),t.push({cx:h,cz:u,hw:p?Hf:Bf,hd:p?Bf:Hf}),n.push({stripBase:v,stripMat:E,columnMat:y,columnMesh:S,beaconMesh:M,phase:l*2.1})}),{root:e,specs:t,update:(a,l)=>{for(let c of n){c.stripMat.color.copy(c.stripBase).multiplyScalar(1.15+.25*Math.sin(l*1.6+c.phase)),c.columnMat.opacity=.55+.1*Math.sin(l*1.1+c.phase*.7);let h=1+.05*Math.sin(l*1.3+c.phase);c.columnMesh.scale.set(h,1,h),c.beaconMesh.scale.setScalar(1+.3*(.5+.5*Math.sin(l*1.7+c.phase*1.3)))}}}}var Wf=1.8,Ln=1.4,O5=22,F5=55,xh=2400,dc=1.35,Xf=.0022,B5=1,Yf="KeyW",qf="KeyS",Zf="KeyD",Kf="KeyA",Jf=["ShiftLeft","ShiftRight"],fc=class{constructor(e,t){this.colliders=[];this.enterables=[];this.on=!1;this.yaw=0;this.pitch=0;this.px=0;this.pz=0;this.keys=new Set;this.dragging=!1;this.lastX=0;this.lastY=0;this.savedPos=new P;this.savedQuat=new Vt;this.camera=e,this.dom=t,this.dom.addEventListener("mousedown",n=>this.onMouseDown(n)),window.addEventListener("mousemove",n=>this.onMouseMove(n)),window.addEventListener("mouseup",()=>{this.dragging=!1}),window.addEventListener("keydown",n=>this.onKeyDown(n)),window.addEventListener("keyup",n=>this.keys.delete(n.code)),window.addEventListener("blur",()=>{this.keys.clear(),this.dragging=!1})}setColliders(e){this.colliders=e.slice()}setEnterable(e){this.enterables=e.slice()}toggle(){if(this.on=!this.on,this.keys.clear(),this.dragging=!1,this.on){this.savedPos.copy(this.camera.position),this.savedQuat.copy(this.camera.quaternion),this.px=this.camera.position.x,this.pz=this.camera.position.z;let e=new P;this.camera.getWorldDirection(e),this.yaw=Math.atan2(-e.x,-e.z),this.pitch=hn(Math.asin(hn(e.y,-1,1)),-dc,dc),this.camera.rotation.order="YXZ",this.camera.position.set(this.px,Wf,this.pz),this.applyLook()}else this.camera.position.copy(this.savedPos),this.camera.quaternion.copy(this.savedQuat);return this.on}enabled(){return this.on}update(e){if(!this.on)return!1;let t=-Math.sin(this.yaw),n=-Math.cos(this.yaw),s=Math.cos(this.yaw),r=-Math.sin(this.yaw),o=0,a=0;this.keys.has(Yf)&&(o+=t,a+=n),this.keys.has(qf)&&(o-=t,a-=n),this.keys.has(Zf)&&(o+=s,a+=r),this.keys.has(Kf)&&(o-=s,a-=r);let l=Math.hypot(o,a);if(l>1e-6){let u=Jf.some(_=>this.keys.has(_))?F5:O5,d=o/l*u*e,f=a/l*u*e,p=Math.max(1,Math.ceil(Math.hypot(d,f)/B5));for(let _=0;_<p;_++)this.px+=d/p,this.pz+=f/p,this.resolveCollisions()}else this.resolveCollisions();let c=Math.hypot(this.px,this.pz);return c>xh&&(this.px=this.px/c*xh,this.pz=this.pz/c*xh),this.camera.position.set(this.px,Wf,this.pz),this.applyLook(),!0}applyLook(){this.camera.rotation.set(this.pitch,this.yaw,0)}onMouseDown(e){this.on&&(this.dragging=!0,this.lastX=e.clientX,this.lastY=e.clientY,e.preventDefault())}onMouseMove(e){if(!this.on||!this.dragging)return;let t=e.clientX-this.lastX,n=e.clientY-this.lastY;this.lastX=e.clientX,this.lastY=e.clientY,this.yaw-=t*Xf,this.pitch=hn(this.pitch-n*Xf,-dc,dc)}onKeyDown(e){this.on&&(e.code===Yf||e.code===qf||e.code===Kf||e.code===Zf||Jf.includes(e.code))&&this.keys.add(e.code)}resolveCollisions(){let e=null;for(let t of this.enterables)if(Math.abs(this.px-t.cx)<=t.hw&&Math.abs(this.pz-t.cz)<=t.hd){e=t;break}for(let t=0;t<2;t++)for(let n of this.colliders)e&&this.overlapsHub(n,e)||(this.pz+Ln>n.cz-n.hd&&this.pz-Ln<n.cz+n.hd&&(this.px<n.cx&&this.px+Ln>n.cx-n.hw?this.px=n.cx-n.hw-Ln:this.px>=n.cx&&this.px-Ln<n.cx+n.hw&&(this.px=n.cx+n.hw+Ln)),this.px+Ln>n.cx-n.hw&&this.px-Ln<n.cx+n.hw&&(this.pz<n.cz&&this.pz+Ln>n.cz-n.hd?this.pz=n.cz-n.hd-Ln:this.pz>=n.cz&&this.pz-Ln<n.cz+n.hd&&(this.pz=n.cz+n.hd+Ln)))}overlapsHub(e,t){return Math.abs(e.cx-t.cx)<=e.hw+t.hw&&Math.abs(e.cz-t.cz)<=e.hd+t.hd}};var $f={lat:31.2397,lon:121.4998},jf={lat:31.2418,lon:121.4975},Qf={lat:31.2432,lon:121.4952},ep={lat:31.2405,lon:121.4878},Bo=-14,H5=8,z5=64,G5=12,yh=6,tp=20,k5=22,vh=4,ar=new Ci([new P(Bt($f.lon),Bo,Ht($f.lat)),new P(Bt(jf.lon),Bo,Ht(jf.lat)),new P(Bt(Qf.lon),Bo,Ht(Qf.lat)),new P(Bt(ep.lon),Bo,Ht(ep.lat))]),Ho=ar.getLength(),np=14,V5=[{s:30,side:1},{s:62,side:-1},{s:Ho-30,side:-1},{s:Ho-62,side:1}],W5=new ts(ar,z5,H5,G5,!1),X5=new ge(18,3.4,3),Y5=new ge(16,1.2,.1),q5=new ge(10,5,10),Z5=new ge(1.4,26,1.4),K5=new bt(4,.5,10,48),J5=new ue({color:de.data.clone(),transparent:!0,opacity:.28,blending:$e,depthWrite:!1,depthTest:!1,fog:!1}),$5=new ke({color:1976894,roughness:.55,metalness:.3,transparent:!0,opacity:.92,depthWrite:!1,depthTest:!1,fog:!1}),j5=new ue({color:de.data.clone().multiplyScalar(1.5),blending:$e,transparent:!0,depthWrite:!1,depthTest:!1,fog:!1}),Q5=new ke({color:6220500,transparent:!0,opacity:.35,roughness:.2,metalness:.05,depthWrite:!1}),ey=new ue({color:de.data.clone().multiplyScalar(1.4),blending:$e,transparent:!0,opacity:.9,depthWrite:!1,fog:!1}),ty=new ue({color:de.data.clone().lerp(de.ceo,.5),blending:$e,transparent:!0,opacity:.4,depthWrite:!1,fog:!1});function ip(){let i=new Oe;i.name="metroLine2";let e=st(202),t=new W(W5,J5);t.renderOrder=5,i.add(t);let n=[];for(let f=0;f<yh;f++){let p=new W(X5,$5);p.renderOrder=6;for(let _ of[-1,1]){let g=new W(Y5,j5);g.position.set(0,.5,_*1.55),g.renderOrder=7,p.add(g)}i.add(p),n.push(p)}let s=[],r=new P,o=new P;for(let f of V5){let p=hn(f.s/Ho,0,1);ar.getPointAt(p,r),ar.getTangentAt(p,o);let _=-o.z,g=o.x,m=new Oe;m.position.set(r.x+_*np*f.side,0,r.z+g*np*f.side),m.rotation.y=Math.atan2(-o.z,o.x);let v=new W(q5,Q5);v.position.y=2.5,m.add(v);let E=new W(K5,ey);E.rotation.x=Math.PI/2,E.position.y=.55,m.add(E);let y=ty.clone(),S=new W(Z5,y);S.position.y=13,m.add(S),i.add(m),s.push({pillarMat:y,phase:e()*Math.PI*2})}let a=(yh-1)*tp,l=Ho,c=a,h=1,u=vh;function d(f,p){u>0?u-=f:(c+=h*k5*f,h>0&&c>=l?(c=l,u=vh,h=-1):h<0&&c<=a&&(c=a,u=vh,h=1));for(let _=0;_<yh;_++){let g=hn((c-_*tp)/Ho,0,1);ar.getPointAt(g,r),ar.getTangentAt(g,o),n[_].position.set(r.x,Bo,r.z),n[_].rotation.y=Math.atan2(-o.z,o.x)}for(let _ of s)_.pillarMat.opacity=.4+.14*(.5+.5*Math.sin(p*1.3+_.phase))}return{root:i,update:d}}var ny=new gn(10,5),sp=new lt(.5,.8,14,6);sp.translate(0,7,0);var iy=new ct(.9),sy=new bt(24,1.6,8,40,Math.PI),ry=new ge(.8,12,.8),oy=8118,ay=90,Mh=4,zo=16,ly=2,vi=Math.PI*2,cy=Math.PI/2;function hy(i){var n;if(i==="gaming")return[de.data.clone(),de.brain.clone(),de.data.clone().multiplyScalar(1.4),de.brain.clone().multiplyScalar(1.4)];if(i==="quant")return[de.capital.clone(),de.ceo.clone(),de.capital.clone().multiplyScalar(1.4),de.ceo.clone().multiplyScalar(1.3)];if(i==="media"){let s=de.traffic.clone(),r=de.traffic.clone().lerp(de.ceo,.45);return[s,r,s.clone().multiplyScalar(1.4),r.clone().multiplyScalar(1.4)]}let e=(n=Sn[i])!=null?n:de.data,t=e.clone().lerp(de.ceo,.45);return[e.clone(),t,e.clone().multiplyScalar(1.4),t.clone().multiplyScalar(1.4)]}function uy(i,e){let t=i.zones.find(s=>s.id===e);return .5+.7*(t?Math.min(1,Math.max(0,t.activity)):.5)}function rp(i,e){var m;let t=new Oe;t.name="streetSilicon";let n=st(oy),s=[],r=[],o=[],a=zo*i.districts.length,l=a>0?new _t(sp,new ke({color:1712943,roughness:.85,metalness:.35}),a):null;l&&(l.frustumCulled=!1,l.castShadow=!1,t.add(l));let c=new Xe,h=new P,u=new Vt,d=new Cn,f=new P(1,1,1),p=new le(1,1,1),_=0;for(let v of i.districts){let E=(m=Sn[v.id])!=null?m:de.data,y=uy(e,v.id),S=hy(v.id),b=Array.from({length:Mh},()=>[]);for(let U=0;U<ay;U++){let C=n()*vi,N=90+n()*210,O=6+n()*20,B=v.cx+Math.cos(C)*N,V=v.cz+Math.sin(C)*N,H=(n()-.5)*.24,X=n()*vi;b[U%Mh].push({x:B,y:O,z:V,yaw:Math.atan2(v.cx-B,v.cz-V),tiltX:H*Math.cos(X),tiltZ:H*Math.sin(X),flickT:.8+n()*1.2,flickPhase:n()*vi})}for(let U=0;U<Mh;U++){let C=b[U];if(C.length===0)continue;let N=new ue({color:S[U].clone(),side:Dt,fog:!0}),O=new _t(ny,N,C.length),B=new Float32Array(C.length),V=new Float32Array(C.length);for(let H=0;H<C.length;H++){let X=C[H];d.set(X.tiltX,X.yaw,cy+X.tiltZ,"YXZ"),u.setFromEuler(d),h.set(X.x,X.y,X.z),c.compose(h,u,f),O.setMatrixAt(H,c),O.setColorAt(H,p),B[H]=X.flickT,V[H]=X.flickPhase}O.instanceMatrix.needsUpdate=!0,O.instanceColor&&(O.instanceColor.needsUpdate=!0),O.frustumCulled=!1,O.castShadow=!1,t.add(O),s.push({mesh:O,mat:N,base:S[U],gain:y,flickT:B,flickPhase:V,count:C.length})}let x=new ue({color:E.clone().multiplyScalar(1.5),fog:!0}),M=new _t(iy,x,zo),I=new Float32Array(Math.ceil(zo/3));for(let U=0;U<I.length;U++)I[U]=n()*vi;for(let U=0;U<zo;U++){let C=n()*vi,N=95+n()*195,O=v.cx+Math.cos(C)*N,B=v.cz+Math.sin(C)*N;d.set(0,n()*vi,0),u.setFromEuler(d),h.set(O,0,B),c.compose(h,u,f),l&&l.setMatrixAt(_++,c),h.set(O,14.6,B),c.compose(h,u,f),M.setMatrixAt(U,c),M.setColorAt(U,p)}M.instanceMatrix.needsUpdate=!0,M.instanceColor&&(M.instanceColor.needsUpdate=!0),M.frustumCulled=!1,M.castShadow=!1,t.add(M),r.push({mesh:M,groupPhase:I,count:zo});let T=new ue({color:E.clone(),blending:$e,transparent:!0,opacity:.5,depthWrite:!1,fog:!0}),A=new ue({color:E.clone().multiplyScalar(1.6),transparent:!0,opacity:.55,depthWrite:!1,fog:!0}),L=n()*vi;for(let U=0;U<ly;U++){let C=L+U*Math.PI+(n()-.5)*.6,N=150+n()*90,O=new Oe;O.position.set(v.cx+Math.cos(C)*N,1.6,v.cz+Math.sin(C)*N),O.rotation.y=-C;let B=new W(sy,T),V=new W(ry,A);V.position.set(0,30,0),B.castShadow=!1,V.castShadow=!1,B.frustumCulled=!1,V.frustumCulled=!1,O.add(B,V),t.add(O)}o.push({archMat:T,colMat:A,phase:n()*vi})}return l&&(l.instanceMatrix.needsUpdate=!0),{root:t,update:(v,E)=>{for(let y of s){y.mat.color.copy(y.base).multiplyScalar(y.gain);let S=y.mesh.instanceColor;if(S){for(let b=0;b<y.count;b++){let x=vi/y.flickT[b],M=.72+.28*(.5+.5*Math.sin(E*x+y.flickPhase[b]));S.setXYZ(b,M,M,M)}S.needsUpdate=!0}}for(let y of r){let S=y.mesh.instanceColor;if(S){for(let b=0;b<y.count;b++){let x=y.groupPhase[Math.floor(b/3)],M=.55+.45*(.5+.5*Math.sin(E*1.3+x));S.setXYZ(b,M,M,M)}S.needsUpdate=!0}}for(let y of o){let S=.5+.5*Math.sin(E*.7+y.phase);y.archMat.opacity=.46+.08*S;let b=.5+.5*Math.sin(E*.9+y.phase+.6);y.colMat.opacity=.5+.1*b}}}}var dy=[[31.218,121.489],[31.226,121.4908],[31.231,121.493],[31.234,121.4965],[31.236,121.5],[31.239,121.503],[31.243,121.5018],[31.248,121.502],[31.254,121.5035],[31.26,121.5065],[31.266,121.51],[31.272,121.5145]],fy=230,ps=10,pc=3,op=new ge(58,6,14),py=new ge(12,8,8),ap=new ct(1.1,10,8),my=new ge(18,.3,1.2),gy=new ke({color:1844788,roughness:.6,metalness:.55}),_y=new ke({color:2898e3,roughness:.7,metalness:.3}),xy=new ue({color:de.ceo.clone().multiplyScalar(1.5)}),yy=new ue({color:de.warn}),vy=new ue({color:de.data}),My=new ue({color:de.data.clone().lerp(de.ceo,.45),blending:$e,transparent:!0,opacity:.35,depthWrite:!1}),Ey=de.data.clone().multiplyScalar(.85),lr=new Xe().makeScale(0,0,0),mc=.2,by=29,Sy=-20,Ty=7,wy=-20,Ry=12.4,Ay=-29.5,Cy=3.6,Eh=.5,Py=15,Iy=30/58,Ly=5/6,Dy=9/14,Ny=1,Uy=3.5,Oy=16/12,Fy=2/8,By=7/8,Hy=1.3,zy=30.8/58,Gy=.7/6,ky=9.6/14,Vy=5,lp=6,bh=2300,cp=3700,Wy=[-168,-176,-184],gc=.8,hp=9,_c=1.5,Xy=fy*.75,Yy=14,jn=dy.map(([i,e])=>new te(Bt(e),Ht(i))),Sh=[],cr=[];for(let i=0;i<jn.length-1;i++){let e=jn[i+1].clone().sub(jn[i]).normalize();Sh.push(e),cr.push(new te(-e.y,e.x))}var Hi=[0];for(let i=0;i<jn.length-1;i++)Hi.push(Hi[i]+jn[i].distanceTo(jn[i+1]));var xc=Hi[Hi.length-1],yc=[cr[0]];for(let i=1;i<jn.length-1;i++)yc.push(cr[i-1].clone().add(cr[i]).normalize());yc.push(cr[cr.length-1]);var Qt={px:0,pz:0,ux:0,uz:0,nx:0,nz:0};function up(i){let e=0;for(;e<jn.length-2&&i>Hi[e+1];)e++;let t=Hi[e+1]-Hi[e],n=t>1e-6?(i-Hi[e])/t:1,s=jn[e],r=jn[e+1];Qt.px=s.x+(r.x-s.x)*n,Qt.pz=s.y+(r.y-s.y)*n,Qt.ux=Sh[e].x,Qt.uz=Sh[e].y;let o=yc[e],a=yc[e+1],l=o.x+(a.x-o.x)*n,c=o.y+(a.y-o.y)*n,h=Math.hypot(l,c)||1;Qt.nx=l/h,Qt.nz=c/h}function dp(){let i=new Oe,e=st(2244),t=ps+pc,n=(m,v,E)=>{let y=new _t(m,v,E);return y.instanceMatrix.setUsage(zn),y.frustumCulled=!1,y.castShadow=!1,y},s=n(op,gy,t),r=n(py,_y,t),o=n(op,vy,pc),a=n(ap,xy,ps),l=n(ap,yy,ps),c=n(my,My,t*2);i.add(s,r,o,a,l,c);let h=new le(1,1,1);for(let m=0;m<t;m++)s.setColorAt(m,h);for(let m=0;m<pc;m++)s.setColorAt(ps+m,Ey);s.instanceColor&&(s.instanceColor.needsUpdate=!0);let u=[];for(let m=0;m<ps;m++){let v=m<5?1:-1,E=Xy+e()*Yy;u.push({s:e()*xc,dir:v,speed:5+e()*4,lateral:v===1?E:-E,docked:!1,dockTimer:0})}let f=[{s:2600,dir:1,docked:!1,timer:0},{s:3450,dir:-1,docked:!1,timer:0},{s:bh,dir:1,docked:!0,timer:3}].map((m,v)=>({s:m.s,dir:m.dir,speed:Vy,lateral:Wy[v],docked:m.docked,dockTimer:m.timer}));for(let m=0;m<t;m++)s.setMatrixAt(m,lr),r.setMatrixAt(m,lr);for(let m=0;m<pc;m++)o.setMatrixAt(m,lr);for(let m=0;m<ps;m++)a.setMatrixAt(m,lr),l.setMatrixAt(m,lr);for(let m=0;m<t*2;m++)c.setMatrixAt(m,lr);let p=new vt;function _(m,v,E,y,S,b,x,M,I,T,A){let L=Math.cos(b),U=Math.sin(b);p.position.set(E+x*L+M*U,S,y-x*U+M*L),p.rotation.set(0,b,0),p.scale.set(I,T,A),p.updateMatrix(),m.setMatrixAt(v,p.matrix)}function g(m,v){for(let E=0;E<u.length;E++){let y=u[E];y.s+=y.dir*y.speed*m,y.s>=xc?y.s-=xc:y.s<0&&(y.s+=xc),up(y.s);let S=Qt.px+y.lateral*Qt.nx,b=Qt.pz+y.lateral*Qt.nz,x=Math.atan2(-Qt.uz,Qt.ux),M=y.dir===1?x:x+Math.PI;_(s,E,S,b,mc,M,0,0,1,1,1),_(r,E,S,b,mc+Ty,M,Sy,0,1,1,1),_(a,E,S,b,mc+Ry,M,wy,0,1,1,1),_(l,E,S,b,mc+Cy,M,Ay,0,1,1,1);let I=-(by+hp);_(c,2*E,S,b,gc,M,I,-_c,1,1,1),_(c,2*E+1,S,b,gc,M,I,_c,1,1,1)}for(let E=0;E<f.length;E++){let y=f[E];y.docked?(y.dockTimer-=m,y.dockTimer<=0&&(y.docked=!1,y.dir=y.dir===1?-1:1)):(y.s+=y.dir*y.speed*m,y.dir===1&&y.s>=cp?(y.s=cp,y.docked=!0,y.dockTimer=lp):y.dir===-1&&y.s<=bh&&(y.s=bh,y.docked=!0,y.dockTimer=lp)),up(y.s);let S=Qt.px+y.lateral*Qt.nx,b=Qt.pz+y.lateral*Qt.nz,x=Math.atan2(-Qt.uz,Qt.ux),M=ps+E;_(s,M,S,b,Eh,x,0,0,Iy,Ly,Dy),_(r,M,S,b,Eh+Uy,x,Ny,0,Oy,Fy,By),_(o,E,S,b,Eh+Hy,x,0,0,zy,Gy,ky);let I=-y.dir*(Py+hp),T=y.docked?0:1;_(c,2*M,S,b,gc,x,I,-_c,T,1,1),_(c,2*M+1,S,b,gc,x,I,_c,T,1,1)}s.instanceMatrix.needsUpdate=!0,r.instanceMatrix.needsUpdate=!0,o.instanceMatrix.needsUpdate=!0,a.instanceMatrix.needsUpdate=!0,l.instanceMatrix.needsUpdate=!0,c.instanceMatrix.needsUpdate=!0}return{root:i,update:g}}var qy=[[31.218,121.489],[31.226,121.4908],[31.231,121.493],[31.234,121.4965],[31.236,121.5],[31.239,121.503],[31.243,121.5018],[31.248,121.502],[31.254,121.5035],[31.26,121.5065],[31.266,121.51],[31.272,121.5145]],Zy=230,Ky=2,Jy=10,fp=Zy+14,Th=12,pp=.5,vc=.75,$y=8,mp=.6,jy=.5,gp=.6,_p=55,xp=4,wh=7,yp=40,vp=30,Mp=14,Rh=24,Qy=.45,ev=.08,tv=1.5;function Ep(){let i=new Oe,e=st(7788),t=qy.map(([T,A])=>({x:Bt(A),z:Ht(T)})),n=[];for(let T=Ky;T<=Jy;T++){let A=t[Math.min(T+1,t.length-1)],L=t[Math.max(T-1,0)],U=A.x-L.x,C=A.z-L.z,N=Math.hypot(U,C)||1,O=C/N,B=-U/N;n.push({x:t[T].x+O*fp,z:t[T].z+B*fp})}let s=[],r=[0];for(let T=0;T<n.length-1;T++){let A=Math.hypot(n[T+1].x-n[T].x,n[T+1].z-n[T].z);s.push(A),r.push(r[T]+A)}let o=r[r.length-1],a=new ge(1,pp,Th),l=new ke({color:2896964,roughness:.9});for(let T=0;T<n.length-1;T++){let A=n[T+1].x-n[T].x,L=n[T+1].z-n[T].z,U=new W(a,l);U.scale.set(s[T]+$y,1,1),U.position.set((n[T].x+n[T+1].x)/2,vc-pp/2,(n[T].z+n[T+1].z)/2),U.rotation.y=Math.atan2(-L,A),U.castShadow=!0,U.receiveShadow=!0,i.add(U)}let c=new ge(1,mp,jy),h=new ue({color:de.data.clone(),transparent:!0,opacity:gp,blending:$e,depthWrite:!1,fog:!0});for(let T=0;T<n.length-1;T++){let A=n[T+1].x-n[T].x,L=n[T+1].z-n[T].z,U=s[T]||1,C=-L/U,N=A/U,O=new W(c,h);O.scale.set(U,1,1),O.position.set((n[T].x+n[T+1].x)/2+C*(Th/2),vc+mp/2,(n[T].z+n[T+1].z)/2+N*(Th/2)),O.rotation.y=Math.atan2(-L,A),i.add(O)}let u=Math.floor(o/_p)+1,d=new lt(.2,.3,wh,6),f=new ct(.6,12,8),p=new ke({color:1317414,roughness:.6,metalness:.3}),_=new ue({color:new le(16770756).multiplyScalar(1.4)}),g=new _t(d,p,u),m=new _t(f,_,u);g.frustumCulled=!1,m.frustumCulled=!1,i.add(g,m);let v=new vt;for(let T=0;T<u;T++){let A=T*_p,L=0;for(;L<s.length-1&&A>r[L+1];)L++;let U=s[L]||1,C=(A-r[L])/U,N=n[L+1].x-n[L].x,O=n[L+1].z-n[L].z,B=n[L].x+N*C-O/U*xp,V=n[L].z+O*C+N/U*xp,H=.96+e()*.08;v.position.set(B,vc+wh/2*H,V),v.scale.setScalar(H),v.updateMatrix(),g.setMatrixAt(T,v.matrix),v.position.y=vc+wh*H+.5,v.updateMatrix(),m.setMatrixAt(T,v.matrix)}function E(T){let A=Math.max(0,Math.min(n.length-2,Math.floor(T))),L=T-A,U=n[A],C=n[A+1],N=s[A]||1,O=U.x+(C.x-U.x)*L,B=U.z+(C.z-U.z)*L,V=(C.x-U.x)/N,H=(C.z-U.z)/N;if(L<.1&&A>0){let X=n[A-1],J=s[A-1]||1,j=(U.x-X.x)/J+V,ce=(U.z-X.z)/J+H,k=Math.hypot(j,ce)||1;return{x:O,z:B,tx:j/k,tz:ce/k}}return{x:O,z:B,tx:V,tz:H}}let y=new ge(yp,1,vp),S=new ke({color:2569030,roughness:.9}),b=new bt(Rh,Qy,8,72),x=[{mat:h,base:gp,phase:0}],M=[1.7,4.25,6];for(let T of M){let A=E(T),L=Math.atan2(-A.tz,A.tx),U=new W(y,S);U.position.set(A.x+Math.sin(L)*Mp,.55,A.z+Math.cos(L)*Mp),U.rotation.y=L,U.castShadow=!0,U.receiveShadow=!0,i.add(U);let C=new ue({color:de.data.clone(),transparent:!0,opacity:.45,blending:$e,depthWrite:!1,fog:!0});x.push({mat:C,base:.45,phase:e()*Math.PI*2});let N=new W(b,C);N.rotation.x=Math.PI/2,N.scale.set((yp+2)/(2*Rh),(vp+2)/(2*Rh),1),N.position.set(0,1.1,0),U.add(N)}function I(T,A){for(let L of x)L.mat.opacity=L.base*(1+ev*Math.sin(A*tv+L.phase))}return{root:i,update:I}}var nv=4,iv=4,bp=.9,Go=420,sv=20,Sp=58,rv=132,ov=2,Ah=.25,av=1.2,Tp=.75,wp={gaming:de.data,quant:de.capital,media:de.traffic},lv=new lt(6,10,Go,12,1,!0),cv=new ct(1.6),hv=new bt(60,2,8,48);function Rp(i){let e=new Oe,t=st(1135),n=[];for(let a=0;a<nv;a++){let l=new ue({color:16777215,transparent:!0,opacity:0,depthWrite:!1,blending:$e,side:Dt}),c=new W(lv,l);c.visible=!1,e.add(c);let h=new ue({color:16777215,transparent:!0,opacity:0,depthWrite:!1,blending:$e}),u=new W(hv,h);u.rotation.x=Math.PI/2,u.visible=!1,e.add(u);let d=new ue({color:16777215,transparent:!0,opacity:0,depthWrite:!1,blending:$e}),f=[];for(let p=0;p<sv;p++){let _=new W(cv,d);_.visible=!1,e.add(_),f.push({mesh:_,orbitA:t()*Math.PI*2,orbitR:1.5+t()*2.7,y0:t(),speed:Sp+t()*(rv-Sp)})}n.push({column:c,columnMat:l,ring:u,ringMat:h,sparkMat:d,sparks:f,active:!1,age:0})}let s=a=>{a.active=!1,a.age=0,a.column.visible=!1,a.ring.visible=!1,a.columnMat.opacity=0,a.ringMat.opacity=0,a.sparkMat.opacity=0;for(let l of a.sparks)l.mesh.visible=!1};return{root:e,pushEvent:a=>{var d,f;if(a.type!=="NEW_RESIDENT"&&a.type!=="RESIDENT_BIRTH")return;let l=n.find(p=>!p.active);if(!l)return;let c=(d=a.zone)!=null?d:"gaming";wp[c]||(c="gaming");let h=(f=i.districts.find(p=>p.id===c))!=null?f:i.districts.find(p=>p.id==="gaming");if(!h)return;let u=wp[c];l.column.position.set(h.cx,Go/2,h.cz),l.columnMat.color.copy(u),l.columnMat.opacity=bp,l.column.visible=!0,l.ring.position.set(h.cx,ov,h.cz),l.ring.scale.setScalar(Ah),l.ringMat.color.copy(u),l.ringMat.opacity=Tp,l.ring.visible=!0,l.sparkMat.color.copy(u).multiplyScalar(1.5),l.sparkMat.opacity=1;for(let p of l.sparks)p.mesh.position.set(h.cx+Math.cos(p.orbitA)*p.orbitR,p.y0*Go,h.cz+Math.sin(p.orbitA)*p.orbitR),p.mesh.visible=!0;l.active=!0,l.age=0},update:(a,l)=>{for(let c of n){if(!c.active)continue;c.age+=a;let h=c.age/iv;if(h>=1){s(c);continue}let u=1-h;c.columnMat.opacity=bp*u,c.ring.scale.setScalar(Ah+(av-Ah)*h),c.ringMat.opacity=Tp*u,c.sparkMat.opacity=u;for(let d of c.sparks){let f=d.mesh.position.y+d.speed*a;f>=Go&&(f-=Go),d.mesh.position.y=f}}}}}var Dh=4200,Fp=Math.PI/3,Ap=Dh*Math.cos(Fp),uv=Dh,dv=new ct(Dh,16,8,0,Math.PI*2,0,Fp),fv=16751196,pv=-3e3,Ch=15.8,Cp=17,Ph=19.5,Pp=21,hr=400,mv=14,gv=20,_v=new gn(mv,gv),Ip=600,xv=1500,Lp=60,yv=160,vv=14674175,Dp=.15,Mv=.5,Np=.15,Ih=4.5,Up=6.5,Lh=17,Op=19.5,Ev=`
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,bv=`
uniform vec3 uColor;
uniform float uOpacity; // hour envelope: 1 in dusk window, 0 in daylight
uniform float uTime;
varying vec3 vPos;
void main() {
  float t = clamp((vPos.y - ${Ap.toFixed(1)}) / ${(uv-Ap).toFixed(1)}, 0.0, 1.0);
  float falloff = pow(1.0 - t, 1.8); // hot at the horizon, gone at zenith
  // Slow drift shimmer (~90 s period) via two crossed low-frequency waves.
  float drift = 0.88 + 0.12 * sin(uTime * 0.07 + vPos.x * 0.0007 + vPos.z * 0.0005);
  // Uneven brightness along the arc so it reads as sky, not as a tube.
  float az = atan(vPos.z, vPos.x);
  float arc = 0.9 + 0.1 * sin(az * 3.0 + uTime * 0.05);
  float glow = falloff * drift * arc * uOpacity * 0.55;
  gl_FragColor = vec4(uColor, glow);
}`;function Sv(i){return i<Ch||i>Pp?0:i<Cp?hs((i-Ch)/(Cp-Ch)):i<=Ph?1:1-hs((i-Ph)/(Pp-Ph))}function Tv(i){let e;return i>=Op||i<Ih?e=1:i<Up?e=1-hs((i-Ih)/(Up-Ih)):i<Lh?e=0:e=hs((i-Lh)/(Op-Lh)),Np+(1-Np)*e}function Bp(i){let e=new Oe,t=st(9421),n=new Tt({uniforms:{uColor:{value:new le(fv)},uOpacity:{value:0},uTime:{value:0}},vertexShader:Ev,fragmentShader:bv,side:Dt,transparent:!0,depthWrite:!1,blending:$e,fog:!1}),s=new W(dv,n);s.position.set(pv,0,0),s.frustumCulled=!1,s.castShadow=!1,s.visible=!1,e.add(s);let r=new ue({color:vv,side:Dt,fog:!0}),o=new _t(_v,r,hr),a=new Float32Array(hr),l=new Float32Array(hr),c=new Float32Array(hr),h=new vt,u=new le;for(let _=0;_<hr;_++){let g=t()*Math.PI*2,m=Ip+(xv-Ip)*t(),v=Math.cos(g)*m,E=Math.sin(g)*m,y=Lp+(yv-Lp)*t();h.position.set(v,y,E),h.rotation.set(0,Math.atan2(-v,-E)+(t()-.5)*.9,0),h.updateMatrix(),o.setMatrixAt(_,h.matrix),a[_]=Dp+(Mv-Dp)*t(),l[_]=t()*Math.PI*2,c[_]=.3+.5*t(),u.setScalar(a[_]),o.setColorAt(_,u)}o.instanceMatrix.needsUpdate=!0,o.instanceColor&&(o.instanceColor.needsUpdate=!0),o.frustumCulled=!1,o.castShadow=!1,e.add(o);let d=.5;if(i.zones.length>0){let _=0;for(let g of i.zones)_+=Math.min(1,Math.max(0,g.activity));d=_/i.zones.length}let f=.7+.5*d;return{root:e,update:(_,g,m)=>{let v=Sv(m);n.uniforms.uOpacity.value=v,n.uniforms.uTime.value=g,s.visible=v>.001;let E=Tv(m)*f;for(let y=0;y<hr;y++){let S=.72+.28*Math.sin(g*c[y]+l[y]);u.setScalar(a[y]*S*E),o.setColorAt(y,u)}o.instanceColor&&(o.instanceColor.needsUpdate=!0)}}}var Nh=[6,14,22],Hp=.8,Mc=1.3,wv=3,Xp=8,Yp=Nh.length,zp=Xp*Yp,Gp=.1,Rv=.25,kp=2,Av=5,Vp=1.8,Cv=7272,Pv=.9-(.28+1/2);function Iv(i){return i>=7&&i<22?1:.25}var qp=new ui(.28,1,3,6);qp.translate(0,.9,0);var Wp=new ge(30,.25,1),Lv=new gn(18,10);function Zp(i){let e=new Oe;if(i.length===0)return{root:e,update:()=>{}};let t=st(Cv),n=[],s=[];i.forEach((u,d)=>{s.push({start:n.length,target:0});let f=Math.max(0,u.hw-Mc),p=Math.max(0,u.hd-Mc);for(let _=0;_<Yp;_++){let g=Nh[_]+Hp/2-Pv;for(let m=0;m<Xp;m++){let v=kp+t()*(Av-kp),E=t()*Math.PI*2,y=Math.max(0,f-v-Vp),S=Math.max(0,p-v-Vp),b=Math.min(y/Math.max(.05,Math.abs(Math.cos(E))),S/Math.max(.05,Math.abs(Math.sin(E)))),x=v+wv+.8,M=b<=x?b:x+t()*(b-x);n.push({hub:d,ox:u.cx+Math.cos(E)*M,oz:u.cz+Math.sin(E)*M,y:g,radius:v,omega:Gp+t()*(Rv-Gp),phase:t()*Math.PI*2})}}});let r=new ue({color:1854020}),o=new _t(qp,r,n.length);o.instanceMatrix.setUsage(zn),o.frustumCulled=!1,o.castShadow=!1,e.add(o);let a=new vt,l=new Xe().makeScale(0,0,0);for(let u=0;u<n.length;u++)o.setMatrixAt(u,l);let c=[];return i.forEach((u,d)=>{let f=Math.max(0,u.hw-Mc),p=Math.max(0,u.hd-Mc),_=new le(16767392),g=new ue({color:_.clone()});for(let E of Nh){let y=E+Hp/2+.125;for(let S of[-1,1]){let b=new W(Wp,g);b.position.set(u.cx,y,u.cz+S*(p-.75)),b.castShadow=!1,e.add(b)}for(let S of[-1,1]){let b=new W(Wp,g);b.rotation.y=Math.PI/2,b.position.set(u.cx+S*(f-.75),y,u.cz),b.castShadow=!1,e.add(b)}}let m=new ue({color:de.data.clone(),transparent:!0,opacity:.25,blending:$e,depthWrite:!1}),v=new W(Lv,m);v.rotation.x=-Math.PI/2,v.position.set(u.cx,.3,u.cz+u.hd),v.renderOrder=2,v.castShadow=!1,e.add(v),c.push({stripMat:g,stripBase:_,doorMat:m,phase:d*1.7})}),{root:e,update:(u,d,f)=>{let p=Iv(f);for(let _ of s)_.target=hn(Math.round(zp*p),0,zp);for(let _=0;_<n.length;_++){let g=n[_],m=s[g.hub];if(_-m.start>=m.target){o.setMatrixAt(_,l);continue}let v=g.phase+g.omega*d;a.position.set(g.ox+Math.cos(v)*g.radius,g.y,g.oz+Math.sin(v)*g.radius),a.rotation.set(0,Math.atan2(-Math.sin(v),Math.cos(v)),0),a.scale.setScalar(1),a.updateMatrix(),o.setMatrixAt(_,a.matrix)}o.instanceMatrix.needsUpdate=!0;for(let _ of c){let g=.45+.55*p;_.stripMat.color.copy(_.stripBase).multiplyScalar(g*(1+.12*Math.sin(d*.8+_.phase))*.45),_.doorMat.opacity=.25+.05*Math.sin(d*1.2+_.phase*.6)}}}}var Dv=6606,zi=410,Oh=-115,Fh=230,Kp=2400,Jp=900,$p=500,Nv=55,Uv=7,Ov=2,Fv=.8,Bv=30,Hv=4,zv=2.3;function Uh(i,e,t,n,s){let r=new Float32Array(i*3),o=new Float32Array(i);for(let u=0;u<i;u++){let d=u*3;r[d]=(s()*2-1)*zi,r[d+1]=Oh+s()*Fh,r[d+2]=(s()*2-1)*zi,o[u]=s()*Math.PI*2}let a=new Ft(r,3),l=new gt;l.setAttribute("position",a);let c=new Yn({color:t,size:e,sizeAttenuation:!0,transparent:!0,opacity:n,depthWrite:!1,fog:!0}),h=new ci(l,c);return h.frustumCulled=!1,{points:h,pos:r,attr:a,phases:o}}function jp(i){let e=st(Dv),t=Uh(Kp,.35,7309224,.45,e),n=Uh(Jp,.9,14674164,.75,e),s=Uh($p,.3,10466508,.3,e),r=new Oe;r.add(t.points,n.points,s.points);let o=(i.reality.weather_kind||"").toLowerCase();return t.points.visible=o==="rain",n.points.visible=o==="snow",s.points.visible=o==="wind",{root:r,update:(l,c)=>{if(o==="rain"){let h=t.pos;for(let u=0;u<Kp;u++){let d=u*3+1,f=h[d]-Nv*l;f<Oh&&(f+=Fh),h[d]=f}t.attr.needsUpdate=!0}else if(o==="snow"){let h=n.pos;for(let u=0;u<Jp;u++){let d=u*3,f=h[d+1]-Uv*l;f<Oh&&(f+=Fh),h[d+1]=f;let p=h[d]+Math.sin(c*Fv+n.phases[u])*Ov*l;p>zi?p-=zi*2:p<-zi&&(p+=zi*2),h[d]=p}n.attr.needsUpdate=!0}else if(o==="wind"){let h=s.pos;for(let u=0;u<$p;u++){let d=u*3,f=h[d]+Bv*l;f>zi&&(f-=zi*2),h[d]=f,h[d+1]+=Math.sin(c*zv+s.phases[u])*Hv*l}s.attr.needsUpdate=!0}}}}var ko=360,Qp=90,Gv=300,e3=.08,kv=.2,Vv=.08;function Wv(i){return i>=7&&i<9?1:i>=9&&i<17?.55:i>=17&&i<19?1:i>=19&&i<21?.35:.04}function t3(i,e){let t=new Oe;if(i.districts.length===0)return{root:t,update:()=>{}};let n=st(20261126),s=i.districts.map(f=>{let p=e.zones.find(_=>_.id===f.id);return{cx:f.cx,cz:f.cz,activity:p?p.activity:.5,start:0,count:0,target:0}}),r=[],o=-1;for(let f=0;f<ko;f++){let p=Math.min(s.length-1,Math.floor(f/ko*s.length));p!==o&&(s[p].start=f,o=p),s[p].count++,r.push({district:p,radius:Qp+n()*(Gv-Qp),phase:n()*Math.PI*2,omega:e3+n()*(kv-e3),bobPhase:n()*Math.PI*2,bobHz:5.5+n()*3})}let a=new ui(.32,1.1,3,6);a.translate(0,.9,0);let l=new ke({color:2504527,roughness:.8}),c=new _t(a,l,ko);c.instanceMatrix.setUsage(zn),c.frustumCulled=!1,c.castShadow=!1,t.add(c);let h=new vt,u=new Xe().makeScale(0,0,0);for(let f=0;f<ko;f++)c.setMatrixAt(f,u);function d(f,p,_){let g=Wv(_);for(let m of s)m.target=hn(Math.round(m.count*g*m.activity),0,m.count);for(let m=0;m<ko;m++){let v=r[m],E=s[v.district];if(m-E.start>=E.target){c.setMatrixAt(m,u);continue}let y=v.phase+v.omega*p;h.position.set(E.cx+Math.cos(y)*v.radius,Math.sin(p*v.bobHz+v.bobPhase)*Vv,E.cz+Math.sin(y)*v.radius),h.rotation.set(0,Math.atan2(-Math.sin(y),Math.cos(y)),0),h.scale.setScalar(1),h.updateMatrix(),c.setMatrixAt(m,h.matrix)}c.instanceMatrix.needsUpdate=!0}return{root:t,update:d}}var ur={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var wn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Xv=new ns(-1,1,1,-1,0,1),Bh=class extends gt{constructor(){super(),this.setAttribute("position",new je([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new je([0,2,0,0,2,0],2))}},Yv=new Bh,Gi=class{constructor(e){this._mesh=new W(Yv,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Xv)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var Ec=class extends wn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Tt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=nn.clone(e.uniforms),this.material=new Tt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Gi(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Vo=class extends wn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},bc=class extends wn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var Sc=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new te);this._width=n.width,this._height=n.height,t=new zt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Xt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ec(ur),this.copyPass.material.blending=pi,this.timer=new lo}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Vo!==void 0&&(o instanceof Vo?n=!0:o instanceof bc&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new te);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Tc=class extends wn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new le}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}};var n3={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new le(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var dr=class i extends wn{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new te(e.x,e.y):new te(256,256),this.clearColor=new le(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new zt(r,o,{type:Xt,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let u=new zt(r,o,{type:Xt,depthBuffer:!1});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);let d=new zt(r,o,{type:Xt,depthBuffer:!1});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}let a=n3;this.highPassUniforms=nn.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Tt({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new te(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=nn.clone(ur.uniforms),this.blendMaterial=new Tt({uniforms:this.copyUniforms,vertexShader:ur.vertexShader,fragmentShader:ur.fragmentShader,premultipliedAlpha:!0,blending:$e,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new le,this._oldClearAlpha=1,this._basic=new ue,this._fsQuad=new Gi(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new te(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let o=0;o<e;o++)t.push(.39894*Math.exp(-.5*o*o/(n*n))/n);let s=[],r=[];for(let o=1;o<e;o+=2){let a=t[o],l=o+1<e?t[o+1]:0,c=a+l;s.push((o*a+(o+1)*l)/c),r.push(c)}return new Tt({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new te(.5,.5)},direction:{value:new te(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new Tt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}};dr.BlurDirectionX=new te(1,0);dr.BlurDirectionY=new te(0,1);var Wo={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var wc=class extends wn{constructor(){super(),this.isOutputPass=!0,this.uniforms=nn.clone(Wo.uniforms),this.material=new qs({name:Wo.name,uniforms:this.uniforms,vertexShader:Wo.vertexShader,fragmentShader:Wo.fragmentShader}),this._fsQuad=new Gi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},ft.getTransfer(this._outputColorSpace)===Et&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===po?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===mo?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===go?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ss?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===xo?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===yo?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===_o&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};function i3(i,e,t){let n=new Sc(i);n.addPass(new Tc(e,t));let s=new dr(new te(window.innerWidth,window.innerHeight),.9,.5,.55);return n.addPass(s),n.addPass(new wc),n}var s3={type:"change"},zh={type:"start"},o3={type:"end"},Rc=new li,r3=new fn,qv=Math.cos(70*as.DEG2RAD),Zt=new P,xn=2*Math.PI,wt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Hh=1e-6,Ac=class extends uo{constructor(e,t=null){super(e,t),this.state=wt.NONE,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Di.ROTATE,MIDDLE:Di.DOLLY,RIGHT:Di.PAN},this.touches={ONE:Ni.ROTATE,TWO:Ni.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new P,this._lastQuaternion=new Vt,this._lastTargetPosition=new P,this._quat=new Vt().setFromUnitVectors(e.up,new P(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ks,this._sphericalDelta=new Ks,this._scale=1,this._panOffset=new P,this._rotateStart=new te,this._rotateEnd=new te,this._rotateDelta=new te,this._panStart=new te,this._panEnd=new te,this._panDelta=new te,this._dollyStart=new te,this._dollyEnd=new te,this._dollyDelta=new te,this._dollyDirection=new P,this._mouse=new te,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Kv.bind(this),this._onPointerDown=Zv.bind(this),this._onPointerUp=Jv.bind(this),this._onContextMenu=iM.bind(this),this._onMouseWheel=Qv.bind(this),this._onKeyDown=eM.bind(this),this._onTouchStart=tM.bind(this),this._onTouchMove=nM.bind(this),this._onMouseDown=$v.bind(this),this._onMouseMove=jv.bind(this),this._interceptControlDown=sM.bind(this),this._interceptControlUp=rM.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=wt.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(s3),this.update(),this.state=wt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;Zt.copy(t).sub(this.target),Zt.applyQuaternion(this._quat),this._spherical.setFromVector3(Zt),this.autoRotate&&this.state===wt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=xn:n>Math.PI&&(n-=xn),s<-Math.PI?s+=xn:s>Math.PI&&(s-=xn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Zt.setFromSpherical(this._spherical),Zt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Zt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Zt.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new P(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new P(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Zt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Rc.origin.copy(this.object.position),Rc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Rc.direction))<qv?this.object.lookAt(this.target):(r3.setFromNormalAndCoplanarPoint(this.object.up,this.target),Rc.intersectPlane(r3,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Hh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Hh||this._lastTargetPosition.distanceToSquared(this.target)>Hh?(this.dispatchEvent(s3),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?xn/60*this.autoRotateSpeed*e:xn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Zt.setFromMatrixColumn(t,0),Zt.multiplyScalar(-e),this._panOffset.add(Zt)}_panUp(e,t){this.screenSpacePanning===!0?Zt.setFromMatrixColumn(t,1):(Zt.setFromMatrixColumn(t,0),Zt.crossVectors(this.object.up,Zt)),Zt.multiplyScalar(e),this._panOffset.add(Zt)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Zt.copy(s).sub(this.target);let r=Zt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientY),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(xn*this._rotateDelta.x/t.clientHeight),this._rotateUp(xn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(xn*this._rotateDelta.x/t.clientHeight),this._rotateUp(xn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new te,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Zv(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function Kv(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Jv(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(o3),this.state=wt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function $v(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Di.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=wt.DOLLY;break;case Di.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=wt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=wt.ROTATE}break;case Di.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=wt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=wt.PAN}break;default:this.state=wt.NONE}this.state!==wt.NONE&&this.dispatchEvent(zh)}function jv(i){switch(this.state){case wt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case wt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case wt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Qv(i){this.enabled===!1||this.enableZoom===!1||this.state!==wt.NONE||(i.preventDefault(),this.dispatchEvent(zh),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(o3))}function eM(i){this.enabled!==!1&&this._handleKeyDown(i)}function tM(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Ni.ROTATE:if(this.enableRotate===!1){this.state=wt.NONE;break}this._handleTouchStartRotate(i),this.state=wt.TOUCH_ROTATE;break;case Ni.PAN:if(this.enablePan===!1){this.state=wt.NONE;break}this._handleTouchStartPan(i),this.state=wt.TOUCH_PAN;break;default:this.state=wt.NONE}break;case 2:switch(this.touches.TWO){case Ni.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=wt.TOUCH_DOLLY_PAN;break;case Ni.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=wt.TOUCH_DOLLY_ROTATE;break;default:this.state=wt.NONE}break;default:this.state=wt.NONE}this.state!==wt.NONE&&this.dispatchEvent(zh)}function nM(i){switch(this._trackPointer(i),this.state){case wt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case wt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case wt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case wt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=wt.NONE}}function iM(i){this.enabled!==!1&&i.preventDefault()}function sM(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function rM(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Cc=class{constructor(e,t,n){this.tween=0;this.fromPos=new P;this.fromTarget=new P;this.toPos=new P;this.toTarget=new P;this.currentLevel="L0";this.onLevelChange=null;this.camera=e,this.plan=n,this.controls=new Ac(e,t),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.minDistance=4,this.controls.maxDistance=3600,this.controls.maxPolarAngle=Math.PI*.485,this.controls.target.set(0,12,0);try{let s=localStorage.getItem("cityweb.cam");if(s){let r=JSON.parse(s);r.p&&r.t&&(e.position.fromArray(r.p),this.controls.target.fromArray(r.t))}else this.applyLevel(0,!1)}catch{this.applyLevel(0,!1)}}levels(){let e=[{name:"L0 \u603B\u89C8",pos:new P(240,1750,2150),target:new P(180,90,0)}];for(let t of this.plan.districts){let n=new P(t.cx,0,t.cz).normalize();e.push({name:`L1 ${t.name}`,pos:new P(t.cx-n.x*640,700,t.cz-n.z*640),target:new P(t.cx,90,t.cz)})}return e}applyLevel(e,t){var o;let n=this.levels(),s=hn(e,0,n.length-1),r=n[s];if(this.currentLevel=s===0?"L0":`L1\xB7${this.plan.districts[s-1].name}`,(o=this.onLevelChange)==null||o.call(this,this.currentLevel),!t){this.camera.position.copy(r.pos),this.controls.target.copy(r.target),this.controls.update();return}this.fromPos.copy(this.camera.position),this.fromTarget.copy(this.controls.target),this.toPos.copy(r.pos),this.toTarget.copy(r.target),this.tween=1e-4}update(e){if(this.tween>0){this.tween=Math.min(1,this.tween+e/1.4);let t=hs(this.tween);this.camera.position.lerpVectors(this.fromPos,this.toPos,t),this.controls.target.lerpVectors(this.fromTarget,this.toTarget,t),this.tween>=1&&(this.tween=0)}this.controls.update()}persist(){try{localStorage.setItem("cityweb.cam",JSON.stringify({p:this.camera.position.toArray(),t:this.controls.target.toArray()}))}catch{}}focusDistrictAt(e){let t=-1,n=1/0;this.plan.districts.forEach((s,r)=>{let o=Math.hypot(e.x-s.cx,e.z-s.cz);o<n&&(n=o,t=r)}),t>=0&&n<900&&this.applyLevel(t+1,!0)}applyStreet(e,t=6.5,n=1.95){var h;this.fromPos.copy(this.camera.position),this.fromTarget.copy(this.controls.target);let s=0,r=0,o=1/0;for(let u of this.plan.districts){let d=Math.hypot(e.x-u.cx,e.z-u.cz);d<o&&(o=d,s=u.cx,r=u.cz)}let a=e.x-s,l=e.z-r,c=Math.hypot(a,l)||1;a/=c,l/=c,this.toPos.set(e.x+a*t,n,e.z+l*t),this.toTarget.set(e.x,1.8,e.z),this.tween=1e-4,(h=this.onLevelChange)==null||h.call(this,"L2 \u8857\u666F")}};var oM=`
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
#cw-perf{position:absolute;top:14px;right:330px;font-size:10px;color:#93a4ba;background:rgba(9,14,26,.7);border:1px solid #1a2538;border-radius:6px;padding:3px 8px;font-variant-numeric:tabular-nums}
#cw-demo{position:absolute;top:14px;left:50%;transform:translateX(-50%);background:#4a1d1d;border:1px solid #f87171;color:#fecaca;font-size:10.5px;border-radius:8px;padding:4px 12px}
.cwf-data{color:#fbbf24}.cwf-quant{color:#fbbf24}.cwf-gaming{color:#5eead4}.cwf-media{color:#f472b6}.cwf-governance{color:#60a5fa}
`;function a3(i){var S,b,x,M,I,T,A,L,U,C;let e=document.createElement("style");e.textContent=oM,document.head.appendChild(e);let t=document.createElement("div");t.id="cw-hud";let n=N=>N==="gaming"?"#5eead4":N==="quant"?"#fbbf24":N==="media"?"#f472b6":"#60a5fa",s=document.createElement("div");s.className="panel",s.id="cw-tl";let r=(S=i.city)!=null?S:{};s.innerHTML=`
<div id="cw-h1">\u7845\u57FA\u57CE\u5E02 <b>FLUX VERSE</b></div>
<div id="cw-sub">\u57CE\u5373\u8D85\u4F53 \xB7 \u96C6\u56E2\u5B9E\u65F6\u955C\u50CF \xB7 three.js</div>
<div><span id="cw-clock">--:--:--</span><span id="cw-phase"></span></div>
<div id="cw-weather"></div>
<div id="cw-stats">
  <div class="st"><div class="n" id="cw-res">${((b=i.census_total)!=null?b:0).toLocaleString()}</div><div class="l">\u7845\u57FA\u5C45\u6C11</div></div>
  <div class="st"><div class="n" id="cw-games">${(x=r.games_total)!=null?x:"-"}<span style="font-size:10px;color:#5eead4"> \xB7 ${(M=r.games_active)!=null?M:"-"} \u6D3B</span></div><div class="l">\u6E38\u620F / \u5728\u4EA7</div></div>
  <div class="st"><div class="n" id="cw-commits">${((I=r.commits_total)!=null?I:0).toLocaleString()}</div><div class="l">\u7D2F\u8BA1\u63D0\u4EA4</div></div>
  <div class="st"><div class="n" id="cw-fleetn">${(T=r.fleet_online)!=null?T:0}/${i.fleet.length}</div><div class="l">\u673A\u961F\u5728\u7EBF</div></div>
</div>
<div id="cw-zones"></div>
<div id="cw-fleet"></div>`,t.appendChild(s);let o=i.reality,a=s.querySelector("#cw-weather"),l={clear:"\u6674",cloud:"\u591A\u4E91",rain:"\u96E8",snow:"\u96EA",wind:"\u98CE"};a.textContent=`\u4E0A\u6D77 ${(A=l[o.weather_kind])!=null?A:o.weather_kind} ${o.weather_temp_c}\xB0C \xB7 ${o.season==="autumn"?"\u79CB":o.season==="winter"?"\u51AC":o.season==="spring"?"\u6625":"\u590F"}`;let c=s.querySelector("#cw-zones"),h={active:"\u6D3B\u8DC3",dormant:"\u4F11\u7720"};for(let N of i.zones){let O=document.createElement("div");O.className="z";let B=Math.max(0,Math.min(1,N.activity));O.innerHTML=`<div class="zl"><span>${N.name} \xB7 ${(L=h[N.status])!=null?L:N.status}</span><span>${(B*100).toFixed(0)}%</span></div>
<div class="zb"><div class="zf" style="width:${(B*100).toFixed(0)}%;background:${n(N.id)}"></div></div>`,c.appendChild(O)}let u=s.querySelector("#cw-fleet");for(let N of i.fleet){if(N.cores<=0)continue;let O=document.createElement("div");O.className="m";let B=((U=N.current_task)!=null?U:"").substring(0,26);O.innerHTML=`<span class="dot" style="background:${N.online?"#4ade80":"#39485e"}"></span>
<span style="color:#93a4ba">${N.id}</span><span style="color:#5a6c84;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${B}</span>`,u.appendChild(O)}let d=document.createElement("div");d.className="panel",d.id="cw-tr",d.innerHTML='<h3>\u4E8B\u4EF6\u6D41 \xB7 \u771F\u5B9E\u4E8B\u4EF6\u56DE\u653E</h3><div id="cw-events"></div>',t.appendChild(d);let f=d.querySelector("#cw-events"),p=[],_=document.createElement("div");_.id="cw-bb",_.innerHTML=`\u62D6\u62FD\u65CB\u8F6C \xB7 \u6EDA\u8F6E\u7F29\u653E \xB7 <b>0</b> \u603B\u89C8 \xB7 <b>1/2/3</b> \u4E09\u57CE \xB7 \u70B9\u51FB\u57CE\u533A\u805A\u7126 \xB7 \u6570\u636E\u65F6\u70B9 <b>${E2((C=i.reality.beijing_hhmm)!=null?C:"")}</b>${Lo()?"":" \xB7 <span style='color:#f87171'>\u6F14\u793A\u6570\u636E</span>"}`,t.appendChild(_);let g=document.createElement("div");g.id="cw-cam",g.textContent="L0 \u603B\u89C8",t.appendChild(g);let m=document.createElement("div");m.id="cw-perf",t.appendChild(m);let v=document.createElement("div");if(v.id="cw-resident",v.style.cssText="position:absolute;left:14px;bottom:46px;max-width:420px;display:none;background:rgba(9,14,26,.9);border:1px solid #2a3f63;border-radius:10px;padding:10px 13px;font-size:12.5px;line-height:1.6;color:#dbe7f7",t.appendChild(v),_.innerHTML+=" \xB7 <b>R</b> \u5C45\u6C11\u8857\u666F",!Lo()){let N=document.createElement("div");N.id="cw-demo",N.textContent="DEMO DATA \xB7 \u672A\u7ECF\u6570\u636E\u5BFC\u51FA",t.appendChild(N)}document.body.appendChild(t);let E=s.querySelector("#cw-clock"),y=s.querySelector("#cw-phase");return{root:t,setClock(N,O){E.textContent=M2(N),y.textContent=`${O} \xB7 \u5317\u4EAC\u65F6\u95F4`},ticker(N){var V,H;let O=document.createElement("div");O.className="ev";let B=N.ts_utc?N.ts_utc.substring(11,16):"--:--";for(O.innerHTML=`<span class="ts">${B}</span><span class="ty cwf-${(V=N.zone)!=null?V:"governance"}">${N.type}</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#71829b">${((H=N.summary)!=null?H:"").substring(0,40)}</span>`,f.insertBefore(O,f.firstChild),p.push(O);p.length>7;){let X=p.shift();X==null||X.remove()}},setCam(N){g.textContent=N},setPerf(N,O,B){m.textContent=`draw ${N} \xB7 tri ${(O/1e3).toFixed(0)}k \xB7 ${B.toFixed(0)} fps`}}}var Xo=class i extends W{constructor(){let e=i.SkyShader,t=new Tt({name:e.name,uniforms:nn.clone(e.uniforms),vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,side:Wt,depthWrite:!1});super(new ge(1,1,1),t),this.isSky=!0}};Xo.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new P},cloudScale:{value:2e-4},cloudSpeed:{value:2e-5},cloudCoverage:{value:.4},cloudDensity:{value:.4},cloudElevation:{value:.5},showSunDisc:{value:1},time:{value:0}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calculation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( vSunDirection.y );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorption + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform float cloudScale;
		uniform float cloudSpeed;
		uniform float cloudCoverage;
		uniform float cloudDensity;
		uniform float cloudElevation;
		uniform float showSunDisc;
		uniform float time;

		// gradient at a lattice corner; sinless hash so every GPU produces the same clouds
		vec2 gradient( vec2 i ) {
			vec3 p = fract( i.xyx * vec3( 0.1031, 0.1030, 0.0973 ) );
			p += dot( p, p.yzx + 33.33 );
			return fract( ( p.xx + p.yz ) * p.zy ) * 2.0 - 1.0;
		}

		// 2D gradient noise: isotropic lobes like Perlin at value-noise cost
		float noise( vec2 p ) {
			vec2 i = floor( p );
			vec2 f = fract( p );
			vec2 u = f * f * f * ( f * ( f * 6.0 - 15.0 ) + 10.0 ); // quintic fade
			float a = dot( gradient( i ), f );
			float b = dot( gradient( i + vec2( 1.0, 0.0 ) ), f - vec2( 1.0, 0.0 ) );
			float c = dot( gradient( i + vec2( 0.0, 1.0 ) ), f - vec2( 0.0, 1.0 ) );
			float d = dot( gradient( i + vec2( 1.0, 1.0 ) ), f - vec2( 1.0, 1.0 ) );
			return mix( mix( a, b, u.x ), mix( c, d, u.x ), u.y ) * 1.6; // ~[-1,1]
		}

		// fbm; per-octave drift makes clouds billow instead of scrolling as a rigid stamp
		float fbm( vec2 p, float drift ) {
			float result = 0.0;
			float amplitude = 1.0;
			for ( int i = 0; i < 4; i ++ ) {
				result += amplitude * noise( p );
				amplitude *= 0.5;
				p = p * 2.0 + drift;
			}
			return result;
		}

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, direction.y ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - vSunDirection.y, 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisc = clamp( ( cosTheta - sunAngularDiameterCos ) * 50000.0, 0.0, 1.0 ) * showSunDisc;
			vec3 sundiscColor = ( 760.0 * sundisc ) * min( vSunE * Fex, 80.0 );

			vec3 texColor = ( Lin + L0 ) * 0.04 + sundiscColor + vec3( 0.0, 0.0003, 0.00075 );

			// Clouds
			if ( direction.y > 0.0 && cloudCoverage > 0.0 ) {

				// Project to cloud plane (higher elevation = clouds appear lower/closer)
				float elevation = mix( 1.0, 0.1, cloudElevation );
				vec2 cloudUV = direction.xz / ( direction.y * elevation );
				cloudUV *= cloudScale;
				cloudUV += time * cloudSpeed;

				// Cloud density field
				float evolve = time * cloudSpeed * 300.0;
				float cloudNoise = clamp( fbm( cloudUV * 1000.0, evolve ) * 0.7 + 0.5, 0.0, 1.0 );

				// Large-scale coverage variation: clear gaps next to dense banks
				float region = noise( cloudUV * 300.0 ) * 0.37 + 0.5;
				float cov = clamp( cloudCoverage + ( region - 0.5 ) * 0.6, 0.0, 1.0 );

				// Carve clouds where noise rises above the coverage level
				float threshold = 1.0 - cov;
				float cloudMask = smoothstep( threshold, threshold + 0.3, cloudNoise );

				// Fade clouds near horizon (adjusted by elevation)
				float horizonFade = smoothstep( 0.0, 0.03 + 0.06 * cloudElevation, direction.y );
				cloudMask *= horizonFade;

				// Cloud lighting from the sky's own radiance
				float dayFactor = smoothstep( -0.08, 0.3, vSunDirection.y );
				vec3 sunColor = vSunE * Fex * 0.22 * 0.04; // 0.22 ~ albedo/pi, 0.04 = exposure; the aerial composite adds the eye-leg extinction
				vec3 skyAmbient = Lin * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

				// Beer-powder self-shadow from the sampled density
				float depth = max( 0.0, cloudNoise - threshold );
				float beer = exp( depth * -4.0 );
				float powder = 1.0 - beer * beer; // beer*beer == exp(-8*depth)
				float shade = mix( 0.45, 1.0, clamp( beer * powder * 2.6, 0.0, 1.0 ) ); // 2.6 = 1/0.385, normalizes beer*powder peak to 1

				// Henyey-Greenstein forward lobe ( g = 0.7 ): silver lining on rims toward the sun
				float silver = clamp( 0.51 / pow( 1.49 - cosTheta * 1.4, 1.5 ), 0.0, 3.0 ); // 0.51=1-g^2, 1.49=1+g^2, 1.4=2g
				float edge = cloudMask * ( 1.0 - cloudMask ) * 4.0;

				vec3 cloudColor = skyAmbient + sunColor * shade;
				cloudColor += sunColor * silver * edge * 0.6;
				cloudColor *= max( dayFactor, 0.03 );

				// Cloud opacity via Beer's law: density sets how solid the clouds get
				float alpha = ( 1.0 - exp( depth * cloudDensity * -12.0 ) ) * horizonFade;

				// Occlude the sun disc/glow behind opaque cloud
				texColor -= L0 * 0.04 * alpha;

				// Composite through the atmosphere so distant clouds dissolve into haze
				vec3 cloudAerial = mix( texColor, cloudColor, Fex );
				texColor = mix( texColor, cloudAerial, alpha );

			}

			gl_FragColor = vec4( texColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};var aM=9e3,Gh=10,kh=2.6,lM=1.2,cM=.6,hM=.005,uM=.8,Vh=6,l3=18,dM=62,c3=-20,fM=30,pM=8e3,mM=.4;function h3(){let i=new Xo;i.scale.setScalar(aM);let e=i.material.uniforms;e.turbidity.value=Gh,e.rayleigh.value=kh,e.mieCoefficient.value=hM,e.mieDirectionalG.value=uM;let t=new W(new ct(fM,16,12),new ue({color:16777215,fog:!1})),n=new P;return{sky:i,sunSphere:t,update:(r,o)=>{let a=(r%24+24)%24,l=(a-Vh)/(l3-Vh),c;if(l>=0&&l<=1)c=dM*Math.sin(Math.PI*l);else{let p=(a-l3+24)%24/12;c=c3*Math.sin(Math.PI*p)}let h=Math.PI*(a-Vh)/12,u=as.degToRad(c),d=Math.cos(u);n.set(d*Math.cos(h),Math.sin(u),d*Math.sin(h)),e.sunPosition.value.copy(n),t.position.copy(n).multiplyScalar(pM);let f=as.clamp(-c/-c3,0,1);e.turbidity.value=Gh+(lM-Gh)*f,e.rayleigh.value=kh+(cM-kh)*f,e.cloudCoverage.value=mM*(1-f),e.time.value=o,t.visible=c>0}}}var Pc=class extends W{constructor(e,t={}){super(e),this.isWater=!0;let n=this,s=t.textureWidth!==void 0?t.textureWidth:512,r=t.textureHeight!==void 0?t.textureHeight:512,o=t.clipBias!==void 0?t.clipBias:0,a=t.alpha!==void 0?t.alpha:1,l=t.time!==void 0?t.time:0,c=t.waterNormals!==void 0?t.waterNormals:null,h=t.sunDirection!==void 0?t.sunDirection:new P(.70707,.70707,0),u=new le(t.sunColor!==void 0?t.sunColor:16777215),d=new le(t.waterColor!==void 0?t.waterColor:8355711),f=t.eye!==void 0?t.eye:new P(0,0,0),p=t.distortionScale!==void 0?t.distortionScale:20,_=t.side!==void 0?t.side:Zn,g=t.fog!==void 0?t.fog:!1,m=new fn,v=new P,E=new P,y=new P,S=new Xe,b=new P(0,0,-1),x=new Pt,M=new P,I=new P,T=new Pt,A=new Xe,L=new tn,U=new zt(s,r,{type:Xt}),C={name:"MirrorShader",uniforms:nn.merge([Ce.fog,Ce.lights,{normalSampler:{value:null},mirrorSampler:{value:null},alpha:{value:1},time:{value:0},size:{value:1},distortionScale:{value:20},textureMatrix:{value:new Xe},sunColor:{value:new le(8355711)},sunDirection:{value:new P(.70707,.70707,0)},eye:{value:new P},waterColor:{value:new le(5592405)}}]),vertexShader:`
				uniform mat4 textureMatrix;
				uniform float time;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				#include <common>
				#include <fog_pars_vertex>
				#include <shadowmap_pars_vertex>
				#include <logdepthbuf_pars_vertex>

				void main() {
					mirrorCoord = modelMatrix * vec4( position, 1.0 );
					worldPosition = mirrorCoord.xyzw;
					mirrorCoord = textureMatrix * mirrorCoord;
					vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
					gl_Position = projectionMatrix * mvPosition;

				#include <beginnormal_vertex>
				#include <defaultnormal_vertex>
				#include <logdepthbuf_vertex>
				#include <fog_vertex>
				#include <shadowmap_vertex>
			}`,fragmentShader:`
				uniform sampler2D mirrorSampler;
				uniform float alpha;
				uniform float time;
				uniform float size;
				uniform float distortionScale;
				uniform sampler2D normalSampler;
				uniform vec3 sunColor;
				uniform vec3 sunDirection;
				uniform vec3 eye;
				uniform vec3 waterColor;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				vec4 getNoise( vec2 uv ) {
					vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
					vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
					vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
					vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
					vec4 noise = texture2D( normalSampler, uv0 ) +
						texture2D( normalSampler, uv1 ) +
						texture2D( normalSampler, uv2 ) +
						texture2D( normalSampler, uv3 );
					return noise * 0.5 - 1.0;
				}

				void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
					vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
					float direction = max( 0.0, dot( eyeDirection, reflection ) );
					specularColor += pow( direction, shiny ) * sunColor * spec;
					diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
				}

				#include <common>
				#include <packing>
				#include <bsdfs>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <lights_pars_begin>
				#include <shadowmap_pars_fragment>
				#include <shadowmask_pars_fragment>

				void main() {

					#include <logdepthbuf_fragment>
					vec4 noise = getNoise( worldPosition.xz * size );
					vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

					vec3 diffuseLight = vec3(0.0);
					vec3 specularLight = vec3(0.0);

					vec3 worldToEye = eye-worldPosition.xyz;
					vec3 eyeDirection = normalize( worldToEye );
					sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );

					float distance = length(worldToEye);

					vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
					vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );

					float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
					float rf0 = 0.02;
					float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );
					vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
					vec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), reflectionSample + specularLight, reflectance );
					vec3 outgoingLight = albedo;
					gl_FragColor = vec4( outgoingLight, alpha );

					#include <tonemapping_fragment>
					#include <colorspace_fragment>
					#include <fog_fragment>	
				}`},N=new Tt({name:C.name,uniforms:nn.clone(C.uniforms),vertexShader:C.vertexShader,fragmentShader:C.fragmentShader,lights:!0,side:_,fog:g});N.uniforms.mirrorSampler.value=U.texture,N.uniforms.textureMatrix.value=A,N.uniforms.alpha.value=a,N.uniforms.time.value=l,N.uniforms.normalSampler.value=c,N.uniforms.sunColor.value=u,N.uniforms.waterColor.value=d,N.uniforms.sunDirection.value=h,N.uniforms.distortionScale.value=p,N.uniforms.eye.value=f,n.material=N,n.onBeforeRender=function(O,B,V){if(E.setFromMatrixPosition(n.matrixWorld),y.setFromMatrixPosition(V.matrixWorld),S.extractRotation(n.matrixWorld),v.set(0,0,1),v.applyMatrix4(S),M.subVectors(E,y),M.dot(v)>0)return;M.reflect(v).negate(),M.add(E),S.extractRotation(V.matrixWorld),b.set(0,0,-1),b.applyMatrix4(S),b.add(y),I.subVectors(E,b),I.reflect(v).negate(),I.add(E),L.position.copy(M),L.up.set(0,1,0),L.up.applyMatrix4(S),L.up.reflect(v),L.lookAt(I),L.far=V.far,L.updateMatrixWorld(),L.projectionMatrix.copy(V.projectionMatrix),A.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),A.multiply(L.projectionMatrix),A.multiply(L.matrixWorldInverse),m.setFromNormalAndCoplanarPoint(v,E),m.applyMatrix4(L.matrixWorldInverse),x.set(m.normal.x,m.normal.y,m.normal.z,m.constant);let H=L.projectionMatrix;T.x=(Math.sign(x.x)+H.elements[8])/H.elements[0],T.y=(Math.sign(x.y)+H.elements[9])/H.elements[5],T.z=-1,T.w=(1+H.elements[10])/H.elements[14],x.multiplyScalar(2/x.dot(T)),H.elements[2]=x.x,H.elements[6]=x.y,H.elements[10]=x.z+1-o,H.elements[14]=x.w,f.setFromMatrixPosition(V.matrixWorld);let X=O.getRenderTarget(),J=O.xr.enabled,j=O.shadowMap.autoUpdate;n.visible=!1,O.xr.enabled=!1,O.shadowMap.autoUpdate=!1,O.setRenderTarget(U),O.state.buffers.depth.setMask(!0),O.autoClear===!1&&O.clear(),O.render(B,L),n.visible=!0,O.xr.enabled=J,O.shadowMap.autoUpdate=j,O.setRenderTarget(X);let ce=V.viewport;ce!==void 0&&O.state.viewport(ce)}}};var gM=[[31.218,121.489],[31.226,121.4908],[31.231,121.493],[31.234,121.4965],[31.236,121.5],[31.239,121.503],[31.243,121.5018],[31.248,121.502],[31.254,121.5035],[31.26,121.5065],[31.266,121.51],[31.272,121.5145]],Ic=230;function _M(i){let e=i>>>0;return()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function u3(i){return i*i*(3-2*i)}function xM(i,e,t,n){let s=Math.floor(t),r=Math.floor(n),o=(s%e+e)%e,a=(r%e+e)%e,l=(o+1)%e,c=(a+1)%e,h=u3(t-s),u=u3(n-r),d=i[a*e+o]*(1-h)+i[a*e+l]*h,f=i[c*e+o]*(1-h)+i[c*e+l]*h;return d*(1-u)+f*u}function yM(i=256){let e=document.createElement("canvas");e.width=i,e.height=i;let t=e.getContext("2d");if(!t)throw new Error("riverWater: canvas 2d context unavailable");let n=t.createImageData(i,i),s=_M(1095766822),r=new Float32Array(i*i);for(let c=0;c<5;c++){let h=4<<c,u=Math.pow(.6,c),d=new Float32Array(h*h);for(let f=0;f<d.length;f++)d[f]=s()*2-1;for(let f=0;f<i;f++){let p=f/i*h;for(let _=0;_<i;_++){let g=_/i*h;r[f*i+_]+=u*xM(d,h,g,p)}}}let o=7,a=n.data;for(let c=0;c<i;c++){let h=(c-1+i)%i,u=(c+1)%i;for(let d=0;d<i;d++){let f=(d-1+i)%i,p=(d+1)%i,_=(r[c*i+p]-r[c*i+f])*o,g=(r[u*i+d]-r[h*i+d])*o,m=1/Math.sqrt(_*_+g*g+1),v=(c*i+d)*4;a[v]=Math.round((-_*m*.5+.5)*255),a[v+1]=Math.round((-g*m*.5+.5)*255),a[v+2]=Math.round((m*.5+.5)*255),a[v+3]=255}}t.putImageData(n,0,0);let l=new ji(e);return l.wrapS=Ji,l.wrapT=Ji,l}function vM(){let i=gM.map(([o,a])=>({x:Bt(a),z:Ht(o)})),e=[],t=[],n=[],s=[];for(let o=0;o<i.length;o++){let a=i[o],l=i[Math.min(o+1,i.length-1)],c=i[Math.max(o-1,0)],h=l.x-c.x,u=l.z-c.z,d=Math.hypot(h,u)||1,f=-u/d,p=h/d;if(e.push(a.x+f*Ic,-(a.z+p*Ic),0),e.push(a.x-f*Ic,-(a.z-p*Ic),0),t.push(0,0,1,0,0,1),n.push(o/(i.length-1),0,o/(i.length-1),1),o<i.length-1){let _=o*2;s.push(_,_+2,_+1,_+1,_+2,_+3)}}let r=new gt;return r.setAttribute("position",new je(e,3)),r.setAttribute("normal",new je(t,3)),r.setAttribute("uv",new je(n,2)),r.setIndex(s),r}function d3(){let i=new Pc(vM(),{textureWidth:512,textureHeight:512,waterNormals:yM(),sunDirection:new P(.3,.8,.2).normalize(),waterColor:662058,distortionScale:3.7,fog:!0});return i.rotation.x=-Math.PI/2,i.position.y=.4,i.renderOrder=2,{water:i,update:(e,t)=>{i.material.uniforms.time.value+=e*.8}}}function MM(i,e,t,n,s=1){let{x:r,z:o}=sh({lat:e,lon:t});i.root.position.set(r,0,o),i.root.rotation.y=n,i.root.scale.setScalar(s)}function EM(){var et;let i=c2(),e=document.getElementById("app"),t=new ec({antialias:!0,powerPreference:"high-performance"});t.setPixelRatio(Math.min(window.devicePixelRatio,2)),t.setSize(window.innerWidth,window.innerHeight),t.shadowMap.enabled=!0,t.shadowMap.type=ll,t.toneMapping=ss,t.toneMappingExposure=1.05,e.appendChild(t.domElement);let n=new Fr,s=new tn(48,window.innerWidth/window.innerHeight,.3,9e3);s.position.set(0,1600,1900);let r=new ao(16773852,2.2);r.castShadow=!0,r.shadow.mapSize.set(2048,2048),r.shadow.camera.left=-1500,r.shadow.camera.right=1500,r.shadow.camera.top=1500,r.shadow.camera.bottom=-1500,r.shadow.camera.far=4200,r.shadow.bias=-6e-4,n.add(r);let o=new ro(9085120,2765378,.8);n.add(o);let a=K2(),l=h3();n.add(l.sky),n.add(l.sunSphere),n.add(a.stars);let c=new W(new Yr(3600,64),new ke({color:395794,roughness:.96,metalness:0}));c.rotation.x=-Math.PI/2,c.receiveShadow=!0,n.add(c);let h=x2(i);n.add(h.root);let u=h.plan,d=y2();d.root.position.set(h.islandPos.x,9,h.islandPos.z),d.root.scale.setScalar(2.6),n.add(d.root);let f=h.landmarkSlots,p=[],_=(ie,ye)=>{MM(ie,ye.lat,ye.lon,ye.rotY),n.add(ie.root),p.push(ie)};_(U2(),f.pearl),_(O2(),f.jinmao),_(G2(),f.shanghaiTower),_(V2(),f.swfc),_(q2(),f.whiteMagnolia),_(Z2(),f.waibaidu);let g=v2(u);n.add(g.root);let m=b2(i);m.root.position.set(h.islandPos.x,0,h.islandPos.z),n.add(m.root);let v=R2(u,i);n.add(v.root);let E=Q2(u);n.add(E.root);let y=nf(u);n.add(y.root);let S=rf();n.add(S.root);let b=df();n.add(b.root);let x=pf(u);n.add(x.root);let M=Pf(u);n.add(M.root);let I=Of(),T=sh({lat:31.239,lon:121.4868});I.root.position.set(T.x,0,T.z),I.root.rotation.y=Math.PI,n.add(I.root);let A=ip();n.add(A.root);let L=Vf(u);n.add(L.root);let U=rp(u,i);n.add(U.root);let C=dp();n.add(C.root);let N=Ep();n.add(N.root);let O=Rp(u);n.add(O.root);let B=d3();n.add(B.water);let V=Bp(i);n.add(V.root);let H=Zp(L.specs);n.add(H.root);let X=jp(i);n.add(X.root);let J=t3(u,i);n.add(J.root);let j=J2(u,i);n.add(j.points);let ce=i3(t,n,s),k=a3(i),Q=new Cc(s,t.domElement,u);Q.onLevelChange=ie=>k.setCam(ie);let ae=new lc(n,r,o,a,i);ae.attachMaterials(null,c.material),ae.realMats=h.bodyMats,ae.waterMat=h.waterMat;for(let ie of h.flowMats)ae.flowMats.push(ie);ae.dustMat=j.mat;let Pe=new cc(n,u,d,ae,(et=i.events_tail)!=null?et:[]);Pe.hooks.onEvent=ie=>{k.ticker(ie),ie.type==="TRANSFER"&&E.pushEvent(ie),O.pushEvent(ie)};let he=new fc(s,t.domElement);he.setColliders(h.colliders),he.setEnterable(L.specs),window.addEventListener("keydown",ie=>{if(ie.key==="0"&&Q.applyLevel(0,!0),ie.key==="1"&&Q.applyLevel(1,!0),ie.key==="2"&&Q.applyLevel(2,!0),ie.key==="3"&&Q.applyLevel(3,!0),ie.key==="f"||ie.key==="F"){if(!he.enabled()&&L.specs.length>0){let Ge=s.position,nt=0,z=1/0;L.specs.forEach((ot,Mt)=>{let ve=Math.hypot(Ge.x-ot.cx,Ge.z-ot.cz);ve<z&&(z=ve,nt=Mt)});let Rt=L.specs[nt];Ge.set(Rt.cx,1.8,Rt.cz+Rt.hd+6),s.lookAt(Rt.cx,12,Rt.cz)}let ye=he.toggle();k.setCam(ye?"L2 \u6B65\u884C":Q.currentLevel),Q.controls.enabled=!ye}if((ie.key==="t"||ie.key==="T")&&he.enabled()&&L.specs.length>0){let ye=s.position,Ge=0,nt=1/0;L.specs.forEach((Rt,ot)=>{let Mt=Math.hypot(ye.x-Rt.cx,ye.z-Rt.cz);Mt<nt&&(nt=Mt,Ge=ot)});let z=L.specs[(Ge+1)%L.specs.length];ye.set(z.cx,1.8,z.cz+z.hd+6),s.lookAt(z.cx,12,z.cz),k.setCam("L2 \u4F20\u9001 \u2192 \u9986")}});let De=0,rt=0;t.domElement.addEventListener("pointerdown",ie=>{De=ie.clientX,rt=ie.clientY}),t.domElement.addEventListener("pointerup",ie=>{if(Math.hypot(ie.clientX-De,ie.clientY-rt)>6)return;let ye=new te(ie.clientX/window.innerWidth*2-1,-(ie.clientY/window.innerHeight)*2+1),Ge=new co;Ge.setFromCamera(ye,s);let nt=-Ge.ray.origin.y/Ge.ray.direction.y;if(nt>0){let z=Ge.ray.origin.clone().add(Ge.ray.direction.clone().multiplyScalar(nt));Q.focusDistrictAt(z)}}),window.addEventListener("resize",()=>{s.aspect=window.innerWidth/window.innerHeight,s.updateProjectionMatrix(),t.setSize(window.innerWidth,window.innerHeight),ce.setSize(window.innerWidth,window.innerHeight)});let Ie=()=>k.setClock(new Date,ae.label());Ie(),window.setInterval(Ie,1e3),window.setInterval(()=>{Q.persist(),location.reload()},600*1e3),window.setInterval(()=>Q.persist(),3e4),window.addEventListener("beforeunload",()=>Q.persist());let Ve=new ho;window.__cwCamera=s;let Je=0,re=0,pe=performance.now();window.setInterval(()=>{let ie=t.info,ye=performance.now(),Ge=Je*1e3/Math.max(1,ye-pe);k.setPerf(ie.render.calls,ie.render.triangles,Ge),Je=0,pe=ye},500);let _e=-1,Ue=ie=>{let ye=v.anchors;if(!ye.length)return;_e=typeof ie=="number"?(ie%ye.length+ye.length)%ye.length:(_e+1)%ye.length;let Ge=ye[_e];v.setLabels(!1),Q.applyStreet(Ge.pos),k.setCam(`\u5C45\u6C11 ${_e+1}/${ye.length} \xB7 ${Ge.name}`);let nt=document.getElementById("cw-resident");nt&&(nt.innerHTML=`<b>${Ge.name}</b>\u3000<span style="color:#8aa0c4">${Ge.profession}</span><br><span style="color:#dbe7f7">${(Ge.ring||"\uFF08\u4ECA\u65E5\u6682\u65E0\u5E74\u8F6E\uFF09").slice(0,90)}</span>`,nt.style.display="block")};window.__CITY_STREET__=Ue,window.addEventListener("keydown",ie=>{(ie.key==="r"||ie.key==="R")&&Ue()});function Te(){requestAnimationFrame(Te);let ie=Math.min(.1,Ve.getDelta()),ye=Ve.elapsedTime;ae.update(),Pe.update(ye),m.update(ie,ye),v.update(ie,ye),E.update(ie,ye),X.update(ie,ye),J.update(ie,ye,ae.hour()),y.update(ie,ye,ae.hour()),S.update(ie,ye),b.update(ie,ye),x.update(ie,ye),M.update(ie,ye),I.update(ie,ye),A.update(ie,ye),L.update(ie,ye),U.update(ie,ye),C.update(ie,ye),N.update(ie,ye),O.update(ie,ye),V.update(ie,ye,ae.hour()),H.update(ie,ye,ae.hour()),l.update(ae.hour(),ye),B.update(ie,ye),he.update(ie);for(let Ge of p)Ge.update(ie,ye);he.enabled()||Q.update(ie),ce.render(),Je++,re+=ie}Te(),console.log(`[CityWeb] real-geography city: footprints=${h.buildingCount} live=${Lo()}`)}EM();})();
