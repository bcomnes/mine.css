export const themeOptions = [
  { value: 'default', label: 'default', file: 'default' },
  { value: 'atom-one', label: 'atom one' },
  { value: 'ayu', label: 'ayu' },
  { value: 'catppuccin', label: 'catppuccin' },
  { value: 'dracula', label: 'dracula / alucard' },
  { value: 'everforest', label: 'everforest' },
  { value: 'flexoki', label: 'flexoki' },
  { value: 'github', label: 'github' },
  { value: 'gruvbox', label: 'gruvbox' },
  { value: 'kanagawa', label: 'kanagawa' },
  { value: 'night-owl', label: 'night owl / light owl' },
  { value: 'rose-pine', label: 'rosé pine' },
  { value: 'solarized', label: 'solarized' },
  { value: 'tokyo-night', label: 'tokyo night' },
  { value: 'tron', label: 'tron', file: 'tron-legacy' }
]

/* Keep the small site manifest beside the menu. Most filenames match their
   values; `file` records the default and Tron compatibility entry points. */
export const namedThemes = themeOptions
  .filter(({ value }) => value !== 'default')
  .map(theme => ({ ...theme, file: 'file' in theme ? theme.file : theme.value }))

export const namedThemeValues = namedThemes.map(({ value }) => value)
