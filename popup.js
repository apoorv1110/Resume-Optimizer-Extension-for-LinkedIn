document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const resumeFileInput = document.getElementById("resumeFile");
  const currentResumeName = document.getElementById("currentResumeName");

  const matchScore = document.getElementById("matchScore");
  const strengths = document.getElementById("strengths");
  const improvements = document.getElementById("improvements");

  // Load saved profile and analysis results
  chrome.storage.local.get(["resumeFileName", "analysisResults"], (data) => {
    if (data.resumeFileName) {
      currentResumeName.textContent = `Current Resume: ${data.resumeFileName}`;
    }
    if (data.analysisResults) {
      displayAnalysisResults(data.analysisResults);
    }
  });

  // Listen for analysis result updates
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.analysisResults) {
      displayAnalysisResults(changes.analysisResults.newValue);
    }
  });

  function parseAnalysisResults(text) {
    try {
      const results = {
        matchScore: "",
        strengths: [],
        improvements: []
      };

      // Extract match score
      const matchScoreMatch = text.match(/\*\*Match Score: (\d+)\/100\*\*/);
      if (matchScoreMatch) {
        results.matchScore = matchScoreMatch[1];
      }

      // Extract strengths
      const strengthsSection = text.match(/\*\*3 Strengths:\*\*\n\n([\s\S]*?)\n\n\*\*3 Improvements:/);
      if (strengthsSection) {
        const strengthsList = strengthsSection[1].split('\n');
        results.strengths = strengthsList
          .filter(item => item.trim().match(/^\d\./))
          .map(item => item.replace(/^\d\.\s*\*\*(.*?)\*\*:/, '$1').trim());
      }

      // Extract improvements
      const improvementsSection = text.match(/\*\*3 Improvements:\*\*\n\n([\s\S]*?)$/);
      if (improvementsSection) {
        const improvementsList = improvementsSection[1].split('\n');
        results.improvements = improvementsList
          .filter(item => item.trim().match(/^\d\./))
          .map(item => item.replace(/^\d\.\s*\*\*(.*?)\*\*:/, '$1').trim());
      }

      return results;
    } catch (error) {
      console.error("Error parsing analysis results:", error);
      return null;
    }
  }

  function displayAnalysisResults(text) {
    const results = parseAnalysisResults(text);
    if (!results) return;

    matchScore.textContent = `Match Score: ${results.matchScore}/100`;

    strengths.innerHTML = results.strengths
      .map(strength => `<div class="strengths-item">• ${strength}</div>`)
      .join('');

    improvements.innerHTML = results.improvements
      .map(improvement => `<div class="improvements-item">• ${improvement}</div>`)
      .join('');
  }

  // Handle file selection
  resumeFileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      currentResumeName.textContent = `Current Resume: ${file.name}`;

      const reader = new FileReader();
      reader.onload = function () {
        const fileContent = reader.result; // base64 string
        chrome.storage.local.set({
          resumeFileName: file.name,
          resumeFileContent: fileContent
        });
      };
      reader.readAsDataURL(file);
    } else {
      currentResumeName.textContent = `Invalid file. Please upload a PDF.`;
    }
  });

  // Handle upload submit
  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    chrome.storage.local.get(["resumeFileName", "resumeFileContent"], async (data) => {
      if (!data.resumeFileName || !data.resumeFileContent) {
        alert("Please upload a resume PDF first.");
        return;
      }

      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const activeTab = tabs[0];

        if (activeTab) {
          chrome.tabs.sendMessage(activeTab.id, {
            type: "UPDATE_RESUME",
            fileName: data.resumeFileName,
            fileContent: data.resumeFileContent
          });
        }
      } catch (error) {
        console.error("Error sending message to tab:", error);
        alert("Error analyzing resume. Please try again.");
      }
    });
  });
});
