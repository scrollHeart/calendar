import Vue from 'vue'
import App from './App.vue'
import Moment from 'moment'
import { Button, ButtonGroup, DatePicker, Message, Select, Option} from 'element-ui';
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(DatePicker)
Vue.use(Select)
Vue.use(Option)
Vue.config.productionTip = false
Vue.prototype.$moment = Moment;
Vue.prototype.$message = Message;
new Vue({
  render: h => h(App),
}).$mount('#app')
