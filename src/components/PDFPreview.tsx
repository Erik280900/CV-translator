import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function PDFPreview({ fileUrl }: { fileUrl: string }) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div className="mt-6 border rounded bg-white text-black" style={{ height: "750px" }}>
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
}