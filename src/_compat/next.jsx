import { Link as RouterLink, useNavigate, useLocation, useParams } from 'react-router-dom'

export function useRouter() {
  const navigate = useNavigate()
  return {
    push: (to) => navigate(to),
    replace: (to) => navigate(to, { replace: true }),
    back: () => window.history.back()
  }
}

export const Link = ({ href, to, children, ...rest }) => {
  const target = to || href || ''
  return <RouterLink to={target} {...rest}>{children}</RouterLink>
}

export { useLocation, useParams }