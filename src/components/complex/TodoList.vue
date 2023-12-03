<script lang="ts">
import { defineComponent, PropType } from "vue";
import TodoItem from "@/components/complex/TodoItem.vue";
import { Todo } from "@/shared/types/models/Todo";

export default defineComponent({
  props: {
    todos: {
      type: Object as PropType<Todo[]>,
      required: false,
    },
  },
  components: {
    TodoItem,
  },
});
</script>

<template>
  <div data-testid="todo-list" class="todo-list-container">
    <ul class="todo-list">
      <TodoItem v-for="todo in todos" :key="todo.id" :data="todo" />
    </ul>
  </div>
</template>

<style scoped>
.todo-list {
  border-radius: 4px;
}
</style>
