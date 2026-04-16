import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import fs from "node:fs";
import path from "node:path";
import { FILES_EXTENSIONS } from "../utils/constants.utils.js";
import { BadRequestError } from "../utils/Error/exceptions.js";

const EXTENSION_TO_CANONICAL_MIME = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    mp4: "video/mp4",
    webm: "video/webm",
    mp3: "audio/mpeg",
};

const MIME_ALIAS_MAP = {
    "image/jpg": "image/jpeg",
    "audio/mp3": "audio/mpeg",
    "audio/mpeg3": "audio/mpeg",
    "text/xml": "application/xml",
};

const normalizeMimeType = (mimetype = "") => {
    const baseMimeType = mimetype.toLowerCase().split(";")[0].trim();
    return MIME_ALIAS_MAP[baseMimeType] ?? baseMimeType;
};

const toAllowedMimeTypes = () => {
    const allowedMimes = new Set();

    for (const [, extensions] of Object.entries(FILES_EXTENSIONS)) {
        for (const extension of extensions) {
            const normalizedExtension = extension.toLowerCase();
            const mimeType = EXTENSION_TO_CANONICAL_MIME[normalizedExtension];

            if (!mimeType) {
                continue;
            }

            allowedMimes.add(normalizeMimeType(mimeType));
        }
    }

    return [...allowedMimes];
};

const ALLOWED_MIME_TYPES = toAllowedMimeTypes();

const readFileBuffer = async (filePath) => {
    return fs.promises.readFile(filePath);
};

const deleteFile = async (filePath) => {
    if (!filePath) {
        return;
    }

    try {
        await fs.promises.unlink(filePath);
    } catch {
        return;
    }
};

const getUploadedFiles = (req) => {
    if (req.file) {
        return [req.file];
    }

    if (!req.files) {
        return [];
    }

    if (Array.isArray(req.files)) {
        return req.files;
    }

    return Object.values(req.files).flat();
};

const deleteUploadedFiles = async (uploadedFiles) => {
    await Promise.allSettled(
        uploadedFiles.map((uploadedFile) => deleteFile(uploadedFile?.path)),
    );
};

const validateFileContent = async (uploadedFile) => {
    const fileBuffer = await readFileBuffer(uploadedFile.path);
    const detectedType = await fileTypeFromBuffer(fileBuffer);

    if (!detectedType) {
        throw new BadRequestError("Invalid file content");
    }

    const detectedMimeType = normalizeMimeType(detectedType.mime);

    if (!ALLOWED_MIME_TYPES.includes(detectedMimeType)) {
        throw new BadRequestError("Invalid file content");
    }
};

const withMagicNumberValidation = (uploadHandler) => {
    return (req, res, next) => {
        uploadHandler(req, res, async (error) => {
            if (error) {
                await deleteUploadedFiles(getUploadedFiles(req));
                return next(error);
            }

            const uploadedFiles = getUploadedFiles(req);

            if (!uploadedFiles.length) {
                return next();
            }

            try {
                for (const uploadedFile of uploadedFiles) {
                    await validateFileContent(uploadedFile);
                }

                return next();
            } catch (validationError) {
                await deleteUploadedFiles(uploadedFiles);
                return next(validationError);
            }
        });
    };
};

const multerLocal = (subFolder) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const destination = `uploads/${subFolder}`;
            fs.mkdirSync(destination, { recursive: true });
            cb(null, destination);
        },
        filename: function (req, file, cb) {
            const uniquePrefix =
                Date.now() + "-" + Math.round(Math.random() * 1e9);
            const safeOriginalName = path
                .basename(file.originalname)
                .replace(/[^a-zA-Z0-9._-]/g, "_");
            const finalFileName =
                uniquePrefix + "-" + (safeOriginalName || "uploaded-file");
            cb(null, finalFileName);
        },
    });

    const limits = {
        fileSize: 10 * 1024 * 1024,
    };

    const uploader = multer({ limits, fileFilter, storage });

    return {
        single: (fieldName) =>
            withMagicNumberValidation(uploader.single(fieldName)),
        array: (fieldName, maxCount) =>
            withMagicNumberValidation(uploader.array(fieldName, maxCount)),
        fields: (fieldsConfig) =>
            withMagicNumberValidation(uploader.fields(fieldsConfig)),
        any: () => withMagicNumberValidation(uploader.any()),
        none: () => uploader.none(),
    };
};

const fileFilter = (req, file, cb) => {
    const mimeType = normalizeMimeType(file.mimetype);

    if (ALLOWED_MIME_TYPES.includes(mimeType)) {
        return cb(null, true);
    }

    return cb(new BadRequestError("Unsupported file type"), false);
};

export default multerLocal;
