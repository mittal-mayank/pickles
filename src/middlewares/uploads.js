const multer = require('multer');
const { MulterError } = require('multer');

const AVATAR_DEST = './uploads/images/avatars';
const MAX_AVATAR_SIZE = 1024 * 512;

const POST_FILE_DEST = './uploads/images/postFiles';
const MAX_POST_FILE_SIZE = 1024 * 2048;

const BANNER_DEST = './uploads/images/banners';
const MAX_BANNER_SIZE = 1024 * 2048;

function saveImage(destination, maxFileSize, fileName) {
    return multer({
        dest: destination,
        limits: { fileSize: maxFileSize, files: 1 },
        fileFilter: (req, file, callback) => {
            if (file.mimetype.split('/').shift() !== 'image')
                return callback(new MulterError('LIMIT_UNEXPECTED_FILE'));
            callback(null, true);
        },
    }).single(fileName);
}

function processAvatar(req, res, next) {
    saveImage(AVATAR_DEST, MAX_AVATAR_SIZE, 'avatar')(req, res, (err) => {
        if (err) return res.status(400).send(err);
        if (req.body.avatar) return res.sendStatus(400);
        if (req.file) req.body.avatar = req.file.filename;
        next();
    });
}

function processPostFile(req, res, next) {
    saveImage(POST_FILE_DEST, MAX_POST_FILE_SIZE, 'file')(req, res, (err) => {
        if (err) return res.status(400).send(err);
        if (req.body.file) return res.sendStatus(400);
        if (req.file) req.body.file = req.file.filename;
        next();
    });
}

function processBanner(req, res, next) {
    saveImage(BANNER_DEST, MAX_BANNER_SIZE, 'banner')(req, res, (err) => {
        if (err) return res.status(400).send(err);
        if (req.body.banner) return res.sendStatus(400);
        if (req.file) req.body.banner = req.file.filename;
        next();
    });
}

module.exports = {
    processAvatar,
    processPostFile,
    processBanner,
};
