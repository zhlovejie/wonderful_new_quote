<template>
  <a-modal
    title="BOM成批修改"
    :width="1000"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="spinning">
      <div class="bom-batch-update-wrapper">
        <div
          class="step1-item"
          v-show="step === 1"
        >
          <a-alert
            message="BOM成批修改"
            type="info"
            show-icon
          >
            <div slot="description">
              <div>将不同物料的具有相同物料代码的下级物料进行批量替换</div>
            </div>
          </a-alert>
          <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            class="bom-management-wrapper"
            layout="inline"
          >
            <div class="card-item">
              <div class="__hd">父项物料</div>
              <div class="__bd">
                <a-radio-group
                  name="radioGroup"
                  v-model="form.caseType"
                  @change="caseTypeChange"
                >
                  <p>
                    <a-form-model-item>
                      <a-radio :value="1" />
                    </a-form-model-item>
                    <a-form-model-item label="单个物料">
                      <a-select
                        style="width:450px;"
                        show-search
                        :value="bomFuzzySearch.item.__label"
                        placeholder="模糊搜索"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="bomFuzzySearch.fetching ? undefined : '未找到匹配项'"
                        @search="bomFuzzySearchAction"
                        @change="(key) => bomFuzzySearchActionChange(key)"
                      >
                        <a-spin
                          v-if="bomFuzzySearch.fetching"
                          slot="notFoundContent"
                          size="small"
                        />
                        <a-select-option
                          v-for="item in bomFuzzySearch.list"
                          :key="item.__key"
                          :value="item.__key"
                        >
                          {{ item.__label }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </p>
                  <p>
                    <a-form-model-item>
                      <a-radio :value="2">常规物料库</a-radio>
                    </a-form-model-item>
                  </p>
                  <p>
                    <a-form-model-item>
                      <a-radio :value="3">成品物料库</a-radio>
                    </a-form-model-item>
                  </p>
                </a-radio-group>
              </div>
            </div>
            <div class="card-item">
              <div class="__hd">子项物料</div>
              <div class="__bd">
                <a-table
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="false"
                  size="small"
                >
                  <div
                    slot="replacedMaterialCode"
                    slot-scope="text, record, index"
                  >
                    <a-form-model-item v-if="record.key === 1">
                      <a-select
                        style="width:450px;"
                        show-search
                        :value="materialFuzzySearch.item.__label"
                        placeholder="模糊搜索"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="materialFuzzySearch.fetching ? undefined : '未找到匹配项'"
                        @search="materialFuzzySearchAction"
                        @change="(key) => materialFuzzySearchActionChange(key,record)"
                      >
                        <a-spin
                          v-if="materialFuzzySearch.fetching"
                          slot="notFoundContent"
                          size="small"
                        />
                        <a-select-option
                          v-for="item in materialFuzzySearch.list"
                          :key="item.__key"
                          :value="item.__key"
                        >
                          {{ item.__label }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>

                    <a-form-model-item v-if="record.key === 2">
                      <a-select
                        style="width:450px;"
                        show-search
                        :value="allMaterialFuzzySearch.item.__label"
                        placeholder="模糊搜索"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="allMaterialFuzzySearch.fetching ? undefined : '未找到匹配项'"
                        @search="allMaterialFuzzySearchAction"
                        @change="(key) => allMaterialFuzzySearchActionChange(key,record)"
                      >
                        <a-spin
                          v-if="allMaterialFuzzySearch.fetching"
                          slot="notFoundContent"
                          size="small"
                        />
                        <a-select-option
                          v-for="item in allMaterialFuzzySearch.list"
                          :key="item.__key"
                          :value="item.__key"
                        >
                          {{ item.__label }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </div>

                  <div
                    slot="replacedMaterialNum"
                    slot-scope="text, record, index"
                  >
                    <a-input-number
                      @change="(v) => replacedMaterialNumChange(v,record)"
                      :value="record.key === 1 ? form.beReplacedMaterialNum : form.replacedMaterialNum"
                      :min="0"
                      :max="9999999999"
                    />
                  </div>

                  <div
                    slot="replacedMaterialUnit"
                    slot-scope="text, record, index"
                  >
                    <template v-if="record.key === 1">
                      {{
                        {1:'支',2:'把',3:'件'}[form.replaceMaterialItem.mainUnit || form.replaceMaterialItem.materialUnit] ||
                        (form.replaceMaterialItem.mainUnit || form.replaceMaterialItem.materialUnit)
                      }}
                    </template>
                    <template v-if="record.key === 2">
                      {{
                        {1:'支',2:'把',3:'件'}[form.materialItem.mainUnit || form.materialItem.materialUnit] ||
                        (form.materialItem.mainUnit || form.materialItem.materialUnit)
                      }}
                    </template>
                  </div>

                  <template
                    slot="footer"
                    slot-scope="currentPageData"
                  >
                    <a-form-model-item>
                      <a-checkbox v-model="form.isKeepStoreAddress">替换物料时保持原物料在BOM中对应的仓库和仓位</a-checkbox>
                    </a-form-model-item>
                  </template>
                </a-table>
              </div>
            </div>
            <div class="card-item">
              <div class="__hd">替换选项</div>
              <div class="__bd">
                <p>
                  <a-form-model-item label="使用状态">
                    <a-select
                      style="width: 200px"
                      allowClear
                      v-model="form.useStatus"
                    >
                      <a-select-option :value="0">未使用</a-select-option>
                      <a-select-option :value="1">使用</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="审核状态">
                    <a-select
                      style="width: 200px"
                      allowClear
                      v-model="form.status"
                    >
                      <a-select-option :value="0">待审核</a-select-option>
                      <a-select-option :value="1">待审批</a-select-option>
                      <a-select-option :value="2">通过</a-select-option>
                      <a-select-option :value="3">不通过</a-select-option>
                      <a-select-option :value="4">已反审核</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </p>
              </div>
            </div>
          </a-form-model>
        </div>

        <div
          class="step2-item"
          v-show="step === 2"
        >
          <a-table
            :columns="listColumns"
            :dataSource="listDataSource"
            :pagination="pagination"
            :loading="loading"
          >
            <div
              slot="modelType"
              slot-scope="text, record, index"
            >
              <a-tooltip>
                <template slot="title">
                  {{text}}
                </template>
                <span class="icon-required">查看</span>
                <a-icon
                  type="question-circle"
                  style="margin-left:5px;color:#1890ff;"
                />
              </a-tooltip>
            </div>
          </a-table>
        </div>

        <div
          class="card-item"
          style="text-align: center;margin-top:20px;"
        >
          <a-button
            style="margin:0 5px;"
            @click="doAction('cancel')"
          >取消</a-button>
          <a-button
            style="margin:0 5px;"
            type="primary"
            v-show="step === 2"
            @click="doAction('prev')"
          >上一步</a-button>
          <a-button
            style="margin:0 5px;"
            type="primary"
            v-show="step === 1"
            @click="doAction('next')"
          >下一步</a-button>
          <a-button
            style="margin:0 5px;"
            type="primary"
            v-show="step === 2"
            @click="doAction('ok')"
          >完成</a-button>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
//物料代码模糊搜索
import { routineMaterialInfoPageList, productMaterialInfoPageList } from '@/api/routineMaterial'

import {
  updateBatchChildDetailList,
  updateBatchChildDetail,
  listMaterialForm,
  listMaterialFormChildDetailByBomIdAndCode
} from '@/api/bomManagement'
const uuid = () =>
  Math.random()
    .toString(16)
    .slice(2)
export default {
  name: 'bom-batch-update',
  data() {
    this.bomFuzzySearchAction = this.$_.debounce(this.bomFuzzySearchAction, 800)
    this.materialFuzzySearchAction = this.$_.debounce(this.materialFuzzySearchAction,800)
    this.allMaterialFuzzySearchAction = this.$_.debounce(this.allMaterialFuzzySearchAction, 800)
    return {
      step: 1,
      visible: false,
      spinning: false,
      bomFuzzySearch: {
        //bom模糊搜索
        list: [],
        item: {},
        fetching: false
      },
      materialFuzzySearch: {
        //物料搜索
        list: [],
        item: {},
        fetching: false
      },
      allMaterialFuzzySearch: {
        //全部物料搜索
        list: [],
        item: {},
        fetching: false
      },
      form: {
        caseType: 1,
        useStatus: 0, // 使用状态
        status: 0, // 审核状态
        isKeepStoreAddress: false,
        bomItem: {}, // 单个物料
        materialItem: {}, // 被替换物料
        replaceMaterialItem: {}, // 替换物料

        beReplacedMaterialNum: 0, //被替换物料数量
        replacedMaterialNum: 0 //替换物料数量
      },
      rules: {},
      columns: [
        {
          align: 'center',
          title: '类别',
          dataIndex: 'category'
        },
        {
          align: 'center',
          title: '物料代码',
          dataIndex: 'replacedMaterialCode',
          scopedSlots: { customRender: 'replacedMaterialCode' }
        },
        {
          align: 'center',
          title: '用量',
          dataIndex: 'replacedMaterialNum',
          scopedSlots: { customRender: 'replacedMaterialNum' }
        },
        {
          align: 'center',
          title: '辅计量单位',
          dataIndex: 'replacedMaterialUnit',
          scopedSlots: { customRender: 'replacedMaterialUnit' }
        }
      ],
      dataSource: [
        {
          key: 1,
          category: '被替换物料',
          replacedMaterialCode: '',
          replacedMaterialName: '',
          replacedMaterialNum: undefined,
          replacedMaterialUnit: ''
        },
        {
          key: 2,
          category: '替换物料',
          replacedMaterialCode: '',
          replacedMaterialName: '',
          replacedMaterialNum: undefined,
          replacedMaterialUnit: ''
        }
      ],
      listColumns: [
        {
          align: 'center',
          title: 'BOM单号',
          dataIndex: 'bomCode'
        },
        {
          align: 'center',
          title: '父项物料编码',
          dataIndex: 'materialCode'
        },
        {
          align: 'center',
          title: '父项物料名称',
          dataIndex: 'materialName'
        },
        {
          align: 'center',
          title: '父项规格型号',
          dataIndex: 'modelType',
          scopedSlots: { customRender: 'modelType' }
        },
        {
          align: 'center',
          title: '备注',
          dataIndex: 'remark'
        }
      ],
      listDataSource: [],
      pagination: {
        showTotal: total => `共有 ${total} 条数据`
      },
      loading: false
    }
  },
  methods: {
    query(type) {
      this.step = 1
      this.visible = true
    },
    doAction(type) {
      const that = this
      if (type === 'cancel') {
        that.caseTypeChange()
        that.$refs['ruleForm'].resetFields()
        that.$nextTick(() => that.visible = false)
      } else if (type === 'prev') {
        that.step = 1
      } else if (type === 'next') {
        that.step = 2
        console.log(that.form)
        that.$nextTick(() => that.searchAction())
      } else if (type === 'ok') {
        that.spinning = true

        const { bomItem, materialItem, replaceMaterialItem } = that.form
        const params = {
          ...that.form,
          materialCode: that.form.bomItem.materialCode,
          materialType: that.form.caseType === 2 ? 2 : that.form.caseType === 3 ? 1 : undefined,

          replacedMaterialName: materialItem.materialName,
          replacedMaterialCode: materialItem.materialCode,
          // replacedMaterialUnit:replaceMaterialItem.mainut,

          beReplacedMaterialCode: replaceMaterialItem.materialCode
        }
        delete params.bomItem
        delete params.materialItem
        delete params.replaceMaterialItem

        const _searchParam = Object.assign({}, params, {
          isKeepStoreAddress: that.form.isKeepStoreAddress ? 1 : 2
        })
        updateBatchChildDetail(_searchParam)
          .then(res => {
            that.spinning = false
            that.handleCancel()
            that.$emit('finish')
          })
          .catch(err => {
            console.log(err)
            that.spinning = false
          })
        // that.visible = false
      }
    },
    searchAction() {
      const that = this
      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      const { bomItem, materialItem, replaceMaterialItem } = that.form
      const params = {
        ...that.form,
        materialCode: that.form.bomItem.materialCode,
        materialType: that.form.caseType === 2 ? 2 : that.form.caseType === 3 ? 1 : undefined,

        replacedMaterialName: materialItem.materialName,
        replacedMaterialCode: materialItem.materialCode,
        // replacedMaterialUnit:replaceMaterialItem.mainut,

        beReplacedMaterialCode: replaceMaterialItem.materialCode
      }
      delete params.bomItem
      delete params.materialItem
      delete params.replaceMaterialItem
      // return
      const _searchParam = Object.assign({}, params, paginationParam, {
        isKeepStoreAddress: that.form.isKeepStoreAddress ? 1 : 2
      })
      that.loading = true
      updateBatchChildDetailList(_searchParam)
        .then(res => {
          that.loading = false
          that.listDataSource = res.data.map((item, index) => {
            item.key = index + 1
            return item
          })
        })
        .catch(err => (that.loading = false))
    },
    async bomFuzzySearchAction(wd) {
      const that = this
      that.bomFuzzySearch = { ...that.bomFuzzySearch, fetching: true }
      const result = await listMaterialForm({ current: 1, size: 20, materialCode: wd }).then(res => {
        return res.data.records.map(item => {
          item.__key = uuid()
          item.__label = `${item.materialName}(${item.materialCode})-${item.bomCode}`
          item.__value = item.id
          return item
        })
      })
      that.bomFuzzySearch = { ...that.bomFuzzySearch, fetching: false, list: result }
    },
    bomFuzzySearchActionChange(key) {
      const that = this
      const target = that.bomFuzzySearch.list.find(item => item.__key === key)
      that.form = { ...that.form, bomItem: { ...target } }
      that.bomFuzzySearch = { ...that.bomFuzzySearch, item: { ...target } }
    },
    async allMaterialFuzzySearchAction(wd) {
      const that = this
      const _searchParam = {
        current: 1,
        size: 50,
        materialCode: wd
      }
      that.allMaterialFuzzySearch = { ...that.materialFuzzySearch, fetching: true }
      const res = await Promise.all([
        routineMaterialInfoPageList(_searchParam)
          .then(res => {
            if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
              return []
            }
            return res.data.records
          })
          .catch(err => []),
        // productMaterialInfoPageList(_searchParam)
        //   .then(res => {
        //     if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
        //       return []
        //     }
        //     return res.data.records
        //   })
        //   .catch(err => [])
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
      const target = that.allMaterialFuzzySearch.list.find(item => item.__key === key)
      that.form = {
        ...that.form,
        materialItem: { ...target },
        replacedMaterialNum:target.materialNum || 0
      }
      that.allMaterialFuzzySearch = { ...that.allMaterialFuzzySearch, item: { ...target } }
      //form.beReplacedMaterialNum : form.replacedMaterialNum"
      //replacedMaterialNum:target.materialNum || 0
    },
    async materialFuzzySearchAction(wd) {
      const that = this
      const caseType = that.form.caseType
      const caseBom = +caseType === 1
      const caseNormal = +caseType === 2
      const caseProduct = +caseType === 3

      if (caseBom) {
        const bomId = that.form.bomItem ? that.form.bomItem.id : null
        if (!bomId) {
          that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: false, list: [] }
          return
        }
        that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: true }
        const params = { bomId, materialCode: wd }
        const result = await listMaterialFormChildDetailByBomIdAndCode(params).then(res => {
          return res.data.map(item => {
            item.__key = uuid()
            item.__label = `${item.materialName}(${item.materialCode})`
            // item.specification
            return item
          })
        })
        that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: false, list: result }
      } else {
        const params = { current: 1, size: 50, materialCode: wd }
        that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: true }
        // const api = caseNormal ? routineMaterialInfoPageList : productMaterialInfoPageList
        const api = routineMaterialInfoPageList
        const res = await api(params)
          .then(res => {
            if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
              return []
            }
            return res.data.records
          })
          .catch(err => [])

        const result = res.map((item, index) => {
          item.__key = uuid()
          item.__label = `${item.materialName}(${item.materialCode})`
          // item.specification
          return item
        })

        // let res = await Promise.all(
        //   [
        //     routineMaterialInfoPageList(params).then(res => {
        //       if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
        //         return []
        //       }
        //       return res.data.records
        //     }).catch(err => []),
        //     productMaterialInfoPageList(params).then(res => {
        //       if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
        //         return []
        //       }
        //       return res.data.records
        //     }).catch(err => [])
        //   ]
        // )
        // const result = [...res[0],...res[1]].map((item, index) => {
        //     item.__key = uuid()
        //     item.__label = `${item.materialName}(${item.materialCode})`
        //     // item.specification
        //     return item
        //   })
        that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: false, list: result }
      }
    },
    materialFuzzySearchActionChange(key) {
      const that = this
      const target = that.materialFuzzySearch.list.find(item => item.__key === key)

      that.form = { ...that.form, replaceMaterialItem: { ...target } ,beReplacedMaterialNum:target.materialNum || 0}
      that.materialFuzzySearch = { ...that.materialFuzzySearch, item: { ...target } }
    },

    handleCancel() {
      const that = this
      try{
        that.$refs.ruleForm.resetFields()
        that.caseTypeChange()
        that.listDataSource = []
      }catch(err){
        console.log(err)
      }
      that.$nextTick(() => (that.visible = false))
    },
    replacedMaterialNumChange(v, item) {
      const that = this
      that.form = {
        ...that.form,
        [item.key === 1 ? 'beReplacedMaterialNum' : 'replacedMaterialNum']: v
      }
    },
    caseTypeChange(v) {
      this.materialFuzzySearch = { ...this.materialFuzzySearch, list: [] }
      this.allMaterialFuzzySearch = { ...this.allMaterialFuzzySearch, list: [] }
      this.form = {
        ...this.form,
        bomItem: {}, // 单个物料
        materialItem: {}, // 被替换物料
        replaceMaterialItem: {}, // 替换物料
        beReplacedMaterialNum: 0, //被替换物料数量
        replacedMaterialNum: 0 //替换物料数量
      }
      this.bomFuzzySearch = {
        //bom模糊搜索
        list: [],
        item: {},
        fetching: false
      }
      this.materialFuzzySearch = {
        //物料搜索
        list: [],
        item: {},
        fetching: false
      }
      this.allMaterialFuzzySearch = {
        //全部物料搜索
        list: [],
        item: {},
        fetching: false
      }
    }
  }
}
</script>

<style scoped>
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
</style>
