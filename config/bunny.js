const axios = require('axios');

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;

/**
 * Uploads a file buffer to Bunny.net
 * @param {Buffer} fileBuffer - The file data (from multer)
 * @param {string} fileName - Name of the file to store
 * @param {string} subPath - Optional folder (e.g., 'videos/', 'thumbnails/')
 */
const uploadToBunny = async (fileBuffer, fileName, subPath = '') => {
  const url = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${subPath}${fileName}`;

  try {
    await axios.put(url, fileBuffer, {
      headers: {
        AccessKey: BUNNY_API_KEY,
        'Content-Type': 'application/octet-stream',
      },
    });

    return {
      success: true,
      url: `https://${process.env.BUNNY_CDN_DOMAIN}/${subPath}${fileName}`,
    };
  } catch (err) {
    console.error('Bunny upload failed:', err.response?.data || err.message);
    return { success: false, error: err };
  }
};

module.exports = { uploadToBunny };
