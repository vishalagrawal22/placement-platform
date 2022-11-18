import { storage } from "../../firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

const Resource = () => {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    const filesList = [];
    const listRef = ref(storage, "files");
    listAll(listRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          filesList.push(itemRef);
        });
        setFiles(filesList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleFileClick = (file) => {
    const fileRef = ref(storage, file.fullPath);
    getDownloadURL(fileRef)
      .then((url) => {
        window.open(url);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Layout>
      <div className="m-3">
        <h3>Resources</h3>
        {files.map((file, index) => {
          return (
            <div key={index}>
              <button
                className="btn btn-primary m-2"
                onClick={() => handleFileClick(file)}
              >
                {file.name}
              </button>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default Resource;
