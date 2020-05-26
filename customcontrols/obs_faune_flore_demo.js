mviewer.customControls.obs_faune_flore_demo = (function() {
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
		var acteur = document.getElementById('acteur');
		var categorie = document.getElementById('categorie');
		var categorieSouscategorie = document.getElementById('souscategorie');
		var text = document.getElementById('activite_produit');
		var demarcheZd = document.getElementById('demarchezd');
		var referent = document.getElementById('referent');
		var tel = document.getElementById('tel');
		var siteinternet = document.getElementById('siteinternet');
		var facebook = document.getElementById('facebook');
		var adressenum = document.getElementById('adressenum');
		var adressevoie = document.getElementById('adressevoie');
		var adressecomplement = document.getElementById('adressecomplement');
		var adressecp = document.getElementById('adressecp');
		var adressecommune = document.getElementById('adressecommune');
		var mail = document.getElementById('mail');
		var image = document.getElementById("image").files[0];
		var erreur = "Merci de bien vouloir : <br/>" ;
		
		
		if (categorie.value=='none')
		erreur = erreur + "- Choisir une catégorie<br/>";
		
		if (acteur.value=='')
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
		{mviewer.customControls.obs_faune_flore_demo.send_comment(text.value,_xy[0],_xy[1],categorie.value,mail.value,newFile, acteur.value);}
		else
		{mviewer.alert(erreur,"alert-info");}
		 },

		send_comment: function (activite_produit,coord_x,coord_y,categorie,mail,image,acteur)
		{
		var xhr = mviewer.customControls.obs_faune_flore_demo.getXMLHttpRequest();
		
		var sactivite_produit = encodeURIComponent(activite_produit);
		var coord_x = encodeURIComponent(coord_x);
		var coord_y = encodeURIComponent(coord_y);
		var categorie = encodeURIComponent(categorie);
		var mail = encodeURIComponent(mail);
		var imagename = encodeURIComponent(image.name);
		var acteur = encodeURIComponent(acteur);

		
		var formData = new FormData();
		formData.append("image", image);
		
		xhr.open("POST", "/mviewer/apps/faune_flore_demo/savecomment.php", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send("comment="+sactivite_produit+"&coord_x="+coord_x+"&coord_y="+coord_y+"&categorie="+categorie+"&mail="+mail+"&imagename="+imagename+"&acteur="+acteur);
		
		var xhr = mviewer.customControls.obs_faune_flore_demo.getXMLHttpRequest();
		xhr.open("POST", "/mviewer/apps/faune_flore_demo/saveimage.php", true);
		xhr.send(formData);
		
		mviewer.alert("Merci d'avoir participé dédé","alert-info");
		document.getElementById("ajouter").reset();
		document.getElementById('casearrive').style.display='none';
		document.getElementById('casedepart').style.display='inline';
		document.getElementById('preview').src='#';
				
		mviewer.customControls.obs_faune_flore_demo.destroy();
		
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
				layers: [mviewer.customLayers.obs_faune_flore_demo.layer]
			  });
			mviewer.getMap().addInteraction(selectArchipel);
			mviewer.getMap().on('singleclick', function(evt){ 				
				var donnees=mviewer.getMap().forEachFeatureAtPixel(evt.pixel, function(featuress, couche){
					var donnees=[featuress, couche];
					return donnees;
				});
				if(donnees){
					console.log('dede');
					var featuress=donnees[0];
					var nomValue=featuress.get("nom");					
					$('#nom').val(nomValue);
				}
			});
		},

        destroy: function () {
            // mandatory - code executed when panel is closed
            _xy = null;
            mviewer.hideLocation();
			mviewer.customLayers.obs_faune_flore_demo.layer.getSource().clear();
			mviewer.customLayers.obs_faune_flore_demo.layer.getSource().refresh();
        },
		
		
     };

	

}());
