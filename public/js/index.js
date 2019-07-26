
// 每页显示多少条
var show_count = 5;
// 当前显示的页码
var current_page = 1;
// 总页数
var all_pages;
// 记录查询的条件
var condition = {}


// 搜索
$('body').on('click','#search-btn',()=>{
    searchRefresh();
});

function searchRefresh() {
    var paramArr = $('#search-form').serializeArray();
    paramArr.forEach(item=>{
        condition[item.name] = item.value;
    });
    // condition.username = '张三';
    console.log(condition);
    // 得到搜索条件之后渲染条件列表
    renderCondition();
    $('#searchModal').modal('hide');
    // 重新获取学生列表
    refreshStuList();
    // 重置页码
    current_page = 1;
    // 重置搜索表单元素
    $('#search-form').get(0).reset();
}
// 渲染搜索的条件列表
function renderCondition() {
    var condStr = template('condition-tmp',condition);
    $('#search-list').html(condStr);
}

// 删除某个查询条件
$('body').on('click','.condition-btn',function(){
    // console.log($(this).attr('con'));
    condition[$(this).attr('con')] = '';
    // 刷新搜索结果
    // searchRefresh();
    renderCondition();
    refreshStuList();
});



// 获取学生列表
refreshStuList();
function refreshStuList() {
    condition.page = current_page;
    condition.show_count = show_count;
    console.log(condition);
    $.get('/stu/list', condition,data=>{
        // console.log(data);
        if (data.err == 0) {
            var stus = data.stus;
            // console.log(stus);
            //把学生信息渲染到页面上
            var htmlstr = template('stulist-tmp',data);
            $('#stu-list').html(htmlstr);

            // 渲染页码
            all_pages = data.allPages;
            var pagestr = template('page-tmp',{current_page,all_pages});
            $('#page-list').html(pagestr);
        }
    });
}
// 上一页
$('#page-list').on('click','#page-prev',()=>{
    if (current_page > 1) {
        current_page --;
        refreshStuList();
    }
});

// 下一页
$('#page-list').on('click','#page-next',()=>{
    if (current_page < all_pages) {
        current_page ++;
        refreshStuList();
    }
});

// 点击具体的页码数
$('#page-list').on('click','.page-index',(ev)=>{
    // console.log($(ev.target)
    // console.log($(ev.target).parent().index());
    current_page = $(ev.target).parent().index();
    refreshStuList();
});



// 添加学生信息
$('#add-btn').click(()=>{
    var param = $('#add-form').serialize();
    console.log(param);
    $.post('/stu/add',param,data=>{
        // console.log(data);
        if (data.err == 0) {
            $('#addModal').modal('hide');
            refreshStuList();
        }
        layer.msg(data.msg);
    });
});

// 编辑 删除按钮都是后添加的，需要使用代理添加点击事件

// 编辑学生信息
$('#stu-list').on('click','#edit-btn',ev=>{
    $('#editModal').modal('show');
    var stuid = $(ev.target).attr('stuid');
    // 找到要编辑的学生
    // console.log(stuid);
    // 1.通过id向数据中查询要编辑的学生信息
    $.get('/stu/one',{_id:stuid},data=>{
        if (data.err == 0) {
            // 在编辑学生的模态框中展示学生的信息
            var stu = data.stu;
            $('#edit-form').find('input[name=username]').val(stu.username);
            $('#edit-form').find('input[name=age]').val(stu.age);
            $('#edit-form').find(stu.gender=='男' ? "#male" : "#female").prop('checked',true);
            $('#edit-form').find('input[name=tel]').val(stu.tel);
            $('#edit-form').find('input[name=email]').val(stu.email);
            $('#edit-form').find('input[name=des]').val(stu.des);
        }
        // 修改学生信息
        $('#save-btn').click(()=>{
            // age=22&gender=%E5%A5%B3&tel=15093251310&email=&des=
            var param = $('#edit-form').serialize()+"&_id="+stuid;
            // console.log(param);
            $.post('/stu/edit',param,data=>{
                // console.log(data);
                if (data.err == 0) {
                    $('#editModal').modal('hide');
                    refreshStuList();
                }
                layer.msg(data.msg);
            });
        });
    });

    // 2.根据上面获取的学生列表得到要编辑的学生信息
});


// 删除学生信息
$('#stu-list').on('click','#del-btn',ev=>{
    layer.confirm('是否删除？',{
        btn:['删除','取消']
    },()=>{
        // 获取学生id
        // console.log($(ev.target).attr('stuid'));
        var stuid = $(ev.target).attr('stuid');
        $.get('/stu/del',{_id:stuid},data=>{
            console.log(data);
            if (data.err == 0) {
                refreshStuList();
            }
            layer.msg(data.msg);
        });
    },()=>{
        console.log('取消删除');log($(ev.target).attr('stuid'));
        var stuid = $(ev.target).attr('stuid');
        $.get('/stu/del',{_id:stuid},data=>{
            console.log(data);
            if (data.err == 0) {
                refreshStuList();
            }
            layer.msg(data.msg);
        });
    },()=>{
        console.log('取消删除');
    });
    
});

