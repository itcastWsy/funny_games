import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import { 
  Button,
  Tabbar, 
  TabbarItem,
  NavBar,
  Cell,
  CellGroup,
  Form,
  Field,
  Image as VanImage,
  Icon
} from 'vant';
import 'vant/lib/index.css';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

// Register Vant components
app.use(Button);
app.use(Tabbar);
app.use(TabbarItem);
app.use(NavBar);
app.use(Cell);
app.use(CellGroup);
app.use(Form);
app.use(Field);
app.use(VanImage);
app.use(Icon);

app.mount('#app');