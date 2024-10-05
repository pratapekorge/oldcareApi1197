import BaseModel from "../BaseModel";

export class AddressModel extends BaseModel{

constructor(){

    super()
}

async getAllStates(query:string){
    return await this._executeQuery( `select id as value, name as label from address_state ${query}`,[])
}
async getDistrictsByState(state_id:number, query : string ){
    return await this._executeQuery(`select adt.id as value, adt.name as label from address_district adt inner join address_state ast ON  adt.state_id = ast.id where ast.id = ? ${query}`,[state_id])
}


}