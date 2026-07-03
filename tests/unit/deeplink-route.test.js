const {taskmateRouteFromUrl} = require("../../src/util/deeplink-route");

describe("taskmateRouteFromUrl", () => {
  test("routes LMS assignment, submission, and class links", () => {
    expect(taskmateRouteFromUrl("taskmate://lms/assignments/foo")).toEqual({
      name: "lmsAssignment",
      params: {id: "foo"},
    });
    expect(taskmateRouteFromUrl("taskmate://lms/submissions/bar")).toEqual({
      name: "lmsSubmission",
      params: {slug: "bar"},
    });
    expect(taskmateRouteFromUrl("taskmate://lms/classes/123")).toEqual({
      name: "lmsClass",
      params: {id: "123"},
    });
  });

  test("ignores non-LMS links", () => {
    expect(taskmateRouteFromUrl("taskmate://auth?token=x")).toBeNull();
    expect(taskmateRouteFromUrl("https://app.sustech.cloud/lms/classes/1")).toBeNull();
  });
});
