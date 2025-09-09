function t(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var l=t.length-1;l>=0;l--)(o=t[l])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=window,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;class n{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}}const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new n(i,t,s)},l=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t;var a;const c=window,h=c.trustedTypes,d=h?h.emptyScript:"",u=c.reactiveElementPolyfillSupport,p={toAttribute(t,e){switch(e){case Boolean:t=t?d:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>e!==t&&(e==e||t==t),f={attribute:!0,type:String,converter:p,reflect:!1,hasChanged:v},$="finalized";class _ extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))})),t}static createProperty(t,e=f){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const o=this[t];this[e]=s,this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||f}static finalize(){if(this.hasOwnProperty($))return!1;this[$]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{i?t.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):s.forEach((i=>{const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}))})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=f){var s;const o=this.constructor._$Ep(t,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:p).toAttribute(e,i.type);this._$El=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,o=s._$Ev.get(t);if(void 0!==o&&this._$El!==o){const t=s.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:p;this._$El=o,this[o]=n.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||v)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}var g;_[$]=!0,_.elementProperties=new Map,_.elementStyles=[],_.shadowRootOptions={mode:"open"},null==u||u({ReactiveElement:_}),(null!==(a=c.reactiveElementVersions)&&void 0!==a?a:c.reactiveElementVersions=[]).push("1.6.3");const y=window,m=y.trustedTypes,b=m?m.createPolicy("lit-html",{createHTML:t=>t}):void 0,w="$lit$",A=`lit$${(Math.random()+"").slice(9)}$`,E="?"+A,S=`<${E}>`,x=document,C=()=>x.createComment(""),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,P="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,R=/>/g,N=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),M=/'/g,T=/"/g,j=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),z=Symbol.for("lit-noChange"),D=Symbol.for("lit-nothing"),B=new WeakMap,L=x.createTreeWalker(x,129,null,!1);function V(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==b?b.createHTML(e):e}const q=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":"",r=U;for(let e=0;e<i;e++){const i=t[e];let l,a,c=-1,h=0;for(;h<i.length&&(r.lastIndex=h,a=r.exec(i),null!==a);)h=r.lastIndex,r===U?"!--"===a[1]?r=H:void 0!==a[1]?r=R:void 0!==a[2]?(j.test(a[2])&&(o=RegExp("</"+a[2],"g")),r=N):void 0!==a[3]&&(r=N):r===N?">"===a[0]?(r=null!=o?o:U,c=-1):void 0===a[1]?c=-2:(c=r.lastIndex-a[2].length,l=a[1],r=void 0===a[3]?N:'"'===a[3]?T:M):r===T||r===M?r=N:r===H||r===R?r=U:(r=N,o=void 0);const d=r===N&&t[e+1].startsWith("/>")?" ":"";n+=r===U?i+S:c>=0?(s.push(l),i.slice(0,c)+w+i.slice(c)+A+d):i+A+(-2===c?(s.push(void 0),e):d)}return[V(t,n+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class F{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,l=this.parts,[a,c]=q(t,e);if(this.el=F.createElement(a,i),L.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=L.nextNode())&&l.length<r;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(w)||e.startsWith(A)){const i=c[n++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+w).split(A),e=/([.?@])?(.*)/.exec(i);l.push({type:1,index:o,name:e[2],strings:t,ctor:"."===e[1]?Z:"?"===e[1]?X:"@"===e[1]?Y:J})}else l.push({type:6,index:o})}for(const e of t)s.removeAttribute(e)}if(j.test(s.tagName)){const t=s.textContent.split(A),e=t.length-1;if(e>0){s.textContent=m?m.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],C()),L.nextNode(),l.push({type:2,index:++o});s.append(t[e],C())}}}else if(8===s.nodeType)if(s.data===E)l.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(A,t+1));)l.push({type:7,index:o}),t+=A.length-1}o++}}static createElement(t,e){const i=x.createElement("template");return i.innerHTML=t,i}}function W(t,e,i=t,s){var o,n,r,l;if(e===z)return e;let a=void 0!==s?null===(o=i._$Co)||void 0===o?void 0:o[s]:i._$Cl;const c=k(e)?void 0:e._$litDirective$;return(null==a?void 0:a.constructor)!==c&&(null===(n=null==a?void 0:a._$AO)||void 0===n||n.call(a,!1),void 0===c?a=void 0:(a=new c(t),a._$AT(t,i,s)),void 0!==s?(null!==(r=(l=i)._$Co)&&void 0!==r?r:l._$Co=[])[s]=a:i._$Cl=a),void 0!==a&&(e=W(t,a._$AS(t,e.values),a,s)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,o=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:x).importNode(i,!0);L.currentNode=o;let n=L.nextNode(),r=0,l=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new K(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new tt(n,this,t)),this._$AV.push(e),a=s[++l]}r!==(null==a?void 0:a.index)&&(n=L.nextNode(),r++)}return L.currentNode=x,o}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class K{constructor(t,e,i,s){var o;this.type=2,this._$AH=D,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(o=null==s?void 0:s.isConnected)||void 0===o||o}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=W(this,t,e),k(t)?t===D||null==t||""===t?(this._$AH!==D&&this._$AR(),this._$AH=D):t!==this._$AH&&t!==z&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>O(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==D&&k(this._$AH)?this._$AA.nextSibling.data=t:this.$(x.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,o="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=F.createElement(V(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===o)this._$AH.v(i);else{const t=new G(o,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=B.get(t.strings);return void 0===e&&B.set(t.strings,e=new F(t)),e}T(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new K(this.k(C()),this.k(C()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class J{constructor(t,e,i,s,o){this.type=1,this._$AH=D,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=D}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=W(this,t,e,0),n=!k(t)||t!==this._$AH&&t!==z,n&&(this._$AH=t);else{const s=t;let r,l;for(t=o[0],r=0;r<o.length-1;r++)l=W(this,s[i+r],e,r),l===z&&(l=this._$AH[r]),n||(n=!k(l)||l!==this._$AH[r]),l===D?t=D:t!==D&&(t+=(null!=l?l:"")+o[r+1]),this._$AH[r]=l}n&&!s&&this.j(t)}j(t){t===D?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class Z extends J{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===D?void 0:t}}const Q=m?m.emptyScript:"";class X extends J{constructor(){super(...arguments),this.type=4}j(t){t&&t!==D?this.element.setAttribute(this.name,Q):this.element.removeAttribute(this.name)}}class Y extends J{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=W(this,t,e,0))&&void 0!==i?i:D)===z)return;const s=this._$AH,o=t===D&&s!==D||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==D&&(s===D||o);o&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class tt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){W(this,t)}}const et=y.litHtmlPolyfillSupport;null==et||et(F,K),(null!==(g=y.litHtmlVersions)&&void 0!==g?g:y.litHtmlVersions=[]).push("2.8.0");var it,st;class ot extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,o;const n=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let r=n._$litPart$;if(void 0===r){const t=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:null;n._$litPart$=r=new K(e.insertBefore(C(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return z}}ot.finalized=!0,ot._$litElement$=!0,null===(it=globalThis.litElementHydrateSupport)||void 0===it||it.call(globalThis,{LitElement:ot});const nt=globalThis.litElementPolyfillSupport;null==nt||nt({LitElement:ot}),(null!==(st=globalThis.litElementVersions)&&void 0!==st?st:globalThis.litElementVersions=[]).push("3.3.3");const rt=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){customElements.define(t,e)}}})(t,e),lt=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};function at(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):lt(t,e)}var ct;null===(ct=window.HTMLSlotElement)||void 0===ct||ct.prototype.assignedElements;const ht=Object.freeze({left:0,top:0,width:16,height:16}),dt=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),ut=Object.freeze({...ht,...dt});Object.freeze({...ut,body:"",hidden:!1});const pt=Object.freeze({width:null,height:null}),vt=Object.freeze({...pt,...dt}),ft=/(-?[0-9.]*[0-9]+[0-9.]*)/g,$t=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function _t(t,e,i){if(1===e)return t;if(i=i||100,"number"==typeof t)return Math.ceil(t*e*i)/i;if("string"!=typeof t)return t;const s=t.split(ft);if(null===s||!s.length)return t;const o=[];let n=s.shift(),r=$t.test(n);for(;;){if(r){const t=parseFloat(n);isNaN(t)?o.push(n):o.push(Math.ceil(t*e*i)/i)}else o.push(n);if(n=s.shift(),void 0===n)return o.join("");r=!r}}const gt=t=>{var e,i;if(!t)return null;let s;return"iconify"==t.renderer?s=function(t,e){const i={...ut,...t},s={...vt,...e},o={left:i.left,top:i.top,width:i.width,height:i.height};let n=i.body;[i,s].forEach((t=>{const e=[],i=t.hFlip,s=t.vFlip;let r,l=t.rotate;switch(i?s?l+=2:(e.push("translate("+(o.width+o.left).toString()+" "+(0-o.top).toString()+")"),e.push("scale(-1 1)"),o.top=o.left=0):s&&(e.push("translate("+(0-o.left).toString()+" "+(o.height+o.top).toString()+")"),e.push("scale(1 -1)"),o.top=o.left=0),l<0&&(l-=4*Math.floor(l/4)),l%=4,l){case 1:r=o.height/2+o.top,e.unshift("rotate(90 "+r.toString()+" "+r.toString()+")");break;case 2:e.unshift("rotate(180 "+(o.width/2+o.left).toString()+" "+(o.height/2+o.top).toString()+")");break;case 3:r=o.width/2+o.left,e.unshift("rotate(-90 "+r.toString()+" "+r.toString()+")")}l%2==1&&(o.left!==o.top&&(r=o.left,o.left=o.top,o.top=r),o.width!==o.height&&(r=o.width,o.width=o.height,o.height=r)),e.length&&(n=function(t,e,i){const s=function(t,e="defs"){let i="";const s=t.indexOf("<"+e);for(;s>=0;){const o=t.indexOf(">",s),n=t.indexOf("</"+e);if(-1===o||-1===n)break;const r=t.indexOf(">",n);if(-1===r)break;i+=t.slice(o+1,n).trim(),t=t.slice(0,s).trim()+t.slice(r+1)}return{defs:i,content:t}}(t);return o=s.defs,n=e+s.content+i,o?"<defs>"+o+"</defs>"+n:n;var o,n}(n,'<g transform="'+e.join(" ")+'">',"</g>"))}));const r=s.width,l=s.height,a=o.width,c=o.height;let h,d;null===r?(d=null===l?"1em":"auto"===l?c:l,h=_t(d,a/c)):(h="auto"===r?a:r,d=null===l?_t(h,c/a):"auto"===l?c:l);const u={},p=(t,e)=>{(t=>"unset"===t||"undefined"===t||"none"===t)(e)||(u[t]=e.toString())};p("width",h),p("height",d);const v=[o.left,o.top,a,c];return u.viewBox=v.join(" "),{attributes:u,viewBox:v,body:n}}(t):(s=t,s.attributes={height:"1em",width:"1em",viewBox:t.viewBox.join(" ")}),{path:null!==(e=t.path)&&void 0!==e?e:"",secondaryPath:null!==(i=t.path2)&&void 0!==i?i:"",viewBox:s.viewBox,format:"custom_icons",innerSVG:s.body,attributes:s.attributes}};let yt=class extends ot{async _download_iconify(){this.dispatchEvent(new Event("clear")),this.download_button.disabled=!0,await this.hass.connection.sendMessagePromise({type:"custom_icons/iconify_download"}),this.dispatchEvent(new Event("reload")),this.download_button.disabled=!1}async _flush_icons(){await this.hass.connection.sendMessage({type:"custom_icons/flush_icons"}),this.dispatchEvent(new Event("reload"))}render(){return I`
      <ha-card outlined>
        <h1 class="card-header">Custom icons</h1>
        <div class="card-content">
          <ha-alert alert-type="warning" title="Dangers of external SVG icons">
            SVG icons cat theoretically contain javascript and listeners or link
            to external resources. <br />

            Home Assistant normally protects against this, but in order to
            enable advanced features such as duotone or color support
            <b>that protection is disabled for all Custom Icons</b>. <br />

            Iconify icons are allegedly validated and cleaned from any such
            potentially harmful elements, but be careful. <br />
            <br />

            I as the author of this Home Assistant component take no
            responsibility for the content of the icon sets.
          </ha-alert>

          <br />
          <ha-settings-row>
            <span slot="heading">Reload Local Icons</span>
            <span slot="description">
              Reload icons in the
              <tt>custom_icons</tt>
              directory<br />
              (this includes Fontawesome-pro icons if available)
            </span>
            <ha-button @click=${()=>this._flush_icons()}>Reload</ha-button>
          </ha-settings-row>
          <br />

          <ha-alert alert-type="info" title="About Iconify icons">
            <a href="https://iconify.design/">Iconify</a> is a collection of
            several popular icon sets. Updates are published frequently, and the
            database is therefore downloaded from github on request. If an icon
            seems to be missing, try the Download button below to update the
            local database.
          </ha-alert>

          <ha-settings-row>
            <span slot="heading">Update Iconify Icons</span>
            <span slot="description">
              Download the latest icon sets from
              <a href="https://github.com/iconify/icon-sets">github</a>
            </span>
            <ha-button
              id="download-button"
              @click=${()=>this._download_iconify()}
              >Download</ha-button
            >
          </ha-settings-row>
        </div>
      </ha-card>
    `}static get styles(){return r`
      .card-header {
        display: flex;
        justify-content: space-between;
      }
      ha-textfield {
        width: 250px;
        display: block;
        margin-top: 8px;
      }
      a {
        color: var(--primary-color);
        text-decoration: none;
      }
    `}};t([at()],yt.prototype,"hass",void 0),t([function(t,e){return(({finisher:t,descriptor:e})=>(i,s)=>{var o;if(void 0===s){const s=null!==(o=i.originalKey)&&void 0!==o?o:i.key,n=null!=e?{kind:"method",placement:"prototype",key:s,descriptor:e(i.key)}:{...i,key:s};return null!=t&&(n.finisher=function(e){t(e,s)}),n}{const o=i.constructor;void 0!==e&&Object.defineProperty(i,s,e(s)),null==t||t(o,s)}})({descriptor:i=>{const s={get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==i?i:null},enumerable:!0,configurable:!0};if(e){const e="symbol"==typeof i?Symbol():"__"+i;s.get=function(){var i,s;return void 0===this[e]&&(this[e]=null!==(s=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(t))&&void 0!==s?s:null),this[e]}}return s}})}("#download-button")],yt.prototype,"download_button",void 0),yt=t([rt("custom-icons-download-card")],yt);const mt=2;class bt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}class wt extends bt{constructor(t){if(super(t),this.et=D,t.type!==mt)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===D||null==t)return this.ft=void 0,this.et=t;if(t===z)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.et)return this.ft;this.et=t;const e=[t];return e.raw=e,this.ft={_$litType$:this.constructor.resultType,strings:e,values:[]}}}wt.directiveName="unsafeHTML",wt.resultType=1;const At=(t=>(...e)=>({_$litDirective$:t,values:e}))(wt);let Et=class extends ot{render(){return At((t=>{const e=gt(t);return e?function(t,e){let i=-1===t.indexOf("xlink:")?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const t in e)i+=" "+t+'="'+e[t]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+i+">"+t+"</svg>"}(e.innerSVG,e.attributes):""})(this.icon))}};t([at()],Et.prototype,"icon",void 0),Et=t([rt("custom-icons-icon")],Et);let St=class extends ot{async _toggle_set(t){const e=this.sets[t].active;await this.hass.connection.sendMessage({type:"custom_icons/select",set:t,active:!e})}render(){return I`
      <ha-card outlined>
        <h1 class="card-header">Icon sets</h1>
        <div class="card-content">
          <p>Only enabled icon sets will be available.</p>
          <p>Remember to refresh your browser after enabling new icon sets.</p>

          ${Object.keys(this.sets).map((t=>{var e,i,s;const o=this.sets[t];return I`
              <ha-settings-row>
                <span slot="heading">
                  ${o.name} (<span
                    class="prefix ${o.active?"active":""}"
                    >${t}:</span
                  >)
                </span>
                <span slot="description">
                  <div>
                    ${o.total} icons
                    ${o.author?I`by ${o.author.name} -
                          <a href="${o.author.url}" target="_blank">
                            ${o.author.url}
                          </a>`:""}
                  </div>
                  ${o.sample_icons?I` <div class="samples">
                        ${null===(e=o.sample_icons)||void 0===e?void 0:e.map((t=>I`<custom-icons-icon
                            .icon=${t}
                          ></custom-icons-icon>`))}
                        ${"iconify"==(null===(s=null===(i=o.sample_icons)||void 0===i?void 0:i[0])||void 0===s?void 0:s.renderer)?I`
                              <a
                                href="https://icon-sets.iconify.design/${t}/"
                                target="_blank"
                              >
                                <ha-icon .icon=${"mdi:open-in-new"}> </ha-icon>
                              </a>
                            `:""}
                      </div>`:""}
                </span>

                <ha-switch
                  .checked=${o.active}
                  @change=${()=>this._toggle_set(t)}
                >
                </ha-switch>
              </ha-settings-row>
            `}))}
        </div>
      </ha-card>
    `}static get styles(){return r`
      .card-header {
        display: flex;
        justify-content: space-between;
      }
      a {
        color: var(--primary-color);
        text-decoration: none;
      }
      .prefix {
        font-family: monospace;
      }
      .prefix.active {
        color: var(--primary-color);
      }
      ha-icon-button > * {
        display: flex;
        color: var(--primary-text-color);
      }
      .samples * {
        vertical-align: bottom;
      }
      custom-icons-icon {
        fill: currentColor;
        font-size: 2.5em;
        vertical-align: top;
        margin-right: 4px;
        transition: font-size 0.2s;
      }
      custom-icons-icon:hover {
        color: var(--accent-color);
      }
    `}};t([at()],St.prototype,"hass",void 0),t([at()],St.prototype,"sets",void 0),St=t([rt("custom-icons-select-set-card")],St),(async()=>{var t,e,i,s,o,n,r,l,a,c,h,d,u,p,v;await customElements.whenDefined("partial-panel-resolver");const f=document.createElement("partial-panel-resolver")._getRoutes([{component_name:"config",url_path:"a"}]);await(null===(i=null===(e=null===(t=null==f?void 0:f.routes)||void 0===t?void 0:t.a)||void 0===e?void 0:e.load)||void 0===i?void 0:i.call(e)),await customElements.whenDefined("ha-panel-config");const $=document.createElement("ha-panel-config");await(null===(r=null===(n=null===(o=null===(s=null==$?void 0:$.routerOptions)||void 0===s?void 0:s.routes)||void 0===o?void 0:o.dashboard)||void 0===n?void 0:n.load)||void 0===r?void 0:r.call(n)),await(null===(h=null===(c=null===(a=null===(l=null==$?void 0:$.routerOptions)||void 0===l?void 0:l.routes)||void 0===a?void 0:a.general)||void 0===c?void 0:c.load)||void 0===h?void 0:h.call(c)),await(null===(v=null===(p=null===(u=null===(d=null==$?void 0:$.routerOptions)||void 0===d?void 0:d.routes)||void 0===u?void 0:u.entities)||void 0===p?void 0:p.load)||void 0===v?void 0:v.call(p)),await customElements.whenDefined("ha-config-dashboard")})();let xt=class extends ot{async _get_sets(){this.sets=null,this.requestUpdate(),this.sets=await this.hass.connection.sendMessagePromise({type:"custom_icons/sets"})}_clear(){this.sets=null}firstUpdated(t){this._get_sets()}render(){return I`
      <ha-top-app-bar-fixed>
        <ha-menu-button
          slot="navigationIcon"
          .hass=${this.hass}
          .narrow=${this.narrow}
        ></ha-menu-button>
        <div slot="title">Custom Icon Settings</div>

        <ha-config-section .narrow=${this.narrow} full-width>
          <custom-icons-download-card
            .hass=${this.hass}
            @reload=${()=>this._get_sets()}
            @clear=${()=>this._clear()}
          >
          </custom-icons-download-card>
          ${this.sets?I`
                <custom-icons-select-set-card
                  .hass=${this.hass}
                  .sets=${this.sets}
                ></custom-icons-select-set-card>
              `:I`<ha-card outlined
                ><div class="card-content"><p>Loading...</p></div></ha-card
              >`}
        </ha-config-section>
      </ha-top-app-bar-fixed>
    `}static get styles(){var t,e;return[...null!==(e=null===(t=customElements.get("ha-config-dashboard"))||void 0===t?void 0:t.styles)&&void 0!==e?e:[],r`
        :host {
          --app-header-background-color: var(--sidebar-background-color);
          --app-header-text-color: var(--sidebar-text-color);
          --app-header-border-bottom: 1px solid var(--divider-color);
          --ha-card-border-radius: var(--ha-config-card-border-radius, 8px);
        }
        ha-config-section {
          padding: 16px 0;
          direction: ltr;
        }
        a {
          color: var(--primary-text-color);
          text-decoration: none;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
        }
        ha-textfield {
          width: 250px;
          display: block;
          margin-top: 8px;
        }
      `]}};t([at()],xt.prototype,"hass",void 0),t([at()],xt.prototype,"narrow",void 0),t([at()],xt.prototype,"connection",void 0),t([at()],xt.prototype,"sets",void 0),xt=t([rt("custom-icons-panel")],xt);
