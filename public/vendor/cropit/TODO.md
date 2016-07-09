## Unloading image

* <https://github.com/scottcheng/cropit/issues/26>
* Setting `background-image: none`
* Deal with `imageLoaded`


## ES6

* Use getters and setters
  * Beware of direct assignments, e.g. this.zoom = xxx
  * zoom, initialZoom, maxZoom, minZoom, exportZoom, imageLoaded = !!image.src, offset, imageState, ...
  * Perhaps even initialZoom could only have a setter (?)


## Improve resize quality

<https://github.com/scottcheng/cropit/issues/36>


## Rotation

* https://blueimp.github.io/JavaScript-Load-Image/
* https://github.com/blueimp/JavaScript-Load-Image


## Misc

* Make option strings into constants

* Conitnue dragging when mouse is outside of container
  * Look at: <http://tympanus.net/codrops/2014/10/30/resizing-cropping-images-canvas/>


## Pinch zoom

* Ref
  * <http://interactjs.io/>


## Website

* 1 px offset on image background

* Make splash demo size adapt to screen size

* Advertise new features
  * Mobile support
  * ...Check version history
  * Browser compatibility


## Lib

* Add onMovingStart, onMovingEnd option methods

* Add movable class. Only show cursor: move when movable

* Make draggable from background image


## Perhaps

* Separate Cropit UI and math (zoom, offset, etc) to make it more modular
