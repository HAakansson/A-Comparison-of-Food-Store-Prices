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

  // TODO: send "gluten"/value to store...
console.log("CLICKED", this.checked);
//console.log("val", this.dietVal);


let newVal = this.dietVal + ",";
console.log(newVal);

console.log("Inclues ", !this.$store.state.searchQueries.dietaryString.includes(this.dietVal));

if (this.checked && !this.$store.state.searchQueries.dietaryString.includes(this.dietVal))
{
  this.$store.commit("updateDietaryString", newVal);
}

//console.log("check", event.checked);

}

// @Watch("search")
//   onSearchStringChanged(newVal) {
//     this.$store.state.searchQueries.searchString = "?s=";
//     this.$store.state.searchQueries.searchString += newVal;
//   }
// }


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

