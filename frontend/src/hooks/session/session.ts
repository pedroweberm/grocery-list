import { useEffect, useState } from "react"

import { checkSession } from "../../services"

type SessionType = Awaited<ReturnType<typeof checkSession>>['session']

export const useSession = ({ onValid, onInvalid }: { onValid?: () => unknown, onInvalid?: () => unknown } = {}) => {
  const [token, setToken] = useState<string | undefined>()
  const [session, setSession] = useState<SessionType>()
  
  useEffect(() => {
    const run = async function() {
      const { valid, session: sessionData } = await checkSession()
      setSession(sessionData)

      if (valid) {
        setToken(sessionData?.getIdToken().getJwtToken())

        return onValid?.()
      }

      return onInvalid?.()
    }

    run()
  }, [onValid, onInvalid])

  return { session, token }
}