import { AbsoluteFill, Img, staticFile } from "remotion";
import { HeatDistortion } from "../../components/effects/HeatDistortion";
import { FireBackground } from "./FireBackground";

export const OpeningBackground: React.FC = () => {
	return (
		<AbsoluteFill style={{ zIndex: -1 }}>
			<HeatDistortion intensity={10} frequency={0.005}>
				<AbsoluteFill style={{ overflow: "hidden" }}>
					<Img
						src={staticFile(
							"video-factory/images/generated/opening_luxury_fire.png",
						)}
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
							filter: "brightness(0.6) contrast(1.2)",
						}}
					/>
					<AbsoluteFill style={{ opacity: 0.9 }}>
						<FireBackground />
					</AbsoluteFill>
				</AbsoluteFill>
			</HeatDistortion>
		</AbsoluteFill>
	);
};
