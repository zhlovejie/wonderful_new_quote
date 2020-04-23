<template>
  <div class="customer-list-wrapper">
    <div class="main-wrapper" style="width:1000px;margin:0 auto;">
      <table class="custom-table custom-table-border">
        <tr>
          <td style="width:150px;">产品系列</td>
          <td>
              <a-input read-only placeholder="点击选择产品系列" :value="optInfo.name" @click="showModule('selectProduct')" />
          </td>
        </tr>
      </table>
      <table class="custom-table custom-table-border" v-if="optStand.length > 0">
        <tr>
          <td style="width:150px;">标配</td>
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
        <table class="custom-table custom-table-border" >
          <tr>
            <td style="width:150px;">中控系统模块</td>
            <td>
              <a-select style="width:100%;" defaultValue=-1  @change="controlChangeHandler">
                <a-select-option value="-1">无</a-select-option>
                <a-select-option v-for="(item,index) in optControl" :key="index" :value="item.id">{{item.itemName}}</a-select-option>
              </a-select>
            </td>
          </tr>
        </table>

        <table class="custom-table custom-table-border" v-if="controlResult.optStand && controlResult.optStand.length > 0">
          <tr>
            <td style="width:150px;">标配</td>
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

        <table class="custom-table custom-table-border" v-if="controlResult.optSelect && controlResult.optSelect.length > 0">
          <tr>
            <td style="width:150px;">选配</td>
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
                        v-for="(subItem) in item.dataSource" 
                        :key="subItem.id"
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

        <table class="custom-table custom-table-border" v-if="optSelect && optSelect.length > 0">
          <tr>
            <td style="width:150px;">系列产品选配</td>
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
                        v-for="(subItem) in item.dataSource" 
                        :key="subItem.id"
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

        
      </template>
      <div style="text-align:center;margin-top:10px;">
        <a-button type="primary" icon="check" @click="doAction('ok')" style="margin:0 10px;">确定</a-button>
        <a-button type="primary" icon="reload" @click="doAction('reset')" style="margin:0 10px;">重置</a-button>
      </div>
    </div>
    <SelectProduct ref="selectProduct" @selected="selectedHandler" />
    <a-modal
      title="产品评估"
      :width="600"
      :visible="visible"
      @cancel="handleCancel"
      :maskClosable="false"
      :footer="null"
    >
      <p>成本价：{{costPrice | moneyFormatNumber}}</p>
      <div style="text-align:center;margin-top:10px;">
          <a-button type="primary" @click="doAction('price-ok')" style="margin:0 10px;">确定</a-button>
          <a-button type="primary" @click="doAction('price-view')" style="margin:0 10px;">预览</a-button>
      </div>
    </a-modal>

    <SelectProductView ref="selectProductView" :dataSource="viewDataSource" />
  </div>
</template>

<script>
import SelectProduct from './module/SelectProduct' 
import {priceAdjustZktConfigDetail} from '@/api/productOfferManagement' 
import SelectProductView from './module/SelectProductView'
export default {
  name: 'products-quotation',
  components: {
    SelectProduct,
    SelectProductView
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
      visible:false,
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
    handleSubmit(){
      this.visible = true
    },
    handleCancel(){
      this.visible = false
    },
    optChoiceDataSourceChange(index,val){
      let _optChoice = [...this.optChoice]
      let target = _optChoice[index].dataSource.find(item => item.id === val)
      if(target){
        _optChoice[index].target = target
        this.optChoice = [..._optChoice]
      }
    },
    optChoiceCheckChange(index,e){
      let _optChoice = [...this.optChoice]
      _optChoice[index].target.checked = e.target.checked
      this.optChoice = [..._optChoice]
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

    doAction(type){
      if(type === 'ok'){
        this.visible = true
      }else if(type === 'reset'){
        this.optInfo = {}
        this.optStand = []
        this.optSelect = []
        this.optChoice = []
        this.optControl = []
        this.controlResult = {}
      }else if(type === 'price-ok'){
        this.visible = false
      }else if(type === 'price-view'){
        this.showModule('selectProductView')
      }
    },
    showModule(key) {
      this.$refs[key].query()
    },
    selectedHandler(result) {
      let that = this
      let {
        name,
        model,
        type,
        remarks,
        sysConfigList
      } = result
      that.optInfo = {
        name,
        model,
        type,
        remarks,
      }
      that.optStand = sysConfigList.optStand
      that.optSelect = sysConfigList.optSelect.map(item => {
        item.checked = false
        return item
      })
      that.optChoice = sysConfigList.optChoice.map(item =>{
        item.target = Object.assign({},item.dataSource[0])
        item.target.checked = item.target.isRequire
        return item
      })
      that.optControl = sysConfigList.optControl
      console.log(result)
    },
    controlChangeHandler(controlID){
      let that = this
      if(parseInt(controlID,10) === -1){
        return
      }

      that.optControlSelected = this.optControl.find(item =>item.id === controlID)
      priceAdjustZktConfigDetail({ id: controlID }).then(res => {
        let { optStandData, optSelectData, optChoiceData } = that.formatData(res.data.sysConfigList)
        that.controlResult = {
          optStand:optStandData,
          optSelect:optSelectData.map(item => {
            item.checked = false
            return item
          }),
          optChoice:optChoiceData.map(item =>{
            item.target = Object.assign({},item.dataSource[0])
            item.target.checked = item.target.isRequire
            return item
          })
        }
      })
    },
    formatData(data) {
      let formatDataItem = data => {
        //返回的列表数据格式转换成需要的数据格式
        return data.map((item, index) => {
          let _item = {
            id: item.itemId,
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
    getChoiceProducts(){
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
        optStand,
        optSelect,
        optChoice,
        control_optStand,
        control_optSelect,
        control_optChoice
      }
    },
    calcItems(){
      let {
        optStand,
        optSelect,
        optChoice,
        control_optStand,
        control_optSelect,
        control_optChoice
      } = this.getChoiceProducts()

      let result = [...optStand,...optSelect,...optChoice,...control_optStand,...control_optSelect,...control_optChoice].flat()
      let totalPrice = result.reduce((total,item) =>{
        return total + (parseInt(item.price,10) || 0)
      },0)
      console.log(result)
      console.log(`totalPrice:${totalPrice}`)
      return totalPrice
    }
  }
}
</script>

<style scoped>
  .customer-list-wrapper {
    background-color: #fff;
    padding: 10px 20px;
  }
  .customer-list-wrapper .search-wrapper * {
    margin: 10px 15px 0 0;
  }
  .main-wrapper {
    margin-top: 20px;
  }

  .main-wrapper .custom-table{
    margin: -1px 0 0 0;
  }
  .main-wrapper .custom-table >>> .custom-table{
    margin: -1px;
    width: calc(100% + 2px);
  }
  .custom-table th,.custom-table td{
    position: relative;
    padding: 10px;
  }

  .custom-table >>> .bottom-line{
    position: absolute;
    height: 1px;
    width: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
  }

</style>
