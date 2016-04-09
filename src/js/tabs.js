angular.module('tabs', [])
.component('tabs', {
  transclude: true,
  controller: function() {
    var panes = this.panes = [];
    this.select = function(pane) {
      angular.forEach(panes, function(pane) {
        pane.selected = false;
      });
      pane.selected = true;
    };
    this.addPane = function(pane) {
      if (panes.length === 0) {
        this.select(pane);
      }
      panes.push(pane);
    };
  },
  templateUrl: 'tabs.html'
})
.component('tab', {
  transclude: true,
  require: {
    tabsCtrl: '^myTabs'
  },
  bindings: {
    title: '@'
  },
  controller: function() {
    this.$onInit = function() {
      this.tabsCtrl.addPane(this);
      console.log(this);
    };
  },
  templateUrl: 'tab.html'
});