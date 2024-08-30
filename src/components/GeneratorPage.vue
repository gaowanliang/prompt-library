<template>
  <n-back-top :right="100" />
  <n-config-provider :theme-overrides="themeOverrides" :locale="locale">
    <n-layout embedded>

      <PageHead />

      <div class="content-box">
        <n-grid cols="1 l:3" :x-gap="12" item-responsive responsive="screen">
          <n-grid-item :span="1" class="container">

            <PromptOutput class="v-flex" :style="{ marginTop: promptOutputMarginTop + 'px' }" />

          </n-grid-item>
          <n-grid-item :span="2">
            <GenerateModule class="v-flex" />
          </n-grid-item>
        </n-grid>
      </div>
      <h5 style="text-align: center">
        <a href="https://github.com/gaowanliang" target="_blank">Gaowan Liang</a> © 2023 -
        {{ new Date().getFullYear() }} , All Rights Reserved
      </h5>
    </n-layout>

  </n-config-provider>
</template>

<script lang="ts">
import {
  defineComponent, ref,
  onMounted,
  onUnmounted,
} from 'vue'
import {
  NLayout,
  NConfigProvider,
  type GlobalThemeOverrides,
  zhCN,
  NGrid,
  NGridItem,
  NBackTop,
  NAffix
} from 'naive-ui'
import PageHead from './PageHead.vue'
import GenerateModule from './GenerateModule.vue'
import PromptOutput from './PromptOutput.vue'

export default defineComponent({
  name: 'GeneratorPage',
  components: {
    PageHead,
    NLayout,
    NConfigProvider,
    GenerateModule,
    NGrid,
    NGridItem,
    NBackTop,
    // NAffix,
    PromptOutput
  },
  setup: () => {
    const lang = ref<'en-US' | 'zh-CN'>('zh-CN')
    const locale = ref<undefined | typeof zhCN>()

    const setLang = (value: 'en-US' | 'zh-CN') => {
      lang.value = value
      locale.value = value === 'en-US' ? undefined : zhCN
    }
    const themeOverrides: GlobalThemeOverrides = {
      common: {
        fontSize: '15px',
        fontSizeMedium: '15px',
        fontSizeLarge: '16px'
      },
      Card: {
        titleFontSizeMedium: '20px'
      },
      Form: {
        labelFontSizeTopLarge: '15px'
      }
    }

    const promptOutputMarginTop = ref<number>(0)

    // const handleScroll = () => {
    //   const scrollTop = window.scrollY || document.documentElement.scrollTop
    //   promptOutputMarginTop.value = scrollTop
    // }

    // onMounted(() => {
    //   window.addEventListener('scroll', handleScroll)
    // })

    // onUnmounted(() => {
    //   window.removeEventListener('scroll', handleScroll)
    // })

    return {
      lang,
      locale,
      themeOverrides,
      setLang,
      promptOutputMarginTop
    }
  }
})
</script>

<style scoped>
.content-box {
  margin: auto;
  width: var(--content-width);
  max-width: var(--content-max-width);
  padding: 24px 0;
}

.content {
  margin-top: 24px;
}

.v-flex {
  display: flex;
  justify-content: center;
}

.container {
  height: auto;
  overflow: auto;
}
</style>
