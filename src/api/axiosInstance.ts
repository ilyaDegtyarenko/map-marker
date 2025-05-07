import axios from 'axios'

/**
 * Creates an instance of the Axios client.
 */
export default axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
