import {flushPromises, mount} from "@vue/test-utils";
import Index from "@/view/Index.vue";
import {getLmsHome} from "@/composable/serverRequest";

jest.mock("@/composable/serverRequest", () => ({
    getLmsHome: jest.fn(),
}));

jest.mock("vue-router", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

test("Index renders LMS home data", async () => {
    getLmsHome.mockResolvedValue({
        user: {
            id: "user-1",
            name: "Hitomi",
            email: "hitomi@sustech.edu.cn",
            image: null,
        },
        classes: [
            {
                id: 42,
                slug: "cs309-2026-spring",
                name: "OOAD",
                code: "CS309",
                label: "CS309 OOAD",
                course: {id: 7, code: "CS309", name: "Object-Oriented Analysis and Design"},
                semester: {year: 2026, season: "Spring"},
            },
        ],
        assignmentStats: {
            totalAssignments: 12,
            submissionsThisWeek: 5,
            pendingToGrade: 3,
            averageScore: 87.25,
        },
    });

    const wrapper = mount(Index);
    await flushPromises();

    expect(wrapper.get('[data-testid="lms-home"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Hitomi 的课程工作台");
    expect(wrapper.text()).toContain("12");
    expect(wrapper.text()).toContain("87.3");
    expect(wrapper.text()).toContain("Object-Oriented Analysis and Design");
});
