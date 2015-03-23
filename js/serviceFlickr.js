$(document).ready(function(){
	var commune = [];
	$("#commune").autocomplete({
		minLength:3,
		source: function(request, response){
			$.ajax({
				url:"http://infoweb-ens/~jacquin-c/codePostal/commune.php",
				type:'POST',
				dataType:'json',
				data:{"commune":$("#commune").val()},
				success:function(data){
					commune=[];
					if(data) {
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
	

	$('.recherche').submit(function(e){
		e.preventDefault();
	})
})