$(document).ready(function(){
	/*$("#commune").autocomplete({
		minLength:3,
		source: function(request, response){
			$.ajax({
				url:"http://infoweb-ens/~jacquin-c/codePostal/commune.php",
				type:'POST',
				dataType:'json',
				data:{"commune":$("#commune").val()},
				success:function(data){
					var commune=[];
					if(data){
						$.each(data,function(i){
							commune[i]=data[i].Ville;
						});
						response(commune);
					}				
				},
	
				error:function(data, status, err){
					alert("error"+err);
				}
			})
		},
	});*/
	

	$('#recherche').submit(function(e) {
		e.preventDefault();
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags="+$("#commune").val()+"&tagmode=any&format=json&jsoncallback=?",
        function(data) {
        	//console.log(data.items);
        	$(".col-sm-6").remove();

        	
        	
        	if ($("#tri").val() == "auteur_az") {
        		data.items.sort(function(a,b){
        			var a1 = a.author.toLowerCase();
        			var b1 = b.author.toLowerCase();
        			return ((a1<b1)?-1:((a1>b1)?1:0));
        		});
        	}
        	else if($("#tri").val() == "auteur_za") {
        		data.items.sort(function(a,b){
        			var a1 = a.author.toLowerCase();
        			var b1 = b.author.toLowerCase();
        			return ((a1>b1)?-1:((a1<b1)?1:0));
        		});
        	}
        	else if($("#tri").val() == "photo_az") {
        		data.items.sort(function(a,b){
        			var a1 = a.title.toLowerCase();
        			var b1 = b.title.toLowerCase();
        			return ((a1<b1)?-1:((a1>b1)?1:0));
        		});
        	}
        	else if($("#tri").val() == "photo_za") {
        		data.items.sort(function(a,b) {
        			var a1 = a.title.toLowerCase();
        			var b1 = b.title.toLowerCase();
        			return ((a1>b1)?-1:((a1<b1)?1:0));
        		});
        	}
        	else if($("#tri").val() == "recent") {
        		data.items.sort(function(a,b){
        			var a1 = Date.parse(a.published);
        			var b1 = Date.parse(b.published);
        			return ((a1<b1)?-1:((a1>b1)?1:0));
        		});
        	}
        	else {
        		data.items.sort(function(a,b){
        			var a1 = Date.parse(a.published);
        			var b1 = Date.parse(b.published);
        			return ((a1>b1)?-1:((a1<b1)?1:0));
        		});
        	}
			
        	


        	if ($("#datepicker").val()) {
        		var date = $("#datepicker").val().split("/").reverse();
        		data.items = jQuery.grep(data.items, function(item) {
        			return Date.parse(item.published)>Date.parse(date[0]+"-"+date[2]+"-"+date[1]);
        		});
        	}
        	console.log(data.items);

        	

        	//console.log(tri);

        	if($("#typeAffiche").find("img").attr('id')=="list"){

        		$(".wapper").remove();

        		$.each(data.items, function(i,item) {
	        		$("<div/>",{class:"col-sm-6 col-md-4", id:""+i}).appendTo($(".row"));
	        		$("<div/>",{class:"thumbnail"}).appendTo($("#"+i));
	        		$("<img/>").attr("src", item.media.m).appendTo($("#"+i).find(".thumbnail"));     		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
	            	
	            	if ( i == $("#nbPhotos").val()-1) return false;
	            	
	         	});

	         	var nbPhotos = parseInt($("#nbPhotos").val());
	         	var nbPhotosTotal = data.items.length;

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

	            		for (var i=0; i<nbPages; i++) {
	            			$("<li/>", {id:"li"+i}).appendTo($(".pagination"));
	            			$("<a/>", {href:"#"}).text(""+(i+1)).appendTo("#li"+i);
	            			
	            			$("#li"+i).click(function(){
	            				$(".col-sm-6").remove();
	            				var page = $(this).index();
	            				var debut = page*nbPhotos;
	            				var fin = debut + nbPhotos;

	            				for (var j=debut; j<fin; j++) {
	            					if(j==nbPhotosTotal)break;
	            					$("<div/>",{class:"col-sm-6 col-md-4", id:""+j}).appendTo($(".row"));
	        						$("<div/>",{class:"thumbnail"}).appendTo($("#"+j));
	        						$("<img/>",{id:"image"+j}).attr("src", data.items[j].media.m).appendTo($("#"+j).find(".thumbnail"));

	        						$("#image"+j).click(function(){
	        							i = $(this).parent().parent().attr('id');
	        							$("#modaltest").remove();
										$("<div/>",{id:'modaltest',class:'col-md-9 col-md-push-3'}).css({'position':'absolute', 'margin':'0' , 'left':'0', 'bottom':'0', 'width':'240px', "background-color":"#D2D7D3","opacity":"0.8"}).appendTo($(this).parent());
										$("<h4/>").text(data.items[i].title).appendTo("#modaltest");
										var author = data.items[i].author.split("(");
											author = author[1].split(")");
						        		$("<p/>").text("Auteur : "+author[0]).appendTo($("#modaltest"));
						        		$( "#modaltest" ).effect( "slide", "slow" );

										//$(this).parent().css({'z-index':'99'});
	        						})
	            				}	
	            			});
	            			
	            		}

	            		
	            	}

	        	$("img").click(function() {
	        		/* Création et affichage du modal */

	        		i = $(this).parent().parent().attr('id');
	        		//alert("click");
	        		/*$(".mymodal").remove();
	        		// La croix
	        		$("<div/>", {class:"alert alert-default mymodal", "role":"alert"}).appendTo($("#modal"));
	        		$("<button/>", {type:"button", class:"close"}).appendTo($(".mymodal"));
	        		$("<span/>", {"aria-hiden":"true"}).html("&times;").appendTo($(".mymodal").find("button"));
	        		
					$( ".mymodal" ).effect( "slide", "slow" );
					
	        		// L'image
	        		$(this).clone().appendTo($(".mymodal"));
	        		$("<h4/>").text(data.items[i].title).appendTo(".mymodal");
	        		$("<p/>").text(data.items[i].author).appendTo($(".mymodal"));
	        		$("<p/>").text("Photo prise le "+data.items[i].date_taken).appendTo($(".mymodal"));
					*/

					$("#modaltest").remove();
					$("<div/>",{id:'modaltest',class:'col-md-9 col-md-push-3'}).css({'position':'absolute', 'margin':'0' , 'left':'0', 'bottom':'0', 'width':'240px', "background-color":"#D2D7D3","opacity":"0.8"}).appendTo($(this).parent());
					$("<h4/>").text(data.items[i].title).appendTo("#modaltest");
					var author = data.items[i].author.split("(");
						author = author[1].split(")");
					$("<p/>").text("Auteur : "+author[0]).appendTo($("#modaltest"));
					$( "#modaltest" ).effect( "slide", "slow" );
	        		/* Opacité */
					/*$("#bg").css({
						'opacity':'0.4',
					});

					$(".close").click(function() {
						$("#bg").css('opacity', 1);
						$( ".mymodal" ).effect( "drop", "slow" );
					});*/
				});
        	}else{
        		/*
        	<div class="jcarousel-wrapper">
                <div class="jcarousel">
                    <ul>
                        <li><img src="../_shared/img/img1.jpg" alt="Image 1"></li>
                        <li><img src="../_shared/img/img2.jpg" alt="Image 2"></li>
                        <li><img src="../_shared/img/img3.jpg" alt="Image 3"></li>
                        <li><img src="../_shared/img/img4.jpg" alt="Image 4"></li>
                        <li><img src="../_shared/img/img5.jpg" alt="Image 5"></li>
                        <li><img src="../_shared/img/img6.jpg" alt="Image 6"></li>
                    </ul>
                </div>

                <a href="#" class="jcarousel-control-prev">&lsaquo;</a>
                <a href="#" class="jcarousel-control-next">&rsaquo;</a>
			*/
				$(".pages").remove();
				$(".wapper").remove();
				$("<ul>",{id:"carouselUl"}).appendTo($("<div/>",{class:'jcarousel'}).appendTo($("<div/>",{class:'jcarousel-wrapper'}).appendTo($("<div/>",{class:"wapper"}).appendTo(".row"))));
				$.each(data.items, function(i,item) {
	        		
	        		$("<img/>",{alt:"image"+i}).attr("src", item.media.m).appendTo($("<li/>").appendTo("#carouselUl"));
	        		
	            	
	         	});
	         	$("<a/>",{href:"#", class:"jcarousel-control-prev"}).html("&lsaquo;").appendTo(".jcarousel-wrapper");
	         	$("<a/>",{href:"#", class:"jcarousel-control-next"}).html("&rsaquo;").appendTo(".jcarousel-wrapper");
	         	$("<p/>",{class:"jcarousel-wrapper"}).appendTo($(".jcarousel-wrapper"));
	         	$("<script/>",{src:"js/jquery.jcarousel.min.js"}).appendTo("body");
	         	$("<script/>",{src:"js/jcarousel.responsive.js"}).appendTo("body");
	         	
	         	

        	}
        	
        });
	});

	$("#typeAffiche").click(function(){
		
		if($(this).find("img").attr('id')=="list"){
			$(".nnbPhotos").css({"display":"none"});
			$("#nbPhotos").css({"display":"none"});
			$("#list").remove();
			$("<img/>",{id:"carousel",src:"img/carousel.png"}).appendTo("#typeAffiche");
		}else{
			$(".nnbPhotos").css({"display":"block"});
			$("#nbPhotos").css({"display":"block"});
			$("#carousel").remove();
			$("<img/>",{id:"list",src:"img/list.png"}).appendTo("#typeAffiche");
		}
	});

	$(function() {
		$( "#datepicker" ).datepicker();
	});
})

