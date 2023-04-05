import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34824738-bcdb93f3fccf2566ad3e9b4d4';

export async function fetchImage(inputValue, perPage, page) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
    );
    return response;
  } catch (error) {
    return error;
  }
}