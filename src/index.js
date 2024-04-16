
import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client';

import { FormEditor } from "@bpmn-io/form-js-editor";

import CustomFormFields from "./extension/render/index"
import CustomPropertiesProvider from "./extension/propertiesPanel/index"

const container = document.getElementById('app-root');
const root = createRoot(container);

import "@bpmn-io/form-js/dist/assets/form-js.css";
import "@bpmn-io/form-js/dist/assets/form-js-editor.css";

const schema = {
  "components": [
    {
      "type": "range",
    }
  ],
  "type": "default"
}


const App = () => {
  const container = useRef();
  useEffect(() => {
    const editor = new FormEditor({ additionalModules: [CustomFormFields, CustomPropertiesProvider] });
    editor.attachTo(container.current);
    editor.importSchema(schema);
    return () => editor.detach();
  }, [container]);

  return <div ref={container} />;
};

root.render(
  <App />
);