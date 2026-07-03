import {expect, test} from "@playwright/test";

const homePayload = {
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
    {
      id: 43,
      slug: "ma101-2025-fall",
      name: "Calculus",
      code: "MA101",
      label: "MA101 Calculus",
      course: {id: 8, code: "MA101", name: "Calculus I"},
      semester: {year: 2025, season: "Fall"},
    },
  ],
  assignmentStats: {
    totalAssignments: 12,
    submissionsThisWeek: 5,
    pendingToGrade: 3,
    averageScore: 87.25,
  },
};

const classPayload = {
  id: 42,
  slug: "cs309-2026-spring",
  name: "OOAD",
  courseId: 7,
  semesterId: 1,
  course: {id: 7, code: "CS309", name: "Object-Oriented Analysis and Design"},
  semester: {year: 2026, season: "Spring"},
  users: [
    {id: "cu-1", role: "TEACHER", user: {id: "u-1", name: "Prof. Chen", email: "chen@sustech.edu.cn"}},
    {id: "cu-2", role: "STUDENT", user: {id: "u-2", name: "Hitomi", email: "hitomi@sustech.edu.cn"}},
  ],
  assignments: [
    {
      id: 9,
      name: "assignment-1",
      title: "Architecture Review",
      classId: 42,
      problemId: 3,
      publishedAt: "2026-03-01T00:00:00.000Z",
      startTime: "2026-03-01T00:00:00.000Z",
      endTime: "2026-03-08T12:00:00.000Z",
      createdAt: "2026-03-01T00:00:00.000Z",
      updatedAt: "2026-03-01T00:00:00.000Z",
    },
  ],
  activities: [
    {
      id: "activity-1",
      kind: "assignment",
      actorName: "Prof. Chen",
      targetName: "Architecture Review",
      createdAt: "2026-03-01T00:00:00.000Z",
    },
  ],
  deadlines: [
    {
      id: 9,
      title: "Architecture Review",
      slug: "architecture-review",
      endTime: "2026-03-08T12:00:00.000Z",
    },
  ],
  announcements: [
    {
      id: 88,
      title: "Midterm review released",
      createdAt: "2026-03-02T08:00:00.000Z",
      pinned: true,
    },
  ],
  discussions: [
    {
      id: "discussion-1",
      title: "How to structure the review?",
      authorName: "Prof. Chen",
      replyCount: 2,
      updatedAt: "2026-03-03T08:00:00.000Z",
    },
  ],
  resources: [
    {
      id: "resource-1",
      name: "rubric.pdf",
      type: "FILE",
      size: 4096,
    },
  ],
  learningPath: {
    modules: [
      {
        id: "module-1",
        title: "Architecture foundations",
        items: [{id: 501, title: "Read rubric", kind: "FILE", status: "available", completedAt: null, fileEntryId: "resource-1"}],
      },
    ],
    progress: {
      completedRequiredItems: 0,
      totalRequiredItems: 1,
      completionRate: 0,
    },
  },
  problems: [
    {
      id: 3,
      name: "problem-1",
      title: "Design Review Memo",
    },
  ],
};

const assignmentPayload = {
  id: 9,
  slug: "architecture-review",
  classId: 42,
  problemId: 3,
  problemIds: [3],
  name: "assignment-1",
  title: "Architecture Review",
  description: {},
  gradingStrategy: "manual",
  scoreAggregationPolicy: "sum",
  judgeAutoGradePolicy: "disabled",
  gradingGraph: {},
  gradingPlan: {},
  publishState: "PUBLISHED",
  createdAt: "2026-03-01T00:00:00.000Z",
  updatedAt: "2026-03-01T00:00:00.000Z",
  status: "open",
  class: {
    name: "OOAD",
    course: {name: "Object-Oriented Analysis and Design"},
  },
  problem: {
    id: 3,
    name: "problem-1",
    title: "Design Review Memo",
    description: {},
    submissionRequirements: [{id: "code", kind: "code", displayName: "源代码", required: true, filename: "answer.py"}],
    gradingPolicyKind: "manual",
  },
  problemItems: [
    {
      id: 1,
      assignmentId: 9,
      problemId: 3,
      position: 1,
      problem: {
        id: 3,
        name: "problem-1",
        title: "Design Review Memo",
        description: {},
        submissionRequirements: [{id: "code", kind: "code", displayName: "源代码", required: true, filename: "answer.py"}],
        gradingPolicyKind: "manual",
      },
    },
  ],
  submissions: [
    {
      id: 101,
      slug: "sub-101",
      assignmentId: 9,
      assignmentProblemItemId: 1,
      submitterId: "u-2",
      name: "first-submit",
      createdAt: "2026-03-05T12:00:00.000Z",
      currentAutoJudge: {
        phase: "completed",
        verdict: "Accepted",
        rawScore: 95,
        activityId: "judge-1",
        createdAt: "2026-03-05T12:05:00.000Z",
        countsTowardsAttempt: true,
      },
    },
  ],
  rubricSnapshot: null,
};

const assignmentWithoutWorkspacePayload = {
  ...assignmentPayload,
  problem: assignmentPayload.problem ? {...assignmentPayload.problem, submissionRequirements: []} : null,
  problemItems: assignmentPayload.problemItems.map((item) => ({
    ...item,
    problem: item.problem ? {...item.problem, submissionRequirements: []} : null,
  })),
};

const classSubmissionsPayload = {
  submissions: [
    {
      id: 201,
      slug: "submission-201",
      name: "review-memo.pdf",
      submitterId: "u-2",
      submitterName: "Hitomi",
      assignment: {
        id: 9,
        slug: "architecture-review",
        title: "Architecture Review",
        name: "Architecture Review",
        classId: 42,
      },
      statuses: ["pending"],
      createdAt: "2026-03-06T09:30:00.000Z",
    },
    {
      id: 202,
      slug: "submission-202",
      name: "second-submit",
      submitterId: "u-3",
      submitterName: "Alice",
      assignment: {
        id: 9,
        slug: "architecture-review",
        title: "Architecture Review",
        name: "Architecture Review",
        classId: 42,
      },
      statuses: ["graded"],
      createdAt: "2026-03-06T10:30:00.000Z",
    },
  ],
  availableStatuses: ["graded", "pending"],
  pagination: {
    page: 1,
    pageSize: 20,
    total: 2,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const submissionPayload = {
  id: 201,
  slug: "submission-201",
  createdAt: "2026-03-06T09:30:00.000Z",
  name: "review-memo.pdf",
  latestFileEntryId: "folder-1",
  assignmentProblemItem: {
    id: 1,
    position: 1,
    problemId: 3,
  },
  assignment: {
    id: 9,
    slug: "architecture-review",
    title: "Architecture Review",
    gradingStrategy: "manual",
    scoreAggregationPolicy: "sum",
    judgeAutoGradePolicy: "disabled",
    rubricSnapshot: null,
  },
  problem: {
    id: 3,
    name: "problem-1",
    title: "Design Review Memo",
    description: "{}",
    submissionRequirements: [],
    start: "2026-03-01T00:00:00.000Z",
    end: "2026-03-08T12:00:00.000Z",
    class: {
      id: 42,
      name: "OOAD",
      slug: "cs309-2026-spring",
      course: {name: "Object-Oriented Analysis and Design"},
    },
  },
  submitter: {
    id: "u-2",
    name: "Hitomi",
    email: "hitomi@sustech.edu.cn",
    sustechId: "12345678",
  },
  currentGrade: {
    draft: {points: 92, releasedAt: null},
    released: null,
  },
  currentAutoJudge: {
    phase: "COMPLETED",
    verdict: "Accepted",
    rawScore: 95,
  },
  submissionContent: {},
  submissionFiles: [],
  discussions: [],
  activities: [],
  feedbacks: [
    {
      id: "grade-1",
      score: 92,
      reason: "Clear review structure",
      releasedAt: null,
      creator: {name: "Prof. Chen"},
    },
  ],
  fileEntries: [
    {
      id: "file-1",
      name: "review-memo.pdf",
      type: "FILE",
      size: 2048,
    },
  ],
};

const discussionPayload = {
  id: "discussion-1",
  classId: 42,
  title: "How to structure the review?",
  createdAt: "2026-03-03T08:00:00.000Z",
  updatedAt: "2026-03-03T08:20:00.000Z",
  author: {
    id: "u-1",
    name: "Prof. Chen",
    email: "chen@sustech.edu.cn",
    image: null,
  },
  posts: [
    {
      id: "post-1",
      body: "Start from domain boundaries, then explain tradeoffs.",
      createdAt: "2026-03-03T08:00:00.000Z",
      updatedAt: "2026-03-03T08:00:00.000Z",
      author: {
        id: "u-1",
        name: "Prof. Chen",
        email: "chen@sustech.edu.cn",
        image: null,
      },
    },
  ],
};

test("shows the authorization waiting state without a token", async ({page}) => {
  await page.goto("/");

  await expect(page.getByTestId("auth-empty")).toBeVisible();
  await expect(page.getByRole("heading", {name: "等待授权"})).toBeVisible();
});

test("renders LMS-backed home, class detail, and assignment detail", async ({page}) => {
  let submissionCreateCount = 0;

  await page.route("**/api/internal/app/home", async (route) => {
    const headers = {
      "access-control-allow-headers": "authorization, content-type",
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-origin": "*",
      "content-type": "application/json",
    };

    if (route.request().method() === "OPTIONS") {
      await route.fulfill({status: 204, headers});
      return;
    }

    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    await route.fulfill({
      status: 200,
      headers,
      body: JSON.stringify(homePayload),
    });
  });

  await page.route("**/api/internal/app/classes/42", async (route) => {
    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(classPayload),
    });
  });

  await page.route("**/api/internal/app/classes/42/submissions", async (route) => {
    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(classSubmissionsPayload),
    });
  });

  await page.route("**/api/internal/app/resources/resource-1", async (route) => {
    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify({url: "https://download.example.test/rubric.pdf"}),
    });
  });

  await page.route("**/api/internal/app/resources/file-1", async (route) => {
    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify({url: "https://download.example.test/review-memo.pdf"}),
    });
  });

  await page.route("**/api/internal/app/discussions/discussion-1", async (route) => {
    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(discussionPayload),
    });
  });

  await page.route("**/api/internal/app/discussions/discussion-1/posts", async (route) => {
    const headers = {
      "access-control-allow-headers": "authorization, content-type",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-origin": "*",
      "content-type": "application/json",
    };

    if (route.request().method() === "OPTIONS") {
      await route.fulfill({status: 204, headers});
      return;
    }

    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    expect(route.request().postDataJSON()).toEqual({body: "I will compare module ownership first."});
    await route.fulfill({
      status: 201,
      headers,
      body: JSON.stringify({id: "post-2"}),
    });
  });

  await page.route("**/api/internal/app/classes/42/discussions", async (route) => {
    const headers = {
      "access-control-allow-headers": "authorization, content-type",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-origin": "*",
      "content-type": "application/json",
    };

    if (route.request().method() === "OPTIONS") {
      await route.fulfill({status: 204, headers});
      return;
    }

    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    expect(route.request().postDataJSON()).toEqual({
      title: "Can I submit a diagram?",
      body: "I want to attach a component diagram with the memo.",
    });
    await route.fulfill({
      status: 201,
      headers,
      body: JSON.stringify({id: "discussion-2"}),
    });
  });

  await page.route("**/api/internal/app/discussions/discussion-2", async (route) => {
    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...discussionPayload,
        id: "discussion-2",
        title: "Can I submit a diagram?",
        posts: [
          {
            id: "post-3",
            body: "I want to attach a component diagram with the memo.",
            createdAt: "2026-03-03T09:00:00.000Z",
            updatedAt: "2026-03-03T09:00:00.000Z",
            author: {id: "u-2", name: "Hitomi", email: "hitomi@sustech.edu.cn", image: null},
          },
        ],
      }),
    });
  });

  await page.route("**/api/internal/app/learning-items/501/completion", async (route) => {
    const headers = {
      "access-control-allow-headers": "authorization, content-type",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-origin": "*",
      "content-type": "application/json",
    };

    if (route.request().method() === "OPTIONS") {
      await route.fulfill({status: 204, headers});
      return;
    }

    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    expect(route.request().postDataJSON()).toEqual({completed: true});
    await route.fulfill({
      status: 200,
      headers,
      body: JSON.stringify({itemId: 501, completedAt: "2026-03-03T09:00:00.000Z"}),
    });
  });

  await page.route("**/api/internal/app/assignments/9", async (route) => {
    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(assignmentPayload),
    });
  });

  await page.route("**/api/internal/app/submissions/submission-201", async (route) => {
    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(submissionPayload),
    });
  });

  await page.route("**/api/internal/app/submissions/sub-101", async (route) => {
    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify({...submissionPayload, id: 101, slug: "sub-101", name: "first-submit"}),
    });
  });

  await page.route("**/api/internal/app/submissions/submission-102", async (route) => {
    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify({...submissionPayload, id: 102, slug: "submission-102", name: "Architecture Review desktop submission"}),
    });
  });

  await page.route("**/api/internal/app/submissions/submission-103", async (route) => {
    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify({...submissionPayload, id: 103, slug: "submission-103", name: "Architecture Review desktop submission"}),
    });
  });

  await page.route("**/api/internal/app/assignments/9/submission-file-upload", async (route) => {
    const headers = {
      "access-control-allow-headers": "authorization, content-type",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-origin": "*",
      "content-type": "application/json",
    };

    if (route.request().method() === "OPTIONS") {
      await route.fulfill({status: 204, headers});
      return;
    }

    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    const body = route.request().postDataJSON();
    expect(body).toEqual(
      body.filename === "answer.py"
        ? {filename: "answer.py", size: 0}
        : {filename: "answer.txt", size: 12},
    );
    await route.fulfill({
      status: 201,
      headers,
      body: JSON.stringify({
        folderId: "folder-1",
        fileEntryId: "file-1",
        uploadUrl: "https://upload.example.test/",
        token: "upload-token",
        key: `uploads/${body.filename}`,
      }),
    });
  });

  await page.route("https://upload.example.test/", async (route) => {
    expect(route.request().method()).toBe("POST");
    expect(route.request().headers()["content-type"]).toContain("multipart/form-data");
    await route.fulfill({
      status: 200,
      headers: {"access-control-allow-origin": "*"},
      body: JSON.stringify({key: "uploads/answer.txt"}),
    });
  });

  await page.route("**/api/internal/app/assignments/9/submissions", async (route) => {
    const headers = {
      "access-control-allow-headers": "authorization, content-type",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-origin": "*",
      "content-type": "application/json",
    };

    if (route.request().method() === "OPTIONS") {
      await route.fulfill({status: 204, headers});
      return;
    }

    expect(route.request().headers().authorization).toBe("Bearer e2e-token");
    expect(route.request().postDataJSON()).toEqual({
      assignmentProblemItemId: 1,
      name: "Architecture Review desktop submission",
      fileEntryId: "folder-1",
      content: {},
      files: [],
    });
    submissionCreateCount += 1;
    await route.fulfill({
      status: 201,
      headers,
      body: JSON.stringify({slug: submissionCreateCount === 1 ? "submission-102" : "submission-103"}),
    });
  });

  await page.addInitScript(() => {
    window.localStorage.setItem("token", "e2e-token");
    window.open = (url) => {
      window.localStorage.setItem("opened-resource-url", String(url));
      return null;
    };
  });

  await page.goto("/");

  await expect(page.getByTestId("lms-home")).toBeVisible();
  await expect(page.getByRole("heading", {name: "Hitomi 的课程工作台"})).toBeVisible();
  await expect(page.getByText("12")).toBeVisible();
  await expect(page.getByText("87.3")).toBeVisible();
  await expect(page.getByTestId("class-card")).toHaveCount(2);
  await expect(page.getByText("Object-Oriented Analysis and Design")).toBeVisible();
  await expect(page.getByText("Calculus I")).toBeVisible();

  await page.getByTestId("class-card").filter({hasText: "CS309"}).click();

  await expect(page.getByTestId("lms-class")).toBeVisible();
  await expect(page.getByRole("heading", {name: "OOAD"})).toBeVisible();
  await expect(page.getByText("Architecture Review").first()).toBeVisible();
  await expect(page.getByText("Prof. Chen").first()).toBeVisible();
  await expect(page.getByTestId("class-submissions")).toBeVisible();
  await expect(page.getByText("Hitomi")).toBeVisible();
  await expect(page.getByText(/pending/)).toBeVisible();
  await expect(page.getByTestId("class-announcements")).toContainText("Midterm review released");
  await expect(page.getByTestId("class-resources")).toContainText("rubric.pdf");
  await expect(page.getByTestId("class-discussions")).toContainText("How to structure the review?");
  await expect(page.getByTestId("class-learning-path")).toContainText("Architecture foundations");
  await expect(page.getByTestId("class-learning-path")).toContainText("Read rubric");
  await expect(page.getByTestId("class-problems")).toContainText("Design Review Memo");
  await page.getByLabel("打开 Read rubric").click();
  await expect(page.getByTestId("learning-success")).toHaveText("已打开 Read rubric");
  await expect(page.evaluate(() => window.localStorage.getItem("opened-resource-url"))).resolves.toBe(
    "https://download.example.test/rubric.pdf",
  );
  await page.getByRole("button", {name: "标记完成"}).click();
  await expect(page.getByTestId("learning-success")).toHaveText("已标记完成");
  await expect(page.getByRole("button", {name: "已完成"})).toBeVisible();
  await page.getByRole("button", {name: /rubric.pdf/}).click();
  await expect(page.getByTestId("resource-success")).toHaveText("已打开 rubric.pdf");
  await expect(page.evaluate(() => window.localStorage.getItem("opened-resource-url"))).resolves.toBe(
    "https://download.example.test/rubric.pdf",
  );

  await page.getByLabel("讨论标题").fill("Can I submit a diagram?");
  await page.getByLabel("讨论正文").fill("I want to attach a component diagram with the memo.");
  await page.getByRole("button", {name: "发起讨论"}).click();
  await expect(page.getByTestId("lms-discussion")).toBeVisible();
  await expect(page.getByRole("heading", {name: "Can I submit a diagram?"})).toBeVisible();
  await expect(page.getByText("I want to attach a component diagram")).toBeVisible();
  await page.getByRole("button", {name: "返回"}).click();
  await expect(page.getByTestId("lms-class")).toBeVisible();

  await page.getByRole("button", {name: /How to structure the review/}).click();
  await expect(page.getByTestId("lms-discussion")).toBeVisible();
  await expect(page.getByRole("heading", {name: "How to structure the review?"})).toBeVisible();
  await expect(page.getByText("Start from domain boundaries")).toBeVisible();
  await page.getByLabel("回复").fill("I will compare module ownership first.");
  await page.getByRole("button", {name: "发送回复"}).click();
  await expect(page.getByTestId("discussion-success")).toHaveText("已发送回复");
  await expect(page.getByText("I will compare module ownership first.")).toBeVisible();
  await page.getByRole("button", {name: "返回"}).click();
  await expect(page.getByTestId("lms-class")).toBeVisible();

  await page.getByRole("button", {name: /Hitomi/}).click();

  await expect(page.getByTestId("lms-submission")).toBeVisible();
  await expect(page.getByRole("heading", {name: "Architecture Review"})).toBeVisible();
  await expect(page.getByText("review-memo.pdf").first()).toBeVisible();
  await expect(page.getByText("Clear review structure")).toBeVisible();
  await page.getByRole("button", {name: /review-memo.pdf/}).click();
  await expect(page.getByTestId("submission-file-success")).toHaveText("已打开 review-memo.pdf");
  await expect(page.evaluate(() => window.localStorage.getItem("opened-resource-url"))).resolves.toBe(
    "https://download.example.test/review-memo.pdf",
  );
  await expect(page.getByRole("button", {name: "保存评分"})).toHaveCount(0);

  await page.getByRole("button", {name: "返回"}).click();
  await expect(page.getByTestId("lms-class")).toBeVisible();

  await page.getByRole("button", {name: /assignment-1/}).click();

  await expect(page.getByTestId("lms-assignment")).toBeVisible();
  await expect(page.getByRole("heading", {name: "Architecture Review"})).toBeVisible();
  await expect(page.getByText("Design Review Memo")).toBeVisible();
  await expect(page.getByText("Accepted")).toBeVisible();
  await page.getByRole("button", {name: /first-submit/}).click();
  await expect(page.getByTestId("lms-submission")).toBeVisible();
  await expect(page.getByText("first-submit")).toBeVisible();
  await page.getByRole("button", {name: "返回"}).click();
  await expect(page.getByTestId("lms-class")).toBeVisible();
  await page.getByRole("button", {name: /assignment-1/}).click();
  await expect(page.getByTestId("lms-assignment")).toBeVisible();

  await page.evaluate(() => {
    const files = new Map();
    Object.defineProperty(window, "isTauri", {value: true});
    (window as any).__TAURI_INTERNALS__ = {
      invoke: async (cmd: string, args: any, options: any) => {
        if (cmd === "plugin:path|resolve_directory") return "/tmp/taskmate-e2e";
        if (cmd === "plugin:path|join") return args.paths.join("/");
        if (cmd === "plugin:fs|mkdir") return null;
        if (cmd === "plugin:fs|exists") return files.has(args.path);
        if (cmd === "plugin:fs|write_text_file") {
          files.set(decodeURIComponent(options.headers.path), Array.from(args));
          return null;
        }
        if (cmd === "plugin:fs|read_file") {
          const data = files.get(args.path) ?? [];
          delete (window as any).__TAURI_INTERNALS__;
          return data;
        }
        throw new Error(`Unhandled Tauri command: ${cmd}`);
      },
      convertFileSrc: (path: string) => path,
    };
  });
  await expect(page.getByTestId("assignment-workspace")).toContainText("目标文件：answer.py");
  await page.getByRole("button", {name: "创建 Workspace"}).click();
  await expect(page.getByTestId("workspace-path")).toContainText("/tmp/taskmate-e2e/workspaces/assignment-9/problem-1/answer.py");
  await expect(page.getByTestId("workspace-success")).toHaveText("Workspace 已创建：answer.py");
  await page.getByRole("button", {name: "提交 Workspace"}).click();
  await expect(page.getByTestId("lms-submission")).toBeVisible();
  await expect(page.getByText("Architecture Review desktop submission")).toBeVisible();
  await page.getByRole("button", {name: "返回"}).click();
  await expect(page.getByTestId("lms-class")).toBeVisible();
  await page.getByRole("button", {name: /assignment-1/}).click();
  await expect(page.getByTestId("lms-assignment")).toBeVisible();

  await page.getByTestId("submission-file").setInputFiles({
    name: "answer.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("hello answer"),
  });
  await page.getByRole("button", {name: "提交作业"}).click();

  await expect(page.getByTestId("lms-submission")).toBeVisible();
  await expect(page.getByText("Architecture Review desktop submission")).toBeVisible();
});

test("disables workspace actions when an assignment has no file-like requirement", async ({page}) => {
  await page.route("**/api/internal/app/home", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(homePayload),
    });
  });
  await page.route("**/api/internal/app/classes/42", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(classPayload),
    });
  });
  await page.route("**/api/internal/app/classes/42/submissions", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(classSubmissionsPayload),
    });
  });
  await page.route("**/api/internal/app/assignments/9", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(assignmentWithoutWorkspacePayload),
    });
  });
  await page.addInitScript(() => {
    window.localStorage.setItem("token", "e2e-token");
  });

  await page.goto("/");
  await page.getByTestId("class-card").filter({hasText: "CS309"}).click();
  await page.getByRole("button", {name: /assignment-1/}).click();

  await expect(page.getByTestId("assignment-workspace")).toContainText("当前题目没有可用提交要求。");
  await expect(page.getByRole("button", {name: "创建 Workspace"})).toBeDisabled();
  await expect(page.getByRole("button", {name: "提交 Workspace"})).toBeDisabled();
  await expect(page.getByRole("button", {name: "提交作业"})).toBeDisabled();
});
