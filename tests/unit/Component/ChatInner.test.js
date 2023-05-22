import {mount} from '@vue/test-utils'
import ChatInnerFooter from "@/components/ChatInner/ChatInnerFooter.vue";
import ChatInner from "@/components/ChatInner/ChatInner.vue";
import ChatInnerFile from "@/components/ChatInner/ChatInnerFile.vue";
import ChatInnerFiles from "@/components/ChatInner/ChatInnerFiles.vue";
import ChatInnerMessages from "@/components/ChatInner/ChatInnerMessages.vue";
test('ChatInner', async ()=>{
    let wrapper = mount(ChatInner)
})
test('ChatInnerFile', async ()=>{
    let wrapper = mount(ChatInnerFile)
})
test('ChatInnerFiles', async ()=>{
    let wrapper = mount(ChatInnerFiles)
})
test('ChatInnerFooter', async () => {
    let wrapper = mount(ChatInnerFooter)
    expect(wrapper).toBeTruthy()
    let emoji = wrapper.find('[class="vac-svg-button"]')
    await emoji.trigger('click')
    expect(wrapper.vm.showEmoji).toBe(true);
    expect(wrapper.emitted().click).toBeTruthy()
    await emoji.trigger('click')
    expect(wrapper.vm.showEmoji).toBe(false);
    let text = wrapper.find('.vac-textarea')
    await text.setValue("test")
    await text.trigger('keydown.ctrl.enter')
    let button = wrapper.find({ref:"temp"})
    expect(button).toBeTruthy()
    await button.find('.choose').trigger('click')
    expect(wrapper.emitted().click).toBeTruthy()
    const mockEvent = {
        clipboardData: {
            getData: () => 'test paste data'
        },
        preventDefault: jest.fn()
    }
})
test('ChatInnerMessages', async () => {
    let wrapper = mount(ChatInnerMessages)
})