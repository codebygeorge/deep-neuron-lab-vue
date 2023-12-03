<script lang="ts">
import { defineComponent, ref } from "vue";
import Loader from "@/components/common/Loader.vue";
import { useTodoStore } from "@/stores/todoStore";

export default defineComponent({
  components: {
    Loader,
  },
  setup() {
    const { addTodo } = useTodoStore();
    const isLoading = ref(false);

    const handleAdd = async () => {
      isLoading.value = true;
      try {
        await addTodo();
      } catch (err) {
        // error
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isLoading,
      handleAdd,
    };
  },
});
</script>

<template>
  <button
    class="add-button"
    type="button"
    aria-label="Add todo"
    data-testid="add-button"
    @click="handleAdd"
    :disabled="isLoading"
  >
    <Loader v-if="isLoading" />
    <template v-else>
      <font-awesome-icon icon="fa-solid fa-circle-plus" />
      <span>Todo</span>
    </template>
  </button>
</template>

<style scoped>
.add-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: white;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  transition: background-color 150ms;
  width: 100%;
  margin-top: 10px;
  height: 50px;
  flex-shrink: 0;
  font-family: "Open Sans", sans-serif;
}

.add-button span {
  font-size: 1.25rem;
  font-weight: bold;
}

.add-button svg {
  padding-right: 10px;
  font-size: 1.75rem;
}

.add-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.add-button:disabled {
  background-color: rgba(255, 255, 255, 0.25);
}
</style>
