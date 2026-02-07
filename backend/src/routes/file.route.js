const express = require('express');
const multer = require('multer');
const fileController = require('../controllers/file.controller');
const router = express.Router();

// Upload instance with memory storage
const upload = multer({ storage: multer.memoryStorage() });

let controller = new fileController();

// Upload route needs multer to parse multipart/form-data
// Keep the file in buffer for memory storage to avoid disk write
router.post(
    '/upload', upload.single('file'),
    controller.uploadFile.bind(controller)
);

module.exports = router;