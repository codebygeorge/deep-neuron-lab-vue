<template>
  <div class="error-block" data-testid="error-block">
    <span>Something went wrong! Try again later.</span>
  </div>
</template>

<style scoped>
.error-block {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.error-block span {
  color: white;
  font-size: 1.5rem;
  font-family: "Open Sans", sans-serif;
}
</style>
