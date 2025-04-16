import axios from "axios";
import {PROD_URL, STG_URL} from "@/const.js";

const API_URL = PROD_URL+"/babysitters";

export const babysitterService = {

    getAllBabysitters: async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                message: "An error occurred while fetching babysitters",
            };
        }
    },

    getBabysitterById: async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                message: "An error occurred while fetching babysitter",
            };
        }
    },

    updateBabysitter: async (babysitterId, patchData) => {
        const token = localStorage.getItem("token");
        const response = await axios.patch(`${API_URL}/${babysitterId}`, patchData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    searchBabysitters: async (requestBody) => {
        console.log("searchBabysitters request body:", requestBody);
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/search`, requestBody, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
};
