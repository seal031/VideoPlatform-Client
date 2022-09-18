<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 400px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import {
  onBeforeUnmount,
  shallowRef,
  computed,
} from "vue";


export default {
  name: "RtEditor2",
  components: { Editor, Toolbar },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  emit: ["update:modelValue"],
  setup(props, { emit }) {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef();

    // 内容 HTML
    const toolbarConfig = {};
    const editorConfig = {
      placeholder: "请输入内容...",
      MENU_CONF: {
        uploadImage: {
          server: "/upload",
          maxFileSize: 8 * 1024 * 1024, // 8M
          fieldName: "file",
          timeout: 3 * 1000, // 3 秒
        },
      },
    };

    const valueHtml = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit("update:modelValue", value);
      },
    });

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.destroy();
    });

    const handleCreated = (editor) => {
      editorRef.value = editor; // 记录 editor 实例，重要！
    };

    return {
      editorRef,
      valueHtml,
      mode: "default", // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
    };
  },
};
</script>
