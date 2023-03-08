// components/my-radio/my-radio-group
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  externalClasses: ['radio-group-class'],
  /**
   * 组件的初始数据
   */
  data: {
    checked:null
  },

  relations: {
    './my-radio': {
      type: 'child', // 关联的目标节点应为子节点
      linked: function(target) {
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
      },
      linkChanged: function(target) {
        // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
      },
      unlinked: function(target) {
        // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
      }
    }
  },
  methods: {
    _getAllLi: function(){
      // 使用getRelationNodes可以获得nodes数组，包含所有已关联的custom-li，且是有序的
      let nodes = this.getRelationNodes('./my-radio');
      return nodes;
    },
    tapThis: function() {
      let nodes =  this._getAllLi();
      let newChecked = null;
      let flag = true;
      for(let i=0; i<nodes.length; i++){
        if(nodes[i].data.choice === true && this.data.checked !== nodes[i].data.value){
          newChecked = nodes[i].data.value;
        }
        // 判断是否所有子组件全假的
        if (nodes[i].data.choice === true) {
          flag = false;
        }
      }
      // 所有子组件全假（未选中任何一个）或者有新选中的组件时更新整个子组件列表
      if (newChecked || flag) {
        for(let i=0; i<nodes.length; i++){
          if(nodes[i].data.value !== newChecked){
            nodes[i].setData({choice:false});
          }else{
            nodes[i].setData({choice:true});
          }
        }
        this.data.checked = newChecked;
      }
      this.triggerEvent('change',{value:this.data.checked});
    }
  },
  ready: function(){
    let nodes =  this._getAllLi();
    for(let i=0;i<nodes.length;i++){
      if(nodes[i].data.checked===true&&this.data.checked===null){
        this.data.checked = nodes[i].data.value;
      }else if(nodes[i].data.checked===true&&this.data.checked!==nodes[i].data.value){
        nodes[i].setData({checked:false});
      }
    }
  }
})
