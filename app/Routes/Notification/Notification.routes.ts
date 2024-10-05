import { celebrate } from 'celebrate'
import express  from 'express'
import NotificationController from '../../Controllers/Notification.controller'

const router = express()


router.post(`/getNotificationById`, NotificationController.fetchNotificationById )
router.post("/createNotification",NotificationController.createNotification )
router.post('/fetchNotification',NotificationController.fetchNotification)







export default router 



