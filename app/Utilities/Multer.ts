import multer from 'multer';
import fs from "fs";

// Define storage options for Multer. You can customize this according to your needs.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationFolder = 'images/';

        // Create the folder if it doesn't exist
        if (!fs.existsSync(destinationFolder)) {
            fs.mkdirSync(destinationFolder, { recursive: true });
        }

        cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original filename for the stored file
    },
});

export const upload = multer({storage: storage});
