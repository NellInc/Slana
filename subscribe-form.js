// Subscribe form handler for Slana website
// This connects to Google Sheets via Google Apps Script Web App

document.addEventListener('DOMContentLoaded', function() {
  // Find the newsletter form
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  // Google Apps Script Web App URL - YOU NEED TO REPLACE THIS
  // Instructions: 
  // 1. Open your Google Sheet
  // 2. Go to Extensions > Apps Script
  // 3. Replace the code with the Google Apps Script code below
  // 4. Deploy as Web App and copy the URL here
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyjOi3mnvynWtnd3J9klcAdFPoVwviSUFchFdyId7K5DbdIxt1KUWzL9M1Zc2v0ospfWQ/exec';

  // Override form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = form.querySelector('.form-submission-text');
    const formFields = form.querySelector('.newsletter-form-body');
    const email = emailInput.value;

    // Clear any previous messages
    hideMessage();

    if (!email) {
      showErrorMessage('Please enter your email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorMessage('Please enter a valid email address');
      return;
    }

    // Disable button during submission
    const originalText = submitButton.querySelector('.newsletter-form-button-label').textContent;
    submitButton.querySelector('.newsletter-form-button-label').textContent = 'Submitting...';
    submitButton.disabled = true;

    try {
      // Send to Google Sheets
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          timestamp: new Date().toISOString()
        })
      });

      // Show success message inline
      showSuccessMessage('Thank you for subscribing to Slana updates!');
      
      // Clear form
      emailInput.value = '';
      
    } catch (error) {
      console.error('Subscription error:', error);
      showErrorMessage('Sorry, there was an error. Please try again later.');
    } finally {
      // Re-enable button
      submitButton.querySelector('.newsletter-form-button-label').textContent = originalText;
      submitButton.disabled = false;
    }
  });

  // Helper functions for showing messages
  function showSuccessMessage(message) {
    const messageDiv = form.querySelector('.form-submission-text');
    const formBody = form.querySelector('.newsletter-form-body');
    
    messageDiv.textContent = message;
    messageDiv.className = 'form-submission-text success-message';
    messageDiv.style.display = 'block';
    formBody.style.display = 'none';
    
    // Hide message after 5 seconds and show form again
    setTimeout(() => {
      hideMessage();
    }, 5000);
  }

  function showErrorMessage(message) {
    const messageDiv = form.querySelector('.form-submission-text');
    
    messageDiv.textContent = message;
    messageDiv.className = 'form-submission-text error-message';
    messageDiv.style.display = 'block';
    
    // Hide error message after 3 seconds
    setTimeout(() => {
      hideMessage();
    }, 3000);
  }

  function hideMessage() {
    const messageDiv = form.querySelector('.form-submission-text');
    const formBody = form.querySelector('.newsletter-form-body');
    
    messageDiv.style.display = 'none';
    formBody.style.display = 'block';
    messageDiv.className = 'form-submission-text';
  }

  // Add CSS for message styling
  const style = document.createElement('style');
  style.textContent = `
    .form-submission-text.success-message {
      background-color: #4CAF50;
      color: white;
      padding: 15px;
      border-radius: 4px;
      text-align: center;
      margin: 10px 0;
      font-weight: 500;
    }
    
    .form-submission-text.error-message {
      background-color: #f44336;
      color: white;
      padding: 15px;
      border-radius: 4px;
      text-align: center;
      margin: 10px 0;
      font-weight: 500;
    }
    
    .form-submission-text {
      display: none;
    }
  `;
  document.head.appendChild(style);
});

/* 
Google Apps Script Code - Copy this to your Google Sheet's Apps Script:

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Append row with email and timestamp
    sheet.appendRow([
      data.email,
      data.timestamp,
      new Date().toLocaleString()
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Slana Subscribe Endpoint Active')
    .setMimeType(ContentService.MimeType.TEXT);
}
*/