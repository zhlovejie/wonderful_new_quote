<template>
  <div class="editable-cell">
    <div class="editable-cell-input-wrapper">
      <a-input :value="value" @change="handleChange" class="input-wrapper" />
      <!-- <a-icon type="check" class="editable-cell-icon-check" /> -->
    </div>
    <!-- <div v-else class="editable-cell-text-wrapper">
      {{ value === undefined || value === null ? '' : value }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'EditableCell',
  props: {
    text: {
      type: String,
      default: '',
    },
  },
  watch: {
    text() {
      this.value = this.text
    },
  },
  data() {
    return {
      value: this.text,
      editable: false,
    }
  },
  methods: {
    handleChange(e) {
      const value = e.target.value
      this.value = value
      this.$emit('change', this.value)
    },
    // check () {
    //   this.editable = false

    // },
    edit() {
      this.editable = true
    },
  },
}
</script>

<style scoped>
.editable-cell-input-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.editable-cell-input-wrapper .input-wrapper {
  flex: 1;
}
.editable-cell-input-wrapper .editable-cell-icon-check {
  margin-left: 5px;
  padding: 5px;
  cursor: pointer;
}
</style>
