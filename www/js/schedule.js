var schedule_url = '/fill_cue';
var action_url = "/fill_cue/";
var is_update = true;
var klass = {
    'PV': 'item-pv',
    'AD': 'item-ad'
};
var grade_rows = ['112090301', '112090302', '112090303', '112090304'];

if (typeof console === "undefined") {
    console = {
        log: function() {},
        debug: function() {}
    };
}

// 時間長度格式轉換
var durationFormat = function(duration) {
    var pre = '';
    if (duration < 0) {
        duration *= -1;
        pre = '-';
    }
    var hour = Math.floor(duration/3600);
    var rem  = duration % 3600;
    var min  = Math.floor(rem/60);
    var sec  = rem % 60;
    return sprintf("%s%02d:%02d:%02d", pre, hour, min, sec);
};
var time2sec = function(time) {
    if(time.indexOf("-") !== -1){
         return -10;
    }else{var times = time.split(":");
        var hour = parseInt(times[0])*3600;
        var min  = parseInt(times[1])*60;
        var sec  = parseInt(times[2]);
        return hour+min+sec;
       
    }

    
};
var checkDuplicateAll = function(){
    $(".schedule-program").each(function(index, element) {
       var pvs = []; 
       var idx = 0;  
       var pg_c = 0;
       $(element).attr('id', 'check');
       $("#check > tbody > tr").each(function() {
           item = $(this);
           console.log(item);
           var this_type = item.find('td.item-type').text().trim();
           var this_item_title = item.find('td.item-title').text().trim();
           if(this_type == 'PV'){
              pvs[idx] = this_item_title;
              idx++;     
           }else if(this_type == 'PG'){
              pg_c++;
              if(pg_c>1){
                pvs = []; idx = 0; 
              }
               
           }
           if($.inArray(this_item_title, pvs)>0){
              item.find('td').addClass("error_item");
           }

        });
       $(element).removeAttr( "id" );
    });
}
var checkDuplicate = function(item) {
    //上下破有相同PV
    $(".error_item").removeClass("error_item");
    // var curr = item;
    
    // if(prev_pg == null){
    //     prev_pg = curr.prev(".item-pv");
    // }
    var this_type = item.find('td.item-type').text().trim();
    var this_item_title = item.find('td.item-title').text().trim();
    var time =  item.find('td.item-start').text().trim();
    var pre = item.prev(".insert-item");
    var pre_start_time = pre.find('td.item-start').text().trim();
    // console.log(pre_start_time);
    if(this_type == 'PV'){
        var pg_cnt = 0;
        while(pre_start_time>'00:00:00'){
            var title = pre.find('td.item-title').text().trim();
            var ty =  pre.find('td.item-type').text().trim();
            if(ty == "PG") pg_cnt++;
            if(pg_cnt > 1) break;
            if(title == this_item_title && time !=  pre.find('.item-start').text().trim()){
                item.find('td').addClass("error_item");
                console.log("與上破重複 : "+ title + "," + this_item_title);
                //alert("此破或與上破重複");
            }
            pre = pre.prev(".insert-item");
            pre_start_time = pre.find('td.item-start').text().trim();
            // console.log(pre_start_time);
        }

        var next = item.next(".insert-item");
        var next_start_time = next.find('td.item-start').text().trim();
        
        var pg_cnt = 0;
        while(next_start_time!=''){
            var title = next.find('td.item-title').text().trim();
            console.log(title);
            var ty =  next.find('td.item-type').text().trim();
            if(ty == "PG") pg_cnt++;
            if(pg_cnt > 1) break;
            if(title == this_item_title && time !=  next.find('.item-start').text().trim()){
                item.find('td').addClass("error_item");
                console.log("與下破重複 : "+title + "," + this_item_title);
                //alert("此破或與下破重複");
            }
            next = next.next(".insert-item");
            next_start_time = next.find('td.item-start').text().trim();
            // console.log(pre_start_time);
        }

    }
    

}

// 瀏覽器尺寸異動
var onWindowResize = function () {
    var window_height = $(window).height();
    if ($("#item-results").length > 0) {
        $("#item-results").css('height', window_height - $("#item-results").position().top - 40);
        $("#info-pg").css('height', window_height - $("#info-pg").position().top - 40);
        $("#schedule-view").css('height', window_height - $("#schedule-view").position().top - 40);
    }
};

// 關閉 Dialog
var onDialogCancel = function () {
    $(this).dialog("close");
};
var get_next = function(the){
    return the.next();
}

// 更新所有物件時間長度
var updateItemDuration = function(save) {
    var base  = $("#schedule-queue").data("base");
    var start = 0,
        sort = 1;

    //console.log("你成功了!! ==========================");
    // 計算節目用掉的時間
    var duration_total = 0,
        short_total = 0;
    $(".schedule-program").each(function(pg_idx, pg_item){
        var table = $(this),
            // must = table.find(".program-must"), pg_short = table.find(".program-short"),
            must = table.data("program-must"), 
            
            pg_short = table.find(".program-short"),
            duration = table.find(".program-duration"),
            ad_items = table.find(".schedule-program-items tr.item-ad"),
            
            items = table.find(".schedule-program-items tr"),
            sec = 0,
            diff = 0,
            ad = 0,
            remain = 0,
            program_sn = items.eq(0).data("program_sn");
        $.each(ad_items, function(idx, item){
            ad += parseInt($(item).data("duration"));
        });    

        $.each(items, function(idx, item){
            sec += parseInt($(item).data("duration"));
        });
        duration.text(durationFormat(sec));
        diff = must - sec;
        remain =  parseInt(must/6)-ad;




        // 節目資訊區
        var pg = $("#info-pg .program_sn-" + program_sn);
        pg.find(".program-duration").text(durationFormat(sec));
        pg.find(".program-short").text(durationFormat(diff));
        pg.find(".program-remain").text(durationFormat(remain));
        duration_total += sec;
        short_total += diff;

        if (short_total < 0) {
            $("#info-pg .program-short-total").addClass("item-warning");
        } else {
            $("#info-pg .program-short-total").removeClass("item-warning");
        }

        if(ad >= parseInt(must/6)*0.9){
            console.log(123);
             pg.find(".program-remain").addClass("item-warning");
        }else{
            console.log(453);
             pg.find(".program-remain").removeClass("item-warning");
        }

    });
    $("#info-pg .program-duration-total").text(durationFormat(duration_total));
    $("#info-pg .program-short-total").text(durationFormat(short_total));

    // 計算破口用掉的時間
    var pg = $(".schedule-program-items tr:first"),
        sec = 0,
        program_sn = '',
        contents_id = '',
        data_segment = 0,
        remark = 0;
    var xdate_base = new XDate(base * 1000).clearTime().valueOf() / 1000;
    start = base;

    $(".schedule-program-items tr").each(function(idx, item){
        var self = $(item),
            data_type = self.data("data_type");

        if ('' === self.data("program_sn")) {
            self.data("program_sn", program_sn);
        }

        if (self.data("program_sn") !== program_sn) {
            program_sn   = self.data("program_sn");
            data_segment = 0;
            remark = 0;
        }

        switch (data_type) {
            case 'TC':
                program_sn  = self.data("program_sn");
                contents_id = self.data("contents_id");
                self.data("remark", 0);
                data_segment = 0;
                remark = 0;
                break;
            case 'PG':
                pg.find(".segment-duration").text(durationFormat(sec));
                sec = 0;
                remark = 10 * self.data("data_segment");
                program_sn   = self.data("program_sn");
                contents_id  = self.data("contents_id");
                data_segment = self.data("data_segment");
                self.data("start_timestamp", start);
                self.data("remark", remark);
                pg = self;
                break;
            case 'PV':
            case 'AD':
                if ($.inArray($.trim(self.data("data_id")), grade_rows) > -1) {
                    remark += 5;
                }
                // console.log(self.data("data_id"));
                // console.log(self.data("program_sn") + ' : ' + self.data("data_title") + ' => ' + remark);
                sec += parseInt(self.data("duration"));
                self.data("start_timestamp", start);
                self.data("remark", remark);
                break;
        }

        // 計算各物件的開始時間
        var duration = self.find(".item-start"), 
            item_sort = self.find(".item-sort");
        duration.text(durationFormat(start - xdate_base));
        item_sort.text(sort++);
        start += parseInt(self.data("duration"), 10);
    });


    if (save) {
        getCalendarToken(function(data){
            if (window.localStorage["calendar_token"] === data.token) {


            } else {
                alert("節目架構有異動！\n建議您重新載入頁面之後，再繼續作業。");
            }
        });
        // saveItems(function(data){
        //     // if (1 !== data.rs) {
        //     //     alert('排程資料儲存失敗。');
        //     // }

        //     if (data &&  data.rs != 1) {
        //         alert('排程資料儲存失敗。');
        //     }
        // });
    }
};


/**
 * 物件樣板
 * 
 * @param  object item  物件資料
 * @param  string title 物件名稱
 * @return html
 */
var itemTemplate = function(item, title) {
    var html = [];
    var duration = null === item.SEC ? 0 : parseInt(item.SEC);
    var target_day = new XDate($("#datepicker").val());

    html.push('<tr class="insert-item '+klass[item.TYPE1]+'" data-duration="'+duration+'" data-program_sn="" data-gpi="N" data-contents_id="" data-live="" data-data_type="'+item.TYPE1+'" data-data_id="'+item.DATA_ID+'" data-data_title="'+title+'" data-data_segment="1" data-start_timestamp="" data-m_id="'+item.m_id+'" data-message="'+item.MESSAGE+'">');
    html.push('<td class="item-control">');
    html.push('<button class="btn btn-remove-single-item">刪</button>');
    html.push('</td>');
    html.push('<td class="item-sort"></td>');
    html.push('<td class="segment-duration"></td>');
    html.push('<td class="item-title" style="/*white-space:nowrap;*/">'+title+'</td>');
    html.push('<td class="item-start"></td>');
    html.push('<td class="item-duration">'+durationFormat(duration).substring(3)+'</td>');
    html.push('<td class="item-type">'+item.TYPE1+'</td>');
    // html.push('<td class="item-data_id">'+item.DATA_ID+'</td>');
    html.push('<td class="item-segment">1</td>');

    html.push('<td style="display:none;" class="item-ENABLE_START_DATE">'+item.ENABLE_START_DATE+'</td>');
    html.push('<td style="display:none;" class="item-ENABLE_START_TIME">'+item.ENABLE_START_TIME+'</td>');
    html.push('<td style="display:none;" class="item-ENABLE_END_DATE">'+item.ENABLE_END_DATE+'</td>');
    html.push('<td style="display:none;" class="item-ENABLE_END_TIME">'+item.ENABLE_END_TIME+'</td>');

	var ddd = item.ENABLE_END_DATE;
    var ddt = item.ENABLE_END_TIME;
    var d = new Date(item.ENABLE_END_DATE + " " + item.ENABLE_END_TIME);

    html.push('<td class="item-message">'+ (d.getMonth()+1)+ "/" +  d.getDate() + " " + ddt.substring(0,5)   
        +" </td><td class='item-message'>" +item.MESSAGE + '</td>' + "<td class='item-order'>" +item.order_id + '</td>');
    html.push('</tr>');
    
    return html.join('');
};

/**
 * 搜尋物件(PV, AD)
 *
 * 會搜尋資料帶編號和標題名稱
 * 
 * @param  string sec    分類(ALL, PV, AD)
 * @param  string keyword 關鍵字
 * @return html
 */
var doItemSearch = function(sec, keyword) {
    var items = JSON.parse(window.localStorage["items"]);
    var reg   = new RegExp(keyword, "i");
    var html  = [];

    $.each(items, function(idx, item){
        // var title = decodeURIComponent(item.TITLE).replace(/\+/g, " ");
        console.log(item);
        var title = item.TITLE;
        var message = item.MESSAGE;
        // console.log(message);
        if (message.match(reg) || item.DATA_ID.match(reg)) {
            if ( sec === item.SEC) {
                html.push(itemTemplate(item, title));
            }
        }
    });
    delete items;
    return html;
};

var checkAD = function(){

};


/**
 * 取得 PV 和 AD 的物件，並暫存到本機
 * 
 * @return void
 */
var reloadItems = function() {
    var schedule_date = new XDate($("#datepicker").val());
    $.getJSON(action_url + 'get_items', {
        act: 'get-items',
        ch: $("#channel-picker").val(),
        we: 0 === schedule_date.getDay() ? 7 : schedule_date.getDay(),
        day: schedule_date.toString("yyyy-MM-dd"),
        r:Math.random()*99999
    }, function(data){
        if (1 === data.rs) {
            var results = $("#item-results .search-result-items tbody");
            window.localStorage["items"] = JSON.stringify(data.items);
            
            var html = [];
            $.each(data.items, function(idx, item){
                // var title = decodeURIComponent(item.TITLE).replace(/\+/g, " ");
                html.push(itemTemplate(item, item.TITLE));
            });
            results.html(html.join('\n'));

            $(".search-result-items").trigger("update");
            //右邊欄可托曳
            results.find("tr").draggable({
                connectToSortable: "#schedule-queue .schedule-program .schedule-program-items",
                helper: "clone"
                // revert: "invalid"
            });
            results.sortable({
                connectWith: ".schedule-program-items",
            }

            );

           
            
        }

        delete data;
        delete results;
    });
};


/**
 * 取得 Calendar Token
 */
var getCalendarToken = function(callback) {
    $.getJSON(action_url + 'get_calendar_token', {
        act:'get-calendar-token', 
        ch:$("#channel-picker").val(), 
        day:$("#datepicker").val(), 
        r:Math.random() * 99999999
    }, callback);
};


/**
 * 儲存排程資料 --- 把頁面上資料存入
 * 
 * @param  Function callback
 * @return void
 */
var saveItems = function(callback) {
    var result = false;
    var items = [];
    $(".schedule-program-items tr").each(function(idx, item){
        var self = $(this);
        // console.log(self.html());
        // console.log(self.find(".item-order").text());
        
        items.push(JSON.stringify({
            'program_sn'      : self.data("program_sn"),
            'program_gpi'     : self.data("gpi"),
            'contents_id'     : self.data("contents_id"),
            'live'            : self.data("live"),
            'data_type'       : self.data("data_type"),
            'data_id'         : self.data("data_id"),
            'data_title'      : self.data("data_title"),
            'data_segment'    : self.data("data_segment"),
            'start_timestamp' : self.data("start_timestamp"),
            'duration'        : self.data("duration"),
            'remark'          : self.data("remark"),
            'm_id'            : self.data("m_id"),
            'order_id'        : self.find(".item-order").text()
        }));
    });
    //AJAX更新資料內容
    $.post(action_url + "schedule_update", {
        act: "schedule-update", 
        ch: $("#channel-picker").val(),
        date: $("#data_date").val(),
        csrf_token_name : $("#csrf_token").val(),
        items: items
    }, callback, "JSON");

    result = true;
    delete items;

    
    return result;
};





$(function() {
    // 檢查 Chrome 瀏覽器
    // if ( ! $.browser.chrome) {
    //     alert("請使用 Chrome");
    //     window.open("https://www.google.com/intl/zh-TW/chrome/browser/");
    //     return false;
    // }

    // Browser Resize
    $(window).on("resize", onWindowResize);
    onWindowResize();

    /**
     * AJAX 設定
     */
    var message = $("#message");
    message.data("num", 0);
    $.ajaxSetup({
        beforeSend: function(jqXHR, settings){
            message.data("num", message.data("num") + 1).show();
        },
        complete: function(jqXHR, textStatus){
            message.data("num", message.data("num") - 1);
            if (message.data("num") <= 0) {
                message.hide();
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(textStatus);
            console.log(errorThrown);
        }
    });



    /**
     * 取得 Calendar Token 並儲存至 Local Storage
     */
    getCalendarToken(function(data){
        window.localStorage["calendar_token"] = data.token;
    });


    /**
     * 載入物件基本資訊，暫存到本機
     * 右邊欄
     */
    reloadItems();
    

    // CMS 連結
    $("#btn-cms").button().on("click", function(){
        window.open("http://211.75.175.86/elta_cue/content_list.php", "_blank");
        return false;
    });
    $("#btn-cue").button().on("click", function(){
        //var btn = $(this);
        var ch = $("#channel-picker").val(); 
        var date = $("#datepicker").val(); 
        window.open("http://adq.elta.com.tw/adCue/ad_excel.php?start_time="+date+"&channel="+ch, "_blank");

        
    });


    /**
     * 主控轉檔按鈕
     *
     * 儲存之後，下載 SCH 檔案或直接傳送 SCH 檔案至主控資料夾
     */
    $("#btn-transform").button().on("click", function(){
        var btn = $(this);

        $(btn.data("dialog")).dialog({
            width:     360,
            position: {
                my: "left top",
                at: "left bottom",
                of: btn
            },
            resizable: true,
            modal: true,
            buttons:   {
                "DownloadButton" : {
                    text: '轉檔並下載 SCH 檔案',
                    id: 'dialog-transform-btn-download',
                    click: function() {
                        $.post(action_url, {
                            act:'schedule-transform', 
                            ch:$("#channel-picker").val(), 
                            date:$("#datepicker").val(), 
                            r:Math.random() * 99999999
                        }, function(data){
                            window.location.href = "http://211.75.175.87/mod/playlist.php?action=DW&CH="+$("#channel-picker").val()+"&pdate="+$("#transform-date").val();
                        }, 'json');
                        return false;
                    }
                },
                "SendButton" : {
                    text: '轉檔並傳送至主控',
                    id: 'dialog-transform-btn-send',
                    click: function() {
                        $.post(action_url, {
                            act:'schedule-transform', 
                            ch:$("#channel-picker").val(), 
                            date:$("#datepicker").val(), 
                            r:Math.random() * 99999999
                        }, function(data){
                            $.get(
                                "http://211.75.175.87/mod/playlist.php", {
                                    action: 'SAVE',
                                    CH: $("#channel-picker").val(),
                                    pdate: $("#transform-date").val(),
                                    r: Math.random() * 99999
                                },
                                function(data){
                                    if (data.toLowerCase().search("ok") > -1) {
                                        alert("傳送成功！");
                                    } else {
                                        alert("傳送失敗！");
                                    }
                            });
                        }, 'json');
                        return false;
                    }
                },
                "SendFinal" : {
                    text: 'excel',
                    id: 'dialog-transform-btn-final',
                    click: function() {
                        // $.post("action.php", {
                        //     act:'schedule-transform', 
                        //     ch:$("#channel-picker").val(), 
                        //     date:$("#datepicker").val(), 
                        //     r:Math.random() * 99999999
                        // }, function(data){
                        //     window.location.href = "http://adq.elta.com.tw/api/schedule_excel_download?ch="+$("#channel-picker").val()+"&day="+$("#transform-date").val();
                            
                        // }, 'json');
                        // return false;
                        window.location.href = "http://adq.elta.com.tw/api/schedule_excel_download?ch="+$("#channel-picker").val()+"&day="+$("#transform-date").val();
                            
                        
                            // $.ajaxSetup({async: false});
                            
                            // $.ajaxSetup({async: true});
                        
                        return false;
                    }
                },
                "CancelButton" : {
                    text: '取消',
                    id: 'dialog-transform-btn-cancel',
                    click: onDialogCancel
                }
            },
            open: function (event, ui) {
                $("#transform-date").val($("#datepicker").val());

                $(".schedule-program-items tr").each(function(idx, item){
                    var self = $(item);

                    // 檢查資料帶編號
                    if ('' === $.trim(self.data("data_id"))) {
                        $("#dialog-transform-result").append('<li>'+self.find(".item-start").text()+' '+self.find(".item-title").text()+' <span style="color: #f00">( 缺少資料帶編號 )</span></li>');
                        // $("#dialog-transform-btn-download, #dialog-transform-btn-send").prop("disabled", true);
                    }
                });
            }
        });
    });


    /**
     * 儲存排程資料
     */
    
    $("#btn-schedule-save").button().on("click", function(){
        saveItems(function(data){
            if (data.rs==true) {
                alert('排程資料儲存成功。');
            } else {
                alert('排程資料儲存失敗。');
            }
        });
        return false;
    });
    



     /**
      * jQuery UI Datepicker 設定 Start
      */
    $.datepicker.regional['zh-TW'] = {
        closeText: '關閉',
        prevText: '&#x3C;上月',
        nextText: '下月&#x3E;',
        currentText: '今天',
        monthNames: ['一月','二月','三月','四月','五月','六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ],
        monthNamesShort: ['一月','二月','三月','四月','五月','六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ],
        dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
        dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
        dayNamesMin: ['日','一','二','三','四','五','六'],
        weekHeader: '周',
        dateFormat: 'yy/mm/dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '年'
    };
    $.datepicker.setDefaults($.datepicker.regional['zh-TW']);
     /**
      * jQuery UI Datepicker 設定 End
      */


    // 左欄頻道選擇
    $("#channel-picker").on("change", function(){
        $.blockUI({ message: '<div>轉換頻道中，請稍候...</div>'});  
        window.location.href = schedule_url + "?ch="+$(this).val()+"&day="+$("#datepicker").val();
        return false;
    });

    // 左欄小日曆
    $("#datepicker").datepicker({
        changeMonth: true,
        dateFormat:  "yy-mm-dd",
        onSelect:    function (dateText, inst) {
            $.blockUI({ message: '<div>轉換日期中，請稍候...</div>'});  
            window.location.href = schedule_url + "?ch="+$("#channel-picker").val()+"&day="+dateText;
            return false;
        }
    });


    /**
     * 重新載入搜尋物件 Start
     */
    $(".search-result-items").tablesorter({
        sortReset   : true,
        sortRestart : true
    });

    $("#btn-reload-items").button().on("click", function(){
        $("#item-sec").val('');
        $("#item-search").val('');
        reloadItems();
    });
    /**
     * 重新載入搜尋物件 End
     */

    /**
     * 搜尋物件名稱及資料帶編號 Start
     */
    $("#item-search").autocomplete({
        minLength: 0,
        source: function (request, response) {
            var results = $("#item-results .search-result-items tbody");
            var html    = [];
            html = doItemSearch($("#item-sec").val(), request.term);
            results.html(html.join('\n'));
            results.trigger("update");
            
            results.find("tr").draggable({
                connectToSortable: "#schedule-queue .schedule-program .schedule-program-items",
                helper: "clone"
                // revert: "invalid"
            });
            
            delete html;
            delete results;

        }
    });
    //item-se
    $("#item-sec").autocomplete({
        minLength: 0,
        source: function (request, response) {
            var results = $("#item-results .search-result-items tbody");
            var html    = [];
            html = doItemSearch(request.term,$("#item-search").val() );
            results.html(html.join('\n'));
            results.trigger("update");
            
            results.find("tr").draggable({
                connectToSortable: "#schedule-queue .schedule-program .schedule-program-items",
                helper: "clone"
                // revert: "invalid"
            });
            
            delete html;
            delete results;

        }
    });



    // $("#item-type").on("change", function(){
    //     var results = $("#item-results .search-result-items tbody");
    //     var html    = [];
    //     html = doItemSearch($(this).val(), $.trim($("#item-search").val()));
    //     results.html(html.join('\n'));
    //     results.trigger("update");
        
    //     results.find("tr").draggable({
    //         connectToSortable: "#schedule-queue .schedule-program .schedule-program-items",
    //         helper: "clone"
    //         // revert: "invalid"
    //     });
        
    //     delete html;
    //     delete results;

    // });
    /**
     * 搜尋物件名稱及資料帶編號 End
     */


    /**
     * 說明提示按鈕 Start
     */
    $("#btn-tips").button().on("click", function(){
        var btn = $(this);

        $("#dialog-tips").dialog({
            width:     600,
            position: {
                my: "left top",
                at: "left bottom",
                of: btn
            },
            resizable: true,
            modal: true,
            buttons:   {
                "CancelButton" : {
                    text: '取消',
                    id: 'dialog-tips-btn-cancel',
                    click: onDialogCancel
                }
            }
        });
    });
    /**
     * 說明提示按鈕 End
     */
    

    /**
     * 節目資訊區塊 Start
     */
    $("#info-pg tr:not(:first)").on("dblclick", function(){
        var self = $(this),
            idx = $("#info-pg tr").index(self) - 1,
            top = $(".schedule-program").eq(idx).position().top - $("#schedule-view").position().top,
            diff = $("#schedule-view").scrollTop();

        $("#schedule-view").scrollTop(top+diff);
    }).disableSelection();
    /**
     * 節目資訊區塊 End
     */

    

    // updateItemDuration(true);
    
    /**
     * 排程區拖曳排序功能 Start
     */
    
    $("#schedule-queue .schedule-program .schedule-program-items").sortable({
        connectWith: ".schedule-program-items",
        placeholder: "ui-state-highlight",
        cancel: ".item-pg",
        // revert: 500,
        helper: function (event, ui) {
            ui.children().each(function() {
                $(this).width($(this).width());
            });
            return ui;
        },
        update: function (event, ui) {
            // console.log("update");
            if(is_update){
                updateItemDuration(true);
            

            }else{
                alert("已滿無法插入廣告");
                $(this).sortable( "cancel" );
            }
            // updateItemDuration(true);
            
            
        },
        start: function(event, ui) {
            var item = $(ui.item),
                block = item.parent();
            var ad = parseInt(item.data("duration"));
            var pg = block.find(".item-pg:first");
            var program_sn = pg.data("program_sn");
            var pgg = $("#info-pg .program_sn-" + program_sn);
            var sec = time2sec(pgg.find(".program-remain").text());
            console.log(sec-ad);
            if (sec-ad < 0) { 
                is_update = false;
               //  ui.item.sortable.cancel();        
               // alert("已經滿了");
               
            }else{
                is_update = true;
            }

        },
        stop: function (event, ui) {
            // var item = $(ui.item),
            //     block = item.parent();
            // console.log(item);
            // // console.log(": "+sec-ad);
            console.log(is_update);
            if(is_update)
            {
            
                var item = $(ui.item),
                    block = item.parent();
                var pg = block.find(".item-pg:first");
                item.data("program_sn",  pg.data("program_sn"));
                item.data("contents_id", pg.data("contents_id"));
            }else{
                 // $(ui.sender).sortable( "option", "revert", false );
                // ui.item.remove();
            }
        },
        receive: function (event, ui) {
            console.log(2);
            if(is_update)
            {
            
                var block = $(this),
                    item = $(ui.item[0].outerHTML);
                var pg = block.find(".item-pg:first");

                if ('' === $.trim(item.data("program_sn"))) {
                    item.data("program_sn",  pg.data("program_sn"));
                    item.data("contents_id", pg.data("contents_id"));

                    // Ctrl 插入至所有該節目段後
                    if (event.ctrlKey) {
                        item.insertAfter(block.find(".item-pg")).show();
                        block.data().uiSortable.currentItem.remove();
                        return;
                    }

                    // Alt 插入至所有該節目段前
                    if (event.altKey) {
                        item.insertBefore(block.find(".item-pg")).show();
                        block.data().uiSortable.currentItem.remove();
                        return;
                    }
                }
           }else{

           }
        }

    }).disableSelection();
    /**
     * 排程區拖曳排序功能 End
     */

    


    // 刪除節目所有物件
    $("#schedule-queue").on("click", ".btn-clear-program-items", function(){
        if (confirm("確定要清除該節目內所有 PV 和 AD 嗎？\n清除後將無法恢復！")) {
            var items = $(this).parent().parent().parent().next(".schedule-program-items").find("tr:not(.item-pg,.item-tc)");
            items.fadeOut("fast", function(){
                $(this).remove();
                updateItemDuration(true);
            });
            delete items;
        }
        return false;
    });

    
    // 連同節目都刪除
    $("#schedule-queue").on("click", ".btn-remove-segment", function(){
        if (confirm("確定要清除該節目及破口所有 PV 和 AD 嗎？\n清除後將無法恢復！")) {
            var items = $(this).parent().parent().parent().next(".schedule-program-items").find("tr:not(.item-pg,.item-tc)");
            items.fadeOut("fast", function(){
                $(this).remove();
                updateItemDuration(true);
            });
            delete items;
        }
        return false;
    });


    // 刪除破口所有物件
    $("#schedule-queue").on("click", ".btn-clear-segment-items", function(){
        if (confirm("確定要清除該破口內所有 PV 和 AD 嗎？\n清除後將無法恢復！")) {
            var start = $(this).parent().parent(),
                pg = start.parent().find(".item-pg"),
                idx = pg.index(start),
                end = pg.eq(idx + 1);
            start.nextUntil(end).fadeOut("fast", function(){
                $(this).remove();
                updateItemDuration(true);
            });
        }
        return false;
    });

    // 刪除單筆物件
    $("#schedule-queue").on("click", ".btn-remove-single-item", function(){
        $(this).parent().parent().fadeOut("fast", function(){
            var thisitem = $(this).next();
            $(this).remove();
            updateItemDuration(true);
            
            var prev_item =thisitem.prev();
            var next_item =thisitem.next();
            var this_type =thisitem.find('td.item-type').text().trim();
            var prev_item_title = prev_item.find('td.item-title').text().trim();
            var this_item_title =thisitem.find('td.item-title').text().trim();
            var next_item_title = next_item.find('td.item-title').text().trim();

            checkDuplicate(thisitem);
            
            // if(this_type == "PV" && (this_item_title == prev_item_title || this_item_title == next_item_title )){
            //      alert("重複PV");
            //      thisitem.find('td').addClass("error_item");
            //     // thisitem.find('td').css( "background-color", "#0040ff" );
            // }

        });
        return false;
    });

    /**
     * 
     * 單筆及多筆節目變更 --- Raphael
     *
     */
    
    //搜尋指定class並清除內容
    //找出已存在select_change_items(中間)加以刪除,回複原字色,同時清除click_change_items
    var clean_select_change_items = function() {
        $(".schedule-program-items > tr").each(function(index) {
                    $(this).removeClass("select_change_items click_change_items ui-draggable").css("color",""); 
                    
                });
    };

    //找出已存在search-result-items(右邊)加以刪除,回複原字色
    var clean_click_change_items = function() {
        $(".search-result-items").find(".insert-item").each(function(index, el) {
                    $(this).removeClass("click_change_items").css("color",""); 
                });
    };
    
    var elta = {};

    elta.cue = {
        sel: {
            /**
             * 移除舊的選取資料
             * elta.cue.sel.single();
             */
            single: function(self) {

                elta.cue.clear.right_pv_click_item();
                elta.cue.clear.right_ad_click_item();

                $(self).last().addClass('click_change_items').css("color", "rgb(255, 17, 17)");

            }
        },
        clear: {
            /**
             * 清除 search-result-items(右邊 PV )加以刪除,回複原字色
             * elta.cue.clear.right_pv_click_item();
             */
            right_pv_click_item: function() {
                clean_click_change_items();
            },
            /**
             * 清除 search-result-items(右邊 ad )加以刪除,回複原字色
             * elta.cue.clear.right_ad_click_item();
             */
            right_ad_click_item: function() {
                $(".search-result-items").find(".item-ad").each(function(index, el) {
                    $(this).removeClass("click_change_items").css("color", "");
                });
            },
            /**
             * 清除 btn預設
             * elta.cue.clear.btns();
             */
            btns: function() {
                /**
                 * 清除 insert 連續插入 
                 */
                $('#val_insert_single_programs').val("0");
                $('#btn_insert_single_programs').css('color', 'black');

                /**
                 * 清除 集體插入
                 */
                $('#val_insert_mulit_programs').val("0");
                $('#btn_insert_mulit_programs').css('color', 'black');
            }
        },
        btns: {
            /**
             * elta.cue.btns.singel();
             */
            singel: function() {

                elta.cue.clear.btns();

                elta.cue.clear.right_pv_click_item();
                elta.cue.clear.right_ad_click_item();

                $('#val_insert_single_programs').val("1");
                $('#btn_insert_single_programs').css('color', '#0040ff');

            },
            /**
             * elta.cue.btns.mulit();
             */
            mulit: function() {

                elta.cue.clear.btns();

                elta.cue.clear.right_pv_click_item();
                elta.cue.clear.right_ad_click_item();

                $('#val_insert_mulit_programs').val("1");
                $('#btn_insert_mulit_programs').css('color', '#0040ff');
            }
        }
    }




    // 中間 -- 點擊變色
    $(".schedule-program-items").on("click", "tr",function(event){
        
        var self = this;

        /**
         * 連續插入
         */
        if ($('#val_insert_single_programs').val() == "1") {


            var get_click_change_items = $(".search-result-items").find(".click_change_items");
            
            
            $(self).after(get_click_change_items.clone().appendTo(self));


            /**
             * 清除中間點選顏色
             */
            clean_select_change_items();
            /**
             * 重整並寫入資料
             */
            updateItemDuration(true);
            var time =  $(self).next().find('td.item-start').text().trim();
            var start_date = get_click_change_items.find('td.item-ENABLE_START_DATE').text().trim();
            var start_time = get_click_change_items.find('td.item-ENABLE_START_TIME').text().trim();
            var end_date = get_click_change_items.find('td.item-ENABLE_END_DATE').text().trim();
            var end_time = get_click_change_items.find('td.item-ENABLE_END_TIME').text().trim();
            var data_date = $("#data_date").val().trim();

            var item = $(self).next();
            var prev_item = item.prev();
            var next_item = item.next();
            var this_type = item.find('td.item-type').text().trim();
            var prev_item_title = prev_item.find('td.item-title').text().trim();
            var this_item_title = item.find('td.item-title').text().trim();
            var next_item_title = next_item.find('td.item-title').text().trim();
            // if(this_type == "PV" && (this_item_title == prev_item_title || this_item_title == next_item_title )){
            //      alert("重複PV");
            //      item.find('td').addClass("error_item");
            //      // item.find('td').css( "background-color", "#0040ff" );
            // }
             checkDuplicate(item);




            console.log(time + ", " +start_date + ", " + start_time + ", " + end_date + ", " + end_time);

            if(start_date == data_date){
                if(time < start_time){
                    alert("不在開放期間");
                     $(self).next().find('td').css( "background-color", "#0040ff" );


                }

            }

            if(end_date == data_date){
                if(time > end_time){
                    alert("不在開放期間");
                    $(self).next().find('td').css( "background-color", "#0040ff" );
                }

            }

            delete get_click_change_items;

        }
        /**
         * 集體插入
         */
        else if ($('#val_insert_mulit_programs').val() == "1") {

            var get_click_change_items = $(".search-result-items").find(".click_change_items");

            var max = get_click_change_items.length;
            while (max >= 0) {

                var data = get_click_change_items[max];

                $(self).after($(data).clone().prependTo(self));

                max--;
            }

            /**
             * 清除中間點選顏色
             */
            clean_select_change_items();

            /**
             * 重整並寫入資料
             */
            updateItemDuration(true);
            var data = $(self); 
            var max = get_click_change_items.length;
            while (max > 0) {

                var data = get_next(data);
                var time =  data.find('td.item-start').text().trim();
                var start_date = data.find('td.item-ENABLE_START_DATE').text().trim();
                var start_time = data.find('td.item-ENABLE_START_TIME').text().trim();
                var end_date = data.find('td.item-ENABLE_END_DATE').text().trim();
                var end_time = data.find('td.item-ENABLE_END_TIME').text().trim();
                var data_date = $("#data_date").val().trim();

                var thisitem = data;    
                var prev_item =thisitem.prev();
                var next_item =thisitem.next();
                var this_type =thisitem.find('td.item-type').text().trim();
                var prev_item_title = prev_item.find('td.item-title').text().trim();
                var this_item_title =thisitem.find('td.item-title').text().trim();
                var next_item_title = next_item.find('td.item-title').text().trim();

                 checkDuplicate(thisitem);
                
                // if(this_type == "PV" && (this_item_title == prev_item_title || this_item_title == next_item_title )){
                //      alert("重複PV");
                //      thisitem.find('td').addClass("error_item");
                //     // thisitem.find('td').css( "background-color", "#0040ff" );
                // }




                console.log(time + ", " +start_date + ", " + start_time + ", " + end_date + ", " + end_time);
                if(start_date == data_date){
                    if(time < start_time){
                        alert("不在開放期間");
                        data.find('td').css( "background-color", "#0040ff" );


                    }

                }

                if(end_date == data_date){
                    if(time > end_time){
                        alert("不在開放期間");
                        data.find('td').css( "background-color", "#0040ff" );
                    }

                }
                
                max--;
            }

            delete get_click_change_items;
            delete str;

        } else {

        //判斷有沒有被選過 -- 被選過只做清除標記
        var check_class = $(this).hasClass("select_change_items");

            if (check_class) {
            clean_select_change_items();
 
            } else {
            clean_select_change_items();
            //點選增加暫時的class,及字變色
                $(self).last().addClass('select_change_items').css("color", "rgb(255, 17, 17)");
            }

        }

        delete self;
         
    });

    /**
     * 右邊  -- 點擊變色
     * 右欄 PV 選單內容
     */
    $(".search-result-items").on("click", ".insert-item",function(event){
        
        var self = this;

        /**
         * 連續插入
         */
        if ($('#val_insert_single_programs').val() == "1") {

            var check_class = $(this).hasClass("click_change_items");

            if (check_class) {
                $(this).last().removeClass('click_change_items').css("color", "black");
            } else {
                /**
                 * 移除舊的選取資料
                 */
                elta.cue.sel.single(self);
            }

        }
        /**
         * 集體插入
         */
        else if ($('#val_insert_mulit_programs').val() == "1") {

            var check_class = $(this).hasClass("click_change_items");

            if (check_class) {
                $(this).last().removeClass('click_change_items').css("color", "black");
            } else {
                /**
                 * 選取資料
                 */
                $(this).last().addClass('click_change_items').css("color", "mediumblue");
            }


        } else {
        var checked_items = $(".search-result-items").find(".insert-item");
        //判斷有沒有被選過 -- 被選過只做清除標記
        var check_class = $(this).hasClass("click_change_items");
            if (check_class) {
            //找出已存在search-result-items加以刪除,回複原字色
            clean_click_change_items();
            } else {
             //找出已存在search-result-items加以刪除,回複原字色
            clean_click_change_items();
        
            //點選增加暫時的class,及字變色
            $(this).last().addClass('click_change_items').css("color","rgb(255, 17, 17)");
        }
        }

        delete self;

    });

    // /**
    //  * 右邊 -- 點擊變色
    //  * 右欄 AD 選單內容
    //  */
    // $(".search-result-items").on("click", ".item-ad", function(event) {

    //     var self = this;

    //     /**
    //      * 連續插入
    //      */
    //     if ($('#val_insert_single_programs').val() == "1") {

    //         var check_class = $(this).hasClass("click_change_items");

    //         if (check_class) {
    //             $(this).last().removeClass('click_change_items').css("color", "black");
    //         } else {
    //             /**
    //              * 移除舊的選取資料
    //              */
    //             elta.cue.sel.single(self);
    //         }

    //     }
    //     /**
    //      * 集體插入
    //      */
    //     else if ($('#val_insert_mulit_programs').val() == "1") {

    //         var check_class = $(this).hasClass("click_change_items");

    //         if (check_class) {
    //             $(this).last().removeClass('click_change_items').css("color", "black");
    //         } else {
    //             /**
    //              * 選取資料
    //              */
    //             $(this).last().addClass('click_change_items').css("color", "mediumblue");
    //         }

    //     } else {

    //     }

    //     delete self;
            
    // });

    //按下更新按鈕動作 -- 單筆
    $("#change_one_program").on("click", function(){

        /**
         * 清除 insert 連續插入 
         */
        elta.cue.clear.btns();

        //找中間點選的節點
        var get_select_change_items = $("#schedule-form").find(".select_change_items");
        //找左邊的節點
        var get_click_change_items = $(".search-result-items").find(".click_change_items");

        //比對兩邊有沒有被點選
        var midden_num = get_select_change_items.length;
        var right_num = get_click_change_items.length;
        var match_string = "insert-item";
        var get_select_change_items_class = get_select_change_items.attr("class");
        
        //需要有紅字,且只有pv可以變
        if (midden_num == 1 && right_num == 1 && get_select_change_items_class.match(match_string)) {
            //重新覆制一份並加到後面一行
            get_select_change_items.last().after(get_click_change_items.clone().appendTo(get_select_change_items));
            //刪除上一行
            get_select_change_items.remove();
            //initial
            clean_select_change_items();
            //重整並寫入資料
            updateItemDuration(true);
            checkDuplicateAll();
            
        } else {
            console.log("沒有任何變更!");
        }
        
    });

    //按下批量PV點選按鈕動作
    $("#check_mulit_programs").on("click",function(){

        /**
         * 清除 insert 連續插入 
         */
        elta.cue.clear.btns();

        //找中間點選的節點
        var get_select_change_items = $("#schedule-form").find(".select_change_items");
        //找左邊的節點
        var get_click_change_items = $(".search-result-items").find(".click_change_items");
         //比對兩邊有沒有被點選
        var midden_num = get_select_change_items.length;
        var right_num = get_click_change_items.length;
        var match_string = "insert-item";
        var get_select_change_items_class = get_select_change_items.attr("class");
        
        //需要有紅字,且只有pv可以變
        if (midden_num == 1 && right_num == 1 && get_select_change_items_class.match(match_string)) {
            //取得中間節目節點data-data_id
            var data_id = get_select_change_items.attr("data-data_id");
            //console.log("點到的節點: " + data_id);
            
            //找尋中間所有pv節目節點的data-data_id
            $("#schedule-form").find(".schedule-program").each(function(index){
   
                $(this).find(".insert-item").each(function(){
                    var get_data_id = $(this).attr("data-data_id");
                    
                    if (data_id == get_data_id) {
                        //如果data-data_id一樣增加暫時的class,及字變色
                        $(this).last().addClass('select_change_items').css("color","rgb(0, 153, 0)");
                    }
                    
                });
               
            });


        };

    });

    //按下批量PV變更按鈕動作
    $("#change_mulit_programs").on("click",function(){

        /**
         * 清除 insert 連續插入 
         */
        elta.cue.clear.btns();

        //找中間點選的節點
        var get_select_change_items = $("#schedule-form").find(".select_change_items");
        //找左邊的節點
        var get_click_change_items = $(".search-result-items").find(".click_change_items");
         //比對兩邊有沒有被點選
        var midden_num = get_select_change_items.length;
        var right_num = get_click_change_items.length;
        var match_string = "insert-item";
        var get_select_change_items_class = get_select_change_items.attr("class");
        
        //需要有紅字,且只有pv可以變
        if (midden_num >= 1 && right_num == 1 && get_select_change_items_class.match(match_string)) {
            //重新覆制一份並加到後面一行
            get_select_change_items.each(function(){
                $(this).after(get_click_change_items.clone().appendTo($(this)));
                //刪除上一行
                $(this).remove();
            
            });

            //initial
            clean_select_change_items();
            //重整並寫入資料
            updateItemDuration(true); 
            checkDuplicateAll();  





        } else {
            console.log("沒有任何變更!");
        }
    });

    //清除紅色標記按鈕
    $("#dele_select").on("click",function(){
        /**
         * 清除 insert 連續插入 
         */
        elta.cue.clear.btns();

        /**
         * 找中間點選的節目
         */
        clean_select_change_items();

        /**
         * 找右邊點選的節目
         */
        clean_click_change_items();
    
        /**
         * 清除 search-result-items(右邊 pv )加以刪除,回複原字色
         */
        elta.cue.clear.right_pv_click_item();

        /**
         * 清除 search-result-items(右邊 ad )加以刪除,回複原字色
         */
        elta.cue.clear.right_ad_click_item();


    });
    
     /**
     * 
     * 單筆及多筆節目變更 --- Raphael  ---- end
     *
     */
     

    /**
     * 連續插入
     */
    $("#btn_insert_single_programs").on("click", function() {

        /**
         * 開始 insert 連續插入  
         */
        elta.cue.btns.singel();

    });

    /**
     * 集體插入
     */
    $("#btn_insert_mulit_programs").on("click", function() {

        /**
         * 開始集體插入  
         */
        elta.cue.btns.mulit();

    });

     /**
     * 
     * table 間隔板托動 --- Raphael  ---- start
     *
     */
     function syncTableWidth(e){
    var parent = e.currentTarget;
    
    $("#schedule-view table").filter(function(){return $(this).attr("id") != $(parent).attr("id")}).each(function(){
        //Match the width
        $("tr th", this).each(function(index){
            $(this).css("width",$("tr th:nth-of-type("+(index+1)+")", parent).css("width"))
        });
        //Match the grip's position
        $(this).prev().find(".JCLRgrip").each(function(index){
            $(this).css("left",$(parent).prev().find(".JCLRgrip:nth-of-type("+(index+1)+")").css("left"));
       });
    }); 
}
    $(".schedule-left-data, .search-result-items").colResizable({
        liveDrag: true
    });

    $(".schedule-program").colResizable({
        liveDrag: true,
        onDrag:syncTableWidth
    });


     
     /**
     * 
     * table 間隔板托動 --- Raphael  ---- end
     *
     */
    

    /**
     * 排程物件右鍵選單
     * 新增右鍵單筆插入功能 ---- Raphael 27.07.15
     */
    $.contextMenu({
        selector: '#schedule-queue .item-pv, #schedule-queue .item-ad', 
        build: function($trigger, e) {
            return {
                callback: function(key, options) {
                //     var m = "clicked: " + key;
                //     window.console && console.log(m) || alert(m);
                },
                items: {
                    "information": {
                        name: "此物件排程資訊",
                        callback: function(key, options) {

                            console.clear();

                        var info = $("#dialog-item-info");
                            var num = {
                                'normal': 0,
                                'live': 0
                            };
                        //取得物件所有trigger
                        var target = options.$trigger,
                            data_id = target.data("data_id"),
                                data_type = target.data("data_type").toLowerCase(),
                                data_title = target.data("data_title");

                            var datepicker = $('#datepicker').val();

                            var $_items = [];
                            var items = $('table.schedule-program', $('#schedule-form'));
                            var $row = 0;
                            var $_pg = '';

                            $.post("action_url?act=get-pvad-dates", {
                                act: "get-pvad-dates",
                                ch: $("#channel-picker").val(),
                                date : $('#datepicker').val(),
                                data_type : data_type, 
                                data_id : data_id,
                                r : Math.random() * 99999999
                            }, function(datas){

                                var $str = "";

                                $('ul.header li:eq(0)', info).html( "[" + data_type.toUpperCase() + "]" + data_title );
                                if (datas.rs==1){
                                    var cnt = 0;

                                    $.each( datas.items, function($idx, $item){
                                        $str += "<ul>";
                                        $str += "<li>" + $item.date_idx + "</li><li>" + $item.start_time + "-"+$item.end_time+"</li><li>" + $item.title + "</li><li style='text-align: right;'>" + $item.nums + "次</li>";
                                        $str += "</ul>";  
                                        cnt = cnt +   parseInt($item.nums);                                  
                                    });
                                    $str += "<ul>";
                                    $str += "<li></li><li></li><li></li><li style='text-align: right;'>共" + cnt + "次</li>";
                                    $str += "</ul>";


                                }

                                $('ul:not(.header)', info).remove();
                                $('ul.header', info).after($str);

                            }, "JSON");                            
                            
                            var btn = $(this);

                            delete items;
                            delete $_items;
                            delete $str;

                            info.dialog({
                                width: 680,
                                position: {
                                    my: "left top",
                                    at: "left bottom",
                                    of: btn
                                },
                                resizable: true,
                                modal: true,
                                buttons: {
                                    "CancelButton": {
                                        text: '取消',
                                        id: 'dialog-tips-btn-cancel',
                                        click: onDialogCancel
                                    }
                                }
                            });

                        }
                    },
                    "sep1":               "---------",
                    /*
                    "replace-in-program": {name: "替換此節目所有該物件", callback: function(key, options){
                        var target = options.$trigger, block = target.parent();

                        $("#dialog-item-replace-form").dialog({
                            width:    360,
                            height:   400,
                            position: { my: "left top", at: "left bottom", of: target },
                            buttons:  {
                                "CancelButton" : {
                                    text: '取消',
                                    id: 'dialog-item-replace-btn-cancel',
                                    click: onDialogCancel
                                }
                            },

                            open: function (event, ui) {

                            },

                            create: function (event, ui) {
                                var from = {}, to = {
                                    replace.data("data_id")
                                    replace.data("data_title")
                                    replace.data("duration"))
                                    replace.data("data_type").toUpperCase()

                                };

                                $("#dialog-item-replace-search-results .search-result-items tbody").on("click", "tr", function(data){
                                    if (confirm("確認要替換此節目所有該物件？\n替換後將無法恢復。")) {
                                        var replace = $(this).clone(true);
                                        var from = {
                                            klass   : "item-"+target.data("data_type").toLowerCase()
                                        };
                                        var to = {
                                            klass     : "item-"+replace.data("data_type").toLowerCase(),
                                            data_id   : replace.data("data_id"),
                                            data_title: replace.data("data_title"),
                                            duration  : replace.data("duration")),
                                            data_type : replace.data("data_type").toUpperCase()
                                        };

                                        block.find("."+from.klass).each(function(idx, item){
                                            var self = $(item);

                                            console.log(self);

                                            if (self.data("data_id") === target.data("data_id")) {
                                                self.find(".item-data_id").text(replace.data("data_id"));
                                                self.find(".item-title").text(replace.data("data_title"));
                                                self.find(".item-duration").text(durationFormat(replace.data("duration")));
                                                self.find(".item-type").text(replace.data("data_type").toUpperCase());

                                                self.data("duration", replace.data("duration"));
                                                self.data("data_type", replace.data("data_type"));
                                                self.data("data_id", replace.data("data_id"));
                                                self.data("data_title", replace.data("data_title"));

                                                self.removeClass(from.klass).addClass(to.klass);
                                            }
                                        });
                                        updateItemDuration(true);
                                    }

                                });


                                $("#dialog-item-replace-search-keyword").autocomplete({
                                    minLength: 0,
                                    source: function (request, response) {
                                        var results = $("#dialog-item-replace-search-results .search-result-items tbody");
                                        var html    = [];
                                        html = doItemSearch($("#dialog-item-replace-search-type").val(), request.term);
                                        results.html(html.join('\n'));
                                        results.trigger("update");
                                    }
                                });

                                $("#dialog-item-replace-search-type").on("change", function(){
                                    var results = $("#dialog-item-replace-search-results .search-result-items tbody");
                                    var html    = [];
                                    html = doItemSearch($(this).val(), $.trim($("#dialog-item-replace-search-keyword").val()));
                                    results.html(html.join('\n'));
                                    results.trigger("update");
                                });
                            }
                        });


                    }},
                    */
                   
                    /*
                    "replace-in-date": {
                        name: "替換此日期所有該物件",
                        items: {
                            select: {
                                name: "替換成...",
                                type: 'select', 
                                options: {1: 'abc'}
                            }
                        }
                    }
                    */

                   
                    "sep2":               "---------",
                    "remove-in-program": {
                        name: "刪除此節目所有該物件",
                        callback: function(key, options) {
                        if (confirm("此動作將會刪除所有該節目的此物件。\n刪除後將無法復原！")) {
                                var target = options.$trigger,
                                    block = target.parent(),
                                    remove_data_id = target.data("data_id");
                            block.find("tr").each(function(idx, item){
                                var self = $(item);
                                if (self.data("data_id") === remove_data_id) {
                                    self.remove();
                                }
                            });
                            updateItemDuration(true);
                        }
                        }
                    },
                    
                    "remove-in-date": {
                        name: "刪除此日期所有該物件",
                        callback: function(key, options) {
                        if (confirm("此動作將會刪除該排程日期所有此物件。\n刪除後將無法復原！")) {
                            var remove_data_id = options.$trigger.data("data_id");
                            $(".schedule-program tbody tr").each(function(idx, item){
                                var self = $(item);
                                if (self.data("data_id") === remove_data_id) {
                                    self.remove();
                                }
                            });
                            updateItemDuration(true);
                        }
                        }
                    },
                    
                    "change-program-data": {
                        name: "<font color='#FE2E64'>插入單一節目</font>",
                        callback: function(key, options) {
                            console.log("單一PV節目");
                            
                            //initial
                            clean_select_change_items();
                            
                            var remove_data_id = options.$trigger.data("data_id");
                            $(this).addClass('select_change_items').css("color","rgb(255, 17, 17)");
                            //找中間點選的節點
                            var get_select_change_items = $("#schedule-form").find(".select_change_items");
                            //找左邊的節點
                            var get_click_change_items = $(".search-result-items").find(".click_change_items");
                    
                            //比對兩邊有沒有被點選
                            var midden_num = get_select_change_items.length;
                            var right_num = get_click_change_items.length;
                            if (midden_num == 1 && right_num == 1) {
                                //重新覆製一份並加到後面一行
                                get_select_change_items.last().after(get_click_change_items.clone().appendTo(get_select_change_items));
                                //不刪除直接插入
                                //get_select_change_items.remove();
                                //initial
                                clean_select_change_items();
                                //重整並寫入資料
                                updateItemDuration(true);
                                var time =  get_select_change_items.last().next().find('td.item-start').text().trim();
                                var start_date = get_select_change_items.last().next().find('td.item-ENABLE_START_DATE').text().trim();
                                var start_time = get_select_change_items.last().next().find('td.item-ENABLE_START_TIME').text().trim();
                                var end_date = get_select_change_items.last().next().find('td.item-ENABLE_END_DATE').text().trim();
                                var end_time = get_select_change_items.last().next().find('td.item-ENABLE_END_TIME').text().trim();
                                var data_date = $("#data_date").val().trim();

                                var thisitem = get_select_change_items.last().next();
                                var prev_item =thisitem.prev();
                                var next_item =thisitem.next();
                                var this_type =thisitem.find('td.item-type').text().trim();
                                var prev_item_title = prev_item.find('td.item-title').text().trim();
                                var this_item_title =thisitem.find('td.item-title').text().trim();
                                var next_item_title = next_item.find('td.item-title').text().trim();
                                 checkDuplicate(thisitem);
                                // if(this_type == "PV" && (this_item_title == prev_item_title || this_item_title == next_item_title )){
                                //      alert("重複PV");
                                //      thisitem.find('td').addClass("error_item");
                                //     // thisitem.find('td').css( "background-color", "#0040ff" );
                                // }



                                console.log(time + ", " +start_date + ", " + start_time + ", " + end_date + ", " + end_time);

                                if(start_date == data_date){
                                    if(time < start_time){
                                        alert("不在開放期間");
                                         get_select_change_items.last().next().find('td').css( "background-color", "#0040ff" );
                                    }
                                }

                                if(end_date == data_date){
                                    if(time > end_time){
                                        alert("不在開放期間");
                                        get_select_change_items.last().next().find('td').css( "background-color", "#0040ff" );
                                    }
                                }
                            } else {
                                console.log("沒有任何變更1!");
                            }
                            
                            
                        
                        }
                    },
                    
                }
            };
        }
    });
    
    
    //PG右鍵選單
    $.contextMenu({
        selector: '#schedule-queue .item-pg', 
        build: function($trigger, e) {
            return {
                callback: function(key, options) {
                //     var m = "clicked: " + key;
                //     window.console && console.log(m) || alert(m);
                },
                items: {
                    
                    "change-program-data": {
                        name: "<font color='#FE2E64'>插入單一節目</font>",
                        callback: function(key, options) {
                            //initial
                            clean_select_change_items();
                            
                            var remove_data_id = options.$trigger.data("data_id");
                            $(this).addClass('select_change_items').css("color","rgb(255, 17, 17)");
                            //找中間點選的節點
                            var get_select_change_items = $("#schedule-form").find(".select_change_items");
                            //找左邊的節點
                            var get_click_change_items = $(".search-result-items").find(".click_change_items");
                    
                            //比對兩邊有沒有被點選
                            var midden_num = get_select_change_items.length;
                            var right_num = get_click_change_items.length;
                            if (midden_num == 1 && right_num == 1) {
                                //重新覆製一份並加到後面一行
                                get_select_change_items.last().after(get_click_change_items.clone().appendTo(get_select_change_items));
                                //不刪除直接插入
                                //get_select_change_items.remove();
                                //initial
                                clean_select_change_items();
                                //clean_click_change_items();
                                //重整並寫入資料
                                //updateItemDuration(true);
                                console.log("有任何變更2!");
                            } else {
                                console.log("沒有任何變更2!");
                            }
                            
                        }
                    },
                    
                }
            };
        }
    });
    
    
    
    
    //右邊右鍵選單
    $.contextMenu({
        selector: '#item-results .insert-item', 
        build: function($trigger, e) {
            return {
                callback: function(key, options) {
                //     var m = "clicked: " + key;
                //     window.console && console.log(m) || alert(m);
                },
                items: {
                    
                    "change-program-data": {
                        name: "<font color='#FE2E64'>插入單一節目</font>",
                        callback: function(key, options) {
                            //initial
                            clean_click_change_items();
                        
                            var remove_data_id = options.$trigger.data("data_id");
                            
                            //$(this).addClass('click_change_items').css("color","rgb(255, 17, 17)");
                            $(this).addClass('click_change_items');
                            //找中間點選的節點
                            var get_select_change_items = $("#schedule-form").find(".select_change_items");
                            //找左邊的節點
                            var get_click_change_items = $(".search-result-items").find(".click_change_items");
                    
                            //比對兩邊有沒有被點選
                            var midden_num = get_select_change_items.length;
                            var right_num = get_click_change_items.length;
                            if (midden_num == 1 && right_num == 1) {
                                //重新覆製一份並加到後面一行
                                get_select_change_items.last().after(get_click_change_items.clone().appendTo(get_select_change_items));
                                //不刪除直接插入
                                //get_select_change_items.remove();
                                //initial
                                //clean_select_change_items();
                                clean_click_change_items();
                                //重整並寫入資料
                                updateItemDuration(true);

                                var time =  get_select_change_items.last().next().find('td.item-start').text().trim();
                                var start_date = get_select_change_items.last().next().find('td.item-ENABLE_START_DATE').text().trim();
                                var start_time = get_select_change_items.last().next().find('td.item-ENABLE_START_TIME').text().trim();
                                var end_date = get_select_change_items.last().next().find('td.item-ENABLE_END_DATE').text().trim();
                                var end_time = get_select_change_items.last().next().find('td.item-ENABLE_END_TIME').text().trim();
                                var data_date = $("#data_date").val().trim();

                                var thisitem = get_select_change_items.last().next();
                                var prev_item =thisitem.prev();
                                var next_item =thisitem.next();
                                var this_type =thisitem.find('td.item-type').text().trim();
                                var prev_item_title = prev_item.find('td.item-title').text().trim();
                                var this_item_title =thisitem.find('td.item-title').text().trim();
                                var next_item_title = next_item.find('td.item-title').text().trim();
                                 checkDuplicate(thisitem);
                                // if(this_type == "PV" && (this_item_title == prev_item_title || this_item_title == next_item_title )){
                                //      alert("重複PV");
                                //      thisitem.find('td').addClass("error_item");
                                //     // thisitem.find('td').css( "background-color", "#0040ff" );
                                // }



                                console.log(time + ", " +start_date + ", " + start_time + ", " + end_date + ", " + end_time);

                                if(start_date == data_date){
                                    if(time < start_time){
                                        alert("不在開放期間");
                                         get_select_change_items.last().next().find('td').css( "background-color", "#0040ff" );
                                    }
                                }

                                if(end_date == data_date){
                                    if(time > end_time){
                                        alert("不在開放期間");
                                        get_select_change_items.last().next().find('td').css( "background-color", "#0040ff" );
                                    }
                                }

                                


                            } else {
                                console.log("沒有任何變更3!");
                            }
                            
                        }
                    },
                    
                    
                    
                    
                }
            };
        }
    });
    
    /**
     * 排程物件右鍵選單 end
     * 
     */


});