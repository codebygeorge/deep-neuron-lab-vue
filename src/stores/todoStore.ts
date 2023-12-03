import { ref, computed } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import { arrayMove } from "@/utils/helpers";
import { type Todo } from "@/shared/types/models/Todo";
import {
  addTodoItemApi,
  deleteTodoItemApi,
  getTodoItemsApi,
  updateTodoItemApi,
} from "@/api/todosApi";

type GroupedTodos = {
  hasTodos: boolean;
  noSearchResults: boolean;
  notCompletedFilteredTodos: Todo[];
  completedFilteredTodos: Todo[];
};

export const useTodoStore = defineStore("todo", () => {
  const searchValue = ref("");

  const isFetched = ref(true);
  const error = ref();
  const todos: Ref<Todo[]> = ref([]);

  function setSearch(newSearch: string) {
    searchValue.value = newSearch;
  }

  function addTodoToStore(data: Todo) {
    todos.value.push({
      ...data,
      id: Math.random(), // Any random id as fake API always returns 151.
      isLocal: true, // Indicate local use only
    });
  }

  function replaceTodoInStore(data: Todo, position?: "start" | "end") {
    const findIndex = todos.value.findIndex((todo) => todo.id === data.id);
    todos.value[findIndex] = data;
    if (position) {
      arrayMove(
        todos.value,
        findIndex,
        position === "start" ? 0 : todos.value.length - 1,
      );
    }
  }

  function removeTodoFromStore(id: number) {
    todos.value = todos.value.filter((todo) => todo.id !== id);
  }

  async function getTodos() {
    isFetched.value = false;
    try {
      const res = await getTodoItemsApi();
      todos.value = res.todos;
    } catch (err) {
      error.value = err;
    } finally {
      isFetched.value = true;
    }
  }

  async function addTodo() {
    try {
      const res = await addTodoItemApi({
        todo: "New",
        completed: false,
        userId: 5, // Random id as it is not used
      });
      addTodoToStore(res);
    } catch (err) {
      toast.error("Failed to create todo");
      throw err;
    }
  }

  async function toggleTodo(data: Todo) {
    const newTodoState = { ...data, completed: !data.completed };
    const position = newTodoState.completed ? "start" : "end";

    if (data?.isLocal) {
      replaceTodoInStore(newTodoState, position);
    } else {
      try {
        const res = await updateTodoItemApi(newTodoState);
        replaceTodoInStore(res, position);
      } catch (err) {
        toast.error("Failed to toggle todo");
        throw err;
      }
    }
  }

  async function editTodo(todoNewData: Todo) {
    if (todoNewData?.isLocal) {
      replaceTodoInStore(todoNewData);
    } else {
      try {
        const res = await updateTodoItemApi(todoNewData);
        replaceTodoInStore(res);
      } catch (err) {
        toast.error("Failed to save todo");
        throw err;
      }
    }
  }

  async function deleteTodo(todoData: Todo) {
    if (todoData?.isLocal) {
      removeTodoFromStore(todoData.id);
    } else {
      try {
        await deleteTodoItemApi(todoData);
        removeTodoFromStore(todoData.id);
      } catch (err) {
        toast.error("Failed to delete todo");
        throw err;
      }
    }
  }

  const filterGroupedTodos = computed<GroupedTodos>(() => {
    const initialState = {
      hasTodos: false,
      noSearchResults: false,
      notCompletedFilteredTodos: [],
      completedFilteredTodos: [],
    };
    if (!todos.value) return initialState;

    // Filter first with searchValue if persists
    let filteredTodos = [...todos.value];
    if (searchValue) {
      filteredTodos = todos.value.filter((todo) =>
        todo.todo.toLowerCase().includes(searchValue.value.toLowerCase()),
      );
    }

    // Group todos by 'completed' status
    const { completedFilteredTodos, notCompletedFilteredTodos } =
      filteredTodos.reduce<
        Pick<
          GroupedTodos,
          "notCompletedFilteredTodos" | "completedFilteredTodos"
        >
      >((acc, todo) => {
        if (todo.completed) {
          acc.completedFilteredTodos.push(todo);
        } else {
          acc.notCompletedFilteredTodos.push(todo);
        }
        return acc;
      }, initialState);

    return {
      hasTodos: todos.value.length > 0,
      noSearchResults: filteredTodos.length === 0,
      completedFilteredTodos,
      notCompletedFilteredTodos,
    };
  });

  // Init
  getTodos();

  return {
    isFetched,
    error,
    filterGroupedTodos,
    // Actions
    setSearch,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
  };
});
