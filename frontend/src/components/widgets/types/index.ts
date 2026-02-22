import type { RssFeedItem } from '@/services/rss'

export type WidgetType = 'rss' | 'weather' | 'clock' | 'notes' | 'bookmarks'

export interface BaseWidgetConfig {
  id: string
  type: WidgetType
  title: string
}

export interface RssWidgetConfig extends BaseWidgetConfig {
  type: 'rss'
  feedUrl: string
  refreshInterval: number
  cachedItems?: RssFeedItem[]
  useProxy?: boolean
}

export interface WeatherWidgetConfig extends BaseWidgetConfig {
  type: 'weather'
  latitude: number
  longitude: number
  units: 'celsius' | 'fahrenheit'
}

export interface ClockWidgetConfig extends BaseWidgetConfig {
  type: 'clock'
  timezone: string
  format: '12h' | '24h'
  showSeconds: boolean
}

export interface NotesWidgetConfig extends BaseWidgetConfig {
  type: 'notes'
  content: string
}

export interface Bookmark {
  id: string
  name: string
  url: string
}

export interface BookmarksWidgetConfig extends BaseWidgetConfig {
  type: 'bookmarks'
  bookmarks: Bookmark[]
}

export type WidgetConfig =
  | RssWidgetConfig
  | WeatherWidgetConfig
  | ClockWidgetConfig
  | NotesWidgetConfig
  | BookmarksWidgetConfig

export interface WidgetPosition {
  x: number
  y: number
  w: number
  h: number
  i: string
}

export interface DashboardWidget {
  config: WidgetConfig
  position: WidgetPosition
}

export const WIDGET_DEFAULTS: Record<WidgetType, { w: number, h: number }> = {
  clock: { w: 1, h: 2 },
  notes: { w: 1, h: 3 },
  bookmarks: { w: 1, h: 3 },
  rss: { w: 1, h: 4 },
  weather: { w: 1, h: 2 }
}
