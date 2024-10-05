import BaseModel from "../BaseModel";


export class RbacModel extends BaseModel{

    constructor(){
        super()


       

    }

    async fetchRoles(){

        return await this._executeQuery(`select RoleID,  RoleName, status  from roles `,[])
    }

    async fetchPages(query: any){
        console.log(`select display_name  as label , id as value from rbac_permission_pages where status =1  ${query}  `)

        return await this._executeQuery(`select display_name  as label , id as value, status from rbac_permission_pages where status =1  ${query}  `,[])
    }



    

}

