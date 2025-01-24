const axios = require('axios');

async function testRiffusionAPI() {
  const prompt = `Create a calming ambient soundscape inspired by a peaceful urban park. 
    Incorporate soft urban background sounds, gentle wind, distant conversations, 
    with a meditative musical tone that evokes tranquility and inner reflection.`;

  try {
    const response = await axios.post('https://api.replicate.com/v1/predictions', {
      version: 'riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05',
      input: { 
        prompt_a: prompt,
        prompt_b: prompt,
        denoising: 0.75,
        seed: Math.floor(Math.random() * 1000000)
      }
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_REPLICATE_API_KEY',
        'Content-Type': 'application/json'
      }
    });

    console.log('Music Generation Response:', response.data);
    console.log('Audio URL:', response.data.output.audio);
  } catch (error) {
    console.error('Error generating music:', error.response ? error.response.data : error.message);
  }
}

testRiffusionAPI();