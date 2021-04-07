<template>
  <a-modal
    :title="modalTitle"
    :width="1150"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <h3>{{ title }}</h3>
      <template v-if="normalRecord.length > 0">
        <table class="custom-table custom-table-border" v-for="(item, itemIdx) in normalRecord" :key="item.key">
          <thead>
            <tr>
              <th>序号</th>
              <th>产品名称</th>
              <th>产品销售额(去税去运费)</th>
              <th>利润值</th>
              <th>提成比率系数</th>

              <th>销售提成</th>
              <th>研发提成-管理总提成</th>
              <th>研发提成-单品总提成</th>
              <th>软件/硬件提成</th>
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
                <td>{{ product.saleAmount | moneyFormatNumber }}</td>
                <td>{{ product.profitValue | moneyFormatNumber}}</td>
                <td>{{ product.percentageRatio }}</td>

                <td><a href="javascript:void(0);" @click="viewAction(1,{money:product.salerDivAmount,data:product.salerDivList})">查看</a></td>
                <td><a href="javascript:void(0);" @click="viewAction(2,{money:product.developmentDivAmount,data:product.developmentDivList})">查看</a></td>
                <td><a href="javascript:void(0);" @click="viewAction(3,{money:product.developmentIntellectDivAmount,data:product.developmentIntellectDivList})">查看</a></td>
                <td><a href="javascript:void(0);" @click="viewAction(4,{money:product.softHardDivAmount,data:product.softHardDivList})">查看</a></td>
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
      </template>

      <template v-if="changeRecord.length > 0">
        <h3>变更记录：</h3>
        <table class="custom-table custom-table-border" v-for="(item, itemIdx) in changeRecord" :key="item.key">
          <thead>
            <tr>
              <th>序号</th>
              <th>产品名称</th>
              <th>产品销售额(去税去运费)</th>
              <th>利润值</th>
              <th>提成比率系数</th>

              <th>销售提成</th>
              <th>研发提成-管理总提成</th>
              <th>研发提成-单品总提成</th>
              <th>软件/硬件提成</th>
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
                <td>{{ product.saleAmount | moneyFormatNumber }}</td>
                <td>{{ product.profitValue | moneyFormatNumber}}</td>
                <td>{{ product.percentageRatio }}</td>

                <td><a href="javascript:void(0);" @click="viewAction(1,{money:product.salerDivAmount,data:product.salerDivList})">查看</a></td>
                <td><a href="javascript:void(0);" @click="viewAction(2,{money:product.developmentDivAmount,data:product.developmentDivList})">查看</a></td>
                <td><a href="javascript:void(0);" @click="viewAction(3,{money:product.developmentIntellectDivAmount,data:product.developmentIntellectDivList})">查看</a></td>
                <td><a href="javascript:void(0);" @click="viewAction(4,{money:product.softHardDivAmount,data:product.softHardDivList})">查看</a></td>
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
      </template>


      <a-modal
        :title="detail.title"
        :width="500"
        :visible="detail.visible"
        @cancel="subHandleCancel"
        :footer="null"
        :maskClosable="false"
      >
        <table class="custom-table custom-table-border" >
          <thead>
            <tr>
              <th v-if="detail.__type !== 3">姓名</th>
              <th>提成系数</th>
              <th>提出金额</th>
            </tr>
          </thead>
          <tbody>
            <template
              v-if="
                detail.data &&
                Array.isArray(detail.data.data) &&
                detail.data.data.length > 0
              "
            >
            <tr v-for="(item, itemIdx) in detail.data.data" :key="itemIdx">
              <td v-if="detail.__type !== 3">{{item.userName}}</td>
              <td>{{item.percentageRetio}}</td>
              <td>{{item.percentageAmountBigDecimal | moneyFormatNumber}}</td>
            </tr>
            </template>
            <template v-else>
              <tr>
                <td :colspan="detail.__type !== 3 ? 3 : 2">暂无数据</td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="1">合计</td>
              <td :colspan="detail.__type !== 3 ? 2 : 1">{{ detail.data.money | moneyFormatNumber }}</td>
            </tr>
          </tfoot>
        </table>
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
      detail:{
        title:'',
        visible:false,
        data:{
          money:0,
          data:[]
        },
        __type:0
      }
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
      that.dataSource = []
      that.detail = {...that.detail,visible:false}
      that.spinning = true
      saleOrderPercentageAnalysysDetail(opt)
        .then((res) => {
          that.spinning = false
          that.dataSource = res.data.map(item => {
            item.key = uuid()
            return item
          })
        })
        .catch((err) => {
          that.spinning = false
          that.$message.error(err.message)
        })
    },
    query(type, record) {
      this.visible = true

      let { id, staticsDate } = record

      this.title = `${staticsDate.slice(0, 7)}月【${record.departmentName} ${record.stationName} ${
        record.salerUserName
      }】`
      this.$nextTick(() => {
        this.init({ orderId: id })
      })
    },
    handleCancel() {
      this.visible = false
    },
    subHandleCancel(){
      this.detail = {
        ...this.detail,
        visible:false
      }
    },
    viewAction(type,item){
      const m = {
        1:'销售提成',
        2:'研发提成-管理总提成',
        3:'研发提成-单品总提成',
        4:'软件/硬件提成',
      }
      this.detail = {
        ...this.detail,
        data:item,
        visible:true,
        title:m[type],
        __type:type,
      }
    }
  },
}
</script>
<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  text-align: left;
  line-height: 40px;
}
.custom-table-border tfoot {
  font-weight: bold;
  color: red;
}
</style>
