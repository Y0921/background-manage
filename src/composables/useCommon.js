import { ref, reactive, computed } from 'vue'
import { toast } from "./util.js";

//初始化列表分页和搜索功能,删除，修改状态
export function useInitTable(opt = {}) {
    let searchForm = null
    let resetSearchForm = null
    const tableData = ref([]);
    const loading = ref(false);
    //分页
    const currentPage = ref(1);
    const total = ref(0);
    const limit = ref(5);

    if (opt.searchForm) {
        searchForm = reactive({ ...opt.searchForm })
        resetSearchForm = () => {
            for (const key in opt.searchForm) {
                searchForm[key] = opt.searchForm[key];
            }
        }
        getData()
    }
    function getData(p=null) {
        //console.log(p)
        if (typeof p == "number") {
            currentPage.value = p;
          }
        //console.log(currentPage.value)
        loading.value = true;
        opt.getList(currentPage.value, searchForm)
            .then((res) => {
                if (opt.onGetListSuccess && typeof opt.onGetListSuccess == 'function') {
                    opt.onGetListSuccess(res)
                } else {
                    tableData.value = res.list
                    total.value = res.totalCount
                }
            })
            .finally(() => {
                loading.value = false;
            });
    }
    //删除
    function handleDelete(id) {
        loading.value = true;
        opt.delete(id).then((res) => {
            toast("删除成功");
            getData(1);
        })
            .finally(() => {
                loading.value = false;
            });
    }

    //修改状态
    const handleStatusChange = (status, row) => {
        row.statusLoading = true
        opt.updateStatus(row.id, status).then(() => {
            toast('修改状态成功！')
            row.status = status
        }).finally(() => {
            row.statusLoading = false;
        })
    }
    //getData();
    const multiTableRef=ref(null)
    //多选选中id
    const multiSelectionIds = ref([])
    const handleSelectionChange = (e) => {
        multiSelectionIds.value = e.map(o => o.id)
    }
    //批量删除的方法
    const handleMultiDelete = () => {
        loading.value = true
        opt.delete(multiSelectionIds.value).then(res => {
            toast('删除成功')
            //清空选中
            if (multiTableRef.value) {
                multiTableRef.value.clearSelection()
            }
            getData()
        }).finally(() => {
            loading.value = false
        })
    }
    //批量修改状态
    const handleMultiStatusChange = (status) => {
        loading.value = true
       // console.log(multiSelectionIds.value)
        opt.updateStatus(multiSelectionIds.value,status).then(res => {
            toast('修改状态成功')
            //清空选中
            if (multiTableRef.value) {
            
                multiTableRef.value.clearSelection()
               
            }
            getData()
        }).finally(() => {
            loading.value = false
        })
    }
    return {
        searchForm,
        resetSearchForm,
        tableData,
        loading,
        currentPage,
        total,
        limit,
        getData,
        handleDelete,
        handleStatusChange,
        multiTableRef,
        handleMultiDelete,
        handleSelectionChange,
        handleMultiStatusChange
    }
}
//新增，修改
export function useInitForm(opt = {}) {
    const EditId = ref(0);
    const DrawerTitle = computed(() => EditId.value ? "修改" : '新增')
    const FormDrawerRef = ref(null);
    const defaultForm = opt.form
    const formRef = ref(null);
    const form = reactive({
    })
    const rules = opt.rules || {}
    //修改
    function handleEdit(row) {
        EditId.value = row.id;
        resetForm(row);
        FormDrawerRef.value.open();
    }

    //提交表单
    function handleSubmit() {
        formRef.value.validate((valid) => {
            if (!valid) return;
            FormDrawerRef.value.showLoading();
            let body={}
            if(opt.beforeSubmit&&typeof opt.beforeSubmit=='function'){
                body=opt.beforeSubmit({...form})
                
            }else{
                body=form
            
            }
            const fun = EditId.value
                ? opt.update(EditId.value, body)
                : opt.create(body);
            fun.then(() => {
                toast(DrawerTitle.value + "成功");
                //修改刷新当前页，新增刷新第一页
                opt.getData(EditId.value ? false : 1);
                FormDrawerRef.value.close();
            })
                .finally(() => {
                    FormDrawerRef.value.hideLoading();
                });
        });
    }
    //重置表单
    const resetForm = (row = false) => {
        if (formRef.value) formRef.value.clearValidate();
        if (row) {
            for (const key in defaultForm) {
                form[key] = row[key];
            }
        }
    };
    //新增
    function handleCreate() {
        resetForm(defaultForm);
        FormDrawerRef.value.open();
    }


    return {
        DrawerTitle,
        FormDrawerRef,
        formRef,
        form,
        rules,
        EditId,
        handleCreate,
        handleEdit,
        handleSubmit,
        resetForm,
    }
}