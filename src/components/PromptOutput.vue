<template>
  <n-card class="card v-sticky" title="结果">
    <n-alert title="你应该知道的" type="info" closable class="v-sticky">
      选择Prompt后，可在这里拖拽排序，Prompt的顺序对生成结果有影响，越靠前越优先。点击后可以设置权重，权重越高越优先。
      <br />
      不好用？<n-button text tag="a"
        href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=-1zZRZyhWc2IF7MJATOyNSC7KZ5b3qCC&authKey=9VHwEnbbKmZXLFTipiZFySgBF2hjvBE%2FIrhYQc0L31jPPxRTfuvrICQZz84RU19e&noverify=0&group_code=785103637"
        target="_blank" type="primary">
        进群反馈: 785103637
      </n-button>
    </n-alert>
    <n-card class="card" size="small" style="margin-top: 10px;">
      <div class="flex-sb">
        <n-gradient-text type="info" style="margin-bottom: 10px"> 正向Prompt </n-gradient-text>
        <n-button strong secondary circle @click="cleanAllTags">
          <template #icon>
            <n-icon>
              <DeleteIcon />
            </n-icon>
          </template>
        </n-button>
      </div>


      <VueDraggable ref="el" v-model="list" animation="20" v-if="list.length > 0">
        <n-badge v-for="tag in list as TagWithWeight[]" :key="tag.en" :value="tag.weight.toString()"
          :show="tag.weight !== 1" :offset="offset">
          <n-tag type="success" closable style="padding: 20px 10px; margin: 5px;" @click="selectTag(tag)"
            @close="removeTag(tag)">
            <div style="font-weight: bold;"> {{ tag.en }} </div>
            <div style="font-size: 10px; margin-top:3px;"> {{ tag.zh }} </div>
          </n-tag>
        </n-badge>
      </VueDraggable>
      <n-result v-else status="404" title="是不是应该先点菜" style="margin-top: 20px;">
      </n-result>
    </n-card>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <n-slider v-model:value="cardCount" :step="1" :min="1" :max="100" />
      <n-button dashed strong :render-icon="renderIcon" style="margin-left: 20px;" @click="addRandomPrompt">
        随机来{{ cardCount }}个Prompt
      </n-button>
    </div>
    <div v-if="selectedTag" style="display: flex; justify-content: space-between; align-items: center;">
      <n-badge :value="selectedTagWeight.toString()" v-if="selectedTagWeight !== 1">
        <n-tag type="success" style="padding: 20px 10px; margin: 5px;">
          <div style="font-weight: bold;"> {{ selectedTag.en }} </div>
          <div style="font-size: 10px; margin-top:3px;"> {{ selectedTag.zh }} </div>
        </n-tag>
      </n-badge>
      <n-tag v-else type="success" style="padding: 20px 10px; margin: 5px;">
        <div style="font-weight: bold;"> {{ selectedTag.en }} </div>
        <div style="font-size: 10px; margin-top:3px;"> {{ selectedTag.zh }} </div>
      </n-tag>
      <n-input-number v-model:value="selectedTagWeight" :step="0.1" style="display: inline-block;"
        @update:value="updateWeight" />
    </div>

    <div style="display: flex; padding-top: 15px; justify-content: flex-end">
      <n-button style="margin-right: 15px" @click="copyNegativePrompt"> 复制反向Prompt </n-button>
      <n-button type="primary" style="margin-bottom: 15px" @click="copyPositivePrompt"> 复制正向Prompt </n-button>
    </div>
    <n-alert :title='(isNegativeOutput ? "反向Prompt" : "正向Prompt") + "已复制"' type="success" v-if="outputPromptText != ''">
      {{ outputPromptText }}
    </n-alert>
  </n-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, h } from 'vue';
import { useTagStore } from '../utils/useTagStore';
import { NCard, NButton, NGradientText, NTag, NBadge, NInputNumber, NAlert, NResult, NSlider, NIcon } from 'naive-ui';
import { VueDraggable } from 'vue-draggable-plus';
import type { TagWithWeight } from '../types';
import { allTags, allTagsWithR18 } from '@/content/jsonReader';

import {
  GiftCard20Filled,
  DeleteLines20Filled as DeleteIcon,
} from "@vicons/fluent";


export default defineComponent({
  name: 'PromptOutput',
  components: {
    NCard,
    NButton,
    NGradientText,
    NTag,
    NBadge,
    NInputNumber,
    NAlert,
    NResult,
    NSlider,
    VueDraggable,
    NIcon,
    DeleteIcon,
  },
  setup() {
    const { selectedTags, isNSFW, removeTag, updateTagWeight, cleanAllTags } = useTagStore();
    const selectedTag = ref<TagWithWeight | null>(null);
    const selectedTagWeight = ref(1);
    const list = ref(selectedTags);
    const outputPromptText = ref('');
    const cardCount = ref(1);

    const isNegativeOutput = ref(false);

    const selectTag = (tag: TagWithWeight) => {
      selectedTag.value = tag;
      selectedTagWeight.value = tag.weight;
    };

    const updateWeight = (newWeight: number | null) => {
      if (selectedTag.value && newWeight !== null) {
        selectedTagWeight.value = newWeight;
        updateTagWeight(selectedTag.value, newWeight);
      }
    };

    const computedWeight = computed(() => selectedTagWeight.value);

    const copyPositivePrompt = () => {
      isNegativeOutput.value = false;
      const tags = Array.from(list.value as TagWithWeight[]);
      console.log(selectedTags.value);

      var promptText = "";
      const promptList = tags.map(tag => {
        return tag.weight !== 1 ? `(${tag.en}:${tag.weight})` : tag.en;
      });
      promptText = promptList.join(', ');

      outputPromptText.value = promptText;
      navigator.clipboard.writeText(promptText).then(() => {
        console.log(promptText);
      });
    };

    // 随机从allTags中抽取cardCount个Prompt，加上Weight为1后添加到list中，不要重复
    const addRandomPrompt = () => {
      const tags = Array.from(list.value as TagWithWeight[]);
      var promptList = [];
      if (isNSFW.value) {
        promptList = allTagsWithR18.filter(tag => !tags.some(t => t.en === tag.en));
      } else {
        promptList = allTags.filter(tag => !tags.some(t => t.en === tag.en));
      }
      const randomTags = promptList.sort(() => Math.random() - 0.5).slice(0, cardCount.value);
      const newTags = randomTags.map(tag => {
        return { ...tag, weight: 1 };
      });
      list.value = tags.concat(newTags);
    };


    const copyNegativePrompt = () => {
      isNegativeOutput.value = true;
      var promptText = "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, bad feet"
      if (!isNSFW.value) {
        promptText = "nsfw, " + promptText;
      }
      outputPromptText.value = promptText;
      navigator.clipboard.writeText(promptText).then(() => {
        console.log(promptText);
      });
    };




    return {
      list,
      selectedTag,
      selectedTagWeight: computedWeight,
      removeTag,
      selectTag,
      updateWeight,
      offset: [-10, 8] as const,
      copyPositivePrompt,
      outputPromptText,
      copyNegativePrompt,
      addRandomPrompt,
      isNegativeOutput,
      cardCount,
      cleanAllTags,
      renderIcon() {
        return h(NIcon, null, {
          default: () => h(GiftCard20Filled)
        })
      }
    };
  },
});
</script>

<style scoped>
.card {
  margin-bottom: 24px;
}

.v-sticky {
  position: -webkit-sticky;
  position: sticky;
  bottom: 0px;
}

.form {
  margin-top: 10px;
}

.m-b-24 {
  margin-bottom: 24px;
}

.preview {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}

.preview-content {
  word-wrap: break-word;
  word-break: normal;
  overflow: hidden;
}

.preview-footer {
  width: 100%;
  display: flex;
  justify-content: center;
}

.flex-sb {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
