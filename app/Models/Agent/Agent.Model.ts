

import BaseModel from "../BaseModel";



export class AgentModel extends BaseModel {

    constructor() {
        super();
    }

    async addAgent(data: any) {
        return await this._executeQuery(`insert into users set ? `, [data])
    }
    async addAddress(data: any) {
        return await this._executeQuery(`insert into addresses set ? `, [data])
    }
    async addProfileDetails(data: any) {
        return await this._executeQuery(`insert into profile set ? `, [data])
    }
    async insertOtpLogs(data: any) {
        return await this._executeQuery(`insert into user_login_logs set ? `, [data])
    }


    async UpdateProfileDetails(data: any, id: any) {
        return await this._executeQuery(`update profile set ? where userid = ? `, [data, id])
    }


    async fetchAgentList(roleid: any, limit: any, offset: any, orderQuery: any, query: any) {
        return await this._executeQuery(`select u.id, u.firstname, u.lastname, u.mobile, u.email, u.dob, u.status ,u.roleid,  json_object('label', g.name, 'value', g.id) as gender
                                            from users u 
                                            left join roles r on r.RoleID = u.roleid 
                                            left join gender g on g.id = u.gender_id
                                            left join profile p on p.userid = u.id and p.roleid = u.roleid 
                                            where u.roleid = ${roleid} ${query} ${orderQuery} limit ${limit} offset ${offset}
                                            `, [])
    }

    async fetchAgentListById(agent_id: any) {
        return await this._executeQuery(`select u.firstname as firstName, u.id ,  u.lastname as lastName, p.adharNo,p.panNo, p.adhar, p.pan, p.educationaldocs,p.work_exp,  p.profile, u.email,u.status,  DATE_FORMAT( u.dob, '%Y-%m-%d') as dob , u.roleid,  ads.landmark,      u.mobile as mobleNumber, u.end, ads.address, JSON_OBJECT('label',g.name, 'value', g.id) as gender,  ads.pincode as pinCode, JSON_OBJECT('label',ast.name, 'value', ast.id ) as state, JSON_OBJECT('label',cn.name, 'value', cn.id ) as country   ,JSON_OBJECT('label',ad.name, 'value', ad.id )  as city    from users u
                                            left join addresses ads on ads.userid = u.id and ads.roleid = u.roleid
                                            left join country cn on cn.id = ads.country_id
                                            left join address_state ast on ast.id = ads.state_id
                                            left join address_district ad on ad.id = ads.district_id 
                                            left join gender g on g.id = u.gender_id
                                            left join profile  p on p.userid = u.id and p.roleid = u.roleid
                                            
                                            where u.id = ?`, [agent_id])
    }


    async fetchAgentListCount(roleid: any, limit: any, offset: any, orderQuery: any, query: any) {

        return await this._executeQuery(`select u.firstname, u.lastname, u.mobile, u.email, u.dob, u.status ,u.roleid,  json_object('label', g.name, 'value', g.id) as gender
                                            from users u 
                                            left join roles r on r.RoleID = u.roleid 
                                            left join gender g on g.id = u.gender_id
                                            left join profile p on p.userid = u.id and p.roleid = u.roleid 
                                            where u.roleid = ${roleid} ${query} ${orderQuery}`, [])

    }

    async fetchmappingAgentList(roleid: any, query: any) {
        return await this._executeQuery(`select  concat( u.firstname," ",u.lastname) as label, u.id as value, u.mobile, u.email, u.dob, u.status ,u.roleid,  json_object('label', g.name, 'value', g.id) as gender
                                            from users u 
                                            left join roles r on r.RoleID = u.roleid 
                                            left join gender g on g.id = u.gender_id
                                            left join profile p on p.userid = u.id and p.roleid = u.roleid 
                                            where u.roleid = ${roleid} ${query} 
                                            `, [])
    }



    async updateAddress(data: any, id: any) {
        console.log("data11", data);
        console.log("id", id)
        return await this._executeQuery(`update addresses set ? where userid = ? `, [data, id])
    }

    async updateAgentuser(data: any, id: any) {
        return await this._executeQuery(`update users set ? where id = ? `, [data, id])
    }


    async fetchPlanDetails(id: any) {
        return await this._executeQuery(`select u.id , p.frequency, p.name, u.duration  from users u 
                                        left join plan p on p.id = u.planId 
                                        where u.id = ? `, [id])
    }


    async addAgentAppointment(data: any) {
        return await this._executeQuery(`insert into agentappointments set ?`, [data])
    }

    async getAgentAppointment(customerid: any, date: any, timeslot: any) {
        return await this._executeQuery(`select AppointmentID, customerId, AgentID, atype, AppointmentDateTime, timeslot, status from agentappointments
                                            where customerId = ${customerid} and 
                                            date(AppointmentDateTime) = '${date}' and timeslot = ${timeslot} and status <> -1 `, [])
    }

    async updateAppointment(data: any, id: any) {
        return await this._executeQuery(`update agentappointments set ? where AppointmentID = ?`, [data, id])
    }

    async assignAgentToCustomer(data: any) {
        return await this._executeQuery(`insert into agent_mapping set ?`, [data])
    }

    async updatemapping(data: any, customer_id: any) {
        return await this._executeQuery(`update agent_mapping set ? where customer_id = ? `, [data, customer_id])
    }
    async updateupcomingappointment(agentId: any, customerId: any) {
        return await this._executeQuery(`UPDATE agentappointments 
                                            SET AgentID = ? 
                                            WHERE customerId = ? 
                                            AND DATE(AppointmentDateTime) > CURDATE();

                                            `, [agentId, customerId])
    }
    async mappedAgentDetails(customerid: any) {
        return await this._executeQuery(`select customer_id, agentId from agent_mapping
                                            where customer_id = ? and status = 1`, [customerid])
    }

    async checkAgent(customer_id: any) {
        return await this._executeQuery(`select AgentID from  agent_mapping  where customer_id = ? and status = 1 `, [customer_id])
    }


    async getmappedtimeslot(agentId: any, date: any) {
        return await this._executeQuery(`   SELECT agap.customerId, agap.timeslot,  t.name as mappedtimeslot, CONCAT(u.firstname, " ", u.lastname) AS customer 
                                            FROM agentappointments agap
                                            LEFT JOIN users u ON u.id = agap.customerId
                                            left join timeslot t on t.id = agap.timeslot
                                            WHERE agap.AgentID = ?
                                            AND DATE(agap.AppointmentDateTime) = ?

                                            `, [agentId, date])
    }

    async getallAppintments(limit: any, offset: any, orderQuery: any, query: any) {

        console.log(`SELECT agap.AppointmentID, agap.customerId, agap.atype, DATE_FORMAT( agap.AppointmentDateTime, '%d-%m-%Y') as AppointmentDateTime, CONCAT(a.firstname, " ", a.lastname) AS agent,   agap.timeslot,  t.name as mappedtimeslot, CONCAT(u.firstname, " ", u.lastname) AS customer , agap.Status
                                            FROM agentappointments agap
                                            LEFT JOIN users u ON u.id = agap.customerId
                                            LEFT JOIN users a ON a.id = agap.AgentID
                                            left join timeslot t on t.id = agap.timeslot
                                            ${query}  group by agap.AppointmentDateTime, agap.timeslot 
                                             ${orderQuery} limit ${limit} offset ${offset}
 `)

        return await this._executeQuery(`SELECT  agap.AppointmentID , case when agap.atype = 1 then 'Regular' else 'Additional' end as atype,  agap.customerId,  DATE_FORMAT( agap.AppointmentDateTime, '%d-%m-%Y') as AppointmentDateTime, CONCAT(a.firstname, " ", a.lastname) AS agent,   agap.timeslot,  t.name as mappedtimeslot, CONCAT(u.firstname, " ", u.lastname) AS customer , agap.Status
                                            FROM agentappointments agap
                                            LEFT JOIN users u ON u.id = agap.customerId
                                            LEFT JOIN users a ON a.id = agap.AgentID
                                            left join timeslot t on t.id = agap.timeslot
                                            ${query}  group by agap.AppointmentDateTime, agap.timeslot 
                                             ${orderQuery} limit ${limit} offset ${offset}
                                            `, [])
    }

    async getallAppintmentsCount(limit: any, offset: any, orderQuery: any, query: any) {
        return await this._executeQuery(`SELECT agap.customerId, agap.atype,  agap.AppointmentDateTime, CONCAT(a.firstname, " ", a.lastname) AS agent,   agap.timeslot,  t.name as mappedtimeslot, CONCAT(u.firstname, " ", u.lastname) AS customer , agap.Status
                                            FROM agentappointments agap
                                            LEFT JOIN users u ON u.id = agap.customerId
                                            LEFT JOIN users a ON a.id = agap.AgentID
                                            left join timeslot t on t.id = agap.timeslot
                                            ${query}  group by agap.AppointmentDateTime, agap.timeslot 
                                             ${orderQuery} 
                                            `, [])
    }


    async getAvailableAgentsByDatenTimeslot(date: any, timeslot: any, roleid: any) {

        return await this._executeQuery(`  SELECT 
                                                    CONCAT(u.firstname, ' ', u.lastname) AS label , u.id as value
                                                FROM users u
                                                LEFT JOIN agentappointments agap 
                                                    ON u.id = agap.AgentID 
                                                    AND DATE(agap.AppointmentDateTime) = "${date}"
                                                    AND agap.timeslot = ${timeslot}
                                                    AND agap.status != 0
                                                WHERE u.roleid = ${roleid}
                                                AND agap.AppointmentID IS NULL;
                                                            `, [])
    }

    async getMappingAgentDetailsByCustomer(id: any) {
        return await this._executeQuery(`select am.agentId, concat(u.firstname, " ", u.lastname) as name , u.email, u.mobile  from agent_mapping am
                                                left join users u on u.id = am.agentId
                                                where am.customer_id = ? and am.status=1;`, [id])
    }

    async getRatingandReviews(id: any) {
        return await this._executeQuery(`select rating, reviews from agent_RatingReviews 
                                            where agentId =  ?;
                                            ;`, [id])
    }

    async getTotalReview(id: any) {
        return await this._executeQuery(`select count(id) as total_reviews from agent_RatingReviews
                                            where agentId = ?`, [id])
    }

    async getAgentList(query: any) {
        return await this._executeQuery(`select concat(u.firstname , " ", u.lastname) as label , u.id as value  from users u 
                                            where u.status = 2 and u.roleid = 4 ${query}`, [])
    }


    async getTotalvisit(agentId: any) {
        return await this._executeQuery(`select count(AppointmentID) as total_visit from agentappointments
                                        where AgentID = ? 
                                        and  status > 1`, [agentId])
    }

    async getScheduledvisit(agentId: any) {
        return await this._executeQuery(`select  count(AppointmentID) as total_upcoming_visits  from  agentappointments 
                                       where  AgentID = ?  and status = 2
                                        `, [agentId])
    }

    async getTodayAppointment(agentId: any) {
        return await this._executeQuery(`select agap.AppointmentID, agap.customerId, concat(u.firstname," ",u.lastname ) as name,  agap.atype, AppointmentDateTime  from agentappointments agap
                                            left join users u on u.id = agap.customerId 
                                            where  agap.AgentID = ?
                                            and DATE(AppointmentDateTime) = curdate() `, [agentId]) 
    }

    async getLastVisitStatus(agentId: any) {
        return await this._executeQuery(`select ar.customerId, ar.rating, ar.reviews, ar.created_at from agent_RatingReviews ar
                                            left join users u on u.id = ar.customerId
                                            where  agentId = ?
                                            order by ar.id desc limit 1`, [agentId]) 
    }

    async getAgentRatingandReviews(agentId: any) {
        return await this._executeQuery(`select count(ar.id) as total_reviews,avg(ar.rating) as avg_rating , concat(u.firstname, " ", u.lastname) as name   from agent_RatingReviews  ar
                                            left join users u on u.id = ar.agentId and u.roleid = 4
                                            where agentId = ?`, [agentId]) 
    }

    async fetchAgentDetailsByEmail(email: any) {
        return await this._executeQuery(`select id , concat(firstname," ", lastname) as name , roleid, dob, mobile,password from users 
                                              where email = ? and roleid = 4`, [email]) 
    }
    












}

