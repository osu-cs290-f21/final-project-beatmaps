(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['event_details'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\"event-section\">\r\n    <div class=\"selected-event\">\r\n        <div id=\"artist-icon\">\r\n            <img src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"artist_picture") || (depth0 != null ? lookupProperty(depth0,"artist_picture") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"artist_picture","hash":{},"data":data,"loc":{"start":{"line":4,"column":22},"end":{"line":4,"column":40}}}) : helper)))
    + "\">\r\n        </div>\r\n        <h1 id=\"artist-name\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"artist") || (depth0 != null ? lookupProperty(depth0,"artist") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"artist","hash":{},"data":data,"loc":{"start":{"line":6,"column":29},"end":{"line":6,"column":39}}}) : helper)))
    + "</h1>\r\n        <div id=\"location-date\">\r\n            <h3 id=\"concert-location\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"location") || (depth0 != null ? lookupProperty(depth0,"location") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"location","hash":{},"data":data,"loc":{"start":{"line":8,"column":38},"end":{"line":8,"column":50}}}) : helper)))
    + "</h3>\r\n            <h3 id=\"concert-date\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"duration") || (depth0 != null ? lookupProperty(depth0,"duration") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"duration","hash":{},"data":data,"loc":{"start":{"line":9,"column":34},"end":{"line":9,"column":46}}}) : helper)))
    + "</h3>\r\n        </div>\r\n        <p id=\"concert-description\">A super cool event featuring one of your top 50 artists on Spotify! Click below to\r\n        buy tickets :-)</p>\r\n        <div class=\"search-btn\">\r\n            <a href=\"find-event.html\">\r\n                <button>TICKETS</button>\r\n            </a>\r\n        </div>\r\n    </div>\r\n</div>\r\n";
},"useData":true});
})();