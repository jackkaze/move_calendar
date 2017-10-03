<style>
ul.ui-autocomplete { max-height: 150px !important; overflow: auto !important; }
</style>
<div class="row margintop40bottom30">
  <div class="col-1 col-lg-2">
  </div>
  <div class="col-6 col-sm-6 col-lg-6">
    <input class="form-control form-control-lg" type="text" placeholder="<?php echo $this->lang->line('common_guest_keyword_placeholder');?>" name="search_guest_name" id="search_guest_name">
    <input type="hidden" name="search_sn" id="search_sn">
    <input type="hidden" name="csrf_token_name" value="<?php echo $csrf;?>">
  </div>
  <div class="col-2 col-lg-1">
    <button type="button" id="search" class="btn btn-success btn-lg right"><?php echo $this->lang->line('common_button_search');?></button>
  </div>
  <div class="col-1 col-lg-3">
    <button type="button" id="clear" class="btn btn-warning btn-lg left"><?php echo $this->lang->line('common_button_clear');?></button>
  </div>
</div>
<?php
  if(isset($guest_list['count']) && $guest_list['count'] > 0)
  {
    foreach($guest_list['data'] as $key => $array)
    {
?>
<div class="row marginbottom50" id="<?php echo $array['sn'];?>">
  <div class="col-4 col-sm-4 right">
   <?php echo $array['name'];?>
  </div>
  <div class="col-4 col-sm-4">
    <input class="form-control form-control-lg add_price" type="number" placeholder="<?php echo $this->lang->line('common_guest_price_placeholder');?>" id="add_price_<?php echo $array['sn'];?>"  value="<?php echo $array['price'];?>">
  </div>
  <div class="col-4 col-sm-4">
    <button type="button" class="btn btn-primary btn-lg save" data-sn="<?php echo $array['sn'];?>"><?php echo $this->lang->line('common_button_save');?></button>
  </div>
</div>
<?php
    }
  }
?>
<script>
$( function() {
  var csrf_token_name = 'csrf_token_name='+"<?php echo $csrf;?>";
  var query_string = csrf_token_name;
  $(".save").each(function(i) {
    $(this).click(function(e) {
      var save_obj = $(this);
      save_obj.attr('disabled', true);
      query_string += '&sn='+$(this).data("sn")+'&price='+$("#add_price_"+$(this).data("sn")).val();
      $.post( "<?php echo LOCATION_HREF_GUEST_UPDATE;?>", query_string, function( data ) {
        console.log(JSON.stringify(data));
        if(data.status == 'success' || data.status == 'failed'){
          alert(data.message);
        }
        else if(data.status == 'relogin'){
          alert(data.message);
          location.href = "<?php echo LOCATION_HREF_LOGIN;?>";
        }
        else if(data.status == 'permission_denied'){
          location.href = "<?php echo LOCATION_HREF_HOME;?>";
        }
        else{
          alert("<?php echo $this->lang->line('common_data_error');?>");
        }
      }, "json")
      .fail(function(xhr, status, error) {
        console.log(xhr.responseText);
        console.log(status);
        console.log(error);
      })
      .always(function() {
        save_obj.attr('disabled', false);
      });
    })
  });
  var guest_data = <?php echo $guest_list_json;?>;
  $( "#search_guest_name" ).autocomplete({
    minLength: 0,
    source: guest_data,
    focus: function( event, ui ) {
      $( "#search_guest_name" ).val( ui.item.label );
      $( "#search_sn" ).val( ui.item.value );
      return false;
    },
    select: function( event, ui ) {
      $( "#search_guest_name" ).val( ui.item.label );
      $( "#search_sn" ).val( ui.item.value );

      return false;
    }
  }).focus(function() {$(this).autocomplete("search", "");});
})
$("#search").click(function(e) {
  if($( "#search_guest_name" ).val() != ''){
    $(".marginbottom50").hide();
    $("#"+$( "#search_sn" ).val()).show();
  }
  else{
    $(".marginbottom50").show();
  }
  return false;
});
$("#clear").click(function(e) {
  $( "#search_guest_name" ).val("");
  $( "#search_sn" ).val("");
});
$(".add_price").each(function(i) {
  $(this).click(function(e) {
    $(this).select();
  });
});
</script>