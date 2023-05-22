import { mount } from '@vue/test-utils'
import AssignRightBar from "@/components/AssignRightBar/AssignRightBar.vue";
import Card from '@/components/AssignRightBar/Card.vue'

test('AssignRightBar', async ()=>{
    const temp = [{
            uuid: "2b2f2a96-2013-455e-83b9-ff69a591176e",
            title: 'M1',
            description: "This is scoring metric 1",
            max: 60
    }]

    const wrapper = mount(AssignRightBar, {
        props:{
            courseCode: 'FK233',
            assignmentName: 'test',
            finishedStudents: 0,
            allStudents: 30,
            totalPoints: 100,
            metrics: temp
        }
    })

    expect(wrapper).toBeTruthy()

})

test('Card', async ()=>{
    const temp = [{
        uuid: "2b2f2a96-2013-455e-83b9-ff69a591176e",
        title: 'M1',
        description: "This is scoring metric 1",
        max: 60
    }]
    const wrapper = mount(Card, {
        props:{
            metrics: temp
        }
    })
    const down = wrapper.find('[class="pull-down"]')
    await down.trigger('click')
    await down.trigger('click')
    const title = wrapper.find('[class="index-big"]')
    expect(title.text()).toEqual('1')
    const add = wrapper.find('[class="add"]')
    await add.trigger('click')
    expect(add).toBeTruthy()

    expect(wrapper.findAll('[class="sub-card-box active"]').length).toEqual(1)
    const leftDisplay = wrapper.find('[class="point-display"]')
    await leftDisplay.trigger('click')
    await wrapper.find({ref: 'fix'}).setValue(50)
    expect(leftDisplay.text()).toEqual("50")

    const popover = wrapper.find('[class="popover"]')
    await popover.trigger('click')
    expect(popover).toBeTruthy()
    const before = wrapper.find('[class="beforepopinput"]')
    await before.trigger('click')
    const popinput = wrapper.find('[class="popinput"]')
    expect(popinput).toBeTruthy()
    const content = wrapper.find('[class="description-big"]')

    const act = wrapper.find('[class="index-small"]')
    await act.trigger("click")
    const sign = wrapper.find('[class="sign"]')
    await sign.trigger('click')

    const subcomment = wrapper.find('[class="subtext-text"]')
    await subcomment.trigger('click')


    const Button = wrapper.find('[class="ElPopconfirm"]')
    await Button.trigger('confirm')

    const assignButton = wrapper.find('[class="con"]')

})