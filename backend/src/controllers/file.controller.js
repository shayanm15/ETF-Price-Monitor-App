const { FileService } = require("../services/file.service");

class FileController {
    constructor() {
        this.service = new FileService();
    }

    async uploadFile(req, res) {
        try {
            const { file } = req;
            // Convert the file buffer to string
            const fileContent = file.buffer.toString('utf-8');

            const data = await this.service.uploadFile(fileContent);
            res.json({ status: 'success', data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: 'Unable to upload file' });
        }
    }
}

module.exports = FileController;