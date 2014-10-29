(function(e,t){if(typeof define==="function"&&define.amd){define(["underscore","jquery","exports"],function(n,r,i){e.Backbone=t(e,i,n,r)})}else if(typeof exports!=="undefined"){var n=require("underscore");t(e,exports,n)}else{e.Backbone=t(e,{},e._,e.jQuery||e.Zepto||e.ender||e.$)}})(this,function(e,t,n,r){var i=e.Backbone;var s=[];var o=s.push;var u=s.slice;var a=s.splice;t.VERSION="1.1.2";t.$=r;t.noConflict=function(){e.Backbone=i;return this};t.emulateHTTP=false;t.emulateJSON=false;var f=t.Events={on:function(e,t,n){if(!c(this,"on",e,[t,n])||!t)return this;this._events||(this._events={});var r=this._events[e]||(this._events[e]=[]);r.push({callback:t,context:n,ctx:n||this});return this},once:function(e,t,r){if(!c(this,"once",e,[t,r])||!t)return this;var i=this;var s=n.once(function(){i.off(e,s);t.apply(this,arguments)});s._callback=t;return this.on(e,s,r)},off:function(e,t,r){var i,s,o,u,a,f,l,h;if(!this._events||!c(this,"off",e,[t,r]))return this;if(!e&&!t&&!r){this._events=void 0;return this}u=e?[e]:n.keys(this._events);for(a=0,f=u.length;a<f;a++){e=u[a];if(o=this._events[e]){this._events[e]=i=[];if(t||r){for(l=0,h=o.length;l<h;l++){s=o[l];if(t&&t!==s.callback&&t!==s.callback._callback||r&&r!==s.context){i.push(s)}}}if(!i.length)delete this._events[e]}}return this},trigger:function(e){if(!this._events)return this;var t=u.call(arguments,1);if(!c(this,"trigger",e,t))return this;var n=this._events[e];var r=this._events.all;if(n)h(n,t);if(r)h(r,arguments);return this},stopListening:function(e,t,r){var i=this._listeningTo;if(!i)return this;var s=!t&&!r;if(!r&&typeof t==="object")r=this;if(e)(i={})[e._listenId]=e;for(var o in i){e=i[o];e.off(t,r,this);if(s||n.isEmpty(e._events))delete this._listeningTo[o]}return this}};var l=/\s+/;var c=function(e,t,n,r){if(!n)return true;if(typeof n==="object"){for(var i in n){e[t].apply(e,[i,n[i]].concat(r))}return false}if(l.test(n)){var s=n.split(l);for(var o=0,u=s.length;o<u;o++){e[t].apply(e,[s[o]].concat(r))}return false}return true};var h=function(e,t){var n,r=-1,i=e.length,s=t[0],o=t[1],u=t[2];switch(t.length){case 0:while(++r<i)(n=e[r]).callback.call(n.ctx);return;case 1:while(++r<i)(n=e[r]).callback.call(n.ctx,s);return;case 2:while(++r<i)(n=e[r]).callback.call(n.ctx,s,o);return;case 3:while(++r<i)(n=e[r]).callback.call(n.ctx,s,o,u);return;default:while(++r<i)(n=e[r]).callback.apply(n.ctx,t);return}};var p={listenTo:"on",listenToOnce:"once"};n.each(p,function(e,t){f[t]=function(t,r,i){var s=this._listeningTo||(this._listeningTo={});var o=t._listenId||(t._listenId=n.uniqueId("l"));s[o]=t;if(!i&&typeof r==="object")i=this;t[e](r,i,this);return this}});f.bind=f.on;f.unbind=f.off;n.extend(t,f);var d=t.Model=function(e,t){var r=e||{};t||(t={});this.cid=n.uniqueId("c");this.attributes={};if(t.collection)this.collection=t.collection;if(t.parse)r=this.parse(r,t)||{};r=n.defaults({},r,n.result(this,"defaults"));this.set(r,t);this.changed={};this.initialize.apply(this,arguments)};n.extend(d.prototype,f,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(e){return n.clone(this.attributes)},sync:function(){return t.sync.apply(this,arguments)},get:function(e){return this.attributes[e]},escape:function(e){return n.escape(this.get(e))},has:function(e){return this.get(e)!=null},set:function(e,t,r){var i,s,o,u,a,f,l,c;if(e==null)return this;if(typeof e==="object"){s=e;r=t}else{(s={})[e]=t}r||(r={});if(!this._validate(s,r))return false;o=r.unset;a=r.silent;u=[];f=this._changing;this._changing=true;if(!f){this._previousAttributes=n.clone(this.attributes);this.changed={}}c=this.attributes,l=this._previousAttributes;if(this.idAttribute in s)this.id=s[this.idAttribute];for(i in s){t=s[i];if(!n.isEqual(c[i],t))u.push(i);if(!n.isEqual(l[i],t)){this.changed[i]=t}else{delete this.changed[i]}o?delete c[i]:c[i]=t}if(!a){if(u.length)this._pending=r;for(var h=0,p=u.length;h<p;h++){this.trigger("change:"+u[h],this,c[u[h]],r)}}if(f)return this;if(!a){while(this._pending){r=this._pending;this._pending=false;this.trigger("change",this,r)}}this._pending=false;this._changing=false;return this},unset:function(e,t){return this.set(e,void 0,n.extend({},t,{unset:true}))},clear:function(e){var t={};for(var r in this.attributes)t[r]=void 0;return this.set(t,n.extend({},e,{unset:true}))},hasChanged:function(e){if(e==null)return!n.isEmpty(this.changed);return n.has(this.changed,e)},changedAttributes:function(e){if(!e)return this.hasChanged()?n.clone(this.changed):false;var t,r=false;var i=this._changing?this._previousAttributes:this.attributes;for(var s in e){if(n.isEqual(i[s],t=e[s]))continue;(r||(r={}))[s]=t}return r},previous:function(e){if(e==null||!this._previousAttributes)return null;return this._previousAttributes[e]},previousAttributes:function(){return n.clone(this._previousAttributes)},fetch:function(e){e=e?n.clone(e):{};if(e.parse===void 0)e.parse=true;var t=this;var r=e.success;e.success=function(n){if(!t.set(t.parse(n,e),e))return false;if(r)r(t,n,e);t.trigger("sync",t,n,e)};I(this,e);return this.sync("read",this,e)},save:function(e,t,r){var i,s,o,u=this.attributes;if(e==null||typeof e==="object"){i=e;r=t}else{(i={})[e]=t}r=n.extend({validate:true},r);if(i&&!r.wait){if(!this.set(i,r))return false}else{if(!this._validate(i,r))return false}if(i&&r.wait){this.attributes=n.extend({},u,i)}if(r.parse===void 0)r.parse=true;var a=this;var f=r.success;r.success=function(e){a.attributes=u;var t=a.parse(e,r);if(r.wait)t=n.extend(i||{},t);if(n.isObject(t)&&!a.set(t,r)){return false}if(f)f(a,e,r);a.trigger("sync",a,e,r)};I(this,r);s=this.isNew()?"create":r.patch?"patch":"update";if(s==="patch")r.attrs=i;o=this.sync(s,this,r);if(i&&r.wait)this.attributes=u;return o},destroy:function(e){e=e?n.clone(e):{};var t=this;var r=e.success;var i=function(){t.trigger("destroy",t,t.collection,e)};e.success=function(n){if(e.wait||t.isNew())i();if(r)r(t,n,e);if(!t.isNew())t.trigger("sync",t,n,e)};if(this.isNew()){e.success();return false}I(this,e);var s=this.sync("delete",this,e);if(!e.wait)i();return s},url:function(){var e=n.result(this,"urlRoot")||n.result(this.collection,"url")||F();if(this.isNew())return e;return e.replace(/([^\/])$/,"$1/")+encodeURIComponent(this.id)},parse:function(e,t){return e},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return!this.has(this.idAttribute)},isValid:function(e){return this._validate({},n.extend(e||{},{validate:true}))},_validate:function(e,t){if(!t.validate||!this.validate)return true;e=n.extend({},this.attributes,e);var r=this.validationError=this.validate(e,t)||null;if(!r)return true;this.trigger("invalid",this,r,n.extend(t,{validationError:r}));return false}});var v=["keys","values","pairs","invert","pick","omit"];n.each(v,function(e){d.prototype[e]=function(){var t=u.call(arguments);t.unshift(this.attributes);return n[e].apply(n,t)}});var m=t.Collection=function(e,t){t||(t={});if(t.model)this.model=t.model;if(t.comparator!==void 0)this.comparator=t.comparator;this._reset();this.initialize.apply(this,arguments);if(e)this.reset(e,n.extend({silent:true},t))};var g={add:true,remove:true,merge:true};var y={add:true,remove:false};n.extend(m.prototype,f,{model:d,initialize:function(){},toJSON:function(e){return this.map(function(t){return t.toJSON(e)})},sync:function(){return t.sync.apply(this,arguments)},add:function(e,t){return this.set(e,n.extend({merge:false},t,y))},remove:function(e,t){var r=!n.isArray(e);e=r?[e]:n.clone(e);t||(t={});var i,s,o,u;for(i=0,s=e.length;i<s;i++){u=e[i]=this.get(e[i]);if(!u)continue;delete this._byId[u.id];delete this._byId[u.cid];o=this.indexOf(u);this.models.splice(o,1);this.length--;if(!t.silent){t.index=o;u.trigger("remove",u,this,t)}this._removeReference(u,t)}return r?e[0]:e},set:function(e,t){t=n.defaults({},t,g);if(t.parse)e=this.parse(e,t);var r=!n.isArray(e);e=r?e?[e]:[]:n.clone(e);var i,s,o,u,a,f,l;var c=t.at;var h=this.model;var p=this.comparator&&c==null&&t.sort!==false;var v=n.isString(this.comparator)?this.comparator:null;var m=[],y=[],b={};var w=t.add,E=t.merge,S=t.remove;var x=!p&&w&&S?[]:false;for(i=0,s=e.length;i<s;i++){a=e[i]||{};if(a instanceof d){o=u=a}else{o=a[h.prototype.idAttribute||"id"]}if(f=this.get(o)){if(S)b[f.cid]=true;if(E){a=a===u?u.attributes:a;if(t.parse)a=f.parse(a,t);f.set(a,t);if(p&&!l&&f.hasChanged(v))l=true}e[i]=f}else if(w){u=e[i]=this._prepareModel(a,t);if(!u)continue;m.push(u);this._addReference(u,t)}u=f||u;if(x&&(u.isNew()||!b[u.id]))x.push(u);b[u.id]=true}if(S){for(i=0,s=this.length;i<s;++i){if(!b[(u=this.models[i]).cid])y.push(u)}if(y.length)this.remove(y,t)}if(m.length||x&&x.length){if(p)l=true;this.length+=m.length;if(c!=null){for(i=0,s=m.length;i<s;i++){this.models.splice(c+i,0,m[i])}}else{if(x)this.models.length=0;var T=x||m;for(i=0,s=T.length;i<s;i++){this.models.push(T[i])}}}if(l)this.sort({silent:true});if(!t.silent){for(i=0,s=m.length;i<s;i++){(u=m[i]).trigger("add",u,this,t)}if(l||x&&x.length)this.trigger("sort",this,t)}return r?e[0]:e},reset:function(e,t){t||(t={});for(var r=0,i=this.models.length;r<i;r++){this._removeReference(this.models[r],t)}t.previousModels=this.models;this._reset();e=this.add(e,n.extend({silent:true},t));if(!t.silent)this.trigger("reset",this,t);return e},push:function(e,t){return this.add(e,n.extend({at:this.length},t))},pop:function(e){var t=this.at(this.length-1);this.remove(t,e);return t},unshift:function(e,t){return this.add(e,n.extend({at:0},t))},shift:function(e){var t=this.at(0);this.remove(t,e);return t},slice:function(){return u.apply(this.models,arguments)},get:function(e){if(e==null)return void 0;return this._byId[e]||this._byId[e.id]||this._byId[e.cid]},at:function(e){return this.models[e]},where:function(e,t){if(n.isEmpty(e))return t?void 0:[];return this[t?"find":"filter"](function(t){for(var n in e){if(e[n]!==t.get(n))return false}return true})},findWhere:function(e){return this.where(e,true)},sort:function(e){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");e||(e={});if(n.isString(this.comparator)||this.comparator.length===1){this.models=this.sortBy(this.comparator,this)}else{this.models.sort(n.bind(this.comparator,this))}if(!e.silent)this.trigger("sort",this,e);return this},pluck:function(e){return n.invoke(this.models,"get",e)},fetch:function(e){e=e?n.clone(e):{};if(e.parse===void 0)e.parse=true;var t=e.success;var r=this;e.success=function(n){var i=e.reset?"reset":"set";r[i](n,e);if(t)t(r,n,e);r.trigger("sync",r,n,e)};I(this,e);return this.sync("read",this,e)},create:function(e,t){t=t?n.clone(t):{};if(!(e=this._prepareModel(e,t)))return false;if(!t.wait)this.add(e,t);var r=this;var i=t.success;t.success=function(e,n){if(t.wait)r.add(e,t);if(i)i(e,n,t)};e.save(null,t);return e},parse:function(e,t){return e},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0;this.models=[];this._byId={}},_prepareModel:function(e,t){if(e instanceof d)return e;t=t?n.clone(t):{};t.collection=this;var r=new this.model(e,t);if(!r.validationError)return r;this.trigger("invalid",this,r.validationError,t);return false},_addReference:function(e,t){this._byId[e.cid]=e;if(e.id!=null)this._byId[e.id]=e;if(!e.collection)e.collection=this;e.on("all",this._onModelEvent,this)},_removeReference:function(e,t){if(this===e.collection)delete e.collection;e.off("all",this._onModelEvent,this)},_onModelEvent:function(e,t,n,r){if((e==="add"||e==="remove")&&n!==this)return;if(e==="destroy")this.remove(t,r);if(t&&e==="change:"+t.idAttribute){delete this._byId[t.previous(t.idAttribute)];if(t.id!=null)this._byId[t.id]=t}this.trigger.apply(this,arguments)}});var b=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","difference","indexOf","shuffle","lastIndexOf","isEmpty","chain","sample"];n.each(b,function(e){m.prototype[e]=function(){var t=u.call(arguments);t.unshift(this.models);return n[e].apply(n,t)}});var w=["groupBy","countBy","sortBy","indexBy"];n.each(w,function(e){m.prototype[e]=function(t,r){var i=n.isFunction(t)?t:function(e){return e.get(t)};return n[e](this.models,i,r)}});var E=t.View=function(e){this.cid=n.uniqueId("view");e||(e={});n.extend(this,n.pick(e,x));this._ensureElement();this.initialize.apply(this,arguments);this.delegateEvents()};var S=/^(\S+)\s*(.*)$/;var x=["model","collection","el","id","attributes","className","tagName","events"];n.extend(E.prototype,f,{tagName:"div",$:function(e){return this.$el.find(e)},initialize:function(){},render:function(){return this},remove:function(){this.$el.remove();this.stopListening();return this},setElement:function(e,n){if(this.$el)this.undelegateEvents();this.$el=e instanceof t.$?e:t.$(e);this.el=this.$el[0];if(n!==false)this.delegateEvents();return this},delegateEvents:function(e){if(!(e||(e=n.result(this,"events"))))return this;this.undelegateEvents();for(var t in e){var r=e[t];if(!n.isFunction(r))r=this[e[t]];if(!r)continue;var i=t.match(S);var s=i[1],o=i[2];r=n.bind(r,this);s+=".delegateEvents"+this.cid;if(o===""){this.$el.on(s,r)}else{this.$el.on(s,o,r)}}return this},undelegateEvents:function(){this.$el.off(".delegateEvents"+this.cid);return this},_ensureElement:function(){if(!this.el){var e=n.extend({},n.result(this,"attributes"));if(this.id)e.id=n.result(this,"id");if(this.className)e["class"]=n.result(this,"className");var r=t.$("<"+n.result(this,"tagName")+">").attr(e);this.setElement(r,false)}else{this.setElement(n.result(this,"el"),false)}}});t.sync=function(e,r,i){var s=N[e];n.defaults(i||(i={}),{emulateHTTP:t.emulateHTTP,emulateJSON:t.emulateJSON});var o={type:s,dataType:"json"};if(!i.url){o.url=n.result(r,"url")||F()}if(i.data==null&&r&&(e==="create"||e==="update"||e==="patch")){o.contentType="application/json";o.data=JSON.stringify(i.attrs||r.toJSON(i))}if(i.emulateJSON){o.contentType="application/x-www-form-urlencoded";o.data=o.data?{model:o.data}:{}}if(i.emulateHTTP&&(s==="PUT"||s==="DELETE"||s==="PATCH")){o.type="POST";if(i.emulateJSON)o.data._method=s;var u=i.beforeSend;i.beforeSend=function(e){e.setRequestHeader("X-HTTP-Method-Override",s);if(u)return u.apply(this,arguments)}}if(o.type!=="GET"&&!i.emulateJSON){o.processData=false}if(o.type==="PATCH"&&T){o.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")}}var a=i.xhr=t.ajax(n.extend(o,i));r.trigger("request",r,a,i);return a};var T=typeof window!=="undefined"&&!!window.ActiveXObject&&!(window.XMLHttpRequest&&(new XMLHttpRequest).dispatchEvent);var N={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};t.ajax=function(){return t.$.ajax.apply(t.$,arguments)};var C=t.Router=function(e){e||(e={});if(e.routes)this.routes=e.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var k=/\((.*?)\)/g;var L=/(\(\?)?:\w+/g;var A=/\*\w+/g;var O=/[\-{}\[\]+?.,\\\^$|#\s]/g;n.extend(C.prototype,f,{initialize:function(){},route:function(e,r,i){if(!n.isRegExp(e))e=this._routeToRegExp(e);if(n.isFunction(r)){i=r;r=""}if(!i)i=this[r];var s=this;t.history.route(e,function(n){var o=s._extractParameters(e,n);s.execute(i,o);s.trigger.apply(s,["route:"+r].concat(o));s.trigger("route",r,o);t.history.trigger("route",s,r,o)});return this},execute:function(e,t){if(e)e.apply(this,t)},navigate:function(e,n){t.history.navigate(e,n);return this},_bindRoutes:function(){if(!this.routes)return;this.routes=n.result(this,"routes");var e,t=n.keys(this.routes);while((e=t.pop())!=null){this.route(e,this.routes[e])}},_routeToRegExp:function(e){e=e.replace(O,"\\$&").replace(k,"(?:$1)?").replace(L,function(e,t){return t?e:"([^/?]+)"}).replace(A,"([^?]*?)");return new RegExp("^"+e+"(?:\\?([\\s\\S]*))?$")},_extractParameters:function(e,t){var r=e.exec(t).slice(1);return n.map(r,function(e,t){if(t===r.length-1)return e||null;return e?decodeURIComponent(e):null})}});var M=t.History=function(){this.handlers=[];n.bindAll(this,"checkUrl");if(typeof window!=="undefined"){this.location=window.location;this.history=window.history}};var _=/^[#\/]|\s+$/g;var D=/^\/+|\/+$/g;var P=/msie [\w.]+/;var H=/\/$/;var B=/#.*$/;M.started=false;n.extend(M.prototype,f,{interval:50,atRoot:function(){return this.location.pathname.replace(/[^\/]$/,"$&/")===this.root},getHash:function(e){var t=(e||this).location.href.match(/#(.*)$/);return t?t[1]:""},getFragment:function(e,t){if(e==null){if(this._hasPushState||!this._wantsHashChange||t){e=decodeURI(this.location.pathname+this.location.search);var n=this.root.replace(H,"");if(!e.indexOf(n))e=e.slice(n.length)}else{e=this.getHash()}}return e.replace(_,"")},start:function(e){if(M.started)throw new Error("Backbone.history has already been started");M.started=true;this.options=n.extend({root:"/"},this.options,e);this.root=this.options.root;this._wantsHashChange=this.options.hashChange!==false;this._wantsPushState=!!this.options.pushState;this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var r=this.getFragment();var i=document.documentMode;var s=P.exec(navigator.userAgent.toLowerCase())&&(!i||i<=7);this.root=("/"+this.root+"/").replace(D,"/");if(s&&this._wantsHashChange){var o=t.$('<iframe src="javascript:0" tabindex="-1">');this.iframe=o.hide().appendTo("body")[0].contentWindow;this.navigate(r)}if(this._hasPushState){t.$(window).on("popstate",this.checkUrl)}else if(this._wantsHashChange&&"onhashchange"in window&&!s){t.$(window).on("hashchange",this.checkUrl)}else if(this._wantsHashChange){this._checkUrlInterval=setInterval(this.checkUrl,this.interval)}this.fragment=r;var u=this.location;if(this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!this.atRoot()){this.fragment=this.getFragment(null,true);this.location.replace(this.root+"#"+this.fragment);return true}else if(this._hasPushState&&this.atRoot()&&u.hash){this.fragment=this.getHash().replace(_,"");this.history.replaceState({},document.title,this.root+this.fragment)}}if(!this.options.silent)return this.loadUrl()},stop:function(){t.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl);if(this._checkUrlInterval)clearInterval(this._checkUrlInterval);M.started=false},route:function(e,t){this.handlers.unshift({route:e,callback:t})},checkUrl:function(e){var t=this.getFragment();if(t===this.fragment&&this.iframe){t=this.getFragment(this.getHash(this.iframe))}if(t===this.fragment)return false;if(this.iframe)this.navigate(t);this.loadUrl()},loadUrl:function(e){e=this.fragment=this.getFragment(e);return n.any(this.handlers,function(t){if(t.route.test(e)){t.callback(e);return true}})},navigate:function(e,t){if(!M.started)return false;if(!t||t===true)t={trigger:!!t};var n=this.root+(e=this.getFragment(e||""));e=e.replace(B,"");if(this.fragment===e)return;this.fragment=e;if(e===""&&n!=="/")n=n.slice(0,-1);if(this._hasPushState){this.history[t.replace?"replaceState":"pushState"]({},document.title,n)}else if(this._wantsHashChange){this._updateHash(this.location,e,t.replace);if(this.iframe&&e!==this.getFragment(this.getHash(this.iframe))){if(!t.replace)this.iframe.document.open().close();this._updateHash(this.iframe.location,e,t.replace)}}else{return this.location.assign(n)}if(t.trigger)return this.loadUrl(e)},_updateHash:function(e,t,n){if(n){var r=e.href.replace(/(javascript:|#).*$/,"");e.replace(r+"#"+t)}else{e.hash="#"+t}}});t.history=new M;var j=function(e,t){var r=this;var i;if(e&&n.has(e,"constructor")){i=e.constructor}else{i=function(){return r.apply(this,arguments)}}n.extend(i,r,t);var s=function(){this.constructor=i};s.prototype=r.prototype;i.prototype=new s;if(e)n.extend(i.prototype,e);i.__super__=r.prototype;return i};d.extend=m.extend=C.extend=E.extend=M.extend=j;var F=function(){throw new Error('A "url" property or function must be specified')};var I=function(e,t){var n=t.error;t.error=function(r){if(n)n(e,r,t);e.trigger("error",e,r,t)}};return t})