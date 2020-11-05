const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');
const checkAuth = require('../middleware/check-auth');
//multer from here
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage, limit: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


//multer to here

const Teacher = require('../models/teacher.model');



//get all alumni routes
router.get('/', (req, res, next) => {
    Teacher.find()
        .select('_id  name description avatarImage createdAt updatedAt')
        .exec()
        .then(doc => {

            console.log(doc);

            const response = {
                count: doc.length,

                teachers: doc.map(docs => {
                    return {
                        id: docs._id,
                        name: docs.name,
                        description: docs.description,
                        singleViewImages: docs.avatarImage,
                        updatedAt: doc.updatedAt,
                        createdAt: doc.createdAt,
                        listViewImage: docs.avatarImage[0],
                        request: {
                            type: 'GET',
                            url: 'http://202.1.39.189:3000/teachers/' + docs._id
                        },

                        requestAvatar: {
                            type: 'GET',
                            url: docs.avatarImage[0]
                        }

                    }
                }
                )
            }
                ;

            res.status(200).json(response); //change back to docs
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

//add a new alumni route
/**router.post('/', upload.array('avatarImage', 5), (req, res, next) => {

    
    var arr = [];
    for (var i = 0; i < req.files.length; ++i) {
        arr.push('http://localhost:3000/' + req.files[i].path);
    }
    console.log(arr);

    const teacher = new Teacher({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        avatarImage: arr });

    teacher.save()
        .then((teacherData) => {
            console.log(teacherData);
            res.status(201).json({
                message: 'New Profile created',
                createdTeacher: teacherData
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});**/

router.post('/', upload.array('avatarImage', 5),(req,res,next)=>{
    Teacher.find({name:req.body.name})
    .exec()
    .then(name=>{
        if(name==req.body.name){
            return res.status(409).json({message:'Property exists.'});
        }
        else{
           
    //bcrypt.hash(req.body.password,10,(err,hash)=>{
      //  if(err){
      //      return res.status(500).json({
      //       error:err
       //     });
       // }else{
       //     const user = new User({
         //       _id: new mongoose.Types.ObjectId(),
         //       avatar:'http://localhost:3000/'+req.file.path,
         //       email: req.body.email,
         //       password:hash,
                
           // }
           // );
            //test

            //    user.save()
            //    .then(result=>{
            //        return res.status(201).json({message:'User created'});
             //   })
             //   .catch(error=>{
             //       console.log(err);
              //      res.status(500).json({error:err});
               // });
       // }//ifelse
    //});//bcrypt
    var arr = [];
    for (var i = 0; i < req.files.length; ++i) {
        arr.push('http://202.1.39.151:3000/' + req.files[i].path);
    }
    console.log(arr);

    const teacher = new Teacher({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        avatarImage: arr });

    teacher.save()
        .then((teacherData) => {
            console.log(teacherData);
            res.status(201).json({
                message: 'New property created',
                createdTeacher: teacherData
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
        
}
    })
       
});//router



//get single alumni route
router.get('/:memberId', (req, res, next) => {
    const id = req.params.memberId;
    Teacher.findById(id)
        .select('_id name description avatarImage')
        .exec()
        .then(doc => {
            console.log('From DB', doc);
            if (doc) {
                res.status(200).json(doc);
            }
            else {
                res.status(400).json({
                    message: 'No valid member for the given ID'
                });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


router.put('/:memberId', (req, res) => {
    const _id = req.params.memberId;

    Teacher.findOneAndUpdate({ _id },
        req.body,
        { new: true },
        (err, user) => {
            if (err) {
                res.status(400).json(err);
            }
            res.json(user);
        });
});





//delete route

router.delete('/:memberId', (req, res, next) => {
    const id = req.params.memberId;
    Teacher.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


module.exports = router;
