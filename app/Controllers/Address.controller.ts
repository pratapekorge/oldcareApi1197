import httpStatusCodes from 'http-status-codes';
import apiResponse from '../Utilities/ApiResponse';
import LOGGER from '../config/LOGGER';
import addressService from '../Services/Address.service';

const getAllStates = async (req: any, res: any) => {
    try {
        let query : string = (req.query.key !== undefined && req.query.key !== null && req.query.key !== "") ? " where name like '%"+ req.query.key + "%'" : "";
        let states : any = await addressService.getAllStates(query);
        if (states instanceof Error) {
            LOGGER.info("error", states)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, states, httpStatusCodes.OK);
        }
    } catch (e:any) {
        LOGGER.info("controller ->", e)
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                e.message
            );
            return;
    }
};

const getDistrictsByState = async (req:any, res:any) => {
    try {
        let query : string = (req.body.key !== undefined && req.body.key !== null && req.body.key !== "") ? " AND adt.name like '%"+ req.body.key + "%'" : "";
        let states : any = await addressService.getDistrictsByState(req.body.state_id, query);
        if (states instanceof Error) {
            LOGGER.info("error", states)
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
        } else {

            apiResponse.result(res, states, httpStatusCodes.OK);
        }
    } catch (e:any) {
        LOGGER.info("controller ->", e)
            apiResponse.error(
                res,
                httpStatusCodes.BAD_REQUEST,
                e.message
            );
            return;
    }
};


export default {

    getAllStates:getAllStates,
    getDistrictsByState:getDistrictsByState
}