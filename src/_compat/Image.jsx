/**
 * Minimal replacement for next/image.
 * Usage: <Image src="/file.png" alt="..." width={...} height={...} className="..." />
 */
const Image = ({ src, alt = '', width, height, style, fill, ...rest }) => {
  const s = { ...style }
  if (fill) {
    s.width = '100%'
    s.height = '100%'
    s.objectFit = s.objectFit || 'cover'
  } else {
    if (width) s.width = typeof width === 'number' ? width + 'px' : width
    if (height) s.height = typeof height === 'number' ? height + 'px' : height
  }
  return <img src={src} alt={alt} style={s} {...rest} />
}

export default Image