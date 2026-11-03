# Product Requirements Document (PRD): `The Quest Board`

[Back to the Project 03 guide](../README.md)

**Team:** `Group 3` · **Repo:** `https://github.com/CST438-P3-G3/the_quest_board` · **Last updated:** `11-01-2026`

---

## 1. Users

- **Primary user:** `A parent or guardian setting up a task list for family members.`

## 2. Problem

Parents and guardians can struggle to get their family member to contribute evenly to household tasks. Since each member may not always be home at the same time, some tasks can be forgotten and it can be hard to see who contributed to the task. 

`<problem statement>`


## 3. Success measures

Three measurable signals that would show the product works. Each one needs a number and a way to check it.


| # | Measure | Target | How we check it |
|---|---|---|---|
| S1 | `Complete a task and see its points on the leaderboard` | `100% of the vertical slice checks pass` | `Playwright on web and a checklist on an Android emulator` |
| S2 | `Award the correct points to the person who completes a task` | `100% of task completion test cases pass` | `Automated tests check the selected point value is added once` |
| S3 | `Complete the core flow without it getting stuck` | `3/3 scripted walkthroughs finish in under x amount of time` | `Time three team walkthroughs where the user joins a household, completes a task, and views the leaderboard` |


## 4. Scope: MVP, vertical slice, and not building


- **MVP stories:** `PRD-1 through PRD-4 below. This includes GitHub and Google sign-in, profile updates, account deletion  household setup, task management, points, and the leaderboard.`
- **Vertical slice:** `PRD-4 complete an available task and see its point value added to the members household leaderboard.`
- **Not building (this term):** `A calendar app or the calendar integration. Repeating tasks and resetting household scores.`

## 5. User stories and acceptance criteria

One row per MVP story. Each GitHub issue links to its story ID (`PRD-3`) and each story has at
least one acceptance criterion in **Given / When / Then** form that someone outside the team could
test.

| ID | Story | Acceptance criteria |
|---|---|---|
| PRD-1 | As a `family member`, I want to `sign in and manage my account` so that `I can use the app`. | **Given** `I use GitHub or Google sign in`, **when** `sign in succeeds`, **then** `I can access my account, update my profile, or delete my account`. |
| PRD-2 | As a `family member`, I want to `create or join a household` so we `can manage tasks together`. | **Given** `I’m signed in, when I create a household or search for and select one, then I become its member and I can also skip setup and join later. Each user can belong to one household`. |
| PRD-3 | As a `household member`, I want to `create and manage tasks` so that `household work is visable`. | **Given** `I create a task with a name and description, when I save it, then it appears for the household with its chosen point value and optional due date, location, and assignee. Any member can edit or delete tasks and an assignee can unassign themselves`. |
| PRD-4 | As a `household membner`, I want to `complete available tasks and see my points on the leaderbaord` so `my contribution is visable`. | **Given** `a task is unassigned or assigned to me, when I mark it complete, then I receive its point value once and the leaderboard updates. Only the assignee can complete an assigned task and any household member can complete an unassigned task.` |

---

### Change log

| Date | PR | What changed and why |
|---|---|---|
| `11-1-2026` | `#2` | Initial version |