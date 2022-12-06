import axios from "axios";

let Service = axios.create({
  baseURL: "http://localhost:8081",
  timeout: 30000,
});
let NLP = {
  sendInquiry(text) {
    return Service.post("classificator", text);
  },
  getAnswer(text) {
    return Service.post("answer", text);
  },
};
export default NLP;
