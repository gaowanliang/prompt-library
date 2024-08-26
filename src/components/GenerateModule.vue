<template>
    <n-card class="card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <n-gradient-text size="24" style="margin-bottom: 10px; display: inline-block; font-weight: bold;"> 自选菜区
            </n-gradient-text>
            <n-switch v-model:value="r18Active" size="medium" style="display: inline-block;">
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
        <n-space vertical>
            <n-layout has-sider>
                <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" show-trigger>
                    <n-menu :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions"
                        @update:value="handleMenuSelect" />
                </n-layout-sider>
                <n-layout style="padding: 10px;">
                    <n-card v-for="(tags, title) in currentTags" :key="title" size="small" style="margin-bottom: 10px;">
                        <n-gradient-text style="margin-bottom: 10px; display: block; font-weight: bold;"> {{ title !==
                            'default' ? title : '' }}
                        </n-gradient-text>

                        <n-tag class="v-border" v-for="tag in tags" :key="tag.en" checkable :checked="isTagChecked(tag)"
                            @update:checked="toggleTag(tag)">
                            <div style="font-weight: bold;"> {{ tag.en }} </div>
                            <div style="font-size: 10px; margin-top:3px;"> {{ tag.zh }} </div>
                        </n-tag>
                    </n-card>
                </n-layout>
            </n-layout>
        </n-space>
    </n-card>
</template>


<script lang="ts">
import { defineComponent, ref, h, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Component } from 'vue'
import tagDB from '../content/tag.json';

import { useTagStore } from '../utils/useTagStore';

import {
    BookOutline as BookIcon,
    Body
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
    NSwitch

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
        NSwitch
    },
    setup() {
        const r18Active = ref(false);
        const currentCategory = ref('start');
        const { selectedTags, toggleTag, isTagChecked } = useTagStore();

        const currentTags = computed(() => {
            const normalTags = tagDB[currentCategory.value]?.normal || {};
            const r18Tags = r18Active.value ? tagDB[currentCategory.value]?.r18 || {} : {};

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

        const handleMenuSelect = (key: string) => {
            currentCategory.value = key;
        };

        return {
            menuOptions,
            currentCategory,
            currentTags,
            r18Active,
            isTagChecked,
            toggleTag,
            handleMenuSelect,
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
</style>