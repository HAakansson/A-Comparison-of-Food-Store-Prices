<template>
  <div class="class-based-tutorial"></div>
</template>

<script>
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
// Vue and Component must always be imported from the vue-property-decorater. If you are going to need Props and Watches, it must be imported from the vue-property-decorator.

// @Component must always be written directly above export default.
@Component({
  // In this components object, you must add the nested components that you use.
  components: {
    //Some Component.
  },
})
export default class ClassBasedTutorial extends Vue {
  // This is a data variable
  someData = 5000;

  // This is a computed variable.
  get someMoreData() {
    return someMoreData;
  }

  // This is a prop. Validation can be made inside the parentheses.
  @Prop({
    type: String,
    required: true,
  })
  somePropData;

  // This is a watcher. The variable to be watched is written as a string, and extra configs is written in the settings object as a second argument.
  @Watch("someData", { deep: true })
  onSomeData(oldVal, newVal) {
    // The method to be run when the variable changes must be declared directly underneath the @Watch.
    console.log(oldVal, newVal);
    this.someData = newVal;
  }

  // A method is just written directly in the script tag.
  goToSomOtherPage() {
    // Some code here.
  }

  // Life cycle hooks are written as fuctions.
  created() {}
  mounted() {}
  beforeDestroy() {}
  // ...and so on.
}
</script>

// Always add attribute lang and set to "scss" for sass, and always use scoped.
<style lang="scss" scoped></style>
