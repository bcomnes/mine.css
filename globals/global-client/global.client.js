import { initializeThemeControl, restoreTheme } from './theme.js'
import { initializeTypographyControls } from './typography.js'

// Restore persisted color choices before initializing controls that need the DOM.
restoreTheme()
initializeTypographyControls()
initializeThemeControl()
