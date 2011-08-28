/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
enyo.kind({
	name: "CanonFancySliding",
	kind: "Pane", components : [
    {flex:1, name: "mapView", kind: "Control", className: "mapCanvas"} //,
    //{ name: "mapRoute", kind: "Control"}
    ],
    rendered: function () {

   // this.$.mapRoute.setContent("test");

   this.inherited(arguments);
   var mapCanvas = this.$.mapView.hasNode();
   this.key = "ArDMmsAyYs-CHmSVgoWa0jQw754frWj4rWudsff7rm_T6rTafE_mSSuvmLr881DZ";
   //this.mapCenter = "Chicago, IL";
    map = new Microsoft.Maps.Map(mapCanvas, {credentials: this.key,
                                      //center: this.mapCenter,
                                      mapTypeId: Microsoft.Maps.MapTypeId.road,
                                      showDashboard: true,
                                      //zoom: this.mapZoom,
                                      disableKeyboardInput: false,
                                      enableClickableLogo: false,
                                      enableSearchLogo: false //,
                                      //showScalebar: true
                                     });

///this.map.setView({zoom: 12, center: new Microsoft.Maps.Location(47.609771, -122.2321543125)});
///var pushpinOptions = {icon: virtualPath + '/Content/poi_custom.png', text : '1', visible: true, textOffset: offset}; 
    map.entities.clear(); 
    var offset = new Microsoft.Maps.Point(0, 5); 



//var pushpin= new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(pinlocationslat[0], pinlocationslng[0]), null); 
//map.setView( {center: new Microsoft.Maps.Location(pinlocationslat[0], pinlocationslng[0]), zoom: 10}); 
//map.entities.push(pushpin); 

///alert(test);
}
	//url: "http://maps.google.com/maps/api/js?sensor=false&language=ja"
});