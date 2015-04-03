$(document).ready(function(){
	$("#commune").autocomplete({
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
	});
	

	$('#recherche').submit(function(e) {
		e.preventDefault();
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags="+$("#commune").val()+"&tagmode=any&format=json&jsoncallback=?",
        function(data) {
        	console.log(data);
        	$(".col-sm-6").remove();

        	/*$.each(data.items, function(i,item) {
        		$("<div/>",{class:"col-sm-6 col-md-4", id:""+i}).appendTo($(".row"));
        		$("<div/>",{class:"thumbnail"}).appendTo($("#"+i));
        		$("<img/>").attr("src", item.media.m).appendTo($("#"+i).find(".thumbnail"));     		                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            	
            	if ( i == $("#nbPhotos").val()-1) return false;
            	
         	});*/
         	var nbPhotos = $("#nbPhotos").val();
         	var nbPhotosTotal = data.items.length;

            	if (nbPhotosTotal > nbPhotos) {
            		$(".pages").remove();
            		$("<nav/>", {class:"pages"}).appendTo($("#bg"));
            		$("<ul/>", {class:"pagination"}).appendTo($(".pages"));
            		
            		if (nbPhotos == 1) {
            			var nbPages = Math.floor(nbPhotosTotal/nbPhotos);
            		}
            		else {
            			var nbPages = Math.floor(nbPhotosTotal/nbPhotos)+1;
            		}

            		var debut = 0;
            		for (var i=0; i<nbPages; i++) {
            			$("<li/>", {id:"li"+i}).appendTo($(".pagination"));
            			$("<a/>", {href:"#"}).text(""+(i+1)).appendTo("#li"+i);
            			$("#li"+i).click(function(){
            				$(".col-sm-6").remove();
            				for(var i=debut; i<=debut+nbPhotos; i++) {
            					$("<div/>",{class:"col-sm-6 col-md-4", id:""+i}).appendTo($(".row"));
        						$("<div/>",{class:"thumbnail"}).appendTo($("#"+i));
        						$("<img/>").attr("src", data.items[i].media.m).appendTo($("#"+i).find(".thumbnail"));   
            				}
            			});
            			debut = debut+nbPhotos;
            		}
            	}


		


        	$("img").click(function() {
        		/* Création et affichage du modal */

        		i = $(this).parent().parent().attr('id');
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
				$("<div/>",{id:'modaltest',class:'col-md-9 col-md-push-3'}).css({'display':'inline-block','float':'left','position':'absolute','z-index': '100', 'top':'60%',"background-color":"#D2D7D3"}).appendTo($(this).parent());
				$("<h4/>").text(data.items[i].title).appendTo("#modaltest");
        		$("<p/>").text(data.items[i].author).appendTo($("#modaltest"));
        		$( "#modaltest" ).effect( "slide", "slow" );

				$(this).parent().css({'z-index':'99'});
        		/* Opacité */
				/*$("#bg").css({
					'opacity':'0.4',
				});

				$(".close").click(function() {
					$("#bg").css('opacity', 1);
					$( ".mymodal" ).effect( "drop", "slow" );
				});*/
			});
        });
	})
})

