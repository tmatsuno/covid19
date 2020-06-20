<template>
  <div class="MainPage">
    <page-header
      :icon="headerItem.icon"
      :title="headerItem.title"
      :date="headerItem.date"
    />
    <whats-new class="mb-4" :items="newsItems" />
    <static-info
      class="mb-4"
      url="https://www.pref.chiba.lg.jp/kenfuku/kansenshou/corona-soudancenter.html#meyasu"
      :text="'自分や家族の症状に不安や心配があればまずは電話相談をどうぞ'"
      :btn-text="'相談の手順を見る'"
    />
    <div v-if="loading">
      Loading...
    </div>
    <div v-else>
      <v-row class="DataBlock">
        <v-col cols="12" md="6" class="DataCard">
          <data-view
            :title="$t('検査陽性者の状況')"
            :title-id="'details-of-confirmed-cases'"
          >
            <template v-slot:button>
              <p :class="$style.note">
                （注）県内において疑い例または患者の濃厚接触者として検査を行ったものについて掲載<br />
                （チャーター機帰国者、クルーズ船乗客等は含まれていない。）
              </p>
            </template>
            <confirmed-cases-details-table
              :aria-label="$t('検査陽性者の状況')"
              v-bind="confirmedCases"
            />
          </data-view>
        </v-col>
        <v-col cols="12" md="6" class="DataCard">
          <time-bar-chart
            title="陽性反応者数の推移"
            :title-id="'number-of-confirmed-cases'"
            :chart-id="'time-bar-chart-patients'"
            :chart-data="patientsGraph"
            :date="patientsDate"
            :unit="'人'"
          />
        </v-col>
        <v-col cols="12" md="6" class="DataCard">
          <time-stacked-bar-chart
            title="検査実施数"
            :title-id="'number-of-tested'"
            :chart-id="'time-stacked-bar-chart-inspections'"
            :chart-data="inspectionsGraph"
            :date="inspectionsDate"
            :items="inspectionsItems"
            :labels="inspectionsLabels"
            :unit="'件'"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import PageHeader from '@/components/PageHeader.vue'
import TimeBarChart from '@/components/TimeBarChart.vue'
import TimeStackedBarChart from '@/components/TimeStackedBarChart.vue'
import WhatsNew from '@/components/WhatsNew.vue'
import StaticInfo from '@/components/StaticInfo.vue'
import Data from '@/data/data.json'
import formatGraph from '@/utils/formatGraph'
import formatTable from '@/utils/formatTable'
import News from '@/data/news.json'
import DataView from '@/components/DataView.vue'
import ConfirmedCasesDetailsTable from '@/components/ConfirmedCasesDetailsTable.vue'

export default {
  components: {
    PageHeader,
    TimeBarChart,
    TimeStackedBarChart,
    WhatsNew,
    StaticInfo,
    DataView,
    ConfirmedCasesDetailsTable
  },
  data() {
    const DataPub = {}
    // 感染者数グラフ
    const patientsGraph = {}
    // 感染者数
    const patientsTable = formatTable(Data.patients.data)
    // 退院者グラフ
    const dischargesGraph = formatGraph(Data.discharges_summary.data)
    // 退院者数
    const dischargesTable = formatTable(Data.discharges.data)
    const inspectionsDate = {}
    const inspectionsGraph = []
    const inspectionsItems = ['陽性', '陰性']
    const inspectionsLabels = []
    const patientsDate = {}
    const patientsLabels = []

    const patientsAndNoSymptomsGraph = [
      Data.patients_and_no_symptoms_summary.data['患者'],
      Data.patients_and_no_symptoms_summary.data['無症状病原体保有者']
    ]
    const patientsAndNoSymptomsLabels =
      Data.patients_and_no_symptoms_summary.labels
    const sumInfoOfPatients = {
      lText: patientsAndNoSymptomsGraph[0].reduce((a, c) => a + c),
      sText:
        patientsAndNoSymptomsLabels[patientsAndNoSymptomsLabels.length - 1] +
        'の累計',
      unit: '人'
    }

    // 死亡者数
    // #MEMO: 今後使う可能性あるので一時コメントアウト
    // const fatalitiesTable = formatTable(
    //   Data.patients.data.filter(patient => patient['備考'] === '死亡')
    // )
    // 検査陽性者の状況
    const confirmedCases = {}

    const data = {
      Data,
      DataPub,
      patientsTable,
      patientsGraph,
      dischargesTable,
      dischargesGraph,
      // contactsGraph,
      // querentsGraph,
      inspectionsGraph,
      inspectionsDate,
      inspectionsItems,
      inspectionsLabels,
      sumInfoOfPatients,
      patientsDate,
      patientsLabels,
      confirmedCases,
      loading: true,
      errored: false,
      headerItem: {
        icon: 'mdi-chart-timeline-variant',
        title: '県内の最新感染動向',
        date: Data.lastUpdate
      },
      newsItems: News.newsItems.slice(0, 5),
      metroGraphOption: {
        responsive: true,
        legend: {
          display: true
        },
        scales: {
          xAxes: [
            {
              position: 'bottom',
              stacked: false,
              gridLines: {
                display: true
              },
              ticks: {
                fontSize: 10,
                maxTicksLimit: 20,
                fontColor: '#808080'
              }
            }
          ],
          yAxes: [
            {
              stacked: false,
              gridLines: {
                display: true
              },
              ticks: {
                fontSize: 12,
                maxTicksLimit: 10,
                fontColor: '#808080',
                callback(value) {
                  return value.toFixed(2) + '%'
                }
              }
            }
          ]
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            title(tooltipItems, _) {
              const label = tooltipItems[0].label
              return `期間: ${label}`
            }
          }
        }
      }
    }
    return data
  },
  mounted() {
    axios
      .get(
        'https://covid19chiba.s3-ap-northeast-1.amazonaws.com/DataPubTest.json'
      )
      .then(response => {
        this.DataPub = response.data
        this.patientsGraph = formatGraph(this.DataPub.patients.data)
        this.inspectionsDate = this.DataPub.inspections_summary.date
        this.inspectionsGraph = [
          this.DataPub.inspections_summary.data['陽性'],
          this.DataPub.inspections_summary.data['陰性']
        ]
        this.inspectionsLabels = this.DataPub.inspections_summary.labels
        this.patientsDate = this.DataPub.patients_summary.date
        this.patientsLabels = this.DataPub.patients_summary.labels
        const data = this.DataPub.main_summary
        const formattedData = {
          検査実施人数: 0,
          陽性患者: data.patients_count,
          現在の感染者:
            data.hospital_count +
            data.hospital_waiting_count +
            data.hotel_stay_count +
            data.home_stay_count,
          軽症中等症:
            data.hospital_count +
            data.hospital_waiting_count +
            data.hotel_stay_count +
            data.home_stay_count -
            data.severe_injury_count,
          重症: data.severe_injury_count,
          死亡: data.death_count,
          退院_療養終了: data.discharge_count + data.finish_stay_count
        }
        // this.confirmedCases = formatConfirmedCases(this.DataPub.main_summary)
        this.confirmedCases = formattedData
      })
      .catch(error => {
        this.errored = true
        this.error = error
      })
      .finally(() => (this.loading = false))
  },
  head() {
    return {
      title: '県内の最新感染動向'
    }
  }
}
</script>

<style lang="scss" scoped>
.MainPage {
  .DataBlock {
    margin: 20px -8px;
    .DataCard {
      @include largerThan($medium) {
        padding: 10px;
      }
      @include lessThan($small) {
        padding: 4px 8px;
      }
    }
  }
}
</style>
<style lang="scss" module>
.note {
  margin-top: 10px;
  margin-bottom: 0;
  font-size: 12px;
  color: $gray-3;
}
</style>
