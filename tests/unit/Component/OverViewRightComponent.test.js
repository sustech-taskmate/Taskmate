import {mount, shallowMount} from '@vue/test-utils'
import OverviewMiddleCard from '@/components/OverviewRightComponent/OverviewMiddleCard.vue'
import OverViewMain from "@/components/OverviewRightComponent/OverViewMain.vue"
import OverViewRightCard from "@/components/OverviewRightComponent/OverViewRightCard.vue"
import {Card, ClassUserRole, ContainCard, ToDo, ToDoIdentity, TodoItem} from '@/store/todo.ts'

test('OverviewMiddleCard', async () => {
    const wrapper = mount(OverviewMiddleCard,
        {
            props: {
                cardList: [new Card("2023 Fall", [
                    new ContainCard(6, "FK450", "AA", ClassUserRole.STUDENT),
                    new ContainCard(7, "FK451", "AA", ClassUserRole.STUDENT),
                    new ContainCard(8, "FK452", "AA", ClassUserRole.STUDENT),
                ], true, false, 8094)],
                filters: [true, true, true]
            }
        })
    await wrapper.setProps({
        cardList: [new Card("2023 Fall", [
            new ContainCard(6, "FK450", "AA", ClassUserRole.STUDENT),
            new ContainCard(7, "FK451", "AA", ClassUserRole.STUDENT),
            new ContainCard(8, "FK452", "AA", ClassUserRole.STUDENT),
        ], true, true, 8094)],
        filters: [true, true, true]
    })
    expect(wrapper).toBeTruthy()

    // const todo = wrapper.find('[ref="class"]')
    // expect(todo.text()).toBe('2023 Fall')
    // expect(wrapper.find({ref: 'down'}).exists()).toBe(true)
    // const nameArray = wrapper.findAll('[data-test="name"]')
    // expect(nameArray[0].text()).toBe("FK450")
    // const desArray = wrapper.findAll('[data-test="description"]')
    // expect(desArray[0].text()).toBe("AA")

})

test('OverviewMain', async () => {
    const wrapper = mount(OverViewMain,
        {
            props: {
                cardList: [new Card("2023 Fall", [
                    new ContainCard(6, "FK450", "AA", "student"),
                    new ContainCard(7, "FK451", "AA", "student"),
                    new ContainCard(8, "FK452", "AA", "student"),
                ], true, true, 8094)],
            }
        })
    const nameArray = wrapper.findAll('[data-test="name"]')
    expect(nameArray[0].text()).toBe("SA")
    expect(nameArray[1].text()).toBe("Teacher")
})

test('OverViewRightCard', async () => {
    const wrapper = mount(OverViewRightCard, {
        props: {
            Todo: new ToDo(ToDoIdentity.todoSa, [
                new TodoItem("test", new Date("2000-1-1 12:00:00"), 4, "Test"),
                new TodoItem("CS221", new Date("2000-1-1 12:11:11"), 8, "Test2"),
            ])
        }
    })
    expect(wrapper.get('[data-test="title"]').text()).toBe("TODO LIST")
    const nameArray = wrapper.findAll('[data-test="name"]')
    expect(nameArray[0].text()).toBe("test")
    expect(nameArray[1].text()).toBe("CS221")
    const timeArray = wrapper.findAll('[data-test="time"]')
    expect(timeArray[0].text()).toBe("2000-01-01 12:00")
    expect(timeArray[1].text()).toBe("2000-01-01 12:11")
    const identifyArray = wrapper.findAll('[data-test="identify"]')
    expect(identifyArray[0].text()).toBe("submit")
    expect(identifyArray[1].text()).toBe("submit")
})


