import { data, otherData } from './data.js';

console.log(data)
console.log(otherData)

console.log("Sep 7, 2023");
var aolrcMarkers = []
var accoMarkers = []
var otherMarkers = []
var markerMap;
var MAP_CENTER = [36.222206,-81.646708]

function initMap() {    
  const dc = new google.maps.LatLng(MAP_CENTER[0], MAP_CENTER[1]);
  markerMap = new google.maps.Map(document.getElementById("map"), {
    center: dc,
    zoom: 8,
  });

  const iconBaseOld = "https://developers.google.com/maps/documentation/javascript/examples/full/images/";
  const iconBase = "https://ssinghjah.github.io/images/"

  const icons = {
	aolrc: iconBase + "parking.png",
	other: iconBase + "metro.png"
    }

  const iconsOld = {
    parking: iconBase + "parking_lot_maps.png",
    library: iconBase + "library_maps.png",
    info: iconBase + "info-i_maps.png"
  };

   let path = window.location.hostname.replace(/\//g,''); // Remove all slashes from string

    console.log(data);
    // addMapMarkers(data, icons, markerMap);

    for (var i=0; i < data.values.length; i++)
    {
        addMarker(data.headers, data.values[i], icons.aolrc, "aolrc");
    }

    for (var i=0; i < otheroData.values.length; i++)
    {
        addMarker(otherData.headers, otherData.values[i], icons.other, "other");
    }
}

var ToDisplay = ["Name", "Address", "Cost", "Distance to the Mall", "Nearest Exit from VA", "Nearest Exit from MD", "Website", "Navigate_URL"];
var HyperLinks = ["Navigate_URL", "Website"];

function displayNationalMall(mallIcon){
    var lat = Number(infoValues[latIndex]);
    var lng = Number(infoValues[lngIndex]);
    var markerPosition = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
    position: markerPosition,
    icon: mallIcon,
    map: markerMap});
}


function addAOLRCMarkerInfo(infoHeaders, infoValues){
    var infoHTML = "<div class='markerPopUp'>";
    var numHeaders = infoHeaders.length;

    var nameIndex = $.inArray("Name", infoHeaders);
    infoHTML += "<strong>" + infoValues[nameIndex] + "</strong><br>"

    var addressIndex = $.inArray("Address", infoHeaders);
    infoHTML += infoValues[addressIndex] + "<br>"

    var websiteIndex = $.inArray("Website", infoHeaders);
    infoHTML += '<strong><a href="'+ infoValues[websiteIndex] + '" target="_blank">Website</a></strong>'+ "<br>"

    var navIndex = $.inArray("Navigate_URL", infoHeaders);
    infoHTML += '<strong><a href = "' + infoValues[navIndex] + '" target="_blank">Navigate</a></strong><br><br>'

    return infoHTML
}

function addOtherMarkerInfo(infoHeaders, infoValues){
    var infoHTML = "<div class='markerPopUp'>";
    var numHeaders = infoHeaders.length;

    var nameIndex = $.inArray("Name", infoHeaders);
    infoHTML += "<strong>" + infoValues[nameIndex] + "</strong><br>"

    var lineIndex = $.inArray("Line", infoHeaders);
    infoHTML += "Lines:&nbsp;" + infoValues[lineIndex] + "<br>"

    var navIndex = $.inArray("Navigate_URL", infoHeaders);
    infoHTML += '<strong><a href = "' + infoValues[navIndex] + '" target="_blank">Navigate</a></strong><br><br>'

    return infoHTML
}


function addMarker(infoHeaders, infoValues, layerIcon, markerType){
    var uiListID = ""
    var markerList = []
    var infoHTML = ""
    if (markerType == "aolrc")
    {
        uiListID = "aolrcList"
        markerList = aolrcMarkers
        infoHTML += addAOLRCMarkerInfo(infoHeaders, infoValues)
    }
    else if(markerType == "other")
    {
        uiListID = "otherList"
        markerList = otherMarkers
        infoHTML += addOtherMarkerInfo(infoHeaders, infoValues)
    }
    else{
	console.log("Error: invalid marker type.")
	return;
    }

    var latIndex = infoHeaders.indexOf("Lat");
    var lngIndex = infoHeaders.indexOf("Lng");

    var lat = Number(infoValues[latIndex]);
    var lng = Number(infoValues[lngIndex]);

    var markerPosition = new google.maps.LatLng(lat, lng);

    var marker = new google.maps.Marker({
    position: markerPosition,
    icon: layerIcon,
    map: markerMap});

    var coordInfoWindow = new google.maps.InfoWindow({pixelOffset: new google.maps.Size(0, -25)});
    coordInfoWindow.setContent(infoHTML);
    coordInfoWindow.setPosition(markerPosition);
    markerList.push(marker);
    marker.addListener("click", () => {
            coordInfoWindow.open({anchor: marker, map});
      });

     $("#" + uiListID).append(infoHTML + "<br>");
}

function makeInfoWindowEvent(map, infowindow, marker) {
  google.maps.event.addListener(marker, 'click', function() {
       infowindow.open(map, marker);
  });
}

const TILE_SIZE = 256;

// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng) {
  let siny = Math.sin((latLng.lat() * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);
  return new google.maps.Point(
    TILE_SIZE * (0.5 + latLng.lng() / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  );
}

function toggleView(elem){
    var current_state = $(elem).data("state");
    if (current_state == "map")
    {
        $(elem).data("state", "list");
        $(elem).text("Hide List");
        $("#list").removeClass("medium-0");
	    $("#list").addClass("medium-3");
	    $("#map").removeClass("medium-12");
	    $("#map").addClass("medium-9");
	    $("#list").show();
    }
    else if(current_state == "list")
    {
        $(elem).data("state", "map");
        $(elem).text("View List");
	$("#list").removeClass("medium-3");	
	$("#list").addClass("medium-0");
	$("#list").hide();
	$("#map").removeClass("medium-9");
	$("#map").addClass("medium-12");
    }
}

function toggleMarkerVisibility(allMarkers, markerMap, state){
    var numMarkers = allMarkers.length;
    for(var i=0; i < numMarkers; i++)
    {
        if(state == "on")
        {
            allMarkers[i].setMap(markerMap);
        }
        else if(state == "off")
        {
            allMarkers[i].setMap(null);
        }
    }
}

function toggleLayer(id){
    var current_state = $("#" + id).data("state");
        if (current_state == "on")
        {
            $("#" + id).data("state", "off");
            $("#" + id).addClass("primary");
            $("#" + id).removeClass("secondary");
        }
        else if(current_state == "off")
        {
            $("#" + id).data("state", "on");
            $("#" + id).addClass("secondary");
            $("#" + id).removeClass("primary");
        }
}

window.initMap = initMap;
$(function()
{
    $("#mapContainer").hide();
    $("#guidelinesContainer").show();
    $("#volunteerLinksContainer").hide();
    $("#resourcesContainer").hide();
    $("#mapMarkersToggle").hide()

    $("#viewToggle").data("state", "list");
    $("#aolrcToggle").data("state", "on");
    $("#aolrcToggle").addClass("primary");
    $("#accoToggle").data("state", "on");
    $("#accoToggle").addClass("primary");

    $("#mapToggle").click(function()
    {
        $("#guidelinesContainer").hide();
        $("#resourcesContainer").hide();
        $("#mapContainer").show();
        $("#volunteerLinksContainer").hide();
        $("#mapMarkersToggle").show()
    });

    $("#advisoryToggle").click(function(){
        $("#guidelinesContainer").show();
        $("#resourcesContainer").hide();
        $("#mapContainer").hide();
        $("#volunteerLinksContainer").hide();
        $("#mapMarkersToggle").hide()
    });

    $("#resourcesToggle").click(function(){
        $("#guidelinesContainer").hide();
        $("#resourcesContainer").show();
        $("#mapContainer").hide();
        $("#volunteerLinksContainer").hide();
        $("#mapMarkersToggle").hide()

    });

    $("#volunteerLinksToggle").click(function(){
        $("#guidelinesContainer").hide();
        $("#resourcesContainer").hide();
        $("#mapContainer").hide();
        $("#volunteerLinksContainer").show();
        $("#mapMarkersToggle").hide()

    });
    
    $("#viewToggle").click(function(){
	    toggleView(this);})

    $("#aolrcToggle").click(function(){
       toggleLayer("aolrcToggle");
       toggleMarkerVisibility(aolrcMarkers, markerMap, $(this).data("state"));
	});

	$("#accoToggle").click(function(){
       toggleLayer("accoToggle");
       toggleMarkerVisibility(accoMarkers, markerMap, $(this).data("state"));
	});
});

$(document).ready(function() {
            $(document).foundation();
})
