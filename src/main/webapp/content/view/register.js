/**
 * Created by Administrator on 2017/8/21.
 */
$(function () {
    //iCheck for checkbox and radio inputs
    $('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-blue',
        radioClass: 'iradio_minimal-blue'
    });

    $("#form-admin-add").validate({
        rules:{
            province:{
                required:true
            },
            city:{
                required:true
            },
            area:{
                required:true
            },
            school:{
                required:true
            },
            departmentid:{
                required:true
            },
            username:{
                required:true,
                minlength:2,
                maxlength:10,
                remote: {
                    url: "/reg/getRepeatUserName",     //后台处理程序
                    type: "post",               //数据发送方式
                    dataType: "json",           //接受数据格式
                    data: {
                        userName: function() {
                            return $("#username").val();
                        }
                    },//要传递的数据
                    dataFilter: function(data) { //返回结果
                        if (data == 0)
                            return true;
                        else
                            return false;
                    }
                }
            },
            password:{
                required:true,
                minlength:5,
                maxlength:16
            },
            confirm_password:{
                required:true,
                minlength:5,
                maxlength:16,
                equalTo: "#password"
            },
            phone:{
                required:true,
                isPhone:true
            },
            email:{
                required:true,
                email:true
            },
            parentname:{
                required:true
            },
            address:{
                required:true
            }
        },
        onkeyup : false,
        submitHandler:function(form){
            $.ajax({
                url : "/reg/registerUser",
                type: "Post",
                dataType : "json",
                data:  $("#form-admin-add").serialize(),
                success : function(result) {
                    if(result != null && result != "") {
                        layer.msg('注册成功，请登录!',{icon:1,time:2000},function(index){
                            window.location = "/user/login";
                        });
                    } else {
                        layer.msg('注册失败，请从新注册!',{icon:2,time:2000},function(index){
                            //刷新当前页
                            window.location.reload();
                        });
                    }

                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    //console.log(XMLHttpRequest);
                    //console.log("error"+XMLHttpRequest+"==="+textStatus+"----"+errorThrown);
                }
            });
        }
    });


});

$(function () {

    var $ = jQuery,
        $list = $('#fileList'),
        // 优化retina, 在retina下这个值是2
        ratio = 1 || 1,

        // 缩略图大小
        thumbnailWidth = 100 * ratio,
        thumbnailHeight = 100 * ratio,

        // 初始化Web Uploader
        uploader = WebUploader.create({

            // 选完文件后，是否自动上传。
            auto: true,
            // swf文件路径
            swf:   '/content/plugins/webuploader/Uploader.swf',
            fileNumLimit: 1,
            // 文件接收服务端。
            server: '/reg/uploadPicture',
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#filePicker',
            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png'   //修改这行
            }
        });

    // 当有文件添加进来的时候
    uploader.on( 'fileQueued', function( file ) {
        var $list = $('#fileList');
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img>' +
                '<div class="info">' + file.name + '</div>' +
                '</div>'
            ),
            $img = $li.find('img');


        // $list为容器jQuery实例
        $list.append( $li );

        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb( file, function( error, src ) {
            //console.log(error+"==="+src)
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }

            $img.attr( 'src', src );
        }, thumbnailWidth, thumbnailHeight );
    });
    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress span');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<p class="progress"><span></span></p>')
                .appendTo( $li )
                .find('span');
        }

        $percent.css( 'width', percentage * 100 + '%' );
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', function( file ,response) {
        //alert("成功");
        //返回的成功路径
        //console.log(response._raw);
        $("#photo").val(response._raw);
        var fileStatusnum = uploader.getStats();
        $.fn.modalMsg("上传成功"+fileStatusnum.successNum+"个文件","success");
        $( '#'+file.id ).addClass('upload-state-done');
    });

    // 文件上传失败，显示上传出错。
    uploader.on( 'uploadError', function( file ) {
        //alert("失败");
        var $li = $( '#'+file.id ),
            $error = $li.find('div.error');

        // 避免重复创建
        if ( !$error.length ) {
            $error = $('<div class="error"></div>').appendTo( $li );
        }

        $error.text('上传失败');
        var fileStatusnum = uploader.getStats();
        layer.msg("上传失败"+fileStatusnum.uploadFailNum+"个文件",{icon:1,time:1000});
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').remove();
    });

});