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
            <td>{{ item.materialCode }}</td>
            <td>
              <a-button @click="Addmodel" style="margin-right: 10px">添加品牌型号</a-button>
              <a-button @click="modelDel(index)">删除</a-button>
            </td>
          </tr>
        </table>
      </a-form-model>

      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
//物料代码模糊搜索
import { routineMaterialInfoPageList } from '@/api/routineMaterial'
import { other_addAndUpdate, other_approval, other_detail } from '@/api/bonus_management'
import Approval from './Approval'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
  },
  data() {
    this.allMaterialFuzzySearchAction = this.$_.debounce(this.allMaterialFuzzySearchAction, 800)
    return {
      remark: '',
      visible: false,
      spinning: false,
      brandList: [],
      form: {
        replaceMaterialItem: '', // 替换物料
        materialItem: {},
        supplierType: undefined,
      },
      type: 'view',
      record: {},
      rules: {},
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
    brandAdd() {
      console.log('新增')
      let that = this
      if (JSON.stringify(that.form.materialItem) !== '{}') {
        that.brandList.push(that.form.materialItem)
      } else {
        that.$message.info('请先选择供应物料')
      }
    },
    Addmodel() {
      //添加品牌型号
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
        materialItem: { ...target },
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
  border: none;
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
</style>
