import { useEffect, useState } from "react"

import { getAuthenticatedUser } from "../../services"

export const useAuthenticatedUser = ({ onValid, onInvalid }: { onValid?: () => unknown, onInvalid?: () => unknown } = {}) => {
  const [user, setUser] = useState<any>()
  
  useEffect(() => {
    const run = async function() {
      const response = await getAuthenticatedUser()

      setUser(response.user)
    }

    run()
  }, [onValid, onInvalid])

  return { user }
}