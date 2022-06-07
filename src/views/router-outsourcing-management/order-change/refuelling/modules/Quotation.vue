<template>
  <a-form-model ref="ruleForm" :model="detail" class="gift-form-wrapper">
    <div class="__hd">加工费及工期</div>
    <table class="custom-table custom-table-border">
      <tr>
        <td style="width:150px;">加工商</td>
        <td>
          <a-form-model-item> {{ detail.facName }} + {{ detail.facCode }} </a-form-model-item>
        </td>
        <td style="width:250px;">操作</td>
      </tr>
      <tr>
        <td>单个加工费用（元）</td>
        <td>{{ detail.singleMachineCost }}</td>
        <td>
          <a-form-model-item>
            <a-input v-if="bEdit" v-model="detail.singleMachineCostChange" placeholder="请输入变更金额"></a-input>
            <span v-else>{{ detail.singleMachineCostChange }}</span>
          </a-form-model-item>
        </td>
      </tr>
      <tr>
        <td>加工周期（天）</td>
        <td>{{ detail.machineCycle }}</td>
        <td>
          <a-form-model-item>
            <a-input v-if="bEdit" v-model="detail.machineCycleChange" placeholder="请输入变更天数"></a-input>
            <span v-else>{{ detail.machineCycleChange }}</span>
          </a-form-model-item>
        </td>
      </tr>
      <tr>
        <td>质保周期（天）</td>
        <td>{{ detail.warrantyCycle }}</td>
        <td>
          <a-form-model-item>
            <a-input v-if="bEdit" v-model="detail.warrantyCycleChange" placeholder="请输入变更天数"></a-input>
            <span v-else>{{ detail.warrantyCycleChange }}</span>
          </a-form-model-item>
        </td>
      </tr>
    </table>

    <div class="__hd">原料等用品信息</div>
    <div class="__bd">
      <a-table :columns="columns" :dataSource="detail.materialVoList" :scroll="{ x: 1230 }" :pagination="false">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="materialName" slot-scope="text, record, index">
          <a-form-model-item
            v-if="bEdit && record.bAdd"
            :prop="'materialVoList.' + index + '.materialCode'"
            :rules="{ required: true, message: '请选择原料信息', target: ['change'] }"
          >
            <!-- materialType：1是常规的物料基本数据 2是成品物料基本数据 0是两者均查 -->
            <MaterialFuzzySearch
              style="width:150px;"
              :materialType="1"
              :materialInfo="{ materialCode: record.materialCode }"
              :value="record.materialCode"
              @change="item => proMaterialChange(item, index)"
            />
          </a-form-model-item>
          <span v-else>{{ `${text}+${record.materialCode}(${record.stateText})` }}</span>
        </div>
        <!-- 原数据-新物料 可以编辑提供者和是否付费 -->
        <!-- 提供者(1:委托方提供,2:加工商提供) -->
        <div slot="provider" slot-scope="text, record, index">
          <a-form-model-item
            v-if="bEdit && (record.bAdd || +record.state === 2)"
            :prop="`materialVoList.${index}.provider`"
            :rules="{ required: true, message: '请选择提供者' }"
          >
            <a-select
              placeholder="提供者"
              :allowClear="true"
              v-model="record.provider"
              @change="onSelProvider($event, index)"
            >
              <a-select-option :value="1">委托方提供</a-select-option>
              <a-select-option :value="2">加工商提供</a-select-option>
            </a-select>
          </a-form-model-item>
          <span v-else>
            {{ { 1: '委托方提供', 2: '加工商提供' }[record.provider] || '未知' }}
          </span>
        </div>
        <!-- 是否需要付费(1:是,2:否) -->
        <div slot="payType" slot-scope="text, record, index">
          <a-form-model-item
            v-if="bEdit && (record.bAdd || +record.state === 2)"
            :prop="'materialVoList.' + index + '.payType'"
            :rules="{ required: true, message: '请选择是否需要付费' }"
          >
            <!-- @change="onSelPayType($event, index)" -->
            <a-select placeholder="需付费" :allowClear="true" v-model="record.payType">
              <a-select-option :value="1">是</a-select-option>
              <a-select-option :value="2">否</a-select-option>
            </a-select>
          </a-form-model-item>
          <span v-else>
            {{ { 1: '是', 2: '否' }[record.payType] || '未知' }}
          </span>
        </div>
        <div slot="needCount" slot-scope="text, record, index">
          <a-form-model-item
            v-if="bEdit && record.bAdd"
            :prop="'materialVoList.' + index + '.needCount'"
            :rules="{ required: true, message: '请输入需求数量' }"
          >
            <a-input-number :step="1" v-model="record.needCount" placeholder="需求数量" />
          </a-form-model-item>
          <span v-else>
            {{ record.needCount }}
          </span>
        </div>
        <div slot="changeAmount" slot-scope="text, record, index">
          <a-form-model-item v-if="bEdit">
            <a-input-number
              style="width:130px;"
              :step="1"
              :precision="2"
              v-model="record.changeAmount"
              placeholder="请输入变更金额"
            />
            <a type="primary" class="del_a" v-if="record.bAdd" @click="doItemAction('del', record, index)">删除</a>
          </a-form-model-item>
          <span v-else>{{ record.changeAmount }}</span>
        </div>
      </a-table>
      <a-button v-if="bEdit" style="width: 100%" type="dashed" icon="plus" @click="actionItem('add')"
        >增加模具</a-button
      >
    </div>

    <div class="__hd">送取信息</div>
    <div class="__bd">
      <a-table :columns="sendColumns" :dataSource="detail.sendTakeVoList" :pagination="false" :scroll="{ x: 1100 }">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="materialName" slot-scope="text">
          {{ text }}
        </div>
        <div slot="provider" slot-scope="text, record">
          {{ { 1: '委托方提供', 2: '加工商提供' }[record.provider] || '未知' }}
        </div>
        <!-- 是否需要付费(1:是,2:否) -->
        <div slot="payType" slot-scope="text, record">
          {{ { 1: '是', 2: '否' }[record.payType] || '未知' }}
        </div>
        <div slot="changeAmount" slot-scope="text, record, index">
          <a-form-model-item>
            <a-input-number
              v-if="bEdit"
              style="width:130px;"
              :step="1"
              :precision="2"
              v-model="record.changeAmount"
              placeholder="请输入变更金额"
            />
            <span v-else>{{ record.changeAmount }}</span>
          </a-form-model-item>
        </div>

        <template slot="footer">
          <a-row class="row">
            <a-col :span="4">
              成品加工数量
            </a-col>
            <a-col :span="10"> 原成品加工数量:{{ detail.oldProcessCount }} </a-col>
            <a-col :span="10">
              <a-input v-if="bEdit" placeholder="请输入加工数量" v-model="detail.changeNum"></a-input>
              <span v-else>现成品加工数量:{{ detail.changeNum }}</span>
            </a-col>
          </a-row>
          <a-row class="row">
            <a-col :span="4">
              加工费总计
            </a-col>
            <a-col :span="10"> 原加工费用(元):{{ oldProcessAmount }} </a-col>
            <a-col :span="10"> 变更加工费(元):{{ changeProcessAmount }} </a-col>
          </a-row>
          <a-row class="row">
            <a-col :span="4">
              合计
            </a-col>
            <a-col :span="10"> 原合计费用(元):{{ oldSumAmount }} </a-col>
            <a-col :span="10"> 变更合计费用(元):{{ changeSumAmount }} </a-col>
          </a-row>
          <a-row class="row">
            <a-col :span="4">
              变更后总费用
            </a-col>
            <a-col :span="20">
              {{ changeAllAmount }}
            </a-col>
          </a-row>
        </template>
      </a-table>
    </div>

    <a-row class="tip" v-if="bEdit">
      <a-col :span="1">
        说明：
      </a-col>
      <a-col :span="23">
        <span
          >1.变更金额为新增或减少的那部分金额，不是总金额。增加输入正数，减少则输入负数。<br />
          2.变更天数为新增或减少的那部分天数，不是总天数。增加输入正数，减少则输入负数。<br />
          3.请根据成品物料需求数量、加工数量及已加工成品是否可用等确认新成品物料加工数量。</span
        >
      </a-col>
    </a-row>
    <div class="__footer" v-if="bEdit">
      <a-button @click="handleSubmit('cancel')">取消</a-button>
      <a-button @click="handleSubmit('submit')" type="primary">提交</a-button>
    </div>
  </a-form-model>
</template>

<script>
const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '类型',
    width: '100px',
    dataIndex: 'typeText' //类型(1:原料,2:模具)
  },
  {
    title: '原料',
    dataIndex: 'materialName',
    width: '200px',
    scopedSlots: { customRender: 'materialName' }
  },
  {
    title: '提供者',
    dataIndex: 'provider', //提供者(1:委托方提供,2:加工商提供)
    width: '150px',
    scopedSlots: { customRender: 'provider' }
  },
  {
    title: '是否需要付费',
    dataIndex: 'payType', //是否需要付费(1:是,2:否)
    width: '150px',
    scopedSlots: { customRender: 'payType' }
  },
  {
    title: '所需数量',
    dataIndex: 'needCount',
    width: '150px',
    scopedSlots: { customRender: 'needCount' }
  },
  {
    title: '费用金额（元）',
    width: '150px',
    dataIndex: 'oldAmount'
  },
  {
    title: '操作',
    width: '220px',
    dataIndex: 'changeAmount',
    fixed: 'right',
    scopedSlots: { customRender: 'changeAmount' }
  }
]

import MaterialFuzzySearch from '@/components/CustomerList/MaterialFuzzySearch'

export default {
  name: 'outsourcing-order-change-refuelling-material',
  props: {
    dataSource: {
      type: Object,
      required: true
    },
    bEdit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      columns,
      sendColumns: columns.filter(item => item.title !== '所需数量'),
      detail: {}
    }
  },
  components: {
    MaterialFuzzySearch
  },
  //   changeAllAmount:变更后总金额 = 合计原费用金额 + 合计费用变更金额
  //   changeProcessAmount:加工费变更金额 = （加工单价变更金额 + 原金额）*输入的加工数量 - 原加工费总计金额
  //   changeSumAmount:合计费用变更金额 = 循环列表变更金额的和 + 加工费变更金额
  //   oldProcessAmount:原加工费总计金额 = 原单个加工费用*原加工数量
  //   oldSumAmount:合计原费用金额 = 循环列表原金额的和 + 原加工费总计金额
  computed: {
    changeAllAmount() {
      return this.oldSumAmount + this.changeSumAmount
    },
    changeProcessAmount() {
      let changeNum = this.detail.changeNum || 0
      let singleMachineCostChange = this.detail.singleMachineCostChange || 0
      let singleMachineCost = this.detail.singleMachineCost || 0
      return changeNum * singleMachineCostChange + changeNum * singleMachineCost - this.oldProcessAmount
    },
    oldProcessAmount() {
      let needNum = this.detail.oldProcessCount || 0
      let singleMachineCost = this.detail.singleMachineCost || 0
      return needNum * singleMachineCost
    },
    changeSumAmount() {
      var sum = 0
      const materialVoList = this.detail.materialVoList || []
      for (let i = 0; i < materialVoList.length; i++) {
        let money = materialVoList[i].changeAmount || 0
        sum += money
      }
      const sendTakeVoList = this.detail.sendTakeVoList || []
      for (let i = 0; i < sendTakeVoList.length; i++) {
        let money = sendTakeVoList[i].changeAmount || 0
        sum += money
      }
      return sum + this.changeProcessAmount
    },
    oldSumAmount() {
      var sum = 0
      const materialVoList = this.detail.materialVoList || []
      for (let i = 0; i < materialVoList.length; i++) {
        let money = materialVoList[i].oldAmount || 0
        sum += money
      }
      const sendTakeVoList = this.detail.sendTakeVoList || []
      for (let i = 0; i < sendTakeVoList.length; i++) {
        let money = sendTakeVoList[i].oldAmount || 0
        sum += money
      }
      return sum + this.oldProcessAmount
    }
  },
  mounted() {
    this.detail = { ...this.dataSource }
  },
  methods: {
    async query(record) {
      this.detail = { ...record }
    },
    //新增的模具信息
    proMaterialChange(item, index) {
      console.log('换料后成品物品信息-item:', item)
      const { materialCode, materialId, materialName, modelType, materialUnit, type } = item
      const list = this.detail.materialVoList
      var temp = list.find(element => element.materialCode === materialCode)
      if (temp) {
        this.$message.warning('物料代码为【' + materialCode + '】的记录已存在')
      } else {
        var dataItem = list[index]
        dataItem.materialCode = materialCode
        dataItem.materialId = materialId
        dataItem.materialName = materialName
        dataItem.specification = modelType
        dataItem.subUnit = materialUnit
        dataItem.type = type
        dataItem.needCount = 1
        dataItem.changeAmount = 0
        list[index] = { ...dataItem, ...item, typeText: { 1: '原料', 2: '模具' }[type] || '未知' }
      }
    },
    //增加模具
    actionItem(type, record) {
      const that = this
      let materialVoList = [...that.detail.materialVoList]
      if (type === 'add') {
        materialVoList.push({
          key: that._uuid(),
          //   //测试假数据
          //   amount: '', //物料金额
          //   changeAmount: '', //原料变更金额
          //   materialCode: '8.3.1.21',
          //   materialId: 3040,
          //   materialName: '锅',
          //   specification: ' uuuuuuu',
          //   subUnit: '台',
          //   oldAmount: 0,
          //   type: 2,
          //   typeText: '模具', //1原料 2模具
          //   payType: 2, //是否需要付费(1:是,2:否)
          state: 2,
          stateText: '新物料',
          bAdd: true
        })
      } else if (type === 'delete') {
        materialVoList = materialVoList.filter(item => item.key !== record.key)
      }
      that.detail = {
        ...that.detail,
        materialVoList
      }
    },
    //原成品物料是否可用
    onChecked(e) {
      console.log('原成品物料是否可用:', e)
      this.detail.oldUseFlag = e ? 1 : 0
    },
    //原料删除
    doItemAction(type, record, index) {
      if (type === 'del') {
        this.detail.materialVoList.splice(index, 1)
      }
    },
    //选择提供者
    onSelProvider(e, index) {
      console.log('选择提供者', index, e)
      this.detail.materialVoList[index].provider = e
      console.log('记录：', this.detail.materialVoList[index])
    },
    //选择是否需要付费
    onSelPayType(e, index) {
      console.log('是否需要付费', index, e)
      this.detail.materialVoList[index].payType = e
    },
    //取消/提交
    handleSubmit(type) {
      const that = this
      if (type === 'cancel') {
        that.$emit('cancel')
      } else if (type === 'submit' || type === 'save') {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            const params = {
              ...that.detail,
              changeAllAmount: that.changeAllAmount,
              changeProcessAmount: that.changeProcessAmount,
              changeSumAmount: that.changeSumAmount,
              oldProcessAmount: that.oldProcessAmount,
              oldSumAmount: that.oldSumAmount,
              materialBoList: that.detail.materialVoList.map(item => {
                item.amount = item.amount || 0
                item.oldAmount = item.oldAmount || 0
                item.changeAmount = item.changeAmount || 0
                return item
              }),
              sendTakeBoList: that.detail.sendTakeVoList.map(item => {
                item.amount = item.amount || 0
                item.oldAmount = item.oldAmount || 0
                item.changeAmount = item.changeAmount || 0
                return item
              }),
              singleMachineCostChange: that.detail.singleMachineCostChange || 0,
              machineCycleChange: that.detail.machineCycleChange || 0,
              warrantyCycleChange: that.detail.warrantyCycleChange || 0
            }
            delete params.materialVoList
            delete params.sendTakeVoList
            console.log('新增参数：', params)
            that.$emit('confirm', type, that.detail, params)
          } else {
            return false
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border {
  margin-top: 16px;
}
.gift-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.__hd {
  font-size: 16px;
  margin-bottom: 10px;
}
.__bd {
  margin-top: 5px;
  margin-bottom: 10px;
}
.__footer {
  text-align: center;
  margin-top: 20px;
}
.__footer * {
  margin: 0 5px;
}
.tip {
  color: red;
  margin-top: 20px;
  font-size: 12px;
}
.row {
  margin-top: 16px;
}

.del_a {
  padding: 8px;
}
</style>
