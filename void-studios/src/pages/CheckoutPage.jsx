import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { api } from '../lib/api'
import { openRazorpayCheckout } from '../lib/razorpay'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from '../content/content'

const fmt = (n) => `₹${n.toLocaleString('en-IN')}`

const EMPTY_ADDRESS = {
  label: 'Home',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
}

/**
 * Checkout — Razorpay Standard Web Checkout.
 *
 * Flow: POST /orders/checkout (creates order + pending payment + Razorpay
 * order) → open the Razorpay modal with the public KEY_ID and order_id →
 * on success POST /payments/razorpay/verify with the three razorpay_* fields.
 * The webhook remains the server-side source of truth for capture.
 */
export default function CheckoutPage() {
  const { user, apiLive, cartLines, cartSubtotal, clearCart, toast } = useStore()

  const [addresses, setAddresses] = useState(() => user?.addresses ?? [])
  const [addressId, setAddressId] = useState(
    () => user?.addresses?.find((a) => a.isDefault)?._id ?? user?.addresses?.[0]?._id ?? '',
  )
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_ADDRESS)

  const [paying, setPaying] = useState(false)
  const [message, setMessage] = useState('')
  const [invoice, setInvoice] = useState(null) // { order, payment } once the server order exists
  const [done, setDone] = useState(null) // { order, pending } on success

  // Pull the freshest address book (auth cookies → /users/me). The store also
  // hydrates this on boot; this covers sign-in on another tab / stale state.
  useEffect(() => {
    if (apiLive !== true || !user) return
    api
      .me()
      .then((data) => {
        const list = data?.user?.addresses ?? []
        setAddresses(list)
        setAddressId((prev) => prev || list.find((a) => a.isDefault)?._id || list[0]?._id || '')
      })
      .catch(() => {})
  }, [apiLive, user])

  const shipping =
    cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : cartLines.length ? SHIPPING_FLAT_RATE : 0
  const total = useMemo(() => cartSubtotal + shipping, [cartSubtotal, shipping])

  // ── Address creation ───────────────────────────────────────────────────────
  const saveAddress = async (e) => {
    e.preventDefault()
    setMessage('')
    const required = ['line1', 'city', 'state', 'pincode']
    for (const key of required) {
      if (!String(form[key]).trim()) return setMessage('Please fill every required field.')
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) return setMessage('Pincode must be 6 digits.')
    try {
      const data = await api.addAddress({ ...form, isDefault: addresses.length === 0 })
      const list = data?.addresses ?? []
      setAddresses(list)
      setAddressId(data?.addressId || list[list.length - 1]?._id || '')
      setForm(EMPTY_ADDRESS)
      setShowForm(false)
    } catch (err) {
      setMessage(err.message || 'Could not save that address.')
    }
  }

  // ── Payment ────────────────────────────────────────────────────────────────
  const openModal = async (payment, keyId, rzpOrderId) => {
    if (!keyId) throw new Error('Razorpay is not configured on the server.')
    await openRazorpayCheckout({
      key: keyId,
      amount: payment.amount, // paise, from the server
      currency: payment.currency,
      order_id: rzpOrderId,
      name: 'AKUMA',
      description: 'AKUMA order',
      prefill: {
        name: user?.name ?? '',
        email: user?.email ?? '',
        contact: user?.phone || undefined,
      },
      notes: { paymentId: String(payment.id) },
      theme: { color: '#111111' },
      retry: { enabled: true },
      handler: async (resp) => {
        try {
          await api.verifyPayment({
            razorpayOrderId: resp.razorpay_order_id,
            razorpayPaymentId: resp.razorpay_payment_id,
            razorpaySignature: resp.razorpay_signature,
          })
          setDone({ order: invoice?.order, pending: false })
          setInvoice(null)
          clearCart().catch(() => {})
        } catch (err) {
          setMessage(
            err.message || 'We could not verify your payment. Please contact support before retrying.',
          )
        } finally {
          setPaying(false)
        }
      },
      modal: {
        ondismiss: () => {
          setPaying(false)
          setMessage('Payment cancelled — your order is saved. Use “Retry payment” to pay again.')
        },
      },
      onFailed: (resp) => {
        setPaying(false)
        setMessage(resp?.error?.description || 'The payment failed. Please try again.')
      },
    })
  }

  const pay = async () => {
    setMessage('')
    if (paying) return
    if (!addressId) return setMessage('Select a delivery address first.')
    setPaying(true)
    try {
      // Reuse an already-created order (retry) instead of placing a new one.
      let order = invoice?.order
      let payment = invoice?.payment

      if (!order) {
        const data = await api.checkoutOrder({ addressId })
        order = data.order
        payment = data.payment
        setInvoice({ order, payment })
        if (!data.razorpayConfigured) {
          setDone({ order, pending: true })
          setInvoice(null)
          clearCart().catch(() => {})
          setPaying(false)
          return
        }
      }

      let rzpOrderId = payment.razorpayOrderId
      let keyId = payment.razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID

      if (!rzpOrderId) {
        const created = await api.razorpayOrder(payment.id)
        rzpOrderId = created.razorpayOrderId
        keyId = created.razorpayKeyId || keyId
        setInvoice({ order, payment: { ...payment, razorpayOrderId: rzpOrderId, razorpayKeyId: keyId } })
      }

      await openModal(payment, keyId, rzpOrderId)
    } catch (err) {
      setMessage(err.message || 'Could not start the payment. Please try again.')
      setPaying(false)
    }
  }

  // ── Views ──────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="bg-bg-primary">
        <div className="ak-shell py-20">
          <div className="mx-auto max-w-lg border border-line-soft bg-white p-8 text-center sm:p-10">
            <p className="font-wordmark text-3xl tracking-[-0.01em]">AKUMA</p>
            <h1 className="mt-4 text-lg font-medium">
              {done.pending ? 'Order placed' : 'Payment successful'}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {done.pending
                ? 'Your order is saved and marked pending payment — our team will confirm it shortly.'
                : 'Thank you — we have received your payment and your order is confirmed.'}
            </p>
            {done.order?.orderNumber && (
              <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Order {done.order.orderNumber}
              </p>
            )}
            <div className="mt-8 flex flex-col gap-3">
              <Link to="/account" className="ak-btn-outline">View Account</Link>
              <Link to="/new-arrivals" className="ak-btn-dark">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-bg-primary">
        <div className="ak-shell flex flex-col items-center py-28 text-center">
          <h1 className="ak-section-title">Sign in to check out</h1>
          <p className="mt-2 text-sm text-ink-soft">
            An account is needed to save your order and delivery address.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/login" className="ak-btn-dark">Log In</Link>
            <Link to="/register" className="ak-btn-outline">Create Account</Link>
          </div>
        </div>
      </div>
    )
  }

  if (apiLive === false) {
    return (
      <div className="bg-bg-primary">
        <div className="ak-shell flex flex-col items-center py-28 text-center">
          <h1 className="ak-section-title">Checkout is unavailable</h1>
          <p className="mt-2 text-sm text-ink-soft">
            We can’t reach our servers right now. Please try again in a moment.
          </p>
          <Link to="/cart" className="ak-btn-outline mt-8">Back to Bag</Link>
        </div>
      </div>
    )
  }

  // Order already created but not yet paid (modal dismissed / retry).
  if (invoice) {
    return (
      <div className="bg-bg-primary">
        <div className="ak-shell py-20">
          <div className="mx-auto max-w-lg border border-line-soft bg-white p-8 text-center sm:p-10">
            <h1 className="ak-section-title text-left">Complete your payment</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Your order {invoice.order?.orderNumber} is reserved. Finish payment to confirm it.
            </p>
            {message && <p className="mt-4 text-[12px] font-medium text-accent">{message}</p>}
            <button type="button" onClick={pay} disabled={paying} className="ak-btn-dark mt-6 w-full">
              {paying ? 'Opening…' : 'Retry payment'}
            </button>
            <Link
              to="/account"
              className="mt-4 block text-center text-[11px] uppercase tracking-[0.2em] text-ink-soft underline-offset-4 hover:underline"
            >
              Pay later
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (cartLines.length === 0) {
    return (
      <div className="ak-shell py-28 text-center">
        <h1 className="ak-section-title">Nothing to check out</h1>
        <Link to="/new-arrivals" className="ak-btn-dark mt-8">Shop New Arrivals</Link>
      </div>
    )
  }

  return (
    <div className="bg-bg-primary">
      <div className="ak-shell py-10 sm:py-14">
        <h1 className="ak-section-title">Checkout</h1>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* delivery address */}
          <section>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.24em]">Delivery Address</h2>

            {addresses.length > 0 && (
              <ul className="mt-5 space-y-3">
                {addresses.map((a) => (
                  <li key={a._id}>
                    <label
                      className={`flex cursor-pointer gap-3 border p-4 text-sm ${
                        addressId === a._id ? 'border-ink bg-white' : 'border-line-soft bg-white/60'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={addressId === a._id}
                        onChange={() => setAddressId(a._id)}
                        className="mt-0.5"
                      />
                      <span>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                          {a.label || 'Address'}
                        </span>
                        <span className="mt-1 block">
                          {a.line1}
                          {a.line2 ? `, ${a.line2}` : ''}
                          <br />
                          {a.city}, {a.state} — {a.pincode}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}

            {!showForm && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="ak-btn-outline mt-4"
              >
                {addresses.length ? 'Add another address' : 'Add a delivery address'}
              </button>
            )}

            {showForm && (
              <form onSubmit={saveAddress} className="mt-5 space-y-3 border border-line-soft bg-white p-5">
                <div>
                  <label htmlFor="label" className="ak-label">Label</label>
                  <input
                    id="label"
                    className="ak-input"
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    placeholder="Home / Office"
                  />
                </div>
                <div>
                  <label htmlFor="line1" className="ak-label">Address line 1</label>
                  <input
                    id="line1"
                    className="ak-input"
                    value={form.line1}
                    onChange={(e) => setForm({ ...form, line1: e.target.value })}
                    placeholder="House / street"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="line2" className="ak-label">Address line 2 (optional)</label>
                  <input
                    id="line2"
                    className="ak-input"
                    value={form.line2}
                    onChange={(e) => setForm({ ...form, line2: e.target.value })}
                    placeholder="Landmark, area"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label htmlFor="city" className="ak-label">City</label>
                    <input
                      id="city"
                      className="ak-input"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="ak-label">State</label>
                    <input
                      id="state"
                      className="ak-input"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="pincode" className="ak-label">Pincode</label>
                    <input
                      id="pincode"
                      className="ak-input"
                      inputMode="numeric"
                      maxLength={6}
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="ak-btn-dark">Save Address</button>
                  <button type="button" onClick={() => setShowForm(false)} className="ak-btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* order summary */}
          <aside className="h-fit border border-line-soft bg-white p-6 lg:sticky lg:top-32">
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.24em]">Order Summary</h2>
            <ul className="mt-4 space-y-1 text-sm text-ink-soft">
              {cartLines.map((l) => (
                <li key={`${l.productId}-${l.size}-${l.color}`} className="flex justify-between gap-3">
                  <span className="truncate">
                    {l.product.name} × {l.qty}
                  </span>
                  <span className="shrink-0">{fmt((l.product.salePrice ?? l.product.price) * l.qty)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-3 border-t border-line-soft pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd>{fmt(cartSubtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Shipping</dt>
                <dd>{shipping === 0 ? 'FREE' : fmt(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-line-soft pt-3 text-base font-semibold">
                <dt>Total</dt>
                <dd>{fmt(total)}</dd>
              </div>
            </dl>

            {message && <p className="mt-4 text-[12px] font-medium text-accent">{message}</p>}

            <button type="button" onClick={pay} disabled={paying} className="ak-btn-dark mt-6 w-full">
              {paying ? 'Processing…' : `Pay ${fmt(total)}`}
            </button>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              Secure payment via Razorpay
            </p>
            <Link
              to="/cart"
              className="mt-4 block text-center text-[11px] uppercase tracking-[0.2em] text-ink-soft underline-offset-4 hover:underline"
            >
              Back to Bag
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
