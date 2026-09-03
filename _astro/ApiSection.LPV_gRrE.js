import{n as e,r as t,t as n}from"./react.OrosJ8bI.js";import{t as r}from"./jsx-runtime.attkegX-.js";import{n as i,t as a}from"./copy.BsHH99kS.js";import{t as o}from"./chevron-down.kLEyIneX.js";import{t as s}from"./download.DuwVocmM.js";import{t as c}from"./external-link.CfPYKs9L.js";var l=t(n(),1),u=r();function d({title:e,subtitle:t,badge:n,defaultOpen:r=!1,children:i}){let[a,s]=(0,l.useState)(r);return(0,u.jsxs)(`div`,{className:`overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300`,children:[(0,u.jsxs)(`button`,{onClick:()=>s(!a),"aria-expanded":a,className:`flex w-full items-center gap-4 px-5 py-4 text-left cursor-pointer`,children:[(0,u.jsxs)(`div`,{className:`flex min-w-0 flex-1 items-center gap-3`,children:[n,(0,u.jsxs)(`div`,{className:`min-w-0`,children:[(0,u.jsx)(`div`,{className:`truncate font-mono text-sm font-semibold text-slate-900`,children:e}),t&&(0,u.jsx)(`div`,{className:`truncate text-xs text-slate-500`,children:t})]})]}),(0,u.jsx)(o,{size:18,className:`shrink-0 text-slate-400 transition-transform ${a?`rotate-180`:``}`})]}),a&&(0,u.jsx)(`div`,{className:`border-t border-slate-100 bg-slate-50/60 px-5 py-5`,children:i})]})}var f=t(e(((e,t)=>{function n(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw Error(`map is read-only`)}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw Error(`set is read-only`)}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach(t=>{let r=e[t],i=typeof r;(i===`object`||i===`function`)&&!Object.isFrozen(r)&&n(r)}),e}var r=class{constructor(e){e.data===void 0&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}};function i(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#x27;`)}function a(e,...t){let n=Object.create(null);for(let t in e)n[t]=e[t];return t.forEach(function(e){for(let t in e)n[t]=e[t]}),n}var o=`</span>`,s=e=>!!e.scope,c=(e,{prefix:t})=>{if(e.startsWith(`language:`))return e.replace(`language:`,`language-`);if(e.includes(`.`)){let n=e.split(`.`);return[`${t}${n.shift()}`,...n.map((e,t)=>`${e}${`_`.repeat(t+1)}`)].join(` `)}return`${t}${e}`},l=class{constructor(e,t){this.buffer=``,this.classPrefix=t.classPrefix,e.walk(this)}addText(e){this.buffer+=i(e)}openNode(e){if(!s(e))return;let t=c(e.scope,{prefix:this.classPrefix});this.span(t)}closeNode(e){s(e)&&(this.buffer+=o)}value(){return this.buffer}span(e){this.buffer+=`<span class="${e}">`}},u=(e={})=>{let t={children:[]};return Object.assign(t,e),t},d=class e{constructor(){this.rootNode=u(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){this.top.children.push(e)}openNode(e){let t=u({scope:e});this.add(t),this.stack.push(t)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,t){return typeof t==`string`?e.addText(t):t.children&&(e.openNode(t),t.children.forEach(t=>this._walk(e,t)),e.closeNode(t)),e}static _collapse(t){typeof t!=`string`&&t.children&&(t.children.every(e=>typeof e==`string`)?t.children=[t.children.join(``)]:t.children.forEach(t=>{e._collapse(t)}))}},f=class extends d{constructor(e){super(),this.options=e}addText(e){e!==``&&this.add(e)}startScope(e){this.openNode(e)}endScope(){this.closeNode()}__addSublanguage(e,t){let n=e.root;t&&(n.scope=`language:${t}`),this.add(n)}toHTML(){return new l(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}};function p(e){return e?typeof e==`string`?e:e.source:null}function m(e){return _(`(?=`,e,`)`)}function h(e){return _(`(?:`,e,`)*`)}function g(e){return _(`(?:`,e,`)?`)}function _(...e){return e.map(e=>p(e)).join(``)}function v(e){let t=e[e.length-1];return typeof t==`object`&&t.constructor===Object?(e.splice(e.length-1,1),t):{}}function y(...e){return`(`+(v(e).capture?``:`?:`)+e.map(e=>p(e)).join(`|`)+`)`}function b(e){return RegExp(e.toString()+`|`).exec(``).length-1}function x(e,t){let n=e&&e.exec(t);return n&&n.index===0}var S=new RegExp(y(/\[(?:[^\\\]]|\\.)*\]/,/\(\?<(?![=!])[^>]+>/,/\(\?'[^']+'/,/\(\??/,/\\([1-9][0-9]*)/,/\\./));function C(e,{joinWith:t}){let n=0;return e.map(e=>{n+=1;let t=n,r=p(e),i=``;for(;r.length>0;){let e=S.exec(r);if(!e){i+=r;break}i+=r.substring(0,e.index),r=r.substring(e.index+e[0].length),e[0][0]===`\\`&&e[1]?i+=`\\`+String(Number(e[1])+t):(i+=e[0],(e[0]===`(`||/^\(\?[<']/.test(e[0]))&&n++)}return i}).map(e=>`(${e})`).join(t)}var w=/\b\B/,T=`[a-zA-Z]\\w*`,E=`[a-zA-Z_]\\w*`,D=`\\b\\d+(\\.\\d+)?`,O=`(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)`,k=`\\b(0b[01]+)`,A=`!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~`,j=(e={})=>{let t=/^#![ ]*\//;return e.binary&&(e.begin=_(t,/.*\b/,e.binary,/\b.*/)),a({scope:`meta`,begin:t,end:/$/,relevance:0,"on:begin":(e,t)=>{e.index!==0&&t.ignoreMatch()}},e)},M={begin:`\\\\[\\s\\S]`,relevance:0},N={scope:`string`,begin:`'`,end:`'`,illegal:`\\n`,contains:[M]},P={scope:`string`,begin:`"`,end:`"`,illegal:`\\n`,contains:[M]},F={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},I=function(e,t,n={}){let r=a({scope:`comment`,begin:e,end:t,contains:[]},n);r.contains.push({scope:`doctag`,begin:`[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)`,end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});let i=y(`I`,`a`,`is`,`so`,`us`,`to`,`at`,`if`,`in`,`it`,`on`,/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return r.contains.push({begin:_(/[ ]+/,`(`,i,/[.]?[:]?([.][ ]|[ ])/,`){3}`)}),r},L=I(`//`,`$`),R=I(`/\\*`,`\\*/`),z=I(`#`,`$`),B=Object.freeze({__proto__:null,APOS_STRING_MODE:N,BACKSLASH_ESCAPE:M,BINARY_NUMBER_MODE:{scope:`number`,begin:k,relevance:0},BINARY_NUMBER_RE:k,COMMENT:I,C_BLOCK_COMMENT_MODE:R,C_LINE_COMMENT_MODE:L,C_NUMBER_MODE:{scope:`number`,begin:O,relevance:0},C_NUMBER_RE:O,END_SAME_AS_BEGIN:function(e){return Object.assign(e,{"on:begin":(e,t)=>{t.data._beginMatch=e[1]},"on:end":(e,t)=>{t.data._beginMatch!==e[1]&&t.ignoreMatch()}})},HASH_COMMENT_MODE:z,IDENT_RE:T,MATCH_NOTHING_RE:w,METHOD_GUARD:{begin:`\\.\\s*[a-zA-Z_]\\w*`,relevance:0},NUMBER_MODE:{scope:`number`,begin:D,relevance:0},NUMBER_RE:D,PHRASAL_WORDS_MODE:F,QUOTE_STRING_MODE:P,REGEXP_MODE:{scope:`regexp`,begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[M,{begin:/\[/,end:/\]/,relevance:0,contains:[M]}]},RE_STARTERS_RE:A,SHEBANG:j,TITLE_MODE:{scope:`title`,begin:T,relevance:0},UNDERSCORE_IDENT_RE:E,UNDERSCORE_TITLE_MODE:{scope:`title`,begin:E,relevance:0}});function V(e,t){e.input[e.index-1]===`.`&&t.ignoreMatch()}function ee(e,t){e.className!==void 0&&(e.scope=e.className,delete e.className)}function te(e,t){t&&e.beginKeywords&&(e.begin=`\\b(`+e.beginKeywords.split(` `).join(`|`)+`)(?!\\.)(?=\\b|\\s)`,e.__beforeBegin=V,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,e.relevance===void 0&&(e.relevance=0))}function ne(e,t){Array.isArray(e.illegal)&&(e.illegal=y(...e.illegal))}function re(e,t){if(e.match){if(e.begin||e.end)throw Error(`begin & end are not supported with match`);e.begin=e.match,delete e.match}}function ie(e,t){e.relevance===void 0&&(e.relevance=1)}var ae=(e,t)=>{if(!e.beforeMatch)return;if(e.starts)throw Error(`beforeMatch cannot be used with starts`);let n=Object.assign({},e);Object.keys(e).forEach(t=>{delete e[t]}),e.keywords=n.keywords,e.begin=_(n.beforeMatch,m(n.begin)),e.starts={relevance:0,contains:[Object.assign(n,{endsParent:!0})]},e.relevance=0,delete n.beforeMatch},oe=[`of`,`and`,`for`,`in`,`not`,`or`,`if`,`then`,`parent`,`list`,`value`],se=`keyword`;function H(e,t,n=se){let r=Object.create(null);return typeof e==`string`?i(n,e.split(` `)):Array.isArray(e)?i(n,e):Object.keys(e).forEach(function(n){Object.assign(r,H(e[n],t,n))}),r;function i(e,n){t&&(n=n.map(e=>e.toLowerCase())),n.forEach(function(t){let n=t.split(`|`);r[n[0]]=[e,ce(n[0],n[1])]})}}function ce(e,t){return t?Number(t):+!le(e)}function le(e){return oe.includes(e.toLowerCase())}var U={},W=e=>{console.error(e)},G=(e,...t)=>{console.log(`WARN: ${e}`,...t)},K=(e,t)=>{U[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),U[`${e}/${t}`]=!0)},q=Error();function J(e,t,{key:n}){let r=0,i=e[n],a={},o={};for(let e=1;e<=t.length;e++)o[e+r]=i[e],a[e+r]=!0,r+=b(t[e-1]);e[n]=o,e[n]._emit=a,e[n]._multi=!0}function ue(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw W(`skip, excludeBegin, returnBegin not compatible with beginScope: {}`),q;if(typeof e.beginScope!=`object`||e.beginScope===null)throw W(`beginScope must be object`),q;J(e,e.begin,{key:`beginScope`}),e.begin=C(e.begin,{joinWith:``})}}function de(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw W(`skip, excludeEnd, returnEnd not compatible with endScope: {}`),q;if(typeof e.endScope!=`object`||e.endScope===null)throw W(`endScope must be object`),q;J(e,e.end,{key:`endScope`}),e.end=C(e.end,{joinWith:``})}}function fe(e){e.scope&&typeof e.scope==`object`&&e.scope!==null&&(e.beginScope=e.scope,delete e.scope)}function pe(e){fe(e),typeof e.beginScope==`string`&&(e.beginScope={_wrap:e.beginScope}),typeof e.endScope==`string`&&(e.endScope={_wrap:e.endScope}),ue(e),de(e)}function me(e){function t(t,n){return new RegExp(p(t),`m`+(e.case_insensitive?`i`:``)+(e.unicodeRegex?`u`:``)+(n?`g`:``))}class n{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(e,t){t.position=this.position++,this.matchIndexes[this.matchAt]=t,this.regexes.push([t,e]),this.matchAt+=b(e)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);let e=this.regexes.map(e=>e[1]);this.matcherRe=t(C(e,{joinWith:`|`}),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex;let t=this.matcherRe.exec(e);if(!t)return null;let n=t.findIndex((e,t)=>t>0&&e!==void 0),r=this.matchIndexes[n];return t.splice(0,n),Object.assign(t,r)}}class r{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){if(this.multiRegexes[e])return this.multiRegexes[e];let t=new n;return this.rules.slice(e).forEach(([e,n])=>t.addRule(e,n)),t.compile(),this.multiRegexes[e]=t,t}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(e,t){this.rules.push([e,t]),t.type===`begin`&&this.count++}exec(e){let t=this.getMatcher(this.regexIndex);t.lastIndex=this.lastIndex;let n=t.exec(e);if(this.resumingScanAtSamePosition()&&!(n&&n.index===this.lastIndex)){let t=this.getMatcher(0);t.lastIndex=this.lastIndex+1,n=t.exec(e)}return n&&(this.regexIndex+=n.position+1,this.regexIndex===this.count&&this.considerAll()),n}}function i(e){let t=new r;return e.contains.forEach(e=>t.addRule(e.begin,{rule:e,type:`begin`})),e.terminatorEnd&&t.addRule(e.terminatorEnd,{type:`end`}),e.illegal&&t.addRule(e.illegal,{type:`illegal`}),t}function o(n,r){let a=n;if(n.isCompiled)return a;[ee,re,pe,ae].forEach(e=>e(n,r)),e.compilerExtensions.forEach(e=>e(n,r)),n.__beforeBegin=null,[te,ne,ie].forEach(e=>e(n,r)),n.isCompiled=!0;let s=null;return typeof n.keywords==`object`&&n.keywords.$pattern&&(n.keywords=Object.assign({},n.keywords),s=n.keywords.$pattern,delete n.keywords.$pattern),s||=/\w+/,n.keywords&&=H(n.keywords,e.case_insensitive),a.keywordPatternRe=t(s,!0),r&&(n.begin||=/\B|\b/,a.beginRe=t(a.begin),!n.end&&!n.endsWithParent&&(n.end=/\B|\b/),n.end&&(a.endRe=t(a.end)),a.terminatorEnd=p(a.end)||``,n.endsWithParent&&r.terminatorEnd&&(a.terminatorEnd+=(n.end?`|`:``)+r.terminatorEnd)),n.illegal&&(a.illegalRe=t(n.illegal)),n.contains||=[],n.contains=[].concat(...n.contains.map(function(e){return he(e===`self`?n:e)})),n.contains.forEach(function(e){o(e,a)}),n.starts&&o(n.starts,r),a.matcher=i(a),a}if(e.compilerExtensions||=[],e.contains&&e.contains.includes(`self`))throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=a(e.classNameAliases||{}),o(e)}function Y(e){return e?e.endsWithParent||Y(e.starts):!1}function he(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map(function(t){return a(e,{variants:null},t)})),e.cachedVariants?e.cachedVariants:Y(e)?a(e,{starts:e.starts?a(e.starts):null}):Object.isFrozen(e)?a(e):e}var ge=`11.12.0`,_e=class extends Error{constructor(e,t){super(e),this.name=`HTMLInjectionError`,this.html=t}},X=i,Z=a,Q=Symbol(`nomatch`),ve=7,ye=function(e){let t=Object.create(null),i=Object.create(null),a=[],o=!0,s=`Could not find the language '{}', did you forget to load/include a language module?`,c={disableAutodetect:!0,name:`Plain text`,contains:[]},l={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:`hljs-`,cssSelector:`pre code`,languages:null,__emitter:f};function u(e){return l.noHighlightRe.test(e)}function d(e){let t=e.className+` `;t+=e.parentNode?e.parentNode.className:``;let n=l.languageDetectRe.exec(t);if(n){let t=N(n[1]);return t||(G(s.replace(`{}`,n[1])),G(`Falling back to no-highlight mode for this block.`,e)),t?n[1]:`no-highlight`}return t.split(/\s+/).find(e=>u(e)||N(e))}function p(e,t,n){let r=``,i=``;typeof t==`object`?(r=e,n=t.ignoreIllegals,i=t.language):(K(`10.7.0`,`highlight(lang, code, ...args) has been deprecated.`),K(`10.7.0`,`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),i=e,r=t),n===void 0&&(n=!0);let a={code:r,language:i};z(`before:highlight`,a);let o=a.result?a.result:v(a.language,a.code,n);return o.code=a.code,z(`after:highlight`,o),o}function v(e,n,i,a){let c=Object.create(null);function u(e,t){return e.keywords[t]}function d(){if(!A.keywords){M.addText(P);return}let e=0;A.keywordPatternRe.lastIndex=0;let t=A.keywordPatternRe.exec(P),n=``;for(;t;){n+=P.substring(e,t.index);let r=D.case_insensitive?t[0].toLowerCase():t[0],i=u(A,r);if(i){let[e,a]=i;if(M.addText(n),n=``,c[r]=(c[r]||0)+1,c[r]<=ve&&(F+=a),e.startsWith(`_`))n+=t[0];else{let n=D.classNameAliases[e]||e;m(t[0],n)}}else n+=t[0];e=A.keywordPatternRe.lastIndex,t=A.keywordPatternRe.exec(P)}n+=P.substring(e),M.addText(n)}function f(){if(P===``)return;let e=null;if(typeof A.subLanguage==`string`){if(!t[A.subLanguage]){M.addText(P);return}e=v(A.subLanguage,P,!0,j[A.subLanguage]),j[A.subLanguage]=e._top}else e=S(P,A.subLanguage.length?A.subLanguage:null);A.relevance>0&&(F+=e.relevance),M.__addSublanguage(e._emitter,e.language)}function p(){A.subLanguage==null?d():f(),P=``}function m(e,t){e!==``&&(M.startScope(t),M.addText(e),M.endScope())}function h(e,t){let n=1,r=t.length-1;for(;n<=r;){if(!e._emit[n]){n++;continue}let r=D.classNameAliases[e[n]]||e[n],i=t[n];r?m(i,r):(P=i,d(),P=``),n++}}function g(e,t){return e.scope&&typeof e.scope==`string`&&M.openNode(D.classNameAliases[e.scope]||e.scope),e.beginScope&&(e.beginScope._wrap?(m(P,D.classNameAliases[e.beginScope._wrap]||e.beginScope._wrap),P=``):e.beginScope._multi&&(h(e.beginScope,t),P=``)),A=Object.create(e,{parent:{value:A}}),A}function _(e,t,n){let i=x(e.endRe,n);if(i){if(e[`on:end`]){let n=new r(e);e[`on:end`](t,n),n.isMatchIgnored&&(i=!1)}if(i){for(;e.endsParent&&e.parent;)e=e.parent;return e}}if(e.endsWithParent)return _(e.parent,t,n)}function y(e){return A.matcher.regexIndex===0?(P+=e[0],1):(R=!0,0)}function b(e){let t=e[0],n=e.rule,i=new r(n),a=[n.__beforeBegin,n[`on:begin`]];for(let n of a)if(n&&(n(e,i),i.isMatchIgnored))return y(t);return n.skip?P+=t:(n.excludeBegin&&(P+=t),p(),!n.returnBegin&&!n.excludeBegin&&(P=t)),g(n,e),n.returnBegin?0:t.length}function C(e){let t=e[0],r=n.substring(e.index),i=_(A,e,r);if(!i)return Q;let a=A;A.endScope&&A.endScope._wrap?(p(),m(t,A.endScope._wrap)):A.endScope&&A.endScope._multi?(p(),h(A.endScope,e)):a.skip?P+=t:(a.returnEnd||a.excludeEnd||(P+=t),p(),a.excludeEnd&&(P=t));do A.scope&&M.closeNode(),!A.skip&&!A.subLanguage&&(F+=A.relevance),A=A.parent;while(A!==i.parent);return i.starts&&g(i.starts,e),a.returnEnd?0:t.length}function w(){let e=[];for(let t=A;t!==D;t=t.parent)t.scope&&e.unshift(t.scope);e.forEach(e=>M.openNode(e))}let T={};function E(t,r){let a=r&&r[0];if(P+=t,a==null)return p(),0;if(T.type===`begin`&&r.type===`end`&&T.index===r.index&&a===``){if(P+=n.slice(r.index,r.index+1),!o){let t=Error(`0 width match regex (${e})`);throw t.languageName=e,t.badRule=T.rule,t}return 1}if(T=r,r.type===`begin`)return b(r);if(r.type===`illegal`&&!i){let e=Error(`Illegal lexeme "`+a+`" for mode "`+(A.scope||`<unnamed>`)+`"`);throw e.mode=A,e}if(r.type===`end`){let e=C(r);if(e!==Q)return e}if(r.type===`illegal`&&a===``)return r.index===n.length||(P+=`
`),1;if(L>1e5&&L>r.index*3)throw Error(`potential infinite loop, way more iterations than matches`);return P+=a,a.length}let D=N(e);if(!D)throw W(s.replace(`{}`,e)),Error(`Unknown language: "`+e+`"`);let O=me(D),k=``,A=a||O,j={},M=new l.__emitter(l);w();let P=``,F=0,I=0,L=0,R=!1;try{if(D.__emitTokens)D.__emitTokens(n,M);else{for(A.matcher.considerAll();;){L++,R?R=!1:A.matcher.considerAll(),A.matcher.lastIndex=I;let e=A.matcher.exec(n);if(!e)break;let t=E(n.substring(I,e.index),e);I=e.index+t}E(n.substring(I))}return M.finalize(),k=M.toHTML(),{language:e,value:k,relevance:F,illegal:!1,_emitter:M,_top:A}}catch(t){if(t.message&&t.message.includes(`Illegal`))return{language:e,value:X(n),illegal:!0,relevance:0,_illegalBy:{message:t.message,index:I,context:n.slice(I-100,I+100),mode:t.mode,resultSoFar:k},_emitter:M};if(o)return{language:e,value:X(n),illegal:!1,relevance:0,errorRaised:t,_emitter:M,_top:A};throw t}}function b(e){let t={value:X(e),illegal:!1,relevance:0,_top:c,_emitter:new l.__emitter(l)};return t._emitter.addText(e),t}function S(e,n){n=n||l.languages||Object.keys(t);let r=b(e),i=n.filter(N).filter(F).map(t=>v(t,e,!1));i.unshift(r);let[a,o]=i.sort((e,t)=>{if(e.relevance!==t.relevance)return t.relevance-e.relevance;if(e.language&&t.language){if(N(e.language).supersetOf===t.language)return 1;if(N(t.language).supersetOf===e.language)return-1}return 0}),s=a;return s.secondBest=o,s}function C(e,t,n){let r=t&&i[t]||n;e.classList.add(`hljs`),e.classList.add(`language-${r}`)}function w(e){let t=null,n=d(e);if(u(n))return;if(z(`before:highlightElement`,{el:e,language:n}),e.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",e);return}if(e.children.length>0&&(l.ignoreUnescapedHTML||(console.warn(`One of your code blocks includes unescaped HTML. This is a potentially serious security risk.`),console.warn(`https://github.com/highlightjs/highlight.js/wiki/security`),console.warn(`The element with unescaped HTML:`),console.warn(e)),l.throwUnescapedHTML))throw new _e(`One of your code blocks includes unescaped HTML.`,e.innerHTML);t=e;let r=t.textContent,i=n?p(r,{language:n,ignoreIllegals:!0}):S(r);e.innerHTML=i.value,e.dataset.highlighted=`yes`,C(e,n,i.language),e.result={language:i.language,re:i.relevance,relevance:i.relevance},i.secondBest&&(e.secondBest={language:i.secondBest.language,relevance:i.secondBest.relevance}),z(`after:highlightElement`,{el:e,result:i,text:r})}function T(e){l=Z(l,e)}let E=()=>{k(),K(`10.6.0`,`initHighlighting() deprecated.  Use highlightAll() now.`)};function D(){k(),K(`10.6.0`,`initHighlightingOnLoad() deprecated.  Use highlightAll() now.`)}let O=!1;function k(){function e(){k()}if(document.readyState===`loading`){O||window.addEventListener(`DOMContentLoaded`,e,!1),O=!0;return}document.querySelectorAll(l.cssSelector).forEach(w)}function A(n,r){let i=null;try{i=r(e)}catch(e){if(W(`Language definition for '{}' could not be registered.`.replace(`{}`,n)),o)W(e);else throw e;i=c}i.name||(i.name=n),t[n]=i,i.rawDefinition=r.bind(null,e),i.aliases&&P(i.aliases,{languageName:n})}function j(e){delete t[e];for(let t of Object.keys(i))i[t]===e&&delete i[t]}function M(){return Object.keys(t)}function N(e){return e=(e||``).toLowerCase(),t[e]||t[i[e]]}function P(e,{languageName:t}){typeof e==`string`&&(e=[e]),e.forEach(e=>{i[e.toLowerCase()]=t})}function F(e){let t=N(e);return t&&!t.disableAutodetect}function I(e){e[`before:highlightBlock`]&&!e[`before:highlightElement`]&&(e[`before:highlightElement`]=t=>{e[`before:highlightBlock`](Object.assign({block:t.el},t))}),e[`after:highlightBlock`]&&!e[`after:highlightElement`]&&(e[`after:highlightElement`]=t=>{e[`after:highlightBlock`](Object.assign({block:t.el},t))})}function L(e){I(e),a.push(e)}function R(e){let t=a.indexOf(e);t!==-1&&a.splice(t,1)}function z(e,t){let n=e;a.forEach(function(e){e[n]&&e[n](t)})}function V(e){return K(`10.7.0`,`highlightBlock will be removed entirely in v12.0`),K(`10.7.0`,`Please use highlightElement now.`),w(e)}Object.assign(e,{highlight:p,highlightAuto:S,highlightAll:k,highlightElement:w,highlightBlock:V,configure:T,initHighlighting:E,initHighlightingOnLoad:D,registerLanguage:A,unregisterLanguage:j,listLanguages:M,getLanguage:N,registerAliases:P,autoDetection:F,inherit:Z,addPlugin:L,removePlugin:R}),e.debugMode=function(){o=!1},e.safeMode=function(){o=!0},e.versionString=ge,e.regex={concat:_,lookahead:m,either:y,optional:g,anyNumberOfTimes:h};for(let e in B)typeof B[e]==`object`&&n(B[e]);return Object.assign(e,B),e},$=ye({});$.newInstance=()=>ye({}),t.exports=$,$.HighlightJS=$,$.default=$}))()).default,p={scope:`number`,match:`([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity`,relevance:0};function m(e){let t={className:`attr`,begin:/(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,relevance:1.01},n={match:/[{}[\],:]/,className:`punctuation`,relevance:0},r=[`true`,`false`,`null`],i={scope:`literal`,beginKeywords:r.join(` `)};return{name:`JSON`,aliases:[`jsonc`,`json5`],keywords:{literal:r},contains:[t,n,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,i,p,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE],illegal:`\\S`}}function h(e){let t=e.regex,n={},r={begin:/\$\{/,end:/\}/,contains:[`self`,{begin:/:-/,contains:[n]}]};Object.assign(n,{className:`variable`,variants:[{begin:t.concat(/\$[\w\d#@][\w\d_]*/,`(?![\\w\\d])(?![$])`)},r]});let i={className:`subst`,begin:/\$\(/,end:/\)/,contains:[e.BACKSLASH_ESCAPE]},a=e.inherit(e.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:`comment`}}),o={begin:/<<-?\s*(?=\w+)/,starts:{contains:[e.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:`string`})]}},s={className:`string`,begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,n,i]};i.contains.push(s);let c={match:/\\"/},l={className:`string`,begin:/'/,end:/'/},u={match:/\\'/},d={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:`number`},e.NUMBER_MODE,n]},f=e.SHEBANG({binary:`(${[`fish`,`bash`,`zsh`,`sh`,`csh`,`ksh`,`tcsh`,`dash`,`scsh`].join(`|`)})`,relevance:10}),p={className:`function`,begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[e.inherit(e.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},m=[`if`,`then`,`else`,`elif`,`fi`,`time`,`for`,`while`,`until`,`in`,`do`,`done`,`case`,`esac`,`coproc`,`function`,`select`],h=[`true`,`false`],g={match:/(\/[a-z._-]+)+/},_=[`break`,`cd`,`continue`,`eval`,`exec`,`exit`,`export`,`getopts`,`hash`,`pwd`,`readonly`,`return`,`shift`,`test`,`times`,`trap`,`umask`,`unset`],v=[`alias`,`bind`,`builtin`,`caller`,`command`,`declare`,`echo`,`enable`,`help`,`let`,`local`,`logout`,`mapfile`,`printf`,`read`,`readarray`,`source`,`sudo`,`type`,`typeset`,`ulimit`,`unalias`],y=`autoload.bg.bindkey.bye.cap.chdir.clone.comparguments.compcall.compctl.compdescribe.compfiles.compgroups.compquote.comptags.comptry.compvalues.dirs.disable.disown.echotc.echoti.emulate.fc.fg.float.functions.getcap.getln.history.integer.jobs.kill.limit.log.noglob.popd.print.pushd.pushln.rehash.sched.setcap.setopt.stat.suspend.ttyctl.unfunction.unhash.unlimit.unsetopt.vared.wait.whence.where.which.zcompile.zformat.zftp.zle.zmodload.zparseopts.zprof.zpty.zregexparse.zsocket.zstyle.ztcp`.split(`.`),b=`chcon.chgrp.chown.chmod.cp.dd.df.dir.dircolors.ln.ls.mkdir.mkfifo.mknod.mktemp.mv.realpath.rm.rmdir.shred.sync.touch.truncate.vdir.b2sum.base32.base64.cat.cksum.comm.csplit.cut.expand.fmt.fold.head.join.md5sum.nl.numfmt.od.paste.ptx.pr.sha1sum.sha224sum.sha256sum.sha384sum.sha512sum.shuf.sort.split.sum.tac.tail.tr.tsort.unexpand.uniq.wc.arch.basename.chroot.date.dirname.du.echo.env.expr.factor.groups.hostid.id.link.logname.nice.nohup.nproc.pathchk.pinky.printenv.printf.pwd.readlink.runcon.seq.sleep.stat.stdbuf.stty.tee.test.timeout.tty.uname.unlink.uptime.users.who.whoami.yes`.split(`.`);return{name:`Bash`,aliases:[`sh`,`zsh`],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:m,literal:h,built_in:[..._,...v,`set`,`shopt`,...y,...b]},contains:[f,e.SHEBANG(),p,d,a,o,g,s,c,l,u,n]}}f.getLanguage(`json`)||f.registerLanguage(`json`,m);function g(e){try{return f.highlight(e,{language:`json`}).value}catch{return f.highlightAuto(e,[`json`]).value}}function _({code:e,theme:t=`light`}){let n=(0,l.useMemo)(()=>g(e),[e]),r=t===`dark`?`bg-slate-950 border-white/5`:`bg-white border-slate-200`,i=t===`dark`?`hljs-dark`:`hljs-light`;return(0,u.jsx)(`pre`,{className:`overflow-x-auto rounded-xl border p-4 text-xs leading-relaxed ${r}`,children:(0,u.jsx)(`code`,{style:{fontFamily:`'JetBrains Mono', monospace`},className:i,dangerouslySetInnerHTML:{__html:n}})})}f.getLanguage(`bash`)||f.registerLanguage(`bash`,h);var v=`[A-Za-z$_][0-9A-Za-z$_]*`,y=`as.in.of.if.for.while.finally.var.new.function.do.return.void.else.break.catch.instanceof.with.throw.case.default.try.switch.continue.typeof.delete.let.yield.const.class.debugger.async.await.static.import.from.export.extends.using`.split(`.`),b=[`true`,`false`,`null`,`undefined`,`NaN`,`Infinity`],x=`Object.Function.Boolean.Symbol.Math.Date.Number.BigInt.String.RegExp.Array.Float32Array.Float64Array.Int8Array.Uint8Array.Uint8ClampedArray.Int16Array.Int32Array.Uint16Array.Uint32Array.BigInt64Array.BigUint64Array.Set.Map.WeakSet.WeakMap.ArrayBuffer.SharedArrayBuffer.Atomics.DataView.JSON.Promise.Generator.GeneratorFunction.AsyncFunction.Reflect.Proxy.Intl.WebAssembly`.split(`.`),S=[`Error`,`EvalError`,`InternalError`,`RangeError`,`ReferenceError`,`SyntaxError`,`TypeError`,`URIError`],C=[`setInterval`,`setTimeout`,`clearInterval`,`clearTimeout`,`require`,`exports`,`eval`,`isFinite`,`isNaN`,`parseFloat`,`parseInt`,`decodeURI`,`decodeURIComponent`,`encodeURI`,`encodeURIComponent`,`escape`,`unescape`],w=[`arguments`,`this`,`super`,`console`,`window`,`document`,`localStorage`,`sessionStorage`,`module`,`self`,`global`],T=[].concat(C,x,S);function E(e){let t=e.regex,n=(e,{after:t})=>{let n=`</`+e[0].slice(1);return e.input.indexOf(n,t)!==-1},r=v,i={begin:`<>`,end:`</>`},a=/<[A-Za-z0-9\\._:-]+\s*\/>/,o={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(e,t)=>{let r=e[0].length+e.index,i=e.input[r];if(i===`<`||i===`,`){t.ignoreMatch();return}i===`>`&&(n(e,{after:r})||t.ignoreMatch());let a,o=e.input.substring(r);if(a=o.match(/^\s*=/)){t.ignoreMatch();return}if((a=o.match(/^\s+extends\s+/))&&a.index===0){t.ignoreMatch();return}}},s={$pattern:v,keyword:y,literal:b,built_in:T,"variable.language":w},c=`[0-9](_?[0-9])*`,l=`\\.(${c})`,u=`0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`,d={className:`number`,variants:[{begin:`(\\b(${u})((${l})|\\.)?|(${l}))[eE][+-]?(${c})\\b`},{begin:`\\b(${u})\\b((${l})\\b|\\.)?|(${l})\\b`},{begin:`\\b(0|[1-9](_?[0-9])*)n\\b`},{begin:`\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b`},{begin:`\\b0[bB][0-1](_?[0-1])*n?\\b`},{begin:`\\b0[oO][0-7](_?[0-7])*n?\\b`},{begin:`\\b0[0-7]+n?\\b`}],relevance:0},f={className:`subst`,begin:`\\$\\{`,end:`\\}`,keywords:s,contains:[]},p={begin:".?html`",end:``,starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,f],subLanguage:`xml`}},m={begin:".?css`",end:``,starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,f],subLanguage:`css`}},h={begin:".?gql`",end:``,starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,f],subLanguage:`graphql`}},g={className:`string`,begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,f]},_={className:`comment`,variants:[e.COMMENT(/\/\*\*(?!\/)/,`\\*/`,{relevance:0,contains:[{begin:`(?=@[A-Za-z]+)`,relevance:0,contains:[{className:`doctag`,begin:`@[A-Za-z]+`},{className:`type`,begin:`\\{`,end:`\\}`,excludeEnd:!0,excludeBegin:!0,relevance:0},{className:`variable`,begin:r+`(?=\\s*(-)|$)`,endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},E=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,p,m,h,g,{match:/\$\d+/},d];f.contains=E.concat({begin:/\{/,end:/\}/,keywords:s,contains:[`self`].concat(E)});let D=[].concat(_,f.contains),O=D.concat([{begin:/(\s*)\(/,end:/\)/,keywords:s,contains:[`self`].concat(D)}]),k={className:`params`,begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:s,contains:O},A={variants:[{match:[/class/,/\s+/,r,/\s+/,/extends/,/\s+/,t.concat(r,`(`,t.concat(/\./,r),`)*`)],scope:{1:`keyword`,3:`title.class`,5:`keyword`,7:`title.class.inherited`}},{match:[/class/,/\s+/,r],scope:{1:`keyword`,3:`title.class`}}]},j={relevance:0,match:t.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:`title.class`,keywords:{_:[...x,...S]}},M={label:`use_strict`,className:`meta`,relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},N={variants:[{match:[/function/,/\s+/,r,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:`keyword`,3:`title.function`},label:`func.def`,contains:[k],illegal:/%/},P={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:`variable.constant`};function F(e){return t.concat(`(?!`,e.join(`|`),`)`)}let I={match:t.concat(/\b/,F([...C,`super`,`import`,`await`].map(e=>`${e}\\s*\\(`)),r,t.lookahead(/\s*\(/)),className:`title.function`,relevance:0},L={begin:t.concat(/\./,t.lookahead(t.concat(r,/(?![0-9A-Za-z$_(])/))),end:r,excludeBegin:!0,keywords:`prototype`,className:`property`,relevance:0},R={match:[/get|set/,/\s+/,r,/(?=\()/],className:{1:`keyword`,3:`title.function`},contains:[{begin:/\(\)/},k]},z=`(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|`+e.UNDERSCORE_IDENT_RE+`)\\s*=>`,B={match:[/const|var|let/,/\s+/,r,/\s*/,/=\s*/,/(async\s*)?/,t.lookahead(z)],keywords:`async`,className:{1:`keyword`,3:`title.function`},contains:[k]};return{name:`JavaScript`,aliases:[`js`,`jsx`,`mjs`,`cjs`],keywords:s,exports:{PARAMS_CONTAINS:O,CLASS_REFERENCE:j},illegal:/#(?![$_A-Za-z])/,contains:[e.SHEBANG({label:`shebang`,binary:`node`,relevance:5}),M,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,p,m,h,g,_,{match:/\$\d+/},d,j,{scope:`attr`,match:r+t.lookahead(`:`),relevance:0},B,{begin:`(`+e.RE_STARTERS_RE+`|\\b(case|return|throw)\\b)\\s*`,keywords:`return throw case`,relevance:0,contains:[_,e.REGEXP_MODE,{className:`function`,begin:z,returnBegin:!0,end:`\\s*=>`,contains:[{className:`params`,variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:s,contains:O}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:i.begin,end:i.end},{match:a},{begin:o.begin,"on:begin":o.isTrulyOpeningTag,end:o.end}],subLanguage:`xml`,contains:[{begin:o.begin,end:o.end,skip:!0,contains:[`self`]}]}]},N,{beginKeywords:`while if switch catch for`},{begin:`\\b(?!function)`+e.UNDERSCORE_IDENT_RE+`\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{`,returnBegin:!0,label:`func.def`,contains:[k,e.inherit(e.TITLE_MODE,{begin:r,className:`title.function`})]},{match:/\.\.\./,relevance:0},L,{match:`\\$`+r,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:`title.function`},contains:[k]},I,P,A,R,{match:/\$[(.]/}]}}function D(e){let t={keyword:[`break`,`case`,`chan`,`const`,`continue`,`default`,`defer`,`else`,`fallthrough`,`for`,`func`,`go`,`goto`,`if`,`import`,`interface`,`map`,`package`,`range`,`return`,`select`,`struct`,`switch`,`type`,`var`],type:[`bool`,`byte`,`complex64`,`complex128`,`error`,`float32`,`float64`,`int8`,`int16`,`int32`,`int64`,`string`,`uint8`,`uint16`,`uint32`,`uint64`,`int`,`uint`,`uintptr`,`rune`],literal:[`true`,`false`,`iota`,`nil`],built_in:[`append`,`cap`,`close`,`complex`,`copy`,`imag`,`len`,`make`,`new`,`panic`,`print`,`println`,`real`,`recover`,`delete`]};return{name:`Go`,aliases:[`golang`],keywords:t,illegal:`</`,contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:`string`,variants:[e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{begin:"`",end:"`"}]},{className:`number`,variants:[{match:/-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/,relevance:0},{match:/-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,relevance:0},{match:/-?\b0[oO](_?[0-7])*i?/,relevance:0},{match:/-?\b0[bB](_?[01])*i?/,relevance:0},{match:/-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/,relevance:0},{match:/-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/,relevance:0}]},{begin:/:=/},{className:`function`,beginKeywords:`func`,end:`\\s*(\\{|$)`,excludeEnd:!0,contains:[e.TITLE_MODE,{className:`params`,begin:/\(/,end:/\)/,endsParent:!0,keywords:t,illegal:/["']/}]}]}}function O(e){let t=e.regex,n=/[\p{XID_Start}_]\p{XID_Continue}*/u,r=`and.as.assert.async.await.break.case.class.continue.def.del.elif.else.except.finally.for.from.global.if.import.in.is.lambda.lazy.match.nonlocal|10.not.or.pass.raise.return.try.while.with.yield`.split(`.`),i={$pattern:/[A-Za-z]\w+|__\w+__/,keyword:r,built_in:`__import__.abs.aiter.all.anext.any.ascii.bin.bool.breakpoint.bytearray.bytes.callable.chr.classmethod.compile.complex.delattr.dict.dir.divmod.enumerate.eval.exec.filter.float.format.frozendict.frozenset.getattr.globals.hasattr.hash.help.hex.id.input.int.isinstance.issubclass.iter.len.list.locals.map.max.memoryview.min.next.object.oct.open.ord.pow.print.property.range.repr.reversed.round.sentinel.set.setattr.slice.sorted.staticmethod.str.sum.super.tuple.type.vars.zip`.split(`.`),literal:[`__debug__`,`Ellipsis`,`False`,`None`,`NotImplemented`,`True`],type:[`Any`,`Callable`,`Coroutine`,`Dict`,`List`,`Literal`,`Generic`,`Optional`,`Sequence`,`Set`,`Tuple`,`Type`,`Union`]},a={className:`meta`,begin:/^(>>>|\.\.\.) /},o={className:`subst`,begin:/\{/,end:/\}/,keywords:i,illegal:/#/},s={begin:/\{\{/,relevance:0},c={className:`string`,contains:[e.BACKSLASH_ESCAPE],variants:[{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,end:/'''/,contains:[e.BACKSLASH_ESCAPE,a],relevance:10},{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,end:/"""/,contains:[e.BACKSLASH_ESCAPE,a],relevance:10},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])'''/,end:/'''/,contains:[e.BACKSLASH_ESCAPE,a,s,o]},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])"""/,end:/"""/,contains:[e.BACKSLASH_ESCAPE,a,s,o]},{begin:/([uU]|[rR])'/,end:/'/,relevance:10},{begin:/([uU]|[rR])"/,end:/"/,relevance:10},{begin:/([bB]|[bB][rR]|[rR][bB])'/,end:/'/},{begin:/([bB]|[bB][rR]|[rR][bB])"/,end:/"/},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])'/,end:/'/,contains:[e.BACKSLASH_ESCAPE,s,o]},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,s,o]},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},l=`[0-9](_?[0-9])*`,u=`(\\b(${l}))?\\.(${l})|\\b(${l})\\.`,d=`\\b|${r.join(`|`)}`,f={className:`number`,relevance:0,variants:[{begin:`(\\b(${l})|(${u}))[eE][+-]?(${l})[jJ]?(?=${d})`},{begin:`(${u})[jJ]?`},{begin:`\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${d})`},{begin:`\\b0[bB](_?[01])+[lL]?(?=${d})`},{begin:`\\b0[oO](_?[0-7])+[lL]?(?=${d})`},{begin:`\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${d})`},{begin:`\\b(${l})[jJ](?=${d})`}]},p={className:`comment`,begin:t.lookahead(/# type:/),end:/$/,keywords:i,contains:[{begin:/# type:/},{begin:/#/,end:/\b\B/,endsWithParent:!0}]},m={className:`params`,variants:[{className:``,begin:/\(\s*\)/,skip:!0},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:i,contains:[`self`,a,f,c,e.HASH_COMMENT_MODE]}]};return o.contains=[c,f,a],{name:`Python`,aliases:[`py`,`gyp`,`ipython`],unicodeRegex:!0,keywords:i,illegal:/(<\/|\?)|=>/,contains:[a,f,{scope:`variable.language`,match:/\bself\b/},{beginKeywords:`if`,relevance:0},{match:/\bor\b/,scope:`keyword`},c,p,e.HASH_COMMENT_MODE,{match:[/\bdef/,/\s+/,n],scope:{1:`keyword`,3:`title.function`},contains:[m]},{variants:[{match:[/\bclass/,/\s+/,n,/\s*/,/\(\s*/,n,/\s*\)/]},{match:[/\bclass/,/\s+/,n]}],scope:{1:`keyword`,3:`title.class`,6:`title.class.inherited`}},{className:`meta`,begin:/^[\t ]*@/,end:/(?=#)|$/,contains:[f,m,c]}]}}function k(e){let t=e.regex,n=/(?![A-Za-z0-9])(?![$])/,r=t.concat(/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/,n),i=t.concat(/(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/,n),a=t.concat(/[A-Z]+/,n),o={scope:`variable`,match:`\\$+`+r},s={scope:`meta`,variants:[{begin:/<\?php/,relevance:10},{begin:/<\?=/},{begin:/<\?/,relevance:.1},{begin:/\?>/}]},c={scope:`subst`,variants:[{begin:/\$\w+/},{begin:/\{\$/,end:/\}/}]},l=e.inherit(e.APOS_STRING_MODE,{illegal:null}),u=e.inherit(e.QUOTE_STRING_MODE,{illegal:null,contains:e.QUOTE_STRING_MODE.contains.concat(c)}),d={begin:/<<<[ \t]*(?:(\w+)|"(\w+)")\n/,end:/[ \t]*(\w+)\b/,contains:e.QUOTE_STRING_MODE.contains.concat(c),"on:begin":(e,t)=>{t.data._beginMatch=e[1]||e[2]},"on:end":(e,t)=>{t.data._beginMatch!==e[1]&&t.ignoreMatch()}},f=e.END_SAME_AS_BEGIN({begin:/<<<[ \t]*'(\w+)'\n/,end:/[ \t]*(\w+)\b/}),p=`[ 	
]`,m={scope:`string`,variants:[u,l,d,f]},h={scope:`number`,variants:[{begin:`\\b0[bB][01]+(?:_[01]+)*\\b`},{begin:`\\b0[oO][0-7]+(?:_[0-7]+)*\\b`},{begin:`\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b`},{begin:`(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?`}],relevance:0},g=[`false`,`null`,`true`],_=`__CLASS__.__DIR__.__FILE__.__FUNCTION__.__COMPILER_HALT_OFFSET__.__LINE__.__METHOD__.__NAMESPACE__.__TRAIT__.die.echo.exit.include.include_once.print.require.require_once.array.abstract.and.as.binary.bool.boolean.break.callable.case.catch.class.clone.const.continue.declare.default.do.double.else.elseif.empty.enddeclare.endfor.endforeach.endif.endswitch.endwhile.enum.eval.extends.final.finally.float.for.foreach.from.global.goto.if.implements.instanceof.insteadof.int.integer.interface.isset.iterable.list.match|0.mixed.new.never.object.or.private.protected.public.readonly.real.return.string.switch.throw.trait.try.unset.use.var.void.while.xor.yield`.split(`.`),v=`Error|0.AppendIterator.ArgumentCountError.ArithmeticError.ArrayIterator.ArrayObject.AssertionError.BadFunctionCallException.BadMethodCallException.CachingIterator.CallbackFilterIterator.CompileError.Countable.DirectoryIterator.DivisionByZeroError.DomainException.EmptyIterator.ErrorException.Exception.FilesystemIterator.FilterIterator.GlobIterator.InfiniteIterator.InvalidArgumentException.IteratorIterator.LengthException.LimitIterator.LogicException.MultipleIterator.NoRewindIterator.OutOfBoundsException.OutOfRangeException.OuterIterator.OverflowException.ParentIterator.ParseError.RangeException.RecursiveArrayIterator.RecursiveCachingIterator.RecursiveCallbackFilterIterator.RecursiveDirectoryIterator.RecursiveFilterIterator.RecursiveIterator.RecursiveIteratorIterator.RecursiveRegexIterator.RecursiveTreeIterator.RegexIterator.RuntimeException.SeekableIterator.SplDoublyLinkedList.SplFileInfo.SplFileObject.SplFixedArray.SplHeap.SplMaxHeap.SplMinHeap.SplObjectStorage.SplObserver.SplPriorityQueue.SplQueue.SplStack.SplSubject.SplTempFileObject.TypeError.UnderflowException.UnexpectedValueException.UnhandledMatchError.ArrayAccess.BackedEnum.Closure.Fiber.Generator.Iterator.IteratorAggregate.Serializable.Stringable.Throwable.Traversable.UnitEnum.WeakReference.WeakMap.Directory.__PHP_Incomplete_Class.parent.php_user_filter.self.static.stdClass`.split(`.`),y={keyword:_,literal:(e=>{let t=[];return e.forEach(e=>{t.push(e),e.toLowerCase()===e?t.push(e.toUpperCase()):t.push(e.toLowerCase())}),t})(g),built_in:v},b=e=>e.map(e=>e.replace(/\|\d+$/,``)),x={variants:[{match:[/new/,t.concat(p,`+`),t.concat(`(?!`,b(v).join(`\\b|`),`\\b)`),i],scope:{1:`keyword`,4:`title.class`}}]},S=t.concat(r,`\\b(?!\\()`),C={variants:[{match:[t.concat(/::/,t.lookahead(/(?!class\b)/)),S],scope:{2:`variable.constant`}},{match:[/::/,/class/],scope:{2:`variable.language`}},{match:[i,t.concat(/::/,t.lookahead(/(?!class\b)/)),S],scope:{1:`title.class`,3:`variable.constant`}},{match:[i,t.concat(`::`,t.lookahead(/(?!class\b)/))],scope:{1:`title.class`}},{match:[i,/::/,/class/],scope:{1:`title.class`,3:`variable.language`}}]},w={scope:`attr`,match:t.concat(r,t.lookahead(`:`),t.lookahead(/(?!::)/))},T={relevance:0,begin:/\(/,end:/\)/,keywords:y,contains:[w,o,C,e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE,e.HASH_COMMENT_MODE,m,h,x]},E={relevance:0,match:[/\b/,t.concat(`(?!fn\\b|function\\b|`,b(_).join(`\\b|`),`|`,b(v).join(`\\b|`),`\\b)`),r,t.concat(p,`*`),t.lookahead(/(?=\()/)],scope:{3:`title.function.invoke`},contains:[T]};T.contains.push(E);let D=[w,C,e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE,e.HASH_COMMENT_MODE,m,h,x],O={begin:t.concat(/#\[\s*\\?/,t.either(i,a)),beginScope:`meta`,end:/]/,endScope:`meta`,keywords:{literal:g,keyword:[`new`,`array`]},contains:[{begin:/\[/,end:/]/,keywords:{literal:g,keyword:[`new`,`array`]},contains:[`self`,...D]},...D,{scope:`meta`,variants:[{match:i},{match:a}]}]};return{case_insensitive:!1,keywords:y,contains:[O,e.HASH_COMMENT_MODE,e.COMMENT(`//`,`$`),e.COMMENT(`/\\*`,`\\*/`,{contains:[{scope:`doctag`,match:`@[A-Za-z]+`}]}),{match:/__halt_compiler\(\);/,keywords:`__halt_compiler`,starts:{scope:`comment`,end:e.MATCH_NOTHING_RE,contains:[{match:/\?>/,scope:`meta`,endsParent:!0}]}},s,{scope:`variable.language`,match:/\$this\b/},o,E,C,{match:[/const/,/\s/,r],scope:{1:`keyword`,3:`variable.constant`}},x,{scope:`function`,relevance:0,beginKeywords:`fn function`,end:/[;{]/,excludeEnd:!0,illegal:`[$%\\[]`,contains:[{beginKeywords:`use`},e.UNDERSCORE_TITLE_MODE,{begin:`=>`,endsParent:!0},{scope:`params`,begin:`\\(`,end:`\\)`,excludeBegin:!0,excludeEnd:!0,keywords:y,contains:[`self`,O,o,C,e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE,e.HASH_COMMENT_MODE,m,h]}]},{scope:`class`,variants:[{beginKeywords:`enum`,illegal:/[($"]/},{beginKeywords:`class interface trait`,illegal:/[:($"]/}],relevance:0,end:/\{/,excludeEnd:!0,contains:[{beginKeywords:`extends implements`},e.UNDERSCORE_TITLE_MODE]},{beginKeywords:`namespace`,relevance:0,end:`;`,illegal:/[.']/,contains:[e.inherit(e.UNDERSCORE_TITLE_MODE,{scope:`title.class`})]},{beginKeywords:`use`,relevance:0,end:`;`,contains:[{match:/\b(as|const|function)\b/,scope:`keyword`},e.UNDERSCORE_TITLE_MODE]},m,h]}}function A(e){let t=e.regex,n={className:`subst`,variants:[{begin:`\\$[A-Za-z0-9_]+`}]},r={className:`subst`,variants:[{begin:/\$\{/,end:/\}/}],keywords:`true false null this is new super`},i={className:`number`,relevance:0,variants:[{match:/\b[0-9][0-9_]*(\.[0-9][0-9_]*)?([eE][+-]?[0-9][0-9_]*)?\b/},{match:/\b0[xX][0-9A-Fa-f][0-9A-Fa-f_]*\b/}]},a={className:`string`,variants:[{begin:`r'''`,end:`'''`},{begin:`r"""`,end:`"""`},{begin:`r'`,end:`'`,illegal:`\\n`},{begin:`r"`,end:`"`,illegal:`\\n`},{begin:`'''`,end:`'''`,contains:[e.BACKSLASH_ESCAPE,n,r]},{begin:`"""`,end:`"""`,contains:[e.BACKSLASH_ESCAPE,n,r]},{begin:`'`,end:`'`,illegal:`\\n`,contains:[e.BACKSLASH_ESCAPE,n,r]},{begin:`"`,end:`"`,illegal:`\\n`,contains:[e.BACKSLASH_ESCAPE,n,r]}]};r.contains=[i,a];let o=`Comparable.DateTime.Duration.Function.Iterable.Iterator.List.Map.Match.Object.Pattern.RegExp.Set.Stopwatch.String.StringBuffer.StringSink.Symbol.Type.Uri.bool.double.int.num.Element.ElementList`.split(`.`),s=o.map(e=>`${e}?`),c={keyword:`abstract.as.assert.async.await.base.break.case.catch.class.const.continue.covariant.default.deferred.do.dynamic.else.enum.export.extends.extension.external.factory.false.final.finally.for.Function.get.hide.if.implements.import.in.interface.is.late.library.mixin.new.null.on.operator.part.required.rethrow.return.sealed.set.show.static.super.switch.sync.this.throw.true.try.typedef.var.void.when.while.with.yield`.split(`.`),built_in:o.concat(s).concat([`Never`,`Null`,`dynamic`,`print`,`document`,`querySelector`,`querySelectorAll`,`window`]),$pattern:/[A-Za-z][A-Za-z0-9_]*\??/},l={match:t.concat(/\b_?/,t.either(/(?:[A-Z]+[a-z0-9]+)+/,/(?:[A-Z]+[a-z0-9]+)+[A-Z]+/),/(?![A-Za-z0-9_])/),scope:`title.class`};return{name:`Dart`,keywords:c,contains:[a,e.COMMENT(/\/\*\*(?!\/)/,/\*\//,{subLanguage:`markdown`,relevance:0}),e.COMMENT(/\/{3,} ?/,/$/,{contains:[{subLanguage:`markdown`,begin:`.`,end:`$`,relevance:0}]}),e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:`class`,beginKeywords:`class interface`,end:/\{/,excludeEnd:!0,contains:[{beginKeywords:`extends implements`},e.UNDERSCORE_TITLE_MODE]},l,{match:/\b(?!(?:assert|catch|for|if|switch|while)\b)[a-z_][A-Za-z0-9_]*(?=\()/,scope:`title.function`},i,{className:`meta`,begin:`@[A-Za-z]+`}]}}function j(e){let t=e.regex,n={begin:/<\/?[A-Za-z_]/,end:`>`,subLanguage:`xml`,relevance:0},r={match:/^ {0,3}([-*_])[ \t]*(?:\1[ \t]*){2,}$/},i={className:`code`,variants:[{begin:"(`{3,})[^`](.|\\n)*?\\1`*[ ]*"},{begin:`(~{3,})[^~](.|\\n)*?\\1~*[ ]*`},{begin:"```",end:"```+[ ]*$"},{begin:`~~~`,end:`~~~+[ ]*$`},{begin:"`.+?`"},{begin:`(?=^( {4}|\\t))`,contains:[{begin:`^( {4}|\\t)`,end:`(\\n)$`}],relevance:0}]},a={className:`bullet`,begin:`^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)`,end:`\\s+`,excludeEnd:!0},o={begin:/^\[[^\n]+\]:/,returnBegin:!0,contains:[{className:`symbol`,begin:/\[/,end:/\]/,excludeBegin:!0,excludeEnd:!0},{className:`link`,begin:/:\s*/,end:/$/,excludeBegin:!0}]},s={variants:[{begin:/\[.+?\]\[.*?\]/,relevance:0},{begin:/\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,relevance:2},{begin:t.concat(/\[.+?\]\(/,/[A-Za-z][A-Za-z0-9+.-]*/,/:\/\/.*?\)/),relevance:2},{begin:/\[.+?\]\([./?&#].*?\)/,relevance:1},{begin:/\[.*?\]\(.*?\)/,relevance:0}],returnBegin:!0,contains:[{match:/\[(?=\])/},{className:`string`,relevance:0,begin:`\\[`,end:`\\]`,excludeBegin:!0,returnEnd:!0},{className:`link`,relevance:0,begin:`\\]\\(`,end:`\\)`,excludeBegin:!0,excludeEnd:!0},{className:`symbol`,relevance:0,begin:`\\]\\[`,end:`\\]`,excludeBegin:!0,excludeEnd:!0}]},c={className:`strong`,contains:[],variants:[{begin:/_{2}(?!\s)/,end:/_{2}/},{begin:/\*{2}(?!\s)/,end:/\*{2}/}]},l={className:`emphasis`,contains:[],variants:[{begin:/\*(?![*\s])/,end:/\*/},{begin:/_(?![_\s])/,end:/_/,relevance:0}]},u=e.inherit(c,{contains:[]}),d=e.inherit(l,{contains:[]});c.contains.push(d),l.contains.push(u);let f=[n,s];return[c,l,u,d].forEach(e=>{e.contains=e.contains.concat(f)}),f=f.concat(c,l),{name:`Markdown`,aliases:[`md`,`mkdown`,`mkd`],contains:[{className:`section`,variants:[{begin:`^#{1,6}`,end:`$`,contains:f},{begin:`(?=^.+?\\n[=-]{2,}$)`,contains:[{begin:`^[=-]*$`},{begin:`^`,end:`\\n`,contains:f}]}]},n,a,r,c,l,{className:`quote`,begin:`^>\\s+`,contains:f,end:`$`},i,s,o,{scope:`literal`,match:/&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/}]}}f.registerLanguage(`bash`,h),f.registerLanguage(`javascript`,E),f.registerLanguage(`go`,D),f.registerLanguage(`python`,O),f.registerLanguage(`php`,k),f.registerLanguage(`dart`,A),f.registerLanguage(`markdown`,j);var M={curl:`bash`,fetch:`javascript`,axios:`javascript`,laravel:`php`,go:`go`,python:`python`,php:`php`,dart:`dart`};function N(e){let t=e.split(/(<[^>]*>)/g),n=!1,r=[];return t.map(e=>e.startsWith(`<`)?(e.startsWith(`</span`)?r.pop()?.includes(`hljs-string`)&&(n=r.some(e=>e.includes(`hljs-string`))):e.startsWith(`<span`)&&(r.push(e),e.includes(`hljs-string`)&&(n=!0)),e):n||e===``?e:e.replace(/(curl)|(https?:\/\/[^\s"'`&;<>]+)|(--?[a-zA-Z][a-zA-Z0-9-]*)/g,(e,t,n,r)=>t?`<span class="text-emerald-300">${t}</span>`:n?`<span class="text-sky-300">${n}</span>`:r?`<span class="text-amber-300">${r}</span>`:e)).join(``)}function P(e,t){if(f.getLanguage(t)){let n=f.highlight(e,{language:t}).value;return t===`bash`?N(n):n}return f.highlightAuto(e).value}function F({code:e,lang:t}){let n=(0,l.useMemo)(()=>P(e,M[t]),[e,t]);return(0,u.jsx)(`pre`,{className:`overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed`,children:(0,u.jsx)(`code`,{style:{fontFamily:`'JetBrains Mono', monospace`},className:`hljs whitespace-pre text-slate-200`,dangerouslySetInnerHTML:{__html:n}})})}var I=`https://www.emsifa.com/api-data-wilayah-v2/v2`,L=[{method:`GET`,path:`/stats.json`,description:`Intip ringkasannya dulu — total provinsi, kab/kota, kecamatan, kelurahan, kode pos, luas & populasi`,curl:`curl ${I}/stats.json`,snippets:{curl:`curl ${I}/stats.json`,fetch:`const res = await fetch("${I}/stats.json");
const { data, meta } = await res.json();`,axios:`const { data: { data, meta } } = await axios.get(
  "${I}/stats.json"
);`,laravel:`$response = Http::get("${I}/stats.json");
$data = $response->json("data");`,go:`resp, err := http.Get("${I}/stats.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,python:`import requests

r = requests.get("${I}/stats.json")
data = r.json()["data"]`,php:`$ch = curl_init("${I}/stats.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$data = $body["data"];`,dart:`final res = await http.get(Uri.parse("${I}/stats.json"));
final data = jsonDecode(res.body)["data"];`},response:`{
  "data": {
    "total_area": 1889518.2539999997,
    "total_districts": 7285,
    "total_paths": 551,
    "total_population": 284973643,
    "total_postal_codes": 10632,
    "total_provinces": 38,
    "total_regencies": 514,
    "total_villages": 83762
  },
  "meta": {
    "generated_at": "2026-09-02T03:35:49Z",
    "level": 0
  }
}`},{method:`GET`,path:`/provinces.json`,description:`Ambil semua provinsi — lengkap sama kapital, koordinat, populasi & luasnya (level 1)`,curl:`curl ${I}/provinces.json`,snippets:{curl:`curl ${I}/provinces.json`,fetch:`const res = await fetch("${I}/provinces.json");
const { data, meta } = await res.json();`,axios:`const { data: { data, meta } } = await axios.get(
  "${I}/provinces.json"
);`,laravel:`$response = Http::get("${I}/provinces.json");
$provinces = $response->json("data");`,go:`resp, err := http.Get("${I}/provinces.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,python:`import requests

r = requests.get("${I}/provinces.json")
provinces = r.json()["data"]`,php:`$ch = curl_init("${I}/provinces.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$provinces = $body["data"];`,dart:`final res = await http.get(Uri.parse("${I}/provinces.json"));
final provinces = jsonDecode(res.body)["data"] as List;`},response:`{
  "data": [
    {
      "id": "11",
      "name": "Aceh",
      "capital": "Banda Aceh",
      "lat": 5.570546962920454,
      "lng": 95.34080851187178,
      "elv": 11,
      "tz": 7,
      "population": 5623479,
      "total_area": 56835.019,
      "has_path": true
    },
    {
      "id": "12",
      "name": "Sumatera Utara",
      "capital": "Medan",
      "lat": 3.5806304901245087,
      "lng": 98.67199998443536,
      "elv": 32,
      "tz": 7,
      "population": 15640905,
      "total_area": 72437.755,
      "has_path": true
    }
    // ... 36 more
  ],
  "meta": {
    "generated_at": "2026-09-02T03:35:49Z",
    "level": 1
  }
}`},{method:`GET`,path:`/provinces/{code}.json`,description:`Kepoin satu provinsi aja by kode — misal 32 = Jawa Barat (level 1)`,curl:`curl ${I}/provinces/32.json`,snippets:{curl:`curl ${I}/provinces/32.json`,fetch:`const res = await fetch("${I}/provinces/32.json");
const { data, meta } = await res.json();`,axios:`const { data: { data, meta } } = await axios.get(
  "${I}/provinces/32.json"
);`,laravel:`$response = Http::get("${I}/provinces/32.json");
$province = $response->json("data");`,go:`resp, err := http.Get("${I}/provinces/32.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,python:`import requests

r = requests.get("${I}/provinces/32.json")
province = r.json()["data"]`,php:`$ch = curl_init("${I}/provinces/32.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$province = $body["data"];`,dart:`final res = await http.get(Uri.parse("${I}/provinces/32.json"));
final province = jsonDecode(res.body)["data"] as Map;`},response:`{
  "data": {
    "id": "32",
    "name": "Jawa Barat",
    "capital": "Bandung",
    "lat": -6.902224715926122,
    "lng": 107.61875975420881,
    "elv": 739,
    "tz": 7,
    "population": 51316378,
    "total_area": 37053.331,
    "has_path": true
  },
  "meta": {
    "generated_at": "2026-09-02T03:35:49Z",
    "level": 1
  }
}`},{method:`GET`,path:`/regencies/{province_id}.json`,description:`Daftar kab/kota di provinsi tertentu — misal semua kota di Jawa Barat (level 2)`,curl:`curl ${I}/regencies/32.json`,snippets:{curl:`curl ${I}/regencies/32.json`,fetch:`const res = await fetch("${I}/regencies/32.json");
const { data, meta } = await res.json();`,axios:`const { data: { data, meta } } = await axios.get(
  "${I}/regencies/32.json"
);`,laravel:`$response = Http::get("${I}/regencies/32.json");
$regencies = $response->json("data");`,go:`resp, err := http.Get("${I}/regencies/32.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,python:`import requests

r = requests.get("${I}/regencies/32.json")
regencies = r.json()["data"]`,php:`$ch = curl_init("${I}/regencies/32.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$regencies = $body["data"];`,dart:`final res = await http.get(Uri.parse("${I}/regencies/32.json"));
final regencies = jsonDecode(res.body)["data"] as List;`},response:`{
  "data": [
    {
      "id": "32.01",
      "name": "Kabupaten Bogor",
      "capital": "Cibinong",
      "lat": -6.479478948089524,
      "lng": 106.82471731002641,
      "elv": 134,
      "tz": 7,
      "population": 5809790,
      "total_area": 2991.778,
      "has_path": true
    },
    {
      "id": "32.02",
      "name": "Kabupaten Sukabumi",
      "capital": "Palabuhanratu",
      "lat": -6.989164614549726,
      "lng": 106.55022261003006,
      "elv": 16,
      "tz": 7,
      "population": 2868943,
      "total_area": 4163.824,
      "has_path": true
    }
    // ... 25 more (total 27 regencies in Jawa Barat)
  ],
  "meta": {
    "generated_at": "2026-09-02T03:35:49Z",
    "level": 2
  }
}`},{method:`GET`,path:`/regencies/{regency_id}.json`,description:`Detail satu kab/kota by kode — bonus info provinsinya juga (level 2)`,curl:`curl ${I}/regencies/32.73.json`,snippets:{curl:`curl ${I}/regencies/32.73.json`,fetch:`const res = await fetch("${I}/regencies/32.73.json");
const { data, meta } = await res.json();`,axios:`const { data: { data, meta } } = await axios.get(
  "${I}/regencies/32.73.json"
);`,laravel:`$response = Http::get("${I}/regencies/32.73.json");
$regency = $response->json("data");`,go:`resp, err := http.Get("${I}/regencies/32.73.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,python:`import requests

r = requests.get("${I}/regencies/32.73.json")
regency = r.json()["data"]`,php:`$ch = curl_init("${I}/regencies/32.73.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$regency = $body["data"];`,dart:`final res = await http.get(Uri.parse("${I}/regencies/32.73.json"));
final regency = jsonDecode(res.body)["data"] as Map;`},response:`{
  "data": {
    "id": "32.73",
    "name": "Kota Bandung",
    "capital": "Bandung",
    "lat": -6.910655826355507,
    "lng": 107.60986952537303,
    "elv": 726,
    "tz": 7,
    "population": 2591763,
    "total_area": 166.593,
    "has_path": true,
    "province": {
      "id": "32",
      "name": "Jawa Barat"
    }
  },
  "meta": {
    "generated_at": "2026-09-02T03:35:49Z",
    "level": 2
  }
}`},{method:`GET`,path:`/districts/{regency_id}.json`,description:`Daftar kecamatan di kab/kota tertentu — lengkap dengan koordinat lat/lng (level 3)`,curl:`curl ${I}/districts/32.73.json`,snippets:{curl:`curl ${I}/districts/32.73.json`,fetch:`const res = await fetch("${I}/districts/32.73.json");
const { data, meta } = await res.json();`,axios:`const { data: { data, meta } } = await axios.get(
  "${I}/districts/32.73.json"
);`,laravel:`$response = Http::get("${I}/districts/32.73.json");
$districts = $response->json("data");`,go:`resp, err := http.Get("${I}/districts/32.73.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,python:`import requests

r = requests.get("${I}/districts/32.73.json")
districts = r.json()["data"]`,php:`$ch = curl_init("${I}/districts/32.73.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$districts = $body["data"];`,dart:`final res = await http.get(Uri.parse("${I}/districts/32.73.json"));
final districts = jsonDecode(res.body)["data"] as List;`},response:`{
  "data": [
    { "id": "32.73.01", "name": "Sukasari", "lat": -6.873456, "lng": 107.591234, "has_path": true },
    { "id": "32.73.02", "name": "Coblong", "lat": -6.882345, "lng": 107.603456, "has_path": true },
    { "id": "32.73.03", "name": "Babakan Ciparay", "lat": -6.891234, "lng": 107.585678, "has_path": false },
    { "id": "32.73.04", "name": "Bojongloa Kaler", "lat": -6.901234, "lng": 107.578901, "has_path": true },
    { "id": "32.73.05", "name": "Andir", "lat": -6.912345, "lng": 107.592345, "has_path": true }
    // ... 25 more
  ],
  "meta": {
    "updated_at": "2026-09-03",
    "level": 3
  }
}`},{method:`GET`,path:`/districts/{district_id}.json`,description:`Detail satu kecamatan — plus tau dia dari provinsi & kab/kota mana, lengkap dengan koordinat (level 3)`,curl:`curl ${I}/districts/32.73.01.json`,snippets:{curl:`curl ${I}/districts/32.73.01.json`,fetch:`const res = await fetch("${I}/districts/32.73.01.json");
const { data, meta } = await res.json();`,axios:`const { data: { data, meta } } = await axios.get(
  "${I}/districts/32.73.01.json"
);`,laravel:`$response = Http::get("${I}/districts/32.73.01.json");
$district = $response->json("data");`,go:`resp, err := http.Get("${I}/districts/32.73.01.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,python:`import requests

r = requests.get("${I}/districts/32.73.01.json")
district = r.json()["data"]`,php:`$ch = curl_init("${I}/districts/32.73.01.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$district = $body["data"];`,dart:`final res = await http.get(Uri.parse("${I}/districts/32.73.01.json"));
final district = jsonDecode(res.body)["data"] as Map;`},response:`{
  "data": {
    "id": "32.73.01",
    "name": "Sukasari",
    "lat": -6.873456,
    "lng": 107.591234,
    "has_path": true,
    "province": {
      "id": "32",
      "name": "Jawa Barat"
    },
    "regency": {
      "id": "32.73",
      "name": "Kota Bandung"
    }
  },
  "meta": {
    "updated_at": "2026-09-03",
    "level": 3
  }
}`},{method:`GET`,path:`/villages/{district_id}.json`,description:`Daftar kelurahan/desa di kecamatan itu — udah include kode pos dan koordinat (level 4)`,curl:`curl ${I}/villages/32.73.01.json`,snippets:{curl:`curl ${I}/villages/32.73.01.json`,fetch:`const res = await fetch("${I}/villages/32.73.01.json");
const { data, meta } = await res.json();`,axios:`const { data: { data, meta } } = await axios.get(
  "${I}/villages/32.73.01.json"
);`,laravel:`$response = Http::get("${I}/villages/32.73.01.json");
$villages = $response->json("data");`,go:`resp, err := http.Get("${I}/villages/32.73.01.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,python:`import requests

r = requests.get("${I}/villages/32.73.01.json")
villages = r.json()["data"]`,php:`$ch = curl_init("${I}/villages/32.73.01.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$villages = $body["data"];`,dart:`final res = await http.get(Uri.parse("${I}/villages/32.73.01.json"));
final villages = jsonDecode(res.body)["data"] as List;`},response:`{
  "data": [
    { "id": "32.73.01.1001", "name": "Sukarasa", "postal_code": "40152", "lat": -6.873456, "lng": 107.591234, "has_path": true },
    { "id": "32.73.01.1002", "name": "Gegerkalong", "postal_code": "40153", "lat": -6.882345, "lng": 107.603456, "has_path": true },
    { "id": "32.73.01.1003", "name": "Isola", "postal_code": "40154", "lat": -6.891234, "lng": 107.585678, "has_path": false },
    { "id": "32.73.01.1004", "name": "Sarijadi", "postal_code": "40151", "lat": -6.901234, "lng": 107.578901, "has_path": true }
  ],
  "meta": {
    "updated_at": "2026-09-03",
    "level": 4
  }
}`},{method:`GET`,path:`/villages/{village_id}.json`,description:`Detail satu kelurahan/desa — lengkap kode pos, koordinat + provinsi, kab/kota, kecamatan (level 4)`,curl:`curl ${I}/villages/32.73.01.1001.json`,snippets:{curl:`curl ${I}/villages/32.73.01.1001.json`,fetch:`const res = await fetch("${I}/villages/32.73.01.1001.json");
const { data, meta } = await res.json();`,axios:`const { data: { data, meta } } = await axios.get(
  "${I}/villages/32.73.01.1001.json"
);`,laravel:`$response = Http::get("${I}/villages/32.73.01.1001.json");
$village = $response->json("data");`,go:`resp, err := http.Get("${I}/villages/32.73.01.1001.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,python:`import requests

r = requests.get("${I}/villages/32.73.01.1001.json")
village = r.json()["data"]`,php:`$ch = curl_init("${I}/villages/32.73.01.1001.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$village = $body["data"];`,dart:`final res = await http.get(Uri.parse("${I}/villages/32.73.01.1001.json"));
final village = jsonDecode(res.body)["data"] as Map;`},response:`{
  "data": {
    "id": "32.73.01.1001",
    "name": "Sukarasa",
    "postal_code": "40152",
    "lat": -6.873456,
    "lng": 107.591234,
    "has_path": true,
    "province": {
      "id": "32",
      "name": "Jawa Barat"
    },
    "regency": {
      "id": "32.73",
      "name": "Kota Bandung"
    },
    "district": {
      "id": "32.73.01",
      "name": "Sukasari"
    }
  },
  "meta": {
    "updated_at": "2026-09-03",
    "level": 4
  }
}`},{method:`GET`,path:`/postal-codes/{postal_code}.json`,description:`Cari kelurahan by kode pos — misal 40152 tuh daerah mana aja (level 4)`,curl:`curl ${I}/postal-codes/40152.json`,snippets:{curl:`curl ${I}/postal-codes/40152.json`,fetch:`const res = await fetch("${I}/postal-codes/40152.json");
const { data, meta } = await res.json();`,axios:`const { data: { data, meta } } = await axios.get(
  "${I}/postal-codes/40152.json"
);`,laravel:`$response = Http::get("${I}/postal-codes/40152.json");
$villages = $response->json("data");`,go:`resp, err := http.Get("${I}/postal-codes/40152.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,python:`import requests

r = requests.get("${I}/postal-codes/40152.json")
villages = r.json()["data"]`,php:`$ch = curl_init("${I}/postal-codes/40152.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$villages = $body["data"];`,dart:`final res = await http.get(Uri.parse("${I}/postal-codes/40152.json"));
final villages = jsonDecode(res.body)["data"] as List;`},response:`{
  "data": [
    {
      "id": "32.73.01.1001",
      "name": "Sukarasa",
      "postal_code": "40152",
      "province": {
        "id": "32",
        "name": "Jawa Barat"
      },
      "regency": {
        "id": "32.73",
        "name": "Kota Bandung"
      },
      "district": {
        "id": "32.73.01",
        "name": "Sukasari"
      }
    }
  ],
  "meta": {
    "generated_at": "2026-09-02T03:35:48Z",
    "level": 4
  }
}`},{method:`GET`,path:`/paths/{region_id}.json`,description:`Butuh polygon buat peta? Ambil garis batas wilayah di sini — support semua level: provinsi, kab/kota, kecamatan, kelurahan (compact JSON)`,curl:`curl ${I}/paths/32.json`,snippets:{curl:`curl ${I}/paths/32.json`,fetch:`const res = await fetch("${I}/paths/32.json");
const { data, meta } = await res.json();`,axios:`const { data: { data, meta } } = await axios.get(
  "${I}/paths/32.json"
);`,laravel:`$response = Http::get("${I}/paths/32.json");
$path = $response->json("data");`,go:`resp, err := http.Get("${I}/paths/32.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,python:`import requests

r = requests.get("${I}/paths/32.json")
path = r.json()["data"]`,php:`$ch = curl_init("${I}/paths/32.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$path = $body["data"];`,dart:`final res = await http.get(Uri.parse("${I}/paths/32.json"));
final path = jsonDecode(res.body)["data"] as Map;`},response:`{
  "data": {
    "id": "32",
    "path": [
      [-6.980237, 106.395627],
      [-6.934294, 106.390694],
      [-6.921623, 106.399689]
      // ... ~240 more points (compact, no indent)
    ]
  },
  "meta": {
    "updated_at": "2026-09-03",
    "level": 1
  }
}`},{method:`GET`,path:`/missings.json`,description:`Cek yang belum lengkap — list wilayah dimana has_path==false OR has_latlng==false (flat + summary by_level)`,curl:`curl ${I}/missings.json`,snippets:{curl:`curl ${I}/missings.json`,fetch:`const res = await fetch("${I}/missings.json");
const { data, meta, summary } = await res.json();`,axios:`const { data: { data, meta, summary } } = await axios.get(
  "${I}/missings.json"
);`,laravel:`$response = Http::get("${I}/missings.json");
$missings = $response->json("data");`,go:`resp, err := http.Get("${I}/missings.json")
if err != nil { /* handle */ }
defer resp.Body.Close()
var result map[string]any
json.NewDecoder(resp.Body).Decode(&result)`,python:`import requests

r = requests.get("${I}/missings.json")
missings = r.json()["data"]`,php:`$ch = curl_init("${I}/missings.json");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$body = json_decode(curl_exec($ch), true);
curl_close($ch);
$missings = $body["data"];`,dart:`final res = await http.get(Uri.parse("${I}/missings.json"));
final missings = jsonDecode(res.body)["data"] as List;`},response:`{
  "data": [
    { "id": "53.09.14.2011", "name": "Watu Pangan", "has_path": false, "has_latlng": false },
    { "id": "32.73.01.1001", "name": "Sukarasa", "has_path": true, "has_latlng": true }
    // ... hanya yang has_path==false OR has_latlng==false yang muncul
  ],
  "meta": {
    "updated_at": "2026-09-03",
    "level": 0
  },
  "summary": {
    "total_missing": 360,
    "total_missing_path": 320,
    "total_missing_latlng": 40,
    "total_missing_both": 12,
    "by_level": {
      "province": 0,
      "regency": 0,
      "district": 0,
      "village": 360
    }
  }
}`}],R=[{key:`curl`,label:`curl`},{key:`fetch`,label:`Fetch`},{key:`axios`,label:`Axios`},{key:`laravel`,label:`Laravel`},{key:`go`,label:`Go`},{key:`python`,label:`Python`},{key:`php`,label:`PHP`},{key:`dart`,label:`Dart`}];function z(){let[e,t]=(0,l.useState)(null),[n,r]=(0,l.useState)(`curl`),o=async(e,n)=>{await navigator.clipboard.writeText(e),t(n),setTimeout(()=>t(null),2e3)},f=`https://www.emsifa.com/api-data-wilayah-v2/v2`;return(0,u.jsx)(`section`,{id:`api`,className:`relative z-10 overflow-hidden rounded-t-[32px] border-t border-slate-200 bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.12)]`,children:(0,u.jsxs)(`div`,{className:`mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-14`,children:[(0,u.jsxs)(`div`,{className:`flex flex-col gap-6 md:flex-row md:items-end md:justify-between`,children:[(0,u.jsxs)(`div`,{children:[(0,u.jsxs)(`div`,{className:`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-widest text-slate-600 uppercase`,children:[(0,u.jsx)(`span`,{className:`h-1.5 w-1.5 rounded-full bg-emerald-500`}),`API Statis`]}),(0,u.jsx)(`h2`,{className:`mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl`,children:`Tinggal fetch, beres`}),(0,u.jsxs)(`p`,{className:`mt-2 max-w-xl text-sm leading-relaxed text-slate-600`,children:[`Nggak perlu bikin backend. Datanya cuma file JSON di GitHub Pages — tinggal `,(0,u.jsx)(`code`,{className:`rounded bg-slate-100 px-1 py-0.5 font-mono text-xs`,children:`fetch`}),` aja. Tanpa API key, tanpa rate limit. Gas langsung pakai.`]})]}),(0,u.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,u.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,u.jsx)(`code`,{className:`rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 md:text-sm`,children:f}),(0,u.jsx)(`button`,{onClick:()=>o(f,`base`),className:`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer`,"aria-label":`Copy base URL`,children:e===`base`?(0,u.jsx)(i,{size:16,className:`text-emerald-600`}):(0,u.jsx)(a,{size:16})})]}),(0,u.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[(0,u.jsxs)(`a`,{href:`/api-data-wilayah-v2/wilayah-postman.json`,download:!0,className:`inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50`,children:[(0,u.jsx)(s,{size:14}),` Postman`]}),(0,u.jsxs)(`a`,{href:`/api-data-wilayah-v2/openapi.yml`,download:!0,className:`inline-flex items-center gap-1.5 rounded-xl border border-slate-900 bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800`,children:[(0,u.jsx)(s,{size:14}),` openapi.yml`]})]})]})]}),(0,u.jsx)(`div`,{className:`mt-8 grid gap-3`,children:L.map(t=>(0,u.jsx)(d,{title:t.path,subtitle:t.description,badge:(0,u.jsx)(`span`,{className:`shrink-0 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold tracking-widest text-white uppercase`,children:`GET`}),children:(0,u.jsxs)(`div`,{className:`space-y-4`,children:[(0,u.jsxs)(`div`,{children:[(0,u.jsxs)(`div`,{className:`mb-2 flex flex-wrap items-center gap-2`,children:[(0,u.jsx)(`span`,{className:`text-xs font-semibold tracking-widest text-slate-500 uppercase`,children:`Request`}),(0,u.jsx)(`div`,{className:`hidden md:flex items-center gap-0.5 rounded-xl bg-slate-100 p-1`,children:R.map(e=>(0,u.jsx)(`button`,{onClick:()=>r(e.key),className:`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${n===e.key?`bg-white text-slate-900 shadow-sm`:`text-slate-500 hover:text-slate-700`}`,children:e.label},e.key))}),(0,u.jsx)(`select`,{value:n,onChange:e=>r(e.target.value),className:`md:hidden rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 cursor-pointer`,children:R.map(e=>(0,u.jsx)(`option`,{value:e.key,children:e.label},e.key))}),(0,u.jsxs)(`button`,{onClick:()=>o(t.snippets[n],t.path+`-code`),className:`ml-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer`,children:[e===t.path+`-code`?(0,u.jsx)(i,{size:12,className:`text-emerald-600`}):(0,u.jsx)(a,{size:12}),`Copy `,R.find(e=>e.key===n)?.label]})]}),(0,u.jsx)(F,{code:t.snippets[n],lang:n})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsxs)(`div`,{className:`mb-2 flex items-center justify-between`,children:[(0,u.jsx)(`span`,{className:`text-xs font-semibold tracking-widest text-slate-500 uppercase`,children:`Response`}),(0,u.jsxs)(`a`,{href:t.curl.replace(`curl `,``),target:`_blank`,rel:`noreferrer`,className:`inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900`,children:[`Try `,(0,u.jsx)(c,{size:12})]})]}),(0,u.jsx)(_,{code:t.response,theme:`light`})]})]})},t.path))}),(0,u.jsxs)(`p`,{className:`mt-6 text-center text-xs text-slate-400`,children:[`Ada `,L.length,` endpoint total • Semuanya balik`,` `,(0,u.jsx)(`code`,{className:`rounded bg-slate-100 px-1 py-0.5 font-mono`,children:`{ data, meta }`}),` `,`• Udah ke-cache CDN GitHub Pages, ngebut`]})]})})}export{z as ApiSection};