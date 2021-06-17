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
        <div class="step1-item" v-show="step === 1">
          <a-alert message="BOM成批修改" type="info" show-icon>
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
                <p>
                  <a-form-model-item>
                    <a-checkbox v-model="form.materialCodeChecked" />
                  </a-form-model-item>
                  <a-form-model-item label="单个物料">
                    <a-select
                      style="width:200px;"
                      show-search
                      :value="form.materialCode"
                      placeholder="模糊搜索"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      :not-found-content="materialFuzzySearch.fetching ? undefined : '未找到匹配项'"
                      @search="materialFuzzyAction"
                      @change="(key) => materialFuzzyHandleChange(key)"
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
                </p>
                <p>
                  <a-form-model-item>
                    <a-checkbox v-model="form.materialRangeChecked"  />
                  </a-form-model-item>
                  <a-form-model-item label="物料范围">
                    <a-input style="width:200px;" v-model="form.startMaterialCode"/>
                  </a-form-model-item>
                  <span style="line-height: 40px; margin-right: 10px">至</span>
                  <a-form-model-item>
                    <a-input style="width:200px;" v-model="form.endMaterialCode"/>
                  </a-form-model-item>
                </p>
                <p>
                  <a-form-model-item>
                    <a-checkbox v-model="form.allMaterialCodeChecked"  />
                  </a-form-model-item>
                  <a-form-model-item>
                    <span style="color:rgba(0, 0, 0, 0.85);">所有物料</span>
                  </a-form-model-item>
                </p>
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
                <div slot="replacedMaterialCode" slot-scope="text, record, index" >
                  <a-form-model-item>
                    <a-select
                      style="width:200px;"
                      show-search
                      :value="record.key === 1 ? form.beReplacedMaterialCode : form.replacedMaterialCode"
                      placeholder="模糊搜索"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      :not-found-content="materialFuzzySearch.fetching ? undefined : '未找到匹配项'"
                      @search="childMaterialFuzzyAction"
                      @change="(key) => materialFuzzyTableHandleChange(key,record)"
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
                </div>

                <div slot="replacedMaterialNum" slot-scope="text, record, index" >
                  <a-input-number @change="(v) => replacedMaterialNumChange(v,record)" :value="record.key === 1 ? form.beReplacedMaterialNum : form.replacedMaterialNum" :min="0" :max="9999999999" />
                </div>

                <template slot="footer" slot-scope="currentPageData">
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
                    <a-select style="width: 200px" v-model="form.useStatus">
                      <a-select-option :value="0">未使用</a-select-option>
                      <a-select-option :value="1">使用</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="审核状态">
                    <a-select style="width: 200px" v-model="form.status">
                      <a-select-option value="0">待审核</a-select-option>
                      <a-select-option value="1">待审批</a-select-option>
                      <a-select-option value="2">通过</a-select-option>
                      <a-select-option value="3">不通过</a-select-option>
                      <a-select-option value="4">已反审核</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </p>
              </div>
            </div>
          </a-form-model>
        </div>

        <div class="step2-item" v-show="step === 2">
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

        <div class="card-item" style="text-align: center;margin-top:20px;" >
          <a-button style="margin:0 5px;" @click="doAction('cancel')">取消</a-button>
          <a-button style="margin:0 5px;" type="primary" v-show="step === 2" @click="doAction('prev')">上一步</a-button>
          <a-button style="margin:0 5px;" type="primary" v-show="step === 1" @click="doAction('next')">下一步</a-button>
          <a-button style="margin:0 5px;" type="primary" v-show="step === 2" @click="doAction('ok')">完成</a-button>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
//物料代码模糊搜索
import { routineMaterialInfoPageList} from '@/api/routineMaterial'

import {
  updateBatchChildDetailList,
  updateBatchChildDetail,
  listMaterialForm,
  listMaterialFormChildDetailByBomIdAndCode
} from '@/api/bomManagement'
const uuid = () =>Math.random().toString(16).slice(2);
export default {
  name:'bom-batch-update',
  data(){
    // let materialFuzzyAction = this.$_.debounce(this.materialFuzzyAction.bind(this,true), 800)
    // let childMaterialFuzzyAction = this.$_.debounce(this.materialFuzzyAction.bind(this,false), 800)
    this.childMaterialFuzzyAction = this.$_.debounce(this.materialFuzzyAction.bind(this,false), 800)
    this.materialFuzzyAction = this.$_.debounce(this.materialFuzzyAction.bind(this,true), 800)

    return {
      step:1,
      visible:false,
      spinning:false,
      materialFuzzySearch: {
        list: [],
        item: {},
        fetching: false
      },
      form:{
        useStatus:0,
        isKeepStoreAddress:false
      },
      rules:{},
      columns: [
        {
          align: 'center',
          title: "类别",
          dataIndex: "category",
        },
        {
          align: 'center',
          title: "物料代码",
          dataIndex: "replacedMaterialCode",
          scopedSlots: { customRender: 'replacedMaterialCode' }
        },
        {
          align: 'center',
          title: "物料名称",
          dataIndex: "replacedMaterialName",
        },
        {
          align: 'center',
          title: "用量",
          dataIndex: "replacedMaterialNum",
          scopedSlots: { customRender: 'replacedMaterialNum' }
        },
        {
          align: 'center',
          title: "辅计量单位",
          dataIndex: "replacedMaterialUnit",
        },
      ],
      dataSource: [
        {
          key: 1,
          category: "被替换物料",
          replacedMaterialCode: "",
          replacedMaterialName: "",
          replacedMaterialNum: 0,
          replacedMaterialUnit: "",
        },
        {
          key: 2,
          category: "替换物料",
          replacedMaterialCode: "",
          replacedMaterialName: "",
          replacedMaterialNum: 0,
          replacedMaterialUnit: "",
        },
      ],
      listColumns: [
        {
          align: 'center',
          title: "BOM单号",
          dataIndex: "bomCode",
        },
        {
          align: 'center',
          title: "父项物料编码",
          dataIndex: "materialCode",
        },
        {
          align: 'center',
          title: "父项物料名称",
          dataIndex: "materialName",
        },
        {
          align: 'center',
          title: "父项规格型号",
          dataIndex:"modelType",
          scopedSlots: { customRender: 'modelType' },
        },
        {
          align: 'center',
          title: "备注",
          dataIndex: "remark",
        },
      ],
      listDataSource:[],
      pagination: {
        showTotal: (total) => `共有 ${total} 条数据`
      },
      loading: false,
    }
  },
  methods:{
    query(type){
      this.step = 1
      this.visible = true
    },
    doAction(type){
      const that = this
      if(type === 'cancel'){
        that.visible = false
      }else if(type === 'prev'){
        that.step = 1
      }else if(type === 'next'){
        that.step = 2
        console.log(that.form)
        that.$nextTick(() => that.searchAction())
      }else if(type === 'ok'){
        that.spinning = true
        let param = {...that.form}
        param.isKeepStoreAddress = param.isKeepStoreAddress ? 1 : 2
        updateBatchChildDetail(param).then(res => {
          that.spinning = false
          that.handleCancel()
          that.$emit('finish')
        }).catch(err => {
          console.log(err)
          that.spinning = false
        })
        // that.visible = false
      }
    },
    searchAction() {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...that.form }, paginationParam, {
        isKeepStoreAddress:that.form.isKeepStoreAddress ? 1 : 2
      })
      that.loading = true
      updateBatchChildDetailList(_searchParam)
        .then((res) => {
          that.loading = false
          that.listDataSource = res.data.map((item, index) => {
            item.key = index + 1
            return item
          })
        })
        .catch((err) => (that.loading = false))
    },
    async materialFuzzyAction(isRoot,wd) {
      const that = this
      that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: true }
      let api = null
      if(isRoot){
        let _searchParam = {
          current: 1,
          size: 10,
          materialCode: wd
        }
        api = () => listMaterialForm(_searchParam)
      }else{
        let _searchParam = {
          bomId:that.form.bomId,
          materialCode: wd
        }
        api = () => listMaterialFormChildDetailByBomIdAndCode(_searchParam)
      }

      const result = await api().then(res => {
        try{
          let data = isRoot ? res.data.records : res.data
          return data.map((item, index) => {
            item.__key = uuid()
            item.__label = item.materialCode
            item.__value = item.materialName
            return item
          })
        }catch(err){
          return []
        }
      })
      console.log(result)
      that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: false, list: result }
    },
    materialFuzzyTableHandleChange(key, item) {
      const that = this
      const target = that.materialFuzzySearch.list.find(item => item.__key === key)

      let dataSource = [...that.dataSource]
      let _item = dataSource.find(i => i.key === item.key)
      _item.replacedMaterialCode = target.materialCode
      _item.replacedMaterialName = target.materialName
      _item.replacedMaterialNum  = target.materialNum
      _item.replacedMaterialUnit = ({1:'支',2:'把',3:'件'}[target.mainUnit]) || target.mainUnit || '无'

      that.dataSource = dataSource

      if(item.key === 1){
        that.form = {
          ...that.form,
          beReplacedMaterialCode:target.materialCode,
          beReplacedMaterialNum:target.materialNum,
        }
      }else{
        that.form = {
          ...that.form,
          replacedMaterialCode:target.materialCode,
          replacedMaterialName:target.materialName,
          replacedMaterialNum:target.materialNum,
          replacedMaterialUnit:target.mainUnit
        }
      }
      that.materialFuzzySearch = { list: [], fetching: false, item: target }
    },
    materialFuzzyHandleChange(key) {
      const that = this
      const target = that.materialFuzzySearch.list.find(item => item.__key === key)
      that.form = {
        ...that.form,
        bomId: target.id,
        materialCode: target.materialCode,
      }
      that.materialFuzzySearch = { list: [], fetching: false, item: target }
    },
    handleCancel(){
      const that = this
      that.$refs.ruleForm.resetFields();
      // that.dataSource = []
      that.listDataSource = []
      that.$nextTick(() => that.visible = false)
    },
    replacedMaterialNumChange(v,item){
      const that = this
      that.form = {
        ...that.form,
        [item.key === 1 ? 'beReplacedMaterialNum' : 'replacedMaterialNum']:v
      }

      let dataSource = [...that.dataSource]
      let target = dataSource.find(i => i.key === item.key)
      target.replacedMaterialNum = v
      that.dataSource = dataSource
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
  font-weight:bold;
}
</style>
