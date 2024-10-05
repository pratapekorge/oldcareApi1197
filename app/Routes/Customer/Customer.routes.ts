import { celebrate } from 'celebrate'
import express  from 'express'
import CustomerController from '../../Controllers/Customer.controller'
import CustomerSchema from '../../Constants/Schema/Customer.Schema'
import { upload } from '../../Utilities/Multer'

const router = express()


router.post("/fetchcustomerlist",CustomerController.fetchCustomerlist )

router.post('/addcustomer',CustomerController.addCustomer)

router.get("/fetchdiseaselist",CustomerController.fetchDisealist)
router.post("/fetch/countrycode",CustomerController.fetchCountryCode)

router.get(`/fetch/subscriptionlist`,CustomerController.fetchSubscriptionList )
router.post('/getCities', CustomerController.getCities)
router.post('/getactiveServiceBycity',CustomerController.fetchActiveServicesByCity )
router.post('/getServices',CustomerController.getServices )

router.put('/updatecustomer',
    upload.fields([
        { name: 'profile_image', maxCount: 1 },
      ]),
    CustomerController.updateCustomerList )  
router.get('/fetch/customerById',celebrate(CustomerSchema.fetchCustomerById),  CustomerController.fetchCustomerByid )
router.post('/create/HealthReport', CustomerController.createHealthReport)
router.post('/gethealthReport',CustomerController.getHealthReport)

router.get("/fetchActiveCustomerList", CustomerController.fetchActiveCustomerList)
router.post('/fetch/helthReportList',   celebrate(CustomerSchema.fetchHealthReportList) ,CustomerController.fetchHealthReportList)

router.post("/sendotp", CustomerController.sendOtp)
router.post('/verifyotp',CustomerController.verifyOtp)   

router.post('/getReportDatesBycustomerId',CustomerController.getReportDatesById )
router.post('/getHealthReportByDate',CustomerController.getHealthReportByDate ) 






export default router

