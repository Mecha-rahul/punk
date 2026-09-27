// ==================================================================
// Razorpay Standard Checkout — script loader.
// The checkout.js bundle is loaded lazily on the first "Pay" click so
// it never blocks initial page load. The KEY_SECRET never reaches the
// browser; only the public KEY_ID is passed to Razorpay(options).
// ==================================================================

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

let loadPromise = null

/** Resolves with the global `Razorpay` constructor once the script is ready. */
export function loadRazorpay() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Razorpay checkout requires a browser'))
  }
  if (window.Razorpay) return Promise.resolve(window.Razorpay)
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () =>
      window.Razorpay
        ? resolve(window.Razorpay)
        : reject(new Error('Razorpay checkout failed to initialise'))
    script.onerror = () => {
      loadPromise = null // allow a retry on the next click
      reject(new Error('Could not load Razorpay checkout — check your connection'))
    }
    document.body.appendChild(script)
  })

  return loadPromise
}

/**
 * Opens the Razorpay Standard Checkout modal.
 * `options.handler` receives the success payload
 * ({ razorpay_payment_id, razorpay_order_id, razorpay_signature });
 * `options.onDismiss` / `options.onFailed` receive the dismissed /
 * payment.failed events so the caller can surface them to the user.
 */
export async function openRazorpayCheckout(options) {
  const Razorpay = await loadRazorpay()
  const rzp = new Razorpay(options)

  if (typeof options.onFailed === 'function') {
    rzp.on('payment.failed', (response) => options.onFailed(response))
  }

  rzp.open()
  return rzp
}
