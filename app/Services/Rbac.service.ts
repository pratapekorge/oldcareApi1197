import { RbacModel } from "../Models/Rbac/Rbac.Model"

const fetchRoles = (req: any, res: any) => {

    return new Promise(async (resolve, reject) => {
      try {
        let query: any = ""
  
        // if(req.body.customerId){
        //   query = `and customerId = ${req.body.customerId} `
        // }
  
  
  
  
  
        let result = await new RbacModel().fetchRoles();
  
  
  
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


  const fetchPages = (req: any, res: any) => {

    return new Promise(async (resolve, reject) => {
      try {
        let query: any = ""
  
        if(req.query.query){
          query = `and display_name like '%${req.query.query}%' `
        }
  
  
  
  
  
        let result = await new RbacModel().fetchPages(query)
  
  
  
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

  const addRoleswithpages = (req: any, res: any) => {   

    return new Promise(async (resolve, reject) => {
      try {
        let query: any = ""
  
        if(req.query.query){
          query = `and display_name like '%${req.query.query}%' `
        }
  
  
  
  
  
        let result = await new RbacModel().fetchPages(query)
  
  
  
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





export default {
    fetchRoles:fetchRoles,
    fetchPages:fetchPages,
    addRoleswithpages:addRoleswithpages
}