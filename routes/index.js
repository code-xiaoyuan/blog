var express = require('express');
var router = express.Router();

var Student = require('../modules/db/student');

// 添加学生
router.post('/stu/add',(req,res)=>{
    console.log(req.body);
    new Student(req.body).save()
    .then(()=>{
        res.json({err:0,msg:'添加成功'});
    })
    .catch(err=>{
        res.json({err:1,msg:err});
    });
});

// 获取所有学生信息
router.get('/stu/list',(req,res)=>{
    // 每页显示多少条
    var show_count = req.query.show_count*1;
    // 当前的页码
    var page = req.query.page*1;
    var condition = {};
    if (req.query.username) {
        condition.username = new RegExp(req.query.username,'gi');
    }
    if (req.query.age) {
        condition.age = req.query.age;
    }
    if(req.query.gender){
        condition.gender = req.query.gender
    }
    if (req.query.tel) {
        condition.tel = req.query.tel
    }
    
    console.log(condition);
    console.log('----------------------------------');
    var p1 = Student.find(condition).countDocuments();
    var p2 = Student.find(condition).skip((page-1)*show_count).limit(show_count);
    var p3 = Promise.all([p1,p2]);
    p3
    .then(data=>{   
        console.log(data);
        res.json({
            err:0,
            allPages:Math.ceil(data[0]/show_count), //总页数
            stus:JSON.parse(JSON.stringify(data[1])),
        });
    }).catch(err=>{
        res.json({err:1,msg:err});
    });
});

// 获取某个学生的信息
router.get('/stu/one',(req,res)=>{
    Student.findOne({_id:req.query._id},(err,data)=>{
        res.json({err:0,stu:JSON.parse(JSON.stringify(data))});
    });
});


// 编辑学生信息
router.post('/stu/edit',(req,res)=>{
    console.log(req.body);
    Student.updateOne({_id:req.body._id},{
        age:req.body.age,
        gender:req.body.gender,
        tel:req.body.tel,
        email:req.body.email,
        des:req.body.des,
    })
    .then(()=>{   
        res.json({err:0,msg:'修改成功'});
    }).catch(err=>{
        res.json({err:1,msg:err});
    });
});

// 删除学生信息
router.get('/stu/del',(req,res)=>{
    Student.deleteOne({_id:req.query._id})
    .then(()=>{
        res.json({err:0,msg:"删除成功"});
    }).catch(err=>{
        res.json({err:1,msg:err});
    });
});



module.exports = router;