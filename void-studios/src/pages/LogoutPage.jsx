import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

// /logout — clears mock auth and bounces home with a toast.
export default function LogoutPage() {
  const { logout, toast, user } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      logout()
      toast("You've been logged out")
    }
    navigate('/', { replace: true })
  }, [user, logout, toast, navigate])

  return null
}
