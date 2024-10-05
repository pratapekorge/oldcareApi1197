import { Mobile } from "aws-sdk";
import { Joi, Segments } from "celebrate";


export default {

    login: {
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },

    sendmailToAdmin: {
        [Segments.BODY]: {
            email: Joi.string().email().required(),
        }
    },
    addAdminuser: {
        [Segments.BODY]: {
            name: Joi.required(),
            roleid: Joi.number().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            mobile: Joi.string().required(),
            status: Joi.number().required()
        }
    }
}




