$(document).ready(function() {
	$("#commune").autocomplete({
		minLength:3,
		source: function(request, response){
			$.ajax( {
				url:"http://infoweb-ens/~jacquin-c/codePostal/commune.php",
				type:'POST',
				dataType:'json',
				data:{"commune":$("#commune").val()},
				success:function(data){
					var commune=[];
					if(data) {
						$.each(data,function(i){
							commune[i]=data[i].Ville;
						});
						response(commune);
					}				
				},
	
				error:function(data, status, err){
					swal("Alerte!", "Une erreur s'est produite avec l'autocomplete", "warning")
				}
			})
		},
	});
	

	$('#recherche').submit(function(e){
		e.preventDefault();
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags="+$("#commune").val()+"&tagmode=any&format=json&jsoncallback=?",
        function(data) {
        	// Enlever les images déjà présentes
        	$(".col-sm-6").remove();

        	// Tri par nom d'auteur A-Z
        	if ($("#tri").val() == "auteur_az") {
        		data.items.sort(function(a,b){
        			var a1 = a.author.toLowerCase();
        			var b1 = b.author.toLowerCase();
        			return ((a1<b1)?-1:((a1>b1)?1:0));
        		});
        	}
        	// Tri par nom d'auteur Z-A
        	else if($("#tri").val() == "auteur_za") {
        		data.items.sort(function(a,b){
        			var a1 = a.author.toLowerCase();
        			var b1 = b.author.toLowerCase();
        			return ((a1>b1)?-1:((a1<b1)?1:0));
        		});
        	}
        	// Tri par nom de photo A-Z
        	else if($("#tri").val() == "photo_az") {
        		data.items.sort(function(a,b){
        			var a1 = a.title.toLowerCase();
        			var b1 = b.title.toLowerCase();
        			return ((a1<b1)?-1:((a1>b1)?1:0));
        		});
        	}
        	// Tri par nom de photo Z-A
        	else if($("#tri").val() == "photo_za") {
        		data.items.sort(function(a,b) {
        			var a1 = a.title.toLowerCase();
        			var b1 = b.title.toLowerCase();
        			return ((a1>b1)?-1:((a1<b1)?1:0));
        		});
        	}
        	// Tri par photos récentes selon une date
        	else if($("#tri").val() == "recent") {
        		data.items.sort(function(a,b){
        			var a1 = Date.parse(a.published);
        			var b1 = Date.parse(b.published);
        			return ((a1<b1)?-1:((a1>b1)?1:0));
        		});
        	}
        	// Tri par photos anciennes
        	else {
        		data.items.sort(function(a,b) {
        			var a1 = Date.parse(a.published);
        			var b1 = Date.parse(b.published);
        			return ((a1>b1)?-1:((a1<b1)?1:0));
        		});
        	}

        	var src =$("#datepicker").val();
			var reg =new RegExp("^[0-9]{2}[/]{1}[0-9]{2}[/]{1}[0-9]{4}$","g");
			
        	// Filtrage selon une date données
        	if ($("#datepicker").val() && reg.test(src)) {
        		// Date reformatée
        		var date = $("#datepicker").val().split("/").reverse();
        		data.items = jQuery.grep(data.items, function(item) {
        		return Date.parse(item.published)>Date.parse(date[0]+"-"+date[2]+"-"+date[1]);
        		});
        	}else if($("#datepicker").val())
        	{
        		$("#datepicker").val("").focus();
        		swal("Alerte!", "La date indiquer n'est pas correct", "warning")
        		return;
        	}

        	if(!$("#commune").val() || !$("#nbPhotos").val() && $("#typeAffiche").find("img").attr('id')!="carousel"){
        		$("#commune").focus();
        		swal("Alerte!", "Des informations comme le nombre de photo par page ou la commune ont été oubliées", "warning")
        		return;	
        	}

        	if(parseInt($("#nbPhotos").val())<=0){
        		$(".pages").remove();
        		swal("Alerte!", "Vous êtes sûr de vous?", "warning")
        		return;
        	}

        	if ($("#typeAffiche").find("img").attr('id')=="list") {
        		// Suppression du carousel
        		$(".wapper").remove();

        		$.each(data.items, function(i,item) {
        			

	        		$("<div/>",{class:"col-sm-6 col-md-4", id:""+i}).appendTo($(".row"));
	        		$("<div/>",{class:"thumbnail"}).appendTo($("#"+i));
	        		$("<img/>").attr("src", item.media.m).appendTo($("#"+i).find(".thumbnail"));     		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
	            	
	            	if ( i == $("#nbPhotos").val()-1) return false;
	            	
	         	});

	         	var nbPhotos = parseInt($("#nbPhotos").val());
	         	var nbPhotosTotal = data.items.length;

	         	// Pagination
	            if (nbPhotosTotal > nbPhotos) {
	            	$(".pages").remove();
	            	$("<nav/>", {class:"pages"}).appendTo($("#bg"));
	            	$("<ul/>", {class:"pagination"}).appendTo($(".pages"));
	            		
	            	if (nbPhotosTotal%nbPhotos == 0) {
	            		var nbPages = Math.floor(nbPhotosTotal/nbPhotos);
	            	}
	            	else {
	            		var nbPages = Math.floor(nbPhotosTotal/nbPhotos)+1;
	            	}

            		// Remplir les images dans les pages
            		for (var i=0; i<nbPages; i++) {

            			$("<li/>", {id:"li"+i}).appendTo($(".pagination"));
            			$("<a/>", {href:"#"}).text(""+(i+1)).appendTo("#li"+i);
            			
            			$("#li"+i).click(function() {
            				$(".col-sm-6").remove();
	           				var page = $(this).index();
	           				var debut = page*nbPhotos;
	           				var fin = debut + nbPhotos;

            				for (var j=debut; j<fin; j++) {
            					if(j==nbPhotosTotal)break;
            					$("<div/>",{class:"col-sm-6 col-md-4", id:""+j}).appendTo($(".row"));
        						$("<div/>",{class:"thumbnail"}).appendTo($("#"+j));
        						$("<img/>",{id:"image"+j}).attr("src", data.items[j].media.m).appendTo($("#"+j).find(".thumbnail"));

        						// Effets mouseover
        						$("img").mouseover(function() {
					        		$("#etiquette").remove();
									$("<div/>",{id:'etiquette',class:'col-md-9 col-md-push-3'}).css({'position':'absolute', 'margin':'0' , 'left':'0', 'bottom':'0', 'width':'240px', "background-color":"#EEEEEE","opacity":"0.8"}).appendTo($(this).parent());
									var author = data.items[j].author.split("(");
									author = author[1].split(")");
									$("<p/>").text("Auteur : "+author[0]).appendTo($("#etiquette"));
									$( "#etiquette" ).effect( "slide", "slow" );
								});
            				}

            				$("img").click(function() {
            					i = $(this).parent().parent().attr('id');		
				        		$(".mymodal").remove();

				        		// La croix
				        		$("<div/>", {class:"well mymodal"}).appendTo($("#modal"));
				        		$("<button/>", {type:"button", class:"close"}).appendTo($(".mymodal"));
				        		$("<span/>", {"aria-hiden":"true"}).html("&times;").appendTo($(".mymodal").find("button"));
				        		
				        		// Apparition du modal
								$( ".mymodal" ).effect("bounce", "slow" );
								
				        		// Contenu du modal
				        		$("<div/>",{class:"thumbnail inmodal"}).appendTo($(".mymodal"));
				        		$(this).clone().appendTo($(".inmodal"));
				        		$("<h4/>").text(data.items[i].title).appendTo(".mymodal");
				        		var author = data.items[i].author.split("(");
								author = author[1].split(")");
				        		$("<p/>").html(author[0]+" <a href='#'>(Voir son profil)</a>").appendTo($(".mymodal"));
				        		$("<p/>").text("Photo prise le "+data.items[i].date_taken).appendTo($(".mymodal"));
								
								$("<button/>", {type:"button", class:"btn btn-success btn-lg", id:"like"}).appendTo(".mymodal");
								$("<span/>", {class:"glyphicon glyphicon-thumbs-up", "aria-hiden":"true"}).appendTo("#like");

								$("<button/>", {type:"button", class:"btn btn-danger btn-lg", id:"dislike"}).appendTo(".mymodal");
								$("<span/>", {class:"glyphicon glyphicon-thumbs-down", "aria-hiden":"true"}).appendTo("#dislike");

								$("#like").click(function() {
									$("#like").effect("transfer",{ to: $("#fav")}, 1000);
									$("#fav").delay(900).effect("highlight", "slow");
									$(".badge").text(parseInt($(".badge").text())+1+"");
									$("#like").attr("disabled", "disabled");
									swal("Super!", "L'image a été rajoutée dans vos favoris!", "success")
									$(".mymodal").effect("fade", "slow");
								});	

								$("#dislike").click(function() {
									swal({
									  title: "Etes-vous sûr?",
									  text: "Vous ne pourrez plus ajouter cette image dans vos favoris!",
									  type: "warning",
									  showCancelButton: true,
									  confirmButtonClass: "btn-danger",
									  confirmButtonText: "Oui! Je n'aime pas cette image!",
									  cancelButtonText: "Non, je veux annuler mon vote!",
									  closeOnConfirm: false,
									  closeOnCancel: false
									},
									function(isConfirm) {
									  if (isConfirm) {
									    swal("Votre vote a été pris en compte.");
									  } 
									  else {
									    swal("Annulé!", "Votre vote n'a pas été pris en compte :)", "error");
									  }
									});
									$(".mymodal").effect("explode", "slow");
								});	

								// Fermer le modal
								$(".close").click(function() {
									$("#bg").css('opacity', 1);
									$(".mymodal").effect("fade", "slow");
								});
							}); // fin image on click
	            		}); // fin li on click
	            	} // fin remplissable d'images		
	            } // fin pagination

	            // Effet au mouseover sur une image
	        	$("img").mouseover(function() {
	        		i = $(this).parent().parent().attr('id');
	        		$("#modaltest").remove();
					$("<div/>",{id:'modaltest',class:'col-md-9 col-md-push-3'}).css({'position':'absolute', 'margin':'0' , 'left':'0', 'bottom':'0', 'width':'240px', "background-color":"#EEEEEE","opacity":"0.8"}).appendTo($(this).parent());
					var author = data.items[i].author.split("(");
					author = author[1].split(")");
					$("<p/>").text("Auteur : "+author[0]).appendTo($("#modaltest"));
					$( "#modaltest" ).effect( "slide", "slow" );
				});
				
				// Effet click
				$("img").click(function() {
					i = $(this).parent().parent().attr('id');
	        		$(".mymodal").remove();

	        		// La croix
	        		$("<div/>", {class:"well mymodal"}).appendTo($("#modal"));
	        		$("<button/>", {type:"button", class:"close"}).appendTo($(".mymodal"));
	        		$("<span/>", {"aria-hiden":"true"}).html("&times;").appendTo($(".mymodal").find("button"));
	        		
	        		// Apparition du modal
					$( ".mymodal" ).effect("bounce", "slow" );
					
	        		// Contenu du modal
	        		$("<div/>",{class:"thumbnail inmodal"}).appendTo($(".mymodal"));
	        		$(this).clone().appendTo($(".inmodal"));
	        		$("<h4/>").text(data.items[i].title).appendTo(".mymodal");
	        		var author = data.items[i].author.split("(");
					author = author[1].split(")");
	        		$("<p/>").html(author[0]+" <a href='#'>(Voir son profil)</a>").appendTo($(".mymodal"));
	        		$("<p/>").text("Photo prise le "+data.items[i].date_taken).appendTo($(".mymodal"));
					
					$("<button/>", {type:"button", class:"btn btn-success btn-lg", id:"like"}).appendTo(".mymodal");
					$("<span/>", {class:"glyphicon glyphicon-thumbs-up", "aria-hiden":"true"}).appendTo("#like");

					$("<button/>", {type:"button", class:"btn btn-danger btn-lg", id:"dislike"}).appendTo(".mymodal");
					$("<span/>", {class:"glyphicon glyphicon-thumbs-down", "aria-hiden":"true"}).appendTo("#dislike");

					$("#like").click(function() {
						$("#like").effect("transfer",{ to: $("#fav")}, 1000);
						$("#fav").delay(900).effect("highlight", "slow");
						$(".badge").text(parseInt($(".badge").text())+1+"");
						$("#like").attr("disabled", "disabled");
						swal("Super!", "L'image a été rajoutée dans vos favoris!", "success")
						$(".mymodal").effect("fade", "slow");
					});	

					$("#dislike").click(function() {
						swal({
						  title: "Etes-vous sûr?",
						  text: "Vous ne pourrez plus ajouter cette image dans vos favoris!",
						  type: "warning",
						  showCancelButton: true,
						  confirmButtonClass: "btn-danger",
						  confirmButtonText: "Oui! Je n'aime pas cette image!",
						  cancelButtonText: "Non, je veux annuler mon vote!",
						  closeOnConfirm: false,
						  closeOnCancel: false
						},
						function(isConfirm) {
						  if (isConfirm) {
						    swal("Votre vote a été pris en compte.");
						  } 
						  else {
						    swal("Annulé!", "Votre vote n'a pas été pris en compte :)", "error");
						  }
						});
						$(".mymodal").effect("explode", "slow");
					});	

					// Fermeture du modal
					$(".close").click(function() {
						$("#bg").css('opacity', 1);
						$(".mymodal").effect("fade", "slow");
					});
				});
        	}

        	else {
				$(".pages").remove();
				$(".carousel").remove();
				$("<div/>",{class:"carousel"}).appendTo(".row");
				$.each(data.items, function(i,item) {
	        		
	        		$("<img/>",{alt:"image"+i, id:""+i, style:"width:300px; height:300px"}).attr("src", item.media.m).appendTo($("<li/>").appendTo(".carousel"));
	         	});

	         	$("<script/>",{src:"external/slick/slick.min.js"}).appendTo("body");

				$('.carousel').slick({
				  dots: true,
				  infinite: false,
				  speed: 300,
				  slidesToShow: 3,
				  slidesToScroll: 3,
				  responsive: [
				    {
				      breakpoint: 1024,
				      settings: {
				        slidesToShow: 3,
				        slidesToScroll: 3,
				        infinite: true,
				        dots: true
				      }
				    },
				    {
				      breakpoint: 600,
				      settings: {
				        slidesToShow: 2,
				        slidesToScroll: 2
				      }
				    },
				    {
				      breakpoint: 480,
				      settings: {
				        slidesToShow: 1,
				        slidesToScroll: 1
				      }
				    }]
				});
        	}
        	
        });

		
	}); // fin submit

	$("#typeAffiche").click(function() {
		
		if ($(this).find("img").attr('id')=="list") {
			$("#nbPhotos").prop('disabled', true);
			$("#list").remove();
			$("<img/>",{id:"carousel",src:"img/carousel.png"}).appendTo("#typeAffiche");
		}
		else {
			$("#nbPhotos").prop('disabled', false);
			$("#carousel").remove();
			$("<img/>",{id:"list",src:"img/list.png"}).appendTo("#typeAffiche");
		}
	});

	$(function() {
		$( "#datepicker" ).datepicker();
	});

	// Connexion via des boutons sociaux
	$("#connexion").click(function() {
		$(".mymodal").remove();
		$("#modal_connexion").remove();
		$("<div/>", {class:"well mymodal", id:"modal_connexion"}).html("<button id='modal_connexion_close' type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>").appendTo($("#modal"));
		$("#modal_connexion_close").click(function() {
			$("#modal_connexion").effect("fade", "slow");
		});
		$("<h3/>").text("Veillez vous connecter via l'un des sites suivants").appendTo("#modal_connexion");
		$("<a/>", {class:"btn btn-block btn-social btn-flickr"}).html("<i class='fa fa-flickr'></i> Sign in with Flickr").appendTo("#modal_connexion");
		$("<a/>", {class:"btn btn-block btn-social btn-facebook"}).html("<i class='fa fa-facebook'></i> Sign in with Facebook").appendTo("#modal_connexion");
		$("<a/>", {class:"btn btn-block btn-social btn-twitter"}).html("<i class='fa fa-twitter'></i> Sign in with Twitter").appendTo("#modal_connexion");
		$("<a/>", {class:"btn btn-block btn-social btn-tumblr"}).html("<i class='fa fa-tumblr'></i> Sign in with Tumblr").appendTo("#modal_connexion");
	});

})
