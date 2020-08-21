<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-add-form-wrapper">
        <a-form-item label="使用人">
          <DepUserSelect @change="depUserSelectChange"/>
          
          <a-input type="hidden" v-decorator="['userId',{rules: [{ required: true, message: '选择使用人' }]}]" />
          <a-input type="hidden" v-decorator="['departmentId']" />
        </a-form-item>

        <a-form-item label="资产归属">
          <a-select
            placeholder="选择资产归属"
            v-decorator="['beyondType', {initialValue:record.beyondType || '2', rules: [{ required: true, message: '选择资产归属' }]}]"
            :allowClear="true"
            style="width:100%;"
          >
            <a-select-option :value="1">个人</a-select-option>
            <a-select-option :value="2">部门</a-select-option>
            <!-- <a-select-option :value="3">资产库</a-select-option> -->
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { getDictionaryList } from '@/api/workBox'
import { oaAssertsInfoAssertsDraw } from '@/api/assetManagement'
import DepUserSelect from '@/components/CustomerList/DepUserSelect'
import moment from 'moment'
export default {
  name: 'asset-management-management-AddForm',
  components:{
    DepUserSelect
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'asset-management-management-AddForm' }),
      visible: false,
      spinning: false,
      type: 'view',
      assetTypeList:[],
      record: {},
      isManagerCheck: false,
    }
  },
  computed: {
    modalTitle() {
      //return this.type === 'add' ? '新增' : '编辑'
      return "领取"
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
  },
  methods: {
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)

      await that.initData()
      if (that.isEdit) {
        that.$nextTick(() => {
          that.form.setFieldsValue(Object.assign({}, that.record))
        })
      }
    },
    initData() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },
    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          values.assertsId = that.record.id
          that.spinning = true
          oaAssertsInfoAssertsDraw(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    depUserSelectChange(depId,userId){
      let that = this
      that.$nextTick(() =>{
        that.form.setFieldsValue({
          departmentId:depId,
          userId:userId
        })
      })
    }
  },
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 100px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  text-align: left;
}
</style>
