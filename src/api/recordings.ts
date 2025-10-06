import axios from "axios";

const API_URL = "http://localhost:8080/api/recordings";

export const uploadRecording = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const fetchRecordings = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
