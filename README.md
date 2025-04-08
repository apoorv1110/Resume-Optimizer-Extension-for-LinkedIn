# 🔍 Smart Resume Optimizer for LinkedIn Jobs

This is a personal project I built to help streamline the job application process. It’s a Chrome Extension that allows me (or anyone) to upload a resume and instantly compare it with a job description on LinkedIn. The extension then provides suggestions to improve the resume based on what the job is looking for.

---

## 🚀 Features

- 📄 Upload your resume in PDF format from the popup
- 🌐 Automatically extracts the job description from a LinkedIn job post
- ⚙️ Sends both to my backend API for analysis
- 📌 Displays skill gaps, suggestions, and optimized resume content
- 💾 Option to download the optimized resume text

---

## 🧠 How It Works

1. I upload a resume through the extension popup.
2. I visit a job description page on LinkedIn.
3. Upon submitting, the extension grabs the job description.
4. It sends the resume and job description to my custom-built API.
5. The API returns:
   - Tailored suggestions
   - Missing skills
   - Enhanced resume content
6. All results are rendered inside the popup UI.

   
<img width="459" alt="Screenshot 2025-04-08 at 4 49 13 PM" src="https://github.com/user-attachments/assets/c54280b9-221c-474c-9f26-3bbe811e63b0" />


---

## 🌐 Backend API

The API for resume analysis is something I developed and host myself.

> 🔗 API Base URL: [https://my-repo-4dtz.onrender.com](https://my-repo-4dtz.onrender.com)

It handles:
- Resume and JD parsing
- Skill extraction and comparison
- Suggestion generation and optimization

This API is fully integrated with the extension to work in real-time.

---

## 🧰 Tech Stack

**Extension:**
- HTML + CSS + JS
- Chrome Extension APIs

**Backend API:**
- Python + Flask
- NLP tools for resume/job parsing and analysis
- Hosted on Render

---

## 🛠 Installation (For Myself or Local Testing)

To run it locally:

1. Clone the repository.
2. Go to `chrome://extensions/` in Chrome.
3. Enable **Developer Mode**.
4. Click **Load Unpacked** and select the folder.
5. Use it on any LinkedIn job post.

---

## 📁 File Structure

```bash
.
├── background.js         # Background script for message handling
├── contentScript.js      # Extracts job data from LinkedIn pages
├── popup.html            # Main UI of the extension
├── popup.js              # Controls the popup logic
├── popup.css             # Popup styling
├── manifest.json         # Chrome extension configuration
└── README.md             # This file
```
## Credits
The resume analysis API is built by me from scratch.
## Testing of api
Follow below repo link to get the source code of resume optimizer api
[Api repository](https://github.com/apoorv1110/Resume-Analyser-API)

