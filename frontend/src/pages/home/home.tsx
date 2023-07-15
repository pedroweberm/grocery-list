import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useCheckSession } from "../../hooks"

export const Home = () => {
  const navigate = useNavigate()

  const onInvalid = useCallback(() => navigate('/sign-in'), [navigate])

  useCheckSession({ onInvalid })

  return <div>Home</div>
}