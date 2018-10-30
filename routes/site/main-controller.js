var router = require('express').Router();

router.get('/', function(req, res){

    const data = {component: 'about-cmp'};
    const vueOptions = {}

    res.renderVue('main.vue', data, vueOptions);
})

router.get('/projects', function(req, res){

    const data = {component: 'projects-cmp'}
    const vueOptions = {}

    res.renderVue('main.vue', data, vueOptions);
})

module.exports = router;
