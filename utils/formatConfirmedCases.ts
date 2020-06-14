type DataType = {
  attr: '検査実施人数'
  value: number
  children: [
    {
      attr: '陽性患者'
      value: number
      children: [
        {
          attr: '現在の感染者'
          value: number
          children: [
            {
              attr: '軽症・中等症'
              value: number
            },
            {
              attr: '重症'
              value: number
            }
          ]
        },
        {
          attr: '退院・療養終了'
          value: number
        },
        {
          attr: '死亡'
          value: number
        }
      ]
    }
  ]
}

type ConfirmedCasesType = {
  検査実施人数: number
  陽性患者: number
  現在の感染者: number
  軽症中等症: number
  重症: number
  死亡: number
  退院_療養終了: number
}

export default (data: DataType) => {
  const formattedData: ConfirmedCasesType = {
    検査実施人数: data.value,
    陽性患者: data.children[0].value,
    現在の感染者: data.children[0].children[0].value,
    軽症中等症: data.children[0].children[0].children[0].value,
    重症: data.children[0].children[0].children[1].value,
    死亡: data.children[0].children[2].value,
    退院_療養終了: data.children[0].children[1].value
  }
  return formattedData
}
