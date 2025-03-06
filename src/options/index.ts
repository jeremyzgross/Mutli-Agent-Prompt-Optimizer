console.log('Options page loaded')

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
        <h1>Prompt Optimizer Options</h1>
        <p>Configure your Prompt Optimizer extension settings here.</p>
        
        <div style="margin-top: 20px;">
          <h2>Coming Soon</h2>
          <p>Additional configuration options will be available in future updates.</p>
        </div>
      </div>
    `
  }
})

function saveOptions() {
  const apiKey = (document.getElementById('apiKey') as HTMLInputElement).value
  chrome.storage.local.set(
    {
      apiKey: apiKey,
    },
    () => {
      const status = document.getElementById('status')!
      status.textContent = 'Options saved.'
      status.className = 'status success'
      status.style.display = 'block'
      setTimeout(() => {
        status.style.display = 'none'
      }, 2000)
    }
  )
}

function restoreOptions() {
  chrome.storage.local.get(
    {
      apiKey: '',
    },
    (items) => {
      ;(document.getElementById('apiKey') as HTMLInputElement).value =
        items.apiKey
    }
  )
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save')?.addEventListener('click', saveOptions)
