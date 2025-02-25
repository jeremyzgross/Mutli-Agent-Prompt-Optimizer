chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'OPTIMIZE_PROMPT') {
    // Get API key from storage
    chrome.storage.local.get(['apiKey'], (result) => {
      if (!result.apiKey) {
        sendResponse({
          success: false,
          error: 'API key not found. Please set it in the extension options.',
        })
        return
      }

      fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${result.apiKey}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          model: request.model || 'meta/llama-3.3-70b-instruct',
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: 2048,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text()
            console.error('API Response:', errorText)
            throw new Error(
              `API responded with status ${response.status}: ${errorText}`
            )
          }
          return response.json()
        })
        .then((data) => {
          if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from API')
          }
          sendResponse({ success: true, data })
        })
        .catch((error) => {
          console.error('API Error:', error)
          sendResponse({ success: false, error: error.message })
        })
    })

    return true
  }
  return false
})
