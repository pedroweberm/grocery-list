import { useCallback, useEffect, useState } from "react"
import { RealTimeService } from '../../services'

enum ConnectionStatus {
  CONNECTED = 'CONNECTED',
  CONNECTING = 'CONNECTING',
  DISCONNECTED = 'DISCONNECTED',
}

export const useIotRealTime = (url: string, topics: string[], onMessageReceived: (message: string, topic: string) => unknown) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED)
  const realTimeService = RealTimeService(topics)

  const onConnect = useCallback(() => setConnectionStatus(ConnectionStatus.CONNECTED), [])
  const onDisconnect = useCallback(() => setConnectionStatus(ConnectionStatus.DISCONNECTED), [])
  const onMessageReceivedCallBack = useCallback(onMessageReceived, [onMessageReceived])
  
  useEffect(() => {
    if (url && url.length > 0) {
      if (connectionStatus === ConnectionStatus.DISCONNECTED) {
        console.log('connection status is disconnected, attempting new connection...')
        setConnectionStatus(ConnectionStatus.CONNECTING)
        realTimeService.connect(url)
      }

      realTimeService.addConnectListener(onConnect)
      realTimeService.addDisconnectListener(onDisconnect)
      realTimeService.addMessageReceivedListener(onMessageReceivedCallBack)
    }
  }, [url, realTimeService, connectionStatus, onConnect, onDisconnect, onMessageReceivedCallBack])

  return { connectionStatus }
}
