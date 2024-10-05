
import LOGGER from "../../config/LOGGER";

import Router   from "express";
import addressController from "../../Controllers/Address.controller";


const router = Router();

router.get(
    '/states/all',
    addressController.getAllStates
  );

  router.post(
    '/districts-by-state',
    // celebrate( addressSchema.citiesByState ),
    addressController.getDistrictsByState
  );





  export default router









 
