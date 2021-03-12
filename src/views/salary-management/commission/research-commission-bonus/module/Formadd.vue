<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction(recordDetails)">不通过</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction()">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <a-row>
          <a-col :span="24" class="basic-tit" justify="center" align="middle">{{ month }}研发部收款统计表</a-col>
        </a-row>
        <!-- <a-card class="card" title="产品信息" :bordered="false"> -->
        <a-table
          :columns="baseColumns"
          :scroll="{ x: 2000 }"
          :dataSource="dataSource"
          :pagination="false"
          :loading="memberLoading"
          rowKey="id"
        >
          <!-- @click="openModel(record)" -->
          <template slot="productCode" slot-scope="text, record">
            <a-input
              :value="text"
              :disabled="false"
              read-only="read-only"
              v-decorator="['productCode', { rules: [{ required: true, message: '选择产品代码' }] }]"
            />
          </template>
          <template slot="productName" slot-scope="text, record">
            <a-input :disabled="false" :value="text" read-only="read-only" />
          </template>
          <template slot="amountBigDecimal" slot-scope="text, record">
            <a-input-number
              :value="text"
              :disabled="isDisabled"
              :precision="0"
              :min="0"
              ref="amountBigDecimal"
              @change="requirementDescriptionChange(record, $event)"
              v-decorator="['amountBigDecimal', { rules: [{ required: true, message: '输入数量' }] }]"
            />
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="!isDisabled">
              <span>
                <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </template>
          </template>
        </a-table>
        <template v-if="!isDisabled">
          <a-button
            style="width: 100%; margin-top: 16px; margin-bottom: 8px"
            type="dashed"
            icon="plus"
            @click="newMember"
            >添加行</a-button
          >
        </template>

        <a-row style="margin-top: 40px" v-if="isDisabled">
          <a-col :span="24" class="basic-tit" justify="center" align="middle">{{ month }}研发部奖金统计表</a-col>
        </a-row>
        <a-table v-if="isDisabled" :columns="columns1" :pagination="false" rowKey="id" :dataSource="saleCustomers">
        </a-table>
      </a-form>
      <product-model ref="productModel" @selected="productChange"></product-model>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { getUserByDep } from '@/api/systemSetting' //获取部门下人员
import { bonus_PercentageApply, bonus_DeveloperPercentageApply, bonus_PercentageDetailt } from '@/api/bonus_management'
import Approval from './Approval'
import ProductModel from './appForm'
import moment from 'moment'
let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)

export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
    ProductModel,
  },
  data() {
    return {
      remark: '',
      visible: false,
      memberLoading: false,
      dataSource: [],
      userList: [],
      month: undefined,
      departmentId: undefined,
      saleCustomers: [],
      columns1: [
        {
          align: 'center',
          title: '姓名',
          key: 'userName',
          dataIndex: 'userName',
        },
        {
          align: 'center',
          title: '岗位',
          dataIndex: 'stationName',
          key: 'stationName',
        },
        {
          align: 'center',
          title: '提成奖金(元)',
          dataIndex: 'amount',
          key: 'amount',
        },
      ],
      columns: [
        {
          align: 'center',
          title: '产品代码',
          dataIndex: 'productCode',
          key: 'productCode',
          scopedSlots: { customRender: 'productCode' },
        },
        {
          align: 'center',
          title: '产品名称',
          dataIndex: 'productName',
          key: 'productName',
          scopedSlots: { customRender: 'productName' },
        },
        {
          align: 'center',
          title: '合计',
          dataIndex: 'amountBigDecimal',
          key: 'amountBigDecimal',
          // width: '20%',
          scopedSlots: { customRender: 'amountBigDecimal' },
        },
        {
          title: '操作',
          key: 'action',
          width: '160px',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      spinning: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      record: {},
      assetTypeList: undefined,
    }
  },

  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改研发提成奖金'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : this.isView5 ? '查看' : '新增'
      return `${txt}研发提成奖金`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    isView5() {
      //查看
      return this.type === 'view5'
    },
    isEdit() {
      //审核
      return this.type === 'edit'
    },
    isApproval() {
      //通过不通过
      return this.type === 'edit'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isDisabled() {
      return this.isView || this.isEdit || this.isView5
    },

    baseColumns() {
      let _columns = []
      //debugger
      // this.dataSource.map((item, idx) => {
      this.userList.map((_item, idx1) => {
        if (!_columns.find((c) => c.title === _item.trueName)) {
          _columns.push({
            title: _item.trueName,
            dataIndex: `bounsItemRetio_${_item.id}`,
            align: 'center',
          })
        }
      })
      // })${_item.key}
      let __columns = [...this.columns]
      let idx = __columns.findIndex((item) => item.key === 'action')
      if (idx >= 0) {
        __columns.splice(idx, 0, ..._columns)
      }

      return __columns
    },
  },
  methods: {
    moment,
    // 添加行
    newMember() {
      const length = this.dataSource.length
      this.$refs.productModel.query()
    },
    // 删除行
    remove(key) {
      const newData = this.dataSource.filter((item) => item.key !== key)
      this.dataSource = newData
    },
    productChange(data) {
      console.log(data)
      let that = this
      data.oaSalaryBounsPercentageRuleDetails = data.oaSalaryBounsPercentageRuleDetails.map((item) => {
        return {
          amountBigDecimal: undefined,
          userId: item.userId,
          bounsToilt: item.bounsToilt,
        }
      })

      if (that.dataSource.length == 0) {
        this.dataSource.push({
          key: uuid(),
          productCode: data.productCode,
          productName: data.productName,
          oaSalaryDeveloperPercentageDivProductBoList: data.oaSalaryBounsPercentageRuleDetails,
          productId: data.productId,
          productType: data.productType,
        })
      } else {
        let arr = that.dataSource.some((item) => data.productName === item.productName)
        if (!arr) {
          this.dataSource.push({
            key: uuid(),
            productCode: data.productCode,
            productName: data.productName,
            oaSalaryDeveloperPercentageDivProductBoList: data.oaSalaryBounsPercentageRuleDetails,
            productId: data.productId,
            productType: data.productType,
          })
        } else {
          that.$message.error('不能重复选择同一产品')
        }
      }

      for (const key of that.dataSource) {
        if (key.productName == data.productName) {
          key.oaSalaryDeveloperPercentageDivProductBoList.map((v) => {
            v.key = that.assetTypeList[v.userId]
            key[`bounsItemRetio_${v.userId}`] = v.amountBigDecimal
            return v
          })
        }
      }

      // })
    },

    requirementDescriptionChange(record, e) {
      let that = this
      let dataSource = [...that.dataSource]
      let _record = dataSource.find((item) => item.key === record.key)
      const v = e
      record.amountBigDecimal = v
      _record.oaSalaryDeveloperPercentageDivProductBoList = record.oaSalaryDeveloperPercentageDivProductBoList.map(
        (_item) => {
          for (const i in _record) {
            let str = `${i}`
            let str1 = str.split('_')[1]
            if (str1 == _item.userId) {
              _record[i] = parseFloat(v * _item.bounsToilt).toFixed(2)
            }
          }
          return {
            amountBigDecimal: parseFloat(v * _item.bounsToilt).toFixed(2),
            userId: _item.userId,
            bounsToilt: _item.bounsToilt,
          }
          _record[`bounsItemRetio_${_item.userId}`] = _item.amountBigDecimal
        }
      )
      that.dataSource = dataSource
    },

    //接受数据
    query(type, record) {
      let _that = this
      _that.form.resetFields() // 清空表
      _that.dataSource = []
      _that.visible = true
      _that.type = type
      _that.record = record
      getUserByDep({ departmentId: record.departmentId }).then((res) => {
        _that.userList = res.data
        let obj = {}
        res.data.map((item) => {
          obj[item.id] = uuid()
        })
        _that.assetTypeList = obj
      })
      if (type !== 'add') {
        _that.fillData()
      } else {
        _that.month = record.month
        _that.departmentId = record.departmentId
      }
    },
    // 详情
    fillData() {
      let that = this
      that.$nextTick(() => {
        bonus_PercentageDetailt({ id: that.record.id }).then((res) => {
          that.month = res.data.month
          res.data.productList = res.data.productList.map((i) => {
            i.oaSalaryDeveloperPercentageDivProductVoList = i.oaSalaryDeveloperPercentageDivProductVoList.map((v) => {
              return {
                amountBigDecimal: v.amountDeciaml,
                userId: v.userId,
                userName: v.userName,
                bounsToilt: i.amountBigDecimal / v.amountDeciaml / 1000,
              }
            })
            return {
              key: uuid(),
              amountBigDecimal: i.amountBigDecimal,
              applyId: i.applyId,
              productCode: i.productCode,
              productId: i.productId,
              productName: i.productName,
              productType: i.productType,
              oaSalaryDeveloperPercentageDivProductVoList: i.oaSalaryDeveloperPercentageDivProductVoList,
            }
          })

          that.saleCustomers =
            res.data.oaSalaryDeveloperPercentageStaticsDetailVo.oaSalaryDeveloperPercentageStaticsUserVoList
          that.dataSource = res.data.productList.map((item, index) => {
            let _item = { ...item }
            let bounsItemVoList = [..._item.oaSalaryDeveloperPercentageDivProductVoList]
            bounsItemVoList.map((v) => {
              v.key = that.assetTypeList[v.userId]
              _item[`bounsItemRetio_${v.userId}`] = v.amountBigDecimal
              return v
            })
            _item.oaSalaryDeveloperPercentageDivProductBoList = bounsItemVoList
            return _item
          })
        })
      })
    },
    //提交
    handleOk() {
      let that = this
      if (that.type === 'view') {
        this.visible = false
      } else {
        that.form.validateFields((err, values) => {
          if (!err) {
            let arr = {}
            if (that.type === 'edit-salary') {
              arr.id = that.record.id
            }
            if ((that.type === 'add' || that.type === 'edit-salary') && that.dataSource.length > 0) {
              console.log(values)
              for (let i = 0, len = that.dataSource.length; i < len; i++) {
                let item = that.dataSource[i]
                if (item.productCode === '') {
                  that.$message.error('请选择产品代码')
                  return
                }
                if (item.amountBigDecimal === '') {
                  that.$message.error('请选择输入合计')
                  return
                }
              }

              arr.departmentId = that.record.departmentId
              arr.month = that.record.month
              arr.oaSalaryDeveloperPercentageProductListBoList = this.dataSource.map((_iten) => {
                _iten.oaSalaryDeveloperPercentageDivProductBoList = _iten.oaSalaryDeveloperPercentageDivProductBoList.map(
                  (inx) => {
                    return {
                      amountBigDecimal: inx.amountBigDecimal,
                      userId: inx.userId,
                    }
                  }
                )
                return {
                  productId: _iten.productId,
                  productType: _iten.productType,
                  amountBigDecimal: _iten.amountBigDecimal,
                  oaSalaryDeveloperPercentageDivProductBoList: _iten.oaSalaryDeveloperPercentageDivProductBoList,
                }
              })
              console.log(arr)
              that.spinning = true
              bonus_PercentageApply(arr)
                .then((res) => {
                  if (res.code === 200) {
                    this.programme = []
                    this.visible = false
                    that.spinning = false
                    that.dataSource = []
                    that.$message.info(res.msg)
                    that.$emit('finish')
                  } else {
                    that.$message.error(res.msg)
                    that.spinning = false
                  }
                })
                .catch((err) => (that.spinning = false))
            }
          }
        })
      }
    },
    handleCancel() {
      this.programme = []
      this.remark = '' // 清空表
      this.visible = false
    },
    // 审批
    submitAction(opt) {
      let that = this
      let values = {
        approveId: this.record.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      that.spinning = true
      bonus_DeveloperPercentageApply(values)
        .then((res) => {
          that.spinning = false
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction() {
      this.submitAction({
        isAdopt: 0,
        // opinion: '通过',
      })
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>