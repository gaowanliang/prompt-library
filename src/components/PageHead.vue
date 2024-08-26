<template>
  <n-layout-header bordered class="nav">
    <div class="nav-box">
      <n-text tag="div" class="ui-logo" :depth="1">
        <img src="../assets/logo.svg" />
        <span>Prompt 自助大图书馆</span>
      </n-text>
      <div class="ui-right">
        <n-button strong secondary circle type="primary" @click="gotoGithub">
          <template #icon>
            <n-icon>
              <github />
            </n-icon>
          </template>
        </n-button>
      </div>
    </div>
  </n-layout-header>
</template>

<script lang="ts">
import { defineComponent, toRef, computed } from 'vue'
import type { PropType } from 'vue'
import { NLayoutHeader, NText, NButton, NIcon, NSpace } from 'naive-ui'
import { Github } from '@vicons/fa'

export default defineComponent({
  name: 'PageHead',
  components: {
    NLayoutHeader,
    NText,
    NIcon,
    NButton,
    Github
  },
  setup: () => {

    return {
      gotoGithub: () => {
        window.open('https://github.com/gaowanliang/prompt-library')
      },
    }
  }
})
</script>

<style scoped>
.nav {
  height: calc(var(--header-height) - 1px);
  display: flex;
  justify-content: center;
}

.nav-box {
  display: flex;
  justify-content: space-between;
  margin: auto;
  width: 95%;
  max-width: var(--content-max-width);
}

.ui-logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
}

.ui-logo>img {
  margin-right: 12px;
  height: 32px;
  width: 32px;
}

.ui-right {
  display: flex;
  align-items: center;
}
</style>
