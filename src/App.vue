<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <GeneratorPage />
      <n-global-style />
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { NMessageProvider, NConfigProvider, useOsTheme, darkTheme, NGlobalStyle } from 'naive-ui'
import GeneratorPage from './components/GeneratorPage.vue'

export default defineComponent({
  name: 'App',
  components: {
    GeneratorPage,
    NMessageProvider,
    NConfigProvider,
    NGlobalStyle
  },
  setup() {
    const osThemeRef = useOsTheme()

    return {
      theme: computed(() => (osThemeRef.value === 'dark' ? darkTheme : null)),
      osTheme: osThemeRef
    }
  }
})
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  min-width: 320px;
  --header-height: 64px;
  --content-width: 98%;
  --content-max-width: calc(100vw - 32px);
}

body {
  overflow: auto;
  -webkit-font-smoothing: antialiased;
  background-color: var(--n-color);


}

a {
  text-decoration: none;
}

.n-card.modal-card {
  width: calc(var(--content-width) + 32px);
  max-width: var(--content-max-width);
  margin-top: 32px;
  margin-bottom: 32px;
}

img[loading="eager"] {
  width: 100%;
}
</style>
