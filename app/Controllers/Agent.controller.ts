
import httpStatusCodes from 'http-status-codes';
import apiResponse from '../Utilities/ApiResponse';
import AgentService from '../Services/Agent.service';

const addAgent = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.addAgent(req, res)
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

 const loginAgent = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.agentLoginService(req, res)
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


 const fetchAgentList = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.fetchAgentList(req, res)
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
 const checkInSendOtp = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.checkInSendOtpService(req, res)
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

 const checkInVarifyOtp = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.checkInVarifyOtpService(req, res)
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



 const fetchmappingAgentList = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.fetchAgentList(req, res)
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

 const createMappingAppointment = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.mappingAppointmentService(req, res)
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
 const gettimeslotsByAgentId = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.mappedtimeslotByagentId(req, res)
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

 const fetchallappointment = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.fetchAllAppointment(req, res)
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

 const fetchAvailableAgent = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.fetchavailableAgentBydatesTimeslot(req, res)
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


 
 const fetchAgentById = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.fetchAgentByid(req, res)
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

 const updateagent = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.updateAgent(req, res)
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

 
 const getmappingAgentDetailsByCustomer = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.getMappingAgentDetailsByCustomer(req, res)
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

 const createAdditionalAppointment = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.createAdditionalAppointment(req, res)
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

 const updateAppointment = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.updateAppointment(req, res)
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

 const fetchAgentForMapping = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.fetchAgentforMapping(req, res)
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

 const getDashboardAgentApi = async(req:any, res: any)=>{
    console.log("in controller")

    try {
        let data: any = await AgentService.fetchAgentDashboardDetails(req, res)
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

    loginAgent:loginAgent,
     addAgent: addAgent,
     fetchAgentList:fetchAgentList,
     fetchAgentById:fetchAgentById,
     updateagent:updateagent,
     fetchmappingAgentList:fetchmappingAgentList,
     createMappingAppointment:createMappingAppointment,
     gettimeslotsByAgentId:gettimeslotsByAgentId,
     fetchallappointment: fetchallappointment,
     fetchAvailableAgent:fetchAvailableAgent,
     getmappingAgentDetailsByCustomer:getmappingAgentDetailsByCustomer,
     createAdditionalAppointment:createAdditionalAppointment,
     updateAppointment:updateAppointment,
     fetchAgentForMapping:fetchAgentForMapping,
     getDashboardAgentApi:getDashboardAgentApi,
     checkInSendOtp:checkInSendOtp,
     checkInVarifyOtp:checkInVarifyOtp
}