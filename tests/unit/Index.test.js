import { mount } from '@vue/test-utils'
import OverviewMiddleCard from '@/components/OverviewRightComponent/OverviewMiddleCard.vue'
import OverViewMain from "@/components/OverviewRightComponent/OverViewMain.vue"
import OverViewRightCard from "@/components/OverviewRightComponent/OverViewRightCard.vue"
import {Card, ContainCard, ToDo, ToDoIdentity, TodoItem} from '@/store/todo'
import index from "@/view/Index.vue"
test('OverviewMiddleCard', async () => {
    const wrapper = mount(OverviewMiddleCard)
    await wrapper.setProps({
          CardList: [new Card("2077 Spring", [
            new ContainCard("CS101", "AA", "Student"),
            new ContainCard("CS102", "AAA", "SA"),
            new ContainCard("CS103", "AAAA", "SA"),
          ], true)]
        }
    )
    const todo = wrapper.get('[data-test="class"]')
    expect(todo.text()).toBe('2077 Spring')
    expect(wrapper.find({ref: 'down'}).exists()).toBe(true)
    const nameArray = wrapper.findAll('[data-test="name"]')
    expect(nameArray[0].text()).toBe("CS101")
    expect(nameArray[1].text()).toBe("CS102")
    expect(nameArray[2].text()).toBe("CS103")
    const desArray = wrapper.findAll('[data-test="description"]')
    expect(desArray[0].text()).toBe("AA")
    expect(desArray[1].text()).toBe("AAA")
    expect(desArray[2].text()).toBe("AAAA")


    await wrapper.setProps({
            CardList: [new Card("2077 Spring", [
                new ContainCard("CS101", "AA", "Student"),
                new ContainCard("CS102", "AAA", "SA"),
                new ContainCard("CS103", "AAAA", "SA"),
            ], false)]
        }
    )
    expect(wrapper.find({ref: 'down'}).exists()).toBe(false)

})

test('OverviewMain', async() =>{
    const wrapper = mount(OverViewMain)
    await wrapper.setProps({
            CardList: [new Card("2077 Spring", [
                new ContainCard("CS101", "AA", "Student"),
                new ContainCard("CS102", "AAA", "SA"),
                new ContainCard("CS103", "AAAA", "SA"),
            ], true)]
        }
    )
    const nameArray = wrapper.findAll('[data-test="name"]')
    expect(nameArray[0].text()).toBe("SA")
    expect(nameArray[1].text()).toBe("Student")
})

test('OverViewRightCard', async ()=>{
    const wrapper = mount(OverViewRightCard, {
        props:{
            Todo: new ToDo(ToDoIdentity.todoSa, [
                new TodoItem("CS111", new Date("2000-1-1 12:00:00")),
                new TodoItem("CS221", new Date("2000-1-1 12:11:11")),
            ])
        }
    })
    expect(wrapper.get('[data-test="title"]').text()).toBe("TODO LIST")
    const nameArray = wrapper.findAll('[data-test="name"]')
    expect(nameArray[0].text()).toBe("CS111")
    expect(nameArray[1].text()).toBe("CS221")
    const timeArray = wrapper.findAll('[data-test="time"]')
    expect(timeArray[0].text()).toBe("2000-01-01 12:00")
    expect(timeArray[1].text()).toBe("2000-01-01 12:11")
    const identifyArray = wrapper.findAll('[data-test="identify"]')
    expect(identifyArray[0].text()).toBe("submit")
    expect(identifyArray[1].text()).toBe("submit")
})

test('Index', async ()=>{
    const wrapper = mount(index)

})

