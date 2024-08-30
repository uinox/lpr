<template>
  <el-table :data="list" default-expand-all>
    <el-table-column type="expand">
      <template #default="props">
        <Rate/>
      </template>
    </el-table-column>
    <el-table-column label="借贷名称" prop="name" />
    <el-table-column label="借贷描述" prop="descript" />
    <el-table-column align="right">
      <template #default="scope">
        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">
          编辑
        </el-button>
        <el-button :disabled="scope.$index == 0 ? true : false" size="small" type="danger" @click="handleDelete(scope.$index)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="text-align: center;margin-top: 20px;">
    <el-button type="primary" size="default" @click="handleAdd"> 添加 </el-button>
  </div>
  <el-dialog v-model="debtVisible" title="Warning" width="500" center>
    <el-form
      ref="formRef"
      style="max-width: 600px"
      :model="formData"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item label="借贷名称：" prop="name"
        :rules="[{ required: true, message: '请填写借贷名称！' },]"
      >
        <el-input v-model="formData.name" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="借贷描述：" prop="descript">
        <el-input v-model="formData.descript" type="text" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="resetForm(formRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
 
<script setup>
import Rate from "/src/components/Rate.vue";
import { ref, reactive } from 'vue';

const type = ref();
const rowIndex = ref();
const debtVisible = ref(false);
const formRef = ref();
const formData = reactive({
  name: "",
  descript: "",
});
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if(type.value == "add"){
        list.push({name: formData.name, descript: formData.descript});
      } else {
        list[rowIndex.value] = { name: formData.name, descript: formData.descript };
      }
    } else {
      console.log('error submit!')
    }
  })
  debtVisible.value = false;
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  debtVisible.value = false;
}

const list = reactive([
  {
    name: "借贷1",
    descript: "不固定还款期限",
  }
])
const handleAdd = () => {
  type.value = "add";
  formData.name = "";
  formData.descript = "";
  debtVisible.value = true;
}
const handleEdit = (index, row) => {
  type.value = "edit";
  rowIndex.value = index;
  formData.name = row.name;
  formData.descript = row.descript;
  debtVisible.value = true;
}
const handleDelete = (index) => {
  list.splice(index,1);
}



</script>