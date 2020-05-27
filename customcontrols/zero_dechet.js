mviewer.customControls.zero_dechet = (function() {
    /*
     * Private
     */
    var _draw; // global so we can remove it later

	var _xy;
	



    return {
        /*
         * Public
         */

        init: function () {
            // mandatory - code executed when panel is opened
            $(".isochrone-values").each(function(i, item) {
                $(item).css("background-color", $(item).attr("data-fill"));
                $(item).css("border", ["solid", $(item).attr("data-stroke"), "2px"].join (" "));
            });
        },

		
		getFileName: function ()
			{
			var x = document.getElementById('image')
			var y = document.getElementById('casedepart');
			var z = document.getElementById('preview');

			y.style.display = 'none';
			
			var reader = new FileReader();
			
			 reader.addEventListener("load", function () {
				z.src = reader.result;
			  }, false);

			  if (x.files[0]) {
				reader.readAsDataURL(x.files[0]);
			  }
			
			document.getElementById('casearrive').style.display='inline';
			document.getElementById('preview').style.visibility='visible';
			
			},

		applyEvent: function ()
		 {
		var newFile='';	
		var acteur = document.getElementById('acteur').value;
		var categorie = document.getElementById('categorie').value;
		var souscategorie = document.getElementById('souscategorie').value;
		var activite_produit = document.getElementById('activite_produit').value;
		var demarchezd = document.getElementById('demarchezd').value;
		var referent = document.getElementById('referent').value;
		var tel = document.getElementById('tel').value;
		var siteinternet = document.getElementById('siteinternet').value;
		var facebook = document.getElementById('facebook').value;
		var adressenum = document.getElementById('adressenum').value;
		var adressevoie = document.getElementById('adressevoie').value;
		var adressecomplement = document.getElementById('adressecomplement').value;
		var adressecp = document.getElementById('adressecp').value;
		var adressecommune = document.getElementById('adressecommune').value;
		var mail = document.getElementById('mail').value;
		var image = document.getElementById("image").files[0];
		var erreur = "Merci de bien vouloir : <br/>" ;
		
		
		if (categorie=='none')
		erreur = erreur + "- Choisir une catégorie<br/>";
		
		if (acteur=='')
		erreur = erreur + "- Remplir le champ acteur<br/>";
		
		if (image != undefined)
			{
				var extension = image.name.split('.').pop();
				extension = extension.toLowerCase();

				var blob = image.slice(0,image.size, 'image/'+extension);

				var date_saisie = new Date();
				date_saisie = date_saisie.getTime();
				//definir le nom avec la date en place de name
				newFile= new File([blob], 'photo_'+date_saisie+'.'+extension, {type: 'image/'+extension});
			}
			
		if (_xy==undefined)
		erreur = erreur + "- Définir un lieu<br/>";
		
		if (erreur=="Merci de bien vouloir : <br/>")
		{mviewer.customControls.zero_dechet.send_comment(activite_produit,_xy[0],_xy[1],categorie,mail,newFile, acteur,souscategorie,demarchezd,referent,tel,siteinternet,facebook,adressenum,adressevoie,adressecomplement,adressecp,adressecommune);}
		else
		{mviewer.alert(erreur,"alert-info");}
		 },

		send_comment: function (activite_produit,coord_x,coord_y,categorie,mail,image,acteur,souscategorie,demarchezd,referent,tel,siteinternet,facebook,adressenum,adressevoie,adressecomplement,adressecp,adressecommune)
		{

		var imagename = encodeURIComponent(image.name);
		$.ajax({
			url:'/mviewer/apps/archipel_zd/savecomment.php',
			method:'POST',
			data:{
				imagename:imagename,
				acteur:acteur,
				coord_x:coord_x,
				coord_y:coord_y,
				activite_produit:activite_produit,
				categorie:categorie,
				souscategorie:souscategorie,
				demarchezd:demarchezd,
				referent:referent,
				tel:tel,
				siteinternet:siteinternet,
				mail:mail,
				facebook:facebook,
				adressenum:adressenum,
				adressevoie:adressevoie,
				adressecomplement:adressecomplement,
				adressecp:adressecp,
				adressecommune:adressecommune

			},
		   success:function(data){
				mviewer.alert("Merci d'avoir participé","alert-info");
		   }
		});
		
		var formData = new FormData();
		formData.append("image", image);
				
		var xhr = mviewer.customControls.zero_dechet.getXMLHttpRequest();
		xhr.open("POST", "/mviewer/apps/faune_flore_demo/saveimage.php", true);
		xhr.send(formData);
		
		
		document.getElementById("formu").reset();
		document.getElementById('casearrive').style.display='none';
		document.getElementById('casedepart').style.display='inline';
		document.getElementById('preview').src='#';
				
		mviewer.customControls.zero_dechet.destroy();
		
		},
		
		getXMLHttpRequest: function ()
			{
			var xhr = null;
			
			if (window.XMLHttpRequest || window.ActiveXObject)
			{
				if (window.ActiveXObject)
				{
					try
					{
						xhr = new ActiveXObject("Msxml2.XMLHTTP");
					}
					catch(e)
					{
						xhr = new ActiveXObject("Microsoft.XMLHTTP");
					}
				}
				else
				{
					xhr = new XMLHttpRequest(); 
				}
			}
			else 
			{
				alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
				return null;
			}
			
			return xhr;
		},

        getXY: function () {
              info.disable();
              _draw = new ol.interaction.Draw({
                type: 'Point'
              });
              _draw.on('drawend', function(event) {
                 _xy = ol.proj.transform(event.feature.getGeometry().getCoordinates(),'EPSG:3857', 'EPSG:4326');
                 mviewer.getMap().removeInteraction(_draw);
                 mviewer.showLocation('EPSG:4326', _xy[0], _xy[1]);
                 info.enable();
              });
              mviewer.getMap().addInteraction(_draw);
		},
		showModifyForm: function(){
			$( "#modifier" ).show();
			$( "#ajouter" ).hide();
		},
		showAddForm: function(){
			$( "#ajouter" ).show();
			$( "#modifier" ).hide();
		},

		activateSelect: function(){
			info.disable();
			mviewer.getMap().removeInteraction(_draw);
			var selectArchipel = new ol.interaction.Select({
				condition: ol.events.condition.click,
				layers: [mviewer.customLayers.zero_dechet.layer]
			  });
			mviewer.getMap().addInteraction(selectArchipel);
			mviewer.getMap().on('singleclick', function(evt){ 				
				var donnees=mviewer.getMap().forEachFeatureAtPixel(evt.pixel, function(featuress, couche){
					var donnees=[featuress, couche];
					return donnees;
				});
				if(donnees){
					var featuress=donnees[0];
					var acteurValue=featuress.get("acteur");
					var categorieValue=featuress.get("categorie");
					var souscategorieValue=featuress.get("sous_categorie");
					var activite_produitValue=featuress.get("activite_produit");
					var demarchezdValue=featuress.get("demarche_zd");
					var referentValue=featuress.get("referent");
					var telValue=featuress.get("telephone");
					var emailValue=featuress.get("email");
					var siteinternetValue=featuress.get("site_internet");
					var facebookValue=featuress.get("facebook");
					var adressenumValue=featuress.get("adresse_num");
					var adressevoieValue=featuress.get("adresse_voie");
					var adressecomplementValue=featuress.get("adresse_complement");
					var adressecpValue=featuress.get("adresse_cp");
					var adressecommuneValue=featuress.get("adresse_commune");
					console.log(acteurValue);					
					$('#acteurmodif').val(acteurValue);
					$('#categoriemodif').val(categorieValue);
					$('#souscategoriemodif').val(souscategorieValue);
					$('#activite_produitmodif').val(activite_produitValue);
					$('#demarchezdmodif').val(demarchezdValue);
					$('#referentmodif').val(referentValue);
					$('#telmodif').val(telValue);
					$('#mailmodif').val(emailValue);
					$('#siteinternetmodif').val(siteinternetValue);
					$('#facebookmodif').val(facebookValue);
					$('#adressenummodif').val(adressenumValue);
					$('#adressevoiemodif').val(adressevoieValue);
					$('#adressecomplementmodif').val(adressecomplementValue);
					$('#adressecpmodif').val(adressecpValue);
					$('#adressecommunemodif').val(adressecommuneValue);
				}
			});
		},

        destroy: function () {
            // mandatory - code executed when panel is closed
            _xy = null;
            mviewer.hideLocation();
			mviewer.customLayers.zero_dechet.layer.getSource().clear();
			mviewer.customLayers.zero_dechet.layer.getSource().refresh();
        },
		
		
     };

	

}());
