const express = require('express');
const multer = require('multer'); // For handling file uploads
const sharp = require('sharp'); // Import Sharp
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

// Image upload and processing route using Sharp
router.post('/upload-sharp', upload.single('image'), async (req, res) => {
    const { path: tempPath, originalname } = req.file;
    const targetPath = path.join(__dirname, 'uploads', originalname);

    try {
        // Process the image using Sharp
        await sharp(tempPath)
            .resize(200, 200) // Resize to 200x200 pixels
            .toFile(targetPath); // Save to target path

        // Cleanup temporary file
        fs.unlink(tempPath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
        });

        res.status(200).send('Image uploaded and processed successfully using Sharp');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing image with Sharp');
    }
});

module.exports = router;
