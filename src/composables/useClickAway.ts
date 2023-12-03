import { ref, onMounted, onUnmounted, watch } from "vue";

const events = ["mousedown", "pointerdown", "touchstart"];

export const useClickAway = (onClickAway, disabledByDefault = false) => {
  const elementRef = ref(null);
  const disabled = ref(disabledByDefault);

  const disable = () => {
    disabled.value = true;
  };

  const enable = () => {
    disabled.value = false;
  };

  const onAway = (e) => {
    if (elementRef.value && !elementRef.value.contains(e.target)) {
      onClickAway();
    }
  };

  const addEventListeners = () =>
    events.forEach((event) => document.addEventListener(event, onAway));

  const removeEventListeners = () =>
    events.forEach((event) => document.removeEventListener(event, onAway));

  const handleEventsToggle = () => {
    if (!elementRef.value) return;
    if (disabled.value) {
      removeEventListeners();
    } else {
      addEventListeners();
    }
  }

  watch(disabled, () => {
    handleEventsToggle();
  });

  onMounted(() => {
    handleEventsToggle();
  });

  onUnmounted(() => {
    removeEventListeners();
  });

  return { elementRef, disable, enable };
};
