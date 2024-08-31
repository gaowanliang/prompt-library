import { ref } from 'vue';
import type { Tag, TagWithWeight } from '@/types';
import { event } from 'vue-gtag';
import { useNotification } from 'naive-ui';

const selectedTags = ref<TagWithWeight[]>([]);
const selectedNegativeTags = ref<TagWithWeight[]>([]);
const isNSFW = ref(false);
const isNegativeMode = ref(false);

const defaultNegativeTags = [
    {
        "en": "easynegative",
        "zh": "简易负面"
    },
    {
        "en": "bad",
        "zh": "差"
    },
    {
        "en": "bad anatomy",
        "zh": "解剖结构差"
    },
    {
        "en": "bad composition",
        "zh": "构图不佳"
    },
    {
        "en": "bad feet",
        "zh": "脚部差"
    },
    {
        "en": "bad hands",
        "zh": "手部差"
    },
    {
        "en": "blurry",
        "zh": "模糊"
    },
    {
        "en": "cropped",
        "zh": "被裁剪"
    },
    {
        "en": "deformed",
        "zh": "畸形"
    },
    {
        "en": "digit",
        "zh": "手指数量异常"
    },
    {
        "en": "error",
        "zh": "错误"
    },
    {
        "en": "extra digit",
        "zh": "多余手指"
    },
    {
        "en": "extra limb",
        "zh": "多余肢体"
    },
    {
        "en": "extra missing fingers",
        "zh": "额外或缺失手指"
    },
    {
        "en": "fewer digits",
        "zh": "手指数量过少"
    },
    {
        "en": "imperfect eyes",
        "zh": "眼睛不完美"
    },
    {
        "en": "inaccurate eyes",
        "zh": "眼睛不准确"
    },
    {
        "en": "inaccurate limb",
        "zh": "四肢不准确"
    },
    {
        "en": "jpeg artifacts",
        "zh": "JPEG 压缩失真"
    },
    {
        "en": "logo",
        "zh": "标志"
    },
    {
        "en": "low quality",
        "zh": "低质量"
    },
    {
        "en": "lowres",
        "zh": "低分辨率"
    },
    {
        "en": "missing fingers",
        "zh": "缺失手指"
    },
    {
        "en": "missing limbs",
        "zh": "缺失肢体"
    },
    {
        "en": "negative_hand",
        "zh": "负面手部"
    },
    {
        "en": "normal quality",
        "zh": "一般质量"
    },
    {
        "en": "painting by bad-artist",
        "zh": "糟糕画家的作品"
    },
    {
        "en": "signature",
        "zh": "签名"
    },
    {
        "en": "skewed eyes",
        "zh": "眼睛歪斜"
    },
    {
        "en": "text",
        "zh": "文本"
    },
    {
        "en": "ugly",
        "zh": "丑陋"
    },
    {
        "en": "ugly body",
        "zh": "身体丑陋"
    },
    {
        "en": "unnatural body",
        "zh": "身体不自然"
    },
    {
        "en": "unnatural face",
        "zh": "脸部不自然"
    },
    {
        "en": "username",
        "zh": "用户名"
    },
    {
        "en": "watermark",
        "zh": "水印"
    },
    {
        "en": "worst quality",
        "zh": "最差质量"
    }
];

// 从 localStorage 恢复 selectedTags
const savedTags = localStorage.getItem('selectedTags');

if (savedTags) {
    selectedTags.value = JSON.parse(savedTags);
}

const savedNegativeTags = localStorage.getItem('selectedNegativeTags');

if (savedNegativeTags) {
    selectedNegativeTags.value = JSON.parse(savedNegativeTags);
}

export function useTagStore() {
    const notification = useNotification();
    const addTag = (tag: Tag, isNegative: boolean = false) => {
        const tagObjects = isNegative ? selectedNegativeTags : selectedTags;
        const revTagObjects = !isNegative ? selectedNegativeTags : selectedTags;
        const existingTag = tagObjects.value.find(t => t.en === tag.en && t.zh === tag.zh);
        if (!existingTag) {
            const existingTag = revTagObjects.value.find(t => t.en === tag.en && t.zh === tag.zh);
            if (existingTag) {
                notification["error"]({
                    content: '不是，哥们',
                    meta: '一个词怎么可能既是正向又是反向呢？',
                    duration: 2500,
                    keepAliveOnHover: true
                })
            } else {

                tagObjects.value.push({ ...tag, weight: 1 });
                localStorage.setItem(
                    isNegative ? 'selectedNegativeTags' : 'selectedTags',
                    JSON.stringify(tagObjects.value));  // 更新 localStorage

                event("add_prompt", {
                    event_category: "prompt",
                    event_label: tag.en,
                    value: isNegative ? 1 : 2
                });
            }
        }
    };

    const removeTag = (tag: Tag, isNegative: boolean = false) => {
        const tagObjects = isNegative ? selectedNegativeTags : selectedTags;
        tagObjects.value = tagObjects.value.filter(t => !(t.en === tag.en && t.zh === tag.zh));
        localStorage.setItem(isNegative ? 'selectedNegativeTags' : 'selectedTags', JSON.stringify(tagObjects.value));  // 更新 localStorage

        event("remove_prompt", {
            event_category: "prompt",
            event_label: tag.en,
            value: isNegative ? 1 : 2
        });
    };

    const toggleTag = (tag: Tag, isNegative: boolean = isNegativeMode.value) => {
        console.log(tag, isNegative);
        const tagObjects = isNegative ? selectedNegativeTags : selectedTags;
        const existingTag = tagObjects.value.find(t => t.en === tag.en && t.zh === tag.zh);
        console.log(existingTag);
        if (existingTag) {
            removeTag(tag, isNegative);
        } else {
            addTag(tag, isNegative);
        }
    };

    const isTagChecked = (tag: Tag) => {
        const negRes = selectedNegativeTags.value.some(t => t.en === tag.en && t.zh === tag.zh);
        const posRes = selectedTags.value.some(t => t.en === tag.en && t.zh === tag.zh);
        return negRes || posRes;
    };

    const isNegativeTag = (tag: Tag) => {
        return selectedNegativeTags.value.some(t => t.en === tag.en && t.zh === tag.zh);
    }

    const isBothTag = (tag: Tag) => {
        return selectedTags.value.some(t => t.en === tag.en && t.zh === tag.zh) && selectedNegativeTags.value.some(t => t.en === tag.en && t.zh === tag.zh);
    }

    const updateTagWeight = (tag: Tag, weight: number, isNegative: boolean = false) => {
        const tagObjects = isNegative ? selectedNegativeTags : selectedTags;
        tagObjects.value = tagObjects.value.map(t => t.en === tag.en && t.zh === tag.zh ? { ...t, weight } : t);
        localStorage.setItem(isNegative ? 'selectedNegativeTags' : 'selectedTags', JSON.stringify(tagObjects.value));  // 更新 localStorage
    };

    const cleanAllTags = (isNegative: boolean = false) => {
        const tagObjects = isNegative ? selectedNegativeTags : selectedTags;
        tagObjects.value = [];
        localStorage.removeItem(isNegative ? 'selectedNegativeTags' : 'selectedTags');  // 清空 localStorage
    }

    const setDefaultNegativeTags = () => {
        selectedNegativeTags.value = defaultNegativeTags.map(tag => ({ ...tag, weight: 1 }));
        if (!isNSFW.value) {
            selectedNegativeTags.value.push({
                "en": "nsfw",
                "zh": "不适合工作时查看(R18)",
                weight: 1
            });
        }

        localStorage.setItem('selectedNegativeTags', JSON.stringify(selectedNegativeTags.value));  // 更新 localStorage
    }

    return {
        selectedTags,
        selectedNegativeTags,
        isNegativeMode,
        isNSFW,
        addTag,
        removeTag,
        toggleTag,
        isTagChecked,
        updateTagWeight,
        cleanAllTags,
        isNegativeTag,
        isBothTag,
        setDefaultNegativeTags
    };
}