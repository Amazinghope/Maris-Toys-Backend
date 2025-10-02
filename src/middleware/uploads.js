
import multer from 'multer';
import path from 'path';


// Define Our File Storage
const storage = multer.diskStorage({
    destination: function(req, res, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

// Filter images to be allowed
const fileFilter = (req, file, cb)=>{
  let  allowedTypes = /png|jpeg|jpg|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if(allowedTypes.test(ext)){
     cb(null, true);
    } else{
        cb(new Error(`Only images are allowed ${allowedTypes}`), false)
    }
};

const upload = multer({
    storage: storage,
    limits:{ fileSize: 1024 * 1024 * 5}, //5mb limit
    fileFilter: fileFilter,
});

export default upload