<template>
    <div>
        <h1>Projects</h1>
        <ul>
            <li><a href="#wa-filters">cascade filters</a></li>
        </ul>

        <h2 id="wa-filters">Cascade filters</h2>
        <p>Here is an example made with the WebAudio implementing a series
        of biquad filters. It can be used to design more complex filters. Here
        we apply the filters to a oscillator.
        </p>
        <div id="filter-section">
            <div class="flex-content">
                <b class="title elem">Oscillator</b>
                <b class="label elem">type</b>
                <select class="elem"v-model="oscType">
                    <option value="sine">sine</option>
                    <option value="sawtooth">sawtooth</option>
                    <option value="square">square</option>
                    <option value="triangle">triangle</option>
                </select>
                <b class="label elem">frequency</b>
                <input class="elem" style="width: auto" v-model="oscFrequency" type="range" max="2000" min="20">
                <b class="label elem">start/stop</b>
                <input class="elem" type="checkbox" v-model="oscActive" name="oscillator">
            </div>
            <filter-cmp v-for="(filter, index) in filters"
                        :type="filter.type"
                        :frequency="filter.frequency"
                        :gain="filter.gain"
                        :Q="filter.Q"
                        v-on:tchanged="tchanged(index, $event)"
                        v-on:fchanged="fchanged(index, $event)"
                        v-on:gchanged="gchanged(index, $event)"
                        v-on:Qchanged="Qchanged(index, $event)"></filter-cmp>
        </div>
    </div>
</template>

<style type="text/css">
    #filter-section {
        display: flex;
        flex-direction: row;
    }
    #filter-section .flex-content {
        display: flex;
        flex-direction: column;
        border-style: solid;
        border-width: 3px;
    }
    #filter-section .label {
        text-align: center;
        font-size: 0.80em;
    }
    #filter-section .elem {
        padding: 5px;
    }
    #filter-section .title {
        font-size: 1.2em;
        border-style: double;
        text-align: center;
    }
</style>

<script>

var filterComponent = {

    data: function() {
        return {}
    },
    props: {
        type: String,
        frequency: Number,
        Q: Number,
        gain: Number,
    },
    computed: {
        displayGain: {
            get: function(){
                return this.gain * 10;
            },
            set: function(gain){
                this.gain = gain / 10.;
                this.$emit('gchanged', this.gain);
            }
        }
    },
    watch: {
        type: function(type){
            this.$emit('tchanged', type);
        },
        frequency: function(frequency){
            this.$emit('fchanged', frequency);
        },
        Q: function(Q) {
            this.$emit('Qchanged', Q);
        }
    },
    template: `<div class="flex-content">
        <b class="title elem">Filter</b>
        <b class="label elem">type</b>
        <select class="elem" v-model="type">
            <option value="lowpass">lowpass</option>
            <option value="highpass">highpass</option>
            <option value="peaking">peaking</option>
            <option value="notch">notch</option>
        </select>
        <b class="label elem">frequency</b>
        <input class="elem" style="width: auto" v-model="frequency" type="range" max="20000" min="20">
        <b class="label elem">quality</b>
        <input class="elem" style="width: auto" v-model="Q" type="range" max="10" min="0">
        <b class="label elem">gain</b>
        <input class="elem" style="width: auto" v-model="displayGain" type="range" max="100" min="-100">
    </div>`
}

export default{
    data: function(){
        return {
            oscType: "sine",
            oscFrequency: 440,
            oscActive: false,
            filters: [
                {type: "lowpass", frequency: 20000, Q: 1, gain: 1},
                {type: "peaking", frequency: 1000, Q: 1, gain: 1},
                {type: "peaking", frequency: 1500, Q: 1, gain: 1},
                {type: "highpass", frequency: 20, Q: 1, gain: 1}
            ]
        }
    },
    components: {
        'filter-cmp': filterComponent
    },
    methods: {
        tchanged: function(index, type) {
            this.filters[index].type = type;
            this.filters[index].audioNode.type = type;
        },
        fchanged: function(index, freq) {
            this.filters[index].frequency = freq;
            this.filters[index].audioNode.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        },
        Qchanged: function(index, Q) {
            this.filters[index].Q = Q;
            this.filters[index].audioNode.Q.setValueAtTime(Q, this.audioCtx.currentTime);
        },
        gchanged: function(index, gain) {
            console.log("gchanged")
            this.filters[index].gain = gain;
            this.filters[index].audioNode.gain.setValueAtTime(gain, this.audioCtx.currentTime);
        }
    },
    mounted: function() {

        this.audioCtx = new AudioContext();

        for(var i = 0; i < this.filters.length; ++i) {
            var audioNode = this.audioCtx.createBiquadFilter();
            var filter = this.filters[i];
            audioNode.type = filter.type;
            audioNode.frequency.setValueAtTime(filter.frequency, this.audioCtx.currentTime);
            audioNode.Q.setValueAtTime(filter.Q, this.audioCtx.currentTime);
            audioNode.gain.setValueAtTime(filter.gain, this.audioCtx.currentTime);
            filter.audioNode = audioNode;
        }
        if (this.filters.length > 1)
        {
            for(var i = 0; i < this.filters.length - 1; ++i)
            {
                this.filters[i].audioNode.connect(this.filters[i+1].audioNode);
            }
        }

        if (this.filters.length > 0)
        {
            this.filters[this.filters.length - 1].audioNode.connect(this.audioCtx.destination);
        }
    },
    watch: {
        oscActive: function(newValue, oldValue) {

            if(newValue) {
                this.osc = this.audioCtx.createOscillator();
                this.osc.type = this.oscType;
                this.osc.frequency.setValueAtTime(this.oscFrequency, this.audioCtx.currentTime);
                this.osc.connect(this.filters[0].audioNode);
                this.osc.start();
            }
            else {
                this.osc.stop();
            }
        },
        oscType: function(newValue, oldValue) {

            if (this.osc){
                this.osc.type = newValue
            }
        },
        oscFrequency: function(newValue, oldValue) {

            if (this.osc) {
                this.osc.frequency.setValueAtTime(newValue, this.audioCtx.currentTime);
            }
        }
    }
}
</script>
