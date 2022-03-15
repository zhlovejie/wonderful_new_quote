<template>
  <a-select
    v-bind="$attrs"
    show-search
    :value="form.materialCode"
    placeholder="模糊搜索"
    style="width: 100%"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="materialFuzzySearch.fetching ? undefined : '未找到匹配项'"
    @search="w => materialFuzzyAction(w, false)"
    @change="materialFuzzyHandleChange"
  >
    <a-spin v-if="materialFuzzySearch.fetching" slot="notFoundContent" size="small" />
    <a-select-option v-for="item in materialFuzzySearch.list" :key="item.__key" :value="item.materialCodeFormat">
      {{ item.materialCodeFormat }}
    </a-select-option>
  </a-select>
</template>

<script>
//物料代码模糊搜索
import { routineMaterialInfoPageList, productMaterialInfoPageList } from '@/api/routineMaterial'

export default {
  name: 'materialFuzzySearch',
  props: {
    materialInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    materialType:{
      type:[Number,String],
      default:() => 0
    }
  },
  data() {
    this.materialFuzzyAction = this.$_.debounce(this.materialFuzzyAction, 800)
    return {
      materialFuzzySearch: {
        list: [],
        item: {},
        fetching: false
      },
      form: {}
    }
  },
  watch: {
    materialInfo(val) {
      this.form = {...this.form, ...val }
    }
  },
  created() {
    this.form = { ...this.materialInfo }
  },
  methods: {
    async materialFuzzyAction(wd, isFilter = false) {
      const that = this
      const _searchParam = {
        current: 1,
        size: 10,
        materialCode: wd
      }
      that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: true }

      let fnRoutineMaterial = () => {
        return routineMaterialInfoPageList(_searchParam)
          .then(res => {
            if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
              return []
            }
            let records = (res.data.records || []).map(item => {
              item.materialId = item.id
              item.type = 1
              return item
            })

            let arr = []
            records.map(r => {
              if(!arr.find(item => item.id === r.id)){
                arr.push({...r})
              }
            })
            return arr
          })
          .catch(err => {
            console.log(err)
            return []
          })
      }
      let fnProductMaterial = () => {
        return productMaterialInfoPageList(_searchParam)
          .then(res => {
            if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
              return []
            }
            let records = (res.data.records || []).map(item => {
              item.materialId = item.id
              item.type = 1
              return item
            })
            let arr = []
            records.map(r => {
              if(!arr.find(item => item.id === r.id)){
                arr.push({...r})
              }
            })
            return arr
          })
          .catch(err => {
            console.error(err)
            return []
          })
      }


      let queue = []
      if(+that.materialType === 0){
        queue.push(fnRoutineMaterial())
        queue.push(fnProductMaterial())
      }else if(+that.materialType === 1){
        queue.push(fnRoutineMaterial())
      }else if(+that.materialType === 2){
        queue.push(fnProductMaterial())
      }

      let res = await Promise.all(queue)
      let result = []
      if (isFilter) {
        //显示 常规和成品的 自制和委外件，
        result = res.flat(1).filter(item => [1, 3].includes(+item.materialSource))
      } else {
        //显示 常规件 ，不过滤
        result = res.flat(1)
      }
      // console.log(res)
      result = result.map((item, index) => {
        item.__key = that._uuid()
        item.__value = item.materialName
        item.materialCodeFormat = that.formatMaterialCode(item.materialCode, '.')
        item.__label = `${item.materialName}(${item.materialCodeFormat})`
        item.specifications =
          item.specification ||
          `
              材质：${item.texture}
              厚度：${item.thickness}
              宽度：${item.width}
              长度：${item.length}
            `
        return item
      })

      that.materialFuzzySearch = { ...that.materialFuzzySearch, fetching: false, list: result }
    },
    materialFuzzyHandleChange(key) {
      const that = this
      const target = that.materialFuzzySearch.list.find(item => item.materialCodeFormat === key)
      const param = {
        type:target.type,
        materialId: target.id,
        materialCode: target.materialCodeFormat,
        materialName: target.materialName,
        materialProperty: target.materialSource,
        materialUnit: target.subUnit || '',
        modelType: 'specification' in target ? target.specification || target.specifications : '无',
        k3Code: target.k3Code,
        weight: target.weight
      }
      that.$emit('change', param)
      that.form = { ...param }
      that.materialFuzzySearch = { ...that.materialFuzzySearch, item: target }
    },
    formatMaterialCode(codeStr, joinSymbol = '') {
      if (typeof codeStr !== 'string') {
        console.warn(`${codeStr} is not string type..`)
        return ''
      }
      let trimLeft = /^[0]*/g,
        trimRight = /[0]*$/g
      return codeStr
        .split('.')
        .map(s => s.replace(trimLeft, ''))
        .join(joinSymbol)
    }
  }
}
</script>
