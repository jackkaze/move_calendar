<header class="header center">
  <p class="site-title-sub"><?php echo $this->lang->line('common_title_sub_account');?></p>
  <div class="row margintop50">
    <div class="col-5 col-sm-4 right">
      <?php echo $this->lang->line('common_input_account_required');?>
    </div>
    <div class="col-7 col-sm-4">
      <input class="form-control form-control-lg" type="text" placeholder="<?php echo $this->lang->line('common_input_account_placeholder');?>" id="account">
    </div>
  </div>
  <div class="row margintop10">
    <div class="col-5 col-sm-4 right">
      <?php echo $this->lang->line('common_input_password_required');?>
    </div>
    <div class="col-7 col-sm-4">
      <input class="form-control form-control-lg" type="password" placeholder="<?php echo $this->lang->line('common_input_password_placeholder');?>" id="password">
    </div>
  </div>
  <div class="row margintop10">
    <div class="col-5 col-sm-4 right">
      <?php echo $this->lang->line('common_input_confirm_password_required');?>
    </div>
    <div class="col-7 col-sm-4">
      <input class="form-control form-control-lg" type="password" placeholder="<?php echo $this->lang->line('common_input_confirm_password_placeholder');?>" id="password_confirm">
    </div>
  </div>
  <div class="row margintop10">
    <div class="col-5 col-sm-4 right">
      <?php echo $this->lang->line('common_input_type_required');?>
    </div>
    <div class="col-7 col-sm-4">
      <select class="form-control" name="type" id="type">
        <option value="2">高級會員</option>
        <option value="3">一般會員</option>
        <option value="4" selected>訪客</option>
      </select>
    </div>
  </div>
  <div class="row margintop10">
    <div class="col-4"></div>
    <div class="col-4 center">
      <button type="submit" class="btn btn-primary btn-lg save"><?php echo $this->lang->line('common_create_account');?></button>
    </div>
    <div class="col-4"></div>
  </div>
</header>
<script>
$( function() {
  var message = '';
  var csrf_token_name = 'csrf_token_name='+"<?php echo $csrf;?>";
  var query_string = csrf_token_name;
  $(".save").click(function(e) {
    var save_obj = $(this);
    save_obj.attr('disabled', true);
    query_string += '&account='+$("#account").val()+'&password='+$("#password").val()+'&password_confirm='+$("#password_confirm").val()+'&type='+$("#type").val();
    $.post( "<?php echo LOCATION_HREF_ACCOUNT_ADD;?>", query_string, function( data ) {
      console.log(JSON.stringify(data));
      $.each(data.message, function (key, value) {
        message += value+'\n\n';
      })
      if(data.status == 'success'){
        alert(message);
        location.reload();
      }
      else if(data.status == 'failed'){
        alert(message);
      }
      else if(data.status == 'relogin'){
        alert(message);
        location.href = "<?php echo LOCATION_HREF_LOGIN;?>";
      }
      else if(data.status == 'permission_denied'){
        location.href = "<?php echo LOCATION_HREF_HOME;?>";
      }
      else{
        alert("<?php echo $this->lang->line('common_data_error');?>");
      }
      message = '';
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
})
</script>