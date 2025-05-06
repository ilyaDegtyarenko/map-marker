import axios from 'axios'

export default axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
