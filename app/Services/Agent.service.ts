import formidable from "formidable";
import application from "../Constants/application";
import { AgentModel } from "../Models/Agent/Agent.Model";
import { add } from "winston";
import moment from "moment";
import { uploadFileMulter } from "../Utilities/S3bucket";
import Hashing from "../Utilities/Hashing";
import commonFunction from "../Utilities/common.function";
import fs from 'fs';

import { promisify } from 'util';
import sendEmail from "../Utilities/SendEmail";
import LOGGER from "../config/LOGGER";
import { CustomerModel } from "../Models/Customer/Customer.model";
import { sendOTPTemplateMessage } from "../Utilities/Smsservice";

const readFileAsync = promisify(fs.readFile);
const { v4: uuidv4 } = require('uuid');

const addAgent = (req: any, res: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("in service")


      let fields, files, result;
      files = req.files;
      for (const fieldname in files) {
        if (Object.prototype.hasOwnProperty.call(files, fieldname)) {
          const fileArray = files[fieldname];
          if (!fieldname.includes("educationaldocs") && !fieldname.includes("work_exp")) {
            console.log("fieldname1111", fieldname)
            files[fieldname] = fileArray[0];
          } else {
            // console.log("fieldname2222",fieldname)

            files[fieldname] = fileArray;
          }
        }
      }
      fields = req.body;

      // console.log("req", req)
      // const form = formidable({});
      // let fields;
      // let files;
      // [fields, files] = await form.parse(req);
      let profile: any = {};



      // console.log("fields", fields)


      let data: any = {};
      let userData: any = {}
      let addressData: any = {}

      if (fields.firstname) {
        userData.firstname = fields.firstname
      }

      if (fields.lastname) {
        userData.lastname = fields.lastname
      }


      if (fields.mobile) {
        userData.mobile = fields.mobile
      }
      if (fields.roleid) {
        userData.roleid = fields.roleid
      }
      if (fields.email) {
        userData.email = fields.email
      }

      if (fields.password) {
        userData.password = fields.password
      }

      if (fields.dob) {
        userData.dob = fields.dob
      }
      if (fields.status) {
        userData.status = fields.status
      }

      userData.roleid = application.Roles.Agent
      console.log("userData", userData)
      let Agentdata = await new AgentModel().addAgent(userData)
      let userid = Agentdata.insertId




      if (fields.country_id) {
        addressData.country_id = fields.country_id
      }

      if (fields.state_id) {
        addressData.state_id = fields.state_id
      }

      if (fields.city_id) {
        addressData.district_id = fields.city_id
      }

      if (fields.pincode) {
        addressData.pincode = fields.pincode
      }

      if (fields.address) {
        addressData.address = fields.address
      }
      if (fields.landmark) {
        addressData.landmark = fields.landmark
      }
      addressData.roleid = application.Roles.Agent
      addressData.userid = userid

      let addressResult = await new AgentModel().addAddress(addressData)
      console.log("result", addressResult)

      if (fields.adharNo) {
        profile.adharNo = fields.adharNo

      }
      if (fields.panNo) {
        profile.panNo = fields.panNo

      }

      let s3Images: any = {};
      if (files.adhar !== undefined && files.adhar !== null && files.adhar !== "") {
        if (isFileNotValid(files.adhar.mimetype)) throw new Error("Only .png, .jpg, .jpeg, .pdf  format allowed!"); else { s3Images.adhar = files.adhar; }
      }

      if (files.profile !== undefined && files.profile !== null && files.profile !== "") {
        if (isFileNotValid(files.profile.mimetype)) throw new Error("Only .png, .jpg, .jpeg, .pdf  format allowed!"); else { s3Images.profile = files.profile; }
      }

      if (files.pan !== undefined && files.pan !== null && files.pan !== "") {
        if (isFileNotValid(files.pan.mimetype)) throw new Error("Only .png, .jpg, .jpeg, .pdf  format allowed!"); else { s3Images.pan = files.pan; }
      }

      if (Object.keys(s3Images).length) {
        let keys = Object.keys(s3Images);
        const s3Paths = {};
        for (let i = 0; i < keys.length; i++) {
          const randomString = Math.random().toString(36).substring(2, 8);
          let name: string = "images/" + randomString + moment().unix() + "." + s3Images[keys[i]].originalname.split(".").pop()
          profile[keys[i]] = (await uploadFileMulter(s3Images[keys[i]], name)).key;
        }
        Object.assign(profile, s3Paths);
      }


      if (files["educationaldocs"]) {
        for (let i = 0; i < files["educationaldocs"].length; i++) {
          if (files["educationaldocs"][i]) {
            if (isFileNotValid(files["educationaldocs"][i].mimetype)) {
              throw new Error("Only .png, .jpg, .jpeg, .pdf  format allowed!");
            }
          }
        }
        let urls = []
        for (let i = 0; i < files["educationaldocs"].length; i++) {
          const randomString = Math.random().toString(36).substring(2, 8);
          let name: string = "images/" + randomString + moment().unix() + "." + files["educationaldocs"][i].originalname.split(".").pop()
          let url = (await uploadFileMulter(files["educationaldocs"][i], name)).key;
          // console.log("url in education",url)

          urls.push(url);
        }
        // console.log("urls in educationaldocs",urls)
        profile["educationaldocs"] = urls.join(',');
      }


      if (files["work_exp"]) {
        for (let i = 0; i < files["work_exp"].length; i++) {
          if (files["work_exp"][i]) {
            if (isFileNotValid(files["work_exp"][i].mimetype)) {
              throw new Error("Only .png, .jpg, .jpeg, .pdf  format allowed!");
            }
          }
        }
        let urls = []
        for (let i = 0; i < files["work_exp"].length; i++) {
          const randomString = Math.random().toString(36).substring(2, 8);
          let name: string = "images/" + randomString + moment().unix() + "." + files["work_exp"][i].originalname.split(".").pop()
          let url = (await uploadFileMulter(files["work_exp"][i], name)).key;
          urls.push(url);
        }
        profile["work_exp"] = urls.join(',');
      }

      profile.roleid = application.Roles.Agent
      profile.userid = userid
      console.log("profile", profile)

      await new AgentModel().addProfileDetails(profile)


      let hashPass: any = ""
      const newPassword = commonFunction.generateRandomPassword(6);
      console.log("newPassword", newPassword)
      hashPass = await new Hashing().generateHash(newPassword, 10);

      const htmlTemplate = await readFileAsync('./uploads/template/agentLoginCredentialsTemplate.html', 'utf-8');
      const modifiedHtml = htmlTemplate
        .replace(/{{this.username}}/g, fields.email)
        .replace('{{this.password}}', newPassword);


      await sendEmail(req.body.email, 'Agent Login Crendiantials', modifiedHtml);
      console.log("modifiedhtml", modifiedHtml)










      console.log("customerdata", Agentdata)

      resolve(Agentdata)



    } catch (err: any) {
      reject(err)
      console.log("err22222", err)

    }




  })
  // let 
}

const isFileNotValid = (type: any) => {
  if (type == 'image/jpeg' || type == 'image/jpg' || type == 'image/png' || type == "application/pdf") {
    // if (type == 'image/svg+xml' || type == 'image/jpg' || type == 'image/png' || type == "application/pdf") {
    return false;
  }
  return true;
};


const fetchAgentList = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {

      let orderQuery: any = ""
      console.log("in service start")

      if (req.body.sort.key != "") {
        orderQuery = " ORDER BY " + req.body.sort.key + " " + req.body.sort.order + " ";
      } else {
        orderQuery = " ORDER BY u.id DESC ";
      }
      console.log("req.body", req.body)


      let query = ""
      if (req.body.query != "") {
        query = ` and u.firstname like '%${req.body.query}%' or u.lastname like '%${req.body.query}%' `
      }
      if (req.body.filterData.status) {
        query += `and u.status = ${req.body.filterData.status} `
      }

      let customer = await new AgentModel().fetchAgentList(application.Roles.Agent, req.body.pageSize, req.body.pageSize * (req.body.pageIndex - 1), orderQuery, query)
      let total = await new AgentModel().fetchAgentListCount(application.Roles.Agent, req.body.pageSize, req.body.pageSize * (req.body.PageIndex - 1), orderQuery, query)



      if (customer.length && total.length) {
        resolve({
          data: customer, total: total.length
        })
      } else {
        resolve({
          data: [], total: 0
        })
      }

    } catch (error) {
      reject(error)


    }


  })

}

const fetchAgentByid = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      let searchQuery: any = ""
      let id: any = ''
      if (req.query.id) {
        id = req.query.id
      }

      let result = await new AgentModel().fetchAgentListById(id)
      console.log("result", result)
      if (result.length) {

        result[0].status = result[0].status == 1 ? { label: 'Pending', value: 1 } : result[0].status == 2 ? { label: 'Active', value: 2 } : { label: 'InActive', value: 0 }

        result[0].adhar = result[0].adhar ? [`${process.env.baseUrl}${result[0].adhar}`] : []
        result[0].profile = result[0].profile ? `${process.env.baseUrl}${result[0].profile}` : []

        result[0].pan = result[0].pan ? [`${process.env.baseUrl}${result[0].pan}`] : []
        let work_exparr = [];

        if (result[0].work_exp) {
          let arr = result[0].work_exp.split(",")
          work_exparr = arr.map((ele: any) => `${process.env.baseUrl}${ele}`)

        }
        result[0].work_exp = work_exparr


        let educationaldocsarr = []

        if (result[0].educationaldocs) {
          let arr = result[0].educationaldocs.split(",")
          educationaldocsarr = arr.map((ele: any) => `${process.env.baseUrl}${ele}`)



        }
        result[0].educationaldocs = educationaldocsarr







      }

      if (result.length) {
        resolve(result)
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}

const updateAgent = (req: any, res: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("in service")


      let fields, files, result;
      let profile: any = {};

      files = req.files;
      for (const fieldname in files) {
        if (Object.prototype.hasOwnProperty.call(files, fieldname)) {
          const fileArray = files[fieldname];
          if (!fieldname.includes("educationaldocs") && !fieldname.includes("work_exp")) {
            console.log("fieldname1111", fieldname)
            files[fieldname] = fileArray[0];
          } else {
            // console.log("fieldname2222",fieldname)

            files[fieldname] = fileArray;
          }
        }
      }
      fields = req.body;

      // console.log("fields", fields)


      let data: any = {};
      let userData: any = {}
      if (!fields.id) throw new Error("id is required")

      if (fields.firstname) {
        userData.firstname = fields.firstname
      }
      if (fields.customerNoteforAgent) {
        userData.customerNoteforAgent = fields.customerNoteforAgent
      }




      if (fields.lastname) {
        userData.lastname = fields.lastname
      }


      if (fields.mobile) {
        userData.mobile = fields.mobile
      }
      if (fields.roleid) {
        userData.roleid = fields.roleid
      }
      if (fields.email) {
        userData.email = fields.email
      }
      if (fields.dob) {
        userData.dob = fields.dob
      }

      if (fields.gender) {
        userData.gender_id = fields.gender
      }

      if (fields.status) {
        userData.status = fields.status
      }







      // console.log("userData", userData)
      // console.log("userData.userid", fields.id)
      let customerdata = await new AgentModel().updateAgentuser(userData, fields.id)
      // console.log("result", customerdata)
      let addressData: any = {}
      if (fields.country_id) {
        addressData.country_id = fields.country_id
      }

      if (fields.state_id) {
        addressData.state_id = fields.state_id
      }

      if (fields.city_id) {
        addressData.district_id = fields.city_id
      }

      if (fields.pincode) {
        addressData.pincode = fields.pincode
      }

      if (fields.address) {
        addressData.address = fields.address
      }
      if (fields.landmark) {
        addressData.landmark = fields.landmark
      }
      addressData.roleid = application.Roles.Agent
      addressData.userid = fields.id
      // console.log("addressData", addressData)
      // console.log(" fields.id",  fields.id)

      let addressresult = await new AgentModel().updateAddress(addressData, fields.id)
      //  console.log("addressresult", addressresult)

      if (fields.adharNo) {
        profile.adharNo = fields.adharNo

      }
      if (fields.panNo) {
        profile.panNo = fields.panNo

      }

      let s3Images: any = {};
      // console.log("files", files)
      if (files.adhar !== undefined && files.adhar !== null && files.adhar !== "") {
        if (isFileNotValid(files.adhar.mimetype)) throw new Error("Only .png, .jpg, .jpeg, .pdf  format allowed!"); else { s3Images.adhar = files.adhar; }
      }

      if (files.profile !== undefined && files.profile !== null && files.profile !== "") {
        if (isFileNotValid(files.profile.mimetype)) throw new Error("Only .png, .jpg, .jpeg, .pdf  format allowed!"); else { s3Images.profile = files.profile; }
      }

      if (files.pan !== undefined && files.pan !== null && files.pan !== "") {
        if (isFileNotValid(files.pan.mimetype)) throw new Error("Only .png, .jpg, .jpeg, .pdf  format allowed!"); else { s3Images.pan = files.pan; }
      }

      // console.log("s3images", s3Images)

      if (Object.keys(s3Images).length) {
        let keys = Object.keys(s3Images);
        const s3Paths = {};
        for (let i = 0; i < keys.length; i++) {
          const randomString = Math.random().toString(36).substring(2, 8);
          let name: string = "images/" + randomString + moment().unix() + "." + s3Images[keys[i]].originalname.split(".").pop()
          profile[keys[i]] = (await uploadFileMulter(s3Images[keys[i]], name)).key;
        }
        Object.assign(profile, s3Paths);
      }

      // console.log("profile  before educational docs", profile);


      if (files["educationaldocs"]) {
        for (let i = 0; i < files["educationaldocs"].length; i++) {
          if (files["educationaldocs"][i]) {
            if (isFileNotValid(files["educationaldocs"][i].mimetype)) {
              throw new Error("Only .png, .jpg, .jpeg, .pdf  format allowed!");
            }
          }
        }
        let urls = []
        for (let i = 0; i < files["educationaldocs"].length; i++) {
          const randomString = Math.random().toString(36).substring(2, 8);
          let name: string = "images/" + randomString + moment().unix() + "." + files["educationaldocs"][i].originalname.split(".").pop()
          let url = (await uploadFileMulter(files["educationaldocs"][i], name)).key;
          console.log("url in education", url)

          urls.push(url);
        }
        // console.log("urls in educationaldocs",urls)
        profile["educationaldocs"] = urls.join(',');
      }


      if (files["work_exp"]) {
        for (let i = 0; i < files["work_exp"].length; i++) {
          if (files["work_exp"][i]) {
            if (isFileNotValid(files["work_exp"][i].mimetype)) {
              throw new Error("Only .png, .jpg, .jpeg, .pdf  format allowed!");
            }
          }
        }
        let urls = []
        for (let i = 0; i < files["work_exp"].length; i++) {
          const randomString = Math.random().toString(36).substring(2, 8);
          let name: string = "images/" + randomString + moment().unix() + "." + files["work_exp"][i].originalname.split(".").pop()
          let url = (await uploadFileMulter(files["work_exp"][i], name)).key;
          urls.push(url);
        }
        profile["work_exp"] = urls.join(',');
      }

      profile.roleid = application.Roles.Agent
      profile.userid = fields.id
      console.log("profile", profile)

      let profileResult = await new AgentModel().UpdateProfileDetails(profile, fields.id)
      console.log("profieResult", profileResult)






      console.log("customerdata", customerdata)

      resolve(customerdata)



    } catch (err: any) {
      reject(err)
      console.log("err22222", err)

    }




  })
  // let 
}


const fetchmappingAgentList = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {




      let query = ""
      if (req.body.query != "") {
        query = ` and u.firstname like '%${req.body.query}%' or u.lastname like '%${req.body.query}%' `
      }


      let customer = await new AgentModel().fetchmappingAgentList(application.Roles.Agent, query)



      if (customer.length) {
        resolve(customer)
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}

const agentLoginService = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {




      let query = ""
      let userDetails: any = ''
      let boolean: any = false
      if (req.body.query != "") {
        query = ` and u.firstname like '%${req.body.query}%' or u.lastname like '%${req.body.query}%' `
      }
      if (!req.body.email) throw new Error('email id is required')

      if (!req.body.password) throw new Error('password  is required')


      if (req.body.email) {
        userDetails = await new AgentModel().fetchAgentDetailsByEmail(req.body.email)
      }

      if (userDetails.password) {

      }

      if (req.body.password && userDetails.length) {
        boolean = await new Hashing().verifypassword(req.body.password, userDetails[0].password);
      }
      if (!boolean && userDetails.length) {
        throw new Error("password  is not matched")
      }


      let customer = await new AgentModel().fetchmappingAgentList(application.Roles.Agent, query)



      if (customer.length) {
        resolve(customer)
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}

const mappingAppointmentService = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {


      if (!req.body.customerid) throw new Error("customer id is required")



      let query = ""
      let appointmentData: any = {}

      if (req.body.agentId) {
        appointmentData.agentId = req.body.agentId
      }
      if (req.body.adminId) {
        appointmentData.adminId = req.body.adminId
      }

      if (req.body.timeslot) {
        appointmentData.timeslot = req.body.timeslot
      }

      if (req.body.customerid) {
        appointmentData.customerid = req.body.customerid
      }
      if (req.body.atype) {
        appointmentData.atype = req.body.atype
      }
      appointmentData.status = 2

      if (req.body.atype == 1) {
        let plandetails = await new AgentModel().fetchPlanDetails(req.body.customerid)
        console.log("plandetails", plandetails)
        let mapData: any = {}

        // let mapresult = await new AgentModel().checkAgent(req.body.customerid)

        if (req.body.ismapAgent) {
          let data: any = {}
          data.status = 0
          let prevmappedAgent = await new AgentModel().mappedAgentDetails(req.body.customerid);
          if (prevmappedAgent.length && prevmappedAgent[0].agentId != req.body.agentId) {

            let updateresult = await new AgentModel().updatemapping(data, req.body.customerid)
            let update = await new AgentModel().updateupcomingappointment(req.body.agentId, req.body.customerid)


          }

          mapData.customer_id = req.body.customerid

          mapData.agentId = req.body.agentId
          mapData.adminId = req.body.adminId
          console.log("mapData", mapData);

          let assignAgent = await new AgentModel().assignAgentToCustomer(mapData)
          console.log("assignAgent", assignAgent)


        }


        let appointmentDates: any = []
        let currentDate = new Date(req.body.startDate);
        let durationcount = plandetails[0].duration == 1 ? application.duration.Monthly : application.duration.Yearly
        if (plandetails[0].frequency) {
          for (let i = 0; i < plandetails[0].frequency * durationcount; i++) {
            appointmentDates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 7);
          }
        }

        for (let i = 0; i < appointmentDates.length; i++) {
          let data: any = {}

          //     Object.assign(data,appointmentData)
          //     data.AppointmentDateTime = appointmentDates[i] 
          // let res= await new AgentModel().addAgentAppointment(data)
        }


        for (let i = 0; i < appointmentDates.length; i++) {
          let data: any = {}
          Object.assign(data, appointmentData)
          data.AppointmentDateTime = appointmentDates[i]
          let res = await new AgentModel().addAgentAppointment(data)
        }

      } else {
        appointmentData.AppointmentDateTime = req.body.startDate
        appointmentData.atype = 2
        let res = await new AgentModel().addAgentAppointment(appointmentData)


      }
      //  if(req.body.atype == 2)




      if (1) {
        resolve([])
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}


const mappedtimeslotByagentId = (req: any, res: any) => {


  return new Promise(async (resolve, reject) => {
    try {




      let query = ""
      if (!req.body.agentId) throw new Error("agentId is required")


      let customer = await new AgentModel().getmappedtimeslot(req.body.agentId, req.body.date)



      if (customer.length) {
        resolve(customer)
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}

const fetchAllAppointment = (req: any, res: any) => {


  return new Promise(async (resolve, reject) => {
    try {

      let orderQuery: any = ""
      console.log("in service start")

      if (req.body.sort.key != "") {
        orderQuery = " ORDER BY " + req.body.sort.key + " " + req.body.sort.order + " ";
      } else {
        orderQuery = " ORDER BY agap.AppointmentDateTime DESC ";
      }
      console.log("req.body", req.body)


      let query = ""


      // if (req.body.filterData.isPrevious) {
      //   query += ` where agap.AppointmentDateTime <= now()  `
      // }else{
      //    query += ` where agap.AppointmentDateTime > now()  `
      // }
      if (req.body.filterData.status) {
        query += `where agap.status = ${req.body.filterData.status} `
      }

      if (req.body.query != "") {
        query = ` and u.firstname like '%${req.body.query}%' or u.lastname like '%${req.body.query}%'  or a.firstname like '%${req.body.query}%' or a.lastname like '%${req.body.query}%' `
      }

      if (req.body.filterData.customerId) {
        query += `and agap.customerId = ${req.body.filterData.customerId} `
      }
      if (req.body.filterData.agentId) {
        query += `and agap.agentID = ${req.body.filterData.agentId} `
      }



      let appointment = await new AgentModel().getallAppintments(req.body.pageSize, req.body.pageSize * (req.body.pageIndex - 1), orderQuery, query)

      let total = await new AgentModel().getallAppintmentsCount(req.body.pageSize, req.body.pageSize * (req.body.pageIndex - 1), orderQuery, query)


      if (appointment.length) {
        resolve({
          data: appointment, total: total.length
        })
      } else {
        resolve({
          data: [], total: 0
        })
      }

    } catch (error) {
      reject(error)


    }


  })

}


const fetchavailableAgentBydatesTimeslot = (req: any, res: any) => {


  return new Promise(async (resolve, reject) => {
    try {






      let Agents = await new AgentModel().getAvailableAgentsByDatenTimeslot(req.query.date, req.query.timeslot, application.Roles.Agent)



      if (Agents.length) {
        resolve(Agents)
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}



const getMappingAgentDetailsByCustomer = (req: any, res: any) => {


  return new Promise(async (resolve, reject) => {
    try {


      if (!req.body.customerId) throw new Error("customer id required")

      // if(!req.body.agentId) throw new Error("agent id is required")



      let result = await new AgentModel().getMappingAgentDetailsByCustomer(req.body.customerId)
      if (result.length) {
        result[0].reviews = await new AgentModel().getRatingandReviews(result[0].agentId)
        result[0].TotalReviews = await new AgentModel().getTotalReview(result[0].agentId)
      }






      if (result.length) {
        resolve(result)
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}


const createAdditionalAppointment = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {


      if (!req.body.customerid) throw new Error("customer id is required")

      if (!req.body.startDate) throw new Error("date  is required")

      if (!req.body.timeslot) throw new Error("timeslot is required")



      let query = ""
      let appointmentData: any = {}

      if (req.body.agentId) {
        appointmentData.agentId = req.body.agentId
      }
      if (req.body.adminId) {
        appointmentData.adminId = req.body.adminId
      }

      if (req.body.timeslot) {
        appointmentData.timeslot = req.body.timeslot
      }

      if (req.body.customerid) {
        appointmentData.customerid = req.body.customerid
      }
      if (req.body.atype) {
        appointmentData.atype = req.body.atype
      }
      if (req.body.status) {
        appointmentData.status = req.body.status
      }

      if (req.body.startDate) {
        appointmentData.AppointmentDateTime = req.body.startDate
      }

      let check = await new AgentModel().getAgentAppointment(appointmentData.customerid, appointmentData.AppointmentDateTime, appointmentData.timeslot)

      if (check.length) throw new Error(" Appointment already exist for this date , timeslot and customer")
      console.log("appointmentData", appointmentData)
      let res = await new AgentModel().addAgentAppointment(appointmentData)



      //  if(req.body.atype == 2)




      if (res) {
        resolve(res)
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}

const updateAppointment = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {


      if (!req.body.appointmentId) throw new Error("appointment id is required")



      let query = ""
      let appointmentData: any = {}

      if (req.body.agentId) {
        appointmentData.agentId = req.body.agentId
      }
      if (req.body.adminId) {
        appointmentData.adminId = req.body.adminId
      }

      if (req.body.timeslot) {
        appointmentData.timeslot = req.body.timeslot
      }

      if (req.body.customerid) {
        appointmentData.customerid = req.body.customerid
      }
      if (req.body.atype) {
        appointmentData.atype = req.body.atype
      }

      if (req.body.status) {
        appointmentData.status = req.body.status
      }
      if (req.body.startDate) {
        appointmentData.AppointmentDateTime = req.body.startDate
      }


      console.log("appointmentData", appointmentData)
      let res = await new AgentModel().updateAppointment(appointmentData, req.body.appointmentId)



      //  if(req.body.atype == 2)




      if (res) {
        resolve(res)
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}


const fetchAgentforMapping = (req: any, res: any) => {


  return new Promise(async (resolve, reject) => {
    try {
      let query: any = ""
      if (req.query.query) {
        query = `and u.firstname like '%${req.query.query}%' or u.lastname like '%${req.query.query}%' `
      }



      console.log("query", query)


      let Agents = await new AgentModel().getAgentList(query)
      console.log("agents", Agents)



      if (Agents.length) {
        resolve(Agents)
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}


const checkInSendOtpService = (req: any, res: any) => {


  return new Promise(async (resolve, reject) => {
    try {
      let query: any = ""



      const otp = Math.floor(100000 + Math.random() * 900000)
      console.log("otp",otp)
      // console.log("otp",otp)
      let senddata: any = {}
      LOGGER.info("otp", otp)
      // console.log("otp",otp)
      // console.log("userdetail[0].id", userdetail[0].id);
      senddata.otp = otp;
      senddata.mobile = req.body.mobile
      // senddata.customer_mobile = req.body.customer_mobile

      senddata.userid = req.body.userid
      senddata.req_id = uuidv4();
      senddata.expire_time = moment().add(1440, "minutes").format('YYYY-MM-DD HH:mm:ss');
      console.log("sendata", senddata)

      let result = await new CustomerModel().insertOtpLogs(senddata);
      let param : any = []
      param.push(otp)
      param.push(5)
      let res = await sendOTPTemplateMessage(req.body.customer_mobile, param)
      console.log("")

      console.log("result", result)


      if (result) {
        resolve({request_id: senddata.req_id})
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)  


    }


  })

}

const checkInVarifyOtpService = (req: any, res: any) => {


  return new Promise(async (resolve, reject) => {
    try {
      let query: any = ""
      let isMatched : any = false;


      let otpdetails = await new CustomerModel().getotpDetailsByreq_id(req.body.req_id)
      if(otpdetails.length ==0 ) throw new Error("Error in login")

        if(otpdetails.length){
          console.log("req.body.otp",req.body.otp)
          console.log("otpdetails[0].otp",otpdetails[0].otp)

          if(req.body.otp != otpdetails[0].otp) 
          {
            throw new Error("Otp does not matched ")  

          }else{
            isMatched = true
          }

        }


      if (1) {
        resolve({isMatched: isMatched})
      } else {
        resolve({isMatched: isMatched})
      }

    } catch (error) {
      reject(error)  


    }


  })

}
const fetchAgentDashboardDetails = (req: any, res: any) => {


  return new Promise(async (resolve, reject) => {
    try {



      if (!req.body.agentId) throw new Error('Agent Id is required')

      let totalVisit = await new AgentModel().getTotalvisit(req.body.agentId)
      let scheduledVisit = await new AgentModel().getScheduledvisit(req.body.agentId)

      let todayAppointments = await new AgentModel().getTodayAppointment(req.body.agentId)
      let lastVisitStatus = await new AgentModel().getLastVisitStatus(req.body.agentId)
      let avgRatingReviews = await new AgentModel().getAgentRatingandReviews(req.body.agentId)
      let data: any = {}
      data.totalVisit = totalVisit
      data.scheduledVisit = scheduledVisit
      data.todayAppointments = todayAppointments
      data.lastVisitStatus = lastVisitStatus
      data.avgRatingReviews = avgRatingReviews


      if (data) {
        resolve([data])
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}










export default {
  addAgent: addAgent,
  fetchAgentList: fetchAgentList,
  fetchAgentByid: fetchAgentByid,
  updateAgent: updateAgent,
  fetchmappingAgentList: fetchmappingAgentList,
  mappingAppointmentService: mappingAppointmentService,
  mappedtimeslotByagentId: mappedtimeslotByagentId,
  fetchAllAppointment: fetchAllAppointment,
  fetchavailableAgentBydatesTimeslot: fetchavailableAgentBydatesTimeslot,
  getMappingAgentDetailsByCustomer: getMappingAgentDetailsByCustomer,
  createAdditionalAppointment: createAdditionalAppointment,
  updateAppointment: updateAppointment,
  fetchAgentforMapping: fetchAgentforMapping,
  fetchAgentDashboardDetails: fetchAgentDashboardDetails,
  agentLoginService: agentLoginService,
  checkInSendOtpService: checkInSendOtpService,
  checkInVarifyOtpService:checkInVarifyOtpService
}