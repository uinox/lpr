export const columns = [
  {
    label: "",
    prop: "expand",
    align: "center",
    width: 64,
    list: [
      {
        label: "还款金额",
        prop: "repaymentAmount",
        align: "center",
        width: 120
      },
      {
        label: "还款时间",
        prop: "repaymentDate",
        align: "center",
        width: 120
      },
      {
        label: "利息",
        prop: "interest",
        align: "center",
        width: 120
      },
      {
        label: "剩余利息",
        prop: "outstandingInterest",
        align: "center",
        width: 120
      },
      {
        label: "剩余本金",
        prop: "outstandingAmount",
        align: "center",
        width: 120
      },
      {
        label: "剩余本息合计",
        prop: "total",
        align: "center",
        width: 120
      }
    ]
  },
  {
    label: "序号",
    prop: "index",
    align: "center",
    width: 64
  },
  {
    label: "借款名称",
    prop: "loanName",
    align: "center",
    width: 120
  },
  {
    label: "借款金额",
    prop: "loanAmount",
    align: "center",
    width: 120
  },
  {
    label: "借款时间",
    prop: "loanStartDate",
    align: "center",
    width: 120
  },
  {
    label: "借款截止时间",
    prop: "loanEndDate",
    align: "center",
    width: 120
  },
  {
    label: "借款月利率(%)",
    prop: "rateMonth",
    align: "center",
    width: 120
  },
  {
    label: "借款年利率(%)",
    prop: "rateYear",
    align: "center",
    width: 120
  },
  {
    label: "详情描述",
    prop: "description",
    align: "center",
    width: 120
  },
  {
    label: "操作",
    prop: "action",
    align: "center",
    width: 200,
    minWidth: 200
  }
]

export const repaymentRules = {
  repaymentAmount: [
    {required: true, message: '请填写还款金额！', trigger: 'change'},
    { pattern: /^\d+(\.\d+)?$/g, message: '请填入数字', trigger: 'change'}
  ],
  repaymentDate: [
    {required: true, message: '请选择还款日期！', trigger: 'change'}
  ],
}

export const debitItems = [
  {
    label: "借款名称",
    prop: "loanName",
    type: "text",
    disabled: false,
    labelWidth: "120px",
    options: [], // type为select时，options为下拉框绑定值
  },
  {
    label: "借款金额",
    prop: "loanAmount",
    type: "text",
    disabled: false,
    labelWidth: "120px",
    options: [], // type为select时，options为下拉框绑定值
  },
  {
    label: "借款时间",
    prop: "loanStartDate",
    type: "date",
    disabled: false,
    labelWidth: "120px",
    options: [], // type为select时，options为下拉框绑定值
  },
  {
    label: "借款截止时间",
    prop: "loanEndDate",
    type: "date",
    disabled: false,
    labelWidth: "120px",
    options: [], // type为select时，options为下拉框绑定值
  },
  {
    label: "借款月利率",
    prop: "rateMonth",
    type: "text",
    disabled: false,
    labelWidth: "120px",
    options: [], // type为select时，options为下拉框绑定值
  },
  {
    label: "详情描述",
    prop: "description",
    type: "textarea",
    disabled: false,
    labelWidth: "120px",
    options: [], // type为select时，options为下拉框绑定值
  },
]

export const debitRules = {
  loanName: [
    {required: true, message: '请填写借款名称！', trigger: 'change'}
  ],
  loanAmount: [
    {required: true, message: '请填写借款金额！', trigger: 'change'},
    { pattern: /^\d+(\.\d+)?$/g, message: '请填入数字', trigger: 'change'}
  ],
  loanStartDate: [
    {required: true, message: '请选择借款日期！', trigger: 'change'}
  ],
  loanEndDate: [
    {required: true, message: '请选择借款截止日期！', trigger: 'change'}
  ],
  rateMonth: [
    {required: true, message: '请填写月利率！', trigger: 'change'},
    { pattern: /^\d+(\.\d+)?$/g, message: '请填入数字', trigger: 'change'}
  ],
  description: [
    {required: false, message: '请填写借款描述！', trigger: 'change'}
  ],
}

export const debitDefaultValue = {
  loanName: "",
  loanAmount: "",
  loanStartDate: "",
  loanEndDate: "",
  rateMonth: "",
  description: "",
}
