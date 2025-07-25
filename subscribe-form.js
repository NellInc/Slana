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
  const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

  // Override form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const email = emailInput.value;

    if (!email) {
      alert('Please enter your email address');
      return;
    }

    // Disable button during submission
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;

    try {
      // If Google Script URL is not set, save to localStorage for now
      if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        // Fallback: Save to localStorage
        const subscribers = JSON.parse(localStorage.getItem('slana_subscribers') || '[]');
        subscribers.push({
          email: email,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('slana_subscribers', JSON.stringify(subscribers));
        
        // Show success message
        alert('Thank you for subscribing! (Note: Currently saving locally - contact site owner to activate Google Sheets integration)');
        console.log('Subscribers:', subscribers);
      } else {
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

        // Show success message
        alert('Thank you for subscribing to Slana updates!');
      }

      // Clear form
      emailInput.value = '';
      
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Sorry, there was an error. Please try again later.');
    } finally {
      // Re-enable button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
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