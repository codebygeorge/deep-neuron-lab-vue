<script lang="ts">
import { defineComponent, watch } from "vue";
import { useTodoStore } from "@/stores/todoStore";
import { useDebouncedRef } from "@/composables/useDebouncedRef";

export default defineComponent({
  setup() {
    const { setSearch } = useTodoStore();

    // Apply debounced search
    const inputValue = useDebouncedRef("", 500, false);
    watch(inputValue, (newInputValue) => {
      setSearch(newInputValue);
    });

    return {
      inputValue,
    };
  },
});
</script>

<template>
  <div class="search-bar">
    <input
      type="text"
      placeholder="Search"
      data-testid="search-input"
      v-model="inputValue"
    />
  </div>
</template>

<style scoped>
.search-bar {
  width: 100%;
  margin-bottom: 10px;
}

.search-bar input {
  width: 100%;
  padding: 12px 20px;
  outline: none !important;
  border: none;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
  opacity: 0.65;
  transition: opacity 200ms;
  font-family: "Open Sans", sans-serif;
}

.search-bar input:active,
.search-bar input:focus {
  opacity: 1;
}
</style>
