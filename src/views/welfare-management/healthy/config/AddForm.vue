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
        <a-form-item label="部门">
          <a-select
            :disabled="isEdit"
            placeholder="选择部门"
            @change="depChangeHandler"
            v-decorator="['depId',{rules: [{required: true,message: '选择部门'}]}]"
            :allowClear="true"
          >
            <a-select-option
              v-for="item in depSelectDataSource"
              :key="item.id"
              :value="item.id"
            >{{item.departmentName}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="岗位">
          <a-select
            placeholder="选择岗位"
            v-decorator="['stationId',{rules: [{required: true,message: '选择岗位'}]}]"
            :allowClear="true" 
            @change="postChangeHandler"
          >
            <a-select-option
              v-for="item in postSelectDataSource"
              :key="item.id"
              :value="item.id" 
            >{{item.stationName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="入职体检">
          <a-select 
            placeholder="入职体检"
            v-decorator="['entryCheck',{initialValue: 1, rules: [{required: true,message: '请选择入职体检'}]}]"
          >
            <a-select-option :value="1">有</a-select-option>
            <a-select-option :value="0">无</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="工龄体检" v-show="!isManagerCheck">
          <a-select 
            placeholder="工龄体检"
            v-decorator="['ageCheck',{initialValue: isManagerCheck ? 0 : 1, rules: [{required: true,message: '请选择工龄体检'}]}]"
          >
            <a-select-option :value="1">有</a-select-option>
            <a-select-option :value="0">无</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="管理层体检" v-show="isManagerCheck">
          <a-select 
            placeholder="管理层体检"
            v-decorator="['managerCheck',{initialValue: !isManagerCheck ? 0 : 1, rules: [{required: true,message: '请选择管理层体检'}]}]"
          >
            <a-select-option :value="1">有</a-select-option>
            <a-select-option :value="0">无</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="是否为特殊岗位"
        >
          <a-radio-group v-decorator="['isSpecial', {initialValue: 0, rules: [{required: true}]}]" style="width: 100%">
            <a-radio :value="0">否</a-radio>
            <a-radio :value="1">是</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList //获取所有岗位
} from '@/api/systemSetting'
import {
  checkupSettingAddOrUpdate
} from '@/api/welfareManagement'
export default {
  name: 'welfare-management-healthy-config-AddForm',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'welfare-management-healthy-config-AddForm' }),
      visible: false,
      spinning: false,
      type: 'view',
      depSelectDataSource: [],
      postSelectDataSource: [],
      record: {},
      isManagerCheck:false
    }
  },
  computed: {
    modalTitle() {
      return this.type === 'add' ? '新增' : '编辑'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    }
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
          that.postChangeHandler(that.record.stationId)
        })
      }
    },
    initData() {
      let that = this
      let queue = []
      let task1 = function() {
        return departmentList().then(res => (that.depSelectDataSource = res.data))
      }
      queue.push(task1())
      if (that.isEdit) {
        let task2 = function() {
          return that.depChangeHandler(that.record.depId)
        }
        queue.push(task2())
      }
      return Promise.all(queue)
    },
    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if (that.isEdit) {
            values.id = that.record.id
          }

          if(that.isManagerCheck){
            values.ageCheck = 0
          }
          if(!that.isManagerCheck){
            values.isManagerCheck = 0
          }
          that.spinning = true
          checkupSettingAddOrUpdate(values)
            .then(res => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.depSelectDataSource = []
      this.postSelectDataSource = []
      this.$nextTick(() => (this.visible = false))
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then(res => {
        that.postSelectDataSource = res.data
      })
    },
    postChangeHandler(post_id){
      let target = this.postSelectDataSource.find(item => item.id === post_id)
      if(target){
        console.log(target)
        this.isManagerCheck = target.level === 'A'
      }
    }
  }
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item{
  display:flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label{
  width:125px;
}
.ant-form-item >>> .ant-form-item-control-wrapper{
  flex:1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  text-align: left;
}
</style>
