require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { GoogleGenAI, Type, Schema } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Google Gen AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Set up Multer for file uploads (in memory)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.use(cors());
app.use(express.json());

// Serve static files from the legacy 'website' directory under /legacy
app.use('/legacy', express.static(path.join(__dirname, 'website')));

// Serve the new React frontend
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// API Endpoint for Document Extraction
app.post('/api/extract', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document uploaded' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API Key is not configured on the server.' });
    }

    const fileMimeType = req.file.mimetype;
    
    // Fallback to gemini-2.5-flash which is widely available and fast
    const model = 'gemini-2.5-flash';

    // Convert multer buffer to base64 for Gemini
    const filePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: fileMimeType
      }
    };

    const prompt = `You are an expert AI extraction system for Indian Farmer Enrollment documents.
Extract all available information from this document into the required JSON structure.
DO NOT hallucinate or guess any information. If a field is not present, use null or "Not found".
Pay special attention to the Land Records table. There may be multiple rows across multiple pages.

The JSON structure must exactly match:
{
  "farmer": {
    "farmerId": "Farmer ID or Enrollment Number",
    "nameEng": "Farmer name in English",
    "nameLocal": "Farmer name in Hindi/local language",
    "gender": "Gender",
    "casteCategory": "Caste category",
    "dob": "Date of birth (DD/MM/YYYY)",
    "age": "Age",
    "aadhaar": "Aadhaar number (keep masked if masked)",
    "identifierNameEng": "Father/Husband name in English",
    "identifierNameLocal": "Father/Husband name in local language"
  },
  "contact": {
    "mobile": "Mobile number",
    "email": "Email address"
  },
  "address": {
    "full": "Full residential address",
    "state": "State",
    "district": "District",
    "subDist": "Sub-district / Tehsil",
    "village": "Village"
  },
  "additional": {
    "farmerType": "Farmer type",
    "occupation": "Occupation"
  },
  "landRecords": [
    {
      "id": "Generate a unique ID like 'land-1'",
      "state": "State for this land record",
      "subDist": "Sub District for this land record",
      "village": "Village for this land record",
      "sNo": "Survey/Serial Number",
      "ss": "Share or SS value",
      "area": "Area (in Hectares)"
    }
  ],
  "needsReview": true
}`;

    const response = await ai.models.generateContent({
        model: model,
        contents: [prompt, filePart],
        config: {
            responseMimeType: "application/json"
        }
    });

    const textResponse = response.text;
    const extractedData = JSON.parse(textResponse);

    res.json(extractedData);

  } catch (error) {
    console.error('Extraction Error:', error);
    res.status(500).json({ error: 'Failed to extract information from document.', details: error.message });
  }
});

// Fallback for SPA routing
app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Farmer ID Pro Tool (Redesign) is running!`);
  console.log(`📡 Local URL: http://localhost:${PORT}`);
  console.log(`📡 API Endpoint: http://localhost:${PORT}/api/extract\n`);
});
