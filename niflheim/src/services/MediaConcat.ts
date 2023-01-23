import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const { MEDIA_CONCATENATION_SERVICE_URL } = process.env

export class MediaService {

    async concatenateAudios({ inputFolderLocation, fileFormat = 'mp3', outputFolderLocation, outputFileName }: { inputFolderLocation: string, fileFormat: string, outputFolderLocation: string, outputFileName?: string }) {
        try {
            console.log("Attempting to merge audio files");
            const response = await axios.post(`${MEDIA_CONCATENATION_SERVICE_URL}/media-concat`, {
                "mediaType": "audio",
                inputFolderLocation,
                fileFormat,
                outputFolderLocation,
                outputFileName
            })
            return response.data
        } catch (err) {
            console.log(err);
            return err;
        }
    }



}