<template>
  
    <div class="product-config-wrapper" style="width:1000px;margin:0 auto;">
      <table class="custom-table custom-table-border c-stand-color" v-if="optStand.length > 0">
        <tr>
          <td style="width:150px;">{{prefix}}标配</td>
          <td style="padding:0;">
            <div class="bottom-line"></div>
            <table class="custom-table custom-table-border" style="margin-bottom:0;">
              <tr>
                <th style="width:100px;">序号</th>
                <th>配置名称</th>
              </tr>
              <tr v-for="(item,index) in optStand" :key="index" >
                <td>{{index+1}}</td>
                <td>{{item.itemName}}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <template v-if="optControl.length > 0">
        <table class="custom-table custom-table-border c-control-color" >
          <tr>
            <td style="width:150px;">{{prefix}}中控系统模块</td>
            <td>
              <a-select style="width:100%;" defaultValue=-1  @change="controlChangeHandler">
                <a-select-option value="-1">无</a-select-option>
                <a-select-option v-for="(item,index) in optControl" :key="index" :value="item.id">{{item.itemName}}</a-select-option>
              </a-select>
            </td>
          </tr>
        </table>

        <table class="custom-table custom-table-border c-control-color" v-if="controlResult.optStand && controlResult.optStand.length > 0">
          <tr>
            <td style="width:150px;">中控-标配</td>
            <td style="padding:0;">
              <div class="bottom-line"></div>
              <table class="custom-table custom-table-border" style="margin-bottom:0;">
                <tr>
                  <th style="width:100px;">序号</th>
                  <th>配置名称</th>
                </tr>
                <tr v-for="(item,index) in controlResult.optStand" :key="index" >
                  <td>{{index+1}}</td>
                  <td>{{item.itemName}}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table class="custom-table custom-table-border c-control-color" v-if="controlResult.optSelect && controlResult.optSelect.length > 0">
          <tr>
            <td style="width:150px;">中控-选配</td>
            <td style="padding:0;">
              <div class="bottom-line"></div>
              <table class="custom-table custom-table-border" style="margin-bottom:0;">
                <tr>
                  <th style="width:100px;">序号</th>
                  <th>配置名称</th>
                  <th style="width:100px;">配置</th>
                </tr>
                <tr v-for="(item,index) in controlResult.optChoice" :key="index">
                  <td>{{index + 1}}</td>
                  <td>
                    <a-select 
                      style="width:100%;" 
                      placeholder="选择选配项"  
                      :defaultValue="item.dataSource[0].id" 
                      @change="controlResultOptChoiceDataSourceChange(index,$event)"
                    >
                      <a-select-option 
                        v-for="(subItem,index) in item.dataSource" 
                        :key="index"
                        :value="subItem.id" 
                      >
                      {{subItem.itemName}}
                      </a-select-option>
                    </a-select>
                  </td>
                  <td>
                    <a-checkbox 
                      :disabled="item.target.isRequire" 
                      :checked="item.target.checked || item.target.isRequire" 
                      @change="controlResultOptChoiceCheckChange(index,$event)" 
                    />
                  </td>
                </tr>
                <tr v-for="(item,index) in controlResult.optSelect" :key="item.id" >
                  <td>{{controlResult.optChoice.length + index + 1}}</td>
                  <td>{{item.itemName}}</td>
                  <td>
                    <a-checkbox 
                      :checked="item.checked || false" 
                      @change="controlResultOptSelectCheckChange(item.id,$event)"
                    />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

      </template>

      <table class="custom-table custom-table-border c-select-color" v-if="optSelect.length > 0">
        <tr>
          <td style="width:150px;">{{prefix}}选配</td>
          <td style="padding:0;">
            <div class="bottom-line"></div>
            <table class="custom-table custom-table-border" style="margin-bottom:0;">
              <tr>
                <th style="width:100px;">序号</th>
                <th>配置名称</th>
                <th style="width:100px;">配置</th>
              </tr>
              <tr v-for="(item,index) in optChoice" :key="index">
                <td>{{index + 1}}</td>
                <td>
                  <a-select 
                    style="width:100%;" 
                    placeholder="选择选配项"  
                    :defaultValue="item.dataSource[0].id" 
                    @change="optChoiceDataSourceChange(index,$event)"
                  >
                    <a-select-option 
                      v-for="(subItem,index) in item.dataSource" 
                      :key="index"
                      :value="subItem.id" 
                    >
                    {{subItem.itemName}}
                    </a-select-option>
                  </a-select>
                </td>
                <td>
                  <a-checkbox 
                    :disabled="item.target.isRequire" 
                    :checked="item.target.checked || item.target.isRequire" 
                    @change="optChoiceCheckChange(index,$event)" 
                  />
                </td>
              </tr>
              <tr v-for="(item,index) in optSelect" :key="item.id" >
                <td>{{optChoice.length + index + 1}}</td>
                <td>{{item.itemName}}</td>
                <td>
                  <a-checkbox 
                    :checked="item.checked || false" 
                    @change="optSelectCheckChange(item.id,$event)"
                  />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  
</template>

<script>
import {
  priceAdjustProductConfigDetail,
  priceAdjustZktConfigDetail
} from '@/api/productOfferManagement' 

export default {
  name: 'product-config',
  components: {

  },
  props:{
    productConfigId:{
      type:[Number,String],
      default:() =>{
        return null
      }
    },
    prefix:{
      type:String,
      default:() =>{
        return ''
      }
    }
  },
  data() {
    return {
      optInfo:{},
      optStand:[],
      optSelect:[],
      optChoice:[],
      optControl:[],

      optControlSelected:null,

      controlResult:{},
    }
  },
  computed:{
    costPrice(){
      return this.calcItems()
    },
    viewDataSource(){
      let {
        optStand,
        optSelect,
        optChoice,
        control_optStand,
        control_optSelect,
        control_optChoice
      } = this.getChoiceProducts()
      return {
        optInfo:{...this.optInfo,optControl:this.optControlSelected},
        optStand:[...optStand],
        optSelect:[...optSelect,...optChoice],
        optControlStand:[...control_optStand],
        optControlSelect:[...control_optSelect,...control_optChoice]
      }
    }
  },
  methods: {
    optChoiceDataSourceChange(index,val){
      let _optChoice = [...this.optChoice]
      let target = _optChoice[index].dataSource.find(item => item.id === val)
      if(target){
        _optChoice[index].target = target
        this.optChoice = [..._optChoice]
      }
      if(target.price === null){
        this.$message.info(`【${target.itemName}】 没有价格，请联系管理员`)
      }

      this.$emit('extendProductChange',Object.assign({},target))
    },
    optChoiceCheckChange(index,e){
      let _optChoice = [...this.optChoice]
      let target = _optChoice[index].target
      target.checked = e.target.checked
      this.optChoice = [..._optChoice]

      this.$emit('extendProductChange',Object.assign({},target))
    },
    optSelectCheckChange(id,e){
      let _optSelect = [...this.optSelect]
      let target = _optSelect.find(item => item.id === id)
      if(target){
        target.checked = e.target.checked
        this.optSelect = [..._optSelect]
      }
    },
    controlResultOptChoiceDataSourceChange(index,val){
      let controlResult = {...this.controlResult}
      let _optChoice = controlResult.optChoice
      let target = _optChoice[index].dataSource.find(item => item.id === val)
      if(target){
        _optChoice[index].target = target
        this.controlResult = controlResult
      }
      if(target.price === null){
        this.$message.info(`【${target.itemName}】 没有价格，请联系管理员`)
      }
    },
    controlResultOptChoiceCheckChange(index,e){
      let controlResult = {...this.controlResult}
      let _optChoice = controlResult.optChoice
      _optChoice[index].target.checked = e.target.checked
      this.controlResult = controlResult
    },
    controlResultOptSelectCheckChange(id,e){
      let controlResult = {...this.controlResult}
      let _optSelect = controlResult.optSelect
      let target = _optSelect.find(item => item.id === id)
      if(target){
        target.checked = e.target.checked
        this.controlResult = controlResult
      }
    },
    selectedHandler(result) {
      let that = this
      let {
        name,
        model,
        type,
        price,
        remarks,
        sysConfigList
      } = result
      that.optInfo = {
        name,
        model,
        type,
        price,
        remarks,
      }
      that.optStand = sysConfigList.optStand
      that.optSelect = sysConfigList.optSelect.map(item => {
        item.checked = false
        return item
      })
      that.optChoice = sysConfigList.optChoice.map((item,index) =>{
        item.target = Object.assign({},item.dataSource[0])
        item.target.checked = item.target.isRequire

        if(item.target.isProduct && item.target.checked){
          that.$emit('extendProductChange',Object.assign({},item.target))
        }
        return item
      })
      that.optControl = sysConfigList.optControl || []
      console.log(result)
    },
    controlChangeHandler(controlID){
      let that = this
      if(parseInt(controlID,10) === -1){
        that.controlResult = {
          optStand:[],
          optSelect:[],
          optChoice:[]
        }
        that.optControlSelected = null
        return
      }
      that.optControlSelected = this.optControl.find(item =>item.id === controlID)
      priceAdjustZktConfigDetail({ id: controlID }).then(res => {
        let {name,model,type,price,remarks,sysConfigList} = res.data
        let { optStandData, optSelectData, optChoiceData } = that.controlFormatData(sysConfigList)
        that.controlResult = {
          optInfo:{
            name,
            model,
            type,
            price,
            remarks,
          },
          optStand:optStandData,
          optSelect:optSelectData.map(item => {
            item.checked = false
            return item
          }),
          optChoice:optChoiceData.map(item =>{
            item.target = Object.assign({},item.dataSource[0])
            item.target.checked = item.target.isRequire

            if(item.target.price === null){
              that.$message.info(`【${item.target.itemName}】 没有价格，请联系管理员`)
            }

            return item
          })
        }
      })
    },
    controlFormatData(data) {
      let formatDataItem = data => {
        //返回的列表数据格式转换成需要的数据格式
        return data.map((item, index) => {
          let _item = {
            id: item.itemId,
            itemId:item.itemId,
            itemName: item.name,
            key: item.itemId,
            order: index + 1,
            serialNum: index + 1,
            zktId: item.zktId,
            price:item.price 
          }
          if ([4, 5].includes(item.type)) {
            _item.isRequire = item.type === 4 ? true : false
          }
          return _item
        })
      }
      let optStandData = data
        .filter(item => item.mainBody === 1 && item.type === 1)
        .sort((a, b) => a.orderNo - b.orderNo)
      let optSelectData = data
        .filter(item => item.mainBody === 1 && item.type === 2)
        .sort((a, b) => a.orderNo - b.orderNo)
      let optChoiceData = data.filter(item => item.mainBody === 1 && [4, 5].includes(item.type))

      let groups = [...new Set(optChoiceData.map(item => item.groupId))].sort()
      let res = []
      groups.map(groupId => {
        let dataSource = optChoiceData.filter(item => item.groupId === groupId).sort((a, b) => a.orderNo - b.orderNo)
        if (dataSource.length > 0) {
          res.push({
            dataSource: formatDataItem(dataSource)
          })
        }
      })
      return {
        optStandData: formatDataItem(optStandData),
        optSelectData: formatDataItem(optSelectData),
        optChoiceData: res
      }
    },
    productFormatData(data) {
      let formatDataItem = data => {
        //返回的列表数据格式转换成需要的数据格式
        return data.map((item, index) => {
          let _item = {
            id: item.id || item.itemId,
            itemId:item.itemId,
            itemName: item.name,
            key: item.itemId,
            order: index + 1,
            serialNum: index + 1,
            productId: item.productId,
            price:item.price,
            isProduct:item.isProduct === 1 ? true : false
          }
          if ([4, 5].includes(item.type)) {
            _item.isRequire = item.type === 4 ? true : false
          }
          return _item
        })
      }
      let optStandData = data
        .filter(item => item.mainBody === 2 && item.type === 1)
        .sort((a, b) => a.orderNo - b.orderNo)
      let optSelectData = data
        .filter(item => item.mainBody === 2 && item.type === 2)
        .sort((a, b) => a.orderNo - b.orderNo)
      let optControlData = data
        .filter(item => item.mainBody === 2 && item.type === 3)
        .sort((a, b) => a.orderNo - b.orderNo)

      let optChoiceData = data.filter(item => item.mainBody === 2 && [4, 5].includes(item.type))
      
      let groups = [...new Set(optChoiceData.map(item => item.groupId))].sort()
      let res = []
      groups.map(groupId => {
        let dataSource = optChoiceData.filter(item => item.groupId === groupId).sort((a, b) => a.orderNo - b.orderNo)
        if (dataSource.length > 0) {
          res.push({
            dataSource: formatDataItem(dataSource)
          })
        }
      })
      return {
        optStandData: formatDataItem(optStandData),
        optSelectData: formatDataItem(optSelectData),
        optControlData: formatDataItem(optControlData),
        optChoiceData: res
      }
    },
    getChoiceProducts(){
      let that = this
      let optStand = this.optStand.map(item =>Object.assign({},item))
      let optSelect = this.optSelect.map(item =>Object.assign({},item)).filter(item => item.checked)
      let optChoice = this.optChoice.map(item => Object.assign({},item.target)).filter(item => item.checked)

      let control_optStand = this.controlResult.optStand 
        ? this.controlResult.optStand.map(item =>Object.assign({},item)) 
        : []
      let control_optSelect = this.controlResult.optSelect 
        ? this.controlResult.optSelect.map(item =>Object.assign({},item)).filter(item => item.checked)
        : []
      let control_optChoice = this.controlResult.optChoice 
        ? this.controlResult.optChoice.map(item => Object.assign({},item.target)).filter(item => item.checked) 
        :[]
      return {
        optInfo:Object.assign({},that.optInfo),
        optStand,
        optSelect,
        optChoice,
        control_optInfo:Object.assign({},that.controlResult.optInfo),
        control_optStand,
        control_optSelect,
        control_optChoice
      }
    },
    calcItems(){
      let {
        optInfo,
        optStand,
        optSelect,
        optChoice,
        control_optInfo,
        control_optStand,
        control_optSelect,
        control_optChoice
      } = this.getChoiceProducts()


      let result = [...optSelect,...optChoice,...control_optSelect,...control_optChoice].flat()
      let totalPrice = result.reduce((total,item) =>{
        return total + (parseFloat(item.price) || 0)
      },0)

      if(optStand.length > 0){
        totalPrice += (parseFloat(optInfo.price) || 0)
      }
      if(control_optStand.length > 0){
        totalPrice += (parseFloat(control_optInfo.price) || 0)
      }

      console.log(result)
      console.log(`totalPrice:${totalPrice}`)
      return totalPrice
    },
    query(id){
      let that = this
      that.reset()
      priceAdjustProductConfigDetail({ id: id }).then(res => {
        that.loading = false
        let { optStandData, optSelectData, optChoiceData ,optControlData} = that.productFormatData(res.data.sysConfigList)
        that.selectedHandler({
          name: res.data.name,
          model: res.data.model,
          type: res.data.type,
          remarks: res.data.remarks,
          price:res.data.price,
          sysConfigList:{
            optStand:optStandData,
            optSelect:optSelectData,
            optChoice:optChoiceData,
            optControl:optControlData
          }
        })
      }).catch(err =>{
        that.reset()
        that.$message.info(`请求失败：${err.message}`)
      })
    },
    reset(){
      this.optInfo = {}
      this.optStand = []
      this.optSelect = []
      this.optChoice = []
      this.optControl = []
      this.controlResult = {}
    },
  }
}
</script>

<style scoped>
  .product-config-wrapper .custom-table{
    margin: -1px 0 0 0;
  }
  .product-config-wrapper .custom-table >>> .custom-table{
    margin: -1px;
    width: calc(100% + 2px);
  }
  .product-config-wrapper .custom-table th, .product-config-wrapper .custom-table td{
    position: relative;
    padding: 10px;
  }

  .c-stand-color{
    background-color: rgba(170, 210, 240, .1);
  }
  .c-control-color{
    background-color:  rgba(170, 210, 240, .5);
  }
  .c-select-color{
    background-color: rgba(170, 210, 240, .3);
  }

</style>

