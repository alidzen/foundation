define(["handlebars"],function(n){return n.template({compiler:[6,">= 2.0.0-beta.1"],main:function(n,e,s,a){var t;return'<div class="b-ntf">\n  <h2 class="b-ntf__title">Ошибка</h2>\n  <div class="b-ntf__cont">\n    <p class="b-ntf__txt">'+this.escapeExpression((t=null!=(t=e.message||(null!=n?n.message:n))?t:e.helperMissing,"function"==typeof t?t.call(n,{name:"message",hash:{},data:a}):t))+"</p>\n  </div>\n</div>\n"},useData:!0})});