const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');



const Notices = require('../models/tourism.model');


const multer = require('multer');

const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null,new Date().toISOString()+file.originalname);
    }
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='application/pdf'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
};
const upload = multer({storage:storage,limit:{
    fileSize:1024 * 1024 * 5
},
fileFilter:fileFilter
}); 



router.get('/',(req,res,next)=>{
    Notices.find()
    .select('_id site description contacts tourId  productImage createdAt updatedAt')
    .exec()
    .then(doc=>{
    
       console.log(doc);
     
       const response={
           count:doc.length,
            
           notices:doc.map(docs=>
              {
               
               return {
                   id:docs._id,
                   site:docs.site,
                   description:docs.description,
                   contacts:docs.contacts,
                   location:docs.location,//added
                   //tourId:docs.tourId,//added
                   //address:docs.address,
                   productImage:docs.productImage,
                   updatedAt:docs.updatedAt,
                   createdAt:docs.createdAt,
                   listTourImages:docs.productImage[0],
               request:{
                 type:'GET',
                 //url:'http://202.1.39.151:3000/tourism/' + docs._id
                 url:'http://nictc-sgp1.chervicontraining.com:3000/tourism/' + docs._id
               },
               
               requestAvatar:{
                   type:'GET',
                   url:docs.productImage[0]
                 }
   
               }
               }
       )}
       ;
         
       res.status(200).json(response); //change back to docs
   })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
   });


//add a new alumni route
router.post('/',upload.array('productImage',4),(req,res,next)=>{
  
    
    var arr = [];
    for (var i = 0; i < req.files.length; ++i) {
      //arr.push('http://202.1.39.151:3000/'+req.files[i].path );
      arr.push('http://nictc-sgp1.chervicontraining.com:3000/'+req.files[i].path );
    };

        const notice = new Notices({
            _id: new mongoose.Types.ObjectId(),
            site:req.body.site,
            description: req.body.description,
            tourId:req.body.tourId,
            address:req.body.address,
            contacts:req.body.contacts,
            productImage:arr
        }); 
        notice
        .save()
        .then((noticeData)=>{
            console.log(noticeData);
            res.status(201).json({
                message:'New Notice created',
                createdNotice:noticeData
               });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error:err});
        });

});


// //get single alumni route
router.get('/:noticeId',(req,res,next)=>{
    const id=req.params.noticeId;
    Notices.findById(id)
    .select('_id site description  contacts tourId address  productImage createdAt')
    .exec()
    .then(doc=>{
       console.log('From DB',doc);
       if(doc){
        res.status(200).json(doc);
       }
        else{
            res.status(400).json({
                message:'No valid notice for the given ID'
            });
        }
      
   })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
   });
   

   router.put('/:noticeId',(req,res)=>{
    const _id = req.params.noticeId;

    Notices.findOneAndUpdate({ _id },
      req.body,
      { new: true },
      (err, notice) => {
      if (err) {
         res.status(400).json(err);
      }
       res.json(notice);
    });
    });


//delete route

router.delete('/:noticeId',(req,res,next)=>{
    const id=req.params.noticeId;
    Notices.deleteOne({_id:id})
    .exec()
    .then(result=>{
       res.status(200).json(result);
   })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
   });



module.exports = router;


/**
 * const Store = require('../models/Store');

// @desc  Get all stores
// @route GET /api/v1/stores
// @access Public
exports.getStores = async (req, res, next) => {
  try {
    const stores = await Store.find();

    return res.status(200).json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc  Create a store
// @route POST /api/v1/stores
// @access Public
exports.addStore = async (req, res, next) => {
  try {
    const store = await Store.create(req.body);

    return res.status(201).json({
      success: true,
      data: store
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This store already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};
 */

