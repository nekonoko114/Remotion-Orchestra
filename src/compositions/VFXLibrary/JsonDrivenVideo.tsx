import React from "react";
import { JsonVideoEngine } from "../../engines/JsonVideoEngine";
import scenarioData from "../../ai_scenario.json";

export const JsonDrivenVideo: React.FC = () => {
	return <JsonVideoEngine data={scenarioData} />;
};
