import { data, metroData } from './data.js';

console.log(data)
console.log(metroData)

console.log("Sep 7, 2023");
var parkingMarkers = []
var accoMarkers = []
var metroMarkers = []
var markerMap;

function initMap() {    
  const dc = new google.maps.LatLng(38.906624, -77.065774);
  markerMap = new google.maps.Map(document.getElementById("map"), {
    center: dc,
    zoom: 15,
  });

  const iconBaseOld = "https://developers.google.com/maps/documentation/javascript/examples/full/images/";
  const iconBase = "https://ssinghjah.github.io/images/"

  const icons = {
	parking: iconBase + "parking.png",
	metro: iconBase + "metro.png"
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
        addMarker(data.headers, data.values[i], icons.parking, markerMap, "parking");
    }

    for (var i=0; i < metroData.values.length; i++)
    {
        addMarker(metroData.headers, metroData.values[i], icons.metro, "metro");
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


function addParkingMarkerInfo(infoHeaders, infoValues){
    var infoHTML = "<div class='markerPopUp'>";
    var numHeaders = infoHeaders.length;

    var nameIndex = $.inArray("Name", infoHeaders);
    infoHTML += infoValues[nameIndex] + "<br>"

    var addressIndex = $.inArray("Address", infoHeaders);
    infoHTML += infoValues[addressIndex] + "<br>"

    var navIndex = $.inArray("Navigate_URL", infoHeaders);
    infoHTML += '<strong><a href = "' + infoValues[navIndex] + '" target="_blank">Navigate</a></strong>'

    return infoHTML
}

function addMetroMarkerInfo(){
    var infoHTML = "<div class='markerPopUp'>";
    var numHeaders = infoHeaders.length;

    nameIndex = $.inArray("Name", infoHeaders);
    infoHTML += infoValues[nameIndex] + "<br>"

    addressIndex = $.inArray("Address", infoHeaders);
    infoHTML += infoValues[addressIndex] + "<br>"

    addressIndex = $.inArray("Navigate_URL", infoHeaders);
    infoHTML += '<strong><a href = "' + info + '" target="_blank">Navigate</a></strong>'

    return infoHTML
}


function addMarker(infoHeaders, infoValues, layerIcon, markerMap, markerType, uiListID){
    var uiListID = ""
    var markerList = []
    if (markerType == "parking")
    {
        uiListID = "parkingList"
        markerList = parkingList
        infoHTML += addParkingMarkerInfo(infoHeaders, infoValues)
    }
    else if(markerType == "metro")
    {
        uiListID = "metroList"
        markerList = metroList
        infoHTML += addMetroMarkerInfo(infoHeaders, infoValues)
    }

    var latIndex = infoHeaders.indexOf("Lat");
    var lngIndex = infoHeaders.indexOf("Lng");

    var lat = Number(infoValues[latIndex]);
    var lng = Number(infoValues[lngIndex]);

    var markerPosition = new google.maps.LatLng(lat, lng);
    
    var infoHTML = "<div class='markerPopUp'>";
    var numHeaders = infoHeaders.length;

    for (var i = 0; i < ToDisplay.length; i++)
    {
        var header = ToDisplay[i];
        var headerIndex = $.inArray(header, infoHeaders);
        if (headerIndex !== -1)
        {
            var info = infoValues[headerIndex];
            if($.inArray(header, HyperLinks) !== -1)
            {
                infoHTML += '<strong><a href = "' + info + '" target="_blank"> ' + header + ' </a></strong><br>';
            }
            else
            {
                infoHTML += '<strong>' + header + '</strong>: ' + info + '<br> ';
            }
        }
    }
    var marker = new google.maps.Marker({
    position: markerPosition,
    icon: layerIcon,
    map: markerMap});

    var coordInfoWindow = new google.maps.InfoWindow({pixelOffset: new google.maps.Size(0, -25)});
    coordInfoWindow.setContent(infoHTML);
    coordInfoWindow.setPosition(markerPosition);
    markerList.append(marker);
    marker.addListener("click", () => {
            coordInfoWindow.open({anchor: marker, map});
      });

     $("#" + uiListID).append(infoHTML + "<br>");
}

function addMarkerV1(markerFeature, markerIcon, markerMap){
     var marker = new google.maps.Marker({
      position: markerFeature.position,
      icon: markerIcon,
      map: markerMap,});

      var coordInfoWindow = new google.maps.InfoWindow({pixelOffset: new google.maps.Size(0, -25)});
      coordInfoWindow.setContent(markerFeature.infoWindow);
      coordInfoWindow.setPosition(markerFeature.position);
      marker.addListener("click", () =>
      {
            coordInfoWindow.open({anchor: marker, map});
      });
}

function makeInfoWindowEvent(map, infowindow, marker) {
  google.maps.event.addListener(marker, 'click', function() {
       infowindow.open(map, marker);
  });
}

const TILE_SIZE = 256;

function createInfoWindowContent(latLng, zoom) {
  return [
    "PMI Parking",
    "Spots remaining: " + zoom,
    "Cost per day: " + zoom,
  ].join("<br>");
}

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
        //$("#map").hide();
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
	$("#viewToggle").data("state", "list");
	$("#parkingToggle").data("state", "on");
	$("#parkingToggle").addClass("secondary");
	$("#accoToggle").data("state", "on");
	$("#accoToggle").addClass("secondary");

	$("#viewToggle").click(function(){
	    toggleView(this);})

    $("#parkingToggle").click(function(){
       toggleLayer("parkingToggle");
       toggleMarkerVisibility(parkingMarkers, markerMap, $(this).data("state"));
	});

	$("#accoToggle").click(function(){
       toggleLayer("accoToggle");
       toggleMarkerVisibility(accoMarkers, markerMap, $(this).data("state"));
	});
});

$(document).ready(function() {
            $(document).foundation();
})
