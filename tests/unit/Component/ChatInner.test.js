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
    let emoji = wrapper.find('.vac-svg-button')
    await emoji.trigger('click')
    expect(wrapper.vm.showEmoji).toBe(false);
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
    await text.trigger('paste', mockEvent)
    let files = wrapper.find('chat-inner-files')
    expect(files).toBeTruthy()
})
test('ChatInnerMessages', async () => {
    let wrapper = mount(ChatInnerMessages)
})

// describe('ChatInnerFooter', () => {
//     it('opens and closes emoji picker', async () => {
//         const wrapper = mount(ChatInnerFooter);
//         const emojiButton = wrapper.find('.vac-svg-button');
//
//         await emojiButton.trigger('click');
//         expect(wrapper.vm.showEmoji).toBe(false);
//
//         await emojiButton.trigger('click');
//         expect(wrapper.vm.showEmoji).toBe(false);
//     });
//
//     it('updates message when selecting emoji', async () => {
//         const wrapper = mount(ChatInnerFooter);
//         const emojiButton = wrapper.find('.vac-svg-button');
//         await emojiButton.trigger('click');
//
//         const emojiPicker = wrapper.findComponent({name: 'emoji-picker'});
//         // await emojiPicker.vm.$emit('select', {i: '😊'});
//         //
//         // expect(wrapper.vm.message).toBe('😊');
//     });
//
//     it('sends message on Ctrl+Enter', async () => {
//         const wrapper = mount(ChatInnerFooter);
//         const textInput = wrapper.find('.vac-textarea');
//         const sendButton = wrapper.findComponent({ref: 'temp'});
//
//         await textInput.setValue('Test message');
//         await textInput.trigger('keydown.ctrl.enter');
//
//         expect(wrapper.emitted('send-message')).toBeTruthy();
//         expect(wrapper.vm.message).toBe('');
//         expect(wrapper.vm.files).toEqual([]);
//     });
//
//     it('adds file on paste event', async () => {
//         const wrapper = mount(ChatInnerFooter);
//         const textInput = wrapper.find('.vac-textarea');
//
//         const mockEvent = {
//             clipboardData: {
//                 items: [
//                     {
//                         type: 'image/png',
//                         getAsFile: () => new Blob(['test'], {type: 'image/png'})
//                     }
//                 ]
//             },
//             preventDefault: jest.fn()
//         };
//
//         await textInput.trigger('paste', mockEvent);
//
//         expect(wrapper.vm.files).toHaveLength(0);
//         // expect(wrapper.emitted('change-size')).toBeTruthy();
//     });
// })