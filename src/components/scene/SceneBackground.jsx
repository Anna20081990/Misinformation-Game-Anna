/**
 * Vollflächiges Hintergrundbild der Szene.
 * Nutzt backgroundImage-URL oder Fallback-Gradient (backgroundPlaceholder).
 */
export function SceneBackground({ backgroundImage, backgroundPlaceholder }) {
  const style = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    ...(backgroundImage
      ? { backgroundImage: `url(${backgroundImage})` }
      : { background: backgroundPlaceholder || 'var(--scene-bg-fallback, #e0e8f0)' }),
  }
  return <div className="scene-background" style={style} aria-hidden="true" />
}
