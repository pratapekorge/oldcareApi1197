import { Joi, Segments } from "celebrate";


export default {

    fetchcustomerlist :{
        [Segments.BODY]:{
            
        }
    },
    fetchCustomerById: {
        [Segments.QUERY]: {
            id: Joi.string().required()
        }
    },
    fetchHealthReportList: {
        [Segments.BODY]:  Joi.object().keys({
            // fromDate: Joi.string().required(),
            // toDate: Joi.string().required(),
            date_range: Joi.number().required()
        }).unknown()
    }
}