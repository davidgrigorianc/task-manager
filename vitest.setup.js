import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { vi } from 'vitest'

const vuetify = createVuetify({
  components,
  directives,
})

config.global.plugins = [vuetify]

config.global.mocks = {
  $t: (msg) => msg,
  $store: {
    dispatch: vi.fn(),
    commit: vi.fn(),
    state: {},
    getters: {},
  },
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
  },
}

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
