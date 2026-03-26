const fetchBg = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const getApiData = async () => {
    try {
      const response = await fetch('http://localhost:3000/dexcom/api/bg');
      // Fetch does not reject the Promise on HTTP error statuses (like 404), 
      // so you must check the response.ok property manually.
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      setData(json);
      console.log(data)
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
};
};

export default fetchBg;