<template>
  <div>
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="validate" :loading="loading" icon="check">保存</a-button>
      <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
    </div>
    <a-card class="card" :bordered="false">
      <a-form :form="form" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="核价编号" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
              <a-input v-model="valencyCode" disabled />
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="单据状态" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
              <a-input v-if="valencyStatus === 0" v-model="statusName" disabled placeholder="待接收" />
              <a-input v-else-if="valencyStatus === 1" v-model="statusName" disabled />
              <a-input v-else-if="valencyStatus === 2" v-model="statusName" disabled />
              <a-input v-else-if="valencyStatus === 3" v-model="statusName" disabled />
              <a-input v-else-if="valencyStatus === 4" v-model="statusName" disabled />
              <a-input v-else v-model="valencyStatus" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="客户名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
              <a-input value="* * * * * * * *" disabled>* * * * * * * *</a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="{ span: 12 }" :md="{ span: 12 }" :sm="24">
            <a-form-item label="需求日期" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
              <a-input v-model="demandTime" disabled></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- table -->
    <a-card class="card" title="产品信息" :bordered="false">
      <a-table :columns="columns" :dataSource="data" :pagination="false" :loading="memberLoading" bordered rowKey="id">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <template slot="costPrice" slot-scope="text, record">
          <editable-cell :text="text" @change="onCellChange(record.key, 'costPrice', $event)" />
        </template>

        <template slot="aPrice" slot-scope="text, record">
          <editable-cell :text="text" @change="onCellChange(record.key, 'aPrice', $event)" />
        </template>

        <template slot="bPrice" slot-scope="text, record">
          <editable-cell :text="text" @change="onCellChange(record.key, 'bPrice', $event)" />
        </template>
        <template slot="cPrice" slot-scope="text, record">
          <editable-cell :text="text" @change="onCellChange(record.key, 'cPrice', $event)" />
        </template>

        <template slot="referencePic" slot-scope="text, record">
          <img style="height: 50px; lenght: 40px" :src="text" />
        </template>
        <template slot="effectPicture" slot-scope="text, record">
          <div class="clearfix">
            <a-upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              :fileList="fileList"
              @preview="handlePreview"
              @change="uploadChange"
            >
              <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </template>
        <template slot="functionBrief" slot-scope="text, record">
          <editable-cell :text="text" @change="onCellChange(record.key, 'functionBrief', $event)" />
        </template>
        <template slot="thisProductModel" slot-scope="text, record">
          <editable-cell :text="text" @change="onCellChange(record.key, 'thisProductModel', $event)" />
        </template>
      </a-table>
    </a-card>

    <a-card class="card" :bordered="false">
      <a-form :form="form" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="{ span: 6 }" :md="{ span: 12 }" :sm="24">
            <a-form-item label="申请人" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
              <a-input v-model="applyUserName" disabled />
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item label="申请时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
              <a-input v-model="createTime" disabled />
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item label="核价人" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
              <a-input v-model="valencyUserName" disabled />
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item label="核价时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
              <a-input placeholder="2019-06-05" disabled />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import { getlookApplyNuclear } from '../../../api/pricingModule'
import moment from 'moment'
import EditableCell from '@/components/Table/EditableCell'

// 上传图片
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'FqNuclearPriceApproval',
  components: {
    EditableCell
  },
  props: {},
  data () {
    return {
      loading: false,
      memberLoading: false,
      // table
      columns: [
        {
          align: 'center',
          title: '所依据产品类型',
          dataIndex: 'productModel',
          key: 'productModel'
        },
        {
          align: 'center',
          title: '需求数量',
          dataIndex: 'demandNumber',
          key: 'demandNumber'
        },
        {
          align: 'center',
          title: '规格',
          dataIndex: 'specs',
          key: 'specs'
        },
        {
          align: 'center',
          title: '需求描述',
          dataIndex: 'demandRemarks',
          key: 'demandRemarks'
        },
        {
          align: 'center',
          title: '所属类型',
          dataIndex: 'productType',
          key: 'productType'
        },
        {
          align: 'center',
          title: '参考图片',
          dataIndex: 'referencePic',
          key: 'referencePic',
          scopedSlots: { customRender: 'referencePic' }
        },
        {
          align: 'center',
          title: '成本价',
          dataIndex: 'costPrice',
          key: 'costPrice',
          scopedSlots: { customRender: 'costPrice' }
        },
        // {
        //   align: 'center',
        //   title: 'A价',
        //   dataIndex: 'aPrice',
        //   key: 'aPrice',
        //   scopedSlots: { customRender: 'aPrice' }
        // },
        // {
        //   align: 'center',
        //   title: 'B价',
        //   dataIndex: 'bPrice',
        //   key: 'bPrice',
        //   scopedSlots: { customRender: 'bPrice' }
        // },
        // {
        //   align: 'center',
        //   title: 'C价',
        //   dataIndex: 'cPrice',
        //   key: 'cPrice',
        //   scopedSlots: { customRender: 'cPrice' }
        // },
        {
          align: 'center',
          title: '效果图片',
          dataIndex: 'effectPicture',
          key: 'effectPicture',
          scopedSlots: { customRender: 'effectPicture' }
        },
        {
          align: 'center',
          title: '功能简介',
          dataIndex: 'functionBrief',
          key: 'functionBrief',
          scopedSlots: { customRender: 'functionBrief' }
        },
        {
          align: 'center',
          title: '其他',
          dataIndex: 'other',
          key: 'other'
        },
        {
          align: 'center',
          title: '产品代码',
          dataIndex: 'thisProductModel',
          key: 'thisProductModel',
          scopedSlots: { customRender: 'thisProductModel' }
        }
      ],
      data: [],
      errors: [],
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      basicInfo: {},
      demandTime: '', // 需求日期
      previewVisible: false, // 预览图片
      previewImage: '',
      fileList: [],
      valencyStatus: 0, // 单据状态
      statusName: '', // 单据状态名称
      applyUserName: '', // 申请人
      valencyCode: '',
      createTime: '',
      valencyUserName: ''
    }
  },
  computed: {},
  watch: {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // 获取页面的一些信息
      this.getOrderInfo()
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
            title: '所依据产品类型',
            dataIndex: 'productModel',
            key: 'productModel',
          },
          {
            align: 'center',
            title: '需求数量',
            dataIndex: 'demandNumber',
            key: 'demandNumber',
          },
          {
            align: 'center',
            title: '规格',
            dataIndex: 'specs',
            key: 'specs',
          },
          {
            align: 'center',
            title: '需求描述',
            dataIndex: 'demandRemarks',
            key: 'demandRemarks',
          },
          {
            align: 'center',
            title: '所属类型',
            dataIndex: 'productType',
            key: 'productType',
          },
          {
            align: 'center',
            title: '参考图片',
            dataIndex: 'referencePic',
            key: 'referencePic',
            scopedSlots: { customRender: 'referencePic' }
          },
          {
            align: 'center',
            title: '成本价',
            dataIndex: 'costPrice',
            key: 'costPrice',
            scopedSlots: { customRender: 'costPrice' }
          },
          // {
          //   align: 'center',
          //   title: 'A价',
          //   dataIndex: 'aPrice',
          //   key: 'aPrice',
          //   scopedSlots: { customRender: 'aPrice' }
          // },
          // {
          //   align: 'center',
          //   title: 'B价',
          //   dataIndex: 'bPrice',
          //   key: 'bPrice',
          //   scopedSlots: { customRender: 'bPrice' }
          // },
          // {
          //   align: 'center',
          //   title: 'C价',
          //   dataIndex: 'cPrice',
          //   key: 'cPrice',
          //   scopedSlots: { customRender: 'cPrice' }
          // },
          {
            align: 'center',
            title: '效果图片',
            dataIndex: 'effectPicture',
            key: 'effectPicture',
            scopedSlots: { customRender: 'effectPicture' }
          },
          {
            align: 'center',
            title: '功能简介',
            dataIndex: 'functionBrief',
            key: 'functionBrief',
            scopedSlots: { customRender: 'functionBrief' }
          },
          {
            align: 'center',
            title: '其他',
            dataIndex: 'other',
            key: 'other',
          },
          {
            align: 'center',
            title: '产品代码',
            dataIndex: 'thisProductModel',
            key: 'thisProductModel',
            scopedSlots: { customRender: 'thisProductModel' }
          }
        ],
        data: [],
        errors: [],
        form: this.$form.createForm(this),
        userInfo: this.$store.getters.userInfo,
        basicInfo: {},
        demandTime: '',    //需求日期
        previewVisible: false,    //预览图片
        previewImage: '',
        fileList: [],
        valencyStatus:0,    //单据状态
        statusName:'',    //单据状态名称
        applyUserName:'',    //申请人
        valencyCode:'',
        createTime:'',
        valencyUserName:'',
      }
    },
    handleSubmit (e) {
      e.preventDefault()
    },
    methods: {
      init() {
        //获取页面的一些信息
        this.getOrderInfo()
      },
      //返回
      goBackPricing() {
        //点击返回，返回核价单列表页
        this.$router.push({ name: 'pricing' })
      },
      handleSubmit(e) {
        e.preventDefault()
      },
      // saveRow(record) {
      //   this.memberLoading = true
      //   const { key, productType, quantityRequired, specifiCation, smartType } = record
      //   if (!productType || !quantityRequired || !specifiCation || smartType) {
      //     this.memberLoading = false
      //
      //     // 必填项:所依据产品代码,需求数量,规格,所属类型
      //     this.$message.error('请填写完整信息。')
      //     return
      //   }
      //   // 模拟网络请求、卡顿 800ms
      //   new Promise((resolve) => {
      //     setTimeout(() => {
      //       resolve({ loop: false })
      //     }, 800)
      //   }).then(() => {
      //     const target = this.data.filter(item => item.key === key)[0]
      //     target.editable = false
      //     target.isNew = false
      //     this.memberLoading = false
      //   })
      // },
      toggle(key) {
        const target = this.data.filter(item => item.key === key)[0]
        target.editable = !target.editable
      },
      getRowByKey(key, newData) {
        const data = this.data
        return (newData || data).filter(item => item.key === key)[0]
      },
      cancel(key) {
        const target = this.data.filter(item => item.key === key)[0]
        target.editable = false
      },
      handleChange(value, key, column) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          target[column] = value
          this.data = newData
        }
      },

      // 最终全页面提交
      validate() {
        const { $refs: { repository, task }, $notification } = this
        console.log('最终全页面保存',this)
        const repositoryForm = new Promise((resolve, reject) => {
          repository.form.validateFields((err, values) => {
            if (err) {
              reject(err)
              return
            }
            resolve(values)
          })
        })
      })
      const taskForm = new Promise((resolve, reject) => {
        task.form.validateFields((err, values) => {
          if (err) {
            reject(err)
            return
          }
          resolve(values)
        })
      })

      // clean this.errors
      this.errors = []
      Promise.all([repositoryForm, taskForm]).then(values => {
        $notification['error']({
          message: 'Received values of form:',
          description: JSON.stringify(values)
        })
      }).catch(() => {
        const errors = Object.assign({}, repository.form.getFieldsError(), task.form.getFieldsError())
        const tmp = { ...errors }
        this.errorList(tmp)
        console.log(tmp)
      })
    },
    errorList (errors) {
      if (!errors || errors.length === 0) {
        return null
      }
      this.errors = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null
        }

        return {
          key: key,
          message: errors[key][0],
          fieldLabel: fieldLabels[key]
        }
      })
    },
    scrollToField (fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    },
    moment,
    // 编辑表格
    onCellChange (key, dataIndex, value) {
      const dataSource = [...this.dataSource]
      console.log('编辑表格的dataSource', dataSource)
      const target = dataSource.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
    },

    // 上传图片
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    // 上传图片
    uploadChange ({ fileList }) {
      this.fileList = fileList
    },

    // 订单详情查询:获取页面需要的的信息
    getOrderInfo () {
      const params = this.$route.params
      console.log('从点击审核页面跳转过来带来的参数', params)
      // 调取订单详情查询 接口
      getlookApplyNuclear(params).then((res) => {
        console.log('//调取订单详情查询 接口', res)
        this.data = res.data.valencyProducts
        this.valencyCode = res.data.valencyCode
        this.explainText = res.data.explainText
        this.demandTime = res.data.demandTime
        this.valencyUserName = res.data.valencyUserName
        this.applyUserName = res.data.applyUserName
        this.createTime = res.data.createTime
        this.consumerId = res.data.consumerId
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
      }).catch(error => {
        this.loading = false
        console.error(error)
      })
    }

  }
}
</script>

<style lang="less" scoped>
.top-right {
  margin-bottom: 12px;
  margin-right: 6px;
}

.clearfix:after {
  display: block;
  content: '';
  width: 100%;
  height: 0;
  clear: both;
}

.clearfix {
  zoom: 1;
}

.fl-r {
  float: right;
  margin-left: 8px;
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

.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}
.editable-cell-icon.anticon.anticon-edit {
  line-height: 18px;
  display: none;
}
.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-upload-list-picture-card .ant-upload-list-item-info:before {
  transition: none !important;
}
</style>
