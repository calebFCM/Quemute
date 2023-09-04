<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title></title>
</head>
<body>
	<div class="lightbox-shadow loading">
		<div class="loader_box">
			<img src="../quemute.png" class="load_logo">
		</div>
	</div>
	<div class="livetrack">
		<div class="r_search">
			<input type="text" name="searchroute" class="search_input" placeholder="search route">
			<a href="#" class="cancel">cancel</a>
		</div>
		<div class="transroutes def_res">
		</div>
		<div class="transroutes search_res">
		</div>
	</div>
	<div id="mapcont">
		<div class="map_ins">
			<!--<div class="map_info close_cont"><a href="#" class="close"><i class="fa fa-times-thin"></i></a></div>
			<div class="map_info"><span>Pan and zoom and click on desired location</span></div>-->
			<a href="#" class="close"><i class="fas fa-arrow-left"></i></a>
			<a href="#" class="s_simul"><i class="fa fa-play"></i></a>
		</div>
		<div id="mapid"></div>
		<div class="map_foot">
			<div class="route_stats">
				<span class="r_stat commuters">0</span>
				<span class="r_stat"><i class="fa fa-users" aria-hidden="true"></i> Commuters</span>
			</div>
			<div class="route_stats">
				<span class="r_stat drivers">0</span>
				<span class="r_stat"><i class="fas fa-shuttle-van" aria-hidden="true"></i> Taxis</span>
			</div>
		</div>
	</div>
	<div class="lightbox-shadow info_box_cont">
		<div class="info_box">
			<div class="close_cont">
				<a href="#" class="close_popup"><i class="fa fa-times-thin" aria-hidden="true"></i></a>
			</div>
			<div class="info_cont">
				<span class="info_icon"><i class="fa fa-info-circle"></i></span>
			</div>
			<div class="info_cont">
				<span class="info_header">Oopsie Daisy!</span>
			</div>
			<div class="info_cont info_message">
				<span>
					It appears that you already have joined a route for livetracking in a different tab or device.
				</span>
			</div>
		</div>
	</div>
	<!--<script src="https://api.afrigis.co.za/leaflet/1.0.0/afrigis-leaflet.min.js"></script>-->
	<!--<script src="https://www.quemute.com:3000/socket.io/socket.io.js"></script>-->
	<script src="http://localhost:3000/socket.io/socket.io.js"></script>
	<script type="text/javascript">
		
	</script>
	<script type="text/javascript" src="/ui_scripts/webapp/livetrack.js"></script>
	<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBJCKet5GBjRl37I15QMBGrAP1qGV-s0v8&callback=initMap"></script>
</body>
</html>