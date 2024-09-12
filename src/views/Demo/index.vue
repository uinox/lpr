<template>
  <el-table :data="data" default-expand-all width="100%">
    <el-table-column
      v-for="(column, index) in columns"
      :key="index"
      :prop="column.prop"
      :label="column.label"
      :align="column.align || 'left'"
      :width="column.width"
      :min-width="column.minWidth"
      :type="column.prop == 'expand' ? 'expand' : 'default'"
    >
      <template #default="scope">
        <div v-if="column.prop == 'expand'">
          <el-table :data="scope.row.list" style="width: 90%;margin: 0 auto;">
            <el-table-column
              v-for="(item, idx) in column.list"
              :key="idx"
              :prop="item.prop"
              :label="item.label"
              :align="item.align || 'left'"
              :width="item.width"
            >
            </el-table-column>
          </el-table>
        </div>
        <div v-else-if="column.prop == 'index'">
          {{ scope.$index + 1 }}
        </div>
        <div v-else-if="column.prop == 'action'">
          <el-button size="small" @click="handleDebitEdit(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDebitDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>     
        </div>
        <div v-else>{{ scope.row[column.prop] }}</div>
      </template>
    </el-table-column>
  </el-table>
  <div class="debit-btns">
    <el-button type="primary" @click="handleDebitAdd">添加贷款</el-button>
    <el-button type="primary" :disabled="data.length < 1 ? true : false" @click="handleRepaymentAdd">添加还款</el-button>
  </div>
  <ModelForm
    class="tes"
    @update:visible="handleFormVisible"
    @update:submit="handleFormSubmit"
    :modelForm="modelForm"
  />
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import ModelForm from "@/components/ModelForm.vue";
import { columns, debitItems, debitRules, debitDefaultValue, repaymentItems, repaymentRules, repaymentDefaultValue } from "./formData";

let data = reactive<any>([]);

let modelForm = ref<any>({
  title: "测试",
  visible: false,
  width: 500,
  items: [],
  defaultValue: {},
  rules: {}
})

const action = ref({
  name: "",
  type: "",
  index: 0,
});

const handleFormVisible = (val:unknown) => {
  modelForm.value.visible = val;
}

const handleFormSubmit = (val:any) => {
  console.log("---val--", val);
  // 添加贷款
  if(action.value.name == "debit" && action.value.type == "add"){
    let debitOption = Object.assign({}, val, {rateYear: (val.rateMonth * 12).toFixed(2),list: []});
    console.log("--debitOption--", debitOption);
    data.push(debitOption);
    data = data.sort((a: any, b: any) => new Date(a.loanDate).getTime() - new Date(b.loanDate).getTime());
  }
  // 编辑贷款
  if(action.value.name == "debit" && action.value.type == "edit"){
    let debitOption = Object.assign({}, val, {rateYear: (val.rateMonth * 12).toFixed(2)});
    data[action.value.index] = debitOption;
  }
  // 添加还款
  if(action.value.name == "repayment" && action.value.type == "add"){
    // 查找需要还款的贷款
    let rowIndex = findRowIndex(data, 0);
    console.log("--repayment--", rowIndex)
    if(rowIndex > -1){
      updateRate(rowIndex, val);
    }
  }
  modelForm.value.visible = false;
}

const findRowIndex = (data: any, startIndex: number) => {
  let rowIndex = -1;
  for (let index = startIndex; index < data.length; index++) {
    let list = data[index].list;
    if(list.length > 0){
        if(list[list.length - 1].total > 0 ){
            rowIndex = index;
            break;
        }
    } else {
        rowIndex = index;
        break;
    }
  }
  return rowIndex;
}

const updateRate = (index: number, val: any) => {

  let outstandingTotal: number = 0;

  if(data[index].list.length == 0){
    let days = days_between(data[index].loanDate, val.repaymentDate);
    let interest = Number((data[index].loanAmount * days * data[index].rateYear / 360 / 100).toFixed(2));
    let outstandingInterest: number;
    let outstandingAmount: number;
    let total;
    if(val.repaymentAmount - interest > 0) {
      outstandingInterest = 0;
      outstandingAmount = Number((Number(data[index].loanAmount) - (Number(val.repaymentAmount) - interest)).toFixed(2));
    } else {
      outstandingInterest = interest - Number(val.repaymentAmount);
      outstandingAmount = Number(Number(data[index].loanAmount).toFixed(2));
    }
    total = Number((outstandingInterest + outstandingAmount).toFixed(2));
    console.log("---total--", total)
    if(total < 0) {
      console.log("---total-1-", total)
      // total = 0;
      outstandingTotal = 0 - total;
    }
    let loadOption = Object.assign({}, val, {interest, outstandingInterest, outstandingAmount, total});
    data[index].list.push(loadOption);
  }else{
    let prev = data[index].list[data[index].list.length-1];
    let days = days_between(prev.repaymentDate, val.repaymentDate);
    let interest: number = Number((prev.outstandingInterest + prev.outstandingAmount * days * data[index].rateYear / 360 / 100).toFixed(2));
    console.log("---interest--",interest);
    let outstandingInterest: number;
    let outstandingAmount: number;
    let total;
    if(val.repaymentAmount - interest > 0){
      outstandingInterest = 0;
      outstandingAmount = Number((Number(prev.outstandingAmount) - (Number(val.repaymentAmount) - interest)).toFixed(2));
    }else{
      outstandingInterest = Number((interest - Number(val.repaymentAmount)).toFixed(2));
      outstandingAmount = Number(prev.outstandingAmount.toFixed(2));
    }
    total = Number((outstandingInterest + outstandingAmount).toFixed(2));
    console.log("---total--", total)
    if(total < 0) {
      console.log("---total-1-", total)
      // total = 0;
      outstandingTotal = 0 - total;
    }
    let loadOption = Object.assign({}, val, {interest, outstandingInterest, outstandingAmount, total});
    data[index].list.push(loadOption);
  }

  console.log("--outstandingTotal--", outstandingTotal)
  if( outstandingTotal > 0 ){
    // 查找需要还款的贷款
    let rowIndex = findRowIndex(data, index+1);
    if(rowIndex > -1){
      let params = {
        repaymentAmount: outstandingTotal,
        repaymentDate: val.repaymentDate
      }
      updateRate(rowIndex, params);
    };
  }
}

const handleDebitDelete = (index: number, row: unknown) => {
  console.log(index, row)
  data.splice(index,1);
}

const handleDebitEdit = (index: number, row: unknown) => {
  action.value.name = "debit";
  action.value.type = "edit";
  action.value.index = index;
  modelForm.value.title = "编辑借款";
  modelForm.value.items = debitItems;
  modelForm.value.rules = debitRules;
  modelForm.value.defaultValue = data[index];
  modelForm.value.visible = true;
  console.log("--modelForm--", modelForm);
  console.log(index, row)
}

const handleDebitAdd = () => {
  action.value.name = "debit";
  action.value.type = "add";
  modelForm.value.title = "添加借款";
  modelForm.value.items = debitItems;
  modelForm.value.rules = debitRules;
  modelForm.value.defaultValue = debitDefaultValue;
  modelForm.value.visible = true;
  console.log("--modelForm--", modelForm);
}

const handleRepaymentAdd = () => {
  action.value.name = "repayment";
  action.value.type = "add";
  modelForm.value.title = "添加还款";
  modelForm.value.items = repaymentItems;
  modelForm.value.rules = repaymentRules;
  modelForm.value.defaultValue = repaymentDefaultValue;
  modelForm.value.visible = true;
  console.log("--modelForm--", modelForm);
}

const days_between = (start: string, end: string) => {
  const startYear = new Date(start).getFullYear();
  const startMonth = new Date(start).getMonth() + 1; // 月份从0开始，所以要加1
  const startDay = new Date(start).getDate();
  const endYear = new Date(end).getFullYear();
  const endMonth = new Date(end).getMonth() + 1; // 月份从0开始，所以要加1
  const endDay = new Date(end).getDate();

  // 计算年差
  let yearsDiff = endYear - startYear;
  // 计算月差
  let monthsDiff = endMonth - startMonth;
  if(monthsDiff < 0) {
    yearsDiff -= 1;
    monthsDiff += 12;
  }
  // 计算日差
  let daysDiff = endDay - startDay;
  if(daysDiff < 0){
    monthsDiff -= 1;
    daysDiff += 30;
  }

  let totalDays = yearsDiff * 360 + monthsDiff * 30 + daysDiff;
  
  return totalDays
}

</script>
<style scoped>
.debit-btns {
  margin-top: 20px;
  text-align: center;
}
</style>