import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase-config";
import { useState } from "react";
import Layout from "../../components/Layout";
const Upload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const uploadFile = () => {
    if (!file) {
      setMessage("");
      setError("Select a file to upload");
      return;
    }

    const storageRef = ref(storage, "files/" + file.name);
    uploadBytes(storageRef, file).then((snapshot) => {
      setFile(null);
      setError("");
      setMessage("File upload successful!");
    });
  };

  return (
    <Layout>
      <div
        style={{ width: "100%" }}
        className="m-3 d-flex flex-column justify-content-center m-4"
      >
        <div style={{ width: "40%" }}>
          <div className="input-group mb-3">
            <input
              type="file"
              className="form-control"
              id="inputGroupFile04"
              aria-describedby="inputGroupFileAddon04"
              aria-label="Upload"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </div>
          <button
            className="btn btn-primary"
            type="button"
            id="inputGroupFileAddon04"
            onClick={uploadFile}
          >
            Upload
          </button>
          {message && <div className="text-success">{message}</div>}
          {error && <div className="text-danger">{error}</div>}
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
