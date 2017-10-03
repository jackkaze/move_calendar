$(function () {
  $(".game_select").select2({
      placeholder: "請選擇",
      data : [{id : $("#selected_game").val(), text: $("#selected_game_name").val()}],
      ajax: {
        url: '/api/search_game',
        processResults: function (data) {
          return {
            results: data
          };
        },data: function (params) {

            var queryParameters = {
                term: params.term,
               // agent : $("#agent").val(),
                select: $("#selected_game").val()
            }
            return queryParameters;
        },
      },
      allowClear : true,
      delay: 250,
      minimumInputLength: 0,
      language: "zh-TW",
    });
  $(".game_select").val($("#selected_game").val());
    $(".game_select").trigger('change');


  $(".game_select").change(function(){
     var data = $('.game_select').select2('data');
     console.log(data[0].text);
     $("#selected_game_name").val(data[0].text);
     
    
    // $('.material_select').val(''); 
    // $('.material_select').trigger('change'); 
    
  });

  $(".agent_select").select2({
      placeholder: "請選擇",
      data : [{id : $("#selected_agent").val(), text: $("#selected_agent_name").val()}],
      ajax: {
        url: '/api/search_agent',
        processResults: function (data) {
          return {
            results: data.data
          };
        },data: function (params) {

            var queryParameters = {
                term: params.term,
               // agent : $("#agent").val(),
                select: $("#selected_agent").val()
            }
            return queryParameters;
        },
      },
      allowClear : true,
      delay: 250,
      minimumInputLength: 0,
      language: "zh-TW",
    });
  $(".agent_select").val($("#selected_agent").val());
  $(".agent_select").trigger('change');

  $(".agent_select").change(function(){
     var data = $('.agent_select').select2('data');
     console.log(data[0].text);
     $("#selected_agent_name").val(data[0].text);
    $('.customer_select').val(''); 
    $('.customer_select').trigger('change'); 
    // $('.material_select').val(''); 
    // $('.material_select').trigger('change'); 
    
  });

  

  // var search = $(".agent_select input.select2-input");
  // search.trigger("input");
  // $(".agent_select").val(3);
  // $(".agent_select").trigger('change');
  $(".customer_select").select2({
      placeholder: "請選擇",
      allowClear : true,
      delay: 250,
      data : [{id : $("#selected_customer").val(), text: $("#selected_customer_name").val()}],
      ajax: {
        url: '/cue_order/search_customer2',
        processResults: function (data) {
          return {
            results: data.data
          };
        },
        data: function (params) {

            var queryParameters = {
                term: params.term,
                agent : $("#agent").val()
            }
            return queryParameters;
        },
      },
      
      minimumInputLength: 0,
      language: "zh-TW",
    });
    $(".customer_select").val($("#selected_customer").val());
    $(".customer_select").trigger('change');
    $(".customer_select").change(function(){
    var data = $('.customer_select').select2('data');
       console.log(data[0].text);
       $("#selected_customer_name").val(data[0].text);
    
       $('.material_select').val(''); 
       $('.material_select').trigger('change'); 
    
    });

    

    $(".material_select").select2({
      placeholder: "請選擇",
      allowClear : true,
      delay: 250,
      data : [{id : $("#selected_material").val(), text: $("#selected_material_name").val()}],
      ajax: {
        url: '/api/search_material',
        processResults: function (data) {
          return {
            results: data
          };
        },
        data: function (params) {

            var queryParameters = {
                term: params.term,
                agent : $("#agent").val(),
                c_id : $("#c_id").val(),
            }
            return queryParameters;
        },
      },
      
      minimumInputLength: 0,
      language: "zh-TW",
    });
    $(".material_select").val($("#selected_material").val());
    $(".material_select").trigger('change');

    $(".material_select").change(function(){
       var data = $('.material_select').select2('data');
       console.log(data[0].text);
       $("#selected_material_name").val(data[0].text);
    });


  
   
}); 