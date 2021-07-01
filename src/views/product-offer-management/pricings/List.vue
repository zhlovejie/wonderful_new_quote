<template>
  <a-card :bordered="false">
    <a-steps :current="current">
      <a-step title="核价类型" />
      <a-step title="核价输入" />
      <a-step title="价格" />
    </a-steps>
    <div class="steps-content" v-if="current === 0">
      <a-alert
        v-if="current === 0"
        style="width: 520px; margin: 0px auto; margin-bottom: 70px; text-align: left"
        message="请选择合适的类型进行核价"
        type="info"
        show-icon
        closable
      />
      <a-space :size="100">
        <template v-if="$auth('pricings:material')">
          <a-button size="large" type="dashed" @click="nexts(1)">物料代码核价</a-button>
        </template>
        <template v-if="$auth('pricings:pricing')">
          <a-button size="large" type="dashed" @click="nexts(2)">核价代码核价</a-button>
        </template>
        <template v-if="$auth('pricings:Costprice')">
          <a-button size="large" type="dashed" @click="nexts(3)">成本价核价</a-button>
        </template>
      </a-space>
    </div>
    <div class="steps-content" v-if="current === 1">
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 8 }">
        <a-alert
          v-if="type === 3"
          style="width: 520px; margin: 0px auto; margin-bottom: 70px; text-align: left"
          message="通过成本价进行核价"
          type="info"
          show-icon
          closable
        />
        <a-alert
          v-if="type === 1"
          style="width: 520px; margin: 0px auto; margin-bottom: 70px; text-align: left"
          message="通过物料代码进行核价"
          type="info"
          show-icon
          closable
        />
        <a-alert
          v-if="type === 2"
          style="width: 520px; margin: 0px auto; margin-bottom: 70px; text-align: left"
          message="通过核价代码进行核价"
          show-icon
          type="info"
          closable
        />
        <a-form-item label="代码输入" v-if="type === 1">
          <a-select
            :filter-option="filterOption"
            show-search
            v-decorator="['materialId', { rules: [{ required: true, message: '请选择代码' }] }]"
            :loading="loading"
          >
            <a-select-option v-for="item in tionList" :key="item.id" :value="item.id"
              >{{ item.productModel }} ( {{ item.productName }} )</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="代码输入" v-if="type === 2">
          <a-select
            :filter-option="filterOption"
            show-search
            v-decorator="['valencyId', { rules: [{ required: true, message: '请选择代码' }] }]"
            :loading="loading"
          >
            <a-select-option v-for="item in saleValenc" :key="item.id" :value="item.id"
              >{{ item.newBasisModel }}-{{ item.productCode }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="成本价" v-if="type === 3">
          <a-input-Number
            style="width: 100%"
            v-decorator="['costPrice', { rules: [{ required: true, message: '请输入成本价' }] }]"
          />
        </a-form-item>
        <a-form-item label="产品类型" v-if="type === 3">
          <a-select v-decorator="['productTypeConfigId', { rules: [{ required: true, message: '请选择产品类型' }] }]">
            <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
              item.typeName
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>
    <div class="steps-content" v-if="current === 2">
      <a-alert
        v-if="current === 2"
        style="width: 520px; margin: 0px auto; margin-bottom: 30px; text-align: left"
        message="蓝色为总区间,黄色为推荐区间,红色为竞争力区间"
        type="info"
        show-icon
        closable
      />
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :customRow="customRowFunction"
        :pagination="false"
        size="small"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
      </a-table>
    </div>
    <div class="steps-action">
      <a-button v-if="current === 1" type="primary" @click="prev" style="margin-right: 10px"> 上一步 </a-button>
      <a-button v-if="current === 1" type="primary" @click="next"> 确定 </a-button>
      <a-button v-if="current === 2" type="primary" @click="prev"> 返回核价 </a-button>
      <a-button v-if="current === 2" type="primary" style="margin-left: 8px" @click="downloadAction"> 下载 </a-button>
    </div>
  </a-card>
</template>

<script>
import {
  productInformationList,
  saleValencyProduct,
  typeConfigList,
  costPricePricing,
  materialCodePricing,
  valencyCodePricing,
  exportCostPricePricing,
  exportMaterialCodePricing,
  exportValencyCodePricing,
} from '@/api/productOfferManagement'
const columns = [
  {
    align: 'center',
    title: '序号',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '区间值名称',
    dataIndex: 'intervalValueName',
  },
  {
    align: 'center',
    title: '提成比率',
    dataIndex: 'commissionRate',
  },
  {
    align: 'center',
    title: '销售价格',
    dataIndex: 'price',
  },
]

export default {
  data() {
    return {
      columns,
      current: 0,
      loading: true,
      tionList: [],
      _searchParam: {},
      dataSource: [],
      saleValenc: [],
      depList: [],
      form: this.$form.createForm(this, { name: 'pom-pricing' }),
      type: undefined,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'pom-pricing') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    customRowFunction(record) {
      //rateType 1 总区间 蓝色  2 推荐区间 黄色 3竞争力区间 红色
      let { rateType } = record
      return {
        style: {
          'background-color': rateType === 1 ? '#E6F7FF ' : +rateType === 2 ? '#FFFBE6' : '#FFF1F0',
        },
      }
    },

    init() {
      productInformationList().then((res) => {
        if (res.code === 200) {
          this.loading = false
          this.tionList = res.data
        }
      })
      saleValencyProduct().then((res) => {
        if (res.code === 200) {
          this.loading = false
          this.saleValenc = res.data
        }
      })
      typeConfigList().then((res) => {
        if (res.code === 200) {
          this.loading = false
          this.depList = res.data
        }
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    downloadAction() {
      let that = this
      that.spinning = true

      let m = {
        1: exportMaterialCodePricing,
        2: exportValencyCodePricing,
        3: exportCostPricePricing,
      }
      let api = m[this.type]

      api(that._searchParam)
        .then((res) => {
          that.spinning = false
          console.log(res)
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = `核价信息.xls`
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                }
                if (_res !== null) {
                  if (_res.code !== 0) {
                    that.$message.info(_res.message)
                  } else {
                    that.$message.info('下载成功')
                  }
                } else {
                  that.$message.info('json解析出错 e.target.result：' + e.target.result)
                  return
                }
              }
              reader.readAsText(res)
            } else {
              that.$message.info('不支持的类型:' + res)
            }
          }
        })
        .catch((err) => (that.spinning = true))
    },
    nexts(val) {
      this.type = val
      this.current++
    },
    next() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this._searchParam = values
          let m = {
            1: materialCodePricing,
            2: valencyCodePricing,
            3: costPricePricing,
          }
          let api = m[this.type]
          api(values).then((res) => {
            console.log(res.data)

            if (res.code === 200) {
              this.current++
              this.dataSource = res.data.sort(function (a, b) {
                return a.rateType - b.rateType
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    prev() {
      this.dataSource = []
      this.current = 0
    },
  },
}
</script>

<style scoped>
.steps-content {
  border-radius: 6px;
  background-color: #fff;
  min-height: 300px;
  text-align: center;
  padding-top: 60px;
}
.ant-card-body {
  padding-left: 250px;
  padding-right: 250px;
}

.steps-action {
  margin-top: 24px;
  text-align: center;
}
</style>