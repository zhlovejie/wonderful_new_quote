<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        <a-form-item label="类型名称">
          <a-input 
            v-if="!isView"
            placeholder="类型名称"
            v-decorator="['typeName',{initialValue:detail.typeName,rules: [{required: true,message: '请输入类型名称'}]}]"
            :allowClear="true"
            style="width:100%;"
          />
          <span v-if="isView">{{detail.typeName}}</span>
        </a-form-item>
        
        <table class="custom-table custom-table-border">
          <thead>
            <tr>
              <th>开始层数</th>
              <th>结束层数</th>
              <th>每层货道数量</th>
              <th>每个货道容量</th>
              <th v-if="!isView">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,idx) in structures" :key="item.key">
              <td>
                <a-form-item>
                  <a-input-number 
                    v-if="!isView"
                    style="width:100%;"
                    :min="0"
                    :max="99999"
                    :step="1"
                    v-decorator="[`structures.${idx}.startTier`,{initialValue:structures[idx]['startTier'] ,rules: [{required: true,message: '输入开始层数'}]}]"
                    @change="(e) => inputChange(e,'startTier',item.key)"
                  />
                  <span v-if="isView">{{structures[idx]['startTier']}}</span>
                </a-form-item>
              </td>
              <td>
                <a-form-item>
                  <a-input-number 
                    v-if="!isView"
                    style="width:100%;"
                    :min="0"
                    :max="99999"
                    :step="1"
                    v-decorator="[`structures.${idx}.endTier`,{initialValue:structures[idx]['endTier'] ,rules: [{required: true,message: '输入结束层数'}]}]"
                    @change="(e) => inputChange(e,'endTier',item.key)"
                  />
                  <span v-if="isView">{{structures[idx]['endTier']}}</span>
                </a-form-item>
              </td>
              <td>
                <a-form-item>
                  <a-input-number 
                    v-if="!isView"
                    style="width:100%;"
                    :min="0"
                    :max="99999"
                    :step="1"
                    v-decorator="[`structures.${idx}.aisleQuantity`,{initialValue:structures[idx]['aisleQuantity'] ,rules: [{required: true,message: '输入货道数量'}]}]"
                    @change="(e) => inputChange(e,'aisleQuantity',item.key)"
                  />
                  <span v-if="isView">{{structures[idx]['aisleQuantity']}}</span>
                </a-form-item>
              </td>
              <td>
                <a-form-item>
                  <a-input-number 
                    v-if="!isView"
                    style="width:100%;"
                    :min="0"
                    :max="99999"
                    :step="1"
                    v-decorator="[`structures.${idx}.aisleCapacity`,{initialValue:structures[idx]['aisleCapacity'] ,rules: [{required: true,message: '输入货道容量'}]}]"
                    @change="(e) => inputChange(e,'aisleCapacity',item.key)"
                  />
                  <span v-if="isView">{{structures[idx]['aisleCapacity']}}</span>
                </a-form-item>
              </td>
              <td v-if="!isView">
                <a href="javascript:void(0);" @click="actionHandler('del',item.key)">删除</a>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5">
                <h3 style="text-align:left;">货道总层数：{{aisleTier}}&nbsp;&nbsp;货道总数量：{{aisleQuantity}}</h3>
              </td>
            </tr>
          </tfoot>
        </table>
        <a-button v-if="!isView" style="width:100%;" type="dashed" icon="plus" @click="actionHandler('add')">新增规则</a-button>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { emergencyCabinetTypeAddOrUpdate, emergencyCabinetTypeDetail } from '@/api/contingencyManagement'
import moment from 'moment'

function uuid() {
  return Math.random().toString(32).slice(-10)
}

export default {
  name: 'AddForm',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      spinning: false,
      type: 'view',
      record: {},
      detail: {},
      //aisleQuantity:0,//货道数量
      //aisleTier:0,//货道层数
      structures: [],
    }
  },
  watch: {},
  computed: {
    isView() {
      return this.type === 'view'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    modalTitle() {
      return this.type === 'add' ? '新增' : this.type === 'view' ? '查看' : '编辑'
    },
    aisleQuantity() {
      //货道数量
      return this.structures.reduce((addr, item) => {
        if (item.endTier && item.startTier && item.aisleQuantity && item.aisleCapacity) {
          return addr + (item.endTier - item.startTier + 1) * item.aisleCapacity * item.aisleQuantity
        }
        return addr
      }, 0)
    },
    aisleTier() {
      //货道层数
      return this.structures.reduce((addr, item) => {
        if (item.endTier && item.startTier) {
          return addr + (item.endTier - item.startTier + 1)
        }
        return addr
      }, 0)
    },
  },
  methods: {
    moment,
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      that.detail = {}
      that.structures = []
      that.form.resetFields()
      await that.initData()
      if (type === 'view' || type === 'edit') {
        that.spinning = true
        let _detail = null
        try {
          _detail = await emergencyCabinetTypeDetail({ typeId: record.id }).then((res) => res.data)
          that.spinning = false
          that.detail = { ..._detail }
          that.structures = [...that.detail.structures].map(item =>{
            item.key = uuid()
            return item
          })
        } catch (err) {
          console.log(err)
          that.spinning = false
        }
      }
    },
    initData() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },

    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          //aisleQuantity:0,//货道数量
          //aisleTier:0,//货道层数

          values.aisleQuantity = that.aisleQuantity
          values.aisleTier = that.aisleTier
          console.log('Received values of form: ', values)
          that.spinning = true

          emergencyCabinetTypeAddOrUpdate(values)
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
    actionHandler(type, key) {
      let that = this
      let structures = [...that.structures]
      if (type === 'add') {
        structures.push({
          key: uuid(),
          startTier: undefined,
          endTier: undefined,
          aisleQuantity: undefined,
          aisleCapacity: undefined,
        })
      }

      if (type === 'del') {
        structures = structures.filter((item) => item.key !== key)
      }
      that.structures = structures
    },
    inputChange(val, field, key) {
      let that = this
      let structures = [...that.structures]
      let target = structures.find((item) => item.key === key)
      if (target) {
        target[field] = val
        that.structures = structures
      }
    },
  },
}
</script>
<style scoped>
.wdf-custom-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.wdf-custom-form-wrapper >>> .custom-table td {
  padding: 5px 10px;
  text-align: center;
}

.wdf-custom-form-wrapper >>> .ant-upload-list-picture-card .ant-upload-list-item-info::before {
  left: 0;
}
</style>
