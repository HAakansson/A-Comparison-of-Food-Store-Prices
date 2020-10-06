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

<style lang="css" scoped>
.circle-spinner {
  height: 150px !important;
  width: 150px !important;
}
</style>
