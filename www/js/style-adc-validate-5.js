$(function(){

    //客戶與代理商表單
    $("#form-edit-coustom").validate({
        rules: {
            company_full_name: {
                required: true,
                maxlength: 50
            },
            company_short_name: {
                required: true,
                maxlength: 20
            },
            owner: {
                required: true,
                maxlength: 20
            },
            uniform: {
                required: true,
                maxlength: 8
            },
            tel: {
                required: true,
                maxlength: 20
            },
            mailing_address: {
                required: true,
                maxlength: 50
            },
            finance_name: {
                required: true,
                maxlength: 20
            },
            finance_phone: {
                required: true,
                maxlength: 20
            },
            finance_email: {
                required: true,
                maxlength: 50,
                email: true
            },
            business_name: {
                required: true,
                maxlength: 20
            },
            business_phone: {
                required: true,
                maxlength: 20
            },
            business_email: {
                required: true,
                maxlength: 50,
                email: true
            }
        },
        messages: {
            company_full_name: "請輸入公司名稱",
            company_short_name: "請輸入公司簡稱",
            owner: "請輸入公司負責人名",
            uniform: "請輸入公司統一編號",
            tel: "請輸入公司電話",
            mailing_address: "請輸入公司通訊地址",
            finance_name: "請輸入姓名",
            business_name: "請輸入姓名",
            business_phone: "請輸入連絡電話",
            finance_phone: "請輸入連絡電話",
            finance_email: {
                required: "請輸入電子信箱",
                email: "帳號不符信箱格式"
            },
            business_email: {
                required: "請輸入電子信箱",
                email: "帳號不符信箱格式"
            }
        }
    });

});