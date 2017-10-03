  <header class="header center">
    <p class="site-title-sub"><?php echo $this->lang->line('common_title_sub_memo');?></p>
    <div class="row margintop50 center">
      <div class="col-12">
        <textarea type="text" class="base-textarea" id="memo" name="memo" placeholder="<?php echo $this->lang->line('common_memo_placeholder');?>" value=""></textarea>
      </div>
      <div class="col-12">
        <button type="submit" class="btn btn-primary btn-lg " id="save"><?php echo $this->lang->line('common_button_save');?></button>
        <input type="hidden" name="csrf_token_name" value="<?php echo $csrf;?>">
      </div>
    </div>
  </header>
  <div class="row marginbottom50">
<?php
  if(isset($memo_list['count']) && $memo_list['count'] > 0)
  {
    foreach($memo_list['data'] as $key => $array)
    {
?>
    <div class="col-2 right" title="<?php echo $array['sn'];?>"><?php echo ($key+1);?>.</div>
    <div class="col-7"><?php echo nl2br($array['memo']);?></div>
    <div class="col-3 left"><?php echo $array['create_date'];?></div>
<?php
    }
  }
?>
  </div>
<script>
  $( function() {
    var csrf_token_name = 'csrf_token_name='+"<?php echo $csrf;?>";
    var query_string = csrf_token_name;
    $("#save").click(function(e) {
      var save_obj = $(this);
      save_obj.attr('disabled', true);
      query_string += '&memo='+$("#memo").val();
      $.post( "<?php echo LOCATION_HREF_MEMO_ADD;?>", query_string, function( data ) {
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