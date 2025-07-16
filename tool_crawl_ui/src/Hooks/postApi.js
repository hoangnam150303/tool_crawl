import { axiosClient } from "../Config/Api";

const POST_API_ENDPOINT = "/api/v1/post";
const postApi = {
  postCrawl: (value) => {
    return axiosClient.post(`${POST_API_ENDPOINT}/crawl`, value);
  },
  getPost: (id) => {
    return axiosClient.get(`${POST_API_ENDPOINT}/getPost/${id}`);
  },
};

export default postApi;
