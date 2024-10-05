
import { Joi, Segments } from "celebrate";


export default {

    getTimeslotByAgentId: {
        [Segments.BODY]: {
            agentId: Joi.string().required(),
            date: Joi.string().required(),
        }
    },
    getavailableAgent: {
        [Segments.QUERY]: {
            date: Joi.string().required(),
            timeslot: Joi.number().required()
        }
    },

}

