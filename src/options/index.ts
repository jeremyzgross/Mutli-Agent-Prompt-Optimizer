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
