import axios from "axios";

let Service = axios.create({
  baseURL: "http://192.168.5.24:8080",
  timeout: 1000,
});
let NLP = {
  sendInquiry(text) {
    return Service.post("classificator", text);
  },
};
export default NLP;
