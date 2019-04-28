!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/sudoku/",n(n.s=0)}([function(t,e,n){"use strict";function r(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],r=!0,o=!1,i=void 0;try{for(var u,a=t[Symbol.iterator]();!(r=(u=a.next()).done)&&(n.push(u.value),!e||n.length!==e);r=!0);}catch(s){o=!0,i=s}finally{try{r||null==a.return||a.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function o(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function u(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function a(t,e,n){return e&&u(t.prototype,e),n&&u(t,n),t}var s;n.r(e),function(t){t[t.VeryEasy=30]="VeryEasy",t[t.Easy=36]="Easy",t[t.Normal=42]="Normal",t[t.Hard=48]="Hard",t[t.VeryHard=57]="VeryHard"}(s||(s={}));var l=function(){function t(e,n){i(this,t),this.x=e,this.y=n,this.size=void 0,this.left=void 0,this.right=void 0,this.up=void 0,this.down=void 0,this.size=0,this.left=this,this.right=this,this.up=this,this.down=this}return a(t,[{key:"incrementSize",value:function(){++this.size}},{key:"decrementSize",value:function(){--this.size}},{key:"horizontalExclude",value:function(){this.left.right=this.right,this.right.left=this.left}},{key:"verticalExclude",value:function(){this.up.down=this.down,this.down.up=this.up}},{key:"horizontalInclude",value:function(){this.left.right=this,this.right.left=this}},{key:"verticalInclude",value:function(){this.up.down=this,this.down.up=this}},{key:"horizontalInsert",value:function(t){t.left=this.left,t.right=this,this.left.right=t,this.left=t}},{key:"verticalInsert",value:function(t){t.up=this.up,t.down=this,this.up.down=t,this.up=t}},{key:"X",get:function(){return this.x}},{key:"Y",get:function(){return this.y}},{key:"Left",get:function(){return this.left}},{key:"Right",get:function(){return this.right}},{key:"Up",get:function(){return this.up}},{key:"Down",get:function(){return this.down}},{key:"Size",get:function(){return this.size}}]),t}(),c=function(){function t(e){i(this,t),this.root=void 0,this.columnHeaders=void 0,this.root=new l(-1,-1),this.columnHeaders=[];var n=this.convertDenseMatrixToSparseRepresentation(e);this.generateRows(n)}return a(t,[{key:"getColumnIndexOf",value:function(t){return this.columnHeaders.indexOf(t)}},{key:"convertDenseMatrixToSparseRepresentation",value:function(t){return t.map(function(t){return t.reduce(function(t,e,n){return e&&t.push(n),t},[])},[])}},{key:"cover",value:function(t){var e=this.columnHeaders[t];e.horizontalExclude();for(var n=e.Down;n!==e;n=n.Down)for(var r=n.Right;r!==n;r=r.Right)r.verticalExclude(),this.columnHeaders[r.X].decrementSize()}},{key:"uncover",value:function(t){var e=this.columnHeaders[t];e.horizontalInclude();for(var n=e.Up;n!==e;n=n.Up)for(var r=n.Left;r!==n;r=r.Left)r.verticalInclude(),this.columnHeaders[r.X].incrementSize()}},{key:"generateRows",value:function(t){var e=this;t.forEach(function(t,n){var r=new l(-1,n);t.forEach(function(t){var o=new l(t,n);e.columnHeaders.length<=t&&e.appendColumnHeaders(t-e.columnHeaders.length+1);var i=e.columnHeaders[t];i.verticalInsert(o),i.incrementSize(),r.horizontalInsert(o)}),r.horizontalExclude()})}},{key:"appendColumnHeaders",value:function(t){for(;t--;){var e=new l(this.columnHeaders.length,-1);this.root.horizontalInsert(e),this.columnHeaders.push(e)}}},{key:"Root",get:function(){return this.root}}]),t}(),f=function(){function t(){i(this,t),this.rowMetaData=void 0,this.sudokuRuleMatrix=void 0,this.rowMetaData=this.generateMatrixRows(),this.sudokuRuleMatrix=this.generateSudokuRuleMatrix()}return a(t,[{key:"solve",value:function(t){var e=this.applyGivenNumbersToRules(t),n=new c(e),r=[];return this.recurse(n,r,[]),r}},{key:"applyGivenNumbersToRules",value:function(t){var e=this;return this.sudokuRuleMatrix.filter(function(n,r){var o=e.rowMetaData[r],i=t[o.row][o.column];return null===i||i===o.value})}},{key:"recurse",value:function(t,e,n){if(t.Root.Right===t.Root)e.push(o(n).sort());else{var r=this.findBestColumnToStartAt(t.Root);if(!(r.Size<1)){var i=t.getColumnIndexOf(r);t.cover(i);for(var u=r.Down;u!==r;u=u.Down){n.push(u.Y);for(var a=u.Right;a!==u;a=a.Right)t.cover(a.X);this.recurse(t,e,n);for(var s=u.Left;s!==u;s=s.Left)t.uncover(s.X);n.pop()}t.uncover(i)}}}},{key:"findBestColumnToStartAt",value:function(t){for(var e=t.Right,n=e.Right;n!==t;n=n.Right)n.Size<e.Size&&(e=n);return e}},{key:"generateSudokuRuleMatrix",value:function(){var t=this;return this.rowMetaData.map(function(e){var n=t.getCellContraints(e),r=t.getRowContraints(e),i=t.getColumnConstraints(e),u=t.getBlockConstraints(e);return[].concat(o(n),o(r),o(i),o(u))})}},{key:"getCellContraints",value:function(t){for(var e=[],n=9*t.row+t.column,r=0;r<81;r++)e.push(r===n);return e}},{key:"getRowContraints",value:function(t){for(var e=[],n=0;n<9;n++)for(var r=1;r<=9;r++)e.push(t.value===r&&t.row===n);return e}},{key:"getColumnConstraints",value:function(t){for(var e=[],n=0;n<9;n++)for(var r=1;r<=9;r++)e.push(t.value===r&&t.column===n);return e}},{key:"getBlockConstraints",value:function(t){for(var e=[],n=0;n<9;n++)for(var r=1;r<=9;r++)e.push(t.value===r&&t.block===n);return e}},{key:"generateMatrixRows",value:function(){for(var t=[],e=0;e<9;e++)for(var n=0;n<9;n++)for(var r=1;r<=9;r++){var o=3*Math.floor(e/3)+Math.floor(n/3);t.push({row:e,column:n,block:o,value:r})}return t}}]),t}(),h=[[3,6,1,7,2,5,9,4,8],[5,8,7,9,6,4,2,1,3],[4,9,2,8,3,1,6,5,7],[6,3,8,2,5,9,4,7,1],[1,7,4,6,8,3,5,9,2],[2,5,9,1,4,7,8,3,6],[7,4,6,3,9,2,1,8,5],[9,2,3,5,1,8,7,6,4],[8,1,5,4,7,6,3,2,9]],v=function(){function t(e){i(this,t),this.difficulty=e,this.solution=void 0,this.data=void 0,this.solution=this.shuffle(h),this.data=[]}return a(t,[{key:"generate",value:function(){var t=new f,e=Date.now();this.data=this.solution.map(function(t){return o(t)});for(var n=[],r=1273;n.length<this.difficulty&&r--;){var i=void 0,u=void 0;do{i=~~(9*Math.random()),u=~~(9*Math.random())}while(n.includes("".concat(i,":").concat(u)));var a=this.data[i][u];this.data[i][u]=null,1===t.solve(this.data).length?n.push("".concat(i,":").concat(u)):this.data[i][u]=a}var l=Date.now()-e;return r>0?(console.log("It took ".concat(l,"ms to generate a ").concat(s[this.difficulty]," puzzle")),!0):(console.log("Failed to generate a ".concat(s[this.difficulty]," puzzle after ").concat(l,"ms")),!1)}},{key:"shuffle",value:function(t){for(var e=h.map(function(t){return o(t)}),n=0;n<4200;n++)this.moveRowOrColumn(e);return e}},{key:"getPuzzleData",value:function(){var t=this;return this.data.map(function(e,n){return e.map(function(e,r){return[t.solution[n][r],t.solution[n][r]===t.data[n][r]]})})}},{key:"moveRowOrColumn",value:function(t){var e=r(this.getFromAndTo(),2),n=e[0],o=e[1];Math.round(Math.random())?this.moveColumn(t,n,o):this.moveRow(t,n,o)}},{key:"getFromAndTo",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:-1;t=-1===t?Math.floor(3*Math.random()):t;var e=~~(3*Math.random());if(e===t)return this.getFromAndTo(t);var n=~~(3*Math.random());return[3*n+t,3*n+e]}},{key:"moveRow",value:function(t,e,n){var r=t[n];t[n]=t[e],t[e]=r}},{key:"moveColumn",value:function(t,e,n){t.forEach(function(t){var r=t[n];t[n]=t[e],t[e]=r})}}]),t}(),d=self;d.addEventListener("message",function(t){var e=t.data,n=function(t){var e=10;do{var n=new v(t);if(n.generate())return n.getPuzzleData()}while(--e);throw new Error("Could not generate puzzle.")}(e);d.postMessage({puzzleData:n,difficulty:e})});e.default=null}]);
//# sourceMappingURL=2f820bb435f1600ad5fa.worker.js.map