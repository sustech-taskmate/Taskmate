import {mount, shallowMount} from '@vue/test-utils'
import FileContent from "@/components/AssignContent/FileContent.vue";
import TabDetail from "@/components/AssignContent/Tab-detail.vue";


test('FileContent', async () => {

    const wrapper = shallowMount(FileContent, {
        props:{
            detail: 'b336e2ae1f3a2810500965b5cff600480b4082ba63ffe74d601ddd55d8dcfc3f99d5ee' +
                "f341d2c3d41e190f2162c00d8675fbb52ac6714e8d2eb95e29b0ba9f991eba89ff9104c7d360e" +
                "439f51c1fd491e9bbe99873c6f7f5d8695b6766bebba8e639b41eae4d99a195da033297fcb25993" +
                "ab2cabda47eaac944dae4db4b85813cbf0dfc927dcbde9931e778d023a124ab955ec21e50a9ce5e8b" +
                "0c003551f4b8fcc063232925b3df9ca8ca2595e0252373391e59c9869bf4b8f82967a1665eabe1"
        }
    })
    await wrapper.vm.$nextTick()
    const format = wrapper.vm.format;
    expect(format).toEqual(2)

})

test('Tab-detail', async () => {
    let wrapper = mount(TabDetail)
    wrapper.vm.tab = null
})
