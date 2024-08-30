<template>
    <el-dialog
        :model-value="modelForm.visible"
        :title="modelForm.title"
        :width="modelForm.width"
        destroy-on-close
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="handleClose(formRef)"
    >
        <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            width="80%"
        >
            <el-form-item
                v-for="(item, index) of modelForm.items"
                :key="index"
                :label="item.label + '：'"
                :prop="item.prop"
                :rules="rules[item.prop]"
                :label-width="item.labelWidth"
            >
                <!-- type类型包含 text, textarea, password, number, date, select -->
                <el-input
                    v-if="item.type == 'text'"
                    v-model="formData[modelForm.items[index].prop]"
                    clearable
                    :placeholder="'请输入' + item.label"
                    :disabled="'disabled' in item ? item.disabled : false"
                ></el-input>
                <el-input
                    v-else-if="item.type == 'textarea'"
                    v-model="formData[modelForm.items[index].prop]"
                    clearable
                    :placeholder="'请输入' + item.label"
                    type="textarea"
                    :disabled="'disabled' in item ? item.disabled : false"
                ></el-input>
                <el-input
                    v-else-if="item.type == 'number'"
                    v-model.number="formData[modelForm.items[index].prop]"
                    clearable
                    :placeholder="'请输入' + item.label"
                    type="text"
                    :disabled="'disabled' in item ? item.disabled : false"
                ></el-input>
                <el-input
                    v-else-if="item.type == 'password'"
                    v-model="formData[modelForm.items[index].prop]"
                    clearable
                    :placeholder="'请输入' + item.label"
                    type="password"
                    :disabled="'disabled' in item ? item.disabled : false"
                ></el-input>
                <el-select
                    v-else-if="item.type == 'select'"
                    v-model="formData[modelForm.items[index].prop]"
                    :placeholder="'请输入' + item.label"
                    filterable
                    :disabled="'disabled' in item ? item.disabled : false"
                >
                    <el-option
                        v-for="(opt,index) in item.options"
                        :key="index"
                        :label="opt.label"
                        :value="opt.value"
                    ></el-option>
                </el-select>
                <el-date-picker
                    v-else-if="item.type == 'date'"
                    v-model="formData[modelForm.items[index].prop]"
                    type="date"
                    :placeholder="'请选择' + item.label"
                    value-format="YYYY-MM-DD"
                    :disabled="'disabled' in item ? item.disabled : false"
                />
            </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="handleClose(formRef)">取消</el-button>
            <el-button type="primary" @click="handleSubmit(formRef)"> 确定</el-button>
        </div>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus';
import { ref, watch } from 'vue';

const props = defineProps({
    // 表单数据存储对象
    modelForm: {
        type: Object,
        default() {
            return {}
        }
    },
})

const formRef = ref<FormInstance>();

const formData = ref(props.modelForm.defaultValue);
const rules = ref(props.modelForm.rules)

const emit = defineEmits(['update:visible', 'update:submit']);

function handleClose(formEl: FormInstance | undefined) {
    if (!formEl) return;
    emit('update:visible', false);
    formEl.resetFields();
}

const handleSubmit = (formEl: FormInstance | undefined) => {
    if(!formEl) return;
    formEl.validate((valid) => {
        if(valid){
            console.log("values: ", formData.value);
            emit('update:submit', formData.value);
        }else{
            console.log("error submit")
        }

    })
}

watch(
    () => props.modelForm.defaultValue,
    (newVal, oldVal) => {
        if(newVal !== oldVal){
            formData.value = props.modelForm.defaultValue;
        }
    },
    { deep: true, immediate: true }
)

watch(
    () => props.modelForm.rules,
    (newVal, oldVal) => {
        if(newVal !== oldVal){
            rules.value = props.modelForm.rules;
        }
    },
    { deep: true, immediate: true }
)

</script>
<style scoped>
.dialog-footer{
    text-align: center;
}
</style>