import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const getMatches = () =>
    typeof window !== "undefined" &&
    window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches

  const [isMobile, setIsMobile] = React.useState(getMatches)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = (e) => {
      setIsMobile(e.matches)
    }

    mql.addEventListener("change", onChange)

    // Set initial
    setIsMobile(mql.matches)

    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
