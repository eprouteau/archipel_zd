<?php
try{

	$myPDO = new PDO("pgsql:host=localhost;dbname=archipel;port=5432","postgres","postgres");
	$sql_query1 = "INSERT INTO mviewer.faune_flore(nom)VALUES('dede')";
	$myPDO->query($sql_query1); 

}catch(PDOException $e){

	echo $e->getMessage();

}
?>