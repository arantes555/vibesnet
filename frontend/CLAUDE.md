# CLAUDE.md

## Project: VibesNet
A NetVibes-like dashboard for RSS feeds and widgets.

## Code Style

### Vue Components
- **Use Options API** with `defineComponent()` - NOT `<script setup>`
- Always include `name` property in components
- Order: name, components, props, emits, setup (for Pinia only), data, computed, watch, lifecycle hooks, methods

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MyComponent',

  props: { ... },
  emits: [...],

  data () {
    return { ... }
  },

  computed: { ... },
  watch: { ... },

  mounted () { ... },

  methods: { ... }
})
</script>
```

### TypeScript
- Use TypeScript for all files
- Use `type` imports: `import type { X } from '...'`
- Use `PropType` for complex prop types

### Linting
- StandardJS style via neostandard (no semicolons, single quotes)
- Run `npm run lint` to check and fix

## Architecture

- **Framework**: Vue 3 + TypeScript + Vite
- **State**: Pinia stores
- **Routing**: Vue Router
- **Grid**: grid-layout-plus (drag-and-drop widget layout)
- **Storage**: LocalStorage (no backend)

## File Structure

```
src/
├── components/
│   ├── dashboard/      # Dashboard-level components
│   ├── widgets/        # Widget components
│   │   ├── dialogs/    # Widget edit dialogs
│   │   └── types/      # Widget type definitions
│   └── ui/             # Reusable UI components
├── services/           # External API services (RSS, weather)
├── stores/             # Pinia stores
├── utils/              # Utility functions
└── views/              # Page components
```

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Lint and fix code
npm run type-check # TypeScript check
```

## Git Commits
- Do NOT include `Co-Authored-By` lines in commit messages
- The user is the sole author of all commits

## Widget Types
- Clock (configurable: timezone, format, seconds)
- Notes (inline editing)
- Bookmarks (inline add/remove)
- RSS Feed (configurable: URL, refresh interval, max items)
- Weather (configurable: location, units)
