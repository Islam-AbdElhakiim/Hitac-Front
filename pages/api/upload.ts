
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { errors as formidableErrors } from 'formidable';
import fs from 'fs';


export const config = {
    api: {
        bodyParser: false, // Disable the default body parser
    },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // pages/api/upload.js
    // console.log("first")
    const form = formidable({ uploadDir: "./public/uploads" });

    let files:any, fields;
    try {
        [fields, files] = await form.parse(req);
        // console.log("second")
        // console.log(files, fields);
    } catch (err: any) {
        // example to check for a very specific error
        if (err.code === formidableErrors.maxFieldsExceeded) {
            console.log(err)
        }

        console.error(err);
        res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        res.end(String(err));
        return;

    };
 
    const oldPath = files.image[0].filepath.toString();
    const newPath = `./public/uploads/${files.image[0].originalFilename}`
    // console.log(oldPath, newPath)
    //fs 
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'File move failed' });
        }

        return res.status(200).json({ message: 'File uploaded successfully' });
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ filePath: newPath }, null, 2));
    return;
}
// });

