import httpStatusCodes from 'http-status-codes';
import apiResponse from '../Utilities/ApiResponse';
import CustomerService from '../Services/Customer.service';


const fetchCustomerlist = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await CustomerService.fetchcustomerlist(req, res)
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
const addCustomer = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await CustomerService.addCustomer(req, res)
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

const fetchDisealist = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await CustomerService.fetchDisealist(req, res)
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

const fetchCountryCode = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await CustomerService.fetchCountrycode(req, res)
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

const fetchSubscriptionList = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await CustomerService.fetchSubscriptionList(req, res)
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

const getCities = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await CustomerService.getCities(req, res)
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

const fetchActiveServicesByCity = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await CustomerService.fetchSubscriptionList(req, res)
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

const getServices = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await CustomerService.getServices(req, res)
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


const updateCustomerList = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await CustomerService.updateCustomer(req, res)
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

const fetchCustomerByid = async(req:any, res: any)=>{
    console.log("in controller")

    try {
            
       

        let data: any = await CustomerService.fetchCustomerByid(req, res)
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

const getHealthReport = async(req:any, res: any)=>{
    console.log("in controller")

    try {
            
       

        let data: any = await CustomerService.getHealthReport(req, res)
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

const createHealthReport = async(req:any, res: any)=>{
    console.log("in controller")

    try {
            
       

        let data: any = await CustomerService.CreateHealthReport(req, res)
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


const fetchActiveCustomerList = async(req:any, res: any)=>{
    console.log("in controller")

    try {
            
       

        let data: any = await CustomerService.fetchActiveCustomerList(req, res)
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

const fetchHealthReportList = async(req:any, res: any)=>{
    console.log("in controller")

    try {
            
       

        let data: any = await CustomerService.fetchHealthReportList2(req, res)
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

const sendOtp = async(req:any, res: any)=>{
    console.log("in controller")

    try {
            
       

        let data: any = await CustomerService.sendOtpsservice(req, res)
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

const verifyOtp = async(req:any, res: any)=>{
    console.log("in controller")

    try {
            
       

        let data: any = await CustomerService.verifyOtpsservice(req, res)
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

const fetchMappedCustomer = async(req:any, res: any)=>{

    try {
            
       

        let data: any = await CustomerService.fetchCustomerByid(req, res)
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

const getReportDatesById = async(req:any, res: any)=>{

    try {
            
       

        let data: any = await CustomerService.getReportDatesById(req, res)
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

const getHealthReportByDate = async(req:any, res: any)=>{

    try {
            
       

        let data: any = await CustomerService.getHealthReportByDate(req, res)
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
    fetchCustomerlist:fetchCustomerlist,
    addCustomer:addCustomer,
    fetchDisealist:fetchDisealist,
    fetchSubscriptionList:fetchSubscriptionList,
    updateCustomerList:updateCustomerList,
    fetchCustomerByid:fetchCustomerByid,
    fetchMappedCustomer:fetchMappedCustomer,
    getHealthReport:getHealthReport,
    fetchActiveCustomerList:fetchActiveCustomerList,
    fetchHealthReportList: fetchHealthReportList,
    sendOtp:sendOtp,
    verifyOtp:verifyOtp,
    getReportDatesById:getReportDatesById,
    getHealthReportByDate:getHealthReportByDate,
    fetchCountryCode:fetchCountryCode,
    createHealthReport:createHealthReport,
    fetchActiveServicesByCity:fetchActiveServicesByCity,
    getCities:getCities,
    getServices:getServices


}