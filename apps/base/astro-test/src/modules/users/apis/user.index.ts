import { useQuery } from "@vigilio/preact-fetching";
/**
 * @api {get} /users List all users
 * @apiName ListUsers
 * @apiGroup User
 */
export function userIndexApi() {
	return useQuery("/users", async (url) => {
		const response = await fetch(`/api${url}`);
		const result = await response.json();
		return result;
	});
}
