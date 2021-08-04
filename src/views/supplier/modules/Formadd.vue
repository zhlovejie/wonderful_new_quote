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
      <a-form-model ref="ruleForm" :model="form" :rules="rules" class="bom-management-wrapper" layout="inline">
        <a-form-model-item label="供应商属性">
          <a-select placeholder="供应商属性" v-model="form.supplierType" :allowClear="true" style="width: 250px">
            <a-select-option :value="0">物料供应商</a-select-option>
            <a-select-option :value="1">委外加工商</a-select-option>
          </a-select></a-form-model-item
        >
        <div class="card-item">
          <div class="__hd">选择供应商物料（非必填）</div>
          <div class="__bd">
            <a-form-model-item>
              <a-select
                style="width: 450px"
                show-search
                :value="form.materialItem.__label"
                placeholder="模糊搜索"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="allMaterialFuzzySearch.fetching ? undefined : '未找到匹配项'"
                @search="allMaterialFuzzySearchAction"
                @change="(key) => allMaterialFuzzySearchActionChange(key, record)"
              >
                <a-spin v-if="allMaterialFuzzySearch.fetching" slot="notFoundContent" size="small" />
                <a-select-option v-for="item in allMaterialFuzzySearch.list" :key="item.__key" :value="item.__key">
                  {{ item.__label }}
                </a-select-option>
              </a-select>
              <a-button key="submit" type="primary" style="margin-left: 10px" :loading="spinning" @click="brandAdd"
                >新增</a-button
              >
            </a-form-model-item>
          </div>
        </div>
        <a-form-model-item label="已选物料">(品牌及型号非必填) </a-form-model-item>
        <table class="custom-table custom-table-border">
          <tr v-for="(item, index) in brandList" :key="index">
            <td>{{ item.materialName }}{{ item.materialCode }}</td>
            <td>
              {{
                item.manageBrands.map((u) => u.brandName + '/' + u.manageBrandModels.map((i) => i.modelName)).join(',')
              }}
            </td>
            <td>
              <a-button @click="Addmodel(item)" style="margin-right: 10px">添加品牌型号</a-button>
              <a-button @click="modelDel(index)">删除</a-button>
            </td>
          </tr>
        </table>

        <div class="card-item">
          <div class="__hd">选择供应商属性</div>
          <div class="__bd">
            <a-form-model-item label="是否为平台类" prop="platformType">
              <a-select
                placeholder="请选择是否为平台"
                v-model="form.platformType"
                :allowClear="true"
                style="width: 200px"
              >
                <a-select-option :value="0">否</a-select-option>
                <a-select-option :value="1">是</a-select-option>
              </a-select></a-form-model-item
            >
            <a-form-model-item ref="platformName" label="所在平台为" prop="platformName">
              <a-input
                placeholder="请输入交易平台名称"
                v-model="form.platformName"
                :allowClear="true"
                @blur="
                  () => {
                    $refs.platformName.onFieldBlur()
                  }
                "
                style="width: 100%"
            /></a-form-model-item>
            <a-form-model-item label="供应商规模" prop="supplierScale">
              <a-select
                placeholder="选择供应商规模"
                v-model="form.supplierScale"
                :allowClear="true"
                style="width: 200px"
              >
                <a-select-option :value="0">小规模</a-select-option>
                <a-select-option :value="1">一般规模</a-select-option>
              </a-select></a-form-model-item
            >
          </div>
        </div>
        <div class="card-item">
          <div class="__hd">补全供应商信息</div>
          <div class="__bd">
            <a-row :gutter="[16, 24]">
              <a-col :span="12">
                <a-form-model-item ref="scompanyName" label="供应商公司名称" prop="scompanyName">
                  <a-input
                    placeholder="请输入供应商公司名称"
                    v-model="form.scompanyName"
                    :allowClear="true"
                    @blur="
                      () => {
                        $refs.scompanyName.onFieldBlur()
                      }
                    "
                    style="width: 250px"
                /></a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item ref="pshopName" label="平台店铺名称" prop="pshopName">
                  <a-input
                    placeholder="请输入平台店铺名称"
                    v-model="form.pshopName"
                    :allowClear="true"
                    @blur="
                      () => {
                        $refs.pshopName.onFieldBlur()
                      }
                    "
                    style="width: 250px"
                /></a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="[16, 24]">
              <a-col :span="12">
                <a-form-model-item ref="salesmanName" label="  业务员姓名  " prop="salesmanName">
                  <a-input
                    placeholder="请输入业务员姓名"
                    v-model="form.salesmanName"
                    :allowClear="true"
                    @blur="
                      () => {
                        $refs.salesmanName.onFieldBlur()
                      }
                    "
                    style="width: 270px"
                /></a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item ref="pcontactMode" label="平台联系方式" prop="pcontactMode">
                  <a-input
                    placeholder="请输入平台联系方式"
                    v-model="form.pcontactMode"
                    :allowClear="true"
                    @blur="
                      () => {
                        $refs.pcontactMode.onFieldBlur()
                      }
                    "
                    style="width: 250px" /></a-form-model-item
              ></a-col>
            </a-row>
            <a-row :gutter="[16, 24]">
              <a-col :span="12">
                <a-form-model-item ref="salesmanPhone" label="业务员手机号" prop="salesmanPhone">
                  <a-input
                    placeholder="请输入业务员手机号"
                    v-model="form.salesmanPhone"
                    :allowClear="true"
                    @blur="
                      () => {
                        $refs.salesmanPhone.onFieldBlur()
                      }
                    "
                    style="width: 260px" /></a-form-model-item
              ></a-col>
              <a-col :span="12">
                <a-form-model-item ref="salesmanWeChat" label="业务员微信号" prop="salesmanWeChat">
                  <a-input
                    placeholder="请输入业务员微信号"
                    v-model="form.salesmanWeChat"
                    :allowClear="true"
                    @blur="
                      () => {
                        $refs.salesmanWeChat.onFieldBlur()
                      }
                    "
                    style="width: 250px"
                /></a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="[16, 24]">
              <a-col :span="12">
                <a-form-model-item label="成立年限" prop="establishYearId">
                  <a-select
                    placeholder="选择成立年限"
                    v-model="form.establishYearId"
                    :allowClear="true"
                    style="width: 290px"
                  >
                    <a-select-option :value="0">现款现货</a-select-option>
                    <a-select-option :value="1">帐期结算</a-select-option>
                  </a-select></a-form-model-item
                >
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="诚信级别" prop="sincerityLevelId">
                  <a-select
                    placeholder="选择诚信级别"
                    v-model="form.sincerityLevelId"
                    :allowClear="true"
                    style="width: 280px"
                  >
                    <a-select-option :value="0">现款现货</a-select-option>
                    <a-select-option :value="1">帐期结算</a-select-option>
                  </a-select></a-form-model-item
                >
              </a-col>
            </a-row>
            <a-row :gutter="[16, 24]">
              <a-col :span="12">
                <a-form-model-item label="结算方式" prop="settlementMode">
                  <a-select
                    placeholder="选择结算方式"
                    v-model="form.settlementMode"
                    :allowClear="true"
                    style="width: 290px"
                  >
                    <a-select-option :value="0">现款现货</a-select-option>
                    <a-select-option :value="1">帐期结算</a-select-option>
                  </a-select></a-form-model-item
                >
              </a-col>
            </a-row>
            <div v-if="form.settlementMode === 0" class="form wdf-form">
              <a-row class="wdf-row">
                <!-- <a-col class="col-border" :span="4">结算方式及付款比列</a-col> -->
                <a-col class :span="20">
                  <a-row type="flex" align="middle">
                    <!-- 预付款 -->
                    <a-col :span="20">
                      <a-row type="flex" justify="space-around" align="middle">
                        <a-col :span="4" :offset="1">
                          <a-form-model-item>
                            <a-checkbox-group v-model="c1">
                              <a-checkbox :value="1" name="type" @change="checkboxChange"> 预付款 </a-checkbox>
                            </a-checkbox-group>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-model-item>
                            <a-input-number
                              placeholder="填入数字"
                              v-decorator="[
                                'convention.4.number',
                                { initialValue: 30, rules: [{ required: false, message: '填写进度款' }] },
                              ]"
                              :min="0"
                              :max="100"
                              :precision="0"
                              style="width: 200px"
                            />
                            <span> %</span>
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                    </a-col>
                    <!-- 预付款 END-->
                    <!-- 提货款 -->
                    <a-col :span="20">
                      <a-row type="flex" justify="space-around" align="middle">
                        <a-col :span="4" :offset="1">
                          <a-form-model-item>
                            <a-checkbox
                              @change="checkboxChange"
                              v-decorator="['convention.2.selected', { initialValue: false, valuePropName: 'checked' }]"
                            >
                              <span class="checkbox-innerspan mar-l0">提货款</span>
                            </a-checkbox>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-model-item>
                            <a-input-number
                              placeholder="填入数字"
                              v-decorator="[
                                'convention.2.number',
                                { initialValue: 0, rules: [{ required: false, message: '填写进度款' }] },
                              ]"
                              :min="0"
                              :max="100"
                              :precision="0"
                              style="width: 200px"
                            />
                            <span> %</span>
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                    </a-col>
                    <!-- 提货款 END-->
                  </a-row>
                  <a-row class="row-in-col" type="flex" align="middle">
                    <!-- 验收款 -->
                    <a-col :span="20">
                      <a-row type="flex" justify="space-around" align="middle">
                        <a-col :span="4" :offset="1">
                          <a-form-model-item>
                            <a-checkbox
                              @change="checkboxChange"
                              v-decorator="['convention.5.selected', { initialValue: false, valuePropName: 'checked' }]"
                            >
                              <span class="checkbox-innerspan mar-l0">验收款</span>
                            </a-checkbox>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-model-item>
                            <a-input-number
                              placeholder="填入数字"
                              v-decorator="[
                                'convention.5.number',
                                { initialValue: 0, rules: [{ required: true, message: '填写提货款' }] },
                              ]"
                              :min="0"
                              :max="100"
                              :precision="0"
                              style="width: 200px"
                            />
                            <span> %</span>
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                    </a-col>
                    <!-- 提货款 END-->
                    <!-- 质保金 -->
                    <a-col :span="20">
                      <a-row type="flex" justify="space-around" align="middle">
                        <a-col :span="4" :offset="1">
                          <a-form-model-item>
                            <a-checkbox
                              @change="checkboxChange"
                              v-decorator="['convention.3.selected', { initialValue: false, valuePropName: 'checked' }]"
                            >
                              <span class="checkbox-innerspan mar-l0">质保金</span>
                            </a-checkbox>
                          </a-form-model-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-model-item>
                            <a-input-number
                              placeholder="填入数字"
                              v-decorator="[
                                'convention.3.number',
                                { initialValue: 0, rules: [{ required: true, message: '填写验收款' }] },
                              ]"
                              :min="0"
                              :max="100"
                              :precision="0"
                              style="width: 200px"
                            />
                            <span> %</span>
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                    </a-col>
                    <!-- 验收款 END-->
                  </a-row>
                </a-col>
              </a-row>
              <!-- <a-row :gutter="[16, 24]">
                <a-col :span="">
                  <a-form-model-item ref="salesmanName" label="预付款" prop="salesmanName">
                    <a-input
                      placeholder="请输入业务员姓名"
                      v-model="form.salesmanName"
                      :allowClear="true"
                      @blur="
                        () => {
                          $refs.salesmanName.onFieldBlur()
                        }
                      "
                      style="width: 270px"
                  /></a-form-model-item>
                </a-col>
              </a-row> -->
              <!-- 预付款 -->
            </div>
            <div v-else>付款周期</div>
          </div>
        </div>
      </a-form-model>

      <Approval ref="approval" @opinionChange="opinionChange" />
      <BrandFrom ref="brandFrom" @brandChange="brandChange" />
    </a-spin>
  </a-modal>
</template>
<script>
//物料代码模糊搜索
import { routineMaterialInfoPageList } from '@/api/routineMaterial'
import { other_addAndUpdate, other_approval, other_detail } from '@/api/bonus_management'
import Approval from './Approval'
import BrandFrom from './BrandFrom'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
    BrandFrom: BrandFrom,
  },
  data() {
    this.allMaterialFuzzySearchAction = this.$_.debounce(this.allMaterialFuzzySearchAction, 800)
    return {
      remark: '',
      visible: false,
      spinning: false,
      brandList: [],
      c1: [], //预付款
      c2: [], //提货款
      c3: [], // 验收款
      c4: [], //质保金
      form: {
        replaceMaterialItem: '', // 替换物料
        materialItem: {},
        supplierType: undefined,
        platformType: undefined,
        platformName: undefined,
        supplierScale: undefined,
        scompanyName: undefined,
        pshopName: undefined,
        pcontactMode: undefined,
        salesmanName: undefined,
        salesmanPhone: undefined,
        salesmanWeChat: undefined,
        settlementMode: 0,
        sincerityLevelId: undefined,
        establishYearId: undefined,
      },
      type: 'view',
      record: {},
      rules: {
        salesmanWeChat: [{ required: true, message: '请输入业务员微信号', trigger: 'blur' }],
        salesmanPhone: [{ required: true, message: '请输入业务员手机号', trigger: 'blur' }],
        salesmanName: [{ required: true, message: '请输入业务员名称', trigger: 'blur' }],
        pcontactMode: [{ required: true, message: '请输入平台联系方式', trigger: 'blur' }],
        pshopName: [{ required: true, message: '请输入平台店铺名称', trigger: 'blur' }],
        scompanyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        platformName: [{ required: true, message: '请输入交易平台名称', trigger: 'blur' }],
        platformType: [{ required: true, message: '请选择是否为平台', trigger: 'change' }],
        supplierScale: [{ required: true, message: '选择供应商规模', trigger: 'change' }],
        settlementMode: [{ required: true, message: '选择结算方式', trigger: 'change' }],
        sincerityLevelId: [{ required: true, message: '选择诚信级别', trigger: 'change' }],
        establishYearId: [{ required: true, message: '选择成立年限', trigger: 'change' }],
      },
      records: {},
      allMaterialFuzzySearch: {
        //全部物料搜索
        list: [],
        item: {},
        fetching: false,
      },
    }
  },

  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改供应商'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : this.isView5 ? '查看' : '新增'
      return `${txt}供应商`
    },
    isView() {
      //查看
      return this.type === 'view'
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
  },
  created() {},
  methods: {
    moment,
    checkboxChange(event) {
      console.log(event.target.value)
      this.$nextTick(() => this.autoFill())
    },
    autoFill() {
      this.autoFillAction(true)
    },
    autoFillAction(isNormal = true) {
      //自动补全 100%
      let that = this
      // // const { convention } = this.form.getFieldsValue()
      // let target = convention
      // let targetKey = 'convention'
      // let localKey = 'c'
      // let money = that.queryOneData.totalAmount
      // target = target.map((item, index) => {
      //   if (item && index >= 1) {
      //     item.__dateKey__ = `${localKey}${index}` //内部数据用
      //     item.__formKey__ = `${targetKey}.${index}.number` //显示用
      //   }
      //   return item
      // })
      // // debugger

      // //是否选择了 质保金和预付款
      // let rateSelected = target.filter((item, index) => item.selected && (index === 1 || index === 4))
      // //是否选择了 进度款、提货款、验收款
      // let currentSelectIsNotRate = target.filter((item, index) => item && item.selected && [2, 3, 5].includes(index))
      // if (rateSelected.length > 0 && currentSelectIsNotRate.length > 0) {
      //   //剩余比例
      //   let _rate = 100
      //   let _oneSelected = currentSelectIsNotRate.length === 1
      //   _rate = rateSelected.reduce((rate, item) => rate - item.number, _rate)
      //   //减去用户填写的比例外 剩下的可分配比例
      //   _rate = _oneSelected
      //     ? _rate
      //     : currentSelectIsNotRate.reduce((rate, item) => (item.number > 0 ? rate - item.number : rate), _rate)

      //   let _rate_tmp = _rate
      //   if (_rate_tmp <= 0) return //无比例可分

      //   let _result = _oneSelected
      //     ? currentSelectIsNotRate
      //     : currentSelectIsNotRate.filter((item) => item.number === undefined || item.number === 0)
      //   if (_result.length <= 0) return
      //   let _avg = parseInt(_rate_tmp / _result.length)
      //   let obj = {}
      //   _result.map((item, index, arr) => {
      //     let _last = index === arr.length - 1
      //     if (!_last) {
      //       _rate_tmp = _rate_tmp - _avg
      //     }
      //     let _ss = _last ? _rate_tmp : _avg

      //     obj[item.__formKey__] = _ss
      //     this[item.__dateKey__] = this._calculateAmount(_ss, money)
      //   })

      // Object.keys(obj).length > 0 && this.form.setFieldsValue(obj)
      // }
    },
    brandChange(data) {
      console.log(data)
      let react = this.brandList.find((i) => i.materialId === this.records.materialId)
      react.manageBrands = [...data]
    },
    brandAdd() {
      console.log('新增')
      let that = this
      if (JSON.stringify(that.form.materialItem) !== '{}') {
        that.brandList.push(that.form.materialItem)
      } else {
        that.$message.info('请先选择供应物料')
      }
    },
    Addmodel(record) {
      //添加品牌型号
      let that = this
      that.records = record
      that.$refs.brandFrom.query(record)
    },
    modelDel(index) {
      //删除品牌型号
      this.brandList.splice(index, 1)
    },
    async allMaterialFuzzySearchAction(wd) {
      const that = this
      const _searchParam = {
        current: 1,
        size: 50,
        materialCode: wd,
      }
      that.allMaterialFuzzySearch = { ...that.materialFuzzySearch, fetching: true }
      const res = await Promise.all([
        routineMaterialInfoPageList(_searchParam)
          .then((res) => {
            if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
              return []
            }
            return res.data.records
          })
          .catch((err) => []),
      ])
      const result = [...res[0]].map((item, index) => {
        item.__key = uuid()
        item.__label = `${item.materialName}(${item.materialCode})`
        // item.specification
        return item
      })
      that.allMaterialFuzzySearch = { ...that.allMaterialFuzzySearch, fetching: false, list: result }
    },
    allMaterialFuzzySearchActionChange(key) {
      const that = this
      const target = that.allMaterialFuzzySearch.list.find((item) => item.__key === key)
      that.form = {
        ...that.form,
        materialItem: { ...target, ...{ materialId: target.id, manageBrands: [] } },
        replacedMaterialNum: target.materialNum || 0,
      }
      that.allMaterialFuzzySearch = { ...that.allMaterialFuzzySearch, item: { ...target } }
      //form.beReplacedMaterialNum : form.replacedMaterialNum"
      //replacedMaterialNum:target.materialNum || 0
    },
    //接受数据
    async query(type, record) {
      const that = this
      that.allMaterialFuzzySearch = { ...that.allMaterialFuzzySearch, list: [] }
      that.visible = true
      that.type = type
      that.record = record
      if (type !== 'add') {
        let detail = await other_detail({ id: record.id }).then((res) => res.data)
        await Promise.all([
          getStationList({ id: detail.departmentId }).then((res) => {
            that.postSelectDataSource = res.data
          }),
          getUserByStation({ stationId: detail.stationId, showLeaveFlag: 1 }).then(
            (res) => (that.personSelectDataSource = res.data)
          ),
        ])
        // that.form.setFieldsValue(detail)
        that.fillData(detail)
      }
    },
    // 详情
    fillData(detail) {
      const that = this
      that.$nextTick(() => {
        // that.form.setFieldsValue({
        //   amount: detail.amount,
        //   departmentId: detail.departmentId,
        //   itemType: detail.itemType,
        //   reason: detail.reason,
        //   stationId: detail.stationId,
        //   userId: detail.userId,
        //   remark: detail.remark,
        // })
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
            if (that.type === 'edit-salary') {
              values.id = that.record.id
            }
            if (that.type === 'add' || that.type === 'edit-salary') {
              that.spinning = true
              other_addAndUpdate(values)
                .then((res) => {
                  this.programme = []
                  this.visible = false
                  that.spinning = false
                  that.form.resetFields() // 清空表
                  that.$message.info(res.msg)
                  that.$emit('finish')
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
      other_approval(values)
        .then((res) => {
          that.spinning = false
          // that.form.resetFields() // 清空表
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
.card-item {
  margin-bottom: 20px;
}
.__hd {
  font-size: 100%;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  font-weight: bold;
}
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  /* border: none; */
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

.col-border {
  padding: 10px 0;
  border-bottom: none;
  min-height: 60px;
  box-sizing: border-box;
}

.col-border ~ .col-border {
  border-left: none;
}

.wdf-form {
  margin-top: 12px;
  padding: 12px;
}

.btns-grop {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
}

.btns-grop button:not(first-child) {
  margin-left: 12px;
}

.ant-row.ant-form-item {
  margin-bottom: 0;
}

.year-select {
  width: 100px;
  margin: 0 18px 0 8px;
}

.inner-col-div {
  float: left;
  width: 50%;
}

.checkbox-innerspan {
  margin: 0 10px 0 12px;
}

.mar-l0 {
  margin-left: 0;
}

.date {
  width: 120px;
}

.select-prop {
  width: 80px;
}

.row-in-col {
  padding: 16px 0 8px;
}

.item-select {
  display: inline-block;
}
</style>
