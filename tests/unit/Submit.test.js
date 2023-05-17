import { mount } from '@vue/test-utils'
import SubmitRightCourseCard from "@/components/SubmitComponent/SubmitRightCourseCard.vue";
import {Assignment, Course} from "@/store/submit.ts";

test("SubmitRightCourseCard", async () => {
    const wrapper = mount(SubmitRightCourseCard, {
        props : {
            CourseData: new Course("CS101", [
                new Assignment("A1", new Date("2000-1-1 12:00:00"), null, new Date("2000-1-1 12:00:00"), null),
                new Assignment("A2", new Date("2000-1-1 12:00:00"), new Date("2000-1-2 12:00:00"), new Date("2000-1-1 12:00:00"), null),
            ], true)
        }
    })
    expect(wrapper.get('[data-test="course-name"]').text()).toBe("CS101")
    expect(wrapper.find({ref: 'down'}).exists()).toBe(true)
    const assignmentNameArray = wrapper.findAll('[data-test="assignment-name"]')
    expect(assignmentNameArray[0].text()).toBe("A1")
    expect(assignmentNameArray[1].text()).toBe("A2")

})