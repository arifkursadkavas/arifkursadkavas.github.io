(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{6363:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/app",function(){return n(7766)}])},8418:function(e,t,n){"use strict";function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,a=[],i=!0,c=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(a.push(r.value),!t||a.length!==t);i=!0);}catch(u){c=!0,o=u}finally{try{i||null==n.return||n.return()}finally{if(c)throw o}}return a}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return r(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}t.default=void 0;var a,i=(a=n(7294))&&a.__esModule?a:{default:a},c=n(6273),u=n(387),l=n(7190);var f={};function s(e,t,n,r){if(e&&c.isLocalURL(t)){e.prefetch(t,n,r).catch((function(e){0}));var o=r&&"undefined"!==typeof r.locale?r.locale:e&&e.locale;f[t+"%"+n+(o?"%"+o:"")]=!0}}var p=function(e){var t,n=!1!==e.prefetch,r=u.useRouter(),a=i.default.useMemo((function(){var t=o(c.resolveHref(r,e.href,!0),2),n=t[0],a=t[1];return{href:n,as:e.as?c.resolveHref(r,e.as):a||n}}),[r,e.href,e.as]),p=a.href,d=a.as,y=e.children,g=e.replace,b=e.shallow,v=e.scroll,m=e.locale;"string"===typeof y&&(y=i.default.createElement("a",null,y));var h=(t=i.default.Children.only(y))&&"object"===typeof t&&t.ref,O=o(l.useIntersection({rootMargin:"200px"}),2),w=O[0],j=O[1],k=i.default.useCallback((function(e){w(e),h&&("function"===typeof h?h(e):"object"===typeof h&&(h.current=e))}),[h,w]);i.default.useEffect((function(){var e=j&&n&&c.isLocalURL(p),t="undefined"!==typeof m?m:r&&r.locale,o=f[p+"%"+d+(t?"%"+t:"")];e&&!o&&s(r,p,d,{locale:t})}),[d,p,j,m,n,r]);var A={ref:k,onClick:function(e){t.props&&"function"===typeof t.props.onClick&&t.props.onClick(e),e.defaultPrevented||function(e,t,n,r,o,a,i,u){("A"!==e.currentTarget.nodeName.toUpperCase()||!function(e){var t=e.currentTarget.target;return t&&"_self"!==t||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)&&c.isLocalURL(n))&&(e.preventDefault(),t[o?"replace":"push"](n,r,{shallow:a,locale:u,scroll:i}))}(e,r,p,d,g,b,v,m)},onMouseEnter:function(e){t.props&&"function"===typeof t.props.onMouseEnter&&t.props.onMouseEnter(e),c.isLocalURL(p)&&s(r,p,d,{priority:!0})}};if(e.passHref||"a"===t.type&&!("href"in t.props)){var E="undefined"!==typeof m?m:r&&r.locale,S=r&&r.isLocaleDomain&&c.getDomainLocale(d,E,r&&r.locales,r&&r.domainLocales);A.href=S||c.addBasePath(c.addLocale(d,E,r&&r.defaultLocale))}return i.default.cloneElement(t,A)};t.default=p},7190:function(e,t,n){"use strict";function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,a=[],i=!0,c=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(a.push(r.value),!t||a.length!==t);i=!0);}catch(u){c=!0,o=u}finally{try{i||null==n.return||n.return()}finally{if(c)throw o}}return a}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return r(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}Object.defineProperty(t,"__esModule",{value:!0}),t.useIntersection=function(e){var t=e.rootRef,n=e.rootMargin,r=e.disabled||!c,f=a.useRef(),s=o(a.useState(!1),2),p=s[0],d=s[1],y=o(a.useState(t?t.current:null),2),g=y[0],b=y[1],v=a.useCallback((function(e){f.current&&(f.current(),f.current=void 0),r||p||e&&e.tagName&&(f.current=function(e,t,n){var r=function(e){var t,n={root:e.root||null,margin:e.rootMargin||""},r=l.find((function(e){return e.root===n.root&&e.margin===n.margin}));r?t=u.get(r):(t=u.get(n),l.push(n));if(t)return t;var o=new Map,a=new IntersectionObserver((function(e){e.forEach((function(e){var t=o.get(e.target),n=e.isIntersecting||e.intersectionRatio>0;t&&n&&t(n)}))}),e);return u.set(n,t={id:n,observer:a,elements:o}),t}(n),o=r.id,a=r.observer,i=r.elements;return i.set(e,t),a.observe(e),function(){if(i.delete(e),a.unobserve(e),0===i.size){a.disconnect(),u.delete(o);var t=l.findIndex((function(e){return e.root===o.root&&e.margin===o.margin}));t>-1&&l.splice(t,1)}}}(e,(function(e){return e&&d(e)}),{root:g,rootMargin:n}))}),[r,g,n,p]);return a.useEffect((function(){if(!c&&!p){var e=i.requestIdleCallback((function(){return d(!0)}));return function(){return i.cancelIdleCallback(e)}}}),[p]),a.useEffect((function(){t&&b(t.current)}),[t]),[v,p]};var a=n(7294),i=n(9311),c="undefined"!==typeof IntersectionObserver;var u=new Map,l=[]},7766:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return me}});var r={};n.r(r),n.d(r,{addTrackers:function(){return B},default:function(){return ie},event:function(){return te},exception:function(){return ne},ga:function(){return X},initialize:function(){return V},modalview:function(){return Y},outboundLink:function(){return oe},pageview:function(){return W},plugin:function(){return re},send:function(){return Q},set:function(){return Z},testModeAPI:function(){return ae},timing:function(){return ee}});var o=n(5893),a=n(7294),i=n(5697),c=n.n(i);function u(e){console.warn("[react-ga]",e)}function l(e){return l="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l(e)}function f(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?f(Object(n),!0).forEach((function(t){O(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}function d(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function y(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function g(e,t){return g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},g(e,t)}function b(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=h(e);if(t){var o=h(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return v(this,n)}}function v(e,t){return!t||"object"!==l(t)&&"function"!==typeof t?m(e):t}function m(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function h(e){return h=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},h(e)}function O(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var w="_blank",j=function(e){!function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(i,e);var t,n,r,o=b(i);function i(){var e;d(this,i);for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return O(m(e=o.call.apply(o,[this].concat(n))),"handleClick",(function(t){var n=e.props,r=n.target,o=n.eventLabel,a=n.to,c=n.onClick,u=n.trackerNames,l={label:o},f=r!==w,s=!(t.ctrlKey||t.shiftKey||t.metaKey||1===t.button);f&&s?(t.preventDefault(),i.trackLink(l,(function(){window.location.href=a}),u)):i.trackLink(l,(function(){}),u),c&&c(t)})),e}return t=i,(n=[{key:"render",value:function(){var e=this.props,t=e.to,n=e.target,r=s(s({},p(e,["to","target"])),{},{target:n,href:t,onClick:this.handleClick});return n===w&&(r.rel="".concat(r.rel?r.rel:""," noopener noreferrer").trim()),delete r.eventLabel,delete r.trackerNames,a.createElement("a",r)}}])&&y(t.prototype,n),r&&y(t,r),i}(a.Component);O(j,"trackLink",(function(){u("ga tracking not enabled")})),j.propTypes={eventLabel:c().string.isRequired,target:c().string,to:c().string,onClick:c().func,trackerNames:c().arrayOf(c().string)},j.defaultProps={target:null,to:null,onClick:null,trackerNames:null};function k(e){return"string"===typeof(t=e)&&-1!==t.indexOf("@")?(u("This arg looks like an email address, redacting."),"REDACTED (Potential Email Address)"):e;var t}function A(e){return e&&e.toString().replace(/^\s+|\s+$/g,"")}var E=/^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;function S(e){return A(e).replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g,(function(e,t,n){return t>0&&t+e.length!==n.length&&e.search(E)>-1&&":"!==n.charAt(t-2)&&("-"!==n.charAt(t+e.length)||"-"===n.charAt(t-1))&&n.charAt(t-1).search(/[^\s-]/)<0?e.toLowerCase():e.substr(1).search(/[A-Z]|\../)>-1?e:e.charAt(0).toUpperCase()+e.substr(1)}))}var P=!1;function x(e){console.info("[react-ga]",e)}var C=[],N={calls:C,ga:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];C.push([].concat(t))},resetCalls:function(){C.length=0}};function I(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}function L(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function D(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function T(e){return T="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},T(e)}function _(e){return function(e){if(Array.isArray(e))return q(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"===typeof e)return q(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return q(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function q(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var M="undefined"===typeof window||"undefined"===typeof document,R=!1,U=!0,K=!1,z=!0,H=!0,J=function(){var e;return K?N.ga.apply(N,arguments):!M&&(window.ga?(e=window).ga.apply(e,arguments):u("ReactGA.initialize must be called first or GoogleAnalytics should be loaded manually"))};function $(e){return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],n=e||"";return(arguments.length>1?arguments[1]:void 0)&&(n=S(e)),t&&(n=k(n)),n}(e,U,H)}function F(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];var o=n[0];"string"===typeof o?(!z&&Array.isArray(e)||J.apply(void 0,n),Array.isArray(e)&&e.forEach((function(e){J.apply(void 0,_(["".concat(e,".").concat(o)].concat(n.slice(1))))}))):u("ga command must be a string")}function G(e,t){e?t&&(t.debug&&!0===t.debug&&(R=!0),!1===t.titleCase&&(U=!1),!1===t.redactEmail&&(H=!1),t.useExistingGa)||(t&&t.gaOptions?J("create",e,t.gaOptions):J("create",e,"auto")):u("gaTrackingID is required in initialize()")}function B(e,t){return Array.isArray(e)?e.forEach((function(e){"object"===T(e)?G(e.trackingId,e):u("All configs must be an object")})):G(e,t),!0}function V(e,t){if(t&&!0===t.testMode)K=!0;else{if(M)return;t&&!0===t.standardImplementation||function(e){if(!P){P=!0;var t="https://www.google-analytics.com/analytics.js";e&&e.gaAddress?t=e.gaAddress:e&&e.debug&&(t="https://www.google-analytics.com/analytics_debug.js");var n,r,o,a,i,c,u,l=e&&e.onerror;n=window,r=document,o="script",a=t,i="ga",n.GoogleAnalyticsObject=i,n.ga=n.ga||function(){(n.ga.q=n.ga.q||[]).push(arguments)},n.ga.l=1*new Date,c=r.createElement(o),u=r.getElementsByTagName(o)[0],c.async=1,c.src=a,c.onerror=l,u.parentNode.insertBefore(c,u)}}(t)}z=!t||"boolean"!==typeof t.alwaysSendToDefaultTracker||t.alwaysSendToDefaultTracker,B(e,t)}function X(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.length>0&&(J.apply(void 0,t),R&&(x("called ga('arguments');"),x("with arguments: ".concat(JSON.stringify(t))))),window.ga}function Z(e,t){e?"object"===T(e)?(0===Object.keys(e).length&&u("empty `fieldsObject` given to .set()"),F(t,"set",e),R&&(x("called ga('set', fieldsObject);"),x("with fieldsObject: ".concat(JSON.stringify(e))))):u("Expected `fieldsObject` arg to be an Object"):u("`fieldsObject` is required in .set()")}function Q(e,t){F(t,"send",e),R&&(x("called ga('send', fieldObject);"),x("with fieldObject: ".concat(JSON.stringify(e))),x("with trackers: ".concat(JSON.stringify(t))))}function W(e,t,n){if(e){var r=A(e);if(""!==r){var o={};if(n&&(o.title=n),F(t,"send",function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?L(Object(n),!0).forEach((function(t){D(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):L(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({hitType:"pageview",page:r},o)),R){x("called ga('send', 'pageview', path);");var a="";n&&(a=" and title: ".concat(n)),x("with path: ".concat(r).concat(a))}}else u("path cannot be an empty string in .pageview()")}else u("path is required in .pageview()")}function Y(e,t){if(e){var n,r="/"===(n=A(e)).substring(0,1)?n.substring(1):n;if(""!==r){var o="/modal/".concat(r);F(t,"send","pageview",o),R&&(x("called ga('send', 'pageview', path);"),x("with path: ".concat(o)))}else u("modalName cannot be an empty string or a single / in .modalview()")}else u("modalName is required in .modalview(modalName)")}function ee(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.category,n=e.variable,r=e.value,o=e.label,a=arguments.length>1?arguments[1]:void 0;if(t&&n&&"number"===typeof r){var i={hitType:"timing",timingCategory:$(t),timingVar:$(n),timingValue:r};o&&(i.timingLabel=$(o)),Q(i,a)}else u("args.category, args.variable AND args.value are required in timing() AND args.value has to be a number")}function te(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.category,n=e.action,r=e.label,o=e.value,a=e.nonInteraction,i=e.transport,c=I(e,["category","action","label","value","nonInteraction","transport"]),l=arguments.length>1?arguments[1]:void 0;if(t&&n){var f={hitType:"event",eventCategory:$(t),eventAction:$(n)};r&&(f.eventLabel=$(r)),"undefined"!==typeof o&&("number"!==typeof o?u("Expected `args.value` arg to be a Number."):f.eventValue=o),"undefined"!==typeof a&&("boolean"!==typeof a?u("`args.nonInteraction` must be a boolean."):f.nonInteraction=a),"undefined"!==typeof i&&("string"!==typeof i?u("`args.transport` must be a string."):(-1===["beacon","xhr","image"].indexOf(i)&&u("`args.transport` must be either one of these values: `beacon`, `xhr` or `image`"),f.transport=i)),Object.keys(c).filter((function(e){return"dimension"===e.substr(0,"dimension".length)})).forEach((function(e){f[e]=c[e]})),Object.keys(c).filter((function(e){return"metric"===e.substr(0,"metric".length)})).forEach((function(e){f[e]=c[e]})),Q(f,l)}else u("args.category AND args.action are required in event()")}function ne(e,t){var n=e.description,r=e.fatal,o={hitType:"exception"};n&&(o.exDescription=$(n)),"undefined"!==typeof r&&("boolean"!==typeof r?u("`args.fatal` must be a boolean."):o.exFatal=r),Q(o,t)}var re={require:function(e,t,n){if(e){var r=A(e);if(""!==r){var o=n?"".concat(n,".require"):"require";if(t){if("object"!==T(t))return void u("Expected `options` arg to be an Object");0===Object.keys(t).length&&u("Empty `options` given to .require()"),X(o,r,t),R&&x("called ga('require', '".concat(r,"', ").concat(JSON.stringify(t)))}else X(o,r),R&&x("called ga('require', '".concat(r,"');"))}else u("`name` cannot be an empty string in .require()")}else u("`name` is required in .require()")},execute:function(e,t){for(var n,r,o=arguments.length,a=new Array(o>2?o-2:0),i=2;i<o;i++)a[i-2]=arguments[i];if(1===a.length?n=a[0]:(r=a[0],n=a[1]),"string"!==typeof e)u("Expected `pluginName` arg to be a String.");else if("string"!==typeof t)u("Expected `action` arg to be a String.");else{var c="".concat(e,":").concat(t);n=n||null,r&&n?(X(c,r,n),R&&(x("called ga('".concat(c,"');")),x('actionType: "'.concat(r,'" with payload: ').concat(JSON.stringify(n))))):n?(X(c,n),R&&(x("called ga('".concat(c,"');")),x("with payload: ".concat(JSON.stringify(n))))):(X(c),R&&x("called ga('".concat(c,"');")))}}};function oe(e,t,n){if("function"===typeof t)if(e&&e.label){var r={hitType:"event",eventCategory:"Outbound",eventAction:"Click",eventLabel:$(e.label)},o=!1,a=setTimeout((function(){o=!0,t()}),250);r.hitCallback=function(){clearTimeout(a),o||t()},Q(r,n)}else u("args.label is required in outboundLink()");else u("hitCallback function is required")}var ae=N,ie={initialize:V,ga:X,set:Z,send:Q,pageview:W,modalview:Y,timing:ee,event:te,exception:ne,plugin:re,outboundLink:oe,testModeAPI:N};function ce(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function ue(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ce(Object(n),!0).forEach((function(t){le(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ce(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function le(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}j.origTrackLink=j.trackLink,j.trackLink=oe;var fe=j,se=ue(ue({},r),{},{OutboundLink:fe}),pe=n(387);n(4831);function de(e){var t=e.children;return(0,o.jsx)("div",{className:"mLayout",children:t})}var ye=n(1664);function ge(e){return(0,o.jsxs)("div",{className:"mHeader",children:[(0,o.jsx)(ye.default,{href:"/",children:(0,o.jsx)("a",{children:(0,o.jsx)("img",{className:"mProfilePhoto",src:"./arif.jpg"})})}),(0,o.jsx)("div",{className:"mNameContainer",children:(0,o.jsx)(ye.default,{href:"/",children:(0,o.jsx)("a",{children:"Arif K\xfcrsad Kavas"})})}),(0,o.jsxs)("div",{className:"mHeaderItemContainer",children:[(0,o.jsx)(ye.default,{href:"/experience",children:(0,o.jsx)("a",{children:(0,o.jsx)("div",{className:"mHeaderItem",children:"Experience"})})},"Experience"),(0,o.jsx)(ye.default,{href:"/education",children:(0,o.jsx)("a",{children:(0,o.jsx)("div",{className:"mHeaderItem",children:"Education"})})},"Education")]})]})}function be(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function ve(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){be(e,t,n[t])}))}return e}var me=function(e){var t=e.Component,n=e.pageProps;return(0,a.useEffect)((function(){se.initialize("UA-108070842-2"),se.set({page:"index.html"}),se.pageview("index.html"),pe.Router.events.on("routeChangeStart",(function(e){return se.set({page:e}),se.pageview(e),console.log(e),!0}))})),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(ge,{}),(0,o.jsx)(de,{children:(0,o.jsx)(t,ve({},n))})]})}},4831:function(){},1664:function(e,t,n){e.exports=n(8418)}},function(e){var t=function(t){return e(e.s=t)};e.O(0,[774,179],(function(){return t(6363),t(387)}));var n=e.O();_N_E=n}]);