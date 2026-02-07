const { FileService } = require("../services/file.service");

class FileController {
    constructor() {
        this.service = new FileService();
    }

    async uploadFile(req, res) {
        try {
            const { file } = req;

            if (!file) {
                return res.status(400).json({ status: 'error', message: 'No file uploaded' });
            }

            if (file.mimetype !== 'text/csv') {
                return res.status(400).json({ status: 'error', message: 'File must be a CSV' });
            }

            // Convert the file buffer to string
            const fileContent = file.buffer.toString('utf-8');

            const data = await this.service.uploadFile(fileContent);
            res.json({ status: 'success', data });
        } catch (error) {
            console.error(error);
            res.status(400).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = FileController;