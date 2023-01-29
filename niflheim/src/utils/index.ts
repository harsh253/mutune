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
 * Downloads file from url if the file does not exist already and also writes to the outputFolder and filename
 */
export const downloadFromURL = async ({ url, outputFolder, filename, fileFormat }: { url: string, outputFolder: string, filename: string, fileFormat: string }) => {
    createFolder(outputFolder)
    try {
        const response = await axios({
            method: "get",
            url,
            responseType: "stream"
        })
        console.log("File downloaded succesfully - ", filename)
        await fs.promises.writeFile(`${outputFolder}/${filename}.${fileFormat}`, response.data);
        console.log("Finished writing file - ", filename)
        return url
    } catch (err) {
        console.log(err);
        throw new Error(DOWNLOAD_ERROR)
    }

}


export const deleteDirectory = (directoryToDelete: string) => {
    return new Promise((res, rej) => {
        fs.rm(directoryToDelete, { recursive: true }, (err) => {
            if (err) {
                rej(err)
            } else {
                console.log("Deleted directory - ", directoryToDelete)
                res(directoryToDelete);
            }
        })
    })
}