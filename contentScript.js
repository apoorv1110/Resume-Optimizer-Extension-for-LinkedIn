(() => {
  let jobDescription = "";
  let candidateData = null;

  const extractJobDescription = () => {
    if (window.location.href.includes("linkedin.com")) {
      const selectors = [
        ".jobs-description-content__text",
        ".jobs-box__html-content",
        ".jobs-description",
        ".job-view-layout",
        ".description__text"
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          const text = element.innerText
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, '\n')
            .trim();
          
          if (text.length > 0) {
            return text;
          }
        }
      }
    }
    return "";
  };

  const saveJobDescription = async () => {
    jobDescription = extractJobDescription();
    if (jobDescription && candidateData) {
      try {
        const formData = new FormData();
        formData.append('jobDescription', jobDescription);
        formData.append('resume', candidateData);

        const response = await fetch('https://my-repo-4dtz.onrender.com/smart-upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const analysisResults = await response.text();
        
        chrome.storage.sync.set({
          currentJobDescription: jobDescription,
          analysisResults: analysisResults
        });
      } catch (error) {
        console.error("Error processing job description:", error);
      }
    }
  };

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value } = obj;

    if (type === "NEW_JOB_PAGE") {
      saveJobDescription();
    } else if (type === "UPDATE_RESUME") {
      candidateData = value;
      saveJobDescription();
    }
  });

  // Watch for dynamic content changes
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        if (document.querySelector('.jobs-description-content__text')) {
          saveJobDescription();
          break;
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial load
  saveJobDescription();
})();