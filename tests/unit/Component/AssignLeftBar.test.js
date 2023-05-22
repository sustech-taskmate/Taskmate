import {mount} from '@vue/test-utils'
import Sider from "@/components/AssignLeftBar/Sider.vue"
import {PropType, ref} from "vue";
import {FileTreeNode} from "@/store/assign.ts";
import TreeMenu from "@/components/AssignLeftBar/TreeMenu.vue";
import {analyzeDir, downloadAll} from "@/composable/grade.ts";

function convertToMap(obj) {
    let map = new Map();
    let node = new FileTreeNode(obj.filename, obj.isDir, obj.isRoot, obj.url, obj.format);
    node.children = []
    obj.children?.forEach((child) => {
        node.children.push(convertToMap(child));
    });
    map.set(node.url, node);
    return map;
}

test('AssignLeftBar', async () => {
    const str = JSON.parse('{"filename":"a","isDir":true,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a","format":6,"children":[{"filename":"test","isDir":true,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test","format":6,"children":[{"filename":"test1","isDir":true,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test1","format":6,"children":[{"filename":"1111","isDir":true,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test1/1111","format":6,"children":[{"filename":"ping.py","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test1/1111/ping.py","format":4,"children":[]},{"filename":".gitignore","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test1/1111/.gitignore","format":7,"children":[]},{"filename":"Practice 4.md","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test1/1111/Practice 4.md","format":5,"children":[]},{"filename":"└δ╔óquiz2CP.md","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test1/1111/└δ╔óquiz2CP.md","format":5,"children":[]}]},{"filename":"Main.java","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test1/Main.java","format":4,"children":[]},{"filename":"analysis.py","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test1/analysis.py","format":4,"children":[]},{"filename":"▒¿╕µ─ú░σ.docx","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test1/▒¿╕µ─ú░σ.docx","format":3,"children":[]},{"filename":"Loader5Batch.java","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test1/Loader5Batch.java","format":4,"children":[]},{"filename":"Midterm Review.pdf","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test1/Midterm Review.pdf","format":0,"children":[]},{"filename":"Loader3Prepare.java","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test1/Loader3Prepare.java","format":4,"children":[]},{"filename":"Multimodal Intelligence ╖¡╥δ.pdf","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test1/Multimodal Intelligence ╖¡╥δ.pdf","format":0,"children":[]}]},{"filename":"test2","isDir":true,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test2","format":6,"children":[{"filename":"README.md","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test2/README.md","format":5,"children":[]},{"filename":"test1.mp4","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test2/test1.mp4","format":2,"children":[]},{"filename":"═╝╞¼1.png","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test2/═╝╞¼1.png","format":1,"children":[]},{"filename":"═╝╞¼2.png","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test2/═╝╞¼2.png","format":1,"children":[]},{"filename":"Assignment1.sql","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test2/Assignment1.sql","format":4,"children":[]}]},{"filename":"da.txt","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/da.txt","format":4,"children":[]},{"filename":"test1.png","isDir":false,"isRoot":false,"url":"C:/Users/50365/AppData/Roaming/cn.taskmate.edu//taskmate/1/student_file/a/test/test1.png","format":1,"children":[]}]}]}')
    const fileTreeMap = convertToMap(str);
    const MenuClick = jest.fn()
    const wrapper = mount(Sider, {
        props: {
            nodes: fileTreeMap,
            myCollapse: false
        },
        methods: {
            handleUpdateMenu: MenuClick
        }
    })
    expect(wrapper.vm).toBeTruthy()

    let nodeArray = wrapper.findAll('.node')
    expect(nodeArray.length).toBe(2)
    const mock = wrapper.findAll('el-menu-item').at(0)
    expect(mock).toBeTruthy()

    let wrap = mount(TreeMenu, {
        props: {
            nodes: fileTreeMap
        }
    })
    expect(wrap.vm).toBeTruthy()
    nodeArray = wrap.findAll('.node')
    expect(nodeArray.length).toBe(1)

})
