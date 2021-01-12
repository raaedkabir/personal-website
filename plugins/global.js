import Vue from 'vue';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

// require component context
const requireComponent = require.context('../components/UI', false, /App[\w-]+\.vue$/);

requireComponent.keys().forEach((fileName) => {
  // get component config
  const componentConfig = requireComponent(fileName);

  // get PascalCase name of component
  const componentName = upperFirst(camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')));

  // register component globally
  Vue.component(componentName, componentConfig.default || componentConfig);
});
