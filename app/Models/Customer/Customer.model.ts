import BaseModel from "../BaseModel";

export class CustomerModel extends BaseModel {


    constructor() {
        super()
    }

    async fetchcustomerlist(roleid: any, limit: any, offset: any, orderQuery: any, query: any) {
        console.log("query", `select u.id, u.firstname , u.lastname,  u.mobile, u.email, u.end as planexpiration, u.duration, ad.name as city, ads.pincode, p.frequency  as planFrequencyperMonth
                                        from users u 
                                        join roles r on r.RoleID = u.roleid 
                                        left join  plan p on p.id = u.planId
                                        left join addresses ads on  ads.userid = u.id and ads.roleid = u.roleid
                                        left join country_codes cc on cc.id = ads.country_id  
                                        left join address_state  ast on ast.id =ads.state_id 
                                        left join address_district ad on ad.id = ads.district_id 
                                        where u.roleid = ${roleid}  ${query}
                                        ${orderQuery}  limit ${limit} offset ${offset}
                                        ` )
        return await this._executeQuery(`select u.id, u.firstname , u.lastname,  u.mobile, u.email, u.end as planexpiration,  u.duration,  u.status ,ad.name as city, ads.pincode,  p.frequency  as planFrequencyperMonth  
                                        from users u 
                                        join roles r on r.RoleID = u.roleid 
                                        left join  plan p on p.id = u.planId
                                        left join addresses ads on  ads.userid = u.id and ads.roleid = u.roleid
                                        left join country_codes cc on cc.id = ads.country_id  
                                        left join address_state  ast on ast.id =ads.state_id 
                                        left join address_district ad on ad.id = ads.district_id 
                                        where u.roleid = ${roleid}  ${query}
                                        ${orderQuery}  limit ${limit} offset ${offset}
                                        `, [])
    }
    async fetchcustomercount(roleid: any, limit: any, offset: any, orderQuery: any, query: any) {
        return await this._executeQuery(`select u.id,  u.firstname , u.lastname,  u.mobile, u.email, u.end as planexpiration, ad.name as city, ads.pincode  
                                        from users u 
                                        join roles r on r.RoleID = u.roleid 
                                        left join  plan p on p.id = u.planId
                                        left join addresses ads on  ads.userid = u.id and ads.roleid = u.roleid
                                        left join country_codes cc on cc.id = ads.country_id  
                                        left join address_state  ast on ast.id =ads.state_id 
                                        left join address_district ad on ad.id = ads.district_id 
                                        where u.roleid = ${roleid}  ${query}
                                        ${orderQuery}  
                                        `, [])
    }

    async addCustomer(data: any) {
        return await this._executeQuery(`insert into users set ? `, [data])
    }
    async getMappedAgents(customerid: any) {
        return await this._executeQuery(`select   concat(u.firstname," ", u.lastname) as label, am.agentId as value from agent_mapping  am
                                            left join users u on u.id = am.agentId and u.roleid = 4  and  u.status = 1
                                            where
                                            am.customer_id = ?
                                            and am.status = 1`, [customerid])
    }
    async addAddress(data: any) {
        return await this._executeQuery(`insert into addresses set ? `, [data])
    }

    async fetchCountAppointment(customerId: any) {
        return await this._executeQuery(`select count(AppointmentID) as appointment from agentappointments 
                                                where customerId = ?  and atype = 1 `, [customerId])
    }

    async updateCustomer(data: any, id: any) {
        return await this._executeQuery(`update users set ? where id = ? `, [data, id])
    }
    async updateAddress(data: any, id: any) {
        return await this._executeQuery(`update addresses set ? where userid = ? `, [data, id])
    }


    async fetchDisealist(query: any) {
        return await this._executeQuery(`select subtype as label , id as value  , type    from diseases
                                             ${query}`, [])
    }


    async fetchCountrycode(query: any) {
        return await this._executeQuery(`select countrycode as label , countrycode as value from country_codes
                                             ${query}`, [])
    }


    async addDiseaseMapping(data: any) {
        return await this._executeQuery(`insert into parent_disease_mapping_table(userid, disease_id, status) values ? `, [data])
    }

    async diseasemapingdisableByUser(data: any, userid: any) {
        return await this._executeQuery('update parent_disease_mapping_table set status = ? where userid = ?', [data, userid])
    }
    async diseasemapppingone(userid: any, disease_id: any) {
        return await this._executeQuery('select * from  parent_disease_mapping_table where userid = ? and disease_id = ?', [userid, disease_id])
    }
    async updateDiseaseMappingexistOne(data: any, userid: any, disease_id: any) {
        return await this._executeQuery('update parent_disease_mapping_table set status = ? where userid = ? and disease_id = ? ', [data, userid, disease_id])
    }
    async updateDiseaseMappingOne(data: any) {
        return await this._executeQuery('insert into  parent_disease_mapping_table set ?  ', [data])
    }

    async fetchsubscribtionList() {
        return await this._executeQuery(`select id as value , name as label from plan `, [])
    }
    async getCities(query: any) {
        return await this._executeQuery(`select name as label , id as value from address_district where state_id =1 
                                            ${query}
                                             `, [])
    }
     
    async getServices(query: any) {
        return await this._executeQuery(`select id , name , frequency, remote_services, cost from plan
                                            
                                             `, [])
    }

    async checkcityActiveServices(id: any) {
        return await this._executeQuery(`select active_services from address_district
                                            where id = ?
                                            
                                             `, [id])
    }

    


    async fetchactveServicesByCity() {
        return await this._executeQuery(`select id as value , name as label from plan `, [])
    }

    async fetchCustomerListById(customer_id: any) {
        console.log("query", `select u.firstname as firstName, u.id as customer_id, p.name as planName, p.cost as price,  u.lastname as lastName, u.email,u.status, u.duration,  DATE_FORMAT( u.dob, '%d-%m-%Y') as dob , u.roleid, u.customerNoteforAgent, ads.landmark, ifnull(ds.id,(CAST(CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('label',ds.subtype,'value', ds.id)), ']') AS JSON)) ,'[]')  as diseasemapping , u.mobile as mobleNumber, u.end, ads.address, JSON_OBJECT('label',g.name, 'value', g.id) as gender,  JSON_OBJECT('label',p.name, 'value', p.id) as plan, ads.pincode as pinCode, JSON_OBJECT('label',ast.name, 'value', ast.id ) as state, JSON_OBJECT('label',cn.name, 'value', cn.id ) as country   ,JSON_OBJECT('label',ad.name, 'value', ad.id )  as city    from users u
                                            left join addresses ads on ads.userid = u.id and ads.roleid = u.roleid
                                            left join country cn on cn.id = ads.country_id
                                            left join address_state ast on ast.id = ads.state_id
                                            left join address_district ad on ad.id = ads.district_id 
                                            left join plan p on p.id = u.planId and p.status =1
                                            left join parent_disease_mapping_table pdm on pdm.userid = u.id and pdm.status =1
                                            left join diseases ds on ds.id = pdm.disease_id and ds.status =1
                                            left join gender g on g.id = u.gender_id
                                            
                                            where u.id = ?`)
        return await this._executeQuery(`select u.firstname as firstName, u.id as customer_id, p.name as planName, p.cost as price,  u.lastname as lastName, u.email,u.status, u.duration,  DATE_FORMAT( u.dob, '%d-%m-%Y') as dob , u.roleid, u.customerNoteforAgent, ads.landmark, if(ds.id,(CAST(CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('label',ds.subtype,'value', ds.id)), ']') AS JSON)) ,JSON_ARRAY())  as diseasemapping , u.mobile as mobleNumber, u.end, ads.address, JSON_OBJECT('label',g.name, 'value', g.id) as gender,  JSON_OBJECT('label',p.name, 'value', p.id) as plan, ads.pincode as pinCode, JSON_OBJECT('label',ast.name, 'value', ast.id ) as state, JSON_OBJECT('label',cn.name, 'value', cn.id ) as country   ,JSON_OBJECT('label',ad.name, 'value', ad.id )  as city    from users u
                                            left join addresses ads on ads.userid = u.id and ads.roleid = u.roleid
                                            left join country cn on cn.id = ads.country_id
                                            left join address_state ast on ast.id = ads.state_id
                                            left join address_district ad on ad.id = ads.district_id 
                                            left join plan p on p.id = u.planId and p.status =1
                                            left join parent_disease_mapping_table pdm on pdm.userid = u.id and pdm.status =1
                                            left join diseases ds on ds.id = pdm.disease_id and ds.status =1
                                            left join gender g on g.id = u.gender_id
                                            
                                            where u.id = ?`, [customer_id])
    }





    async getHealthReport(fromdate: any, todate: any, query: any) {
        return await this._executeQuery(`select customerId , agentId, report_date, weight, blood_pressure, heart_rate,
                                            case when cogf_instances_of_confusion <= 3 then 'low' 
                                            when  cogf_instances_of_confusion >= 4 AND cogf_instances_of_confusion <= 7 then 'medium' 
                                            else 'high' end as cogf_instances_of_confusion,
                                            case when cogf_instances_of_confusion <= 3 then 'low' 
                                            when  cogf_instances_of_confusion >= 4 AND cogf_instances_of_confusion <= 7 then 'medium' 
                                            else 'high' end as cogf_instances_of_confusion, case when cogf_instances_of_confusion <= 3 then 'low' 
                                            when  cogf_instances_of_confusion >= 4 AND cogf_instances_of_confusion <= 7 then 'medium' 
                                            else 'high' end as cogf_instances_of_confusion, 
                                            case when cogf_getting_lost <= 3 then 'low' 
                                            when  cogf_getting_lost >= 4 AND cogf_getting_lost <= 7 then 'medium' 
                                            else 'high' end as cogf_getting_lost, 
                                            case when cogf_instances_of_body_shivering <= 3 then 'low' 
                                            when  cogf_instances_of_body_shivering >= 4 AND cogf_instances_of_body_shivering <= 7 then 'medium' 
                                            else 'high' end as cogf_instances_of_body_shivering,
                                            case when cogf_fall_instances <= 3 then 'low' 
                                            when  cogf_fall_instances >= 4 AND cogf_fall_instances <= 7 then 'medium' 
                                            else 'high' end as cogf_fall_instances,
                                            case when mood_behavior_depression <= 3 then 'low' 
                                            when  mood_behavior_depression >= 4 AND mood_behavior_depression <= 7 then 'medium' 
                                            else 'high' end as mood_behavior_depression,
                                            case when mood_behavior_anxiety <= 3 then 'low' 
                                            when  mood_behavior_anxiety >= 4 AND mood_behavior_anxiety <= 7 then 'medium' 
                                            else 'high' end as mood_behavior_anxiety,
                                            case when mood_behavior_aggression <= 3 then 'low' 
                                            when  mood_behavior_aggression >= 4 AND mood_behavior_aggression <= 7 then 'medium' 
                                            else 'high' end as mood_behavior_aggression,
                                            case when mood_behavior_Dellusions <= 3 then 'low' 
                                            when  mood_behavior_Dellusions >= 4 AND mood_behavior_Dellusions <= 7 then 'medium' 
                                            else 'high' end as mood_behavior_Dellusions,
                                            case when sleep_total_hours <= 3 then 'low' 
                                            when  sleep_total_hours >= 4 AND sleep_total_hours <= 7 then 'medium' 
                                            else 'high' end as sleep_total_hours,
                                            case when sleep_daytime_sleepiness <= 3 then 'low' 
                                            when  sleep_daytime_sleepiness >= 4 AND sleep_daytime_sleepiness <= 7 then 'medium' 
                                            else 'high' end as sleep_daytime_sleepiness,
                                            case when sleep_disturbance_instances <= 3 then 'low' 
                                            when  sleep_disturbance_instances >= 4 AND sleep_disturbance_instances <= 7 then 'medium' 
                                            else 'high' end as sleep_disturbance_instances,
                                            cogf_remarks,mood_behavior_remarks, sleep_remarks, meal_remarks
                                            

                                            from health_report hr
                                              ${query}
                                                                                                `, [])
    }


    async fetchActiveCustomerlist(query: any) {
        return await this._executeQuery(`select concat(firstname," ", lastname) as label, id as value  from users u
                                            left join health_report  hr on hr.customerId = u.id

                                            where u.status = 2
                                            ${query}
                                            group by u.id
                                            order by hr.customerId desc`, [])
    }


    async getReportDatesById(id: any) {
        return await this._executeQuery(`select  DATE_FORMAT( report_date, '%d-%m-%Y')  as label , report_date as value from health_report where customerId = ?`, [id])
    }

    async inserthealthReport(data: any) {
        return await this._executeQuery(`insert into health_report set ? `, [data])
    }
    async insertIntoMedicine(data: any) {
        return await this._executeQuery(`insert into medicines set ? `, [data])
    }

    async fetchHealthReportList(fromDate: any, toDate: any, query: any) {
        return await this._executeQuery(`select customerId, agentId,age, report_date, weight, blood_pressure, heart_rate,cogf_instances_of_confusion,
                                            cogf_getting_lost,cogf_instances_of_body_shivering,cogf_fall_instances, cogf_remarks, mood_behavior_depression,
                                            mood_behavior_anxiety, mood_behavior_aggression, mood_behavior_Dellusions,mood_behavior_remarks, 
                                            sleep_total_hours,sleep_daytime_sleepiness,sleep_disturbance_instances,sleep_remarks, meal_breakfast_taken,
                                            meal_lunch_taken, meal_dinner_taken, meal_remarks,physical_walks_taken, physical_yoga,physical_sports,
                                            physical_remarks from health_report 
                                            where created_at between ? and ?  ${query} `, [fromDate, toDate])
    }

    async fetchHealthReportList2(fromDate: any, toDate: any, query: any) {

        return await this._executeQuery(`select hr.customerId, concat(u.firstname," ", u.lastname) as customer, concat(agent.firstname," ", agent.lastname) as agent,  hr.health_remark, hr.agentId, cast(avg(hr.age)  as unsigned ) as age, cast( avg(hr.report_date) as unsigned ) as report_date , cast( avg(hr.weight) as unsigned) as weight, cast( avg(hr.blood_pressure) as unsigned) as blood_pressure , cast( avg(hr.heart_rate) as unsigned ) as heart_rate,  cast( avg(hr.cogf_instances_of_confusion) as unsigned ) as cogf_instances_of_confusion,
                                            cast(avg(hr.cogf_getting_lost) as unsigned) as cogf_getting_lost , cast( avg(hr.cogf_instances_of_body_shivering) as unsigned) as cogf_instances_of_body_shivering,  cast(avg(hr.cogf_fall_instances) as unsigned) as cogf_fall_instances , hr.cogf_remarks, cast(avg( hr.mood_behavior_depression) as unsigned) as mood_behavior_depression ,
                                            cast(avg(hr.mood_behavior_anxiety) as unsigned) as mood_behavior_anxiety , cast( avg(hr.mood_behavior_aggression) as unsigned) as mood_behavior_aggression , cast(avg(hr.mood_behavior_Dellusions) as unsigned) as mood_behavior_Dellusions , hr.mood_behavior_remarks, 
                                           cast( avg(hr.sleep_total_hours) as unsigned) as sleep_total_hours, cast( avg(hr.sleep_daytime_sleepiness) as unsigned) as sleep_daytime_sleepiness , cast(avg(hr.sleep_disturbance_instances) as unsigned) as sleep_disturbance_instances , hr.sleep_remarks, cast( avg(hr.meal_breakfast_taken) as unsigned) as meal_breakfast_taken ,
                                            cast(avg(hr.meal_lunch_taken) as unsigned) as meal_lunch_taken , cast(avg( hr.meal_dinner_taken) as unsigned) as meal_dinner_taken , hr.meal_remarks, cast(avg(hr.physical_walks_taken) as unsigned) as physical_walks_taken, cast(avg( hr.physical_yoga) as unsigned) as physical_yoga, cast(avg(hr.physical_sports) as unsigned) as physical_sports,
                                            hr.physical_remarks,  DATE_FORMAT(  hr.created_at, '%d-%m-%Y') as created_at from health_report hr
                                             join users u on u.id = hr.customerId and u.status = 1 
                                            left join users agent on agent.id = hr.agentId  and agent.status=1                                   
                                              ${query}`, [])
    }




    async fetchUserDetails(mobile: any, roleid: any) {
        return await this._executeQuery(`select id , concat(firstname," ", lastname) as name , roleid, dob, mobile from users 
                                              where mobile = ? and roleid = ? `, [mobile, roleid])
    }

    async createuser(data: any) {
        return await this._executeQuery(`insert into users set ? `, [data])
    }

    async insertOtpLogs(data: any) {
        return await this._executeQuery(`insert into user_login_logs set ? `, [data])
    }

    async getotpDetailsByreq_id(data: any) {
        return await this._executeQuery("select * from  user_login_logs where req_id = ?", [data])
    }

    async upateotptrials(trials: any, req_id: any) {
        return await this._executeQuery("update user_login_logs set ? where req_id = ?  ", [trials, req_id])

    }

    async fetchuserdetailsbyid(data: any) {
        return await this._executeQuery("select id , concat(firstname, ' ' ,lastname ) as userName , roleid, email,  mobile, planId, duration, start, end, isPayment  from users  where id = ? ", [data])
    }

    async getReportDetailsByDate(date: any, id: any) {
        return await this._executeQuery(`select hr.Booking_id, hr.report_id, hr.report_date, hr.checkIn,  hr.checkOut, hr.age, hr.weight, hr.blood_pressure, 
                                                hr.heart_rate, cogf_instances_of_confusion, hr.cogf_getting_lost, hr.cogf_instances_of_body_shivering,
                                                hr.cogf_fall_instances, hr.cogf_remarks, hr.mood_behavior_depression, hr.mood_behavior_anxiety,
                                                hr.mood_behavior_aggression, hr.mood_behavior_Dellusions, hr.mood_behavior_remarks, hr.sleep_total_hours,
                                                hr.sleep_daytime_sleepiness, hr.sleep_disturbance_instances, hr.sleep_remarks, hr.meal_breakfast_taken,
                                                hr.meal_lunch_taken, hr.meal_dinner_taken, hr.meal_remarks, hr.physical_walks_taken, hr.physical_yoga,
                                                hr.physical_sports, hr.physical_remarks, hr.health_remark from health_report hr
                                                left join agentappointments agap on agap.AppointmentID = hr.Booking_id
                                                where agap.customerId = ? and date(agap.AppointmentDateTime) = ?
                                                `, [id, date])
    }

    async fetchMedicinesByReportId(data: any) {
        return await this._executeQuery(`select id , name, quantity, morning, afternoon,evening, status from medicines
                                            where health_report_id = ?`, [data])
    }

















}

