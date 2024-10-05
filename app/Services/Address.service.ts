import { AddressModel } from "../Models/Address/Address.model"


const getAllStates = async (query : string ) =>{
    let data = await new AddressModel().getAllStates(query)
    if (data.length == 0) {
            throw new Error("States not found!")
        }
    return data 
}

const getDistrictsByState = async ( state_id:number, query : string ) =>{
    let data = await new AddressModel().getDistrictsByState(state_id, query )
    if (data.length == 0) {
            throw new Error("Districts not found!")
        }
    return data 
}

export default {
    getDistrictsByState:getDistrictsByState,
    getAllStates:getAllStates
}