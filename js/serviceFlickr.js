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
<<<<<<< HEAD
					var commune=[];
					if(data){
=======
					commune=[];
					if(data) {
>>>>>>> ff5c18fc9f2df34246f373a9e496f6f49b8ce01e
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
	

	$('#recherche').submit(function(e){
		e.preventDefault();
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags="+$("#commune").val()+"&tagmode=any&format=json&jsoncallback=?",
        function(data){
        	console.log(data);
          $.each(data.items, function(i,item){

            $("<img/>").attr("src", item.media.m).appendTo(".container");
            if ( i == 6 ) return false;
          });
        });
	})
})