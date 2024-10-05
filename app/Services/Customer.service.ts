import path from "path"
import { CustomerModel } from "../Models/Customer/Customer.model"
import formidable from "formidable";
import application from "../Constants/application";
import { promisify } from 'util';
import fs from 'fs';
import sendEmail from "../Utilities/SendEmail";
import { uploadExcelfile, uploadFileMulter } from "../Utilities/S3bucket";
import moment from "moment";
import { sendOTPTemplateMessage } from "../Utilities/Smsservice";
import Encryption from "../Utilities/Encryption";
import { AgentModel } from "../Models/Agent/Agent.Model";
const XLSX = require("xlsx");
const { v4: uuidv4 } = require('uuid');



const readFileAsync = promisify(fs.readFile);


const fetchcustomerlist = (req: any, res: any) => {

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

      let customer = await new CustomerModel().fetchcustomerlist(application.Roles.Customer, req.body.pageSize, req.body.pageSize * (req.body.pageIndex - 1), orderQuery, query)
      let total = await new CustomerModel().fetchcustomercount(application.Roles.Customer, req.body.pageSize, req.body.pageSize * (req.body.PageIndex - 1), orderQuery, query)

      if(customer.length){
         for(let i = 0; i < customer.length; i++)  {
            let agentMapped = await new CustomerModel().getMappedAgents(customer[i].id)

            customer[i].agentMapped = agentMapped.length ?  agentMapped : null
            let result = await new CustomerModel().fetchCountAppointment(customer[i].id)
            console.log("result", result)
            let isRegularAppointment = false ;
            if(customer[i].planFrequencyperMonth){   
              let appointmentCount = customer[0].duration == 2 ?  result[0].appointment/12 : result[0].appointment
              
               if(customer[i].planFrequencyperMonth > appointmentCount ){
                isRegularAppointment = true
               }
            }
  
            customer[i].isRegularAppointment = isRegularAppointment
             
            

          }
            
        
      }

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

const addCustomer = (req: any, res: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("in service")


      const form = formidable({});
      let fields;
      let files;
      [fields, files] = await form.parse(req);


      console.log("fields", fields)


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
      if (fields.city) {
        userData.city = fields.city
      }
      if (fields.dob) {
        userData.dob = fields.dob
      }
      if (fields.gender) {
        userData.gender_id = fields.gender
      }
      if (fields.planId) {
        userData.planId = fields.planId
      }
      if (fields.duration) {
        userData.duration = fields.duration
      }
      if (fields.startdate) {
        userData.start = fields.startdate
      }
      if (fields.enddate) {
        userData.end = fields.enddate
      }



      if (fields.status) {
        userData.status = fields.status
      }
      if (fields.customerNoteforAgent) {
        userData.customerNoteforAgent = fields.customerNoteforAgent
      }
      userData.roleid = application.Roles.Customer
      console.log("userData", userData)
      let customerdata = await new CustomerModel().addCustomer(userData)
      let userid = customerdata.insertId

      if(fields.isPayment){
       let data : any={}
       data.firstname = userData.firstname   
       data.lastname = userData.lastname
       data.email = userData.email
       data.paymentLink = "https://senjoy.in/"
       let res = sendEmailPaymentLink(data)

      }




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
      addressData.roleid = application.Roles.Customer
      addressData.userid = userid
      console.log("addressData",addressData)

      let addressResult = await new CustomerModel().addAddress(addressData)
      console.log("result", addressResult)




      if (fields.disease_mapping) {
        let mappingData = JSON.parse(fields.disease_mapping.toString())
        console.log("mappingData", mappingData)
        let arr = []
        console.log(" fields.disease_mapping", fields.disease_mapping)

        for (let i = 0; i < mappingData.length; i++) {

          arr.push([userid, mappingData[i], 1])


        }
        console.log("arr", arr)

        await new CustomerModel().addDiseaseMapping(arr)



      }
      console.log("customerdata", customerdata)

      resolve(customerdata)



    } catch (err: any) {
      reject(err)
      console.log("err22222", err)

    }




  })
  // let 
}


const updateCustomer = (req: any, res: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("in service")


      const form = formidable({});
      let fields, files, result;
        files = req.files;
        for (const fieldname in files) {
            if (Object.prototype.hasOwnProperty.call(files, fieldname)) {  
                const fileArray = files[fieldname];
               
                    // console.log("fieldname2222",fieldname)

                    files[fieldname] = fileArray;
                
            }
        }
        fields = req.body;
  


      console.log("fields", fields)


      let data: any = {};
      let userData: any = {}

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
      if (fields.city) {
        userData.city = fields.city
      }

      if (fields.planId) {
        userData.planId = fields.planId
      }
      if (fields.duration) {
        userData.duration = fields.duration
      }
      if (fields.startdate) {
        userData.start = fields.startdate
      }
      if (fields.enddate) {
        userData.end = fields.enddate
      }


      if (fields.country_id) {
        userData.country_id = fields.country_id
      }

      if (fields.state_id) {
        userData.state_id = fields.state_id
      }

      if (fields.city_id) {
        userData.city_id = fields.city_id
      }

      if (fields.pincode) {
        userData.pincode = fields.pincode
      }
      if (fields.status) {
        userData.status = fields.status
      }
      console.log("userData", userData)
      console.log("userData.userid", fields.customer_id)
      let s3Images: any = {};
      console.log("files.profile_image",files.profile_image)
      if (files.profile_image !== undefined && files.profile_image !== null && files.profile_image !== "") {
          if (isFileNotValid(files.profile_image[0].mimetype)) throw new Error("Only .png, .jpg, .jpeg, .pdf  format allowed!"); else { s3Images.profile_image = files.profile_image; }
      }

      if (Object.keys(s3Images).length) {
        let keys = Object.keys(s3Images);
        const s3Paths = {};
        for (let i = 0; i < keys.length; i++) {
          // console.log("s3Images[keys[i]].originalname",s3Images[keys[i]][0].originalname)
            const randomString = Math.random().toString(36).substring(2, 8);
            let name: string = "images/" + randomString + moment().unix() + "." + s3Images[keys[i]][0].originalname.split(".").pop()
            console.log("names", name)
            console.log("s3Images[keys[i][0]]",s3Images[keys[i]][0])
            userData[keys[i]] = (await uploadFileMulter(s3Images[keys[i]][0], name)).key;
        }
        Object.assign(userData, s3Paths);
    }

      let customerdata = await new CustomerModel().updateCustomer(userData, fields.customer_id)
      console.log("result", customerdata)

       let addressData : any = {}
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
      // addressData.roleid = application.Roles.Customer
      // addressData.userid = fields.customer_id
      console.log("addressData",addressData)
      


      if(Object.keys(addressData).length){
        await new CustomerModel().updateAddress(addressData, fields.customer_id)

      }
      


      if (fields.disease_mapping) {


        let mappingData = JSON.parse(fields.disease_mapping.toString())
        console.log("mappingData", mappingData)
        let arr = []
        console.log(" fields", fields.disease_mapping)
        await new CustomerModel().diseasemapingdisableByUser(0, fields.customer_id)

        for (let i = 0; i < mappingData.length; i++) {

          if ((await new CustomerModel().diseasemapppingone(fields.customer_id, mappingData[i])).length) {
            await new CustomerModel().updateDiseaseMappingexistOne(1, fields.customer_id, mappingData[i])

          } else {
            await new CustomerModel().updateDiseaseMappingOne({ userid: fields.customer_id, disease_id: mappingData[i], status: 1 })
          }

        }




      }
      console.log("customerdata", customerdata)

      resolve(customerdata)



    } catch (err: any) {
      reject(err)
      console.log("err22222", err)

    }




  })
  // let 
}

const fetchDisealist = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      let searchQuery: any = ""

      if (req.query.searchQuery) {
        searchQuery = `where subtype like '%${req.query.searchQuery}%' `
      }

      let result = await new CustomerModel().fetchDisealist(searchQuery)



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



const fetchCountrycode = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      let searchQuery: any = ""

      if (req.body.query) {
        searchQuery = `where countrycode like '%${req.body.query}%' `
      }

      let result = await new CustomerModel().fetchCountrycode(searchQuery)



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


const fetchSubscriptionList = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      let searchQuery: any = ""



      let result = await new CustomerModel().fetchsubscribtionList()



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

const getCities = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      let searchQuery: any = ""
      if(req.body.key){
        searchQuery =` and name like  '${req.body.key}'`
      }



      let result = await new CustomerModel().getCities(searchQuery)



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

const getServices = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      let searchQuery: any = ""
      let activeservices: any =[]
      let multiplyCost = 1
      // if(req.body.key){
      //   searchQuery =` and name like  '${req.body.key}'`
      // }
      if(req.body.duration){
        multiplyCost  =  req.body.duration == 2 ? 12 : 1
      }

       if(req.body.city){
         activeservices = await new CustomerModel().checkcityActiveServices(req.body.city)

       }





      let result = await new CustomerModel().getServices(searchQuery)
      if(result.length){
        for(let i=0; i<result.length;i++){
          let arr: any = []
          if(result[i].name == 'Remote'){
            arr.push(`${result[i].remote_services} remote services`)

            result[i].isDisable = 0

          }else{
            arr.push(` ${result[i].frequency} visit per month`)
            result[i].isDisable = activeservices[0].active_services == 1 ? 0 : 1

          }
          result[i].services = arr
          result[i].cost =  result[i].cost * multiplyCost
        }
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

const fetchActiveServicesBycity = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      let searchQuery: any = ""



      let result = await new CustomerModel().fetchsubscribtionList()



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

const fetchCustomerByid = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      let searchQuery: any = ""
      let id: any = ''
      if (req.query.id) {
        id = req.query.id
      }

      let result = await new CustomerModel().fetchCustomerListById(id)
      if(result.length){
        result[0].status =  result[0].status == 1 ? {label: 'Pending',value: 1}:   result[0].status == 2 ? {label: 'Active',value: 0} : {label: 'InActive',value: 0}
        result[0].duration  =  result[0].duration == 1 ? {label: 'Monthly',value: 1}:  {label: 'Yearly',value: 2}


      }
      console.log("result", result)


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


const sendEmailPaymentLink = async (usedata: any) => {
  return new Promise(async (resolve, reject) => {
      try {
          const templatePath = path.join(__dirname, '..', 'templates', 'paymentLinkTemplate.html');
          const htmlTemplate = await readFileAsync('./uploads/template/paymentLinkTemplate.html', 'utf-8');


          const modifiedHtml = htmlTemplate
              .replace('{{firstname}}', usedata.firstname)
              .replace('{{lastname}}', usedata.lastname)
              .replace('{{paymentLink}}',usedata.paymentLink);

          await sendEmail(usedata.email, 'Payment Link', modifiedHtml);

          resolve("Payment link sent successfully");
      } catch (error) {
          reject(error);
      }
  });
};

const getHealthReport = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {

   console.log("in service")


      let query : any = ""
      let orderNum = "";
      const data = [];
      const headers: any =[]
      console.log("req.body", req.body)

      if(req.body.date_range == 1 ){
        query = "WHERE hr.created_at >= NOW() - INTERVAL 7 DAY "
     }else if(req.body.date_range == 2){
       query = "WHERE hr.created_at >= NOW() - INTERVAL 30 DAY "
     }else{
       query = `where hr.created_at between  '${req.body.fromDate}' and  '${req.body.toDate}'`
     } 


     getHealthReportByDate
      if (req.body.customerId) {
        query  +=  ` and hr.customerId = ${req.body.customerId} `
      }
      // if(!req.body.fromdate) throw new Error("fromdate is required ")

      //   if(!req.body.todate) throw new Error("todate is required")
      console.log("query", query);
     

      let result = await new CustomerModel().getHealthReport(req.body.fromdate, req.body.todate,query)
      console.log("result111", result)

      const randomString = Math.random().toString(36).substring(2, 8);

      orderNum = "customerReport" + randomString

      for (const key of result) {
        data.push(key)

    }


    const wb: any = {
      SheetNames: [],
      Sheets: {}
  };
  wb['Props'] = {
      Title: "Senjoy",
      Author: "Senjoy"
  };


  const ws = XLSX.utils.sheet_add_json(null, data, {header: headers, skipHeader: false});
  const ws_name = "DataSheet 1";
  XLSX.utils.book_append_sheet(wb, ws, ws_name);

  let name = "images/report/" + orderNum + ".xlsx";
  const wbout2 = XLSX.write(wb, {bookType: 'xlsx', type: 'buffer'});

  let result3: any = await uploadExcelfile(wbout2, name);
  console.log("result 3", result3)


      if (result3) {
        resolve(result3.Location)
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}

const CreateHealthReport = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {

      


      const form = formidable({});
      let fields, files, result;
      [fields, files] = await form.parse(req);
      //   files = req.files;
      //   for (const fieldname in files) {
      //       if (Object.prototype.hasOwnProperty.call(files, fieldname)) {  
      //           const fileArray = files[fieldname];
               
      //               // console.log("fieldname2222",fieldname)

      //               files[fieldname] = fileArray;
                
      //       }
      //   }
       // fields = req.body;   

        let data : any ={}
        console.log("fields", fields)
  
   if(!fields.bookingId) throw new Error("booking id is required")
    if(!fields.customerId) throw new Error("customer id is required")
      if(!fields.agentId) throw new Error("agent id is required")
     
    if(fields.bookingId){
      data.Booking_id =  fields.bookingId
    }

    if(fields.customerId){
      data.customerId =  fields.customerId
    }
    if(fields.agentId){
      data.agentId =  fields.agentId
    }

    if(fields.age){
      data.age =  fields.age
    } 
    if(fields.weight){
      data.weight =  fields.weight
    }

    if(fields.blood_pressure){
      data.blood_pressure =  fields.blood_pressure
    }
    if(fields.heart_rate){
      data.heart_rate =  fields.heart_rate
    }
    if(fields.cogf_instances_of_confusion){
      data.cogf_instances_of_confusion =  fields.cogf_instances_of_confusion
    }
    if(fields.cogf_getting_lost){
      data.cogf_getting_lost =  fields.cogf_getting_lost
    }
    if(fields.cogf_instances_of_body_shivering){
      data.cogf_instances_of_body_shivering =  fields.cogf_instances_of_body_shivering
    }
    if(fields.cogf_fall_instances){
      data.cogf_fall_instances =  fields.cogf_fall_instances
    }
    if(fields.cogf_remarks){
      data.cogf_remarks =  fields.cogf_remarks
    }
    if(fields.mood_behavior_depression){
      data.mood_behavior_depression =  fields.mood_behavior_depression
    }

    if(fields.mood_behavior_anxiety){
      data.mood_behavior_anxiety =  fields.mood_behavior_anxiety
    }
    if(fields.mood_behavior_aggression){
      data.mood_behavior_aggression =  fields.mood_behavior_aggression
    }
    if(fields.mood_behavior_Dellusions){
      data.mood_behavior_Dellusions =  fields.mood_behavior_Dellusions
    }
    if(fields.mood_behavior_remarks){
      data.mood_behavior_remarks =  fields.mood_behavior_remarks
    }
    if(fields.sleep_total_hours){
      data.sleep_total_hours =  fields.sleep_total_hours
    }
    if(fields.sleep_daytime_sleepiness){
      data.sleep_daytime_sleepiness =  fields.sleep_daytime_sleepiness
    }
    if(fields.sleep_disturbance_instances){
      data.sleep_disturbance_instances =  fields.sleep_disturbance_instances
    }
    if(fields.sleep_remarks){
      data.sleep_remarks =  fields.sleep_remarks
    }
    if(fields.meal_breakfast_taken){
      data.meal_breakfast_taken =  fields.meal_breakfast_taken
    }
    if(fields.meal_lunch_taken){
      data.meal_lunch_taken =  fields.meal_lunch_taken
    }
    if(fields.meal_dinner_taken){
      data.meal_dinner_taken =  fields.meal_dinner_taken
    }
    if(fields.meal_remarks){
      data.meal_remarks =  fields.meal_remarks
    }
    if(fields.physical_walks_taken){
      data.physical_walks_taken =  fields.physical_walks_taken
    }
    if(fields.physical_yoga){
      data.physical_yoga =  fields.physical_yoga
    }
    if(fields.physical_sports){
      data.physical_sports =  fields.physical_sports
    }

    if(fields.physical_remarks){
      data.physical_remarks =  fields.physical_remarks
    }
    if(fields.health_remark){
      data.health_remark =  fields.health_remark
    }


    


   
     result = await new CustomerModel().inserthealthReport(data)
     let health_report_id = result.insertId
     

     if(result.length){
      let arr : any = fields?.medicine || [];   
      for(let i=0;i<arr.length;i++){
              let data: any ={
              }
              
              data.name = arr[i].name;
              data.quantity = arr[i].quantity;
              data.morning = arr[i].morning;
              data.afternoon=arr[i].afternoon
              data.evening = arr[i].evening
              data.status = 1
              data.health_report_id = health_report_id


             await new CustomerModel().insertIntoMedicine(data);

              
      }
         
     }
     if(result){

      resolve(result)
     }else{
          resolve([])
     }

    } catch (error) {
      reject(error)


    }


  })

}

const fetchActiveCustomerList = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {

   


      let query = ""
      let orderNum = "";
      const data = [];
      const headers: any =[]

      console.log("req.query",req.query)



      if (req.query.key) { 
        query = ` and u.firstname like '%${req.query.key}' or  u.lastname like '%${req.query.key}' `
      }
     

      let result = await new CustomerModel().fetchActiveCustomerlist(query)
      if(result.length){
      // result.unshift({label: "All Customer", value: null})
      }
      // console.log("result111", result)

    
      if (result) {
        resolve(result)
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}


const fetchHealthReportList = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      console.log("in service")
      let query: any = ""

      if(req.body.customerId){
        query = `and customerId = ${req.body.customerId} `
      }





      let result = await new CustomerModel().fetchHealthReportList(req.body.fromDate, req.body.toDate, query)



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

const fetchHealthReportList2 = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      console.log("in service")

      if(!req.body.customerId) throw new Error('Customer id is required')
      let query: any = ""
      

      if(req.body.date_range == 1 ){
         query = "WHERE hr.created_at >= NOW() - INTERVAL 7 DAY "
      }else if(req.body.date_range == 2){
        query = "WHERE hr.created_at >= NOW() - INTERVAL 30 DAY "
      }else{
        query = `where hr.created_at between  '${req.body.fromDate}' and  '${req.body.toDate}'`
      } 

      if(req.body.customerId){
        query  += ` and hr.customerId = ${req.body.customerId} `
      }

     





      let result = await new CustomerModel().fetchHealthReportList2(req.body.fromDate, req.body.toDate, query)



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

const sendOtpsservice = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      console.log("in service")
      let newuser ;
      let query : any = ""

      if(!req.body.mobile){

      }
      

       let details = await new CustomerModel().fetchUserDetails(req.body.mobile, application.Roles.Customer)
      if(!details.length){
        let data : any  ={

        }

        data.mobile = req.body.mobile
        data.roleid = application.Roles.Customer
         newuser = await new CustomerModel().createuser(data)
         let addressData : any = {};
         addressData.userid = newuser.insertId
         addressData.roleid = application.Roles.Customer
             
         let res = await new CustomerModel().addAddress(addressData)

        
       }

       let  senddata: any = {}

       const otp = Math.floor( 100000 + Math.random() * 900000)   
       senddata.otp = otp;
       senddata.mobile = req.body.mobile 
       senddata.userid =  details.length && details[0].id ? details[0].id :newuser.insertId
       senddata.req_id = uuidv4();
       senddata.expire_time = moment().add(1440, "minutes").format('YYYY-MM-DD HH:mm:ss');
       let param : any = []
       param.push(otp)
       param.push(5)
       let res = await sendOTPTemplateMessage(req.body.mobile, param)

      
      let result = await new CustomerModel().insertOtpLogs(senddata)   

      if (result) {
        resolve( { request_id: senddata.req_id, userExists: 1, isApproved: 1, userid: senddata.userid })
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}

const verifyOtpsservice = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      console.log("in service")
      let newuser ;
      let query : any = ""

      let otpdetails = await new CustomerModel().getotpDetailsByreq_id(req.body.req_id)
      console.log("otpdetails",otpdetails)
      if(otpdetails.length ==0 ) throw new Error("Error in login")
     if(otpdetails.length){
             
         if(otpdetails[0].trials == 0 ) throw new Error('your trials has been ended')
         if(otpdetails[0].otp != req.body.otp){
            throw new Error("Incorrect Otp")
       
             otpdetails[0].trials = otpdetails[0].trials -1

     let res = await new CustomerModel().upateotptrials({trials: otpdetails[0].trials}, req.body.req_id)
     console.log("res",res)

     }

     }

     let userdetails =  await new CustomerModel().fetchuserdetailsbyid(otpdetails[0].userid)  
     console.log("userdetails", userdetails)    
     let token: any = await Encryption.generateJwtToken(otpdetails[0].userid)

     if(userdetails.length){
              
      resolve([{existuser: 1 , user : userdetails, token: token}])


  }else{

      resolve ([{ existuser: 0 ,result : []}])
  }

    } catch (error) {
      reject(error)


    }


  })

}

const isFileNotValid = (type: any) => {
  console.log("type", type)
  if (type == 'image/jpeg' || type == 'image/jpg' || type == 'image/png' || type == "application/pdf") {
      // if (type == 'image/svg+xml' || type == 'image/jpg' || type == 'image/png' || type == "application/pdf") {
      return false;
  }
  return true;
};


const getReportDatesById = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {

   


      if (!req.body.id) { 
        throw  new Error("id is required")
      }
     

      let result = await new CustomerModel().getReportDatesById(req.body.id)

    
      if (result) {
        resolve(result)
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}


const getHealthReportByDate = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {

   


      if (!req.body.id) { 
        throw  new Error("id is required")
      }
      if (!req.body.date) { 
        throw  new Error("date is required")
      }
     

      let result = await new CustomerModel().getReportDetailsByDate(req.body.date, req.body.id)
        if(result.length){
          let medicine = await new CustomerModel().fetchMedicinesByReportId(result[0].report_id)
            
          result[0].medicine = medicine
        }
    
      if (result) {
        resolve(result)
      } else {
        resolve([])
      }

    } catch (error) {
      reject(error)


    }


  })

}











export default {

  fetchcustomerlist: fetchcustomerlist,
  fetchDisealist: fetchDisealist,
  addCustomer: addCustomer,
  fetchSubscriptionList: fetchSubscriptionList,
  updateCustomer: updateCustomer,
  fetchCustomerByid: fetchCustomerByid,
  getHealthReport:getHealthReport,
  fetchActiveCustomerList:fetchActiveCustomerList,
  fetchHealthReportList:fetchHealthReportList,
  fetchHealthReportList2:fetchHealthReportList2,
  sendOtpsservice:sendOtpsservice,
  verifyOtpsservice:verifyOtpsservice,
  getReportDatesById:getReportDatesById,
  getHealthReportByDate:getHealthReportByDate,
  fetchCountrycode:fetchCountrycode,
  CreateHealthReport:CreateHealthReport,
  fetchActiveServicesBycity:fetchActiveServicesBycity,
  getCities:getCities,
  getServices:getServices

  // sendPaymentLink:sendPaymentLink
}