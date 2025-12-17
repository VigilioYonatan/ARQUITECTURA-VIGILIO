import { Injectable } from "@nestjs/common";

@Injectable()
export class WebService {
	index() {
		return {
			title: "holo xxxxss2",
		};
	}
}
