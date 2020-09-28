<template>
  <div class="diet-checkbox">
    <label :for="`diet-checkbox-${name}`">{{name}}</label>
    <input @change="onCheckboxClicked" v-model="checked" :id="`diet-checkbox-${name}`" type="checkbox">
  </div>
</template>


<script>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Checkbox extends Vue {
checked;

onCheckboxClicked() {
  let newVal = this.dietVal;

  if(this.checked){  
  console.log("Includes ", !this.$store.state.searchQueries.dietaryString.includes(this.dietVal));
  if(this.$store.state.searchQueries.dietaryString !== "&d="){
    newVal = "," + this.dietVal
  }
  if (!this.$store.state.searchQueries.dietaryString.includes(this.dietVal))
  {
    this.$store.commit("updateDietaryString", newVal);
  }
}
else{
  if(this.$store.state.searchQueries.dietaryString.includes(this.dietVal)){
    let oldVal = this.$store.state.searchQueries.dietaryString;
    newVal = oldVal.replace(this.dietVal, "");
    newVal = newVal.replace(/,+(?=,|$)/g, '');
    if(newVal.charAt(3) === ","){
      newVal = newVal.replace(/[, ]/, "")
    }
    this.$store.commit("replaceDietaryString", newVal)
  }
}
}

@Prop({
  type: String,
  required: true,
})
name;

@Prop({
  type: String,
  required: true,
})
dietVal;

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

