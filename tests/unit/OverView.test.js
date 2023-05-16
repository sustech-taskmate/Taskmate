// const {mount} = require('@vue/test-utils')
import { mount } from '@vue/test-utils'
import OverviewMiddleCard from '@/components/OverviewRightComponent/OverviewMiddleCard.vue'
// const {OverviewMiddleCard} = require('@/components/OverviewRightComponent/OverviewMiddleCard.vue')
// const {Card, ContainCard} = require("@/store/todo")
import {Card, ContainCard} from '@/store/todo'

test('renders a todo', async () => {
  const wrapper = mount(OverviewMiddleCard)
  await wrapper.setProps({
        CardList: [new Card("2077 Spring", [
          new ContainCard("CS101", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "Student"),
          new ContainCard("CS101", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "SA"),
          new ContainCard("CS101", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "SA"),
        ], true)]
      }
  )
  const todo = wrapper.get('[data-test="description"]')
  expect(todo.text()).toBe('2077 Spring')
})

