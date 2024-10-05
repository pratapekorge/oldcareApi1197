
import httpStatusCodes from 'http-status-codes';
import apiResponse from '../Utilities/ApiResponse';
import NotificationService from '../Services/Notification.service';


 const fetchNotificationById = async (req: any, res: any)=>{

    try {
            
       

        let data: any = await NotificationService.fetchNotificationBYId(req, res)
        if (data instanceof Error) {
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res,  data, httpStatusCodes.OK);
        }
    } catch (e: any) {
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            e.message
        );
        return;


 }

}

const createNotification = async (req: any, res: any)=>{

    try {
            
       

        let data: any = await NotificationService.createNotification(req, res)
        if (data instanceof Error) {
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res,  data, httpStatusCodes.OK);
        }
    } catch (e: any) {
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            e.message
        );
        return;


 }

}


const fetchNotification = async (req: any, res: any)=>{

    try {
            
       

        let data: any = await NotificationService.fetchNotification2(req, res)
        if (data instanceof Error) {
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {
            apiResponse.result(res,  data, httpStatusCodes.OK);
        }
    } catch (e: any) {
        apiResponse.error(
            res,
            httpStatusCodes.BAD_REQUEST,
            e.message
        );
        return;


 }

}

export default {

fetchNotificationById:fetchNotificationById,
createNotification:createNotification,
fetchNotification:fetchNotification

}

