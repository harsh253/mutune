import axios from "axios";
import fs from 'fs';
import { ERROR_MESSAGES } from '../errorHandlers/errorMessages';

const { FILE_EXISTS_ALREADY, DOWNLOAD_ERROR } = ERROR_MESSAGES.FILE_DOWNLOAD_SERVICE

export const createFolder = (outputFolder: string) => {
    try {
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder);
        }
    } catch (err) {
        console.error(err);
    }
}

/**
 * Creates file only if it does not already exist otherwise rejects with error
 */
export const createFileIfNotExists = (outputFile: fs.WriteStream, outputFolder: string, filename: string, fileFormat: string) => {
    return new Promise((res, rej) => {
        let fileAlreadyExists = false;
        try {
            outputFile = fs.createWriteStream(`${outputFolder}/${filename}.${fileFormat}`, { flags: "wx" })
            outputFile.on('error', (err) => {
                const { message } = err;
                if (message.includes(FILE_EXISTS_ALREADY.toLowerCase())) {
                    console.log(`${filename} - ${FILE_EXISTS_ALREADY}`, err)
                    fileAlreadyExists = true
                    rej(FILE_EXISTS_ALREADY);
                }
                outputFile.close()
                rej(err);
            })
            outputFile.on('finish', () => {
                console.log("Finished writing file - ", filename)
            })
            outputFile.on('ready', () => {
                res(outputFile);
            })

        } catch (err) {
            console.log(err);
        }
    })

}

/**
 * Downloads file from url if the file does not exist already and also writes to the outputFolder and filename
 */
export const downloadFromURL = async ({ url, outputFolder, filename, fileFormat }: { url: string, outputFolder: string, filename: string, fileFormat: string }) => {
    createFolder(outputFolder)
    let outputFile: fs.WriteStream

    let fileAlreadyExists = false

    try {
        outputFile = await createFileIfNotExists(outputFile, outputFolder, filename, fileFormat) as fs.WriteStream
    } catch (err) {
        if (err === FILE_EXISTS_ALREADY) fileAlreadyExists = true;
    }

    if (!fileAlreadyExists) {
        try {
            const response = await axios({
                method: "get",
                url,
                responseType: "stream"
            })
            console.log("File downloaded succesfully - ", filename)
            response.data.pipe(outputFile);
            return url
        } catch (err) {
            console.log(err);
            throw new Error(DOWNLOAD_ERROR)
        }
    }
}

