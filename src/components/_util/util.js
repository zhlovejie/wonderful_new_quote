/**
 * components util
 */

/**
 * 清理空值，对象
 * @param children
 * @returns {*[]}
 */
export function filterEmpty (children = []) {
  return children.filter(c => c.tag || (c.text && c.text.trim() !== ''))
}

/**
 * 获取字符串长度，英文字符 长度1，中文字符长度2
 * @param {*} str
 */
export const getStrFullLength = (str = '') =>
  str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1
    }
    return pre + 2
  }, 0)

/**
 * 截取字符串，根据 maxLength 截取后返回
 * @param {*} str
 * @param {*} maxLength
 */
export const cutStrByFullLength = (str = '', maxLength) => {
  let showLength = 0
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1
    } else {
      showLength += 2
    }
    if (showLength <= maxLength) {
      return pre + cur
    }
    return pre
  }, '')
}

/**
 * 打印页面  增加合同打印样式
 * @param ele 打印部分的标签id
 * @param title  保存的文件的标题
 */
function handleWindowPrint (ele, title) {
  var oIframe = document.createElement('iframe')
  try{
    oIframe.style.width = 0
    oIframe.style.height = 0
  }catch(err){}
  var oScript = document.createElement('script')
  document.body.appendChild(oIframe)
  var titleText = document.head.getElementsByTagName('title')[0].innerText
  document.head.getElementsByTagName('title')[0].innerText = `${title}`
  oIframe.contentDocument.head.innerHTML =
    `
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="format-detection" content="telephone=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">

    <style type="text/css" media="print">
    body {-webkit-print-color-adjust：exact; font-family：Arial; }
    h1,h2,h3,h4,h5,h6{
      font-family: Arial !important;
      font-size: 10pt !important;
      font-weight: normal !important;
      color:#000 !important;
      padding:5pt 0;
      margin:0;
    }
    body{
      font-family: Arial !important;
      font-size: 10pt !important;
      font-weight: normal !important;
      color:#000 !important;
    }
    /* 合同打印 */

    .print-color-style{
      color: #000 !important;
    }
    .contract-header,.contract-main .main-top{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .contract-header .top-right-page{
      text-align: right;
    }

    .contract-title-part h2{
      margin:0;
      padding:10pt 0;
      text-align:center;
    }

    

    .ant-table{padding:10pt 0;}
    .ant-table table{width: 100%;border-collapse: collapse;}
    .ant-table table th{background-color: #fafafa;}
    .ant-table table th,.ant-table table td{
      border: 1px solid #e8e8e8;
      padding: 5px;
      text-align: center;
      font-size: 8pt;
    }

    .card-wrap{
      display: flex;
      justify-content: space-between;
      padding: 20px 0;
    }
    .card-wrap > div{
      padding: 20px;
      border: 1px solid #e8e8e8;
      margin-left: 5%;
      border-radius: 3px;
      width: 45%;
      position: relative;
    }
    .card-wrap > div:first-child{margin-left: 0;}
    .p-text-index{padding-left:2em;}

    /* 合同打印 END */
    

    /* 核价单信息导出PDF */
    .table-page-search-wrapper{
      line-height:2;
    }
    .table-page-search-wrapper h2{
      margin:0;
      padding:10pt 0;
      text-align:center;
    }
    .table-page-search-wrapper .ant-form-item{
      margin-bottom:20pt;
    }
    /* 核价单信息导出PDF END*/


    /*产品调试任务单导出PDF*/
    .sales-task-wrapper{
      line-height:2;
    }
    .sales-task-wrapper .ant-row-flex {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-flow: row wrap;
        flex-flow: row wrap;
        
        align-items: center;
    }
    .sales-task-wrapper .invoice-code-list-wrapper{
      margin-bottom:10pt;
    }

    .sales-task-wrapper input,.sales-task-wrapper textarea{
      border:none;
      display:none !important;
    }
    .sales-task-wrapper input[type='radio'],.sales-task-wrapper input[type='checkbox']{
      display:block !important;
    }

    .sales-task-wrapper .ant-radio-group,.sales-task-wrapper .ant-radio-group label{
      display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-flow: row wrap;
        flex-flow: row wrap;
        
        align-items: center;
    }

    
    
    input,textarea{
      font-family: Arial;
      font-size: 10pt;
      font-weight: normal;
      line-height:1.5;
    }

    .sales-task-wrapper .col-header{
      min-width:50pt;
      text-align:left;
    }
    .sales-task-wrapper .col-header:after{
      content:'：';
    }

    .sales-task-wrapper .ant-row-flex > div{
      width:35%;
      text-align: left;
    }
    
    .sales-task-wrapper .ant-row-flex > .col-header{
      width:15%;
    }
    .sales-task-wrapper .ant-form-item{
      border:none !important;
    }

    .ant-select-arrow,.print-hide{
      display:none !important;
    }

    label{
      display: inline-block;
    }
    .print-fl{
      float:left;
    }
    .debugging-task-sheet-wrapper{
      display:block !important;
    }
    .sales-task-wrapper .ant-table{
      padding:0;
    }
    /*产品调试任务单导出PDF END*/



    /*发货单导出PDF*/
    .invoice-approval-wrapper-print{
      background-color: #fff;
    }
    .invoice-approval-wrapper-print .ant-table{padding:0;}
    .invoice-approval-wrapper-print .custom-table{
      width: 100%;
      border-collapse: collapse;
      margin-bottom:0 !important;
    }
    .invoice-approval-wrapper-print .custom-table-border caption{
        text-align: center;
        padding: 10pt 0;
        font-size: 125%;
        font-weight: bold;
        caption-side:initial;
        color: inherit;
    }

    .invoice-approval-wrapper-print .custom-table-border th,td{
      border: 1px solid #d8d8d8;
      padding: 10pt;
      text-align: center;
      font-size:10pt;
    }

    .invoice-approval-wrapper-print .custom-table-border td.print-w150{
      width:80pt;
      color:#777;
    }
    .invoice-approval-wrapper-print .custom-table-border input,
    .invoice-approval-wrapper-print .custom-table-border select,
    .invoice-approval-wrapper-print .custom-table-border textarea{
      width:100%;
      border:none;
    }
    /*隐藏表格选择框*/
    .invoice-approval-wrapper-print th[key='selection-column'],
    .invoice-approval-wrapper-print .ant-table-selection-column{
      display:none;
    }
    .invoice-approval-wrapper-print .ant-select-selection-selected-value,
    .invoice-approval-wrapper-print input[disabled='disabled']{
      font-family: Arial !important;
      font-size: 10pt !important;
      font-weight: normal !important;
      color:#000 !important;
    }
    /*发货单导出PDF END*/
    /*产品报价预览*/
    .products-quotation-view-wrapper .custom-table{
      width: 100%;
      border-collapse: collapse;
      margin: -1px 0 0 0 !important;
    }
    .products-quotation-view-wrapper .custom-table-border caption{
        text-align: center;
        padding: 10pt 0;
        font-size: 125%;
        font-weight: bold;
        caption-side:initial;
        color: inherit;
    }
    .products-quotation-view-wrapper .custom-table .custom-table{
      /*margin: -1px;
      width: calc(100% + 2px);*/
    }
    .products-quotation-view-wrapper .custom-table th,
    .products-quotation-view-wrapper .custom-table td{
      position: relative;
      padding: 10pt;
      border: 1px solid #d8d8d8;
      text-align: center;
    }
  
    .products-quotation-view-wrapper .custom-table .bottom-line{
      /*position: absolute;
      height: 1px;
      width: 100%;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #fff;*/
    }
    /*产品报价预览 END*/


    #price-print-form-wrapper{
      background-color: #fff;
    }
    #price-print-form-wrapper .ant-table{padding:0;}
    #price-print-form-wrapper .custom-table{
      width: 100%;
      border-collapse: collapse;
      margin-bottom:0 !important;
    }
    #price-print-form-wrapper .custom-table-border caption{
        text-align: center;
        padding: 10pt 0;
        font-size: 125%;
        font-weight: bold;
        caption-side:initial;
        color: inherit;
    }

    #price-print-form-wrapper .custom-table-border th,td{
      border: 1px solid #d8d8d8;
      padding: 10pt;
      text-align: center;
    }
    #price-print-form-wrapper .header {
  display: flex;
  align-items: center;
  padding: 0 0 10px 0;
  overflow: hidden;
}
#price-print-form-wrapper .header .header_logo {
  flex: 1;
  display: flex;
  align-items: center;
}

#price-print-form-wrapper .header .header_logo .header_logo_txt {
  margin-left: 10pt;
}

#price-print-form-wrapper .header_info {
  display: flex;
  justify-content: space-between;
}

#price-print-form-wrapper .custom_info {
  color: #fff !important;
  background-color: #757882;
  font-size: 110%;
}
#price-print-form-wrapper .custom_info p {
  margin-bottom: 20px;
}
#price-print-form-wrapper .custom_info .custom_info_sell,
#price-print-form-wrapper .custom_info .custom_info_buy {
  position: relative;
  margin: 25% 0 0 20px;
}
#price-print-form-wrapper .custom_info .custom_info_sell::before,
#price-print-form-wrapper .custom_info .custom_info_buy::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  width: 30%;
  height: 4px;
  background-color: #d4e8f7;
}

#price-print-form-wrapper .custom_info .__ele-english i {
  color: #fff !important;
}
#price-print-form-wrapper .custom-table-border th,
#price-print-form-wrapper .custom-table-border td {
  padding: 5px 10px;
}

#price-print-form-wrapper >>> .custom-table-border .__table-thead {
  background-color: #d4e8f7;
}

#price-print-form-wrapper .add-form__bd-item {
  padding: 15px 0;
}

    </style>
  `
  oIframe.contentDocument.body.innerHTML = document.querySelector(ele).outerHTML
  
  
  //console.log(document.querySelector(ele).outerHTML)
  oScript.innerHTML = '(function(){setTimeout(function(){window.print()},500)})()'
  oIframe.contentDocument.body.appendChild(oScript)
  setTimeout(function(){
    document.body.removeChild(oIframe)
  },700)
  document.head.getElementsByTagName('title')[0].innerText = titleText
}

export default {
  handleWindowPrint
}
