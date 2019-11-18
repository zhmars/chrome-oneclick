<template>
  <div id="app">
    <!-- <p align="center">{{ message }}</p> -->
    <ul>
      <li v-for="ext of extensions"
        :key="ext.id"
        :class="{ disabled: !ext.enabled}"
        :title="getTitle(ext)"
        @click="toggleExtension(ext)"
        @contextmenu="uninstallExtension(ext, $event)"
        >
        <img src="img/icons/default.png" alt="" v-if="!ext.icons">
        <template v-for="(icon, index) of ext.icons" v-else>
          <img :src="icon.url" :alt="ext.name" v-if="index === ext.icons.length - 1" :key="index">
        </template>
        <span>
        {{ ext.name }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'app',
  data: () => {
    return {
      self: {},
      all: [],
      message: 'Hello, Vue.js'
    }
  },
  computed: {
    extensions: function () {
      return this.all.filter((item) => {
        return !item.isApp && item.id !== this.self.id
      })
    }
  },
  mounted: function () {
    this.updateExtensions()
    const that = this
    chrome.management.getSelf((result) => {
      that.self = result
    })
  },
  methods: {
    updateExtensions: function () {
      const that = this
      chrome.management.getAll((result) => {
        that.all = result
      })
    },
    getTitle: function (ext) {
      return ext.enabled ? chrome.i18n.getMessage('leftclicktodisablethis') + chrome.i18n.getMessage('rightclicktouninstallthis')
        : chrome.i18n.getMessage('leftclicktoenablethis') + chrome.i18n.getMessage('rightclicktouninstallthis')
    },
    toggleExtension: function (ext) {
      const that = this
      chrome.management.setEnabled(ext.id, !ext.enabled, () => {
        that.updateExtensions()
      })
    },
    uninstallExtension: function (ext, event) {
      event.preventDefault()
      const that = this
      // https://stackoverflow.com/questions/24835110/getting-unchecked-runtime-lasterror-while-running-management-uninstall
      // If an extension uninstalls another extension, this parameter is ignored and the dialog is always shown.
      chrome.management.uninstall(ext.id, { showConfirmDialog: true }, () => {
        // https://stackoverflow.com/questions/28431505/unchecked-runtime-lasterror-when-using-chrome-api
        // ignore runtime.lastError
        /* eslint-disable no-void */
        void chrome.runtime.lastError
        that.updateExtensions()
      })
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  text-indent: 10px;
  overflow: hidden;
  border-top: .2px solid #ccc;
  height: 32px;
  line-height: 32px;
  cursor: default;
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

li:last-child {
  border-bottom: .2px solid #ccc;
  margin-bottom: 0;
}

li:hover {
  background: #92b372;
}

img {
  height: 16px;
  padding-left: 16px;
}

.disabled {
  background-color: #ccc;
}
</style>
