import app from "./config/express";
import LOGGER from "./config/LOGGER";

const port : any = process.env.port || 3000

app.listen(port, () => {  
    LOGGER.info(`Server running at ${port}`);
    });






