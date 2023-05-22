import { mount } from '@vue/test-utils'
import SubmitRightCourseCard from "@/components/SubmitComponent/SubmitRightCourseCard.vue";
import {Assignment, Course} from "@/store/submit.ts";

test("SubmitRightCourseCard", async () => {
    let wrapper = mount(SubmitRightCourseCard, {
        props : {
            CourseData: new Course("CS101", [
                new Assignment("A1", new Date("2000-1-1 12:00:00"), null, new Date("2000-1-1 12:00:00"), null),
                new Assignment("A2", new Date("2000-1-1 12:00:00"), new Date("2000-1-2 12:00:00"), new Date("2000-1-1 12:00:00"), null),
            ], true)
        }
    })
    const c = wrapper.find('svg')
    expect(c.exists()).toBe(true)
    expect(wrapper.vm.CourseData.down).toBe(true);
    wrapper.vm.rotate(wrapper.vm.CourseData);
    expect(wrapper.vm.CourseData.down).toBe(false);
    wrapper = mount(SubmitRightCourseCard, {
        props : {
            CourseData: new Course("CS101", [
                new Assignment("A1", new Date("2000-1-1 12:00:00"), null, new Date("2000-1-1 12:00:00"), null),
                new Assignment("A2", new Date("2000-1-1 12:00:00"), new Date("2000-1-2 12:00:00"), new Date("2000-1-1 12:00:00"), null),
            ], true)
        }
    })
    await wrapper.find('.downList').trigger('click');
    expect(wrapper.find({ ref: 'down' }).exists()).toBe(true);
    expect(wrapper.get('[data-test="course-name"]').text()).toBe("CS101")
    expect(wrapper.find({ref: 'down'}).exists()).toBe(true)
    const assignmentNameArray = wrapper.findAll('[data-test="assignment-name"]')
    expect(assignmentNameArray[0].text()).toBe("A1")
    expect(assignmentNameArray[1].text()).toBe("A2")
    await wrapper.setProps({
        CourseData: new Course("CS101", [
            new Assignment("A1", new Date("2000-1-1 12:00:00"), null, new Date("2000-1-1 12:00:00"), null),
            new Assignment("A2", new Date("2000-1-1 12:00:00"), new Date("2000-1-2 12:00:00"), new Date("2000-1-1 12:00:00"), null),
        ], false)
    })
    expect(wrapper.find({ref: 'down'}).exists()).toBe(false)

    const wrap = mount(SubmitRightCourseCard, {
        props: {
            CourseData: new Course("CS101", [], false)
        }
    });
    expect(wrap.find({ ref: 'down' }).exists()).toBe(false);
    await wrap.setProps({
        CourseData: new Course("CS101", [], true)
    });
    expect(wrap.find({ ref: 'down' }).exists()).toBe(true);


    wrapper = mount(SubmitRightCourseCard, {
        props: {
            CourseData: new Course("CS101", [
                new Assignment("A1", new Date("2000-1-1 12:00:00"), null, new Date("2000-1-1 12:00:00"), null),
                new Assignment("A2", new Date("2000-1-1 12:00:00"), new Date("2000-1-2 12:00:00"), new Date("2000-1-1 12:00:00"), null),
            ], false)
        }
    });
    const svgElement = wrapper.find('svg');
    expect(svgElement.classes()).not.toContain('active');
    await svgElement.trigger('click');
    expect(svgElement.classes()).toContain('active');
    await svgElement.trigger('click');
    expect(svgElement.classes()).not.toContain('active');
})