import application from "../Constants/application"
import { NotificationModel } from "../Models/Notification/Notification.model"


  const fetchNotificationBYId = (req: any, res: any)=>{
    return new Promise(async (resolve , reject)=>{


     try{
      let data: any = {}
      let query:any = "";
    let   notificationdetails : any = []
    let unReadCountResult : any = [];
      
       if(req.body.userid){
        data.userid = req.body.userid
       }
         
       if(req.body.roleid == application.Roles.Admin  || req.body.roleid == application.Roles.SuperAdmin){
             data.roleid = req.body.roleid
             query =`where  n.reciver_roleid = ${ req.body.roleid} `

            

             
             notificationdetails = await new NotificationModel().fetchNotificationByAdmin(query)

            //  query =+ `and readed = 0`
            //  unReadCountResult = await new NotificationModel().UnReadNotificationByAdminCount(query)
             

       }else if(req.body.roleid == application.Roles.Agent){
             data.userid = req.body.userid
             data.roleid = req.body.roleid
             query +=  ` where r.roleid  = ${req.body.roleid}  and n.userid = ${req.body.userid}`

             notificationdetails = await new NotificationModel().fetchNotification(query)


       }else{
               data.userid = req.body.userid
               data.roleid = req.body.roleid
               query +=  ` where r.roleid  = ${req.body.roleid}  and n.userid = ${req.body.userid}`
               notificationdetails = await new NotificationModel().fetchNotification(query)
 

       }
     
        if(notificationdetails.length){
            resolve(notificationdetails)
        }else{
            resolve([])
        }

     }catch(error: any){
        reject(error)

     }



    })

  }


  const fetchNotification = (req: any, res: any)=>{
    return new Promise(async (resolve , reject)=>{


     try{
      let data: any = {}
      let query:any = "";
      let   notificationdetails : any = []
      
       if(req.body.userid){
        data.userid = req.body.userid
       }
       let count: any = 0
       let countResult: any = []
         
       if(req.body.roleid == application.Roles.Admin  || req.body.roleid == application.Roles.SuperAdmin){
             data.roleid = req.body.roleid
             query =`where  reciver_roleid = ${ req.body.roleid} `
             notificationdetails = await new NotificationModel().fetchNotificationwithDatewise(query, req.body.limit, req.body.offset)
              countResult= await new NotificationModel().fetchNotificationwithDatewiseCount(query, req.body.limit, req.body.offset)

       }else if(req.body.roleid == application.Roles.Agent || req.body.roleid == application.Roles.Customer){
             data.userid = req.body.userid
             data.roleid = req.body.roleid
             query +=  ` where reciver_roleid  = ${req.body.roleid}  and userid = ${req.body.userid}`

             notificationdetails = await new NotificationModel().fetchNotificationwithDatewise(query, req.body.limit, req.body.offset)
             countResult= await new NotificationModel().fetchNotificationwithDatewiseCount(query, req.body.limit, req.body.offset)

       }
     
        if(notificationdetails.length){
            resolve(notificationdetails)
        }else{
            resolve([])
        }

     }catch(error: any){
        reject(error)

     }



    })

  }


  const fetchNotification2 = (req: any, res: any)=>{
    return new Promise(async (resolve , reject)=>{


     try{
      let data: any = {}
      let query:any = "";
      let   notificationdetails : any = []
      
       if(req.body.userid){
        data.userid = req.body.userid
       }
       let count: any = 0
       let countResult: any = []
         
       if(req.body.roleid == application.Roles.Admin  || req.body.roleid == application.Roles.SuperAdmin){
             data.roleid = req.body.roleid
             query =`where  reciver_roleid = ${ req.body.roleid} `
             notificationdetails = await new NotificationModel().fetchNotificationwithDatewise(query, req.body.limit, req.body.offset)
              countResult= await new NotificationModel().fetchNotificationwithDatewiseCount(query, req.body.limit, req.body.offset)

       }else if(req.body.roleid == application.Roles.Agent || req.body.roleid == application.Roles.Customer){
             data.userid = req.body.userid
             data.roleid = req.body.roleid
             query +=  ` where reciver_roleid  = ${req.body.roleid}  and userid = ${req.body.userid}`

             notificationdetails = await new NotificationModel().fetchNotificationwithDatewise(query, req.body.limit, req.body.offset)
             countResult= await new NotificationModel().fetchNotificationwithDatewiseCount(query, req.body.limit, req.body.offset)

       }
     
        if(notificationdetails.length){
            resolve( {data:notificationdetails, total:countResult.length, lodable: true })
        }else{
            resolve({data:[], total:countResult.length, lodable: false })
        }

     }catch(error: any){
        reject(error)

     }



    })

  }


  
  const createNotification = (req: any, res: any)=>{
    return new Promise(async (resolve , reject)=>{


     try{
          
      if(!req.body.userid) throw new Error("userid is required")
        if(!req.body.roleid) throw new Error("roleid is required")

          let data : any = {}    
          data.userid = req.body.reciverId
          if(req.body.reciverId){
            data.userid =  req.body.reciverId
          }
           
          if(req.body.reciver_roleid){
            req.body.roleid =req.body.reciver_roleid

          }

          if(req.body.createdby){
            data.createdby = req.body.createdby
          }
          if(req.body.adminId)
          {
            data.adminId = req.body.adminId
          }

          if(req.body.description){
            data.body.description = req.body.description
          }
          
          if(req.body.title){
            data.title = req.body.title
          }
          


        let notificationdetails = await new NotificationModel().createNotification(data)
        if(notificationdetails.length){
            resolve(notificationdetails)
        }else{
            resolve([])
        }

     }catch(error: any){
        reject(error)

     }



    })

  }


export default {
 
    fetchNotificationBYId:fetchNotificationBYId,
    createNotification:createNotification,
    fetchNotification:fetchNotification,
    fetchNotification2:fetchNotification2
}