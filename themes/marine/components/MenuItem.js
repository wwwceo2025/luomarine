import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const MenuItem = ({ link, onClick, isMobile }) => {
  const hasSubMenu = link?.subMenus?.length > 0
  const router = useRouter()
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

  if (!link || !link.show) {
    return null
  }

  const handleClick = () => {
    if (!hasSubMenu && onClick) {
      onClick()
    }
  }

  const handleSubMenuToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSubMenuOpen(!isSubMenuOpen)
  }

  const baseItemClasses = `
    block px-4 py-2
    text-gray-700 dark:text-gray-200
    hover:text-blue-500 dark:hover:text-blue-400
    transition-colors duration-200
    ${router.pathname === link?.href ? 'text-blue-500 dark:text-blue-400' : ''}
    ${isMobile ? '' : 'lg:px-2 lg:py-1'}
  `

  // 移动端菜单项
  if (isMobile) {
    return (
      <div className="relative">
        {!hasSubMenu ? (
          <Link
            href={link?.href || '#'}
            target={link?.target}
            onClick={handleClick}
            className={baseItemClasses}
          >
            {link?.icon && <i className={`${link.icon} mr-2`} />}
            <span>{link?.name}</span>
          </Link>
        ) : (
          <>
            <button
              onClick={handleSubMenuToggle}
              className={`${baseItemClasses} w-full flex items-center justify-between`}
            >
              <span className="flex items-center">
                {link?.icon && <i className={`${link.icon} mr-2`} />}
                <span>{link?.name}</span>
              </span>
              <i className={`fas fa-chevron-down ml-2 transform transition-transform duration-200 ${isSubMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <div
              className={`
                pl-4
                overflow-hidden transition-all duration-200 ease-in-out
                ${isSubMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
              `}
            >
              {link.subMenus.map((subLink, index) => (
                <Link
                  key={index}
                  href={subLink.href || '#'}
                  target={subLink.target}
                  onClick={handleClick}
                  className={`
                    block px-4 py-2
                    text-sm text-gray-700 dark:text-gray-200
                    hover:text-blue-500 dark:hover:text-blue-400
                    hover:bg-gray-50 dark:hover:bg-gray-700
                  `}
                >
                  {subLink.icon && <i className={`${subLink.icon} mr-2`} />}
                  <span>{subLink.title || subLink.name}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  // 桌面端菜单项
  return (
    <div
      className="relative"
      onMouseEnter={() => setIsSubMenuOpen(true)}
      onMouseLeave={() => setIsSubMenuOpen(false)}
    >
      <Link
        href={hasSubMenu ? '#' : (link?.href || '#')}
        target={link?.target}
        onClick={hasSubMenu ? handleSubMenuToggle : handleClick}
        className={`${baseItemClasses} flex items-center`}
      >
        {link?.icon && <i className={`${link.icon} mr-2`} />}
        <span>{link?.name}</span>
        {hasSubMenu && (
          <i className={`fas fa-chevron-down ml-2 transform transition-transform duration-200 ${isSubMenuOpen ? 'rotate-180' : ''}`} />
        )}
      </Link>

      {hasSubMenu && (
        <div
          className={`
            absolute left-0 top-full
            min-w-[200px]
            py-2 mt-1
            bg-white dark:bg-gray-800
            border border-gray-100 dark:border-gray-700
            rounded-lg shadow-lg
            transition-all duration-200 ease-in-out
            ${isSubMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
          `}
        >
          {link.subMenus.map((subLink, index) => (
            <Link
              key={index}
              href={subLink.href || '#'}
              target={subLink.target}
              onClick={handleClick}
              className={`
                block px-4 py-2
                text-sm text-gray-700 dark:text-gray-200
                hover:text-blue-500 dark:hover:text-blue-400
                hover:bg-gray-50 dark:hover:bg-gray-700
              `}
            >
              {subLink.icon && <i className={`${subLink.icon} mr-2`} />}
              <span>{subLink.title || subLink.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
