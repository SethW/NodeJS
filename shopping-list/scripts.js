jQuery(document).ready(function($){
   
    var root_url = "http://localhost:9000/";
    
    $(".delete").on("click", function(e){
        e.preventDefault();
        
        var id = $(this).parent().attr("id");
        
        $.ajax({
             url: root_url+id,
             type: 'DELETE',
             success: function(response) { console.log('PUT completed'+response); }
         });
    });
    
    $(".modify").on("click", function(e){
        e.preventDefault();
        var old_data = $(this).parent().children("span").html();
        var id = $(this).parent().attr("id");
        var old_content = $(this).parent().html();
        $(this).parent().html('<form action="" class="modifyForm" data-item-id="'+id+'"><input type="text" name="item" class="modifyInput" value="'+old_data+'"></form>');
        
        $(".modifyForm").submit(function(e){
            e.preventDefault();
            var id = $(this).attr("data-item-id");
            var value = $(this).children(".modifyInput").val();
            
            $.ajax({
                 url: root_url+id,
                 type: 'PUT',
                 data: {item: value},
                 success: function(response) { console.log('PUT completed'+response); }
             });
        });
    });
    
    
});