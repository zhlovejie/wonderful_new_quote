<template>
  <a-spin :spinning="spinning">
    <div>
      <div class="top-right clearfix">
        <a-button
          class="fl-r"
          type="primary"
          @click="validateAction"
          :loading="loading"
          icon="check"
        >保存</a-button>
        <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
      </div>
      <a-card class="card" :bordered="false">
        <a-form class="form">
          <a-row class="form-row" :gutter="16">
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="核价编号" :label-col="{ span: 3}" :wrapper-col="{ span:9 }">
                <a-input v-model="valencyCode" disabled />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="单据状态" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
                <a-input v-model="statusName" disabled />
                <!-- <a-input v-if="valencyStatus===0" v-model="statusName" disabled placeholder="待接收" />
                <a-input v-else-if="valencyStatus===1" v-model="statusName" disabled />
                <a-input v-else-if="valencyStatus===2" v-model="statusName" disabled />
                <a-input v-else-if="valencyStatus===3" v-model="statusName" disabled />
                <a-input v-else-if="valencyStatus===4" v-model="statusName" disabled />
                <a-input v-else v-model="valencyStatus" disabled /> -->
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="客户名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
                <a-input value="* * * * * * * *" disabled>* * * * * * * *</a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="{span: 12}" :md="{span: 12}" :sm="24">
              <a-form-item label="需求日期" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
                <a-input v-model="demandTime" disabled></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>

      <!-- table -->
      <a-card class="card" title="产品信息" :bordered="false">
        <a-form :form="form" @submit="handleSubmit" class="form wdf-form">
          <a-table
            :columns="columns"
            :dataSource="data"
            :scroll="{ x: 2500 }"
            :pagination="false"
            :loading="memberLoading"
            bordered
            rowKey="id"
          >
            <template slot="costPrice" slot-scope="text, record">
              <a-form-item>
                <a-input
                  v-decorator="[`record.${record.__index}.costPrice`, {initialValue:record.costPrice,rules: [{ required: true, message: '请输入成本价',pattern:/^[1-9]\d.*$/ }]}]"
                  @change="costPriceChange(record, $event)"
                />
              </a-form-item>
            </template>
            <template slot="aPrice" slot-scope="text, record">
              <a-form-item>
                <a-input
                  v-decorator="[`record.${record.__index}.aPrice`,{initialValue:record.aprice}]"
                  @change="changeHandler(record , 'aPrice', $event)"
                />
              </a-form-item>
            </template>
            <template slot="bPrice" slot-scope="text, record">
              <a-form-item>
                <a-input
                  v-decorator="[`record.${record.__index}.bPrice`,{initialValue:record.bprice}]"
                  @change="changeHandler(record , 'bPrice', $event)"
                />
              </a-form-item>
            </template>
            <template slot="cPrice" slot-scope="text, record">
              <a-form-item>
                <a-input
                  v-decorator="[`record.${record.__index}.cPrice`,{initialValue:record.cprice}]"
                  @change="changeHandler(record , 'cPrice' , $event)"
                />
              </a-form-item>
            </template>
            <template slot="referencePic" slot-scope="text, record">
              <img style="height: 50px;lenght:40px" :src="text" />
            </template>

            <!--          上传参考图片部分 begin!-->
            <!--          <template slot="effectPic" slot-scope="text, record">-->
            <!--            <a-form-item>-->
            <!--              <div class="clearfix">-->
            <!--                <a-upload-->
            <!--                  accept="multiple"-->
            <!--                  name="files"-->
            <!--                  :action="uploadPath"-->
            <!--                  listType="picture-card"-->
            <!--                  :fileList="fileList"-->
            <!--                  @preview="handlePreview"-->
            <!--                  @change="uploadChange"-->
            <!--                >-->
            <!--                  <div v-if="fileList.length < 1">-->
            <!--                    <a-icon type="plus" />-->
            <!--                    <div class="ant-upload-text">选择图片</div>-->
            <!--                  </div>-->
            <!--                </a-upload>-->
            <!--                <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel">-->
            <!--                  <img alt="图片" style="width: 100%" :src="previewImage" />-->
            <!--                </a-modal>-->
            <!--              </div>-->
            <!--              <a-input-->
            <!--                type="hidden"-->
            <!--                v-decorator="['effectPic', {rules: [{required: true,message: '请选择图片！'}]}]"-->
            <!--              />-->
            <!--            </a-form-item>-->
            <!--          </template>-->

            <template slot="effectPic" slot-scope="text, record">
              <img
                read-only="read-only"
                @click="openModel(record)"
                :src="record.effectPic"
                style="width: 100px;height: 100px;"
              />
            </template>

            <template slot="valencySpecs" slot-scope="text, record">
              <a-form-item>
                <a-textarea
                  v-decorator="[`record.${record.__index}.valencySpecs`,{initialValue:record.valencySpecs}]"
                  @change="changeHandler(record ,'valencySpecs' ,$event)"
                />
              </a-form-item>
            </template>

            <template
              v-if="isUpdateType && parseInt(valencyStatus) === 5"
              slot="newBasisModel"
              slot-scope="text, record"
            >
              <a-form-item>
                <a-input
                  v-decorator="[`record.${record.__index}.newBasisModel`,{initialValue:record.newBasisModel}]"
                  @change="changeHandler(record ,'newBasisModel' ,$event)"
                />
              </a-form-item>
            </template>
            <template
              v-if="isUpdateType && parseInt(valencyStatus) === 5"
              slot="productName"
              slot-scope="text, record"
            >
              <a-form-item>
                <a-input
                  v-decorator="[`record.${record.__index}.productName`,{initialValue:record.productName}]"
                  @change="changeHandler(record ,'productName' ,$event)"
                />
              </a-form-item>
            </template>

            <template slot="area" slot-scope="text, record">
              <a-form-item>
                <a-tree-select
                  style="width:250px"
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="allAreas"
                  @change="areaChange(record,$event)"
                  placeholder="选择区域"
                  v-decorator="[`record.${record.__index}.area`,{initialValue:record.area ? String(record.area) : undefined, rules: [{required: true, message: '请选择产品区域'}]}]"
                ></a-tree-select>

                <!-- <a-select
                style="width:150px"
                placeholder="请选择产品区域"
                v-decorator="[ `record.${record.__index}.area`, {rules: [{ required: true, message: '请选择产品区域'}]}]"
              >
                <a-select-option @click="areaChange(record, areas)" v-for="areas in allAreas" :key="areas.id">{{ areas.text }}</a-select-option>
                </a-select>-->
              </a-form-item>
            </template>

            <template
              slot="productName"
              slot-scope="text, record"
            >
              <a-form-item>
                <a-input
                  v-decorator="[`record.${record.__index}.productName`,{initialValue:record.productName}]"
                  @change="changeHandler(record ,'productName' ,$event)"
                />
              </a-form-item>
            </template>

            
          </a-table>
        </a-form>
      </a-card>

      <a-card class="card" :bordered="false">
        <a-form class="form">
          <a-row class="form-row" :gutter="16">
            <a-col :lg="{span: 6}" :md="{span: 12}" :sm="24">
              <a-form-item label="申请人" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
                <a-input v-model="applyUserName" disabled />
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="12" :sm="24">
              <a-form-item label="申请时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
                <a-input v-model="createTime" disabled />
              </a-form-item>
            </a-col>
            <a-col :lg="12" :md="12" :sm="24">
              <a-form-item label="核价说明" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
                <a-textarea v-model="explainText" />
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="12" :sm="24">
              <a-form-item label="核价人" :label-col="{ span: 6}" :wrapper-col="{ span:16 }">
                <a-input v-model="valencyUserName" disabled />
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="12" :sm="24">
              <a-form-item label="核价时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
                <a-input placeholder="2019-06-05" disabled />
              </a-form-item>
            </a-col>
          </a-row>

          <!--上传图片弹出层 begin!-->
          <upload-model ref="uploadModel" @custom-change="upChange" :effectPic="effectPic"></upload-model>
          <!--上传图片弹出层 begin!-->
        </a-form>
      </a-card>
    </div>
  </a-spin>
</template>

<script>
import { getlookApplyNuclear, saveProduct, updateValencyProduct ,isRepeatCode} from '@/api/pricingModule'
import { queryTreeByArea, queryPriceByArea } from '@/api/workBox'
import moment from 'moment'
import EditableCell from '@/components/Table/EditableCell'
import { getUploadPath } from '@/api/manage'
import UploadModel from './pricings/uploadModel'
import { getDictionary } from '@/api/common'
import { calculatePrice } from '@/utils/util'
// 上传图片
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'NuclearPriceApproval',
  components: {
    UploadModel,
    EditableCell
  },
  props: {},
  data() {
    return {
      loading: false,
      memberLoading: false,
      form: this.$form.createForm(this),
      // table
      columns: [
        {
          align: 'center',
          title: '所依据产品类型',
          dataIndex: 'productModel',
          key: 'productModel',
          width: 200
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
          width: '240px',
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
          title: '产品区域',
          dataIndex: 'oldAreaText',
          key: 'oldAreaText'
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
          title: '修改点',
          dataIndex: 'revisedPart',
          key: 'revisedPart'
        },
        {
          align: 'center',
          width: '100px',
          title: '新产品区域',
          dataIndex: 'area',
          key: 'area',
          scopedSlots: { customRender: 'area' }
        },
        {
          align: 'center',
          title: '成本价',
          dataIndex: 'costPrice',
          key: 'costPrice',
          width: 150,
          scopedSlots: { customRender: 'costPrice' }
        },
        {
          align: 'center',
          title: 'A价',
          dataIndex: 'aPrice',
          key: 'aPrice',
          width: 150,
          scopedSlots: { customRender: 'aPrice' }
        },
        {
          align: 'center',
          title: 'B价',
          dataIndex: 'bPrice',
          key: 'bPrice',
          width: 150,
          scopedSlots: { customRender: 'bPrice' }
        },
        {
          align: 'center',
          title: 'C价',
          dataIndex: 'cPrice',
          key: 'cPrice',
          width: 150,
          scopedSlots: { customRender: 'cPrice' }
        },
        {
          align: 'center',
          title: '效果图片',
          dataIndex: 'effectPic',
          key: 'effectPic',
          scopedSlots: { customRender: 'effectPic' }
        },
        {
          align: 'center',
          title: '核价规格',
          width: '200px',
          dataIndex: 'valencySpecs',
          key: 'valencySpecs',
          scopedSlots: { customRender: 'valencySpecs' }
        },
        {
          align: 'center',
          title: '产品名称',
          width: '200px',
          dataIndex: 'productName',
          key: 'productName',
          scopedSlots: { customRender: 'productName' }
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
      uploadPath: getUploadPath(),
      // uploadPath: 'www.baidu.com',
      valencyStatus: 0, // 单据状态
      statusName: '', // 单据状态名称
      applyUserName: '', // 申请人
      valencyCode: '',
      createTime: '',
      explainText: '',
      valencyUserName: '',
      id: 0,
      valencyProducts: [],
      valencyUserId: 0,
      effectPic: '',
      allAreas: [], // 所有产品区域
      areaPercentage: 0, // 产品区域计算用的数额
      areaRateCache: {}, //产品根据区域计算 接口缓存
      instanceId: 0,
      spinning: false
    }
  },
  computed: {
    isUpdateType: function() {
      //核价还是修改  修改增加了 产品名字和代码
      return this.$route.params.type === 'update'
    }
  },
  watch: {
    $route(to, from) {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.initArea()
      // 获取页面的一些信息
      this.getOrderInfo()
    },
    // 返回
    goBackPricing() {
      // 点击返回，返回核价单列表页
      this.$router.push({ name: 'pricing' })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('接收到来自表格的值---Received values of form: ', values)
        }
      })
    },

    // 上传效果图弹出框
    openModel(record) {
      this.openKey = record.id
      console.log('openKey :' + this.openKey)
      this.$refs.uploadModel.query({ effectPic: this.effectPic })
    },
    cancel(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
    },
    changeHandler(record, type, e) {

      /*
      isRepeatCode({newBasisModel:ivalue}).then(res =>{
          if(res.code !== 200){
            ivalue = ''
            this.$message.error('此新产品代码已重复！')
            return false
          }
        })
      */

      const v = e.target.value.trim()
      let dataSource = [...this.data]
      let target = dataSource.find(item => item.id === record.id)
      if (target) {
        target[type] = v
        this.date = dataSource
      }
    },
    // 产品区域变更
    async areaChange(record, key) {
      let that = this
      let _dataSource = [...this.data]
      let _target = _dataSource.find(item => item.id === record.id)
      if (_target) {
        _target['area'] = key
        let resultRate = await this.initPriceByArea(key)
        let calcResult = calculatePrice(_target.costPrice, resultRate)
        _target['aPrice'] = calcResult.aPrice
        _target['bPrice'] = calcResult.bPrice
        _target['cPrice'] = calcResult.cPrice
        this.data = _dataSource
        let obj = {}
        obj[`record.${record.__index}.aPrice`] = calcResult.aPrice
        obj[`record.${record.__index}.bPrice`] = calcResult.bPrice
        obj[`record.${record.__index}.cPrice`] = calcResult.cPrice
        this.form.setFieldsValue(obj)
      }
    },
    //输入成本价
    async costPriceChange(record, e) {
      let costPrice = parseFloat(e.target.value.trim())
      let _costPrice = isNaN(costPrice) ? 0 : costPrice
      let _dataSource = [...this.data]
      let _target = _dataSource.find(item => item.id === record.id)
      if (_target) {
        _target['costPrice'] = _costPrice

        let resultRate = null
        if (_target['area'] === null || _target['area'] === undefined) {
          //先选择成本价的处理
          resultRate = { Ａ价: 0, Ｂ价: 0, Ｃ价: 0 }
        } else {
          resultRate = await this.initPriceByArea(_target['area'])
        }

        let calcResult = calculatePrice(_target.costPrice, resultRate)
        _target['aPrice'] = calcResult.aPrice
        _target['bPrice'] = calcResult.bPrice
        _target['cPrice'] = calcResult.cPrice
        this.data = _dataSource
        let obj = {}
        obj[`record.${record.__index}.aPrice`] = calcResult.aPrice
        obj[`record.${record.__index}.bPrice`] = calcResult.bPrice
        obj[`record.${record.__index}.cPrice`] = calcResult.cPrice
        this.form.setFieldsValue(obj)
      }
    },
    // 最终全页面提交
    validate() {
      const that = this
      const {
        $refs: { repository, task },
        $notification
      } = this
      console.log('最终全页面保存', this)
      // 拼接核价集合
      const bodys = []
      debugger
      console.log('data======', this.data)
      that.valencyProducts = that.data.map(item => {
        let _obj = {
          id: item.id, //主键id
          saleValencyId: item.saleValencyId, //合价表id
          basisModel: item.basisModel, //依据产品代码（产品id
          demandNumber: item.demandNumber, //需求数量
          specs: item.specs, //规格
          demandRemarks: item.demandRemarks, //描述
          referencePic: item.referencePic, //参考图片地址
          costPrice: item.costPrice || 0, //成本价
          effectPic: item.effectPic, //效果图地址
          valencySpecs: item.valencySpecs, //功能介绍
          remarks: item.remarks, //备注
          bprice: item.bPrice || item.bprice || 0, //b价格
          aprice: item.aPrice || item.aprice || 0, //a价格
          cprice: item.cPrice || item.cprice || 0, //c价格
          area: item.area,
          productName:item.productName || '' //产品名称
        }
        if (that.isUpdateType) {
          _obj.newBasisModel = item.newBasisModel
          //_obj.productName = item.productName
        }
        bodys.push(_obj)
      })
      console.log('bodys======', bodys)
      const paramsz = {
        id: that.$route.params.id, // 主键id
        valencyCode: that.valencyCode, // 核价编号
        consumerId: that.consumerId, // 客户id
        demandTime: that.demandTime, // 需求日期
        valencyStatus: 3, // 状态
        applyUserId: that.applyUserId, // 申请人id
        createTime: that.createTime, // 申请时间
        valencyUserId: that.valencyUserId, // 合价人id
        receiveId: that.receiveId, // 接收人id
        receiveTime: that.receiveTime, // 接收人时间
        valencyTime: that.valencyTime, // 合价时间
        valencyProducts: bodys, // 上面拼接的核价集合
        instanceId: that.instanceId, //审批实例ID
        explainText: that.explainText
      }

      console.log(paramsz)

      if (that.isUpdateType) {
        that.spinning = true
        updateValencyProduct(paramsz)
          .then(res => {
            that.spinning = false
            console.log('修改产品信息，请求后端接口结果', res)
            that.$router.push({ name: 'pricing' }) // 提交之后跳转到核价列表页
          })
          .catch(error => {
            that.spinning = false
            console.error(error)
          })
      } else {
        // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
        that.spinning = true
        saveProduct(paramsz)
          .then(res => {
            that.spinning = false
            console.log('插入产品信息，请求后端接口结果', res)
            if (res && res.code && res.code !== 200) {
              that.$message.error(res.msg || '请求失败')
              return
            }
            that.id = res.data.id
            that.loading = false
            that.form.setFieldsValue({
              contractNum: res.data.contractNum
            })
            that.$router.push({ name: 'pricing' }) // 提交之后跳转到核价列表页
          })
          .catch(error => {
            that.spinning = false
            console.error(error)
          })
      }
    },

    async validateAction() {
      let that = this
      for (let i = 0, len = this.data.length; i < len; i++) {
        let {
          costPrice,
          aPrice,
          bPrice,
          cPrice,
          effectPic,
          valencySpecs,
          area,
          productName,
          newBasisModel
        } = this.data[i]
        if (!(parseFloat(costPrice) > 0)) {
          that.$message.error('请输入成本价')
          return
        }
        // if(isEmpty(effectPic)){
        //   that.$message.error('请上传效果图片')
        //   return
        // }
        if (isEmpty(valencySpecs)) {
          that.$message.error('请输入核价规格')
          return
        }
        if (isEmpty(area)) {
          that.$message.error('请输入产品区域')
          return
        }

        if (that.isUpdateType && parseInt(that.valencyStatus) === 5) {
          if (isEmpty(newBasisModel)) {
            that.$message.error('请输入产品代码')
            return
          }
          // if (isEmpty(productName)) {
          //   that.$message.error('请输入产品名称')
          //   return
          // }
        }
      }

      this.validate()

      function isEmpty(o) {
        return o === undefined || o === '' || o === null ? true : false
      }
    },
    scrollToField(fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    },
    moment,
    // 取消预览图片
    previewCancel() {
      this.previewVisible = false
    },
    // 预览图片
    handlePreview(file) {
      // 点击文件链接或预览图标时的回调
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    // 订单详情查询:获取页面需要的的信息
    getOrderInfo() {
      let that = this
      const params = this.$route.params
      console.log('/订单详情查询:获取页面需要的的信息id', this.$route.params.id)

      that.data = []
      that.form.resetFields()
      // 调取订单详情查询 接口
      getlookApplyNuclear(params)
        .then(res => {
          console.log('//调取订单详情查询 接口', res)
          let fillabcPriceObj = {}
          this.data = res.data.valencyProducts.map((item, index) => {
            item.__index = index
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
                scopedSlots: { customRender: 'newBasisModel' }
              },
              // {
              //   align: 'center',
              //   title: '产品名称',
              //   dataIndex: 'productName',
              //   key: 'productName',
              //   width: '200px',
              //   scopedSlots: { customRender: 'productName' }
              // }
            ]
          } else {
            // this.columns = this.columns.filter(item => {
            //   return item.dataIndex !== 'newBasisModel' && item.dataIndex !== 'productName'
            // })
          }
          that.form.setFieldsValue(res.data)
        })
        .catch(error => {
          this.loading = false
          console.error(error)
        })
    },
    // 上传效果图upChange
    upChange(data) {
      console.log('JSON 页面传值事件:' + JSON.stringify(data))
      const paramter = { effectPic: 'effectPic' }
      for (const key of this.data) {
        if (key.id == this.openKey) {
          key.effectPic = data // 参考图片   ------
        }
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
      })
    },
    initArea() {
      let that = this
      return queryTreeByArea().then(res => {
        that.allAreas = res.data.map(item => that.formatTreeData(item)).map(item => that.delLevelGt2(item))
      })
    },
    //格式化接口数据 key,title,value
    formatTreeData(item, level = 1) {
      let that = this
      let obj = {}
      obj.key = String(item.key)
      obj.title = item.title
      obj.value = String(item.key)
      obj.icon = item.icon
      obj.parentId = item.parentId
      obj.level = level
      if (level === 1) {
        obj.selectable = false
      }
      level++
      if (item.children !== null && Array.isArray(item.children)) {
        obj.children = item.children.map(v => that.formatTreeData(v, level))
      }
      return obj
    },
    delLevelGt2(item) {
      let that = this
      if (item.level > 2) {
        item.children = []
        return item
      }
      if (item.children !== null && Array.isArray(item.children)) {
        if (item.children.filter(v => v.level > 2).length > 0) {
          item.children = []
        } else {
          item.children.map(v => that.delLevelGt2(v))
        }
      }
      return item
    },
    initPriceByArea(id) {
      let that = this
      if (String(id) in that.areaRateCache) {
        return new Promise((resolve, reject) => {
          resolve(that.areaRateCache[String(id)])
        }).then(res => res)
      } else {
        return queryPriceByArea(String(id)).then(res => {
          that.areaRateCache[String(id)] = res.data
          return res.data
        })
      }
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
