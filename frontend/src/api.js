import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getStudents = async (slot = '') => {
    const url = slot ? `${API_URL}/students?slot=${encodeURIComponent(slot)}` : `${API_URL}/students`;
    const response = await axios.get(url);
    return response.data;
};

export const addStudent = async (data) => {
    const response = await axios.post(`${API_URL}/students`, data);
    return response.data;
};

export const markAttendance = async (studentId, date, status) => {
    const response = await axios.post(`${API_URL}/attendance`, { studentId, date, status });
    return response.data;
};

export const exportToExcel = (slot = '') => {
    const url = slot ? `${API_URL}/export?slot=${encodeURIComponent(slot)}` : `${API_URL}/export`;
    window.open(url, '_blank');
};
