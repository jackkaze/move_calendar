
$(function(){

    adcDatepickSett();
    adcDatepickSettFromToday();
    adcPageTitle();
    adcMenuSetters();
    adcSwitchPanelBody();
    adcFileuploadSelect();
    adcCreateTableRows();
    adcBootstrapSwitch();
    adcStickyTableHeader();
    adcDataTableSett();
    adcDisabledRadioCheckbox();
    adcTableRowsBgcolor();
    adcDroplistAddExtra();

});


//日期選擇器
function adcDatepickSett()
{
    if ( $('.datepicker').length>0 ) {
        $('.datepicker').datepicker({
            language: 'zh-TW',
            autoclose: true,
            format: 'yyyy-mm-dd'
        });
        //按鈕事件
        $('.datepicker').on('changeDate', function() {
            $(this).prev('input[data-plugin="datepicker"]').val(
                $(this).datepicker('getFormattedDate')
            );
        });
    };
}

//日期選擇器(今日之前的日期不可選擇)
function adcDatepickSettFromToday()
{
    if ( $('.datepicker2').length>0 ) {
        var date = new Date();
            date.setDate(date.getDate());
        $('.datepicker2').datepicker({
            language: 'zh-TW',
            autoclose: true,
            format: 'yyyy-mm-dd',
            startDate: date
        });
        //按鈕事件
        $('.datepicker2').on('changeDate', function() {
            $(this).prev('input[data-plugin="datepicker"]').val(
                $(this).datepicker('getFormattedDate')
            );
        });
    };
}


//取得當前單元路徑
function adcPageTitle()
{
    var current = $('.child_menu li.current');
    if( current.length>0 ){
        var parent_name = current.parent('ul.child_menu').prev('a').text();
        var current_name = current.text();
        if ($('.wrapTitle').text()=='') {
            $('.wrapTitle').prepend( '<span>'+parent_name+'</span>' + current_name );
        } else {
            $('.wrapTitle').prepend( '<span>'+parent_name+'</span><span>'+current_name+'<span>' );
        }
    }
}



//左側選單功能
function adcMenuSetters()
{
    //捲軸
    if ($('.scrollbar-inner').length>0) {
        $('.scrollbar-inner').scrollbar({
            disableBodyScroll: true
        });
    };

    //收合事件
    $('.side_menu > li > a').on('click', function(){
        $(this).next('.child_menu').slideToggle(200);
        return false;
    });

    //主選單收合
    if ($('.wrapContainer').length>0) {
        $('.menu_toggle').on('click', function(){
            $('.wrapContainer').toggleClass('switch');
            return false;
        });
    }else{
        $('.menu_toggle').on('click', function(){
            $('.wrapMenu').toggleClass('switch');
            return false;
        });
    }

    //返回頂端
    $('.back_top').on('click', function(){
        $("html, body").stop().animate({ scrollTop: 0 }, 300);
    });

}



//資料區塊收合
function adcSwitchPanelBody()
{
    if( $('.panel-button .switch-panel').length>0 ){
        $('.switch-panel').on('click', function(event) {
            $(this).toggleClass('active');
            $(this).parent().siblings('.panel-body').toggleClass('hidden');
        });
    }

}



//檔案上傳元件選取時顯示檔名
function adcFileuploadSelect()
{
    if( $("input.uploadBtn").length>0 ){
        $("input.uploadBtn").on('change', function () {
            $(".uploadFile").html( $(this).val() );
        });
    }
}



//表格增加新列
function adcCreateTableRows()
{
    if($('.table-add-row .btn-clone').length>0){
        $('.table-add-row .btn-clone').on('click', function(event)
        {
            var $table   = $(this).parents('table');
            var $length  = $table.find('tbody tr').length;
            var $row     = $table.find('tbody tr:eq(0)');
            var $tpl     = $row.clone();
            var $append  = $table.find('tbody').append( '<tr>' + $tpl.html() + '</tr>' );

            //預設空值
            $table.find('tbody tr:last td:first').html( $length+1 );
            $table.find('tbody tr:last input[type="text"]').val("");
            $table.find('tbody tr:last textarea').val("");
            $table.find('tbody tr:last select option:eq(0)').prop('selected', true);
        });
    }
}



//表單checkbok元件樣式
function adcBootstrapSwitch()
{
    if( $("[type='checkbox'].switch").length>0 ){
        $("[type='checkbox'].switch").bootstrapSwitch();
    }
}



//黏貼table header
function adcStickyTableHeader()
{
    var $table = $(".fixedHeader");
    if ($table.length>0) {
        $table.stickyTableHeaders();
    };
}



//增加一個素材下拉選單(與按鈕綁定onclick事件)
function adcCopyMaterialDroplist( event, name, id )
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
            $tpl.find('.copyButton').remove();
            $tpl.find('label').html("");
            $tpl.find('input[type="text"]').attr({ 'name': input_name, 'id': input_id + '_' + $length });

        //被複製元素放入指定區塊
        var $append = $source.append( '\n<div class="form-group">' + $tpl.html() + '</div>' );

        // console.clear();
        // console.log( $this );
        return;
    }
}


//點擊收合區塊
//按鈕要有 onclick="tipToggleDiv(this)"
//目標區塊 class 要有 toggleDiv
function tipToggleDiv(button)
{
    var $button = $(button);
    var $index  = $('.toggleBtn').index($button);
    var $block  = $('[class*="toggleDiv"]');
    if ( $button!=undefined && $block.length>0 )
    {
        $block.eq($index).toggleClass('toggleHide');
        $button.toggleClass('toggleView');
    }
    return;
}


//dataTable套件
function adcDataTableSett()
{
    if ( $('.dataTable').length>0 ) {
        $('.dataTable').DataTable({
            "sPaginationType": "full_numbers",
            "iDisplayLength": 10,
            "aaSorting": [],
            "oLanguage": {
                "sSearch": "搜尋關鍵字",
                "sInfoFiltered": "",
                "oPaginate": {
                    "sPrevious": "上一頁",
                    "sNext": "下一頁",
                    "sFirst": "第一頁",
                    "sLast": "最末頁"
                },
                "sInfo" : "瀏覽第 _START_ 至 _END_ 筆資料 ( 總計 _TOTAL_ 筆 )"
            }
        });
        $('.dataTable').removeClass( 'display' ).addClass('table table-striped table-bordered');
    };
}



//增加一個年度淨額回饋單選元件(新增合約)
//內含2個input-text元件
function adcCopyRewardRadio( event, name1, name2, id )
{
    if( $('.adcCopyRewardRadioData').length>0 ){

        //給input[text]用的name, id
        var input_name_1 = name1 ? name1 : "input-name[]";
        var input_name_2 = name2 ? name2 : "input-nick[]";
        var input_id = id ? id : "radio";

        //取得元素
        var $this   = $(event.target);
        var $source = $('.adcCopyRewardRadioSource');
        var $length = $('.adcCopyRewardRadioItem').length + 1;
        var $panel  = $('.adcCopyRewardRadioData');

        //只複製第1個元素並移除多餘的事件按鈕
        var $tpl = $source.clone();
            $tpl.find('input').val("");
            $tpl.find('input[type="text"]:eq(0)').attr({ 'name': input_name_1 });
            $tpl.find('input[type="text"]:eq(1)').attr({ 'name': input_name_2 });
            $tpl.find('input[type="radio"]').attr({ 'id': input_id + '' + $length });
            $tpl.find('label').attr({ 'for': input_id + '' + $length });

        //被複製元素放入指定區塊
        var $append = $panel.append( '\n<p class="adcCopyRewardRadioItem">' + $tpl.html() + '</p>' );

        // console.clear();
        // console.log( $source );
        return;
    }
}



//增加一個拆分比例表單元件(新增服務費合約)
//內含3個input-text元件
function adcCopyDismantleRadio( event, name1, name2, name3 )
{
    if( $('.adcCopyDismantleRadioData').length>0 ){

        //給input[text]用的name, id
        var input_name_1 = name1 ? name1 : "input-data";
        var input_name_2 = name2 ? name2 : "input-data";
        var input_name_3 = name3 ? name3 : "input-data";

        //取得元素
        var $this   = $(event.target);
        var $source = $('.adcCopyDismantleRadioSource');
        var $length = $('.adcCopyDismantleRadioItem').length + 1;
        var $panel  = $('.adcCopyDismantleRadioData');

        //只複製第1個元素並移除多餘的事件按鈕
        var $tpl = $source.clone();
            $tpl.find('input').val("");
            $tpl.find('input[type="text"]:eq(0)').attr({ 'name': input_name_1 });
            $tpl.find('input[type="text"]:eq(1)').attr({ 'name': input_name_2 });
            $tpl.find('input[type="text"]:eq(2)').attr({ 'name': input_name_3 });

        //被複製元素放入指定區塊
        var $append = $panel.append( '\n<p class="adcCopyDismantleRadioItem">' + $tpl.html() + '</p>' );

        adcDatepickSett();

        //console.clear();
        //console.log( $length );
        return;
    }
}


//禁止check與radio點擊
function adcDisabledRadioCheckbox(){
    if( $('input[type="radio"]').length>0 ){
        $('input[type="radio"]').on('click', function(){
            if($(this).hasClass('disabled')){
                return false;
            }
        });
    }
    if( $('input[type="checkbox"]').length>0 ){
        $('input[type="checkbox"]').on('click', function(){
            if($(this).hasClass('disabled')){
                return false;
            }
        });

    }
}


//表格列顏色
function adcTableRowsBgcolor(){
    if ($('.table').length>0 && !$('.table').hasClass('table-striped')) {
        $('.table tbody tr').mouseenter(function(event){
            $(this).css('background-color', '#eee');
        }).mouseleave(function(event) {
            $(this).css('background-color', '#fff');
        });
    }
}


//下拉選單選到其他時需要直接填寫input新增下拉項目
//預設val=99時，顯示input欄位
function adcDroplistAddExtra(){
    if($('select.extra-add-connect').length>0){
        $('select.extra-add-connect').on('change', function(){
            var index = $('select.extra-add-connect').index($(this));
            var value = $(this).val();
            if (value==99) {
                $('.extra-add-input').eq(index).removeClass('hide');
            }else{
                $('.extra-add-input').eq(index).addClass('hide');
            }
        });
    }
}
