<template>
    <div>
        <header-cmp v-on:item-changed="updateContent($event)" hdlogo="/img/main-logo.png" :items="navItems" class="header"></header-cmp>
        <component class="content" v-bind:is="component"></component>

    </div>
</template>

<style>
    body {
        margin: 0px 0px 0px 0px;
    }
    .content {
        margin-left: 40px;
    }
</style>

<script>

import headerComponent from './components/header.vue'
import aboutComponent from './about.vue'
import projectsComponent from './projects.vue'

export default {
    components: {
        'header-cmp': headerComponent,
        'about-cmp': aboutComponent,
        'projects-cmp': projectsComponent
    },
    methods: {
        updateContent: function(text){

            switch (text){
                case 'About':{
                    window.location.assign('/');
                    break;
                }
                case 'Projects': {
                    window.location.assign('/projects');
                    break;
                }
                default:{
                    window.location.assign('/');
                    break;
                }
            }
        }
    },
    data: function () {
        return {
            navItems: [
                {text: "About"},
                {text: "Projects"},
                {text: "News"},
                {text: "Learn"},
                {text: "Forum"}
            ],
            component: 'about-cmp'
        }
    }
}

</script>
