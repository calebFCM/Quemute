/*$(document).ready(function(){
	await accessLocation();
	loadRoutesNearby();
})*/
/*console.log("Hallo")*/

//accessLocation();
//loadRoutesNearby();

$('.close').click(function(event){
	event.preventDefault();
	navigator.geolocation.clearWatch(watcherId)
	var userType = user.user_type;
	socket.emit("leaveroute", currentRoute, user);
	for(var index in markers){
		markers[index].setMap(null);
	}

	for(var i = 0; i < routeMarkers.length; i++){
		routeMarkers[i].setMap(null);
	}
	
	$('#mapcont').hide();
});

$('.close_popup').click(function(event){
	event.preventDefault();

	$('.lightbox-shadow').hide();
})

$('#wrap').on('blur', '.search', function(event){
	
	$('.enter').show();
	
});

$('.enter').click(function(event){
	var fieldsIncomplete = false;
	$('.inp').each(function(index, value){
		var address = $(this).val();
		if(address == ""){
			event.preventDefault();

			$(this).css("border", "1px solid #FF0000");
			$(this).focus();
			fieldsInomplete = true;
			return false;
		}
	})

	if(fieldsInomplete){
		return;
	}
});

var user_location = {
	lat: 0.0,
	lng: 0.0,
	locSet: false,
	setLatLng: function(latitude, longitude){
		this.lat = latitude;
		this.lng = longitude;
	},
	getLatitude: function(){
		return this.lat;
	},
	getLongitude: function(){
		return this.lng;
	}
}

var transRoutes = [];
var socket = null;
var currentRoute = "";
var socketConnected = false;

function loadRoutesNearby(){
	console.log(user.position);
	$.ajax({
		url: "getroutes",
		method: "GET",
		data: {latitude: user.position.lat, longitude: user.position.lng, transport_type: user.transport_type},
		dataType: "JSON"
	}).done(function(data){
		console.log(data);
		transroutes = data;
		var routes = "";
		for(var i = 0; i < data.length; i++){
			var route = data[i];

			var transType = route.type;
			var icon = "";
			var iconClass = "";
			var routeId = route.id;
					
			if(transType == "TAXI"){
				icon = "fas fa-shuttle-van taxi";
				iconClass = "taxi"
			}else if(transType == "BUS"){
				icon = "fas fa-bus-alt bus";
				iconClass = "bus";
			}else if(transType = "TRAIN"){
				icon = "fas fa-train train";
				iconClass = "train";
			}

			routes += "<a href='#' id='"+ i +"' class='route'><i class='" + icon + 
			"' aria-hidden='true'></i><span class='routename'>" + 
			route.route_name + "</span>" + 
			"<div class='startend'><span class='routeitem ri_left'>" + route.end_a_name + 
			"</span>" + "<span class='routeitem ri_center'><i class='fas fa-arrow-right' aria-hidden='true'></i></span>" +
			"<span class='routeitem ri_right'>" + route.end_b_name + "</span></div><div class='se'>" +
			"<span class='s_e se_left'>Start</span><span class='s_e se_right'>End</span></div></a>";

			/*routes += "<a href='#' id='"+ i +"' class='route'><i class='" + icon + 
			"' aria-hidden='true'></i><span class='routename'>" + 
			route.route_name + " - " + route.end_b_name + "</span>" + 
			"<div class='startend'><span class='routeitem ri_left'>" + route.end_b_name + 
			"</span>" + "<span class='routeitem ri_center'><i class='fas fa-arrow-right' aria-hidden='true'></i></span>" +
			"<span class='routeitem ri_right'>" + route.end_a_name + "</span></div><div class='se'>" +
			"<span class='s_e se_left'>Start</span><span class='s_e se_right'>End</span></div></a>";*/
		}

		if(!socketConnected){
			//socket = io.connect('https://www.quemute.com:3000', {secure: true});
			//socket = io.connect('http://localhost:3000', {secure: true});
			try{
				socket = io.connect('http://localhost:3000', {secure: true});
				socketConnected = true;
			}catch(err){
				console.log("Can't connect to socket");
				socketConnected = false;
				//return;
			}
			if(socket){
				socketConnected = true;
				socket.on("joinroute", (users) => joinRoute(users));
				socket.on("userjoined", (user, socketId) => userJoined(user, socketId));
				socket.on("userleft", (socketId, userType) => userLeft(socketId, userType));
				socket.on("useralreadyconnected", () => $('.info_box_cont').show());
				socket.on("updateuserlocation", (user, socketId) => updateLocation(user, socketId));
				socket.on("updatedriverlocation", (user, socketId) => updateDriverLocation(user, socketId));
			}
		}

		$('.route').remove();
		$('.transroutes').append(routes);
		//$('.trans_search').hide();
		//$('.livetrack').show();
	})
}

var simulation = {
	sCommuters: [[-26.271416, 27.807256], [-26.272205, 27.807106], [-26.270704, 27.809831], [-26.270704, 27.809831], [-26.270882, 27.809938], 
	[-26.269718, 27.813683], [-26.269746, 27.813468], [-26.270090, 27.818457], [-26.270090, 27.818457], [-26.275141, 27.821397], [-26.276830, 27.822486],
	[-26.276902, 27.822217], [-26.271986, 27.830382], [-26.272149, 27.830232], [-26.272255, 27.830125], [-26.271933, 27.830420], [-26.274453, 27.834325], 
	[-26.274511, 27.834373], [-26.276959, 27.837806], [-26.277017, 27.837914], [-26.285665, 27.849710], [-26.285535, 27.849624], [-26.285545, 27.849517],
	[-26.285406, 27.849356], [-26.283131, 27.855992], [-26.281038, 27.859532], [-26.277591, 27.865266], [-26.274117, 27.871308]],
	busPositions: [[-26.273036, 27.804407], [-26.271639, 27.808114], [-26.271334, 27.809026], [-26.271050, 27.809978], [-26.270771, 27.811040], 
	[-26.270516, 27.811890], [-26.270196, 27.812829], [-26.269867, 27.813765], [-26.269539, 27.814701], [-26.269246, 27.815648], [-26.269162, 27.816638], 
	[-26.269506, 27.817523],[-26.270049, 27.818290], [-26.270617, 27.819049], [-26.271257, 27.819749], [-26.272094, 27.820084], [-26.272991, 27.820417], 
	[-26.273787, 27.820747],[-26.274643, 27.821093], [-26.275485, 27.821439], [-26.276322, 27.821779], [-26.276976, 27.822230], [-26.276724, 27.823214], 
	[-26.276394, 27.824137],[-26.276002, 27.825097], [-26.275507, 27.825918], [-26.274970, 27.826677], [-26.274427, 27.827460], [-26.273871, 27.828244], 
	[-26.273347, 27.829080], [-26.272741, 27.829818], [-26.272000, 27.830478], [-26.271269, 27.831173], [-26.271764, 27.831883], [-26.272353, 27.832575], 
	[-26.273080, 27.833169],[-26.273828, 27.833745], [-26.274561, 27.834319], [-26.275184, 27.835025], [-26.275737, 27.835832], [-26.276252, 27.836642], 
	[-26.276793, 27.837455],[-26.277320, 27.838248], [-26.277848, 27.839063], [-26.278375, 27.839881], [-26.278906, 27.840675], [-26.279505, 27.841466], 
	[-26.280116, 27.842238],[-26.280718, 27.843003], [-26.281269, 27.843735], [-26.281834, 27.844486], [-26.282411, 27.845259], [-26.282989, 27.846036], 
	[-26.283585, 27.846838],[-26.284157, 27.847589], [-26.284720, 27.848359], [-26.285307, 27.849105], [-26.285892, 27.849849], [-26.286345, 27.850726], 
	[-26.285945, 27.851557],[-26.285433, 27.852434], [-26.284930, 27.853271], [-26.284459, 27.854073], [-26.283928, 27.854950], [-26.283449, 27.855782], 
	[-26.282983, 27.856577],[-26.282463, 27.857400], [-26.281932, 27.858248], [-26.281405, 27.859095], [-26.280898, 27.859935], [-26.280431, 27.860731], 
	[-26.279914, 27.861598],[-26.279424, 27.862429], [-26.278923, 27.863269], [-26.278426, 27.864100], [-26.277933, 27.864958], [-26.277452, 27.865790], 
	[-26.276973, 27.866611], [-26.276461, 27.867466], [-26.275956, 27.868308], [-26.275463, 27.869175], [-26.274994, 27.869985], [-26.274520, 27.870784], 
	[-26.274000, 27.871677], [-26.273498, 27.872450], [-26.272827, 27.873072], [-26.272047, 27.873654], [-26.271294, 27.874207], [-26.270537, 27.874735], 
	[-26.269738, 27.875280],[-26.269014, 27.875607], [-26.268331, 27.876183], [-26.267595, 27.876701], [-26.266794, 27.877235], [-26.266104, 27.877763], 
	[-26.265432, 27.878410],[-26.264855, 27.879126], [-26.264290, 27.879902], [-26.264210, 27.880116]],
	busStartPosition: {lat: -26.273036, lng: 27.804407},
	busPositionMarker: {}, 
	sCommuterMarkers: [],
	startSimulation: function(){
		for(var i = 0; i < this.sCommuters.length; i++){
			var coordinates = this.sCommuters[i];
			var markerCoordinates = {lat: coordinates[0], lng: coordinates[1]};
			var marker = new google.maps.Marker({position: markerCoordinates, icon: commuter, map: map});
			this.sCommuterMarkers.push(marker);
			commuters++;
		}
		this.busPositionMarker = new google.maps.Marker({position: this.busStartPosition, icon: taxiIcon, map: map});
		drivers++;
		$('.commuters').text(commuters);
		$('.drivers').text(drivers);
		this.driverSimulator();
	},
	positionCounter: 0,
	timeOut: null,
	driverSimulator: function(){
		//var busPositions = this.busPositions;
		this.timeOut = setInterval(() => {
			if(this.positionCounter < this.busPositions.length){
				var coordinates = this.busPositions[this.positionCounter];
				var markerCoordinates = {lat: coordinates[0], lng: coordinates[1]};
				this.busPositionMarker.setPosition(markerCoordinates);
				map.setCenter(markerCoordinates);
				this.positionCounter++;
				this.checkCommutersNearBus(coordinates);
			}else{
				clearInterval(this.timeOut);
			}			
		}, 6000)
	},
	checkCommutersNearBus: function(busPosition){
		for(var index in this.sCommuters){
			var coordinates = this.sCommuters[index];
			var distance = window.distance(busPosition[0], busPosition[1], coordinates[0], coordinates[1], "K");
			if(distance <= 0.2){
				//delete this.sCommuters[index];
				this.sCommuters.splice(index, 1);
				this.sCommuterMarkers[index].setMap(null);
				this.sCommuterMarkers.splice(index, 1);
				commuters--;
				$('.commuters').text(commuters);
			}
		}

		/*for(var i = 0; i < this.sCommuters.length; i++){
			var coordinates = this.sCommuters[i];
			var markerCoordinates = {lat: coordinates[0], lng: coordinates[1]};
			var marker = new google.maps.Marker({position: markerCoordinates, icon: commuter, map: map});
			this.sCommuterMarkers.push(marker);
			commuters++;
		}*/
	}
}

$('.s_simul').click(function(event){
	event.preventDefault();
	simulation.startSimulation();
})



/*$('.righty').click(function(event){
	event.preventDefault();

	$.ajax({
		url: "getroutes",
		method: "GET",
		data: {latitude: user.position.lat, longitude: user.position.lng, transport_type: user.transport_type},
		dataType: "JSON"
	}).done(function(data){
		console.log(data);
		transroutes = data;
		var routes = "";
		for(var i = 0; i < data.length; i++){
			var route = data[i];

			var transType = route.type;
			var icon = "";
			var iconClass = "";
			var routeId = route.id;
					
			if(transType == "TAXI"){
				icon = "fas fa-shuttle-van taxi";
				iconClass = "taxi"
			}else if(transType == "BUS"){
				icon = "fas fa-bus-alt bus";
				iconClass = "bus";
			}else if(transType = "TRAIN"){
				icon = "fas fa-train train";
				iconClass = "train";
			}

			routes += "<a href='#' id='"+ i +"' class='route'><i class='" + icon + 
			"' aria-hidden='true'></i><span class='routename'>" + 
			route.route_name + " - " + route.end_a_name + "</span>" + 
			"<div class='startend'><span class='routeitem ri_left'>" + route.end_a_name + 
			"</span>" + "<span class='routeitem ri_center'><i class='fas fa-arrows-alt-h' aria-hidden='true'></i></span>" +
			"<span class='routeitem ri_right'>" + route.end_b_name + "</span></div><div class='se'>" +
			"<span class='s_e'>Start</span><span class='s_e se_right'>End</span></div></a>";

			routes += "<a href='#' id='"+ i +"' class='route'><i class='" + icon + 
			"' aria-hidden='true'></i><span class='routename'>" + 
			route.route_name + " - " + route.end_b_name + "</span>" + 
			"<div class='startend'><span class='routeitem ri_left'>" + route.end_b_name + 
			"</span>" + "<span class='routeitem ri_center'><i class='fas fa-arrows-alt-h' aria-hidden='true'></i></span>" +
			"<span class='routeitem ri_right'>" + route.end_a_name + "</span></div><div class='se'>" +
			"<span class='s_e'>Start</span><span class='s_e se_right'>End</span></div></a>";
		}

		if(!socketConnected){
			socket = io.connect('http://localhost:3000', {secure: true});
			if(socket){
				socketConnected = true;
				socket.on("joinroute", (users) => joinRoute(users));
				socket.on("userjoined", (user, socketId) => userJoined(user, socketId));
				socket.on("userleft", (socketId, userType) => userLeft(socketId, userType));
				socket.on("useralreadyconnected", () => $('.info_box_cont').show());
				socket.on("updateuserlocation", (user, socketId) => updateLocation(user, socketId));
				socket.on("updatedriverlocation", (user, socketId) => updateDriverLocation(user, socketId));
			}
		}

		$('.route').remove();
		$('.transroutes').append(routes);
		$('.trans_search').hide();
		$('.livetrack').show();
	})
});*/

$('.cancel').click(function(event){
	event.preventDefault();
	$('.cancel').hide();
	$('.search_input').val("");
	//$('.righty').click();
	loadRoutesNearby();
});

$('.search_input').focus(function(event){
	$('.cancel').show();
})

$('.search_input').keyup(function(event){
	var input = $(this).val();

	if(input.length > 3){
		$.ajax({
			url: "getroutes",
			method: "POST",
			data: {search_string: input},
			dataType: "JSON"
		}).done(function(data){
			transroutes = data;
			var routes = showResults(data);

			$(".search_res").find(".route").remove();
			$('.search_res').append(routes);
			$(".def_res").hide();
			$(".search_res").show();
		})
	}
})

$('.lefty').click(function(event){
	event.preventDefault();


	$('.livetrack').hide();
	$('.trans_search').show();
});

$('.navopt').click(function(event){
	event.preventDefault();

	$('.navopt').removeClass("active");
	$(this).addClass("active");
})

$('.route').click(function(event){
	event.preventDefault();

});

var mode = "COMMUTER";
/*var user = {
	user_id: "mbongnito@gmail.com",
	user_type: ,
	position: {lat: -26.271446, lng: 27.832568}
}*/
user.user_type = mode;
//user.position = {lat: user_location.lat, lng: user_location.lng};

var walkingDistance = 0.5;
$('.transroutes').on("click", ".route", function(){
	event.preventDefault();

	var routeId = $(this).attr("id");
	var route = transroutes[routeId];
	var routeStops = route.route.coordinates;
	var routePath = route.route_path;
	stops = routeStops;
	var routeName = $(this).find('.routename').text();
	var position = user.position;
	var distancesToStop = distancesToStops(position.lat, position.lng, routeStops);
	var distance = distancesToStop[0];
	if(distance > walkingDistance){
		/*displayRoute(routeStops);
		user.current_route = routeName;

		socket.emit("joinroute", user, routeName, currentRoute);
		currentRoute = routeName;*/
		user.is_nearstop = false;
	}else{
		user.is_nearstop = true;
	}
	displayRoute(routeStops);
	drawRoute(routePath);
	user.current_route = routeName;

	socket.emit("joinroute", user, routeName, currentRoute);
	currentRoute = routeName;

});

/*if(window.navigator.geolocation){
	if(currentRoute){
		watcher = navigator.geolocation.watchPosition(successCallback, errorCallback, options)
	}
}else{
	alert('Your browser does not support geolocation')
}*/
function showResults(data){
	var routes = "";
	for(var i = 0; i < data.length; i++){
		var route = data[i];

		var transType = route.type;
		var icon = "";
		var iconClass = "";
		var routeId = route.id;
					
		if(transType == "TAXI"){
			icon = "fas fa-shuttle-van taxi";
			iconClass = "taxi"
		}else if(transType == "BUS"){
			icon = "fas fa-bus-alt bus";
			iconClass = "bus";
		}else if(transType = "TRAIN"){
			icon = "fas fa-train train";
			iconClass = "train";
		}

		routes += "<a href='#' id='"+ i +"' class='route'><i class='" + icon + 
		"' aria-hidden='true'></i><span class='routename'>" + 
		route.route_name + "</span>" + 
		"<div class='startend'><span class='routeitem ri_left'>" + route.end_a_name + 
		"</span>" + "<span class='routeitem ri_center'><i class='fas fa-arrows-alt-h' aria-hidden='true'></i></span>" +
		"<span class='routeitem ri_right'>" + route.end_b_name + "</span></div><div class='se'>" +
		"<span class='s_e se_left'>Start</span><span class='s_e se_right'>End</span></div></a>";

		/*routes += "<a href='#' id='"+ i +"' class='route'><i class='" + icon + 
		"' aria-hidden='true'></i><span class='routename'>" + 
		route.route_name + " - " + route.end_b_name + "</span>" + 
		"<div class='startend'><span class='routeitem ri_left'>" + route.end_b_name + 
		"</span>" + "<span class='routeitem ri_center'><i class='fas fa-arrows-alt-h' aria-hidden='true'></i></span>" +
		"<span class='routeitem ri_right'>" + route.end_a_name + "</span></div><div class='se'>" +
		"<span class='s_e se_left'>Start</span><span class='s_e se_right'>End</span></div></a>";*/
	}
	return routes;
}

var markers= [];
var commuters = 0;
var drivers = 0;
var myPosition = null;
var watcherId = null;
var options = {
	enableHighAccuracy: true,
	timeout: 45000
}
function joinRoute(users){
	commuters = 0;
	drivers = 0;
	myPosition = new google.maps.Marker({position: user.position, icon: myPositionIcon, map: map});
	for(var index in users){
		var userType = users[index].user_type;
		var position = users[index].position;
		var nearStop = users[index].is_nearstop;
		

		if(userType === "DRIVER"){
			var transportType = users[index].transport_type;
			var transIcon = null;
			if(transportType == "TAXI"){
				markers[index] = new google.maps.Marker({position: position, icon: taxiIcon, map: map});
			}else if(transportType == "BUS"){
				markers[index] = new google.maps.Marker({position: position, icon: busIcon, map: map});
			}else if(transportType == "TRAIN"){
				markers[index] = new google.maps.Marker({position: position, icon: trainIcon, map: map});
			}

			//markers[index] = new google.maps.Marker({position: position, icon: icon, map: map});
			drivers++;	
		}else if(userType === "COMMUTER"){
			if(!nearStop){
				continue;
			}

			markers[index] = new google.maps.Marker({position: position, icon: commuter, map: map});
			commuters++;	
		}
	}
	if(window.navigator.geolocation){
		watcherId = navigator.geolocation.watchPosition(successCallback, errorCallback, options)
	}else{
		alert('Your browser does not support geolocation')
	}

	$('.commuters').text(commuters);
	$('.drivers').text(drivers);
	$('#mapcont').show();
}

var userJoinedRoute = false;
function userJoined(user, socketId){

	var userType = user.user_type;
	var position = user.position;
	var nearStop = user.is_nearstop;
	if(!nearStop){
		return;
	}

	if(userType == "DRIVER"){
		var transportType = user.transport_type;
		var transIcon = null;
		if(transportType == "TAXI"){
			markers[socketId] = new google.maps.Marker({position: position, icon: taxiIcon, map: map});
		}else if(transportType == "BUS"){
			markers[socketId] = new google.maps.Marker({position: position, icon: busIcon, map: map});
		}else if(transportType == "TRAIN"){
			markers[socketId] = new google.maps.Marker({position: position, icon: trainIcon, map: map});
		}

		//markers[socketId] = new google.maps.Marker({position: position, icon: transIcon, map: map});
		drivers++;
	}else if(userType == "COMMUTER"){
		
		markers[socketId] = new google.maps.Marker({position: position, icon: commuter, map: map});
		commuters++;
	}
	$('.commuters').text(commuters);
	$('.drivers').text(drivers);
}

function userLeft(socketId, userType){
	if(!markers[socketId]){
		return;
	}

	if(userType == "COMMUTER"){
		commuters--;
	}else if(userType == "DRIVER"){
		drivers--;
	}
	markers[socketId].setMap(null);
	delete markers[socketId];
	$('.commuters').text(commuters);
	$('.drivers').text(drivers);
}

function updateLocation(user, socketId){
	var nearStop = user.is_nearstop;
	var position = user.position;

	if(markers[socketId] && (!nearStop)){
		markers[socketId].setMap(null);
		commuters--;
		return
	}

	if(markers[socketId] && nearStop){
		markers[socketId].setPosition(position);
		return;
	}

	if(!markers[socketId] && nearStop){
		markers[socketId] = new google.maps.Marker({position: position, icon: commuter, map: map});
		commuters++;
	}
}

function updateDriverLocation(user, socketId) {
	var position = user.position;
	markers[socketId].setPosition(position);
}

var routeMarkers = [];
function displayRoute(coordinates){
	var previousKey = 0;
    var next = 1;
    var routePath = [];
    var midCoord = parseInt(coordinates.length / 2);
    for(var i = 0; i < coordinates.length; i++){
        if((next + 1) < coordinates.length){
            next = i + 1;
        }
        var request = {
            origin: {
                lat: coordinates[previousKey][1],
                lng: coordinates[previousKey][0]
            },
            destination: {
                lat: coordinates[next][1],
                lng: coordinates[next][0]
        	},
    	}
    	var position = {
    		lat: coordinates[i][1],
    		lng: coordinates[i][0]
    	}

    	routeMarkers[i] = new google.maps.Marker({position: position, icon: stopIcon, map: map});   
    }
    var center = {
    	lat: coordinates[midCoord][1],
    	lng: coordinates[midCoord][0]
    }
    map.setCenter(user.position);
}

function drawRoute(routePathCoordinates){
	const routePath = new google.maps.Polyline({
		path: routePathCoordinates,
		geodesic: true,
		strokeColor: '#971C1F',
		strokeOpacity: 1.0,
		strokeWeight: 5,
	})
	routePath.setMap(map);
}

var stops = null;
function successCallback(position){
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var distancesToStop = distancesToStops(latitude, longitude, stops);
	var distance = distancesToStop[0];
	if(distance > walkingDistance){
		user.is_nearstop = false;
	}else{
		user.is_nearstop = true;
	}

	user.position = {lat: latitude, lng: longitude};
	socket.emit("updateuserlocation", user);
}

function errorCallback(position){
	alert("Could not update your location.");
}

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}

function distancesToStops(latitude, longitude, stops){
	var distances = [];
	for(var i = 0; i < stops.length; i++){
		var lat = stops[i][1];
		var lon =  stops[i][0];

		distances[i] = distance(latitude, longitude, lat, lon, "K");
	}

	distances.sort();
	return distances;
}

var latlngSet = false;
var map;
var marker;
var trainIcon;
var busIcon;
var trainIcon;
var commuter;
var myPositionIcon;
var stopIcon = null;
var directionsService = null;
var directionsRenderer = null;

function initMap(){

	var latlng = {lat: -26.248346, lng: 27.948133,};
	taxiIcon = new google.maps.MarkerImage('busicon1.png', null ,new google.maps.Point(0, 0), 
		new google.maps.Point(12, 12));
	busIcon = new google.maps.MarkerImage('busicon1.png', null ,new google.maps.Point(0, 0), 
		new google.maps.Point(12, 12));
	commuter = new google.maps.MarkerImage('commuter.png', null ,new google.maps.Point(0, 0), 
		new google.maps.Point(12, 24));
	stopIcon  = new google.maps.MarkerImage('redmarker2.png', null ,new google.maps.Point(0, 0), 
		new google.maps.Point(7.5, 7.5));
	myPositionIcon = new google.maps.MarkerImage('marker-icon.png', null ,new google.maps.Point(0, 0),
		new google.maps.Point(12, 41));

	var customMapType = new google.maps.StyledMapType([
			/*{
				stylers: [{visibility: "off"}]
			},*/
      		{
      			featureType: 'road',
        		elementType: 'geometry',
        		stylers: [{visibility: 'on'}]
      		},
      		{
      			featureType: 'road',
      			elementType: 'labels',
      			stylers: [{visibility: 'on'}]
      		},
      		{
      			featureType: 'poi',
      			/*elementType: 'labels.text.fill',*/
      			stylers: [{visibility: 'off'}]
      		},
      		{
      			featureType: 'transit',
      			elementType: 'labels',
      			stylers: [{visibility: 'off'}]
      		}
    	], {
     		name: 'Custom Style'
  	});
  	var customMapTypeId = 'custom_style';

	map = new google.maps.Map(document.getElementById('mapid'), {
		center: latlng,
		zoom: 13,
		disableDoubleClickZoom: true,
		mapTypeControlOptions: {
    		mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId, 'terrain']
    	}
	});
	map.mapTypes.set(customMapTypeId, customMapType);
 	map.setMapTypeId(customMapTypeId);
 	/*directionsService = new google.maps.DirectionsService();
 	directionsRenderer = new google.maps.DirectionsRenderer();
 	directionsRenderer.setMap(map);*/
 	accessLocation();
}

async function accessLocation(){
	if(typeof navigator.geolocation == "undefined"){
		user_location.locSet = false;
		alert("Please enable location.");
	}else{
		navigator.geolocation.getCurrentPosition(granted, denied,  { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000});
	}
}

function granted(position){
	lat = parseFloat(position.coords.latitude).toFixed(6);
	lng = parseFloat(position.coords.longitude).toFixed(6);
	
	user_location.setLatLng(lat, lng);
	user_location.locSet = true;
	user.position = {lat: parseFloat(lat), lng: parseFloat(lng)};
	loadRoutesNearby()
	map.setCenter(user.position);
	$('.lightbox-shadow').hide();
}

function denied(position) {
	user_location.locSet = false;
	alert("Please enable location.");
}