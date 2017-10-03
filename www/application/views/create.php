<header class="header center">
  <p class="site-title-sub"><?php echo $this->lang->line('common_title_sub_guest_add');?></p>
  <div class="row margintop50">
    <div class="col-5 col-sm-4 right">
      <?php echo $this->lang->line('common_input_name_required');?>
    </div>
    <div class="col-7 col-sm-4">
      <input class="form-control form-control-lg" type="text" placeholder="<?php echo $this->lang->line('common_input_name_placeholder');?>" id="name">
    </div>
  </div>
  <div class="row margintop10">
    <div class="col-5 col-sm-4 right">
      <?php echo $this->lang->line('common_input_price_required');?>
    </div>
    <div class="col-7 col-sm-4">
      <input class="form-control form-control-lg add_price" type="number" placeholder="<?php echo $this->lang->line('common_input_price_placeholder');?>" id="price">
    </div>
  </div>
  <div class="row margintop10">
    <div class="col-4"></div>
    <div class="col-4 center">
      <button type="submit" class="btn btn-primary btn-lg save"><?php echo $this->lang->line('common_button_save');?></button>
    </div>
    <div class="col-4"></div>
  </div>
</header>
<script>
$( function() {
  var csrf_token_name = 'csrf_token_name='+"<?php echo $csrf;?>";
  var query_string = csrf_token_name;
  $(".save").click(function(e) {
    var save_obj = $(this);
    save_obj.attr('disabled', true);
    query_string += '&name='+$("#name").val()+'&price='+$("#price").val();
    $.post( "<?php echo LOCATION_HREF_GUEST_ADD;?>", query_string, function( data ) {
      console.log(JSON.stringify(data));
      if(data.status == 'success'){
        alert(data.message);
        location.reload();
      }
      else if(data.status == 'failed'){
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
  $(".add_price").keyup(function(e) {
    $(this).val($(this).val().substring(0, 6));
  })
})
</script>