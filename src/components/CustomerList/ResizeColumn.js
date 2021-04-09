function ResizeColumn(opt) {
  this._opt = Object.assign({
    container: '.resize-column-wrapper',
    controlBar: '.resize-column-control-bar',
    left: '.resize-column-left',
    initValue: 250
  }, opt)

  this.ele_container = document.querySelector(this._opt.container)
  this.ele_controlBar = this.ele_container.querySelector(this._opt.controlBar)
  this.ele_left = this.ele_container.querySelector(this._opt.left)

  this.maxVal = 0
  this.startX = 0
  this.left = 0
  this.isDragging = false

  const containerWidth = this.ele_container.offsetWidth
  this.maxVal = containerWidth - this.ele_controlBar.offsetWidth - 20
  this.w = Math.round(containerWidth / 100 * 100) / 100

  this._dragStart = this.dragStart.bind(this)
  this._dragMove = this.dragMove.bind(this)
  this._dragEnd = this.dragEnd.bind(this)

  this.ele_controlBar.addEventListener('mousedown', this._dragStart, false)

  if (this._opt.initValue) {
    this.initValue(this._opt.initValue)
  }
}

ResizeColumn.prototype.initValue = function (val) {
  this.ele_left.style.width = `${Math.round(val / this.w * 100) / 100}%`
  this.left = val
}

ResizeColumn.prototype.dragStart = function (e) {
  e.preventDefault();
  this.isDragging = true
  this.startX = e.clientX
  this.left = this.ele_left.offsetWidth
  document.addEventListener('mousemove', this._dragMove, false)
  document.addEventListener('mouseup', this._dragEnd, false)
}

ResizeColumn.prototype.dragMove = function (e) {
  e.preventDefault();
  if (!this.isDragging) {
    return false
  }
  let dragValue = (e.clientX - this.startX) + this.left
  dragValue = dragValue > this.maxVal ? this.maxVal : (dragValue < 0 ? 0 : dragValue)
  let dragRatio = Math.round((dragValue / this.w) * 100) / 100
  this.ele_left.style.width = `${dragRatio}%`
}

ResizeColumn.prototype.dragEnd = function (e) {
  e.preventDefault();
  this.isDragging = false
  document.removeEventListener('mousemove', this._dragMove, false)
  document.removeEventListener('mouseup', this._dragEnd, false)
}

ResizeColumn.prototype.destory = function(){
  this.ele_controlBar.removeEventListener('mousedown', this._dragStart, false)
}
export default ResizeColumn
