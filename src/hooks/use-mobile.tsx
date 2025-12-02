import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return true on first render if window.innerWidth is less than breakpoint (for SSR compatibility)
  if (typeof window === 'undefined') {
    return false
  }
  
  // If state hasn't been set yet, calculate on the client
  if (isMobile === undefined) {
    return window.innerWidth < MOBILE_BREAKPOINT
  }
  
  return !!isMobile
}
