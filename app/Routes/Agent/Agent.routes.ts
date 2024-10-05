import { celebrate } from 'celebrate'
import express  from 'express'
import AgentController from '../../Controllers/Agent.controller'
import { upload } from '../../Utilities/Multer'
const path = require('path');
const fs = require('fs');
import AgentSchema from '../../Constants/Schema/Agent.schema';




const router = express()

router.post("/login",AgentController.loginAgent )

 router.post('/create/add',
    upload.fields([
        { name: 'adhar', maxCount: 1 },
        { name: 'pan',maxCount: 1 },
        { name: 'profile',maxCount: 1 },

        { name: 'educationaldocs' },
        { name: 'work_exp' },
      ]),
      AgentController.addAgent

  
  )
  router.post("/checkIn/sendotp", AgentController.checkInSendOtp)
  router.post("/checkIn/varifyotp", AgentController.checkInVarifyOtp)


  router.post('/fetch/agentlist',AgentController.fetchAgentList )    

  router.get('/fetchByagentId',AgentController.fetchAgentById )
  router.put('/update/agent',
    upload.fields([
      { name: 'adhar', maxCount: 1 },
      { name: 'pan',maxCount: 1 },
      { name: 'profile',maxCount: 1 },

      { name: 'educationaldocs' },
      { name: 'work_exp' },
    ]),
    AgentController.updateagent),

  router.post('/create/mapping/appointment',   AgentController.createMappingAppointment)
router.post('/gettimeslotByAgentId',celebrate(AgentSchema.getTimeslotByAgentId), AgentController.gettimeslotsByAgentId)
 router.post('/fetchAppointment',AgentController.fetchallappointment ) 
 router.get('/getAvailableAgent/ByDateTimeslot', celebrate(AgentSchema.getavailableAgent),AgentController.fetchAvailableAgent)
 router.post('/getassignAgentDetails/Bycustomer', AgentController.getmappingAgentDetailsByCustomer)

 router.post('/addtional/appointment',AgentController.createAdditionalAppointment)
 router.put("/update/appointment", AgentController.updateAppointment)

 router.get("/getAgentListForMapping", AgentController.fetchAgentForMapping)
 router.post(`/getAgentDashboardById`, AgentController.getDashboardAgentApi)

  

export default router








