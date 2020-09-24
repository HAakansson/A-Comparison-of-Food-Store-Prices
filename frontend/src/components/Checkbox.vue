<template>
  <div class="diet-checkbox">
    <label :for="`diet-checkbox-${name}`">{{name}}</label>
    <input :id="`diet-checkbox-${name}`" type="checkbox">
  </div>
</template>


<script>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Checkbox extends Vue {



@Prop({
  type: String,
  required: true,
})
name;

}

</script>

<style scoped>

.diet-checkbox {
  display: flex;
  margin: 0 5px;
}

.diet-checkbox input {
    cursor: pointer;
}

.diet-checkbox label {
  cursor: pointer;
}
</style>

