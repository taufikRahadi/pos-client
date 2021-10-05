import axios from 'axios'
import router from '../router'
import { toast } from './swal'

const httpService = axios.create({
  baseURL: 'http://localhost:8080/api'
})

httpService.interceptors.response.use((response) => response, (error) => {
  const { response: { status } } = error
  switch (status) {
    case status === 403:
      toast('You have no access to this facility', 'error')
    case status === 401:
      toast('Please login to use this app', 'error')
    case status === 500:
      toast('Internal server error', 'error')
    default: 
      undefined
  }
})

export default httpService
