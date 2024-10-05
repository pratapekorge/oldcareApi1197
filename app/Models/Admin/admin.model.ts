import BaseModel from "../BaseModel";


export class AdminModel extends BaseModel {

   constructor() {
      super();
   }


   async getuserByEmail(data: any) {
      return await this._executeQuery('select adminId , name, mobile, email, roleid, password from admins where email = ? ', [data])
   }
   async fetchAgentDetailsByEmail(email: any) {
      return await this._executeQuery(`select id , concat(firstname," ", lastname) as name , roleid, dob, mobile,password from users 
                                            where email = ? and roleid = 4`, [email]) 
  }

   async fetchadminpermission() {
      return await this._executeQuery(``, [])

   }
   async getPagesByRoleid(data: any) {

      return await this._executeQuery(`select rbpp.parentId , rbpp.display_name, rbpp.page_url as path
                                    from  rbac_permission_pages rbpp
                                    join rbac_role_permission rbrp on rbrp.pageid= rbpp.id 
                                    join roles r on r.RoleID = rbrp.roleid

                                    where r.RoleID = ?`, [data])
   }

   async updatePassword(data: any, email: any) {
      return await this._executeQuery('update admins set password = ?  where email = ?', [data, email])
   }
   async updatePasswordOfAgent(data: any, email: any) {
      return await this._executeQuery('update users set password = ?  where email = ?', [data, email])
   }

   async addAdminUser(data: any) {
      console.log("data222", data)
      return await this._executeQuery("insert into admins set ?", [data])
   }

   async fetchAdminList(roleid: any, limit: any, offset: any, orderQuery: any, query: any) {
      return await this._executeQuery(`select  adminId, name, roleid, email, mobile,password, status 
                                       from admins where roleid = ${roleid} ${query} ${orderQuery} limit ${limit} offset ${offset} `, [])
   }

   async fetchAdminListCount(roleid: any, limit: any, offset: any, orderQuery: any, query: any) {
      return await this._executeQuery(`select  adminId, name, roleid, email, mobile,password, status 
                                       from admins where roleid = ${roleid} ${query} ${orderQuery}`, [])
   }


   async fetchAdminById(id: any) {
      return await this._executeQuery(`select  a.adminId, a.name, json_object('label', r.RoleName, 'value', r.RoleID) as role, a.email, a.mobile,a.password, a.status 
                                       from admins a
                                       left join roles r on r.RoleID = a.roleid
                                         where a.adminId = ?`, [id])
   }


   async fetchRoles(query: any) {
      return await this._executeQuery(`select RoleName as label, RoleID as value from roles ${query}  `, [])
   }



   async updateadmin(data: any, id: any) {
      return await this._executeQuery(`update admins set ?  where adminId = ?  `, [data, id])
   }


   async fetchregisteredCustomer(query: any) {
      return await this._executeQuery(`select count(id) as registered_customer  from users 
                                          where roleid = 3
                                          and planid  is not null
                                          and status=2
                                          ${query}
                                          
                                          `, [query])
   }


   async fetchTotalCustomer(query: any) {
      return await this._executeQuery(`select count(id) as total_customer  from users 
                                       where roleid = 3
                                       and status <> 0
                                        ${query} `, [])
   }

   async fetchRegisteredAgent(query: any) {
      return await this._executeQuery(`select count(id) as registered_agent  from users 
                                       where roleid = 4
                                       and status = 2
                                       ${query} `, [])
   }


   async fetchTotalAgent(query: any) {
      return await this._executeQuery(` select count(id) as total_agent  from users 
                                          where roleid = 4
                                          and status <> 0
                                          ${query}  `, [])
   }

   async fetchsalesforYear(){
      return await this._executeQuery(`WITH all_months AS (
                              SELECT 'Jan' AS month, 1 AS month_num UNION
                              SELECT 'Feb', 2 UNION
                              SELECT 'Mar', 3 UNION
                              SELECT 'Apr', 4 UNION
                              SELECT 'May', 5 UNION
                              SELECT 'Jun', 6 UNION
                              SELECT 'Jul', 7 UNION
                              SELECT 'Aug', 8 UNION
                              SELECT 'Sep', 9 UNION
                              SELECT 'Oct', 10 UNION
                              SELECT 'Nov', 11 UNION
                              SELECT 'Dec', 12
                           )
                           SELECT 
                              DATE_FORMAT(NOW(), '%Y') AS year,
                              am.month,
                              IFNULL(SUM(sub.cost), 0) AS total_sales
                           FROM all_months am
                           LEFT JOIN (
                              SELECT 
                                 DATE_FORMAT(u.created_at, '%b') AS month,
                                 p.cost
                              FROM users u
                              JOIN plan p ON u.planid = p.id
                              WHERE u.roleid = 3
                                 AND DATE_FORMAT(u.created_at, '%Y') = DATE_FORMAT(NOW(), '%Y')
                           ) sub ON am.month = sub.month
                           GROUP BY year, am.month, am.month_num
                           ORDER BY am.month_num;`,[])
   }

   async fetchsalesforMonth(){
      return await this._executeQuery(`WITH date_ranges AS (
                                             SELECT '01-07' AS date_range, 1 AS range_num UNION
                                             SELECT '08-14', 2 UNION
                                             SELECT '15-21', 3 UNION
                                             SELECT '22-31', 4
                                          )
                                          SELECT 
                                             DATE_FORMAT(NOW(), '%Y-%m') AS month,
                                             dr.date_range,
                                             IFNULL(SUM(sub.cost), 0) AS total_sales
                                          FROM date_ranges dr
                                          LEFT JOIN (
                                             SELECT 
                                                DATE_FORMAT(u.created_at, '%Y-%m') AS month,
                                                CASE   
                                                      WHEN DAY(u.created_at) <= 7 THEN '01-07'
                                                      WHEN DAY(u.created_at) <= 14 THEN '08-14'
                                                      WHEN DAY(u.created_at) <= 21 THEN '15-21'
                                                      ELSE '22-31'
                                                END AS date_range,
                                                p.cost
                                             FROM users u
                                             JOIN plan p ON u.planid = p.id
                                             WHERE u.roleid = 3
                                                AND DATE_FORMAT(u.created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
                                          ) sub ON dr.date_range = sub.date_range
                                          GROUP BY month, dr.date_range, dr.range_num
                                          ORDER BY month, dr.range_num;
                                          `,[])
   }

   async  fetchDiseaseoverview(query: any){
      return await this._executeQuery(`SELECT COUNT(pdmt.id) as totalcount , pdmt.disease_id , d.subtype
                                       FROM parent_disease_mapping_table pdmt
                                       left join diseases d on d.id = pdmt.disease_id
                                       ${query}
                                       GROUP BY pdmt.disease_id
                                       HAVING COUNT(pdmt.id) > 5;`,[])
   }

   async fetchAdditionalSalesforYear(){
      return await this._executeQuery(`
                                             WITH all_months AS (
                                                                           SELECT 'Jan' AS month, 1 AS month_num UNION
                                                                           SELECT 'Feb', 2 UNION
                                                                           SELECT 'Mar', 3 UNION
                                                                           SELECT 'Apr', 4 UNION
                                                                           SELECT 'May', 5 UNION
                                                                           SELECT 'Jun', 6 UNION
                                                                           SELECT 'Jul', 7 UNION
                                                                           SELECT 'Aug', 8 UNION
                                                                           SELECT 'Sep', 9 UNION
                                                                           SELECT 'Oct', 10 UNION
                                                                           SELECT 'Nov', 11 UNION
                                                                           SELECT 'Dec', 12
                                                                        )
                                             select date_format(now(), '%y') as year, cast(ifnull(sum(sub.costpervisit),0) as unsigned) as sales, am.month from all_months am 
                                             left join (select   p.cost, p.frequency, (p.cost/p.frequency) as costpervisit , DATE_FORMAT(agap.AppointmentDateTime, '%b') AS month  from agentappointments agap
                                             left join users u on u.id = agap.customerId  and u.status = 1
                                             left join plan p on p.id = u.planId 

                                             where agap.atype =2                                                 
                                                
                                                )sub on am.month = sub.month
                                                GROUP BY year, am.month, am.month_num
                                                ORDER BY am.month_num`,[])
   }

   async fetchAddSalesofMonth(){
      return await this._executeQuery(`WITH date_ranges AS (
                                             SELECT '01-07' AS date_range, 1 AS range_num UNION
                                             SELECT '08-14', 2 UNION
                                             SELECT '15-21', 3 UNION
                                             SELECT '22-31', 4
                                          )
                                          SELECT 
                                             DATE_FORMAT(NOW(), '%Y-%m') AS month,
                                             dr.date_range,
                                             cast(IFNULL(SUM(sub.costpervisit), 0) as unsigned) AS total_sales
                                          FROM date_ranges dr
                                          LEFT JOIN (
                                             SELECT 
                                                DATE_FORMAT(u.created_at, '%Y-%m') AS month,
                                                CASE   
                                                      WHEN DAY(agap.AppointmentDateTime) <= 7 THEN '01-07'
                                                      WHEN DAY(agap.AppointmentDateTime) <= 14 THEN '08-14'
                                                      WHEN DAY(agap.AppointmentDateTime) <= 21 THEN '15-21'
                                                      ELSE '22-31'
                                                END AS date_range,
                                                p.cost/p.frequency as costpervisit
                                             FROM agentappointments agap
                                             left join users u on u.id = agap.customerId and u.status =1 
                                             left join plan p ON u.planid = p.id
                                             WHERE u.roleid = 3
                                                AND DATE_FORMAT(u.created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
                                          ) sub ON dr.date_range = sub.date_range
                                          GROUP BY month, dr.date_range, dr.range_num
                                          ORDER BY month, dr.range_num`,[])
   }


   async latestcustomer(){
      return await this._executeQuery(`select concat(u.firstname, u.lastname) as name , u.profile_image, u.planId  from users u
                                          where roleid = 3 and planId is not null and planId <> 0 and status = 1   order by id desc limit 10;
                                          `,[])
   }

   async latestAgent(){
      return await this._executeQuery(`select concat(u.firstname, u.lastname) as name , u.profile_image, u.planId  from users u
                                       where roleid = 4 and  status =1    order by id desc limit 10

                                       `,[])
   }

   async latestVisit(){
      return await this._executeQuery(`select agap.AppointmentID, agap.customerId , concat(c.firstname, " ", c.lastname) as customer, agap.AgentID, concat(a.firstname, " ",a.lastname) as agent, agap.atype , agap.AppointmentDateTime, agap.timeslot from agentappointments agap
                                          left join users c  on c.id = agap.customerId  and c.status =1  and c.roleid = 3
                                          left join users a on  a.id = agap.agentId and a.status=1 and a.roleid = 4 
                                          where agap.status = 4
                                          order by agap.AppointmentID desc limit 10

                                                                                 `,[])
   }

   



}





