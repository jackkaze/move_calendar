<header class="header center">
  <p class="site-title-sub"><?php echo $this->lang->line('common_title_login');?></p>
  <div class="row margintop50 center">
    <div class="col-2"></div>
    <div class="col-8">
      <input class="form-control form-control-lg" type="text" placeholder="<?php echo $this->lang->line('common_input_account_placeholder_2');?>" name="account" id="account">
    </div>
    <div class="col-2"></div>
    <div class="col-2"></div>
    <div class="col-8 margintop10">
      <input class="form-control form-control-lg" type="password" placeholder="<?php echo $this->lang->line('common_input_password_placeholder_2');?>" name="password" id="password">
    </div>
    <div class="col-2"></div>
    <div class="col-2"></div>
    <div class="col-8 margintop10">
      <button type="submit" class="btn btn-primary btn-lg" id="login"><?php echo $this->lang->line('common_button_login');?></button>
    </div>
    <div class="col-2"></div>
  </div>
</header>
<script>
$( function() {
  var csrf_token_name = 'csrf_token_name='+"<?php echo $csrf;?>";
  var query_string = csrf_token_name;
  var show_message = 'error';
  $("#login").click(function(e) {
    var login_obj = $(this);
    login_obj.attr('disabled', true);
    query_string += '&account='+$("#account").val()+'&password='+$("#password").val();
    $.post( "<?php echo LOCATION_HREF_LOGIN_SSO;?>", query_string, function( data ) {
      console.log(JSON.stringify(data));
      if(data.message){
        show_message = data.message;
      }
      $("p#alert_msg").html(show_message);
      if($("#AlertModal").modal('show')){
        $('#AlertModal').on('hidden.bs.modal', function (e) {
          if(data.status == 'success'){
            location.href = "<?php echo LOCATION_HREF_HOME;?>";
          }
          else if(data.status == 'permission_denied'){
            location.href = "<?php echo LOCATION_HREF_HOME;?>";
          }
        })
      }
    }, "json")
    .fail(function(xhr, status, error) {
      console.log(xhr.responseText);
      console.log(status);
      console.log(error);
    })
    .always(function() {
      login_obj.attr('disabled', false);
    });
  })
})
</script>