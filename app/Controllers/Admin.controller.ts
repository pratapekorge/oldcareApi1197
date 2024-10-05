import httpStatusCodes from 'http-status-codes';
import apiResponse from '../Utilities/ApiResponse';
import AdminService from '../Services/Admin.service';
const login = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AdminService.loginservice(req, res)
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


const sendEmailToLogin = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AdminService.sendEmailToLogin(req, res)
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

const addAdminUser = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AdminService.addAdminservice(req, res)
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

const fetchadminlist = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AdminService.fetchAdminList(req, res)
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

const fetchadminById = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AdminService.fetchAdminById(req, res)
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

const fetchRoles = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AdminService.fetchRoles(req, res)
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

const fetchOverallReport = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AdminService.fetchOverallReportByAdmin2(req, res)
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

const updateAdmin = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AdminService.updateadmin(req, res)
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
login: login,
sendEmailToLogin:sendEmailToLogin,
addAdminUser:addAdminUser,
fetchadminlist:fetchadminlist,
fetchadminById:fetchadminById,
fetchRoles:fetchRoles,
updateAdmin:updateAdmin,
fetchOverallReport:fetchOverallReport
}