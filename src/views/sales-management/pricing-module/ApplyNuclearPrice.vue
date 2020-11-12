<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="top-right clearfix">
        <!--      <a-button class="fl-r" type="primary" @click="submitPricing" icon="check">提交</a-button>-->
        <a-button class="fl-r" type="primary" @click="validate" :loading="loading" icon="check">提交</a-button>
        <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
      </div>
      <a-card class="card" :bordered="false">
        <basic-pricing-information
          ref="BasicPricingInformation"
          :showSubmit="false"
          :data="basicInfo"
          @custom-change="customChange"
        />
      </a-card>

      <!-- table -->
      <a-card class="card" title="产品信息" :bordered="false">
        <a-table :columns="columns" :dataSource="data" :pagination="false" :loading="memberLoading" rowKey="id">
          <template slot="productType" slot-scope="text, record">
            <a-input
              :value="text"
              read-only="read-only"
              @click="openModel(record)"
              v-decorator="['productType', { rules: [{ required: true, message: '选择产品代码' }] }]"
            />
          </template>
          <template slot="quantityRequired" slot-scope="text, record">
            <a-input-number
              :precision="0"
              :min="0"
              ref="quantityRequired"
              v-decorator="['quantityRequired', { rules: [{ required: true, message: '输入数量' }] }]"
              @change="quantityRequiredChange(record, $event)"
            />
          </template>
          <template slot="specifiCation" slot-scope="text">
            <div v-html="formatSpecifiCation(text)"></div>
          </template>
          <template slot="requirementDescription" slot-scope="text, record">
            <a-textarea
              autosize
              ref="requirementDescription"
              v-decorator="['requirementDescription', { rules: [{ required: true, message: '输入需求描述' }] }]"
              @change="requirementDescriptionChange(record, $event)"
            />
          </template>
          <template slot="productArea" slot-scope="text">
            <span>{{ text }}</span>
          </template>
          <template slot="referencePicture" slot-scope="text">
            <img style="height: 50px; lenght: 40px" :src="text" />
          </template>
          <template slot="revisedPart" slot-scope="text, record">
            <a-select
              mode="multiple"
              style="width: 150px"
              @change="partChange(record, $event)"
              placeholder="请选择修改点"
              v-decorator="['revisedPart', { rules: [{ required: true, message: '请选择修改点' }] }]"
            >
              <a-select-option v-for="rPart in revisedParts" :key="rPart.text">{{ rPart.text }}</a-select-option>
            </a-select>
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="saveRow(record)">保存</a>
                <a-divider type="vertical" />
                <a @click="cancel(record.key)">取消</a>
              </span>
            </template>
          </template>
        </a-table>
        <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember"
          >添加行</a-button
        >
      </a-card>

      <a-card class="card" :bordered="false">
        <a-form :form="form" class="form">
          <a-row class="form-row" :gutter="16">
            <a-col :lg="{ span: 12 }" :md="{ span: 12 }" :sm="24">
              <a-form-item label="申请人" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
                <a-input placeholder="申请人" :value="userInfo.trueName || ''" disabled />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="申请时间" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
                <a-input v-model="createTime" disabled />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="核价说明" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
                <a-textarea disabled placeholder="核价说明,多行输入" :rows="4" v-decorator="['explainText']" />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="核价人" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
                <a-select
                  placeholder="请选择核价人"
                  v-decorator="['valencyUserId', { rules: [{ required: true, message: '请选择核价人' }] }]"
                >
                  <a-select-option v-for="item in userList" :key="item.id">{{ item.trueName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <product-model ref="productModel" @custom-change="productChange" :productType="productType"></product-model>
        </a-form>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { getSelectsList, priceOrderAdd, saleValencySaveAndUpdate, getlookApplyNuclear } from '@/api/pricingModule'
import BasicPricingInformation from './BasicPricingInformation'
import ProductModel from '../contract-list-management/step-forms/productModel.vue'
import { getDictionary } from '@/api/common'
export default {
  name: 'ApplyNuclearPrice',
  components: {
    BasicPricingInformation,
    ProductModel,
  },
  props: {},
  data() {
    return {
      loading: false,
      memberLoading: false,
      // table
      columns: [
        {
          align: 'center',
          title: '所依据产品代码',
          dataIndex: 'productType',
          key: 'productType',
          scopedSlots: { customRender: 'productType' },
        },
        {
          align: 'center',
          title: '需求数量',
          dataIndex: 'quantityRequired',
          key: 'quantityRequired',
          scopedSlots: { customRender: 'quantityRequired' },
        },
        {
          align: 'center',
          title: '规格',
          dataIndex: 'specifiCation',
          key: 'specifiCation',
          // width: '20%',
          scopedSlots: { customRender: 'specifiCation' },
        },
        {
          align: 'center',
          title: '需求描述',
          dataIndex: 'requirementDescription',
          key: 'requirementDescription',
          scopedSlots: { customRender: 'requirementDescription' },
        },
        {
          align: 'center',
          title: '产品区域',
          dataIndex: 'productArea',
          key: 'productArea',
          scopedSlots: { customRender: 'productArea' },
        },
        {
          align: 'center',
          title: '参考图片',
          dataIndex: 'referencePicture',
          key: 'referencePicture',
          scopedSlots: { customRender: 'referencePicture' },
        },
        {
          align: 'center',
          title: '修改点',
          dataIndex: 'revisedPart',
          key: 'revisedPart',
          scopedSlots: { customRender: 'revisedPart' },
        },
        {
          title: '操作',
          key: 'action',
          width: '160px',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      data: [],
      errors: [],
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      basicInfo: {},
      userList: [], //核价用户列表
      newBasicInfo: {},
      createTime: '', //申请时间
      explainText: '', //核价说明
      referencePicture: '', //参考图片
      productType: 0, //产品类型
      quantityRequired: 0, //需求数量
      specs: '', //需求规格
      revisedParts: [], //所有的核价修改点
      spinning: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      let that = this
      await that.getValencyCode()
      await getDictionary({ text: '核价修改点' }).then((res) => (that.revisedParts = res.data))
      // 获取页面的一些信息
      //that.getOrderInfo()
    },
    // 返回
    goBackPricing() {
      // 点击返回，返回核价单列表页
      this.$router.push({ name: 'pricing' })
    },
    handleSubmit(e) {
      e.preventDefault()
    },
    // 添加行
    newMember() {
      const length = this.data.length
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        // index:length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        productType: '',
        quantityRequired: 0,
        specifiCation: '',
        requirementDescription: '',
        productArea: '',
        referencePicture: '',
        revisedPart: '',
        editable: true,
        isNew: true,
        basisModel: 0,
      })
    },
    // 删除行
    remove(key) {
      const newData = this.data.filter((item) => item.key !== key)
      this.data = newData
    },
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    // 产品代码弹出框
    openModel(record) {
      this.openKey = record.key
      console.log('openKey :' + this.openKey)
      this.$refs.productModel.query({ productType: this.productType, seriesFlag: '1' })
    },
    productChange(data) {
      console.log('JSON 页面传值事件:' + JSON.stringify(data))
      const paramter = {
        productType: 'productModel',
        productPic: 'productPic',
        specifiCation: 'productStandard',
        productArea: 'productArea',
        basisModel: 'id',
      }
      let selectItem = Object.assign({}, data.selectItem)
      for (const key of this.data) {
        if (key.key == this.openKey) {
          key.basisModel = selectItem.id
          key.specs = selectItem.productStandard
          key.referencePicture = selectItem.productPic // 参考图片   ------
          key.specifiCation = selectItem.productStandard // 规格   ------
          key.productType = selectItem.productModel // 所依据产品代码  ---------
          key.productArea = selectItem.productArea // 产品区域  ----
        }
        console.log('在这之后要给productId设置值', JSON.stringify(key))
      }
      console.log('this.productModel', this.productModel)
      //this.$nextTick(() => this.form.setFieldsValue(selectItem))
    },
    // 需求数量变化
    quantityRequiredChange(record, e) {
      const _index = this.data.findIndex((item) => item.key === record.key)
      if (_index >= 0) {
        this.data[_index]['quantityRequired'] = e
      }
    },
    // 需求描述变化
    requirementDescriptionChange(record, e) {
      const v = e.currentTarget.value
      const _index = this.data.findIndex((item) => item.key === record.key)
      if (_index >= 0) {
        this.data[_index]['requirementDescription'] = v.trim()
      }
    },
    // 修改点变化
    partChange(record, e) {
      const _index = this.data.findIndex((item) => item.key === record.key)
      if (_index >= 0) {
        this.data[_index]['revisedPart'] = e.join(',')
      }
    },
    // 最终全页面提交
    validate() {
      let that = this
      // 验证子组件的输入是否有效并且获取子组件的数据
      const BasicPricingInformation = this.$refs['BasicPricingInformation']

      BasicPricingInformation.validForm()

      setTimeout(function () {
        const { status, ...data } = that.newBasicInfo
        if (status === 'error') {
          console.error('error')
          return false
        }
        console.log('获取子组件的数据:', data)

        if (that.data.length <= 0) {
          that.$message.error('请添加产品后，再提交信息')
          return
        }
        //增加产品信息验证
        for (let i = 0, len = that.data.length; i < len; i++) {
          let item = that.data[i]
          if (item.productType === '') {
            that.$message.error('请选择依据产品代码')
            return
          }
          if (item.quantityRequired <= 0) {
            that.$message.error('需求数量必须大于零')
            return
          }
          if (item.requirementDescription.length === 0) {
            that.$message.error('请输入需求描述')
            return
          }
          if (item.revisedPart.length === 0) {
            that.$message.error('请选择修改点')
            return
          }
        }

        that.form.validateFields((err, values) => {
          console.log('点击提交，看看获取父页面那些信息', values)
          if (!err) {
            that.priceOrderSubmit()
          } else {
            return false
          }
        })
      }, 100)
    },

    // 点击提交：核价订单添加
    priceOrderSubmit() {
      const { code, consumerId, demandTime, consumerName, customerId, customerName } = this.newBasicInfo

      //拼接商品集合
      const valencyProducts = this.data.map((item) => {
        return {
          basisModel: item.basisModel, //依据产品代码（产品信息表id
          demandNumber: item.quantityRequired, //需求数量
          specs: item.specifiCation, //specs
          demandRemarks: item.requirementDescription, //需求描述
          referencePic: item.referencePicture, //参考图片地址
          revisedPart: item.revisedPart, //其他
        }
      })
      const params = {
        valencyCode: code,
        salerId: this.newBasicInfo.salerId,
        consumerId: customerId,
        consumerName: customerName,
        demandTime: demandTime, //需求日期，日期格式：yyyy-MM-dd

        valencyUserId: this.form.getFieldValue('valencyUserId'),
        demandRemarks: this.form.getFieldValue('demandRemarks'),

        valencyProducts: valencyProducts, // 上面拼接的商品集合
        explainText: this.form.getFieldValue('explainText'),
      }
      console.log('点击提交：核价订单添加params:', params)
      //this.loading = true
      this.spinning = true
      saleValencySaveAndUpdate(params)
        .then((res) => {
          this.spinning = false
          console.log('提交申请请求接口的结果', res)
          this.$router.push({ name: 'pricing' })
          this.$destroy('ApplyNuclearPrice')
        })
        .catch((error) => {
          this.spinning = false
          console.error(error)
        })
    },

    errorList(errors) {
      if (!errors || errors.length === 0) {
        return null
      }
      this.errors = Object.keys(errors).map((key) => {
        if (!errors[key]) {
          return null
        }

        return {
          key: key,
          message: errors[key][0],
          // fieldLabel: fieldLabels[key]
        }
      })
    },
    scrollToField(fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    },

    // 获取核价流水号、客户信息下拉、核价用户下拉列表
    getValencyCode() {
      return getSelectsList()
        .then((res) => {
          console.log('获取核价流水号、客户信息下拉、核价用户下拉列表', res)
          this.basicInfo = res.data || {}
          this.userList = res.data.userList
        })
        .catch((error) => {
          console.error(error)
        })
    },

    /**
     * 子组件向父组件通过自定义事件传递数据
     * @param data
     */
    customChange(data) {
      this.newBasicInfo = data
      console.log('子组件向父组件通过自定义事件传递数据:', data)
    },
    formatSpecifiCation(str) {
      //格式化规格显示
      if (str === null || str === undefined || str === '') {
        return `<span>${str}</span>`
      }
      let items = str.split('\n')
      let itemsStr = items.map((s) => `<li>${s}</li>`).join('')
      return `<ol style="text-align: left;">${itemsStr}</ol>`
    },
    // 订单详情查询:获取页面需要的的信息
    getOrderInfo() {
      let that = this
      const params = this.$route.params
      if (!('id' in params)) {
        return
      }
      console.log('/订单详情查询:获取页面需要的的信息id', this.$route.params.id)
      // 调取订单详情查询 接口
      getlookApplyNuclear(params)
        .then((res) => {
          console.log('//调取订单详情查询 接口', res)
          let fillabcPriceObj = {}
          this.data = res.data.valencyProducts.map((item, index) => {
            item.__index = index
            item.key = index + 1
            fillabcPriceObj[`record.${index}.aPrice`] = item.aprice
            fillabcPriceObj[`record.${index}.bPrice`] = item.bprice
            fillabcPriceObj[`record.${index}.cPrice`] = item.cprice
            return item
          })

          that.form.setFieldsValue(fillabcPriceObj)

          console.log('调取接口返回值的valencyProducts塞给表格的data', this.data)
          this.instanceId = res.data.instanceId
          this.valencyCode = res.data.valencyCode
          this.explainText = res.data.explainText
          this.demandTime = res.data.demandTime
          this.valencyUserName = res.data.valencyUserName
          this.applyUserName = res.data.applyUserName
          this.applyUserId = res.data.applyUserId
          this.createTime = res.data.createTime
          this.consumerId = res.data.consumerId
          this.receiveId = res.data.receiveId
          this.id = this.$route.params.id
          this.valencyUserId = res.data.valencyUserId
          this.valencyStatus = res.data.valencyStatus
          this.receiveTime = res.data.receiveTime
          if (res.data.valencyStatus === 0) {
            this.statusName = '待接收'
          } else if (res.data.valencyStatus === 1) {
            this.statusName = '已接收待核价'
          } else if (res.data.valencyStatus === 2) {
            this.statusName = '驳回'
          } else if (res.data.valencyStatus === 3) {
            this.statusName = '合价通过'
          } else if (res.data.valencyStatus === 4) {
            this.statusName = '待审批'
          } else {
            this.statusName = '审批通过'
          }

          if (this.isUpdateType && parseInt(this.valencyStatus) === 5) {
            this.columns = [
              ...this.columns,
              {
                align: 'center',
                title: '产品代码',
                dataIndex: 'newBasisModel',
                key: 'newBasisModel',
                width: '200px',
                scopedSlots: { customRender: 'newBasisModel' },
              },
            ]
          } else {
          }
          that.form.setFieldsValue(res.data)
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
  },
}
</script>

<style lang="less" scoped>
.top-right {
  margin-bottom: 12px;
  margin-right: 6px;
}

.card {
  margin-bottom: 24px;
}

.popover-wrapper {
  /deep/ .antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content {
    min-width: 256px;
    max-height: 290px;
    padding: 0;
    overflow: auto;
  }
}

.antd-pro-pages-forms-style-errorIcon {
  user-select: none;
  margin-right: 24px;
  color: #f5222d;
  cursor: pointer;

  i {
    margin-right: 4px;
  }
}

.antd-pro-pages-forms-style-errorListItem {
  padding: 8px 16px;
  list-style: none;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e6f7ff;
  }

  .antd-pro-pages-forms-style-errorIcon {
    float: left;
    margin-top: 4px;
    margin-right: 12px;
    padding-bottom: 22px;
    color: #f5222d;
  }

  .antd-pro-pages-forms-style-errorField {
    margin-top: 2px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }
}
</style>
