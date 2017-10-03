function CopyMaterialDroplist( event, name, id )
{
    if( $('.sourceMaterialDroplist').length>0 ){


        //給input[text]用的name, id
        var input_name = name ? name : "material_id[]";
        var input_id   = id ? id : "material_id";

        //取得元素
        var $this   = $(event.target);
        var $source = $this.parents('.sourceMaterialDroplist');
        var $length = $source.find('.form-group').length;

        //只複製第1個元素並移除多餘的事件按鈕
        var $tpl = $source.find('.form-group:eq(0)').clone();
            //$tpl.find('.copyButton').remove();
            $tpl.find('.copyButton').find("span.glyphicon-plus").addClass("glyphicon-remove");
            $tpl.find('.copyButton').attr("onclick",'deleteMaterial(event)');
            $tpl.find('.copyButton').find("span.glyphicon-plus").removeClass( "glyphicon-plus");
            $tpl.find('label').html("");
            $tpl.find('input[type="text"]').attr({ 'name': input_name, 'id': input_id + '_' + $length });

        //被複製元素放入指定區塊
        var $append = $source.append( '\n<div class="form-group">' + $tpl.html() + '</div>' );

        // console.clear();
        // console.log( $this );
        return;
    }
}
function deleteMaterial(event){
  var $this   = $(event.target);
  var $source = $this.parent().parent().parent();
  $source.remove();

}
$(function(){

    $('#cmpModal').on('show.bs.modal', function (event) {
        $('#cmpdata tr.cmpselrow').remove();   
          var button = $(event.relatedTarget); // Button that triggered the modal
          var recipient = button.data('whatever'); // Extract info from data-* attributes
          var modal = $(this);
          modal.find('input[name="set"]').val(recipient);
          // alert(recipient);
          
    });
    
    $( "#cmp_search" ).click(function() {
                     
                    var str = "search_word="+ $( "#cmp_word" ).val()+"&csrf_token_name=" + "<?=$this->security->get_csrf_hash()?>";
                    $.post( "<?php echo site_url("cue_order/search_customer"); ?>", str, function( data ) {

                        if(data.data==false){
                            $("#cmpdata").html("");
                            $("#cmpnodata").show();

                        }else{
                          var cdata = data.data;
                          var html = '';

                          for(var i = 0; i < cdata.length; i++){
                              html += '<tr id="'+ cdata[i].c_id +'" class="cmpselrow"><td class="row1">' + cdata[i].short_name + '</td><td>' + cdata[i].c_name + '</td></tr>';
                          }
                          $('#cmpdata tr.cmpselrow').remove();
                          $('#cmpdata tr:last').after(html);
                          var set = $("#set").val();
                          // alert(set);
                          // $("#cmpdata").html(html);
                          $(".cmpselrow").click(function() {
                              var cid =$(this).attr("id");
                              $("#"+set).val(cid);
                              var name = $(this).find(".row1").text();
                              $("#"+set+"_name").val(name);
                              $('#cmpModal').modal('toggle');
                          });
                          $("#cmpnodata").hide();



                        }
                           
                    }, "json");                 
    });

    $('#adModal').on('show.bs.modal', function (event) {   
   
          $(".adfield").removeClass("adfield");
          var button = $(event.relatedTarget); 
          console.log(button);
          button.parent().parent().addClass("adfield");

    });

    $( "#ad_search" ).click(function() {
                        
                        var str = "search_word="+ $( "#ad_word" ).val()+"&csrf_token_name=" + "<?=$this->security->get_csrf_hash()?>";
                        $.post( "<?php echo site_url("cue_order/search_material"); ?>", str, function( data ) {

                            if(data.data==false){
                                $('#addata tr.adselrow').remove();
                                $("#adnodata").show();

                            }else{
                              var cdata = data.data;
                              var html = '';

                              for(var i = 0; i < cdata.length; i++){
                                  html += '<tr id="'+ cdata[i].m_no +'" class="adselrow"><td class="row1">' + cdata[i].m_name + '</td><td>' + cdata[i].m_no + '</td></tr>';
                              }
                              // $("#addata").html(html);
                              $('#addata tr.adselrow').remove();
                              $('#addata tr:last').after(html);
                              $(".adselrow").click(function() {
                                  var cid =$(this).attr("id");
                                  $(".adfield").find(".m_no").val(cid);
                                  var name = $(this).find(".row1").text();
                                  $(".adfield").find(".m_name").val(name);
                                  $('#adModal').modal('toggle');
                              });
                              //$("#adnodata").hide();



                            }
                               
                        }, "json");                 
                });

    $("#sell_type").change(function(){
        // alert($(this).val());
        if($(this).val()=="3")
            $("#proj_type").show();
        else
            $("#proj_type").hide();

    });
    $("#add_AD").click(function(){
        $(".error_msg").html("");
        $( "input" ).removeClass( "error-validated" );
        var str = $( "#add_form" ).serialize();
        $.post( "<?php echo site_url("cue_order/js_add"); ?>", str, function( data ) {

            if(data.success){
               alert("更新成功!!");
               location.href = "<?php echo site_url("cue_order/index");?>";
               
            }
            else {                
                var field = data.msg;
                
                for (var key in field) {                    
                    //console.log(key + ":" + field[key]);                  
                    $("#msg_" + key).html(field[key]);
                    $("input[name=" + key + "]").addClass("error-validated");
                                       
                }   
            }  
               
        }, "json");    


    });

});