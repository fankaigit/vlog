<template>
  <div>
    <section id="header" class="hero is-info is-small">
      <p class="title">{{ habit.id > 0 ? '编辑' : '新建'}}活动</p>
    </section>

    <section id="form">

      <div class="field">
        <div>
          <label>活动类型</label>
        </div>
        <div class="select is-info ">
          <select v-model="type">
            <option v-for="(v, k) in types" :value="k">{{v}}</option>
          </select>
        </div>
      </div>

      <div class="field">
        <div>
          <label>活动名称</label>
        </div>
        <input class="input is-primary " type="text" v-model="habit.name"
               placeholder="活动名称"/>
      </div>

      <div class="field" v-if="type === 'number'">
        <div>
          <label>数值范围和单位</label>
        </div>
        <div class="columns is-mobile">
          <div class="column is-3">
            <input class="input is-warning" type="text" v-model="habit.min" placeholder="min"/>
          </div>
          <div class="column is-2" style="text-align:center;margin-top: 0.4em">-</div>
          <div class="column is-3">
            <input class="input is-warning" type="text" v-model="habit.max" placeholder="max"/>
          </div>
          <div class="column is-1"></div>
          <div class="column is-3">
            <input class="input is-warning" type="text" v-model="habit.unit" placeholder="unit"/>
          </div>
        </div>
      </div>

      <div class="field" v-if="type === 'custom'">
        <label>自定义标签</label>
        <input class="input is-warning" type="text" v-model="hvalues" placeholder="空格分开的标签"/>
      </div>

      <div class="field notice" v-if="type === 'check'">
        <p>用于打卡，每天只能记录一次。</p>
        <p>比如记录每天是否运动。</p>

      </div>

      <div class="field notice" v-if="type === 'number'">
        <p>使用数值来记录，每天可记录多次。</p>
        <p>比如每天跑步3-5公里，可以设置数值范围为3-5，单位为公里。</p>
      </div>

      <div class="field notice" v-if="type === 'custom'">
        <p>使用自定义标签来记录，每天可记录多次。</p>
        <p>比如用于记录运动状态，可以设置标签为 轻微、适量、剧烈。</p>
      </div>

    </section>

    <section id="actions">
      <div id="normal">
        <div id="save" class="button is-success " @click="save()">保存</div>
        <div id="return" class="button is-warning" @click="cancel()">返回</div>
      </div>
      <div id="delete" class="button is-danger " @click="remove()" v-if="habit.id">删除</div>
    </section>
  </div>

</template>

<style scoped>

  #header {
    margin-bottom: 1em;
  }

  #form .field {
    margin: 1rem 1rem;
  }

  #form .columns {
    margin: 0;
  }

  #form .column {
    padding: 0;
  }

  #form .notice {
    font-size: 90%;
  }

  #actions {
    margin: 2rem 1rem;
  }

  #actions .button {
    width: 100%;
  }

  #actions #normal {
    display: flex;
    margin: 1rem -0.5rem;
  }

  #actions #normal .button {
    flex-grow: 1;
    margin: 0.5rem;
  }

  input.input {
    border-width: 1px;
    padding-left: 0.4em;
  }

</style>

<script>
  import log from '../utils/log'
  import htypes from '../utils/htypes'

  const template = {
    id: undefined,
    name: '',
    min: 0,
    max: 10,
    step: 1,
    unit: '',
    values: [],
    type: 'number'
  }

  export default {
    name: 'Habit',
    data: function () {
      return {
        habit: undefined,
        hvalues: undefined,
        types: htypes,
        type: 'number'
      }
    },
    methods: {
      save: function () {
        log.info('save editing')
        let h = this.habit
        h.type = this.type
        let valuesStr = this.hvalues.replace(/^\s+|\s+$/g, '')
        if (h.type === 'custom') {
          h.values = valuesStr.split(/\s+/)
          h.min = 0
          h.max = h.values.length - 1
          h.step = 1
          h.unit = ''
        } else if (h.type === 'check') {
          h.values = []
          h.min = 0
          h.max = 1
          h.step = 1
          h.unit = ''
        } else {
          h.values = []
        }
        h.id = h.id || Date.now()
        log.info('save habit:', h)
        this.$store.commit('saveHabit', h)
        this.$router.go(-1)
      },
      cancel: function () {
        log.info('cancel editing')
        this.$router.go(-1)
      },
      remove: function () {
        log.info('remove habit')
        this.habit.deleted = true
        this.$store.commit('saveHabit', this.habit)
        this.$router.go(-1)
      }
    },
    // only assign once on created
    created: function () {
      this.$store.dispatch('init')
      let hid = this.$route.params.hid
      this.habit = this.$store.state.data.habits[hid] || JSON.parse(JSON.stringify(template))
      this.hvalues = this.habit.values.join(' ')
      this.type = this.habit.type
    },
    beforeDestroy: function () {
      log.info('destroy')
    }
  }
</script>

