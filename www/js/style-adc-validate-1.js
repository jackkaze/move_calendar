$(function(){

    //新增個人資料
    $("#form-add-user").validate({
        rules: {
            name: {
                required: true,
                maxlength: 20
            },
            company: {
                required: true,
                maxlength: 50
            },
            username: {
                required: true,
                maxlength: 50,
                email: true
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 16
            },
            password_confirm: {
                required: true,
                minlength: 6,
                maxlength: 16,
                equalTo: '#password'
            },
            mobile: {
                required: true,
                maxlength: 12,
            },
            email: {
                required: true,
                maxlength: 50,
                email: true
            }
        },
        messages: {
            name: "請輸入姓名",
            company: "請輸入公司名稱",
            username: {
                required: "請輸入登入帳號",
                email: "帳號不符信箱格式"
            },
            password: {
                required: "請輸入登入密碼",
                minlength: "密碼限6-16個英數字"
            },
            password_confirm: {
                required: "請輸入驗證密碼",
                minlength: "密碼限6-16個英數字",
                equalTo: "與登入密碼不符"
            },
            mobile: "請輸入行動電話",
            email: {
                required: "請輸入電子信箱",
                email: "信箱不符格式"
            }
        }
    });

    //編輯個人資料
    $("#form-edit-user").validate({
        rules: {
            name: {
                required: true,
                maxlength: 20
            },
            company: {
                required: true,
                maxlength: 50
            },
            username: {
                required: true,
                maxlength: 50,
                email: true
            },
            password: {
                minlength: 6,
                maxlength: 16
            },
            password_confirm: {
                minlength: 6,
                maxlength: 16,
                equalTo: '#password'
            },
            mobile: {
                required: true,
                maxlength: 12,
            },
            email: {
                required: true,
                maxlength: 50,
                email: true
            }
        },
        messages: {
            name: "請輸入姓名",
            company: "請輸入公司名稱",
            username: {
                required: "請輸入登入帳號",
                email: "帳號不符信箱格式"
            },
            password: {
                required: "請輸入登入密碼",
                minlength: "密碼限6-16個英數字",
                maxlength: "密碼限6-16個英數字"
            },
            password_confirm: {
                required: "請輸入驗證密碼",
                minlength: "密碼限6-16個英數字",
                maxlength: "密碼限6-16個英數字",
                equalTo: "與登入密碼不符"
            },
            mobile: "請輸入行動電話",
            email: {
                required: "請輸入電子信箱",
                email: "信箱不符格式"
            }
        }
    });


});