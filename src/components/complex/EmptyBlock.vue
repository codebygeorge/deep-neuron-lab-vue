<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    hasTodos: Boolean,
    noSearchResults: Boolean,
  },
});
</script>

<template>
  <div
    v-if="!hasTodos || (hasTodos && noSearchResults)"
    class="empty-list"
    data-testid="empty-block"
  >
    <span>{{
      hasTodos && noSearchResults ? "No todos found" : "You have no todos!"
    }}</span>
  </div>
  <hr v-else class="todo-app-list-divider" />
</template>

<style scoped>
.empty-list {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.empty-list span {
  color: white;
  font-size: 1.5rem;
  font-family: "Open Sans", sans-serif;
}

.todo-app-list-divider {
  margin: 10px 30px;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.25);
  border: none;
}
</style>
