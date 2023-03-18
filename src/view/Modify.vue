<template>
    <el-row>
        <el-button type="primary" @click="mySet" style="margin-top: 50px; margin-left: 1200px">返回上一页</el-button>
        <el-button type="primary" @click="goBack" style="margin-top: 50px">返回主页</el-button>
    </el-row>
    <el-row>
        <el-col :span="4" style="margin-left: 100px">
            <h1>附件</h1>
            <el-menu
            class="el-menu-vertical-demo">
                <el-menu-item v-for="(i, index) in attachments" :key="index" :index="index" @click="exchange">
                    {{ i }}
                </el-menu-item>
            </el-menu>
        </el-col>
            <!-- <div ref="pdfViewer">
                <el-spinner v-if="!pdfInstance"></el-spinner>
                <canvas v-for="pageNumber in totalPages" :key="pageNumber" :data-page-number="pageNumber"></canvas>
            </div> -->
        <el-col :span="12">
        </el-col>
        <el-col :span="4">
            <el-form :model="form">
                <h3>当前批改题号</h3>
                <el-form-item>
                    <el-select v-model="form.question_count" placeholder="请选择题号">
                        <el-option v-for="i, index in counts" :key="index" :value="i">{{ i }}</el-option>
                    </el-select>
                </el-form-item>
                <h3>本题得分</h3>
                <el-form-item>
                    <el-input v-model="form.score" placeholder="请赋分"/>
                </el-form-item>
                <h3>批改信息(可选)</h3>
                <el-form-item>
                    <el-input v-model="form.msg" placeholder="批注反馈"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="onSubmit">提交</el-button>
                    <el-button @click="clear">取消</el-button>
            </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
    import { reactive, ref, onMounted } from 'vue';
    import router from '@/router';
    import pdfjsLib from 'pdfjs-dist';
    import { ElLoading } from 'element-plus';
    
    let attachments = reactive(['附件1', '附件2', '附件3'])
    let counts = reactive(['1', '2', '3', '4'])
    let form = reactive({
        question_count: '',
        score: '',
        msg: ''
    })
    const onSubmit = () => {
        if (form.question_count !== '' && form.score !== '') {
            for (let i = 0; i < counts.length; i++) 
                if (counts[i] === form.question_count && form.question_count.length < 3) {
                    counts[i] = form.question_count + "(已批改)"
                    alert("批改成功")
                    clear()
                    break
                }
        }
        else {
            alert("您未选择题号或未赋分")
        }
        
    }
    const clear = () => {
        form.question_count = '',
        form.score = '',
        form.msg = ''
    }
    const exchange = (index: number) => {
        if (index === 0)
            path.value = '../assets/pdfs/Assignment 1_2023.pdf'
        else if (index === 1)
            path.value = '../assets/pdfs/Lesson_1.pdf'
        else if (index === 2)
            path.value = '../assets/pdfs/Lesson_2.pdf'
    }
    const goBack = () => {
        router.push('/Main')
    }
    const mySet = () => {
        router.push('/Main/Homework')
    }

    let path = ref('')
    path.value = '../assets/pdfs/Assignment 1_2023.pdf'

    // const pdfViewer = ref<HTMLElement | null>(null);
    // const loadingInstance = ref<ElLoading | null>(null);
    // const pdfInstance = ref<pdfjsLib.PDFDocumentProxy | null>(null);
    // const currentPage = ref(1);
    // const totalPages = ref(0);

    // const loadPDF = async (pdfUrl: string) => {
    //   try {
    //     loadingInstance.value = ElLoading.service();
    //     const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    //     pdfInstance.value = pdf;
    //     totalPages.value = pdf.numPages;
    //     renderPage(currentPage.value);
    //   } catch (error) {
    //     console.error('Error loading PDF', error);
    //   } finally {
    //     loadingInstance.value?.close();
    //   }
    // };

    // const renderPage = async (pageNumber: number) => {
    //   try {
    //     const canvas = pdfViewer.value?.querySelector(`canvas[data-page-number="${pageNumber}"]`);
    //     if (!canvas) 
    //         return;
    //     const page = await pdfInstance.value?.getPage(pageNumber);
    //     const viewport = page?.getViewport({ scale: 1 });
    //     const context = canvas.getContext('2d');
    //     canvas.height = viewport?.height || 0;
    //     canvas.width = viewport?.width || 0;
    //     const renderContext = {
    //       canvasContext: context!,
    //       viewport: viewport!,
    //     };
    //     page?.render(renderContext);
    //   } catch (error) {
    //     console.error('Error rendering page', error);
    //   }
    // };

    // onMounted(() => {
    //   if (!pdfViewer.value) 
    //     return;
    //   loadPDF(path.value);
    // });
</script>