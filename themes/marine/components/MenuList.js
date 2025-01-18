import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { MenuItem } from './MenuItem'
import BLOG from '@/blog.config'
import CONFIG from '../config'

export const MenuList = props => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()
  const [isOpen, setOpen] = useState(false)
  const router = useRouter()
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 如果点击的是菜单按钮，不处理（让onClick事件处理）
      if (buttonRef.current && buttonRef.current.contains(event.target)) {
        return
      }
      // 如果点击的是菜单外部，关闭菜单
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    // 使用mousedown事件代替click事件，可以更早捕获点击事件
    document.addEventListener('mousedown', handleClickOutside, true)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
    }
  }, [])

  // 监听路由变化
  useEffect(() => {
    const handleRouteChange = () => {
      setOpen(false)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setOpen(false)
      }
    }
    
    // 使用passive: true提高滚动性能
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen])

  let links = [
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('MARINE_MENU_ARCHIVE', null, CONFIG)
    },
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('MARINE_MENU_SEARCH', null, CONFIG)
    },
    {
      icon: 'fas fa-folder',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('MARINE_MENU_CATEGORY', null, CONFIG)
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('MARINE_MENU_TAG', null, CONFIG)
    }
  ]

  if (customNav) {
    links = customNav.concat(links)
  }

  // 如果开启自定义菜单，则使用Notion中的配置
  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  const toggleMenu = (e) => {
    e.stopPropagation()
    setOpen(!isOpen)
  }

  return (
    <div className="relative">
      {/* 大屏幕菜单 */}
      <div className='hidden lg:flex items-center space-x-4'>
        {links?.map((link, index) => (
          <MenuItem key={index} link={link} />
        ))}
      </div>

      {/* 移动端菜单 */}
      <div className='lg:hidden'>
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className='flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400'
        >
          <i className={`fas fa-bars text-xl ${isOpen ? 'text-blue-500 dark:text-blue-400' : ''}`} />
          <span className='ml-2'>{isOpen ? '关闭' : '菜单'}</span>
        </button>

        {/* 移动端下拉菜单 */}
        <div 
          ref={menuRef}
          className={`
            fixed left-0 right-0 top-[60px]
            mt-2 py-2
            bg-white dark:bg-gray-800
            border border-gray-100 dark:border-gray-700
            shadow-lg
            transition-all duration-200 ease-in-out
            ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
            z-50
          `}
        >
          {links?.map((link, index) => (
            <MenuItem
              key={index}
              link={link}
              onClick={() => setOpen(false)}
              isMobile={true}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
