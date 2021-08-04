<template>
  <a-modal
    :title="modalTitle"
    :width="900"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-form :form="form" class="approval-modal-form-wrapper">
      <div style="color: red; margin-bottom: 20px">操作说明： 输入商品或型号点击添加即可，注意品牌与型号一一对应</div>
      <table class="custom-table custom-table-border">
        <tr>
          <th>品牌信息</th>
          <th>型号信息</th>
          <th>操作</th>
        </tr>
        <tr v-for="item in todayList" :key="item._key">
          <td>
            <a-form-item>
              <a-input v-model="item.brandName" placeholder="请输入品牌" />
            </a-form-item>
          </td>
          <td>
            <div class="dep-user-mul-select-wrapper">
              <div class="dep-user-mul-select__content">
                <div style="display: flex">
                  <a-form-item>
                    <a-input v-model="item.modelName" style="width: 150px; margin-right: 10px" placeholder="型号信息" />
                  </a-form-item>
                  <a-form-item>
                    <a-button type="primary" style="margin-right: 10px" @click="userAction(item, 'add')">添加</a-button>
                  </a-form-item>
                  <a-form-item>
                    <a-button type="primary" @click="userAction(item, 'reset')">重选</a-button>
                  </a-form-item>
                </div>
              </div>
              <div class="dep-user-mul-select__views">
                <div style="text-align: center" v-if="item.manageBrandModels.length > 0">
                  <a-tag
                    v-for="items in item.manageBrandModels"
                    :key="items._key"
                    style="margin-top: 7px"
                    :closable="true"
                    @close.prevent="(e) => removeTag(item, items, e)"
                    >{{ items.modelName }}</a-tag
                  >
                </div>
              </div>
            </div>
          </td>
          <td>
            <a-form-item>
              <a href="javascript:void(0);" @click="delItem(item._key)">删除</a>
            </a-form-item>
          </td>
        </tr>
      </table>
      <a-button style="width: 100%" type="dashed" icon="plus" @click="addItem()">添加品牌及型号</a-button>
    </a-form>
  </a-modal>
</template>

<script>
function makeUUID() {
  return Math.random().toString(32).slice(-10)
}
export default {
  name: 'ApprovalModal',
  data() {
    return {
      visible: false,
      todayList: [],
      form: this.$form.createForm(this, { name: 'ApprovalModal' }),
    }
  },
  watch: {
    manageBrandModels() {
      this.$emit('change', [...this.manageBrandModels])
    },
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改供应物料品牌型号信息'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : this.isView5 ? '查看' : '新增'
      return `${txt}供应物料品牌型号信息`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    isEdit() {
      //审核
      return this.type === 'edit'
    },
    isDisabled() {
      return this.isView || this.isEdit || this.isView5
    },
  },
  methods: {
    addItem() {
      this.todayList.push({
        _key: makeUUID(),
        brandName: undefined,
        manageBrandModels: [],
        modelName: null,
      })
    },
    delItem(index) {
      let _d = [...this.todayList]
      _d = _d.filter((i) => i._key !== index)
      this.todayList = [..._d]
    },
    query(record) {
      console.log(record)
      let that = this
      that.todayList = []
      that.todayList = that.$_.cloneDeep(record.manageBrands)
      that.visible = true
    },
    userAction(model, type) {
      let that = this
      let todayList = [...that.todayList]
      let target = todayList.find((item) => item._key === model._key)
      if (type === 'add') {
        // if (model.manageBrandModels.find((item) => item.modelName === model.modelName)) {
        //   that.$message.info(`型号已包括【${model.modelName}】,不能重复添加`)
        //   return
        // }
        target.manageBrandModels = [
          ...target.manageBrandModels,
          Object.assign({}, { modelName: model.modelName }, { keys: makeUUID() }),
        ]
      } else if (type === 'reset') {
        target.manageBrandModels = []
      }
      that.todayList = todayList
    },
    removeTag(react, i, e) {
      //   debugger
      //   e.stopPropagation && e.stopPropagation()
      //   e.preventDefault && e.preventDefault()

      let todayList = [...this.todayList]
      let arr = todayList.find((u) => u._key === react._key)
      arr.manageBrandModels = arr.manageBrandModels.filter((p) => p.keys !== i.keys)
      this.todayList = todayList
    },
    handleOk() {
      let that = this
      that.$emit('brandChange', that.todayList)
      that.visible = false
    },
    handleCancel() {
      let that = this
      that.todayList = []
      that.visible = false
    },
  },
}
</script>
<style scoped>
.dep-user-mul-select__views {
  border: 2px dashed #ddd;
  padding: 10px 15px 15px 15px;
  text-align: left;
}
</style>