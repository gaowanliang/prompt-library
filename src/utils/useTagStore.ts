import { ref } from 'vue';
import type { Tag, TagWithWeight } from '@/types';
import { event } from 'vue-gtag';

const selectedTags = ref<TagWithWeight[]>([]);
const isNSFW = ref(false);

// 从 localStorage 恢复 selectedTags
const savedTags = localStorage.getItem('selectedTags');
if (savedTags) {
    selectedTags.value = JSON.parse(savedTags);
}

export function useTagStore() {
    const addTag = (tag: Tag) => {
        const existingTag = selectedTags.value.find(t => t.en === tag.en && t.zh === tag.zh);
        if (!existingTag) {
            selectedTags.value.push({ ...tag, weight: 1 });
            localStorage.setItem('selectedTags', JSON.stringify(selectedTags.value));  // 更新 localStorage

            event("add_prompt", {
                event_category: "prompt",
                event_label: tag.en,
                value: 1
            });
        }
    };

    const removeTag = (tag: Tag) => {
        selectedTags.value = selectedTags.value.filter(t => !(t.en === tag.en && t.zh === tag.zh));
        localStorage.setItem('selectedTags', JSON.stringify(selectedTags.value));  // 更新 localStorage

        event("remove_prompt", {
            event_category: "prompt",
            event_label: tag.en,
            value: 1
        });
    };

    const toggleTag = (tag: Tag) => {
        const existingTag = selectedTags.value.find(t => t.en === tag.en && t.zh === tag.zh);
        if (existingTag) {
            removeTag(tag);
        } else {
            addTag(tag);
        }
    };

    const isTagChecked = (tag: Tag) => {
        return selectedTags.value.some(t => t.en === tag.en && t.zh === tag.zh);
    };

    const updateTagWeight = (tag: Tag, weight: number) => {
        selectedTags.value = selectedTags.value.map(t => t.en === tag.en && t.zh === tag.zh ? { ...t, weight } : t);
        localStorage.setItem('selectedTags', JSON.stringify(selectedTags.value));  // 更新 localStorage
    };

    const cleanAllTags = () => {
        selectedTags.value = [];
        localStorage.removeItem('selectedTags');  // 清空 localStorage
    }

    return {
        selectedTags,
        isNSFW,
        addTag,
        removeTag,
        toggleTag,
        isTagChecked,
        updateTagWeight,
        cleanAllTags
    };
}