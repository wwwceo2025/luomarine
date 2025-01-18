import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useRouterEvent = (callback) => {
  const router = useRouter()
  
  useEffect(() => {
    // 路由变化时触发回调
    const handleRouteChange = () => {
      if (typeof callback === 'function') {
        callback()
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router, callback])
} 