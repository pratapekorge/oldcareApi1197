import { Router } from "express";
import adminRoutes from "../Routes/Admin/Admin.routes"
import customerRoutes from "../Routes/Customer/Customer.routes"
import addressRoutes from "../Routes/Address/Address.routes"
import agentRoutes from "../Routes/Agent/Agent.routes"
import rbacRoutes from "../Routes/Rbac/Rbac.routes"
import notificationRoutes from "../Routes/Notification/Notification.routes"

import app from "../config/express";

const router = Router()


router.use("/admin", adminRoutes)
router.use("/customer", customerRoutes)
router.use('/address', addressRoutes);
router.use('/agent', agentRoutes);
router.use('/rbac', rbacRoutes);
router.use('/notification', notificationRoutes);








export default router


