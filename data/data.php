<?php // Connection à la base de données
try {
		$dbconn=new PDO("pgsql:host=localhost;dbname=archipel","postgres","postgres") or die('Connexion impossible');
		$dbconn->exec("SET CHARACTER SET utf8");
		$dbconn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
// S'il existe un problème de connection, on obtient le message d'erreur
} catch(PDOException $erreur) {
		$erreur->getMessage(); // Supprimer en production
		echo 'erreur';
}
if($dbconn){
	// Exécution de la requête SQL GeoJSON
	$sqlGeoJSON="SELECT json_build_object(
		'type', 'FeatureCollection',
		'crs',  json_build_object(
			'type',      'name',
			'properties', json_build_object(
			'name', 'EPSG:4326')),
		'features', json_agg(
			json_build_object(
				'type',       'Feature',
				'id',         cle_id,
				'geometry',   ST_AsGeoJSON(geom,5)::json,
				'properties', json_build_object(
					'nom', nom					
				)
			)
		)
	) AS objet_geosjon FROM mviewer.faune_flore_geo;"; 
	$reqGeoJSON=$dbconn->prepare($sqlGeoJSON);
	$reqGeoJSON->execute(); 
	$dataGeoJSON=$reqGeoJSON->fetch();
	if($dataGeoJSON){
		$objetGeoJSON=$dataGeoJSON['objet_geosjon'];
		echo $objetGeoJSON;
	}else{
		echo 'erreur';
	}
}
?>