import Layers from "./layers/Layers";
import ActiveImage from "./ActiveImage";
import UploadForm from "./upload/UploadForm";
import LoadingScreen from "./LoadingScreen";
import Toolbar from "./toolbar/Toolbar";

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
