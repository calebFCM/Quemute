<?php

/*
	Script for retreiving public transport routes within a $max_distance of the user's current location.
*/

require_once '/var/www/html/vendor/autoload.php';
require_once '/var/www/html/peebob/src/db_connect.php';

$routes_collection = $mongodb->quemute->taxi_routes;

$transport_type = $_GET['transport_type'];
$latitude = (float) $_GET['latitude'];
$longitude = (float) $_GET['longitude'];
$max_distance = 1000;

$coordinates = [$longitude, $latitude];

$query = ['route' => ['$near' => ['$geometry' => ['type' => "Point", 'coordinates' => $coordinates], '$maxDistance' => $max_distance]]];

try{
	$cursor = $routes_collection->find($query);

	$routes = [];
	foreach($cursor as $doc){
		$doc['_id'] = $doc['_id']->__toString();
		$routes[] = $doc;
	}
	if($routes){
		$result = ['status' => true, 'err_msg' => "", 'req_msg' => "", 'data' => $routes];
	}else{
		$result = ['status' => false, 'err_msg' => "", 'req_msg' => "No routes found nearby", 'data' => []];
	}
	echo json_encode($result);
}catch(MongoDB\Driver\Exception\Exception $exc){
	$err_message = "Error: Something went wrong, could not get routes. Please try again";
	$result = ['status' => false, 'err_msg' => $err_message, 'data' => []];
	echo json_encode($result);
}

?>