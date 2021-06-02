<template>
  <div>
    <a-button type="primary" @click="btnHandler">test</a-button>
    <AddForm ref="addForm" />
  </div>
</template>

<script>
import AddForm from './AddForm'
export default {
  name:'product-process-management_mould-management',
  components:{
    AddForm
  },
  data(){
    return {

    }
  },
  methods:{
    btnHandler(){
      this.$refs.addForm.query('add',null)
    }
  }
}
</script>
