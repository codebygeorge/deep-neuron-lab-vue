<script lang="ts">
import { ref, PropType, defineComponent, nextTick } from "vue";
import { computed, watch } from "vue";
import type { Ref } from "vue";
import { useTodoStore } from "@/stores/todoStore";
import { type Todo } from "@/shared/types/models/Todo";
import Loader from "@/components/common/Loader.vue";
import Checkbox from "@/components/common/Checkbox.vue";
import { useDebouncedRef } from "@/composables/useDebouncedRef";
import { useAutosizeTextarea } from "@/composables/useAutosizeTextarea";
import { useClickAway } from "@/composables/useClickAway";

export default defineComponent({
  components: {
    Checkbox,
    Loader,
  },
  props: {
    data: {
      type: Object as PropType<Todo>,
      required: true,
    },
  },
  setup(props) {
    const { /* id, */ todo, completed /* , userId */ } = props.data;

    const { toggleTodo, editTodo, deleteTodo } = useTodoStore();

    const newValue = useDebouncedRef(todo, 500, false);
    const newCompleted = ref(completed);
    const isWaiting = ref(false);
    const isLoading = ref(false);
    const isEditing = ref(false);
    const isEdited = computed(() => newValue.value !== props.data.todo);
    const toggleTimers: Ref<number | undefined> = ref(undefined);

    const { textAreaRef, handleResize } = useAutosizeTextarea();
    const {
      elementRef: itemRef,
      disable: disableClickAway,
      enable: enableClickAway,
    } = useClickAway(closeEditState, true);

    watch(newValue, async (newTextareaValue) => {
      isLoading.value = true;
      try {
        await editTodo({
          ...props.data,
          todo: newTextareaValue,
        });
      } catch (err) {
        // error
      } finally {
        isLoading.value = false;
      }
    });

    function openEditState() {
      if (!isEditing.value && !isLoading.value) {
        if (completed === newCompleted.value) {
          enableClickAway();
          isEditing.value = true;
          nextTick(() => {
            textAreaRef.value?.focus();
          });
        }
      }
    }

    function closeEditState() {
      if (isEditing.value) {
        disableClickAway();
        isEditing.value = false;
      }
    }

    const handleToggle = async () => {
      newCompleted.value = !newCompleted.value;
      isEditing.value = false;

      if (toggleTimers.value) {
        isWaiting.value = false;
        clearTimeout(toggleTimers.value as number);
        toggleTimers.value = undefined;
      } else {
        isWaiting.value = true;
        toggleTimers.value = setTimeout(async () => {
          isWaiting.value = false;
          isLoading.value = true;
          try {
            await toggleTodo(props.data);
          } catch (err) {
            newCompleted.value = !newCompleted.value;
          } finally {
            isLoading.value = false;
          }
          toggleTimers.value = undefined;
        }, 2300);
      }
    };

    const handleDelete = async () => {
      isEditing.value = false;
      isLoading.value = true;
      try {
        await deleteTodo(props.data);
      } catch (err) {
        // error
      } finally {
        isLoading.value = false;
      }
    };

    const handleFocus = (e) => {
      e.currentTarget.setSelectionRange(
        e.currentTarget.value.length,
        e.currentTarget.value.length,
      );
    };

    return {
      itemRef,
      completed,
      isEdited,
      isEditing,
      isWaiting,
      isLoading,
      newValue,
      newCompleted,
      textAreaRef,
      openEditState,
      handleResize,
      handleFocus,
      handleToggle,
      handleDelete,
    };
  },
});
</script>

<template>
  <li
    ref="itemRef"
    :class="{
      'todo-item': true,
      completed,
      'not-completed': !completed,
      'is-editing': isEditing,
      'is-loading': isLoading,
      'is-status-changed': completed !== newCompleted,
    }"
    data-testid="todo-item"
  >
    <div class="todo-item-check">
      <Checkbox
        data-testid="toggle-checkbox"
        :checked="newCompleted"
        :disabled="isEdited || isLoading"
        @change="handleToggle"
      />
    </div>

    <div
      class="todo-item-content"
      aria-label="Edit todo"
      role="button"
      @click="openEditState"
      @keydown="openEditState"
    >
      <textarea
        data-testid="todo-item-textarea"
        rows="1"
        ref="textAreaRef"
        v-model="newValue"
        @focus="handleFocus"
        @input="handleResize"
        :disabled="!isEditing || isWaiting"
      />
    </div>

    <div class="todo-item-actions">
      <button
        data-testid="delete-button"
        class="delete-button"
        type="button"
        aria-label="Delete todo"
        @click="handleDelete"
        :disabled="isEdited || isLoading || isWaiting"
      >
        <Loader v-if="isLoading" />
        <font-awesome-icon v-else icon="fa-solid fa-xmark" />
      </button>
    </div>

    <div v-if="isWaiting" class="waiting-line" />
  </li>
</template>

<style scoped>
.todo-item {
  position: relative;
  display: flex;
  padding: 0 30px 0 45px;
  margin-bottom: 0;
  background-color: rgba(227, 243, 252, 0.4);
  overflow: hidden;
  transition: background-color 100ms;
}

.todo-item:first-of-type {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.todo-item:last-of-type {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.todo-item-check {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.todo-item-content {
  position: relative;
  cursor: pointer;
  padding: 10px;
  transition: padding 300ms cubic-bezier(0.4, 0, 1, 1);
  flex: 1 1 auto;
  will-change: padding;
  min-height: 40px;
  outline: none;
}

.todo-item-content::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 15px;
  height: 1px;
  width: calc(100% - 30px);
  background-color: rgba(255, 255, 255, 0.5);
}

.todo-item:last-of-type .todo-item-content::after {
  display: none;
}

.todo-item-content textarea {
  box-sizing: border-box;
  border: none;
  resize: none;
  width: 100%;
  background-color: transparent;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25rem;
  letter-spacing: 0;
  color: white;
  outline: none;
  font-family: "Open Sans", sans-serif;
}

.todo-item-content textarea:disabled {
  pointer-events: none;
  -webkit-appearance: none;
}

.todo-item-actions {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  opacity: 0;
  transition: all 100ms;

  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-button {
  color: white;
  width: 40px;
  height: 40px;
  font-size: 1.25rem;
}

.delete-button:disabled {
  opacity: 0.6;
}

.delete-button:hover {
  color: white;
}

.waiting-line {
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #7634ea;
  transform: translateX(-100%);
  animation: loading 2s forwards 300ms;
}

/* State styles */

.todo-item:hover {
  background-color: rgba(227, 243, 252, 0.6);
}

.todo-item.is-status-changed {
  user-select: none;
}

.todo-item.is-status-changed .todo-item-content,
.todo-item.is-editing .todo-item-content,
.todo-item.is-loading .todo-item-content {
  cursor: default;
}

.todo-item.is-editing .todo-item-content::after {
  display: none;
}

.todo-item.not-completed {
}

.todo-item.not-completed:hover {
}

.todo-item.completed {
  opacity: 0.7;
}

.todo-item.completed:hover {
  background-color: #4de59d80;
}

.todo-item.is-editing {
  background-color: rgba(227, 243, 252, 0.2);
}

.todo-item.is-editing .todo-item-content {
  padding-bottom: 15px;
  transition: padding 300ms cubic-bezier(0, 0, 0.2, 1);
}

.todo-item:not(.is-status-changed):hover .todo-item-actions,
.todo-item.is-editing .todo-item-actions,
.todo-item.is-loading .todo-item-actions {
  opacity: 1;
}

@keyframes loading {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
