import index from "@/view/Index.vue"
import {mount} from "@vue/test-utils";
import {ClassesResponseData, Class} from "@/composable/serverRequest.ts";

test('Index', async () => {
    const wrapper = mount(index,
        {
            props: {
                tempClassList: [
                    {id: 4, name: "F", title: "FFF", role: 'assistant', semester: {id: 1, year: 2023, season: 'Spring'}}
                ]
            }
        })
    expect(wrapper).toBeTruthy()
    const t = wrapper.findAll('over-view-right-card')
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.m).toEqual(new Map ([
        ['Spring', 0],
        ['Summer', 1],
        ['Fall', 2],
        ['Winter', 3]
    ]))
    expect(wrapper.vm.SaTodo).toEqual([])
    expect(wrapper.vm.StudentTodo).toEqual([])
    expect(wrapper.vm.cardList).toEqual([
        {
            key: '2023 Spring',
            listContainCard: [
                {id: 4, name: 'F', title: 'FFF', role: 'assistant'}
            ],
            isOpen: false,
            isLoading: false,
            index: 0
        }
    ]);
    const temp = mount(index)
})