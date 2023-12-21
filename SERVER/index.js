const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const fetchData = async (bookName) => {
    const options = {
      method: 'GET',
      url: 'https://filepursuit.p.rapidapi.com/',
      params: {
        q: bookName,
        filetype: 'pdf',
        type: 'ebook',
      },
      headers: {
        'X-RapidAPI-Key': 'e264a8d39emsh0ea526355d28261p1ed55ejsn4fc99395337f',
        'X-RapidAPI-Host': 'filepursuit.p.rapidapi.com',
      },
    };
  
    try {
      const response = await axios.request(options);
  
      // Log the entire response data
      console.log('Entire API Response:', response.data);
  
      if (!response.data || !Array.isArray(response.data.files_found)) {
        console.error('Unexpected API response format:', response.data);
        return [];
      }
  
      const bookData = response.data.files_found.map((item) => ({
        file_link: item.file_link,
        file_size: item.file_size || 'N/A', // Use 'N/A' if file_size is not available
      }));
  
      return bookData;
    } catch (error) {
      console.error(error);
      return [];
    }
};
  

app.post('/', async (req, res) => {
    const { bookName } = req.body;
    const bookData = await fetchData(bookName);
    res.json({ bookData });
  });

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
