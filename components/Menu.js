import { useRouterEvent } from '@/lib/hooks/useRouterEvent'
import { useState } from 'react'

export const Menu = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  // 使用路由事件 hook
  useRouterEvent(() => {
    setIsOpen(false) // 路由变化时关闭菜单
  })

  return (
    <div>
      {/* 您的菜单内容 */}
    </div>
  )
} 