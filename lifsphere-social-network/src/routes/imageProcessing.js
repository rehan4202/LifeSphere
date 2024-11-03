const express = require('express');
const multer = require('multer'); // For handling file uploads
const gm = require('gm').subClass({ imageMagick: true }); // Use ImageMagick with gm
const path = require('path');
const fs = require('fs'); // To handle file system operations

const router = express.Router();
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        // Allow only image files
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
    }
});

// Image upload and processing route
router.post('/upload', upload.single('image'), (req, res) => {
    const { path: tempPath, originalname } = req.file;
    const targetPath = path.join(__dirname, 'uploads', originalname);

    // Process the image using ImageMagick (for example, resize it)
    gm(tempPath)
        .resize(200, 200) // Resize to 200x200 pixels
        .noProfile() // Remove color profiles
        .write(targetPath, (err) => {
            // Cleanup temporary file
            fs.unlink(tempPath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
            });

            if (err) {
                console.error(err);
                return res.status(500).send('Error processing image');
            }
            res.status(200).send('Image uploaded and processed successfully');
        });
});

module.exports = router;
