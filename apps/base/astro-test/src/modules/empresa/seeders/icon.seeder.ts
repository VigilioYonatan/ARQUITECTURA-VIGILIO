import type { IconSchema } from "../schemas/icon.schema";

export function iconSeeder(): Omit<IconSchema, "id">[] {
    return [
        {
            name: "user",
            code: "ICON-0000001",
            // user_academic_id: 1,
            slug: "unlock",
            // user_academic_id: 1,
            photo: [],
        },
        {
            name: "users",
            code: "ICON-0000002",
            // user_academic_id: 1,
            slug: "unlock",
            // user_academic_id: 1,
            photo: [],
        },
        {
            name: "user_plus",
            code: "ICON-0000003",
            // user_academic_id: 1,
            slug: "unlock",
            // user_academic_id: 1,
            photo: [],
        },
        {
            name: "user_pen",
            code: "ICON-0000004",
            // user_academic_id: 1,
            slug: "unlock",
            // user_academic_id: 1,
            photo: [],
        },
        {
            name: "user_minus",
            code: "ICON-0000005",
            // user_academic_id: 1,
            slug: "unlock",
            // user_academic_id: 1,
            photo: [],
        },
        {
            name: "envelope",
            code: "ICON-0000006",
            // user_academic_id: 1,
            slug: "unlock",
            // user_academic_id: 1,
            photo: [],
        },
        {
            name: "phone",
            code: "ICON-0000007",
            // user_academic_id: 1,
            slug: "unlock",
            // user_academic_id: 1,
            photo: [],
        },
        {
            name: "lock",
            code: "ICON-0000008",
            // user_academic_id: 1,
            slug: "unlock",
            // user_academic_id: 1,
            photo: [],
        },
        {
            name: "unlock",
            code: "ICON-0000009",
            slug: "unlock",
            // user_academic_id: 1,
            photo: [],
        },
        {
            name: "house",
            code: "ICON-0000010",
            slug: "unlock",
            // user_academic_id: 1,
            photo: [],
        },
    ];
}
