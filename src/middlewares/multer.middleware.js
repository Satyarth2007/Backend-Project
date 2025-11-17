import multer from 'multer'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({
    // storage: storage
    
    storage,
})





// Experiments
//   - change the file name
//   - In this file is saved as its original name as it is coming from system