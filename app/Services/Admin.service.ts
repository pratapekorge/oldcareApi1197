import Hashing from "../Utilities/Hashing"
import { AdminModel } from "../Models/Admin/admin.model"
import Encryption from "../Utilities/Encryption"
import sendEmail from "../Utilities/SendEmail"
import commonFunction from "../Utilities/common.function"
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import application from "../Constants/application"
import { query } from "express"

const readFileAsync = promisify(fs.readFile);
const { v4: uuidv4 } = require('uuid');


const loginservice = (req: any, res: any)=>{

 return new Promise(async (resolve, reject)=>{  
  try {
    let data: any =[]
    let admin : any =[]
    let agentDetails = [];
    let roleid : any =""
     
    
       
    let boolean: any = false
    
      if(req.body.email){
         admin = await new AdminModel().getuserByEmail(req.body.email)
      }
      if(admin.length ==0){

        agentDetails = await new AdminModel().fetchAgentDetailsByEmail(req.body.email)
      } 

      if(agentDetails.length ==0 && admin.length ==0 ){
           throw new Error("email id is not registerd")
      }

       

      if(req.body.password && admin.length){
         boolean = await new Hashing().verifypassword(req.body.password,admin[0].password );
         roleid = admin[0].roleid
      }else if(req.body.password && agentDetails.length){
        boolean = await new Hashing().verifypassword(req.body.password,agentDetails[0].password );
          roleid = agentDetails[0].roleid
      }
      if(!boolean ) {
        throw new Error("password is not matched")
      }
    if(boolean){
        let newResult  = await new AdminModel().getPagesByRoleid(roleid)  
        let pages = newResult.map((element: any) => element.path)


      let  admindata  : any = {
              userid:   admin.length ?  admin[0].adminId : agentDetails.id,
              email:    req.body.email
        }

        let token = await Encryption.generateJwtToken(admindata)
       
      let user : any = []
        if(admin.length){
            user =  [{email: admin[0].email, mobile: admin[0].mobile,  userName: admin[0].name, adminId: admin[0].adminId, roleid:admin[0].roleid}]

        }else{
            user =  [{email: agentDetails[0].email, mobile: agentDetails[0].mobile,  userName: agentDetails[0].name, Id: agentDetails[0].id, roleid:agentDetails[0].roleid}]

        }
      // let data = []
      // user[0].email  = admin[0].email
      // user[0].mobile = admin[0].mobile
      // user[0].adminId = admin[0].adminId
      user[0].pages = pages
      user[0].authority =  ["user"];
      
      data.push({
        token : token,
        user: user
      })






       
    }
    
    resolve(data)
          
         




    
      

  }catch(error){
    reject(error)


  }


 })

}


const sendEmailToLogin = async (req: any, res: any): Promise<string> => {
  return new Promise(async (resolve, reject) => {
      try {
           
          let details  = await new AdminModel().getuserByEmail(req.body.email)
          if(details.length==0){
            throw new Error('Your Email does not exist')
          }
          let hashPass: any =""
          const newPassword = commonFunction.generateRandomPassword(6);
          console.log("newPassword",newPassword)
          hashPass = await new Hashing().generateHash(newPassword, 10);

          if(req.body.roleid == application.Roles.Admin){
            await new AdminModel().updatePassword(hashPass, req.body.email);
          }else if(req.body.roleid == application.Roles.Agent){
            await new AdminModel().updatePasswordOfAgent(hashPass, req.body.email);
     
          }
          
          const templatePath = path.join(__dirname, '..', 'templates', 'passwordChangedTemplate.html');
          const htmlTemplate = await readFileAsync('./uploads/template/passwordChangedTemplate.html', 'utf-8');
          const modifiedHtml = htmlTemplate.replace('{{this.password}}', newPassword);

          await sendEmail(req.body.email, 'Password changed', modifiedHtml);

          resolve("Password sent successfully");
      } catch (error) {
          reject(error);
      }
  });
};


const addAdminservice = async (req: any, res: any) => {
  return new Promise(async (resolve, reject) => {
      try {
        let adminData : any = {}
            
        if(req.body.name!=null && req.body.name!=undefined && req.body.name!=''){
          adminData.name = req.body.name
        }

        if(req.body.roleid!=null && req.body.roleid!=undefined && req.body.roleid!=''){
          adminData.roleid = req.body.roleid
        }
        if(req.body.email!=null && req.body.email!=undefined && req.body.email!=''){
          adminData.email = req.body.email
        }
        if(req.body.mobile!=null && req.body.mobile!=undefined && req.body.mobile!=''){
          adminData.mobile = req.body.mobile
        }
        if(req.body.password!=null && req.body.password!=undefined && req.body.password!=''){
          let pass = await new  Hashing().generateHash(req.body.password, 10)
          console.log("pass", pass);
          adminData.password = pass
        }
        console.log("adminData", adminData)
        let admin = await new AdminModel().addAdminUser(adminData)
        console.log("admin", admin)


        


        
          resolve(admin);
      } catch (error) {
        console.log("error", error)
          reject(error);
      }
  });
};


const fetchAdminList = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {

      let orderQuery: any = ""
      console.log("in service start")

      if (req.body.sort.key != "") {
        orderQuery = " ORDER BY " + req.body.sort.key + " " + req.body.sort.order + " ";
      } else {
        orderQuery = " ORDER BY adminId DESC ";
      }
      console.log("req.body", req.body)


      let query = ""
      if (req.body.query != "") {
        query = ` and name like '%${req.body.query}%' `
      }
      if (req.body.filterData.status) {
        query += `and status = ${req.body.filterData.status} `
      }

      let admin = await new AdminModel().fetchAdminList(application.Roles.Admin, req.body.pageSize, req.body.pageSize * (req.body.pageIndex - 1), orderQuery, query)
      console.log("admin", admin);
      let total = await new AdminModel().fetchAdminListCount(application.Roles.Admin, req.body.pageSize, req.body.pageSize * (req.body.PageIndex - 1), orderQuery, query)



      if (admin.length && total.length) {
        resolve({
          data: admin, total: total.length
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

const fetchAdminById = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      let searchQuery: any = ""
      let id: any = ''
      if (req.query.id) {
        id = req.query.id
      }

      let result = await new AdminModel().fetchAdminById(id)
      if(result.length){
        result[0]. status =  result[0].status ? {label: 'Active',value: 1}:  {label: 'InActive',value: 0}
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

const fetchRoles = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
      let searchQuery: any = ""
      let id: any = ''
      if (req.query.query) {
        searchQuery = `where RoleName like '%${req.query.query}%' `
      }

      let result = await new AdminModel().fetchRoles(searchQuery)
      
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

const fetchOverallReportByAdmin = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {


    try {
      let searchQuery: any = ""
      let monthquery : any = ""
      let id: any = ''
      if (req.query.query) {
        searchQuery = `where RoleName like '%${req.query.query}%' `
      }
      if(req.body.isMonth){
        monthquery = " and  MONTH(created_at) = MONTH(NOW())" 
      }else{
        monthquery = "    AND YEAR(created_at) = YEAR(NOW())"
      }

      let registered_customer =  await new AdminModel().fetchregisteredCustomer(monthquery)
      let total_customer = await new AdminModel().fetchTotalCustomer(query);
      let registerd_agent = await new AdminModel().fetchRegisteredAgent(monthquery)
      let total_agent = await new AdminModel().fetchTotalAgent(monthquery)
      let sales : any =[]

      if(req.body.isMonth){
         sales = await new  AdminModel().fetchsalesforMonth()

      }else{
         sales = await new AdminModel().fetchsalesforYear()
      }

      

      let res : any = {}
      res.registered_customer = registered_customer
      res.total_customer = total_customer
      res.registerd_agent = registerd_agent
      res.total_agent = total_agent
      res.regular_sales = sales








      
      


      if (res) {
        resolve(res)
      } else {
        resolve({
          registered_customer:0,
          total_customer:0,
          registerd_agent:0,
          total_agent:0,
          regular_sales:0

        })
      }

    } catch (error) {
      reject(error)


    }


  })

}

const fetchOverallReportByAdmin2 = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {


    try {
      let searchQuery: any = ""
      let monthquery : any = ""
      let yearQuery: any = ""
      let id: any = ''
      if (req.query.query) {
        searchQuery = `where RoleName like '%${req.query.query}%' `
      }
      
        monthquery = " and  MONTH(created_at) = MONTH(NOW())" 
    
        yearQuery = " AND YEAR(created_at) = YEAR(NOW())"
    

      let registered_customer_monthly =  await new AdminModel().fetchregisteredCustomer(monthquery)
      let registered_customer_yearly =  await new AdminModel().fetchregisteredCustomer(yearQuery)

      let total_customer_monthly = await new AdminModel().fetchTotalCustomer(monthquery);
      let total_customer_yearly = await new AdminModel().fetchTotalCustomer(yearQuery);

      let registerd_agent_monthly = await new AdminModel().fetchRegisteredAgent(monthquery)
      let registerd_agent_yearly = await new AdminModel().fetchRegisteredAgent(yearQuery)

      let total_agent_monthly = await new AdminModel().fetchTotalAgent(monthquery)
      let total_agent_yearly = await new AdminModel().fetchTotalAgent(yearQuery)

      
      let sales : any =[]
      let salesForMonth : any = [];
      let salesForYear : any = [];

      
         salesForMonth = await new  AdminModel().fetchsalesforMonth()
      let   yeardisesequery = `where Year(pdmt.createdAt) = Year(NOW()) ` 
      let monthDiseseQuery = `where month(pdmt.createdAt) = month(NOW())`
  
        salesForYear = await new AdminModel().fetchsalesforYear()
        let diseaseOverviewmonthly = await new AdminModel().fetchDiseaseoverview(monthDiseseQuery)
        let diseaseOverviewyearly = await new AdminModel().fetchDiseaseoverview(yeardisesequery)
        let salesaddmonth = await new AdminModel().fetchAddSalesofMonth();
        let salesaddYear = await new AdminModel().fetchAdditionalSalesforYear();
      let   latestcustomer= await new AdminModel().latestcustomer();
      let latestagents = await new AdminModel().latestAgent();
      let latestvisit = await new AdminModel().latestVisit()

      

      

      let res : any = {}
      let monthly: any ={ }
      let yearly: any = {}

      monthly.registered_customer = registered_customer_monthly
      monthly.total_customer = total_customer_monthly
      monthly.registerd_agent= registerd_agent_monthly
      monthly.total_agent = total_agent_monthly
      monthly.sales_regular = salesForMonth
      monthly.sales_additional = salesaddmonth
      monthly.disease = diseaseOverviewmonthly
      yearly.registered_customer = registered_customer_yearly
      yearly.registerd_agent =registerd_agent_yearly
      yearly.total_customer = total_customer_yearly
      yearly.total_agent = total_agent_yearly
      yearly.sales_regular = salesForYear 
      yearly.sales_additional = salesaddYear

      yearly.disease =diseaseOverviewyearly



      res.monthly = monthly
      res.yearly = yearly
      res.latestCustomer = latestcustomer
      res.latestAgents = latestagents
      res.latestVisit = latestvisit
      // res.diseases = diseaseOverview


      





      

      // res.registered_customer = registered_customer
      // res.total_customer = total_customer
      // res.registerd_agent = registerd_agent
      // res.total_agent = total_agent
      // res.regular_sales = sales








      
      


      if (res) {
        resolve(res)
      } else {
        resolve({
          registered_customer:0,
          total_customer:0,
          registerd_agent:0,
          total_agent:0,
          regular_sales:0,
          latestCustomer:[],
          latestAgents: [],
          latestVisit: []




        })
      }

    } catch (error) {
      reject(error)


    }


  })

}
 


const updateadmin = (req: any, res: any) => {

  return new Promise(async (resolve, reject) => {
    try {
    

      let adminData : any = {}
      if(!req.body.id) throw new Error('id is required')
            
      if(req.body.name!=null && req.body.name!=undefined && req.body.name!=''){
        adminData.name = req.body.name
      }

      if(req.body.roleid!=null && req.body.roleid!=undefined && req.body.roleid!=''){
        adminData.roleid = req.body.roleid
      }
      if(req.body.email!=null && req.body.email!=undefined && req.body.email!=''){
        adminData.email = req.body.email
      }
      if(req.body.mobile!=null && req.body.mobile!=undefined && req.body.mobile!=''){
        adminData.mobile = req.body.mobile
      }
      if(req.body.password!=null && req.body.password!=undefined && req.body.password!=''){
        let pass = await new  Hashing().generateHash(req.body.password, 10)
        console.log("pass", pass);
        adminData.password = pass
      }
       console.log("req.body.status",req.body.status);
      if(req.body.status!=null && req.body.status!=undefined && req.body.status!=''){
        adminData.status = req.body.status
      }
       adminData.status = req.body.status!==undefined ?  req.body.status : 1;

      console.log("adminData", adminData)

      let result = await new AdminModel().updateadmin(adminData, req.body.id)
      
      console.log("result", result)


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
  fetchOverallReportByAdmin2:fetchOverallReportByAdmin2,
    loginservice: loginservice,
    sendEmailToLogin:sendEmailToLogin,
    addAdminservice:addAdminservice,
    fetchAdminList:fetchAdminList,
    fetchAdminById:fetchAdminById,
    fetchRoles:fetchRoles,
    updateadmin:updateadmin,
    fetchOverallReportByAdmin:fetchOverallReportByAdmin
}


