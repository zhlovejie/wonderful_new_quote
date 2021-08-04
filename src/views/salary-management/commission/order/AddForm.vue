<template>
  <a-modal
    :title="modalTitle"
    :width="850"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
    :destroyOnClose="true"
    :forceRender="true"
    key="m1"
  >
    <a-spin :spinning="spinning">
      <h3>{{ title }}</h3>
      <div v-if="normalRecord.length > 0">
        <table class="custom-table custom-table-border" v-for="(item, itemIdx) in normalRecord" :key="item.key">
          <thead>
            <tr>
              <th>序号</th>
              <th>产品名称</th>
              <th>产品类型</th>
              <th>产品销售额(去税去运费)</th>
              <th>成本价</th>
              <th>利润值</th>
              <th>提成比率系数</th>

              <th colspan="4">提成</th>
              <!-- <th>销售提成</th>
              <th>研发提成-管理总提成</th>
              <th>研发提成-单品总提成</th>
              <th>软件/硬件提成</th> -->
            </tr>
          </thead>
          <tbody>
            <template
              v-if="
                Array.isArray(item.contractProductPercentageDetailLastVoList) &&
                item.contractProductPercentageDetailLastVoList.length > 0
              "
            >
              <tr v-for="(product, idx) in item.contractProductPercentageDetailLastVoList" :key="product.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ product.productName }}</td>
                <td>{{ product.productConfigName }}</td>
                <td>{{ product.saleAmount | moneyFormatNumber }}</td>
                <td>{{ product.costPrice | moneyFormatNumber}}</td>
                <td>{{ product.profitValue }}</td>
                <td>{{ product.percentageRatio }}</td>

                <td colspan="4">
                  <a href="javascript:void(0);" @click="viewAllAction(product)">查看</a>
                </td>
                <!-- <td><a href="javascript:void(0);" @click="viewAction(1,{money:product.salerDivAmount,data:product.salerDivList})">查看</a></td>
                <td><a href="javascript:void(0);" @click="viewAction(2,{money:product.developmentDivAmount,data:product.developmentDivList})">查看</a></td>
                <td><a href="javascript:void(0);" @click="viewAction(3,{money:product.developmentIntellectDivAmount,data:product.developmentIntellectDivList})">查看</a></td>
                <td><a href="javascript:void(0);" @click="viewAction(4,{money:product.softHardDivAmount,data:product.softHardDivList})">查看</a></td> -->
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="9">暂无数据</td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="1">合计</td>
              <td colspan="8">{{ item.allAmount | moneyFormatNumber }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div v-if="changeRecord.length > 0">
        <h3>变更记录：</h3>
        <table class="custom-table custom-table-border" v-for="(item, itemIdx) in changeRecord" :key="item.key">
          <thead>
            <tr>
              <th>序号</th>
              <th>产品名称</th>
              <th>产品类型</th>
              <th>产品销售额(去税去运费)</th>
              <th>成本价</th>
              <th>利润值</th>
              <th>提成比率系数</th>
              <th colspan="4">提成</th>
              <!-- <th>销售提成</th>
              <th>研发提成-管理总提成</th>
              <th>研发提成-单品总提成</th>
              <th>软件/硬件提成</th> -->
            </tr>
          </thead>
          <tbody>
            <template
              v-if="
                Array.isArray(item.contractProductPercentageDetailLastVoList) &&
                item.contractProductPercentageDetailLastVoList.length > 0
              "
            >
              <tr v-for="(product, idx) in item.contractProductPercentageDetailLastVoList" :key="product.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ product.productName }}</td>
                <td>{{ product.productConfigName }}</td>
                <td>{{ product.saleAmount | moneyFormatNumber }}</td>
                <td>{{ product.costPrice | moneyFormatNumber}}</td>
                <td>{{ product.profitValue }}</td>
                <td>{{ product.percentageRatio }}</td>
                <td colspan="4">
                  <a href="javascript:void(0);" @click="viewAllAction(product)">查看</a>
                </td>
                <!-- <td><a href="javascript:void(0);" @click="viewAction(1,{money:product.salerDivAmount,data:product.salerDivList})">查看</a></td>
                <td><a href="javascript:void(0);" @click="viewAction(2,{money:product.developmentDivAmount,data:product.developmentDivList})">查看</a></td>
                <td><a href="javascript:void(0);" @click="viewAction(3,{money:product.developmentIntellectDivAmount,data:product.developmentIntellectDivList})">查看</a></td>
                <td><a href="javascript:void(0);" @click="viewAction(4,{money:product.softHardDivAmount,data:product.softHardDivList})">查看</a></td> -->
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="9">暂无数据</td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="1">合计</td>
              <td colspan="8">{{ item.allAmount | moneyFormatNumber }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <a-modal
        title="查看提成"
        :width="850"
        :visible="subHandleVisible"
        @cancel="subHandleCancel"
        :footer="null"
        :maskClosable="false"
      >
        <div class="commission-render-wrapper">
          <table class="custom-table custom-table-border" v-for="commission in commissionSet" :key="commission.key">
            <caption>
              {{
                commission.title
              }}
            </caption>
            <thead>
              <tr>
                <th>部门</th>
                <th v-if="commission.__type !== 3">岗位</th>
                <th v-if="commission.__type !== 3">姓名</th>
                <th>提成系数</th>
                <th>提出金额</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-if="commission.data && Array.isArray(commission.data.data) && commission.data.data.length > 0"
              >
                <tr v-for="(item, itemIdx) in commission.data.data" :key="itemIdx">
                  <td>{{ item.departmentName }}</td>
                  <td v-if="commission.__type !== 3">{{ item.stationName }}</td>
                  <td v-if="commission.__type !== 3">{{ item.userName }}</td>
                  <td>{{ item.percentageRetio }}</td>
                  <td>{{ item.percentageAmountBigDecimal | moneyFormatNumber }}</td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td :colspan="commission.__type !== 3 ? 3 : 2">暂无数据</td>
                </tr>
              </template>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="1">合计</td>
                <td :colspan="commission.__type !== 3 ? 4 : 2">{{ commission.data.money | moneyFormatNumber }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </a-modal>
    </a-spin>
  </a-modal>
</template>

<script>
import { saleOrderPercentageAnalysysDetail } from '@/api/commissionDetail'
let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)
export default {
  name: 'commission-order-addForm',
  data() {
    return {
      modalTitle: '详情',
      visible: false,
      spinning: false,
      dataSource: [],
      title: '',
      subHandleVisible: false,
      commissionSet: [],
    }
  },
  computed: {
    normalRecord() {
      return this.dataSource.filter((item) => item.updateNum === 0)
    },
    changeRecord() {
      return this.dataSource.filter((item) => item.updateNum > 0)
    },
  },
  methods: {
    init(opt) {
      const that = this
      that.spinning = true
      saleOrderPercentageAnalysysDetail(opt)
        .then((res) => {
          that.spinning = false
          that.dataSource = res.data.map((item) => {
            item.key = uuid()
            return item
          })
        })
        .catch((err) => {
          that.spinning = false
          that.dataSource = []
          that.$message.error(err.message)
        })
    },
    query(type, record) {
      const that = this
      that.dataSource = []
      that.visible = true
      let { id, staticsDate } = record
      that.title = `${staticsDate.slice(0, 7)}月【${record.departmentName} ${record.stationName} ${
        record.salerUserName
      }】`
      that.init({ orderId: id })
    },
    handleCancel() {
      this.visible = false
    },
    subHandleCancel() {
      this.subHandleVisible = false
    },
    viewAction(type, item) {
      const m = {
        1: '销售提成',
        2: '研发提成-管理总提成',
        3: '研发提成-单品总提成',
        4: '软件/硬件提成',
      }
      this.detail = {
        ...this.detail,
        data: item,
        visible: true,
        title: m[type],
        __type: type,
      }
    },
    viewAllAction(product) {
      const m = {
        1: '销售提成',
        2: '研发提成-管理总提成',
        3: '研发提成-单品总提成',
        4: '软件/硬件提成',
      }
      let arr = []

      arr.push({
        data: { money: product.salerDivAmount, data: product.salerDivList },
        title: m[1],
        __type: 1,
        key: uuid(),
      })

      arr.push({
        data: { money: product.developmentDivAmount, data: product.developmentDivList },
        title: m[2],
        __type: 2,
        key: uuid(),
      })

      arr.push({
        data: { money: product.developmentIntellectDivAmount, data: product.developmentIntellectDivList },
        title: m[3],
        __type: 3,
        key: uuid(),
      })

      arr.push({
        data: { money: product.softHardDivAmount, data: product.softHardDivList },
        title: m[4],
        __type: 4,
        key: uuid(),
      })
      this.subHandleVisible = true
      this.$nextTick(() => (this.commissionSet = arr))
    },
  },
}
</script>
<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
  text-align: left;
}
.custom-table-border tfoot {
  font-weight: bold;
  color: red;
}

.commission-render-wrapper {
  display: flex;
  flex-direction: column;
}
.commission-render-wrapper .custom-table-border {
  margin-bottom: 10px;
}

.commission-render-wrapper .custom-table-border caption {
  text-align: left;
}
</style>
