<template>
    <n-card class="card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <n-gradient-text size="24" style="margin-bottom: 10px; display: inline-block; font-weight: bold;"> 自选菜区
                <n-gradient-text size="10" style="display: inline-block;"> 共3667词
                </n-gradient-text>
            </n-gradient-text>
            <n-switch v-model:value="isNSFW" size="medium" style="display: inline-block;">
                <template #icon>
                    🔞
                </template>
                <template #checked>
                    新世界!
                </template>
                <template #unchecked>
                    这好吗?
                </template>
            </n-switch>
        </div>
        <n-input-group style="display: block; width: 100%; margin-bottom: 10px;">
            <n-input :style="{ width: '80%' }" clearable v-model:value="promptCustomContent">
                <template #prefix>
                    <n-gradient-text style="font-weight: bold;" type="info">
                        自定义Prompt：
                    </n-gradient-text>
                </template>
            </n-input>
            <n-button :style="{ width: '20%' }" type="primary" @click="addOwnPrompt">
                添加
            </n-button>
        </n-input-group>
        <n-space vertical v-if="isDesktop">
            <n-layout has-sider>
                <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" show-trigger>
                    <n-menu :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions"
                        @update:value="handleMenuSelect" />
                </n-layout-sider>
                <n-layout style="padding: 10px;">
                    <n-scrollbar style="max-height: 720px">
                        <n-card v-for="(tags, title) in currentTags" :key="title" size="small"
                            style="margin-bottom: 10px;">
                            <n-gradient-text style="margin-bottom: 10px; display: block; font-weight: bold;"> {{ title
                                !==
                                'default' ? title : '' }}
                            </n-gradient-text>

                            <n-tag class="v-border" v-for="tag in tags" :key="tag.en" checkable
                                :checked="isTagChecked(tag)" @update:checked="toggleTag(tag)">
                                <div style="font-weight: bold;"> {{ tag.en }} </div>
                                <div style="font-size: 10px; margin-top:3px;"> {{ tag.zh }} </div>
                            </n-tag>
                        </n-card>
                    </n-scrollbar>
                </n-layout>
            </n-layout>
        </n-space>
        <n-space vertical v-else>
            <n-scrollbar x-scrollable style="padding: 10px 0;">
                <n-menu mode="horizontal" :options="menuOptions" @update:value="handleMenuSelect" responsive />
            </n-scrollbar>
            <n-scrollbar style="max-height: 500px">
                <n-card v-for="(tags, title) in currentTags" :key="title" size="small" style="margin-bottom: 10px;">
                    <n-gradient-text style="margin-bottom: 10px; display: block; font-weight: bold;"> {{ title !==
                        'default'
                        ?
                        title : '' }}
                    </n-gradient-text>

                    <n-tag size="small" class="v-border small" v-for="tag in tags" :key="tag.en" checkable
                        :checked="isTagChecked(tag)" @update:checked="toggleTag(tag)">
                        <div style="font-weight: bold; font-size: 12px;"> {{ tag.en }} </div>
                        <div style="font-size: 8px; margin-top:3px;"> {{ tag.zh }} </div>
                    </n-tag>
                </n-card>
            </n-scrollbar>
        </n-space>

    </n-card>
</template>


<script lang="ts">
import { defineComponent, ref, h, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Component } from 'vue'
import type { TagDB } from '../types';

import tagDB from '../content/jsonReader';

const typedTagDB = tagDB as TagDB;

const promptCustomContent = ref('')


import { useTagStore } from '../utils/useTagStore';

import {
    BookOutline as BookIcon,
    Body,
    Rose,
} from "@vicons/ionicons5";

import {
    WeatherHaze24Filled,
    StyleGuide24Filled,
    PersonBoard24Filled,
} from "@vicons/fluent";

import {
    Shoe,
    Crown,
    Eye,
    Run,
    FaceId,
} from "@vicons/tabler";

import {
    Socks,
    BlackTie,
    ShoppingBag,
    GrinHearts,
} from "@vicons/fa";

import {
    NCard,
    NSpace,
    NIcon,
    NLayout,
    NMenu,
    NLayoutSider,
    NTag,
    NGradientText,
    NSwitch,
    NScrollbar,
    NInputGroup,
    NInput,
    NButton,


} from 'naive-ui'

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
    {
        label: "起手式",
        key: "start",
        icon: renderIcon(BookIcon),
    },
    {
        label: "环境",
        key: "env",
        icon: renderIcon(WeatherHaze24Filled),
    },
    {
        label: "风格",
        key: "style",
        icon: renderIcon(StyleGuide24Filled),
    },
    {
        label: "人物",
        key: "person",
        icon: renderIcon(PersonBoard24Filled),
    },
    {
        label: "物体",
        key: "goods",
        icon: renderIcon(Rose),
    },
    {
        label: "头发&头饰",
        key: "hair",
        icon: renderIcon(Crown),
    },
    {
        label: "眼睛",
        key: "eye",
        icon: renderIcon(Eye),
    },
    {
        label: "脸部",
        key: "face",
        icon: renderIcon(FaceId),
    },
    {
        label: "体型",
        key: "shape",
        icon: renderIcon(Body),
    },
    {
        label: "衣服",
        key: "clothes",
        icon: renderIcon(BlackTie),
    },
    {
        label: "鞋子",
        key: "shoes",
        icon: renderIcon(Shoe),
    },
    {
        label: "袜子",
        key: "socks",
        icon: renderIcon(Socks),
    },
    {
        label: "装饰",
        key: "decor",
        icon: renderIcon(ShoppingBag),
    },
    {
        label: "动作",
        key: "action",
        icon: renderIcon(Run),
    },
    {
        label: "NSFW",
        key: "NSFW",
        icon: renderIcon(GrinHearts),
    },
];

// 屏幕宽度
const windowWidth = ref(window.innerWidth)
// 屏幕高度

// 获取屏幕尺寸
const getWindowResize = function () {
    windowWidth.value = window.innerWidth
}



export default defineComponent({
    name: 'TagModule',

    components: {
        NCard,
        NSpace,
        NLayout,
        NMenu,
        NLayoutSider,
        NTag,
        NGradientText,
        NSwitch,
        NScrollbar,
        NInputGroup,
        NInput,
        NButton

    },

    setup() {
        onMounted(() => {
            getWindowResize(); // 初始化时获取一次屏幕尺寸
            window.addEventListener('resize', getWindowResize);
        });


        const currentCategory = ref('start');
        const { isNSFW, toggleTag, isTagChecked, addTag } = useTagStore();

        const currentTags = computed(() => {
            const normalTags = typedTagDB[currentCategory.value]?.normal || {};
            const r18Tags = isNSFW.value ? typedTagDB[currentCategory.value]?.r18 || {} : {};

            // 合并 normal 和 r18 标签
            const mergedTags = { ...normalTags };

            for (const title in r18Tags) {
                if (mergedTags[title]) {
                    mergedTags[title] = mergedTags[title].concat(
                        r18Tags[title].map(tag => ({ ...tag, isR18: true }))
                    );
                } else {
                    mergedTags[title] = r18Tags[title].map(tag => ({ ...tag, isR18: true }));
                }
            }

            return mergedTags;
        });

        const addOwnPrompt = () => {
            addTag({
                en: promptCustomContent.value,
                zh: '-',
            });
        };

        const handleMenuSelect = (key: string) => {
            currentCategory.value = key;
        };

        return {
            menuOptions,
            currentCategory,
            currentTags,
            isNSFW,
            promptCustomContent,
            isDesktop: computed(() => windowWidth.value > 768),
            isTagChecked,
            toggleTag,
            handleMenuSelect,
            addOwnPrompt
        };
    }
});
</script>

<style scoped>
.card {
    margin-bottom: 24px;
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

.v-divider {
    background-color: --var(--n-color);
    height: 1px;
    width: 100%;
    margin: 10px 0;
}

.v-border {
    border: 1px solid var(--n-color-checked);
    border-radius: 5px;
    padding: 20px 10px;
    margin: 5px;
}

.small {
    padding: 15px 5px;
}
</style>