// Moved to ./dist/instantclick.js

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.InstantClick=t()}(this,function(){"use strict";return function(e,t,n){function r(e){var t=e.indexOf("#");return-1==t?e:e.substr(0,t)}function i(e){for(;e&&"A"!=e.nodeName;)e=e.parentNode;return e}function o(e){do{if(!e.hasAttribute)break;if(e.hasAttribute("data-instant"))return!1;if(e.hasAttribute("data-no-instant"))return!0}while(e=e.parentNode);return!1}function a(e){var n=t.protocol+"//"+t.host;return!(e.target||e.hasAttribute("download")||0!=e.href.indexOf(n+"/")||e.href.indexOf("#")>-1&&r(e.href)==I||o(e))}function f(e){for(var t=Array.prototype.slice.call(arguments,1),n=!1,r=0;r<ee[e].length;r++)if("receive"==e){var i=ee[e][r].apply(window,t);i&&("body"in i&&(t[1]=i.body),"title"in i&&(t[2]=i.title),n=i)}else ee[e][r].apply(window,t);return n}function l(i,o,a,l){if(c(),e.documentElement.replaceChild(o,e.body),e.title=i,a){v("remove"),a!=t.href&&(history.pushState(null,null,a),n.indexOf(" CriOS/")>-1&&(e.title==i?e.title=i+String.fromCharCode(160):e.title=i));var s=a.indexOf("#"),h=s>-1&&e.getElementById(a.substr(s+1)),m=0;if(h)for(;h.offsetParent;)m+=h.offsetTop,h=h.offsetParent;"requestAnimationFrame"in window?requestAnimationFrame(function(){scrollTo(0,m)}):scrollTo(0,m),u(),(I=r(a))in re&&(re[I]=[]),te[I]={},g(function(e){return!e.hasAttribute("data-instant-track")}),f("change",!1)}else scrollTo(0,l),R.abort(),d(),g(function(e){return e.hasAttribute("data-instant-restore")}),p(),f("restore")}function d(){Q=!1,V=!1}function s(e){return e.replace(/<noscript[\s\S]+?<\/noscript>/gi,"")}function c(){for(var e=0;e<ne.length;e++)"object"==typeof ne[e]&&"abort"in ne[e]&&(ne[e].instantclickAbort=!0,ne[e].abort());ne=[]}function u(){for(var e in te[I]){var t=te[I][e];window.clearTimeout(t.realId),t.delayLeft=t.delay-+new Date+t.timestamp}}function p(){for(var e in te[I])if("delayLeft"in te[I][e]){for(var t=[te[I][e].callback,te[I][e].delayLeft],n=0;n<te[I][e].params.length;n++)t.push(te[I][e].params[n]);y(t,te[I][e].isRepeating,te[I][e].delay),delete te[I][e]}}function h(){R.abort(),d()}function v(e){if(I in re)for(var t=0;t<re[I].length;t++)window[e+"EventListener"].apply(window,re[I][t])}function g(t){var n,r,i,o,a,f=e.body.getElementsByTagName("script"),l=[];for(a=0;a<f.length;a++)l.push(f[a]);for(a=0;a<l.length;a++)if((n=l[a])&&t(n)){r=e.createElement("script");for(var d=0;d<n.attributes.length;d++)r.setAttribute(n.attributes[d].name,n.attributes[d].value);r.textContent=n.textContent,i=n.parentNode,o=n.nextSibling,i.removeChild(n),i.insertBefore(r,o)}}function m(){for(var t,n,r=e.querySelectorAll("[data-instant-track]"),i=0;i<r.length;i++)n=(t=r[i]).getAttribute("href")||t.getAttribute("src")||t.textContent,$.push(n)}function y(e,t,n){var r,i=e[0],o=e[1],a=[].slice.call(e,2),f=+new Date,l=++G;r=t?function(t){i(t),delete te[I][l],e[0]=i,e[1]=o,y(e,!0)}:function(e){i(e),delete te[I][l]},e[0]=r,void 0!=n&&(f+=o-n,o=n);var d=window.setTimeout.apply(window,e);return te[I][l]={realId:d,timestamp:f,callback:i,delay:o,params:a,isRepeating:t},-l}function b(e){var t=i(e.target);t&&a(t)&&T(t.href)}function w(e){if(!(B>+new Date-500||+new Date-J<100)){var t=i(e.target);t&&t!=i(e.relatedTarget)&&a(t)&&(t.addEventListener("mouseout",L),V||(M=t.href,N=O(T,_)))}}function E(e){B=+new Date;var t=i(e.target);t&&a(t)&&(H&&(D(H),H=!1),t.addEventListener("touchend",k),t.addEventListener("touchcancel",k),T(t.href))}function x(){e.addEventListener("click",A)}function A(t){if(e.removeEventListener("click",A),H&&(D(H),H=!1),!t.defaultPrevented){var n=i(t.target);n&&a(n)&&(0!=t.button||t.metaKey||t.ctrlKey||(t.preventDefault(),C(n.href)))}}function L(e){if(i(e.target)!=i(e.relatedTarget))return N?(D(N),void(N=!1)):void(Q&&!V&&(R.abort(),d()))}function k(e){Q&&!V&&(H=O(h,500))}function P(){if(2==R.readyState){var n=R.getResponseHeader("Content-Type");n&&/^text\/html/i.test(n)||(Y=!0)}if(!(R.readyState<4)){if(0==R.status)return Z=!0,void(V&&(f("exit",W,"network error"),t.href=W));if(Y)V&&(f("exit",W,"non-html content-type"),t.href=W);else{var i=e.implementation.createHTMLDocument("");i.documentElement.innerHTML=s(R.responseText),X=i.title,z=i.body;var o=f("receive",W,z,X);o&&("body"in o&&(z=o.body),"title"in o&&(X=o.title));var a=r(W);U[a]={body:z,title:X,scrollPosition:a in U?U[a].scrollPosition:0};var l,d,c=i.querySelectorAll("[data-instant-track]");if(c.length!=$.length)j=!0;else for(var u=0;u<c.length;u++)d=(l=c[u]).getAttribute("href")||l.getAttribute("src")||l.textContent,-1==$.indexOf(d)&&(j=!0);V&&(V=!1,C(W))}}}function S(){var e=r(t.href);if(e!=I){if(V&&(d(),R.abort()),!(e in U))return f("exit",t.href,"not in history"),void(e==t.href?t.href=t.href:t.reload());U[I].scrollPosition=pageYOffset,u(),v("remove"),I=e,l(U[e].title,U[e].body,!1,U[e].scrollPosition),v("add")}}function T(e){N&&(D(N),N=!1),e||(e=M),Q&&(e==W||V)||(Q=!0,V=!1,W=e,z=!1,Y=!1,Z=!1,j=!1,f("preload"),R.open("GET",e),R.timeout=9e4,R.send())}function C(e){return J=+new Date,N||!Q?N&&W&&W!=e?(f("exit",e,"click occured while preloading planned"),void(t.href=e)):(T(e),f("wait"),void(V=!0)):V?(f("exit",e,"clicked on a link while waiting for another page to display"),void(t.href=e)):Y?(f("exit",W,"non-html content-type"),void(t.href=W)):Z?(f("exit",W,"network error"),void(t.href=W)):j?(f("exit",W,"different assets"),void(t.href=W)):z?(U[I].scrollPosition=pageYOffset,d(),void l(X,z,W)):(f("wait"),void(V=!0))}function O(){return y(arguments,!1)}function D(e){e=-e;for(var t in te)e in te[t]&&(window.clearTimeout(te[t][e].realId),delete te[t][e])}function q(e,t,n){var r=ie[t][e].indexOf(n);r>-1&&ie[t][e].splice(r,1)}var I,M,N,B,F,H,R,Y,j,K,G=0,U={},W=!1,X=!1,z=!1,J=0,Q=!1,V=!1,Z=!1,$=[],_=65,ee={preload:[],receive:[],wait:[],change:[],restore:[],exit:[]},te={},ne=[],re={},ie={};Element.prototype.matches||(Element.prototype.matches=Element.prototype.webkitMatchesSelector||Element.prototype.msMatchesSelector||function(t){for(var n=this,r=e.querySelectorAll(t),i=0;i<r.length;i++)if(r[i]==n)return!0;return!1});var oe=!1;if("pushState"in history&&"file:"!=t.protocol){oe=!0;var ae=n.indexOf("Android ");if(ae>-1){var fe=parseFloat(n.substr(ae+"Android ".length));if(fe<4.4&&(oe=!1,fe>=4))for(var le=[/ Chrome\//,/ UCBrowser\//,/ Firefox\//,/ Windows Phone /],de=0;de<le.length;de++)if(le[de].test(n)){oe=!0;break}}}return{supported:oe,init:function(n){oe?F||(F=!0,"mousedown"==n?K=!0:"number"==typeof n&&(_=n),I=r(t.href),te[I]={},U[I]={body:e.body,title:e.title,scrollPosition:pageYOffset},"loading"==e.readyState?e.addEventListener("DOMContentLoaded",m):m(),(R=new XMLHttpRequest).addEventListener("readystatechange",P),e.addEventListener("touchstart",E,!0),K?e.addEventListener("mousedown",b,!0):e.addEventListener("mouseover",w,!0),e.addEventListener("click",x,!0),addEventListener("popstate",S)):f("change",!0)},on:function(e,t){ee[e].push(t),"change"==e&&t(!J)},setTimeout:O,setInterval:function(){return y(arguments,!0)},clearTimeout:D,xhr:function(e){ne.push(e)},addPageEvent:function(){I in re||(re[I]=[]),re[I].push(arguments),addEventListener.apply(window,arguments)},removePageEvent:function(){var e=arguments;if(I in re)e:for(var t=0;t<re[I].length;t++)if(e.length==re[I][t].length){for(var n=0;n<re[I][t].length;n++)if(e[n]!=re[I][t][n])continue e;re[I].splice(t,1)}},addEvent:function(t,r,i){if(!(r in ie)&&(ie[r]={},e.addEventListener(r,function(e){var t=e.target;for(e.originalStopPropagation=e.stopPropagation,e.stopPropagation=function(){this.isPropagationStopped=!0,this.originalStopPropagation()};t&&1==t.nodeType;){for(var n in ie[r])if(t.matches(n)){for(var i=0;i<ie[r][n].length;i++)ie[r][n][i].call(t,e);if(e.isPropagationStopped)return;break}t=t.parentNode}},!1),"click"==r&&/iP(?:hone|ad|od)/.test(n))){var o=e.createElement("style");o.setAttribute("instantclick-mobile-safari-cursor",""),o.textContent="body { cursor: pointer !important; }",e.head.appendChild(o)}t in ie[r]||(ie[r][t]=[]),q(t,r,i),ie[r][t].push(i)},removeEvent:q}}(document,location,navigator.userAgent)});