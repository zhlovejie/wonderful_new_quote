<script>
/**显示审批状态 */
export default {
  name:'status-view',
  props:{
    statusFn:Function
  },
  render(h){
    if(!this.statusFn instanceof Function){
      return null
    }
    let res = this.statusFn.call()
    if(!res){
      return null
    }
    let {map,cur,pass,nopass} = res
    let isEmpty = (obj) => obj === undefined || obj === null
    if(isEmpty(map) || isEmpty(cur) || isEmpty(pass) || isEmpty(nopass)){
      console.log('参数缺失')
      return null
    }
    let type = `${cur === nopass ? 'close' : cur === pass ? 'check' : 'clock'}-circle`
    let style = {
      fontSize:'24px',
      color:cur === nopass ? '#f5222d' : cur === pass ? '#52c41a' : '#1890ff',
      margin:'10px',
      position: 'relative',
      top:'3px'
    }
    let ele = [
      h('a-icon',{props:{type},style}),
      h('span',{},`审批状态【${map[cur]}】`)
    ]
    return h('h3',{},ele)
  }
}
</script>