import { lazy, Suspense } from "preact/compat";
import { Route, Router, Switch } from "wouter-preact";
import DashboardLayout from "../_components/DashboardLayout";

function DashboardRouter() {
	return (
		<Router base="/dashboard">
			<DashboardLayout>
				<Suspense fallback={null}>
					<Switch>
						<Route path="/" component={lazy(() => import("../_index"))} />
						<Route>
							<span>404xs</span>
						</Route>
					</Switch>
				</Suspense>
			</DashboardLayout>
		</Router>
	);
}
export default DashboardRouter;
