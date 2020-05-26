<?php
header("Content-Type: text/plain");
$coord_x = (isset($_POST["coord_x"])) ? $_POST["coord_x"] : NULL;
$coord_y = (isset($_POST["coord_y"])) ? $_POST["coord_y"] : NULL;
$categorie = (isset($_POST["categorie"])) ? $_POST["categorie"] : NULL;
$imagename = (isset($_POST["imagename"])) ? $_POST["imagename"] : NULL;
$nom = (isset($_POST["nom"])) ? $_POST["nom"] : NULL;

// if ($comment)

try{

	$myPDO = new PDO("pgsql:host=localhost;dbname=archipel;port=5432","postgres","postgres");
	$sql_query1 = "INSERT INTO mviewer.archipel_zero_dechet(nom,geom)VALUES('$nom',ST_GeomFromText('POINT($coord_x $coord_y)', 4326))";
	$myPDO->query($sql_query1); 

}catch(PDOException $e){

	echo $e->getMessage();

}
?>
