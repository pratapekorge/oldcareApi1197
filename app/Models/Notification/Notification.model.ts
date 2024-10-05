import BaseModel from "../BaseModel";

export class NotificationModel extends BaseModel{

constructor (){

    super();

}

async fetchNotification(query: any){
    return await this._executeQuery(`select n.NotificationId, n.userid,n.title, n.description from notification  n
                                        left join users u on u.id = n.userid and u.status =1
                                        left join roles r on r.RoleID = u.roleid ${query}
                                        `,[])

}
async fetchNotificationByAdmin(query: any){
    return await this._executeQuery(`select n.NotificationId, n.userid, n.title,  n.description from notification  n
                                        left join admins  a on a.adminId = n.adminId  ${query}
                                        `,[])

}
async UnReadNotificationByAdminCount(query: any){
    return await this._executeQuery(`select n.NotificationId, n.userid, n.title,  n.description from notification  n
                                        left join admins  a on a.adminId = n.adminId  ${query}
                                        `,[])

}

async createNotification(data: any){
    return await this._executeQuery(`insert into notification set  ? `,[data])
}

async fetchNotificationwithDatewise(query: any, limit:any, offset: any){
    return await this._executeQuery(`SELECT 
            DATE(created_at) as notification_date,
            COUNT(*) as total_notifications,
           cast( concat('[' ,
            GROUP_CONCAT(
                JSON_OBJECT(
                    'NotificationId', NotificationId,
                    'title', title,
                    'description', description
                )
            ),']') as JSON) as notifications
        FROM 
            notification
             ${query}
        GROUP BY 
            DATE(created_at)
        ORDER BY 
            notification_date DESC limit ${limit} offset ${offset} `,[])
}

async fetchNotificationwithDatewiseCount(query: any, limit:any, offset: any){
    return await this._executeQuery(`SELECT 
            DATE(created_at) as notification_date,
            COUNT(*) as total_notifications,
           cast( concat('[' ,
            GROUP_CONCAT(
                JSON_OBJECT(
                    'NotificationId', NotificationId,
                    'title', title,
                    'description', description
                )
            ),']') as JSON) as notifications
        FROM 
            notification
             ${query}
        GROUP BY 
            DATE(created_at)
        ORDER BY 
            notification_date DESC  `,[])
}


}


