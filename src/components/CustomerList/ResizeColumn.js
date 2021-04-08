function ResizeColumn(opt = {}) {
  this._opt = Object.assign({
    container: '.resize-column-wrapper',
    controlBar: '.resize-column-control-bar',
    left: '.resize-column-left',
    right: '.resize-column-right'
  }, opt)

  this.controlBarInfo = {
    isLocked: false,
    pos: 0
  }

  this.container = document.querySelector(this._opt.container)
  this.controlBar = document.querySelector(this._opt.controlBar)
  this.left = document.querySelector(this._opt.left)
  this.right = document.querySelector(this._opt.right)

  this._downHandler = this.downHandler.bind(this)
  this._moveHandler = this.moveHandler.bind(this)
  this._upHandler = this.upHandler.bind(this)

  this.w = (this.container.offsetWidth) / 100
  this.init()
  this.bindEvent()
}

ResizeColumn.prototype.init = function (e) {
  this.left.style.width = '25%'
  this.controlBarInfo.isLocked = false
  this.w = (this.container.offsetWidth) / 100
  this.controlBarInfo.pos = this.controlBar.offsetLeft
}

ResizeColumn.prototype.bindEvent = function () {
  this.container.addEventListener('mousedown', this._downHandler, false)
  this.container.addEventListener('mousemove', this._moveHandler, false)
  this.container.addEventListener('mouseup', this._upHandler, false)
  window.addEventListener('resize', this.init, false)
}

ResizeColumn.prototype.downHandler = function (e) {
  if (e.target !== this.controlBar) {
    return
  }
  this.controlBarInfo.isLocked = true
  this.controlBarInfo.pageX = e.pageX
  this.controlBarInfo.pos = e.pageX
  console.log('downHandler  pageX:',e.pageX,'controlBarInfo:',this.controlBarInfo)
}

ResizeColumn.prototype.moveHandler = function (e) {
  if (!this.controlBarInfo.isLocked) {
    return
  }
  let { pageX } = e
  let offsetLeft = pageX - this.controlBarInfo.pageX + this.controlBarInfo.pos
  let leftWidth = offsetLeft / this.w

  console.log('moveHandler  pageX:',pageX,'controlBarInfo:',this.controlBarInfo)
  this.left.style.width = `${leftWidth > 100 ? 100 : leftWidth}%`
}

ResizeColumn.prototype.upHandler = function (e) {
  this.controlBarInfo.isLocked = false
  this.controlBarInfo.pos = e.pageX
  console.log('upHandler:',this.controlBarInfo)
}

ResizeColumn.prototype.destory = function () {
  this.container.removeEventListener('mousedown', this._downHandler)
  this.container.removeEventListener('mousemove', this._moveHandler)
  this.container.removeEventListener('mouseup', this._upHandler)
  window.removeEventListener('resize', this.init)
}

export default ResizeColumn
