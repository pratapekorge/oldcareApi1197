const axios = require('axios');

// Define your MSG91 API key, sender ID, and template ID
const apiKey = '380041AQOSnn3O62dfb051P1';
const senderId = 'SENJOY';
const templateId = '66263d4dd6fc050abd06eba5';

// Function to send message using MSG91 API
export async function sendOTPTemplateMessage(mobileNumber: any, parameters: any) {
    console.log("mobileNumber", mobileNumber)
    try {
        const response = await axios.post('https://api.msg91.com/api/v5/flow/', {
            flow_id: templateId,
            mobiles: mobileNumber,
            params: parameters,
            sender: senderId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'authkey': apiKey
            }
        });
   console.log("response", response)
        console.log('Message sent successfully:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error sending message:', error.response.data);
        throw error;
    }
}

