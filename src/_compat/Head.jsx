import { useEffect } from 'react'

/**
 * Very small replacement for next/head.
 * Only supports <title> in children to set document.title.
 */
export default function Head({ children }) {
  useEffect(() => {
    if (!children) return
    const match = Array.isArray(children) ? children.find(c => c && c.type === 'title') : (children && children.type === 'title' ? children : null)
    if (match && match.props && match.props.children) document.title = match.props.children
  }, [children])
  return null
}