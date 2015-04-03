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
        	$.each(data.items, function(i,item) {
        		$("<div/>",{class:"col-sm-6 col-md-4", id:""+i}).appendTo($(".row"));
        		$("<div/>",{class:"thumbnail"}).appendTo($("#"+i));
        		$("<img/>", {onclick:"test"}).attr("src", item.media.m).appendTo($("#"+i).find(".thumbnail"));
        		
        		
            	if ( i == $("#nbPhotos").val()-1) return false;
          });
        });
	})
	function test() {
    	alert('test');
    	return true;
    }
})
