<template>

  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        class="routine-addform-wrapper-baseInnerData"
      >
        <h3>收件人信息</h3>
        <table class="custom-table custom-table-border">
          <tbody>
            <tr>
              <td style="width:150px;">
                <span class="icon-required">客户名称</span>
              </td>
              <td>
                <a-form-model-item prop="customerName">
                  <a-input
                    v-if="isAdd"
                    v-model="form.customerName"
                    read-only="read-only"
                    @click="openModel('customerList',{__type:1})"
                  ></a-input>
                  <span v-else>
                    {{form.customerName}}
                  </span>
                </a-form-model-item>
              </td>
            </tr>
            <tr>
              <td style="width:150px;">
                <span class="icon-required">寄件人姓名</span>
              </td>
              <td>
                <a-form-model-item prop="sender">
                  <a-input
                    v-if="isAdd"
                    v-model="form.sender"
                  />
                  <span v-else>
                    {{form.sender}}
                  </span>
                </a-form-model-item>
              </td>
            </tr>

            <tr>
              <td style="width:150px;">
                <span class="icon-required">联系电话</span>
              </td>
              <td>
                <a-form-model-item prop="phone">
                  <a-input
                    v-if="isAdd"
                    v-model="form.phone"
                  />
                  <span v-else>
                    {{form.phone}}
                  </span>
                </a-form-model-item>
              </td>
            </tr>
            <tr>
              <td style="width:150px;">
                <span class="icon-required">寄件地址</span>
              </td>
              <td>

                <a-form-model-item prop="address">
                  <div v-if="isAdd">
                    <CaseCadeArea
                      ref="caseCadeArea"
                      :area="form.area || []"
                      @change="areaChange"
                    />
                    <a-input v-model="form.address" />
                  </div>
                  <span v-else>
                    {{form.areaName}} {{form.detailAdress}}
                  </span>
                </a-form-model-item>
              </td>
            </tr>
          </tbody>
        </table>

        <h3>配件清单</h3>
        <a-form-model-item
          prop="mailNum"
          label="邮寄编号"
        >
          <a-input
            v-if="isAdd"
            v-model="form.mailNum"
            read-only="read-only"
            @click="() => {
            if(!form.customerId){
              $message.info('请选择客户名称')
              return
            }
            openModel('postList',{customerId:form.customerId,__type:1})

          }"
          ></a-input>
          <span v-else>{{form.mailNum}}</span>
        </a-form-model-item>

        <a-table
          :columns="innerColumns"
          :dataSource="form.materialList"
          :pagination="false"
          :loading="loading"
          size="small"
          :rowSelection="isAdd ? { onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys } : null"
        >
          <div
            slot="order"
            slot-scope="text, record, index"
          >
            <span>{{ index + 1 }}</span>
          </div>

          <div
            slot="receiveQuantity"
            slot-scope="text, record, index"
          >
            <a-input-number
              v-if="isAdd"
              style="width:80px;"
              :min="0"
              :max="(record.sendQuantity - (record.alreadyFreeQuantity + record.alreadyReceiveQuantity))"
              :step="1"
              :precision="0"
              :value="record.receiveQuantity"
              @change="(val) => eleChange('receiveQuantity',record.key,val)"
            />
            <span v-else>{{record.receiveQuantity}}</span>
          </div>

          <div
            slot="freeQuantity"
            slot-scope="text, record, index"
          >
            <a-input-number
              v-if="isAdd"
              style="width:80px;"
              :min="0"
              :max="(record.sendQuantity - (record.alreadyFreeQuantity + record.alreadyReceiveQuantity))"
              :step="1"
              :precision="0"
              :value="record.freeQuantity"
              @change="(val) => eleChange('freeQuantity',record.key,val)"
            />
            <span v-else>{{record.freeQuantity}}</span>
          </div>

          <div
            slot="unit"
            slot-scope="text, record, index"
          >
            {{ {1:'支',2:'把',3:'件'}[text] || text }}
          </div>
        </a-table>

      </a-form-model>
      <CustomerList
        ref="customerList"
        @selected="selectedHandler"
      />
      <PostList
        ref="postList"
        @selected="postListSelectedHandler"
      />
    </a-spin>
  </a-modal>

</template>
<script>
import { getDictionary } from '@/api/common'
import {
  receiveCustomerNotReceiveList,
  receiveCustomerPageList,
  receiveCustomerAdd,
  receiveCustomerListReceiveAddCustomer,
  receiveCustomerListReceiveCustomerMail,
  receiveCustomerListReceiveCustomerMaterial
} from '@/api/after-sales-management-custom'

import CaseCadeArea from '@/components/CustomerList/CaseCadeArea'
import CustomerList from './CustomerList'
import PostList from './PostList'
const innerColumns = [
  {
    align: 'center',
    title: '序号',
    width: '80px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    title: '规格型号',
    dataIndex: 'materialModel'
  },
  {
    title: '单位',
    dataIndex: 'unit',
    scopedSlots: { customRender: 'unit' }
  },
  {
    title: '出货数量',
    dataIndex: 'sendQuantity'
  },
  {
    title: '已收数量',
    dataIndex: 'alreadyReceiveQuantity'
  },
  {
    title: '已免寄回数量',
    dataIndex: 'alreadyFreeQuantity'
  },

  {
    title: '本次收货数量',
    dataIndex: 'receiveQuantity',
    scopedSlots: { customRender: 'receiveQuantity' }
  },
  {
    title: '本次免寄回数量',
    dataIndex: 'freeQuantity',
    scopedSlots: { customRender: 'freeQuantity' }
  }
]

export default {
  name: 'receives-customer-add',
  components: { CaseCadeArea, CustomerList, PostList },
  data() {
    // const that = this
    // let checkPending
    // let checkK3Code = (rule, value, callback) => {
    //   clearTimeout(checkPending);
    //   if (!value) {
    //     return callback(new Error('请输入原K3物料代码'));
    //   }
    //   checkPending = setTimeout(() => {
    //     that.checkk3code(value).then(res => {

    //       if(res){
    //         return callback(new Error('K3物料代码重复'));
    //       }else{
    //         callback();
    //       }
    //     })
    //   }, 1000);
    // }

    return {
      type: 'add',
      modalTitle: '收件',
      visible: false,
      spinning: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        materialList: []
      },
      rules: {
        customerName: [{ required: true, message: '请选择客户名称' }],

        sender: [{ required: true, message: '请输入寄件人姓名' }],
        phone: [{ required: true, message: '请输入联系电话' }],
        mailNum: [{ required: true, message: '请选择邮寄编号' }],
        area: [{ required: true, message: '请输入寄件地址' }],
        address: [{ required: true, message: '请输入寄件地址' }]
        // k3Code: [{ validator: checkK3Code, trigger: 'change' }],
        // needCheck:[{ required: true, message: '请选择是否需要送检' }]
      },
      customList: [],
      innerColumns,
      detail: {},
      selectedRowKeys: [],
      selectedRows: [],
      loading: false,
      spinning: false
    }
  },
  computed: {
    isAdd() {
      return this.type === 'add'
    },
    isView() {
      return this.type === 'view'
    }
  },
  methods: {
    query(type, record) {
      const that = this
      that.type = type
      that.form = record
      that.visible = true
    },
    validate() {
      const that = this
      return new Promise((resolve, reject) => {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            resolve({ ...that.form })
          } else {
            resolve(null)
          }
        })
      })
    },
    checkk3code(e) {
      const that = this
      const k3Code = that.form.k3Code
      return materialInfoCheckK3Code({
        k3Code,
        _type: that.normalAddForm.isNormal ? 'normal' : 'product'
      })
        .then(res => {
          try {
            return !!res.data
          } catch (err) {
            console.log(err)
            return false
          }
        })
        .catch(err => {
          console.log(err)
          return false
        })
    },
    handleSubmit() {
      const that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (that.selectedRows.length !== 1) {
            that.$message.info('请至少选择一条物料记录')
            return
          }

          if(!that.validateRows()){
            that.$message.info('数量不正确')
            return
          }

          const params = { ...that.form }
          params.area = params.area.join(',')
          params.areaName = params.areaText.join(',')
          params.materialList = that.selectedRows
          that.spinning = true
          receiveCustomerAdd(params)
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.$emit('finish')
                that.handleCancel()
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.info(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    areaChange({ area, text }) {
      this.form = {
        ...this.form,
        area,
        areaText: text
      }
      console.log(arguments)
    },
    selectedHandler(record) {
      console.log(record)
      this.form = {
        ...this.form,
        customerId: record.customerId,
        customerName: record.customerName
      }
    },
    postListSelectedHandler(record) {
      console.log(record)
      this.form = {
        ...this.form,
        mailId: record.mailId,
        mailNum: record.mailNum,
        accessoriesId: record.accessoriesId
      }
      this.fillMaterial()
    },
    fillMaterial() {
      const that = this
      const { mailId } = that.form
      that.loading = true
      receiveCustomerListReceiveCustomerMaterial({ mailId })
        .then(res => {
          that.loading = false
          that.form = {
            ...that.form,
            materialList: res.data.map(item => {
              item.key = that._uuid()
              return item
            })
          }
        })
        .catch(err => {
          that.loading = false
        })
    },
    openModel(type, params = {}) {
      this.$refs[type].init(params)
    },
    eleChange(field, key, val) {
      const that = this
      const materialList = [...that.form.materialList]
      const target = materialList.find(item => item.key === key)
      target[field] = val

      that.form = { ...that.form, materialList }
    },
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    validateRows(){
      let rows = this.selectedRows
      for(let i=0,len = rows.length;i<len;i++){
        let row = rows[i]
        let sendQuantity = Number(row.sendQuantity) || 0
        let alreadyReceiveQuantity = Number(row.alreadyReceiveQuantity) || 0
        let alreadyFreeQuantity = Number(row.alreadyFreeQuantity) || 0
        let receiveQuantity = Number(row.receiveQuantity) || 0
        let freeQuantity = Number(row.freeQuantity) || 0
        let case1 = sendQuantity >= (alreadyReceiveQuantity + alreadyFreeQuantity + receiveQuantity + freeQuantity )
        if(!case1){
          return false
        }
      }
      return true
    }
  }
}
</script>

<style scoped>
.routine-addform-wrapper-baseInnerData >>> .ant-form-item {
  display: flex;
  margin: 0;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-label {
  width: auto;
  text-align: left;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border caption {
  text-align: left;
}
.icon-required::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
</style>
