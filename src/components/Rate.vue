<template>
  <el-form ref="formRef" :model="form">
    <el-table :data="form.tableData" style="width: 100%">
      <el-table-column prop="principal" label="借款金额">
        <template #default="scope">
          <el-form-item v-if="scope.$index == 0" :prop="'tableData['+scope.$index+'].principal'" :rules="ruleForm.principal">
            <el-input v-model="scope.row.principal" @input="(value) => handleChange(value, scope.$index, scope.row, 'principal')"></el-input>
          </el-form-item>
          <span v-else>{{ scope.row.principal }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="start" label="开始日">
        <template #default="scope">
          <el-form-item v-if="scope.$index == 0" :prop="'tableData['+scope.$index+'].start'" :rules="ruleForm.start">
            <el-date-picker
              v-model="scope.row.start"
              type="date"
              placeholder="请选择日期"
              :size="size"
              @change="(value) => handleChange(value, scope.$index, scope.row, 'start')"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <span v-else>{{ scope.row.start }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pay" label="还款金额">
        <template #default="scope">
          <el-form-item :prop="'tableData['+scope.$index+'].pay'" :rules="ruleForm.pay">
            <el-input v-model="scope.row.pay" @input="(value) => handleChange(value, scope.$index, scope.row, 'pay')"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="end" label="还款/截止日">
        <template #default="scope">
          <el-form-item :prop="'tableData['+scope.$index+'].end'" :rules="ruleForm.end">
            <el-date-picker
              v-model="scope.row.end"
              type="date"
              placeholder="请选择日期"
              :size="size"
              value-format="YYYY-MM-DD"
              :disabled-date="(value) => disabledDate(value, scope.$index)"
              @change="(value) => handleChange(value, scope.$index, scope.row, 'end')"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="days" label="借款期限"></el-table-column>
      <el-table-column prop="rateMonth" label="月利率">
        <template #default="scope">
            <el-form-item v-if="scope.$index == 0" :prop="'tableData['+scope.$index+'].rateMonth'" :rules="ruleForm.rateMonth">
              <el-input v-model="scope.row.rateMonth" @input="(value) => handleChange(value, scope.$index, scope.row, 'rateMonth')"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.rateMonth }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rateYear" label="年利率"></el-table-column>
      <el-table-column prop="interest" label="利息"></el-table-column>
      <el-table-column prop="remainingInterest" label="待还利息"></el-table-column>
      <el-table-column prop="remainingPrincipal" label="待还本金"></el-table-column>
      <el-table-column prop="remainTotal" label="待还本息合计"></el-table-column>
    </el-table>
  </el-form>
</template>
  
<script setup>
import { ref, watch, reactive } from 'vue';

const formRef = ref()

const ruleForm = reactive({
  principal: [ { required: true, message: "请输入", trigger: "blur" }],
  start: [{ required: true, message: "请输入", trigger: "blur" }],
  pay: [{ required: true, message: "请输入", trigger: "blur" }],
  end: [{ required: true, message: "请输入", trigger: "blur" }],
  rateMonth: [{ required: true, message: "请输入", trigger: "blur" }]
})

const size = ref("default");

const form = reactive({
  tableData: [
    { 
      principal: '',
      start: '', 
      pay: '',
      end: '',
      days: '',
      rateMonth: '',
      rateYear: '',
      interest: '',
      remainingInterest: '',
      remainingPrincipal: '',
      remainTotal: '',
    }
  ]
})

const handleAdd = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      form.tableData.push({
        principal: '',
        start: '', 
        pay: '',
        end: '',
        days: '',
        rateMonth: form.tableData[form.tableData.length-1].rateMonth,
        rateYear: '',
        interest: '',
        remainingInterest: '',
        remainingPrincipal: '',
        remainTotal: '',
      })
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const handleDelete = (index) => {
  form.tableData.splice(index)
}

const days_between = (start, end) => {
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

const updateRate = (rowIndex) => {
  console.log("rowIndex::", rowIndex);
  form.tableData.forEach((item, index)=>{
    if(index == rowIndex){
      if(index == 0) {
        item.interest = (item.principal * item.days * item.rateYear / 360 / 100).toFixed(2);
        if(item.pay - item.interest > 0){
          item.remainingInterest = 0;
          let remainP = item.principal - (item.pay -item.interest);
          item.remainingPrincipal = remainP > 0 ? remainP : 0;
        }else{
          item.remainingInterest = (item.interest - item.pay).toFixed(2);
          item.remainingPrincipal = item.principal;
        }
        item.remainTotal = item.remainingInterest * 1 + item.remainingPrincipal * 1;
      }else{
        item.interest = (form.tableData[rowIndex - 1].remainingInterest * 1 + form.tableData[rowIndex - 1].remainingPrincipal * item.days * item.rateYear / 360 /100).toFixed(2);
        if(item.pay){
          if(item.pay - item.interest > 0){
            item.remainingInterest = 0;
            let remainP = form.tableData[rowIndex - 1].remainingPrincipal - (item.pay - item.interest);
            item.remainingPrincipal = remainP > 0 ? remainP : 0;
          }else{
            item.remainingInterest = (item.interest - item.pay).toFixed(2);
            item.remainingPrincipal = form.tableData[rowIndex - 1].remainingPrincipal
          }
          item.remainTotal = item.remainingInterest * 1 + item.remainingPrincipal * 1;
        }
      }
      if(item.remainTotal > 0 && !form.tableData[rowIndex + 1]){
        handleAdd(formRef.value);
      }
      if(rowIndex != 0 && item.pay && item.end && item.remainTotal == 0){
        handleDelete(rowIndex+1);
      }
    }
  })
}
const disabledDate = (time, rowIndex) => {
  if(rowIndex == 0) {
    if(form.tableData[rowIndex].start){
      return time.getTime() > new Date(form.tableData[rowIndex].start).getTime() ? false : true;
    }
  }
  if(rowIndex > 0){
    return time.getTime() > new Date(form.tableData[rowIndex-1].end).getTime() ? false : true;
  }
}

const handleChange = (value, rowIndex, row, prop) => {
  console.log("---val---", value, rowIndex, row, prop);
  if(prop == "rateMonth" && row.rateMonth != ""){
    form.tableData[rowIndex].rateYear = (row.rateMonth * 12).toFixed(2)
  }
  if(row.start && row.end){
    form.tableData[rowIndex].days = days_between(row.start, row.end);
  }
  if(rowIndex == 0){
    if(row.principal && row.start && row.pay && row.end && row.rateMonth){
      updateRate(rowIndex);
    }
  } else {
    if(row.pay && row.end && row.rateMonth){
      updateRate(rowIndex);
    }
  }
}
</script>
<style scoped>
.el-form-item{ margin-top: 18px; }
</style>