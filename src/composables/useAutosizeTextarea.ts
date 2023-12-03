import { ref, onMounted } from "vue";

// TODO -> Note: resize event is currently not handled.

export const useAutosizeTextarea = () => {
  const textAreaRef = ref(null);

  const handleResize = () => {
    if (textAreaRef.value) {
      textAreaRef.value.style.height = "0px";
      const scrollHeight = textAreaRef.value.scrollHeight;
      textAreaRef.value.style.height = `${scrollHeight}px`;
    }
  };

  onMounted(() => {
    handleResize();
  });

  return {
    textAreaRef,
    handleResize,
  };
};
