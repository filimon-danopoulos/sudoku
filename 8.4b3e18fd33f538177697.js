(()=>{"use strict";class t{#t;#e;#s;#o;#n;#r;#i;constructor(t,e){this.#t=0,this.#e=this,this.#s=this,this.#o=this,this.#n=this,this.#r=t,this.#i=e}get X(){return this.#r}get Y(){return this.#i}get Left(){return this.#e}get Right(){return this.#s}get Up(){return this.#o}get Down(){return this.#n}get Size(){return this.#t}incrementSize(){++this.#t}decrementSize(){--this.#t}horizontalExclude(){this.#e.#s=this.#s,this.#s.#e=this.#e}verticalExclude(){this.#o.#n=this.#n,this.#n.#o=this.#o}horizontalInclude(){this.#e.#s=this,this.#s.#e=this}verticalInclude(){this.#o.#n=this,this.#n.#o=this}horizontalInsert(t){t.#e=this.#e,t.#s=this,this.#e.#s=t,this.#e=t}verticalInsert(t){t.#o=this.#o,t.#n=this,this.#o.#n=t,this.#o=t}}class e{#l;#h;constructor(e){this.#l=new t(-1,-1),this.#h=[];const s=this.#u(e);this.#a(s)}getColumnIndexOf(t){return this.#h.indexOf(t)}get Root(){return this.#l}#u(t){return t.map((t=>t.reduce(((t,e,s)=>(e&&t.push(s),t)),[])),[])}cover(t){const e=this.#h[t];e.horizontalExclude();for(let t=e.Down;t!==e;t=t.Down)for(let e=t.Right;e!==t;e=e.Right)e.verticalExclude(),this.#h[e.X].decrementSize()}uncover(t){const e=this.#h[t];e.horizontalInclude();for(let t=e.Up;t!==e;t=t.Up)for(let e=t.Left;e!==t;e=e.Left)e.verticalInclude(),this.#h[e.X].incrementSize()}#a(e){e.forEach(((e,s)=>{const o=new t(-1,s);e.forEach((e=>{const n=new t(e,s);this.#h.length<=e&&this.#c(e-this.#h.length+1);const r=this.#h[e];r.verticalInsert(n),r.incrementSize(),o.horizontalInsert(n)})),o.horizontalExclude()}))}#c(e){for(;e--;){const e=new t(this.#h.length,-1);this.#l.horizontalInsert(e),this.#h.push(e)}}}class s{#g;#f;constructor(){this.#g=this.#d(),this.#f=this.#p()}solve(t){const s=this.#m(t),o=new e(s),n=[];return this.#z(o,n,[]),n}#m(t){return this.#f.filter(((e,s)=>{const o=this.#g[s],n=t[o.row][o.column];return null===n||n===o.value}))}#z(t,e,s){if(t.Root.Right===t.Root)return void e.push([...s].sort());const o=this.#v(t.Root);if(o.Size<1)return;const n=t.getColumnIndexOf(o);t.cover(n);for(let n=o.Down;n!==o;n=n.Down){s.push(n.Y);for(let e=n.Right;e!==n;e=e.Right)t.cover(e.X);this.#z(t,e,s);for(let e=n.Left;e!==n;e=e.Left)t.uncover(e.X);s.pop()}t.uncover(n)}#v(t){let e=t.Right;for(let s=e.Right;s!==t;s=s.Right)s.Size<e.Size&&(e=s);return e}#p(){return this.#g.map((t=>[...this.#w(t),...this.#R(t),...this.#C(t),...this.#M(t)]))}#w(t){const e=[],s=9*t.row+t.column;for(let t=0;t<81;t++)e.push(t===s);return e}#R(t){const e=[];for(let s=0;s<9;s++)for(let o=1;o<=9;o++)e.push(t.value===o&&t.row===s);return e}#C(t){const e=[];for(let s=0;s<9;s++)for(let o=1;o<=9;o++)e.push(t.value===o&&t.column===s);return e}#M(t){const e=[];for(let s=0;s<9;s++)for(let o=1;o<=9;o++)e.push(t.value===o&&t.block===s);return e}#d(){const t=[];for(let e=0;e<9;e++)for(let s=0;s<9;s++)for(let o=1;o<=9;o++){const n=3*Math.floor(e/3)+Math.floor(s/3);t.push({row:e,column:s,block:n,value:o})}return t}}const o=[[3,6,1,7,2,5,9,4,8],[5,8,7,9,6,4,2,1,3],[4,9,2,8,3,1,6,5,7],[6,3,8,2,5,9,4,7,1],[1,7,4,6,8,3,5,9,2],[2,5,9,1,4,7,8,3,6],[7,4,6,3,9,2,1,8,5],[9,2,3,5,1,8,7,6,4],[8,1,5,4,7,6,3,2,9]],n=[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8],[5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],[7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7],[7,8],[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,8]];class r{#x;#S;#H;constructor(){this.#x=[],this.#S=[],this.#H=[]}generate(){const t=new s;this.#x=this.#D(o),this.#H=Array.from(n),this.#S=this.#x.map((t=>[...t]));let e=128;for(;e--;){const e=this.#I(),s=[];for(let t=0;t<e.length;t++){const[o,n]=e[t],r=this.#S[o][n];s.push({row:o,column:n,value:r}),this.#S[o][n]=null,this.#H=this.#H.filter((t=>!(t[0]===o&&t[1]===n)))}if(1!==t.solve(this.#S).length){for(let t=0;t<s.length;t++){const{row:e,column:o,value:n}=s[t];this.#S[e][o]=n,this.#H.push([e,o])}if(this.#H.length<=28)break}}return e>0||(this.#S=[],!1)}#I(){const t=~~(Math.random()*this.#H.length),e=this.#H[t];return this.#H.length<=32?[e]:e[0]===e[1]?[e,[8-e[0],8-e[1]]]:[e,[e[1],e[0]]]}#D(t){const e=t.map((t=>[...t]));for(let t=0;t<1e3;t++)this.#k(e);return e}getPuzzleData(){return{puzzle:this.#S.flat().map((t=>t||0)).join(""),solution:this.#x.flat().map((t=>t||0)).join("")}}#k(t){const[e,s]=this.#T();Math.round(Math.random())?this.#E(t,e,s):this.#y(t,e,s)}#T(t=-1){const e=((t=-1===t?~~(3*Math.random()):t)+Math.round(2*Math.random()))%3,s=~~(3*Math.random());return[3*s+t,3*s+e]}#y(t,e,s){const o=t[s];t[s]=t[e],t[e]=o}#E(t,e,s){for(let o=0;o<t.length;o++){const n=t[o],r=n[s];n[s]=n[e],n[e]=r}}}self.onmessage=t=>{"generate"===t.data&&i()};const i=()=>{const t=new r;if(t.generate()){const{puzzle:e}=t.getPuzzleData();self.postMessage({puzzle:e})}else self.postMessage("failed")}})();
//# sourceMappingURL=8.4b3e18fd33f538177697.js.map