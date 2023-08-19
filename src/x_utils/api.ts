import axios from "axios";
import { BlobServiceClient } from "@azure/storage-blob";

const BASE_URL = "https://advise-me-backend-production.up.railway.app/api/v1";

class API {
    async registerUser(user: any){
        return await axios.post(`${BASE_URL}/auth/register`, user)
    }

    async updateUser(user: any){
      return await axios.put(`${BASE_URL}/users`, user, {headers: {"token": localStorage.getItem("token")}})
    }

    async logInUser(email: string, password: string){
      console.log(`${BASE_URL}/auth/login`)
        return await axios.post(`${BASE_URL}/auth/login`, { email: email, password: password });
    }

    async removeProfilePicture(){
      return await axios.post(`${BASE_URL}/users/removeProfilePicture`, {}, {headers: {"token": localStorage.getItem("token")}});
  }

    async getAllUserInfo(id: string){
      return await axios.get(`${BASE_URL}/users/${id}`, {headers: {"token": localStorage.getItem("token")}});
    }

    async getPosts(){
      return await axios.get(`${BASE_URL}/posts`, {headers: {"token": localStorage.getItem("token")}});
    }

    async createPost(postInfo: any){
      return await axios.post(`${BASE_URL}/posts`, postInfo, {headers: {"token": localStorage.getItem("token")}});
    }

    async uploadImage(file: File) {
        try {
            let storageAccount = "sabin2001";
            let sasToken = "?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-05-16T04:24:36Z&st=2023-08-18T20:24:36Z&spr=https,http&sig=8%2FNrhvnEgmr50bKiFeia7XQL74JMey4uHlHg0m5salU%3D";
        
            const blobService = new BlobServiceClient(
              `https://${storageAccount}.blob.core.windows.net/${sasToken}`
            );
        
            const containerClient = blobService.getContainerClient("profilepics");
            const blobClient = containerClient.getBlobClient(file?.name);
            const blockBlobClient = blobClient.getBlockBlobClient();
            const result = await blockBlobClient.uploadBrowserData(file , {
              blockSize: 4 * 1024 * 1024,
              concurrency: 20,
            });

            return result._response.status === 201;
        } catch(ex){
            console.log(ex);
            return false;
        }
        
    }
}

const API_CALL = new API();

export default API_CALL;