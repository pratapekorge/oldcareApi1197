import { celebrate } from 'celebrate'
import express  from 'express'
import AdminSchema from '../../Constants/Schema/Admin.schema'
import AdminController from '../../Controllers/Admin.controller'



const router = express()


router.post('/login', celebrate(AdminSchema.login), AdminController.login)
router.post('/forgetpassword', celebrate(AdminSchema.sendmailToAdmin),AdminController.sendEmailToLogin)

router.post('/create/add', celebrate(AdminSchema.addAdminuser), AdminController.addAdminUser)
router.post('/fetchadminList', AdminController.fetchadminlist)
router.get('/fetchadminById',AdminController.fetchadminById)

router.get('/fetchRoles',AdminController.fetchRoles)

router.put('/updateadmin',AdminController.updateAdmin )

router.post('/overallReport', AdminController.fetchOverallReport)




export default router