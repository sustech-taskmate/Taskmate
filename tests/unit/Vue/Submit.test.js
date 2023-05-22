import Submit from "@/view/Submit.vue"
import {mount} from "@vue/test-utils";

test('Submit', async ()=>{
    const wrapper = mount(Submit)

    expect(wrapper).toBeTruthy()
    const temp = wrapper.find('el-descriptions')
    const buttonArray = wrapper.findAll('button')
    expect(wrapper.exists()).toBe(true);

})