import { ref } from 'vue';

const selectedTags = ref([]);

export function useTagStore() {
    const addTag = (tag) => {
        // 通过 en 和 zh 字段判断标签是否已存在
        const existingTag = selectedTags.value.find(t => t.en === tag.en && t.zh === tag.zh);
        if (!existingTag) {
            selectedTags.value.push({ ...tag, weight: 1 });  // 默认权重为1
        }
    };

    const removeTag = (tag) => {
        // 基于 en 和 zh 字段删除标签
        selectedTags.value = selectedTags.value.filter(t => !(t.en === tag.en && t.zh === tag.zh));
    };

    const toggleTag = (tag) => {
        const existingTag = selectedTags.value.find(t => t.en === tag.en && t.zh === tag.zh);
        if (existingTag) {
            removeTag(tag);
        } else {
            addTag(tag);
        }
    };

    const isTagChecked = (tag) => {
        // 检查标签是否存在
        return selectedTags.value.some(t => t.en === tag.en && t.zh === tag.zh);
    };

    const updateTagWeight = (tag, weight) => {
        selectedTags.value = selectedTags.value.map(t => t.en === tag.en && t.zh === tag.zh ? { ...t, weight } : t);
    };


    return {
        selectedTags,
        addTag,
        removeTag,
        toggleTag,
        isTagChecked,
        updateTagWeight,
    };
}