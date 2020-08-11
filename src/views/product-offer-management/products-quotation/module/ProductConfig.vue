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
              <a-select style="width:100%;" :defaultValue="optControlSelectedDefault"  @change="controlChangeHandler">
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
      optControlSelectedDefault:undefined,
      controlResult:{},
    }
  },
  computed:{
    costPrice(){
      return this.costPriceAll.totalPrice
    },
    costPriceAll(){
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
      debugger
      let _optChoice = [...this.optChoice]
      let target = _optChoice[index].dataSource.find(item => item.id === val)
      if(target){
        if(target.price === null){
          this.$message.info(`【${target.itemName}】 没有价格，请联系管理员`)
        }
        target.checked = _optChoice[index].target.checked || _optChoice[index].target.isRequire
        _optChoice[index].target = target
        this.optChoice = [..._optChoice]
      }
      this.$emit('extendProductChange',Object.assign({},target))
    },
    optChoiceCheckChange(index,e){
      let _optChoice = [...this.optChoice]
      let target = _optChoice[index].target
      if(target.price === null){
        this.$message.info(`【${target.itemName}】 没有价格，请联系管理员`)
        target.checked = false
      }else{
        target.checked = e.target.checked
      }
      this.optChoice = [..._optChoice]
      this.$emit('extendProductChange',Object.assign({},target))
    },
    optSelectCheckChange(id,e){
      let _optSelect = [...this.optSelect]
      let target = _optSelect.find(item => item.id === id)
      if(target){
        if(target.price === null){
          this.$message.info(`【${target.itemName}】 没有价格，请联系管理员`)
          target.checked = false
        }else{
          target.checked = e.target.checked
        }
        this.optSelect = [..._optSelect]
      }
    },
    controlResultOptChoiceDataSourceChange(index,val){
      debugger
      let controlResult = {...this.controlResult}
      let _optChoice = controlResult.optChoice
      let target = _optChoice[index].dataSource.find(item => item.id === val)
      if(target){
        if(target.price === null){
          this.$message.info(`【${target.itemName}】 没有价格，请联系管理员`)
        }
        //target.checked = target.isRequire
        target.checked = _optChoice[index].target.checked || _optChoice[index].target.isRequire
        _optChoice[index].target = {...target}
        this.controlResult = controlResult
      }
    },
    controlResultOptChoiceCheckChange(index,e){
      let controlResult = {...this.controlResult}
      let _optChoice = controlResult.optChoice
      let target = _optChoice[index].target
      if(target.price === null){
        this.$message.info(`【${target.itemName}】 没有价格，请联系管理员`)
        target.checked = false
      }else{
        target.checked = e.target.checked
      }
      this.controlResult = controlResult
    },
    controlResultOptSelectCheckChange(id,e){
      let controlResult = {...this.controlResult}
      let _optSelect = controlResult.optSelect
      let target = _optSelect.find(item => item.id === id)
      if(target){
        if(target.price === null){
          this.$message.info(`【${target.itemName}】 没有价格，请联系管理员`)
          target.checked = false
        }else{
          target.checked = e.target.checked
        }
        this.controlResult = controlResult
      }
    },
    selectedHandler(result) {
      let that = this
      that.$emit('extendProductChange',null)

      let {
        name,
        model,
        productPic,
        type,
        price,
        aprice,
        bprice,
        cprice,
        retailPrice,
        remarks,
        sysConfigList
      } = result
      that.optInfo = {
        name,
        model,
        productPic,
        type,
        price,
        aprice,
        bprice,
        cprice,
        retailPrice,
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
      //根据系列产品配置，带入中控系统，如果未配置中控系统显示无
      //若配置了多个中控系统，默认带入第一个中控系统，有中控系统的时候不带入选项无
      let __optControl = [...sysConfigList.optControl || []]
      let __optControlSelectedDefault = undefined
      if(__optControl.length === 0){
        //__optControl.push({id:'-1',itemName:'无' })
        __optControlSelectedDefault = '-1'
      }else{
        __optControlSelectedDefault = +__optControl[0].id
      }
      that.optControl = __optControl
      that.optControlSelectedDefault = __optControlSelectedDefault
      that.controlChangeHandler(that.optControlSelectedDefault)
      console.log(result)
    },
    controlChangeHandler(controlID){
      //debugger
      let that = this
      that.controlResult = {
        optStand:[],
        optSelect:[],
        optChoice:[]
      }
      that.optControlSelected = null
      if(parseInt(controlID,10) === -1){
        return
      }

      that.optControlSelected = this.optControl.find(item =>item.id === controlID)
      priceAdjustZktConfigDetail({ id: controlID ,isPrice:true}).then(res => {
        if(res.code !== 200){
          that.$message.info(res.msg)
          return
        }
        let {name,model,productPic,type,price,remarks,sysConfigList,aprice,bprice,cprice,retailPrice} = res.data
        let { optStandData, optSelectData, optChoiceData } = that.controlFormatData(sysConfigList)
        that.controlResult = {
          optInfo:{
            name,
            model,
            productPic,
            type,
            price,
            aprice,
            bprice,
            cprice,
            retailPrice,
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
            price:item.price,
            aprice:item.aprice,
            bprice:item.bprice,
            cprice:item.cprice,
            retailPrice:item.retailPrice,
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
            aprice:item.aprice,
            bprice:item.bprice,
            cprice:item.cprice,
            retailPrice:item.retailPrice,
            isProduct:item.isProduct === 1 ? true : false,
            introduction:item.introduction || ''
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

      //参与价格计算 去除为产品的 防止计算重复
      optChoice = optChoice.filter(o =>!o.isProduct)

      let result = [...optSelect,...optChoice,...control_optSelect,...control_optChoice].flat()
      let priceResult = { //总价格
        price:0,
        aprice:0,
        bprice:0,
        cprice:0,
        retailPrice:0
      },standPrice = { //标配总价
        price:0,
        aprice:0,
        bprice:0,
        cprice:0,
        retailPrice:0
      },unStandPrice = { //非标配总价
        price:0,
        aprice:0,
        bprice:0,
        cprice:0,
        retailPrice:0
      }

      result.reduce((calc,item) =>{
        console.log(`${item.itemName} 成本价：${item.price} A价：${item.aprice} B价：${item.bprice} C价：${item.cprice} 销售价：${item.retailPrice}`)
        calc.price += (parseFloat(item.price) || 0)
        calc.aprice += (parseFloat(item.aprice) || 0)
        calc.bprice += (parseFloat(item.bprice) || 0)
        calc.cprice += (parseFloat(item.cprice) || 0)
        calc.retailPrice += (parseFloat(item.retailPrice) || 0)
        return calc
      },priceResult)

      unStandPrice = Object.assign({},priceResult)


      if(optStand.length > 0){
        console.log(`【标配】 ${optInfo.name} 成本价：${optInfo.price} A价：${optInfo.aprice} B价：${optInfo.bprice} C价：${optInfo.cprice} 销售价：${optInfo.retailPrice}`)
        priceResult.price += (parseFloat(optInfo.price) || 0)
        priceResult.aprice += (parseFloat(optInfo.aprice) || 0)
        priceResult.bprice += (parseFloat(optInfo.bprice) || 0)
        priceResult.cprice += (parseFloat(optInfo.cprice) || 0)
        priceResult.retailPrice += (parseFloat(optInfo.retailPrice) || 0)
      }
      if(control_optStand.length > 0){
        console.log(`【中控标配】 ${control_optInfo.name} 成本价：${control_optInfo.price} A价：${control_optInfo.aprice} B价：${control_optInfo.bprice} C价：${control_optInfo.cprice} 销售价：${control_optInfo.retailPrice}`)
        //totalPrice += (parseFloat(control_optInfo.price) || 0)
        priceResult.price += (parseFloat(control_optInfo.price) || 0)
        priceResult.aprice += (parseFloat(control_optInfo.aprice) || 0)
        priceResult.bprice += (parseFloat(control_optInfo.bprice) || 0)
        priceResult.cprice += (parseFloat(control_optInfo.cprice) || 0)
        priceResult.retailPrice += (parseFloat(control_optInfo.retailPrice) || 0)
      }

      standPrice = {
        price:parseFloat(priceResult.price - unStandPrice.price),
        aprice:parseFloat(priceResult.aprice - unStandPrice.aprice),
        bprice:parseFloat(priceResult.bprice - unStandPrice.bprice),
        cprice:parseFloat(priceResult.cprice - unStandPrice.cprice),
        retailPrice:parseFloat(priceResult.retailPrice - unStandPrice.retailPrice)
      }

      let formatPrice = n => {
        let _n = Math.round(parseFloat(n))
        if (_n < 10) return _n
        return (parseInt(_n / 10, 10) + (_n % 10 >= 5 ? 1 : 0)) * 10
      }
      

      Object.keys(priceResult).map(k =>{
        priceResult[k] = formatPrice(priceResult[k])
      })
      Object.keys(standPrice).map(k =>{
        priceResult[k] = formatPrice(priceResult[k])
      })
      Object.keys(unStandPrice).map(k =>{
        priceResult[k] = formatPrice(priceResult[k])
      })

      console.log('总价：',priceResult)
      console.log('标配总价：',standPrice)
      console.log('非标配总价',unStandPrice)
      return {
        totalPrice:priceResult,
        standPrice:standPrice,
        unStandPrice:unStandPrice
      }
    },
    query(id){
      let that = this
      that.reset()
      priceAdjustProductConfigDetail({ id: id ,isPrice:true}).then(res => {
        that.loading = false

        if(res.code !== 200){
          that.$message.info(res.msg)
          return
        }

        let { optStandData, optSelectData, optChoiceData ,optControlData} = that.productFormatData(res.data.sysConfigList)
        that.selectedHandler({
          name: res.data.name,
          model: res.data.model,
          productPic:res.data.productPic,
          type: res.data.type,
          remarks: res.data.remarks,
          price:res.data.price,
          aprice:res.data.aprice,
          bprice:res.data.bprice,
          cprice:res.data.cprice,
          retailPrice:res.data.retailPrice,
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

