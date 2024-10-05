import httpStatusCodes from 'http-status-codes';
import apiResponse from '../Utilities/ApiResponse';
import RbacService from '../Services/Rbac.service';



const getRoles = async(req:any, res: any)=>{
    console.log("in controller")

    try {
            
       

        let data: any = await RbacService.fetchRoles(req, res)
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

const fetchPages = async(req:any, res: any)=>{
    console.log("in controller")

    try {
            
       

        let data: any = await RbacService.fetchPages(req, res)
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


const addRoles = async(req:any, res: any)=>{
    console.log("in controller")

    try {
            
       

        let data: any = await RbacService.addRoleswithpages(req, res)
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
    getRoles:getRoles,
    fetchPages:fetchPages,
    addRoles:addRoles
}