
import { API_URL } from "@/config";

export const fetchApi = async ({endpoint = "" , data = {} , method = "POST" , headers = { 
    "Content-Type" : "application/json",
    "accept": "application/json"
}}) => {
    const url = API_URL + endpoint;
    const option = {
        method , headers, body: method !== "GET" ? JSON.stringify(data): undefined
    }
    
    try {

       const response = await fetch(url,option);
       
       if (!response.ok) {
        let errorMessage = "An error occurs. Please try Again!"
            try {
                const res = await response.json();
                errorMessage = res.message || errorMessage ;
            } catch (err) {
                    
                console.error(err)
            }
            return errorMessage;
        
       }
   
       return response.json();
        
    } catch (error) {
        console.log(error);
    }
}