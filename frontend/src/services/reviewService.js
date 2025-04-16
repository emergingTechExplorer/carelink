import axios from "axios";
import {PROD_URL, STG_URL} from "@/const.js";

const REVIEW_API_URL = PROD_URL+"/reviews";

export const reviewService = {
    addReview: async (reviewData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${REVIEW_API_URL}`,
                reviewData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                message: "An error occurred while adding the review",
            };
        }
    },
    getReviewsByBabysitterId: async (babysitterId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${REVIEW_API_URL}/babysitter/${babysitterId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                message: "An error occurred while fetching reviews",
            };
        }
    },
};
