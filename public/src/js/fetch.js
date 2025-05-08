/**
 * Fetches JSON data from APIs
 * */
const fetchData = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json();
        return {error: errorData.message || 'An error occurred'};
      }
      return await response.json(); 
    } catch (error) {
      console.error('fetchData() error:', error.message);
      return {error: error.message};
    }
  };
  
  export {fetchData};