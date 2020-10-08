<template>
  <CircleSpinner class="circle-spinner"></CircleSpinner>
</template>

<script>
import { Circle } from "vue-loading-spinner";

export default {
  components: {
    CircleSpinner: Circle,
  },
};
</script>

<style lang="css" scoped></style>
