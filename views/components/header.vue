<template>
    <div class="banner">
        <div id="line" class="line">
        </div>
        <div class="vert-align">
            <div class="hor-align" style="width: 45%;">
                <img class="logo" v-bind:src="hdlogo"></img>
            </div>
            <div class="hor-align" style="position: absolute;">
                <item-cmp
                v-for="data in items"
                :key="data.id"
                class="nav-item"
                :text="data.text"
                v-on:item-changed="itemChanged">
                </item-cmp>
            </div>
        </div>
    </div>
</template>

<style type="text/css">
    .banner {
        background-color: #97a1b7;
        width: 100%;
        height: 80px;
    }
    .vert-align {
        position: relative;
        top: 10%;
        height: 80%;
    }
    .logo {
        position: relative;
        height: 100%;
        left: 20px
    }
    .hor-align {
        display: inline-block;
        height: 90%;
    }
    .line {
        background-color: #516068;
        height: 10%;
    }

    .nav-item {
        font-size: 1.5em;
        font-family: Lato,'Helvetica Neue', Arial, Helvetica, sans-serif;
        color: white;
        display: inline;
        position: relative;
        top: 25%;
        margin-right: 20px;
    }
    .nav-item:hover {
        color: grey;
    }
</style>

<script>

var itemCmp = {
    data: function() {
        return {
        }
    },
    props: {
        text: String
    },
    methods: {
        clicked: function(){
            this.$emit('item-changed', this.text);
        }
    },
    template: "<a @click='clicked()' style='cursor: pointer;'>{{text}}</a>"
}

export default {
    data: function () {
        return {
            links: [

            ]
        }
    },
    props: {
        hdlogo: String,
        items: Array
    },
    methods: {
        itemChanged: function(text){
            this.$emit('item-changed', text);
        }
    },
    components: {
        'item-cmp': itemCmp
    }
}

</script>
