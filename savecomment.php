<?php
header("Content-Type: text/plain");
$coord_x = (isset($_POST["coord_x"])) ? $_POST["coord_x"] : NULL;
$coord_y = (isset($_POST["coord_y"])) ? $_POST["coord_y"] : NULL;
$categorie = (isset($_POST["categorie"])) ? $_POST["categorie"] : NULL;
$imagename = (isset($_POST["imagename"])) ? $_POST["imagename"] : NULL;
$acteur = (isset($_POST["acteur"])) ? $_POST["acteur"] : NULL;
$souscategorie = (isset($_POST["souscategorie"])) ? $_POST["souscategorie"] : NULL;
$activite_produit = (isset($_POST["activite_produit"])) ? $_POST["activite_produit"] : NULL;
$demarchezd = (isset($_POST["demarchezd"])) ? $_POST["demarchezd"] : NULL;
$referent = (isset($_POST["referent"])) ? $_POST["referent"] : NULL;
$tel = (isset($_POST["tel"])) ? $_POST["tel"] : NULL;
$siteinternet = (isset($_POST["siteinternet"])) ? $_POST["siteinternet"] : NULL;
$mail = (isset($_POST["mail"])) ? $_POST["mail"] : NULL;
$facebook = (isset($_POST["facebook"])) ? $_POST["facebook"] : NULL;
$adressenum = (isset($_POST["adressenum"])) ? $_POST["adressenum"] : NULL;
$adressevoie = (isset($_POST["adressevoie"])) ? $_POST["adressevoie"] : NULL;
$adressecomplement = (isset($_POST["adressecomplement"])) ? $_POST["adressecomplement"] : NULL;
$adressecp = (isset($_POST["adressecp"])) ? $_POST["adressecp"] : NULL;
$adressecommune = (isset($_POST["adressecommune"])) ? $_POST["adressecommune"] : NULL;

// if ($comment)

try{

	$myPDO = new PDO("pgsql:host=postgresql-emeric-prouteau.alwaysdata.net;dbname=emeric-prouteau_viree_outdoor","emeric-prouteau","Emeric78$");
	$sql_query1 = "INSERT INTO archipel.zero_dechet_p(acteur,categorie,sous_categorie,activite_produit,demarche_zd,referent,telephone,email,site_internet,facebook,adresse_num,adresse_voie,adresse_complement,adresse_cp,adresse_commune,photo,geom)VALUES('$acteur','$categorie','$souscategorie','$activite_produit','$demarchezd','$referent','$tel','$mail','$siteinternet','$facebook','$adressenum','$adressevoie','$adressecomplement','$adressecp','$adressecommune','$imagename',ST_GeomFromText('POINT($coord_x $coord_y)', 4326))";
	$myPDO->query($sql_query1); 

}catch(PDOException $e){

	echo $e->getMessage();

}
?>
