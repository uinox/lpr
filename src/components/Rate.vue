<template>
    <el-form ref="formRef" :model="form">
      <el-table :data="form.tableData" style="width: 100%">
        <el-table-column prop="principal" label="借款金额">
          <template #default="scope">
            <el-form-item v-if="scope.$index == 0" :prop="'tableData['+scope.$index+'].principal'" :rules="ruleForm.principal">
              <el-input v-model="scope.row.principal"></el-input>
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
                placeholder="Pick a day"
                :size="size"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <span v-else>{{ scope.row.start }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pay" label="还款金额">
          <template #default="scope">
            <el-form-item :prop="'tableData['+scope.$index+'].pay'" :rules="ruleForm.pay">
              <el-input v-model="scope.row.pay"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="end" label="还款/截止日">
          <template #default="scope">
            <el-form-item :prop="'tableData['+scope.$index+'].end'" :rules="ruleForm.end">
              <el-date-picker
                v-model="scope.row.end"
                type="date"
                placeholder="Pick a day"
                :size="size"
                value-format="YYYY-MM-DD"
                :disabled-date="disabledDate"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="days" label="借款期限"></el-table-column>
        <el-table-column prop="rateMonth" label="月利率">
          <template #default="scope">
              <el-form-item v-if="scope.$index == 0" :prop="'tableData['+scope.$index+'].rateMonth'" :rules="ruleForm.rateMonth">
                <el-input v-model="scope.row.rateMonth"></el-input>
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
  
  const tableIndex = ref(-1);
  
  watch(
    () => form.tableData.map((item, index) => {
      return item.principal;
    }), 
    (newVal, oldVal) => {
      if(newVal !== oldVal){
        if(newVal && oldVal){
          newVal.forEach((item,index)=>{
            if(item != oldVal[index]){
              tableIndex.value = index;
            }
          });
        }
        form.tableData.forEach((item, index) => {
          if(index == tableIndex.value ) {
            if(tableIndex.value == 0){
              if(item.principal && item.start && item.pay && item.end && item.rateMonth){
                updateRate();
              }
            }else{
              if(item.pay && item.end && item.rateMonth){
                updateRate();
              }
            }
          }
        })
      }
    },
    { deep: true, immediate: true }
  )
  
  watch(
    () => form.tableData.map((item, index) => {
      return item.start
    }), 
    (newVal, oldVal) => {
      if(newVal !== oldVal){
        if(newVal && oldVal){
          newVal.forEach((item,index)=>{
            if(item != oldVal[index]){
              tableIndex.value = index;
            }
          });
        }
        form.tableData.forEach((item, index) => {
          if(index == tableIndex.value ) {
            if(item.start && item.end){
              item.days = days_between(item.start, item.end);
            }
            if(tableIndex.value == 0){
              if(item.principal && item.start && item.pay && item.end && item.rateMonth){
                updateRate();
              }
            }else{
              if(item.pay && item.end && item.rateMonth){
                updateRate();
              }
            }
          }
        })
      }
    },
    { deep: true, immediate: true }
  )
  
  watch(
    () => form.tableData.map((item, index) => {
      return item.pay
    }), 
    (newVal, oldVal) => {
      if(newVal !== oldVal){
        if(newVal && oldVal){
          newVal.forEach((item,index)=>{
            if(item != oldVal[index]){
              tableIndex.value = index;
            }
          });
        }
        form.tableData.forEach((item, index) => {
          if(index == tableIndex.value ) {
            if(tableIndex.value == 0){
              if(item.principal && item.start && item.pay && item.end && item.rateMonth){
                updateRate();
              }
            }else{
              if(item.pay && item.end && item.rateMonth){
                updateRate();
              }
            }
          }
        })
      }
    },
    { deep: true, immediate: true }
  )
  
  watch(
    () => form.tableData.map((item, index) => {
      return item.end
    }), 
    (newVal, oldVal) => {
      if(newVal !== oldVal){
        if(newVal && oldVal){
          newVal.forEach((item,index)=>{
            if(item != oldVal[index]){
              tableIndex.value = index;
            }
          });
        }
        form.tableData.forEach((item, index) => {
          if(index == tableIndex.value ) {
            if(item.start && item.end){
              item.days = days_between(item.start, item.end);
            }
            if(tableIndex.value == 0){
              if(item.principal && item.start && item.pay && item.end && item.rateMonth){
                updateRate();
              }
            }else{
              if((item.pay && item.end) || item.end){
                updateRate();
              }
            }
          }
        })
      }
    },
    { deep: true, immediate: true }
  )
  
  watch(
    () => form.tableData.map((item, index) => {
      return item.rateMonth
    }), 
    (newVal, oldVal) => {
      if(newVal !== oldVal){
        if(newVal && oldVal){
          newVal.forEach((item,index)=>{
            if(item != oldVal[index]){
              tableIndex.value = index;
            }
          });
        }
        form.tableData.forEach((item, index) => {
          if(index == tableIndex.value ) {
            if(item.rateMonth){
              item.rateYear = (item.rateMonth * 12).toFixed(2)
            }
            if(tableIndex.value == 0){
              if(item.principal && item.start && item.pay && item.end && item.rateMonth){
                updateRate();
              }
            }else{
              if(item.pay && item.end && item.rateMonth){
                updateRate();
              }
            }
          }
        })
      }
    },
    { deep: true, immediate: true }
  )
  
  const updateRate = () => {
    console.log("updateRateIndex::", tableIndex.value);
    form.tableData.forEach((item, index)=>{
      if(index == tableIndex.value){
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
          item.interest = (form.tableData[tableIndex.value - 1].remainingInterest * 1 + form.tableData[tableIndex.value - 1].remainingPrincipal * item.days * item.rateYear / 360 /100).toFixed(2);
          if(item.pay){
            if(item.pay - item.interest > 0){
              item.remainingInterest = 0;
              let remainP = form.tableData[tableIndex.value - 1].remainingPrincipal - (item.pay - item.interest);
              item.remainingPrincipal = remainP > 0 ? remainP : 0;
            }else{
              item.remainingInterest = (item.interest - item.pay).toFixed(2);
              item.remainingPrincipal = form.tableData[tableIndex.value - 1].remainingPrincipal
            }
            item.remainTotal = item.remainingInterest * 1 + item.remainingPrincipal * 1;
          }
        }
        if(item.remainTotal > 0 && !form.tableData[tableIndex.value + 1]){
          handleAdd(formRef.value);
        }
        if(tableIndex.value != 0 && item.pay && item.end && item.remainTotal == 0){
          handleDelete(tableIndex.value+1);
        }
      }
    })
  }
  const disabledDate = (time) => {
    if(tableIndex.value == 0) {
      if(form.tableData[tableIndex.value].start){
        return time.getTime() > new Date(form.tableData[tableIndex.value].start).getTime() ? false : true;
      }
    }
    if(tableIndex.value > 0){
      return time.getTime() > new Date(form.tableData[tableIndex.value-1].end).getTime() ? false : true;
    }
  }
  </script>
  <style scoped>
  .el-form-item{ margin-top: 18px; }
  </style>