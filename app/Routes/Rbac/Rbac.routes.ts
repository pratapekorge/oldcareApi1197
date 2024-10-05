import { celebrate } from 'celebrate'
import express  from 'express'
import RbacController from '../../Controllers/Rbac.controller'


const router = express()

router.post('/fetchroles',RbacController.getRoles )
router.get('/fetchPages',RbacController.fetchPages )
router.post("/addRoles",RbacController.addRoles )






export default router


