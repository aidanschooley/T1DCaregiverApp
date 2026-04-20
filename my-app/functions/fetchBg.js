
async function fetchBg(){
const response = await fetch('https://t1dcaregiverapp.onrender.com/', {
  method: 'GET',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded' 
  },
});

if (!response.ok) {
  const err = await response.text();
  throw new Error(`Fetch failed: ${err}`);
}

const data = await response.json();
console.log('Blood Glucose Data:', data);
};

export default fetchBg