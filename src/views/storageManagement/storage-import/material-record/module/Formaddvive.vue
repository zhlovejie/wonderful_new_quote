<template>
  <a-modal
    title="详情"
    :width="1500"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
    </template>

    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" class="routine-addform-wrapper-baseInnerData">
        <h3>仓库信息</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 25%">收料仓库</td>
            <td style="width: 25%">
              {{ record.warehouseName }}
            </td>

            <td style="width: 25%">收料人</td>
            <td style="width: 25%">{{ record.receiveUserName }}</td>
          </tr>
        </table>
        <div style="margin-top: 20px">
          <h3>物料信息</h3>
          <a-table :columns="columns" :dataSource="form.batchListBoList" :pagination="false" bordered size="small">
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>
            <div slot="receiveType" slot-scope="text, record, index">
              <span>{{ { 1: '采购订单', 2: '委外订单' }[text] }}</span>
            </div>
            <div slot="emergenceLevel" slot-scope="text, record, index">
              <span>{{ { 1: '一般', 2: '加急', 3: '特急' }[text] }}</span>
            </div>
            <div slot="specification" slot-scope="text">
              <a-tooltip v-if="String(text).length > 10">
                <template slot="title">{{ text }}</template>
                {{ String(text).slice(0, 10) }}...
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>
          </a-table>
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { getList, updateReceiveNum } from '@/api/storage'

const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '收料单号',
    dataIndex: 'recieveNum',
    key: 'recieveNum',
  },
  {
    align: 'center',
    title: '收料类型',
    dataIndex: 'receiveType',
    key: 'receiveType',
    scopedSlots: { customRender: 'receiveType' },
  },
  {
    align: 'center',
    title: '采购单号/委托单号',
    dataIndex: 'orderNum',
    key: 'orderNum',
  },
  {
    align: 'center',
    title: '供应商名称',
    dataIndex: 'supplierName',
    key: 'supplierName',
  },
  {
    align: 'center',
    title: '紧急程度',
    dataIndex: 'emergenceLevel',
    key: 'emergenceLevel',
    scopedSlots: { customRender: 'emergenceLevel' },
  },
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode',
    key: 'materialCode',
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'materialName',
    key: 'materialName',
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'specification',
    key: 'specification',
    scopedSlots: { customRender: 'specification' },
  },
  {
    align: 'center',
    title: '包装方式',
    dataIndex: 'packageType',
    key: 'packageType',
  },
  {
    align: 'center',
    title: '包内数量',
    dataIndex: 'packageCount',
    key: 'packageCount',
  },
  {
    align: 'center',
    title: '采购数量',
    dataIndex: 'purchseCount',
    key: 'purchseCount',
  },
  {
    align: 'center',
    title: '到货数量',
    dataIndex: 'arrivalCount',
    key: 'arrivalCount',
  },
  {
    align: 'center',
    title: '本次收货数量',
    key: 'recieveCount',
    dataIndex: 'recieveCount',
    // scopedSlots: { customRender: 'recieveCount' },
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    // scopedSlots: { customRender: 'remark' },
  },
]
export default {
  name: 'BecomingForm',
  components: {},
  data() {
    return {
      columns,
      remark: '',
      visible: false,
      spinning: false,
      depList: [],
      form: {
        batchListBoList: [],
        warehouseId: undefined,
      },
      type: '',
      record: {},
    }
  },

  computed: {
    isBatch() {
      //批量审批
      return this.type === 'Batch'
    },
    isReceiving() {
      //单个审批
      return this.type === 'Receiving'
    },
  },
  methods: {
    //接受数据
    query(type, record) {
      const that = this
      that.visible = true
      that.type = type
      that.record = record
      this.form.batchListBoList = []
      this.form.batchListBoList.push(record)
    },
    //提交
    handleOk() {
      let that = this
      if (that.type === 'view') {
        this.visible = false
      } else {
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            const params = that.$_.cloneDeep(that.form || {})
            params.batchListBoList = params.batchListBoList.map((i) => {
              return {
                recieveCount: i.recieveCount,
                remark: i.remark,
                id: i.id,
                materialCheckFlag: i.materialCheckFlag,
              }
            })
            const target = that.depList.find((u) => u.id === params.warehouseId)
            params.warehouseName = target.warehouseName
            updateReceiveNum(params)
              .then((res) => {
                if (res.code === 200) {
                  that.spinning = false
                  that.visible = false
                  that.$message.info(res.msg)
                  that.$refs.ruleForm.resetFields()
                  that.$emit('filet')
                }
              })
              .catch((err) => (that.spinning = false))
          }
        })
      }
    },
    handleCancel() {
      this.$refs.ruleForm.resetFields()
      this.form = {}
      this.visible = false
    },
  },
}
</script>
<style scoped>
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 15px 10px;
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
.ant-form-item {
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
