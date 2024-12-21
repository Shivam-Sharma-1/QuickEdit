import ActiveImage from "./ActiveImage";
import Layers from "./layers/Layers";
import LoadingScreen from "./LoadingScreen";
import Toolbar from "./toolbar/Toolbar";
import UploadForm from "./upload/UploadForm";

function Editor() {
  return (
    <div className="flex h-full">
      <LoadingScreen />
      <Toolbar />
      <UploadForm />
      <ActiveImage />
      <Layers />
    </div>
  );
}

export default Editor;
