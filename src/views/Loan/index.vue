<template>
    <el-table :data="data" default-expand-all width="100%">
        <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label"
            :align="column.align || 'left'" :width="column.width" :min-width="column.minWidth"
            :type="column.prop == 'expand' ? 'expand' : 'default'">
            <template #default="scope">
                <div v-if="column.prop == 'expand'">
                    <el-form ref="formRef" :model="scope.row">
                        <el-table :data="scope.row.list" style="width: 100%">
                            <el-table-column prop="repaymentAmount" label="还款金额">
                                <template #default="scopeSub">
                                    <el-form-item :prop="'list[' + scopeSub.$index + '].repaymentAmount'"
                                        :rules="repaymentRules.repaymentAmount">
                                        <el-input v-model="scopeSub.row.repaymentAmount"
                                            @input="(value:any) => handleChange(value, scope.$index, scopeSub.$index, scopeSub.row, 'repaymentAmount')"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="repaymentDate" label="还款时间">
                                <template #default="scopeSub">
                                    <el-form-item :prop="'list[' + scopeSub.$index + '].repaymentDate'"
                                        :rules="repaymentRules.repaymentDate">
                                        <el-date-picker v-model="scopeSub.row.repaymentDate" type="date" placeholder="请选择日期"
                                            :size="size"
                                            @change="(value:any) => handleChange(value, scope.$index, scopeSub.$index, scopeSub.row, 'repaymentDate')"
                                            value-format="YYYY-MM-DD" />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="interest" label="利息"></el-table-column>
                            <el-table-column prop="outstandingInterest" label="剩余利息"></el-table-column>
                            <el-table-column prop="outstandingAmount" label="剩余本金"></el-table-column>
                            <el-table-column prop="total" label="剩余本息合计"></el-table-column>
                        </el-table>
                    </el-form>
                </div>
                <div v-else-if="column.prop == 'index'">
                    {{ scope.$index + 1 }}
                </div>
                <div v-else-if="column.prop == 'action'">
                    <el-button size="small" @click="handleDebitEdit(scope.$index, scope.row)">
                        编辑
                    </el-button>
                    <el-button size="small" type="danger" @click="handleDebitDelete(scope.$index, scope.row)">
                        删除
                    </el-button>
                </div>
                <div v-else>{{ scope.row[column.prop] }}</div>
            </template>
        </el-table-column>
    </el-table>
    <div class="debit-btns">
        <el-button type="primary" @click="handleDebitAdd">添加贷款</el-button>
    </div>
    <ModelForm class="tes" @update:visible="handleFormVisible" @update:submit="handleFormSubmit" :modelForm="modelForm" />
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import ModelForm from "@/components/ModelForm.vue";
import { columns, debitItems, debitRules, debitDefaultValue, repaymentRules } from "./formData";

let formRef = ref();
const size = ref("default");
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

const handleFormVisible = (val: unknown) => {
    modelForm.value.visible = val;
}

const handleFormSubmit = (val: any) => {
    console.log("---val--", val);
    // 添加贷款
    if (action.value.name == "debit" && action.value.type == "add") {
        let debitOption = Object.assign({}, val, { rateYear: (val.rateMonth * 12).toFixed(2), list: [
            {
                repaymentAmount: "",
                repaymentDate: "",
                interest: "",
                outstandingInterest: "",
                outstandingAmount: "",
                total: ""
            }
        ] });
        console.log("--debitOption--", debitOption);
        data.push(debitOption);
        data = data.sort((a: any, b: any) => new Date(a.loanDate).getTime() - new Date(b.loanDate).getTime());
    }
    // 编辑贷款
    if (action.value.name == "debit" && action.value.type == "edit") {
        let debitOption = Object.assign({}, val, { rateYear: (val.rateMonth * 12).toFixed(2) });
        data[action.value.index] = debitOption;
    }

    modelForm.value.visible = false;
}

const handleDebitDelete = (index: number, row: unknown) => {
    console.log(index, row)
    data.splice(index, 1);
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
    if (monthsDiff < 0) {
        yearsDiff -= 1;
        monthsDiff += 12;
    }
    // 计算日差
    let daysDiff = endDay - startDay;
    if (daysDiff < 0) {
        monthsDiff -= 1;
        daysDiff += 30;
    }

    let totalDays = yearsDiff * 360 + monthsDiff * 30 + daysDiff;

    return totalDays
}

const updateRate = (rowNo:number, colNo:number) => {
  console.log("rowIndex::", rowNo, colNo);
  data[rowNo].list.forEach((item:any, index:number)=>{
    if(index == colNo){
      if(index == 0) {
        item.interest = (data[rowNo].loanAmount * item.days * data[rowNo].rateYear / 360 / 100).toFixed(2);
        if(item.repaymentAmount - item.interest > 0){
          item.outstandingInterest = 0;
          let remainP = data[rowNo].loanAmount - (item.repaymentAmount -item.interest);
          item.outstandingAmount = remainP;
        }else{
          item.outstandingInterest = (item.interest - item.repaymentAmount).toFixed(2);
          item.outstandingAmount = data[rowNo].loanAmount;
        }
        item.total = item.outstandingInterest * 1 + item.outstandingAmount * 1;
      }else{
        item.interest = (data[rowNo].list[colNo - 1].outstandingInterest * 1 + data[rowNo].list[colNo - 1].outstandingAmount * item.days * data[rowNo].rateYear / 360 /100).toFixed(2);
        if(item.repaymentAmount){
          if(item.repaymentAmount - item.interest > 0){
            item.outstandingInterest = 0;
            let remainP = data[rowNo].list[colNo - 1].outstandingAmount - (item.repaymentAmount - item.interest);
            item.outstandingAmount = remainP;
          }else{
            item.outstandingInterest = (item.interest - item.repaymentAmount).toFixed(2);
            item.outstandingAmount = data[rowNo].list[colNo - 1].outstandingAmount
          }
          item.total = item.outstandingInterest * 1 + item.outstandingAmount * 1;
        }
      }
      if(item.total > 0 && !data[rowNo][colNo + 1]){
        handleAdd(rowNo);
      }
      if(colNo != 0 && item.total == 0){
        handleDelete(colNo+1, rowNo);
      }
    }
  })
}

const handleAdd = (rowNo: number) => {
    data[rowNo].list.push({        
        repaymentAmount: "",
        repaymentDate: "",
        interest: "",
        outstandingInterest: "",
        outstandingAmount: "",
        total: ""
    })
}

const handleDelete = (index:number, rowNo:number) => {
  data[rowNo].list.splice(index);
}

const handleChange = (value:any, rowNo:number, colNo:number, row:any, prop:string) => {
    console.log("---val---", value, rowNo, colNo, row, prop);
    if(row.repaymentDate){
        if(colNo == 0){
            data[rowNo].list[colNo].days = days_between(data[rowNo].loanStartDate, row.repaymentDate);
        }else{
            data[rowNo].list[colNo].days = days_between(data[rowNo].list[colNo-1].repaymentDate, row.repaymentDate);
        }
    }
    if(row.repaymentAmount && row.repaymentDate){
        updateRate(rowNo, colNo);
    }
}

const disabledDate = (time:Date, rowIndex:number) => {
  /* if(rowIndex == 0) {
    if(form.tableData[rowIndex].start){
      return time.getTime() > new Date(form.tableData[rowIndex].start).getTime() ? false : true;
    }
  }
  if(rowIndex > 0){
    return time.getTime() > new Date(form.tableData[rowIndex-1].end).getTime() ? false : true;
  } */
}

</script>
<style scoped>
.debit-btns {
    margin-top: 20px;
    text-align: center;
}
</style>