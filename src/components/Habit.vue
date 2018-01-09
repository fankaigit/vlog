<template>
  <div>
    <section id="header" class="hero is-info is-small">
      <p class="title">{{ habit.id > 0 ? '编辑' : '新建'}}活动</p>
    </section>

    <section id="form">

      <div class="field">
        <label>名称</label>
        <input type="text" v-model="habit.name" placeholder="新的活动"/>
      </div>

      <div class="field">
        <label>最小值</label>
        <input type="text" v-model="habit.min" placeholder="min"/>
      </div>

      <div class="field">
        <label>最大值</label>
        <input type="text" v-model="habit.max" placeholder="max"/>
      </div>

      <div class="field">
        <label>步长</label>
        <input type="text" v-model="habit.step" placeholder="step"/>
      </div>

      <div class="field">
        <label>单位</label>
        <input type="text" v-model="habit.unit" placeholder="unit"/>
      </div>

      <div class="field">
        <label>自定义值</label>
        <input type="text" v-model="hvalues" placeholder="空格分开的描述"/>
      </div>

    </section>

    <section id="actions">
      <span class="button is-success is-large" @click="save()">保存</span>
      <span class="button is-warning is-large" @click="cancel()">返回</span>
    </section>

    <div style="margin-top: 10%">
      <router-link to="/daily">daily</router-link>
    </div>
  </div>

</template>

<style scoped>

  #form {
    display: table;
  }

  #form .field {
    display: table-row;
  }

  #form label {
    display: table-cell;
    min-width: 5em;
    font-size: 90%;
    padding: 0.2em 0.5em;
  }

  #form input {
    display: table-cell;
  }

</style>

<script>
  import log from '../utils/log'
  const template = {
    id: undefined,
    name: '',
    min: 0,
    max: 10,
    step: 1,
    unit: '',
    values: []
  }

  export default {
    name: 'Habit',
    data: function () {
      return {
        habit: undefined,
        hvalues: undefined
      }
    },
    methods: {
      save: function () {
        log.info('save editing')
        let h = this.habit
        let valuesStr = this.hvalues.replace(/^\s+|\s+$/g, '')
        if (valuesStr !== '') {
          h.values = valuesStr.split(/\s+/)
          h.min = 0
          h.max = h.values.length - 1
          h.step = 1
          h.unit = ''
        } else {
          h.values = []
        }
        h.id = h.id || Date.now()
        log.info('save habit:', h)
        this.$store.commit('saveHabit', h)
        this.$router.push(`/habits/${h.id}`)
      },
      cancel: function () {
        log.info('cancel editing')
        this.$router.push(`/habits`)
      }
    },
    // only assign once on created
    created: function () {
      this.$store.dispatch('init')
      let hid = this.$route.params.hid
      this.habit = this.$store.state.data.habits[hid] || JSON.parse(JSON.stringify(template))
      this.hvalues = this.habit.values.join(' ')
    },
    beforeDestroy: function () {
      log.info('destroy')
    }
  }
</script>

