import { initYtPop } from './ContentApp.js'

let observer = null

export default function initial() {
  // Start scanning thumbnails
  observer = initYtPop()

  // Return cleanup function for HMR
  return () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    // Remove all injected play buttons
    document.querySelectorAll('.ytpop-shadow-wrapper').forEach((btn) => btn.remove())
    // Remove any open popup
    const overlay = document.getElementById('ytpop-overlay')
    if (overlay) overlay.remove()
    // Remove processed markers
    document.querySelectorAll('ytd-thumbnail[data-ytpop-processed]').forEach((el) => {
      el.removeAttribute('data-ytpop-processed')
    })
    // Remove injected style tag
    const injectedStyle = document.getElementById('ytpop-styles')
    if (injectedStyle) injectedStyle.remove()
  }
}
