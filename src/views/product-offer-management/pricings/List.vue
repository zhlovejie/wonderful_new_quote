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
            show-search
            placeholder="模糊搜索"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            v-model="bomFuzzySearch.item.__label"
            @search="(w) => bomFuzzyAction(w, false)"
            @change="(key) => bomFuzzyHandleChange(key)"
            :not-found-content="bomFuzzySearch.fetching ? undefined : '未找到匹配项'"
          >
            <a-spin v-if="bomFuzzySearch.fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="item in bomFuzzySearch.list" :key="item.__key" :value="item.id">
              {{ item.__label }}
            </a-select-option>
          </a-select>
          <!-- <a-select
            :filter-option="filterOption"
            show-search
            v-decorator="['materialId', { rules: [{ required: true, message: '请选择代码' }] }]"
            :loading="loading"
          >
            <a-select-option v-for="item in tionList" :key="item.id" :value="item.id"
              >产品名称： {{ item.productName }} --产品代码：{{ item.productModel }}
            </a-select-option>
          </a-select> -->
        </a-form-item>
        <a-form-item label="代码输入" v-if="type === 2">
          <a-select
            show-search
            placeholder="模糊搜索"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="materialFuzzySearch.fetching ? undefined : '未找到匹配项'"
            v-model="materialFuzzySearch.item.__label"
            @search="(w) => materialFuzzyAction(w, false)"
            @change="(key) => materialFuzzyTableHandleChange(key)"
          >
            <a-spin v-if="materialFuzzySearch.fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="item in materialFuzzySearch.list" :key="item.__key" :value="item.id">
              {{ item.__label }}
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
      <h3>产品信息</h3>
      <table v-if="type === 2" class="custom-table custom-table-border">
        <tr>
          <td>核价代码</td>
          <td>{{ materialFuzzySearch.item.productCode }}</td>
          <td>产品代码</td>
          <td>
            {{ materialFuzzySearch.item.newBasisModel }}
          </td>
        </tr>
        <tr>
          <td>产品名称</td>
          <td>{{ materialFuzzySearch.item.productName }}</td>

          <td>产品类型</td>
          <td>{{ materialFuzzySearch.item.typeConfigName }}</td>
        </tr>
        <tr>
          <td>规格型号</td>
          <td colspan="3">
            {{ materialFuzzySearch.item.valencySpecs }}
          </td>
        </tr>
      </table>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        @expand="expandHandler"
        :expandedRowKeys="expandedRowKeys"
        class="components-table-demo-nested"
        :customRow="customRowFunction"
        :pagination="false"
      >
        <div slot="order" slot-scope="text, record, index">
          <span style="font-size: 20px">{{ index + 1 }}</span>
        </div>
        <div slot="commissionRate" slot-scope="text, record, index">
          <span style="font-size: 20px">{{ text }}</span>
        </div>
        <div slot="price" slot-scope="text, record, index">
          <span style="font-size: 20px">{{ text }}</span>
        </div>
        <div slot="intervalValueName" slot-scope="text, record, index">
          <span style="font-size: 20px">{{ text }}</span>
        </div>

        <a-table
          slot="expandedRowRender"
          slot-scope="record, text"
          :columns="innerColumns"
          :dataSource="record.innerData"
          :pagination="false"
          size="small"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
        </a-table>
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

const innerColumns = [
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
    scopedSlots: { customRender: 'intervalValueName' },
  },
  {
    align: 'center',
    title: '提成比率',
    dataIndex: 'commissionRate',
    scopedSlots: { customRender: 'commissionRate' },
  },
  {
    align: 'center',
    title: '销售价格',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' },
  },
]
let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)
export default {
  data() {
    this.materialFuzzyAction = this.$_.debounce(this.materialFuzzyAction, 800)
    this.bomFuzzyAction = this.$_.debounce(this.bomFuzzyAction, 800)
    return {
      columns,
      innerColumns,
      current: 0,
      loading: true,
      tionList: [],
      _searchParam: {},
      dataSource: [],
      expandedRowKeys: [],
      saleValenc: [],
      depList: [],
      form: this.$form.createForm(this, { name: 'pom-pricing' }),
      type: undefined,
      materialFuzzySearch: {
        list: [],
        item: {},
        fetching: false,
      },
      bomFuzzySearch: {
        list: [],
        item: {},
        fetching: false,
      },
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
    async bomFuzzyAction(wd) {
      const that = this
      const _searchParam = {
        current: 1,
        size: 100,
        parameter: wd,
      }
      that.bomFuzzySearch = { ...that.bomFuzzySearch, fetching: true }
      const result = await productInformationList(_searchParam).then((res) => {
        const records = res.data.records.map((item) => {
          item.__key = uuid()
          item.__label = `产品名称：${item.productName}(${item.productModel})`
          return item
        })
        return records
      })
      that.bomFuzzySearch = { ...that.bomFuzzySearch, fetching: false, list: [...result] }
    },
    bomFuzzyHandleChange(key) {
      const that = this
      const target = that.bomFuzzySearch.list.find((item) => item.id === key)
      console.log(target)
      that.bomFuzzySearch = { fetching: false, item: target }
    },
    async materialFuzzyAction(wd, isFilter = false) {
      const that = this
      const _searchParam = {
        current: 1,
        size: 100,
        parameter: wd,
      }
      that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: true }
      let res = await Promise.all([
        saleValencyProduct(_searchParam).then((res) => {
          let records = res.data.records.map((item) => {
            item.__key = uuid()
            item.__label = `核价产品代码：${item.productCode}}--产品代码:(${item.newBasisModel})--产品名称：${item.productName}`
            return item
          })
          return records
        }),
      ])
      that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: false, list: [...res[0]] }
    },
    materialFuzzyTableHandleChange(key) {
      // debugger
      const that = this
      const target = that.materialFuzzySearch.list.find((item) => item.id === key)
      that.materialFuzzySearch = { fetching: false, item: target }
    },
    expandHandler(expanded, record) {
      console.log(arguments)
      if (expanded) {
        this.expandedRowKeys = [...this.expandedRowKeys, record.key]
        let m = {
          1: materialCodePricing,
          2: valencyCodePricing,
          3: costPricePricing,
        }
        let api = m[this.type]
        api({ rangeId: record.rangeId, ...this._searchParam }).then((res) => {
          if (res.code === 200) {
            let react = this.dataSource.find((item) => item.key === record.key)
            react.innerData = res.data
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter((val) => val !== record.key)
      }
    },
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
      productInformationList({ current: 1, size: 100 }).then((res) => {
        if (res.code === 200) {
          this.bomFuzzySearch.list = res.data.records.map((item) => {
            item.__key = uuid()
            item.__label = `产品名称：${item.productName}(${item.productModel})`
            return item
          })
        }
      })

      saleValencyProduct({ current: 1, size: 100 }).then((res) => {
        if (res.code === 200) {
          this.loading = false
          this.materialFuzzySearch.list = res.data.records.map((item) => {
            item.__key = uuid()
            item.__label = `核价产品代码：${item.productCode}}--产品代码:(${item.newBasisModel})--产品名称：${item.productName}`
            return item
          })
        }
      })
      typeConfigList().then((res) => {
        if (res.code === 200) {
          this.loading = false
          this.depList = res.data
        }
      })
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

      api({ rangeId: -1, ...that._searchParam })
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
      this.init()
    },
    next() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this._searchParam = values
          if (this.type === 2 && JSON.stringify(this.materialFuzzySearch.item) !== '{}') {
            values.valencyId = this.materialFuzzySearch.item.id
          } else if (this.type === 2) {
            return this.$message.error('请选择核价代码')
          }
          if (this.type === 1 && JSON.stringify(this.bomFuzzySearch.item) !== '{}') {
            values.materialId = this.bomFuzzySearch.item.id
          } else if (this.type === 1) {
            return this.$message.error('请选择物料代码')
          }

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
              this.dataSource = res.data.map((item, index) => {
                item.key = index + 1
                item.innerData = []
                return item
              })
              // this.expandedRowKeys = this.dataSource.map((item) => item.key) || []
              // this.dataSource = res.data.sort(function (a, b) {
              //   return a.rateType - b.rateType
              // })
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
      this.init()
      this.bomFuzzySearch.item = {}
      this.materialFuzzySearch.item = {}
    },
  },
}
</script>

<style scoped>
.logListTable {
  font-size: 20px;
}
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