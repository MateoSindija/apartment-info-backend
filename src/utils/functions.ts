import multer from 'multer';
import ShortUniqueId from 'short-unique-id';
import fs from 'fs';
import { LoggerType } from '@loaders/logger';
import Container from 'typedi';

const uid = new ShortUniqueId({ length: 11 });

// Set up MULTER for images
export const storage = (dest) =>
    multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, dest);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = `${new Date().toISOString().replace(/:/g, '-')}-${uid.randomUUID()}`;
            cb(null, uniqueSuffix + file.originalname);
        },
    });

export const imageFileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/webp'
    ) {
        // If the image is either JPEG, PNG, WEBP or JPG
        cb(null, true); // Allow the image
    } else {
        cb(
            new Error(
                'Unsupported file extension. The image must be in JPEG, WEBP, or PNG format.'
            ),
            false
        ); // Reject the image
    }
};

export const uploadImages = (dest) =>
    multer({
        storage: storage(dest),
        limits: {
            fileSize: 1024 * 1024 * 5, // 5 MB
        },
        fileFilter: imageFileFilter,
    }); // Set up multer for uploading

export const handleImageUrls = (
    imagesPath: string[] | undefined,
    imagesUrlArray: string[] | undefined
) => {
    if (imagesPath && imagesUrlArray) {
        return imagesUrlArray.concat(imagesPath);
    } else if (imagesPath) {
        return imagesPath;
    } else if (imagesUrlArray) {
        return imagesUrlArray;
    }
    return [];
};

export const handleTitleImage = (
    titleImage: string,
    imagesPath: string[] | undefined
) => {
    const number = Number(titleImage);
    if (!isNaN(number) && imagesPath) {
        return imagesPath[number];
    }
    return titleImage;
};

export const deleteImage = async (imagePath: string): Promise<void> => {
    const Logger: LoggerType = Container.get('logger');
    Logger.info('Deleting files!');

    await fs.unlink(imagePath, (err) => {
        if (err) Logger.error(err);
        else {
            Logger.info('File deleted');
        }
    });
    Logger.info('Images updated');
};
