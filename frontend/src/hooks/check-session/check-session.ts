import { useEffect, useState } from "react"

import { checkSession } from "../../services"

type SessionType = Awaited<ReturnType<typeof checkSession>>['session']

export const useCheckSession = ({ onValid, onInvalid }: { onValid?: () => unknown, onInvalid?: () => unknown } = {}) => {
  const [session, setSession] = useState<SessionType>()
  
  useEffect(() => {
    const run = async function() {
      const { valid, session: sessionData} = await checkSession()
      setSession(sessionData)

      if (valid) {
        return onValid?.()
      }

      return onInvalid?.()
    }

    run()
  }, [onValid, onInvalid])

  return session
}