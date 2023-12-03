<script lang="ts">
import Loader from "@/components/common/Loader.vue";
import ErrorBlock from "@/components/complex/ErrorBlock.vue";
import EmptyBlock from "@/components/complex/EmptyBlock.vue";
import SearchBar from "@/components/complex/SearchBar.vue";
import TodoAddButton from "@/components/complex/TodoAddButton.vue";
import TodoList from "@/components/complex/TodoList.vue";
import { useTodoStore } from "@/stores/todoStore";
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    Loader,
    ErrorBlock,
    EmptyBlock,
    SearchBar,
    TodoAddButton,
    TodoList,
  },
  setup() {
    const store = useTodoStore();
    const { isFetched, error, filterGroupedTodos } = storeToRefs(store);

    return {
      isFetched,
      error,
      filterGroupedTodos,
    };
  },
});
</script>

<template>
  <div class="todo-app-container" data-testid="todo-app-container">
    <div class="todo-app">
      <h1 class="todo-app-title">Todo List ...</h1>
      <SearchBar v-if="isFetched" />
      <div class="todo-app-body">
        <Loader v-if="!isFetched" />
        <ErrorBlock v-else-if="isFetched && !!error" />
        <template v-else>
          <TodoList :todos="filterGroupedTodos.notCompletedFilteredTodos" />
          <EmptyBlock
            :hasTodos="filterGroupedTodos.hasTodos"
            :noSearchResults="filterGroupedTodos.noSearchResults"
          />
          <TodoList :todos="filterGroupedTodos.completedFilteredTodos" />
        </template>
      </div>
      <TodoAddButton v-if="isFetched" />
    </div>
  </div>
</template>

<style scoped>
.todo-app-container {
  position: relative;
  height: 100vh;
  width: 100vw;
  background-color: rgb(53 133 113 / 87%);
  overflow: hidden;
}

.todo-app-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(53, 133, 113);
  background: -moz-radial-gradient(
    circle,
    rgba(53, 133, 113, 0) 0%,
    rgba(57, 128, 118, 0) 59%,
    rgba(103, 58, 183, 0.486453956582633) 100%
  );
  background: -webkit-radial-gradient(
    circle,
    rgba(53, 133, 113, 0) 0%,
    rgba(57, 128, 118, 0) 59%,
    rgba(103, 58, 183, 0.486453956582633) 100%
  );
  background: radial-gradient(
    circle,
    rgba(53, 133, 113, 0) 0%,
    rgba(57, 128, 118, 0) 59%,
    rgba(103, 58, 183, 0.486453956582633) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#358571",endColorstr="#673ab7",GradientType=1);
}

.todo-app {
  position: relative;
  height: 100vh;
  padding: 2.5%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: auto;
}

.todo-app-body {
  flex: 1 1 auto;
  overflow-y: auto;
}

.todo-app-title {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: "Open Sans", sans-serif;
}
</style>
