function getCurrentUrl() {
  const url = location.href.split('?').shift()
  if (url.match(/\/$/)) {
    return url.replace(/\/$/, '')
  }

  if (url.match(/index\.html$/)) {
    return url.replace(/index\.html$/, '')
  }

  return url
}

const el = new Vue({
  el: '#app',
  data: {
    baseApiUrl: getCurrentUrl() + '/api',
    provinces: [],
    regencies: [],
    districts: [],
    villages: [],
    provinceId: '',
    regencyId: '',
    districtId: '',
    villageId: '',
    completed: false,
  },
  watch: {
    provinceId() {
      this.regencyId = ''
      this.districtId = ''
      this.villageId = ''
      this.fetchRegencies()
    },
    regencyId() {
      this.districtId = ''
      this.villageId = ''
      this.fetchDistricts()
    },
    districtId() {
      this.villageId = ''
      this.fetchVillages()
    },
    villageId() {
      this.completed = true
    }
  },
  computed: {
    urlApiProvinces() {
      return `${this.baseApiUrl}/provinces.json`
    },
    urlApiRegencies() {
      return `${this.baseApiUrl}/regencies/${this.provinceId}.json`
    },
    urlApiDistricts() {
      return `${this.baseApiUrl}/districts/${this.regencyId}.json`
    },
    urlApiVillages() {
      return `${this.baseApiUrl}/villages/${this.districtId}.json`
    },
    fetchProvincesCode() {
      return [
        `fetch(\`<a href="${this.urlApiProvinces}" target="_blank">${this.urlApiProvinces}</a>\`)`,
        '.then(response => response.json())',
        '.then(provinces => console.log(provinces));'
      ].join('\n')
    },
    fetchRegenciesCode() {
      return !this.provinceId ? '' : [
        `// ${this.provinceId} = ID Provinsi`,
        `fetch(\`<a href="${this.urlApiRegencies}" target="_blank">${this.urlApiRegencies}</a>\`)`,
        '.then(response => response.json())',
        '.then(regencies => console.log(regencies));'
      ].join('\n')
    },
    fetchDistrictsCode() {
      return !this.regencyId ? '' : [
        `// ${this.regencyId} = ID Kab/Kota`,
        `fetch(\`<a href="${this.urlApiDistricts}" target="_blank">${this.urlApiDistricts}</a>\`)`,
        '.then(response => response.json())',
        '.then(districts => console.log(districts));'
      ].join('\n')
    },
    fetchVillagesCode() {
      return !this.districtId ? '' : [
        `// ${this.districtId} = ID Kecamatan`,
        `fetch(\`<a href="${this.urlApiVillages}" target="_blank">${this.urlApiVillages}</a>\`)`,
        '.then(response => response.json())',
        '.then(villages => console.log(villages));'
      ].join('\n')
    },
    selectedProvince() {
      return this.provinces.find(item => item.id == this.provinceId)
    },
    selectedRegency() {
      return this.regencies.find(item => item.id == this.regencyId)
    },
    selectedDistrict() {
      return this.districts.find(item => item.id == this.districtId)
    },
    selectedVillage() {
      return this.villages.find(item => item.id == this.villageId)
    },
    responseProvinces() {
      return JSON.stringify(this.provinces, null, 2)
    },
    responseRegencies() {
      return JSON.stringify(this.regencies, null, 2)
    },
    responseDistricts() {
      return JSON.stringify(this.districts, null, 2)
    },
    responseVillages() {
      return JSON.stringify(this.villages, null, 2)
    },
  },
  created() {
    this.fetchProvinces()
  },
  methods: {
    async fetchProvinces() {
      const result = await fetch(`api/provinces.json`)
      this.provinces = await result.json()
    },
    async fetchRegencies() {
      if (!this.provinceId) {
        this.regencies = []
        return
      }
      const result = await fetch(`api/regencies/${this.provinceId}.json`)
      this.regencies = await result.json()
    },
    async fetchDistricts() {
      if (!this.regencyId) {
        this.districts = []
        return
      }

      const result = await fetch(`api/districts/${this.regencyId}.json`)
      this.districts = await result.json()
    },
    async fetchVillages() {
      if (!this.districtId) {
        this.villages = []
        return
      }

      const result = await fetch(`api/villages/${this.districtId}.json`)
      this.villages = await result.json()
    }
  }
})
